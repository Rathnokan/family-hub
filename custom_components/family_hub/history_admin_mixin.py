"""Family Hub - HistoryAdminMixin (extracted from data_store.py, v0.7.0 P4).

Activity log + task corrections (excuse/reject/mark-complete) + force-tick/rebuild.
Mixed into FamilyHubDataStore; all methods operate on self (no behaviour change).
"""

from __future__ import annotations

import asyncio
import calendar
import json
import logging
import math
import os
import shutil
import uuid
from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    ACTIVE_STATUSES,
    CATEGORY_ASSIGNED,
    CATEGORY_CLAIMABLE,
    CATEGORY_MAINTENANCE,
    CATEGORY_ONE_TIME,
    CATEGORY_PERSONAL_REMINDER,
    CHORE_TYPE_ASSIGNED,
    CHORE_TYPE_CLAIMABLE,
    CHORE_TYPE_REMINDER,
    CLAIMABLE_SUBTYPE_FCFS,
    CLAIMABLE_SUBTYPE_MULTI,
    MULTI_CLAIM_POINTS_FULL,
    MULTI_CLAIM_POINTS_SPLIT,
    CONF_PENALTIES_PAUSED_GLOBAL,
    CONF_SHOW_DOLLAR_VALUE_TO_KIDS,
    DEFAULT_PENALTIES_PAUSED_GLOBAL,
    DEFAULT_PENALTIES_PAUSED_PERSON,
    DEFAULT_CATEGORY_LABELS,
    DEFAULT_FAMILY_NAME,
    DEFAULT_POINTS_PER_DOLLAR,
    DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS,
    DOMAIN,
    HISTORY_ALLOWANCE,
    HISTORY_COMPLETION_STREAK_MILESTONE,
    HISTORY_PERSON_ADDED,
    HISTORY_POINTS_AWARDED,
    HISTORY_REDEMPTION_APPROVED,
    HISTORY_REDEMPTION_DECLINED,
    HISTORY_REDEMPTION_REQUESTED,
    HISTORY_RETENTION_DAYS,
    TASK_INSTANCE_RETENTION_DAYS,
    HISTORY_TASK_ADDED,
    HISTORY_TASK_APPROVED,
    HISTORY_TASK_COMPLETED,
    HISTORY_TASK_DENIED,
    HISTORY_TASK_EXCUSED,
    HISTORY_TASK_MARKED_COMPLETE,
    HISTORY_TASK_REJECTED,
    HISTORY_TASK_SKIPPED,
    LEGACY_MAINTENANCE_CATEGORIES,
    RECURRENCE_DAILY,
    RECURRENCE_EVERY_N_DAYS,
    RECURRENCE_EVERY_N_WEEKS,
    RECURRENCE_MONTHLY_ON_DATE,
    RECURRENCE_ONE_TIME,
    RECURRENCE_WEEKLY,
    PROPOSAL_APPROVED,
    PROPOSAL_DECLINED,
    PROPOSAL_PENDING_KIDS,
    PROPOSAL_PENDING_PARENT,
    REDEMPTION_APPROVED,
    REDEMPTION_DECLINED,
    REDEMPTION_PENDING,
    HISTORY_GROUP_CHIP_IN,
    HISTORY_GROUP_REDEEMED,
    HISTORY_GROUP_PROPOSED,
    HISTORY_SUBSCRIPTION_STARTED,
    HISTORY_SUBSCRIPTION_RENEWED,
    HISTORY_SUBSCRIPTION_LAPSED,
    HISTORY_SUBSCRIPTION_CANCELED,
    HISTORY_SUBSCRIPTION_CANCEL_REQUESTED,
    HISTORY_SUBSCRIPTION_CANCEL_DECLINED,
    HISTORY_SUBSCRIPTION_UPDATED,
    ITEM_TYPE_ONE_TIME,
    ITEM_TYPE_SUBSCRIPTION,
    SUB_STATUS_ACTIVE,
    SUB_STATUS_LAPSED,
    SUB_STATUS_CANCEL_PENDING,
    SUB_STATUS_CANCELED,
    SUB_PERIOD_DAILY,
    SUB_PERIOD_WEEKLY,
    SUB_PERIOD_MONTHLY,
    SUB_PERIOD_QUARTERLY,
    SUB_PERIOD_BIANNUAL,
    SUB_PERIOD_ANNUAL,
    SCOPE_COMMON,
    SCOPE_PERSONAL,
    STATUS_APPROVED,
    STATUS_CLAIMED,
    STATUS_DENIED,
    STATUS_EXCUSED,
    STATUS_PENDING,
    STATUS_PENDING_APPROVAL,
    STATUS_REJECTED,
    STATUS_SELF_REPORTED,
    STATUS_SKIPPED,
    STORAGE_FILE,
    STORAGE_VERSION,
)
from ._store_helpers import (
    _STORE_DOMAINS,
    _SAVE_DELAY_SECONDS,
    _now_iso,
    _today_str,
    _new_id,
    _empty_store,
    _migrate_chore,
    _migrate_store_item,
    _migrate_task_instance,
    _advance_renewal_date,
    _days_until_reset,
)

_LOGGER = logging.getLogger(__name__)


class HistoryAdminMixin:
    # ------------------------------------------------------------------
    # History
    # ------------------------------------------------------------------

    @property
    def history(self) -> list[dict]:
        return self._data.get("history", [])

    def get_history(self, person_id: str | None = None, limit: int = 100) -> list[dict]:
        entries = sorted(self.history, key=lambda e: e.get("timestamp", ""), reverse=True)
        if person_id:
            entries = [e for e in entries if e.get("person_id") == person_id]
        return entries[:limit]

    def get_history_for_card(self, person_id: str | None = None, limit: int = 150) -> list[dict]:
        """
        Enriched, collapsed history log for the card UI.

        One row is emitted per task instance (collapsing task_completed +
        task_approved + points_awarded into a single evolving row). The row
        reflects the current instance status so it naturally "updates" as the
        instance moves through states (submitted → approved).

        Rejected instances are suppressed when the same chore + person later
        has an approved/self-reported instance (kid retried and succeeded).

        Skipped entries carry a `skipped_date` field (ISO date string) so the
        frontend can roll up all skipped chores from the same day into one
        collapsible group.

        Reversible action hints:
          "excuse"        — skipped with penalty, can be excused
          "mark_complete" — excused instance, can be retroactively completed
          "reject"        — approved/self-reported, points can be clawed back
          None            — no further parent action available
        """
        entries = sorted(self.history, key=lambda e: e.get("timestamp", ""), reverse=True)
        if person_id:
            entries = [e for e in entries if e.get("person_id") == person_id]

        # Build (chore_id, person_id) pairs with any approved/self-reported instance
        # so we can suppress rejected entries superseded by a later success.
        approved_chore_person: set[tuple] = set()
        for inst in self.task_instances:
            if inst["status"] in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
                pid = inst.get("completed_by") or inst.get("assigned_to")
                if pid:
                    approved_chore_person.add((inst["chore_id"], pid))

        result: list[dict] = []
        seen_instance_ids: set[str] = set()

        for e in entries:
            ref_id   = e.get("reference_id", "")
            instance = self.get_task_instance(ref_id)

            if instance:
                # Deduplicate — only emit one row per task instance (collapse
                # task_completed + task_approved + points_awarded into one).
                if ref_id in seen_instance_ids:
                    continue
                seen_instance_ids.add(ref_id)

                inst_status = instance["status"]

                # Suppress rejected or denied instances where a later success exists
                # for the same chore + person (kid retried and passed).
                if inst_status in (STATUS_REJECTED, STATUS_DENIED):
                    pid = instance.get("completed_by") or instance.get("assigned_to")
                    if (instance["chore_id"], pid) in approved_chore_person:
                        continue

                person     = self.get_person(e.get("person_id", "")) if e.get("person_id") else None
                chore      = self.get_chore(instance["chore_id"])
                chore_name = chore["name"] if chore else e.get("chore_name", "")

                # Map current instance status → canonical history display type.
                display_type = {
                    STATUS_APPROVED:         HISTORY_TASK_APPROVED,
                    STATUS_SELF_REPORTED:    HISTORY_TASK_COMPLETED,
                    STATUS_PENDING_APPROVAL: "pending_approval",
                    STATUS_SKIPPED:          HISTORY_TASK_SKIPPED,
                    STATUS_EXCUSED:          HISTORY_TASK_EXCUSED,
                    STATUS_REJECTED:         HISTORY_TASK_REJECTED,
                    STATUS_DENIED:           HISTORY_TASK_DENIED,
                }.get(inst_status, e["type"])

                # Net points effect of this instance.
                pts = 0
                if inst_status in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
                    pts = instance.get("points_awarded", 0)
                elif inst_status == STATUS_SKIPPED:
                    pts = -instance.get("penalty_applied", 0)
                elif inst_status == STATUS_REJECTED:
                    pts = -instance.get("points_awarded", 0)

                # Reversible action available to a parent.
                reversible = None
                if inst_status == STATUS_SKIPPED:
                    if instance.get("penalty_applied", 0) > 0:
                        reversible = "excuse"
                elif inst_status == STATUS_EXCUSED:
                    reversible = "mark_complete"
                elif inst_status in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
                    reversible = "reject"

                row: dict = {
                    "history_id":      e["id"],
                    "type":            display_type,
                    "person_id":       e.get("person_id"),
                    "person_name":     person["name"] if person else None,
                    "person_color":    person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                    "reference_id":    ref_id,
                    "chore_name":      chore_name,
                    "points_delta":    pts,
                    "balance_after":   e.get("balance_after", 0),
                    "timestamp":       e["timestamp"],
                    "note":            e.get("note", ""),
                    "reversible":      reversible,
                    "instance_status": inst_status,
                }

                # skipped_date lets the frontend group all skipped chores from
                # the same day into one collapsible entry with a total penalty.
                if inst_status == STATUS_SKIPPED:
                    row["skipped_date"] = e["timestamp"][:10]

                result.append(row)

            else:
                # No matching task instance (pruned after retention, chore
                # deleted, instance manually removed, etc.). Render the row
                # using the cached chore_name + original event type. No
                # reversible action since the instance is gone, but the
                # row is still informational and must remain visible —
                # otherwise the History panel silently goes dark for any
                # person whose old task instances have been pruned.
                person = self.get_person(e.get("person_id", "")) if e.get("person_id") else None
                row = {
                    "history_id":      e["id"],
                    "type":            e["type"],
                    "person_id":       e.get("person_id"),
                    "person_name":     person["name"] if person else None,
                    "person_color":    person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                    "reference_id":    ref_id,
                    "chore_name":      e.get("chore_name", ""),
                    "points_delta":    e.get("points_delta", 0),
                    "balance_after":   e.get("balance_after", 0),
                    "timestamp":       e["timestamp"],
                    "note":            e.get("note", ""),
                    "reversible":      None,
                    "instance_status": None,
                }
                # Skipped entries still need skipped_date so the frontend can
                # roll them into the per-day collapsible group.
                if e["type"] == HISTORY_TASK_SKIPPED:
                    row["skipped_date"] = e["timestamp"][:10]
                result.append(row)

        return result[:limit]

    def _append_history(
        self,
        event_type: str,
        reference_id: str,
        person_id: str | None = None,
        points_delta: int = 0,
        balance_after: int = 0,
        note: str = "",
        chore_name: str = "",
    ) -> None:
        self._data["history"].append({
            "id":           _new_id(),
            "type":         event_type,
            "person_id":    person_id,
            "reference_id": reference_id,
            "points_delta": points_delta,
            "balance_after":balance_after,
            "timestamp":    _now_iso(),
            "note":         note,
            "chore_name":   chore_name,  # v0.4.0: populated for task events
        })

    # ------------------------------------------------------------------
    # v0.4.0 — Admin correction services
    # ------------------------------------------------------------------

    async def async_excuse_task(
        self, instance_id: str, excused_by: str, reason: str = ""
    ) -> dict | None:
        """
        Reverse the penalty on a skipped task instance (sick day, sleep-over, etc.).
        Restores penalty points to the person's balance and marks the instance
        STATUS_EXCUSED. Cannot be applied to instances that weren't skipped.
        """
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_SKIPPED:
            _LOGGER.warning("Family Hub: excuse_task — instance %s not found or not skipped", instance_id)
            return None

        chore  = self.get_chore(instance["chore_id"])
        chore_name = chore["name"] if chore else "unknown"
        pid    = instance.get("assigned_to") or instance.get("completed_by")
        penalty= instance.get("penalty_applied", 0)

        instance["status"] = STATUS_EXCUSED
        instance["excused_by"]  = excused_by
        instance["excused_at"]  = _now_iso()
        instance["excuse_reason"] = reason

        if penalty > 0 and pid:
            person = self.get_person(pid)
            if person:
                person["points_balance"] = person.get("points_balance", 0) + penalty
                # Lifetime total not adjusted — excused penalties never earned points
                self._append_history(
                    event_type=HISTORY_TASK_EXCUSED,
                    person_id=pid,
                    reference_id=instance_id,
                    points_delta=penalty,
                    balance_after=person["points_balance"],
                    note=f'"{chore_name}" penalty reversed — {reason}'.rstrip(" —"),
                    chore_name=chore_name,
                )
        else:
            self._append_history(
                event_type=HISTORY_TASK_EXCUSED,
                person_id=pid,
                reference_id=instance_id,
                note=f'"{chore_name}" excused — {reason}'.rstrip(" —"),
                chore_name=chore_name,
            )

        await self.async_save()
        return instance

    async def async_reject_task(
        self, instance_id: str, rejected_by: str, reason: str = ""
    ) -> dict | None:
        """
        Claw back points for a task that was already approved or self-reported.
        Deducts points_awarded from the person's spendable balance and marks
        the instance STATUS_REJECTED. Lifetime total is not changed.
        """
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] not in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
            _LOGGER.warning(
                "Family Hub: reject_task — instance %s not found or not in approved/self-reported state",
                instance_id,
            )
            return None

        chore     = self.get_chore(instance["chore_id"])
        chore_name= chore["name"] if chore else "unknown"
        pid       = instance.get("completed_by")
        points    = instance.get("points_awarded", 0)

        instance["status"]      = STATUS_REJECTED
        instance["rejected_by"] = rejected_by
        instance["rejected_at"] = _now_iso()
        instance["reject_reason"] = reason

        if points > 0 and pid:
            person = self.get_person(pid)
            if person:
                person["points_balance"] = max(0, person.get("points_balance", 0) - points)
                self._append_history(
                    event_type=HISTORY_TASK_REJECTED,
                    person_id=pid,
                    reference_id=instance_id,
                    points_delta=-points,
                    balance_after=person["points_balance"],
                    note=f'"{chore_name}" rejected — {reason}'.rstrip(" —"),
                    chore_name=chore_name,
                )
        else:
            self._append_history(
                event_type=HISTORY_TASK_REJECTED,
                person_id=pid,
                reference_id=instance_id,
                note=f'"{chore_name}" rejected — {reason}'.rstrip(" —"),
                chore_name=chore_name,
            )

        # Same-day retry: if the task was rejected on the same day it was due,
        # put it back as a fresh pending instance so the kid can try again.
        # If rejected the next day the daily tick will already have generated
        # today's instance, so no new instance is needed.
        today_str = date.today().isoformat()
        chore_r_type = chore["recurrence"].get("type") if chore else RECURRENCE_ONE_TIME
        is_claimable = chore and chore.get("chore_type") == CHORE_TYPE_CLAIMABLE
        if (not is_claimable
                and chore_r_type != RECURRENCE_ONE_TIME
                and instance.get("due_date") == today_str
                and pid):
            await self._async_create_task_instance(chore, date.today(), person_id=pid)
            _LOGGER.info(
                "Family Hub: reject_task — created same-day retry instance for %s on chore %s",
                pid, chore_name,
            )

        # Claimable tasks: always recreate the shared pending instance so anyone
        # can claim the task again (regardless of recurrence type or due date).
        if is_claimable:
            already_available = any(
                t for t in self.task_instances
                if t["chore_id"] == chore["id"]
                and t["status"] in [STATUS_PENDING, STATUS_CLAIMED]
            )
            if not already_available:
                await self._async_create_task_instance(chore, date.today(), person_id=None)
                _LOGGER.info(
                    "Family Hub: reject_task — recreated shared claimable instance for chore %s",
                    chore_name,
                )

        await self.async_save()
        return instance

    async def async_mark_task_complete(
        self, instance_id: str, marked_by: str, reason: str = ""
    ) -> dict | None:
        """
        Retroactively mark a skipped or excused task as completed by a parent.
        Awards the chore's points, reverses any penalty that was applied, and
        marks the instance STATUS_APPROVED.
        """
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] not in [STATUS_SKIPPED, STATUS_EXCUSED]:
            _LOGGER.warning(
                "Family Hub: mark_task_complete — instance %s not found or not skipped/excused",
                instance_id,
            )
            return None

        chore     = self.get_chore(instance["chore_id"])
        if not chore:
            return None
        chore_name= chore["name"]
        pid       = instance.get("assigned_to") or instance.get("completed_by")
        points    = chore.get("points", 0)
        penalty   = instance.get("penalty_applied", 0)

        instance["status"]        = STATUS_APPROVED
        instance["approved_at"]   = _now_iso()
        instance["approved_by"]   = marked_by
        instance["points_awarded"] = points
        instance["completed_by"]  = instance.get("completed_by") or marked_by
        instance["completed_at"]  = instance.get("completed_at") or _now_iso()

        total_awarded = points + penalty  # restore penalty AND award points
        if total_awarded > 0 and pid:
            person = self.get_person(pid)
            if person:
                person["points_balance"]  = person.get("points_balance", 0) + total_awarded
                person["points_lifetime"] = person.get("points_lifetime", 0) + points
                self._append_history(
                    event_type=HISTORY_TASK_MARKED_COMPLETE,
                    person_id=pid,
                    reference_id=instance_id,
                    points_delta=total_awarded,
                    balance_after=person["points_balance"],
                    note=f'"{chore_name}" retroactively marked complete — {reason}'.rstrip(" —"),
                    chore_name=chore_name,
                )
        else:
            self._append_history(
                event_type=HISTORY_TASK_MARKED_COMPLETE,
                person_id=pid,
                reference_id=instance_id,
                note=f'"{chore_name}" retroactively marked complete — {reason}'.rstrip(" —"),
                chore_name=chore_name,
            )

        await self.async_save()
        return instance

    async def async_force_daily_tick(self) -> None:
        """
        Force the daily tick to run immediately, regardless of last_tick_date.
        Resets last_tick_date to yesterday so the full today tick fires.
        Useful for admin/debug and for cleaning up stale instances after deploy.
        """
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        self._data["settings"]["last_tick_date"] = yesterday
        _LOGGER.info("Family Hub: force_daily_tick called — running tick now")
        await self.async_daily_tick()

    async def async_rebuild_data(self) -> dict:
        """
        Heavy-lift data cleanup, run on demand from the Admin settings UI.

        Steps:
          1. Re-run _migrate_chore on every chore (idempotent; catches anything
             that snuck in after the initial load-time migration).
          2. Remove people records with blank id (orphans).
          3. Remove ghost task instances (assigned_to == "").
          4. Remove orphaned task instances whose chore no longer exists.
          5. Remove duplicate pending instances per (chore_id, assigned_to, due_date).
          6. Prune terminal instances and history (same as daily tick).
          7. Save and return a summary dict for the caller to surface as a notification.
        """
        today = date.today()
        summary: dict[str, int] = {}

        # Step 1: re-run chore + instance migration (idempotent)
        self._data["chores"]         = [_migrate_chore(c)         for c in self._data.get("chores", [])]
        self._data["task_instances"] = [_migrate_task_instance(t) for t in self._data.get("task_instances", [])]

        # Step 2: orphan people (blank id)
        before = len(self._data["people"])
        self._data["people"] = [p for p in self._data["people"] if p.get("id")]
        summary["orphan_people_removed"] = before - len(self._data["people"])

        # Step 3: ghost task instances (assigned_to == "")
        before = len(self._data["task_instances"])
        self._data["task_instances"] = [
            t for t in self._data["task_instances"] if t.get("assigned_to") != ""
        ]
        summary["ghost_instances_removed"] = before - len(self._data["task_instances"])

        # Step 4: orphaned instances (chore_id not in any active chore)
        active_chore_ids = {c["id"] for c in self._data.get("chores", []) if c.get("active", True)}
        before = len(self._data["task_instances"])
        self._data["task_instances"] = [
            t for t in self._data["task_instances"]
            if t["status"] in ACTIVE_STATUSES or t.get("chore_id") in active_chore_ids
        ]
        summary["orphaned_instances_removed"] = before - len(self._data["task_instances"])

        # Step 5: duplicate active instances per (chore_id, assigned_to, due_date)
        seen: set[tuple] = set()
        deduped: list[dict] = []
        dupe_count = 0
        for t in self._data["task_instances"]:
            if t["status"] not in ACTIVE_STATUSES:
                deduped.append(t)
                continue
            key = (t["chore_id"], t.get("assigned_to"), t.get("due_date"))
            if key in seen:
                dupe_count += 1
            else:
                seen.add(key)
                deduped.append(t)
        self._data["task_instances"] = deduped
        summary["duplicate_instances_removed"] = dupe_count

        # Step 6: prune old terminal instances and history
        old_inst = len(self._data["task_instances"])
        old_hist = len(self._data["history"])
        self._trim_task_instances(today)
        self._trim_history(today)
        summary["old_instances_pruned"] = old_inst - len(self._data["task_instances"])
        summary["old_history_pruned"]   = old_hist - len(self._data["history"])

        await self.async_save()
        _LOGGER.info("Family Hub: rebuild_data complete — %s", summary)
        return summary



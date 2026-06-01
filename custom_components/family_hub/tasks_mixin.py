"""Family Hub - TasksMixin (extracted from data_store.py, v0.7.0 P4).

Task instances, completion/approval/claim lifecycle, notifications.
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


class TasksMixin:
    # ------------------------------------------------------------------
    # Task instances
    # ------------------------------------------------------------------

    @property
    def task_instances(self) -> list[dict]:
        return self._data.get("task_instances", [])

    def get_task_instance(self, instance_id: str) -> dict | None:
        return next((t for t in self.task_instances if t["id"] == instance_id), None)

    def get_active_tasks(self, person_id: str | None = None) -> list[dict]:
        tasks = [t for t in self.task_instances if t["status"] in ACTIVE_STATUSES]
        if person_id:
            tasks = [t for t in tasks if t.get("assigned_to") == person_id]
        return tasks

    def get_pending_approvals(self) -> list[dict]:
        return [t for t in self.task_instances if t["status"] == STATUS_PENDING_APPROVAL]

    def get_claimable_tasks(self) -> list[dict]:
        return [
            t for t in self.task_instances
            if t["status"] == STATUS_PENDING
            and t.get("assigned_to") is None
            and self._is_claimable_task(t)
        ]

    def _is_claimable_task(self, task: dict) -> bool:
        chore = self.get_chore(task["chore_id"])
        return chore is not None and chore.get("chore_type") == CHORE_TYPE_CLAIMABLE

    async def _async_create_task_instance(
        self, chore: dict, due_date: date, person_id: str | None = None
    ) -> dict:
        instance = {
            "id": _new_id(),
            "chore_id": chore["id"],
            "assigned_to": person_id,
            "status": STATUS_PENDING,
            "due_date": due_date.isoformat(),
            "claimed_by": None,
            "completed_at": None,
            "completed_by": None,
            "approved_at": None,
            "approved_by": None,
            "points_awarded": 0,
            "penalty_applied": 0,
            "created_at": _now_iso(),
        }
        self._data["task_instances"].append(instance)
        return instance

    def _park_one_time_if_done(self, chore: dict) -> None:
        """
        When a one-time chore's instance reaches a completed state, flip the
        chore to inactive rather than leaving it live with no future instances.

        One-time chores never regenerate, so a finished one would otherwise just
        vanish from view. Parking it as active=False keeps the definition in the
        Chores list (under the Inactive filter) so a parent can re-activate and
        reuse it later. No-op for recurring chores.
        """
        if chore.get("recurrence", {}).get("type") == RECURRENCE_ONE_TIME:
            chore["active"] = False

    async def async_complete_task(self, instance_id: str, completed_by: str) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance:
            return None
        chore = self.get_chore(instance["chore_id"])
        if not chore:
            return None

        instance["completed_at"] = _now_iso()
        instance["completed_by"] = completed_by

        if chore.get("approval_required", True):
            instance["status"] = STATUS_PENDING_APPROVAL
            self._append_history(
                event_type=HISTORY_TASK_COMPLETED,
                person_id=completed_by,
                reference_id=instance_id,
                note=f'"{chore["name"]}" marked complete, awaiting approval',
                chore_name=chore["name"],
            )
        else:
            points = chore.get("points", 0)
            instance["status"]        = STATUS_SELF_REPORTED
            instance["points_awarded"] = points
            instance["approved_at"]   = _now_iso()
            instance["approved_by"]   = "system"
            self._append_history(
                event_type=HISTORY_TASK_COMPLETED,
                person_id=completed_by,
                reference_id=instance_id,
                note=f'"{chore["name"]}" self-reported complete',
                chore_name=chore["name"],
            )
            if points > 0 and completed_by:
                await self.async_award_points(
                    completed_by, points, instance_id, f'Points for "{chore["name"]}"'
                )
            if completed_by and not self.is_penalty_paused_for(completed_by):
                await self._increment_streak(completed_by, chore["id"], chore, date.today())
            # Auto-completed (no approval needed) — park one-time chores now.
            self._park_one_time_if_done(chore)

        await self.async_save()
        return instance

    async def async_approve_task(self, instance_id: str, approved_by: str) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING_APPROVAL:
            return None
        chore = self.get_chore(instance["chore_id"])
        if not chore:
            return None

        points = chore.get("points", 0)
        instance["status"]        = STATUS_APPROVED
        instance["approved_at"]   = _now_iso()
        instance["approved_by"]   = approved_by
        instance["points_awarded"] = points

        completed_by = instance.get("completed_by")
        self._append_history(
            event_type=HISTORY_TASK_APPROVED,
            person_id=completed_by,
            reference_id=instance_id,
            note=f'"{chore["name"]}" approved',
            chore_name=chore["name"],
        )
        if points > 0 and completed_by:
            await self.async_award_points(
                completed_by, points, instance_id, f'Points for "{chore["name"]}"'
            )
        if completed_by and not self.is_penalty_paused_for(completed_by):
            await self._increment_streak(completed_by, chore["id"], chore, date.today())
        # Approved & terminal — park one-time chores so they don't vanish.
        self._park_one_time_if_done(chore)
        await self.async_save()
        return instance

    async def async_deny_task(
        self, instance_id: str, denied_by: str, reason: str = ""
    ) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING_APPROVAL:
            return None
        chore = self.get_chore(instance["chore_id"])
        chore_name = chore["name"] if chore else "unknown"

        instance["status"]      = STATUS_DENIED
        instance["approved_at"] = _now_iso()
        instance["approved_by"] = denied_by

        self._append_history(
            event_type=HISTORY_TASK_DENIED,
            person_id=instance.get("completed_by"),
            reference_id=instance_id,
            note=f'"{chore_name}" denied. {reason}'.strip(),
            chore_name=chore_name,
        )

        # Same retry logic as async_reject_task: recreate a pending instance so
        # the person can try again.
        today_str = date.today().isoformat()
        chore_r_type = chore["recurrence"].get("type") if chore else RECURRENCE_ONE_TIME
        pid = instance.get("completed_by") or instance.get("assigned_to")
        is_claimable = chore and chore.get("chore_type") == CHORE_TYPE_CLAIMABLE

        if (not is_claimable
                and chore_r_type != RECURRENCE_ONE_TIME
                and instance.get("due_date") == today_str
                and pid):
            await self._async_create_task_instance(chore, date.today(), person_id=pid)

        if is_claimable:
            already_available = any(
                t for t in self.task_instances
                if t["chore_id"] == chore["id"]
                and t["status"] in [STATUS_PENDING, STATUS_CLAIMED]
            )
            if not already_available:
                await self._async_create_task_instance(chore, date.today(), person_id=None)

        await self.async_save()
        return instance

    async def async_claim_task(self, instance_id: str, claimed_by: str) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING:
            return None
        if not self._is_claimable_task(instance):
            return None

        chore = self.get_chore(instance["chore_id"])
        if not chore:
            return None

        subtype = chore.get("claimable_subtype", CLAIMABLE_SUBTYPE_FCFS)

        if subtype == CLAIMABLE_SUBTYPE_MULTI:
            max_c = chore.get("max_claimants", 2)
            # Reject if already claimed by this person or capacity reached
            if claimed_by in instance.get("claimant_ids", []):
                _LOGGER.warning("Family Hub: claim_task — %s already claimed this multi-claim task", claimed_by)
                return None
            if instance.get("claim_count", 0) >= max_c:
                _LOGGER.warning("Family Hub: claim_task — multi-claim capacity already reached")
                return None

            # Record this claimant on the shared instance
            instance.setdefault("claimant_ids", []).append(claimed_by)
            instance["claim_count"] = instance.get("claim_count", 0) + 1

            # Create a personal instance for the claimant (STATUS_CLAIMED, awaiting award)
            personal = await self._async_create_task_instance(chore, date.today(), person_id=claimed_by)
            personal["status"]     = STATUS_CLAIMED
            personal["claimed_by"] = claimed_by

            # If capacity now full, award points to all claimants immediately
            if instance["claim_count"] >= max_c:
                await self._async_award_multi_claim_claimants(instance, chore)
                instance["status"] = STATUS_APPROVED  # shared instance closed

        else:
            # FCFS: first claimer takes the whole task
            instance["status"]      = STATUS_CLAIMED
            instance["assigned_to"] = claimed_by
            instance["claimed_by"]  = claimed_by

        await self.async_save()
        return instance

    async def _async_award_multi_claim_claimants(
        self, shared_instance: dict, chore: dict
    ) -> None:
        """
        Award points to all claimants of a multi-claim shared instance.
        Called either when max_claimants is reached (at claim time) or when
        the chore cycle resets (in the tick, before the shared instance is skipped).

        Points mode:
          "full"  — each claimant earns chore.points
          "split" — points divided evenly among actual claimants (ceil)
        """
        claimant_ids = shared_instance.get("claimant_ids", [])
        if not claimant_ids:
            return

        base_points = chore.get("points", 0)
        if chore.get("multi_claim_points_mode", MULTI_CLAIM_POINTS_FULL) == MULTI_CLAIM_POINTS_SPLIT:
            pts_each = math.ceil(base_points / len(claimant_ids)) if base_points and claimant_ids else 0
        else:
            pts_each = base_points

        for pid in claimant_ids:
            # Find the personal STATUS_CLAIMED instance for this claimant
            personal = next(
                (t for t in self.task_instances
                 if t["chore_id"] == chore["id"]
                 and t.get("assigned_to") == pid
                 and t["status"] == STATUS_CLAIMED),
                None,
            )
            if personal:
                personal["status"]        = STATUS_SELF_REPORTED
                personal["points_awarded"] = pts_each
                personal["approved_at"]   = _now_iso()
                personal["approved_by"]   = "system"
                personal.setdefault("completed_at", _now_iso())
                personal.setdefault("completed_by", pid)

            if pts_each > 0:
                person = self.get_person(pid)
                if person:
                    person["points_balance"]  = person.get("points_balance", 0) + pts_each
                    person["points_lifetime"] = person.get("points_lifetime", 0) + pts_each
                    self._append_history(
                        event_type=HISTORY_TASK_APPROVED,
                        person_id=pid,
                        reference_id=personal["id"] if personal else shared_instance["id"],
                        points_delta=pts_each,
                        balance_after=person["points_balance"],
                        note=f'"{chore["name"]}" multi-claim awarded — {pts_each}pts',
                        chore_name=chore["name"],
                    )

    # ------------------------------------------------------------------
    # Notification helpers (v0.5.0)
    # ------------------------------------------------------------------

    async def _send_notify(self, target: str, title: str, message: str) -> None:
        """Call a HA notify service. Errors are logged, never raised."""
        try:
            await self._hass.services.async_call(
                "notify", target,
                {"title": title, "message": message},
                blocking=False,
            )
            _LOGGER.info("Family Hub: notification sent to %s — %s", target, title)
        except Exception as err:
            _LOGGER.warning("Family Hub: notification failed for '%s': %s", target, err)

    async def async_check_notifications(self) -> None:
        """
        Send per-chore reminders and penalty nudges. Called every coordinator poll.

        Three notification types:
          #3 Per-chore reminder_time — fires once per task instance when current
             time reaches the chore's configured HHMM threshold and task is still pending.
          #1 Last-chance penalty warning — fires once per instance on the last day
             before a weekly/monthly penalty-enabled chore resets.
          #2 Daily penalty accumulating — fires once per day while daily_penalty_after_days
             penalties are actively accruing on a task instance.
        """
        now = datetime.now()
        today = now.date()
        current_hmm = now.hour * 100 + now.minute

        settings = self._data["settings"]
        penalty_alert_time = settings.get("penalty_alert_time", 800)
        past_alert_time = penalty_alert_time != -1 and current_hmm >= penalty_alert_time

        changed = False

        for instance in self._data["task_instances"]:
            if instance["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue

            pid = instance.get("assigned_to")
            if not pid:
                continue

            person = self.get_person(pid)
            if not person or not person.get("active", True):
                continue

            target = person.get("notify_target", "").strip()
            if not target:
                continue

            chore = self.get_chore(instance["chore_id"])
            if not chore:
                continue

            first_name = person["name"].split()[0]
            chore_name = chore["name"]

            # --- #3: Per-chore reminder_time ---
            reminder_time = chore.get("reminder_time", -1)
            if (reminder_time != -1
                    and current_hmm >= reminder_time
                    and not instance.get("nudged_reminder")):
                await self._send_notify(
                    target,
                    f"Don't forget — {chore_name}",
                    f"Hey {first_name}, don't forget to {chore_name}!",
                )
                instance["nudged_reminder"] = True
                changed = True

            # --- #1: Last-chance penalty warning (weekly/monthly only) ---
            if past_alert_time and not instance.get("nudged_penalty_warning"):
                rec = chore.get("recurrence", {})
                r_type = rec.get("type", RECURRENCE_DAILY)
                is_long_cycle = r_type in (
                    RECURRENCE_WEEKLY, RECURRENCE_EVERY_N_WEEKS,
                    RECURRENCE_EVERY_N_DAYS, RECURRENCE_MONTHLY_ON_DATE,
                )
                if (is_long_cycle
                        and chore.get("penalty_enabled")
                        and chore.get("penalty_points", 0) > 0
                        and _days_until_reset(chore, today) == 1):
                    penalty_pts = chore["penalty_points"]
                    await self._send_notify(
                        target,
                        f"Don't forget — {chore_name}!",
                        f"Hey {first_name}! {chore_name} needs to get done today. "
                        f"Skip it and you'll lose {penalty_pts} pts!",
                    )
                    instance["nudged_penalty_warning"] = True
                    changed = True

            # --- #2: Daily penalty accumulating ---
            daily_applied = instance.get("daily_penalty_days_applied", 0)
            if (past_alert_time
                    and daily_applied > 0
                    and instance.get("nudged_penalty_date") != today.isoformat()):
                penalty_pts = chore.get("penalty_points", 0)
                await self._send_notify(
                    target,
                    f"Still losing points — {chore_name}",
                    f"Hey {first_name}, you're losing {penalty_pts} pts each day "
                    f"{chore_name} isn't done. Finish it today to stop losing points!",
                )
                instance["nudged_penalty_date"] = today.isoformat()
                changed = True

        if changed:
            await self.async_save()



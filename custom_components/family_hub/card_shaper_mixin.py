"""Family Hub - card-shaper mixin (extracted from data_store.py, v0.7.0 P4).

The read-only get_*_for_card accessors that shape store data into the dicts the
dashboard card consumes. Mixed into FamilyHubDataStore; all methods operate on
self (no behaviour change).
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


class CardShaperMixin:
    """Read-only get_*_for_card accessors that shape store data for the card."""

    # ------------------------------------------------------------------
    # Summary / coordinator
    # ------------------------------------------------------------------

    def get_summary(self) -> dict:
        return {
            "family_name":          self.family_name,
            "points_per_dollar":    self.points_per_dollar,
            "people":               self.people,
            "tasks_due_today":      len([t for t in self.task_instances if t["due_date"] == _today_str() and t["status"] in ACTIVE_STATUSES]),
            "tasks_overdue":        len([t for t in self.task_instances if t["due_date"] < _today_str()  and t["status"] in ACTIVE_STATUSES]),
            "pending_approvals":    len(self.get_pending_approvals()),
            "pending_redemptions":  len(self.get_pending_redemptions()),
            "claimable_tasks":      len(self.get_claimable_tasks()),
            "active_chores":        len(self.get_active_chores()),
        }

    # ------------------------------------------------------------------
    # Card data helpers
    # ------------------------------------------------------------------

    def get_tasks_for_card(self, person_id: str) -> dict:
        """
        Return due_today, overdue, and pending_approval task lists for one person.

        v0.4.1: row dict now includes chore_type and expires_after_days so the
        card can identify reminders via t.chore_type === "reminder" rather than
        the brittle 0-pts/no-penalty heuristic. is_one_time is kept for backward
        compat with any existing card logic that reads it.
        """
        today     = date.today()
        today_str = today.isoformat()
        due_today: list[dict] = []
        overdue:   list[dict] = []

        for t in self.task_instances:
            if t.get("assigned_to") != person_id:
                continue
            if t["status"] not in ACTIVE_STATUSES:
                continue
            # Already marked done and awaiting a parent's OK — the kid has done
            # their part, so it belongs ONLY in the pending-approval list below,
            # never in due-today/overdue (a prior-day pending one was showing as
            # "overdue" at the top of the board).
            if t["status"] == STATUS_PENDING_APPROVAL:
                continue
            chore = self.get_chore(t["chore_id"])
            if not chore:
                continue
            # Maintenance items belong on the maintenance card
            if self._chore_is_maintenance(chore):
                continue

            threshold = chore.get("daily_penalty_after_days")
            if threshold and chore.get("penalty_enabled") and chore.get("penalty_points", 0):
                try:
                    due_d    = date.fromisoformat(t["due_date"])
                    age_days = (today - due_d).days
                    daily_penalty_firing = age_days > threshold
                except (ValueError, KeyError):
                    daily_penalty_firing = False
            else:
                daily_penalty_firing = False

            row = {
                "task_id":               t["id"],
                "chore_id":              t["chore_id"],
                "name":                  chore["name"],
                "description":           chore.get("description", ""),
                "icon":                  chore.get("icon", ""),
                "points":                chore.get("points", 0),
                "due_date":              t["due_date"],
                "status":                t["status"],
                "chore_type":            chore.get("chore_type", CHORE_TYPE_ASSIGNED),
                "category_label":        chore.get("category_label", ""),
                "penalty_enabled":       chore.get("penalty_enabled", False),
                "penalty_points":        chore.get("penalty_points", 0),
                "daily_penalty_after_days": threshold,
                "daily_penalty_firing":  daily_penalty_firing,
                "expires_after_days":    chore.get("expires_after_days"),
                "is_one_time":           chore["recurrence"].get("type") == RECURRENCE_ONE_TIME,
                # Carried so the card's daily-progress bar can count DAILY chores
                # only (weekly/monthly window chores list but don't pad "done today").
                "recurrence_type":       chore["recurrence"].get("type", RECURRENCE_DAILY),
                "streak":                self._get_streak(person_id, t["chore_id"]),
                # Consecutive-skip count so the card's "at risk" KPI can tell
                # whether skipping this daily chore today is still penalty-free
                # (inside the daily_penalty_after_days grace window).
                "skip_streak":           self._get_skip_streak(person_id, t["chore_id"]),
                # v0.6.3 P2: carry the chore's sort_order so personal-page lists
                # respect the admin drag-reorder. Within a category, rows are
                # sorted by (sort_order, name) — same key as the admin table.
                "sort_order":            chore.get("sort_order", 0),
            }

            if t["due_date"] == today_str:
                due_today.append(row)
            elif t["due_date"] < today_str:
                r_type     = chore["recurrence"].get("type", RECURRENCE_DAILY)
                day_filter = chore["recurrence"].get("day_filter", [])

                if r_type in (RECURRENCE_WEEKLY, RECURRENCE_EVERY_N_DAYS,
                              RECURRENCE_EVERY_N_WEEKS, RECURRENCE_MONTHLY_ON_DATE):
                    # Non-daily recurring chores: still "in play" until the next
                    # cycle replaces them. Expose reset info so the card shows
                    # "Resets [day]" instead of the misleading "due Nd ago" badge.
                    row["recurrence_type"]      = r_type
                    row["recurrence_weekdays"]  = chore["recurrence"].get("weekdays", [])
                    row["days_until_reset"]     = _days_until_reset(chore, today)
                    due_today.append(row)
                elif r_type == RECURRENCE_DAILY and day_filter and today.weekday() not in day_filter:
                    # Daily with day_filter on an off-day: hide it. The tick's
                    # cleanup pass will skip it with penalty on the next run.
                    continue
                else:
                    row["days_overdue"] = (today - date.fromisoformat(t["due_date"])).days
                    overdue.append(row)

        pending_approval = []
        for t in self.task_instances:
            if t.get("completed_by") != person_id:
                continue
            if t["status"] != STATUS_PENDING_APPROVAL:
                continue
            chore = self.get_chore(t["chore_id"])
            pending_approval.append({
                "task_id":      t["id"],
                "chore_id":     t["chore_id"],
                "name":         chore["name"] if chore else t["chore_id"],
                "description":  chore.get("description", "") if chore else "",
                "points":       chore.get("points", 0) if chore else 0,
                "completed_at": t.get("completed_at"),
                "status":       t["status"],
            })

        return {
            # v0.6.3 P2: sort by sort_order (admin drag-reorder) with name as
            # the tiebreaker for legacy rows still at sort_order=0.
            "due_today":        sorted(due_today, key=lambda x: (x.get("sort_order", 0), x["name"])),
            "overdue":          sorted(overdue,   key=lambda x: -x.get("days_overdue", 0)),
            "pending_approval": pending_approval,
        }

    def get_store_items_for_card(self, person_id: str, rank_index: int = 0) -> list[dict]:
        """Return store items visible to person_id with rank-adjusted points_cost.

        v0.6.3 item 13: group reward items include contributor progress rows enriched
        with each contributor's name/color so the card can render progress bars.
        """
        eff_ppd = self.get_rank_ppd(rank_index)
        result = []
        for i in self.get_store_items_for_person(person_id):
            row: dict = {
                "item_id":        i["id"],
                "name":           i["name"],
                "description":    i.get("description", ""),
                "dollar_value":   i.get("dollar_value", 0),
                "points_cost":    round(i.get("dollar_value", 0) * eff_ppd),
                "scope":          i.get("scope"),
                "person_ids":     i.get("person_ids", []),
                "sort_order":     i.get("sort_order", 0),
                "icon":           i.get("icon", "") or "",
                "category_label": i.get("category_label", "") or "",
                "max_per_period": i.get("max_per_period", 0),
                "period":         i.get("period", "week"),
                "next_available": self.get_next_available_date(
                    person_id, i["id"],
                    i.get("max_per_period", 0),
                    i.get("period", "week"),
                ),
                # v0.6.3 item 13: group reward fields
                "is_group_reward":  i.get("is_group_reward", False),
                "contributors":     [],
                # v0.6.5: subscription fields for kid-side store rendering
                "item_type":            i.get("item_type", ITEM_TYPE_ONE_TIME),
                "subscription_period":  i.get("subscription_period", ""),
                "subscription_anchor":  i.get("subscription_anchor", 1),
                # v0.7.6: reward gates — lock state + reason for the card
                "require_daily_pct":    i.get("require_daily_pct", 0),
                "min_rank_index":       i.get("min_rank_index", 0),
            }
            # v0.7.6: evaluate gates for this person and attach lock info.
            gate = self._reward_gate_status(person_id, i)
            row["locked"]      = gate["locked"]
            row["lock_reason"] = "; ".join(gate["reasons"])
            if i.get("is_group_reward"):
                # Enrich contributor list with name/color for the card renderer.
                enriched = []
                total_pts = round(i.get("dollar_value", 0) * eff_ppd)
                for c in i.get("contributors", []):
                    pid    = c.get("person_id", "")
                    person = self.get_person(pid)
                    enriched.append({
                        "person_id":       pid,
                        "person_name":     person["name"]          if person else "Unknown",
                        "person_color":    person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                        "share_pct":       c.get("share_pct", 0),
                        "target_pts":      round(total_pts * c.get("share_pct", 0) / 100),
                        "contributed_pts": c.get("contributed_pts", 0),
                        "is_me":           pid == person_id,
                    })
                row["contributors"] = enriched
            result.append(row)
        return result

    def get_approval_queue_for_card(self) -> list[dict]:
        queue = []
        for t in self.get_pending_approvals():
            chore  = self.get_chore(t["chore_id"])
            person = self.get_person(t.get("completed_by", ""))
            queue.append({
                "task_id":      t["id"],
                "chore_name":   chore["name"] if chore else t["chore_id"],
                "chore_points": chore.get("points", 0) if chore else 0,
                "person_id":    t.get("completed_by"),
                "person_name":  person["name"] if person else "Unknown",
                "person_color": person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "completed_at": t.get("completed_at"),
                "due_date":     t.get("due_date"),
            })
        return sorted(queue, key=lambda x: x.get("completed_at") or "")

    def get_redemption_queue_for_card(self) -> list[dict]:
        queue = []
        for r in self.get_pending_redemptions():
            person = self.get_person(r["person_id"])
            queue.append({
                "redemption_id": r["id"],
                "item_id":       r.get("store_item_id", ""),
                "item_name":     r["item_name"],
                "person_id":     r["person_id"],
                "person_name":   person["name"] if person else "Unknown",
                "person_color":  person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "points_cost":   r["points_cost"],
                "requested_at":  r.get("requested_at"),
            })
        return sorted(queue, key=lambda x: x.get("requested_at") or "")

    def get_maintenance_items_for_card(self) -> list[dict]:
        # v0.8.0 A4: the normalized union view (new maintenance_tasks + legacy
        # Maintenance chore instances) lives in MaintenanceMixin.get_maintenance_view.
        # It carries the same frozen item keys plus additive state/source_kind.
        return self.get_maintenance_view()

    def get_claimable_tasks_for_card(self) -> list[dict]:
        items = []
        for task in self.get_claimable_tasks():
            chore = self.get_chore(task["chore_id"])
            if not chore:
                continue
            subtype   = chore.get("claimable_subtype", CLAIMABLE_SUBTYPE_FCFS)
            max_c     = chore.get("max_claimants", 2)
            claim_cnt = task.get("claim_count", 0)
            pts_mode  = chore.get("multi_claim_points_mode", MULTI_CLAIM_POINTS_FULL)
            pts       = chore.get("points", 0)
            if subtype == CLAIMABLE_SUBTYPE_MULTI and pts_mode == MULTI_CLAIM_POINTS_SPLIT:
                pts_display = math.ceil(pts / max_c) if pts and max_c else pts
            else:
                pts_display = pts
            items.append({
                "task_id":               task["id"],
                "name":                  chore["name"],
                "description":           chore.get("description", ""),
                "points":                pts_display,
                "due_date":              task["due_date"],
                "claimable_subtype":     subtype,
                "max_claimants":         max_c,
                "claim_count":           claim_cnt,
                "slots_remaining":       max(0, max_c - claim_cnt) if subtype == CLAIMABLE_SUBTYPE_MULTI else 1,
                "multi_claim_points_mode": pts_mode,
                # v0.6.3 P2: admin drag-reorder
                "sort_order":            chore.get("sort_order", 0),
            })
        # v0.6.3 P2: claimable picker honors the admin chore order
        return sorted(items, key=lambda x: (x.get("sort_order", 0), x["name"]))

    def get_all_tasks_for_command_center(self) -> list[dict]:
        """
        All active non-maintenance assigned tasks for all people.
        Sorted: most overdue first, then today. Excludes maintenance and
        unassigned claimable tasks (those appear in their own section).

        v0.4.1 fix: also excludes instances with assigned_to=None that belong
        to non-claimable chores. These are ghost instances created when a chore
        was saved with an empty assigned_to list. They have no person to display
        on the command center and should not appear there.
        """
        today     = date.today()
        today_str = today.isoformat()
        items     = []

        for task in self.task_instances:
            if task["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue
            chore = self.get_chore(task["chore_id"])
            if not chore:
                continue
            if self._chore_is_maintenance(chore):
                continue

            chore_type = chore.get("chore_type", CHORE_TYPE_ASSIGNED)
            assigned   = task.get("assigned_to")

            # Skip unassigned claimable instances (rendered in their own section)
            if chore_type == CHORE_TYPE_CLAIMABLE and assigned is None:
                continue

            # Skip unowned non-claimable instances — these are ghost instances
            # from chores that were created/updated with no assigned_to. They
            # have no person to display and should not appear on the command center.
            if chore_type != CHORE_TYPE_CLAIMABLE and assigned is None:
                continue

            person     = self.get_person(assigned) if assigned else None
            due_date   = date.fromisoformat(task["due_date"])
            days_delta = (due_date - today).days

            # For non-daily recurring chores (weekly, n-days, n-weeks, monthly),
            # past-due instances are still in play until the next cycle replaces
            # them. Treat them as days_delta=0 ("today") on the command center so
            # they do not appear in the "Overdue" section. days_late is set so
            # the card can show a soft "Nd late" indicator.
            recurrence_type     = chore["recurrence"].get("type", RECURRENCE_DAILY)
            recurrence_weekdays = chore["recurrence"].get("weekdays", [])
            days_until_reset    = 0
            r_type              = recurrence_type
            if days_delta < 0 and r_type in (RECURRENCE_WEEKLY, RECURRENCE_EVERY_N_DAYS,
                                              RECURRENCE_EVERY_N_WEEKS, RECURRENCE_MONTHLY_ON_DATE):
                days_until_reset = _days_until_reset(chore, today)
                days_delta       = 0  # treat as today

            dp_threshold = chore.get("daily_penalty_after_days")
            dp_firing    = bool(
                dp_threshold
                and chore.get("penalty_enabled")
                and chore.get("penalty_points", 0)
                and (today - due_date).days > dp_threshold
            )

            items.append({
                "task_id":                 task["id"],
                "chore_id":                task["chore_id"],
                "name":                    chore["name"],
                "description":             chore.get("description", ""),
                "icon":                    chore.get("icon", ""),
                "points":                  chore.get("points", 0),
                "due_date":                task["due_date"],
                "days_delta":              days_delta,
                "recurrence_type":         recurrence_type,
                "recurrence_weekdays":     recurrence_weekdays,
                "days_until_reset":        days_until_reset,
                "status":                  task["status"],
                "category_label":          chore.get("category_label", ""),
                "assigned_to":             assigned,
                "person_name":             person["name"] if person else None,
                "person_color":            person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "approval_required":       chore.get("approval_required", True),
                "penalty_enabled":         chore.get("penalty_enabled", False),
                "penalty_points":          chore.get("penalty_points", 0),
                "daily_penalty_after_days": dp_threshold,
                "daily_penalty_firing":    dp_firing,
                "streak":                  self._get_streak(assigned, task["chore_id"]) if assigned else 0,
                "streak_milestone":        chore.get("streak_milestone", 0),
                # v0.6.3 P2: command-center order respects admin drag-reorder
                "sort_order":              chore.get("sort_order", 0),
            })

        # Show today + overdue only on command center. Sort by (most-overdue
        # first, then admin sort_order, then name as the final tiebreaker).
        return sorted(
            [i for i in items if i["days_delta"] <= 0],
            key=lambda x: (x["days_delta"], x.get("sort_order", 0), x["name"]),
        )

    def get_active_chores_for_card(self) -> list[dict]:
        """
        All active non-maintenance, non-one-time chores for the admin chore list.
        Sorted by sort_order then name.
        """
        result = []
        for c in self.get_active_chores():
            if self._chore_is_maintenance(c):
                continue
            if c["recurrence"].get("type") == RECURRENCE_ONE_TIME:
                continue
            assigned_names = []
            for pid in c.get("assigned_to", []):
                p = self.get_person(pid)
                if p:
                    assigned_names.append(p["name"])
            result.append({
                "chore_id":               c["id"],
                "name":                   c["name"],
                "description":            c.get("description", ""),
                "icon":                   c.get("icon", ""),
                "chore_type":             c.get("chore_type", CHORE_TYPE_ASSIGNED),
                "category_label":         c.get("category_label", ""),
                "sort_order":             c.get("sort_order", 0),
                "assigned_to":            c.get("assigned_to", []),
                "assigned_names":         assigned_names,
                "points":                 c.get("points", 0),
                "approval_required":      c.get("approval_required", True),
                "penalty_enabled":        c.get("penalty_enabled", False),
                "penalty_points":         c.get("penalty_points", 0),
                "daily_penalty_after_days": c.get("daily_penalty_after_days"),
                "expires_after_days":     c.get("expires_after_days"),
                "claimable_subtype":      c.get("claimable_subtype", CLAIMABLE_SUBTYPE_FCFS),
                "max_claimants":          c.get("max_claimants", 2),
                "multi_claim_points_mode": c.get("multi_claim_points_mode", MULTI_CLAIM_POINTS_FULL),
                "recurrence":             c.get("recurrence", {}),
                "streak_milestone":       c.get("streak_milestone", 0),
                "streak_bonus_points":    c.get("streak_bonus_points", 0),
                "rotation_pool":          c.get("rotation_pool", []),
                "rotation_cadence":       c.get("rotation_cadence", ""),
                "rotation_switch_weekday": c.get("rotation_switch_weekday", 0),
                "rotation_index":         c.get("rotation_index", 0),
            })
        return sorted(result, key=lambda x: (x["sort_order"], x["name"]))

    def get_all_chores_for_card(self) -> list[dict]:
        """
        All non-maintenance chores (active AND inactive, including one-time) for
        the admin chore list.  Includes an 'active' field so the card can style
        inactive rows differently and expose the toggle to parents.
        Sorted by sort_order then name.
        """
        result = []
        for c in self.chores:
            if not c.get("id"):
                continue
            if self._chore_is_maintenance(c):
                continue
            # One-time chores ARE included here (unlike the active-only view) so
            # they appear in the admin Chores list and can be filtered/reused.
            assigned_names = []
            for pid in c.get("assigned_to", []):
                p = self.get_person(pid)
                if p:
                    assigned_names.append(p["name"])
            result.append({
                "chore_id":               c["id"],
                "name":                   c["name"],
                "description":            c.get("description", ""),
                "icon":                   c.get("icon", ""),
                "chore_type":             c.get("chore_type", CHORE_TYPE_ASSIGNED),
                "category_label":         c.get("category_label", ""),
                "sort_order":             c.get("sort_order", 0),
                "assigned_to":            c.get("assigned_to", []),
                "assigned_names":         assigned_names,
                "points":                 c.get("points", 0),
                "approval_required":      c.get("approval_required", True),
                "penalty_enabled":        c.get("penalty_enabled", False),
                "penalty_points":         c.get("penalty_points", 0),
                "daily_penalty_after_days": c.get("daily_penalty_after_days"),
                "expires_after_days":     c.get("expires_after_days"),
                "claimable_subtype":      c.get("claimable_subtype", CLAIMABLE_SUBTYPE_FCFS),
                "max_claimants":          c.get("max_claimants", 2),
                "multi_claim_points_mode": c.get("multi_claim_points_mode", MULTI_CLAIM_POINTS_FULL),
                "recurrence":             c.get("recurrence", {}),
                "streak_milestone":       c.get("streak_milestone", 0),
                "streak_bonus_points":    c.get("streak_bonus_points", 0),
                "rotation_pool":          c.get("rotation_pool", []),
                "rotation_cadence":       c.get("rotation_cadence", ""),
                "rotation_index":         c.get("rotation_index", 0),
                "active":                 c.get("active", True),
            })
        return sorted(result, key=lambda x: (x["sort_order"], x["name"]))

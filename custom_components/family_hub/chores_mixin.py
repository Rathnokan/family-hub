"""Family Hub - ChoresMixin (extracted from data_store.py, v0.7.0 P4).

Chore definitions CRUD + one-time task creation.
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


class ChoresMixin:
    # ------------------------------------------------------------------
    # Chores (definitions)
    # ------------------------------------------------------------------

    @property
    def chores(self) -> list[dict]:
        return self._data.get("chores", [])

    def get_chore(self, chore_id: str) -> dict | None:
        return next((c for c in self.chores if c["id"] == chore_id), None)

    def get_active_chores(self) -> list[dict]:
        return [c for c in self.chores if c.get("active", True)]

    def _chore_is_maintenance(self, chore: dict) -> bool:
        """A chore belongs to the maintenance card if its label is 'Maintenance'."""
        return chore.get("category_label", "") == "Maintenance"

    async def async_add_chore(
        self,
        name: str,
        chore_type: str = CHORE_TYPE_ASSIGNED,
        assigned_to: list[str] | None = None,
        points: int = 10,
        approval_required: bool = True,
        recurrence_type: str = RECURRENCE_DAILY,
        recurrence_config: dict | None = None,
        description: str = "",
        category_label: str = "",
        sort_order: int | None = None,
        penalty_enabled: bool = False,
        penalty_points: int = 0,
        daily_penalty_after_days: int | None = None,
        expires_after_days: int | None = None,
        claimable_subtype: str = CLAIMABLE_SUBTYPE_FCFS,
        max_claimants: int = 2,
        multi_claim_points_mode: str = MULTI_CLAIM_POINTS_FULL,
        streak_milestone: int = 0,
        streak_bonus_points: int = 0,
        reminder_time: int = -1,
        rotation_pool: list[str] | None = None,
        rotation_cadence: str = "",
        icon: str | None = None,
        created_by: str | None = None,
    ) -> dict:
        # Determine next sort order if not provided
        if sort_order is None:
            existing = self.get_active_chores()
            sort_order = max((c.get("sort_order", 0) for c in existing), default=-1) + 1

        rec = {"type": recurrence_type}
        if recurrence_config:
            rec.update(recurrence_config)
        rec.setdefault("weekdays", [])
        rec.setdefault("day_filter", [])
        rec.setdefault("interval", 1)

        chore = {
            "id": _new_id(),
            "name": name,
            "description": description,
            "icon": icon,
            "chore_type": chore_type,
            # Keep category for legacy compat — matches chore_type value
            "category": chore_type,
            "category_label": category_label,
            "sort_order": sort_order,
            "assigned_to": assigned_to or [],
            "points": points,
            "approval_required": approval_required,
            "penalty_enabled": penalty_enabled,
            "penalty_points": penalty_points,
            "daily_penalty_after_days": daily_penalty_after_days,
            "expires_after_days": expires_after_days,  # None = no expiry
            "claimable_subtype": claimable_subtype,
            "max_claimants": max_claimants,
            "multi_claim_points_mode": multi_claim_points_mode,
            "streak_milestone":        streak_milestone,
            "streak_bonus_points":     streak_bonus_points,
            "reminder_time":           reminder_time,
            "rotation_pool":           list(rotation_pool or []),
            "rotation_cadence":        rotation_cadence or "",
            "rotation_index":          0,
            "rotation_last_advanced":  "",
            "recurrence": rec,
            "active": True,
            "created_at": _now_iso(),
            "created_by": created_by,
        }
        # Rotation: when a pool is configured, override assigned_to with the
        # first active pool member. This keeps "active assignee" as the single
        # source of truth — assigned_to + rotation_index always agree.
        if chore["rotation_pool"]:
            active_ids = self._active_rotation_ids(chore["rotation_pool"])
            if active_ids:
                chore["assigned_to"] = [active_ids[0]]
                chore["rotation_index"] = chore["rotation_pool"].index(active_ids[0])

        self._data["chores"].append(chore)
        self._append_history(
            event_type=HISTORY_TASK_ADDED,
            reference_id=chore["id"],
            person_id=created_by,
            note=f'Chore "{name}" created',
        )

        # Generate first task instance(s)
        today = date.today()
        if chore_type == CHORE_TYPE_CLAIMABLE:
            # Claimable chores get one shared instance (no assigned_to)
            await self._async_create_task_instance(chore, today, person_id=None)
        else:
            people_to_assign = assigned_to if assigned_to else []
            if people_to_assign:
                for pid in people_to_assign:
                    await self._async_create_task_instance(chore, today, person_id=pid)
            elif chore_type == CHORE_TYPE_REMINDER:
                # Reminders can exist without an owner (house-level reminders)
                await self._async_create_task_instance(chore, today, person_id=None)
            # else: assigned chore with no people yet — no instance until people are added

        await self.async_save()
        return chore

    async def async_update_chore(self, chore_id: str, **kwargs: Any) -> dict | None:
        """
        Update a chore definition.

        When assigned_to changes, all pending task instances for this chore
        are updated to match the new assignment so they appear in the right
        people's task lists immediately.
        """
        chore = self.get_chore(chore_id)
        if not chore:
            return None

        allowed = {
            "name", "description", "icon", "chore_type", "category_label",
            "sort_order", "assigned_to", "points", "approval_required",
            "penalty_enabled", "penalty_points", "daily_penalty_after_days",
            "expires_after_days", "claimable_subtype", "max_claimants",
            "multi_claim_points_mode", "streak_milestone", "streak_bonus_points",
            "reminder_time", "rotation_pool", "rotation_cadence",
            "recurrence", "active", "weekdays", "day_filter", "interval",
        }
        old_assigned = list(chore.get("assigned_to", []))
        old_pool     = list(chore.get("rotation_pool", []))

        for key, val in kwargs.items():
            if key not in allowed:
                continue
            # Recurrence sub-fields can be passed at top level
            if key in {"weekdays", "day_filter", "interval"}:
                chore["recurrence"][key] = val
            elif key == "assigned_to":
                # Ensure it's always a list
                chore["assigned_to"] = val if isinstance(val, list) else ([val] if val else [])
            elif key == "rotation_pool":
                chore["rotation_pool"] = list(val) if isinstance(val, list) else []
            else:
                chore[key] = val

        # Keep legacy category field in sync with chore_type
        if "chore_type" in kwargs:
            chore["category"] = chore["chore_type"]

        # Rotation pool changes: reset the index, then snap assigned_to to the
        # first active pool member so the next instance generated is correct.
        # When the pool is cleared, leave assigned_to untouched — the parent
        # may want to manually re-assign.
        if "rotation_pool" in kwargs and chore.get("rotation_pool") != old_pool:
            chore["rotation_index"]         = 0
            chore["rotation_last_advanced"] = ""
            new_pool = chore.get("rotation_pool") or []
            if new_pool:
                active_ids = self._active_rotation_ids(new_pool)
                if active_ids:
                    chore["assigned_to"]    = [active_ids[0]]
                    chore["rotation_index"] = new_pool.index(active_ids[0])

        new_assigned = chore.get("assigned_to", [])

        # Auto-deactivate an assigned chore when all assignees are removed,
        # unless the caller explicitly passed active= in kwargs.
        if (
            chore.get("chore_type") == CHORE_TYPE_ASSIGNED
            and old_assigned
            and not new_assigned
            and "active" not in kwargs
        ):
            chore["active"] = False

        # Sync pending task instances to new assignment when it has changed.
        #
        # The previous logic collapsed all existing instances to a single one
        # and left assigned_to=None when there were multiple assignees, which
        # caused the instances to vanish from everyone's personal dashboard.
        #
        # Correct behaviour:
        #   1. Remove (delete) any pending instances whose assigned_to person
        #      is no longer in the new assignment list — they are orphaned.
        #   2. For each person newly added to the assignment list, create a
        #      fresh instance for today (the next tick will handle future dates).
        #   3. Leave instances that already have the correct assigned_to alone.
        if old_assigned != new_assigned:
            today = date.today()

            # Collect the due dates of existing active instances so we can
            # create matching new ones (avoids duplicate today instance when
            # one already exists for a person who stays assigned).
            existing_by_person: dict[str | None, set[str]] = {}
            for instance in self._data["task_instances"]:
                if instance["chore_id"] != chore_id:
                    continue
                if instance["status"] not in ACTIVE_STATUSES:
                    continue
                pid = instance.get("assigned_to")
                existing_by_person.setdefault(pid, set()).add(instance["due_date"])

            # Step 1: remove pending instances for people no longer assigned.
            # When new_assigned is empty the chore is being deactivated — purge
            # all pending instances so they stop showing on kids' task lists.
            # Previously we kept them ("unassigned chore stays as-is") but now
            # empty assigned_to triggers auto-deactivation, so keeping orphaned
            # instances would be confusing.
            if new_assigned:
                self._data["task_instances"] = [
                    t for t in self._data["task_instances"]
                    if not (
                        t["chore_id"] == chore_id
                        and t["status"] in ACTIVE_STATUSES
                        and t.get("assigned_to") not in new_assigned
                        and t.get("assigned_to") is not None  # never remove unowned instances here
                    )
                ]
            else:
                # All assignees removed — purge all pending instances for this chore.
                self._data["task_instances"] = [
                    t for t in self._data["task_instances"]
                    if not (t["chore_id"] == chore_id and t["status"] in ACTIVE_STATUSES)
                ]

            # Step 2: create new instances for people who were just added.
            added_people = [pid for pid in new_assigned if pid not in old_assigned]
            today_str = today.isoformat()
            for pid in added_people:
                # Only create a today instance if one doesn't already exist
                already_has_today = today_str in existing_by_person.get(pid, set())
                if not already_has_today:
                    await self._async_create_task_instance(chore, today, person_id=pid)

        await self.async_save()
        return chore

    async def async_delete_chore(self, chore_id: str) -> bool:
        """
        Hard-delete a chore: remove the definition entirely and purge ALL of
        its task instances (every status).

        Safe because the data that matters is stored independently:
          - Point balances live on each person record (never recomputed from
            instances), so removing instances can't change anyone's balance.
          - The history log keeps its own denormalized chore_name, so the
            activity log still reads correctly after the chore is gone.
          - Person-level completion streaks are stored counters, not derived
            from instances.

        For a recoverable "turn this off for now" state, set active=False
        (via update_chore / the admin Active toggle) instead — that keeps the
        definition and lets you re-engage it later. Delete is permanent.
        """
        chore = self.get_chore(chore_id)
        if not chore:
            return False
        self._data["chores"] = [
            c for c in self._data["chores"] if c.get("id") != chore_id
        ]
        self._data["task_instances"] = [
            t for t in self._data["task_instances"] if t.get("chore_id") != chore_id
        ]
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # One-time tasks (separated from recurring chores)
    # ------------------------------------------------------------------

    async def async_add_task(
        self,
        name: str,
        assigned_to: list[str] | None = None,
        points: int = 0,
        description: str = "",
        approval_required: bool = False,
        expires_after_days: int | None = None,
        penalty_enabled: bool = False,
        penalty_points: int = 0,
        created_by: str | None = None,
    ) -> dict:
        """
        Create a one-time task. Does not appear in the chore management list.
        Uses chore_type=assigned + recurrence=one_time internally.
        expires_after_days: if set, the pending instance is auto-skipped after
        this many days (with penalty if penalty_enabled, applied by
        _async_expire_tasks when the deadline passes).
        """
        return await self.async_add_chore(
            name=name,
            chore_type=CHORE_TYPE_ASSIGNED,
            assigned_to=assigned_to or [],
            points=points,
            approval_required=approval_required,
            recurrence_type=RECURRENCE_ONE_TIME,
            description=description,
            category_label="",
            expires_after_days=expires_after_days,
            penalty_enabled=penalty_enabled,
            penalty_points=penalty_points,
            created_by=created_by,
        )


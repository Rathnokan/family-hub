"""Family Hub - PeopleMixin (extracted from data_store.py, v0.7.0 P4).

People CRUD + point award/deduct.
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


class PeopleMixin:
    # ------------------------------------------------------------------
    # People
    # ------------------------------------------------------------------

    @property
    def people(self) -> list[dict]:
        return self._data.get("people", [])

    def get_person(self, person_id: str) -> dict | None:
        return next((p for p in self.people if p["id"] == person_id), None)

    def get_active_people(self) -> list[dict]:
        return [p for p in self.people if p.get("active", True)]

    async def async_add_person(
        self,
        name: str,
        person_type: str = "kid",
        ha_user_id: str | None = None,
        avatar_color: str | None = None,
    ) -> dict:
        person = {
            "id": _new_id(),
            "name": name,
            "type": person_type,
            "ha_user_id": ha_user_id,
            "avatar_color": avatar_color or "#7F77DD",
            "active": True,
            "points_balance": 0,
            "points_lifetime": 0,
            "created_at": _now_iso(),
            "code": "",
            "theme_key": "classic",
            # v0.6.0 S5: rank
            "rank_index": 999 if person_type == "parent" else 0,
            "rank_drop_threshold": None,
            "rank_gain_threshold": None,
            # v0.7.2: per-rank threshold curves (length-5 arrays) + remembered knobs
            "rank_drop_thresholds": None,
            "rank_gain_thresholds": None,
            "rank_curve": None,
            "child_mode": False,
            # v0.6.1: success-rate person streak
            "completion_streak":          0,
            "completion_threshold_pct":   80,
            "completion_milestone":       7,
            "completion_bonus_points":    50,
            "last_completion_eval_date":  None,
            # v0.6.3: store goal item (empty = none)
            "goal_item_id":               "",
            # v0.6.3 item 7: streak freeze tokens
            "streak_freezes_available":   0,
        }
        self._data["people"].append(person)
        self._append_history(
            event_type=HISTORY_PERSON_ADDED,
            person_id=person["id"],
            reference_id=person["id"],
            note=f"{name} added as {person_type}",
        )
        await self.async_save()
        return person

    async def async_update_person(self, person_id: str, **kwargs: Any) -> dict | None:
        person = self.get_person(person_id)
        if not person:
            return None
        allowed = {
            "name", "ha_user_id", "avatar_color", "active", "type", "penalties_paused",
            # v0.5.0: allowance
            "allowance_points", "allowance_schedule", "allowance_weekday", "allowance_monthday",
            # v0.5.0: notification target
            "notify_target",
            # v0.6.0: codename + theme
            "code", "theme_key",
            # v0.6.0 S5: rank
            "rank_index", "rank_drop_threshold", "rank_gain_threshold",
            # v0.7.2: per-rank threshold curves + remembered generator knobs
            "rank_drop_thresholds", "rank_gain_thresholds", "rank_curve",
            # v0.6.0 S6: large-button mode
            "child_mode",
            # v0.6.1: success-rate person streak (admin-configurable knobs)
            "completion_streak",
            "completion_threshold_pct", "completion_milestone", "completion_bonus_points",
            # v0.6.3: store goal item
            "goal_item_id",
            # v0.6.3 item 7: streak freeze tokens (admin can also top up)
            "streak_freezes_available",
        }
        for key, val in kwargs.items():
            if key in allowed:
                person[key] = val
        await self.async_save()
        return person

    async def async_remove_person(self, person_id: str) -> bool:
        """
        Deactivate a person. Historical data is preserved.
        Pending task instances assigned to this person are removed — no new
        ones will be generated since daily tick skips inactive people.
        """
        person = self.get_person(person_id)
        if not person:
            return False
        person["active"] = False
        # Remove pending task instances for this person
        self._data["task_instances"] = [
            t for t in self._data["task_instances"]
            if not (t.get("assigned_to") == person_id and t["status"] in ACTIVE_STATUSES)
        ]
        await self.async_save()
        return True

    async def async_reactivate_person(self, person_id: str) -> bool:
        """Reactivate a previously-deactivated person (e.g. back from camp). Their
        next daily tick regenerates task instances for any chores they're assigned
        to; the sensor is re-created by the service handler."""
        person = self.get_person(person_id)
        if not person:
            return False
        person["active"] = True
        await self.async_save()
        return True

    async def async_hard_delete_person(self, person_id: str) -> bool:
        """Permanently remove an INACTIVE person and purge ALL their data: task
        instances, redemptions, subscriptions, history entries, and any group-reward
        contributions. Active people cannot be hard-deleted — deactivate first.
        Irreversible; for cleanup of people who have truly left."""
        person = self.get_person(person_id)
        if not person:
            return False
        if person.get("active", True):
            _LOGGER.warning(
                "Family Hub: refusing to hard-delete ACTIVE person %s — deactivate first",
                person_id,
            )
            return False

        d = self._data
        d["people"] = [p for p in d.get("people", []) if p.get("id") != person_id]
        d["task_instances"] = [
            t for t in d.get("task_instances", [])
            if t.get("assigned_to") != person_id and t.get("completed_by") != person_id
        ]
        d["redemptions"]  = [r for r in d.get("redemptions", [])  if r.get("person_id") != person_id]
        d["subscriptions"] = [s for s in d.get("subscriptions", []) if s.get("person_id") != person_id]
        d["history"]      = [h for h in d.get("history", [])      if h.get("person_id") != person_id]
        # Drop any group-reward contributions by this person.
        for item in d.get("store_items", []):
            if item.get("contributors"):
                item["contributors"] = [c for c in item["contributors"] if c.get("person_id") != person_id]
        for prop in d.get("group_reward_proposals", []):
            if prop.get("contributors"):
                prop["contributors"] = [c for c in prop["contributors"] if c.get("person_id") != person_id]

        await self.async_save()
        _LOGGER.info("Family Hub: hard-deleted person %s and purged their data", person_id)
        return True

    async def async_award_points(
        self, person_id: str, points: int, reference_id: str, note: str = ""
    ) -> dict | None:
        person = self.get_person(person_id)
        if not person:
            return None
        person["points_balance"]  = person.get("points_balance", 0)  + points
        person["points_lifetime"] = person.get("points_lifetime", 0) + points
        self._append_history(
            event_type=HISTORY_POINTS_AWARDED,
            person_id=person_id,
            reference_id=reference_id,
            points_delta=points,
            balance_after=person["points_balance"],
            note=note,
        )
        await self.async_save()
        return person

    async def async_deduct_points(
        self, person_id: str, points: int, reference_id: str, note: str = ""
    ) -> dict | None:
        """Deduct from spendable balance only — lifetime total unchanged."""
        person = self.get_person(person_id)
        if not person:
            return None
        person["points_balance"] = max(0, person.get("points_balance", 0) - points)
        self._append_history(
            event_type=HISTORY_POINTS_AWARDED,
            person_id=person_id,
            reference_id=reference_id,
            points_delta=-points,
            balance_after=person["points_balance"],
            note=note,
        )
        await self.async_save()
        return person

    async def async_award_bonus_points(
        self,
        person_id: str,
        points: int = 0,
        reason: str = "",
        dollar_amount: float | None = None,
    ) -> dict | None:
        if dollar_amount is not None:
            points = round(dollar_amount * self.points_per_dollar)
        if points <= 0:
            _LOGGER.warning("Family Hub: award_bonus_points called with zero or negative value")
            return None
        note = f"Bonus (${dollar_amount:.2f}): {reason}".rstrip(": ") if dollar_amount else f"Bonus: {reason}"
        return await self.async_award_points(person_id, points, _new_id(), note)

    async def async_admin_deduct_points(
        self,
        person_id: str,
        points: int = 0,
        reason: str = "",
        dollar_amount: float | None = None,
    ) -> dict | None:
        if dollar_amount is not None:
            points = round(dollar_amount * self.points_per_dollar)
        if points <= 0:
            _LOGGER.warning("Family Hub: deduct_points called with zero or negative value")
            return None
        note = f"Deduction (${dollar_amount:.2f}): {reason}".rstrip(": ") if dollar_amount else f"Deduction: {reason}"
        return await self.async_deduct_points(person_id, points, _new_id(), note)


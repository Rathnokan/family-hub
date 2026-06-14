"""Family Hub - StoreItemsMixin (extracted from data_store.py, v0.7.0 P4).

Store-item CRUD.
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


class StoreItemsMixin:
    # ------------------------------------------------------------------
    # Store items
    # ------------------------------------------------------------------

    @property
    def store_items(self) -> list[dict]:
        return self._data.get("store_items", [])

    def get_store_item(self, item_id: str) -> dict | None:
        return next((i for i in self.store_items if i["id"] == item_id), None)

    def get_store_items_for_person(self, person_id: str) -> list[dict]:
        """Return common items + items where person_id is in person_ids list.

        v0.6.3: sorted by sort_order (admin drag-reorder) with name as the
        deterministic tie-breaker for legacy items at sort_order=0.
        v0.6.3 item 13: group rewards are also returned if the person is listed
        as a contributor, regardless of scope.
        """
        items = [
            i for i in self.store_items
            if i.get("active", True) and (
                i.get("scope") == SCOPE_COMMON
                or (
                    i.get("scope") == SCOPE_PERSONAL
                    and person_id in (i.get("person_ids") or [])
                )
                or (
                    i.get("is_group_reward")
                    and any(c.get("person_id") == person_id for c in i.get("contributors", []))
                )
            )
        ]
        return sorted(items, key=lambda x: (x.get("sort_order", 0), x.get("name", "")))

    def _dollar_to_points(self, dollar_value: float) -> int:
        return round(dollar_value * self.points_per_dollar)

    async def async_add_store_item(
        self,
        name: str,
        dollar_value: float,
        scope: str = SCOPE_COMMON,
        person_ids: list[str] | None = None,
        description: str = "",
        icon: str = "",
        category_label: str = "",
        max_per_period: int = 0,
        period: str = "week",
        is_group_reward: bool = False,
        contributors: list[dict] | None = None,
        item_type: str = ITEM_TYPE_ONE_TIME,
        subscription_period: str = "",
        subscription_anchor: int = 1,
        require_daily_pct: int = 0,
        min_rank_index: int = 0,
    ) -> dict:
        # v0.6.3: place new items at the end of the sort_order ladder so the
        # drag-reorder bisect math doesn't collide with existing positions.
        max_sort = max(
            (i.get("sort_order", 0) for i in self._data["store_items"]),
            default=0,
        )
        # When creating a group reward, compute target_pts for each contributor
        # based on their share_pct and the item's points_cost.
        points_cost = self._dollar_to_points(dollar_value)
        resolved_contributors: list[dict] = []
        if is_group_reward and contributors:
            for c in contributors:
                resolved_contributors.append({
                    "person_id":       c.get("person_id", ""),
                    "share_pct":       int(c.get("share_pct", 0)),
                    "contributed_pts": int(c.get("contributed_pts", 0)),
                    "target_pts":      round(points_cost * int(c.get("share_pct", 0)) / 100),
                })
        item = {
            "id": _new_id(),
            "name": name,
            "description": description,
            "dollar_value": dollar_value,
            "points_cost": points_cost,
            "scope": scope,
            "person_ids": person_ids if scope == SCOPE_PERSONAL else [],
            "active": True,
            "created_at": _now_iso(),
            "sort_order": max_sort + 10,
            "icon": icon or "",
            "category_label": category_label or "",
            "max_per_period": max(0, int(max_per_period)),
            "period": period if period in ("day", "week", "month") else "week",
            # v0.6.3 item 13: group / shared reward
            "is_group_reward": is_group_reward,
            "contributors":    resolved_contributors,
            # v0.6.5: subscription fields
            "item_type":            item_type if item_type in (ITEM_TYPE_ONE_TIME, ITEM_TYPE_SUBSCRIPTION) else ITEM_TYPE_ONE_TIME,
            "subscription_period":  subscription_period,
            "subscription_anchor":  subscription_anchor,
            # v0.7.6: reward gates (0 = off for both)
            "require_daily_pct":    max(0, min(100, int(require_daily_pct))),
            "min_rank_index":       max(0, int(min_rank_index)),
        }
        self._data["store_items"].append(item)
        await self.async_save()
        return item

    async def async_update_store_item(self, item_id: str, **kwargs: Any) -> dict | None:
        item = self.get_store_item(item_id)
        if not item:
            return None
        allowed = {"name", "description", "dollar_value", "scope", "person_ids", "active",
                   "sort_order", "icon", "category_label", "max_per_period", "period",
                   "is_group_reward", "contributors",
                   "item_type", "subscription_period", "subscription_anchor",
                   "require_daily_pct", "min_rank_index"}
        for key, val in kwargs.items():
            if key in allowed:
                item[key] = val
        # v0.7.6: clamp gate values defensively
        if "require_daily_pct" in kwargs:
            item["require_daily_pct"] = max(0, min(100, int(item.get("require_daily_pct", 0) or 0)))
        if "min_rank_index" in kwargs:
            item["min_rank_index"] = max(0, int(item.get("min_rank_index", 0) or 0))
        if "dollar_value" in kwargs:
            item["points_cost"] = self._dollar_to_points(item["dollar_value"])
        await self.async_save()
        return item

    async def async_delete_store_item(self, item_id: str) -> bool:
        """Soft-delete: set active=False. Item remains in store_items list."""
        item = self.get_store_item(item_id)
        if not item:
            return False
        item["active"] = False
        await self.async_save()
        return True

    async def async_hard_delete_store_item(self, item_id: str) -> bool:
        """Hard-delete: physically remove item and cancel any pending redemptions for it.

        v0.6.3 item 13: also refunds contributed_pts to each contributor when a
        group reward is deleted, and marks any open proposals for this item as declined.
        """
        item = self.get_store_item(item_id)
        if not item:
            return False
        # Cancel pending redemptions referencing this item
        for r in self._data.get("redemptions", []):
            if (r.get("store_item_id") == item_id
                    and r.get("status") == REDEMPTION_PENDING):
                r["status"]      = REDEMPTION_DECLINED
                r["resolved_at"] = _now_iso()
                r["resolved_by"] = "system"
                r["note"]        = "Reward deleted by admin"
        # v0.6.3 item 13: refund chipped-in points to each contributor
        if item.get("is_group_reward"):
            for contrib in item.get("contributors", []):
                pid  = contrib.get("person_id")
                pts  = contrib.get("contributed_pts", 0)
                if pid and pts > 0:
                    person = self.get_person(pid)
                    if person:
                        person["points_balance"] = person.get("points_balance", 0) + pts
                        self._append_history(
                            event_type=HISTORY_GROUP_CHIP_IN,
                            person_id=pid,
                            reference_id=item_id,
                            points_delta=pts,
                            balance_after=person["points_balance"],
                            note=f'Refund: group reward "{item["name"]}" deleted',
                        )
        # v0.6.3 item 13: cancel any open proposals for this item
        now = _now_iso()
        for prop in self._data.get("group_reward_proposals", []):
            if (prop.get("item_id") == item_id
                    and prop.get("status") not in (PROPOSAL_APPROVED, PROPOSAL_DECLINED)):
                prop["status"]      = PROPOSAL_DECLINED
                prop["resolved_at"] = now
                prop["resolved_by"] = "system"
                prop["note"]        = "Reward deleted by admin"
        # Remove from list
        self._data["store_items"] = [
            i for i in self._data["store_items"] if i["id"] != item_id
        ]
        await self.async_save()
        return True


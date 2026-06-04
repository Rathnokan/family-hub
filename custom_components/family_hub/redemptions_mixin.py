"""Family Hub - RedemptionsMixin (extracted from data_store.py, v0.7.0 P4).

Reward redemption request/approve/decline.
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


class RedemptionsMixin:
    # ------------------------------------------------------------------
    # Redemptions
    # ------------------------------------------------------------------

    @property
    def redemptions(self) -> list[dict]:
        return self._data.get("redemptions", [])

    def get_redemption(self, redemption_id: str) -> dict | None:
        return next((r for r in self.redemptions if r["id"] == redemption_id), None)

    def get_pending_redemptions(self) -> list[dict]:
        return [r for r in self.redemptions if r["status"] == REDEMPTION_PENDING]

    async def async_request_redemption(self, person_id: str, item_id: str) -> dict | None:
        person = self.get_person(person_id)
        item   = self.get_store_item(item_id)
        if not person or not item:
            return None
        # Rate-limit check (item 5)
        max_pp = item.get("max_per_period", 0)
        if max_pp > 0:
            period = item.get("period", "week")
            if self._count_period_redemptions(person_id, item_id, period, date.today()) >= max_pp:
                _LOGGER.warning(
                    "Family Hub: redemption rate limit reached for %s / %s",
                    person_id, item_id,
                )
                return None
        # Use rank-adjusted cost (item 6)
        rank_index  = person.get("rank_index", 0)
        points_cost = round(item.get("dollar_value", 0) * self.get_rank_ppd(rank_index))
        if person["points_balance"] < points_cost:
            _LOGGER.warning("Family Hub: insufficient points for redemption")
            return None
        redemption = {
            "id": _new_id(),
            "store_item_id": item_id,
            "person_id": person_id,
            "points_cost": points_cost,
            "item_name": item["name"],
            "status": REDEMPTION_PENDING,
            "requested_at": _now_iso(),
            "resolved_at": None,
            "resolved_by": None,
            "note": "",
        }
        self._data["redemptions"].append(redemption)
        self._append_history(
            event_type=HISTORY_REDEMPTION_REQUESTED,
            person_id=person_id,
            reference_id=redemption["id"],
            note=f'{person["name"]} requested "{item["name"]}" ({points_cost}pts)',
        )
        await self.async_save()
        return redemption

    async def async_approve_redemption(
        self,
        redemption_id: str,
        approved_by: str,
        *,
        subscription_anchor: int | None = None,
    ) -> dict | None:
        redemption = self.get_redemption(redemption_id)
        if not redemption or redemption["status"] != REDEMPTION_PENDING:
            return None
        person = self.get_person(redemption["person_id"])
        if not person:
            return None

        item         = self.get_store_item(redemption.get("store_item_id", ""))
        is_sub_item  = item and item.get("item_type") == ITEM_TYPE_SUBSCRIPTION

        # Re-check affordability at approval time for one-time redemptions.
        # The balance can drop between request and approval (other approvals,
        # subscription renewals, penalties). async_deduct_points floors at 0, so
        # without this guard an approval could hand out a reward for free. Leave
        # the redemption PENDING so the parent can still award points or decline.
        # (Subscriptions are handled by async_subscribe below, which does its own
        # affordability check.)
        if not is_sub_item and person.get("points_balance", 0) < redemption["points_cost"]:
            _LOGGER.warning(
                "Family Hub: approve_redemption — %s can no longer afford '%s' "
                "(balance=%d cost=%d); leaving request pending",
                redemption["person_id"], redemption.get("item_name", ""),
                person.get("points_balance", 0), redemption["points_cost"],
            )
            return None

        redemption["status"]      = REDEMPTION_APPROVED
        redemption["resolved_at"] = _now_iso()
        redemption["resolved_by"] = approved_by

        if is_sub_item:
            # Subscription approval: async_subscribe handles point deduction.
            # Do NOT deduct here — that would double-charge the kid.
            sub = await self.async_subscribe(
                redemption["person_id"],
                redemption.get("store_item_id", ""),
                anchor_override=subscription_anchor,
            )
            if not sub:
                # async_subscribe already logged the reason; revert the redemption.
                redemption["status"]      = REDEMPTION_PENDING
                redemption["resolved_at"] = None
                redemption["resolved_by"] = None
                await self.async_save()
                return None
            self._append_history(
                event_type=HISTORY_REDEMPTION_APPROVED,
                person_id=redemption["person_id"],
                reference_id=redemption_id,
                chore_name=redemption.get("item_name", ""),
                note=f"Subscription approved by {approved_by}",
            )
        else:
            await self.async_deduct_points(
                redemption["person_id"],
                redemption["points_cost"],
                redemption_id,
                f'Redeemed "{redemption["item_name"]}"',
            )
            self._append_history(
                event_type=HISTORY_REDEMPTION_APPROVED,
                person_id=redemption["person_id"],
                reference_id=redemption_id,
                points_delta=-redemption["points_cost"],
                balance_after=person.get("points_balance", 0),
                chore_name=redemption.get("item_name", ""),
                note=f"Approved by {approved_by}",
            )

        await self.async_save()
        return redemption

    async def async_decline_redemption(
        self, redemption_id: str, declined_by: str, reason: str = ""
    ) -> dict | None:
        redemption = self.get_redemption(redemption_id)
        if not redemption or redemption["status"] != REDEMPTION_PENDING:
            return None
        redemption["status"]      = REDEMPTION_DECLINED
        redemption["resolved_at"] = _now_iso()
        redemption["resolved_by"] = declined_by
        redemption["note"]        = reason
        self._append_history(
            event_type=HISTORY_REDEMPTION_DECLINED,
            person_id=redemption["person_id"],
            reference_id=redemption_id,
            note=f"Declined by {declined_by}. {reason}".strip(),
        )
        await self.async_save()
        return redemption


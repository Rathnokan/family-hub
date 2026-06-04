"""Family Hub - SubscriptionsMixin (extracted from data_store.py, v0.7.0 P4).

Recurring-reward subscriptions: tick processing, CRUD, card shapers.
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


class SubscriptionsMixin:
    async def _async_process_subscriptions(self, tick_date: date) -> None:
        """Process subscription renewals and lapses for tick_date.

        Runs for every day in the catch-up loop so missed days accumulate
        debt correctly.  cancel_pending subs continue renewing — the parent
        still needs to act.  Only the first lapse per subscription triggers
        a notification; subsequent missed periods silently add to debt.
        """
        subscriptions = self._data.get("subscriptions", [])
        tick_str = tick_date.isoformat()

        for sub in subscriptions:
            if sub["status"] == SUB_STATUS_CANCELED:
                continue
            if tick_str < sub["next_renewal_date"]:
                continue

            person = self.get_person(sub["person_id"])
            item   = self.get_store_item(sub["item_id"])
            if not person or not person.get("active", True):
                continue
            if not item or not item.get("active", True):
                continue

            # Honour a dollar_cost_override of EXACTLY 0 ("free") — `or` would
            # treat 0 as unset and fall back to the item price, charging the kid
            # the full amount while the card rail shows 0. Mirror the card-side
            # logic in get_subscriptions_for_person (is-not-None).
            _override  = sub.get("dollar_cost_override")
            _dollar    = _override if _override is not None else item.get("dollar_value", 0)
            cost       = round(_dollar * self.get_rank_ppd(person.get("rank_index", 0)))
            total_owed = cost + sub.get("accumulated_debt", 0)

            if person.get("points_balance", 0) >= total_owed:
                # --- Renewal / debt recovery ---
                person["points_balance"] = person.get("points_balance", 0) - total_owed
                sub["missed_renewals"]   = 0
                sub["accumulated_debt"]  = 0
                # cancel_pending stays pending — parent still needs to approve
                if sub["status"] != SUB_STATUS_CANCEL_PENDING:
                    sub["status"] = SUB_STATUS_ACTIVE
                sub["next_renewal_date"] = _advance_renewal_date(
                    sub["period"], sub["anchor"], sub["next_renewal_date"]
                )
                self._append_history(
                    event_type=HISTORY_SUBSCRIPTION_RENEWED,
                    person_id=sub["person_id"],
                    reference_id=sub["id"],
                    points_delta=-total_owed,
                    balance_after=person["points_balance"],
                    note=item.get("name", ""),
                )
                _LOGGER.info(
                    "Family Hub: subscription %s renewed for %s — -%d pts (debt cleared)",
                    sub["id"], person.get("name"), total_owed,
                )
            else:
                # --- Lapse ---
                # Notify on the FIRST missed renewal regardless of current status.
                # Keying off "status == active" missed cancel_pending subs, whose
                # debt would then grow silently while awaiting the parent's
                # decision (if they later declined the cancel, the sub returned to
                # active carrying invisible debt). missed_renewals==0 means this is
                # the first miss of the current run.
                was_first_miss = sub.get("missed_renewals", 0) == 0
                if sub["status"] != SUB_STATUS_CANCEL_PENDING:
                    sub["status"] = SUB_STATUS_LAPSED
                sub["missed_renewals"]  = sub.get("missed_renewals", 0) + 1
                sub["accumulated_debt"] = sub["missed_renewals"] * cost
                sub["next_renewal_date"] = _advance_renewal_date(
                    sub["period"], sub["anchor"], sub["next_renewal_date"]
                )
                self._append_history(
                    event_type=HISTORY_SUBSCRIPTION_LAPSED,
                    person_id=sub["person_id"],
                    reference_id=sub["id"],
                    note=item.get("name", ""),
                )
                _LOGGER.info(
                    "Family Hub: subscription %s lapsed for %s — missed=%d debt=%d",
                    sub["id"], person.get("name"),
                    sub["missed_renewals"], sub["accumulated_debt"],
                )
                if was_first_miss:
                    await self._notify_subscription_lapsed(sub, person, item)

    async def _notify_subscription_lapsed(
        self, sub: dict, person: dict, item: dict
    ) -> None:
        """Notify parents when a subscription lapses for the first time."""
        person_name = person.get("name", "Someone")
        item_name   = item.get("name", "a subscription")
        debt        = sub.get("accumulated_debt", 0)

        try:
            await self._hass.services.async_call(
                "persistent_notification", "create",
                {
                    "title": f"Family Hub: subscription lapsed — {item_name}",
                    "message": (
                        f"**{person_name}**'s **{item_name}** subscription has lapsed "
                        f"because they couldn't afford the renewal.\n\n"
                        f"Current debt: **{debt} pts**. "
                        f"The subscription will resume automatically when they can afford it, "
                        f"or a parent can cancel it."
                    ),
                    "notification_id": f"family_hub_sub_lapsed_{sub['id']}",
                },
            )
        except Exception as err:
            _LOGGER.warning("Family Hub: lapse persistent_notification failed: %s", err)

        push_msg = (
            f"{person_name}'s {item_name} subscription lapsed "
            f"(owed {debt} pts) — open Family Hub to review."
        )
        for parent in self.get_active_people():
            if parent.get("type") != "parent":
                continue
            target = parent.get("notify_target", "").strip()
            if not target:
                continue
            await self._send_notify(
                target,
                f"Subscription lapsed — {item_name}",
                push_msg,
            )

    # ------------------------------------------------------------------
    # v0.6.5 — Subscription CRUD services
    # ------------------------------------------------------------------

    async def async_subscribe(
        self,
        person_id: str,
        item_id: str,
        *,
        skip_cost_check: bool = False,
        anchor_override: int | None = None,
    ) -> dict | None:
        """Create a subscription for person_id on item_id.

        Deducts the first-period cost immediately.  Returns the new
        subscription record, or None on validation failure.
        skip_cost_check=True allows admin_subscribe_for_person to start
        a sub even when the kid can't afford the initial cost (starts lapsed).
        anchor_override, when provided, replaces the item's subscription_anchor
        (used when a parent sets a custom anchor at approval time).
        """
        person = self.get_person(person_id)
        item   = self.get_store_item(item_id)

        if not person or not person.get("active", True):
            _LOGGER.warning("Family Hub: subscribe — person %s not found or inactive", person_id)
            return None
        if not item or not item.get("active", True):
            _LOGGER.warning("Family Hub: subscribe — item %s not found or inactive", item_id)
            return None
        if item.get("item_type") != ITEM_TYPE_SUBSCRIPTION:
            _LOGGER.warning("Family Hub: subscribe — item %s is not a subscription item", item_id)
            return None

        # Guard: person already has an active/lapsed/cancel_pending sub for this item.
        existing = next(
            (
                s for s in self._data.get("subscriptions", [])
                if s["person_id"] == person_id
                and s["item_id"] == item_id
                and s["status"] != SUB_STATUS_CANCELED
            ),
            None,
        )
        if existing:
            _LOGGER.warning(
                "Family Hub: subscribe — %s already has an active subscription for %s",
                person_id, item_id,
            )
            return None

        period = item.get("subscription_period", "monthly")
        anchor = anchor_override if anchor_override is not None else item.get("subscription_anchor", 1)
        today  = date.today()
        cost   = round(item.get("dollar_value", 0) * self.get_rank_ppd(person.get("rank_index", 0)))

        if not skip_cost_check and person.get("points_balance", 0) < cost:
            _LOGGER.warning(
                "Family Hub: subscribe — %s cannot afford %s (balance=%d cost=%d)",
                person_id, item_id, person.get("points_balance", 0), cost,
            )
            return None

        started_iso      = today.isoformat()
        next_renewal_iso = _advance_renewal_date(period, anchor, started_iso)

        if skip_cost_check and person.get("points_balance", 0) < cost:
            # Admin-forced start: begin lapsed with first period as debt.
            initial_status    = SUB_STATUS_LAPSED
            missed_renewals   = 1
            accumulated_debt  = cost
        else:
            # Normal start: deduct first-period cost immediately.
            person["points_balance"] = person.get("points_balance", 0) - cost
            initial_status    = SUB_STATUS_ACTIVE
            missed_renewals   = 0
            accumulated_debt  = 0

        sub = {
            "id":                        _new_id(),
            "person_id":                 person_id,
            "item_id":                   item_id,
            "period":                    period,
            "anchor":                    anchor,
            "next_renewal_date":         next_renewal_iso,
            "started_date":              started_iso,
            "status":                    initial_status,
            "missed_renewals":           missed_renewals,
            "accumulated_debt":          accumulated_debt,
            "dollar_cost_override":      None,
            "prior_status":              None,
            "cancellation_requested_at": None,
            "cancellation_requested_by": None,
        }
        self._data["subscriptions"].append(sub)
        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_STARTED,
            person_id=person_id,
            reference_id=sub["id"],
            points_delta=-cost if initial_status == SUB_STATUS_ACTIVE else 0,
            balance_after=person.get("points_balance", 0),
            note=item.get("name", ""),
        )
        await self.async_save()
        _LOGGER.info(
            "Family Hub: subscribe — %s subscribed to %s (status=%s next=%s)",
            person_id, item_id, initial_status, next_renewal_iso,
        )
        return sub

    async def async_request_cancel_subscription(
        self, subscription_id: str, person_id: str
    ) -> dict | None:
        """Kid requests cancellation of their subscription.

        Sets status to cancel_pending.  Subscription continues to renew
        normally until a parent approves or declines the request.
        """
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: request_cancel — subscription %s not found", subscription_id)
            return None
        if sub["person_id"] != person_id:
            _LOGGER.warning(
                "Family Hub: request_cancel — subscription %s does not belong to %s",
                subscription_id, person_id,
            )
            return None
        if sub["status"] in (SUB_STATUS_CANCEL_PENDING, SUB_STATUS_CANCELED):
            _LOGGER.warning(
                "Family Hub: request_cancel — subscription %s already %s",
                subscription_id, sub["status"],
            )
            return None

        sub["prior_status"]              = sub["status"]
        sub["status"]                    = SUB_STATUS_CANCEL_PENDING
        sub["cancellation_requested_at"] = _now_iso()
        sub["cancellation_requested_by"] = person_id

        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_CANCEL_REQUESTED,
            person_id=person_id,
            reference_id=subscription_id,
            note=self._sub_item_name(sub),
        )
        await self.async_save()

        # Notify parents.
        person    = self.get_person(person_id)
        item      = self.get_store_item(sub["item_id"])
        item_name = item.get("name", "a subscription") if item else "a subscription"
        p_name    = person.get("name", "Someone") if person else "Someone"
        try:
            await self._hass.services.async_call(
                "persistent_notification", "create",
                {
                    "title": f"Family Hub: cancel request — {item_name}",
                    "message": (
                        f"**{p_name}** has requested to cancel their **{item_name}** subscription.\n\n"
                        f"Subscription ID: `{subscription_id}`"
                    ),
                    "notification_id": f"family_hub_sub_cancel_{subscription_id}",
                },
            )
        except Exception as err:
            _LOGGER.warning("Family Hub: cancel request notification failed: %s", err)

        push_msg = f"{p_name} wants to cancel their {item_name} subscription — approve or decline in Family Hub."
        for parent in self.get_active_people():
            if parent.get("type") != "parent":
                continue
            target = parent.get("notify_target", "").strip()
            if not target:
                continue
            await self._send_notify(
                target,
                f"Cancel request — {item_name}",
                push_msg,
            )
        return sub

    async def async_approve_cancel_subscription(
        self, subscription_id: str, approved_by: str
    ) -> dict | None:
        """Parent approves a cancel request — subscription stops renewing."""
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: approve_cancel — subscription %s not found", subscription_id)
            return None
        if sub["status"] != SUB_STATUS_CANCEL_PENDING:
            _LOGGER.warning(
                "Family Hub: approve_cancel — subscription %s is not cancel_pending (status=%s)",
                subscription_id, sub["status"],
            )
            return None

        sub["status"]     = SUB_STATUS_CANCELED
        sub["prior_status"] = None
        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_CANCELED,
            person_id=sub["person_id"],
            reference_id=subscription_id,
            note=f"Approved by {approved_by}. {self._sub_item_name(sub)}",
        )
        await self.async_save()
        return sub

    async def async_decline_cancel_subscription(
        self, subscription_id: str, declined_by: str
    ) -> dict | None:
        """Parent declines a cancel request — subscription reverts to its prior status."""
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: decline_cancel — subscription %s not found", subscription_id)
            return None
        if sub["status"] != SUB_STATUS_CANCEL_PENDING:
            _LOGGER.warning(
                "Family Hub: decline_cancel — subscription %s is not cancel_pending (status=%s)",
                subscription_id, sub["status"],
            )
            return None

        restore_status = sub.get("prior_status") or SUB_STATUS_ACTIVE
        sub["status"]                    = restore_status
        sub["prior_status"]              = None
        sub["cancellation_requested_at"] = None
        sub["cancellation_requested_by"] = None
        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_CANCEL_DECLINED,
            person_id=sub["person_id"],
            reference_id=subscription_id,
            note=f"Cancel request declined by {declined_by}. {self._sub_item_name(sub)}",
        )
        await self.async_save()
        return sub

    async def async_admin_cancel_subscription(
        self, subscription_id: str, canceled_by: str
    ) -> dict | None:
        """Parent unilaterally cancels a subscription regardless of current status."""
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: admin_cancel — subscription %s not found", subscription_id)
            return None
        if sub["status"] == SUB_STATUS_CANCELED:
            _LOGGER.warning("Family Hub: admin_cancel — subscription %s already canceled", subscription_id)
            return None

        sub["status"] = SUB_STATUS_CANCELED
        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_CANCELED,
            person_id=sub["person_id"],
            reference_id=subscription_id,
            note=f"Admin canceled by {canceled_by}. {self._sub_item_name(sub)}",
        )
        await self.async_save()
        return sub

    async def async_admin_subscribe_for_person(
        self, person_id: str, item_id: str
    ) -> dict | None:
        """Parent creates a subscription on behalf of a kid.

        Uses the same logic as async_subscribe but with skip_cost_check=True
        so the sub can start even if the kid can't afford it (begins lapsed).
        """
        return await self.async_subscribe(person_id, item_id, skip_cost_check=True)

    _UNSET = object()

    async def async_update_subscription(
        self,
        subscription_id: str,
        *,
        period: str | None = None,
        anchor: int | None = None,
        dollar_cost_override: object = _UNSET,
        next_renewal_date: str | None = None,
    ) -> dict | None:
        """Parent edits period, anchor, cost override, or next renewal date.

        Changing period or anchor recalculates next_renewal_date from today.
        If next_renewal_date is also supplied it is applied last (explicit date
        always wins).
        Passing dollar_cost_override=None clears the override (reverts to
        item-derived cost); omitting the argument leaves it unchanged.
        """
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: update_subscription — %s not found", subscription_id)
            return None
        if sub["status"] == SUB_STATUS_CANCELED:
            _LOGGER.warning("Family Hub: update_subscription — %s is canceled", subscription_id)
            return None

        period_changed = False
        if period is not None and period != sub["period"]:
            sub["period"] = period
            period_changed = True
        if anchor is not None and anchor != sub["anchor"]:
            sub["anchor"] = anchor
            period_changed = True
        if period_changed:
            sub["next_renewal_date"] = _advance_renewal_date(
                sub["period"], sub["anchor"], date.today().isoformat()
            )
        # Explicit date wins over the recalculated one (applied last).
        if next_renewal_date is not None:
            sub["next_renewal_date"] = next_renewal_date
        if dollar_cost_override is not self.__class__._UNSET:
            sub["dollar_cost_override"] = dollar_cost_override

        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_UPDATED,
            person_id=sub["person_id"],
            reference_id=subscription_id,
            note=f"Subscription updated by admin. {self._sub_item_name(sub)}",
        )
        await self.async_save()
        return sub

    # ------------------------------------------------------------------
    # v0.6.5 — Subscription read helpers
    # ------------------------------------------------------------------

    def _get_subscription(self, subscription_id: str) -> dict | None:
        return next(
            (s for s in self._data.get("subscriptions", []) if s["id"] == subscription_id),
            None,
        )

    def _sub_item_name(self, sub: dict) -> str:
        item = self.get_store_item(sub.get("item_id", ""))
        return item.get("name", "") if item else ""

    def get_subscriptions_for_person(self, person_id: str, rank_index: int = 0) -> list[dict]:
        """Return all non-canceled subscriptions for person_id, enriched for the card."""
        today    = date.today()
        eff_ppd  = self.get_rank_ppd(rank_index)
        result   = []
        for sub in self._data.get("subscriptions", []):
            if sub["person_id"] != person_id:
                continue
            if sub["status"] == SUB_STATUS_CANCELED:
                continue
            item = self.get_store_item(sub["item_id"])
            if not item:
                continue
            dollar = sub.get("dollar_cost_override") if sub.get("dollar_cost_override") is not None else item.get("dollar_value", 0)
            cost = round(dollar * eff_ppd)
            try:
                renewal = date.fromisoformat(sub["next_renewal_date"])
                days_until = (renewal - today).days
            except (ValueError, KeyError):
                days_until = 0
            result.append({
                "subscription_id":          sub["id"],
                "item_id":                  sub["item_id"],
                "item_name":                item.get("name", ""),
                "item_icon":                item.get("icon", "") or "",
                "period":                   sub["period"],
                "next_renewal_date":        sub["next_renewal_date"],
                "days_until_renewal":       days_until,
                "status":                   sub["status"],
                "points_cost":              cost,
                "accumulated_debt":         sub.get("accumulated_debt", 0),
                "missed_renewals":          sub.get("missed_renewals", 0),
                "cancellation_requested_by": sub.get("cancellation_requested_by"),
            })
        return result

    def get_cancel_pending_subscriptions_for_card(self) -> list[dict]:
        """Return all cancel_pending subscriptions enriched for the admin queue."""
        result = []
        for sub in self._data.get("subscriptions", []):
            if sub["status"] != SUB_STATUS_CANCEL_PENDING:
                continue
            person = self.get_person(sub["person_id"])
            item   = self.get_store_item(sub["item_id"])
            result.append({
                "subscription_id":           sub["id"],
                "person_id":                 sub["person_id"],
                "person_name":               person.get("name", "Unknown") if person else "Unknown",
                "person_color":              person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "item_id":                   sub["item_id"],
                "item_name":                 item.get("name", "Unknown") if item else "Unknown",
                "period":                    sub["period"],
                "requested_at":              sub.get("cancellation_requested_at"),
                "accumulated_debt":          sub.get("accumulated_debt", 0),
            })
        return result


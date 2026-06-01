"""Family Hub - GroupRewardsMixin (extracted from data_store.py, v0.7.0 P4).

Group-reward proposals, chip-in, redemption.
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


class GroupRewardsMixin:
    # ------------------------------------------------------------------
    # Group reward proposals (v0.6.3 item 13)
    # ------------------------------------------------------------------

    @property
    def group_reward_proposals(self) -> list[dict]:
        return self._data.get("group_reward_proposals", [])

    def get_group_proposal(self, proposal_id: str) -> dict | None:
        return next((p for p in self.group_reward_proposals if p["id"] == proposal_id), None)

    async def async_propose_group_reward(
        self,
        item_id: str,
        proposer_id: str,
        proposer_share_pct: int,
        invitees: list[dict],  # [{"person_id": ..., "share_pct": ...}]
    ) -> dict | None:
        """
        Kid proposes turning a store item into a shared group reward.

        Creates a proposal record with status=pending_kid_acceptance. Each invitee
        must respond (accept/decline) before it advances to parent approval. If any
        invitee declines the proposal is immediately closed as declined.

        Validates that proposer_share_pct + all invitee share_pct sums to ~100.
        """
        item = self.get_store_item(item_id)
        if not item or not item.get("active", True):
            _LOGGER.warning("Family Hub: propose_group_reward — item %s not found or inactive", item_id)
            return None
        proposer = self.get_person(proposer_id)
        if not proposer:
            return None

        # Validate share percentages
        total_pct = proposer_share_pct + sum(int(i.get("share_pct", 0)) for i in invitees)
        if abs(total_pct - 100) > 2:
            _LOGGER.warning(
                "Family Hub: propose_group_reward — shares don't sum to 100 (got %d)", total_pct
            )
            return None

        proposal: dict = {
            "id": _new_id(),
            "item_id": item_id,
            "item_name": item["name"],
            "proposed_by": proposer_id,
            "proposed_at": _now_iso(),
            "status": PROPOSAL_PENDING_KIDS,
            "proposer_share_pct": proposer_share_pct,
            "invitees": [
                {
                    "person_id": inv["person_id"],
                    "share_pct": int(inv.get("share_pct", 0)),
                    "accepted": None,   # None=pending, True=accepted, False=declined
                }
                for inv in invitees
            ],
            "resolved_at": None,
            "resolved_by": None,
            "note": "",
        }
        self._data.setdefault("group_reward_proposals", []).append(proposal)
        self._append_history(
            event_type=HISTORY_GROUP_PROPOSED,
            person_id=proposer_id,
            reference_id=proposal["id"],
            note=f'{proposer["name"]} proposed sharing "{item["name"]}"',
        )
        await self.async_save()
        return proposal

    async def async_respond_group_proposal(
        self,
        proposal_id: str,
        person_id: str,
        accept: bool,
    ) -> dict | None:
        """
        Kid accepts or declines a group reward proposal.

        A single decline immediately closes the proposal as PROPOSAL_DECLINED.
        When all invitees have accepted the status advances to PROPOSAL_PENDING_PARENT.
        """
        proposal = self.get_group_proposal(proposal_id)
        if not proposal or proposal.get("status") != PROPOSAL_PENDING_KIDS:
            return None

        invitee = next(
            (i for i in proposal["invitees"] if i["person_id"] == person_id), None
        )
        if not invitee:
            _LOGGER.warning("Family Hub: respond_group_proposal — %s not an invitee", person_id)
            return None

        invitee["accepted"] = accept

        if not accept:
            proposal["status"]      = PROPOSAL_DECLINED
            proposal["resolved_at"] = _now_iso()
            proposal["resolved_by"] = person_id
            proposal["note"]        = "Declined by invitee"
        else:
            if all(i.get("accepted") is True for i in proposal["invitees"]):
                proposal["status"] = PROPOSAL_PENDING_PARENT

        await self.async_save()
        return proposal

    async def async_approve_group_proposal(
        self,
        proposal_id: str,
        approved_by: str,
    ) -> dict | None:
        """
        Parent approves a group reward proposal.

        Activates the store item as a group reward: sets is_group_reward=True,
        populates the contributors list with target_pts for each contributor, and
        restricts visibility to SCOPE_PERSONAL so only contributors see it.
        """
        proposal = self.get_group_proposal(proposal_id)
        if not proposal or proposal.get("status") != PROPOSAL_PENDING_PARENT:
            return None

        item = self.get_store_item(proposal["item_id"])
        if not item:
            return None

        proposal["status"]      = PROPOSAL_APPROVED
        proposal["resolved_at"] = _now_iso()
        proposal["resolved_by"] = approved_by

        # Compute target_pts at the default (rank-0) rate so all kids share
        # the same nominal cost regardless of individual rank.
        base_ppd    = self.get_rank_ppd(0)
        points_cost = round(item.get("dollar_value", 0) * base_ppd)

        all_contributors = (
            [{"person_id": proposal["proposed_by"], "share_pct": proposal["proposer_share_pct"]}]
            + [{"person_id": i["person_id"], "share_pct": i["share_pct"]} for i in proposal["invitees"]]
        )

        item["is_group_reward"] = True
        item["contributors"] = [
            {
                "person_id":       c["person_id"],
                "share_pct":       c["share_pct"],
                "contributed_pts": 0,
                "target_pts":      round(points_cost * c["share_pct"] / 100),
            }
            for c in all_contributors
        ]

        # Restrict scope so only contributors see it in their store.
        item["scope"]      = SCOPE_PERSONAL
        item["person_ids"] = [c["person_id"] for c in all_contributors]

        await self.async_save()
        return proposal

    async def async_decline_group_proposal(
        self,
        proposal_id: str,
        declined_by: str,
        reason: str = "",
    ) -> dict | None:
        """Parent declines a group reward proposal."""
        proposal = self.get_group_proposal(proposal_id)
        if not proposal or proposal.get("status") != PROPOSAL_PENDING_PARENT:
            return None

        proposal["status"]      = PROPOSAL_DECLINED
        proposal["resolved_at"] = _now_iso()
        proposal["resolved_by"] = declined_by
        proposal["note"]        = reason or "Declined by parent"

        await self.async_save()
        return proposal

    async def async_chip_in_group_reward(
        self,
        item_id: str,
        person_id: str,
        points: int,
    ) -> dict | None:
        """
        Kid chips in points toward a group reward.

        Points are deducted from the kid's balance immediately. The
        contributed_pts for this contributor on the store item is incremented.
        Capped so total contributed_pts never exceeds the contributor's target_pts.
        """
        item   = self.get_store_item(item_id)
        person = self.get_person(person_id)
        if not item or not person or not item.get("is_group_reward"):
            return None

        contrib = next(
            (c for c in item.get("contributors", []) if c.get("person_id") == person_id),
            None,
        )
        if not contrib:
            _LOGGER.warning(
                "Family Hub: chip_in_group_reward — %s is not a contributor on %s",
                person_id, item_id,
            )
            return None

        if points <= 0:
            return None

        if person.get("points_balance", 0) < points:
            _LOGGER.warning(
                "Family Hub: chip_in_group_reward — insufficient balance for %s (%d needed, %d available)",
                person_id, points, person.get("points_balance", 0),
            )
            return None

        # Cap at remaining share
        already   = contrib.get("contributed_pts", 0)
        target    = contrib.get("target_pts", 0)
        remaining = max(0, target - already)
        points    = min(points, remaining)
        if points <= 0:
            _LOGGER.info(
                "Family Hub: chip_in_group_reward — %s already at target for %s",
                person_id, item_id,
            )
            return None

        person["points_balance"] = person.get("points_balance", 0) - points
        contrib["contributed_pts"] = already + points

        self._append_history(
            event_type=HISTORY_GROUP_CHIP_IN,
            person_id=person_id,
            reference_id=item_id,
            points_delta=-points,
            balance_after=person["points_balance"],
            note=f'Chipped in {points}pts toward "{item["name"]}"',
        )
        await self.async_save()
        return item

    async def async_redeem_group_reward(
        self,
        item_id: str,
        redeemed_by: str,
    ) -> dict | None:
        """
        Parent marks a fully-funded group reward as redeemed.

        Creates an APPROVED redemption record for each contributor (no extra point
        deduction — points were already deducted at chip-in time). Marks the item
        inactive so it disappears from the store. Resets contributed_pts so the
        item can be re-activated later if desired.
        """
        item = self.get_store_item(item_id)
        if not item or not item.get("is_group_reward"):
            return None

        # Guard: all contributors must be at their target
        for contrib in item.get("contributors", []):
            if contrib.get("contributed_pts", 0) < contrib.get("target_pts", 0):
                _LOGGER.warning(
                    "Family Hub: redeem_group_reward — item %s not fully funded yet", item_id
                )
                return None

        now = _now_iso()
        for contrib in item.get("contributors", []):
            pid    = contrib.get("person_id")
            person = self.get_person(pid) if pid else None
            self._data["redemptions"].append({
                "id":            _new_id(),
                "store_item_id": item_id,
                "person_id":     pid,
                "points_cost":   contrib.get("contributed_pts", 0),
                "item_name":     item["name"],
                "status":        REDEMPTION_APPROVED,
                "requested_at":  now,
                "resolved_at":   now,
                "resolved_by":   redeemed_by,
                "note":          "Group reward redeemed",
            })
            self._append_history(
                event_type=HISTORY_GROUP_REDEEMED,
                person_id=pid,
                reference_id=item_id,
                points_delta=0,
                balance_after=person.get("points_balance", 0) if person else 0,
                note=f'Group reward "{item["name"]}" redeemed',
            )

        # Mark item inactive; reset chip-in totals for potential re-use.
        item["active"] = False
        for contrib in item.get("contributors", []):
            contrib["contributed_pts"] = 0

        await self.async_save()
        return item

    def get_group_reward_proposals_for_card(self) -> list[dict]:
        """
        All proposals in PROPOSAL_PENDING_PARENT state, enriched for the admin queue.
        """
        queue = []
        for prop in self.group_reward_proposals:
            if prop.get("status") != PROPOSAL_PENDING_PARENT:
                continue
            proposer = self.get_person(prop.get("proposed_by", ""))
            # Enrich invitees with names/colors
            enriched_invitees = []
            for inv in prop.get("invitees", []):
                p = self.get_person(inv.get("person_id", ""))
                enriched_invitees.append({
                    **inv,
                    "person_name":  p["name"]                    if p else "Unknown",
                    "person_color": p.get("avatar_color", "#7F77DD") if p else "#7F77DD",
                })
            queue.append({
                "proposal_id":       prop["id"],
                "item_id":           prop.get("item_id"),
                "item_name":         prop.get("item_name"),
                "proposed_by":       prop.get("proposed_by"),
                "proposer_name":     proposer["name"] if proposer else "Unknown",
                "proposer_color":    proposer.get("avatar_color", "#7F77DD") if proposer else "#7F77DD",
                "proposer_share_pct": prop.get("proposer_share_pct", 0),
                "proposed_at":       prop.get("proposed_at"),
                "invitees":          enriched_invitees,
            })
        return sorted(queue, key=lambda x: x.get("proposed_at") or "")

    def get_group_proposals_for_person(self, person_id: str) -> list[dict]:
        """
        Proposals that are pending THIS kid's response (status=pending_kid_acceptance
        and this person is an invitee who hasn't yet responded).
        """
        result = []
        for prop in self.group_reward_proposals:
            if prop.get("status") != PROPOSAL_PENDING_KIDS:
                continue
            invitee = next(
                (i for i in prop.get("invitees", []) if i.get("person_id") == person_id),
                None,
            )
            if not invitee or invitee.get("accepted") is not None:
                continue   # not invited, or already responded

            proposer = self.get_person(prop.get("proposed_by", ""))
            result.append({
                "proposal_id":    prop["id"],
                "item_id":        prop.get("item_id"),
                "item_name":      prop.get("item_name"),
                "proposed_by":    prop.get("proposed_by"),
                "proposer_name":  proposer["name"] if proposer else "Unknown",
                "proposer_color": proposer.get("avatar_color", "#7F77DD") if proposer else "#7F77DD",
                "my_share_pct":   invitee.get("share_pct", 0),
                "proposed_at":    prop.get("proposed_at"),
            })
        return result


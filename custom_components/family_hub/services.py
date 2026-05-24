"""
Family Hub — services (v0.3.0 / v0.4.1).

All actions that modify data are exposed as HA services under the family_hub domain.

Changes in v0.3.0:
  - update_chore: expanded schema accepts all new fields (chore_type, category_label,
    sort_order, penalty_enabled, penalty_points, weekdays, day_filter, interval,
    assigned_to as list, description). Fixes "extra keys not allowed" error.
  - add_chore: assigned_to now accepts a list; new fields added.
  - add_task: new canonical one-time task service (simpler schema than add_chore).
  - add_one_time_task: kept as alias for backward compatibility.
  - remove_person: new service — deactivates a person.
  - add_store_item / update_store_item: person_ids (list) replaces person_id (string).
  - update_settings: now accepts category_labels list.
  - award_bonus_points / deduct_points: unchanged (already accept dollar_amount).
  - All persistent_notification calls use hass.services.async_call (not deprecated pattern).

Changes in v0.4.1:
  - handle_add_person: after the store creates the person, calls add_person_sensor
    (stored in hass.data by sensor.py) so the new person's sensor entity is
    registered immediately — no restart required.
  - handle_remove_person: after the store deactivates the person, calls
    remove_person_sensor so HA is notified immediately.
  - Both callbacks are retrieved from hass.data[DOMAIN][entry_id] via the
    coordinator's entry_id. If the callbacks aren't set yet (race on first
    startup) the services fall back gracefully and log a warning.
"""

from __future__ import annotations

import logging
import os
from datetime import datetime

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv

from .const import (
    CHORE_TYPES,
    CLAIMABLE_SUBTYPE_FCFS,
    CLAIMABLE_SUBTYPE_MULTI,
    DOMAIN,
    MULTI_CLAIM_POINTS_FULL,
    MULTI_CLAIM_POINTS_SPLIT,
    PERSON_TYPES,
    RECURRENCE_TYPES,
    ROTATION_CADENCES,
    SCOPE_COMMON,
    STORE_SCOPES,
)
from .coordinator import FamilyHubCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_services(hass: HomeAssistant, coordinator: FamilyHubCoordinator) -> None:
    """Register all Family Hub services."""

    store = coordinator.store

    # ------------------------------------------------------------------
    # Helper: retrieve the dynamic sensor registration callbacks.
    # These are set by sensor.py after the platform forward completes.
    # We look them up at call time (not at setup time) so we always get
    # the live values even if setup order varies.
    # ------------------------------------------------------------------

    def _get_entry_data() -> dict:
        """Return the hass.data entry dict for this coordinator's config entry."""
        for entry_id, entry_data in hass.data.get(DOMAIN, {}).items():
            if isinstance(entry_data, dict) and entry_data.get("coordinator") is coordinator:
                return entry_data
        return {}

    # ------------------------------------------------------------------
    # Task completion
    # ------------------------------------------------------------------

    async def handle_complete_task(call: ServiceCall) -> None:
        result = await store.async_complete_task(call.data["task_id"], call.data["person_id"])
        if result:
            await coordinator.async_refresh()
            await _notify_approval(hass, result, store)
        else:
            _LOGGER.warning("Family Hub: complete_task failed for %s", call.data["task_id"])

    hass.services.async_register(
        DOMAIN, "complete_task", handle_complete_task,
        schema=vol.Schema({
            vol.Required("task_id"):   cv.string,
            vol.Required("person_id"): cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Claim task
    # ------------------------------------------------------------------

    async def handle_claim_task(call: ServiceCall) -> None:
        result = await store.async_claim_task(call.data["task_id"], call.data["person_id"])
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "claim_task", handle_claim_task,
        schema=vol.Schema({
            vol.Required("task_id"):   cv.string,
            vol.Required("person_id"): cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Approve / deny task
    # ------------------------------------------------------------------

    async def handle_approve_task(call: ServiceCall) -> None:
        result = await store.async_approve_task(call.data["task_id"], call.data["approved_by"])
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "approve_task", handle_approve_task,
        schema=vol.Schema({
            vol.Required("task_id"):     cv.string,
            vol.Required("approved_by"): cv.string,
        }),
    )

    async def handle_deny_task(call: ServiceCall) -> None:
        result = await store.async_deny_task(
            call.data["task_id"], call.data["denied_by"], call.data.get("reason", "")
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "deny_task", handle_deny_task,
        schema=vol.Schema({
            vol.Required("task_id"):   cv.string,
            vol.Required("denied_by"): cv.string,
            vol.Optional("reason", default=""): cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Add task (one-time, canonical — replaces add_one_time_task)
    # ------------------------------------------------------------------

    async def _do_add_task(call: ServiceCall) -> None:
        assigned_raw = call.data.get("assigned_to")
        if isinstance(assigned_raw, str):
            assigned = [assigned_raw] if assigned_raw else []
        else:
            assigned = list(assigned_raw) if assigned_raw else []

        await store.async_add_task(
            name=call.data["name"],
            assigned_to=assigned,
            points=call.data.get("points", 0),
            description=call.data.get("description", ""),
            approval_required=call.data.get("approval_required", False),
            expires_after_days=call.data.get("expires_after_days"),
            created_by=call.data.get("created_by"),
        )
        await coordinator.async_refresh()

    _task_schema = vol.Schema({
        vol.Required("name"):                        cv.string,
        vol.Optional("description", default=""):     cv.string,
        vol.Optional("assigned_to", default=[]):     vol.Any(cv.string, [cv.string]),
        vol.Optional("points", default=0):           vol.Coerce(int),
        vol.Optional("approval_required", default=False): cv.boolean,
        vol.Optional("expires_after_days"):          vol.All(vol.Coerce(int), vol.Range(min=1)),
        vol.Optional("created_by"):                  cv.string,
    })

    hass.services.async_register(DOMAIN, "add_task",          _do_add_task, schema=_task_schema)
    hass.services.async_register(DOMAIN, "add_one_time_task", _do_add_task, schema=_task_schema)

    # ------------------------------------------------------------------
    # People management
    # ------------------------------------------------------------------

    async def handle_add_person(call: ServiceCall) -> None:
        person = await store.async_add_person(
            name=call.data["name"],
            person_type=call.data.get("person_type", "kid"),
            ha_user_id=call.data.get("ha_user_id"),
            avatar_color=call.data.get("avatar_color"),
        )
        await coordinator.async_refresh()
        # Register the new person's sensor entity immediately so the dashboard
        # shows them without requiring an HA restart.
        add_sensor = _get_entry_data().get("add_person_sensor")
        if add_sensor:
            add_sensor(person["id"])
        else:
            _LOGGER.warning(
                "Family Hub: add_person_sensor callback not available yet; "
                "restart HA to see the new sensor for %s", call.data["name"]
            )

    hass.services.async_register(
        DOMAIN, "add_person", handle_add_person,
        schema=vol.Schema({
            vol.Required("name"):                        cv.string,
            vol.Optional("person_type", default="kid"): vol.In(PERSON_TYPES),
            vol.Optional("ha_user_id"):                  cv.string,
            vol.Optional("avatar_color"):                cv.string,
        }),
    )

    async def handle_update_person(call: ServiceCall) -> None:
        await store.async_update_person(call.data["person_id"], **{
            k: v for k, v in call.data.items() if k != "person_id"
        })
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "update_person", handle_update_person,
        schema=vol.Schema({
            vol.Required("person_id"):           cv.string,
            vol.Optional("name"):                cv.string,
            vol.Optional("ha_user_id"):          cv.string,
            vol.Optional("avatar_color"):        cv.string,
            vol.Optional("active"):              cv.boolean,
            vol.Optional("type"):                vol.In(PERSON_TYPES),
            # v0.4.2: per-person penalty pause toggle
            vol.Optional("penalties_paused"):    cv.boolean,
            # v0.5.0: scheduled allowance
            vol.Optional("allowance_points"):    vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("allowance_schedule"):  vol.In(["weekly", "biweekly", "monthly"]),
            vol.Optional("allowance_weekday"):   vol.All(vol.Coerce(int), vol.Range(min=0, max=6)),
            vol.Optional("allowance_monthday"):  vol.All(vol.Coerce(int), vol.Range(min=1, max=28)),
            # v0.5.0: notification target (HA notify service name, empty = disabled)
            vol.Optional("notify_target"):       cv.string,
            # v0.6.0: codename + theme
            vol.Optional("code"):                cv.string,
            vol.Optional("theme_key"):           cv.string,
            # v0.6.0 S5: rank overrides (None = use global setting)
            vol.Optional("rank_index"):          vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("rank_drop_threshold"): vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=0))),
            vol.Optional("rank_gain_threshold"): vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=0))),
            # v0.6.0 S6: large-button mode
            vol.Optional("child_mode"):          cv.boolean,
            # v0.6.1: success-rate person streak (knobs only — streak count is admin-overridden via set_completion_streak)
            vol.Optional("completion_threshold_pct"): vol.All(vol.Coerce(int), vol.Range(min=1, max=100)),
            vol.Optional("completion_milestone"):     vol.All(vol.Coerce(int), vol.Range(min=0, max=365)),
            vol.Optional("completion_bonus_points"):  vol.All(vol.Coerce(int), vol.Range(min=0, max=10000)),
            # v0.6.3: store goal — item ID the kid is saving toward ("" clears)
            vol.Optional("goal_item_id"):             cv.string,
        }),
    )

    async def handle_remove_person(call: ServiceCall) -> None:
        person_id = call.data["person_id"]
        success = await store.async_remove_person(person_id)
        if success:
            await coordinator.async_refresh()
            # Notify HA that this person's sensor should be considered inactive.
            remove_sensor = _get_entry_data().get("remove_person_sensor")
            if remove_sensor:
                remove_sensor(person_id)
        else:
            _LOGGER.warning("Family Hub: remove_person — person not found: %s", person_id)

    hass.services.async_register(
        DOMAIN, "remove_person", handle_remove_person,
        schema=vol.Schema({vol.Required("person_id"): cv.string}),
    )

    # ------------------------------------------------------------------
    # Chore management
    # ------------------------------------------------------------------

    async def handle_add_chore(call: ServiceCall) -> None:
        # assigned_to accepts string or list
        assigned_raw = call.data.get("assigned_to", [])
        if isinstance(assigned_raw, str):
            assigned = [assigned_raw] if assigned_raw else []
        else:
            assigned = list(assigned_raw)

        rec_cfg = {}
        for key in ("weekdays", "day_filter", "interval", "day_of_month"):
            if key in call.data:
                rec_cfg[key] = call.data[key]

        await store.async_add_chore(
            name=call.data["name"],
            chore_type=call.data.get("chore_type", "assigned"),
            assigned_to=assigned,
            points=call.data.get("points", 10),
            approval_required=call.data.get("approval_required", True),
            recurrence_type=call.data.get("recurrence_type", "daily"),
            recurrence_config=rec_cfg,
            description=call.data.get("description", ""),
            category_label=call.data.get("category_label", ""),
            sort_order=call.data.get("sort_order"),
            penalty_enabled=call.data.get("penalty_enabled", False),
            penalty_points=call.data.get("penalty_points", 0),
            daily_penalty_after_days=call.data.get("daily_penalty_after_days"),
            expires_after_days=call.data.get("expires_after_days"),
            claimable_subtype=call.data.get("claimable_subtype", CLAIMABLE_SUBTYPE_FCFS),
            max_claimants=call.data.get("max_claimants", 2),
            multi_claim_points_mode=call.data.get("multi_claim_points_mode", MULTI_CLAIM_POINTS_FULL),
            streak_milestone=call.data.get("streak_milestone", 0),
            streak_bonus_points=call.data.get("streak_bonus_points", 0),
            reminder_time=call.data.get("reminder_time", -1),
            rotation_pool=call.data.get("rotation_pool", []),
            rotation_cadence=call.data.get("rotation_cadence", ""),
            icon=call.data.get("icon"),
            created_by=call.data.get("created_by"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "add_chore", handle_add_chore,
        schema=vol.Schema({
            vol.Required("name"):                              cv.string,
            vol.Optional("description", default=""):           cv.string,
            vol.Optional("chore_type", default="assigned"):    vol.In(CHORE_TYPES),
            vol.Optional("category_label", default=""):        cv.string,
            vol.Optional("assigned_to", default=[]):           vol.Any(cv.string, [cv.string]),
            vol.Optional("points", default=10):                vol.Coerce(int),
            vol.Optional("approval_required", default=True):   cv.boolean,
            vol.Optional("recurrence_type", default="daily"):  vol.In(RECURRENCE_TYPES),
            vol.Optional("weekdays", default=[]):              [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            vol.Optional("day_filter", default=[]):            [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            vol.Optional("interval", default=1):               vol.All(vol.Coerce(int), vol.Range(min=1)),
            vol.Optional("day_of_month"):                      vol.All(vol.Coerce(int), vol.Range(min=1, max=31)),
            vol.Optional("sort_order"):                        vol.Coerce(int),
            vol.Optional("penalty_enabled", default=False):    cv.boolean,
            vol.Optional("penalty_points", default=0):         vol.Coerce(int),
            vol.Optional("daily_penalty_after_days"):          vol.All(vol.Coerce(int), vol.Range(min=1)),
            vol.Optional("expires_after_days"):                vol.All(vol.Coerce(int), vol.Range(min=1)),
            vol.Optional("claimable_subtype", default=CLAIMABLE_SUBTYPE_FCFS):
                vol.In([CLAIMABLE_SUBTYPE_FCFS, CLAIMABLE_SUBTYPE_MULTI]),
            vol.Optional("max_claimants", default=2):          vol.All(vol.Coerce(int), vol.Range(min=2)),
            vol.Optional("multi_claim_points_mode", default=MULTI_CLAIM_POINTS_FULL):
                vol.In([MULTI_CLAIM_POINTS_FULL, MULTI_CLAIM_POINTS_SPLIT]),
            vol.Optional("streak_milestone", default=0):       vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("streak_bonus_points", default=0):    vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("reminder_time", default=-1):         vol.Any(-1, vol.All(vol.Coerce(int), vol.Range(min=0, max=2359))),
            vol.Optional("rotation_pool", default=[]):         [cv.string],
            vol.Optional("rotation_cadence", default=""):      vol.Any("", vol.In(ROTATION_CADENCES)),
            vol.Optional("icon"):                              cv.string,
            vol.Optional("created_by"):                        cv.string,
        }),
    )

    async def handle_update_chore(call: ServiceCall) -> None:
        """
        Update chore — accepts all fields including the new v0.3.0 ones.
        Fixes the "extra keys not allowed" error from v0.2.x.
        """
        # assigned_to: normalise to list; strip any empty strings from either branch
        data = dict(call.data)
        chore_id = data.pop("chore_id")
        if "assigned_to" in data:
            at = data["assigned_to"]
            if isinstance(at, str):
                data["assigned_to"] = [at] if at else []
            else:
                data["assigned_to"] = [v for v in at if v]

        await store.async_update_chore(chore_id, **data)
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "update_chore", handle_update_chore,
        schema=vol.Schema({
            vol.Required("chore_id"):                        cv.string,
            vol.Optional("name"):                            cv.string,
            vol.Optional("description"):                     cv.string,
            vol.Optional("chore_type"):                      vol.In(CHORE_TYPES),
            vol.Optional("category_label"):                  cv.string,
            vol.Optional("sort_order"):                      vol.Coerce(float),
            vol.Optional("assigned_to"):                     vol.Any(cv.string, [cv.string]),
            vol.Optional("points"):                          vol.Coerce(int),
            vol.Optional("approval_required"):               cv.boolean,
            vol.Optional("penalty_enabled"):                 cv.boolean,
            vol.Optional("penalty_points"):                  vol.Coerce(int),
            vol.Optional("daily_penalty_after_days"):        vol.Any(
                None, vol.All(vol.Coerce(int), vol.Range(min=1))
            ),
            vol.Optional("expires_after_days"):              vol.Any(
                None, vol.All(vol.Coerce(int), vol.Range(min=1))
            ),
            vol.Optional("claimable_subtype"):               vol.In([CLAIMABLE_SUBTYPE_FCFS, CLAIMABLE_SUBTYPE_MULTI]),
            vol.Optional("max_claimants"):                   vol.All(vol.Coerce(int), vol.Range(min=2)),
            vol.Optional("multi_claim_points_mode"):         vol.In([MULTI_CLAIM_POINTS_FULL, MULTI_CLAIM_POINTS_SPLIT]),
            vol.Optional("weekdays"):                        [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            vol.Optional("day_filter"):                      [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            vol.Optional("interval"):                        vol.All(vol.Coerce(int), vol.Range(min=1)),
            vol.Optional("day_of_month"):                    vol.All(vol.Coerce(int), vol.Range(min=1, max=31)),
            vol.Optional("recurrence"):                      dict,
            vol.Optional("active"):                          cv.boolean,
            vol.Optional("icon"):                            cv.string,
            vol.Optional("streak_milestone"):                vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=0))),
            vol.Optional("streak_bonus_points"):             vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=0))),
            vol.Optional("reminder_time"):                   vol.Any(-1, None, vol.All(vol.Coerce(int), vol.Range(min=0, max=2359))),
            vol.Optional("rotation_pool"):                   [cv.string],
            vol.Optional("rotation_cadence"):                vol.Any("", vol.In(ROTATION_CADENCES)),
        }),
    )

    async def handle_delete_chore(call: ServiceCall) -> None:
        await store.async_delete_chore(call.data["chore_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "delete_chore", handle_delete_chore,
        schema=vol.Schema({vol.Required("chore_id"): cv.string}),
    )

    # ------------------------------------------------------------------
    # Store items
    # ------------------------------------------------------------------

    async def handle_add_store_item(call: ServiceCall) -> None:
        # person_ids: accept single string or list
        pids_raw = call.data.get("person_ids", [])
        if isinstance(pids_raw, str):
            person_ids = [pids_raw] if pids_raw else []
        else:
            person_ids = list(pids_raw)

        await store.async_add_store_item(
            name=call.data["name"],
            dollar_value=call.data["dollar_value"],
            scope=call.data.get("scope", SCOPE_COMMON),
            person_ids=person_ids,
            description=call.data.get("description", ""),
            icon=call.data.get("icon", ""),
            category_label=call.data.get("category_label", ""),
            max_per_period=call.data.get("max_per_period", 0),
            period=call.data.get("period", "week"),
            is_group_reward=call.data.get("is_group_reward", False),
            contributors=call.data.get("contributors", []),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "add_store_item", handle_add_store_item,
        schema=vol.Schema({
            vol.Required("name"):                         cv.string,
            vol.Required("dollar_value"):                 vol.Coerce(float),
            vol.Optional("description", default=""):      cv.string,
            vol.Optional("scope", default=SCOPE_COMMON):  vol.In(STORE_SCOPES),
            vol.Optional("person_ids", default=[]):        vol.Any(cv.string, [cv.string]),
            vol.Optional("icon", default=""):              cv.string,
            vol.Optional("category_label", default=""):   cv.string,
            vol.Optional("max_per_period", default=0):    vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("period", default="week"):        vol.In(["day", "week", "month"]),
            # v0.6.3 item 13: group reward
            vol.Optional("is_group_reward", default=False): cv.boolean,
            vol.Optional("contributors", default=[]):        vol.All(
                cv.ensure_list,
                [vol.Schema({
                    vol.Required("person_id"):             cv.string,
                    vol.Required("share_pct"):             vol.All(vol.Coerce(int), vol.Range(min=1, max=100)),
                    vol.Optional("contributed_pts", default=0): vol.All(vol.Coerce(int), vol.Range(min=0)),
                })],
            ),
        }),
    )

    async def handle_update_store_item(call: ServiceCall) -> None:
        data = dict(call.data)
        item_id = data.pop("item_id")
        if "person_ids" in data:
            pids = data["person_ids"]
            data["person_ids"] = [pids] if isinstance(pids, str) else list(pids)
        await store.async_update_store_item(item_id, **data)
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "update_store_item", handle_update_store_item,
        schema=vol.Schema({
            vol.Required("item_id"):         cv.string,
            vol.Optional("name"):            cv.string,
            vol.Optional("description"):     cv.string,
            vol.Optional("dollar_value"):    vol.Coerce(float),
            vol.Optional("scope"):           vol.In(STORE_SCOPES),
            vol.Optional("person_ids"):      vol.Any(cv.string, [cv.string]),
            vol.Optional("active"):          cv.boolean,
            vol.Optional("sort_order"):      vol.Coerce(float),
            vol.Optional("icon"):            cv.string,
            vol.Optional("category_label"):  cv.string,
            vol.Optional("max_per_period"):  vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("period"):          vol.In(["day", "week", "month"]),
            # v0.6.3 item 13: group reward
            vol.Optional("is_group_reward"): cv.boolean,
            vol.Optional("contributors"):    vol.All(
                cv.ensure_list,
                [vol.Schema({
                    vol.Required("person_id"):             cv.string,
                    vol.Required("share_pct"):             vol.All(vol.Coerce(int), vol.Range(min=1, max=100)),
                    vol.Optional("contributed_pts", default=0): vol.All(vol.Coerce(int), vol.Range(min=0)),
                    vol.Optional("target_pts", default=0): vol.All(vol.Coerce(int), vol.Range(min=0)),
                })],
            ),
        }),
    )

    # ------------------------------------------------------------------
    # Group reward proposals (v0.6.3 item 13)
    # ------------------------------------------------------------------

    async def handle_propose_group_reward(call: ServiceCall) -> None:
        """Kid proposes turning a store item into a shared group reward."""
        result = await store.async_propose_group_reward(
            item_id=call.data["item_id"],
            proposer_id=call.data["proposer_id"],
            proposer_share_pct=call.data["proposer_share_pct"],
            invitees=call.data["invitees"],
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "propose_group_reward", handle_propose_group_reward,
        schema=vol.Schema({
            vol.Required("item_id"):            cv.string,
            vol.Required("proposer_id"):        cv.string,
            vol.Required("proposer_share_pct"): vol.All(vol.Coerce(int), vol.Range(min=1, max=99)),
            vol.Required("invitees"):           vol.All(
                cv.ensure_list,
                vol.Length(min=1),
                [vol.Schema({
                    vol.Required("person_id"):  cv.string,
                    vol.Required("share_pct"):  vol.All(vol.Coerce(int), vol.Range(min=1, max=99)),
                })],
            ),
        }),
    )

    async def handle_respond_group_proposal(call: ServiceCall) -> None:
        """Kid accepts or declines a group reward proposal."""
        result = await store.async_respond_group_proposal(
            proposal_id=call.data["proposal_id"],
            person_id=call.data["person_id"],
            accept=call.data["accept"],
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "respond_group_proposal", handle_respond_group_proposal,
        schema=vol.Schema({
            vol.Required("proposal_id"): cv.string,
            vol.Required("person_id"):   cv.string,
            vol.Required("accept"):      cv.boolean,
        }),
    )

    async def handle_approve_group_proposal(call: ServiceCall) -> None:
        """Parent approves a group reward proposal — activates group reward on the item."""
        result = await store.async_approve_group_proposal(
            proposal_id=call.data["proposal_id"],
            approved_by=call.data["approved_by"],
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "approve_group_proposal", handle_approve_group_proposal,
        schema=vol.Schema({
            vol.Required("proposal_id"): cv.string,
            vol.Required("approved_by"): cv.string,
        }),
    )

    async def handle_decline_group_proposal(call: ServiceCall) -> None:
        """Parent declines a group reward proposal."""
        result = await store.async_decline_group_proposal(
            proposal_id=call.data["proposal_id"],
            declined_by=call.data["declined_by"],
            reason=call.data.get("reason", ""),
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "decline_group_proposal", handle_decline_group_proposal,
        schema=vol.Schema({
            vol.Required("proposal_id"):         cv.string,
            vol.Required("declined_by"):         cv.string,
            vol.Optional("reason", default=""):  cv.string,
        }),
    )

    async def handle_chip_in_group_reward(call: ServiceCall) -> None:
        """Kid chips in points toward a group reward."""
        result = await store.async_chip_in_group_reward(
            item_id=call.data["item_id"],
            person_id=call.data["person_id"],
            points=call.data["points"],
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "chip_in_group_reward", handle_chip_in_group_reward,
        schema=vol.Schema({
            vol.Required("item_id"):   cv.string,
            vol.Required("person_id"): cv.string,
            vol.Required("points"):    vol.All(vol.Coerce(int), vol.Range(min=1)),
        }),
    )

    async def handle_redeem_group_reward(call: ServiceCall) -> None:
        """Parent marks a fully-funded group reward as redeemed."""
        result = await store.async_redeem_group_reward(
            item_id=call.data["item_id"],
            redeemed_by=call.data["redeemed_by"],
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "redeem_group_reward", handle_redeem_group_reward,
        schema=vol.Schema({
            vol.Required("item_id"):     cv.string,
            vol.Required("redeemed_by"): cv.string,
        }),
    )

    async def handle_delete_store_item(call: ServiceCall) -> None:
        await store.async_delete_store_item(call.data["item_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "delete_store_item", handle_delete_store_item,
        schema=vol.Schema({vol.Required("item_id"): cv.string}),
    )

    async def handle_hard_delete_store_item(call: ServiceCall) -> None:
        """Permanently remove a store item and cancel its pending redemptions."""
        await store.async_hard_delete_store_item(call.data["item_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "hard_delete_store_item", handle_hard_delete_store_item,
        schema=vol.Schema({vol.Required("item_id"): cv.string}),
    )

    # ------------------------------------------------------------------
    # Redemptions
    # ------------------------------------------------------------------

    async def handle_request_redemption(call: ServiceCall) -> None:
        result = await store.async_request_redemption(call.data["person_id"], call.data["item_id"])
        if result:
            await coordinator.async_refresh()
            await _notify_redemption(hass, result, store)

    hass.services.async_register(
        DOMAIN, "request_redemption", handle_request_redemption,
        schema=vol.Schema({
            vol.Required("person_id"): cv.string,
            vol.Required("item_id"):   cv.string,
        }),
    )

    async def handle_approve_redemption(call: ServiceCall) -> None:
        result = await store.async_approve_redemption(
            call.data["redemption_id"], call.data["approved_by"]
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "approve_redemption", handle_approve_redemption,
        schema=vol.Schema({
            vol.Required("redemption_id"): cv.string,
            vol.Required("approved_by"):   cv.string,
        }),
    )

    async def handle_decline_redemption(call: ServiceCall) -> None:
        result = await store.async_decline_redemption(
            call.data["redemption_id"],
            call.data["declined_by"],
            call.data.get("reason", ""),
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "decline_redemption", handle_decline_redemption,
        schema=vol.Schema({
            vol.Required("redemption_id"): cv.string,
            vol.Required("declined_by"):   cv.string,
            vol.Optional("reason", default=""): cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Bonus / deduct points
    # ------------------------------------------------------------------

    async def handle_award_bonus_points(call: ServiceCall) -> None:
        await store.async_award_bonus_points(
            person_id=call.data["person_id"],
            points=call.data.get("points", 0),
            reason=call.data.get("reason", ""),
            dollar_amount=call.data.get("dollar_amount"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "award_bonus_points", handle_award_bonus_points,
        schema=vol.Schema({
            vol.Required("person_id"):              cv.string,
            vol.Optional("points", default=0):      vol.All(vol.Coerce(int),   vol.Range(min=0)),
            vol.Optional("dollar_amount"):           vol.All(vol.Coerce(float), vol.Range(min=0.01)),
            vol.Optional("reason", default=""):     cv.string,
        }),
    )

    async def handle_deduct_points(call: ServiceCall) -> None:
        await store.async_admin_deduct_points(
            person_id=call.data["person_id"],
            points=call.data.get("points", 0),
            reason=call.data.get("reason", ""),
            dollar_amount=call.data.get("dollar_amount"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "deduct_points", handle_deduct_points,
        schema=vol.Schema({
            vol.Required("person_id"):              cv.string,
            vol.Optional("points", default=0):      vol.All(vol.Coerce(int),   vol.Range(min=0)),
            vol.Optional("dollar_amount"):           vol.All(vol.Coerce(float), vol.Range(min=0.01)),
            vol.Optional("reason", default=""):     cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Settings
    # ------------------------------------------------------------------

    async def handle_update_settings(call: ServiceCall) -> None:
        labels = call.data.get("category_labels")
        cal_entities = call.data.get("today_calendar_entities")
        ladder_raw = call.data.get("rank_ppd_ladder")
        await store.async_update_settings(
            family_name=call.data.get("family_name"),
            points_per_dollar=call.data.get("points_per_dollar"),
            show_dollar_value_to_kids=call.data.get("show_dollar_value_to_kids"),
            category_labels=list(labels) if labels is not None else None,
            penalties_paused=call.data.get("penalties_paused"),
            penalty_alert_time=call.data.get("penalty_alert_time"),
            rooms_config=call.data.get("rooms_config"),
            weather_entity=call.data.get("weather_entity"),
            today_calendar_entities=list(cal_entities) if cal_entities is not None else None,
            rank_eval_weekday=call.data.get("rank_eval_weekday"),
            rank_drop_threshold=call.data.get("rank_drop_threshold"),
            rank_gain_threshold=call.data.get("rank_gain_threshold"),
            rank_ppd_ladder=list(ladder_raw) if ladder_raw is not None else None,
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "update_settings", handle_update_settings,
        schema=vol.Schema({
            vol.Optional("family_name"):               cv.string,
            vol.Optional("points_per_dollar"):          vol.All(vol.Coerce(int), vol.Range(min=1, max=1000)),
            vol.Optional("show_dollar_value_to_kids"): cv.boolean,
            vol.Optional("category_labels"):            [cv.string],
            vol.Optional("penalties_paused"):           cv.boolean,
            vol.Optional("penalty_alert_time"):         vol.Any(-1, vol.All(vol.Coerce(int), vol.Range(min=0, max=2359))),
            vol.Optional("rooms_config"):               dict,
            vol.Optional("weather_entity"):             cv.string,
            vol.Optional("today_calendar_entities"):    [cv.string],
            vol.Optional("rank_eval_weekday"):          vol.All(vol.Coerce(int), vol.Range(min=0, max=6)),
            vol.Optional("rank_drop_threshold"):        vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("rank_gain_threshold"):        vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("rank_ppd_ladder"):            [vol.Coerce(float)],
        }),
    )

    # ------------------------------------------------------------------
    # v0.4.0 Admin correction services
    # ------------------------------------------------------------------

    async def handle_excuse_task(call: ServiceCall) -> None:
        """Reverse penalty on a skipped task — kid was sick, at a sleepover, etc."""
        result = await store.async_excuse_task(
            call.data["instance_id"],
            call.data["excused_by"],
            call.data.get("reason", ""),
        )
        if result:
            await coordinator.async_refresh()
        else:
            _LOGGER.warning("Family Hub: excuse_task failed for %s", call.data["instance_id"])

    hass.services.async_register(
        DOMAIN, "excuse_task", handle_excuse_task,
        schema=vol.Schema({
            vol.Required("instance_id"):            cv.string,
            vol.Required("excused_by"):             cv.string,
            vol.Optional("reason", default=""):     cv.string,
        }),
    )

    async def handle_reject_task(call: ServiceCall) -> None:
        """Claw back points on an already-approved task."""
        result = await store.async_reject_task(
            call.data["instance_id"],
            call.data["rejected_by"],
            call.data.get("reason", ""),
        )
        if result:
            await coordinator.async_refresh()
        else:
            _LOGGER.warning("Family Hub: reject_task failed for %s", call.data["instance_id"])

    hass.services.async_register(
        DOMAIN, "reject_task", handle_reject_task,
        schema=vol.Schema({
            vol.Required("instance_id"):            cv.string,
            vol.Required("rejected_by"):            cv.string,
            vol.Optional("reason", default=""):     cv.string,
        }),
    )

    async def handle_mark_task_complete(call: ServiceCall) -> None:
        """Retroactively mark a skipped task as done and award points."""
        result = await store.async_mark_task_complete(
            call.data["instance_id"],
            call.data["marked_by"],
            call.data.get("reason", ""),
        )
        if result:
            await coordinator.async_refresh()
        else:
            _LOGGER.warning("Family Hub: mark_task_complete failed for %s", call.data["instance_id"])

    hass.services.async_register(
        DOMAIN, "mark_task_complete", handle_mark_task_complete,
        schema=vol.Schema({
            vol.Required("instance_id"):            cv.string,
            vol.Required("marked_by"):              cv.string,
            vol.Optional("reason", default=""):     cv.string,
        }),
    )

    async def handle_force_daily_tick(call: ServiceCall) -> None:
        """Force tick to run immediately. Useful for testing or cleaning up stale instances."""
        _LOGGER.info("Family Hub: force_daily_tick service called")
        await store.async_force_daily_tick()
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "force_daily_tick", handle_force_daily_tick,
        schema=vol.Schema({}),
    )

    async def handle_rebuild_data(call: ServiceCall) -> None:
        """
        Heavy-lift data cleanup: remove orphan people, ghost instances, orphaned
        instances, duplicates, and prune old terminal data. Surfaces a summary
        via persistent notification.
        """
        _LOGGER.info("Family Hub: rebuild_data service called")
        summary = await store.async_rebuild_data()
        await coordinator.async_refresh()

        lines = [
            f"- Orphan people removed: {summary.get('orphan_people_removed', 0)}",
            f"- Ghost instances removed: {summary.get('ghost_instances_removed', 0)}",
            f"- Orphaned instances removed: {summary.get('orphaned_instances_removed', 0)}",
            f"- Duplicate instances removed: {summary.get('duplicate_instances_removed', 0)}",
            f"- Old instances pruned (>60d): {summary.get('old_instances_pruned', 0)}",
            f"- Old history pruned (>30d): {summary.get('old_history_pruned', 0)}",
        ]
        await hass.services.async_call(
            "persistent_notification", "create",
            {
                "title": "Family Hub: data rebuild complete",
                "message": "Cleanup summary:\n" + "\n".join(lines),
                "notification_id": "family_hub_rebuild",
            },
        )

    hass.services.async_register(
        DOMAIN, "rebuild_data", handle_rebuild_data,
        schema=vol.Schema({}),
    )

    # ------------------------------------------------------------------
    # Streak correction
    # ------------------------------------------------------------------

    async def handle_set_streak(call: ServiceCall) -> None:
        success = await store.async_set_streak(
            call.data["person_id"], call.data["chore_id"], call.data["count"],
        )
        if success:
            await coordinator.async_refresh()
        else:
            _LOGGER.warning("Family Hub: set_streak — person not found: %s", call.data["person_id"])

    hass.services.async_register(
        DOMAIN, "set_streak", handle_set_streak,
        schema=vol.Schema({
            vol.Required("person_id"): cv.string,
            vol.Required("chore_id"):  cv.string,
            vol.Required("count"):     vol.All(vol.Coerce(int), vol.Range(min=0)),
        }),
    )

    # v0.6.1: success-rate person streak admin override
    async def handle_set_completion_streak(call: ServiceCall) -> None:
        success = await store.async_set_completion_streak(
            call.data["person_id"], call.data["count"],
        )
        if success:
            await coordinator.async_refresh()
        else:
            _LOGGER.warning(
                "Family Hub: set_completion_streak — person not found: %s",
                call.data["person_id"],
            )

    hass.services.async_register(
        DOMAIN, "set_completion_streak", handle_set_completion_streak,
        schema=vol.Schema({
            vol.Required("person_id"): cv.string,
            vol.Required("count"):     vol.All(vol.Coerce(int), vol.Range(min=0)),
        }),
    )

    # ------------------------------------------------------------------
    # Rank correction (v0.6.0 S5)
    # ------------------------------------------------------------------

    async def handle_set_rank(call: ServiceCall) -> None:
        success = await store.async_set_rank(
            call.data["person_id"], call.data["rank_index"],
        )
        if success:
            await coordinator.async_refresh()
        else:
            _LOGGER.warning("Family Hub: set_rank — person not found: %s", call.data["person_id"])

    hass.services.async_register(
        DOMAIN, "set_rank", handle_set_rank,
        schema=vol.Schema({
            vol.Required("person_id"):  cv.string,
            vol.Required("rank_index"): vol.All(vol.Coerce(int), vol.Range(min=0)),
        }),
    )

    # ------------------------------------------------------------------
    # Backup
    # ------------------------------------------------------------------

    async def handle_export_backup(call: ServiceCall) -> None:
        timestamp   = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir  = hass.config.path("family_hub_backups")
        backup_path = os.path.join(backup_dir, f"family_hub_backup_{timestamp}.json")
        success     = await store.async_export_backup(backup_path)
        if success:
            await hass.services.async_call(
                "persistent_notification", "create",
                {
                    "message": f"Family Hub backup saved to:\n`{backup_path}`",
                    "title": "Family Hub backup complete",
                    "notification_id": "family_hub_backup",
                },
            )

    hass.services.async_register(
        DOMAIN, "export_backup", handle_export_backup,
        schema=vol.Schema({}),
    )


# ------------------------------------------------------------------
# Internal notification helpers
# ------------------------------------------------------------------

async def _notify_approval(hass: HomeAssistant, instance: dict, store) -> None:
    if instance.get("status") != "pending_approval":
        return
    chore       = store.get_chore(instance["chore_id"])
    person      = store.get_person(instance.get("completed_by", ""))
    person_name = person["name"] if person else "Someone"
    chore_name  = chore["name"] if chore else "a task"

    await hass.services.async_call(
        "persistent_notification", "create",
        {
            "message": (
                f"**{person_name}** completed **{chore_name}** and needs your approval.\n\n"
                f"Task ID: `{instance['id']}`"
            ),
            "title": "Family Hub: approval needed",
            "notification_id": f"family_hub_approval_{instance['id']}",
        },
    )

    # Push to parents who have a notify_target configured
    push_msg = f"{person_name} finished {chore_name} — open Family Hub to approve!"
    for parent in store.get_active_people():
        if parent.get("type") != "parent":
            continue
        target = parent.get("notify_target", "").strip()
        if not target:
            continue
        try:
            await hass.services.async_call(
                "notify", target,
                {"title": "Approval needed — Family Hub", "message": push_msg},
                blocking=False,
            )
        except Exception as err:
            _LOGGER.warning("Family Hub: approval push failed for '%s': %s", target, err)


async def _notify_redemption(hass: HomeAssistant, redemption: dict, store) -> None:
    person      = store.get_person(redemption["person_id"])
    person_name = person["name"] if person else "Someone"
    item_name   = redemption["item_name"]
    pts         = redemption["points_cost"]

    await hass.services.async_call(
        "persistent_notification", "create",
        {
            "message": (
                f"**{person_name}** wants to redeem "
                f"**{item_name}** for **{pts} points**.\n\n"
                f"Redemption ID: `{redemption['id']}`"
            ),
            "title": "Family Hub: redemption requested",
            "notification_id": f"family_hub_redemption_{redemption['id']}",
        },
    )

    # Push to parents who have a notify_target configured
    push_msg = f"{person_name} wants to redeem {item_name} for {pts} pts — open Family Hub to approve!"
    for parent in store.get_active_people():
        if parent.get("type") != "parent":
            continue
        target = parent.get("notify_target", "").strip()
        if not target:
            continue
        try:
            await hass.services.async_call(
                "notify", target,
                {"title": "Redemption request — Family Hub", "message": push_msg},
                blocking=False,
            )
        except Exception as err:
            _LOGGER.warning("Family Hub: redemption push failed for '%s': %s", target, err)
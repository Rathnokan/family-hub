"""
Family Hub — services (v0.3.0).

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
    DOMAIN,
    PERSON_TYPES,
    RECURRENCE_TYPES,
    SCOPE_COMMON,
    STORE_SCOPES,
)
from .coordinator import FamilyHubCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_services(hass: HomeAssistant, coordinator: FamilyHubCoordinator) -> None:
    """Register all Family Hub services."""

    store = coordinator.store

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
            created_by=call.data.get("created_by"),
        )
        await coordinator.async_refresh()

    _task_schema = vol.Schema({
        vol.Required("name"):                        cv.string,
        vol.Optional("description", default=""):     cv.string,
        vol.Optional("assigned_to", default=[]):     vol.Any(cv.string, [cv.string]),
        vol.Optional("points", default=0):           vol.Coerce(int),
        vol.Optional("approval_required", default=False): cv.boolean,
        vol.Optional("created_by"):                  cv.string,
    })

    hass.services.async_register(DOMAIN, "add_task",           _do_add_task, schema=_task_schema)
    # Backward-compat alias
    hass.services.async_register(DOMAIN, "add_one_time_task",  _do_add_task, schema=_task_schema)

    # ------------------------------------------------------------------
    # People management
    # ------------------------------------------------------------------

    async def handle_add_person(call: ServiceCall) -> None:
        await store.async_add_person(
            name=call.data["name"],
            person_type=call.data.get("person_type", "kid"),
            ha_user_id=call.data.get("ha_user_id"),
            avatar_color=call.data.get("avatar_color"),
        )
        await coordinator.async_refresh()

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
            vol.Required("person_id"):      cv.string,
            vol.Optional("name"):           cv.string,
            vol.Optional("ha_user_id"):     cv.string,
            vol.Optional("avatar_color"):   cv.string,
            vol.Optional("active"):         cv.boolean,
            vol.Optional("type"):           vol.In(PERSON_TYPES),
        }),
    )

    async def handle_remove_person(call: ServiceCall) -> None:
        success = await store.async_remove_person(call.data["person_id"])
        if success:
            await coordinator.async_refresh()
        else:
            _LOGGER.warning("Family Hub: remove_person — person not found: %s", call.data["person_id"])

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
            icon=call.data.get("icon"),
            created_by=call.data.get("created_by"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "add_chore", handle_add_chore,
        schema=vol.Schema({
            vol.Required("name"):                            cv.string,
            vol.Optional("description", default=""):         cv.string,
            vol.Optional("chore_type", default="assigned"):  vol.In(CHORE_TYPES),
            vol.Optional("category_label", default=""):      cv.string,
            vol.Optional("assigned_to", default=[]):         vol.Any(cv.string, [cv.string]),
            vol.Optional("points", default=10):              vol.Coerce(int),
            vol.Optional("approval_required", default=True): cv.boolean,
            vol.Optional("recurrence_type", default="daily"):vol.In(RECURRENCE_TYPES),
            vol.Optional("weekdays", default=[]):            [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            vol.Optional("day_filter", default=[]):          [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            vol.Optional("interval", default=1):             vol.All(vol.Coerce(int), vol.Range(min=1)),
            vol.Optional("day_of_month"):                    vol.All(vol.Coerce(int), vol.Range(min=1, max=31)),
            vol.Optional("sort_order"):                      vol.Coerce(int),
            vol.Optional("penalty_enabled", default=False):  cv.boolean,
            vol.Optional("penalty_points", default=0):       vol.Coerce(int),
            vol.Optional("icon"):                            cv.string,
            vol.Optional("created_by"):                      cv.string,
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
            vol.Optional("sort_order"):                      vol.Coerce(int),
            vol.Optional("assigned_to"):                     vol.Any(cv.string, [cv.string]),
            vol.Optional("points"):                          vol.Coerce(int),
            vol.Optional("approval_required"):               cv.boolean,
            vol.Optional("penalty_enabled"):                 cv.boolean,
            vol.Optional("penalty_points"):                  vol.Coerce(int),
            vol.Optional("weekdays"):                        [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            vol.Optional("day_filter"):                      [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
            vol.Optional("interval"):                        vol.All(vol.Coerce(int), vol.Range(min=1)),
            vol.Optional("day_of_month"):                    vol.All(vol.Coerce(int), vol.Range(min=1, max=31)),
            vol.Optional("active"):                          cv.boolean,
            vol.Optional("icon"):                            cv.string,
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
        }),
    )

    async def handle_delete_store_item(call: ServiceCall) -> None:
        await store.async_delete_store_item(call.data["item_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "delete_store_item", handle_delete_store_item,
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
        await store.async_update_settings(
            family_name=call.data.get("family_name"),
            points_per_dollar=call.data.get("points_per_dollar"),
            show_dollar_value_to_kids=call.data.get("show_dollar_value_to_kids"),
            category_labels=list(labels) if labels is not None else None,
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "update_settings", handle_update_settings,
        schema=vol.Schema({
            vol.Optional("family_name"):               cv.string,
            vol.Optional("points_per_dollar"):          vol.All(vol.Coerce(int), vol.Range(min=1, max=1000)),
            vol.Optional("show_dollar_value_to_kids"): cv.boolean,
            vol.Optional("category_labels"):            [cv.string],
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
    chore  = store.get_chore(instance["chore_id"])
    person = store.get_person(instance.get("completed_by", ""))
    await hass.services.async_call(
        "persistent_notification", "create",
        {
            "message": (
                f"**{person['name'] if person else 'Someone'}** completed "
                f"**{chore['name'] if chore else 'a task'}** and needs your approval.\n\n"
                f"Task ID: `{instance['id']}`"
            ),
            "title": "Family Hub: approval needed",
            "notification_id": f"family_hub_approval_{instance['id']}",
        },
    )


async def _notify_redemption(hass: HomeAssistant, redemption: dict, store) -> None:
    person = store.get_person(redemption["person_id"])
    await hass.services.async_call(
        "persistent_notification", "create",
        {
            "message": (
                f"**{person['name'] if person else 'Someone'}** wants to redeem "
                f"**{redemption['item_name']}** for **{redemption['points_cost']} points**.\n\n"
                f"Redemption ID: `{redemption['id']}`"
            ),
            "title": "Family Hub: redemption requested",
            "notification_id": f"family_hub_redemption_{redemption['id']}",
        },
    )

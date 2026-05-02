"""
Family Hub — services.

All actions that modify data are exposed as HA services so they can be
called from dashboards, automations, scripts, and voice assistants.

Services registered:
  family_hub.complete_task
  family_hub.claim_task
  family_hub.approve_task
  family_hub.deny_task
  family_hub.add_one_time_task
  family_hub.add_person
  family_hub.update_person
  family_hub.add_chore
  family_hub.update_chore
  family_hub.delete_chore
  family_hub.request_redemption
  family_hub.approve_redemption
  family_hub.decline_redemption
  family_hub.add_store_item
  family_hub.update_store_item
  family_hub.delete_store_item
  family_hub.award_bonus_points
  family_hub.export_backup
"""

from __future__ import annotations

import logging
import os
from datetime import datetime

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv

from .const import (
    CATEGORY_ONE_TIME,
    CHORE_CATEGORIES,
    DOMAIN,
    PERSON_TYPES,
    RECURRENCE_ONE_TIME,
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
        instance_id = call.data["task_id"]
        completed_by = call.data["person_id"]
        result = await store.async_complete_task(instance_id, completed_by)
        if result:
            await coordinator.async_refresh()
            await _send_approval_notification(hass, result, store)
        else:
            _LOGGER.warning("Family Hub: complete_task failed for task %s", instance_id)

    hass.services.async_register(
        DOMAIN,
        "complete_task",
        handle_complete_task,
        schema=vol.Schema({
            vol.Required("task_id"): cv.string,
            vol.Required("person_id"): cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Claim task (claimable pool)
    # ------------------------------------------------------------------

    async def handle_claim_task(call: ServiceCall) -> None:
        result = await store.async_claim_task(call.data["task_id"], call.data["person_id"])
        if result:
            await coordinator.async_refresh()
        else:
            _LOGGER.warning("Family Hub: claim_task failed for task %s", call.data["task_id"])

    hass.services.async_register(
        DOMAIN,
        "claim_task",
        handle_claim_task,
        schema=vol.Schema({
            vol.Required("task_id"): cv.string,
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
        DOMAIN,
        "approve_task",
        handle_approve_task,
        schema=vol.Schema({
            vol.Required("task_id"): cv.string,
            vol.Required("approved_by"): cv.string,
        }),
    )

    async def handle_deny_task(call: ServiceCall) -> None:
        result = await store.async_deny_task(
            call.data["task_id"],
            call.data["denied_by"],
            call.data.get("reason", ""),
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "deny_task",
        handle_deny_task,
        schema=vol.Schema({
            vol.Required("task_id"): cv.string,
            vol.Required("denied_by"): cv.string,
            vol.Optional("reason", default=""): cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Add one-time task (quick add from any dashboard)
    # ------------------------------------------------------------------

    async def handle_add_one_time_task(call: ServiceCall) -> None:
        await store.async_add_chore(
            name=call.data["name"],
            category=CATEGORY_ONE_TIME,
            assigned_to=call.data.get("assigned_to"),
            points=call.data.get("points", 0),
            approval_required=call.data.get("approval_required", False),
            recurrence_type=RECURRENCE_ONE_TIME,
            description=call.data.get("description", ""),
            created_by=call.data.get("created_by"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "add_one_time_task",
        handle_add_one_time_task,
        schema=vol.Schema({
            vol.Required("name"): cv.string,
            vol.Optional("description", default=""): cv.string,
            vol.Optional("assigned_to"): cv.string,
            vol.Optional("points", default=0): vol.Coerce(int),
            vol.Optional("approval_required", default=False): cv.boolean,
            vol.Optional("created_by"): cv.string,
        }),
    )

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
        DOMAIN,
        "add_person",
        handle_add_person,
        schema=vol.Schema({
            vol.Required("name"): cv.string,
            vol.Optional("person_type", default="kid"): vol.In(PERSON_TYPES),
            vol.Optional("ha_user_id"): cv.string,
            vol.Optional("avatar_color"): cv.string,
        }),
    )

    async def handle_update_person(call: ServiceCall) -> None:
        await store.async_update_person(call.data["person_id"], **{
            k: v for k, v in call.data.items() if k != "person_id"
        })
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "update_person",
        handle_update_person,
        schema=vol.Schema({
            vol.Required("person_id"): cv.string,
            vol.Optional("name"): cv.string,
            vol.Optional("ha_user_id"): cv.string,
            vol.Optional("avatar_color"): cv.string,
            vol.Optional("active"): cv.boolean,
        }),
    )

    # ------------------------------------------------------------------
    # Chore management
    # ------------------------------------------------------------------

    async def handle_add_chore(call: ServiceCall) -> None:
        recurrence_config = {}
        for key in ("weekday", "interval", "day_of_month"):
            if key in call.data:
                recurrence_config[key] = call.data[key]

        await store.async_add_chore(
            name=call.data["name"],
            category=call.data.get("category", "assigned"),
            assigned_to=call.data.get("assigned_to"),
            points=call.data.get("points", 10),
            approval_required=call.data.get("approval_required", True),
            recurrence_type=call.data.get("recurrence_type", "daily"),
            recurrence_config=recurrence_config,
            description=call.data.get("description", ""),
            icon=call.data.get("icon"),
            created_by=call.data.get("created_by"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "add_chore",
        handle_add_chore,
        schema=vol.Schema({
            vol.Required("name"): cv.string,
            vol.Optional("description", default=""): cv.string,
            vol.Optional("category", default="assigned"): vol.In(CHORE_CATEGORIES),
            vol.Optional("assigned_to"): cv.string,
            vol.Optional("points", default=10): vol.Coerce(int),
            vol.Optional("approval_required", default=True): cv.boolean,
            vol.Optional("recurrence_type", default="daily"): vol.In(RECURRENCE_TYPES),
            vol.Optional("weekday"): vol.All(vol.Coerce(int), vol.Range(min=0, max=6)),
            vol.Optional("interval"): vol.All(vol.Coerce(int), vol.Range(min=1)),
            vol.Optional("day_of_month"): vol.All(vol.Coerce(int), vol.Range(min=1, max=31)),
            vol.Optional("icon"): cv.string,
            vol.Optional("created_by"): cv.string,
        }),
    )

    async def handle_update_chore(call: ServiceCall) -> None:
        await store.async_update_chore(call.data["chore_id"], **{
            k: v for k, v in call.data.items() if k != "chore_id"
        })
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "update_chore",
        handle_update_chore,
        schema=vol.Schema({
            vol.Required("chore_id"): cv.string,
            vol.Optional("name"): cv.string,
            vol.Optional("description"): cv.string,
            vol.Optional("points"): vol.Coerce(int),
            vol.Optional("approval_required"): cv.boolean,
            vol.Optional("assigned_to"): cv.string,
            vol.Optional("active"): cv.boolean,
        }),
    )

    async def handle_delete_chore(call: ServiceCall) -> None:
        await store.async_delete_chore(call.data["chore_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "delete_chore",
        handle_delete_chore,
        schema=vol.Schema({vol.Required("chore_id"): cv.string}),
    )

    # ------------------------------------------------------------------
    # Store items
    # ------------------------------------------------------------------

    async def handle_add_store_item(call: ServiceCall) -> None:
        await store.async_add_store_item(
            name=call.data["name"],
            dollar_value=call.data["dollar_value"],
            scope=call.data.get("scope", SCOPE_COMMON),
            person_id=call.data.get("person_id"),
            description=call.data.get("description", ""),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "add_store_item",
        handle_add_store_item,
        schema=vol.Schema({
            vol.Required("name"): cv.string,
            vol.Required("dollar_value"): vol.Coerce(float),
            vol.Optional("description", default=""): cv.string,
            vol.Optional("scope", default=SCOPE_COMMON): vol.In(STORE_SCOPES),
            vol.Optional("person_id"): cv.string,
        }),
    )

    async def handle_update_store_item(call: ServiceCall) -> None:
        await store.async_update_store_item(call.data["item_id"], **{
            k: v for k, v in call.data.items() if k != "item_id"
        })
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "update_store_item",
        handle_update_store_item,
        schema=vol.Schema({
            vol.Required("item_id"): cv.string,
            vol.Optional("name"): cv.string,
            vol.Optional("description"): cv.string,
            vol.Optional("dollar_value"): vol.Coerce(float),
            vol.Optional("scope"): vol.In(STORE_SCOPES),
            vol.Optional("person_id"): cv.string,
            vol.Optional("active"): cv.boolean,
        }),
    )

    async def handle_delete_store_item(call: ServiceCall) -> None:
        await store.async_delete_store_item(call.data["item_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "delete_store_item",
        handle_delete_store_item,
        schema=vol.Schema({vol.Required("item_id"): cv.string}),
    )

    # ------------------------------------------------------------------
    # Redemptions
    # ------------------------------------------------------------------

    async def handle_request_redemption(call: ServiceCall) -> None:
        result = await store.async_request_redemption(call.data["person_id"], call.data["item_id"])
        if result:
            await coordinator.async_refresh()
            await _send_redemption_notification(hass, result, store)

    hass.services.async_register(
        DOMAIN,
        "request_redemption",
        handle_request_redemption,
        schema=vol.Schema({
            vol.Required("person_id"): cv.string,
            vol.Required("item_id"): cv.string,
        }),
    )

    async def handle_approve_redemption(call: ServiceCall) -> None:
        result = await store.async_approve_redemption(
            call.data["redemption_id"],
            call.data["approved_by"],
        )
        if result:
            await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "approve_redemption",
        handle_approve_redemption,
        schema=vol.Schema({
            vol.Required("redemption_id"): cv.string,
            vol.Required("approved_by"): cv.string,
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
        DOMAIN,
        "decline_redemption",
        handle_decline_redemption,
        schema=vol.Schema({
            vol.Required("redemption_id"): cv.string,
            vol.Required("declined_by"): cv.string,
            vol.Optional("reason", default=""): cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Bonus points
    # ------------------------------------------------------------------

    async def handle_award_bonus_points(call: ServiceCall) -> None:
        """
        Award bonus points to a person.
        Accepts either 'points' (integer) or 'dollar_amount' (float).
        If dollar_amount is provided it is converted automatically using the
        current points_per_dollar rate. dollar_amount takes precedence if both
        are provided.
        """
        await store.async_award_bonus_points(
            person_id=call.data["person_id"],
            points=call.data.get("points", 0),
            reason=call.data.get("reason", ""),
            dollar_amount=call.data.get("dollar_amount"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "award_bonus_points",
        handle_award_bonus_points,
        schema=vol.Schema({
            vol.Required("person_id"): cv.string,
            # Either points OR dollar_amount must be supplied (validated in data_store)
            vol.Optional("points", default=0): vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("dollar_amount"): vol.All(vol.Coerce(float), vol.Range(min=0.01)),
            vol.Optional("reason", default=""): cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Deduct points (admin penalty / correction)
    # ------------------------------------------------------------------

    async def handle_deduct_points(call: ServiceCall) -> None:
        """
        Deduct points from a person as an admin action.
        Accepts either 'points' (integer) or 'dollar_amount' (float).
        The person's spendable balance decreases but lifetime total is unchanged.
        """
        await store.async_admin_deduct_points(
            person_id=call.data["person_id"],
            points=call.data.get("points", 0),
            reason=call.data.get("reason", ""),
            dollar_amount=call.data.get("dollar_amount"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "deduct_points",
        handle_deduct_points,
        schema=vol.Schema({
            vol.Required("person_id"): cv.string,
            vol.Optional("points", default=0): vol.All(vol.Coerce(int), vol.Range(min=0)),
            vol.Optional("dollar_amount"): vol.All(vol.Coerce(float), vol.Range(min=0.01)),
            vol.Optional("reason", default=""): cv.string,
        }),
    )

    # ------------------------------------------------------------------
    # Settings (admin)
    # ------------------------------------------------------------------

    async def handle_update_settings(call: ServiceCall) -> None:
        """Update integration settings. All fields are optional."""
        await store.async_update_settings(
            family_name=call.data.get("family_name"),
            points_per_dollar=call.data.get("points_per_dollar"),
            show_dollar_value_to_kids=call.data.get("show_dollar_value_to_kids"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN,
        "update_settings",
        handle_update_settings,
        schema=vol.Schema({
            vol.Optional("family_name"): cv.string,
            vol.Optional("points_per_dollar"): vol.All(vol.Coerce(int), vol.Range(min=1, max=1000)),
            vol.Optional("show_dollar_value_to_kids"): cv.boolean,
        }),
    )

    # ------------------------------------------------------------------
    # Backup / export
    # ------------------------------------------------------------------

    async def handle_export_backup(call: ServiceCall) -> None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = hass.config.path("family_hub_backups")
        backup_path = os.path.join(backup_dir, f"family_hub_backup_{timestamp}.json")
        success = await store.async_export_backup(backup_path)
        if success:
            # Use hass.services.async_call — hass.components.* is deprecated
            await hass.services.async_call(
                "persistent_notification",
                "create",
                {
                    "message": f"Family Hub backup saved to:\n`{backup_path}`",
                    "title": "Family Hub backup complete",
                    "notification_id": "family_hub_backup",
                },
            )

    hass.services.async_register(
        DOMAIN,
        "export_backup",
        handle_export_backup,
        schema=vol.Schema({}),
    )


# ------------------------------------------------------------------
# Internal notification helpers
# ------------------------------------------------------------------

async def _send_approval_notification(hass: HomeAssistant, task_instance: dict, store) -> None:
    """Send a persistent notification when a task needs parent approval."""
    if task_instance.get("status") != "pending_approval":
        return
    chore = store.get_chore(task_instance["chore_id"])
    person = store.get_person(task_instance.get("completed_by", ""))
    chore_name = chore["name"] if chore else "a task"
    person_name = person["name"] if person else "Someone"
    # Use hass.services.async_call — hass.components.* is deprecated
    await hass.services.async_call(
        "persistent_notification",
        "create",
        {
            "message": (
                f"**{person_name}** completed **{chore_name}** and needs your approval.\n\n"
                f"Task ID: `{task_instance['id']}`"
            ),
            "title": "Family Hub: approval needed",
            "notification_id": f"family_hub_approval_{task_instance['id']}",
        },
    )


async def _send_redemption_notification(hass: HomeAssistant, redemption: dict, store) -> None:
    """Send a persistent notification when a store redemption is requested."""
    person = store.get_person(redemption["person_id"])
    person_name = person["name"] if person else "Someone"
    # Use hass.services.async_call — hass.components.* is deprecated
    await hass.services.async_call(
        "persistent_notification",
        "create",
        {
            "message": (
                f"**{person_name}** wants to redeem **{redemption['item_name']}** "
                f"for **{redemption['points_cost']} points**.\n\n"
                f"Redemption ID: `{redemption['id']}`"
            ),
            "title": "Family Hub: redemption requested",
            "notification_id": f"family_hub_redemption_{redemption['id']}",
        },
    )

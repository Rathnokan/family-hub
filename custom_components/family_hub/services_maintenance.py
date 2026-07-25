"""
Family Hub — Home Maintenance module services (v0.8.0 A4).

register_maintenance_services is called from async_setup_services only when the
"maintenance" module is enabled (via modules.MODULES). Every handler mutates the
store then refreshes the coordinator so the maintenance sensors + card model
update. Task-keyed handlers pop `task_id` and forward the rest as kwargs.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN

if TYPE_CHECKING:
    from .coordinator import FamilyHubCoordinator

_LOGGER = logging.getLogger(__name__)

# Optional task fields shared by add/update (name is required only on add).
_TASK_OPTIONAL = {
    vol.Optional("description"):         cv.string,
    vol.Optional("category"):            cv.string,
    vol.Optional("location"):            cv.string,
    vol.Optional("schedule_mode"):       vol.In(["from_completion", "calendar_anchored"]),
    vol.Optional("recurrence"):          vol.Any(dict, None),
    vol.Optional("seasonal_anchor"):     vol.Any(dict, None),
    vol.Optional("workflow"):            vol.In(["simple", "inspect_plan_do"]),
    vol.Optional("lead_time_days"):      vol.Coerce(int),
    vol.Optional("effort"):              dict,
    vol.Optional("est_cost_diy"):        vol.Coerce(float),
    vol.Optional("est_cost_pro"):        vol.Coerce(float),
    vol.Optional("default_mode"):        vol.In(["diy", "pro", "decide"]),
    vol.Optional("product_ids"):         [cv.string],
    vol.Optional("assignable"):          cv.boolean,
    vol.Optional("default_point_value"): vol.Coerce(int),
    vol.Optional("next_due"):            cv.string,
    vol.Optional("enabled"):             cv.boolean,
}

_PRODUCT_OPTIONAL = {
    vol.Optional("spec"):                cv.string,
    vol.Optional("unit_cost_est"):       vol.Coerce(float),
    vol.Optional("qty_per_use"):         vol.Coerce(int),
    vol.Optional("where_to_buy"):        cv.string,
    vol.Optional("inventory_count"):     vol.Coerce(int),
    vol.Optional("low_stock_threshold"): vol.Coerce(int),
    vol.Optional("linked_task_ids"):     [cv.string],
}

_VENDOR_OPTIONAL = {
    vol.Optional("trade"):      cv.string,
    vol.Optional("phone"):      cv.string,
    vol.Optional("notes"):      cv.string,
    vol.Optional("preferred"):  cv.boolean,
    vol.Optional("last_used"):  cv.string,
    vol.Optional("last_price"): vol.Coerce(float),
}


def register_maintenance_services(hass: HomeAssistant, coordinator: "FamilyHubCoordinator") -> None:
    """Register all maintenance_* services. Called only when the module is on."""

    store = coordinator.store

    def _reg(name: str, handler, schema) -> None:
        s = schema if isinstance(schema, vol.Schema) else vol.Schema(schema)
        hass.services.async_register(DOMAIN, name, handler, schema=s)

    async def _refresh() -> None:
        await coordinator.async_refresh()

    # ---- Tasks ----------------------------------------------------------

    async def handle_add_task(call: ServiceCall) -> None:
        await store.async_maintenance_add_task(**dict(call.data))
        await _refresh()

    _reg("maintenance_add_task", handle_add_task,
         {vol.Required("name"): cv.string, **_TASK_OPTIONAL})

    async def handle_update_task(call: ServiceCall) -> None:
        data = dict(call.data)
        await store.async_maintenance_update_task(data.pop("task_id"), **data)
        await _refresh()

    _reg("maintenance_update_task", handle_update_task,
         {vol.Required("task_id"): cv.string, vol.Optional("name"): cv.string, **_TASK_OPTIONAL})

    async def handle_delete_task(call: ServiceCall) -> None:
        await store.async_maintenance_delete_task(call.data["task_id"])
        await _refresh()

    _reg("maintenance_delete_task", handle_delete_task,
         {vol.Required("task_id"): cv.string})

    async def handle_complete_task(call: ServiceCall) -> None:
        data = dict(call.data)
        await store.async_maintenance_complete_task(data.pop("task_id"), **data)
        await _refresh()

    _reg("maintenance_complete_task", handle_complete_task, {
        vol.Required("task_id"):     cv.string,
        vol.Optional("completed_by"): vol.Any(cv.string, None),
        vol.Optional("mode"):         vol.In(["diy", "pro"]),
        vol.Optional("actual_cost"):  vol.Coerce(float),
        vol.Optional("actual_minutes"): vol.Coerce(int),
        vol.Optional("products_used"): [dict],
        vol.Optional("vendor_id"):    vol.Any(cv.string, None),
        vol.Optional("notes"):        cv.string,
        vol.Optional("photo"):        vol.Any(cv.string, None),
        vol.Optional("result"):       vol.In(["all_good", "needs_work"]),
    })

    async def handle_snooze_task(call: ServiceCall) -> None:
        data = dict(call.data)
        await store.async_maintenance_snooze_task(
            data["task_id"], until=data.get("until"), days=data.get("days"),
        )
        await _refresh()

    _reg("maintenance_snooze_task", handle_snooze_task, {
        vol.Required("task_id"): cv.string,
        vol.Optional("until"):   cv.string,
        vol.Optional("days"):    vol.Coerce(int),
    })

    async def handle_reschedule_task(call: ServiceCall) -> None:
        await store.async_maintenance_reschedule_task(call.data["task_id"], call.data["next_due"])
        await _refresh()

    _reg("maintenance_reschedule_task", handle_reschedule_task, {
        vol.Required("task_id"):  cv.string,
        vol.Required("next_due"): cv.string,
    })

    async def handle_skip_task(call: ServiceCall) -> None:
        await store.async_maintenance_skip_task(call.data["task_id"], call.data.get("notes", ""))
        await _refresh()

    _reg("maintenance_skip_task", handle_skip_task, {
        vol.Required("task_id"): cv.string,
        vol.Optional("notes"):   cv.string,
    })

    # ---- Chores bridge (offer/revoke via event bus) ---------------------

    async def handle_offer_task(call: ServiceCall) -> None:
        data = dict(call.data)
        await store.async_maintenance_offer_task(
            data["task_id"], assigned_to=data.get("assigned_to"),
            points=data.get("points"), due_date=data.get("due_date"),
        )
        await _refresh()

    _reg("maintenance_offer_task", handle_offer_task, {
        vol.Required("task_id"):     cv.string,
        vol.Optional("assigned_to"): vol.Any(cv.string, None),
        vol.Optional("points"):      vol.Coerce(int),
        vol.Optional("due_date"):    cv.string,
    })

    async def handle_revoke_task(call: ServiceCall) -> None:
        await store.async_maintenance_revoke_task(call.data["task_id"])
        await _refresh()

    _reg("maintenance_revoke_task", handle_revoke_task, {vol.Required("task_id"): cv.string})

    # ---- Products -------------------------------------------------------

    async def handle_add_product(call: ServiceCall) -> None:
        await store.async_maintenance_add_product(**dict(call.data))
        await _refresh()

    _reg("maintenance_add_product", handle_add_product,
         {vol.Required("name"): cv.string, **_PRODUCT_OPTIONAL})

    async def handle_update_product(call: ServiceCall) -> None:
        data = dict(call.data)
        await store.async_maintenance_update_product(data.pop("product_id"), **data)
        await _refresh()

    _reg("maintenance_update_product", handle_update_product,
         {vol.Required("product_id"): cv.string, vol.Optional("name"): cv.string, **_PRODUCT_OPTIONAL})

    async def handle_delete_product(call: ServiceCall) -> None:
        await store.async_maintenance_delete_product(call.data["product_id"])
        await _refresh()

    _reg("maintenance_delete_product", handle_delete_product,
         {vol.Required("product_id"): cv.string})

    async def handle_adjust_inventory(call: ServiceCall) -> None:
        await store.async_maintenance_adjust_inventory(call.data["product_id"], call.data["delta"])
        await _refresh()

    _reg("maintenance_adjust_inventory", handle_adjust_inventory, {
        vol.Required("product_id"): cv.string,
        vol.Required("delta"):      vol.Coerce(int),
    })

    # ---- Vendors --------------------------------------------------------

    async def handle_add_vendor(call: ServiceCall) -> None:
        await store.async_maintenance_add_vendor(**dict(call.data))
        await _refresh()

    _reg("maintenance_add_vendor", handle_add_vendor,
         {vol.Required("name"): cv.string, **_VENDOR_OPTIONAL})

    async def handle_update_vendor(call: ServiceCall) -> None:
        data = dict(call.data)
        await store.async_maintenance_update_vendor(data.pop("vendor_id"), **data)
        await _refresh()

    _reg("maintenance_update_vendor", handle_update_vendor,
         {vol.Required("vendor_id"): cv.string, vol.Optional("name"): cv.string, **_VENDOR_OPTIONAL})

    async def handle_delete_vendor(call: ServiceCall) -> None:
        await store.async_maintenance_delete_vendor(call.data["vendor_id"])
        await _refresh()

    _reg("maintenance_delete_vendor", handle_delete_vendor,
         {vol.Required("vendor_id"): cv.string})

    # ---- Funds ----------------------------------------------------------

    async def handle_update_fund(call: ServiceCall) -> None:
        await store.async_maintenance_update_fund(**dict(call.data))
        await _refresh()

    _reg("maintenance_update_fund", handle_update_fund, {
        vol.Optional("fund_id"):        cv.string,
        vol.Optional("fund_type"):      vol.In(["sinking", "emergency"]),
        vol.Optional("name"):           cv.string,
        vol.Optional("asset_category"): cv.string,
        vol.Optional("target_amount"):  vol.Coerce(float),
        vol.Optional("balance"):        vol.Coerce(float),
        vol.Optional("monthly_target"): vol.Coerce(float),
    })

    # ---- Home Profile + seeds ------------------------------------------

    async def handle_update_home_profile(call: ServiceCall) -> None:
        await store.async_maintenance_update_home_profile(**dict(call.data))
        await _refresh()

    # Home Profile keys vary (age/sqft/pool/softener/...); accept any.
    _reg("maintenance_update_home_profile", handle_update_home_profile,
         vol.Schema({}, extra=vol.ALLOW_EXTRA))

    async def handle_apply_seeds(call: ServiceCall) -> None:
        await store.async_maintenance_apply_seeds()
        await _refresh()

    _reg("maintenance_apply_seeds", handle_apply_seeds, vol.Schema({}))

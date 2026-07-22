"""
Family Hub — Meals module services (v0.8.0).

Extracted verbatim from services.py in the v0.8.0 module framework (A2) so the
Meals module can be gated: register_meals_services is called from
async_setup_services only when the "meals" module is enabled.

The card resolves the meal library client-side and passes already-resolved
fields (sides, variant, protein). Every handler mutates the store then refreshes
the coordinator so the new meals model propagates to the card.
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


def register_meals_services(hass: HomeAssistant, coordinator: "FamilyHubCoordinator") -> None:
    """Register all meals_* services. Called only when the Meals module is on."""

    store = coordinator.store

    _MEAL_SLOTS = vol.In(["b", "l"])
    _MEAL_SCOPES = vol.In(["today", "week", "2weeks"])

    async def handle_meals_set_bl(call: ServiceCall) -> None:
        await store.async_meals_set_bl(
            call.data["date"], call.data["slot"], call.data.get("meal_id"),
            call.data.get("scope", "today"), call.data.get("week_start", "Sunday"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_set_bl", handle_meals_set_bl,
        schema=vol.Schema({
            vol.Required("date"):       cv.string,
            vol.Required("slot"):       _MEAL_SLOTS,
            vol.Optional("meal_id"):    vol.Any(cv.string, None),
            vol.Optional("scope"):      _MEAL_SCOPES,
            vol.Optional("week_start"): vol.In(["Sunday", "Monday"]),
        }),
    )

    async def handle_meals_set_dinner(call: ServiceCall) -> None:
        await store.async_meals_set_dinner(
            call.data["date"], call.data["main"], call.data.get("sides"),
            call.data.get("protein"), call.data.get("variant"),
        )
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_set_dinner", handle_meals_set_dinner,
        schema=vol.Schema({
            vol.Required("date"):    cv.string,
            vol.Required("main"):    cv.string,
            vol.Optional("sides"):   [cv.string],
            vol.Optional("protein"): vol.Any(cv.string, None),
            vol.Optional("variant"): vol.Any(cv.string, None),
        }),
    )

    async def handle_meals_set_dinner_sides(call: ServiceCall) -> None:
        await store.async_meals_set_dinner_sides(call.data["date"], call.data.get("sides", []))
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_set_dinner_sides", handle_meals_set_dinner_sides,
        schema=vol.Schema({
            vol.Required("date"):  cv.string,
            vol.Optional("sides"): [cv.string],
        }),
    )

    async def handle_meals_clear_dinner(call: ServiceCall) -> None:
        await store.async_meals_clear_dinner(call.data["date"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_clear_dinner", handle_meals_clear_dinner,
        schema=vol.Schema({vol.Required("date"): cv.string}),
    )

    async def handle_meals_clear_day(call: ServiceCall) -> None:
        await store.async_meals_clear_day(call.data["date"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_clear_day", handle_meals_clear_day,
        schema=vol.Schema({vol.Required("date"): cv.string}),
    )

    async def handle_meals_set_rhythm(call: ServiceCall) -> None:
        await store.async_meals_set_rhythm(call.data["weekday"], call.data.get("theme_key"))
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_set_rhythm", handle_meals_set_rhythm,
        schema=vol.Schema({
            vol.Required("weekday"):    vol.All(vol.Coerce(int), vol.Range(min=0, max=6)),
            vol.Optional("theme_key"):  vol.Any(cv.string, None),
        }),
    )

    async def handle_meals_toggle_fav(call: ServiceCall) -> None:
        await store.async_meals_toggle_fav(call.data["meal_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_toggle_fav", handle_meals_toggle_fav,
        schema=vol.Schema({vol.Required("meal_id"): cv.string}),
    )

    async def handle_meals_add_custom_meal(call: ServiceCall) -> None:
        await store.async_meals_add_custom_meal(call.data["meal"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_add_custom_meal", handle_meals_add_custom_meal,
        schema=vol.Schema({vol.Required("meal"): dict}),
    )

    async def handle_meals_remove_custom_meal(call: ServiceCall) -> None:
        await store.async_meals_remove_custom_meal(call.data["meal_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_remove_custom_meal", handle_meals_remove_custom_meal,
        schema=vol.Schema({vol.Required("meal_id"): cv.string}),
    )

    async def handle_meals_add_ingredient(call: ServiceCall) -> None:
        await store.async_meals_add_ingredient(call.data["ingredient"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_add_ingredient", handle_meals_add_ingredient,
        schema=vol.Schema({vol.Required("ingredient"): dict}),
    )

    async def handle_meals_remove_ingredient(call: ServiceCall) -> None:
        await store.async_meals_remove_ingredient(call.data["ingredient_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_remove_ingredient", handle_meals_remove_ingredient,
        schema=vol.Schema({vol.Required("ingredient_id"): cv.string}),
    )

    async def handle_meals_save_recipe(call: ServiceCall) -> None:
        await store.async_meals_save_recipe(call.data["meal_id"], call.data["recipe"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_save_recipe", handle_meals_save_recipe,
        schema=vol.Schema({
            vol.Required("meal_id"): cv.string,
            vol.Required("recipe"):  dict,
        }),
    )

    async def handle_meals_toggle_have(call: ServiceCall) -> None:
        await store.async_meals_toggle_have(call.data["ingredient_id"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_toggle_have", handle_meals_toggle_have,
        schema=vol.Schema({vol.Required("ingredient_id"): cv.string}),
    )

    async def handle_meals_toggle_grocery(call: ServiceCall) -> None:
        await store.async_meals_toggle_grocery(call.data["key"], call.data["checked"])
        await coordinator.async_refresh()

    hass.services.async_register(
        DOMAIN, "meals_toggle_grocery", handle_meals_toggle_grocery,
        schema=vol.Schema({
            vol.Required("key"):     cv.string,
            vol.Required("checked"): cv.boolean,
        }),
    )

"""
Family Hub — Home Assistant integration.

A private, self-hosted family task management system:
  • Chores for kids (assigned + claimable, daily/weekly/custom recurrence)
  • Points, rewards store, and redemption approval flow
  • Home maintenance tracking
  • Personal reminders (per-person recurring reminders)
  • One-time tasks with optional expiry and penalties
  • Four dashboard modes via the custom family-hub-card Lovelace card
  • Admin correction services: excuse, reject, mark-complete, force tick

All data lives in a single JSON file — no cloud, no third-party accounts.

Card registration:
  - www/ is registered as a static HTTP path so the JS file is served.
  - add_extra_js_url() loads the card JS on every HA frontend page load.
    This is the reliable, officially-supported way to register custom cards
    from within an integration — it makes the card available in the picker
    without manually touching Lovelace resource storage.
  - manifest.json declares "frontend" and "http" as dependencies.
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .const import (
    CARD_JS_URL,
    CARD_URL_PATH,
    CONF_FAMILY_NAME,
    CONF_POINTS_PER_DOLLAR,
    DOMAIN,
    VERSION,
)
from .coordinator import FamilyHubCoordinator
from .data_store import FamilyHubDataStore
from .services import async_setup_services

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.SENSOR]

# Absolute path to this integration's www/ folder
_WWW_PATH = Path(__file__).parent / "www"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """
    Called once when the integration is loaded (before any config entries).

    Registers the static HTTP path so the card JS is served, then registers
    the JS with the HA frontend so it loads on every page and appears in the
    Lovelace card picker automatically.
    """
    hass.data.setdefault(DOMAIN, {})

    # --- Serve www/ as a static HTTP path ---
    # Makes /family_hub/family-hub-card.js accessible to the browser.
    # cache_headers=False so the browser always fetches the latest file.
    try:
        await hass.http.async_register_static_paths([
            StaticPathConfig(CARD_URL_PATH, str(_WWW_PATH), cache_headers=False)
        ])
        _LOGGER.debug("Family Hub: static path registered %s → %s", CARD_URL_PATH, _WWW_PATH)
    except RuntimeError:
        # Already registered — safe on reload
        _LOGGER.debug("Family Hub: static path %s already registered", CARD_URL_PATH)
    except Exception as err:  # noqa: BLE001
        _LOGGER.warning("Family Hub: could not register static path: %s", err)

    # --- Register the card JS with the HA frontend ---
    # add_extra_js_url() is the supported public API for loading custom JS
    # on every HA frontend page. The ?v= query parameter forces the browser
    # to re-fetch the file on every integration update.
    versioned_url = f"{CARD_JS_URL}?v={VERSION}"
    add_extra_js_url(hass, versioned_url)
    _LOGGER.info(
        "Family Hub: card JS registered — family-hub-card is available in the "
        "Lovelace card picker (%s)",
        versioned_url,
    )

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Family Hub from a config entry (UI flow)."""
    hass.data.setdefault(DOMAIN, {})

    storage_path = entry.data["storage_path"]
    family_name = entry.data[CONF_FAMILY_NAME]
    points_per_dollar = entry.data[CONF_POINTS_PER_DOLLAR]
    initial_people = entry.data.get("initial_people", [])

    # --- Data store ---
    store = FamilyHubDataStore(hass, storage_path)
    await store.async_load()

    await store.async_update_settings(
        family_name=family_name,
        points_per_dollar=points_per_dollar,
    )

    # Seed initial people on first run
    if not store.people and initial_people:
        _LOGGER.info("Family Hub: seeding %d initial people", len(initial_people))
        for person_data in initial_people:
            await store.async_add_person(
                name=person_data["name"],
                person_type=person_data["type"],
            )

    # --- Coordinator ---
    coordinator = FamilyHubCoordinator(hass, store)
    await coordinator.async_config_entry_first_refresh()

    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
        "store": store,
    }

    # --- Services ---
    await async_setup_services(hass, coordinator)

    # --- Sensors ---
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # --- Stale entity cleanup ---
    await _async_cleanup_stale_entities(hass, entry, store)

    _LOGGER.info(
        "Family Hub: ready — %s, %d people, %d active chores",
        family_name,
        len(store.people),
        len(store.get_active_chores()),
    )
    return True


async def _async_cleanup_stale_entities(
    hass: HomeAssistant,
    entry: ConfigEntry,
    store: FamilyHubDataStore,
) -> None:
    """Remove any entities that no longer exist in this version of the integration."""
    expected: set[str] = {f"{DOMAIN}_person_{p['id']}" for p in store.people}
    expected.update({
        f"{DOMAIN}_maintenance_due",
        f"{DOMAIN}_maintenance_overdue",
        f"{DOMAIN}_needs_attention",
        f"{DOMAIN}_claimable_tasks",
    })

    registry = er.async_get(hass)
    stale = [
        e for e in er.async_entries_for_config_entry(registry, entry.entry_id)
        if e.unique_id not in expected
    ]

    if stale:
        _LOGGER.info(
            "Family Hub: removing %d stale entities: %s",
            len(stale),
            [e.entity_id for e in stale],
        )
        for entity in stale:
            registry.async_remove(entity.entity_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry and clean up services."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        # Dynamically remove all services registered under the DOMAIN rather than
        # maintaining a brittle hardcoded list. This automatically handles any
        # services added or renamed in future versions without needing a code change here.
        for service_name in list(hass.services.async_services_for_domain(DOMAIN)):
            hass.services.async_remove(DOMAIN, service_name)

        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Entry removed — data file intentionally preserved."""
    _LOGGER.info(
        "Family Hub: entry removed. Data file kept at %s",
        entry.data.get("storage_path"),
    )

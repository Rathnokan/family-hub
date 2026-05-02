"""
Family Hub — Home Assistant integration.

A private, self-hosted family task management system:
  • Chores for kids (assigned + claimable, daily/weekly/custom recurrence)
  • Points, rewards store, and redemption approval flow
  • Home maintenance tracking
  • Personal reminders (per-person recurring reminders)
  • One-time tasks for anyone
  • Four dashboard modes via the custom family-hub-card Lovelace card

All data lives in a single JSON file — no cloud, no third-party accounts.

Card registration notes:
  - The www/ subfolder is registered as a static HTTP path in async_setup.
  - The card JS is registered as a Lovelace module resource in async_setup
    (once per integration load, not per config entry).
  - manifest.json declares "frontend" and "http" as dependencies so HA
    loads those components before this integration starts.
  - Uses async_register_static_paths with StaticPathConfig — current API
    as of HA 2025+. The old sync register_static_path is deprecated.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, Platform
from homeassistant.core import CoreState, Event, HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_call_later

from .const import (
    CARD_JS_FILENAME,
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
    Called once when the integration is loaded (not per config entry).

    Static path and Lovelace resource registration live here so they run
    exactly once per HA start, regardless of how many config entries exist.
    """
    hass.data.setdefault(DOMAIN, {})

    # --- Register www/ as a static HTTP path ---
    # Makes /family_hub/family-hub-card.js accessible to the browser.
    # cache_headers=False ensures the browser always fetches the latest version
    # (we also append ?v=VERSION to the resource URL for extra safety).
    try:
        await hass.http.async_register_static_paths([
            StaticPathConfig(CARD_URL_PATH, str(_WWW_PATH), cache_headers=False)
        ])
        _LOGGER.debug("Family Hub: static path registered %s → %s", CARD_URL_PATH, _WWW_PATH)
    except RuntimeError:
        # RuntimeError means the path was already registered (e.g. reload).
        _LOGGER.debug("Family Hub: static path %s already registered", CARD_URL_PATH)
    except Exception as err:  # noqa: BLE001
        _LOGGER.warning("Family Hub: could not register static path: %s", err)

    # --- Schedule Lovelace resource registration ---
    # Must happen after HA is fully started so the Lovelace storage is loaded.
    async def _register_resource(_event: Event | None = None) -> None:
        await _async_register_lovelace_resource(hass)

    if hass.state == CoreState.running:
        # Already running (e.g. reload via UI) — register immediately
        await _register_resource()
    else:
        # Still booting — wait for the start event
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _register_resource)

    return True


async def _async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """
    Register family-hub-card.js as a Lovelace JavaScript module resource.

    Behaviour:
    - Only runs when Lovelace is in storage mode (the default UI mode).
    - Appends ?v=VERSION to force browser cache-busting on every update.
    - If the URL is already registered at the current version, it's a no-op.
    - If registered at an older version, it updates the URL in-place.
    - Retries every 5 s (up to 10 times) if resources haven't loaded yet.
    - All failures are non-fatal — logs a clear fallback instruction.
    """
    lovelace = hass.data.get("lovelace")
    if not lovelace:
        _LOGGER.debug("Family Hub: Lovelace not in hass.data, skipping resource registration")
        return

    if lovelace.mode != "storage":
        _LOGGER.info(
            "Family Hub: Lovelace is in '%s' mode — add the resource manually in "
            "Settings → Dashboards → Resources  URL: %s  Type: JavaScript module",
            lovelace.mode,
            f"{CARD_JS_URL}?v={VERSION}",
        )
        return

    async def _attempt(retries_left: int = 10) -> None:
        try:
            resources = lovelace.resources

            if not resources.loaded:
                if retries_left > 0:
                    _LOGGER.debug(
                        "Family Hub: Lovelace resources not ready, retry in 5s (%d left)",
                        retries_left,
                    )
                    async_call_later(
                        hass,
                        5,
                        lambda _now: hass.async_create_task(_attempt(retries_left - 1)),
                    )
                else:
                    _LOGGER.warning(
                        "Family Hub: Lovelace resources never became available. "
                        "Add the card manually — Settings → Dashboards → Resources  "
                        "URL: %s  Type: JavaScript module",
                        f"{CARD_JS_URL}?v={VERSION}",
                    )
                return

            versioned_url = f"{CARD_JS_URL}?v={VERSION}"

            # Find any existing registration for this card (match on base URL only,
            # ignoring the ?v= query string so we catch outdated versions too).
            existing = [
                r for r in resources.async_items()
                if r.get("url", "").split("?")[0] == CARD_JS_URL
            ]

            if existing:
                resource = existing[0]
                registered_url = resource.get("url", "")
                if registered_url == versioned_url:
                    _LOGGER.debug(
                        "Family Hub: Lovelace resource already current (v%s)", VERSION
                    )
                    return
                # Out of date — update in-place so the resource ID stays the same
                await resources.async_update_item(
                    resource["id"],
                    {"res_type": "module", "url": versioned_url},
                )
                _LOGGER.info(
                    "Family Hub: updated Lovelace resource → %s", versioned_url
                )
            else:
                # First install — create a new resource entry
                await resources.async_create_item(
                    {"res_type": "module", "url": versioned_url}
                )
                _LOGGER.info(
                    "Family Hub: registered Lovelace resource → %s  "
                    "(family-hub-card now available in the card picker)",
                    versioned_url,
                )

        except Exception as err:  # noqa: BLE001
            _LOGGER.warning(
                "Family Hub: Lovelace resource registration failed: %s  "
                "Add manually — Settings → Dashboards → Resources  "
                "URL: %s  Type: JavaScript module",
                err,
                f"{CARD_JS_URL}?v={VERSION}",
            )

    await _attempt()


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
        for service in [
            "complete_task", "claim_task", "approve_task", "deny_task",
            "add_one_time_task", "add_person", "update_person",
            "add_chore", "update_chore", "delete_chore",
            "request_redemption", "approve_redemption", "decline_redemption",
            "add_store_item", "update_store_item", "delete_store_item",
            "award_bonus_points", "deduct_points", "update_settings", "export_backup",
        ]:
            hass.services.async_remove(DOMAIN, service)

        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Entry removed — data file intentionally preserved."""
    _LOGGER.info(
        "Family Hub: entry removed. Data file kept at %s",
        entry.data.get("storage_path"),
    )

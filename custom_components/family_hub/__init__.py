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

The custom Lovelace card (www/family-hub-card.js) is served automatically
as a static path and registered as a Lovelace resource on startup.
Users add it to any dashboard as: type: custom:family-hub-card
"""

from __future__ import annotations

import logging
import os

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
)
from .coordinator import FamilyHubCoordinator
from .data_store import FamilyHubDataStore
from .services import async_setup_services

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.SENSOR]


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Family Hub integration (YAML config not used)."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Family Hub from a config entry (UI setup)."""
    hass.data.setdefault(DOMAIN, {})

    storage_path = entry.data["storage_path"]
    family_name = entry.data[CONF_FAMILY_NAME]
    points_per_dollar = entry.data[CONF_POINTS_PER_DOLLAR]
    initial_people = entry.data.get("initial_people", [])

    # --- Serve the Lovelace card JS as a static path ---
    # This makes the file available at /family_hub/family-hub-card.js
    # The path is registered once; HA deduplicates subsequent calls on reload.
    www_path = os.path.join(os.path.dirname(__file__), "www")
    hass.http.register_static_path(CARD_URL_PATH, www_path, cache_headers=False)
    _LOGGER.debug("Family Hub: registered static path %s → %s", CARD_URL_PATH, www_path)

    # --- Register the card as a Lovelace resource ---
    # This is what makes the card appear in the card picker and loads the JS
    # automatically in every Lovelace dashboard, including on restart.
    await _async_register_lovelace_resource(hass)

    # --- Init data store ---
    store = FamilyHubDataStore(hass, storage_path)
    await store.async_load()

    # Apply settings from config entry (may be first run)
    await store.async_update_settings(
        family_name=family_name,
        points_per_dollar=points_per_dollar,
    )

    # Add initial people on first run (if store is empty)
    if not store.people and initial_people:
        _LOGGER.info("Family Hub: adding %d initial people", len(initial_people))
        for person_data in initial_people:
            await store.async_add_person(
                name=person_data["name"],
                person_type=person_data["type"],
            )

    # --- Init coordinator ---
    coordinator = FamilyHubCoordinator(hass, store)
    await coordinator.async_config_entry_first_refresh()

    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
        "store": store,
    }

    # --- Register all services ---
    await async_setup_services(hass, coordinator)

    # --- Set up sensor platform ---
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # --- Clean up any stale entities from previous versions ---
    await _async_cleanup_stale_entities(hass, entry, store)

    _LOGGER.info(
        "Family Hub: ready — %s, %d people, %d active chores",
        family_name,
        len(store.people),
        len(store.get_active_chores()),
    )
    return True


async def _async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """
    Register family-hub-card.js as a Lovelace resource if not already registered.

    HA's Lovelace resource storage lives at lovelace_resources in the storage
    collection. We use the lovelace.resources service to add the resource so it
    appears in Settings → Dashboards → Resources and loads on every dashboard.

    This is idempotent — if the URL is already registered we skip it silently.
    """
    try:
        # Access the Lovelace resource collection directly via the storage helper.
        # This is the same mechanism used by the HA frontend and other integrations
        # that ship custom cards (e.g. HACS itself uses this pattern).
        from homeassistant.components.lovelace import resources as lovelace_resources  # noqa: PLC0415

        resource_collection = await lovelace_resources.async_get_resource_collection(hass)
        existing_urls = {r["url"] for r in resource_collection.async_items()}

        if CARD_JS_URL not in existing_urls:
            await resource_collection.async_create_item({
                "res_type": "module",
                "url": CARD_JS_URL,
            })
            _LOGGER.info(
                "Family Hub: registered Lovelace resource %s — "
                "the family-hub-card is now available in the card picker",
                CARD_JS_URL,
            )
        else:
            _LOGGER.debug("Family Hub: Lovelace resource %s already registered", CARD_JS_URL)

    except Exception as err:  # noqa: BLE001
        # Non-fatal — the card will still work if users manually add the resource,
        # or if Lovelace is in YAML mode. Log clearly so it's easy to diagnose.
        _LOGGER.warning(
            "Family Hub: could not auto-register Lovelace resource (%s). "
            "If the card is missing from the picker, add it manually in "
            "Settings → Dashboards → Resources with URL: %s (type: JavaScript module)",
            err,
            CARD_JS_URL,
        )


async def _async_cleanup_stale_entities(
    hass: HomeAssistant,
    entry: ConfigEntry,
    store: FamilyHubDataStore,
) -> None:
    """Remove entities that belong to this entry but are no longer created."""

    # Build the complete set of unique IDs this version of the integration creates
    expected_unique_ids: set[str] = set()

    # Per-person sensors
    for person in store.people:
        expected_unique_ids.add(f"{DOMAIN}_person_{person['id']}")

    # Global sensors
    expected_unique_ids.update({
        f"{DOMAIN}_maintenance_due",
        f"{DOMAIN}_maintenance_overdue",
        f"{DOMAIN}_needs_attention",
        f"{DOMAIN}_claimable_tasks",
    })

    registry = er.async_get(hass)
    stale = [
        entity
        for entity in er.async_entries_for_config_entry(registry, entry.entry_id)
        if entity.unique_id not in expected_unique_ids
    ]

    if stale:
        _LOGGER.info(
            "Family Hub: removing %d stale entities from previous version: %s",
            len(stale),
            [e.entity_id for e in stale],
        )
        for entity in stale:
            registry.async_remove(entity.entity_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        # Unregister services
        for service in [
            "complete_task", "claim_task", "approve_task", "deny_task",
            "add_one_time_task", "add_person", "update_person",
            "add_chore", "update_chore", "delete_chore",
            "request_redemption", "approve_redemption", "decline_redemption",
            "add_store_item", "update_store_item", "delete_store_item",
            "award_bonus_points", "export_backup",
        ]:
            hass.services.async_remove(DOMAIN, service)

        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Called when the entry is removed — data file is intentionally kept."""
    _LOGGER.info(
        "Family Hub: entry removed. Data file kept at %s",
        entry.data.get("storage_path"),
    )

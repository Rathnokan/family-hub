"""
Family Hub — Home Assistant integration.

A private, self-hosted family task management system:
  • Chores for kids (assigned + claimable, daily/weekly/custom recurrence)
  • Points, rewards store, and redemption approval flow
  • Home maintenance tracking
  • One-time tasks for anyone
  • Four dashboards: command center, personal, home maintenance, admin

All data lives in a single JSON file — no cloud, no third-party accounts.
"""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import CONF_FAMILY_NAME, CONF_POINTS_PER_DOLLAR, DOMAIN
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

    # Init data store
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

    # Init coordinator
    coordinator = FamilyHubCoordinator(hass, store)
    await coordinator.async_config_entry_first_refresh()

    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
        "store": store,
    }

    # Register all services
    await async_setup_services(hass, coordinator)

    # Set up sensor platform
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    _LOGGER.info(
        "Family Hub: ready — %s, %d people, %d active chores",
        family_name,
        len(store.people),
        len(store.get_active_chores()),
    )
    return True


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
    """Called when the entry is removed — optionally clean up the data file."""
    _LOGGER.info("Family Hub: entry removed. Data file kept at %s", entry.data.get("storage_path"))

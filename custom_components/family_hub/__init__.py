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
  - The card JS is registered as a persistent Lovelace resource (same storage
    layer that HACS uses). The URL includes the JS file's mtime as a cache-bust
    token, so it updates automatically on every Samba deploy without requiring
    a manual version bump or an HA restart. Registration runs in async_setup_entry
    so it fires at both HA startup and on every integration reload.
  - manifest.json declares "frontend" and "http" as dependencies.

v0.4.1 changes:
  - Dynamic sensor registration: add_person now creates a sensor entity
    immediately without requiring a restart. remove_person deactivates
    the entity immediately.
  - The async_add_person_sensor / async_remove_person_sensor helpers are
    stored on hass.data so the services module can call them.
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_time_change

from .const import (
    CARD_JS_FILENAME,
    CARD_JS_URL,
    CARD_URL_PATH,
    CONF_FAMILY_NAME,
    CONF_POINTS_PER_DOLLAR,
    DOMAIN,
)
from .coordinator import FamilyHubCoordinator
from .data_store import FamilyHubDataStore
from .services import async_setup_services
from .websocket import async_register_websocket_api

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.SENSOR]

# Absolute path to this integration's www/ folder
_WWW_PATH = Path(__file__).parent / "www"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """
    Called once when the integration is loaded (before any config entries).

    Registers the static HTTP path so the card JS is served.
    Lovelace resource registration happens in async_setup_entry so it also
    fires on every integration reload, keeping the URL in sync with the
    deployed JS file.
    """
    hass.data.setdefault(DOMAIN, {})

    # --- Websocket API (v0.7.0 P2) ---
    # Registers family_hub/get_model so the card can pull its data model on
    # demand instead of via fat sensor attributes. Registered once per process.
    async_register_websocket_api(hass)

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

    return True


async def _async_register_card_resource(hass: HomeAssistant) -> None:
    """Register or update the Family Hub card JS as a persistent Lovelace resource.

    Uses the JS file's mtime as the cache-bust token so the URL changes
    automatically on every Samba deploy — no manual version bump or HA restart
    required. Falls back to add_extra_js_url if Lovelace storage is unavailable.
    """
    # Cache-bust token = JS file mtime. Changes whenever the file is redeployed.
    try:
        stat = await hass.async_add_executor_job((_WWW_PATH / CARD_JS_FILENAME).stat)
        cache_bust = str(int(stat.st_mtime))
    except OSError as err:
        import time
        _LOGGER.warning("Family Hub: could not stat JS file (%s), using timestamp", err)
        cache_bust = str(int(time.time()))

    versioned_url = f"{CARD_JS_URL}?v={cache_bust}"

    try:
        lovelace = hass.data.get("lovelace")
        if lovelace is None or not hasattr(lovelace, "resources") or lovelace.resources is None:
            raise RuntimeError("Lovelace resource storage not available")

        resources = lovelace.resources
        await resources.async_load()

        existing = next(
            (r for r in resources.async_items()
             if r.get("url", "").split("?")[0] == CARD_JS_URL),
            None,
        )

        if existing is None:
            await resources.async_create_item({"res_type": "module", "url": versioned_url})
            _LOGGER.info("Family Hub: Lovelace resource created — %s", versioned_url)
        elif existing.get("url") != versioned_url:
            await resources.async_update_item(
                existing["id"], {"res_type": "module", "url": versioned_url}
            )
            _LOGGER.info(
                "Family Hub: Lovelace resource updated (%s → %s)",
                existing.get("url"), versioned_url,
            )
        else:
            _LOGGER.debug("Family Hub: Lovelace resource already current (%s)", versioned_url)

        return

    except Exception as err:  # noqa: BLE001
        _LOGGER.warning(
            "Family Hub: Lovelace resource registration failed (%s) — "
            "falling back to add_extra_js_url (HA restart required after JS changes)",
            err,
        )

    from homeassistant.components.frontend import add_extra_js_url
    add_extra_js_url(hass, versioned_url)
    _LOGGER.info("Family Hub: card JS registered via add_extra_js_url — %s", versioned_url)


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

    # --- Event-driven scheduling (v0.7.0: replaces the old 30 s coordinator poll) ---
    # The first_refresh above already ran one catch-up tick. From here on:
    #   • daily tick fires once at local midnight (00:00:10), and
    #   • a light per-minute heartbeat dispatches due reminders / penalty nudges.
    # Both unsubscribe automatically on unload/reload via entry.async_on_unload.
    entry.async_on_unload(
        async_track_time_change(
            hass, coordinator.async_daily_rollover, hour=0, minute=0, second=10
        )
    )
    entry.async_on_unload(
        async_track_time_change(
            hass, coordinator.async_notification_heartbeat, second=0
        )
    )

    # --- Dynamic sensor management ------------------------------------------
    # async_add_entities is only available inside async_setup_entry via the
    # platform forward. We capture it by setting up a callback that the
    # services module can call whenever a person is added or removed.
    #
    # The pattern: store a mutable dict keyed by person_id → entity instance,
    # plus the async_add_entities callable. Services call the helpers below
    # rather than touching HA internals directly.

    # Will be populated once the sensor platform sets up (see sensor.py)
    person_entities: dict = {}  # person_id → FamilyHubPersonSensor instance

    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator":      coordinator,
        "store":            store,
        "person_entities":  person_entities,
        # These two callables are set by async_setup_entry in sensor.py after
        # the platform forward completes. They are None until then.
        "add_person_sensor":    None,
        "remove_person_sensor": None,
    }

    # --- Services ---
    # Services are set up before the sensor platform so that the callables
    # exist in hass.data before any service handler could fire.
    await async_setup_services(hass, coordinator)

    # --- Sensors ---
    # The platform forward populates person_entities and stores the
    # add_person_sensor / remove_person_sensor callables.
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # --- Stale entity cleanup ---
    await _async_cleanup_stale_entities(hass, entry, store)

    # --- Card resource registration ---
    # Runs at startup and on every integration reload so the Lovelace resource
    # URL stays in sync with the deployed JS file without requiring an HA restart.
    await _async_register_card_resource(hass)

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
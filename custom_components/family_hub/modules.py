"""
Family Hub — module registry (v0.8.0 module framework).

A declarative table of gateable modules. Each module can be enabled or disabled
from the integration's Options flow (Settings → Devices & Services → Family Hub →
Configure); the entry reloads on change, so "disabled = never registered".

Gating happens at exactly four exposure surfaces, each of which consults this
table against ``store.enabled_modules``:
  1. services   — per-module ``register_services`` called only when enabled
  2. sensors    — module sensors created only when enabled (sensor.py)
  3. card model — module ``model_keys`` omitted from build_card_model when off
  4. tick       — module ``tick_hook`` invoked only when enabled (tick_mixin)

The mixins on FamilyHubDataStore stay composed unconditionally — a disabled
module's data still loads, migrates, and saves; it is simply never *exposed*.
Data is sacred; a toggle never mutates or drops it.

Core (people, points balances, settings, history, allowance, the tick engine,
websocket) is NOT a module and is never listed here — it is always on.

`register_services` uses lazy inner imports on purpose: it keeps this module free
of heavy top-level imports so it can be imported very early (data_store, card_model,
services) without any risk of an import cycle.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable

from .const import DOMAIN


@dataclass(frozen=True)
class ModuleDef:
    """Descriptor for one gateable Family Hub module."""

    id: str
    title: str
    # True = feature-flagged / not fully gated end-to-end yet (shown in the
    # options label). Chores/Rewards are experimental until session A6 wires
    # their services/sensors/card degradation.
    experimental: bool = False
    # (hass, coordinator) -> None. None means the module has no services yet
    # (or its services still live in the core registrar).
    register_services: Callable | None = None
    # Sensor unique_id suffixes owned by this module (gated creation + stale
    # cleanup). Full unique_id, i.e. already prefixed with the domain.
    sensor_unique_ids: tuple[str, ...] = ()
    # build_card_model entity_id keys contributed by this module.
    model_keys: tuple[str, ...] = ()
    # Name of a FamilyHubDataStore coroutine run once per daily tick, or None.
    tick_hook: str | None = None
    # Card room ids gated by this module (tile shows "MODULE OFF" when disabled).
    room_ids: tuple[str, ...] = ()


# --- Lazy service registrars (avoid import cycles) --------------------------

def _register_meals(hass, coordinator) -> None:
    from .services_meals import register_meals_services
    register_meals_services(hass, coordinator)


# --- The registry -----------------------------------------------------------
# NOTE: as later sessions land, fill in register_services / sensor_unique_ids /
# model_keys / tick_hook for each module (A4 maintenance backend, A6 chores &
# rewards). In A2 only meals + maintenance own gated sensors/model keys.

MODULES: dict[str, ModuleDef] = {
    "chores": ModuleDef(
        id="chores",
        title="Chores",
        experimental=True,          # fully gated in A6
        room_ids=("chores",),
    ),
    "rewards": ModuleDef(
        id="rewards",
        title="Rewards",
        experimental=True,          # fully gated in A6
        room_ids=(),                # rewards surfaces live on personal pages, no tile
    ),
    "meals": ModuleDef(
        id="meals",
        title="Meals",
        register_services=_register_meals,
        sensor_unique_ids=(f"{DOMAIN}_meals",),
        model_keys=("sensor.family_hub_meals",),
        room_ids=("meals",),
    ),
    "maintenance": ModuleDef(
        id="maintenance",
        title="Home Maintenance",
        register_services=None,     # backend lands in A4
        sensor_unique_ids=(f"{DOMAIN}_maintenance_due", f"{DOMAIN}_maintenance_overdue"),
        model_keys=(
            "sensor.family_hub_maintenance_due",
            "sensor.family_hub_maintenance_overdue",
        ),
        room_ids=("maintenance",),
    ),
    "smarthome": ModuleDef(
        id="smarthome",
        title="Smart Home",
        room_ids=("smarthome",),
    ),
    "calendar": ModuleDef(
        id="calendar",
        title="Calendar",
        room_ids=("calendar",),
    ),
}

# Stable ordered tuple of module ids — cheap to import anywhere (no registrar refs).
MODULE_IDS: tuple[str, ...] = tuple(MODULES.keys())


def enabled_modules(entry) -> frozenset[str]:
    """The set of enabled module ids for a config entry.

    Flags live under ``entry.options["modules"]`` as ``{module_id: bool}``.
    Any module absent from the options (fresh installs, newly added modules)
    defaults to enabled, so upgrades never silently turn a module off.
    """
    opts = (entry.options or {}).get("modules", {})
    return frozenset(mid for mid in MODULE_IDS if opts.get(mid, True))

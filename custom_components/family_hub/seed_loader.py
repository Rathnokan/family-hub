"""
Family Hub — maintenance seed library loader (v0.8.0).

Loads the shipped seed task library (seed_library.json) and filters it against
the editable Home Profile. This is the INTERFACE; the library ships EMPTY (`[]`)
and is populated by the Phase B research deliverable (seed-schema.json shape).
Because the Home Profile is editable settings (never one-time setup), re-applying
the library is idempotent: newly-applicable seeds enable, newly-inapplicable seed
tasks disable but keep their history (see MaintenanceMixin.async_maintenance_apply_seeds).
"""

from __future__ import annotations

import json
import logging
import os

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

_SEED_FILE = os.path.join(os.path.dirname(__file__), "seed_library.json")


async def async_load_seed_library(hass: HomeAssistant) -> list[dict]:
    """Read seed_library.json off the event loop. Returns [] on any error."""
    def _read() -> list[dict]:
        try:
            with open(_SEED_FILE, encoding="utf-8") as f:
                data = json.load(f)
            return data if isinstance(data, list) else []
        except (OSError, json.JSONDecodeError) as err:
            _LOGGER.warning("Family Hub: could not read seed_library.json: %s", err)
            return []

    return await hass.async_add_executor_job(_read)


def applicable_seeds(library: list[dict], home_profile: dict | None) -> list[dict]:
    """Seeds whose `requires` predicate matches the Home Profile."""
    profile = home_profile or {}
    return [s for s in library if _seed_applies(s, profile)]


def _seed_applies(seed: dict, profile: dict) -> bool:
    """A seed's optional `requires` dict gates applicability. Supported forms:
      {"has_pool": true}            → profile["has_pool"] must equal true
      {"climate_preset_in": [...]}  → profile["climate_preset"] must be in the list
    A seed with no `requires` always applies (universal task)."""
    requires = seed.get("requires") or {}
    for key, want in requires.items():
        if key == "climate_preset_in":
            if profile.get("climate_preset") not in (want or []):
                return False
        elif profile.get(key) != want:
            return False
    return True


def seed_to_task_fields(seed: dict) -> dict:
    """Map a seed_library record (seed-schema.json shape) to maintenance task
    fields consumed by MaintenanceMixin._new_maintenance_task."""
    return {
        "name":                seed.get("name", ""),
        "description":         seed.get("description_howto", ""),
        "category":            seed.get("category", ""),
        "location":            seed.get("location", ""),
        "schedule_mode":       seed.get("schedule_mode", "from_completion"),
        "recurrence":          seed.get("recurrence"),
        "seasonal_anchor":     _anchor_from_seed(seed),
        "workflow":            seed.get("workflow", "simple"),
        "lead_time_days":      seed.get("lead_time_days", 14),
        "effort":              seed.get("effort") or {"diy_minutes": 0, "difficulty": "Easy"},
        "est_cost_diy":        seed.get("est_cost_diy", 0),
        "est_cost_pro":        seed.get("est_cost_pro", 0),
        "default_mode":        seed.get("default_mode", "diy"),
        "assignable":          bool(seed.get("assignable", False)),
        "default_point_value": int(seed.get("default_point_value", 0) or 0),
    }


def _anchor_from_seed(seed: dict):
    """A seed's seasonal_anchor as a {"month","day"} dict, or None.

    The seed schema allows a string window (e.g. "October (post-monsoon)"); parsing
    those into a concrete month/day lands with the real seed data (Phase B/D). A
    dict anchor is passed through as-is."""
    anchor = seed.get("seasonal_anchor")
    if isinstance(anchor, dict):
        return anchor
    return None

"""
Family Hub — maintenance seed library loader (v0.8.0 D1).

Reads the shipped seed library (`seed_library.json`, Phase B v3.0.0 — 97 tasks +
15 big-ticket assets) and filters it against the editable Home Profile.

Everything here is a PURE function except `async_load_seed_library`, so the
gating/parsing logic is testable without Home Assistant (the HA import is deferred
under TYPE_CHECKING for exactly that reason).

Gating is two-stage:
  1. `applicability` — a tag list per task. Empty = universal. Every tag maps to a
     Home Profile predicate in `_TAG_PREDICATES`; a task applies iff EVERY tag is
     satisfied. An unknown tag fails CLOSED (the tag exists to prevent an
     irrelevant task; seeding one we cannot gate defeats the point).
  2. `climate_tags` — a task applies only if tagged "universal" or carrying the
     profile's own climate preset. The four desert_southwest-only tasks (the
     evaporative-cooler set) are hidden entirely under any other preset.

Because the Home Profile is editable settings (never one-time setup), re-applying
the library is idempotent: newly-applicable seeds enable, newly-inapplicable seed
tasks disable but keep their history (see MaintenanceMixin.async_maintenance_apply_seeds).
"""

from __future__ import annotations

import json
import logging
import os
import re
from typing import TYPE_CHECKING, Any, Callable

if TYPE_CHECKING:  # pragma: no cover - HA is absent in the offline harness
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

_SEED_FILE = os.path.join(os.path.dirname(__file__), "seed_library.json")

DEFAULT_CLIMATE_PRESET = "desert_southwest"


# ---------------------------------------------------------------------------
# Library IO
# ---------------------------------------------------------------------------

async def async_load_seed_library(hass: "HomeAssistant") -> dict:
    """Read seed_library.json off the event loop.

    Returns the library OBJECT ({schema_version, tasks[], big_ticket_assets[],
    climate_preset, pricing_basis, cost_status_legend}) or {} on any error. A bare
    list (the pre-Phase-B stub shape) is wrapped as {"tasks": [...]}.
    """
    def _read() -> dict:
        try:
            with open(_SEED_FILE, encoding="utf-8") as f:
                data = json.load(f)
        except (OSError, json.JSONDecodeError) as err:
            _LOGGER.warning("Family Hub: could not read seed_library.json: %s", err)
            return {}
        if isinstance(data, list):          # legacy bare-array shape
            return {"tasks": data}
        if not isinstance(data, dict):
            _LOGGER.warning("Family Hub: seed_library.json has an unexpected shape")
            return {}
        return data

    return await hass.async_add_executor_job(_read)


def library_tasks(library: dict | None) -> list[dict]:
    tasks = (library or {}).get("tasks")
    return tasks if isinstance(tasks, list) else []


def library_assets(library: dict | None) -> list[dict]:
    assets = (library or {}).get("big_ticket_assets")
    return assets if isinstance(assets, list) else []


# ---------------------------------------------------------------------------
# Home Profile
# ---------------------------------------------------------------------------

# Presence toggles — one per seed-schema v2 presence tag. Default False: a blank
# profile seeds only the universal tasks, so nothing you do not own ever appears.
PRESENCE_FIELDS = (
    "pool", "softener", "ro", "fireplace", "gutters", "septic", "carpet",
    "sump_pump", "irrigation", "lawn", "wood_deck", "wood_fence",
    "stone_counters", "tile_surfaces", "humidifier", "mini_split",
    "generator", "evap_cooler", "hoa",
)

# Single-select variant answers (seed-schema v2 "exclusive" tag groups).
VARIANT_FIELDS: dict[str, tuple] = {
    "water_heater_type": (None, "tank", "tankless"),
    "water_source":      ("municipal", "well"),
    "roof_type":         (None, "tile", "shingle"),
    "heating_type":      (None, "gas_furnace", "heat_pump", "electric"),
    "dryer_fuel":        (None, "gas", "electric"),
    "fireplace_fuel":    (None, "wood", "gas"),
    "water_heater_fuel": (None, "gas", "electric"),
}

# Non-gating profile fields (cost/UI; Phase E reads these).
_OTHER_DEFAULTS: dict[str, Any] = {
    "climate_preset":    DEFAULT_CLIMATE_PRESET,
    "year_built":        None,
    "sq_ft":             None,
    "stories":           1,
    "home_value":        None,
    "inflation_rate":    4.0,
    "hvac_filter_size":  "",
    "hvac_filter_count": 0,
    "gas_range":         False,
    "gas_service":       None,   # None = derive from the fuel answers
}


def profile_defaults() -> dict:
    """A blank Home Profile: every presence toggle off, every variant unanswered."""
    profile: dict[str, Any] = {f: False for f in PRESENCE_FIELDS}
    for field, values in VARIANT_FIELDS.items():
        profile[field] = values[0]
    profile.update(_OTHER_DEFAULTS)
    return profile


def normalize_profile(profile: dict | None) -> dict:
    """The profile with every missing key filled from the defaults. Never
    overwrites an answer that is present (including an explicit False/None)."""
    merged = profile_defaults()
    for key, value in (profile or {}).items():
        merged[key] = value
    return merged


def _has_gas_service(p: dict) -> bool:
    """`gas_service` is derived unless explicitly answered: any gas appliance or
    gas heat means the home has gas/propane service to something."""
    explicit = p.get("gas_service")
    if isinstance(explicit, bool):
        return explicit
    return bool(
        p.get("heating_type") == "gas_furnace"
        or p.get("dryer_fuel") == "gas"
        or p.get("fireplace_fuel") == "gas"
        or p.get("water_heater_fuel") == "gas"
        or p.get("gas_range")
    )


def _presence(field: str) -> Callable[[dict], bool]:
    return lambda p: bool(p.get(field))


def _equals(field: str, value: str) -> Callable[[dict], bool]:
    return lambda p: p.get(field) == value


# Every applicability tag in the seed-schema v2 vocabulary → a profile predicate.
_TAG_PREDICATES: dict[str, Callable[[dict], bool]] = {
    # presence tags
    **{f: _presence(f) for f in PRESENCE_FIELDS},
    "two_story":              lambda p: int(p.get("stories") or 1) > 1,
    "gas_service":            _has_gas_service,
    "well_water":             _equals("water_source", "well"),
    # variant tags (exclusive groups)
    "tank_water_heater":      _equals("water_heater_type", "tank"),
    "tankless_water_heater":  _equals("water_heater_type", "tankless"),
    "tile_roof":              _equals("roof_type", "tile"),
    "shingle_roof":           _equals("roof_type", "shingle"),
    "gas_heat":               _equals("heating_type", "gas_furnace"),
    "heat_pump":              _equals("heating_type", "heat_pump"),
    "electric_heat":          _equals("heating_type", "electric"),
    "gas_dryer":              _equals("dryer_fuel", "gas"),
    "electric_dryer":         _equals("dryer_fuel", "electric"),
}

# Human phrasing for the `disabled_reason` line the room renders (C2 section 5.1).
_TAG_REASONS = {
    "pool":                  "no pool at this home",
    "softener":              "no water softener at this home",
    "ro":                    "no RO system at this home",
    "fireplace":             "no fireplace at this home",
    "gutters":               "no gutters at this home",
    "septic":                "not on septic",
    "carpet":                "no carpet at this home",
    "sump_pump":             "no sump pump at this home",
    "irrigation":            "no irrigation system at this home",
    "lawn":                  "no lawn at this home",
    "wood_deck":             "no wood deck at this home",
    "wood_fence":            "no wood fence at this home",
    "stone_counters":        "no natural-stone counters at this home",
    "tile_surfaces":         "no tiled surfaces at this home",
    "humidifier":            "no whole-house humidifier at this home",
    "mini_split":            "no mini-split units at this home",
    "generator":             "no generator at this home",
    "evap_cooler":           "no evaporative cooler at this home",
    "hoa":                   "no HOA at this home",
    "two_story":             "single-story home",
    "gas_service":           "no gas service at this home",
    "well_water":            "not on well water",
    "tank_water_heater":     "water heater is not a tank type",
    "tankless_water_heater": "water heater is not tankless",
    "tile_roof":             "roof is not tile",
    "shingle_roof":          "roof is not shingle",
    "gas_heat":              "not heated by a gas furnace",
    "heat_pump":             "no heat pump at this home",
    "electric_heat":         "not electrically heated",
    "gas_dryer":             "dryer is not gas",
    "electric_dryer":        "dryer is not electric",
}

_CLIMATE_REASON = "not applicable in this climate"

# One-shot log guards. Both conditions are properties of the shipped LIBRARY, not
# of any single run, so warning on every re-apply is pure noise (a Home Profile
# edit re-applies the whole library).
_warned_tags: set[str] = set()
_warned_anchors: set[str] = set()


def _tag_satisfied(tag: str, profile: dict) -> bool:
    predicate = _TAG_PREDICATES.get(tag)
    if predicate is None:
        if tag not in _warned_tags:
            _warned_tags.add(tag)
            _LOGGER.warning(
                "Family Hub: seed library uses unknown applicability tag '%s' — "
                "tasks carrying it will not be seeded", tag,
            )
        return False   # fail closed
    return predicate(profile)


def _climate_ok(seed: dict, profile: dict) -> bool:
    tags = seed.get("climate_tags") or ["universal"]
    return "universal" in tags or profile.get("climate_preset") in tags


def seed_applies(seed: dict, profile: dict) -> bool:
    """True when every applicability tag is satisfied AND the climate gate passes."""
    if not _climate_ok(seed, profile):
        return False
    return all(_tag_satisfied(tag, profile) for tag in (seed.get("applicability") or []))


def applicable_seeds(tasks: list[dict], home_profile: dict | None) -> list[dict]:
    """Seed tasks that apply to this Home Profile."""
    profile = normalize_profile(home_profile)
    return [s for s in tasks if seed_applies(s, profile)]


def disable_reason(seed: dict, home_profile: dict | None) -> str:
    """Why this seed does not apply — the reason line shown on a disabled task."""
    profile = normalize_profile(home_profile)
    if not _climate_ok(seed, profile):
        return _CLIMATE_REASON
    for tag in (seed.get("applicability") or []):
        if not _tag_satisfied(tag, profile):
            return _TAG_REASONS.get(tag, f"not applicable ({tag})")
    return "no longer applies to this home"


# ---------------------------------------------------------------------------
# Big-ticket assets (reference data for the E2 sinking funds)
# ---------------------------------------------------------------------------

# The 15 assets carry no `applicability` field — only prose notes — so the
# profile gate lives here. Anything absent from this map is universal.
_ASSET_PREDICATES: dict[str, Callable[[dict], bool]] = {
    "wh_tank":                _equals("water_heater_type", "tank"),
    "wh_tankless":            _equals("water_heater_type", "tankless"),
    "expansion_tank":         _equals("water_heater_type", "tank"),
    "hvac_heatpump":          _equals("heating_type", "heat_pump"),
    "hvac_ac_furnace":        _equals("heating_type", "gas_furnace"),
    "roof_tile_underlayment": _equals("roof_type", "tile"),
    "carpet_whole_home":      _presence("carpet"),
    "water_softener":         _presence("softener"),
    "ro_system":              _presence("ro"),
    "sump_pump":              _presence("sump_pump"),
}

# The library's own double-count guard: this asset's cost is also priced on the
# garage_spring_service task, so fund accrual is off by default.
_ASSET_ACCRUAL_OFF = {"garage_door_springs"}


def applicable_assets(assets: list[dict], home_profile: dict | None) -> list[dict]:
    """Big-ticket assets this home actually has, each stamped with the accrual
    default. Costs are carried verbatim; future-cost math is Phase E2."""
    profile = normalize_profile(home_profile)
    out = []
    for asset in assets:
        predicate = _ASSET_PREDICATES.get(asset.get("asset_id", ""))
        if predicate and not predicate(profile):
            continue
        out.append({
            **asset,
            "accrual_default": asset.get("asset_id") not in _ASSET_ACCRUAL_OFF,
        })
    return out


# ---------------------------------------------------------------------------
# seasonal_anchor: prose -> [{month, day}, ...]
# ---------------------------------------------------------------------------

# Hardcoded, not calendar.month_name — that is locale-aware and would stop
# matching an English library on a non-English HA host.
_MONTHS = {
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10, "november": 11,
    "december": 12,
}

# Seasons land on the equinox/solstice rather than the 1st, so a season-derived
# anchor is never mistaken for "the library named a month" (which IS day 1).
_SEASONS = {
    "spring": (3, 20), "summer": (6, 21), "fall": (9, 22),
    "autumn": (9, 22), "winter": (12, 21),
}
_MODIFIED_SEASONS = {
    "early spring": (3, 1),  "late spring": (5, 15),
    "early summer": (6, 1),  "late summer": (8, 15),
    "early fall":   (9, 1),  "late fall":   (11, 1),
    "early winter": (12, 1), "late winter": (2, 15),
}

_PAREN = re.compile(r"\([^)]*\)")
_SPLIT = re.compile(r"[;&/]|\band\b")
_RANGE = re.compile(r"([a-z]+)\s*[-–]\s*([a-z]+)")


def _parse_anchor_part(part: str) -> tuple[int, int] | None:
    """One clause -> (month, day). A month RANGE anchors to the FIRST month: the
    work belongs at the start of the window (a pre-cooling tune-up in March, not
    April). Modified seasons are checked before bare ones so 'late winter' wins."""
    match = _RANGE.search(part)
    if match and match.group(1) in _MONTHS and match.group(2) in _MONTHS:
        return (_MONTHS[match.group(1)], 1)
    for name, month in _MONTHS.items():
        if re.search(r"\b" + name + r"\b", part):
            return (month, 1)
    for phrase, md in _MODIFIED_SEASONS.items():
        if phrase in part:
            return md
    for season, md in _SEASONS.items():
        if re.search(r"\b" + season + r"\b", part):
            return md
    return None


def parse_seasonal_anchor(raw: Any) -> list[dict] | None:
    """A seed's human-readable `seasonal_anchor` as a list of {month, day}.

    Handles the multi-occurrence forms the library actually uses — "April &
    October" (2x/yr), "January / April / July / October" (quarterly) — plus month
    ranges ("March-April (pre-cooling)"), single months, and seasons. Parenthetical
    prose is stripped. A dict/list anchor passes through (already parsed). Returns
    None when nothing parses; the caller logs the reduction.
    """
    if isinstance(raw, dict):
        return [raw]
    if isinstance(raw, list):
        return [a for a in raw if isinstance(a, dict)] or None
    if not isinstance(raw, str) or not raw.strip():
        return None

    text = _PAREN.sub(" ", raw).lower()
    found: list[tuple[int, int]] = []
    dropped: list[str] = []
    for part in _SPLIT.split(text):
        part = part.strip()
        if not part:
            continue
        md = _parse_anchor_part(part)
        if md is None:
            dropped.append(part)
        elif md not in found:
            found.append(md)

    if dropped and found:
        _LOGGER.debug(
            "Family Hub: seasonal anchor %r — ignored advisory clause(s) %s",
            raw, dropped,
        )
    if not found:
        return None
    found.sort()
    return [{"month": m, "day": d} for m, d in found]


# ---------------------------------------------------------------------------
# Climate overrides
# ---------------------------------------------------------------------------

def resolve_climate_overrides(seed: dict, home_profile: dict | None) -> dict:
    """The seed with its climate_overrides block for THIS profile's preset merged
    in. Only `recurrence` and `seasonal_anchor` are overridden; `note` is carried
    out separately as `climate_note`. Universal values stay intact underneath for
    any non-desert deployment."""
    preset = normalize_profile(home_profile).get("climate_preset")
    override = (seed.get("climate_overrides") or {}).get(preset) or {}
    if not override:
        return seed
    merged = dict(seed)
    for key in ("recurrence", "seasonal_anchor"):
        if override.get(key) is not None:
            merged[key] = override[key]
    if override.get("note"):
        merged["climate_note"] = override["note"]
    return merged


# ---------------------------------------------------------------------------
# seed record -> maintenance task fields
# ---------------------------------------------------------------------------

def seed_to_task_fields(seed: dict, home_profile: dict | None = None) -> dict:
    """Map a seed_library record to the maintenance task fields consumed by
    MaintenanceMixin._new_maintenance_task, with climate overrides resolved and
    the prose anchor parsed."""
    resolved = resolve_climate_overrides(seed, home_profile)

    raw_anchor = resolved.get("seasonal_anchor")
    anchor = parse_seasonal_anchor(raw_anchor)
    schedule_mode = resolved.get("schedule_mode", "from_completion")

    # A calendar_anchored task with no parseable anchor would otherwise fall into
    # the monthly-anchor branch and land on the 1st of an arbitrary month. Be
    # honest instead: float it from completion and say so.
    if schedule_mode == "calendar_anchored" and not anchor:
        task_id = resolved.get("task_id") or ""
        if task_id not in _warned_anchors:
            _warned_anchors.add(task_id)
            _LOGGER.warning(
                "Family Hub: seed '%s' is calendar_anchored but its anchor %r does "
                "not parse — scheduling it from completion instead",
                task_id, raw_anchor,
            )
        schedule_mode = "from_completion"

    return {
        "name":                resolved.get("name", ""),
        "description":         resolved.get("description_howto", ""),
        "category":            resolved.get("category", ""),
        "location":            resolved.get("location", ""),
        "schedule_mode":       schedule_mode,
        "recurrence":          resolved.get("recurrence"),
        "seasonal_anchor":     anchor,
        "seasonal_note":       raw_anchor if isinstance(raw_anchor, str) else "",
        "climate_note":        resolved.get("climate_note", ""),
        "workflow":            resolved.get("workflow", "simple"),
        "lead_time_days":      resolved.get("lead_time_days", 14),
        "effort":              resolved.get("effort") or {"diy_minutes": 0, "difficulty": "Easy"},
        "est_cost_diy":        resolved.get("est_cost_diy", 0),
        # None means "never hired out standalone" (40 tasks) — must NOT become 0.
        "est_cost_pro":        resolved.get("est_cost_pro"),
        "default_mode":        resolved.get("default_mode", "diy"),
        "assignable":          bool(resolved.get("assignable", False)),
        "default_point_value": int(resolved.get("default_point_value", 0) or 0),
        "surprise_factor":     resolved.get("surprise_factor", "low"),
        "cost_status":         resolved.get("cost_status", ""),
    }


def seed_fingerprint(fields: dict) -> str:
    """Stable signature of the schedule-shaping fields as the seed resolved them.
    On re-apply, a task still matching its fingerprint was never hand-edited, so
    it is safe to refresh from the library."""
    return json.dumps(
        {
            "schedule_mode":   fields.get("schedule_mode"),
            "recurrence":      fields.get("recurrence"),
            "seasonal_anchor": fields.get("seasonal_anchor"),
        },
        sort_keys=True, separators=(",", ":"),
    )


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------

# Ids whose title-cased form reads badly.
_PRODUCT_NAME_FIXES = {
    "hvac_filter":        "HVAC filter",
    "ro_membrane":        "RO membrane",
    "ro_sediment_filter": "RO sediment filter",
    "ro_carbon_filter":   "RO carbon filter",
    "co_alarm":           "CO alarm",
    "prv":                "Pressure-reducing valve",
}


def product_display_name(product_id: str) -> str:
    if product_id in _PRODUCT_NAME_FIXES:
        return _PRODUCT_NAME_FIXES[product_id]
    return product_id.replace("_", " ").strip().capitalize()


def products_for_seeds(seeds: list[dict]) -> dict[str, list[str]]:
    """{product_id: [seed task_id, ...]} across the given seeds, in first-seen
    order. Seeded product records are created untracked (low_stock_threshold 0)
    so a zero count never reads as OUT and never fires the blocked banner."""
    index: dict[str, list[str]] = {}
    for seed in seeds:
        for pid in (seed.get("products") or []):
            index.setdefault(pid, []).append(seed.get("task_id", ""))
    return index

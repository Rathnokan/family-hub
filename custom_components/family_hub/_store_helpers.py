"""Family Hub - module-level data helpers (extracted from data_store.py, v0.7.0 P4).

Pure functions: id/timestamp generation, the empty-store template, and the
per-record migration helpers. Shared by data_store.py and its data-store mixins.
"""
from __future__ import annotations

import asyncio
import calendar
import json
import logging
import math
import os
import shutil
import uuid
from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    ACTIVE_STATUSES,
    CATEGORY_ASSIGNED,
    CATEGORY_CLAIMABLE,
    CATEGORY_MAINTENANCE,
    CATEGORY_ONE_TIME,
    CATEGORY_PERSONAL_REMINDER,
    CHORE_TYPE_ASSIGNED,
    CHORE_TYPE_CLAIMABLE,
    CHORE_TYPE_REMINDER,
    CLAIMABLE_SUBTYPE_FCFS,
    CLAIMABLE_SUBTYPE_MULTI,
    MULTI_CLAIM_POINTS_FULL,
    MULTI_CLAIM_POINTS_SPLIT,
    CONF_PENALTIES_PAUSED_GLOBAL,
    CONF_SHOW_DOLLAR_VALUE_TO_KIDS,
    DEFAULT_PENALTIES_PAUSED_GLOBAL,
    DEFAULT_PENALTIES_PAUSED_PERSON,
    DEFAULT_CATEGORY_LABELS,
    DEFAULT_FAMILY_NAME,
    DEFAULT_POINTS_PER_DOLLAR,
    DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS,
    DOMAIN,
    HISTORY_ALLOWANCE,
    HISTORY_COMPLETION_STREAK_MILESTONE,
    HISTORY_PERSON_ADDED,
    HISTORY_POINTS_AWARDED,
    HISTORY_REDEMPTION_APPROVED,
    HISTORY_REDEMPTION_DECLINED,
    HISTORY_REDEMPTION_REQUESTED,
    HISTORY_RETENTION_DAYS,
    TASK_INSTANCE_RETENTION_DAYS,
    HISTORY_TASK_ADDED,
    HISTORY_TASK_APPROVED,
    HISTORY_TASK_COMPLETED,
    HISTORY_TASK_DENIED,
    HISTORY_TASK_EXCUSED,
    HISTORY_TASK_MARKED_COMPLETE,
    HISTORY_TASK_REJECTED,
    HISTORY_TASK_SKIPPED,
    LEGACY_MAINTENANCE_CATEGORIES,
    RECURRENCE_DAILY,
    RECURRENCE_EVERY_N_DAYS,
    RECURRENCE_EVERY_N_WEEKS,
    RECURRENCE_MONTHLY_ON_DATE,
    RECURRENCE_ONE_TIME,
    RECURRENCE_WEEKLY,
    PROPOSAL_APPROVED,
    PROPOSAL_DECLINED,
    PROPOSAL_PENDING_KIDS,
    PROPOSAL_PENDING_PARENT,
    REDEMPTION_APPROVED,
    REDEMPTION_DECLINED,
    REDEMPTION_PENDING,
    HISTORY_GROUP_CHIP_IN,
    HISTORY_GROUP_REDEEMED,
    HISTORY_GROUP_PROPOSED,
    HISTORY_SUBSCRIPTION_STARTED,
    HISTORY_SUBSCRIPTION_RENEWED,
    HISTORY_SUBSCRIPTION_LAPSED,
    HISTORY_SUBSCRIPTION_CANCELED,
    HISTORY_SUBSCRIPTION_CANCEL_REQUESTED,
    HISTORY_SUBSCRIPTION_CANCEL_DECLINED,
    HISTORY_SUBSCRIPTION_UPDATED,
    ITEM_TYPE_ONE_TIME,
    ITEM_TYPE_SUBSCRIPTION,
    SUB_STATUS_ACTIVE,
    SUB_STATUS_LAPSED,
    SUB_STATUS_CANCEL_PENDING,
    SUB_STATUS_CANCELED,
    SUB_PERIOD_DAILY,
    SUB_PERIOD_WEEKLY,
    SUB_PERIOD_MONTHLY,
    SUB_PERIOD_QUARTERLY,
    SUB_PERIOD_BIANNUAL,
    SUB_PERIOD_ANNUAL,
    SCOPE_COMMON,
    SCOPE_PERSONAL,
    STATUS_APPROVED,
    STATUS_CLAIMED,
    STATUS_DENIED,
    STATUS_EXCUSED,
    STATUS_PENDING,
    STATUS_PENDING_APPROVAL,
    STATUS_REJECTED,
    STATUS_SELF_REPORTED,
    STATUS_SKIPPED,
    DATA_SCHEMA_VERSION,
    STORAGE_FILE,
    STORAGE_VERSION,
)


def _now_iso() -> str:
    return datetime.now().astimezone().isoformat()


def _today_str() -> str:
    return date.today().isoformat()


def _new_id() -> str:
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# v0.7.0 P3 — module-oriented multi-store layout
# ---------------------------------------------------------------------------
# Each domain persists to its own HA Store (.storage/family_hub_<domain>) with
# debounced writes, so a chore tap no longer rewrites the whole ~1 MB file.
# `self._data` keeps the SAME merged shape, so all CRUD/business logic is
# unchanged. Any top-level key not listed here falls into "core" (so nothing is
# ever lost, and a future module's collection is forward-compatible). A new
# module = a new domain here + its own data/<module> package later.
_STORE_DOMAINS: dict[str, list[str]] = {
    "core":    ["version", "schema_version", "settings", "people"],
    "chores":  ["chores", "task_instances"],
    "rewards": ["store_items", "redemptions", "subscriptions", "group_reward_proposals"],
    "history": ["history"],
    "meals":   ["meals"],   # v0.8.0 Meals room (own store: .storage/family_hub_meals)
    "maintenance": [        # v0.8.0 Home Maintenance module (.storage/family_hub_maintenance)
        "maintenance_tasks", "maintenance_products", "maintenance_completions",
        "maintenance_vendors", "maintenance_funds", "home_profile",
    ],
}
_SAVE_DELAY_SECONDS = 2.0  # debounce window for async_delay_save


def _empty_store(
    family_name: str = DEFAULT_FAMILY_NAME,
    points_per_dollar: int = DEFAULT_POINTS_PER_DOLLAR,
) -> dict:
    return {
        "version": STORAGE_VERSION,
        "schema_version": DATA_SCHEMA_VERSION,
        "settings": {
            "family_name": family_name,
            "points_per_dollar": points_per_dollar,
            "show_dollar_value_to_kids": DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS,
            "category_labels": list(DEFAULT_CATEGORY_LABELS),
            "created_at": _now_iso(),
        },
        "people": [],
        "chores": [],
        "task_instances": [],
        "store_items": [],
        "redemptions": [],
        "subscriptions": [],
        "history": [],
        "group_reward_proposals": [],
        "meals": _empty_meals(),
        **_empty_maintenance(),
    }


def _empty_meals() -> dict:
    """v0.8.0: empty Meals-room state. Mirrors the prototype's localStorage keys
    (camelCase preserved so the frontend port reads the model verbatim). `favs`
    seeds the static library's fav:true ids; everything else starts empty so the
    family builds their own plan (theme nights ship unassigned)."""
    from .const import MEALS_SEED_FAVS
    return {
        "plan":      {},   # 'YYYY-MM-DD' -> { b, l, d:{main,sides,protein,variant,via}, noRhythm }
        "rhythm":    {},   # '<weekday 0=Sun>' -> theme key
        "favs":      list(MEALS_SEED_FAVS),
        "groc":      {},   # grocery-row key -> True (checked off)
        "custom":    [],   # custom + saved-idea meals
        "customIng": [],   # custom pantry ingredients
        "recipes":   {},   # mealId -> recipe card
        "have":      [],   # "what we have" pantry tag ids
    }


def _migrate_meals(data: dict) -> None:
    """Idempotent forward-fill for the meals section. Safe on every load: ensures
    the section + all sub-keys exist so older stores (and the first load after the
    feature ships) gain the meals domain without wiping any existing plan."""
    meals = data.setdefault("meals", _empty_meals())
    defaults = _empty_meals()
    for key, default in defaults.items():
        meals.setdefault(key, default)


def _empty_maintenance() -> dict:
    """v0.8.0: empty Home Maintenance collections. Each is a top-level key routed
    to the `maintenance` store domain. Tasks carry next_due/last_completed (state
    is derived, not stored — see _maintenance_schedule); completions are append-
    only; home_profile parameterises seed applicability and is editable settings."""
    return {
        "maintenance_tasks":       [],
        "maintenance_products":    [],
        "maintenance_completions": [],
        "maintenance_vendors":     [],
        "maintenance_funds":       [],
        "home_profile":            {},
    }


def _migrate_maintenance(data: dict) -> None:
    """Idempotent forward-fill for the maintenance collections. Safe on every
    load: ensures each collection exists without touching existing records."""
    defaults = _empty_maintenance()
    for key, default in defaults.items():
        data.setdefault(key, default)


# ---------------------------------------------------------------------------
# Migration helpers — run silently on load, never raise
# ---------------------------------------------------------------------------

def _migrate_chore(chore: dict) -> dict:
    """Migrate a single chore record to v0.3.0/v0.4.0 shape."""
    # assigned_to: string or None → list
    at = chore.get("assigned_to")
    if at is None:
        chore["assigned_to"] = []
    elif isinstance(at, str):
        chore["assigned_to"] = [at] if at else []

    # chore_type: derive from old category if missing
    if "chore_type" not in chore:
        old_cat = chore.get("category", CATEGORY_ASSIGNED)
        if old_cat == CATEGORY_CLAIMABLE:
            chore["chore_type"] = CHORE_TYPE_CLAIMABLE
        elif old_cat in LEGACY_MAINTENANCE_CATEGORIES:
            chore["chore_type"] = CHORE_TYPE_REMINDER
        else:
            chore["chore_type"] = CHORE_TYPE_ASSIGNED

    # category_label: default to "Maintenance" for old maintenance chores
    if "category_label" not in chore:
        old_cat = chore.get("category", "")
        if old_cat == CATEGORY_MAINTENANCE:
            chore["category_label"] = "Maintenance"
        elif old_cat == CATEGORY_PERSONAL_REMINDER:
            chore["category_label"] = "Morning"
        else:
            chore["category_label"] = ""

    # sort_order
    if "sort_order" not in chore:
        chore["sort_order"] = 0

    # description
    chore.setdefault("description", "")

    # penalty fields
    chore.setdefault("penalty_enabled", False)
    chore.setdefault("penalty_points", 0)

    # v0.4.0: expiry — None means no expiry (recurring chores never expire)
    chore.setdefault("expires_after_days", None)

    # recurrence: weekday (int) → weekdays (list)
    rec = chore.setdefault("recurrence", {})
    if "weekday" in rec and "weekdays" not in rec:
        rec["weekdays"] = [rec.pop("weekday")]
    rec.setdefault("weekdays", [])
    rec.setdefault("day_filter", [])   # day filter for daily chores
    rec.setdefault("interval", 1)

    # v0.5.0: weekly chores use weekdays, not day_filter — clear any stale value.
    # Caused by early data where both fields were set simultaneously.
    if rec.get("type") == RECURRENCE_WEEKLY and rec.get("day_filter"):
        rec["day_filter"] = []

    # v0.5.0: daily penalty threshold
    chore.setdefault("daily_penalty_after_days", None)

    # v0.5.0: claimable subtypes
    chore.setdefault("claimable_subtype", CLAIMABLE_SUBTYPE_FCFS)
    chore.setdefault("max_claimants", 2)
    chore.setdefault("multi_claim_points_mode", MULTI_CLAIM_POINTS_FULL)

    # v0.5.0: streak milestone config
    chore.setdefault("streak_milestone", 0)      # 0 = disabled; else bonus fires every N completions
    chore.setdefault("streak_bonus_points", 0)

    # v0.5.0: per-chore reminder time (HHMM int, -1 = off)
    chore.setdefault("reminder_time", -1)

    # v0.6.2: rotation pool. Empty list = no rotation (legacy behavior).
    # When populated, the active assignee cycles through pool[rotation_index]
    # on the configured cadence; advance logic lives in coordinator.py.
    chore.setdefault("rotation_pool", [])
    chore.setdefault("rotation_cadence", "")     # "" when rotation_pool is empty
    chore.setdefault("rotation_switch_weekday", 0)  # v0.7.3: weekly-cadence flip day (0=Mon)
    chore.setdefault("rotation_index", 0)
    chore.setdefault("rotation_last_advanced", "")  # iso date string of last advance

    # v0.6.6: active flag — False = paused/inactive (no new instances generated)
    chore.setdefault("active", True)

    return chore


def _migrate_store_item(item: dict) -> dict:
    """Migrate a store item to v0.3.0 shape (person_id → person_ids list)."""
    if "person_ids" not in item:
        pid = item.get("person_id")
        item["person_ids"] = [pid] if pid else []
    # v0.6.3: sort_order for admin drag-reorder. Default 0; back-fill in
    # creation order during full migration (see _migrate, end of method).
    item.setdefault("sort_order", 0)
    # v0.6.3: optional FH_ICON key for the store item ("" = no icon)
    item.setdefault("icon", "")
    # v0.6.3+: category grouping (matches chore category_label shape)
    item.setdefault("category_label", "")
    # v0.6.3+ item 5: max redemptions per period (0 = unlimited)
    item.setdefault("max_per_period", 0)
    item.setdefault("period", "week")
    # v0.6.3+ active flag — False = archived/hidden in store
    item.setdefault("active", True)
    # v0.6.3 item 13: group / shared reward
    item.setdefault("is_group_reward", False)
    item.setdefault("contributors", [])   # [{person_id, share_pct, contributed_pts}]
    # v0.6.5: subscription fields — defaults preserve all existing items as one_time
    item.setdefault("item_type", ITEM_TYPE_ONE_TIME)
    item.setdefault("subscription_period", "")
    item.setdefault("subscription_anchor", 1)
    # v0.7.6: reward gates — both default off so existing rewards are unaffected.
    # require_daily_pct: 0 = no requirement; 1-100 = min % of today's daily chores done.
    # min_rank_index:    0 = no requirement; N = require person rank_index >= N.
    item.setdefault("require_daily_pct", 0)
    item.setdefault("min_rank_index", 0)
    return item


def _migrate_task_instance(instance: dict) -> dict:
    """Ensure task instances have expected fields."""
    instance.setdefault("penalty_applied", 0)
    instance.setdefault("daily_penalty_days_applied", 0)
    # multi-claim tracking on shared claimable instances
    instance.setdefault("claim_count", 0)
    instance.setdefault("claimant_ids", [])
    # v0.5.0: notification nudge tracking
    instance.setdefault("nudged_reminder", False)
    instance.setdefault("nudged_penalty_warning", False)
    instance.setdefault("nudged_penalty_date", None)
    return instance


def _advance_renewal_date(period: str, anchor: int, current_iso: str) -> str:
    """Advance next_renewal_date by exactly one subscription period.

    anchor semantics:
      daily     — ignored (always +1 day)
      weekly    — weekday 0–6; advances to the next occurrence of that weekday
                  (minimum 1 day, so same-day always goes to next week)
      monthly+  — day-of-month 1–31; clamped to the last day of the target month
                  (handles Feb 28/29 and 30-day months)
    """
    current = date.fromisoformat(current_iso)

    if period == SUB_PERIOD_DAILY:
        return (current + timedelta(days=1)).isoformat()

    if period == SUB_PERIOD_WEEKLY:
        days_ahead = (anchor - current.weekday()) % 7 or 7
        return (current + timedelta(days=days_ahead)).isoformat()

    # All month-based periods share the same clamp logic.
    months_to_add = {
        SUB_PERIOD_MONTHLY:   1,
        SUB_PERIOD_QUARTERLY: 3,
        SUB_PERIOD_BIANNUAL:  6,
        SUB_PERIOD_ANNUAL:   12,
    }.get(period, 1)

    raw_month  = current.month + months_to_add
    target_year  = current.year + (raw_month - 1) // 12
    target_month = ((raw_month - 1) % 12) + 1
    max_day      = calendar.monthrange(target_year, target_month)[1]
    target_day = max(1, min(anchor, max_day))
    return date(target_year, target_month, target_day).isoformat()


def _monthly_days(rec: dict) -> list[int]:
    """v0.7.3: effective day(s)-of-month for a monthly chore. Prefers the new
    `days_of_month` list (e.g. [1, 15]); falls back to the legacy single
    `day_of_month`. Returns a clean, sorted, deduped list in 1-31."""
    days = rec.get("days_of_month")
    if isinstance(days, list) and days:
        out = sorted({int(d) for d in days if isinstance(d, (int, float)) and 1 <= int(d) <= 31})
        if out:
            return out
    dom = rec.get("day_of_month")
    return [int(dom)] if dom else [1]


def _days_until_reset(chore: dict, today: date) -> int:
    """
    Days until this recurring chore will next be replaced by a fresh instance.
    Used by the card to show a "Resets [day]" badge instead of "due Nd ago".
    Returns 7 as a safe fallback.
    """
    rec    = chore.get("recurrence", {})
    r_type = rec.get("type")

    if r_type == RECURRENCE_WEEKLY:
        weekdays = rec.get("weekdays", [])
        if not weekdays:
            return 7
        # Minimum days until any configured reset weekday (never 0 — use 7 if today IS that day)
        return min(((wd - today.weekday()) % 7) or 7 for wd in weekdays)

    if r_type in (RECURRENCE_EVERY_N_DAYS, RECURRENCE_EVERY_N_WEEKS):
        n = rec.get("interval", 1)
        if r_type == RECURRENCE_EVERY_N_WEEKS:
            n *= 7
        try:
            created    = date.fromisoformat(chore["created_at"][:10])
            days_since = (today - created).days
            remaining  = n - (days_since % n)
            return remaining if remaining < n else n
        except (ValueError, KeyError):
            return n

    if r_type == RECURRENCE_MONTHLY_ON_DATE:
        # Soonest future configured day-of-month, across this month + next month.
        nm_year  = today.year + (1 if today.month == 12 else 0)
        nm_month = 1 if today.month == 12 else today.month + 1
        best = None
        for dom in _monthly_days(rec):
            for (yr, mo) in ((today.year, today.month), (nm_year, nm_month)):
                try:
                    cand = date(yr, mo, dom)
                except ValueError:
                    continue
                if cand > today:
                    delta = (cand - today).days
                    if best is None or delta < best:
                        best = delta
        return best if best is not None else 28

    return 7

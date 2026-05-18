"""
Family Hub — data store.

All family data lives in a single JSON file under the HA config directory.
This module handles reading, writing, and all CRUD operations on that file.

v0.3.0 changes:
  - assigned_to is now a list of person_ids (multi-person chore support)
  - chore_type replaces category in UI; old category values migrated on load
  - category_label (user-defined display grouping) added to chores
  - sort_order added to chores for drag-to-reorder
  - penalty_enabled / penalty_points added — deducted when cycle replaces incomplete chore
  - Recurrence: weekdays (list) replaces weekday (single); day_filter for daily chores
  - Daily tick now replaces incomplete instances (with penalty) instead of accumulating
  - remove_person service / async_remove_person method
  - add_task as canonical one-time task creator (add_one_time_task kept as alias)
  - Store items: person_ids (list) replaces single person_id
  - update_chore syncs pending task instances when assigned_to changes
  - settings.category_labels — user-defined display groups
  - Migration runs silently on load; data file version unchanged (backward compat)

v0.4.0 changes:
  - expires_after_days field on chores/tasks — one-time and claimable tasks auto-expire
  - Daily tick now also processes expirations
  - History trimming — entries older than HISTORY_RETENTION_DAYS (30 days) are pruned
    on each daily tick to keep the data file size bounded
  - STATUS_EXCUSED — skipped task with penalty reversed by parent (sick day etc.)
  - STATUS_REJECTED — approved/self-reported task with points clawed back
  - async_excuse_task — reverse penalty on a skipped instance
  - async_reject_task — claw back points on an approved/self-reported instance
  - async_mark_task_complete — retroactively mark a skipped instance as done, award points
  - async_force_daily_tick — trigger tick immediately (admin/debug service)
  - get_history_for_card — enriched history log for admin log UI
  - History entries now include chore_name for easier log display

v0.4.1 bug fixes:
  - async_update_chore: assignment sync now correctly creates per-person instances
    when assigned_to changes to a multi-person list, instead of collapsing all
    existing instances to assigned_to=None (which caused chores to vanish from
    every personal dashboard)
  - get_tasks_for_card: row dict now includes chore_type and expires_after_days
    so the card can identify reminder chores reliably without the brittle
    0-pts/no-penalty heuristic
  - get_all_tasks_for_command_center: ghost instances (assigned_to=None on a
    non-claimable chore) are now excluded; they have no owner to display and
    previously appeared on the command center as nameless tasks

v0.4.2 additions:
  - Global penalty pause: settings.penalties_paused (bool) — when True, no
    penalties fire for any person during the daily tick or expiry processing.
    Toggled from Admin → Settings. Persists until manually turned off.
  - Per-person penalty pause: person.penalties_paused (bool) — suppresses
    penalties for one person regardless of the global switch. Useful for
    sleepovers, vacations, or sick days. Toggled from Admin → Overview.
    Persists until a parent manually re-enables it.
  - penalties_paused_global and per-person penalties_paused exposed in the
    needs_attention sensor so the admin card can render correct toggle state.
"""

from __future__ import annotations

import asyncio
import json
import logging
import math
import os
import uuid
from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant

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
    REDEMPTION_APPROVED,
    REDEMPTION_DECLINED,
    REDEMPTION_PENDING,
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
    STORAGE_FILE,
    STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)


def _now_iso() -> str:
    return datetime.now().astimezone().isoformat()


def _today_str() -> str:
    return date.today().isoformat()


def _new_id() -> str:
    return str(uuid.uuid4())


def _empty_store(
    family_name: str = DEFAULT_FAMILY_NAME,
    points_per_dollar: int = DEFAULT_POINTS_PER_DOLLAR,
) -> dict:
    return {
        "version": STORAGE_VERSION,
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
        "history": [],
    }


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

    return chore


def _migrate_store_item(item: dict) -> dict:
    """Migrate a store item to v0.3.0 shape (person_id → person_ids list)."""
    if "person_ids" not in item:
        pid = item.get("person_id")
        item["person_ids"] = [pid] if pid else []
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
        dom = rec.get("day_of_month", 1)
        try:
            this_month = today.replace(day=dom)
            if this_month > today:
                return (this_month - today).days
        except ValueError:
            pass
        try:
            if today.month == 12:
                nxt = today.replace(year=today.year + 1, month=1, day=dom)
            else:
                nxt = today.replace(month=today.month + 1, day=dom)
            return (nxt - today).days
        except ValueError:
            return 28

    return 7


class FamilyHubDataStore:
    """Manages reading and writing the Family Hub JSON data file."""

    def __init__(self, hass: HomeAssistant, storage_path: str) -> None:
        self._hass = hass
        self._path = storage_path
        self._data: dict[str, Any] = {}
        # Serialises all mutations + saves so concurrent service calls don't race
        self._lock = asyncio.Lock()

    # ------------------------------------------------------------------
    # Load / Save
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Load data from disk, migrate records, create fresh store if missing."""
        def _load() -> dict:
            if not os.path.exists(self._path):
                _LOGGER.info("Family Hub: no data file found, creating fresh store at %s", self._path)
                return _empty_store()
            try:
                with open(self._path, encoding="utf-8") as f:
                    data = json.load(f)
                _LOGGER.info("Family Hub: loaded data store from %s", self._path)
                return data
            except (json.JSONDecodeError, OSError) as err:
                _LOGGER.error("Family Hub: failed to load data store: %s", err)
                return _empty_store()

        self._data = await self._hass.async_add_executor_job(_load)

        # Ensure settings block has all v0.3.0 keys
        s = self._data.setdefault("settings", {})
        s.setdefault("family_name",              DEFAULT_FAMILY_NAME)
        s.setdefault("points_per_dollar",         DEFAULT_POINTS_PER_DOLLAR)
        s.setdefault("show_dollar_value_to_kids", DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS)
        s.setdefault("category_labels",           list(DEFAULT_CATEGORY_LABELS))
        s.setdefault(CONF_PENALTIES_PAUSED_GLOBAL, DEFAULT_PENALTIES_PAUSED_GLOBAL)
        # v0.5.0: notification settings
        s.setdefault("penalty_alert_time", 800)  # HHMM; -1 = disabled
        # v0.6.0: hub layout settings
        s.setdefault("rooms_config", {})
        s.setdefault("weather_entity", "")
        s.setdefault("today_calendar_entities", [])
        # v0.6.0 S5: rank evaluation settings (also migrated after people loop below)

        # Migrate all records
        self._data["chores"]         = [_migrate_chore(c)         for c in self._data.get("chores", [])]
        self._data["store_items"]    = [_migrate_store_item(i)     for i in self._data.get("store_items", [])]
        self._data["task_instances"] = [_migrate_task_instance(t)  for t in self._data.get("task_instances", [])]

        # v0.6.0: ensure all people have code, theme_key, and rank fields
        for person in self._data.get("people", []):
            person.setdefault("code", "")
            person.setdefault("theme_key", "classic")
            # v0.6.0 S5: rank mechanic — parents get 999 (always max), kids start at 0
            if "rank_index" not in person:
                person["rank_index"] = 999 if person.get("type") == "parent" else 0
            person.setdefault("rank_drop_threshold", None)  # None = use global setting
            person.setdefault("rank_gain_threshold", None)  # None = use global setting
            # v0.6.0 S6: large-button mode for pre-readers
            person.setdefault("child_mode", False)

        # v0.6.0 S5: rank evaluation settings
        s.setdefault("rank_eval_weekday",   0)   # 0 = Monday
        s.setdefault("rank_drop_threshold", 50)
        s.setdefault("rank_gain_threshold", 75)

        # v0.5.0: remove people records with blank id (orphans from early development).
        _before = len(self._data["people"])
        self._data["people"] = [p for p in self._data["people"] if p.get("id")]
        _removed = _before - len(self._data["people"])
        if _removed:
            _LOGGER.info("Family Hub: migration removed %d orphan people records (blank id)", _removed)

        # v0.5.0: remove ghost task instances where assigned_to="" (pre-multi-person era).
        # These bypass the day-filter cleanup pass because "" is not None, causing
        # day-filter chores to appear on off-days (bug B3).
        _before = len(self._data["task_instances"])
        self._data["task_instances"] = [
            t for t in self._data["task_instances"] if t.get("assigned_to") != ""
        ]
        _removed = _before - len(self._data["task_instances"])
        if _removed:
            _LOGGER.info("Family Hub: migration removed %d ghost task instances (assigned_to='')", _removed)

        # Back-fill sort_order in creation order
        for idx, chore in enumerate(self._data["chores"]):
            if chore["sort_order"] == 0 and idx > 0:
                chore["sort_order"] = idx

    async def async_save(self) -> None:
        """Persist data to disk atomically. Lock acquired here."""
        def _write() -> None:
            os.makedirs(os.path.dirname(self._path), exist_ok=True)
            tmp = self._path + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, ensure_ascii=False)
            os.replace(tmp, self._path)

        async with self._lock:
            await self._hass.async_add_executor_job(_write)

    # ------------------------------------------------------------------
    # Settings
    # ------------------------------------------------------------------

    @property
    def settings(self) -> dict:
        return self._data.get("settings", {})

    @property
    def family_name(self) -> str:
        return self.settings.get("family_name", DEFAULT_FAMILY_NAME)

    @property
    def points_per_dollar(self) -> int:
        return self.settings.get("points_per_dollar", DEFAULT_POINTS_PER_DOLLAR)

    @property
    def show_dollar_value_to_kids(self) -> bool:
        return self.settings.get(CONF_SHOW_DOLLAR_VALUE_TO_KIDS, DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS)

    @property
    def category_labels(self) -> list[str]:
        return self.settings.get("category_labels", list(DEFAULT_CATEGORY_LABELS))

    @property
    def penalties_paused_global(self) -> bool:
        """True when all penalty deductions are globally suspended."""
        return self.settings.get(CONF_PENALTIES_PAUSED_GLOBAL, DEFAULT_PENALTIES_PAUSED_GLOBAL)

    def is_penalty_paused_for(self, person_id: str) -> bool:
        """
        Return True if penalties should be suppressed for this person.
        Either the global pause is active OR the person's own pause flag is set.
        """
        if self.penalties_paused_global:
            return True
        person = self.get_person(person_id)
        if person and person.get(CONF_PENALTIES_PAUSED_GLOBAL, DEFAULT_PENALTIES_PAUSED_PERSON):
            return True
        return False

    # ------------------------------------------------------------------
    # Streak helpers (v0.5.0)
    # ------------------------------------------------------------------

    def _get_streak(self, person_id: str, chore_id: str) -> int:
        """Return current streak count for this person+chore (0 if none)."""
        person = self.get_person(person_id)
        if not person:
            return 0
        return person.get("streaks", {}).get(chore_id, {}).get("count", 0)

    def _break_streak(self, person_id: str, chore_id: str) -> None:
        """Reset streak to 0. Called when a chore is skipped and not paused."""
        person = self.get_person(person_id)
        if not person:
            return
        streaks = person.setdefault("streaks", {})
        if chore_id in streaks and streaks[chore_id].get("count", 0) > 0:
            streaks[chore_id]["count"] = 0

    async def _increment_streak(
        self, person_id: str, chore_id: str, chore: dict, today: date
    ) -> None:
        """
        Increment streak by 1 and check for milestone bonus.
        Called on task approval / self-reported completion (not pending_approval submit).
        Skipped when the pause flag is active — paused days are transparent to streaks.
        """
        person = self.get_person(person_id)
        if not person:
            return
        streaks = person.setdefault("streaks", {})
        entry = streaks.setdefault(chore_id, {"count": 0, "last_completed": None})
        entry["count"] = entry.get("count", 0) + 1
        entry["last_completed"] = today.isoformat()
        new_count = entry["count"]

        milestone = chore.get("streak_milestone", 0)
        bonus     = chore.get("streak_bonus_points", 0)
        if milestone > 0 and bonus > 0 and new_count % milestone == 0:
            _LOGGER.info(
                "Family Hub: streak milestone %d for %s on chore '%s' — awarding %d bonus pts",
                new_count, person_id, chore["name"], bonus,
            )
            await self.async_award_points(
                person_id, bonus, _new_id(),
                f'Streak milestone ({new_count} in a row) — {bonus}pts for "{chore["name"]}"',
            )

    async def async_set_streak(
        self, person_id: str, chore_id: str, count: int
    ) -> bool:
        """
        Admin override: set a person's streak count directly.
        Used to correct accidental breaks (forgot to mark off, app error, etc.).
        """
        person = self.get_person(person_id)
        if not person:
            return False
        streaks = person.setdefault("streaks", {})
        streaks.setdefault(chore_id, {"count": 0, "last_completed": None})
        streaks[chore_id]["count"] = max(0, count)
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Rank helpers (v0.6.0 S5)
    # ------------------------------------------------------------------

    async def async_set_rank(self, person_id: str, rank_index: int) -> bool:
        """Admin override: set a person's rank_index directly."""
        person = self.get_person(person_id)
        if not person:
            return False
        person["rank_index"] = max(0, rank_index)
        await self.async_save()
        return True

    async def _async_process_weekly_ranks(self, tick_date: date) -> None:
        """
        Evaluate last week's point performance and adjust rank_index.
        Fires only on the configured rank_eval_weekday (default Monday = 0).
        Parents are always max rank — skipped.
        Each person moves at most ±1 rank per evaluation cycle.
        """
        s = self._data["settings"]
        eval_weekday = s.get("rank_eval_weekday", 0)  # 0 = Monday

        if tick_date.weekday() != eval_weekday:
            return

        global_drop = s.get("rank_drop_threshold", 50)
        global_gain = s.get("rank_gain_threshold", 75)

        # Week we're evaluating: the 7 days ending (exclusive) on tick_date
        week_end   = tick_date.isoformat()
        week_start = (tick_date - timedelta(days=7)).isoformat()

        for person in self.get_active_people():
            if person.get("type") == "parent":
                continue

            drop_thr = (
                person["rank_drop_threshold"]
                if person.get("rank_drop_threshold") is not None
                else global_drop
            )
            gain_thr = (
                person["rank_gain_threshold"]
                if person.get("rank_gain_threshold") is not None
                else global_gain
            )

            weekly_pts = sum(
                e.get("points_delta", 0)
                for e in self._data.get("history", [])
                if (
                    e.get("person_id") == person["id"]
                    and e.get("points_delta", 0) > 0
                    and week_start <= e.get("timestamp", "")[:10] < week_end
                )
            )

            current_idx = person.get("rank_index", 0)

            if weekly_pts >= gain_thr:
                new_idx = current_idx + 1  # frontend clamps to theme ladder length
            elif weekly_pts < drop_thr:
                new_idx = max(0, current_idx - 1)
            else:
                new_idx = current_idx

            if new_idx != current_idx:
                person["rank_index"] = new_idx
                direction = "up" if new_idx > current_idx else "down"
                _LOGGER.info(
                    "Family Hub: rank %s for %s — weekly_pts=%d (drop<%d gain>=%d) idx %d→%d",
                    direction, person.get("name", person["id"]),
                    weekly_pts, drop_thr, gain_thr, current_idx, new_idx,
                )

    async def async_update_settings(
        self,
        family_name: str | None = None,
        points_per_dollar: int | None = None,
        show_dollar_value_to_kids: bool | None = None,
        category_labels: list[str] | None = None,
        penalties_paused: bool | None = None,
        penalty_alert_time: int | None = None,
        rooms_config: dict | None = None,
        weather_entity: str | None = None,
        today_calendar_entities: list[str] | None = None,
        rank_eval_weekday: int | None = None,
        rank_drop_threshold: int | None = None,
        rank_gain_threshold: int | None = None,
    ) -> None:
        s = self._data["settings"]
        if family_name is not None:
            s["family_name"] = family_name
        if points_per_dollar is not None:
            s["points_per_dollar"] = points_per_dollar
        if show_dollar_value_to_kids is not None:
            s[CONF_SHOW_DOLLAR_VALUE_TO_KIDS] = show_dollar_value_to_kids
        if category_labels is not None:
            s["category_labels"] = category_labels
        if penalties_paused is not None:
            s[CONF_PENALTIES_PAUSED_GLOBAL] = penalties_paused
        if penalty_alert_time is not None:
            s["penalty_alert_time"] = penalty_alert_time
        if rooms_config is not None:
            s["rooms_config"] = rooms_config
        if weather_entity is not None:
            s["weather_entity"] = weather_entity
        if today_calendar_entities is not None:
            s["today_calendar_entities"] = today_calendar_entities
        if rank_eval_weekday is not None:
            s["rank_eval_weekday"] = rank_eval_weekday
        if rank_drop_threshold is not None:
            s["rank_drop_threshold"] = rank_drop_threshold
        if rank_gain_threshold is not None:
            s["rank_gain_threshold"] = rank_gain_threshold
        await self.async_save()

    # ------------------------------------------------------------------
    # People
    # ------------------------------------------------------------------

    @property
    def people(self) -> list[dict]:
        return self._data.get("people", [])

    def get_person(self, person_id: str) -> dict | None:
        return next((p for p in self.people if p["id"] == person_id), None)

    def get_active_people(self) -> list[dict]:
        return [p for p in self.people if p.get("active", True)]

    async def async_add_person(
        self,
        name: str,
        person_type: str = "kid",
        ha_user_id: str | None = None,
        avatar_color: str | None = None,
    ) -> dict:
        person = {
            "id": _new_id(),
            "name": name,
            "type": person_type,
            "ha_user_id": ha_user_id,
            "avatar_color": avatar_color or "#7F77DD",
            "active": True,
            "points_balance": 0,
            "points_lifetime": 0,
            "created_at": _now_iso(),
            "code": "",
            "theme_key": "classic",
            # v0.6.0 S5: rank
            "rank_index": 999 if person_type == "parent" else 0,
            "rank_drop_threshold": None,
            "rank_gain_threshold": None,
            "child_mode": False,
        }
        self._data["people"].append(person)
        self._append_history(
            event_type=HISTORY_PERSON_ADDED,
            person_id=person["id"],
            reference_id=person["id"],
            note=f"{name} added as {person_type}",
        )
        await self.async_save()
        return person

    async def async_update_person(self, person_id: str, **kwargs: Any) -> dict | None:
        person = self.get_person(person_id)
        if not person:
            return None
        allowed = {
            "name", "ha_user_id", "avatar_color", "active", "type", "penalties_paused",
            # v0.5.0: allowance
            "allowance_points", "allowance_schedule", "allowance_weekday", "allowance_monthday",
            # v0.5.0: notification target
            "notify_target",
            # v0.6.0: codename + theme
            "code", "theme_key",
            # v0.6.0 S5: rank
            "rank_index", "rank_drop_threshold", "rank_gain_threshold",
            # v0.6.0 S6: large-button mode
            "child_mode",
        }
        for key, val in kwargs.items():
            if key in allowed:
                person[key] = val
        await self.async_save()
        return person

    async def async_remove_person(self, person_id: str) -> bool:
        """
        Deactivate a person. Historical data is preserved.
        Pending task instances assigned to this person are removed — no new
        ones will be generated since daily tick skips inactive people.
        """
        person = self.get_person(person_id)
        if not person:
            return False
        person["active"] = False
        # Remove pending task instances for this person
        self._data["task_instances"] = [
            t for t in self._data["task_instances"]
            if not (t.get("assigned_to") == person_id and t["status"] in ACTIVE_STATUSES)
        ]
        await self.async_save()
        return True

    async def async_award_points(
        self, person_id: str, points: int, reference_id: str, note: str = ""
    ) -> dict | None:
        person = self.get_person(person_id)
        if not person:
            return None
        person["points_balance"]  = person.get("points_balance", 0)  + points
        person["points_lifetime"] = person.get("points_lifetime", 0) + points
        self._append_history(
            event_type=HISTORY_POINTS_AWARDED,
            person_id=person_id,
            reference_id=reference_id,
            points_delta=points,
            balance_after=person["points_balance"],
            note=note,
        )
        await self.async_save()
        return person

    async def async_deduct_points(
        self, person_id: str, points: int, reference_id: str, note: str = ""
    ) -> dict | None:
        """Deduct from spendable balance only — lifetime total unchanged."""
        person = self.get_person(person_id)
        if not person:
            return None
        person["points_balance"] = max(0, person.get("points_balance", 0) - points)
        self._append_history(
            event_type=HISTORY_POINTS_AWARDED,
            person_id=person_id,
            reference_id=reference_id,
            points_delta=-points,
            balance_after=person["points_balance"],
            note=note,
        )
        await self.async_save()
        return person

    async def async_award_bonus_points(
        self,
        person_id: str,
        points: int = 0,
        reason: str = "",
        dollar_amount: float | None = None,
    ) -> dict | None:
        if dollar_amount is not None:
            points = round(dollar_amount * self.points_per_dollar)
        if points <= 0:
            _LOGGER.warning("Family Hub: award_bonus_points called with zero or negative value")
            return None
        note = f"Bonus (${dollar_amount:.2f}): {reason}".rstrip(": ") if dollar_amount else f"Bonus: {reason}"
        return await self.async_award_points(person_id, points, _new_id(), note)

    async def async_admin_deduct_points(
        self,
        person_id: str,
        points: int = 0,
        reason: str = "",
        dollar_amount: float | None = None,
    ) -> dict | None:
        if dollar_amount is not None:
            points = round(dollar_amount * self.points_per_dollar)
        if points <= 0:
            _LOGGER.warning("Family Hub: deduct_points called with zero or negative value")
            return None
        note = f"Deduction (${dollar_amount:.2f}): {reason}".rstrip(": ") if dollar_amount else f"Deduction: {reason}"
        return await self.async_deduct_points(person_id, points, _new_id(), note)

    # ------------------------------------------------------------------
    # Chores (definitions)
    # ------------------------------------------------------------------

    @property
    def chores(self) -> list[dict]:
        return self._data.get("chores", [])

    def get_chore(self, chore_id: str) -> dict | None:
        return next((c for c in self.chores if c["id"] == chore_id), None)

    def get_active_chores(self) -> list[dict]:
        return [c for c in self.chores if c.get("active", True)]

    def _chore_is_maintenance(self, chore: dict) -> bool:
        """A chore belongs to the maintenance card if its label is 'Maintenance'."""
        return chore.get("category_label", "") == "Maintenance"

    async def async_add_chore(
        self,
        name: str,
        chore_type: str = CHORE_TYPE_ASSIGNED,
        assigned_to: list[str] | None = None,
        points: int = 10,
        approval_required: bool = True,
        recurrence_type: str = RECURRENCE_DAILY,
        recurrence_config: dict | None = None,
        description: str = "",
        category_label: str = "",
        sort_order: int | None = None,
        penalty_enabled: bool = False,
        penalty_points: int = 0,
        daily_penalty_after_days: int | None = None,
        expires_after_days: int | None = None,
        claimable_subtype: str = CLAIMABLE_SUBTYPE_FCFS,
        max_claimants: int = 2,
        multi_claim_points_mode: str = MULTI_CLAIM_POINTS_FULL,
        streak_milestone: int = 0,
        streak_bonus_points: int = 0,
        reminder_time: int = -1,
        icon: str | None = None,
        created_by: str | None = None,
    ) -> dict:
        # Determine next sort order if not provided
        if sort_order is None:
            existing = self.get_active_chores()
            sort_order = max((c.get("sort_order", 0) for c in existing), default=-1) + 1

        rec = {"type": recurrence_type}
        if recurrence_config:
            rec.update(recurrence_config)
        rec.setdefault("weekdays", [])
        rec.setdefault("day_filter", [])
        rec.setdefault("interval", 1)

        chore = {
            "id": _new_id(),
            "name": name,
            "description": description,
            "icon": icon,
            "chore_type": chore_type,
            # Keep category for legacy compat — matches chore_type value
            "category": chore_type,
            "category_label": category_label,
            "sort_order": sort_order,
            "assigned_to": assigned_to or [],
            "points": points,
            "approval_required": approval_required,
            "penalty_enabled": penalty_enabled,
            "penalty_points": penalty_points,
            "daily_penalty_after_days": daily_penalty_after_days,
            "expires_after_days": expires_after_days,  # None = no expiry
            "claimable_subtype": claimable_subtype,
            "max_claimants": max_claimants,
            "multi_claim_points_mode": multi_claim_points_mode,
            "streak_milestone":        streak_milestone,
            "streak_bonus_points":     streak_bonus_points,
            "reminder_time":           reminder_time,
            "recurrence": rec,
            "active": True,
            "created_at": _now_iso(),
            "created_by": created_by,
        }
        self._data["chores"].append(chore)
        self._append_history(
            event_type=HISTORY_TASK_ADDED,
            reference_id=chore["id"],
            person_id=created_by,
            note=f'Chore "{name}" created',
        )

        # Generate first task instance(s)
        today = date.today()
        if chore_type == CHORE_TYPE_CLAIMABLE:
            # Claimable chores get one shared instance (no assigned_to)
            await self._async_create_task_instance(chore, today, person_id=None)
        else:
            people_to_assign = assigned_to if assigned_to else []
            if people_to_assign:
                for pid in people_to_assign:
                    await self._async_create_task_instance(chore, today, person_id=pid)
            elif chore_type == CHORE_TYPE_REMINDER:
                # Reminders can exist without an owner (house-level reminders)
                await self._async_create_task_instance(chore, today, person_id=None)
            # else: assigned chore with no people yet — no instance until people are added

        await self.async_save()
        return chore

    async def async_update_chore(self, chore_id: str, **kwargs: Any) -> dict | None:
        """
        Update a chore definition.

        When assigned_to changes, all pending task instances for this chore
        are updated to match the new assignment so they appear in the right
        people's task lists immediately.
        """
        chore = self.get_chore(chore_id)
        if not chore:
            return None

        allowed = {
            "name", "description", "icon", "chore_type", "category_label",
            "sort_order", "assigned_to", "points", "approval_required",
            "penalty_enabled", "penalty_points", "daily_penalty_after_days",
            "expires_after_days", "claimable_subtype", "max_claimants",
            "multi_claim_points_mode", "streak_milestone", "streak_bonus_points",
            "reminder_time",
            "recurrence", "active", "weekdays", "day_filter", "interval",
        }
        old_assigned = list(chore.get("assigned_to", []))

        for key, val in kwargs.items():
            if key not in allowed:
                continue
            # Recurrence sub-fields can be passed at top level
            if key in {"weekdays", "day_filter", "interval"}:
                chore["recurrence"][key] = val
            elif key == "assigned_to":
                # Ensure it's always a list
                chore["assigned_to"] = val if isinstance(val, list) else ([val] if val else [])
            else:
                chore[key] = val

        # Keep legacy category field in sync with chore_type
        if "chore_type" in kwargs:
            chore["category"] = chore["chore_type"]

        new_assigned = chore.get("assigned_to", [])

        # Sync pending task instances to new assignment when it has changed.
        #
        # The previous logic collapsed all existing instances to a single one
        # and left assigned_to=None when there were multiple assignees, which
        # caused the instances to vanish from everyone's personal dashboard.
        #
        # Correct behaviour:
        #   1. Remove (delete) any pending instances whose assigned_to person
        #      is no longer in the new assignment list — they are orphaned.
        #   2. For each person newly added to the assignment list, create a
        #      fresh instance for today (the next tick will handle future dates).
        #   3. Leave instances that already have the correct assigned_to alone.
        if old_assigned != new_assigned:
            today = date.today()

            # Collect the due dates of existing active instances so we can
            # create matching new ones (avoids duplicate today instance when
            # one already exists for a person who stays assigned).
            existing_by_person: dict[str | None, set[str]] = {}
            for instance in self._data["task_instances"]:
                if instance["chore_id"] != chore_id:
                    continue
                if instance["status"] not in ACTIVE_STATUSES:
                    continue
                pid = instance.get("assigned_to")
                existing_by_person.setdefault(pid, set()).add(instance["due_date"])

            # Step 1: remove pending instances for people no longer assigned.
            # We keep them if new_assigned is empty (unassigned chore stays as-is).
            if new_assigned:
                self._data["task_instances"] = [
                    t for t in self._data["task_instances"]
                    if not (
                        t["chore_id"] == chore_id
                        and t["status"] in ACTIVE_STATUSES
                        and t.get("assigned_to") not in new_assigned
                        and t.get("assigned_to") is not None  # never remove unowned instances here
                    )
                ]

            # Step 2: create new instances for people who were just added.
            added_people = [pid for pid in new_assigned if pid not in old_assigned]
            today_str = today.isoformat()
            for pid in added_people:
                # Only create a today instance if one doesn't already exist
                already_has_today = today_str in existing_by_person.get(pid, set())
                if not already_has_today:
                    await self._async_create_task_instance(chore, today, person_id=pid)

        await self.async_save()
        return chore

    async def async_delete_chore(self, chore_id: str) -> bool:
        chore = self.get_chore(chore_id)
        if not chore:
            return False
        chore["active"] = False
        self._data["task_instances"] = [
            t for t in self._data["task_instances"]
            if not (t["chore_id"] == chore_id and t["status"] in ACTIVE_STATUSES)
        ]
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # One-time tasks (separated from recurring chores)
    # ------------------------------------------------------------------

    async def async_add_task(
        self,
        name: str,
        assigned_to: list[str] | None = None,
        points: int = 0,
        description: str = "",
        approval_required: bool = False,
        expires_after_days: int | None = None,
        created_by: str | None = None,
    ) -> dict:
        """
        Create a one-time task. Does not appear in the chore management list.
        Uses chore_type=assigned + recurrence=one_time internally.
        expires_after_days: if set, the pending instance is auto-skipped after
        this many days (with penalty if penalty_enabled on the chore).
        """
        return await self.async_add_chore(
            name=name,
            chore_type=CHORE_TYPE_ASSIGNED,
            assigned_to=assigned_to or [],
            points=points,
            approval_required=approval_required,
            recurrence_type=RECURRENCE_ONE_TIME,
            description=description,
            category_label="",
            expires_after_days=expires_after_days,
            created_by=created_by,
        )

    # ------------------------------------------------------------------
    # Task instances
    # ------------------------------------------------------------------

    @property
    def task_instances(self) -> list[dict]:
        return self._data.get("task_instances", [])

    def get_task_instance(self, instance_id: str) -> dict | None:
        return next((t for t in self.task_instances if t["id"] == instance_id), None)

    def get_active_tasks(self, person_id: str | None = None) -> list[dict]:
        tasks = [t for t in self.task_instances if t["status"] in ACTIVE_STATUSES]
        if person_id:
            tasks = [t for t in tasks if t.get("assigned_to") == person_id]
        return tasks

    def get_pending_approvals(self) -> list[dict]:
        return [t for t in self.task_instances if t["status"] == STATUS_PENDING_APPROVAL]

    def get_claimable_tasks(self) -> list[dict]:
        return [
            t for t in self.task_instances
            if t["status"] == STATUS_PENDING
            and t.get("assigned_to") is None
            and self._is_claimable_task(t)
        ]

    def _is_claimable_task(self, task: dict) -> bool:
        chore = self.get_chore(task["chore_id"])
        return chore is not None and chore.get("chore_type") == CHORE_TYPE_CLAIMABLE

    async def _async_create_task_instance(
        self, chore: dict, due_date: date, person_id: str | None = None
    ) -> dict:
        instance = {
            "id": _new_id(),
            "chore_id": chore["id"],
            "assigned_to": person_id,
            "status": STATUS_PENDING,
            "due_date": due_date.isoformat(),
            "claimed_by": None,
            "completed_at": None,
            "completed_by": None,
            "approved_at": None,
            "approved_by": None,
            "points_awarded": 0,
            "penalty_applied": 0,
            "created_at": _now_iso(),
        }
        self._data["task_instances"].append(instance)
        return instance

    async def async_complete_task(self, instance_id: str, completed_by: str) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance:
            return None
        chore = self.get_chore(instance["chore_id"])
        if not chore:
            return None

        instance["completed_at"] = _now_iso()
        instance["completed_by"] = completed_by

        if chore.get("approval_required", True):
            instance["status"] = STATUS_PENDING_APPROVAL
            self._append_history(
                event_type=HISTORY_TASK_COMPLETED,
                person_id=completed_by,
                reference_id=instance_id,
                note=f'"{chore["name"]}" marked complete, awaiting approval',
                chore_name=chore["name"],
            )
        else:
            points = chore.get("points", 0)
            instance["status"]        = STATUS_SELF_REPORTED
            instance["points_awarded"] = points
            instance["approved_at"]   = _now_iso()
            instance["approved_by"]   = "system"
            self._append_history(
                event_type=HISTORY_TASK_COMPLETED,
                person_id=completed_by,
                reference_id=instance_id,
                note=f'"{chore["name"]}" self-reported complete',
                chore_name=chore["name"],
            )
            if points > 0 and completed_by:
                await self.async_award_points(
                    completed_by, points, instance_id, f'Points for "{chore["name"]}"'
                )
            if completed_by and not self.is_penalty_paused_for(completed_by):
                await self._increment_streak(completed_by, chore["id"], chore, date.today())

        await self.async_save()
        return instance

    async def async_approve_task(self, instance_id: str, approved_by: str) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING_APPROVAL:
            return None
        chore = self.get_chore(instance["chore_id"])
        if not chore:
            return None

        points = chore.get("points", 0)
        instance["status"]        = STATUS_APPROVED
        instance["approved_at"]   = _now_iso()
        instance["approved_by"]   = approved_by
        instance["points_awarded"] = points

        completed_by = instance.get("completed_by")
        self._append_history(
            event_type=HISTORY_TASK_APPROVED,
            person_id=completed_by,
            reference_id=instance_id,
            note=f'"{chore["name"]}" approved',
            chore_name=chore["name"],
        )
        if points > 0 and completed_by:
            await self.async_award_points(
                completed_by, points, instance_id, f'Points for "{chore["name"]}"'
            )
        if completed_by and not self.is_penalty_paused_for(completed_by):
            await self._increment_streak(completed_by, chore["id"], chore, date.today())
        await self.async_save()
        return instance

    async def async_deny_task(
        self, instance_id: str, denied_by: str, reason: str = ""
    ) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING_APPROVAL:
            return None
        chore = self.get_chore(instance["chore_id"])
        chore_name = chore["name"] if chore else "unknown"

        instance["status"]      = STATUS_DENIED
        instance["approved_at"] = _now_iso()
        instance["approved_by"] = denied_by

        self._append_history(
            event_type=HISTORY_TASK_DENIED,
            person_id=instance.get("completed_by"),
            reference_id=instance_id,
            note=f'"{chore_name}" denied. {reason}'.strip(),
            chore_name=chore_name,
        )

        # Same retry logic as async_reject_task: recreate a pending instance so
        # the person can try again.
        today_str = date.today().isoformat()
        chore_r_type = chore["recurrence"].get("type") if chore else RECURRENCE_ONE_TIME
        pid = instance.get("completed_by") or instance.get("assigned_to")
        is_claimable = chore and chore.get("chore_type") == CHORE_TYPE_CLAIMABLE

        if (not is_claimable
                and chore_r_type != RECURRENCE_ONE_TIME
                and instance.get("due_date") == today_str
                and pid):
            await self._async_create_task_instance(chore, date.today(), person_id=pid)

        if is_claimable:
            already_available = any(
                t for t in self.task_instances
                if t["chore_id"] == chore["id"]
                and t["status"] in [STATUS_PENDING, STATUS_CLAIMED]
            )
            if not already_available:
                await self._async_create_task_instance(chore, date.today(), person_id=None)

        await self.async_save()
        return instance

    async def async_claim_task(self, instance_id: str, claimed_by: str) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING:
            return None
        if not self._is_claimable_task(instance):
            return None

        chore = self.get_chore(instance["chore_id"])
        if not chore:
            return None

        subtype = chore.get("claimable_subtype", CLAIMABLE_SUBTYPE_FCFS)

        if subtype == CLAIMABLE_SUBTYPE_MULTI:
            max_c = chore.get("max_claimants", 2)
            # Reject if already claimed by this person or capacity reached
            if claimed_by in instance.get("claimant_ids", []):
                _LOGGER.warning("Family Hub: claim_task — %s already claimed this multi-claim task", claimed_by)
                return None
            if instance.get("claim_count", 0) >= max_c:
                _LOGGER.warning("Family Hub: claim_task — multi-claim capacity already reached")
                return None

            # Record this claimant on the shared instance
            instance.setdefault("claimant_ids", []).append(claimed_by)
            instance["claim_count"] = instance.get("claim_count", 0) + 1

            # Create a personal instance for the claimant (STATUS_CLAIMED, awaiting award)
            personal = await self._async_create_task_instance(chore, date.today(), person_id=claimed_by)
            personal["status"]     = STATUS_CLAIMED
            personal["claimed_by"] = claimed_by

            # If capacity now full, award points to all claimants immediately
            if instance["claim_count"] >= max_c:
                await self._async_award_multi_claim_claimants(instance, chore)
                instance["status"] = STATUS_APPROVED  # shared instance closed

        else:
            # FCFS: first claimer takes the whole task
            instance["status"]      = STATUS_CLAIMED
            instance["assigned_to"] = claimed_by
            instance["claimed_by"]  = claimed_by

        await self.async_save()
        return instance

    async def _async_award_multi_claim_claimants(
        self, shared_instance: dict, chore: dict
    ) -> None:
        """
        Award points to all claimants of a multi-claim shared instance.
        Called either when max_claimants is reached (at claim time) or when
        the chore cycle resets (in the tick, before the shared instance is skipped).

        Points mode:
          "full"  — each claimant earns chore.points
          "split" — points divided evenly among actual claimants (ceil)
        """
        claimant_ids = shared_instance.get("claimant_ids", [])
        if not claimant_ids:
            return

        base_points = chore.get("points", 0)
        if chore.get("multi_claim_points_mode", MULTI_CLAIM_POINTS_FULL) == MULTI_CLAIM_POINTS_SPLIT:
            pts_each = math.ceil(base_points / len(claimant_ids)) if base_points and claimant_ids else 0
        else:
            pts_each = base_points

        for pid in claimant_ids:
            # Find the personal STATUS_CLAIMED instance for this claimant
            personal = next(
                (t for t in self.task_instances
                 if t["chore_id"] == chore["id"]
                 and t.get("assigned_to") == pid
                 and t["status"] == STATUS_CLAIMED),
                None,
            )
            if personal:
                personal["status"]        = STATUS_SELF_REPORTED
                personal["points_awarded"] = pts_each
                personal["approved_at"]   = _now_iso()
                personal["approved_by"]   = "system"
                personal.setdefault("completed_at", _now_iso())
                personal.setdefault("completed_by", pid)

            if pts_each > 0:
                person = self.get_person(pid)
                if person:
                    person["points_balance"]  = person.get("points_balance", 0) + pts_each
                    person["points_lifetime"] = person.get("points_lifetime", 0) + pts_each
                    self._append_history(
                        event_type=HISTORY_TASK_APPROVED,
                        person_id=pid,
                        reference_id=personal["id"] if personal else shared_instance["id"],
                        points_delta=pts_each,
                        balance_after=person["points_balance"],
                        note=f'"{chore["name"]}" multi-claim awarded — {pts_each}pts',
                        chore_name=chore["name"],
                    )

    # ------------------------------------------------------------------
    # Notification helpers (v0.5.0)
    # ------------------------------------------------------------------

    async def _send_notify(self, target: str, title: str, message: str) -> None:
        """Call a HA notify service. Errors are logged, never raised."""
        try:
            await self._hass.services.async_call(
                "notify", target,
                {"title": title, "message": message},
                blocking=False,
            )
            _LOGGER.info("Family Hub: notification sent to %s — %s", target, title)
        except Exception as err:
            _LOGGER.warning("Family Hub: notification failed for '%s': %s", target, err)

    async def async_check_notifications(self) -> None:
        """
        Send per-chore reminders and penalty nudges. Called every coordinator poll.

        Three notification types:
          #3 Per-chore reminder_time — fires once per task instance when current
             time reaches the chore's configured HHMM threshold and task is still pending.
          #1 Last-chance penalty warning — fires once per instance on the last day
             before a weekly/monthly penalty-enabled chore resets.
          #2 Daily penalty accumulating — fires once per day while daily_penalty_after_days
             penalties are actively accruing on a task instance.
        """
        now = datetime.now()
        today = now.date()
        current_hmm = now.hour * 100 + now.minute

        settings = self._data["settings"]
        penalty_alert_time = settings.get("penalty_alert_time", 800)
        past_alert_time = penalty_alert_time != -1 and current_hmm >= penalty_alert_time

        changed = False

        for instance in self._data["task_instances"]:
            if instance["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue

            pid = instance.get("assigned_to")
            if not pid:
                continue

            person = self.get_person(pid)
            if not person or not person.get("active", True):
                continue

            target = person.get("notify_target", "").strip()
            if not target:
                continue

            chore = self.get_chore(instance["chore_id"])
            if not chore:
                continue

            first_name = person["name"].split()[0]
            chore_name = chore["name"]

            # --- #3: Per-chore reminder_time ---
            reminder_time = chore.get("reminder_time", -1)
            if (reminder_time != -1
                    and current_hmm >= reminder_time
                    and not instance.get("nudged_reminder")):
                await self._send_notify(
                    target,
                    f"Don't forget — {chore_name}",
                    f"Hey {first_name}, don't forget to {chore_name}!",
                )
                instance["nudged_reminder"] = True
                changed = True

            # --- #1: Last-chance penalty warning (weekly/monthly only) ---
            if past_alert_time and not instance.get("nudged_penalty_warning"):
                rec = chore.get("recurrence", {})
                r_type = rec.get("type", RECURRENCE_DAILY)
                is_long_cycle = r_type in (
                    RECURRENCE_WEEKLY, RECURRENCE_EVERY_N_WEEKS,
                    RECURRENCE_EVERY_N_DAYS, RECURRENCE_MONTHLY_ON_DATE,
                )
                if (is_long_cycle
                        and chore.get("penalty_enabled")
                        and chore.get("penalty_points", 0) > 0
                        and _days_until_reset(chore, today) == 1):
                    penalty_pts = chore["penalty_points"]
                    await self._send_notify(
                        target,
                        f"Don't forget — {chore_name}!",
                        f"Hey {first_name}! {chore_name} needs to get done today. "
                        f"Skip it and you'll lose {penalty_pts} pts!",
                    )
                    instance["nudged_penalty_warning"] = True
                    changed = True

            # --- #2: Daily penalty accumulating ---
            daily_applied = instance.get("daily_penalty_days_applied", 0)
            if (past_alert_time
                    and daily_applied > 0
                    and instance.get("nudged_penalty_date") != today.isoformat()):
                penalty_pts = chore.get("penalty_points", 0)
                await self._send_notify(
                    target,
                    f"Still losing points — {chore_name}",
                    f"Hey {first_name}, you're losing {penalty_pts} pts each day "
                    f"{chore_name} isn't done. Finish it today to stop losing points!",
                )
                instance["nudged_penalty_date"] = today.isoformat()
                changed = True

        if changed:
            await self.async_save()

    # ------------------------------------------------------------------
    # Scheduled allowance helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _should_award_allowance(person: dict, tick_date: date) -> bool:
        """Return True if this person's scheduled allowance should fire on tick_date."""
        points = person.get("allowance_points", 0)
        if not points or points <= 0:
            return False
        schedule = person.get("allowance_schedule", "weekly")
        last_str = person.get("last_allowance_date")
        last = date.fromisoformat(last_str) if last_str else None

        if schedule in ("weekly", "biweekly"):
            weekday = person.get("allowance_weekday", 5)  # Saturday default
            if tick_date.weekday() != weekday:
                return False
            min_gap = 14 if schedule == "biweekly" else 7
            if last and (tick_date - last).days < min_gap:
                return False
            return True

        if schedule == "monthly":
            monthday = person.get("allowance_monthday", 1)
            if tick_date.day != monthday:
                return False
            if last and last.month == tick_date.month and last.year == tick_date.year:
                return False
            return True

        return False

    async def _async_process_allowances(self, tick_date: date) -> None:
        """Award scheduled allowances for all active people on tick_date."""
        for person in self.get_active_people():
            if not self._should_award_allowance(person, tick_date):
                continue
            pts = person["allowance_points"]
            person["points_balance"]  = person.get("points_balance", 0) + pts
            person["points_lifetime"] = person.get("points_lifetime", 0) + pts
            self._append_history(
                event_type=HISTORY_ALLOWANCE,
                person_id=person["id"],
                reference_id=_new_id(),
                points_delta=pts,
                balance_after=person["points_balance"],
                note="Allowance",
            )
            person["last_allowance_date"] = tick_date.isoformat()
            _LOGGER.info(
                "Family Hub: allowance awarded — %s %dpts (%s)",
                person.get("name", person["id"]), pts, tick_date.isoformat(),
            )

    # ------------------------------------------------------------------
    # Daily tick — persistent stateful, with catch-up and penalty/replace
    # ------------------------------------------------------------------

    async def async_daily_tick(self) -> None:
        """
        Generate task instances for all days since last tick.
        Replaces incomplete instances (with penalty deduction) instead of
        accumulating them. Persists last_tick_date in JSON settings.

        v0.4.0 additions run after instance generation:
          - Expire pending one-time/claimable instances past their deadline
          - Trim history entries older than HISTORY_RETENTION_DAYS
        """
        today = date.today()
        CATCH_UP_LIMIT = 7

        last_tick_str = self._data["settings"].get("last_tick_date")
        if last_tick_str is None:
            last_tick = today - timedelta(days=1)
        else:
            try:
                last_tick = date.fromisoformat(last_tick_str)
            except ValueError:
                last_tick = today - timedelta(days=1)

        days_missed = (today - last_tick).days
        if days_missed <= 0:
            return

        if days_missed > CATCH_UP_LIMIT:
            _LOGGER.warning(
                "Family Hub: %d missed days, capping catch-up at %d",
                days_missed, CATCH_UP_LIMIT,
            )
            last_tick = today - timedelta(days=CATCH_UP_LIMIT)

        current = last_tick + timedelta(days=1)
        while current <= today:
            await self._async_tick_for_date(current)
            await self._async_process_allowances(current)
            await self._async_process_weekly_ranks(current)
            current += timedelta(days=1)

        # --- Expire overdue one-time / claimable instances -------------------
        await self._async_expire_tasks(today)

        # --- Trim history to rolling window ----------------------------------
        self._trim_history(today)

        # --- Prune old terminal task instances -------------------------------
        self._trim_task_instances(today)

        self._data["settings"]["last_tick_date"] = today.isoformat()
        await self.async_save()

    async def _async_tick_for_date(self, tick_date: date) -> None:
        """
        For each active chore due on tick_date:
        1. Find any existing incomplete instance(s) for same chore+person.
        2. Apply penalty and mark them skipped.
        3. Create the new instance.

        After the main loop, a cleanup pass runs for RECURRENCE_DAILY chores
        that have a day_filter and are NOT due on tick_date (off-days). Any
        pending instances from a previous due-day are skipped with penalty so
        they do not linger in the overdue list on off-days (e.g. a Mon–Fri chore
        should not show overdue on Saturday).
        """
        for chore in self.get_active_chores():
            r_type = chore["recurrence"].get("type", RECURRENCE_DAILY)
            if r_type == RECURRENCE_ONE_TIME:
                continue
            if not self._is_due_on_date(chore, tick_date):
                continue

            if chore.get("chore_type") == CHORE_TYPE_CLAIMABLE:
                # Claimable: one shared instance, no person
                existing = [
                    t for t in self.task_instances
                    if t["chore_id"] == chore["id"]
                    and t["due_date"] == tick_date.isoformat()
                ]
                if existing:
                    continue
                # Skip/replace any still-pending instance from previous cycle
                await self._skip_incomplete_instances(chore, person_id=None)
                await self._async_create_task_instance(chore, tick_date, person_id=None)
            else:
                assigned_people = chore.get("assigned_to", [])
                if assigned_people:
                    for pid in assigned_people:
                        # Skip if already have an instance for this date+person
                        existing = [
                            t for t in self.task_instances
                            if t["chore_id"] == chore["id"]
                            and t["due_date"] == tick_date.isoformat()
                            and t.get("assigned_to") == pid
                        ]
                        if existing:
                            continue
                        await self._skip_incomplete_instances(chore, person_id=pid)
                        await self._async_create_task_instance(chore, tick_date, person_id=pid)
                else:
                    # No assigned people. Only reminder chores generate an unassigned
                    # instance — assigned chores with nobody configured are skipped to
                    # prevent ghost instances with no owner.
                    if chore.get("chore_type") == CHORE_TYPE_ASSIGNED:
                        continue
                    existing = [
                        t for t in self.task_instances
                        if t["chore_id"] == chore["id"]
                        and t["due_date"] == tick_date.isoformat()
                    ]
                    if existing:
                        continue
                    await self._skip_incomplete_instances(chore, person_id=None)
                    await self._async_create_task_instance(chore, tick_date, person_id=None)

        # Cleanup pass — daily chores with day_filter that are NOT due today.
        # When today is an off-day (e.g. Saturday for a Mon–Fri chore), the main
        # loop above skips the chore entirely, leaving Friday's pending instance
        # sitting in the overdue list. This pass finds those stale instances and
        # skips them (with penalty if configured) so they vanish immediately.
        tick_date_str = tick_date.isoformat()
        for chore in self.get_active_chores():
            rec        = chore.get("recurrence", {})
            r_type     = rec.get("type", RECURRENCE_DAILY)
            day_filter = rec.get("day_filter", [])
            if r_type != RECURRENCE_DAILY or not day_filter:
                continue
            if tick_date.weekday() in day_filter:
                continue  # this chore was due today — already handled above
            # Off-day: check for any stale pending instances older than today
            has_stale = any(
                t for t in self.task_instances
                if t["chore_id"] == chore["id"]
                and t["status"] in [STATUS_PENDING, STATUS_CLAIMED]
                and t["due_date"] < tick_date_str
            )
            if not has_stale:
                continue
            assigned = chore.get("assigned_to", [])
            if assigned:
                for pid in assigned:
                    await self._skip_incomplete_instances(chore, person_id=pid)
            else:
                await self._skip_incomplete_instances(chore, person_id=None)

        # Daily penalty pass — apply incremental daily penalties to pending
        # instances that have been sitting past their threshold. Runs after all
        # skipping so already-skipped instances are not double-penalised.
        await self._async_apply_daily_penalties(tick_date)

    async def _skip_incomplete_instances(self, chore: dict, person_id: str | None) -> None:
        """Mark any incomplete prior instances for this chore+person as skipped, applying penalty."""
        for instance in self.task_instances:
            if instance["chore_id"] != chore["id"]:
                continue
            if instance["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue
            if person_id is not None and instance.get("assigned_to") != person_id:
                continue
            if person_id is None and instance.get("assigned_to") not in (None, ""):
                continue

            # Multi-claim: award split/full points to any claimants before closing.
            if (person_id is None
                    and chore.get("chore_type") == CHORE_TYPE_CLAIMABLE
                    and chore.get("claimable_subtype") == CLAIMABLE_SUBTYPE_MULTI
                    and instance.get("claimant_ids")):
                await self._async_award_multi_claim_claimants(instance, chore)

            instance["status"] = STATUS_SKIPPED
            instance["approved_at"] = _now_iso()
            instance["approved_by"] = "system"

            # Apply penalty if configured, subject to global and per-person pause flags.
            # If either pause is active for this person, the task is still marked
            # skipped (so the next instance generates correctly) but no points
            # are deducted and no penalty history entry is written.
            pid = instance.get("assigned_to") or person_id
            if chore.get("penalty_enabled") and chore.get("penalty_points", 0) > 0:
                if pid:
                    if self.is_penalty_paused_for(pid):
                        # Penalties paused — skip silently, no deduction
                        _LOGGER.debug(
                            "Family Hub: penalty suppressed for %s (paused) — chore %s",
                            pid, chore["name"],
                        )
                        self._append_history(
                            event_type=HISTORY_TASK_SKIPPED,
                            person_id=pid,
                            reference_id=instance["id"],
                            points_delta=0,
                            balance_after=self.get_person(pid).get("points_balance", 0)
                                if self.get_person(pid) else 0,
                            note=f'"{chore["name"]}" not completed — penalty paused',
                            chore_name=chore["name"],
                        )
                    else:
                        penalty = chore["penalty_points"]
                        instance["penalty_applied"] = penalty
                        person = self.get_person(pid)
                        if person:
                            person["points_balance"] = max(0, person.get("points_balance", 0) - penalty)
                            self._append_history(
                                event_type=HISTORY_TASK_SKIPPED,
                                person_id=pid,
                                reference_id=instance["id"],
                                points_delta=-penalty,
                                balance_after=person["points_balance"],
                                note=f'"{chore["name"]}" not completed — {penalty}pt penalty applied',
                                chore_name=chore["name"],
                            )

            # Break streak on skip — unless the pause flag is active.
            # When paused, skipped days are transparent: streak is preserved
            # exactly where it was (neither increments nor resets).
            if pid and not self.is_penalty_paused_for(pid):
                self._break_streak(pid, chore["id"])

    async def _async_apply_daily_penalties(self, tick_date: date) -> None:
        """
        Apply incremental daily penalties to pending instances that have exceeded
        their `daily_penalty_after_days` threshold.

        Unlike the end-of-cycle skip penalty, this deducts points each day the
        task remains pending past the threshold WITHOUT skipping it. The task can
        still be completed; these penalties are in addition to any eventual skip.

        Tracks `daily_penalty_days_applied` on the instance so catch-up ticks
        apply exactly one penalty per missed day without double-charging.
        """
        for instance in self.task_instances:
            if instance["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue

            chore = self.get_chore(instance["chore_id"])
            if not chore:
                continue

            threshold = chore.get("daily_penalty_after_days")
            if not threshold or not chore.get("penalty_enabled") or not chore.get("penalty_points", 0):
                continue

            try:
                due = date.fromisoformat(instance["due_date"])
            except (ValueError, KeyError):
                continue

            age_days = (tick_date - due).days
            days_over = age_days - threshold
            if days_over <= 0:
                continue

            already_applied = instance.get("daily_penalty_days_applied", 0)
            if already_applied >= days_over:
                continue  # this day's penalty already fired (e.g. from prior catch-up run)

            pid = instance.get("assigned_to")
            if not pid:
                continue

            if self.is_penalty_paused_for(pid):
                _LOGGER.debug(
                    "Family Hub: daily penalty suppressed for %s (paused) — chore %s",
                    pid, chore["name"],
                )
                # Still count the day so we don't try again next tick
                instance["daily_penalty_days_applied"] = already_applied + 1
                continue

            penalty = chore["penalty_points"]
            instance["daily_penalty_days_applied"] = already_applied + 1
            person = self.get_person(pid)
            if person:
                person["points_balance"] = max(0, person.get("points_balance", 0) - penalty)
                self._append_history(
                    event_type=HISTORY_TASK_SKIPPED,
                    person_id=pid,
                    reference_id=instance["id"],
                    points_delta=-penalty,
                    balance_after=person["points_balance"],
                    note=f'"{chore["name"]}" daily penalty — day {already_applied + 1} over threshold',
                    chore_name=chore["name"],
                )

    def _is_due_on_date(self, chore: dict, check_date: date) -> bool:
        """Return True if this chore should generate a task instance on check_date."""
        rec    = chore.get("recurrence", {})
        r_type = rec.get("type", RECURRENCE_DAILY)

        if r_type == RECURRENCE_DAILY:
            # Optional day filter — if set, only generate on those weekdays
            day_filter = rec.get("day_filter", [])
            if day_filter:
                return check_date.weekday() in day_filter
            return True

        if r_type == RECURRENCE_WEEKLY:
            weekdays = rec.get("weekdays", [])
            if not weekdays:
                return False
            return check_date.weekday() in weekdays

        if r_type == RECURRENCE_EVERY_N_DAYS:
            n = rec.get("interval", 1)
            created = date.fromisoformat(chore["created_at"][:10])
            return (check_date - created).days % n == 0

        if r_type == RECURRENCE_EVERY_N_WEEKS:
            n = rec.get("interval", 1) * 7
            created = date.fromisoformat(chore["created_at"][:10])
            return (check_date - created).days % n == 0

        if r_type == RECURRENCE_MONTHLY_ON_DATE:
            return check_date.day == rec.get("day_of_month", 1)

        return False

    async def _async_expire_tasks(self, today: date) -> None:
        """
        Auto-expire pending one-time task instances that have passed their
        deadline (created_at + expires_after_days).

        Rules:
          - Recurring chores: never expired here (tick handles them).
          - One-time assigned tasks: expire with penalty if penalty_enabled.
          - Claimable bonus tasks: expire silently — no penalty (nobody claimed it).
        """
        for instance in self.task_instances:
            if instance["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue

            chore = self.get_chore(instance["chore_id"])
            if not chore:
                continue

            # Only process one-time recurrence or claimable
            r_type      = chore["recurrence"].get("type", RECURRENCE_DAILY)
            is_one_time = r_type == RECURRENCE_ONE_TIME
            is_claimable = chore.get("chore_type") == CHORE_TYPE_CLAIMABLE
            if not (is_one_time or is_claimable):
                continue

            expires_after = chore.get("expires_after_days")
            if not expires_after:
                continue

            created  = date.fromisoformat(instance["created_at"][:10])
            age_days = (today - created).days
            if age_days < expires_after:
                continue

            # Mark expired / skipped
            instance["status"]      = STATUS_SKIPPED
            instance["approved_at"] = _now_iso()
            instance["approved_by"] = "system"

            if is_claimable:
                # No penalty for unclaimed bonus tasks
                self._append_history(
                    event_type=HISTORY_TASK_SKIPPED,
                    person_id=None,
                    reference_id=instance["id"],
                    note=f'"{chore["name"]}" claimable task expired unclaimed',
                )
            else:
                # One-time assigned task — apply penalty if configured and not paused.
                pid = instance.get("assigned_to")
                if pid and chore.get("penalty_enabled") and chore.get("penalty_points", 0) > 0:
                    if self.is_penalty_paused_for(pid):
                        # Penalties paused for this person — expire silently
                        _LOGGER.debug(
                            "Family Hub: expiry penalty suppressed for %s (paused) — chore %s",
                            pid, chore["name"],
                        )
                        self._append_history(
                            event_type=HISTORY_TASK_SKIPPED,
                            person_id=pid,
                            reference_id=instance["id"],
                            note=f'"{chore["name"]}" one-time task expired — penalty paused',
                        )
                    else:
                        penalty = chore["penalty_points"]
                        instance["penalty_applied"] = penalty
                        person = self.get_person(pid)
                        if person:
                            person["points_balance"] = max(0, person.get("points_balance", 0) - penalty)
                            self._append_history(
                                event_type=HISTORY_TASK_SKIPPED,
                                person_id=pid,
                                reference_id=instance["id"],
                                points_delta=-penalty,
                                balance_after=person["points_balance"],
                                note=f'"{chore["name"]}" one-time task expired — {penalty}pt penalty applied',
                            )
                else:
                    self._append_history(
                        event_type=HISTORY_TASK_SKIPPED,
                        person_id=pid,
                        reference_id=instance["id"],
                        note=f'"{chore["name"]}" one-time task expired',
                    )

    def _trim_history(self, today: date) -> None:
        """
        Remove history entries older than HISTORY_RETENTION_DAYS.
        Called once per daily tick to keep the data file size bounded.
        Entries without a parseable timestamp are preserved (defensive).
        """
        cutoff = (today - timedelta(days=HISTORY_RETENTION_DAYS)).isoformat()
        before = len(self._data["history"])
        self._data["history"] = [
            e for e in self._data["history"]
            if e.get("timestamp", "9999")[:10] >= cutoff[:10]
        ]
        removed = before - len(self._data["history"])
        if removed:
            _LOGGER.debug(
                "Family Hub: trimmed %d history entries older than %d days",
                removed, HISTORY_RETENTION_DAYS,
            )

    def _trim_task_instances(self, today: date) -> None:
        """
        Remove terminal task instances (skipped/approved/denied/rejected/excused)
        whose due_date is older than TASK_INSTANCE_RETENTION_DAYS.
        Active instances (pending/claimed/pending_approval) are never pruned.
        Instances without a parseable due_date are preserved (defensive).
        """
        cutoff = (today - timedelta(days=TASK_INSTANCE_RETENTION_DAYS)).isoformat()
        before = len(self._data["task_instances"])
        self._data["task_instances"] = [
            t for t in self._data["task_instances"]
            if t["status"] in ACTIVE_STATUSES
            or t.get("due_date", "9999")[:10] >= cutoff[:10]
        ]
        removed = before - len(self._data["task_instances"])
        if removed:
            _LOGGER.debug(
                "Family Hub: pruned %d terminal task instances older than %d days",
                removed, TASK_INSTANCE_RETENTION_DAYS,
            )

    # ------------------------------------------------------------------
    # Store items
    # ------------------------------------------------------------------

    @property
    def store_items(self) -> list[dict]:
        return self._data.get("store_items", [])

    def get_store_item(self, item_id: str) -> dict | None:
        return next((i for i in self.store_items if i["id"] == item_id), None)

    def get_store_items_for_person(self, person_id: str) -> list[dict]:
        """Return common items + items where person_id is in person_ids list."""
        return [
            i for i in self.store_items
            if i.get("active", True) and (
                i.get("scope") == SCOPE_COMMON
                or (
                    i.get("scope") == SCOPE_PERSONAL
                    and person_id in (i.get("person_ids") or [])
                )
            )
        ]

    def _dollar_to_points(self, dollar_value: float) -> int:
        return round(dollar_value * self.points_per_dollar)

    async def async_add_store_item(
        self,
        name: str,
        dollar_value: float,
        scope: str = SCOPE_COMMON,
        person_ids: list[str] | None = None,
        description: str = "",
    ) -> dict:
        item = {
            "id": _new_id(),
            "name": name,
            "description": description,
            "dollar_value": dollar_value,
            "points_cost": self._dollar_to_points(dollar_value),
            "scope": scope,
            "person_ids": person_ids if scope == SCOPE_PERSONAL else [],
            "active": True,
            "created_at": _now_iso(),
        }
        self._data["store_items"].append(item)
        await self.async_save()
        return item

    async def async_update_store_item(self, item_id: str, **kwargs: Any) -> dict | None:
        item = self.get_store_item(item_id)
        if not item:
            return None
        allowed = {"name", "description", "dollar_value", "scope", "person_ids", "active"}
        for key, val in kwargs.items():
            if key in allowed:
                item[key] = val
        if "dollar_value" in kwargs:
            item["points_cost"] = self._dollar_to_points(item["dollar_value"])
        await self.async_save()
        return item

    async def async_delete_store_item(self, item_id: str) -> bool:
        item = self.get_store_item(item_id)
        if not item:
            return False
        item["active"] = False
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Redemptions
    # ------------------------------------------------------------------

    @property
    def redemptions(self) -> list[dict]:
        return self._data.get("redemptions", [])

    def get_redemption(self, redemption_id: str) -> dict | None:
        return next((r for r in self.redemptions if r["id"] == redemption_id), None)

    def get_pending_redemptions(self) -> list[dict]:
        return [r for r in self.redemptions if r["status"] == REDEMPTION_PENDING]

    async def async_request_redemption(self, person_id: str, item_id: str) -> dict | None:
        person = self.get_person(person_id)
        item   = self.get_store_item(item_id)
        if not person or not item:
            return None
        points_cost = item["points_cost"]
        if person["points_balance"] < points_cost:
            _LOGGER.warning("Family Hub: insufficient points for redemption")
            return None
        redemption = {
            "id": _new_id(),
            "store_item_id": item_id,
            "person_id": person_id,
            "points_cost": points_cost,
            "item_name": item["name"],
            "status": REDEMPTION_PENDING,
            "requested_at": _now_iso(),
            "resolved_at": None,
            "resolved_by": None,
            "note": "",
        }
        self._data["redemptions"].append(redemption)
        self._append_history(
            event_type=HISTORY_REDEMPTION_REQUESTED,
            person_id=person_id,
            reference_id=redemption["id"],
            note=f'{person["name"]} requested "{item["name"]}" ({points_cost}pts)',
        )
        await self.async_save()
        return redemption

    async def async_approve_redemption(
        self, redemption_id: str, approved_by: str
    ) -> dict | None:
        redemption = self.get_redemption(redemption_id)
        if not redemption or redemption["status"] != REDEMPTION_PENDING:
            return None
        person = self.get_person(redemption["person_id"])
        if not person:
            return None
        redemption["status"]      = REDEMPTION_APPROVED
        redemption["resolved_at"] = _now_iso()
        redemption["resolved_by"] = approved_by
        await self.async_deduct_points(
            redemption["person_id"],
            redemption["points_cost"],
            redemption_id,
            f'Redeemed "{redemption["item_name"]}"',
        )
        self._append_history(
            event_type=HISTORY_REDEMPTION_APPROVED,
            person_id=redemption["person_id"],
            reference_id=redemption_id,
            points_delta=-redemption["points_cost"],
            balance_after=person.get("points_balance", 0),
            note=f"Approved by {approved_by}",
        )
        await self.async_save()
        return redemption

    async def async_decline_redemption(
        self, redemption_id: str, declined_by: str, reason: str = ""
    ) -> dict | None:
        redemption = self.get_redemption(redemption_id)
        if not redemption or redemption["status"] != REDEMPTION_PENDING:
            return None
        redemption["status"]      = REDEMPTION_DECLINED
        redemption["resolved_at"] = _now_iso()
        redemption["resolved_by"] = declined_by
        redemption["note"]        = reason
        self._append_history(
            event_type=HISTORY_REDEMPTION_DECLINED,
            person_id=redemption["person_id"],
            reference_id=redemption_id,
            note=f"Declined by {declined_by}. {reason}".strip(),
        )
        await self.async_save()
        return redemption

    # ------------------------------------------------------------------
    # History
    # ------------------------------------------------------------------

    @property
    def history(self) -> list[dict]:
        return self._data.get("history", [])

    def get_history(self, person_id: str | None = None, limit: int = 100) -> list[dict]:
        entries = sorted(self.history, key=lambda e: e["timestamp"], reverse=True)
        if person_id:
            entries = [e for e in entries if e.get("person_id") == person_id]
        return entries[:limit]

    def get_history_for_card(self, person_id: str | None = None, limit: int = 150) -> list[dict]:
        """
        Enriched, collapsed history log for the card UI.

        One row is emitted per task instance (collapsing task_completed +
        task_approved + points_awarded into a single evolving row). The row
        reflects the current instance status so it naturally "updates" as the
        instance moves through states (submitted → approved).

        Rejected instances are suppressed when the same chore + person later
        has an approved/self-reported instance (kid retried and succeeded).

        Skipped entries carry a `skipped_date` field (ISO date string) so the
        frontend can roll up all skipped chores from the same day into one
        collapsible group.

        Reversible action hints:
          "excuse"        — skipped with penalty, can be excused
          "mark_complete" — excused instance, can be retroactively completed
          "reject"        — approved/self-reported, points can be clawed back
          None            — no further parent action available
        """
        entries = sorted(self.history, key=lambda e: e["timestamp"], reverse=True)
        if person_id:
            entries = [e for e in entries if e.get("person_id") == person_id]

        # Build (chore_id, person_id) pairs with any approved/self-reported instance
        # so we can suppress rejected entries superseded by a later success.
        approved_chore_person: set[tuple] = set()
        for inst in self.task_instances:
            if inst["status"] in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
                pid = inst.get("completed_by") or inst.get("assigned_to")
                if pid:
                    approved_chore_person.add((inst["chore_id"], pid))

        result: list[dict] = []
        seen_instance_ids: set[str] = set()

        _task_event_types = {
            HISTORY_TASK_COMPLETED, HISTORY_TASK_APPROVED, HISTORY_TASK_SKIPPED,
            HISTORY_TASK_EXCUSED, HISTORY_TASK_REJECTED, HISTORY_TASK_DENIED,
            HISTORY_TASK_MARKED_COMPLETE,
        }

        for e in entries:
            ref_id   = e.get("reference_id", "")
            instance = self.get_task_instance(ref_id)

            if instance:
                # Deduplicate — only emit one row per task instance (collapse
                # task_completed + task_approved + points_awarded into one).
                if ref_id in seen_instance_ids:
                    continue
                seen_instance_ids.add(ref_id)

                inst_status = instance["status"]

                # Suppress rejected or denied instances where a later success exists
                # for the same chore + person (kid retried and passed).
                if inst_status in (STATUS_REJECTED, STATUS_DENIED):
                    pid = instance.get("completed_by") or instance.get("assigned_to")
                    if (instance["chore_id"], pid) in approved_chore_person:
                        continue

                person     = self.get_person(e.get("person_id", "")) if e.get("person_id") else None
                chore      = self.get_chore(instance["chore_id"])
                chore_name = chore["name"] if chore else e.get("chore_name", "")

                # Map current instance status → canonical history display type.
                display_type = {
                    STATUS_APPROVED:         HISTORY_TASK_APPROVED,
                    STATUS_SELF_REPORTED:    HISTORY_TASK_COMPLETED,
                    STATUS_PENDING_APPROVAL: "pending_approval",
                    STATUS_SKIPPED:          HISTORY_TASK_SKIPPED,
                    STATUS_EXCUSED:          HISTORY_TASK_EXCUSED,
                    STATUS_REJECTED:         HISTORY_TASK_REJECTED,
                    STATUS_DENIED:           HISTORY_TASK_DENIED,
                }.get(inst_status, e["type"])

                # Net points effect of this instance.
                pts = 0
                if inst_status in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
                    pts = instance.get("points_awarded", 0)
                elif inst_status == STATUS_SKIPPED:
                    pts = -instance.get("penalty_applied", 0)
                elif inst_status == STATUS_REJECTED:
                    pts = -instance.get("points_awarded", 0)

                # Reversible action available to a parent.
                reversible = None
                if inst_status == STATUS_SKIPPED:
                    if instance.get("penalty_applied", 0) > 0:
                        reversible = "excuse"
                elif inst_status == STATUS_EXCUSED:
                    reversible = "mark_complete"
                elif inst_status in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
                    reversible = "reject"

                row: dict = {
                    "history_id":      e["id"],
                    "type":            display_type,
                    "person_id":       e.get("person_id"),
                    "person_name":     person["name"] if person else None,
                    "person_color":    person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                    "reference_id":    ref_id,
                    "chore_name":      chore_name,
                    "points_delta":    pts,
                    "balance_after":   e.get("balance_after", 0),
                    "timestamp":       e["timestamp"],
                    "note":            e.get("note", ""),
                    "reversible":      reversible,
                    "instance_status": inst_status,
                }

                # skipped_date lets the frontend group all skipped chores from
                # the same day into one collapsible entry with a total penalty.
                if inst_status == STATUS_SKIPPED:
                    row["skipped_date"] = e["timestamp"][:10]

                result.append(row)

            else:
                # No matching task instance. Skip stale task-type events whose
                # instance has been pruned. Keep non-task events (bonus points,
                # person/redemption events, etc.).
                if e["type"] in _task_event_types:
                    continue

                person = self.get_person(e.get("person_id", "")) if e.get("person_id") else None
                result.append({
                    "history_id":      e["id"],
                    "type":            e["type"],
                    "person_id":       e.get("person_id"),
                    "person_name":     person["name"] if person else None,
                    "person_color":    person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                    "reference_id":    ref_id,
                    "chore_name":      e.get("chore_name", ""),
                    "points_delta":    e.get("points_delta", 0),
                    "balance_after":   e.get("balance_after", 0),
                    "timestamp":       e["timestamp"],
                    "note":            e.get("note", ""),
                    "reversible":      None,
                    "instance_status": None,
                })

        return result[:limit]

    def _append_history(
        self,
        event_type: str,
        reference_id: str,
        person_id: str | None = None,
        points_delta: int = 0,
        balance_after: int = 0,
        note: str = "",
        chore_name: str = "",
    ) -> None:
        self._data["history"].append({
            "id":           _new_id(),
            "type":         event_type,
            "person_id":    person_id,
            "reference_id": reference_id,
            "points_delta": points_delta,
            "balance_after":balance_after,
            "timestamp":    _now_iso(),
            "note":         note,
            "chore_name":   chore_name,  # v0.4.0: populated for task events
        })

    # ------------------------------------------------------------------
    # v0.4.0 — Admin correction services
    # ------------------------------------------------------------------

    async def async_excuse_task(
        self, instance_id: str, excused_by: str, reason: str = ""
    ) -> dict | None:
        """
        Reverse the penalty on a skipped task instance (sick day, sleep-over, etc.).
        Restores penalty points to the person's balance and marks the instance
        STATUS_EXCUSED. Cannot be applied to instances that weren't skipped.
        """
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_SKIPPED:
            _LOGGER.warning("Family Hub: excuse_task — instance %s not found or not skipped", instance_id)
            return None

        chore  = self.get_chore(instance["chore_id"])
        chore_name = chore["name"] if chore else "unknown"
        pid    = instance.get("assigned_to") or instance.get("completed_by")
        penalty= instance.get("penalty_applied", 0)

        instance["status"] = STATUS_EXCUSED
        instance["excused_by"]  = excused_by
        instance["excused_at"]  = _now_iso()
        instance["excuse_reason"] = reason

        if penalty > 0 and pid:
            person = self.get_person(pid)
            if person:
                person["points_balance"] = person.get("points_balance", 0) + penalty
                # Lifetime total not adjusted — excused penalties never earned points
                self._append_history(
                    event_type=HISTORY_TASK_EXCUSED,
                    person_id=pid,
                    reference_id=instance_id,
                    points_delta=penalty,
                    balance_after=person["points_balance"],
                    note=f'"{chore_name}" penalty reversed — {reason}'.rstrip(" —"),
                    chore_name=chore_name,
                )
        else:
            self._append_history(
                event_type=HISTORY_TASK_EXCUSED,
                person_id=pid,
                reference_id=instance_id,
                note=f'"{chore_name}" excused — {reason}'.rstrip(" —"),
                chore_name=chore_name,
            )

        await self.async_save()
        return instance

    async def async_reject_task(
        self, instance_id: str, rejected_by: str, reason: str = ""
    ) -> dict | None:
        """
        Claw back points for a task that was already approved or self-reported.
        Deducts points_awarded from the person's spendable balance and marks
        the instance STATUS_REJECTED. Lifetime total is not changed.
        """
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] not in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
            _LOGGER.warning(
                "Family Hub: reject_task — instance %s not found or not in approved/self-reported state",
                instance_id,
            )
            return None

        chore     = self.get_chore(instance["chore_id"])
        chore_name= chore["name"] if chore else "unknown"
        pid       = instance.get("completed_by")
        points    = instance.get("points_awarded", 0)

        instance["status"]      = STATUS_REJECTED
        instance["rejected_by"] = rejected_by
        instance["rejected_at"] = _now_iso()
        instance["reject_reason"] = reason

        if points > 0 and pid:
            person = self.get_person(pid)
            if person:
                person["points_balance"] = max(0, person.get("points_balance", 0) - points)
                self._append_history(
                    event_type=HISTORY_TASK_REJECTED,
                    person_id=pid,
                    reference_id=instance_id,
                    points_delta=-points,
                    balance_after=person["points_balance"],
                    note=f'"{chore_name}" rejected — {reason}'.rstrip(" —"),
                    chore_name=chore_name,
                )
        else:
            self._append_history(
                event_type=HISTORY_TASK_REJECTED,
                person_id=pid,
                reference_id=instance_id,
                note=f'"{chore_name}" rejected — {reason}'.rstrip(" —"),
                chore_name=chore_name,
            )

        # Same-day retry: if the task was rejected on the same day it was due,
        # put it back as a fresh pending instance so the kid can try again.
        # If rejected the next day the daily tick will already have generated
        # today's instance, so no new instance is needed.
        today_str = date.today().isoformat()
        chore_r_type = chore["recurrence"].get("type") if chore else RECURRENCE_ONE_TIME
        is_claimable = chore and chore.get("chore_type") == CHORE_TYPE_CLAIMABLE
        if (not is_claimable
                and chore_r_type != RECURRENCE_ONE_TIME
                and instance.get("due_date") == today_str
                and pid):
            await self._async_create_task_instance(chore, date.today(), person_id=pid)
            _LOGGER.info(
                "Family Hub: reject_task — created same-day retry instance for %s on chore %s",
                pid, chore_name,
            )

        # Claimable tasks: always recreate the shared pending instance so anyone
        # can claim the task again (regardless of recurrence type or due date).
        if is_claimable:
            already_available = any(
                t for t in self.task_instances
                if t["chore_id"] == chore["id"]
                and t["status"] in [STATUS_PENDING, STATUS_CLAIMED]
            )
            if not already_available:
                await self._async_create_task_instance(chore, date.today(), person_id=None)
                _LOGGER.info(
                    "Family Hub: reject_task — recreated shared claimable instance for chore %s",
                    chore_name,
                )

        await self.async_save()
        return instance

    async def async_mark_task_complete(
        self, instance_id: str, marked_by: str, reason: str = ""
    ) -> dict | None:
        """
        Retroactively mark a skipped or excused task as completed by a parent.
        Awards the chore's points, reverses any penalty that was applied, and
        marks the instance STATUS_APPROVED.
        """
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] not in [STATUS_SKIPPED, STATUS_EXCUSED]:
            _LOGGER.warning(
                "Family Hub: mark_task_complete — instance %s not found or not skipped/excused",
                instance_id,
            )
            return None

        chore     = self.get_chore(instance["chore_id"])
        if not chore:
            return None
        chore_name= chore["name"]
        pid       = instance.get("assigned_to") or instance.get("completed_by")
        points    = chore.get("points", 0)
        penalty   = instance.get("penalty_applied", 0)

        instance["status"]        = STATUS_APPROVED
        instance["approved_at"]   = _now_iso()
        instance["approved_by"]   = marked_by
        instance["points_awarded"] = points
        instance["completed_by"]  = instance.get("completed_by") or marked_by
        instance["completed_at"]  = instance.get("completed_at") or _now_iso()

        total_awarded = points + penalty  # restore penalty AND award points
        if total_awarded > 0 and pid:
            person = self.get_person(pid)
            if person:
                person["points_balance"]  = person.get("points_balance", 0) + total_awarded
                person["points_lifetime"] = person.get("points_lifetime", 0) + points
                self._append_history(
                    event_type=HISTORY_TASK_MARKED_COMPLETE,
                    person_id=pid,
                    reference_id=instance_id,
                    points_delta=total_awarded,
                    balance_after=person["points_balance"],
                    note=f'"{chore_name}" retroactively marked complete — {reason}'.rstrip(" —"),
                    chore_name=chore_name,
                )
        else:
            self._append_history(
                event_type=HISTORY_TASK_MARKED_COMPLETE,
                person_id=pid,
                reference_id=instance_id,
                note=f'"{chore_name}" retroactively marked complete — {reason}'.rstrip(" —"),
                chore_name=chore_name,
            )

        await self.async_save()
        return instance

    async def async_force_daily_tick(self) -> None:
        """
        Force the daily tick to run immediately, regardless of last_tick_date.
        Resets last_tick_date to yesterday so the full today tick fires.
        Useful for admin/debug and for cleaning up stale instances after deploy.
        """
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        self._data["settings"]["last_tick_date"] = yesterday
        _LOGGER.info("Family Hub: force_daily_tick called — running tick now")
        await self.async_daily_tick()

    async def async_rebuild_data(self) -> dict:
        """
        Heavy-lift data cleanup, run on demand from the Admin settings UI.

        Steps:
          1. Re-run _migrate_chore on every chore (idempotent; catches anything
             that snuck in after the initial load-time migration).
          2. Remove people records with blank id (orphans).
          3. Remove ghost task instances (assigned_to == "").
          4. Remove orphaned task instances whose chore no longer exists.
          5. Remove duplicate pending instances per (chore_id, assigned_to, due_date).
          6. Prune terminal instances and history (same as daily tick).
          7. Save and return a summary dict for the caller to surface as a notification.
        """
        today = date.today()
        summary: dict[str, int] = {}

        # Step 1: re-run chore + instance migration (idempotent)
        self._data["chores"]         = [_migrate_chore(c)         for c in self._data.get("chores", [])]
        self._data["task_instances"] = [_migrate_task_instance(t) for t in self._data.get("task_instances", [])]

        # Step 2: orphan people (blank id)
        before = len(self._data["people"])
        self._data["people"] = [p for p in self._data["people"] if p.get("id")]
        summary["orphan_people_removed"] = before - len(self._data["people"])

        # Step 3: ghost task instances (assigned_to == "")
        before = len(self._data["task_instances"])
        self._data["task_instances"] = [
            t for t in self._data["task_instances"] if t.get("assigned_to") != ""
        ]
        summary["ghost_instances_removed"] = before - len(self._data["task_instances"])

        # Step 4: orphaned instances (chore_id not in any active chore)
        active_chore_ids = {c["id"] for c in self._data.get("chores", []) if c.get("active", True)}
        before = len(self._data["task_instances"])
        self._data["task_instances"] = [
            t for t in self._data["task_instances"]
            if t["status"] in ACTIVE_STATUSES or t.get("chore_id") in active_chore_ids
        ]
        summary["orphaned_instances_removed"] = before - len(self._data["task_instances"])

        # Step 5: duplicate active instances per (chore_id, assigned_to, due_date)
        seen: set[tuple] = set()
        deduped: list[dict] = []
        dupe_count = 0
        for t in self._data["task_instances"]:
            if t["status"] not in ACTIVE_STATUSES:
                deduped.append(t)
                continue
            key = (t["chore_id"], t.get("assigned_to"), t.get("due_date"))
            if key in seen:
                dupe_count += 1
            else:
                seen.add(key)
                deduped.append(t)
        self._data["task_instances"] = deduped
        summary["duplicate_instances_removed"] = dupe_count

        # Step 6: prune old terminal instances and history
        old_inst = len(self._data["task_instances"])
        old_hist = len(self._data["history"])
        self._trim_task_instances(today)
        self._trim_history(today)
        summary["old_instances_pruned"] = old_inst - len(self._data["task_instances"])
        summary["old_history_pruned"]   = old_hist - len(self._data["history"])

        await self.async_save()
        _LOGGER.info("Family Hub: rebuild_data complete — %s", summary)
        return summary

    # ------------------------------------------------------------------
    # Summary / coordinator
    # ------------------------------------------------------------------

    def get_summary(self) -> dict:
        return {
            "family_name":          self.family_name,
            "points_per_dollar":    self.points_per_dollar,
            "people":               self.people,
            "tasks_due_today":      len([t for t in self.task_instances if t["due_date"] == _today_str() and t["status"] in ACTIVE_STATUSES]),
            "tasks_overdue":        len([t for t in self.task_instances if t["due_date"] < _today_str()  and t["status"] in ACTIVE_STATUSES]),
            "pending_approvals":    len(self.get_pending_approvals()),
            "pending_redemptions":  len(self.get_pending_redemptions()),
            "claimable_tasks":      len(self.get_claimable_tasks()),
            "active_chores":        len(self.get_active_chores()),
        }

    # ------------------------------------------------------------------
    # Card data helpers
    # ------------------------------------------------------------------

    def get_tasks_for_card(self, person_id: str) -> dict:
        """
        Return due_today, overdue, and pending_approval task lists for one person.

        v0.4.1: row dict now includes chore_type and expires_after_days so the
        card can identify reminders via t.chore_type === "reminder" rather than
        the brittle 0-pts/no-penalty heuristic. is_one_time is kept for backward
        compat with any existing card logic that reads it.
        """
        today     = date.today()
        today_str = today.isoformat()
        due_today: list[dict] = []
        overdue:   list[dict] = []

        for t in self.task_instances:
            if t.get("assigned_to") != person_id:
                continue
            if t["status"] not in ACTIVE_STATUSES:
                continue
            chore = self.get_chore(t["chore_id"])
            if not chore:
                continue
            # Maintenance items belong on the maintenance card
            if self._chore_is_maintenance(chore):
                continue

            threshold = chore.get("daily_penalty_after_days")
            if threshold and chore.get("penalty_enabled") and chore.get("penalty_points", 0):
                try:
                    due_d    = date.fromisoformat(t["due_date"])
                    age_days = (today - due_d).days
                    daily_penalty_firing = age_days > threshold
                except (ValueError, KeyError):
                    daily_penalty_firing = False
            else:
                daily_penalty_firing = False

            row = {
                "task_id":               t["id"],
                "chore_id":              t["chore_id"],
                "name":                  chore["name"],
                "description":           chore.get("description", ""),
                "icon":                  chore.get("icon", ""),
                "points":                chore.get("points", 0),
                "due_date":              t["due_date"],
                "status":                t["status"],
                "chore_type":            chore.get("chore_type", CHORE_TYPE_ASSIGNED),
                "category_label":        chore.get("category_label", ""),
                "penalty_enabled":       chore.get("penalty_enabled", False),
                "penalty_points":        chore.get("penalty_points", 0),
                "daily_penalty_after_days": threshold,
                "daily_penalty_firing":  daily_penalty_firing,
                "expires_after_days":    chore.get("expires_after_days"),
                "is_one_time":           chore["recurrence"].get("type") == RECURRENCE_ONE_TIME,
                "streak":                self._get_streak(person_id, t["chore_id"]),
            }

            if t["due_date"] == today_str:
                due_today.append(row)
            elif t["due_date"] < today_str:
                r_type     = chore["recurrence"].get("type", RECURRENCE_DAILY)
                day_filter = chore["recurrence"].get("day_filter", [])

                if r_type in (RECURRENCE_WEEKLY, RECURRENCE_EVERY_N_DAYS,
                              RECURRENCE_EVERY_N_WEEKS, RECURRENCE_MONTHLY_ON_DATE):
                    # Non-daily recurring chores: still "in play" until the next
                    # cycle replaces them. Expose reset info so the card shows
                    # "Resets [day]" instead of the misleading "due Nd ago" badge.
                    row["recurrence_type"]      = r_type
                    row["recurrence_weekdays"]  = chore["recurrence"].get("weekdays", [])
                    row["days_until_reset"]     = _days_until_reset(chore, today)
                    due_today.append(row)
                elif r_type == RECURRENCE_DAILY and day_filter and today.weekday() not in day_filter:
                    # Daily with day_filter on an off-day: hide it. The tick's
                    # cleanup pass will skip it with penalty on the next run.
                    continue
                else:
                    row["days_overdue"] = (today - date.fromisoformat(t["due_date"])).days
                    overdue.append(row)

        pending_approval = []
        for t in self.task_instances:
            if t.get("completed_by") != person_id:
                continue
            if t["status"] != STATUS_PENDING_APPROVAL:
                continue
            chore = self.get_chore(t["chore_id"])
            pending_approval.append({
                "task_id":      t["id"],
                "chore_id":     t["chore_id"],
                "name":         chore["name"] if chore else t["chore_id"],
                "description":  chore.get("description", "") if chore else "",
                "points":       chore.get("points", 0) if chore else 0,
                "completed_at": t.get("completed_at"),
                "status":       t["status"],
            })

        return {
            "due_today":        sorted(due_today, key=lambda x: x["name"]),
            "overdue":          sorted(overdue, key=lambda x: -x.get("days_overdue", 0)),
            "pending_approval": pending_approval,
        }

    def get_store_items_for_card(self, person_id: str) -> list[dict]:
        return [
            {
                "item_id":     i["id"],
                "name":        i["name"],
                "description": i.get("description", ""),
                "dollar_value":i.get("dollar_value", 0),
                "points_cost": i.get("points_cost", 0),
                "scope":       i.get("scope"),
                "person_ids":  i.get("person_ids", []),
            }
            for i in self.get_store_items_for_person(person_id)
        ]

    def get_approval_queue_for_card(self) -> list[dict]:
        queue = []
        for t in self.get_pending_approvals():
            chore  = self.get_chore(t["chore_id"])
            person = self.get_person(t.get("completed_by", ""))
            queue.append({
                "task_id":      t["id"],
                "chore_name":   chore["name"] if chore else t["chore_id"],
                "chore_points": chore.get("points", 0) if chore else 0,
                "person_id":    t.get("completed_by"),
                "person_name":  person["name"] if person else "Unknown",
                "person_color": person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "completed_at": t.get("completed_at"),
            })
        return sorted(queue, key=lambda x: x.get("completed_at") or "")

    def get_redemption_queue_for_card(self) -> list[dict]:
        queue = []
        for r in self.get_pending_redemptions():
            person = self.get_person(r["person_id"])
            queue.append({
                "redemption_id": r["id"],
                "item_name":     r["item_name"],
                "person_id":     r["person_id"],
                "person_name":   person["name"] if person else "Unknown",
                "person_color":  person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "points_cost":   r["points_cost"],
                "requested_at":  r.get("requested_at"),
            })
        return sorted(queue, key=lambda x: x.get("requested_at") or "")

    def get_maintenance_items_for_card(self) -> list[dict]:
        today = date.today()
        items = []
        for task in self.task_instances:
            if task["status"] not in ACTIVE_STATUSES:
                continue
            chore = self.get_chore(task["chore_id"])
            if not chore:
                continue
            if not self._chore_is_maintenance(chore):
                continue
            due_date   = date.fromisoformat(task["due_date"])
            days_delta = (due_date - today).days
            assigned   = task.get("assigned_to")
            person     = self.get_person(assigned) if assigned else None
            items.append({
                "task_id":      task["id"],
                "chore_id":     task["chore_id"],
                "name":         chore["name"],
                "description":  chore.get("description", ""),
                "category_label": chore.get("category_label", ""),
                "due_date":     task["due_date"],
                "days_delta":   days_delta,
                "assigned_to":  assigned,
                "person_name":  person["name"] if person else None,
                "person_color": person.get("avatar_color", "#7F77DD") if person else None,
            })
        return sorted(items, key=lambda x: x["days_delta"])

    def get_claimable_tasks_for_card(self) -> list[dict]:
        items = []
        for task in self.get_claimable_tasks():
            chore = self.get_chore(task["chore_id"])
            if not chore:
                continue
            subtype   = chore.get("claimable_subtype", CLAIMABLE_SUBTYPE_FCFS)
            max_c     = chore.get("max_claimants", 2)
            claim_cnt = task.get("claim_count", 0)
            pts_mode  = chore.get("multi_claim_points_mode", MULTI_CLAIM_POINTS_FULL)
            pts       = chore.get("points", 0)
            if subtype == CLAIMABLE_SUBTYPE_MULTI and pts_mode == MULTI_CLAIM_POINTS_SPLIT:
                pts_display = math.ceil(pts / max_c) if pts and max_c else pts
            else:
                pts_display = pts
            items.append({
                "task_id":               task["id"],
                "name":                  chore["name"],
                "description":           chore.get("description", ""),
                "points":                pts_display,
                "due_date":              task["due_date"],
                "claimable_subtype":     subtype,
                "max_claimants":         max_c,
                "claim_count":           claim_cnt,
                "slots_remaining":       max(0, max_c - claim_cnt) if subtype == CLAIMABLE_SUBTYPE_MULTI else 1,
                "multi_claim_points_mode": pts_mode,
            })
        return items

    def get_all_tasks_for_command_center(self) -> list[dict]:
        """
        All active non-maintenance assigned tasks for all people.
        Sorted: most overdue first, then today. Excludes maintenance and
        unassigned claimable tasks (those appear in their own section).

        v0.4.1 fix: also excludes instances with assigned_to=None that belong
        to non-claimable chores. These are ghost instances created when a chore
        was saved with an empty assigned_to list. They have no person to display
        on the command center and should not appear there.
        """
        today     = date.today()
        today_str = today.isoformat()
        items     = []

        for task in self.task_instances:
            if task["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue
            chore = self.get_chore(task["chore_id"])
            if not chore:
                continue
            if self._chore_is_maintenance(chore):
                continue

            chore_type = chore.get("chore_type", CHORE_TYPE_ASSIGNED)
            assigned   = task.get("assigned_to")

            # Skip unassigned claimable instances (rendered in their own section)
            if chore_type == CHORE_TYPE_CLAIMABLE and assigned is None:
                continue

            # Skip unowned non-claimable instances — these are ghost instances
            # from chores that were created/updated with no assigned_to. They
            # have no person to display and should not appear on the command center.
            if chore_type != CHORE_TYPE_CLAIMABLE and assigned is None:
                continue

            person     = self.get_person(assigned) if assigned else None
            due_date   = date.fromisoformat(task["due_date"])
            days_delta = (due_date - today).days

            # For non-daily recurring chores (weekly, n-days, n-weeks, monthly),
            # past-due instances are still in play until the next cycle replaces
            # them. Treat them as days_delta=0 ("today") on the command center so
            # they do not appear in the "Overdue" section. days_late is set so
            # the card can show a soft "Nd late" indicator.
            recurrence_type     = chore["recurrence"].get("type", RECURRENCE_DAILY)
            recurrence_weekdays = chore["recurrence"].get("weekdays", [])
            days_until_reset    = 0
            r_type              = recurrence_type
            if days_delta < 0 and r_type in (RECURRENCE_WEEKLY, RECURRENCE_EVERY_N_DAYS,
                                              RECURRENCE_EVERY_N_WEEKS, RECURRENCE_MONTHLY_ON_DATE):
                days_until_reset = _days_until_reset(chore, today)
                days_delta       = 0  # treat as today

            dp_threshold = chore.get("daily_penalty_after_days")
            dp_firing    = bool(
                dp_threshold
                and chore.get("penalty_enabled")
                and chore.get("penalty_points", 0)
                and (today - due_date).days > dp_threshold
            )

            items.append({
                "task_id":                 task["id"],
                "chore_id":                task["chore_id"],
                "name":                    chore["name"],
                "description":             chore.get("description", ""),
                "icon":                    chore.get("icon", ""),
                "points":                  chore.get("points", 0),
                "due_date":                task["due_date"],
                "days_delta":              days_delta,
                "recurrence_type":         recurrence_type,
                "recurrence_weekdays":     recurrence_weekdays,
                "days_until_reset":        days_until_reset,
                "status":                  task["status"],
                "category_label":          chore.get("category_label", ""),
                "assigned_to":             assigned,
                "person_name":             person["name"] if person else None,
                "person_color":            person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "approval_required":       chore.get("approval_required", True),
                "penalty_enabled":         chore.get("penalty_enabled", False),
                "penalty_points":          chore.get("penalty_points", 0),
                "daily_penalty_after_days": dp_threshold,
                "daily_penalty_firing":    dp_firing,
                "streak":                  self._get_streak(assigned, task["chore_id"]) if assigned else 0,
                "streak_milestone":        chore.get("streak_milestone", 0),
            })

        # Show today + overdue only on command center
        return sorted(
            [i for i in items if i["days_delta"] <= 0],
            key=lambda x: x["days_delta"],
        )

    def get_active_chores_for_card(self) -> list[dict]:
        """
        All active non-maintenance, non-one-time chores for the admin chore list.
        Sorted by sort_order then name.
        """
        result = []
        for c in self.get_active_chores():
            if self._chore_is_maintenance(c):
                continue
            if c["recurrence"].get("type") == RECURRENCE_ONE_TIME:
                continue
            assigned_names = []
            for pid in c.get("assigned_to", []):
                p = self.get_person(pid)
                if p:
                    assigned_names.append(p["name"])
            result.append({
                "chore_id":               c["id"],
                "name":                   c["name"],
                "description":            c.get("description", ""),
                "icon":                   c.get("icon", ""),
                "chore_type":             c.get("chore_type", CHORE_TYPE_ASSIGNED),
                "category_label":         c.get("category_label", ""),
                "sort_order":             c.get("sort_order", 0),
                "assigned_to":            c.get("assigned_to", []),
                "assigned_names":         assigned_names,
                "points":                 c.get("points", 0),
                "approval_required":      c.get("approval_required", True),
                "penalty_enabled":        c.get("penalty_enabled", False),
                "penalty_points":         c.get("penalty_points", 0),
                "daily_penalty_after_days": c.get("daily_penalty_after_days"),
                "expires_after_days":     c.get("expires_after_days"),
                "claimable_subtype":      c.get("claimable_subtype", CLAIMABLE_SUBTYPE_FCFS),
                "max_claimants":          c.get("max_claimants", 2),
                "multi_claim_points_mode": c.get("multi_claim_points_mode", MULTI_CLAIM_POINTS_FULL),
                "recurrence":             c.get("recurrence", {}),
                "streak_milestone":       c.get("streak_milestone", 0),
                "streak_bonus_points":    c.get("streak_bonus_points", 0),
            })
        return sorted(result, key=lambda x: (x["sort_order"], x["name"]))

    # ------------------------------------------------------------------
    # Backup
    # ------------------------------------------------------------------

    async def async_export_backup(self, export_path: str) -> bool:
        def _write() -> None:
            os.makedirs(os.path.dirname(export_path), exist_ok=True)
            with open(export_path, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, ensure_ascii=False)

        try:
            await self._hass.async_add_executor_job(_write)
            _LOGGER.info("Family Hub: backup exported to %s", export_path)
            return True
        except OSError as err:
            _LOGGER.error("Family Hub: backup failed: %s", err)
            return False
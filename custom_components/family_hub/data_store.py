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
    STORAGE_FILE,
    STORAGE_VERSION,
)
from ._store_helpers import (
    _STORE_DOMAINS,
    _SAVE_DELAY_SECONDS,
    _now_iso,
    _today_str,
    _new_id,
    _empty_store,
    _migrate_chore,
    _migrate_store_item,
    _migrate_task_instance,
    _advance_renewal_date,
    _days_until_reset,
)
from .card_shaper_mixin import CardShaperMixin
from .tick_mixin import TickMixin

_LOGGER = logging.getLogger(__name__)




class FamilyHubDataStore(CardShaperMixin, TickMixin):
    """Manages reading and writing the Family Hub JSON data file."""

    def __init__(self, hass: HomeAssistant, storage_path: str) -> None:
        self._hass = hass
        # Legacy single-file path — now used ONLY to read/back-up the old file
        # during the one-time v0.7.0 P3 migration. Never written to after that.
        self._path = storage_path
        self._data: dict[str, Any] = {}
        # Serialises all mutations + saves so concurrent service calls don't race
        self._lock = asyncio.Lock()
        # v0.7.0 P2: monotonic mutation counter bumped on every save. Exposed on
        # the needs_attention sensor so the card knows when to refetch the
        # websocket model. In-memory only — resets to 0 on reload (the card
        # always fetches on first render regardless).
        self.data_rev = 0
        # v0.7.0 P3: per-domain HA Stores (debounced writes via async_delay_save).
        self._stores: dict[str, Store] = {
            domain: Store(hass, STORAGE_VERSION, f"{DOMAIN}_{domain}")
            for domain in _STORE_DOMAINS
        }

    # ------------------------------------------------------------------
    # Load / Save
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Load data into self._data, then run idempotent record migrations.

        v0.7.0 P3: prefers the per-domain multi-store layout; if no stores exist
        yet, performs a one-time migration from the legacy single file (which is
        only ever READ, never modified).
        """
        loaded: dict[str, Any] = {}
        found_any = False
        for domain, store in self._stores.items():
            data = await store.async_load()
            if data is not None:
                found_any = True
                loaded[domain] = data

        if found_any:
            self._data = self._merge_domains(loaded)
            _LOGGER.info("Family Hub: loaded v2 multi-store layout")
        else:
            self._data = await self._async_migrate_from_legacy()

        self._run_record_migrations()

    def _merge_domains(self, loaded: dict[str, dict]) -> dict:
        """Flatten the per-domain store payloads back into one merged self._data."""
        merged: dict[str, Any] = {}
        for data in loaded.values():
            if isinstance(data, dict):
                merged.update(data)
        return merged

    def _domain_slice(self, domain: str) -> dict:
        """Extract the top-level keys belonging to one domain. 'core' also absorbs
        any unmapped key, so nothing is ever dropped."""
        keys = _STORE_DOMAINS.get(domain, [])
        sliced = {k: self._data[k] for k in keys if k in self._data}
        if domain == "core":
            mapped = {k for ks in _STORE_DOMAINS.values() for k in ks}
            for k, v in self._data.items():
                if k not in mapped:
                    sliced[k] = v
        return sliced

    async def _async_migrate_from_legacy(self) -> dict:
        """One-time migration: read the legacy single file (READ-ONLY), write the
        v2 domain stores, verify by re-reading + comparing collection counts, and
        keep the legacy file as a backup. On a verify mismatch, remove the v2
        stores so the legacy file is re-read next load. Returns the in-memory data
        either way (so this session always runs on correct data)."""
        def _read_legacy():
            if not os.path.exists(self._path):
                return None
            try:
                with open(self._path, encoding="utf-8") as f:
                    return json.load(f)
            except (json.JSONDecodeError, OSError) as err:
                _LOGGER.error("Family Hub: failed to read legacy data file: %s", err)
                return "CORRUPT"

        legacy = await self._hass.async_add_executor_job(_read_legacy)

        if legacy is None:
            _LOGGER.info("Family Hub: no v2 stores and no legacy file — fresh install")
            return _empty_store()

        if legacy == "CORRUPT":
            def _backup_corrupt():
                try:
                    shutil.copy2(self._path, self._path + ".corrupt")
                except OSError:
                    pass
            await self._hass.async_add_executor_job(_backup_corrupt)
            _LOGGER.error("Family Hub: legacy file corrupt — starting fresh store")
            return _empty_store()

        # --- Real legacy data: migrate to the v2 stores ---
        _LOGGER.warning("Family Hub: migrating legacy single-file store → v2 multi-store layout")
        self._data = legacy  # set so _domain_slice() can read it during migration

        # 1. Back up the original (the original itself is NEVER modified).
        def _backup():
            bak = (self._path[:-5] if self._path.endswith(".json") else self._path) + ".v1.bak.json"
            try:
                shutil.copy2(self._path, bak)
                _LOGGER.warning("Family Hub: legacy file backed up to %s", bak)
            except OSError as err:
                _LOGGER.error("Family Hub: legacy backup failed: %s", err)
        await self._hass.async_add_executor_job(_backup)

        # Steps 2-3 are wrapped so ANY failure is non-fatal: we remove partial
        # stores and keep running on the legacy data in memory (the original file
        # is untouched), and the migration is retried on the next load.
        try:
            # 2. Write the domain stores immediately.
            for domain, store in self._stores.items():
                await store.async_save(self._domain_slice(domain))

            # 3. Verify: re-read + compare collection counts against the legacy file.
            verify_loaded = {}
            for domain, store in self._stores.items():
                v = await store.async_load()
                if v is not None:
                    verify_loaded[domain] = v
            merged = self._merge_domains(verify_loaded)
            check_keys = ("people", "chores", "task_instances", "store_items", "history",
                          "redemptions", "subscriptions", "group_reward_proposals")
            legacy_counts = {k: len(legacy.get(k, [])) for k in check_keys}
            merged_counts = {k: len(merged.get(k, [])) for k in check_keys}

            if legacy_counts == merged_counts:
                _LOGGER.warning(
                    "Family Hub: migration verified OK %s. Original kept as backup.",
                    legacy_counts,
                )
            else:
                raise ValueError(
                    f"verify count mismatch legacy={legacy_counts} v2={merged_counts}"
                )
        except Exception as err:  # noqa: BLE001
            _LOGGER.error(
                "Family Hub: migration FAILED (%s) — removing partial v2 stores and "
                "continuing on the legacy file; will retry on next load.", err,
            )
            for store in self._stores.values():
                try:
                    await store.async_remove()
                except Exception:  # noqa: BLE001
                    pass

        return legacy

    def _run_record_migrations(self) -> None:
        """Idempotent, forward-fill record migrations — safe to run on every load."""

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
            # v0.6.1: success-rate person streak — bonus for consecutive days at threshold%
            person.setdefault("completion_streak",          0)
            person.setdefault("completion_threshold_pct",   80)   # % of due chores done that day
            person.setdefault("completion_milestone",       7)    # bonus every N days (0 = off)
            person.setdefault("completion_bonus_points",    50)
            person.setdefault("last_completion_eval_date",  None) # ISO date string
            # v0.6.3: store goal — kid picks a store item to save toward. Card
            # surfaces a progress bar (balance / item.points_cost) on the rail
            # and store tab. Empty string = no goal.
            person.setdefault("goal_item_id",                "")
            # v0.6.3 item 7: streak freeze tokens — earned at completion-streak
            # milestones, auto-spent to protect the streak on a bad day.
            person.setdefault("streak_freezes_available",    0)

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

        # v0.6.3: back-fill store-item sort_order in creation order so the
        # drag-reorder math has unique starting positions to bisect.
        for idx, item in enumerate(self._data.get("store_items", [])):
            if item.get("sort_order", 0) == 0 and idx > 0:
                item["sort_order"] = (idx + 1) * 10

        # v0.6.3 item 13: ensure group_reward_proposals list exists
        self._data.setdefault("group_reward_proposals", [])

        # v0.6.5: ensure subscriptions list exists
        self._data.setdefault("subscriptions", [])

    async def async_save(self) -> None:
        """Persist data to the per-domain HA Stores (v0.7.0 P3).

        Writes are DEBOUNCED via async_delay_save, so a burst of rapid mutations
        (a kid tapping several chores) coalesces into a single write per store
        instead of rewriting the whole file each time. The data callbacks read
        self._data at flush time, so they always persist the latest state.
        """
        # Bump the mutation counter so the card knows the model changed.
        self.data_rev += 1
        for domain, store in self._stores.items():
            store.async_delay_save(
                (lambda d=domain: self._domain_slice(d)), _SAVE_DELAY_SECONDS
            )

    async def async_flush(self) -> None:
        """Force any pending debounced saves to disk immediately.

        Called on integration unload/reload so a debounced write in flight is not
        lost (HA already flushes Store delayed writes on full HA shutdown)."""
        for domain, store in self._stores.items():
            try:
                await store.async_save(self._domain_slice(domain))
            except Exception as err:  # noqa: BLE001
                _LOGGER.error("Family Hub: flush of '%s' store failed: %s", domain, err)

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
    def rank_ppd_ladder(self) -> list[float]:
        """Cents-per-point per rank index (rank 0 … N). Default 5-rung ladder."""
        return self.settings.get("rank_ppd_ladder", [3.0, 3.5, 4.0, 4.5, 5.0])

    def get_rank_cents_per_pt(self, rank_index: int) -> float:
        """Return ¢/point for rank_index, clamped to ladder bounds."""
        ladder = self.rank_ppd_ladder
        if not ladder:
            return 100.0 / self.points_per_dollar
        idx = max(0, min(int(rank_index), len(ladder) - 1))
        return ladder[idx]

    def get_rank_ppd(self, rank_index: int) -> float:
        """Return effective points-per-dollar for rank_index."""
        cpt = self.get_rank_cents_per_pt(rank_index)
        return 100.0 / cpt if cpt > 0 else float(self.points_per_dollar)

    def _count_period_redemptions(
        self, person_id: str, item_id: str, period: str, today: date
    ) -> int:
        """Count pending+approved redemptions for person+item in the current period."""
        if period == "day":
            start = today.isoformat()
        elif period == "week":
            start = (today - timedelta(days=today.weekday())).isoformat()
        else:  # month
            start = date(today.year, today.month, 1).isoformat()
        return sum(
            1 for r in self.redemptions
            if r.get("person_id") == person_id
            and r.get("store_item_id") == item_id
            and r.get("status") in {REDEMPTION_PENDING, REDEMPTION_APPROVED}
            and r.get("requested_at", "")[:10] >= start
        )

    def get_next_available_date(
        self, person_id: str, item_id: str, max_per_period: int, period: str
    ) -> str | None:
        """Return ISO date when the rate limit resets, or None if not yet at limit."""
        if max_per_period <= 0:
            return None
        today = date.today()
        if self._count_period_redemptions(person_id, item_id, period, today) < max_per_period:
            return None
        if period == "day":
            return (today + timedelta(days=1)).isoformat()
        if period == "week":
            days_ahead = (7 - today.weekday()) % 7 or 7
            return (today + timedelta(days=days_ahead)).isoformat()
        # month
        if today.month == 12:
            return date(today.year + 1, 1, 1).isoformat()
        return date(today.year, today.month + 1, 1).isoformat()

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

    # ------------------------------------------------------------------
    # Rotation helpers (v0.6.2)
    # ------------------------------------------------------------------

    def _active_rotation_ids(self, pool: list[str]) -> list[str]:
        """Return pool members whose person record is active, preserving order.

        Inactive (paused, removed) pool members get skipped so the rotation
        never stalls on a kid who isn't around. Order is preserved so the
        cycle visits members in the parent-configured sequence.
        """
        active = {p["id"] for p in self.get_active_people()}
        return [pid for pid in pool if pid in active]

    def _advance_rotation(self, chore: dict, today: date) -> bool:
        """Move the rotation forward by one active pool member.

        Updates `assigned_to`, `rotation_index`, and `rotation_last_advanced`
        in-place. Returns True when the assignee actually changed (so callers
        can decide whether to log history or refresh sensors).

        Edge cases:
          - Empty / all-inactive pool: no-op, assigned_to is left alone so
            existing instances don't get orphaned.
          - First advance (rotation_index unset or pointing at inactive id):
            falls back to the first active id.
        """
        pool = chore.get("rotation_pool") or []
        if not pool:
            return False
        active_ids = self._active_rotation_ids(pool)
        if not active_ids:
            return False

        current = chore.get("assigned_to") or []
        cur_id  = current[0] if current else None

        # Find next active id after the current one in the pool order.
        try:
            cur_pool_idx = pool.index(cur_id) if cur_id in pool else -1
        except ValueError:
            cur_pool_idx = -1

        next_id = None
        n = len(pool)
        for step in range(1, n + 1):
            candidate = pool[(cur_pool_idx + step) % n]
            if candidate in active_ids:
                next_id = candidate
                break
        if next_id is None:
            return False

        chore["rotation_index"]         = pool.index(next_id)
        chore["rotation_last_advanced"] = today.isoformat()
        if cur_id == next_id:
            return False
        chore["assigned_to"] = [next_id]
        return True

    async def _maybe_advance_rotation(self, chore: dict, tick_date: date) -> bool:
        """Advance rotation once per tick_date and skip the previous assignee's
        leftover instances. Returns True when the assignee actually changed.

        Idempotent across catch-up loops: `rotation_last_advanced` is the
        date guard, so multiple calls on the same date are no-ops.
        """
        if chore.get("rotation_last_advanced") == tick_date.isoformat():
            return False
        previous = list(chore.get("assigned_to") or [])
        if not self._advance_rotation(chore, tick_date):
            return False
        new_assigned = chore.get("assigned_to") or []
        # Sweep any pending instances belonging to people no longer in the
        # active assignment so they don't linger as overdue on a kid who
        # has rotated off.
        for prev_pid in previous:
            if prev_pid in new_assigned:
                continue
            await self._skip_incomplete_instances(chore, person_id=prev_pid)
        return True

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

    # ------------------------------------------------------------------
    # Success-rate streak admin override (v0.6.1)
    # ------------------------------------------------------------------

    async def async_set_completion_streak(self, person_id: str, count: int) -> bool:
        """Admin override: set a person's success-rate streak count directly."""
        person = self.get_person(person_id)
        if not person:
            return False
        person["completion_streak"] = max(0, count)
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

    # ------------------------------------------------------------------
    # v0.6.5 — Subscription processing (daily tick)
    # ------------------------------------------------------------------

    async def _async_process_subscriptions(self, tick_date: date) -> None:
        """Process subscription renewals and lapses for tick_date.

        Runs for every day in the catch-up loop so missed days accumulate
        debt correctly.  cancel_pending subs continue renewing — the parent
        still needs to act.  Only the first lapse per subscription triggers
        a notification; subsequent missed periods silently add to debt.
        """
        subscriptions = self._data.get("subscriptions", [])
        tick_str = tick_date.isoformat()

        for sub in subscriptions:
            if sub["status"] == SUB_STATUS_CANCELED:
                continue
            if tick_str < sub["next_renewal_date"]:
                continue

            person = self.get_person(sub["person_id"])
            item   = self.get_store_item(sub["item_id"])
            if not person or not person.get("active", True):
                continue
            if not item or not item.get("active", True):
                continue

            _dollar    = sub.get("dollar_cost_override") or item.get("dollar_value", 0)
            cost       = round(_dollar * self.get_rank_ppd(person.get("rank_index", 0)))
            total_owed = cost + sub.get("accumulated_debt", 0)

            if person.get("points_balance", 0) >= total_owed:
                # --- Renewal / debt recovery ---
                person["points_balance"] = person.get("points_balance", 0) - total_owed
                sub["missed_renewals"]   = 0
                sub["accumulated_debt"]  = 0
                # cancel_pending stays pending — parent still needs to approve
                if sub["status"] != SUB_STATUS_CANCEL_PENDING:
                    sub["status"] = SUB_STATUS_ACTIVE
                sub["next_renewal_date"] = _advance_renewal_date(
                    sub["period"], sub["anchor"], sub["next_renewal_date"]
                )
                self._append_history(
                    event_type=HISTORY_SUBSCRIPTION_RENEWED,
                    person_id=sub["person_id"],
                    reference_id=sub["id"],
                    points_delta=-total_owed,
                    balance_after=person["points_balance"],
                    note=item.get("name", ""),
                )
                _LOGGER.info(
                    "Family Hub: subscription %s renewed for %s — -%d pts (debt cleared)",
                    sub["id"], person.get("name"), total_owed,
                )
            else:
                # --- Lapse ---
                first_lapse = sub["status"] == SUB_STATUS_ACTIVE
                if sub["status"] != SUB_STATUS_CANCEL_PENDING:
                    sub["status"] = SUB_STATUS_LAPSED
                sub["missed_renewals"]  = sub.get("missed_renewals", 0) + 1
                sub["accumulated_debt"] = sub["missed_renewals"] * cost
                sub["next_renewal_date"] = _advance_renewal_date(
                    sub["period"], sub["anchor"], sub["next_renewal_date"]
                )
                self._append_history(
                    event_type=HISTORY_SUBSCRIPTION_LAPSED,
                    person_id=sub["person_id"],
                    reference_id=sub["id"],
                    note=item.get("name", ""),
                )
                _LOGGER.info(
                    "Family Hub: subscription %s lapsed for %s — missed=%d debt=%d",
                    sub["id"], person.get("name"),
                    sub["missed_renewals"], sub["accumulated_debt"],
                )
                if first_lapse:
                    await self._notify_subscription_lapsed(sub, person, item)

    async def _notify_subscription_lapsed(
        self, sub: dict, person: dict, item: dict
    ) -> None:
        """Notify parents when a subscription lapses for the first time."""
        person_name = person.get("name", "Someone")
        item_name   = item.get("name", "a subscription")
        debt        = sub.get("accumulated_debt", 0)

        try:
            await self._hass.services.async_call(
                "persistent_notification", "create",
                {
                    "title": f"Family Hub: subscription lapsed — {item_name}",
                    "message": (
                        f"**{person_name}**'s **{item_name}** subscription has lapsed "
                        f"because they couldn't afford the renewal.\n\n"
                        f"Current debt: **{debt} pts**. "
                        f"The subscription will resume automatically when they can afford it, "
                        f"or a parent can cancel it."
                    ),
                    "notification_id": f"family_hub_sub_lapsed_{sub['id']}",
                },
            )
        except Exception as err:
            _LOGGER.warning("Family Hub: lapse persistent_notification failed: %s", err)

        push_msg = (
            f"{person_name}'s {item_name} subscription lapsed "
            f"(owed {debt} pts) — open Family Hub to review."
        )
        for parent in self.get_active_people():
            if parent.get("type") != "parent":
                continue
            target = parent.get("notify_target", "").strip()
            if not target:
                continue
            await self._send_notify(
                target,
                f"Subscription lapsed — {item_name}",
                push_msg,
            )

    # ------------------------------------------------------------------
    # v0.6.5 — Subscription CRUD services
    # ------------------------------------------------------------------

    async def async_subscribe(
        self,
        person_id: str,
        item_id: str,
        *,
        skip_cost_check: bool = False,
        anchor_override: int | None = None,
    ) -> dict | None:
        """Create a subscription for person_id on item_id.

        Deducts the first-period cost immediately.  Returns the new
        subscription record, or None on validation failure.
        skip_cost_check=True allows admin_subscribe_for_person to start
        a sub even when the kid can't afford the initial cost (starts lapsed).
        anchor_override, when provided, replaces the item's subscription_anchor
        (used when a parent sets a custom anchor at approval time).
        """
        person = self.get_person(person_id)
        item   = self.get_store_item(item_id)

        if not person or not person.get("active", True):
            _LOGGER.warning("Family Hub: subscribe — person %s not found or inactive", person_id)
            return None
        if not item or not item.get("active", True):
            _LOGGER.warning("Family Hub: subscribe — item %s not found or inactive", item_id)
            return None
        if item.get("item_type") != ITEM_TYPE_SUBSCRIPTION:
            _LOGGER.warning("Family Hub: subscribe — item %s is not a subscription item", item_id)
            return None

        # Guard: person already has an active/lapsed/cancel_pending sub for this item.
        existing = next(
            (
                s for s in self._data.get("subscriptions", [])
                if s["person_id"] == person_id
                and s["item_id"] == item_id
                and s["status"] != SUB_STATUS_CANCELED
            ),
            None,
        )
        if existing:
            _LOGGER.warning(
                "Family Hub: subscribe — %s already has an active subscription for %s",
                person_id, item_id,
            )
            return None

        period = item.get("subscription_period", "monthly")
        anchor = anchor_override if anchor_override is not None else item.get("subscription_anchor", 1)
        today  = date.today()
        cost   = round(item.get("dollar_value", 0) * self.get_rank_ppd(person.get("rank_index", 0)))

        if not skip_cost_check and person.get("points_balance", 0) < cost:
            _LOGGER.warning(
                "Family Hub: subscribe — %s cannot afford %s (balance=%d cost=%d)",
                person_id, item_id, person.get("points_balance", 0), cost,
            )
            return None

        started_iso      = today.isoformat()
        next_renewal_iso = _advance_renewal_date(period, anchor, started_iso)

        if skip_cost_check and person.get("points_balance", 0) < cost:
            # Admin-forced start: begin lapsed with first period as debt.
            initial_status    = SUB_STATUS_LAPSED
            missed_renewals   = 1
            accumulated_debt  = cost
        else:
            # Normal start: deduct first-period cost immediately.
            person["points_balance"] = person.get("points_balance", 0) - cost
            initial_status    = SUB_STATUS_ACTIVE
            missed_renewals   = 0
            accumulated_debt  = 0

        sub = {
            "id":                        _new_id(),
            "person_id":                 person_id,
            "item_id":                   item_id,
            "period":                    period,
            "anchor":                    anchor,
            "next_renewal_date":         next_renewal_iso,
            "started_date":              started_iso,
            "status":                    initial_status,
            "missed_renewals":           missed_renewals,
            "accumulated_debt":          accumulated_debt,
            "dollar_cost_override":      None,
            "prior_status":              None,
            "cancellation_requested_at": None,
            "cancellation_requested_by": None,
        }
        self._data["subscriptions"].append(sub)
        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_STARTED,
            person_id=person_id,
            reference_id=sub["id"],
            points_delta=-cost if initial_status == SUB_STATUS_ACTIVE else 0,
            balance_after=person.get("points_balance", 0),
            note=item.get("name", ""),
        )
        await self.async_save()
        _LOGGER.info(
            "Family Hub: subscribe — %s subscribed to %s (status=%s next=%s)",
            person_id, item_id, initial_status, next_renewal_iso,
        )
        return sub

    async def async_request_cancel_subscription(
        self, subscription_id: str, person_id: str
    ) -> dict | None:
        """Kid requests cancellation of their subscription.

        Sets status to cancel_pending.  Subscription continues to renew
        normally until a parent approves or declines the request.
        """
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: request_cancel — subscription %s not found", subscription_id)
            return None
        if sub["person_id"] != person_id:
            _LOGGER.warning(
                "Family Hub: request_cancel — subscription %s does not belong to %s",
                subscription_id, person_id,
            )
            return None
        if sub["status"] in (SUB_STATUS_CANCEL_PENDING, SUB_STATUS_CANCELED):
            _LOGGER.warning(
                "Family Hub: request_cancel — subscription %s already %s",
                subscription_id, sub["status"],
            )
            return None

        sub["prior_status"]              = sub["status"]
        sub["status"]                    = SUB_STATUS_CANCEL_PENDING
        sub["cancellation_requested_at"] = _now_iso()
        sub["cancellation_requested_by"] = person_id

        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_CANCEL_REQUESTED,
            person_id=person_id,
            reference_id=subscription_id,
            note=self._sub_item_name(sub),
        )
        await self.async_save()

        # Notify parents.
        person    = self.get_person(person_id)
        item      = self.get_store_item(sub["item_id"])
        item_name = item.get("name", "a subscription") if item else "a subscription"
        p_name    = person.get("name", "Someone") if person else "Someone"
        try:
            await self._hass.services.async_call(
                "persistent_notification", "create",
                {
                    "title": f"Family Hub: cancel request — {item_name}",
                    "message": (
                        f"**{p_name}** has requested to cancel their **{item_name}** subscription.\n\n"
                        f"Subscription ID: `{subscription_id}`"
                    ),
                    "notification_id": f"family_hub_sub_cancel_{subscription_id}",
                },
            )
        except Exception as err:
            _LOGGER.warning("Family Hub: cancel request notification failed: %s", err)

        push_msg = f"{p_name} wants to cancel their {item_name} subscription — approve or decline in Family Hub."
        for parent in self.get_active_people():
            if parent.get("type") != "parent":
                continue
            target = parent.get("notify_target", "").strip()
            if not target:
                continue
            await self._send_notify(
                target,
                f"Cancel request — {item_name}",
                push_msg,
            )
        return sub

    async def async_approve_cancel_subscription(
        self, subscription_id: str, approved_by: str
    ) -> dict | None:
        """Parent approves a cancel request — subscription stops renewing."""
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: approve_cancel — subscription %s not found", subscription_id)
            return None
        if sub["status"] != SUB_STATUS_CANCEL_PENDING:
            _LOGGER.warning(
                "Family Hub: approve_cancel — subscription %s is not cancel_pending (status=%s)",
                subscription_id, sub["status"],
            )
            return None

        sub["status"]     = SUB_STATUS_CANCELED
        sub["prior_status"] = None
        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_CANCELED,
            person_id=sub["person_id"],
            reference_id=subscription_id,
            note=f"Approved by {approved_by}. {self._sub_item_name(sub)}",
        )
        await self.async_save()
        return sub

    async def async_decline_cancel_subscription(
        self, subscription_id: str, declined_by: str
    ) -> dict | None:
        """Parent declines a cancel request — subscription reverts to its prior status."""
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: decline_cancel — subscription %s not found", subscription_id)
            return None
        if sub["status"] != SUB_STATUS_CANCEL_PENDING:
            _LOGGER.warning(
                "Family Hub: decline_cancel — subscription %s is not cancel_pending (status=%s)",
                subscription_id, sub["status"],
            )
            return None

        restore_status = sub.get("prior_status") or SUB_STATUS_ACTIVE
        sub["status"]                    = restore_status
        sub["prior_status"]              = None
        sub["cancellation_requested_at"] = None
        sub["cancellation_requested_by"] = None
        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_CANCEL_DECLINED,
            person_id=sub["person_id"],
            reference_id=subscription_id,
            note=f"Cancel request declined by {declined_by}. {self._sub_item_name(sub)}",
        )
        await self.async_save()
        return sub

    async def async_admin_cancel_subscription(
        self, subscription_id: str, canceled_by: str
    ) -> dict | None:
        """Parent unilaterally cancels a subscription regardless of current status."""
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: admin_cancel — subscription %s not found", subscription_id)
            return None
        if sub["status"] == SUB_STATUS_CANCELED:
            _LOGGER.warning("Family Hub: admin_cancel — subscription %s already canceled", subscription_id)
            return None

        sub["status"] = SUB_STATUS_CANCELED
        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_CANCELED,
            person_id=sub["person_id"],
            reference_id=subscription_id,
            note=f"Admin canceled by {canceled_by}. {self._sub_item_name(sub)}",
        )
        await self.async_save()
        return sub

    async def async_admin_subscribe_for_person(
        self, person_id: str, item_id: str
    ) -> dict | None:
        """Parent creates a subscription on behalf of a kid.

        Uses the same logic as async_subscribe but with skip_cost_check=True
        so the sub can start even if the kid can't afford it (begins lapsed).
        """
        return await self.async_subscribe(person_id, item_id, skip_cost_check=True)

    _UNSET = object()

    async def async_update_subscription(
        self,
        subscription_id: str,
        *,
        period: str | None = None,
        anchor: int | None = None,
        dollar_cost_override: object = _UNSET,
        next_renewal_date: str | None = None,
    ) -> dict | None:
        """Parent edits period, anchor, cost override, or next renewal date.

        Changing period or anchor recalculates next_renewal_date from today.
        If next_renewal_date is also supplied it is applied last (explicit date
        always wins).
        Passing dollar_cost_override=None clears the override (reverts to
        item-derived cost); omitting the argument leaves it unchanged.
        """
        sub = self._get_subscription(subscription_id)
        if not sub:
            _LOGGER.warning("Family Hub: update_subscription — %s not found", subscription_id)
            return None
        if sub["status"] == SUB_STATUS_CANCELED:
            _LOGGER.warning("Family Hub: update_subscription — %s is canceled", subscription_id)
            return None

        period_changed = False
        if period is not None and period != sub["period"]:
            sub["period"] = period
            period_changed = True
        if anchor is not None and anchor != sub["anchor"]:
            sub["anchor"] = anchor
            period_changed = True
        if period_changed:
            sub["next_renewal_date"] = _advance_renewal_date(
                sub["period"], sub["anchor"], date.today().isoformat()
            )
        # Explicit date wins over the recalculated one (applied last).
        if next_renewal_date is not None:
            sub["next_renewal_date"] = next_renewal_date
        if dollar_cost_override is not self.__class__._UNSET:
            sub["dollar_cost_override"] = dollar_cost_override

        self._append_history(
            event_type=HISTORY_SUBSCRIPTION_UPDATED,
            person_id=sub["person_id"],
            reference_id=subscription_id,
            note=f"Subscription updated by admin. {self._sub_item_name(sub)}",
        )
        await self.async_save()
        return sub

    # ------------------------------------------------------------------
    # v0.6.5 — Subscription read helpers
    # ------------------------------------------------------------------

    def _get_subscription(self, subscription_id: str) -> dict | None:
        return next(
            (s for s in self._data.get("subscriptions", []) if s["id"] == subscription_id),
            None,
        )

    def _sub_item_name(self, sub: dict) -> str:
        item = self.get_store_item(sub.get("item_id", ""))
        return item.get("name", "") if item else ""

    def get_subscriptions_for_person(self, person_id: str, rank_index: int = 0) -> list[dict]:
        """Return all non-canceled subscriptions for person_id, enriched for the card."""
        today    = date.today()
        eff_ppd  = self.get_rank_ppd(rank_index)
        result   = []
        for sub in self._data.get("subscriptions", []):
            if sub["person_id"] != person_id:
                continue
            if sub["status"] == SUB_STATUS_CANCELED:
                continue
            item = self.get_store_item(sub["item_id"])
            if not item:
                continue
            dollar = sub.get("dollar_cost_override") if sub.get("dollar_cost_override") is not None else item.get("dollar_value", 0)
            cost = round(dollar * eff_ppd)
            try:
                renewal = date.fromisoformat(sub["next_renewal_date"])
                days_until = (renewal - today).days
            except (ValueError, KeyError):
                days_until = 0
            result.append({
                "subscription_id":          sub["id"],
                "item_id":                  sub["item_id"],
                "item_name":                item.get("name", ""),
                "item_icon":                item.get("icon", "") or "",
                "period":                   sub["period"],
                "next_renewal_date":        sub["next_renewal_date"],
                "days_until_renewal":       days_until,
                "status":                   sub["status"],
                "points_cost":              cost,
                "accumulated_debt":         sub.get("accumulated_debt", 0),
                "missed_renewals":          sub.get("missed_renewals", 0),
                "cancellation_requested_by": sub.get("cancellation_requested_by"),
            })
        return result

    def get_cancel_pending_subscriptions_for_card(self) -> list[dict]:
        """Return all cancel_pending subscriptions enriched for the admin queue."""
        result = []
        for sub in self._data.get("subscriptions", []):
            if sub["status"] != SUB_STATUS_CANCEL_PENDING:
                continue
            person = self.get_person(sub["person_id"])
            item   = self.get_store_item(sub["item_id"])
            result.append({
                "subscription_id":           sub["id"],
                "person_id":                 sub["person_id"],
                "person_name":               person.get("name", "Unknown") if person else "Unknown",
                "person_color":              person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "item_id":                   sub["item_id"],
                "item_name":                 item.get("name", "Unknown") if item else "Unknown",
                "period":                    sub["period"],
                "requested_at":              sub.get("cancellation_requested_at"),
                "accumulated_debt":          sub.get("accumulated_debt", 0),
            })
        return result

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
        rank_ppd_ladder: list[float] | None = None,
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
        if rank_ppd_ladder is not None:
            s["rank_ppd_ladder"] = [float(v) for v in rank_ppd_ladder]
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
            # v0.6.1: success-rate person streak
            "completion_streak":          0,
            "completion_threshold_pct":   80,
            "completion_milestone":       7,
            "completion_bonus_points":    50,
            "last_completion_eval_date":  None,
            # v0.6.3: store goal item (empty = none)
            "goal_item_id":               "",
            # v0.6.3 item 7: streak freeze tokens
            "streak_freezes_available":   0,
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
            # v0.6.1: success-rate person streak (admin-configurable knobs)
            "completion_streak",
            "completion_threshold_pct", "completion_milestone", "completion_bonus_points",
            # v0.6.3: store goal item
            "goal_item_id",
            # v0.6.3 item 7: streak freeze tokens (admin can also top up)
            "streak_freezes_available",
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

    async def async_reactivate_person(self, person_id: str) -> bool:
        """Reactivate a previously-deactivated person (e.g. back from camp). Their
        next daily tick regenerates task instances for any chores they're assigned
        to; the sensor is re-created by the service handler."""
        person = self.get_person(person_id)
        if not person:
            return False
        person["active"] = True
        await self.async_save()
        return True

    async def async_hard_delete_person(self, person_id: str) -> bool:
        """Permanently remove an INACTIVE person and purge ALL their data: task
        instances, redemptions, subscriptions, history entries, and any group-reward
        contributions. Active people cannot be hard-deleted — deactivate first.
        Irreversible; for cleanup of people who have truly left."""
        person = self.get_person(person_id)
        if not person:
            return False
        if person.get("active", True):
            _LOGGER.warning(
                "Family Hub: refusing to hard-delete ACTIVE person %s — deactivate first",
                person_id,
            )
            return False

        d = self._data
        d["people"] = [p for p in d.get("people", []) if p.get("id") != person_id]
        d["task_instances"] = [
            t for t in d.get("task_instances", [])
            if t.get("assigned_to") != person_id and t.get("completed_by") != person_id
        ]
        d["redemptions"]  = [r for r in d.get("redemptions", [])  if r.get("person_id") != person_id]
        d["subscriptions"] = [s for s in d.get("subscriptions", []) if s.get("person_id") != person_id]
        d["history"]      = [h for h in d.get("history", [])      if h.get("person_id") != person_id]
        # Drop any group-reward contributions by this person.
        for item in d.get("store_items", []):
            if item.get("contributors"):
                item["contributors"] = [c for c in item["contributors"] if c.get("person_id") != person_id]
        for prop in d.get("group_reward_proposals", []):
            if prop.get("contributors"):
                prop["contributors"] = [c for c in prop["contributors"] if c.get("person_id") != person_id]

        await self.async_save()
        _LOGGER.info("Family Hub: hard-deleted person %s and purged their data", person_id)
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
        rotation_pool: list[str] | None = None,
        rotation_cadence: str = "",
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
            "rotation_pool":           list(rotation_pool or []),
            "rotation_cadence":        rotation_cadence or "",
            "rotation_index":          0,
            "rotation_last_advanced":  "",
            "recurrence": rec,
            "active": True,
            "created_at": _now_iso(),
            "created_by": created_by,
        }
        # Rotation: when a pool is configured, override assigned_to with the
        # first active pool member. This keeps "active assignee" as the single
        # source of truth — assigned_to + rotation_index always agree.
        if chore["rotation_pool"]:
            active_ids = self._active_rotation_ids(chore["rotation_pool"])
            if active_ids:
                chore["assigned_to"] = [active_ids[0]]
                chore["rotation_index"] = chore["rotation_pool"].index(active_ids[0])

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
            "reminder_time", "rotation_pool", "rotation_cadence",
            "recurrence", "active", "weekdays", "day_filter", "interval",
        }
        old_assigned = list(chore.get("assigned_to", []))
        old_pool     = list(chore.get("rotation_pool", []))

        for key, val in kwargs.items():
            if key not in allowed:
                continue
            # Recurrence sub-fields can be passed at top level
            if key in {"weekdays", "day_filter", "interval"}:
                chore["recurrence"][key] = val
            elif key == "assigned_to":
                # Ensure it's always a list
                chore["assigned_to"] = val if isinstance(val, list) else ([val] if val else [])
            elif key == "rotation_pool":
                chore["rotation_pool"] = list(val) if isinstance(val, list) else []
            else:
                chore[key] = val

        # Keep legacy category field in sync with chore_type
        if "chore_type" in kwargs:
            chore["category"] = chore["chore_type"]

        # Rotation pool changes: reset the index, then snap assigned_to to the
        # first active pool member so the next instance generated is correct.
        # When the pool is cleared, leave assigned_to untouched — the parent
        # may want to manually re-assign.
        if "rotation_pool" in kwargs and chore.get("rotation_pool") != old_pool:
            chore["rotation_index"]         = 0
            chore["rotation_last_advanced"] = ""
            new_pool = chore.get("rotation_pool") or []
            if new_pool:
                active_ids = self._active_rotation_ids(new_pool)
                if active_ids:
                    chore["assigned_to"]    = [active_ids[0]]
                    chore["rotation_index"] = new_pool.index(active_ids[0])

        new_assigned = chore.get("assigned_to", [])

        # Auto-deactivate an assigned chore when all assignees are removed,
        # unless the caller explicitly passed active= in kwargs.
        if (
            chore.get("chore_type") == CHORE_TYPE_ASSIGNED
            and old_assigned
            and not new_assigned
            and "active" not in kwargs
        ):
            chore["active"] = False

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
            # When new_assigned is empty the chore is being deactivated — purge
            # all pending instances so they stop showing on kids' task lists.
            # Previously we kept them ("unassigned chore stays as-is") but now
            # empty assigned_to triggers auto-deactivation, so keeping orphaned
            # instances would be confusing.
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
            else:
                # All assignees removed — purge all pending instances for this chore.
                self._data["task_instances"] = [
                    t for t in self._data["task_instances"]
                    if not (t["chore_id"] == chore_id and t["status"] in ACTIVE_STATUSES)
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
        """
        Hard-delete a chore: remove the definition entirely and purge ALL of
        its task instances (every status).

        Safe because the data that matters is stored independently:
          - Point balances live on each person record (never recomputed from
            instances), so removing instances can't change anyone's balance.
          - The history log keeps its own denormalized chore_name, so the
            activity log still reads correctly after the chore is gone.
          - Person-level completion streaks are stored counters, not derived
            from instances.

        For a recoverable "turn this off for now" state, set active=False
        (via update_chore / the admin Active toggle) instead — that keeps the
        definition and lets you re-engage it later. Delete is permanent.
        """
        chore = self.get_chore(chore_id)
        if not chore:
            return False
        self._data["chores"] = [
            c for c in self._data["chores"] if c.get("id") != chore_id
        ]
        self._data["task_instances"] = [
            t for t in self._data["task_instances"] if t.get("chore_id") != chore_id
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

    def _park_one_time_if_done(self, chore: dict) -> None:
        """
        When a one-time chore's instance reaches a completed state, flip the
        chore to inactive rather than leaving it live with no future instances.

        One-time chores never regenerate, so a finished one would otherwise just
        vanish from view. Parking it as active=False keeps the definition in the
        Chores list (under the Inactive filter) so a parent can re-activate and
        reuse it later. No-op for recurring chores.
        """
        if chore.get("recurrence", {}).get("type") == RECURRENCE_ONE_TIME:
            chore["active"] = False

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
            # Auto-completed (no approval needed) — park one-time chores now.
            self._park_one_time_if_done(chore)

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
        # Approved & terminal — park one-time chores so they don't vanish.
        self._park_one_time_if_done(chore)
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
    # Store items
    # ------------------------------------------------------------------

    @property
    def store_items(self) -> list[dict]:
        return self._data.get("store_items", [])

    def get_store_item(self, item_id: str) -> dict | None:
        return next((i for i in self.store_items if i["id"] == item_id), None)

    def get_store_items_for_person(self, person_id: str) -> list[dict]:
        """Return common items + items where person_id is in person_ids list.

        v0.6.3: sorted by sort_order (admin drag-reorder) with name as the
        deterministic tie-breaker for legacy items at sort_order=0.
        v0.6.3 item 13: group rewards are also returned if the person is listed
        as a contributor, regardless of scope.
        """
        items = [
            i for i in self.store_items
            if i.get("active", True) and (
                i.get("scope") == SCOPE_COMMON
                or (
                    i.get("scope") == SCOPE_PERSONAL
                    and person_id in (i.get("person_ids") or [])
                )
                or (
                    i.get("is_group_reward")
                    and any(c.get("person_id") == person_id for c in i.get("contributors", []))
                )
            )
        ]
        return sorted(items, key=lambda x: (x.get("sort_order", 0), x.get("name", "")))

    def _dollar_to_points(self, dollar_value: float) -> int:
        return round(dollar_value * self.points_per_dollar)

    async def async_add_store_item(
        self,
        name: str,
        dollar_value: float,
        scope: str = SCOPE_COMMON,
        person_ids: list[str] | None = None,
        description: str = "",
        icon: str = "",
        category_label: str = "",
        max_per_period: int = 0,
        period: str = "week",
        is_group_reward: bool = False,
        contributors: list[dict] | None = None,
        item_type: str = ITEM_TYPE_ONE_TIME,
        subscription_period: str = "",
        subscription_anchor: int = 1,
    ) -> dict:
        # v0.6.3: place new items at the end of the sort_order ladder so the
        # drag-reorder bisect math doesn't collide with existing positions.
        max_sort = max(
            (i.get("sort_order", 0) for i in self._data["store_items"]),
            default=0,
        )
        # When creating a group reward, compute target_pts for each contributor
        # based on their share_pct and the item's points_cost.
        points_cost = self._dollar_to_points(dollar_value)
        resolved_contributors: list[dict] = []
        if is_group_reward and contributors:
            for c in contributors:
                resolved_contributors.append({
                    "person_id":       c.get("person_id", ""),
                    "share_pct":       int(c.get("share_pct", 0)),
                    "contributed_pts": int(c.get("contributed_pts", 0)),
                    "target_pts":      round(points_cost * int(c.get("share_pct", 0)) / 100),
                })
        item = {
            "id": _new_id(),
            "name": name,
            "description": description,
            "dollar_value": dollar_value,
            "points_cost": points_cost,
            "scope": scope,
            "person_ids": person_ids if scope == SCOPE_PERSONAL else [],
            "active": True,
            "created_at": _now_iso(),
            "sort_order": max_sort + 10,
            "icon": icon or "",
            "category_label": category_label or "",
            "max_per_period": max(0, int(max_per_period)),
            "period": period if period in ("day", "week", "month") else "week",
            # v0.6.3 item 13: group / shared reward
            "is_group_reward": is_group_reward,
            "contributors":    resolved_contributors,
            # v0.6.5: subscription fields
            "item_type":            item_type if item_type in (ITEM_TYPE_ONE_TIME, ITEM_TYPE_SUBSCRIPTION) else ITEM_TYPE_ONE_TIME,
            "subscription_period":  subscription_period,
            "subscription_anchor":  subscription_anchor,
        }
        self._data["store_items"].append(item)
        await self.async_save()
        return item

    async def async_update_store_item(self, item_id: str, **kwargs: Any) -> dict | None:
        item = self.get_store_item(item_id)
        if not item:
            return None
        allowed = {"name", "description", "dollar_value", "scope", "person_ids", "active",
                   "sort_order", "icon", "category_label", "max_per_period", "period",
                   "is_group_reward", "contributors",
                   "item_type", "subscription_period", "subscription_anchor"}
        for key, val in kwargs.items():
            if key in allowed:
                item[key] = val
        if "dollar_value" in kwargs:
            item["points_cost"] = self._dollar_to_points(item["dollar_value"])
        await self.async_save()
        return item

    async def async_delete_store_item(self, item_id: str) -> bool:
        """Soft-delete: set active=False. Item remains in store_items list."""
        item = self.get_store_item(item_id)
        if not item:
            return False
        item["active"] = False
        await self.async_save()
        return True

    async def async_hard_delete_store_item(self, item_id: str) -> bool:
        """Hard-delete: physically remove item and cancel any pending redemptions for it.

        v0.6.3 item 13: also refunds contributed_pts to each contributor when a
        group reward is deleted, and marks any open proposals for this item as declined.
        """
        item = self.get_store_item(item_id)
        if not item:
            return False
        # Cancel pending redemptions referencing this item
        for r in self._data.get("redemptions", []):
            if (r.get("store_item_id") == item_id
                    and r.get("status") == REDEMPTION_PENDING):
                r["status"]      = REDEMPTION_DECLINED
                r["resolved_at"] = _now_iso()
                r["resolved_by"] = "system"
                r["note"]        = "Reward deleted by admin"
        # v0.6.3 item 13: refund chipped-in points to each contributor
        if item.get("is_group_reward"):
            for contrib in item.get("contributors", []):
                pid  = contrib.get("person_id")
                pts  = contrib.get("contributed_pts", 0)
                if pid and pts > 0:
                    person = self.get_person(pid)
                    if person:
                        person["points_balance"] = person.get("points_balance", 0) + pts
                        self._append_history(
                            event_type=HISTORY_GROUP_CHIP_IN,
                            person_id=pid,
                            reference_id=item_id,
                            points_delta=pts,
                            balance_after=person["points_balance"],
                            note=f'Refund: group reward "{item["name"]}" deleted',
                        )
        # v0.6.3 item 13: cancel any open proposals for this item
        now = _now_iso()
        for prop in self._data.get("group_reward_proposals", []):
            if (prop.get("item_id") == item_id
                    and prop.get("status") not in (PROPOSAL_APPROVED, PROPOSAL_DECLINED)):
                prop["status"]      = PROPOSAL_DECLINED
                prop["resolved_at"] = now
                prop["resolved_by"] = "system"
                prop["note"]        = "Reward deleted by admin"
        # Remove from list
        self._data["store_items"] = [
            i for i in self._data["store_items"] if i["id"] != item_id
        ]
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Group reward proposals (v0.6.3 item 13)
    # ------------------------------------------------------------------

    @property
    def group_reward_proposals(self) -> list[dict]:
        return self._data.get("group_reward_proposals", [])

    def get_group_proposal(self, proposal_id: str) -> dict | None:
        return next((p for p in self.group_reward_proposals if p["id"] == proposal_id), None)

    async def async_propose_group_reward(
        self,
        item_id: str,
        proposer_id: str,
        proposer_share_pct: int,
        invitees: list[dict],  # [{"person_id": ..., "share_pct": ...}]
    ) -> dict | None:
        """
        Kid proposes turning a store item into a shared group reward.

        Creates a proposal record with status=pending_kid_acceptance. Each invitee
        must respond (accept/decline) before it advances to parent approval. If any
        invitee declines the proposal is immediately closed as declined.

        Validates that proposer_share_pct + all invitee share_pct sums to ~100.
        """
        item = self.get_store_item(item_id)
        if not item or not item.get("active", True):
            _LOGGER.warning("Family Hub: propose_group_reward — item %s not found or inactive", item_id)
            return None
        proposer = self.get_person(proposer_id)
        if not proposer:
            return None

        # Validate share percentages
        total_pct = proposer_share_pct + sum(int(i.get("share_pct", 0)) for i in invitees)
        if abs(total_pct - 100) > 2:
            _LOGGER.warning(
                "Family Hub: propose_group_reward — shares don't sum to 100 (got %d)", total_pct
            )
            return None

        proposal: dict = {
            "id": _new_id(),
            "item_id": item_id,
            "item_name": item["name"],
            "proposed_by": proposer_id,
            "proposed_at": _now_iso(),
            "status": PROPOSAL_PENDING_KIDS,
            "proposer_share_pct": proposer_share_pct,
            "invitees": [
                {
                    "person_id": inv["person_id"],
                    "share_pct": int(inv.get("share_pct", 0)),
                    "accepted": None,   # None=pending, True=accepted, False=declined
                }
                for inv in invitees
            ],
            "resolved_at": None,
            "resolved_by": None,
            "note": "",
        }
        self._data.setdefault("group_reward_proposals", []).append(proposal)
        self._append_history(
            event_type=HISTORY_GROUP_PROPOSED,
            person_id=proposer_id,
            reference_id=proposal["id"],
            note=f'{proposer["name"]} proposed sharing "{item["name"]}"',
        )
        await self.async_save()
        return proposal

    async def async_respond_group_proposal(
        self,
        proposal_id: str,
        person_id: str,
        accept: bool,
    ) -> dict | None:
        """
        Kid accepts or declines a group reward proposal.

        A single decline immediately closes the proposal as PROPOSAL_DECLINED.
        When all invitees have accepted the status advances to PROPOSAL_PENDING_PARENT.
        """
        proposal = self.get_group_proposal(proposal_id)
        if not proposal or proposal.get("status") != PROPOSAL_PENDING_KIDS:
            return None

        invitee = next(
            (i for i in proposal["invitees"] if i["person_id"] == person_id), None
        )
        if not invitee:
            _LOGGER.warning("Family Hub: respond_group_proposal — %s not an invitee", person_id)
            return None

        invitee["accepted"] = accept

        if not accept:
            proposal["status"]      = PROPOSAL_DECLINED
            proposal["resolved_at"] = _now_iso()
            proposal["resolved_by"] = person_id
            proposal["note"]        = "Declined by invitee"
        else:
            if all(i.get("accepted") is True for i in proposal["invitees"]):
                proposal["status"] = PROPOSAL_PENDING_PARENT

        await self.async_save()
        return proposal

    async def async_approve_group_proposal(
        self,
        proposal_id: str,
        approved_by: str,
    ) -> dict | None:
        """
        Parent approves a group reward proposal.

        Activates the store item as a group reward: sets is_group_reward=True,
        populates the contributors list with target_pts for each contributor, and
        restricts visibility to SCOPE_PERSONAL so only contributors see it.
        """
        proposal = self.get_group_proposal(proposal_id)
        if not proposal or proposal.get("status") != PROPOSAL_PENDING_PARENT:
            return None

        item = self.get_store_item(proposal["item_id"])
        if not item:
            return None

        proposal["status"]      = PROPOSAL_APPROVED
        proposal["resolved_at"] = _now_iso()
        proposal["resolved_by"] = approved_by

        # Compute target_pts at the default (rank-0) rate so all kids share
        # the same nominal cost regardless of individual rank.
        base_ppd    = self.get_rank_ppd(0)
        points_cost = round(item.get("dollar_value", 0) * base_ppd)

        all_contributors = (
            [{"person_id": proposal["proposed_by"], "share_pct": proposal["proposer_share_pct"]}]
            + [{"person_id": i["person_id"], "share_pct": i["share_pct"]} for i in proposal["invitees"]]
        )

        item["is_group_reward"] = True
        item["contributors"] = [
            {
                "person_id":       c["person_id"],
                "share_pct":       c["share_pct"],
                "contributed_pts": 0,
                "target_pts":      round(points_cost * c["share_pct"] / 100),
            }
            for c in all_contributors
        ]

        # Restrict scope so only contributors see it in their store.
        item["scope"]      = SCOPE_PERSONAL
        item["person_ids"] = [c["person_id"] for c in all_contributors]

        await self.async_save()
        return proposal

    async def async_decline_group_proposal(
        self,
        proposal_id: str,
        declined_by: str,
        reason: str = "",
    ) -> dict | None:
        """Parent declines a group reward proposal."""
        proposal = self.get_group_proposal(proposal_id)
        if not proposal or proposal.get("status") != PROPOSAL_PENDING_PARENT:
            return None

        proposal["status"]      = PROPOSAL_DECLINED
        proposal["resolved_at"] = _now_iso()
        proposal["resolved_by"] = declined_by
        proposal["note"]        = reason or "Declined by parent"

        await self.async_save()
        return proposal

    async def async_chip_in_group_reward(
        self,
        item_id: str,
        person_id: str,
        points: int,
    ) -> dict | None:
        """
        Kid chips in points toward a group reward.

        Points are deducted from the kid's balance immediately. The
        contributed_pts for this contributor on the store item is incremented.
        Capped so total contributed_pts never exceeds the contributor's target_pts.
        """
        item   = self.get_store_item(item_id)
        person = self.get_person(person_id)
        if not item or not person or not item.get("is_group_reward"):
            return None

        contrib = next(
            (c for c in item.get("contributors", []) if c.get("person_id") == person_id),
            None,
        )
        if not contrib:
            _LOGGER.warning(
                "Family Hub: chip_in_group_reward — %s is not a contributor on %s",
                person_id, item_id,
            )
            return None

        if points <= 0:
            return None

        if person.get("points_balance", 0) < points:
            _LOGGER.warning(
                "Family Hub: chip_in_group_reward — insufficient balance for %s (%d needed, %d available)",
                person_id, points, person.get("points_balance", 0),
            )
            return None

        # Cap at remaining share
        already   = contrib.get("contributed_pts", 0)
        target    = contrib.get("target_pts", 0)
        remaining = max(0, target - already)
        points    = min(points, remaining)
        if points <= 0:
            _LOGGER.info(
                "Family Hub: chip_in_group_reward — %s already at target for %s",
                person_id, item_id,
            )
            return None

        person["points_balance"] = person.get("points_balance", 0) - points
        contrib["contributed_pts"] = already + points

        self._append_history(
            event_type=HISTORY_GROUP_CHIP_IN,
            person_id=person_id,
            reference_id=item_id,
            points_delta=-points,
            balance_after=person["points_balance"],
            note=f'Chipped in {points}pts toward "{item["name"]}"',
        )
        await self.async_save()
        return item

    async def async_redeem_group_reward(
        self,
        item_id: str,
        redeemed_by: str,
    ) -> dict | None:
        """
        Parent marks a fully-funded group reward as redeemed.

        Creates an APPROVED redemption record for each contributor (no extra point
        deduction — points were already deducted at chip-in time). Marks the item
        inactive so it disappears from the store. Resets contributed_pts so the
        item can be re-activated later if desired.
        """
        item = self.get_store_item(item_id)
        if not item or not item.get("is_group_reward"):
            return None

        # Guard: all contributors must be at their target
        for contrib in item.get("contributors", []):
            if contrib.get("contributed_pts", 0) < contrib.get("target_pts", 0):
                _LOGGER.warning(
                    "Family Hub: redeem_group_reward — item %s not fully funded yet", item_id
                )
                return None

        now = _now_iso()
        for contrib in item.get("contributors", []):
            pid    = contrib.get("person_id")
            person = self.get_person(pid) if pid else None
            self._data["redemptions"].append({
                "id":            _new_id(),
                "store_item_id": item_id,
                "person_id":     pid,
                "points_cost":   contrib.get("contributed_pts", 0),
                "item_name":     item["name"],
                "status":        REDEMPTION_APPROVED,
                "requested_at":  now,
                "resolved_at":   now,
                "resolved_by":   redeemed_by,
                "note":          "Group reward redeemed",
            })
            self._append_history(
                event_type=HISTORY_GROUP_REDEEMED,
                person_id=pid,
                reference_id=item_id,
                points_delta=0,
                balance_after=person.get("points_balance", 0) if person else 0,
                note=f'Group reward "{item["name"]}" redeemed',
            )

        # Mark item inactive; reset chip-in totals for potential re-use.
        item["active"] = False
        for contrib in item.get("contributors", []):
            contrib["contributed_pts"] = 0

        await self.async_save()
        return item

    def get_group_reward_proposals_for_card(self) -> list[dict]:
        """
        All proposals in PROPOSAL_PENDING_PARENT state, enriched for the admin queue.
        """
        queue = []
        for prop in self.group_reward_proposals:
            if prop.get("status") != PROPOSAL_PENDING_PARENT:
                continue
            proposer = self.get_person(prop.get("proposed_by", ""))
            # Enrich invitees with names/colors
            enriched_invitees = []
            for inv in prop.get("invitees", []):
                p = self.get_person(inv.get("person_id", ""))
                enriched_invitees.append({
                    **inv,
                    "person_name":  p["name"]                    if p else "Unknown",
                    "person_color": p.get("avatar_color", "#7F77DD") if p else "#7F77DD",
                })
            queue.append({
                "proposal_id":       prop["id"],
                "item_id":           prop.get("item_id"),
                "item_name":         prop.get("item_name"),
                "proposed_by":       prop.get("proposed_by"),
                "proposer_name":     proposer["name"] if proposer else "Unknown",
                "proposer_color":    proposer.get("avatar_color", "#7F77DD") if proposer else "#7F77DD",
                "proposer_share_pct": prop.get("proposer_share_pct", 0),
                "proposed_at":       prop.get("proposed_at"),
                "invitees":          enriched_invitees,
            })
        return sorted(queue, key=lambda x: x.get("proposed_at") or "")

    def get_group_proposals_for_person(self, person_id: str) -> list[dict]:
        """
        Proposals that are pending THIS kid's response (status=pending_kid_acceptance
        and this person is an invitee who hasn't yet responded).
        """
        result = []
        for prop in self.group_reward_proposals:
            if prop.get("status") != PROPOSAL_PENDING_KIDS:
                continue
            invitee = next(
                (i for i in prop.get("invitees", []) if i.get("person_id") == person_id),
                None,
            )
            if not invitee or invitee.get("accepted") is not None:
                continue   # not invited, or already responded

            proposer = self.get_person(prop.get("proposed_by", ""))
            result.append({
                "proposal_id":    prop["id"],
                "item_id":        prop.get("item_id"),
                "item_name":      prop.get("item_name"),
                "proposed_by":    prop.get("proposed_by"),
                "proposer_name":  proposer["name"] if proposer else "Unknown",
                "proposer_color": proposer.get("avatar_color", "#7F77DD") if proposer else "#7F77DD",
                "my_share_pct":   invitee.get("share_pct", 0),
                "proposed_at":    prop.get("proposed_at"),
            })
        return result

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
        # Rate-limit check (item 5)
        max_pp = item.get("max_per_period", 0)
        if max_pp > 0:
            period = item.get("period", "week")
            if self._count_period_redemptions(person_id, item_id, period, date.today()) >= max_pp:
                _LOGGER.warning(
                    "Family Hub: redemption rate limit reached for %s / %s",
                    person_id, item_id,
                )
                return None
        # Use rank-adjusted cost (item 6)
        rank_index  = person.get("rank_index", 0)
        points_cost = round(item.get("dollar_value", 0) * self.get_rank_ppd(rank_index))
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
        self,
        redemption_id: str,
        approved_by: str,
        *,
        subscription_anchor: int | None = None,
    ) -> dict | None:
        redemption = self.get_redemption(redemption_id)
        if not redemption or redemption["status"] != REDEMPTION_PENDING:
            return None
        person = self.get_person(redemption["person_id"])
        if not person:
            return None

        item         = self.get_store_item(redemption.get("store_item_id", ""))
        is_sub_item  = item and item.get("item_type") == ITEM_TYPE_SUBSCRIPTION

        redemption["status"]      = REDEMPTION_APPROVED
        redemption["resolved_at"] = _now_iso()
        redemption["resolved_by"] = approved_by

        if is_sub_item:
            # Subscription approval: async_subscribe handles point deduction.
            # Do NOT deduct here — that would double-charge the kid.
            sub = await self.async_subscribe(
                redemption["person_id"],
                redemption.get("store_item_id", ""),
                anchor_override=subscription_anchor,
            )
            if not sub:
                # async_subscribe already logged the reason; revert the redemption.
                redemption["status"]      = REDEMPTION_PENDING
                redemption["resolved_at"] = None
                redemption["resolved_by"] = None
                await self.async_save()
                return None
            self._append_history(
                event_type=HISTORY_REDEMPTION_APPROVED,
                person_id=redemption["person_id"],
                reference_id=redemption_id,
                chore_name=redemption.get("item_name", ""),
                note=f"Subscription approved by {approved_by}",
            )
        else:
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
                chore_name=redemption.get("item_name", ""),
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
                # No matching task instance (pruned after retention, chore
                # deleted, instance manually removed, etc.). Render the row
                # using the cached chore_name + original event type. No
                # reversible action since the instance is gone, but the
                # row is still informational and must remain visible —
                # otherwise the History panel silently goes dark for any
                # person whose old task instances have been pruned.
                person = self.get_person(e.get("person_id", "")) if e.get("person_id") else None
                row = {
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
                }
                # Skipped entries still need skipped_date so the frontend can
                # roll them into the per-day collapsible group.
                if e["type"] == HISTORY_TASK_SKIPPED:
                    row["skipped_date"] = e["timestamp"][:10]
                result.append(row)

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

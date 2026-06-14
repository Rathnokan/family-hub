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
    CONF_PENALTIES_PAUSED_PERSON_KEY,
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
from .streaks_ranks_mixin import StreaksRanksMixin
from .subscriptions_mixin import SubscriptionsMixin
from .people_mixin import PeopleMixin
from .chores_mixin import ChoresMixin
from .tasks_mixin import TasksMixin
from .store_items_mixin import StoreItemsMixin
from .group_rewards_mixin import GroupRewardsMixin
from .redemptions_mixin import RedemptionsMixin
from .history_admin_mixin import HistoryAdminMixin

_LOGGER = logging.getLogger(__name__)




class FamilyHubDataStore(CardShaperMixin, TickMixin, StreaksRanksMixin, SubscriptionsMixin, PeopleMixin, ChoresMixin, TasksMixin, StoreItemsMixin, GroupRewardsMixin, RedemptionsMixin, HistoryAdminMixin):
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
            # v0.7.2: all theme ladders standardized to 5 rungs (indices 0-4).
            # Clamp kids who sat above index 4 on the old 6/7-rung ladders down to
            # the top rung. Parents keep the 999 "always max" sentinel.
            if person.get("type") != "parent":
                person["rank_index"] = max(0, min(int(person.get("rank_index", 0)), 4))
            person.setdefault("rank_drop_threshold", None)  # legacy scalar (None = use global)
            person.setdefault("rank_gain_threshold", None)  # legacy scalar (None = use global)
            # v0.7.2: per-rank threshold curves — length-5 arrays indexed by rank.
            # None = fall back to the legacy scalar, then the global setting.
            # rank_curve remembers the generator knobs so the editor can repopulate.
            person.setdefault("rank_drop_thresholds", None)
            person.setdefault("rank_gain_thresholds", None)
            person.setdefault("rank_curve", None)
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
        s.setdefault("rank_drop_threshold", 50)  # absolute fallback (pts) for kids w/o a curve
        s.setdefault("rank_gain_threshold", 75)
        # v0.7.2: global default band as percentages of a default capacity. These
        # pre-fill the Global tab and derive the absolute fallback thresholds above.
        s.setdefault("rank_default_cap",      100)
        s.setdefault("rank_default_drop_pct", 60)
        s.setdefault("rank_default_gain_pct", 80)

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
        # Read the PER-PERSON flag with the per-person key (not the global key).
        # Both constants currently equal "penalties_paused", so this is
        # behaviour-preserving — it just removes the semantic trap that bit us
        # before (a future rename of either key would otherwise diverge silently).
        if person and person.get(CONF_PENALTIES_PAUSED_PERSON_KEY, DEFAULT_PENALTIES_PAUSED_PERSON):
            return True
        return False

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
        rank_default_cap: int | None = None,
        rank_default_drop_pct: int | None = None,
        rank_default_gain_pct: int | None = None,
        rank_dynamic_capacity: bool | None = None,
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
        if rank_default_cap is not None:
            s["rank_default_cap"] = rank_default_cap
        if rank_default_drop_pct is not None:
            s["rank_default_drop_pct"] = rank_default_drop_pct
        if rank_default_gain_pct is not None:
            s["rank_default_gain_pct"] = rank_default_gain_pct
        if rank_dynamic_capacity is not None:
            s["rank_dynamic_capacity"] = rank_dynamic_capacity
        await self.async_save()

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

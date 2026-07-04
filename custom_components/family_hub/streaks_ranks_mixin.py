"""Family Hub - StreaksRanksMixin (extracted from data_store.py, v0.7.0 P4).

Streak / rotation / rank helpers + weekly rank evaluation.
Mixed into FamilyHubDataStore; all methods operate on self (no behaviour change).
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
    HISTORY_WEEKLY_COMPLETION_STREAK_MILESTONE,
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

_LOGGER = logging.getLogger(__name__)


class StreaksRanksMixin:
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

    def _get_skip_streak(self, person_id: str, chore_id: str) -> int:
        """Return the consecutive-skip count for this person+chore (0 if none).

        Counterpart to `_get_streak` for the daily-chore grace penalty: this is
        the number of consecutive skips already accrued. The card uses it to tell
        whether skipping a chore *today* would still fall inside the grace window
        (skip_streak + 1 < daily_penalty_after_days ⇒ no penalty yet).
        """
        person = self.get_person(person_id)
        if not person:
            return 0
        return person.get("streaks", {}).get(chore_id, {}).get("skips", 0)

    def _break_streak(self, person_id: str, chore_id: str) -> None:
        """Reset streak to 0. Called when a chore is skipped and not paused."""
        person = self.get_person(person_id)
        if not person:
            return
        streaks = person.setdefault("streaks", {})
        if chore_id in streaks and streaks[chore_id].get("count", 0) > 0:
            streaks[chore_id]["count"] = 0

    def _bump_skip_streak(self, person_id: str, chore_id: str) -> int:
        """
        Increment and return the consecutive-skip ('reverse streak') counter for a
        person+chore. Powers the daily-chore grace penalty: on a DAILY chore,
        `daily_penalty_after_days` is the number of consecutive skips allowed before
        the penalty starts. Reset to 0 on completion (see _increment_streak).
        """
        person = self.get_person(person_id)
        if not person:
            return 0
        streaks = person.setdefault("streaks", {})
        entry = streaks.setdefault(chore_id, {"count": 0, "last_completed": None})
        entry["skips"] = entry.get("skips", 0) + 1
        return entry["skips"]

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
        entry["skips"] = 0   # completing resets the consecutive-skip grace counter
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

    async def async_set_weekly_completion_streak(self, person_id: str, count: int) -> bool:
        """Admin override: set a person's weekly-consistency streak count directly."""
        person = self.get_person(person_id)
        if not person:
            return False
        person["weekly_completion_streak"] = max(0, count)
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Progress stats (v0.7.6) — daily + weekly chore-completion progress
    # ------------------------------------------------------------------

    # A chore instance counts as "done" the moment the kid marks it, so the
    # progress bars give immediate feedback (parent approval can still be
    # pending). Mirrors tick_mixin's daily success-streak COMPLETED_STATUSES.
    _PROGRESS_DONE = (STATUS_APPROVED, STATUS_SELF_REPORTED, STATUS_PENDING_APPROVAL)

    def _progress_week_window(self, ref: date) -> tuple[date, date]:
        """(week_start, week_end_exclusive) for the rank week containing `ref`.

        Anchored to the configured rank_eval_weekday so the weekly progress bar,
        the weekly-consistency streak, and the rank bar all share one week. Python
        date.weekday() and the stored eval weekday both use 0 = Monday.
        """
        eval_wd = self._data["settings"].get("rank_eval_weekday", 0)
        days_since = (ref.weekday() - eval_wd) % 7
        start = ref - timedelta(days=days_since)
        return start, start + timedelta(days=7)

    def _period_points(
        self, person_id: str, start: date, end: date, daily_only: bool = False
    ) -> tuple[int, int]:
        """(earned, possible) chore POINTS over real instances due in [start, end).

        possible = base points of ASSIGNED chores due to the kid (excused days
        excluded) — the points they're expected to earn. earned = those that are
        done, PLUS points from any CLAIMABLE/bonus chores the kid completed in the
        window. Bonus points lift the numerator only (they're not "required"), so
        doing extra can help reach or hold a streak even when a required chore
        slips. `daily_only` restricts the required set to DAILY-recurrence chores
        (the daily bar/streak); the weekly side counts every assigned chore.

        Points, not counts, so harder chores weigh more and a kid with 10 chores
        isn't held to a different bar than a kid with 8.
        """
        start_s, end_s = start.isoformat(), end.isoformat()
        earned = possible = 0
        for inst in self.task_instances:
            due = inst.get("due_date", "")
            if not (start_s <= due < end_s):
                continue
            if inst.get("status") == STATUS_EXCUSED:
                continue
            chore = self.get_chore(inst.get("chore_id"))
            if not chore:
                continue
            ctype   = chore.get("chore_type")
            pts     = chore.get("points", 0)
            is_done = inst.get("status") in self._PROGRESS_DONE
            if ctype == CHORE_TYPE_ASSIGNED:
                if inst.get("assigned_to") != person_id:
                    continue
                if daily_only and (chore.get("recurrence") or {}).get("type", RECURRENCE_DAILY) != RECURRENCE_DAILY:
                    continue
                possible += pts
                if is_done:
                    earned += pts
            elif ctype == CHORE_TYPE_CLAIMABLE:
                # Bonus chore — counts toward earned only, and only when this kid
                # is the one who completed it.
                if is_done and inst.get("completed_by") == person_id:
                    earned += pts
        return earned, possible

    def _projected_owner(self, chore: dict, person_id: str) -> bool:
        """Would this chore's instance on a FUTURE day belong to person_id?

        Non-rotating: the kid is in assigned_to. Rotating: only the current
        holder is projected forward (a snapshot — actual hand-offs self-correct
        as real instances materialise each day).
        """
        if chore.get("rotation_pool"):
            assigned = chore.get("assigned_to") or []
            return bool(assigned) and assigned[0] == person_id
        return person_id in (chore.get("assigned_to") or [])

    def get_daily_progress(self, person_id: str) -> tuple[int, int]:
        """(earned, possible) POINTS for TODAY's DAILY chores, plus any bonus
        points earned today. Drives the daily progress bar and shares its basis
        with the daily success-streak, so the bar and the streak agree.
        """
        today = date.today()
        return self._period_points(person_id, today, today + timedelta(days=1), daily_only=True)

    def get_week_progress(self, person_id: str) -> tuple[int, int]:
        """(earned, possible) POINTS for the CURRENT rank week across ALL assigned
        chores, plus bonus earned. The full-week possible total the kid fills up
        over the week. Past/today come from real instances (accurate
        rotation/excusals); the remaining days' required points are projected from
        each chore's recurrence + current assignment.
        """
        today = date.today()
        start, end = self._progress_week_window(today)
        # Real portion: week-start through end of today.
        real_end = min(today + timedelta(days=1), end)
        earned, possible = self._period_points(person_id, start, real_end, daily_only=False)
        # Projected portion: tomorrow through the end of the week (required pts).
        person = self.get_person(person_id)
        if person:
            d = max(start, today + timedelta(days=1))
            while d < end:
                for chore in self.get_active_chores():
                    if chore.get("chore_type") != CHORE_TYPE_ASSIGNED:
                        continue
                    if not self._is_due_on_date(chore, d):
                        continue
                    if self._projected_owner(chore, person_id):
                        possible += chore.get("points", 0)
                d += timedelta(days=1)
        return earned, possible

    async def _async_process_weekly_completion_streaks(self, tick_date: date) -> None:
        """Evaluate the just-finished week's overall chore-completion rate per kid
        and update their weekly-consistency streak.

        Mirrors `_async_process_completion_streaks` (daily) but at the rank-week
        boundary: a "good week" = done/total over ALL assigned chores due that
        week >= weekly_completion_threshold_pct. Hit the milestone (every N
        consecutive good weeks) → award weekly_completion_bonus_points + log.
        Miss → reset to 0. Skipped while penalties are paused, for parents, and
        when the feature is off (weekly_completion_milestone == 0).
        """
        s = self._data["settings"]
        eval_weekday = s.get("rank_eval_weekday", 0)  # 0 = Monday
        if tick_date.weekday() != eval_weekday:
            return

        global_paused = s.get("penalties_paused", False)
        week_start = tick_date - timedelta(days=7)
        week_end   = tick_date
        week_start_s = week_start.isoformat()

        for person in self.get_active_people():
            if person.get("type") != "kid":
                continue
            if global_paused or person.get("penalties_paused"):
                continue
            if person.get("weekly_completion_milestone", 0) == 0:
                continue

            last_eval = person.get("last_weekly_completion_eval_date")
            if last_eval and last_eval >= week_start_s:
                continue  # already evaluated this week (catch-up safety)

            earned, possible = self._period_points(person["id"], week_start, week_end, daily_only=False)
            if possible == 0:
                # Rest week — nothing was assigned. Advance cursor, leave streak.
                person["last_weekly_completion_eval_date"] = week_start_s
                continue

            hit_pct   = (earned / possible) * 100
            threshold = person.get("weekly_completion_threshold_pct", 80)

            if hit_pct >= threshold:
                person["weekly_completion_streak"] = person.get("weekly_completion_streak", 0) + 1
                milestone = person.get("weekly_completion_milestone", 4)
                if milestone > 0 and person["weekly_completion_streak"] % milestone == 0:
                    bonus = person.get("weekly_completion_bonus_points", 100)
                    if bonus > 0:
                        person["points_balance"]  = person.get("points_balance", 0)  + bonus
                        person["points_lifetime"] = person.get("points_lifetime", 0) + bonus
                        self._append_history(
                            event_type=HISTORY_WEEKLY_COMPLETION_STREAK_MILESTONE,
                            person_id=person["id"],
                            reference_id=_new_id(),
                            points_delta=bonus,
                            balance_after=person["points_balance"],
                            note=f"{person['weekly_completion_streak']}-week consistency streak",
                        )
                        _LOGGER.info(
                            "Family Hub: weekly-consistency bonus — %s %dpts (streak=%d wks, hit=%.0f%%)",
                            person.get("name", person["id"]),
                            bonus, person["weekly_completion_streak"], hit_pct,
                        )
            else:
                if person.get("weekly_completion_streak", 0) > 0:
                    _LOGGER.info(
                        "Family Hub: weekly-consistency streak broken — %s (was %d wks, hit=%.0f%% < %d%%)",
                        person.get("name", person["id"]),
                        person.get("weekly_completion_streak", 0), hit_pct, threshold,
                    )
                person["weekly_completion_streak"] = 0

            person["last_weekly_completion_eval_date"] = week_start_s

    def _effective_rank_thresholds(self, person: dict, idx: int) -> tuple[int, int]:
        """Resolve the (drop, gain) weekly-point thresholds for a person at rank `idx`.

        Resolution order, independently for drop and gain:
          1. Per-rank array (`rank_drop_thresholds` / `rank_gain_thresholds`),
             clamped into bounds so a rank_index past the array length resolves
             to the top rung (mirrors `get_rank_cents_per_pt`).
          2. Legacy scalar override (`rank_drop_threshold` / `rank_gain_threshold`).
          3. Global setting.
        Keeping the scalar + global fallbacks means kids configured under the old
        model keep evaluating correctly until they're given a per-rank curve.
        """
        s = self._data["settings"]
        global_drop = s.get("rank_drop_threshold", 50)
        global_gain = s.get("rank_gain_threshold", 75)

        def _resolve(arr_key: str, scalar_key: str, global_val: int) -> int:
            arr = person.get(arr_key)
            if isinstance(arr, list) and arr:
                j = max(0, min(int(idx), len(arr) - 1))
                return int(arr[j])
            scalar = person.get(scalar_key)
            if scalar is not None:
                return int(scalar)
            return int(global_val)

        drop = _resolve("rank_drop_thresholds", "rank_drop_threshold", global_drop)
        gain = _resolve("rank_gain_thresholds", "rank_gain_threshold", global_gain)
        return drop, gain

    def _effective_rank_pcts(self, person: dict, idx: int) -> tuple[float, float]:
        """Resolve the (drop%, gain%) bands for a person at rank `idx`.

        Used by the dynamic-capacity mode: the band % is multiplied by the week's
        assigned points to get an absolute threshold. Resolution: per-rank curve
        arrays (`rank_curve.drop_pcts`/`gain_pcts`) → global defaults.
        """
        s = self._data["settings"]
        g_drop = s.get("rank_default_drop_pct", 60)
        g_gain = s.get("rank_default_gain_pct", 80)
        curve  = person.get("rank_curve") or {}

        def _pick(arr_key: str, global_val: float) -> float:
            arr = curve.get(arr_key)
            if isinstance(arr, list) and arr:
                j = max(0, min(int(idx), len(arr) - 1))
                return float(arr[j])
            return float(global_val)

        return _pick("drop_pcts", g_drop), _pick("gain_pcts", g_gain)

    def _assignable_week_points(self, person_id: str, week_start: str, week_end: str) -> int:
        """Total points DIRECTLY ASSIGNED to a kid during [week_start, week_end).

        Sums the base points of every assigned-type chore instance due to this
        person in the window — i.e. the most they could earn from their own
        chores that week. Deliberately excludes claimable/"bonus" chores and
        reminders (only CHORE_TYPE_ASSIGNED counts); streak-milestone bonuses are
        separate point awards, never instance points, so they're excluded too.
        Counts each instance regardless of completion (it's the assigned ceiling).
        """
        total = 0
        for inst in self.task_instances:
            if inst.get("assigned_to") != person_id:
                continue
            due = inst.get("due_date", "")
            if not (week_start <= due < week_end):
                continue
            chore = self.get_chore(inst.get("chore_id"))
            if not chore or chore.get("chore_type") != CHORE_TYPE_ASSIGNED:
                continue
            total += chore.get("points", 0)
        return total

    async def _async_process_weekly_ranks(self, tick_date: date) -> None:
        """
        Evaluate last week's point performance and adjust rank_index.
        Fires only on the configured rank_eval_weekday (default Monday = 0).
        Parents are always max rank — skipped.
        Each person moves at most ±1 rank per evaluation cycle.
        Thresholds are resolved per-rank per-person via _effective_rank_thresholds.
        """
        s = self._data["settings"]
        eval_weekday = s.get("rank_eval_weekday", 0)  # 0 = Monday
        dynamic = s.get("rank_dynamic_capacity", True)

        if tick_date.weekday() != eval_weekday:
            return

        # Week we're evaluating: the 7 days ending (exclusive) on tick_date
        week_end   = tick_date.isoformat()
        week_start = (tick_date - timedelta(days=7)).isoformat()

        for person in self.get_active_people():
            if person.get("type") == "parent":
                continue
            # v0.7.6: a manually-locked rank is left untouched by the weekly eval.
            if person.get("rank_locked"):
                continue

            current_idx = person.get("rank_index", 0)

            if dynamic:
                # v0.7.6: thresholds scale with the points actually ASSIGNED to
                # this kid during the evaluated week (direct chores only — no
                # bonus/claimable, no streak bonus). A rest week (nothing
                # assigned) leaves the rank untouched.
                assignable = self._assignable_week_points(person["id"], week_start, week_end)
                if assignable <= 0:
                    continue
                drop_pct, gain_pct = self._effective_rank_pcts(person, current_idx)
                drop_thr = round(assignable * drop_pct / 100)
                gain_thr = round(assignable * gain_pct / 100)
            else:
                drop_thr, gain_thr = self._effective_rank_thresholds(person, current_idx)

            weekly_pts = sum(
                e.get("points_delta", 0)
                for e in self._data.get("history", [])
                if (
                    e.get("person_id") == person["id"]
                    and e.get("points_delta", 0) > 0
                    and week_start <= e.get("timestamp", "")[:10] < week_end
                )
            )

            if weekly_pts >= gain_thr:
                new_idx = min(4, current_idx + 1)  # all theme ladders are 5 rungs (0-4)
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


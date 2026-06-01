"""Family Hub - daily-tick engine mixin (extracted from data_store.py, v0.7.0 P4).

Scheduled allowances, success-rate streaks, instance generation, skip/penalty
processing, expiry, and history/instance trimming. Mixed into FamilyHubDataStore;
all methods operate on self (no behaviour change).
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

_LOGGER = logging.getLogger(__name__)


class TickMixin:
    """The daily-tick engine (see module docstring)."""

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
    # v0.6.1: Success-rate person streak
    # ------------------------------------------------------------------

    async def _async_process_completion_streaks(self, tick_date: date) -> None:
        """
        Evaluate yesterday's completion rate per kid and update their
        person-level success-rate streak.

        Definition: hit_pct = completed / (completed + skipped) over assigned chores
        that were actually due to this kid yesterday. If hit_pct >= threshold_pct,
        increment streak. Otherwise reset to 0. On reaching a milestone (every N
        consecutive days at threshold), award bonus points and log a history event.

        Rules:
          - Skip if penalties_paused (global or per-person) — no streak motion
          - Skip parents
          - Skip if completion_milestone == 0 (feature disabled per-person)
          - Skip if already evaluated for yesterday (catch-up safety via
            last_completion_eval_date)
          - If zero chores were due yesterday, treat as rest day: cursor advances,
            streak unchanged

        Only ASSIGNED chores count. Claimable/reminder chores don't contribute
        because they have no "due to person X" semantics.
        """
        settings = self._data["settings"]
        global_paused = settings.get("penalties_paused", False)

        yesterday = tick_date - timedelta(days=1)
        yesterday_str = yesterday.isoformat()

        chores_by_id = {c["id"]: c for c in self._data.get("chores", [])}

        for person in self.get_active_people():
            if person.get("type") != "kid":
                continue
            if global_paused or person.get("penalties_paused"):
                continue
            if person.get("completion_milestone", 0) == 0:
                continue

            last_eval = person.get("last_completion_eval_date")
            if last_eval and last_eval >= yesterday_str:
                continue  # already evaluated this day

            # Count assigned chores due to THIS person yesterday.
            # Excused instances are treated as rest days (not counted either way).
            COMPLETED_STATUSES = (STATUS_APPROVED, STATUS_SELF_REPORTED, STATUS_PENDING_APPROVAL)
            EXCLUDED_STATUSES  = (STATUS_EXCUSED,)  # don't count in numerator OR denominator

            due_count       = 0
            completed_count = 0
            for inst in self.task_instances:
                if inst.get("due_date") != yesterday_str:
                    continue
                if inst.get("assigned_to") != person["id"]:
                    continue
                chore = chores_by_id.get(inst.get("chore_id"))
                if not chore or chore.get("chore_type") != CHORE_TYPE_ASSIGNED:
                    continue
                status = inst.get("status")
                if status in EXCLUDED_STATUSES:
                    continue
                due_count += 1
                if status in COMPLETED_STATUSES:
                    completed_count += 1

            if due_count == 0:
                # Rest day — no chores were due, advance cursor without touching streak
                person["last_completion_eval_date"] = yesterday_str
                continue

            hit_pct   = (completed_count / due_count) * 100
            threshold = person.get("completion_threshold_pct", 80)

            if hit_pct >= threshold:
                person["completion_streak"] = person.get("completion_streak", 0) + 1
                milestone = person.get("completion_milestone", 7)
                if milestone > 0 and person["completion_streak"] % milestone == 0:
                    bonus = person.get("completion_bonus_points", 50)
                    person["points_balance"]  = person.get("points_balance", 0)  + bonus
                    person["points_lifetime"] = person.get("points_lifetime", 0) + bonus
                    self._append_history(
                        event_type=HISTORY_COMPLETION_STREAK_MILESTONE,
                        person_id=person["id"],
                        reference_id=_new_id(),
                        points_delta=bonus,
                        balance_after=person["points_balance"],
                        note=f"{person['completion_streak']}-day success streak",
                    )
                    _LOGGER.info(
                        "Family Hub: success-streak bonus — %s %dpts (streak=%d, hit=%.0f%%)",
                        person.get("name", person["id"]),
                        bonus, person["completion_streak"], hit_pct,
                    )
                    # v0.6.3 item 7: award 1 freeze token at every milestone so
                    # sustained effort earns protection against future bad days.
                    person["streak_freezes_available"] = person.get("streak_freezes_available", 0) + 1
                    _LOGGER.info(
                        "Family Hub: streak freeze token awarded — %s now has %d",
                        person.get("name", person["id"]),
                        person["streak_freezes_available"],
                    )
            else:
                if person.get("completion_streak", 0) > 0:
                    # v0.6.3 item 7: auto-spend one freeze token to protect the streak.
                    freezes = person.get("streak_freezes_available", 0)
                    if freezes > 0:
                        person["streak_freezes_available"] = freezes - 1
                        _LOGGER.info(
                            "Family Hub: streak freeze spent — %s streak protected "
                            "(was %.0f%% hit, needed %.0f%%), %d token(s) remaining",
                            person.get("name", person["id"]),
                            hit_pct, threshold,
                            person["streak_freezes_available"],
                        )
                    else:
                        _LOGGER.info(
                            "Family Hub: success-streak broken — %s (was %d days, hit=%.0f%%)",
                            person.get("name", person["id"]),
                            person.get("completion_streak", 0), hit_pct,
                        )
                        person["completion_streak"] = 0
                else:
                    person["completion_streak"] = 0

            person["last_completion_eval_date"] = yesterday_str

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
            # v0.6.1: evaluate yesterday's completion rate AFTER the tick has
            # finalised yesterday's skipped-state. Must run before allowance so
            # the bonus and allowance show as separate history entries on the
            # same day rather than commingling.
            await self._async_process_completion_streaks(current)
            await self._async_process_allowances(current)
            await self._async_process_weekly_ranks(current)
            await self._async_process_subscriptions(current)
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
        # Rotation pre-pass (v0.6.2). For "daily" cadence, advance once per
        # tick_date regardless of whether the chore is due today — that keeps
        # the rotation in sync with calendar time even across catch-up days.
        # For "weekly" cadence, advance on Mondays only. The "per_instance"
        # cadence is handled inline below at instance-creation time so it
        # naturally tracks the chore's own recurrence. Only assigned chores
        # rotate; claimable/reminder ignore the pool even if one is configured.
        for chore in self.get_active_chores():
            if chore.get("chore_type") != CHORE_TYPE_ASSIGNED:
                continue
            if not chore.get("rotation_pool"):
                continue
            cadence = chore.get("rotation_cadence", "")
            if cadence == "daily":
                await self._maybe_advance_rotation(chore, tick_date)
            elif cadence == "weekly" and tick_date.weekday() == 0:
                await self._maybe_advance_rotation(chore, tick_date)

        for chore in self.get_active_chores():
            r_type = chore["recurrence"].get("type", RECURRENCE_DAILY)
            if r_type == RECURRENCE_ONE_TIME:
                continue
            if not self._is_due_on_date(chore, tick_date):
                continue

            # Per-instance rotation: advance just before generating today's
            # instance. Idempotent on catch-up loops (last_advanced dedupes).
            if (chore.get("chore_type") == CHORE_TYPE_ASSIGNED
                    and chore.get("rotation_pool")
                    and chore.get("rotation_cadence") == "per_instance"):
                await self._maybe_advance_rotation(chore, tick_date)

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

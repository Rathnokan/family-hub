"""
Family Hub — maintenance scheduling (v0.8.0, pure functions).

No Home Assistant imports — just date math, so these are unit-testable in
isolation. Maintenance tasks carry `next_due` / `last_completed`; the lifecycle
STATE (scheduled / upcoming / due / overdue / snoozed / disabled) is DERIVED
here, never stored. `completed` / `skipped` are events (completion records), not
states.

schedule_mode:
  • from_completion  — next_due floats from the ACTUAL completion date (a filter
    changed two weeks late pushes the next change two weeks later).
  • calendar_anchored — next_due snaps to the seasonal anchor and NEVER drifts:
    a late completion still leaves the next occurrence on its anchor (termite
    inspection, pre-monsoon roof check, February pre-emergent…).
"""

from __future__ import annotations

import calendar
from datetime import date, timedelta

# Lifecycle states (derived)
STATE_DISABLED = "disabled"
STATE_SNOOZED = "snoozed"
STATE_OVERDUE = "overdue"
STATE_DUE = "due"
STATE_UPCOMING = "upcoming"
STATE_SCHEDULED = "scheduled"

_DEFAULT_LEAD_DAYS = 14


def _safe_date(year: int, month: int, day: int) -> date:
    """A date clamped to the last valid day of the month (Jan 31 + 1mo → Feb 28/29)."""
    last = calendar.monthrange(year, month)[1]
    return date(year, month, min(day, last))


def _add_months(d: date, months: int) -> date:
    total = d.month - 1 + months
    year = d.year + total // 12
    month = total % 12 + 1
    return _safe_date(year, month, d.day)


def advance(d: date, interval: int, unit: str) -> date:
    """d advanced by interval×unit, with month/year day-clamping."""
    interval = max(1, int(interval or 1))
    if unit == "days":
        return d + timedelta(days=interval)
    if unit == "weeks":
        return d + timedelta(weeks=interval)
    if unit == "months":
        return _add_months(d, interval)
    if unit == "years":
        return _add_months(d, interval * 12)
    return d + timedelta(days=interval)  # unknown unit → treat as days


def _anchor_list(anchor) -> list[dict]:
    """Normalize a task's seasonal_anchor to a list of {month, day} dicts.

    Accepts a single dict (the original single-anchor form), a list of dicts (the
    D1 multi-occurrence form, e.g. "April & October" or a quarterly set), or None.
    """
    if isinstance(anchor, dict):
        return [anchor]
    if isinstance(anchor, list):
        return [a for a in anchor if isinstance(a, dict)]
    return []


def _next_single_anchor(anchor: dict, interval: int, unit: str, after: date) -> date:
    """Next occurrence of ONE calendar anchor strictly after `after`.

    anchor = {"month": M|None, "day": D}. month=None means a monthly anchor on
    day D (e.g. migrated monthly_on_date chores); a real month means a
    yearly/seasonal anchor on that month/day.
    """
    day = int(anchor.get("day") or 1)
    month = anchor.get("month")
    interval = max(1, int(interval or 1))

    if month:
        step_years = interval if unit == "years" else 1
        candidate = _safe_date(after.year, int(month), day)
        while candidate <= after:
            candidate = _safe_date(candidate.year + step_years, int(month), day)
        return candidate

    # Monthly anchor (no fixed month) — step by interval months.
    step_months = interval if unit == "months" else (interval * 12 if unit == "years" else 1)
    candidate = _safe_date(after.year, after.month, day)
    while candidate <= after:
        candidate = _add_months(candidate, step_months)
    return candidate


def _next_anchor(anchor, interval: int, unit: str, after: date) -> date:
    """Next occurrence of a calendar anchor strictly after `after`.

    With MULTIPLE anchors the list itself defines the cadence and `interval` is
    ignored for anchoring — the next occurrence is simply the earliest of the
    anchors that falls after `after`. That is what lets unevenly-spaced pairs work
    ("June pre-monsoon & October post-monsoon" is 4 and 8 months apart, so no
    single anchor + interval can express it). A single anchor behaves exactly as
    it always has.
    """
    anchors = _anchor_list(anchor)
    if not anchors:
        return _next_single_anchor({}, interval, unit, after)
    if len(anchors) == 1:
        return _next_single_anchor(anchors[0], interval, unit, after)
    return min(_next_single_anchor(a, 1, "years", after) for a in anchors)


def compute_next_due(task: dict, completed_on: date) -> date | None:
    """Next due date after a completion on `completed_on`. None for one-shot tasks
    (no recurrence) — the caller disables the task once it's done."""
    rec = task.get("recurrence")
    if not rec:
        return None
    interval = int(rec.get("interval", 1) or 1)
    unit = rec.get("unit", "months")
    if task.get("schedule_mode") == "calendar_anchored":
        return _next_anchor(task.get("seasonal_anchor"), interval, unit, after=completed_on)
    return advance(completed_on, interval, unit)


def initial_next_due(task: dict, today: date) -> date | None:
    """First due date for a freshly created task with no completion history.

    calendar_anchored → the next anchor occurrence after today (never in the
    past). from_completion → one interval from today (the task is presumed just
    set up / just done). One-shot (no recurrence) → today, so it surfaces once.
    """
    rec = task.get("recurrence")
    if task.get("schedule_mode") == "calendar_anchored":
        return _next_anchor(task.get("seasonal_anchor"),
                            int((rec or {}).get("interval", 1) or 1),
                            (rec or {}).get("unit", "years"), after=today)
    if not rec:
        return today
    return advance(today, int(rec.get("interval", 1) or 1), rec.get("unit", "months"))


def _parse(iso: str | None) -> date | None:
    if not iso:
        return None
    try:
        return date.fromisoformat(iso)
    except ValueError:
        return None


def effective_due(task: dict) -> date | None:
    """The date the task actually surfaces on: the snooze date while snoozed,
    otherwise next_due. None if the task has no scheduled next occurrence."""
    nd = _parse(task.get("next_due"))
    snz = _parse(task.get("snoozed_until"))
    if snz and (nd is None or snz > nd):
        return snz
    return nd


def task_state(task: dict, today: date) -> str:
    """Derived lifecycle state for a task on `today`."""
    if not task.get("enabled", True):
        return STATE_DISABLED
    snz = _parse(task.get("snoozed_until"))
    if snz and snz > today:
        return STATE_SNOOZED
    nd = _parse(task.get("next_due"))
    if nd is None:
        return STATE_SCHEDULED
    if nd < today:
        return STATE_OVERDUE
    if nd == today:
        return STATE_DUE
    lead = int(task.get("lead_time_days", _DEFAULT_LEAD_DAYS) or _DEFAULT_LEAD_DAYS)
    if nd <= today + timedelta(days=lead):
        return STATE_UPCOMING
    return STATE_SCHEDULED

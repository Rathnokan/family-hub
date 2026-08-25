"""
Family Hub — card model assembly (v0.7.0 P2).

Single source of truth for the data payloads the dashboard card consumes.
Both the sensor platform (`extra_state_attributes`) and the websocket
`family_hub/get_model` command build their data here, so the two can never
drift. `build_card_model()` returns a dict keyed by entity_id, mirroring the
sensor-attribute shape the card already reads via `card._attrs(<entity_id>)`.

v0.7.0 staging:
  • P2 step 1 (now): sensors delegate their full payloads here; the websocket
    model returns the same data. Behaviour-preserving.
  • P2 step 3: sensors shrink to small scalar attrs; the FULL payloads live
    ONLY here and reach the card via the websocket model.
  • P3: this module moves under data/model.py and the per-domain packages
    contribute their own sections.
"""

from __future__ import annotations

from datetime import date, timedelta

from .const import (
    ACTIVE_STATUSES,
    CHORE_TYPE_ASSIGNED,
    MAINTENANCE_DUE_SOON_DAYS,
    RECURRENCE_DAILY,
    REDEMPTION_PENDING,
    STATUS_PENDING_APPROVAL,
)
from ._maintenance_schedule import effective_due, task_state
from .modules import MODULE_IDS


def _modules_map(store) -> dict:
    """v0.8.0: {module_id: enabled_bool} for every module, so the card can hide
    a disabled module's room tile / drill-down / affordances. Missing
    enabled_modules (defensive) reads as all-on."""
    enabled = getattr(store, "enabled_modules", None)
    return {mid: (enabled is None or mid in enabled) for mid in MODULE_IDS}


def _on(store, module_id: str) -> bool:
    """True if a module is enabled (defensive: missing enabled_modules = all-on)."""
    enabled = getattr(store, "enabled_modules", None)
    return enabled is None or module_id in enabled


def _chore_occ_per_week(chore) -> float:
    """Average times/week a chore comes due, from its recurrence. Mirrors the
    card's _choreOccPerWeek. One-time / unknown → 0."""
    rec   = chore.get("recurrence", {}) or {}
    rtype = rec.get("type", "daily")
    if rtype == "daily":
        df = rec.get("day_filter") or []
        return len(df) if df else 7
    if rtype == "weekly":
        wd = rec.get("weekdays") or []
        return len(wd) if wd else 1
    if rtype == "every_n_days":
        n = rec.get("interval", 1) or 1
        return 7 / n if n > 0 else 0
    if rtype == "every_n_weeks":
        n = rec.get("interval", 1) or 1
        return 1 / n if n > 0 else 0
    if rtype == "monthly_on_date":
        days = rec.get("days_of_month") or []
        dom  = len(days) if days else 1
        return dom * 12 / 52
    return 0


def assigned_points_per_week(store, person_id: str) -> int:
    """Points DIRECTLY ASSIGNED to a kid in a typical week — the basis the admin
    shows for the dynamic rank capacity. Active assigned-type chores where the
    kid is the current holder (assigned_to), at full points × weekly occurrence.
    Excludes claimable/bonus + reminders; streak bonuses aren't chore points.
    Mirrors streaks_ranks_mixin._assignable_week_points for current assignments."""
    total = 0.0
    for c in store.get_active_chores():
        if c.get("chore_type") != CHORE_TYPE_ASSIGNED:
            continue
        if person_id not in (c.get("assigned_to") or []):
            continue
        total += _chore_occ_per_week(c) * c.get("points", 0)
    return round(total)


def _rank_eff_for_card(store, person) -> dict:
    """{rank_drop_eff, rank_gain_eff} — the ACTUAL weekly-point thresholds for the
    person at their current rank, resolved the same way the weekly rank evaluation
    does. In dynamic-capacity mode (default) these are a % of the kid's weekly
    assigned points (assigned_ppw basis, matching the admin Ranks drawer);
    otherwise the static per-rank/scalar/global thresholds. The card renders these
    directly so the rank bar can never drift from how rank-ups are actually judged.
    Parents (max rank) get zeros.
    """
    if person.get("type") == "parent":
        return {"rank_drop_eff": 0, "rank_gain_eff": 0}
    idx = person.get("rank_index", 0)
    if store._data["settings"].get("rank_dynamic_capacity", True):
        basis = assigned_points_per_week(store, person["id"])
        drop_pct, gain_pct = store._effective_rank_pcts(person, idx)
        return {
            "rank_drop_eff": round(basis * drop_pct / 100),
            "rank_gain_eff": round(basis * gain_pct / 100),
        }
    drop, gain = store._effective_rank_thresholds(person, idx)
    return {"rank_drop_eff": drop, "rank_gain_eff": gain}


def person_entity_id(name: str) -> str:
    """Per-person sensor entity_id. Mirrors sensor.py + the card's slug()."""
    return f"sensor.family_hub_{name.lower().replace(' ', '_')}"


# ---------------------------------------------------------------------------
# Maintenance helpers (moved from sensor.py so both the sensors and the model
# share one implementation)
# ---------------------------------------------------------------------------

def get_maintenance_tasks(store, overdue_only: bool = False) -> list[dict]:
    """Maintenance items needing attention, as normalized view items.

    v0.8.0 A4: reads the UNION of the new maintenance_tasks collection and legacy
    category_label==Maintenance chore instances via store.get_maintenance_view()
    (A5 removes the legacy half). overdue_only → past-due items; otherwise items
    due within MAINTENANCE_DUE_SOON_DAYS (overdue included, matching prior
    behavior). Callers use len() or the frozen item keys."""
    view = store.get_maintenance_view()
    if overdue_only:
        return [i for i in view if i["days_delta"] < 0]
    return [i for i in view if i["days_delta"] <= MAINTENANCE_DUE_SOON_DAYS]


# ---------------------------------------------------------------------------
# Per-person payload
# ---------------------------------------------------------------------------

def build_person_scalars(store, person_id) -> dict:
    """Small, recorder-safe, automation-friendly subset for the person SENSOR:
    identity + point summary + counts. No task lists / store items / subscriptions
    (those are card-only and reach the card via the websocket model)."""
    person = store.get_person(person_id)
    if not person:
        return {}

    today    = date.today().isoformat()
    week_ago = (date.today() - timedelta(days=7)).isoformat()

    all_tasks     = store.task_instances
    person_active = [
        t for t in all_tasks
        if t.get("assigned_to") == person_id and t["status"] in ACTIVE_STATUSES
    ]
    due_today_count      = len([t for t in person_active if t["due_date"] == today])
    overdue_count        = len([t for t in person_active if t["due_date"] < today])
    pending_appr_count   = len([t for t in all_tasks if t.get("completed_by") == person_id and t["status"] == STATUS_PENDING_APPROVAL])
    completed_total      = [t for t in all_tasks if t.get("completed_by") == person_id and t.get("completed_at")]
    completed_this_week  = [t for t in completed_total if t.get("completed_at", "")[:10] >= week_ago]
    pending_redeem_count = len([r for r in store.redemptions if r["person_id"] == person_id and r["status"] == REDEMPTION_PENDING])

    _chore_type_by_id = {c["id"]: c.get("chore_type", "") for c in store.chores}
    _recurrence_by_id = {
        c["id"]: (c.get("recurrence") or {}).get("type", RECURRENCE_DAILY)
        for c in store.chores
    }
    _done_statuses    = {"pending_approval", "approved", "self_reported"}
    # Daily progress counts DAILY-recurrence chores only. Weekly/monthly window
    # chores can be done any day in their window, so they don't belong in a
    # "done today" tally (they still appear in the task list).
    tasks_done_today  = sum(
        1 for t in all_tasks
        if t.get("assigned_to") == person_id
        and t.get("due_date") == today
        and t.get("status") in _done_statuses
        and _chore_type_by_id.get(t.get("chore_id", ""), "") != "reminder"
        and _recurrence_by_id.get(t.get("chore_id", ""), RECURRENCE_DAILY) == RECURRENCE_DAILY
    )

    balance    = person.get("points_balance", 0)
    rank_index = person.get("rank_index", 0)
    ppdollar   = store.get_rank_ppd(rank_index)

    # v0.7.6: points earned / possible for the two progress bars. Daily = today's
    # DAILY-recurrence chores (drives the daily streak); weekly = the whole rank
    # week across all assigned chores. Both add bonus-chore points to "earned".
    # Points-based (not chore counts) so harder chores weigh more and bonus chores
    # help. Computed in the store so the bars and the streak share one definition.
    daily_earned, daily_possible = store.get_daily_progress(person_id)
    week_earned,  week_possible  = store.get_week_progress(person_id)

    return {
        # Identity
        "person_id":    person_id,
        "person_type":  person.get("type", "kid"),
        "avatar_color": person.get("avatar_color", "#7F77DD"),
        "active":       person.get("active", True),
        "code":         person.get("code", ""),
        "theme_key":    person.get("theme_key", "classic"),

        # Point summary
        "lifetime_points":   person.get("points_lifetime", 0),
        "dollar_value":      round(balance / ppdollar, 2) if ppdollar else 0,
        "rank_cents_per_pt": store.get_rank_cents_per_pt(rank_index),
        "show_dollar_value": (
            True if person.get("type") == "parent"
            else store.show_dollar_value_to_kids
        ),

        # Counts for automations
        "tasks_due_today":           due_today_count,
        "tasks_overdue":             overdue_count,
        "pending_approval":          pending_appr_count,
        "tasks_completed_this_week": len(completed_this_week),
        "tasks_completed_total":     len(completed_total),
        "pending_redemptions":       pending_redeem_count,
        "tasks_done_today":          tasks_done_today,
        "daily_earned":              daily_earned,
        "daily_possible":            daily_possible,
        "week_earned":               week_earned,
        "week_possible":             week_possible,
        "streak_freezes_available":  person.get("streak_freezes_available", 0),
        "goal_item_id":              person.get("goal_item_id", "") or "",
        # Effective penalty pause (global OR per-person) so the card can zero out
        # the "at risk" KPI when no penalty could actually fire for this person.
        "penalties_paused":          store.is_penalty_paused_for(person_id),
    }


def build_person_payload(store, person_id) -> dict:
    """Full per-person model section for the card = scalars + the heavy
    card-only data (task lists, store items, goal, group proposals, subs)."""
    scalars = build_person_scalars(store, person_id)
    if not scalars:
        return {}

    person     = store.get_person(person_id)
    balance    = person.get("points_balance", 0)
    rank_index = person.get("rank_index", 0)

    # v0.8.0 A6: a person's chore lists come from Chores; store items / goal /
    # subs / group proposals come from Rewards. When a module is off its data is
    # empty, so the personal page shows points balance (+ the other module).
    chores_on  = _on(store, "chores")
    rewards_on = _on(store, "rewards")

    task_data   = store.get_tasks_for_card(person_id) if chores_on else {"due_today": [], "overdue": [], "pending_approval": []}
    store_items = store.get_store_items_for_card(person_id, rank_index) if rewards_on else []

    goal_id   = scalars["goal_item_id"] if rewards_on else ""
    goal_item = store.get_store_item(goal_id) if goal_id else None
    if goal_item:
        cost = round(goal_item.get("dollar_value", 0) * store.get_rank_ppd(rank_index)) or 0
        if cost <= 0:
            goal_pct = 100
        else:
            goal_pct = int(min(100, max(0, (balance / cost) * 100)))
        goal_summary = {
            "item_id":      goal_item.get("id", ""),
            "name":         goal_item.get("name", ""),
            "icon":         goal_item.get("icon", ""),
            "points_cost":  cost,
            "progress_pct": goal_pct,
            "remaining":    max(0, cost - balance),
        }
    else:
        goal_summary = None

    return {
        **scalars,
        "tasks_due_today_list":        task_data["due_today"],
        "tasks_overdue_list":          task_data["overdue"],
        "tasks_pending_approval_list": task_data["pending_approval"],
        "store_items":     store_items,
        "goal":            goal_summary,
        "group_proposals": store.get_group_proposals_for_person(person_id) if rewards_on else [],
        "subscriptions":   store.get_subscriptions_for_person(person_id, rank_index) if rewards_on else [],
    }


# ---------------------------------------------------------------------------
# Per-person phone-widget summary
# ---------------------------------------------------------------------------

def build_person_widget(store, person_id) -> dict:
    """Display-ready summary for a phone home-screen widget (one per person).

    Returns {"state": <headline str>, "attrs": {...}}. The state is a glanceable
    one-liner ("3 to do · 45 pts") so the HA companion app's plain "Entity State"
    widget needs no template; the attributes carry the chore name list plus a
    pre-joined multiline string so the "Template" widget / automations also need
    no Jinja. Reuses get_tasks_for_card so the widget always matches the person's
    own card page.
    """
    scalars = build_person_scalars(store, person_id)
    if not scalars:
        return {"state": "—", "attrs": {}}

    person  = store.get_person(person_id)
    name    = person["name"].split()[0] if person and person.get("name") else ""
    balance = person.get("points_balance", 0) if person else 0

    tasks     = store.get_tasks_for_card(person_id)
    to_do     = tasks.get("due_today", [])
    names     = [r["name"] for r in to_do]
    remaining = len(names)
    to_earn   = sum(r.get("points", 0) for r in to_do)
    all_done  = remaining == 0

    state = f"All done · {balance} pts" if all_done else f"{remaining} to do · {balance} pts"

    attrs = {
        "headline":             state,
        "person_name":          name,
        "theme_key":            scalars.get("theme_key", "classic"),
        "avatar_color":         scalars.get("avatar_color", "#7F77DD"),
        "chores_remaining":     remaining,
        "chore_list":           names,
        "chore_summary":        " · ".join(names),
        "chore_lines":          "\n".join(names),
        "next_chore":           names[0] if names else "",
        "done_today":           scalars.get("tasks_done_today", 0),
        "points_balance":       balance,
        "points_to_earn_today": to_earn,
        "dollar_value":         scalars.get("dollar_value", 0),
        "show_dollar_value":    scalars.get("show_dollar_value", False),
        "all_done":             all_done,
    }
    return {"state": state, "attrs": attrs}


# ---------------------------------------------------------------------------
# Needs-attention (global admin) payload
# ---------------------------------------------------------------------------

def build_needs_attention_scalars(store) -> dict:
    """Small payload for the needs_attention SENSOR: data_rev + action counts +
    a slim roster + room config (enough for the card config editor + automations).
    The full admin model (queues, full people, all chores, store items, history)
    reaches the card via the websocket model, not the sensor."""
    return {
        # Single mutation counter — the card watches this to refetch the model.
        "data_rev": getattr(store, "data_rev", 0),

        # Action counts for automations / badges — v0.8.0 A6: each gated on its
        # module so a disabled module contributes no count.
        "pending_task_approvals": len(store.get_pending_approvals()) if _on(store, "chores") else 0,
        "pending_redemptions":    len(store.get_pending_redemptions()) if _on(store, "rewards") else 0,
        "overdue_maintenance":    len(get_maintenance_tasks(store, overdue_only=True)) if _on(store, "maintenance") else 0,
        "pending_subscription_cancellations": len(store.get_cancel_pending_subscriptions_for_card()) if _on(store, "rewards") else 0,

        # Slim roster (id + name + type + theme) for the card config editor + automations
        "people": [
            {
                "person_id": p["id"],
                "name":      p["name"],
                "type":      p.get("type", "kid"),
                "theme_key": p.get("theme_key", "classic"),
            }
            for p in store.people if p.get("active", True)
        ],

        # Room layout config for the editor's initial_view dropdown
        "rooms_config": store.settings.get("rooms_config", {}),
        # v0.8.0: per-module enabled map so the card hides disabled rooms/affordances.
        "modules":      _modules_map(store),
        "family_name":  store.family_name,
    }


def build_needs_attention_payload(store) -> dict:
    # v0.8.0 A6: the action queues are empty when their module is off, so counts,
    # badges, and the admin queues never reference a disabled module.
    pending_tasks  = store.get_pending_approvals() if _on(store, "chores") else []
    pending_redeem = store.get_pending_redemptions() if _on(store, "rewards") else []
    overdue_maint  = get_maintenance_tasks(store, overdue_only=True) if _on(store, "maintenance") else []

    # All store items for admin store management tab — sorted by sort_order
    # (v0.6.3 drag-reorder), name as the deterministic tie-breaker.
    all_store_items = [
        {
            "item_id":        i["id"],
            "name":           i["name"],
            "description":    i.get("description", ""),
            "dollar_value":   i.get("dollar_value", 0),
            "points_cost":    i.get("points_cost", 0),
            "scope":          i.get("scope", "common"),
            "person_ids":     i.get("person_ids", []),
            "active":         i.get("active", True),
            "sort_order":     i.get("sort_order", 0),
            "icon":           i.get("icon", "") or "",
            "category_label": i.get("category_label", "") or "",
            "max_per_period": i.get("max_per_period", 0),
            "period":         i.get("period", "week"),
            "is_group_reward":     i.get("is_group_reward", False),
            "contributors":        i.get("contributors", []),
            "item_type":           i.get("item_type", "one_time"),
            "subscription_period": i.get("subscription_period", ""),
            "subscription_anchor": i.get("subscription_anchor", 1),
            # v0.7.6: reward gates (so the admin edit form round-trips them)
            "require_daily_pct":   i.get("require_daily_pct", 0),
            "min_rank_index":      i.get("min_rank_index", 0),
        }
        for i in sorted(
            store.store_items,
            key=lambda x: (x.get("sort_order", 0), x.get("name", "")),
        )
    ]

    # v0.8.0 A6: subscription queues are a Rewards surface.
    cancel_pending_subs = store.get_cancel_pending_subscriptions_for_card() if _on(store, "rewards") else []

    # All non-canceled subscriptions for the Family panel rail
    _people_by_id = {p["id"]: p for p in store.people}
    _items_by_id  = {i["id"]: i for i in store.store_items}
    subs_all = []
    for _sub in (store._data.get("subscriptions", []) if _on(store, "rewards") else []):
        if _sub.get("status") == "canceled":
            continue
        _p = _people_by_id.get(_sub.get("person_id", ""), {})
        _i = _items_by_id.get(_sub.get("item_id", ""), {})
        _rank_ppd         = store.get_rank_ppd(_p.get("rank_index", 0))
        _item_dollar      = _i.get("dollar_value", 0)
        _item_cost        = round(_item_dollar * _rank_ppd)
        _override_dollar  = _sub.get("dollar_cost_override")
        _effective_dollar = _override_dollar if _override_dollar is not None else _item_dollar
        _effective_cost   = round(_effective_dollar * _rank_ppd)
        subs_all.append({
            "subscription_id":      _sub.get("id", ""),
            "person_id":            _sub.get("person_id", ""),
            "person_name":          _p.get("name", ""),
            "person_color":         _p.get("avatar_color", "#7F77DD"),
            "item_id":              _sub.get("item_id", ""),
            "item_name":            _i.get("name", ""),
            "period":               _sub.get("period", ""),
            "anchor":               _sub.get("anchor", 0),
            "next_renewal_date":    _sub.get("next_renewal_date", ""),
            "started_date":         _sub.get("started_date", ""),
            "status":               _sub.get("status", "active"),
            "missed_renewals":      _sub.get("missed_renewals", 0),
            "accumulated_debt":     _sub.get("accumulated_debt", 0),
            "dollar_cost_override": _override_dollar,
            "item_cost":            _item_cost,
            "item_dollar_value":    _item_dollar,
            "effective_cost":       _effective_cost,
            "effective_dollar":     _effective_dollar,
        })

    return {
        # Single mutation counter — the card watches this to know when to refetch
        # the model. Bumps on every store save.
        "data_rev": getattr(store, "data_rev", 0),

        # Counts for automations / badges
        "pending_task_approvals": len(pending_tasks),
        "pending_redemptions":    len(pending_redeem),
        "overdue_maintenance":    len(overdue_maint),
        "pending_subscription_cancellations": len(cancel_pending_subs),

        # Full queues — actionable rows for the admin card (A6: gated per module)
        "approval_queue":           store.get_approval_queue_for_card() if _on(store, "chores") else [],
        "redemption_queue":         store.get_redemption_queue_for_card() if _on(store, "rewards") else [],
        "group_proposal_queue":     store.get_group_reward_proposals_for_card() if _on(store, "rewards") else [],
        "subscription_cancel_queue": cancel_pending_subs,
        "all_subscriptions":        subs_all,

        # All active people with balances for admin overview
        "people": [
            {
                "person_id":        p["id"],
                "name":             p["name"],
                "type":             p.get("type", "kid"),
                "avatar_color":     p.get("avatar_color", "#7F77DD"),
                "points_balance":   p.get("points_balance", 0),
                "points_lifetime":  p.get("points_lifetime", 0),
                "active":           p.get("active", True),
                "penalties_paused": p.get("penalties_paused", False),
                "streaks": {k: v.get("count", 0) for k, v in p.get("streaks", {}).items()},
                "allowance_points":   p.get("allowance_points", 0),
                "allowance_schedule": p.get("allowance_schedule", "weekly"),
                "allowance_weekday":  p.get("allowance_weekday", 5),
                "allowance_monthday": p.get("allowance_monthday", 1),
                "notify_target":      p.get("notify_target", ""),
                "code":               p.get("code", ""),
                "theme_key":          p.get("theme_key", "classic"),
                "rank_index":          p.get("rank_index", 999 if p.get("type") == "parent" else 0),
                "rank_drop_threshold": p.get("rank_drop_threshold"),
                "rank_gain_threshold": p.get("rank_gain_threshold"),
                "rank_drop_thresholds": p.get("rank_drop_thresholds"),
                "rank_gain_thresholds": p.get("rank_gain_thresholds"),
                "rank_curve":           p.get("rank_curve"),
                "rank_locked":          p.get("rank_locked", False),
                "assigned_ppw":         assigned_points_per_week(store, p["id"]),
                **_rank_eff_for_card(store, p),
                "child_mode":          p.get("child_mode", False),
                "completion_streak":        p.get("completion_streak", 0),
                "completion_threshold_pct": p.get("completion_threshold_pct", 80),
                "completion_milestone":     p.get("completion_milestone", 7),
                "completion_bonus_points":  p.get("completion_bonus_points", 50),
                "weekly_completion_streak":        p.get("weekly_completion_streak", 0),
                "weekly_completion_threshold_pct": p.get("weekly_completion_threshold_pct", 80),
                "weekly_completion_milestone":     p.get("weekly_completion_milestone", 4),
                "weekly_completion_bonus_points":  p.get("weekly_completion_bonus_points", 100),
                "goal_item_id":             p.get("goal_item_id", "") or "",
            }
            for p in store.people if p.get("active", True)
        ],

        # Inactive (deactivated) people — for the admin "Inactive members"
        # management UI (reactivate / permanently delete).
        "inactive_people": [
            {
                "person_id":       p["id"],
                "name":            p["name"],
                "type":            p.get("type", "kid"),
                "avatar_color":    p.get("avatar_color", "#7F77DD"),
                "points_balance":  p.get("points_balance", 0),
                "points_lifetime": p.get("points_lifetime", 0),
                "code":            p.get("code", ""),
                "theme_key":       p.get("theme_key", "classic"),
            }
            for p in store.people if not p.get("active", True)
        ],

        # Chores for the admin Tasks tab (A6: empty when chores off)
        "active_chores": store.get_active_chores_for_card() if _on(store, "chores") else [],
        "all_chores":    store.get_all_chores_for_card() if _on(store, "chores") else [],

        # All active store items for admin store management (A6: empty when rewards off)
        "store_items": all_store_items if _on(store, "rewards") else [],

        # Settings for admin display and card dropdowns
        "family_name":               store.family_name,
        "points_per_dollar":         store.points_per_dollar,
        "show_dollar_value_to_kids": store.show_dollar_value_to_kids,
        "category_labels":           store.category_labels,
        "penalties_paused_global":   store.penalties_paused_global,
        "penalty_alert_time":        store.settings.get("penalty_alert_time", 800),
        "rooms_config":              store.settings.get("rooms_config", {}),
        "modules":                   _modules_map(store),
        "weather_entity":            store.settings.get("weather_entity", ""),
        "today_calendar_entities":   store.settings.get("today_calendar_entities", []),
        "rank_eval_weekday":         store.settings.get("rank_eval_weekday", 0),
        "rank_drop_threshold":       store.settings.get("rank_drop_threshold", 50),
        "rank_gain_threshold":       store.settings.get("rank_gain_threshold", 75),
        "rank_default_cap":          store.settings.get("rank_default_cap", 100),
        "rank_default_drop_pct":     store.settings.get("rank_default_drop_pct", 60),
        "rank_default_gain_pct":     store.settings.get("rank_default_gain_pct", 80),
        "rank_dynamic_capacity":     store.settings.get("rank_dynamic_capacity", True),
        "rank_ppd_ladder":           store.rank_ppd_ladder,

        # Enriched 30-day history log for admin log/approvals UI
        "history_log": store.get_history_for_card(),
    }


# ---------------------------------------------------------------------------
# Claimable + maintenance payloads
# ---------------------------------------------------------------------------

def build_claimable_payload(store) -> dict:
    return {
        "tasks":     store.get_claimable_tasks_for_card(),
        "all_tasks": store.get_all_tasks_for_command_center(),
    }


def build_maintenance_due_scalars(store) -> dict:
    """Maintenance-due SENSOR payload: summary counts + next item, no items list.
    Reads normalized view items (days_delta relative to today)."""
    items         = get_maintenance_tasks(store)
    overdue       = [i for i in items if i["days_delta"] < 0]
    due_this_week = [i for i in items if 0 <= i["days_delta"] <= 7]
    due_next_week = [i for i in items if i["days_delta"] > 7]

    upcoming = sorted([i for i in items if i["days_delta"] >= 0], key=lambda i: i["due_date"])
    next_item = next_due_date = next_due_days = None
    if upcoming:
        next_item     = upcoming[0]["name"]
        next_due_date = upcoming[0]["due_date"]
        next_due_days = upcoming[0]["days_delta"]

    return {
        "overdue":       len(overdue),
        "due_this_week": len(due_this_week),
        "due_next_week": len(due_next_week),
        "next_item":     next_item,
        "next_due_date": next_due_date,
        "next_due_days": next_due_days,
    }


_UNITS_SINGULAR = {"days": "day", "weeks": "week", "months": "month", "years": "year"}

# Newest-first slice of the completion log shipped to the card. Task detail shows
# a handful of rows per task; this is the whole room's worth with headroom.
_COMPLETIONS_FOR_CARD = 300


def cadence_label(task: dict) -> str:
    """Human cadence for a task row: 'every 6 months', 'every year', 'one-time'."""
    rec = task.get("recurrence") or {}
    unit = rec.get("unit")
    if not unit:
        return "one-time"
    interval = int(rec.get("interval", 1) or 1)
    if interval == 1:
        return f"every {_UNITS_SINGULAR.get(unit, unit)}"
    return f"every {interval} {unit}"


def _maintenance_task_record(task: dict, today: date) -> dict:
    """One maintenance task as the Home Care room reads it.

    Unlike the triage view (`get_maintenance_view`), this keeps DISABLED, snoozed
    and far-future tasks: the room's search spans the whole library, and a disabled
    task has to render its reason line (C2 handoff section 5.1)."""
    due = effective_due(task)
    return {
        "id":                  task["id"],
        "name":                task.get("name", ""),
        "description":         task.get("description", ""),
        "category":            task.get("category") or "Maintenance",
        "location":            task.get("location", ""),
        "state":               task_state(task, today),
        "enabled":             bool(task.get("enabled", True)),
        "disabled_reason":     task.get("disabled_reason", ""),
        "next_due":            due.isoformat() if due else None,
        "days_delta":          (due - today).days if due else None,
        "last_completed":      task.get("last_completed"),
        "snoozed_until":       task.get("snoozed_until"),
        "recurrence":          task.get("recurrence"),
        "cadence_label":       cadence_label(task),
        "schedule_mode":       task.get("schedule_mode", "from_completion"),
        "seasonal_anchor":     task.get("seasonal_anchor"),
        "seasonal_note":       task.get("seasonal_note", ""),
        "climate_note":        task.get("climate_note", ""),
        "workflow":            task.get("workflow", "simple"),
        "workflow_stage":      task.get("workflow_stage"),
        "lead_time_days":      task.get("lead_time_days"),
        "effort":              task.get("effort") or {},
        "est_cost_diy":        task.get("est_cost_diy"),
        "est_cost_pro":        task.get("est_cost_pro"),   # None = never hired out
        "default_mode":        task.get("default_mode", "diy"),
        "product_ids":         list(task.get("product_ids") or []),
        "assignable":          bool(task.get("assignable", False)),
        "default_point_value": int(task.get("default_point_value", 0) or 0),
        "surprise_factor":     task.get("surprise_factor", "low"),
        "offered_external":    bool(task.get("offered_external", False)),
        "source":              task.get("source", "custom"),
        "seed_id":             task.get("seed_id"),
    }


def build_maintenance_all_tasks(store) -> list[dict]:
    """Every maintenance task, enabled or not, sorted by name."""
    today = date.today()
    return sorted(
        (_maintenance_task_record(t, today) for t in store.maintenance_tasks),
        key=lambda t: t["name"].lower(),
    )


def build_maintenance_assets(store) -> list[dict]:
    """Big-ticket assets this home actually has, from the seed library's reference
    table. Read-only here — the sinking-fund math is Phase E2."""
    from .seed_loader import applicable_assets, library_assets
    library = getattr(store, "_seed_library", None) or {}
    return applicable_assets(library_assets(library), store.home_profile)


def build_maintenance_due_payload(store) -> dict:
    """Full maintenance-due model section.

    Two task lists, mirroring the claimable payload's tasks/all_tasks split:
    `items` is the lean due/overdue triage board (unchanged frozen contract) and
    `all_tasks` is the full list the room's search needs. Everything else here is
    supporting data for the room's task detail, products screen and fund rollup.
    """
    completions = sorted(
        store.maintenance_completions, key=lambda c: c.get("date") or "", reverse=True,
    )[:_COMPLETIONS_FOR_CARD]
    all_tasks = store.get_maintenance_all_tasks_for_card()

    categories: dict[str, int] = {}
    for task in all_tasks:
        categories[task["category"]] = categories.get(task["category"], 0) + 1

    return {
        **build_maintenance_due_scalars(store),
        "items":       store.get_maintenance_items_for_card(),
        "all_tasks":   all_tasks,
        "categories":  categories,
        "products":    store.maintenance_products,
        "completions": completions,
        "vendors":     store.maintenance_vendors,
        "assets":      build_maintenance_assets(store),
        "profile":     store.home_profile,
    }


def build_maintenance_overdue_scalars(store) -> dict:
    """Maintenance-overdue SENSOR payload: oldest-overdue scalar only (the count
    is the sensor's native_value)."""
    oldest = 0
    for item in get_maintenance_tasks(store, overdue_only=True):
        oldest = max(oldest, -item["days_delta"])
    return {"oldest_overdue_days": oldest}


def build_maintenance_overdue_payload(store) -> dict:
    items  = []
    oldest = 0
    for item in get_maintenance_tasks(store, overdue_only=True):
        days_overdue = -item["days_delta"]
        oldest       = max(oldest, days_overdue)
        items.append({
            "name":           item["name"],
            "description":    item["description"],
            "days_overdue":   days_overdue,
            "assigned_to":    item["assigned_to"],
            "category_label": item["category_label"],
        })
    return {"items": items, "oldest_overdue_days": oldest}


# ---------------------------------------------------------------------------
# Meals room (v0.8.0)
# ---------------------------------------------------------------------------

def build_meals_scalars(store) -> dict:
    """Lean meals SENSOR payload: tonight's dinner (id + variant) + a planned-days
    count. The dinner NAME isn't here — the meal library lives in the frontend, so
    the card resolves the id from meals-data.js. Enough for the room tile, voice,
    and automations."""
    meals = store.get_meals_for_card()
    plan  = meals.get("plan", {})
    today = date.today().isoformat()
    dinner = (plan.get(today, {}) or {}).get("d") or {}
    planned = sum(
        1 for k, e in plan.items()
        if k >= today and (e.get("d") or e.get("b") or e.get("l"))
    )
    return {
        "tonight_main":    dinner.get("main", ""),
        "tonight_variant": dinner.get("variant", ""),
        "planned_days":    planned,
    }


def build_meals_payload(store) -> dict:
    """Full meals model section = scalars + the entire meals state (plan, rhythm,
    favs, custom, customIng, recipes, have, groc)."""
    return {**build_meals_scalars(store), **store.get_meals_for_card()}


# ---------------------------------------------------------------------------
# Full card model — keyed by entity_id, mirrors what card._attrs(id) reads
# ---------------------------------------------------------------------------

def build_card_model(store) -> dict:
    """Assemble the full card model: every Family Hub sensor's payload, keyed
    by entity_id. The card fetches this via the `family_hub/get_model`
    websocket command and reads it through card._attrs(<entity_id>)."""
    # Core payloads (always present).
    model = {
        "sensor.family_hub_needs_attention": build_needs_attention_payload(store),
        "sensor.family_hub_claimable_tasks": build_claimable_payload(store),
    }
    # v0.8.0: a disabled module contributes no model keys. The card gates its UI
    # on the `modules` map (in needs_attention), and _attrs() returns {} for a
    # missing key, so an omitted key is safe.
    enabled = getattr(store, "enabled_modules", None)

    def _on(mid: str) -> bool:
        return enabled is None or mid in enabled

    if _on("maintenance"):
        model["sensor.family_hub_maintenance_due"] = build_maintenance_due_payload(store)
        model["sensor.family_hub_maintenance_overdue"] = build_maintenance_overdue_payload(store)
    if _on("meals"):
        model["sensor.family_hub_meals"] = build_meals_payload(store)

    for p in store.get_active_people():
        model[person_entity_id(p["name"])] = build_person_payload(store, p["id"])
    return model

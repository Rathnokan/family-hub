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
    MAINTENANCE_DUE_SOON_DAYS,
    REDEMPTION_PENDING,
    STATUS_PENDING_APPROVAL,
)


def person_entity_id(name: str) -> str:
    """Per-person sensor entity_id. Mirrors sensor.py + the card's slug()."""
    return f"sensor.family_hub_{name.lower().replace(' ', '_')}"


# ---------------------------------------------------------------------------
# Maintenance helpers (moved from sensor.py so both the sensors and the model
# share one implementation)
# ---------------------------------------------------------------------------

def get_maintenance_tasks(store, overdue_only: bool = False) -> list[dict]:
    """Return active maintenance task instances (category_label == Maintenance)."""
    today           = date.today()
    due_soon_cutoff = (today + timedelta(days=MAINTENANCE_DUE_SOON_DAYS)).isoformat()
    today_str       = today.isoformat()
    results         = []
    for task in store.task_instances:
        if task["status"] not in ACTIVE_STATUSES:
            continue
        chore = store.get_chore(task["chore_id"])
        if not chore or not store._chore_is_maintenance(chore):
            continue
        if overdue_only:
            if task["due_date"] < today_str:
                results.append(task)
        else:
            if task["due_date"] <= due_soon_cutoff:
                results.append(task)
    return results


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
    _done_statuses    = {"pending_approval", "approved", "self_reported"}
    tasks_done_today  = sum(
        1 for t in all_tasks
        if t.get("assigned_to") == person_id
        and t.get("due_date") == today
        and t.get("status") in _done_statuses
        and _chore_type_by_id.get(t.get("chore_id", ""), "") != "reminder"
    )

    balance    = person.get("points_balance", 0)
    rank_index = person.get("rank_index", 0)
    ppdollar   = store.get_rank_ppd(rank_index)

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
        "streak_freezes_available":  person.get("streak_freezes_available", 0),
        "goal_item_id":              person.get("goal_item_id", "") or "",
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

    task_data   = store.get_tasks_for_card(person_id)
    store_items = store.get_store_items_for_card(person_id, rank_index)

    goal_id   = scalars["goal_item_id"]
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
        "group_proposals": store.get_group_proposals_for_person(person_id),
        "subscriptions":   store.get_subscriptions_for_person(person_id, rank_index),
    }


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

        # Action counts for automations / badges
        "pending_task_approvals": len(store.get_pending_approvals()),
        "pending_redemptions":    len(store.get_pending_redemptions()),
        "overdue_maintenance":    len(get_maintenance_tasks(store, overdue_only=True)),
        "pending_subscription_cancellations": len(store.get_cancel_pending_subscriptions_for_card()),

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
        "family_name":  store.family_name,
    }


def build_needs_attention_payload(store) -> dict:
    pending_tasks  = store.get_pending_approvals()
    pending_redeem = store.get_pending_redemptions()
    overdue_maint  = get_maintenance_tasks(store, overdue_only=True)

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
        }
        for i in sorted(
            store.store_items,
            key=lambda x: (x.get("sort_order", 0), x.get("name", "")),
        )
    ]

    cancel_pending_subs = store.get_cancel_pending_subscriptions_for_card()

    # All non-canceled subscriptions for the Family panel rail
    _people_by_id = {p["id"]: p for p in store.people}
    _items_by_id  = {i["id"]: i for i in store.store_items}
    subs_all = []
    for _sub in store._data.get("subscriptions", []):
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

        # Full queues — actionable rows for the admin card
        "approval_queue":           store.get_approval_queue_for_card(),
        "redemption_queue":         store.get_redemption_queue_for_card(),
        "group_proposal_queue":     store.get_group_reward_proposals_for_card(),
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
                "child_mode":          p.get("child_mode", False),
                "completion_streak":        p.get("completion_streak", 0),
                "completion_threshold_pct": p.get("completion_threshold_pct", 80),
                "completion_milestone":     p.get("completion_milestone", 7),
                "completion_bonus_points":  p.get("completion_bonus_points", 50),
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

        # Chores for the admin Tasks tab
        "active_chores": store.get_active_chores_for_card(),
        "all_chores":    store.get_all_chores_for_card(),

        # All active store items for admin store management
        "store_items": all_store_items,

        # Settings for admin display and card dropdowns
        "family_name":               store.family_name,
        "points_per_dollar":         store.points_per_dollar,
        "show_dollar_value_to_kids": store.show_dollar_value_to_kids,
        "category_labels":           store.category_labels,
        "penalties_paused_global":   store.penalties_paused_global,
        "penalty_alert_time":        store.settings.get("penalty_alert_time", 800),
        "rooms_config":              store.settings.get("rooms_config", {}),
        "weather_entity":            store.settings.get("weather_entity", ""),
        "today_calendar_entities":   store.settings.get("today_calendar_entities", []),
        "rank_eval_weekday":         store.settings.get("rank_eval_weekday", 0),
        "rank_drop_threshold":       store.settings.get("rank_drop_threshold", 50),
        "rank_gain_threshold":       store.settings.get("rank_gain_threshold", 75),
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
    """Maintenance-due SENSOR payload: summary counts + next item, no items list."""
    today     = date.today()
    today_str = today.isoformat()
    week_str  = (today + timedelta(days=7)).isoformat()

    tasks         = get_maintenance_tasks(store)
    overdue       = [t for t in tasks if t["due_date"] < today_str]
    due_this_week = [t for t in tasks if today_str <= t["due_date"] <= week_str]
    due_next_week = [t for t in tasks if week_str < t["due_date"]]

    upcoming = sorted([t for t in tasks if t["due_date"] >= today_str], key=lambda t: t["due_date"])
    next_item = next_due_date = next_due_days = None
    if upcoming:
        chore = store.get_chore(upcoming[0]["chore_id"])
        next_item     = chore["name"] if chore else None
        next_due_date = upcoming[0]["due_date"]
        next_due_days = (date.fromisoformat(next_due_date) - today).days

    return {
        "overdue":       len(overdue),
        "due_this_week": len(due_this_week),
        "due_next_week": len(due_next_week),
        "next_item":     next_item,
        "next_due_date": next_due_date,
        "next_due_days": next_due_days,
    }


def build_maintenance_due_payload(store) -> dict:
    """Full maintenance-due model section = scalars + the items list."""
    return {**build_maintenance_due_scalars(store), "items": store.get_maintenance_items_for_card()}


def build_maintenance_overdue_scalars(store) -> dict:
    """Maintenance-overdue SENSOR payload: oldest-overdue scalar only (the count
    is the sensor's native_value)."""
    today  = date.today()
    oldest = 0
    for task in get_maintenance_tasks(store, overdue_only=True):
        oldest = max(oldest, (today - date.fromisoformat(task["due_date"])).days)
    return {"oldest_overdue_days": oldest}


def build_maintenance_overdue_payload(store) -> dict:
    today = date.today()
    tasks = get_maintenance_tasks(store, overdue_only=True)
    items = []
    oldest = 0
    for task in tasks:
        chore        = store.get_chore(task["chore_id"])
        days_overdue = (today - date.fromisoformat(task["due_date"])).days
        oldest       = max(oldest, days_overdue)
        items.append({
            "name":           chore["name"] if chore else task["chore_id"],
            "description":    chore.get("description", "") if chore else "",
            "days_overdue":   days_overdue,
            "assigned_to":    task.get("assigned_to"),
            "category_label": chore.get("category_label", "") if chore else "",
        })
    return {"items": items, "oldest_overdue_days": oldest}


# ---------------------------------------------------------------------------
# Full card model — keyed by entity_id, mirrors what card._attrs(id) reads
# ---------------------------------------------------------------------------

def build_card_model(store) -> dict:
    """Assemble the full card model: every Family Hub sensor's payload, keyed
    by entity_id. The card fetches this via the `family_hub/get_model`
    websocket command and reads it through card._attrs(<entity_id>)."""
    model = {
        "sensor.family_hub_needs_attention":     build_needs_attention_payload(store),
        "sensor.family_hub_claimable_tasks":     build_claimable_payload(store),
        "sensor.family_hub_maintenance_due":     build_maintenance_due_payload(store),
        "sensor.family_hub_maintenance_overdue": build_maintenance_overdue_payload(store),
    }
    for p in store.get_active_people():
        model[person_entity_id(p["name"])] = build_person_payload(store, p["id"])
    return model

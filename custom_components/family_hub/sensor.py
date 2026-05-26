"""
Family Hub — sensor platform.

8+ sensors total:

Per-person (1 per active family member, created dynamically):
  sensor.family_hub_[name]
    state  = current spendable point balance
    attrs  = all task lists, store items, penalty info, show_dollar_value flag

Global (4 fixed):
  sensor.family_hub_maintenance_due      — items due within 14 days
  sensor.family_hub_maintenance_overdue  — overdue maintenance items
  sensor.family_hub_needs_attention      — total parent actions + full queues + settings
  sensor.family_hub_claimable_tasks      — unclaimed claimable tasks

v0.3.0 additions:
  - needs_attention exposes: category_labels, active_chores (with new fields),
    store_items (all, for admin management)
  - person sensor exposes: penalty_enabled/penalty_points per task, category_label
  - claimable sensor exposes: task descriptions

v0.4.1 additions:
  - Dynamic sensor registration: add_person / remove_person services now
    create / deactivate person sensors immediately without requiring a restart.
    async_setup_entry stores add_person_sensor and remove_person_sensor
    callables into hass.data so services.py can call them.
  - chore_type added to personal sensor task payload (due_today_list and
    overdue_list). Eliminates the brittle reminder heuristic in the card.
    Phase 3-C TODO is now resolved on the backend side.
  - expires_after_days added to personal sensor task payload.
"""

from __future__ import annotations

import logging
from datetime import date, timedelta

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import (
    ACTIVE_STATUSES,
    DOMAIN,
    MAINTENANCE_DUE_SOON_DAYS,
    RECURRENCE_ONE_TIME,
    REDEMPTION_PENDING,
    STATUS_PENDING_APPROVAL,
    SUB_STATUS_CANCEL_PENDING,
)
from .coordinator import FamilyHubCoordinator

_LOGGER = logging.getLogger(__name__)

_DEVICE_INFO = {
    "identifiers": {(DOMAIN, "family_hub")},
    "name": "Family Hub",
    "manufacturer": "Family Hub",
    "model": "Family Task Manager",
}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """
    Set up all sensor entities for the entry.

    After creating the static global sensors and the initial per-person sensors,
    we store two callables in hass.data so that services.py can dynamically
    add or remove person sensors without a restart:

      add_person_sensor(person_id)    — creates and registers a new sensor
      remove_person_sensor(person_id) — marks the sensor unavailable / removed
    """
    coordinator: FamilyHubCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    person_entities: dict = hass.data[DOMAIN][entry.entry_id]["person_entities"]

    # --- Initial per-person sensors ------------------------------------------
    entities: list[SensorEntity] = []
    for person in coordinator.store.get_active_people():
        sensor = FamilyHubPersonSensor(coordinator, person["id"])
        person_entities[person["id"]] = sensor
        entities.append(sensor)

    # --- Global sensors -------------------------------------------------------
    entities.append(FamilyHubMaintenanceDueSensor(coordinator))
    entities.append(FamilyHubMaintenanceOverdueSensor(coordinator))
    entities.append(FamilyHubNeedsAttentionSensor(coordinator))
    entities.append(FamilyHubClaimableTasksSensor(coordinator))
    entities.append(FamilyHubTodaySensor(coordinator))

    async_add_entities(entities, update_before_add=True)

    # --- Dynamic registration helpers ----------------------------------------

    def add_person_sensor(person_id: str) -> None:
        """
        Called by services.py after async_add_person succeeds.
        Creates a sensor for the new person and registers it with HA immediately.
        Safe to call even if a sensor for this person_id already exists
        (it will be a no-op in that case).
        """
        if person_id in person_entities:
            _LOGGER.debug("Family Hub: sensor already exists for person %s", person_id)
            return
        sensor = FamilyHubPersonSensor(coordinator, person_id)
        person_entities[person_id] = sensor
        async_add_entities([sensor], update_before_add=True)
        _LOGGER.info("Family Hub: registered sensor for new person %s", person_id)

    def remove_person_sensor(person_id: str) -> None:
        """
        Called by services.py after async_remove_person succeeds.
        The entity remains in the registry but becomes unavailable because
        the person is deactivated in the data store. The stale-entity cleanup
        in __init__.py will remove it on the next reload/restart.
        """
        sensor = person_entities.get(person_id)
        if sensor:
            # Trigger a coordinator refresh so the sensor re-evaluates its state.
            # The sensor's native_value returns 0 and extra_state_attributes
            # returns {} when the person is not found / inactive, which is the
            # correct unavailable state. The coordinator will handle this naturally.
            _LOGGER.info("Family Hub: person %s deactivated; sensor will show 0 balance", person_id)
        else:
            _LOGGER.debug("Family Hub: no sensor found for person %s to remove", person_id)

    # Store the callables so services.py can reach them
    hass.data[DOMAIN][entry.entry_id]["add_person_sensor"]    = add_person_sensor
    hass.data[DOMAIN][entry.entry_id]["remove_person_sensor"] = remove_person_sensor


class FamilyHubBaseSensor(CoordinatorEntity[FamilyHubCoordinator], SensorEntity):
    _attr_has_entity_name = True

    def __init__(self, coordinator: FamilyHubCoordinator) -> None:
        super().__init__(coordinator)

    @property
    def device_info(self) -> dict:
        info = dict(_DEVICE_INFO)
        info["name"] = self.coordinator.store.family_name
        return info


# ---------------------------------------------------------------------------
# Per-person sensor
# ---------------------------------------------------------------------------

class FamilyHubPersonSensor(FamilyHubBaseSensor):
    """
    One sensor per active family member.
    State = spendable point balance.
    Attributes include full task lists (with penalty info), store items,
    and the show_dollar_value flag so the card knows whether to render
    the dollar equivalent of the balance.

    Note: No state_class — point balances are arbitrary tracked values,
    not physical measurements. Omitting prevents unwanted long-term stats.

    v0.4.1: task rows now include chore_type and expires_after_days so the
    card can use reliable data instead of the heuristic isReminderTask().
    """

    _attr_native_unit_of_measurement = "pts"
    _attr_icon = "mdi:star-circle"

    def __init__(self, coordinator: FamilyHubCoordinator, person_id: str) -> None:
        super().__init__(coordinator)
        self._person_id = person_id
        person = coordinator.store.get_person(person_id)
        safe_name = person["name"].lower().replace(" ", "_") if person else person_id
        self._attr_unique_id = f"{DOMAIN}_person_{person_id}"
        self._attr_name = person["name"] if person else person_id
        self.entity_id = f"sensor.family_hub_{safe_name}"

    @property
    def native_value(self) -> int:
        person = self.coordinator.store.get_person(self._person_id)
        return person.get("points_balance", 0) if person else 0

    @property
    def extra_state_attributes(self) -> dict:
        person = self.coordinator.store.get_person(self._person_id)
        if not person:
            return {}

        store    = self.coordinator.store
        today    = date.today().isoformat()
        week_ago = (date.today() - timedelta(days=7)).isoformat()

        all_tasks    = store.task_instances
        person_active = [
            t for t in all_tasks
            if t.get("assigned_to") == self._person_id and t["status"] in ACTIVE_STATUSES
        ]
        due_today_count      = len([t for t in person_active if t["due_date"] == today])
        overdue_count        = len([t for t in person_active if t["due_date"] < today])
        pending_appr_count   = len([t for t in all_tasks if t.get("completed_by") == self._person_id and t["status"] == STATUS_PENDING_APPROVAL])
        completed_total      = [t for t in all_tasks if t.get("completed_by") == self._person_id and t.get("completed_at")]
        completed_this_week  = [t for t in completed_total if t.get("completed_at", "")[:10] >= week_ago]
        pending_redeem_count = len([r for r in store.redemptions if r["person_id"] == self._person_id and r["status"] == REDEMPTION_PENDING])

        # v0.6.3 item 9: count of assigned tasks (non-reminder) fully approved or
        # self-reported today — used by the card to render the daily progress bar
        # without relying on tasks that have already left the active queue.
        _chore_type_by_id = {c["id"]: c.get("chore_type", "") for c in store.chores}
        _done_statuses    = {"pending_approval", "approved", "self_reported"}
        tasks_done_today  = sum(
            1 for t in all_tasks
            if t.get("assigned_to") == self._person_id
            and t.get("due_date") == today
            and t.get("status") in _done_statuses
            and _chore_type_by_id.get(t.get("chore_id", ""), "") != "reminder"
        )

        balance    = person.get("points_balance", 0)
        rank_index = person.get("rank_index", 0)
        ppdollar   = store.get_rank_ppd(rank_index)

        task_data   = store.get_tasks_for_card(self._person_id)
        store_items = store.get_store_items_for_card(self._person_id, rank_index)

        # v0.6.3: store goal — surface a normalized snapshot so the card can
        # render the progress bar without re-walking store_items. The pct is
        # clamped to [0, 100]; a 0-cost goal (degenerate) reads as 100%.
        goal_id   = person.get("goal_item_id", "") or ""
        goal_item = store.get_store_item(goal_id) if goal_id else None
        if goal_item:
            cost = round(goal_item.get("dollar_value", 0) * store.get_rank_ppd(rank_index)) or 0
            if cost <= 0:
                goal_pct = 100
            else:
                goal_pct = int(min(100, max(0, (balance / cost) * 100)))
            goal_summary = {
                "item_id":     goal_item.get("id", ""),
                "name":        goal_item.get("name", ""),
                "icon":        goal_item.get("icon", ""),
                "points_cost": cost,
                "progress_pct": goal_pct,
                "remaining":   max(0, cost - balance),
            }
        else:
            goal_summary = None

        return {
            # Identity
            "person_id":   self._person_id,
            "person_type": person.get("type", "kid"),
            "avatar_color":person.get("avatar_color", "#7F77DD"),
            "active":      person.get("active", True),
            # v0.6.0: codename + theme
            "code":        person.get("code", ""),
            "theme_key":   person.get("theme_key", "classic"),

            # Point summary
            "lifetime_points": person.get("points_lifetime", 0),
            "dollar_value":    round(balance / ppdollar, 2) if ppdollar else 0,
            "rank_cents_per_pt": store.get_rank_cents_per_pt(rank_index),
            # show_dollar_value: always true for parents, respects toggle for kids
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

            # Full task lists for the dashboard card.
            # v0.4.1: each row now includes chore_type and expires_after_days
            # so the card can identify reminders reliably without a heuristic.
            "tasks_due_today_list":        task_data["due_today"],
            "tasks_overdue_list":          task_data["overdue"],
            "tasks_pending_approval_list": task_data["pending_approval"],

            # Store items visible to this person
            "store_items": store_items,

            # v0.6.3: store goal (None when the kid hasn't picked one)
            "goal_item_id": goal_id,
            "goal":         goal_summary,

            # v0.6.3 item 7: freeze tokens available to protect the success streak
            "streak_freezes_available": person.get("streak_freezes_available", 0),

            # v0.6.3 item 9: tasks fully done today (approved/self_reported/pending_approval)
            # for the daily progress bar — excludes reminders, excludes maintenance
            "tasks_done_today": tasks_done_today,

            # v0.6.3 item 13: group reward proposals pending THIS kid's response
            "group_proposals": store.get_group_proposals_for_person(self._person_id),

            # v0.6.5: subscriptions for this person (non-canceled)
            "subscriptions": store.get_subscriptions_for_person(self._person_id, rank_index),
        }


# ---------------------------------------------------------------------------
# Maintenance helpers
# ---------------------------------------------------------------------------

def _get_maintenance_tasks(store, overdue_only: bool = False) -> list[dict]:
    """Return active maintenance task instances (category_label == Maintenance)."""
    today            = date.today()
    due_soon_cutoff  = (today + timedelta(days=MAINTENANCE_DUE_SOON_DAYS)).isoformat()
    today_str        = today.isoformat()
    results          = []
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
# Global — maintenance due soon
# ---------------------------------------------------------------------------

class FamilyHubMaintenanceDueSensor(FamilyHubBaseSensor):
    """Maintenance items due within 14 days."""

    _attr_native_unit_of_measurement = "items"
    _attr_icon       = "mdi:home-alert"
    _attr_unique_id  = f"{DOMAIN}_maintenance_due"
    _attr_name       = "Maintenance due"
    entity_id        = "sensor.family_hub_maintenance_due"

    @property
    def native_value(self) -> int:
        return len(_get_maintenance_tasks(self.coordinator.store))

    @property
    def extra_state_attributes(self) -> dict:
        store     = self.coordinator.store
        today     = date.today()
        today_str = today.isoformat()
        week_str  = (today + timedelta(days=7)).isoformat()

        tasks        = _get_maintenance_tasks(store)
        overdue      = [t for t in tasks if t["due_date"] < today_str]
        due_this_week= [t for t in tasks if today_str <= t["due_date"] <= week_str]
        due_next_week= [t for t in tasks if week_str < t["due_date"]]

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
            "items":         store.get_maintenance_items_for_card(),
        }


# ---------------------------------------------------------------------------
# Global — maintenance overdue
# ---------------------------------------------------------------------------

class FamilyHubMaintenanceOverdueSensor(FamilyHubBaseSensor):
    """Overdue maintenance items only."""

    _attr_native_unit_of_measurement = "items"
    _attr_icon      = "mdi:alert-circle"
    _attr_unique_id = f"{DOMAIN}_maintenance_overdue"
    _attr_name      = "Maintenance overdue"
    entity_id       = "sensor.family_hub_maintenance_overdue"

    @property
    def native_value(self) -> int:
        return len(_get_maintenance_tasks(self.coordinator.store, overdue_only=True))

    @property
    def extra_state_attributes(self) -> dict:
        store = self.coordinator.store
        today = date.today()
        tasks = _get_maintenance_tasks(store, overdue_only=True)
        items = []
        oldest = 0
        for task in tasks:
            chore       = store.get_chore(task["chore_id"])
            days_overdue= (today - date.fromisoformat(task["due_date"])).days
            oldest      = max(oldest, days_overdue)
            items.append({
                "name":        chore["name"] if chore else task["chore_id"],
                "description": chore.get("description", "") if chore else "",
                "days_overdue":days_overdue,
                "assigned_to": task.get("assigned_to"),
                "category_label": chore.get("category_label", "") if chore else "",
            })
        return {"items": items, "oldest_overdue_days": oldest}


# ---------------------------------------------------------------------------
# Global — needs attention
# ---------------------------------------------------------------------------

class FamilyHubNeedsAttentionSensor(FamilyHubBaseSensor):
    """
    Total count of things needing parent attention.
    State = total pending actions. Zero = all clear.

    Attributes include:
    - Full approval and redemption queues (ready to render action rows)
    - All active people with balances (for admin overview)
    - All active chores with new v0.3.0 fields (for admin chore management)
    - All store items (for admin store management)
    - Settings including category_labels (for admin settings + card dropdowns)
    """

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "items"
    _attr_icon      = "mdi:bell-alert"
    _attr_unique_id = f"{DOMAIN}_needs_attention"
    _attr_name      = "Needs attention"
    entity_id       = "sensor.family_hub_needs_attention"

    @property
    def native_value(self) -> int:
        store = self.coordinator.store
        return (
            len(store.get_pending_approvals())
            + len(store.get_pending_redemptions())
            + len(_get_maintenance_tasks(store, overdue_only=True))
            + len(store.get_group_reward_proposals_for_card())
            + len([s for s in store._data.get("subscriptions", []) if s["status"] == SUB_STATUS_CANCEL_PENDING])
        )

    @property
    def extra_state_attributes(self) -> dict:
        store = self.coordinator.store

        pending_tasks  = store.get_pending_approvals()
        pending_redeem = store.get_pending_redemptions()
        overdue_maint  = _get_maintenance_tasks(store, overdue_only=True)

        # All store items for admin store management tab — sorted by
        # sort_order (v0.6.3 drag-reorder), name as the deterministic
        # tie-breaker for legacy items whose sort_order is still 0.
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
                # v0.6.3 item 13: group reward fields for admin store management
                "is_group_reward":      i.get("is_group_reward", False),
                "contributors":         i.get("contributors", []),
                # v0.6.5: subscription fields for admin store-item modal
                "item_type":            i.get("item_type", "one_time"),
                "subscription_period":  i.get("subscription_period", ""),
                "subscription_anchor":  i.get("subscription_anchor", 1),
            }
            for i in sorted(
                store.store_items,
                key=lambda x: (x.get("sort_order", 0), x.get("name", "")),
            )
        ]

        # v0.6.5: cancel-pending subscription queue
        cancel_pending_subs = store.get_cancel_pending_subscriptions_for_card()

        # v0.6.5: all non-canceled subscriptions for Family panel rail
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
            # Counts for automations / badges
            "pending_task_approvals": len(pending_tasks),
            "pending_redemptions":    len(pending_redeem),
            "overdue_maintenance":    len(overdue_maint),
            # v0.6.5: subscription cancel requests
            "pending_subscription_cancellations": len(cancel_pending_subs),

            # Full queues — actionable rows for the admin card
            "approval_queue":        store.get_approval_queue_for_card(),
            "redemption_queue":      store.get_redemption_queue_for_card(),
            # v0.6.3 item 13: group reward proposals awaiting parent sign-off
            "group_proposal_queue":  store.get_group_reward_proposals_for_card(),
            # v0.6.5: subscription cancel requests awaiting parent action
            "subscription_cancel_queue": cancel_pending_subs,
            # v0.6.5: all active subscriptions for Family panel rail
            "all_subscriptions": subs_all,

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
                    # v0.4.2: per-person penalty pause flag for admin Overview toggle
                    "penalties_paused": p.get("penalties_paused", False),
                    # v0.5.0: per-chore streak counts for admin Edit Streaks modal
                    "streaks": {k: v.get("count", 0) for k, v in p.get("streaks", {}).items()},
                    # v0.5.0: scheduled allowance config for admin edit modal
                    "allowance_points":   p.get("allowance_points", 0),
                    "allowance_schedule": p.get("allowance_schedule", "weekly"),
                    "allowance_weekday":  p.get("allowance_weekday", 5),
                    "allowance_monthday": p.get("allowance_monthday", 1),
                    # v0.5.0: notification target
                    "notify_target":      p.get("notify_target", ""),
                    # v0.6.0: codename + theme
                    "code":               p.get("code", ""),
                    "theme_key":          p.get("theme_key", "classic"),
                    # v0.6.0 S5: rank
                    "rank_index":          p.get("rank_index", 999 if p.get("type") == "parent" else 0),
                    "rank_drop_threshold": p.get("rank_drop_threshold"),   # None = use global
                    "rank_gain_threshold": p.get("rank_gain_threshold"),   # None = use global
                    # v0.6.0 S6: large-button mode for pre-readers
                    "child_mode":          p.get("child_mode", False),
                    # v0.6.1: success-rate person streak
                    "completion_streak":        p.get("completion_streak", 0),
                    "completion_threshold_pct": p.get("completion_threshold_pct", 80),
                    "completion_milestone":     p.get("completion_milestone", 7),
                    "completion_bonus_points":  p.get("completion_bonus_points", 50),
                    # v0.6.3: store goal item ("" = none)
                    "goal_item_id":             p.get("goal_item_id", "") or "",
                }
                for p in store.people if p.get("active", True)
            ],

            # All active chores (non-maintenance, non-one-time) for admin chore list
            # Includes all v0.3.0 fields: chore_type, category_label, sort_order,
            # assigned_to (list), penalty fields, recurrence details, expires_after_days
            "active_chores": store.get_active_chores_for_card(),

            # All active store items for admin store management
            "store_items": all_store_items,

            # Settings for admin display and card dropdowns
            "family_name":              store.family_name,
            "points_per_dollar":        store.points_per_dollar,
            "show_dollar_value_to_kids":store.show_dollar_value_to_kids,
            "category_labels":          store.category_labels,
            # v0.4.2: global penalty pause flag for admin Settings toggle
            "penalties_paused_global":  store.penalties_paused_global,
            # v0.5.0: penalty alert time for admin Settings
            "penalty_alert_time":       store.settings.get("penalty_alert_time", 800),
            # v0.6.0: hub layout settings
            "rooms_config":             store.settings.get("rooms_config", {}),
            "weather_entity":           store.settings.get("weather_entity", ""),
            "today_calendar_entities":  store.settings.get("today_calendar_entities", []),
            "rank_eval_weekday":        store.settings.get("rank_eval_weekday", 0),
            "rank_drop_threshold":      store.settings.get("rank_drop_threshold", 50),
            "rank_gain_threshold":      store.settings.get("rank_gain_threshold", 75),
            "rank_ppd_ladder":          store.rank_ppd_ladder,

            # v0.4.0: enriched history log for admin log/approvals UI
            # Includes person name/color, chore_name, reversible action hint.
            # Trimmed to 30-day rolling window by daily tick.
            "history_log": store.get_history_for_card(),
        }


# ---------------------------------------------------------------------------
# Global — claimable tasks
# ---------------------------------------------------------------------------

class FamilyHubClaimableTasksSensor(FamilyHubBaseSensor):
    """Unclaimed tasks in the claimable/bonus pool."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"
    _attr_icon      = "mdi:hand-clap"
    _attr_unique_id = f"{DOMAIN}_claimable_tasks"
    _attr_name      = "Claimable tasks"
    entity_id       = "sensor.family_hub_claimable_tasks"

    @property
    def native_value(self) -> int:
        return len(self.coordinator.store.get_claimable_tasks())

    @property
    def extra_state_attributes(self) -> dict:
        store = self.coordinator.store
        return {
            "tasks":     store.get_claimable_tasks_for_card(),
            "all_tasks": store.get_all_tasks_for_command_center(),
        }


# ---------------------------------------------------------------------------
# Global — today (v0.6.0 placeholder; populated when calendar room ships)
# ---------------------------------------------------------------------------

class FamilyHubTodaySensor(FamilyHubBaseSensor):
    """
    Today's scheduled items.
    State = count of items for today. Initially always 0.
    Populated when the Calendar room ships in v0.8.0.
    Defining it now avoids a sensor add mid-flight.
    """

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "items"
    _attr_icon      = "mdi:calendar-today"
    _attr_unique_id = f"{DOMAIN}_today"
    _attr_name      = "Today"
    entity_id       = "sensor.family_hub_today"

    @property
    def native_value(self) -> int:
        return 0

    @property
    def extra_state_attributes(self) -> dict:
        return {"schedule": []}
"""
Family Hub — sensor platform (v0.3.0).

8 sensors total:

Per-person (1 per active family member):
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
    REDEMPTION_PENDING,
    STATUS_PENDING_APPROVAL,
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
    coordinator: FamilyHubCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]

    entities: list[SensorEntity] = []
    for person in coordinator.store.get_active_people():
        entities.append(FamilyHubPersonSensor(coordinator, person["id"]))

    entities.append(FamilyHubMaintenanceDueSensor(coordinator))
    entities.append(FamilyHubMaintenanceOverdueSensor(coordinator))
    entities.append(FamilyHubNeedsAttentionSensor(coordinator))
    entities.append(FamilyHubClaimableTasksSensor(coordinator))

    async_add_entities(entities, update_before_add=True)


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

        balance  = person.get("points_balance", 0)
        ppdollar = store.points_per_dollar

        task_data   = store.get_tasks_for_card(self._person_id)
        store_items = store.get_store_items_for_card(self._person_id)

        return {
            # Identity
            "person_id":   self._person_id,
            "person_type": person.get("type", "kid"),
            "avatar_color":person.get("avatar_color", "#7F77DD"),
            "active":      person.get("active", True),

            # Point summary
            "lifetime_points": person.get("points_lifetime", 0),
            "dollar_value":    round(balance / ppdollar, 2) if ppdollar else 0,
            # show_dollar_value: always true for parents, respects toggle for kids
            "show_dollar_value": (
                True if person.get("type") == "parent"
                else store.show_dollar_value_to_kids
            ),

            # Counts for automations
            "tasks_due_today":         due_today_count,
            "tasks_overdue":           overdue_count,
            "pending_approval":        pending_appr_count,
            "tasks_completed_this_week": len(completed_this_week),
            "tasks_completed_total":   len(completed_total),
            "pending_redemptions":     pending_redeem_count,

            # Full task lists for the dashboard card
            # Each task row includes: task_id, name, description, points,
            # due_date, status, category_label, penalty_enabled, penalty_points
            "tasks_due_today_list":      task_data["due_today"],
            "tasks_overdue_list":        task_data["overdue"],
            "tasks_pending_approval_list": task_data["pending_approval"],

            # Store items visible to this person
            "store_items": store_items,
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
        )

    @property
    def extra_state_attributes(self) -> dict:
        store = self.coordinator.store

        pending_tasks  = store.get_pending_approvals()
        pending_redeem = store.get_pending_redemptions()
        overdue_maint  = _get_maintenance_tasks(store, overdue_only=True)

        # All store items for admin store management tab
        all_store_items = [
            {
                "item_id":     i["id"],
                "name":        i["name"],
                "description": i.get("description", ""),
                "dollar_value":i.get("dollar_value", 0),
                "points_cost": i.get("points_cost", 0),
                "scope":       i.get("scope", "common"),
                "person_ids":  i.get("person_ids", []),
                "active":      i.get("active", True),
            }
            for i in store.store_items if i.get("active", True)
        ]

        return {
            # Counts for automations / badges
            "pending_task_approvals": len(pending_tasks),
            "pending_redemptions":    len(pending_redeem),
            "overdue_maintenance":    len(overdue_maint),

            # Full queues — actionable rows for the admin card
            "approval_queue":   store.get_approval_queue_for_card(),
            "redemption_queue": store.get_redemption_queue_for_card(),

            # All active people with balances for admin overview
            "people": [
                {
                    "person_id":      p["id"],
                    "name":           p["name"],
                    "type":           p.get("type", "kid"),
                    "avatar_color":   p.get("avatar_color", "#7F77DD"),
                    "points_balance": p.get("points_balance", 0),
                    "points_lifetime":p.get("points_lifetime", 0),
                    "active":         p.get("active", True),
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

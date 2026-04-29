"""
Family Hub — sensor platform.

8 sensors total — clean, purposeful, no bloat:

Per-person (1 per family member, dynamic):
  sensor.family_hub_[name]
    state  = current spendable point balance
    attrs  = lifetime points, dollar value, tasks due today,
             tasks overdue, pending approval, completed this week,
             completed total, pending redemptions, person type

Global (4 fixed):
  sensor.family_hub_maintenance_due      — items due within 14 days
  sensor.family_hub_maintenance_overdue  — overdue maintenance + personal reminders
  sensor.family_hub_needs_attention      — total things needing parent action
  sensor.family_hub_claimable_tasks      — unclaimed tasks in the claimable pool

All richer data (chore lists, store items, history) is served via the
coordinator/store directly to dashboards — not as HA entities.
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
    MAINTENANCE_CATEGORIES,
    MAINTENANCE_DUE_SOON_DAYS,
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
    """Set up Family Hub sensors from a config entry."""
    coordinator: FamilyHubCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]

    entities: list[SensorEntity] = []

    # One sensor per person
    for person in coordinator.store.people:
        entities.append(FamilyHubPersonSensor(coordinator, person["id"]))

    # Four global sensors
    entities.append(FamilyHubMaintenanceDueSensor(coordinator))
    entities.append(FamilyHubMaintenanceOverdueSensor(coordinator))
    entities.append(FamilyHubNeedsAttentionSensor(coordinator))
    entities.append(FamilyHubClaimableTasksSensor(coordinator))

    async_add_entities(entities, update_before_add=True)


class FamilyHubBaseSensor(CoordinatorEntity[FamilyHubCoordinator], SensorEntity):
    """Base class for all Family Hub sensors."""

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
    One sensor per family member.

    State = current spendable point balance (most useful for voice + automations).
    Attributes carry everything else about that person.
    """

    _attr_state_class = SensorStateClass.MEASUREMENT
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

        store = self.coordinator.store
        today = date.today().isoformat()
        week_ago = (date.today() - timedelta(days=7)).isoformat()

        all_tasks = store.task_instances
        person_active = [
            t for t in all_tasks
            if t.get("assigned_to") == self._person_id
            and t["status"] in ACTIVE_STATUSES
        ]
        due_today = [t for t in person_active if t["due_date"] == today]
        overdue = [t for t in person_active if t["due_date"] < today]
        pending_approval = [
            t for t in all_tasks
            if t.get("completed_by") == self._person_id
            and t["status"] == STATUS_PENDING_APPROVAL
        ]
        completed_total = [
            t for t in all_tasks
            if t.get("completed_by") == self._person_id
            and t.get("completed_at") is not None
        ]
        completed_this_week = [
            t for t in completed_total
            if t.get("completed_at", "")[:10] >= week_ago
        ]
        pending_redemptions = [
            r for r in store.redemptions
            if r["person_id"] == self._person_id and r["status"] == "pending"
        ]

        balance = person.get("points_balance", 0)
        ppdollar = store.points_per_dollar

        return {
            "person_id": self._person_id,
            "person_type": person.get("type", "kid"),
            "active": person.get("active", True),
            "lifetime_points": person.get("points_lifetime", 0),
            "dollar_value": round(balance / ppdollar, 2) if ppdollar else 0,
            "tasks_due_today": len(due_today),
            "tasks_overdue": len(overdue),
            "pending_approval": len(pending_approval),
            "tasks_completed_this_week": len(completed_this_week),
            "tasks_completed_total": len(completed_total),
            "pending_redemptions": len(pending_redemptions),
        }


# ---------------------------------------------------------------------------
# Shared maintenance helper
# ---------------------------------------------------------------------------

def _get_maintenance_tasks(store, overdue_only: bool = False) -> list[dict]:
    """Return active maintenance + personal_reminder task instances."""
    today = date.today()
    due_soon_cutoff = (today + timedelta(days=MAINTENANCE_DUE_SOON_DAYS)).isoformat()
    today_str = today.isoformat()

    results = []
    for task in store.task_instances:
        if task["status"] not in ACTIVE_STATUSES:
            continue
        chore = store.get_chore(task["chore_id"])
        if not chore or chore.get("category") not in MAINTENANCE_CATEGORIES:
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
    """
    Count of house maintenance + personal reminder items
    due within the next 14 days (including today and overdue).
    """

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "items"
    _attr_icon = "mdi:home-alert"
    _attr_unique_id = f"{DOMAIN}_maintenance_due"
    _attr_name = "Maintenance due"
    entity_id = "sensor.family_hub_maintenance_due"

    @property
    def native_value(self) -> int:
        return len(_get_maintenance_tasks(self.coordinator.store))

    @property
    def extra_state_attributes(self) -> dict:
        store = self.coordinator.store
        today = date.today()
        today_str = today.isoformat()
        week_str = (today + timedelta(days=7)).isoformat()

        tasks = _get_maintenance_tasks(store)
        overdue = [t for t in tasks if t["due_date"] < today_str]
        due_this_week = [t for t in tasks if today_str <= t["due_date"] <= week_str]
        due_next_week = [t for t in tasks if week_str < t["due_date"]]

        upcoming = sorted(
            [t for t in tasks if t["due_date"] >= today_str],
            key=lambda t: t["due_date"],
        )
        next_item = next_due_date = next_due_days = None
        if upcoming:
            chore = store.get_chore(upcoming[0]["chore_id"])
            next_item = chore["name"] if chore else None
            next_due_date = upcoming[0]["due_date"]
            next_due_days = (date.fromisoformat(next_due_date) - today).days

        return {
            "overdue": len(overdue),
            "due_this_week": len(due_this_week),
            "due_next_week": len(due_next_week),
            "next_item": next_item,
            "next_due_date": next_due_date,
            "next_due_days": next_due_days,
        }


# ---------------------------------------------------------------------------
# Global — maintenance overdue
# ---------------------------------------------------------------------------

class FamilyHubMaintenanceOverdueSensor(FamilyHubBaseSensor):
    """
    Count of overdue maintenance + personal reminder items.
    Separate from due-soon so you can trigger urgent automations on this alone.
    """

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "items"
    _attr_icon = "mdi:alert-circle"
    _attr_unique_id = f"{DOMAIN}_maintenance_overdue"
    _attr_name = "Maintenance overdue"
    entity_id = "sensor.family_hub_maintenance_overdue"

    @property
    def native_value(self) -> int:
        return len(_get_maintenance_tasks(self.coordinator.store, overdue_only=True))

    @property
    def extra_state_attributes(self) -> dict:
        store = self.coordinator.store
        today = date.today()
        tasks = _get_maintenance_tasks(store, overdue_only=True)

        items = []
        oldest_days = 0
        for task in tasks:
            chore = store.get_chore(task["chore_id"])
            days_overdue = (today - date.fromisoformat(task["due_date"])).days
            oldest_days = max(oldest_days, days_overdue)
            items.append({
                "name": chore["name"] if chore else task["chore_id"],
                "days_overdue": days_overdue,
                "assigned_to": task.get("assigned_to"),
                "category": chore.get("category") if chore else None,
            })

        return {
            "items": items,
            "oldest_overdue_days": oldest_days,
        }


# ---------------------------------------------------------------------------
# Global — needs attention
# ---------------------------------------------------------------------------

class FamilyHubNeedsAttentionSensor(FamilyHubBaseSensor):
    """
    Total count of things needing a parent's attention right now.
    Perfect for a dashboard badge or automation trigger.
    State = total. Zero means all clear.
    """

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "items"
    _attr_icon = "mdi:bell-alert"
    _attr_unique_id = f"{DOMAIN}_needs_attention"
    _attr_name = "Needs attention"
    entity_id = "sensor.family_hub_needs_attention"

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
        pending_tasks = store.get_pending_approvals()
        pending_redemptions = store.get_pending_redemptions()
        overdue_maintenance = _get_maintenance_tasks(store, overdue_only=True)

        return {
            "pending_task_approvals": len(pending_tasks),
            "pending_redemptions": len(pending_redemptions),
            "overdue_maintenance": len(overdue_maintenance),
            "task_ids": [t["id"] for t in pending_tasks],
            "redemption_ids": [r["id"] for r in pending_redemptions],
        }


# ---------------------------------------------------------------------------
# Global — claimable tasks
# ---------------------------------------------------------------------------

class FamilyHubClaimableTasksSensor(FamilyHubBaseSensor):
    """
    Count of unclaimed tasks in the claimable pool.
    Useful for the command center and 'bonus chores available' automations.
    """

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"
    _attr_icon = "mdi:hand-clap"
    _attr_unique_id = f"{DOMAIN}_claimable_tasks"
    _attr_name = "Claimable tasks"
    entity_id = "sensor.family_hub_claimable_tasks"

    @property
    def native_value(self) -> int:
        return len(self.coordinator.store.get_claimable_tasks())

    @property
    def extra_state_attributes(self) -> dict:
        store = self.coordinator.store
        tasks = store.get_claimable_tasks()
        items = []
        for task in tasks:
            chore = store.get_chore(task["chore_id"])
            items.append({
                "task_id": task["id"],
                "name": chore["name"] if chore else task["chore_id"],
                "points": chore.get("points", 0) if chore else 0,
                "due_date": task["due_date"],
            })
        return {"tasks": items}

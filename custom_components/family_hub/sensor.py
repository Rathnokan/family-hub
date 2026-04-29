"""
Family Hub — sensor platform.

Creates a minimal set of HA sensors:
  • One points_balance sensor per person
  • One points_lifetime sensor per person
  • Global: tasks_due_today, tasks_overdue, pending_approvals

All other data (chore lists, store items, history) is served via
the integration's REST-like API endpoint — not as HA entities.
"""

from __future__ import annotations

import logging

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import FamilyHubCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Family Hub sensors from a config entry."""
    coordinator: FamilyHubCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]

    entities: list[SensorEntity] = []

    # Per-person point sensors
    for person in coordinator.store.people:
        entities.append(FamilyHubPointsBalanceSensor(coordinator, person["id"]))
        entities.append(FamilyHubPointsLifetimeSensor(coordinator, person["id"]))

    # Global sensors
    entities.append(FamilyHubTasksDueTodaySensor(coordinator))
    entities.append(FamilyHubOverdueSensor(coordinator))
    entities.append(FamilyHubPendingApprovalsSensor(coordinator))

    async_add_entities(entities, update_before_add=True)


class FamilyHubBaseSensor(CoordinatorEntity[FamilyHubCoordinator], SensorEntity):
    """Base class for all Family Hub sensors."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: FamilyHubCoordinator) -> None:
        super().__init__(coordinator)

    @property
    def device_info(self) -> dict:
        return {
            "identifiers": {(DOMAIN, "family_hub")},
            "name": self.coordinator.store.family_name,
            "manufacturer": "Family Hub",
            "model": "Family Task Manager",
        }


class FamilyHubPointsBalanceSensor(FamilyHubBaseSensor):
    """Current spendable point balance for one person."""

    _attr_state_class = SensorStateClass.TOTAL
    _attr_native_unit_of_measurement = "pts"
    _attr_icon = "mdi:star-circle"

    def __init__(self, coordinator: FamilyHubCoordinator, person_id: str) -> None:
        super().__init__(coordinator)
        self._person_id = person_id
        person = coordinator.store.get_person(person_id)
        self._person_name = person["name"] if person else person_id
        self._attr_unique_id = f"{DOMAIN}_{person_id}_points_balance"
        self._attr_name = f"{self._person_name} points"

    @property
    def native_value(self) -> int:
        person = self.coordinator.store.get_person(self._person_id)
        return person.get("points_balance", 0) if person else 0

    @property
    def extra_state_attributes(self) -> dict:
        person = self.coordinator.store.get_person(self._person_id)
        if not person:
            return {}
        return {
            "person_id": self._person_id,
            "person_name": person["name"],
            "person_type": person["type"],
            "lifetime_points": person.get("points_lifetime", 0),
            "dollar_value": round(person.get("points_balance", 0) / self.coordinator.store.points_per_dollar, 2),
        }


class FamilyHubPointsLifetimeSensor(FamilyHubBaseSensor):
    """All-time points ever earned by one person (never decreases)."""

    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_native_unit_of_measurement = "pts"
    _attr_icon = "mdi:trophy"

    def __init__(self, coordinator: FamilyHubCoordinator, person_id: str) -> None:
        super().__init__(coordinator)
        self._person_id = person_id
        person = coordinator.store.get_person(person_id)
        self._person_name = person["name"] if person else person_id
        self._attr_unique_id = f"{DOMAIN}_{person_id}_points_lifetime"
        self._attr_name = f"{self._person_name} lifetime points"

    @property
    def native_value(self) -> int:
        person = self.coordinator.store.get_person(self._person_id)
        return person.get("points_lifetime", 0) if person else 0

    @property
    def extra_state_attributes(self) -> dict:
        person = self.coordinator.store.get_person(self._person_id)
        if not person:
            return {}
        return {
            "person_id": self._person_id,
            "person_name": person["name"],
        }


class FamilyHubTasksDueTodaySensor(FamilyHubBaseSensor):
    """Count of tasks due today across all people."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"
    _attr_icon = "mdi:calendar-check"
    _attr_unique_id = f"{DOMAIN}_tasks_due_today"
    _attr_name = "Tasks due today"

    @property
    def native_value(self) -> int:
        return len(self.coordinator.store.get_tasks_due_today())

    @property
    def extra_state_attributes(self) -> dict:
        tasks = self.coordinator.store.get_tasks_due_today()
        return {
            "task_ids": [t["id"] for t in tasks],
            "count": len(tasks),
        }


class FamilyHubOverdueSensor(FamilyHubBaseSensor):
    """Count of overdue (past-due, still pending) tasks."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"
    _attr_icon = "mdi:alert-circle"
    _attr_unique_id = f"{DOMAIN}_tasks_overdue"
    _attr_name = "Overdue tasks"

    @property
    def native_value(self) -> int:
        return len(self.coordinator.store.get_overdue_tasks())

    @property
    def extra_state_attributes(self) -> dict:
        tasks = self.coordinator.store.get_overdue_tasks()
        return {
            "count": len(tasks),
            "task_ids": [t["id"] for t in tasks],
        }


class FamilyHubPendingApprovalsSensor(FamilyHubBaseSensor):
    """Count of tasks waiting for parent approval."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"
    _attr_icon = "mdi:clock-alert"
    _attr_unique_id = f"{DOMAIN}_pending_approvals"
    _attr_name = "Pending approvals"

    @property
    def native_value(self) -> int:
        return (
            len(self.coordinator.store.get_pending_approvals())
            + len(self.coordinator.store.get_pending_redemptions())
        )

    @property
    def extra_state_attributes(self) -> dict:
        tasks = self.coordinator.store.get_pending_approvals()
        redemptions = self.coordinator.store.get_pending_redemptions()
        return {
            "pending_tasks": len(tasks),
            "pending_redemptions": len(redemptions),
            "task_ids": [t["id"] for t in tasks],
            "redemption_ids": [r["id"] for r in redemptions],
        }

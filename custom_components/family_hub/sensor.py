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
from .card_model import (
    build_person_scalars,
    build_needs_attention_scalars,
    build_maintenance_due_scalars,
    build_maintenance_overdue_scalars,
)

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

    # Keep the big card-payload lists out of the recorder DB (they're consumed by
    # the card, not by history/logbook). The small scalar counts stay recorded so
    # they remain useful for automations. v0.7.0 P2 removes these from attributes
    # entirely in favour of the websocket model API.
    _unrecorded_attributes = frozenset({
        "tasks_due_today_list", "tasks_overdue_list", "tasks_pending_approval_list",
        "store_items", "goal", "group_proposals", "subscriptions",
    })

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
        # v0.7.0 P2/P3: lean scalar payload (identity + point summary + counts)
        # for automations + the card editor. The full per-person card data (task
        # lists, store items, goal, subscriptions) reaches the card via the
        # websocket model (family_hub/get_model), not these attributes.
        return build_person_scalars(self.coordinator.store, self._person_id)


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
    _unrecorded_attributes = frozenset({"items"})

    @property
    def native_value(self) -> int:
        return len(_get_maintenance_tasks(self.coordinator.store))

    @property
    def extra_state_attributes(self) -> dict:
        # v0.7.0 P3: scalar summary only — the items list reaches the card via
        # the websocket model.
        return build_maintenance_due_scalars(self.coordinator.store)


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
    _unrecorded_attributes = frozenset({"items"})

    @property
    def native_value(self) -> int:
        return len(_get_maintenance_tasks(self.coordinator.store, overdue_only=True))

    @property
    def extra_state_attributes(self) -> dict:
        # v0.7.0 P3: scalar only — the items list reaches the card via the model.
        return build_maintenance_overdue_scalars(self.coordinator.store)


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

    # This sensor carries the entire admin/card model (queues, all people, all
    # chores ×2, all store items, full settings, AND the 30-day history_log).
    # None of it belongs in the recorder — exclude every non-count key. The small
    # count attrs (pending_task_approvals, pending_redemptions, …) stay recorded.
    # v0.7.0 P2 moves this whole payload to the websocket model API.
    # Recorder: exclude the volatile data_rev (bumps every save) and the
    # editor-only slim roster / room config. The small action counts stay
    # recorded so automations can chart them.
    _unrecorded_attributes = frozenset({
        "data_rev", "people", "rooms_config", "family_name",
    })

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
        # v0.7.0 P3: lean payload — data_rev + action counts + a slim roster +
        # room config (for the card editor & automations). The full admin model
        # (queues, full people, all chores, store items, settings, 30-day history)
        # reaches the card via the websocket model (family_hub/get_model).
        return build_needs_attention_scalars(self.coordinator.store)


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
    _unrecorded_attributes = frozenset({"tasks", "all_tasks"})

    @property
    def native_value(self) -> int:
        return len(self.coordinator.store.get_claimable_tasks())

    @property
    def extra_state_attributes(self) -> dict:
        # v0.7.0 P3: the claimable + command-center task lists reach the card via
        # the websocket model. State (count) is enough on the sensor itself.
        return {}

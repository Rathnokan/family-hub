"""
Family Hub — coordinator.

The coordinator is the central hub that HA entities (sensors) subscribe to.
It owns the data store, runs the daily tick scheduler, and notifies
all listeners when data changes.

Daily tick note: The tick date is now tracked persistently inside the data
store's JSON file (settings.last_tick_date). The coordinator simply calls
async_daily_tick() on every poll interval and lets the store decide whether
action is needed. This means missed days due to HA downtime are caught up
automatically without any in-memory state that would be lost on restart.
"""

from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import DOMAIN, UPDATE_INTERVAL
from .data_store import FamilyHubDataStore

_LOGGER = logging.getLogger(__name__)


class FamilyHubCoordinator(DataUpdateCoordinator):
    """
    Coordinates data updates between the data store and HA entities.

    Sensors call coordinator.data to get the latest summary.
    Services call coordinator.store directly to mutate data, then
    call coordinator.async_refresh() to push updates to all entities.
    """

    def __init__(self, hass: HomeAssistant, store: FamilyHubDataStore) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=UPDATE_INTERVAL),
        )
        self.store = store

    async def _async_update_data(self) -> dict:
        """
        Called by the coordinator on its UPDATE_INTERVAL schedule and
        whenever async_refresh() is called.

        Delegates tick logic entirely to the data store, which uses persistent
        state to determine whether tasks need to be generated and handles
        catch-up for any days missed while HA was offline.
        """
        try:
            await self.store.async_daily_tick()
            return self.store.get_summary()

        except Exception as err:
            raise UpdateFailed(f"Family Hub data update failed: {err}") from err

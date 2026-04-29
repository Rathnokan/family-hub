"""
Family Hub — coordinator.

The coordinator is the central hub that HA entities (sensors) subscribe to.
It owns the data store, runs the daily tick scheduler, and notifies
all listeners when data changes.
"""

from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

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
        self._last_tick_date: str | None = None

    async def _async_update_data(self) -> dict:
        """
        Called by the coordinator on its UPDATE_INTERVAL schedule and
        whenever async_refresh() is called.

        Runs the daily tick if the date has changed, then returns the
        current summary dict that all sensors read from.
        """
        try:
            today_str = dt_util.now().date().isoformat()
            if self._last_tick_date != today_str:
                _LOGGER.debug("Family Hub: new day detected (%s), running daily tick", today_str)
                await self.store.async_daily_tick()
                self._last_tick_date = today_str

            return self.store.get_summary()

        except Exception as err:
            raise UpdateFailed(f"Family Hub data update failed: {err}") from err

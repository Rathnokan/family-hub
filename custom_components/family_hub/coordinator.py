"""
Family Hub — coordinator.

The coordinator is the central hub that HA entities (sensors) subscribe to.
It owns the data store, runs the daily tick scheduler, and notifies
all listeners when data changes.

Scheduling note (v0.7.0): the coordinator is **event-driven**, not polled.
`update_interval` is None — there is no blind 30 s poll. Instead:
  • Mutations go through services, which call `async_refresh()` for instant UI.
  • The daily tick fires once at local midnight (`async_daily_rollover`), with
    missed days caught up inside the tick via settings.last_tick_date and one
    catch-up tick at startup (`async_config_entry_first_refresh`).
  • Reminders / penalty nudges are time-of-day sensitive, so a light per-minute
    heartbeat (`async_notification_heartbeat`) dispatches them — without running
    the tick or rebuilding sensor payloads.
The time listeners are registered in __init__.async_setup_entry.
"""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import DOMAIN
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
            # Event-driven: no automatic poll. Refreshes come from service calls
            # and the midnight rollover; notifications run on a separate heartbeat.
            update_interval=None,
        )
        self.store = store
        self._tick_running = False

    async def _async_update_data(self) -> dict:
        """
        Runs on every async_refresh()/async_request_refresh() — i.e. on each
        service mutation and at the midnight rollover. There is no periodic poll.

        Delegates tick logic entirely to the data store, which uses persistent
        state to determine whether tasks need to be generated and handles
        catch-up for any days missed while HA was offline.
        """
        try:
            await self.store.async_daily_tick()
        except Exception as err:
            raise UpdateFailed(f"Family Hub data update failed: {err}") from err

        # Notification dispatch is best-effort: a flaky notify.* target (phone
        # offline, Alexa hiccup) must NOT mark the whole integration as failed,
        # or every entity goes unavailable over a missed push. Log and move on.
        try:
            await self.store.async_check_notifications()
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning("Family Hub: notification check failed (non-fatal): %s", err)

        return self.store.get_summary()

    async def async_daily_rollover(self, now=None) -> None:
        """Run the daily tick at local midnight and push fresh state to entities.

        Replaces the old blind 30 s poll for the once-a-day rollover. Missed days
        (HA down across midnight) are caught up inside the tick via
        settings.last_tick_date; the startup first_refresh already runs one
        catch-up tick. Registered via async_track_time_change(hour=0, minute=0).
        """
        await self.async_request_refresh()

    async def async_notification_heartbeat(self, now=None) -> None:
        """Light per-minute check for due reminders / penalty nudges.

        Per-chore reminder_time and penalty_alert_time are time-of-day sensitive,
        so they need a periodic check through the day. This does NOT run the daily
        tick or rebuild sensor payloads — it only dispatches notifications (and
        persists their 'nudged' flags via async_save), so it is far cheaper than
        the old full-poll path. Failures are non-fatal.
        """
        try:
            await self.store.async_check_notifications()
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning(
                "Family Hub: notification heartbeat failed (non-fatal): %s", err
            )

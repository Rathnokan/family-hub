"""
Family Hub — websocket API (v0.7.0 P2).

Exposes the full card model over a websocket command so the dashboard card can
pull it on demand, instead of receiving it as fat sensor attributes pushed
through the state machine + recorder to every connected device on every change.

The card calls:  hass.connection.sendMessagePromise({ type: "family_hub/get_model" })
and reads the result via card._attrs(<entity_id>). The result is keyed by
entity_id, mirroring the sensor-attribute shape the card already understood.
"""

from __future__ import annotations

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .card_model import build_card_model
from .const import DOMAIN


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register Family Hub websocket commands. Call once per process."""
    websocket_api.async_register_command(hass, _ws_get_model)


def _find_store(hass: HomeAssistant):
    """Return the (single) config entry's data store, or None if not loaded."""
    for data in hass.data.get(DOMAIN, {}).values():
        if isinstance(data, dict) and data.get("store") is not None:
            return data["store"]
    return None


@websocket_api.websocket_command({vol.Required("type"): "family_hub/get_model"})
@callback
def _ws_get_model(hass: HomeAssistant, connection, msg: dict) -> None:
    """Return the full card model keyed by entity_id."""
    store = _find_store(hass)
    if store is None:
        connection.send_error(msg["id"], "not_loaded", "Family Hub is not loaded")
        return
    connection.send_result(msg["id"], build_card_model(store))

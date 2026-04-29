"""
Family Hub — config flow.

Two-step setup:
  Step 1: Family name + points-per-dollar rate
  Step 2: Add your first people (at least one parent)

Additional people can be added later from the admin dashboard
using the family_hub.add_person service.
"""

from __future__ import annotations

import logging
import os

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import (
    CONF_FAMILY_NAME,
    CONF_POINTS_PER_DOLLAR,
    DEFAULT_FAMILY_NAME,
    DEFAULT_POINTS_PER_DOLLAR,
    DOMAIN,
    PERSON_TYPE_KID,
    PERSON_TYPE_PARENT,
    STORAGE_FILE,
)

_LOGGER = logging.getLogger(__name__)


class FamilyHubConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the Family Hub setup flow."""

    VERSION = 1

    def __init__(self) -> None:
        self._config: dict = {}
        self._people: list[dict] = []

    async def async_step_user(self, user_input: dict | None = None) -> FlowResult:
        """Step 1: Family name and points rate."""
        # Only one instance allowed
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        errors: dict = {}

        if user_input is not None:
            family_name = user_input[CONF_FAMILY_NAME].strip()
            if not family_name:
                errors[CONF_FAMILY_NAME] = "name_required"
            else:
                self._config = {
                    CONF_FAMILY_NAME: family_name,
                    CONF_POINTS_PER_DOLLAR: user_input[CONF_POINTS_PER_DOLLAR],
                }
                return await self.async_step_add_parent()

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_FAMILY_NAME, default=DEFAULT_FAMILY_NAME): str,
                vol.Required(CONF_POINTS_PER_DOLLAR, default=DEFAULT_POINTS_PER_DOLLAR): vol.All(
                    vol.Coerce(int), vol.Range(min=1, max=1000)
                ),
            }),
            description_placeholders={
                "example_rate": f"{DEFAULT_POINTS_PER_DOLLAR} points = $1.00",
            },
            errors=errors,
        )

    async def async_step_add_parent(self, user_input: dict | None = None) -> FlowResult:
        """Step 2: Add the first parent."""
        errors: dict = {}

        if user_input is not None:
            name = user_input.get("parent_name", "").strip()
            if not name:
                errors["parent_name"] = "name_required"
            else:
                self._people.append({
                    "name": name,
                    "type": PERSON_TYPE_PARENT,
                })
                return await self.async_step_add_kids()

        return self.async_show_form(
            step_id="add_parent",
            data_schema=vol.Schema({
                vol.Required("parent_name"): str,
            }),
            description_placeholders={
                "note": "You can add a second parent and all kids from the admin dashboard after setup.",
            },
            errors=errors,
        )

    async def async_step_add_kids(self, user_input: dict | None = None) -> FlowResult:
        """Step 3: Add kids (optional, can skip and add later)."""
        errors: dict = {}

        if user_input is not None:
            if user_input.get("skip"):
                return self._create_entry()

            kid_names_raw = user_input.get("kid_names", "").strip()
            if kid_names_raw:
                for name in [n.strip() for n in kid_names_raw.split(",") if n.strip()]:
                    self._people.append({"name": name, "type": PERSON_TYPE_KID})

            return self._create_entry()

        return self.async_show_form(
            step_id="add_kids",
            data_schema=vol.Schema({
                vol.Optional("kid_names", default=""): str,
                vol.Optional("skip", default=False): bool,
            }),
            description_placeholders={
                "hint": "Separate multiple names with commas, e.g: Emma, Jack, Lily",
            },
            errors=errors,
        )

    def _create_entry(self) -> FlowResult:
        storage_path = self.hass.config.path(STORAGE_FILE)
        return self.async_create_entry(
            title=self._config[CONF_FAMILY_NAME],
            data={
                **self._config,
                "storage_path": storage_path,
                "initial_people": self._people,
            },
        )

"""
Family Hub — data store.

All family data lives in a single JSON file under the HA config directory.
This module handles reading, writing, and all CRUD operations on that file.
No HA entities are created here — that's sensor.py's job.
"""

from __future__ import annotations

import json
import logging
import os
import uuid
from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant

from .const import (
    ACTIVE_STATUSES,
    CATEGORY_ASSIGNED,
    CATEGORY_CLAIMABLE,
    CATEGORY_MAINTENANCE,
    CATEGORY_ONE_TIME,
    DEFAULT_FAMILY_NAME,
    DEFAULT_POINTS_PER_DOLLAR,
    DOMAIN,
    HISTORY_PERSON_ADDED,
    HISTORY_POINTS_AWARDED,
    HISTORY_REDEMPTION_APPROVED,
    HISTORY_REDEMPTION_DECLINED,
    HISTORY_REDEMPTION_REQUESTED,
    HISTORY_TASK_ADDED,
    HISTORY_TASK_APPROVED,
    HISTORY_TASK_COMPLETED,
    HISTORY_TASK_DENIED,
    PERSON_TYPE_KID,
    PERSON_TYPE_PARENT,
    RECURRENCE_DAILY,
    RECURRENCE_EVERY_N_DAYS,
    RECURRENCE_EVERY_N_WEEKS,
    RECURRENCE_MONTHLY_ON_DATE,
    RECURRENCE_ONE_TIME,
    RECURRENCE_WEEKLY,
    REDEMPTION_APPROVED,
    REDEMPTION_DECLINED,
    REDEMPTION_PENDING,
    SCOPE_COMMON,
    SCOPE_PERSONAL,
    STATUS_APPROVED,
    STATUS_CLAIMED,
    STATUS_DENIED,
    STATUS_PENDING,
    STATUS_PENDING_APPROVAL,
    STATUS_SELF_REPORTED,
    STORAGE_FILE,
    STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)


def _now_iso() -> str:
    return datetime.now().astimezone().isoformat()


def _today_str() -> str:
    return date.today().isoformat()


def _new_id() -> str:
    return str(uuid.uuid4())


def _empty_store(family_name: str = DEFAULT_FAMILY_NAME, points_per_dollar: int = DEFAULT_POINTS_PER_DOLLAR) -> dict:
    """Return a fresh, empty data store with default settings."""
    return {
        "version": STORAGE_VERSION,
        "settings": {
            "family_name": family_name,
            "points_per_dollar": points_per_dollar,
            "created_at": _now_iso(),
        },
        "people": [],
        "chores": [],
        "task_instances": [],
        "store_items": [],
        "redemptions": [],
        "history": [],
    }


class FamilyHubDataStore:
    """Manages reading and writing the Family Hub JSON data file."""

    def __init__(self, hass: HomeAssistant, storage_path: str) -> None:
        self._hass = hass
        self._path = storage_path
        self._data: dict[str, Any] = {}

    # ------------------------------------------------------------------
    # Load / Save
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Load data from disk. Creates a fresh store if file doesn't exist."""
        def _load() -> dict:
            if not os.path.exists(self._path):
                _LOGGER.info("Family Hub: no data file found, creating fresh store at %s", self._path)
                return _empty_store()
            try:
                with open(self._path, encoding="utf-8") as f:
                    data = json.load(f)
                _LOGGER.info("Family Hub: loaded data store from %s", self._path)
                return data
            except (json.JSONDecodeError, OSError) as err:
                _LOGGER.error("Family Hub: failed to load data store: %s", err)
                return _empty_store()

        self._data = await self._hass.async_add_executor_job(_load)
        await self._async_migrate()

    async def async_save(self) -> None:
        """Persist data to disk."""
        def _save() -> None:
            os.makedirs(os.path.dirname(self._path), exist_ok=True)
            tmp = self._path + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, ensure_ascii=False)
            os.replace(tmp, self._path)

        await self._hass.async_add_executor_job(_save)

    async def _async_migrate(self) -> None:
        """Handle future schema migrations. No-op for version 1."""
        current = self._data.get("version", 1)
        if current == STORAGE_VERSION:
            return
        _LOGGER.warning("Family Hub: data store version %s, expected %s — migration may be needed", current, STORAGE_VERSION)

    # ------------------------------------------------------------------
    # Settings
    # ------------------------------------------------------------------

    @property
    def settings(self) -> dict:
        return self._data.get("settings", {})

    @property
    def family_name(self) -> str:
        return self.settings.get("family_name", DEFAULT_FAMILY_NAME)

    @property
    def points_per_dollar(self) -> int:
        return self.settings.get("points_per_dollar", DEFAULT_POINTS_PER_DOLLAR)

    async def async_update_settings(self, family_name: str | None = None, points_per_dollar: int | None = None) -> None:
        if family_name is not None:
            self._data["settings"]["family_name"] = family_name
        if points_per_dollar is not None:
            self._data["settings"]["points_per_dollar"] = points_per_dollar
        await self.async_save()

    # ------------------------------------------------------------------
    # People
    # ------------------------------------------------------------------

    @property
    def people(self) -> list[dict]:
        return self._data.get("people", [])

    def get_person(self, person_id: str) -> dict | None:
        return next((p for p in self.people if p["id"] == person_id), None)

    def get_people_by_type(self, person_type: str) -> list[dict]:
        return [p for p in self.people if p["type"] == person_type and p.get("active", True)]

    async def async_add_person(
        self,
        name: str,
        person_type: str = PERSON_TYPE_KID,
        ha_user_id: str | None = None,
        avatar_color: str | None = None,
    ) -> dict:
        person = {
            "id": _new_id(),
            "name": name,
            "type": person_type,
            "ha_user_id": ha_user_id,
            "avatar_color": avatar_color or "#7F77DD",
            "active": True,
            "points_balance": 0,
            "points_lifetime": 0,
            "created_at": _now_iso(),
        }
        self._data["people"].append(person)
        self._append_history(
            event_type=HISTORY_PERSON_ADDED,
            person_id=person["id"],
            reference_id=person["id"],
            note=f"{name} added as {person_type}",
        )
        await self.async_save()
        return person

    async def async_update_person(self, person_id: str, **kwargs: Any) -> dict | None:
        person = self.get_person(person_id)
        if not person:
            return None
        allowed = {"name", "ha_user_id", "avatar_color", "active"}
        for key, val in kwargs.items():
            if key in allowed:
                person[key] = val
        await self.async_save()
        return person

    async def async_award_points(self, person_id: str, points: int, reference_id: str, note: str = "") -> dict | None:
        """Add points to a person's balance and lifetime total."""
        person = self.get_person(person_id)
        if not person:
            return None
        person["points_balance"] = person.get("points_balance", 0) + points
        person["points_lifetime"] = person.get("points_lifetime", 0) + points
        self._append_history(
            event_type=HISTORY_POINTS_AWARDED,
            person_id=person_id,
            reference_id=reference_id,
            points_delta=points,
            balance_after=person["points_balance"],
            note=note,
        )
        await self.async_save()
        return person

    async def async_deduct_points(self, person_id: str, points: int, reference_id: str, note: str = "") -> dict | None:
        """Deduct points from a person's balance (redemption). Lifetime total unchanged."""
        person = self.get_person(person_id)
        if not person:
            return None
        person["points_balance"] = max(0, person.get("points_balance", 0) - points)
        self._append_history(
            event_type=HISTORY_POINTS_AWARDED,
            person_id=person_id,
            reference_id=reference_id,
            points_delta=-points,
            balance_after=person["points_balance"],
            note=note,
        )
        await self.async_save()
        return person

    # ------------------------------------------------------------------
    # Chores (definitions)
    # ------------------------------------------------------------------

    @property
    def chores(self) -> list[dict]:
        return self._data.get("chores", [])

    def get_chore(self, chore_id: str) -> dict | None:
        return next((c for c in self.chores if c["id"] == chore_id), None)

    def get_active_chores(self) -> list[dict]:
        return [c for c in self.chores if c.get("active", True)]

    async def async_add_chore(
        self,
        name: str,
        category: str = CATEGORY_ASSIGNED,
        assigned_to: str | None = None,
        points: int = 10,
        approval_required: bool = True,
        recurrence_type: str = RECURRENCE_DAILY,
        recurrence_config: dict | None = None,
        description: str = "",
        icon: str | None = None,
        created_by: str | None = None,
    ) -> dict:
        chore = {
            "id": _new_id(),
            "name": name,
            "description": description,
            "icon": icon,
            "category": category,
            "assigned_to": assigned_to,
            "points": points,
            "approval_required": approval_required,
            "recurrence": {
                "type": recurrence_type,
                **(recurrence_config or {}),
            },
            "active": True,
            "created_at": _now_iso(),
            "created_by": created_by,
        }
        self._data["chores"].append(chore)
        self._append_history(
            event_type=HISTORY_TASK_ADDED,
            reference_id=chore["id"],
            person_id=created_by,
            note=f'Chore "{name}" created',
        )
        # Generate the first task instance for non-one-time chores
        if recurrence_type != RECURRENCE_ONE_TIME:
            await self._async_create_task_instance(chore, due_date=date.today())
        else:
            await self._async_create_task_instance(chore, due_date=date.today())
        await self.async_save()
        return chore

    async def async_update_chore(self, chore_id: str, **kwargs: Any) -> dict | None:
        chore = self.get_chore(chore_id)
        if not chore:
            return None
        allowed = {"name", "description", "icon", "assigned_to", "points", "approval_required", "recurrence", "active"}
        for key, val in kwargs.items():
            if key in allowed:
                chore[key] = val
        await self.async_save()
        return chore

    async def async_delete_chore(self, chore_id: str) -> bool:
        chore = self.get_chore(chore_id)
        if not chore:
            return False
        chore["active"] = False
        # Remove pending task instances for this chore
        self._data["task_instances"] = [
            t for t in self._data["task_instances"]
            if not (t["chore_id"] == chore_id and t["status"] in ACTIVE_STATUSES)
        ]
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Task instances
    # ------------------------------------------------------------------

    @property
    def task_instances(self) -> list[dict]:
        return self._data.get("task_instances", [])

    def get_task_instance(self, instance_id: str) -> dict | None:
        return next((t for t in self.task_instances if t["id"] == instance_id), None)

    def get_active_tasks(self, person_id: str | None = None) -> list[dict]:
        tasks = [t for t in self.task_instances if t["status"] in ACTIVE_STATUSES]
        if person_id:
            tasks = [t for t in tasks if t.get("assigned_to") == person_id]
        return tasks

    def get_tasks_due_today(self) -> list[dict]:
        today = _today_str()
        return [
            t for t in self.task_instances
            if t["due_date"] == today and t["status"] in ACTIVE_STATUSES
        ]

    def get_overdue_tasks(self) -> list[dict]:
        today = _today_str()
        return [
            t for t in self.task_instances
            if t["due_date"] < today and t["status"] in ACTIVE_STATUSES
        ]

    def get_pending_approvals(self) -> list[dict]:
        return [t for t in self.task_instances if t["status"] == STATUS_PENDING_APPROVAL]

    def get_claimable_tasks(self) -> list[dict]:
        """Return unassigned claimable tasks that are active/pending."""
        return [
            t for t in self.task_instances
            if t["status"] == STATUS_PENDING and t.get("assigned_to") is None
            and self._is_claimable_task(t)
        ]

    def _is_claimable_task(self, task: dict) -> bool:
        chore = self.get_chore(task["chore_id"])
        return chore is not None and chore.get("category") == CATEGORY_CLAIMABLE

    async def _async_create_task_instance(self, chore: dict, due_date: date) -> dict:
        instance = {
            "id": _new_id(),
            "chore_id": chore["id"],
            "assigned_to": chore.get("assigned_to"),
            "status": STATUS_PENDING,
            "due_date": due_date.isoformat(),
            "claimed_by": None,
            "completed_at": None,
            "completed_by": None,
            "approved_at": None,
            "approved_by": None,
            "points_awarded": 0,
            "created_at": _now_iso(),
        }
        self._data["task_instances"].append(instance)
        return instance

    async def async_complete_task(self, instance_id: str, completed_by: str) -> dict | None:
        """Mark a task complete. Awards points immediately if self-reported."""
        instance = self.get_task_instance(instance_id)
        if not instance:
            _LOGGER.warning("Family Hub: task instance %s not found", instance_id)
            return None

        chore = self.get_chore(instance["chore_id"])
        if not chore:
            return None

        instance["completed_at"] = _now_iso()
        instance["completed_by"] = completed_by

        if chore.get("approval_required", True):
            instance["status"] = STATUS_PENDING_APPROVAL
            self._append_history(
                event_type=HISTORY_TASK_COMPLETED,
                person_id=completed_by,
                reference_id=instance_id,
                note=f'"{chore["name"]}" marked complete, awaiting approval',
            )
        else:
            # Self-reported — award immediately
            points = chore.get("points", 0)
            instance["status"] = STATUS_SELF_REPORTED
            instance["points_awarded"] = points
            instance["approved_at"] = _now_iso()
            instance["approved_by"] = "system"
            self._append_history(
                event_type=HISTORY_TASK_COMPLETED,
                person_id=completed_by,
                reference_id=instance_id,
                note=f'"{chore["name"]}" self-reported complete',
            )
            if points > 0 and completed_by:
                await self.async_award_points(completed_by, points, instance_id, f'Points for "{chore["name"]}"')

        await self.async_save()
        return instance

    async def async_claim_task(self, instance_id: str, claimed_by: str) -> dict | None:
        """Claim a claimable task."""
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING:
            return None
        if not self._is_claimable_task(instance):
            return None
        instance["status"] = STATUS_CLAIMED
        instance["assigned_to"] = claimed_by
        instance["claimed_by"] = claimed_by
        await self.async_save()
        return instance

    async def async_approve_task(self, instance_id: str, approved_by: str) -> dict | None:
        """Approve a pending task. Awards points to the completer."""
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING_APPROVAL:
            return None

        chore = self.get_chore(instance["chore_id"])
        if not chore:
            return None

        points = chore.get("points", 0)
        instance["status"] = STATUS_APPROVED
        instance["approved_at"] = _now_iso()
        instance["approved_by"] = approved_by
        instance["points_awarded"] = points

        completed_by = instance.get("completed_by")
        self._append_history(
            event_type=HISTORY_TASK_APPROVED,
            person_id=completed_by,
            reference_id=instance_id,
            note=f'"{chore["name"]}" approved by {approved_by}',
        )
        if points > 0 and completed_by:
            await self.async_award_points(completed_by, points, instance_id, f'Points for "{chore["name"]}"')

        await self.async_save()
        return instance

    async def async_deny_task(self, instance_id: str, denied_by: str, reason: str = "") -> dict | None:
        """Deny a pending task. No points awarded."""
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING_APPROVAL:
            return None

        chore = self.get_chore(instance["chore_id"])
        chore_name = chore["name"] if chore else "unknown"

        instance["status"] = STATUS_DENIED
        instance["approved_at"] = _now_iso()
        instance["approved_by"] = denied_by

        self._append_history(
            event_type=HISTORY_TASK_DENIED,
            person_id=instance.get("completed_by"),
            reference_id=instance_id,
            note=f'"{chore_name}" denied by {denied_by}. {reason}'.strip(),
        )
        await self.async_save()
        return instance

    # ------------------------------------------------------------------
    # Recurrence — generate next task instance after completion
    # ------------------------------------------------------------------

    async def async_schedule_next_instance(self, chore_id: str) -> dict | None:
        """Create the next task instance based on the chore's recurrence rule."""
        chore = self.get_chore(chore_id)
        if not chore or not chore.get("active", True):
            return None

        recurrence = chore.get("recurrence", {})
        r_type = recurrence.get("type", RECURRENCE_DAILY)

        if r_type == RECURRENCE_ONE_TIME:
            return None  # No next instance for one-time tasks

        next_date = self._calculate_next_date(recurrence)
        if next_date is None:
            return None

        # Don't duplicate — check if an instance already exists for this date
        existing = [
            t for t in self.task_instances
            if t["chore_id"] == chore_id
            and t["due_date"] == next_date.isoformat()
            and t["status"] in ACTIVE_STATUSES
        ]
        if existing:
            return existing[0]

        instance = await self._async_create_task_instance(chore, next_date)
        await self.async_save()
        return instance

    def _calculate_next_date(self, recurrence: dict) -> date | None:
        r_type = recurrence.get("type")
        today = date.today()

        if r_type == RECURRENCE_DAILY:
            return today + timedelta(days=1)

        if r_type == RECURRENCE_WEEKLY:
            weekday = recurrence.get("weekday", 0)  # 0=Monday
            days_ahead = weekday - today.weekday()
            if days_ahead <= 0:
                days_ahead += 7
            return today + timedelta(days=days_ahead)

        if r_type == RECURRENCE_EVERY_N_DAYS:
            n = recurrence.get("interval", 1)
            return today + timedelta(days=n)

        if r_type == RECURRENCE_EVERY_N_WEEKS:
            n = recurrence.get("interval", 1)
            return today + timedelta(weeks=n)

        if r_type == RECURRENCE_MONTHLY_ON_DATE:
            day = recurrence.get("day_of_month", 1)
            # Find next month's occurrence
            month = today.month + 1
            year = today.year
            if month > 12:
                month = 1
                year += 1
            import calendar
            max_day = calendar.monthrange(year, month)[1]
            actual_day = min(day, max_day)
            return date(year, month, actual_day)

        return None

    # ------------------------------------------------------------------
    # Daily tick — called by the scheduler to generate due instances
    # ------------------------------------------------------------------

    async def async_daily_tick(self) -> None:
        """
        Called once per day (at midnight or on HA startup).
        Ensures all active chores have a task instance for today.
        """
        today = date.today()
        _LOGGER.debug("Family Hub: daily tick for %s", today)

        for chore in self.get_active_chores():
            if chore["recurrence"]["type"] == RECURRENCE_ONE_TIME:
                continue

            # Check if an instance already exists for today
            existing = [
                t for t in self.task_instances
                if t["chore_id"] == chore["id"]
                and t["due_date"] == today.isoformat()
            ]
            if existing:
                continue

            # Check if today is a scheduled day for this chore
            if self._is_due_today(chore, today):
                await self._async_create_task_instance(chore, today)

        await self.async_save()

    def _is_due_today(self, chore: dict, today: date) -> bool:
        recurrence = chore.get("recurrence", {})
        r_type = recurrence.get("type", RECURRENCE_DAILY)

        if r_type == RECURRENCE_DAILY:
            return True

        if r_type == RECURRENCE_WEEKLY:
            return today.weekday() == recurrence.get("weekday", 0)

        if r_type == RECURRENCE_EVERY_N_DAYS:
            n = recurrence.get("interval", 1)
            # Check from chore creation date
            created = date.fromisoformat(chore["created_at"][:10])
            return (today - created).days % n == 0

        if r_type == RECURRENCE_EVERY_N_WEEKS:
            n = recurrence.get("interval", 1) * 7
            created = date.fromisoformat(chore["created_at"][:10])
            return (today - created).days % n == 0

        if r_type == RECURRENCE_MONTHLY_ON_DATE:
            return today.day == recurrence.get("day_of_month", 1)

        return False

    # ------------------------------------------------------------------
    # Store items
    # ------------------------------------------------------------------

    @property
    def store_items(self) -> list[dict]:
        return self._data.get("store_items", [])

    def get_store_item(self, item_id: str) -> dict | None:
        return next((i for i in self.store_items if i["id"] == item_id), None)

    def get_store_items_for_person(self, person_id: str) -> list[dict]:
        """Return common items + this person's personal items."""
        return [
            i for i in self.store_items
            if i.get("active", True) and (
                i.get("scope") == SCOPE_COMMON
                or (i.get("scope") == SCOPE_PERSONAL and i.get("person_id") == person_id)
            )
        ]

    def _dollar_to_points(self, dollar_value: float) -> int:
        return round(dollar_value * self.points_per_dollar)

    async def async_add_store_item(
        self,
        name: str,
        dollar_value: float,
        scope: str = SCOPE_COMMON,
        person_id: str | None = None,
        description: str = "",
    ) -> dict:
        item = {
            "id": _new_id(),
            "name": name,
            "description": description,
            "dollar_value": dollar_value,
            "points_cost": self._dollar_to_points(dollar_value),
            "scope": scope,
            "person_id": person_id if scope == SCOPE_PERSONAL else None,
            "active": True,
            "created_at": _now_iso(),
        }
        self._data["store_items"].append(item)
        await self.async_save()
        return item

    async def async_update_store_item(self, item_id: str, **kwargs: Any) -> dict | None:
        item = self.get_store_item(item_id)
        if not item:
            return None
        allowed = {"name", "description", "dollar_value", "scope", "person_id", "active"}
        for key, val in kwargs.items():
            if key in allowed:
                item[key] = val
        if "dollar_value" in kwargs:
            item["points_cost"] = self._dollar_to_points(item["dollar_value"])
        await self.async_save()
        return item

    async def async_delete_store_item(self, item_id: str) -> bool:
        item = self.get_store_item(item_id)
        if not item:
            return False
        item["active"] = False
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Redemptions
    # ------------------------------------------------------------------

    @property
    def redemptions(self) -> list[dict]:
        return self._data.get("redemptions", [])

    def get_redemption(self, redemption_id: str) -> dict | None:
        return next((r for r in self.redemptions if r["id"] == redemption_id), None)

    def get_pending_redemptions(self) -> list[dict]:
        return [r for r in self.redemptions if r["status"] == REDEMPTION_PENDING]

    async def async_request_redemption(self, person_id: str, item_id: str) -> dict | None:
        person = self.get_person(person_id)
        item = self.get_store_item(item_id)
        if not person or not item:
            return None

        points_cost = item["points_cost"]
        if person["points_balance"] < points_cost:
            _LOGGER.warning("Family Hub: %s has insufficient points for redemption", person["name"])
            return None

        redemption = {
            "id": _new_id(),
            "store_item_id": item_id,
            "person_id": person_id,
            "points_cost": points_cost,
            "item_name": item["name"],
            "status": REDEMPTION_PENDING,
            "requested_at": _now_iso(),
            "resolved_at": None,
            "resolved_by": None,
            "note": "",
        }
        self._data["redemptions"].append(redemption)
        self._append_history(
            event_type=HISTORY_REDEMPTION_REQUESTED,
            person_id=person_id,
            reference_id=redemption["id"],
            note=f'{person["name"]} requested "{item["name"]}" ({points_cost} pts)',
        )
        await self.async_save()
        return redemption

    async def async_approve_redemption(self, redemption_id: str, approved_by: str) -> dict | None:
        redemption = self.get_redemption(redemption_id)
        if not redemption or redemption["status"] != REDEMPTION_PENDING:
            return None

        person = self.get_person(redemption["person_id"])
        if not person:
            return None

        redemption["status"] = REDEMPTION_APPROVED
        redemption["resolved_at"] = _now_iso()
        redemption["resolved_by"] = approved_by

        await self.async_deduct_points(
            redemption["person_id"],
            redemption["points_cost"],
            redemption_id,
            f'Redeemed "{redemption["item_name"]}"',
        )
        self._append_history(
            event_type=HISTORY_REDEMPTION_APPROVED,
            person_id=redemption["person_id"],
            reference_id=redemption_id,
            points_delta=-redemption["points_cost"],
            balance_after=person.get("points_balance", 0),
            note=f'Redemption approved by {approved_by}',
        )
        await self.async_save()
        return redemption

    async def async_decline_redemption(self, redemption_id: str, declined_by: str, reason: str = "") -> dict | None:
        redemption = self.get_redemption(redemption_id)
        if not redemption or redemption["status"] != REDEMPTION_PENDING:
            return None

        redemption["status"] = REDEMPTION_DECLINED
        redemption["resolved_at"] = _now_iso()
        redemption["resolved_by"] = declined_by
        redemption["note"] = reason

        self._append_history(
            event_type=HISTORY_REDEMPTION_DECLINED,
            person_id=redemption["person_id"],
            reference_id=redemption_id,
            note=f'Redemption declined by {declined_by}. {reason}'.strip(),
        )
        await self.async_save()
        return redemption

    # ------------------------------------------------------------------
    # History
    # ------------------------------------------------------------------

    @property
    def history(self) -> list[dict]:
        return self._data.get("history", [])

    def get_history(self, person_id: str | None = None, limit: int = 100) -> list[dict]:
        entries = sorted(self.history, key=lambda e: e["timestamp"], reverse=True)
        if person_id:
            entries = [e for e in entries if e.get("person_id") == person_id]
        return entries[:limit]

    def _append_history(
        self,
        event_type: str,
        reference_id: str,
        person_id: str | None = None,
        points_delta: int = 0,
        balance_after: int = 0,
        note: str = "",
    ) -> None:
        self._data["history"].append({
            "id": _new_id(),
            "type": event_type,
            "person_id": person_id,
            "reference_id": reference_id,
            "points_delta": points_delta,
            "balance_after": balance_after,
            "timestamp": _now_iso(),
            "note": note,
        })

    # ------------------------------------------------------------------
    # Bonus points (admin action)
    # ------------------------------------------------------------------

    async def async_award_bonus_points(self, person_id: str, points: int, reason: str = "") -> dict | None:
        ref_id = _new_id()
        return await self.async_award_points(person_id, points, ref_id, f"Bonus: {reason}")

    # ------------------------------------------------------------------
    # Summary helpers (used by sensors and coordinator)
    # ------------------------------------------------------------------

    def get_summary(self) -> dict:
        """Return a top-level summary dict used by sensors and the coordinator."""
        return {
            "family_name": self.family_name,
            "points_per_dollar": self.points_per_dollar,
            "people": self.people,
            "tasks_due_today": len(self.get_tasks_due_today()),
            "tasks_overdue": len(self.get_overdue_tasks()),
            "pending_approvals": len(self.get_pending_approvals()),
            "pending_redemptions": len(self.get_pending_redemptions()),
            "claimable_tasks": len(self.get_claimable_tasks()),
        }

    # ------------------------------------------------------------------
    # Backup / export
    # ------------------------------------------------------------------

    async def async_export_backup(self, export_path: str) -> bool:
        """Write a timestamped backup copy of the data store."""
        def _write() -> None:
            os.makedirs(os.path.dirname(export_path), exist_ok=True)
            with open(export_path, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, ensure_ascii=False)

        try:
            await self._hass.async_add_executor_job(_write)
            _LOGGER.info("Family Hub: backup exported to %s", export_path)
            return True
        except OSError as err:
            _LOGGER.error("Family Hub: backup export failed: %s", err)
            return False

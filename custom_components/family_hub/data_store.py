"""
Family Hub — data store.

All family data lives in a single JSON file under the HA config directory.
This module handles reading, writing, and all CRUD operations on that file.

v0.3.0 changes:
  - assigned_to is now a list of person_ids (multi-person chore support)
  - chore_type replaces category in UI; old category values migrated on load
  - category_label (user-defined display grouping) added to chores
  - sort_order added to chores for drag-to-reorder
  - penalty_enabled / penalty_points added — deducted when cycle replaces incomplete chore
  - Recurrence: weekdays (list) replaces weekday (single); day_filter for daily chores
  - Daily tick now replaces incomplete instances (with penalty) instead of accumulating
  - remove_person service / async_remove_person method
  - add_task as canonical one-time task creator (add_one_time_task kept as alias)
  - Store items: person_ids (list) replaces single person_id
  - update_chore syncs pending task instances when assigned_to changes
  - settings.category_labels — user-defined display groups
  - Migration runs silently on load; data file version unchanged (backward compat)

v0.4.0 changes:
  - expires_after_days field on chores/tasks — one-time and claimable tasks auto-expire
  - Daily tick now also processes expirations
  - History trimming — entries older than HISTORY_RETENTION_DAYS (30 days) are pruned
    on each daily tick to keep the data file size bounded
  - STATUS_EXCUSED — skipped task with penalty reversed by parent (sick day etc.)
  - STATUS_REJECTED — approved/self-reported task with points clawed back
  - async_excuse_task — reverse penalty on a skipped instance
  - async_reject_task — claw back points on an approved/self-reported instance
  - async_mark_task_complete — retroactively mark a skipped instance as done, award points
  - async_force_daily_tick — trigger tick immediately (admin/debug service)
  - get_history_for_card — enriched history log for admin log UI
  - History entries now include chore_name for easier log display
"""

from __future__ import annotations

import asyncio
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
    CATEGORY_PERSONAL_REMINDER,
    CHORE_TYPE_ASSIGNED,
    CHORE_TYPE_CLAIMABLE,
    CHORE_TYPE_REMINDER,
    CONF_SHOW_DOLLAR_VALUE_TO_KIDS,
    DEFAULT_CATEGORY_LABELS,
    DEFAULT_FAMILY_NAME,
    DEFAULT_POINTS_PER_DOLLAR,
    DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS,
    DOMAIN,
    HISTORY_PERSON_ADDED,
    HISTORY_POINTS_AWARDED,
    HISTORY_REDEMPTION_APPROVED,
    HISTORY_REDEMPTION_DECLINED,
    HISTORY_REDEMPTION_REQUESTED,
    HISTORY_RETENTION_DAYS,
    HISTORY_TASK_ADDED,
    HISTORY_TASK_APPROVED,
    HISTORY_TASK_COMPLETED,
    HISTORY_TASK_DENIED,
    HISTORY_TASK_EXCUSED,
    HISTORY_TASK_MARKED_COMPLETE,
    HISTORY_TASK_REJECTED,
    HISTORY_TASK_SKIPPED,
    LEGACY_MAINTENANCE_CATEGORIES,
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
    STATUS_EXCUSED,
    STATUS_PENDING,
    STATUS_PENDING_APPROVAL,
    STATUS_REJECTED,
    STATUS_SELF_REPORTED,
    STATUS_SKIPPED,
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


def _empty_store(
    family_name: str = DEFAULT_FAMILY_NAME,
    points_per_dollar: int = DEFAULT_POINTS_PER_DOLLAR,
) -> dict:
    return {
        "version": STORAGE_VERSION,
        "settings": {
            "family_name": family_name,
            "points_per_dollar": points_per_dollar,
            "show_dollar_value_to_kids": DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS,
            "category_labels": list(DEFAULT_CATEGORY_LABELS),
            "created_at": _now_iso(),
        },
        "people": [],
        "chores": [],
        "task_instances": [],
        "store_items": [],
        "redemptions": [],
        "history": [],
    }


# ---------------------------------------------------------------------------
# Migration helpers — run silently on load, never raise
# ---------------------------------------------------------------------------

def _migrate_chore(chore: dict) -> dict:
    """Migrate a single chore record to v0.3.0/v0.4.0 shape."""
    # assigned_to: string or None → list
    at = chore.get("assigned_to")
    if at is None:
        chore["assigned_to"] = []
    elif isinstance(at, str):
        chore["assigned_to"] = [at] if at else []

    # chore_type: derive from old category if missing
    if "chore_type" not in chore:
        old_cat = chore.get("category", CATEGORY_ASSIGNED)
        if old_cat == CATEGORY_CLAIMABLE:
            chore["chore_type"] = CHORE_TYPE_CLAIMABLE
        elif old_cat in LEGACY_MAINTENANCE_CATEGORIES:
            chore["chore_type"] = CHORE_TYPE_REMINDER
        else:
            chore["chore_type"] = CHORE_TYPE_ASSIGNED

    # category_label: default to "Maintenance" for old maintenance chores
    if "category_label" not in chore:
        old_cat = chore.get("category", "")
        if old_cat == CATEGORY_MAINTENANCE:
            chore["category_label"] = "Maintenance"
        elif old_cat == CATEGORY_PERSONAL_REMINDER:
            chore["category_label"] = "Morning"
        else:
            chore["category_label"] = ""

    # sort_order
    if "sort_order" not in chore:
        chore["sort_order"] = 0

    # description
    chore.setdefault("description", "")

    # penalty fields
    chore.setdefault("penalty_enabled", False)
    chore.setdefault("penalty_points", 0)

    # v0.4.0: expiry — None means no expiry (recurring chores never expire)
    chore.setdefault("expires_after_days", None)

    # recurrence: weekday (int) → weekdays (list)
    rec = chore.setdefault("recurrence", {})
    if "weekday" in rec and "weekdays" not in rec:
        rec["weekdays"] = [rec.pop("weekday")]
    rec.setdefault("weekdays", [])
    rec.setdefault("day_filter", [])   # day filter for daily chores
    rec.setdefault("interval", 1)

    return chore


def _migrate_store_item(item: dict) -> dict:
    """Migrate a store item to v0.3.0 shape (person_id → person_ids list)."""
    if "person_ids" not in item:
        pid = item.get("person_id")
        item["person_ids"] = [pid] if pid else []
    return item


def _migrate_task_instance(instance: dict) -> dict:
    """Ensure task instances have expected fields."""
    instance.setdefault("penalty_applied", 0)
    return instance


class FamilyHubDataStore:
    """Manages reading and writing the Family Hub JSON data file."""

    def __init__(self, hass: HomeAssistant, storage_path: str) -> None:
        self._hass = hass
        self._path = storage_path
        self._data: dict[str, Any] = {}
        # Serialises all mutations + saves so concurrent service calls don't race
        self._lock = asyncio.Lock()

    # ------------------------------------------------------------------
    # Load / Save
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Load data from disk, migrate records, create fresh store if missing."""
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

        # Ensure settings block has all v0.3.0 keys
        s = self._data.setdefault("settings", {})
        s.setdefault("family_name",              DEFAULT_FAMILY_NAME)
        s.setdefault("points_per_dollar",         DEFAULT_POINTS_PER_DOLLAR)
        s.setdefault("show_dollar_value_to_kids", DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS)
        s.setdefault("category_labels",           list(DEFAULT_CATEGORY_LABELS))

        # Migrate all records
        self._data["chores"]         = [_migrate_chore(c)         for c in self._data.get("chores", [])]
        self._data["store_items"]    = [_migrate_store_item(i)     for i in self._data.get("store_items", [])]
        self._data["task_instances"] = [_migrate_task_instance(t)  for t in self._data.get("task_instances", [])]

        # Back-fill sort_order in creation order
        for idx, chore in enumerate(self._data["chores"]):
            if chore["sort_order"] == 0 and idx > 0:
                chore["sort_order"] = idx

    async def async_save(self) -> None:
        """Persist data to disk atomically. Lock acquired here."""
        def _write() -> None:
            os.makedirs(os.path.dirname(self._path), exist_ok=True)
            tmp = self._path + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, ensure_ascii=False)
            os.replace(tmp, self._path)

        async with self._lock:
            await self._hass.async_add_executor_job(_write)

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

    @property
    def show_dollar_value_to_kids(self) -> bool:
        return self.settings.get(CONF_SHOW_DOLLAR_VALUE_TO_KIDS, DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS)

    @property
    def category_labels(self) -> list[str]:
        return self.settings.get("category_labels", list(DEFAULT_CATEGORY_LABELS))

    async def async_update_settings(
        self,
        family_name: str | None = None,
        points_per_dollar: int | None = None,
        show_dollar_value_to_kids: bool | None = None,
        category_labels: list[str] | None = None,
    ) -> None:
        s = self._data["settings"]
        if family_name is not None:
            s["family_name"] = family_name
        if points_per_dollar is not None:
            s["points_per_dollar"] = points_per_dollar
        if show_dollar_value_to_kids is not None:
            s[CONF_SHOW_DOLLAR_VALUE_TO_KIDS] = show_dollar_value_to_kids
        if category_labels is not None:
            s["category_labels"] = category_labels
        await self.async_save()

    # ------------------------------------------------------------------
    # People
    # ------------------------------------------------------------------

    @property
    def people(self) -> list[dict]:
        return self._data.get("people", [])

    def get_person(self, person_id: str) -> dict | None:
        return next((p for p in self.people if p["id"] == person_id), None)

    def get_active_people(self) -> list[dict]:
        return [p for p in self.people if p.get("active", True)]

    async def async_add_person(
        self,
        name: str,
        person_type: str = "kid",
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
        allowed = {"name", "ha_user_id", "avatar_color", "active", "type"}
        for key, val in kwargs.items():
            if key in allowed:
                person[key] = val
        await self.async_save()
        return person

    async def async_remove_person(self, person_id: str) -> bool:
        """
        Deactivate a person. Historical data is preserved.
        Pending task instances assigned to this person are removed — no new
        ones will be generated since daily tick skips inactive people.
        """
        person = self.get_person(person_id)
        if not person:
            return False
        person["active"] = False
        # Remove pending task instances for this person
        self._data["task_instances"] = [
            t for t in self._data["task_instances"]
            if not (t.get("assigned_to") == person_id and t["status"] in ACTIVE_STATUSES)
        ]
        await self.async_save()
        return True

    async def async_award_points(
        self, person_id: str, points: int, reference_id: str, note: str = ""
    ) -> dict | None:
        person = self.get_person(person_id)
        if not person:
            return None
        person["points_balance"]  = person.get("points_balance", 0)  + points
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

    async def async_deduct_points(
        self, person_id: str, points: int, reference_id: str, note: str = ""
    ) -> dict | None:
        """Deduct from spendable balance only — lifetime total unchanged."""
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

    async def async_award_bonus_points(
        self,
        person_id: str,
        points: int = 0,
        reason: str = "",
        dollar_amount: float | None = None,
    ) -> dict | None:
        if dollar_amount is not None:
            points = round(dollar_amount * self.points_per_dollar)
        if points <= 0:
            _LOGGER.warning("Family Hub: award_bonus_points called with zero or negative value")
            return None
        note = f"Bonus (${dollar_amount:.2f}): {reason}".rstrip(": ") if dollar_amount else f"Bonus: {reason}"
        return await self.async_award_points(person_id, points, _new_id(), note)

    async def async_admin_deduct_points(
        self,
        person_id: str,
        points: int = 0,
        reason: str = "",
        dollar_amount: float | None = None,
    ) -> dict | None:
        if dollar_amount is not None:
            points = round(dollar_amount * self.points_per_dollar)
        if points <= 0:
            _LOGGER.warning("Family Hub: deduct_points called with zero or negative value")
            return None
        note = f"Deduction (${dollar_amount:.2f}): {reason}".rstrip(": ") if dollar_amount else f"Deduction: {reason}"
        return await self.async_deduct_points(person_id, points, _new_id(), note)

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

    def _chore_is_maintenance(self, chore: dict) -> bool:
        """A chore belongs to the maintenance card if its label is 'Maintenance'."""
        return chore.get("category_label", "") == "Maintenance"

    async def async_add_chore(
        self,
        name: str,
        chore_type: str = CHORE_TYPE_ASSIGNED,
        assigned_to: list[str] | None = None,
        points: int = 10,
        approval_required: bool = True,
        recurrence_type: str = RECURRENCE_DAILY,
        recurrence_config: dict | None = None,
        description: str = "",
        category_label: str = "",
        sort_order: int | None = None,
        penalty_enabled: bool = False,
        penalty_points: int = 0,
        expires_after_days: int | None = None,
        icon: str | None = None,
        created_by: str | None = None,
    ) -> dict:
        # Determine next sort order if not provided
        if sort_order is None:
            existing = self.get_active_chores()
            sort_order = max((c.get("sort_order", 0) for c in existing), default=-1) + 1

        rec = {"type": recurrence_type}
        if recurrence_config:
            rec.update(recurrence_config)
        rec.setdefault("weekdays", [])
        rec.setdefault("day_filter", [])
        rec.setdefault("interval", 1)

        chore = {
            "id": _new_id(),
            "name": name,
            "description": description,
            "icon": icon,
            "chore_type": chore_type,
            # Keep category for legacy compat — matches chore_type value
            "category": chore_type,
            "category_label": category_label,
            "sort_order": sort_order,
            "assigned_to": assigned_to or [],
            "points": points,
            "approval_required": approval_required,
            "penalty_enabled": penalty_enabled,
            "penalty_points": penalty_points,
            "expires_after_days": expires_after_days,  # None = no expiry
            "recurrence": rec,
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

        # Generate first task instance(s)
        today = date.today()
        if chore_type == CHORE_TYPE_CLAIMABLE:
            # Claimable chores get one shared instance (no assigned_to)
            await self._async_create_task_instance(chore, today, person_id=None)
        else:
            people_to_assign = assigned_to if assigned_to else []
            if people_to_assign:
                for pid in people_to_assign:
                    await self._async_create_task_instance(chore, today, person_id=pid)
            else:
                await self._async_create_task_instance(chore, today, person_id=None)

        await self.async_save()
        return chore

    async def async_update_chore(self, chore_id: str, **kwargs: Any) -> dict | None:
        """
        Update a chore definition.

        When assigned_to changes, all pending task instances for this chore
        are updated to match the new assignment so they appear in the right
        people's task lists immediately.
        """
        chore = self.get_chore(chore_id)
        if not chore:
            return None

        allowed = {
            "name", "description", "icon", "chore_type", "category_label",
            "sort_order", "assigned_to", "points", "approval_required",
            "penalty_enabled", "penalty_points", "expires_after_days",
            "recurrence", "active", "weekdays", "day_filter", "interval",
        }
        old_assigned = list(chore.get("assigned_to", []))

        for key, val in kwargs.items():
            if key not in allowed:
                continue
            # Recurrence sub-fields can be passed at top level
            if key in {"weekdays", "day_filter", "interval"}:
                chore["recurrence"][key] = val
            elif key == "assigned_to":
                # Ensure it's always a list
                chore["assigned_to"] = val if isinstance(val, list) else ([val] if val else [])
            else:
                chore[key] = val

        # Keep legacy category field in sync with chore_type
        if "chore_type" in kwargs:
            chore["category"] = chore["chore_type"]

        new_assigned = chore.get("assigned_to", [])

        # Sync pending task instances to new assignment
        if old_assigned != new_assigned:
            for instance in self._data["task_instances"]:
                if instance["chore_id"] != chore_id:
                    continue
                if instance["status"] not in ACTIVE_STATUSES:
                    continue
                # If assignment was cleared or changed, update instance
                instance["assigned_to"] = new_assigned[0] if len(new_assigned) == 1 else None

        await self.async_save()
        return chore

    async def async_delete_chore(self, chore_id: str) -> bool:
        chore = self.get_chore(chore_id)
        if not chore:
            return False
        chore["active"] = False
        self._data["task_instances"] = [
            t for t in self._data["task_instances"]
            if not (t["chore_id"] == chore_id and t["status"] in ACTIVE_STATUSES)
        ]
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # One-time tasks (separated from recurring chores)
    # ------------------------------------------------------------------

    async def async_add_task(
        self,
        name: str,
        assigned_to: list[str] | None = None,
        points: int = 0,
        description: str = "",
        approval_required: bool = False,
        expires_after_days: int | None = None,
        created_by: str | None = None,
    ) -> dict:
        """
        Create a one-time task. Does not appear in the chore management list.
        Uses chore_type=assigned + recurrence=one_time internally.
        expires_after_days: if set, the pending instance is auto-skipped after
        this many days (with penalty if penalty_enabled on the chore).
        """
        return await self.async_add_chore(
            name=name,
            chore_type=CHORE_TYPE_ASSIGNED,
            assigned_to=assigned_to or [],
            points=points,
            approval_required=approval_required,
            recurrence_type=RECURRENCE_ONE_TIME,
            description=description,
            category_label="",
            expires_after_days=expires_after_days,
            created_by=created_by,
        )

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

    def get_pending_approvals(self) -> list[dict]:
        return [t for t in self.task_instances if t["status"] == STATUS_PENDING_APPROVAL]

    def get_claimable_tasks(self) -> list[dict]:
        return [
            t for t in self.task_instances
            if t["status"] == STATUS_PENDING
            and t.get("assigned_to") is None
            and self._is_claimable_task(t)
        ]

    def _is_claimable_task(self, task: dict) -> bool:
        chore = self.get_chore(task["chore_id"])
        return chore is not None and chore.get("chore_type") == CHORE_TYPE_CLAIMABLE

    async def _async_create_task_instance(
        self, chore: dict, due_date: date, person_id: str | None = None
    ) -> dict:
        instance = {
            "id": _new_id(),
            "chore_id": chore["id"],
            "assigned_to": person_id,
            "status": STATUS_PENDING,
            "due_date": due_date.isoformat(),
            "claimed_by": None,
            "completed_at": None,
            "completed_by": None,
            "approved_at": None,
            "approved_by": None,
            "points_awarded": 0,
            "penalty_applied": 0,
            "created_at": _now_iso(),
        }
        self._data["task_instances"].append(instance)
        return instance

    async def async_complete_task(self, instance_id: str, completed_by: str) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance:
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
                chore_name=chore["name"],
            )
        else:
            points = chore.get("points", 0)
            instance["status"]        = STATUS_SELF_REPORTED
            instance["points_awarded"] = points
            instance["approved_at"]   = _now_iso()
            instance["approved_by"]   = "system"
            self._append_history(
                event_type=HISTORY_TASK_COMPLETED,
                person_id=completed_by,
                reference_id=instance_id,
                note=f'"{chore["name"]}" self-reported complete',
                chore_name=chore["name"],
            )
            if points > 0 and completed_by:
                await self.async_award_points(
                    completed_by, points, instance_id, f'Points for "{chore["name"]}"'
                )

        await self.async_save()
        return instance

    async def async_approve_task(self, instance_id: str, approved_by: str) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING_APPROVAL:
            return None
        chore = self.get_chore(instance["chore_id"])
        if not chore:
            return None

        points = chore.get("points", 0)
        instance["status"]        = STATUS_APPROVED
        instance["approved_at"]   = _now_iso()
        instance["approved_by"]   = approved_by
        instance["points_awarded"] = points

        completed_by = instance.get("completed_by")
        self._append_history(
            event_type=HISTORY_TASK_APPROVED,
            person_id=completed_by,
            reference_id=instance_id,
            note=f'"{chore["name"]}" approved',
            chore_name=chore["name"],
        )
        if points > 0 and completed_by:
            await self.async_award_points(
                completed_by, points, instance_id, f'Points for "{chore["name"]}"'
            )
        await self.async_save()
        return instance

    async def async_deny_task(
        self, instance_id: str, denied_by: str, reason: str = ""
    ) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING_APPROVAL:
            return None
        chore = self.get_chore(instance["chore_id"])
        chore_name = chore["name"] if chore else "unknown"

        instance["status"]      = STATUS_DENIED
        instance["approved_at"] = _now_iso()
        instance["approved_by"] = denied_by

        self._append_history(
            event_type=HISTORY_TASK_DENIED,
            person_id=instance.get("completed_by"),
            reference_id=instance_id,
            note=f'"{chore_name}" denied. {reason}'.strip(),
            chore_name=chore_name,
        )
        await self.async_save()
        return instance

    async def async_claim_task(self, instance_id: str, claimed_by: str) -> dict | None:
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_PENDING:
            return None
        if not self._is_claimable_task(instance):
            return None
        instance["status"]      = STATUS_CLAIMED
        instance["assigned_to"] = claimed_by
        instance["claimed_by"]  = claimed_by
        await self.async_save()
        return instance

    # ------------------------------------------------------------------
    # Daily tick — persistent stateful, with catch-up and penalty/replace
    # ------------------------------------------------------------------

    async def async_daily_tick(self) -> None:
        """
        Generate task instances for all days since last tick.
        Replaces incomplete instances (with penalty deduction) instead of
        accumulating them. Persists last_tick_date in JSON settings.

        v0.4.0 additions run after instance generation:
          - Expire pending one-time/claimable instances past their deadline
          - Trim history entries older than HISTORY_RETENTION_DAYS
        """
        today = date.today()
        CATCH_UP_LIMIT = 7

        last_tick_str = self._data["settings"].get("last_tick_date")
        if last_tick_str is None:
            last_tick = today - timedelta(days=1)
        else:
            try:
                last_tick = date.fromisoformat(last_tick_str)
            except ValueError:
                last_tick = today - timedelta(days=1)

        days_missed = (today - last_tick).days
        if days_missed <= 0:
            return

        if days_missed > CATCH_UP_LIMIT:
            _LOGGER.warning(
                "Family Hub: %d missed days, capping catch-up at %d",
                days_missed, CATCH_UP_LIMIT,
            )
            last_tick = today - timedelta(days=CATCH_UP_LIMIT)

        current = last_tick + timedelta(days=1)
        while current <= today:
            await self._async_tick_for_date(current)
            current += timedelta(days=1)

        # --- Expire overdue one-time / claimable instances -------------------
        await self._async_expire_tasks(today)

        # --- Trim history to rolling window ----------------------------------
        self._trim_history(today)

        self._data["settings"]["last_tick_date"] = today.isoformat()
        await self.async_save()

    async def _async_tick_for_date(self, tick_date: date) -> None:
        """
        For each active chore due on tick_date:
        1. Find any existing incomplete instance(s) for same chore+person.
        2. Apply penalty and mark them skipped.
        3. Create the new instance.
        """
        for chore in self.get_active_chores():
            r_type = chore["recurrence"].get("type", RECURRENCE_DAILY)
            if r_type == RECURRENCE_ONE_TIME:
                continue
            if not self._is_due_on_date(chore, tick_date):
                continue

            if chore.get("chore_type") == CHORE_TYPE_CLAIMABLE:
                # Claimable: one shared instance, no person
                existing = [
                    t for t in self.task_instances
                    if t["chore_id"] == chore["id"]
                    and t["due_date"] == tick_date.isoformat()
                ]
                if existing:
                    continue
                # Skip/replace any still-pending instance from previous cycle
                await self._skip_incomplete_instances(chore, person_id=None)
                await self._async_create_task_instance(chore, tick_date, person_id=None)
            else:
                assigned_people = chore.get("assigned_to", [])
                if assigned_people:
                    for pid in assigned_people:
                        # Skip if already have an instance for this date+person
                        existing = [
                            t for t in self.task_instances
                            if t["chore_id"] == chore["id"]
                            and t["due_date"] == tick_date.isoformat()
                            and t.get("assigned_to") == pid
                        ]
                        if existing:
                            continue
                        await self._skip_incomplete_instances(chore, person_id=pid)
                        await self._async_create_task_instance(chore, tick_date, person_id=pid)
                else:
                    # Unassigned reminder / maintenance — single instance
                    existing = [
                        t for t in self.task_instances
                        if t["chore_id"] == chore["id"]
                        and t["due_date"] == tick_date.isoformat()
                    ]
                    if existing:
                        continue
                    await self._skip_incomplete_instances(chore, person_id=None)
                    await self._async_create_task_instance(chore, tick_date, person_id=None)

    async def _skip_incomplete_instances(self, chore: dict, person_id: str | None) -> None:
        """Mark any incomplete prior instances for this chore+person as skipped, applying penalty."""
        for instance in self.task_instances:
            if instance["chore_id"] != chore["id"]:
                continue
            if instance["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue
            if person_id is not None and instance.get("assigned_to") != person_id:
                continue
            if person_id is None and instance.get("assigned_to") is not None:
                continue

            instance["status"] = STATUS_SKIPPED
            instance["approved_at"] = _now_iso()
            instance["approved_by"] = "system"

            # Apply penalty if configured
            if chore.get("penalty_enabled") and chore.get("penalty_points", 0) > 0:
                pid = instance.get("assigned_to") or person_id
                if pid:
                    penalty = chore["penalty_points"]
                    instance["penalty_applied"] = penalty
                    person = self.get_person(pid)
                    if person:
                        person["points_balance"] = max(0, person.get("points_balance", 0) - penalty)
                        self._append_history(
                            event_type=HISTORY_TASK_SKIPPED,
                            person_id=pid,
                            reference_id=instance["id"],
                            points_delta=-penalty,
                            balance_after=person["points_balance"],
                            note=f'"{chore["name"]}" not completed — {penalty}pt penalty applied',
                            chore_name=chore["name"],
                        )

    def _is_due_on_date(self, chore: dict, check_date: date) -> bool:
        """Return True if this chore should generate a task instance on check_date."""
        rec    = chore.get("recurrence", {})
        r_type = rec.get("type", RECURRENCE_DAILY)

        if r_type == RECURRENCE_DAILY:
            # Optional day filter — if set, only generate on those weekdays
            day_filter = rec.get("day_filter", [])
            if day_filter:
                return check_date.weekday() in day_filter
            return True

        if r_type == RECURRENCE_WEEKLY:
            weekdays = rec.get("weekdays", [])
            if not weekdays:
                return False
            return check_date.weekday() in weekdays

        if r_type == RECURRENCE_EVERY_N_DAYS:
            n = rec.get("interval", 1)
            created = date.fromisoformat(chore["created_at"][:10])
            return (check_date - created).days % n == 0

        if r_type == RECURRENCE_EVERY_N_WEEKS:
            n = rec.get("interval", 1) * 7
            created = date.fromisoformat(chore["created_at"][:10])
            return (check_date - created).days % n == 0

        if r_type == RECURRENCE_MONTHLY_ON_DATE:
            return check_date.day == rec.get("day_of_month", 1)

        return False

    async def _async_expire_tasks(self, today: date) -> None:
        """
        Auto-expire pending one-time task instances that have passed their
        deadline (created_at + expires_after_days).

        Rules:
          - Recurring chores: never expired here (tick handles them).
          - One-time assigned tasks: expire with penalty if penalty_enabled.
          - Claimable bonus tasks: expire silently — no penalty (nobody claimed it).
        """
        for instance in self.task_instances:
            if instance["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue

            chore = self.get_chore(instance["chore_id"])
            if not chore:
                continue

            # Only process one-time recurrence or claimable
            r_type      = chore["recurrence"].get("type", RECURRENCE_DAILY)
            is_one_time = r_type == RECURRENCE_ONE_TIME
            is_claimable = chore.get("chore_type") == CHORE_TYPE_CLAIMABLE
            if not (is_one_time or is_claimable):
                continue

            expires_after = chore.get("expires_after_days")
            if not expires_after:
                continue

            created  = date.fromisoformat(instance["created_at"][:10])
            age_days = (today - created).days
            if age_days < expires_after:
                continue

            # Mark expired / skipped
            instance["status"]      = STATUS_SKIPPED
            instance["approved_at"] = _now_iso()
            instance["approved_by"] = "system"

            if is_claimable:
                # No penalty for unclaimed bonus tasks
                self._append_history(
                    event_type=HISTORY_TASK_SKIPPED,
                    person_id=None,
                    reference_id=instance["id"],
                    note=f'"{chore["name"]}" claimable task expired unclaimed',
                )
            else:
                # One-time assigned task — apply penalty if configured
                pid = instance.get("assigned_to")
                if pid and chore.get("penalty_enabled") and chore.get("penalty_points", 0) > 0:
                    penalty = chore["penalty_points"]
                    instance["penalty_applied"] = penalty
                    person = self.get_person(pid)
                    if person:
                        person["points_balance"] = max(0, person.get("points_balance", 0) - penalty)
                        self._append_history(
                            event_type=HISTORY_TASK_SKIPPED,
                            person_id=pid,
                            reference_id=instance["id"],
                            points_delta=-penalty,
                            balance_after=person["points_balance"],
                            note=f'"{chore["name"]}" one-time task expired — {penalty}pt penalty applied',
                        )
                else:
                    self._append_history(
                        event_type=HISTORY_TASK_SKIPPED,
                        person_id=pid,
                        reference_id=instance["id"],
                        note=f'"{chore["name"]}" one-time task expired',
                    )

    def _trim_history(self, today: date) -> None:
        """
        Remove history entries older than HISTORY_RETENTION_DAYS.
        Called once per daily tick to keep the data file size bounded.
        Entries without a parseable timestamp are preserved (defensive).
        """
        cutoff = (today - timedelta(days=HISTORY_RETENTION_DAYS)).isoformat()
        before = len(self._data["history"])
        self._data["history"] = [
            e for e in self._data["history"]
            if e.get("timestamp", "9999")[:10] >= cutoff[:10]
        ]
        removed = before - len(self._data["history"])
        if removed:
            _LOGGER.debug(
                "Family Hub: trimmed %d history entries older than %d days",
                removed, HISTORY_RETENTION_DAYS,
            )

    # ------------------------------------------------------------------
    # Store items
    # ------------------------------------------------------------------

    @property
    def store_items(self) -> list[dict]:
        return self._data.get("store_items", [])

    def get_store_item(self, item_id: str) -> dict | None:
        return next((i for i in self.store_items if i["id"] == item_id), None)

    def get_store_items_for_person(self, person_id: str) -> list[dict]:
        """Return common items + items where person_id is in person_ids list."""
        return [
            i for i in self.store_items
            if i.get("active", True) and (
                i.get("scope") == SCOPE_COMMON
                or (
                    i.get("scope") == SCOPE_PERSONAL
                    and person_id in (i.get("person_ids") or [])
                )
            )
        ]

    def _dollar_to_points(self, dollar_value: float) -> int:
        return round(dollar_value * self.points_per_dollar)

    async def async_add_store_item(
        self,
        name: str,
        dollar_value: float,
        scope: str = SCOPE_COMMON,
        person_ids: list[str] | None = None,
        description: str = "",
    ) -> dict:
        item = {
            "id": _new_id(),
            "name": name,
            "description": description,
            "dollar_value": dollar_value,
            "points_cost": self._dollar_to_points(dollar_value),
            "scope": scope,
            "person_ids": person_ids if scope == SCOPE_PERSONAL else [],
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
        allowed = {"name", "description", "dollar_value", "scope", "person_ids", "active"}
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
        item   = self.get_store_item(item_id)
        if not person or not item:
            return None
        points_cost = item["points_cost"]
        if person["points_balance"] < points_cost:
            _LOGGER.warning("Family Hub: insufficient points for redemption")
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
            note=f'{person["name"]} requested "{item["name"]}" ({points_cost}pts)',
        )
        await self.async_save()
        return redemption

    async def async_approve_redemption(
        self, redemption_id: str, approved_by: str
    ) -> dict | None:
        redemption = self.get_redemption(redemption_id)
        if not redemption or redemption["status"] != REDEMPTION_PENDING:
            return None
        person = self.get_person(redemption["person_id"])
        if not person:
            return None
        redemption["status"]      = REDEMPTION_APPROVED
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
            note=f"Approved by {approved_by}",
        )
        await self.async_save()
        return redemption

    async def async_decline_redemption(
        self, redemption_id: str, declined_by: str, reason: str = ""
    ) -> dict | None:
        redemption = self.get_redemption(redemption_id)
        if not redemption or redemption["status"] != REDEMPTION_PENDING:
            return None
        redemption["status"]      = REDEMPTION_DECLINED
        redemption["resolved_at"] = _now_iso()
        redemption["resolved_by"] = declined_by
        redemption["note"]        = reason
        self._append_history(
            event_type=HISTORY_REDEMPTION_DECLINED,
            person_id=redemption["person_id"],
            reference_id=redemption_id,
            note=f"Declined by {declined_by}. {reason}".strip(),
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

    def get_history_for_card(self, person_id: str | None = None, limit: int = 150) -> list[dict]:
        """
        Enriched history log for the admin card log UI.
        Returns at most `limit` entries sorted newest-first, optionally filtered
        to one person. Each entry is augmented with person name/color for display
        and a `reversible` action hint so the card knows which action buttons to show:

          reversible actions:
            "excuse"          — skipped instance with a penalty, can be excused
            "mark_complete"   — skipped/excused instance, can be retroactively completed
            "reject"          — approved/self-reported instance, points can be clawed back
            None              — no further parent action available
        """
        entries = sorted(self.history, key=lambda e: e["timestamp"], reverse=True)
        if person_id:
            entries = [e for e in entries if e.get("person_id") == person_id]
        entries = entries[:limit]

        result = []
        for e in entries:
            person = self.get_person(e.get("person_id", "")) if e.get("person_id") else None
            # Find the task instance for action eligibility
            instance    = self.get_task_instance(e.get("reference_id", ""))
            inst_status = instance["status"] if instance else None

            # Determine what reversible action (if any) is still available
            reversible = None
            if inst_status == STATUS_SKIPPED:
                reversible = "excuse"      # can excuse or mark complete
            elif inst_status == STATUS_EXCUSED:
                reversible = "mark_complete"
            elif inst_status in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
                reversible = "reject"

            result.append({
                "history_id":    e["id"],
                "type":          e["type"],
                "person_id":     e.get("person_id"),
                "person_name":   person["name"] if person else None,
                "person_color":  person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "reference_id":  e.get("reference_id"),
                "chore_name":    e.get("chore_name", ""),
                "points_delta":  e.get("points_delta", 0),
                "balance_after": e.get("balance_after", 0),
                "timestamp":     e["timestamp"],
                "note":          e.get("note", ""),
                "reversible":    reversible,
                "instance_status": inst_status,
            })
        return result

    def _append_history(
        self,
        event_type: str,
        reference_id: str,
        person_id: str | None = None,
        points_delta: int = 0,
        balance_after: int = 0,
        note: str = "",
        chore_name: str = "",
    ) -> None:
        self._data["history"].append({
            "id":           _new_id(),
            "type":         event_type,
            "person_id":    person_id,
            "reference_id": reference_id,
            "points_delta": points_delta,
            "balance_after":balance_after,
            "timestamp":    _now_iso(),
            "note":         note,
            "chore_name":   chore_name,  # v0.4.0: populated for task events
        })

    # ------------------------------------------------------------------
    # v0.4.0 — Admin correction services
    # ------------------------------------------------------------------

    async def async_excuse_task(
        self, instance_id: str, excused_by: str, reason: str = ""
    ) -> dict | None:
        """
        Reverse the penalty on a skipped task instance (sick day, sleep-over, etc.).
        Restores penalty points to the person's balance and marks the instance
        STATUS_EXCUSED. Cannot be applied to instances that weren't skipped.
        """
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] != STATUS_SKIPPED:
            _LOGGER.warning("Family Hub: excuse_task — instance %s not found or not skipped", instance_id)
            return None

        chore  = self.get_chore(instance["chore_id"])
        chore_name = chore["name"] if chore else "unknown"
        pid    = instance.get("assigned_to") or instance.get("completed_by")
        penalty= instance.get("penalty_applied", 0)

        instance["status"] = STATUS_EXCUSED
        instance["excused_by"]  = excused_by
        instance["excused_at"]  = _now_iso()
        instance["excuse_reason"] = reason

        if penalty > 0 and pid:
            person = self.get_person(pid)
            if person:
                person["points_balance"] = person.get("points_balance", 0) + penalty
                # Lifetime total not adjusted — excused penalties never earned points
                self._append_history(
                    event_type=HISTORY_TASK_EXCUSED,
                    person_id=pid,
                    reference_id=instance_id,
                    points_delta=penalty,
                    balance_after=person["points_balance"],
                    note=f'"{chore_name}" penalty reversed — {reason}'.rstrip(" —"),
                    chore_name=chore_name,
                )
        else:
            self._append_history(
                event_type=HISTORY_TASK_EXCUSED,
                person_id=pid,
                reference_id=instance_id,
                note=f'"{chore_name}" excused — {reason}'.rstrip(" —"),
                chore_name=chore_name,
            )

        await self.async_save()
        return instance

    async def async_reject_task(
        self, instance_id: str, rejected_by: str, reason: str = ""
    ) -> dict | None:
        """
        Claw back points for a task that was already approved or self-reported.
        Deducts points_awarded from the person's spendable balance and marks
        the instance STATUS_REJECTED. Lifetime total is not changed.
        """
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] not in [STATUS_APPROVED, STATUS_SELF_REPORTED]:
            _LOGGER.warning(
                "Family Hub: reject_task — instance %s not found or not in approved/self-reported state",
                instance_id,
            )
            return None

        chore     = self.get_chore(instance["chore_id"])
        chore_name= chore["name"] if chore else "unknown"
        pid       = instance.get("completed_by")
        points    = instance.get("points_awarded", 0)

        instance["status"]      = STATUS_REJECTED
        instance["rejected_by"] = rejected_by
        instance["rejected_at"] = _now_iso()
        instance["reject_reason"] = reason

        if points > 0 and pid:
            person = self.get_person(pid)
            if person:
                person["points_balance"] = max(0, person.get("points_balance", 0) - points)
                self._append_history(
                    event_type=HISTORY_TASK_REJECTED,
                    person_id=pid,
                    reference_id=instance_id,
                    points_delta=-points,
                    balance_after=person["points_balance"],
                    note=f'"{chore_name}" rejected — {reason}'.rstrip(" —"),
                    chore_name=chore_name,
                )
        else:
            self._append_history(
                event_type=HISTORY_TASK_REJECTED,
                person_id=pid,
                reference_id=instance_id,
                note=f'"{chore_name}" rejected — {reason}'.rstrip(" —"),
                chore_name=chore_name,
            )

        await self.async_save()
        return instance

    async def async_mark_task_complete(
        self, instance_id: str, marked_by: str, reason: str = ""
    ) -> dict | None:
        """
        Retroactively mark a skipped or excused task as completed by a parent.
        Awards the chore's points, reverses any penalty that was applied, and
        marks the instance STATUS_APPROVED.
        """
        instance = self.get_task_instance(instance_id)
        if not instance or instance["status"] not in [STATUS_SKIPPED, STATUS_EXCUSED]:
            _LOGGER.warning(
                "Family Hub: mark_task_complete — instance %s not found or not skipped/excused",
                instance_id,
            )
            return None

        chore     = self.get_chore(instance["chore_id"])
        if not chore:
            return None
        chore_name= chore["name"]
        pid       = instance.get("assigned_to") or instance.get("completed_by")
        points    = chore.get("points", 0)
        penalty   = instance.get("penalty_applied", 0)

        instance["status"]        = STATUS_APPROVED
        instance["approved_at"]   = _now_iso()
        instance["approved_by"]   = marked_by
        instance["points_awarded"] = points
        instance["completed_by"]  = instance.get("completed_by") or marked_by
        instance["completed_at"]  = instance.get("completed_at") or _now_iso()

        total_awarded = points + penalty  # restore penalty AND award points
        if total_awarded > 0 and pid:
            person = self.get_person(pid)
            if person:
                person["points_balance"]  = person.get("points_balance", 0) + total_awarded
                person["points_lifetime"] = person.get("points_lifetime", 0) + points
                self._append_history(
                    event_type=HISTORY_TASK_MARKED_COMPLETE,
                    person_id=pid,
                    reference_id=instance_id,
                    points_delta=total_awarded,
                    balance_after=person["points_balance"],
                    note=f'"{chore_name}" retroactively marked complete — {reason}'.rstrip(" —"),
                    chore_name=chore_name,
                )
        else:
            self._append_history(
                event_type=HISTORY_TASK_MARKED_COMPLETE,
                person_id=pid,
                reference_id=instance_id,
                note=f'"{chore_name}" retroactively marked complete — {reason}'.rstrip(" —"),
                chore_name=chore_name,
            )

        await self.async_save()
        return instance

    async def async_force_daily_tick(self) -> None:
        """
        Force the daily tick to run immediately, regardless of last_tick_date.
        Resets last_tick_date to yesterday so the full today tick fires.
        Useful for admin/debug and for cleaning up stale instances after deploy.
        """
        yesterday = (date.today() - timedelta(days=1)).isoformat()
        self._data["settings"]["last_tick_date"] = yesterday
        _LOGGER.info("Family Hub: force_daily_tick called — running tick now")
        await self.async_daily_tick()

    # ------------------------------------------------------------------
    # Summary / coordinator
    # ------------------------------------------------------------------

    def get_summary(self) -> dict:
        return {
            "family_name":          self.family_name,
            "points_per_dollar":    self.points_per_dollar,
            "people":               self.people,
            "tasks_due_today":      len([t for t in self.task_instances if t["due_date"] == _today_str() and t["status"] in ACTIVE_STATUSES]),
            "tasks_overdue":        len([t for t in self.task_instances if t["due_date"] < _today_str()  and t["status"] in ACTIVE_STATUSES]),
            "pending_approvals":    len(self.get_pending_approvals()),
            "pending_redemptions":  len(self.get_pending_redemptions()),
            "claimable_tasks":      len(self.get_claimable_tasks()),
            "active_chores":        len(self.get_active_chores()),
        }

    # ------------------------------------------------------------------
    # Card data helpers
    # ------------------------------------------------------------------

    def get_tasks_for_card(self, person_id: str) -> dict:
        """Return due_today, overdue, and pending_approval task lists for one person."""
        today     = date.today()
        today_str = today.isoformat()
        due_today: list[dict] = []
        overdue:   list[dict] = []

        for t in self.task_instances:
            if t.get("assigned_to") != person_id:
                continue
            if t["status"] not in ACTIVE_STATUSES:
                continue
            chore = self.get_chore(t["chore_id"])
            if not chore:
                continue
            # Maintenance items belong on the maintenance card
            if self._chore_is_maintenance(chore):
                continue

            row = {
                "task_id":         t["id"],
                "chore_id":        t["chore_id"],
                "name":            chore["name"],
                "description":     chore.get("description", ""),
                "points":          chore.get("points", 0),
                "due_date":        t["due_date"],
                "status":          t["status"],
                "category_label":  chore.get("category_label", ""),
                "penalty_enabled": chore.get("penalty_enabled", False),
                "penalty_points":  chore.get("penalty_points", 0),
                "is_one_time":     chore["recurrence"].get("type") == RECURRENCE_ONE_TIME,
            }

            if t["due_date"] == today_str:
                due_today.append(row)
            elif t["due_date"] < today_str:
                row["days_overdue"] = (today - date.fromisoformat(t["due_date"])).days
                overdue.append(row)

        pending_approval = []
        for t in self.task_instances:
            if t.get("completed_by") != person_id:
                continue
            if t["status"] != STATUS_PENDING_APPROVAL:
                continue
            chore = self.get_chore(t["chore_id"])
            pending_approval.append({
                "task_id":      t["id"],
                "chore_id":     t["chore_id"],
                "name":         chore["name"] if chore else t["chore_id"],
                "description":  chore.get("description", "") if chore else "",
                "points":       chore.get("points", 0) if chore else 0,
                "completed_at": t.get("completed_at"),
                "status":       t["status"],
            })

        return {
            "due_today":        sorted(due_today, key=lambda x: x["name"]),
            "overdue":          sorted(overdue, key=lambda x: -x.get("days_overdue", 0)),
            "pending_approval": pending_approval,
        }

    def get_store_items_for_card(self, person_id: str) -> list[dict]:
        return [
            {
                "item_id":     i["id"],
                "name":        i["name"],
                "description": i.get("description", ""),
                "dollar_value":i.get("dollar_value", 0),
                "points_cost": i.get("points_cost", 0),
                "scope":       i.get("scope"),
                "person_ids":  i.get("person_ids", []),
            }
            for i in self.get_store_items_for_person(person_id)
        ]

    def get_approval_queue_for_card(self) -> list[dict]:
        queue = []
        for t in self.get_pending_approvals():
            chore  = self.get_chore(t["chore_id"])
            person = self.get_person(t.get("completed_by", ""))
            queue.append({
                "task_id":      t["id"],
                "chore_name":   chore["name"] if chore else t["chore_id"],
                "chore_points": chore.get("points", 0) if chore else 0,
                "person_id":    t.get("completed_by"),
                "person_name":  person["name"] if person else "Unknown",
                "person_color": person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "completed_at": t.get("completed_at"),
            })
        return sorted(queue, key=lambda x: x.get("completed_at") or "")

    def get_redemption_queue_for_card(self) -> list[dict]:
        queue = []
        for r in self.get_pending_redemptions():
            person = self.get_person(r["person_id"])
            queue.append({
                "redemption_id": r["id"],
                "item_name":     r["item_name"],
                "person_id":     r["person_id"],
                "person_name":   person["name"] if person else "Unknown",
                "person_color":  person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "points_cost":   r["points_cost"],
                "requested_at":  r.get("requested_at"),
            })
        return sorted(queue, key=lambda x: x.get("requested_at") or "")

    def get_maintenance_items_for_card(self) -> list[dict]:
        today = date.today()
        items = []
        for task in self.task_instances:
            if task["status"] not in ACTIVE_STATUSES:
                continue
            chore = self.get_chore(task["chore_id"])
            if not chore:
                continue
            if not self._chore_is_maintenance(chore):
                continue
            due_date   = date.fromisoformat(task["due_date"])
            days_delta = (due_date - today).days
            assigned   = task.get("assigned_to")
            person     = self.get_person(assigned) if assigned else None
            items.append({
                "task_id":      task["id"],
                "chore_id":     task["chore_id"],
                "name":         chore["name"],
                "description":  chore.get("description", ""),
                "category_label": chore.get("category_label", ""),
                "due_date":     task["due_date"],
                "days_delta":   days_delta,
                "assigned_to":  assigned,
                "person_name":  person["name"] if person else None,
                "person_color": person.get("avatar_color", "#7F77DD") if person else None,
            })
        return sorted(items, key=lambda x: x["days_delta"])

    def get_claimable_tasks_for_card(self) -> list[dict]:
        items = []
        for task in self.get_claimable_tasks():
            chore = self.get_chore(task["chore_id"])
            items.append({
                "task_id":     task["id"],
                "name":        chore["name"] if chore else task["chore_id"],
                "description": chore.get("description", "") if chore else "",
                "points":      chore.get("points", 0) if chore else 0,
                "due_date":    task["due_date"],
            })
        return items

    def get_all_tasks_for_command_center(self) -> list[dict]:
        """
        All active non-maintenance assigned tasks for all people.
        Sorted: most overdue first, then today. Excludes maintenance and
        unassigned claimable tasks (those appear in their own section).
        """
        today     = date.today()
        today_str = today.isoformat()
        items     = []

        for task in self.task_instances:
            if task["status"] not in [STATUS_PENDING, STATUS_CLAIMED]:
                continue
            chore = self.get_chore(task["chore_id"])
            if not chore:
                continue
            if self._chore_is_maintenance(chore):
                continue
            if chore.get("chore_type") == CHORE_TYPE_CLAIMABLE and task.get("assigned_to") is None:
                continue

            assigned   = task.get("assigned_to")
            person     = self.get_person(assigned) if assigned else None
            due_date   = date.fromisoformat(task["due_date"])
            days_delta = (due_date - today).days

            items.append({
                "task_id":         task["id"],
                "chore_id":        task["chore_id"],
                "name":            chore["name"],
                "description":     chore.get("description", ""),
                "points":          chore.get("points", 0),
                "due_date":        task["due_date"],
                "days_delta":      days_delta,
                "status":          task["status"],
                "category_label":  chore.get("category_label", ""),
                "assigned_to":     assigned,
                "person_name":     person["name"] if person else None,
                "person_color":    person.get("avatar_color", "#7F77DD") if person else "#7F77DD",
                "approval_required": chore.get("approval_required", True),
                "penalty_enabled": chore.get("penalty_enabled", False),
                "penalty_points":  chore.get("penalty_points", 0),
            })

        # Show today + overdue only on command center
        return sorted(
            [i for i in items if i["days_delta"] <= 0],
            key=lambda x: x["days_delta"],
        )

    def get_active_chores_for_card(self) -> list[dict]:
        """
        All active non-maintenance, non-one-time chores for the admin chore list.
        Sorted by sort_order then name.
        """
        result = []
        for c in self.get_active_chores():
            if self._chore_is_maintenance(c):
                continue
            if c["recurrence"].get("type") == RECURRENCE_ONE_TIME:
                continue
            assigned_names = []
            for pid in c.get("assigned_to", []):
                p = self.get_person(pid)
                if p:
                    assigned_names.append(p["name"])
            result.append({
                "chore_id":        c["id"],
                "name":            c["name"],
                "description":     c.get("description", ""),
                "chore_type":      c.get("chore_type", CHORE_TYPE_ASSIGNED),
                "category_label":  c.get("category_label", ""),
                "sort_order":      c.get("sort_order", 0),
                "assigned_to":     c.get("assigned_to", []),
                "assigned_names":  assigned_names,
                "points":          c.get("points", 0),
                "approval_required": c.get("approval_required", True),
                "penalty_enabled": c.get("penalty_enabled", False),
                "penalty_points":  c.get("penalty_points", 0),
                "expires_after_days": c.get("expires_after_days"),
                "recurrence":      c.get("recurrence", {}),
            })
        return sorted(result, key=lambda x: (x["sort_order"], x["name"]))

    # ------------------------------------------------------------------
    # Backup
    # ------------------------------------------------------------------

    async def async_export_backup(self, export_path: str) -> bool:
        def _write() -> None:
            os.makedirs(os.path.dirname(export_path), exist_ok=True)
            with open(export_path, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, ensure_ascii=False)

        try:
            await self._hass.async_add_executor_job(_write)
            _LOGGER.info("Family Hub: backup exported to %s", export_path)
            return True
        except OSError as err:
            _LOGGER.error("Family Hub: backup failed: %s", err)
            return False

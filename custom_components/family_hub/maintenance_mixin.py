"""
Family Hub — MaintenanceMixin (v0.8.0 Home Maintenance module).

Owns the maintenance collections: `maintenance_tasks`, `maintenance_products`,
`maintenance_completions`, `maintenance_vendors`, `maintenance_funds`, and the
`home_profile` settings dict. Mixed into FamilyHubDataStore; every method
operates on `self`.

Design (see docs/PLAN-v0.8.0.md §4):
  • NO task_instances. A task carries next_due/last_completed; the lifecycle
    state (scheduled/upcoming/due/overdue/snoozed/disabled) is DERIVED by the
    pure functions in _maintenance_schedule. completions are the audit trail.
  • `get_maintenance_view()` returns a normalized item list from BOTH the new
    maintenance_tasks collection AND legacy category_label==Maintenance chore
    instances (the A4 "union read"; A5 removes the legacy half + the seam).
  • `assign` is bus-only: offer_task publishes external_task_offer; there is NO
    standalone in-module assignee. Real person assignment is the D5 chores
    bridge (decided 2026-07-21). Until then offer/revoke are a designed no-op
    (no subscriber → delivery count 0 → offered_external reverts).
"""

from __future__ import annotations

import logging
from datetime import date, datetime, timedelta

from .const import (
    ACTIVE_STATUSES,
    CHORE_TYPE_CLAIMABLE,
    MAINTENANCE_DUE_SOON_DAYS,
    RECURRENCE_DAILY,
    RECURRENCE_EVERY_N_DAYS,
    RECURRENCE_EVERY_N_WEEKS,
    RECURRENCE_MONTHLY_ON_DATE,
    RECURRENCE_ONE_TIME,
    RECURRENCE_WEEKLY,
    STATUS_APPROVED,
    STATUS_SELF_REPORTED,
    TOPIC_EXTERNAL_TASK_OFFER,
    TOPIC_EXTERNAL_TASK_REVOKE,
)
from ._store_helpers import _new_id, _now_iso
from ._maintenance_schedule import (
    compute_next_due,
    effective_due,
    initial_next_due,
    task_state,
)

_LOGGER = logging.getLogger(__name__)

# Fields a client may set on add/update (whitelist — id/timestamps/derived excluded).
_TASK_EDITABLE = (
    "name", "description", "category", "location", "schedule_mode", "recurrence",
    "seasonal_anchor", "workflow", "lead_time_days", "effort", "est_cost_diy",
    "est_cost_pro", "default_mode", "product_ids", "assignable",
    "default_point_value", "next_due", "enabled",
)
_PRODUCT_EDITABLE = (
    "name", "spec", "unit_cost_est", "qty_per_use", "where_to_buy",
    "inventory_count", "low_stock_threshold", "linked_task_ids",
)
_VENDOR_EDITABLE = ("name", "trade", "phone", "notes", "preferred", "last_used", "last_price")
_FUND_EDITABLE = ("fund_type", "name", "asset_category", "target_amount", "balance", "monthly_target")

# Schedule-shaping fields refreshed from the library on re-apply, but only for a
# seeded task the user has never hand-edited (see async_maintenance_apply_seeds).
_SEED_REFRESHABLE = ("schedule_mode", "recurrence", "seasonal_anchor",
                     "seasonal_note", "climate_note")


def _opt_float(value) -> float | None:
    """float(), but None survives as None (an absent price, not a $0 price)."""
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


class MaintenanceMixin:
    # ------------------------------------------------------------------
    # Collection accessors
    # ------------------------------------------------------------------

    @property
    def maintenance_tasks(self) -> list:
        return self._data.setdefault("maintenance_tasks", [])

    @property
    def maintenance_products(self) -> list:
        return self._data.setdefault("maintenance_products", [])

    @property
    def maintenance_completions(self) -> list:
        return self._data.setdefault("maintenance_completions", [])

    @property
    def maintenance_vendors(self) -> list:
        return self._data.setdefault("maintenance_vendors", [])

    @property
    def maintenance_funds(self) -> list:
        return self._data.setdefault("maintenance_funds", [])

    @property
    def home_profile(self) -> dict:
        return self._data.setdefault("home_profile", {})

    def get_maintenance_task(self, task_id: str) -> dict | None:
        return next((t for t in self.maintenance_tasks if t["id"] == task_id), None)

    def get_maintenance_product(self, product_id: str) -> dict | None:
        return next((p for p in self.maintenance_products if p["id"] == product_id), None)

    def get_maintenance_vendor(self, vendor_id: str) -> dict | None:
        return next((v for v in self.maintenance_vendors if v["id"] == vendor_id), None)

    def get_maintenance_fund(self, fund_id: str) -> dict | None:
        return next((f for f in self.maintenance_funds if f["id"] == fund_id), None)

    # ------------------------------------------------------------------
    # Normalized union view (feeds sensors + card model — keys FROZEN)
    # ------------------------------------------------------------------

    def _mtask_view_item(self, task: dict, today: date) -> dict | None:
        """A new-collection maintenance task as a normalized card/sensor item, or
        None if it shouldn't surface (disabled / no scheduled date)."""
        if not task.get("enabled", True):
            return None
        due = effective_due(task)
        if due is None:
            return None
        return {
            "task_id":        task["id"],
            "chore_id":       None,
            "name":           task.get("name", ""),
            "description":    task.get("description", ""),
            "category_label": task.get("category") or "Maintenance",
            "due_date":       due.isoformat(),
            "days_delta":     (due - today).days,
            "assigned_to":    None,     # A4: no in-module assignee (bridge = D5)
            "person_name":    None,
            "person_color":   None,
            "state":          task_state(task, today),
            "source_kind":    "maintenance",
        }

    def get_maintenance_view(self, today: date | None = None) -> list[dict]:
        """Normalized maintenance items from the maintenance_tasks collection,
        sorted by days_delta. Item keys are the frozen sensor/card contract
        (task_id, chore_id, name, description, category_label, due_date,
        days_delta, assigned_to, person_name, person_color); `state`/`source_kind`
        are additive extras.

        (A4 also read legacy category_label==Maintenance chore instances; A5
        migrated those into this collection and removed the legacy branch.)"""
        today = today or date.today()
        items: list[dict] = []
        for task in self.maintenance_tasks:
            item = self._mtask_view_item(task, today)
            if item:
                items.append(item)
        return sorted(items, key=lambda x: x["days_delta"])

    # ------------------------------------------------------------------
    # Task CRUD
    # ------------------------------------------------------------------

    def _new_maintenance_task(self, f: dict, today: date) -> dict:
        rec = f.get("recurrence") or None
        task = {
            "id":                 _new_id(),
            "name":               f.get("name", "Untitled"),
            "description":        f.get("description", ""),
            "category":           f.get("category", "general"),
            "location":           f.get("location", ""),
            "schedule_mode":      f.get("schedule_mode", "from_completion"),
            "recurrence":         rec,                       # {"interval","unit"} or None
            # {"month","day"} | [{"month","day"}, ...] | None — a LIST is a
            # multi-occurrence anchor (April & October, quarterly...), see
            # _maintenance_schedule._next_anchor.
            "seasonal_anchor":    f.get("seasonal_anchor"),
            "seasonal_note":      f.get("seasonal_note", ""),   # the library's prose anchor
            "climate_note":       f.get("climate_note", ""),    # climate-preset guidance
            "workflow":           f.get("workflow", "simple"),
            "workflow_stage":     None,
            "lead_time_days":     int(f.get("lead_time_days", 14) or 14),
            "effort":             f.get("effort") or {"diy_minutes": 0, "difficulty": "Easy"},
            "est_cost_diy":       float(f.get("est_cost_diy", 0) or 0),
            # None means "never hired out standalone" and is NOT the same as $0 —
            # the cost card renders the two differently, so preserve it.
            "est_cost_pro":       _opt_float(f.get("est_cost_pro")),
            "default_mode":       f.get("default_mode", "diy"),
            "product_ids":        list(f.get("product_ids") or []),
            "assignable":         bool(f.get("assignable", False)),
            "default_point_value": int(f.get("default_point_value", 0) or 0),
            "surprise_factor":    f.get("surprise_factor", "low"),
            "cost_status":        f.get("cost_status", ""),
            "next_due":           None,
            "last_completed":     None,
            "snoozed_until":      None,
            "offered_external":   False,
            "source":             f.get("source", "custom"),
            "seed_id":            f.get("seed_id"),
            "seed_fingerprint":   f.get("seed_fingerprint"),
            "disabled_reason":    f.get("disabled_reason", ""),
            "legacy_chore_id":    f.get("legacy_chore_id"),
            "enabled":            bool(f.get("enabled", True)),
            "created_at":         _now_iso(),
            "updated_at":         _now_iso(),
        }
        explicit = f.get("next_due")
        if explicit:
            task["next_due"] = explicit
        else:
            d = initial_next_due(task, today)
            task["next_due"] = d.isoformat() if d else None
        return task

    async def async_maintenance_add_task(self, **fields) -> dict:
        task = self._new_maintenance_task(fields, date.today())
        self.maintenance_tasks.append(task)
        await self.async_save()
        return task

    async def async_maintenance_update_task(self, task_id: str, **fields) -> bool:
        task = self.get_maintenance_task(task_id)
        if not task:
            return False
        for key in _TASK_EDITABLE:
            if key in fields and fields[key] is not None:
                task[key] = fields[key]
        task["updated_at"] = _now_iso()
        await self.async_save()
        return True

    async def async_maintenance_delete_task(self, task_id: str) -> bool:
        before = len(self.maintenance_tasks)
        self._data["maintenance_tasks"] = [t for t in self.maintenance_tasks if t["id"] != task_id]
        if len(self._data["maintenance_tasks"]) == before:
            return False
        # Purge the task's completion records too, so they don't orphan with a
        # dangling task_id (mirrors delete_chore purging its task_instances).
        self._data["maintenance_completions"] = [
            c for c in self.maintenance_completions if c.get("task_id") != task_id
        ]
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Task lifecycle: complete / snooze / reschedule / skip
    # ------------------------------------------------------------------

    def _apply_maintenance_completion(
        self, task: dict, *, completed_by=None, mode=None, actual_cost=0,
        actual_minutes=0, products_used=None, vendor_id=None, notes="",
        photo=None, result=None, when: str | None = None,
    ) -> None:
        """Synchronous completion core: write the completion record, decrement
        inventory, update vendor, advance next_due (honoring inspect_plan_do and
        one-shot). Does NOT save — callers save (or, for a bus callback, the
        publisher's own save persists everything)."""
        today = date.today()
        date_iso = (when or today.isoformat())[:10]
        mode = mode or task.get("default_mode", "diy")
        workflow = task.get("workflow", "simple")
        stage = "inspect" if workflow == "inspect_plan_do" and task.get("workflow_stage") in (None, "inspect") else "do"

        self.maintenance_completions.append({
            "id":             _new_id(),
            "task_id":        task["id"],
            "date":           date_iso,
            "completed_by":   completed_by,
            "mode":           mode,
            "stage":          stage,
            "actual_cost":    float(actual_cost or 0),
            "actual_minutes": int(actual_minutes or 0),
            "products_used":  list(products_used or []),
            "vendor_id":      vendor_id,
            "notes":          notes or "",
            "photo":          photo,
        })

        # Decrement inventory for products used.
        for pu in (products_used or []):
            prod = self.get_maintenance_product(pu.get("product_id"))
            if prod:
                prod["inventory_count"] = max(
                    0, int(prod.get("inventory_count", 0)) - int(pu.get("qty", 1) or 1)
                )

        # Pro-mode completion updates the vendor's last-used / last-price.
        if mode == "pro" and vendor_id:
            vendor = self.get_maintenance_vendor(vendor_id)
            if vendor:
                vendor["last_used"] = date_iso
                vendor["last_price"] = float(actual_cost or 0)

        # inspect_plan_do: an inspection that found work branches to the Plan stage
        # and stays surfaced (does NOT advance) until the Do work is completed.
        advance_schedule = True
        if workflow == "inspect_plan_do" and stage == "inspect" and result == "needs_work":
            task["workflow_stage"] = "plan"
            advance_schedule = False
        else:
            task["workflow_stage"] = None

        task["last_completed"] = date_iso
        task["snoozed_until"] = None
        task["offered_external"] = False
        if advance_schedule:
            nd = compute_next_due(task, date.fromisoformat(date_iso))
            if nd is None:
                task["next_due"] = None
                task["enabled"] = False   # one-shot done
            else:
                task["next_due"] = nd.isoformat()
        task["updated_at"] = _now_iso()

    async def async_maintenance_complete_task(self, task_id: str, **kwargs) -> bool:
        task = self.get_maintenance_task(task_id)
        if not task:
            return False
        self._apply_maintenance_completion(task, **kwargs)
        await self.async_save()
        return True

    async def async_maintenance_snooze_task(
        self, task_id: str, until: str | None = None, days: int | None = None,
    ) -> bool:
        task = self.get_maintenance_task(task_id)
        if not task:
            return False
        if until:
            task["snoozed_until"] = until
        else:
            task["snoozed_until"] = (date.today() + timedelta(days=int(days or 7))).isoformat()
        task["updated_at"] = _now_iso()
        await self.async_save()
        return True

    async def async_maintenance_reschedule_task(self, task_id: str, next_due: str) -> bool:
        """Move THIS occurrence to a specific date (clears any snooze)."""
        task = self.get_maintenance_task(task_id)
        if not task:
            return False
        task["next_due"] = next_due
        task["snoozed_until"] = None
        task["updated_at"] = _now_iso()
        await self.async_save()
        return True

    async def async_maintenance_skip_task(self, task_id: str, notes: str = "") -> bool:
        """Skip this occurrence: log a skipped completion and advance next_due
        WITHOUT recording it as done (last_completed untouched)."""
        task = self.get_maintenance_task(task_id)
        if not task:
            return False
        today = date.today()
        self.maintenance_completions.append({
            "id":             _new_id(),
            "task_id":        task_id,
            "date":           today.isoformat(),
            "completed_by":   None,
            "mode":           None,
            "stage":          "skipped",
            "actual_cost":    0,
            "actual_minutes": 0,
            "products_used":  [],
            "vendor_id":      None,
            "notes":          notes or "",
            "photo":          None,
        })
        task["snoozed_until"] = None
        task["workflow_stage"] = None
        nd = compute_next_due(task, today)
        task["next_due"] = nd.isoformat() if nd else None
        if nd is None:
            task["enabled"] = False
        task["updated_at"] = _now_iso()
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Chores bridge (event bus) — assign = offer, no in-module assignee
    # ------------------------------------------------------------------

    async def async_maintenance_offer_task(
        self, task_id: str, assigned_to: str | None = None,
        points: int | None = None, due_date: str | None = None,
    ) -> int:
        """Publish this task as an external offer. Returns the delivery count;
        0 (no subscriber — chores off / bridge not wired until D5) reverts the
        offered_external flag so the affordance is a clean no-op."""
        task = self.get_maintenance_task(task_id)
        if not task:
            return 0
        payload = {
            "source_module": "maintenance",
            "external_id":   task["id"],
            "name":          task.get("name", ""),
            "description":   task.get("description", ""),
            "points":        int(points if points is not None else task.get("default_point_value", 0)),
            "due_date":      due_date or task.get("next_due"),
            "assigned_to":   assigned_to,
            "claimable":     assigned_to is None,
        }
        task["offered_external"] = True
        delivered = await self.bus.async_publish(TOPIC_EXTERNAL_TASK_OFFER, payload)
        if delivered == 0:
            task["offered_external"] = False
        task["updated_at"] = _now_iso()
        await self.async_save()
        return delivered

    async def async_maintenance_revoke_task(self, task_id: str) -> int:
        task = self.get_maintenance_task(task_id)
        if not task:
            return 0
        delivered = await self.bus.async_publish(TOPIC_EXTERNAL_TASK_REVOKE, {
            "source_module": "maintenance",
            "external_id":   task["id"],
        })
        task["offered_external"] = False
        task["updated_at"] = _now_iso()
        await self.async_save()
        return delivered

    async def _apply_external_completion(self, payload: dict) -> None:
        """Bus subscriber for external_task_complete (dormant until D5): a chore-
        board projection of a maintenance task was completed by a person. Record
        it and advance. Per the bus locking convention this mutates only and does
        NOT save — the publishing chores mutation persists the shared store."""
        task = self.get_maintenance_task(payload.get("external_id"))
        if not task:
            return
        self._apply_maintenance_completion(
            task,
            completed_by=payload.get("completed_by"),
            when=payload.get("completed_at"),
        )

    # ------------------------------------------------------------------
    # Daily tick hook (registered via modules.MODULES["maintenance"].tick_hook)
    # ------------------------------------------------------------------

    async def _async_maintenance_tick(self, today: date) -> None:
        """Clear expired snoozes. Due/overdue is derived from next_due, so there
        is nothing else to reconcile. Runs inside async_daily_tick, which saves
        once after all module hooks — so no save here."""
        today_iso = today.isoformat()
        for task in self.maintenance_tasks:
            snz = task.get("snoozed_until")
            if snz and snz <= today_iso:
                task["snoozed_until"] = None

    # ------------------------------------------------------------------
    # Products
    # ------------------------------------------------------------------

    def _new_maintenance_product(self, f: dict) -> dict:
        return {
            "id":                  _new_id(),
            "name":                f.get("name", ""),
            "spec":                f.get("spec", ""),
            "unit_cost_est":       float(f.get("unit_cost_est", 0) or 0),
            "qty_per_use":         int(f.get("qty_per_use", 1) or 1),
            "where_to_buy":        f.get("where_to_buy", ""),
            "inventory_count":     int(f.get("inventory_count", 0) or 0),
            "low_stock_threshold": int(f.get("low_stock_threshold", 1) or 0),
            "linked_task_ids":     list(f.get("linked_task_ids") or []),
            "source":              f.get("source", "custom"),
            "seed_id":             f.get("seed_id"),
        }

    async def async_maintenance_add_product(self, **f) -> dict:
        product = self._new_maintenance_product(f)
        self.maintenance_products.append(product)
        await self.async_save()
        return product

    async def async_maintenance_update_product(self, product_id: str, **f) -> bool:
        product = self.get_maintenance_product(product_id)
        if not product:
            return False
        for key in _PRODUCT_EDITABLE:
            if key in f and f[key] is not None:
                product[key] = f[key]
        await self.async_save()
        return True

    async def async_maintenance_delete_product(self, product_id: str) -> bool:
        before = len(self.maintenance_products)
        self._data["maintenance_products"] = [
            p for p in self.maintenance_products if p["id"] != product_id
        ]
        if len(self._data["maintenance_products"]) == before:
            return False
        await self.async_save()
        return True

    async def async_maintenance_adjust_inventory(self, product_id: str, delta: int) -> bool:
        product = self.get_maintenance_product(product_id)
        if not product:
            return False
        product["inventory_count"] = max(0, int(product.get("inventory_count", 0)) + int(delta))
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Vendors
    # ------------------------------------------------------------------

    async def async_maintenance_add_vendor(self, **f) -> dict:
        vendor = {
            "id":         _new_id(),
            "name":       f.get("name", ""),
            "trade":      f.get("trade", ""),
            "phone":      f.get("phone", ""),
            "notes":      f.get("notes", ""),
            "preferred":  bool(f.get("preferred", False)),
            "last_used":  f.get("last_used"),
            "last_price": f.get("last_price"),
        }
        self.maintenance_vendors.append(vendor)
        await self.async_save()
        return vendor

    async def async_maintenance_update_vendor(self, vendor_id: str, **f) -> bool:
        vendor = self.get_maintenance_vendor(vendor_id)
        if not vendor:
            return False
        for key in _VENDOR_EDITABLE:
            if key in f and f[key] is not None:
                vendor[key] = f[key]
        await self.async_save()
        return True

    async def async_maintenance_delete_vendor(self, vendor_id: str) -> bool:
        before = len(self.maintenance_vendors)
        self._data["maintenance_vendors"] = [
            v for v in self.maintenance_vendors if v["id"] != vendor_id
        ]
        if len(self._data["maintenance_vendors"]) == before:
            return False
        await self.async_save()
        return True

    # ------------------------------------------------------------------
    # Funds (manual ledger; inflation / target-today math is v0.8.x E2)
    # ------------------------------------------------------------------

    async def async_maintenance_update_fund(self, fund_id: str | None = None, **f) -> dict:
        """Upsert a fund: update when fund_id matches, else create a new one."""
        if fund_id:
            fund = self.get_maintenance_fund(fund_id)
            if fund:
                for key in _FUND_EDITABLE:
                    if key in f and f[key] is not None:
                        fund[key] = f[key]
                fund["updated_at"] = _now_iso()
                await self.async_save()
                return fund
        fund = {
            "id":             _new_id(),
            "fund_type":      f.get("fund_type", "sinking"),
            "name":           f.get("name", ""),
            "asset_category": f.get("asset_category", ""),
            "target_amount":  float(f.get("target_amount", 0) or 0),
            "balance":        float(f.get("balance", 0) or 0),
            "monthly_target": float(f.get("monthly_target", 0) or 0),
            "updated_at":     _now_iso(),
        }
        self.maintenance_funds.append(fund)
        await self.async_save()
        return fund

    # ------------------------------------------------------------------
    # Home Profile (editable settings — re-applies seed library on change)
    # ------------------------------------------------------------------

    async def async_maintenance_update_home_profile(self, **fields) -> dict:
        """Update Home Profile answers and re-apply the seed library.

        `None` clears an answer back to unanswered for the single-select variant
        fields (water heater type, roof type, heating type...) — that is a real
        answer, not "no change". Every other field ignores None so a partial
        service call never wipes anything.
        """
        from .seed_loader import VARIANT_FIELDS, profile_defaults

        hp = self.home_profile
        for key, default in profile_defaults().items():
            hp.setdefault(key, default)
        for key, value in fields.items():
            if value is not None or key in VARIANT_FIELDS:
                hp[key] = value
        hp["updated_at"] = _now_iso()
        await self.async_save()
        # Re-evaluate seed applicability (idempotent). Newly-applicable seeds
        # enable, newly-inapplicable seed tasks disable but keep their history.
        await self.async_maintenance_apply_seeds()
        return hp

    # ------------------------------------------------------------------
    # Seed library application
    # ------------------------------------------------------------------

    async def async_maintenance_load_library(self, force: bool = False) -> dict:
        """Read + cache seed_library.json. The card model needs the big-ticket
        asset table synchronously, so the file read happens here (async, off the
        event loop) and everything downstream reads `self._seed_library`."""
        from .seed_loader import async_load_seed_library

        if force or not self._seed_library:
            self._seed_library = await async_load_seed_library(self._hass)
        return self._seed_library

    def _seed_product_ids(self, seed: dict, task_id: str) -> list[str]:
        """Upsert an untracked product stub per product id this seed consumes and
        return the resulting product record ids.

        Stubs carry name-only data (the library references products as bare id
        strings) and `low_stock_threshold: 0`, so a zero count reads as UNTRACKED
        rather than OUT — otherwise every seeded task would look supply-blocked on
        day one. The user opts a product into inventory tracking by setting a
        threshold. Idempotent by seed_id."""
        from .seed_loader import product_display_name

        ids: list[str] = []
        for pid in (seed.get("products") or []):
            product = next(
                (p for p in self.maintenance_products if p.get("seed_id") == pid), None
            )
            if product is None:
                product = self._new_maintenance_product({
                    "name":                product_display_name(pid),
                    "low_stock_threshold": 0,   # untracked until the user says otherwise
                    "source":              "seed",
                    "seed_id":             pid,
                })
                self.maintenance_products.append(product)
            if task_id not in product["linked_task_ids"]:
                product["linked_task_ids"].append(task_id)
            ids.append(product["id"])
        return ids

    def _refresh_seeded_task(self, task: dict, fields: dict, fingerprint: str) -> bool:
        """Pull changed library values into an existing seeded task, but only if
        the user never hand-edited its schedule.

        The fingerprint is the schedule shape as the seed resolved it last time; if
        the task still matches, nothing local is at risk and it is safe to adopt the
        new values (this is what makes a climate-preset change actually reach tasks
        that already exist). If it differs, the user edited it — leave it alone."""
        from .seed_loader import seed_fingerprint

        stored = task.get("seed_fingerprint")
        current = seed_fingerprint(task)
        if stored is not None and stored != current:
            return False   # hand-edited — never clobber
        if stored == fingerprint:
            return False   # nothing changed in the library
        for key in _SEED_REFRESHABLE:
            task[key] = fields.get(key)
        task["seed_fingerprint"] = fingerprint
        task["updated_at"] = _now_iso()
        _LOGGER.info(
            "Family Hub: refreshed seeded task '%s' from the library (schedule changed)",
            task.get("name"),
        )
        return True

    async def async_maintenance_apply_seeds(self) -> dict:
        """Re-evaluate the seed library against the Home Profile.

        Idempotent by seed_id, and safe to call any number of times:
          • applicable seeds with no task yet are ADDED;
          • seed tasks that apply again are RE-ENABLED (a profile answer flipped
            back), with next_due re-armed only if it was cleared;
          • seed tasks that stopped applying are DISABLED with a reason — never
            deleted, so completions and history survive a wrong profile answer;
          • untouched seed tasks pick up changed library values (climate preset).

        Returns {"added", "reenabled", "disabled", "refreshed"}.
        """
        from .seed_loader import (
            applicable_seeds,
            disable_reason,
            library_tasks,
            seed_fingerprint,
            seed_to_task_fields,
        )

        library = await self.async_maintenance_load_library(force=True)
        tasks = library_tasks(library)
        if not tasks:
            return {"added": 0, "reenabled": 0, "disabled": 0, "refreshed": 0}

        profile = self.home_profile
        seeds = applicable_seeds(tasks, profile)
        by_seed_id = {s["task_id"]: s for s in seeds}
        existing = {
            t["seed_id"]: t for t in self.maintenance_tasks
            if t.get("source") == "seed" and t.get("seed_id")
        }
        today = date.today()
        counts = {"added": 0, "reenabled": 0, "disabled": 0, "refreshed": 0}

        for seed_id, seed in by_seed_id.items():
            fields = seed_to_task_fields(seed, profile)
            fingerprint = seed_fingerprint(fields)
            task = existing.get(seed_id)

            if task is None:
                task = self._new_maintenance_task(
                    {**fields, "source": "seed", "seed_id": seed_id,
                     "seed_fingerprint": fingerprint},
                    today,
                )
                task["product_ids"] = self._seed_product_ids(seed, task["id"])
                self.maintenance_tasks.append(task)
                counts["added"] += 1
                continue

            if self._refresh_seeded_task(task, fields, fingerprint):
                counts["refreshed"] += 1
            # Re-enable only what WE disabled. A non-empty disabled_reason is the
            # marker that the profile turned this off; a task the user switched off
            # by hand (or a finished one-shot) has none, and must stay off.
            if not task.get("enabled", True) and task.get("disabled_reason"):
                task["enabled"] = True
                task["disabled_reason"] = ""
                if not task.get("next_due"):
                    nd = initial_next_due(task, today)
                    task["next_due"] = nd.isoformat() if nd else None
                task["updated_at"] = _now_iso()
                counts["reenabled"] += 1

        # Seed tasks that stopped applying: disable + say why. Keep the record.
        library_by_id = {s["task_id"]: s for s in tasks}
        for seed_id, task in existing.items():
            if seed_id in by_seed_id or not task.get("enabled", True):
                continue
            task["enabled"] = False
            task["disabled_reason"] = (
                disable_reason(library_by_id[seed_id], profile)
                if seed_id in library_by_id else "no longer in the seed library"
            )
            task["updated_at"] = _now_iso()
            counts["disabled"] += 1

        await self.async_save()
        if any(counts.values()):
            _LOGGER.warning(
                "Family Hub: seed library applied — %d added, %d re-enabled, "
                "%d disabled, %d refreshed (%d applicable of %d)",
                counts["added"], counts["reenabled"], counts["disabled"],
                counts["refreshed"], len(seeds), len(tasks),
            )
        return counts

    # ------------------------------------------------------------------
    # One-time migration: category_label=="Maintenance" chores → tasks (A5)
    # ------------------------------------------------------------------

    def _chore_to_maintenance_fields(self, chore: dict) -> dict:
        """Map a legacy Maintenance chore's fields to maintenance-task fields.
        Rotation/claim/day-filter nuances are dropped (noted in the description
        and/or an INFO log)."""
        rec = chore.get("recurrence", {}) or {}
        rtype = rec.get("type", RECURRENCE_DAILY)
        interval = int(rec.get("interval", 1) or 1)
        schedule_mode = "from_completion"
        recurrence: dict | None
        seasonal_anchor = None
        note = ""

        if rtype == RECURRENCE_DAILY:
            recurrence = {"interval": 1, "unit": "days"}
            df = rec.get("day_filter") or []
            if df and len(df) < 7:
                note = " (was daily on selected weekdays)"
        elif rtype == RECURRENCE_WEEKLY:
            recurrence = {"interval": 1, "unit": "weeks"}
        elif rtype == RECURRENCE_EVERY_N_DAYS:
            recurrence = {"interval": interval, "unit": "days"}
        elif rtype == RECURRENCE_EVERY_N_WEEKS:
            recurrence = {"interval": interval, "unit": "weeks"}
        elif rtype == RECURRENCE_MONTHLY_ON_DATE:
            schedule_mode = "calendar_anchored"
            recurrence = {"interval": 1, "unit": "months"}
            dom = sorted(chore.get("days_of_month") or [])
            seasonal_anchor = {"month": None, "day": (dom[0] if dom else 1)}
            if len(dom) > 1:
                note = f" (was monthly on days {', '.join(map(str, dom))})"
        elif rtype == RECURRENCE_ONE_TIME:
            recurrence = None
        else:
            recurrence = {"interval": 1, "unit": "days"}

        assignable = bool(chore.get("assigned_to") or chore.get("chore_type") == CHORE_TYPE_CLAIMABLE)
        if chore.get("rotation_pool") or chore.get("claimable_subtype"):
            _LOGGER.info(
                "Family Hub: migration dropped rotation/claim config from chore '%s'",
                chore.get("name"),
            )

        return {
            "name":                chore.get("name", "Untitled"),
            "description":         (chore.get("description", "") + note).strip(),
            "category":            "general",
            "schedule_mode":       schedule_mode,
            "recurrence":          recurrence,
            "seasonal_anchor":     seasonal_anchor,
            "workflow":            "simple",
            "lead_time_days":      14,
            "default_point_value": int(chore.get("points", 0) or 0),
            "assignable":          assignable,
            "enabled":             bool(chore.get("active", True)),
            "source":              "chore_migration",
            "legacy_chore_id":     chore["id"],
        }

    def _set_migrated_schedule(self, task: dict, instances: list, today: date) -> None:
        """next_due = earliest ACTIVE instance due date (else the derived initial);
        last_completed = latest completed instance date."""
        active_due = sorted(
            i["due_date"] for i in instances
            if i.get("status") in ACTIVE_STATUSES and i.get("due_date")
        )
        if active_due:
            task["next_due"] = active_due[0]
        else:
            d = initial_next_due(task, today)
            task["next_due"] = d.isoformat() if d else None
        completed = sorted(
            i["completed_at"][:10] for i in instances
            if i.get("status") in (STATUS_APPROVED, STATUS_SELF_REPORTED) and i.get("completed_at")
        )
        if completed:
            task["last_completed"] = completed[-1]

    async def _async_migrate_maintenance_chores(self) -> int:
        """One-time move of category_label=="Maintenance" chores into the new
        maintenance collection. Presence-based + record-level idempotent (dedupe
        by legacy_chore_id), so it's a no-op on every subsequent load and also
        catches Maintenance chores re-imported from an old export.

        Takes a pre-migration export backup BEFORE mutating; synthesizes
        completions from approved/self-reported instances; deletes the chore and
        its task_instances. `history` rows are never touched."""
        already = {
            t.get("legacy_chore_id") for t in self.maintenance_tasks if t.get("legacy_chore_id")
        }
        targets = [
            c for c in self.chores
            if c.get("category_label") == "Maintenance" and c["id"] not in already
        ]
        if not targets:
            return 0

        # Pre-migration backup — do not proceed without it (data is sacred).
        import os
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup = os.path.join(
            self._hass.config.path("family_hub_backups"),
            f"family_hub_pre_maintenance_migration_{ts}.json",
        )
        try:
            await self.async_export_data(backup)
        except Exception as err:  # noqa: BLE001
            _LOGGER.error(
                "Family Hub: pre-migration backup failed (%s); aborting migration", err
            )
            return 0

        today = date.today()
        migrated = 0
        for chore in targets:
            instances = [t for t in self.task_instances if t.get("chore_id") == chore["id"]]
            task = self._new_maintenance_task(self._chore_to_maintenance_fields(chore), today)
            self._set_migrated_schedule(task, instances, today)
            self.maintenance_tasks.append(task)

            for inst in instances:
                if inst.get("status") in (STATUS_APPROVED, STATUS_SELF_REPORTED) and inst.get("completed_at"):
                    self.maintenance_completions.append({
                        "id":             _new_id(),
                        "task_id":        task["id"],
                        "date":           inst["completed_at"][:10],
                        "completed_by":   inst.get("completed_by"),
                        "mode":           "diy",
                        "stage":          "do",
                        "actual_cost":    0,
                        "actual_minutes": 0,
                        "products_used":  [],
                        "vendor_id":      None,
                        "notes":          "migrated from chore",
                        "photo":          None,
                    })

            self._data["chores"] = [c for c in self.chores if c["id"] != chore["id"]]
            self._data["task_instances"] = [
                t for t in self.task_instances if t.get("chore_id") != chore["id"]
            ]
            migrated += 1
            _LOGGER.info(
                "Family Hub: migrated Maintenance chore '%s' (%s) → maintenance task %s",
                chore.get("name"), chore["id"], task["id"],
            )

        await self.async_save()
        _LOGGER.warning(
            "Family Hub: migrated %d Maintenance chore(s) into the maintenance module "
            "(pre-migration backup: %s)", migrated, backup,
        )
        return migrated

    # ------------------------------------------------------------------
    # Bus wiring (called from FamilyHubDataStore._register_bus_subscriptions)
    # ------------------------------------------------------------------

    def _register_maintenance_subscriptions(self) -> None:
        from .const import TOPIC_EXTERNAL_TASK_COMPLETE
        self.bus.subscribe(
            TOPIC_EXTERNAL_TASK_COMPLETE, "maintenance", self._apply_external_completion
        )

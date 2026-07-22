# Family Hub v0.8.0 — Phase A Foundations Plan

> **Status: APPROVED 2026-07-11 (A1 architecture session). Sessions A2–A6 implement this document.**
> Scope authority: `home-maintenance-module-scope.md` (v2) + `family-hub-v080-implementation-plan.md` (Phases A–E).
> This doc covers Phase A only: module framework, event bus, versioned export/import, maintenance backend, chores→maintenance migration, chores/rewards gating audit.
> Phase B (seed research), C (design), D (room UI / notifications / bridge), E (costs/funds/inspect-plan-do) are unchanged from the implementation-plan doc.

**User decision (A1):** ALL modules are gateable in v0.8.0 — including Chores and Rewards — which adds session A6 (chores/rewards gating audit) to the original A2–A5 map.

---

## 0. Verified baseline (v0.7.7)

Facts every session relies on (verified 2026-07-11):

- `FamilyHubDataStore` (`data_store.py:199`) composes 12 mixins over one shared `self._data` + `self._lock` + `self.data_rev`. Mixins never import each other; everything resolves through `self`/MRO.
- Multi-store `_STORE_DOMAINS` (`_store_helpers.py:135`): `core:[version,settings,people]`, `chores:[chores,task_instances]`, `rewards:[store_items,redemptions,subscriptions,group_reward_proposals]`, `history:[history]`, `meals:[meals]` → per-domain `.storage/family_hub_<domain>` files, 2 s debounced `async_delay_save`, "core" is the catch-all for unmapped keys. `STORAGE_VERSION = 2`.
- Record migrations are idempotent setdefault forward-fills on every load (`_run_record_migrations`, `data_store.py:356`). **No numeric data schema version exists.** Legacy v1→v2 migration (`_async_migrate_from_legacy`, `data_store.py:268`) = backup + verify-by-count + rollback — the safety pattern this plan reuses.
- All ~63 services registered unconditionally in `async_setup_services` (`services.py:63`); the contiguous meals block is `services.py:1329–1476`. Unload removes services dynamically (`__init__.py:338`).
- Sensors created unconditionally (`sensor.py:80`). Stale-entity cleanup (`__init__.py:290`) hardcodes 4 expected unique_ids and **is missing `family_hub_meals`** (existing bug — fixed by registry-driven cleanup in A2).
- **No OptionsFlow, no update listener** in `config_flow.py`. `async_unload_entry` flushes debounced writes (`__init__.py:321-330`) → reload-on-toggle is safe.
- **No event bus** (no dispatcher, no outbound `bus.async_fire`). Reactivity = `data_rev` bump → card refetches the websocket model (`websocket.py:38`; `build_card_model` at `card_model.py:644`, keyed by entity_id).
- Export exists (`async_export_backup`, `data_store.py:657` — raw merged dict, no envelope); **no import exists anywhere**.
- The maintenance "module" today is one predicate: `_chore_is_maintenance` (`chores_mixin.py:145`, `category_label == "Maintenance"`) + 6 call sites (`card_model.py:116`; `card_shaper_mixin.py:181, 378, 451, 535, 584`). The tick has no maintenance special-case.
- Card: room registry `src/card/rooms/index.js` (`ROOMS`); home tiles `hub-skins/classic.js:_htmlRooms` (:119) read status from backend `rooms_config` (live/hidden, admin "Hub layout" panel `modes-admin.js:1606` → `save-hub-layout` `dispatch.js:594` → `update_settings`); `FamilyHubCard.js:_htmlCommandCenter` (:553) calls `room.render` unguarded; rooms need zero per-theme work; Meals (`rooms/meals.js`) is the room template.

---

## 1. Module framework

### Flags: OptionsFlow + entry reload

- New `FamilyHubOptionsFlow` in `config_flow.py` (`async_get_options_flow` static): single `async_step_init` with one bool per module, default True. Flags stored in `entry.options["modules"]`.
- `entry.async_on_unload(entry.add_update_listener(...))` → `hass.config_entries.async_reload(entry.entry_id)`.
- **Why reload, not dynamic registration:** `async_setup_entry` rebuilds services/sensors/resources from scratch, so "disabled = never registered" falls out for free. Dynamic add/remove would add ~200 lines and a half-registered failure mode. Reload costs ~1–2 s on a rare admin action.
- Tradeoff (accepted): flags live in HA config-entry storage — they ride HA backups, not `export_data` (recorded informationally in export `meta.modules`, never re-applied on import). Flags are infrastructure; data is data.

### Registry: `modules.py`

Mixins stay composed unconditionally on `FamilyHubDataStore`. Gating happens at exactly four exposure surfaces — services, sensors, card model, tick — each driven by a declarative table:

```python
@dataclass(frozen=True)
class ModuleDef:
    id: str                              # chores | rewards | meals | maintenance | smarthome | calendar
    title: str                           # options-flow label
    store_domains: tuple[str, ...]       # _STORE_DOMAINS keys owned
    register_services: Callable | None   # (hass, coordinator) -> None
    sensor_unique_ids: tuple[str, ...]   # gated creation + registry-driven stale cleanup
    model_keys: tuple[str, ...]          # entity_id keys in build_card_model
    tick_hook: str | None                # store coroutine name, e.g. "_async_maintenance_tick"
    room_ids: tuple[str, ...]            # card room ids gated by this module

MODULES: dict[str, ModuleDef]            # chores, rewards, meals, maintenance, smarthome, calendar
def enabled_modules(entry: ConfigEntry) -> frozenset[str]: ...
```

- `store.enabled_modules` set in `async_setup_entry` **before** the first refresh; passed to `async_setup_services(hass, coordinator, enabled)` and to `sensor.py` via `hass.data[DOMAIN][entry_id]`.
- **Core is not a module and never gateable:** people, points balances, settings, history, tick engine, websocket, allowance (a points grant on people, not a chore mechanism).

### Module boundaries (forced by all-gateable)

| Module | Owns |
|---|---|
| **chores** | `chores` + `task_instances` collections; chore/task/claim/approval/streak/rank services; claimable sensor; per-person **widget** sensors + checklist notifications (they render chore checklists); tick: instance generation, penalties, **streaks/ranks weekly processing** (ranks are chores-derived — chores off ⇒ rank/streak values freeze at stored values) |
| **rewards** | `store_items`, `redemptions`, `subscriptions`, `group_reward_proposals`; their services; subscriptions tick hook. Rank-scaled PPD uses the (possibly frozen) stored rank |
| **meals** | `meals` collection; 18 `meals_*` services; `sensor.family_hub_meals`; meals model keys; meals room |
| **maintenance** | new domain (§4); ~19 services; both maintenance sensors; maintenance model keys; HOME CARE room |
| **smarthome / calendar** | declared in the table (rooms only, coming-soon) so tiles gate uniformly |

Chores and rewards are mutually independent: rewards off + chores on = earn-only; chores off + rewards on = spend-only. Per-person **main** sensors (points balance) are core; **widget** sensors are chores surfaces. `needs_attention.native_value` terms gate per module: approvals+claimables (chores), redemptions+group+cancel-pending subs (rewards), overdue maintenance (maintenance).

### Retrofit (least churn)

- Extract service blocks verbatim: meals (`services.py:1329-1476`) → `services_meals.py` (A2); chores/rewards blocks → `services_chores.py` / `services_rewards.py` (A6). Core setup ends with `for mod in MODULES.values(): if mod.register_services and mod.id in enabled: mod.register_services(hass, coordinator)`.
- `build_card_model` wraps each module's keys in enabled checks; disabled ⇒ key omitted (card `_attrs()` already tolerates missing keys). The card gates UI on the `modules` map, not key absence.
- Tick: after the core per-date loop, `for mod ...: if mod.tick_hook and mod.id in self.enabled_modules: await getattr(self, mod.tick_hook)(today)`.
- Stale-entity cleanup (`__init__.py:290`) rebuilt from the registry: expected = per-person core sensors + enabled modules' `sensor_unique_ids`. Fixes the meals omission; disable→reload auto-removes module entities; re-enable recreates identical unique_ids (entity-id contract holds whenever the module is on).
- **Data is sacred:** all store domains load, record-migrate, and save regardless of flags. Disabled = never exposed, never mutated. Re-enable is instant and lossless. `export_data` always covers 100 % of data.

### Card side: "disabled" ≠ "hidden"

New key in needs_attention scalars + payload:

```json
"modules": {"chores": true, "rewards": true, "meals": false, "maintenance": true, "smarthome": false, "calendar": false}
```

| | `rooms_config[id].status = "hidden"` | `modules[id] = false` |
|---|---|---|
| Meaning | Cosmetic layout choice | Module not running |
| Backend | Services/sensors/data all live | No services, no sensors, model keys omitted |
| Home tile | Omitted | Dimmed "MODULE OFF" tile (reuse COMING SOON styling; sub-line "Enable in HA → Family Hub → Configure") |
| Drill-down | Reachable | Blocked (unavailable screen) |

Disabled wins over hidden. Touch points: `hub-skins/classic.js:_htmlRooms` (:119) — `moduleOn = naAttr.modules?.[room.id] !== false`; `FamilyHubCard.js:_htmlCommandCenter` (:553) — guard `room.render`; `modes-admin.js` — hide module admin tabs when off, Hub-layout panel shows disabled modules as locked rows ("managed in integration options"). Personal pages degrade: chore sections/rank chips gate on `modules.chores`, store rail on `modules.rewards` (A6).

---

## 2. Event bus

New `event_bus.py` (~60 lines), owned by the store:

```python
class FamilyHubBus:
    """In-process pub/sub between Family Hub modules. NOT the HA event bus.

    LOCKING CONVENTION (the one rule):
    Publishers call async_publish() from inside their own locked mutation.
    Callbacks therefore run UNDER THE STORE LOCK and must:
      (a) mutate self._data only via internal _apply_* helpers,
      (b) never call async_save() or any public async_* store method,
      (c) never re-publish.
    The publisher's own async_save() persists everything.
    """
    def __init__(self, is_enabled: Callable[[str], bool]) -> None: ...
    def subscribe(self, topic: str, module_id: str, callback) -> Callable[[], None]: ...
    async def async_publish(self, topic: str, payload: dict) -> int:
        """Deliver to enabled subscribers, sequentially, in registration order.
        Subscriber whose module is disabled is silently skipped (debug log).
        Returns delivery count — 0 tells the publisher nobody listened."""
```

- Constructed in `FamilyHubDataStore.__init__`: `self.bus = FamilyHubBus(lambda mid: mid in self.enabled_modules)`. Reachable from every mixin via `self.bus` — **zero cross-module imports**; publishers know only topic strings.
- Subscriptions registered unconditionally at store init via a per-mixin `_register_bus_subscriptions()` hook, so the gate is at **delivery time** — toggling a module on is race-free.
- `async_publish` returning 0 lets a publisher revert affordance state (e.g. maintenance clears `offered_external` if no one consumed the offer).
- Topic constants in `const.py`; payload contracts **frozen now** (the Chores-bridge subscriber ships in Phase D5):

| Topic | Payload |
|---|---|
| `external_task_offer` | `{source_module, external_id, name, description, points, due_date, assigned_to\|null, claimable}` |
| `external_task_complete` | `{source_module, external_id, completed_by, completed_at}` |
| `external_task_revoke` | `{source_module, external_id}` |

- **Card affordance rule:** any control whose action publishes to a topic subscribed by module M renders only when `naAttr.modules[M]` (e.g. Maintenance "Assign" hidden when chores is off).

---

## 3. Versioned export/import

**`DATA_SCHEMA_VERSION = 3`** in `const.py` — the *family-data* schema version, distinct from HA Store layout `STORAGE_VERSION = 2`. Lineage: v1 = legacy single file, v2 = current multi-store shape, v3 = v0.8.0. Existing setdefault migrations remain the intra-version forward-fill; **numbered migrators handle structural changes only**. Rule going forward: any release that changes stored *structure* (renames/moves collections or keys) bumps `DATA_SCHEMA_VERSION` and adds `MIGRATORS[old]`.

New `migrations.py`:

```python
MIGRATORS: dict[int, Callable[[dict], dict]] = {}   # MIGRATORS[3] migrates 3→4
def migrate_to_current(data: dict, from_version: int) -> dict:
    while from_version < DATA_SCHEMA_VERSION:
        data = MIGRATORS[from_version](data)   # KeyError = unmigratable → caller aborts
        from_version += 1
    return data
```

`_run_record_migrations` stamps `self._data["schema_version"] = DATA_SCHEMA_VERSION` (add `"schema_version"` to core's `_STORE_DOMAINS` list explicitly).

### Envelope

```json
{
  "format": "family_hub_export",
  "schema_version": 3,
  "app_version": "0.8.0",
  "exported_at": "2026-07-11T09:00:00-07:00",
  "meta": {
    "modules": {"chores": true, "rewards": true, "meals": true, "maintenance": true},
    "counts": {"people": 5, "chores": 22, "task_instances": 310, "history": 1450,
               "store_items": 12, "redemptions": 38, "subscriptions": 2,
               "group_reward_proposals": 1, "maintenance_tasks": 0, "maintenance_completions": 0}
  },
  "data": { "...entire merged store dict, all domains, disabled modules included..." }
}
```

### Store methods + services

- `async_export_data(export_path: str | None) -> str` — envelope + counts, default `<config>/family_hub_backups/family_hub_export_<ts>.json`.
- `async_import_data(import_path: str, dry_run: bool = False) -> dict`, in order:
  1. Read + parse off the event loop.
  2. Envelope detect: `format == "family_hub_export"` → `data` + `schema_version`; bare dict with `people`/`settings` → legacy `export_backup` output treated as current-shape v3 (**old backups restorable forever**).
  3. Reject `schema_version > DATA_SCHEMA_VERSION` ("export from a newer Family Hub").
  4. `migrate_to_current()` on a **candidate copy**; then record migrations on the candidate — extract `_run_record_migrations`'s body into `_migrate_records(data: dict)` so it runs on any dict.
  5. Verify candidate counts ≥ envelope counts per collection; **history equality mandatory** (losing history is the only unacceptable outcome).
  6. `dry_run` → return the verification report here; touch nothing.
  7. Pre-import backup of *current* data via `async_export_data` → `family_hub_pre_import_<ts>.json`.
  8. Under `self._lock`: swap `self._data = candidate`, save all domains, `async_flush()`.
  - Rollback = validate-then-swap: any failure in 1–7 means the swap never happened; failure at 8 logs the pre-import backup path loudly.
- Services `export_data {path?}` / `import_data {path, dry_run?}` — core (never gated), + services.yaml entries.
- `export_backup` / `async_export_backup` kept byte-identical for one release, documented deprecated in favor of `export_data`.

---

## 4. Maintenance data model

New store domain in `_STORE_DOMAINS`:

```python
"maintenance": ["maintenance_tasks", "maintenance_products", "maintenance_completions",
                "maintenance_vendors", "maintenance_funds", "home_profile"],
```

plus `_empty_maintenance()` / `_migrate_maintenance(data)` per the `_empty_meals`/`_migrate_meals` precedent, wired into `_empty_store()` and `_run_record_migrations`. `home_profile` lives in the maintenance domain (it exists to parameterize seed applicability; nothing outside maintenance reads it).

### No task instances — state is derived

The task record carries `next_due`/`last_completed`; lifecycle state comes from a pure function, never stored. **Why (vs chores):** chores multiply — one chore × N assignees × every recurrence day, each with independent approval/penalty/claim state feeding streak math. A maintenance task has exactly one next occurrence for one household and no approval flow; its audit trail is the completions collection. An instance layer would duplicate `next_due` into a row the tick must reconcile — pure liability. The one exception (a task offered to a chore board) is an instance the *chores* module creates in response to a bus offer (D5) — instance semantics stay owned by the module that has them.

### Task record

```json
{
  "id": "b41f9c2e-…", "name": "Replace HVAC filter", "description": "MERV 13 16x25x1, hall return. How-to: …",
  "category": "hvac", "location": "Hall closet",
  "schedule_mode": "from_completion",
  "recurrence": {"interval": 2, "unit": "months"},
  "seasonal_anchor": null,
  "workflow": "simple", "workflow_stage": null,
  "lead_time_days": 14,
  "effort": {"diy_minutes": 15, "difficulty": "Easy"},
  "est_cost_diy": 12.0, "est_cost_pro": 0.0, "default_mode": "diy",
  "product_ids": ["a7d2…"],
  "assignable": true, "default_point_value": 10,
  "next_due": "2026-09-15", "last_completed": "2026-07-15", "snoozed_until": null,
  "offered_external": false,
  "source": "custom", "seed_id": null, "legacy_chore_id": null,
  "enabled": true,
  "created_at": "2026-07-11T09:00:00-07:00", "updated_at": "2026-07-11T09:00:00-07:00"
}
```

- `schedule_mode ∈ {from_completion, calendar_anchored}`; `seasonal_anchor = {"month": 10, "day": 1}` when calendar-anchored.
- `recurrence.unit ∈ {days, weeks, months, years}`; `recurrence: null` = one-shot (task auto-sets `enabled: false` after completion).
- `workflow ∈ {simple, inspect_plan_do}`; `workflow_stage ∈ {null, "plan", "do"}` tracks a mid-cycle inspect→plan→do pass.
- `source ∈ {seed, custom, chore_migration}`; seed tasks disable, never delete.

**Lifecycle** (`scheduled → upcoming → due → overdue`, + `snoozed`/`disabled`; `completed`/`skipped` are *events* = completion records):

```python
# _maintenance_schedule.py — pure, HA-free, unit-testable
def task_state(task: dict, today: date) -> str: ...
def compute_next_due(task: dict, completed_on: date) -> date | None: ...
def initial_next_due(task: dict, today: date) -> date: ...
```

`compute_next_due`: `from_completion` ⇒ `completed_on + interval×unit` (month/year math clamped — generalize the existing `_advance_renewal_date`); `calendar_anchored` ⇒ next anchor occurrence strictly after `completed_on` (late completion never drifts the anchor); `null` recurrence ⇒ `None`.

### Other collections

```json
// maintenance_products
{"id":"a7d2…","name":"MERV 13 filter 16x25x1","spec":"16x25x1","unit_cost_est":12.0,
 "qty_per_use":1,"where_to_buy":"Home Depot","inventory_count":2,"low_stock_threshold":1,
 "linked_task_ids":["b41f…"]}
// maintenance_completions (append-only)
{"id":"…","task_id":"b41f…","date":"2026-07-11","completed_by":"<person_id|null>",
 "mode":"diy","stage":"do","actual_cost":12.5,"actual_minutes":20,
 "products_used":[{"product_id":"a7d2…","qty":1}],"vendor_id":null,"notes":"","photo":null}
// maintenance_vendors
{"id":"…","name":"CoolFlow HVAC","trade":"hvac","phone":"","notes":"","preferred":true,
 "last_used":"2026-03-02","last_price":189.0}
// maintenance_funds — emergency fund is just a record, no special-casing; fund MATH is v0.8.x (E2)
{"id":"…","fund_type":"sinking","name":"Roof","asset_category":"roof",
 "target_amount":12000,"balance":1500,"monthly_target":150,"updated_at":"…"}
// home_profile (dict, editable settings — never one-time setup)
{"year_built":1998,"sqft":2400,"stories":2,"roof_type":"tile","climate_preset":"desert_southwest",
 "has_pool":false,"has_softener":true,"has_ro":true,"has_gutters":false,"has_septic":false,
 "has_fireplace":false,"hvac_filter_sizes":["16x25x1"],"hvac_count":2,
 "home_value":0,"inflation_rate":0.035,"updated_at":"…"}
```

`photo` is a string path/URL or null — **no upload plumbing in Phase A** (field exists for forward compatibility).

### Code layout

- **`maintenance_mixin.py`** (added to `FamilyHubDataStore` bases): properties + CRUD for all five collections and home_profile; `async_maintenance_complete_task` (write completion → decrement inventory per `products_used` → advance `next_due` via `compute_next_due` → clear snooze → inspect_plan_do stage advance: inspect-complete "needs work" sets `workflow_stage="plan"`, plan built → `"do"`, do-complete resets to null + re-arms the inspection; pro-mode completion updates the vendor's `last_used`/`last_price`); `async_maintenance_snooze_task` / `_reschedule_task` / `_skip_task` (skip logs a `stage:"skipped"` completion, advances `next_due`, does not touch `last_completed`); `async_maintenance_offer_task` / `_revoke_task` (set/clear `offered_external`, publish `external_task_offer` / `external_task_revoke`; delivery count 0 ⇒ revert flag); `_async_maintenance_tick(today)` (clear expired snoozes — due/overdue is derived, nothing to bookkeep); `_register_bus_subscriptions()` subscribing `external_task_complete` → `_apply_external_completion` (dormant until D5).
- **`_maintenance_schedule.py`**: the pure functions above.
- **`services_maintenance.py`**: `register_maintenance_services(hass, coordinator)` — ~19 services, registered only when enabled: `maintenance_add_task / update_task / delete_task / complete_task / snooze_task / reschedule_task / skip_task / offer_task / revoke_task / add_product / update_product / delete_product / adjust_inventory / add_vendor / update_vendor / delete_vendor / update_fund / update_home_profile / apply_seeds`.
- **`seed_loader.py`** + **`seed_library.json`** (ships `[]`; Phase B fills it per `seed-schema.json`): `async_load_seed_library(hass)`; `applicable_seeds(library, home_profile)` filtering on a per-seed `requires` predicate dict (e.g. `{"has_pool": true}`, `{"climate_preset_in": ["desert_southwest"]}` — vocabulary maps from the seed schema's `applicability` tags); `async_apply_seed_tasks(seeds)` idempotent by `seed_id` — adds newly applicable seeds, sets `enabled: false` on seed-sourced tasks that stopped applying (never deletes, never touches completions). `maintenance_update_home_profile` calls it automatically — **Home Profile is editable settings, never one-time setup.**

### Frozen sensor/model contract

`sensor.family_hub_maintenance_due` / `_overdue` entity ids unchanged. Scalar keys preserved: `overdue, due_this_week, due_next_week, next_item, next_due_date, next_due_days` (+ `oldest_overdue_days` on the overdue sensor). Item keys preserved: `task_id, chore_id(=null), name, description, category_label(=category), due_date(=next_due), days_delta, assigned_to, person_name, person_color`. `rooms/maintenance.js` keeps working untouched until Phase D. **During A4 the builders read the union of the new collection + legacy Maintenance-labeled chores; A5 removes the legacy half.**

---

## 5. Chores→Maintenance migration (A5)

`_async_migrate_maintenance_chores()` called from `async_setup_entry` right after `store.async_load()` (same slot as `_reconcile_chore_instance_types`).

- **Presence-based idempotency** (no settings flag): no `category_label == "Maintenance"` chores ⇒ no-op. This also catches Maintenance chores arriving later via `import_data` of an old export (import reruns record migrations *and* this pass). Record-level dedupe: skip a chore if a task with `legacy_chore_id == chore.id` already exists.
- Targets found ⇒ **pre-migration `async_export_data(...pre_maintenance_migration_<ts>.json)` first.**

### Field mapping

| Old chore field | New task field |
|---|---|
| `name`, `description` | copied |
| `category_label` "Maintenance" | `category: "general"` |
| recurrence `daily` / `weekly` / `every_n_days` / `every_n_weeks` | `from_completion` + `{1,"days"}` / `{1,"weeks"}` / `{n,"days"}` / `{n,"weeks"}` |
| recurrence `monthly_on_date` | `calendar_anchored`, `{1,"months"}`, anchor at earliest `days_of_month` (extra days noted in description) |
| `points` | `default_point_value` |
| assigned/claimable | `assignable = bool(assigned_to or claimable)` |
| `active` | `enabled` |
| — | `workflow "simple"`, `lead_time_days 14`, `effort {0,"Easy"}`, costs 0, `default_mode "diy"`, `source "chore_migration"`, `legacy_chore_id` |
| rotation pool / claim fields | **dropped**, INFO log per chore |

`next_due` = earliest ACTIVE instance `due_date`, else `initial_next_due`. `last_completed` = latest completed instance date.

- Synthesize `maintenance_completions` from instances with status ∈ {approved, self_reported}: `date = completed_at[:10]`, `completed_by`, `mode "diy"`, `stage "do"`, costs/minutes 0, note "migrated from chore".
- Delete the chore + **all** its task_instances. **`history` rows untouched** — free-standing text/points records that remain valid ("losing history is the only unacceptable outcome" satisfied with zero risk).
- Log per-chore INFO lines + one summary.

### Seam removal (same session)

- Delete `_chore_is_maintenance` (`chores_mixin.py:145`) + the 4 exclusion branches (`card_shaper_mixin.py:181, 451, 535, 584` — each a plain `if/continue` removal). The 2 selection sites (`card_model.py:116`, `card_shaper_mixin.py:378`) were rewritten in A4.
- Remove `"Maintenance"` from `DEFAULT_CATEGORY_LABELS` (`const.py`); add a forward-fill in `_run_record_migrations` stripping `"Maintenance"` from existing `settings["category_labels"]`.
- **Keep** `_migrate_chore`'s legacy label seeding (`_store_helpers.py:221-229`) and `LEGACY_MAINTENANCE_CATEGORIES` — they route a v1-era import into this migration.
- Card: remove the maintenance room's "+ Add reminder" button (`rooms/maintenance.js` — it opens the chore modal, which can no longer create Maintenance chores). Real room UI is Phase D. Release notes flag the conversion.

---

## 6. Session briefs A2–A6

Each session: one sitting, Sonnet, plan mode first, `/clear` before. Workflow per CLAUDE.md: edit local → CI green → Samba deploy → live test → commit only on explicit "go". Every session updates DECISIONS_LOG.md with anything decided along the way.

### A2 — Module framework + event bus
**Files:** new `modules.py`, `event_bus.py`, `services_meals.py` (verbatim extraction of `services.py:1329-1476`); `config_flow.py` (OptionsFlow + listener); `__init__.py` (enabled plumb-through :266, registry-driven stale cleanup :290 incl. meals fix); `services.py` (signature + registrar loop); `sensor.py` (gated creation); `card_model.py` (`modules` map + gated keys); `data_store.py` (`enabled_modules`, `self.bus`, `_register_bus_subscriptions` hook); `const.py` (topics); `tick_mixin.py` (tick-hook loop); card: `hub-skins/classic.js:119`, `FamilyHubCard.js:553`, `modes-admin.js:1606` (OFF tile / drill-down guard / locked rows), CSS part, `npm run build`.
Chores/rewards declared in the registry with toggles exposed but **flagged experimental** in the options-flow labels until A6 passes.
**Acceptance:** disable meals via Configure → entry reloads; `meals_*` services gone; `sensor.family_hub_meals` removed from the registry; tile shows OFF; drill-down blocked; `.storage/family_hub_meals` byte-identical; re-enable lossless. Publish to a topic whose only subscriber's module is disabled returns 0 + debug log (test publish-under-lock). Everything-enabled behavior identical to v0.7.7.

### A3 — Versioned export/import
**Files:** new `migrations.py`; `data_store.py` (`async_export_data`, `async_import_data`, `_migrate_records` extraction, schema_version stamp); `services.py` (+2 core services); `services.yaml`; `const.py` (`DATA_SCHEMA_VERSION`).
**Acceptance:** export → stop HA → rename all `.storage/family_hub_*` → start → import → every collection count identical, history exactly equal. `dry_run: true` reports and changes nothing. Corrupt / newer-version / count-short files abort with the live store untouched. A raw legacy `export_backup` file imports successfully.

### A4 — Maintenance backend
**Files:** new `maintenance_mixin.py`, `_maintenance_schedule.py`, `services_maintenance.py`, `seed_loader.py`, `seed_library.json` (`[]`); `_store_helpers.py` (domain + empty/migrate); `data_store.py` (mixin base); `modules.py` (maintenance entry complete); `card_model.py` + `card_shaper_mixin.py` (union-read builders, **keys frozen per §4**); `services.yaml`; tick registration.
**Acceptance:** both schedule modes compute correct `next_due` (Jan 31 + 1 month clamps; calendar anchor never drifts on late completion); complete writes a completion, decrements inventory, advances `next_due`; snooze suppresses due/overdue until date and the tick clears expired snoozes idempotently; inspect_plan_do stages advance and re-arm; sensors count the union (new tasks + legacy labeled chores) with unchanged attr keys; disabling the module removes all ~19 services + 2 sensors; `offer_task` publishes and reverts on 0 deliveries. All via Dev Tools → Services.

### A5 — Migration + seam removal
**Files:** `maintenance_mixin.py` or `data_store.py` (`_async_migrate_maintenance_chores`); `__init__.py` (call site); `chores_mixin.py`, `card_shaper_mixin.py`, `card_model.py` (seam removal); `const.py` (`DEFAULT_CATEGORY_LABELS`); `_run_record_migrations` (label strip); `src/card/rooms/maintenance.js` (+ dispatch) button removal; release notes.
**Acceptance:** fixture store with 3 Maintenance chores (one pending-instance, one with 5 completed instances, one one-time) → after load: chores absent, 3 tasks with correct `next_due`/`last_completed`, ≥5 synthesized completions, `history` byte-identical, pre-migration backup file exists; second restart migrates 0, duplicates nothing; importing a pre-A5 export re-triggers the migration cleanly; HOME CARE room renders the same items; `grep _chore_is_maintenance` is empty.

### A6 — Chores/Rewards gating audit (added by the A1 all-gateable decision)
**Files:** `services_chores.py` / `services_rewards.py` (verbatim block extractions); `sensor.py` (claimable + widget sensors under chores); `tasks_mixin.py` notification senders gated; `tick_mixin.py` (streaks/ranks under chores, subscriptions under rewards); needs_attention per-term gating (`sensor.py:353` + `card_model.py`); card degradation (personal pages hide chore sections/rank chips when chores off — `themes/_shared.js` + theme templates gate on `modules.chores`; store rail on `modules.rewards`; admin tabs hidden per module); remove the "experimental" flag from the toggles.
**Acceptance:** chores off → no chore services; kid pages show points balance + rewards only; ranks/streaks frozen at stored values; tick generates no instances, no penalties fire; needs_attention omits approvals/claimables; widget sensors + checklist notifications gone. Rewards off → spend surfaces gone, subscriptions tick skipped, redemption/group/sub terms omitted. Both off → people/points/history/meals/maintenance fully functional. Re-enable lossless in all combinations.

---

## 7. Top risks

1. **Bus deadlock / double-save** — a subscriber calling a locked public store method from inside a publish. *Mitigation:* the locking convention (§2) lives in the `FamilyHubBus` docstring and every session brief; subscribers may only be `_apply_*` internals; A2 acceptance includes a publish-under-lock test.
2. **Import swaps in bad data.** *Mitigation:* validate-migrate-verify on a candidate copy before any swap; mandatory history equality; automatic pre-import backup; `dry_run`.
3. **Chores gating regression** (A6 blast radius — ranks/streaks/subscriptions/notifications interweave the tick). *Mitigation:* dedicated session; default-enabled = zero behavior change until toggled; explicit both-off acceptance matrix; toggles marked experimental until A6 lands.
4. **Recurrence mis-mapping in the chore migration** (multi `days_of_month`, rotation pools, multi-claim). *Mitigation:* explicit mapping table (§5); dropped fields logged per chore; pre-migration export enables manual repair; presence-based idempotency makes re-runs safe.
5. **Card contract drift** — `needs_attention.native_value`, maintenance attr keys, tile `getStats`. *Mitigation:* frozen key lists (§4) copied into the A4/A5 briefs; acceptance asserts exact key sets.

## 8. Scope flags (flagged, not silently added/narrowed)

- `photo` on completions = string field only; upload plumbing out of Phase A.
- Funds in A4 = manual ledger only; inflation / target-balance-today math is v0.8.x (E2).
- Scope says "assign"; A4 ships `offer_task` / `revoke_task` (bus publish, designed no-op until D5). True person-assignment with points IS the D5 bridge.
- Module flags excluded from the `export_data` payload (informational in `meta.modules` only, never re-applied on import).
- A6 is net-new work vs the original Phase A map (one extra sitting) — consequence of the all-gateable decision.
- Chores rename (Quests / Missions / Task Board) remains open per scope §12 — decide before v0.8.0 strings work; does not block A2–A6.

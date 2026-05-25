# Family Hub — Architecture

> Stable structural reference for the integration. Read this when designing
> new features or reasoning about cross-module data flow. Mutable session
> state (current work, bugs, decisions) lives in [CLAUDE.md](CLAUDE.md),
> [ROADMAP.md](ROADMAP.md), [BUGS.md](BUGS.md), and [DECISIONS_LOG.md](DECISIONS_LOG.md).

---

## 1. Repository layout

```
family-hub/
├─ custom_components/family_hub/        Home Assistant custom integration (Python backend)
│  ├─ __init__.py                        Setup / unload entry points; static path + Lovelace resource registration
│  ├─ manifest.json                      HA integration manifest (domain, version, deps=[frontend, http])
│  ├─ const.py                           All shared constants (DOMAIN, statuses, service names, chore/recurrence types)
│  ├─ config_flow.py                     Three-step UI config flow (family name → first parent → kids)
│  ├─ coordinator.py                     DataUpdateCoordinator: 30s poll → daily_tick + notifications + summary
│  ├─ data_store.py                      Single-JSON data layer; all CRUD + tick + migration logic (~3.9 KLOC)
│  ├─ sensor.py                          Per-person sensors + 4 globals; attribute payloads consumed by the card
│  ├─ services.py                        ~37 HA services that wrap data_store mutations
│  ├─ strings.json / translations/en.json Config-flow translation strings
│  └─ www/                               Deployed card bundles (served as static path)
│     ├─ family-hub-card.js              Stub IIFE (~7 KB) — registers wrapper element, lazy-imports body
│     └─ family-hub-card-body.js         Heavy ESM bundle (~560 KB) — full card implementation
│
├─ src/                                  Card source — built into www/ by `npm run build`
│  ├─ main.js                            Stub entry: defines <family-hub-card> + editor wrappers, lazy-loads body
│  ├─ body.js                            Body entry: imports FamilyHubCard + editor, registers *-impl elements
│  ├─ build-id.js                        Auto-generated per build (`gen-build-id.mjs`); BUILD_ID timestamp
│  └─ card/
│     ├─ FamilyHubCard.js                Web Component shell — lifecycle, dirty-check, render orchestration,
│     │                                   modal management, drag-drop reorder, AbortController listeners
│     ├─ constants.js                    VERSION, FH_SENSORS, HISTORY_META, inline SVG icon set (`I`),
│     │                                   CHORE_TEMPLATES quick-add library
│     ├─ css.js                          Full stylesheet exported as string; injected into shadow DOM
│     ├─ utils.js                        Pure helpers: escHTML, escAttr, slug, ini, cap, fPts, fUSD, daysLabel, daysLabelColor, opts, weekdayChips, relTime, fmtShortDate, groupHistorySkipped
│     ├─ bracketed.js                    Corner-frame panel decoration helper
│     ├─ icons.js                        Tabler-based chore icon library (FH_ICONS), FH_ICON_META, choreIcon()
│     ├─ editor.js                       FamilyHubCardEditor — Lovelace visual editor element
│     ├─ dispatch.js                     Central data-act event router — ~87 cases, all click/form handlers
│     ├─ modals.js                       All modal HTML builders (mAddTask, mChoreForm, mEditPerson, etc.)
│     ├─ print-chore-list.js             Opens self-contained printable HTML in a new tab (v0.6.3 item 1)
│     │
│     ├─ modes-home.js                   Thin dispatcher → hub-skins/<key>.render(card)
│     ├─ modes-personal.js               Thin dispatcher → themes/<key>.render(card, person)
│     ├─ modes-chores.js                 Mission Control / Chores HQ — grouped agent roster + intel sidebar
│     ├─ modes-admin.js                  Admin shell — sidebar/bottom-nav, six sections (today/family/tasks/rewards/history/settings)
│     │
│     ├─ hub-skins/                       Home page (Command Center) skins — pluggable registry
│     │   ├─ index.js                    getHubSkin(key) lookup (selection: cfg.hub_skin → naAttr.hub_skin → "classic")
│     │   └─ classic.js                  Default home: header + agent tiles + room tiles + today strip
│     │
│     ├─ rooms/                          Drill-down rooms registry
│     │   ├─ index.js                    ROOMS array — id/label/sub/icon/accent/status/render/getStats per room
│     │   │                               Live rooms: chores (delegates to ../modes-chores.js — no rooms/chores.js file),
│     │   │                               maintenance. Coming-soon: meals, smarthome, calendar.
│     │   ├─ maintenance.js              Home Care drill-down (live)
│     │   ├─ meals.js                    Meals room (coming-soon placeholder, v0.7.0)
│     │   ├─ smarthome.js                Smart Home room (coming-soon, v0.9.0)
│     │   └─ calendar.js                 Calendar room (coming-soon, v0.8.0)
│     │
│     └─ themes/                         Per-person personal-page themes — pluggable registry
│         ├─ index.js                    getTheme(key) lookup
│         ├─ _shared.js                  Cross-theme helpers: htmlChoreRow, htmlRankBar, htmlSuccessStreak,
│         │                                getActiveStreaks, groupByCategory, htmlGoalBanner, htmlRailGoal,
│         │                                htmlStreakFreezeChip, htmlDailyProgress, htmlGroupContributorBars,
│         │                                htmlChipInBtn, htmlGroupProposalBanner, storeItemIcon, etc.
│         ├─ classic.js                  Default dark theme — fallback for any unknown theme_key
│         ├─ engineer.js                 Engineer (Jim) — blueprint KPIs aesthetic
│         ├─ baker.js                    Baker (Shannon) — paper/parchment, order log rail
│         ├─ dinos.js                    Dinos (Spencer, 12) — specimen stats rail
│         ├─ hp.js                       Harry Potter (Olivia, 11) — OWL-grade scroll rail
│         └─ dbz.js                      Dragon Ball Z (Jackson, 7, pre-reader) — power-level rail, accessibility test bed
│
├─ docs/design-reference/                 JSX/HTML design mockups (NOT production code) — read before touching themes
├─ gen-build-id.mjs                      Pre-build step — writes src/build-id.js with timestamp
├─ package.json                          esbuild scripts: build:stub (IIFE), build:body (ESM), build (both)
├─ hacs.json                             HACS-detection metadata (name, domain, HA min version, version)
├─ CLAUDE.md                             Session-time operational state (current status, handoff, checklists)
├─ ROADMAP.md                            Active scope + next-version plans + long-term roadmap
├─ RELEASE-NOTES-v*.md                   Per-release notes
└─ README.md / LICENSE
```

---

## 2. End-to-end data flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  HA event loop (every 30s) → coordinator._async_update_data()                │
│                                                                              │
│    1. coordinator.store.async_daily_tick()                                  │
│         • catch-up loop for any missed days (uses settings.last_tick_date)  │
│         • generates fresh task instances for due chores                     │
│         • skips incomplete instances of prior-cycle chores (applies penalty)│
│         • processes expirations (one-time + claimable past expires_after)   │
│         • processes daily penalties, allowances, completion-streak ranks    │
│         • advances rotations (daily / weekly / per_instance)                │
│         • trims history (30d) and terminal task_instances (60d)             │
│    2. coordinator.store.async_check_notifications()                         │
│    3. return store.get_summary()                                            │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  Sensors materialize attribute payloads (sensor.py)                          │
│                                                                              │
│   sensor.family_hub_<name>           — per-person, dynamic                  │
│   sensor.family_hub_needs_attention  — global admin payload                 │
│   sensor.family_hub_maintenance_due  — home-care drill-down                 │
│   sensor.family_hub_maintenance_overdue                                     │
│   sensor.family_hub_claimable_tasks  — claimable pool + all_tasks (cmd ctr) │
│   sensor.family_hub_today            — placeholder for Calendar room        │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ state.last_updated bump
┌──────────────────────────────────────────────────────────────────────────────┐
│  FamilyHubCard (in browser, lazy-loaded body bundle)                         │
│                                                                              │
│   set hass(hass) → _maybeRender()                                            │
│      → dirty-check FH_SENSORS by last_updated (NOT last_changed)             │
│      → freeze re-render when modal or admin inline panel is open             │
│      → _doRender(): builds shadow DOM (style + .fh-card + optional modal)    │
│                                                                              │
│   Rendering branches by cfg.mode:                                            │
│      command_center → modes-home.htmlHome → hub-skins/classic.render         │
│      personal       → modes-personal.htmlPersonal → themes/<key>.render      │
│      admin          → modes-admin.htmlAdmin (sidebar shell + section body)   │
│      maintenance    → modes-maintenance.htmlMaintenance                      │
│                                                                              │
│   command_center has nav state (_view: "home" | "person:<id>" | "room:<id>") │
│   with _backStack for ← back navigation.                                     │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ user clicks data-act element
┌──────────────────────────────────────────────────────────────────────────────┐
│  Delegated shadow-root click handler (attached ONCE in connectedCallback)    │
│   → dispatch(act, el, card) — single switch in card/dispatch.js              │
│      → reads form values via sr.getElementById(id).value                     │
│      → card._svc(service, data) wraps hass.callService(DOMAIN, service, …)   │
│      → on error: walks {body,error,message} shapes, alerts the user         │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ HA service call
┌──────────────────────────────────────────────────────────────────────────────┐
│  services.py handler (one per service)                                       │
│   → store.async_<mutation>(...)                                              │
│   → coordinator.async_refresh() — propagates new state to all sensors       │
│   → optional persistent_notification (e.g. approval needed)                 │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
                  data_store.async_save() (lock-guarded atomic write)
```

---

## 3. Module responsibilities

### Python backend (`custom_components/family_hub/`)

| File | Owns |
|---|---|
| `__init__.py` | `async_setup` registers `/family_hub` static HTTP path. `async_setup_entry` creates the `FamilyHubDataStore`, the `FamilyHubCoordinator`, registers all services, forwards to the sensor platform, cleans up stale entities, and registers the Lovelace card resource (with mtime-based cache-bust). `async_unload_entry` removes every service whose name appears under the DOMAIN. `async_remove_entry` intentionally preserves the data file. |
| `const.py` | Single source of truth for: DOMAIN, VERSION, config keys, chore types (`assigned`/`claimable`/`reminder`), recurrence types, claimable subtypes, task statuses, redemption statuses, group-reward proposal statuses, history event types, retention windows (30d history / 60d task instances), sensor + service names, weekday list (0=Monday), card URL constants (`CARD_URL_PATH = "/family_hub"`). |
| `config_flow.py` | 3-step UI: family name + ppd → first parent → kids (CSV or skip). Storage path defaults to `config/family_hub_data.json`. Single instance only (unique_id = DOMAIN). |
| `coordinator.py` | Thin `DataUpdateCoordinator` subclass. Owns `.store`. Calls `store.async_daily_tick()` + `store.async_check_notifications()` on each 30s poll. Tick date persisted inside data file (`settings.last_tick_date`), so missed days get caught up after HA downtime. |
| `data_store.py` | All persistent state lives here. Single JSON file. Methods grouped: load/save + migration; settings; rank ladder; rotation; streaks; people CRUD; chores CRUD; task instances + statuses (complete/approve/deny/claim/excuse/reject/mark-complete); daily tick (`_async_tick_for_date`, `_skip_incomplete_instances`, `_async_apply_daily_penalties`, `_async_expire_tasks`); allowances; success-rate completion streaks; group rewards (propose/respond/approve/decline/chip-in/redeem); redemptions; history (append + trim + enriched `get_history_for_card`); summary + `get_*_for_card` accessors that shape data for the frontend. All mutations are lock-guarded; saves are atomic via `.tmp` + `os.replace`. |
| `sensor.py` | Entity classes: `FamilyHubPersonSensor` (one per active person, dynamic add/remove), and five globals: `FamilyHubMaintenanceDueSensor`, `FamilyHubMaintenanceOverdueSensor`, `FamilyHubNeedsAttentionSensor`, `FamilyHubClaimableTasksSensor`, `FamilyHubTodaySensor` (placeholder). `async_setup_entry` stores `add_person_sensor` / `remove_person_sensor` callables in `hass.data` so `services.py` can register sensors at runtime without an HA restart. |
| `services.py` | Registers ~37 services. Each handler validates its voluptuous schema, calls the corresponding `store.async_*` method, then `await coordinator.async_refresh()`. Service inventory: complete/claim/approve/deny/excuse/reject/mark-complete tasks; add/update/delete chores; add/update/delete/hard-delete store items; request/approve/decline redemptions; propose/respond/approve/decline group proposals; chip-in / redeem group reward; add/update/remove person; add task (one-time); award/deduct points; update settings; export backup; force_daily_tick; rebuild_data; set_streak; set_completion_streak; set_rank. |

### Frontend (`src/card/`)

| File | Owns |
|---|---|
| `FamilyHubCard.js` | The Web Component shell. Holds all UI state (`_modal`, `_celebration` {name,streak} milestone overlay, `_filter`, `_tab`, `_adminSec`, `_view`, `_backStack`, `_flashing`, `_pendingSubmit`, `_expandedDescs`, `_expandedSkippedDates`, `_histFilter`, `_choreFilter`, `_adminSelectedChoreId`, `_adminSelectedItemId`, `_adminSort`, `_adminCollapsedCats`, `_choreFormTab`, `_adminSelectedItemId`, `_adminSortItems`, `_adminCollapsedRewardCats`, `_storeItemFilter`, drag state). Attaches ALL event listeners once in `connectedCallback` via `AbortController`. Implements the dirty-check (`_maybeRender`) and renders via `_doRender(force)`. Manages modal lifecycle (`_buildModal`, `_closeModal`, `_syncModalUI`). Drag-and-drop reorder for chores / store-items / category chips with above/below insertion line + sort_order bisection + reindex when gap collapses. Service-call wrapper (`_svc`) catches Promise rejection and alerts the user. Retry timer for slow Echo Show cold boot. |
| `main.js` | Stub entry. Registers `<family-hub-card>` (FamilyHubCardWrapper) and `<family-hub-card-editor>` (FamilyHubCardEditorWrapper). Both wrappers lazy-import `BODY_URL = /family_hub/family-hub-card-body.js?v=VERSION&b=BUILD_ID`. Wrapper paints `LOADING_HTML` immediately; on body resolution, instantiates the real `*-impl` element and forwards buffered `setConfig` / `hass`. |
| `body.js` | Body entry. Registers `<family-hub-card-impl>` (FamilyHubCard) and `<family-hub-card-editor-impl>` (FamilyHubCardEditor). |
| `build-id.js` | Auto-written each `npm run build`. Exports `BUILD_ID` timestamp string. |
| `constants.js` | VERSION (must match Python + manifest + hacs.json), FH_SENSORS for dirty-check, WEEKDAY_LABELS (Mon-first), HISTORY_META mapping, inline-SVG icon set `I` (check/plus/edit/trash/bell/award/etc.), CHORE_TEMPLATES quick-add library. |
| `css.js` | Full stylesheet as string. Defines `--fh-*` design tokens (radius, gap, color, typography scale with 12px floor), font imports, `.fh-card` container with `container-type: inline-size`, all component styles (`.fh-row`, `.fh-chip`, `.fh-ad-*` admin namespace, `.fh-drop-above/below` drag indicators), per-theme overrides, kid-mode CSS modifier (`.kid-large`), responsive `@media` rules. |
| `utils.js` | Pure helpers — `escHTML`, `escAttr`, `slug`, `ini`, `cap`, `fPts`, `fUSD`, `daysLabel`, `daysLabelColor`, `opts` (HTML option builder), `weekdayChips` (chip-input row builder), `relTime`, `fmtShortDate`, `groupHistorySkipped`. |
| `icons.js` | `FH_ICONS` (~80 Tabler stroke SVGs), `FH_ICON_META` (picker grid metadata: key/label/category), `FH_REWARD_ICON_META`, `choreIcon(key, color, size)` returns SVG string or colored fallback dot. |
| `bracketed.js` | `bracketed(content, opts)` wraps content in a corner-frame panel — used widely in themed personal pages. |
| `dispatch.js` | Central data-act router. ~87 cases. Navigation (nav/nav-back/filter/tab/admin-sec); admin chore/store table (select-row / close-panel / sort / toggle-cat); chore form tab switch (CSS-only swap, preserves form state); task lifecycle (complete/approve/deny/excuse/mark-complete/reject); redemption + chip-in + group proposal lifecycle; CRUD form submits (`ok-add-*`, `ok-edit-*`, `ok-remove-*`); icon pick/upload; quick-add template; settings save; rank PPD ladder save; rotation pool editor. Also exports `handleIconFileSelection` used from the change handler in `FamilyHubCard`. |
| `modals.js` | All modal HTML builders. Wrapping helper `mWrap(title, body, okLabel, okAct)`. Form-field helpers reused by modal + inline panel: `choreFormFields` (tabbed: details/schedule/points/reminders), `storeItemFormFields`, `iconPickerGrid`, `iconPickerSection`, `rewardIconPickerGrid`, `rewardIconPickerSection`, `rotationPoolEditor`, `multiPersonCheckboxes`. Modals: `mPointAdjust`, `mAddTask`, `mChoreForm`, `mAddStoreItem`, `mEditStoreItem`, `mAddPerson`, `mEditPerson`, `mConfirmRemovePerson`, `mEditStreaks`, `mEditSettings`, `mClaim`, `mAddReminder`, `mChipIn`. |
| `editor.js` | `FamilyHubCardEditor` — Lovelace visual editor element. Reads `sensor.family_hub_needs_attention` to populate person/room dropdowns. Fires `config-changed` events to HA's editor pane. |
| `print-chore-list.js` | `openPrintableChoreList(naAttr)` builds a self-contained HTML doc (no external deps) and opens it in a new tab via `window.open()`, with a blob-URL same-tab fallback for popup blockers. Grouped by assignee + claimable/reminder sections. Print stylesheet with `page-break-inside: avoid`. |
| `modes-home.js` | `htmlHome(card)` dispatches to the active hub skin. Exports `htmlNavBack(label)` (back-arrow bar prepended to every non-home view) and `htmlComingSoon(room)` (coming-soon placeholder). |
| `modes-personal.js` | `htmlPersonal(card)` resolves the person's theme via `getTheme(person.theme_key)` and delegates rendering. |
| `modes-maintenance.js` | Standalone maintenance card-mode (used by Lovelace cards configured as `mode: "maintenance"`). |
| `modes-chores.js` | `htmlChores(card)` — Mission Control / Chores HQ. Grouped agent roster + main column (BREACH section, category groups one-row-per-chore with per-assignee mini buttons) + intel sidebar (read-only alerts + open ops). Includes phantom-row retention via `card._mcLastTasks` for ~35s pending-state echo. |
| `modes-admin.js` | `htmlAdmin(card)` — admin shell. Sidebar nav at ≥1100px / bottom-nav otherwise. Six sections: today (unified queue + activity), family (people), tasks (chores), rewards (store items, v0.6.3), history (activity log with skipped-day grouping), settings. Master-detail layout for tasks and rewards at ≥1280px (list + inline editor panel). Uses `m-*` form IDs shared with modals. |
| `hub-skins/classic.js` | Default Command Center home page: header + agent tiles row + room tiles grid + today strip. Uses `card._people()`, `ROOMS`, `getTheme()`. |
| `rooms/<id>.js` | Drill-down room renderers. Live: maintenance, chores (via modes-chores). Coming-soon: meals, smarthome, calendar. |
| `themes/_shared.js` | Cross-theme primitives. Most important: `htmlChoreRow(t, cfg, person, card, opts)` — every adult theme row goes through this; themes only supply a `<theme>RowConfig` (~10 keys) + a `.fh-row--<themeKey>` CSS color block. Other shared: `htmlRankBar`, `htmlSuccessStreak`, `getActiveStreaks` (unions per-chore + person streaks), `computeStreakProgress` (next-milestone bar), `groupByCategory(tasks, catOrder)`, `htmlGoalBanner` / `htmlRailGoal` / `htmlGoalToggleBtn` (store goal), `htmlStreakFreezeChip`, `htmlDailyProgress`, `htmlGroupContributorBars` / `htmlChipInBtn` / `htmlGroupProposalBanner` (group rewards), `htmlStoreItemLimit` (rate-limit display), `storeItemIcon`, `htmlAddReminderCTA`, rank helpers (`getEffectiveRank`, `getNextRankByIndex`, `getWeeklyPts`). |
| `themes/<key>.js` | Each theme exports `{ key, tint, sigil, ranks, handlesNavigation, rankTitle, homeTileSubLabel, render }`. `render(card, person)` returns the full personal-page HTML (header + tabs + content). `dbz` is the only theme with `handlesNavigation: true` (renders its own ← back button). |

---

## 4. Build process

```
npm run build
  ├─ node gen-build-id.mjs           writes src/build-id.js with current timestamp
  ├─ esbuild src/main.js  → www/family-hub-card.js       (IIFE,  target chrome80)
  └─ esbuild src/body.js  → www/family-hub-card-body.js  (ESM,   target chrome80)
```

- **Stub (`family-hub-card.js`)** — ~7 KB. Registers `<family-hub-card>` and `<family-hub-card-editor>` placeholder elements synchronously so Lovelace's card-picker sees them on first paint. Paints `LOADING_HTML` immediately. Lazy-imports the body bundle as `import('/family_hub/family-hub-card-body.js?v=VERSION&b=BUILD_ID')`. The query string busts the browser cache on every release AND every dev build (BUILD_ID is regenerated each `npm run build`).
- **Body (`family-hub-card-body.js`)** — ~560 KB. The full card implementation. Registers `<family-hub-card-impl>` and `<family-hub-card-editor-impl>` once it resolves. The stub then instantiates one inside its own shadow DOM and forwards buffered `setConfig` / `hass`.
- **Deploy via Samba**: copy both files (and any edited `.py`) to `\\10.0.0.41\config\custom_components\family_hub\`. Never sync `family_hub_data.json` — it's user data.
- **Reload semantics**:
  - Python only → reload integration (Settings → Devices & Services → Family Hub → Reload). No HA restart.
  - JS only → browser hard refresh (Ctrl+Shift+R).
  - Both → reload + hard refresh + call `force_daily_tick` from Dev Tools → Services to exercise tick paths immediately.

---

## 5. HA integration lifecycle

```
HA starts                                  HACS/manual install + restart
  │
  └─ async_setup(hass, config)            once per process
       ├─ hass.data.setdefault(DOMAIN, {})
       └─ http.async_register_static_paths([
            StaticPathConfig(CARD_URL_PATH="/family_hub", _WWW_PATH, cache_headers=False)
          ])     ← makes /family_hub/*.js fetchable from the browser

User completes config_flow OR reload
  │
  └─ async_setup_entry(hass, entry)       runs at HA start + every integration reload
       ├─ FamilyHubDataStore(hass, storage_path).async_load()    load JSON + migrate
       ├─ store.async_update_settings(family_name, points_per_dollar)
       ├─ seed initial_people (first run only)
       ├─ FamilyHubCoordinator(hass, store).async_config_entry_first_refresh()
       ├─ stash hass.data[DOMAIN][entry_id] = {coordinator, store, person_entities, add_person_sensor, remove_person_sensor}
       ├─ async_setup_services(hass, coordinator)                 register ~37 services
       ├─ hass.config_entries.async_forward_entry_setups(entry, [Platform.SENSOR])
       │     → sensor.async_setup_entry creates initial person sensors + 5 globals,
       │       and writes add_person_sensor / remove_person_sensor callables into hass.data
       ├─ _async_cleanup_stale_entities(...)                       prune entities not in the expected set
       └─ _async_register_card_resource(hass)                      Lovelace resource: /family_hub/family-hub-card.js?v=<mtime>
                                                                    falls back to add_extra_js_url if Lovelace storage unavailable

async_unload_entry                          on reload / removal
  └─ unload SENSOR platform + remove every service registered under DOMAIN + drop hass.data entry

async_remove_entry                          intentional: preserve the JSON data file
```

**Person add/remove without restart:** `services.handle_add_person` calls `store.async_add_person`, then invokes the `add_person_sensor(person_id)` callback that `sensor.py` stored in `hass.data`. The callback constructs a new `FamilyHubPersonSensor` and calls `async_add_entities([...])` immediately. Removal flips `active=False` in the data store; the sensor's `extra_state_attributes` returns `{}` for inactive people, and stale-entity cleanup prunes the entity on next reload.

---

## 6. Frontend architecture (in-browser)

### Custom-element lifecycle

```
constructor()
  • super() + this.attachShadow({mode:"open"})
  • initialize ALL UI state to defaults
  • NO appendChild / setAttribute / innerHTML on light DOM (HTML spec forbids)
  • shadow-DOM writes ARE allowed because shadow content isn't "children"

connectedCallback()
  • create AbortController
  • attach ALL delegated event listeners (click, change, dragstart/over/leave/drop/end)
    via { signal } so disconnectedCallback can rip them out

setConfig(cfg)
  • validate mode + person + initial_view
  • apply initial_view once (first setConfig call only)
  • _doRender(force=true)

set hass(h)
  • store hass
  • _maybeRender() — dirty-check then optionally _doRender(false)
  • _scheduleRetryIfNeeded() — handles slow cold-boot on Echo Show 15

disconnectedCallback()
  • abortCtrl.abort()  → frees all listeners
  • clear retry timer
```

### Render pipeline

```
_doRender(force)
  1. build <style> element from CSS export + --fh-text-scale override
  2. build .fh-card <div>
  3. switch on cfg.mode → write innerHTML from
        _htmlCommandCenter (which dispatches via _view) | htmlPersonal | htmlAdmin | htmlMaintenance
  4. wipe shadow root, append <style>, append .fh-card
  5. if _modal is set, append a SECOND independent <div class="fh-modal-bg"> from _buildModal()
  6. _syncModalUI() — show/hide conditional modal sub-sections from current form-control values
```

### Dispatch system

- Every interactive element has `data-act="<action-key>"` (sometimes also `data-id`, `data-pid`, etc.).
- One delegated click handler in `connectedCallback` reads `closest("[data-act]")` and calls `dispatch(act, el, card)`.
- The single `switch (act)` in `dispatch.js` covers all ~100 actions.
- Form values are read at dispatch time via `sr.getElementById(id).value` / `.checked` — no two-way binding.
- Service calls go through `card._svc(service, data)` which wraps `hass.callService(DOMAIN, …)` and surfaces errors as alerts.

### Modal management

- `card._modal = { type, data }` — null when closed.
- `_buildModal()` returns a new `<div class="fh-modal-bg">` containing the modal HTML from `_modalHTML()`.
- The modal is appended to the shadow root as a **separate DOM node**, not part of `.fh-card.innerHTML`. Background re-renders rebuild `.fh-card` but never touch the modal node — open modals survive coordinator polls.
- Background click on the dim layer closes the modal (target === bg).
- `_closeModal()` resets `_modal = null` and `_choreFormTab = "details"`, then `_doRender(true)`.

### Milestone celebration overlay

- `card._celebration = { name, streak }` — set when a streak milestone is hit.
- Like `_modal`, the celebration overlay is appended to the shadow root as a **separate DOM node**, so background re-renders leave it intact.
- Cleared on any tap.

### Re-render freeze / dirty-check

- `_maybeRender()` only fires `_doRender` when at least one of `FH_SENSORS` has a new `last_updated` timestamp, OR any per-person sensor has a new `last_updated`.
- **Uses `last_updated` deliberately, NOT `last_changed`** — HA bumps `last_changed` only when state value differs, but most Family Hub changes are attribute-only.
- `_maybeRender()` short-circuits and returns when:
  - `this._modal` is set (modal open — protects form state)
  - `this._adminSelectedChoreId` is set (chore inline editor panel open)
  - `this._adminSelectedItemId` is set (reward inline editor panel open)

### Drag-and-drop reorder

- Rows carry `data-drag-id` and `data-drag-type` (`"chore"` / `"store-item"` / `"category"`).
- `dragover` adds `.fh-drop-above` or `.fh-drop-below` to the target based on cursor vs midpoint. Horizontal lists (category chips) use cursor X; vertical use Y.
- `drop` computes new `sort_order` by bisecting between the neighbors of the drop site.
- If the bisected gap is below `GAP_THRESHOLD` (0.01), the full list is reindexed to `(i+1)*10` spacing and updates are pushed via `update_chore` / `update_store_item` for each row.
- Categories don't have numeric `sort_order` — they're stored as an ordered list and pushed wholesale via `update_settings(category_labels=...)`.

---

## 7. CSS / theming system

- **All styles in one exported string** (`css.js`). No build-time CSS pipeline.
- **Design tokens** on `:host`:
  - Colors: `--fh-bg`, `--fh-surface`, `--fh-border`, `--fh-text`, `--fh-text-sec`, `--fh-overdue`, `--fh-warning`, `--fh-success`, `--fh-accent`.
  - Radii / gaps / padding scaled set.
  - Typography scale tied to `--fh-text-scale` (cfg-driven Small .9 / Default 1 / Large 1.25 / XL 1.5):
    `--fh-text-xs` (12px FLOOR), `--fh-text-sm` (14), `--fh-text-base` (16), `--fh-text-md` (18), `--fh-text-lg` (22), `--fh-text-xl` (28), `--fh-text-2xl` (36).
  - Fonts: `--fh-font-heading` (Bricolage Grotesque), `--fh-font-mono` (JetBrains Mono), `--fh-font-body` (Manrope).
- **Namespaces**:
  - `.fh-*` — general card styles.
  - `.fh-ad-*` — admin shell only (do NOT reuse in theme CSS).
  - `.fh-row--<themeKey>` — per-theme row colour overrides applied on top of shared `htmlChoreRow` markup.
  - `.fh-XX-page` — themed personal-page root class (one per theme).
- **Layout**:
  - `.fh-card` has `container-type: inline-size`, but actual layout switching uses **viewport `@media`** queries (HA sectioned dashboards are column-constrained even on desktop; `@container` only works in Panel views).
  - Themed personal pages use a `body.has-rail` two-column grid at `@media (min-width: 900px)` — content `1fr` + rail `480px`. Single column below. Rail only on the Tasks tab.
- **Kid mode**: `child_mode=true` on the person record adds `.kid-large` to the page wrapper. Per-theme CSS flips the row list to a card grid. **Same render path / DOM / data** — different layout. Themes keep their personality.
- **Rank bar**: themable via `--fh-rb-track`, `--fh-rb-drop`, `--fh-rb-status` CSS vars on `.fh-rank-bar-*`. White-on-dark defaults; paper themes (`.fh-dn-page`, `.fh-bk-page`, `.fh-hp-page`) override to sepia; DBZ rail panels override to ink-on-white.

---

## 8. Static HTTP path & how the frontend gets served

- `custom_components/family_hub/__init__.async_setup` registers `/family_hub` → `<integration>/www/` via `StaticPathConfig(..., cache_headers=False)`.
- Both bundle files therefore live at:
  - `/family_hub/family-hub-card.js`
  - `/family_hub/family-hub-card-body.js`
- `cache_headers=False` ensures the browser always fetches fresh files; the `?v=<mtime>` cache-bust on the Lovelace resource URL is additional belt-and-braces.
- `_async_register_card_resource` registers the stub URL as a Lovelace `module` resource (same storage HACS uses). Re-registration on every `async_setup_entry` keeps the URL in sync with the deployed file's mtime, so a Samba copy is enough to get the new bundle picked up — no HA restart, no manual resource editing.
- Hardcoded `BODY_URL` in `main.js` is the body's path; we **never** scan `<script>` tags to derive a base URL (HA loads module resources via `import(url)`, no `<script>` tag is ever inserted).

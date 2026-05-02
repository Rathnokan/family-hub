# Family Hub — Project Notes
> Living document. Update this as decisions are made and phases complete.
> Always fetch this file fresh from GitHub at the start of each session.
> Repo: https://github.com/Rathnokan/family-hub

---

## Current Status
**Version:** v0.2.0 backend complete — not yet released (no GitHub release tag cut)
**Phase:** Phase 1 complete — Phase 2 (custom Lovelace card) in progress
**Integration:** Installed in HA via HACS, working on v0.1.1, backend files committed but no release tag yet

---

## What Was Completed Last Session (v0.2.0 backend)

All Python backend files have been written and committed to GitHub. The next session's only job is writing `www/family-hub-card.js`.

### Files changed in v0.2.0 (all committed):
| File | Change |
|---|---|
| `__init__.py` | Fixed static path registration (now uses `async_register_static_paths` + `StaticPathConfig`), moved Lovelace resource registration to `async_setup` with retry loop, removed deprecated patterns |
| `manifest.json` | Added `"frontend"` and `"http"` to dependencies (required for card registration) |
| `const.py` | Added `SERVICE_DEDUCT_POINTS`, `CONF_SHOW_DOLLAR_VALUE_TO_KIDS`, `DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS`, `CARD_JS_FILENAME`, updated card URL constants |
| `data_store.py` | Added `show_dollar_value_to_kids` setting/property, updated `async_update_settings`, added `async_award_bonus_points` (now accepts `dollar_amount`), added `async_admin_deduct_points`, added all card data methods |
| `services.py` | Fixed deprecated `hass.components.persistent_notification` (now uses `hass.services.async_call`), updated `award_bonus_points` schema (accepts `dollar_amount`), added `deduct_points` service, added `update_settings` service |
| `sensor.py` | Expanded person sensor attributes (task lists, store items, `show_dollar_value`, avatar_color), expanded needs_attention sensor (approval queue, redemption queue, people list, active chores, settings) |

### One file still missing — must be created next session:
- `custom_components/family_hub/www/family-hub-card.js` — the entire Lovelace card

---

## Family & Environment
- **3 kids:** Jackson, Olivia, Spencer — individual point balances, private personal stores
- **Parents:** Share one point pool and one private store (NSFW rewards — keep store private from kids)
- **Devices:** Echo speakers throughout house, Echo Show 5, Echo Show 8, Echo Show 15 (kitchen)
- **Kitchen Echo 15:** Has its own restricted HA account ("Kitchen Display") — command center only, no stores
- **HA mobile app:** Used by parents and kids on phones/tablets
- **HA add-ons:** Samba share, File Editor, SSH & Web Terminal, HACS

---

## Architecture Decisions

### Data
- All data in one JSON file: `/config/family_hub_data.json`
- Never committed to GitHub (.gitignore excludes it)
- Backup service saves timestamped copies to `/config/family_hub_backups/`

### People model
- Everyone is the same "person" type — kids and parents differ only by `person_type` field
- Parents share one record pool — both earn to same balance, either can approve
- Each person has: `points_balance` (spendable), `points_lifetime` (never decreases)
- `avatar_color` — hex string per person, used as accent color throughout the card

### Task categories
| Category | Description | Points |
|---|---|---|
| `assigned` | Locked to one person, recurring | Yes |
| `claimable` | Anyone grabs it, first come first served | Yes |
| `maintenance` | House tasks — HVAC, gutters, smoke detectors | Optional |
| `personal_reminder` | Per-person recurring reminders — CPAP, contacts, prescriptions | Optional |
| `one_time` | No recurrence, added by anyone, disappears when done | Optional |

### Recurrence options
| Type | Config fields |
|---|---|
| `daily` | none |
| `weekly` | `weekday` (0=Mon, 6=Sun) |
| `every_n_days` | `interval` |
| `every_n_weeks` | `interval` |
| `monthly_on_date` | `day_of_month` |
| `one_time` | none |

### Completion flow
- **Self-reported:** Points awarded instantly on completion
- **Parent-approved:** Goes to pending queue, parent notified, points awarded on approval
- **Next recurrence always generates on schedule regardless of approval status**
- Default: kids = parent-approved, parents = self-reported (all configurable per chore)

### Points & store
- Dollar-to-point rate set once in settings (e.g. 10 pts = $1)
- Store items have a dollar value — points cost calculated automatically
- Store items can also be added by point value directly
- Store structure: common items (all kids see) + personal items (one person only)
- Redemptions always require parent approval before points are deducted
- Lifetime points never decrease — only balance goes down on redemption
- `show_dollar_value_to_kids` setting (default: off) — parents always see dollar value, kids only see it if enabled

### Point adjustments (admin)
- `award_bonus_points` service: accepts `points` (int) or `dollar_amount` (float, auto-converts)
- `deduct_points` service: same parameters — for penalties/corrections. Reduces balance but NOT lifetime total.
- Both available from the admin card with a quick input UI

### Sensors (8 total)
| Sensor | State | Key attributes |
|---|---|---|
| `sensor.family_hub_[name]` × 4 | Point balance | lifetime_points, dollar_value, show_dollar_value, avatar_color, tasks_due_today, tasks_overdue, pending_approval, completed_this_week, completed_total, pending_redemptions, tasks_due_today_list, tasks_overdue_list, tasks_pending_approval_list, store_items |
| `sensor.family_hub_maintenance_due` | Items due in 14 days | overdue, due_this_week, next_item, next_due_date, items (full list) |
| `sensor.family_hub_maintenance_overdue` | Overdue count | items list with days_overdue |
| `sensor.family_hub_needs_attention` | Total parent actions needed | pending_task_approvals, pending_redemptions, overdue_maintenance, approval_queue, redemption_queue, people, active_chores, family_name, points_per_dollar, show_dollar_value_to_kids |
| `sensor.family_hub_claimable_tasks` | Unclaimed task count | tasks (full list), all_tasks (command center list) |

### Services (20 total)
`complete_task`, `claim_task`, `approve_task`, `deny_task`, `add_one_time_task`,
`add_person`, `update_person`, `add_chore`, `update_chore`, `delete_chore`,
`request_redemption`, `approve_redemption`, `decline_redemption`,
`add_store_item`, `update_store_item`, `delete_store_item`,
`award_bonus_points`, `deduct_points`, `update_settings`, `export_backup`

---

## The Card — `www/family-hub-card.js`

### Architecture
- Single self-contained JavaScript file — no build step, no dependencies
- Registers as `custom:family-hub-card` in the Lovelace card picker
- Written using the Web Components / LitElement pattern (same as HA's own cards)
- Auto-registered as a Lovelace resource by `__init__.py` on startup
- Served from `custom_components/family_hub/www/` at `/family_hub/family-hub-card.js?v=VERSION`

### Four modes — one card
```yaml
type: custom:family-hub-card
mode: command_center          # Kitchen Echo Show 15

type: custom:family-hub-card
mode: personal
person: jackson               # Person's name (lowercase), or person_id

type: custom:family-hub-card
mode: maintenance             # Home maintenance dashboard

type: custom:family-hub-card
mode: admin                   # Parents only
```

### Design direction
- **Style:** Material Design 3 inspired — rounded cards, generous spacing, purposeful color
- **Theme:** Follows HA active theme (CSS variables) + per-person accent colors
- **Accent colors:** Each person has an `avatar_color` hex stored in data. Used for: avatar chips, point badges, task row left-border accent, active filter states
- **Typography:** Clean hierarchy — balance number large and prominent, task names readable at a glance
- **Animations:** Subtle — smooth transitions when tasks complete, points change, filter switches
- **Responsive:** CSS container queries — reflows gracefully at any width. No device detection needed.

### Mode specs

#### Command Center (`mode: command_center`)
- Data source: `sensor.family_hub_claimable_tasks` → `all_tasks` attribute
- Person filter chips at top — tap one to show only that person's tasks, tap again to show all
- Filter behavior: **show only that person's tasks, hide everyone else** (not highlight — hide)
- Each task row: person color accent, task name, points badge, check-off button
- Claimable task pool section below assigned tasks
- Overdue tasks shown with red/warning styling, labeled with days overdue
- No store shown — this is a task-only view
- Designed for landscape/wide (Echo Show 15 at 1280×800)

#### Personal Dashboard (`mode: personal`, `person: [name]`)
- Data source: `sensor.family_hub_[name]`
- **Point balance header — big and prominent at top** (this is motivating for kids)
- Show dollar value below balance IF `show_dollar_value` attribute is true
- Tabs or sections: My Tasks | Store | History
- Tasks section: due today first, then overdue, then pending approval status
- Store section: grid of reward items with points cost, "Request" button on each
- Pending redemptions shown with status badge
- Quick "Add Reminder" button for personal_reminder tasks (available to everyone)
- Optimized for portrait/mobile

#### Maintenance (`mode: maintenance`)
- Data source: `sensor.family_hub_maintenance_due` → `items` attribute
- All maintenance + personal_reminder items
- Each row: task name, person (if assigned), days until due / days overdue
- Color coding: red = overdue, amber = due within 7 days, green = upcoming
- "Add Reminder" button for anyone to add their own personal_reminder
- Works at any width

#### Admin (`mode: admin`)
- Data source: `sensor.family_hub_needs_attention`
- Sections:
  1. **Overview** — all people with point balances, quick award/deduct point controls
  2. **Approval queue** — pending task completions with Approve / Deny buttons
  3. **Redemption queue** — pending store requests with Approve / Decline buttons
  4. **Manage chores** — list of active chores, add/edit/delete
  5. **Manage store** — list of store items, add/edit/delete
  6. **Settings** — family name, points/dollar rate, show_dollar_value_to_kids toggle
- Quick point adjustment: input field + person picker → award or deduct, accepts $ or pts
- Add store item: accepts dollar value OR points (auto-converts the other)

### Card data contract
The card reads sensor attributes directly from the HA websocket connection
(`this.hass.states[entityId].attributes`). It never calls the store directly.
It calls services via `this.hass.callService(domain, service, data)`.

Key entity IDs the card uses:
- `sensor.family_hub_[name]` — one per person (name lowercased, spaces → underscores)
- `sensor.family_hub_needs_attention` — admin view
- `sensor.family_hub_maintenance_due` — maintenance view
- `sensor.family_hub_claimable_tasks` — command center

The card discovers people dynamically from the needs_attention sensor's `people` attribute.

---

## Dashboards Planned (Phase 2)

### 1. Command Center — Kitchen Echo Show 15 ✓ (specced)
### 2. Personal Dashboard — Each person's phone/tablet ✓ (specced)
### 3. Home Maintenance Dashboard ✓ (specced)
### 4. Admin Panel — Parents only ✓ (specced)

---

## Update Workflow
1. Claude generates changed files
2. Edit directly on GitHub (pencil / github.dev editor)
3. Bump version in `manifest.json` and `hacs.json`
4. Create GitHub release with new semver tag (e.g. `v0.2.0`)
5. HA → Settings → Updates → update Family Hub → restart
6. Data file untouched — all family data persists

---

## Version History
| Version | Status | Notes |
|---|---|---|
| v0.1.0 | Released | Core integration, sensors, services |
| v0.1.1 | Committed, not released | Auto stale-entity cleanup on startup |
| v0.2.0 | Committed, not released | Card architecture, QC fixes, new services — waiting on card JS |

---

## Known Issues / Tech Debt
- `hacs.json` still shows version `0.1.1` — needs bumping to `0.2.0` before release
- `www/` folder does not exist yet — GitHub won't let you create an empty folder. It will be created when `family-hub-card.js` is committed inside it.
- `strings.json` service field definitions incomplete — services work but lack UI helper fields in Developer Tools. Low priority.

---

## Next Session Checklist
- [ ] Write `custom_components/family_hub/www/family-hub-card.js` — full card, all four modes
- [ ] Update `hacs.json` version to `0.2.0`
- [ ] Cut GitHub release tag `v0.2.0`
- [ ] Update HA via HACS and test full flow end-to-end

---

## Open Questions
- Calendar integration (Google Calendar on dashboards) — deferred, no family calendar currently
- Voice completion via Alexa ("Alexa, tell Home Assistant I did the dishes") — Phase 3+
- Public release prep — deferred until stable

---

## File Structure
```
family-hub/
├── NOTES.md                          ← this file
├── README.md
├── hacs.json
├── .gitignore
├── LICENSE
└── custom_components/
    └── family_hub/
        ├── __init__.py               ← integration setup, static path + Lovelace registration
        ├── manifest.json             ← dependencies: frontend, http
        ├── const.py                  ← all constants, categories, statuses, card URLs
        ├── coordinator.py            ← DataUpdateCoordinator, daily tick (unchanged)
        ├── data_store.py             ← all data operations, card data methods, settings
        ├── sensor.py                 ← 8 HA sensor entities with rich card attributes
        ├── services.py               ← 20 HA service registrations
        ├── config_flow.py            ← setup wizard UI (unchanged)
        ├── strings.json              ← (unchanged, incomplete service fields)
        ├── translations/
        │   └── en.json               ← (unchanged)
        └── www/
            └── family-hub-card.js    ← ⬅ DOES NOT EXIST YET — next session
```

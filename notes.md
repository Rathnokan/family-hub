# Family Hub — Project Notes
> Living document. Update this as decisions are made and phases complete.
> Always read this file at the start of each session — do not rely on memory.
> Repo: https://github.com/Rathnokan/family-hub

---

## IMPORTANT — READ FIRST FOR NEW SESSION

**Current phase: Phase 3-B COMPLETE. Card is ready to deploy. Next is live testing, then Phase 3-C.**

The v0.4.0 backend is complete and deployed (HACS). The card (`family-hub-card.js`)
has been fully rewritten for v0.4.0 and QC-reviewed. It is ready to commit and release.

**The card file to deploy is the one generated this session — do NOT use the v0.3.0
file from GitHub as a baseline any more. Always use the most recently generated
`family-hub-card.js` provided by Claude.**

**Do NOT rewrite or re-examine the backend files.** They are done.

**Owner context:** I do not code. Claude writes all code. Files are committed to
GitHub via the browser editor and deployed via HACS releases.

---

## Current Status

| Item | State |
|---|---|
| **Deployed version** | v0.4.0 backend live; card still on v0.3.0 (pending deploy) |
| **Card** | v0.4.0 card written, QC-reviewed, all bugs fixed — ready to commit |
| **Next task** | Commit card to GitHub, cut v0.4.0 release, deploy via HACS, live test |
| **After testing** | Phase 3-C polish items (see below) |
| **Integration** | Running in HA via HACS |
| **Data file** | `/config/family_hub_data.json` — never touched by updates |

---

## Environment

- **Family:** Parents (Jim + 1), 3 kids: Jackson, Olivia, Spencer
- **Devices:** Echo Show 5, Echo Show 8, Echo Show 15 (kitchen — command_center mode only)
- **HA mobile app:** Parents + kids on phones/tablets
- **HA add-ons:** Samba share, File Editor, SSH & Web Terminal, HACS
- **Kitchen account:** Restricted HA account "Kitchen Display" — sees command_center mode only

---

## Update Workflow

1. Claude generates files
2. Commit to GitHub via browser editor
3. Bump `manifest.json` and `hacs.json` versions
4. Cut GitHub release tag (e.g. `v0.4.0`)
5. HA → HACS → update → restart
6. `/config/family_hub_data.json` is NEVER touched by updates — all data persists
7. After first deploy of a new version, call `force_daily_tick` from Developer Tools → Services to clean up any stale task instances

---

## Version History

| Version | Status | Notes |
|---|---|---|
| v0.1.0 | Released | Core integration |
| v0.1.1 | Released | Stale entity cleanup |
| v0.2.0 | Released | Backend + card + auto-registration |
| v0.2.1 | Released | Dirty-check render, modal stability, visual editor |
| v0.2.2 | Released | Hotfixes |
| v0.3.0 | Released | Full data model overhaul, card rewrite |
| v0.4.0 | Backend live, card ready to deploy | Expiry, history log, admin correction services, QC fixes |

---

## Code Standards (for Claude)

- Production quality, fully commented
- No placeholder values — always use `Rathnokan` and `family-hub`
- Card: single self-contained JS file, no build step, no external dependencies
- Python: syntax-verified with `ast.parse` before delivery
- JS: syntax-verified with Node `new Function()` stub before delivery
- Never recommend editing `configuration.yaml` directly

---

## File Structure

```
family-hub/
├── NOTES.md
├── README.md
├── hacs.json                         ✅ bump to 0.4.0
├── .gitignore
├── LICENSE
└── custom_components/
    └── family_hub/
        ├── __init__.py               ✅ v0.4.0 done
        ├── manifest.json             ✅ bump to 0.4.0
        ├── const.py                  ✅ v0.4.0 done
        ├── coordinator.py            unchanged
        ├── data_store.py             ✅ v0.4.0 done
        ├── sensor.py                 ✅ v0.4.0 done
        ├── services.py               ✅ v0.4.0 done
        ├── config_flow.py            unchanged
        ├── strings.json              unchanged
        ├── translations/en.json      unchanged
        └── www/
            └── family-hub-card.js    ✅ v0.4.0 done — ready to commit
```

---

## Card Architecture (unchanged)

- Single self-contained JS file, no dependencies, no build step
- Web Component: `class FamilyHubCard extends HTMLElement`
- Registered as `custom:family-hub-card`
- Visual editor: `class FamilyHubCardEditor extends HTMLElement`
- Served from `www/` at `/family_hub/family-hub-card.js?v=0.4.0`
- Reads sensor attributes via `this.hass.states[entityId].attributes`
- Calls services via `this.hass.callService(domain, service, data)`
- Event listeners attached ONCE in `connectedCallback()` via AbortController signal
- `_doRender()` NEVER touches event listeners (memory leak fix from v0.3.0)
- Dirty-check uses `last_updated` (not `last_changed`) — attributes don't bump last_changed
- All user-supplied text rendered via `escHTML()` — full 5-char HTML escape

### Four modes:
```yaml
type: custom:family-hub-card
mode: command_center          # Kitchen Echo Show 15

type: custom:family-hub-card
mode: personal
person: jackson

type: custom:family-hub-card
mode: maintenance

type: custom:family-hub-card
mode: admin
```

---

## v0.3.0 Backend — COMPLETE (previously delivered)

See git history for full details. Key changes:
- `assigned_to` → list everywhere; `chore_type` replaces `category`
- `category_label` (display grouping), `sort_order` (drag reorder)
- `penalty_enabled` / `penalty_points` per chore
- Recurrence: `weekdays` list, `day_filter`, `interval`
- `async_remove_person`, `async_add_task`
- Store items: `person_ids` list
- `settings.category_labels`
- `get_active_chores_for_card()` excludes maintenance and one-time chores

---

## v0.4.0 Backend — COMPLETE

All five Python files updated, syntax-verified.

### What changed:

**`const.py`**
- `VERSION = "0.4.0"`
- `STATUS_EXCUSED` — skipped task with penalty reversed by parent
- `STATUS_REJECTED` — approved task with points clawed back
- `HISTORY_TASK_EXCUSED`, `HISTORY_TASK_REJECTED`, `HISTORY_TASK_MARKED_COMPLETE`
- `HISTORY_RETENTION_DAYS = 30` — rolling history window
- `SERVICE_EXCUSE_TASK`, `SERVICE_REJECT_TASK`, `SERVICE_MARK_TASK_COMPLETE`, `SERVICE_FORCE_DAILY_TICK`

**`data_store.py`**
- `expires_after_days` field on chores/tasks (None = no expiry)
  - One-time assigned: expires with penalty if configured
  - Claimable bonus: expires silently (no penalty)
- `async_daily_tick` now calls `_async_expire_tasks()` then `_trim_history()` after tick loop
- `_async_expire_tasks` — auto-skips pending instances past their deadline
- `_trim_history` — removes history entries older than 30 days each tick
- `_append_history` — now includes `chore_name` field on all entries
- `async_excuse_task(instance_id, excused_by, reason)` — reverses penalty, marks EXCUSED
- `async_reject_task(instance_id, rejected_by, reason)` — claws back points, marks REJECTED
- `async_mark_task_complete(instance_id, marked_by, reason)` — retroactively approves, awards points + reverses penalty
- `async_force_daily_tick()` — resets last_tick_date to yesterday and runs tick immediately
- `get_history_for_card(person_id?, limit)` — enriched history for admin log UI
  - Each entry: history_id, type, person_id, person_name, person_color, reference_id,
    chore_name, points_delta, balance_after, timestamp, note, reversible, instance_status
  - `reversible`: `"excuse"` | `"mark_complete"` | `"reject"` | `None`
- `get_active_chores_for_card()` now includes `expires_after_days`

**`services.py`**
- `add_task`, `add_chore` schemas accept `expires_after_days` (optional int ≥ 1)
- `update_chore` schema accepts `expires_after_days` (nullable to clear it), `sort_order` as float
- Four new registered services: `excuse_task`, `reject_task`, `mark_task_complete`, `force_daily_tick`

**`sensor.py`**
- `needs_attention` now exposes `history_log` via `get_history_for_card()`

**`__init__.py`**
- Docstring updated; dynamic service unload handles new services automatically

---

## v0.4.0 Card — COMPLETE (this session)

`family-hub-card.js` fully updated. 2,857 lines. Syntax-verified. QC-reviewed and corrected.

### Phase 3-B features implemented:

**Bugs fixed:**
- Stacked overdue rows: `collapseByChore()` deduplicates multiple instances of the same
  chore — keeps most-overdue row only. Eliminates "2d late / 1d late / today" stacking
  from pre-v0.3.0 data
- Dollar value `$0.00` no longer shown when `show_dollar_value` is false

**Personal dashboard:**
- Due-today tasks grouped by `category_label`; overdue always floats above groups
- Items with no label appear under a plain "Today" group
- Reminders (heuristic: 0 pts + no penalty + no approval required) rendered in their own
  "Reminders" section below main tasks — lighter styling, grey border, check button still present
- Store items already pending show "Requested ✓" badge; Request button hidden to prevent
  double-requests. Match priority: `item_id` first, `item_name` fallback only when no
  `item_id` recorded (prevents similar-named items from being conflated)
- Expiry badge: real calculation from `due_date + expires_after_days` vs today.
  Shows "Expires in Nd" or "Expires today" only when ≤ 2 days remain; hidden otherwise

**Admin Approvals tab:**
- Split into two sections: Pending Approvals (approve/deny) + History Log
- History log: scrollable (max 420px), person filter chips at top, newest-first
- Each history row shows: event type label (colour-coded), chore name, person avatar,
  points delta, relative timestamp
- Action buttons per row based on `reversible` field:
  - `"excuse"` → amber "Excuse" button → calls `excuse_task`
  - `"mark_complete"` → green "Mark done" button → calls `mark_task_complete`
  - `"reject"` → red "Reject" button → calls `reject_task`
  - `null` → no button

**Admin Redemptions tab:**
- Split into two sections: Pending Redemptions (approve/decline) + Store Inventory
- Store inventory: list of all active items with Edit and Delete buttons
- "Add reward" button moved here from Overview

**Admin Overview:**
- "Add task" is now a full-width large primary button
- "Add reward" button removed (moved to Redemptions tab)
- Add task modal expanded with type selector: Assigned / Claimable / Reminder
  - Assigned: person checkboxes, points, approval toggle, optional expiry + penalty
  - Claimable: points + required expiry field, auto-category "Bonus"
  - Reminder: person select + recurrence only, routed to `add_chore` with `chore_type=reminder`

**Admin Chores tab:**
- Person filter chips (All + one per person) filter the chore list to show only
  chores assigned to the selected person

**QC fixes applied (post-review):**
- "Everyone" checkbox now also toggles `.checked` CSS class on parent chip labels (visual sync)
- Drag-drop: can now drop a chore at the absolute end of the list (previously broken)
- Expiry badge: real date math replacing hardcoded "Expires today" string
- Reminder segregation: reminders excluded from category groups, rendered in own section
- Reminder heuristic: `isReminderTask()` helper extracted; TODO comment added for Phase 3-C
  backend fix (`chore_type` needs adding to personal sensor payload)
- Store double-request: `item_id`-first matching, name fallback only when `item_id` absent
- Flash animation gap: completing task row is physically removed from DOM after animation
  so flex gap collapses cleanly (CSS `opacity:0` alone leaves a visual gap in flex layouts)

---

## Complete Data Contracts (v0.4.0)

### `sensor.family_hub_needs_attention` (admin mode)
```
approval_queue: [{task_id, chore_name, chore_points, person_id, person_name,
                  person_color, completed_at}]
redemption_queue: [{redemption_id, item_name, person_id, person_name, person_color,
                    points_cost, requested_at}]
people: [{person_id, name, type, avatar_color, points_balance, points_lifetime, active}]
active_chores: [{chore_id, name, description, chore_type, category_label, sort_order,
                 assigned_to (list), assigned_names (list), points, approval_required,
                 penalty_enabled, penalty_points, expires_after_days, recurrence}]
store_items: [{item_id, name, description, dollar_value, points_cost, scope,
               person_ids (list), active}]
family_name, points_per_dollar, show_dollar_value_to_kids
category_labels: ["Morning", "Afternoon", ...]
history_log: [{history_id, type, person_id, person_name, person_color, reference_id,
               chore_name, points_delta, balance_after, timestamp, note,
               reversible, instance_status}]
```

### `sensor.family_hub_[name]` (personal mode)
```
person_id, person_type, avatar_color, active
lifetime_points, dollar_value, show_dollar_value
tasks_due_today, tasks_overdue, pending_approval (counts)
tasks_due_today_list: [{task_id, chore_id, name, description, points, due_date, status,
                        category_label, penalty_enabled, penalty_points, is_one_time,
                        expires_after_days}]
tasks_overdue_list: [same + days_overdue]
tasks_pending_approval_list: [{task_id, chore_id, name, description, points,
                               completed_at, status}]
store_items: [{item_id, name, description, dollar_value, points_cost, scope, person_ids}]
```

**Known gap:** `chore_type` is not currently included in personal sensor task rows.
The card uses a heuristic (0 pts + no penalty + no approval = reminder) as a workaround.
This must be fixed in the backend in Phase 3-C. See TODO comment in `_htmlPersonalTasks`.

### `sensor.family_hub_claimable_tasks` (command_center mode)
```
tasks: [{task_id, name, description, points, due_date}]
all_tasks: [{task_id, chore_id, name, description, points, due_date, days_delta, status,
             category_label, assigned_to, person_name, person_color,
             approval_required, penalty_enabled, penalty_points}]
```

### `sensor.family_hub_maintenance_due` (maintenance mode)
```
overdue, due_this_week, due_next_week, next_item, next_due_date, next_due_days
items: [{task_id, chore_id, name, description, category_label, due_date, days_delta,
         assigned_to, person_name, person_color}]
```

---

## Complete Service Reference (v0.4.0)

**Task actions:**
- `complete_task`: `{task_id, person_id}`
- `approve_task`: `{task_id, approved_by}`
- `deny_task`: `{task_id, denied_by, reason?}`
- `claim_task`: `{task_id, person_id}`

**Chore management:**
- `add_chore`: `{name, chore_type, assigned_to (list), points, approval_required,
  recurrence_type, weekdays?, day_filter?, interval?, category_label, sort_order?,
  penalty_enabled, penalty_points, expires_after_days?, description}`
- `update_chore`: `{chore_id, ...any above fields, recurrence (dict)?}`
- `delete_chore`: `{chore_id}`

**One-time tasks:**
- `add_task`: `{name, assigned_to (list), points, description?, approval_required?,
  expires_after_days?}`
- `add_one_time_task`: alias for add_task (backward compat)

**People:**
- `add_person`: `{name, person_type, avatar_color?}`
- `update_person`: `{person_id, name?, avatar_color?, type?}`
- `remove_person`: `{person_id}`

**Store:**
- `add_store_item`: `{name, dollar_value, scope, person_ids (list)?, description?}`
- `update_store_item`: `{item_id, ...fields}`
- `delete_store_item`: `{item_id}`
- `request_redemption`: `{person_id, item_id}`
- `approve_redemption`: `{redemption_id, approved_by}`
- `decline_redemption`: `{redemption_id, declined_by, reason?}`

**Points:**
- `award_bonus_points`: `{person_id, points OR dollar_amount, reason?}`
- `deduct_points`: `{person_id, points OR dollar_amount, reason?}`

**Admin corrections (v0.4.0):**
- `excuse_task`: `{instance_id, excused_by, reason?}` — reverse penalty on skipped task
- `reject_task`: `{instance_id, rejected_by, reason?}` — claw back points on approved task
- `mark_task_complete`: `{instance_id, marked_by, reason?}` — retroactively approve skipped task
- `force_daily_tick`: `{}` — run tick immediately (use after deploy to clean stale instances)

**Settings:**
- `update_settings`: `{family_name?, points_per_dollar?, show_dollar_value_to_kids?,
  category_labels?}`

**Other:**
- `export_backup`: `{}`

---

## Phase 3-B — Card Update Checklist — COMPLETE ✅

All items implemented and QC-verified. See "v0.4.0 Card" section above for detail.

---

## Phase 3-C — Next Session

These are the next session's tasks. Do not start until v0.4.0 is live-tested and
any regressions from testing are resolved first.

### Backend change required (high priority)
- [ ] **Add `chore_type` to personal sensor task payload** (`sensor.py` → `get_tasks_for_card`)
  - Add `"chore_type": chore.get("chore_type", CHORE_TYPE_ASSIGNED)` to the row dict
    in `get_tasks_for_card()` for both `due_today` and `overdue` lists
  - This eliminates the brittle reminder heuristic in the card (`isReminderTask()`)
  - Once deployed, update the card to use `t.chore_type === "reminder"` directly
  - **This is a backend change to `sensor.py` only** — no other files need touching

### Card polish
- [ ] Command center: show a pending-approval badge dot on the affected person's filter chip
- [ ] Visual editor: show sensor connection status (green/red dot) for easier config debugging
- [ ] Better empty states — guidance text per mode (e.g. "No chores yet — tap Add chore above")
- [ ] History tab on personal dashboard — data already exists in sensor, just needs card UI
  (filter `history_log` by `person_id`, render read-only list, no action buttons for kids)

### Deferred (no timeline)
- Calendar integration
- Voice completion via Alexa
- Push notifications
- Public release prep — deferred until stable after family testing

---

## Known Issues / Decisions Log

| Issue | Decision |
|---|---|
| Pre-v0.3.0 stacked overdue instances | Run `force_daily_tick` after v0.4.0 deploy. Card-side dedup also added as safety net |
| History file size | Rolling 30-day trim runs each daily tick via `_trim_history()` |
| `recurrence_type` in `update_chore` | Card sends full `recurrence` dict instead; schema accepts it |
| `sort_order` is float | Changed from int to float to support drag midpoint without collision |
| Dollar value shows $0.00 when disabled | Fixed in v0.4.0 card — `show_dollar_value` attribute guards the entire dollar line |
| Auto-refresh required F5 | Fixed in v0.3.0 card — `last_updated` not `last_changed` |
| Memory leak on People tab | Fixed in v0.3.0 card — AbortController pattern |
| Reminder heuristic in card | Workaround: 0pts + no penalty + no approval = reminder. Fix in Phase 3-C: add `chore_type` to personal sensor payload |
| Flash animation leaves flex gap | Fixed in v0.4.0 card — row physically removed from DOM after animation completes |
| Drop chore at end of list | Fixed in v0.4.0 card — `isLast` detection assigns `sort_order = last + 10` |
| "Everyone" checkbox doesn't highlight chips | Fixed in v0.4.0 card — loop now toggles `.checked` class on parent chip label |

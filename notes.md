# Family Hub — Project Notes
> Read this at the start of every session. Update it whenever decisions are made or status changes.
> Repo: https://github.com/Rathnokan/family-hub

---

## SESSION START CHECKLIST

1. Read this file
2. Check live files via Samba: `\\10.0.0.41\config\custom_components\family_hub\`
3. Card source is in `src/card/*.js` — built into `www/family-hub-card.js` via `npm run build`
4. Python changes: reload integration only (Settings → Devices & Services → Family Hub → Reload). No full HA restart needed.
5. JS changes: browser hard refresh only (`Ctrl+Shift+R`). No HA involvement.
6. After backend changes: reload integration → hard refresh → call `force_daily_tick` from Dev Tools → Services

## SESSION END CHECKLIST

Before closing any session, update this file:
1. Move completed work queue items to a "Completed" note or remove them
2. Update Current Status table (live version, GitHub state, next release)
3. Add any new bugs discovered to Outstanding Bugs
4. Add any architecture or design decisions made to the Architecture Decisions section
5. Note any deferred items that came up
6. Update the work queue if scope changed

---

## Current Status — 2026-05-10

| Item | State |
|---|---|
| **Last HACS release** | v0.4.1 — holding v0.4.2 tag until v0.5.0 (ghost instance bug) |
| **Live on HA (Samba)** | v0.4.2 code deployed — bugs remain (see Outstanding Bugs below) |
| **manifest.json / hacs.json** | Bumped to 0.4.2 ✓ |
| **GitHub** | v0.4.2 code NOT yet committed — commit before starting v0.5.0 work |
| **Next formal release** | v0.5.0 — will be the first clean public release |
| **Phase** | v0.5.0 planning complete — ready to implement |

---

## Environment

- **Family:** Parents (Jim + Shannon), Kids: Jackson, Olivia, Spencer
- **Devices:** Echo Show 5, Echo Show 8, Echo Show 15 (kitchen — command_center only)
- **Kitchen account:** Restricted HA account "Kitchen Display"
- **HA version:** 2026.5.1
- **Add-ons:** Samba, File Editor, SSH & Web Terminal, HACS
- **Data file:** `/config/family_hub_data.json` — never touched by code updates

---

## Data File Health Issues (discovered 2026-05-10)

The data file has accumulated garbage from early development. These are root causes of several active bugs.

| Issue | Impact |
|---|---|
| **13 people records** (should be 5) | 8 orphans with blank `person_id`, `active=False` — noise, benign for now |
| **Ghost task instances** (`assigned_to=""`) | One blank-ID instance per chore from before multi-person model. Cleanup pass skips them. **Root cause of B3 bug still showing.** |
| **Schema inconsistency** — "Clean the Playroom" has both `weekdays` and `day_filter` set | Weekly chore should only have `weekdays`. Causes unpredictable behavior. |
| **"Sweep the Floors"** is `every_n_days` + `claimable` | Unusual combination from early setup. Being retired by recurrence redesign in v0.5.0. |
| **96 task instances** for 5 people | Accumulated test junk. Needs pruning. |
| **`penalties_paused: true` globally** | Set during testing. May want to clear before going live. |

---

## Outstanding Bugs (carried into v0.5.0)

- **B3 ghost instances:** Day-filter chores (e.g. "Get ready for School Mon–Fri") still show on off-days because ghost instances with `assigned_to=""` survive the cleanup pass. The 3 real per-person instances are cleaned correctly; the ghost is not. Fix: prevent ghost instance creation + add cleanup in migration.
- **B2 history entries:** 3 entries per task (Completed + Approved + Points) — suppression in `get_history_for_card()` did not fully work. Full fix is the v0.5.0 history collapsing redesign.
- **"1d late" label on recurring chores:** Weekly and every_n_days chores show "due Nd ago" badge — wrong per mental model. Fix is part of v0.5.0 mental model alignment.

---

## Workflow

- Claude generates code → deployed via Samba for testing
- Python changes: integration reload only (not full HA restart)
- JS changes: browser hard refresh only
- Both changed: reload + hard refresh + `force_daily_tick`
- When stable: commit to GitHub, bump versions, cut release tag → HACS update
- No need for a release for every small fix — use Samba until a batch is stable

---

## File Locations

| What | Where |
|---|---|
| Backend source | `custom_components/family_hub/*.py` |
| Card source (modular) | `src/card/*.js` |
| Card bundle (deployed) | `custom_components/family_hub/www/family-hub-card.js` |
| Build command | `npm run build` (esbuild, no watch needed for one-off builds) |
| Live HA files | `\\10.0.0.41\config\custom_components\family_hub\` |
| Data file | `\\10.0.0.41\config\family_hub_data.json` — read-only for Claude |

---

## v0.5.0 Work Queue

Implement in this order. Each session should cover one or two related items.

### Session 1 — Data Health Infrastructure
- Load-time migration: normalize schema fields (strip `day_filter` from weekly chores, fill missing fields with defaults)
- Prevent ghost instance creation: never create a task instance with blank `assigned_to`
- Ghost instance cleanup: migration removes existing ghost instances
- Duplicate people cleanup: migration removes people with blank `person_id`
- Daily tick pruning: remove task instances (completed/skipped/rejected) older than 60 days
- Admin "Rebuild data" button in Settings: heavy-lift cleanup on demand (confirms first, logs changes)

### Session 2 — Mental Model Alignment + History Collapsing
- Remove "late" / "Nd ago" language from all recurring chore types — chores are available in their window, not late
- Weekly/every_n_days/monthly chores show as completable with their reset date, no overdue styling
- History: collapse Completed → Approved → Points into a single updating row per task instance
- One Reject button per task (not per history event)
- Fix B2 ghost instance fallout in personal history tab (raw log vs filtered log)

### Session 3 — Claimable Subtypes + Recurrence Redesign
- **Claimable subtypes:**
  - *First-come-first-serve:* one instance, removed from claimable list once claimed
  - *Multi-claim:* max N claimants, full points each OR split evenly (rounded up)
- **Recurrence redesign:**
  - New type: multi-day weekly — select specific days of week it resets on (Mon/Wed/Sat pattern)
  - Retire `every_n_days` and `every_n_weeks` from UI (keep handling in backend for existing data)
  - UI: chore form updated to reflect new recurrence options

### Session 4 — Streaks
- Track consecutive daily completions per chore per person
- Store streak count on task instance or person record (TBD during implementation)
- Bonus points at milestones (e.g. 7-day, 30-day streaks) — configurable per chore
- Show streak count on personal dashboard task row
- Streak breaks when a day is skipped (penalty fires or instance missed)

### Session 5 — Scheduled Allowance
- Per-person allowance: fixed points awarded automatically on a schedule (weekly, bi-weekly, monthly)
- Configured in Admin → person record (edit person modal)
- Uses existing `async_award_points` plumbing
- Shows in history log as "Allowance"

### Session 6 — HA Notifications
- Approval needed: notify Jim + Shannon when a kid submits a chore for approval
- Morning nudge: if it's past a configurable hour and a kid has pending daily tasks, send a notification to that kid's device (or a shared device)
- Configure notification targets per person in settings
- Uses HA's `notify` service domain — no external dependencies

### Session 7 — Polish + Release
- Text scale editor: change number input to dropdown (Small 0.9 / Default 1.0 / Large 1.25 / XL 1.5)
- F2: weekly chore grace period / escalating penalty (if still desired after Session 2)
- Commit all v0.5.0 work to GitHub
- Bump manifest.json, hacs.json, card VERSION to 0.5.0
- Cut GitHub tag → HACS release

---

## Deferred (not in v0.5.0)

- **Home Maintenance module** — user still thinking about design. Has partial sensor stub already.
- **Chore rotation** — rotating assignment pool (this week Jackson, next week Olivia). On future wish list.
- **Goal tracking** — kid sets a store item as a savings goal with progress bar.
- **Photo evidence for approvals** — too complex for now.

---

## Architecture Decisions (stable — don't re-litigate)

- Single JSON file (`family_hub_data.json`). Never touched by code updates.
- Card is a single bundled JS file built from `src/card/*.js` via esbuild. No external runtime deps.
- Event listeners attached ONCE in `connectedCallback` via AbortController — never in `_doRender`.
- Dirty-check uses `last_updated` (not `last_changed`) — attributes don't bump `last_changed`.
- `_doRender` appends the modal as a separate DOM node so background re-renders can't destroy open modals.
- History is trimmed to 30-day rolling window each daily tick.
- Penalty pause is a sticky flag (stays set until parent manually turns it off).
- **Chore mental model:** Chores have a "window" — available during window, penalized when window closes. Never "overdue" for kids. Overdue concept reserved for Home Maintenance (future).

---

## Known Data Contracts (v0.4.2)

**`sensor.family_hub_needs_attention` key attrs:**
`approval_queue`, `redemption_queue`, `people` (includes `penalties_paused` per person),
`active_chores`, `store_items`, `family_name`, `points_per_dollar`, `show_dollar_value_to_kids`,
`category_labels`, `penalties_paused_global`, `history_log`

**`sensor.family_hub_[name]` key attrs:**
`person_id`, `person_type`, `avatar_color`, `active`, `lifetime_points`, `dollar_value`,
`show_dollar_value`, `tasks_due_today_list`, `tasks_overdue_list`, `tasks_pending_approval_list`,
`store_items`
Each task row includes: `task_id`, `chore_id`, `name`, `description`, `points`, `due_date`,
`status`, `chore_type`, `category_label`, `penalty_enabled`, `penalty_points`,
`expires_after_days`, `is_one_time`, `days_overdue` (overdue list only)

**`sensor.family_hub_claimable_tasks`:** `tasks` (claimable only), `all_tasks` (command center)

**`sensor.family_hub_maintenance_due`:** `overdue`, `due_this_week`, `due_next_week`, `next_item`, `next_due_date`, `next_due_days`, `items`

---

## Version History

| Version | Notes |
|---|---|
| v0.1.0 | Core integration |
| v0.1.1 | Stale entity cleanup |
| v0.2.0 | Backend + card + auto-registration |
| v0.2.1 | Dirty-check render, modal stability, visual editor |
| v0.2.2 | Hotfixes |
| v0.3.0 | Full data model overhaul (assigned_to list, chore_type, category_label, sort_order, penalties, recurrence) |
| v0.4.0 | Expiry, history log, admin correction services (excuse/reject/mark_complete), force_daily_tick |
| v0.4.1 | Bug fixes: update_chore multi-person sync, chore_type in personal sensor, ghost instance exclusion. Card modularised. |
| v0.4.2 | Penalty pause (global + per-person). B1–B5 backend+card bug fixes. F1 text_scale. Personal history tab. CC approval dots. Editor status indicator. Deployed via Samba; HACS release held for v0.5.0. |
| v0.5.0 | Data health infrastructure, mental model alignment, history collapsing, claimable subtypes, recurrence redesign, streaks, allowance, notifications. First clean public release. |

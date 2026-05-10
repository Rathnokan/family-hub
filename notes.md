# Family Hub — Project Notes
> Read this at the start of every session. Update it whenever decisions are made or status changes.
> Repo: https://github.com/Rathnokan/family-hub

---

## SESSION START CHECKLIST

1. Read this file
2. Check live files via Samba: `\\10.0.0.41\config\custom_components\family_hub\`
3. Card source is in `src/card/*.js` — built into `www/family-hub-card.js` via `npm run build`
4. Small fixes go to HA via Samba; formal releases go via HACS when stable

---

## Current Status — 2026-05-10

| Item | State |
|---|---|
| **Last HACS release** | v0.4.1 (not yet pushed — do GitHub release + tag) |
| **Live on HA (Samba)** | v0.4.2 — all bugs + features deployed |
| **manifest.json / hacs.json** | Bumped to 0.4.2 ✓ |
| **Card constants.js VERSION** | "0.4.2" ✓ |
| **Next formal release** | v0.4.2 — ready to tag + GitHub release |
| **Phase** | 3-C complete — ready for HACS release |

---

## Environment

- **Family:** Parents (Jim + 1), Kids: Jackson, Olivia, Spencer
- **Devices:** Echo Show 5, Echo Show 8, Echo Show 15 (kitchen — command_center only)
- **Kitchen account:** Restricted HA account "Kitchen Display"
- **HA version:** 2026.5.1
- **Add-ons:** Samba, File Editor, SSH & Web Terminal, HACS
- **Data file:** `/config/family_hub_data.json` — never touched by updates

---

## Workflow

- Claude generates code → deployed via Samba for testing
- When stable: commit to GitHub, bump manifest.json + hacs.json + card VERSION, cut release tag → HACS update → HA restart
- After deploy: call `force_daily_tick` from Dev Tools → Services to clean stale instances
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

## Work Queue — Phase 3-C (COMPLETE)

All items shipped in v0.4.2. Next phase: test in HA, then cut GitHub tag + HACS release.

### COMPLETED — Backend (`data_store.py`)
- **B1:** `get_history_for_card()` — excuse only when `penalty_applied > 0`
- **B2a:** Suppress duplicate `HISTORY_POINTS_AWARDED` entries for task completions
- **B2b:** `async_reject_task()` — same-day retry instance created on reject (non-one-time chores)
- **B3a:** `_async_tick_for_date()` — cleanup pass skips stale instances on day_filter off-days
- **B3b:** `get_tasks_for_card()` — hides day_filter chores from overdue on off-days
- **B4:** `get_tasks_for_card()` — weekly/recurring past-due goes to `due_today` (with `days_late`) not overdue
- **B4:** `get_all_tasks_for_command_center()` — same treatment for command center

### COMPLETED — Card (`src/card/*.js`)
- **B5:** `modes-admin.js` — penalty toggle moved to separate `.fh-penalty-pause-row` below person row; label shows "Penalties off (global)" / "Penalties off" / "Penalties on" correctly
- **F1:** `css.js` + `FamilyHubCard.js` — `--fh-text-scale` CSS variable; `text_scale` config key; key font sizes use `calc(Xrem * var(--fh-text-scale, 1))`
- `modes-personal.js` — added History tab (per-person read-only log); `days_late` badge for weekly tasks in due_today; replaced heuristic `isReminderTask` with `t.chore_type === "reminder"`
- `modes-cc.js` — approval dot on person filter chips; `days_late` badge on weekly tasks
- `editor.js` — sensor connection status indicator (green/red dot); `text_scale` number field
- `constants.js` — VERSION bumped to "0.4.2"

### DEFERRED

#### F2 — Weekly chore grace period / escalating penalty
Design after B4 base fix is confirmed working in production. Optional `overdue_grace_days` field: after N days past due_date, mark overdue and deduct penalty daily.

---

## Architecture Decisions (stable — don't re-litigate)

- Single JSON file (`family_hub_data.json`). Never touched by code updates.
- Card is a single bundled JS file built from `src/card/*.js` via esbuild. No external runtime deps.
- Event listeners attached ONCE in `connectedCallback` via AbortController — never in `_doRender`.
- Dirty-check uses `last_updated` (not `last_changed`) — attributes don't bump `last_changed`.
- `_doRender` appends the modal as a separate DOM node so background re-renders can't destroy open modals.
- History is trimmed to 30-day rolling window each daily tick.
- Penalty pause is a sticky flag (stays set until parent manually turns it off).

---

## Known Data Contracts (v0.4.2)

Only record things the card reads that aren't obvious from the sensor code.

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
| v0.4.1 | Bug fixes: update_chore multi-person sync, chore_type in personal sensor, ghost instance exclusion. Card modularised (src/card/*.js + esbuild). |
| v0.4.2 | Penalty pause (global + per-person). B1–B5 backend+card bug fixes. F1 text_scale per card. Personal history tab. CC approval dots. Editor status indicator. |

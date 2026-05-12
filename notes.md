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

## Current Status — 2026-05-11

| Item | State |
|---|---|
| **Last HACS release** | v0.4.1 — holding v0.4.2 tag until v0.5.0 (ghost instance bug) |
| **Live on HA (Samba)** | v0.5.0 Session 6 deployed |
| **manifest.json / hacs.json** | Still at 0.4.2 — bump at v0.5.0 final release |
| **GitHub** | v0.4.2 committed ✓. v0.5.0 Sessions 1–5 NOT yet committed. |
| **Next formal release** | v0.5.0 — will be the first clean public release |
| **Phase** | Session 6 complete — ready for Session 7 (Polish + Release) |

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

- **B3 ghost instances:** FIXED in Session 1.
- **B2 history entries:** FIXED in Session 2 (history collapsing — one row per instance).
- **"1d late" label on recurring chores:** FIXED in Session 2 (reset badge replaces overdue language).
- **Claimable task rejection:** FIXED post-Session 2. `async_reject_task` and `async_deny_task` now recreate the shared pending instance so anyone can claim it again.
- **Denied task not reappearing:** FIXED post-Session 2. `async_deny_task` now creates a same-day retry instance for recurring chores (same as reject).
- **Denied history not erased on success:** FIXED post-Session 2. Denied instances are now suppressed in history when the same chore+person later has an approved instance.
- **Weekly chore weekday editor:** FIXED post-Session 2 / revised Session 3. Changed to multi-select checkboxes (radio approach dropped). Multi-day weekly patterns (Mon/Wed/Sat) now supported.

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

### ~~Session 1 — Data Health Infrastructure~~ COMPLETE (2026-05-10)
- ✓ Load-time migration: strip `day_filter` from weekly chores, fill defaults
- ✓ Ghost instance prevention in `async_add_chore` and `_async_tick_for_date`
- ✓ Load-time cleanup: removes `assigned_to=""` ghost instances and blank-id people
- ✓ `_skip_incomplete_instances` fix: treats `assigned_to=""` as None
- ✓ Daily tick: prunes terminal task instances older than 60 days
- ✓ `rebuild_data` service + Admin Settings button with confirm dialog + HA notification summary

### ~~Session 2 — Mental Model Alignment + History Collapsing~~ COMPLETE (2026-05-10)
- ✓ Removed "due Nd ago" / "days_late" language from recurring chores (weekly, every_n_days, monthly)
- ✓ Backend now exposes `recurrence_type`, `recurrence_weekdays`, `days_until_reset` on task rows
- ✓ New `_days_until_reset()` helper computes days to next cycle reset
- ✓ Card shows "Resets Sun" (neutral) or "Resets today/tomorrow" (amber) for weekly/monthly chores
- ✓ CC card updated with same reset badge logic
- ✓ History: one row per task instance (collapsed completed + approved + points into single evolving row)
- ✓ Rejected instances suppressed when same chore+person later has an approved instance
- ✓ Skipped chores group by date into collapsible entries with per-chore Excuse buttons
- ✓ `pending_approval` added to HISTORY_META ("Pending approval" in amber)
- ✓ Both admin and personal history tabs get grouping + collapsing

### ~~Session 3 — Daily Penalty Threshold + Claimable Subtypes + Recurrence Redesign~~ COMPLETE (2026-05-10)
- **Weekday chip sizing (polish):** Radio button chips on the weekly chore editor are too small — the button overlaps the day label text. Widen chips slightly (e.g. `min-width: 44px` or larger) so the radio + label sit comfortably side by side. CSS-only change in `css.js`.
- **Daily penalty threshold (new):** Per-chore option: if not completed within N days of becoming available, accrue a daily point penalty until reset day. Applies to weekly, monthly, and one-time tasks. Needs:
  - New chore field `daily_penalty_after_days` (optional int)
  - Backend tick logic: if task age > threshold and still pending, apply incremental penalty without skipping the chore
  - Urgency indicator on card: red flag when daily penalties are actively firing (distinct from reset-proximity amber)
  - Chore editor UI field
- **Claimable subtypes:**
  - *First-come-first-serve:* one instance, removed from claimable list once claimed
  - *Multi-claim:* max N claimants, full points each OR split evenly (rounded up)
- **Recurrence redesign:**
  - New type: multi-day weekly — select specific days of week it resets on (Mon/Wed/Sat pattern)
  - Retire `every_n_days` and `every_n_weeks` from UI (keep handling in backend for existing data)
  - UI: chore form updated to reflect new recurrence options

### ~~Session 4 — Streaks~~ COMPLETE (2026-05-10)
- ✓ Streak storage: lazy dict `person["streaks"][chore_id] = {count, last_completed}` on person record
- ✓ `_get_streak`, `_break_streak`, `_increment_streak`, `async_set_streak` helpers in data_store.py
- ✓ Streak increments on `async_complete_task` (no-approval path) and `async_approve_task`
- ✓ Streak breaks on `_skip_incomplete_instances` — skipped = streak reset
- ✓ Pause flag (`penalties_paused`) covers both penalties AND streaks: when paused, neither increment nor break
- ✓ Milestone bonus: `streak_milestone` int + `streak_bonus_points` per chore — fires every N completions
- ✓ `set_streak` service for admin correction (fix accidental breaks)
- ✓ `streak` field added to `get_tasks_for_card` row; `streak_milestone`/`streak_bonus_points` to `get_active_chores_for_card`
- ✓ `streaks` dict added to people list in `sensor.family_hub_needs_attention` attrs
- ✓ Personal dashboard: `🔥 N` badge on task rows when streak ≥ 2
- ✓ Admin Overview: pause labels renamed to "Penalties & streaks on/off"; "🔥 Streaks" button opens edit modal
- ✓ Admin Settings: global toggle label updated to "Penalties & streaks active"
- ✓ Edit Streaks modal: per-chore streak counts with per-row Set buttons (immediate save, no modal close)
- ✓ Chore editor: streak milestone + bonus points fields added
- ✓ `.fh-badge-streak` CSS added

### ~~Session 5 — Scheduled Allowance~~ COMPLETE (2026-05-11)
- ✓ `HISTORY_ALLOWANCE = "allowance"` constant added (distinct from points_awarded)
- ✓ `_should_award_allowance(person, tick_date)` static helper on DataStore
- ✓ `_async_process_allowances(tick_date)` called inside catch-up loop — awards per day, catch-up aware
- ✓ Per-person fields: `allowance_points`, `allowance_schedule`, `allowance_weekday`, `allowance_monthday`, `last_allowance_date`
- ✓ Weekly: fires on matching weekday, gap ≥7 days. Bi-weekly: same but gap ≥14. Monthly: matching day-of-month, once per calendar month
- ✓ `update_person` service schema updated with 4 allowance fields
- ✓ `sensor.py` people list now includes allowance fields
- ✓ Admin Overview: edit-person button passes allowance data-* attrs; balance line shows "Allowance: Npts/wk|2wk|mo" when set
- ✓ Edit Person modal: Allowance section with amount, schedule, weekday, monthday fields
- ✓ `HISTORY_META.allowance` added to constants.js — shows as "Allowance" in green in history log

### ~~Session 6 — HA Notifications~~ COMPLETE (2026-05-11)
- ✓ Per-person `notify_target` field (HA notify service name, e.g. `mobile_app_jims_iphone`)
- ✓ Global `penalty_alert_time` setting (HHMM int, default 800, -1 = disabled)
- ✓ Per-chore `reminder_time` field (HHMM int, default -1 = off)
- ✓ Notification #1: last-chance penalty warning — fires at `penalty_alert_time` on the last valid day before a weekly/monthly penalty-enabled chore resets (`days_until_reset == 1`)
- ✓ Notification #2: daily penalty accumulating — fires once per day at `penalty_alert_time` while `daily_penalty_after_days` penalties are accruing on an instance
- ✓ Notification #3: per-chore time reminder — fires once per instance when current time reaches `reminder_time` and task is still pending
- ✓ Notification #4: approval push — parents with `notify_target` receive push when a kid submits for approval; same for redemption requests
- ✓ Nudge tracking: `nudged_reminder`, `nudged_penalty_warning`, `nudged_penalty_date` flags on task instances
- ✓ `async_check_notifications()` on data store, called each coordinator poll (30s) with guards
- ✓ Fixed bug: `async_update_person` allowed set was missing allowance fields from Session 5
- ✓ Admin UI: Edit Person modal has Notifications section; Edit Settings modal has Penalty alert time field; chore editor has Reminder time field
- ✓ Uses HA `notify.*` services — works with Companion App (push to phones) and alexa_media_player (Echo Show TTS)

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
- **Ghost instance rule (v0.5.0):** `CHORE_TYPE_ASSIGNED` chores with no `assigned_to` people never generate task instances. Only `CHORE_TYPE_REMINDER` (and `CHORE_TYPE_CLAIMABLE`) may have unassigned instances. This is enforced in both `async_add_chore` and `_async_tick_for_date`.
- **Task instance retention (v0.5.0):** Terminal task instances (skipped/approved/denied/rejected/excused) older than 60 days are pruned each daily tick. History entries pruned at 30 days (unchanged).

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

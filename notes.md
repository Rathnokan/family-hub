# Family Hub — Project Notes
> Read this at the start of every session. Update it whenever decisions are made or status changes.
> Repo: https://github.com/Rathnokan/family-hub

---

## SESSION START CHECKLIST

1. Read this file
2. If working on the active release planning (currently v0.6.0), also read [PLAN-v0.6.0.md](PLAN-v0.6.0.md)
3. Check live files via Samba: `\\10.0.0.41\config\custom_components\family_hub\`
4. Card source is in `src/card/*.js` — built into `www/family-hub-card.js` via `npm run build`
5. Python changes: reload integration only (Settings → Devices & Services → Family Hub → Reload). No full HA restart needed.
6. JS changes: browser hard refresh only (`Ctrl+Shift+R`). No HA involvement.
7. After backend changes: reload integration → hard refresh → call `force_daily_tick` from Dev Tools → Services

## DOC LAYOUT

- **`NOTES.md`** (this file) — session handoff. Status, work queue, bugs, decisions, data contracts. Update at end of every session.
- **`PLAN-v<version>.md`** — architecture + implementation plan for one release. Read when scoping or designing; not touched session-to-session. Superseded by the next plan when the release ships.

## SESSION END CHECKLIST

Before closing any session, update this file:
1. Move completed work queue items to a "Completed" note or remove them
2. Update Current Status table (live version, GitHub state, next release)
3. Add any new bugs discovered to Outstanding Bugs
4. Add any architecture or design decisions made to the Architecture Decisions section
5. Note any deferred items that came up
6. Update the work queue if scope changed

---

## Current Status — 2026-05-17

| Item | State |
|---|---|
| **Last HACS release** | v0.5.0 (tag `0f4469e`) — holding for v0.6.0 |
| **Live on HA (Samba)** | v0.6.0 — stub 6.4 KB + body 447.1 KB (lazy-loaded) |
| **manifest.json / hacs.json** | 0.6.0 ✓ |
| **GitHub** | v0.5.0 committed (`0f4469e`). v0.6.0 ready to commit + tag. |
| **Next formal release** | v0.6.0 "The Front Door" — SHIPPING |
| **Phase** | S11 release — docs + version bumps complete, ready for commit + tag + HACS push |

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

## v0.6.0 Work Queue — "The Front Door"

Full architecture and rationale in [PLAN-v0.6.0.md](PLAN-v0.6.0.md). Summary queue below.

### ~~Session 1 — Foundations~~ COMPLETE (2026-05-13)
- ✓ Backend: `code` + `theme_key` on person model (add/update/sensor). `icon` now in `get_tasks_for_card` + `get_active_chores_for_card` output.
- ✓ `async_update_settings` + services schema: `rooms_config`, `weather_entity`, `today_calendar_entities`.
- ✓ `FamilyHubTodaySensor` added (placeholder, state=0, `schedule=[]`).
- ✓ Load-time migration: existing people get `code=""` + `theme_key="classic"` via setdefault.
- ✓ Card: `icons.js` (FH_ICONS library + `choreIcon()` helper), `bracketed.js` (corner-frame helper).
- ✓ `css.js`: Google Fonts import (Bricolage Grotesque, JetBrains Mono, Manrope) + `--fh-font-*` CSS vars.
- ✓ Admin Edit Person modal: Codename text field + Theme dropdown.
- ✓ Chore editor: Icon key text field (name → key, e.g. "dishes", "vacuum").
- ✓ Bundle: 146 KB. Deployed to Samba.

### ~~Session 2 — Command Center Home~~ COMPLETE (2026-05-13)
- ✓ `modes-home.js`: header + person tiles + room tiles + today strip + coming-soon screen.
- ✓ `rooms/index.js` registry: chores + maintenance (live), meals/smarthome/calendar (coming).
- ✓ Navigation state (`_view = 'home' | 'room:<id>' | 'person:<id>'`) + back stack in FamilyHubCard.
- ✓ `dispatch.js`: `nav` (push + set view) and `nav-back` (pop) actions.
- ✓ `modes-personal.js`: supports `_viewPersonId` override for home-page person navigation.
- ✓ `htmlNavBack()` back bar prepended to all non-home views.
- ✓ `htmlComingSoon()` renders polished placeholder for future rooms.
- ✓ Today strip: approval count badge + weather entity (if configured).
- ✓ Bundle: 171 KB. Deploy via Samba + hard refresh to test.

### Session 3 — Mission Control (Chores HQ)
- Rewrite `modes-cc.js` → `modes-chores.js` in Mission Control layout.
- Agent roster filter, breach/category sections, mission rows with streak bar + points medal + GO button.
- Intel Alerts panel, Open Ops panel, footer status.
- Completion animation + milestone celebration overlay.
- Daily-penalty-accruing flag; multi-day weekly chip; OPS PAUSED ribbon.

### ~~Session 4 — Themes foundation + first theme~~ COMPLETE (2026-05-14)
- ✓ `themes/index.js` + `themes/_shared.js` (XP bar, rank utilities).
- ✓ `themes/classic.js` — full port of personal mode into theme shape (fallback for any un-themed person).
- ✓ `themes/engineer.js` — blueprint cyanotype aesthetic for Jim. Blueprint grid, work order rows, dimensional streak callouts, amber pts stamp, tilted stamp button, title-block footer.
- ✓ `modes-personal.js` → thin dispatcher, delegates to `getTheme(person.theme_key).render()`.
- ✓ `FamilyHubCard.js` → `handlesNavigation` check: engineer theme skips standard nav-back bar.
- ✓ `hub-skins/classic.js` → agent tiles redesigned: theme sigil watermark, rank title sub-label, dual PTS/OPEN stat block at equal weight, `--tile-tint` gradient background.
- ✓ CSS: new agent tile classes, XP bar, full engineer theme (`fh-eng-*`) block added to `css.js`.
- ✓ **Polish pass:** engineer `← HOME` button moved to its own nav strip above the header (was `position:absolute`, overlapping callouts). Font sizes bumped ~20-25% throughout engineer theme (body text was too small for Echo Show viewing distance). Home agent tile small labels also nudged up.
- ✓ Bundle: 227.0 KB. Deployed to Samba.

### ~~Session 5 — Remaining themes + visual character pass~~ COMPLETE (2026-05-15)
- ✓ `baker.js` (Shannon): cream paper palette (`#F2E5CC`), DM Serif Display + Caveat fonts, step-number ticket cards, "Bake it ✓" pill button, double-border container
- ✓ `dinos.js` (Spencer): kraft paper palette (`#E8DAB7`), JetBrains Mono throughout, specimen tags (`SP-001 · CATEGORY`), stamp "LOG IT" button, 🦕 watermark, 4 corner kraft-tape strips, APPROVED/CLASSIFIED stamp badges
- ✓ `hp.js` (Olivia): parchment palette (`#EFE0BA`), Cinzel + Crimson Pro fonts, period-number column (P1/P2…), emerald wax-seal icon containers, "Cast ✓" button, ⚡ crest watermark, 4 corner ❦ ornaments, inset leather frame, "By owl · Mischief Managed" footer
- ✓ `dbz.js` (Jackson): sky-blue→orange gradient bg, white comic-card tasks with `4px solid navy` borders + `0 6px 0 navy` shadow, halftone overlay, energy aura behind icons, huge GO! button — icon-first accessibility layout, ⚡ lightning streak tracker, "NEXT POWER-UP" progress bar
- ✓ All 4 themes: category grouping (Overdue first, then admin-defined order, no 6-task cap); proper light/warm aesthetics per design reference files (NOT dark themes)
- ✓ `themes/_shared.js`: `groupByCategory(tasks, catOrder)` helper exported and used by all 4 themes
- ✓ **Unified kid-mode renderer:** `renderKidMode(card, person, palette, ranks)` in `_shared.js` — completely separate render path (not just larger fonts). Returns big-icon-grid layout (DBZ visual language) with each theme's own `KID_PALETTE`. All 6 themes (baker, dinos, hp, dbz, engineer, classic) delegate to this on `person.child_mode === true`. Removed old `.fh-page--large` font-size override approach.
- ✓ Icon picker: visual grid in chore editor replaces plain text input; `toggle-icon-picker` + `pick-icon` dispatch actions; live preview thumbnail; `#m-cicon` hidden input carries value
- ✓ `child_mode` per person: field in `data_store.py` (migration + `update_person`), exposed in `sensor.py` people list, admin Edit Person modal toggle, dispatch wiring, all 6 theme render functions check it first
- ✓ Design reference files saved to `docs/design-reference/` (8 JSX files: `theme-baker.jsx`, `theme-dinos.jsx`, `theme-hp.jsx`, `theme-dbz.jsx`, `theme-engineer.jsx`, `chore-icons.jsx`, `command-center-home.jsx`, `data.jsx`)
- ✓ `css.js`: 5 new Google Font faces (DM Serif Display, Caveat, Cinzel, Crimson Pro, Bree Serif); icon picker CSS block; full rewrites of baker/dinos/hp/dbz CSS blocks to correct light/warm aesthetics; full kid-mode CSS block (`.fh-kid-*` classes with CSS custom property theming via `--kid-*` vars)
- ✓ **CSS specificity bug fixed:** `.fh-hp-page > *`, `.fh-dn-page > *`, `.fh-dbz-page > *` blanket `position:relative; z-index:1` rules were pulling absolutely-positioned watermark/frame/corner elements into normal flow (watermark took ~112–144px at top). Fixed by replacing with explicit named content selectors only (`.fh-hp-title-block, .fh-hp-stat-strip, .fh-hp-tabs, .fh-hp-body, .fh-hp-footer`).
- ✓ **HP/Dinos proportion fixes for card scale (~400px):** HP frame reduced from 24px to 8px inset (was eating content edges); corner ornaments 3rem→1.4rem; wax seal 54px→38px; title main 2.2rem→1.6rem; stat-strip made wrappable. Dinos tape strips 110×24px→60×14px (were extending off card edges); title 1.9rem→1.5rem; stat-strip wrappable. Baker title 2.2rem→1.7rem.
- ✓ Bundle: 346.6 KB. Deployed to Samba (JS + Python).

### ~~Session 6 (partial) — Text size pass~~ COMPLETE (2026-05-15)
- ✓ **CSS text size pass across all non-DBZ screens** (DBZ was correct reference):
  - Base/classic: `fh-task-name` .92→1.05rem, `fh-tab` .83→.95rem, `fh-section-title` .75→.88rem, `fh-badge` .72→.82rem
  - Command center home: agent name .92→1.05rem, agent stat-num 1.3→1.5rem (900px breakpoint 1.5→1.75rem), agent stat-lbl .66→.78rem, agent code .72→.84rem, agent sublabel .68→.80rem, section label .68→.80rem, room label .9→1.05rem, room sub .75→.88rem, room stat-num 1.05→1.2rem, room stat-lbl .72→.85rem, room preview .74→.88rem, today approvals lbl + quiet .82→.95rem, coming sub .92→1.05rem, coming desc .85→.98rem
  - Mission Control (chores HQ): title .9→1.05rem, date .78→.92rem, section-hdr .68→.82rem, mission-name 1.0→1.15rem, pts .8→.95rem, GO button 1.1→1.25rem
  - Engineer: name 1.2→1.4rem, WO name 1.02→1.15rem, tab .82→.95rem, WO section-hdr .76→.88rem, hist-name .88→1.0rem, rank-line .74→.84rem
  - Baker: ticket-name .95→1.1rem, go-btn .88→1.02rem, log-name .88→1.0rem, section-hdr .9→1.05rem, tab .85→.98rem, stat-lbl .65→.80rem, menu-name .95→1.1rem
  - Dinos: card-name .88→1.0rem, go-btn .78→.92rem, log-type .68→.82rem, log-name .82→.95rem, section-hdr .68→.82rem, tab .72→.85rem, stat-lbl .55→.70rem, supply-name .88→1.0rem
  - HP: scroll-name .88→1.0rem, cast-btn .82→.95rem, log-type .72→.85rem, log-name .9→1.05rem, vault-name .9→1.05rem, section-hdr .68→.82rem, tab .72→.85rem, stat-lbl .55→.70rem
  - Kid mode (+25% vs DBZ): card-name 1.05→1.25rem, tab .9→1.05rem, strip .8→.95rem, rank .7→.85rem, card-pts .9→1.05rem, store-name 1.05→1.2rem, store-cost 1.0→1.15rem
- ✓ Bundle: 346.6 KB. Deployed to Samba (JS only).

### ~~Session 6 — Home Care drill-down + coming-soon scaffolds~~ COMPLETE (2026-05-15)
- ✓ `rooms/maintenance.js` — new v0.6.0 aesthetic drill-down: stat strip (overdue/this week/next week), color-coded section headers, per-row description expand button, days badge (overdue/soon/ok). Flipped to live in ROOMS registry.
- ✓ `rooms/smarthome.js` — coming-soon screen with feature bullets: Lighting Control, Climate, Irrigation, Kid-safe Access. Badge: COMING IN v0.9.0.
- ✓ `rooms/meals.js` — coming-soon screen with feature bullets: Tonight's Dinner, Weekly Menu, Grocery List, Recipes & Notes. Badge: COMING IN v0.7.0.
- ✓ `rooms/calendar.js` — coming-soon screen with feature bullets: Today at a Glance, Chore Reminders, Family View, Any HA Calendar. Badge: COMING IN v0.8.0.
- ✓ `rooms/index.js` — added `render()` to all ROOMS entries; replaced `htmlComingSoon` dispatch with generic `room.render(this)` in FamilyHubCard.js.
- ✓ `css.js` — new `.fh-maint-*` maintenance drill-down block + `.fh-room-feature-*` feature-list block.
- ✓ Bundle: 356.6 KB. Deployed to Samba (JS only).

### ~~Session 7 (partial) — Admin refresh~~ IN PROGRESS (2026-05-16)
- ✓ Admin shell rewrite: responsive sidebar (≥1100px) + bottom tab-bar (narrow)
- ✓ 5 new sections: Today (unified queue + activity + stat strip), Family (person cards), Tasks (chores), History (log), Settings (config + store)
- ✓ Approvals + redemptions unified into Today "Needs your attention" queue
- ✓ Store inventory moved from standalone tab into Settings section (2-column on wide)
- ✓ History log moved from Approvals tab into dedicated History section
- ✓ Dark AD color palette (#0E1622 base) with container-query responsive layout
- ✓ All modal-triggering data-* attributes preserved exactly (zero regressions)
- ✓ Bundle: 372.7 KB. Deployed to Samba (JS only).

### ~~Session 7b — Typography floor + viewport media queries~~ COMPLETE (2026-05-16)
- ✓ Added `--fh-text-xs/sm/base/md/lg/xl/2xl` tokens to `:host` (12px floor through 36px hero)
- ✓ Mass-bumped all sub-0.75rem font-sizes across css.js to 0.75rem floor (themes, modes, kid mode)
- ✓ Bumped inline avatar font sizes and pts-badge sizes in modes-admin.js to floor
- ✓ Switched admin shell from `@container` to `@media` queries — sidebar now appears when *viewport* ≥1100px regardless of HA card column constraint
- ✓ Removed `container-type: inline-size` from `.fh-ad-shell` (no longer needed)
- ✓ Refactored admin CSS to use typography tokens consistently
- ✓ Buttons/topbar/panel padding bumped for comfortable reading
- ✓ Bundle: 374.3 KB. Deployed to Samba (JS only).
- ⏳ Remaining S7: visual polish to match design ref personality (corner brackets, mono section headers), version bump

### ~~Session 8 — Themed personal pages reworked (Direction A)~~ COMPLETE (2026-05-16)
- ✓ Direction A chosen ahead of session per handoff §4 (compact row + right theme-rail). Skipped A/B/C live toggle — confidence was high enough to commit.
- ✓ Engineer (Jim): blueprint stat rail — `// TODAY · KPIS`, `// RANK · TRACK`, `// STREAK · CONSTELLATION`, `// SHEET · A-101`. Dim-segment streak bars. Compact rows: `[icon] [WO-001 · CAT + name + chips] [+pts] [STAMP]`.
- ✓ Dinos (Spencer): kraft folder rail — `// FIELD KIT · TODAY`, `// DIG STATUS`, `// FOSSIL RECORD` (footprint streak bars), `// RECENT FINDINGS`.
- ✓ HP (Olivia): parchment rail — `~ HOUSE STANDINGS ~`, `~ O.W.L. PROGRESS ~`, `~ SPELLWORK STREAKS ~` (gold star bars), `~ OWL POST ~`.
- ✓ Baker (Shannon): recipe-card rail — `~ the pantry today ~`, `~ promotion track ~`, `~ hot streaks ~` (terracotta dot bars), `~ today's tickets ~`.
- ✓ Classic (fallback): dark rail using user's avatar color — OVERVIEW (4-cell KPIs incl. PENDING), RANK, STREAKS (segmented bar in avatar color), RECENT WINS.
- ✓ DBZ (Jackson, rare adult view): comic-card rail — POWER LEVEL, NEXT FORM, CHARGE STREAKS (⚡ bolt bars), NEXT POWER-UP (replaces bottom next-bar when rail is active).
- ✓ Shared helpers extracted to `themes/_shared.js`:
  - `getActiveStreaks(attr, naAttr, person, max)` — unions `naAttr.people[].streaks` dict with task-row streak fields. Returns rows with `{chore_id, name, streak, milestone, bonus, chore}`. Handles retired/missing chores via task-row name fallback.
  - `computeStreakProgress(streak, milestone, maxSegs)` — rolling milestone math. Returns `{goalSegs, filledN, countLbl}`. Bar fills toward next bonus; resets to full on milestone hit. Falls back to 7-segment weekly bar when no milestone is set.
- ✓ Rank bar themable via CSS vars: `--fh-rb-track`, `--fh-rb-drop`, `--fh-rb-status`. Paper themes (`.fh-dn-page`, `.fh-bk-page`, `.fh-hp-page`) and DBZ rail panels override to sepia/dark. Engineer + Classic keep the dark defaults.
- ✓ Layout: viewport `@media (min-width: 900px)` flips body to `1fr / 480px` grid. Below 900px, rail collapses underneath rows. Single layout pattern across all six themes.
- ✓ Echo Show red-exclamation race acknowledged as downstream HA + Silk-browser issue. Deferred fix (card-stub split) noted; v0.6.0 lives with it.
- ✓ Iteration 2 — row anatomy reworked: descriptions, penalty hint, chip stack moved to right column.
  - Each row body now shows: `[icon] [NAME / description / −Npts if skipped] [streak chip ⟂ status chip] [+pts] [BUTTON]`
  - Penalty hint always visible when `penalty_enabled` (not just when overdue)
  - Streak + status chips moved out of the body into a vertical chip-stack column to the right
  - Classic theme switched from `?`-toggle description to always-visible (parity with other themes)
  - Engineer stamp button gained a gold ✓ icon
- ✓ Iteration 3 — kid-mode rearchitected as per-theme card grid (replacing the unified `renderKidMode()`):
  - `child_mode=true` adds `.kid-large` class on each theme's page wrapper instead of forking the render path
  - Standardized card grid: `repeat(auto-fill, minmax(190px, 1fr))`, gap 14px, `min-height: 240px` baseline
  - Section headers `grid-column: 1 / -1` so they span full row (fixed bug where MORNING/EVENING was taking a cell)
  - Buttons pinned to card bottom via `margin-top: auto` (uneven name lengths still produce aligned buttons)
  - Names wrap with `word-break: break-word; hyphens: auto`
  - Icons bumped to 64px SVG / 96px wrapper boxes across all themes
  - Descriptions and penalty hints hidden in kid mode (pre-readers)
  - Theme palette / borders / fonts fully preserved — kid mode is the same theme rendered as a card deck
- ✓ Bundle: 420.1 KB. Deployed to Samba.
- ✓ Iteration 4 — kid-card icon scaling: SVG bumped to 120px filling a 144px wrapper. Required `!important` overrides on `.fh-chore-icon` since the wrapper span carries inline `width/height` from `choreIcon()`.
- ✓ Iteration 5 — pending-approval optimistic UI: `_pendingSubmit` Set on FamilyHubCard tracks task IDs that the kid has tapped but the sensor hasn't yet confirmed. Dispatch adds tid on complete, clears after a 35s timeout (covers the 30s sensor poll). Every theme's row renderer checks `card._pendingSubmit.has(task_id) || t.status === "pending_approval"` and swaps the action button for a disabled "Pending Approval" tile (theme-styled — dashed border, no rotation, muted accent). Fixes the bug where kids retap thinking nothing happened.
- ✓ Bundle: 423.8 KB. Deployed to Samba.
- ✓ Architectural followup logged for S9: every theme still has its own row HTML even though the data + positions are identical. Next session opens with a shared row component to consolidate.

### ~~Session 9 P1 + Cleanup — Shared row component~~ COMPLETE (2026-05-16)

- ✓ `htmlChoreRow(t, cfg, person, card, opts)` + `htmlAddReminderCTA(person)` added to `_shared.js`. Emits uniform DOM: `[lead?] [icon] [body: kicker?/name/desc?/penalty?] [chips: streak/status/firing/expiry] [pts] [btn]`. Themes pass `rowConfig` with `kickerFormat`/`leadFormat` (one or the other, or neither), `btnLabel`/`btnIcon`/`btnPendingLabel`/`reminderBtnLabel`, `streakIcon`, `statusFormat` (breach/resetSoon/firing/expiry), `iconColor`. ~10 keys total per theme. Pending tasks render through the same row — `isSubmitted` swaps to dashed pending button.
- ✓ All 6 themes ported. ~340 lines of duplicated `_woRow`/`_fieldCard`/`_scroll`/`_ticket`/`_missionRow`/`mkRow` deleted; replaced with one `htmlChoreRow(t, themeRowConfig, person, card)` call per theme. Each theme now exports a tiny `<theme>RowConfig` object.
- ✓ Three classic-only features now propagated to all themes via shared template: reminder-type rows (`.fh-row--reminder` modifier + `reminderBtnLabel` button), daily-penalty-firing chip (`.fh-row-chip--firing`), expiry chip (`.fh-row-chip--expiry`, fires when ≤2 days left). Classic also keeps its `htmlAddReminderCTA` at top of list.
- ✓ Classic folded under `.fh-row--classic` instead of staying on `fh-task-row`. `--row-color` (person avatar color) threaded via inline style on the containing `.fh-row-list`. `fh-task-row` retained in css.js for admin/CC/maintenance reuse — those modes still use it untouched.
- ✓ CSS reorg: new base `.fh-row-*` block in css.js owns flex row layout, chip stack column, kid-large card-grid flip (`repeat(auto-fill, minmax(190px, 1fr))`, `min-height:240px`, button `margin-top:auto`, icon 144px box with 120px SVG via `!important`), pending-button styling, add-reminder CTA. Six per-theme `.fh-row--<key>` override blocks supply palette/fonts/borders/button shape only. Engineer corner ticks done via CSS gradient pseudo-elements (no JS chrome). HP wax-seal icon container + circular pts seal preserved as overrides. DBZ icon energy-aura ported to `::before` pseudo-element on shared icon class.
- ✓ Deleted dead CSS (~13 KB total): 155-line kid-large per-theme override block, 33-line per-theme pending-approval button block, 75-line S8 desc/penalty/chip-stack block, 5 dead row-container blocks across per-theme sections, `.fh-dn-specimen-tag`, `.fh-hp-period-label`. Kept classes still referenced by store/rail/history sections (`fh-eng-wo-name`, `fh-eng-chip`/`-streak`, `fh-eng-tick`, `fh-eng-pts-stamp`/`-num`/`-lbl`, `fh-eng-stamp-btn`, `fh-eng-status`, `fh-eng-dim-*`, `fh-bk-go-btn`, `fh-dn-pts-tag`/`-go-btn`, `fh-hp-pts-seal`/`-cast-btn`, `fh-dbz-go-btn`).
- ✓ Cleanup: deleted `renderKidMode` + `_kidTasks`/`_kidTaskCard`/`_kidStore`/`_kidHistory` from `_shared.js` (~180 lines), deleted entire `.fh-kid-*` CSS block (~208 lines), deleted legacy `htmlXPBar`/`getRank`/`getNextRank`, removed now-unused imports (`HISTORY_META`, `fPts`, `ini`, `groupHistorySkipped`) from `_shared.js`. Updated stale dbz.js header comment that referenced `renderKidMode`. `_expandedDescs` audit: still actively used by admin chore editor + maintenance description toggles — kept.
- ✓ **Architectural payoff: adding a new theme is now one config object (~10 keys) + one `.fh-row--<key>` CSS color block.** No `_row` helpers anywhere; no per-theme row HTML.
- ✓ Bundle: 412.3 KB. Net −11.5 KB vs S8 baseline (423.8 KB) — the shared component + 6 override blocks come in well under the dead code they replaced.
- ✓ Deployed to Samba; user signed off on Echo Show eyeball pass.

### ~~Session 9 P2 + P3 — Mission Control + Admin polish~~ COMPLETE (2026-05-17)

> Bundle grew from 412.3 KB → 439.5 KB (P2+P3 items 1-4) → 453.5 KB (P3 item 5)

**Priority 1 — Shared row component + CSS reorg.** Pull the row anatomy into `themes/_shared.js` so themes only configure (not re-author). Goal: a new theme should be a config + a CSS color block, nothing more.

- Add `htmlChoreRow(t, theme, person, opts)` to `_shared.js` — emits a uniform DOM:
  ```
  fh-row fh-row--{themeKey}
    fh-row-corner          (optional: WO-001 / SP-001 / P1 / step number)
    fh-row-icon
    fh-row-body
      fh-row-name
      fh-row-desc
      fh-row-penalty
    fh-row-chips           (streak / status chips, vertical stack)
    fh-row-pts
    fh-row-btn             (theme-provided label, optional icon)
  ```
- Theme config object adds: `cornerFormat`, `btnLabel`, `btnIcon`, `streakIcon`, `streakColor`, `statusColors`
- All row positioning + sizing moves to shared `.fh-row-*` base classes
- Theme-specific styling is *only* color/font/border overrides on the same selectors via `.fh-row--engineer { ... }`
- Same renderer powers adult-mode (row layout) and kid-mode (card-grid via `.kid-large`)
- Delete per-theme row HTML (`_woRow`, `_fieldCard`, `_scroll`, `_ticket`, `_missionRow`) and per-theme row CSS blocks (`.fh-eng-wo`, `.fh-dn-card`, etc.); replace with overrides on shared classes
- Goal: dropping a new theme = one config object + one CSS color block, nothing else

**Priority 2 — Mission Control rebuild.** Now that the shared row exists, reuse it.

- `modes-cc.js` → `modes-chores.js`. Keep `modes-cc.js` as back-compat shim for one release.
- Compact-row pattern in the main column using the new shared row.
- Right sidebar: agent roster filter, Intel Alerts (approvals), Open Ops (claimable), status footer. Reference `docs/design-reference/v1-mission-control.jsx`.

**Priority 3 — Admin polish.**

- Desktop admin layout — port `docs/design-reference/admin-desktop-*.jsx` as a responsive enhancement to existing admin mode (breakpoint ~1200px).
- Enhanced chore builder — restructure the chore editor modal for clarity (recurrence section, penalty section, streak section, icon picker).
- Icon picker categories — group icons by category in the visual grid rather than flat list.
- Per-person theme dropdown polish + codename field UX from `admin-family.jsx`.
- Hub Layout section in Settings — toggle room status, weather entity, calendar entities.

**Cleanup tasks.**

- Remove dead code from `themes/_shared.js`: `renderKidMode`, `_kidTasks`, `_kidTaskCard`, `_kidStore`, `_kidHistory`, the legacy `htmlXPBar`, `getRank`, `getNextRank`.
- Remove dead CSS: `.fh-kid-*` block in `css.js` (the old unified kid-mode CSS, no longer referenced).
- Remove `_expandedDescs` infrastructure from FamilyHubCard.js if `?`-toggle isn't used anywhere else after classic switched to permanent descriptions.

### ~~Session 10 — Desktop admin layout (P3 item 5)~~ COMPLETE (2026-05-17)

**Admin Tasks section: master-detail layout with sortable + collapsible chore table.**

- ✓ **1280px breakpoint** — Tasks section flips to a 2-column grid: `1fr 480px` (matching the 480px personal-page and Mission Control rails). Below 1280px: single-column, edit-button-opens-modal (phone behavior unchanged). Above: row click opens inline panel, edit button CSS-hidden.
- ✓ **Sortable column headers** (sort bar above category groups) — Name / Pts / Category / Assignees. Click = sort asc. Second click = reverse. Third click = clear. State on `card._adminSort = { col, dir }`. New dispatch cases: `sort-admin-chores`.
- ✓ **Collapsible category groups** — old `.fh-section-title` + `.fh-task-list` replaced by `.fh-ad-cat-hdr` (clickable chevron header) + group body. Chevron rotates −90° when collapsed. State on `card._adminCollapsedCats: Set<string>`. New dispatch: `toggle-admin-cat`.
- ✓ **Row selection** — `data-act="select-chore-row" data-cid` on each `.fh-task-row`. Selected row gets `.fh-task-row--selected` highlight (blue left border + tinted bg). State on `card._adminSelectedChoreId`. New dispatch: `select-chore-row`.
- ✓ **Inline editor panel** — `_htmlChoreEditorPanel(chore, people, catLabels)` in `modes-admin.js`. Shows full chore form when a chore selected; "↖ Select a chore to edit" placeholder when none. Has header (chore name + ✕ close) + scrollable body (full form) + sticky footer (Save + Delete). New dispatch: `close-chore-panel`, `ok-edit-chore-inline`.
- ✓ **Shared form fields** — `choreFormFields(chore, isEdit, people, catLabels)` extracted from `mChoreForm` in `modals.js` and exported. `mChoreForm` now calls `choreFormFields` + `mWrap`. Inline panel calls `choreFormFields` directly. Both use the same `m-*` element IDs — safe because opening any chore modal always clears `_adminSelectedChoreId` first (enforced in `open-add-chore` and `open-edit-chore` dispatch cases), so panel and modal are never simultaneously in the DOM.
- ✓ **`delete-chore` clears panel** — dispatch now sets `card._adminSelectedChoreId = null` before calling service, so the panel closes immediately on delete rather than waiting for the sensor refresh to null it out via `chores.find()`.
- ✓ **CSS** — `.fh-ad-tasks-wrap` (1-col / 2-col grid), `.fh-ad-tasks-panel` (480px sticky side panel, display:none on mobile), `.fh-ad-tasks-panel-*` panel anatomy, `.fh-ad-sort-bar` + `.fh-ad-sort-btn`, `.fh-ad-cat-group` + `.fh-ad-cat-hdr` + `.fh-ad-cat-chevron`, `.fh-task-row--selected`, admin context overrides for form fields inside `.fh-ad-tasks-panel-body`.
- ✓ Bundle: 453.5 KB (+14 KB from P3 items 1-4 baseline of 439.5 KB). Build clean.

### ~~Session 11 — Release + cold-load fix + dead code sweep~~ COMPLETE (2026-05-17)

**Cold-load race fix — card-stub split.**

- ✓ `src/main.js` rewritten as a ~6 KB IIFE stub. Registers `<family-hub-card>` and `<family-hub-card-editor>` synchronously so Lovelace's "Custom element doesn't exist" warning never fires. Stub paints a "Loading Family Hub…" pulse-dot placeholder while it lazy-imports the body bundle.
- ✓ New `src/body.js` entry point — registers `<family-hub-card-impl>` and `<family-hub-card-editor-impl>` (the real heavy implementations). Built as ESM at `family-hub-card-body.js` (~447 KB).
- ✓ Stub wrappers buffer `setConfig` / `hass` until body resolves, then create the impl element inside their shadow root and forward both values. `getCardSize()` returns 5 as fallback.
- ✓ Cache-bust query string inherited from the stub's own `<script src=…>` URL onto the body fetch URL — both files refresh together on each release without manual config-URL bumps.
- ✓ `package.json` build scripts now produce both bundles: `build:stub` (IIFE) + `build:body` (ESM), with `build` running them sequentially. Separate `watch:stub` / `watch:body` for dev.
- ✓ Tested on Chromium + Silk-style cold cache: stub paints in <50ms even on a fresh-cache Echo Show. No more red-exclamation race.

**Dead CSS cleanup.**

- ✓ Removed `.fh-icon-picker-trigger`, `.fh-icon-picker-trigger-label`, `.fh-icon-picker-chevron`, and the toggleable `.fh-icon-picker-grid` rules — orphaned since S11 collapsed the icon picker into an always-visible inline grid (`.fh-chore-icon-grid`).
- ✓ Removed admin-context override rules for the deleted classes (`.fh-ad-tasks-panel-body .fh-icon-picker-*`).
- ✓ Kept `.fh-icon-picker-cat-hdr` + `.fh-icon-picker-cat-grid` — still used as descendants of the new `.fh-chore-icon-grid`.

**Chore form: tabbed sub-panels + always-visible icon grid.**

- ✓ `choreFormFields` refactored into 4 tabs — **Details** (name / description / icon / type+category / assignees), **Schedule** (recurrence + day chips + expiry + claimable subtype), **Points & Rewards** (points / approval / penalty / streak milestones), **Reminders**. Tabs use a single shared CSS-only switcher (no re-render on tab change → user input on inactive panes is preserved).
- ✓ Card state `_choreFormTab` (string, default `"details"`). Reset on modal close, panel close, and after save. New dispatch `chore-tab` does direct DOM manipulation only — no `_doRender` call.
- ✓ Icon picker dropdown killed entirely. Grid renders inline in the Details tab, always visible, with internal-only scroll capped at 320px height. Categorized headers + per-category sub-grids preserved.
- ✓ Inline editor side panel refit: removed `position: sticky`, removed `max-height` + `overflow-y: auto` from the body. Reused `.fh-ad-panel` chrome (bg, border, radius, header padding) so the panel and list-panel headers line up exactly.
- ✓ Re-render freeze while inline panel open — `_maybeRender()` now bails when `_adminSelectedChoreId` is set, mirroring the modal-open protection. Sensor refreshes no longer wipe typed-but-unsaved field values.

**Release.**

- ✓ `manifest.json` 0.5.0 → 0.6.0
- ✓ `hacs.json` 0.5.0 → 0.6.0
- ✓ `constants.js` VERSION 0.5.0 → 0.6.0
- ✓ README updated
- ✓ `RELEASE-NOTES-v0.6.0.md` written
- ✓ Build: stub 6.4 KB + body 447.1 KB. Deploy via Samba.
- ✓ Committed + tagged + pushed.

---

## Deferred (not in v0.5.0 or v0.6.0)

- **Success-rate "overall" streak system** (v0.6.1 candidate, raised S9 P2). Today every chore has its own streak; what's missing is a person-level metric: "completed ≥X% of daily missions for N days running." Needs:
  - Backend state on person: `completion_streak` (int), `completion_threshold_pct` (configurable, default 80%), `completion_milestone` (default 7 days), `completion_bonus_points` (default 50), `last_completion_eval_date`.
  - Backend tick logic (daily): compute yesterday's hit rate = `approved_or_completed_count / (approved_or_completed_count + skipped_count)`. If ≥ threshold → increment streak. If < threshold → break to 0. Fire `streak_bonus_points` every `completion_milestone` days exactly like the per-chore milestone system from v0.5.0 S4.
  - Admin UI: per-person fields (threshold %, milestone days, bonus pts) in Edit Person modal.
  - Card display: replaces the now-removed streak slot on Mission Control agent cards (`{streak}d · {pct}% LAST 7`). Also surfaces on themed personal pages as a fourth rail panel (or merges into existing Rank panel).
  - History events: `completion_streak_milestone` entries with bonus points awarded.
  - Open question: weekly chores complicate "did you hit X% yesterday?" math — likely treat weekly/monthly as "due-today-or-not" and only count chores actually due that day.
- **Claimable picker UX redesign** (v0.6.1 candidate, raised S9 P2). The current claim modal is a `<select>` dropdown listing eligible people. On Echo Show 15 touch input this is awkward. Replace with a card-grid picker: each eligible person as a tappable tile (avatar + codename), single-tap to claim. Reuses the existing claim flow; only the modal UI changes. Lives in `modals.js`.
- **Bigger completion buttons on Mission Control + adult themes** (v0.6.1 candidate, raised S9 P2 i2). The `.fh-mc-go-mini` buttons (48×~52px) and the `.fh-row-btn` on adult themes feel undersized for their rows — the Echo Show 15 has plenty of touch real estate, and even on bedroom Shows the buttons should be more thumb-confident. Aim for ~64px min-width × 60-64px tall (matches kid-mode's button size). Kid-mode buttons are already at this size; don't touch those.
- **Achievements / badges engine** — defer until ranks have lived in the wild. `history_log` is the event stream a future engine reads from.
- **Per-theme audio cues** via `alexa_media_player` — fun but a rabbit hole.
- **Meals room actually doing things** — slated as v0.7.0 headline feature.
- **Calendar room actually doing things** — slated as v0.8.0 headline. Will power the home today-strip.
- **Smart Home room actually doing things** — slated as v0.9.0. Permission-gated controls for kids.
- **Chore rotation** — rotating assignment pool (this week Jackson, next week Olivia).
- **Goal tracking** — kid sets a store item as a savings goal with progress bar. Natural fit for themed personal pages after v0.6.0 settles.
- **Photo evidence for approvals** — defer.
- **Theme builder UI** — let parents author themes without editing code. v1.0.0 candidate.

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
- **Kid-mode = separate render path (v0.6.0 S5):** `child_mode: true` on a person triggers `renderKidMode()` from `_shared.js` — a completely different HTML structure (big-icon-grid, DBZ visual language, huge tap targets) rather than CSS overrides on the normal theme layout. Each theme provides a `KID_PALETTE` of CSS vars. Never re-litigate: font-size scaling alone is not enough for pre-readers; they need the full big-icon-grid layout.
- **Design reference proportions (v0.6.0 S5):** Design JSX files are authored for 1920×1080 full-screen. The Lovelace card is ~400px wide. All decorative sizes (frames, watermarks, corner ornaments, tape strips) must be scaled down ~40-60% from the reference dimensions. When adding future decorative elements from design refs, halve the size first then adjust visually.
- **CSS z-index on themed pages:** Never use `.fh-XX-page > * { position:relative; z-index:N }` — it pulls absolutely-positioned watermarks/frames/corners into normal flow. Use explicit named selectors for only the content elements that need z-index promotion.
- **Typography hard floor (v0.6.0 S7):** 12px / 0.75rem absolute minimum, no exceptions. Use `--fh-text-xs/sm/base/md/lg/xl/2xl` tokens from `:host` block in `css.js`. Body content defaults to `--fh-text-base` (16px). User has significant uncorrected prescription; this is an accessibility requirement, not a preference. Design refs (1920×1080 JSX) often use sub-12px text — scale up when porting to production.
- **Layout switching in HA cards:** Use viewport `@media` queries, NOT `@container` queries. HA Lovelace cards in standard sectioned dashboards are column-constrained (~400–600px) even on desktop. Container queries only work if the card is in a Panel view (`panel: true`). Media queries respond to the actual viewport and work in both modes.
- **Themed personal-page two-column layout (v0.6.0 S8):** All six personal-page themes use the same `body.has-rail` two-column pattern: `1fr` content + `480px` rail at `@media (min-width: 900px)`, single-column below. Rail is rendered only on the tasks tab; store/history get the full width. Each theme owns four rail panels: KPIs, Rank, Streaks, Theme-specific (Findings/Owl Post/Tickets/Wins/Next Power-up/Sheet).
- **Streak source-of-truth (v0.6.0 S8):** Use `getActiveStreaks()` in `themes/_shared.js`, which unions `naAttr.people[].streaks` dict (authoritative for any chore the person has ever streaked on) with task-row `.streak` fields (covers lazy-populated dict gaps). Do NOT pull streaks only from `tasks_due_today_list` — a weekly chore on a 14-day streak only appears on its reset day in that list, but the streak is still active.
- **Rolling streak milestones (v0.6.0 S8):** Backend (Session 4) fires `streak_bonus_points` every `streak_milestone` completions on an ongoing basis (not once). Display via `computeStreakProgress(streak, milestone, maxSegs)` — bar fills toward next milestone using `streak % milestone`, resets to full bar when sitting exactly on a milestone, and shows `next Nd` countdown. With no milestone configured, falls back to a 7-segment weekly bar.
- **Themable rank bar (v0.6.0 S8):** `.fh-rank-bar-*` uses CSS vars `--fh-rb-track`, `--fh-rb-drop`, `--fh-rb-status` with white-on-dark defaults. Light/paper themes (`.fh-dn-page`, `.fh-bk-page`, `.fh-hp-page`) override to sepia. DBZ rail panels override to ink-on-white. Set on the theme's page wrapper, not on the bar itself.
- **Card-stub split (v0.6.0 S11):** Cold-load race FIXED. `src/main.js` is a ~6 KB IIFE stub that registers `<family-hub-card>` and `<family-hub-card-editor>` synchronously, paints a "Loading…" placeholder, and lazy-`import()`s the body bundle (`family-hub-card-body.js`, ~447 KB ESM). Stub wrappers buffer `setConfig` / `hass` until the body resolves, then create the real `<family-hub-card-impl>` element inside the wrapper's shadow root. Body URL inherits the stub's cache-bust query string so both files refresh together. **Never collapse this back into a single bundle** — the Echo Show Silk browser and slow phones depend on the stub painting before the body finishes downloading. Package builds two outputs via `build:stub` and `build:body` scripts.
- **Kid mode is a CSS modifier, not a render fork (v0.6.0 S8):** `child_mode=true` adds `.kid-large` to the page wrapper and a per-theme CSS block flips the row list to a card grid. Same render path, same DOM, same data — different layout. Supersedes the original "kid mode = separate render path with big-icon-grid for everyone" decision from S5. Each theme keeps its full personality in kid mode; only the layout switches to cards + bigger touch targets. The S5 `renderKidMode()` helper in `_shared.js` is dead code retained for one release; remove in S9 cleanup.
- **Themed personal-row anatomy is identical across themes (v0.6.0 S8, enforced in S9):** Every adult row carries `[lead?] [icon] [body: kicker?/name/desc?/penalty?] [chips: streak/status/firing/expiry] [pts] [BUTTON]` in that order. Themes differ ONLY in palette, fonts, borders, button label/shape, streak icon, status text. S9 extracted `htmlChoreRow(t, cfg, person, card, opts)` + base `.fh-row-*` CSS; themes export a `<theme>RowConfig` object (~10 keys) and a `.fh-row--<themeKey>` CSS color block. Adding a new theme is now JUST those two things — no `_row` helpers anywhere. Kicker (above name) and lead (before icon) are both optional template slots so a new theme can pick whichever fits its aesthetic. Reminder-type rows, daily-penalty-firing, and expiry chips all render uniformly across all 6 themes (were classic-only before S9).

---

## Known Data Contracts (v0.4.2)

**`sensor.family_hub_needs_attention` key attrs:**
`approval_queue`, `redemption_queue`, `people` (includes `penalties_paused`, `streaks`, `allowance_*`, `notify_target`, `code`, `theme_key`, `child_mode` per person),
`active_chores` (includes `icon`), `store_items`, `family_name`, `points_per_dollar`, `show_dollar_value_to_kids`,
`category_labels`, `penalties_paused_global`, `penalty_alert_time`, `rooms_config`, `weather_entity`, `today_calendar_entities`, `history_log`

**`sensor.family_hub_[name]` key attrs:**
`person_id`, `person_type`, `avatar_color`, `active`, `code`, `theme_key`, `lifetime_points`, `dollar_value`,
`show_dollar_value`, `tasks_due_today_list`, `tasks_overdue_list`, `tasks_pending_approval_list`,
`store_items`
Each task row includes: `task_id`, `chore_id`, `name`, `description`, `icon`, `points`, `due_date`,
`status`, `chore_type`, `category_label`, `penalty_enabled`, `penalty_points`,
`expires_after_days`, `is_one_time`, `streak`, `days_overdue` (overdue list only)

**`sensor.family_hub_claimable_tasks`:** `tasks` (claimable only), `all_tasks` (command center)

**`sensor.family_hub_maintenance_due`:** `overdue`, `due_this_week`, `due_next_week`, `next_item`, `next_due_date`, `next_due_days`, `items`

**`sensor.family_hub_today` (v0.6.0 new):** state=0, `schedule=[]` — placeholder, populated when Calendar room ships

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
| v0.6.0 | "The Front Door". Command Center home page with person tiles + room tiles. Six personal themes (Classic, Engineer, Baker, Dinos, Harry Potter, DBZ) with shared row anatomy. Kid-mode card grid. Mission Control chores HQ. Maintenance drill-down. Desktop admin master-detail layout with tabbed chore editor. Card-stub split fixes Echo Show cold-load race. |

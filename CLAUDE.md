# Family Hub — Project Notes (CLAUDE.md)
> Persistent project memory loaded at the start of every Claude Code session.
> Read top to bottom before touching code. Update at session end.
> Repo: https://github.com/Rathnokan/family-hub

---

## Supporting Files

Stable reference docs split out of this file. Read them when the topic is relevant.

- **[ROADMAP.md](ROADMAP.md)** — Active scope, next-version plans, deferred backlog, long-term roadmap. Read when picking the next task.
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Repo layout, data flow, module responsibilities, build process, HA integration lifecycle, frontend architecture (lifecycle, render pipeline, dirty-check, modals, dispatch, drag-drop), CSS/theming system. Read when designing a new feature or navigating an unfamiliar part of the codebase.
- **[DECISIONS_LOG.md](DECISIONS_LOG.md)** — Every non-obvious architectural decision with the reason and the trap that motivated it. Read when you're about to make a structural change or you suspect a pattern is "weird for a reason."
- **[BUGS.md](BUGS.md)** — Open bugs by severity (blocking / high / low) + recently-fixed v0.6.x bugs for context. Read at session start; update when you find or fix something.

---

## SESSION START CHECKLIST

1. Read this file top to bottom (~3 min — it's short)
2. Skim [BUGS.md](BUGS.md) for anything in flight
3. Glance at [ROADMAP.md](ROADMAP.md) active scope for next task
4. Check live files via Samba: `\\10.0.0.41\config\custom_components\family_hub\`
5. **Python changes:** reload integration only (Settings → Devices & Services → Family Hub → Reload). No HA restart.
6. **JS changes:** browser hard refresh only (`Ctrl+Shift+R`). No HA involvement.
7. **Both changed:** reload integration → hard refresh → call `force_daily_tick` from Dev Tools → Services.

## SESSION END CHECKLIST

1. Update Current Status table (version, GitHub state, next release)
2. Update [ROADMAP.md](ROADMAP.md) if scope shifted — mark completed phases, add new items discovered
3. If new architecture decisions were made → add to [DECISIONS_LOG.md](DECISIONS_LOG.md), don't bury them here
4. If new bugs were found or fixed → update [BUGS.md](BUGS.md)
5. Commit to GitHub if stable
6. **Provide the user the exact prompt to start the next phase or patch in a fresh session.** Include any system-prompt addendum changes plus a self-contained opening message with file anchors (which methods/files to read first, what to propose before coding, where to wait for approval). The goal is that the user can paste the prompt into a cold session and it executes cleanly without rediscovery. See the "Phase handoff prompt" pattern below.

## Phase handoff prompt pattern

When you wrap a phase, patch release, or batch of bug fixes, hand the user a two-part prompt:

**Part 1 — System-prompt addendum** (only include if it changed; otherwise note "no change from last session"). This is the block the user pastes into the new session's system prompt.

**Part 2 — Opening message.** Self-contained, written so a cold agent with no prior context can execute. It should:
- Name the phase clearly (e.g. "Begin v0.6.5 Phase 2 — Admin UI for subscriptions").
- List the files / methods to read first as numbered steps, in order, with anchor names (function names, search strings) — not just "read the codebase."
- State what the agent must propose for approval before writing any code.
- Set the deploy mode (Python reload only / JS build + hard refresh / both / version bump).
- Close with: "When this phase is complete and live-tested, provide me the exact prompt to start the next phase in a fresh session." This keeps the chain going.

The handoff prompt is part of "Phase Complete" — do not declare a phase done without it.

---

## Current Status — 2026-07-11

| Item | State |
|---|---|
| **Live on HA (Samba)** | v0.7.7 on `main` (Meals module); verify deployed state at session start if it matters. |
| **GitHub / HACS** | **v0.7.7 SHIPPED** — Meals module, on `main`. **GitHub Actions CI green** on every push. (Prior tags: `v0.7.6` reward gates/weekly streak/phone surfaces, `v0.7.5` chores polish, `v0.7.3` make-up/partial-credit, `v0.7.2` Dynamic Ranks, `v0.7.1` bug-swat, `v0.7.0` Re-foundation. v0.7.4 skipped.) |
| **manifest.json / hacs.json / constants.js / const.py VERSION** | **0.7.7** (`iot_class` = `calculated`). |
| **Phase** | **v0.8.0 "Home Maintenance" — Phase A COMPLETE (A1–A6 done + live-tested, on `main`, CI green). Not yet released/tagged.** Plan: **[docs/PLAN-v0.8.0.md](docs/PLAN-v0.8.0.md)**. **A1** foundations plan · **A2** module framework + event bus (`event_bus.FamilyHubBus`, OptionsFlow+reload) · **A3** versioned export/import (`DATA_SCHEMA_VERSION 3`, validate-then-swap) · **A4** maintenance backend (own store domain, `_maintenance_schedule.py` derived-state, no task_instances, ~19 services; `assign` = bus offer/revoke only) · **A5** chores→maintenance migration + `_chore_is_maintenance` seam removal (live-migrated the one Maintenance chore) · **A6** chores/rewards gating (both toggles real; register-then-remove services, gated sensors/tick/model/tabs; core points survive both-off). **Phase B COMPLETE (2026-07-25):** seed library shipped to `custom_components/family_hub/seed_library.json` (v3.0.0, 97 tasks + 15 big-ticket assets, Tucson-tuned); provenance in `docs/research-phase-b/`. ⚠️ Library is dict-shaped → A4 stub loader no-ops until D1 (safe). D1 integration deltas catalogued in **[docs/PLAN-v0.8.0.md](docs/PLAN-v0.8.0.md) §9**. **Next: Phase C (Design) → Phase D (Code); D1 can start now (needs the library, not the design).** ⚠️ Deferred cosmetic: per-theme personal-page section-hiding when chores/rewards off (see BUGS.md). ⚠️ v0.7.6 phone surfaces still NOT device-tested. |

> **v0.7.6 is on `main` + tagged.** Future work: branch from `main`. Every push runs CI — keep it green before deploying.
>
> **Backlog (recommended order):**
> 1. **v0.8.0 Phase A sessions A2–A6** — implement [docs/PLAN-v0.8.0.md](docs/PLAN-v0.8.0.md) one session at a time (A2 module framework + event bus is next). Branch from `main`.
> 2. **model/history runtime trim (LOW — not currently a problem).** The card model caps `history_log` at **150 collapsed rows** (`get_history_for_card(limit=150)`) shipped over websocket (off the state machine since v0.7.0) — confirmed fine at family scale. Residual cost is only that `build_card_model` walks the full history to build those 150 rows each `data_rev`; revisit only if history grows huge. (Lazy per-view `family_hub/get_history` ws command stays the eventual fix.)
> 3. Smaller deferred items (slug divergence, dedupe, theme flavor text) — [BUGS.md](BUGS.md) "Open — deferred". All low-value/intentional.
> 4. **Done & shipped:** chore side-panel repurposed → Earning & Balance rail (v0.7.5); first-parent attribution → admin actor logging (v0.7.3); task-instance retention confirmed 30d; weekly-window mismatch fixed (v0.7.2).

---

## 🤝 SESSION HANDOFF — for the next session

> **Read this section before starting work.** Then run the Session Start Checklist above and pick up wherever the prior session left off.

### Where things stand (2026-06-08)

- **v0.7.5 shipped** (tag `v0.7.5`, GitHub release) — closes out the Chores module.
  - **Admin "Earning & Balance" rail** (`_htmlChoreStatsRail` + `_computeEarning` in `modes-admin.js`): per-kid weekly `$` headline + month + min–max range bar w/ "this week" dot; what-if controls (rank override / completion % / include-streaks + streak %) wired via `dispatch.js` (`stats-rank`/`stats-completion`/`stats-streak-pct` + `toggle-stats-streaks`) and the `FamilyHubCard.js` change-handler whitelist; monthly fairness bars, family payout, bonus pool, dynamic swing tip. Money is **rank-scaled** per kid (`rank_ppd_ladder`), not global ppd.
  - **In-list rotation dots** (`_choreRotationDots`) + **rotation-editor fix**: the editor renders the pool **current-first** (`rotPoolOrdered` in `modals.js`) so the live holder shows as Current and switching works (backend already snaps current to the new pool[0] active member when the pool order changes — `async_update_chore`).
  - **Daily-penalty grace**: on DAILY chores `daily_penalty_after_days` = consecutive-skip allowance (first N−1 free, then penalize every skip, reset on completion, pause transparent). `tick_mixin._skip_incomplete_instances` gates the skip penalty via `streaks_ranks_mixin._bump_skip_streak` (stored as `streaks[chore_id].skips`); reset in `_increment_streak`. Weekly/monthly keep the original escalating-within-window meaning.
  - **Printable chore list rebuilt** (`print-chore-list.js`): kids-only, Everyone section, per-kid weekly totals, rotation schedule table, penalty points shown, `$` standardised at Rank 3.
  - **Fixes/cleanup**: edit no longer scrolls to top (dropped `autofocus` on chore name, `modals.js`), rail scrolls independently (`css/part4.js` max-height), removed dead `_rotationSwitchLabel` + orphaned `ok-edit-chore-inline`/`close-chore-panel` dispatch cases.
- **History payload confirmed fine** — `get_history_for_card` caps at **150 collapsed rows** over websocket; stale "~1000-entry" doc note corrected. No change needed.
- **Samba is current.** Full writeup → [RELEASE-NOTES-v0.7.5.md](RELEASE-NOTES-v0.7.5.md).

### Next session (features)
1. Branch from `main`: `git checkout main && git checkout -b <feature>`. Every push runs CI — keep it green before deploying.
2. **Chores is tabled.** Next module: **v0.8.0 Home Maintenance** room CRUD — split Maintenance out of the chores `category_label` special-case into its own module.
3. Optional chores polish if you return: Rewards-side stats rail (parity with the chores rail), persist the rail's what-if controls across refresh, "advance rotation now" quick action.

### Sonnet system-prompt addendum (paste into the next session)

```
You are working on the Family Hub project (see CLAUDE.md at the project root).
Read CLAUDE.md top to bottom before touching any code — and consult
ROADMAP.md / ARCHITECTURE.md / DECISIONS_LOG.md / BUGS.md as the situation demands.

Do not bump versions, do not commit, and do not push without the user's
explicit "go" — the workflow is: write code → deploy via Samba → user
tests live → commit + tag + push only when a batch is stable.

When the user gives you an item, prefer surgical edits to small files over
sweeping refactors. The codebase has six themes (engineer, hp, dinos, baker,
dbz, classic) and adding a feature usually means touching each one. Use
shared helpers in src/card/themes/_shared.js when the same render logic
appears in more than two themes.

This is a Home Assistant custom integration. Every change must preserve the
integration's HA contract — service schemas, sensor entity_ids, sensor
attribute keys, config-flow entries, the integration's lifecycle (setup_entry
/ unload_entry), and the Lovelace static-path registration. Never break the
HA-facing contract for an internal cleanup win.

Default deploy command after a build is `npm run build` then copy these
files to \\10.0.0.41\config\custom_components\family_hub\ via PowerShell
Copy-Item:
  - custom_components/family_hub/www/family-hub-card.js
  - custom_components/family_hub/www/family-hub-card-body.js
  - any custom_components/family_hub/*.py you edited
Don't sync family_hub_data.json — it's user data, off-limits.

At the end of each phase (or patch release), provide the exact prompt the
user should paste to start the next phase in a fresh session. Include the
system-prompt addendum if anything has changed, plus the opening message
with file anchors so the next session can execute cleanly without rediscovery.

Be terse in responses. The user wants to ship features, not read prose.
```

---

## Environment

| Item | Value |
|---|---|
| **Family** | Parents: Jim + Shannon. Kids: Jackson, Olivia, Spencer |
| **Devices** | Echo Show 5, Echo Show 8, Echo Show 15 (kitchen — command_center only) |
| **Kitchen account** | Restricted HA account "Kitchen Display" |
| **HA version** | 2026.5.1 |
| **Add-ons** | Samba, File Editor, SSH & Web Terminal, HACS |
| **Data file** | `/config/family_hub_data.json` — never touched by code updates |

---

## File Locations

| What | Where |
|---|---|
| Backend source | `custom_components/family_hub/*.py` |
| Card source (modular) | `src/card/*.js` |
| Stub bundle | `custom_components/family_hub/www/family-hub-card.js` (~7 KB IIFE) |
| Body bundle | `custom_components/family_hub/www/family-hub-card-body.js` (~495 KB minified ESM) |
| Build command | `npm run build` (runs `gen-build-id` then `build:stub` then `build:body` via esbuild) |
| Live HA files | `\\10.0.0.41\config\custom_components\family_hub\` |
| Data file | `\\10.0.0.41\config\family_hub_data.json` — read-only for Claude |
| Design references | `docs/design-reference/*.jsx` — React/JSX mockups, not production code |

---

## Workflow

**Edit order is always: local repo → Samba → GitHub. Never the reverse.**

1. Edit source files in the local repo: `C:\Users\rathn\OneDrive\Documents\GitHub\family-hub\`
2. Copy changed files to the Samba share for live testing:
   ```powershell
   Copy-Item "custom_components/family_hub/foo.py" "\\10.0.0.41\config\custom_components\family_hub\foo.py"
   ```
3. Reload / hard-refresh on HA to pick up the change.
4. When stable: commit + push to GitHub. Do not commit without user's explicit "go".

**The Samba share is a deploy destination, not a source of truth. Never edit files directly on the share.** If the Glob tool returns no results for a source file, search the local repo path explicitly — do not fall back to editing on Samba.

- Python changes: integration reload only (not full HA restart)
- JS changes: browser hard refresh only
- Both changed: reload + hard refresh + `force_daily_tick`
- No need for a release for every small fix — use Samba until a batch is stable

---

## Version History

| Version | Headline |
|---|---|
| v0.1.0 | Core integration |
| v0.2.x | Auto-registration, dirty-check render, modal stability, visual editor |
| v0.3.0 | Full data model overhaul (assigned_to list, chore_type, categories, penalties, recurrence) |
| v0.4.x | Expiry, history log, admin correction services, force_daily_tick, penalty pause |
| v0.5.0 | Data health infrastructure, streaks, allowance, notifications, recurrence redesign |
| v0.6.0 | "The Front Door" — Command Center home, six personal themes, kid-large card grid, Mission Control, maintenance drill-down, desktop admin master-detail with tabbed chore editor, card-stub split |
| v0.6.1 | Person-level success-rate streak, claimable picker card grid, bigger completion buttons |
| v0.6.2 | Chores polish + phone-friendly pages: editor crash fix, money conversion in rail KPIs, dual `+/−` points medal, `<500px` responsive pass, `initial_view` card config, chore rotation pool |
| v0.6.3 | Store polish + group rewards: printable chore list, store goal tracking, drag-reorder, reward icons, rate limits, rank-scaled PPD, reward categories, group/shared rewards (chip-in) |
| v0.6.4 | Bug-fix release — rotation KeyError, corrupt JSON safety, maintenance mode broken import, dataset case bug, celebration overlay scope, force_daily_tick concurrency guard, dispatch dedup. See BUGS.md "Recently fixed". |
| v0.6.5 | Subscription rewards — recurring store items with lapse/cancel flow, 6 new services, kid subscription rail (all 6 themes), admin type toggle + cancellation queue + family-tab sub management. |
| v0.7.0 | **"Re-foundation"** — performance + architecture overhaul: event-driven (no 30 s poll), websocket data model + lean sensors (off the state machine/recorder), per-domain multi-store + debounced writes + safe auto-migration, minified bundle. Inactive-member management (reactivate / permanent-delete). GitHub Actions CI. Internal: `data_store.py` 4,815→624 lines via 11 mixins; `css.js` split. |
| v0.7.1 | Bug-fix & cleanup — correctness patch off a full-codebase audit (redemption overspend guard, $0 sub-override, lapsed-sub "Ready" math, wired Add-Task penalty, cancel-pending lapse notify, inline sub-editor freeze, history labels) + hardening, slug parity, dedup, dead-code/version-drift removal. |
| v0.7.2 | **"Dynamic Ranks"** — per-kid, per-rank gain/drop curves as percentage-of-capacity bands (curve editor + per-cell tweak); all theme ladders standardized to 5 rungs (rank survives theme swaps); consolidated **Ranks side-rail drawer** with global + per-kid tabs; Edit Person / Edit Settings converted from popups to drawers; two-line (drop+gain) capacity-spanned rank bar; card weekly-points window aligned to the configured eval weekday. Also: full-color **emoji chore/reward icons** (`FH_EMOJI`, keyed to `FH_ICONS`, legacy SVG fallback). |
| v0.7.3 | **Chores: make-up, partial credit & a cleaner editor** — partial credit (Approve/Partial/Deny 25/50/75, keeps streaks); late make-up claims (kid claims a skipped chore → approval queue → skip-penalty refund + partial-eligible); excuse-day; due/reset labels on rows; per-chore weekly **rotation switch day** + rotation rail (Current / Up Next, below streaks); chore editor rebuilt as a **3-tab side-rail drawer** (collapsible icon, multiline description, **monthly multi-day** `days_of_month`); **one-time + the Add Task quick flow removed**; person delete → red trash (lower-right); **admin actor logging** (`acting_as` → history `actor`, shows "· by …"). |
| v0.7.5 | **Chores: balance tools & polish** — admin "Earning & Balance" what-if rail (rank-scaled `$`, completion %, streak %, weekly range + dynamic swing tip); in-list rotation dots; **rotation-editor current-holder fix** (pool rendered current-first); **daily-penalty grace** (`daily_penalty_after_days` = consecutive-skip allowance on daily chores); rebuilt **printable chore list** (kids-only, Everyone + rotation schedule, penalty points, `$` at Rank 3); edit-scroll fix; rank-accurate money; dead-code cleanup. (v0.7.4 skipped.) |
| v0.7.6 | **Reward gates, weekly streak & phone surfaces** — per-reward unlock **gates** (`require_daily_pct` / `min_rank_index` + locked badge all themes); **bonus-chore claiming** (instance reconcile + claim rail); **fully dynamic ranks** (manual set + lock, computed weekly capacity replaces the manual capacity field); new **weekly-consistency streak** (N weeks ≥ threshold%, weekly chip + progress bar all themes, `weekly_completion_streak_milestone` history); **phone home-screen surfaces** — per-person `sensor.family_hub_<name>_widget` (no-template Android widget) + opt-in quiet self-replacing **checklist notification** with Done buttons (`checklist_notify`, `mobile_app_notification_action` → `complete_task`). Responsive admin family panel. ⚠️ Phone surfaces not yet device-tested. |

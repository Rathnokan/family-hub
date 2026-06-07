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

## Current Status — 2026-06-08

| Item | State |
|---|---|
| **Live on HA (Samba)** | v0.7.3 deployed + live-tested. |
| **GitHub / HACS** | **v0.7.3 SHIPPED** — "Chores: make-up, partial credit & a cleaner editor" on `main`, **tag `v0.7.3`**, GitHub release published (Latest). **GitHub Actions CI green** on every push. (v0.7.2 "Dynamic Ranks" before it: tag `v0.7.2`; v0.7.1 bug-swat: tag `v0.7.1`; v0.7.0 "Re-foundation": tag `v0.7.0`.) |
| **manifest.json / hacs.json / constants.js / const.py VERSION** | **0.7.3** (`iot_class` = `calculated`). |
| **Phase** | **v0.7.3 SHIPPED.** Partial credit (Approve/Partial/Deny 25/50/75), late make-up claims (kid claims a skipped chore → approval queue → penalty refund + partial-eligible), excuse-day, due/reset labels, per-chore weekly rotation switch day, rotation rail (Current/Up Next below streaks), chore editor rebuilt as a 3-tab side-rail drawer (collapsible icon, multiline desc, monthly multi-day), one-time + Add Task quick flow removed, person delete → red trash, and **admin actor logging** (logged-in HA user on admin actions). See [RELEASE-NOTES-v0.7.3.md](RELEASE-NOTES-v0.7.3.md). **Next → v0.7.4/v0.8.0** (branch from `main`). |

> **v0.7.3 is on `main` + tagged.** Future work: branch from `main` (`git checkout main && git checkout -b v0.7.4-xxx`). Every push runs CI — keep it green before deploying.
>
> **Backlog (recommended order):**
> 1. **Repurpose the chore detail side-panel** — the desktop master-detail right panel is now a placeholder ("Tap a chore to edit it in the side panel"); editing opens the drawer. Fill the panel with useful data (parked for a future cycle).
> 2. **model/history runtime trim.** `build_card_model` still ships the ~1000-entry `history_log` on `needs_attention`, refetched on every `data_rev` change. ⚠️ **Bigger than it looks:** consumed by the admin History view AND all 6 personal pages (`getWeeklyPts` header, per-person history tab, store rail's recent purchases). Doing it right = lazy per-view history (`family_hub/get_history` ws command, person-filtered) + async weekly-points header. Moderate refactor; test all themes.
> 3. **v0.8.0 Home Maintenance room CRUD** — split Maintenance out of the chores `category_label` special-case into its own module (roadmap).
> 4. Smaller deferred items (slug divergence, notification/history hardening, dedupe) — [BUGS.md](BUGS.md) "Open — deferred".
> 5. **Done & shipped:** first-parent attribution → resolved as admin actor logging (v0.7.3); task-instance retention confirmed 30d; weekly-window mismatch fixed (v0.7.2).

---

## 🤝 SESSION HANDOFF — for the next session

> **Read this section before starting work.** Then run the Session Start Checklist above and pick up wherever the prior session left off.

### Where things stand (2026-06-08)

- **v0.7.3 shipped** (tag `v0.7.3`, GitHub release). Chores batch:
  - **Partial credit** — `async_approve_task(... credit_fraction)`; approval queue is Approve / Partial(25/50/75) / Deny (`mPartialCredit`, `open-partial`/`do-partial`). Keeps streaks + success-rate.
  - **Late make-up claims** — `async_claim_late_task` (skip → `STATUS_PENDING_APPROVAL`, `late_claim`); approval refunds `penalty_applied`. Kid History → Skipped → Claim (`htmlLateClaimBtn`, `instance_status==="skipped"`).
  - **Excuse-day** — `async_excuse_day(person, day)`; History skipped-group "Excuse day".
  - **Due/reset labels** — `_dueLabel` in `htmlChoreRow` (uses `days_until_reset`/`recurrence_type`).
  - **Rotation** — per-chore `rotation_switch_weekday` (weekly cadence flip day); `getRotationStatus`/`htmlRotationRail` Current/Up Next, below streaks. Cadence reduced to per-instance + weekly.
  - **Chore editor → drawer** — `mChoreForm` uses `dWrap`; both the row-click and edit button open it (`surface:"drawer"`); the desktop inline panel is now a placeholder. `choreFormFields` reorganized to **3 tabs** (Details w/ collapsible icon + multiline desc + reminder; Schedule w/ who → recurrence → rotation; Points & Rewards). **One-time + the Add Task quick flow removed.**
  - **Monthly multi-day** — `recurrence.days_of_month` list (legacy `day_of_month` fallback) via `_store_helpers._monthly_days`; tick + reset updated.
  - **Admin actor logging** — `_append_history` carries `actor` from `store.acting_as(name)`; `services._resolve_actor(hass, call)` wraps the admin handlers; History shows "· by …".
  - Person delete → red trash (`.fh-ad-person-del`, lower-right).
- **Samba is current.** Full writeup → [RELEASE-NOTES-v0.7.3.md](RELEASE-NOTES-v0.7.3.md).

### Next session (features)
1. Branch from `main`: `git checkout main && git checkout -b <feature>`. Every push runs CI — keep it green before deploying.
2. **Repurpose the chore detail side-panel** (`_htmlChoreEditorPanel` in `modes-admin.js` — now a placeholder) with useful data.
3. **Perf:** history/model runtime trim (lazy per-view history). Then **v0.8.0 Home Maintenance** module.

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

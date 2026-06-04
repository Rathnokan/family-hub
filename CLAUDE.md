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

## Current Status — 2026-06-02

| Item | State |
|---|---|
| **Live on HA (Samba)** | v0.7.1 deployed + live-tested. |
| **GitHub / HACS** | **v0.7.1 SHIPPED** — bug-fix patch on `main`, **tag `v0.7.1`**, GitHub release published (Latest). **GitHub Actions CI green** on every push. (v0.7.0 "Re-foundation" before it: tag `v0.7.0`, commit `37ec694`.) |
| **manifest.json / hacs.json / constants.js / const.py VERSION** | **0.7.1** (`iot_class` = `calculated`). |
| **Phase** | **v0.7.1 bug-swat SHIPPED.** Correctness patch off a full-codebase read: redemption overspend guard, $0 sub-override, lapsed-sub "Ready" math, wired Add-Task penalty, cancel-pending lapse notify, inline sub-editor freeze, HISTORY_META gaps, + dead-code/version-drift cleanup. Full list in [BUGS.md](BUGS.md) "Fixed in v0.7.1". **Next work → v0.7.2/v0.7.x** (branch from `main`); see backlog below. |

> **v0.7.1 is on `main` + tagged.** Future work: branch from `main` (`git checkout main && git checkout -b v0.7.2-xxx`). Every push runs CI — keep it green before deploying.
>
> **v0.7.x backlog (recommended order):**
> 1. **First-parent attribution** (BUGS.md "Open", top item) — two-parent household logs every admin action as the first parent (Jim). Needs `hass.user.id` → `person.ha_user_id` mapping threaded through the card. Small focused task; **affects this family.**
> 2. **#3 — model/history runtime trim.** `build_card_model` still ships the ~977-entry `history_log` on `needs_attention`, refetched on every `data_rev` change. ⚠️ **Bigger than it looks:** `history_log` is consumed by the admin History view AND all 6 personal pages (`getWeeklyPts` in the header, the per-person history tab, the store rail's recent purchases). Doing it right = lazy per-view history (`family_hub/get_history` ws command, person-filtered) + an async render path for the weekly-points header. Moderate refactor; test all themes.
> 3. Smaller deferred items (slug divergence, weekly-window mismatch, notification/history hardening, dedupe) — all catalogued in [BUGS.md](BUGS.md) "Open — deferred".
> 4. **Decide:** task-instance retention is **30d** in code (docs previously said 60). Confirm 30 or bump `TASK_INSTANCE_RETENTION_DAYS`.
> 5. **Optional card-side splits** (`modals.js`, `modes-admin.js`): CODE — silent-import risk ruff can't catch for JS. Low value; leave unless wanted.

---

## 🤝 SESSION HANDOFF — for the next session

> **Read this section before starting work.** Then run the Session Start Checklist above and pick up wherever the prior session left off.

### Where things stand (v0.7.0 — P0/P1/P2 shipped to Samba, 2026-05-30)

**Done + live-tested (Samba only, not committed/version-bumped):**
- **P0 — free wins:** esbuild `--minify` on `build:body` (607→~491 KB); `_unrecorded_attributes` on all sensors (recorder bloat + ">16 KB" warning gone); removed placeholder `FamilyHubTodaySensor`; coordinator isolates `async_check_notifications` failures from `UpdateFailed`.
- **P1 — scheduled tick (no more 30 s poll):** `coordinator.update_interval=None`. `__init__` registers via `async_track_time_change`: a midnight rollover (`coordinator.async_daily_rollover` → `async_request_refresh`) and a per-minute notification heartbeat (`coordinator.async_notification_heartbeat` → `store.async_check_notifications`). Services still drive instant `async_refresh()`.
- **P2 — sensor + data-bus redesign (the big one):**
  - `card_model.py` (NEW) = single source: `build_*_scalars` (lean sensor payloads) + `build_*_payload` (full sections) + `build_card_model(store)` (keyed by entity_id).
  - `websocket.py` (NEW) = `family_hub/get_model` command, registered in `async_setup`. `manifest.json` gained `websocket_api` dep.
  - `store.data_rev` counter (bumped in `async_save`), exposed on `needs_attention`.
  - Card (`FamilyHubCard.js`): `_attrs(id)` reads `this._model` first (fallback to live attrs); `_maybeRender` dirty-checks `needs_attention.data_rev`; `_fetchModel` pulls the websocket model. `FH_SENSORS` import removed (now unused). `_doRender` shows "Loading…" until the model arrives. Direct attr reads in `dispatch.js` (×2) + `print-chore-list.js` repointed through `_attrs`. Removed 3 debug `console.log`s in `dispatch.js`.
  - **Sensors are now lean scalars** — verified live: `needs_attention` = `data_rev` + counts + slim roster + `rooms_config` + `family_name`.
  - **GOTCHA fixed (see DECISIONS_LOG "Card dirty-check keys off `data_rev`"):** track the SENSOR's data_rev in `_lastDataRev`, never the model's — the heartbeat bumps the store counter without refreshing the sensor, so the model's value runs ahead and caused re-render-on-every-state-change (dropdowns self-closing).

**Also done (after P0–P2):**
- **✅ P3 — multi-store + migration** (`data_store.py`/`__init__.py`/`const.py`). Verified OK on live data; original `family_hub_data.json` kept read-only + backed up to `.v1.bak.json`; HA Stores at `.storage/family_hub_{core,chores,rewards,history}`; debounced `async_delay_save`. Commit `8701cd4`.
- **✅ Inactive-people management** — `async_reactivate_person` + `async_hard_delete_person` (cascade purge, inactive-only); `reactivate_person`/`hard_delete_person` services; `inactive_people` in the model; admin Family "Inactive members" panel. Commit `cbc77b4`.
- **✅ Admin Family-panel layout fix** + **`services.yaml`** (all 45 services; kills the reboot error). Commit `b48e30d`.
- **✅ CI safety net** — `.github/workflows/ci.yml`: `python -m compileall` + `ruff --select E9,F63,F7,F82` (undefined names!) + `npm run build`, on every push. **Caught 4 real load-breaking bugs** during the data_store split before they hit HA. Check runs with `gh run list`/`gh run watch` (run gh from inside the repo, or `gh -R Rathnokan/family-hub`).
- **✅ `css.js` split** (commit `55d4351`) — barrel re-exporting `CSS` from `css/index.js` (concatenates byte-identical slices `css/part1..5.js`). Zero render change.
- **✅ `data_store.py` FULLY modularized** (commits up to `f0e4d53`) — **4,815 → 624 lines.** Now a thin facade (persistence core + settings) that mixes in **11 `*_mixin.py`** (card_shaper, tick, streaks_ranks, subscriptions, people, chores, tasks, store_items, group_rewards, redemptions, history_admin) + `_store_helpers.py`. Mixins operate on `self`, never import each other (MRO), no cycles.

> **Split technique (reuse for any future split):** move method/code bodies with **PowerShell line-range extraction** (`[System.IO.File]::ReadAllLines` → slice → write; zero reproduction/typo risk). Verify a **def-count check** (`Select-String '^\s*(async def|def) '` across all files must equal the pre-split total). Give each new file the full import block + `_LOGGER = logging.getLogger(__name__)`. Then push and let **CI ruff catch missing imports** (it flagged `_LOGGER`, `_STORE_DOMAINS`, off-by-two boundaries — all pre-deploy).

### First moves for the next session — all that's left is OPTIONAL
1. Confirm you're on `v0.7.0-refoundation`. **Every push runs CI — keep it green before deploying.**
2. **#3 — model/history runtime trim (the recommended remaining efficiency win):** `build_card_model` still includes the ~977-entry `history_log` on `needs_attention`, so the card refetches it on *every* `data_rev` change even when not viewing history. Split it: `get_model` returns everything **except** history; add a `family_hub/get_history` ws command; card lazily fetches `this._history` only when the admin History view opens.
3. **Optional card-side splits** (`modals.js`, `modes-admin.js`): ⚠️ CODE — a missing cross-import is a **silent JS ReferenceError that CI's ruff does NOT catch** (ruff is Python-only). Lower value, needs per-modal/section live-testing. **Leave unless specifically wanted.**
4. **Ship v0.7.0:** merge `v0.7.0-refoundation` → `main`, bump VERSION to 0.7.0 (manifest.json + hacs.json + `src/card/constants.js`), `npm run build`, tag `v0.7.0`, write `RELEASE-NOTES-v0.7.0.md`, push. Already shippable.

### Model recommendation

**Opus for v0.7.0.** This pass is cross-file and cross-layer (sensor/data-bus redesign, multi-store migration, card data-source repoint) — the kind of cross-file invariant work that warrants Opus. Sonnet 4.6 (High) remains fine for routine feature work and the Phase 4 file-splits.

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
| Body bundle | `custom_components/family_hub/www/family-hub-card-body.js` (~555 KB ESM) |
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

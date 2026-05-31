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

## Current Status — 2026-05-30

| Item | State |
|---|---|
| **Live on HA (Samba)** | v0.7.0 **P0+P1+P2 deployed to Samba and live-tested.** NOT committed to git, NOT version-bumped (still 0.6.5 in manifest/constants). |
| **GitHub / HACS** | Last tag = v0.6.5. v0.7.0 work is Samba-only so far — commit when the whole release is stable. |
| **manifest.json / hacs.json / constants.js VERSION** | 0.6.5 (bump to 0.7.0 only when shipping the release) |
| **Phase** | **v0.7.0 "Re-foundation" in progress. P0/P1/P2 DONE + live-tested. Next: P3 (storage migration), then P4 (code/theme splits).** See [ROADMAP.md](ROADMAP.md) → "v0.7.0 — Re-foundation". |

> ⚠️ **Uncommitted v0.7.0 work lives in the local repo + Samba.** Before P3, run `git status` / `git diff` to see everything P0–P2 changed. Consider committing the green P0–P2 state first (with the user's go) so P3 starts from a clean tree.

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

**Not done:** P3 (storage migration) and P4 (code/theme splits).

### First moves for the next session — START P3

1. Run the Session Start Checklist. **`git status`/`git diff` to review the uncommitted P0–P2 work** (offer to commit the green state first, with the user's go).
2. Read [ROADMAP.md](ROADMAP.md) → "v0.7.0 — Re-foundation" **Phase 3 + the Migration section**, and the locked decisions there (module-oriented stores; assets → `/local`; reserve meals/maintenance seams; reward store NOT migrated). Skim DECISIONS_LOG storage entries.
3. **P3 safety constraints (critical — user has NO local Python, so you CANNOT dry-run; the only test is live HA):**
   - The original `/config/family_hub_data.json` must be treated as **read-only** during migration — migrate by READING it and WRITING the new HA `Store`s elsewhere (`.storage/`). Never modify the original. This keeps a clean revert path (restore old `data_store.py`, delete new stores).
   - Back it up to `family_hub_data.v1.bak.json` anyway. **Verify row counts** (people/chores/task_instances/history/store_items) match the source BEFORE committing to the new stores; on mismatch, abort + fall back to the legacy file.
   - Keep `self._data`'s in-memory shape IDENTICAL so the ~4,100 lines of business logic in `data_store.py` are untouched — only the load/save plumbing changes. Lowest-risk path.
   - Stores (decided): `core` (settings+people), `chores` (chores+task_instances), `rewards` (store_items+redemptions+subscriptions+group_reward_proposals), `history`. Use `Store.async_delay_save` (debounce ~2 s). Add a flush on `async_unload_entry`. Assets/upload service + the `data/` code-package split can be deferred (additive / cheap-later).
4. Then P4 (css/modals/modes-admin splits + theme co-location) + the deferred P0-triage items (admin Family-panel layout fix; author `services.yaml`).

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

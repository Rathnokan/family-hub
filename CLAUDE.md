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

---

## Current Status — 2026-05-25

| Item | State |
|---|---|
| **Live on HA (Samba)** | v0.6.4 — bundles rebuilt after final cleanup. Awaiting redeploy. |
| **GitHub / HACS** | v0.6.4 ready locally (one commit pending push + tag). |
| **manifest.json / hacs.json / constants.js VERSION** | 0.6.4 ✓ |
| **Phase** | v0.6.4 (bug fixes) shipping. v0.6.5 (subscription rewards) is next; v0.6.6 (cleanup) follows. See [ROADMAP.md](ROADMAP.md). |

---

## 🤝 SESSION HANDOFF — for the next session

> **Read this section before starting work.** Then run the Session Start Checklist above and pick up wherever the prior session left off.

### Where things stand

- **v0.6.3 is shipped** to GitHub + HACS. Tagged at `d2d5c69`.
- **v0.6.4 (bug fixes) is complete locally.** Awaiting user "go" to push + tag. See [BUGS.md](BUGS.md) "Recently fixed" for the per-bug summary.
- **v0.6.5 is next** — *Subscription Rewards* feature. See [ROADMAP.md](ROADMAP.md).
- **v0.6.6 will be codebase cleanup/optimization** before moving into Maintenance/Meals/Calendar rooms. See [ROADMAP.md](ROADMAP.md).

### First moves for the next session

1. Run the **Session Start Checklist** above.
2. Run `git status` — local commit `v0.6.4 — bug fixes` should be one ahead of `origin/main` (or already pushed + tagged).
3. Open [ROADMAP.md](ROADMAP.md) and confirm with the user which version is starting.
4. For multi-phase work, propose a phased plan and wait for approval before touching code.

### Model recommendation

**Sonnet 4.6 (High) is the default.** Enough for ~90% of work in this codebase.

**Reach for Opus when** the work involves cross-file invariants — for example v0.6.6's `data_store.py` split, or v0.6.5's daily-tick subscription processing where renewal date math, point deduction, and lapse handling all interact.

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

- Claude generates code → deployed via Samba for testing
- Python changes: integration reload only (not full HA restart)
- JS changes: browser hard refresh only
- Both changed: reload + hard refresh + `force_daily_tick`
- When stable: commit to GitHub, bump versions, cut release tag → HACS update
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

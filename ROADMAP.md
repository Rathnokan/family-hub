# Family Hub — Roadmap & Planning

> Active scope, deferred backlog, and the long-term plan.
> Session operations (checklists, handoff, deploy) → [CLAUDE.md](CLAUDE.md).
> Decided architecture → [DECISIONS_LOG.md](DECISIONS_LOG.md). Bug tracker → [BUGS.md](BUGS.md).
> Per-release detail lives in `RELEASE-NOTES-v*.md` + git history — this file stays forward-looking.

---

## Universal constraints (apply to every release)

- **Preserve the HA integration contract.** Service schemas, sensor entity_ids, sensor attribute keys, config-flow entries, the integration lifecycle, and the Lovelace static-path registration are external contracts. Never break them for an internal win.
- **Do not rename** any public function, class, entity unique_id, service name, or sensor attribute key without explicit user approval.
- **Do not change behavior marked intentional** in [DECISIONS_LOG.md](DECISIONS_LOG.md).
- **Do not change const STRING VALUES** stored in the data file — only rename Python constant names if needed.
- **State what is changing and why** before editing each file.
- **If a fix is uncertain or touches >3 files**, list the affected files and pause for review.
- **Do not bump versions, commit, or push** without explicit "go" from the user.

> v0.7.0 deliberately voided 3 of these (single JSON file / sensor-attribute bus / 30 s poll) via a one-time backed-up migration. That was a one-off — **v0.7.1+ are normal additive releases**; the constraints apply normally again.

---

## Current status (2026-07-11)

- **v0.7.7 shipped** (tag `v0.7.7`, release published) — Meals module + v0.7.6 reward gates / weekly streak / phone surfaces before it. Chores module is tabled.
- **Active: v0.8.0 "Home Maintenance" — Phase A foundations.** A1 architecture session complete (2026-07-11); full approved plan → **[docs/PLAN-v0.8.0.md](docs/PLAN-v0.8.0.md)**. Scope authority: `home-maintenance-module-scope.md` (v2) + `family-hub-v080-implementation-plan.md` (in the user's Claude project knowledge).

---

## Next up — v0.8.0 Phase A (one session each, in order)

Implement from [docs/PLAN-v0.8.0.md](docs/PLAN-v0.8.0.md) — each brief there has files, anchors, and acceptance criteria.

| Session | Scope (one line) | State |
|---|---|---|
| **A2** | Module framework (`modules.py` registry + OptionsFlow toggles + entry reload; gated services/sensors/model/tick; card OFF-tile) + `event_bus.py` pub/sub with frozen `external_task_*` topic contracts. | ✅ done + live-tested 2026-07-21 |
| **A3** | Versioned export/import — `DATA_SCHEMA_VERSION 3` envelope, `migrations.py` stepwise migrators, `export_data`/`import_data` services with validate-then-swap safety. | ✅ done + live-tested 2026-07-21 (12/12) |
| **A4** | Maintenance backend — new `maintenance` store domain (tasks/products/completions/vendors/funds/home_profile), `_maintenance_schedule.py` derived-state scheduling (both `schedule_mode`s), ~19 `maintenance_*` services, seed-loader interface (library ships empty). **`assign` = bus offer/revoke only, no in-module assignee (decided 2026-07-21).** | ◀ next |
| **A5** | One-time migration of `category_label=="Maintenance"` chores into the new collection + full `_chore_is_maintenance` seam removal. | |
| **A6** | Chores/Rewards gating audit — make the chores + rewards toggles real (services/sensors/tick/card degradation), per the A1 decision that ALL modules are gateable. | ✅ done + live-tested 2026-07-25 (20/20) |

**Phase A COMPLETE (A1–A6) + Phase B COMPLETE, on `main`, CI green, not yet tagged.**

**Phase B delivered (2026-07-25):** `custom_components/family_hub/seed_library.json` — v3.0.0, **97 tasks + 15 big-ticket assets**, Desert Southwest / Tucson tuned. Research provenance in `docs/research-phase-b/`. ⚠️ The library is a **dict** (`tasks`/`big_ticket_assets`/`climate_preset`), so the A4 stub loader returns `[]` for it — it's an **inert no-op until D1 wires it** (nothing breaks). D1 integration deltas (loader shape, `applicability` tag→Home Profile mapping, `seasonal_anchor` string→`{month,day}` parsing incl. multi-occurrence, `climate_overrides`, big-ticket assets for E2, inflation 4.0% locked) are catalogued in **[docs/PLAN-v0.8.0.md](docs/PLAN-v0.8.0.md) §9**.

**Phase C1 delivered (2026-07-26):** admin IA wireframes — five-rail nav (Today/Modules/Hub/System/Log), module-off greys in place, Home Care admin = Profile/Library/Assets & Money/Vendors & Services/Notifications, points economy confirmed in Rewards. Full record + 6 flagged deltas from shipped A4–A6 behavior (nav-hiding reversal, new `maintenance_assets` collection needed for Phase E, escalation-rate binding, etc.): **[docs/design-phase-c/C1-DECISIONS.md](docs/design-phase-c/C1-DECISIONS.md)**.

Next: **C2** (Home Care room prototype, family-facing — dashboard/schedule/task-detail/complete-flow/chores-board) and **C1 hi-fi mockups** (polish pass on the settled IA) run in parallel, non-Code. Then **Phase D** (Code): D1 seed import + Home-Profile applicability + sensors (can start now — needs the library, not the design), D2 room UI from C2's handoff spec, D3 admin tab (read C1-DECISIONS.md deltas first), D4 notifications, D5 chores bridge. See [docs/PLAN-v0.8.0.md](docs/PLAN-v0.8.0.md) §9–10 + the implementation-plan doc in project knowledge.

**Deferred from A6 (cosmetic, low priority):** per-theme personal-page section-hiding when chores/rewards is off — a chores-off kid page shows an empty "today"/"all done" section, a rewards-off page an empty store rail. Backend data is correctly gated (nothing breaks); only the empty header lingers. Fix touches all 6 themes; do it if the toggles see real use.

**Parallel (not Claude Code):** Phase B seed-library research (Chat/Research, 3 sessions → `seed_library.json`) and Phase C design (admin IA rethink + maintenance room prototype → handoff spec). Phase D (room UI, notifications, Chores bridge D5) starts when A is done + C2 has screens.

### Carried items
- **Repurpose the chore detail side-panel** — shipped v0.7.5 as the Earning & Balance rail. ~~Resolved.~~
- **Admin actor logging** — shipped v0.7.3. ~~Resolved.~~

### Open decisions (user's call — parked)
- ~~**Task-instance retention**~~ — resolved 2026-06-06: **30 days confirmed** (`TASK_INSTANCE_RETENTION_DAYS = 30`). No need for a longer window right now.
- ~~**Weekly-points window**~~ — resolved in v0.7.2: both card and server anchor to `rank_eval_weekday`.

### Deferred efficiency / cleanup (carried from v0.7.0; all optional)
1. **Model/history runtime trim** — `build_card_model` still ships the ~977-entry `history_log` on `needs_attention`, refetched on every `data_rev` change. Bigger than it looks: `history_log` feeds the admin History view AND all 6 personal pages (`getWeeklyPts` header, per-person history tab, store-rail recent purchases). Right fix = lazy per-view fetch (new `family_hub/get_history` ws command, person-filtered) + async weekly-points header. Test all themes.
2. **Assets / upload service** — `family_hub.upload_asset` → writes `/config/www/family_hub/assets/<uuid>.<ext>`, records store the path (served at `/local/...`, survives integration updates), replacing the base64 `handleIconFileSelection` flow. Pairs with repopulating the (currently empty) reward store.
3. **Optional card-side splits** — `modals.js` / `modes-admin.js`. ⚠️ CODE: a missing cross-import is a silent JS ReferenceError that CI's ruff does NOT catch (ruff is Python-only). Low value; leave unless wanted.
4. **Tidy** — `ruff --select F401 --fix` to drop the mixins' intentional over-imports (cosmetic).

---

## Feature backlog (needs design before building)

### Group rewards expansion (was v0.6.7)
- **Group subscriptions** — siblings sharing one Roblox / Game Pass sub. Open Qs: cost split (even / weighted / parent-set)? Does one contributor's lapse fail the whole group or just their share? Cancel rights?
- **Group streak reward** (Jim's request) — a no-cost reward that unlocks when ALL kids hit a sustained success-rate milestone together (family movie night, etc.). Design: trigger condition, who picks the reward, cooldown, progress UI on the home strip, reset rules when one kid breaks streak, storage (`family_streak_rewards` top-level list).
- **Kid-initiated "Propose sharing" UI** — backend exists from v0.6.3; the proposal-creation modal was never built. See [BUGS.md](BUGS.md) "Deferred".

### Separate Maintenance into its own module (raised 2026-05-29, Jim)
**→ Now the active v0.8.0 scope.** Plan approved 2026-07-11: [docs/PLAN-v0.8.0.md](docs/PLAN-v0.8.0.md) (module framework, event bus, versioned export/import, maintenance data model, migration + seam removal).

### Deferred v0.6.3 items (parked)
- Time-windowed chores (`available_from` / `expires_at`, sub-day auto-skip).
- Tabler Icons migration — audit `FH_ICONS`, expand the curated picker grid.
- (Shipped already: streak-freeze tokens, quick-add templates, daily progress bar.)

---

## Long-term roadmap

| Version | Headline | Notes |
|---|---|---|
| v0.6.5 | Subscription rewards ✅ | Recurring deductions with lapse + cancel flow. |
| v0.7.0 | Re-foundation ✅ | Event-driven (no 30 s poll), websocket model + lean sensors, multi-store + debounced saves + safe migration, minified bundle, inactive-member mgmt, CI, `data_store.py`/`css.js` splits. |
| v0.7.1 | Bug-swat + cleanup ✅ | Correctness patch off a full-codebase audit; hardening + de-drift. |
| **v0.7.x** | Group rewards expansion / efficiency trims | Group subs, group streak reward, "Propose sharing" UI; history runtime trim; assets upload. |
| v0.7.7 | Meals module ✅ | Weekly menu, plan/pantry/library/groceries tabs, 18 services, own store domain. |
| **v0.8.0** | **Home Maintenance module (ACTIVE)** | Module framework + event bus + versioned export/import + maintenance backend + chores carve-out (Phase A, [docs/PLAN-v0.8.0.md](docs/PLAN-v0.8.0.md)); room UI / notifications / Chores bridge (Phase D). |
| v0.8.x | Maintenance depth | Cost capture + reports, sinking funds (inflation + target-balance-today), full Inspect-Plan-Do, vendor book, printable plan. |
| v0.9.0 | Recommendations + lawn program | Rules-as-data seasonal/event-driven recommendations; Bermuda lawn program from Phase B research. |
| v0.10.0 | Calendar room | Pulls real HA calendar entities into the today strip. Scaffold live as coming-soon. |
| v0.11.0 | Smart Home room | Permission-gated lighting/climate/irrigation for kids. Scaffold live as coming-soon. |
| v1.0.0 | Theme builder UI + public release | Parent authors themes without editing code (rides on theme co-location). |

**Held out indefinitely (revisit on demand):** photo evidence for approvals · history pagination ("show older") · achievements/badges engine · per-theme audio cues via `alexa_media_player`.

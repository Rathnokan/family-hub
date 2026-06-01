# Family Hub — Roadmap & Planning

> Active version scope, upcoming releases, deferred backlog, and the long-term plan.
> For session operations (checklists, handoff, deploy steps), see [CLAUDE.md](CLAUDE.md).
> For decided architecture, see [DECISIONS_LOG.md](DECISIONS_LOG.md).

---

## Universal constraints (apply to every release)

- **Preserve the HA integration contract.** Service schemas, sensor entity_ids, sensor attribute keys, config-flow entries, the integration's lifecycle, and the Lovelace static-path registration are external contracts. Never break them for an internal win.
- **Do not rename** any public function, class, entity unique_id, service name, or sensor attribute key without flagging for the user's explicit approval first.
- **Do not change behavior marked intentional** in [DECISIONS_LOG.md](DECISIONS_LOG.md).
- **Do not change const STRING VALUES** that live in the JSON data file — only rename Python constant names if needed.
- **State what is changing and why** before editing each file.
- **If a fix is uncertain or touches more than 3 files**, list all affected files and pause for user review before editing.
- **Do not bump versions, commit, or push** without explicit "go" from the user.

---

## Active Scope — v0.7.0 "Re-foundation" (breaking: performance + architecture)

The original v0.6.6 (pure file-split cleanup) was **superseded on 2026-05-30** after a
full architecture review. It addressed only maintainability/token cost and nothing for
runtime performance, data management, or theming. v0.7.0 is the broader pass. The
file-splits live on as **Phase 4** below. See "v0.7.0 — Re-foundation" section for the
full phase breakdown, the measured baseline, the contracts being deliberately voided,
and the migration plan.

> ⚠️ This release **intentionally voids** three "universal constraints" below (single
> JSON file / sensor-attribute keys / no-wholesale-rewrite) — user-approved 2026-05-30,
> with a one-time backed-up migration. Service names/schemas, the card-stub split, and
> the web-component invariants are **kept**.

---

## Shipped — v0.6.4 (Bug Fixes)

| Phase | Scope | Status |
|---|---|---|
| 1 | Python critical fixes (rotation KeyError, corrupt JSON safety, const collision) | ✓ |
| 2 | JS critical fixes (missing import, int/array mismatch, dataset case, print fallback) | ✓ |
| 3 | Behavioral fixes (celebration overlay, tick concurrency guard, duplicate handler) | ✓ |
| 4 | Dispatch dedup (`_buildChorePayload`, `_buildStoreItemPayload`) | ✓ |
| 5 | Version bump + release | ✓ |
| Post-ship cleanup | Phase 1.C semantic-gap closure + delete dead `modes-maintenance.js` | ✓ |

Per-bug fix detail is in [BUGS.md](BUGS.md) "Recently fixed". The original execution prompts have been retired — they served their purpose.

---

## Shipped — v0.6.5 (Subscription Rewards)

### Concept
Store items can be marked `item_type = "subscription"`. When a kid subscribes, the system creates an active subscription with a recurring renewal date. The daily tick deducts the period cost on the renewal date. Cancellation requires parent approval to prevent siblings interfering with each other's subs.

### Decided edge cases (Jim, 2026-05-25)
1. **Lapsed handling:** When a kid can't afford renewal on the anchor date, the subscription enters `lapsed` status. It holds indefinitely until the kid or parent cancels. If the kid's points recover, the deduction fires retroactively at that moment. Each missed renewal period accumulates as additional debt — the cost the kid owes grows with each missed period, shown visibly on the rail.
2. **Month-end anchor on missing day:** A monthly subscription anchored on the 31st in February falls to the last day of the month (Feb 28 or 29).
3. **Initial cost:** Full first-period cost is deducted at subscribe time. No proration.
4. **Group subscriptions deferred** to v0.6.7. v0.6.5 is single-person only.
5. **Parent override:** Parents can start, pause, and cancel subscriptions unilaterally on a kid's behalf. Kid-initiated cancellation requires parent approval.

### Data model (additive — no migration risk to existing items)

**Store item — new fields when `item_type == "subscription"`:**
```
item_type:               "one_time" | "subscription"   # defaults to "one_time" on migration
subscription_period:     "weekly" | "monthly" | "quarterly" | "biannual" | "annual"
subscription_anchor:     int                           # day-of-month (1-31) for monthly+; weekday (0-6) for weekly
```

**New top-level list: `subscriptions: [...]`**
```
{
  id:                          <uuid>,
  person_id:                   <pid>,
  item_id:                     <store_item_id>,
  period:                      "monthly" | etc.,
  anchor:                      23,
  next_renewal_date:           "2026-06-23",
  started_date:                "2026-05-23",
  status:                      "active" | "lapsed" | "cancel_pending" | "canceled",
  missed_renewals:             0,                # increments each tick the kid can't afford while lapsed
  accumulated_debt:            0,                # missed_renewals * item.points_cost; shown in rail
  cancellation_requested_at:   <iso8601 | null>,
  cancellation_requested_by:   <pid | null>,
}
```

Existing items get `item_type: "one_time"` and no subscription fields on migration. Backward compatible.

### Daily-tick processing

For each subscription where `status in ("active", "lapsed")` and `today >= next_renewal_date`:

1. **Active path:** if `person.points_balance >= (item.points_cost + accumulated_debt)`, deduct cost + debt, reset `accumulated_debt = 0`, `missed_renewals = 0`, advance `next_renewal_date` by one period (snapping to month-end if needed), set `status = "active"`, log `history: subscription_renewed`.
2. **Lapse path:** else set `status = "lapsed"`, increment `missed_renewals`, set `accumulated_debt = missed_renewals * item.points_cost`, advance `next_renewal_date` by one period, notify parent on first lapse only, log `history: subscription_lapsed`.

(A `lapsed` sub stays in the daily-tick loop; each renewal date that passes adds to the debt.)

### Services (new)
- `subscribe` — kid action. Validates points, creates record, deducts initial cost.
- `request_cancel_subscription` — kid action. Sets `status=cancel_pending`. Logs request. Subscription continues to renew normally until parent acts.
- `approve_cancel_subscription` — parent action. Sets `status=canceled`. Stops processing.
- `decline_cancel_subscription` — parent action. Reverts to `active` (or `lapsed` if that was the prior state).
- `admin_cancel_subscription` — parent unilateral cancel.
- `admin_subscribe_for_person` — parent unilateral subscribe on a kid's behalf.

### UI surfaces

**Kid side — rail block "Your Subscriptions" (prominent, above store list):**
- Per active sub: icon · name · "Renews in N days" · cost · ✓ "Ready" or ⚠ "Need X more pts"
- Per lapsed sub: red banner · "Lapsed — owe X pts to resume" · debt counter visible
- Cancel button → confirmation modal → status changes to `cancel_pending` until parent acts
- Cancel-pending sub: amber chip "Cancellation pending parent approval"

**Kid side — store row for subscription items:**
- Replace single "Redeem" button with "Subscribe — X pts/month" label
- Already-subscribed items show "Subscribed" badge, subscribe button disabled

**Parent side — admin store-item modal:**
- Type toggle: One-time / Subscription
- When Subscription selected, show period dropdown + anchor picker (calendar day-grid for monthly+, weekday chips for weekly)

**Parent side — approval queue:**
- Cancellation requests join the existing redemption-approval and group-proposal queues
- Parent admin view of all active subs across the family (separate panel)

### Phasing (recommended split)
- **Phase 1 — Backend:** data model, services, daily-tick processing, migration. Reload to test. ✓
- **Phase 2 — Admin UI:** store-item modal additions (type toggle, period, anchor) + cancellation-approval queue + admin sub-management panel. ✓
- **Phase 3 — Family rail edit:** inline edit (period, dollar cost override, next renewal date) + cancel in admin Family tab subscriptions rail. ✓ — also fixed Phase 2 approve_redemption bug (schema + missing async_subscribe call).
- **Phase 4 — Kid UI:** rail "Your Subscriptions" block + store row subscribe button + cancel modal + lapsed-state styling. ✓ — `htmlSubscriptionRail` helper in `_shared.js`; all 6 themes wired; `subscribe` and `request-cancel-sub` dispatch handlers added.
- **Phase 5 — Version bump + release.** ✓ Tagged v0.6.5, pushed to GitHub.

---

## v0.7.0 — Re-foundation (performance + architecture + maintainability)

**Goals (all seven):** real HA/dashboard performance · easier modification · cleaner bug
identification · easier feature-building · easier theme creation · better data management ·
lower token burn while developing.

**Status:** approved 2026-05-30. Breaking release. Voids 3 contracts (below) with a one-time
backed-up migration. Pushes Home Maintenance to v0.8.0.
**Progress: ✅ P0, ✅ P1, ✅ P2, ✅ P3 done + live-tested + committed (branch `v0.7.0-refoundation`).**
**Plus: ✅ inactive-people mgmt, ✅ Family-panel fix, ✅ services.yaml, ✅ GitHub Actions CI, ✅ `css.js` split, ✅ `data_store.py` fully modularized (4,815→624 lines, 11 mixins).**
**Remaining (optional): ⬜ P4 card-side splits (`modals.js`/`modes-admin.js` — low value, leave unless wanted), ⬜ #3 model/history runtime trim, ⬜ ship v0.7.0.**

### Measured baseline (2026-05-30) — why this is needed

| Symptom | Evidence |
|---|---|
| 1 MB data file rewritten **synchronously on every mutation** | `family_hub_data.json` = 1,046 KB. 73% is cold log data: `task_instances` 432 KB / 782 rows + `history` 331 KB / 962 rows. A kid tapping a chore re-serializes + fsyncs the whole MB. |
| `needs_attention` is a data bus through the **state machine + recorder** | `sensor.family_hub_needs_attention` attrs pack all chores (×2: active + all), all store items (×2), every queue, all people, full settings, **+ the 30-day `history_log`** — recomputed and pushed on every mutation. HA logs the ">16 KB state attributes" warning on it. Recorder writes the whole blob per change → DB bloat, slow logbook/history, memory, fat websocket push to every Echo Show. |
| 30 s poll recomputes everything 2,880×/day | `coordinator._async_update_data` runs the full tick + recomputes all sensor payloads every 30 s. Idempotent (no recorder churn when idle) but pure CPU waste — the integration is push-driven via `async_refresh()`; only the once-a-day tick needs a clock. |
| 607 KB unminified bundle to every Echo Show | esbuild `--minify` is off on `build:body`. |
| Possible icon bloat | `store_items` = 34 KB for **4 items** (~8.5 KB each) — likely base64 data-URL icons embedded in records. Audit. |

### Contracts deliberately changed (see DECISIONS_LOG forward-pointers)

| Contract | Action |
|---|---|
| Single JSON file, no wholesale rewrite, `STORAGE_VERSION = 1` | **Break** → 3-store split + debounced writes, `STORAGE_VERSION 1→2`, one-time migration. |
| Fat `needs_attention` attribute bus | **Break** → lean scalar sensors + websocket/HTTP model API + `data_rev` signal. |
| 30 s coordinator poll | **Break** → scheduled daily tick + startup catch-up. |
| Service names / schemas | **Keep** — no perf reason to rename; keeps card dispatch + risk low. |
| Card-stub split, BUILD_ID cache-bust, web-component invariants | **Keep** — correct + unrelated to bottlenecks (just enable minify). |
| Const string values in data file | Change only where the migration already rewrites them — no perf payoff otherwise. |

### Phase 0 — Free wins (non-breaking) ✅ DONE (Samba, 2026-05-30)
- Enable esbuild `--minify` on `build:body` (~607 KB → ~280 KB). Leave the stub readable.
- Add `_unrecorded_attributes = frozenset({...})` to **every** sensor — cover the big
  `needs_attention` keys (`approval_queue`, `redemption_queue`, `all_subscriptions`,
  `people`, `active_chores`, `all_chores`, `store_items`, `history_log`, …). Stops
  recorder DB bloat **immediately**, zero contract change.
- Remove placeholder `FamilyHubTodaySensor` (always 0/[]).
- Coordinator: wrap `async_check_notifications()` in its own try/except so a notify
  failure doesn't `UpdateFailed` the whole integration.
- Smoke-test: `force_daily_tick`, all sensors, card render, `/family_hub` static path.

### Phase 1 — Scheduled tick (kill the 30 s poll) ✅ DONE (Samba, 2026-05-30)
- Replace the polling `update_interval` with `async_track_time_change` at local 00:00:05 →
  daily tick; keep the startup catch-up tick (already idempotent via
  `settings.last_tick_date`). Either set `update_interval=None` with a long safety
  heartbeat, or schedule notification checks at the configured `penalty_alert_time`.
- Services keep calling `coordinator.async_refresh()` for instant UI.
- Verify catch-up after simulated downtime; verify reminders still fire.

### Phase 2 — Sensor + data-bus redesign (biggest dashboard win) ✅ DONE (Samba, 2026-05-30)
- **Backend:** register a websocket command `family_hub/get_model`
  (`websocket_api.async_register_command`) returning the card model assembled by `data/model.py`,
  which asks **each module for its own section** (`{ core, chores, rewards, history, … }`). A
  future module adds a section — no contract migration. `data_rev` is global now but the
  per-section shape leaves room for **per-module revs** later (so a meals change won't
  invalidate a chores-only card) without breaking the contract. Optional HTTP
  `HomeAssistantView` `/api/family_hub/model` as a fallback.
- Add a monotonic `data_rev` int, bumped on every mutation/tick; expose it as the state of a
  single cheap signal sensor (e.g. keep `needs_attention` state = badge count and add
  `data_rev` as one scalar attr, or a dedicated `sensor.family_hub`). The card's dirty-check
  keys on `data_rev`.
- **Shrink sensor attributes to scalars only.** Person sensor: `rank`, `tasks_due_today`,
  `tasks_done_today`, `tasks_overdue`, `pending_approval`, `pending_redemptions`,
  `dollar_value`, `theme_key` (all tiny, recorder-safe, automation-useful). `needs_attention`:
  the count attrs only. Drop the big lists from attributes entirely.
- **Card:** introduce `this._model`; fetch via
  `hass.connection.sendMessagePromise({ type: "family_hub/get_model" })` on first render and
  whenever `data_rev` bumps; repoint accessors (`card._people()`, `naAttr`, per-person `attr`)
  to read from `_model` instead of `hass.states[...].attributes`. Render functions unchanged —
  only the data source moves. *Largest card-side effort; mechanical but wide.*
- Net: HA pushes one tiny state on a change; only **visible** cards pull the model; sleeping
  Echo Shows pull nothing. Recorder no longer stores the model.

### Phase 3 — Storage + backend redesign (module-oriented; JSON multi-store + debounce) ⬅️ NEXT

**Decided 2026-05-30:** organize the backend **by domain/module**, mirroring the frontend
`rooms/` registry, so future modules (meals, maintenance, dashboard) are **additive — never
another structural migration.** This is the "migrate once" core. Field-level evolution within a
module stays cheap (`setdefault` / per-store version bump); the *structural* split happens once,
now.

**Backend package layout (replaces the 4,147-line `data_store.py` God-object):**
```
custom_components/family_hub/data/
  store.py            multi-Store manager: load all, debounced save, migration orchestration,
                      data_rev counter, the FamilyHubDataStore facade (re-exported so
                      `from .data_store import FamilyHubDataStore` still works — zero call-site churn)
  core/               people, settings, ranks/PPD ladder (shared primitives)
  chores/             chores, task_instances, tick, recurrence, penalties, streaks
  rewards/            store_items, redemptions, subscriptions, group rewards
  history/            append-only activity log (append + trim + enrich)
  assets/             uploaded media: write/serve/delete + path bookkeeping
  model.py            assembles the card model by asking each module for its slice
  [meals/]  [maintenance/]   ← RESERVED SEAM: registered as empty modules now, built in v0.8.0/v0.9.0
```
`maintenance` stays a `category_label` special-case inside `chores/` for now (seam reserved,
not carved — see Module scope decision). Carving it out later is additive.

**Stores (each a `homeassistant.helpers.storage.Store`, debounced via `async_delay_save ~2 s`):**
| Store | Owns | Write cadence |
|---|---|---|
| `family_hub_core` | people, settings, ranks | debounced on mutation |
| `family_hub_chores` | chores + **active** task_instances | debounced on mutation |
| `family_hub_rewards` | store_items, redemptions, subscriptions, group proposals | debounced on mutation |
| `family_hub_history` | activity log | debounced; trimmed on tick |
| `family_hub_task_archive` | terminal task_instances (retention window) | only during tick archival |
| `family_hub_assets` | media index (id → path/meta); **files live in `/config/www/family_hub/assets/`** | on upload/delete |

- New module later = **new store + new `data/<module>/` package**, registered in the module
  registry. No existing store is rewritten → no migration. That is the whole point.
- Retire the hand-rolled `.tmp` + `os.replace` + `asyncio.Lock` — `Store` gives atomic +
  serialized writes + per-store versioned migration for free.
- A chore tap now debounce-writes only the ~small `chores` store, not 1 MB.

**Assets / uploaded images (decided: `/local` + upload service):**
- New `family_hub.upload_asset` service (or HTTP view): card sends image bytes → backend writes
  `/config/www/family_hub/assets/<uuid>.<ext>` (via `async_add_executor_job`, creating the dir
  on setup) → returns the relative path. Records store **`"assets/<uuid>.png"`**, never bytes.
- Served by HA at `/local/family_hub/assets/<uuid>.png`. Lives in `/config/www/`, **not** the
  integration dir → survives every integration update. Reused by meals/maintenance later.
- Replaces the current base64 card-upload flow (`handleIconFileSelection`).

### Migration (one-time, on first load under STORAGE_VERSION 2)
1. If legacy `family_hub_data.json` exists and no v2 stores yet: read it, **back it up to
   `family_hub_data.v1.bak.json`** (never delete user data).
2. Fan it out into the module stores: `core` (people/settings/ranks), `chores`
   (chores + active task_instances), `rewards`, `history`, `task_archive` (terminal instances).
3. **Reward store is empty placeholder data — NOT preserved.** `store_items` start fresh on the
   clean schema (no base64 icon field); user repopulates via the new upload flow. No icon
   migration needed.
4. Seed `meals` / `maintenance` reserved modules as empty stores so they're additive later.
5. Validate row counts (people / chores / task_instances / history) match the source before
   marking migrated.
6. **Dry-run on a COPY of the live 1 MB file first** (available via Samba).
7. Sensors get new entity_ids/attrs — document the rename; stale-entity cleanup prunes the old
   ones on reload; user re-points hand-authored dashboards. Card + backend deploy together via
   Samba in one release, so no partial-state window.

### Phase 4 — Codebase cleanup & theming (re-scoped; mostly done)
- ✅ **GitHub Actions CI** — `.github/workflows/ci.yml` (py compile + ruff undefined-names + card build). The force-multiplier: caught 4 load-breaking bugs during the data_store split pre-deploy.
- ✅ **`data_store.py` fully modularized** — 4,815 → 624 lines via 11 `*_mixin.py` + `_store_helpers.py` (mixin pattern, MRO, no cross-imports). The big "fewer tokens to code" win.
- ✅ **`css.js` split** → `css.js` barrel + `css/index.js` + `css/part1..5.js` (byte-identical slices, not the semantic `{layout,components,…}` originally sketched — mechanical was provably safe + cheap; re-organize semantically later by moving CSS between part files if desired).
- ⬜ `modals.js` split (1,302 lines) → one file per modal — **optional, low value, CODE (silent-import risk ruff can't catch). Leave unless wanted.**
- ⬜ `modes-admin.js` split (1,134 lines) → `admin/{today,family,tasks,rewards,history,settings}.js` — **same caveat as modals.js.**
- **Theme co-location:** `themes/<key>/{index.js, <key>.css.js, rail.js}`, registered in
  `themes/index.js`. Push each theme toward a token/data object (CSS custom props + ranks +
  rail renderer + `rowConfig`) so a **new theme needs zero edits to shared files** — de-risks
  the future v1.0 theme-builder. The shared `htmlChoreRow` already carries row anatomy.
- **Admin Family panel layout fix** (deferred from P0 triage, 2026-05-30): `.fh-ad-family-grid`
  goes 2-col on `@media (min-width:850px)` = *viewport*, but the admin content column is ~594 px,
  so person cards collapse to ~280 px → the name truncates ("Ji") and the balance `·` separators
  strand on their own lines. Fix: move the 4 action buttons (`.fh-ad-person-btns`) out of
  `.fh-ad-person-top` into their own full-width row under name/balance so the name always gets
  full width. Classic viewport-vs-container trap (see DECISIONS_LOG → "viewport @media, never
  @container").
- **Add `services.yaml`** (deferred from P0 triage): currently missing → HA logs *"Failed to load
  services.yaml for integration: family_hub"* on every reload (harmless — services still fire,
  but no Dev Tools field descriptions). Author it once the v0.7.0 service list is final (incl. the
  P2 `upload_asset` service) so Dev Tools → Actions documents each service and the error clears.

### Expected impact
- Per-mutation write: **1 MB → ~80 KB, debounced** (burst of taps = one write).
- Recorder no longer stores the card model; ">16 KB" warning gone.
- Dashboards get a 1-int signal + on-demand pull instead of a fat push to every device.
- Idle 30 s CPU recompute eliminated.
- Bundle ~607 KB → ~280 KB.
- `data_store.py` / `css.js` reads drop to the concern you're editing (token burn ~halved).

### Suggested PR/commit cut points
Each phase is independently shippable + live-testable. Phase 0 can ship under the current
version as a quick patch; Phases 1–4 land under v0.7.0. Recommend tagging at the end of each
phase once live-tested, not one giant commit.

---

## Post-Re-foundation Backlog — v0.7.x (was v0.6.7; brainstorm — needs design work)

### Group subscriptions
Siblings sharing a Roblox / Game Pass / etc. subscription.
**Open questions:** cost split (even / weighted by chore success / parent-set ratio)? Who is the "owner" — does any contributor's lapse fail the whole group, or only their share? Cancel rights (any contributor / majority / parent only)? Who picks if a new contributor wants in?

### Group rewards (extended)
Beyond the existing chip-in flow. Could include: parent-defined "family items" that don't drain individual balances, family achievement unlocks, kid-vote on what to add next.

### Group streak reward (Jim's request)
**Concept:** a no-cost reward that unlocks when ALL kids hit a sustained success-rate milestone together. Examples: family movie night, restaurant, theme park trip.
**Mechanics to design:**
- Trigger condition: e.g. all active kids at 7-day perfect streak simultaneously? Or aggregate weekly success rate ≥ X%?
- Who picks the reward — parent enters? Family votes from a curated pool?
- Cooldown — once per week / month / quarter?
- Tracking — show progress bar on home strip ("3 of 4 kids on streak — Spencer needs to complete today's chores")
- Reset rules when one kid breaks streak — does it pause, or does it require all kids to re-qualify from zero?
- Storage: separate `family_streak_rewards` list at top level
- UI: new "Family Goal" strip on the command center, visible to all

### Kid-initiated "Propose sharing" UI
Backend exists from v0.6.3; UI never built. See [BUGS.md](BUGS.md) "Deferred."

### Separate Maintenance into its own module (raised 2026-05-29, Jim)
Maintenance is conceptually a different thing from Chores and should be carved
out as a standalone module rather than living as a `category_label == "Maintenance"`
special-case inside the chores system. **Target admin shape: two distinct admin
tabs — "Chores" and "Maintenance" — each with its own list/management UI.**
Today the only seam is the `_chore_is_maintenance()` filter (data_store.py) + the
Home Care drill-down card — maintenance chores are hidden from the Chores tab via
that filter, which is why an unassigned maintenance chore was invisible in admin.
Target a clean split: own data collection / services / admin section, so chores and
maintenance evolve independently. Pairs naturally with the v0.8.0 Home Maintenance
room work. Leave the current behavior untouched until then.

> Note (2026-05-29): "Get ready for School on time" (id `c0552a25…`) was a
> mis-classified Maintenance chore — corrected back to a normal (inactive, Daily)
> chore via an `update_chore` service call. Not an example of the module split.

### Deferred items from v0.6.3 backlog (parked, will revisit after v0.7.0)
- **Streak freeze tokens** — per-person counter; spent automatically to protect a daily success-rate check.
- **Quick-add chore template library** — ~20 curated templates + "From template…" prefill button in add-chore modal. Templates already defined in `src/card/constants.js`.
- **Daily progress bar on personal pages** — `[3 / 7 chores done today]` header element. Pure card-side render.
- **Time-windowed chores** — `available_from` / `expires_at` per chore; sub-day auto-skip.
- **Tabler Icons migration** — audit current `FH_ICONS`, migrate to ~60–80 curated Tabler icons, expand picker grid.

---

## Long-term Roadmap

| Version | Headline | Notes |
|---|---|---|
| **v0.6.5** | Subscription rewards | Roblox / Game Pass / etc. recurring deductions with lapse + cancel flow |
| **v0.7.0** | **Re-foundation (breaking)** | Performance + architecture: scheduled tick (no 30s poll), websocket model API + lean scalar sensors, JSON multi-store + debounced saves + migration, minified bundle, css/modals/admin splits, theme co-location. Folds in the old v0.6.6 cleanup. |
| **v0.7.x** | Group rewards expansion (was v0.6.7) | Group subscriptions, group streak reward, "Propose sharing" UI, v0.6.3 deferred items |
| **v0.8.0** | Home Maintenance room — full feature | Maintenance room is already live as a read-only drill-down. Adds CRUD (add/edit/delete from the card), scheduling/recurrence, richer tracking. Pairs with carving Maintenance out of the chores system. |
| **v0.9.0** | Meals room | Weekly menu builder, grocery list, "what's for dinner" on the home strip. Scaffold is live as coming-soon. |
| **v0.10.0** | Calendar room | Pulls real HA calendar entities into the today strip. Scaffold is live as coming-soon. |
| **v0.11.0** | Smart Home room | Permission-gated lighting/climate/irrigation controls for kids. Scaffold is live as coming-soon. |
| **v1.0.0** | Theme builder UI + public release | Parent authors themes without editing code (rides on v0.7.0 theme co-location). |

**Held out indefinitely (will revisit if user demand surfaces):**
- Photo evidence for approvals — heavier HA media-source dependency.
- History pagination — currently 30-day rolling window; "show older" expand link in admin.
- Achievements / badges engine — wait until ranks have lived in the wild.
- Per-theme audio cues via `alexa_media_player` — fun but a rabbit hole.

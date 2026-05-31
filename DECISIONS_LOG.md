# Family Hub — Decisions Log

> Every non-obvious architectural choice, with the reason and the trap that
> motivated it. Don't re-litigate items below — if you think a decision is
> wrong, talk to the user first and update the entry. New decisions should
> capture both what was decided AND what previously went wrong, so the next
> session doesn't have to re-discover it.

---

## Storage & data shape

### One JSON file, never touched by code updates
- **Decision:** All family data lives in `config/family_hub_data.json`. The integration reads/writes this single file via `FamilyHubDataStore`. The data file path is captured into the config entry at install time and never changes.
- **Why:** Private, self-hosted, no third-party accounts. Migrations are field-level (additive) so deploying new code never rewrites user data wholesale.
- **Don't:** Don't sync the data file via Samba during deploys. Don't add a "wipe and recreate" path. Don't introduce per-record files or a SQL store without a real, separate migration plan.
- **⚠️ Scheduled for reversal — v0.7.0 "Re-foundation" (user-approved 2026-05-30).** The single 1 MB file is rewritten synchronously on every mutation and is 73% cold log data (task_instances 432 KB + history 331 KB). v0.7.0 splits it into three `homeassistant.helpers.storage.Store` instances (`core` / `history` / `task_archive`) with debounced `async_delay_save`, bumps `STORAGE_VERSION 1→2`, and runs a **one-time migration that backs up the old file to `family_hub_data.v1.bak.json`** (still never deletes user data). Stays JSON — not SQL. The atomic-save and silent-migration decisions below are superseded by HA `Store` semantics in the same release. See ROADMAP.md → "v0.7.0 — Re-foundation", Phase 3.

### Schema migration is silent + idempotent + per-record
- **Decision:** `_migrate_chore`, `_migrate_store_item`, `_migrate_task_instance` run on every load and use `setdefault` to fill in new fields without touching existing values. `STORAGE_VERSION` is still 1 even though we're at v0.6.3.
- **Why:** Backward compatibility for existing installs. Bumping a global storage version would force coordinated migration code; setdefault per record means any forward-fill is safe to run repeatedly.
- **Don't:** Don't reach for STORAGE_VERSION bumps unless the change is structural (e.g. splitting one collection into two). Adding a new field = `setdefault` only.

### Atomic save via tmp file + asyncio.Lock
- **Decision:** `async_save` writes to `<path>.tmp` and uses `os.replace` for the swap, inside an `asyncio.Lock`.
- **Why:** Concurrent service calls would otherwise race; a partial write would leave the JSON corrupt across an HA restart.

### History trimmed at 30 days, terminal task instances at 60 days
- **Decision:** Each daily tick prunes `history` entries older than `HISTORY_RETENTION_DAYS = 30` and `task_instances` in terminal statuses older than `TASK_INSTANCE_RETENTION_DAYS = 60`.
- **Why:** Keep the data file size bounded indefinitely. 30 days of activity is enough for the "Recent activity" log; 60 days of completed instances covers any reasonable parent review window.

---

## Card-stub split (permanent)

### `npm run build` produces TWO files, deploy BOTH
- **Decision:** `build:stub` (esbuild → IIFE) produces ~7 KB `family-hub-card.js`. `build:body` (esbuild → ESM) produces ~560 KB `family-hub-card-body.js`. Both must be deployed.
- **Why:** On Echo Show Silk browser, slow phones, and Echo Show 15 cold-boot, the dashboard's first paint races against the 560 KB body bundle download. Without the split, Lovelace renders "Custom element doesn't exist: family-hub-card" until the user manually refreshes. The stub paints "Loading…" instantly via a shadow-DOM placeholder, then hot-swaps to the impl element once the body resolves.
- **Don't:** Don't collapse back into one bundle. Don't try to inline the body via `<script type="module" src=…>` — Lovelace loads module resources via `import(url)`, no `<script>` tag is ever in the DOM.

### Body URL is hardcoded
- **Decision:** `BODY_URL = '/family_hub/family-hub-card-body.js?v=${VERSION}&b=${BUILD_ID}'` is a literal in `main.js`.
- **Why:** The integration registers `/family_hub` as a static HTTP path at setup, so this path is always valid. An earlier attempt to derive a base URL by scanning `<script>` tags returned an empty string (Lovelace module resources don't insert script tags), and the fallback was wrong for this layout.
- **Don't:** Don't reintroduce script-tag scanning. Don't try to relativize the URL.

### VERSION + BUILD_ID cache-bust
- **Decision:** `VERSION` (in `card/constants.js`) is bumped per release; `BUILD_ID` (in `src/build-id.js`, auto-written by `gen-build-id.mjs`) is a millisecond timestamp regenerated each `npm run build`. Both are appended to `BODY_URL` as `?v=VERSION&b=BUILD_ID`.
- **Why:** Without BUILD_ID, dev iterations within a single release left browsers serving the cached body across consecutive Samba deploys. The mtime-based Lovelace resource URL on the stub handles stub-file freshness; BUILD_ID handles body freshness.
- **Don't:** Don't remove `npm run gen-build-id` from the `build` script — it's the prerequisite that lets the stub bake in the latest BUILD_ID.

---

## Web Component invariants

### Custom-element constructors must not touch children / attributes
- **Decision:** Constructors are limited to `super()`, `attachShadow`, and shadow-DOM writes (`shadowRoot.innerHTML`). All light-DOM writes happen in `connectedCallback` or later.
- **Why:** The HTML spec forbids `appendChild` / `setAttribute` / `innerHTML` on a custom element's host inside `constructor()`. Doing so throws `InvalidStateError` and leaves the element in a "failed upgrade" state — it exists in the DOM with `HTMLElement.prototype`, not your class's prototype, so `setConfig` and `hass` setter come back `undefined`. This bit us in v0.6.1 (the editor wrapper) where HA reported "this._configElement.setConfig is not a function". Shadow content is allowed because it's not "children" per the spec.
- **Don't:** Don't write to `this.innerHTML` in any custom-element constructor. Don't add attributes in the constructor either.

### Event listeners attached ONCE in `connectedCallback` via AbortController
- **Decision:** `FamilyHubCard.connectedCallback` creates an `AbortController` and attaches every delegated listener with `{ signal }`. `disconnectedCallback` calls `abortCtrl.abort()`.
- **Why:** v0.2.2 had a leak — listeners were re-attached on every `_doRender`, accumulating dozens of handlers per session. AbortController gives one clean detach point.
- **Don't:** Don't attach listeners inside `_doRender`. Don't manually `removeEventListener` (you'd need to keep refs); AbortController handles it.

### Dirty-check uses `last_updated`, NOT `last_changed`
- **Decision:** `_maybeRender` compares `state.last_updated` for each Family Hub sensor.
- **Why:** HA only bumps `last_changed` when the state value differs. Most Family Hub changes are attribute-only (queue updates, task progression) and don't change the state value, so `last_changed` would silently swallow updates.
- **Don't:** Don't switch to `last_changed`. Don't try to subscribe to specific attributes — just trust the timestamp.
- **Superseded by v0.7.0 P2:** the `last_updated`/`FH_SENSORS` dirty-check loop is gone. The card now dirty-checks the single `data_rev` scalar on `needs_attention` (see "Card dirty-check keys off `data_rev`" below) and fetches the websocket model on change. `FH_SENSORS` is now an unused export in `constants.js`.

### `_doRender` appends the modal as a SEPARATE DOM node
- **Decision:** The modal `<div class="fh-modal-bg">` is appended to the shadow root after the main `.fh-card` div, not nested inside it.
- **Why:** Background re-renders rebuild `.fh-card.innerHTML`. If the modal were inside, every 30s coordinator poll would wipe it mid-edit.

### Re-render freeze while a modal OR admin inline panel is open
- **Decision:** `_maybeRender` short-circuits when `_modal`, `_adminSelectedChoreId`, or `_adminSelectedItemId` is set.
- **Why:** Even with the modal-as-separate-node trick, a re-render rebuilds the form DOM. Typed-but-unsaved field values would be lost on each 30s poll.

### Chore form tab switch is CSS-only — no re-render
- **Decision:** The `chore-tab` dispatch case toggles `.active` classes and `style.display`, never calls `_doRender`. State variable `_choreFormTab` is reset on modal close, panel close, and after save.
- **Why:** All four panes (Details / Schedule / Points & Rewards / Reminders) are already in the DOM. Tabbing between them mustn't clear typed input on the inactive panes.

### Admin inline panel + modal share `m-*` element IDs
- **Decision:** Opening any chore modal (`open-add-chore`, `open-edit-chore`) always clears `_adminSelectedChoreId` first.
- **Why:** Inline panel and modal use the same form-field markup builders. Having both in the DOM simultaneously creates duplicate IDs and the wrong values get read on submit.

---

## Sensor design

### One needs_attention sensor carries the entire admin payload
- **Decision:** `sensor.family_hub_needs_attention` exposes approval/redemption/group-proposal queues, all people, all active chores, all store items, settings, and a 30-day history log all in one attribute payload.
- **Why:** The card needs nearly all of this on every render; pulling it via multiple sensor subscriptions would multiply websocket traffic with no benefit. One big payload is fine for our scale (small family).
- **Don't:** Don't pre-emptively split the payload to "save memory" — the card's container queries are the bottleneck, not the JSON size.
- **✅ REVERSED + SHIPPED — v0.7.0 P2 (2026-05-30).** This "Don't" was wrong at scale: the payload included the 30-day `history_log` + all chores (×2) + all store items (×2), pushed through the HA **state machine + recorder to every device on every mutation** (HA logged the ">16 KB state attributes" warning). **Now implemented:**
  - The full card model lives in `card_model.py` (`build_card_model(store)` → dict keyed by entity_id) and is served by a websocket command **`family_hub/get_model`** (`websocket.py`, registered once in `async_setup`).
  - The card (`FamilyHubCard._fetchModel`) pulls the model over the websocket and reads it via `card._attrs(<entity_id>)` (model-first, falls back to live attrs). Balance is still read from the per-person sensor **state** (`card._states(eid).state`).
  - **Sensors are now lean scalars** (`build_*_scalars` in `card_model.py`): `needs_attention` = `data_rev` + action counts + a SLIM roster (`people` = id/name/type/theme) + `rooms_config` + `family_name` (the slim roster + rooms_config exist purely so the **card config editor** still works); per-person = identity + point summary + counts; maintenance = summary; claimable = `{}`.
  - `_unrecorded_attributes` (P0) still excludes the volatile `data_rev` + slim roster from the recorder.

### Card dirty-check keys off `data_rev` — track the SENSOR's value, NOT the model's (v0.7.0 P2)
- **Decision:** `store.data_rev` is an in-memory counter bumped on every `async_save()`. It's exposed as a scalar attr on `needs_attention`. The card's `_maybeRender` compares `hass.states["sensor.family_hub_needs_attention"].attributes.data_rev` to `this._lastDataRev`; on change it calls `_fetchModel`, which sets `this._lastDataRev = <the sensor rev that triggered the fetch>` — **not** the `data_rev` embedded in the fetched model.
- **Why (the trap):** the model's `data_rev` is read straight from the store at fetch time, while the sensor's `data_rev` only updates on a coordinator refresh. The **per-minute notification heartbeat** (P1) calls `async_check_notifications` → `async_save` (bumps `data_rev`) **without** a coordinator refresh, so the store's counter — and therefore the model's `data_rev` — runs *ahead* of the sensor's. Keying `_lastDataRev` off the model value made `rev !== _lastDataRev` perpetually true, so the card refetched + re-rendered on **every** `set hass` (which fires on any HA state change anywhere) → open `<select>` dropdowns rebuilt and closed themselves ("tick refresh"). Tracking the sensor-sourced rev makes the comparison apples-to-apples.
- **Don't:** Don't set `_lastDataRev` from `model[...].data_rev`. Don't bump `data_rev` on the notification heartbeat path expecting the card to react (it can't see it until the next coordinator refresh — which is correct; notification flags aren't card-relevant).

### Person sensors are added/removed dynamically without HA restart
- **Decision:** `sensor.async_setup_entry` stashes `add_person_sensor` and `remove_person_sensor` callables in `hass.data`. The `add_person` / `remove_person` service handlers look them up and call them after mutating the data store.
- **Why:** Requiring a restart to add a kid is a terrible UX. The callables capture `async_add_entities` from the sensor platform forward, which is the only legitimate way to add an entity dynamically.

### Stale-entity cleanup on every reload
- **Decision:** `_async_cleanup_stale_entities` builds a set of expected unique_ids and removes anything in the registry not in that set.
- **Why:** When you remove a person or rename a sensor, the entity registry stays populated until cleanup. Without this, old `sensor.family_hub_<deleted_kid>` entities linger and confuse the dashboard.

### Services are removed dynamically, not from a hardcoded list
- **Decision:** `async_unload_entry` iterates `hass.services.async_services_for_domain(DOMAIN)` instead of hardcoding the service names.
- **Why:** Adding a new service in a future release won't silently leak across reloads.

---

## Chore mental model (do NOT re-litigate)

### Chores have a "window", not a deadline
- **Decision:** Chores are *available* during their recurrence window. When the next cycle starts, an incomplete instance is *skipped* (with penalty if configured). Kids never see "overdue".
- **Why:** "Overdue" creates pressure that isn't useful for daily/weekly chores. The window framing matches the actual semantics — a chore that didn't get done has already been replaced.
- **Don't:** Don't render "Xd overdue" on a kid's personal page. "BREACH" is reserved for the genuinely-post-reset state on Mission Control. "Overdue" language is allowed only for Home Maintenance items.

### Ghost instance rule
- **Decision:** `CHORE_TYPE_ASSIGNED` chores with no `assigned_to` entries never generate task instances. Only `CHORE_TYPE_REMINDER` and `CHORE_TYPE_CLAIMABLE` may have unassigned instances.
- **Why:** Pre-multi-person era data had `assigned_to=""` instances. Surfacing those on the command center showed nameless tasks that nobody could complete.

### Penalty pause is sticky
- **Decision:** Person-level `penalties_paused` flag stays set until a parent manually turns it off. Same for `settings.penalties_paused` (global).
- **Why:** Sick days and vacations don't have a known end date. Auto-clearing would either expire too soon or require date pickers nobody wants to maintain. A parent unpausing is one tap.

### Streak source-of-truth: `getActiveStreaks` unions per-chore + person streaks
- **Decision:** Use `getActiveStreaks(attr, naAttr, person, max)` in `themes/_shared.js`.
- **Why:** Per-chore streaks (from task rows) only appear when a chore is *due*. A weekly chore on Tuesday has an active streak all week but only appears in `tasks_due_today_list` on the reset day. The union of task-row `.streak` and `naAttr.people[].streaks` dict surfaces the full picture.
- **Don't:** Don't pull streaks only from `tasks_due_today_list`.

### Rolling streak milestones via `streak % milestone`
- **Decision:** Backend fires `streak_bonus_points` every `streak_milestone` completions on an ongoing basis. Frontend uses `computeStreakProgress(streak, milestone, maxSegs)` and fills the bar toward the next milestone using `streak % milestone`.
- **Why:** "Reset on milestone hit" was confusing — kids felt like they "lost" the streak. Rolling milestones let the streak count keep growing while the progress bar resets cleanly each cycle.

---

## Frontend layout rules

### Use viewport `@media` queries, NEVER `@container` queries for layout switching
- **Decision:** All breakpoints for two-column vs single-column, sidebar vs bottom-nav, etc. use `@media (min-width: …)`.
- **Why:** HA Lovelace cards in standard sectioned dashboards are column-constrained even on desktop, so the card's container width is always narrow. `@container` would only respond inside Panel views. Media queries respond to the actual viewport and work in both modes.

### Typography hard floor: 12px / `--fh-text-xs`
- **Decision:** Body content uses `--fh-text-base` (16px). The smallest allowed token is `--fh-text-xs` (12px), used only for mono badges and timestamps.
- **Why:** User has significant uncorrected prescription. Reading from 6-12 feet (kitchen Echo Show 15) requires generous type. This is an **accessibility requirement**, not preference.
- **Don't:** Don't write any `font-size` below 12px. Don't introduce a new smaller token.

### Design reference scale-down
- **Decision:** Files in `docs/design-reference/*.jsx` are authored for 1920×1080 full-screen. The Lovelace card is ~400px wide in column dashboards. Scale every decorative element (frames, watermarks, corner ornaments) down 40-60% from reference.
- **Why:** Themed page decorations break the layout if pasted at design-reference sizes.

### Themed personal-page two-column layout
- **Decision:** All six themes use `body.has-rail` grid: `1fr` content + `480px` rail at `@media (min-width: 900px)`, single-column below. Rail only appears on the Tasks tab; Store and History use full width.
- **Why:** Rail content (KPIs, streak constellation, recent wins) belongs with task work, not transactional Store/History views.

### Kid mode is a CSS modifier, not a render fork
- **Decision:** `person.child_mode === true` adds `.kid-large` to the page wrapper. A per-theme CSS block under `.kid-large` flips the row list to a card grid. Same render path, same DOM, same data.
- **Why:** Earlier sessions designed kid-mode as a separate render path; that meant maintaining six full second renderers. The CSS-modifier approach keeps theme personality intact in kid-mode and halves the code.
- **Don't:** Don't add a `renderKidMode()` to themes — the modifier handles it.

### Shared row anatomy via `htmlChoreRow`
- **Decision:** Every adult theme row goes through `htmlChoreRow(t, cfg, person, card, opts)` in `themes/_shared.js`. Each theme exports a `<theme>RowConfig` (~10 keys) and a `.fh-row--<themeKey>` CSS color block.
- **Why:** Adding a new theme = one config + one CSS override block — no `_row` helpers anywhere. Bug fixes happen once.

### CSS z-index on themed pages — NEVER use bare `.fh-XX-page > *`
- **Decision:** Use **explicit named selectors** for content elements that need z-index promotion.
- **Why:** `.fh-XX-page > * { position:relative; z-index:N }` pulls absolutely-positioned decorative elements (sigils, watermarks, corner ornaments) into normal flow, breaking the layout.

### Rank bar is themable via CSS vars
- **Decision:** `.fh-rank-bar-*` uses `--fh-rb-track`, `--fh-rb-drop`, `--fh-rb-status` with white-on-dark defaults. Paper themes (`.fh-dn-page`, `.fh-bk-page`, `.fh-hp-page`) override to sepia. DBZ rail panels override to ink-on-white.
- **Why:** Themes vary too much in palette to bake colors into the renderer.

---

## Drag-and-drop reorder

### Sort_order via bisection, reindex on collapse
- **Decision:** Drop computes `new_order = (before + after) / 2`. If the gap shrinks below `GAP_THRESHOLD = 0.01`, reindex the full list to `(i+1)*10` and push updates for each row.
- **Why:** Pure bisection works for ~50 drops before precision becomes a problem. Periodic reindexing avoids ever rebalancing globally.

### Above/below insertion line is mandatory
- **Decision:** `dragover` decides side from cursor position vs target midpoint and applies `.fh-drop-above` / `.fh-drop-below` to draw a blue line.
- **Why:** Without it, users couldn't tell whether a drop would land before or after the target row. Multiple complaints from the user about "drag looks broken" — actually it worked but the visual was ambiguous.

### Category chips use cursor X (horizontal), chores/store-items use cursor Y
- **Decision:** Single drag handler branches on `row.dataset.dragType` to pick X vs Y for the midpoint compare.
- **Why:** Category chips render in a horizontal row; chores/store-items are vertical lists.

### `data-drag-type` gates cross-list drops
- **Decision:** `dragover` short-circuits when the over-target's `dragType` doesn't match the dragged row's type.
- **Why:** Reuses one set of handlers for three lists without risk of dropping a chore into the category chip strip.

---

## Personal page chore order honors admin sort_order

### `get_tasks_for_card` sorts by `(sort_order, name)`
- **Decision:** All backend `get_*_for_card` accessors include `sort_order` on rows and sort by `(sort_order, name)` rather than `name` alone.
- **Why:** v0.6.3 P2 fixed a bug where admin drag-reorder appeared broken from kid pages because `get_tasks_for_card` was sorting by name and ignoring `sort_order`. Same fix applied to `get_all_tasks_for_command_center` and `get_claimable_tasks_for_card`.

### Admin Tasks list seeds groups from `category_labels` first
- **Decision:** Group Map is seeded from `category_labels` so category drag-order in Settings is reflected on the admin Tasks page. Orphan categories (labels present on a chore but missing from `category_labels`) get appended after.
- **Why:** Single source of truth for category ordering across the entire UI.

---

## Group rewards (v0.6.3 item 13)

### Two entry paths: parent-initiated AND kid-initiated
- **Decision:** Parents toggle "Group reward" in the admin store-item form. Kids hit "Want to share this" on their store tab and propose a split that enters the approval queue.
- **Why:** Parents drive the formal setup; kids drive the spontaneous "let's pool for it" use case. Both produce the same `contributors: [{person_id, share_pct, contributed_pts}]` shape on the item.
- **Status:** Parent-initiated is complete. Kid-initiated proposal-creation UI is deferred (the backend list `group_reward_proposals` and frontend `htmlGroupProposalBanner` helper are wired in).

### Contributor pills are horizontal/compact, not vertical bars
- **Decision:** `htmlGroupContributorBars()` renders contributor pills as avatar initial + `contributed/target` pts, side-by-side.
- **Why:** The original tall vertical layout dominated the store row. Compact pills keep store-tab scroll tight.

### Contrast: opaque surface + text-shadow on initials
- **Decision:** `.fh-gcp` background is `var(--fh-surface)` (opaque), not `rgba(.08)`. Avatar initials carry a dark `text-shadow` halo.
- **Why:** Pts text was unreadable on translucent pills. Initials needed a halo so they remain readable on any avatar_color (including light yellows/greens).

---

## Editor / admin UX

### Chore form: four tabs, CSS-only switching
- **Decision:** Tabs are Details / Schedule / Points & Rewards / Reminders. All four panes render at once; the `chore-tab` dispatch case toggles visibility via CSS.
- **Why:** Tab switching mustn't re-render the form (would lose typed input on inactive panes). `_choreFormTab` state is reset on modal close, panel close, and after save.

### True hard-delete for rewards (in addition to soft deactivate)
- **Decision:** `async_hard_delete_store_item` physically removes the record AND cancels any pending redemptions. The inline editor footer has: Save · Deactivate (soft) · Delete ✕ (permanent). Row trash button remains soft-delete.
- **Why:** Soft-deactivate ("set active=false") was the only path before — kids' historic redemptions still referenced the item, but the admin store list grew unbounded. Hard-delete is parent-driven, with the implicit understanding that historical references are broken.

### Service errors surface as alerts
- **Decision:** `_svc` catches the service-call Promise rejection, walks `{body, error, message}` shapes for a usable message, truncates to 600 chars, and shows `alert(...)`.
- **Why:** Earlier silent failures (e.g. voluptuous schema validation when HA wasn't restarted after a schema change) confused the user. Alert + console.error gives a fast diagnostic.

---

## Rank / PPD economy

### Per-rank PPD ladder, not a single divisor
- **Decision:** `settings.rank_ppd_ladder = [3.0, 3.5, 4.0, 4.5, 5.0]` (cents/point per rank index). `get_rank_cents_per_pt(rank_index)` clamps to ladder bounds. Both sensor `dollar_value` and `store.points_cost` use rank-adjusted PPD. Redemption deducts rank-adjusted cost.
- **Why:** "Ranking up makes your points worth more" — direct reward for sustained performance. Surface area touches multiple read sites; this is intentional and centralized via `get_rank_ppd`.

### Parents are `rank_index = 999` (treated as max rank)
- **Decision:** Parent records get `rank_index = 999` at migration / creation. `getEffectiveRank` clamps to `[0, ranks.length - 1]`.
- **Why:** Parents shouldn't appear to be "rank 1 of 5". 999 makes "max rank" trivially explicit in JSON without a separate boolean.

### Success-rate person streak is its own pass in the daily tick
- **Decision:** `_async_process_completion_streaks(tick_date)` runs in the catch-up loop AFTER the skip pass. Counts assigned chores due the prior day; EXCUSED pulled from BOTH numerator and denominator (rest-day semantics); zero-chores days leave the streak untouched; evaluation skips when penalties are paused.
- **Why:** Sequencing matters — skipped instances must be settled before we measure completion rate. Excused-as-rest-day matches the parent's intent for sick days.

### Streak-freeze tokens split across v0.6.3 (backend) and v0.6.4 (frontend)
- **Decision:** The backend (`streak_freezes_available` counter on each person, earning at streak milestones, auto-spend during the daily tick when a completion-streak would otherwise break) shipped in v0.6.3. The frontend rail chip showing the token count is deferred to v0.6.4.
- **Why:** The earning/spending logic was tightly coupled to the daily-tick and completion-streak refactors already in v0.6.3. The UI surface is a single chip per theme and doesn't block any other v0.6.3 item — clean cut point.
- **Don't:** Don't ship the rail chip without reading `streak_freezes_available` from the per-person sensor attribute — the backend already writes it there.

---

## Mission Control / Chores HQ

### Phantom row retention via `card._mcLastTasks`
- **Decision:** Tasks tapped via GO are cached. If the next sensor refresh removes them (instant-completion path), but they're still in `card._pendingSubmit`, the cached task is replayed as a pending-state row so the user sees confirmation for the full 35s window.
- **Why:** Without this, the row vanished immediately on tap, causing kids to re-tap thinking nothing happened.

### Mission Control is read-only
- **Decision:** Approval/denial actions live in Admin only. Mission Control shows intel, no action buttons for approvals.
- **Why:** Kitchen Echo Show is accessible to kids. If Mission Control had approve buttons, kids could approve their own chores.

---

## Doc conventions

### CLAUDE.md / ROADMAP.md / ARCHITECTURE.md / DECISIONS_LOG.md / BUGS.md
- **Decision (v0.6.4):** The project's support docs are now split by lifetime and read frequency:
  - `CLAUDE.md` — session-time operational state (current status, handoff, checklists, environment, system prompt addendum). Read every session. Adopts Anthropic's canonical filename so Claude Code auto-loads it.
  - `ROADMAP.md` — active version scope, next-version plans, backlog, long-term roadmap. Read when picking the next task.
  - `ARCHITECTURE.md` — stable structural reference. Read on demand.
  - `DECISIONS_LOG.md` — append-only architectural decisions ledger. Read before structural changes.
  - `BUGS.md` — active bugs by tier + recently-fixed history. Read at session start.
- **Why:** A single `notes.md` mixing operational state, version planning, and per-phase execution instructions ballooned to ~750 lines and was expensive to read fully every session. The split keeps the per-session read cheap (`CLAUDE.md` alone is ~180 lines) while preserving all the reference material in places that are read only when needed.
- **Pre-v0.6.4 history:** The same split idea existed earlier as `notes.md` + per-release `PLAN-v<version>.md` + `docs/HANDOFF-<date>.md`, but those auxiliary files were never consistently produced and the planning content kept landing back in `notes.md`. `ROADMAP.md` formalizes the planning split into a single durable file.

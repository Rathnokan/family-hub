# Family Hub — Known Bugs

> Active issue tracker. Severity definitions:
> - **Blocking** — feature unusable; users actively losing data or stuck.
> - **High** — wrong result on a normal path; users notice; workaround exists.
> - **Low** — cosmetic / edge case / rare; ship can wait.
>
> New bugs found mid-session: add to the relevant tier here. Fixed bugs move
> to "Recently fixed" until the next minor release, then drop off.
>
> Last full triage: **2026-06-02** (v0.7.1 bug-swat, off a full-codebase read).

---

## ✅ Fixed in v0.7.1 — deployed to Samba 2026-06-02, pending live-test, NOT yet committed/tagged

1. **Redemption approval could hand out a reward for free (overspend).** `async_approve_redemption` never re-checked the balance; `async_deduct_points` floors at 0, so two pending redemptions each affordable alone could both be approved. Now re-checks affordability for one-time redemptions and leaves the request pending if the kid can no longer afford it. — `redemptions_mixin.py`
2. **Subscription `dollar_cost_override` of exactly 0 ("free") was ignored at renewal.** The tick used `override or item_value`, so a 0 override fell back to full price while the card showed 0. Now uses `is not None`, matching the display path. — `subscriptions_mixin.py:_async_process_subscriptions`
3. **Lapsed-sub "✓ Ready" lied (old High #2, final of three rail helpers).** `htmlStoreRailContent` computed `ready = balance >= points_cost`, ignoring `accumulated_debt` (the other two helpers were already fixed). Now uses `owed = points_cost + debt`. Used by all six themes' store tab. — `themes/_shared.js`
4. **"Add task" penalty controls were dead.** The modal showed "Apply penalty if not completed before expiry" + a points field, but nothing read them. Now wired end-to-end: `async_add_task` accepts `penalty_enabled`/`penalty_points`, the `add_task` service schema accepts them, and `ok-add-task` sends them. Penalty fires via `_async_expire_tasks` when the task expires unfinished. — `chores_mixin.py`, `services.py`, `dispatch.js`
5. **`cancel_pending` subscription lapse was silent (old High #7).** First-lapse notification keyed off `status == active`, so a cancel-pending sub that lapsed grew `accumulated_debt` invisibly. Now notifies on the first missed renewal regardless of status. — `subscriptions_mixin.py`
6. **Inline subscription editor wiped by background refresh.** `_editingSubId` wasn't in the render-freeze, so any background model refetch rebuilt `.fh-card` and lost the typed cost/date. Added to the freeze in `_maybeRender` + `_fetchModel`. — `FamilyHubCard.js`
7. **History views showed raw event-type strings.** `HISTORY_META` lacked entries for `subscription_started/renewed/lapsed/canceled/cancel_requested` and `group_proposed/chip_in/redeemed`. Added all eight. — `constants.js`

**Cleanup / drift killed in the same pass (zero behaviour change):**
- `const.VERSION` was `"0.6.5"` (dead + wrong) → `"0.7.0"` + comment noting manifest/constants.js are canonical.
- Per-person penalty read reverted to the global constant during the v0.7.0 split (the exact trap the v0.6.4 fix removed) → now uses `CONF_PENALTIES_PAUSED_PERSON_KEY`. — `data_store.py:is_penalty_paused_for`
- Admin sidebar hardcoded `v0.6.0 · ADMIN` → `v${VERSION}`. — `modes-admin.js`
- Coming-soon badges (`COMING IN v0.7.0/0.8.0/0.9.0`, one of them wrong) → `COMING SOON`. — `rooms/{meals,smarthome,calendar}.js`
- `rebuild_data` notification + ARCHITECTURE.md + DECISIONS_LOG.md now state the real **30d** task-instance retention (was documented as 60d — see ⚠️ below).
- Removed dead `FH_SENSORS`, `UPDATE_INTERVAL`, and the unused `card._dirty` writes.

> **⚠️ Confirm: task-instance retention is 30 days, not 60.** `TASK_INSTANCE_RETENTION_DAYS = 30` in code; the docs had said 60. Docs/strings now match the code (30). If 60 was intended (longer parent review window / further-reaching reversible-action buttons in History), it's a one-line change in `const.py`.

---

## ✅ Fixed in v0.7.2

- **Weekly-points window mismatch (report 1.7):** `getWeeklyPts`/`getWeeklyPtsLost` now take an `evalWeekday` arg and anchor the week to the most recent configured `rank_eval_weekday` (was hardcoded "since last Monday"), matching the server's trailing-week eval window. All six themes pass `naAttr.rank_eval_weekday`. — `themes/_shared.js`
- **Dead code:** removed the orphaned `save-rank-ppd-ladder` dispatch handler (the inline Settings-tab ladder it served moved into the Ranks drawer's Global tab). — `src/card/dispatch.js`
- (Shipped together with the v0.7.2 "Dynamic Ranks" feature — see RELEASE-NOTES-v0.7.2.md.)

### Also rode v0.7.2 (was "Fixed on `main` since v0.7.1")

- **Hardening:** both `persistent_notification.create` calls are now guarded (`_notify_approval` / `_notify_redemption`); history sort tolerates a missing `timestamp` (`.get`); `update_subscription` `period` is validated against `SUB_PERIODS`.
- **Slug whitespace divergence:** JS `slug()` now matches the Python transform (`.replace(/ /g,"_")`).
- **Dedup:** `sensor.py` imports `get_maintenance_tasks` from `card_model` instead of carrying a byte-identical copy.
- **Cruft:** deleted the stale tracked `www/family-hub-card.js.bak`.
- **Engineer theme task truncation:** `_workOrders` capped the list at `slice(0, 6)`, silently hiding the 7th+ due/overdue chore (no other theme does this). Now renders all. — `themes/engineer.js`

---

## ✅ Fixed in v0.7.5 (deployed Samba + main/tag)

- **Rotation editor showed the wrong "current" holder and couldn't switch turns.** The backend advances rotations by bumping `rotation_index`/`assigned_to` without reordering `rotation_pool`, so the editor's pool widget (top = "Current") showed a stale holder after any rotation and reordering couldn't reliably switch it. The editor now renders the pool **current-first** (`rotPoolOrdered`); saving snaps the active holder to the top via the existing `async_update_chore` reset-on-pool-change. — `modals.js`
- **Editing a chore scrolled the page to the top.** Dropped `autofocus` on the chore-name input — the editor drawer animates in from off-screen and autofocus' scroll-into-view yanked the page up. — `modals.js`
- **Cleanup:** removed dead `_rotationSwitchLabel` (`modes-admin.js`) and the orphaned `ok-edit-chore-inline` / `close-chore-panel` dispatch cases (retired inline-editor panel). Corrected the stale history-payload note (see Known trade-offs — it's 150 rows, not ~977).

---

## Open — deferred (real, but not surgical; fix when next in that area)

### Personal-page section-hiding when a module is off (v0.8.0 A6) — cosmetic
- When **Chores** is disabled, a kid's themed personal page still renders the "today's tasks" section header (shows the empty / "all done" state); when **Rewards** is disabled, the store rail renders empty. The backend correctly gates the data (empty lists in `build_person_payload`), so nothing breaks — only the empty section header lingers. Hiding those headers means gating on `naAttr.modules.chores` / `.rewards` in all six themes (+ `themes/_shared.js`). Deferred from A6 to avoid regression risk across the themed pages; do it if the chores/rewards toggles see real use. — `themes/*.js`, `_shared.js`

### ~~First-parent attribution~~ — **RESOLVED in v0.7.3 (admin actor logging)**
- Instead of mapping the acting HA user to a *person*, v0.7.3 records the **logged-in HA user name** directly: `store.acting_as(await _resolve_actor(hass, call))` wraps the admin handlers, `_append_history` stamps an `actor` field, and the History rows show "· by &lt;name&gt;". Parents are treated as one unit per the user's call; mostly reads "Administrator". See `history_admin_mixin.py` (`acting_as`/`_append_history`) + `services.py` (`_resolve_actor`).

### Slug collision (residual of report 1.6) — theoretical
- The JS/Python *whitespace* divergence is fixed (both single-space now). What remains: if two people's names slugify to the **same** entity_id, HA appends `_2` to the second while `card_model.person_entity_id` returns the un-suffixed key → that person's page would miss the model. Needs the backend to expose each person's real `entity_id` if it ever matters. Not a concern for the current family. — `card_model.py:person_entity_id`

### Weekly-points window: residual (allowance/bonus deltas)
- The Monday-vs-eval-weekday window divergence is fixed in v0.7.2. One smaller difference remains: the server eval sums **all** positive `points_delta` (including allowance/bonus), while the card bar's `getWeeklyPts` also sums positive deltas — these now use the same window, but if the bar and eval are ever desired to scope to chore-earned points only, that's a separate, deliberate change. Not currently a problem. — `themes/_shared.js`, `streaks_ranks_mixin.py`

### Dedupe / cosmetics (low value)
- `get_active_chores_for_card` ≈ `get_all_chores_for_card` (~90% shared row builder) — left alone (outputs differ slightly; needs care to merge safely).
- Three overlapping subscription-rail renderers in `_shared.js`; `htmlSubscriptionRail` is a dead export (no call sites, still imported by all 6 themes) — left as-is to avoid editing all six theme imports for marginal benefit.
- Theme flavor text is hardcoded to its intended person (baker → "Shannon's Kitchen", dinos → "Spencer's Field Log", dbz → "CODENAME KAMEHA"). Harmless while themes stay assigned as designed; would mislabel if someone picked another person's theme. By-design, noted for awareness.

> **Audit note (2026-06-02):** all six theme render files + `icons.js` were read line-by-line this pass (the gap from the original audit). Only the engineer truncation above was a real bug; the rest were clean.

---

## Known trade-offs (intentional — do NOT "fix" without a reason)

- **`build_card_model` runs synchronously on the event loop.** The `history_log` it ships is **capped at 150 collapsed rows** (`get_history_for_card(limit=150)`) over websocket (off the state machine since v0.7.0) — **confirmed NOT a problem at family scale (v0.7.5 check).** Residual: the builder still *walks* the full history to produce those 150 rows each `data_rev`. Eventual fix = lazy per-view `family_hub/get_history` ws command; don't double-handle here.
- **Mixins over-import the full `const` block on purpose** — CI's ruff deliberately doesn't select `F401`, so this won't go red. Cosmetic token cost only.
- **`dispatch.js` is one ~90-case switch** with a couple of inconsistent person→entity_id slug approaches. Low-value refactor; splitting it is a silent-import risk ruff (Python-only) can't catch. Leave unless specifically wanted.

---

## Recently fixed (retained for context — do not re-open)

### v0.7.0-era subscription bugs confirmed already fixed (verified during the 2026-06-02 read)
- **old Blocking #1** — `get_subscriptions_for_person` now honours `dollar_cost_override` (`is not None`).
- **old High #3b** — the dead `case "subscribe"` block is gone from `dispatch.js` (subs flow through `approve-subscription-redemption`).
- **old High #4** — decline/update now use `HISTORY_SUBSCRIPTION_CANCEL_DECLINED` / `HISTORY_SUBSCRIPTION_UPDATED` (no longer reuse `POINTS_AWARDED`).
- **old High #6** — `_advance_renewal_date` clamps `target_day = max(1, min(anchor, max_day))`, so `anchor=0` no longer crashes monthly subs.

### Older (v0.2.2 – v0.6.5)
Dropped from this tracker to keep it lean — per-bug detail lives in `RELEASE-NOTES-v0.6.*.md` and git history. Durable lessons from those fixes are captured as invariants in [DECISIONS_LOG.md](DECISIONS_LOG.md) (atomic save, ghost-instance rule, AbortController listeners, rotation key, corrupt-JSON backup, etc.).

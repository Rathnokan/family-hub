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

## ✅ Fixed on `main` since v0.7.1 (unreleased — rides the next version bump)

- **Hardening:** both `persistent_notification.create` calls are now guarded (`_notify_approval` / `_notify_redemption`); history sort tolerates a missing `timestamp` (`.get`); `update_subscription` `period` is validated against `SUB_PERIODS`.
- **Slug whitespace divergence:** JS `slug()` now matches the Python transform (`.replace(/ /g,"_")`).
- **Dedup:** `sensor.py` imports `get_maintenance_tasks` from `card_model` instead of carrying a byte-identical copy.
- **Cruft:** deleted the stale tracked `www/family-hub-card.js.bak`.
- **Engineer theme task truncation:** `_workOrders` capped the list at `slice(0, 6)`, silently hiding the 7th+ due/overdue chore (no other theme does this). Now renders all. — `themes/engineer.js`

---

## Open — deferred (real, but not surgical; fix when next in that area)

### First-parent attribution (was High #5) — **affects this family (Jim + Shannon)**
- **Files:** `src/card/dispatch.js` (approve/deny/excuse/reject/redemption/subscription cases), `src/card/modes-admin.js` (history-row Excuse/Reject/Mark-done buttons).
- **Symptom:** every admin action resolves the actor via `card._people().find(p => p.type === "parent")` → always the *first* parent. In a two-parent household every approval/penalty reversal is logged as Jim regardless of who tapped.
- **Why deferred:** not a one-liner — needs the acting HA user mapped to a person (`hass.user.id` → `person.ha_user_id`) and threaded through the card. Worth a small focused task.

### Slug collision (residual of report 1.6) — theoretical
- The JS/Python *whitespace* divergence is fixed (both single-space now). What remains: if two people's names slugify to the **same** entity_id, HA appends `_2` to the second while `card_model.person_entity_id` returns the un-suffixed key → that person's page would miss the model. Needs the backend to expose each person's real `entity_id` if it ever matters. Not a concern for the current family. — `card_model.py:person_entity_id`

### Weekly-points window mismatch (report 1.7)
- Rank bar (`getWeeklyPts`) sums "since last Monday 00:00"; the server (`_async_process_weekly_ranks`) evaluates over the trailing 7 days ending on `rank_eval_weekday`, and includes allowance/bonus deltas. The kid's "+1 rank" prediction can disagree with the actual server decision mid-week. — `themes/_shared.js`, `streaks_ranks_mixin.py`

### Dedupe / cosmetics (low value)
- `get_active_chores_for_card` ≈ `get_all_chores_for_card` (~90% shared row builder) — left alone (outputs differ slightly; needs care to merge safely).
- Three overlapping subscription-rail renderers in `_shared.js`; `htmlSubscriptionRail` is a dead export (no call sites, still imported by all 6 themes) — left as-is to avoid editing all six theme imports for marginal benefit.
- Theme flavor text is hardcoded to its intended person (baker → "Shannon's Kitchen", dinos → "Spencer's Field Log", dbz → "CODENAME KAMEHA"). Harmless while themes stay assigned as designed; would mislabel if someone picked another person's theme. By-design, noted for awareness.

> **Audit note (2026-06-02):** all six theme render files + `icons.js` were read line-by-line this pass (the gap from the original audit). Only the engineer truncation above was a real bug; the rest were clean.

---

## Known trade-offs (intentional — do NOT "fix" without a reason)

- **`build_card_model` runs synchronously on the event loop** and still ships the ~977-entry `history_log` on every `data_rev` change. Tracked as the v0.7.1 perf backlog item #3 (lazy per-view history via a `family_hub/get_history` ws command). Don't double-handle here.
- **Mixins over-import the full `const` block on purpose** — CI's ruff deliberately doesn't select `F401`, so this won't go red. Cosmetic token cost only.
- **`dispatch.js` is one ~90-case switch** with a couple of inconsistent person→entity_id slug approaches. Low-value refactor; splitting it is a silent-import risk ruff (Python-only) can't catch. Leave unless specifically wanted.

---

## Recently fixed (retained for context — do not re-open)

### v0.7.0-era subscription bugs confirmed already fixed (verified during the 2026-06-02 read)
- **old Blocking #1** — `get_subscriptions_for_person` now honours `dollar_cost_override` (`is not None`).
- **old High #3b** — the dead `case "subscribe"` block is gone from `dispatch.js` (subs flow through `approve-subscription-redemption`).
- **old High #4** — decline/update now use `HISTORY_SUBSCRIPTION_CANCEL_DECLINED` / `HISTORY_SUBSCRIPTION_UPDATED` (no longer reuse `POINTS_AWARDED`).
- **old High #6** — `_advance_renewal_date` clamps `target_day = max(1, min(anchor, max_day))`, so `anchor=0` no longer crashes monthly subs.

### v0.6.5 Phase 3: approve_redemption rejected subscription_anchor + never created subscription
- Added `vol.Optional("subscription_anchor")` to the schema; `async_approve_redemption` branches on item_type and calls `async_subscribe` for subscription items.

### v0.6.4 post-ship cleanup: Removed dead `src/card/modes-maintenance.js`
- Phase 2.A switched maintenance routing to `rooms/maintenance.js`; the old module was left importing-nothing. Deleted.

### v0.6.4 Phase 3: Milestone celebration only fired from Mission Control
- Overlay creation moved to `FamilyHubCard.connectedCallback`; trigger moved to the completion path so it fires from all views.

### v0.6.4 Phase 3: `force_daily_tick` had no concurrent-call guard
- Added `_tick_running` flag; returns immediately if already running; cleared in `finally`.

### v0.6.4 Phase 2: Maintenance mode silently failed to render
- `htmlMaintenance` was referenced but never existed; routing now calls `renderMaintenance` from `rooms/maintenance.js`.

### v0.6.4 Phase 2: Maintenance counts treated as arrays
- `overdue`/`due_this_week`/`due_next_week` are integers; the card now reads them as ints and derives sections by filtering `items` on `days_delta`.

### v0.6.4 Phase 2: Rank thresholds dropped on every person save
- Emitted `data-pdrop-thr`/`data-pgain-thr` (kebab) to match the `dataset.pdropThr` reads.

### v0.6.4 Phase 1: Rotation pool KeyError (`p["person_id"]` → `p["id"]`)
### v0.6.4 Phase 1: Corrupt JSON load backs up to `<path>.corrupt` before falling back
### v0.5.0 migration: ghost task instances with `assigned_to=""` and orphan blank-id people removed on load
### v0.2.2: Listener leak fixed via AbortController attached once in `connectedCallback`

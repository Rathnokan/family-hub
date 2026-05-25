# Family Hub — Known Bugs

> Active issue tracker. Severity definitions:
> - **Blocking** — feature unusable; users actively losing data or stuck.
> - **High** — wrong result on a normal path; users notice; workaround exists.
> - **Low** — cosmetic / edge case / rare; ship can wait.
>
> New bugs found mid-session: add to the relevant tier here. Fixed bugs move
> to "Recently fixed" until the next minor release, then drop off.

---

## Blocking

_(none)_

---

## High

_(none)_

---

## Low

### Recorder: sensor attribute payloads exceed 16 KB [v0.6.4 candidate]
- **File:** `custom_components/family_hub/sensor.py`
- **Symptom:** HA Recorder logs "State attributes for sensor.family_hub_* exceed maximum size of 16384 bytes" on every state write. Attributes are not stored in the DB. Card is unaffected (reads live state). Log noise + mild DB pressure.
- **Fix:** Add `_unrecorded_attributes = frozenset({...large list attr names...})` to each sensor class. HA respects this without any YAML changes. Defer to v0.6.4.

---

## Deferred (intentionally not bugs, but worth tracking)

### Kid-initiated "Propose sharing" UI is not built yet
- **What:** Group rewards backend supports the kid-initiated path (data model + services in place, `htmlGroupProposalBanner()` helper wired). The proposal-creation modal/flow on the kid side has not been built.
- **Affected:** `custom_components/family_hub/data_store.py` (`group_reward_proposals` list, `async_propose_group_reward`, `async_respond_group_proposal`, `async_approve_group_proposal`, `async_decline_group_proposal`), `src/card/themes/*.js` (no "Share this" button on store rows yet).
- **Notes:** Decided to defer to v0.6.4 along with items 7-11 of the v0.6.3 backlog. The approval-queue surface on the parent side and the banner on the kid side are already in place — they just have nothing to display until the proposal-creation UI lands.

---

## Recently fixed (v0.6.x, retained for context — do not re-open)

### v0.6.4 post-ship cleanup: Removed dead `src/card/modes-maintenance.js` (~3 KB)
- **Symptom:** Phase 2.A switched the maintenance routing to `rooms/maintenance.js::renderMaintenance`, but the old `modes-maintenance.js` was left in place. It was no longer imported anywhere yet still pulled into the body bundle.
- **Fix:** Deleted `src/card/modes-maintenance.js`. Bundle shrank by ~3 KB.
- **Files:** removed `src/card/modes-maintenance.js`

### v0.6.4 post-ship cleanup: Completed Phase 1.C semantic separation
- **Symptom:** Phase 1.C renamed `CONF_PENALTIES_PAUSED_PERSON` → `CONF_PENALTIES_PAUSED_PERSON_KEY` in `const.py`, but never updated the one consumer in `data_store.py:581` which was reading a per-person flag using `CONF_PENALTIES_PAUSED_GLOBAL`. It worked only because both constants happen to equal `"penalties_paused"` — exactly the trap the rename was supposed to eliminate.
- **Fix:** Added `CONF_PENALTIES_PAUSED_PERSON_KEY` to the `data_store.py` import block and updated line 581 to use the per-person constant. Behavior unchanged; semantic ambiguity gone.
- **File:** `custom_components/family_hub/data_store.py`

### v0.6.4 Phase 3: Milestone celebration only fired from Mission Control
- **Symptom:** Completing a task on a personal page never triggered the celebration overlay.
- **Fix:** Overlay creation moved to `FamilyHubCard.js` `connectedCallback`; trigger moved to the completion-event path so it fires from all views.
- **Files:** `src/card/FamilyHubCard.js`, `src/card/modes-chores.js`

### v0.6.4 Phase 3: `force_daily_tick` had no concurrent-call guard
- **Symptom:** Rapid double-click in Dev Tools → Services could fire two ticks back-to-back, double-penalizing or double-awarding.
- **Fix:** Added `_tick_running` flag; tick returns immediately if already running; flag cleared in `finally`.
- **File:** `custom_components/family_hub/coordinator.py`

### v0.6.4 Phase 3: Duplicate `toggle-dollar` handler in `FamilyHubCard.js`
- **Symptom:** Two `toggle-dollar` registrations; one was dead code or caused double-fire.
- **Fix:** Removed the duplicate; kept the `connectedCallback` registration via `AbortController`.
- **File:** `src/card/FamilyHubCard.js`

### v0.6.4 Phase 4: Near-duplicate chore edit handlers
- **Symptom:** `ok-edit-chore` and `ok-edit-chore-inline` duplicated ~80 lines of form-build/submit logic.
- **Fix:** Extracted `_buildChorePayload(v, b, int, sr, isEdit)`. Both handlers call it; each handles its own close behavior. Body bundle: 560.7 KB → 555.3 KB.
- **File:** `src/card/dispatch.js`

### v0.6.4 Phase 4: Three near-duplicate store-item form handlers
- **Symptom:** `ok-add-store-item`, `ok-edit-store-item`, `ok-edit-store-item-inline` duplicated group-reward validation and payload-build logic.
- **Fix:** Extracted `_buildStoreItemPayload(v, sr, isEdit, wasGroupReward)`. All three call it; each handles its own close behavior.
- **File:** `src/card/dispatch.js`

### v0.6.4 Phase 2: Maintenance mode silently failed to render
- **Symptom:** `htmlMaintenance` was called in the routing switch but never existed. Any card with `mode: maintenance` showed the "Loading…" error state.
- **Fix:** Import `renderMaintenance` from `rooms/maintenance.js`; routing case calls it instead.
- **Files:** `src/card/FamilyHubCard.js`

### v0.6.4 Phase 2: Maintenance room item lists always empty; counts always 0
- **Symptom:** `overdue`, `due_this_week`, `due_next_week` are integer counts on the sensor. Both files treated them as arrays (`|| []`, `.length`), so stat strip showed 0 and sections never rendered.
- **Fix:** Read counts as integers; filter `items` array by `days_delta` to derive section groups. Home tile stat uses integer directly.
- **Files:** `src/card/rooms/maintenance.js`, `src/card/rooms/index.js`

### v0.6.4 Phase 2: Rank thresholds silently dropped on every person save
- **Symptom:** `data-pdropThr`/`data-pgainThr` emitted mixed-case; HTML parser lowercased them. `dispatch.js` read `dataset.pdropThr`/`dataset.pgainThr` (correct for kebab), which never matched — always `undefined`.
- **Fix:** Changed emitted attributes in `modes-admin.js` to `data-pdrop-thr`/`data-pgain-thr`. `dispatch.js` unchanged.
- **Files:** `src/card/modes-admin.js`

### v0.6.4 Phase 2: Print popup-blocker fallback navigated away from HA dashboard
- **Symptom:** `window.location.href = url` in the popup-blocked fallback sent the entire HA tab to the print URL.
- **Fix:** Try `window.open(url, '_blank')` first; if also blocked, show a dismissable inline link. Dashboard tab never navigates.
- **Files:** `src/card/print-chore-list.js`

### v0.6.4 Phase 1: Rotation pool KeyError — `_active_rotation_ids` reads wrong key
- **Symptom:** Any chore with a rotation pool threw `KeyError: 'person_id'` at the first rotation advance.
- **Fix:** `p["person_id"]` → `p["id"]` in the set comprehension in `_active_rotation_ids`.
- **File:** `custom_components/family_hub/data_store.py`

### v0.6.4 Phase 1: Corrupt JSON load wipes user data on next save
- **Symptom:** If `family_hub_data.json` was corrupt, the except block returned an empty store and the next `async_save` silently overwrote the real file.
- **Fix:** `shutil.copy2` backs up the corrupt file to `<path>.corrupt` before falling back to empty store.
- **File:** `custom_components/family_hub/data_store.py`

### v0.6.4 Phase 1: `CONF_PENALTIES_PAUSED_GLOBAL` and `CONF_PENALTIES_PAUSED_PERSON` were the same string
- **Symptom:** Both constants equalled `"penalties_paused"` — a refactor trap with no runtime error.
- **Fix:** Renamed `CONF_PENALTIES_PAUSED_PERSON` → `CONF_PENALTIES_PAUSED_PERSON_KEY` (string value unchanged). No other file imported it.
- **File:** `custom_components/family_hub/const.py`

### v0.6.3 P2: Personal-page chore order ignored `sort_order`
- **Symptom:** Admin drag-to-reorder appeared not to work when viewed from a kid's dashboard.
- **Root cause:** `get_tasks_for_card` was sorting `due_today` by name and dropping `sort_order` from the row payload.
- **Fix:** Rows now carry `sort_order`; sort key is `(sort_order, name)`. Same fix applied to `get_all_tasks_for_command_center` (home strip) and `get_claimable_tasks_for_card` (claimable picker).
- **Files:** `custom_components/family_hub/data_store.py`.

### v0.6.3 P2: Admin Tasks list ignored category drag-order
- **Symptom:** Reordering categories on the Settings page updated the kid pages but not the admin Tasks list.
- **Root cause:** Group Map was being seeded from chore data, not from `category_labels`.
- **Fix:** Seed the group Map from `catLabels` first; orphan categories (label set on a chore but missing from `category_labels`) get appended after the admin-defined buckets.
- **Files:** `src/card/modes-admin.js`.

### v0.6.3: Rewards section silently reset to Today on every render
- **Symptom:** Clicking the Rewards nav item navigated correctly but the next render snapped back to Today.
- **Root cause:** `"rewards"` was missing from the `_validAdminSecs` whitelist in `FamilyHubCard.js`. The startup guard reset any unknown section to `today` on every `_doRender`.
- **Fix:** Added `"rewards"` to the whitelist.
- **Files:** `src/card/FamilyHubCard.js`.

### v0.6.3: Contributor pill text was unreadable
- **Symptom:** On group-reward rows, contributor pts text and avatar initials disappeared into low-contrast pill backgrounds.
- **Root cause:** `.fh-gcp` background was `rgba(255,255,255,.08)` — too transparent against varied theme backgrounds. Initials had no shadow, so they vanished on light avatar colors.
- **Fix:** Pill background is now `var(--fh-surface)` (opaque). Avatar initial gets a dark `text-shadow` halo. "Done" state color unified to `--fh-success` (`#30d158`).
- **Files:** `src/card/css.js`, `src/card/themes/_shared.js`.

### v0.6.3: Dev iterations stuck on cached body bundle
- **Symptom:** Samba copy + hard refresh sometimes still served the previous build's body bundle.
- **Root cause:** Body URL was cache-busted only by `VERSION`. Two dev iterations within the same release would reuse the cached bundle.
- **Fix:** `gen-build-id.mjs` writes `src/build-id.js` with a millisecond timestamp on each `npm run build`. Stub appends `?v=VERSION&b=BUILD_ID` to the body URL.
- **Files:** `gen-build-id.mjs` (new), `src/build-id.js` (auto-gen), `src/main.js`, `package.json`.

### v0.6.1: Editor wrapper "this._configElement.setConfig is not a function"
- **Symptom:** Visual editor failed to load. HA reported "Visual editor not supported".
- **Root cause:** Editor wrapper was writing to `this.innerHTML` inside its `constructor()`. The HTML spec forbids that — the throw left the custom element in "failed upgrade" state with `HTMLElement.prototype` instead of the wrapper's prototype, so `setConfig` was undefined on the host.
- **Fix:** All DOM writes moved to `connectedCallback`. The constructor only kicks off the lazy body load (a Promise) — no children/attribute writes anywhere.
- **Files:** `src/main.js` (FamilyHubCardEditorWrapper).

### v0.6.0: Body URL derived by script-tag scanning returned empty string
- **Symptom:** First v0.6.0 cut tried to derive `BODY_URL` from the stub's own `<script src>`. The fallback URL was wrong for this integration's layout, body never loaded.
- **Root cause:** Lovelace loads module resources via `import(url)` — no `<script>` tag is ever inserted into the DOM, so the scan returned empty.
- **Fix:** `BODY_URL` is hardcoded as `/family_hub/family-hub-card-body.js?v=VERSION&b=BUILD_ID`. The integration registers `/family_hub` as a static HTTP path at setup so the path is always valid.
- **Files:** `src/main.js`.

### v0.5.0 migration: ghost task instances with `assigned_to=""`
- **Symptom:** Day-filter chores appeared on off-days; tasks had no visible owner.
- **Root cause:** Pre-multi-person era data wrote `assigned_to=""` (empty string, not `None`). The day-filter cleanup pass checked for `None` only, so these slipped through.
- **Fix:** Migration on load removes any `task_instances` where `assigned_to == ""`.
- **Files:** `custom_components/family_hub/data_store.py` (`async_load`).

### v0.5.0 migration: orphan people with blank ID
- **Symptom:** Stale phantom rows in admin Family list.
- **Fix:** Migration on load filters `people` to drop any record with empty `id`.
- **Files:** `custom_components/family_hub/data_store.py`.

### v0.4.1: Assignment sync collapsed all instances to `assigned_to=None`
- **Symptom:** Updating a chore's `assigned_to` to a multi-person list caused the chore to vanish from every personal dashboard.
- **Root cause:** `async_update_chore`'s assignment sync incorrectly set all existing instances to `assigned_to=None` instead of creating per-person instances for the new list.
- **Fix:** Sync now creates per-person instances when `assigned_to` changes to a multi-person list.
- **Files:** `custom_components/family_hub/data_store.py`.

### v0.4.1: Ghost rows on command center
- **Symptom:** Nameless tasks appeared on the command center.
- **Root cause:** `get_all_tasks_for_command_center` didn't filter ghost instances (`assigned_to=None` on a non-claimable chore).
- **Fix:** Filter excludes ghost instances explicitly.
- **Files:** `custom_components/family_hub/data_store.py`.

### v0.2.2: Memory leak from re-attached listeners
- **Symptom:** Card got slower over a session as listeners accumulated.
- **Root cause:** Event listeners were attached in `_doRender` rather than `connectedCallback`.
- **Fix:** All listeners attached once in `connectedCallback` via `AbortController` with `{ signal }`; `disconnectedCallback` aborts.
- **Files:** `src/card/FamilyHubCard.js`.

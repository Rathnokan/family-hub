# Family Hub — Project Notes
> Read this at the start of every session. Update it at the end of every session.
> Repo: https://github.com/Rathnokan/family-hub

---

## SESSION START CHECKLIST

1. Read this file top to bottom (5 min)
2. Glance at the active work queue below — pick up where the last session left off
3. Check live files via Samba: `\\10.0.0.41\config\custom_components\family_hub\`
4. **Python changes:** reload integration only (Settings → Devices & Services → Family Hub → Reload). No HA restart.
5. **JS changes:** browser hard refresh only (`Ctrl+Shift+R`). No HA involvement.
6. **Both changed:** reload integration → hard refresh → call `force_daily_tick` from Dev Tools → Services.

## SESSION END CHECKLIST

1. Update Current Status table (version, GitHub state, next release)
2. Update the active work queue (mark completed items, add new items discovered)
3. Add any new architecture decisions or data contract changes
4. Note any deferred items that came up
5. Commit to GitHub if stable

---

## Current Status — 2026-05-24

| Item | State |
|---|---|
| **Live on HA (Samba)** | v0.6.3 wip — stub 6.9 KB + body 560.0 KB. Items 1-4 + P2 + items 5/6/12 + active toggle + Rewards section + hard-delete + limit display + Item 13 (group rewards) + contrast fix deployed. **Not yet committed.** |
| **GitHub / HACS** | v0.6.2 tagged + released. HACS-detectable. |
| **manifest.json / hacs.json / constants.js VERSION** | 0.6.2 ✓ (version bump deferred until v0.6.3 batch is ready to tag) |
| **Phase** | v0.6.3 — items 1-6 + 12 + 13 + Rewards admin section deployed. Items 7-11 not started. |

**v0.6.3 items 1-4 — built + deployed via Samba, awaiting final smoke-test before commit:**

1. **Printable chore list** — `Print` button on the Tasks admin topbar opens a self-contained HTML doc in a new tab. Groups chores by assignee, separate sections for claimable / reminders. Print stylesheet + page-break-inside avoid. Files: `src/card/print-chore-list.js` (new), `modes-admin.js`, `dispatch.js`, `constants.js` (added `I.print`).
2. **Store goal tracking** — Per-person `goal_item_id` field. Star toggle on every store item (☆ → ★). "Saving for X · 234/500" banner above the store list, plus a rail panel via `htmlRailGoal()` on all themed personal pages. Backend: `data_store.py` migration + person create/update + `goal_item_id` allowed key; `services.py` schema; `sensor.py` `goal` snapshot on per-person sensor + `goal_item_id` on naAttr.people.
3. **Store reorder (drag)** — `sort_order` field on store items, back-filled in creation order at migration time. Admin store list rows are draggable. Drop handler in `FamilyHubCard.js` generalized via `data-drag-type` so it serves chores, store items, and category chips.
4. **Store icons** — Optional `icon` field on store items reusing the existing FH_ICON_META picker. Icon picker is now a shared helper (`iconPickerSection()` in modals.js); both add and edit store-item modals include it. Icons render in the admin inventory list and in every theme's store tab.

**v0.6.3 P2 polish (drag-reorder UX) — deployed:**

- **Drop precision:** dragover now shows a blue insertion line on the top OR bottom edge of the target row depending on cursor position. Drop above → insert before, drop below → insert after. Works on chores, store items, and category chips. Horizontal lists (chips) use cursor X; vertical lists use Y.
- **Personal-page chore order:** `get_tasks_for_card` was sorting `due_today` by name and ignoring `sort_order` — that's why admin drag-reorder looked broken from a kid's dashboard. Fixed: rows now carry `sort_order` and sort by `(sort_order, name)`. Same fix applied to `get_all_tasks_for_command_center` (home strip) and `get_claimable_tasks_for_card` (claimable picker).
- **Category drag-reorder in Settings:** category chips are draggable; reordering persists via `update_settings(category_labels=...)`. Personal pages already used `groupByCategory(tasks, catOrder)` so they pick the new order up immediately.
- **Admin Tasks list category order:** seeded the group Map from `catLabels` first so the Settings-page category drag-order is reflected in the admin Tasks page too. Orphan categories (label present on a chore but missing from `category_labels`) get appended after the admin-defined buckets.

> Pop-up blocker note for #1: the print tab is opened from a click event, so most blockers let it through. Falls back to a blob URL in the same tab if `window.open()` returns null.

**v0.6.3 items 5, 6, 12 + Rewards admin section — deployed, awaiting smoke-test:**

5. **Store max redemption rate** — `max_per_period` (int) + `period` (`day`/`week`/`month`) fields on store items. Backend blocks requests that exceed the limit; `next_available` date surfaced in per-person sensor. UI: `Max N/period` badge on Rewards admin rows. Files: `data_store.py`, `services.py`, `sensor.py`, `modals.js`, `modes-admin.js`, `dispatch.js`.
6. **Point→$ scales with rank** — `rank_ppd_ladder` setting (list of ¢/pt per rank index, default `[3.0, 3.5, 4.0, 4.5, 5.0]`). Stored in `settings.rank_ppd_ladder`. Per-person sensor `dollar_value` and store `points_cost` now use rank-adjusted PPD. Redemption deducts rank-adjusted cost. Admin Settings panel has per-rung inputs + Save ladder button. Files: `data_store.py`, `services.py`, `sensor.py`, `modes-admin.js`, `dispatch.js`.
12. **Reward categories** — `category_label` field on store items. Rewards admin section groups items by category (seeded from shared `category_labels` order). Add/edit modals and inline panel include category dropdown. Files: same as items 5/6.

**Rewards admin section (new):**
- Dedicated left-rail nav item ("Rewards", ◈ icon) between Tasks and History.
- Master-detail layout: item list (left, grouped by category, sortable, filterable Active/Inactive) + inline editor panel at ≥1280px (right, same size/layout as Tasks panel).
- Active/inactive toggle on every item — replaces the old "delete = soft deactivate" UX. Items marked inactive are shown dimmed with `[inactive]` label.
- Store inventory panel removed from Settings; rank PPD ladder editor added there instead.
- Bug fixed: `"rewards"` was missing from `_validAdminSecs` whitelist in `FamilyHubCard.js` → section was silently reset to Today on every render. Fixed.

**v0.6.3 session 3 — deployed:**

- **True hard-delete for rewards** — `async_hard_delete_store_item` in `data_store.py` physically removes the record from `store_items` and cancels any pending redemptions. New `hard_delete_store_item` service in `services.py`. Inline editor panel footer now has: Save changes · Deactivate (soft) · Delete ✕ (permanent). Row trash button is still soft-delete (deactivate). `dispatch.js` `hard-delete-store-item` case.
- **Redemption limit display on kid store tabs** — `htmlStoreItemLimit(item)` added to `_shared.js`; renders "1 per week" or "1 per week · Available Mon May 27" when `max_per_period > 0`. All 6 themes updated: import `htmlStoreItemLimit`, add `blocked = !!item.next_available`, render "Not available" state when blocked. `.fh-store-limit` and `.fh-store-limit--blocked` added to `css.js`.

**v0.6.3 Item 13 — Group / shared rewards — deployed:**

- **Backend:** `is_group_reward: bool`, `contributors: [{person_id, share_pct, contributed_pts, target_pts, person_name, person_color}]` on store items. `chip_in` service deducts points and increments `contributed_pts`. `update_store_item` accepts group reward fields.
- **Admin form (modal + inline panel):** "Group reward" toggle, contributor % sliders, validation that shares sum to 100%, "Equal split" quick-set. Both `ok-edit-store-item` and `ok-edit-store-item-inline` dispatch cases handle group fields identically.
- **Kid store tabs (all 6 themes):** `htmlGroupContributorBars()` renders compact horizontal contributor pills — avatar initial + `contributed/target` pts — instead of the old tall vertical layout. `htmlChipInBtn()` shows a "Chip In" button for the current person's share.
- **Cache busting:** `BUILD_ID` timestamp baked per `npm run build` via `gen-build-id.mjs` → `src/build-id.js`. Appended to body URL as `?v=VERSION&b=BUILD_ID` so every build busts the browser cache.
- **Icon upload for rewards:** `handleIconFileSelection()` exported from `dispatch.js`; FileReader → canvas downsize → data URL → preview. Persistent `<input id="m-icon-upload">` in modal, handled via shadow root `change` event. `_normalizeIcon()` preserves `data:` URLs verbatim.
- **Contrast fix (contributor pills):** `.fh-gcp` background bumped from near-transparent `rgba(.08)` to `var(--fh-surface)` so pts text reads on an opaque surface. Avatar initial gets `text-shadow` dark halo so it's readable on any person `avatar_color` (including light yellows/greens). "Done" state color updated to `#30d158` to match `--fh-success` token.

---

## 🤝 SESSION HANDOFF — for the next session (Sonnet 4.6 recommended)

> **Read this section before starting work.** Then read the rest of this file top to bottom (Session Start Checklist) and pick up where v0.6.3 left off.

### Where things stand

- **v0.6.2 is shipped** to GitHub + HACS. Don't re-litigate it.
- **v0.6.3 items 1-6, 12, 13 + P2 drag-reorder polish** are all deployed to live HA via Samba. Code is **uncommitted**. Wait for user's explicit "go" before bumping versions and committing.
- **v0.6.3 items 7-11 are not started.** See the candidate list below for what's left.
- **Item 13 (group rewards) is feature-complete** — creation, editing (modal + inline panel), kid store display (compact contributor pills), chip-in flow, and contrast fixes are all deployed.
- **Kid-initiated "Propose sharing" flow** (the second entry path in item 13) is deferred — the backend `group_reward_proposals` list and frontend `htmlGroupProposalBanner()` helper are wired in but the proposal-creation UI for kids is not yet built.

### First moves for the next session

1. Run the **Session Start Checklist** at the top of this file.
2. Run `git status` to see the uncommitted v0.6.3 work. Don't commit without user's explicit go.
3. Ask the user: "Items 1-6, 12, 13 + drag-reorder polish are deployed. Did the group rewards live test pass? Any bugs to fix, or ready to commit this batch?"
4. Then ask which remaining v0.6.3 item to tackle next (items 7-11).

### Model recommendation

**Sonnet 4.6 (High) is fine for everything left on v0.6.3.** All remaining items are well-scoped CRUD additions / UI wiring on top of patterns this codebase already has:

- Items 5, 7, 8, 9, 10, 12: small backend field additions + theme-side rendering. Sonnet territory.
- Item 6 (point→$ by rank): wider surface area (touches several read sites) but mechanical. Sonnet handles fine.
- Item 11 (Tabler icons): mostly audit + mapping work. Sonnet.
- Item 13 (group rewards): has the most architectural ambiguity (proposal lifecycle, refund-on-leave edge cases) — write the data model up front, talk through the lifecycle with the user before coding. Still Sonnet-suitable, just structure the conversation.

**Reach for Opus only if** you hit something that requires reasoning about subtle invariants across many existing files at once (e.g. a tricky data-migration design problem). Cross that bridge if you come to it.

### Sonnet system-prompt addendum (paste into the next session)

```
You are working on the Family Hub project (see notes.md at the project root).
Read notes.md top to bottom before touching any code — it has the Session
Start Checklist, the v0.6.3 work queue, and architecture decisions you must
not relitigate. Do not bump versions, do not commit, and do not push without
the user's explicit "go" — the workflow is: write code → deploy via Samba
→ user tests live → commit + tag + push only when a batch is stable.

When the user gives you an item, prefer surgical edits to small files over
sweeping refactors. The codebase has six themes (engineer, hp, dinos, baker,
dbz, classic) and adding a feature usually means touching each one. Use
shared helpers in src/card/themes/_shared.js when the same render logic
appears in more than two themes.

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
| Stub bundle | `custom_components/family_hub/www/family-hub-card.js` (~6 KB IIFE) |
| Body bundle | `custom_components/family_hub/www/family-hub-card-body.js` (~456 KB ESM) |
| Build command | `npm run build` (runs `build:stub` then `build:body` via esbuild) |
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

## v0.6.3 Active Scope — "Chores & Store Polish + Engagement"

> User-picked list. Ordered as written; this is rough priority but not a strict
> sequence — small items (1, 3, 9) are good warm-ups; 6 + 10 + 11 are the
> meaty ones.
>
> **Opening batch: items 1-4** (printable list + store goal + store reorder +
> store icons). #1 is a clean warm-up; #2-#4 cluster on the store and share a
> data area (`store_items` fields, person `goal_item_id`).

### 1. Printable chore list
Parent-friendly printable view of the active chore set: who-does-what,
points per chore, recurrence. Print-stylesheet HTML in a new admin route
that opens in a fresh tab and prints to PDF via the browser. No new data,
no Python. Good fridge-magnet artifact.

### 2. Store goal tracking
Per-person `goal_item_id` field — kid picks a store item to save toward.
Progress bar = `balance / item.points_cost`. Surfaces in the store tab and
on the rail. Wishlist semantics can layer on later.

### 3. Store reorder (drag)
`sort_order` field on `store_items`. Reuse the existing drag-to-reorder
mechanism from `dispatch.js` (chores already use it). Admin store list
becomes draggable.

### 4. Store icons / pictures
Icon picker first using the existing `FH_ICON_META` / `FH_ICONS` system
(reuses the chore icon picker). Adding photo upload (`image_url`) later
needs HA media-source wiring — defer unless icons aren't enough.

### 5. Store maximum redemption rate
New per-item `max_per_period` + `period` (`day` / `week` / `month`).
Service-side check inside `request_redemption`; UI shows "Available again
in 3 days" when blocked. Doubles as accidental-double-click protection.

### 6. Point→$ value scales with rank
Per-kid `points_per_dollar` ladder by rank (rank 1 = 3.0¢ / point, rank 5
= 5.0¢ / point, etc.). Backend `dollar_value` calc moves from one global
divisor to a rank-indexed lookup. Touches the `family_hub_<name>` sensor,
admin settings UI, and everywhere `points_per_dollar` is read. Medium
surface area — biggest item on this list. Mental model: "ranking up
makes your points worth more" — direct reward for sustained performance.

### 7. Streak freeze tokens
Per-person `streak_freezes_available` counter. Earned passively at
streak milestones; spent automatically when a daily success-rate check
would otherwise break the streak. Tiny UI: token count chip in the rail.
Plays well with the success-rate streak that already ships in v0.6.1.

### 8. Quick-add chore template library
Short curated JSON of ~20 common chore templates ("Morning: brush teeth",
"Make bed", "Take out trash"…) + a "From template…" button in the
add-chore modal that prefills the form. Parent can still edit before
saving. Reduces friction when adding new chores.

### 9. Daily progress bar on personal pages
Header element: `[3 / 7 chores done today]` with a thin progress bar.
Pure card-side render — all data is already in `tasks_due_today_list`.
Pairs naturally with the success-rate streak.

### 10. Time-windowed chores (morning vs evening)
Per-chore `available_from` (HHMM) and `expires_at` (HHMM). Instance is
generated at midnight as today, but the card hides it until `now ≥
available_from`, and a sub-day tick auto-skips it (with penalty if
configured) once `now ≥ expires_at`. Solves: "Brush teeth" should only
show in the morning slot and disappear by 10 AM; "Pajamas on" appears
at 7 PM. Visual: "Available 7:00–9:00 AM" chip on the row when applicable.
Coordinator already polls every 30s, so the sub-day timeout is cheap.

### 11. Better icon library
**Decision: Tabler Icons (MIT).** ~5,700 stroke-based icons. Works on
all six themes (dark and light). Best chore/household vocabulary of any
free open-source set — vacuum, mop, washing machine, dishwasher, iron,
robot-vacuum, make-bed, etc. as distinct icons. Safe to ship publicly
with no attribution requirement. Other candidates surveyed: Lucide (MIT,
fewer icons), Phosphor (MIT, good but more app-UI than household),
Heroicons (MIT, too few), Material Symbols (Apache 2.0, Material Design
aesthetic clashes with parchment themes). Icons8 / Noun Project / Streamline
all rejected — attribution-required or proprietary.

**Implementation plan:**
1. Audit current `FH_ICON_META` / `FH_ICONS` keys — list every key in use
   across all data files and the picker grid.
2. For each current key, map → Tabler icon name; produce a migration map
   so existing saved data auto-translates on first render. No data migration
   needed — mapper runs at render time.
3. Copy only the SVGs we actually use into `src/card/icons/` as a JS
   object (same shape as current `FH_ICONS`). No CDN, no runtime dep,
   works fully offline on the LAN. Include a one-line MIT notice comment
   in the icons file.
4. Expand the picker grid: add categories (Cleaning, Personal Care,
   Kitchen, Outdoor, School/Homework, Pets, Sports/Hobbies). Target ~60–80
   curated icons total (up from current ~25).
5. Picker search box filters by display label (already half-built).
Roughly one session. No Python changes.

### 12. Reward categories
Store items get a `category_label` field, same shape as chores already use.
Admin reuses the existing chip-add UI + the same draggable `category_labels`
ordering (already drives chore grouping in v0.6.3 P2). Personal-page store
tabs render reward category section headers in admin order. Within a
category, items still sort by `sort_order` (the v0.6.3 P2 drag-reorder).

Touchpoints: backend `_migrate_store_item` setdefault `category_label=""`,
`async_add_store_item` / `async_update_store_item` accept it, sensor
payloads carry it, admin store modal gains a category dropdown (same widget
shape as the chore form), each theme's store renderer groups by category
(reuse `groupByCategory(items, catOrder)` shape from `_shared.js`). One
shared widget — the existing `category_labels` is the single source of truth
for both chores and rewards.

### 13. Group / shared rewards ("chip in together")
Two kids (or more) jointly save toward a single reward. Two entry paths:

- **Parent-initiated:** parent toggles a "Group reward" flag in the admin
  store-item form, then picks contributors and a split (default = equal
  per-kid split, but each kid's contribution % is editable). Stored as a
  new shape: `contributors: [{ person_id, share_pct }]` on the store item.
- **Kid-initiated:** kid hits "Want to share this" on their store tab,
  picks the other kids + proposes a split, hits Send. This generates a
  `group_reward_proposal` record (similar shape to a redemption) that
  enters the approval queue. Each named kid sees the proposal in their
  store + can accept/decline; parent sees it in Today queue and must
  approve before the deal goes live. Once approved, the item's
  `contributors` are populated and the proposal record is consumed.

Data model:
- `store_items[].is_group_reward: bool`
- `store_items[].contributors: [{ person_id, share_pct, contributed_pts }]`
  — `contributed_pts` lets us track partial payment as kids "chip in" over
  time (no debit until redeemed, but the rail shows progress per kid).
- New `group_reward_proposals` list (parallel to `redemptions`): proposer,
  invitees, proposed splits, kid-acceptance state, parent approval state.
- New services: `propose_group_reward`, `accept_group_proposal`,
  `decline_group_proposal`, `approve_group_proposal`, `redeem_group_reward`.

UI:
- Store-item modal (admin): "Group reward" checkbox + contributor multi-pick
  + per-kid % sliders.
- Store tab (kid): on a group reward, show all contributors' avatars + each
  kid's pts-toward-goal sub-bar. "Chip in" button instead of "Request".
  Pressing it allocates a kid-specified number of points toward their share.
- Store tab (kid): "Share this" button on any non-group item → opens a
  proposal modal (which kids, how to split).
- Today queue (parent): proposals show alongside chore approvals.

Edge cases:
- A kid leaves the family / goes inactive → their contributed_pts return to
  their lifetime balance, their share is redistributed across remaining
  contributors (or item is converted back to non-group).
- Item is deleted while in-flight → refund contributed_pts to each kid.
- Splits must sum to 100% — clamp on save, with a "Equal split" quick-set
  button.

This is the meatiest item on the v0.6.3 backlog after #11. Worth a
dedicated session.

### Held out of v0.6.3 (will revisit)
- Photo evidence for approvals — HA media-source dependency.
- History pagination — current 30-day window still fine.

---

## Roadmap

| Version | Headline | Notes |
|---|---|---|
| **v0.6.3** | Chores & Store polish + engagement | See v0.6.3 active scope section above. |
| **v0.7.0** | Home Maintenance room — full feature | Maintenance room is already live as a read-only drill-down. v0.7 adds CRUD (add/edit/delete items from the card), scheduling/recurrence, and richer tracking. |
| **v0.8.0** | Meals room | Weekly menu builder, grocery list, "what's for dinner" on the home strip. Scaffold is live as coming-soon. |
| **v0.9.0** | Calendar room | Pulls real HA calendar entities into the today strip. Scaffold is live as coming-soon. |
| **v1.0.0** | Smart Home room | Permission-gated lighting/climate/irrigation controls for kids. Scaffold is live as coming-soon. |
| **v1.x** | Theme builder UI | Parent authors themes without editing code. |

**Deferred (parked, not lost):**
- Photo evidence for approvals — heavier HA media-source dependency.
- History pagination — currently 30-day rolling window; "show older" expand link in admin.
- Achievements / badges engine — wait until ranks have lived in the wild.
- Per-theme audio cues via `alexa_media_player` — fun but a rabbit hole.

> Items 1, 2, 8 from this list previously lived here. They've been promoted
> into the v0.6.3 candidate scope above and removed to keep this list as the
> "truly parked, no current plan" bucket.

---

## Architecture Decisions (stable — don't re-litigate)

- **Single JSON file** (`family_hub_data.json`). Never touched by code updates.
- **Card-stub split is permanent.** `npm run build` produces two files: a ~6 KB IIFE stub (`family-hub-card.js`) that registers the custom element and paints a loading placeholder, and a ~456 KB ESM body (`family-hub-card-body.js`) that is lazy-imported by the stub. Deploy BOTH. Never collapse back into one — the Echo Show Silk browser and slow phones depend on the stub painting before the body finishes downloading.
- **Custom element constructors must not touch children/attributes.** The HTML spec forbids `appendChild`, `setAttribute`, or `innerHTML` writes in a custom element's `constructor()`. Doing so throws `InvalidStateError`, which leaves the element in a "failed upgrade" state — it exists in the DOM but has `HTMLElement.prototype` instead of your class's prototype, so methods like `setConfig` come back undefined. HA then reports "Visual editor not supported: this._configElement.setConfig is not a function" or similar. Bit us in v0.6.1 (editor wrapper). **Rule:** if you need to write DOM, do it in `connectedCallback()` or later. Shadow root content via `this.attachShadow({...}); this.shadowRoot.innerHTML = …` IS allowed in the constructor because shadow content isn't "children."
- **Body URL is hardcoded** as `/family_hub/family-hub-card-body.js?v=VERSION` in `src/main.js`. The integration registers `/family_hub` as a static HTTP path; all `www/` files are always reachable there. VERSION (baked at build time) is the cache-bust. Do NOT scan `<script>` tags — Lovelace module resources are loaded via `import()`, so no `<script>` tag is ever in the DOM.
- **Event listeners attached ONCE** in `connectedCallback` via AbortController — never in `_doRender`.
- **Dirty-check uses `last_updated`** (not `last_changed`) — attributes don't bump `last_changed`.
- **`_doRender` appends the modal as a separate DOM node** so background re-renders can't destroy open modals.
- **History is trimmed to a 30-day rolling window** each daily tick.
- **Penalty pause is a sticky flag** (stays set until parent manually turns it off). Covers both penalties AND streak breaks.
- **Chore mental model:** Chores have a "window" — available during window, penalized when window closes. Never "overdue" for kids. "BREACH" = post-reset, not completed. "Overdue" language is reserved for Home Maintenance items only.
- **Ghost instance rule:** `CHORE_TYPE_ASSIGNED` chores with no `assigned_to` people never generate task instances. Only `CHORE_TYPE_REMINDER` and `CHORE_TYPE_CLAIMABLE` may have unassigned instances.
- **Task instance retention:** Terminal instances (skipped/approved/denied/rejected/excused) older than 60 days are pruned each daily tick. History entries pruned at 30 days.
- **Kid mode is a CSS modifier, not a render fork.** `child_mode=true` adds `.kid-large` to the page wrapper. A per-theme CSS block flips the row list to a card grid. Same render path, same DOM, same data — different layout. Themes keep their full personality in kid mode.
- **Shared row anatomy.** Every adult theme row goes through `htmlChoreRow(t, cfg, person, card, opts)` in `themes/_shared.js`. Themes export a `<theme>RowConfig` (~10 keys) and a `.fh-row--<themeKey>` CSS color block. Adding a new theme = one config object + one CSS override block — no `_row` helpers anywhere.
- **Layout switching in HA cards: use viewport `@media` queries, NEVER `@container` queries.** HA Lovelace cards in standard sectioned dashboards are column-constrained even on desktop. Container queries only work in Panel views. Media queries respond to the actual viewport and work in both modes.
- **Typography hard floor: 12px / 0.75rem, no exceptions.** Use `--fh-text-xs/sm/base/md/lg/xl/2xl` tokens from `:host` in `css.js`. Body content defaults to `--fh-text-base` (16px). User has significant uncorrected prescription — this is an accessibility requirement.
- **Design reference proportions:** JSX files are authored for 1920×1080. The Lovelace card is ~400px wide. All decorative sizes (frames, watermarks, corner ornaments) must be scaled ~40-60% down from reference. Halve the size first, then adjust.
- **CSS z-index on themed pages:** Never use `.fh-XX-page > * { position:relative; z-index:N }` — it pulls absolutely-positioned decorative elements into normal flow. Use explicit named selectors only for content elements that need z-index promotion.
- **Themed personal-page two-column layout:** All six themes use `body.has-rail`: `1fr` content + `480px` rail at `@media (min-width: 900px)`, single-column below. Rail renders only on the tasks tab; store/history use full width.
- **Streak source-of-truth:** Use `getActiveStreaks()` in `themes/_shared.js`, which unions `naAttr.people[].streaks` dict with task-row `.streak` fields. Do NOT pull streaks only from `tasks_due_today_list` — a weekly chore may only appear in that list on its reset day, but the streak is still active all week.
- **Rolling streak milestones:** Backend fires `streak_bonus_points` every `streak_milestone` completions on an ongoing basis. Frontend: `computeStreakProgress(streak, milestone, maxSegs)` fills the bar toward the next milestone using `streak % milestone`. Falls back to a 7-segment weekly bar when no milestone is configured.
- **Themable rank bar:** `.fh-rank-bar-*` uses `--fh-rb-track/drop/status` CSS vars with white-on-dark defaults. Paper themes (`.fh-dn-page`, `.fh-bk-page`, `.fh-hp-page`) override to sepia. DBZ rail panels override to ink-on-white.
- **Chore form tabs (admin):** Four tabs — Details / Schedule / Points & Rewards / Reminders. Tabs switch via CSS-only DOM manipulation in the `chore-tab` dispatch case — no `_doRender` on tab change, so typed-but-unsaved input on inactive panes is preserved. Card state `_choreFormTab` (default `"details"`) reset on modal close, panel close, and after save.
- **Admin inline panel + modal share `m-*` IDs.** Opening any chore modal (`open-add-chore`, `open-edit-chore`) always clears `_adminSelectedChoreId` first, so panel and modal are never simultaneously in the DOM.
- **Re-render freeze while admin inline panel is open.** `_maybeRender()` bails when `_adminSelectedChoreId` is set, same as the modal-open protection. Sensor refreshes don't wipe unsaved field values.
- **Success-rate person streak:** `_async_process_completion_streaks(tick_date)` runs in the catch-up loop after the skip pass. Counts assigned chores due the prior day; EXCUSED pulled from both numerator and denominator (rest-day semantics); zero-chores days leave streak untouched; evaluation skips when penalties are paused.

---

## Known Data Contracts (v0.6.1)

**`sensor.family_hub_needs_attention` attributes:**
`approval_queue`, `redemption_queue`, `people` (per person: `penalties_paused`, `streaks`, `allowance_*`, `notify_target`, `code`, `theme_key`, `child_mode`, `completion_streak`, `completion_threshold_pct`, `completion_milestone`, `completion_bonus_points`), `active_chores` (includes `icon`), `store_items`, `family_name`, `points_per_dollar`, `show_dollar_value_to_kids`, `category_labels`, `penalties_paused_global`, `penalty_alert_time`, `rooms_config`, `weather_entity`, `today_calendar_entities`, `history_log`

**`sensor.family_hub_[name]` attributes:**
`person_id`, `person_type`, `avatar_color`, `active`, `code`, `theme_key`, `lifetime_points`, `dollar_value`, `show_dollar_value`, `tasks_due_today_list`, `tasks_overdue_list`, `tasks_pending_approval_list`, `store_items`

Each task row: `task_id`, `chore_id`, `name`, `description`, `icon`, `points`, `due_date`, `status`, `chore_type`, `category_label`, `penalty_enabled`, `penalty_points`, `expires_after_days`, `is_one_time`, `streak`, `days_overdue` (overdue list only)

**`sensor.family_hub_claimable_tasks`:** `tasks` (claimable only), `all_tasks` (command center)

**`sensor.family_hub_maintenance_due`:** `overdue`, `due_this_week`, `due_next_week`, `next_item`, `next_due_date`, `next_due_days`, `items`

**`sensor.family_hub_today` (placeholder):** state=0, `schedule=[]` — populated when Calendar room ships

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
| v0.6.3 wip | Store polish + group rewards: printable chore list, store goal tracking, drag-reorder, reward icons, rate limits, rank-scaled PPD, reward categories, group/shared rewards (chip-in), streak freeze tokens |

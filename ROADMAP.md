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

## Active Scope — v0.6.4 (Bug Fixes — Shipped Locally)

All five phases complete; awaiting user "go" to push + tag.

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

## Next: v0.6.5 — Subscription Rewards

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
- **Phase 1 — Backend:** data model, services, daily-tick processing, migration. Reload to test.
- **Phase 2 — Admin UI:** store-item modal additions (type toggle, period, anchor) + cancellation-approval queue + admin sub-management panel.
- **Phase 3 — Kid UI:** rail "Your Subscriptions" block + store row subscribe button + cancel modal + lapsed-state styling.
- **Phase 4 — Theme parity:** apply rail block to all six themes via `_shared.js` helper.
- **Phase 5 — Version bump + release.**

---

## Then: v0.6.6 — Codebase Cleanup & Optimization

**Goal:** make the project cheap to develop on before piling on rooms (Maintenance, Meals, Calendar). **Pure refactor — no user-visible behavior changes.**

**Critical:** every change must preserve the HA integration contract. After each phase, smoke-test:
- `force_daily_tick` runs clean
- Sensors expose the same attribute keys (`hass.states.get("sensor.family_hub_*").attributes`)
- All registered services still respond
- The card still renders on the live HA dashboard
- Lovelace static path `/family_hub` still serves the bundle

### Phase 1 — `data_store.py` split (biggest single token win)
Break the 3,892-line monolith into a package:
```
custom_components/family_hub/data_store/
  __init__.py          — re-exports the FamilyHubData class
  base.py              — load/save/migration/CRUD (~1,200 lines)
  tick.py              — daily tick, recurrence, penalties (~600 lines)
  notifications.py     — notification dispatch (~150 lines)
  streaks_ranks.py     — success-rate streak, rank eval (~350 lines)
  group_rewards.py     — proposals, chip-in, group redemption (~450 lines)
  card_shapers.py      — get_*_for_card sensor attribute builders (~800 lines)
  subscriptions.py     — v0.6.5 subscription processing (added here in v0.6.6 if not earlier)
```
External imports (`from .data_store import FamilyHubData`) keep working via re-export in `__init__.py`. Zero call-site changes.

### Phase 2 — `css.js` split
Break the 4,361-line single template string into concern-based modules:
```
src/card/css/
  index.js       — re-exports concatenated CSS string
  layout.js      — flexbox grids, card shells
  components.js  — buttons, inputs, modals, chips
  themes.js      — per-theme color tokens
  animations.js  — keyframes, transitions
```
Bundle should also drop a chunk with esbuild minify enabled (currently disabled).

### Phase 3 — `modals.js` split (1,302 lines → ~5 files)
One file per modal: chore-edit, store-item-edit, person-edit, icon-picker, settings.

### Phase 4 — `modes-admin.js` split (1,134 lines → per-tab files)
`admin/today.js`, `admin/family.js`, `admin/chores.js`, `admin/rewards.js`, `admin/history.js`, `admin/settings.js`.

### Phase 5 — Small wins
- Add `_unrecorded_attributes = frozenset({...})` to sensor classes — fixes the Recorder 16 KB warning, no schema change.
- Remove the placeholder `FamilyHubTodaySensor` (always returns 0/[]) — small polling cost gone.
- Coordinator: isolate notification failures from `UpdateFailed` (separate try/except so notification problems don't mark the integration as failed).

### Expected impact
- `data_store.py` reads drop from ~30K tokens to ~6–10K depending on which submodule you need.
- `css.js` reads drop from ~50K tokens to whatever concern you're editing.
- Total per-session token cost on a typical backend edit roughly halves.

---

## v0.6.7 Backlog (brainstorm — needs design work)

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

### Deferred items from v0.6.3 backlog (parked, will revisit after v0.6.6)
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
| **v0.6.6** | Codebase cleanup | `data_store.py` split, `css.js` split, modals split, modes-admin split, sensor unrecorded attributes |
| **v0.6.7** | Group rewards expansion | Group subscriptions, group streak reward, "Propose sharing" UI, v0.6.3 deferred items |
| **v0.7.0** | Home Maintenance room — full feature | Maintenance room is already live as a read-only drill-down. v0.7 adds CRUD (add/edit/delete items from the card), scheduling/recurrence, and richer tracking. |
| **v0.8.0** | Meals room | Weekly menu builder, grocery list, "what's for dinner" on the home strip. Scaffold is live as coming-soon. |
| **v0.9.0** | Calendar room | Pulls real HA calendar entities into the today strip. Scaffold is live as coming-soon. |
| **v1.0.0** | Smart Home room | Permission-gated lighting/climate/irrigation controls for kids. Scaffold is live as coming-soon. |
| **v1.x** | Theme builder UI | Parent authors themes without editing code. |

**Held out indefinitely (will revisit if user demand surfaces):**
- Photo evidence for approvals — heavier HA media-source dependency.
- History pagination — currently 30-day rolling window; "show older" expand link in admin.
- Achievements / badges engine — wait until ranks have lived in the wild.
- Per-theme audio cues via `alexa_media_player` — fun but a rabbit hole.

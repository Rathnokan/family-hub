# Family Hub v0.7.6 — "Reward gates, weekly streak & phone surfaces"

A larger release: reward unlock **gates**, **bonus-chore claiming**, fully **dynamic ranks**, a
new **weekly-consistency streak**, and a set of **phone home-screen surfaces** so kids can see —
and tick off — their chores from their own phones, outside the app.

## Rewards — unlock gates

- Per-reward **gates**: a reward can require a minimum **% of the day's daily chores done**
  (approved only; any weekly chore due that day must also be complete) and/or a **minimum rank**
  before it can be requested. Enforced in `async_request_redemption` and surfaced as a **locked
  badge** on all six themes. Admin editor + service schema gain `require_daily_pct` and
  `min_rank_index`.

## Bonus / claimable chores

- Switching a chore to **"Bonus"** now reconciles its task instances (`async_update_chore` + a
  load-time repair) so it stops lingering as an owned task and instead generates a shared
  **claimable** instance. Kids claim bonus chores from a new **rail panel under streaks** on every
  personal theme.

## Ranks — now fully dynamic

- **Manual rank set** + a **"Lock rank"** checkbox that pauses the weekly auto-evaluation.
- **Dynamic weekly capacity**: each kid's rank drop/gain bands are a **% of their directly-assigned
  chore points that week** (rotations included; bonus chores and streak bonuses excluded).
  Capacity is now **computed, not configured** — the manual capacity field + toggle are gone. Admin
  shows the resolved point ranges and the live assigned-per-week basis.

## New — weekly-consistency streak

- A second streak alongside the success-rate one: earn a bonus for **N consecutive weeks** at
  **≥ threshold%** of the week's chores done (points-based, so harder chores weigh more and bonus
  chores help hold it; excused days don't count).
- Per-kid admin knobs (**weekly threshold / milestone / bonus points**) in the person editor; a
  **weekly-streak chip** in the status rail and a **weekly progress bar** above the chore list on
  all six themes; a `weekly_completion_streak_milestone` history event.

## New — phone home-screen surfaces

Kids can now see and act on their chores from their own phones, outside the app and the kitchen
Command Center:

- **Per-person widget sensor** (`sensor.family_hub_<name>_widget`): a display-ready state
  (`"3 to do · 45 pts"`) plus the chore-name list / pre-joined lines in attributes, so an Android
  home-screen widget needs **no template** — add widget, pick sensor. Built from the same
  `get_tasks_for_card` the kid's page uses, so it always matches.
- **Quiet checklist notification** (opt-in, **off by default**): one silent, self-replacing
  notification per person that lists today's chores with **Done buttons** — tick a chore off from
  the lock screen, no app, no spam (low-importance channel + a fixed tag, re-pushed only when the
  list changes). Tapping Done routes a `mobile_app_notification_action` back to `complete_task`.
  Enable per person via `update_person`'s new `checklist_notify` flag.

## Admin

- **Earning & Balance** rail: per-kid chore count now matches the chore table (current rotation
  holder only) + a current-rank chip.
- **Family panel** made responsive (intrinsic card grid + flexible subscriptions rail) instead of
  a hard-coded width.

## Migration / compatibility

No storage migration (STORAGE_VERSION stays 2). New person fields (`weekly_completion_*`,
`checklist_notify`) and reward fields (`require_daily_pct`, `min_rank_index`) default off / safe.
New `sensor.family_hub_<name>_widget` entities are added per person on reload.

## Files

Backend: `redemptions_mixin.py`, `chores_mixin.py`, `store_items_mixin.py`,
`streaks_ranks_mixin.py`, `tick_mixin.py`, `card_model.py`, `card_shaper_mixin.py`, `sensor.py`,
`people_mixin.py`, `services.py`, `services.yaml`, `coordinator.py`, `tasks_mixin.py`,
`__init__.py`, `const.py`, `data_store.py`.
Frontend: `_shared.js`, all six themes, `dispatch.js`, `modals.js`, `modes-admin.js`,
`constants.js`, `css/part2–4.js`.

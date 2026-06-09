# Family Hub v0.7.5 — "Chores: balance tools & polish"

Closes out the Chores module for now: a parent-facing **earning/balance what-if tool**, a
rebuilt **printable chore list**, a couple of real **bug fixes**, a new **daily-penalty grace**
option, accurate **rank-scaled money**, and dead-code cleanup.

## Admin → Chores: "Earning & Balance" rail

The desktop right column (a dead "tap a chore to edit" placeholder since v0.7.3) is now a
per-kid earning/balance calculator, computed entirely on the frontend from the existing model.

- **Per-kid cards** lead with the **weekly** figure (`$/wk` + points) — since allowance is
  discussed weekly — with the **month** as a secondary line, plus a **min–max range bar with a
  "this week" dot** so rotation-driven weekly swings are visible, not hidden.
- **What-if controls** (session-only, no data writes): **rank override** (see everyone at a
  chosen rank), **expected completion %**, and an **include-streak-bonus** toggle with a
  **streak-achievement %** (amortised `bonus ÷ milestone` per occurrence).
- **Monthly balance** bars (the stable fairness view), **family payout** totals, **bonus pool**
  (claimable up-for-grabs), and a **dynamic swing tip** that names whichever weekly-rotation
  chores currently drive week-to-week swings (recomputed every render).
- **Rotation attribution** is fair-share: a rotating chore splits evenly across its active pool
  at every scale (Week×4 == Month), so per-instance/daily rotations compare fairly across kids.

## Money is now rank-accurate

The admin rail converts points→dollars using each kid's **rank-scaled cents-per-point**
(`rank_ppd_ladder`), not the global store-pricing `points_per_dollar`. Previously the rail
overstated dollars (e.g. ~14% at rank 1). Points stay the rank-neutral comparator.

## In-list rotation indicator

Rotating chores in the admin list now render their **pool in rotation order** — current holder
ringed, next-up marked, the rest dimmed, prefixed with ↻ — so it reads differently from a plain
multi-assignee chore.

## Bug fix — rotation editor showed the wrong "current" holder

The backend advances rotations by bumping `rotation_index`/`assigned_to` without reordering
`rotation_pool`, so after a rotation the editor's pool widget (which labels the top "Current")
showed a stale holder and you couldn't reliably switch turns. The editor now renders the pool
**current-first**, and saving snaps the active holder to the top — switching works and the stored
order self-heals.

## New — daily-penalty "grace" for daily chores

On a **daily** chore, `daily_penalty_after_days` now means **how many consecutive skips are
allowed before the penalty starts** (a reverse streak): set 3 → the first 2 misses are free, then
every skip costs the penalty until the chore is completed (which resets the counter). Penalty-
paused days stay transparent (no charge, no progression). **Weekly/monthly/every-N chores are
unchanged** — there the field keeps its original "escalating per-day deduction inside the open
window" meaning. The editor field is relabeled **"Penalty grace"** with help text covering both.

## Printable chore list — rebuilt (kids-only, ~2 pages)

- **Everyone** section lists the chores every kid shares once (instead of repeating under each).
- **Per-kid sections** show that kid's own chores + the rotations they hold now (↻), with a
  weekly **points + $** total in the header.
- **Rotation schedule** table — every rotating chore with its order (current in **bold**),
  cadence — the planning view.
- **Penalty points** shown (red `−X` under the green `+earn`); **Up for grabs** + **Reminders**
  at the end. Dollars are standardised at **Rank 3** (mid-point rate) for one consistent figure.

## Fixes & cleanup

- **Edit no longer jumps to the top of the page** — dropped `autofocus` on the chore-name field
  (the drawer animates in from off-screen, and autofocus' scroll-into-view yanked the page up).
- **Right rail scrolls independently** — tightened its max-height so its body scrolls internally
  instead of being chained to the chore list's scroll.
- Removed dead code: unused `_rotationSwitchLabel`; orphaned `ok-edit-chore-inline` /
  `close-chore-panel` dispatch handlers from the retired inline editor panel.
- **Docs:** corrected the stale "ships ~1000-entry history_log" note — the card model caps the
  history payload at **150 collapsed rows** over websocket (off the state machine since v0.7.0),
  so it is not a perf concern at family scale.

## Files

Frontend: `src/card/modes-admin.js`, `print-chore-list.js`, `modals.js`, `dispatch.js`,
`FamilyHubCard.js`, `css/part1.js`, `css/part4.js`.
Backend: `tick_mixin.py`, `streaks_ranks_mixin.py`. No schema/migration change.

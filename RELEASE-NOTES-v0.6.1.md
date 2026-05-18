# Family Hub v0.6.1

> Released 2026-05-17 · [Compare to v0.6.0](https://github.com/Rathnokan/family-hub/compare/v0.6.0...v0.6.1)

Focused polish release. Three carry-overs from v0.6.0:

- 🔥 **Success-rate person streak** — a new person-level "consistent kid" metric. Award N bonus points every M consecutive days the kid completes at least X% of the chores actually due to them that day.
- 🃏 **Claimable picker redesign** — the claim modal's `<select>` dropdown is replaced with a card grid of tappable person tiles. Tap a tile = instant claim. Designed for Echo Show touch input.
- 👆 **Bigger completion buttons** — adult-theme `.fh-row-btn` and Mission Control `.fh-mc-go-mini` bumped to ~60 px tall for thumb-confidence on kitchen displays. Kid-large was already there.

## Success-rate streak (the headline)

Every kid has three configurable knobs (Admin → Family → Edit person → Success streak):

| Field | Default | Meaning |
|---|---|---|
| Threshold | 80% | What share of yesterday's assigned chores must be marked completed (or pending approval) to count as a "good day" |
| Milestone | 7 days | How many consecutive good days earn a bonus |
| Bonus | 50 pts | Points awarded at each milestone |

Set milestone to `0` to disable for that person.

Once per daily tick, after the skip pass finalizes yesterday's status, each kid is evaluated. If hit-rate ≥ threshold the streak increments. Otherwise it resets to 0. At each milestone, the kid earns the bonus and a "Success streak" event lands in the history log.

Rules:

- **Rest days** (zero chores due) leave the streak untouched. Holidays don't break the run.
- **Excused chores** (parent excused) are pulled from BOTH numerator and denominator — they don't count for or against.
- **Pending-approval** counts as completed for streak purposes (the kid did the work; whether the parent has tapped Approve yet is irrelevant).
- **Penalties paused** (global or per-person) skips streak evaluation entirely. Same wash-day treatment as penalties.
- Only **assigned chores** count. Claimable bonus chores don't contribute.
- Streaks survive 7-day catch-up (HA was offline) — the catch-up loop evaluates each day in order using `last_completion_eval_date` as the cursor.

The current streak surfaces in two places:

- **Mission Control agent card** — `🔥 7d · 80%` chip below the codename, in amber. Hidden when streak = 0 so quiet kids don't get a glaring zero.
- **Themed personal rails** — every theme's Rank panel grows a streak line under the rank bar. Tone adapts to the theme: amber on dark, sepia on paper themes (Baker / Dinos / HP), white card with navy border on DBZ.

New service `family_hub.set_completion_streak` — admin override to fix accidental breaks. Same shape as `set_streak`: `{ person_id, count }`.

## Claimable picker

The old `<select>` dropdown in the claim modal worked, but on Echo Show 15 you'd tap, scroll a tiny ribbon, hunt for the name, tap again. New flow:

```
Open Ops → tap claimable chore → modal shows a card grid →
   each kid as a 140px-wide tile (avatar + codename + name) → tap = claim
```

One tap to claim. Parents are filtered out (they shouldn't be claiming chores). The "Claim" OK button is gone — the tile click IS the action. Cancel button still in the footer.

Backward-compatible: the dispatch handler reads `data-pid` off the tile first, but falls back to the old `m-clperson` hidden input if any legacy code path still uses it.

## Bigger completion buttons

Visible CSS-only changes:

| Selector | Was | Now |
|---|---|---|
| `.fh-row-btn` (adult-theme completion button) | min-width 64 px, padding 8×10 | min-width 72 px, **min-height 60 px**, padding 10×14 |
| `.fh-mc-go-mini` (Mission Control mini buttons) | min-width 48 px, padding 5×6 | min-width 64 px, **min-height 60 px**, padding 8×10 |

Kid-large stays untouched — it was already at this size and serves as the reference target.

## Backend additions

New per-person fields, all with load-time `setdefault` migration:

```python
"completion_streak":           0,
"completion_threshold_pct":    80,
"completion_milestone":        7,
"completion_bonus_points":     50,
"last_completion_eval_date":   None,
```

`update_person` service schema accepts the three configurable knobs (`completion_threshold_pct`, `completion_milestone`, `completion_bonus_points`). `set_completion_streak` is a new admin-override service. New `HISTORY_COMPLETION_STREAK_MILESTONE` event type ("Success streak", green, lands in the history log with the bonus points.

## Breaking changes

None. Existing v0.6.0 data files migrate transparently. Streak counters start at 0, knobs default to 80% / 7d / 50 pts. Set milestone to 0 if you don't want the feature for a given kid.

## Upgrade

- **HACS** — Settings → HACS → Update Family Hub. Reload the integration. Hard-refresh the dashboard.
- **Manual** — replace `custom_components/family_hub/` with this release. Restart HA. Hard refresh.

After upgrade, glance over each kid's Success streak settings (Admin → Family → Edit person → Success streak section) and tune to taste.

## What's next

Nothing concrete queued for v0.6.2 — most of the v0.6.x "polish" backlog is now empty. v0.7.0 will be the Meals room headline (currently a coming-soon scaffold).

— Rathnokan

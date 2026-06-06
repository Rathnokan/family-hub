# Family Hub v0.7.2 — "Dynamic Ranks"

Per-kid, per-rank rank evaluation plus a consolidated, drawer-based admin for
everything rank-related. Existing data is untouched (additive migration only).

## Highlights

### Per-kid, per-rank gain/drop curves
Each kid can now climb and fall on their **own** schedule, tuned to how much they
can realistically earn in a week:

- Set a kid's **weekly capacity** (points), then each rank gets a **Drop %** and a
  **Gain %** of that capacity. The formula is deliberately flat and transparent:
  **threshold points = % × capacity** (rounded to the nearest 5). The editor shows
  the resulting points live.
- The shape you'd expect: easy to climb / hard to fall at the bottom, demanding to
  climb / easier to slip at the top. Default bands — gain `50/60/75/95%`, drop
  `—/40/55/75/95%` — pre-fill a new kid; tweak any cell.
- Capacity is the fairness lever: a kid with a smaller capacity needs fewer points
  for the same %, so the same ladder is fair across siblings.
- Movement stays **±1 rank per weekly evaluation**.

### All themes are now 5 ranks — rank follows a theme swap
Every theme ladder (Engineer, Dinos, HP, Baker, Classic, DBZ) is standardized to
**5 rungs** with identical XP breakpoints. A kid can switch themes and keep their
rank and reward economics — only the rung *names* change. Anyone previously above
rank 5 is clamped to the top rung on first load.

### One place for ranks — a side-rail drawer
All rank settings, previously scattered across three screens, now live in a single
**Ranks** drawer (Settings → Ranks, or 🏅 on any kid's row):

- **Global tab** — evaluation weekday, default fallback band (as %), and the reward
  value-per-rank (¢/point) ladder.
- **Per-kid tabs** — capacity, rank-index override, and the per-rank %/points grid.

The **Edit Person** and **Edit Settings** editors are now drawers too (fewer
center-screen popups).

### Full-color emoji chore/reward icons
Chore and reward icons now render as **full-color emoji** instead of thin
monochrome line icons — much easier for younger kids to read at a glance. Keys map
1:1 to the existing icon set (`FH_EMOJI` keyed identically to `FH_ICONS`), so every
existing chore/reward keeps working with **no data migration**; anything without an
emoji falls back to the legacy stroke icon. Icon tiles are enlarged to suit.

### Clearer rank bar
The personal-page rank bar now spans **0 → weekly capacity** and draws **two
vertical lines** — orange for the drop threshold, green for the gain threshold —
with the fill showing points earned this week. Bottom rung hides the drop line; top
rung hides the gain line.

## Fixes
- **Weekly-points window aligned.** The bar's "this week" now follows the configured
  evaluation weekday instead of being hard-coded to Monday, matching the server's
  rank-eval window.
- Removed dead code (the old inline ¢/pt-ladder save handler).

## Under the hood
- New per-person fields `rank_gain_thresholds` / `rank_drop_thresholds` (absolute,
  length-5) + `rank_curve` knobs; eval resolves per-rank with fallback
  **array → legacy scalar → global**, so unconfigured kids behave exactly as before.
- New global settings `rank_default_cap` / `rank_default_drop_pct` /
  `rank_default_gain_pct`. Reusable `.fh-drawer` overlay sharing the modal pipeline.

## Upgrade
HACS update (or Samba copy) → **reload** the Family Hub integration → **hard-refresh**
the dashboard. No data migration; existing data is untouched.

# Family Hub v0.7.3 — Chores: make-up, partial credit & a cleaner editor

A big chores release: catch up on missed chores, give partial credit, and a chore
editor rebuilt as a logical side-rail drawer. Existing data is untouched (additive).

## Highlights

### Make-up & approval flexibility
- **Partial credit.** Approving a chore is now **Approve / Partial / Deny** — Partial
  awards **25 / 50 / 75%** of the points. Partial still keeps streaks and counts toward
  the daily success-rate.
- **Late make-up claims.** Forgot to check a chore off? On a kid's **History → Skipped**
  list, a **Claim** button sends it to the parent approval queue. Approving it (full or
  partial) **refunds the original skip penalty** and awards the credit.
- **Excuse the whole day.** One tap in the admin History excuses every still-skipped
  chore for a kid on a given day.

### A cleaner chore editor
- Editing now opens a **right-side drawer** (matching the Ranks/Person editors); the
  chore list stays as the rail.
- **Five tabs collapsed to three**, in workflow order: **Details** (name + active toggle,
  multiline description, type/category, collapsible icon picker, reminder),
  **Schedule** (who → recurrence → rotation), **Points & Rewards**.
- **Recurrence:** **Daily** (fires on chosen days), **Weekly** (pick reset days, stays
  active until the next reset), and **Monthly — now multi-day** (e.g. the 1st *and* 15th).
  **One-time chores are retired** (use Award bonus points for one-offs); the separate
  "Add Task" quick flow is gone.

### Rotation
- Pick the **weekly switch day** per rotating chore (no longer hard-coded to Monday);
  cadence simplified to **Per-instance** or **Weekly**.
- The pool editor shows **Current** and **Up Next**; the personal dashboards show a
  condensed **Current / Up Next (date)** rotation panel below the streaks.

### Visibility & admin polish
- **Due/reset labels** on chore rows — "Today / Tomorrow / Wednesday".
- **Admin actor logging** — admin actions (approve, deny, partial, excuse, reject,
  mark-done, redemption approve/decline, award/deduct) now record the **logged-in HA
  user** and show "· by …" in History.
- **Person delete** moved to a red trash icon in the card's lower-right.

## Fixes
- Weekly/twice-weekly chores now show a meaningful due/reset day instead of nothing.
- Points medal + due label layout corrected on the HP theme (and all themes).

## Upgrade
HACS update → **reload** the Family Hub integration → **hard-refresh** the dashboard.
No data migration; existing chores, ranks, and history are untouched.

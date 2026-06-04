# Family Hub v0.7.1 — Bug-fix & cleanup

A correctness patch off a full-codebase review. No new features; no data migration.
Behaviour-preserving except where a bug is fixed.

## Fixes

- **Redemptions can no longer be over-approved.** Approving a reward now re-checks
  the balance at approval time, so two separately-affordable requests can't both be
  approved into a free reward. An unaffordable request is left pending for the parent
  to award points or decline.
- **Subscriptions: a $0 cost override is honoured.** A "free" override
  (`dollar_cost_override = 0`) was being ignored at renewal and charged at full price
  while the card showed 0. Now charges 0, matching the display.
- **Subscription rail "Ready" tells the truth on a lapsed sub.** The store-tab rail
  now counts accumulated debt when deciding "✓ Ready" vs "Need N pts", matching the
  task-tab rail. Affects all six themes.
- **"Add task" penalty actually applies.** The penalty checkbox + points field in the
  Add Task dialog were collected but never sent. One-time tasks created with a penalty
  now deduct it if the task expires unfinished.
- **Lapsed subscriptions awaiting cancellation now notify.** A subscription in
  "cancel pending" that couldn't renew was lapsing silently and accruing debt with no
  alert. Parents are now notified on the first missed renewal regardless of state.
- **Inline subscription editor no longer closes itself.** Editing a subscription's
  period/cost/date in the admin Family panel survives a background data refresh.
- **History shows proper labels** for subscription and group-reward events
  (subscribed, renewal, lapsed, canceled, chip-in, group redeemed, etc.) instead of
  raw internal codes.

## Internal / housekeeping

- Repaired a per-person penalty-pause constant that had regressed to the global key
  during the v0.7.0 refactor (behaviour was unchanged; the semantic trap is gone).
- Removed dead code/constants (`FH_SENSORS`, `UPDATE_INTERVAL`, an unused render flag).
- Fixed stale version/label drift (admin sidebar version, "coming soon" room badges,
  `const.VERSION`).
- Docs + the "rebuild data" summary now state the actual 30-day task-instance
  retention window (previously documented as 60). See DECISIONS_LOG if you want it
  back at 60 — it's a one-line change.

## Upgrade

HACS update (or Samba copy) → reload the Family Hub integration → hard-refresh the
dashboard. No data migration; existing data is untouched.

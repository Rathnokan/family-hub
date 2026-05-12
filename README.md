# Family Hub

A private, self-hosted family chore and rewards integration for Home Assistant.

> Built for one family, designed to be shared. HACS-compatible.

---

## What it does

- **Chore tracking** — daily, weekly (including multi-day patterns like Mon/Wed/Sat), monthly, or one-time tasks. Assigned to specific people or claimable first-come-first-served.
- **Points & rewards** — every chore is worth points. Kids spend points in a household rewards store.
- **Parent approval flow** — chores can be self-reported (instant points) or require parent approval before points are awarded.
- **Streaks** — consecutive completions build a streak. Configurable milestone bonuses fire every N completions.
- **Allowance** — scheduled point deposits per person: weekly, bi-weekly, or monthly. Catch-up aware.
- **Penalty system** — missed chores at reset deduct points. Optional daily penalty threshold: if a chore isn't started within N days, penalties begin accumulating before the reset.
- **HA notifications** — parents get push notifications for approval and redemption requests. Kids receive time reminders and penalty warnings.
- **History log** — every completion, approval, denial, and redemption recorded. 30-day rolling window.
- **Four card modes** — command center, personal dashboard, home maintenance, admin panel.
- **One JSON file** — all data in `/config/family_hub_data.json`. Easy to back up.

---

## Installation

### Via HACS (recommended)

1. Open HACS → Integrations → Custom repositories
2. Add `https://github.com/Rathnokan/family-hub` as type **Integration**
3. Search for "Family Hub" and install
4. Restart Home Assistant

### Manual

1. Download this repository
2. Copy the `custom_components/family_hub` folder into your HA config:
   ```
   /config/custom_components/family_hub/
   ```
3. Restart Home Assistant

---

## Setup

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **Family Hub**
3. Follow the setup wizard — enter your family name, points-per-dollar rate, and add your first parent account
4. Add more people and chores from the Admin Panel dashboard after setup

---

## Lovelace card

Family Hub ships a custom Lovelace card. After installation, add a card and choose **Custom: Family Hub Card**.

### Card modes

| Mode | Description |
|---|---|
| `command_center` | Kitchen display — all active tasks for all people, approval dots, claimable tasks |
| `personal` | Per-person view — their tasks, history tab, and rewards store |
| `admin` | Full management — overview, approvals, redemptions, chore editor, settings |
| `maintenance` | Home maintenance tracker — overdue, due this week, due next week |

### Card configuration options

| Option | Description |
|---|---|
| `mode` | One of the modes above |
| `person` | Person name (lowercase) — required for `personal` mode |
| `text_scale` | `0.9` Small · `1.0` Default · `1.25` Large · `1.5` XL. Use Large/XL for Echo Show or tablets. |

---

## Recurrence types

| Type | Behaviour |
|---|---|
| `daily` | Available every day, or on specific weekdays via day filter |
| `weekly` | Available all week, resets on one or more configured weekdays (e.g. Mon/Wed/Sat) |
| `monthly_on_date` | Available all month, resets on a specific day of the month |
| `one_time` | Single-use task, expires after a configurable number of days |

> `every_n_days` and `every_n_weeks` are supported for existing data but no longer available in the chore editor UI.

---

## Chore options

| Option | Description |
|---|---|
| `penalty_enabled` | Deduct points when the chore is skipped at reset |
| `penalty_points` | How many points to deduct |
| `daily_penalty_after_days` | Days after availability before daily penalties begin accumulating |
| `streak_milestone` | Award bonus points every N consecutive completions (0 = disabled) |
| `streak_bonus_points` | Bonus points awarded at each milestone |
| `reminder_time` | HHMM time to send a push reminder if the task is still pending (e.g. `1700` = 5pm) |
| `expires_after_days` | One-time tasks expire after this many days if unclaimed |
| `claimable_subtype` | `fcfs` (first-come-first-serve) or `multi_claim` |
| `max_claimants` | Max number of claimants for multi-claim chores |
| `multi_claim_points_mode` | `full` (everyone earns full points) or `split` (points divided evenly) |

---

## Sensors

| Sensor | Description |
|---|---|
| `sensor.family_hub_needs_attention` | Central admin sensor. Attributes include approval queue, redemption queue, all people with balances, active chores, store items, history log, and settings. |
| `sensor.family_hub_[name]` | Per-person sensor. Attributes include balance, tasks due today, pending approvals, store items. |
| `sensor.family_hub_claimable_tasks` | All active claimable task instances. |
| `sensor.family_hub_maintenance_due` | Maintenance items grouped into overdue, due this week, and due next week. |

---

## Services

| Service | Description |
|---|---|
| `complete_task` | Mark a task done (self-report, or submit for approval) |
| `claim_task` | Claim a task from the claimable pool |
| `approve_task` | Approve a pending task and award points |
| `deny_task` | Deny a pending task (recreates the instance so it can be retried) |
| `reject_task` | Reject a previously approved task and claw back points |
| `excuse_task` | Excuse a skipped task and reverse its penalty |
| `mark_complete` | Retroactively mark a skipped task done and award points |
| `add_task` | Quick-add a one-time task |
| `add_person` | Add a family member |
| `update_person` | Edit a person (name, type, color, allowance, notification target) |
| `remove_person` | Deactivate a family member |
| `add_chore` | Add a recurring chore |
| `update_chore` | Edit a chore |
| `delete_chore` | Deactivate a chore |
| `request_redemption` | Request a store reward |
| `approve_redemption` | Approve a redemption and deduct points |
| `decline_redemption` | Decline a redemption |
| `add_store_item` | Add a reward to the store |
| `update_store_item` | Edit a store item |
| `delete_store_item` | Remove a store item |
| `award_bonus_points` | Award bonus points to anyone |
| `deduct_points` | Deduct points from anyone |
| `update_settings` | Update family name, points rate, penalty alert time |
| `add_category_label` | Add a chore category label |
| `remove_category_label` | Remove a chore category label |
| `set_streak` | Manually correct a streak count (admin override) |
| `force_daily_tick` | Trigger the daily tick immediately (testing / recovery) |
| `rebuild_data` | Clean up ghost instances, orphans, and duplicates. Posts a summary notification. |
| `export_backup` | Save a timestamped backup to `/config/family_hub_backups/` |

---

## Notifications

Family Hub uses standard HA `notify.*` services. Set a `notify_target` on each person's record (e.g. `mobile_app_jims_iphone` or an `alexa_media_player` entity for Echo Show TTS).

| Notification | Trigger |
|---|---|
| Approval needed | Kid submits a chore for parent approval |
| Redemption requested | Kid requests a store reward |
| Last-chance penalty warning | Day before a penalty-enabled chore resets |
| Daily penalty accumulating | Each day while `daily_penalty_after_days` penalties are firing |
| Chore reminder | When current time reaches the chore's `reminder_time` and it's still pending |

Global penalty alert time and per-chore reminder times are configurable from the Admin Panel → Settings.

---

## Data file

All data lives at `/config/family_hub_data.json`. The integration never overwrites this file on update — only your actions (completing tasks, adding people, etc.) modify it.

**Back up regularly.** Use the **Export Backup** button in the Admin Panel (or the `export_backup` service) to save a timestamped copy to `/config/family_hub_backups/`.

If the data file accumulates stale records over time, use the **Rebuild Data** button in Admin Panel → Settings to clean up ghost instances, orphan records, and duplicates.

---

## Contributing

PRs welcome. Open an issue first for major changes.

---

## License

MIT

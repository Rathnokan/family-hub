# Family Hub

A private, self-hosted family task management integration for Home Assistant.

> Built for one family, designed to be shared. HACS-compatible.

---

## What it does

- **Kid chores** — daily, weekly, or custom recurrence. Assigned or first-come-first-served.
- **Points & rewards** — each chore is worth points. Kids spend points in a rewards store.
- **Parent approval flow** — chores can be self-reported (instant points) or parent-approved.
- **Home maintenance** — track HVAC filters, seasonal tasks, and adult recurring chores.
- **One-time tasks** — quick add for anyone, assigned or free-for-all.
- **Private stores** — common reward items plus personal items per person (parents have their own private store).
- **Four dashboards** — command center, personal, home maintenance, admin panel.
- **Push notifications** — approval and redemption requests go straight to your phone.
- **Full history log** — every completion, approval, and redemption recorded.
- **One JSON file** — all data in `/config/family_hub_data.json`. Easy to back up.

---

## Installation

### Via HACS (recommended)

1. Open HACS → Integrations → Custom repositories
2. Add `https://github.com/YOUR_USERNAME/family_hub` as type **Integration**
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
3. Follow the setup wizard:
   - Enter your family name and points-per-dollar rate
   - Add one parent (add more people from the admin dashboard later)
   - Optionally add kids by name (comma-separated)
4. Restart Home Assistant if prompted

---

## Data file

All data lives at `/config/family_hub_data.json`. Back this up regularly — the integration
includes an **Export Backup** service that saves a timestamped copy to `/config/family_hub_backups/`.

---

## Services

All actions are available as HA services under the `family_hub` domain:

| Service | Description |
|---|---|
| `complete_task` | Mark a task done (self-report or pending approval) |
| `claim_task` | Claim a task from the claimable pool |
| `approve_task` | Approve a pending task and award points |
| `deny_task` | Deny a pending task |
| `add_one_time_task` | Quick-add a one-off task |
| `add_person` | Add a family member |
| `add_chore` | Add a recurring chore |
| `update_chore` | Edit a chore |
| `delete_chore` | Deactivate a chore |
| `request_redemption` | Request a store reward |
| `approve_redemption` | Approve a redemption and deduct points |
| `decline_redemption` | Decline a redemption |
| `add_store_item` | Add a reward to the store |
| `award_bonus_points` | Award bonus points to anyone |
| `export_backup` | Save a data backup |

---

## Recurrence options

| Type | Config |
|---|---|
| Daily | `recurrence_type: daily` |
| Weekly | `recurrence_type: weekly`, `weekday: 0` (0=Mon, 6=Sun) |
| Every N days | `recurrence_type: every_n_days`, `interval: 3` |
| Every N weeks | `recurrence_type: every_n_weeks`, `interval: 2` |
| Monthly on date | `recurrence_type: monthly_on_date`, `day_of_month: 15` |
| One-time | `recurrence_type: one_time` |

---

## Sensors created

| Sensor | Description |
|---|---|
| `sensor.[name]_points` | Current spendable balance per person |
| `sensor.[name]_lifetime_points` | All-time points ever earned |
| `sensor.tasks_due_today` | Tasks due today (all people) |
| `sensor.tasks_overdue` | Overdue pending tasks |
| `sensor.pending_approvals` | Tasks + redemptions awaiting approval |

---

## Roadmap

- [x] Phase 1 — Core integration, data store, sensors, services
- [ ] Phase 2 — Lovelace dashboards (Mushroom cards)
- [ ] Phase 3 — Push notifications via HA mobile app
- [ ] Phase 4 — Web-based admin panel (custom panel)

---

## Contributing

PRs welcome. Open an issue first for major changes.

---

## License

MIT

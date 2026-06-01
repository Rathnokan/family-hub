# Family Hub v0.7.0 — "Re-foundation"

A performance + architecture overhaul. No new family-facing features over v0.6.5 are
required to benefit — the dashboard and integration are simply much lighter, faster,
and cheaper to run. Plus a real new admin capability (inactive-member management) and
a big internal cleanup.

> **Breaking (internal):** sensor entity_ids/attributes changed and the data file
> layout changed. Your data is migrated automatically and safely (see Migration). If
> you reference Family Hub sensor *attributes* in your own automations/templates, see
> "Breaking changes" below.

---

## ⚡ Performance

- **No more 30-second polling.** The integration used to run the full daily tick and
  rebuild every sensor every 30 s. It's now **event-driven**: the daily tick fires once
  at local midnight, reminders/penalty nudges run on a light per-minute heartbeat, and
  the UI updates instantly on your actions.
- **Dashboard data no longer floods the system.** The card's full data model used to be
  packed into sensor attributes and pushed through Home Assistant's state machine — and
  recorded to the database — on every change, to every device. The model now lives behind
  a **websocket API** (`family_hub/get_model`) that only the *visible* card pulls, only
  when something actually changes. Sensors are now lean scalars (balance, counts) that are
  genuinely useful in automations.
- **Recorder bloat gone.** Heavy attributes are excluded from the recorder; the
  ">16 KB state attributes" warning is gone.
- **Storage is split + debounced.** Instead of rewriting one ~1 MB JSON file on every
  chore tap, data is split into per-domain stores with debounced writes — a burst of taps
  coalesces into a single small write.
- **Smaller card bundle** (minified).

## ✨ New

- **Manage inactive members.** Deactivating a person (e.g. a kid away at camp) is now
  reversible: Admin → Family → **Inactive members** lets you **Reactivate** them, or
  **permanently delete** them (with a full cascade purge of their data). Chores and store
  items already had reactivate + delete.

## 🧰 Fixes & polish

- Admin **Family panel** no longer truncates names at narrow widths (action buttons moved
  to their own row).
- Added **`services.yaml`** — all services now have names, descriptions, and input fields
  in Dev Tools → Actions, and the "Failed to load services.yaml" startup error is gone.
- Notification failures (a flaky phone/Alexa target) no longer mark the whole integration
  as failed.

## 🏗️ Under the hood (for contributors)

- **`data_store.py` modularized** — 4,815 → ~620 lines. The persistence core stays in
  `data_store.py`; every domain is now its own `*_mixin.py` (people, chores, tasks,
  rewards, subscriptions, group rewards, redemptions, history, tick, …) mixed into one
  class. `css.js` similarly split behind a barrel.
- **CI added** (GitHub Actions): Python compile + lint (undefined names) + card build on
  every push.

## 🔁 Migration (automatic + safe)

On first start after upgrading, Family Hub migrates your single `family_hub_data.json`
into the new per-domain stores:

- Your original `family_hub_data.json` is **never modified** — it's read-only during
  migration and kept as a backup, plus a copy is written to `family_hub_data.v1.bak.json`.
- The migration **verifies row counts** before committing; on any mismatch it falls back
  to your original file and retries on the next start. It can't lose data.
- New stores live in `.storage/family_hub_{core,chores,rewards,history}`.

## ⚠️ Breaking changes

- **Sensor attributes are now lean scalars.** The card reads its data from the new
  websocket model, not from sensor attributes. If your automations/templates read large
  attribute lists off `sensor.family_hub_*` (e.g. `tasks_due_today_list`, `history_log`,
  `active_chores`), those have moved — the small scalar counts (balance, `tasks_due_today`,
  `pending_approval`, etc.) remain and are recommended for automations.
- The placeholder `sensor.family_hub_today` was removed.

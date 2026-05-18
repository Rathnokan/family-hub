# Family Hub v0.6.0 — "The Front Door"

> Released 2026-05-17 · [Compare to v0.5.0](https://github.com/Rathnokan/family-hub/compare/v0.5.0...v0.6.0)

This release was scoped around one idea: when somebody walks up to the kitchen Echo Show, what's the first thing they should see? In v0.5.0 the answer was "a list of chores for whoever happened to be configured." In v0.6.0 the answer is **a front door** — a landing screen that knows who's home, which rooms of the house have things going on, and where to take you next.

Almost every surface in the card got a rebuild to support that idea. The integration backend gained a handful of features (codenames, themes, hub layout settings, a Today sensor placeholder); the card got a new home page, six personal themes, a redesigned chore HQ, and a desktop master-detail admin layout.

## TL;DR — what's new

- 🏠 **Command Center home page** with person tiles + room tiles + today strip
- 🎨 **Six themed personal dashboards** — Classic, Engineer, Baker, Dinos, Harry Potter, DBZ — each with rank, streaks, KPIs, themed-rail, and a unified row anatomy
- 👶 **Kid-large mode** — flips any theme into a chunky big-icon card grid for pre-readers, without losing the theme's personality
- 🎯 **Mission Control** — chores HQ with agent roster, grouped chore queue, Intel Alerts, Open Ops, status footer
- 🔧 **Maintenance drill-down** with overdue / due-this-week / due-next-week sectioning
- 🖥️ **Desktop admin layout** — at ≥1280px viewports, the chore manager opens a 480px side panel with a tabbed editor (Details / Schedule / Points & Rewards / Reminders)
- 🚀 **Card-stub split** — the cold-load race that made Echo Show / phone screens flash "Custom element doesn't exist" is now fixed
- 📁 **Categorized icon picker** — chore icons grouped by Self-care / Pets / Kitchen / Cleaning / Outdoors / School / Home / Generic, with an always-visible grid (no more nightmare nested dropdown)

## Highlights

### Command Center → Front Door

The Command Center mode no longer dumps you into a flat task list. Instead it opens to a home page with:

- **Person tiles** — one tile per family member showing their balance, open task count, theme sigil, and rank title. Tap to drop into their themed personal dashboard.
- **Room tiles** — Chores, Maintenance (both live), plus coming-soon scaffolds for Meals (v0.7.0), Calendar (v0.8.0), Smart Home (v0.9.0). Each live room has its own drill-down view.
- **Today strip** — approval count badge + weather entity. Calendar entities are wired through the backend and will populate the strip when the Calendar room ships.

All rooms are toggleable per-room from Admin → Settings → Hub Layout, so families that don't need a room can hide its tile.

### Six personal themes, one shared row

Each family member can be assigned one of six themes via `theme_key`. The themes share the **exact same row anatomy** — icon + name + chips (streak / status / firing / expiry) + points + action button — so a kid switching themes finds everything in the same place visually. Only the palette, fonts, borders, button shape, and accent labels change.

- **Classic** — dark UI with the person's avatar color as the accent rail. Parent default.
- **Engineer** — blueprint cyanotype, mono fonts, work orders (`WO-001 · CATEGORY`), amber stamp button, dimensional streak callouts.
- **Baker** — cream paper, recipe-card tickets, "Bake it ✓" pill, terracotta streak dots.
- **Dinos** — kraft paper field journal, specimen tags (`SP-001 · DIG`), stamp "LOG IT" button, footprint streak bars.
- **Harry Potter** — parchment, emerald wax-seal icon containers, "Cast ✓" button, period-number column, gold-star streaks.
- **DBZ** — bright comic-card layout with halftone energy auras, white-card chores with navy borders + drop shadow, huge GO! buttons. Optimized for kid touch input.

Adding a new theme is now one ~10-key config object + one `.fh-row--<key>` CSS color block. No theme-specific row HTML anywhere.

### Kid-large card grid

`child_mode = true` on a person flips their theme into a card grid layout — same DOM, same data, same theme palette, different layout. Cards are ~190px wide, ~240px tall, icons are 120px, buttons are 60px+ tall. Pre-readers can recognize chore icons visually and tap large targets confidently. The kid keeps their assigned theme's personality.

### Mission Control

The chores HQ. Designed for the kitchen Echo Show.

- **HQ header** with stats strip (approval count, redemption queue, active chores, family count)
- **Agent roster** — codename-first cards (`KODIAK · Olivia`), balance + open chore count
- **Grouped chore queue** — one row per chore with per-assignee GO mini-buttons tinted by agent color
- **Intel Alerts** (read-only review queue — approvals stay in Admin to prevent kids approving their own work)
- **Open Ops** — claimable chores anyone can grab
- **Status footer** with last-tick timestamp

### Desktop admin chore editor

At ≥1280px the Tasks section of the Admin panel becomes a 2-column master-detail layout:

- **Left:** the chore table with sortable column chips (Name / Pts / Category / Assignees) and collapsible category groups (chevron headers toggle visibility)
- **Right:** a 480px side panel that opens when you click a row. The editor is **tabbed**:
  - **Details** — name, description, icon grid, type, category, assignees
  - **Schedule** — recurrence + conditional day chips + expiry + claimable subtype
  - **Points & Rewards** — points, approval, penalty, daily threshold, streak milestone + bonus
  - **Reminders** — push reminder time

Tabs switch with **no re-render** — your typed-but-unsaved input on inactive tabs is preserved. The Add Chore modal gets the same tabbed structure since it shares the form.

Below 1280px (phones, narrow tablets) the panel is hidden and the pencil edit button on each row still opens the modal — same flow as before.

### Card-stub split (cold-load race fix)

The card is now delivered in two files:

- `family-hub-card.js` — **6 KB IIFE stub**. Registers `<family-hub-card>` synchronously so Lovelace's "Custom element doesn't exist" warning never fires. Paints a "Loading Family Hub…" pulse-dot placeholder.
- `family-hub-card-body.js` — **447 KB ESM body**. Lazy-imported by the stub on first instantiation, registers `<family-hub-card-impl>`, swaps in once loaded.

This eliminates the cold-load race that made Echo Show / Silk / mobile screens flash a red exclamation until manual refresh on every release. The stub's cache-bust query string is automatically inherited by the body fetch so both files refresh together — no extra config required on your end.

### Icon picker, categorized + always visible

In v0.5.0 the chore editor had a flat alphabetical icon list buried in a dropdown that scrolled in both directions. v0.6.0 ships 47 icons grouped into 8 categories (Self-care, Pets, Kitchen, Cleaning, Outdoors, School, Home, Generic) in an always-visible grid embedded directly in the chore editor's Details tab. Tap to select.

## Backend additions

- New per-person fields: `code` (codename), `theme_key`, `child_mode`
- New per-chore field: `icon` (key into the FH_ICONS library)
- New global settings: `rooms_config` (per-room visibility), `weather_entity`, `today_calendar_entities`
- New sensor: `sensor.family_hub_today` (state=0, schedule=[] placeholder — populated when Calendar room ships)
- Load-time migration adds the new fields to existing people/chores with sensible defaults (no manual config required)

## Breaking changes

None for end users — existing v0.5.0 data files migrate transparently on first load. Per-person `code` defaults to empty string, `theme_key` to `"classic"`, `child_mode` to `false`. All existing chores keep their behavior.

## Upgrade

- **Via HACS** — Settings → Devices & Services → HACS → Update Family Hub. Reload integration. Hard refresh the dashboard (Ctrl+Shift+R) once.
- **Manual** — replace `custom_components/family_hub/` with this release. Restart HA. Hard refresh.

After upgrading, **assign themes to each family member** from Admin → Family → Edit person → Theme. Existing kids default to Classic theme; pick something fun for each one. Codenames are optional but recommended (they show on Mission Control).

## Known issues

- No automated tests yet — every release relies on manual eyeball passes on Echo Show 15, Echo Show 8, and a phone. If you find a regression, file an issue.
- Custom themes from third parties aren't supported in v0.6.0 — the six built-in themes only. A theme builder UI is a v1.0.0 candidate.

## What's next

Queued for v0.6.1 (focused polish release):
- Person-level success-rate streak system (separate from per-chore streaks)
- Claimable picker card-grid (Echo-Show-friendly replacement for the current `<select>`)
- Bigger completion buttons across Mission Control and adult themes

Queued for v0.7.0+:
- Meals room (v0.7.0 headline)
- Calendar room (v0.8.0)
- Smart Home room (v0.9.0)

## Thanks

Built for one family, designed to be shared. If your kids end up running cleaner streaks because of this, send a screenshot — that's the whole point.

— Rathnokan

# Family Hub v0.6.0 — "The Front Door"

> Architecture + implementation plan for the v0.6.0 release. Read once when scoping a v0.6.0 session; refer back when making design calls. Working session status lives in [NOTES.md](NOTES.md), not here.

---

## 1. Vision

v0.6.0 makes Family Hub feel like a **place, not a screen.** The Echo Show 15 stops being a card and becomes a dashboard — a front door (Command Center Home) that opens into rooms (Chores HQ live, others coming soon) and into people (themed personal worlds).

Everything that works today still works. It just gets a richer surface and a real navigation model.

After v0.6.0, adding a new room (Meals, Smart Home, Calendar) or a new gamification layer (ranks, achievements, badges) is **plug-in work, not surgery**.

---

## 2. Principles

These are the guard-rails for design calls during implementation.

1. **Family-friendly first.** The kitchen Echo Show is shared by a 7-year-old pre-reader, an 11-year-old, a 12-year-old, and two parents. Everything on the screen must work for all five. Where a surface is *for* one person (themed personal pages), it gets tailored.
2. **Visual accessibility for the 7yo.** Icons over text where reasonable. Huge tap targets. Color is meaningful but never the only signal — every red "BREACH" badge also says BREACH. The DBZ theme (Jackson's page) is the accessibility test bed.
3. **Glanceability across the kitchen.** Echo Show 15 is read from 6-12 feet away while making coffee. Stats are big, contrast is high, no tiny text on the Home or Chores HQ surfaces.
4. **Pluggable, not monolithic.** Rooms and themes are registries. Adding either is one file in a folder, not a refactor.
5. **No data wasted.** v0.5.0 shipped streaks, allowance, notifications, multi-day weekly, daily-penalty threshold, claimable subtypes. Each gets a visible home in v0.6.0.

---

## 3. Architectural foundations

These foundations carry the next 2 years of features. Get them right in Session 1-2 and the rest is content.

### 3.1 Navigation as first-class state

Today the card has one `mode` config setting. v0.6.0 adds a runtime `_view` state inside the Command Center mode:

```
_view = 'home'                 // landing page
      | 'room:chores'          // Mission Control
      | 'room:maintenance'     // Coming Soon screen / Home Care drill-down
      | 'room:smarthome'       // Coming Soon
      | 'room:meals'           // Coming Soon
      | 'room:calendar'        // Coming Soon
      | 'person:<id>'          // themed personal page
```

Back navigation: a tiny back stack. Echo Show 15 has no hardware back button, so every drill-down has an explicit ← chevron in the view header.

The existing `mode: command_center | personal | maintenance | admin` config stays for backwards compatibility and for displays that should *boot directly into* a sub-view (e.g. a future bedroom Echo Show booting straight to a kid's themed page). The kitchen always boots to `home`.

### 3.2 The "Room" abstraction

A Room is a pluggable surface: a tile on the home page + a drill-down view + a stat-feed function.

```js
// src/card/rooms/index.js
export const ROOMS = [
  { id: 'chores',      module: choresRoom,      status: 'live' },
  { id: 'maintenance', module: maintenanceRoom, status: 'live' },  // existing data, new aesthetic
  { id: 'smarthome',   module: smarthomeRoom,   status: 'coming' },
  { id: 'meals',       module: mealsRoom,       status: 'coming' },
  { id: 'calendar',    module: calendarRoom,    status: 'coming' },
];

// each module exports:
//   label, sub, icon, accent
//   getStats(card)  → [{label, value, accent?}]
//   render(card)    → drill-down HTML  (or renderComingSoon())
```

`status` is admin-configurable (Session 7). When a room flips `coming → live`, no other code changes.

### 3.3 The "Theme" abstraction

Same pattern for personal pages:

```js
// src/card/themes/index.js
export const THEMES = {
  classic:  classicTheme,
  engineer: engineerTheme,
  baker:    bakerTheme,
  dinos:    dinosTheme,
  hp:       hpTheme,
  dbz:      dbzTheme,
};

// each theme module exports:
//   palette          (color tokens)
//   ranks            [{minXP, name, sigil}] — rank ladder for this theme
//   renderHome(card, person)     → themed personal page
//   renderStore(card, person)    → themed store
//   renderHistory(card, person)  → themed history
```

A theme is **data, not code-for-this-person**. Olivia outgrows Harry Potter → flip her `theme_key` in admin → her page transforms. Adding a 6th theme = one new file in `src/card/themes/`.

`classic` is the fallback. Anyone with no `theme_key` set gets it. **The existing personal mode doesn't disappear** — it becomes one theme among many.

### 3.4 XP, Ranks, Levels

You already track `lifetime_points` per person. That **is** XP. No new backend storage.

Each theme defines its own rank ladder (array of `{minXP, name, sigil}`):

- **DBZ:** Saibaman → Saiyan Trainee → Saiyan → Super Saiyan → SSJ2 → SSJ3 → SSJ Blue
- **HP:** First Year → Second Year → ... → Prefect → Head Student → Order of the Phoenix
- **Dinos:** Field Assistant → Junior Paleontologist → Field Lead → Curator → Dr.
- **Engineer:** Drafter → Junior Engineer → P.E. → Senior P.E. → Principal Engineer
- **Baker:** Apprentice → Line Cook → Pastry Chef → Sous Chef → Head Chef → Master Baker
- **Classic:** Level 1 → 2 → 3 ... (numeric)

Every themed personal page renders an XP bar: `lifetime_points` against next-rank threshold. Rank-ups reuse the Mission Control milestone celebration overlay.

**Deferred:** badges/achievements engine. The `history_log` is already a rich event stream — a future achievements engine can read from it. Don't build the engine in v0.6.0; just keep the event log intact.

### 3.5 Vanilla, not React

The design files are React JSX. **We don't add React.** Bundle size matters on a kitchen tablet cold-boot, and every pattern in the design (corner-bracket panels, stat strips, mission rows, streak bars, GO button, celebration overlay) maps directly to the existing template-literal Web Component idiom.

Worth borrowing as a small helper:
- `bracketed.js` — corner-frame component (used everywhere in the design)
- `icons.js` — the SVG library port from `chore-icons.jsx`

---

## 4. Accessibility & family-friendliness commitments

Concrete rules that apply to every surface built in this release.

| Rule | Where |
|---|---|
| Min tap target 56×56px on the kitchen Echo Show; GO buttons 60×60px | Mission Control, room tiles, person tiles |
| Min body font 18px on home + chores; 22px+ on themed pages | All |
| Icon + text label for every status (BREACH, MILESTONE, RESETS), never icon-or-color alone | Mission Control rows |
| Jackson's DBZ page is **icon-first** — chore name in small caption under a large icon | DBZ theme |
| Numeric streak shown next to streak-bar dots (segments could be miscounted by a kid) | Mission Control, themed pages |
| One unambiguous primary action per row — the GO button | Mission Control |
| Celebrations fire on completion (small) and milestone (large) — positive reinforcement, no scolding language | All |
| No "overdue" / "late" language on recurring chores; "BREACH" is reserved for genuine post-reset state | Mission Control |
| High-contrast color pairs against dark panels (gold, cyan, red, green) all pass WCAG AA at 18px | All |

---

## 5. Data model changes

Small, additive, backward-compatible.

### Person model

| New field | Type | Default | Purpose |
|---|---|---|---|
| `code` | string | `""` | Codename ("T-REX", "SNITCH") shown across the dashboard |
| `theme_key` | string | `"classic"` | Which theme renders their personal page |

### Chore model

| New field | Type | Default | Purpose |
|---|---|---|---|
| `icon` | string | `""` | Key into FH_ICONS library; surfaces on Mission Control rows and themed pages |

### Settings (global)

| New field | Type | Default | Purpose |
|---|---|---|---|
| `rooms_config` | dict | `{}` | Per-room `{status: 'live'|'coming'|'hidden'}` overrides |
| `weather_entity` | string | `""` | HA weather entity to surface in header (e.g. `weather.home`) |
| `today_calendar_entities` | list | `[]` | Calendar entities for "today" strip when calendar room ships |

### Sensors

- `sensor.family_hub_needs_attention.people[*]` — add `code`, `theme_key`, ensure `lifetime_points` present
- `sensor.family_hub_claimable_tasks.all_tasks[*]` — add `icon`
- New: `sensor.family_hub_today` — surfaces today's schedule items. Initially empty list / placeholder; populated when calendar room ships. Defining it now avoids a sensor add mid-flight.

### Migration

- Existing people with no `theme_key` → default `"classic"`.
- Existing chores with no `icon` → render with a category-color dot (graceful fallback).
- No destructive migration; admin fills in `theme_key`, `code`, and chore `icon` values over time.

---

## 6. File layout

Extends the current `modes-*.js` pattern.

```
src/card/
  FamilyHubCard.js        # shell — adds _view state + navigation
  constants.js            # add ROOM_IDS, THEME_KEYS
  css.js                  # add @import for Bricolage/JetBrains/Manrope; new tokens
  utils.js
  dispatch.js             # add nav actions
  editor.js               # add room toggles, theme/code/icon pickers
  modals.js
  icons.js                # NEW — FH_ICONS library + choreIcon() helper
  bracketed.js            # NEW — corner-frame helper

  modes-home.js           # NEW — Command Center Home page
  modes-chores.js         # renamed from modes-cc.js — Mission Control rebuild
  modes-maintenance.js    # unchanged behavior; gains nav header
  modes-admin.js          # unchanged + new section: Hub Layout
  modes-personal.js       # becomes dispatcher → themes/<key>.js

  rooms/
    index.js              # ROOMS registry
    chores.js             # delegates to modes-chores.js
    maintenance.js        # drill-down + coming-soon helper
    smarthome.js          # coming-soon
    meals.js              # coming-soon
    calendar.js           # coming-soon

  themes/
    index.js              # THEMES registry
    classic.js            # fallback / restyled existing personal mode
    engineer.js
    baker.js
    dinos.js
    hp.js
    dbz.js
    _shared.js            # XP bar, rank bar, themed-task-row primitives
```

`rooms/` and `themes/` are the **extensibility seams**. Everything you'll want to add over the next 2 years drops into one of these two folders.

---

## 7. Session plan

Each session is independently shippable to Samba and testable.

### Session 1 — Foundations
- Backend: add `code`, `theme_key` to person; `icon` to chore. Update config_flow, services, sensors.
- Card: `icons.js` (port from design), `bracketed.js` helper, font loading in `css.js`.
- Admin UI: codename + theme dropdown on Edit Person; icon picker on chore editor.
- Migration: defaults applied to existing data; no destructive changes.
- **Ship goal:** existing UI works identically. New fields just exist.

### Session 2 — Command Center Home
- Build `modes-home.js`: header, agent tiles row, room tiles grid, today strip.
- Build `rooms/index.js` registry: `chores=live`, `maintenance=live`, others=`coming`.
- Wire navigation: tap person tile → `_view='person:<id>'`; tap room tile → `_view='room:<id>'`.
- Today strip: weather entity (if configured) + empty schedule list + approval count.
- Coming-soon rooms render polished placeholders.
- **Ship goal:** Home loads, taps navigate. Person pages still show current personal mode. Chores room still shows old flat CC view.

### Session 3 — Mission Control (Chores HQ)
- Rewrite `modes-chores.js` as Mission Control: header strip, agent roster filter, breach + category groups, mission rows with streak bars + points medal + GO button, Intel Alerts panel, Open Ops panel, footer status.
- Completion animation + milestone celebration overlay.
- Daily-penalty-accruing red flag on rows where `daily_penalty_after_days` is firing.
- Multi-day weekly chores show weekday pattern chip.
- Penalty pause → "OPS PAUSED" ribbon on header.
- **Ship goal:** Chores HQ matches the design. Graceful fallback when chores have no icon.

### ~~Session 4 — Themes foundation + first theme~~ COMPLETE (2026-05-14)
- ✓ `themes/index.js` + `themes/_shared.js` (XP bar, rank utilities: `getRank`, `getNextRank`, `htmlXPBar`).
- ✓ `themes/classic.js` — full port of personal mode. Ranks Level 1–7. tint `#1A2538`, sigil `◇`. `handlesNavigation: false`.
- ✓ `themes/engineer.js` — blueprint cyanotype aesthetic for Jim. Ranks Drafter → Principal Eng. tint `#1B3550`, sigil `⟁`. `handlesNavigation: true` (has own `← HOME` nav strip). Blueprint grid overlay, work order rows, dimensional streak callout, amber pts stamp, tilted MARK COMPLETE stamp button, drawing title block footer.
- ✓ `modes-personal.js` → thin dispatcher only.
- ✓ Home agent tiles: theme sigil watermark + rank title sub-label + dual PTS/OPEN stat block.
- ✓ Polish: font sizes bumped ~20-25% throughout engineer theme for Echo Show readability.
- **Ship goal met.** Jim's tile opens Engineer page; everyone else gets `classic`.

### ~~Session 5 — Remaining themes + visual character pass~~ COMPLETE (2026-05-15)
- ✓ `baker.js` (Shannon), `dinos.js` (Spencer), `hp.js` (Olivia), `dbz.js` (Jackson) — all light/warm aesthetics per design reference files. Each has decorative character from design: Baker (double border, step circles, proof dots), Dinos (corner tapes, specimen tags SP-001, stamps, footprint streak, 🦕 watermark), HP (leather frame, ❦ corner ornaments, period-number column, wax seals, star streak, owl footer), DBZ (sky-to-orange gradient, halftone overlay, comic-card borders, energy auras, lightning streak, power-up bar).
- ✓ Per-theme rank ladders. All themes: category grouping (Overdue first, then admin-defined order) + 6-task cap removed.
- ✓ **Unified kid-mode renderer** in `_shared.js` (`renderKidMode()`): completely separate render path (not CSS overrides), DBZ-style big-icon-grid layout using each theme's `KID_PALETTE` CSS vars. All 6 themes delegate to it when `person.child_mode === true`. Replaces the earlier `.fh-page--large` font-size-only approach.
- ✓ Visual icon picker in chore editor (grid replaces text input). `child_mode` per-person toggle wired end-to-end: `data_store.py` → `sensor.py` → admin UI → dispatch → all 6 theme renders.
- ✓ `groupByCategory()` shared helper in `_shared.js`. Design reference JSX files saved to `docs/design-reference/`.
- ✓ **CSS specificity bug fixed:** blanket `> *` `position:relative` rules displaced watermark elements (HP ⚡ watermark = ~112px gap at top). Fixed with explicit named content selectors for z-index promotion.
- ✓ **Proportion fixes:** All decorative sizes scaled down ~40-60% from 1920px design-reference proportions to ~400px card width (HP frame, corners, wax seal; Dinos tape strips).
- ✓ Bundle: 346.6 KB. Deployed to Samba (JS + Python).

### Session 6 — Home Care drill-down + remaining coming-soon scaffolds
- `rooms/maintenance.js`: drill-down renders existing `sensor.family_hub_maintenance_due` in the new aesthetic. Flip to `live`.
- `rooms/smarthome.js`: coming-soon screen describing planned controls (Lights, Climate, Irrigation).
- `rooms/meals.js`: coming-soon screen describing planned features (tonight's plan, grocery list, weekly menu).
- `rooms/calendar.js`: coming-soon screen. Notes that it will power the today-strip when live.
- **Ship goal:** all 4 future rooms have polished coming-soon screens that *describe what they'll do*. Home Care is genuinely live.

### Session 7 — Admin, polish, release
- Admin → new "Hub Layout" section: toggle room status, set weather entity, set today_calendar_entities.
- Admin → per-person theme dropdown + codename field polish.
- Admin → per-chore icon picker (gallery dialog).
- Bug-bash pass on real Echo Show.
- Bump `manifest.json`, `hacs.json`, card `VERSION` to 0.6.0.
- Cut GitHub tag → HACS release.

---

## 8. How v0.5.0 work surfaces in v0.6.0

| v0.5.0 feature | Where it lives in v0.6.0 |
|---|---|
| Streaks | Streak bar on Mission Control rows; large flame badge on themed personal pages; milestone celebration overlay |
| Allowance | Stat line on home person tile ("+50/wk"); recurring stipend indicator on themed page |
| Notifications | No UI surface needed — already push. Intel Alerts panel mirrors the same approval queue. |
| Multi-day weekly recurrence | `M·W·F` chip on mission row |
| Daily penalty threshold | Red "ACCRUING −Npts" flag on mission row when active |
| Claimable subtypes (FCFS/multi) | Already in Mission Control's Open Ops panel via `recurrence` field |
| Penalty pause | Home header shows "PAUSED" pill when global pause is on; affected person tiles dim |
| Category labels | Section headers on Mission Control (admin-ordered, same logic as today) |

---

## 9. Deferred beyond v0.6.0

Tempting but out of scope:

- **Achievements/Badges engine** — wait until ranks have lived in the wild for a while.
- **Per-theme audio cues** via `alexa_media_player` — fun rabbit hole, defer.
- **Smart Home room actually doing things** — needs design conversation on which HA areas/entities to surface and whether kids can control them.
- **Meals room actually doing things** — own design pass; probably v0.7.0 headline feature.
- **Calendar room actually doing things** — needs to pick CalDAV vs HA Local Calendar vs Google; probably v0.8.0 headline.
- **Chore rotation** (existing deferred wish) — natural fit for chore editor in a later release.
- **Photo evidence for approvals** — defer.
- **Goal tracking on store items** — natural fit for themed personal pages; build after themes settle.

---

## 10. Future arc

Where this is going, so v0.6.0 architecture supports it:

- **v0.6.x** — Theme polish, Home Care drill-down genuinely useful, possible achievements engine.
- **v0.7.0** — **Meals room ships.** Weekly menu builder, grocery list, "what's for dinner" on the home strip.
- **v0.8.0** — **Calendar integration ships.** Today strip pulls real events; per-person schedule on themed pages; chore reminders inline with calendar items.
- **v0.9.0** — **Smart Home room ships.** Curated controls for the kitchen-display use case. Permission-gated for kids.
- **v1.0.0** — Stable public release. Theme builder UI (parents can author themes without editing code).

The architecture choices in v0.6.0 — rooms registry, themes registry, `lifetime_points`-as-XP — are what make each of those a single-folder addition rather than a refactor.

---

## 11. Risks to watch

- **Bundle size.** All 5 themed renderers + icon library will grow `family-hub-card.js`. esbuild handles it fine; watch Echo Show 15 cold-boot time. If it gets bad, lazy-load themes by `theme_key`.
- **Font flash on cold boot.** Use `font-display: swap` and good system-font fallbacks. The existing retry timer for sensor data should keep the screen from looking broken during font load.
- **Existing data.** Anyone on v0.5.0 loads v0.6.0 with no `theme_key` → defaults to `classic`. No migration beyond admin pointing each person at their theme.
- **Icon-less chores.** Every existing chore has no `icon` until admin fills it in. Fallback is a category-color dot. Nothing breaks.
- **Pre-reader regression.** Whenever a Mission Control or DBZ change lands, test it standing 8 feet from the Echo Show with Jackson's eyes — can he tell what to tap?

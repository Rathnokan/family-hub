# Home Care Room — Developer Handoff

**Surface:** Family Hub custom card → Home Care **room** (family-facing daily-use screens).
**Not** the admin panel. No nav rail, no sub-tab config shell.
**Source prototype:** `Home Care Room.dc.html`
**Repo record:** `github.md` — `Rathnokan/family-hub` @ `main`
**Implementation target:** vanilla JS building HTML strings against the `--fh-*` custom-property theme system. No React, no framework.
**Dashboard layout:** **B (Triage board) only.** Layouts A / C / D exist in the prototype for reference and are explicitly *not* specified here.

**Naming:** "Home Care" everywhere. Never "Home Maintenance".

---

## 0. Reading order & conventions

1. §1 Tokens — includes the **NEW vs EXISTING** table. Create the NEW ones first; nothing else compiles without them.
2. §2 Component inventory — every named part with all variants.
3. §3 Screens — layout, spacing, responsive behavior.
4. §4 The parent gate — documented as a standalone hub-wide pattern.
5. §5 State gallery — every state rendered explicitly.
6. §6 Interaction table — every tappable element.
7. §7 Icons — inline SVG source, new vs lifted.
8. §8 Deliberate ambiguities.
9. §9 Screenshot index.

**Conventions used throughout:**

- Every color, size, radius, gap is a `--fh-*` **property name**. Literal hex appears only in §1 where a NEW token's value is being defined.
- Type sizes **never** hardcode px. Everything multiplies `--fh-text-scale` (user sets 0.9 / 1.0 / 1.25 / 1.5). Nothing goes below `--fh-text-xs` — that is the 12px floor.
- Pixel numbers that *do* appear (e.g. `min-height:44px`, `border:1.5px`) are structural, not typographic: hit targets, hairlines, icon boxes, fixed grid cells. Those are safe to hardcode.
- Layout is **flex/grid with `gap`** everywhere. No margin-based spacing between siblings, no inline-flow spacing.
- The card must survive a light HA theme. Nothing relies on a specific background hex for contrast — all structural color comes through HA variables with dark fallbacks.

---

## 1. Design tokens

### 1.1 The audit table — EXISTING vs NEW

`EXISTING` = already in the repo's `:host` token block (`src/card/css/part1.js`). `NEW` = invented for this design; **you must define it**.

| Property | Status | Value / definition | Where used in Home Care |
|---|---|---|---|
| `--fh-bg` | EXISTING | `var(--ha-card-background, var(--card-background-color, #1c1c1e))` | frame bg, inset wells, chip backgrounds inside surfaces |
| `--fh-surface` | EXISTING | `var(--secondary-background-color, #2c2c2e)` | every card, tile, row, popover, stat strip |
| `--fh-border` | EXISTING | `var(--divider-color, rgba(255,255,255,.12))` | hairlines, chip outlines, dashed gate borders |
| `--fh-text` | EXISTING | `var(--primary-text-color, #f5f5f7)` | body copy, task names, filled PIN dots |
| `--fh-text-sec` | EXISTING | `var(--secondary-text-color, #aeaeb2)` | meta lines, section headers, mono labels, masked values |
| `--fh-accent` | EXISTING | `var(--primary-color, #7F77DD)` | **the gate** (all five components), points chips, upcoming badges, stat numbers, back buttons |
| `--fh-overdue` | EXISTING | `#ff453a` | overdue badges/borders, out-of-stock, fund RED, Skip confirm |
| `--fh-warning` | EXISTING | `#ff9f0a` | due-today badge, low-stock, fund AMBER, seasonal/monsoon band, inspect "Needs work" |
| `--fh-success` | EXISTING | `#30d158` | Complete buttons, fund GREEN, in-stock, completion history dots |
| `--fh-overdue-bg` | EXISTING | 12% tint of overdue | overdue badge fills, blocked banners |
| `--fh-warning-bg` | EXISTING | 12% tint of warning | module identity tile, seasonal band, inspect branch card |
| `--fh-success-bg` | EXISTING | 12% tint of success | Complete button fill on board cards |
| `--fh-radius` | EXISTING | `12px` | frame, board columns, popovers, modals |
| `--fh-radius-sm` | EXISTING | `8px` | cards, tiles, rows, buttons, inputs |
| `--fh-radius-chip` | EXISTING | `20px` | pills, chips, stage tags |
| `--fh-gap` | EXISTING | `12px` | between major blocks (columns, sidebar↔main) |
| `--fh-gap-sm` | EXISTING | `8px` | within blocks (row↔row, icon↔label) |
| `--fh-pad` | EXISTING | `16px` | screen-level padding, modal padding |
| `--fh-pad-sm` | EXISTING | `12px` | card interior padding |
| `--fh-text-xs` | EXISTING | `calc(.75rem * var(--fh-text-scale))` — **12px floor** | mono badges, timestamps, section headers, gate labels |
| `--fh-text-sm` | EXISTING | `calc(.875rem * …)` | secondary copy, button labels, meta |
| `--fh-text-base` | EXISTING | `calc(1rem * …)` | body, primary action labels |
| `--fh-text-md` | EXISTING | `calc(1.125rem * …)` | card titles, modal titles, cost figures |
| `--fh-text-lg` | EXISTING | `calc(1.375rem * …)` | screen titles ("Home Care", "July 2026") |
| `--fh-text-xl` | EXISTING | `calc(1.75rem * …)` | big stat numbers, board column counts |
| `--fh-text-2xl` | EXISTING | `calc(2.25rem * …)` | *not used in layout B* (Layout C hero only) |
| `--fh-text-scale` | EXISTING | user-set `0.9 / 1.0 / 1.25 / 1.5` | multiplies the whole type scale |
| `--fh-font-heading` | EXISTING | `"Bricolage Grotesque"` | screen titles, modal titles, task name in detail header |
| `--fh-font-mono` | EXISTING | `"JetBrains Mono"` | **all** numbers, badges, timestamps, uppercase section headers |
| `--fh-font-body` | EXISTING | `"Manrope"` | everything else |
| **`--fh-accent-bg`** | **NEW** | `color-mix(in srgb, var(--fh-accent) 12%, transparent)` | **gate surfaces only** — parent-session strip background, PIN sheet icon halo. Follows the existing `--fh-overdue-bg` / `--fh-warning-bg` / `--fh-success-bg` convention exactly, which is why it should be a token and not an inline `color-mix`. |
| **`--fh-module`** | **NEW** *(confirm)* | `#ff9f0a` | Home Care **module identity** only: the wrench tile, the how-to step numbers, the "Home Care · pinned" category on the chores board. The brief named this value but not a token; `rooms/index.js` carries `#ff9f0a` as the room accent. If the repo already exposes a per-room accent variable, **use that instead and delete `--fh-module`**. |

**Declared but unused — do NOT add:** `--fh-gap-xs`, `--fh-pad-xs`. They exist in the prototype's `:root` block and are referenced nowhere. Dropped deliberately.

### 1.2 Two rules about color that matter

**Rule 1 — `--fh-module` is identity, never state.** `#ff9f0a` is byte-identical to `--fh-warning`, which is already carrying the *due-today* semantic on these same screens. Any element whose color communicates urgency, state, or interactivity must use the semantic token (`--fh-warning`, `--fh-overdue`, `--fh-accent`), never `--fh-module`. `--fh-module` appears in exactly three places (§7 icon table + step numbers + pinned chore category) and always as branding.

**Rule 2 — the gate is `--fh-accent`, and this is deliberate.** Earlier drafts used `--fh-module` amber. That was wrong for three reasons: amber collides with the due-soon semantic; `#ff9f0a` is not unique to Home Care (Meals uses the identical accent); and a hub-wide component must not wear any one module's color. `--fh-accent` is the card's *interactive* color and is theme-adaptive via `--primary-color`.

Also **not** `--fh-overdue`: see §4.6 for why red is the wrong read for this pattern.

---

## 2. Component inventory

Every component is named. Names prefixed `fh-` are proposed CSS class / builder-function names.

### 2.1 Gate components (hub-wide — see §4)

| Name | What it is | Variants |
|---|---|---|
| `fh-protected-value` | Inline masked figure replacing a number in place | `masked` (mono `•••`, `--fh-text-sec`, `letter-spacing:.12em`) · `revealed` (the real value, normal styling) |
| `fh-protected-block` | Tile-sized locked panel replacing a whole card | `locked` (1.5px **dashed** `--fh-border`, padlock icon at `--fh-text-sec`, title row, masked value row, accent CTA label) · `revealed` (the real tile) · `compact` (single-line variant for the board footer) |
| `fh-protected-action` | Button that keeps its label but cannot fire | `locked` (1.5px **dashed** `--fh-border`, label at `--fh-text-sec`, leading padlock) · `enabled` (normal button styling) |
| `fh-pin-sheet` | Modal PIN entry | `idle` · `checking` · `error` |
| `fh-parent-session` | Unlocked-state indicator strip | `visible` (restricted account, unlocked) · `hidden` (admin account, or locked) |
| `fh-session-expired` | Bottom banner on re-lock | single variant, auto-dismiss ~8s |

### 2.2 Badges & pills

| Name | Purpose | Variants |
|---|---|---|
| `fh-state-badge` | Task state, mono, `--fh-text-xs`, `padding:4px 9px`, `border-radius:10px` | `scheduled` (date text, `--fh-text-sec` on `--fh-bg`) · `upcoming` (`in 12d`, `--fh-accent`) · `due` (`TODAY`, dark text **on** solid `--fh-warning`) · `overdue` (`4d late`, `--fh-overdue` on `--fh-overdue-bg`) · `snoozed` (`back Aug 9`, `--fh-text-sec` on `--fh-bg`, row gets **dashed** left border + `opacity:.55`) · `disabled` (`OFF`, `--fh-text-sec` on `--fh-bg`, row `opacity:.42`) |
| `fh-stage-tag` | inspect→plan→do position, mono, `--fh-radius-chip`, 1px outline in the stage color | `INSPECT` (`--fh-text-sec`) · `PLAN` (`--fh-warning`) · `DO` (`--fh-success`) |
| `fh-points-chip` | Point offer | `offered` (`+5 pts`, `--fh-accent` on 14% accent tint) |
| `fh-stock-badge` | Inventory level | `ok` (`4 on hand`, success) · `low` (warning) · `out` (`OUT`, overdue) |
| `fh-fund-dot` | Sinking-fund rollup dot, 8–9px circle | `green` `--fh-success` · `amber` `--fh-warning` · `red` `--fh-overdue` |
| `fh-fund-status` | Fund status pill, mono `--fh-text-xs` | `ON TRACK` · `BEHIND $310` · `SHORT $5.4k` — colored to match its dot |
| `fh-surprise-chip` | Failure-cost risk | `low` · `medium` · `high` (high = overdue coloring) |
| `fh-effort-chip` | Duration / difficulty / cost, mono on `--fh-bg` with `--fh-border` | one per fact |
| `fh-season-chip` | Seasonal window marker | `monsoon` (warning) · others |

### 2.3 Rows, cards, tiles

| Name | Purpose | Notes |
|---|---|---|
| `fh-stat-strip` | The three-up count row (overdue / this week / this month) | `--fh-surface`, `--fh-radius-sm`, `padding:12px var(--fh-pad)`, three equal flex children split by 1px × 32px `--fh-border` dividers. Numbers `--fh-text-xl` mono 800. Matches the existing card's stat-strip pattern. |
| `fh-board-column` | One triage column | bg `color-mix(in srgb, <stateColor> 7%, var(--fh-bg))`, 1px border in the state color at ~30%, `--fh-radius`, `padding:var(--fh-pad-sm)`, `gap:var(--fh-gap-sm)`. Header = count (`--fh-text-xl` mono) + uppercase label, both in the state color. |
| `fh-task-card` | Task card inside a board column | `--fh-surface`, 1px `--fh-border`, `--fh-radius-sm`, `padding:var(--fh-pad-sm)`, `gap:6px`. Hover: `border-color:var(--fh-accent)`. Content order: category (mono xs upper) → name (`--fh-text-md` 700) → meta row (effort · stage · points) → action row. |
| `fh-task-row` | Compact list row (schedule results, week columns) | 3px solid left border in the state color; `dashed` when snoozed. |
| `fh-section-header` | Uppercase mono `--fh-text-xs`, `letter-spacing:.09em`, `--fh-text-sec` | The house section-header pattern. Used on every card. |
| `fh-costs-card` | DIY-vs-pro comparison | Two equal cards; the one matching the task's `default_mode` gets 1.5px `--fh-accent` border + 12% accent fill. Below: one line of `modeNote`. Gate target — see §4.3. |
| `fh-schedule-card` | schedule_mode explainer | `fh-state-badge`-styled tag (`SEASON-LOCKED` warning / `FLOATS FROM COMPLETION` accent) + prose + a two-bar drift diagram. |
| `fh-reminder-card` | Per-task reminder override | `inherits` · `overridden` (see §5.7) |
| `fh-vendor-card` | Pro contact | Only rendered when the task has a vendor. |
| `fh-history-row` | One history entry | `completion` (solid `--fh-success` dot) · `skipped` (hollow **dashed** `--fh-text-sec` dot, italic `--fh-text-sec` text) |
| `fh-product-row` | Inventory item | Name + `fh-stock-badge` + par-level bar + "used by" line + optional reorder hint. `out` variant gets a 1px `--fh-overdue` @35% card border. |
| `fh-seasonal-banner` | Dismissible recommendation | warning-tinted, `--fh-radius`, chip + prose + action + dismiss. |
| `fh-blocked-banner` | "upcoming task + not enough stock" | overdue-tinted; the module's hard-stop state. |
| `fh-kid-chore-row` | Chores-board row | `pending` · `done` (`opacity:.5`, `line-through`) |
| `fh-pinned-category` | Home Care block on the chores board | 1.5px `--fh-module` @50% border, `--fh-warning-bg` fill, 3px `--fh-module` left border on its row. The only place the module accent appears outside the room. |

### 2.4 Buttons

| Name | Purpose | Min height |
|---|---|---|
| `fh-btn-primary` | Complete / Log inspection / confirm | 48px (52px in modals) |
| `fh-btn-secondary` | Snooze / Reschedule / Details / Open | 48px |
| `fh-btn-quiet` | Skip, Cancel, "Back to household setting" | 44px |
| `fh-btn-card` | Complete / Open inside a task card | 40px |
| `fh-btn-icon` | Back chevron, dismiss × | 44 × 44px |
| `fh-pin-key` | PIN keypad key | 52px |

**Hit-target floor: 44px.** The only exceptions are the in-card `fh-btn-card` pair at 40px and the session strip's "Lock now" at 34px — both are secondary to a larger primary target on the same surface. Everything a kid or a wet-handed adult taps on a wall tablet is ≥44px.

### 2.5 Modals & popovers

| Name | Purpose | Variants |
|---|---|---|
| `fh-modal-complete` | Completion capture | single, two-tap default |
| `fh-modal-inspect` | Inspection result | `ask` (All good / Needs work) · `plan` (plan builder) |
| `fh-modal-assign` | Point offer | single |
| `fh-pin-sheet` | see §2.1 | `idle` / `checking` / `error` |
| `fh-popover-snooze` | Quick presets | single |
| `fh-popover-reschedule` | One-date picker | single |
| `fh-popover-skip` | Optional reason | single |

**Popover geometry (all three):** absolutely positioned `bottom: calc(100% + 8px); left: var(--fh-pad)` relative to the action bar, `--fh-surface`, 1px `--fh-border`, `--fh-radius`, `box-shadow:0 10px 34px rgba(0,0,0,.5)`, `animation: fh-pop .16s ease-out`. Width `auto`/`min-width:230px` for snooze, `290px` for reschedule and skip. Only one open at a time — opening any one closes the other two.

**Modal geometry:** overlay `position:absolute; inset:0; background:rgba(0,0,0,.55)`, centered, `padding:var(--fh-pad)`. Panel `--fh-bg`, 1px `--fh-border`, `--fh-radius`, `box-shadow:0 8px 32px rgba(0,0,0,.45)`, `animation: fh-pop .18s ease-out`. Max width: 340px (PIN), 520px (complete/inspect/assign).

**z-order — get this right:**
```
fh-pin-sheet            120
fh-modal-*              100
fh-parent-session        60   (in-flow strip, not an overlay)
fh-session-expired      in-flow, bottom of frame column — NOT an overlay
popovers                 20   (scoped inside the action bar)
```
`fh-session-expired` is a **flex sibling at the end of the frame column**, not an absolutely-positioned toast. It pushes screen content up. This is load-bearing: as an overlay it covered the entire task-detail action bar for its full display duration, contradicting its own copy ("Nothing you were doing was lost"). Do not reimplement it as a toast.

---

## 3. Screens

### 3.0 Frame & responsive model

```
Tablet (primary):  1280 × 800   Echo Show 15, landscape, wall-mounted
Phone (secondary):  420 × 860
```

The frame is `display:flex; flex-direction:column; overflow:hidden; position:relative; container-type:inline-size`.

Direct children, in order:
1. `fh-parent-session` — `flex-shrink:0`, 49px tall, conditional
2. the active screen — **`flex:1; min-height:0`**
3. `fh-session-expired` — `flex-shrink:0`, conditional
4. modals / PIN sheet — `position:absolute; inset:0`

> **`flex:1; min-height:0` on the screen, never `height:100%`.** With `height:100%` the screen resolves against the whole frame and overflows by the height of whatever strip is showing.

**The single responsive switch** is tablet ↔ phone, driven by container width:

| Aspect | Tablet 1280 | Phone 420 |
|---|---|---|
| main axis | `row` | `column` |
| sidebar width | `330px` | `100%` |
| board columns | 3 across, each `flex:1` | stacked, each `flex:0 0 auto` |
| column inner list | `overflow-y:auto; min-height:0` | `overflow:visible; min-height:auto` |
| scrolling | per-column | one outer scroller owns it |
| header controls | icon + text label | **icon only**, `aria-label` + `title` retain the name |
| month grid cell height | 68px | 44px |

> **The phone rule that bit us twice:** on phone, column wrappers and their inner lists must size to content (`flex:0 0 auto`, `overflow:visible`). If they keep `flex:1` + `overflow-y:auto`, the columns fight the outer scroller and content paints over the footer. Applies to any stacked multi-column layout.

Large `--fh-text-scale` (1.25 / 1.5) reflow is **owned by the integration**, not specified here.

---

### 3.1 Screen 01 — Dashboard (Layout B · Triage board)

```
┌──────────────────────────────────────────────────────────────┐
│ [fh-parent-session]                    conditional, 49px     │
├──────────────────────────────────────────────────────────────┤
│ ▨ 34px  Home Care                        [Find] [Schedule]   │  68px
│         SUNDAY · JUL 26 · TUCSON                             │
├──────────────────────────────────────────────────────────────┤
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                   │
│  │ 2 OVERDUE │ │ 3 DUE     │ │ 3 COMING  │   flex:1 each     │
│  │           │ │   TODAY   │ │  THIS WEEK│   gap: --fh-gap   │
│  │ [card]    │ │ [card]    │ │ [card]    │                   │
│  │ [card]    │ │ [card]    │ │ [card]    │   scroll per col  │
│  └───────────┘ └───────────┘ └───────────┘                   │
│  ┌─────────────┐┌─────────────┐┌─────────────┐               │
│  │ set-aside   ││ BLOCKED     ││ M · assigned│  footer 3-up  │
│  └─────────────┘└─────────────┘└─────────────┘  flex-shrink:0│
└──────────────────────────────────────────────────────────────┘
```

**Header** — `display:flex; align-items:center; gap:var(--fh-gap); padding:var(--fh-pad) var(--fh-pad) var(--fh-gap-sm)`.
- Module tile: 34 × 34px, `--fh-radius-sm`, `--fh-warning-bg` fill, 19px filled wrench at `--fh-module`. Identity mark.
- Title block: `flex:1; min-width:0`. "Home Care" — `--fh-font-heading`, `--fh-text-lg`, 800, `line-height:1.1`, `letter-spacing:.02em`. Sub: `--fh-font-mono`, `--fh-text-xs`, 700, `letter-spacing:.09em`, uppercase, `--fh-text-sec`.
- `Find` and `Schedule` buttons: `--fh-surface`, 1.5px `--fh-border`, `--fh-radius-sm`, `padding:8px 14px`, `min-height:44px`, `flex-shrink:0`, stroke icon + label. On phone the label drops; `aria-label`/`title` keep it.

**Board region** — `flex:1; min-height:0; display:flex; flex-direction:column; gap:var(--fh-gap); padding:0 var(--fh-pad) var(--fh-pad); overflow-y:auto`.

Column wrapper: `flex:1; min-height:0; display:flex; gap:var(--fh-gap); align-items:stretch`.

Three columns, `fh-board-column`, keyed to state color: Overdue `--fh-overdue`, Due today `--fh-warning`, Coming this week `--fh-accent`.

`fh-task-card` content order and spacing:
```
category      mono --fh-text-xs 700 .08em upper --fh-text-sec
name          --fh-text-md 700 line-height:1.25 text-wrap:pretty   (margin-top:2px)
              ⟨fh-state-badge floats right, aligned to top⟩
meta row      gap:6px flex-wrap — effort/cost line · fh-stage-tag? · fh-points-chip?
action row    gap:6px margin-top:2px — [Complete flex:1] [Open]
```
The effort/cost line is `"10 min · Easy · $20 DIY"` — joined with ` · `, mono `--fh-text-xs`, `--fh-text-sec`. **The cost segment is a gate target** (§4.3): when locked it renders `•••`.

**Footer** — `display:flex; gap:var(--fh-gap); flex-shrink:0`, three equal tiles, `--fh-surface`, `--fh-radius-sm`, `padding:10px var(--fh-pad-sm)`:
1. **Set-aside rollup** — three `fh-fund-dot`s + one-line summary. *Gate target.* Locked → `fh-protected-block` `compact`.
2. **Blocked** — 1px `--fh-overdue` @30% border. "Anode rod — none in the garage" + `Supplies` button.
3. **Assigned now** — 26px avatar + "Mateo · mow · 15 pts" + `Board` button.

**Phone:** everything stacks; the three columns become three full-width sections in the one outer scroller; footer tiles stack below.

---

### 3.2 Screen 02 — Schedule (also: how you find a task that isn't due)

Answering *"when is my termite inspection due?"* is this screen's job. With 97 tasks and the Library living in admin, search is the room's only path to a task that isn't on the board.

**Header** — back chevron (44 × 44) · "July 2026" (`--fh-text-lg` heading) + "9 TASKS IN THE NEXT 30 DAYS" · Month/Week segmented control (`--fh-surface` track, `padding:3px`, active pill `--fh-bg`, each ≥40px).

**Scroll body** — `padding:0 var(--fh-pad) var(--fh-pad); gap:var(--fh-gap)`.

1. **Find bar** — `--fh-surface`, 1.5px `--fh-border`, `--fh-radius-sm`, `min-height:48px`, `padding:0 var(--fh-pad-sm)`. Stroke magnifier at `--fh-text-sec` + transparent borderless input (`--fh-text-base`, 600). Placeholder: `Find any task — try "termite"`.
   - **idle** → below it, the browse row: `All 97 · browse` label + one chip per category with its count (HVAC 8, Plumbing 14, Electrical · Safety 9, Exterior · Roof 11, Landscape · Yard 13, Appliances 12, Pest 4, Interior 26).
   - **active** → match count + clear ×; results replace the browse row. Max 6 rows shown.
   - Result row: name (`--fh-text-base` 700) + `category · cadence` (mono xs) on the left; **next due date** (mono `--fh-text-sm` 700) + `fh-state-badge` on the right. Whole row taps to task detail. `opacity:.45` when the task is `disabled`.
   - **The badge must not duplicate the date.** For a `scheduled` task the state badge *is* the due date, so it falls back to the relative form: `Mar 15 '27` + `in 232d`. Units are compact everywhere (`in 232d`, `19d late`, `today`) to match the existing badge helper.
2. **Month grid** — 7 columns, `gap:4px`, cell 68px tablet / 44px phone. Day number mono; task chips stacked inside. Today's cell gets an `--fh-accent` outline.
3. **Year-at-a-glance seasonal strip** — 12 month cells with the Tucson rhythm banded across them: **monsoon window Jun 15 – Sep 30** (warning band), **pre-emergent Feb & Oct**, **post-monsoon roof check Oct 12**, evap cooler startup Apr–May, irrigation quarterly Jan/Apr/Jul/Oct.

---

### 3.3 Screen 03 — Task detail

```
┌──────────────────────────────────────────────────────────────┐
│ ‹  PLUMBING · GARAGE  [19d late] [PLAN]        19 days late   │ header
│    Inspect water heater anode rod              every 1 year   │
├──────────────────────────────────────────────────────────────┤
│ ①INSPECT ──────── ②PLAN ──────── ③DO         stage rail (cond)│
├──────────────────────────────────────────┬───────────────────┤
│ How it's done                            │ Cover it or do it │
│ Supplies · what's on the shelf           │ Scheduling        │
│ History                                  │ Reminder          │
│                              flex:1      │ Who we call (cond)│
│                                          │        330px      │
├──────────────────────────────────────────┴───────────────────┤
│ [Log inspection] [Snooze] [Reschedule] [Skip] [Assign·5 pts] │ action bar
└──────────────────────────────────────────────────────────────┘
```

**Header** — `padding:var(--fh-pad) var(--fh-pad) var(--fh-gap-sm)`, 1px `--fh-border` bottom, `flex-wrap:wrap`. Back chevron · category + `fh-state-badge` + `fh-stage-tag` · task name (`--fh-font-heading`, `--fh-text-lg`, 800) · right-aligned due label (`--fh-text-md` mono) + cadence (mono xs).

**Stage rail** — only for `workflow: inspect_plan_do`. Full-width `--fh-surface` band, `padding:10px var(--fh-pad)`. Three nodes, each `flex:1`: 22px numbered circle + label (mono xs upper) + sub-caption, joined by 2px connector lines. Complete stages get filled dots and colored connectors; the current stage is outlined in its stage color; future stages are `--fh-text-sec` at low emphasis.

**Body** — `flex:1; min-height:0; overflow-y:auto; padding:var(--fh-pad); display:flex; gap:var(--fh-gap); align-items:flex-start`.

*Main column (`flex:1; min-width:0`), cards separated by `gap:var(--fh-gap)`:*
- **How it's done** — numbered steps; number is mono `--fh-text-xs` 700 at `--fh-module`, `gap:10px`, text `--fh-text-sm`, `line-height:1.5`, `text-wrap:pretty`. Footer chip row: duration · effort · `fh-surprise-chip`.
- **Supplies · what's on the shelf** — one row per linked product on `--fh-bg`, name + `fh-stock-badge`. Live stock, not a static list.
- **History** — `fh-history-row` per entry: dot · date (mono, 64px fixed) · who · detail. Completion vs skipped rendering in §5.8.

*Sidebar (`330px` / `100%`):*
- **Cover it or do it** (`fh-costs-card`) — DIY and PRO side by side; default mode highlighted. *Gate target.*
- **Scheduling** (`fh-schedule-card`) — the module's signature explanation. `SEASON-LOCKED` (warning) vs `FLOATS FROM COMPLETION` (accent), prose, and the two-bar drift diagram: "on time" vs "5d late". Season-locked copy: *"Same landing date either way — the season doesn't wait."* From-completion: *"Five days late, five days later next time."*
- **Reminder** (`fh-reminder-card`) — §5.7.
- **Who we call** — vendor card, conditional.

**Action bar** — `flex-shrink:0`, 1px `--fh-border` top, `--fh-bg`, `padding:var(--fh-pad-sm) var(--fh-pad)`, `display:flex; gap:var(--fh-gap-sm); flex-wrap:wrap; position:relative` (the popovers anchor to it).

Order: **primary** (`Complete` for simple, `Log inspection` for inspect — `flex:1; min-width:150px`, `--fh-success` fill) · `Snooze` · `Reschedule` · `Skip` (quiet) · `Assign · N pts` (accent outline, only when assignable).

`Reschedule` / `Skip` / `Assign` are **gate targets**. `Complete` and `Snooze` never gate.

---

### 3.4 Screen 04 — Complete flow (modal)

Two taps for the common case: open → confirm. Everything is pre-filled from the task's estimates.

Fields, in order: **who** (avatar picker, defaults to the last completer) · **DIY or pro** (segmented, defaults to the task's `default_mode`) · **actual cost** (pre-filled with the estimate) · **minutes** (pre-filled) · **products used** (toggle chips from linked products) · **notes** (optional) · **photo** (optional).

- The confirm button restates the summary: `$30 · 75 min · Rob`.
- **The photo never blocks completion.** It is a bordered optional slot with an explicit "optional" label.
- Cost field is a gate target: when locked it shows `•••` and the completion records the estimate.
- On confirm the modal reports what the schedule will do next: re-arm date for `from_completion`, or the locked season for `calendar_anchored`.

### 3.5 Screen 05 — Inspect → Plan → Do

**Step `ask`** — two large branch cards:
- **All good** (`--fh-success-bg`, success border) → *"Logs the inspection and re-arms it for \<next cycle\>."*
- **Needs work** (`--fh-warning-bg`, warning border) → *"Builds a plan — a target date, supplies or a pro."*

**Step `plan`** — a progress band across the top (`INSPECT ✓` → connector → `PLAN`), then the plan builder:
- **target date**
- **DIY / pro** flip (segmented)
- **DIY** → auto supplies list from the task's linked products, each with live stock; anything out of stock is flagged onto the shopping list. Footnote: *"Pulled from the products this task links to."*
- **pro** → vendor picker: name, phone, times used, ballpark price. (Desert Plumbing ~$220 · Sonoran Air ~$180 · Vasquez Handyman ~$140.)
- Confirm creates the **DO** task at the target date.

The stage rail on task detail (§3.3) shows the same three stages for any task mid-cycle, so the pipeline is legible from outside the modal.

### 3.6 Screen 06 — Products & inventory

Header: "Supplies" + "9 PRODUCTS · 2 NEED REORDERING".

**Top: `fh-blocked-banner`** — the warning state the brief asked for, stated as consequence not decoration: *"**Inspect water heater anode rod** is 19 days overdue and the replacement rod is out of stock."* + `Add to list`.

Then one `fh-product-row` per product: name · `fh-stock-badge` · par bar (`stock/par`, min 4% width so zero is still visible) · "used by" line (which tasks consume it, at what rate) · reorder hint when low or out.

Real data: MERV 11 filter 1/6 (low) · anode rod 0/1 (**out**) · silicone 0/2 (**out**) · vinegar 2/4 (low) · pump kit 1/1 · brush kit 1/1 · door lube 1/1 · coil brush 1/1 · drip emitters 12/12.

### 3.7 Screen 07 — Chores board bridge

Proves the cross-module UX. Kid header (avatar, name, "SUNDAY · 5 THINGS TODAY", 340 POINTS in `--fh-accent`).

**`fh-pinned-category` sits at the top**, visually distinct from regular chores: 1.5px `--fh-module` @50% border, `--fh-warning-bg` fill, filled wrench + "HOME CARE · PINNED" + "from Dad". Inside, one assigned task on `--fh-bg` with a 3px `--fh-module` left border: 34px check circle, "Mow & edge lawn", "45 min · due today", `+15`. Footnote: *"Home Care tasks pay out through Rewards like any chore — they just live in their own pinned row."*

Below it, ordinary `fh-kid-chore-row`s (Make your bed +2 done · Dishes +5 · Trash +3 · Feed the dog +2 done · 30 min reading +5) — deliberately plainer, so the pinned category reads as different in kind.

---

## 4. The parent gate — a reusable hub-wide pattern

Written so it can be applied to the admin panel and other modules unchanged. Nothing below is Home-Care-specific.

### 4.1 Trigger — the account, never a toggle

There is **no** viewer switch in the UI. Gate state is derived:

```js
const isAdmin  = haUser.is_admin;              // parent accounts
const parentOK = isAdmin || sessionUnlocked;   // may see protected content
const locked   = cls => !parentOK && gatedClasses.has(cls);
```

| Account | Behavior |
|---|---|
| **HA admin** (parent) | Never gated. **Zero** lock UI — no padlocks, no dashed borders, no masked values, no session strip, and the PIN sheet is unreachable. They simply see everything. |
| **restricted / non-admin** (the kitchen Echo Show) | Gated until the household PIN is entered. This is the case to design and test against. |

Verify by rendering both: admin must produce **0** masked values, **0** lock icons, **0** dashed gate borders.

### 4.2 Session scope — settled

- **Per-device.** Unlocking the kitchen tablet must not unlock any other device or surface.
- **Per-page-load, in card memory.** A reload re-locks. Nothing persists to `localStorage`, cookies, or HA state.
- **Idle timeout 5 minutes** (recommended and implemented) — appropriate for a wall-mounted tablet in a shared room.

### 4.3 The protected set is configurable

Gating is by **class**, not by element. Three classes ship:

| Class | Covers |
|---|---|
| `costs` | Every price figure: DIY/pro cost cards, the cost segment of a task card's effort line, the Complete modal's cost prefill and summary |
| `fund` | The sinking-fund rollup in every layout |
| `actions` | Destructive / configuration actions reachable from the room: **Reschedule**, **Skip**, **Assign** |

**Never gated:** `Complete`, `Log inspection`, `Snooze`. Kids must be able to finish and defer work. Snooze stays ungated by decision — it is reversible and carries no money or configuration.

Adding a class is adding a key. Any new element joins by asking `locked('costs')`.

### 4.4 The three session moments

**1 · Entry.** Any locked element is a live tap target and opens `fh-pin-sheet`. The sheet names what is being unlocked, drawn from the element's declared reason: *"Enter the household PIN to see the set-aside rollup."* / *"…to see cost figures."* / *"…to see rescheduling a task."* It also states the timeout up front.

**2 · Unlocked.** `fh-parent-session` — a persistent 49px strip across the top of **every** screen: open padlock · `PARENT ACCESS` (mono xs upper, `--fh-accent`) · *"Costs and set-aside are visible on this tablet"* · live `M:SS` countdown · `Lock now`. Background `--fh-accent-bg`, 1.5px `--fh-accent` bottom border.
It is an **in-flow flex row**, not an overlay — which is what makes it present on all seven screens by construction rather than by being added to seven headers.

**3 · Re-lock.** Three ways in: the countdown reaching zero, `Lock now`, or a page reload. On re-lock: the strip disappears, every protected value re-masks, and `fh-session-expired` appears at the bottom of the frame — *"**Parent access ended** · Costs and set-aside are hidden again. Nothing you were doing was lost."* + `Unlock again`. Auto-dismisses after ~8s.
Mid-task expiry must not destroy in-progress work: no modal closes, no field clears, no navigation happens.

### 4.5 Wrapping an arbitrary element

```
value  →  fh-protected-value     mask the figure, keep the label and the layout
tile   →  fh-protected-block     replace the card; keep its title and footprint
action →  fh-protected-action    keep the label, add a padlock, route the tap to the sheet
```

Each locked element declares three things:

| Input | Purpose |
|---|---|
| `class` | which protected class it belongs to (`costs` / `fund` / `actions`) |
| `reason` | short phrase completing "Enter the household PIN to see \_\_\_" — also the `title` attribute |
| `revealed` | the real content to render when `parentOK` |

Locked rendering, in all three:
- 1.5px **dashed** `--fh-border` (dashed is the gate's structural signal; solid is never locked)
- leading padlock, `--fh-text-sec`, stroke idiom
- label text at `--fh-text-xs` / 700 / `line-height:1.25` / `gap:4px`
- a CTA run at `--fh-accent` — `Parent access`, `Unlock`, or `Parent access to see costs`
- `title` = the reason
- `min-height:44px` — it is a real tap target

**The locked label inherits the repo's existing badge contract.** `htmlRewardLockBadge` (`src/card/themes/_shared.js:1076`, consumed by all six themes) is the house pattern for "you can't have this yet". We adopt its type contract exactly — `--fh-text-xs` at the 12px floor, weight 700, `line-height:1.25`, `display:inline-flex`, `gap:4px` — and its `title="<reason>"` convention.

### 4.6 The one deliberate divergence from `htmlRewardLockBadge`

| | `fh-reward-lock` (existing) | `fh-protected-*` (this pattern) |
|---|---|---|
| Semantics | *You have not earned this. There is no action.* | *This is available to the right person, right now.* |
| Replaces | a button | a value, a tile, or a button's ability to fire |
| Interactive | no | **yes** — opens the PIN sheet |
| Color | `--fh-overdue` | `--fh-accent` |
| Glyph | 🔒 **emoji** | **SVG** padlock, `currentColor` |

Red is correct for denial and wrong for "tap to unlock" — it reads as an error state on an element whose whole purpose is to be tapped. `--fh-accent` is the card's interactive color, is theme-adaptive, and belongs to no module.

**Note for the integration:** `htmlRewardLockBadge` uses an emoji lock (`🔒`). Presentation emoji paint their own fixed colors and ignore `color`, which is why that badge's `--fh-overdue` never actually applied to its glyph — only to its text. The integration should standardize on the SVG padlock in §7 so lock glyphs can carry state color. That is a small fix to an existing component, not a new pattern.

### 4.7 PIN verification is server-side

Submit → the hub answers valid / invalid. **The PIN never reaches the browser.**

Consequently: no per-digit validation, no "digits turn green as you type", no client-side comparison, nothing that implies the card knows the code.

| Sheet state | Rendering |
|---|---|
| `idle` | 4 empty dots; the next position is outlined `--fh-accent`. Keypad live. |
| `checking` | All 4 dots filled. `Checking with the hub…` (mono xs, `--fh-text-sec`). Keypad `pointer-events:none; opacity:.45`. |
| `error` | Dots cleared. `That code didn't work` in `--fh-overdue`. Keypad live again. |

The message row is a **fixed 22px slot** so the keypad does not jump between states.

Out of scope for this document: **where the household PIN is set.** That lives in the admin surface.

---

## 5. State gallery — every state, explicitly

### 5.1 The six task states

| State | Badge | Row / card treatment | Sourced from |
|---|---|---|---|
| `scheduled` | date, e.g. `Oct 12` — `--fh-text-sec` on `--fh-bg` | normal, `--fh-border` left border | Annual roof inspection |
| `upcoming` | `in 12d` — `--fh-accent` | normal, `--fh-accent` left border | Dryer vent, tankless descale |
| `due` | `TODAY` — dark text on **solid** `--fh-warning` | `--fh-warning` left border | GFCI/AFCI test, smoke & CO alarms, mow |
| `overdue` | `4d late` / `19d late` — `--fh-overdue` on `--fh-overdue-bg` | `--fh-overdue` left border | HVAC filter (4d), anode rod (19d) |
| `snoozed` | `back Aug 9` — `--fh-text-sec` | **dashed** left border, `opacity:.55` — muted, shows return date | caulk inspection |
| `disabled` | `OFF` — `--fh-text-sec` | `opacity:.42`, plus a reason line | pool equipment service — *"no pool at this home"* |

`due` is the only badge with a solid fill: it is the one state that means *act now*, and it must win at 3 metres.

### 5.2 The three inspect_plan_do stages

| Stage | Tag color | Rail | Primary action | Example |
|---|---|---|---|---|
| `INSPECT` | `--fh-text-sec` | ① outlined, ②③ dim | `Log inspection` | caulk, roof, termite, expansion tank |
| `PLAN` | `--fh-warning` | ① filled/green, ② outlined amber, ③ dim | `Build the plan` | anode rod |
| `DO` | `--fh-success` | ①② complete, ③ outlined green | `Complete` | garage door (history shows *"needs work — spring tension"*) |

### 5.3 Fund rollup — green / amber / red

| Dot | Status pill | Example |
|---|---|---|
| `--fh-success` | `ON TRACK` | HVAC heat pump · $13,000 (13 yr) |
| `--fh-warning` | `BEHIND $310` | Water heater tank · $1,650 (12 yr) |
| `--fh-overdue` | `SHORT $5.4k` | Roof underlayment · $12,000 (20 yr) |

Rollup only. Footnote points at admin: *"Roof underlayment is the one behind — full detail lives in Admin › Assets & Money."* Do not build fund detail here.

### 5.4 Stock states

`ok` — `4 on hand`, success · `low` — below par, warning, reorder hint · `out` — `OUT`, overdue, card border `--fh-overdue` @35%.
Plus the compound state: **upcoming task + insufficient stock** → `fh-blocked-banner` on both Products and the Dashboard footer.

### 5.5 Locked vs unlocked — every gate-covered element

| Element | Locked | Unlocked |
|---|---|---|
| Fund rollup, dashboard sidebar | `fh-protected-block` — dashed, padlock, `Set-aside health`, three `•••` runs, `Parent access — tap to unlock` | Full tile: 3 dots + names + status pills + `$145/mo` + admin footnote |
| Fund rollup, board footer | `fh-protected-block` `compact` — dashed, padlock, `Set-aside ••• ••• •••`, `Unlock` | 3 dots + "Roof underlayment behind" |
| Task card cost segment | `10 min · Easy · •••` | `10 min · Easy · $20 DIY` |
| DIY / PRO cost cards | Both figures `•••`, plus a dashed `Parent access to see costs` CTA under them | `$30` / `$200`, default mode highlighted |
| Complete modal cost | `•••` prefill, summary `••• · 75 min · Rob` | `$30`, summary `$30 · 75 min · Rob` |
| Reschedule | `fh-protected-action` — dashed, padlock, label kept | live, opens the date popover |
| Skip | `fh-protected-action` | live, opens the reason popover |
| Assign | `fh-protected-action` | live, opens the assign modal |
| Session strip | absent | present, counting down |

### 5.6 PIN sheet — `idle` / `checking` / `error`
See §4.7.

### 5.7 Reminder — inheriting vs overridden

| | `inherits` (default) | `overridden` |
|---|---|---|
| Tag | `INHERITS GLOBAL` — `--fh-text-sec` on `--fh-bg` | `OVERRIDDEN` — `--fh-accent` on 16% accent tint |
| Body | *"Follows the household setting — **3 days before**, to the kitchen tablet."* | *"This task only — the household default stays at 3 days."* |
| Control | `Set one just for this task` (full-width secondary) | Preset chips: `Same day` `1 day` `3 days` `1 week` `Off`; selected chip = accent border + 16% fill |
| Escape | — | `Back to the household setting` (quiet, resets to inherit) |

Distinct from the global notification settings, which live in admin. Not a gate target.

### 5.8 History — completion vs skipped

| | completion | skipped |
|---|---|---|
| Dot | 9px **solid** `--fh-success` | 9px hollow, 1.5px **dashed** `--fh-text-sec` |
| Who | normal weight, `--fh-text` | *italic*, `--fh-text-sec` |
| Detail | `all good · 40 min` | the reason, e.g. `out of town that week` |
| Semantics | advances the cycle, records cost/time/person | advances the cycle, records **no** completion |

Live example on the anode rod: `Jul 9 '25 · Rob · inspection · all good · 40 min` / `Jul 11 '24 · Skipped · Rob · out of town that week` / `Jul 2 '24 · Rob · inspection · all good · 45 min`.

---

## 6. Interaction table

### Dashboard
| Element | Action | Opens / collects |
|---|---|---|
| Task card body | open task | → Task detail |
| `Complete` on card | quick-complete | → Complete modal (simple tasks) or **Inspect modal** (inspect_plan_do not yet at DO). Routing by workflow, not by button label. |
| `Open` on card | open task | → Task detail |
| `Find` (header) | → Schedule, search focused | — |
| `Schedule` (header) | → Schedule | — |
| Set-aside tile | if locked → PIN sheet (`reason: "the set-aside rollup"`); if unlocked → nothing (display only; detail is admin's) | — |
| `Supplies` (blocked tile) | → Products | — |
| `Board` (assigned tile) | → Chores board | — |
| Seasonal banner `View` | → Schedule | — |
| Seasonal banner `×` | dismiss for the session | — |

### Schedule
| Element | Action | Opens / collects |
|---|---|---|
| Find input | live filter across all 97 by name + category | query string |
| Clear `×` | reset to browse state | — |
| Result row | open task | → Task detail |
| Category chip | *(see §8 — browse-by-category is indicated, not built)* | — |
| Month/Week toggle | switch range | — |
| Day cell chip | open task | → Task detail |
| Back `‹` | → Dashboard | — |

### Task detail
| Element | Action | Opens / collects |
|---|---|---|
| `Complete` / `Log inspection` | primary | → Complete modal / Inspect modal |
| `Snooze` | popover | preset: +1 day / +1 week / +1 month / Pick a date. Each shows its resulting date. **Never gated.** |
| `Reschedule` | popover (gated) | **one** date; copy states it clears any active snooze and does not shift the following cycle |
| `Skip` | popover (gated) | optional reason string; writes a `skipped` history entry and advances the schedule |
| `Assign · N pts` | modal (gated) | person (or unassigned = claimable), points, due date |
| Supplies row | → Products | — |
| Reminder `Set one just for this task` | switch to overridden | — |
| Reminder preset chip | set offset | one of same-day / 1d / 3d / 1w / off |
| Reminder `Back to the household setting` | revert to inherit | — |
| Cost card (locked) | → PIN sheet (`reason: "cost figures"`) | — |
| Back `‹` | → Dashboard | — |

### Complete modal
| Element | Action |
|---|---|
| Avatar | select who |
| DIY / pro | select mode; defaults to the task's `default_mode` |
| Cost, minutes | edit; pre-filled from estimates |
| Product chip | toggle consumed |
| Notes | free text, optional |
| Photo slot | attach, **optional, never blocking** |
| Confirm | write completion, re-arm per `schedule_mode` |
| `×` / overlay | cancel, discard |

### Inspect modal
| Element | Action |
|---|---|
| `All good` | log inspection, re-arm for next cycle |
| `Needs work` | → plan builder |
| Target date | set DO date |
| DIY / pro flip | switch plan shape |
| Supply row | confirm / add to shopping list |
| Vendor row | select vendor |
| Confirm | create the DO task |

### Assign modal
| Element | Action |
|---|---|
| Person | select, or leave unassigned (= claimable) |
| Points | edit; pre-filled from the task's `pts` |
| Due date | set |
| Confirm | publish the point offer to Rewards |

Payload (frozen upstream — the UI only collects the starred fields):
```
{ source_module, external_id, name, description,
  points*, due_date*, assigned_to* (or null), claimable }
```

### PIN sheet
| Element | Action |
|---|---|
| Digit key | append; disabled while `checking` |
| `⌫` | delete last; clears the error |
| 4th digit | auto-submit to the hub → `checking` |
| `Cancel` | dismiss; the originating element stays locked |

### Session
| Element | Action |
|---|---|
| `Lock now` (strip) | re-lock immediately |
| Countdown | display only |
| `Unlock again` (expiry banner) | → PIN sheet |

### Chores board
| Element | Action |
|---|---|
| Pinned Home Care check circle | complete the assigned task → Complete modal |
| Regular chore row | existing chore behavior — unchanged |

---

## 7. Icons

All UI affordance icons follow **`src/card/icons.js`** — Tabler Icons, `viewBox 0 0 24 24`, `fill="none" stroke="currentColor" stroke-width="2"`, round caps and joins. `FH_ICONS` has no `lock` and no `magnify` key, so those are new drawings following the idiom rather than imports.

**The icon rule:** module **identity marks** follow `src/card/rooms/index.js` (filled paths, matching the Command Center room tiles). Everything else — every affordance, control, and state glyph — follows `icons.js` (stroke). The Home Care wrench is the only filled glyph in the room.

### 7.1 `lock` — NEW (idiom-conformant)
Used by: `fh-protected-value`, `fh-protected-block`, `fh-protected-action`, `fh-pin-sheet`.
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <rect x="5" y="11" width="14" height="10" rx="2"/>
  <circle cx="12" cy="16" r="1"/>
  <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
</svg>
```

### 7.2 `lock-open` — NEW (idiom-conformant)
Used by: `fh-parent-session`, `fh-session-expired`, the unlocked fund tile header.
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <rect x="5" y="11" width="14" height="10" rx="2"/>
  <circle cx="12" cy="16" r="1"/>
  <path d="M8 11V7a4 4 0 0 1 8 0"/>
</svg>
```

### 7.3 `search` — NEW (idiom-conformant)
Used by: the `Find` header button, the Schedule find bar.
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <circle cx="10" cy="10" r="7"/>
  <path d="M21 21l-6-6"/>
</svg>
```

### 7.4 `calendar` — NEW (idiom-conformant)
Used by: the `Schedule` header button.
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="5" width="16" height="16" rx="2"/>
  <path d="M16 3v4M8 3v4M4 11h16"/>
</svg>
```
> An earlier revision used the **filled** calendar path from `rooms/index.js` here. That was wrong — the header calendar is an affordance, not an identity mark. Corrected above.

### 7.5 `wrench` — **LIFTED VERBATIM**, filled
From `src/card/rooms/index.js`. The Home Care module identity mark — the same glyph as the Command Center room tile. Rendered at `--fh-module`. Appears twice: the dashboard module tile and the pinned category on the chores board.
```html
<svg viewBox="0 0 24 24" style="fill:var(--fh-module)">
  <path d="M13.78 15.3 19.78 21.3 21.89 19.14 15.89 13.14 13.78 15.3M17.5 10.1c-.39 0-.81-.05-1.14-.19L4.97 21.25 2.86 19.14l7.41-7.4-1.77-1.78-.72.7-1.45-1.41V12.1L5.62 12.82 2.08 9.28l.71-.72H5.62L4.18 7.11 7.78 3.5c.98-1 2.69-1 3.69 0L9.36 5.61l1.42 1.44-.72.71 1.77 1.78 2.37-2.38c-.14-.33-.2-.75-.2-1.16C14 3.79 15.79 2 18 2c.68 0 1.32.19 1.86.5L17.5 4.86l1.64 1.64L21.5 4.14C21.81 4.68 22 5.32 22 6c0 2.21-1.79 4-4 4-.18 0-.34-.03-.5-.05v.15z"/>
</svg>
```

### 7.6 Sizes
16px in the session strip · 14px inline in tiles · 15px in buttons · 17–19px in blocks and headers · 20px in the PIN halo and expiry banner · 19px in the 34px module tile. All `flex-shrink:0`.

> **No emoji in rendered UI.** Presentation emoji ignore `color`, so a state cannot be expressed on the glyph — which is exactly what the gate needs. This is also the fix noted for `htmlRewardLockBadge` in §4.6.

---

## 8. Deliberate ambiguities — decide before you build

1. **`--fh-module` may be redundant.** If the repo already exposes a per-room accent (`rooms/index.js` carries `#ff9f0a`), use it and delete the token. I could not confirm a variable name.
2. **Browse-by-category is indicated, not built.** The Schedule idle state shows category chips with counts as the affordance for reaching all 97 tasks. Tapping one is unspecified: it could filter in place, or hand off to the admin Library. I lean filter-in-place — the room should not need admin to answer "what's in Plumbing?" The counts shown are illustrative, not the real seed distribution.
3. **Month/Week toggle is visual only.** The month grid is specified; the week range is not drawn.
4. **Year seasonal strip is a rhythm diagram, not a data view.** It encodes the Tucson calendar (monsoon Jun 15 – Sep 30, pre-emergent Feb & Oct, post-monsoon roof Oct 12, evap Apr–May, irrigation quarterly). Whether individual tasks plot onto it is open.
5. **Photo slot ships unwired.** No storage target in v1, by decision. It must never block completion.
6. **Assign is fire-and-forget.** The UI publishes the offer; there is no designed state for "offer accepted / claimed / expired" coming back from Rewards. Round-trip needs its own pass.
7. **`decide` default mode has no resolution UI.** Tasks defaulting to `decide` (roof inspection) show both cost cards with neither highlighted and the note *"No default — this one's a judgement call each cycle."* Where that judgement gets recorded is unspecified.
8. **Large `--fh-text-scale` reflow (1.25 / 1.5) is owned by the integration**, per your note. Everything here is authored in scale-relative type, but the 1.5 board layout is untested.
9. **Snooze return behavior.** A snoozed task shows `back Aug 9`. Whether it returns in its original state or as `due` is unspecified.
10. **Skip and cycle counting.** A skip advances the schedule and records an entry, but whether it breaks a streak or affects a "last actually done" figure elsewhere is not designed.

---

## 9. Screenshot index

Full-frame captures at tablet 1280 × 800 unless noted, in `handoff/`.

| File | Shows |
|---|---|
| `01-dashboard-locked.png` | Screen 01, restricted account, all three classes gated |
| `02-dashboard-unlocked.png` | Screen 01 unlocked — session strip, fund rollup revealed, costs revealed |
| `03-dashboard-admin.png` | Screen 01, HA admin — zero lock UI |
| `04-pin-idle.png` · `05-pin-checking.png` · `06-pin-error.png` | `fh-pin-sheet`, all three states |
| `07-session-expired.png` | `fh-session-expired` banner, in flow, action bar intact above it |
| `08-task-locked.png` | Screen 03 with gated costs + gated Reschedule/Skip/Assign |
| `09-task-unlocked.png` | Screen 03 revealed, PLAN stage rail |
| `10-task-history.png` | completion vs skipped history rows |
| `11-reminder-inherits.png` · `12-reminder-overridden.png` | `fh-reminder-card`, both states |
| `13-snooze.png` · `14-reschedule.png` · `15-skip.png` | the three action popovers |
| `16-complete-modal.png` | Screen 04 |
| `17-inspect-ask.png` · `18-inspect-plan.png` | Screen 05, both steps |
| `19-schedule-idle.png` · `20-schedule-search.png` | Screen 02, browse and search |
| `21-products.png` | Screen 06 — low, out, and the blocked banner |
| `22-chores-bridge.png` | Screen 07 — pinned category |
| `23-task-states.png` | `scheduled` / `upcoming` / `due` / `overdue` grouped, plus fund green-amber-red and the seasonal banner |
| `23b-state-snoozed.png` | `snoozed` — dashed, muted, `back Aug 9` |
| `23c-state-disabled.png` | `disabled` — `OFF`, greyed, with its reason |
| `24-phone-dashboard.png` | 420 × 860 |
| `25-phone-task.png` | 420 × 860 |

Notes on the plates: `10-task-history.png` and `11-reminder-inherits.png` are the same frames as `08`/`09` — the history rows and the `INHERITS GLOBAL` reminder card are both legible there, and cropping them out of context would lose the surrounding spacing you need. `snoozed` and `disabled` are shown via search rows (`23b`, `23c`) rather than in the grouped list, because those two states sit below the fold and the capture renderer flattens inner scroll position.

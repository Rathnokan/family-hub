# Home Maintenance Module — Scope Document v5

**Project:** Family Hub v0.8.0 "Home Maintenance"
**Author:** Jim + Claude · July 2026
**Path:** Claude Design (Prototype) → Claude Code (HA integration in `family-hub`)

> **v5 changelog (2026-07-19, B2.1+B3 — Phase B COMPLETE):** §5 — the shipped library is **`seed_library.json` v3.0.0**: 97 tasks (4 new evap-cooler tasks populate the reserved `evap_cooler` tag — the profile question may now be exposed), zero unpriced records, 15-asset big-ticket table embedded. New additive schema v2.2 field **`climate_overrides`** carries the Desert Southwest preset (only recurrence override: tankless descale 12→6 mo unsoftened Tucson / 12 mo with verified softener; monsoon anchors per NWS Jun 15–Sep 30; UA Extension az1817/az1683/az1681 banked as v0.9 lawn rules). §8 inflation default updated **3.5% → 4.0%** (BLS household-repair CPI 5.12%/yr 1997–2024). Emergency-prep kit checks (§12.5) remain deliberately un-added pending Jim's call. Full record: B3-RECORD.md.
> **v4 changelog (2026-07-19, B2 merge):** §5 status updated — B2 costs verified and merged; canonical file is now **`seed_library.v2.1.json`** (93 tasks + embedded 11-asset big-ticket table; per-task `cost_status` field; 29 tasks await the B2.1 pricing mini-pass). §8 sinking-fund conventions locked: nominal-2026 cost basis with runtime inflation compounding, `planning_life_years` per asset, the anti-double-count rule between task costs and fund accrual, and the 3.5% recommended inflation default. No feature-scope changes. Full record: B2-VERIFICATION.md.
> **v3 changelog (2026-07-18, B1.5):** §3.1 applicability now references the seed-schema v2 controlled vocabulary (presence + variant tags). §3.4 Home Profile expanded with the variant/equipment questions. §5 updated to canonical library status (93 tasks, B1+B1.5 complete in `seed_library.v2.json`). §8 water-heater sinking-fund asset split tank vs tankless; water softener added to watch list. §12 open items refreshed. Everything else unchanged from v2.

---

## 1. Vision

A complete home-maintenance operating system inside Family Hub: every task a homeowner should be doing — weekly through once-a-decade — prepopulated, scheduled, and surfaced at the right time on the right device. Check things off, snooze or reschedule, assign to family members, track the products consumed, and see the true cost of home ownership including what you should be saving right now for the big replacements.

It is also an **education tool**: the seed library is deliberately comprehensive — "what you really should be doing that you didn't know" — and the fully configured plan can be exported as a printable document.

## 2. Architectural Principles (applies to all of Family Hub)

These came out of this scoping session and govern the whole ecosystem, not just this module:

1. **Modules are independent.** Any module (Chores, Meals, Maintenance, Smart Home, Calendar…) can be enabled or disabled at any time and everything else keeps working. One family may run only Maintenance; another only Meals. Each module owns its data collection, services, sensors, and card room.
2. **Modules communicate through events, never direct dependency.** A small internal event bus (`family_hub_event` pattern) carries cross-module messages. A module publishes; interested modules subscribe. If the subscriber is disabled, the message is simply unheard — no errors, no broken features, the publishing module just hides the affordance (e.g., no "Assign to person" button if Chores is off).
3. **Rework is expected; data is sacred.** As the codebase evolves — entity restructures, storage redesigns, full rewrites — every version must support **export to a versioned JSON data file** and **import with migration** into the new structure. Schema version stamped in every export; importers migrate forward stepwise (v3 → v4 → v5). Losing history is the only unacceptable outcome.
4. **Current reality:** single user (Jim). Design for multi-family cleanliness, but don't gold-plate multi-tenant concerns.

**Open item — Chores rename:** "Chores" carries a negative connotation. Candidate names to decide later: *Quests* (fits the theme/skin system and gamified point economy), *Missions*, *Task Board*, *Points*. Rename is cosmetic (labels/strings), not structural.

## 3. Core Concepts & Data Model

### 3.1 Maintenance Task

| Field | Notes |
|---|---|
| `task_id`, `name`, `description` | Description includes a short "how-to" blurb |
| `category` | HVAC · Plumbing · Electrical/Safety · Exterior · Interior · Appliances · Landscape/Irrigation · Pest · Seasonal |
| `location` | Room/zone tag (Kitchen, Master Bath, Roof, Yard…) |
| `recurrence` | `{interval, unit}` or `seasonal_anchor` (month/window) |
| `schedule_mode` | **`from_completion`** (float: filter changed 2 weeks late → next due shifts 2 weeks) or **`calendar_anchored`** (seasonal/compliance items — pre-monsoon roof check, February pre-emergent, annual termite inspection — never drift; late completion still leaves next occurrence on its anchor) |
| `workflow` | `simple` (do → done) or `inspect_plan_do` (see 3.5) |
| `lead_time_days` | How far ahead it surfaces and first reminder fires |
| `effort` | Estimated DIY minutes + difficulty (Easy / Moderate / Hard / Pro-only) |
| `est_cost_diy` / `est_cost_pro` | Anticipated cost each way |
| `default_mode` | `diy` \| `pro` \| `decide-each-time` |
| `products[]` | Linked product IDs |
| `assignable` | May be pushed to a person via the Chores bridge; carries a `default_point_value` |
| `applicability[]` | **(v3)** Tags from the seed-schema v2 controlled vocabulary — *presence tags* (pool, softener, sump_pump, irrigation, gas_service…) gate optional equipment; *variant tags* (tank_water_heater vs tankless_water_heater; tile_roof vs shingle_roof) gate mutually-exclusive appliance types. Empty = universal. The Home Profile (3.4) must resolve every tag used by an enabled task. |
| `next_due`, `last_completed` | Computed |
| `source` | `seed` \| `custom` — seed tasks disable, never delete |
| `enabled` | Driven by Home Profile or manual toggle |

### 3.2 Product & Inventory (launch feature)
`product_id`, `name`, `spec` ("16×25×1 MERV 13"), `unit_cost_est`, `qty_per_use`, `where_to_buy`, `inventory_count` + low-stock threshold, `linked_tasks[]`.
Completing a task decrements inventory and pre-fills cost. Upcoming task + insufficient stock → reorder prompt. The Plan stage (3.5) generates a supplies list from linked products.

### 3.3 Completion Record
`task_id`, `date`, `completed_by`, `mode` (diy/pro), `actual_cost`, `actual_minutes`, `products_used[]`, `vendor_id` (if pro), `notes`, `photo` (**optional** attachment — data fields are what matter; photo never required).

### 3.4 Home Profile (editable settings, not one-time)
Lives in the Maintenance settings tab and is **modifiable at any time** — changing an answer re-evaluates the seed library (newly applicable tasks enable with sensible next-due dates; newly inapplicable ones disable but keep history). No reinstall ever required to fix a wrong answer.

Contents: home age, sq ft, stories, roof type (tile/shingle), climate preset (**Desert Southwest** default), flooring by area, HVAC filter sizes & counts (seeds Products), home value & sq ft (feeds repair-fund math), inflation-rate assumption, **plus equipment/variant questions (v3, each resolving seed applicability tags):**

- **Water heater type:** Tank / Tankless *(single-select; enables the correct 4–7 water-heater tasks and picks the matching sinking-fund asset variant)*
- **Gas service:** auto-set Yes if any of furnace, dryer, range, water heater, or fireplace is answered gas *(gates the connector/shutoff inspection)*
- **Primary heating:** Gas furnace / Heat pump / Electric *(reserved — informs cost records and future variant tasks)*
- **Dryer fuel:** Gas / Electric *(reserved; a gas answer sets gas_service)*
- **Presence toggles:** pool · water softener · RO system · fireplace · gutters · septic · carpet · sump pump · water source (municipal / private well) · irrigation system · lawn · wood deck · wood fence · natural-stone counters · tiled surfaces · whole-house humidifier · mini-split units · standby/portable generator · evaporative cooler *(evap tasks arrive with the B3 climate pass)*

### 3.5 Inspect → Plan → Do
For condition-based items (recaulk baths, exterior paint, carpet). The recurring event is the **Inspection**. Completing it branches:

- **All good** → re-arm inspection for next cycle.
- **Needs work** → spawns a **Plan** item: pick a target date/weekend, auto-generate the supplies list from linked products (→ shopping/inventory), or flip to pro mode and pick from the vendor book. When planned and supplied, it becomes a scheduled **Do** task carrying the cost estimate; actuals captured at completion as normal.

### 3.6 Vendor Book
`vendor_id`, name, trade (termite, HVAC, roofing…), phone/notes, `preferred` flag, last-used date and price (auto-updated from pro-mode completions). Surfaced in the Plan stage and on task detail for pro-mode tasks.

## 4. Chores Bridge (cross-module assignment)

Maintenance can push a task to any person — kid or adult — with a due date and point reward, **without either module depending on the other**.

**Mechanics:**
- Maintenance **owns** the task. Assigning publishes an `external_task_offer` event; Chores (if enabled) materializes a **projection** on that person's board.
- Projections render in a pinned **"Home Maintenance" category at the top** of active chores, visually distinct, so everyone knows edits happen in Maintenance, not the chore list. Edit actions deep-link to the Maintenance task.
- **Completion syncs both ways:** kid checks it off on his board → Maintenance records the completion (with `completed_by`); Jim completes or cancels it in Maintenance first → the projection disappears from the kid's board (no orphaned chores, no double points).
- Points award through the existing Chores economy; Maintenance just supplies the bounty value. If Chores is disabled, the assign affordance hides and Maintenance behaves standalone.
- Reassignment/revocation is a normal Maintenance action; the bridge handles the projection lifecycle.

This bridge pattern is generic — future modules (Meals → "kid sets the table Tuesday") reuse the same events.

## 5. Seed Task Library

**Status (v5): PHASE B COMPLETE (B1 + B1.5 + B2 + B2.1 + B3).** The shipped library is **`seed_library.json` v3.0.0 — 97 cited tasks + the embedded 15-asset big-ticket table**, conforming to seed-schema v2 plus additive v2.1/v2.2 fields (`cost_status` per task; `climate_overrides` per-preset blocks; `cost_basis_year` + `planning_life_years` per asset). Every record is priced or classified: 14 priced_b2, 29 priced_b2_1, 4 priced_b3 (the new evap-cooler set), 40 confirmed free, 10 linked to assets (anti-double-count, §8) — **zero pending**. The Desert Southwest preset applies climate_overrides only when the Home Profile climate answer matches; universal values remain intact underneath for any future non-desert deployment. Records: B2-VERIFICATION.md (B2 merge) and B3-RECORD.md (B2.1 pricing + climate pass, incl. the Tucson tankless 6/12-month rule and the UA Extension Bermuda citations).

Distribution: Annual-to-2-yr 35 · Semi-annual 15 · Monthly 12 · Big-ticket watch (8–25 yr) 11 · 2–5 yr 9 · Quarterly 7 · Weekly/biweekly 4. Categories: Plumbing 29, Exterior 17, Appliances 12, Electrical/Safety 12, Interior 8, HVAC 7, Landscape/Irrigation 5, Pest 2, Seasonal 1. Includes the household-safety spine (NFPA/CPSC/EPA-anchored: alarms, GFCI/AFCI, fire escape drill, gas connectors, radon, main-shutoff exercise) and the high-surprise expense-prevention cluster (anode rods, expansion tank, PRV, dry P-traps, tankless descale, dryer vent, washer hoses, garage spring balance).

**Lawn care depth (future enhancement, flagged):** the Bermuda program — fertilizer type and N-P-K by season, pre-emergent timing, application timing around heat (early AM), overseed vs. dormancy — likely needs curated external knowledge (extension-service schedules) baked into the climate preset. Scope as v0.9+; the module ships with the basic mow/edge task day one (in the canonical library).

**Remaining research (B3):** Desert Southwest / Tucson pass — monsoon-driven anchors, hard-water interval tightening (including the tankless 6-month decision), termite cadence, evaporative-cooler tasks, irrigation rhythm — merged with the canonical file to produce the final shipped `seed_library.json`.

**Printable Maintenance Plan:** export the fully configured plan (post-profile, enabled tasks only) as a formatted PDF — grouped by frequency, with intervals, seasonal calendar, and cost summary. Give it to a friend, keep it in the home binder, or use it as the "new homeowner starter kit."

## 6. Scheduling, Reminders & Notifications

**Lifecycle:** `scheduled → upcoming → due → overdue → completed | skipped` (+ `snoozed` modifier; `inspect_plan_do` adds the Plan stage).

**Actions:** Complete (cost capture) · Snooze (+1d/+1w/+1mo/pick) · Reschedule occurrence · Shift cadence · Skip · Assign/Reassign (bridge).

**Next-due computation** honors `schedule_mode` — floats from actual completion for consumables, holds calendar anchors for seasonal items.

**Notifications (HA-native):** notify groups per device class — phones/tablets (companion app, actionable: Complete / Snooze 1w / Open), Echo Shows (Alexa Media Player announce + Command Center card), TVs (Fully Kiosk/persistent), desktop web push. Escalation tiers: upcoming (quiet heads-up) → due (actionable push) → overdue (daily→weekly nag + card badge). Weekly Sunday digest with the week's tasks and projected costs. Quiet hours + per-person/per-category routing. All timing in the integration (`tick_mixin` pattern); events exposed so custom automations can hook in.

## 7. Recommendations (v0.9)

Rule-based, rules-as-data (JSON):
- **Seasonal** (climate preset): Feb pre-emergent · May pre-monsoon prep · Oct post-monsoon roof + overseed decision · Dec freeze watch.
- **Event-driven** (HA sensors): high ozone/AQI → MERV upgrade suggestion + filter check now · dust storm → filter + patio wash · freeze warning → hose bibs/irrigation · monsoon watch → secure patio.

Dismissible banner; accepting spawns or advances a task.

## 8. Cost of Ownership & Savings Planning

**Planned baseline:** annualized expected cost of every enabled task (est ÷ interval), DIY vs. pro split → "this home costs ~$X/yr to maintain."

**Actuals:** captured at completion; reports show YTD actual vs. planned, by category/month, DIY savings (pro est − actual), 12-month forecast.

**Sinking fund (big-ticket replacements):** for each watch-list asset:
- **(v4) Cost conventions:** asset costs are stored as **nominal 2026 USD** (`cost_basis_year: 2026` on every record in the big-ticket table, which lives embedded in the canonical library file so exactly one file carries all seed data). Future cost is **computed at view time, never stored** — it depends on remaining life at that moment. Each asset carries `planning_life_years`, the single integer the fund amortizes over (midpoint convention; tank **12** vs tankless **20** is the mandatory split).
- `future_cost = current_replacement_cost × (1 + inflation)^years_remaining` (inflation configurable in profile; **recommended default 4.0%**, sourced in B2.1: BLS CPI 'Repair of household items' averaged 5.12%/yr 1997–2024 vs 2.51% overall CPI, trade labor ~4–5%/yr — equipment tracks lower than repair services, so 4.0% is the conservative middle). Note the HVAC caveat: the refrigerant transition (R-410A → R-32/R-454B) is inflating HVAC costs faster than general inflation — revisit that asset's basis cost at replacement-planning time.
- `required_monthly = future_cost ÷ months_remaining` (credit any existing balance)
- **`target_balance_today = future_cost × (elapsed_life ÷ expected_life)`** — the honesty metric: are you where you should be? Dashboard shows green/amber/red per asset and in aggregate.
- User enters current saved balance per fund (or one combined fund) to track against target.

**(v4) Anti-double-count rule:** every dollar appears in exactly one of the two streams — the planned baseline (task costs) or the sinking fund (assets). All `*_replace_watch`-class tasks and `exterior_repaint` therefore carry $0/null and point to their `asset_id`; the money lives in the fund. Exception: **garage springs** are priced on the task (`garage_spring_service`, $350 — that's how it's experienced, as a service call) and the matching asset defaults to **fund accrual OFF**. The Costs & Savings screens must respect this rule.

**(v3) Asset list uses profile variants:** the water-heater asset is **split by type — Tank (10–15 yr expected life) vs Tankless (~20 yr)** — because expected life drives `target_balance_today`; the profile's water-heater answer selects which asset is active. **Water softener (10–15 yr)** added to the watch list. Full watch list: water heater (tank | tankless), HVAC (AC/furnace and heat-pump variants), tile roof underlayment, exterior repaint, carpet, garage springs/opener, water softener, RO system, detector fleet, expansion tank, PRV, sump pump.

**Emergency repair fund:** separate recommended reserve for the unplanned (rule-of-thumb configurable: ~1% of home value/yr or $1/sq ft/yr), shown as a target balance alongside the sinking funds.

## 9. Prototype Screens (Claude Design build list)

1. **Dashboard:** stat strip (overdue / this week / this month), next-up list, YTD cost widget, sinking-fund health tile (green/amber/red), recommendation banner.
2. **Schedule:** week/month timeline + year-at-a-glance seasonal strip.
3. **Task detail:** how-to, effort, DIY vs. pro costs, products & stock, history w/ actuals, vendor (pro tasks), action bar incl. **Assign** (person picker + points + due date).
4. **Complete flow (modal):** who, mode, cost, time, products, notes, optional photo — two taps for the common case.
5. **Inspect result flow:** All good ↔ Needs work → Plan builder (date, supplies list, or pro + vendor pick).
6. **Library/browse:** grouped by frequency or category, enable toggles, add custom, "surprising items" highlighted.
7. **Products & inventory:** costs, linked tasks, stock levels, reorder hints.
8. **Costs & savings:** planned vs. actual, category breakdown, DIY savings, sinking-fund panel (future cost, monthly need, target-today vs. actual balance), repair fund.
9. **Settings:** editable Home Profile (incl. the v3 variant/equipment questions), notification routing/quiet hours, digest, inflation assumption, vendor book, **Export data / Print plan** buttons.
10. **Chores-board mockup (one screen):** kid's board showing the pinned "Home Maintenance" category on top — proves the bridge UX.

Design language: match existing Family Hub card aesthetics (stat strip, section headers, days badges) and theme system.

## 10. Integration Plan (Claude Code phase)

- **Backend:** `maintenance_mixin.py` + own `data_store` collections (tasks, products, completions, vendors, funds); services: `maintenance_*` CRUD, `complete/snooze/reschedule/skip/assign/revoke`, `product_*`, `vendor_*`, `fund_update`; event bus messages: `external_task_offer / _complete / _revoke`; extend websocket card model; keep `sensor.family_hub_maintenance_due/_overdue` contracts. **(v3)** The Home Profile implementation treats seed-schema v2's applicability vocabulary (presence + exclusive variant groups) as an input contract.
- **Chores side:** small subscriber that materializes/removes projections + the pinned category renderer. No import of maintenance code.
- **Migration:** one-time migrate `category_label == "Maintenance"` chores into the new collection; remove `_chore_is_maintenance()` seam. Establish the **versioned export/import framework** here (schema-stamped JSON, stepwise migrators) as ecosystem infrastructure.
- **Phasing:** v0.8.0 = carve-out, module toggle framework, seed library, scheduling (both modes), notifications, complete/snooze/reschedule, **inventory**, Chores bridge · v0.8.x = costs/actuals, sinking funds, inspect-plan-do full flow, vendor book, printable plan · v0.9 = recommendations, lawn-care program.

## 11. Resolved Decisions (from v1 open questions)

1. **Chores linkage:** yes — bridge with point bounties; modules stay independent (Section 4).
2. **Inventory:** launch feature.
3. **Photos:** optional attachment; structured data required, photo never is.
4. **Vendor book:** in scope (v0.8.x).
5. **(v3) Appliance variants:** handled via seed-schema v2 variant tag groups + Home Profile single-selects; water-heater sinking-fund asset split by type.

## 12. Remaining Open Items

1. Chores module rename (Quests / Missions / Task Board?) — decide before v0.8.0 strings work.
2. Sinking funds: one combined fund vs. per-asset balances (recommend: per-asset targets, single real-world account, combined health view).
3. ~~Seed library research deliverable~~ — **B1 + B1.5 complete** (`seed_library.v2.json`, 93 tasks). B2 costs and B3 climate pass remain.
4. Printable plan format details (full binder doc vs. one-page seasonal calendar vs. both).
5. **(v3, new)** Emergency-preparedness kit checks (supplies/flashlights/water): in or out of scope for Maintenance? Adjacent to home maintenance; the NFPA fire-escape drill is already in the library. Jim's call before B3.

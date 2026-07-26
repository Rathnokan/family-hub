# Family Hub v0.8.0 — Implementation Plan (v4)
**Home Maintenance Module · Claude Pro workflow**
*Companion to: home-maintenance-module-scope.md (v5)*

> **v4 changelog (2026-07-19, PHASE B COMPLETE):** B2.1 and B3 executed in one pass (B2.1 folded into B3's front, as v3 allowed). All 29 pending records and 4 missing assets priced with named 2026 citations; opener corroborated; inflation default sourced (4.0%). B3 delivered the Desert Southwest layer via the new additive `climate_overrides` field, 4 evap-cooler tasks (97 total), the Tucson tankless 6/12-month rule, monsoon anchors, and UA Extension Bermuda citations (az1817/az1683/az1681, banked as v0.9 rules data). **Shipped output: `seed_library.json` v3.0.0** — the repo file D1 loads. Records: B2-VERIFICATION.md, B3-RECORD.md. Next: C1 (light) and A1 (Code, plan mode).
> **v3 changelog (2026-07-19, post-B2):** B2 marked **complete-with-caveat** — the research was sound but its task JSON was reconstructed (it couldn't read the canonical file), so it was verified and merged as a pricing layer; **zero intervals changed** (the report's own threshold rule voided its two proposed corrections). Canonical file is now **`seed_library.v2.1.json`** (93 tasks + embedded big-ticket table + per-task `cost_status`). **B2.1 mini-pass inserted** (29 unpriced tasks + 4 missing assets + opener corroboration — prompt below); it can run standalone or fold into the front of B3. B3 prompt updated to consume v2.1 and clear any remaining `pending_b2_1` flags. Full record: B2-VERIFICATION.md.
> **v2 changelog (2026-07-18, post-B1.5):** B1 marked complete; **B1.5 gap-closure inserted and complete** (schema v2, variant applicability, canonical `seed_library.v2.json` — 93 tasks; note: B1's report claimed 92 but delivered 69 records, corrected in the merge). B2 and B3 prompts rewritten to work from the canonical file and to carry the tank/tankless asset split, softener asset, and interval-corroboration flags. Sequencing updated for Jim's chosen **Phase-B-first ordering** (complete B before returning to A). Section numbering unchanged otherwise.

---

## 0. The Four Surfaces and Their Roles

| Surface | Role in this build | Why |
|---|---|---|
| **Claude Chat (Research mode)** | Seed library research; cost/inflation data; printable plan content | Web-grounded, multi-source synthesis; outputs structured JSON you feed everywhere else |
| **Claude Design** | Maintenance room screens + Admin panel IA rethink | Cheap, instant visual iteration. Output = **visual spec**, not importable code |
| **Claude Code** | All real implementation in the `family-hub` repo | The card is custom vanilla JS + your own CSS/theme system; Code translates Design specs into it |
| **Claude Chat (regular)** | Glue: reviewing outputs, drafting handoff specs, decisions | Cheapest surface; use it for thinking, not building |

**The one rule that shapes everything:** Design's React/HTML prototype cannot be dropped into the Family Hub card. The handoff artifact is *screenshots + the design's exported code as reference + a written UI spec*. Code reimplements in your card's patterns (`rooms/*.js`, CSS parts, themes). Plan accordingly: backend never waits on Design.

## 1. Usage Strategy (Pro plan)

- One shared usage pool across claude.ai chat, Claude Code, and Desktop. Session limits reset every 5 hours; a weekly cap sits on top.
- **Don't stack heavy surfaces in the same window.** Research mode and long Code sessions are the two big burners — run them in different 5-hour windows.
- **The "Family Hub v0.8" claude.ai Project** holds: scope doc **v5**, **seed-schema.json v2**, **seed_library.json v3.0.0** (final shipped, big-ticket table embedded), B15-GAP-ANALYSIS.md, B2-VERIFICATION.md, B3-RECORD.md, and (once produced) the design handoff spec. Project knowledge is cached and doesn't re-count against limits on reuse. **Keep exactly one library file in project knowledge** — the canonical one — so no session grabs a stale artifact.
- **Claude Code habits:** Sonnet default for implementation; strongest model (or opusplan) for architecture/planning. Plan mode (Shift+Tab) before big changes. `/clear` between distinct tasks. Keep `CLAUDE.md` tight. Check `/status` for remaining allocation.
- **Model per surface:** Research → default top model with Research on · Design → self-managed · Code planning → strongest available · Code implementation → Sonnet · Chat glue → Sonnet-class.

## 2. Phase Map (v2 — B-first ordering)

```
WINDOW-SIZED SESSIONS (each ≈ one sitting, one 5-hr window or less)

Phase B (Chat)      ✅ COMPLETE: B1 ─ B1.5 ─ B2 ─ B2.1 ─ B3 → seed_library.json v3.0.0 (shipped)
Phase A (Code)      A1 Foundations plan ─ A2 Module framework ─ A3 Export/Import ─ A4 Maintenance backend ─ A5 Migration
Phase C (Design)    C1 Admin IA rethink ─ C2 Maintenance room screens ─ C3 polish + handoff spec    [C2 after B3]
Phase D (Code)      D1 Seed import + sensors/websocket ─ D2 Room UI ─ D3 Admin tab ─ D4 Notifications ─ D5 Chores bridge
Phase E (v0.8.x)    E1 Cost capture + reports ─ E2 Sinking funds ─ E3 Inspect-Plan-Do ─ E4 Vendor book ─ E5 Printable plan
```

**Ordering note (Jim's call, 2026-07-18): complete Phase B before returning to Phase A.** This is fully supported — B has zero dependency on A. The only original coupling ("Code can generate the schema from the data model in A4") is moot: schema v2 is settled and is now an **input contract for A1** (the Home Profile must implement the v2 applicability vocabulary — presence tags + exclusive variant groups). C1 (admin IA wireframes) remains free to run any time as a light session; C2 still waits on B3 for real data.

---

## 3. Phase A — Claude Code: Foundations (runs after Phase B completes)

### A1 — Architecture & plan session
*Model: strongest available / opusplan. Plan mode ON. One session.*

> I'm starting Family Hub v0.8.0: carving Maintenance out of Chores into its own module, per the attached scope document (home-maintenance-module-scope.md **v3** — read it fully first, especially Sections 2–4 and 10). Before writing any code, produce a written implementation plan covering:
> 1. **Module framework**: a registry where each module (chores, meals, maintenance, smarthome, calendar) can be enabled/disabled in config_flow options at runtime; disabled modules register no services/sensors and their card rooms show as unavailable. Audit the current mixin architecture and propose the minimal refactor to support this.
> 2. **Event bus**: internal pub/sub for cross-module messages (external_task_offer / _complete / _revoke) with the rule that a message to a disabled module is silently dropped and publishers hide affordances when the subscriber module is off.
> 3. **Versioned export/import**: schema-version-stamped JSON export of all module data, and stepwise forward migrators on import. This becomes ecosystem infrastructure.
> 4. **Maintenance data model**: collections for tasks, products, completions, vendors, funds per scope Section 3, including schedule_mode (from_completion vs calendar_anchored), the inspect_plan_do workflow states, and a **Home Profile that implements seed-schema.json v2's applicability vocabulary** (presence tags + exclusive variant groups like tank/tankless water heater) with re-evaluation on any profile change.
> 5. **Migration**: one-time move of category_label=="Maintenance" chores into the new collection, then removal of the _chore_is_maintenance() seam.
> Sequence these into separate work sessions, flag risks, and update ARCHITECTURE.md, DECISIONS_LOG.md, and ROADMAP.md with the plan. Do not implement yet.

### A2–A5 — Implementation sessions
*Model: Sonnet. One numbered item from A1's plan per session, `/clear` between.*

> Implement step N from the v0.8.0 plan in ARCHITECTURE.md/ROADMAP.md (the module framework / event bus / export-import / maintenance backend / migration). Follow the existing mixin + data_store + services.yaml patterns. Write/extend tests where the repo has them, run the build, and update DECISIONS_LOG.md with anything you decided along the way. Keep sensor.family_hub_maintenance_due/_overdue contracts intact.

Acceptance for Phase A: modules toggle cleanly; export/import round-trips your current live data; maintenance services (add/update/complete/snooze/reschedule/skip/assign) work via Developer Tools; old chores-maintenance items migrated with history.

---

## 4. Phase B — Claude Chat: Seed Library Research

*Run inside the "Family Hub v0.8" Project.*

### B1 — The complete task list · ✅ COMPLETE
Delivered the universal curriculum with citations, surprise_factor flags, and nine documented interval disagreements. **Count correction:** the report claimed 92 tasks but delivered 69 records; caught and corrected during the B1.5 merge.

### B1.5 — Gap closure + schema v2 · ✅ COMPLETE (2026-07-18)
Driven by Jim's health/safety/expense criteria review. Delivered: **seed-schema.json v2** (variant applicability vocabulary + Home Profile mapping), **24 new tasks** (tankless water-heater set, radon, fire escape drill, gas connectors, main-shutoff exercise, well testing, appliance variants, and 12 scope-§5 tasks B1 missed), 13 retags (tank-WH gating; sump/deck/generator/irrigation correctly equipment-gated), three new interval-disagreement entries. **Canonical output: `seed_library.v2.json` — 93 validated tasks.** Full record: B15-GAP-ANALYSIS.md.

### B2 — Costs and effort pass · ✅ COMPLETE (2026-07-19, verified & merged)
Research delivered 2026 national pricing (Angi/HomeGuide/Fixr/Homewyse/Thumbtack + manufacturer/retail) and the big-ticket table with the mandatory tank/tankless split (DOE/ENERGY STAR/ANSI-DASMA primaries). **Caveat handled in the merge:** the report couldn't read the canonical file and reconstructed its task scaffold, so it was applied as a mapped pricing layer. Outcome: 14 tasks priced, 40 confirmed free, 10 linked to assets, 29 flagged `pending_b2_1`; all five corroboration flags resolved by citation; no interval changes. Canonical output: **`seed_library.v2.1.json`**. Full record: B2-VERIFICATION.md.

### B2.1 — Pricing mini-pass · ✅ COMPLETE (2026-07-19, executed at the front of B3)

> Using the canonical **seed_library.v2.1.json in project knowledge**, price ONLY the 29 tasks whose `cost_status` is `pending_b2_1` — each record's sources field ends with a "B2.1 needed:" line saying exactly what to price. They are: softener_salt_check, washing_machine_clean, whole_house_water_filter, fridge_water_filter, garage_door_lube, hvac_heating_tuneup, chimney_inspection, fire_extinguisher_pro_service, termite_inspection, roof_inspection, generator_test, tree_limb_clearance, ro_prefilter_replace, dishwasher_deep_clean, irrigation_backflow_test, septic_inspect, pool_service_annual, exterior_wash, radon_test, well_water_test, humidifier_pad_replace, carpet_deep_clean, tankless_pro_service, co_alarm_replace, septic_pump, grout_reseal, deck_reseal, smoke_alarm_replace, dryer_flex_duct_replace. Use 2026 national averages with named citations (same standard as B2); set est_cost_pro to null only for tasks genuinely never hired out; flip each record's cost_status to `priced_b2_1`. Also: add the four missing big-ticket assets (smoke/CO **detector fleet**, **expansion tank**, **pressure-regulator valve**, **sump pump**) with current_replacement_cost, cost_range, expected_life_years, planning_life_years, cost_basis_year 2026, and citations; **corroborate the garage_opener asset** (~$450 installed, 10–15 yr — currently anchored only indirectly); and if a well-sourced long-run home-maintenance cost inflation figure surfaces, cite it as the recommended profile default (currently 3.5% by convention). Do not touch priced records, intervals, or any other field. Output the deltas as a JSON patch list (task_id → changed fields) I can merge and verify.

### B3 — Desert Southwest pass + final assembly · ✅ COMPLETE (2026-07-19)

> Final pass on the priced canonical library (**seed_library.v2.1.json** + merged B2.1 deltas; verify no `cost_status: pending_b2_1` records remain — if any do, price them first at B2.1's citation standard): adjust for the Desert Southwest / Tucson AZ climate preset — monsoon-driven timing (pre-monsoon tree/roof/patio prep, post-monsoon roof inspection ~October), hard-water accelerations (**decide the tankless descale interval for Tucson: 6 months unsoftened vs 12 months with a functioning softener — document the rule**, plus tank flush/anode intervals for tank homes), dust-driven filter cadence, termite inspection as mandatory-annual, irrigation seasonal adjustment rhythm anchored to Tucson's calendar, and the Bermuda lawn program (fertilizer type/N-P-K by month, pre-emergent windows Feb & Oct, application timing around heat, overseed-vs-dormancy decision — cite AZ extension service; this also retro-fills lawn_mow_edge's citation). **Add the evaporative-cooler task set** (gated `evap_cooler`: spring startup, pad replacement, mid-season check, winterization — cite AZ extension/manufacturer guidance). Mark climate_tags accordingly. Then output the entire assembled library as **one final seed_library.json** I can download (this becomes the shipped repo file), plus a human-readable summary table I can review for gaps.

Deliverables — DELIVERED: `seed_library.json` v3.0.0 (repo + Project knowledge, replaces the v2.1 canonical; big-ticket table embedded, one-file rule) + review tables and the full decision record in B3-RECORD.md. 97 tasks, 15 assets, zero unpriced records, `climate_overrides` desert layer, evap-cooler set populated.

---

## 5. Phase C — Claude Design

Feed every Design project the same context pack (from Project knowledge / paste): 2–3 screenshots of the current Family Hub card (Command Center, Home Care drill-down, an admin tab), your theme CSS variables, and the relevant scope sections.

### C1 — Admin panel IA rethink (can start anytime)
*Project type: **Wireframe** first, then convert/rebuild as Prototype once the IA is settled.*

> I'm redesigning the admin panel of Family Hub, a Home Assistant family dashboard card. Attached: screenshots of the current admin panel and main card. The system is becoming modular: Chores (task/reward economy), Meals, Home Maintenance (new — tasks, products/inventory, vendors, costs/savings funds, home profile), Smart Home, Calendar, plus global settings (people, notifications, themes, data export/import, module on/off toggles). Current admin grew organically and needs a full rethink. Design the information architecture: top-level navigation, how module-specific admin sections nest, where global vs module settings live, and how a module's admin hides when the module is disabled. Wireframe fidelity — structure over polish. Optimize for a wall-mounted tablet (Echo Show 15 landscape) primary, phone secondary.

Iterate until the IA feels right, then: "Convert this to a polished prototype using the attached theme's dark palette and typography."

### C2 — Maintenance room screens (after B3)
*Project type: **Prototype**. This is the flagship.*

> Build an interactive prototype of a Home Maintenance module for Family Hub, a Home Assistant family dashboard (screenshots + theme attached — match its dark aesthetic, stat-strip pattern, section headers, and days-remaining badges). Screens, per the attached scope Section 9 (v3 — note the Settings screen includes the expanded Home Profile with equipment/variant questions):
> 1. Dashboard: stat strip (overdue/this week/this month), next-up list, YTD cost widget, sinking-fund health tile (green/amber/red), dismissible recommendation banner.
> 2. Schedule: week/month timeline plus a year-at-a-glance seasonal strip.
> 3. Task detail: how-to, effort, DIY vs pro cost, linked products with stock, completion history, vendor for pro tasks, action bar (Complete / Snooze / Reschedule / Skip / Assign — assign opens a person picker with points + due date).
> 4. Complete flow modal: who, DIY-or-pro, actual cost, minutes, products used, notes, optional photo — pre-filled from estimates, two taps for the common case.
> 5. Inspect result flow: "All good" vs "Needs work" → Plan builder (target date, auto supplies list, or pro mode + vendor pick).
> 6. Library browser: tasks grouped by frequency or category, enable toggles, "surprising items" highlighted.
> 7. Products & inventory: stock levels, linked tasks, reorder hints.
> 8. Costs & savings: planned vs actual, category breakdown, DIY savings, sinking-fund panel (future cost with inflation, required monthly, target-balance-today vs actual) — include the tank/tankless water-heater variant behavior, emergency repair fund.
> 9. Chores-board view: a kid's chore list showing a pinned "Home Maintenance" category on top with one assigned task, visually distinct from regular chores.
> Use this real seed data for content: [paste 15–20 representative tasks from the final seed_library.json — include a tankless task, a calendar-anchored monsoon task, and a couple of high-surprise items]. Primary display: wall tablet landscape; ensure the dashboard also works on phone.

### C3 — Handoff spec
When C2 is final, in the same Design chat:

> Produce a developer handoff document for this prototype: every screen's layout structure, spacing, component inventory, all colors/typography as CSS custom properties, state variations (overdue/due/upcoming, fund green/amber/red), and interaction notes (what each tap does). Format as markdown.

Save that spec + full-page screenshots of every screen. That bundle is what Code consumes.

## 6. Phase D — Claude Code: Implementation

*Model: Sonnet for all; plan mode before each session. One session per item; `/clear` between.*

**D1 — Seed + data plumbing:** "Add the final seed_library.json (v3.0.0 — includes cost_status, climate_overrides, and the embedded big_ticket_assets table) to the repo. Implement seed loading with Home Profile applicability filtering per seed-schema v2 (presence tags + exclusive variant groups; profile lives in options flow / a settings store and is editable any time — re-evaluating enables/disables tasks without touching history). Extend the websocket card model and sensor scalars for the maintenance room per the existing card_model patterns."

**D2 — Room UI:** "Rebuild src/card/rooms/maintenance.js from the attached design handoff spec and screenshots. Reimplement in our card's vanilla-JS render patterns and CSS parts — do not import React. Match the spec's layout and states; wire every action to the maintenance services. Add new CSS to the css/ parts following existing conventions, themable via the theme system." *(Attach the C3 spec + screenshots. Expect 2–3 sessions: dashboard+list, detail+complete flow, schedule+library.)*

**D3 — Admin tab:** same pattern, from the C1 spec.

**D4 — Notifications:** "Implement the notification engine per scope Section 6: tick-driven due/overdue evaluation honoring schedule_mode, escalation tiers, actionable HA companion notifications (Complete/Snooze/Open), Alexa Media Player announce hook, weekly digest, quiet hours, per-person routing config. Fire HA events for every state change so users can attach their own automations."

**D5 — Chores bridge:** "Implement the external-task bridge per scope Section 4 using the Phase A event bus: Maintenance assign publishes an offer; the chores module materializes a projection pinned in a 'Home Maintenance' category at top of the person's board; completion syncs both directions; Maintenance-side complete/cancel revokes the projection. Zero code imports between modules; graceful no-op when either module is disabled."

Then dogfood on your live HA for 1–2 weeks before Phase E.

## 7. Phase E — v0.8.x (same session pattern)

E1 cost capture + reports → E2 sinking funds (inflation math + target-balance-today + repair fund, **per-variant asset lives**) → E3 full Inspect-Plan-Do → E4 vendor book → E5 printable plan (generate the PDF layout in a Chat/Cowork session first if you want design help, then implement export in Code). Recommendation engine and the full Bermuda lawn program land in v0.9, with B3's lawn research already banked as the rules data.

## 8. Sequencing Cheat-Sheet (v2 — B-first)

| Sitting | Window plan |
|---|---|
| ✅ done | **Phase B complete**: B1 · B1.5 · B2 · B2.1 · B3 → `seed_library.json` v3.0.0 shipped |
| 1 | **C1** admin wireframes (cheap) · **A1** architecture session (strong model, plan mode) in a separate window |
| 2–4 | **A2–A5**, one per sitting |
| 5–6 | **C2** maintenance prototype iterations · **C3** handoff spec — C2 is now unblocked (real seed data exists; paste 15–20 tasks incl. a tankless task, a monsoon calendar_anchored task, an evap task, and high-surprise items) |
| 7–10 | **D1–D5**, one per sitting |
| — | Dogfood 1–2 weeks, then Phase E one item per sitting |

Rules of thumb: never Research + long Code session in the same 5-hour window; check Settings → Usage for your weekly reset time and save the heavy Code sessions for just after it; everything reusable goes in Project knowledge once, not pasted repeatedly; **exactly one seed library file lives in Project knowledge at any time** — now the final `seed_library.json` v3.0.0 (big-ticket table embedded).

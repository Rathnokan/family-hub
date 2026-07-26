# B2 — Cost/Effort Pass: Verification & Merge Record

**Date:** 2026-07-19 · **Status:** Phase B, B2 verified and merged → `seed_library.v2.1.json`
**Input:** B2 research report (compass artifact, 2026-07-19) · Canonical `seed_library.v2.json` (93 tasks)
**Output:** `seed_library.v2.1.json` (canonical, replaces v2) — 93 tasks + embedded 11-asset big-ticket table

---

## 0. Verdict

The B2 research itself is sound — pricing anchored to named 2026 cost guides, big-ticket lifespans anchored to DOE / ENERGY STAR / ANSI-DASMA primaries, and the mandatory tank-vs-tankless split delivered. **But the report's per-task JSON could not be used as delivered**: it admitted it never read the canonical file, and verification confirmed its task scaffold was reconstructed. It was applied as a *pricing layer* mapped onto the canonical records, exactly per its own "merge, don't replace" instruction. All four of its recommendations were executed, with the outcomes below.

## 1. Verification findings (report claims vs. canonical file)

| # | Claim / content | Finding | Resolution |
|---|---|---|---|
| 1 | Per-task JSON deliverable | **Reconstructed, not canonical.** IDs like `hvac_filter_replace`, `wh_anode_rod`, `tankless_descale`, `gfci_test`, `smoke_co_battery`, `ac_condenser_clean` don't exist in the canonical file. A blind merge would have added phantom tasks. | Mapped each record to its true canonical `task_id` (mapping table §3). `ac_condenser_clean` has no canonical counterpart; its tune-up anchor priced `hvac_cooling_tuneup` instead. |
| 2 | `concrete_paver_seal` interval "CORRECTED to 3–5 yr" | Canonical is **3 yr — already inside 3–5 yr**. The report's own threshold rule ("if already inside the range, make no interval change") voids the correction. | Interval unchanged. Placeholder citation replaced with Belgard/Unilock/Techniseal. |
| 3 | `fence_stain` interval "CORRECTED to 2–3 yr" | Canonical is **3 yr — already inside 2–3 yr**. Same threshold rule. | Interval unchanged. Placeholder replaced with Five Star Painting / Nortex / RMFP. |
| 4 | `pest_perimeter_walk` "quarterly, no change" | Canonical is a **monthly free visual walk** (`inspect_plan_do`), not a quarterly barrier treatment. The report corroborated the wrong task shape. | Monthly walk retained (IPM inspection practice, OSU Extension / EPA IPM). Quarterly-barrier economics documented as *spawned treatment work*; walk priced $0 DIY / pro null, with pro-plan context ($400–600/yr) in sources. |
| 5 | `interior_paint_touchup` "5–7 yr, no change" | Canonical is a **3-yr inspection** that spawns repaints — consistent with the report's own room-cycle data (kitchens/baths 3–4 yr, halls 2–3 yr). | 3-yr inspection retained; citation upgraded; $40 DIY touch-up / $400 per-room spawned repaint. |
| 6 | Big-ticket table (10 assets) | Solid primaries; conforms to schema intent. But 5 scope-§8 watch-list assets missing (opener, detector fleet, expansion tank, PRV, sump pump), and the garage-springs asset **double-counts** against task `garage_spring_service`. | Opener added from the anchor embedded in the springs record (flagged corroborate-B2.1). Other 4 → B2.1. Double-count guard written into both records (§5). |
| 7 | Rounding self-consistency | Gutter pro left at $168 despite the report's own $25 rounding rule; dryer vent at $145. | Rounded to $175 / $150; raw averages preserved in citations. |
| 8 | Effort refinements | Springs pro-only, tankless 75-min Moderate, gutter/vent Moderate — **all already true in canonical** (B1.5 got there first). Paver/fence minutes were genuinely low. | Only two effort edits: `concrete_paver_seal` 180→240 min, `fence_stain` 240→300 min. |
| 9 | Coverage | Only ~17 of 93 tasks have real cited anchors; the report proposed filling the rest "from category anchors." | Per project rule 6 (never invent costs) and the report's own fallback ("flag for a follow-up mini-pass rather than inventing a number"): 29 tasks flagged `pending_b2_1` (§4). |

**Net interval changes: zero.** All five corroborate-in-B2 flags are resolved via citation replacement; the flagged sources now carry named authorities.

## 2. What changed in `seed_library.v2.1.json`

Fields touched, machine-verified against v2.0.0 (diff audit passed — no other field of any record changed; sources are append-only; intervals, names, descriptions, applicability untouched):

- `est_cost_diy` / `est_cost_pro` per the classification below
- `effort.diy_minutes` on exactly 2 tasks (paver 240, fence 300)
- `sources` — B2 citations appended, nothing deleted
- **New per-task field `cost_status`** (schema v2.1 additive, non-breaking) — because after pricing, a bare `0` is ambiguous. Legend (also embedded in the file):
  - `priced_b2` (14) — cited 2026 values
  - `confirmed_free_b2` (40) — occurrence genuinely $0 DIY (inspections/tests/household supplies); `est_cost_pro: null` = never hired out standalone
  - `linked_to_asset` (10) — replacement cost lives in the big-ticket table, deliberately kept **off** the task (§5)
  - `pending_b2_1` (29) — **unpriced; the 0s are placeholders, not "free"**
- New library metadata: `library_version: 2.1.0-priced`, `date: 2026-07-19`, `pricing_basis`, `cost_status_legend`, and the embedded `big_ticket_assets` table

## 3. Pricing applied (report → canonical mapping)

| Canonical task_id | Report id | DIY | Pro | Note |
|---|---|---|---|---|
| lawn_mow_edge | (same) | $5 | $50 | per mow; pro $30–80 range |
| pest_perimeter_walk | (same) | $0 | null | see finding 4 |
| interior_paint_touchup | (same) | $40 | $400 | pro = spawned per-room repaint |
| concrete_paver_seal | (same) | $120 | $700 | 240 min |
| fence_stain | (same) | $80 | $800 | 300 min |
| hvac_filter_check | hvac_filter_replace | $20 | null | per filter replaced; check itself free |
| water_heater_flush | (same) | $15 | $150 | pro $75–250 |
| water_heater_anode_inspect | wh_anode_rod (partial) | $0 | null | inspection only; confirmed free |
| water_heater_anode_replace | wh_anode_rod | $40 | $250 | rod $20–50; pro $150–350 |
| tankless_descale_flush | tankless_descale | $30 | $200 | + one-time $99–150 reusable kit |
| gutter_clean | (same) | $20 | $175 | Angi avg $168, rounded |
| dryer_vent_clean | (same) | $30 | $150 | avg $145, rounded; 6-mo cadence kept (family of 5) |
| gfci_afci_test | gfci_test | $0 | null | free |
| ceiling_fan_reverse | (same) | $0 | null | free |
| smoke_co_alarm_test | smoke_co_battery | $0 | null | test free; ~$10–20/yr batteries via product record |
| hvac_cooling_tuneup | ac_condenser_clean | $0 | $150 | tune-up $75–200 incl. coil clean |
| garage_spring_service | (big-ticket anchor) | $0 | $350 | pro-only; double-count guard §5 |
| ro_membrane_replace | (RO asset note anchor) | $75 | null | membrane $50–100 |

Plus 40 tasks confirmed genuinely free (visual inspections, button tests, valve exercises, household-supply cleanings) — each with a one-line classification rationale appended to its sources.

## 4. Pending — the B2.1 mini-pass (29 tasks + 4 assets)

No cited anchor existed in the B2 report for these; per rule 6 they were flagged, not guessed. Mostly two shapes: **consumable retail prices** (filters, pads, sealers, cleaners, salt, alarm units) and **pro service calls** (heating tune-up, chimney, termite, septic, backflow test, carpet extraction, tankless pro service, house wash, tree trimming, generator service, roof inspection, pool service, extinguisher certification).

`softener_salt_check, washing_machine_clean, whole_house_water_filter, fridge_water_filter, garage_door_lube, hvac_heating_tuneup, chimney_inspection, fire_extinguisher_pro_service, termite_inspection, roof_inspection, generator_test, tree_limb_clearance, ro_prefilter_replace, dishwasher_deep_clean, irrigation_backflow_test, septic_inspect, pool_service_annual, exterior_wash, radon_test, well_water_test, humidifier_pad_replace, carpet_deep_clean, tankless_pro_service, co_alarm_replace, septic_pump, grout_reseal, deck_reseal, smoke_alarm_replace, dryer_flex_duct_replace`

Each carries a `B2.1 needed:` line in its sources saying exactly what to price. **Missing big-ticket assets for B2.1:** detector fleet, expansion tank, pressure-regulator valve, sump pump (their watch tasks are `linked_to_asset` with a PENDING note), plus corroborating the `garage_opener` anchor. The updated implementation plan (v3) contains the ready-to-run B2.1 prompt.

## 5. Cost-model decisions locked in this merge

**Anti-double-count rule.** Scope §8 computes two parallel money streams: the *planned baseline* (annualized task costs) and the *sinking fund* (big-ticket accrual). Any dollar appearing in both overstates the cost of ownership. Therefore:
- All 9 `*_replace_watch`-class tasks + `exterior_repaint` carry $0 / null with a pointer to their `asset_id`. The money lives in the fund.
- The one deliberate exception is **garage springs**, priced on the task ($350, it's how you actually experience it — a service call) *and* present as an asset per scope §8's watch list. Both records carry an explicit guard; **recommendation: fund accrual OFF for `garage_door_springs` by default** (small-ticket; the task covers it). Same logic will apply to the opener if you'd rather task-price it — flag for your call, easy either way.
- `hvac_replace_watch` links to *both* HVAC assets; the Home Profile heating answer selects which one is active (heat pump vs AC+furnace) — same pattern as tank/tankless.

**Future costs (your inflation note).** Locked convention, now written into the library file and scope §8: **stored costs are nominal 2026 USD** (`cost_basis_year: 2026` on every asset) and **future cost is computed, never stored** — because it depends on remaining life at the moment of viewing. `future_cost = current_replacement_cost × (1 + i)^years_remaining`, inflation configurable in the Home Profile (scope's 3–4% band; recommend **3.5%** default until B2.1 sources a better figure). Each asset also gained `planning_life_years` — the single integer the fund math amortizes over (midpoint convention; tank **12** vs tankless **20** per the report's rec #3, AC/furnace 15 because the AC half is life-limiting in AZ).

Illustrative full-life projections (what a from-new asset costs at end of planning life — the module computes the real number from actual asset age):

| Asset | 2026 cost | Life | @3% | @3.5% | @4% |
|---|---|---|---|---|---|
| Water heater — tankless (yours) | $3,500 | 20 | $6,321 | $6,964 | $7,669 |
| Water heater — tank | $1,650 | 12 | $2,353 | $2,493 | $2,642 |
| HVAC — AC + gas furnace (yours) | $11,500 | 15 | $17,917 | $19,267 | $20,711 |
| HVAC — heat pump | $13,000 | 13 | $19,091 | $20,331 | $21,646 |
| Tile roof underlayment | $12,000 | 20 | $21,673 | $23,877 | $26,293 |
| Exterior repaint (stucco) | $4,500 | 7 | $5,534 | $5,725 | $5,922 |
| Carpet (whole home) | $7,500 | 12 | $10,693 | $11,333 | $12,008 |
| Garage springs | $350 | 8 | $443 | $461 | $479 |
| Garage opener | $450 | 12 | $642 | $680 | $720 |
| Water softener | $2,000 | 12 | $2,852 | $3,022 | $3,202 |
| RO system | $500 | 12 | $713 | $756 | $801 |

The takeaway that motivated your note, in numbers: a household planning against the 2026 sticker for a tankless replacement would arrive ~$3,200–$4,200 short at year 20. The `target_balance_today` math already compounds this correctly because it works from `future_cost`.

**Forward-cost caveats carried from B2:** the R-410A→R-32/R-454B refrigerant transition is actively inflating HVAC pricing beyond general inflation, and 25C tax credits are "may apply, not guaranteed" — both noted on the HVAC asset records.

## 6. Canonical file structure & commit checklist

- **`seed_library.v2.1.json`** — THE library (replaces v2.0.0). Tasks + embedded `big_ticket_assets` in one file, keeping the one-library-file rule airtight; B3 consumes and replaces this file.
- The B2 compass artifact — repo audit trail only; do **not** add to project knowledge (this document is the record).

1. Repo: add `seed_library.v2.1.json`, this doc; keep the compass artifact under `research/` if you want the audit trail.
2. Project knowledge: **replace** `seed_library_v2.json` with `seed_library.v2.1.json`; **add** this doc; **replace** scope doc with v4, implementation plan with v3, and project instructions with the updated txt (all in this delivery).
3. Remove the B1.5 patch file from project knowledge if it's still there (stale-grab risk — it was in this session's project files).

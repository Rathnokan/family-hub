# B2.1 + B3 — Pricing Mini-Pass & Desert Southwest Climate Pass

**Date:** 2026-07-19 · **Status:** Phase B COMPLETE. Output: **`seed_library.json` v3.0.0 — the final shipped library** (replaces `seed_library.v2.1.json`)
**Executed per:** implementation plan v3 (B2.1 folded into the front of B3, as the plan allows) · All pricing at the B2 citation standard (rule 6: nothing invented)

---

## 0. What shipped

**97 tasks** (93 canonical + 4 new evap-cooler tasks) · **15 big-ticket assets** (11 + 4 new) · **zero unpriced records** — every task carries a cost_status of priced_b2 (14), priced_b2_1 (29), priced_b3 (4), confirmed_free_b2 (40), or linked_to_asset (10). Additive schema v2.2 field: `climate_overrides` (per-preset recurrence/anchor/note applied only when the Home Profile climate preset matches). All 93 original task_ids, names, descriptions, applicability tags, and **base recurrences are machine-verified unchanged**; sources remain append-only.

## 1. B2.1 — the 29 pending records, priced (all cited, 2026 national)

| Task | DIY | Pro | Anchor |
|---|---|---|---|
| hvac_heating_tuneup | $0 | $125 | HomeGuide $70–200, ~$130 avg; Carrier concurs |
| chimney_inspection | $0 | $175 | HomeGuide Level 1 $100–250 incl. sweep (NFPA 211 annual) |
| fire_extinguisher_pro_service | $0 | $50 | Angi/HomeGuide $40–100; home units often replaced instead |
| termite_inspection | $0 | $125 | LawnStarter ~$130 avg; Phoenix $75–200; often free w/ upsell |
| roof_inspection | $0 | $150 | HomeGuide physical $75–200; Angi $250 avg all types |
| septic_inspect / septic_pump | $0 | $250 / $425 | iBuyer basic $200–300; Angi pump avg $428 |
| irrigation_backflow_test | $0 | $100 | Angi $70–90/test; HomeGuide $30–300 |
| carpet_deep_clean | $60 | $250 | Angi $182 avg; whole-house $125–575; rental $45–80 |
| exterior_wash | $0 | $300 | HomeGuide $170–360 ($265 avg); Angi $311 |
| tree_limb_clearance | $0 | $450 | Angi/NerdWallet ~$460 avg; Phoenix ~$600 |
| generator_test | $0 | $250 | Service visit $175–400; $200–600/yr (Angi) |
| pool_service_annual | $0 | $200 | Fixr one-time $90–270; plans $80–150/mo noted |
| well_water_test | $50 | $250 | Lab panel $40–100; county free–$60; pro w/ inspection $250–550 |
| radon_test | $25 | $150 | Kit $10–25 + lab $10–40; pro $145+ (Angi) |
| tankless_pro_service | $0 | $200 | Fixurge $150–250 (B2 anchors reused) |
| deck_reseal | $120 | $400 | HomeGuide 12×12: DIY $59–176 / pro $226–582 |
| Consumables (13 tasks) | $5–$75 | null | Salt $5–10/bag · Affresh ~$2/tab · cartridges $10–30 · fridge filter ~$40 OEM (CR) · lube $6/can · RO set $70–80/yr · humidifier pad $15 (AprilAire) · alarms $40/unit · grout sealer qt $10–34 · duct $12–40 |

**New assets:** detector_fleet $350 (NFPA-count derivation × cited unit prices), expansion_tank $300 (Angi $90–350 / HomeGuide $300–800, life 5–10), prv $550 ($400–700 trade guides; **life figure aligned to the 12-yr watch task — corroborate with a named source eventually**), sump_pump $550 (Angi $309–755, life 7–10). **Opener corroborated:** $450 pt confirmed (HomeGuide $300–900 installed, Angi avg $379, life 10–15 Modernize) — flag cleared.

**Inflation default (sourced, closes the B2.1 open item):** BLS CPI *Repair of household items* averaged **5.12%/yr 1997–2024** vs 2.51% overall CPI; trade-labor growth running ~4–5%/yr. Equipment (big-ticket) tracks closer to general inflation than repair services do, so the recommended profile default moves **3.5% → 4.0%** (scope band's top), configurable as always. At 4%, Jim's tankless replacement projects to **$7,669 at year 20** vs $3,500 today.

## 2. B3 — Desert Southwest / Tucson climate layer

**Mechanism:** `climate_overrides.desert_southwest` per task — applied only when the Home Profile climate preset is desert_southwest. Universal values stay intact underneath, so the library still serves any future non-desert user. Only **one recurrence override exists**; everything else is anchors and guidance.

**The tankless rule (documented decision, per B1.5 disagreement #10):** descale every **6 months on unsoftened Tucson water; 12 months only with a verified, functioning softener**. Basis: Rinnai's hard-water guidance (already cited on the record) + Tucson supply classified hard-to-very-hard by Tucson Water's own parameter guidance, running ~11–13 gpg city-wide (CAP-heavy areas reported to 22 gpg) against the 7-gpg hard threshold. **Jim's home has no softener on file → his cadence is 6 months.** The Home Profile softener answer flips it.

**Monsoon anchors (NWS: June 15 – Sept 30, fixed since 2008):** roof_inspection → **October (post-monsoon)** · tree_limb_clearance → **May–June (pre-monsoon)** storm prep · gutter_clean → **June + October** · exterior_wash → post-monsoon · hvac_filter_check → monthly-without-fail during dust/monsoon season · irrigation_controller_adjust → Jan/Apr/**Jul monsoon cutback**/Oct rhythm · pest_perimeter_walk → watch for mud tubes post-rains · termite_inspection → **mandatory-annual posture** (AZ termite pressure; free inspections common) · water_heater_flush (tank homes) → hold 6-month cadence.

**Bermuda program (citations retro-filled; rules data banked for v0.9):** UA Cooperative Extension **az1817** (low-desert turf maintenance calendar — April green-up fertilization at 60°F soil, deep-infrequent irrigation, Jun–Aug dethatch/aerify, dormant-winter guidance), **az1683** (overseeding — late Sep Tucson / Oct ideal at 80–85°F days, perennial rye green Oct–May, no heavy N after Aug 31), **az1681** (desert mowing heights). These three pubs are the v0.9 lawn-program rules source; `lawn_mow_edge` now cites them directly. Feb/Oct pre-emergent windows remain a v0.9 recommendations-engine item — cite the AZ pre-emergent pub during that build.

**New evap-cooler task set (gated `evap_cooler`, desert-only, schema's reserved tag now populated — the profile question may now be exposed):** `evap_cooler_startup` (Apr–May; delay to ~85°F days per UA Cochise "Cool Rules" — halves water use), `evap_pad_replace` ($40 aspen set; rigid media $72–119), `evap_midseason_check` (July; kid-assignable), `evap_winterize` (October; drain/vinegar/dry/cover). Pro startup or winterize ~$100 (AZ-market). Cooler life 15–20 yr in AZ; **no evap big-ticket asset added** (no replacement-cost anchor gathered; add if a profile ever enables it — Jim's home has none).

## 3. Decisions & residual flags

1. **Zero pending records remain** — B3's gate condition is satisfied within this pass.
2. PRV asset life is the only planning figure not anchored to a named source (aligned to the canonical 12-yr watch interval); low-stakes, flagged in the record itself.
3. Radon pro price added ($150) alongside the $25 kit; kit is the recommended homeowner path.
4. **Emergency-preparedness kit checks: still Jim's call** (scope §12.5) — deliberately NOT added. One line in a future session adds them if wanted.
5. Rename decision (Quests/Missions) still open before v0.8.0 strings work.
6. Per-variant note: `hvac_replace_watch` and the sinking fund resolve to `hvac_ac_furnace` for Jim (gas furnace profile); `detector_fleet` is universal and now fund-eligible.

## 4. Review tables

### Library at a glance (97 tasks · 15 assets)

| Frequency | Tasks | | Category | Tasks | | Cost status | Tasks |
|---|---|---|---|---|---|---|---|
| Annual/2-yr | 39 | Plumbing | 29 | confirmed_free_b2 | 40 |
| Semi-annual | 15 | Exterior | 17 | priced_b2_1 | 29 |
| Monthly | 12 | Appliances | 12 | priced_b2 | 14 |
| Watch (8-25 yr) | 11 | Electrical/Safety | 12 | linked_to_asset | 10 |
| 2-5 yr | 9 | HVAC | 11 | priced_b3 | 4 |
| Quarterly | 7 | Interior | 8 |  |  |
| Weekly/biweekly | 4 | Landscape/Irrigation | 5 |  |  |
|  |  | Pest | 2 |  |  |
|  |  | Seasonal | 1 |  |  |

Profile-gated: 41 · universal: 56 · desert-southwest-only: 4 · with desert overrides: 11

### Annualized planned-cost baseline (priced tasks, universal defaults, default_mode path)

| Path | $/yr |
|---|---|
| All-DIY (materials only) | $1,450 |
| Default modes (pro where pro-only) | $2,801 |

### Big-ticket table (15 assets, 2026 basis)

| asset_id | 2026 cost | Range | Life | Plan yrs |
|---|---|---|---|---|
| wh_tank | $1,650 | $1,200-$3,100 | 10-15 | 12 |
| wh_tankless | $3,500 | $2,400-$5,600 | 15-20 | 20 |
| hvac_heatpump | $13,000 | $9,400-$16,750 | 12-15 | 13 |
| hvac_ac_furnace | $11,500 | $8,000-$15,000 | 12-20 | 15 |
| roof_tile_underlayment | $12,000 | $4,000-$18,000 | 20-30 | 20 |
| exterior_repaint_stucco | $4,500 | $3,600-$7,200 | 5-10 | 7 |
| carpet_whole_home | $7,500 | $4,500-$12,000 | 8-15 | 12 |
| garage_door_springs | $350 | $250-$500 | 7-10 | 8 |
| garage_opener | $450 | $300-$900 | 10-15 | 12 |
| water_softener | $2,000 | $1,200-$3,800 | 10-15 | 12 |
| ro_system | $500 | $300-$950 | 10-15 | 12 |
| detector_fleet | $350 | $200-$600 | 10-10 | 10 |
| expansion_tank | $300 | $100-$600 | 5-10 | 8 |
| prv | $550 | $300-$1,000 | 10-15 | 12 |
| sump_pump | $550 | $300-$1,200 | 7-10 | 8 |

The $2,801/yr default-mode baseline + ~$1,500–2,500/yr sinking-fund accrual (profile-dependent) lands total cost-of-ownership right in the industry's 1–2%-of-home-value band — a good sanity check that the numbers are coherent end-to-end.

## 5. Commit checklist

1. Repo: **add** `seed_library.json` (this becomes the shipped file the integration loads), **add** this doc; keep v2.1 in repo history only.
2. Project knowledge: **replace** `seed_library_v2.json`/`seed_library.v2.1.json` with `seed_library.json` (one-library-file rule), **add** this doc, **replace** scope (v5), plan (v4), and project instructions with this delivery's versions.
3. **Phase B is complete.** Next sitting per plan v4: **C1** admin wireframes (light) and/or **A1** architecture session in Claude Code (strong model, plan mode) — schema v2 + the v2.2 additive fields (`cost_status`, `climate_overrides`, big-ticket `planning_life_years`/`cost_basis_year`) are the A1 input contract.

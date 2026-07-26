# B1.5 — Seed Library Gap Closure & Schema v2 (rev 2)

**Date:** 2026-07-18 · **Status:** Phase B, between B1 (universal research) and B2 (cost pass)
**Rev 2 supersedes rev 1:** corrects the library count and consolidates everything into one canonical file.

---

## 0. ⚠️ Count correction (rev 2)

The B1 research report **claimed 92 tasks, but delivered 69 records** — its own tier-count summary line (3+8+6+9+27+9+8) sums to 70, and the JSON blocks contain 69. This was an internal inconsistency in the research output, caught during the canonical merge. Corrected figures:

| | Tasks |
|---|---|
| B1 actual records | 69 |
| B1.5 new tasks | 24 |
| **Canonical library (`seed_library.v2.json`)** | **93** |
| Target range | 80–120 ✓ |

Validated distribution: Annual/2-yr 35 · Semi-annual 15 · Monthly 12 · Watch (8–25 yr) 11 · 2–5 yr 9 · Quarterly 7 · Weekly/biweekly 4. By category: Plumbing 29, Exterior 17, Appliances 12, Electrical/Safety 12, Interior 8, HVAC 7, Landscape/Irrigation 5, Pest 2, Seasonal 1. Profile-gated tasks: 37; universal: 56. All 93 records machine-validated: unique task_ids, applicability tags all in the v2 vocabulary, costs zeroed, enums conformant.

## 1. Canonical file structure (what to commit where)

- **`seed_library.v2.json`** — THE library. B1's 69 records with all 13 retags applied, plus the 24 B1.5 tasks, one flat validated array. **B2 and B3 work from this file only.**
- **`seed-schema.json`** — v2, full replacement of v1.
- **`seed-library-b15-patch.json`** — now historical (its content is folded into the canonical file). Keep in the repo for the audit trail or delete; do NOT keep it in project knowledge, so future sessions can't grab the wrong file.
- **This document** — project record of what changed and why.

## 2. Why this patch exists

Jim's health/safety/expense-avoidance review of B1 exposed:
1. **Tankless water heaters entirely uncovered** — all B1 water-heater tasks were tank-specific, and Jim's home is tankless.
2. **v1 applicability couldn't express appliance variants** (tank vs tankless), and several B1 tasks that should be equipment-gated shipped as universal (sump pump, deck sealing, generator, irrigation backflow) — the Home Profile could never disable them.
3. **Missing health/safety and scope-§5 tasks** — radon, fire drill, gas connector, main shutoff, well testing, mowing, pest walk, sprinkler check, controller adjustment, garage lube, window/screen wash, carpet cleaning, countertop seal, interior touch-up, concrete seal, fence stain.

## 3. What changed

### Schema v2 (full replacement)
- `schema_version` 1 → 2; applicability formalized into `presence_tags` + exclusive `variant_tag_groups` (single-select profile questions).
- New presence tags: `sump_pump, well_water, irrigation, lawn, wood_deck, wood_fence, stone_counters, tile_surfaces, humidifier, mini_split, generator, gas_service, evap_cooler` (evap reserved for B3).
- New variant groups: **water_heater_type** (`tank_water_heater`/`tankless_water_heater`); reserved **heating_type** and **dryer_fuel** (no gated tasks yet — heating tune-up and dryer-vent tasks correctly apply to all variants; a gas furnace/dryer answer auto-resolves `gas_service`).
- Breaking fix: v1 ad-hoc `tile` → `tile_surfaces`.
- Big-ticket table: water-heater asset **must be split tank (10–15 yr) vs tankless (~20 yr)** — expected life drives `target_balance_today`, so this is settled before B2 prices assets. Water softener (10–15 yr) added to the asset list.

### Library (24 new, 13 retagged — all folded into the canonical file)
- **Tankless (4):** `tankless_descale_flush` (annual; 6-mo hard water — Rinnai), `tankless_inlet_filter_clean`, `tankless_pro_service` (1–2 yr), `tankless_replace_watch` (~20 yr).
- **Health & safety (5):** `radon_test` (2 yr, EPA), `fire_escape_drill` (2×/yr, NFPA — kid-assignable, 10 pts), `gas_connector_shutoff_check` (annual, CPSC), `main_shutoff_exercise` (2×/yr), `well_water_test` (annual, EPA/CDC, gated).
- **Appliance variants (3):** `fridge_water_filter` (6 mo), `humidifier_pad_replace` (annual, gated), `minisplit_filter_clean` (monthly, gated).
- **Scope-§5 alignment (12):** `lawn_mow_edge`, `pest_perimeter_walk`, `sprinkler_visual_check`, `irrigation_controller_adjust` (quarterly, calendar-anchored, EPA WaterSense), `garage_door_lube` (6 mo, LiftMaster), `window_screen_clean`, `carpet_deep_clean` (12 mo, warranty-preservation framing per Mohawk/Shaw), `countertop_seal_check`, `interior_paint_touchup`, `concrete_paver_seal`, `fence_stain`, `softener_replace_watch`.
- **Retags (no content changes):** 7 tank-WH tasks → `tank_water_heater`; sump tasks → `sump_pump`; `grout_reseal` → `tile_surfaces`; `deck_reseal` → `wood_deck`; `generator_test` → `generator`; `irrigation_backflow_test` → `irrigation`.

### Interval disagreements added (extends B1's list of 9)
10. **Tankless descale — annual vs semi-annual.** Rinnai: at least annually; hard-water guidance: 6 months; softened/small-household sources stretch to 2–3 yr. **Default 12 months universal**; B3 decides Tucson: 6 months unsoftened, 12 with softener.
11. **Carpet cleaning — 12 vs 18 months.** Shaw 12–24, Mohawk warranty minimum 18. **Default 12 months** — satisfies both warranties with margin.
12. **Mini-split filters — 2 weeks vs monthly.** Manufacturers say as often as 2 weeks in peak season. **Default monthly** (step up with pets/dust).

### Honesty flags (B2 must corroborate while pricing)
Five records cite the scope doc plus a conventional industry range rather than a single named authority: `lawn_mow_edge`, `pest_perimeter_walk` (leans on the termite citation), `interior_paint_touchup`, `concrete_paver_seal`, `fence_stain`. Intervals are conventional and low-risk; each is explicitly flagged in its `sources` field. Nothing invented.

## 4. Scope doc §3.4 Home Profile additions (integrated in scope v3)

New profile questions, each resolving applicability tags: water heater type (tank/tankless — single-select), gas service (auto-set from any gas appliance answer), primary heating (reserved), dryer fuel (reserved; gas → gas_service), sump pump, water source (municipal/well), irrigation, lawn, wood deck, wood fence, stone counters, tiled surfaces, humidifier, mini-splits, generator, evaporative cooler (B3).

Jim's profile resolves to: tankless ✓, gas furnace → gas_service ✓, electric dryer, no sump, municipal water, irrigation ✓, tile_surfaces ✓ — suppressing all 7 tank-heater tasks and enabling the 4 tankless ones.

## 5. Remaining known gaps (deliberate)

- **Desert-Southwest localization** — B3 as planned (monsoon anchors, hard-water tightening incl. the tankless 6-mo call, evap cooler tasks, Bermuda program).
- **Emergency-prep kit checks** — adjacent to but outside "home maintenance"; scope decision for Jim (logged in scope v3 §12). Fire escape drill included (NFPA-anchored, kid-assignable).
- **Reserved tags without tasks:** `electric_heat`, `gas_dryer`, `electric_dryer`, `evap_cooler`; boiler/hydronic, well pump internals, radon mitigation fan, EV charger unmodeled — add if the product supports those profiles.
- **`fireplace` umbrella kept** (NFPA 211 annual inspection covers wood and gas alike).

## 6. Commit checklist

1. Repo + project knowledge: **replace** `seed-schema.json`; **add** `seed_library.v2.json`; **add** this doc.
2. Project knowledge: **remove** rev-1 gap analysis and do NOT add the patch file (avoid stale-file grabs); repo may keep the patch for audit trail.
3. **Replace** `home-maintenance-module-scope.md` with v3 and `family-hub-v080-implementation-plan.md` with the updated version (both in this delivery).
4. **Replace** the project instructions with the updated `project-instructions.txt`.

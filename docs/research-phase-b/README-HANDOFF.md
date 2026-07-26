# Family Hub v0.8.0 — Phase B handoff package

Everything needed to move from research (Phase B, complete) into build (Phases A/C/D). Generated 2026-07-19.

## Load these into the claude.ai Project knowledge (keep exactly these)

| File | Role | Action |
|---|---|---|
| **seed_library.json** | THE shipped seed library — v3.0.0, 97 tasks + 15-asset big-ticket table embedded. The file Phase D1 loads into the integration. | Replace any older seed_library in project knowledge with this. **Only one library file at a time.** |
| **seed-schema.json** | v2 schema the library conforms to; part of the A1 input contract. | Keep (unchanged since B1.5). |
| **home-maintenance-module-scope.md** | v5 — WHAT we're building. Phase B marked complete; §8 cost conventions locked (4.0% inflation). | Replace prior scope doc. |
| **family-hub-v080-implementation-plan.md** | v4 — HOW we're building it. B2.1+B3 marked done; next up C1 + A1, with ready-to-run prompts. | Replace prior plan. |
| **project-instructions.txt** | Updated standing rules; points at v3.0.0 and the superseded-file guard. | Replace the Project's custom instructions. |
| **B15-GAP-ANALYSIS.md** | B1.5 record (count correction, interval disagreements 10–12). | Keep. |
| **B2-VERIFICATION.md** | B2 merge record (reconstructed-scaffold caveat, anti-double-count rule, cost conventions). | Keep. |
| **B3-RECORD.md** | B2.1 + B3 record (all pricing citations, Tucson tankless 6/12 rule, monsoon anchors, UA Extension Bermuda pubs, review tables, commit checklist). | Keep. |

## Reference only — do NOT put in project knowledge

| File | Why keep it |
|---|---|
| **seed_library.v2.1.json** | Pre-B3 snapshot, for diffing/audit. Repo history only. Putting it in project knowledge risks a stale-file grab — the whole point of the one-library-file rule. |

## Files that do NOT exist yet by design (Phase A produces them in Claude Code)

`ARCHITECTURE.md`, `ROADMAP.md`, `DECISIONS_LOG.md`, `CLAUDE.md` — the A1 architecture session writes these into the **repo** from the plan (plan v4, A1/A2 prompts). They are outputs of Phase A, not inputs you carry in. Don't recreate them here.

## The A1 input contract (what the architecture session consumes)

seed-schema.json v2 **plus** the additive fields now in the library:
- per-task `cost_status` (priced_b2 / priced_b2_1 / priced_b3 / confirmed_free_b2 / linked_to_asset — **zero pending**)
- per-task `climate_overrides.desert_southwest` (recurrence/anchor/note, applied only when the Home Profile climate preset matches)
- per-asset `cost_basis_year` (2026) + `planning_life_years`; future cost computed at runtime, never stored
- library-level `climate_preset`, `cost_status_legend`, `pricing_basis`, `big_ticket_assets`

## Next two sittings (per plan v4)

- **C1** — admin IA wireframes in Claude Design (light/cheap session).
- **A1** — architecture/plan session in Claude Code: strongest model, **plan mode ON**, using the A1 prompt in the plan. Produces the four repo docs above. Do not implement in A1.

C2 (maintenance prototype) is now unblocked — real seed data exists; the plan says to paste 15–20 representative tasks (include a tankless task, a monsoon `calendar_anchored` task, an evap task, and a couple of high-`surprise_factor` items).

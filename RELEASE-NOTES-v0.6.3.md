# Family Hub v0.6.3 — Store Polish + Group Rewards

## Highlights

- **Group / shared rewards** — parents set up "chip in together" rewards. Kids see compact contributor pills, progress tracking, and a Chip In button.
- **Printable chore list** — admin Print button generates a self-contained HTML doc by assignee (great for the fridge).
- **Store goal tracking** — kids pick a reward to save toward; progress bar shows in the store tab and right rail on all themes.
- **Drag-to-reorder store items** — same drag mechanic already used for chores.
- **Reward icons / image upload** — store items support the FH icon picker + custom photo upload (canvas-downscaled to 128×128 data URL).
- **Store rate limits** — `max_per_period` + `period` fields; kids see "Available again Mon May 27" when blocked.
- **Rank-scaled point value** — `rank_ppd_ladder` setting; ranking up makes points worth more cents.
- **Reward categories** — group store items the same way chores are grouped.

## Changes by area

### Backend (`custom_components/family_hub/*.py`)
- `data_store.py`: `store_items` migration adds `sort_order`, `icon`, `category_label`, `max_per_period`, `period`, `is_group_reward`, `contributors`; `goal_item_id` on person records; `rank_ppd_ladder` setting; hard-delete service; `chip_in` service.
- `services.py`: new services — `set_goal`, `toggle_store_item_active`, `hard_delete_store_item`, `chip_in`; updated `add_store_item` / `update_store_item` schemas accept all new fields.
- `sensor.py`: per-person sensor exposes `goal`, `goal_item_id`, `dollar_value` (rank-adjusted), `streak_freezes_available`; store items carry `next_available`, `category_label`, `is_group_reward`, `contributors` (with `person_name`, `person_color`, `contributed_pts`, `target_pts`).
- `const.py`: new service name constants.

### JS card (`src/card/*.js`)
- **Group rewards full flow**: admin modal + inline panel both read/validate/save group reward toggle + contributor % sliders. `ok-edit-store-item-inline` dispatch case fully mirrors modal counterpart.
- **Compact contributor pills** (`htmlGroupContributorBars`): replaces tall vertical contributor list with single-line horizontal pills — avatar initial + `contributed/target` pts. Text-shadow on avatar initial ensures readability on any person color.
- **Chip In button** (`htmlChipInBtn`): per-kid action on group reward rows in all six themes.
- **Cache busting**: `BUILD_ID` timestamp baked per build via `gen-build-id.mjs`; appended to body URL so every build forces a fresh browser cache.
- **Icon upload**: `handleIconFileSelection()` — FileReader → canvas resize → data URL; `_normalizeIcon()` preserves `data:` URLs verbatim.
- **Drag precision**: insertion-line indicator at top/bottom edge of drag target.
- **Category grouping**: `groupByCategory()` drives both chore and reward section headers.
- **Daily progress bar** (`htmlDailyProgress`): `X / Y done today` header on all personal-page task tabs.
- **Streak freeze chip** (`htmlStreakFreezeChip`): 🧊 N freeze(s) in the right rail.
- **Store limit display** (`htmlStoreItemLimit`): "1 per week · Available Mon May 27" on kid store tabs.

### CSS / contrast
- Contributor pill backgrounds bumped from near-transparent (`.08` opacity) to `var(--fh-surface)` — pts text now always reads on an opaque surface.
- Avatar initial gets `text-shadow` dark halo — readable on any `avatar_color`.
- "Done" state color unified to `--fh-success` (`#30d158`) throughout.

## Notes

- `family_hub_data.json` is **not** touched by this release — migration runs automatically on first integration reload.
- Reload integration → hard refresh browser after updating.
- Kid-initiated "Propose sharing" flow (group reward proposals from kids) is wired on the backend but the kid-side proposal-creation UI is deferred to v0.6.4.

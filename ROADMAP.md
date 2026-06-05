# Family Hub — Roadmap & Planning

> Active scope, deferred backlog, and the long-term plan.
> Session operations (checklists, handoff, deploy) → [CLAUDE.md](CLAUDE.md).
> Decided architecture → [DECISIONS_LOG.md](DECISIONS_LOG.md). Bug tracker → [BUGS.md](BUGS.md).
> Per-release detail lives in `RELEASE-NOTES-v*.md` + git history — this file stays forward-looking.

---

## Universal constraints (apply to every release)

- **Preserve the HA integration contract.** Service schemas, sensor entity_ids, sensor attribute keys, config-flow entries, the integration lifecycle, and the Lovelace static-path registration are external contracts. Never break them for an internal win.
- **Do not rename** any public function, class, entity unique_id, service name, or sensor attribute key without explicit user approval.
- **Do not change behavior marked intentional** in [DECISIONS_LOG.md](DECISIONS_LOG.md).
- **Do not change const STRING VALUES** stored in the data file — only rename Python constant names if needed.
- **State what is changing and why** before editing each file.
- **If a fix is uncertain or touches >3 files**, list the affected files and pause for review.
- **Do not bump versions, commit, or push** without explicit "go" from the user.

> v0.7.0 deliberately voided 3 of these (single JSON file / sensor-attribute bus / 30 s poll) via a one-time backed-up migration. That was a one-off — **v0.7.1+ are normal additive releases**; the constraints apply normally again.

---

## Current status (2026-06-04)

- **v0.7.1 shipped** (tag `v0.7.1`, release published). Bug-swat off a full-codebase audit — see [BUGS.md](BUGS.md) "Fixed in v0.7.1".
- **`main` is a few commits ahead of the tag** (unreleased, rides the next bump): post-0.7.1 cleanup (hardening, JS/Python slug parity, dedup, dead-code removal, `services.yaml` for `add_task`) + the engineer-theme task-truncation fix.
- **Next:** a feature (user-directed) or the top open bug. Branch from `main`.

---

## Next up

### Open bug worth doing first (small, not a feature)
- **First-parent attribution.** Every admin action resolves the actor as `people.find(type==="parent")` → the *first* parent, so in a two-parent household everything logs as Jim. Needs the acting HA user mapped to a person (`hass.user.id` → `person.ha_user_id`) and threaded through the card's `_svc` calls + the admin/history action buttons. See [BUGS.md](BUGS.md) "Open — deferred".

### Open decisions (user's call — parked)
- **Task-instance retention:** `TASK_INSTANCE_RETENTION_DAYS = 30` in code (docs once said 60). Confirm 30 or bump it (affects how far back History + reversible-action buttons reach).
- **Weekly-points window:** the rank bar predicts using "since last Monday"; the server evaluates rank over "trailing 7 days ending on `rank_eval_weekday`". Pick the canonical window if the mismatch matters.

### Deferred efficiency / cleanup (carried from v0.7.0; all optional)
1. **Model/history runtime trim** — `build_card_model` still ships the ~977-entry `history_log` on `needs_attention`, refetched on every `data_rev` change. Bigger than it looks: `history_log` feeds the admin History view AND all 6 personal pages (`getWeeklyPts` header, per-person history tab, store-rail recent purchases). Right fix = lazy per-view fetch (new `family_hub/get_history` ws command, person-filtered) + async weekly-points header. Test all themes.
2. **Assets / upload service** — `family_hub.upload_asset` → writes `/config/www/family_hub/assets/<uuid>.<ext>`, records store the path (served at `/local/...`, survives integration updates), replacing the base64 `handleIconFileSelection` flow. Pairs with repopulating the (currently empty) reward store.
3. **Optional card-side splits** — `modals.js` / `modes-admin.js`. ⚠️ CODE: a missing cross-import is a silent JS ReferenceError that CI's ruff does NOT catch (ruff is Python-only). Low value; leave unless wanted.
4. **Tidy** — `ruff --select F401 --fix` to drop the mixins' intentional over-imports (cosmetic).

---

## Feature backlog (needs design before building)

### Group rewards expansion (was v0.6.7)
- **Group subscriptions** — siblings sharing one Roblox / Game Pass sub. Open Qs: cost split (even / weighted / parent-set)? Does one contributor's lapse fail the whole group or just their share? Cancel rights?
- **Group streak reward** (Jim's request) — a no-cost reward that unlocks when ALL kids hit a sustained success-rate milestone together (family movie night, etc.). Design: trigger condition, who picks the reward, cooldown, progress UI on the home strip, reset rules when one kid breaks streak, storage (`family_streak_rewards` top-level list).
- **Kid-initiated "Propose sharing" UI** — backend exists from v0.6.3; the proposal-creation modal was never built. See [BUGS.md](BUGS.md) "Deferred".

### Separate Maintenance into its own module (raised 2026-05-29, Jim)
Maintenance is conceptually distinct from Chores but currently lives as a `category_label == "Maintenance"` special-case (the only seam is `_chore_is_maintenance()` + the Home Care drill-down). Target: own data collection / services / admin section, with two distinct admin tabs ("Chores" + "Maintenance"). Pairs with the v0.8.0 Home Maintenance room. Leave current behavior until then.

### Deferred v0.6.3 items (parked)
- Time-windowed chores (`available_from` / `expires_at`, sub-day auto-skip).
- Tabler Icons migration — audit `FH_ICONS`, expand the curated picker grid.
- (Shipped already: streak-freeze tokens, quick-add templates, daily progress bar.)

---

## Long-term roadmap

| Version | Headline | Notes |
|---|---|---|
| v0.6.5 | Subscription rewards ✅ | Recurring deductions with lapse + cancel flow. |
| v0.7.0 | Re-foundation ✅ | Event-driven (no 30 s poll), websocket model + lean sensors, multi-store + debounced saves + safe migration, minified bundle, inactive-member mgmt, CI, `data_store.py`/`css.js` splits. |
| v0.7.1 | Bug-swat + cleanup ✅ | Correctness patch off a full-codebase audit; hardening + de-drift. |
| **v0.7.x** | Group rewards expansion / efficiency trims | Group subs, group streak reward, "Propose sharing" UI; history runtime trim; assets upload. |
| v0.8.0 | Home Maintenance room — full feature | CRUD from the card, scheduling/recurrence; pairs with carving Maintenance out of chores. (Room is live as a read-only drill-down today.) |
| v0.9.0 | Meals room | Weekly menu, grocery list, "what's for dinner" on the home strip. Scaffold live as coming-soon. |
| v0.10.0 | Calendar room | Pulls real HA calendar entities into the today strip. Scaffold live as coming-soon. |
| v0.11.0 | Smart Home room | Permission-gated lighting/climate/irrigation for kids. Scaffold live as coming-soon. |
| v1.0.0 | Theme builder UI + public release | Parent authors themes without editing code (rides on theme co-location). |

**Held out indefinitely (revisit on demand):** photo evidence for approvals · history pagination ("show older") · achievements/badges engine · per-theme audio cues via `alexa_media_player`.

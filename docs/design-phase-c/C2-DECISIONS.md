# C2 — Home Care room: decisions record

> Source: Claude Design, "Family Hub admin redesign" project (Home Care Room prototype).
> Handoff delivered 2026-08-23. Spec: **[C2-Home-Care-Room-Handoff.md](C2-Home-Care-Room-Handoff.md)** · Screens: `handoff-screens/` (28 PNGs).
> Design synced against the live repo; its grounding corrections were verified against source before acceptance.

## Verified grounding (checked against the repo, all confirmed)

- **`src/card/icons.js` is the real icon library** (Tabler idiom: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, round caps). An earlier Design note crediting `constants.js` was wrong and has been corrected.
- **`htmlRewardLockBadge`** (`src/card/themes/_shared.js:1076`) is the house "locked" pattern; the gate adopts its exact contract (`--fh-text-xs` / weight 700 / line-height 1.25 / inline-flex gap 4px / `title` carrying the reason).
- **`#ff9f0a` is byte-identical to `--fh-warning`** and is the room accent for **both** maintenance and meals (`rooms/index.js:45`, `:63`) — it is not unique to Home Care.

## Rulings (settled — do not relitigate in D2/D3)

1. **Lock color = `--fh-accent`.** Not `--fh-overdue` (red reads as *denial*; this content IS available to the right person — the element is a live tap target). Not module amber (collides with the due-soon semantic on the same screens, isn't unique to Home Care, and a **hub-wide** component must not wear one module's color). `--fh-accent` is `var(--primary-color)` — interactive, theme-adaptive.
2. **Icon rule:** module *identity* marks follow `rooms/index.js` (the filled wrench); everything else follows `icons.js` (Tabler stroke). New drawings (padlock closed/open, magnifier, calendar) follow the `icons.js` convention.
3. **Unlock scope: per-device, per-page-load.** Unlock lives in card-instance memory. Unlocking the kitchen tablet must never unlock another device; a reload re-locks. No server state, no cross-device sync.
4. **Snooze stays ungated.** Snooze is reversible and low-harm; Skip (burns the cycle) and Reschedule (moves the date) are the destructive pair, and are gated. The protected set is configurable, so this can move later without redesign.
5. **Photo on Complete: no storage target in v1.** The field stays a nullable string; the UI slot ships unwired. A generic `upload_asset` service (→ `/config/www/family_hub/assets/`) is an existing backlog item.
6. **Reschedule = one date picker** (single ISO date, clears any active snooze). **Skip = optional reason**, recorded in history as a distinct *skipped* entry (not a completion), advances the schedule. Both match the A4 services exactly.
7. **Assign collects only person / points / due date.** The bus payload was frozen in A2 and was deliberately not designed: `{source_module, external_id, name, description, points, due_date, assigned_to|null, claimable}`.
8. **Ship layout B (triage board) only.** A/C/D remain in the prototype for reference and are explicitly out of the spec.

## The parent gate (new in C2 — hub-wide, beyond Home Care)

Account-driven, never a manual toggle:

- **HA admin user (parent) → nothing gated, zero lock UI, no PIN prompt ever.**
- **Restricted HA account (the kitchen Echo Show) → gated until the household PIN is entered.** `CLAUDE.md` confirms the kitchen account is a restricted HA account and parents are admins, so `hass.user.is_admin` is the trigger — no new "who is this" configuration needed.
- **PIN verification is server-side.** Submit → backend answers valid/invalid. The PIN must never reach the card model (anything in the model is readable by any logged-in user via dev tools), so no per-digit client-side feedback. Honest threat model: this reliably keeps *kids* out; it is not security against someone holding an admin login.
- Five reusable components, named for the whole integration: `fh-protected-value`, `fh-protected-block`, `fh-protected-action`, `fh-pin-sheet`, `fh-parent-session`.
- Protected set is configurable in three classes: **Costs**, **Set-aside** (fund rollup), **Actions** (Reschedule/Skip/Assign). **Complete is NEVER gated** — kids must be able to finish work.
- Session: 5-minute idle timeout (recommended for a wall tablet) + manual "Lock now"; expiry re-masks values and shows a non-occluding banner.

**Open:** where the household PIN is *set* lives in the admin surface (System) — belongs to the C1 thread, not designed here. D-phase ships it settable via a service and relocates when C1's hi-fi pass lands.

## D-phase implications (new work these decisions create)

1. **New backend: PIN storage + a verification service.** Store a hashed PIN in settings (never in the card model); add e.g. `verify_parent_pin` returning valid/invalid, plus a set/change path. Card holds only the unlock expiry in memory.
2. **Card model must expose the full task list.** The room's search ("find any task — try 'termite'") spans all 97 tasks; today only due/overdue items reach the card. D1/D2 model extension.
3. **`--fh-accent-bg` must be defined** in the `:host` block, following the existing `--fh-overdue-bg` / `--fh-warning-bg` / `--fh-success-bg` convention. `--fh-module` should be resolved to the existing room-accent value rather than added as a new token if possible.
4. **Retrofit `htmlRewardLockBadge`** to the SVG padlock. It currently sets `color:var(--fh-overdue)` on an **emoji** 🔒, which paints its own fixed colors and ignores `color` — so that badge's red has never applied to its glyph. Small fix to an existing component; standardizes lock glyphs integration-wide.
5. **Per-task reminder override** (Task detail) is distinct from the global notification settings in admin — needs a per-task field + the D4 notification engine honoring it.
6. **Calendar surfacing (raised by Jim, not yet scoped):** publish a `calendar.family_hub_home_care` **HA calendar entity** so tasks appear in HA's calendar view and the companion app on a phone. Follow-on option: a tokenized **.ics** subscription URL that Google/Apple Calendar can subscribe to (gets it outside HA). Two-way Google sync (OAuth + API) is explicitly out of scope. Recommend the entity for v0.8.x.

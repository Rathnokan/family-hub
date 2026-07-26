# C1 — Admin IA Wireframes: decisions record

> Source: Claude Design, "Family Hub admin redesign" project. Delivered 2026-07-26.
> Full wireframes: [C1-Admin-IA-Wireframes.html](C1-Admin-IA-Wireframes.html) (canonical map: turn 2 / "2h").
> Design synced against the live repo (`modules.py`, `modes-admin.js`, `css/part1.js`/`part4.js`, `rooms/index.js`) — see [C1-github-sync.md](C1-github-sync.md).

## Settled IA

- **Five constants in an icon rail:** Today · Modules · Hub · System · Log.
- **Modules** = Chores, Rewards, Meals, **Home Care** (matches the room's existing display label in `rooms/index.js` — no rename needed). Smart Home and Calendar exist in the rail but ship off (coming-soon, matches current `status: "coming"`).
- **Module-off state greys the section in place; it does NOT disappear from the nav.** Slot order is static, never reflowed by config.
- **Hub/Display is top-level, not under System** — room tiles/order, person tiles, weather/calendar entities, text scale, device presets. (Maps to the existing "Hub layout" panel, relocated.)
- **System** = Family (household name, people, nicknames, per-person theme, notify target, active/inactive, time zone) · Notifications (defaults, quiet hours, digest, escalation tiers) · Assumptions (escalation rate + source, category overrides, home value, sq ft) · Modules (read-only mirror, links to HA) · Data (export, import, rebuild).
- **Shell:** master-detail everywhere (sub-tab strip → list pane left → editor pane right, panes scroll independently, actions pinned). Phone collapses the rail to a bottom bar, stacks list → detail full-width.
- Nav shape described as `/admin/:rail/:section/:tab/:id` — the card has no browser routing (Lovelace custom element, one dashboard view); D3 translates this to the card's existing state-field convention (`card._adminSec` etc., extended with rail/tab/id fields), not real URL routes.

## Settled module-boundary decisions

- **Points belong to Rewards, not the system; other modules publish credits into it.** Economy (allowance, points-per-dollar, rank curve) stays in Rewards. Penalties and streaks stay in Chores.
- **Rewards · Point sources** is a registry: any module that credits/debits points registers here (chore completions, manual award/deduct, allowance, Home Care bounties via the D5 bridge).
- **Per-person themes live on the person record in System · Family** (matches current data model — no change).
- **Warranties and service contracts are per-asset coverage and recurring vendor spend, compared against the sinking fund — not funds themselves.** An asset carries three independent coverage relations: sinking-fund allocation, warranty record, service contract.
- **Escalation rate is one System · Assumptions value** with a bindable source (fixed % / HA sensor / rolling average) plus per-category overrides (HVAC is the known case).

## Home Care admin sub-tabs

Profile · Library · Assets & Money (incl. warranty/contract detail) · Vendors & Services · Notifications.

## ⚠️ Deltas from what's already built (A4–A6) — flag for D3/E, not yet reconciled in code

1. **Module-off nav behavior reverses A6.** A6 (`modes-admin.js`) currently **removes** a disabled module's tab from the `sections` array entirely. C1 wants it to stay in place, greyed, non-navigable. This is a card-only change for D3 (no backend/services impact) — but it's a real reversal of shipped, live-tested A6 behavior and needs to be applied deliberately, not assumed.
2. **"Turning Rewards off removes points; tasks survive" needs a precise reading.** A6 built + live-tested points **balance** as CORE — independent of the Rewards module (chores-only "earn" and rewards-only "spend" both work; both-off leaves points balances intact, tested 2026-07-25 20/20). Recommended reconciliation (default unless overridden): "Rewards owns the points **economy configuration + spend/store UI**" (matches what's built); the balance itself stays core infrastructure and is NOT deleted or hidden when Rewards is off. If the intent was a literal architecture change (points cease to exist without Rewards), that's a real, larger change to the A1/A6 core/module boundary — flag before D3 touches it.
3. **New `maintenance_assets` collection needed.** A4 built `maintenance_tasks/products/completions/vendors/funds` + `home_profile`, and the seed library ships static `big_ticket_assets` (reference data, no per-home instance). C1's "asset carries sinking fund + warranty + service contract" implies a first-class **per-home** `maintenance_assets` collection (installed date/age, warranty record, service contract, fund link) that doesn't exist yet. This is new backend scope — belongs with **Phase E** (Costs & Savings / sinking funds), not a D1/D3 patch.
4. **Escalation rate needs to become editable + bindable + overridable.** `home_profile.inflation_rate` today is a static float (default 4.0%, locked per Phase B research). C1 wants a System · Assumptions screen sourcing it from fixed % / an HA sensor / a rolling average, plus per-category overrides. New scope for **Phase E2** (sinking funds), compatible with the current default as the "fixed rate" source.
5. **Products/inventory has no explicit home in the settled IA.** Home Care's sub-tabs (profile, library, assets & money, vendors & services, notifications) don't name a products/inventory screen. Likely folds under Library (products linked to tasks) or Vendors & Services — flag for a C1 follow-up or fold into D3's Library screen.
6. **Naming cosmetic:** `modules.py` `ModuleDef(id="maintenance", title="Home Maintenance")` and the options-flow strings still say "Home Maintenance"; the settled design language is "Home Care" everywhere else (and already is the room's display label). One-line fix in `modules.py` + `strings.json`/`translations/en.json` — not done yet, do before/with D3.

## Not blocking

Economy resolved as staying in Rewards — no open item there.

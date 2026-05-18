# PLAN — v0.6.1

> Drafted 2026-05-17 at end of v0.6.0 release session.
> Three items, all carried over from v0.6.0 explicit deferrals (see `NOTES.md` → "Deferred").
> Scoped as a single-session sprint. Risk-ascending order.

---

## Scope

1. **Bigger completion buttons** — bump `.fh-row-btn` (adult themes) and `.fh-mc-go-mini` (Mission Control) to ~60px tall for thumb-confidence on Echo Show.
2. **Claimable picker UX redesign** — replace `<select>` dropdown in the claim modal with a card grid of tappable person tiles.
3. **Success-rate person streak system** — person-level "completed ≥X% of chores due that day for N consecutive days" metric. Fills the slot removed from Mission Control agent cards in S9 P2 iteration 2.

Target order: 1 → 2 → 3 (smallest first, biggest last).
Estimated total: 2-3 hours.

---

## Item 1 — Bigger completion buttons (~15 min, CSS-only)

**Files:** `src/card/css.js` only.

**Touch points:**
- Base `.fh-row-btn` rule — bump `min-height` to 60px, `padding` to `12px 16px`, font-size to `--fh-text-md`. Search for `.fh-row-btn {` in css.js (around the shared row block).
- `.fh-mc-go-mini` rule (Mission Control mini buttons) — currently around 48px × 52px. Bump to ~60px × 64px. Search for `.fh-mc-go-mini`.
- **Do NOT touch** `.kid-large .fh-row-btn` — that's the reference target the others should match.

**Test:** Echo Show 15 (1920×1080), Echo Show 8 (~1280×800), phone (375-428 wide).

**Gotcha:** the buttons in compact-row mode are inside a flex row alongside chips + pts. Bumping height may cause the row to grow taller — that's fine, the row will just expand vertically. If a theme over-constrains the row height, the theme's `.fh-row--<key>` block may need a matching tweak.

---

## Item 2 — Claimable picker UX (~30-45 min, single modal)

**File:** `src/card/modals.js`, function `mClaim(m, people)`.

**Current implementation:**
```js
<select class="fh-select" id="m-clperson">
  ${people.map(p => `<option value="${p.person_id}">${escHTML(p.name)}</option>`).join("")}
</select>
```
With an OK "Claim" button in the modal footer.

**Replacement:** card grid of tappable person tiles. Tap-tile = instant claim (no separate OK button).

```js
// Filter to kids only (parents shouldn't claim chores)
const eligible = people.filter(p => p.type === "kid");

return `
  <div class="fh-modal">
    <div class="fh-modal-title">Claim — ${escHTML(m.data.name)}</div>
    <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0 0 12px">
      Who's claiming this chore?
    </p>
    <div class="fh-claim-grid">
      ${eligible.map(p => `
        <button class="fh-claim-tile" data-act="ok-claim"
                data-tid="${m.data.tid}" data-pid="${p.person_id}">
          <div class="fh-claim-avatar" style="background:${p.avatar_color || DEFAULT_COLOR}">
            ${ini(p.name)}
          </div>
          ${p.code ? `<div class="fh-claim-codename">${escHTML(p.code)}</div>` : ""}
          <div class="fh-claim-name">${escHTML(p.name)}</div>
        </button>`).join("")}
    </div>
    <div class="fh-modal-footer">
      <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
    </div>
  </div>`;
```

**Dispatch update** in `src/card/dispatch.js` → `ok-claim` case:
```js
case "ok-claim": {
    const tid = el.dataset.tid || v("m-cltid");
    const pid = el.dataset.pid || v("m-clperson");  // backward-compat
    if (!tid || !pid) break;
    card._svc("claim_task", { task_id: tid, person_id: pid });
    card._closeModal();
    break;
}
```

**CSS** (new block in `src/card/css.js`):
```css
.fh-claim-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}
.fh-claim-tile {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 14px 10px;
  background: var(--fh-surface);
  border: 1.5px solid var(--fh-border);
  border-radius: 10px;
  cursor: pointer;
  transition: transform .1s, border-color .15s, background .15s;
}
.fh-claim-tile:hover { border-color: var(--fh-accent); }
.fh-claim-tile:active { transform: scale(.96); }
.fh-claim-avatar {
  width: 48px; height: 48px; border-radius: 50%;
  display: grid; place-items: center;
  color: #fff; font-weight: 700; font-size: 1.2rem;
}
.fh-claim-codename {
  font-family: var(--fh-font-mono);
  font-size: var(--fh-text-xs); font-weight: 700;
  letter-spacing: .08em; color: #F5C24A;
}
.fh-claim-name {
  font-size: var(--fh-text-sm); font-weight: 600; color: var(--fh-text);
}
```

**Test:** Mission Control "Open Ops" → tap a claimable chore → modal opens with tile grid → tap a tile → claim fires, modal closes.

---

## Item 3 — Success-rate person streak (~1.5-2 hours, backend + frontend)

The big one.

### Backend

**Files:** `custom_components/family_hub/data_store.py`, `sensor.py`, `services.py`, `__init__.py` (only if services.yaml needs updating).

**Person model — new fields with defaults:**
```python
{
    "completion_streak": 0,
    "completion_threshold_pct": 80,         # need ≥80% to count
    "completion_milestone": 7,              # bonus every 7 days
    "completion_bonus_points": 50,
    "last_completion_eval_date": None,
}
```

**Load-time migration:** add via `setdefault` in `_migrate_data` — same pattern as `code` / `theme_key` from v0.6.0 S1.

**Daily-tick evaluation logic** — runs inside `_async_tick_for_date` AFTER the existing skip/penalty pass, BEFORE allowance:

```python
def _evaluate_completion_streak(self, person, tick_date):
    """
    For the day that just ENDED (tick_date - 1 day), compute this person's hit rate
    over chores that were actually due that day. Update streak accordingly.

    Skip entirely if penalties are paused (global or per-person) — treat as no motion.
    """
    if self._penalties_paused_global() or person.get("penalties_paused"):
        return
    if person.get("type") != "kid":
        return
    if person.get("completion_milestone", 0) == 0:
        return  # feature disabled per-person

    yesterday = tick_date - timedelta(days=1)
    last_eval = person.get("last_completion_eval_date")
    if last_eval and last_eval >= yesterday.isoformat():
        return  # already evaluated this day (catch-up safety)

    # Count chores that were due to THIS person on yesterday
    due_count       = 0
    completed_count = 0
    for inst in self._task_instances:
        if inst.get("due_date") != yesterday.isoformat():
            continue
        if person["person_id"] not in (inst.get("assigned_to") or []):
            continue
        chore = self._chore_by_id(inst.get("chore_id"))
        if not chore or chore.get("chore_type") != "assigned":
            continue   # only assigned chores count
        due_count += 1
        if inst.get("status") in ("completed", "approved"):
            completed_count += 1

    if due_count == 0:
        # No chores due yesterday — "rest day", don't touch streak
        person["last_completion_eval_date"] = yesterday.isoformat()
        return

    hit_pct = (completed_count / due_count) * 100
    threshold = person.get("completion_threshold_pct", 80)

    if hit_pct >= threshold:
        person["completion_streak"] = person.get("completion_streak", 0) + 1
        milestone = person.get("completion_milestone", 7)
        if milestone > 0 and person["completion_streak"] % milestone == 0:
            bonus = person.get("completion_bonus_points", 50)
            person["points_balance"] += bonus
            person["points_lifetime"] += bonus
            self._log_history({
                "type":             "completion_streak_milestone",
                "person_id":        person["person_id"],
                "person_name":      person["name"],
                "person_color":     person.get("avatar_color"),
                "points_delta":     bonus,
                "note":             f"{person['completion_streak']}-day success streak",
                "timestamp":        datetime.now(self._tz).isoformat(),
            })
    else:
        person["completion_streak"] = 0

    person["last_completion_eval_date"] = yesterday.isoformat()
```

**Call site:** inside the per-person loop in `_async_tick_for_date`, after skip processing.

**`update_person` service** in `services.py` — accept and persist the three configurable fields:
```python
vol.Optional("completion_threshold_pct"): vol.All(int, vol.Range(min=1, max=100)),
vol.Optional("completion_milestone"):     vol.All(int, vol.Range(min=0, max=365)),
vol.Optional("completion_bonus_points"):  vol.All(int, vol.Range(min=0, max=10000)),
```

**`set_completion_streak` service** (admin override, mirror `set_streak` pattern):
```yaml
set_completion_streak:
  name: Set completion streak
  description: Manually set a person's success-rate streak count (admin correction).
  fields:
    person_id: { required: true }
    count:     { required: true, selector: { number: { min: 0 } } }
```

**Sensor exposure** in `sensor.py` → `_get_family_attrs` → `people` builder:
```python
"completion_streak":          p.get("completion_streak", 0),
"completion_threshold_pct":   p.get("completion_threshold_pct", 80),
"completion_milestone":       p.get("completion_milestone", 7),
"completion_bonus_points":    p.get("completion_bonus_points", 50),
```

### Frontend

**`src/card/constants.js`** — add to `HISTORY_META`:
```js
completion_streak_milestone: {
    label: "Success streak",
    color: "var(--fh-success)",
},
```

**`src/card/modals.js` → `mEditPerson`** — add a new section between Allowance and Notifications:
```js
${section("Success streak", "person-level bonus for consistent days", `
  <div class="fh-row">
    <div class="fh-field">
      <label class="fh-label">Threshold (% of daily chores done)</label>
      <input class="fh-input" id="m-completion-threshold" type="number"
             min="1" max="100" value="${d.completionThreshold ?? 80}">
    </div>
    <div class="fh-field">
      <label class="fh-label">Milestone (days, 0 = off)</label>
      <input class="fh-input" id="m-completion-milestone" type="number"
             min="0" value="${d.completionMilestone ?? 7}">
    </div>
  </div>
  <div class="fh-field">
    <label class="fh-label">Bonus points awarded at milestone</label>
    <input class="fh-input" id="m-completion-bonus" type="number"
           min="0" value="${d.completionBonusPoints ?? 50}">
    <div class="fh-field-help">
      Awards bonus points when this person completes ≥${d.completionThreshold ?? 80}%
      of their assigned chores for N consecutive days. Set milestone to 0 to disable.
    </div>
  </div>
`)}
```

**`src/card/dispatch.js`** — `open-edit-person` case: pass new data-* attrs.
**`src/card/dispatch.js`** — `ok-edit-person` case: include the three new fields in the `update_person` payload.
**`src/card/modes-admin.js`** — `_htmlAdFamily` `open-edit-person` button: add new `data-pcompletionthreshold`, `data-pcompletionmilestone`, `data-pcompletionbonus` attrs.

**`src/card/modes-chores.js` (Mission Control agent card):**
The placeholder slot in the agent roster (currently blank — was removed in S9 P2 iteration 2) gets the streak line:
```js
const streakLine = (p.completion_milestone > 0 && p.completion_streak > 0)
    ? `<div class="fh-mc-agent-streak">🔥 ${p.completion_streak}d · ${p.completion_threshold_pct}% target</div>`
    : "";
```
Drop into the agent card body. CSS: mono font, small, success color.

**Themed personal pages (Rank rail panel):**
In `themes/_shared.js`, find the Rank rail-panel helper (or each theme's rail builder). Add a line below the rank info:
```js
const ssLine = (p.completion_milestone > 0 && p.completion_streak > 0)
    ? `<div class="fh-rail-success-streak">🔥 ${p.completion_streak}d streak · ${p.completion_threshold_pct}% target</div>`
    : "";
```
Each theme can override `.fh-rail-success-streak` styling if it needs theme-specific treatment.

---

## Architectural constraints (don't re-litigate)

Pulled from `NOTES.md` "Architecture Decisions" — these are stable, do not relitigate:

1. **Card-stub split is permanent.** `npm run build` produces two files (stub + body). Deploy BOTH. Never collapse back into one — the Echo Show / Silk cold-load race depends on this.
2. **Shared row anatomy.** Adult-mode rows go through `htmlChoreRow(t, cfg, person, card, opts)` in `themes/_shared.js`. New row decorations go through `opts`, not new per-theme `_row` helpers.
3. **Kid-mode is a CSS modifier (`.kid-large`).** No render fork.
4. **Viewport `@media` queries, never `@container`.**
5. **Typography floor: 0.75rem / 12px.** Use `--fh-text-xs/sm/base/md/lg/xl/2xl` tokens.
6. **Modal `m-*` form IDs are shared with the inline admin panel.** Opening any chore modal clears `_adminSelectedChoreId` first. The same applies to any new modal that introduces `m-*` form IDs already used by the admin panel.
7. **Chore form tabs switch via CSS-only DOM manipulation.** No `_doRender` on tab change, to preserve typed-but-unsaved input on inactive panes.

---

## Workflow

1. **Build:** `npm run build` → outputs `family-hub-card.js` (~6 KB stub) + `family-hub-card-body.js` (~447 KB body) in `custom_components/family_hub/www/`.
2. **Deploy:** copy BOTH JS files to `\\10.0.0.41\config\custom_components\family_hub\www\`. For Python backend changes, also copy `*.py` files to `\\10.0.0.41\config\custom_components\family_hub\`.
3. **Reload backend** (if Python changed): HA → Settings → Devices & Services → Family Hub → Reload. Then optionally call `family_hub.force_daily_tick` from Dev Tools to test streak evaluation.
4. **Hard-refresh** the browser dashboard (`Ctrl+Shift+R`).
5. **Smoke test on devices:** Echo Show 15 + phone.
6. **Version bump:** `manifest.json`, `hacs.json`, `src/card/constants.js` VERSION → `0.6.1`.
7. **Update `NOTES.md`:** current status table, mark v0.6.1 work complete, add row to version history.
8. **Write `RELEASE-NOTES-v0.6.1.md`** — much shorter than v0.6.0, ~3 highlights.
9. **Commit + tag + push:**
   ```bash
   git add -A
   git commit -m "v0.6.1 — Streaks, claim picker, button polish"
   git tag -a v0.6.1 -m "v0.6.1"
   git push origin main v0.6.1
   ```

---

## Stretch / overflow items (skip unless time)

- **CSS dead-code audit** — the v0.6.0 stub split removed a few classes; sweep for any other unreferenced rules.
- **`_expandedDescs` cleanup** — flagged in S9 cleanup notes; still in active use by maintenance + admin description toggles. Audit whether classic theme still needs it after the row anatomy unification.
- **History pagination** — currently 30-day rolling window. If user is interested, could add "show older" expand link in admin history tab.

Skip these unless the three core items finish ahead of schedule.

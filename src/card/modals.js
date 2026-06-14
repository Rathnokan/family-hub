/**
 * Family Hub Card — Modals
 * All modal HTML builders. Called by FamilyHubCard._modalHTML().
 * Each function returns an HTML string for injection into the modal overlay.
 */

import { DEFAULT_COLOR, CHORE_TEMPLATES } from "./constants.js";
import { I } from "./constants.js";
import { escHTML, escAttr, ini, opts, weekdayChips } from "./utils.js";
import { FH_ICON_META, FH_REWARD_ICON_META, choreIcon } from "./icons.js";
import { getTheme } from "./themes/index.js";
import { getEffectiveRank } from "./themes/_shared.js";

// ---------------------------------------------------------------------------
// Shared modal wrapper
// ---------------------------------------------------------------------------

/**
 * Wrap modal body content in the standard modal shell.
 * @param {string} title    - Modal title text
 * @param {string} body     - Inner HTML content
 * @param {string} okLabel  - OK button label
 * @param {string} okAct    - data-act value for the OK button
 * @param {string} okClass  - CSS class for the OK button (default: fh-btn-primary)
 */
export function mWrap(title, body, okLabel, okAct, okClass = "fh-btn-primary") {
    return `
      <div class="fh-modal">
        <div class="fh-modal-title">${title}</div>
        ${body}
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn ${okClass}" data-act="${okAct}">${okLabel}</button>
        </div>
      </div>`;
}

// ---------------------------------------------------------------------------
// Shared drawer wrapper (v0.7.2 — right side-rail; same scrim/dispatch as modals)
// ---------------------------------------------------------------------------

/**
 * Wrap content in the standard right-drawer shell. Mirrors mWrap's signature so
 * a modal builder can switch to a drawer by swapping the call. The card tags the
 * scrim with `.fh-modal-bg--drawer` when `_modal.surface === "drawer"`.
 */
export function dWrap(title, body, okLabel, okAct, okClass = "fh-btn-primary") {
    return `
      <div class="fh-drawer">
        <div class="fh-drawer-hdr">
          <span class="fh-drawer-title">${title}</span>
          <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="close-modal" aria-label="Close">✕</button>
        </div>
        <div class="fh-drawer-body">${body}</div>
        <div class="fh-drawer-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn ${okClass}" data-act="${okAct}">${okLabel}</button>
        </div>
      </div>`;
}

// Default per-rank percentage bands (share of weekly capacity). The "formula" is
// deliberately transparent: threshold points = pct% × capacity. Index 0 is the
// bottom rung (no fall); index 4 is the top rung (no climb).
//   gain%: reach this share of capacity in a week ⇒ rank up
//   drop%: fall below this share ⇒ rank down
export const DEFAULT_GAIN_PCTS = [50, 60, 75, 95, 0];
export const DEFAULT_DROP_PCTS = [0, 40, 55, 75, 95];

/**
 * Convert per-rank percentage bands into absolute length-5 {gain, drop} point
 * arrays: points = round5(pct% × capacity). This is the whole formula — the
 * parent edits the percentages directly, no hidden curve math.
 *
 * @param {number}   cap       weekly point capacity
 * @param {number[]} gainPcts  length-5 gain percentages (top rung ignored)
 * @param {number[]} dropPcts  length-5 drop percentages (bottom rung ignored)
 */
export function curveFromPercents(cap, gainPcts, dropPcts) {
    cap = Math.max(0, +cap || 0);
    const round5 = v => Math.max(0, Math.round(v / 5) * 5);
    const gain = [], drop = [];
    for (let i = 0; i < 5; i++) {
        gain.push(round5(cap * (+gainPcts[i] || 0) / 100));
        drop.push(round5(cap * (+dropPcts[i] || 0) / 100));
    }
    return { gain, drop };
}

// ---------------------------------------------------------------------------
// Points adjustment (award / deduct)
// ---------------------------------------------------------------------------

export function mPointAdjust(m) {
    const isAward = m.type === "award";
    return mWrap(
        `${isAward ? "Award" : "Deduct"} points — ${m.data.pname}`,
        `<div class="fh-field">
         <label class="fh-label">Amount</label>
         <div class="fh-row">
           <input class="fh-input" id="m-amount" type="number" min="0.01" step="any"
                  placeholder="e.g. 50 or 2.50" autofocus style="flex:2">
           <select class="fh-select" id="m-atype" style="flex:1">
             <option value="points">pts</option>
             <option value="dollars">$ USD</option>
           </select>
         </div>
       </div>
       <div class="fh-field">
         <label class="fh-label">Reason (optional)</label>
         <input class="fh-input" id="m-reason" type="text" placeholder="e.g. Helped with dinner">
       </div>
       <input type="hidden" id="m-pid"   value="${m.data.pid}">
       <input type="hidden" id="m-amode" value="${m.type}">`,
        isAward ? "Award" : "Deduct",
        "ok-point-adjust",
        isAward ? "fh-btn-success" : "fh-btn-danger"
    );
}

// ---------------------------------------------------------------------------
// Partial credit picker (v0.7.3) — "You tried, but didn't finish"
// ---------------------------------------------------------------------------

export function mPartialCredit(m) {
    const pts = parseInt(m.data.pts || "0");
    const buttons = [25, 50, 75].map(p => {
        const award = Math.round(pts * p / 100);
        return `
          <button class="fh-btn fh-btn-primary" data-act="do-partial"
                  data-tid="${escAttr(m.data.tid)}" data-frac="${p / 100}"
                  style="flex:1;flex-direction:column;gap:2px;padding:12px 6px">
            <span style="font-size:1.1rem;font-weight:800">${p}%</span>
            <span style="font-size:.78rem;opacity:.85">${award} pts</span>
          </button>`;
    }).join("");
    return `
      <div class="fh-modal">
        <div class="fh-modal-title">Partial credit — ${escHTML(m.data.name)}</div>
        <p style="font-size:.85rem;color:var(--fh-text-sec);margin:0;line-height:1.5">
          "You tried, but didn't finish." Award part of the ${pts} points and approve.
        </p>
        <div class="fh-row" style="gap:8px;margin-top:4px">${buttons}</div>
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
        </div>
      </div>`;
}

// ---------------------------------------------------------------------------
// Chore form (shared by Add/Edit modal AND inline admin side panel)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Shared icon picker (chore + store-item)
// ---------------------------------------------------------------------------

/**
 * Render the icon grid (categories + cells). The `pick-icon` dispatch handler
 * updates the hidden #m-cicon input — both the chore modal and the store-item
 * modal use that same hidden field so only one icon picker can be active at
 * a time, which matches the actual UX (only one modal is ever open).
 *
 * @param {string} selectedKey  - Currently selected icon key (empty = none)
 * @returns {string}            - HTML for the grouped grid
 */
export function iconPickerGrid(selectedKey) {
    const iconsByCat = new Map();
    for (const m of FH_ICON_META) {
        const cat = m.category || "Other";
        if (!iconsByCat.has(cat)) iconsByCat.set(cat, []);
        iconsByCat.get(cat).push(m);
    }
    return [...iconsByCat.entries()].map(([cat, items]) => `
        <div class="fh-icon-picker-cat-hdr">${escHTML(cat)}</div>
        <div class="fh-icon-picker-cat-grid">
          ${items.map(({ key, label }) => `
            <button class="fh-icon-cell${selectedKey === key ? " selected" : ""}"
                    data-act="pick-icon" data-icon="${key}" type="button"
                    title="${label}">
              ${choreIcon(key, null, "28px")}
              <span class="fh-icon-cell-label">${label}</span>
            </button>`).join("")}
        </div>`).join("");
}

/**
 * Full icon-picker section: hidden #m-cicon input + the grouped grid. Use this
 * when adding an icon picker to a modal other than the chore form.
 */
export function iconPickerSection(selectedKey, label = "Icon") {
    return `
      <div class="fh-field">
        <label class="fh-label">${escHTML(label)}</label>
        <input type="hidden" id="m-cicon" value="${escAttr(selectedKey || "")}">
        <div class="fh-icon-picker-grid">${iconPickerGrid(selectedKey || "")}</div>
      </div>`;
}

/**
 * Reward-specific icon picker (smaller curated list + image upload).
 * Hidden field is the same `#m-cicon` used elsewhere so the existing
 * pick-icon handler and form-read code keep working.
 */
export function rewardIconPickerGrid(selectedKey) {
    const iconsByCat = new Map();
    for (const m of FH_REWARD_ICON_META) {
        const cat = m.category || "Other";
        if (!iconsByCat.has(cat)) iconsByCat.set(cat, []);
        iconsByCat.get(cat).push(m);
    }
    return [...iconsByCat.entries()].map(([cat, items]) => `
        <div class="fh-icon-picker-cat-hdr">${escHTML(cat)}</div>
        <div class="fh-icon-picker-cat-grid">
          ${items.map(({ key, label }) => `
            <button class="fh-icon-cell${selectedKey === key ? " selected" : ""}"
                    data-act="pick-icon" data-icon="${key}" type="button"
                    title="${label}">
              ${choreIcon(key, null, "28px")}
              <span class="fh-icon-cell-label">${label}</span>
            </button>`).join("")}
        </div>`).join("");
}

export function rewardIconPickerSection(selectedKey) {
    const isCustom = typeof selectedKey === "string" && selectedKey.startsWith("data:image/");
    const previewHTML = isCustom
        ? `<div id="m-cicon-preview" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;padding:8px;border:1px solid var(--fh-border);border-radius:6px;background:var(--fh-surface)">
             <img src="${escAttr(selectedKey)}" style="width:48px;height:48px;object-fit:contain;border-radius:4px" alt="">
             <span style="font-size:.85rem;color:var(--fh-text-sec)">Custom uploaded image</span>
             <button type="button" class="fh-btn fh-btn-ghost fh-btn-sm" data-act="clear-icon" style="margin-left:auto">Clear</button>
           </div>`
        : `<div id="m-cicon-preview"></div>`;
    return `
      <div class="fh-field">
        <label class="fh-label">Icon (optional)</label>
        <input type="hidden" id="m-cicon" value="${escAttr(selectedKey || "")}">
        <!-- Persistent file input — kept in the DOM so the change event fires reliably
             after the OS picker closes (avoids the GC race when the input is created
             on-the-fly and removed before the user picks a file). -->
        <input type="file" id="m-icon-upload" accept="image/png,image/jpeg,image/webp,image/gif" style="display:none">
        ${previewHTML}
        <div class="fh-icon-picker-grid">${rewardIconPickerGrid(isCustom ? "" : (selectedKey || ""))}</div>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap">
          <button type="button" class="fh-btn fh-btn-ghost" data-act="upload-icon">
            📷 Upload image…
          </button>
          <span style="font-size:.78rem;color:var(--fh-text-sec)">PNG/JPG, max ~256 KB</span>
        </div>
      </div>`;
}

/**
 * Returns the inner form-fields HTML for add/edit chore — tabbed layout.
 * Used by mChoreForm (modal) and the inline admin side panel.
 * Both contexts use the same m-* element IDs — they are never in the DOM simultaneously
 * because opening any chore modal always clears _adminSelectedChoreId first.
 *
 * All four tab panes are rendered into the DOM at once; inactive panes are hidden via
 * inline display:none. Tab switching is CSS-only (see "chore-tab" dispatch) so user
 * input on inactive tabs is never lost during a tab change.
 *
 * @param {object|null} chore      - Existing chore for edit mode, null for add
 * @param {boolean}     isEdit     - Whether this is an edit operation
 * @param {object[]}    people     - All people from sensor
 * @param {string[]}    catLabels  - Available category label strings
 * @param {string}      activeTab  - "details" | "icon" | "schedule" | "rewards" | "reminders"
 */
export function choreFormFields(chore, isEdit, people, catLabels, activeTab = "details") {
    const c        = chore || {};
    const rec      = c.recurrence || {};
    const recType  = rec.type || "daily";
    const assigned = c.assigned_to || [];

    // ---- Icon grid (rendered once, lives in the Icon tab pane) --------------
    const iconGridHtml = iconPickerGrid(c.icon);

    // ---- Icon tab: currently-selected preview label -------------------------
    const selMeta  = FH_ICON_META.find(m => m.key === c.icon);
    const selLabel = selMeta ? selMeta.label : (c.icon || "");

    // v0.7.3: monthly multi-day (days_of_month list; legacy single day_of_month fallback)
    const monthDays = (Array.isArray(rec.days_of_month) && rec.days_of_month.length)
        ? rec.days_of_month
        : (rec.day_of_month ? [rec.day_of_month] : [1]);
    // One-time is retired — legacy one-time chores edit as Daily.
    const recSel = recType === "one_time" ? "daily" : recType;

    // ---- Tab strip (v0.7.3: 3 logical tabs) ---------------------------------
    const tabs = [
        { key: "details",   label: "Details"          },
        { key: "schedule",  label: "Schedule"         },
        { key: "rewards",   label: "Points & Rewards" },
    ];
    const tabStrip = `
      <div class="fh-chore-tabs">
        ${tabs.map(t => `
          <button class="fh-chore-tab${activeTab === t.key ? " active" : ""}"
                  data-act="chore-tab" data-tab="${t.key}" type="button">
            ${t.label}
          </button>`).join("")}
      </div>`;

    // ---- Pane helper --------------------------------------------------------
    const pane = (key, content) => `
      <div class="fh-chore-tab-pane" data-tab="${key}"
           style="${activeTab === key ? "" : "display:none"}">
        ${content}
      </div>`;

    // ---- Template picker: builds an optgroup select + Apply button ----------
    const tplGroups = new Map();
    for (const t of CHORE_TEMPLATES) {
        const g = t.category || "Other";
        if (!tplGroups.has(g)) tplGroups.set(g, []);
        tplGroups.get(g).push(t);
    }
    const tplOptions = [...tplGroups.entries()].map(([group, items]) => `
        <optgroup label="${escAttr(group)}">
          ${items.map(t => `<option value="${escAttr(t.key)}">${escHTML(t.name)}</option>`).join("")}
        </optgroup>`).join("");

    // ---- Icon search handler (used by the collapsible Icon editor in Details) -
    const iconSearchHandler =
        `((el)=>{` +
            `const q=el.value.toLowerCase().trim(),` +
            `p=el.closest('.fh-chore-tab-pane');` +
            `p.querySelectorAll('.fh-icon-picker-cat-hdr').forEach(h=>{` +
                `const g=h.nextElementSibling;let n=0;` +
                `g.querySelectorAll('.fh-icon-cell').forEach(b=>{` +
                    `const m=!q||(b.title+' '+b.dataset.icon).toLowerCase().includes(q);` +
                    `b.style.display=m?'':'none';if(m)n++;` +
                `});` +
                `h.style.display=n?'':'none';g.style.display=n?'':'none';` +
            `});` +
        `})(this)`;

    // ---- Details pane: icon (collapsible, top) / name / desc / type+cat / reminder ----
    const detailsPane = pane("details", `
        ${!isEdit ? `
        <div class="fh-field fh-tpl-picker-field">
          <label class="fh-label">From template (optional)</label>
          <div class="fh-tpl-picker-row">
            <select class="fh-select" id="m-ctpl" style="flex:1">
              <option value="">— Start from scratch —</option>
              ${tplOptions}
            </select>
            <button type="button" class="fh-btn fh-btn-ghost fh-tpl-apply-btn"
                    data-act="pick-template">Apply</button>
          </div>
        </div>` : ""}
        <div class="fh-row">
          <div class="fh-field" style="flex:3">
            <label class="fh-label">Chore name *</label>
            <!-- No autofocus: the editor drawer animates in from off-screen, and
                 autofocus' scroll-into-view yanked the page to the top on open. -->
            <input class="fh-input" id="m-cname" type="text"
                   value="${escAttr(c.name || "")}">
          </div>
          ${isEdit ? `
          <div class="fh-field" style="flex:1">
            <label class="fh-label">Active</label>
            <label class="fh-toggle" style="margin-top:8px" title="Uncheck to pause — no new tasks generate">
              <input type="checkbox" id="m-cactive" ${c.active !== false ? "checked" : ""}>
              <span class="fh-toggle-slider"></span>
            </label>
          </div>` : ""}
        </div>
        <div class="fh-field">
          <label class="fh-label">Description (optional)</label>
          <textarea class="fh-input" id="m-cdesc" rows="3"
                    style="min-height:64px;resize:vertical;line-height:1.4"
                    placeholder="More detail…">${escHTML(c.description || "")}</textarea>
        </div>
        <div class="fh-row">
          <div class="fh-field">
            <label class="fh-label">Chore type</label>
            <select class="fh-select" id="m-ctype">
              ${opts([
                  { value: "assigned",  label: "Assigned" },
                  { value: "claimable", label: "Claimable (bonus)" },
                  { value: "reminder",  label: "Reminder" },
              ], c.chore_type || "assigned")}
            </select>
          </div>
          <div class="fh-field">
            <label class="fh-label">Category</label>
            <select class="fh-select" id="m-clabel">
              <option value="">— None —</option>
              ${catLabels.map(l =>
                  `<option value="${escAttr(l)}" ${l === c.category_label ? "selected" : ""}>${l}</option>`
              ).join("")}
            </select>
          </div>
        </div>
        <details class="fh-icon-details" open>
          <summary class="fh-icon-summary">
            <span class="fh-icon-summary-title">Icon</span>
            <span class="fh-icon-selected-wrap" id="m-icon-selected">
              ${c.icon
                ? `<span class="fh-icon-sel-icon" style="display:inline-flex;width:20px;height:20px;color:var(--fh-accent)">${choreIcon(c.icon, null, "20px")}</span> <span class="fh-icon-sel-lbl">${escHTML(selLabel)}</span>`
                : `<span class="fh-icon-sel-none">Tap to choose</span>`}
            </span>
          </summary>
          <input type="hidden" id="m-cicon" value="${escAttr(c.icon || "")}">
          <input class="fh-input fh-icon-search" id="m-icon-search" type="search"
                 placeholder="Search icons…" autocomplete="off"
                 oninput="${iconSearchHandler}">
          <div class="fh-icon-tab-grid">${iconGridHtml}</div>
        </details>
        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Reminder</div>
        <div class="fh-field">
          <label class="fh-label">Reminder time (-1 = off)</label>
          <input class="fh-input" id="m-reminder-time" type="number" min="-1" max="2359"
                 placeholder="-1 (off)"
                 value="${c.reminder_time !== undefined ? c.reminder_time : -1}">
          <div class="fh-field-help">
            HHMM — e.g. 1900 for 7:00 PM. One push per task instance when the time
            is reached and it's still pending.
          </div>
        </div>
    `);

    // Rotation pool must render CURRENT-first ("top is Current"). The backend
    // advances rotations by bumping rotation_index + assigned_to WITHOUT
    // reordering rotation_pool, so the stored order drifts out of sync with who
    // actually holds the chore. Rotate the pool so the live holder (assigned_to[0],
    // falling back to rotation_index) leads — otherwise the editor mislabels the
    // current holder and reordering can't reliably switch it. Saving this
    // current-first order lets the backend snap current to the top correctly.
    const _rotPoolRaw = c.rotation_pool || [];
    let _rotCur = (c.assigned_to && c.assigned_to[0]) || _rotPoolRaw[c.rotation_index || 0] || _rotPoolRaw[0];
    let _rotCi  = _rotPoolRaw.indexOf(_rotCur);
    if (_rotCi < 0) _rotCi = 0;
    const rotPoolOrdered = _rotPoolRaw.length
        ? _rotPoolRaw.slice(_rotCi).concat(_rotPoolRaw.slice(0, _rotCi))
        : [];

    // ---- Schedule pane: who → recurrence → rotation -------------------------
    const schedulePane = pane("schedule", `
        <div class="fh-form-group-lbl">Who's doing it</div>
        <div class="fh-field">
          <div class="fh-checkbox-row" style="margin-bottom:4px">
            <input type="checkbox" id="m-everyone">
            <label for="m-everyone" style="font-size:.85rem;font-weight:600;cursor:pointer">Everyone</label>
          </div>
          ${multiPersonCheckboxes(people, assigned, "m-assign-person")}
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Recurrence</div>
        <div class="fh-field">
          <select class="fh-select" id="m-crec">
            ${opts([
                { value: "daily",           label: "Daily" },
                { value: "weekly",          label: "Weekly" },
                { value: "monthly_on_date", label: "Monthly" },
            ], recSel)}
          </select>
        </div>
        <div id="m-dayfilter-section" class="fh-field" style="display:none">
          <label class="fh-label">Fires on (leave empty = every day)</label>
          <div class="fh-weekday-row">
            ${weekdayChips(rec.day_filter || [], "m-df-day")}
          </div>
          <div class="fh-field-help">Active that day only — if not done that day it's marked skipped.</div>
        </div>
        <div id="m-weekdays-section" class="fh-field" style="display:none">
          <label class="fh-label">Reset day(s)</label>
          <div class="fh-weekday-row">
            ${weekdayChips(rec.weekdays || [], "m-wd-day")}
          </div>
          <div class="fh-field-help">Stays active until the next reset day, then it's skipped and a fresh one appears.</div>
        </div>
        <div id="m-dom-section" class="fh-field" style="display:none">
          <label class="fh-label">Day(s) of month</label>
          <input class="fh-input" id="m-dom-days" type="text"
                 placeholder="e.g. 1, 15" value="${escAttr(monthDays.join(', '))}">
          <div class="fh-field-help">One or more days 1–31, comma-separated — fires on each (e.g. the 1st and 15th).</div>
        </div>
        <div id="m-chore-expiry-section" class="fh-field" style="display:none">
          <label class="fh-label">Expires after (days)</label>
          <input class="fh-input" id="m-cexpiry" type="number" min="1"
                 value="${c.expires_after_days || ""}">
        </div>
        <div id="m-claimable-section" class="fh-field" style="display:none">
          <label class="fh-label">Claim type</label>
          <select class="fh-select" id="m-csubtype">
            <option value="fcfs"        ${(c.claimable_subtype || "fcfs") === "fcfs"        ? "selected" : ""}>First come, first served</option>
            <option value="multi_claim" ${c.claimable_subtype === "multi_claim"             ? "selected" : ""}>Multi-claim (multiple helpers)</option>
          </select>
        </div>
        <div id="m-multi-claim-section" class="fh-field" style="display:none">
          <div class="fh-row">
            <div class="fh-field">
              <label class="fh-label">Max helpers</label>
              <input class="fh-input" id="m-max-claimants" type="number" min="2" max="20"
                     value="${c.max_claimants || 2}">
            </div>
            <div class="fh-field">
              <label class="fh-label">Points mode</label>
              <select class="fh-select" id="m-points-mode">
                <option value="full"  ${(c.multi_claim_points_mode || "full") === "full"  ? "selected" : ""}>Full points each</option>
                <option value="split" ${c.multi_claim_points_mode === "split"             ? "selected" : ""}>Split evenly</option>
              </select>
            </div>
          </div>
        </div>

        <div id="m-rotation-section" class="fh-field" style="display:none">
          <div class="fh-divider"></div>
          <div class="fh-form-group-lbl">Rotation</div>
          <div class="fh-checkbox-row">
            <input type="checkbox" id="m-crot-enabled"
                   ${(c.rotation_pool && c.rotation_pool.length) ? "checked" : ""}>
            <label for="m-crot-enabled" style="font-size:.88rem">Cycle this chore through a pool of people</label>
          </div>
          <div id="m-rotation-config" class="fh-field" style="display:none">
            <label class="fh-label">Order — top is Current, the rest are Up Next</label>
            <input type="hidden" id="m-crot-pool-order" value="${escAttr(rotPoolOrdered.join(","))}">
            <div id="m-crot-pool-widget" class="fh-rot-pool">
              ${rotationPoolEditor(people, rotPoolOrdered)}
            </div>
            <label class="fh-label" style="margin-top:6px">Cadence</label>
            <select class="fh-select" id="m-crot-cadence">
              ${opts([
                  { value: "per_instance", label: "Per instance (advance each time it regenerates)" },
                  { value: "weekly",       label: "Weekly (a kid holds it all week, flips on the switch day)" },
              ], c.rotation_cadence || "per_instance")}
            </select>
            <div id="m-crot-switch-day-wrap" class="fh-field" style="margin-top:6px;${c.rotation_cadence === "weekly" ? "" : "display:none"}">
              <label class="fh-label">Switch day</label>
              <select class="fh-select" id="m-crot-switch-day">
                ${opts([
                    { value: "0", label: "Monday" },    { value: "1", label: "Tuesday" },
                    { value: "2", label: "Wednesday" }, { value: "3", label: "Thursday" },
                    { value: "4", label: "Friday" },    { value: "5", label: "Saturday" },
                    { value: "6", label: "Sunday" },
                ], String(c.rotation_switch_weekday ?? 0))}
              </select>
            </div>
            <div class="fh-field-help">
              Use ↑/↓ to set the order — the top person is Current; saving makes them
              the active holder, and the next firing advances to who's Up Next. The
              "Who's doing it" selection above is overridden while rotation is on, and
              inactive people are skipped automatically.
            </div>
          </div>
        </div>
    `);

    // ---- Rewards pane: points / approval / penalty / streak milestone ----
    const rewardsPane = pane("rewards", `
        <div class="fh-field">
          <label class="fh-label">Points awarded on completion</label>
          <input class="fh-input" id="m-cpts" type="number" min="0"
                 value="${c.points !== undefined ? c.points : 10}">
        </div>
        <div class="fh-checkbox-row">
          <input type="checkbox" id="m-cappr"
                 ${(c.approval_required !== false) ? "checked" : ""}>
          <label for="m-cappr" style="font-size:.88rem">Requires parent approval</label>
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Penalty for skipping</div>
        <div class="fh-checkbox-row">
          <input type="checkbox" id="m-cpenalty"
                 ${c.penalty_enabled ? "checked" : ""}>
          <label for="m-cpenalty" style="font-size:.88rem">Apply penalty points if skipped</label>
        </div>
        <div id="m-penalty-pts-section" class="fh-field" style="display:none">
          <label class="fh-label">Penalty points</label>
          <input class="fh-input" id="m-cpenalty-pts" type="number" min="1"
                 value="${c.penalty_points || 5}">
        </div>
        <div id="m-daily-threshold-section" class="fh-field" style="display:none">
          <label class="fh-label">Penalty grace (optional)</label>
          <input class="fh-input" id="m-daily-threshold" type="number" min="1"
                 placeholder="e.g. 3"
                 value="${c.daily_penalty_after_days || ""}">
          <div class="fh-field-help">
            Daily chores: how many skips are allowed before the penalty starts — e.g. 3 means
            the first 2 misses are free, then every skip costs the penalty until it's done
            (resets when completed). Weekly/monthly chores: starts deducting the penalty each
            extra day it sits unfinished past this many days.
          </div>
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Streak bonus</div>
        <div class="fh-row">
          <div class="fh-field">
            <label class="fh-label">Streak milestone (0 = off)</label>
            <input class="fh-input" id="m-streak-milestone" type="number" min="0"
                   placeholder="e.g. 7" value="${c.streak_milestone || 0}">
          </div>
          <div class="fh-field">
            <label class="fh-label">Bonus points awarded</label>
            <input class="fh-input" id="m-streak-bonus" type="number" min="0"
                   value="${c.streak_bonus_points || 0}">
          </div>
        </div>
    `);

    return `
        ${isEdit ? `<input type="hidden" id="m-cid" value="${c.chore_id}">` : ""}
        ${tabStrip}
        <div class="fh-chore-tab-panes">
          ${detailsPane}
          ${schedulePane}
          ${rewardsPane}
        </div>`;
}

/**
 * Chore form modal — wraps choreFormFields() in the standard modal shell.
 * @param {object|null} chore      - Existing chore for edit mode, null for add
 * @param {boolean}     isEdit     - Whether this is an edit operation
 * @param {object[]}    people     - All people from sensor
 * @param {string[]}    catLabels  - Available category label strings
 * @param {string}      activeTab  - Active tab key (passed through to choreFormFields)
 */
export function mChoreForm(chore, isEdit, people, catLabels, activeTab = "details") {
    const c     = chore || {};
    const title = isEdit ? `Edit — ${c.name}` : "Add chore";
    const okAct = isEdit ? "ok-edit-chore" : "ok-add-chore";
    return dWrap(title, choreFormFields(chore, isEdit, people, catLabels, activeTab),
        isEdit ? "Save changes" : "Add chore", okAct);
}

// ---------------------------------------------------------------------------
// Store item (add / edit / inline-panel shared fields)
// ---------------------------------------------------------------------------

/**
 * Shared store-item form fields for both modals and the inline editor panel.
 * Uses the same m-* IDs as the modals (never simultaneously in the DOM).
 */
export function storeItemFormFields(item, isEdit, people, catLabels) {
    const name           = item?.name             || "";
    const desc           = item?.description      || "";
    const dollar         = item?.dollar_value     ?? "";
    const scope          = item?.scope            || "common";
    const personIds      = item?.person_ids       || [];
    const icon           = item?.icon             || "";
    const catLabel       = item?.category_label   || "";
    const maxPeriod      = item?.max_per_period   ?? 0;
    const period         = item?.period           || "week";
    const active         = item?.active           !== false;
    const isGroupReward  = !!item?.is_group_reward;
    // v0.6.5 subscription fields
    const isSubscription = item?.item_type           === "subscription";
    const subPeriod      = item?.subscription_period || "monthly";
    // v0.7.6 reward gates
    const reqPct         = item?.require_daily_pct    ?? 0;
    const minRank        = item?.min_rank_index       ?? 0;
    const rankOpts       = [0, 1, 2, 3, 4].map(i =>
        `<option value="${i}" ${minRank === i ? "selected" : ""}>${i === 0 ? "No requirement" : (i === 4 ? "Rank 5 (max)" : `Rank ${i + 1}+`)}</option>`
    ).join("");

    const catOptions = catLabels.map(l =>
        `<option value="${escAttr(l)}" ${catLabel === l ? "selected" : ""}>${escHTML(l)}</option>`
    ).join("");

    // Kids only (parents can't contribute to group rewards)
    const kids = people.filter(p => p.type !== "parent");

    // Map existing contributor % by person_id
    const existingPct = {};
    for (const c of (item?.contributors || [])) {
        existingPct[c.person_id] = c.share_pct || 0;
    }

    // Inline handlers (no extra event listeners needed)
    const scopeToggle =
        `((sel)=>{` +
            `const r=sel.getRootNode();` +
            `const grp=r.getElementById('m-sgroup');` +
            `if(grp&&grp.checked)return;` +
            `const pSec=r.getElementById('m-sperson-section');` +
            `if(pSec)pSec.style.display=sel.value==='personal'?'':'none';` +
        `})(this)`;

    const groupToggle =
        `((cb)=>{` +
            `const r=cb.getRootNode();` +
            `const sec=r.getElementById('m-sgroup-section');` +
            `const pSec=r.getElementById('m-sperson-section');` +
            `if(sec)sec.style.display=cb.checked?'':'none';` +
            `if(pSec)pSec.style.display=cb.checked?'none':'';` +
        `})(this)`;

    const equalSplit =
        `((btn)=>{` +
            `const inputs=[...btn.closest('#m-sgroup-section').querySelectorAll('.m-scontrib')];` +
            `if(!inputs.length)return;` +
            `const each=Math.floor(100/inputs.length),rem=100-each*inputs.length;` +
            `inputs.forEach((inp,i)=>{inp.value=each+(i===0?rem:0);});` +
            `const tot=btn.closest('#m-sgroup-section').querySelector('#m-sgroup-total');` +
            `if(tot){tot.textContent='Total: 100%';tot.style.color='var(--fh-success)';}` +
        `})(this)`;

    const updateTotal =
        `((inp)=>{` +
            `const sec=inp.closest('#m-sgroup-section');if(!sec)return;` +
            `const tot=[...sec.querySelectorAll('.m-scontrib')].reduce((s,i)=>s+(parseInt(i.value)||0),0);` +
            `const el=sec.querySelector('#m-sgroup-total');` +
            `if(el){el.textContent='Total: '+tot+'%';` +
            `el.style.color=tot===100?'var(--fh-success)':tot>100?'var(--fh-overdue)':'var(--fh-text-sec)';}` +
        `})(this)`;

    // v0.6.5: show/hide the subscription section based on the type toggle
    const subTypeToggle =
        `((cb)=>{` +
            `const r=cb.getRootNode();` +
            `const s=r.getElementById('m-ssub-section');` +
            `if(s)s.style.display=cb.checked?'':'none';` +
        `})(this)`;

    const contribRows = kids.map(k => {
        const pct = existingPct[k.person_id] ?? "";
        return `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="flex:1;font-size:.85rem">${escHTML(k.name)}</span>
            <input type="number" class="fh-input m-scontrib"
                   data-pid="${escAttr(k.person_id)}"
                   style="width:72px;text-align:right"
                   min="0" max="100" step="1" value="${pct}"
                   oninput="${updateTotal}">
            <span style="font-size:.85rem">%</span>
          </div>`;
    }).join("");

    const initialTotal = kids.reduce((s, k) => s + (existingPct[k.person_id] || 0), 0);
    const totalColor   = initialTotal === 100 ? "var(--fh-success)"
                       : initialTotal  > 100 ? "var(--fh-overdue)"
                       : "var(--fh-text-sec)";

    return `
      ${isEdit ? `<input type="hidden" id="m-eiid" value="${item.item_id}">` : ""}
      <div class="fh-field">
        <label class="fh-label">Item name *</label>
        <input class="fh-input" id="m-sname" type="text" value="${escAttr(name)}"${!isEdit ? " autofocus" : ""}>
      </div>
      <div class="fh-field">
        <label class="fh-label">Description (optional)</label>
        <input class="fh-input" id="m-sdesc" type="text" value="${escAttr(desc)}">
      </div>
      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Dollar value *</label>
          <input class="fh-input" id="m-sdollar" type="number" min="0.01"
                 step="0.01" value="${dollar}" placeholder="e.g. 5.00">
        </div>
        <div class="fh-field">
          <label class="fh-label">Scope</label>
          <select class="fh-select" id="m-sscope" oninput="${scopeToggle}">
            <option value="common"   ${scope === "common"   ? "selected" : ""}>All kids</option>
            <option value="personal" ${scope === "personal" ? "selected" : ""}>Specific people</option>
          </select>
        </div>
      </div>
      <div id="m-sperson-section" class="fh-field" style="${scope === "personal" && !isGroupReward ? "" : "display:none"}">
        <label class="fh-label">Who can see this reward?</label>
        ${multiPersonCheckboxes(people, personIds, "m-sp-person")}
      </div>

      <!-- Group reward toggle -->
      <div class="fh-field" style="border-top:1px solid var(--fh-border);padding-top:10px;margin-top:4px">
        <label class="fh-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <label class="fh-toggle">
            <input type="checkbox" id="m-sgroup" ${isGroupReward ? "checked" : ""} oninput="${groupToggle}">
            <span class="fh-toggle-slider"></span>
          </label>
          🤝 Group reward — kids chip in together
        </label>
      </div>
      <div id="m-sgroup-section" class="fh-field" style="${isGroupReward ? "" : "display:none"}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <label class="fh-label" style="margin:0">Contributors &amp; share %</label>
          <button type="button" class="fh-btn fh-btn-ghost fh-btn-sm"
                  onclick="${equalSplit}">Equal split</button>
        </div>
        ${kids.length
            ? contribRows + `<div id="m-sgroup-total" style="font-size:.8rem;color:${totalColor}">Total: ${initialTotal}%</div>`
            : `<span style="font-size:.82rem;color:var(--fh-text-sec)">No kids found — add people first.</span>`}
      </div>

      <!-- v0.6.5: subscription type toggle + period (anchor set at subscription-approval time) -->
      <div class="fh-field" style="border-top:1px solid var(--fh-border);padding-top:10px;margin-top:4px">
        <label class="fh-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <label class="fh-toggle">
            <input type="checkbox" id="m-ssubtype" ${isSubscription ? "checked" : ""} oninput="${subTypeToggle}">
            <span class="fh-toggle-slider"></span>
          </label>
          Subscription — recurring deduction
        </label>
      </div>
      <div id="m-ssub-section" ${isSubscription ? "" : `style="display:none"`}>
        <div class="fh-field">
          <label class="fh-label">Subscription period</label>
          <select class="fh-select" id="m-ssperiod">
            <option value="daily"     ${subPeriod === "daily"     ? "selected" : ""}>Daily</option>
            <option value="weekly"    ${subPeriod === "weekly"    ? "selected" : ""}>Weekly</option>
            <option value="monthly"   ${subPeriod === "monthly"   ? "selected" : ""}>Monthly</option>
            <option value="quarterly" ${subPeriod === "quarterly" ? "selected" : ""}>Quarterly</option>
            <option value="biannual"  ${subPeriod === "biannual"  ? "selected" : ""}>Bi-annual</option>
            <option value="annual"    ${subPeriod === "annual"    ? "selected" : ""}>Annual</option>
          </select>
          <div class="fh-field-help">The renewal anchor day is set by the parent when approving a child's subscription request.</div>
        </div>
      </div>

      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Category</label>
          <select class="fh-select" id="m-scat">
            <option value="" ${!catLabel ? "selected" : ""}>(none)</option>
            ${catOptions}
          </select>
        </div>
        <div class="fh-field">
          <label class="fh-label">Active</label>
          <label class="fh-toggle" style="margin-top:10px">
            <input type="checkbox" id="m-sactive" ${active ? "checked" : ""}>
            <span class="fh-toggle-slider"></span>
          </label>
        </div>
      </div>
      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Max per period (0 = unlimited)</label>
          <input class="fh-input" id="m-smaxperiod" type="number"
                 min="0" step="1" value="${maxPeriod}">
        </div>
        <div class="fh-field">
          <label class="fh-label">Period</label>
          <select class="fh-select" id="m-speriod">
            <option value="day"   ${period === "day"   ? "selected" : ""}>Day</option>
            <option value="week"  ${period === "week"  ? "selected" : ""}>Week</option>
            <option value="month" ${period === "month" ? "selected" : ""}>Month</option>
          </select>
        </div>
      </div>
      <!-- v0.7.6: reward gates — chore-completion % + minimum rank -->
      <div class="fh-field" style="border-top:1px solid var(--fh-border);padding-top:10px;margin-top:4px">
        <label class="fh-label">Reward requirements (optional)</label>
        <div class="fh-field-help">Lock this reward until the child meets these. Leave at 0 / "No requirement" to disable.</div>
      </div>
      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Min daily chores done % (0 = off)</label>
          <input class="fh-input" id="m-sreqpct" type="number"
                 min="0" max="100" step="5" value="${reqPct}" placeholder="e.g. 80">
          <div class="fh-field-help">Counts only that day's daily chores (approved). Any weekly chore due that day must also be done.</div>
        </div>
        <div class="fh-field">
          <label class="fh-label">Minimum rank</label>
          <select class="fh-select" id="m-sminrank">${rankOpts}</select>
        </div>
      </div>
      ${rewardIconPickerSection(icon)}`;
}

export function mAddStoreItem(people, catLabels = []) {
    return mWrap("Add reward item",
        storeItemFormFields(null, false, people, catLabels),
        "Add reward", "ok-add-store-item");
}

export function mEditStoreItem(item, people, catLabels = []) {
    return mWrap(`Edit — ${escHTML(item.name)}`,
        storeItemFormFields(item, true, people, catLabels),
        "Save changes", "ok-edit-store-item");
}

// ---------------------------------------------------------------------------
// People (add / edit / confirm remove)
// ---------------------------------------------------------------------------

export function mAddPerson() {
    return mWrap("Add person",
        `<div class="fh-field">
         <label class="fh-label">Name *</label>
         <input class="fh-input" id="m-pname" type="text" autofocus>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Type</label>
           <select class="fh-select" id="m-ptype">
             <option value="kid">Kid</option>
             <option value="parent">Parent</option>
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Avatar colour</label>
           <input class="fh-input" id="m-pcolor" type="color"
                  value="${DEFAULT_COLOR}" style="height:42px;padding:4px">
         </div>
       </div>`,
        "Add person", "ok-add-person");
}

export function mEditPerson(d) {
    const WEEKDAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const wdayOpts = WEEKDAY_NAMES.map((n, i) =>
        `<option value="${i}" ${d.allowanceWday === i ? "selected" : ""}>${n}</option>`
    ).join("");
    const mdayOpts = Array.from({length: 28}, (_, i) => i + 1).map(day =>
        `<option value="${day}" ${d.allowanceMday === day ? "selected" : ""}>${day}</option>`
    ).join("");

    // Theme metadata — accent shown in the swatch preview next to the dropdown.
    const THEMES = [
        { value: "classic",  label: "Classic",        accent: d.pcolor || "#4A90E2" },
        { value: "engineer", label: "Engineer",       accent: "#E0B84C" },
        { value: "baker",    label: "Baker",          accent: "#8B3A2A" },
        { value: "dinos",    label: "Dinos",          accent: "#8B6A20" },
        { value: "hp",       label: "Harry Potter",   accent: "#1F4F3C" },
        { value: "dbz",      label: "Dragon Ball Z",  accent: "#FF6A1A" },
    ];
    const currentTheme  = THEMES.find(t => t.value === d.theme) || THEMES[0];
    const themeOpts = THEMES.map(t =>
        `<option value="${t.value}" ${d.theme === t.value ? "selected" : ""}>${t.label}</option>`
    ).join("");

    const section = (label, sub, body) => `
      <div class="fh-modal-section">
        <div class="fh-modal-section-hdr">
          <span class="fh-modal-section-lbl">${escHTML(label)}</span>
          ${sub ? `<span class="fh-modal-section-sub">${escHTML(sub)}</span>` : ""}
        </div>
        ${body}
      </div>`;

    return dWrap(`Edit — ${d.pname}`,
        `${section("Identity", "name, codename, avatar color", `
           <div class="fh-field">
             <label class="fh-label">Name *</label>
             <input class="fh-input" id="m-pname" type="text" value="${escAttr(d.pname)}" autofocus>
           </div>
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Codename</label>
               <input class="fh-input" id="m-pcode" type="text"
                      value="${escAttr(d.code || "")}"
                      placeholder="e.g. T-REX, SNITCH, KODIAK"
                      style="text-transform:uppercase">
               <div class="fh-field-help">Shown on Mission Control mini buttons and agent cards.</div>
             </div>
             <div class="fh-field">
               <label class="fh-label">Type</label>
               <select class="fh-select" id="m-ptype">
                 <option value="kid"    ${d.ptype === "kid"    ? "selected" : ""}>Kid</option>
                 <option value="parent" ${d.ptype === "parent" ? "selected" : ""}>Parent</option>
               </select>
             </div>
           </div>
           <div class="fh-field">
             <label class="fh-label">Avatar color</label>
             <input class="fh-input" id="m-pcolor" type="color"
                    value="${d.pcolor}" style="height:42px;padding:4px;width:100%">
             <div class="fh-field-help">Used for chips, accents, and the Mission Control row tint.</div>
           </div>
        `)}

        ${section("Theme", "personal-page look & feel", `
           <div class="fh-field">
             <label class="fh-label">Theme</label>
             <div class="fh-theme-pick">
               <span class="fh-theme-swatch" style="background:${currentTheme.accent}"></span>
               <select class="fh-select" id="m-ptheme" style="flex:1">${themeOpts}</select>
             </div>
             <div class="fh-field-help">Changes the personal dashboard skin. Swatch shows current accent.</div>
           </div>
           <div class="fh-toggle-row">
             <div>
               <div style="font-size:.9rem;font-weight:600">Large-button mode</div>
               <div style="font-size:.75rem;color:var(--fh-text-sec)">
                 Card grid layout, bigger icons &amp; buttons — best for pre-readers.
               </div>
             </div>
             <label class="fh-toggle">
               <input type="checkbox" id="m-pchildmode" ${d.childMode ? "checked" : ""}>
               <span class="fh-toggle-slider"></span>
             </label>
           </div>
        `)}

        ${section("Allowance", "scheduled point payouts", `
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Amount (pts, 0 = off)</label>
               <input class="fh-input" id="m-allowance-pts" type="number" min="0"
                      value="${d.allowancePts}" style="width:100%">
             </div>
             <div class="fh-field">
               <label class="fh-label">Schedule</label>
               <select class="fh-select" id="m-allowance-schedule">
                 <option value="weekly"   ${d.allowanceSched === "weekly"   ? "selected" : ""}>Weekly</option>
                 <option value="biweekly" ${d.allowanceSched === "biweekly" ? "selected" : ""}>Bi-weekly</option>
                 <option value="monthly"  ${d.allowanceSched === "monthly"  ? "selected" : ""}>Monthly</option>
               </select>
             </div>
           </div>
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Day of week (weekly / bi-weekly)</label>
               <select class="fh-select" id="m-allowance-weekday">${wdayOpts}</select>
             </div>
             <div class="fh-field">
               <label class="fh-label">Day of month (monthly)</label>
               <select class="fh-select" id="m-allowance-monthday">${mdayOpts}</select>
             </div>
           </div>
        `)}

        ${section("Success streak", "bonus for consistent days", `
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Threshold (% of due chores done)</label>
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
             <label class="fh-label">Bonus points at each milestone</label>
             <input class="fh-input" id="m-completion-bonus" type="number"
                    min="0" value="${d.completionBonusPoints ?? 50}">
             <div class="fh-field-help">
               Awards bonus points when this person completes at least the threshold
               share of their daily assigned chores for N consecutive days.
               Rest days (no chores due) and excused chores don't count either way.
               Set milestone to 0 to disable.
             </div>
           </div>
        `)}

        ${section("Notifications", "push targets for approvals & reminders", `
           <div class="fh-field">
             <label class="fh-label">Notify target (HA service name, blank = off)</label>
             <input class="fh-input" id="m-pnotify" type="text"
                    value="${escAttr(d.notifyTarget || "")}"
                    placeholder="e.g. mobile_app_jackson_iphone">
             <div class="fh-field-help">HA <code>notify.*</code> service name. Works with the Companion App or Alexa Media.</div>
           </div>
        `)}

        <div class="fh-field-help">Rank tuning has moved to <strong>Settings → Ranks</strong>.</div>

        <input type="hidden" id="m-pid" value="${d.pid}">`,
        "Save", "ok-edit-person");
}

export function mConfirmRemovePerson(d) {
    return `
      <div class="fh-modal">
        <div class="fh-modal-title">Remove ${escHTML(d.pname)}?</div>
        <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0;line-height:1.5">
          This will deactivate <strong>${escHTML(d.pname)}</strong> and remove their pending tasks.
          Historical data and point history are preserved.
          This cannot be undone from the card.
        </p>
        <input type="hidden" id="m-rpid" value="${d.pid}">
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn fh-btn-danger" data-act="ok-remove-person">
            Remove ${escHTML(d.pname)}
          </button>
        </div>
      </div>`;
}

export function mConfirmHardDeletePerson(d) {
    return `
      <div class="fh-modal">
        <div class="fh-modal-title">Permanently delete ${escHTML(d.pname)}?</div>
        <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0;line-height:1.5">
          This permanently removes <strong>${escHTML(d.pname)}</strong> and purges ALL of their data —
          task instances, redemptions, subscriptions, group contributions, and activity-log entries.
          <strong style="color:var(--fh-overdue)">This cannot be undone.</strong>
          To keep them recoverable (e.g. away at camp), use Reactivate instead.
        </p>
        <input type="hidden" id="m-hdpid" value="${d.pid}">
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn fh-btn-danger" data-act="ok-hard-delete-person">
            Delete permanently
          </button>
        </div>
      </div>`;
}

// ---------------------------------------------------------------------------
// Edit streaks (admin correction modal — per-row Set buttons, no mWrap)
// ---------------------------------------------------------------------------

export function mEditStreaks(pid, pname, chores, personStreaks) {
    // Only show assigned chores (claimable/reminder streaks don't apply)
    const assigned = chores.filter(c => c.chore_type === "assigned");
    const rows = assigned.map(c => {
        const current = personStreaks[c.chore_id] || 0;
        return `
          <div class="fh-point-row" style="gap:8px">
            <span style="flex:1;font-size:.88rem;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                  title="${escAttr(c.name)}">${escHTML(c.name)}</span>
            <input class="fh-input" id="m-streak-${escAttr(c.chore_id)}" type="number" min="0"
                   value="${current}" style="width:64px;text-align:center">
            <button class="fh-btn fh-btn-primary fh-btn-sm"
                    data-act="set-streak" data-pid="${pid}" data-cid="${escAttr(c.chore_id)}">
              Set
            </button>
          </div>`;
    }).join("") || `<div class="fh-empty">No assigned chores.</div>`;

    return `
      <div class="fh-modal">
        <div class="fh-modal-title">🔥 Edit streaks — ${escHTML(pname)}</div>
        <p style="font-size:.8rem;color:var(--fh-text-sec);margin:0 0 8px">
          Enter the correct streak count and press Set. Changes save immediately.
        </p>
        <div style="display:flex;flex-direction:column;gap:6px">${rows}</div>
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Done</button>
        </div>
      </div>`;
}

// ---------------------------------------------------------------------------
// Settings edit
// ---------------------------------------------------------------------------

export function mEditSettings(d) {
    return dWrap("Edit settings",
        `<div class="fh-field">
         <label class="fh-label">Family name</label>
         <input class="fh-input" id="m-fname" type="text"
                value="${escAttr(d.fname)}" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Points per dollar</label>
         <input class="fh-input" id="m-ppd" type="number" min="1" value="${d.ppd}">
       </div>
       <div class="fh-field">
         <label class="fh-label">Penalty alert time (-1 = off, e.g. 800 for 8:00 AM)</label>
         <input class="fh-input" id="m-alert-time" type="number" min="-1" max="2359"
                placeholder="800" value="${d.penaltyAlertTime !== undefined ? d.penaltyAlertTime : 800}">
       </div>
       <div class="fh-field-help">Rank evaluation &amp; reward-per-rank settings now live in the <strong>Ranks</strong> panel.</div>`,
        "Save", "ok-edit-settings");
}

// ---------------------------------------------------------------------------
// Ranks drawer (v0.7.2 — consolidated: global eval + ¢/pt ladder + per-kid curves)
// ---------------------------------------------------------------------------

export function mRanksDrawer(card) {
    const naAttr = card._attrs("sensor.family_hub_needs_attention");
    const kids   = (naAttr.people || []).filter(p => p.type === "kid");
    const active = card._ranksTab || "global";
    const WEEKDAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    const tabBar = `
      <div class="fh-drawer-tabs">
        <button class="fh-drawer-tab ${active === "global" ? "active" : ""}"
                data-act="ranks-tab" data-tab="global">Global</button>
        ${kids.map(p => `
          <button class="fh-drawer-tab ${active === p.person_id ? "active" : ""}"
                  data-act="ranks-tab" data-tab="${escAttr(p.person_id)}">${escHTML(p.name)}</button>`).join("")}
      </div>`;

    // ---- Global tab: eval weekday, default band (%), ¢/pt ladder ------------
    if (active === "global") {
        const evalWday = naAttr.rank_eval_weekday ?? 0;
        const gCap     = naAttr.rank_default_cap ?? 100;
        const gDropPct = naAttr.rank_default_drop_pct ?? 60;
        const gGainPct = naAttr.rank_default_gain_pct ?? 80;
        const gDynamic = naAttr.rank_dynamic_capacity !== false;   // dynamic is the default
        const ladder   = naAttr.rank_ppd_ladder || [3.0, 3.5, 4.0, 4.5, 5.0];
        const wdayOpts = WEEKDAY_NAMES.map((n, i) =>
            `<option value="${i}" ${evalWday == i ? "selected" : ""}>${n}</option>`).join("");
        const ladderRows = ladder.map((cpt, i) => `
          <div class="fh-row" style="gap:6px;align-items:center">
            <span style="font-size:.8rem;color:var(--fh-text-sec);width:54px;flex-shrink:0">Rank ${i}</span>
            <input class="fh-input fh-ad-rank-ladder-input" type="number"
                   min="0.1" max="100" step="0.1" data-rank-idx="${i}"
                   value="${cpt}" style="flex:1">
            <span style="font-size:.8rem;color:var(--fh-text-sec)">¢/pt</span>
          </div>`).join("");
        const body = `
          ${tabBar}
          <div class="fh-field">
            <label class="fh-label">Evaluate ranks on</label>
            <select class="fh-select" id="m-rank-weekday">${wdayOpts}</select>
          </div>
          <div class="fh-field-help" style="margin:-2px 0 8px">
            Ranks move on this day each week, measured against each kid's
            <strong>weekly assigned chore points</strong> (rotations included; no bonus
            chores or streak bonuses) — so the bar always fits what they were actually given.
          </div>
          <div class="fh-row">
            <div class="fh-field">
              <label class="fh-label">Default drop &lt; %</label>
              <input class="fh-input" id="m-rank-drop" type="number" min="0" max="100" value="${gDropPct}">
            </div>
            <div class="fh-field">
              <label class="fh-label">Default gain ≥ %</label>
              <input class="fh-input" id="m-rank-gain" type="number" min="0" max="100" value="${gGainPct}">
            </div>
          </div>
          <div class="fh-field-help">Default bands for any kid without their own per-rank curve (% of their weekly assigned points).</div>
          <div class="fh-divider"></div>
          <div class="fh-field">
            <label class="fh-label">Reward value per rank (¢/point)</label>
            <div class="fh-field-help" style="margin-bottom:6px">
              Higher rank → more cents per point → fewer points to redeem rewards.
            </div>
            ${ladderRows}
          </div>`;
        return dWrap("Ranks", body, "Save", "save-ranks-global");
    }

    // ---- Per-kid tab: rank override + percentage-band editor ---------------
    const p = kids.find(x => x.person_id === active);
    if (!p) { card._ranksTab = "global"; return mRanksDrawer(card); }

    const ranks    = getTheme(p.theme_key || "classic").ranks;
    const rankIdx  = p.rank_index ?? 0;
    const curve    = p.rank_curve || {};
    const cap         = curve.cap ?? 100;
    const dyn         = naAttr.rank_dynamic_capacity !== false;   // dynamic is the default
    const assignedPpw = p.assigned_ppw ?? 0;
    const effCap      = dyn ? assignedPpw : cap;   // dynamic basis = this kid's assigned pts/week
    const gainPcts = (Array.isArray(curve.gain_pcts) && curve.gain_pcts.length === 5)
        ? curve.gain_pcts : DEFAULT_GAIN_PCTS.slice();
    const dropPcts = (Array.isArray(curve.drop_pcts) && curve.drop_pcts.length === 5)
        ? curve.drop_pcts : DEFAULT_DROP_PCTS.slice();
    const preview  = curveFromPercents(effCap, gainPcts, dropPcts);

    const gridRows = ranks.map((r, i) => {
        const isTop = i === ranks.length - 1;
        const isBot = i === 0;
        return `
          <div class="fh-rank-grid-row">
            <span class="fh-rank-grid-name">${i === rankIdx ? "▶ " : ""}${escHTML(r.name)}</span>
            <span class="fh-rank-grid-cell">
              <input class="fh-input" id="m-drop-pct-${i}" type="number" min="0" max="100"
                     value="${isBot ? "" : dropPcts[i]}" ${isBot ? "disabled placeholder='—'" : ""}>
              <span class="fh-rank-grid-pts" id="m-drop-pts-${i}">${isBot ? "—" : preview.drop[i]}</span>
            </span>
            <span class="fh-rank-grid-cell">
              <input class="fh-input" id="m-gain-pct-${i}" type="number" min="0" max="100"
                     value="${isTop ? "" : gainPcts[i]}" ${isTop ? "disabled placeholder='—'" : ""}>
              <span class="fh-rank-grid-pts" id="m-gain-pts-${i}">${isTop ? "—" : preview.gain[i]}</span>
            </span>
          </div>`;
    }).join("");

    const body = `
      ${tabBar}
      <div class="fh-field-help">
        Theme <strong>${escHTML(p.theme_key || "classic")}</strong> · currently
        <strong>${escHTML(getEffectiveRank(rankIdx, ranks).name)}</strong>
      </div>
      <div class="fh-field">
        <label class="fh-label">Set current rank (0–4)</label>
        <input class="fh-input" id="m-rank-idx" type="number" min="0" max="4" value="${rankIdx}">
      </div>
      <input type="hidden" id="m-curve-cap" value="${effCap}">
      <div class="fh-field">
        <label class="fh-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <label class="fh-toggle">
            <input type="checkbox" id="m-rank-lock" ${p.rank_locked ? "checked" : ""}>
            <span class="fh-toggle-slider"></span>
          </label>
          Lock this rank (pause weekly auto-evaluation)
        </label>
        <div class="fh-field-help">
          Off: setting the rank is a one-time promote/demote — the weekly evaluation
          can still move them after. On: their rank stays pinned here until you unlock it.
        </div>
      </div>
      <div class="fh-field-help">
        Bands are a % of ${escHTML(p.name)}'s directly-assigned chores —
        about <strong>${effCap} pts this week</strong> (rotations included; no bonus
        chores or streak bonuses). The point ranges below scale from that and recompute
        every week.
      </div>
      <div class="fh-rank-summary" style="font-size:var(--fh-text-sm);margin:6px 0 2px;padding:8px 10px;border:1px solid var(--fh-border);border-radius:8px;background:var(--fh-surface)">
        Now: <strong>${escHTML(getEffectiveRank(rankIdx, ranks).name)}</strong>${dyn && effCap <= 0 ? " · no assigned chores — rank won't move" : `${rankIdx < ranks.length - 1 ? ` · ranks up at <strong>≥ ${preview.gain[rankIdx]} pts/wk</strong>` : " · top rank"}${rankIdx > 0 ? ` · drops below <strong>${preview.drop[rankIdx]} pts/wk</strong>` : " · can't drop"}`}
      </div>

      <div class="fh-modal-section">
        <div class="fh-modal-section-hdr"><span class="fh-modal-section-lbl">Per-rank bands</span></div>
        <div class="fh-rank-grid-row" style="margin-bottom:4px">
          <span class="fh-rank-grid-hdr">Rank</span>
          <span class="fh-rank-grid-hdr">Drop &lt; %</span>
          <span class="fh-rank-grid-hdr">Gain ≥ %</span>
        </div>
        <div class="fh-rank-grid">${gridRows}</div>
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="ranks-preview"
                style="margin-top:8px">↻ Recompute points</button>
        <div class="fh-field-help" style="margin-top:6px">
          ▶ marks the current rank. Bottom rung can't fall; top rung can't climb.
        </div>
      </div>

      <input type="hidden" id="m-rank-pid" value="${escAttr(p.person_id)}">`;
    return dWrap(`Ranks — ${escHTML(p.name)}`, body, "Save", "save-ranks-kid");
}

// ---------------------------------------------------------------------------
// Claim task
// ---------------------------------------------------------------------------

/**
 * Claim modal — v0.6.1 redesign.
 * Card-grid picker of tappable person tiles. Tap a tile = claim instantly
 * (no separate OK button). Designed for Echo Show touch input.
 *
 * Backward compat: legacy ok-claim handler still reads m-clperson/m-cltid as
 * fallbacks, so any other code path that opens this modal differently still works.
 */
export function mClaim(m, people) {
    // Only kids can claim chores — parents shouldn't pick up bonus chores.
    const eligible = people.filter(p => p.type === "kid");

    if (!eligible.length) {
        return `
          <div class="fh-modal">
            <div class="fh-modal-title">Claim — ${escHTML(m.data.name)}</div>
            <p class="fh-empty">No eligible people to claim this chore.</p>
            <div class="fh-modal-footer">
              <button class="fh-btn fh-btn-ghost" data-act="close-modal">Close</button>
            </div>
          </div>`;
    }

    const tiles = eligible.map(p => {
        const color = p.avatar_color || DEFAULT_COLOR;
        return `
          <button class="fh-claim-tile" data-act="ok-claim"
                  data-tid="${m.data.tid}" data-pid="${p.person_id}"
                  style="--tile-color:${color}">
            <div class="fh-claim-tile-avatar" style="background:${color}">${ini(p.name)}</div>
            ${p.code ? `<div class="fh-claim-tile-code">${escHTML(p.code)}</div>` : ""}
            <div class="fh-claim-tile-name">${escHTML(p.name)}</div>
          </button>`;
    }).join("");

    return `
      <div class="fh-modal">
        <div class="fh-modal-title">Claim — ${escHTML(m.data.name)}</div>
        <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0 0 12px;line-height:1.4">
          Who's claiming this chore?
        </p>
        <div class="fh-claim-grid">${tiles}</div>
        <input type="hidden" id="m-cltid" value="${m.data.tid}">
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
        </div>
      </div>`;
}

// ---------------------------------------------------------------------------
// Add reminder
// ---------------------------------------------------------------------------

export function mAddReminder(m, people) {
    return mWrap("Add personal reminder",
        `<div class="fh-field">
         <label class="fh-label">Reminder name *</label>
         <input class="fh-input" id="m-rname" type="text" autofocus
                placeholder="e.g. Take vitamins, Feed the dog">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Who?</label>
           <select class="fh-select" id="m-rperson">
             ${people.map(p =>
                 `<option value="${p.person_id}"
                          ${m.data?.pid === p.person_id ? "selected" : ""}>${escHTML(p.name)}</option>`
             ).join("")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Recurrence</label>
           <select class="fh-select" id="m-rrec">
             ${opts([
                 { value: "daily",           label: "Daily" },
                 { value: "weekly",          label: "Weekly" },
                 { value: "every_n_days",    label: "Every N days" },
                 { value: "monthly_on_date", label: "Monthly" },
             ], "daily")}
           </select>
         </div>
       </div>`,
        "Add", "ok-add-reminder");
}

// ---------------------------------------------------------------------------
// Shared: person checkbox chips
// ---------------------------------------------------------------------------

/**
 * Render a list of person chip checkboxes.
 * @param {object[]} people      - All people from sensor
 * @param {string[]} selectedIds - Pre-selected person_ids
 * @param {string}   cbClass     - CSS class for each <input> for bulk reading
 */
/**
 * Render the ordered rotation pool editor. Two stacked sections:
 *
 *   1. "In rotation" — numbered chips with ↑/↓/× controls. Order is
 *      meaningful; top of list is next up.
 *   2. "Add" — chips for people not yet in the pool; click to append.
 *
 * The handlers (rot-pool-add / rot-pool-remove / rot-pool-up / rot-pool-down)
 * mutate the hidden `#m-crot-pool-order` CSV input and call this helper again
 * to repaint the widget in place.
 *
 * @param {object[]} people    All people from the needs_attention sensor.
 * @param {string[]} orderedIds Ordered list of person_ids currently in the pool.
 * @returns {string} Inner HTML for the widget container.
 */
export function rotationPoolEditor(people, orderedIds) {
    const byId     = new Map(people.map(p => [p.person_id, p]));
    const ordered  = orderedIds.map(pid => byId.get(pid)).filter(Boolean);
    const inPool   = new Set(orderedIds);
    const available = people.filter(p => !inPool.has(p.person_id));

    const orderedHtml = ordered.length
        ? ordered.map((p, i) => {
            const color  = p.avatar_color || DEFAULT_COLOR;
            const upDis  = i === 0 ? "disabled" : "";
            const dnDis  = i === ordered.length - 1 ? "disabled" : "";
            // v0.7.3: Current / Up Next section headers so it's obvious whose turn it is.
            const header = i === 0
                ? `<div class="fh-rot-section-hdr">Current</div>`
                : (i === 1 ? `<div class="fh-rot-section-hdr">Up Next</div>` : "");
            return `${header}
              <div class="fh-rot-item${i === 0 ? " fh-rot-item--current" : ""}" data-pid="${escAttr(p.person_id)}" style="--chip-color:${color}">
                <span class="fh-avatar" style="background:${color};width:22px;height:22px;font-size:.7rem">${ini(p.name)}</span>
                <span class="fh-rot-name">${escHTML(p.name)}</span>
                <button type="button" class="fh-rot-ctrl" data-act="rot-pool-up"
                        data-pid="${escAttr(p.person_id)}" ${upDis} aria-label="Move up">↑</button>
                <button type="button" class="fh-rot-ctrl" data-act="rot-pool-down"
                        data-pid="${escAttr(p.person_id)}" ${dnDis} aria-label="Move down">↓</button>
                <button type="button" class="fh-rot-ctrl fh-rot-ctrl-remove"
                        data-act="rot-pool-remove" data-pid="${escAttr(p.person_id)}"
                        aria-label="Remove from pool">×</button>
              </div>`;
        }).join("")
        : `<div class="fh-rot-empty">No one in the pool yet — add a kid below.</div>`;

    const availableHtml = available.length
        ? available.map(p => {
            const color = p.avatar_color || DEFAULT_COLOR;
            return `
              <button type="button" class="fh-rot-add"
                      data-act="rot-pool-add" data-pid="${escAttr(p.person_id)}"
                      style="--chip-color:${color}">
                <span class="fh-avatar" style="background:${color};width:18px;height:18px;font-size:.6rem">${ini(p.name)}</span>
                + ${escHTML(p.name)}
              </button>`;
        }).join("")
        : `<div class="fh-rot-add-empty">Everyone is in the pool.</div>`;

    return `
      <div class="fh-rot-ordered">${orderedHtml}</div>
      <div class="fh-rot-available-lbl">Add to pool:</div>
      <div class="fh-rot-available">${availableHtml}</div>`;
}

// ---------------------------------------------------------------------------
// Group reward: Chip In modal (v0.6.3 item 13)
// ---------------------------------------------------------------------------

/**
 * Modal for a kid to chip in points toward a group reward.
 * Pre-fills the amount with min(remaining, balance) so the kid can just tap OK.
 *
 * @param {object} item      Store item row (with contributors[]).
 * @param {string} personId  The viewing kid's person_id.
 * @param {number} balance   Current spendable balance.
 * @param {number} remaining Points still needed from this contributor.
 */
export function mChipIn(item, personId, balance, remaining) {
    const maxPts  = Math.min(balance, remaining);
    const body    = `
        <div class="fh-field">
            <label>Chip in toward <strong>${escHTML(item?.name || "reward")}</strong></label>
            <div style="font-size:.8rem;color:var(--fh-text-sec);margin-bottom:8px">
                Your share remaining: ${remaining} pts · Your balance: ${balance} pts
            </div>
            <input id="m-chipin-pts" class="fh-input" type="number"
                   min="1" max="${maxPts}" value="${maxPts}"
                   style="width:120px">
            <span style="font-size:.85rem;color:var(--fh-text-sec)">pts</span>
        </div>
        <input type="hidden" id="m-chipin-iid" value="${escAttr(item?.item_id || "")}">
        <input type="hidden" id="m-chipin-pid" value="${escAttr(personId)}">`;
    return mWrap("Chip In — Group Reward", body, "Chip In", "ok-chip-in");
}

export function multiPersonCheckboxes(people, selectedIds, cbClass) {
    if (!people.length) return `<span style="font-size:.82rem;color:var(--fh-text-sec)">No people found.</span>`;
    return `<div class="fh-person-cb-list">
      ${people.map(p => {
          const checked = (selectedIds || []).includes(p.person_id);
          const color   = p.avatar_color || DEFAULT_COLOR;
          return `<label class="fh-person-cb-chip ${checked ? "checked" : ""}"
                         style="--chip-color:${color}">
            <input type="checkbox" class="${cbClass}"
                   value="${p.person_id}" ${checked ? "checked" : ""}>
            <span class="fh-avatar" style="background:${color};width:18px;height:18px;font-size:.6rem">
              ${ini(p.name)}
            </span>
            ${escHTML(p.name)}
          </label>`;
      }).join("")}
    </div>`;
}
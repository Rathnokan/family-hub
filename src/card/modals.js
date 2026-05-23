/**
 * Family Hub Card — Modals
 * All modal HTML builders. Called by FamilyHubCard._modalHTML().
 * Each function returns an HTML string for injection into the modal overlay.
 */

import { DEFAULT_COLOR } from "./constants.js";
import { I } from "./constants.js";
import { escHTML, escAttr, ini, opts, weekdayChips } from "./utils.js";
import { FH_ICONS, FH_ICON_META, choreIcon } from "./icons.js";

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
// Add task (one-time, claimable, or reminder)
// ---------------------------------------------------------------------------

/**
 * Add task modal — three task types selectable at top:
 *   Assigned   — person checkboxes, points, approval toggle, optional expiry + penalty
 *   Claimable  — points + required expiry field, auto-category "Bonus"
 *   Reminder   — person select + recurrence only, routes to add_chore
 */
export function mAddTask(people) {
    return mWrap("Add task",
        `<!-- Task type selector -->
       <div class="fh-field">
         <label class="fh-label">Task type</label>
         <select class="fh-select" id="m-tasktype">
           <option value="assigned">Assigned — give to specific people</option>
           <option value="claimable">Claimable — first come first served bonus</option>
           <option value="reminder">Reminder — no points, just a nudge</option>
         </select>
       </div>

       <!-- Name (all types) -->
       <div class="fh-field">
         <label class="fh-label">Task name *</label>
         <input class="fh-input" id="m-tname" type="text" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Description (optional)</label>
         <input class="fh-input" id="m-tdesc" type="text" placeholder="More detail…">
       </div>

       <!-- Assigned section -->
       <div id="m-task-assigned-section">
         <div class="fh-field">
           <label class="fh-label">Assign to (select all that apply)</label>
           ${multiPersonCheckboxes(people, [], "m-tp-person")}
         </div>
         <div class="fh-row">
           <div class="fh-field">
             <label class="fh-label">Points</label>
             <input class="fh-input" id="m-tpts" type="number" min="0" value="10">
           </div>
           <div class="fh-field" style="justify-content:flex-end">
             <div class="fh-checkbox-row" style="margin-top:auto;padding-bottom:9px">
               <input type="checkbox" id="m-tappr">
               <label for="m-tappr" style="font-size:.85rem">Needs approval</label>
             </div>
           </div>
         </div>
         <div class="fh-field">
           <label class="fh-label">Expires after (days, optional)</label>
           <input class="fh-input" id="m-texpiry" type="number" min="1"
                  placeholder="Leave blank = no expiry">
         </div>
         <div class="fh-checkbox-row">
           <input type="checkbox" id="m-tpenalty">
           <label for="m-tpenalty" style="font-size:.88rem">Apply penalty if not completed before expiry</label>
         </div>
         <div id="m-task-penalty-section" class="fh-field" style="display:none">
           <label class="fh-label">Penalty points</label>
           <input class="fh-input" id="m-tpenalty-pts" type="number" min="1" value="5">
         </div>
       </div>

       <!-- Claimable section -->
       <div id="m-task-claimable-section" style="display:none">
         <div class="fh-row">
           <div class="fh-field">
             <label class="fh-label">Points reward</label>
             <input class="fh-input" id="m-tcpts" type="number" min="0" value="20">
           </div>
           <div class="fh-field">
             <label class="fh-label">Expires after (days) *</label>
             <input class="fh-input" id="m-tcexpiry" type="number" min="1" value="7">
           </div>
         </div>
       </div>

       <!-- Reminder section -->
       <div id="m-task-reminder-section" style="display:none">
         <div class="fh-row">
           <div class="fh-field">
             <label class="fh-label">Who?</label>
             <select class="fh-select" id="m-trperson">
               ${people.map(p => `<option value="${p.person_id}">${escHTML(p.name)}</option>`).join("")}
             </select>
           </div>
           <div class="fh-field">
             <label class="fh-label">Recurrence</label>
             <select class="fh-select" id="m-trrec">
               ${opts([
                   { value: "daily",           label: "Daily" },
                   { value: "weekly",          label: "Weekly" },
                   { value: "every_n_days",    label: "Every N days" },
                   { value: "monthly_on_date", label: "Monthly" },
               ], "daily")}
             </select>
           </div>
         </div>
       </div>`,
        "Add task", "ok-add-task");
}

// ---------------------------------------------------------------------------
// Chore form (shared by Add/Edit modal AND inline admin side panel)
// ---------------------------------------------------------------------------

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
 * @param {string}      activeTab  - "details" | "schedule" | "rewards" | "reminders"
 */
export function choreFormFields(chore, isEdit, people, catLabels, activeTab = "details") {
    const c        = chore || {};
    const rec      = c.recurrence || {};
    const recType  = rec.type || "daily";
    const assigned = c.assigned_to || [];

    // ---- Icon grid (always visible, grouped by category) --------------------
    const iconsByCat = new Map();
    for (const m of FH_ICON_META) {
        const cat = m.category || "Other";
        if (!iconsByCat.has(cat)) iconsByCat.set(cat, []);
        iconsByCat.get(cat).push(m);
    }
    const iconGridHtml = [...iconsByCat.entries()].map(([cat, items]) => `
        <div class="fh-icon-picker-cat-hdr">${escHTML(cat)}</div>
        <div class="fh-icon-picker-cat-grid">
          ${items.map(({ key, label }) => `
            <button class="fh-icon-cell${c.icon === key ? " selected" : ""}"
                    data-act="pick-icon" data-icon="${key}" type="button"
                    title="${label}">
              <span style="display:inline-flex;width:28px;height:28px;color:var(--fh-text)">${FH_ICONS[key]}</span>
              <span class="fh-icon-cell-label">${label}</span>
            </button>`).join("")}
        </div>`).join("");

    // ---- Tab strip ----------------------------------------------------------
    const tabs = [
        { key: "details",   label: "Details"          },
        { key: "schedule",  label: "Schedule"         },
        { key: "rewards",   label: "Points & Rewards" },
        { key: "reminders", label: "Reminders"        },
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

    // ---- Details pane: name / desc / icon / type+category / assignees ------
    const detailsPane = pane("details", `
        <div class="fh-field">
          <label class="fh-label">Chore name *</label>
          <input class="fh-input" id="m-cname" type="text"
                 value="${escAttr(c.name || "")}" autofocus>
        </div>
        <div class="fh-field">
          <label class="fh-label">Description (optional)</label>
          <input class="fh-input" id="m-cdesc" type="text"
                 value="${escAttr(c.description || "")}" placeholder="More detail…">
        </div>
        <div class="fh-field">
          <label class="fh-label">Icon</label>
          <input type="hidden" id="m-cicon" value="${escAttr(c.icon || "")}">
          <div class="fh-chore-icon-grid">
            ${iconGridHtml}
          </div>
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
        <div class="fh-field">
          <label class="fh-label">Assign to</label>
          <div class="fh-checkbox-row" style="margin-bottom:4px">
            <input type="checkbox" id="m-everyone">
            <label for="m-everyone" style="font-size:.85rem;font-weight:600;cursor:pointer">Everyone</label>
          </div>
          ${multiPersonCheckboxes(people, assigned, "m-assign-person")}
        </div>
    `);

    // ---- Schedule pane: recurrence / days / expiry / claimable ------------
    const schedulePane = pane("schedule", `
        <div class="fh-field">
          <label class="fh-label">Recurrence</label>
          <select class="fh-select" id="m-crec">
            ${opts([
                { value: "daily",           label: "Daily" },
                { value: "weekly",          label: "Weekly" },
                { value: "monthly_on_date", label: "Monthly" },
                { value: "one_time",        label: "One-time" },
            ], recType)}
          </select>
        </div>
        <div id="m-dayfilter-section" class="fh-field" style="display:none">
          <label class="fh-label">Restrict to days (leave empty = every day)</label>
          <div class="fh-weekday-row">
            ${weekdayChips(rec.day_filter || [], "m-df-day")}
          </div>
        </div>
        <div id="m-weekdays-section" class="fh-field" style="display:none">
          <label class="fh-label">Day(s) of week</label>
          <div class="fh-weekday-row">
            ${weekdayChips(rec.weekdays || [], "m-wd-day")}
          </div>
        </div>
        <div id="m-dom-section" class="fh-field" style="display:none">
          <label class="fh-label">Day of month (1–31)</label>
          <input class="fh-input" id="m-dom" type="number" min="1" max="31"
                 value="${rec.day_of_month || 1}">
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
            <label class="fh-label">Pool (top of list takes the next instance)</label>
            <input type="hidden" id="m-crot-pool-order" value="${escAttr((c.rotation_pool || []).join(","))}">
            <div id="m-crot-pool-widget" class="fh-rot-pool">
              ${rotationPoolEditor(people, c.rotation_pool || [])}
            </div>
            <label class="fh-label" style="margin-top:6px">Cadence</label>
            <select class="fh-select" id="m-crot-cadence">
              ${opts([
                  { value: "daily",        label: "Daily (advance every day)" },
                  { value: "weekly",       label: "Weekly (advance on Mondays)" },
                  { value: "per_instance", label: "Per instance (advance when chore generates)" },
              ], c.rotation_cadence || "per_instance")}
            </select>
            <div class="fh-field-help">
              Reorder with ↑/↓ to control whose turn is next. Pair a "daily" chore with
              "weekly" cadence to give each kid a week-long shift; pair daily+daily to
              cycle every day. The &quot;Assign to&quot; selection above is overridden while
              rotation is on, and inactive people are skipped automatically.
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
          <label class="fh-label">Daily penalty after (days, optional)</label>
          <input class="fh-input" id="m-daily-threshold" type="number" min="1"
                 placeholder="e.g. 3 — start deducting after 3 days"
                 value="${c.daily_penalty_after_days || ""}">
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

    // ---- Reminders pane -----------------------------------------------------
    const remindersPane = pane("reminders", `
        <div class="fh-field">
          <label class="fh-label">Reminder time (-1 = off)</label>
          <input class="fh-input" id="m-reminder-time" type="number" min="-1" max="2359"
                 placeholder="-1 (off)"
                 value="${c.reminder_time !== undefined ? c.reminder_time : -1}">
          <div class="fh-field-help">
            HHMM format — e.g. 1900 for 7:00 PM. Sends a push notification once per task instance
            when local time reaches this value and the task is still pending.
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
          ${remindersPane}
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
    return mWrap(title, choreFormFields(chore, isEdit, people, catLabels, activeTab),
        isEdit ? "Save changes" : "Add chore", okAct);
}

// ---------------------------------------------------------------------------
// Store item (add / edit)
// ---------------------------------------------------------------------------

export function mAddStoreItem(people) {
    return mWrap("Add reward item",
        `<div class="fh-field">
         <label class="fh-label">Item name *</label>
         <input class="fh-input" id="m-sname" type="text" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Description (optional)</label>
         <input class="fh-input" id="m-sdesc" type="text">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Dollar value *</label>
           <input class="fh-input" id="m-sdollar" type="number" min="0.01"
                  step="0.01" placeholder="e.g. 5.00">
         </div>
         <div class="fh-field">
           <label class="fh-label">Scope</label>
           <select class="fh-select" id="m-sscope">
             <option value="common">All kids</option>
             <option value="personal">Specific people</option>
           </select>
         </div>
       </div>
       <div id="m-sperson-section" class="fh-field" style="display:none">
         <label class="fh-label">Who can see this reward?</label>
         ${multiPersonCheckboxes(people, [], "m-sp-person")}
       </div>`,
        "Add reward", "ok-add-store-item");
}

export function mEditStoreItem(item, people) {
    return mWrap(`Edit — ${item.name}`,
        `<input type="hidden" id="m-eiid" value="${item.item_id}">
       <div class="fh-field">
         <label class="fh-label">Item name *</label>
         <input class="fh-input" id="m-sname" type="text" value="${escAttr(item.name)}" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Description (optional)</label>
         <input class="fh-input" id="m-sdesc" type="text" value="${escAttr(item.description || "")}">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Dollar value *</label>
           <input class="fh-input" id="m-sdollar" type="number" min="0.01"
                  step="0.01" value="${item.dollar_value}">
         </div>
         <div class="fh-field">
           <label class="fh-label">Scope</label>
           <select class="fh-select" id="m-sscope">
             <option value="common"   ${item.scope === "common"   ? "selected" : ""}>All kids</option>
             <option value="personal" ${item.scope === "personal" ? "selected" : ""}>Specific people</option>
           </select>
         </div>
       </div>
       <div id="m-sperson-section" class="fh-field" style="${item.scope === "personal" ? "" : "display:none"}">
         <label class="fh-label">Who can see this reward?</label>
         ${multiPersonCheckboxes(people, item.person_ids || [], "m-sp-person")}
       </div>`,
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

    return mWrap(`Edit — ${d.pname}`,
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

        ${section("Rank", "weekly evaluation overrides", `
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Rank index (admin override)</label>
               <input class="fh-input" id="m-prankidx" type="number" min="0"
                      value="${d.rankIdx !== undefined ? d.rankIdx : 0}">
             </div>
             <div class="fh-field">
               <label class="fh-label">Drop threshold (pts/wk, blank = global)</label>
               <input class="fh-input" id="m-pdropThr" type="number" min="0"
                      value="${d.dropThr !== "" ? d.dropThr : ""}"
                      placeholder="Global default">
             </div>
           </div>
           <div class="fh-field">
             <label class="fh-label">Gain threshold (pts/wk, blank = global)</label>
             <input class="fh-input" id="m-pgainThr" type="number" min="0"
                    value="${d.gainThr !== "" ? d.gainThr : ""}"
                    placeholder="Global default">
           </div>
        `)}

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
    const WEEKDAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const wdayOpts = WEEKDAY_NAMES.map((n, i) =>
        `<option value="${i}" ${d.rankWeekday == i ? "selected" : ""}>${n}</option>`
    ).join("");

    return mWrap("Edit settings",
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
       <div class="fh-section-title" style="margin-top:var(--fh-gap-sm)">Rank evaluation</div>
       <div class="fh-field">
         <label class="fh-label">Evaluate ranks on</label>
         <select class="fh-select" id="m-rank-weekday">${wdayOpts}</select>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Drop below (pts/wk)</label>
           <input class="fh-input" id="m-rank-drop" type="number" min="0"
                  value="${d.rankDrop !== undefined ? d.rankDrop : 50}">
         </div>
         <div class="fh-field">
           <label class="fh-label">Gain at or above (pts/wk)</label>
           <input class="fh-input" id="m-rank-gain" type="number" min="0"
                  value="${d.rankGain !== undefined ? d.rankGain : 75}">
         </div>
       </div>`,
        "Save", "ok-edit-settings");
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
            return `
              <div class="fh-rot-item" data-pid="${escAttr(p.person_id)}" style="--chip-color:${color}">
                <span class="fh-rot-num">${i + 1}</span>
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
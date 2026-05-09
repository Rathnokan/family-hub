/**
 * Family Hub Card — Modals
 * All modal HTML builders. Called by FamilyHubCard._modalHTML().
 * Each function returns an HTML string for injection into the modal overlay.
 */

import { DEFAULT_COLOR } from "./constants.js";
import { I } from "./constants.js";
import { escHTML, escAttr, ini, opts, weekdayChips } from "./utils.js";

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
// Chore form (shared by Add and Edit)
// ---------------------------------------------------------------------------

/**
 * Chore form modal — shared by add and edit.
 * @param {object|null} chore      - Existing chore for edit mode, null for add
 * @param {boolean}     isEdit     - Whether this is an edit operation
 * @param {object[]}    people     - All people from sensor
 * @param {string[]}    catLabels  - Available category label strings
 */
export function mChoreForm(chore, isEdit, people, catLabels) {
    const c      = chore || {};
    const rec    = c.recurrence || {};
    const recType= rec.type || "daily";
    const assigned = c.assigned_to || [];
    const title  = isEdit ? `Edit — ${c.name}` : "Add chore";
    const okAct  = isEdit ? "ok-edit-chore" : "ok-add-chore";

    return mWrap(title,
        `${isEdit ? `<input type="hidden" id="m-cid" value="${c.chore_id}">` : ""}
       <div class="fh-field">
         <label class="fh-label">Chore name *</label>
         <input class="fh-input" id="m-cname" type="text" value="${escAttr(c.name || "")}" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Description (optional)</label>
         <input class="fh-input" id="m-cdesc" type="text"
                value="${escAttr(c.description || "")}" placeholder="More detail…">
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
           <label class="fh-label">Category label</label>
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
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Points</label>
           <input class="fh-input" id="m-cpts" type="number" min="0"
                  value="${c.points !== undefined ? c.points : 10}">
         </div>
         <div class="fh-field">
           <label class="fh-label">Recurrence</label>
           <select class="fh-select" id="m-crec">
             ${opts([
                 { value: "daily",           label: "Daily" },
                 { value: "weekly",          label: "Weekly" },
                 { value: "every_n_days",    label: "Every N days" },
                 { value: "every_n_weeks",   label: "Every N weeks" },
                 { value: "monthly_on_date", label: "Monthly" },
                 { value: "one_time",        label: "One-time" },
             ], recType)}
           </select>
         </div>
       </div>

       <!-- Day filter: daily recurrence only -->
       <div id="m-dayfilter-section" class="fh-field" style="display:none">
         <label class="fh-label">Restrict to days (leave empty = every day)</label>
         <div class="fh-weekday-row">
           ${weekdayChips(rec.day_filter || [], "m-df-day")}
         </div>
       </div>

       <!-- Weekday selector: weekly / every_n_weeks -->
       <div id="m-weekdays-section" class="fh-field" style="display:none">
         <label class="fh-label">Day(s) of week</label>
         <div class="fh-weekday-row">
           ${weekdayChips(rec.weekdays || [], "m-wd-day")}
         </div>
       </div>

       <!-- Interval N: every_n_days / every_n_weeks -->
       <div id="m-interval-section" class="fh-field" style="display:none">
         <label class="fh-label">Every N <span id="m-interval-unit">days</span></label>
         <input class="fh-input" id="m-interval" type="number" min="1"
                value="${rec.interval || 2}">
       </div>

       <!-- Day of month: monthly_on_date -->
       <div id="m-dom-section" class="fh-field" style="display:none">
         <label class="fh-label">Day of month (1–31)</label>
         <input class="fh-input" id="m-dom" type="number" min="1" max="31"
                value="${rec.day_of_month || 1}">
       </div>

       <!-- Expiry: claimable or one-time -->
       <div id="m-chore-expiry-section" class="fh-field" style="display:none">
         <label class="fh-label">Expires after (days)</label>
         <input class="fh-input" id="m-cexpiry" type="number" min="1"
                value="${c.expires_after_days || ""}">
       </div>

       <div class="fh-divider"></div>
       <div class="fh-checkbox-row">
         <input type="checkbox" id="m-cappr"
                ${(c.approval_required !== false) ? "checked" : ""}>
         <label for="m-cappr" style="font-size:.88rem">Requires parent approval</label>
       </div>
       <div class="fh-checkbox-row">
         <input type="checkbox" id="m-cpenalty"
                ${c.penalty_enabled ? "checked" : ""}>
         <label for="m-cpenalty" style="font-size:.88rem">Apply penalty points if skipped</label>
       </div>

       <!-- Penalty points: shown when penalty checkbox checked -->
       <div id="m-penalty-pts-section" class="fh-field" style="display:none">
         <label class="fh-label">Penalty points</label>
         <input class="fh-input" id="m-cpenalty-pts" type="number" min="1"
                value="${c.penalty_points || 5}">
       </div>`,
        isEdit ? "Save changes" : "Add chore",
        okAct
    );
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
    return mWrap(`Edit — ${d.pname}`,
        `<div class="fh-field">
         <label class="fh-label">Name *</label>
         <input class="fh-input" id="m-pname" type="text" value="${escAttr(d.pname)}" autofocus>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Type</label>
           <select class="fh-select" id="m-ptype">
             <option value="kid"    ${d.ptype === "kid"    ? "selected" : ""}>Kid</option>
             <option value="parent" ${d.ptype === "parent" ? "selected" : ""}>Parent</option>
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Avatar colour</label>
           <input class="fh-input" id="m-pcolor" type="color"
                  value="${d.pcolor}" style="height:42px;padding:4px">
         </div>
       </div>
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
// Settings edit
// ---------------------------------------------------------------------------

export function mEditSettings(d) {
    return mWrap("Edit settings",
        `<div class="fh-field">
         <label class="fh-label">Family name</label>
         <input class="fh-input" id="m-fname" type="text"
                value="${escAttr(d.fname)}" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Points per dollar</label>
         <input class="fh-input" id="m-ppd" type="number" min="1" value="${d.ppd}">
       </div>`,
        "Save", "ok-edit-settings");
}

// ---------------------------------------------------------------------------
// Claim task
// ---------------------------------------------------------------------------

export function mClaim(m, people) {
    return mWrap(`Claim — ${escHTML(m.data.name)}`,
        `<div class="fh-field">
         <label class="fh-label">Who is claiming?</label>
         <select class="fh-select" id="m-clperson">
           ${people.map(p => `<option value="${p.person_id}">${escHTML(p.name)}</option>`).join("")}
         </select>
       </div>
       <input type="hidden" id="m-cltid" value="${m.data.tid}">`,
        "Claim", "ok-claim");
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
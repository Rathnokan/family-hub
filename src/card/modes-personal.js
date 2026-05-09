/**
 * Family Hub Card — Personal Dashboard Mode
 * Per-person view: points balance, tasks grouped by category, reminders, store.
 * Imported and called by FamilyHubCard._htmlPersonal().
 */

import { DEFAULT_COLOR, FLASH_MS } from "./constants.js";
import { I } from "./constants.js";
import { escHTML, escAttr, ini, fPts, fUSD, cap, slug } from "./utils.js";

/**
 * Render the full personal dashboard HTML.
 * @param {object} card - The FamilyHubCard instance
 */
export function htmlPersonal(card) {
    const person = card._findPerson(card._cfg.person);
    if (!person) return `<div class="fh-empty">Person "${card._cfg.person}" not found.<br>Check spelling in card config.</div>`;

    const eid     = card._personEntityId(person.name);
    const attr    = card._attrs(eid);
    const balance = parseInt(card._states(eid)?.state || "0");
    const color   = person.avatar_color || DEFAULT_COLOR;

    const tabBar = ["tasks", "store"].map(t => `
      <div class="fh-tab ${card._tab === t ? "active" : ""}"
           data-act="tab" data-tab="${t}">${cap(t)}</div>`).join("");

    let content = "";
    if (card._tab === "tasks") content = _htmlPersonalTasks(attr, color, person, card);
    if (card._tab === "store") content = _htmlPersonalStore(attr, color, person, balance, card);

    return `
      <div class="fh-person-header" style="border-left:4px solid ${color}">
        <div class="fh-avatar" style="background:${color};width:46px;height:46px;font-size:1.1rem">
          ${ini(person.name)}
        </div>
        <div style="flex:1">
          <div style="font-size:.9rem;color:var(--fh-text-sec);font-weight:600">${person.name}</div>
          <div class="fh-balance" style="color:${color}">
            ${fPts(balance)}<span class="fh-balance-unit">pts</span>
          </div>
          ${attr.show_dollar_value ? `<div class="fh-dollar">${fUSD(attr.dollar_value)}</div>` : ""}
        </div>
      </div>
      <div class="fh-tabs">${tabBar}</div>
      ${content}`;
}

// ---------------------------------------------------------------------------
// Tasks tab
// ---------------------------------------------------------------------------

function _htmlPersonalTasks(attr, color, person, card) {
    const rawDue     = attr.tasks_due_today_list        || [];
    const rawOverdue = attr.tasks_overdue_list          || [];
    const pending    = attr.tasks_pending_approval_list || [];

    // ---- BUG FIX: Collapse multiple instances of the same chore to one row.
    // For each chore_id, keep only the worst-state row.
    const collapseByChore = (rows, pickFn) => {
        const seen = new Map();
        for (const t of rows) {
            const key = t.chore_id;
            if (!seen.has(key) || pickFn(t, seen.get(key))) seen.set(key, t);
        }
        return [...seen.values()];
    };
    const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
    const allDue  = collapseByChore(rawDue, () => false);

    // Separate reminders from regular tasks.
    // TODO (Phase 3-C): Replace heuristic with t.chore_type === "reminder" once
    // chore_type is added to the personal sensor payload.
    // Risk: a 0-pt assigned chore with no penalty will be styled as a reminder.
    const isReminderTask = t => !t.points && !t.penalty_enabled && !t.approval_required;
    const dueReminders = allDue.filter(t => isReminderTask(t));
    const due = allDue.filter(t => !isReminderTask(t));

    // Group due-today tasks by category_label. Items with no label → "Today".
    const groups = new Map();
    for (const t of due) {
        const key = t.category_label || "Today";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(t);
    }

    // Build expiry badge: show only when ≤ 2 days remain.
    const expiryBadge = t => {
        if (!t.expires_after_days || !t.due_date) return "";
        const due       = new Date(t.due_date);
        const expiresOn = new Date(due);
        expiresOn.setDate(expiresOn.getDate() + t.expires_after_days);
        const today     = new Date();
        today.setHours(0, 0, 0, 0);
        expiresOn.setHours(0, 0, 0, 0);
        const daysLeft  = Math.round((expiresOn - today) / 86400000);
        if (daysLeft > 2)  return "";
        if (daysLeft <= 0) return `<span class="fh-badge fh-badge-expiry">Expires today</span>`;
        return `<span class="fh-badge fh-badge-expiry">Expires in ${daysLeft}d</span>`;
    };

    const mkRow = (t, isOverdue) => {
        const flash      = card._flashing.has(t.task_id) ? "flash" : "";
        const descExp    = card._expandedDescs.has(t.task_id);
        const isReminder = isReminderTask(t);
        const rowClass   = isOverdue ? "overdue" : isReminder ? "reminder" : "";
        return `
        <div class="fh-task-row ${rowClass} ${flash}"
             style="--row-color:${color}; --flash-dur:${FLASH_MS}ms">
          <div class="fh-task-body">
            <span class="fh-task-name">${escHTML(t.name)}</span>
            ${descExp && t.description ? `<span class="fh-desc-inline">${escHTML(t.description)}</span>` : ""}
          </div>
          ${t.description
              ? `<button class="fh-desc-btn" data-act="toggle-desc" data-id="${t.task_id}"
                         title="Toggle description">?</button>`
              : ""}
          ${isOverdue ? `<span class="fh-badge fh-badge-overdue">${t.days_overdue}d late</span>` : ""}
          ${expiryBadge(t)}
          ${!isReminder && t.penalty_enabled
              ? `<span class="fh-penalty-warn">-${t.penalty_points}pts if skipped</span>`
              : ""}
          ${!isReminder && t.points
              ? `<span class="fh-badge fh-badge-pts" style="--row-color:${color}">${t.points}pts</span>`
              : ""}
          ${!isReminder
              ? `<button class="fh-check" style="--row-color:${color}"
                         data-act="complete" data-tid="${t.task_id}" data-pid="${person.person_id}">
                   ${I.check}
                 </button>`
              : `<button class="fh-check" style="--row-color:var(--fh-text-sec)"
                         data-act="complete" data-tid="${t.task_id}" data-pid="${person.person_id}">
                   ${I.check}
                 </button>`}
        </div>`;
    };

    const pendingRows = pending.map(t => `
      <div class="fh-task-row" style="--row-color:${color}">
        <span class="fh-task-name">${escHTML(t.name)}</span>
        ${t.points ? `<span class="fh-badge fh-badge-pts" style="--row-color:${color}">${t.points}pts</span>` : ""}
        <span class="fh-badge fh-badge-pending">Awaiting approval</span>
      </div>`).join("");

    const overdueSection = overdue.length
        ? overdue.map(t => mkRow(t, true)).join("")
        : "";

    const dueSection = [...groups.entries()].map(([label, tasks]) => `
      <div class="fh-section-title">${escHTML(label)}</div>
      <div class="fh-task-list">
        ${tasks.map(t => mkRow(t, false)).join("")}
      </div>`).join("");

    const empty = !due.length && !overdue.length && !pending.length && !dueReminders.length;

    const reminderSection = dueReminders.length ? `
      <div class="fh-section-title">Reminders</div>
      <div class="fh-task-list">
        ${dueReminders.map(t => mkRow(t, false)).join("")}
      </div>` : "";

    return `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--fh-gap-sm)">
        <button class="fh-btn fh-btn-ghost fh-btn-sm"
                data-act="open-add-reminder" data-pid="${person.person_id}">
          ${I.bell} Add reminder
        </button>
      </div>
      ${overdue.length ? `<div class="fh-task-list" style="margin-bottom:var(--fh-gap-sm)">${overdueSection}</div>` : ""}
      ${dueSection}
      ${reminderSection}
      ${pending.length ? `
        <div class="fh-section-title">Awaiting approval</div>
        <div class="fh-task-list">${pendingRows}</div>` : ""}
      ${empty ? '<div class="fh-empty">Nothing due — nice work! 🎉</div>' : ""}`;
}

// ---------------------------------------------------------------------------
// Store tab
// ---------------------------------------------------------------------------

function _htmlPersonalStore(attr, color, person, balance, card) {
    const items = attr.store_items || [];
    if (!items.length) return `<div class="fh-empty">No rewards in the store yet.</div>`;

    // Pending redemptions — match by item_id first, fall back to item_name only
    // when no item_id was recorded (prevents similarly-named items conflating).
    const pendingRedemptions = card._attrs("sensor.family_hub_needs_attention").redemption_queue || [];
    const personPending      = pendingRedemptions.filter(r => r.person_id === person.person_id);
    const pendingByItemId    = new Set(personPending.map(r => r.item_id).filter(Boolean));
    const pendingByName      = new Set(
        personPending.filter(r => !r.item_id).map(r => r.item_name)
    );

    return `
      <div class="fh-store-grid">
        ${items.map(item => {
            const can       = balance >= item.points_cost;
            const requested = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
            return `
            <div class="fh-store-item">
              <div class="fh-store-name">${escHTML(item.name)}</div>
              ${item.description ? `<div class="fh-store-desc">${escHTML(item.description)}</div>` : ""}
              <div class="fh-store-price" style="color:${color}">${fPts(item.points_cost)}pts</div>
              ${requested
                  ? `<span class="fh-badge fh-badge-requested" style="text-align:center">Requested ✓</span>`
                  : `<button class="fh-btn fh-btn-sm ${can ? "fh-btn-primary" : "fh-btn-ghost"}"
                             style="${can ? `background:${color}` : ""}"
                             data-act="redeem"
                             data-iid="${item.item_id}" data-pid="${person.person_id}"
                             ${can ? "" : "disabled"}>
                       ${can ? "Request" : "Need more pts"}
                     </button>`
              }
            </div>`;
        }).join("")}
      </div>`;
}
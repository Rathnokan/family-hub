/**
 * Family Hub Card — Personal Dashboard Mode
 * Per-person view: points balance, tasks grouped by category, reminders, store.
 * Imported and called by FamilyHubCard._htmlPersonal().
 *
 * v0.4.2: Category groups render in admin-defined order (category_labels).
 *         Penalty warning moved into task body (under task name) so it's
 *         never crowded out by badges on small screens.
 */

import { DEFAULT_COLOR, FLASH_MS, HISTORY_META, WEEKDAY_LABELS } from "./constants.js";
import { I } from "./constants.js";
import { escHTML, escAttr, ini, fPts, fUSD, cap, slug, relTime, groupHistorySkipped } from "./utils.js";

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

    const naAttr       = card._attrs("sensor.family_hub_needs_attention");
    const historyLog   = naAttr.history_log || [];
    const personHist   = historyLog.filter(e => e.person_id === person.person_id);

    const tabBar = ["tasks", "store", "history"].map(t => `
      <div class="fh-tab ${card._tab === t ? "active" : ""}"
           data-act="tab" data-tab="${t}">${cap(t)}</div>`).join("");

    let content = "";
    if (card._tab === "tasks")   content = _htmlPersonalTasks(attr, color, person, card);
    if (card._tab === "store")   content = _htmlPersonalStore(attr, color, person, balance, card);
    if (card._tab === "history") content = _htmlPersonalHistory(personHist, color, card);

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

    // Collapse multiple instances of the same chore to one row.
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

    // Separate reminders from regular tasks using chore_type (added in v0.4.1).
    const isReminderTask = t => t.chore_type === "reminder";
    const dueReminders   = allDue.filter(t =>  isReminderTask(t));
    const due            = allDue.filter(t => !isReminderTask(t));

    // ---- Category ordering ------------------------------------------------
    // Pull the admin-defined ordered list from the needs_attention sensor.
    // This is the same list the admin Settings tab manages, so category groups
    // always appear in the same order as the admin has arranged them.
    const naAttr        = card._attrs("sensor.family_hub_needs_attention");
    const orderedLabels = naAttr.category_labels || [];
    const labelIndex    = new Map(orderedLabels.map((l, i) => [l, i]));

    // Group due-today tasks by category_label. Items with no label → "Today".
    const groups = new Map();
    for (const t of due) {
        const key = t.category_label || "Today";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(t);
    }

    // Sort group keys: known labels first (in admin order), unknown labels
    // alphabetically, then "Today" (unlabeled) always last.
    const sortedGroupKeys = [...groups.keys()].sort((a, b) => {
        const aIsToday = a === "Today";
        const bIsToday = b === "Today";
        if (aIsToday && !bIsToday) return 1;
        if (!aIsToday && bIsToday) return -1;
        const ai = labelIndex.has(a) ? labelIndex.get(a) : Infinity;
        const bi = labelIndex.has(b) ? labelIndex.get(b) : Infinity;
        if (ai !== bi) return ai - bi;
        return a.localeCompare(b);
    });

    // ---- Reset badge ------------------------------------------------------
    // Replaces the old "due Nd ago" language for weekly/monthly/every-n-days
    // chores. Shows when the chore resets and turns amber the day before.
    // Urgency is only shown for weekly and monthly chores, not short cycles.
    const resetBadge = t => {
        const rType = t.recurrence_type;
        if (!rType || rType === "daily" || rType === "one_time") return "";
        const dur = t.days_until_reset;
        if (dur === undefined || dur === null) return "";

        let label;
        if (dur <= 0) {
            label = "Resets today";
        } else if (dur === 1) {
            label = "Resets tomorrow";
        } else if (rType === "weekly" && t.recurrence_weekdays?.length) {
            const names = t.recurrence_weekdays.map(d => WEEKDAY_LABELS[d]).join("/");
            label = `Resets ${names}`;
        } else {
            label = `Resets in ${dur}d`;
        }

        const isLongCycle = rType === "weekly" || rType === "monthly_on_date";
        const urgent      = isLongCycle && dur <= 1;
        return `<span class="fh-badge ${urgent ? "fh-badge-pending" : "fh-badge-reset"}">${label}</span>`;
    };

    // ---- Expiry badge -----------------------------------------------------
    // Shown only when ≤ 2 days remain before the task expires.
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

    // ---- Task row builder -------------------------------------------------
    const mkRow = (t, isOverdue) => {
        const flash      = card._flashing.has(t.task_id) ? "flash" : "";
        const descExp    = card._expandedDescs.has(t.task_id);
        const isReminder = isReminderTask(t);
        const rowClass   = isOverdue ? "overdue" : isReminder ? "reminder" : "";

        // Penalty warning rendered inside fh-task-body, directly under the task name.
        const penaltyLine = (!isReminder && t.penalty_enabled && t.penalty_points > 0)
            ? `<span class="fh-penalty-warn">-${t.penalty_points}pts if skipped</span>`
            : "";

        return `
        <div class="fh-task-row ${rowClass} ${flash}"
             style="--row-color:${color}; --flash-dur:${FLASH_MS}ms">
          <div class="fh-task-body">
            <span class="fh-task-name">${escHTML(t.name)}</span>
            ${descExp && t.description
                ? `<span class="fh-desc-inline">${escHTML(t.description)}</span>`
                : ""}
            ${penaltyLine}
          </div>
          ${t.description
              ? `<button class="fh-desc-btn" data-act="toggle-desc" data-id="${t.task_id}"
                         title="Toggle description">?</button>`
              : ""}
          ${t.daily_penalty_firing
              ? `<span class="fh-badge fh-badge-overdue">-${t.penalty_points}pts/day</span>`
              : ""}
          ${isOverdue
              ? `<span class="fh-badge fh-badge-overdue">${t.days_overdue}d late</span>`
              : resetBadge(t)}
          ${expiryBadge(t)}
          ${!isReminder && t.points
              ? `<span class="fh-badge fh-badge-pts" style="--row-color:${color}">${t.points}pts</span>`
              : ""}
          ${!isReminder && (t.streak || 0) >= 2
              ? `<span class="fh-badge fh-badge-streak">🔥 ${t.streak}</span>`
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

    // ---- Pending approval rows --------------------------------------------
    const pendingRows = pending.map(t => `
      <div class="fh-task-row" style="--row-color:${color}">
        <span class="fh-task-name">${escHTML(t.name)}</span>
        ${t.points
            ? `<span class="fh-badge fh-badge-pts" style="--row-color:${color}">${t.points}pts</span>`
            : ""}
        <span class="fh-badge fh-badge-pending">Awaiting approval</span>
      </div>`).join("");

    // ---- Assemble sections ------------------------------------------------
    const overdueSection = overdue.length
        ? overdue.map(t => mkRow(t, true)).join("")
        : "";

    // Groups rendered in admin-defined order via sortedGroupKeys
    const dueSection = sortedGroupKeys.map(label => `
      <div class="fh-section-title">${escHTML(label)}</div>
      <div class="fh-task-list">
        ${(groups.get(label) || []).map(t => mkRow(t, false)).join("")}
      </div>`).join("");

    const reminderSection = dueReminders.length ? `
      <div class="fh-section-title">Reminders</div>
      <div class="fh-task-list">
        ${dueReminders.map(t => mkRow(t, false)).join("")}
      </div>` : "";

    const empty = !due.length && !overdue.length && !pending.length && !dueReminders.length;

    return `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--fh-gap-sm)">
        <button class="fh-btn fh-btn-ghost fh-btn-sm"
                data-act="open-add-reminder" data-pid="${person.person_id}">
          ${I.bell} Add reminder
        </button>
      </div>
      ${overdue.length
          ? `<div class="fh-task-list" style="margin-bottom:var(--fh-gap-sm)">${overdueSection}</div>`
          : ""}
      ${dueSection}
      ${reminderSection}
      ${pending.length ? `
        <div class="fh-section-title">Awaiting approval</div>
        <div class="fh-task-list">${pendingRows}</div>` : ""}
      ${empty ? '<div class="fh-empty">Nothing due — nice work! 🎉</div>' : ""}`;
}

// ---------------------------------------------------------------------------
// History tab — personal history log (one row per task, skipped rollup)
// ---------------------------------------------------------------------------

function _htmlPersonalHistory(entries, color, card) {
    if (!entries.length) return `<div class="fh-empty">No history yet.</div>`;

    const grouped = groupHistorySkipped(entries);
    const rows = grouped.map(item => {
        if (item.isGroup) return _renderSkippedGroup(item, null, card);
        return _renderHistRow(item.entry);
    }).join("");

    return `<div class="fh-hist-scroll">${rows}</div>`;
}

/** Render a single history entry row (no action buttons — personal view). */
function _renderHistRow(e) {
    const meta     = HISTORY_META[e.type] || { label: e.type, color: "var(--fh-text-sec)" };
    const ptsDelta = e.points_delta
        ? `<span style="color:${e.points_delta > 0 ? "var(--fh-success)" : "var(--fh-overdue)"}">
             ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>`
        : "";
    return `
      <div class="fh-hist-row" style="--hist-color:${meta.color}">
        <div class="fh-hist-info">
          <div class="fh-hist-label">${escHTML(meta.label)}</div>
          <div class="fh-hist-name">${escHTML(e.chore_name || e.note || "")}</div>
          <div class="fh-hist-meta">${relTime(e.timestamp)} ${ptsDelta}</div>
        </div>
      </div>`;
}

/**
 * Render a collapsible skipped-chores group.
 * @param {object}      group        - Group object from groupHistorySkipped
 * @param {object|null} firstParent  - First parent person (for Excuse button); null = personal view
 * @param {object}      card         - Card instance (for expand state)
 */
function _renderSkippedGroup(group, firstParent, card) {
    const expanded = card._expandedSkippedDates.has(group.key);
    const penLabel = group.totalPenalty > 0 ? `−${group.totalPenalty}pts` : "no penalty";

    const subItems = expanded ? group.items.map(e => {
        const pts = e.points_delta
            ? `<span style="color:var(--fh-overdue);font-weight:700">${e.points_delta}pts</span>`
            : "";
        let actionBtn = "";
        if (firstParent && e.reversible === "excuse") {
            actionBtn = `<button class="fh-btn fh-btn-warning fh-btn-sm"
                                 data-act="excuse-task"
                                 data-iid="${e.reference_id}"
                                 data-excused-by="${firstParent.person_id}"
                                 title="Reverse this penalty">
                           ${I.excuse} Excuse
                         </button>`;
        }
        return `
          <div class="fh-hist-subrow">
            <div class="fh-hist-info" style="flex:1;min-width:0">
              <div class="fh-hist-name">${escHTML(e.chore_name || "")}</div>
              <div class="fh-hist-meta">${pts}</div>
            </div>
            ${actionBtn}
          </div>`;
    }).join("") : "";

    return `
      <div class="fh-hist-group">
        <div class="fh-hist-group-hdr" data-act="toggle-skipped-group" data-key="${group.key}">
          <div class="fh-hist-info" style="flex:1;min-width:0">
            <div class="fh-hist-label" style="color:var(--fh-warning)">Skipped chores</div>
            <div class="fh-hist-name">${escHTML(group.dateDisplay)} · ${penLabel}</div>
          </div>
          <span class="fh-hist-expand-icon">${expanded ? "▲" : "▼"}</span>
        </div>
        ${expanded ? `<div class="fh-hist-subitems">${subItems}</div>` : ""}
      </div>`;
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
              ${item.description
                  ? `<div class="fh-store-desc">${escHTML(item.description)}</div>`
                  : ""}
              <div class="fh-store-price" style="color:${color}">${fPts(item.points_cost)}pts</div>
              ${requested
                  ? `<span class="fh-badge fh-badge-requested" style="text-align:center">Requested ✓</span>`
                  : `<button class="fh-btn fh-btn-sm ${can ? "fh-btn-primary" : "fh-btn-ghost"}"
                             style="${can ? `background:${color}` : ""}"
                             data-act="redeem"
                             data-iid="${item.item_id}" data-pid="${person.person_id}"
                             ${can ? "" : "disabled"}>
                       ${can ? "Request" : "Need more pts"}
                     </button>`}
            </div>`;
        }).join("")}
      </div>`;
}
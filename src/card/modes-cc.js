/**
 * Family Hub Card — Command Center Mode
 * Kitchen display: person filter chips + tasks grouped by category + claimable tasks.
 * Imported and called by FamilyHubCard._htmlCC().
 *
 * v0.4.2: Tasks grouped by category_label in admin-defined order.
 *         Penalty warning shown under task name for chores with penalty_enabled.
 */

import { DEFAULT_COLOR, FLASH_MS } from "./constants.js";
import { escHTML, escAttr, ini } from "./utils.js";
import { I } from "./constants.js";

/**
 * Render the full command center HTML.
 * @param {object} card - The FamilyHubCard instance
 */
export function htmlCC(card) {
    const clAttr    = card._attrs("sensor.family_hub_claimable_tasks");
    const naAttr    = card._attrs("sensor.family_hub_needs_attention");
    const people    = card._people();
    const allTasks  = clAttr.all_tasks || [];
    const claimable = clAttr.tasks     || [];
    const famName   = naAttr.family_name || "Family Hub";

    // Admin-defined category order — same list as Admin → Settings → Category labels
    const orderedLabels = naAttr.category_labels || [];
    const labelIndex    = new Map(orderedLabels.map((l, i) => [l, i]));

    // Person filter chips — show a red dot when this person has pending approvals
    const approvalQueue = naAttr.approval_queue || [];
    const chips = people.map(p => {
        const hasApproval = approvalQueue.some(a => a.person_id === p.person_id);
        return `
      <div class="fh-chip ${card._filter === p.person_id ? "active" : ""}"
           style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
           data-act="filter" data-pid="${p.person_id}">
        <span class="fh-chip-dot"></span>${escHTML(p.name)}
        ${hasApproval ? `<span class="fh-chip-approval-dot" title="Pending approval"></span>` : ""}
      </div>`;
    }).join("");

    // Apply person filter
    const filtered = card._filter
        ? allTasks.filter(t => t.assigned_to === card._filter)
        : allTasks;

    // Split overdue (days_delta < 0) from today (days_delta === 0)
    const overdueList = filtered.filter(t => t.days_delta < 0);
    const todayList   = filtered.filter(t => t.days_delta === 0);

    // ---- Overdue section — flat list, most overdue first ------------------
    const overdueRows = overdueList
        .sort((a, b) => a.days_delta - b.days_delta)
        .map(t => ccTaskRow(t, people, true, card._flashing))
        .join("");

    // ---- Today tasks — grouped by category in admin-defined order ---------
    const groups = new Map();
    for (const t of todayList) {
        const key = t.category_label || "";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(t);
    }

    // Sort: named labels in admin order → unlabeled last
    const sortedGroupKeys = [...groups.keys()].sort((a, b) => {
        const aEmpty = a === "";
        const bEmpty = b === "";
        if (aEmpty && !bEmpty) return 1;
        if (!aEmpty && bEmpty) return -1;
        const ai = labelIndex.has(a) ? labelIndex.get(a) : Infinity;
        const bi = labelIndex.has(b) ? labelIndex.get(b) : Infinity;
        if (ai !== bi) return ai - bi;
        return a.localeCompare(b);
    });

    // Category group headers only shown when there is more than one group,
    // or the single group has a named label (not the unlabeled fallback).
    const hasMultipleGroups = sortedGroupKeys.length > 1
        || (sortedGroupKeys.length === 1 && sortedGroupKeys[0] !== "");

    const groupedRows = sortedGroupKeys.map(label => {
        const rows = (groups.get(label) || [])
            .map(t => ccTaskRow(t, people, false, card._flashing))
            .join("");
        const header = (hasMultipleGroups && label !== "")
            ? `<div class="fh-section-title">${escHTML(label)}</div>`
            : "";
        return header + `<div class="fh-task-list">${rows}</div>`;
    }).join("");

    // ---- Compose the main task block --------------------------------------
    let todayBlock = "";
    if (!overdueRows && !groupedRows) {
        todayBlock = `<div class="fh-empty">✓ All caught up!</div>`;
    } else {
        if (overdueRows) {
            todayBlock += `
              <div class="fh-section-title" style="color:var(--fh-overdue)">Overdue</div>
              <div class="fh-task-list" style="margin-bottom:var(--fh-gap)">${overdueRows}</div>`;
        }
        todayBlock += groupedRows;
    }

    // ---- Claimable section -----------------------------------------------
    const claimSection = claimable.length ? `
      <div class="fh-section-title">Available to claim</div>
      <div class="fh-task-list">
        ${claimable.map(t => `
          <div class="fh-task-row" style="--row-color:${DEFAULT_COLOR}">
            <span class="fh-task-name">${escHTML(t.name)}</span>
            ${t.points
                ? `<span class="fh-badge fh-badge-pts">${t.points}pts</span>`
                : ""}
            <button class="fh-btn fh-btn-primary fh-btn-sm"
                    data-act="open-claim" data-tid="${t.task_id}"
                    data-name="${escAttr(t.name)}">Claim</button>
          </div>`).join("")}
      </div>` : "";

    return `
      <div class="fh-hdr">
        <span class="fh-title" style="margin:0">${escHTML(famName)}</span>
      </div>
      <div class="fh-chips">${chips}</div>
      ${todayBlock}
      ${claimSection}`;
}

/**
 * Render a single task row for the command center.
 *
 * The penalty warning sits inside fh-task-body, directly below the task name.
 * This mirrors the personal dashboard layout and keeps the right-hand side
 * (badges + check button) uncluttered on the Echo Show 15's wide display.
 *
 * @param {object}   t         - Task data object from all_tasks
 * @param {object[]} people    - All people from sensor
 * @param {boolean}  isOverdue - Whether to apply overdue styling
 * @param {Set}      flashing  - Set of task_ids currently animating
 */
function ccTaskRow(t, people, isOverdue, flashing) {
    const p     = people.find(x => x.person_id === t.assigned_to);
    const color = p?.avatar_color || DEFAULT_COLOR;
    const flash = flashing.has(t.task_id) ? "flash" : "";

    // Penalty warning — only for chores with penalty_enabled.
    // Shown in the same subtle style as the personal dashboard.
    const penaltyLine = (t.penalty_enabled && t.penalty_points > 0)
        ? `<span class="fh-penalty-warn">-${t.penalty_points}pts if skipped</span>`
        : "";

    return `
      <div class="fh-task-row ${isOverdue ? "overdue" : ""} ${flash}"
           style="--row-color:${color}; --flash-dur:${FLASH_MS}ms">
        <div class="fh-avatar" style="background:${color}">${ini(p?.name)}</div>
        <div class="fh-task-body">
          <span class="fh-task-name">${escHTML(t.name)}</span>
          ${penaltyLine}
        </div>
        ${isOverdue
            ? `<span class="fh-badge fh-badge-overdue">${Math.abs(t.days_delta)}d late</span>`
            : (t.days_late > 0
                ? `<span class="fh-badge fh-badge-pending">due ${t.days_late}d ago</span>`
                : "")}
        ${t.points
            ? `<span class="fh-badge fh-badge-pts" style="--row-color:${color}">${t.points}pts</span>`
            : ""}
        <button class="fh-check" style="--row-color:${color}"
                data-act="complete" data-tid="${t.task_id}" data-pid="${t.assigned_to}">
          ${I.check}
        </button>
      </div>`;
}
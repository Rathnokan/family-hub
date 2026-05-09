/**
 * Family Hub Card — Command Center Mode
 * Kitchen display: person filter chips + household task list + claimable tasks.
 * Imported and called by FamilyHubCard._htmlCC().
 */

import { DEFAULT_COLOR, FLASH_MS } from "./constants.js";
import { escHTML, escAttr, ini } from "./utils.js";
import { I } from "./constants.js";

/**
 * Render the full command center HTML.
 * @param {object} card - The FamilyHubCard instance (provides _filter, _attrs, _people)
 */
export function htmlCC(card) {
    const clAttr    = card._attrs("sensor.family_hub_claimable_tasks");
    const naAttr    = card._attrs("sensor.family_hub_needs_attention");
    const people    = card._people();
    const allTasks  = clAttr.all_tasks || [];
    const claimable = clAttr.tasks     || [];
    const famName   = naAttr.family_name || "Family Hub";

    const chips = people.map(p => `
      <div class="fh-chip ${card._filter === p.person_id ? "active" : ""}"
           style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
           data-act="filter" data-pid="${p.person_id}">
        <span class="fh-chip-dot"></span>${escHTML(p.name)}
      </div>`).join("");

    const filtered = card._filter
        ? allTasks.filter(t => t.assigned_to === card._filter)
        : allTasks;

    const taskRows = [
        ...filtered.filter(t => t.days_delta < 0).map(t => ccTaskRow(t, people, true,  card._flashing)),
        ...filtered.filter(t => t.days_delta === 0).map(t => ccTaskRow(t, people, false, card._flashing)),
    ].join("") || `<div class="fh-empty">✓ All caught up!</div>`;

    const claimSection = claimable.length ? `
      <div class="fh-section-title">Available to claim</div>
      <div class="fh-task-list">
        ${claimable.map(t => `
          <div class="fh-task-row" style="--row-color:${DEFAULT_COLOR}">
            <span class="fh-task-name">${escHTML(t.name)}</span>
            ${t.points ? `<span class="fh-badge fh-badge-pts">${t.points}pts</span>` : ""}
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
      <div class="fh-task-list">${taskRows}</div>
      ${claimSection}`;
}

/**
 * Render a single task row for the command center.
 * @param {object}   t         - Task data object
 * @param {object[]} people    - All people from sensor
 * @param {boolean}  isOverdue - Whether to apply overdue styling
 * @param {Set}      flashing  - Set of task_ids currently animating
 */
function ccTaskRow(t, people, isOverdue, flashing) {
    const p     = people.find(x => x.person_id === t.assigned_to);
    const color = p?.avatar_color || DEFAULT_COLOR;
    const flash = flashing.has(t.task_id) ? "flash" : "";
    return `
      <div class="fh-task-row ${isOverdue ? "overdue" : ""} ${flash}"
           style="--row-color:${color}; --flash-dur:${FLASH_MS}ms">
        <div class="fh-avatar" style="background:${color}">${ini(p?.name)}</div>
        <span class="fh-task-name">${escHTML(t.name)}</span>
        ${isOverdue ? `<span class="fh-badge fh-badge-overdue">${Math.abs(t.days_delta)}d late</span>` : ""}
        ${t.points ? `<span class="fh-badge fh-badge-pts" style="--row-color:${color}">${t.points}pts</span>` : ""}
        <button class="fh-check" style="--row-color:${color}"
                data-act="complete" data-tid="${t.task_id}" data-pid="${t.assigned_to}">
          ${I.check}
        </button>
      </div>`;
}
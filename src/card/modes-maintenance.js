/**
 * Family Hub Card — Maintenance Mode
 * House maintenance tracking: items due within 14 days, sorted by urgency.
 * Imported and called by FamilyHubCard._htmlMaintenance().
 */

import { DEFAULT_COLOR } from "./constants.js";
import { I } from "./constants.js";
import { escHTML, ini, daysLabel, daysLabelColor } from "./utils.js";

/**
 * Render the full maintenance mode HTML.
 * @param {object} card - The FamilyHubCard instance
 */
export function htmlMaintenance(card) {
    const attr  = card._attrs("sensor.family_hub_maintenance_due");
    const items = attr.items || [];

    const rows = items.map(item => {
        const cls = item.days_delta < 0 ? "overdue" : item.days_delta <= 7 ? "soon" : "ok";
        const descExpanded = card._expandedDescs.has(item.task_id);
        return `
        <div class="fh-maint-row ${cls}">
          ${item.person_name
              ? `<div class="fh-avatar" style="background:${item.person_color || DEFAULT_COLOR};width:22px;height:22px;font-size:.65rem">
                   ${ini(item.person_name)}
                 </div>`
              : ""}
          <span class="fh-task-name">${escHTML(item.name)}</span>
          ${item.description
              ? `<button class="fh-desc-btn" data-act="toggle-desc" data-id="${item.task_id}"
                         title="Toggle description">?</button>`
              : ""}
          ${descExpanded && item.description
              ? `<span class="fh-desc-inline" style="flex-basis:100%">${escHTML(item.description)}</span>`
              : ""}
          <span style="font-size:.8rem;font-weight:700;color:${daysLabelColor(item.days_delta)};white-space:nowrap">
            ${daysLabel(item.days_delta)}
          </span>
        </div>`;
    }).join("") || `<div class="fh-empty">Nothing due in the next 14 days.</div>`;

    return `
      <div class="fh-hdr">
        <span class="fh-title" style="margin:0">Maintenance</span>
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-add-reminder">
          ${I.bell} Add reminder
        </button>
      </div>
      ${attr.overdue
          ? `<span class="fh-badge fh-badge-overdue" style="display:inline-block;margin-bottom:var(--fh-gap-sm)">${attr.overdue} overdue</span>`
          : ""}
      <div class="fh-task-list">${rows}</div>`;
}
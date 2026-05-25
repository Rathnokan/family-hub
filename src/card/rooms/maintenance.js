/**
 * Family Hub Card — Home Care Room (Maintenance)
 * v0.6.0 drill-down aesthetic: stat strip, grouped sections, days badge.
 * Data source: sensor.family_hub_maintenance_due
 */

import { escHTML, ini, daysLabel } from "../utils.js";
import { DEFAULT_COLOR }           from "../constants.js";

export function renderMaintenance(card) {
    const attr     = card._attrs("sensor.family_hub_maintenance_due");
    const overdue  = attr.overdue       || 0;
    const thisWeek = attr.due_this_week || 0;
    const nextWeek = attr.due_next_week || 0;
    const items    = attr.items         || [];

    const header = `
        <div class="fh-maint-head">
            <div class="fh-maint-title">HOME CARE</div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-add-reminder">
                + Add reminder
            </button>
        </div>`;

    if (!items.length) {
        return header + `
            <div class="fh-maint-empty">
                <div class="fh-maint-empty-icon">🏠</div>
                <div class="fh-maint-empty-text">All caught up!</div>
                <div class="fh-maint-empty-sub">Nothing due in the next 14 days.</div>
            </div>`;
    }

    const statStrip = `
        <div class="fh-maint-stat-strip">
            <div class="fh-maint-stat ${overdue ? "fh-maint-stat--bad" : ""}">
                <span class="fh-maint-stat-num">${overdue}</span>
                <span class="fh-maint-stat-lbl">overdue</span>
            </div>
            <div class="fh-maint-stat-div"></div>
            <div class="fh-maint-stat">
                <span class="fh-maint-stat-num">${thisWeek}</span>
                <span class="fh-maint-stat-lbl">this week</span>
            </div>
            <div class="fh-maint-stat-div"></div>
            <div class="fh-maint-stat">
                <span class="fh-maint-stat-num">${nextWeek}</span>
                <span class="fh-maint-stat-lbl">next week</span>
            </div>
        </div>`;

    const overdueItems  = items.filter(i => i.days_delta < 0);
    const thisWeekItems = items.filter(i => i.days_delta >= 0 && i.days_delta <= 7);
    const nextWeekItems = items.filter(i => i.days_delta > 7);

    const sections = [
        { label: "OVERDUE",       items: overdueItems,  cls: "overdue"   },
        { label: "DUE THIS WEEK", items: thisWeekItems, cls: "this-week" },
        { label: "DUE NEXT WEEK", items: nextWeekItems, cls: "next-week" },
    ].filter(s => s.items.length);

    const sectionsHtml = sections.map(({ label, items: group, cls }) => `
        <div class="fh-maint-section">
            <div class="fh-maint-section-hdr ${cls}">
                ${label}
                <span class="fh-maint-section-count">${group.length}</span>
            </div>
            ${group.map(item => _itemRow(item, card)).join("")}
        </div>`
    ).join("");

    return header + statStrip + sectionsHtml;
}

function _itemRow(item, card) {
    const descExpanded = card._expandedDescs.has(item.task_id);
    const cls          = item.days_delta < 0 ? "overdue" : item.days_delta <= 7 ? "soon" : "ok";

    return `
        <div class="fh-maint-row ${cls}">
            ${item.person_name
                ? `<div class="fh-avatar" style="background:${item.person_color || DEFAULT_COLOR};width:26px;height:26px;font-size:.72rem;flex-shrink:0">${ini(item.person_name)}</div>`
                : ""}
            <div class="fh-maint-row-body">
                <div class="fh-maint-row-name">${escHTML(item.name)}</div>
                ${descExpanded && item.description
                    ? `<div class="fh-maint-row-desc">${escHTML(item.description)}</div>`
                    : ""}
            </div>
            ${item.description
                ? `<button class="fh-desc-btn" data-act="toggle-desc" data-id="${item.task_id}" title="Toggle description">?</button>`
                : ""}
            <span class="fh-maint-days-badge ${cls}">${daysLabel(item.days_delta)}</span>
        </div>`;
}

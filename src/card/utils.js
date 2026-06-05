/**
 * Family Hub Card — Utility Functions
 * Pure helpers shared across all card modules.
 */

import { WEEKDAY_LABELS } from "./constants.js";

/** First initial, uppercased */
export const ini  = name => (name || "?")[0].toUpperCase();

/** Format points with locale thousands separator */
export const fPts = n => (n || 0).toLocaleString();

/** Format a number as USD string */
export const fUSD = n => `$${(n || 0).toFixed(2)}`;

/** Capitalize first letter of a string */
export const cap  = s => s ? s[0].toUpperCase() + s.slice(1) : "";

/** Convert a display name to a safe sensor slug. MUST match the Python transform
 *  in sensor.py / card_model.person_entity_id — `name.lower().replace(" ", "_")` —
 *  or the card's per-person model lookups miss. Single-space replace only. */
export const slug = s => (s || "").toLowerCase().replace(/ /g, "_");

/**
 * Escape all five HTML special characters for safe innerHTML injection.
 * Use for ALL user-supplied text rendered into the DOM to prevent XSS.
 */
export const escHTML = s => String(s || "").replace(/[&<>'"]/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));

/** Alias for HTML attribute contexts (values inside quotes) */
export const escAttr = escHTML;

/** Convert days_delta integer to a human-readable label */
export function daysLabel(d) {
    if (d < -1) return `${Math.abs(d)}d overdue`;
    if (d === -1) return "1d overdue";
    if (d === 0) return "Today";
    if (d === 1) return "Tomorrow";
    return `In ${d}d`;
}

/** CSS color string appropriate for a days_delta value */
export function daysLabelColor(d) {
    if (d < 0)  return "var(--fh-overdue)";
    if (d <= 7) return "var(--fh-warning)";
    return "var(--fh-success)";
}

/** Build an HTML <option> string from an array of {value, label} objects */
export function opts(arr, current) {
    return arr.map(o =>
        `<option value="${o.value}" ${o.value === current ? "selected" : ""}>${o.label}</option>`
    ).join("");
}

/**
 * Render a row of weekday chip inputs.
 * @param {number[]} checkedDays  - Array of weekday indices (0=Mon) that are checked
 * @param {string}   cbClass      - CSS class to apply to each <input> for bulk reading
 * @param {boolean}  singleSelect - If true, renders radio buttons (one-day selection)
 */
export function weekdayChips(checkedDays, cbClass, singleSelect = false) {
    const days = checkedDays || [];
    const effective = singleSelect ? days.slice(0, 1) : days;
    return WEEKDAY_LABELS.map((label, i) => {
        const checked = effective.includes(i);
        const type = singleSelect ? "radio" : "checkbox";
        return `<label class="fh-wd-chip ${checked ? "checked" : ""}">
          <input type="${type}" class="${cbClass}" value="${i}" ${checked ? "checked" : ""}>
          ${label}
        </label>`;
    }).join("");
}

/**
 * Format a timestamp string to a short relative label.
 * Examples: "2h ago", "3d ago", "just now"
 */
export function relTime(ts) {
    if (!ts) return "";
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)   return "just now";
    if (mins < 60)  return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs  < 24)  return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

/**
 * Format an ISO date string to a short month+day label.
 * "2026-05-09" → "May 9"
 */
export function fmtShortDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Group a flat history entry list so that all task_skipped entries sharing
 * the same skipped_date are collapsed into one group object.
 *
 * Returns a mixed array of:
 *   { isGroup: false, entry }  — regular (non-skipped) history entry
 *   { isGroup: true, key, date, dateDisplay, totalPenalty, items, timestamp }
 *
 * Sorted newest-first by timestamp.
 *
 * @param {object[]} entries - Flat history entry array (already filtered if needed)
 */
export function groupHistorySkipped(entries) {
    const regular   = [];
    const byDate    = new Map();  // skipped_date → entry[]

    for (const e of entries) {
        if (e.type === "task_skipped") {
            // Fall back to timestamp date if backend didn't tag skipped_date.
            // Matches what Recent Activity does so the two panels never disagree.
            const dateKey = e.skipped_date || (e.timestamp || "").slice(0, 10);
            if (dateKey) {
                if (!byDate.has(dateKey)) byDate.set(dateKey, []);
                byDate.get(dateKey).push(e);
                continue;
            }
        }
        regular.push({ isGroup: false, entry: e, timestamp: e.timestamp });
    }

    const groups = [];
    for (const [date, items] of byDate) {
        const totalPenalty = items.reduce((s, e) => s + Math.abs(e.points_delta || 0), 0);
        groups.push({
            isGroup:      true,
            key:          `skipped-${date}`,
            date,
            dateDisplay:  fmtShortDate(date),
            totalPenalty,
            items,
            timestamp:    items[0].timestamp,
        });
    }

    return [...regular, ...groups].sort((a, b) =>
        (b.timestamp || "").localeCompare(a.timestamp || "")
    );
}
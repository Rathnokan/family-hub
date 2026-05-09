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

/** Convert a display name to a safe sensor slug (lowercase, spaces → underscores) */
export const slug = s => (s || "").toLowerCase().replace(/\s+/g, "_");

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
 * Render a row of weekday chip checkboxes.
 * @param {number[]} checkedDays - Array of weekday indices (0=Mon) that are checked
 * @param {string}   cbClass     - CSS class to apply to each <input> for bulk reading
 */
export function weekdayChips(checkedDays, cbClass) {
    return WEEKDAY_LABELS.map((label, i) => {
        const checked = (checkedDays || []).includes(i);
        return `<label class="fh-wd-chip ${checked ? "checked" : ""}">
          <input type="checkbox" class="${cbClass}" value="${i}" ${checked ? "checked" : ""}>
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
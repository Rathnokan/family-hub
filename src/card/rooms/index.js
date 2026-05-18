/**
 * Family Hub Card — Room Registry
 *
 * Each room entry defines the tile shown on the Command Center Home page
 * and the drill-down view rendered when the user taps it.
 *
 * To add a room: create a new entry here + a rooms/<id>.js module.
 * Flip status to "live" when the module is ready.
 *
 * render(card)   → full drill-down HTML string
 * getStats(card) → [{label, value, accent?}]   — live stats for the room tile
 * preview        — one-line description shown on coming-soon screens
 */

import { htmlChores }          from "../modes-chores.js";
import { renderMaintenance }   from "./maintenance.js";
import { renderSmartHome }     from "./smarthome.js";
import { renderMeals }         from "./meals.js";
import { renderCalendar }      from "./calendar.js";

export const ROOMS = [
    {
        id:     "chores",
        label:  "CHORES HQ",
        sub:    "Mission Control",
        icon:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
        accent: "var(--fh-accent)",
        status: "live",
        render: (card) => htmlChores(card),
        getStats(card) {
            const allTasks = card._attrs("sensor.family_hub_claimable_tasks").all_tasks || [];
            const pending  = allTasks.filter(t => t.status === "pending").length;
            const approval = (card._attrs("sensor.family_hub_needs_attention").approval_queue || []).length;
            const stats    = [{ label: "due today", value: pending }];
            if (approval > 0) stats.push({ label: "need approval", value: approval, accent: "var(--fh-warning)" });
            return stats;
        },
    },
    {
        id:      "maintenance",
        label:   "HOME CARE",
        sub:     "Maintenance Tracker",
        icon:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.78 15.3 19.78 21.3 21.89 19.14 15.89 13.14 13.78 15.3M17.5 10.1c-.39 0-.81-.05-1.14-.19L4.97 21.25 2.86 19.14l7.41-7.4-1.77-1.78-.72.7-1.45-1.41V12.1L5.62 12.82 2.08 9.28l.71-.72H5.62L4.18 7.11 7.78 3.5c.98-1 2.69-1 3.69 0L9.36 5.61l1.42 1.44-.72.71 1.77 1.78 2.37-2.38c-.14-.33-.2-.75-.2-1.16C14 3.79 15.79 2 18 2c.68 0 1.32.19 1.86.5L17.5 4.86l1.64 1.64L21.5 4.14C21.81 4.68 22 5.32 22 6c0 2.21-1.79 4-4 4-.18 0-.34-.03-.5-.05v.15z"/></svg>`,
        accent:  "#ff9f0a",
        status:  "live",
        render: (card) => renderMaintenance(card),
        getStats(card) {
            const attr    = card._attrs("sensor.family_hub_maintenance_due");
            const overdue = (attr.overdue || []).length;
            const soon    = (attr.due_this_week || []).length;
            const stats   = [];
            if (overdue > 0) stats.push({ label: "overdue", value: overdue, accent: "var(--fh-overdue)" });
            stats.push({ label: "due this week", value: soon });
            return stats;
        },
    },
    {
        id:      "meals",
        label:   "MEALS",
        sub:     "Weekly menu & grocery list",
        icon:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05M1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-1.46-.74-2.87-2.22-4.28-1.13-1.07-2.84-1.93-4.43-2.43-.25-.08-.5-.12-.76-.12H8.5c-.25 0-.5.04-.76.12-1.59.5-3.3 1.36-4.43 2.43C1.83 13.13 1 14.54 1 16h15.03z"/></svg>`,
        accent:  "#ff9f0a",
        status:  "coming",
        preview: "Plan the week's meals, build a grocery list, and see tonight's dinner at a glance.",
        render: (card) => renderMeals(card),
        getStats() { return []; },
    },
    {
        id:      "smarthome",
        label:   "SMART HOME",
        sub:     "Lights, climate & more",
        icon:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
        accent:  "#30d158",
        status:  "coming",
        preview: "Kid-safe controls for lights, thermostat, and irrigation — right from the kitchen.",
        render: (card) => renderSmartHome(card),
        getStats() { return []; },
    },
    {
        id:      "calendar",
        label:   "CALENDAR",
        sub:     "Today's schedule",
        icon:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`,
        accent:  "#64d2ff",
        status:  "coming",
        preview: "See today's events, upcoming reminders, and schedule — powered by your HA calendars.",
        render: (card) => renderCalendar(card),
        getStats() { return []; },
    },
];

export function getRoomById(id) {
    return ROOMS.find(r => r.id === id) || null;
}

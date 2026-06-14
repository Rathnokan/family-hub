/**
 * Family Hub Card — Constants
 * All shared constants used across card modules.
 */

export const DOMAIN        = "family_hub";
export const VERSION       = "0.7.6";
export const DEFAULT_COLOR = "#7F77DD";
export const FLASH_MS      = 1400;

// Weekday display labels (index 0 = Monday, per HA backend)
export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// History event type → { label, color }
export const HISTORY_META = {
    task_completed:       { label: "Completed",         color: "var(--fh-success)"  },
    task_approved:        { label: "Approved",           color: "var(--fh-success)"  },
    pending_approval:     { label: "Pending approval",   color: "var(--fh-warning)"  },
    task_denied:          { label: "Denied",             color: "var(--fh-overdue)"  },
    task_skipped:         { label: "Skipped",            color: "var(--fh-warning)"  },
    task_excused:         { label: "Excused",            color: "var(--fh-accent)"   },
    task_rejected:        { label: "Rejected",           color: "var(--fh-overdue)"  },
    task_marked_complete: { label: "Marked done",        color: "var(--fh-success)"  },
    task_late_claimed:    { label: "Claimed late",       color: "var(--fh-warning)"  },
    points_awarded:       { label: "Points",             color: "var(--fh-accent)"   },
    redemption_requested: { label: "Redeem request",     color: "var(--fh-warning)"  },
    redemption_approved:  { label: "Redeem approved",    color: "var(--fh-success)"  },
    redemption_declined:  { label: "Redeem declined",    color: "var(--fh-overdue)"  },
    task_added:           { label: "Task added",         color: "var(--fh-text-sec)" },
    person_added:         { label: "Person added",       color: "var(--fh-text-sec)" },
    allowance:            { label: "Allowance",          color: "var(--fh-success)"  },
    completion_streak_milestone:   { label: "Success streak",   color: "var(--fh-success)"  },
    subscription_cancel_declined:  { label: "Cancel declined",   color: "var(--fh-warning)"  },
    subscription_updated:          { label: "Sub updated",        color: "var(--fh-text-sec)" },
    // v0.6.5 subscription lifecycle (renewals/lapses are deductions)
    subscription_started:          { label: "Subscribed",         color: "var(--fh-accent)"   },
    subscription_renewed:          { label: "Sub renewal",        color: "var(--fh-text-sec)" },
    subscription_lapsed:           { label: "Sub lapsed",         color: "var(--fh-warning)"  },
    subscription_canceled:         { label: "Sub canceled",       color: "var(--fh-text-sec)" },
    subscription_cancel_requested: { label: "Cancel requested",   color: "var(--fh-warning)"  },
    // v0.6.3 group rewards
    group_proposed:                { label: "Group proposed",     color: "var(--fh-text-sec)" },
    group_chip_in:                 { label: "Chipped in",         color: "var(--fh-accent)"   },
    group_redeemed:                { label: "Group redeemed",     color: "var(--fh-success)"  },
};

// Inline SVG icons — no external dependency
export const I = {
    check:    `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
    plus:     `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>`,
    edit:     `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
    trash:    `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
    bell:     `<svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.92V4a1 1 0 1 0-2 0v1.08A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`,
    award:    `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    minus:    `<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14z"/></svg>`,
    close:    `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
    settings: `<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/></svg>`,
    person:   `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
    store:    `<svg viewBox="0 0 24 24"><path d="M20 4H4v2l16-2zm1 5H3l1 11h16l1-11zm-9 8H10v-4h2v4zm0-6H10v-2h2v2z"/></svg>`,
    remove:   `<svg viewBox="0 0 24 24"><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM2 6v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6H2zm8 13H4v-1h6v1zm0-3H4v-1h6v1zm0-3H4v-1h6v1zm1-7H3V8h8V6zm-2-3H5V2h4v1z"/></svg>`,
    history:  `<svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`,
    excuse:   `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
    print:    `<svg viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-1-9H6v4h12V3z"/></svg>`,
    rewards:  `<svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.89.36 13.36.36c-1.38 0-2.56.6-3.36 1.55C9.2.96 8.02.36 6.64.36 4.11.36 2 2.53 2 4.64c0 .48.11.92.18 1.36H0v4h1v10h22V10h1V6h-4zm-8 12H6V10h6v8zm0-10H4V8h8v2zm4 10h-2v-8h2v8zm2-10h-6V8h6v2zm-5.36-4c-.45 0-1.09-.49-1.09-1.36 0-.87.64-1.36 1.09-1.36.46 0 1.1.49 1.1 1.36C13.74 3.51 13.1 4 12.64 4zM6.64 4c-.45 0-1.09-.49-1.09-1.36 0-.87.64-1.36 1.09-1.36.46 0 1.1.49 1.1 1.36C7.74 3.51 7.1 4 6.64 4z"/></svg>`,
    toggle:   `<svg viewBox="0 0 24 24"><path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>`,
};

// ---------------------------------------------------------------------------
// Quick-add chore template library (v0.6.3 item 8)
// ---------------------------------------------------------------------------
// Each template: { key, name, description, category, points }
// category should match one of the family's category_labels (or be "").
// icon is intentionally omitted — parents can pick their own after applying.

export const CHORE_TEMPLATES = [
    // Morning Routine
    { key: "brush-teeth-am",   name: "Brush teeth",           description: "Morning — brush for 2 minutes",      category: "Morning",  points: 5  },
    { key: "make-bed",         name: "Make bed",               description: "Pull up covers and fluff pillow",    category: "Morning",  points: 10 },
    { key: "get-dressed",      name: "Get dressed",            description: "Clothes on, shoes tied, ready to go",category: "Morning",  points: 5  },
    { key: "take-vitamins",    name: "Take vitamins",          description: "",                                   category: "Morning",  points: 5  },
    { key: "eat-breakfast",    name: "Eat breakfast",          description: "",                                   category: "Morning",  points: 5  },

    // Evening Routine
    { key: "brush-teeth-pm",   name: "Brush teeth (evening)",  description: "Before bed — brush for 2 minutes",  category: "Evening",  points: 5  },
    { key: "pajamas-on",       name: "Pajamas on",             description: "",                                   category: "Evening",  points: 5  },
    { key: "pick-up-room",     name: "Pick up room",           description: "Put toys away and tidy floor",       category: "Evening",  points: 10 },
    { key: "pack-backpack",    name: "Pack backpack",          description: "Ready for tomorrow",                 category: "Evening",  points: 10 },

    // Kitchen
    { key: "clear-table",      name: "Clear table",            description: "After dinner — dishes to the sink",  category: "Kitchen",  points: 10 },
    { key: "load-dishwasher",  name: "Load dishwasher",        description: "",                                   category: "Kitchen",  points: 15 },
    { key: "unload-dishwasher",name: "Unload dishwasher",      description: "",                                   category: "Kitchen",  points: 15 },
    { key: "wipe-counters",    name: "Wipe counters",          description: "",                                   category: "Kitchen",  points: 10 },

    // Household
    { key: "take-out-trash",   name: "Take out trash",         description: "",                                   category: "Chores",   points: 15 },
    { key: "vacuum",           name: "Vacuum living room",     description: "",                                   category: "Chores",   points: 20 },
    { key: "sweep-floor",      name: "Sweep/mop floor",        description: "",                                   category: "Chores",   points: 15 },
    { key: "feed-pets",        name: "Feed pets",              description: "",                                   category: "Chores",   points: 10 },
    { key: "water-plants",     name: "Water plants",           description: "",                                   category: "Chores",   points: 10 },

    // School
    { key: "homework",         name: "Homework",               description: "Complete all assigned homework",     category: "School",   points: 20 },
    { key: "reading",          name: "Reading time",           description: "Read for 20 minutes",               category: "School",   points: 15 },
];
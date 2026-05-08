/**
 * Family Hub — Custom Lovelace Card
 * Version: 0.4.0
 *
 * Four dashboard modes in one self-contained Web Component:
 *   command_center  — Kitchen display, person filter chips, household task list
 *   personal        — Per-person view: points, tasks (grouped by category), store
 *   maintenance     — House maintenance tracking
 *   admin           — Approvals + history log, redemptions + store inventory,
 *                     chores (with person filter), people, settings
 *
 * v0.4.0 changes vs v0.3.0:
 *   - BUG FIX: Collapse multiple pending instances of same chore to one row
 *     (oldest due date shown) — eliminates stacked overdue rows from pre-v0.3.0 data
 *   - BUG FIX: Hide dollar value when show_dollar_value attribute is false
 *   - Expiry badge: task rows show "Expires in Nd" countdown when ≤ 2 days remain
 *   - Personal dashboard: tasks grouped by category_label within due-today section
 *   - Personal dashboard: Reminders section (chore_type === "reminder") below tasks
 *     — lighter styling, no points badge, no penalty warning
 *   - Personal dashboard: "Requested" badge on already-pending store items,
 *     Request button disabled to prevent double-requests
 *   - Admin Approvals tab: split into Pending Approvals section + History Log section
 *     — history rows with per-entry action buttons (Excuse / Mark done / Reject)
 *     — person filter chips on history log
 *   - Admin Redemptions tab: split into Pending Redemptions + Store Inventory sections
 *     — "Add reward" button moved here from Overview
 *   - Admin Overview: "Add task" button made larger/more prominent; "Add reward" removed
 *   - Admin Chores tab: person filter chips (All + per-person) to filter chore list
 *   - History event icons mapped to readable labels with colour coding
 *   - New v0.4.0 service calls: excuse_task, reject_task, mark_task_complete
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DOMAIN        = "family_hub";
const VERSION       = "0.4.0";
const DEFAULT_COLOR = "#7F77DD";
const FLASH_MS      = 1400;

// Global sensors tracked for dirty-check
const FH_SENSORS = [
    "sensor.family_hub_needs_attention",
    "sensor.family_hub_maintenance_due",
    "sensor.family_hub_maintenance_overdue",
    "sensor.family_hub_claimable_tasks",
];

// Weekday display labels (index 0 = Monday, per HA backend)
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// History event type → { label, color }
const HISTORY_META = {
    task_completed:       { label: "Completed",       color: "var(--fh-success)"  },
    task_approved:        { label: "Approved",         color: "var(--fh-success)"  },
    task_denied:          { label: "Denied",           color: "var(--fh-overdue)"  },
    task_skipped:         { label: "Skipped",          color: "var(--fh-warning)"  },
    task_excused:         { label: "Excused",          color: "var(--fh-accent)"   },
    task_rejected:        { label: "Rejected",         color: "var(--fh-overdue)"  },
    task_marked_complete: { label: "Marked done",      color: "var(--fh-success)"  },
    points_awarded:       { label: "Points",           color: "var(--fh-accent)"   },
    redemption_requested: { label: "Redeem request",   color: "var(--fh-warning)"  },
    redemption_approved:  { label: "Redeem approved",  color: "var(--fh-success)"  },
    redemption_declined:  { label: "Redeem declined",  color: "var(--fh-overdue)"  },
    task_added:           { label: "Task added",       color: "var(--fh-text-sec)" },
    person_added:         { label: "Person added",     color: "var(--fh-text-sec)" },
};

// ---------------------------------------------------------------------------
// Icons (inline SVG — no external dependency)
// ---------------------------------------------------------------------------

const I = {
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
};

// ---------------------------------------------------------------------------
// Shared CSS
// ---------------------------------------------------------------------------

const CSS = `
  :host {
    --fh-radius:      12px;
    --fh-radius-sm:   8px;
    --fh-radius-chip: 20px;
    --fh-gap:         12px;
    --fh-gap-sm:      8px;
    --fh-gap-xs:      4px;
    --fh-pad:         16px;
    --fh-pad-sm:      12px;
    --fh-pad-xs:      8px;
    --fh-bg:          var(--ha-card-background, var(--card-background-color, #1c1c1e));
    --fh-surface:     var(--secondary-background-color, #2c2c2e);
    --fh-border:      var(--divider-color, rgba(255,255,255,.12));
    --fh-text:        var(--primary-text-color, #f5f5f7);
    --fh-text-sec:    var(--secondary-text-color, #aeaeb2);
    --fh-overdue:     #ff453a;
    --fh-overdue-bg:  rgba(255,69,58,.12);
    --fh-warning:     #ff9f0a;
    --fh-warning-bg:  rgba(255,159,10,.12);
    --fh-success:     #30d158;
    --fh-success-bg:  rgba(48,209,88,.12);
    --fh-accent:      var(--primary-color, #7F77DD);
    font-family: var(--paper-font-body1_-_font-family, -apple-system, Roboto, sans-serif);
    color: var(--fh-text);
    display: block;
  }

  /* Card shell */
  .fh-card {
    background: var(--fh-bg);
    border-radius: var(--ha-card-border-radius, var(--fh-radius));
    padding: var(--fh-pad);
    box-shadow: var(--ha-card-box-shadow, 0 2px 12px rgba(0,0,0,.25));
    container-type: inline-size;
    container-name: fh;
    position: relative;
  }

  /* Typography */
  .fh-title        { font-size:1.1rem; font-weight:700; margin:0 0 var(--fh-gap) 0; }
  .fh-section-title {
    font-size:.75rem; font-weight:700; letter-spacing:.07em;
    text-transform:uppercase; color:var(--fh-text-sec);
    margin:var(--fh-gap) 0 var(--fh-gap-sm) 0;
  }
  .fh-balance      { font-size:3.4rem; font-weight:800; line-height:1; letter-spacing:-.03em; }
  .fh-balance-unit { font-size:1.2rem; font-weight:400; opacity:.6; margin-left:3px; }
  .fh-dollar       { font-size:.95rem; color:var(--fh-text-sec); margin-top:3px; }

  /* Filter chips */
  .fh-chips { display:flex; flex-wrap:wrap; gap:var(--fh-gap-sm); margin-bottom:var(--fh-gap); }
  .fh-chip {
    display:inline-flex; align-items:center; gap:6px;
    padding:5px 14px; border-radius:var(--fh-radius-chip);
    border:1.5px solid var(--fh-border); background:var(--fh-surface);
    font-size:.85rem; font-weight:500;
    cursor:pointer; user-select:none; white-space:nowrap;
    transition:background .15s, border-color .15s, color .15s;
  }
  .fh-chip.active {
    background:var(--chip-color, var(--fh-accent));
    border-color:var(--chip-color, var(--fh-accent));
    color:#fff;
  }
  .fh-chip-dot { width:8px; height:8px; border-radius:50%; background:currentColor; opacity:.75; }

  /* Tab bar */
  .fh-tabs {
    display:flex; gap:2px; margin-bottom:var(--fh-gap);
    background:var(--fh-surface); border-radius:var(--fh-radius-sm); padding:3px;
  }
  .fh-tab {
    flex:1; padding:7px 8px; text-align:center;
    border-radius:6px; font-size:.83rem; font-weight:500;
    cursor:pointer; color:var(--fh-text-sec);
    transition:background .15s, color .15s; user-select:none; position:relative;
  }
  .fh-tab.active {
    background:var(--fh-bg); color:var(--fh-accent);
    font-weight:700; box-shadow:0 1px 4px rgba(0,0,0,.2);
  }
  .fh-tab-badge {
    position:absolute; top:3px; right:3px;
    width:7px; height:7px; border-radius:50%; background:var(--fh-overdue);
  }

  /* Task rows */
  .fh-task-list { display:flex; flex-direction:column; gap:var(--fh-gap-sm); }
  .fh-task-row {
    display:flex; align-items:center; gap:var(--fh-gap-sm);
    padding:var(--fh-pad-xs) var(--fh-pad-sm);
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
    border-left:3px solid var(--row-color, var(--fh-accent));
    position:relative; overflow:visible;
    transition:opacity .25s, transform .25s;
  }
  .fh-task-row.overdue  { border-left-color:var(--fh-overdue); }
  .fh-task-row.reminder { border-left-color:var(--fh-text-sec); opacity:.85; }
  .fh-task-row.fh-drag-over {
    outline:2px dashed var(--fh-accent); outline-offset:2px;
    background:color-mix(in srgb, var(--fh-accent) 8%, var(--fh-surface));
  }
  .fh-task-row.fh-dragging { opacity:.45; }
  .fh-task-row.flash {
    animation: fh-complete var(--flash-dur, 1.4s) ease forwards;
  }
  @keyframes fh-complete {
    0%,60% { background:var(--fh-success-bg); }
    100%   { opacity:0; transform:scaleY(0); max-height:0; padding:0; margin:0; }
  }
  .fh-task-name {
    flex:1; font-size:.92rem; font-weight:500;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-task-sub  { font-size:.75rem; color:var(--fh-text-sec); }
  .fh-task-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
  .fh-desc-inline {
    font-size:.76rem; color:var(--fh-text-sec); line-height:1.4;
    white-space:normal; padding-top:2px;
  }

  /* Badges */
  .fh-badge {
    font-size:.72rem; font-weight:700; padding:2px 8px; border-radius:10px;
    white-space:nowrap; flex-shrink:0;
  }
  .fh-badge-overdue  { color:var(--fh-overdue); background:var(--fh-overdue-bg); }
  .fh-badge-pending  { color:var(--fh-warning);  background:var(--fh-warning-bg); }
  .fh-badge-success  { color:var(--fh-success);  background:var(--fh-success-bg); }
  .fh-badge-pts {
    color:var(--row-color, var(--fh-accent));
    background:color-mix(in srgb, var(--row-color, var(--fh-accent)) 14%, transparent);
  }
  /* Expiry badge — amber, attention-grabbing */
  .fh-badge-expiry { color:var(--fh-warning); background:var(--fh-warning-bg); }
  /* Requested badge — neutral purple for store */
  .fh-badge-requested { color:var(--fh-accent); background:color-mix(in srgb, var(--fh-accent) 15%, transparent); }

  /* Penalty warning */
  .fh-penalty-warn {
    font-size:.7rem; color:var(--fh-warning); white-space:nowrap; flex-shrink:0;
  }

  /* Description toggle button */
  .fh-desc-btn {
    width:18px; height:18px; border-radius:50%; flex-shrink:0;
    border:1.5px solid var(--fh-text-sec); background:transparent;
    color:var(--fh-text-sec); font-size:.65rem; font-weight:800;
    cursor:pointer; display:inline-flex; align-items:center;
    justify-content:center; padding:0; line-height:1;
    transition:border-color .12s, color .12s;
  }
  .fh-desc-btn:hover { border-color:var(--fh-text); color:var(--fh-text); }

  /* Drag handle */
  .fh-drag-handle {
    cursor:grab; color:var(--fh-text-sec); flex-shrink:0;
    font-size:1rem; line-height:1; padding:0 2px;
    user-select:none; touch-action:none;
  }
  .fh-drag-handle:active { cursor:grabbing; }

  /* Check button */
  .fh-check {
    width:32px; height:32px; border-radius:50%; flex-shrink:0;
    border:2px solid var(--row-color, var(--fh-accent));
    background:transparent; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    color:var(--row-color, var(--fh-accent));
    transition:background .15s, transform .1s;
  }
  .fh-check:hover { background:color-mix(in srgb, var(--row-color, var(--fh-accent)) 18%, transparent); }
  .fh-check:active { transform:scale(.9); }
  .fh-check svg { width:15px; height:15px; fill:currentColor; pointer-events:none; }

  /* Buttons */
  .fh-btn {
    display:inline-flex; align-items:center; justify-content:center; gap:5px;
    padding:7px 14px; border-radius:var(--fh-radius-sm);
    border:none; font-size:.84rem; font-weight:600;
    cursor:pointer; user-select:none; white-space:nowrap;
    transition:filter .15s, transform .1s; font-family:inherit;
  }
  .fh-btn:hover  { filter:brightness(.88); }
  .fh-btn:active { transform:scale(.96); }
  .fh-btn svg    { width:15px; height:15px; fill:currentColor; pointer-events:none; }
  .fh-btn-primary { background:var(--fh-accent); color:#fff; }
  .fh-btn-success { background:var(--fh-success); color:#000; }
  .fh-btn-danger  { background:var(--fh-overdue); color:#fff; }
  .fh-btn-ghost   { background:var(--fh-surface); color:var(--fh-text); border:1.5px solid var(--fh-border); }
  .fh-btn-warning { background:var(--fh-warning); color:#000; }
  .fh-btn-sm      { padding:4px 10px; font-size:.78rem; }
  .fh-btn-sm svg  { width:13px; height:13px; }
  .fh-btn-lg      { padding:10px 20px; font-size:.95rem; font-weight:700; }
  .fh-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; filter:none; }

  /* Avatar */
  .fh-avatar {
    width:28px; height:28px; border-radius:50%;
    display:inline-flex; align-items:center; justify-content:center;
    font-size:.75rem; font-weight:800; color:#fff; flex-shrink:0;
    text-transform:uppercase;
  }

  /* Multiple small avatars in a row */
  .fh-avatars { display:flex; margin-right:2px; }
  .fh-avatars .fh-avatar + .fh-avatar { margin-left:-8px; }

  /* Person header (personal mode) */
  .fh-person-header {
    display:flex; align-items:flex-start; gap:var(--fh-gap);
    padding:var(--fh-pad); background:var(--fh-surface);
    border-radius:var(--fh-radius); margin-bottom:var(--fh-gap);
  }

  /* Store grid */
  .fh-store-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));
    gap:var(--fh-gap-sm);
  }
  .fh-store-item {
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
    padding:var(--fh-pad-sm); display:flex; flex-direction:column; gap:5px;
  }
  .fh-store-name  { font-size:.88rem; font-weight:700; }
  .fh-store-desc  { font-size:.75rem; color:var(--fh-text-sec); flex:1; }
  .fh-store-price { font-size:1rem; font-weight:800; }

  /* Admin store inventory list */
  .fh-store-inv-row {
    display:flex; align-items:center; gap:var(--fh-gap-sm);
    padding:var(--fh-pad-xs) var(--fh-pad-sm);
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
  }
  .fh-store-inv-info { flex:1; min-width:0; }
  .fh-store-inv-name { font-size:.9rem; font-weight:600; }
  .fh-store-inv-meta { font-size:.75rem; color:var(--fh-text-sec); }

  /* Queue rows (admin) */
  .fh-queue-row {
    display:flex; align-items:center; gap:var(--fh-gap-sm);
    padding:var(--fh-pad-sm); background:var(--fh-surface);
    border-radius:var(--fh-radius-sm);
  }
  .fh-queue-info { flex:1; min-width:0; }
  .fh-queue-name { font-size:.9rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .fh-queue-meta { font-size:.75rem; color:var(--fh-text-sec); }
  .fh-queue-btns { display:flex; gap:var(--fh-gap-sm); flex-shrink:0; }

  /* History log rows */
  .fh-hist-row {
    display:flex; align-items:flex-start; gap:var(--fh-gap-sm);
    padding:var(--fh-pad-xs) var(--fh-pad-sm);
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
    border-left:3px solid var(--hist-color, var(--fh-border));
  }
  .fh-hist-info { flex:1; min-width:0; }
  .fh-hist-label { font-size:.78rem; font-weight:700; color:var(--hist-color, var(--fh-text-sec)); }
  .fh-hist-name  { font-size:.88rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .fh-hist-meta  { font-size:.72rem; color:var(--fh-text-sec); }
  .fh-hist-actions { display:flex; gap:4px; flex-shrink:0; margin-left:auto; align-self:center; }

  /* Point row (admin overview) */
  .fh-point-row {
    display:flex; align-items:center; gap:var(--fh-gap-sm); flex-wrap:wrap;
    background:var(--fh-surface); border-radius:var(--fh-radius-sm); padding:var(--fh-pad-sm);
  }

  /* Maintenance rows */
  .fh-maint-row {
    display:flex; align-items:center; gap:var(--fh-gap-sm);
    padding:var(--fh-pad-xs) var(--fh-pad-sm);
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
    border-left:3px solid var(--fh-border);
  }
  .fh-maint-row.overdue { border-left-color:var(--fh-overdue); }
  .fh-maint-row.soon    { border-left-color:var(--fh-warning); }
  .fh-maint-row.ok      { border-left-color:var(--fh-success); }

  /* Toggle */
  .fh-toggle-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:var(--fh-pad-xs) var(--fh-pad-sm);
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
  }
  .fh-toggle { position:relative; width:44px; height:24px; flex-shrink:0; }
  .fh-toggle input { opacity:0; width:0; height:0; position:absolute; }
  .fh-toggle-slider {
    position:absolute; inset:0; background:var(--fh-border);
    border-radius:24px; cursor:pointer; transition:background .2s;
  }
  .fh-toggle-slider:before {
    content:''; position:absolute;
    width:18px; height:18px; left:3px; top:3px;
    background:#fff; border-radius:50%;
    transition:transform .2s; box-shadow:0 1px 3px rgba(0,0,0,.35);
  }
  .fh-toggle input:checked + .fh-toggle-slider            { background:var(--fh-accent); }
  .fh-toggle input:checked + .fh-toggle-slider:before     { transform:translateX(20px); }

  /* Form inputs */
  .fh-input, .fh-select {
    width:100%; padding:9px 11px; box-sizing:border-box;
    border-radius:var(--fh-radius-sm); border:1.5px solid var(--fh-border);
    background:var(--fh-bg); color:var(--fh-text);
    font-size:.88rem; font-family:inherit;
    transition:border-color .15s;
  }
  .fh-input:focus, .fh-select:focus { outline:none; border-color:var(--fh-accent); }
  .fh-select { cursor:pointer; }
  .fh-textarea {
    width:100%; padding:9px 11px; box-sizing:border-box;
    border-radius:var(--fh-radius-sm); border:1.5px solid var(--fh-border);
    background:var(--fh-bg); color:var(--fh-text);
    font-size:.88rem; font-family:inherit; resize:vertical; min-height:60px;
  }
  .fh-textarea:focus { outline:none; border-color:var(--fh-accent); }

  /* Person checkbox chips */
  .fh-person-cb-list { display:flex; flex-wrap:wrap; gap:6px; }
  .fh-person-cb-chip {
    display:flex; align-items:center; gap:5px;
    padding:4px 10px; border-radius:20px;
    border:1.5px solid var(--fh-border); cursor:pointer;
    font-size:.82rem; transition:border-color .15s, background .15s;
    user-select:none;
  }
  .fh-person-cb-chip input[type=checkbox] { display:none; }
  .fh-person-cb-chip.checked {
    border-color:var(--chip-color, var(--fh-accent));
    background:color-mix(in srgb, var(--chip-color, var(--fh-accent)) 18%, transparent);
  }

  /* Weekday selector */
  .fh-weekday-row { display:flex; flex-wrap:wrap; gap:4px; }
  .fh-wd-chip {
    display:flex; align-items:center; justify-content:center;
    width:40px; height:32px; border-radius:6px;
    border:1.5px solid var(--fh-border); background:var(--fh-surface);
    font-size:.78rem; font-weight:600; cursor:pointer; user-select:none;
    transition:border-color .12s, background .12s, color .12s;
  }
  .fh-wd-chip input[type=checkbox] { display:none; }
  .fh-wd-chip.checked {
    background:var(--fh-accent); border-color:var(--fh-accent); color:#fff;
  }

  /* Category label chips (settings) */
  .fh-cat-labels { display:flex; flex-wrap:wrap; gap:6px; }
  .fh-cat-chip {
    display:inline-flex; align-items:center; gap:6px;
    padding:4px 10px; border-radius:20px;
    background:var(--fh-surface); border:1.5px solid var(--fh-border);
    font-size:.82rem;
  }
  .fh-cat-chip-del {
    width:16px; height:16px; border-radius:50%; border:none;
    background:transparent; color:var(--fh-text-sec);
    cursor:pointer; font-size:.82rem; padding:0; line-height:1;
    display:flex; align-items:center; justify-content:center;
  }
  .fh-cat-chip-del:hover { color:var(--fh-overdue); }

  /* Modal */
  .fh-modal-bg {
    position:fixed; inset:0; background:rgba(0,0,0,.55);
    z-index:9999; display:flex; align-items:center; justify-content:center; padding:var(--fh-pad);
  }
  .fh-modal {
    background:var(--fh-bg); border-radius:var(--fh-radius);
    padding:var(--fh-pad); width:100%; max-width:480px;
    max-height:90vh; overflow-y:auto;
    display:flex; flex-direction:column; gap:var(--fh-gap);
    box-shadow:0 8px 32px rgba(0,0,0,.45);
  }
  .fh-modal-title  { font-size:1.1rem; font-weight:700; }
  .fh-field        { display:flex; flex-direction:column; gap:5px; }
  .fh-label        { font-size:.8rem; color:var(--fh-text-sec); font-weight:600; }
  .fh-row          { display:flex; gap:var(--fh-gap-sm); }
  .fh-row .fh-field { flex:1; }
  .fh-modal-footer { display:flex; gap:var(--fh-gap-sm); justify-content:flex-end; margin-top:4px; }
  .fh-checkbox-row { display:flex; align-items:center; gap:8px; }
  .fh-checkbox-row input[type=checkbox] { width:17px; height:17px; cursor:pointer; }

  /* Divider */
  .fh-divider { height:1px; background:var(--fh-border); margin:var(--fh-gap-sm) 0; }

  /* Empty state */
  .fh-empty { text-align:center; padding:var(--fh-pad) 0; color:var(--fh-text-sec); font-size:.88rem; }

  /* Header row util */
  .fh-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--fh-gap); }

  /* Scrollable history container */
  .fh-hist-scroll {
    max-height:420px; overflow-y:auto;
    display:flex; flex-direction:column; gap:var(--fh-gap-sm);
  }

  /* Responsive */
  @container fh (min-width: 680px) {
    .fh-store-grid { grid-template-columns:repeat(auto-fill, minmax(170px, 1fr)); }
    .fh-balance    { font-size:4rem; }
  }
  @container fh (min-width: 900px) {
    .fh-balance { font-size:4.8rem; }
  }
`;

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

const ini      = name => (name || "?")[0].toUpperCase();
const fPts     = n => (n || 0).toLocaleString();
const fUSD     = n => `$${(n || 0).toFixed(2)}`;
const cap      = s => s ? s[0].toUpperCase() + s.slice(1) : "";
const slug     = s => (s || "").toLowerCase().replace(/\s+/g, "_");

/**
 * Escape all five HTML special characters for safe innerHTML injection.
 * Use this for ALL user-supplied text rendered into the DOM to prevent XSS.
 */
const escHTML  = s => String(s || "").replace(/[&<>'"]/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));

/** Alias kept for HTML attribute contexts (values inside quotes) */
const escAttr  = escHTML;

/** Convert days_delta integer to a human label */
function daysLabel(d) {
    if (d < -1) return `${Math.abs(d)}d overdue`;
    if (d === -1) return "1d overdue";
    if (d === 0) return "Today";
    if (d === 1) return "Tomorrow";
    return `In ${d}d`;
}

/** CSS color for a days_delta value */
function daysLabelColor(d) {
    if (d < 0)  return "var(--fh-overdue)";
    if (d <= 7) return "var(--fh-warning)";
    return "var(--fh-success)";
}

/** Build <option> string from [{value, label}] array */
function opts(arr, current) {
    return arr.map(o =>
        `<option value="${o.value}" ${o.value === current ? "selected" : ""}>${o.label}</option>`
    ).join("");
}

/** Render weekday chip checkboxes with a shared CSS class for reading */
function weekdayChips(checkedDays, cbClass) {
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
 * e.g. "2h ago", "3d ago", "just now"
 */
function relTime(ts) {
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

// ---------------------------------------------------------------------------
// Main card class
// ---------------------------------------------------------------------------

class FamilyHubCard extends HTMLElement {

    // ---- HA card API --------------------------------------------------------

    static getStubConfig() { return { mode: "command_center" }; }
    static getConfigElement() { return document.createElement("family-hub-card-editor"); }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Config & HA state
        this._cfg    = {};
        this._hass   = null;

        // Dirty-check: entityId → last_updated timestamp
        this._lastKeys = {};

        // UI state
        this._modal        = null;  // { type, data } — null = closed
        this._filter       = null;  // command_center person filter (person_id)
        this._tab          = "tasks";
        this._adminSec     = "overview";
        this._flashing     = new Set();  // task_ids currently animating
        this._expandedDescs= new Set();  // chore_ids with description expanded

        // History log filter — person_id or null (= All)
        this._histFilter   = null;

        // Chores person filter — person_id or null (= All)
        this._choreFilter  = null;

        // Drag-to-reorder state
        this._dragId       = null;
        this._dragOverId   = null;
        this._sortedChores = [];  // populated during chore section render

        // AbortController for event listener cleanup
        this._abortCtrl    = null;
    }

    // ---- Web Component lifecycle --------------------------------------------

    /**
     * connectedCallback — attach ALL event listeners ONCE.
     *
     * The root cause of the v0.2.2 memory leak was calling addEventListener()
     * on every _doRender(). This is the correct Web Component pattern:
     *   - Attach in connectedCallback, remove in disconnectedCallback.
     *   - Use AbortController signal so all listeners are torn down in one call.
     *   - _doRender() NEVER touches event listeners.
     */
    connectedCallback() {
        this._abortCtrl = new AbortController();
        const { signal } = this._abortCtrl;
        const root = this.shadowRoot;

        // ---- Delegated click handler ----------------------------------------
        root.addEventListener("click", e => {
            const el = e.target.closest("[data-act]");
            if (!el) return;
            this._dispatch(el.dataset.act, el);
        }, { signal });

        // ---- Change handler -------------------------------------------------
        root.addEventListener("change", e => {
            const t = e.target;

            // Inline toggle: show dollar value to kids
            if (t.dataset.act === "toggle-dollar") {
                this._svc("update_settings", { show_dollar_value_to_kids: t.checked });
                return;
            }
            // "Everyone" checkbox: sync all individual person checkboxes AND their chip labels
            if (t.id === "m-everyone") {
                root.querySelectorAll(".m-assign-person").forEach(cb => {
                    cb.checked = t.checked;
                    cb.closest(".fh-person-cb-chip")?.classList.toggle("checked", t.checked);
                });
            }
            // Individual person checkbox unchecked: uncheck Everyone
            if (t.classList.contains("m-assign-person") && !t.checked) {
                const ev = root.getElementById("m-everyone");
                if (ev) ev.checked = false;
            }
            // Weekday chip visual feedback
            if (t.classList.contains("m-wd-day") || t.classList.contains("m-df-day")) {
                t.closest(".fh-wd-chip")?.classList.toggle("checked", t.checked);
            }
            // Person cb chip visual feedback
            if (t.classList.contains("m-assign-person") || t.classList.contains("m-sp-person")) {
                t.closest(".fh-person-cb-chip")?.classList.toggle("checked", t.checked);
            }
            // Sync conditional modal fields after any change
            this._syncModalUI();
        }, { signal });

        // ---- Drag-to-reorder handlers ---------------------------------------
        root.addEventListener("dragstart", e => {
            const row = e.target.closest("[data-drag-id]");
            if (!row) return;
            this._dragId = row.dataset.dragId;
            e.dataTransfer.effectAllowed = "move";
            // Slight delay so the drag image captures the row before we grey it
            setTimeout(() => row.classList.add("fh-dragging"), 0);
        }, { signal });

        root.addEventListener("dragover", e => {
            const row = e.target.closest("[data-drag-id]");
            if (!row || row.dataset.dragId === this._dragId) return;
            e.preventDefault();
            root.querySelectorAll(".fh-drag-over")
                .forEach(el => el.classList.remove("fh-drag-over"));
            row.classList.add("fh-drag-over");
            this._dragOverId = row.dataset.dragId;
        }, { signal });

        root.addEventListener("dragleave", e => {
            const row = e.target.closest("[data-drag-id]");
            if (row) row.classList.remove("fh-drag-over");
        }, { signal });

        root.addEventListener("drop", e => {
            e.preventDefault();
            root.querySelectorAll(".fh-drag-over, .fh-dragging")
                .forEach(el => el.classList.remove("fh-drag-over", "fh-dragging"));
            const dragId = this._dragId;
            const overId = this._dragOverId;
            this._dragId = this._dragOverId = null;
            if (!dragId || !overId || dragId === overId) return;

            const sorted  = this._sortedChores;
            const overIdx = sorted.findIndex(c => c.chore_id === overId);
            if (overIdx < 0) return;

            // Build the list as it will look after the drop (dragged item removed)
            const without  = sorted.filter(c => c.chore_id !== dragId);
            const insertAt = without.findIndex(c => c.chore_id === overId);

            let before, after;
            if (insertAt < 0) {
                // overId not found in without — shouldn't happen, bail
                return;
            }
            // Allow drop AFTER the target when it is the last item in the list
            const isLast = (insertAt === without.length - 1);
            if (isLast) {
                // Place dragged item at the very end
                before   = without[insertAt].sort_order;
                after    = before + 20;
            } else {
                before   = without[insertAt - 1]?.sort_order ?? (without[insertAt].sort_order - 20);
                after    = without[insertAt].sort_order;
            }

            let newOrder = (before + after) / 2;

            // If gap has compressed below useful threshold, reindex the whole list
            const GAP_THRESHOLD = 0.01;
            if (Math.abs(after - newOrder) < GAP_THRESHOLD || Math.abs(newOrder - before) < GAP_THRESHOLD) {
                const reindexed = without.map((c, i) => ({ ...c, sort_order: (i + 1) * 10 }));
                const rBefore   = reindexed[insertAt - 1]?.sort_order ?? 0;
                const rAfter    = reindexed[insertAt]?.sort_order ?? (rBefore + 20);
                newOrder        = (rBefore + rAfter) / 2;
                reindexed.forEach(c => {
                    if (c.chore_id !== dragId) {
                        this._svc("update_chore", { chore_id: c.chore_id, sort_order: c.sort_order });
                    }
                });
            }

            this._svc("update_chore", { chore_id: dragId, sort_order: newOrder });
        }, { signal });

        root.addEventListener("dragend", e => {
            root.querySelectorAll(".fh-drag-over, .fh-dragging")
                .forEach(el => el.classList.remove("fh-drag-over", "fh-dragging"));
            this._dragId = this._dragOverId = null;
        }, { signal });
    }

    disconnectedCallback() {
        // Remove ALL event listeners in one call
        this._abortCtrl?.abort();
        this._abortCtrl = null;
    }

    setConfig(cfg) {
        const modes = ["command_center", "personal", "maintenance", "admin"];
        if (!cfg.mode) throw new Error("Family Hub: 'mode' is required");
        if (!modes.includes(cfg.mode)) throw new Error(`Family Hub: mode must be one of ${modes.join(", ")}`);
        if (cfg.mode === "personal" && !cfg.person) throw new Error("Family Hub: 'person' is required for personal mode");
        this._cfg = cfg;
        this._doRender(true);
    }

    set hass(hass) {
        this._hass = hass;
        this._maybeRender();
    }

    getCardSize() { return 5; }

    // ---- Dirty-check --------------------------------------------------------

    /**
     * Only re-renders when Family Hub sensor data actually changed.
     * Suppressed entirely while a modal is open to prevent destroying user input.
     */
    _maybeRender() {
        if (!this._hass) return;
        if (this._modal) return; // Never re-render while modal is open

        const states  = this._hass.states;
        let changed   = false;

        // Use last_updated (not last_changed): attributes only bump last_updated
        for (const id of FH_SENSORS) {
            const ts = states[id]?.last_updated;
            if (ts !== this._lastKeys[id]) { this._lastKeys[id] = ts; changed = true; }
        }

        // Also track per-person sensors
        for (const p of (states["sensor.family_hub_needs_attention"]?.attributes?.people || [])) {
            const id = `sensor.family_hub_${slug(p.name)}`;
            const ts = states[id]?.last_updated;
            if (ts !== this._lastKeys[id]) { this._lastKeys[id] = ts; changed = true; }
        }

        if (changed) this._doRender(false);
    }

    // ---- Render core --------------------------------------------------------

    /**
     * Rebuilds the shadow DOM.
     * Does NOT touch event listeners — that is connectedCallback's job.
     * Modal is appended as a separate DOM node so background re-renders
     * never destroy an open modal.
     */
    _doRender(force = false) {
        if (!this._hass && !force) return;

        const styleEl       = document.createElement("style");
        styleEl.textContent = CSS;

        const card      = document.createElement("div");
        card.className  = "fh-card";

        if (!this._hass) {
            card.innerHTML = `<div class="fh-empty">Loading…</div>`;
        } else {
            // Redirect stale "people" tab from v0.2.2 to overview
            if (this._adminSec === "people") this._adminSec = "overview";

            switch (this._cfg.mode) {
                case "command_center": card.innerHTML = this._htmlCC();          break;
                case "personal":       card.innerHTML = this._htmlPersonal();    break;
                case "maintenance":    card.innerHTML = this._htmlMaintenance(); break;
                case "admin":          card.innerHTML = this._htmlAdmin();       break;
            }
        }

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(styleEl);
        this.shadowRoot.appendChild(card);

        if (this._modal) {
            this.shadowRoot.appendChild(this._buildModal());
        }

        // Sync conditional modal UI (recurrence fields, penalty, scope, etc.)
        this._syncModalUI();
    }

    // ---- Sensor data accessors ----------------------------------------------

    _states(id)  { return this._hass?.states?.[id]; }
    _attrs(id)   { return this._states(id)?.attributes || {}; }
    _people()    { return this._attrs("sensor.family_hub_needs_attention").people || []; }

    _findPerson(nameOrId) {
        const lc = (nameOrId || "").toLowerCase();
        return this._people().find(p =>
            p.name.toLowerCase() === lc || p.person_id === nameOrId
        ) || null;
    }

    _personEntityId(name) { return `sensor.family_hub_${slug(name)}`; }

    // ---- Service calls ------------------------------------------------------

    _svc(service, data) {
        if (!this._hass) return;
        this._hass.callService(DOMAIN, service, data);
    }

    // ---- MODE: Command Center -----------------------------------------------

    _htmlCC() {
        const clAttr    = this._attrs("sensor.family_hub_claimable_tasks");
        const naAttr    = this._attrs("sensor.family_hub_needs_attention");
        const people    = this._people();
        const allTasks  = clAttr.all_tasks || [];
        const claimable = clAttr.tasks     || [];
        const famName   = naAttr.family_name || "Family Hub";

        const chips = people.map(p => `
      <div class="fh-chip ${this._filter === p.person_id ? "active" : ""}"
           style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
           data-act="filter" data-pid="${p.person_id}">
        <span class="fh-chip-dot"></span>${escHTML(p.name)}
      </div>`).join("");

        const filtered = this._filter
            ? allTasks.filter(t => t.assigned_to === this._filter)
            : allTasks;

        const taskRows = [
            ...filtered.filter(t => t.days_delta < 0).map(t => this._ccTaskRow(t, people, true)),
            ...filtered.filter(t => t.days_delta === 0).map(t => this._ccTaskRow(t, people, false)),
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

    _ccTaskRow(t, people, isOverdue) {
        const p     = people.find(x => x.person_id === t.assigned_to);
        const color = p?.avatar_color || DEFAULT_COLOR;
        const flash = this._flashing.has(t.task_id) ? "flash" : "";
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

    // ---- MODE: Personal Dashboard -------------------------------------------

    _htmlPersonal() {
        const person = this._findPerson(this._cfg.person);
        if (!person) return `<div class="fh-empty">Person "${this._cfg.person}" not found.<br>Check spelling in card config.</div>`;

        const eid     = this._personEntityId(person.name);
        const attr    = this._attrs(eid);
        const balance = parseInt(this._states(eid)?.state || "0");
        const color   = person.avatar_color || DEFAULT_COLOR;

        const tabBar = ["tasks", "store"].map(t => `
      <div class="fh-tab ${this._tab === t ? "active" : ""}"
           data-act="tab" data-tab="${t}">${cap(t)}</div>`).join("");

        let content = "";
        if (this._tab === "tasks") content = this._htmlPersonalTasks(attr, color, person, balance);
        if (this._tab === "store") content = this._htmlPersonalStore(attr, color, person, balance);

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

    _htmlPersonalTasks(attr, color, person) {
        const rawDue    = attr.tasks_due_today_list    || [];
        const rawOverdue= attr.tasks_overdue_list      || [];
        const pending   = attr.tasks_pending_approval_list || [];

        // ---- BUG FIX: Collapse multiple instances of the same chore to one row.
        // For each chore_id, keep only the row with the oldest/worst due state.
        // Overdue rows are deduplicated keeping the most-overdue one.
        // Due-today rows are deduplicated keeping the first (already sorted by name).
        const collapseByChore = (rows, pickFn) => {
            const seen = new Map();
            for (const t of rows) {
                const key = t.chore_id;
                if (!seen.has(key) || pickFn(t, seen.get(key))) seen.set(key, t);
            }
            return [...seen.values()];
        };
        // For overdue, keep the one with more days overdue (larger days_overdue)
        const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
        // For due today, just deduplicate (keep first occurrence per chore)
        const allDue  = collapseByChore(rawDue, () => false);

        // Separate reminders from regular tasks.
        // TODO (Phase 3-C): Add chore_type to the personal sensor task payload so this
        // heuristic can be replaced with a reliable `t.chore_type === "reminder"` check.
        // Current heuristic: 0 pts + no penalty + no approval_required = reminder-like.
        // Risk: a legitimate 0-pt assigned chore with no penalty will be styled as a reminder.
        const isReminderTask = t => !t.points && !t.penalty_enabled && !t.approval_required;
        const dueReminders = allDue.filter(t => isReminderTask(t));
        // Main task list excludes reminders so they don't appear in category groups
        const due = allDue.filter(t => !isReminderTask(t));

        // ---- Group due-today tasks by category_label
        // Overdue always floats above groups. Items with no label → "Today" group.
        // Reminders are excluded from these groups (rendered separately below).
        const groups = new Map();
        for (const t of due) {
            const key = t.category_label || "Today";
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(t);
        }

        // Build expiry badge helper.
        // Uses due_date + expires_after_days to calculate actual days remaining.
        // due_date is the task's generation date for one-time tasks (backend sets
        // due_date = created_at date for one-time instances), so expiry date =
        // due_date + expires_after_days. Show badge only when ≤ 2 days remain.
        const expiryBadge = t => {
            if (!t.expires_after_days || !t.due_date) return "";
            const due        = new Date(t.due_date);
            const expiresOn  = new Date(due);
            expiresOn.setDate(expiresOn.getDate() + t.expires_after_days);
            const today      = new Date();
            today.setHours(0, 0, 0, 0);
            expiresOn.setHours(0, 0, 0, 0);
            const daysLeft   = Math.round((expiresOn - today) / 86400000);
            if (daysLeft > 2) return "";
            if (daysLeft <= 0) return `<span class="fh-badge fh-badge-expiry">Expires today</span>`;
            return `<span class="fh-badge fh-badge-expiry">Expires in ${daysLeft}d</span>`;
        };

        const mkRow = (t, isOverdue) => {
            const flash      = this._flashing.has(t.task_id) ? "flash" : "";
            const descExp    = this._expandedDescs.has(t.task_id);
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

        // Pending-approval rows (awaiting parent decision)
        const pendingRows = pending.map(t => `
      <div class="fh-task-row" style="--row-color:${color}">
        <span class="fh-task-name">${escHTML(t.name)}</span>
        ${t.points ? `<span class="fh-badge fh-badge-pts" style="--row-color:${color}">${t.points}pts</span>` : ""}
        <span class="fh-badge fh-badge-pending">Awaiting approval</span>
      </div>`).join("");

        // Build overdue section (always at top, no group headers)
        const overdueSection = overdue.length
            ? overdue.map(t => mkRow(t, true)).join("")
            : "";

        // Build due-today sections grouped by category_label
        const dueSection = [...groups.entries()].map(([label, tasks]) => `
      <div class="fh-section-title">${escHTML(label)}</div>
      <div class="fh-task-list">
        ${tasks.map(t => mkRow(t, false)).join("")}
      </div>`).join("");

        const empty = !due.length && !overdue.length && !pending.length && !dueReminders.length;

        // Build reminders section — separate, lighter styling, below main tasks
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

    _htmlPersonalStore(attr, color, person, balance) {
        const items = attr.store_items || [];
        if (!items.length) return `<div class="fh-empty">No rewards in the store yet.</div>`;

        // Gather pending redemptions for this person to show "Requested" badge.
        // Primary match: item_id (precise). Fallback: item_name (for queue entries
        // that pre-date the item_id field). item_id match takes priority so similarly-
        // named items (e.g. "Gift Card $10" vs "Gift Card $20") are not conflated.
        const pendingRedemptions = this._attrs("sensor.family_hub_needs_attention").redemption_queue || [];
        const personPending      = pendingRedemptions.filter(r => r.person_id === person.person_id);
        const pendingByItemId    = new Set(personPending.map(r => r.item_id).filter(Boolean));
        // Only use name matching when no item_id was recorded on the redemption entry
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

    // ---- MODE: Maintenance --------------------------------------------------

    _htmlMaintenance() {
        const attr  = this._attrs("sensor.family_hub_maintenance_due");
        const items = attr.items || [];

        const rows = items.map(item => {
            const cls = item.days_delta < 0 ? "overdue" : item.days_delta <= 7 ? "soon" : "ok";
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
          ${this._expandedDescs.has(item.task_id)
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

    // ---- MODE: Admin --------------------------------------------------------

    _htmlAdmin() {
        const attr      = this._attrs("sensor.family_hub_needs_attention");
        const people    = attr.people          || [];
        const approvals = attr.approval_queue  || [];
        const redemptions = attr.redemption_queue || [];
        const chores    = attr.active_chores   || [];
        const catLabels = attr.category_labels || [];
        const famName   = attr.family_name     || "Family Hub";
        const actionCount = approvals.length + redemptions.length;

        const sections = [
            { id: "overview",    label: "Overview",   badge: 0 },
            { id: "approvals",   label: "Approvals",  badge: approvals.length },
            { id: "redemptions", label: "Redeem",     badge: redemptions.length },
            { id: "chores",      label: "Chores",     badge: 0 },
            { id: "settings",    label: "Settings",   badge: 0 },
        ];

        const nav = `
      <div class="fh-tabs" style="flex-wrap:wrap">
        ${sections.map(s => `
          <div class="fh-tab ${this._adminSec === s.id ? "active" : ""}"
               data-act="admin-sec" data-sec="${s.id}" style="flex:1 0 auto">
            ${s.label}
            ${s.badge > 0 ? `<span class="fh-tab-badge"></span>` : ""}
          </div>`).join("")}
      </div>`;

        let body = "";
        switch (this._adminSec) {
            case "overview":    body = this._htmlAdminOverview(people, attr);                       break;
            case "approvals":   body = this._htmlAdminApprovals(approvals, attr);                   break;
            case "redemptions": body = this._htmlAdminRedemptions(redemptions, attr);               break;
            case "chores":      body = this._htmlAdminChores(chores, people, catLabels);            break;
            case "settings":    body = this._htmlAdminSettings(attr);                               break;
        }

        return `
      <div class="fh-hdr">
        <span class="fh-title" style="margin:0">${escHTML(famName)} — Admin</span>
        ${actionCount ? `<span class="fh-badge fh-badge-overdue">${actionCount} need action</span>` : ""}
      </div>
      ${nav}
      ${body}`;
    }

    _htmlAdminOverview(people, attr) {
        const ppdollar = attr.points_per_dollar || 10;

        const rows = people.map(p => {
            const color = p.avatar_color || DEFAULT_COLOR;
            return `
        <div class="fh-point-row">
          <div class="fh-avatar" style="background:${color}">${ini(p.name)}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:.9rem">${escHTML(p.name)}
              <span style="font-size:.75rem;color:var(--fh-text-sec);font-weight:400">
                (${cap(p.type)})
              </span>
            </div>
            <div style="font-size:.75rem;color:var(--fh-text-sec)">
              ${fPts(p.points_balance)}pts · ${fUSD(p.points_balance / ppdollar)} · lifetime ${fPts(p.points_lifetime)}
            </div>
          </div>
          <button class="fh-btn fh-btn-success fh-btn-sm"
                  data-act="open-award" data-pid="${p.person_id}"
                  data-pname="${escAttr(p.name)}" title="Award points">
            ${I.award}
          </button>
          <button class="fh-btn fh-btn-danger fh-btn-sm"
                  data-act="open-deduct" data-pid="${p.person_id}"
                  data-pname="${escAttr(p.name)}" title="Deduct points">
            ${I.minus}
          </button>
          <button class="fh-btn fh-btn-ghost fh-btn-sm"
                  data-act="open-edit-person" data-pid="${p.person_id}"
                  data-pname="${escAttr(p.name)}" data-ptype="${p.type}"
                  data-pcolor="${p.avatar_color || DEFAULT_COLOR}" title="Edit person">
            ${I.edit}
          </button>
          <button class="fh-btn fh-btn-ghost fh-btn-sm"
                  data-act="open-confirm-remove-person" data-pid="${p.person_id}"
                  data-pname="${escAttr(p.name)}" title="Remove person">
            ${I.remove}
          </button>
        </div>`;
        }).join("") || `<div class="fh-empty">No people found.</div>`;

        return `
      <div class="fh-section-title">Point balances</div>
      <div class="fh-task-list">${rows}</div>

      <!-- Add task: large prominent button (redesigned for v0.4.0) -->
      <div style="margin-top:var(--fh-gap)">
        <button class="fh-btn fh-btn-primary fh-btn-lg" data-act="open-add-task"
                style="width:100%;justify-content:center">
          ${I.plus} Add task
        </button>
      </div>

      <!-- Secondary admin actions -->
      <div style="margin-top:var(--fh-gap-sm);display:flex;gap:var(--fh-gap-sm);flex-wrap:wrap">
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-add-person">
          ${I.person} Add person
        </button>
      </div>`;
    }

    /**
     * Approvals tab — v0.4.0 layout:
     * Section 1: Pending approvals (existing approve / deny)
     * Section 2: History log with action buttons based on reversible field
     */
    _htmlAdminApprovals(approvals, attr) {
        const historyLog = attr.history_log || [];
        const people     = attr.people      || [];

        // ---- Section 1: Pending approvals -----------------------------------
        const approvalRows = approvals.map(a => {
            const color = a.person_color || DEFAULT_COLOR;
            return `
            <div class="fh-queue-row">
              <div class="fh-avatar" style="background:${color}">${ini(a.person_name)}</div>
              <div class="fh-queue-info">
                <div class="fh-queue-name">${escHTML(a.chore_name)}</div>
                <div class="fh-queue-meta">${escHTML(a.person_name)} · ${a.chore_points}pts</div>
              </div>
              <div class="fh-queue-btns">
                <button class="fh-btn fh-btn-success fh-btn-sm"
                        data-act="approve-task" data-tid="${a.task_id}">${I.check}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm"
                        data-act="deny-task" data-tid="${a.task_id}">${I.close}</button>
              </div>
            </div>`;
        }).join("") || `<div class="fh-empty">No pending approvals. ✓</div>`;

        // ---- Section 2: History log ----------------------------------------
        // Person filter chips for log
        const histFilterChips = `
      <div class="fh-chips" style="margin-bottom:var(--fh-gap-sm)">
        <div class="fh-chip ${!this._histFilter ? "active" : ""}"
             data-act="hist-filter" data-hpid="">All</div>
        ${people.map(p => `
          <div class="fh-chip ${this._histFilter === p.person_id ? "active" : ""}"
               style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
               data-act="hist-filter" data-hpid="${p.person_id}">
            <span class="fh-chip-dot"></span>${escHTML(p.name)}
          </div>`).join("")}
      </div>`;

        // Filter and render history rows
        const filtered = this._histFilter
            ? historyLog.filter(e => e.person_id === this._histFilter)
            : historyLog;

        // The first parent person_id is used for admin actions
        const firstParent = people.find(p => p.type === "parent");

        const histRows = filtered.map(e => {
            const meta    = HISTORY_META[e.type] || { label: e.type, color: "var(--fh-text-sec)" };
            const color   = e.person_color || DEFAULT_COLOR;
            const ptsDelta= e.points_delta
                ? `<span style="color:${e.points_delta > 0 ? "var(--fh-success)" : "var(--fh-overdue)"}">
                     ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
                   </span>`
                : "";

            // Build action button based on reversible field
            let actionBtn = "";
            if (e.reversible === "excuse" && firstParent) {
                actionBtn = `<button class="fh-btn fh-btn-warning fh-btn-sm"
                                     data-act="excuse-task"
                                     data-iid="${e.reference_id}"
                                     data-excused-by="${firstParent.person_id}"
                                     title="Reverse penalty for this skipped task">
                               ${I.excuse} Excuse
                             </button>`;
            } else if (e.reversible === "mark_complete" && firstParent) {
                actionBtn = `<button class="fh-btn fh-btn-success fh-btn-sm"
                                     data-act="mark-complete"
                                     data-iid="${e.reference_id}"
                                     data-marked-by="${firstParent.person_id}"
                                     title="Retroactively mark as done and award points">
                               ${I.check} Mark done
                             </button>`;
            } else if (e.reversible === "reject" && firstParent) {
                actionBtn = `<button class="fh-btn fh-btn-danger fh-btn-sm"
                                     data-act="reject-task"
                                     data-iid="${e.reference_id}"
                                     data-rejected-by="${firstParent.person_id}"
                                     title="Claw back points for this task">
                               ${I.close} Reject
                             </button>`;
            }

            return `
          <div class="fh-hist-row" style="--hist-color:${meta.color}">
            <div class="fh-avatar" style="background:${color};width:22px;height:22px;font-size:.62rem">
              ${e.person_name ? ini(e.person_name) : "—"}
            </div>
            <div class="fh-hist-info">
              <div class="fh-hist-label">${escHTML(meta.label)}</div>
              <div class="fh-hist-name">${escHTML(e.chore_name || e.note || "")}</div>
              <div class="fh-hist-meta">
                ${e.person_name ? escHTML(e.person_name) + " · " : ""}${relTime(e.timestamp)}
                ${ptsDelta}
              </div>
            </div>
            ${actionBtn ? `<div class="fh-hist-actions">${actionBtn}</div>` : ""}
          </div>`;
        }).join("") || `<div class="fh-empty">No history entries yet.</div>`;

        return `
      <div class="fh-section-title">Pending approvals</div>
      <div class="fh-task-list">${approvalRows}</div>

      <div class="fh-divider"></div>
      <div class="fh-hdr" style="margin-bottom:var(--fh-gap-sm)">
        <span class="fh-section-title" style="margin:0">History log</span>
        <span style="font-size:.75rem;color:var(--fh-text-sec)">Last 30 days</span>
      </div>
      ${histFilterChips}
      <div class="fh-hist-scroll">${histRows}</div>`;
    }

    /**
     * Redemptions tab — v0.4.0 layout:
     * Section 1: Pending redemptions (existing approve / decline)
     * Section 2: Store inventory — all active items with edit/delete
     *   + "Add reward" button (moved from Overview)
     */
    _htmlAdminRedemptions(redemptions, attr) {
        const storeItems = attr.store_items || [];
        const people     = attr.people      || [];

        // ---- Section 1: Pending redemptions ---------------------------------
        const redemptionRows = redemptions.map(r => {
            const color = r.person_color || DEFAULT_COLOR;
            return `
            <div class="fh-queue-row">
              <div class="fh-avatar" style="background:${color}">${ini(r.person_name)}</div>
              <div class="fh-queue-info">
                <div class="fh-queue-name">${escHTML(r.item_name)}</div>
                <div class="fh-queue-meta">${escHTML(r.person_name)} · ${fPts(r.points_cost)}pts</div>
              </div>
              <div class="fh-queue-btns">
                <button class="fh-btn fh-btn-success fh-btn-sm"
                        data-act="approve-redemption" data-rid="${r.redemption_id}">${I.check}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm"
                        data-act="decline-redemption" data-rid="${r.redemption_id}">${I.close}</button>
              </div>
            </div>`;
        }).join("") || `<div class="fh-empty">No pending redemptions. ✓</div>`;

        // ---- Section 2: Store inventory -------------------------------------
        // Note: store items do not have a sort_order field in the backend (Phase 3-C).
        // Items are shown in creation order. Drag-to-reorder is not available here.
        const storeRows = storeItems.map(item => {
            const personNames = (item.person_ids || [])
                .map(id => people.find(p => p.person_id === id)?.name)
                .filter(Boolean)
                .join(", ");

            return `
          <div class="fh-store-inv-row">
            <div class="fh-store-inv-info">
              <div class="fh-store-inv-name">${escHTML(item.name)}</div>
              <div class="fh-store-inv-meta">
                ${fUSD(item.dollar_value)} · ${fPts(item.points_cost)}pts ·
                ${item.scope === "personal"
                    ? `Personal${personNames ? ` (${escHTML(personNames)})` : ""}`
                    : "All kids"}
              </div>
            </div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm"
                    data-act="open-edit-store-item"
                    data-iid="${item.item_id}"
                    title="Edit reward">
              ${I.edit}
            </button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="delete-store-item"
                    data-iid="${item.item_id}" data-iname="${escAttr(item.name)}"
                    title="Delete reward">
              ${I.trash}
            </button>
          </div>`;
        }).join("") || `<div class="fh-empty">No store items yet.</div>`;

        return `
      <div class="fh-section-title">Pending redemptions</div>
      <div class="fh-task-list">${redemptionRows}</div>

      <div class="fh-divider"></div>
      <div class="fh-hdr">
        <span class="fh-section-title" style="margin:0">Store inventory</span>
        <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="open-add-store-item">
          ${I.plus} Add reward
        </button>
      </div>
      <div class="fh-task-list">${storeRows}</div>`;
    }

    /**
     * Chores tab — v0.4.0 adds person filter chips at top.
     */
    _htmlAdminChores(chores, people, catLabels) {
        // Store for drag-drop reference — chores already sorted by sort_order, name
        this._sortedChores = chores;

        // ---- Person filter chips -------------------------------------------
        const filterChips = `
      <div class="fh-chips" style="margin-bottom:var(--fh-gap-sm)">
        <div class="fh-chip ${!this._choreFilter ? "active" : ""}"
             data-act="chore-filter" data-cpid="">All</div>
        ${people.map(p => `
          <div class="fh-chip ${this._choreFilter === p.person_id ? "active" : ""}"
               style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
               data-act="chore-filter" data-cpid="${p.person_id}">
            <span class="fh-chip-dot"></span>${escHTML(p.name)}
          </div>`).join("")}
      </div>`;

        // Apply person filter
        const visibleChores = this._choreFilter
            ? chores.filter(c => (c.assigned_to || []).includes(this._choreFilter))
            : chores;

        const addBtn = `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--fh-gap-sm)">
        <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="open-add-chore">
          ${I.plus} Add chore
        </button>
      </div>`;

        if (!visibleChores.length) {
            return `
          ${filterChips}
          ${addBtn}
          <div class="fh-empty">
            ${this._choreFilter ? "No chores assigned to this person." : "No active chores. Add one above."}
          </div>`;
        }

        // Group by category_label (empty label → "Uncategorized")
        const groups = new Map();
        for (const c of visibleChores) {
            const key = c.category_label || "Uncategorized";
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(c);
        }

        const sections = [...groups.entries()].map(([label, list]) => {
            const rows = list.map(c => {
                // Build multi-avatar for assigned people
                const assignedPeople = (c.assigned_to || [])
                    .map(id => people.find(p => p.person_id === id))
                    .filter(Boolean);
                const avatarHtml = assignedPeople.length
                    ? `<div class="fh-avatars">${assignedPeople.map(p =>
                        `<div class="fh-avatar" style="background:${p.avatar_color || DEFAULT_COLOR};width:22px;height:22px;font-size:.62rem">${ini(p.name)}</div>`
                      ).join("")}</div>`
                    : "";

                const descExp    = this._expandedDescs.has(c.chore_id);
                const rowColor   = assignedPeople[0]?.avatar_color || DEFAULT_COLOR;
                const recType    = c.recurrence?.type || "daily";
                const recLabel   = {
                    daily:           "Daily",
                    weekly:          "Weekly",
                    every_n_days:    `Every ${c.recurrence?.interval||2}d`,
                    every_n_weeks:   `Every ${c.recurrence?.interval||2}wk`,
                    monthly_on_date: "Monthly",
                    one_time:        "One-time",
                }[recType] || recType;

                // Expiry label for chores that have expires_after_days set
                const expiryLabel = c.expires_after_days
                    ? `<span class="fh-badge fh-badge-expiry" style="margin-left:4px">Expires in ${c.expires_after_days}d</span>`
                    : "";

                return `
          <div class="fh-task-row" style="--row-color:${rowColor}"
               draggable="true" data-drag-id="${c.chore_id}">
            <span class="fh-drag-handle" title="Drag to reorder">⠿</span>
            ${avatarHtml}
            <div class="fh-task-body">
              <span class="fh-task-name">${escHTML(c.name)}</span>
              ${descExp && c.description
                  ? `<span class="fh-desc-inline">${escHTML(c.description)}</span>`
                  : ""}
              <span class="fh-task-sub">${recLabel}${c.penalty_enabled ? ` · -${c.penalty_points}pts penalty` : ""}</span>
            </div>
            ${c.description
                ? `<button class="fh-desc-btn" data-act="toggle-desc" data-id="${c.chore_id}"
                           title="Toggle description">?</button>`
                : ""}
            ${expiryLabel}
            <span class="fh-badge fh-badge-pts" style="--row-color:${rowColor}">${c.points}pts</span>
            <button class="fh-btn fh-btn-ghost fh-btn-sm"
                    data-act="open-edit-chore" data-cid="${c.chore_id}"
                    title="Edit chore">${I.edit}</button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="delete-chore"
                    data-cid="${c.chore_id}" data-cname="${escAttr(c.name)}"
                    title="Delete chore">${I.trash}</button>
          </div>`;
            }).join("");

            return `
        <div class="fh-section-title">${escHTML(label)}</div>
        <div class="fh-task-list">${rows}</div>`;
        }).join("");

        return `
      ${filterChips}
      ${addBtn}
      ${sections}`;
    }

    _htmlAdminSettings(attr) {
        const famName   = attr.family_name         || "Family Hub";
        const ppdollar  = attr.points_per_dollar   || 10;
        const showDollar= attr.show_dollar_value_to_kids || false;
        const catLabels = attr.category_labels     || [];

        const labelChips = catLabels.map(l => `
      <div class="fh-cat-chip">
        <span>${escHTML(l)}</span>
        <button class="fh-cat-chip-del" data-act="remove-cat-label"
                data-label="${escAttr(l)}" title="Remove">×</button>
      </div>`).join("");

        return `
      <div class="fh-task-list">
        <div class="fh-toggle-row">
          <span style="font-size:.9rem">Show dollar value to kids</span>
          <label class="fh-toggle">
            <input type="checkbox" data-act="toggle-dollar" ${showDollar ? "checked" : ""}>
            <span class="fh-toggle-slider"></span>
          </label>
        </div>

        <div class="fh-point-row">
          <div style="flex:1;min-width:0">
            <div style="font-size:.9rem;font-weight:600">${escHTML(famName)}</div>
            <div style="font-size:.75rem;color:var(--fh-text-sec)">${ppdollar} points per dollar</div>
          </div>
          <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-settings"
                  data-fname="${escAttr(famName)}" data-ppd="${ppdollar}">
            ${I.settings} Edit
          </button>
        </div>

        <div class="fh-divider"></div>

        <div>
          <div class="fh-label" style="margin-bottom:6px">Category labels</div>
          <div class="fh-cat-labels" style="margin-bottom:8px">
            ${labelChips || `<span style="font-size:.82rem;color:var(--fh-text-sec)">No labels yet.</span>`}
          </div>
          <div class="fh-row" style="gap:6px">
            <input class="fh-input" id="cat-label-input" type="text"
                   placeholder="New label…" style="flex:1">
            <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="add-cat-label">
              ${I.plus} Add
            </button>
          </div>
        </div>

        <div class="fh-divider"></div>

        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="export-backup"
                style="width:100%;justify-content:center">
          Export backup
        </button>
      </div>`;
    }

    // ---- Modal builder ------------------------------------------------------

    /**
     * Builds the modal overlay as a real DOM node appended to the shadow root.
     * It is NEVER part of the main card innerHTML, so background re-renders
     * never destroy it.
     */
    _buildModal() {
        const bg       = document.createElement("div");
        bg.className   = "fh-modal-bg";
        bg.innerHTML   = this._modalHTML();
        bg.addEventListener("click", e => {
            if (e.target === bg) this._closeModal();
        });
        return bg;
    }

    _modalHTML() {
        if (!this._modal) return "";
        const { type, data } = this._modal;
        switch (type) {
            case "award":
            case "deduct":              return this._mPointAdjust(this._modal);
            case "add-task":            return this._mAddTask(this._modal);
            case "add-chore":           return this._mChoreForm(null, false);
            case "edit-chore":          return this._mChoreForm(data.chore, true);
            case "add-store-item":      return this._mAddStoreItem(this._modal);
            case "edit-store-item":     return this._mEditStoreItem(this._modal);
            case "add-person":          return this._mAddPerson(this._modal);
            case "edit-person":         return this._mEditPerson(this._modal);
            case "edit-settings":       return this._mEditSettings(this._modal);
            case "claim":               return this._mClaim(this._modal);
            case "add-reminder":        return this._mAddReminder(this._modal);
            case "confirm-remove-person": return this._mConfirmRemovePerson(this._modal);
            default:                    return "";
        }
    }

    _mWrap(title, body, okLabel, okAct, okClass = "fh-btn-primary") {
        return `
      <div class="fh-modal">
        <div class="fh-modal-title">${title}</div>
        ${body}
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn ${okClass}" data-act="${okAct}">${okLabel}</button>
        </div>
      </div>`;
    }

    _mPointAdjust(m) {
        const isAward = m.type === "award";
        return this._mWrap(
            `${isAward ? "Award" : "Deduct"} points — ${m.data.pname}`,
            `<div class="fh-field">
         <label class="fh-label">Amount</label>
         <div class="fh-row">
           <input class="fh-input" id="m-amount" type="number" min="0.01" step="any"
                  placeholder="e.g. 50 or 2.50" autofocus style="flex:2">
           <select class="fh-select" id="m-atype" style="flex:1">
             <option value="points">pts</option>
             <option value="dollars">$ USD</option>
           </select>
         </div>
       </div>
       <div class="fh-field">
         <label class="fh-label">Reason (optional)</label>
         <input class="fh-input" id="m-reason" type="text" placeholder="e.g. Helped with dinner">
       </div>
       <input type="hidden" id="m-pid"   value="${m.data.pid}">
       <input type="hidden" id="m-amode" value="${m.type}">`,
            isAward ? "Award" : "Deduct",
            "ok-point-adjust",
            isAward ? "fh-btn-success" : "fh-btn-danger"
        );
    }

    /**
     * Add task modal — v0.4.0 expanded with chore type selector.
     * - Assigned: person checkboxes, expires_after_days (optional), penalty option
     * - Claimable: expires_after_days (required), no assigned_to
     * - Reminder: name + person + recurrence only
     */
    _mAddTask(m) {
        const people = this._people();
        return this._mWrap("Add task",
            `<!-- Chore type selector -->
       <div class="fh-field">
         <label class="fh-label">Task type</label>
         <select class="fh-select" id="m-tasktype">
           <option value="assigned">Assigned — give to specific people</option>
           <option value="claimable">Claimable — first come first served bonus</option>
           <option value="reminder">Reminder — no points, just a nudge</option>
         </select>
       </div>

       <!-- Name (all types) -->
       <div class="fh-field">
         <label class="fh-label">Task name *</label>
         <input class="fh-input" id="m-tname" type="text" autofocus>
       </div>

       <div class="fh-field">
         <label class="fh-label">Description (optional)</label>
         <input class="fh-input" id="m-tdesc" type="text" placeholder="More detail…">
       </div>

       <!-- Assigned section -->
       <div id="m-task-assigned-section">
         <div class="fh-field">
           <label class="fh-label">Assign to (select all that apply)</label>
           ${this._multiPersonCheckboxes(people, [], "m-tp-person")}
         </div>
         <div class="fh-row">
           <div class="fh-field">
             <label class="fh-label">Points</label>
             <input class="fh-input" id="m-tpts" type="number" min="0" value="10">
           </div>
           <div class="fh-field" style="justify-content:flex-end">
             <div class="fh-checkbox-row" style="margin-top:auto;padding-bottom:9px">
               <input type="checkbox" id="m-tappr">
               <label for="m-tappr" style="font-size:.85rem">Needs approval</label>
             </div>
           </div>
         </div>
         <div class="fh-field">
           <label class="fh-label">Expires after (days, optional)</label>
           <input class="fh-input" id="m-texpiry" type="number" min="1"
                  placeholder="Leave blank = no expiry">
         </div>
         <div class="fh-checkbox-row">
           <input type="checkbox" id="m-tpenalty">
           <label for="m-tpenalty" style="font-size:.88rem">Apply penalty if not completed before expiry</label>
         </div>
         <div id="m-task-penalty-section" class="fh-field" style="display:none">
           <label class="fh-label">Penalty points</label>
           <input class="fh-input" id="m-tpenalty-pts" type="number" min="1" value="5">
         </div>
       </div>

       <!-- Claimable section -->
       <div id="m-task-claimable-section" style="display:none">
         <div class="fh-row">
           <div class="fh-field">
             <label class="fh-label">Points reward</label>
             <input class="fh-input" id="m-tcpts" type="number" min="0" value="20">
           </div>
           <div class="fh-field">
             <label class="fh-label">Expires after (days) *</label>
             <input class="fh-input" id="m-tcexpiry" type="number" min="1" value="7">
           </div>
         </div>
       </div>

       <!-- Reminder section -->
       <div id="m-task-reminder-section" style="display:none">
         <div class="fh-row">
           <div class="fh-field">
             <label class="fh-label">Who?</label>
             <select class="fh-select" id="m-trperson">
               ${people.map(p => `<option value="${p.person_id}">${escHTML(p.name)}</option>`).join("")}
             </select>
           </div>
           <div class="fh-field">
             <label class="fh-label">Recurrence</label>
             <select class="fh-select" id="m-trrec">
               ${opts([
                   { value: "daily",           label: "Daily" },
                   { value: "weekly",          label: "Weekly" },
                   { value: "every_n_days",    label: "Every N days" },
                   { value: "monthly_on_date", label: "Monthly" },
               ], "daily")}
             </select>
           </div>
         </div>
       </div>`,
            "Add task", "ok-add-task");
    }

    /**
     * Shared chore form for both Add and Edit.
     * chore = null for add mode, full chore object for edit mode.
     */
    _mChoreForm(chore, isEdit) {
        const people    = this._people();
        const catLabels = this._attrs("sensor.family_hub_needs_attention").category_labels || [];
        const c         = chore || {};
        const rec       = c.recurrence || {};
        const recType   = rec.type || "daily";
        const assigned  = c.assigned_to || [];
        const title     = isEdit ? `Edit — ${c.name}` : "Add chore";
        const okAct     = isEdit ? "ok-edit-chore" : "ok-add-chore";

        return this._mWrap(title,
            `${isEdit ? `<input type="hidden" id="m-cid" value="${c.chore_id}">` : ""}
       <div class="fh-field">
         <label class="fh-label">Chore name *</label>
         <input class="fh-input" id="m-cname" type="text" value="${escAttr(c.name || "")}" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Description (optional)</label>
         <input class="fh-input" id="m-cdesc" type="text"
                value="${escAttr(c.description || "")}" placeholder="More detail…">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Chore type</label>
           <select class="fh-select" id="m-ctype">
             ${opts([
                 { value: "assigned",  label: "Assigned" },
                 { value: "claimable", label: "Claimable (bonus)" },
                 { value: "reminder",  label: "Reminder" },
             ], c.chore_type || "assigned")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Category label</label>
           <select class="fh-select" id="m-clabel">
             <option value="">— None —</option>
             ${catLabels.map(l =>
                 `<option value="${escAttr(l)}" ${l === c.category_label ? "selected" : ""}>${l}</option>`
             ).join("")}
           </select>
         </div>
       </div>
       <div class="fh-field">
         <label class="fh-label">Assign to</label>
         <div class="fh-checkbox-row" style="margin-bottom:4px">
           <input type="checkbox" id="m-everyone">
           <label for="m-everyone" style="font-size:.85rem;font-weight:600;cursor:pointer">Everyone</label>
         </div>
         ${this._multiPersonCheckboxes(people, assigned, "m-assign-person")}
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Points</label>
           <input class="fh-input" id="m-cpts" type="number" min="0"
                  value="${c.points !== undefined ? c.points : 10}">
         </div>
         <div class="fh-field">
           <label class="fh-label">Recurrence</label>
           <select class="fh-select" id="m-crec">
             ${opts([
                 { value: "daily",           label: "Daily" },
                 { value: "weekly",          label: "Weekly" },
                 { value: "every_n_days",    label: "Every N days" },
                 { value: "every_n_weeks",   label: "Every N weeks" },
                 { value: "monthly_on_date", label: "Monthly" },
                 { value: "one_time",        label: "One-time" },
             ], recType)}
           </select>
         </div>
       </div>

       <!-- Day filter: shown for daily recurrence -->
       <div id="m-dayfilter-section" class="fh-field" style="display:none">
         <label class="fh-label">Restrict to days (leave empty = every day)</label>
         <div class="fh-weekday-row">
           ${weekdayChips(rec.day_filter || [], "m-df-day")}
         </div>
       </div>

       <!-- Weekday selector: shown for weekly / every_n_weeks -->
       <div id="m-weekdays-section" class="fh-field" style="display:none">
         <label class="fh-label">Day(s) of week</label>
         <div class="fh-weekday-row">
           ${weekdayChips(rec.weekdays || [], "m-wd-day")}
         </div>
       </div>

       <!-- Interval N: shown for every_n_days / every_n_weeks -->
       <div id="m-interval-section" class="fh-field" style="display:none">
         <label class="fh-label">Every N <span id="m-interval-unit">days</span></label>
         <input class="fh-input" id="m-interval" type="number" min="1"
                value="${rec.interval || 2}">
       </div>

       <!-- Day of month: shown for monthly_on_date -->
       <div id="m-dom-section" class="fh-field" style="display:none">
         <label class="fh-label">Day of month (1–31)</label>
         <input class="fh-input" id="m-dom" type="number" min="1" max="31"
                value="${rec.day_of_month || 1}">
       </div>

       <!-- Expiry (for claimable or one-time) -->
       <div id="m-chore-expiry-section" class="fh-field" style="display:none">
         <label class="fh-label">Expires after (days)</label>
         <input class="fh-input" id="m-cexpiry" type="number" min="1"
                value="${c.expires_after_days || ""}">
       </div>

       <div class="fh-divider"></div>
       <div class="fh-checkbox-row">
         <input type="checkbox" id="m-cappr"
                ${(c.approval_required !== false) ? "checked" : ""}>
         <label for="m-cappr" style="font-size:.88rem">Requires parent approval</label>
       </div>
       <div class="fh-checkbox-row">
         <input type="checkbox" id="m-cpenalty"
                ${c.penalty_enabled ? "checked" : ""}>
         <label for="m-cpenalty" style="font-size:.88rem">Apply penalty points if skipped</label>
       </div>

       <!-- Penalty points: shown when penalty checkbox is checked -->
       <div id="m-penalty-pts-section" class="fh-field" style="display:none">
         <label class="fh-label">Penalty points</label>
         <input class="fh-input" id="m-cpenalty-pts" type="number" min="1"
                value="${c.penalty_points || 5}">
       </div>`,
            isEdit ? "Save changes" : "Add chore",
            okAct
        );
    }

    _mAddStoreItem(m) {
        const people = this._people();
        return this._mWrap("Add reward item",
            `<div class="fh-field">
         <label class="fh-label">Item name *</label>
         <input class="fh-input" id="m-sname" type="text" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Description (optional)</label>
         <input class="fh-input" id="m-sdesc" type="text">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Dollar value *</label>
           <input class="fh-input" id="m-sdollar" type="number" min="0.01"
                  step="0.01" placeholder="e.g. 5.00">
         </div>
         <div class="fh-field">
           <label class="fh-label">Scope</label>
           <select class="fh-select" id="m-sscope">
             <option value="common">All kids</option>
             <option value="personal">Specific people</option>
           </select>
         </div>
       </div>
       <div id="m-sperson-section" class="fh-field" style="display:none">
         <label class="fh-label">Who can see this reward?</label>
         ${this._multiPersonCheckboxes(people, [], "m-sp-person")}
       </div>`,
            "Add reward", "ok-add-store-item");
    }

    _mEditStoreItem(m) {
        const people = this._people();
        const item   = m.data.item;
        return this._mWrap(`Edit — ${item.name}`,
            `<input type="hidden" id="m-eiid" value="${item.item_id}">
       <div class="fh-field">
         <label class="fh-label">Item name *</label>
         <input class="fh-input" id="m-sname" type="text" value="${escAttr(item.name)}" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Description (optional)</label>
         <input class="fh-input" id="m-sdesc" type="text" value="${escAttr(item.description || "")}">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Dollar value *</label>
           <input class="fh-input" id="m-sdollar" type="number" min="0.01"
                  step="0.01" value="${item.dollar_value}">
         </div>
         <div class="fh-field">
           <label class="fh-label">Scope</label>
           <select class="fh-select" id="m-sscope">
             <option value="common" ${item.scope === "common" ? "selected" : ""}>All kids</option>
             <option value="personal" ${item.scope === "personal" ? "selected" : ""}>Specific people</option>
           </select>
         </div>
       </div>
       <div id="m-sperson-section" class="fh-field" style="${item.scope === "personal" ? "" : "display:none"}">
         <label class="fh-label">Who can see this reward?</label>
         ${this._multiPersonCheckboxes(people, item.person_ids || [], "m-sp-person")}
       </div>`,
            "Save changes", "ok-edit-store-item");
    }

    _mAddPerson(m) {
        return this._mWrap("Add person",
            `<div class="fh-field">
         <label class="fh-label">Name *</label>
         <input class="fh-input" id="m-pname" type="text" autofocus>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Type</label>
           <select class="fh-select" id="m-ptype">
             <option value="kid">Kid</option>
             <option value="parent">Parent</option>
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Avatar colour</label>
           <input class="fh-input" id="m-pcolor" type="color"
                  value="${DEFAULT_COLOR}" style="height:42px;padding:4px">
         </div>
       </div>`,
            "Add person", "ok-add-person");
    }

    _mEditPerson(m) {
        const d = m.data;
        return this._mWrap(`Edit — ${d.pname}`,
            `<div class="fh-field">
         <label class="fh-label">Name *</label>
         <input class="fh-input" id="m-pname" type="text" value="${escAttr(d.pname)}" autofocus>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Type</label>
           <select class="fh-select" id="m-ptype">
             <option value="kid"    ${d.ptype === "kid"    ? "selected" : ""}>Kid</option>
             <option value="parent" ${d.ptype === "parent" ? "selected" : ""}>Parent</option>
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Avatar colour</label>
           <input class="fh-input" id="m-pcolor" type="color"
                  value="${d.pcolor}" style="height:42px;padding:4px">
         </div>
       </div>
       <input type="hidden" id="m-pid" value="${d.pid}">`,
            "Save", "ok-edit-person");
    }

    _mEditSettings(m) {
        const d = m.data;
        return this._mWrap("Edit settings",
            `<div class="fh-field">
         <label class="fh-label">Family name</label>
         <input class="fh-input" id="m-fname" type="text"
                value="${escAttr(d.fname)}" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Points per dollar</label>
         <input class="fh-input" id="m-ppd" type="number" min="1" value="${d.ppd}">
       </div>`,
            "Save", "ok-edit-settings");
    }

    _mClaim(m) {
        const people = this._people();
        return this._mWrap(`Claim — ${m.data.name}`,
            `<div class="fh-field">
         <label class="fh-label">Who is claiming?</label>
         <select class="fh-select" id="m-clperson">
           ${people.map(p => `<option value="${p.person_id}">${escHTML(p.name)}</option>`).join("")}
         </select>
       </div>
       <input type="hidden" id="m-cltid" value="${m.data.tid}">`,
            "Claim", "ok-claim");
    }

    _mAddReminder(m) {
        const people = this._people();
        return this._mWrap("Add personal reminder",
            `<div class="fh-field">
         <label class="fh-label">Reminder name *</label>
         <input class="fh-input" id="m-rname" type="text" autofocus
                placeholder="e.g. Take vitamins, Feed the dog">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Who?</label>
           <select class="fh-select" id="m-rperson">
             ${people.map(p =>
                 `<option value="${p.person_id}"
                          ${m.data?.pid === p.person_id ? "selected" : ""}>${escHTML(p.name)}</option>`
             ).join("")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Recurrence</label>
           <select class="fh-select" id="m-rrec">
             ${opts([
                 { value: "daily",           label: "Daily" },
                 { value: "weekly",          label: "Weekly" },
                 { value: "every_n_days",    label: "Every N days" },
                 { value: "monthly_on_date", label: "Monthly" },
             ], "daily")}
           </select>
         </div>
       </div>`,
            "Add", "ok-add-reminder");
    }

    _mConfirmRemovePerson(m) {
        return `
      <div class="fh-modal">
        <div class="fh-modal-title">Remove ${m.data.pname}?</div>
        <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0;line-height:1.5">
          This will deactivate <strong>${m.data.pname}</strong> and remove their pending tasks.
          Historical data and point history are preserved.
          This cannot be undone from the card.
        </p>
        <input type="hidden" id="m-rpid" value="${m.data.pid}">
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn fh-btn-danger" data-act="ok-remove-person">
            Remove ${m.data.pname}
          </button>
        </div>
      </div>`;
    }

    // ---- Person checkbox helper ---------------------------------------------

    /**
     * Render a list of person chip checkboxes.
     * @param {Array}  people      - All people from sensor
     * @param {Array}  selectedIds - Pre-selected person_ids
     * @param {string} cbClass     - CSS class to put on each <input> for bulk reading
     */
    _multiPersonCheckboxes(people, selectedIds, cbClass) {
        if (!people.length) return `<span style="font-size:.82rem;color:var(--fh-text-sec)">No people found.</span>`;
        return `<div class="fh-person-cb-list">
          ${people.map(p => {
              const checked  = (selectedIds || []).includes(p.person_id);
              const color    = p.avatar_color || DEFAULT_COLOR;
              return `<label class="fh-person-cb-chip ${checked ? "checked" : ""}"
                             style="--chip-color:${color}">
                <input type="checkbox" class="${cbClass}"
                       value="${p.person_id}" ${checked ? "checked" : ""}>
                <span class="fh-avatar" style="background:${color};width:18px;height:18px;font-size:.6rem">
                  ${ini(p.name)}
                </span>
                ${escHTML(p.name)}
              </label>`;
          }).join("")}
        </div>`;
    }

    /**
     * Read all checked checkboxes with a given class.
     * Returns an array of their values.
     */
    _selectedPersonIds(cbClass) {
        return Array.from(
            this.shadowRoot.querySelectorAll(`.${cbClass}:checked`)
        ).map(cb => cb.value);
    }

    // ---- Sync conditional modal UI ------------------------------------------

    /**
     * Called after every _doRender and every change event.
     * Shows/hides conditional form sections without re-rendering the whole card.
     * Safe to call even when no modal is open.
     */
    _syncModalUI() {
        const sr   = this.shadowRoot;
        const show = id => { const el = sr.getElementById(id); if (el) el.style.display = ""; };
        const hide = id => { const el = sr.getElementById(id); if (el) el.style.display = "none"; };

        // ---- Add task modal: show sections by task type ----------------------
        const taskTypeEl = sr.getElementById("m-tasktype");
        if (taskTypeEl) {
            const tt = taskTypeEl.value;
            if (tt === "assigned")  { show("m-task-assigned-section");  hide("m-task-claimable-section"); hide("m-task-reminder-section"); }
            if (tt === "claimable") { hide("m-task-assigned-section");  show("m-task-claimable-section"); hide("m-task-reminder-section"); }
            if (tt === "reminder")  { hide("m-task-assigned-section");  hide("m-task-claimable-section"); show("m-task-reminder-section"); }
        }

        // ---- Add task: penalty points field inside assigned section ----------
        const taskPenEl  = sr.getElementById("m-tpenalty");
        const taskPenSec = sr.getElementById("m-task-penalty-section");
        if (taskPenEl && taskPenSec) {
            taskPenSec.style.display = taskPenEl.checked ? "" : "none";
        }

        // ---- Chore form: recurrence conditional fields ----------------------
        const recEl = sr.getElementById("m-crec");
        if (recEl) {
            const rec = recEl.value;
            hide("m-dayfilter-section");
            hide("m-weekdays-section");
            hide("m-interval-section");
            hide("m-dom-section");
            hide("m-chore-expiry-section");

            if (rec === "daily")                                show("m-dayfilter-section");
            if (rec === "weekly" || rec === "every_n_weeks")    show("m-weekdays-section");
            if (rec === "every_n_days" || rec === "every_n_weeks") show("m-interval-section");
            if (rec === "monthly_on_date")                      show("m-dom-section");
            // Show expiry for one-time and claimable chores
            const ctypeEl = sr.getElementById("m-ctype");
            const isClaimOrOneTime = rec === "one_time" || ctypeEl?.value === "claimable";
            if (isClaimOrOneTime) show("m-chore-expiry-section");

            const unitEl = sr.getElementById("m-interval-unit");
            if (unitEl) unitEl.textContent = rec === "every_n_weeks" ? "weeks" : "days";
        }

        // ---- Chore form: penalty points field --------------------------------
        const penaltyEl  = sr.getElementById("m-cpenalty");
        const penaltySec = sr.getElementById("m-penalty-pts-section");
        if (penaltyEl && penaltySec) {
            penaltySec.style.display = penaltyEl.checked ? "" : "none";
        }

        // ---- Store scope person checkboxes -----------------------------------
        const scopeEl     = sr.getElementById("m-sscope");
        const personSecEl = sr.getElementById("m-sperson-section");
        if (scopeEl && personSecEl) {
            personSecEl.style.display = scopeEl.value === "personal" ? "" : "none";
        }
    }

    // ---- Modal close --------------------------------------------------------

    _closeModal() {
        this._modal = null;
        this._doRender(true);
    }

    // ---- Event dispatcher ---------------------------------------------------

    _dispatch(act, el) {
        const sr  = this.shadowRoot;
        const v   = id => sr.getElementById(id)?.value ?? "";
        const b   = id => sr.getElementById(id)?.checked ?? false;
        const int = id => parseInt(v(id) || "0");

        switch (act) {

            // ---- Navigation ------------------------------------------------
            case "filter":
                this._filter = this._filter === el.dataset.pid ? null : el.dataset.pid;
                this._doRender(true);
                break;

            case "tab":
                this._tab = el.dataset.tab;
                this._doRender(true);
                break;

            case "admin-sec":
                this._adminSec = el.dataset.sec;
                this._doRender(true);
                break;

            // ---- History log person filter ----------------------------------
            case "hist-filter":
                this._histFilter = el.dataset.hpid || null;
                this._doRender(true);
                break;

            // ---- Chores person filter ----------------------------------------
            case "chore-filter":
                this._choreFilter = el.dataset.cpid || null;
                this._doRender(true);
                break;

            // ---- Task completion -------------------------------------------
            case "complete": {
                const tid = el.dataset.tid;
                const pid = el.dataset.pid;
                if (!tid || !pid) break;
                this._svc("complete_task", { task_id: tid, person_id: pid });
                this._flashing.add(tid);
                this._doRender(true);
                // After the CSS animation finishes, physically remove the row so the
                // flex gap collapses cleanly (opacity:0 alone leaves a gap in flex layouts).
                setTimeout(() => {
                    this._flashing.delete(tid);
                    // Find and remove the DOM node — if a background re-render already
                    // replaced it, querySelector returns null and we skip safely.
                    const row = this.shadowRoot.querySelector(
                        `[data-tid="${tid}"], [data-act="complete"][data-tid="${tid}"]`
                    )?.closest(".fh-task-row");
                    row?.remove();
                }, FLASH_MS + 50);
                break;
            }

            // ---- Description toggle ----------------------------------------
            case "toggle-desc": {
                const id = el.dataset.id;
                if (this._expandedDescs.has(id)) this._expandedDescs.delete(id);
                else this._expandedDescs.add(id);
                this._doRender(true);
                break;
            }

            // ---- Task/redemption approvals ---------------------------------
            case "approve-task": {
                const parent = this._people().find(p => p.type === "parent");
                this._svc("approve_task", { task_id: el.dataset.tid, approved_by: parent?.person_id || "" });
                break;
            }
            case "deny-task": {
                const parent = this._people().find(p => p.type === "parent");
                this._svc("deny_task",    { task_id: el.dataset.tid, denied_by: parent?.person_id || "" });
                break;
            }
            case "approve-redemption": {
                const parent = this._people().find(p => p.type === "parent");
                this._svc("approve_redemption", { redemption_id: el.dataset.rid, approved_by: parent?.person_id || "" });
                break;
            }
            case "decline-redemption": {
                const parent = this._people().find(p => p.type === "parent");
                this._svc("decline_redemption", { redemption_id: el.dataset.rid, declined_by: parent?.person_id || "" });
                break;
            }

            // ---- v0.4.0 Admin correction actions ---------------------------
            case "excuse-task":
                this._svc("excuse_task", {
                    instance_id: el.dataset.iid,
                    excused_by:  el.dataset.excusedBy,
                    reason: "",
                });
                break;
            case "mark-complete":
                this._svc("mark_task_complete", {
                    instance_id: el.dataset.iid,
                    marked_by:   el.dataset.markedBy,
                    reason: "",
                });
                break;
            case "reject-task":
                this._svc("reject_task", {
                    instance_id: el.dataset.iid,
                    rejected_by: el.dataset.rejectedBy,
                    reason: "",
                });
                break;

            // ---- Store redemption request ----------------------------------
            case "redeem":
                this._svc("request_redemption", { person_id: el.dataset.pid, item_id: el.dataset.iid });
                break;

            // ---- Delete chore ----------------------------------------------
            case "delete-chore":
                if (!confirm(`Delete "${el.dataset.cname}"?\n\nThis cannot be undone.`)) break;
                this._svc("delete_chore", { chore_id: el.dataset.cid });
                break;

            // ---- Delete store item -----------------------------------------
            case "delete-store-item":
                if (!confirm(`Delete reward "${el.dataset.iname}"?\n\nThis cannot be undone.`)) break;
                this._svc("delete_store_item", { item_id: el.dataset.iid });
                break;

            // ---- Category label management (inline settings) ---------------
            case "remove-cat-label": {
                const labelToRemove = el.dataset.label;
                const current = this._attrs("sensor.family_hub_needs_attention").category_labels || [];
                this._svc("update_settings", { category_labels: current.filter(l => l !== labelToRemove) });
                break;
            }
            case "add-cat-label": {
                const input    = sr.getElementById("cat-label-input");
                const newLabel = input?.value?.trim();
                if (!newLabel) break;
                const current  = this._attrs("sensor.family_hub_needs_attention").category_labels || [];
                if (!current.includes(newLabel)) {
                    this._svc("update_settings", { category_labels: [...current, newLabel] });
                }
                if (input) input.value = "";
                break;
            }

            // ---- Backup ----------------------------------------------------
            case "export-backup":
                this._svc("export_backup", {});
                break;

            // ---- Open modals -----------------------------------------------
            case "open-award":
                this._modal = { type: "award",  data: { pid: el.dataset.pid, pname: el.dataset.pname } };
                this._doRender(true);
                break;
            case "open-deduct":
                this._modal = { type: "deduct", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
                this._doRender(true);
                break;
            case "open-add-task":
                this._modal = { type: "add-task", data: {} };
                this._doRender(true);
                break;
            case "open-add-chore":
                this._modal = { type: "add-chore", data: {} };
                this._doRender(true);
                break;
            case "open-edit-chore": {
                const chores = this._attrs("sensor.family_hub_needs_attention").active_chores || [];
                const chore  = chores.find(c => c.chore_id === el.dataset.cid);
                if (!chore) break;
                this._modal = { type: "edit-chore", data: { chore } };
                this._doRender(true);
                break;
            }
            case "open-add-store-item":
                this._modal = { type: "add-store-item", data: {} };
                this._doRender(true);
                break;
            case "open-edit-store-item": {
                // Look up the item from sensor data
                const items = this._attrs("sensor.family_hub_needs_attention").store_items || [];
                const item  = items.find(i => i.item_id === el.dataset.iid);
                if (!item) break;
                this._modal = { type: "edit-store-item", data: { item } };
                this._doRender(true);
                break;
            }
            case "open-add-person":
                this._modal = { type: "add-person", data: {} };
                this._doRender(true);
                break;
            case "open-edit-person":
                this._modal = {
                    type: "edit-person",
                    data: { pid: el.dataset.pid, pname: el.dataset.pname, ptype: el.dataset.ptype, pcolor: el.dataset.pcolor }
                };
                this._doRender(true);
                break;
            case "open-confirm-remove-person":
                this._modal = { type: "confirm-remove-person", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
                this._doRender(true);
                break;
            case "open-edit-settings":
                this._modal = { type: "edit-settings", data: { fname: el.dataset.fname, ppd: el.dataset.ppd } };
                this._doRender(true);
                break;
            case "open-claim":
                this._modal = { type: "claim", data: { tid: el.dataset.tid, name: el.dataset.name } };
                this._doRender(true);
                break;
            case "open-add-reminder":
                this._modal = { type: "add-reminder", data: { pid: el.dataset.pid || null } };
                this._doRender(true);
                break;

            // ---- Close modal -----------------------------------------------
            case "close-modal":
                this._closeModal();
                break;

            // ---- Modal OK handlers -----------------------------------------

            case "ok-point-adjust": {
                const amount = parseFloat(v("m-amount"));
                const atype  = v("m-atype");
                const reason = v("m-reason");
                const pid    = v("m-pid");
                const amode  = v("m-amode");
                if (!amount || amount <= 0) break;
                const data = { person_id: pid, reason };
                if (atype === "dollars") data.dollar_amount = amount;
                else data.points = Math.round(amount);
                this._svc(amode === "award" ? "award_bonus_points" : "deduct_points", data);
                this._closeModal();
                break;
            }

            case "ok-add-task": {
                const taskType = v("m-tasktype") || "assigned";
                const name     = v("m-tname").trim();
                if (!name) break;

                if (taskType === "reminder") {
                    // Route to add_chore with chore_type = reminder
                    this._svc("add_chore", {
                        name,
                        description:       v("m-tdesc").trim() || undefined,
                        chore_type:        "reminder",
                        assigned_to:       [v("m-trperson")].filter(Boolean),
                        recurrence_type:   v("m-trrec"),
                        approval_required: false,
                        points:            0,
                        category_label:    "",
                    });
                } else if (taskType === "claimable") {
                    // Route to add_chore with chore_type = claimable
                    const cpts    = parseInt(v("m-tcpts") || "20");
                    const cexpiry = parseInt(v("m-tcexpiry") || "7");
                    this._svc("add_chore", {
                        name,
                        description:       v("m-tdesc").trim() || undefined,
                        chore_type:        "claimable",
                        points:            cpts,
                        approval_required: false,
                        recurrence_type:   "one_time",
                        expires_after_days: cexpiry,
                        category_label:    "Bonus",
                    });
                } else {
                    // Assigned one-time task via add_task service
                    const assigned = this._selectedPersonIds("m-tp-person");
                    const expiry   = parseInt(v("m-texpiry") || "0");
                    const penaltyEnabled = b("m-tpenalty");
                    const penaltyPts     = parseInt(v("m-tpenalty-pts") || "0");
                    const data = {
                        name,
                        description:       v("m-tdesc").trim() || undefined,
                        assigned_to:       assigned,
                        points:            int("m-tpts"),
                        approval_required: b("m-tappr"),
                    };
                    if (expiry > 0)          data.expires_after_days = expiry;
                    // Note: add_task doesn't accept penalty_enabled directly —
                    // it routes to async_add_chore internally. For penalty support
                    // on one-time tasks, use add_chore. We call add_task here for
                    // simplicity; penalty won't apply unless set via chore form.
                    this._svc("add_task", data);
                }
                this._closeModal();
                break;
            }

            case "ok-add-chore":
            case "ok-edit-chore": {
                const name = v("m-cname").trim();
                if (!name) break;
                const isEdit   = (act === "ok-edit-chore");
                const recType  = v("m-crec");
                const assigned = this._selectedPersonIds("m-assign-person");
                const weekdays = Array.from(sr.querySelectorAll(".m-wd-day:checked")).map(cb => parseInt(cb.value));
                const dayFilter= Array.from(sr.querySelectorAll(".m-df-day:checked")).map(cb => parseInt(cb.value));
                const expiryVal= parseInt(v("m-cexpiry") || "0");

                const data = {
                    name,
                    description:       v("m-cdesc").trim() || undefined,
                    chore_type:        v("m-ctype"),
                    category_label:    v("m-clabel"),
                    assigned_to:       assigned,
                    points:            int("m-cpts"),
                    approval_required: b("m-cappr"),
                    penalty_enabled:   b("m-cpenalty"),
                    penalty_points:    int("m-cpenalty-pts"),
                };
                // Only attach expires_after_days when the expiry section is visible
                // AND the user has entered a value. Never send null — the backend
                // schema rejects it via the service call layer even though vol.Any(None,...)
                // appears to allow it. Omitting the key entirely leaves the existing
                // value unchanged, which is the correct behaviour for recurring chores.
                const expirySection = sr.getElementById("m-chore-expiry-section");
                const expiryVisible = expirySection && expirySection.style.display !== "none";
                if (expiryVisible && expiryVal > 0) data.expires_after_days = expiryVal;

                if (isEdit) {
                    data.chore_id  = v("m-cid");
                    data.weekdays  = weekdays;
                    data.day_filter= dayFilter;
                    if (recType === "every_n_days" || recType === "every_n_weeks")
                        data.interval = Math.max(1, int("m-interval"));
                    data.recurrence = {
                        type:       recType,
                        weekdays,
                        day_filter: dayFilter,
                        interval:   (recType === "every_n_days" || recType === "every_n_weeks")
                                        ? Math.max(1, int("m-interval")) : 1,
                        ...(recType === "monthly_on_date"
                                ? { day_of_month: Math.max(1, Math.min(31, int("m-dom"))) }
                                : {}),
                    };
                    // Do not send expires_after_days: null — see comment above.
                } else {
                    data.recurrence_type = recType;
                    if (weekdays.length)  data.weekdays   = weekdays;
                    if (dayFilter.length) data.day_filter = dayFilter;
                    if (recType === "every_n_days" || recType === "every_n_weeks")
                        data.interval = Math.max(1, int("m-interval"));
                    if (recType === "monthly_on_date")
                        data.day_of_month = Math.max(1, Math.min(31, int("m-dom")));
                }

                this._svc(isEdit ? "update_chore" : "add_chore", data);
                this._closeModal();
                break;
            }

            case "ok-add-store-item": {
                const name   = v("m-sname").trim();
                const dollar = parseFloat(v("m-sdollar"));
                if (!name || !dollar || dollar <= 0) break;
                const scope  = v("m-sscope");
                const data   = { name, dollar_value: dollar, scope };
                const desc   = v("m-sdesc").trim();
                if (desc)            data.description = desc;
                if (scope === "personal") data.person_ids = this._selectedPersonIds("m-sp-person");
                this._svc("add_store_item", data);
                this._closeModal();
                break;
            }

            case "ok-edit-store-item": {
                const iid    = v("m-eiid");
                const name   = v("m-sname").trim();
                const dollar = parseFloat(v("m-sdollar"));
                if (!iid || !name || !dollar || dollar <= 0) break;
                const scope  = v("m-sscope");
                const data   = { item_id: iid, name, dollar_value: dollar, scope };
                const desc   = v("m-sdesc").trim();
                if (desc !== undefined) data.description = desc;
                if (scope === "personal") data.person_ids = this._selectedPersonIds("m-sp-person");
                else data.person_ids = [];
                this._svc("update_store_item", data);
                this._closeModal();
                break;
            }

            case "ok-add-person": {
                const name = v("m-pname").trim();
                if (!name) break;
                this._svc("add_person", { name, person_type: v("m-ptype"), avatar_color: v("m-pcolor") });
                this._closeModal();
                break;
            }

            case "ok-edit-person": {
                const name = v("m-pname").trim();
                if (!name) break;
                this._svc("update_person", { person_id: v("m-pid"), name, avatar_color: v("m-pcolor"), type: v("m-ptype") });
                this._closeModal();
                break;
            }

            case "ok-remove-person": {
                const pid = v("m-rpid");
                if (!pid) break;
                this._svc("remove_person", { person_id: pid });
                this._closeModal();
                break;
            }

            case "ok-edit-settings": {
                const fname = v("m-fname").trim();
                const ppd   = parseInt(v("m-ppd") || "10");
                if (!fname) break;
                this._svc("update_settings", { family_name: fname, points_per_dollar: ppd });
                this._closeModal();
                break;
            }

            case "ok-claim": {
                const tid = v("m-cltid");
                const pid = v("m-clperson");
                if (!tid || !pid) break;
                this._svc("claim_task", { task_id: tid, person_id: pid });
                this._closeModal();
                break;
            }

            case "ok-add-reminder": {
                const name = v("m-rname").trim();
                const pid  = v("m-rperson");
                if (!name || !pid) break;
                this._svc("add_chore", {
                    name,
                    chore_type:        "reminder",
                    assigned_to:       [pid],
                    recurrence_type:   v("m-rrec"),
                    approval_required: false,
                    points:            0,
                    category_label:    "",
                });
                this._closeModal();
                break;
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Visual editor element (Lovelace card picker)
// ---------------------------------------------------------------------------

class FamilyHubCardEditor extends HTMLElement {
    setConfig(cfg) { this._cfg = cfg; this._render(); }

    set hass(hass) {
        this._hass   = hass;
        this._people = hass?.states?.["sensor.family_hub_needs_attention"]
            ?.attributes?.people || [];
        this._render();
    }

    _render() {
        const cfg    = this._cfg   || {};
        const people = this._people || [];
        const mode   = cfg.mode    || "command_center";
        const person = cfg.person  || "";

        this.innerHTML = `
      <style>
        .fhe { padding:16px; display:flex; flex-direction:column; gap:14px; }
        .fhe-field { display:flex; flex-direction:column; gap:5px; }
        .fhe-label { font-size:.8rem; font-weight:600; color:var(--secondary-text-color); }
        .fhe-select, .fhe-input {
          padding:9px 11px; border-radius:8px;
          border:1.5px solid var(--divider-color);
          background:var(--card-background-color);
          color:var(--primary-text-color);
          font-size:.9rem; font-family:inherit;
        }
        .fhe-hint { font-size:.78rem; color:var(--secondary-text-color); }
        .fhe-select:focus, .fhe-input:focus { outline:none; border-color:var(--primary-color); }
      </style>
      <div class="fhe">
        <div class="fhe-field">
          <label class="fhe-label">Mode</label>
          <select class="fhe-select" id="e-mode">
            ${[
                ["command_center", "Command Center (kitchen display)"],
                ["personal",       "Personal Dashboard"],
                ["maintenance",    "Maintenance"],
                ["admin",          "Admin Panel"],
            ].map(([v, l]) => `<option value="${v}" ${v === mode ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </div>
        <div class="fhe-field" id="person-field"
             style="display:${mode === "personal" ? "flex" : "none"}">
          <label class="fhe-label">Person</label>
          ${people.length
              ? `<select class="fhe-select" id="e-person">
                   ${people.map(p =>
                       `<option value="${p.name.toLowerCase()}"
                                ${p.name.toLowerCase() === person ? "selected" : ""}>${p.name}</option>`
                   ).join("")}
                 </select>`
              : `<input class="fhe-input" id="e-person" type="text"
                        value="${person}" placeholder="e.g. jackson">`}
          <span class="fhe-hint">Enter the person's name (lowercase)</span>
        </div>
      </div>`;

        this.querySelector("#e-mode")?.addEventListener("change", e => {
            this._cfg = { ...this._cfg, mode: e.target.value };
            if (e.target.value !== "personal") delete this._cfg.person;
            this._fireChange();
            this._render();
        });

        this.querySelector("#e-person")?.addEventListener("change", e => {
            this._cfg = { ...this._cfg, person: e.target.value };
            this._fireChange();
        });
    }

    _fireChange() {
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: this._cfg },
            bubbles: true,
            composed: true,
        }));
    }
}

// ---------------------------------------------------------------------------
// Register both elements
// ---------------------------------------------------------------------------

customElements.define("family-hub-card",        FamilyHubCard);
customElements.define("family-hub-card-editor", FamilyHubCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
    type:         "family-hub-card",
    name:         "Family Hub",
    description:  "Family task management — command center, personal, maintenance, and admin views.",
    preview:      false,
    configurable: true,
});

console.info(
    `%c FAMILY-HUB-CARD %c v${VERSION} `,
    "background:#7F77DD;color:#fff;font-weight:700;border-radius:4px 0 0 4px",
    "background:#1c1c1e;color:#fff;font-weight:400;border-radius:0 4px 4px 0"
);

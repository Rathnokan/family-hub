/**
 * Family Hub — Custom Lovelace Card
 * Version: 0.2.0
 *
 * A single self-contained Web Component that provides four dashboard modes:
 *   - command_center  : Kitchen display — all household tasks, person filter chips
 *   - personal        : Per-person view — point balance, tasks, store, history
 *   - maintenance     : House maintenance + personal reminders
 *   - admin           : Parent controls — approvals, store, chores, settings
 *
 * Usage:
 *   type: custom:family-hub-card
 *   mode: command_center
 *
 *   type: custom:family-hub-card
 *   mode: personal
 *   person: jackson
 *
 * No external dependencies. Reads HA sensor attributes via the websocket.
 * Calls HA services via this.hass.callService().
 */

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

const DOMAIN = "family_hub";
const VERSION = "0.2.0";

const CARD_NAME = "Family Hub";
const EDITOR_NAME = "family-hub-card-editor";

// Default avatar color when none is set
const DEFAULT_COLOR = "#7F77DD";

// How long (ms) to show the success flash on a task row after check-off
const FLASH_DURATION = 1200;

// ---------------------------------------------------------------------------
// CSS — shared design tokens, injected once into the document
// ---------------------------------------------------------------------------

const SHARED_STYLES = `
  /* ---- Design tokens ---- */
  :host {
    --fh-radius:        12px;
    --fh-radius-sm:     8px;
    --fh-radius-chip:   20px;
    --fh-gap:           12px;
    --fh-gap-sm:        8px;
    --fh-gap-xs:        4px;
    --fh-pad:           16px;
    --fh-pad-sm:        12px;
    --fh-pad-xs:        8px;

    /* Surface colours — resolved from active HA theme */
    --fh-bg:            var(--ha-card-background, var(--card-background-color, #fff));
    --fh-surface:       var(--secondary-background-color, #f5f5f5);
    --fh-border:        var(--divider-color, rgba(0,0,0,.12));
    --fh-text:          var(--primary-text-color, #212121);
    --fh-text-sec:      var(--secondary-text-color, #757575);
    --fh-text-dis:      var(--disabled-text-color, #bdbdbd);

    /* Semantic colours */
    --fh-overdue:       #e53935;
    --fh-overdue-bg:    rgba(229,57,53,.10);
    --fh-warning:       #f57c00;
    --fh-warning-bg:    rgba(245,124,0,.10);
    --fh-success:       #43a047;
    --fh-success-bg:    rgba(67,160,71,.12);
    --fh-accent:        var(--primary-color, #7F77DD);

    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    color: var(--fh-text);
  }

  /* ---- Card shell ---- */
  .fh-card {
    background: var(--fh-bg);
    border-radius: var(--ha-card-border-radius, var(--fh-radius));
    padding: var(--fh-pad);
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.10));
    container-type: inline-size;
    container-name: fh;
  }

  /* ---- Typography ---- */
  .fh-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 var(--fh-gap) 0;
    color: var(--fh-text);
  }
  .fh-section-title {
    font-size: .8rem;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--fh-text-sec);
    margin: var(--fh-gap) 0 var(--fh-gap-sm) 0;
  }
  .fh-balance {
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -.02em;
  }
  .fh-balance-unit {
    font-size: 1.2rem;
    font-weight: 400;
    opacity: .7;
    margin-left: 2px;
  }
  .fh-dollar {
    font-size: 1rem;
    color: var(--fh-text-sec);
    margin-top: 2px;
  }

  /* ---- Chip / filter pills ---- */
  .fh-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--fh-gap-sm);
    margin-bottom: var(--fh-gap);
  }
  .fh-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: var(--fh-radius-chip);
    border: 1.5px solid var(--fh-border);
    background: var(--fh-surface);
    font-size: .85rem;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s, border-color .15s, color .15s;
    user-select: none;
    white-space: nowrap;
  }
  .fh-chip:hover { filter: brightness(.95); }
  .fh-chip.active {
    background: var(--person-color, var(--fh-accent));
    border-color: var(--person-color, var(--fh-accent));
    color: #fff;
  }
  .fh-chip-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: currentColor;
    opacity: .8;
  }

  /* ---- Tab bar ---- */
  .fh-tabs {
    display: flex;
    gap: 2px;
    margin-bottom: var(--fh-gap);
    background: var(--fh-surface);
    border-radius: var(--fh-radius-sm);
    padding: 3px;
  }
  .fh-tab {
    flex: 1;
    padding: 7px 10px;
    text-align: center;
    border-radius: 6px;
    font-size: .85rem;
    font-weight: 500;
    cursor: pointer;
    color: var(--fh-text-sec);
    transition: background .15s, color .15s;
    user-select: none;
  }
  .fh-tab.active {
    background: var(--fh-bg);
    color: var(--fh-accent);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
  }

  /* ---- Task rows ---- */
  .fh-task-list { display: flex; flex-direction: column; gap: var(--fh-gap-sm); }
  .fh-task-row {
    display: flex;
    align-items: center;
    gap: var(--fh-gap-sm);
    padding: var(--fh-pad-xs) var(--fh-pad-sm);
    background: var(--fh-surface);
    border-radius: var(--fh-radius-sm);
    border-left: 3px solid var(--person-color, var(--fh-accent));
    transition: opacity .2s, transform .2s;
    position: relative;
    overflow: hidden;
  }
  .fh-task-row.overdue { border-left-color: var(--fh-overdue); }
  .fh-task-row.flash-success {
    animation: fh-flash var(--flash-dur, 1.2s) ease forwards;
  }
  @keyframes fh-flash {
    0%   { background: var(--fh-success-bg); }
    70%  { background: var(--fh-success-bg); }
    100% { background: var(--fh-surface); opacity: 0; transform: scaleY(0); }
  }
  .fh-task-name {
    flex: 1;
    font-size: .92rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fh-task-meta { font-size: .78rem; color: var(--fh-text-sec); }
  .fh-overdue-badge {
    font-size: .72rem;
    font-weight: 600;
    color: var(--fh-overdue);
    background: var(--fh-overdue-bg);
    padding: 2px 7px;
    border-radius: 10px;
    white-space: nowrap;
  }
  .fh-pending-badge {
    font-size: .72rem;
    font-weight: 600;
    color: var(--fh-warning);
    background: var(--fh-warning-bg);
    padding: 2px 7px;
    border-radius: 10px;
    white-space: nowrap;
  }

  /* ---- Points badge ---- */
  .fh-pts-badge {
    font-size: .78rem;
    font-weight: 700;
    color: var(--person-color, var(--fh-accent));
    background: color-mix(in srgb, var(--person-color, var(--fh-accent)) 12%, transparent);
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
  }

  /* ---- Check button ---- */
  .fh-check-btn {
    width: 32px; height: 32px;
    border-radius: 50%;
    border: 2px solid var(--person-color, var(--fh-accent));
    background: transparent;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background .15s, transform .1s;
    color: var(--person-color, var(--fh-accent));
  }
  .fh-check-btn:hover {
    background: color-mix(in srgb, var(--person-color, var(--fh-accent)) 15%, transparent);
    transform: scale(1.1);
  }
  .fh-check-btn:active { transform: scale(.95); }
  .fh-check-btn svg { width: 16px; height: 16px; fill: currentColor; }

  /* ---- Action buttons ---- */
  .fh-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px;
    border-radius: var(--fh-radius-sm);
    border: none;
    font-size: .85rem;
    font-weight: 600;
    cursor: pointer;
    transition: filter .15s, transform .1s;
    user-select: none;
  }
  .fh-btn:hover { filter: brightness(.92); }
  .fh-btn:active { transform: scale(.97); }
  .fh-btn-primary {
    background: var(--fh-accent);
    color: #fff;
  }
  .fh-btn-success {
    background: var(--fh-success);
    color: #fff;
  }
  .fh-btn-danger {
    background: var(--fh-overdue);
    color: #fff;
  }
  .fh-btn-ghost {
    background: var(--fh-surface);
    color: var(--fh-text);
    border: 1.5px solid var(--fh-border);
  }
  .fh-btn-sm {
    padding: 4px 10px;
    font-size: .78rem;
  }
  .fh-btn svg { width: 15px; height: 15px; fill: currentColor; }

  /* ---- Person avatar chip ---- */
  .fh-avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: .78rem;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  /* ---- Store grid ---- */
  .fh-store-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--fh-gap-sm);
  }
  .fh-store-item {
    background: var(--fh-surface);
    border-radius: var(--fh-radius-sm);
    padding: var(--fh-pad-sm);
    display: flex; flex-direction: column; gap: 6px;
  }
  .fh-store-name { font-size: .88rem; font-weight: 600; }
  .fh-store-desc { font-size: .78rem; color: var(--fh-text-sec); }
  .fh-store-price {
    font-size: 1rem; font-weight: 700;
    color: var(--fh-accent);
  }

  /* ---- Admin queue rows ---- */
  .fh-queue-row {
    display: flex;
    align-items: center;
    gap: var(--fh-gap-sm);
    padding: var(--fh-pad-sm);
    background: var(--fh-surface);
    border-radius: var(--fh-radius-sm);
  }
  .fh-queue-info { flex: 1; }
  .fh-queue-name { font-size: .9rem; font-weight: 600; }
  .fh-queue-meta { font-size: .78rem; color: var(--fh-text-sec); }
  .fh-queue-actions { display: flex; gap: var(--fh-gap-sm); }

  /* ---- Point adjustment controls ---- */
  .fh-point-row {
    display: flex;
    align-items: center;
    gap: var(--fh-gap-sm);
    flex-wrap: wrap;
    background: var(--fh-surface);
    border-radius: var(--fh-radius-sm);
    padding: var(--fh-pad-sm);
  }
  .fh-input {
    flex: 1;
    min-width: 80px;
    padding: 7px 10px;
    border-radius: var(--fh-radius-sm);
    border: 1.5px solid var(--fh-border);
    background: var(--fh-bg);
    color: var(--fh-text);
    font-size: .88rem;
    font-family: inherit;
  }
  .fh-input:focus {
    outline: none;
    border-color: var(--fh-accent);
  }
  .fh-select {
    padding: 7px 10px;
    border-radius: var(--fh-radius-sm);
    border: 1.5px solid var(--fh-border);
    background: var(--fh-bg);
    color: var(--fh-text);
    font-size: .88rem;
    font-family: inherit;
    cursor: pointer;
  }
  .fh-select:focus { outline: none; border-color: var(--fh-accent); }

  /* ---- Maintenance rows ---- */
  .fh-maint-row {
    display: flex;
    align-items: center;
    gap: var(--fh-gap-sm);
    padding: var(--fh-pad-xs) var(--fh-pad-sm);
    background: var(--fh-surface);
    border-radius: var(--fh-radius-sm);
    border-left: 3px solid var(--fh-border);
  }
  .fh-maint-row.overdue  { border-left-color: var(--fh-overdue); }
  .fh-maint-row.soon     { border-left-color: var(--fh-warning); }
  .fh-maint-row.upcoming { border-left-color: var(--fh-success); }

  /* ---- Toggle ---- */
  .fh-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--fh-pad-xs) var(--fh-pad-sm);
    background: var(--fh-surface);
    border-radius: var(--fh-radius-sm);
  }
  .fh-toggle-label { font-size: .9rem; }
  .fh-toggle {
    position: relative;
    width: 44px; height: 24px;
    flex-shrink: 0;
  }
  .fh-toggle input { opacity: 0; width: 0; height: 0; }
  .fh-toggle-slider {
    position: absolute; inset: 0;
    background: var(--fh-border);
    border-radius: 24px;
    transition: background .2s;
    cursor: pointer;
  }
  .fh-toggle-slider:before {
    content: '';
    position: absolute;
    width: 18px; height: 18px;
    left: 3px; top: 3px;
    background: #fff;
    border-radius: 50%;
    transition: transform .2s;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }
  .fh-toggle input:checked + .fh-toggle-slider { background: var(--fh-accent); }
  .fh-toggle input:checked + .fh-toggle-slider:before { transform: translateX(20px); }

  /* ---- Header row (personal dashboard) ---- */
  .fh-person-header {
    display: flex;
    align-items: flex-start;
    gap: var(--fh-gap);
    margin-bottom: var(--fh-gap);
    padding: var(--fh-pad);
    background: var(--fh-surface);
    border-radius: var(--fh-radius);
  }
  .fh-person-header-info { flex: 1; }
  .fh-person-name { font-size: 1rem; font-weight: 600; color: var(--fh-text-sec); }

  /* ---- Responsive: wide screens ---- */
  @container fh (min-width: 700px) {
    .fh-store-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
    .fh-balance { font-size: 4rem; }
  }

  /* ---- Empty state ---- */
  .fh-empty {
    text-align: center;
    padding: var(--fh-pad) 0;
    color: var(--fh-text-sec);
    font-size: .88rem;
  }

  /* ---- Modal overlay ---- */
  .fh-modal-bg {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.45);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: var(--fh-pad);
  }
  .fh-modal {
    background: var(--fh-bg);
    border-radius: var(--fh-radius);
    padding: var(--fh-pad);
    width: 100%;
    max-width: 420px;
    max-height: 90vh;
    overflow-y: auto;
    display: flex; flex-direction: column; gap: var(--fh-gap);
  }
  .fh-modal-title { font-size: 1.1rem; font-weight: 700; }
  .fh-modal-row { display: flex; flex-direction: column; gap: 4px; }
  .fh-modal-label { font-size: .82rem; color: var(--fh-text-sec); }
  .fh-modal-actions { display: flex; gap: var(--fh-gap-sm); justify-content: flex-end; }

  /* ---- Divider ---- */
  .fh-divider {
    height: 1px;
    background: var(--fh-border);
    margin: var(--fh-gap-sm) 0;
  }

  /* ---- Loading ---- */
  .fh-loading {
    text-align: center;
    padding: var(--fh-pad);
    color: var(--fh-text-sec);
    font-size: .9rem;
  }
`;

// ---------------------------------------------------------------------------
// SVG icon helpers
// ---------------------------------------------------------------------------
const icon = {
  check: `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
  plus:  `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>`,
  edit:  `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
  store: `<svg viewBox="0 0 24 24"><path d="M20 4H4v2l16-2zm1 5H3l1 11h16l1-11zm-9 8H10v-4h2v4zm0-6H10v-2h2v2z"/></svg>`,
  bell:  `<svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.92V4a1 1 0 1 0-2 0v1.08A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`,
  award: `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  coins: `<svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>`,
  minus: `<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14z"/></svg>`,
  close: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
  settings: `<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/></svg>`,
  wrench: `<svg viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>`,
};

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/** Lighten / alpha-blend a hex color for backgrounds */
function hexAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** First letter of a name as an avatar initial */
function initial(name) {
  return (name || "?").charAt(0).toUpperCase();
}

/** Format points with comma separator */
function fmtPts(n) {
  return (n || 0).toLocaleString();
}

/** Format dollar value */
function fmtDollar(n) {
  return `$${(n || 0).toFixed(2)}`;
}

/** Relative time label: "2 days ago", "today", "in 3 days" */
function daysLabel(daysDelta) {
  if (daysDelta === 0)  return "Today";
  if (daysDelta === -1) return "Yesterday";
  if (daysDelta < 0)   return `${Math.abs(daysDelta)}d overdue`;
  if (daysDelta === 1)  return "Tomorrow";
  return `In ${daysDelta}d`;
}

/** ISO date string → Date object (local) */
function parseDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Capitalize first letter */
function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

// ---------------------------------------------------------------------------
// Main card element
// ---------------------------------------------------------------------------

class FamilyHubCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._activeFilter = null;   // command_center person filter
    this._activeTab    = "tasks"; // personal dashboard tab
    this._adminSection = "overview"; // admin active section
    this._modal        = null;    // { type, data }
    this._flashingTasks = new Set();
  }

  // Called by HA to pass config from the YAML card definition
  setConfig(config) {
    if (!config.mode) throw new Error("Family Hub: 'mode' is required");
    const validModes = ["command_center", "personal", "maintenance", "admin"];
    if (!validModes.includes(config.mode)) {
      throw new Error(`Family Hub: mode must be one of: ${validModes.join(", ")}`);
    }
    if (config.mode === "personal" && !config.person) {
      throw new Error("Family Hub: 'person' is required for mode: personal");
    }
    this._config = config;
    this._render();
  }

  // Called by HA whenever sensor state changes
  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  // HA card size hint
  getCardSize() { return 4; }

  // ------------------------------------------------------------------
  // Data accessors — read from sensor attributes via hass.states
  // ------------------------------------------------------------------

  _state(entityId) {
    return this._hass?.states?.[entityId];
  }

  _attr(entityId) {
    return this._state(entityId)?.attributes || {};
  }

  /** Resolve person entity id from name or id string */
  _personEntityId(nameOrId) {
    const safe = nameOrId.toLowerCase().replace(/\s+/g, "_");
    return `sensor.family_hub_${safe}`;
  }

  /** Get all people from needs_attention sensor */
  _getPeople() {
    return this._attr("sensor.family_hub_needs_attention").people || [];
  }

  /** Find a person record by name (case-insensitive) or id */
  _findPerson(nameOrId) {
    return this._getPeople().find(
      p => p.name.toLowerCase() === nameOrId.toLowerCase() || p.person_id === nameOrId
    ) || null;
  }

  // ------------------------------------------------------------------
  // HA service calls
  // ------------------------------------------------------------------

  _callService(service, data) {
    if (!this._hass) return;
    this._hass.callService(DOMAIN, service, data);
  }

  // ------------------------------------------------------------------
  // Render dispatcher
  // ------------------------------------------------------------------

  _render() {
    if (!this._hass || !this._config.mode) {
      this.shadowRoot.innerHTML = `<style>${SHARED_STYLES}</style><div class="fh-card"><div class="fh-loading">Loading Family Hub…</div></div>`;
      return;
    }

    const style = document.createElement("style");
    style.textContent = SHARED_STYLES;

    const card = document.createElement("div");
    card.className = "fh-card";

    switch (this._config.mode) {
      case "command_center": card.innerHTML = this._renderCommandCenter(); break;
      case "personal":       card.innerHTML = this._renderPersonal();      break;
      case "maintenance":    card.innerHTML = this._renderMaintenance();   break;
      case "admin":          card.innerHTML = this._renderAdmin();         break;
    }

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(card);

    if (this._modal) {
      this.shadowRoot.appendChild(this._buildModal());
    }

    this._attachListeners();
  }

  // ------------------------------------------------------------------
  // MODE: Command Center
  // ------------------------------------------------------------------

  _renderCommandCenter() {
    const attr   = this._attr("sensor.family_hub_claimable_tasks");
    const people = this._getPeople();
    const allTasks    = attr.all_tasks    || [];
    const claimable   = attr.tasks        || [];
    const settings    = this._attr("sensor.family_hub_needs_attention");
    const familyName  = settings.family_name || "Family Hub";

    // Build person filter chips
    const chips = people.map(p => {
      const active = this._activeFilter === p.person_id;
      return `
        <div class="fh-chip ${active ? "active" : ""}"
             style="--person-color:${p.avatar_color || DEFAULT_COLOR}"
             data-action="filter-person" data-person-id="${p.person_id}">
          <span class="fh-chip-dot"></span>
          ${p.name}
        </div>`;
    }).join("");

    // Filter tasks
    const filtered = this._activeFilter
      ? allTasks.filter(t => t.assigned_to === this._activeFilter)
      : allTasks;

    // Group: overdue first, then today's
    const overdueTasks = filtered.filter(t => t.days_delta < 0);
    const todayTasks   = filtered.filter(t => t.days_delta === 0);

    const taskRows = [
      ...overdueTasks.map(t => this._taskRowCC(t, people, true)),
      ...todayTasks.map(t => this._taskRowCC(t, people, false)),
    ].join("") || `<div class="fh-empty">✓ All tasks done!</div>`;

    // Claimable section
    const claimSection = claimable.length > 0 ? `
      <div class="fh-section-title">Available to claim</div>
      <div class="fh-task-list">
        ${claimable.map(t => this._claimableRow(t)).join("")}
      </div>` : "";

    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--fh-gap)">
        <span class="fh-title" style="margin:0">${familyName}</span>
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-action="open-add-task">
          ${icon.plus} Add Task
        </button>
      </div>
      <div class="fh-chips">${chips}</div>
      <div class="fh-task-list" id="cc-tasks">${taskRows}</div>
      ${claimSection}
    `;
  }

  _taskRowCC(task, people, isOverdue) {
    const person  = people.find(p => p.person_id === task.assigned_to);
    const color   = person?.avatar_color || DEFAULT_COLOR;
    const name    = person?.name || "";
    const flash   = this._flashingTasks.has(task.task_id) ? "flash-success" : "";

    return `
      <div class="fh-task-row ${isOverdue ? "overdue" : ""} ${flash}"
           style="--person-color:${color}"
           data-task-id="${task.task_id}">
        <div class="fh-avatar" style="background:${color}">${initial(name)}</div>
        <span class="fh-task-name">${task.name}</span>
        ${isOverdue
          ? `<span class="fh-overdue-badge">${Math.abs(task.days_delta)}d late</span>`
          : ""}
        ${task.points ? `<span class="fh-pts-badge" style="--person-color:${color}">${task.points}pts</span>` : ""}
        <button class="fh-check-btn" style="--person-color:${color}"
                data-action="complete-task"
                data-task-id="${task.task_id}"
                data-person-id="${task.assigned_to}"
                title="Mark done">${icon.check}</button>
      </div>`;
  }

  _claimableRow(task) {
    return `
      <div class="fh-task-row" style="--person-color:${DEFAULT_COLOR}">
        <span class="fh-task-name">${task.name}</span>
        ${task.points ? `<span class="fh-pts-badge">${task.points}pts</span>` : ""}
        <button class="fh-btn fh-btn-primary fh-btn-sm"
                data-action="open-claim"
                data-task-id="${task.task_id}"
                data-task-name="${task.name}">
          Claim
        </button>
      </div>`;
  }

  // ------------------------------------------------------------------
  // MODE: Personal Dashboard
  // ------------------------------------------------------------------

  _renderPersonal() {
    const person = this._findPerson(this._config.person);
    if (!person) {
      return `<div class="fh-loading">Person "${this._config.person}" not found.</div>`;
    }

    const entityId = this._personEntityId(person.name);
    const attr     = this._attr(entityId);
    const balance  = this._state(entityId)?.state || "0";
    const color    = person.avatar_color || DEFAULT_COLOR;

    const showDollar = attr.show_dollar_value === true;
    const dollarVal  = attr.dollar_value || 0;

    const tabs = ["tasks", "store", "history"];
    const tabBar = `
      <div class="fh-tabs">
        ${tabs.map(t => `
          <div class="fh-tab ${this._activeTab === t ? "active" : ""}"
               data-action="set-tab" data-tab="${t}">
            ${cap(t)}
          </div>`).join("")}
      </div>`;

    let content = "";
    if (this._activeTab === "tasks")   content = this._renderPersonalTasks(attr, color, person);
    if (this._activeTab === "store")   content = this._renderPersonalStore(attr, color, person);
    if (this._activeTab === "history") content = this._renderPersonalHistory(person);

    return `
      <div class="fh-person-header" style="border-left:4px solid ${color}">
        <div class="fh-avatar" style="background:${color};width:44px;height:44px;font-size:1.1rem">
          ${initial(person.name)}
        </div>
        <div class="fh-person-header-info">
          <div class="fh-person-name">${person.name}</div>
          <div class="fh-balance" style="color:${color}">
            ${fmtPts(balance)}<span class="fh-balance-unit">pts</span>
          </div>
          ${showDollar ? `<div class="fh-dollar">${fmtDollar(dollarVal)}</div>` : ""}
        </div>
      </div>
      ${tabBar}
      ${content}
    `;
  }

  _renderPersonalTasks(attr, color, person) {
    const dueToday     = attr.tasks_due_today_list     || [];
    const overdue      = attr.tasks_overdue_list        || [];
    const pendingAppr  = attr.tasks_pending_approval_list || [];

    const mkRow = (t, isOverdue) => {
      const flash = this._flashingTasks.has(t.task_id) ? "flash-success" : "";
      return `
        <div class="fh-task-row ${isOverdue ? "overdue" : ""} ${flash}"
             style="--person-color:${color}"
             data-task-id="${t.task_id}">
          <span class="fh-task-name">${t.name}</span>
          ${isOverdue ? `<span class="fh-overdue-badge">${t.days_overdue}d late</span>` : ""}
          ${t.points ? `<span class="fh-pts-badge" style="--person-color:${color}">${t.points}pts</span>` : ""}
          <button class="fh-check-btn" style="--person-color:${color}"
                  data-action="complete-task"
                  data-task-id="${t.task_id}"
                  data-person-id="${person.person_id}"
                  title="Mark done">${icon.check}</button>
        </div>`;
    };

    const pendingRows = pendingAppr.map(t => `
      <div class="fh-task-row" style="--person-color:${color}">
        <span class="fh-task-name">${t.name}</span>
        ${t.points ? `<span class="fh-pts-badge" style="--person-color:${color}">${t.points}pts</span>` : ""}
        <span class="fh-pending-badge">Pending</span>
      </div>`).join("");

    const hasTasks = dueToday.length || overdue.length || pendingAppr.length;

    return `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--fh-gap-sm)">
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-action="open-add-reminder"
                data-person-id="${person.person_id}">
          ${icon.bell} Add Reminder
        </button>
      </div>
      <div class="fh-task-list">
        ${overdue.map(t => mkRow(t, true)).join("")}
        ${dueToday.map(t => mkRow(t, false)).join("")}
        ${pendingRows}
        ${!hasTasks ? '<div class="fh-empty">Nothing due — nice work! 🎉</div>' : ""}
      </div>`;
  }

  _renderPersonalStore(attr, color, person) {
    const items = attr.store_items || [];
    const balance = parseInt(this._state(this._personEntityId(person.name))?.state || "0");

    if (!items.length) {
      return `<div class="fh-empty">No store items yet.</div>`;
    }

    const grid = items.map(item => {
      const canAfford = balance >= item.points_cost;
      return `
        <div class="fh-store-item">
          <div class="fh-store-name">${item.name}</div>
          ${item.description ? `<div class="fh-store-desc">${item.description}</div>` : ""}
          <div class="fh-store-price" style="color:${color}">${fmtPts(item.points_cost)}pts</div>
          <button class="fh-btn ${canAfford ? "fh-btn-primary" : "fh-btn-ghost"} fh-btn-sm"
                  style="${canAfford ? `background:${color}` : ""}"
                  data-action="redeem"
                  data-item-id="${item.item_id}"
                  data-item-name="${item.name}"
                  data-person-id="${person.person_id}"
                  ${canAfford ? "" : "disabled"}>
            ${canAfford ? "Request" : "Need more pts"}
          </button>
        </div>`;
    }).join("");

    return `<div class="fh-store-grid">${grid}</div>`;
  }

  _renderPersonalHistory(person) {
    // History is not surfaced as a sensor attribute in v0.2.0 — show a placeholder
    return `<div class="fh-empty">History coming in a future update.</div>`;
  }

  // ------------------------------------------------------------------
  // MODE: Maintenance
  // ------------------------------------------------------------------

  _renderMaintenance() {
    const attr  = this._attr("sensor.family_hub_maintenance_due");
    const items = attr.items || [];

    const rows = items.map(item => {
      let cls = "upcoming";
      if (item.days_delta < 0)  cls = "overdue";
      else if (item.days_delta <= 7) cls = "soon";

      const label = daysLabel(item.days_delta);
      const labelColor = cls === "overdue" ? "var(--fh-overdue)"
                       : cls === "soon"    ? "var(--fh-warning)"
                       : "var(--fh-success)";

      const personChip = item.person_name ? `
        <div class="fh-avatar" style="background:${item.person_color || DEFAULT_COLOR};width:22px;height:22px;font-size:.65rem">
          ${initial(item.person_name)}
        </div>` : "";

      return `
        <div class="fh-maint-row ${cls}">
          ${personChip}
          <span class="fh-task-name">${item.name}</span>
          <span style="font-size:.8rem;font-weight:600;color:${labelColor};white-space:nowrap">${label}</span>
        </div>`;
    }).join("") || `<div class="fh-empty">Nothing due in the next 14 days.</div>`;

    const overdueCt = attr.overdue || 0;
    const dueSoonCt = attr.due_this_week || 0;

    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--fh-gap)">
        <span class="fh-title" style="margin:0">Home Maintenance</span>
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-action="open-add-reminder">
          ${icon.bell} Add Reminder
        </button>
      </div>

      ${overdueCt || dueSoonCt ? `
        <div style="display:flex;gap:var(--fh-gap-sm);margin-bottom:var(--fh-gap)">
          ${overdueCt ? `<span class="fh-overdue-badge">${overdueCt} overdue</span>` : ""}
          ${dueSoonCt ? `<span style="font-size:.78rem;font-weight:600;color:var(--fh-warning);background:var(--fh-warning-bg);padding:2px 7px;border-radius:10px">${dueSoonCt} this week</span>` : ""}
        </div>` : ""}

      <div class="fh-task-list">${rows}</div>
    `;
  }

  // ------------------------------------------------------------------
  // MODE: Admin
  // ------------------------------------------------------------------

  _renderAdmin() {
    const attr       = this._attr("sensor.family_hub_needs_attention");
    const people     = attr.people           || [];
    const approvals  = attr.approval_queue   || [];
    const redemptions= attr.redemption_queue || [];
    const chores     = attr.active_chores    || [];
    const familyName = attr.family_name      || "Family Hub";
    const ppdollar   = attr.points_per_dollar || 10;
    const showDollar = attr.show_dollar_value_to_kids || false;
    const totalBadge = approvals.length + redemptions.length;

    const navItems = [
      { id: "overview",   label: "Overview",  badge: 0 },
      { id: "approvals",  label: "Approvals", badge: approvals.length },
      { id: "redemptions",label: "Redeem",    badge: redemptions.length },
      { id: "chores",     label: "Chores",    badge: 0 },
      { id: "settings",   label: "Settings",  badge: 0 },
    ];

    const nav = `
      <div class="fh-tabs" style="margin-bottom:var(--fh-gap)">
        ${navItems.map(n => `
          <div class="fh-tab ${this._adminSection === n.id ? "active" : ""}"
               data-action="admin-section" data-section="${n.id}"
               style="position:relative">
            ${n.label}
            ${n.badge > 0 ? `<span style="position:absolute;top:2px;right:2px;width:8px;height:8px;background:var(--fh-overdue);border-radius:50%"></span>` : ""}
          </div>`).join("")}
      </div>`;

    let content = "";
    switch (this._adminSection) {
      case "overview":    content = this._renderAdminOverview(people, ppdollar);       break;
      case "approvals":   content = this._renderAdminApprovals(approvals);             break;
      case "redemptions": content = this._renderAdminRedemptions(redemptions);         break;
      case "chores":      content = this._renderAdminChores(chores, people);           break;
      case "settings":    content = this._renderAdminSettings(familyName, ppdollar, showDollar); break;
    }

    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--fh-gap)">
        <span class="fh-title" style="margin:0">${familyName} — Admin</span>
        ${totalBadge > 0
          ? `<span class="fh-overdue-badge">${totalBadge} need action</span>`
          : ""}
      </div>
      ${nav}
      ${content}
    `;
  }

  _renderAdminOverview(people, ppdollar) {
    const rows = people.map(p => {
      const color = p.avatar_color || DEFAULT_COLOR;
      return `
        <div class="fh-point-row" style="--person-color:${color}">
          <div class="fh-avatar" style="background:${color}">${initial(p.name)}</div>
          <div style="flex:1">
            <div style="font-weight:600;font-size:.9rem">${p.name}</div>
            <div style="font-size:.78rem;color:var(--fh-text-sec)">
              ${fmtPts(p.points_balance)} pts · ${fmtDollar(p.points_balance / ppdollar)} lifetime: ${fmtPts(p.points_lifetime)}
            </div>
          </div>
          <button class="fh-btn fh-btn-success fh-btn-sm"
                  data-action="open-award"
                  data-person-id="${p.person_id}"
                  data-person-name="${p.name}"
                  data-color="${color}"
                  title="Award points">${icon.award}</button>
          <button class="fh-btn fh-btn-danger fh-btn-sm"
                  data-action="open-deduct"
                  data-person-id="${p.person_id}"
                  data-person-name="${p.name}"
                  data-color="${color}"
                  title="Deduct points">${icon.minus}</button>
        </div>`;
    }).join("");

    return `
      <div class="fh-section-title">Point balances</div>
      <div class="fh-task-list">${rows || '<div class="fh-empty">No people found.</div>'}</div>
      <div style="margin-top:var(--fh-gap)">
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-action="open-add-task">
          ${icon.plus} Quick add task
        </button>
      </div>
    `;
  }

  _renderAdminApprovals(approvals) {
    if (!approvals.length) return `<div class="fh-empty">No pending approvals.</div>`;
    return `
      <div class="fh-task-list">
        ${approvals.map(a => {
          const color = a.person_color || DEFAULT_COLOR;
          return `
            <div class="fh-queue-row">
              <div class="fh-avatar" style="background:${color}">${initial(a.person_name)}</div>
              <div class="fh-queue-info">
                <div class="fh-queue-name">${a.chore_name}</div>
                <div class="fh-queue-meta">${a.person_name} · ${a.chore_points}pts</div>
              </div>
              <div class="fh-queue-actions">
                <button class="fh-btn fh-btn-success fh-btn-sm"
                        data-action="approve-task"
                        data-task-id="${a.task_id}">${icon.check}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm"
                        data-action="deny-task"
                        data-task-id="${a.task_id}">${icon.close}</button>
              </div>
            </div>`;
        }).join("")}
      </div>`;
  }

  _renderAdminRedemptions(redemptions) {
    if (!redemptions.length) return `<div class="fh-empty">No pending redemptions.</div>`;
    return `
      <div class="fh-task-list">
        ${redemptions.map(r => {
          const color = r.person_color || DEFAULT_COLOR;
          return `
            <div class="fh-queue-row">
              <div class="fh-avatar" style="background:${color}">${initial(r.person_name)}</div>
              <div class="fh-queue-info">
                <div class="fh-queue-name">${r.item_name}</div>
                <div class="fh-queue-meta">${r.person_name} · ${fmtPts(r.points_cost)}pts</div>
              </div>
              <div class="fh-queue-actions">
                <button class="fh-btn fh-btn-success fh-btn-sm"
                        data-action="approve-redemption"
                        data-redemption-id="${r.redemption_id}">${icon.check}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm"
                        data-action="decline-redemption"
                        data-redemption-id="${r.redemption_id}">${icon.close}</button>
              </div>
            </div>`;
        }).join("")}
      </div>`;
  }

  _renderAdminChores(chores, people) {
    const byCategory = {};
    for (const c of chores) {
      if (!byCategory[c.category]) byCategory[c.category] = [];
      byCategory[c.category].push(c);
    }

    const sections = Object.entries(byCategory).map(([cat, list]) => {
      const rows = list.map(c => {
        const person = people.find(p => p.person_id === c.assigned_to);
        return `
          <div class="fh-task-row" style="--person-color:${person?.avatar_color || DEFAULT_COLOR}">
            <span class="fh-task-name">${c.name}</span>
            ${person ? `<span class="fh-task-meta">${person.name}</span>` : ""}
            <span class="fh-pts-badge">${c.points}pts</span>
            <button class="fh-btn fh-btn-ghost fh-btn-sm"
                    data-action="open-edit-chore"
                    data-chore-id="${c.chore_id}"
                    data-chore-name="${c.name}">
              ${icon.edit}
            </button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-action="delete-chore"
                    data-chore-id="${c.chore_id}"
                    data-chore-name="${c.name}">
              ${icon.trash}
            </button>
          </div>`;
      }).join("");

      return `
        <div class="fh-section-title">${cap(cat.replace(/_/g, " "))}</div>
        <div class="fh-task-list">${rows}</div>`;
    }).join("");

    return `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--fh-gap-sm)">
        <button class="fh-btn fh-btn-primary fh-btn-sm" data-action="open-add-chore">
          ${icon.plus} Add chore
        </button>
      </div>
      ${sections || '<div class="fh-empty">No active chores.</div>'}
    `;
  }

  _renderAdminSettings(familyName, ppdollar, showDollar) {
    return `
      <div class="fh-task-list">
        <div class="fh-toggle-row">
          <span class="fh-toggle-label">Show dollar value to kids</span>
          <label class="fh-toggle">
            <input type="checkbox" data-action="toggle-dollar-kids"
                   ${showDollar ? "checked" : ""}>
            <span class="fh-toggle-slider"></span>
          </label>
        </div>
        <div class="fh-point-row">
          <span style="font-size:.9rem;flex:1">Points per dollar: <strong>${ppdollar}</strong></span>
          <button class="fh-btn fh-btn-ghost fh-btn-sm"
                  data-action="open-edit-settings">
            ${icon.settings} Edit
          </button>
        </div>
        <div class="fh-divider"></div>
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-action="export-backup"
                style="width:100%;justify-content:center">
          Export backup
        </button>
      </div>
    `;
  }

  // ------------------------------------------------------------------
  // Modal builder
  // ------------------------------------------------------------------

  _buildModal() {
    const bg = document.createElement("div");
    bg.className = "fh-modal-bg";
    bg.innerHTML = this._modalContent();
    return bg;
  }

  _modalContent() {
    const m = this._modal;
    if (!m) return "";

    switch (m.type) {
      case "award":
      case "deduct":
        return this._modalPointAdjust(m);
      case "add-task":
        return this._modalAddTask(m);
      case "add-chore":
        return this._modalAddChore(m);
      case "edit-settings":
        return this._modalEditSettings(m);
      case "claim":
        return this._modalClaim(m);
      case "add-reminder":
        return this._modalAddReminder(m);
      default:
        return "";
    }
  }

  _modalWrap(title, body, confirmLabel, confirmAction, confirmClass = "fh-btn-primary") {
    return `
      <div class="fh-modal" data-modal>
        <div class="fh-modal-title">${title}</div>
        ${body}
        <div class="fh-modal-actions">
          <button class="fh-btn fh-btn-ghost" data-action="close-modal">Cancel</button>
          <button class="fh-btn ${confirmClass}" data-action="${confirmAction}">${confirmLabel}</button>
        </div>
      </div>`;
  }

  _modalPointAdjust(m) {
    const isAward = m.type === "award";
    const title = isAward ? `Award points — ${m.data.personName}` : `Deduct points — ${m.data.personName}`;
    const body = `
      <div class="fh-modal-row">
        <label class="fh-modal-label">Amount (enter pts or $)</label>
        <input class="fh-input" id="modal-pts-input" type="number" min="0" step="1"
               placeholder="e.g. 50 or 5.00" autofocus>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Type</label>
        <select class="fh-select" id="modal-pts-type">
          <option value="points">Points</option>
          <option value="dollars">Dollars ($)</option>
        </select>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Reason (optional)</label>
        <input class="fh-input" id="modal-pts-reason" type="text" placeholder="e.g. Helped with dinner">
      </div>
      <input type="hidden" id="modal-person-id" value="${m.data.personId}">
      <input type="hidden" id="modal-action-type" value="${m.type}">`;
    return this._modalWrap(title, body, isAward ? "Award" : "Deduct",
      "confirm-point-adjust", isAward ? "fh-btn-success" : "fh-btn-danger");
  }

  _modalAddTask(m) {
    const people = this._getPeople();
    const body = `
      <div class="fh-modal-row">
        <label class="fh-modal-label">Task name *</label>
        <input class="fh-input" id="modal-task-name" type="text" autofocus>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Assign to (optional)</label>
        <select class="fh-select" id="modal-task-person">
          <option value="">Anyone</option>
          ${people.map(p => `<option value="${p.person_id}">${p.name}</option>`).join("")}
        </select>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Points</label>
        <input class="fh-input" id="modal-task-pts" type="number" min="0" value="10">
      </div>`;
    return this._modalWrap("Add one-time task", body, "Add task", "confirm-add-task");
  }

  _modalAddChore(m) {
    const people = this._getPeople();
    const body = `
      <div class="fh-modal-row">
        <label class="fh-modal-label">Chore name *</label>
        <input class="fh-input" id="modal-chore-name" type="text" autofocus>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Category</label>
        <select class="fh-select" id="modal-chore-cat">
          <option value="assigned">Assigned</option>
          <option value="claimable">Claimable</option>
          <option value="maintenance">Maintenance</option>
          <option value="personal_reminder">Personal Reminder</option>
          <option value="one_time">One-time</option>
        </select>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Assign to</label>
        <select class="fh-select" id="modal-chore-person">
          <option value="">Unassigned</option>
          ${people.map(p => `<option value="${p.person_id}">${p.name}</option>`).join("")}
        </select>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Recurrence</label>
        <select class="fh-select" id="modal-chore-recurrence">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="every_n_days">Every N days</option>
          <option value="every_n_weeks">Every N weeks</option>
          <option value="monthly_on_date">Monthly</option>
          <option value="one_time">One-time</option>
        </select>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Points</label>
        <input class="fh-input" id="modal-chore-pts" type="number" min="0" value="10">
      </div>
      <div class="fh-modal-row" style="flex-direction:row;align-items:center;gap:8px">
        <input type="checkbox" id="modal-chore-approval" checked>
        <label class="fh-modal-label" for="modal-chore-approval" style="margin:0">Requires parent approval</label>
      </div>`;
    return this._modalWrap("Add chore", body, "Add chore", "confirm-add-chore");
  }

  _modalEditSettings(m) {
    const body = `
      <div class="fh-modal-row">
        <label class="fh-modal-label">Family name</label>
        <input class="fh-input" id="modal-family-name" type="text" value="${m.data.familyName}">
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Points per dollar</label>
        <input class="fh-input" id="modal-ppdollar" type="number" min="1" value="${m.data.ppdollar}">
      </div>`;
    return this._modalWrap("Edit settings", body, "Save", "confirm-edit-settings");
  }

  _modalClaim(m) {
    const people = this._getPeople();
    const body = `
      <div class="fh-modal-row">
        <label class="fh-modal-label">Claiming: <strong>${m.data.taskName}</strong></label>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Who is claiming?</label>
        <select class="fh-select" id="modal-claim-person">
          ${people.map(p => `<option value="${p.person_id}">${p.name}</option>`).join("")}
        </select>
      </div>
      <input type="hidden" id="modal-claim-task-id" value="${m.data.taskId}">`;
    return this._modalWrap(`Claim task`, body, "Claim", "confirm-claim");
  }

  _modalAddReminder(m) {
    const people = this._getPeople();
    const body = `
      <div class="fh-modal-row">
        <label class="fh-modal-label">Reminder name *</label>
        <input class="fh-input" id="modal-reminder-name" type="text" autofocus
               placeholder="e.g. CPAP mask clean, Eye drops">
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Who is this for?</label>
        <select class="fh-select" id="modal-reminder-person">
          ${people.map(p => `<option value="${p.person_id}" ${m.data?.personId === p.person_id ? "selected" : ""}>${p.name}</option>`).join("")}
        </select>
      </div>
      <div class="fh-modal-row">
        <label class="fh-modal-label">Recurrence</label>
        <select class="fh-select" id="modal-reminder-recurrence">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="every_n_days">Every N days</option>
          <option value="monthly_on_date">Monthly</option>
        </select>
      </div>`;
    return this._modalWrap("Add personal reminder", body, "Add", "confirm-add-reminder");
  }

  // ------------------------------------------------------------------
  // Event listeners — delegated on the card root
  // ------------------------------------------------------------------

  _attachListeners() {
    const root = this.shadowRoot;

    root.addEventListener("click", (e) => {
      const el   = e.target.closest("[data-action]");
      if (!el) return;
      const action = el.dataset.action;
      this._handleAction(action, el, e);
    });

    root.addEventListener("change", (e) => {
      const el = e.target;
      if (el.dataset.action === "toggle-dollar-kids") {
        this._callService("update_settings", { show_dollar_value_to_kids: el.checked });
      }
    });
  }

  _handleAction(action, el, e) {
    switch (action) {
      // ---- Filtering ----
      case "filter-person": {
        const id = el.dataset.personId;
        this._activeFilter = this._activeFilter === id ? null : id;
        this._render();
        break;
      }

      // ---- Tab navigation ----
      case "set-tab": {
        this._activeTab = el.dataset.tab;
        this._render();
        break;
      }

      // ---- Admin section navigation ----
      case "admin-section": {
        this._adminSection = el.dataset.section;
        this._render();
        break;
      }

      // ---- Task completion ----
      case "complete-task": {
        const taskId   = el.dataset.taskId;
        const personId = el.dataset.personId;
        if (!taskId || !personId) break;
        this._callService("complete_task", { task_id: taskId, person_id: personId });
        // Optimistic flash
        this._flashingTasks.add(taskId);
        setTimeout(() => {
          this._flashingTasks.delete(taskId);
          this._render();
        }, FLASH_DURATION);
        this._render();
        break;
      }

      // ---- Task approvals ----
      case "approve-task": {
        // Use first parent as approver — in practice the card user IS the parent
        const parent = this._getPeople().find(p => p.type === "parent");
        this._callService("approve_task", {
          task_id: el.dataset.taskId,
          approved_by: parent?.person_id || "parent",
        });
        break;
      }
      case "deny-task": {
        const parent = this._getPeople().find(p => p.type === "parent");
        this._callService("deny_task", {
          task_id: el.dataset.taskId,
          denied_by: parent?.person_id || "parent",
        });
        break;
      }

      // ---- Redemption approvals ----
      case "approve-redemption": {
        const parent = this._getPeople().find(p => p.type === "parent");
        this._callService("approve_redemption", {
          redemption_id: el.dataset.redemptionId,
          approved_by: parent?.person_id || "parent",
        });
        break;
      }
      case "decline-redemption": {
        const parent = this._getPeople().find(p => p.type === "parent");
        this._callService("decline_redemption", {
          redemption_id: el.dataset.redemptionId,
          declined_by: parent?.person_id || "parent",
        });
        break;
      }

      // ---- Redeem store item (kid requests) ----
      case "redeem": {
        this._callService("request_redemption", {
          person_id: el.dataset.personId,
          item_id: el.dataset.itemId,
        });
        break;
      }

      // ---- Delete chore ----
      case "delete-chore": {
        if (!confirm(`Delete chore "${el.dataset.choreName}"?`)) break;
        this._callService("delete_chore", { chore_id: el.dataset.choreId });
        break;
      }

      // ---- Export backup ----
      case "export-backup": {
        this._callService("export_backup", {});
        break;
      }

      // ---- Open modals ----
      case "open-award": {
        this._modal = { type: "award", data: { personId: el.dataset.personId, personName: el.dataset.personName }};
        this._render();
        break;
      }
      case "open-deduct": {
        this._modal = { type: "deduct", data: { personId: el.dataset.personId, personName: el.dataset.personName }};
        this._render();
        break;
      }
      case "open-add-task": {
        this._modal = { type: "add-task", data: {} };
        this._render();
        break;
      }
      case "open-add-chore": {
        this._modal = { type: "add-chore", data: {} };
        this._render();
        break;
      }
      case "open-edit-settings": {
        const attr = this._attr("sensor.family_hub_needs_attention");
        this._modal = { type: "edit-settings", data: { familyName: attr.family_name, ppdollar: attr.points_per_dollar }};
        this._render();
        break;
      }
      case "open-claim": {
        this._modal = { type: "claim", data: { taskId: el.dataset.taskId, taskName: el.dataset.taskName }};
        this._render();
        break;
      }
      case "open-add-reminder": {
        this._modal = { type: "add-reminder", data: { personId: el.dataset.personId || null }};
        this._render();
        break;
      }
      case "open-edit-chore": {
        // Future: open edit chore modal. For now a placeholder.
        alert(`Edit chore "${el.dataset.choreName}" — coming soon.`);
        break;
      }

      // ---- Close modal ----
      case "close-modal": {
        this._modal = null;
        this._render();
        break;
      }

      // ---- Modal confirmations ----
      case "confirm-point-adjust": {
        this._confirmPointAdjust();
        break;
      }
      case "confirm-add-task": {
        this._confirmAddTask();
        break;
      }
      case "confirm-add-chore": {
        this._confirmAddChore();
        break;
      }
      case "confirm-edit-settings": {
        this._confirmEditSettings();
        break;
      }
      case "confirm-claim": {
        this._confirmClaim();
        break;
      }
      case "confirm-add-reminder": {
        this._confirmAddReminder();
        break;
      }
    }

    // Close modal when clicking outside it
    if (action === undefined && e?.target?.classList?.contains("fh-modal-bg")) {
      this._modal = null;
      this._render();
    }
  }

  // ------------------------------------------------------------------
  // Modal confirm handlers — read inputs and call services
  // ------------------------------------------------------------------

  _confirmPointAdjust() {
    const root     = this.shadowRoot;
    const amount   = parseFloat(root.getElementById("modal-pts-input")?.value || "0");
    const type     = root.getElementById("modal-pts-type")?.value;
    const reason   = root.getElementById("modal-pts-reason")?.value || "";
    const personId = root.getElementById("modal-person-id")?.value;
    const action   = root.getElementById("modal-action-type")?.value;

    if (!amount || amount <= 0) return;

    const serviceData = { person_id: personId, reason };
    if (type === "dollars") serviceData.dollar_amount = amount;
    else serviceData.points = Math.round(amount);

    this._callService(action === "award" ? "award_bonus_points" : "deduct_points", serviceData);
    this._modal = null;
    this._render();
  }

  _confirmAddTask() {
    const root     = this.shadowRoot;
    const name     = root.getElementById("modal-task-name")?.value?.trim();
    const personId = root.getElementById("modal-task-person")?.value;
    const points   = parseInt(root.getElementById("modal-task-pts")?.value || "0");

    if (!name) return;

    const data = { name, points };
    if (personId) data.assigned_to = personId;
    this._callService("add_one_time_task", data);
    this._modal = null;
    this._render();
  }

  _confirmAddChore() {
    const root       = this.shadowRoot;
    const name       = root.getElementById("modal-chore-name")?.value?.trim();
    const category   = root.getElementById("modal-chore-cat")?.value;
    const personId   = root.getElementById("modal-chore-person")?.value;
    const recurrence = root.getElementById("modal-chore-recurrence")?.value;
    const points     = parseInt(root.getElementById("modal-chore-pts")?.value || "10");
    const approval   = root.getElementById("modal-chore-approval")?.checked ?? true;

    if (!name) return;

    const data = { name, category, points, recurrence_type: recurrence, approval_required: approval };
    if (personId) data.assigned_to = personId;
    this._callService("add_chore", data);
    this._modal = null;
    this._render();
  }

  _confirmEditSettings() {
    const root       = this.shadowRoot;
    const familyName = root.getElementById("modal-family-name")?.value?.trim();
    const ppdollar   = parseInt(root.getElementById("modal-ppdollar")?.value || "10");

    if (!familyName) return;
    this._callService("update_settings", { family_name: familyName, points_per_dollar: ppdollar });
    this._modal = null;
    this._render();
  }

  _confirmClaim() {
    const root     = this.shadowRoot;
    const taskId   = root.getElementById("modal-claim-task-id")?.value;
    const personId = root.getElementById("modal-claim-person")?.value;

    if (!taskId || !personId) return;
    this._callService("claim_task", { task_id: taskId, person_id: personId });
    this._modal = null;
    this._render();
  }

  _confirmAddReminder() {
    const root       = this.shadowRoot;
    const name       = root.getElementById("modal-reminder-name")?.value?.trim();
    const personId   = root.getElementById("modal-reminder-person")?.value;
    const recurrence = root.getElementById("modal-reminder-recurrence")?.value;

    if (!name || !personId) return;
    this._callService("add_chore", {
      name,
      category: "personal_reminder",
      assigned_to: personId,
      recurrence_type: recurrence,
      approval_required: false,
      points: 0,
    });
    this._modal = null;
    this._render();
  }
}

// ---------------------------------------------------------------------------
// Register the card
// ---------------------------------------------------------------------------

customElements.define("family-hub-card", FamilyHubCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        "family-hub-card",
  name:        "Family Hub",
  description: "Family task management — command center, personal, maintenance, and admin views.",
  preview:     false,
});

console.info(`%c FAMILY-HUB-CARD %c v${VERSION} `, "background:#7F77DD;color:#fff;font-weight:700", "background:#333;color:#fff");

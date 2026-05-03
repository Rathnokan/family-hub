/**
 * Family Hub — Custom Lovelace Card
 * Version: 0.2.1
 *
 * Four dashboard modes in one self-contained Web Component:
 *   command_center  — Kitchen display, person filter chips, household task list
 *   personal        — Per-person view: points, tasks, store, reminders
 *   maintenance     — House maintenance + personal reminders
 *   admin           — Approvals, redemptions, chores, store, people, settings
 *
 * Usage:
 *   type: custom:family-hub-card
 *   mode: command_center
 *
 *   type: custom:family-hub-card
 *   mode: personal
 *   person: jackson
 *
 * Design principles:
 *   - Dirty-checks against sensor last_changed timestamps — never re-renders
 *     unless Family Hub data actually changed. Prevents HA from freezing and
 *     prevents modal/input destruction on unrelated state updates.
 *   - Modal is never destroyed while open — re-renders are fully suppressed
 *     when any interactive overlay is visible.
 *   - Visual editor supported via getConfigElement() and getStubConfig().
 *   - All four modes read from sensor attributes via hass.states.
 *   - All actions call HA services via hass.callService().
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DOMAIN  = "family_hub";
const VERSION = "0.2.1";

const DEFAULT_COLOR   = "#7F77DD";
const FLASH_MS        = 1400;
const FH_SENSORS = [
  "sensor.family_hub_needs_attention",
  "sensor.family_hub_maintenance_due",
  "sensor.family_hub_maintenance_overdue",
  "sensor.family_hub_claimable_tasks",
];

// ---------------------------------------------------------------------------
// Icons (inline SVG paths — no external dependency)
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
};

// ---------------------------------------------------------------------------
// Shared CSS
// ---------------------------------------------------------------------------

const CSS = `
  :host {
    --fh-radius:     12px;
    --fh-radius-sm:  8px;
    --fh-radius-chip:20px;
    --fh-gap:        12px;
    --fh-gap-sm:     8px;
    --fh-gap-xs:     4px;
    --fh-pad:        16px;
    --fh-pad-sm:     12px;
    --fh-pad-xs:     8px;
    --fh-bg:         var(--ha-card-background, var(--card-background-color, #1c1c1e));
    --fh-surface:    var(--secondary-background-color, #2c2c2e);
    --fh-border:     var(--divider-color, rgba(255,255,255,.12));
    --fh-text:       var(--primary-text-color, #f5f5f7);
    --fh-text-sec:   var(--secondary-text-color, #aeaeb2);
    --fh-overdue:    #ff453a;
    --fh-overdue-bg: rgba(255,69,58,.12);
    --fh-warning:    #ff9f0a;
    --fh-warning-bg: rgba(255,159,10,.12);
    --fh-success:    #30d158;
    --fh-success-bg: rgba(48,209,88,.12);
    --fh-accent:     var(--primary-color, #7F77DD);
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
  .fh-title { font-size:1.1rem; font-weight:700; margin:0 0 var(--fh-gap) 0; }
  .fh-section-title {
    font-size:.75rem; font-weight:700; letter-spacing:.07em;
    text-transform:uppercase; color:var(--fh-text-sec);
    margin:var(--fh-gap) 0 var(--fh-gap-sm) 0;
  }
  .fh-balance {
    font-size:3.4rem; font-weight:800; line-height:1;
    letter-spacing:-.03em;
  }
  .fh-balance-unit { font-size:1.2rem; font-weight:400; opacity:.6; margin-left:3px; }
  .fh-dollar { font-size:.95rem; color:var(--fh-text-sec); margin-top:3px; }

  /* Filter chips */
  .fh-chips { display:flex; flex-wrap:wrap; gap:var(--fh-gap-sm); margin-bottom:var(--fh-gap); }
  .fh-chip {
    display:inline-flex; align-items:center; gap:6px;
    padding:5px 14px; border-radius:var(--fh-radius-chip);
    border:1.5px solid var(--fh-border);
    background:var(--fh-surface);
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
    transition:background .15s, color .15s; user-select:none;
    position:relative;
  }
  .fh-tab.active {
    background:var(--fh-bg); color:var(--fh-accent);
    font-weight:700; box-shadow:0 1px 4px rgba(0,0,0,.2);
  }
  .fh-tab-badge {
    position:absolute; top:3px; right:3px;
    width:7px; height:7px; border-radius:50%;
    background:var(--fh-overdue);
  }

  /* Task rows */
  .fh-task-list { display:flex; flex-direction:column; gap:var(--fh-gap-sm); }
  .fh-task-row {
    display:flex; align-items:center; gap:var(--fh-gap-sm);
    padding:var(--fh-pad-xs) var(--fh-pad-sm);
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
    border-left:3px solid var(--row-color, var(--fh-accent));
    position:relative; overflow:hidden;
    transition:opacity .25s, transform .25s;
  }
  .fh-task-row.overdue { border-left-color:var(--fh-overdue); }
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
  .fh-task-sub { font-size:.75rem; color:var(--fh-text-sec); }

  /* Badges */
  .fh-badge {
    font-size:.72rem; font-weight:700; padding:2px 8px; border-radius:10px;
    white-space:nowrap; flex-shrink:0;
  }
  .fh-badge-overdue { color:var(--fh-overdue); background:var(--fh-overdue-bg); }
  .fh-badge-pending { color:var(--fh-warning);  background:var(--fh-warning-bg); }
  .fh-badge-success { color:var(--fh-success);  background:var(--fh-success-bg); }
  .fh-badge-pts {
    color:var(--row-color, var(--fh-accent));
    background:color-mix(in srgb, var(--row-color, var(--fh-accent)) 14%, transparent);
  }

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
    transition:filter .15s, transform .1s;
    font-family:inherit;
  }
  .fh-btn:hover  { filter:brightness(.88); }
  .fh-btn:active { transform:scale(.96); }
  .fh-btn svg    { width:15px; height:15px; fill:currentColor; pointer-events:none; }
  .fh-btn-primary { background:var(--fh-accent); color:#fff; }
  .fh-btn-success { background:var(--fh-success); color:#000; }
  .fh-btn-danger  { background:var(--fh-overdue); color:#fff; }
  .fh-btn-ghost   { background:var(--fh-surface); color:var(--fh-text); border:1.5px solid var(--fh-border); }
  .fh-btn-sm { padding:4px 10px; font-size:.78rem; }
  .fh-btn-sm svg { width:13px; height:13px; }
  .fh-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; filter:none; }

  /* Avatar */
  .fh-avatar {
    width:28px; height:28px; border-radius:50%;
    display:inline-flex; align-items:center; justify-content:center;
    font-size:.75rem; font-weight:800; color:#fff; flex-shrink:0;
    text-transform:uppercase;
  }

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
  .fh-toggle input:checked + .fh-toggle-slider { background:var(--fh-accent); }
  .fh-toggle input:checked + .fh-toggle-slider:before { transform:translateX(20px); }

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

  /* Modal */
  .fh-modal-bg {
    position:fixed; inset:0; background:rgba(0,0,0,.55);
    z-index:9999; display:flex; align-items:center; justify-content:center; padding:var(--fh-pad);
  }
  .fh-modal {
    background:var(--fh-bg); border-radius:var(--fh-radius);
    padding:var(--fh-pad); width:100%; max-width:440px;
    max-height:90vh; overflow-y:auto;
    display:flex; flex-direction:column; gap:var(--fh-gap);
    box-shadow:0 8px 32px rgba(0,0,0,.45);
  }
  .fh-modal-title { font-size:1.1rem; font-weight:700; }
  .fh-field { display:flex; flex-direction:column; gap:5px; }
  .fh-label { font-size:.8rem; color:var(--fh-text-sec); font-weight:600; }
  .fh-row   { display:flex; gap:var(--fh-gap-sm); }
  .fh-row .fh-field { flex:1; }
  .fh-modal-footer { display:flex; gap:var(--fh-gap-sm); justify-content:flex-end; margin-top:4px; }
  .fh-checkbox-row { display:flex; align-items:center; gap:8px; }
  .fh-checkbox-row input[type=checkbox] { width:17px; height:17px; cursor:pointer; }

  /* Divider */
  .fh-divider { height:1px; background:var(--fh-border); margin:var(--fh-gap-sm) 0; }

  /* Empty state */
  .fh-empty { text-align:center; padding:var(--fh-pad) 0; color:var(--fh-text-sec); font-size:.88rem; }

  /* Header row util */
  .fh-hdr {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:var(--fh-gap);
  }

  /* Responsive */
  @container fh (min-width: 680px) {
    .fh-store-grid { grid-template-columns:repeat(auto-fill, minmax(170px, 1fr)); }
    .fh-balance { font-size:4rem; }
  }
  @container fh (min-width: 900px) {
    .fh-balance { font-size:4.8rem; }
  }
`;

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

const ini  = name => (name || "?")[0].toUpperCase();
const fPts = n => (n || 0).toLocaleString();
const fUSD = n => `$${(n || 0).toFixed(2)}`;
const cap  = s => s ? s[0].toUpperCase() + s.slice(1) : "";
const slug = s => (s || "").toLowerCase().replace(/\s+/g, "_");

function daysLabel(d) {
  if (d < -1)  return `${Math.abs(d)}d overdue`;
  if (d === -1) return "1d overdue";
  if (d === 0)  return "Today";
  if (d === 1)  return "Tomorrow";
  return `In ${d}d`;
}

function daysLabelColor(d) {
  if (d < 0)   return "var(--fh-overdue)";
  if (d <= 7)  return "var(--fh-warning)";
  return "var(--fh-success)";
}

// Build a <select> options string from an array of {value, label} objects
function opts(arr, current) {
  return arr.map(o =>
    `<option value="${o.value}" ${o.value === current ? "selected" : ""}>${o.label}</option>`
  ).join("");
}

// ---------------------------------------------------------------------------
// Main card class
// ---------------------------------------------------------------------------

class FamilyHubCard extends HTMLElement {

  // ---- HA card API --------------------------------------------------------

  static getStubConfig() {
    return { mode: "command_center" };
  }

  static getConfigElement() {
    return document.createElement("family-hub-card-editor");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._cfg        = {};
    this._hass       = null;
    this._lastKeys   = {};   // entityId → last_changed — dirty-check
    this._modal      = null; // { type, data } — null = closed
    this._filter     = null; // command_center person filter
    this._tab        = "tasks";
    this._adminSec   = "overview";
    this._flashing   = new Set();
  }

  setConfig(cfg) {
    const modes = ["command_center", "personal", "maintenance", "admin"];
    if (!cfg.mode) throw new Error("Family Hub: 'mode' is required");
    if (!modes.includes(cfg.mode)) throw new Error(`Family Hub: mode must be one of ${modes.join(", ")}`);
    if (cfg.mode === "personal" && !cfg.person) throw new Error("Family Hub: 'person' is required for personal mode");
    this._cfg = cfg;
    this._doRender(true); // force on config change
  }

  set hass(hass) {
    this._hass = hass;
    this._maybeRender();
  }

  getCardSize() { return 5; }

  // ---- Dirty-check --------------------------------------------------------

  /**
   * Only re-render when Family Hub sensor data has actually changed.
   * Compares last_changed timestamps for all FH entities.
   * While a modal is open, rendering is suppressed entirely so the user
   * never loses focus or input mid-interaction.
   */
  _maybeRender() {
    if (!this._hass) return;

    // Never re-render while a modal is open — user is interacting
    if (this._modal) return;

    const states = this._hass.states;
    let changed = false;

    // Check the four global sensors
    for (const id of FH_SENSORS) {
      const ts = states[id]?.last_changed;
      if (ts !== this._lastKeys[id]) {
        this._lastKeys[id] = ts;
        changed = true;
      }
    }

    // Check the person sensors dynamically
    for (const p of (states["sensor.family_hub_needs_attention"]?.attributes?.people || [])) {
      const id = `sensor.family_hub_${slug(p.name)}`;
      const ts = states[id]?.last_changed;
      if (ts !== this._lastKeys[id]) {
        this._lastKeys[id] = ts;
        changed = true;
      }
    }

    if (changed) this._doRender(false);
  }

  // ---- Render core --------------------------------------------------------

  _doRender(force = false) {
    if (!this._hass && !force) return;

    const styleEl = document.createElement("style");
    styleEl.textContent = CSS;

    const card = document.createElement("div");
    card.className = "fh-card";

    if (!this._hass) {
      card.innerHTML = `<div class="fh-empty">Loading…</div>`;
    } else {
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

    this._bindEvents();
  }

  // ---- Sensor data accessors ----------------------------------------------

  _states(id) { return this._hass?.states?.[id]; }
  _attrs(id)  { return this._states(id)?.attributes || {}; }

  _personEntityId(nameOrId) {
    return `sensor.family_hub_${slug(nameOrId)}`;
  }

  _people() {
    return this._attrs("sensor.family_hub_needs_attention").people || [];
  }

  _findPerson(nameOrId) {
    const lc = (nameOrId || "").toLowerCase();
    return this._people().find(p =>
      p.name.toLowerCase() === lc || p.person_id === nameOrId
    ) || null;
  }

  // ---- Service calls ------------------------------------------------------

  _svc(service, data) {
    if (!this._hass) return;
    this._hass.callService(DOMAIN, service, data);
  }

  // ---- MODE: Command Center -----------------------------------------------

  _htmlCC() {
    const claimableAttr = this._attrs("sensor.family_hub_claimable_tasks");
    const naAttr        = this._attrs("sensor.family_hub_needs_attention");
    const people        = this._people();
    const allTasks      = claimableAttr.all_tasks || [];
    const claimable     = claimableAttr.tasks     || [];
    const familyName    = naAttr.family_name || "Family Hub";

    const chips = people.map(p => `
      <div class="fh-chip ${this._filter === p.person_id ? "active" : ""}"
           style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
           data-act="filter" data-pid="${p.person_id}">
        <span class="fh-chip-dot"></span>${p.name}
      </div>`).join("");

    const filtered = this._filter
      ? allTasks.filter(t => t.assigned_to === this._filter)
      : allTasks;

    const overdue = filtered.filter(t => t.days_delta < 0);
    const today   = filtered.filter(t => t.days_delta === 0);

    const taskRows = [
      ...overdue.map(t => this._ccTaskRow(t, people, true)),
      ...today.map(t   => this._ccTaskRow(t, people, false)),
    ].join("") || `<div class="fh-empty">✓ All tasks complete!</div>`;

    const claimSection = claimable.length ? `
      <div class="fh-section-title">Available to claim</div>
      <div class="fh-task-list">
        ${claimable.map(t => `
          <div class="fh-task-row" style="--row-color:${DEFAULT_COLOR}">
            <span class="fh-task-name">${t.name}</span>
            ${t.points ? `<span class="fh-badge fh-badge-pts">${t.points}pts</span>` : ""}
            <button class="fh-btn fh-btn-primary fh-btn-sm"
                    data-act="open-claim" data-tid="${t.task_id}" data-name="${t.name}">
              Claim
            </button>
          </div>`).join("")}
      </div>` : "";

    return `
      <div class="fh-hdr">
        <span class="fh-title" style="margin:0">${familyName}</span>
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-add-task">${I.plus} Add task</button>
      </div>
      <div class="fh-chips">${chips}</div>
      <div class="fh-task-list">${taskRows}</div>
      ${claimSection}`;
  }

  _ccTaskRow(t, people, overdue) {
    const p     = people.find(x => x.person_id === t.assigned_to);
    const color = p?.avatar_color || DEFAULT_COLOR;
    const flash = this._flashing.has(t.task_id) ? "flash" : "";
    return `
      <div class="fh-task-row ${overdue ? "overdue" : ""} ${flash}"
           style="--row-color:${color}; --flash-dur:${FLASH_MS}ms">
        <div class="fh-avatar" style="background:${color}">${ini(p?.name)}</div>
        <span class="fh-task-name">${t.name}</span>
        ${overdue ? `<span class="fh-badge fh-badge-overdue">${Math.abs(t.days_delta)}d late</span>` : ""}
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

  _htmlPersonalTasks(attr, color, person, balance) {
    const due      = attr.tasks_due_today_list     || [];
    const overdue  = attr.tasks_overdue_list        || [];
    const pending  = attr.tasks_pending_approval_list || [];

    const mkRow = (t, isOverdue) => {
      const flash = this._flashing.has(t.task_id) ? "flash" : "";
      return `
        <div class="fh-task-row ${isOverdue ? "overdue" : ""} ${flash}"
             style="--row-color:${color}; --flash-dur:${FLASH_MS}ms">
          <span class="fh-task-name">${t.name}</span>
          ${isOverdue ? `<span class="fh-badge fh-badge-overdue">${t.days_overdue}d late</span>` : ""}
          ${t.points ? `<span class="fh-badge fh-badge-pts" style="--row-color:${color}">${t.points}pts</span>` : ""}
          <button class="fh-check" style="--row-color:${color}"
                  data-act="complete" data-tid="${t.task_id}" data-pid="${person.person_id}">
            ${I.check}
          </button>
        </div>`;
    };

    const pendingRows = pending.map(t => `
      <div class="fh-task-row" style="--row-color:${color}">
        <span class="fh-task-name">${t.name}</span>
        ${t.points ? `<span class="fh-badge fh-badge-pts" style="--row-color:${color}">${t.points}pts</span>` : ""}
        <span class="fh-badge fh-badge-pending">Awaiting approval</span>
      </div>`).join("");

    const empty = !due.length && !overdue.length && !pending.length;

    return `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--fh-gap-sm)">
        <button class="fh-btn fh-btn-ghost fh-btn-sm"
                data-act="open-add-reminder" data-pid="${person.person_id}">
          ${I.bell} Add reminder
        </button>
      </div>
      <div class="fh-task-list">
        ${overdue.map(t => mkRow(t, true)).join("")}
        ${due.map(t    => mkRow(t, false)).join("")}
        ${pendingRows}
        ${empty ? '<div class="fh-empty">Nothing due — nice work! 🎉</div>' : ""}
      </div>`;
  }

  _htmlPersonalStore(attr, color, person, balance) {
    const items = attr.store_items || [];
    if (!items.length) return `<div class="fh-empty">No rewards in the store yet.</div>`;

    return `
      <div class="fh-store-grid">
        ${items.map(item => {
          const can = balance >= item.points_cost;
          return `
            <div class="fh-store-item">
              <div class="fh-store-name">${item.name}</div>
              ${item.description ? `<div class="fh-store-desc">${item.description}</div>` : ""}
              <div class="fh-store-price" style="color:${color}">${fPts(item.points_cost)}pts</div>
              <button class="fh-btn fh-btn-sm ${can ? "fh-btn-primary" : "fh-btn-ghost"}"
                      style="${can ? `background:${color}` : ""}"
                      data-act="redeem"
                      data-iid="${item.item_id}" data-pid="${person.person_id}"
                      ${can ? "" : "disabled"}>
                ${can ? "Request" : "Not enough pts"}
              </button>
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
          ${item.person_name ? `
            <div class="fh-avatar" style="background:${item.person_color || DEFAULT_COLOR};width:22px;height:22px;font-size:.65rem">
              ${ini(item.person_name)}
            </div>` : ""}
          <span class="fh-task-name">${item.name}</span>
          <span style="font-size:.8rem;font-weight:700;color:${daysLabelColor(item.days_delta)};white-space:nowrap">
            ${daysLabel(item.days_delta)}
          </span>
        </div>`;
    }).join("") || `<div class="fh-empty">Nothing due in the next 14 days.</div>`;

    return `
      <div class="fh-hdr">
        <span class="fh-title" style="margin:0">Maintenance</span>
        <button class="fh-btn fh-btn-ghost fh-btn-sm"
                data-act="open-add-reminder">${I.bell} Add reminder</button>
      </div>
      ${attr.overdue ? `<span class="fh-badge fh-badge-overdue" style="display:inline-block;margin-bottom:var(--fh-gap-sm)">${attr.overdue} overdue</span>` : ""}
      <div class="fh-task-list">${rows}</div>`;
  }

  // ---- MODE: Admin --------------------------------------------------------

  _htmlAdmin() {
    const attr       = this._attrs("sensor.family_hub_needs_attention");
    const people     = attr.people           || [];
    const approvals  = attr.approval_queue   || [];
    const redemptions= attr.redemption_queue || [];
    const chores     = attr.active_chores    || [];
    const familyName = attr.family_name      || "Family Hub";
    const ppdollar   = attr.points_per_dollar || 10;
    const showDollar = attr.show_dollar_value_to_kids || false;
    const actionCount= approvals.length + redemptions.length;

    const sections = [
      { id: "overview",    label: "Overview",   badge: 0 },
      { id: "approvals",   label: "Approvals",  badge: approvals.length },
      { id: "redemptions", label: "Redeem",     badge: redemptions.length },
      { id: "chores",      label: "Chores",     badge: 0 },
      { id: "people",      label: "People",     badge: 0 },
      { id: "settings",    label: "Settings",   badge: 0 },
    ];

    const nav = `
      <div class="fh-tabs" style="flex-wrap:wrap">
        ${sections.map(s => `
          <div class="fh-tab ${this._adminSec === s.id ? "active" : ""}"
               data-act="admin-sec" data-sec="${s.id}"
               style="flex:1 0 auto">
            ${s.label}
            ${s.badge > 0 ? `<span class="fh-tab-badge"></span>` : ""}
          </div>`).join("")}
      </div>`;

    let body = "";
    switch (this._adminSec) {
      case "overview":    body = this._htmlAdminOverview(people, ppdollar);             break;
      case "approvals":   body = this._htmlAdminApprovals(approvals);                   break;
      case "redemptions": body = this._htmlAdminRedemptions(redemptions);               break;
      case "chores":      body = this._htmlAdminChores(chores, people);                 break;
      case "people":      body = this._htmlAdminPeople(people);                         break;
      case "settings":    body = this._htmlAdminSettings(familyName, ppdollar, showDollar); break;
    }

    return `
      <div class="fh-hdr">
        <span class="fh-title" style="margin:0">${familyName} — Admin</span>
        ${actionCount ? `<span class="fh-badge fh-badge-overdue">${actionCount} need action</span>` : ""}
      </div>
      ${nav}
      ${body}`;
  }

  _htmlAdminOverview(people, ppdollar) {
    const rows = people.map(p => {
      const color = p.avatar_color || DEFAULT_COLOR;
      return `
        <div class="fh-point-row">
          <div class="fh-avatar" style="background:${color}">${ini(p.name)}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:.9rem">${p.name}
              <span style="font-size:.75rem;color:var(--fh-text-sec);font-weight:400">
                (${cap(p.type)})
              </span>
            </div>
            <div style="font-size:.75rem;color:var(--fh-text-sec)">
              ${fPts(p.points_balance)} pts · ${fUSD(p.points_balance / ppdollar)}
              · lifetime ${fPts(p.points_lifetime)}
            </div>
          </div>
          <button class="fh-btn fh-btn-success fh-btn-sm"
                  data-act="open-award"
                  data-pid="${p.person_id}" data-pname="${p.name}">
            ${I.award}
          </button>
          <button class="fh-btn fh-btn-danger fh-btn-sm"
                  data-act="open-deduct"
                  data-pid="${p.person_id}" data-pname="${p.name}">
            ${I.minus}
          </button>
        </div>`;
    }).join("") || `<div class="fh-empty">No people found.</div>`;

    return `
      <div class="fh-section-title">Point balances</div>
      <div class="fh-task-list">${rows}</div>
      <div style="margin-top:var(--fh-gap);display:flex;gap:var(--fh-gap-sm);flex-wrap:wrap">
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-add-task">
          ${I.plus} Quick task
        </button>
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-add-store-item">
          ${I.store} Add reward
        </button>
      </div>`;
  }

  _htmlAdminApprovals(approvals) {
    if (!approvals.length) return `<div class="fh-empty">No pending approvals. ✓</div>`;
    return `
      <div class="fh-task-list">
        ${approvals.map(a => {
          const color = a.person_color || DEFAULT_COLOR;
          return `
            <div class="fh-queue-row">
              <div class="fh-avatar" style="background:${color}">${ini(a.person_name)}</div>
              <div class="fh-queue-info">
                <div class="fh-queue-name">${a.chore_name}</div>
                <div class="fh-queue-meta">${a.person_name} · ${a.chore_points}pts</div>
              </div>
              <div class="fh-queue-btns">
                <button class="fh-btn fh-btn-success fh-btn-sm"
                        data-act="approve-task" data-tid="${a.task_id}">${I.check}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm"
                        data-act="deny-task" data-tid="${a.task_id}">${I.close}</button>
              </div>
            </div>`;
        }).join("")}
      </div>`;
  }

  _htmlAdminRedemptions(redemptions) {
    if (!redemptions.length) return `<div class="fh-empty">No pending redemptions. ✓</div>`;
    return `
      <div class="fh-task-list">
        ${redemptions.map(r => {
          const color = r.person_color || DEFAULT_COLOR;
          return `
            <div class="fh-queue-row">
              <div class="fh-avatar" style="background:${color}">${ini(r.person_name)}</div>
              <div class="fh-queue-info">
                <div class="fh-queue-name">${r.item_name}</div>
                <div class="fh-queue-meta">${r.person_name} · ${fPts(r.points_cost)}pts</div>
              </div>
              <div class="fh-queue-btns">
                <button class="fh-btn fh-btn-success fh-btn-sm"
                        data-act="approve-redemption" data-rid="${r.redemption_id}">${I.check}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm"
                        data-act="decline-redemption" data-rid="${r.redemption_id}">${I.close}</button>
              </div>
            </div>`;
        }).join("")}
      </div>`;
  }

  _htmlAdminChores(chores, people) {
    // Group by category
    const groups = {};
    for (const c of chores) {
      (groups[c.category] = groups[c.category] || []).push(c);
    }

    const sections = Object.entries(groups).map(([cat, list]) => {
      const rows = list.map(c => {
        const p = people.find(x => x.person_id === c.assigned_to);
        const color = p?.avatar_color || DEFAULT_COLOR;
        return `
          <div class="fh-task-row" style="--row-color:${color}">
            ${p ? `<div class="fh-avatar" style="background:${color}">${ini(p.name)}</div>` : ""}
            <span class="fh-task-name">${c.name}</span>
            <span class="fh-badge fh-badge-pts" style="--row-color:${color}">${c.points}pts</span>
            <button class="fh-btn fh-btn-ghost fh-btn-sm"
                    data-act="open-edit-chore"
                    data-cid="${c.chore_id}"
                    data-cname="${c.name}"
                    data-cpoints="${c.points}"
                    data-capproval="${c.approval_required}"
                    data-cassigned="${c.assigned_to || ""}"
                    data-ccat="${c.category}">
              ${I.edit}
            </button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="delete-chore"
                    data-cid="${c.chore_id}" data-cname="${c.name}">
              ${I.trash}
            </button>
          </div>`;
      }).join("");
      return `
        <div class="fh-section-title">${cap(cat.replace(/_/g," "))}</div>
        <div class="fh-task-list">${rows}</div>`;
    }).join("") || `<div class="fh-empty">No active chores.</div>`;

    return `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--fh-gap-sm)">
        <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="open-add-chore">
          ${I.plus} Add chore
        </button>
      </div>
      ${sections}`;
  }

  _htmlAdminPeople(people) {
    const rows = people.map(p => {
      const color = p.avatar_color || DEFAULT_COLOR;
      return `
        <div class="fh-queue-row">
          <div class="fh-avatar" style="background:${color}">${ini(p.name)}</div>
          <div class="fh-queue-info">
            <div class="fh-queue-name">${p.name}</div>
            <div class="fh-queue-meta">${cap(p.type)} · ${fPts(p.points_balance)}pts</div>
          </div>
          <button class="fh-btn fh-btn-ghost fh-btn-sm"
                  data-act="open-edit-person"
                  data-pid="${p.person_id}"
                  data-pname="${p.name}"
                  data-ptype="${p.type}"
                  data-pcolor="${color}">
            ${I.edit}
          </button>
        </div>`;
    }).join("") || `<div class="fh-empty">No people found.</div>`;

    return `
      <div class="fh-task-list">${rows}</div>
      <div style="margin-top:var(--fh-gap)">
        <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="open-add-person">
          ${I.plus} Add person
        </button>
      </div>`;
  }

  _htmlAdminSettings(familyName, ppdollar, showDollar) {
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
          <span style="font-size:.9rem;flex:1">
            Points per dollar: <strong>${ppdollar}</strong>
          </span>
          <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-settings"
                  data-fname="${familyName}" data-ppd="${ppdollar}">
            ${I.settings} Edit
          </button>
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
   * It is NEVER part of the main card innerHTML, so it is never destroyed by
   * a background data re-render.
   */
  _buildModal() {
    const bg = document.createElement("div");
    bg.className = "fh-modal-bg";
    bg.innerHTML = this._modalHTML();
    // Close on backdrop click
    bg.addEventListener("click", e => {
      if (e.target === bg) this._closeModal();
    });
    return bg;
  }

  _modalHTML() {
    const m = this._modal;
    if (!m) return "";
    switch (m.type) {
      case "award":
      case "deduct":          return this._mPointAdjust(m);
      case "add-task":        return this._mAddTask(m);
      case "add-chore":       return this._mAddChore(m);
      case "edit-chore":      return this._mEditChore(m);
      case "add-store-item":  return this._mAddStoreItem(m);
      case "add-person":      return this._mAddPerson(m);
      case "edit-person":     return this._mEditPerson(m);
      case "edit-settings":   return this._mEditSettings(m);
      case "claim":           return this._mClaim(m);
      case "add-reminder":    return this._mAddReminder(m);
      default: return "";
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
         <div class="fh-row" style="gap:var(--fh-gap-sm)">
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
       <input type="hidden" id="m-pid" value="${m.data.pid}">
       <input type="hidden" id="m-amode" value="${m.type}">`,
      isAward ? "Award" : "Deduct",
      "ok-point-adjust",
      isAward ? "fh-btn-success" : "fh-btn-danger"
    );
  }

  _mAddTask(m) {
    const people = this._people();
    return this._mWrap("Add one-time task",
      `<div class="fh-field">
         <label class="fh-label">Task name *</label>
         <input class="fh-input" id="m-tname" type="text" autofocus>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Assign to</label>
           <select class="fh-select" id="m-tperson">
             <option value="">Anyone</option>
             ${people.map(p => `<option value="${p.person_id}">${p.name}</option>`).join("")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Points</label>
           <input class="fh-input" id="m-tpts" type="number" min="0" value="10">
         </div>
       </div>`,
      "Add task", "ok-add-task");
  }

  _mAddChore(m) {
    const people = this._people();
    return this._mWrap("Add chore",
      `<div class="fh-field">
         <label class="fh-label">Chore name *</label>
         <input class="fh-input" id="m-cname" type="text" autofocus>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Category</label>
           <select class="fh-select" id="m-ccat">
             ${opts([
               {value:"assigned",         label:"Assigned"},
               {value:"claimable",        label:"Claimable"},
               {value:"maintenance",      label:"Maintenance"},
               {value:"personal_reminder",label:"Personal Reminder"},
               {value:"one_time",         label:"One-time"},
             ], "assigned")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Assign to</label>
           <select class="fh-select" id="m-cperson">
             <option value="">Unassigned</option>
             ${people.map(p => `<option value="${p.person_id}">${p.name}</option>`).join("")}
           </select>
         </div>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Recurrence</label>
           <select class="fh-select" id="m-crec">
             ${opts([
               {value:"daily",            label:"Daily"},
               {value:"weekly",           label:"Weekly"},
               {value:"every_n_days",     label:"Every N days"},
               {value:"every_n_weeks",    label:"Every N weeks"},
               {value:"monthly_on_date",  label:"Monthly"},
               {value:"one_time",         label:"One-time"},
             ], "daily")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Points</label>
           <input class="fh-input" id="m-cpts" type="number" min="0" value="10">
         </div>
       </div>
       <div class="fh-checkbox-row">
         <input type="checkbox" id="m-cappr" checked>
         <label for="m-cappr" style="font-size:.88rem">Requires parent approval</label>
       </div>`,
      "Add chore", "ok-add-chore");
  }

  _mEditChore(m) {
    const d = m.data;
    const people = this._people();
    return this._mWrap(`Edit — ${d.cname}`,
      `<div class="fh-field">
         <label class="fh-label">Chore name *</label>
         <input class="fh-input" id="m-cname" type="text" value="${d.cname}" autofocus>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Category</label>
           <select class="fh-select" id="m-ccat">
             ${opts([
               {value:"assigned",         label:"Assigned"},
               {value:"claimable",        label:"Claimable"},
               {value:"maintenance",      label:"Maintenance"},
               {value:"personal_reminder",label:"Personal Reminder"},
               {value:"one_time",         label:"One-time"},
             ], d.ccat)}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Assign to</label>
           <select class="fh-select" id="m-cperson">
             <option value="">Unassigned</option>
             ${people.map(p =>
               `<option value="${p.person_id}" ${p.person_id === d.cassigned ? "selected" : ""}>${p.name}</option>`
             ).join("")}
           </select>
         </div>
       </div>
       <div class="fh-field">
         <label class="fh-label">Points</label>
         <input class="fh-input" id="m-cpts" type="number" min="0" value="${d.cpoints}">
       </div>
       <div class="fh-checkbox-row">
         <input type="checkbox" id="m-cappr" ${d.capproval === "true" || d.capproval === true ? "checked" : ""}>
         <label for="m-cappr" style="font-size:.88rem">Requires parent approval</label>
       </div>
       <input type="hidden" id="m-cid" value="${d.cid}">`,
      "Save changes", "ok-edit-chore");
  }

  _mAddStoreItem(m) {
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
           <input class="fh-input" id="m-sdollar" type="number" min="0.01" step="0.01" placeholder="e.g. 5.00">
         </div>
         <div class="fh-field">
           <label class="fh-label">Scope</label>
           <select class="fh-select" id="m-sscope">
             <option value="common">All kids</option>
             <option value="personal">One person</option>
           </select>
         </div>
       </div>
       <div class="fh-field">
         <label class="fh-label">Person (if personal)</label>
         <select class="fh-select" id="m-sperson">
           <option value="">—</option>
           ${this._people().map(p => `<option value="${p.person_id}">${p.name}</option>`).join("")}
         </select>
       </div>`,
      "Add reward", "ok-add-store-item");
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
           <input class="fh-input" id="m-pcolor" type="color" value="${DEFAULT_COLOR}" style="height:42px;padding:4px">
         </div>
       </div>`,
      "Add person", "ok-add-person");
  }

  _mEditPerson(m) {
    const d = m.data;
    return this._mWrap(`Edit — ${d.pname}`,
      `<div class="fh-field">
         <label class="fh-label">Name *</label>
         <input class="fh-input" id="m-pname" type="text" value="${d.pname}" autofocus>
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
           <input class="fh-input" id="m-pcolor" type="color" value="${d.pcolor}" style="height:42px;padding:4px">
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
         <input class="fh-input" id="m-fname" type="text" value="${d.fname}" autofocus>
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
           ${people.map(p => `<option value="${p.person_id}">${p.name}</option>`).join("")}
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
                placeholder="e.g. CPAP mask clean, Eye drops">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Who?</label>
           <select class="fh-select" id="m-rperson">
             ${people.map(p =>
               `<option value="${p.person_id}" ${m.data?.pid === p.person_id ? "selected" : ""}>${p.name}</option>`
             ).join("")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Recurrence</label>
           <select class="fh-select" id="m-rrec">
             ${opts([
               {value:"daily",           label:"Daily"},
               {value:"weekly",          label:"Weekly"},
               {value:"every_n_days",    label:"Every N days"},
               {value:"monthly_on_date", label:"Monthly"},
             ], "daily")}
           </select>
         </div>
       </div>`,
      "Add", "ok-add-reminder");
  }

  // ---- Event binding & dispatch -------------------------------------------

  _closeModal() {
    this._modal = null;
    this._doRender(true);
  }

  _bindEvents() {
    const root = this.shadowRoot;

    root.addEventListener("click", e => {
      const el = e.target.closest("[data-act]");
      if (!el) return;
      this._dispatch(el.dataset.act, el);
    }, { once: false });

    root.addEventListener("change", e => {
      if (e.target.dataset.act === "toggle-dollar") {
        this._svc("update_settings", { show_dollar_value_to_kids: e.target.checked });
      }
    });
  }

  _dispatch(act, el) {
    const sr = this.shadowRoot;
    const v  = id => sr.getElementById(id)?.value ?? "";
    const b  = id => sr.getElementById(id)?.checked ?? false;

    switch (act) {

      // Navigation
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

      // Task completion
      case "complete": {
        const tid = el.dataset.tid;
        const pid = el.dataset.pid;
        if (!tid || !pid) break;
        this._svc("complete_task", { task_id: tid, person_id: pid });
        this._flashing.add(tid);
        setTimeout(() => { this._flashing.delete(tid); }, FLASH_MS + 100);
        this._doRender(true);
        break;
      }

      // Task / redemption approvals
      case "approve-task": {
        const parent = this._people().find(p => p.type === "parent");
        this._svc("approve_task", { task_id: el.dataset.tid, approved_by: parent?.person_id || "" });
        break;
      }
      case "deny-task": {
        const parent = this._people().find(p => p.type === "parent");
        this._svc("deny_task", { task_id: el.dataset.tid, denied_by: parent?.person_id || "" });
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

      // Store redemption request
      case "redeem":
        this._svc("request_redemption", { person_id: el.dataset.pid, item_id: el.dataset.iid });
        break;

      // Delete chore
      case "delete-chore":
        if (!confirm(`Delete "${el.dataset.cname}"? This cannot be undone.`)) break;
        this._svc("delete_chore", { chore_id: el.dataset.cid });
        break;

      // Backup
      case "export-backup":
        this._svc("export_backup", {});
        break;

      // Open modals
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
      case "open-edit-chore":
        this._modal = { type: "edit-chore", data: {
          cid:      el.dataset.cid,
          cname:    el.dataset.cname,
          cpoints:  el.dataset.cpoints,
          capproval:el.dataset.capproval,
          cassigned:el.dataset.cassigned,
          ccat:     el.dataset.ccat,
        }};
        this._doRender(true);
        break;
      case "open-add-store-item":
        this._modal = { type: "add-store-item", data: {} };
        this._doRender(true);
        break;
      case "open-add-person":
        this._modal = { type: "add-person", data: {} };
        this._doRender(true);
        break;
      case "open-edit-person":
        this._modal = { type: "edit-person", data: {
          pid:   el.dataset.pid,
          pname: el.dataset.pname,
          ptype: el.dataset.ptype,
          pcolor:el.dataset.pcolor,
        }};
        this._doRender(true);
        break;
      case "open-edit-settings":
        this._modal = { type: "edit-settings", data: {
          fname: el.dataset.fname,
          ppd:   el.dataset.ppd,
        }};
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

      // Close modal
      case "close-modal":
        this._closeModal();
        break;

      // Modal confirmations
      case "ok-point-adjust": {
        const amount  = parseFloat(v("m-amount"));
        const atype   = v("m-atype");
        const reason  = v("m-reason");
        const pid     = v("m-pid");
        const amode   = v("m-amode");
        if (!amount || amount <= 0) break;
        const data = { person_id: pid, reason };
        if (atype === "dollars") data.dollar_amount = amount;
        else data.points = Math.round(amount);
        this._svc(amode === "award" ? "award_bonus_points" : "deduct_points", data);
        this._closeModal();
        break;
      }

      case "ok-add-task": {
        const name = v("m-tname").trim();
        if (!name) break;
        const data = { name, points: parseInt(v("m-tpts") || "0") };
        const pid = v("m-tperson");
        if (pid) data.assigned_to = pid;
        this._svc("add_one_time_task", data);
        this._closeModal();
        break;
      }

      case "ok-add-chore": {
        const name = v("m-cname").trim();
        if (!name) break;
        const data = {
          name,
          category:         v("m-ccat"),
          recurrence_type:  v("m-crec"),
          points:           parseInt(v("m-cpts") || "0"),
          approval_required: b("m-cappr"),
        };
        const pid = v("m-cperson");
        if (pid) data.assigned_to = pid;
        this._svc("add_chore", data);
        this._closeModal();
        break;
      }

      case "ok-edit-chore": {
        const name = v("m-cname").trim();
        if (!name) break;
        const data = {
          chore_id:          v("m-cid"),
          name,
          points:            parseInt(v("m-cpts") || "0"),
          approval_required: b("m-cappr"),
        };
        const cat = v("m-ccat");
        if (cat) data.category = cat;
        const pid = v("m-cperson");
        if (pid) data.assigned_to = pid;
        this._svc("update_chore", data);
        this._closeModal();
        break;
      }

      case "ok-add-store-item": {
        const name   = v("m-sname").trim();
        const dollar = parseFloat(v("m-sdollar"));
        if (!name || !dollar || dollar <= 0) break;
        const data = { name, dollar_value: dollar, scope: v("m-sscope") };
        const desc = v("m-sdesc").trim();
        if (desc) data.description = desc;
        const pid = v("m-sperson");
        if (pid && data.scope === "personal") data.person_id = pid;
        this._svc("add_store_item", data);
        this._closeModal();
        break;
      }

      case "ok-add-person": {
        const name = v("m-pname").trim();
        if (!name) break;
        this._svc("add_person", {
          name,
          person_type:  v("m-ptype"),
          avatar_color: v("m-pcolor"),
        });
        this._closeModal();
        break;
      }

      case "ok-edit-person": {
        const name = v("m-pname").trim();
        if (!name) break;
        this._svc("update_person", {
          person_id:    v("m-pid"),
          name,
          avatar_color: v("m-pcolor"),
        });
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
          category:         "personal_reminder",
          assigned_to:      pid,
          recurrence_type:  v("m-rrec"),
          approval_required: false,
          points:           0,
        });
        this._closeModal();
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Visual editor element
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
    const cfg     = this._cfg || {};
    const people  = this._people || [];
    const mode    = cfg.mode    || "command_center";
    const person  = cfg.person  || "";

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
              ["command_center","Command Center (kitchen display)"],
              ["personal",      "Personal Dashboard"],
              ["maintenance",   "Maintenance"],
              ["admin",         "Admin Panel"],
            ].map(([v,l]) => `<option value="${v}" ${v===mode?"selected":""}>${l}</option>`).join("")}
          </select>
        </div>
        <div class="fhe-field" id="person-field"
             style="display:${mode === "personal" ? "flex" : "none"}">
          <label class="fhe-label">Person</label>
          ${people.length
            ? `<select class="fhe-select" id="e-person">
                 ${people.map(p =>
                   `<option value="${p.name.toLowerCase()}"
                            ${p.name.toLowerCase()===person?"selected":""}>${p.name}</option>`
                 ).join("")}
               </select>`
            : `<input class="fhe-input" id="e-person" type="text" value="${person}"
                      placeholder="e.g. jackson">`}
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
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._cfg }, bubbles: true, composed: true }));
  }
}

// ---------------------------------------------------------------------------
// Register both elements
// ---------------------------------------------------------------------------

customElements.define("family-hub-card", FamilyHubCard);
customElements.define("family-hub-card-editor", FamilyHubCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        "family-hub-card",
  name:        "Family Hub",
  description: "Family task management — command center, personal, maintenance, and admin views.",
  preview:     false,
  configurable: true,
});

console.info(
  `%c FAMILY-HUB-CARD %c v${VERSION} `,
  "background:#7F77DD;color:#fff;font-weight:700;border-radius:4px 0 0 4px",
  "background:#1c1c1e;color:#fff;font-weight:400;border-radius:0 4px 4px 0"
);

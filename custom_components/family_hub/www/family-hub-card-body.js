var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/card/css.js
var CSS;
var init_css = __esm({
  "src/card/css.js"() {
    CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=JetBrains+Mono:wght@400;700&family=Manrope:wght@400;600;700&family=DM+Serif+Display&family=Caveat:wght@600;700&family=Cinzel:wght@600;700&family=Crimson+Pro:ital,wght@0,400;1,400&family=Bree+Serif&display=swap');

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
    --fh-text-scale:  1;

    /* Typography scale (v0.6.0 S7 \xE2\u20AC\u201D hard floor 12px / .75rem)
       NEVER write a font-size below --fh-text-xs. Use these tokens for everything.
       All scale with --fh-text-scale (Small .9 / Default 1 / Large 1.25 / XL 1.5). */
    --fh-text-xs:   calc(.75rem  * var(--fh-text-scale, 1));   /* 12px \xE2\u20AC\u201D FLOOR. Mono badges, timestamps only */
    --fh-text-sm:   calc(.875rem * var(--fh-text-scale, 1));   /* 14px \xE2\u20AC\u201D secondary labels, meta */
    --fh-text-base: calc(1rem    * var(--fh-text-scale, 1));   /* 16px \xE2\u20AC\u201D body text, chore names */
    --fh-text-md:   calc(1.125rem * var(--fh-text-scale, 1));  /* 18px \xE2\u20AC\u201D card titles, prominent stats */
    --fh-text-lg:   calc(1.375rem * var(--fh-text-scale, 1));  /* 22px \xE2\u20AC\u201D page titles, topbar */
    --fh-text-xl:   calc(1.75rem * var(--fh-text-scale, 1));   /* 28px \xE2\u20AC\u201D big stat numbers */
    --fh-text-2xl:  calc(2.25rem * var(--fh-text-scale, 1));   /* 36px \xE2\u20AC\u201D DBZ / kid-mode hero */

    /* v0.6.0 font stack \xE2\u20AC\u201D Bricolage for headings, JetBrains for stats, Manrope for body */
    --fh-font-heading: "Bricolage Grotesque", "DM Sans", system-ui, sans-serif;
    --fh-font-mono:    "JetBrains Mono", "Courier New", monospace;
    --fh-font-body:    "Manrope", "Inter", var(--paper-font-body1_-_font-family, -apple-system, Roboto, sans-serif);
    font-family: var(--fh-font-body);
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
  .fh-title        { font-size:calc(1.1rem * var(--fh-text-scale, 1)); font-weight:700; margin:0 0 var(--fh-gap) 0; }
  .fh-section-title {
    font-size:calc(.88rem * var(--fh-text-scale, 1)); font-weight:700; letter-spacing:.07em;
    text-transform:uppercase; color:var(--fh-text-sec);
    margin:var(--fh-gap) 0 var(--fh-gap-sm) 0;
  }
  .fh-balance      { font-size:calc(3.4rem * var(--fh-text-scale, 1)); font-weight:800; line-height:1; letter-spacing:-.03em; }
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
    border-radius:6px; font-size:.95rem; font-weight:500;
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
    flex:1; font-size:calc(1.05rem * var(--fh-text-scale, 1)); font-weight:500;
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
    font-size:calc(.82rem * var(--fh-text-scale, 1)); font-weight:700; padding:2px 8px; border-radius:10px;
    white-space:nowrap; flex-shrink:0;
  }
  .fh-badge-overdue  { color:var(--fh-overdue); background:var(--fh-overdue-bg); }
  .fh-badge-pending  { color:var(--fh-warning);  background:var(--fh-warning-bg); }
  .fh-badge-success  { color:var(--fh-success);  background:var(--fh-success-bg); }
  .fh-badge-pts {
    color:var(--row-color, var(--fh-accent));
    background:color-mix(in srgb, var(--row-color, var(--fh-accent)) 14%, transparent);
  }
  .fh-badge-expiry   { color:var(--fh-warning); background:var(--fh-warning-bg); }
  .fh-badge-requested { color:var(--fh-accent); background:color-mix(in srgb, var(--fh-accent) 15%, transparent); }
  .fh-badge-reset    { color:var(--fh-text-sec); background:var(--fh-surface); border:1px solid var(--fh-border); }
  .fh-badge-streak   { color:var(--fh-warning); background:var(--fh-warning-bg); }

  /* Penalty warning */
  .fh-penalty-warn {
    font-size:calc(.7rem * var(--fh-text-scale, 1)); color:var(--fh-warning); white-space:nowrap; flex-shrink:0;
  }

  /* Description toggle button */
  .fh-desc-btn {
    width:18px; height:18px; border-radius:50%; flex-shrink:0;
    border:1.5px solid var(--fh-text-sec); background:transparent;
    color:var(--fh-text-sec); font-size:.75rem; font-weight:800;
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
    border:none; font-size:calc(.84rem * var(--fh-text-scale, 1)); font-weight:600;
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
  .fh-hist-meta  { font-size:.75rem; color:var(--fh-text-sec); }
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
    margin-bottom:6px;
  }
  .fh-maint-row.overdue { border-left-color:var(--fh-overdue); }
  .fh-maint-row.soon    { border-left-color:var(--fh-warning); }
  .fh-maint-row.ok      { border-left-color:var(--fh-success); }

  /* Maintenance drill-down (v0.6.0 room aesthetic) */
  .fh-maint-head {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:var(--fh-gap);
  }
  .fh-maint-title {
    font-family:var(--fh-font-heading); font-size:1.1rem; font-weight:800;
    letter-spacing:.08em; text-transform:uppercase; color:var(--fh-text-sec);
  }
  .fh-maint-stat-strip {
    display:flex; align-items:center;
    padding:12px var(--fh-pad); background:var(--fh-surface);
    border-radius:var(--fh-radius-sm); margin-bottom:var(--fh-gap);
  }
  .fh-maint-stat { display:flex; flex-direction:column; align-items:center; flex:1; }
  .fh-maint-stat--bad .fh-maint-stat-num { color:var(--fh-overdue); }
  .fh-maint-stat-num {
    font-family:var(--fh-font-mono); font-size:1.6rem; font-weight:800;
    color:var(--fh-accent); line-height:1;
  }
  .fh-maint-stat-lbl {
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:700;
    color:var(--fh-text-sec); letter-spacing:.06em;
  }
  .fh-maint-stat-div { width:1px; height:32px; background:var(--fh-border); flex-shrink:0; }
  .fh-maint-section { margin-bottom:var(--fh-gap); }
  .fh-maint-section-hdr {
    display:flex; align-items:center; gap:8px;
    font-family:var(--fh-font-mono); font-size:.78rem; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase;
    color:var(--fh-text-sec); margin-bottom:var(--fh-gap-sm);
    padding-bottom:4px; border-bottom:1px solid var(--fh-border);
  }
  .fh-maint-section-hdr.overdue   { color:var(--fh-overdue); border-bottom-color:rgba(255,69,58,.3); }
  .fh-maint-section-hdr.this-week { color:var(--fh-warning); border-bottom-color:rgba(255,159,10,.3); }
  .fh-maint-section-hdr.next-week { color:var(--fh-success); border-bottom-color:rgba(48,209,88,.3);  }
  .fh-maint-section-count {
    background:var(--fh-bg); border-radius:10px;
    padding:1px 8px; font-size:.75rem; font-family:var(--fh-font-mono);
  }
  .fh-maint-row-body { flex:1; min-width:0; }
  .fh-maint-row-name {
    font-size:1.05rem; font-weight:600;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-maint-row-desc {
    font-size:.82rem; color:var(--fh-text-sec); line-height:1.4; margin-top:3px;
    white-space:normal;
  }
  .fh-maint-days-badge {
    font-size:.78rem; font-weight:700; white-space:nowrap; flex-shrink:0;
    padding:3px 8px; border-radius:10px;
  }
  .fh-maint-days-badge.overdue { color:var(--fh-overdue); background:var(--fh-overdue-bg); }
  .fh-maint-days-badge.soon    { color:var(--fh-warning);  background:var(--fh-warning-bg);  }
  .fh-maint-days-badge.ok      { color:var(--fh-success);  background:var(--fh-success-bg);  }
  .fh-maint-empty {
    text-align:center; padding:40px var(--fh-pad);
    display:flex; flex-direction:column; align-items:center; gap:8px;
  }
  .fh-maint-empty-icon { font-size:3rem; line-height:1; }
  .fh-maint-empty-text {
    font-family:var(--fh-font-heading); font-size:1.3rem; font-weight:800;
  }
  .fh-maint-empty-sub { font-size:.9rem; color:var(--fh-text-sec); }

  /* Room feature list \xE2\u20AC\u201D polished coming-soon screens */
  .fh-room-feature-list {
    display:flex; flex-direction:column; gap:8px;
    width:100%; max-width:420px; margin:8px 0; text-align:left;
  }
  .fh-room-feature {
    display:flex; align-items:flex-start; gap:12px;
    padding:10px 14px; background:var(--fh-surface);
    border-radius:var(--fh-radius-sm); border:1px solid var(--fh-border);
  }
  .fh-room-feature-icon { font-size:1.4rem; line-height:1.2; flex-shrink:0; }
  .fh-room-feature-body { flex:1; min-width:0; }
  .fh-room-feature-name {
    font-family:var(--fh-font-heading); font-size:.95rem; font-weight:700;
    color:var(--fh-text);
  }
  .fh-room-feature-desc {
    font-size:.82rem; color:var(--fh-text-sec); margin-top:2px; line-height:1.4;
  }

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
    min-width:52px; height:32px; padding:0 8px; border-radius:6px;
    border:1.5px solid var(--fh-border); background:var(--fh-surface);
    font-size:.78rem; font-weight:600; cursor:pointer; user-select:none;
    transition:border-color .12s, background .12s, color .12s;
  }
  .fh-wd-chip input[type=checkbox],
  .fh-wd-chip input[type=radio] { display:none; }
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

  /* Icon picker category headers and per-category subgrids (S9 P3) \u2014 used by
     the always-visible .fh-chore-icon-grid block (see further down). */
  .fh-icon-picker-cat-hdr {
    font-family:var(--fh-font-mono); font-size:var(--fh-text-xs);
    font-weight:700; letter-spacing:.16em; text-transform:uppercase;
    color:var(--fh-text-sec); margin:6px 4px 4px;
    padding-bottom:3px; border-bottom:1px dashed var(--fh-border);
  }
  .fh-icon-picker-cat-hdr:first-child { margin-top:0; }
  .fh-icon-picker-cat-grid {
    display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px;
  }
  .fh-icon-cell {
    display:flex; flex-direction:column; align-items:center; gap:3px;
    padding:8px 6px; border-radius:6px; border:2px solid transparent;
    background:transparent; cursor:pointer; width:62px;
    transition:background .12s, border-color .12s;
  }
  .fh-icon-cell:hover { background:var(--fh-bg); }
  .fh-icon-cell.selected { border-color:var(--fh-accent); background:var(--fh-bg); }
  .fh-icon-cell-label {
    font-size:.75rem; color:var(--fh-text-sec); text-align:center;
    line-height:1.2; max-width:56px; overflow:hidden;
    text-overflow:ellipsis; white-space:nowrap;
  }

  /* Field help text (S9 P3 \u2014 inline guidance under inputs) */
  .fh-field-help {
    font-size:var(--fh-text-xs);
    color:var(--fh-text-sec);
    margin-top:4px;
    line-height:1.35;
  }
  .fh-field-help code {
    font-family:var(--fh-font-mono); font-size:.95em;
    padding:1px 4px; border-radius:3px;
    background:var(--fh-surface); color:var(--fh-text);
  }

  /* Theme picker with accent swatch (S9 P3 \u2014 Edit Person modal) */
  .fh-theme-pick {
    display:flex; align-items:center; gap:10px;
  }
  .fh-theme-swatch {
    width:28px; height:28px; flex-shrink:0;
    border-radius:6px;
    border:2px solid var(--fh-border);
    box-shadow:inset 0 0 0 2px var(--fh-bg);
  }

  /* Modal sections (S9 P3 \u2014 used by chore editor + Hub Layout settings) */
  .fh-modal-section {
    margin:0 0 var(--fh-gap);
    padding:var(--fh-gap-sm) 0 0;
    border-top:1px solid var(--fh-border);
  }
  .fh-modal-section:first-of-type { border-top:none; padding-top:0; }
  .fh-modal-section-hdr {
    display:flex; align-items:baseline; gap:10px;
    margin-bottom:var(--fh-gap-sm);
  }
  .fh-modal-section-lbl {
    font-family:var(--fh-font-heading);
    font-size:var(--fh-text-base); font-weight:800;
    letter-spacing:.04em; color:var(--fh-text);
  }
  .fh-modal-section-sub {
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-xs); letter-spacing:.08em;
    color:var(--fh-text-sec); text-transform:lowercase;
  }

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

  /* Skipped-chore rollup group */
  .fh-hist-group {
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
    border-left:3px solid var(--fh-warning); overflow:hidden;
  }
  .fh-hist-group-hdr {
    display:flex; align-items:center; gap:var(--fh-gap-sm);
    padding:var(--fh-pad-xs) var(--fh-pad-sm);
    cursor:pointer; user-select:none;
  }
  .fh-hist-group-hdr:hover { background:color-mix(in srgb, var(--fh-warning) 6%, transparent); }
  .fh-hist-expand-icon { font-size:.75rem; color:var(--fh-text-sec); flex-shrink:0; }
  .fh-hist-subitems {
    border-top:1px solid var(--fh-border);
    display:flex; flex-direction:column; gap:1px;
  }
  .fh-hist-subrow {
    display:flex; align-items:center; gap:var(--fh-gap-sm);
    padding:6px var(--fh-pad-sm);
    background:color-mix(in srgb, var(--fh-surface) 60%, var(--fh-bg));
  }
  .fh-hist-subrow:hover { background:var(--fh-surface); }

  /* Approval dot on person filter chips */
  .fh-chip-approval-dot {
    width:8px; height:8px; border-radius:50%;
    background:var(--fh-overdue); flex-shrink:0;
  }

  /* Penalty pause row \xE2\u20AC\u201D separate row below person row in admin overview */
  .fh-penalty-pause-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:4px var(--fh-pad-sm) var(--fh-pad-xs) var(--fh-pad-sm);
    margin-top:-4px;
    background:var(--fh-surface); border-radius:0 0 var(--fh-radius-sm) var(--fh-radius-sm);
    border-top:1px solid var(--fh-border);
  }
  .fh-penalty-pause-label {
    font-size:calc(.75rem * var(--fh-text-scale, 1)); color:var(--fh-text-sec);
  }
  .fh-penalty-pause-label.off       { color:var(--fh-warning); }
  .fh-penalty-pause-label.off-global { color:var(--fh-overdue); }

  /* Responsive */
  @container fh (min-width: 680px) {
    .fh-store-grid { grid-template-columns:repeat(auto-fill, minmax(170px, 1fr)); }
    .fh-balance    { font-size:calc(4rem * var(--fh-text-scale, 1)); }
  }
  @container fh (min-width: 900px) {
    .fh-balance { font-size:calc(4.8rem * var(--fh-text-scale, 1)); }
  }

  /* ===== v0.6.0 Home Page ===== */

  /* Back-navigation bar */
  .fh-nav-back-bar {
    display:flex; align-items:center; gap:8px;
    padding:12px var(--fh-pad); margin-bottom:var(--fh-gap);
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
    cursor:pointer; user-select:none;
    font-size:.92rem; font-weight:600; color:var(--fh-accent);
    transition:background .15s;
  }
  .fh-nav-back-bar:hover  { background:color-mix(in srgb, var(--fh-accent) 10%, var(--fh-surface)); }
  .fh-nav-back-bar:active { background:color-mix(in srgb, var(--fh-accent) 18%, var(--fh-surface)); }
  .fh-nav-back-chevron { font-size:1.15rem; line-height:1; }

  /* Home header */
  .fh-home-header {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:var(--fh-gap);
  }
  .fh-home-family {
    font-family:var(--fh-font-heading); font-size:1.45rem; font-weight:800;
    letter-spacing:-.02em; line-height:1;
  }
  .fh-home-header-right { display:flex; align-items:center; gap:10px; }
  .fh-home-date { font-size:.85rem; color:var(--fh-text-sec); font-weight:600; }
  .fh-home-paused-pill {
    font-size:.75rem; font-weight:800; letter-spacing:.09em;
    padding:3px 10px; border-radius:20px;
    background:var(--fh-warning-bg); color:var(--fh-warning);
    border:1.5px solid var(--fh-warning);
  }

  /* Section label */
  .fh-home-section { margin-bottom:var(--fh-gap); }
  .fh-home-section-label {
    font-family:var(--fh-font-mono); font-size:.80rem; font-weight:700;
    letter-spacing:.1em; color:var(--fh-text-sec); text-transform:uppercase;
    margin-bottom:var(--fh-gap-sm);
  }

  /* Agent tiles row */
  .fh-home-agents-row {
    display:flex; gap:var(--fh-gap-sm);
    overflow-x:auto; padding-bottom:2px;
  }
  .fh-home-agent-tile {
    flex:1; min-width:110px;
    display:flex; flex-direction:column; align-items:flex-start; gap:4px;
    padding:14px 12px 12px;
    background:linear-gradient(160deg, var(--tile-tint, var(--fh-surface)) 0%, var(--fh-surface) 60%);
    border-radius:var(--fh-radius);
    border:1.5px solid transparent;
    cursor:pointer; user-select:none; position:relative; overflow:hidden;
    transition:border-color .15s, background .15s;
  }
  .fh-home-agent-tile:hover  { border-color:var(--tile-color, var(--fh-accent)); }
  .fh-home-agent-tile:active {
    background:color-mix(in srgb, var(--tile-color, var(--fh-accent)) 10%, var(--fh-surface));
  }
  .fh-home-agent-sigil {
    position:absolute; right:8px; top:8px;
    font-size:2.4rem; line-height:1; opacity:.12;
    pointer-events:none; user-select:none;
  }
  .fh-home-agent-pending-dot {
    position:absolute; top:8px; right:8px;
    width:9px; height:9px; border-radius:50%; background:var(--fh-warning);
  }
  .fh-home-agent-code {
    font-family:var(--fh-font-mono); font-size:.84rem; font-weight:600;
    color:var(--tile-color, var(--fh-accent)); letter-spacing:.06em; white-space:nowrap;
  }
  .fh-home-agent-name {
    font-size:1.05rem; font-weight:700; color:var(--fh-text);
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;
  }
  .fh-home-agent-sublabel {
    font-family:var(--fh-font-mono); font-size:.80rem; font-weight:600;
    color:var(--fh-text-sec); letter-spacing:.05em; white-space:nowrap;
  }
  .fh-home-agent-spacer { flex:1; min-height:8px; }
  .fh-home-agent-dual {
    display:flex; align-items:center; width:100%; margin-top:4px;
  }
  .fh-home-agent-stat {
    display:flex; flex-direction:column; align-items:center; flex:1;
  }
  .fh-home-agent-stat-num {
    font-family:var(--fh-font-mono); font-size:1.5rem; font-weight:800;
    color:var(--tile-color, var(--fh-accent)); line-height:1;
  }
  .fh-home-agent-stat-lbl {
    font-family:var(--fh-font-mono); font-size:.78rem; font-weight:700;
    color:var(--fh-text-sec); letter-spacing:.06em;
  }
  .fh-home-agent-stat-div {
    width:1px; height:28px; background:var(--fh-border); flex-shrink:0; margin:0 4px;
  }
  .fh-home-agent-allowance {
    font-family:var(--fh-font-mono); font-size:.76rem; font-weight:700;
    color:var(--fh-text-sec); letter-spacing:.04em;
    margin-top:4px; padding:2px 6px;
    background:var(--fh-bg); border-radius:4px;
  }

  /* Room tiles grid */
  .fh-home-rooms-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));
    gap:var(--fh-gap-sm);
  }
  .fh-home-room-tile {
    display:flex; align-items:flex-start; gap:12px;
    padding:14px 16px;
    background:var(--fh-surface); border-radius:var(--fh-radius);
    border:1.5px solid transparent;
    cursor:pointer; user-select:none;
    transition:border-color .15s, background .15s;
  }
  .fh-home-room-tile.live {
    border-color:color-mix(in srgb, var(--room-accent) 25%, transparent);
  }
  .fh-home-room-tile.live:hover {
    border-color:var(--room-accent);
    background:color-mix(in srgb, var(--room-accent) 7%, var(--fh-surface));
  }
  .fh-home-room-tile.live:active {
    background:color-mix(in srgb, var(--room-accent) 14%, var(--fh-surface));
  }
  .fh-home-room-tile.coming { opacity:.6; cursor:default; }
  .fh-home-room-tile.coming:hover { border-color:transparent; background:var(--fh-surface); }
  .fh-home-room-icon {
    width:36px; height:36px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center; margin-top:1px;
  }
  .fh-home-room-icon svg { width:28px; height:28px; }
  .fh-home-room-body { flex:1; min-width:0; }
  .fh-home-room-label {
    font-family:var(--fh-font-heading); font-size:1.05rem; font-weight:800;
    letter-spacing:.02em; margin-bottom:2px; color:var(--fh-text);
  }
  .fh-home-room-sub  { font-size:.88rem; color:var(--fh-text-sec); margin-bottom:6px; }
  .fh-home-room-stats { display:flex; gap:var(--fh-gap); flex-wrap:wrap; }
  .fh-home-room-stat  { display:flex; align-items:baseline; gap:4px; }
  .fh-home-room-stat-num {
    font-family:var(--fh-font-mono); font-size:1.2rem; font-weight:800;
  }
  .fh-home-room-stat-lbl { font-size:.85rem; color:var(--fh-text-sec); }
  .fh-home-room-coming {
    display:inline-block; font-size:.78rem; font-weight:800; letter-spacing:.08em;
    padding:2px 8px; border-radius:10px;
    background:var(--fh-bg); color:var(--fh-text-sec);
    border:1px solid var(--fh-border); margin-bottom:4px;
  }
  .fh-home-room-preview { font-size:.88rem; color:var(--fh-text-sec); line-height:1.4; }

  /* Today strip */
  .fh-home-today-strip {
    display:flex; align-items:center; gap:var(--fh-gap);
    padding:12px var(--fh-pad);
    background:var(--fh-surface); border-radius:var(--fh-radius-sm);
    margin-top:var(--fh-gap-sm);
  }
  .fh-home-today-weather {
    display:flex; align-items:center; gap:8px;
    padding-right:var(--fh-gap); border-right:1px solid var(--fh-border);
    flex-shrink:0;
  }
  .fh-home-today-weather-icon {
    width:28px; height:28px; color:var(--fh-warning);
    display:flex; align-items:center; justify-content:center;
  }
  .fh-home-today-weather-icon svg { width:24px; height:24px; }
  .fh-home-today-temp  { font-family:var(--fh-font-mono); font-size:1rem; font-weight:700; }
  .fh-home-today-cond  { font-size:.75rem; color:var(--fh-text-sec); }
  .fh-home-today-flex  { flex:1; display:flex; align-items:center; }
  .fh-home-today-approvals { display:flex; align-items:center; gap:6px; }
  .fh-home-today-approvals-badge {
    min-width:22px; height:22px; border-radius:11px;
    background:var(--fh-warning); color:#000;
    font-size:.78rem; font-weight:800;
    display:inline-flex; align-items:center; justify-content:center; padding:0 5px;
  }
  .fh-home-today-approvals-lbl { font-size:.95rem; color:var(--fh-text-sec); font-weight:600; }
  .fh-home-today-quiet { font-size:.95rem; color:var(--fh-text-sec); }

  /* Coming-soon full screen */
  .fh-home-coming-screen {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; padding:var(--fh-pad) var(--fh-pad);
    min-height:220px; gap:var(--fh-gap-sm);
  }
  .fh-home-coming-icon { width:64px; height:64px; }
  .fh-home-coming-icon svg { width:64px; height:64px; }
  .fh-home-coming-label {
    font-family:var(--fh-font-heading); font-size:1.4rem; font-weight:800; letter-spacing:.02em;
  }
  .fh-home-coming-sub  { font-size:1.05rem; color:var(--fh-text-sec); }
  .fh-home-coming-desc {
    font-size:.98rem; color:var(--fh-text-sec); line-height:1.55; max-width:420px;
  }
  .fh-home-coming-badge {
    font-size:.75rem; font-weight:800; letter-spacing:.1em;
    padding:4px 14px; border-radius:20px;
    background:var(--fh-surface); color:var(--fh-text-sec); border:1.5px solid var(--fh-border);
  }

  /* Home responsive overrides */
  @container fh (min-width: 680px) {
    .fh-home-rooms-grid { grid-template-columns:repeat(2, 1fr); }
    .fh-home-family     { font-size:1.7rem; }
  }
  @container fh (min-width: 900px) {
    .fh-home-agents-row { gap:var(--fh-gap); }
    .fh-home-agent-tile { padding:16px 14px 14px; }
    .fh-home-agent-stat-num { font-size:1.75rem; }
  }

  /* ============================================================ */
  /* Mission Control (v0.6.0 S9 P2 \u2014 Chores HQ tactical ops board) */
  /* Two-column at viewport \u22651100px; stacks below.                 */
  /* ============================================================ */

  .fh-mc {
    --mc-ink:      #0E1622;
    --mc-ink2:     #131E2C;
    --mc-panel:    #182434;
    --mc-panel2:   #1E2C3F;
    --mc-stroke:   rgba(255,255,255,.10);
    --mc-text:     #E8ECF2;
    --mc-text-dim: rgba(232,236,242,.65);
    --mc-text-mute:rgba(232,236,242,.35);
    --mc-gold:     #E0B84C;
    --mc-cyan:     #4FC8E0;
    --mc-red:      #E07A4C;
    --mc-green:    #58C088;

    background:radial-gradient(ellipse at 20% 0%, var(--mc-panel) 0%, var(--mc-ink) 70%);
    color:var(--mc-text);
    font-family:"Manrope", system-ui, sans-serif;
    border-radius:var(--fh-radius);
    padding:0;
    overflow:hidden;
    position:relative;
  }

  /* ---- HQ header ---- */
  .fh-mc-header {
    display:flex; align-items:center; gap:14px;
    padding:12px 14px;
    background:var(--mc-ink2);
    border-bottom:1px solid var(--mc-stroke);
    flex-wrap:wrap;
  }
  .fh-mc-brand { display:flex; align-items:center; gap:10px; flex-shrink:0; }
  .fh-mc-logo {
    width:34px; height:34px; border-radius:7px;
    background:var(--mc-gold); color:var(--mc-ink);
    display:flex; align-items:center; justify-content:center;
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:1.05rem;
    box-shadow:0 0 0 3px var(--mc-ink2), 0 0 0 4px var(--mc-gold);
  }
  .fh-mc-wordmark-name {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800;
    font-size:var(--fh-text-md); letter-spacing:-.01em; line-height:1;
    color:var(--mc-text);
  }
  .fh-mc-wordmark-tag {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.22em; color:var(--mc-gold); font-weight:700; margin-top:3px;
  }
  .fh-mc-ops-paused {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    font-weight:800; letter-spacing:.18em;
    padding:4px 10px; border-radius:4px;
    background:rgba(224,122,76,.12); color:var(--mc-red);
    border:1.5px solid var(--mc-red);
    animation:fh-mc-pulse 1.8s ease-in-out infinite;
  }
  .fh-mc-stats {
    display:flex; align-items:stretch; gap:0;
    margin-left:auto; flex-wrap:wrap;
  }
  .fh-mc-stat, .fh-mc-clock {
    display:flex; flex-direction:column; align-items:flex-end;
    justify-content:center; gap:2px;
    border-left:1px solid var(--mc-stroke);
    padding:0 14px; min-height:42px;
  }
  .fh-mc-stat-lbl {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.18em; color:var(--mc-text-mute); font-weight:600;
  }
  .fh-mc-stat-val { display:flex; align-items:baseline; gap:6px; }
  .fh-mc-stat-num {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:700;
    font-size:var(--fh-text-xl); line-height:1;
  }
  .fh-mc-stat[data-accent="cyan"]  .fh-mc-stat-num { color:var(--mc-cyan); }
  .fh-mc-stat[data-accent="gold"]  .fh-mc-stat-num { color:var(--mc-gold); }
  .fh-mc-stat[data-accent="red"]   .fh-mc-stat-num { color:var(--mc-red); }
  .fh-mc-stat[data-accent="green"] .fh-mc-stat-num { color:var(--mc-green); }
  .fh-mc-pulse {
    width:8px; height:8px; border-radius:50%;
    background:currentColor; flex-shrink:0;
    animation:fh-mc-pulse 1.4s ease-in-out infinite;
  }
  .fh-mc-stat[data-accent="red"] .fh-mc-pulse { color:var(--mc-red); }
  .fh-mc-clock-num {
    font-family:"JetBrains Mono",monospace; font-weight:700;
    font-size:var(--fh-text-lg); line-height:1; color:var(--mc-text);
    font-variant-numeric:tabular-nums;
  }

  /* ---- Two-column body ---- */
  .fh-mc-body {
    display:grid; grid-template-columns:1fr;
    gap:16px; padding:14px;
  }
  @media (min-width: 1100px) {
    .fh-mc-body {
      grid-template-columns:1fr 480px;
    }
  }
  .fh-mc-main, .fh-mc-sidebar {
    display:flex; flex-direction:column; gap:12px; min-width:0;
  }

  /* ---- Panel chrome (corner brackets via pseudo-elements) ---- */
  .fh-mc-panel {
    position:relative;
    background:var(--mc-panel);
    border:1px solid var(--mc-stroke);
    border-radius:10px;
    padding:14px;
  }
  .fh-mc-panel::before, .fh-mc-panel::after {
    content:""; position:absolute; width:14px; height:14px;
    pointer-events:none; border:1.5px solid var(--mc-gold);
  }
  .fh-mc-panel::before {
    top:-1px; left:-1px; border-right:none; border-bottom:none;
    border-top-left-radius:10px;
  }
  .fh-mc-panel::after {
    bottom:-1px; right:-1px; border-left:none; border-top:none;
    border-bottom-right-radius:10px;
  }
  .fh-mc-panel-hdr {
    display:flex; align-items:baseline; gap:10px;
    margin-bottom:10px;
  }
  .fh-mc-panel-lbl {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.22em; font-weight:700; color:var(--mc-gold);
  }
  .fh-mc-panel-lbl[data-accent="red"]   { color:var(--mc-red); }
  .fh-mc-panel-lbl[data-accent="cyan"]  { color:var(--mc-cyan); }
  .fh-mc-panel-lbl[data-accent="green"] { color:var(--mc-green); }
  .fh-mc-panel-sub {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.16em; color:var(--mc-text-mute); font-weight:500;
    text-transform:uppercase;
  }
  .fh-mc-panel--quiet { opacity:.55; }
  .fh-mc-panel--quiet::before, .fh-mc-panel--quiet::after { border-color:var(--mc-stroke); }

  /* ---- Agent roster ---- */
  .fh-mc-roster {
    display:grid; gap:10px;
    grid-template-columns:repeat(auto-fill, minmax(140px, 1fr));
  }
  .fh-mc-agent {
    all:unset; cursor:pointer; box-sizing:border-box;
    position:relative;
    padding:10px;
    background:var(--mc-panel2);
    border:1px solid var(--mc-stroke);
    border-radius:9px;
    transition:opacity .18s, border-color .18s, box-shadow .18s;
  }
  .fh-mc-agent.dim    { opacity:.45; }
  .fh-mc-agent.active {
    border-color:var(--agent-color);
    background:linear-gradient(180deg, color-mix(in srgb, var(--agent-color) 14%, var(--mc-panel2)), var(--mc-panel2));
    box-shadow:0 0 0 1px var(--agent-color), 0 0 18px color-mix(in srgb, var(--agent-color) 28%, transparent);
  }
  .fh-mc-agent-head {
    display:flex; align-items:center; gap:9px;
  }
  .fh-mc-agent-avatar {
    width:36px; height:36px; border-radius:9px; flex-shrink:0;
    background:var(--agent-color, var(--mc-cyan)); color:var(--mc-ink);
    display:flex; align-items:center; justify-content:center;
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:var(--fh-text-md);
    position:relative;
  }
  .fh-mc-agent-alert {
    position:absolute; top:-4px; right:-4px;
    width:16px; height:16px; border-radius:50%;
    background:var(--mc-red); color:var(--mc-text);
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700;
    display:flex; align-items:center; justify-content:center;
    border:2px solid var(--mc-panel2);
  }
  .fh-mc-agent-id { min-width:0; flex:1; }
  /* Codename is the primary identifier \u2014 large mono, agent color */
  .fh-mc-agent-code {
    font-family:"JetBrains Mono",monospace;
    font-size:var(--fh-text-md); font-weight:800;
    letter-spacing:.08em;
    color:var(--agent-color, var(--mc-cyan));
    line-height:1.05;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  /* Real name is the secondary line \u2014 small, muted */
  .fh-mc-agent-name {
    font-family:"Manrope",sans-serif; font-weight:500;
    font-size:var(--fh-text-xs); line-height:1.2; margin-top:3px;
    color:var(--mc-text-dim);
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .fh-mc-agent-foot {
    display:flex; align-items:center; justify-content:space-between;
    gap:6px;
    margin-top:9px; padding-top:8px;
    border-top:1px dashed var(--mc-stroke);
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    font-weight:700; letter-spacing:.04em;
  }
  .fh-mc-agent-bal    { color:var(--mc-text-dim); }
  .fh-mc-agent-lbl    { color:var(--mc-text-mute); margin-left:3px; font-weight:500; }
  .fh-mc-agent-open   { color:var(--mc-text-mute); }
  .fh-mc-agent-open.live { color:var(--mc-cyan); }

  /* ---- Section headers (// LABEL \u2500\u2500\u2500 sub) ---- */
  .fh-mc-section-hdr {
    display:flex; align-items:center; gap:10px;
    margin:8px 0 6px; padding-left:2px;
  }
  .fh-mc-section-lbl {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-sm);
    letter-spacing:.22em; font-weight:700;
    color:var(--mc-gold);
  }
  .fh-mc-section-hdr[data-accent="red"]   .fh-mc-section-lbl { color:var(--mc-red); }
  .fh-mc-section-hdr[data-accent="cyan"]  .fh-mc-section-lbl { color:var(--mc-cyan); }
  .fh-mc-section-hdr[data-accent="green"] .fh-mc-section-lbl { color:var(--mc-green); }
  .fh-mc-section-hdr[data-accent="red"]   .fh-mc-pulse       { color:var(--mc-red); }
  .fh-mc-section-rule {
    flex:1; height:1px;
    background:linear-gradient(90deg, var(--mc-stroke), transparent);
  }
  .fh-mc-section-sub {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.16em; color:var(--mc-text-mute); font-weight:600;
  }

  .fh-mc-missions { margin-bottom:4px; }

  /* ---- .fh-row--mc (mission row overrides on the shared row) ---- */
  .fh-row--mc {
    background:var(--mc-panel2);
    border:1px solid var(--mc-stroke);
    border-left:4px solid var(--mc-accent, var(--mc-cyan));
    color:var(--mc-text);
    font-family:"Manrope",sans-serif;
    padding:10px 14px;
  }
  .fh-row--mc.overdue {
    border-color:rgba(224,122,76,.45);
    border-left-color:var(--mc-red);
  }
  .fh-row--mc.flash {
    animation:fh-mc-flash 1.2s ease-out forwards;
  }
  .fh-row--mc .fh-row-icon {
    width:34px; height:34px; border-radius:8px;
    background:color-mix(in srgb, var(--mc-accent, var(--mc-cyan)) 18%, transparent);
  }
  .fh-row--mc .fh-row-icon svg { width:20px; height:20px; }
  .fh-row--mc .fh-row-kicker {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.16em; color:var(--mc-accent, var(--mc-cyan));
    font-weight:700; opacity:1;
  }
  .fh-row--mc .fh-row-name {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:700;
    font-size:var(--fh-text-md); color:var(--mc-text);
    text-transform:none; letter-spacing:0;
  }
  .fh-row--mc .fh-row-desc    { color:var(--mc-text-dim); }
  .fh-row--mc .fh-row-penalty {
    color:var(--mc-text-mute); letter-spacing:.06em;
    font-family:"JetBrains Mono",monospace;
  }
  .fh-row--mc .fh-row-chip {
    font-family:"JetBrains Mono",monospace;
    border-color:var(--mc-stroke); color:var(--mc-text-mute);
    background:var(--mc-ink2);
  }
  .fh-row--mc .fh-row-chip--streak { color:var(--mc-gold); border-color:color-mix(in srgb, var(--mc-gold) 50%, transparent); }
  .fh-row--mc .fh-row-chip--breach { color:var(--mc-red);  border-color:color-mix(in srgb, var(--mc-red) 55%, transparent); background:color-mix(in srgb, var(--mc-red) 10%, var(--mc-ink2)); }
  .fh-row--mc .fh-row-chip--reset  { color:var(--mc-gold); border-color:color-mix(in srgb, var(--mc-gold) 45%, transparent); background:color-mix(in srgb, var(--mc-gold) 8%, var(--mc-ink2)); }
  .fh-row--mc .fh-row-chip--firing { color:var(--mc-red);  border-color:color-mix(in srgb, var(--mc-red) 55%, transparent); background:color-mix(in srgb, var(--mc-red) 10%, var(--mc-ink2)); }
  .fh-row--mc .fh-row-chip--expiry { color:var(--mc-gold); border-color:color-mix(in srgb, var(--mc-gold) 45%, transparent); background:color-mix(in srgb, var(--mc-gold) 8%, var(--mc-ink2)); }
  .fh-row--mc .fh-row-pts {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800;
    font-size:var(--fh-text-lg); color:var(--mc-gold);
    background:var(--mc-ink2); border:1px solid var(--mc-stroke);
    border-radius:7px; padding:5px 10px; min-width:54px;
  }
  /* Per-assignee mini button group (one button per kid assigned to the chore) */
  .fh-mc-go-group {
    display:flex; align-items:stretch; gap:6px; flex-shrink:0;
  }
  .fh-mc-go-mini {
    all:unset; cursor:pointer; box-sizing:border-box;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    min-width:48px; padding:5px 6px;
    border-radius:9px;
    background:var(--mc-accent, var(--mc-cyan));
    color:var(--mc-ink);
    box-shadow:0 3px 0 rgba(0,0,0,.25);
    transition:transform .1s, filter .15s;
  }
  .fh-mc-go-mini:hover  { filter:brightness(1.1); }
  .fh-mc-go-mini:active { transform:translateY(2px); box-shadow:0 1px 0 rgba(0,0,0,.25); }
  .fh-mc-go-code {
    font-family:"JetBrains Mono",monospace;
    font-size:var(--fh-text-xs); font-weight:800;
    letter-spacing:.06em;
    line-height:1; opacity:.9;
    max-width:60px;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .fh-mc-go-check {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800;
    font-size:var(--fh-text-lg); line-height:1; margin-top:2px;
  }
  .fh-mc-go-mini.pending {
    cursor:default;
    background:transparent;
    color:var(--mc-text-mute);
    border:1.5px dashed var(--mc-stroke);
    box-shadow:none;
  }
  .fh-mc-go-mini.pending .fh-mc-go-code { opacity:.7; }
  .fh-mc-go-mini.breach {
    box-shadow:0 3px 0 rgba(0,0,0,.35), 0 0 0 2px var(--mc-red);
  }

  /* ---- Empty state ---- */
  .fh-mc-empty {
    text-align:center; padding:40px 16px;
    border:1px solid var(--mc-stroke); border-radius:10px;
    background:var(--mc-panel);
  }
  .fh-mc-empty-title {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800;
    font-size:var(--fh-text-xl); color:var(--mc-green);
    letter-spacing:.05em;
  }
  .fh-mc-empty-sub {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.22em; color:var(--mc-text-mute); margin-top:6px;
  }

  /* ---- Intel Alerts list ---- */
  .fh-mc-intel-list { display:flex; flex-direction:column; gap:8px; }
  .fh-mc-intel-row {
    display:flex; align-items:center; gap:10px;
    padding:10px 12px; border-radius:8px;
    background:color-mix(in srgb, var(--mc-red) 8%, var(--mc-panel2));
    border:1px solid color-mix(in srgb, var(--mc-red) 28%, var(--mc-stroke));
  }
  .fh-mc-intel-avatar {
    width:30px; height:30px; border-radius:7px; flex-shrink:0;
    background:var(--mc-accent, var(--mc-cyan)); color:var(--mc-ink);
    display:flex; align-items:center; justify-content:center;
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:var(--fh-text-sm);
  }
  .fh-mc-intel-body { flex:1; min-width:0; }
  .fh-mc-intel-code {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.16em; color:var(--mc-accent, var(--mc-cyan)); font-weight:700;
  }
  .fh-mc-intel-name {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:700;
    font-size:var(--fh-text-sm); color:var(--mc-text); line-height:1.2;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .fh-mc-intel-meta {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    color:var(--mc-text-mute); margin-top:1px;
  }
  /* Read-only: no actions on this surface \u2014 approve/deny lives in Admin */
  .fh-mc-intel-status {
    flex-shrink:0;
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.18em; font-weight:700; color:var(--mc-red);
    padding:3px 8px; border-radius:5px;
    background:color-mix(in srgb, var(--mc-red) 12%, var(--mc-ink2));
    border:1px solid color-mix(in srgb, var(--mc-red) 40%, transparent);
  }
  .fh-mc-intel-note {
    margin-top:8px; padding-top:8px;
    border-top:1px dashed var(--mc-stroke);
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.16em; color:var(--mc-text-mute);
    text-align:center;
  }

  /* ---- Open Ops list ---- */
  .fh-mc-ops-list { display:flex; flex-direction:column; gap:8px; }
  .fh-mc-ops-row {
    display:grid;
    grid-template-columns:auto 1fr auto auto;
    grid-template-areas:
      "kicker kicker kicker pts"
      "icon   body   body   claim";
    align-items:center; column-gap:10px; row-gap:4px;
    padding:10px 12px; border-radius:8px;
    background:var(--mc-panel2);
    border:1px dashed color-mix(in srgb, var(--mc-cyan) 40%, transparent);
  }
  .fh-mc-ops-kicker {
    grid-area:kicker;
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    letter-spacing:.20em; color:var(--mc-cyan); font-weight:700;
  }
  .fh-mc-ops-icon  { grid-area:icon; }
  .fh-mc-ops-body  { grid-area:body; min-width:0; }
  .fh-mc-ops-name  {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:700;
    font-size:var(--fh-text-base); color:var(--mc-text); line-height:1.2;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .fh-mc-ops-cat {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    color:var(--mc-text-mute); margin-top:2px;
  }
  .fh-mc-ops-pts {
    grid-area:pts;
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800;
    font-size:var(--fh-text-base); color:var(--mc-cyan);
    padding:2px 8px; border-radius:5px;
    background:color-mix(in srgb, var(--mc-cyan) 12%, transparent);
  }
  .fh-mc-ops-claim {
    grid-area:claim;
    padding:6px 12px; border-radius:6px;
    background:var(--mc-cyan); color:var(--mc-ink);
    border:none; cursor:pointer;
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800;
    font-size:var(--fh-text-xs); letter-spacing:.08em;
  }
  .fh-mc-ops-claim:hover  { filter:brightness(1.1); }
  .fh-mc-ops-claim:active { transform:scale(.96); }

  /* ---- Status footer ---- */
  .fh-mc-status {
    margin-top:auto;
    padding:10px 12px; border-radius:8px;
    background:var(--mc-ink2); border:1px solid var(--mc-stroke);
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    color:var(--mc-text-mute); letter-spacing:.12em; line-height:1.7;
  }
  .fh-mc-status-row { display:flex; align-items:center; gap:6px; }
  .fh-mc-status-dot {
    width:7px; height:7px; border-radius:50%; flex-shrink:0;
    background:currentColor;
  }
  .fh-mc-status-dot.ok { color:var(--mc-green); }

  /* ---- Milestone celebration overlay (preserved from S6c) ---- */
  .fh-celebration-overlay {
    position:absolute; inset:0;
    background:rgba(0,0,0,.78);
    display:flex; align-items:center; justify-content:center;
    border-radius:var(--ha-card-border-radius, var(--fh-radius));
    z-index:50; cursor:pointer;
    animation:fh-fade-in .2s ease;
  }
  .fh-celebration-badge {
    display:flex; flex-direction:column; align-items:center; gap:10px;
    text-align:center;
    animation:fh-pop .35s cubic-bezier(.34,1.56,.64,1) both;
  }
  .fh-celebration-star {
    font-size:3.5rem; color:var(--mc-gold); line-height:1;
    animation:fh-spin-star 1s ease-in-out;
  }
  .fh-celebration-title {
    font-family:"Bricolage Grotesque",sans-serif; font-size:2.2rem; font-weight:800;
    letter-spacing:.1em; color:var(--mc-gold);
  }
  .fh-celebration-streak {
    font-family:"JetBrains Mono",monospace; font-size:1.8rem; font-weight:700; color:#fff;
  }
  .fh-celebration-name {
    font-size:1.05rem; color:rgba(255,255,255,.7); max-width:320px;
  }

  /* ---- Animations ---- */
  @keyframes fh-mc-pulse {
    0%,100% { opacity:1; }
    50%      { opacity:.45; }
  }
  @keyframes fh-mc-flash {
    0%   { background:color-mix(in srgb, var(--mc-accent, var(--mc-cyan)) 40%, var(--mc-panel2)); }
    100% { background:var(--mc-panel2); }
  }
  @keyframes fh-fade-in {
    from { opacity:0; } to { opacity:1; }
  }
  @keyframes fh-pop {
    from { transform:scale(.5); opacity:0; }
    to   { transform:scale(1);  opacity:1; }
  }
  @keyframes fh-spin-star {
    0%   { transform:rotate(-30deg) scale(.5); }
    50%  { transform:rotate(15deg)  scale(1.2); }
    100% { transform:rotate(0deg)   scale(1); }
  }

  /* ===== Engineer Theme ===== */

  .fh-eng-page {
    position:relative;
    margin:calc(-1 * var(--fh-pad));
    background:#0E3A5C; color:#F2EBD6;
    min-height:calc(100% + calc(2 * var(--fh-pad)));
    overflow:hidden;
  }
  .fh-eng-grid {
    position:absolute; inset:0; pointer-events:none;
    background-image:
      linear-gradient(rgba(60,122,165,.18) 1px, transparent 1px),
      linear-gradient(90deg, rgba(60,122,165,.18) 1px, transparent 1px);
    background-size:24px 24px;
  }
  .fh-eng-border-outer {
    position:absolute; inset:12px; pointer-events:none;
    border:1.5px solid rgba(60,122,165,.55);
  }
  .fh-eng-border-inner {
    position:absolute; inset:17px; pointer-events:none;
    border:0.5px solid rgba(60,122,165,.3);
  }
  .fh-eng-content {
    position:relative; z-index:1;
    padding:24px 20px 16px;
    display:flex; flex-direction:column; gap:10px;
  }

  /* Eng top nav bar */
  .fh-eng-topnav {
    display:flex; align-items:center; margin-bottom:2px;
  }
  .fh-eng-back-btn {
    background:none; border:1px solid rgba(242,235,214,.3); color:#F2EBD6;
    font-family:var(--fh-font-mono); font-size:.78rem; font-weight:700;
    letter-spacing:.1em; padding:5px 12px; border-radius:2px; cursor:pointer;
    transition:border-color .15s;
  }
  .fh-eng-back-btn:hover { border-color:#F2EBD6; }

  /* Eng header */
  .fh-eng-header {
    display:flex; align-items:flex-start; gap:14px;
    padding-bottom:12px; border-bottom:1px solid rgba(60,122,165,.4);
  }
  .fh-eng-avatar {
    width:48px; height:48px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    background:#0B2D48; border:1.5px solid rgba(60,122,165,.6);
    font-family:var(--fh-font-heading); font-size:1.2rem; font-weight:800;
    color:#F2EBD6; position:relative;
    clip-path:polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  .fh-eng-avatar-diamond {
    position:absolute; inset:-4px;
    border:1px solid rgba(60,122,165,.5);
    clip-path:polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    pointer-events:none;
  }
  .fh-eng-identity { flex:1; min-width:0; }
  .fh-eng-rank-line {
    font-family:var(--fh-font-mono); font-size:.84rem; font-weight:700;
    color:rgba(242,235,214,.5); letter-spacing:.08em; margin-bottom:3px;
  }
  .fh-eng-name {
    font-family:var(--fh-font-heading); font-size:1.4rem; font-weight:800;
    color:#F2EBD6; letter-spacing:.02em;
  }
  /* Eng header callouts removed in S8 \xE2\u20AC\u201D KPIs moved to right rail */

  /* Eng tabs */
  .fh-eng-tabs { display:flex; border-bottom:1px solid rgba(60,122,165,.4); }
  .fh-eng-tab {
    display:flex; flex-direction:column; align-items:center;
    padding:8px 14px 10px;
    font-family:var(--fh-font-mono); font-size:.95rem; font-weight:700; letter-spacing:.08em;
    color:rgba(242,235,214,.45); cursor:pointer; position:relative;
    border:1px solid transparent; border-bottom:none; margin-bottom:-1px;
    transition:color .15s;
  }
  .fh-eng-tab:hover { color:#F2EBD6; }
  .fh-eng-tab.active {
    color:#F2EBD6; background:#0B2D48;
    border-color:rgba(60,122,165,.4); border-bottom-color:#0B2D48;
  }
  .fh-eng-tab-sub { font-size:.75rem; letter-spacing:.06em; opacity:.6; }
  .fh-eng-rule { height:1px; background:rgba(60,122,165,.4); }

  /* Body two-column layout \xE2\u20AC\u201D left WO list + right rail.
     Stacks below 900px viewport. Tabs without a rail (.fh-eng-body, no .has-rail)
     stay full width on any viewport. */
  .fh-eng-body { flex:1; display:flex; flex-direction:column; }
  .fh-eng-body.has-rail { gap:14px; }
  .fh-eng-body-main { min-width:0; flex:1; }
  .fh-eng-rail { display:flex; flex-direction:column; gap:12px; }
  @media (min-width: 900px) {
    .fh-eng-body.has-rail {
      display:grid;
      grid-template-columns: minmax(0, 1fr) 480px;
      gap:16px;
      align-items:start;
    }
  }

  /* Rail panel \xE2\u20AC\u201D blueprint sub-frame with corner ticks + mono kicker */
  .fh-eng-rpanel {
    position:relative;
    background:#0B2D48;
    border:1px solid rgba(60,122,165,.4);
    padding:14px 14px 12px;
  }
  .fh-eng-rpanel.dense { padding:10px 12px; }
  .fh-eng-rpanel-hdr {
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:700;
    color:#E0B84C; letter-spacing:.18em; margin-bottom:8px;
  }
  .fh-eng-rpanel-body { font-family:var(--fh-font-mono); }
  .fh-eng-rempty {
    font-family:var(--fh-font-mono); font-size:.75rem;
    color:rgba(242,235,214,.35); letter-spacing:.08em; text-align:center; padding:8px 0;
  }
  .fh-eng-rmax {
    font-family:var(--fh-font-mono); font-size:.95rem; font-weight:800;
    color:#E0B84C; letter-spacing:.08em; text-align:center; padding:4px 0;
  }

  /* Rail \xC2\xB7 KPIs panel */
  .fh-eng-rkpi-row { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; }
  .fh-eng-rkpi {
    display:flex; flex-direction:column; align-items:center; min-width:0;
  }
  .fh-eng-rkpi-lbl {
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:700;
    color:rgba(242,235,214,.45); letter-spacing:.1em;
    border-bottom:0.5px solid rgba(60,122,165,.5); width:100%; text-align:center;
    padding-bottom:2px; margin-bottom:3px;
  }
  .fh-eng-rkpi-val-row { display:flex; align-items:baseline; gap:3px; }
  .fh-eng-rkpi-val {
    font-family:var(--fh-font-mono); font-size:1.25rem; font-weight:800;
    color:#F2EBD6; line-height:1;
  }
  .fh-eng-rkpi-unit {
    font-family:var(--fh-font-mono); font-size:.75rem;
    color:rgba(242,235,214,.45);
  }

  /* Rail \xC2\xB7 Streak constellation */
  .fh-eng-rstreak { display:flex; flex-direction:column; gap:3px; padding:5px 0; }
  .fh-eng-rstreak + .fh-eng-rstreak { border-top:0.5px dashed rgba(60,122,165,.3); }
  .fh-eng-rstreak-head {
    display:flex; align-items:center; gap:8px; min-width:0;
  }
  .fh-eng-rstreak-name {
    flex:1; min-width:0;
    font-family:var(--fh-font-mono); font-size:.82rem; color:#F2EBD6;
    letter-spacing:.04em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-eng-rstreak-bar {
    display:flex; align-items:center; gap:2px;
  }
  .fh-eng-rstreak-num {
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:700;
    color:rgba(242,235,214,.5); letter-spacing:.04em; margin-left:6px;
  }

  /* Rail \xC2\xB7 Sheet panel (title block) */
  .fh-eng-rsheet-legend {
    margin-top:8px;
    font-family:var(--fh-font-mono); font-size:.75rem;
    color:rgba(242,235,214,.35); letter-spacing:.05em; line-height:1.4;
  }

  /* Eng footer \xE2\u20AC\u201D single mono status line */
  .fh-eng-footer {
    padding-top:10px; border-top:1px solid rgba(60,122,165,.4); margin-top:10px;
  }
  .fh-eng-file-path {
    font-family:var(--fh-font-mono); font-size:.75rem;
    color:rgba(242,235,214,.4); letter-spacing:.06em;
  }
  .fh-eng-title-block { border:1px solid rgba(60,122,165,.5); min-width:200px; }
  .fh-eng-tb-header {
    padding:4px 8px;
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:800;
    color:#F2EBD6; letter-spacing:.08em;
    border-bottom:1px solid rgba(60,122,165,.5); background:#0B2D48;
  }
  .fh-eng-tb-grid { display:grid; grid-template-columns:repeat(3, 1fr); }
  .fh-eng-tb-cell {
    padding:4px 6px;
    border-right:1px solid rgba(60,122,165,.35);
    border-bottom:1px solid rgba(60,122,165,.35);
  }
  .fh-eng-tb-cell:nth-child(3n)       { border-right:none; }
  .fh-eng-tb-cell:nth-last-child(-n+3) { border-bottom:none; }
  .fh-eng-tb-cell-lbl {
    font-family:var(--fh-font-mono); font-size:.75rem;
    color:rgba(242,235,214,.35); letter-spacing:.08em; margin-bottom:1px;
  }
  .fh-eng-tb-cell-val {
    font-family:var(--fh-font-mono); font-size:.78rem; font-weight:700; color:#F2EBD6;
  }

  /* Engineer \xE2\u20AC\u201D row chrome moved to shared .fh-row--engineer (S9).
     Keep .fh-eng-tick + .fh-eng-wo-name (still used by rail panels + rewards). */
  .fh-eng-tick {
    position:absolute; width:5px; height:5px;
    border-color:rgba(60,122,165,.7); border-style:solid;
  }
  .fh-eng-tick[data-pos="tl"] { top:-2px;    left:-2px;  border-width:1.5px 0 0 1.5px; }
  .fh-eng-tick[data-pos="tr"] { top:-2px;    right:-2px; border-width:1.5px 1.5px 0 0; }
  .fh-eng-tick[data-pos="bl"] { bottom:-2px; left:-2px;  border-width:0 0 1.5px 1.5px; }
  .fh-eng-tick[data-pos="br"] { bottom:-2px; right:-2px; border-width:0 1.5px 1.5px 0; }

  .fh-eng-wo-name {
    font-family:var(--fh-font-mono); font-size:1.15rem; font-weight:700;
    color:#F2EBD6; text-transform:uppercase; letter-spacing:.04em;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }

  /* Dimensional streak bar */
  .fh-eng-dim-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .fh-eng-dim     { display:flex; align-items:center; gap:6px; }
  .fh-eng-dim-track { display:flex; align-items:center; gap:2px; }
  .fh-eng-dim-arrow {
    width:0; height:0; flex-shrink:0;
    border-top:4px solid transparent; border-bottom:4px solid transparent;
  }
  .fh-eng-dim-arrow.left  { border-right:6px solid rgba(60,122,165,.65); }
  .fh-eng-dim-arrow.right { border-left:6px solid rgba(60,122,165,.65); }
  .fh-eng-dim-seg {
    width:8px; height:8px; border:1px solid rgba(60,122,165,.55);
  }
  .fh-eng-dim-seg.filled { background:rgba(60,122,165,.8); border-color:rgba(60,122,165,.8); }
  .fh-eng-dim-label {
    font-family:var(--fh-font-mono); font-size:.75rem;
    color:rgba(242,235,214,.35); letter-spacing:.04em;
  }
  .fh-eng-status {
    font-family:var(--fh-font-mono); font-size:.75rem;
    color:rgba(242,235,214,.35); letter-spacing:.06em;
  }
  .fh-eng-status-red { color:#E07A4C; }

  /* Engineer chip \xE2\u20AC\u201D base + streak (rail panel milestone chip uses these) */
  .fh-eng-chip {
    display:inline-flex; align-items:center;
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:700;
    letter-spacing:.08em; padding:2px 6px; border-radius:2px;
    border:1px solid rgba(60,122,165,.5); color:rgba(242,235,214,.6);
    background:rgba(14,58,92,.4); white-space:nowrap;
  }
  .fh-eng-chip-streak { color:#E0B84C; border-color:rgba(224,184,76,.45); }

  /* Points stamp */
  .fh-eng-pts-stamp {
    display:flex; flex-direction:column; align-items:center; flex-shrink:0;
    padding:6px 8px; background:#0E3A5C; border:1px solid #E0B84C; min-width:52px;
  }
  .fh-eng-pts-num {
    font-family:var(--fh-font-mono); font-size:1.55rem; font-weight:800;
    color:#E0B84C; line-height:1;
  }
  .fh-eng-pts-lbl {
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:700;
    color:rgba(224,184,76,.55); letter-spacing:.1em;
  }

  /* Stamp / complete button */
  .fh-eng-stamp-btn {
    display:flex; flex-direction:row; align-items:center; justify-content:center;
    gap:6px; flex-shrink:0; min-width:64px; padding:6px 8px;
    background:#0B2D48; border:1.5px solid rgba(242,235,214,.3);
    color:#F2EBD6; font-family:var(--fh-font-mono); font-size:.75rem; font-weight:800;
    letter-spacing:.06em; text-transform:uppercase; cursor:pointer; text-align:center;
    transform:rotate(-2deg); transition:transform .1s, border-color .15s;
    white-space:normal;
  }
  .fh-eng-stamp-check {
    font-size:1.1rem; color:#E0B84C; line-height:1; font-weight:900;
  }
  .fh-eng-stamp-label { line-height:1.1; }
  .fh-eng-stamp-btn:hover  { border-color:#F2EBD6; transform:rotate(0deg); }
  .fh-eng-stamp-btn:active { transform:rotate(0deg) scale(.94); }
  .fh-eng-stamp-btn.disabled { opacity:.35; cursor:not-allowed; }

  /* Eng empty state */
  .fh-eng-empty {
    font-family:var(--fh-font-mono); font-size:.88rem;
    color:rgba(242,235,214,.3); letter-spacing:.08em;
    text-align:center; padding:40px 16px;
  }

  /* Eng rewards */
  .fh-eng-reward-list { display:flex; flex-direction:column; gap:8px; }
  .fh-eng-reward-row {
    display:flex; align-items:center; gap:10px; padding:10px;
    background:#0B2D48; border:1px solid rgba(60,122,165,.4); border-radius:2px;
  }
  .fh-eng-reward-body { flex:1; min-width:0; }

  /* Eng history */
  .fh-eng-hist-list { display:flex; flex-direction:column; }
  .fh-eng-hist-row {
    display:flex; align-items:center; gap:12px;
    padding:8px 0; border-bottom:0.5px solid rgba(60,122,165,.22);
  }
  .fh-eng-hist-row:last-child { border-bottom:none; }
  .fh-eng-hist-row.fh-eng-hist-skipped { cursor:pointer; }
  .fh-eng-hist-type {
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:700;
    letter-spacing:.08em; flex-shrink:0; min-width:90px;
  }
  .fh-eng-hist-name {
    font-family:var(--fh-font-mono); font-size:1.0rem; color:#F2EBD6;
    flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-eng-hist-pts {
    font-family:var(--fh-font-mono); font-size:.84rem; font-weight:700; flex-shrink:0;
  }

  /* ===========================================================================
     Shared: Weekly rank bar  (used by all themes via htmlRankBar())
     =========================================================================== */

  .fh-rank-bar-row {
    display:flex; align-items:center; gap:6px; margin-top:4px;
  }
  .fh-rank-bar-label {
    font-size:.75rem; font-weight:700; letter-spacing:.04em;
    white-space:nowrap; flex-shrink:0; min-width:72px;
  }
  .fh-rank-bar-track {
    flex:1; height:6px; border-radius:3px;
    background:var(--fh-rb-track, rgba(255,255,255,.12)); position:relative; overflow:visible;
  }
  .fh-rank-bar-fill {
    position:absolute; top:0; left:0; height:100%; border-radius:3px;
    transition:width .4s ease;
  }
  .fh-rank-bar-drop {
    position:absolute; top:-3px; width:2px; height:12px;
    background:var(--fh-rb-drop, rgba(255,255,255,.5)); border-radius:1px;
    transform:translateX(-50%);
  }
  .fh-rank-bar-status {
    font-size:.75rem; color:var(--fh-rb-status, rgba(255,255,255,.55));
    white-space:nowrap; flex-shrink:0; font-weight:700;
  }
  /* Themed overrides \xE2\u20AC\u201D light/paper themes need darker rank bar chrome */
  .fh-dn-page, .fh-bk-page, .fh-hp-page {
    --fh-rb-track:  rgba(43,31,14,.18);
    --fh-rb-drop:   rgba(43,31,14,.6);
    --fh-rb-status: #5C4218;
  }
  /* DBZ rail panels are white comic cards \xE2\u20AC\u201D match the paper contrast */
  .fh-dbz-rpanel {
    --fh-rb-track:  rgba(15,30,46,.18);
    --fh-rb-drop:   rgba(15,30,46,.6);
    --fh-rb-status: #0F1E2E;
  }

  /* ===========================================================================
     Baker theme  (Shannon)  \xE2\u20AC\u201D warm cream paper / recipe card aesthetic
     =========================================================================== */

  .fh-bk-page {
    background:#F2E5CC; border-radius:var(--fh-radius); padding:14px;
    min-height:100%; box-sizing:border-box; color:#3A1F12;
    font-family:"DM Serif Display", "Bree Serif", Georgia, serif;
    position:relative; overflow:hidden;
    background-image:radial-gradient(circle at 10% 12%, rgba(217,196,155,.62), transparent 38%), radial-gradient(circle at 88% 88%, rgba(217,196,155,.62), transparent 40%), repeating-radial-gradient(circle at 30% 60%, rgba(217,196,155,.13) 0, rgba(217,196,155,.13) 1.5px, transparent 1.5px, transparent 6px);
  }
  .fh-bk-frame-outer { position:absolute; inset:8px; border:2px solid rgba(58,31,18,.18); border-radius:4px; pointer-events:none; z-index:0; }
  .fh-bk-frame-inner { position:absolute; inset:16px; border:1px solid rgba(58,31,18,.1); border-radius:3px; pointer-events:none; z-index:0; }
  .fh-bk-page > * { position:relative; z-index:1; }
  .fh-bk-title-block { text-align:center; padding:10px 0 14px; border-bottom:2px solid rgba(58,31,18,.2); margin-bottom:10px; }
  .fh-bk-title-kicker { font-family:"Caveat",cursive; font-size:.85rem; color:#8B3A2A; font-weight:600; letter-spacing:.04em; }
  .fh-bk-title-main { font-family:"DM Serif Display",Georgia,serif; font-size:1.7rem; color:#3A1F12; line-height:1; margin-top:2px; }
  .fh-bk-title-sub { font-family:"Caveat",cursive; font-size:.88rem; color:#8B5A3A; font-weight:600; margin-top:4px; }
  .fh-bk-stat-strip { display:flex; gap:0; margin-bottom:10px; border:1.5px solid rgba(58,31,18,.2); background:rgba(251,243,226,.7); border-radius:3px; overflow:hidden; }
  .fh-bk-sstat { flex:1; padding:6px 8px; border-right:1px solid rgba(58,31,18,.15); }
  .fh-bk-sstat:last-child { border-right:none; }
  .fh-bk-sstat-lbl { display:block; font-family:"Caveat",cursive; font-size:.80rem; color:#8B5A3A; font-weight:700; letter-spacing:.02em; }
  .fh-bk-sstat-val { font-family:"DM Serif Display",Georgia,serif; font-size:1.05rem; color:#3A1F12; line-height:1; }
  .fh-bk-tabs {
    display:flex; gap:0; margin-bottom:10px; flex-wrap:wrap;
    border-bottom:2px solid rgba(58,31,18,.18); padding-bottom:0;
  }
  .fh-bk-tab {
    padding:5px 12px; font-family:"DM Serif Display", Georgia, serif;
    font-size:.98rem; font-weight:400; display:flex; flex-direction:column; align-items:center;
    cursor:pointer; color:#8B5A3A; background:transparent; user-select:none;
    border-bottom:3px solid transparent; margin-bottom:-2px;
    transition:color .15s, border-color .15s;
  }
  .fh-bk-tab.active { color:#3A1F12; border-bottom-color:#3A1F12; }
  .fh-bk-tab-sub { display:block; font-family:"JetBrains Mono",monospace; font-size:.75rem; letter-spacing:.12em; color:#8B5A3A; margin-top:1px; text-transform:uppercase; }
  .fh-bk-tab.active .fh-bk-tab-sub { color:rgba(58,31,18,.55); }
  /* Baker body two-column layout \xE2\u20AC\u201D left tickets + right rail */
  .fh-bk-body { display:flex; flex-direction:column; gap:6px; }
  .fh-bk-body.has-rail { gap:12px; }
  .fh-bk-body-main { min-width:0; }
  .fh-bk-rail { display:flex; flex-direction:column; gap:10px; }
  @media (min-width: 900px) {
    .fh-bk-body.has-rail {
      display:grid;
      grid-template-columns: minmax(0, 1fr) 480px;
      gap:14px;
      align-items:start;
    }
  }
  .fh-bk-rpanel {
    position:relative; background:#FBF3E2; border:1px solid rgba(58,31,18,.2);
    padding:10px 12px;
  }
  .fh-bk-rpanel-hdr {
    font-family:"DM Serif Display","Georgia",serif; font-size:1rem; color:#8B3A2A;
    text-align:center; letter-spacing:.04em; margin-bottom:6px;
    border-bottom:1px dashed rgba(58,31,18,.25); padding-bottom:4px;
  }
  .fh-bk-rpanel-body { color:#3A1F12; }
  .fh-bk-rempty {
    font-family:"Caveat",cursive; font-size:1rem; color:#8B5A3A;
    text-align:center; padding:6px 0;
  }
  .fh-bk-rmax {
    font-family:"DM Serif Display",serif; font-size:1rem; color:#8B3A2A;
    text-align:center; padding:4px 0;
  }
  .fh-bk-rkpi-row { display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; }
  .fh-bk-rkpi {
    display:flex; flex-direction:column; align-items:center;
    border-right:1px dashed rgba(58,31,18,.18); padding-right:6px;
  }
  .fh-bk-rkpi:last-child { border-right:none; padding-right:0; }
  .fh-bk-rkpi-lbl {
    font-family:"Caveat",cursive; font-size:.95rem; color:#8B5A3A;
  }
  .fh-bk-rkpi-val-row { display:flex; align-items:baseline; gap:2px; }
  .fh-bk-rkpi-val {
    font-family:"DM Serif Display","Georgia",serif; font-size:1.15rem; color:#3A1F12; line-height:1;
  }
  .fh-bk-rkpi-unit { font-size:.75rem; color:#8B5A3A; }
  .fh-bk-rstreak { padding:5px 0; }
  .fh-bk-rstreak + .fh-bk-rstreak { border-top:1px dotted rgba(58,31,18,.2); }
  .fh-bk-rstreak-head { display:flex; align-items:center; gap:8px; }
  .fh-bk-rstreak-name {
    flex:1; min-width:0; font-size:.95rem; color:#3A1F12;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-bk-rbonus {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:800; color:#8B3A2A;
  }
  .fh-bk-rstreak-bar { display:flex; align-items:center; gap:6px; margin-top:3px; }
  .fh-bk-rdots { display:flex; gap:3px; }
  .fh-bk-rdot {
    width:8px; height:8px; border-radius:50%;
    border:1px solid rgba(58,31,18,.35); background:transparent;
  }
  .fh-bk-rdot.filled { background:#8B3A2A; border-color:#8B3A2A; }
  .fh-bk-rstreak-num {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; color:#8B5A3A; margin-left:auto;
  }
  .fh-bk-rorder { padding:5px 0; }
  .fh-bk-rorder + .fh-bk-rorder { border-top:1px dotted rgba(58,31,18,.2); }
  .fh-bk-rorder-when {
    font-family:"Caveat",cursive; font-size:.9rem; color:#8B5A3A;
  }
  .fh-bk-rorder-row { display:flex; gap:8px; align-items:baseline; }
  .fh-bk-rorder-name {
    flex:1; min-width:0; font-size:.95rem; color:#3A1F12;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-bk-rorder-pts {
    font-family:"JetBrains Mono",monospace; font-size:.85rem; font-weight:700; color:#8B3A2A;
  }
  /* Baker slim row chips */
  .fh-bk-chip-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:3px; }
  .fh-bk-chip {
    display:inline-flex; align-items:center;
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:700;
    letter-spacing:.04em; padding:1px 6px; border-radius:2px;
    border:1px solid rgba(58,31,18,.3); color:#3A1F12;
    background:rgba(139,58,42,.08); white-space:nowrap;
  }
  .fh-bk-chip-streak  { color:#8B3A2A; border-color:rgba(139,58,42,.45); }
  .fh-bk-chip-overdue { color:#A02828; border-color:rgba(160,40,40,.5); background:rgba(160,40,40,.08); }
  .fh-bk-chip-reset   { color:#8B3A2A; border-color:rgba(139,58,42,.4); background:rgba(139,58,42,.12); }
  .fh-bk-proof-dots { display:flex; gap:3px; align-items:center; margin-top:4px; flex-wrap:wrap; }
  .fh-bk-proof-dot { width:8px; height:8px; border-radius:50%; border:1.5px solid rgba(58,31,18,.35); background:transparent; flex-shrink:0; }
  .fh-bk-proof-dot.filled { background:#8B3A2A; border-color:#8B3A2A; }
  .fh-bk-footer { display:flex; justify-content:space-between; margin-top:10px; font-family:"Caveat",cursive; font-size:.75rem; color:#8B5A3A; font-weight:600; border-top:1px solid rgba(58,31,18,.15); padding-top:6px; }
  .fh-bk-section-hdr {
    font-family:"Caveat", cursive; font-size:1.05rem; font-weight:700;
    color:#8B5A3A; margin:6px 0 2px; letter-spacing:.02em;
  }
  .fh-bk-empty { font-family:"Caveat", cursive; font-size:1.1rem; color:#8B5A3A; text-align:center; padding:32px 16px; }
  /* Baker \xE2\u20AC\u201D ticket row chrome moved to shared .fh-row--baker (S9) */
  .fh-bk-badge {
    display:inline-block; padding:2px 7px; border-radius:20px;
    font-size:.75rem; font-weight:700;
  }
  .fh-bk-go-btn {
    flex-shrink:0; padding:7px 16px; border-radius:20px; border:none;
    background:#3A1F12; color:#F2E5CC;
    font-family:"DM Serif Display", Georgia, serif; font-weight:700; font-size:1.02rem;
    cursor:pointer; transition:transform .1s, box-shadow .1s;
    box-shadow:0 3px 0 #8B3A2A;
  }
  .fh-bk-go-btn:active { transform:translateY(2px); box-shadow:0 1px 0 #8B3A2A; }
  .fh-bk-go-btn.overdue { background:#A02828; box-shadow:0 3px 0 #7A1818; }
  .fh-bk-go-btn.disabled { opacity:.35; cursor:not-allowed; box-shadow:none; }
  /* Menu (store) */
  .fh-bk-menu     { display:flex; flex-direction:column; gap:8px; }
  .fh-bk-menu-item {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    background:#FBF3E2; border:1px solid rgba(58,31,18,.2); border-radius:6px;
  }
  .fh-bk-menu-body  { flex:1; min-width:0; }
  .fh-bk-menu-name  {
    font-family:"DM Serif Display", Georgia, serif; font-size:1.1rem; font-weight:400; color:#3A1F12;
  }
  .fh-bk-menu-desc  { font-family:"Caveat", cursive; font-size:.8rem; color:#8B5A3A; margin-top:2px; }
  .fh-bk-menu-price { flex-shrink:0; font-size:.9rem; font-weight:700; font-family:"JetBrains Mono", monospace; color:#3A1F12; }
  /* Log */
  .fh-bk-log      { display:flex; flex-direction:column; }
  .fh-bk-log-row  {
    display:flex; align-items:center; gap:10px;
    padding:7px 0; border-bottom:1px solid rgba(58,31,18,.12);
  }
  .fh-bk-log-row:last-child { border-bottom:none; }
  .fh-bk-log-type {
    font-family:"Caveat", cursive; font-size:.95rem; font-weight:700;
    letter-spacing:.04em; flex-shrink:0; min-width:72px; color:#8B5A3A;
  }
  .fh-bk-log-name {
    font-family:"DM Serif Display", Georgia, serif; flex:1; font-size:1.0rem;
    color:#5A3A22; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  /* Child mode overrides \xE2\u20AC\u201D replaced by unified kid-mode renderer */

  /* ===========================================================================
     Dinos theme  (Spencer)  \xE2\u20AC\u201D kraft paper / natural history specimen aesthetic
     =========================================================================== */

  .fh-dn-page {
    background:#E8DAB7; border-radius:var(--fh-radius); padding:14px;
    min-height:100%; box-sizing:border-box; color:#2B1F0E;
    font-family:"JetBrains Mono", "Courier New", monospace;
    position:relative; overflow:hidden;
    background-image:radial-gradient(ellipse at 8% 88%, rgba(200,182,137,.7), transparent 40%), radial-gradient(ellipse at 92% 12%, rgba(200,182,137,.7), transparent 38%), radial-gradient(circle at 30% 70%, rgba(161,64,42,.12), transparent 22%), repeating-linear-gradient(95deg, rgba(200,182,137,.1) 0 1px, transparent 1px 7px);
  }
  /* T-Rex watermark */
  .fh-dn-trex-watermark {
    position:absolute; right:-16px; bottom:-8px; pointer-events:none;
    opacity:.06; font-size:9rem; user-select:none; z-index:0; color:#2B1F0E;
  }
  .fh-dn-title-block, .fh-dn-stat-strip, .fh-dn-tabs, .fh-dn-body, .fh-dn-footer { position:relative; z-index:2; }
  .fh-dn-tape { position:absolute; width:60px; height:14px; background:rgba(216,154,54,.45); border:1px solid rgba(184,120,42,.45); pointer-events:none; z-index:0; }
  .fh-dn-tape-tl { top:8px; left:-14px; transform:rotate(-22deg); }
  .fh-dn-tape-tr { top:8px; right:-14px; transform:rotate(22deg); }
  .fh-dn-tape-bl { bottom:8px; left:-14px; transform:rotate(22deg); }
  .fh-dn-tape-br { bottom:8px; right:-14px; transform:rotate(-22deg); }
  .fh-dn-title-block { padding-bottom:12px; border-bottom:2px solid rgba(43,31,14,.3); margin-bottom:10px; }
  .fh-dn-title-kicker { font-family:"JetBrains Mono",monospace; font-size:.75rem; color:#8C281E; font-weight:700; letter-spacing:.18em; text-transform:uppercase; }
  .fh-dn-title-main { font-family:"Bree Serif","Georgia",serif; font-size:1.5rem; color:#2B1F0E; line-height:.95; margin-top:2px; }
  .fh-dn-title-row { display:flex; align-items:center; gap:6px; margin-top:6px; flex-wrap:wrap; }
  .fh-dn-title-date { font-family:"JetBrains Mono",monospace; font-size:.75rem; color:#5B4528; font-weight:600; letter-spacing:.16em; }
  .fh-dn-stamp { display:inline-block; padding:1px 7px; border:1.5px double #8C281E; font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:800; letter-spacing:.14em; color:#8C281E; text-transform:uppercase; transform:rotate(-2deg); }
  .fh-dn-stamp-olive { border-color:#5C6B3A; color:#5C6B3A; transform:rotate(1.5deg); }
  .fh-dn-stat-strip { display:flex; flex-wrap:wrap; gap:0; margin-bottom:10px; border-bottom:1.5px dashed rgba(43,31,14,.25); padding-bottom:8px; }
  .fh-dn-sstat { flex:1 1 80px; padding:4px 6px; border-right:1px dashed rgba(43,31,14,.2); min-width:0; }
  .fh-dn-sstat:last-child { border-right:none; }
  .fh-dn-sstat-lbl { display:block; font-family:"JetBrains Mono",monospace; font-size:.75rem; color:#8A7349; letter-spacing:.18em; font-weight:700; text-transform:uppercase; }
  .fh-dn-sstat-val { font-family:"Bree Serif","Georgia",serif; font-size:1.05rem; color:#2B1F0E; line-height:1; }
  .fh-dn-sstat-unit { font-family:"JetBrains Mono",monospace; font-size:.75rem; color:#6B5020; margin-left:2px; font-weight:600; }
  .fh-dn-sstat-next { font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:700; letter-spacing:.06em; }
  .fh-dn-tabs     { display:flex; gap:4px; margin-bottom:10px; flex-wrap:wrap; }
  .fh-dn-tab {
    padding:5px 11px; border-radius:2px; font-size:.85rem; font-weight:700;
    display:flex; flex-direction:column; align-items:center;
    cursor:pointer; color:#6B5020; background:rgba(43,31,14,.08); user-select:none;
    letter-spacing:.06em; text-transform:uppercase;
    transition:background .15s, color .15s;
  }
  .fh-dn-tab.active { background:#2B1F0E; color:#E8DAB7; }
  .fh-dn-tab-sub { display:block; font-size:.75rem; letter-spacing:.1em; margin-top:1px; font-style:italic; opacity:.75; }

  /* Body two-column layout \xE2\u20AC\u201D left field cards + right field-kit rail.
     Stacks below 900px viewport. Without .has-rail, body stays single column. */
  .fh-dn-body { display:flex; flex-direction:column; gap:6px; }
  .fh-dn-body.has-rail { gap:12px; }
  .fh-dn-body-main { min-width:0; }
  .fh-dn-rail { display:flex; flex-direction:column; gap:10px; }
  @media (min-width: 900px) {
    .fh-dn-body.has-rail {
      display:grid;
      grid-template-columns: minmax(0, 1fr) 480px;
      gap:14px;
      align-items:start;
    }
  }

  /* Dinos rail panel \xE2\u20AC\u201D kraft folder with mono kicker */
  .fh-dn-rpanel {
    position:relative;
    background:#F0E5C8;
    border:1px solid rgba(43,31,14,.25);
    padding:10px 12px 10px;
    box-shadow:1px 1px 0 rgba(43,31,14,.08);
  }
  .fh-dn-rpanel-hdr {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:700;
    color:#8C281E; letter-spacing:.18em; margin-bottom:6px;
    border-bottom:1px dashed rgba(43,31,14,.25); padding-bottom:4px;
  }
  .fh-dn-rpanel-body { font-family:"JetBrains Mono",monospace; }
  .fh-dn-rempty {
    font-family:"JetBrains Mono",monospace; font-size:.75rem;
    color:#6B5020; letter-spacing:.08em; text-align:center; padding:6px 0;
  }
  .fh-dn-rmax {
    font-family:"Bree Serif","Georgia",serif; font-size:1rem; font-weight:800;
    color:#8B6A20; letter-spacing:.04em; text-align:center; padding:4px 0;
  }

  /* Rail \xC2\xB7 KPIs */
  .fh-dn-rkpi-row { display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; }
  .fh-dn-rkpi {
    display:flex; flex-direction:column; align-items:center; min-width:0;
    border-right:1px dashed rgba(43,31,14,.2); padding-right:6px;
  }
  .fh-dn-rkpi:last-child { border-right:none; padding-right:0; }
  .fh-dn-rkpi-lbl {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:700;
    color:#8A7349; letter-spacing:.14em; text-transform:uppercase; margin-bottom:2px;
  }
  .fh-dn-rkpi-val-row { display:flex; align-items:baseline; gap:2px; }
  .fh-dn-rkpi-val {
    font-family:"Bree Serif","Georgia",serif; font-size:1.1rem; font-weight:800;
    color:#2B1F0E; line-height:1;
  }
  .fh-dn-rkpi-unit {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; color:#6B5020;
  }

  /* Rail \xC2\xB7 Fossil record (streaks) */
  .fh-dn-rstreak { padding:5px 0; }
  .fh-dn-rstreak + .fh-dn-rstreak { border-top:1px dotted rgba(43,31,14,.2); }
  .fh-dn-rstreak-head { display:flex; align-items:center; gap:8px; min-width:0; }
  .fh-dn-rstreak-name {
    flex:1; min-width:0;
    font-family:"Bree Serif","Georgia",serif; font-size:.95rem; color:#2B1F0E;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-dn-rbonus {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:800;
    color:#8B6A20; letter-spacing:.04em; flex-shrink:0;
  }
  .fh-dn-rstreak-bar {
    display:flex; align-items:center; gap:6px; margin-top:2px;
  }
  .fh-dn-rstreak-num {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:700;
    color:#6B5020; letter-spacing:.04em; margin-left:auto;
  }

  /* Rail \xC2\xB7 Recent findings */
  .fh-dn-rfind { padding:5px 0; }
  .fh-dn-rfind + .fh-dn-rfind { border-top:1px dotted rgba(43,31,14,.2); }
  .fh-dn-rfind-tag {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:700;
    color:#8A7349; letter-spacing:.14em; margin-bottom:2px;
  }
  .fh-dn-rfind-row { display:flex; align-items:baseline; gap:8px; }
  .fh-dn-rfind-name {
    flex:1; min-width:0;
    font-family:"Bree Serif","Georgia",serif; font-size:.95rem; color:#2B1F0E;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-dn-rfind-pts {
    font-family:"JetBrains Mono",monospace; font-size:.82rem; font-weight:700;
    color:#8B6A20; flex-shrink:0;
  }

  /* Slim row chips (S8 \xE2\u20AC\u201D replaces inline streak badge + footprint row inside cards) */
  .fh-dn-chip-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:3px; }
  .fh-dn-chip {
    display:inline-flex; align-items:center;
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:700;
    letter-spacing:.06em; padding:1px 6px; border-radius:2px;
    border:1px solid rgba(43,31,14,.3); color:#4A3218;
    background:rgba(216,154,54,.12); white-space:nowrap;
  }
  .fh-dn-chip-streak  { color:#8B6A20; border-color:rgba(139,106,32,.45); }
  .fh-dn-chip-overdue { color:#8C281E; border-color:rgba(140,40,30,.5); background:rgba(140,40,30,.08); }
  .fh-dn-chip-reset   { color:#8B6A20; border-color:rgba(139,106,32,.4); background:rgba(216,154,54,.18); }
  .fh-dn-footprints { display:flex; gap:3px; align-items:center; }
  .fh-dn-footprint { font-size:.95rem; line-height:1; }
  .fh-dn-footprint.dim { opacity:.55; filter:grayscale(.6) contrast(.85); }
  .fh-dn-footer { display:flex; justify-content:space-between; margin-top:10px; font-family:"JetBrains Mono",monospace; font-size:.75rem; color:#8A7349; letter-spacing:.12em; border-top:1px dashed rgba(43,31,14,.2); padding-top:6px; text-transform:uppercase; }
  .fh-dn-section-hdr {
    font-size:.82rem; font-weight:700; letter-spacing:.1em;
    text-transform:uppercase; color:#6B5020; margin:6px 0 2px;
    border-bottom:1px solid rgba(43,31,14,.2); padding-bottom:3px;
  }
  .fh-dn-empty { font-size:.82rem; color:#6B5020; text-align:center; padding:32px 16px; letter-spacing:.06em; }
  /* Card list */
  /* Dinos \xE2\u20AC\u201D card row chrome moved to shared .fh-row--dinos (S9) */
  .fh-dn-pts-tag    { flex-shrink:0; font-size:.82rem; font-weight:700; font-family:"JetBrains Mono", monospace; color:#2B1F0E; }
  .fh-dn-streak-badge {
    display:inline-block; padding:2px 7px; border-radius:2px; margin-top:3px;
    font-size:.75rem; font-weight:700;
    background:rgba(43,31,14,.12); color:#6B5020; letter-spacing:.06em;
  }
  .fh-dn-go-btn {
    flex-shrink:0; padding:7px 10px; border-radius:2px; border:none;
    background:#2B1F0E; color:#E8DAB7; font-weight:700; font-size:.92rem;
    font-family:"JetBrains Mono", monospace; letter-spacing:.06em; text-transform:uppercase;
    cursor:pointer; transition:transform .1s, box-shadow .1s;
    transform:rotate(-1.5deg); box-shadow:2px 2px 0 rgba(43,31,14,.3);
  }
  .fh-dn-go-btn:hover  { transform:rotate(0deg); }
  .fh-dn-go-btn:active { transform:rotate(0deg) scale(.94); }
  .fh-dn-go-btn.overdue  { background:#8C281E; transform:rotate(-1.5deg); }
  .fh-dn-go-btn.disabled { opacity:.35; cursor:not-allowed; transform:none; box-shadow:none; }
  /* Supply */
  .fh-dn-supply     { display:flex; flex-direction:column; gap:8px; }
  .fh-dn-supply-item {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    background:#F0E5C8; border:1px solid rgba(43,31,14,.2); border-radius:4px;
  }
  .fh-dn-supply-body { flex:1; min-width:0; }
  .fh-dn-supply-name { font-size:1.0rem; font-weight:700; color:#2B1F0E; }
  .fh-dn-supply-desc { font-size:.75rem; color:#6B5020; margin-top:2px; }
  /* Log */
  .fh-dn-log      { display:flex; flex-direction:column; }
  .fh-dn-log-row  {
    display:flex; align-items:center; gap:10px;
    padding:7px 0; border-bottom:1px dashed rgba(43,31,14,.18);
  }
  .fh-dn-log-row:last-child { border-bottom:none; }
  .fh-dn-log-type {
    font-size:.82rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
    flex-shrink:0; min-width:72px; color:#6B5020;
  }
  .fh-dn-log-name { flex:1; font-size:.95rem; color:#4A3218; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  /* Child mode overrides \xE2\u20AC\u201D replaced by unified kid-mode renderer */

  /* ===========================================================================
     Harry Potter theme  (Olivia)  \xE2\u20AC\u201D parchment / wizarding school aesthetic
     =========================================================================== */

  .fh-hp-page {
    background:#EFE0BA; border-radius:var(--fh-radius); padding:18px;
    min-height:100%; box-sizing:border-box; color:#241914;
    font-family:"Crimson Pro", Georgia, serif;
    position:relative; overflow:hidden;
    background-image:radial-gradient(ellipse at 12% 8%, rgba(215,191,140,.6), transparent 42%), radial-gradient(ellipse at 88% 92%, rgba(215,191,140,.6), transparent 42%), repeating-radial-gradient(circle at 35% 60%, rgba(215,191,140,.15) 0, rgba(215,191,140,.15) 1px, transparent 1px, transparent 4px);
  }
  /* Crest watermark */
  .fh-hp-crest-watermark {
    position:absolute; right:8px; top:8px; pointer-events:none;
    opacity:.04; font-size:7rem; user-select:none; z-index:0; color:#241914;
  }
  .fh-hp-title-block, .fh-hp-stat-strip, .fh-hp-tabs, .fh-hp-body, .fh-hp-footer { position:relative; z-index:2; }
  .fh-hp-frame { position:absolute; inset:0; box-shadow:inset 0 0 0 5px #241914, inset 0 0 0 6px #C9A22A, inset 0 0 0 8px #241914; pointer-events:none; z-index:0; border-radius:var(--fh-radius); }
  .fh-hp-corner { position:absolute; color:#C9A22A; font-family:"Cinzel",serif; font-size:1.4rem; opacity:.7; line-height:.7; pointer-events:none; z-index:1; }
  .fh-hp-corner-tl { top:10px; left:12px; }
  .fh-hp-corner-tr { top:10px; right:12px; transform:scaleX(-1); display:inline-block; }
  .fh-hp-corner-bl { bottom:10px; left:12px; transform:scaleY(-1); display:inline-block; }
  .fh-hp-corner-br { bottom:10px; right:12px; transform:scale(-1,-1); display:inline-block; }
  .fh-hp-title-block { padding-bottom:12px; border-bottom:2px double rgba(36,25,20,.35); margin-bottom:10px; }
  .fh-hp-title-row { display:flex; align-items:center; gap:10px; }
  .fh-hp-title-center { flex:1; text-align:center; }
  .fh-hp-title-kicker { font-family:"Cinzel",serif; font-size:.75rem; letter-spacing:.2em; color:#6F1B26; font-weight:600; text-transform:uppercase; }
  .fh-hp-title-main { font-family:"Cinzel",serif; font-size:1.6rem; color:#241914; line-height:1; letter-spacing:.04em; font-weight:700; margin-top:2px; }
  .fh-hp-title-sub { font-family:"Crimson Pro",Georgia,serif; font-style:italic; font-size:.82rem; color:#5A3F2A; margin-top:3px; }
  .fh-hp-crest-simple { width:32px; height:32px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.4rem; color:#1F4F3C; }
  .fh-hp-wax-seal { width:38px; height:38px; border-radius:50%; background:radial-gradient(circle at 35% 30%, #9F2B36, #6F1B26 60%, #3E0E13); border:2px solid #C9A22A; display:flex; align-items:center; justify-content:center; font-family:"Cinzel",serif; font-weight:700; font-size:1rem; color:#C9A22A; box-shadow:inset 0 -3px 6px rgba(0,0,0,.35), 0 3px 8px rgba(0,0,0,.2); flex-shrink:0; }
  .fh-hp-stat-strip { display:flex; flex-wrap:wrap; gap:0; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid rgba(36,25,20,.2); }
  .fh-hp-sstat { flex:1 1 80px; padding:4px 6px; border-right:1px solid rgba(36,25,20,.15); min-width:0; }
  .fh-hp-sstat:last-child { border-right:none; }
  .fh-hp-sstat-lbl { display:block; font-family:"Cinzel",serif; font-size:.75rem; color:#8C7252; letter-spacing:.22em; font-weight:700; text-transform:uppercase; }
  .fh-hp-sstat-val { font-family:"Cinzel",serif; font-size:1.05rem; font-weight:700; color:#241914; line-height:1; }
  .fh-hp-sstat-next { font-family:"Crimson Pro",serif; font-style:italic; font-size:.85rem; font-weight:400; }
  .fh-hp-tabs     { display:flex; gap:4px; margin-bottom:10px; flex-wrap:wrap; }
  .fh-hp-tab {
    padding:5px 11px; border-radius:4px;
    font-family:"Cinzel", serif; font-size:.85rem; font-weight:600; letter-spacing:.04em;
    display:flex; flex-direction:column; align-items:center;
    cursor:pointer; color:#5A4020; background:rgba(36,25,20,.06); user-select:none;
    transition:background .15s, color .15s;
  }
  .fh-hp-tab.active { background:#1F4F3C; color:#EFE0BA; }
  .fh-hp-tab-sub { display:block; font-family:"Crimson Pro",Georgia,serif; font-size:.75rem; letter-spacing:.03em; color:rgba(90,64,42,.7); margin-top:1px; font-style:italic; }
  .fh-hp-tab.active .fh-hp-tab-sub { color:rgba(239,224,186,.7); }
  /* HP body two-column layout \xE2\u20AC\u201D left scrolls + right parchment rail */
  .fh-hp-body { display:flex; flex-direction:column; gap:6px; }
  .fh-hp-body.has-rail { gap:12px; }
  .fh-hp-body-main { min-width:0; }
  .fh-hp-rail { display:flex; flex-direction:column; gap:10px; }
  @media (min-width: 900px) {
    .fh-hp-body.has-rail {
      display:grid;
      grid-template-columns: minmax(0, 1fr) 480px;
      gap:14px;
      align-items:start;
    }
  }
  .fh-hp-rpanel {
    position:relative; background:#FAF0D7; border:1px solid rgba(36,25,20,.3);
    padding:10px 12px;
    box-shadow:inset 0 0 0 3px rgba(36,25,20,.04);
  }
  .fh-hp-rpanel-hdr {
    font-family:"Cinzel","Georgia",serif; font-size:.95rem; color:#1F4F3C;
    text-align:center; letter-spacing:.12em; font-weight:700;
    margin-bottom:6px; border-bottom:1px solid rgba(36,25,20,.2); padding-bottom:4px;
  }
  .fh-hp-rpanel-body { color:#241914; }
  .fh-hp-rempty {
    font-family:"Crimson Pro","Georgia",serif; font-size:.95rem; font-style:italic;
    color:#5A4020; text-align:center; padding:6px 0;
  }
  .fh-hp-rmax {
    font-family:"Cinzel",serif; font-size:.95rem; color:#1F4F3C;
    text-align:center; padding:4px 0;
  }
  .fh-hp-rkpi-row { display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; }
  .fh-hp-rkpi {
    display:flex; flex-direction:column; align-items:center;
    border-right:1px solid rgba(36,25,20,.2); padding-right:6px;
  }
  .fh-hp-rkpi:last-child { border-right:none; padding-right:0; }
  .fh-hp-rkpi-lbl {
    font-family:"Cinzel",serif; font-size:.75rem; font-weight:700;
    color:#5A4020; letter-spacing:.1em; margin-bottom:2px;
  }
  .fh-hp-rkpi-val-row { display:flex; align-items:baseline; gap:2px; }
  .fh-hp-rkpi-val {
    font-family:"Cinzel","Georgia",serif; font-size:1.15rem; font-weight:700;
    color:#241914; line-height:1;
  }
  .fh-hp-rkpi-unit { font-size:.75rem; color:#5A4020; }
  .fh-hp-rstreak { padding:5px 0; }
  .fh-hp-rstreak + .fh-hp-rstreak { border-top:1px dotted rgba(36,25,20,.2); }
  .fh-hp-rstreak-head { display:flex; align-items:center; gap:8px; }
  .fh-hp-rstreak-name {
    flex:1; min-width:0;
    font-family:"Crimson Pro",serif; font-size:1rem; color:#241914;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-hp-rbonus {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:800; color:#C9A22A;
  }
  .fh-hp-rstreak-bar { display:flex; align-items:center; gap:6px; margin-top:3px; }
  .fh-hp-rstars { display:flex; gap:2px; }
  .fh-hp-rstar { font-size:.9rem; line-height:1; color:rgba(36,25,20,.25); }
  .fh-hp-rstar.lit { color:#C9A22A; }
  .fh-hp-rstreak-num {
    font-family:"JetBrains Mono",monospace; font-size:.75rem; color:#5A4020; margin-left:auto;
  }
  .fh-hp-rowl { padding:5px 0; }
  .fh-hp-rowl + .fh-hp-rowl { border-top:1px dotted rgba(36,25,20,.2); }
  .fh-hp-rowl-when {
    font-family:"Crimson Pro",serif; font-style:italic; font-size:.85rem; color:#5A4020;
  }
  .fh-hp-rowl-row { display:flex; gap:8px; align-items:baseline; }
  .fh-hp-rowl-name {
    flex:1; min-width:0;
    font-family:"Crimson Pro",serif; font-size:.95rem; color:#241914;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-hp-rowl-pts {
    font-family:"JetBrains Mono",monospace; font-size:.85rem; font-weight:700; color:#1F4F3C;
  }
  /* HP slim row chips */
  .fh-hp-chip-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:3px; }
  .fh-hp-chip {
    display:inline-flex; align-items:center;
    font-family:"JetBrains Mono",monospace; font-size:.75rem; font-weight:700;
    letter-spacing:.04em; padding:1px 6px; border-radius:2px;
    border:1px solid rgba(36,25,20,.3); color:#241914;
    background:rgba(201,162,42,.1); white-space:nowrap;
  }
  .fh-hp-chip-streak  { color:#C9A22A; border-color:rgba(201,162,42,.5); }
  .fh-hp-chip-overdue { color:#A02020; border-color:rgba(160,32,32,.5); background:rgba(160,32,32,.08); }
  .fh-hp-chip-reset   { color:#1F4F3C; border-color:rgba(31,79,60,.5); background:rgba(31,79,60,.08); }
  .fh-hp-stars { display:flex; gap:2px; align-items:center; margin-top:5px; }
  .fh-hp-star { font-size:.95rem; line-height:1; color:#D7BF8C; }
  .fh-hp-star.lit { color:#C9A22A; filter:drop-shadow(0 0 3px rgba(201,162,42,.65)); }
  .fh-hp-footer { display:flex; justify-content:space-between; margin-top:10px; font-family:"Crimson Pro",Georgia,serif; font-style:italic; font-size:.8rem; color:#8C7252; border-top:1px solid rgba(36,25,20,.15); padding-top:6px; }
  .fh-hp-section-hdr {
    font-family:"Cinzel", serif; font-size:.82rem; font-weight:700; letter-spacing:.08em;
    text-transform:uppercase; color:#5A4020; margin:6px 0 2px;
  }
  .fh-hp-empty {
    font-family:"Crimson Pro", Georgia, serif; font-style:italic;
    font-size:.95rem; color:#5A4020; text-align:center; padding:32px 16px;
  }
  /* Scroll (task card) */
  /* HP \xE2\u20AC\u201D scroll row chrome moved to shared .fh-row--hp (S9) */
  .fh-hp-pts-seal { flex-shrink:0; font-family:"Cinzel", serif; font-size:.85rem; font-weight:700; color:#241914; }
  .fh-hp-streak-badge {
    display:inline-block; padding:2px 7px; border-radius:20px; margin-top:3px;
    font-size:.75rem; font-weight:700; background:rgba(201,162,42,.2); color:#7A5010;
  }
  .fh-hp-cast-btn {
    flex-shrink:0; padding:7px 14px; border-radius:4px; border:none;
    background:#1F4F3C; color:#EFE0BA;
    font-family:"Cinzel", serif; font-weight:700; font-size:.95rem; letter-spacing:.04em;
    cursor:pointer; transition:opacity .15s, transform .1s;
  }
  .fh-hp-cast-btn:active { transform:scale(.95); }
  .fh-hp-cast-btn.overdue { background:#6F1B26; }
  .fh-hp-cast-btn.disabled { opacity:.35; cursor:not-allowed; }
  /* Vault (store) */
  .fh-hp-vault     { display:flex; flex-direction:column; gap:8px; }
  .fh-hp-vault-item {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    background:#FAF0D7; border:1px solid rgba(36,25,20,.18); border-radius:6px;
  }
  .fh-hp-vault-body { flex:1; min-width:0; }
  .fh-hp-vault-name {
    font-family:"Cinzel", serif; font-size:1.05rem; font-weight:600; color:#241914;
  }
  .fh-hp-vault-desc {
    font-family:"Crimson Pro", serif; font-style:italic; font-size:.8rem; color:#5A4020; margin-top:2px;
  }
  /* Log */
  .fh-hp-log      { display:flex; flex-direction:column; }
  .fh-hp-log-row  {
    display:flex; align-items:center; gap:10px;
    padding:7px 0; border-bottom:1px solid rgba(36,25,20,.12);
  }
  .fh-hp-log-row:last-child { border-bottom:none; }
  .fh-hp-log-type {
    font-family:"Cinzel", serif; font-size:.85rem; font-weight:700;
    letter-spacing:.04em; flex-shrink:0; min-width:72px; color:#5A4020;
  }
  .fh-hp-log-name {
    font-family:"Crimson Pro", serif; flex:1; font-size:1.05rem;
    color:#3A2810; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  /* Child mode overrides \xE2\u20AC\u201D replaced by unified kid-mode renderer */

  /* ===========================================================================
     Dragon Ball Z theme  (Jackson)  \xE2\u20AC\u201D sky-blue\xE2\u2020\u2019orange manga energy
     =========================================================================== */

  .fh-dbz-page {
    background:linear-gradient(180deg, #3FAAD9 0%, #7BD3F2 45%, #FFB229 75%, #FF6A1A 100%);
    border-radius:var(--fh-radius); padding:14px;
    min-height:100%; box-sizing:border-box; color:#0F1E2E;
    font-family:"Bricolage Grotesque", system-ui, sans-serif;
    position:relative; overflow:hidden;
  }
  /* Speed-lines overlay */
  .fh-dbz-speedlines {
    position:absolute; inset:0; pointer-events:none; z-index:0;
    background:repeating-conic-gradient(
      from 0deg at 110% -10%,
      rgba(255,255,255,.06) 0deg,
      rgba(255,255,255,.06) 1deg,
      transparent 1deg,
      transparent 5deg
    );
  }
  /* Halftone dots */
  .fh-dbz-halftone {
    position:absolute; inset:0; pointer-events:none; z-index:0;
    background-image:radial-gradient(rgba(15,30,46,.5) 1.5px, transparent 1.5px);
    background-size:14px 14px;
    -webkit-mask-image:radial-gradient(circle at 0% 100%, black, transparent 52%), radial-gradient(circle at 100% 0%, black, transparent 48%);
    mask-image:radial-gradient(circle at 0% 100%, black, transparent 52%), radial-gradient(circle at 100% 0%, black, transparent 48%);
    -webkit-mask-composite:source-over; mask-composite:add;
  }
  /* Legacy scan-lines \xE2\u20AC\u201D hidden in new design */
  .fh-dbz-scanlines { display:none; }
  .fh-dbz-header, .fh-dbz-mission-strip, .fh-dbz-tabs, .fh-dbz-body, .fh-dbz-next-bar { position:relative; z-index:2; }
  /* Header */
  .fh-dbz-header   { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
  .fh-dbz-avatar {
    width:52px; height:52px; border-radius:50%; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:1.2rem;
    background:#0F1E2E; color:#FFE03A;
    border:3px solid #FFE03A;
    box-shadow:0 0 0 2px #0F1E2E, 0 4px 12px rgba(15,30,46,.4);
  }
  .fh-dbz-identity { flex:1; min-width:0; }
  .fh-dbz-codename {
    font-size:.75rem; font-weight:800; letter-spacing:.28em; color:#FFE03A;
    text-shadow:1px 1px 0 #0F1E2E; margin-bottom:1px;
  }
  .fh-dbz-name {
    font-size:1.5rem; font-weight:900; letter-spacing:.06em; color:#0F1E2E;
    text-shadow:2px 2px 0 rgba(255,255,255,.3), 4px 4px 0 rgba(15,30,46,.25);
    line-height:1;
  }
  .fh-dbz-rank {
    font-size:.75rem; font-weight:700; letter-spacing:.06em; margin-top:1px; color:#0F1E2E; opacity:.75;
  }
  /* Power level box */
  .fh-dbz-power-badge {
    display:flex; flex-direction:column; align-items:flex-end; flex-shrink:0;
    background:#0F1E2E; border:2.5px solid #FFE03A; padding:4px 8px;
    border-radius:4px; box-shadow:0 3px 0 rgba(15,30,46,.5);
  }
  .fh-dbz-power-num {
    font-size:1.6rem; font-weight:900; font-family:"JetBrains Mono", monospace;
    line-height:1; letter-spacing:-.02em; color:#FFE03A;
    text-shadow:0 0 8px rgba(255,224,58,.5);
  }
  .fh-dbz-power-lbl {
    font-size:.75rem; font-weight:700; letter-spacing:.1em; color:rgba(255,224,58,.7);
  }
  /* Mission strip */
  .fh-dbz-mission-strip {
    display:flex; align-items:center; gap:8px;
    padding:4px 10px; margin-bottom:8px;
    background:rgba(15,30,46,.75); border:2px solid #0F1E2E; border-radius:4px;
    font-size:.75rem; font-weight:700; letter-spacing:.06em; color:#FFFFFF;
  }
  .fh-dbz-strip-label { color:rgba(255,255,255,.7); }
  .fh-dbz-strip-count { font-size:.9rem; font-weight:900; color:#FFE03A; }
  /* Tabs */
  .fh-dbz-tabs { display:flex; gap:4px; margin-bottom:10px; }
  .fh-dbz-tab {
    flex:1; padding:6px 4px; border-radius:4px; font-size:.75rem; font-weight:900;
    letter-spacing:.06em; text-align:center; cursor:pointer;
    color:rgba(15,30,46,.8); background:rgba(255,255,255,.45);
    border:2px solid rgba(15,30,46,.2); user-select:none;
    transition:background .15s, color .15s;
  }
  .fh-dbz-tab.active { background:#0F1E2E; color:#FFE03A; border-color:#0F1E2E; }
  /* DBZ body two-column layout \xE2\u20AC\u201D left mission grid + right comic-card rail */
  .fh-dbz-body { position:relative; display:flex; flex-direction:column; gap:6px; }
  .fh-dbz-body.has-rail { gap:12px; }
  .fh-dbz-body-main { min-width:0; }
  .fh-dbz-rail { display:flex; flex-direction:column; gap:10px; }
  @media (min-width: 900px) {
    .fh-dbz-body.has-rail {
      display:grid;
      grid-template-columns: minmax(0, 1fr) 480px;
      gap:14px;
      align-items:start;
    }
  }
  .fh-dbz-rpanel {
    position:relative; background:#FFFFFF;
    border:3px solid #0F1E2E; border-radius:8px;
    box-shadow:0 4px 0 #0F1E2E; padding:10px 12px;
  }
  .fh-dbz-rpanel-hdr {
    font-family:"Bricolage Grotesque","Bree Serif",sans-serif; font-weight:800;
    font-size:.95rem; color:#0F1E2E; text-align:center; letter-spacing:.06em;
    border-bottom:2px solid #0F1E2E; padding-bottom:4px; margin-bottom:6px;
  }
  .fh-dbz-rpanel-body { color:#0F1E2E; }
  .fh-dbz-rempty {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:.85rem;
    color:rgba(15,30,46,.6); text-align:center; padding:6px 0; letter-spacing:.04em;
  }
  .fh-dbz-rmax {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:1rem;
    color:#FF6A1A; text-align:center; padding:4px 0;
  }
  .fh-dbz-rkpi-row { display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; }
  .fh-dbz-rkpi { display:flex; flex-direction:column; align-items:center; }
  .fh-dbz-rkpi-lbl {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:.75rem;
    color:rgba(15,30,46,.7); letter-spacing:.08em; margin-bottom:2px;
  }
  .fh-dbz-rkpi-val-row { display:flex; align-items:baseline; gap:2px; }
  .fh-dbz-rkpi-val {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:1.3rem;
    color:#FF6A1A; line-height:1;
  }
  .fh-dbz-rkpi-unit { font-size:.85rem; color:#0F1E2E; font-weight:700; }
  .fh-dbz-rstreak { padding:5px 0; }
  .fh-dbz-rstreak + .fh-dbz-rstreak { border-top:1px dashed rgba(15,30,46,.2); }
  .fh-dbz-rstreak-head { display:flex; align-items:center; gap:8px; }
  .fh-dbz-rstreak-name {
    flex:1; min-width:0;
    font-family:"Bricolage Grotesque",sans-serif; font-weight:700; font-size:.95rem;
    color:#0F1E2E;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-dbz-rbonus {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:.85rem;
    color:#FF6A1A;
  }
  .fh-dbz-rstreak-bar { display:flex; align-items:center; gap:6px; margin-top:3px; }
  .fh-dbz-rbolts { display:flex; gap:1px; }
  .fh-dbz-rbolt { font-size:.95rem; line-height:1; }
  .fh-dbz-rbolt.dim { opacity:.25; filter:grayscale(.5); }
  .fh-dbz-rstreak-num {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:700; font-size:.8rem;
    color:rgba(15,30,46,.7); margin-left:auto;
  }
  .fh-dbz-rnext-name {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:1.05rem;
    color:#0F1E2E; text-align:center;
  }
  .fh-dbz-rnext-cost {
    font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-size:.9rem;
    color:#FF6A1A; text-align:center; margin:2px 0 6px;
  }
  /* DBZ \xE2\u20AC\u201D mission row chrome moved to shared .fh-row--dbz (S9).
     Port the icon energy-aura to the new selector. */
  .fh-row--dbz .fh-row-icon::before {
    content:''; position:absolute; inset:-4px; border-radius:50%;
    background:radial-gradient(circle, rgba(255,224,58,.35) 0%, transparent 70%);
    pointer-events:none;
  }
  /* GO button \xE2\u20AC\u201D comic-book styled (slimmed for row layout) */
  .fh-dbz-go-btn {
    min-height:48px; min-width:60px; flex-shrink:0;
    padding:0 14px; border-radius:8px; border:3px solid #0F1E2E;
    background:linear-gradient(180deg, #FF6A1A 0%, #FF8C00 100%);
    color:#0F1E2E;
    font-size:1rem; font-weight:900; letter-spacing:.05em;
    cursor:pointer; transition:transform .1s, box-shadow .1s;
    box-shadow:0 4px 0 #0F1E2E;
  }
  .fh-dbz-go-btn:active { transform:translateY(4px); box-shadow:0 2px 0 #0F1E2E; }
  .fh-dbz-go-btn.overdue {
    background:linear-gradient(180deg, #CC2200 0%, #FF3300 100%);
    border-color:#0F1E2E; box-shadow:0 6px 0 #0F1E2E;
  }
  .fh-dbz-go-btn.locked  {
    background:rgba(255,255,255,.4); border-color:rgba(15,30,46,.4);
    box-shadow:none; color:rgba(15,30,46,.5);
  }
  /* Streak + alert badges */
  .fh-dbz-streak-badge {
    position:absolute; top:6px; right:6px;
    padding:2px 6px; border-radius:4px;
    background:#FFE03A; color:#0F1E2E;
    font-size:.75rem; font-weight:900; letter-spacing:.04em;
    border:1.5px solid #0F1E2E;
  }
  .fh-dbz-alert-badge {
    position:absolute; top:6px; left:6px;
    width:18px; height:18px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:.75rem; font-weight:900; color:#fff;
    border:2px solid rgba(0,0,0,.3);
  }
  /* Section header */
  .fh-dbz-section-hdr {
    font-size:.75rem; font-weight:900; letter-spacing:.1em;
    text-transform:uppercase; color:#0F1E2E;
    margin:8px 0 4px; grid-column:1/-1;
    background:rgba(15,30,46,.15); padding:2px 8px; border-radius:3px;
  }
  /* All-done state */
  .fh-dbz-all-done {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:40px 16px; gap:10px;
  }
  .fh-dbz-all-done-icon { font-size:3rem; line-height:1; }
  .fh-dbz-all-done-text {
    font-size:1.3rem; font-weight:900; letter-spacing:.1em; color:#0F1E2E;
  }
  .fh-dbz-empty { font-size:.88rem; color:rgba(15,30,46,.65); text-align:center; padding:32px 16px; }
  /* Power-ups (store) */
  .fh-dbz-powerup-list { display:flex; flex-direction:column; gap:8px; }
  .fh-dbz-powerup-row {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    background:#FFFFFF; border:3px solid #0F1E2E; border-radius:8px;
    box-shadow:0 4px 0 #0F1E2E;
  }
  .fh-dbz-powerup-row.locked { opacity:.6; }
  .fh-dbz-powerup-body { flex:1; min-width:0; }
  .fh-dbz-powerup-name { font-size:.9rem; font-weight:800; color:#0F1E2E; }
  .fh-dbz-powerup-cost { font-size:.85rem; font-weight:900; font-family:"JetBrains Mono", monospace; margin-top:2px; color:#FF6A1A; }
  /* Battle log */
  .fh-dbz-log {
    display:flex; flex-direction:column;
    background:rgba(255,255,255,.65); border-radius:8px; padding:8px;
  }
  .fh-dbz-log-row  {
    display:flex; align-items:center; gap:10px;
    padding:7px 0; border-bottom:1px solid rgba(15,30,46,.15);
  }
  .fh-dbz-log-row:last-child { border-bottom:none; }
  .fh-dbz-log-type { font-size:.75rem; font-weight:900; letter-spacing:.06em; flex-shrink:0; min-width:72px; color:#FF6A1A; }
  .fh-dbz-log-name { flex:1; font-size:.82rem; color:#0F1E2E; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  /* Lightning streak */
  .fh-dbz-lightning { display:flex; gap:3px; align-items:center; margin:4px 0 2px; }
  .fh-dbz-bolt { font-size:.95rem; line-height:1; }
  .fh-dbz-bolt.dim { opacity:.2; filter:grayscale(1); }
  /* Next reward bar */
  .fh-dbz-next-bar {
    margin-top:10px; padding:10px 14px;
    background:#0F1E2E; border:3px solid #FFE03A; border-radius:10px;
    display:flex; align-items:center; gap:12px;
  }
  .fh-dbz-next-bar-body { flex:1; min-width:0; }
  .fh-dbz-next-bar-lbl { font-size:.75rem; font-weight:800; letter-spacing:.28em; color:#FFE03A; text-transform:uppercase; }
  .fh-dbz-next-bar-name { font-size:.95rem; font-weight:900; color:#FFFFFF; line-height:1.1; text-transform:uppercase; letter-spacing:.02em; }
  .fh-dbz-next-bar-track { height:12px; background:#1A2B3D; border:2px solid rgba(255,255,255,.3); border-radius:99px; overflow:hidden; margin-top:6px; }
  .fh-dbz-next-bar-fill { height:100%; background:linear-gradient(90deg, #FF6A1A, #FFE03A); box-shadow:0 0 10px rgba(255,224,58,.4); border-radius:99px; }
  /* Child mode overrides \xE2\u20AC\u201D replaced by unified kid-mode renderer */

  /* ===========================================================================
     Admin Shell (v0.6.0 S7)
     Persistent sidebar \xE2\u2030\xA51100px \xC2\xB7 bottom tab-bar below that
     AD color tokens kept as inline vars \xE2\u20AC\u201D shadow DOM scope is fine.
  =========================================================================== */

  /* ---- Layout switch driven by VIEWPORT, not container \xE2\u20AC\u201D works in HA sectioned dashboards too ---- */
  .fh-ad-shell {
    display: flex;
    flex-direction: column;
    background: #0E1622;
    color: #ECEFF6;
    font-family: 'Manrope', system-ui, sans-serif;
    border-radius: var(--fh-radius);
    overflow: hidden;
    min-height: 520px;
  }

  /* ---- Sidebar (hidden until viewport \xE2\u2030\xA51100px) ---- */
  .fh-ad-sidebar {
    display: none;
    width: 232px;
    flex-shrink: 0;
    background: #0E1622;
    border-right: 1px solid #2A3852;
    flex-direction: column;
    padding: 18px 14px;
  }
  .fh-ad-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 4px 8px 18px;
  }
  .fh-ad-brand-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: #F5C24A;
    display: grid; place-items: center;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800; font-size: var(--fh-text-base); color: #0E1622;
    flex-shrink: 0;
  }
  .fh-ad-brand-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800; font-size: var(--fh-text-base); color: #ECEFF6; line-height: 1.1;
  }
  .fh-ad-brand-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); color: #6F7E9C; font-weight: 600;
    letter-spacing: .16em; margin-top: 3px;
  }
  .fh-ad-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  .fh-ad-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 12px; border-radius: 8px;
    color: #A6B3CC; cursor: pointer;
    position: relative; user-select: none;
    transition: background .1s, color .1s;
  }
  .fh-ad-nav-item:hover { background: rgba(255,255,255,.04); color: #ECEFF6; }
  .fh-ad-nav-item.active { background: rgba(91,141,239,.14); color: #ECEFF6; }
  .fh-ad-nav-item.active::before {
    content: '';
    position: absolute; left: -14px; top: 8px; bottom: 8px; width: 3px;
    background: #5B8DEF; border-radius: 0 2px 2px 0;
  }
  .fh-ad-nav-icon { width: 20px; text-align: center; font-size: var(--fh-text-md); }
  .fh-ad-nav-label { flex: 1; font-size: var(--fh-text-sm); font-weight: 600; }
  .fh-ad-nav-badge {
    min-width: 22px; height: 22px; padding: 0 7px; border-radius: 99px;
    background: #E8553E; color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700;
    display: grid; place-items: center;
  }

  /* ---- Main pane ---- */
  .fh-ad-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

  .fh-ad-topbar {
    min-height: 64px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 12px 18px;
    border-bottom: 1px solid #2A3852;
    background: #0E1622;
  }
  .fh-ad-topbar-crumb {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); color: #6F7E9C; font-weight: 600;
    letter-spacing: .16em; margin-bottom: 4px;
  }
  .fh-ad-topbar-title {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800; font-size: var(--fh-text-lg); color: #ECEFF6;
    line-height: 1; letter-spacing: -.01em;
  }
  .fh-ad-topbar-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }

  .fh-ad-body {
    flex: 1; overflow-y: auto;
    padding: 16px 16px 22px;
    display: flex; flex-direction: column; gap: 14px;
    background: #141E2E;
    font-size: var(--fh-text-base);
  }

  /* ---- Bottom nav (mobile \xE2\u20AC\u201D shown below 1100px viewport) ---- */
  .fh-ad-bottom-nav {
    display: flex;
    border-top: 1px solid #2A3852;
    background: #0E1622;
    flex-shrink: 0;
  }
  .fh-ad-bottom-item {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 3px; padding: 10px 4px 12px;
    color: #6F7E9C; cursor: pointer;
    position: relative; user-select: none;
    transition: color .1s;
  }
  .fh-ad-bottom-item:hover { color: #A6B3CC; }
  .fh-ad-bottom-item.active { color: #5B8DEF; }
  .fh-ad-bottom-icon { font-size: var(--fh-text-md); }
  .fh-ad-bottom-label { font-size: var(--fh-text-xs); font-weight: 600; letter-spacing: .02em; }
  .fh-ad-bottom-badge {
    position: absolute; top: 5px; right: calc(50% - 16px);
    min-width: 16px; height: 16px; padding: 0 4px; border-radius: 99px;
    background: #E8553E; color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 700;
    display: grid; place-items: center;
  }

  /* ---- Wide layout: sidebar + main side by side (VIEWPORT media query) ---- */
  @media (min-width: 1100px) {
    .fh-ad-shell   { flex-direction: row; min-height: 620px; }
    .fh-ad-sidebar { display: flex; }
    .fh-ad-bottom-nav { display: none; }
    .fh-ad-body    { padding: 20px 24px 26px; }
    .fh-ad-topbar  { padding: 14px 24px; min-height: 70px; }
    .fh-ad-topbar-title { font-size: var(--fh-text-xl); }
  }

  /* ---- Stat strip ---- */
  .fh-ad-stat-row {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
  }
  @media (min-width: 700px) {
    .fh-ad-stat-row { grid-template-columns: repeat(4, 1fr); }
  }
  .fh-ad-stat {
    background: #1A2538; border: 1px solid #2A3852;
    border-radius: 10px; padding: 14px 16px;
  }
  .fh-ad-stat-val {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800; font-size: var(--fh-text-xl); line-height: 1;
  }
  .fh-ad-stat-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700; letter-spacing: .1em;
    color: #6F7E9C; margin-top: 6px; text-transform: uppercase;
  }

  /* ---- Today 2-column grid ---- */
  .fh-ad-today-grid { display: flex; flex-direction: column; gap: 14px; }
  @media (min-width: 900px) {
    .fh-ad-today-grid { flex-direction: row; align-items: flex-start; }
    .fh-ad-today-queue    { flex: 1; }
    .fh-ad-today-activity { flex: 1; }
  }

  /* ---- Panel card ---- */
  .fh-ad-panel {
    background: #1A2538; border: 1px solid #2A3852; border-radius: 12px;
    overflow: hidden;
  }
  .fh-ad-panel-hdr {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 10px; padding: 14px 16px;
    border-bottom: 1px solid #2A3852;
  }
  .fh-ad-panel-title {
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: var(--fh-text-base); color: #ECEFF6;
  }
  .fh-ad-panel-sub { font-size: var(--fh-text-sm); font-weight: 500; color: #6F7E9C; }
  .fh-ad-panel-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }

  /* ---- Queue rows (Today action queue) ---- */
  .fh-ad-queue-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #2A3852;
  }
  .fh-ad-queue-row:last-child { border-bottom: none; }
  .fh-ad-queue-info  { flex: 1; min-width: 0; }
  .fh-ad-queue-name  {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 700; font-size: var(--fh-text-base); color: #ECEFF6; line-height: 1.3;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .fh-ad-queue-meta  { font-size: var(--fh-text-sm); color: #A6B3CC; margin-top: 3px; }
  .fh-ad-queue-time  { font-size: var(--fh-text-xs); color: #6F7E9C; font-weight: 500; }

  /* ---- Pills ---- */
  .fh-ad-pill {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: 99px; border: 1px solid transparent;
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700; letter-spacing: .08em;
  }
  .fh-ad-pill--amber { background: rgba(245,194,74,.15); border-color: rgba(245,194,74,.3); color: #F5C24A; }
  .fh-ad-pill--rose  { background: rgba(227,109,164,.15); border-color: rgba(227,109,164,.3); color: #E36DA4; }

  /* ---- Activity rows (Today recent) ---- */
  .fh-ad-activity-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 16px;
    border-bottom: 1px solid #2A3852;
  }
  .fh-ad-activity-row:last-child { border-bottom: none; }
  .fh-ad-activity-name {
    font-size: var(--fh-text-sm); color: #ECEFF6; font-weight: 500; line-height: 1.3;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .fh-ad-activity-meta  { font-size: var(--fh-text-xs); margin-top: 2px; }
  .fh-ad-activity-time  {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); color: #6F7E9C; font-weight: 600;
    flex-shrink: 0; min-width: 28px; text-align: right;
  }

  /* ---- Family grid ---- */
  .fh-ad-family-grid { display: flex; flex-direction: column; gap: 10px; }
  @media (min-width: 850px) {
    .fh-ad-family-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  }
  .fh-ad-person-card {
    background: #1A2538; border: 1px solid #2A3852;
    border-radius: 10px; overflow: hidden;
  }
  .fh-ad-person-top {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 14px;
  }
  .fh-ad-person-btns { display: flex; gap: 6px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
  .fh-ad-person-name {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800; font-size: var(--fh-text-base); color: #ECEFF6;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .fh-ad-person-type { font-size: var(--fh-text-sm); font-weight: 600; color: #6F7E9C; font-family: 'Manrope', sans-serif; }
  .fh-ad-person-code {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700; color: #F5C24A;
    letter-spacing: .08em;
    padding: 2px 6px; border-radius: 4px;
    background: rgba(245,194,74,.1); border: 1px solid rgba(245,194,74,.2);
  }
  .fh-ad-person-bal { font-size: var(--fh-text-sm); color: #A6B3CC; margin-top: 4px; }
  .fh-ad-person-foot {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    padding: 10px 14px;
    background: rgba(255,255,255,.025);
    border-top: 1px solid #2A3852;
  }

  /* ---- Settings grid (S9 P3 \u2014 3 panels: config + hub layout stacked left, store right) ---- */
  .fh-ad-settings-grid {
    display: grid; gap: 14px;
    grid-template-columns: 1fr;
  }
  @media (min-width: 900px) {
    .fh-ad-settings-grid {
      grid-template-columns: 1.15fr 1fr;
      grid-template-areas:
        "config  store"
        "hub     store";
      align-items: start;
    }
    .fh-ad-settings-left  { grid-area: config; }
    .fh-ad-settings-hub   { grid-area: hub; }
    .fh-ad-settings-right { grid-area: store; }
  }

  /* ---- Hub layout room toggle rows (S9 P3) ---- */
  .fh-hub-room-list {
    display: flex; flex-direction: column; gap: 8px;
    margin-bottom: 4px;
  }
  .fh-hub-room-row {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 10px;
    background: var(--fh-surface);
    border: 1px solid var(--fh-border);
    border-radius: var(--fh-radius-sm);
  }
  .fh-hub-room-icon {
    width: 28px; height: 28px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .fh-hub-room-icon svg { width: 22px; height: 22px; }
  .fh-hub-room-info { flex: 1; min-width: 0; }
  .fh-hub-room-name {
    font-size: var(--fh-text-sm); font-weight: 700;
    color: var(--fh-text);
  }
  .fh-hub-room-sub {
    font-size: var(--fh-text-xs);
    color: var(--fh-text-sec);
    margin-top: 1px;
  }
  .fh-hub-room-sub em {
    font-style: normal;
    color: var(--fh-warning);
    letter-spacing: .04em;
  }

  /* ---- Tasks section: 1-col on mobile, 2-col grid at \u22651280px (S9 P3 item 5) ---- */
  .fh-ad-tasks-wrap {
    display: flex; flex-direction: column; gap: 14px; min-width: 0;
  }
  @media (min-width: 1280px) {
    .fh-ad-tasks-wrap {
      display: grid; grid-template-columns: 1fr 480px;
      gap: 16px; align-items: start;
    }
  }

  /* ---- Inline editor side panel \u2014 reuses .fh-ad-panel chrome ---------
     Matches list panel exactly: same bg, border, radius, header padding.
     No internal scroll, no sticky positioning. With tabs, panes stay short
     enough that the outer admin body scrolls naturally if needed. */
  .fh-ad-tasks-panel { display: none; }
  @media (min-width: 1280px) {
    .fh-ad-tasks-panel {
      display: flex; flex-direction: column;
      background: #1A2538;
      border: 1px solid #2A3852;
      border-radius: 12px;
      overflow: hidden;
    }
  }
  .fh-ad-tasks-panel-hdr {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid #2A3852;
    flex-shrink: 0;
  }
  .fh-ad-tasks-panel-title {
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: var(--fh-text-base); color: #ECEFF6;
  }
  .fh-ad-tasks-panel-sub {
    font-size: var(--fh-text-sm); color: #6F7E9C; margin-top: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
  }
  .fh-ad-tasks-panel-body {
    padding: 14px 16px;
    display: flex; flex-direction: column;
    /* No max-height / overflow \u2014 let the page scroll if needed. */
  }
  .fh-ad-tasks-panel-footer {
    display: flex; gap: 8px; padding: 12px 16px;
    border-top: 1px solid #2A3852; flex-shrink: 0;
  }
  .fh-ad-tasks-panel-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 20px; gap: 14px; color: #3A4E6A; user-select: none;
  }
  .fh-ad-tasks-panel-empty-icon {
    font-size: 2.2rem; opacity: .5;
  }
  .fh-ad-tasks-panel-empty-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase;
  }

  /* ---- Chore form tab strip (modal + inline panel) ---- */
  .fh-chore-tabs {
    display: flex; gap: 2px;
    border-bottom: 1px solid #2A3852;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .fh-chore-tab {
    background: transparent; border: none;
    color: #6F7E9C; cursor: pointer;
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: var(--fh-text-sm); letter-spacing: .01em;
    padding: 10px 14px;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color .1s, border-color .1s;
    white-space: nowrap;
  }
  .fh-chore-tab:hover { color: #A6B3CC; }
  .fh-chore-tab.active {
    color: #5B8DEF;
    border-bottom-color: #5B8DEF;
  }
  .fh-chore-tab-pane {
    display: flex; flex-direction: column; gap: 12px;
  }
  .fh-form-group-lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase;
    color: #6F7E9C;
    margin-top: 2px;
  }

  /* ---- Inline icon grid (always-visible, embedded in Details tab) ---- */
  .fh-chore-icon-grid {
    background: #202D45;
    border: 1px solid #3A4B6B;
    border-radius: 8px;
    padding: 10px;
    display: flex; flex-direction: column; gap: 6px;
    max-height: 320px;
    overflow-y: auto;
  }
  .fh-chore-icon-grid .fh-icon-picker-cat-hdr {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700;
    color: #6F7E9C; letter-spacing: .08em; text-transform: uppercase;
    padding: 6px 2px 2px;
  }
  .fh-chore-icon-grid .fh-icon-picker-cat-hdr:first-child { padding-top: 0; }
  .fh-chore-icon-grid .fh-icon-picker-cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    gap: 4px;
  }
  .fh-chore-icon-grid .fh-icon-cell {
    background: transparent; border: 1px solid transparent;
    border-radius: 6px; cursor: pointer;
    color: #ECEFF6;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 8px 4px;
    transition: background .1s, border-color .1s;
  }
  .fh-chore-icon-grid .fh-icon-cell:hover {
    background: rgba(91,141,239,.08); border-color: rgba(91,141,239,.2);
  }
  .fh-chore-icon-grid .fh-icon-cell.selected {
    background: rgba(91,141,239,.15); border-color: #5B8DEF;
  }
  .fh-chore-icon-grid .fh-icon-cell-label {
    font-size: var(--fh-text-xs); color: #A6B3CC;
    text-align: center; line-height: 1.2;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;
  }

  /* ---- Sort bar ---- */
  .fh-ad-sort-bar {
    display: flex; align-items: center; gap: 6px;
    flex-wrap: wrap; padding: 4px 0 6px;
  }
  .fh-ad-sort-lbl {
    font-size: var(--fh-text-xs); color: #6F7E9C;
    font-weight: 700; letter-spacing: .06em; flex-shrink: 0;
  }
  .fh-ad-sort-btn {
    background: transparent; border: 1px solid #2A3852; color: #6F7E9C;
    border-radius: 99px; cursor: pointer;
    font-size: var(--fh-text-xs); font-weight: 600; letter-spacing: .04em;
    padding: 3px 10px;
    display: inline-flex; align-items: center; gap: 3px;
    transition: color .1s, border-color .1s;
  }
  .fh-ad-sort-btn:hover { color: #A6B3CC; border-color: #4A5E7A; }
  .fh-ad-sort-btn.active { color: #5B8DEF; border-color: rgba(91,141,239,.45); }

  /* ---- Collapsible category group headers ---- */
  .fh-ad-cat-group { margin-bottom: 4px; }
  .fh-ad-cat-hdr {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 6px; cursor: pointer; user-select: none;
    color: #6F7E9C;
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase;
    border-bottom: 1px solid #2A3852;
    margin-bottom: 4px;
    transition: color .1s;
  }
  .fh-ad-cat-hdr:hover { color: #A6B3CC; }
  .fh-ad-cat-chevron {
    font-size: .65rem; display: inline-block;
    transition: transform .15s;
  }
  .fh-ad-cat-chevron.collapsed { transform: rotate(-90deg); }
  .fh-ad-cat-name { flex: 1; }
  .fh-ad-cat-count {
    background: #202D45; border: 1px solid #2A3852;
    padding: 1px 7px; border-radius: 99px;
    font-size: var(--fh-text-xs);
  }

  /* ---- Selected row highlight ---- */
  .fh-task-row--selected {
    border-left: 3px solid #5B8DEF !important;
    background: rgba(91,141,239,.07) !important;
  }

  /* ---- Hide mobile-only edit button at \u22651280px (row click opens panel instead) ---- */
  @media (min-width: 1280px) {
    .fh-ad-tasks-edit-btn { display: none !important; }
    .fh-ad-tasks-list-panel .fh-task-row { cursor: pointer; }
    .fh-ad-tasks-list-panel .fh-task-row:not(.fh-task-row--selected):hover {
      background: rgba(255,255,255,.025);
    }
  }

  /* ---- Topbar action buttons ---- */
  .fh-ad-btn {
    padding: 9px 16px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: var(--fh-text-sm);
    display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
    min-height: 38px;
    transition: opacity .12s;
  }
  .fh-ad-btn:hover { opacity: .82; }
  .fh-ad-btn--primary { background: #5B8DEF; color: #fff; }
  .fh-ad-btn--ghost   { background: #1A2538; border: 1px solid #2A3852; color: #A6B3CC; }

  /* ---- Context overrides: existing classes inside .fh-ad-body and inline panel body ---- */
  .fh-ad-empty { color: #6F7E9C; padding: 20px 0; text-align: center; }
  .fh-ad-body .fh-section-title { color: #6F7E9C; font-size: .75rem; letter-spacing: .1em; }
  .fh-ad-body .fh-divider,
  .fh-ad-tasks-panel-body .fh-divider { border-color: #2A3852; }
  .fh-ad-body .fh-label,
  .fh-ad-tasks-panel-body .fh-label { color: #6F7E9C; }
  .fh-ad-body .fh-input,
  .fh-ad-tasks-panel-body .fh-input { background: #202D45; border-color: #3A4B6B; color: #ECEFF6; }
  .fh-ad-body .fh-input::placeholder,
  .fh-ad-tasks-panel-body .fh-input::placeholder { color: #6F7E9C; }
  .fh-ad-body .fh-select,
  .fh-ad-tasks-panel-body .fh-select { background: #202D45; border-color: #3A4B6B; color: #ECEFF6; }
  .fh-ad-body .fh-toggle-row    { background: #202D45; border-radius: 8px; }
  .fh-ad-body .fh-point-row     { background: #202D45; border-radius: 8px; }
  .fh-ad-body .fh-store-inv-row { background: #202D45; border-radius: 8px; }
  .fh-ad-body .fh-task-row      { background: #202D45; }
  .fh-ad-body .fh-hist-row      { background: #202D45; border-radius: 8px; }
  .fh-ad-body .fh-hist-group    { background: #202D45; border-radius: 8px; }
  .fh-ad-body .fh-hist-scroll   { max-height: 55vh; }
  .fh-ad-body .fh-chips .fh-chip {
    background: #202D45; border-color: #3A4B6B; color: #A6B3CC;
  }
  .fh-ad-body .fh-chips .fh-chip.active {
    background: rgba(91,141,239,.18); border-color: rgba(91,141,239,.35); color: #ECEFF6;
  }
  .fh-ad-body .fh-penalty-pause-row { background: transparent; border-top: 1px solid #2A3852; }
  /* Inline panel form chrome \u2014 dark-theme overrides for shared form widgets */
  .fh-ad-tasks-panel-body .fh-checkbox-row { color: #A6B3CC; }
  .fh-ad-tasks-panel-body .fh-field-help { color: #6F7E9C; }
  .fh-ad-tasks-panel-body .fh-person-cb-chip { border-color: #3A4B6B; color: #A6B3CC; }
  .fh-ad-tasks-panel-body .fh-wd-chip { border-color: #3A4B6B; color: #6F7E9C; }
  .fh-ad-tasks-panel-body .fh-wd-chip.checked { color: #ECEFF6; }

  /* ===========================================================================
     Classic theme \xE2\u20AC\u201D body two-column rail (S8)
     =========================================================================== */
  .fh-classic-body { display:flex; flex-direction:column; gap:var(--fh-gap-sm); }
  .fh-classic-body.has-rail { gap:12px; }
  .fh-classic-body-main { min-width:0; }
  .fh-classic-rail { display:flex; flex-direction:column; gap:10px; }
  @media (min-width: 900px) {
    .fh-classic-body.has-rail {
      display:grid;
      grid-template-columns: minmax(0, 1fr) 480px;
      gap:14px;
      align-items:start;
    }
  }
  .fh-classic-rpanel {
    background:var(--fh-surface); border:1px solid var(--fh-border);
    border-radius:8px; padding:10px 12px;
  }
  .fh-classic-rpanel-hdr {
    font-family:var(--fh-font-mono); font-size:.78rem; font-weight:700;
    color:var(--fh-text-sec); letter-spacing:.18em; margin-bottom:6px;
    border-bottom:1px solid var(--fh-border); padding-bottom:4px;
  }
  .fh-classic-rpanel-body { color:var(--fh-text); }
  .fh-classic-rempty {
    font-size:.85rem; color:var(--fh-text-sec); text-align:center; padding:6px 0;
  }
  .fh-classic-rmax {
    font-size:.95rem; font-weight:700; color:var(--fh-accent); text-align:center; padding:4px 0;
  }
  .fh-classic-rkpi-row { display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; }
  .fh-classic-rkpi {
    display:flex; flex-direction:column; align-items:center;
    border-right:1px solid var(--fh-border); padding-right:6px;
  }
  .fh-classic-rkpi:last-child { border-right:none; padding-right:0; }
  .fh-classic-rkpi-lbl {
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:700;
    color:var(--fh-text-sec); letter-spacing:.08em; margin-bottom:2px;
  }
  .fh-classic-rkpi-val-row { display:flex; align-items:baseline; gap:2px; }
  .fh-classic-rkpi-val {
    font-family:var(--fh-font-heading); font-size:1.1rem; font-weight:800;
    color:var(--fh-text); line-height:1;
  }
  .fh-classic-rkpi-unit { font-size:.75rem; color:var(--fh-text-sec); }
  .fh-classic-rstreak { padding:5px 0; }
  .fh-classic-rstreak + .fh-classic-rstreak { border-top:1px solid var(--fh-border); }
  .fh-classic-rstreak-head { display:flex; align-items:center; gap:8px; }
  .fh-classic-rstreak-name {
    flex:1; min-width:0; font-size:.92rem; color:var(--fh-text);
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-classic-rbonus {
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:800; color:var(--fh-warning);
  }
  .fh-classic-rstreak-bar { display:flex; align-items:center; gap:6px; margin-top:3px; }
  .fh-classic-rsegs { display:flex; gap:2px; flex:1; }
  .fh-classic-rseg {
    flex:1; height:6px; border-radius:2px; background:var(--fh-border);
  }
  .fh-classic-rstreak-num {
    font-family:var(--fh-font-mono); font-size:.75rem; color:var(--fh-text-sec);
  }
  .fh-classic-rwin { padding:5px 0; }
  .fh-classic-rwin + .fh-classic-rwin { border-top:1px solid var(--fh-border); }
  .fh-classic-rwin-when {
    font-family:var(--fh-font-mono); font-size:.75rem; color:var(--fh-text-sec); letter-spacing:.04em;
  }
  .fh-classic-rwin-row { display:flex; gap:8px; align-items:baseline; }
  .fh-classic-rwin-name {
    flex:1; min-width:0; font-size:.92rem; color:var(--fh-text);
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-classic-rwin-pts {
    font-family:var(--fh-font-mono); font-size:.85rem; font-weight:700;
  }


  /* ===========================================================================
     Kid-large modifier (S9 \xE2\u20AC\u201D now driven by .kid-large .fh-row-* in the shared
     row block above; this page-level rule just bumps text scale.)
     =========================================================================== */
  .fh-eng-page.kid-large,
  .fh-bk-page.kid-large,
  .fh-hp-page.kid-large,
  .fh-dn-page.kid-large,
  .fh-dbz-page.kid-large,
  .fh-classic-page.kid-large {
    --fh-text-scale: 1.15;
  }


  /* ============================================================ */
  /* Shared chore-row component (v0.6.0 S9)                       */
  /* All themed personal-page rows use these base classes.        */
  /* Per-theme overrides live in .fh-row--<themeKey> blocks below */
  /* (added incrementally as each theme is converted).            */
  /* ============================================================ */

  .fh-row-list { display:flex; flex-direction:column; gap:10px; }

  .fh-row-section-hdr {
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-sm); font-weight:700;
    letter-spacing:.08em; text-transform:uppercase;
    padding:4px 0; opacity:.55;
  }

  .fh-row {
    display:flex; align-items:center; gap:10px;
    padding:12px 10px 10px;
    position:relative; border-radius:2px;
    border:1px solid currentColor;
    background:transparent;
  }
  .fh-row.reminder  { opacity:.85; }
  .fh-row.submitted { opacity:.85; }

  /* Lead element (P1 etc.) \xE2\u20AC\u201D omitted entirely when leadFormat is absent */
  .fh-row-lead {
    flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-md); font-weight:800;
  }

  /* Icon column */
  .fh-row-icon {
    width:36px; height:36px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    position:relative;
  }
  .fh-row-icon svg { width:20px; height:20px; }

  /* Body column \xE2\u20AC\u201D takes remaining horizontal space */
  .fh-row-body {
    flex:1; min-width:0;
    display:flex; flex-direction:column; gap:4px;
  }
  .fh-row-kicker {
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-xs); font-weight:700;
    letter-spacing:.08em; opacity:.55;
  }
  .fh-row-name {
    font-size:var(--fh-text-md); font-weight:700;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-row-desc {
    font-size:var(--fh-text-xs); line-height:1.3; opacity:.75;
  }
  .fh-row-penalty {
    font-size:var(--fh-text-xs); letter-spacing:.04em; opacity:.75;
  }

  /* Chip stack \xE2\u20AC\u201D vertical column of streak / status / firing / expiry */
  .fh-row-chips {
    display:flex; flex-direction:column; align-items:flex-end;
    gap:4px; flex-shrink:0;
  }
  .fh-row-chips:empty { display:none; }
  .fh-row-chip {
    display:inline-flex; align-items:center;
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-xs); font-weight:700;
    letter-spacing:.06em;
    padding:2px 6px; border-radius:2px;
    border:1px solid currentColor;
    white-space:nowrap;
  }

  /* Points medal/tag/stamp */
  .fh-row-pts {
    flex-shrink:0;
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-lg); font-weight:800;
    text-align:center; min-width:48px;
  }
  .fh-row-pts:empty { display:none; }

  /* Action button (themes override shape/color/transform) */
  .fh-row-btn {
    display:inline-flex; align-items:center; justify-content:center;
    flex-shrink:0; gap:6px; min-width:64px;
    padding:8px 10px;
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-xs); font-weight:800;
    letter-spacing:.06em; text-transform:uppercase;
    cursor:pointer; text-align:center;
    white-space:normal; line-height:1.1;
    border:1.5px solid currentColor;
    background:transparent; color:inherit;
    transition:transform .1s, opacity .15s, border-color .15s;
  }
  .fh-row-btn:active { transform:scale(.94); }
  .fh-row-btn--pending {
    cursor:default; opacity:.8;
    border-style:dashed;
  }
  .fh-row-btn-icon {
    font-size:1.1em; line-height:1; font-weight:900;
  }
  .fh-row-btn-label { line-height:1.1; }

  /* "+ Add reminder" CTA above row list */
  .fh-row-add-reminder-wrap {
    display:flex; justify-content:flex-end;
    margin-bottom:var(--fh-gap-sm, 8px);
  }
  .fh-row-add-reminder {
    background:transparent; color:inherit;
    border:1px dashed currentColor; opacity:.65;
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-xs); letter-spacing:.06em;
    padding:6px 10px; cursor:pointer; border-radius:2px;
  }
  .fh-row-add-reminder:hover { opacity:1; }

  /* ---------- Kid-large (card-grid layout) ---------- */
  /* Triggered by .kid-large on the page wrapper; same DOM, different layout. */

  .kid-large .fh-row-list {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(190px, 1fr));
    gap:14px;
  }
  .kid-large .fh-row-section-hdr {
    grid-column:1 / -1;
    font-size:var(--fh-text-base);
  }
  .kid-large .fh-row {
    flex-direction:column;
    align-items:center;
    text-align:center;
    min-height:240px;
    padding:16px 12px;
    gap:8px;
  }
  .kid-large .fh-row-lead {
    align-self:flex-start;
  }
  .kid-large .fh-row-body { flex:0 0 auto; align-items:center; }
  .kid-large .fh-row-icon {
    width:144px; height:144px;
  }
  .kid-large .fh-row-icon svg { width:100%; height:100%; }
  .kid-large .fh-row-icon .fh-chore-icon {
    width:120px !important; height:120px !important;
    display:flex; align-items:center; justify-content:center;
  }
  .kid-large .fh-row-body {
    align-items:center; width:100%;
  }
  .kid-large .fh-row-name {
    white-space:normal; word-break:break-word; hyphens:auto;
    font-size:var(--fh-text-lg); line-height:1.2;
  }
  .kid-large .fh-row-desc,
  .kid-large .fh-row-penalty,
  .kid-large .fh-row-kicker { display:none; }
  .kid-large .fh-row-chips {
    flex-direction:row; justify-content:center; align-items:center;
  }
  .kid-large .fh-row-pts {
    font-size:var(--fh-text-xl);
  }
  .kid-large .fh-row-btn {
    margin-top:auto;
    min-height:60px;
    padding:0 22px;
    font-size:var(--fh-text-md);
  }

  /* ---------- .fh-row--engineer overrides (S9 pilot) ---------- */

  .fh-row--engineer {
    background:#0B2D48;
    border-color:rgba(60,122,165,.4);
    color:#F2EBD6;
    font-family:var(--fh-font-mono);
    margin-top:8px;   /* breathing room for floated kicker */
  }
  .fh-row--engineer.overdue {
    border-color:rgba(224,122,76,.5);
    background:rgba(224,122,76,.06);
  }

  /* Floated WO-### kicker above the border, drawing-sheet style */
  .fh-row--engineer .fh-row-kicker {
    position:absolute;
    top:-8px; left:10px;
    background:#0E3A5C;
    padding:0 4px;
    color:rgba(242,235,214,.4);
    letter-spacing:.08em;
  }

  /* Icon box with 4 corner ticks (CSS-only \xE2\u20AC\u201D 8 gradient layers, 4 corners x 2 strokes) */
  .fh-row--engineer .fh-row-icon {
    border:1px solid rgba(60,122,165,.5);
    overflow:visible;
  }
  .fh-row--engineer .fh-row-icon::before,
  .fh-row--engineer .fh-row-icon::after {
    content:""; position:absolute; pointer-events:none;
    width:calc(100% + 4px); height:calc(100% + 4px);
    left:-2px; top:-2px;
    background:
      linear-gradient(rgba(60,122,165,.7), rgba(60,122,165,.7)) left  top    / 5px 1.5px no-repeat,
      linear-gradient(rgba(60,122,165,.7), rgba(60,122,165,.7)) left  top    / 1.5px 5px no-repeat,
      linear-gradient(rgba(60,122,165,.7), rgba(60,122,165,.7)) right top    / 5px 1.5px no-repeat,
      linear-gradient(rgba(60,122,165,.7), rgba(60,122,165,.7)) right top    / 1.5px 5px no-repeat;
  }
  .fh-row--engineer .fh-row-icon::after {
    background:
      linear-gradient(rgba(60,122,165,.7), rgba(60,122,165,.7)) left  bottom / 5px 1.5px no-repeat,
      linear-gradient(rgba(60,122,165,.7), rgba(60,122,165,.7)) left  bottom / 1.5px 5px no-repeat,
      linear-gradient(rgba(60,122,165,.7), rgba(60,122,165,.7)) right bottom / 5px 1.5px no-repeat,
      linear-gradient(rgba(60,122,165,.7), rgba(60,122,165,.7)) right bottom / 1.5px 5px no-repeat;
  }

  .fh-row--engineer .fh-row-name {
    font-size:1.15rem;
    text-transform:uppercase; letter-spacing:.04em;
    color:#F2EBD6;
  }
  .fh-row--engineer .fh-row-desc    { color:rgba(242,235,214,.55); }
  .fh-row--engineer .fh-row-penalty { color:#E07A4C; letter-spacing:.06em; }

  /* Chips */
  .fh-row--engineer .fh-row-chip {
    border-color:rgba(60,122,165,.5);
    color:rgba(242,235,214,.6);
    background:rgba(14,58,92,.4);
  }
  .fh-row--engineer .fh-row-chip--streak { color:#E0B84C; border-color:rgba(224,184,76,.45); }
  .fh-row--engineer .fh-row-chip--breach { color:#E07A4C; border-color:rgba(224,122,76,.55); background:rgba(224,122,76,.08); }
  .fh-row--engineer .fh-row-chip--reset  { color:#E0B84C; border-color:rgba(224,184,76,.4);  background:rgba(224,184,76,.08); }
  .fh-row--engineer .fh-row-chip--firing { color:#E07A4C; border-color:rgba(224,122,76,.55); background:rgba(224,122,76,.08); }
  .fh-row--engineer .fh-row-chip--expiry { color:#E0B84C; border-color:rgba(224,184,76,.4);  background:rgba(224,184,76,.08); }

  /* Points stamp \xE2\u20AC\u201D amber box, mono */
  .fh-row--engineer .fh-row-pts {
    padding:6px 8px;
    background:#0E3A5C;
    border:1px solid #E0B84C;
    color:#E0B84C;
    min-width:52px;
    font-size:1.55rem;
    line-height:1;
  }

  /* Stamp button \xE2\u20AC\u201D tilted -2deg, mono */
  .fh-row--engineer .fh-row-btn {
    background:#0B2D48;
    border:1.5px solid rgba(242,235,214,.3);
    color:#F2EBD6;
    min-width:64px;
    padding:6px 8px;
    transform:rotate(-2deg);
  }
  .fh-row--engineer .fh-row-btn:hover  { border-color:#F2EBD6; transform:rotate(0deg); }
  .fh-row--engineer .fh-row-btn:active { transform:rotate(0deg) scale(.94); }
  .fh-row--engineer .fh-row-btn-icon   { color:#E0B84C; }
  .fh-row--engineer .fh-row-btn--pending {
    background:transparent;
    border-color:#E0B84C;
    color:#E0B84C;
    transform:none;
  }

  /* Kid-large: engineer's pts stamp scales up; button stays untilted for big tap */
  .kid-large .fh-row--engineer .fh-row-pts { font-size:1.8rem; min-width:74px; padding:8px 10px; }
  .kid-large .fh-row--engineer .fh-row-btn { transform:none; }
  .kid-large .fh-row--engineer .fh-row-btn:hover  { transform:none; }
  .kid-large .fh-row--engineer .fh-row-btn:active { transform:scale(.96); }

  /* ---------- .fh-row--dinos (kraft specimen card) ---------- */

  .fh-row--dinos {
    background:#F0E5C8;
    border:1px solid rgba(43,31,14,.25);
    color:#2B1F0E;
    font-family:"JetBrains Mono", monospace;
  }
  .fh-row--dinos.overdue { border-color:rgba(140,40,30,.5); background:#F5DDD8; }
  .fh-row--dinos .fh-row-kicker { color:#6B5020; letter-spacing:.06em; }
  .fh-row--dinos .fh-row-name {
    font-size:1.0rem; font-weight:700; letter-spacing:.03em;
  }
  .fh-row--dinos .fh-row-desc    { color:#5C4218; }
  .fh-row--dinos .fh-row-penalty { color:#8C281E; }
  .fh-row--dinos .fh-row-chip {
    border-color:rgba(107,80,32,.45);
    color:#6B5020; background:rgba(232,218,183,.5);
  }
  .fh-row--dinos .fh-row-chip--streak { color:#8B6A20; border-color:rgba(139,106,32,.55); }
  .fh-row--dinos .fh-row-chip--breach { color:#8C281E; border-color:rgba(140,40,30,.55); background:rgba(140,40,30,.08); }
  .fh-row--dinos .fh-row-chip--reset  { color:#8B6A20; border-color:rgba(139,106,32,.45); background:rgba(139,106,32,.08); }
  .fh-row--dinos .fh-row-chip--firing { color:#8C281E; }
  .fh-row--dinos .fh-row-chip--expiry { color:#8B6A20; }
  .fh-row--dinos .fh-row-pts {
    font-size:1.0rem; color:#8B6A20;
    border:1px dashed rgba(139,106,32,.45);
    padding:4px 8px; border-radius:2px;
  }
  .fh-row--dinos .fh-row-btn {
    background:#F0E5C8; border:2px solid #2B1F0E; color:#2B1F0E;
    transform:rotate(-1deg); border-radius:2px;
  }
  .fh-row--dinos .fh-row-btn:hover  { background:#2B1F0E; color:#F0E5C8; transform:rotate(0deg); }
  .fh-row--dinos .fh-row-btn:active { transform:rotate(0deg) scale(.94); }
  .fh-row--dinos .fh-row-btn--pending {
    background:transparent; border-style:dashed; color:#8B6A20; transform:none;
  }
  .fh-row--dinos .fh-row-btn--pending:hover { background:transparent; color:#8B6A20; }

  /* ---------- .fh-row--hp (parchment scroll) ---------- */

  .fh-row--hp {
    background:#FAF0D7;
    border:1px solid rgba(36,25,20,.18);
    color:#241914;
    font-family:"Crimson Pro", serif;
  }
  .fh-row--hp.overdue { border-color:rgba(111,27,38,.4); background:#FFF0EA; }
  .fh-row--hp .fh-row-lead {
    font-family:"Cinzel", serif; font-weight:700;
    color:#6F1B26; min-width:36px;
  }
  /* Emerald wax-seal icon container */
  .fh-row--hp .fh-row-icon {
    width:32px; height:32px; border-radius:50%;
    background:#1F4F3C; border:1.5px solid #C9A22A;
    box-shadow:0 2px 6px rgba(31,79,60,.25);
  }
  .fh-row--hp .fh-row-icon svg { color:#EFE0BA; }
  .fh-row--hp .fh-row-name {
    font-family:"Cinzel", serif; font-size:1.0rem; font-weight:700;
  }
  .fh-row--hp .fh-row-desc    { color:#5A4020; font-style:italic; }
  .fh-row--hp .fh-row-penalty { color:#A02020; font-style:italic; }
  .fh-row--hp .fh-row-chip {
    font-family:"Cinzel", serif;
    border-color:rgba(90,64,32,.45); color:#5A4020;
    background:rgba(250,240,215,.7);
  }
  .fh-row--hp .fh-row-chip--streak { color:#C9A22A; border-color:rgba(201,162,42,.55); }
  .fh-row--hp .fh-row-chip--breach { color:#6F1B26; border-color:rgba(111,27,38,.55); background:rgba(111,27,38,.08); }
  .fh-row--hp .fh-row-chip--reset  { color:#C9A22A; border-color:rgba(201,162,42,.45); background:rgba(201,162,42,.08); }
  .fh-row--hp .fh-row-chip--firing { color:#A02020; }
  .fh-row--hp .fh-row-chip--expiry { color:#C9A22A; }
  .fh-row--hp .fh-row-pts {
    font-family:"Cinzel", serif; font-size:1.05rem;
    color:#1F4F3C;
    background:radial-gradient(circle, #1F4F3C 0%, #143427 70%);
    color:#EFE0BA;
    width:48px; height:48px;
    display:flex; align-items:center; justify-content:center;
    border-radius:50%;
    min-width:0; padding:0;
  }
  .fh-row--hp .fh-row-btn {
    background:#1F4F3C; color:#FAF0D7; border:1.5px solid #1F4F3C;
    font-family:"Cinzel", serif; letter-spacing:.04em; text-transform:none;
    border-radius:3px;
  }
  .fh-row--hp .fh-row-btn:hover  { background:#2D6E54; }
  .fh-row--hp .fh-row-btn--pending {
    background:transparent; color:#1F4F3C; border-style:dashed;
  }
  .fh-row--hp .fh-row-btn--pending:hover { background:transparent; }

  /* ---------- .fh-row--baker (recipe-card ticket) ---------- */

  .fh-row--baker {
    background:#FBF3E2;
    border:1px solid rgba(58,31,18,.2);
    color:#3A1F12;
    font-family:"Manrope", sans-serif;
  }
  .fh-row--baker.overdue { border-color:rgba(160,40,40,.4); background:#FFF0EE; }
  .fh-row--baker .fh-row-lead {
    width:28px; height:28px;
    background:#8B3A2A; color:#FBF3E2;
    border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:.9rem; font-weight:800;
  }
  .fh-row--baker.overdue .fh-row-lead { background:#A02828; }
  .fh-row--baker .fh-row-name {
    font-family:"DM Serif Display", serif; font-size:1.1rem; font-weight:400;
  }
  .fh-row--baker .fh-row-desc    { color:#8B5A3A; font-style:italic; }
  .fh-row--baker .fh-row-penalty { color:#A02828; }
  .fh-row--baker .fh-row-chip {
    border-color:rgba(139,90,58,.45); color:#8B5A3A;
    background:rgba(251,243,226,.6);
  }
  .fh-row--baker .fh-row-chip--streak { color:#8B3A2A; border-color:rgba(139,58,42,.55); }
  .fh-row--baker .fh-row-chip--breach { color:#A02828; border-color:rgba(160,40,40,.55); background:rgba(160,40,40,.08); }
  .fh-row--baker .fh-row-chip--reset  { color:#8B3A2A; border-color:rgba(139,58,42,.45); background:rgba(139,58,42,.08); }
  .fh-row--baker .fh-row-chip--firing { color:#A02828; }
  .fh-row--baker .fh-row-chip--expiry { color:#8B3A2A; }
  .fh-row--baker .fh-row-pts {
    font-family:"JetBrains Mono", monospace;
    font-size:.95rem; font-weight:700; color:#8B3A2A;
    min-width:0;
  }
  .fh-row--baker .fh-row-btn {
    background:#8B3A2A; color:#FBF3E2; border:1.5px solid #8B3A2A;
    border-radius:18px; text-transform:none;
    font-family:"Caveat", cursive; font-size:1rem; font-weight:700;
    letter-spacing:0; padding:6px 14px;
  }
  .fh-row--baker .fh-row-btn:hover  { background:#A8344B; border-color:#A8344B; }
  .fh-row--baker .fh-row-btn--pending {
    background:transparent; color:#8B3A2A; border-style:dashed;
  }
  .fh-row--baker .fh-row-btn--pending:hover { background:transparent; }

  /* ---------- .fh-row--dbz (comic mission card) ---------- */

  .fh-row--dbz {
    background:#FFFFFF;
    border:4px solid #0F1E2E;
    color:#0F1E2E;
    box-shadow:0 6px 0 #0F1E2E;
    font-family:"Bree Serif", serif;
    margin-bottom:6px;
  }
  .fh-row--dbz.overdue { border-color:#CC2200; box-shadow:0 4px 0 #CC2200; }
  .fh-row--dbz .fh-row-name {
    font-size:1.1rem; font-weight:700; letter-spacing:.02em;
  }
  .fh-row--dbz .fh-row-desc    { color:rgba(15,30,46,.7); }
  .fh-row--dbz .fh-row-penalty { color:#CC2200; font-weight:700; }
  .fh-row--dbz .fh-row-chip {
    border-color:#0F1E2E; color:#0F1E2E; background:#FFE03A;
    border-width:2px; font-weight:800;
  }
  .fh-row--dbz .fh-row-chip--streak { background:#FFE03A; color:#0F1E2E; }
  .fh-row--dbz .fh-row-chip--breach { background:#CC2200; color:#FFFFFF; border-color:#CC2200; }
  .fh-row--dbz .fh-row-chip--reset  { background:#FF6A1A; color:#FFFFFF; border-color:#FF6A1A; }
  .fh-row--dbz .fh-row-chip--firing { background:#CC2200; color:#FFFFFF; border-color:#CC2200; }
  .fh-row--dbz .fh-row-chip--expiry { background:#FF6A1A; color:#FFFFFF; border-color:#FF6A1A; }
  .fh-row--dbz .fh-row-pts {
    font-family:"Bree Serif", serif; font-size:1.3rem; color:#FF6A1A;
    min-width:0;
  }
  .fh-row--dbz .fh-row-btn {
    background:#FF6A1A; color:#FFFFFF; border:3px solid #0F1E2E;
    box-shadow:0 4px 0 #0F1E2E;
    font-family:"Bree Serif", serif; font-size:1.1rem; font-weight:700;
    letter-spacing:.04em; min-height:48px; padding:8px 18px;
    border-radius:4px;
  }
  .fh-row--dbz .fh-row-btn:hover  { background:#FFB229; }
  .fh-row--dbz .fh-row-btn:active { transform:translateY(2px); box-shadow:0 2px 0 #0F1E2E; }
  .fh-row--dbz .fh-row-btn--pending {
    background:#FFFFFF; color:#0F1E2E; box-shadow:0 4px 0 #0F1E2E;
    border-style:dashed;
  }

  /* ---------- .fh-row--classic (dark panel + avatar color accent) ---------- */
  /* The containing .fh-row-list sets --row-color from the person's avatar color. */

  .fh-row--classic {
    background:rgba(255,255,255,.04);
    border:1px solid var(--row-color, #4A90E2);
    color:var(--fh-text-pri, #FFFFFF);
    font-family:var(--fh-font-body, "Manrope", sans-serif);
  }
  .fh-row--classic.overdue {
    border-color:#E07A4C; background:rgba(224,122,76,.06);
  }
  .fh-row--classic.reminder {
    border-color:var(--fh-text-sec, rgba(255,255,255,.4));
  }
  .fh-row--classic .fh-row-name {
    font-size:1.05rem; font-weight:600;
  }
  .fh-row--classic .fh-row-desc    { color:var(--fh-text-sec, rgba(255,255,255,.7)); }
  .fh-row--classic .fh-row-penalty { color:#E07A4C; }
  .fh-row--classic .fh-row-chip {
    border-color:var(--fh-text-sec, rgba(255,255,255,.4));
    color:var(--fh-text-sec, rgba(255,255,255,.7));
    background:rgba(255,255,255,.04);
  }
  .fh-row--classic .fh-row-chip--streak { color:#E0B84C; border-color:rgba(224,184,76,.55); }
  .fh-row--classic .fh-row-chip--breach { color:#E07A4C; border-color:rgba(224,122,76,.55); background:rgba(224,122,76,.08); }
  .fh-row--classic .fh-row-chip--reset  { color:#E0B84C; border-color:rgba(224,184,76,.4); background:rgba(224,184,76,.08); }
  .fh-row--classic .fh-row-chip--firing { color:#E07A4C; border-color:rgba(224,122,76,.55); background:rgba(224,122,76,.08); }
  .fh-row--classic .fh-row-chip--expiry { color:#E0B84C; border-color:rgba(224,184,76,.4); background:rgba(224,184,76,.08); }
  .fh-row--classic .fh-row-pts {
    color:var(--row-color, #4A90E2);
    font-size:1.0rem; font-weight:700;
    border:1px solid var(--row-color, #4A90E2);
    border-radius:var(--fh-radius-chip, 20px);
    padding:2px 10px; min-width:0;
  }
  .fh-row--classic .fh-row-btn {
    width:40px; height:40px; min-width:40px;
    border-radius:50%;
    background:var(--row-color, #4A90E2);
    border:none; color:#FFFFFF;
    padding:0; font-size:1.2rem;
  }
  .fh-row--classic.reminder .fh-row-btn {
    background:var(--fh-text-sec, rgba(255,255,255,.4));
  }
  .fh-row--classic .fh-row-btn:hover { filter:brightness(1.15); }
  .fh-row--classic .fh-row-btn--pending {
    width:auto; height:auto; min-width:auto;
    border-radius:var(--fh-radius-chip, 20px); padding:4px 10px;
    background:transparent;
    color:var(--fh-text-sec, rgba(255,255,255,.7));
    border:1px dashed var(--fh-text-sec, rgba(255,255,255,.4));
    font-size:var(--fh-text-xs);
  }
  .fh-row--classic .fh-row-btn--pending:hover { filter:none; }
`;
  }
});

// src/card/constants.js
var DOMAIN, VERSION, DEFAULT_COLOR, FLASH_MS, FH_SENSORS, WEEKDAY_LABELS, HISTORY_META, I;
var init_constants = __esm({
  "src/card/constants.js"() {
    DOMAIN = "family_hub";
    VERSION = "0.6.0";
    DEFAULT_COLOR = "#7F77DD";
    FLASH_MS = 1400;
    FH_SENSORS = [
      "sensor.family_hub_needs_attention",
      "sensor.family_hub_maintenance_due",
      "sensor.family_hub_maintenance_overdue",
      "sensor.family_hub_claimable_tasks"
    ];
    WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    HISTORY_META = {
      task_completed: { label: "Completed", color: "var(--fh-success)" },
      task_approved: { label: "Approved", color: "var(--fh-success)" },
      pending_approval: { label: "Pending approval", color: "var(--fh-warning)" },
      task_denied: { label: "Denied", color: "var(--fh-overdue)" },
      task_skipped: { label: "Skipped", color: "var(--fh-warning)" },
      task_excused: { label: "Excused", color: "var(--fh-accent)" },
      task_rejected: { label: "Rejected", color: "var(--fh-overdue)" },
      task_marked_complete: { label: "Marked done", color: "var(--fh-success)" },
      points_awarded: { label: "Points", color: "var(--fh-accent)" },
      redemption_requested: { label: "Redeem request", color: "var(--fh-warning)" },
      redemption_approved: { label: "Redeem approved", color: "var(--fh-success)" },
      redemption_declined: { label: "Redeem declined", color: "var(--fh-overdue)" },
      task_added: { label: "Task added", color: "var(--fh-text-sec)" },
      person_added: { label: "Person added", color: "var(--fh-text-sec)" },
      allowance: { label: "Allowance", color: "var(--fh-success)" }
    };
    I = {
      check: `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
      plus: `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>`,
      edit: `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
      trash: `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
      bell: `<svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.92V4a1 1 0 1 0-2 0v1.08A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`,
      award: `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      minus: `<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14z"/></svg>`,
      close: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
      settings: `<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/></svg>`,
      person: `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
      store: `<svg viewBox="0 0 24 24"><path d="M20 4H4v2l16-2zm1 5H3l1 11h16l1-11zm-9 8H10v-4h2v4zm0-6H10v-2h2v2z"/></svg>`,
      remove: `<svg viewBox="0 0 24 24"><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM2 6v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6H2zm8 13H4v-1h6v1zm0-3H4v-1h6v1zm0-3H4v-1h6v1zm1-7H3V8h8V6zm-2-3H5V2h4v1z"/></svg>`,
      history: `<svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`,
      excuse: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
    };
  }
});

// src/card/utils.js
function daysLabel(d) {
  if (d < -1) return `${Math.abs(d)}d overdue`;
  if (d === -1) return "1d overdue";
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  return `In ${d}d`;
}
function opts(arr, current) {
  return arr.map(
    (o) => `<option value="${o.value}" ${o.value === current ? "selected" : ""}>${o.label}</option>`
  ).join("");
}
function weekdayChips(checkedDays, cbClass, singleSelect = false) {
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
function relTime(ts) {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
function fmtShortDate(iso) {
  if (!iso) return "";
  const d = /* @__PURE__ */ new Date(iso + "T12:00:00");
  return d.toLocaleDateString(void 0, { month: "short", day: "numeric" });
}
function groupHistorySkipped(entries) {
  const regular = [];
  const byDate = /* @__PURE__ */ new Map();
  for (const e of entries) {
    if (e.type === "task_skipped" && e.skipped_date) {
      if (!byDate.has(e.skipped_date)) byDate.set(e.skipped_date, []);
      byDate.get(e.skipped_date).push(e);
    } else {
      regular.push({ isGroup: false, entry: e, timestamp: e.timestamp });
    }
  }
  const groups = [];
  for (const [date, items] of byDate) {
    const totalPenalty = items.reduce((s, e) => s + Math.abs(e.points_delta || 0), 0);
    groups.push({
      isGroup: true,
      key: `skipped-${date}`,
      date,
      dateDisplay: fmtShortDate(date),
      totalPenalty,
      items,
      timestamp: items[0].timestamp
    });
  }
  return [...regular, ...groups].sort(
    (a, b) => (b.timestamp || "").localeCompare(a.timestamp || "")
  );
}
var ini, fPts, fUSD, cap, slug, escHTML, escAttr;
var init_utils = __esm({
  "src/card/utils.js"() {
    init_constants();
    ini = (name) => (name || "?")[0].toUpperCase();
    fPts = (n) => (n || 0).toLocaleString();
    fUSD = (n) => `$${(n || 0).toFixed(2)}`;
    cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : "";
    slug = (s) => (s || "").toLowerCase().replace(/\s+/g, "_");
    escHTML = (s) => String(s || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
    escAttr = escHTML;
  }
});

// src/card/icons.js
function choreIcon(key, fallbackColor, size = "28px") {
  if (key && FH_ICONS[key]) {
    return `<span class="fh-chore-icon" style="width:${size};height:${size};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:currentColor">
          ${FH_ICONS[key]}
        </span>`;
  }
  const color = fallbackColor || DOT_COLORS[0];
  return `<span class="fh-chore-dot" style="width:12px;height:12px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>`;
}
var FH_ICONS, FH_ICON_META, DOT_COLORS, FH_ICON_KEYS;
var init_icons = __esm({
  "src/card/icons.js"() {
    FH_ICONS = {
      // --- Bedroom & Self-Care ---
      bed: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 22V10M3 22H29M3 22v3M29 22V14a3 3 0 0 0-3-3H14v6h-3v-2H3"/>
      <circle cx="9" cy="14.5" r="1.5"/>
    </svg>`,
      tooth: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 4c-3 0-5 2-5 6 0 3 2 6 2 11 0 4 1 7 3 7s3-3 3-7c0-2 1-3 3-3s3 1 3 3c0 4 1 7 3 7s3-3 3-7c0-5 2-8 2-11 0-4-2-6-5-6-2 0-3 1-6 1S12 4 10 4Z"/>
    </svg>`,
      shower: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 2v6M22 8H10M8 12h16l-1 4H9z"/>
      <path d="M11 20v1M14 22v1M17 20v1M20 22v1M13 25v1M18 26v1"/>
    </svg>`,
      laundry: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="3" width="22" height="26" rx="2"/>
      <circle cx="16" cy="19" r="6"/>
      <circle cx="16" cy="19" r="3"/>
      <path d="M8 8h3M13 8h1"/>
    </svg>`,
      room: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 28V8l12-5 12 5v20H4z"/>
      <path d="M13 28v-8h6v8"/>
    </svg>`,
      // --- Pets ---
      dog: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 12c0-3 2-5 4-5l2 3 5-1 5 1 2-3c2 0 4 2 4 5v6c0 2-2 4-4 4h-3v3h-3v-3h-6v3H9v-3H6c-1 0-2-1-2-2v-4c0-2 1-4 2-4Z"/>
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/>
      <circle cx="20" cy="15" r="1" fill="currentColor" stroke="none"/>
    </svg>`,
      cat: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 6l4 6h12l4-6v14a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z"/>
      <path d="M12 16l1 2M20 16l-1 2M14 22h4"/>
    </svg>`,
      pet: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="10" cy="10" rx="3" ry="4"/>
      <ellipse cx="22" cy="10" rx="3" ry="4"/>
      <ellipse cx="6"  cy="20" rx="2.5" ry="3.5"/>
      <ellipse cx="26" cy="20" rx="2.5" ry="3.5"/>
      <ellipse cx="16" cy="22" rx="7" ry="6"/>
    </svg>`,
      fish: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M26 16c0 5-4.5 9-10 9S6 21 6 16s4.5-9 10-9c3 0 5.5 1.5 7 4l4-4-1 9 1 9-4-4c-1.5 2.5-4 4-7 4"/>
      <circle cx="10" cy="14" r="1.5" fill="currentColor" stroke="none"/>
    </svg>`,
      // --- Kitchen ---
      dishes: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="16" cy="16" r="11"/>
      <circle cx="16" cy="16" r="6"/>
      <path d="M6 16h2M24 16h2M16 6v2M16 24v2"/>
    </svg>`,
      plate: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 6v8a8 8 0 0 0 16 0V6M12 6v22M20 6v22M8 6h16"/>
    </svg>`,
      snack: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 16a10 10 0 0 1 20 0v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/>
      <path d="M11 12v2M16 11v2M21 12v2"/>
    </svg>`,
      bread: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 14a8 5 0 0 1 24 0v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>
      <path d="M10 14v8M16 14v8M22 14v8"/>
    </svg>`,
      menu: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="4" width="20" height="24" rx="2"/>
      <path d="M10 10h12M10 14h12M10 18h12M10 22h8"/>
    </svg>`,
      cooking: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 20h20l-2 6H8zM10 10c0-3 2-5 6-5s6 2 6 5"/>
      <path d="M8 14h16v6H8z"/>
      <path d="M13 7v3M19 7v3"/>
    </svg>`,
      meals: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 14a10 10 0 0 1 20 0M3 18h26v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>
      <path d="M14 8V4M16 4h-4M12 12c1-1 3-1 4 0"/>
    </svg>`,
      // --- Cleaning ---
      trash: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 8h22M12 8V5h8v3M8 8v18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M13 13v11M19 13v11"/>
    </svg>`,
      broom: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 4 12 14M9 17l6 6M5 25l4 4M8 28l3-3M14 22l3-3"/>
      <path d="m12 14 6 6-3 3-9 1 1-9z"/>
    </svg>`,
      vacuum: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="16" cy="20" r="8"/>
      <circle cx="16" cy="20" r="3"/>
      <path d="M16 12V6h-4M22 12V8h-2"/>
    </svg>`,
      wipe: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="14" width="24" height="10" rx="2"/>
      <path d="M9 18l4 4M14 18l4 4M19 18l4 4M8 14V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6"/>
    </svg>`,
      mop: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 4l12 12M18 10l4 4"/>
      <path d="M6 22l6-6 8 8-6 4-8-6z"/>
    </svg>`,
      sweep: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 4l4 16H8l-2 6h20l-2-6h-4L16 4z"/>
      <path d="M10 20h12"/>
    </svg>`,
      bathroom: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 18h22v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/>
      <path d="M5 18V8a3 3 0 0 1 6 0v10"/>
      <path d="M9 12h2"/>
    </svg>`,
      windows: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="4" width="24" height="24" rx="2"/>
      <path d="M4 16h24M16 4v24"/>
    </svg>`,
      recycling: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 4l4 7h-3l3 6H8l3-6H8zM8 24l2-3h12l2 3M4 28h24"/>
    </svg>`,
      // --- Outdoors ---
      lawn: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 24h24M8 24v-4a8 8 0 0 1 16 0v4"/>
      <path d="M12 16c0-2 2-5 4-7 2 2 4 5 4 7"/>
    </svg>`,
      garden: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 28V14M16 14c-4-2-7-1-7-7 4 0 7 2 7 7Zm0 0c4-2 7-1 7-7-4 0-7 2-7 7Z"/>
      <path d="M10 28h12"/>
    </svg>`,
      plant: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 28V14M16 14c-4-2-7-1-7-7 4 0 7 2 7 7Zm0 0c4-2 7-1 7-7-4 0-7 2-7 7Z"/>
      <path d="M10 28h12"/>
    </svg>`,
      leaves: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 26c2-8 8-14 16-14-2 8-8 14-16 14z"/>
      <path d="M6 26l8-8"/>
    </svg>`,
      snow: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 4v24M4 10l12 6 12-6M4 22l12-6 12 6"/>
      <path d="M10 7l2 3-2 3M22 7l-2 3 2 3M10 25l2-3-2-3M22 25l-2-3 2-3"/>
    </svg>`,
      // --- School & Learning ---
      homework: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="3" width="22" height="26" rx="2"/>
      <path d="M10 10h12M10 15h12M10 20h8"/>
      <path d="M21 22l2 2 4-4"/>
    </svg>`,
      reading: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6c4-2 8-2 12 0 4-2 8-2 12 0v18c-4-2-8-2-12 0-4-2-8-2-12 0zM16 6v18"/>
    </svg>`,
      book: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6c4-2 8-2 12 0 4-2 8-2 12 0v18c-4-2-8-2-12 0-4-2-8-2-12 0zM16 6v18"/>
    </svg>`,
      pencil: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m22 4 6 6L12 26l-7 1 1-7zM18 8l6 6M5 27l3-3"/>
    </svg>`,
      piano: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="8" width="26" height="16" rx="1"/>
      <path d="M3 18h26M10 8v10h-2v6M16 8v10h-2v6M22 8v10h-2v6"/>
    </svg>`,
      backpack: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 12V8a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4"/>
      <rect x="5" y="10" width="22" height="18" rx="3"/>
      <path d="M10 16h12v6H10z"/>
    </svg>`,
      practice: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="16" cy="16" r="12"/>
      <path d="M16 10v6l4 4"/>
    </svg>`,
      // --- Tools & Home ---
      tools: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m6 26 9-9-4-4-3 1-3-3 4-4 3 3-1 3 4 4M20 4l5 5-3 3 4 4-4 4-4-4-3 3-5-5z"/>
    </svg>`,
      smarthome: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 16 16 4l12 12M7 14v12h18V14"/>
      <circle cx="16" cy="20" r="3"/>
      <path d="M16 16v1M16 23v1M12 20h1M19 20h1"/>
    </svg>`,
      // --- Generic ---
      chore: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 8h14l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"/>
      <path d="m9 18 3 3 7-7M20 8v4h4"/>
    </svg>`,
      errand: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="8" width="24" height="18" rx="2"/>
      <path d="M10 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
      <path d="M4 16h24"/>
    </svg>`,
      pack: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 1C8.14 1 5 4.14 5 8v1H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-1V8c0-3.86-3.14-7-7-7h-8z"/>
      <path d="M12 20a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"/>
    </svg>`,
      screen: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="4" width="28" height="18" rx="2"/>
      <path d="M10 28h12M16 22v6"/>
    </svg>`,
      exercise: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="22" cy="6" r="3"/>
      <path d="M4 18l6-8 4 4 4-6 6 8"/>
      <path d="M2 26h28"/>
    </svg>`,
      // --- Parents ---
      car: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 16l3-7h16l3 7"/>
      <rect x="3" y="16" width="26" height="10" rx="2"/>
      <circle cx="9" cy="26" r="3"/>
      <circle cx="23" cy="26" r="3"/>
      <path d="M3 20h26"/>
    </svg>`,
      shop: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4h20l2 8H4z"/>
      <path d="M4 12a4 4 0 0 0 4 4M12 12a4 4 0 0 0 8 0M20 12a4 4 0 0 0 4 4M8 16v10h16V16"/>
      <path d="M13 26v-6h6v6"/>
    </svg>`,
      folding: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 8h10v16H4zM18 8h10v16H18z"/>
      <path d="M14 16h4M14 12l4 4-4 4"/>
    </svg>`,
      lunch: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 12h20v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/>
      <path d="M10 8V6M16 7V5M22 8V6"/>
      <path d="M6 17h20"/>
    </svg>`
    };
    FH_ICON_META = [
      // Bedroom & self-care
      { key: "bed", label: "Make Bed", category: "Self-care" },
      { key: "tooth", label: "Brush Teeth", category: "Self-care" },
      { key: "shower", label: "Shower", category: "Self-care" },
      { key: "laundry", label: "Laundry", category: "Self-care" },
      { key: "folding", label: "Fold Clothes", category: "Self-care" },
      { key: "room", label: "Clean Room", category: "Self-care" },
      { key: "pack", label: "Pack Bag", category: "Self-care" },
      { key: "backpack", label: "Backpack", category: "Self-care" },
      // Pets
      { key: "dog", label: "Walk Dog", category: "Pets" },
      { key: "cat", label: "Feed Cat", category: "Pets" },
      { key: "pet", label: "Pet Care", category: "Pets" },
      { key: "fish", label: "Feed Fish", category: "Pets" },
      // Kitchen
      { key: "dishes", label: "Dishes", category: "Kitchen" },
      { key: "plate", label: "Set Table", category: "Kitchen" },
      { key: "cooking", label: "Cooking", category: "Kitchen" },
      { key: "meals", label: "Meals", category: "Kitchen" },
      { key: "lunch", label: "Pack Lunch", category: "Kitchen" },
      { key: "snack", label: "Snack", category: "Kitchen" },
      { key: "bread", label: "Baking", category: "Kitchen" },
      { key: "menu", label: "Menu Plan", category: "Kitchen" },
      // Cleaning
      { key: "trash", label: "Trash", category: "Cleaning" },
      { key: "broom", label: "Sweep", category: "Cleaning" },
      { key: "vacuum", label: "Vacuum", category: "Cleaning" },
      { key: "wipe", label: "Wipe Down", category: "Cleaning" },
      { key: "mop", label: "Mop", category: "Cleaning" },
      { key: "sweep", label: "Sweep Up", category: "Cleaning" },
      { key: "bathroom", label: "Bathroom", category: "Cleaning" },
      { key: "windows", label: "Windows", category: "Cleaning" },
      { key: "recycling", label: "Recycling", category: "Cleaning" },
      // Outdoors
      { key: "lawn", label: "Lawn", category: "Outdoors" },
      { key: "garden", label: "Garden", category: "Outdoors" },
      { key: "plant", label: "Plants", category: "Outdoors" },
      { key: "leaves", label: "Leaves", category: "Outdoors" },
      { key: "snow", label: "Snow", category: "Outdoors" },
      // School
      { key: "homework", label: "Homework", category: "School" },
      { key: "reading", label: "Reading", category: "School" },
      { key: "book", label: "Book", category: "School" },
      { key: "pencil", label: "Study", category: "School" },
      { key: "piano", label: "Piano", category: "School" },
      { key: "practice", label: "Practice", category: "School" },
      // Home & tools
      { key: "tools", label: "Tools", category: "Home" },
      { key: "smarthome", label: "Smart Home", category: "Home" },
      { key: "screen", label: "Devices", category: "Home" },
      { key: "exercise", label: "Exercise", category: "Home" },
      // Generic
      { key: "chore", label: "Chore", category: "Generic" },
      { key: "errand", label: "Errand", category: "Generic" },
      { key: "car", label: "Car", category: "Generic" },
      { key: "shop", label: "Shopping", category: "Generic" }
    ];
    DOT_COLORS = [
      "#7F77DD",
      "#30d158",
      "#ff9f0a",
      "#ff453a",
      "#5ac8fa",
      "#ff2d55",
      "#af52de"
    ];
    FH_ICON_KEYS = Object.keys(FH_ICONS);
  }
});

// src/card/themes/_shared.js
function getEffectiveRank(rankIndex, ranks) {
  const idx = Math.min(Math.max(0, rankIndex), ranks.length - 1);
  return ranks[idx];
}
function getWeeklyPts(personId, historyLog) {
  const now = /* @__PURE__ */ new Date();
  const dow = now.getDay();
  const daysSinceMon = dow === 0 ? 6 : dow - 1;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - daysSinceMon);
  return (historyLog || []).filter(
    (e) => e.person_id === personId && (e.points_delta || 0) > 0 && new Date(e.timestamp) >= monday
  ).reduce((sum, e) => sum + (e.points_delta || 0), 0);
}
function htmlRankBar(rankIndex, weeklyPts, dropThr, gainThr, ranks, color) {
  if (rankIndex >= 999) return "";
  const current = getEffectiveRank(rankIndex, ranks);
  const barMax = Math.max(gainThr, 1);
  const fillPct = Math.min(100, Math.round(weeklyPts / barMax * 100));
  const dropPct = Math.min(99, Math.round(dropThr / barMax * 100));
  let fillColor, statusText;
  if (weeklyPts >= gainThr) {
    fillColor = color;
    statusText = `${weeklyPts}pts \xB7 +1 rank`;
  } else if (weeklyPts < dropThr) {
    fillColor = "#E07A4C";
    statusText = `${weeklyPts}pts \xB7 \u22121 rank`;
  } else {
    fillColor = "#E0B84C";
    statusText = `${weeklyPts}pts \xB7 holds`;
  }
  return `
        <div class="fh-rank-bar-row">
            <span class="fh-rank-bar-label" style="color:${color}">${escHTML(current.name)}</span>
            <span class="fh-rank-bar-track">
                <span class="fh-rank-bar-fill" style="width:${fillPct}%;background:${fillColor}"></span>
                <span class="fh-rank-bar-drop" style="left:${dropPct}%"></span>
            </span>
            <span class="fh-rank-bar-status">${escHTML(statusText)}</span>
        </div>`;
}
function getActiveStreaks(attr, naAttr, person, max = 8) {
  const choreById = new Map(
    (naAttr.active_chores || []).map((c) => [c.chore_id, c])
  );
  const nameFallback = /* @__PURE__ */ new Map();
  for (const t of [
    ...attr.tasks_due_today_list || [],
    ...attr.tasks_overdue_list || [],
    ...attr.tasks_pending_approval_list || []
  ]) {
    if (t.chore_id && t.name && !nameFallback.has(t.chore_id)) {
      nameFallback.set(t.chore_id, { name: t.name, streak: t.streak || 0 });
    }
  }
  const personData = (naAttr.people || []).find((p) => p.person_id === person.person_id) || {};
  const streaksDict = personData.streaks || {};
  const merged = /* @__PURE__ */ new Map();
  for (const [chore_id, s] of Object.entries(streaksDict)) {
    merged.set(chore_id, s.count || 0);
  }
  for (const [chore_id, f] of nameFallback.entries()) {
    const cur = merged.get(chore_id) || 0;
    if (f.streak > cur) merged.set(chore_id, f.streak);
  }
  return [...merged.entries()].map(([chore_id, streak]) => {
    const c = choreById.get(chore_id);
    const fb = nameFallback.get(chore_id);
    const name = (c == null ? void 0 : c.name) || (fb == null ? void 0 : fb.name) || "(retired)";
    return {
      chore_id,
      name,
      streak,
      milestone: (c == null ? void 0 : c.streak_milestone) || 0,
      bonus: (c == null ? void 0 : c.streak_bonus_points) || 0,
      chore: c || {}
    };
  }).filter((t) => t.streak >= 1).sort((a, b) => b.streak - a.streak).slice(0, max);
}
function computeStreakProgress(streak, milestone, maxSegs = 10) {
  const goalSegs = milestone > 0 ? Math.min(milestone, maxSegs) : 7;
  if (milestone <= 0) {
    return {
      goalSegs,
      filledN: Math.min(streak, goalSegs),
      countLbl: `${streak}`
    };
  }
  const progress = streak % milestone;
  const filledN = streak > 0 && progress === 0 ? goalSegs : progress;
  const nextIn = milestone - (progress || milestone);
  return {
    goalSegs,
    filledN,
    countLbl: `${streak} \xB7 next ${nextIn}`
  };
}
function groupByCategory(tasks, catOrder) {
  const overdue = tasks.filter((t) => t._over);
  const due = tasks.filter((t) => !t._over);
  const groups = [];
  if (overdue.length) groups.push({ label: "Overdue", tasks: overdue, isOverdue: true });
  const ordered = catOrder && catOrder.length ? catOrder : [...new Set(due.map((t) => t.category_label || ""))];
  const covered = new Set(ordered);
  for (const cat of ordered) {
    const catTasks = due.filter((t) => (t.category_label || "") === cat);
    if (catTasks.length) groups.push({ label: cat || "Other", tasks: catTasks, isOverdue: false });
  }
  const remainder = due.filter((t) => !covered.has(t.category_label || ""));
  if (remainder.length) groups.push({ label: "Other", tasks: remainder, isOverdue: false });
  return groups;
}
function htmlChoreRow(t, cfg, person, card, opts2 = {}) {
  const idx = opts2.index;
  const isSubmitted = !!(card && card._pendingSubmit && card._pendingSubmit.has(t.task_id)) || t.status === "pending_approval";
  const isOverdue = !!t._over || !!t._overdue;
  const isReminder = t.chore_type === "reminder";
  const streak = t.streak || 0;
  const pts = t.points || 0;
  const leadVal = cfg.leadFormat && !isReminder ? cfg.leadFormat(t, idx) : null;
  const leadHtml = leadVal != null && leadVal !== "" ? `<div class="fh-row-lead">${escHTML(String(leadVal))}</div>` : "";
  const kickerVal = cfg.kickerFormat && !isReminder ? cfg.kickerFormat(t, idx) : null;
  const kickerHtml = kickerVal != null && kickerVal !== "" ? `<div class="fh-row-kicker">${escHTML(String(kickerVal))}</div>` : "";
  const iconColor = cfg.iconColor ? cfg.iconColor(t, isOverdue) : void 0;
  const iconHtml = `<div class="fh-row-icon">${choreIcon(t.icon, iconColor)}</div>`;
  const descLine = t.description ? `<div class="fh-row-desc">${escHTML(t.description)}</div>` : "";
  const penaltyLine = !isReminder && t.penalty_enabled && t.penalty_points > 0 ? `<div class="fh-row-penalty">\u2212${t.penalty_points}pts if skipped</div>` : "";
  const chips = [];
  if (streak >= 2 && !isReminder) {
    const ico = cfg.streakIcon || "\u{1F525}";
    chips.push(`<span class="fh-row-chip fh-row-chip--streak">${ico} ${streak}</span>`);
  }
  if (isOverdue) {
    const label = cfg.statusFormat && cfg.statusFormat.breach ? cfg.statusFormat.breach(t) : `BREACH \xB7 ${t.days_overdue || 0}D`;
    chips.push(`<span class="fh-row-chip fh-row-chip--breach">${escHTML(label)}</span>`);
  } else if (!isReminder && t.days_until_reset === 1) {
    const label = cfg.statusFormat && cfg.statusFormat.resetSoon ? cfg.statusFormat.resetSoon(t) : "RESETS 1D";
    chips.push(`<span class="fh-row-chip fh-row-chip--reset">${escHTML(label)}</span>`);
  }
  if (!isReminder && t.daily_penalty_firing) {
    const label = cfg.statusFormat && cfg.statusFormat.firing ? cfg.statusFormat.firing(t) : `\u2212${t.penalty_points || 0}pts/day`;
    chips.push(`<span class="fh-row-chip fh-row-chip--firing">${escHTML(label)}</span>`);
  }
  if (!isReminder && t.expires_after_days && t.due_date) {
    const expiresOn = new Date(t.due_date);
    expiresOn.setDate(expiresOn.getDate() + t.expires_after_days);
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    expiresOn.setHours(0, 0, 0, 0);
    const daysLeft = Math.round((expiresOn - today) / 864e5);
    if (daysLeft <= 2) {
      const label = cfg.statusFormat && cfg.statusFormat.expiry ? cfg.statusFormat.expiry(daysLeft) : daysLeft <= 0 ? "Expires today" : `Expires in ${daysLeft}d`;
      chips.push(`<span class="fh-row-chip fh-row-chip--expiry">${escHTML(label)}</span>`);
    }
  }
  const chipsHtml = `<div class="fh-row-chips">${chips.join("")}</div>`;
  const ptsHtml = !isReminder && pts ? `<div class="fh-row-pts">+${pts}</div>` : `<div class="fh-row-pts"></div>`;
  const extraBtnData = opts2.btnData ? Object.entries(opts2.btnData).map(([k, v]) => ` data-${k}="${escAttr(String(v ?? ""))}"`).join("") : "";
  let btnHtml;
  if (isSubmitted) {
    const lbl = cfg.btnPendingLabel || "Pending<br>Approval";
    const ico = cfg.btnPendingIcon ? `<span class="fh-row-btn-icon">${cfg.btnPendingIcon}</span>` : "";
    btnHtml = `<div class="fh-row-btn fh-row-btn--pending" aria-disabled="true">${ico}<span class="fh-row-btn-label">${lbl}</span></div>`;
  } else if (isReminder) {
    const lbl = cfg.reminderBtnLabel || "Dismiss";
    btnHtml = `<button class="fh-row-btn fh-row-btn--reminder"
                           data-act="complete" data-tid="${escAttr(t.task_id)}" data-pid="${escAttr(person.person_id)}"${extraBtnData}>
                       <span class="fh-row-btn-label">${lbl}</span>
                   </button>`;
  } else {
    const lbl = cfg.btnLabel || "Complete";
    const ico = cfg.btnIcon ? `<span class="fh-row-btn-icon">${cfg.btnIcon}</span>` : "";
    btnHtml = `<button class="fh-row-btn"
                           data-act="complete" data-tid="${escAttr(t.task_id)}" data-pid="${escAttr(person.person_id)}"${extraBtnData}>
                       ${ico}<span class="fh-row-btn-label">${lbl}</span>
                   </button>`;
  }
  const mods = [
    `fh-row--${cfg.themeKey}`,
    isOverdue && "overdue",
    isReminder && "reminder",
    isSubmitted && "submitted",
    opts2.rowClass || ""
  ].filter(Boolean).join(" ");
  const styleAttr = opts2.rowStyle ? ` style="${opts2.rowStyle}"` : "";
  return `
        <div class="fh-row ${mods}"${styleAttr}>
            ${leadHtml}
            ${iconHtml}
            <div class="fh-row-body">
                ${kickerHtml}
                <div class="fh-row-name">${escHTML(t.name)}</div>
                ${descLine}
                ${penaltyLine}
            </div>
            ${chipsHtml}
            ${ptsHtml}
            ${btnHtml}
        </div>`;
}
function htmlAddReminderCTA(person) {
  return `
        <div class="fh-row-add-reminder-wrap">
            <button class="fh-row-add-reminder"
                    data-act="open-add-reminder" data-pid="${escAttr(person.person_id)}">
                + Add reminder
            </button>
        </div>`;
}
var init_shared = __esm({
  "src/card/themes/_shared.js"() {
    init_icons();
    init_utils();
  }
});

// src/card/themes/classic.js
function _railPanels({
  attr,
  naAttr,
  person,
  balance,
  weekly,
  openCount,
  pendingCount,
  rankIdx,
  dropThr,
  gainThr,
  color
}) {
  return `
        ${_railPanelKPIs(balance, weekly, openCount, pendingCount)}
        ${_railPanelRank(rankIdx, weekly, dropThr, gainThr, color)}
        ${_railPanelStreaks(attr, naAttr, person, color)}
        ${_railPanelRecent(person, naAttr, color)}`;
}
function _railPanel(label, contentHTML) {
  return `
        <div class="fh-classic-rpanel">
            <div class="fh-classic-rpanel-hdr">${label}</div>
            <div class="fh-classic-rpanel-body">${contentHTML}</div>
        </div>`;
}
function _railPanelKPIs(balance, weekly, openCount, pendingCount) {
  const cell = (label, val, unit) => `
        <div class="fh-classic-rkpi">
            <div class="fh-classic-rkpi-lbl">${label}</div>
            <div class="fh-classic-rkpi-val-row">
                <span class="fh-classic-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-classic-rkpi-unit">${unit}</span>` : ""}
            </div>
        </div>`;
  const body = `
        <div class="fh-classic-rkpi-row">
            ${cell("BALANCE", fPts(balance), "pts")}
            ${cell("WEEK", `+${weekly}`, "pts")}
            ${cell("OPEN", openCount, "")}
            ${cell("PENDING", pendingCount, "")}
        </div>`;
  return _railPanel("OVERVIEW", body);
}
function _railPanelRank(rankIdx, weekly, dropThr, gainThr, color) {
  const bar = htmlRankBar(rankIdx, weekly, dropThr, gainThr, CLASSIC_RANKS, color);
  if (!bar) {
    return _railPanel(
      "RANK",
      `<div class="fh-classic-rmax">${escHTML(getEffectiveRank(rankIdx, CLASSIC_RANKS).name)} \xB7 max</div>`
    );
  }
  return _railPanel("RANK", bar);
}
function _railPanelStreaks(attr, naAttr, person, color) {
  const active = getActiveStreaks(attr, naAttr, person, 8);
  if (!active.length) {
    return _railPanel(
      "STREAKS",
      `<div class="fh-classic-rempty">No active streaks yet</div>`
    );
  }
  const rows = active.map((t) => {
    const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
    const segs = Array.from(
      { length: goalSegs },
      (_, i) => `<span class="fh-classic-rseg${i < filledN ? " filled" : ""}" style="${i < filledN ? `background:${color}` : ""}"></span>`
    ).join("");
    const bonusChip = t.milestone > 0 && t.bonus > 0 ? `<span class="fh-classic-rbonus">\u2605+${t.bonus}</span>` : "";
    return `
            <div class="fh-classic-rstreak">
                <div class="fh-classic-rstreak-head">
                    <span class="fh-classic-rstreak-name">${escHTML(t.name)}</span>
                    ${bonusChip}
                </div>
                <div class="fh-classic-rstreak-bar">
                    <span class="fh-classic-rsegs">${segs}</span>
                    <span class="fh-classic-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel("STREAKS", rows);
}
function _railPanelRecent(person, naAttr, color) {
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id && (e.points_delta || 0) > 0).slice(0, 4);
  if (!entries.length) {
    return _railPanel(
      "RECENT WINS",
      `<div class="fh-classic-rempty">No wins logged yet</div>`
    );
  }
  const rows = entries.map((e) => {
    const when = e.timestamp ? relTime(e.timestamp) : "";
    return `
            <div class="fh-classic-rwin">
                <div class="fh-classic-rwin-when">${escHTML(when)}</div>
                <div class="fh-classic-rwin-row">
                    <span class="fh-classic-rwin-name">${escHTML(e.chore_name || e.note || "\u2014")}</span>
                    <span class="fh-classic-rwin-pts" style="color:${color}">+${e.points_delta}</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel("RECENT WINS", rows);
}
function _tasks(attr, color, person, card) {
  const rawDue = attr.tasks_due_today_list || [];
  const rawOverdue = attr.tasks_overdue_list || [];
  const pending = attr.tasks_pending_approval_list || [];
  const collapseByChore = (rows, pickFn) => {
    const seen = /* @__PURE__ */ new Map();
    for (const t of rows) {
      const key = t.chore_id;
      if (!seen.has(key) || pickFn(t, seen.get(key))) seen.set(key, t);
    }
    return [...seen.values()];
  };
  const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
  const allDue = collapseByChore(rawDue, () => false);
  const isReminderTask = (t) => t.chore_type === "reminder";
  const dueReminders = allDue.filter((t) => isReminderTask(t));
  const due = allDue.filter((t) => !isReminderTask(t));
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const orderedLabels = naAttr.category_labels || [];
  const labelIndex = new Map(orderedLabels.map((l, i) => [l, i]));
  const groups = /* @__PURE__ */ new Map();
  for (const t of due) {
    const key = t.category_label || "Today";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  }
  const sortedGroupKeys = [...groups.keys()].sort((a, b) => {
    const aIsToday = a === "Today", bIsToday = b === "Today";
    if (aIsToday && !bIsToday) return 1;
    if (!aIsToday && bIsToday) return -1;
    const ai = labelIndex.has(a) ? labelIndex.get(a) : Infinity;
    const bi = labelIndex.has(b) ? labelIndex.get(b) : Infinity;
    if (ai !== bi) return ai - bi;
    return a.localeCompare(b);
  });
  const classicRowConfig = {
    themeKey: "classic",
    btnLabel: "\u2713",
    btnPendingLabel: "Pending Approval",
    reminderBtnLabel: "Done",
    streakIcon: "\u{1F525}",
    statusFormat: {
      breach: (t) => `${t.days_overdue}d late`,
      resetSoon: (t) => {
        var _a;
        const rType = t.recurrence_type;
        const dur = t.days_until_reset;
        if (dur === 0) return "Resets today";
        if (dur === 1) return "Resets tomorrow";
        if (rType === "weekly" && ((_a = t.recurrence_weekdays) == null ? void 0 : _a.length)) {
          return `Resets ${t.recurrence_weekdays.map((d) => WEEKDAY_LABELS[d]).join("/")}`;
        }
        return `Resets in ${dur}d`;
      },
      firing: (t) => `-${t.penalty_points}pts/day`,
      expiry: (d) => d <= 0 ? "Expires today" : `Expires in ${d}d`
    },
    iconColor: () => color
  };
  const renderRow = (t, isOverdue) => {
    const taggedTask = isOverdue ? { ...t, _over: true } : t;
    return htmlChoreRow(taggedTask, classicRowConfig, person, card);
  };
  const dueSection = sortedGroupKeys.map((label) => `
        <div class="fh-row-section-hdr">${escHTML(label)}</div>
        ${(groups.get(label) || []).map((t) => renderRow(t, false)).join("")}`).join("");
  const reminderSection = dueReminders.length ? `
        <div class="fh-row-section-hdr">Reminders</div>
        ${dueReminders.map((t) => renderRow(t, false)).join("")}` : "";
  const empty = !due.length && !overdue.length && !pending.length && !dueReminders.length;
  return `
        ${htmlAddReminderCTA(person)}
        <div class="fh-row-list" style="--row-color:${color}">
            ${overdue.length ? overdue.map((t) => renderRow(t, true)).join("") : ""}
            ${dueSection}
            ${reminderSection}
            ${pending.length ? `
                <div class="fh-row-section-hdr">Awaiting approval</div>
                ${pending.map((t) => htmlChoreRow(t, classicRowConfig, person, card)).join("")}` : ""}
        </div>
        ${empty ? '<div class="fh-empty">Nothing due \u2014 nice work!</div>' : ""}`;
}
function _store(attr, color, person, balance, card) {
  const items = attr.store_items || [];
  if (!items.length) return `<div class="fh-empty">No rewards in the store yet.</div>`;
  const pendingRedemptions = card._attrs("sensor.family_hub_needs_attention").redemption_queue || [];
  const personPending = pendingRedemptions.filter((r) => r.person_id === person.person_id);
  const pendingByItemId = new Set(personPending.map((r) => r.item_id).filter(Boolean));
  const pendingByName = new Set(personPending.filter((r) => !r.item_id).map((r) => r.item_name));
  return `
        <div class="fh-store-grid">
            ${items.map((item) => {
    const can = balance >= item.points_cost;
    const requested = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
    return `
                <div class="fh-store-item">
                    <div class="fh-store-name">${escHTML(item.name)}</div>
                    ${item.description ? `<div class="fh-store-desc">${escHTML(item.description)}</div>` : ""}
                    <div class="fh-store-price" style="color:${color}">${fPts(item.points_cost)}pts</div>
                    ${requested ? `<span class="fh-badge fh-badge-requested" style="text-align:center">Requested \u2713</span>` : `<button class="fh-btn fh-btn-sm ${can ? "fh-btn-primary" : "fh-btn-ghost"}"
                                   style="${can ? `background:${color}` : ""}"
                                   data-act="redeem" data-iid="${item.item_id}" data-pid="${person.person_id}"
                                   ${can ? "" : "disabled"}>
                               ${can ? "Request" : "Need more pts"}
                           </button>`}
                </div>`;
  }).join("")}
        </div>`;
}
function _history(person, card) {
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id);
  if (!entries.length) return `<div class="fh-empty">No history yet.</div>`;
  const grouped = groupHistorySkipped(entries);
  const rows = grouped.map(
    (item) => item.isGroup ? _skippedGroup(item, card) : _histRow(item.entry)
  ).join("");
  return `<div class="fh-hist-scroll">${rows}</div>`;
}
function _histRow(e) {
  const meta = HISTORY_META[e.type] || { label: e.type, color: "var(--fh-text-sec)" };
  const ptsDelta = e.points_delta ? `<span style="color:${e.points_delta > 0 ? "var(--fh-success)" : "var(--fh-overdue)"}">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>` : "";
  return `
        <div class="fh-hist-row" style="--hist-color:${meta.color}">
            <div class="fh-hist-info">
                <div class="fh-hist-label">${escHTML(meta.label)}</div>
                <div class="fh-hist-name">${escHTML(e.chore_name || e.note || "")}</div>
                <div class="fh-hist-meta">${relTime(e.timestamp)} ${ptsDelta}</div>
            </div>
        </div>`;
}
function _skippedGroup(group, card) {
  const expanded = card._expandedSkippedDates.has(group.key);
  const penLabel = group.totalPenalty > 0 ? `\u2212${group.totalPenalty}pts` : "no penalty";
  const subItems = expanded ? group.items.map((e) => {
    const pts = e.points_delta ? `<span style="color:var(--fh-overdue);font-weight:700">${e.points_delta}pts</span>` : "";
    return `
            <div class="fh-hist-subrow">
                <div class="fh-hist-info" style="flex:1;min-width:0">
                    <div class="fh-hist-name">${escHTML(e.chore_name || "")}</div>
                    <div class="fh-hist-meta">${pts}</div>
                </div>
            </div>`;
  }).join("") : "";
  return `
        <div class="fh-hist-group">
            <div class="fh-hist-group-hdr" data-act="toggle-skipped-group" data-key="${group.key}">
                <div class="fh-hist-info" style="flex:1;min-width:0">
                    <div class="fh-hist-label" style="color:var(--fh-warning)">Skipped chores</div>
                    <div class="fh-hist-name">${escHTML(group.dateDisplay)} \xB7 ${penLabel}</div>
                </div>
                <span class="fh-hist-expand-icon">${expanded ? "\u25B2" : "\u25BC"}</span>
            </div>
            ${expanded ? `<div class="fh-hist-subitems">${subItems}</div>` : ""}
        </div>`;
}
var CLASSIC_RANKS, classicTheme;
var init_classic = __esm({
  "src/card/themes/classic.js"() {
    init_constants();
    init_constants();
    init_utils();
    init_shared();
    CLASSIC_RANKS = [
      { minXP: 0, name: "Level 1" },
      { minXP: 100, name: "Level 2" },
      { minXP: 250, name: "Level 3" },
      { minXP: 500, name: "Level 4" },
      { minXP: 1e3, name: "Level 5" },
      { minXP: 2e3, name: "Level 6" },
      { minXP: 3500, name: "Level 7" }
    ];
    classicTheme = {
      key: "classic",
      tint: "#1A2538",
      sigil: "\u25C7",
      ranks: CLASSIC_RANKS,
      handlesNavigation: false,
      rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, CLASSIC_RANKS).name;
      },
      homeTileSubLabel(person) {
        return person.person_type === "parent" ? "HANDLER" : "FIELD AGENT";
      },
      render(card, person) {
        var _a;
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid = card._personEntityId(person.name);
        const attr = card._attrs(eid);
        const naAttr = card._attrs("sensor.family_hub_needs_attention");
        const balance = parseInt(((_a = card._states(eid)) == null ? void 0 : _a.state) || "0");
        const color = person.avatar_color || DEFAULT_COLOR;
        const rankIdx = person.rank_index !== void 0 ? person.rank_index : 0;
        const dropThr = person.rank_drop_threshold ?? naAttr.rank_drop_threshold ?? 50;
        const gainThr = person.rank_gain_threshold ?? naAttr.rank_gain_threshold ?? 75;
        const weekly = getWeeklyPts(person.person_id, naAttr.history_log);
        const tabBar = [
          { key: "tasks", label: "Tasks" },
          { key: "store", label: "Store" },
          { key: "history", label: "History" }
        ].map((t) => `
            <div class="fh-tab ${card._tab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}</div>`).join("");
        let content = "";
        if (card._tab === "tasks") content = _tasks(attr, color, person, card);
        if (card._tab === "store") content = _store(attr, color, person, balance, card);
        if (card._tab === "history") content = _history(person, card);
        const openCount = (attr.tasks_due_today_list || []).filter((t) => t.status === "pending").length;
        const pendingCount = (attr.tasks_pending_approval_list || []).length;
        const showRail = card._tab === "tasks";
        const railHTML = showRail ? _railPanels({
          attr,
          naAttr,
          person,
          balance,
          weekly,
          openCount,
          pendingCount,
          rankIdx,
          dropThr,
          gainThr,
          color
        }) : "";
        return `
            <div class="fh-classic-page${kidLarge}">
                <div class="fh-person-header" style="border-left:4px solid ${color}">
                    <div class="fh-avatar" style="background:${color};width:46px;height:46px;font-size:1.1rem">
                        ${ini(person.name)}
                    </div>
                    <div style="flex:1;min-width:0">
                        <div style="font-size:.9rem;color:var(--fh-text-sec);font-weight:600">${escHTML(person.name)}</div>
                        <div class="fh-balance" style="color:${color}">
                            ${fPts(balance)}<span class="fh-balance-unit">pts</span>
                        </div>
                        ${attr.show_dollar_value ? `<div class="fh-dollar">${fUSD(attr.dollar_value)}</div>` : ""}
                    </div>
                </div>
                <div class="fh-tabs">${tabBar}</div>
                <div class="fh-classic-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-classic-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-classic-rail">${railHTML}</aside>` : ""}
                </div>
            </div>`;
      }
    };
  }
});

// src/card/themes/engineer.js
function _railPanels2({
  attr,
  naAttr,
  person,
  balance,
  openCount,
  weekly,
  rank,
  rankIdx,
  dropThr,
  gainThr,
  plotDate
}) {
  return `
        ${_railPanelKPIs2(balance, openCount, weekly)}
        ${_railPanelRank2(rankIdx, weekly, dropThr, gainThr)}
        ${_railPanelStreaks2(attr, naAttr, person)}
        ${_railPanelSheet(person, rank, plotDate)}`;
}
function _railPanel2(label, contentHTML, opts2 = {}) {
  const { dense = false } = opts2;
  return `
        <div class="fh-eng-rpanel ${dense ? "dense" : ""}">
            <span class="fh-eng-tick" data-pos="tl"></span>
            <span class="fh-eng-tick" data-pos="tr"></span>
            <span class="fh-eng-tick" data-pos="bl"></span>
            <span class="fh-eng-tick" data-pos="br"></span>
            <div class="fh-eng-rpanel-hdr">// ${label}</div>
            <div class="fh-eng-rpanel-body">${contentHTML}</div>
        </div>`;
}
function _railPanelKPIs2(balance, openCount, weekly) {
  const cell = (label, val, unit) => `
        <div class="fh-eng-rkpi">
            <div class="fh-eng-rkpi-lbl">${label}</div>
            <div class="fh-eng-rkpi-val-row">
                <span class="fh-eng-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-eng-rkpi-unit">${unit}</span>` : ""}
            </div>
        </div>`;
  const body = `
        <div class="fh-eng-rkpi-row">
            ${cell("BAL", fPts(balance), "pts")}
            ${cell("OPEN", openCount, "wo")}
            ${cell("WEEK", `+${weekly}`, "pts")}
        </div>`;
  return _railPanel2("TODAY \xB7 KPIS", body, { dense: true });
}
function _railPanelRank2(rankIdx, weekly, dropThr, gainThr) {
  const bar = htmlRankBar(rankIdx, weekly, dropThr, gainThr, ENGINEER_RANKS, ENG.amber);
  if (!bar) {
    return _railPanel2(
      "RANK \xB7 TRACK",
      `<div class="fh-eng-rmax">${escHTML(getEffectiveRank(rankIdx, ENGINEER_RANKS).name)} &middot; MAX</div>`
    );
  }
  return _railPanel2("RANK \xB7 TRACK", bar);
}
function _railPanelStreaks2(attr, naAttr, person) {
  const active = getActiveStreaks(attr, naAttr, person, 8);
  if (!active.length) {
    return _railPanel2(
      "STREAK \xB7 CONSTELLATION",
      `<div class="fh-eng-rempty">NO ACTIVE STREAKS &middot; START A CYCLE</div>`
    );
  }
  const rows = active.map((t) => {
    const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 12);
    const segs = Array.from({ length: goalSegs }, (_, i) => i < filledN);
    const milestoneChip = t.milestone > 0 && t.bonus > 0 ? `<span class="fh-eng-chip fh-eng-chip-streak">&#9733;+${t.bonus}</span>` : "";
    return `
            <div class="fh-eng-rstreak">
                <div class="fh-eng-rstreak-head">
                    <span class="fh-eng-rstreak-name">${escHTML(t.name)}</span>
                    ${milestoneChip}
                </div>
                <div class="fh-eng-rstreak-bar">
                    ${segs.map(
      (on) => `<span class="fh-eng-dim-seg${on ? " filled" : ""}"></span>`
    ).join("")}
                    <span class="fh-eng-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel2("STREAK \xB7 CONSTELLATION", rows);
}
function _railPanelSheet(person, rank, plotDate) {
  const body = `
        <div class="fh-eng-tb-header">RATHNOKAN HOUSEHOLD &middot; CIVIL DIV.</div>
        <div class="fh-eng-tb-grid">
            ${_tbCell("DRAWN BY", person.name.toUpperCase())}
            ${_tbCell("DATE", plotDate)}
            ${_tbCell("SHEET", "01 / 01")}
            ${_tbCell("SCALE", "N.T.S.")}
            ${_tbCell("REV", "A")}
            ${_tbCell("STATUS", "ISSUED", ENG.amber)}
        </div>
        <div class="fh-eng-rsheet-legend">&#9671; APPROVAL STAMP TO COMPLETE &middot; DIMENSIONS IN POINTS &middot; DO NOT SCALE</div>`;
  return _railPanel2("SHEET \xB7 A-101", body, { dense: true });
}
function _tbCell(label, value, accent) {
  return `
        <div class="fh-eng-tb-cell">
            <div class="fh-eng-tb-cell-lbl">${label}</div>
            <div class="fh-eng-tb-cell-val" style="${accent ? `color:${accent}` : ""}">${escHTML(value)}</div>
        </div>`;
}
function _workOrders(attr, person, balance, card) {
  const rawDue = attr.tasks_due_today_list || [];
  const rawOverdue = attr.tasks_overdue_list || [];
  const pending = attr.tasks_pending_approval_list || [];
  const collapseByChore = (rows, pickFn) => {
    const seen = /* @__PURE__ */ new Map();
    for (const t of rows) {
      const key = t.chore_id;
      if (!seen.has(key) || pickFn(t, seen.get(key))) seen.set(key, t);
    }
    return [...seen.values()];
  };
  const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
  const due = collapseByChore(rawDue.filter((t) => t.chore_type !== "reminder"), () => false);
  const all = [
    ...overdue.map((t) => ({ ...t, _overdue: true })),
    ...due
  ];
  if (!all.length && !pending.length) {
    return `<div class="fh-eng-empty">&#10003; ALL WORK ORDERS COMPLETE &middot; AREA CLEAR</div>`;
  }
  let pendingIdx = 0;
  const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">// PENDING REVIEW</div>
        ${pending.map((t) => htmlChoreRow(t, engineerRowConfig, person, card, { index: ++pendingIdx })).join("")}` : "";
  return `
        <div class="fh-row-list">
            ${all.slice(0, 6).map((t, i) => htmlChoreRow(t, engineerRowConfig, person, card, { index: i + 1 })).join("")}
            ${pendingSection}
        </div>`;
}
function _rewards(attr, person, balance, card) {
  const items = attr.store_items || [];
  if (!items.length) {
    return `<div class="fh-eng-empty">NO REWARDS CONFIGURED &middot; PENDING ADMIN ACTION</div>`;
  }
  const pendingRedemptions = card._attrs("sensor.family_hub_needs_attention").redemption_queue || [];
  const personPending = pendingRedemptions.filter((r) => r.person_id === person.person_id);
  const pendingByItemId = new Set(personPending.map((r) => r.item_id).filter(Boolean));
  const pendingByName = new Set(personPending.filter((r) => !r.item_id).map((r) => r.item_name));
  return `
        <div class="fh-eng-reward-list">
            ${items.map((item) => {
    const can = balance >= item.points_cost;
    const requested = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
    return `
                <div class="fh-eng-reward-row">
                    <div class="fh-eng-reward-body">
                        <div class="fh-eng-wo-name" style="font-size:1rem">${escHTML(item.name)}</div>
                        ${item.description ? `<div class="fh-eng-status">${escHTML(item.description)}</div>` : ""}
                    </div>
                    <div class="fh-eng-pts-stamp" style="min-width:64px">
                        <div class="fh-eng-pts-num" style="font-size:1.2rem">${fPts(item.points_cost)}</div>
                        <div class="fh-eng-pts-lbl">POINTS</div>
                    </div>
                    ${requested ? `<div class="fh-eng-status" style="color:${ENG.amber}">&#10003; REQUESTED</div>` : `<button class="fh-eng-stamp-btn ${can ? "" : "disabled"}"
                                   data-act="redeem" data-iid="${item.item_id}" data-pid="${person.person_id}"
                                   style="font-size:9px;${!can ? "opacity:.4;cursor:not-allowed" : ""}">
                               ${can ? "REQUISITION" : "INSUFFICIENT\nFUNDS"}
                           </button>`}
                </div>`;
  }).join("")}
        </div>`;
}
function _asBuilts(person, card) {
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id);
  if (!entries.length) {
    return `<div class="fh-eng-empty">NO RECORDS ON FILE &middot; HISTORY BEGINS ON FIRST COMPLETION</div>`;
  }
  const grouped = groupHistorySkipped(entries);
  return `
        <div class="fh-eng-hist-list">
            ${grouped.slice(0, 12).map(
    (item) => item.isGroup ? _engSkippedGroup(item, card) : _engHistRow(item.entry)
  ).join("")}
        </div>`;
}
function _engHistRow(e) {
  const meta = HISTORY_META[e.type] || { label: e.type, color: ENG.inkMute };
  const ptsDelta = e.points_delta ? e.points_delta > 0 ? `+${e.points_delta}pts` : `${e.points_delta}pts` : "";
  const ptColor = e.points_delta > 0 ? ENG.amber : ENG.red;
  return `
        <div class="fh-eng-hist-row">
            <div class="fh-eng-hist-type" style="color:${meta.color}">${escHTML(meta.label.toUpperCase())}</div>
            <div class="fh-eng-hist-name">${escHTML(e.chore_name || e.note || "\u2014")}</div>
            ${ptsDelta ? `<div class="fh-eng-hist-pts" style="color:${ptColor}">${ptsDelta}</div>` : ""}
        </div>`;
}
function _engSkippedGroup(group, card) {
  const expanded = card._expandedSkippedDates.has(group.key);
  const pen = group.totalPenalty > 0 ? `&minus;${group.totalPenalty}pts` : "no penalty";
  return `
        <div class="fh-eng-hist-row fh-eng-hist-skipped"
             data-act="toggle-skipped-group" data-key="${group.key}" style="cursor:pointer">
            <div class="fh-eng-hist-type" style="color:${ENG.red}">SKIPPED CYCLE</div>
            <div class="fh-eng-hist-name">${escHTML(group.dateDisplay)} &middot; ${pen}</div>
            <span style="color:${ENG.inkMute};font-size:.75rem">${expanded ? "\u25B2" : "\u25BC"}</span>
        </div>
        ${expanded ? group.items.map((e) => `
            <div class="fh-eng-hist-row" style="padding-left:24px;opacity:.8">
                <div class="fh-eng-hist-type" style="color:${ENG.inkMute}">ITEM</div>
                <div class="fh-eng-hist-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta ? `<div class="fh-eng-hist-pts" style="color:${ENG.red}">${e.points_delta}pts</div>` : ""}
            </div>`).join("") : ""}`;
}
var ENG, ENGINEER_RANKS, engineerRowConfig, engineerTheme;
var init_engineer = __esm({
  "src/card/themes/engineer.js"() {
    init_utils();
    init_constants();
    init_shared();
    ENG = {
      paper: "#0E3A5C",
      panel: "#0B2D48",
      grid: "#3C7AA5",
      ink: "#F2EBD6",
      inkDim: "#C9C0A2",
      inkMute: "#8A8669",
      red: "#E07A4C",
      amber: "#E0B84C"
    };
    ENGINEER_RANKS = [
      { minXP: 0, name: "Drafter" },
      { minXP: 150, name: "Jr. Engineer" },
      { minXP: 400, name: "P.E." },
      { minXP: 800, name: "Sr. Engineer" },
      { minXP: 1500, name: "Principal Eng." }
    ];
    engineerRowConfig = {
      themeKey: "engineer",
      kickerFormat: (t, idx) => `WO-${String(idx).padStart(3, "0")} \xB7 ${(t.category_label || "GEN").toUpperCase()}`,
      btnLabel: "MARK<br>COMPLETE",
      btnIcon: "\u2713",
      btnPendingLabel: "PENDING<br>APPROVAL",
      btnPendingIcon: "\u23F1",
      reminderBtnLabel: "DISMISS",
      streakIcon: "\u25B3",
      statusFormat: {
        breach: (t) => `BREACH \xB7 ${t.days_overdue}D`,
        resetSoon: () => "RESETS 1D",
        firing: (t) => `ACCRUING \u2212${t.penalty_points}/D`,
        expiry: (d) => d <= 0 ? "EXPIRES TODAY" : `EXPIRES ${d}D`
      },
      iconColor: () => ENG.ink
    };
    engineerTheme = {
      key: "engineer",
      tint: "#1B3550",
      sigil: "\u27C1",
      ranks: ENGINEER_RANKS,
      handlesNavigation: true,
      rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, ENGINEER_RANKS).name;
      },
      homeTileSubLabel() {
        return "CIVIL ENGINEER";
      },
      render(card, person) {
        var _a;
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid = card._personEntityId(person.name);
        const attr = card._attrs(eid);
        const naAttr = card._attrs("sensor.family_hub_needs_attention");
        const balance = parseInt(((_a = card._states(eid)) == null ? void 0 : _a.state) || "0");
        const rankIdx = person.rank_index !== void 0 ? person.rank_index : 0;
        const dropThr = person.rank_drop_threshold ?? naAttr.rank_drop_threshold ?? 50;
        const gainThr = person.rank_gain_threshold ?? naAttr.rank_gain_threshold ?? 75;
        const weekly = getWeeklyPts(person.person_id, naAttr.history_log);
        const tabDefs = [
          { key: "tasks", label: "WORK ORDERS", sub: "primary" },
          { key: "store", label: "REWARDS", sub: "exchange" },
          { key: "history", label: "AS-BUILTS", sub: "history" }
        ];
        const activeTab = card._tab || "tasks";
        const tabBar = tabDefs.map((t) => `
            <div class="fh-eng-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">
                ${t.label}
                <span class="fh-eng-tab-sub">${t.sub}</span>
            </div>`).join("");
        let content = "";
        if (activeTab === "tasks") content = _workOrders(attr, person, balance, card);
        if (activeTab === "store") content = _rewards(attr, person, balance, card);
        if (activeTab === "history") content = _asBuilts(person, card);
        const rank = getEffectiveRank(rankIdx, ENGINEER_RANKS);
        const openCount = (attr.tasks_due_today_list || []).filter((t) => t.status === "pending").length;
        const now = /* @__PURE__ */ new Date();
        const plotDate = now.toISOString().slice(0, 10);
        const plotTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
        const showRail = activeTab === "tasks";
        const railHTML = showRail ? _railPanels2({
          attr,
          naAttr,
          person,
          balance,
          openCount,
          weekly,
          rank,
          rankIdx,
          dropThr,
          gainThr,
          plotDate
        }) : "";
        return `
            <div class="fh-eng-page${kidLarge}">
                <div class="fh-eng-grid"></div>
                <div class="fh-eng-border-outer"></div>
                <div class="fh-eng-border-inner"></div>

                <div class="fh-eng-content">
                    <!-- Top nav -->
                    <div class="fh-eng-topnav">
                        <button class="fh-eng-back-btn" data-act="nav-back">&#8592; HOME</button>
                    </div>

                    <!-- Header strip -->
                    <div class="fh-eng-header">
                        <div class="fh-eng-avatar">
                            ${ini(person.name)}
                            <span class="fh-eng-avatar-diamond"></span>
                        </div>

                        <div class="fh-eng-identity">
                            <div class="fh-eng-rank-line">
                                ${escHTML(rank.name.toUpperCase())} &middot; AGT ${escHTML((person.code || person.name).toUpperCase())} &middot; DIV. ${escHTML(person.person_type === "parent" ? "PARENT" : "FIELD")}
                            </div>
                            <div class="fh-eng-name">${escHTML(person.name)} &middot; Work Orders</div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="fh-eng-tabs">${tabBar}</div>
                    <div class="fh-eng-rule"></div>

                    <!-- Body \u2014 two-column on wide, stacked below 900px -->
                    <div class="fh-eng-body ${showRail ? "has-rail" : ""}">
                        <div class="fh-eng-body-main">${content}</div>
                        ${showRail ? `<aside class="fh-eng-rail">${railHTML}</aside>` : ""}
                    </div>

                    <!-- Footer \u2014 single mono status line -->
                    <div class="fh-eng-footer">
                        <span class="fh-eng-file-path">FILE &middot; /WORK_ORDERS/${plotDate}.dwg &middot; LAST PLOT ${plotTime} LOCAL &middot; SHEET A-101 R/A</span>
                    </div>
                </div>
            </div>`;
      }
    };
  }
});

// src/card/themes/baker.js
function _railPanels3({
  attr,
  naAttr,
  person,
  balance,
  weekly,
  openCount,
  rankIdx,
  dropThr,
  gainThr,
  rank
}) {
  return `
        ${_railPanelKPIs3(balance, weekly, openCount)}
        ${_railPanelRank3(rankIdx, weekly, dropThr, gainThr)}
        ${_railPanelStreaks3(attr, naAttr, person)}
        ${_railPanelRecent2(person, naAttr)}`;
}
function _railPanel3(label, contentHTML) {
  return `
        <div class="fh-bk-rpanel">
            <div class="fh-bk-rpanel-hdr">~ ${label} ~</div>
            <div class="fh-bk-rpanel-body">${contentHTML}</div>
        </div>`;
}
function _railPanelKPIs3(balance, weekly, openCount) {
  const cell = (label, val, unit) => `
        <div class="fh-bk-rkpi">
            <div class="fh-bk-rkpi-lbl">${label}</div>
            <div class="fh-bk-rkpi-val-row">
                <span class="fh-bk-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-bk-rkpi-unit">${unit}</span>` : ""}
            </div>
        </div>`;
  const body = `
        <div class="fh-bk-rkpi-row">
            ${cell("balance", fPts(balance), "pts")}
            ${cell("this week", `+${weekly}`, "pts")}
            ${cell("on prep", openCount, "items")}
        </div>`;
  return _railPanel3("the pantry today", body);
}
function _railPanelRank3(rankIdx, weekly, dropThr, gainThr) {
  const bar = htmlRankBar(rankIdx, weekly, dropThr, gainThr, BAKER_RANKS, BK.terra);
  if (!bar) {
    return _railPanel3(
      "promotion track",
      `<div class="fh-bk-rmax">${escHTML(getEffectiveRank(rankIdx, BAKER_RANKS).name)} \xB7 top of the line</div>`
    );
  }
  return _railPanel3("promotion track", bar);
}
function _railPanelStreaks3(attr, naAttr, person) {
  const active = getActiveStreaks(attr, naAttr, person, 8);
  if (!active.length) {
    return _railPanel3(
      "hot streaks",
      `<div class="fh-bk-rempty">No hot streaks yet \u2014 fire up the oven</div>`
    );
  }
  const rows = active.map((t) => {
    const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
    const dots = Array.from(
      { length: goalSegs },
      (_, i) => `<span class="fh-bk-rdot${i < filledN ? " filled" : ""}"></span>`
    ).join("");
    const bonusChip = t.milestone > 0 && t.bonus > 0 ? `<span class="fh-bk-rbonus">\u2605+${t.bonus}</span>` : "";
    return `
            <div class="fh-bk-rstreak">
                <div class="fh-bk-rstreak-head">
                    <span class="fh-bk-rstreak-name">${escHTML(t.name)}</span>
                    ${bonusChip}
                </div>
                <div class="fh-bk-rstreak-bar">
                    <span class="fh-bk-rdots">${dots}</span>
                    <span class="fh-bk-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel3("hot streaks", rows);
}
function _railPanelRecent2(person, naAttr) {
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id && (e.points_delta || 0) > 0).slice(0, 4);
  if (!entries.length) {
    return _railPanel3(
      "today's tickets",
      `<div class="fh-bk-rempty">No tickets served yet</div>`
    );
  }
  const rows = entries.map((e) => {
    const when = e.timestamp ? relTime(e.timestamp) : "";
    return `
            <div class="fh-bk-rorder">
                <div class="fh-bk-rorder-when">~ ${escHTML(when)} ~</div>
                <div class="fh-bk-rorder-row">
                    <span class="fh-bk-rorder-name">${escHTML(e.chore_name || e.note || "\u2014")}</span>
                    <span class="fh-bk-rorder-pts">+${e.points_delta}pts</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel3("today's tickets", rows);
}
function _orders(attr, person, naAttr, card) {
  const rawDue = attr.tasks_due_today_list || [];
  const rawOverdue = attr.tasks_overdue_list || [];
  const pending = attr.tasks_pending_approval_list || [];
  const catOrder = naAttr.category_labels || [];
  const collapseByChore = (rows, pickFn) => {
    const seen = /* @__PURE__ */ new Map();
    for (const t of rows) {
      if (!seen.has(t.chore_id) || pickFn(t, seen.get(t.chore_id))) seen.set(t.chore_id, t);
    }
    return [...seen.values()];
  };
  const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
  const due = collapseByChore(rawDue.filter((t) => t.chore_type !== "reminder"), () => false);
  const all = [...overdue.map((t) => ({ ...t, _over: true })), ...due];
  if (!all.length && !pending.length) {
    return `<div class="fh-bk-empty">\u2713 Kitchen's clear \u2014 all orders done!</div>`;
  }
  let stepIdx = 0;
  const groups = groupByCategory(all, catOrder);
  const groupHtml = groups.map((group) => {
    const hdr = `<div class="fh-row-section-hdr">${escHTML(group.label)}</div>`;
    const tickets = group.tasks.map((t) => htmlChoreRow(t, bakerRowConfig, person, card, { index: ++stepIdx })).join("");
    return hdr + tickets;
  }).join("");
  const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">Awaiting approval</div>
        ${pending.map((t) => htmlChoreRow(t, bakerRowConfig, person, card)).join("")}` : "";
  return `
        <div class="fh-row-list">
            ${groupHtml}
            ${pendingSection}
        </div>`;
}
function _menu(attr, person, balance, card) {
  const items = attr.store_items || [];
  if (!items.length) return `<div class="fh-bk-empty">No rewards on the menu yet.</div>`;
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const personPending = (naAttr.redemption_queue || []).filter((r) => r.person_id === person.person_id);
  const pendingByItemId = new Set(personPending.map((r) => r.item_id).filter(Boolean));
  const pendingByName = new Set(personPending.filter((r) => !r.item_id).map((r) => r.item_name));
  return `
        <div class="fh-bk-menu">
            ${items.map((item) => {
    const can = balance >= item.points_cost;
    const requested = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
    return `
                <div class="fh-bk-menu-item">
                    <div class="fh-bk-menu-body">
                        <div class="fh-bk-menu-name">${escHTML(item.name)}</div>
                        ${item.description ? `<div class="fh-bk-menu-desc">${escHTML(item.description)}</div>` : ""}
                    </div>
                    <div class="fh-bk-menu-price" style="color:${BK.terra}">${fPts(item.points_cost)}pts</div>
                    ${requested ? `<span class="fh-bk-badge" style="color:${BK.terra}">Requested \u2713</span>` : `<button class="fh-bk-go-btn ${can ? "" : "disabled"}"
                                   data-act="redeem" data-iid="${escAttr(item.item_id)}" data-pid="${escAttr(person.person_id)}"
                                   ${!can ? 'disabled style="opacity:.4;cursor:not-allowed"' : ""}>
                               ${can ? "Request" : "Need more"}
                           </button>`}
                </div>`;
  }).join("")}
        </div>`;
}
function _orderLog(person, card) {
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id);
  if (!entries.length) return `<div class="fh-bk-empty">No orders on record yet.</div>`;
  const grouped = groupHistorySkipped(entries);
  return `
        <div class="fh-bk-log">
            ${grouped.slice(0, 15).map(
    (item) => item.isGroup ? _logSkippedGroup(item, card) : _logRow(item.entry)
  ).join("")}
        </div>`;
}
function _logRow(e) {
  const meta = HISTORY_META[e.type] || { label: e.type, color: BK.mute };
  const pts = e.points_delta ? `<span style="color:${e.points_delta > 0 ? BK.terra : BK.red};font-weight:700">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>` : "";
  return `
        <div class="fh-bk-log-row">
            <div class="fh-bk-log-type" style="color:${meta.color}">${escHTML(meta.label)}</div>
            <div class="fh-bk-log-name">${escHTML(e.chore_name || e.note || "\u2014")}</div>
            ${pts}
        </div>`;
}
function _logSkippedGroup(group, card) {
  const expanded = card._expandedSkippedDates.has(group.key);
  const pen = group.totalPenalty > 0 ? `\u2212${group.totalPenalty}pts` : "no penalty";
  return `
        <div class="fh-bk-log-row"
             data-act="toggle-skipped-group" data-key="${escAttr(group.key)}" style="cursor:pointer">
            <div class="fh-bk-log-type" style="color:${BK.red}">Skipped</div>
            <div class="fh-bk-log-name">${escHTML(group.dateDisplay)} \xB7 ${pen}</div>
            <span style="color:${BK.mute};font-size:.75rem">${expanded ? "\u25B2" : "\u25BC"}</span>
        </div>
        ${expanded ? group.items.map((e) => `
            <div class="fh-bk-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-bk-log-type" style="color:${BK.mute}">Item</div>
                <div class="fh-bk-log-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta ? `<span style="color:${BK.red};font-weight:700">${e.points_delta}pts</span>` : ""}
            </div>`).join("") : ""}`;
}
var BK, bakerRowConfig, BAKER_RANKS, bakerTheme;
var init_baker = __esm({
  "src/card/themes/baker.js"() {
    init_utils();
    init_constants();
    init_shared();
    BK = {
      bg: "#F2E5CC",
      panel: "#FBF3E2",
      ink: "#3A1F12",
      mute: "#8B5A3A",
      terra: "#8B3A2A",
      red: "#A02828",
      green: "#3A6A28"
    };
    bakerRowConfig = {
      themeKey: "baker",
      leadFormat: (t, idx) => t.status === "pending_approval" ? null : String(idx),
      btnLabel: "Bake it \u2713",
      btnPendingLabel: "Pending Approval",
      reminderBtnLabel: "Dismiss",
      streakIcon: "\u{1F525}",
      statusFormat: {
        breach: (t) => `Overdue ${t.days_overdue}d`,
        resetSoon: () => "Resets 1d",
        firing: (t) => `\u2212${t.penalty_points}pts/d`,
        expiry: (d) => d <= 0 ? "Expires today" : `Expires in ${d}d`
      },
      iconColor: (t, isOverdue) => isOverdue ? BK.red : BK.terra
    };
    BAKER_RANKS = [
      { minXP: 0, name: "Apprentice" },
      { minXP: 100, name: "Line Cook" },
      { minXP: 300, name: "Pastry Chef" },
      { minXP: 700, name: "Sous Chef" },
      { minXP: 1400, name: "Head Chef" },
      { minXP: 2500, name: "Master Baker" }
    ];
    bakerTheme = {
      key: "baker",
      tint: "#F2E5CC",
      sigil: "\u2767",
      ranks: BAKER_RANKS,
      handlesNavigation: false,
      rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, BAKER_RANKS).name;
      },
      homeTileSubLabel() {
        return "MASTER BAKER";
      },
      render(card, person) {
        var _a;
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid = card._personEntityId(person.name);
        const attr = card._attrs(eid);
        const naAttr = card._attrs("sensor.family_hub_needs_attention");
        const balance = parseInt(((_a = card._states(eid)) == null ? void 0 : _a.state) || "0");
        const rankIdx = person.rank_index !== void 0 ? person.rank_index : 0;
        const dropThr = person.rank_drop_threshold ?? naAttr.rank_drop_threshold ?? 50;
        const gainThr = person.rank_gain_threshold ?? naAttr.rank_gain_threshold ?? 75;
        const weekly = getWeeklyPts(person.person_id, naAttr.history_log);
        const rank = getEffectiveRank(rankIdx, BAKER_RANKS);
        const now = /* @__PURE__ */ new Date();
        const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateStr = `${DAYS[now.getDay()]} \xB7 ${now.getDate()} ${MONTHS[now.getMonth()]}`;
        const tabDefs = [
          { key: "tasks", label: "Today's Prep", sub: "CHORES" },
          { key: "store", label: "Pantry", sub: "STORE" },
          { key: "history", label: "Recipe Book", sub: "HISTORY" }
        ];
        const activeTab = card._tab || "tasks";
        const tabBar = tabDefs.map((t) => `
            <div class="fh-bk-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}<span class="fh-bk-tab-sub">${t.sub}</span></div>`).join("");
        let content = "";
        if (activeTab === "tasks") content = _orders(attr, person, naAttr, card);
        if (activeTab === "store") content = _menu(attr, person, balance, card);
        if (activeTab === "history") content = _orderLog(person, card);
        const openCount = (attr.tasks_due_today_list || []).filter((t) => t.status === "pending").length;
        const showRail = activeTab === "tasks";
        const railHTML = showRail ? _railPanels3({
          attr,
          naAttr,
          person,
          balance,
          weekly,
          openCount,
          rankIdx,
          dropThr,
          gainThr,
          rank
        }) : "";
        return `
            <div class="fh-bk-page${kidLarge}">
                <div class="fh-bk-frame-outer"></div>
                <div class="fh-bk-frame-inner"></div>

                <div class="fh-bk-title-block">
                    <div class="fh-bk-title-kicker">~ ${dateStr} ~</div>
                    <div class="fh-bk-title-main">Shannon's Kitchen</div>
                    <div class="fh-bk-title-sub">~ today's recipe \xB7 serves the whole family ~</div>
                </div>

                <div class="fh-bk-tabs">${tabBar}</div>

                <div class="fh-bk-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-bk-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-bk-rail">${railHTML}</aside>` : ""}
                </div>

                <div class="fh-bk-footer"><span>\u2014 Family Hub \xB7 est. 2026 \u2014</span><span>${escHTML(rank.name)}</span></div>
            </div>`;
      }
    };
  }
});

// src/card/themes/dinos.js
function _railPanels4({
  attr,
  naAttr,
  person,
  balance,
  weekly,
  openCount,
  rankIdx,
  dropThr,
  gainThr,
  dateStr
}) {
  return `
        ${_railPanelKPIs4(balance, weekly, openCount)}
        ${_railPanelRank4(rankIdx, weekly, dropThr, gainThr)}
        ${_railPanelStreaks4(attr, naAttr, person)}
        ${_railPanelFindings(person, naAttr)}`;
}
function _railPanel4(label, contentHTML) {
  return `
        <div class="fh-dn-rpanel">
            <div class="fh-dn-rpanel-hdr">// ${label}</div>
            <div class="fh-dn-rpanel-body">${contentHTML}</div>
        </div>`;
}
function _railPanelKPIs4(balance, weekly, openCount) {
  const cell = (label, val, unit) => `
        <div class="fh-dn-rkpi">
            <div class="fh-dn-rkpi-lbl">${label}</div>
            <div class="fh-dn-rkpi-val-row">
                <span class="fh-dn-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-dn-rkpi-unit">${unit}</span>` : ""}
            </div>
        </div>`;
  const body = `
        <div class="fh-dn-rkpi-row">
            ${cell("FOSSILS", fPts(balance), "pts")}
            ${cell("THIS WEEK", `+${weekly}`, "pts")}
            ${cell("SPECIMENS", openCount, "open")}
        </div>`;
  return _railPanel4("FIELD KIT \xB7 TODAY", body);
}
function _railPanelRank4(rankIdx, weekly, dropThr, gainThr) {
  const bar = htmlRankBar(rankIdx, weekly, dropThr, gainThr, DINOS_RANKS, DN.amber);
  if (!bar) {
    return _railPanel4(
      "DIG STATUS",
      `<div class="fh-dn-rmax">${escHTML(getEffectiveRank(rankIdx, DINOS_RANKS).name)} \xB7 MAX</div>`
    );
  }
  return _railPanel4("DIG STATUS", bar);
}
function _railPanelStreaks4(attr, naAttr, person) {
  const active = getActiveStreaks(attr, naAttr, person, 8);
  if (!active.length) {
    return _railPanel4(
      "FOSSIL RECORD",
      `<div class="fh-dn-rempty">NO STREAKS LOGGED \u2014 DIG IN</div>`
    );
  }
  const rows = active.map((t) => {
    const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
    const prints = Array.from(
      { length: goalSegs },
      (_, i) => `<span class="fh-dn-footprint${i < filledN ? "" : " dim"}">\u{1F9B6}</span>`
    ).join("");
    const bonusChip = t.milestone > 0 && t.bonus > 0 ? `<span class="fh-dn-rbonus">\u2605+${t.bonus}</span>` : "";
    return `
            <div class="fh-dn-rstreak">
                <div class="fh-dn-rstreak-head">
                    <span class="fh-dn-rstreak-name">${escHTML(t.name)}</span>
                    ${bonusChip}
                </div>
                <div class="fh-dn-rstreak-bar">
                    <span class="fh-dn-footprints">${prints}</span>
                    <span class="fh-dn-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel4("FOSSIL RECORD", rows);
}
function _railPanelFindings(person, naAttr) {
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id && (e.points_delta || 0) > 0).slice(0, 4);
  if (!entries.length) {
    return _railPanel4(
      "RECENT FINDINGS",
      `<div class="fh-dn-rempty">NO FINDINGS YET \u2014 FILE FIRST SPECIMEN</div>`
    );
  }
  const rows = entries.map((e, i) => {
    const padNum = String(i + 1).padStart(3, "0");
    const when = e.timestamp ? relTime(e.timestamp) : "";
    return `
            <div class="fh-dn-rfind">
                <div class="fh-dn-rfind-tag">SP-${padNum} \xB7 FILED ${escHTML(when.toUpperCase())}</div>
                <div class="fh-dn-rfind-row">
                    <span class="fh-dn-rfind-name">${escHTML(e.chore_name || e.note || "\u2014")}</span>
                    <span class="fh-dn-rfind-pts">+${e.points_delta}pts</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel4("RECENT FINDINGS", rows);
}
function _fieldTasks(attr, person, naAttr, card) {
  const rawDue = attr.tasks_due_today_list || [];
  const rawOverdue = attr.tasks_overdue_list || [];
  const pending = attr.tasks_pending_approval_list || [];
  const catOrder = naAttr.category_labels || [];
  const collapseByChore = (rows, pickFn) => {
    const seen = /* @__PURE__ */ new Map();
    for (const t of rows) {
      if (!seen.has(t.chore_id) || pickFn(t, seen.get(t.chore_id))) seen.set(t.chore_id, t);
    }
    return [...seen.values()];
  };
  const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
  const due = collapseByChore(rawDue.filter((t) => t.chore_type !== "reminder"), () => false);
  const all = [...overdue.map((t) => ({ ...t, _over: true })), ...due];
  if (!all.length && !pending.length) {
    return `<div class="fh-dn-empty">\u25C9 SITE CLEAR \u2014 ALL SPECIMENS LOGGED</div>`;
  }
  let spIdx = 0;
  const groups = groupByCategory(all, catOrder);
  const groupHtml = groups.map((group) => {
    const hdr = `<div class="fh-row-section-hdr">${escHTML(group.label)}</div>`;
    const cards = group.tasks.map((t) => htmlChoreRow(t, dinosRowConfig, person, card, { index: ++spIdx })).join("");
    return hdr + cards;
  }).join("");
  const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">AWAITING APPROVAL</div>
        ${pending.map((t) => htmlChoreRow(t, dinosRowConfig, person, card)).join("")}` : "";
  return `
        <div class="fh-row-list">
            ${groupHtml}
            ${pendingSection}
        </div>`;
}
function _supply(attr, person, balance, card) {
  const items = attr.store_items || [];
  if (!items.length) return `<div class="fh-dn-empty">SUPPLY CACHE EMPTY</div>`;
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const personPending = (naAttr.redemption_queue || []).filter((r) => r.person_id === person.person_id);
  const pendingByItemId = new Set(personPending.map((r) => r.item_id).filter(Boolean));
  const pendingByName = new Set(personPending.filter((r) => !r.item_id).map((r) => r.item_name));
  return `
        <div class="fh-dn-supply">
            ${items.map((item) => {
    const can = balance >= item.points_cost;
    const requested = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
    return `
                <div class="fh-dn-supply-item">
                    <div class="fh-dn-supply-body">
                        <div class="fh-dn-supply-name">${escHTML(item.name)}</div>
                        ${item.description ? `<div class="fh-dn-supply-desc">${escHTML(item.description)}</div>` : ""}
                    </div>
                    <div class="fh-dn-pts-tag" style="color:${DN.amber}">${fPts(item.points_cost)}pts</div>
                    ${requested ? `<span style="color:${DN.amber};font-size:.8rem;font-weight:700">CLAIMED \u2713</span>` : `<button class="fh-dn-go-btn ${can ? "" : "disabled"}"
                                   data-act="redeem" data-iid="${escAttr(item.item_id)}" data-pid="${escAttr(person.person_id)}"
                                   ${!can ? 'disabled style="opacity:.4;cursor:not-allowed"' : ""}>
                               ${can ? "CLAIM" : "NEED MORE"}
                           </button>`}
                </div>`;
  }).join("")}
        </div>`;
}
function _siteLog(person, card) {
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id);
  if (!entries.length) return `<div class="fh-dn-empty">NO ENTRIES IN SITE LOG YET</div>`;
  const grouped = groupHistorySkipped(entries);
  return `
        <div class="fh-dn-log">
            ${grouped.slice(0, 15).map(
    (item) => item.isGroup ? _dnSkippedGroup(item, card) : _dnLogRow(item.entry)
  ).join("")}
        </div>`;
}
function _dnLogRow(e) {
  const meta = HISTORY_META[e.type] || { label: e.type, color: DN.mute };
  const pts = e.points_delta ? `<span style="color:${e.points_delta > 0 ? DN.amber : DN.red};font-weight:700">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>` : "";
  return `
        <div class="fh-dn-log-row">
            <div class="fh-dn-log-type" style="color:${meta.color}">${escHTML(meta.label)}</div>
            <div class="fh-dn-log-name">${escHTML(e.chore_name || e.note || "\u2014")}</div>
            ${pts}
        </div>`;
}
function _dnSkippedGroup(group, card) {
  const expanded = card._expandedSkippedDates.has(group.key);
  const pen = group.totalPenalty > 0 ? `\u2212${group.totalPenalty}pts` : "no penalty";
  return `
        <div class="fh-dn-log-row"
             data-act="toggle-skipped-group" data-key="${escAttr(group.key)}" style="cursor:pointer">
            <div class="fh-dn-log-type" style="color:${DN.red}">SKIPPED</div>
            <div class="fh-dn-log-name">${escHTML(group.dateDisplay)} \xB7 ${pen}</div>
            <span style="color:${DN.mute};font-size:.75rem">${expanded ? "\u25B2" : "\u25BC"}</span>
        </div>
        ${expanded ? group.items.map((e) => `
            <div class="fh-dn-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-dn-log-type" style="color:${DN.mute}">ITEM</div>
                <div class="fh-dn-log-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta ? `<span style="color:${DN.red};font-weight:700">${e.points_delta}pts</span>` : ""}
            </div>`).join("") : ""}`;
}
var DN, dinosRowConfig, DINOS_RANKS, dinosTheme;
var init_dinos = __esm({
  "src/card/themes/dinos.js"() {
    init_utils();
    init_constants();
    init_shared();
    DN = {
      bg: "#E8DAB7",
      // kraft paper
      panel: "#F0E5C8",
      // lighter card
      ink: "#2B1F0E",
      // sepia ink
      mute: "#6B5020",
      // muted sepia
      amber: "#8B6A20",
      // amber accent
      red: "#8C281E",
      // overdue red
      green: "#2A5A20"
      // success green
    };
    dinosRowConfig = {
      themeKey: "dinos",
      kickerFormat: (t, idx) => t.status === "pending_approval" ? null : `SP-${String(idx).padStart(3, "0")} \xB7 ${(t.category_label || "MISC").toUpperCase().slice(0, 12)}`,
      btnLabel: "LOG IT",
      btnPendingLabel: "PENDING APPROVAL",
      reminderBtnLabel: "DISMISS",
      streakIcon: "\u{1F525}",
      statusFormat: {
        breach: (t) => `OVERDUE ${t.days_overdue}D`,
        resetSoon: () => "RESETS 1D",
        firing: (t) => `\u2212${t.penalty_points}/D`,
        expiry: (d) => d <= 0 ? "EXPIRES TODAY" : `EXPIRES ${d}D`
      },
      iconColor: (t, isOverdue) => isOverdue ? DN.red : DN.ink
    };
    DINOS_RANKS = [
      { minXP: 0, name: "Field Asst." },
      { minXP: 100, name: "Jr. Paleontologist" },
      { minXP: 300, name: "Field Lead" },
      { minXP: 700, name: "Curator" },
      { minXP: 1200, name: "Dr. Spencer" }
    ];
    dinosTheme = {
      key: "dinos",
      tint: "#E8DAB7",
      sigil: "\u25C9",
      ranks: DINOS_RANKS,
      handlesNavigation: false,
      rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, DINOS_RANKS).name;
      },
      homeTileSubLabel() {
        return "FIELD PALEONTOLOGIST";
      },
      render(card, person) {
        var _a;
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid = card._personEntityId(person.name);
        const attr = card._attrs(eid);
        const naAttr = card._attrs("sensor.family_hub_needs_attention");
        const balance = parseInt(((_a = card._states(eid)) == null ? void 0 : _a.state) || "0");
        const rankIdx = person.rank_index !== void 0 ? person.rank_index : 0;
        const dropThr = person.rank_drop_threshold ?? naAttr.rank_drop_threshold ?? 50;
        const gainThr = person.rank_gain_threshold ?? naAttr.rank_gain_threshold ?? 75;
        const weekly = getWeeklyPts(person.person_id, naAttr.history_log);
        const rank = getEffectiveRank(rankIdx, DINOS_RANKS);
        const now = /* @__PURE__ */ new Date();
        const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateStr = `${DAYS[now.getDay()]} \xB7 ${now.getDate()} ${MONTHS[now.getMonth()]}`;
        const tabDefs = [
          { key: "tasks", label: "FIELD LOG", sub: "today's specimens" },
          { key: "store", label: "TRADING POST", sub: "rewards" },
          { key: "history", label: "CATALOGUE", sub: "history" }
        ];
        const activeTab = card._tab || "tasks";
        const tabBar = tabDefs.map((t) => `
            <div class="fh-dn-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}<span class="fh-dn-tab-sub">${t.sub}</span></div>`).join("");
        let content = "";
        if (activeTab === "tasks") content = _fieldTasks(attr, person, naAttr, card);
        if (activeTab === "store") content = _supply(attr, person, balance, card);
        if (activeTab === "history") content = _siteLog(person, card);
        const openCount = (attr.tasks_due_today_list || []).filter((t) => t.status === "pending").length;
        const showRail = activeTab === "tasks";
        const railHTML = showRail ? _railPanels4({
          attr,
          naAttr,
          person,
          balance,
          weekly,
          openCount,
          rankIdx,
          dropThr,
          gainThr,
          dateStr
        }) : "";
        return `
            <div class="fh-dn-page${kidLarge}">
                <div class="fh-dn-trex-watermark">\u{1F995}</div>
                <div class="fh-dn-tape fh-dn-tape-tl"></div>
                <div class="fh-dn-tape fh-dn-tape-tr"></div>
                <div class="fh-dn-tape fh-dn-tape-bl"></div>
                <div class="fh-dn-tape fh-dn-tape-br"></div>

                <div class="fh-dn-title-block">
                    <div class="fh-dn-title-kicker">FIELD AGENT \xB7 CODENAME T-REX \xB7 DIV. PALEO</div>
                    <div class="fh-dn-title-main">Spencer's Field Log</div>
                    <div class="fh-dn-title-row">
                        <span class="fh-dn-title-date">EXPEDITION LOG \xB7 ${dateStr.toUpperCase()}</span>
                        <span class="fh-dn-stamp">approved by HQ</span>
                        <span class="fh-dn-stamp fh-dn-stamp-olive">classified</span>
                    </div>
                </div>

                <div class="fh-dn-tabs">${tabBar}</div>

                <div class="fh-dn-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-dn-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-dn-rail">${railHTML}</aside>` : ""}
                </div>

                <div class="fh-dn-footer"><span>FAMILY HUB \xB7 FIELD OPERATIONS</span><span>EXPEDITION LOG \xB7 ${dateStr.toUpperCase()}</span></div>
            </div>`;
      }
    };
  }
});

// src/card/themes/hp.js
function _railPanels5({
  attr,
  naAttr,
  person,
  balance,
  weekly,
  openCount,
  rankIdx,
  dropThr,
  gainThr,
  rank
}) {
  return `
        ${_railPanelKPIs5(balance, weekly, openCount)}
        ${_railPanelRank5(rankIdx, weekly, dropThr, gainThr)}
        ${_railPanelStreaks5(attr, naAttr, person)}
        ${_railPanelOwlPost(person, naAttr)}`;
}
function _railPanel5(label, contentHTML) {
  return `
        <div class="fh-hp-rpanel">
            <div class="fh-hp-rpanel-hdr">~ ${label} ~</div>
            <div class="fh-hp-rpanel-body">${contentHTML}</div>
        </div>`;
}
function _railPanelKPIs5(balance, weekly, openCount) {
  const cell = (label, val, unit) => `
        <div class="fh-hp-rkpi">
            <div class="fh-hp-rkpi-lbl">${label}</div>
            <div class="fh-hp-rkpi-val-row">
                <span class="fh-hp-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-hp-rkpi-unit">${unit}</span>` : ""}
            </div>
        </div>`;
  const body = `
        <div class="fh-hp-rkpi-row">
            ${cell("HOUSE PTS", fPts(balance), "")}
            ${cell("THIS WEEK", `+${weekly}`, "pts")}
            ${cell("CLASSES", openCount, "open")}
        </div>`;
  return _railPanel5("HOUSE STANDINGS", body);
}
function _railPanelRank5(rankIdx, weekly, dropThr, gainThr) {
  const bar = htmlRankBar(rankIdx, weekly, dropThr, gainThr, HP_RANKS, HP.emerald);
  if (!bar) {
    return _railPanel5(
      "O.W.L. PROGRESS",
      `<div class="fh-hp-rmax">${escHTML(getEffectiveRank(rankIdx, HP_RANKS).name)} \xB7 max marks</div>`
    );
  }
  return _railPanel5("O.W.L. PROGRESS", bar);
}
function _railPanelStreaks5(attr, naAttr, person) {
  const active = getActiveStreaks(attr, naAttr, person, 8);
  if (!active.length) {
    return _railPanel5(
      "SPELLWORK STREAKS",
      `<div class="fh-hp-rempty">No spells cast in succession yet</div>`
    );
  }
  const rows = active.map((t) => {
    const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
    const stars = Array.from(
      { length: goalSegs },
      (_, i) => `<span class="fh-hp-rstar${i < filledN ? " lit" : ""}">\u2605</span>`
    ).join("");
    const bonusChip = t.milestone > 0 && t.bonus > 0 ? `<span class="fh-hp-rbonus">\u2605+${t.bonus}</span>` : "";
    return `
            <div class="fh-hp-rstreak">
                <div class="fh-hp-rstreak-head">
                    <span class="fh-hp-rstreak-name">${escHTML(t.name)}</span>
                    ${bonusChip}
                </div>
                <div class="fh-hp-rstreak-bar">
                    <span class="fh-hp-rstars">${stars}</span>
                    <span class="fh-hp-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel5("SPELLWORK STREAKS", rows);
}
function _railPanelOwlPost(person, naAttr) {
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id && (e.points_delta || 0) > 0).slice(0, 4);
  if (!entries.length) {
    return _railPanel5(
      "OWL POST",
      `<div class="fh-hp-rempty">No owls delivered yet</div>`
    );
  }
  const rows = entries.map((e) => {
    const when = e.timestamp ? relTime(e.timestamp) : "";
    return `
            <div class="fh-hp-rowl">
                <div class="fh-hp-rowl-when">~ ${escHTML(when)} ~</div>
                <div class="fh-hp-rowl-row">
                    <span class="fh-hp-rowl-name">${escHTML(e.chore_name || e.note || "\u2014")}</span>
                    <span class="fh-hp-rowl-pts">+${e.points_delta}pts</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel5("OWL POST", rows);
}
function _assignments(attr, person, naAttr, card) {
  const rawDue = attr.tasks_due_today_list || [];
  const rawOverdue = attr.tasks_overdue_list || [];
  const pending = attr.tasks_pending_approval_list || [];
  const catOrder = naAttr.category_labels || [];
  const collapseByChore = (rows, pickFn) => {
    const seen = /* @__PURE__ */ new Map();
    for (const t of rows) {
      if (!seen.has(t.chore_id) || pickFn(t, seen.get(t.chore_id))) seen.set(t.chore_id, t);
    }
    return [...seen.values()];
  };
  const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
  const due = collapseByChore(rawDue.filter((t) => t.chore_type !== "reminder"), () => false);
  const all = [...overdue.map((t) => ({ ...t, _over: true })), ...due];
  if (!all.length && !pending.length) {
    return `<div class="fh-hp-empty">All assignments complete \u2014 10 points to the house!</div>`;
  }
  let periodIdx = 0;
  const groups = groupByCategory(all, catOrder);
  const groupHtml = groups.map((group) => {
    const hdr = `<div class="fh-row-section-hdr">${escHTML(group.label)}</div>`;
    const scrolls = group.tasks.map((t) => htmlChoreRow(t, hpRowConfig, person, card, { index: ++periodIdx })).join("");
    return hdr + scrolls;
  }).join("");
  const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">Awaiting approval</div>
        ${pending.map((t) => htmlChoreRow(t, hpRowConfig, person, card)).join("")}` : "";
  return `
        <div class="fh-row-list">
            ${groupHtml}
            ${pendingSection}
        </div>`;
}
function _vault(attr, person, balance, card) {
  const items = attr.store_items || [];
  if (!items.length) return `<div class="fh-hp-empty">The vault is empty for now.</div>`;
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const personPending = (naAttr.redemption_queue || []).filter((r) => r.person_id === person.person_id);
  const pendingByItemId = new Set(personPending.map((r) => r.item_id).filter(Boolean));
  const pendingByName = new Set(personPending.filter((r) => !r.item_id).map((r) => r.item_name));
  return `
        <div class="fh-hp-vault">
            ${items.map((item) => {
    const can = balance >= item.points_cost;
    const requested = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
    return `
                <div class="fh-hp-vault-item">
                    <div class="fh-hp-vault-body">
                        <div class="fh-hp-vault-name">${escHTML(item.name)}</div>
                        ${item.description ? `<div class="fh-hp-vault-desc">${escHTML(item.description)}</div>` : ""}
                    </div>
                    <div class="fh-hp-pts-seal" style="color:${HP.emerald}">${fPts(item.points_cost)}pts</div>
                    ${requested ? `<span style="color:${HP.emerald};font-size:.8rem;font-weight:700">Requested \u2713</span>` : `<button class="fh-hp-cast-btn ${can ? "" : "disabled"}"
                                   data-act="redeem" data-iid="${escAttr(item.item_id)}" data-pid="${escAttr(person.person_id)}"
                                   ${!can ? 'disabled style="opacity:.4;cursor:not-allowed"' : ""}>
                               ${can ? "Request" : "Need more"}
                           </button>`}
                </div>`;
  }).join("")}
        </div>`;
}
function _owlRecords(person, card) {
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id);
  if (!entries.length) return `<div class="fh-hp-empty">No O.W.L. records yet.</div>`;
  const grouped = groupHistorySkipped(entries);
  return `
        <div class="fh-hp-log">
            ${grouped.slice(0, 15).map(
    (item) => item.isGroup ? _hpSkippedGroup(item, card) : _hpLogRow(item.entry)
  ).join("")}
        </div>`;
}
function _hpLogRow(e) {
  const meta = HISTORY_META[e.type] || { label: e.type, color: HP.mute };
  const pts = e.points_delta ? `<span style="color:${e.points_delta > 0 ? HP.emerald : HP.red};font-weight:700">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>` : "";
  return `
        <div class="fh-hp-log-row">
            <div class="fh-hp-log-type" style="color:${meta.color}">${escHTML(meta.label)}</div>
            <div class="fh-hp-log-name">${escHTML(e.chore_name || e.note || "\u2014")}</div>
            ${pts}
        </div>`;
}
function _hpSkippedGroup(group, card) {
  const expanded = card._expandedSkippedDates.has(group.key);
  const pen = group.totalPenalty > 0 ? `\u2212${group.totalPenalty}pts` : "no penalty";
  return `
        <div class="fh-hp-log-row"
             data-act="toggle-skipped-group" data-key="${escAttr(group.key)}" style="cursor:pointer">
            <div class="fh-hp-log-type" style="color:${HP.red}">Skipped</div>
            <div class="fh-hp-log-name">${escHTML(group.dateDisplay)} \xB7 ${pen}</div>
            <span style="color:${HP.mute};font-size:.75rem">${expanded ? "\u25B2" : "\u25BC"}</span>
        </div>
        ${expanded ? group.items.map((e) => `
            <div class="fh-hp-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-hp-log-type" style="color:${HP.mute}">Item</div>
                <div class="fh-hp-log-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta ? `<span style="color:${HP.red};font-weight:700">${e.points_delta}pts</span>` : ""}
            </div>`).join("") : ""}`;
}
var HP, hpRowConfig, HP_RANKS, hpTheme;
var init_hp = __esm({
  "src/card/themes/hp.js"() {
    init_utils();
    init_constants();
    init_shared();
    HP = {
      bg: "#EFE0BA",
      panel: "#FAF0D7",
      ink: "#241914",
      mute: "#5A4020",
      emerald: "#1F4F3C",
      gold: "#C9A22A",
      crimson: "#6F1B26",
      red: "#A02020",
      green: "#2A5A20"
    };
    hpRowConfig = {
      themeKey: "hp",
      leadFormat: (t, idx) => t.status === "pending_approval" || t._over ? null : `P${idx}`,
      btnLabel: "Cast \u2713",
      btnPendingLabel: "Pending Approval",
      reminderBtnLabel: "Dismiss",
      streakIcon: "\u26A1",
      statusFormat: {
        breach: (t) => `Overdue ${t.days_overdue}d`,
        resetSoon: () => "Resets 1d",
        firing: (t) => `\u2212${t.penalty_points} house pts/d`,
        expiry: (d) => d <= 0 ? "Expires today" : `Expires in ${d}d`
      },
      iconColor: () => HP.panel
    };
    HP_RANKS = [
      { minXP: 0, name: "First Year" },
      { minXP: 100, name: "Second Year" },
      { minXP: 250, name: "Third Year" },
      { minXP: 500, name: "Prefect" },
      { minXP: 1e3, name: "Head Student" },
      { minXP: 2e3, name: "Order of Phoenix" }
    ];
    hpTheme = {
      key: "hp",
      tint: "#EFE0BA",
      sigil: "\u26A1",
      ranks: HP_RANKS,
      handlesNavigation: false,
      rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, HP_RANKS).name;
      },
      homeTileSubLabel() {
        return "HOGWARTS STUDENT";
      },
      render(card, person) {
        var _a;
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid = card._personEntityId(person.name);
        const attr = card._attrs(eid);
        const naAttr = card._attrs("sensor.family_hub_needs_attention");
        const balance = parseInt(((_a = card._states(eid)) == null ? void 0 : _a.state) || "0");
        const rankIdx = person.rank_index !== void 0 ? person.rank_index : 0;
        const dropThr = person.rank_drop_threshold ?? naAttr.rank_drop_threshold ?? 50;
        const gainThr = person.rank_gain_threshold ?? naAttr.rank_gain_threshold ?? 75;
        const weekly = getWeeklyPts(person.person_id, naAttr.history_log);
        const rank = getEffectiveRank(rankIdx, HP_RANKS);
        const now = /* @__PURE__ */ new Date();
        const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateStr = `${DAYS[now.getDay()]} \xB7 ${now.getDate()} ${MONTHS[now.getMonth()]}`;
        const tabDefs = [
          { key: "tasks", label: "Classes", sub: "today's schedule" },
          { key: "store", label: "Honeydukes", sub: "reward shop" },
          { key: "history", label: "Pensieve", sub: "history" }
        ];
        const activeTab = card._tab || "tasks";
        const tabBar = tabDefs.map((t) => `
            <div class="fh-hp-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}<span class="fh-hp-tab-sub">${t.sub}</span></div>`).join("");
        let content = "";
        if (activeTab === "tasks") content = _assignments(attr, person, naAttr, card);
        if (activeTab === "store") content = _vault(attr, person, balance, card);
        if (activeTab === "history") content = _owlRecords(person, card);
        const openCount = (attr.tasks_due_today_list || []).filter((t) => t.status === "pending").length;
        const showRail = activeTab === "tasks";
        const railHTML = showRail ? _railPanels5({
          attr,
          naAttr,
          person,
          balance,
          weekly,
          openCount,
          rankIdx,
          dropThr,
          gainThr,
          rank
        }) : "";
        return `
            <div class="fh-hp-page${kidLarge}">
                <div class="fh-hp-crest-watermark">\u26A1</div>
                <div class="fh-hp-frame"></div>
                <span class="fh-hp-corner fh-hp-corner-tl">\u2766</span>
                <span class="fh-hp-corner fh-hp-corner-tr">\u2766</span>
                <span class="fh-hp-corner fh-hp-corner-bl">\u2766</span>
                <span class="fh-hp-corner fh-hp-corner-br">\u2766</span>

                <div class="fh-hp-title-block">
                    <div class="fh-hp-title-row">
                        <div class="fh-hp-crest-simple">\u269C</div>
                        <div class="fh-hp-title-center">
                            <div class="fh-hp-title-kicker">STUDENT \xB7 ${escHTML(person.name.toUpperCase())} \xB7 ${escHTML(rank.name.toUpperCase())}</div>
                            <div class="fh-hp-title-main">${escHTML(person.name)}</div>
                            <div class="fh-hp-title-sub">~ Daily Class Schedule \xB7 ${dateStr} ~</div>
                        </div>
                        <div class="fh-hp-wax-seal">${ini(person.name)}</div>
                    </div>
                </div>

                <div class="fh-hp-tabs">${tabBar}</div>

                <div class="fh-hp-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-hp-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-hp-rail">${railHTML}</aside>` : ""}
                </div>

                <div class="fh-hp-footer"><span>By owl, this ${dateStr} \xB7 Ops Year 2026</span><span>\xB7 Mischief Managed \xB7</span></div>
            </div>`;
      }
    };
  }
});

// src/card/themes/dbz.js
function _railPanels6({
  attr,
  naAttr,
  person,
  balance,
  weekly,
  openCount,
  rankIdx,
  dropThr,
  gainThr,
  nextItem,
  fillPct
}) {
  return `
        ${_railPanelKPIs6(balance, weekly, openCount)}
        ${_railPanelRank6(rankIdx, weekly, dropThr, gainThr)}
        ${_railPanelStreaks6(attr, naAttr, person)}
        ${_railPanelNextUp(nextItem, fillPct)}`;
}
function _railPanel6(label, contentHTML) {
  return `
        <div class="fh-dbz-rpanel">
            <div class="fh-dbz-rpanel-hdr">${label}</div>
            <div class="fh-dbz-rpanel-body">${contentHTML}</div>
        </div>`;
}
function _railPanelKPIs6(balance, weekly, openCount) {
  const cell = (label, val, unit) => `
        <div class="fh-dbz-rkpi">
            <div class="fh-dbz-rkpi-lbl">${label}</div>
            <div class="fh-dbz-rkpi-val-row">
                <span class="fh-dbz-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-dbz-rkpi-unit">${unit}</span>` : ""}
            </div>
        </div>`;
  const body = `
        <div class="fh-dbz-rkpi-row">
            ${cell("POWER", fPts(balance), "\u26A1")}
            ${cell("WEEK", `+${weekly}`, "\u26A1")}
            ${cell("OPEN", openCount, "")}
        </div>`;
  return _railPanel6("POWER LEVEL", body);
}
function _railPanelRank6(rankIdx, weekly, dropThr, gainThr) {
  const bar = htmlRankBar(rankIdx, weekly, dropThr, gainThr, DBZ_RANKS, DBZ.orange);
  if (!bar) {
    return _railPanel6(
      "NEXT FORM",
      `<div class="fh-dbz-rmax">${escHTML(getEffectiveRank(rankIdx, DBZ_RANKS).name)} \xB7 MAX</div>`
    );
  }
  return _railPanel6("NEXT FORM", bar);
}
function _railPanelStreaks6(attr, naAttr, person) {
  const active = getActiveStreaks(attr, naAttr, person, 8);
  if (!active.length) {
    return _railPanel6(
      "CHARGE STREAKS",
      `<div class="fh-dbz-rempty">NO CHARGE YET \u2014 TRAIN UP!</div>`
    );
  }
  const rows = active.map((t) => {
    const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
    const bolts = Array.from(
      { length: goalSegs },
      (_, i) => `<span class="fh-dbz-rbolt${i < filledN ? "" : " dim"}">\u26A1</span>`
    ).join("");
    const bonusChip = t.milestone > 0 && t.bonus > 0 ? `<span class="fh-dbz-rbonus">\u2605+${t.bonus}</span>` : "";
    return `
            <div class="fh-dbz-rstreak">
                <div class="fh-dbz-rstreak-head">
                    <span class="fh-dbz-rstreak-name">${escHTML(t.name)}</span>
                    ${bonusChip}
                </div>
                <div class="fh-dbz-rstreak-bar">
                    <span class="fh-dbz-rbolts">${bolts}</span>
                    <span class="fh-dbz-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
  }).join("");
  return _railPanel6("CHARGE STREAKS", rows);
}
function _railPanelNextUp(nextItem, fillPct) {
  if (!nextItem) {
    return _railPanel6(
      "NEXT POWER-UP",
      `<div class="fh-dbz-rempty">SHOP STOCKED \u2014 ASK A PARENT</div>`
    );
  }
  const body = `
        <div class="fh-dbz-rnext-name">${escHTML(nextItem.name)}</div>
        <div class="fh-dbz-rnext-cost">${fPts(nextItem.points_cost)}\u26A1</div>
        <div class="fh-dbz-next-bar-track"><div class="fh-dbz-next-bar-fill" style="width:${fillPct}%"></div></div>`;
  return _railPanel6("NEXT POWER-UP", body);
}
function _missions(attr, person, naAttr, card) {
  const rawDue = attr.tasks_due_today_list || [];
  const rawOverdue = attr.tasks_overdue_list || [];
  const pending = attr.tasks_pending_approval_list || [];
  const catOrder = naAttr.category_labels || [];
  const collapseByChore = (rows, pickFn) => {
    const seen = /* @__PURE__ */ new Map();
    for (const t of rows) {
      if (!seen.has(t.chore_id) || pickFn(t, seen.get(t.chore_id))) seen.set(t.chore_id, t);
    }
    return [...seen.values()];
  };
  const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
  const due = collapseByChore(rawDue.filter((t) => t.chore_type !== "reminder"), () => false);
  const all = [...overdue.map((t) => ({ ...t, _over: true })), ...due];
  if (!all.length && !pending.length) {
    return `
            <div class="fh-dbz-all-done">
                <div class="fh-dbz-all-done-icon">\u2B50</div>
                <div class="fh-dbz-all-done-text">ALL DONE!</div>
            </div>`;
  }
  const groups = groupByCategory(all, catOrder);
  const groupHtml = groups.map((group) => {
    const hdr = `<div class="fh-row-section-hdr">${escHTML(group.label)}</div>`;
    const rows = group.tasks.map((t) => htmlChoreRow(t, dbzRowConfig, person, card)).join("");
    return hdr + rows;
  }).join("");
  const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">WAITING FOR APPROVAL</div>
        ${pending.map((t) => htmlChoreRow(t, dbzRowConfig, person, card)).join("")}` : "";
  return `
        <div class="fh-row-list">
            ${groupHtml}
            ${pendingSection}
        </div>`;
}
function _powerUps(attr, person, balance, card) {
  const items = attr.store_items || [];
  if (!items.length) {
    return `<div class="fh-dbz-empty">No power-ups available yet!</div>`;
  }
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const personPending = (naAttr.redemption_queue || []).filter((r) => r.person_id === person.person_id);
  const pendingByItemId = new Set(personPending.map((r) => r.item_id).filter(Boolean));
  const pendingByName = new Set(personPending.filter((r) => !r.item_id).map((r) => r.item_name));
  return `
        <div class="fh-dbz-powerup-list">
            ${items.map((item) => {
    const can = balance >= item.points_cost;
    const requested = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
    return `
                <div class="fh-dbz-powerup-row ${!can ? "locked" : ""}">
                    <div class="fh-dbz-powerup-body">
                        <div class="fh-dbz-powerup-name">${escHTML(item.name)}</div>
                        <div class="fh-dbz-powerup-cost">${fPts(item.points_cost)}\u26A1</div>
                    </div>
                    ${requested ? `<span style="color:${DBZ.orange};font-weight:800;font-size:.9rem">SENT \u2713</span>` : `<button class="fh-dbz-go-btn ${can ? "" : "locked"}"
                                   data-act="redeem" data-iid="${escAttr(item.item_id)}" data-pid="${escAttr(person.person_id)}"
                                   ${!can ? 'disabled style="opacity:.35;cursor:not-allowed"' : ""}>
                               ${can ? "GET!" : "NEED \u26A1"}
                           </button>`}
                </div>`;
  }).join("")}
        </div>`;
}
function _battleLog(person, card) {
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const entries = (naAttr.history_log || []).filter((e) => e.person_id === person.person_id);
  if (!entries.length) {
    return `<div class="fh-dbz-empty">No battles recorded yet!</div>`;
  }
  const grouped = groupHistorySkipped(entries);
  return `
        <div class="fh-dbz-log">
            ${grouped.slice(0, 12).map(
    (item) => item.isGroup ? _dbzSkippedGroup(item, card) : _dbzLogRow(item.entry)
  ).join("")}
        </div>`;
}
function _dbzLogRow(e) {
  const meta = HISTORY_META[e.type] || { label: e.type, color: DBZ.mute };
  const pts = e.points_delta ? `<span style="color:${e.points_delta > 0 ? DBZ.orange : DBZ.red};font-weight:800">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}\u26A1
           </span>` : "";
  return `
        <div class="fh-dbz-log-row">
            <div class="fh-dbz-log-type" style="color:${meta.color}">${escHTML(meta.label)}</div>
            <div class="fh-dbz-log-name">${escHTML(e.chore_name || e.note || "\u2014")}</div>
            ${pts}
        </div>`;
}
function _dbzSkippedGroup(group, card) {
  const expanded = card._expandedSkippedDates.has(group.key);
  const pen = group.totalPenalty > 0 ? `\u2212${group.totalPenalty}\u26A1` : "ok";
  return `
        <div class="fh-dbz-log-row"
             data-act="toggle-skipped-group" data-key="${escAttr(group.key)}" style="cursor:pointer">
            <div class="fh-dbz-log-type" style="color:${DBZ.red}">MISSED</div>
            <div class="fh-dbz-log-name">${escHTML(group.dateDisplay)} \xB7 ${pen}</div>
            <span style="color:${DBZ.mute};font-size:.75rem">${expanded ? "\u25B2" : "\u25BC"}</span>
        </div>
        ${expanded ? group.items.map((e) => `
            <div class="fh-dbz-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-dbz-log-type" style="color:${DBZ.mute}">Item</div>
                <div class="fh-dbz-log-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta ? `<span style="color:${DBZ.red};font-weight:800">${e.points_delta}\u26A1</span>` : ""}
            </div>`).join("") : ""}`;
}
var DBZ, dbzRowConfig, DBZ_RANKS, dbzTheme;
var init_dbz = __esm({
  "src/card/themes/dbz.js"() {
    init_utils();
    init_constants();
    init_shared();
    DBZ = {
      sky: "#3FAAD9",
      orange: "#FF6A1A",
      yellow: "#FFE03A",
      navy: "#0F1E2E",
      white: "#FFFFFF",
      mute: "rgba(15,30,46,.6)",
      red: "#CC2200"
    };
    dbzRowConfig = {
      themeKey: "dbz",
      btnLabel: "GO!",
      btnPendingLabel: "PENDING",
      reminderBtnLabel: "OK",
      streakIcon: "\u26A1",
      statusFormat: {
        breach: (t) => `!OVERDUE ${t.days_overdue}D`,
        resetSoon: () => "RESETS 1D",
        firing: (t) => `\u2212${t.penalty_points}\u26A1/D`,
        expiry: (d) => d <= 0 ? "EXPIRES TODAY" : `EXPIRES ${d}D`
      },
      iconColor: (t, isOverdue) => isOverdue ? DBZ.red : DBZ.navy
    };
    DBZ_RANKS = [
      { minXP: 0, name: "Saibaman" },
      { minXP: 100, name: "Saiyan Trainee" },
      { minXP: 250, name: "Saiyan" },
      { minXP: 500, name: "Super Saiyan" },
      { minXP: 1e3, name: "SSJ2" },
      { minXP: 2e3, name: "SSJ3" },
      { minXP: 4e3, name: "SSJ Blue" }
    ];
    dbzTheme = {
      key: "dbz",
      tint: "#3FAAD9",
      sigil: "\u25CE",
      ranks: DBZ_RANKS,
      handlesNavigation: false,
      rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, DBZ_RANKS).name;
      },
      homeTileSubLabel() {
        return "SAIYAN WARRIOR";
      },
      render(card, person) {
        var _a;
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid = card._personEntityId(person.name);
        const attr = card._attrs(eid);
        const naAttr = card._attrs("sensor.family_hub_needs_attention");
        const balance = parseInt(((_a = card._states(eid)) == null ? void 0 : _a.state) || "0");
        const rankIdx = person.rank_index !== void 0 ? person.rank_index : 0;
        const dropThr = person.rank_drop_threshold ?? naAttr.rank_drop_threshold ?? 50;
        const gainThr = person.rank_gain_threshold ?? naAttr.rank_gain_threshold ?? 75;
        const weekly = getWeeklyPts(person.person_id, naAttr.history_log);
        const rank = getEffectiveRank(rankIdx, DBZ_RANKS);
        const tabDefs = [
          { key: "tasks", label: "\u{1F4AA} TRAIN" },
          { key: "store", label: "\u{1F48E} SHOP" },
          { key: "history", label: "\u{1F3C6} WINS" }
        ];
        const activeTab = card._tab || "tasks";
        const tabBar = tabDefs.map((t) => `
            <div class="fh-dbz-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}</div>`).join("");
        let content = "";
        if (activeTab === "tasks") content = _missions(attr, person, naAttr, card);
        if (activeTab === "store") content = _powerUps(attr, person, balance, card);
        if (activeTab === "history") content = _battleLog(person, card);
        const openCount = (attr.tasks_due_today_list || []).filter((t) => t.status === "pending").length;
        const storeItems = attr.store_items || [];
        const nextItem = storeItems.find((i) => i.points_cost > balance) || storeItems[0] || null;
        const fillPct = nextItem ? Math.min(100, Math.round(balance / nextItem.points_cost * 100)) : 100;
        const showRail = activeTab === "tasks";
        const railHTML = showRail ? _railPanels6({
          attr,
          naAttr,
          person,
          balance,
          weekly,
          openCount,
          rankIdx,
          dropThr,
          gainThr,
          nextItem,
          fillPct
        }) : "";
        return `
            <div class="fh-dbz-page${kidLarge}">
                <div class="fh-dbz-speedlines"></div>
                <div class="fh-dbz-halftone"></div>

                <div class="fh-dbz-header">
                    <div class="fh-dbz-avatar">${ini(person.name)}</div>
                    <div class="fh-dbz-identity">
                        <div class="fh-dbz-codename">SAIYAN TRAINEE \xB7 CODENAME KAMEHA</div>
                        <div class="fh-dbz-name">${escHTML(person.name).toUpperCase()}</div>
                    </div>
                    <div class="fh-dbz-power-badge">
                        <div class="fh-dbz-power-num">${fPts(balance)}</div>
                        <div class="fh-dbz-power-lbl">POWER</div>
                    </div>
                </div>

                <div class="fh-dbz-mission-strip">
                    <span class="fh-dbz-strip-label">ACTIVE MISSIONS:</span>
                    <span class="fh-dbz-strip-count">${openCount}</span>
                </div>

                <div class="fh-dbz-tabs">${tabBar}</div>

                <div class="fh-dbz-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-dbz-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-dbz-rail">${railHTML}</aside>` : ""}
                </div>

                ${showRail || !nextItem ? "" : `
                <div class="fh-dbz-next-bar">
                    <span style="font-size:1.6rem">\u{1F3AF}</span>
                    <div class="fh-dbz-next-bar-body">
                        <div class="fh-dbz-next-bar-lbl">NEXT POWER-UP</div>
                        <div class="fh-dbz-next-bar-name">${escHTML(nextItem.name)} \xB7 ${fPts(nextItem.points_cost)}\u26A1</div>
                        <div class="fh-dbz-next-bar-track"><div class="fh-dbz-next-bar-fill" style="width:${fillPct}%"></div></div>
                    </div>
                </div>`}
            </div>`;
      }
    };
  }
});

// src/card/themes/index.js
function getTheme(key) {
  return THEMES[key] || THEMES.classic;
}
var THEMES;
var init_themes = __esm({
  "src/card/themes/index.js"() {
    init_classic();
    init_engineer();
    init_baker();
    init_dinos();
    init_hp();
    init_dbz();
    THEMES = {
      classic: classicTheme,
      engineer: engineerTheme,
      baker: bakerTheme,
      dinos: dinosTheme,
      hp: hpTheme,
      dbz: dbzTheme
    };
  }
});

// src/card/modes-personal.js
function htmlPersonal(card) {
  const person = card._findPerson(card._viewPersonId || card._cfg.person);
  if (!person) {
    const name = card._viewPersonId || card._cfg.person || "(unknown)";
    return `<div class="fh-empty">Person "${name}" not found.<br>Check spelling in card config.</div>`;
  }
  return getTheme(person.theme_key || "classic").render(card, person);
}
var init_modes_personal = __esm({
  "src/card/modes-personal.js"() {
    init_themes();
  }
});

// src/card/modes-chores.js
function htmlChores(card) {
  const clAttr = card._attrs("sensor.family_hub_claimable_tasks");
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const people = card._people().filter((p) => p.active !== false);
  const liveTasks = clAttr.all_tasks || [];
  const claimable = clAttr.tasks || [];
  const approvalQ = naAttr.approval_queue || [];
  const orderedLabels = naAttr.category_labels || [];
  const globalPaused = !!naAttr.penalties_paused_global;
  const famName = naAttr.family_name || "Family Hub";
  if (!card._mcLastTasks) card._mcLastTasks = /* @__PURE__ */ new Map();
  const liveIds = new Set(liveTasks.map((t) => t.task_id));
  for (const t of liveTasks) card._mcLastTasks.set(t.task_id, t);
  const pendingSet = card._pendingSubmit || /* @__PURE__ */ new Set();
  const phantoms = [];
  for (const tid of pendingSet) {
    if (!liveIds.has(tid) && card._mcLastTasks.has(tid)) {
      phantoms.push({ ...card._mcLastTasks.get(tid), _phantom: true });
    }
  }
  const allTasks = [...liveTasks, ...phantoms];
  const peopleById = new Map(people.map((p) => [p.person_id, p]));
  const annotateTask = (t) => {
    const agent = peopleById.get(t.assigned_to);
    return {
      ...t,
      _agentColor: (agent == null ? void 0 : agent.avatar_color) || DEFAULT_COLOR,
      _agentCode: ((agent == null ? void 0 : agent.code) || (agent == null ? void 0 : agent.name) || "?").toUpperCase(),
      _agentName: (agent == null ? void 0 : agent.name) || "?",
      _agentPersonId: (agent == null ? void 0 : agent.person_id) || t.assigned_to
    };
  };
  const filtered = (card._filter ? allTasks.filter((t) => t.assigned_to === card._filter) : allTasks).map(annotateTask);
  const breachItems = filtered.filter((t) => t.days_delta < 0);
  const todayItems = filtered.filter((t) => t.days_delta >= 0);
  const breachGroups = _groupByChore(breachItems);
  const todayGroups = _groupByChore(todayItems);
  const missionCount = breachGroups.length + todayGroups.length;
  const alertCount = approvalQ.length;
  const opsDay = _opsDay();
  return `
        ${card._celebration ? _htmlCelebration(card._celebration) : ""}
        <div class="fh-mc">
            ${_htmlHeader(famName, missionCount, alertCount, opsDay, globalPaused)}
            <div class="fh-mc-body">
                <main class="fh-mc-main">
                    ${_htmlAgentRoster(people, allTasks, approvalQ, card)}
                    ${_htmlBreach(breachGroups, card)}
                    ${_htmlTodayGroups(todayGroups, orderedLabels, card)}
                    ${!breachGroups.length && !todayGroups.length ? `<div class="fh-mc-empty">
                               <div class="fh-mc-empty-title">\u2713 ALL MISSIONS COMPLETE</div>
                               <div class="fh-mc-empty-sub">HQ STANDING DOWN \xB7 NICE WORK</div>
                           </div>` : ""}
                </main>
                <aside class="fh-mc-sidebar">
                    ${_htmlIntelAlerts(approvalQ)}
                    ${_htmlOpenOps(claimable)}
                    ${_htmlStatusFooter(people, naAttr)}
                </aside>
            </div>
        </div>
    `;
}
function _groupByChore(tasks) {
  const byChore = /* @__PURE__ */ new Map();
  for (const t of tasks) {
    const key = t.chore_id || t.task_id;
    if (!byChore.has(key)) {
      byChore.set(key, {
        chore_id: t.chore_id,
        name: t.name,
        icon: t.icon,
        description: t.description,
        category_label: t.category_label,
        points: t.points,
        penalty_enabled: t.penalty_enabled,
        penalty_points: t.penalty_points,
        daily_penalty_firing: t.daily_penalty_firing,
        days_until_reset: t.days_until_reset,
        recurrence_type: t.recurrence_type,
        anyBreach: false,
        maxOverdue: 0,
        assignees: []
      });
    }
    const group = byChore.get(key);
    const isOver = t.days_delta < 0;
    if (isOver) {
      group.anyBreach = true;
      group.maxOverdue = Math.max(group.maxOverdue, Math.abs(t.days_delta));
    }
    if (t.daily_penalty_firing) group.daily_penalty_firing = true;
    group.assignees.push({
      person_id: t._agentPersonId,
      task_id: t.task_id,
      color: t._agentColor,
      code: t._agentCode,
      name: t._agentName,
      streak: t.streak || 0,
      milestone: t.streak_milestone || 0,
      status: t.status,
      days_overdue: isOver ? Math.abs(t.days_delta) : 0,
      isBreach: isOver,
      isPhantom: !!t._phantom
    });
  }
  return [...byChore.values()];
}
function _opsDay() {
  const anchor = new Date(2025, 8, 1);
  return Math.max(1, Math.floor((Date.now() - anchor.getTime()) / 864e5));
}
function _htmlHeader(famName, missionCount, alertCount, opsDay, globalPaused) {
  const now = /* @__PURE__ */ new Date();
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).toUpperCase();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  return `
        <header class="fh-mc-header">
            <div class="fh-mc-brand">
                <div class="fh-mc-logo">FH</div>
                <div class="fh-mc-wordmark">
                    <div class="fh-mc-wordmark-name">${escHTML(famName).toUpperCase()}</div>
                    <div class="fh-mc-wordmark-tag">OPERATIONS \xB7 COMMAND</div>
                </div>
            </div>
            ${globalPaused ? `<div class="fh-mc-ops-paused">OPS PAUSED</div>` : ""}
            <div class="fh-mc-stats">
                ${_htmlStat("MISSIONS LIVE", missionCount, "cyan")}
                ${_htmlStat("INTEL ALERTS", alertCount, alertCount > 0 ? "red" : "green", alertCount > 0)}
                ${_htmlStat("OPS DAY", opsDay, "gold")}
                <div class="fh-mc-clock">
                    <div class="fh-mc-stat-lbl">${date}</div>
                    <div class="fh-mc-clock-num">${time}</div>
                </div>
            </div>
        </header>
    `;
}
function _htmlStat(label, value, accent, pulse = false) {
  return `
        <div class="fh-mc-stat" data-accent="${accent}">
            <div class="fh-mc-stat-lbl">${label}</div>
            <div class="fh-mc-stat-val">
                ${pulse ? `<span class="fh-mc-pulse"></span>` : ""}
                <span class="fh-mc-stat-num">${value}</span>
            </div>
        </div>
    `;
}
function _htmlAgentRoster(people, allTasks, approvalQ, card) {
  if (!people.length) return "";
  const cards = people.map((p) => {
    var _a;
    const color = p.avatar_color || DEFAULT_COLOR;
    const active = card._filter === p.person_id;
    const dim = card._filter && !active;
    const missions = allTasks.filter((t) => t.assigned_to === p.person_id).length;
    const alerts = approvalQ.filter((a) => a.person_id === p.person_id).length;
    const code = (p.code || p.name || "AGT").toUpperCase();
    const balance = parseInt(((_a = card._states(card._personEntityId(p.name))) == null ? void 0 : _a.state) || "0");
    return `
            <button class="fh-mc-agent ${active ? "active" : ""} ${dim ? "dim" : ""}"
                    style="--agent-color:${color}"
                    data-act="filter" data-pid="${escAttr(p.person_id)}">
                <div class="fh-mc-agent-head">
                    <div class="fh-mc-agent-avatar">
                        ${ini(p.name)}
                        ${alerts > 0 ? `<span class="fh-mc-agent-alert">${alerts}</span>` : ""}
                    </div>
                    <div class="fh-mc-agent-id">
                        <div class="fh-mc-agent-code">${escHTML(code)}</div>
                        <div class="fh-mc-agent-name">${escHTML(p.name)}</div>
                    </div>
                </div>
                <div class="fh-mc-agent-foot">
                    <span class="fh-mc-agent-bal">${fPts(balance)}<span class="fh-mc-agent-lbl">pts</span></span>
                    <span class="fh-mc-agent-open ${missions > 0 ? "live" : ""}">${missions} OPEN</span>
                </div>
            </button>
        `;
  }).join("");
  return `
        <section class="fh-mc-panel">
            <div class="fh-mc-panel-hdr">
                <span class="fh-mc-panel-lbl">// AGENT ROSTER</span>
                <span class="fh-mc-panel-sub">${people.length} ON DUTY</span>
            </div>
            <div class="fh-mc-roster">${cards}</div>
        </section>
    `;
}
function _htmlBreach(breachGroups, card) {
  if (!breachGroups.length) return "";
  return `
        <section class="fh-mc-missions">
            ${_sectionHeader(
    "BREACH ALERT",
    `${breachGroups.length} CHORE${breachGroups.length > 1 ? "S" : ""} PAST RESET`,
    "red",
    true
  )}
            <div class="fh-row-list">
                ${breachGroups.map((g) => _htmlGroupedRow(g, card)).join("")}
            </div>
        </section>
    `;
}
function _htmlTodayGroups(todayGroups, orderedLabels, card) {
  if (!todayGroups.length) return "";
  const labelIndex = new Map(orderedLabels.map((l, i) => [l, i]));
  const byCategory = /* @__PURE__ */ new Map();
  for (const g of todayGroups) {
    const key = g.category_label || "";
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(g);
  }
  const sortedKeys = [...byCategory.keys()].sort((a, b) => {
    if (a === "" && b !== "") return 1;
    if (a !== "" && b === "") return -1;
    const ai = labelIndex.has(a) ? labelIndex.get(a) : Infinity;
    const bi = labelIndex.has(b) ? labelIndex.get(b) : Infinity;
    return ai !== bi ? ai - bi : a.localeCompare(b);
  });
  return sortedKeys.map((label) => {
    const groups = byCategory.get(label) || [];
    const hdr = label ? _sectionHeader(label.toUpperCase(), `${groups.length} ACTIVE`, "gold") : "";
    return `
            <section class="fh-mc-missions">
                ${hdr}
                <div class="fh-row-list">
                    ${groups.map((g) => _htmlGroupedRow(g, card)).join("")}
                </div>
            </section>
        `;
  }).join("");
}
function _htmlGroupedRow(g, card) {
  var _a;
  const opId = String(g.chore_id || "").slice(0, 4).toUpperCase();
  let statusChip = "";
  if (g.anyBreach) {
    statusChip = `<span class="fh-row-chip fh-row-chip--breach">BREACH \xB7 ${g.maxOverdue}D</span>`;
  } else if (g.days_until_reset === 1) {
    statusChip = `<span class="fh-row-chip fh-row-chip--reset">RESETS 1D</span>`;
  }
  if (g.daily_penalty_firing) {
    statusChip += `<span class="fh-row-chip fh-row-chip--firing">ACCRUING \u2212${g.penalty_points}/D</span>`;
  }
  const chipsHtml = statusChip ? `<div class="fh-row-chips">${statusChip}</div>` : `<div class="fh-row-chips"></div>`;
  const descLine = g.description ? `<div class="fh-row-desc">${escHTML(g.description)}</div>` : "";
  const penaltyLine = g.penalty_enabled && g.penalty_points > 0 ? `<div class="fh-row-penalty">\u2212${g.penalty_points}pts if skipped</div>` : "";
  const buttons = g.assignees.map((a) => {
    var _a2;
    const pending = ((_a2 = card._pendingSubmit) == null ? void 0 : _a2.has(a.task_id)) || a.status === "pending_approval" || a.isPhantom;
    const cls = ["fh-mc-go-mini"];
    if (a.isBreach) cls.push("breach");
    if (pending) cls.push("pending");
    if (pending) {
      return `
                <div class="${cls.join(" ")}"
                     style="--mc-accent:${a.color}"
                     aria-disabled="true"
                     title="Pending approval \u2014 ${escAttr(a.name)}">
                    <span class="fh-mc-go-code">${escHTML(a.code)}</span>
                    <span class="fh-mc-go-check">\u23F1</span>
                </div>`;
    }
    return `
            <button class="${cls.join(" ")}"
                    style="--mc-accent:${a.color}"
                    data-act="complete"
                    data-tid="${escAttr(a.task_id)}"
                    data-pid="${escAttr(a.person_id)}"
                    data-streak="${a.streak}"
                    data-milestone="${a.milestone}"
                    data-name="${escAttr(g.name)}"
                    title="GO \u2014 ${escAttr(a.name)}">
                <span class="fh-mc-go-code">${escHTML(a.code)}</span>
                <span class="fh-mc-go-check">\u2713</span>
            </button>`;
  }).join("");
  const accentColor = ((_a = g.assignees[0]) == null ? void 0 : _a.color) || DEFAULT_COLOR;
  const flashClass = g.assignees.some((a) => {
    var _a2;
    return (_a2 = card._flashing) == null ? void 0 : _a2.has(a.task_id);
  }) ? " flash" : "";
  return `
        <div class="fh-row fh-row--mc${flashClass}${g.anyBreach ? " overdue" : ""}"
             style="--mc-accent:${accentColor}">
            <div class="fh-row-icon">${choreIcon(g.icon || "", accentColor)}</div>
            <div class="fh-row-body">
                <div class="fh-row-kicker">OP-${opId}</div>
                <div class="fh-row-name">${escHTML(g.name)}</div>
                ${descLine}
                ${penaltyLine}
            </div>
            ${chipsHtml}
            <div class="fh-row-pts">+${g.points || 0}</div>
            <div class="fh-mc-go-group">${buttons}</div>
        </div>
    `;
}
function _sectionHeader(label, sub, accent, pulse = false) {
  return `
        <div class="fh-mc-section-hdr" data-accent="${accent}">
            ${pulse ? `<span class="fh-mc-pulse"></span>` : ""}
            <span class="fh-mc-section-lbl">// ${escHTML(label)}</span>
            <span class="fh-mc-section-rule"></span>
            ${sub ? `<span class="fh-mc-section-sub">${escHTML(sub)}</span>` : ""}
        </div>
    `;
}
function _htmlIntelAlerts(approvalQ) {
  if (!approvalQ.length) {
    return `
            <section class="fh-mc-panel fh-mc-panel--quiet">
                <div class="fh-mc-panel-hdr">
                    <span class="fh-mc-panel-lbl" data-accent="green">// INTEL ALERTS</span>
                    <span class="fh-mc-panel-sub">ALL CLEAR</span>
                </div>
            </section>
        `;
  }
  const rows = approvalQ.map((a) => {
    const color = a.person_color || DEFAULT_COLOR;
    const code = (a.person_code || a.person_name || "?").slice(0, 6).toUpperCase();
    return `
            <div class="fh-mc-intel-row" style="--mc-accent:${color}">
                <div class="fh-mc-intel-avatar">${ini(a.person_name || "?")}</div>
                <div class="fh-mc-intel-body">
                    <div class="fh-mc-intel-code">${escHTML(code)}</div>
                    <div class="fh-mc-intel-name">${escHTML(a.chore_name || "Task")}</div>
                    <div class="fh-mc-intel-meta">+${a.points || 0}pts</div>
                </div>
                <div class="fh-mc-intel-status">REVIEW</div>
            </div>
        `;
  }).join("");
  return `
        <section class="fh-mc-panel">
            <div class="fh-mc-panel-hdr">
                <span class="fh-mc-panel-lbl" data-accent="red">// INTEL ALERTS</span>
                <span class="fh-mc-panel-sub">${approvalQ.length} AWAITING REVIEW</span>
            </div>
            <div class="fh-mc-intel-list">${rows}</div>
            <div class="fh-mc-intel-note">REVIEW IN ADMIN PANEL</div>
        </section>
    `;
}
function _htmlOpenOps(claimable) {
  if (!claimable.length) {
    return `
            <section class="fh-mc-panel fh-mc-panel--quiet">
                <div class="fh-mc-panel-hdr">
                    <span class="fh-mc-panel-lbl" data-accent="cyan">// OPEN OPS</span>
                    <span class="fh-mc-panel-sub">NONE LISTED</span>
                </div>
            </section>
        `;
  }
  const rows = claimable.map((t) => {
    const op = String(t.chore_id || t.task_id || "").slice(0, 4).toUpperCase();
    const kind = t.claim_mode === "multi_claim" ? "MULTI" : "FCFS";
    return `
            <div class="fh-mc-ops-row">
                <div class="fh-mc-ops-kicker">${kind} \xB7 OP-${op}</div>
                <div class="fh-mc-ops-icon">${choreIcon(t.icon || "", "var(--mc-cyan)", "22px")}</div>
                <div class="fh-mc-ops-body">
                    <div class="fh-mc-ops-name">${escHTML(t.name)}</div>
                    ${t.category_label ? `<div class="fh-mc-ops-cat">${escHTML(t.category_label)}</div>` : ""}
                </div>
                <div class="fh-mc-ops-pts">+${t.points || 0}</div>
                <button class="fh-mc-ops-claim"
                        data-act="open-claim"
                        data-tid="${escAttr(t.task_id)}"
                        data-name="${escAttr(t.name)}">CLAIM</button>
            </div>
        `;
  }).join("");
  return `
        <section class="fh-mc-panel">
            <div class="fh-mc-panel-hdr">
                <span class="fh-mc-panel-lbl" data-accent="cyan">// OPEN OPS</span>
                <span class="fh-mc-panel-sub">UNCLAIMED \xB7 FIRST IN WINS</span>
            </div>
            <div class="fh-mc-ops-list">${rows}</div>
        </section>
    `;
}
function _htmlStatusFooter(people, naAttr) {
  const now = /* @__PURE__ */ new Date();
  const sync = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const familyPts = people.reduce((sum, p) => {
    const v = parseInt(p.lifetime_points || 0);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);
  const storeCount = (naAttr.store_items || []).length;
  return `
        <div class="fh-mc-status">
            <div class="fh-mc-status-row"><span class="fh-mc-status-dot ok"></span>LINK \xB7 STABLE</div>
            <div class="fh-mc-status-row">SYNC \xB7 ${sync}</div>
            <div class="fh-mc-status-row">FAMILY \xB7 ${people.length} AGENTS \xB7 ${fPts(familyPts)}PTS</div>
            <div class="fh-mc-status-row">STORE \xB7 ${storeCount} REWARDS LIVE</div>
        </div>
    `;
}
function _htmlCelebration(cel) {
  return `
        <div class="fh-celebration-overlay" data-act="dismiss-celebration">
            <div class="fh-celebration-badge">
                <div class="fh-celebration-star">\u2605</div>
                <div class="fh-celebration-title">MILESTONE!</div>
                <div class="fh-celebration-streak">\u25B2 ${cel.streak}</div>
                <div class="fh-celebration-name">${escHTML(cel.name)}</div>
            </div>
        </div>
    `;
}
var init_modes_chores = __esm({
  "src/card/modes-chores.js"() {
    init_icons();
    init_utils();
    init_constants();
  }
});

// src/card/rooms/maintenance.js
function renderMaintenance(card) {
  const attr = card._attrs("sensor.family_hub_maintenance_due");
  const overdue = attr.overdue || [];
  const thisWeek = attr.due_this_week || [];
  const nextWeek = attr.due_next_week || [];
  const items = attr.items || [];
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
                <div class="fh-maint-empty-icon">\u{1F3E0}</div>
                <div class="fh-maint-empty-text">All caught up!</div>
                <div class="fh-maint-empty-sub">Nothing due in the next 14 days.</div>
            </div>`;
  }
  const statStrip = `
        <div class="fh-maint-stat-strip">
            <div class="fh-maint-stat ${overdue.length ? "fh-maint-stat--bad" : ""}">
                <span class="fh-maint-stat-num">${overdue.length}</span>
                <span class="fh-maint-stat-lbl">overdue</span>
            </div>
            <div class="fh-maint-stat-div"></div>
            <div class="fh-maint-stat">
                <span class="fh-maint-stat-num">${thisWeek.length}</span>
                <span class="fh-maint-stat-lbl">this week</span>
            </div>
            <div class="fh-maint-stat-div"></div>
            <div class="fh-maint-stat">
                <span class="fh-maint-stat-num">${nextWeek.length}</span>
                <span class="fh-maint-stat-lbl">next week</span>
            </div>
        </div>`;
  const sections = [
    { label: "OVERDUE", items: overdue, cls: "overdue" },
    { label: "DUE THIS WEEK", items: thisWeek, cls: "this-week" },
    { label: "DUE NEXT WEEK", items: nextWeek, cls: "next-week" }
  ].filter((s) => s.items.length);
  const sectionsHtml = sections.map(
    ({ label, items: group, cls }) => `
        <div class="fh-maint-section">
            <div class="fh-maint-section-hdr ${cls}">
                ${label}
                <span class="fh-maint-section-count">${group.length}</span>
            </div>
            ${group.map((item) => _itemRow(item, card)).join("")}
        </div>`
  ).join("");
  return header + statStrip + sectionsHtml;
}
function _itemRow(item, card) {
  const descExpanded = card._expandedDescs.has(item.task_id);
  const cls = item.days_delta < 0 ? "overdue" : item.days_delta <= 7 ? "soon" : "ok";
  return `
        <div class="fh-maint-row ${cls}">
            ${item.person_name ? `<div class="fh-avatar" style="background:${item.person_color || DEFAULT_COLOR};width:26px;height:26px;font-size:.72rem;flex-shrink:0">${ini(item.person_name)}</div>` : ""}
            <div class="fh-maint-row-body">
                <div class="fh-maint-row-name">${escHTML(item.name)}</div>
                ${descExpanded && item.description ? `<div class="fh-maint-row-desc">${escHTML(item.description)}</div>` : ""}
            </div>
            ${item.description ? `<button class="fh-desc-btn" data-act="toggle-desc" data-id="${item.task_id}" title="Toggle description">?</button>` : ""}
            <span class="fh-maint-days-badge ${cls}">${daysLabel(item.days_delta)}</span>
        </div>`;
}
var init_maintenance = __esm({
  "src/card/rooms/maintenance.js"() {
    init_utils();
    init_constants();
  }
});

// src/card/rooms/smarthome.js
function renderSmartHome(_card) {
  return `
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#30d158">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#30d158">SMART HOME</div>
            <div class="fh-home-coming-sub">Lights, climate &amp; more</div>
            <div class="fh-room-feature-list">
                ${_feat("\u{1F4A1}", "Lighting Control", "Toggle and dim lights by room from the kitchen display")}
                ${_feat("\u{1F321}\uFE0F", "Climate", "View and adjust the thermostat without leaving the kitchen")}
                ${_feat("\u{1F4A7}", "Irrigation", "Run or skip watering zones on demand")}
                ${_feat("\u{1F512}", "Kid-safe Access", "Only controls approved for the kitchen display are shown")}
            </div>
            <div class="fh-home-coming-badge">COMING IN v0.9.0</div>
        </div>`;
}
function _feat(icon, name, desc) {
  return `
        <div class="fh-room-feature">
            <div class="fh-room-feature-icon">${icon}</div>
            <div class="fh-room-feature-body">
                <div class="fh-room-feature-name">${name}</div>
                <div class="fh-room-feature-desc">${desc}</div>
            </div>
        </div>`;
}
var init_smarthome = __esm({
  "src/card/rooms/smarthome.js"() {
  }
});

// src/card/rooms/meals.js
function renderMeals(_card) {
  return `
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#ff9f0a">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05M1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-1.46-.74-2.87-2.22-4.28-1.13-1.07-2.84-1.93-4.43-2.43-.25-.08-.5-.12-.76-.12H8.5c-.25 0-.5.04-.76.12-1.59.5-3.3 1.36-4.43 2.43C1.83 13.13 1 14.54 1 16h15.03z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#ff9f0a">MEALS</div>
            <div class="fh-home-coming-sub">Weekly menu &amp; grocery list</div>
            <div class="fh-room-feature-list">
                ${_feat2("\u{1F37D}\uFE0F", "Tonight's Dinner", "See what's on the menu right on the home strip")}
                ${_feat2("\u{1F4C5}", "Weekly Menu", "Plan meals for the whole week in one place")}
                ${_feat2("\u{1F6D2}", "Grocery List", "Items needed auto-populate from the week's plan")}
                ${_feat2("\u{1F468}\u200D\u{1F373}", "Recipes &amp; Notes", "Tap a meal to see the recipe or prep notes")}
            </div>
            <div class="fh-home-coming-badge">COMING IN v0.7.0</div>
        </div>`;
}
function _feat2(icon, name, desc) {
  return `
        <div class="fh-room-feature">
            <div class="fh-room-feature-icon">${icon}</div>
            <div class="fh-room-feature-body">
                <div class="fh-room-feature-name">${name}</div>
                <div class="fh-room-feature-desc">${desc}</div>
            </div>
        </div>`;
}
var init_meals = __esm({
  "src/card/rooms/meals.js"() {
  }
});

// src/card/rooms/calendar.js
function renderCalendar(_card) {
  return `
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#64d2ff">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#64d2ff">CALENDAR</div>
            <div class="fh-home-coming-sub">Today's schedule</div>
            <div class="fh-room-feature-list">
                ${_feat3("\u{1F4C5}", "Today at a Glance", "Morning-to-evening schedule on the home strip")}
                ${_feat3("\u{1F514}", "Chore Reminders", "Chore windows tied to events \u2014 'before school', 'after dinner'")}
                ${_feat3("\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}", "Family View", "Everyone's events in one scrollable view")}
                ${_feat3("\u{1F517}", "Any HA Calendar", "Connects to Local Calendar, CalDAV, or Google via Home Assistant")}
            </div>
            <div class="fh-home-coming-badge">COMING IN v0.8.0 \xB7 POWERS THE TODAY STRIP</div>
        </div>`;
}
function _feat3(icon, name, desc) {
  return `
        <div class="fh-room-feature">
            <div class="fh-room-feature-icon">${icon}</div>
            <div class="fh-room-feature-body">
                <div class="fh-room-feature-name">${name}</div>
                <div class="fh-room-feature-desc">${desc}</div>
            </div>
        </div>`;
}
var init_calendar = __esm({
  "src/card/rooms/calendar.js"() {
  }
});

// src/card/rooms/index.js
function getRoomById(id) {
  return ROOMS.find((r) => r.id === id) || null;
}
var ROOMS;
var init_rooms = __esm({
  "src/card/rooms/index.js"() {
    init_modes_chores();
    init_maintenance();
    init_smarthome();
    init_meals();
    init_calendar();
    ROOMS = [
      {
        id: "chores",
        label: "CHORES HQ",
        sub: "Mission Control",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
        accent: "var(--fh-accent)",
        status: "live",
        render: (card) => htmlChores(card),
        getStats(card) {
          const allTasks = card._attrs("sensor.family_hub_claimable_tasks").all_tasks || [];
          const pending = allTasks.filter((t) => t.status === "pending").length;
          const approval = (card._attrs("sensor.family_hub_needs_attention").approval_queue || []).length;
          const stats = [{ label: "due today", value: pending }];
          if (approval > 0) stats.push({ label: "need approval", value: approval, accent: "var(--fh-warning)" });
          return stats;
        }
      },
      {
        id: "maintenance",
        label: "HOME CARE",
        sub: "Maintenance Tracker",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.78 15.3 19.78 21.3 21.89 19.14 15.89 13.14 13.78 15.3M17.5 10.1c-.39 0-.81-.05-1.14-.19L4.97 21.25 2.86 19.14l7.41-7.4-1.77-1.78-.72.7-1.45-1.41V12.1L5.62 12.82 2.08 9.28l.71-.72H5.62L4.18 7.11 7.78 3.5c.98-1 2.69-1 3.69 0L9.36 5.61l1.42 1.44-.72.71 1.77 1.78 2.37-2.38c-.14-.33-.2-.75-.2-1.16C14 3.79 15.79 2 18 2c.68 0 1.32.19 1.86.5L17.5 4.86l1.64 1.64L21.5 4.14C21.81 4.68 22 5.32 22 6c0 2.21-1.79 4-4 4-.18 0-.34-.03-.5-.05v.15z"/></svg>`,
        accent: "#ff9f0a",
        status: "live",
        render: (card) => renderMaintenance(card),
        getStats(card) {
          const attr = card._attrs("sensor.family_hub_maintenance_due");
          const overdue = (attr.overdue || []).length;
          const soon = (attr.due_this_week || []).length;
          const stats = [];
          if (overdue > 0) stats.push({ label: "overdue", value: overdue, accent: "var(--fh-overdue)" });
          stats.push({ label: "due this week", value: soon });
          return stats;
        }
      },
      {
        id: "meals",
        label: "MEALS",
        sub: "Weekly menu & grocery list",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05M1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-1.46-.74-2.87-2.22-4.28-1.13-1.07-2.84-1.93-4.43-2.43-.25-.08-.5-.12-.76-.12H8.5c-.25 0-.5.04-.76.12-1.59.5-3.3 1.36-4.43 2.43C1.83 13.13 1 14.54 1 16h15.03z"/></svg>`,
        accent: "#ff9f0a",
        status: "coming",
        preview: "Plan the week's meals, build a grocery list, and see tonight's dinner at a glance.",
        render: (card) => renderMeals(card),
        getStats() {
          return [];
        }
      },
      {
        id: "smarthome",
        label: "SMART HOME",
        sub: "Lights, climate & more",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
        accent: "#30d158",
        status: "coming",
        preview: "Kid-safe controls for lights, thermostat, and irrigation \u2014 right from the kitchen.",
        render: (card) => renderSmartHome(card),
        getStats() {
          return [];
        }
      },
      {
        id: "calendar",
        label: "CALENDAR",
        sub: "Today's schedule",
        icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`,
        accent: "#64d2ff",
        status: "coming",
        preview: "See today's events, upcoming reminders, and schedule \u2014 powered by your HA calendars.",
        render: (card) => renderCalendar(card),
        getStats() {
          return [];
        }
      }
    ];
  }
});

// src/card/modals.js
function mWrap(title, body, okLabel, okAct, okClass = "fh-btn-primary") {
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
function mPointAdjust(m) {
  const isAward = m.type === "award";
  return mWrap(
    `${isAward ? "Award" : "Deduct"} points \u2014 ${m.data.pname}`,
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
function mAddTask(people) {
  return mWrap(
    "Add task",
    `<!-- Task type selector -->
       <div class="fh-field">
         <label class="fh-label">Task type</label>
         <select class="fh-select" id="m-tasktype">
           <option value="assigned">Assigned \u2014 give to specific people</option>
           <option value="claimable">Claimable \u2014 first come first served bonus</option>
           <option value="reminder">Reminder \u2014 no points, just a nudge</option>
         </select>
       </div>

       <!-- Name (all types) -->
       <div class="fh-field">
         <label class="fh-label">Task name *</label>
         <input class="fh-input" id="m-tname" type="text" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Description (optional)</label>
         <input class="fh-input" id="m-tdesc" type="text" placeholder="More detail\u2026">
       </div>

       <!-- Assigned section -->
       <div id="m-task-assigned-section">
         <div class="fh-field">
           <label class="fh-label">Assign to (select all that apply)</label>
           ${multiPersonCheckboxes(people, [], "m-tp-person")}
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
               ${people.map((p) => `<option value="${p.person_id}">${escHTML(p.name)}</option>`).join("")}
             </select>
           </div>
           <div class="fh-field">
             <label class="fh-label">Recurrence</label>
             <select class="fh-select" id="m-trrec">
               ${opts([
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "every_n_days", label: "Every N days" },
      { value: "monthly_on_date", label: "Monthly" }
    ], "daily")}
             </select>
           </div>
         </div>
       </div>`,
    "Add task",
    "ok-add-task"
  );
}
function choreFormFields(chore, isEdit, people, catLabels, activeTab = "details") {
  const c = chore || {};
  const rec = c.recurrence || {};
  const recType = rec.type || "daily";
  const assigned = c.assigned_to || [];
  const iconsByCat = /* @__PURE__ */ new Map();
  for (const m of FH_ICON_META) {
    const cat = m.category || "Other";
    if (!iconsByCat.has(cat)) iconsByCat.set(cat, []);
    iconsByCat.get(cat).push(m);
  }
  const iconGridHtml = [...iconsByCat.entries()].map(([cat, items]) => `
        <div class="fh-icon-picker-cat-hdr">${escHTML(cat)}</div>
        <div class="fh-icon-picker-cat-grid">
          ${items.map(({ key, label }) => `
            <button class="fh-icon-cell${c.icon === key ? " selected" : ""}"
                    data-act="pick-icon" data-icon="${key}" type="button"
                    title="${label}">
              <span style="display:inline-flex;width:28px;height:28px;color:var(--fh-text)">${FH_ICONS[key]}</span>
              <span class="fh-icon-cell-label">${label}</span>
            </button>`).join("")}
        </div>`).join("");
  const tabs = [
    { key: "details", label: "Details" },
    { key: "schedule", label: "Schedule" },
    { key: "rewards", label: "Points & Rewards" },
    { key: "reminders", label: "Reminders" }
  ];
  const tabStrip = `
      <div class="fh-chore-tabs">
        ${tabs.map((t) => `
          <button class="fh-chore-tab${activeTab === t.key ? " active" : ""}"
                  data-act="chore-tab" data-tab="${t.key}" type="button">
            ${t.label}
          </button>`).join("")}
      </div>`;
  const pane = (key, content) => `
      <div class="fh-chore-tab-pane" data-tab="${key}"
           style="${activeTab === key ? "" : "display:none"}">
        ${content}
      </div>`;
  const detailsPane = pane("details", `
        <div class="fh-field">
          <label class="fh-label">Chore name *</label>
          <input class="fh-input" id="m-cname" type="text"
                 value="${escAttr(c.name || "")}" autofocus>
        </div>
        <div class="fh-field">
          <label class="fh-label">Description (optional)</label>
          <input class="fh-input" id="m-cdesc" type="text"
                 value="${escAttr(c.description || "")}" placeholder="More detail\u2026">
        </div>
        <div class="fh-field">
          <label class="fh-label">Icon</label>
          <input type="hidden" id="m-cicon" value="${escAttr(c.icon || "")}">
          <div class="fh-chore-icon-grid">
            ${iconGridHtml}
          </div>
        </div>
        <div class="fh-row">
          <div class="fh-field">
            <label class="fh-label">Chore type</label>
            <select class="fh-select" id="m-ctype">
              ${opts([
    { value: "assigned", label: "Assigned" },
    { value: "claimable", label: "Claimable (bonus)" },
    { value: "reminder", label: "Reminder" }
  ], c.chore_type || "assigned")}
            </select>
          </div>
          <div class="fh-field">
            <label class="fh-label">Category</label>
            <select class="fh-select" id="m-clabel">
              <option value="">\u2014 None \u2014</option>
              ${catLabels.map(
    (l) => `<option value="${escAttr(l)}" ${l === c.category_label ? "selected" : ""}>${l}</option>`
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
          ${multiPersonCheckboxes(people, assigned, "m-assign-person")}
        </div>
    `);
  const schedulePane = pane("schedule", `
        <div class="fh-field">
          <label class="fh-label">Recurrence</label>
          <select class="fh-select" id="m-crec">
            ${opts([
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly_on_date", label: "Monthly" },
    { value: "one_time", label: "One-time" }
  ], recType)}
          </select>
        </div>
        <div id="m-dayfilter-section" class="fh-field" style="display:none">
          <label class="fh-label">Restrict to days (leave empty = every day)</label>
          <div class="fh-weekday-row">
            ${weekdayChips(rec.day_filter || [], "m-df-day")}
          </div>
        </div>
        <div id="m-weekdays-section" class="fh-field" style="display:none">
          <label class="fh-label">Day(s) of week</label>
          <div class="fh-weekday-row">
            ${weekdayChips(rec.weekdays || [], "m-wd-day")}
          </div>
        </div>
        <div id="m-dom-section" class="fh-field" style="display:none">
          <label class="fh-label">Day of month (1\u201331)</label>
          <input class="fh-input" id="m-dom" type="number" min="1" max="31"
                 value="${rec.day_of_month || 1}">
        </div>
        <div id="m-chore-expiry-section" class="fh-field" style="display:none">
          <label class="fh-label">Expires after (days)</label>
          <input class="fh-input" id="m-cexpiry" type="number" min="1"
                 value="${c.expires_after_days || ""}">
        </div>
        <div id="m-claimable-section" class="fh-field" style="display:none">
          <label class="fh-label">Claim type</label>
          <select class="fh-select" id="m-csubtype">
            <option value="fcfs"        ${(c.claimable_subtype || "fcfs") === "fcfs" ? "selected" : ""}>First come, first served</option>
            <option value="multi_claim" ${c.claimable_subtype === "multi_claim" ? "selected" : ""}>Multi-claim (multiple helpers)</option>
          </select>
        </div>
        <div id="m-multi-claim-section" class="fh-field" style="display:none">
          <div class="fh-row">
            <div class="fh-field">
              <label class="fh-label">Max helpers</label>
              <input class="fh-input" id="m-max-claimants" type="number" min="2" max="20"
                     value="${c.max_claimants || 2}">
            </div>
            <div class="fh-field">
              <label class="fh-label">Points mode</label>
              <select class="fh-select" id="m-points-mode">
                <option value="full"  ${(c.multi_claim_points_mode || "full") === "full" ? "selected" : ""}>Full points each</option>
                <option value="split" ${c.multi_claim_points_mode === "split" ? "selected" : ""}>Split evenly</option>
              </select>
            </div>
          </div>
        </div>
    `);
  const rewardsPane = pane("rewards", `
        <div class="fh-field">
          <label class="fh-label">Points awarded on completion</label>
          <input class="fh-input" id="m-cpts" type="number" min="0"
                 value="${c.points !== void 0 ? c.points : 10}">
        </div>
        <div class="fh-checkbox-row">
          <input type="checkbox" id="m-cappr"
                 ${c.approval_required !== false ? "checked" : ""}>
          <label for="m-cappr" style="font-size:.88rem">Requires parent approval</label>
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Penalty for skipping</div>
        <div class="fh-checkbox-row">
          <input type="checkbox" id="m-cpenalty"
                 ${c.penalty_enabled ? "checked" : ""}>
          <label for="m-cpenalty" style="font-size:.88rem">Apply penalty points if skipped</label>
        </div>
        <div id="m-penalty-pts-section" class="fh-field" style="display:none">
          <label class="fh-label">Penalty points</label>
          <input class="fh-input" id="m-cpenalty-pts" type="number" min="1"
                 value="${c.penalty_points || 5}">
        </div>
        <div id="m-daily-threshold-section" class="fh-field" style="display:none">
          <label class="fh-label">Daily penalty after (days, optional)</label>
          <input class="fh-input" id="m-daily-threshold" type="number" min="1"
                 placeholder="e.g. 3 \u2014 start deducting after 3 days"
                 value="${c.daily_penalty_after_days || ""}">
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Streak bonus</div>
        <div class="fh-row">
          <div class="fh-field">
            <label class="fh-label">Streak milestone (0 = off)</label>
            <input class="fh-input" id="m-streak-milestone" type="number" min="0"
                   placeholder="e.g. 7" value="${c.streak_milestone || 0}">
          </div>
          <div class="fh-field">
            <label class="fh-label">Bonus points awarded</label>
            <input class="fh-input" id="m-streak-bonus" type="number" min="0"
                   value="${c.streak_bonus_points || 0}">
          </div>
        </div>
    `);
  const remindersPane = pane("reminders", `
        <div class="fh-field">
          <label class="fh-label">Reminder time (-1 = off)</label>
          <input class="fh-input" id="m-reminder-time" type="number" min="-1" max="2359"
                 placeholder="-1 (off)"
                 value="${c.reminder_time !== void 0 ? c.reminder_time : -1}">
          <div class="fh-field-help">
            HHMM format \u2014 e.g. 1900 for 7:00 PM. Sends a push notification once per task instance
            when local time reaches this value and the task is still pending.
          </div>
        </div>
    `);
  return `
        ${isEdit ? `<input type="hidden" id="m-cid" value="${c.chore_id}">` : ""}
        ${tabStrip}
        <div class="fh-chore-tab-panes">
          ${detailsPane}
          ${schedulePane}
          ${rewardsPane}
          ${remindersPane}
        </div>`;
}
function mChoreForm(chore, isEdit, people, catLabels, activeTab = "details") {
  const c = chore || {};
  const title = isEdit ? `Edit \u2014 ${c.name}` : "Add chore";
  const okAct = isEdit ? "ok-edit-chore" : "ok-add-chore";
  return mWrap(
    title,
    choreFormFields(chore, isEdit, people, catLabels, activeTab),
    isEdit ? "Save changes" : "Add chore",
    okAct
  );
}
function mAddStoreItem(people) {
  return mWrap(
    "Add reward item",
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
         ${multiPersonCheckboxes(people, [], "m-sp-person")}
       </div>`,
    "Add reward",
    "ok-add-store-item"
  );
}
function mEditStoreItem(item, people) {
  return mWrap(
    `Edit \u2014 ${item.name}`,
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
             <option value="common"   ${item.scope === "common" ? "selected" : ""}>All kids</option>
             <option value="personal" ${item.scope === "personal" ? "selected" : ""}>Specific people</option>
           </select>
         </div>
       </div>
       <div id="m-sperson-section" class="fh-field" style="${item.scope === "personal" ? "" : "display:none"}">
         <label class="fh-label">Who can see this reward?</label>
         ${multiPersonCheckboxes(people, item.person_ids || [], "m-sp-person")}
       </div>`,
    "Save changes",
    "ok-edit-store-item"
  );
}
function mAddPerson() {
  return mWrap(
    "Add person",
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
    "Add person",
    "ok-add-person"
  );
}
function mEditPerson(d) {
  const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const wdayOpts = WEEKDAY_NAMES.map(
    (n, i) => `<option value="${i}" ${d.allowanceWday === i ? "selected" : ""}>${n}</option>`
  ).join("");
  const mdayOpts = Array.from({ length: 28 }, (_, i) => i + 1).map(
    (day) => `<option value="${day}" ${d.allowanceMday === day ? "selected" : ""}>${day}</option>`
  ).join("");
  const THEMES2 = [
    { value: "classic", label: "Classic", accent: d.pcolor || "#4A90E2" },
    { value: "engineer", label: "Engineer", accent: "#E0B84C" },
    { value: "baker", label: "Baker", accent: "#8B3A2A" },
    { value: "dinos", label: "Dinos", accent: "#8B6A20" },
    { value: "hp", label: "Harry Potter", accent: "#1F4F3C" },
    { value: "dbz", label: "Dragon Ball Z", accent: "#FF6A1A" }
  ];
  const currentTheme = THEMES2.find((t) => t.value === d.theme) || THEMES2[0];
  const themeOpts = THEMES2.map(
    (t) => `<option value="${t.value}" ${d.theme === t.value ? "selected" : ""}>${t.label}</option>`
  ).join("");
  const section = (label, sub, body) => `
      <div class="fh-modal-section">
        <div class="fh-modal-section-hdr">
          <span class="fh-modal-section-lbl">${escHTML(label)}</span>
          ${sub ? `<span class="fh-modal-section-sub">${escHTML(sub)}</span>` : ""}
        </div>
        ${body}
      </div>`;
  return mWrap(
    `Edit \u2014 ${d.pname}`,
    `${section("Identity", "name, codename, avatar color", `
           <div class="fh-field">
             <label class="fh-label">Name *</label>
             <input class="fh-input" id="m-pname" type="text" value="${escAttr(d.pname)}" autofocus>
           </div>
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Codename</label>
               <input class="fh-input" id="m-pcode" type="text"
                      value="${escAttr(d.code || "")}"
                      placeholder="e.g. T-REX, SNITCH, KODIAK"
                      style="text-transform:uppercase">
               <div class="fh-field-help">Shown on Mission Control mini buttons and agent cards.</div>
             </div>
             <div class="fh-field">
               <label class="fh-label">Type</label>
               <select class="fh-select" id="m-ptype">
                 <option value="kid"    ${d.ptype === "kid" ? "selected" : ""}>Kid</option>
                 <option value="parent" ${d.ptype === "parent" ? "selected" : ""}>Parent</option>
               </select>
             </div>
           </div>
           <div class="fh-field">
             <label class="fh-label">Avatar color</label>
             <input class="fh-input" id="m-pcolor" type="color"
                    value="${d.pcolor}" style="height:42px;padding:4px;width:100%">
             <div class="fh-field-help">Used for chips, accents, and the Mission Control row tint.</div>
           </div>
        `)}

        ${section("Theme", "personal-page look & feel", `
           <div class="fh-field">
             <label class="fh-label">Theme</label>
             <div class="fh-theme-pick">
               <span class="fh-theme-swatch" style="background:${currentTheme.accent}"></span>
               <select class="fh-select" id="m-ptheme" style="flex:1">${themeOpts}</select>
             </div>
             <div class="fh-field-help">Changes the personal dashboard skin. Swatch shows current accent.</div>
           </div>
           <div class="fh-toggle-row">
             <div>
               <div style="font-size:.9rem;font-weight:600">Large-button mode</div>
               <div style="font-size:.75rem;color:var(--fh-text-sec)">
                 Card grid layout, bigger icons &amp; buttons \u2014 best for pre-readers.
               </div>
             </div>
             <label class="fh-toggle">
               <input type="checkbox" id="m-pchildmode" ${d.childMode ? "checked" : ""}>
               <span class="fh-toggle-slider"></span>
             </label>
           </div>
        `)}

        ${section("Allowance", "scheduled point payouts", `
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Amount (pts, 0 = off)</label>
               <input class="fh-input" id="m-allowance-pts" type="number" min="0"
                      value="${d.allowancePts}" style="width:100%">
             </div>
             <div class="fh-field">
               <label class="fh-label">Schedule</label>
               <select class="fh-select" id="m-allowance-schedule">
                 <option value="weekly"   ${d.allowanceSched === "weekly" ? "selected" : ""}>Weekly</option>
                 <option value="biweekly" ${d.allowanceSched === "biweekly" ? "selected" : ""}>Bi-weekly</option>
                 <option value="monthly"  ${d.allowanceSched === "monthly" ? "selected" : ""}>Monthly</option>
               </select>
             </div>
           </div>
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Day of week (weekly / bi-weekly)</label>
               <select class="fh-select" id="m-allowance-weekday">${wdayOpts}</select>
             </div>
             <div class="fh-field">
               <label class="fh-label">Day of month (monthly)</label>
               <select class="fh-select" id="m-allowance-monthday">${mdayOpts}</select>
             </div>
           </div>
        `)}

        ${section("Notifications", "push targets for approvals & reminders", `
           <div class="fh-field">
             <label class="fh-label">Notify target (HA service name, blank = off)</label>
             <input class="fh-input" id="m-pnotify" type="text"
                    value="${escAttr(d.notifyTarget || "")}"
                    placeholder="e.g. mobile_app_jackson_iphone">
             <div class="fh-field-help">HA <code>notify.*</code> service name. Works with the Companion App or Alexa Media.</div>
           </div>
        `)}

        ${section("Rank", "weekly evaluation overrides", `
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Rank index (admin override)</label>
               <input class="fh-input" id="m-prankidx" type="number" min="0"
                      value="${d.rankIdx !== void 0 ? d.rankIdx : 0}">
             </div>
             <div class="fh-field">
               <label class="fh-label">Drop threshold (pts/wk, blank = global)</label>
               <input class="fh-input" id="m-pdropThr" type="number" min="0"
                      value="${d.dropThr !== "" ? d.dropThr : ""}"
                      placeholder="Global default">
             </div>
           </div>
           <div class="fh-field">
             <label class="fh-label">Gain threshold (pts/wk, blank = global)</label>
             <input class="fh-input" id="m-pgainThr" type="number" min="0"
                    value="${d.gainThr !== "" ? d.gainThr : ""}"
                    placeholder="Global default">
           </div>
        `)}

        <input type="hidden" id="m-pid" value="${d.pid}">`,
    "Save",
    "ok-edit-person"
  );
}
function mConfirmRemovePerson(d) {
  return `
      <div class="fh-modal">
        <div class="fh-modal-title">Remove ${escHTML(d.pname)}?</div>
        <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0;line-height:1.5">
          This will deactivate <strong>${escHTML(d.pname)}</strong> and remove their pending tasks.
          Historical data and point history are preserved.
          This cannot be undone from the card.
        </p>
        <input type="hidden" id="m-rpid" value="${d.pid}">
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn fh-btn-danger" data-act="ok-remove-person">
            Remove ${escHTML(d.pname)}
          </button>
        </div>
      </div>`;
}
function mEditStreaks(pid, pname, chores, personStreaks) {
  const assigned = chores.filter((c) => c.chore_type === "assigned");
  const rows = assigned.map((c) => {
    const current = personStreaks[c.chore_id] || 0;
    return `
          <div class="fh-point-row" style="gap:8px">
            <span style="flex:1;font-size:.88rem;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                  title="${escAttr(c.name)}">${escHTML(c.name)}</span>
            <input class="fh-input" id="m-streak-${escAttr(c.chore_id)}" type="number" min="0"
                   value="${current}" style="width:64px;text-align:center">
            <button class="fh-btn fh-btn-primary fh-btn-sm"
                    data-act="set-streak" data-pid="${pid}" data-cid="${escAttr(c.chore_id)}">
              Set
            </button>
          </div>`;
  }).join("") || `<div class="fh-empty">No assigned chores.</div>`;
  return `
      <div class="fh-modal">
        <div class="fh-modal-title">\u{1F525} Edit streaks \u2014 ${escHTML(pname)}</div>
        <p style="font-size:.8rem;color:var(--fh-text-sec);margin:0 0 8px">
          Enter the correct streak count and press Set. Changes save immediately.
        </p>
        <div style="display:flex;flex-direction:column;gap:6px">${rows}</div>
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Done</button>
        </div>
      </div>`;
}
function mEditSettings(d) {
  const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const wdayOpts = WEEKDAY_NAMES.map(
    (n, i) => `<option value="${i}" ${d.rankWeekday == i ? "selected" : ""}>${n}</option>`
  ).join("");
  return mWrap(
    "Edit settings",
    `<div class="fh-field">
         <label class="fh-label">Family name</label>
         <input class="fh-input" id="m-fname" type="text"
                value="${escAttr(d.fname)}" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Points per dollar</label>
         <input class="fh-input" id="m-ppd" type="number" min="1" value="${d.ppd}">
       </div>
       <div class="fh-field">
         <label class="fh-label">Penalty alert time (-1 = off, e.g. 800 for 8:00 AM)</label>
         <input class="fh-input" id="m-alert-time" type="number" min="-1" max="2359"
                placeholder="800" value="${d.penaltyAlertTime !== void 0 ? d.penaltyAlertTime : 800}">
       </div>
       <div class="fh-section-title" style="margin-top:var(--fh-gap-sm)">Rank evaluation</div>
       <div class="fh-field">
         <label class="fh-label">Evaluate ranks on</label>
         <select class="fh-select" id="m-rank-weekday">${wdayOpts}</select>
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Drop below (pts/wk)</label>
           <input class="fh-input" id="m-rank-drop" type="number" min="0"
                  value="${d.rankDrop !== void 0 ? d.rankDrop : 50}">
         </div>
         <div class="fh-field">
           <label class="fh-label">Gain at or above (pts/wk)</label>
           <input class="fh-input" id="m-rank-gain" type="number" min="0"
                  value="${d.rankGain !== void 0 ? d.rankGain : 75}">
         </div>
       </div>`,
    "Save",
    "ok-edit-settings"
  );
}
function mClaim(m, people) {
  return mWrap(
    `Claim \u2014 ${escHTML(m.data.name)}`,
    `<div class="fh-field">
         <label class="fh-label">Who is claiming?</label>
         <select class="fh-select" id="m-clperson">
           ${people.map((p) => `<option value="${p.person_id}">${escHTML(p.name)}</option>`).join("")}
         </select>
       </div>
       <input type="hidden" id="m-cltid" value="${m.data.tid}">`,
    "Claim",
    "ok-claim"
  );
}
function mAddReminder(m, people) {
  return mWrap(
    "Add personal reminder",
    `<div class="fh-field">
         <label class="fh-label">Reminder name *</label>
         <input class="fh-input" id="m-rname" type="text" autofocus
                placeholder="e.g. Take vitamins, Feed the dog">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Who?</label>
           <select class="fh-select" id="m-rperson">
             ${people.map(
      (p) => {
        var _a;
        return `<option value="${p.person_id}"
                          ${((_a = m.data) == null ? void 0 : _a.pid) === p.person_id ? "selected" : ""}>${escHTML(p.name)}</option>`;
      }
    ).join("")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Recurrence</label>
           <select class="fh-select" id="m-rrec">
             ${opts([
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "every_n_days", label: "Every N days" },
      { value: "monthly_on_date", label: "Monthly" }
    ], "daily")}
           </select>
         </div>
       </div>`,
    "Add",
    "ok-add-reminder"
  );
}
function multiPersonCheckboxes(people, selectedIds, cbClass) {
  if (!people.length) return `<span style="font-size:.82rem;color:var(--fh-text-sec)">No people found.</span>`;
  return `<div class="fh-person-cb-list">
      ${people.map((p) => {
    const checked = (selectedIds || []).includes(p.person_id);
    const color = p.avatar_color || DEFAULT_COLOR;
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
var init_modals = __esm({
  "src/card/modals.js"() {
    init_constants();
    init_constants();
    init_utils();
    init_icons();
  }
});

// src/card/modes-admin.js
function htmlAdmin(card) {
  const attr = card._attrs("sensor.family_hub_needs_attention");
  const people = attr.people || [];
  const approvals = attr.approval_queue || [];
  const redemptions = attr.redemption_queue || [];
  const chores = attr.active_chores || [];
  const catLabels = attr.category_labels || [];
  const famName = attr.family_name || "Family Hub";
  const storeItems = attr.store_items || [];
  const actionCount = approvals.length + redemptions.length;
  const sections = [
    { id: "today", label: "Today", icon: "\u25D0", badge: actionCount },
    { id: "family", label: "Family", icon: "\u25CD", badge: 0 },
    { id: "tasks", label: "Tasks", icon: "\u25C9", badge: 0 },
    { id: "history", label: "History", icon: "\u25D1", badge: 0 },
    { id: "settings", label: "Settings", icon: "\u25CE", badge: 0 }
  ];
  const sec = card._adminSec;
  let body = "";
  switch (sec) {
    case "today":
      body = _htmlAdToday(approvals, redemptions, attr);
      break;
    case "family":
      body = _htmlAdFamily(people, attr);
      break;
    case "tasks":
      body = _htmlAdTasks(chores, people, catLabels, card);
      break;
    case "history":
      body = _htmlAdHistory(attr, card);
      break;
    case "settings":
      body = _htmlAdSettings(attr, storeItems, people);
      break;
    default:
      body = _htmlAdToday(approvals, redemptions, attr);
  }
  const TB = {
    today: {
      crumb: "OVERVIEW",
      title: "Today",
      actions: `<button class="fh-ad-btn fh-ad-btn--ghost" data-act="export-backup">Export backup</button>
                              <button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${I.plus} Add chore</button>`
    },
    family: {
      crumb: "PEOPLE",
      title: "Family",
      actions: `<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-person">${I.person} Add person</button>`
    },
    tasks: {
      crumb: "CHORES",
      title: "Tasks",
      actions: `<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${I.plus} Add chore</button>`
    },
    history: { crumb: "ACTIVITY", title: "History", actions: "" },
    settings: {
      crumb: "CONFIGURATION",
      title: "Settings",
      actions: `<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-store-item">${I.plus} Add reward</button>`
    }
  };
  const tb = TB[sec] || TB.today;
  const sidebarItems = sections.map((s) => `
      <div class="fh-ad-nav-item ${sec === s.id ? "active" : ""}"
           data-act="admin-sec" data-sec="${s.id}">
        <span class="fh-ad-nav-icon">${s.icon}</span>
        <span class="fh-ad-nav-label">${s.label}</span>
        ${s.badge > 0 ? `<span class="fh-ad-nav-badge">${s.badge}</span>` : ""}
      </div>`).join("");
  const bottomItems = sections.map((s) => `
      <div class="fh-ad-bottom-item ${sec === s.id ? "active" : ""}"
           data-act="admin-sec" data-sec="${s.id}">
        <span class="fh-ad-bottom-icon">${s.icon}</span>
        <span class="fh-ad-bottom-label">${s.label}</span>
        ${s.badge > 0 ? `<span class="fh-ad-bottom-badge">${s.badge}</span>` : ""}
      </div>`).join("");
  return `
      <div class="fh-ad-shell">

        <aside class="fh-ad-sidebar">
          <div class="fh-ad-brand">
            <div class="fh-ad-brand-icon">FH</div>
            <div>
              <div class="fh-ad-brand-name">${escHTML(famName)}</div>
              <div class="fh-ad-brand-sub">v0.6.0 \xB7 ADMIN</div>
            </div>
          </div>
          <nav class="fh-ad-nav">${sidebarItems}</nav>
        </aside>

        <div class="fh-ad-main">
          <div class="fh-ad-topbar">
            <div>
              <div class="fh-ad-topbar-crumb">${tb.crumb}</div>
              <div class="fh-ad-topbar-title">${tb.title}</div>
            </div>
            <div class="fh-ad-topbar-actions">${tb.actions}</div>
          </div>
          <div class="fh-ad-body">${body}</div>
        </div>

        <nav class="fh-ad-bottom-nav">${bottomItems}</nav>

      </div>`;
}
function _htmlAdToday(approvals, redemptions, attr) {
  const people = attr.people || [];
  const chores = attr.active_chores || [];
  const historyLog = attr.history_log || [];
  const stats = [
    { label: "APPROVAL QUEUE", value: approvals.length, accent: approvals.length > 0 ? "#F5C24A" : "#58D38A" },
    { label: "REDEEM QUEUE", value: redemptions.length, accent: redemptions.length > 0 ? "#E36DA4" : "#58D38A" },
    { label: "ACTIVE CHORES", value: chores.length, accent: "#5B8DEF" },
    { label: "FAMILY", value: people.length, accent: "#A6B3CC" }
  ];
  const statCards = stats.map((s) => `
      <div class="fh-ad-stat">
        <div class="fh-ad-stat-val" style="color:${s.accent}">${s.value}</div>
        <div class="fh-ad-stat-lbl">${s.label}</div>
      </div>`).join("");
  const queue = [
    ...approvals.map((a) => ({ ...a, kind: "approval" })),
    ...redemptions.map((r) => ({ ...r, kind: "redemption" }))
  ];
  const queueRows = queue.length > 0 ? queue.map((q) => {
    const color = q.person_color || DEFAULT_COLOR;
    const isAppr = q.kind === "approval";
    const name = isAppr ? q.chore_name || "" : q.item_name || "";
    const pts = isAppr ? q.chore_points : q.points_cost;
    const actOk = isAppr ? "approve-task" : "approve-redemption";
    const actNo = isAppr ? "deny-task" : "decline-redemption";
    const itemAttr = isAppr ? `data-tid="${q.task_id}"` : `data-rid="${q.redemption_id}"`;
    const pill = isAppr ? `<span class="fh-ad-pill fh-ad-pill--amber">CHORE</span>` : `<span class="fh-ad-pill fh-ad-pill--rose">REWARD</span>`;
    return `
              <div class="fh-ad-queue-row">
                <div class="fh-avatar" style="background:${color};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${ini(q.person_name)}</div>
                <div class="fh-ad-queue-info">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                    ${pill}
                    <span class="fh-ad-queue-time">${q.when || ""}</span>
                  </div>
                  <div class="fh-ad-queue-name">${escHTML(name)}</div>
                  <div class="fh-ad-queue-meta">${escHTML(q.person_name || "")} \xB7 ${isAppr ? "+" : "\u2212"}${fPts(pts)}</div>
                </div>
                <button class="fh-btn fh-btn-success fh-btn-sm" data-act="${actOk}" ${itemAttr}>${I.check}</button>
                <button class="fh-btn fh-btn-danger  fh-btn-sm" data-act="${actNo}"  ${itemAttr}>${I.close}</button>
              </div>`;
  }).join("") : `<div class="fh-empty fh-ad-empty">Nothing needs your attention right now. \u2713</div>`;
  const cutoff = Date.now() - 1728e5;
  const recent = historyLog.filter((e) => new Date(e.timestamp).getTime() > cutoff).slice(0, 15);
  const activityRows = recent.length > 0 ? recent.map((e) => {
    const meta = HISTORY_META[e.type] || { label: e.type, color: "#6F7E9C" };
    const color = e.person_color || DEFAULT_COLOR;
    const pts = e.points_delta;
    const ptColor = pts > 0 ? "#58D38A" : pts < 0 ? "#E8553E" : "#6F7E9C";
    const ptBadge = pts ? `<span style="font-family:'JetBrains Mono',monospace;font-size:var(--fh-text-xs);font-weight:700;color:${ptColor};flex-shrink:0">${pts > 0 ? "+" : ""}${pts}pts</span>` : "";
    return `
              <div class="fh-ad-activity-row">
                <div class="fh-avatar" style="background:${color};width:28px;height:28px;font-size:var(--fh-text-xs);flex-shrink:0">${e.person_name ? ini(e.person_name) : "\u2014"}</div>
                <div style="flex:1;min-width:0">
                  <div class="fh-ad-activity-name">
                    <span style="font-weight:700">${escHTML(e.person_name || "")}</span>
                    ${escHTML(e.chore_name || e.note || "")}
                  </div>
                  <div class="fh-ad-activity-meta" style="color:${meta.color}">${escHTML(meta.label)}</div>
                </div>
                ${ptBadge}
                <span class="fh-ad-activity-time">${relTime(e.timestamp)}</span>
              </div>`;
  }).join("") : `<div class="fh-empty fh-ad-empty">No recent activity.</div>`;
  return `
      <div class="fh-ad-stat-row">${statCards}</div>
      <div class="fh-ad-today-grid">
        <div class="fh-ad-panel fh-ad-today-queue">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Needs your attention</span>
            <span class="fh-ad-panel-sub">${queue.length} item${queue.length !== 1 ? "s" : ""}</span>
          </div>
          ${queueRows}
        </div>
        <div class="fh-ad-panel fh-ad-today-activity">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Recent activity</span>
            <span class="fh-ad-panel-sub">last 48 hours</span>
          </div>
          ${activityRows}
        </div>
      </div>`;
}
function _htmlAdFamily(people, attr) {
  const ppdollar = attr.points_per_dollar || 10;
  const globalPause = attr.penalties_paused_global || false;
  const cards = people.map((p) => {
    const color = p.avatar_color || DEFAULT_COLOR;
    const penPaused = p.penalties_paused || false;
    const isKid = p.type === "kid";
    let penLabel, penClass;
    if (globalPause) {
      penLabel = "Penalties & streaks off (global)";
      penClass = "off-global";
    } else if (penPaused) {
      penLabel = "Penalties & streaks off";
      penClass = "off";
    } else {
      penLabel = "Penalties & streaks on";
      penClass = "";
    }
    return `
          <div class="fh-ad-person-card">
            <div class="fh-ad-person-top">
              <div class="fh-avatar" style="background:${color};width:40px;height:40px;font-size:1rem;flex-shrink:0">${ini(p.name)}</div>
              <div style="flex:1;min-width:0">
                <div class="fh-ad-person-name">
                  ${escHTML(p.name)}
                  <span class="fh-ad-person-type">${cap(p.type)}</span>
                  ${p.code ? `<span class="fh-ad-person-code">${escHTML(p.code)}</span>` : ""}
                </div>
                <div class="fh-ad-person-bal">
                  ${fPts(p.points_balance)}pts \xB7 ${fUSD(p.points_balance / ppdollar)} \xB7 lifetime ${fPts(p.points_lifetime)}${p.allowance_points > 0 ? ` \xB7 ${p.allowance_points}pts/${p.allowance_schedule === "monthly" ? "mo" : p.allowance_schedule === "biweekly" ? "2wk" : "wk"} allowance` : ""}
                </div>
              </div>
              <div class="fh-ad-person-btns">
                <button class="fh-btn fh-btn-success fh-btn-sm" data-act="open-award"
                        data-pid="${p.person_id}" data-pname="${escAttr(p.name)}"
                        title="Award points">${I.award}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm" data-act="open-deduct"
                        data-pid="${p.person_id}" data-pname="${escAttr(p.name)}"
                        title="Deduct points">${I.minus}</button>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-person"
                        data-pid="${p.person_id}"
                        data-pname="${escAttr(p.name)}"
                        data-ptype="${p.type}"
                        data-pcolor="${p.avatar_color || DEFAULT_COLOR}"
                        data-pallowpts="${p.allowance_points || 0}"
                        data-pallowsched="${p.allowance_schedule || "weekly"}"
                        data-pallowwday="${p.allowance_weekday ?? 5}"
                        data-pallowmday="${p.allowance_monthday || 1}"
                        data-pnotify="${escAttr(p.notify_target || "")}"
                        data-pcode="${escAttr(p.code || "")}"
                        data-ptheme="${escAttr(p.theme_key || "classic")}"
                        data-prankidx="${p.rank_index !== void 0 ? p.rank_index : 0}"
                        data-pdropThr="${p.rank_drop_threshold !== null && p.rank_drop_threshold !== void 0 ? p.rank_drop_threshold : ""}"
                        data-pgainThr="${p.rank_gain_threshold !== null && p.rank_gain_threshold !== void 0 ? p.rank_gain_threshold : ""}"
                        data-pchildmode="${p.child_mode === true}"
                        title="Edit person">${I.edit}</button>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-confirm-remove-person"
                        data-pid="${p.person_id}" data-pname="${escAttr(p.name)}"
                        title="Remove person">${I.remove}</button>
              </div>
            </div>
            ${isKid ? `
              <div class="fh-ad-person-foot">
                <span class="fh-penalty-pause-label ${penClass}">${penLabel}</span>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-streaks"
                        data-pid="${p.person_id}" data-pname="${escAttr(p.name)}">\u{1F525} Streaks</button>
                <label class="fh-toggle" style="width:36px;height:20px"
                       title="${penPaused ? "Resume" : "Pause"} penalties &amp; streaks">
                  <input type="checkbox" data-act="toggle-person-penalty"
                         data-pid="${p.person_id}" ${penPaused ? "" : "checked"}>
                  <span class="fh-toggle-slider"></span>
                </label>
              </div>` : ""}
          </div>`;
  }).join("") || `<div class="fh-empty fh-ad-empty">No people found.</div>`;
  return `
      <div class="fh-ad-family-grid">${cards}</div>
      <div class="fh-ad-panel" style="margin-top:4px">
        <div class="fh-ad-panel-hdr">
          <span class="fh-ad-panel-title">Global controls</span>
        </div>
        <div class="fh-ad-panel-body">
          <div class="fh-toggle-row" style="border-left:3px solid ${globalPause ? "var(--fh-warning)" : "var(--fh-success)"}">
            <div>
              <div style="font-size:.9rem;font-weight:600">Penalties &amp; streaks active</div>
              <div style="font-size:.75rem;color:var(--fh-text-sec)">
                ${globalPause ? "\u23F8 Paused globally \u2014 skips won&#39;t break streaks or deduct points" : "Applying normally at the daily tick"}
              </div>
            </div>
            <label class="fh-toggle">
              <input type="checkbox" data-act="toggle-global-penalty" ${globalPause ? "" : "checked"}>
              <span class="fh-toggle-slider"></span>
            </label>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
            <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="open-add-task">
              ${I.plus} Assign one-time task
            </button>
          </div>
        </div>
      </div>`;
}
function _htmlAdTasks(chores, people, catLabels, card) {
  card._sortedChores = chores;
  const filterChips = `
      <div class="fh-chips">
        <div class="fh-chip ${!card._choreFilter ? "active" : ""}"
             data-act="chore-filter" data-cpid="">All</div>
        ${people.map((p) => `
          <div class="fh-chip ${card._choreFilter === p.person_id ? "active" : ""}"
               style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
               data-act="chore-filter" data-cpid="${p.person_id}">
            <span class="fh-chip-dot"></span>${escHTML(p.name)}
          </div>`).join("")}
      </div>`;
  const visible = card._choreFilter ? chores.filter((c) => (c.assigned_to || []).includes(card._choreFilter)) : chores;
  const sort = card._adminSort || { col: null, dir: "asc" };
  let sorted = [...visible];
  if (sort.col) {
    sorted.sort((a, b) => {
      let va, vb;
      switch (sort.col) {
        case "name":
          va = a.name.toLowerCase();
          vb = b.name.toLowerCase();
          break;
        case "pts":
          va = a.points;
          vb = b.points;
          break;
        case "cat":
          va = a.category_label || "";
          vb = b.category_label || "";
          break;
        case "asgn": {
          va = (a.assigned_to || []).map((id) => {
            var _a;
            return ((_a = people.find((p) => p.person_id === id)) == null ? void 0 : _a.name) || "";
          }).sort().join(",");
          vb = (b.assigned_to || []).map((id) => {
            var _a;
            return ((_a = people.find((p) => p.person_id === id)) == null ? void 0 : _a.name) || "";
          }).sort().join(",");
          break;
        }
        default:
          va = vb = "";
      }
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }
  const sortCols = [
    { col: "name", label: "Name" },
    { col: "pts", label: "Pts" },
    { col: "cat", label: "Category" },
    { col: "asgn", label: "Assignees" }
  ];
  const sortBar = `
      <div class="fh-ad-sort-bar">
        <span class="fh-ad-sort-lbl">Sort:</span>
        ${sortCols.map(({ col, label }) => {
    const isActive = sort.col === col;
    const arrow = isActive ? sort.dir === "asc" ? " \u2191" : " \u2193" : "";
    return `<button class="fh-ad-sort-btn${isActive ? " active" : ""}"
                            data-act="sort-admin-chores" data-col="${col}">${label}${arrow}</button>`;
  }).join("")}
        ${sort.col ? `<button class="fh-ad-sort-btn" data-act="sort-admin-chores" data-col="">\u2715 Clear</button>` : ""}
      </div>`;
  const groups = /* @__PURE__ */ new Map();
  for (const c of sorted) {
    const key = c.category_label || "Uncategorized";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(c);
  }
  const selectedId = card._adminSelectedChoreId || null;
  const collapsedCats = card._adminCollapsedCats || /* @__PURE__ */ new Set();
  let content = "";
  if (!sorted.length) {
    content = `<div class="fh-empty fh-ad-empty">${card._choreFilter ? "No chores assigned to this person." : "No active chores. Add one above."}</div>`;
  } else {
    content = [...groups.entries()].map(([label, list]) => {
      const collapsed = collapsedCats.has(label);
      const rows = collapsed ? "" : list.map((c) => _htmlChoreTableRow(c, people, card, selectedId)).join("");
      return `
              <div class="fh-ad-cat-group">
                <div class="fh-ad-cat-hdr" data-act="toggle-admin-cat" data-cat="${escAttr(label)}">
                  <span class="fh-ad-cat-chevron${collapsed ? " collapsed" : ""}">\u25BC</span>
                  <span class="fh-ad-cat-name">${escHTML(label)}</span>
                  <span class="fh-ad-cat-count">${list.length}</span>
                </div>
                ${collapsed ? "" : `<div class="fh-task-list">${rows}</div>`}
              </div>`;
    }).join("");
  }
  const selectedChore = selectedId ? chores.find((c) => c.chore_id === selectedId) : null;
  const panelHtml = _htmlChoreEditorPanel(selectedChore, people, catLabels, card);
  return `
      <div class="fh-ad-tasks-wrap">

        <div class="fh-ad-panel fh-ad-tasks-list-panel">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Chore definitions</span>
            <span class="fh-ad-panel-sub">${chores.length} total</span>
          </div>
          <div class="fh-ad-panel-body">
            ${filterChips}
            ${sortBar}
            ${content}
          </div>
        </div>

        ${panelHtml}

      </div>`;
}
function _htmlChoreTableRow(c, people, card, selectedId) {
  var _a, _b, _c, _d;
  const assignedPeople = (c.assigned_to || []).map((id) => people.find((p) => p.person_id === id)).filter(Boolean);
  const avatarHtml = assignedPeople.length ? `<div class="fh-avatars">${assignedPeople.map(
    (p) => `<div class="fh-avatar" style="background:${p.avatar_color || DEFAULT_COLOR};width:26px;height:26px;font-size:var(--fh-text-xs)">${ini(p.name)}</div>`
  ).join("")}</div>` : "";
  const descExp = card._expandedDescs.has(c.chore_id);
  const rowColor = ((_a = assignedPeople[0]) == null ? void 0 : _a.avatar_color) || DEFAULT_COLOR;
  const recType = ((_b = c.recurrence) == null ? void 0 : _b.type) || "daily";
  const recLabel = {
    daily: "Daily",
    weekly: "Weekly",
    every_n_days: `Every ${((_c = c.recurrence) == null ? void 0 : _c.interval) || 2}d`,
    every_n_weeks: `Every ${((_d = c.recurrence) == null ? void 0 : _d.interval) || 2}wk`,
    monthly_on_date: "Monthly",
    one_time: "One-time"
  }[recType] || recType;
  const expiryLabel = c.expires_after_days ? `<span class="fh-badge fh-badge-expiry" style="margin-left:4px">Expires in ${c.expires_after_days}d</span>` : "";
  const isSelected = c.chore_id === selectedId;
  return `
      <div class="fh-task-row${isSelected ? " fh-task-row--selected" : ""}"
           style="--row-color:${rowColor}"
           draggable="true" data-drag-id="${c.chore_id}"
           data-act="select-chore-row" data-cid="${c.chore_id}">
        <span class="fh-drag-handle" title="Drag to reorder">\u283F</span>
        ${avatarHtml}
        <div class="fh-task-body">
          <span class="fh-task-name">${escHTML(c.name)}</span>
          ${descExp && c.description ? `<span class="fh-desc-inline">${escHTML(c.description)}</span>` : ""}
          <span class="fh-task-sub">${recLabel}${c.penalty_enabled ? ` \xB7 -${c.penalty_points}pts penalty` : ""}</span>
        </div>
        ${c.description ? `<button class="fh-desc-btn" data-act="toggle-desc" data-id="${c.chore_id}"
                       title="Toggle description">?</button>` : ""}
        ${expiryLabel}
        <span class="fh-badge fh-badge-pts" style="--row-color:${rowColor}">${c.points}pts</span>
        <button class="fh-btn fh-btn-ghost fh-btn-sm fh-ad-tasks-edit-btn"
                data-act="open-edit-chore" data-cid="${c.chore_id}"
                title="Edit chore">${I.edit}</button>
        <button class="fh-btn fh-btn-danger fh-btn-sm"
                data-act="delete-chore"
                data-cid="${c.chore_id}" data-cname="${escAttr(c.name)}"
                title="Delete chore">${I.trash}</button>
      </div>`;
}
function _htmlChoreEditorPanel(chore, people, catLabels, card) {
  const tab = card && card._choreFormTab || "details";
  const inner = chore ? `
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1;min-width:0">
              <div class="fh-ad-tasks-panel-title">Edit chore</div>
              <div class="fh-ad-tasks-panel-sub" title="${escAttr(chore.name)}">${escHTML(chore.name)}</div>
            </div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="close-chore-panel"
                    style="flex-shrink:0" title="Close panel">\u2715</button>
          </div>
          <div class="fh-ad-tasks-panel-body">
            ${choreFormFields(chore, true, people, catLabels, tab)}
          </div>
          <div class="fh-ad-tasks-panel-footer">
            <button class="fh-btn fh-btn-primary" style="flex:1"
                    data-act="ok-edit-chore-inline">Save changes</button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="delete-chore"
                    data-cid="${chore.chore_id}" data-cname="${escAttr(chore.name)}">Delete</button>
          </div>` : `
          <div class="fh-ad-tasks-panel-empty">
            <div class="fh-ad-tasks-panel-empty-icon">\u2196</div>
            <div class="fh-ad-tasks-panel-empty-text">Select a chore to edit</div>
          </div>`;
  return `<div class="fh-ad-tasks-panel">${inner}</div>`;
}
function _htmlAdHistory(attr, card) {
  const historyLog = attr.history_log || [];
  const people = attr.people || [];
  const firstParent = people.find((p) => p.type === "parent");
  const filterChips = `
      <div class="fh-chips" style="margin-bottom:var(--fh-gap-sm)">
        <div class="fh-chip ${!card._histFilter ? "active" : ""}"
             data-act="hist-filter" data-hpid="">All</div>
        ${people.map((p) => `
          <div class="fh-chip ${card._histFilter === p.person_id ? "active" : ""}"
               style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
               data-act="hist-filter" data-hpid="${p.person_id}">
            <span class="fh-chip-dot"></span>${escHTML(p.name)}
          </div>`).join("")}
      </div>`;
  const filtered = card._histFilter ? historyLog.filter((e) => e.person_id === card._histFilter) : historyLog;
  const grouped = groupHistorySkipped(filtered);
  const histRows = grouped.map((item) => {
    if (item.isGroup) return _renderAdminSkippedGroup(item, firstParent, card);
    return _renderAdminHistRow(item.entry, firstParent);
  }).join("") || `<div class="fh-empty fh-ad-empty">No history entries yet.</div>`;
  return `
      <div class="fh-ad-panel">
        <div class="fh-ad-panel-hdr">
          <span class="fh-ad-panel-title">History log</span>
          <span class="fh-ad-panel-sub">last 30 days</span>
        </div>
        <div class="fh-ad-panel-body">
          ${filterChips}
          <div class="fh-hist-scroll">${histRows}</div>
        </div>
      </div>`;
}
function _htmlAdSettings(attr, storeItems, people) {
  const famName = attr.family_name || "Family Hub";
  const ppdollar = attr.points_per_dollar || 10;
  const showDollar = attr.show_dollar_value_to_kids || false;
  const catLabels = attr.category_labels || [];
  const penaltyAlertTime = attr.penalty_alert_time !== void 0 ? attr.penalty_alert_time : 800;
  const rankEvalWeekday = attr.rank_eval_weekday !== void 0 ? attr.rank_eval_weekday : 0;
  const rankDropThr = attr.rank_drop_threshold !== void 0 ? attr.rank_drop_threshold : 50;
  const rankGainThr = attr.rank_gain_threshold !== void 0 ? attr.rank_gain_threshold : 75;
  const roomsCfg = attr.rooms_config || {};
  const weatherEntity = attr.weather_entity || "";
  const calendarEntities = attr.today_calendar_entities || [];
  const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const labelChips = catLabels.map((l) => `
      <div class="fh-cat-chip">
        <span>${escHTML(l)}</span>
        <button class="fh-cat-chip-del" data-act="remove-cat-label"
                data-label="${escAttr(l)}" title="Remove">\xD7</button>
      </div>`).join("");
  const storeRows = storeItems.map((item) => {
    const personNames = (item.person_ids || []).map((id) => {
      var _a;
      return (_a = people.find((p) => p.person_id === id)) == null ? void 0 : _a.name;
    }).filter(Boolean).join(", ");
    return `
          <div class="fh-store-inv-row">
            <div class="fh-store-inv-info">
              <div class="fh-store-inv-name">${escHTML(item.name)}</div>
              <div class="fh-store-inv-meta">
                ${fUSD(item.dollar_value)} \xB7 ${fPts(item.points_cost)}pts \xB7
                ${item.scope === "personal" ? `Personal${personNames ? ` (${escHTML(personNames)})` : ""}` : "All kids"}
              </div>
            </div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm"
                    data-act="open-edit-store-item" data-iid="${item.item_id}"
                    title="Edit reward">${I.edit}</button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="delete-store-item"
                    data-iid="${item.item_id}" data-iname="${escAttr(item.name)}"
                    title="Delete reward">${I.trash}</button>
          </div>`;
  }).join("") || `<div class="fh-empty fh-ad-empty">No store items yet.</div>`;
  const roomToggles = ROOMS.map((room) => {
    var _a;
    const status = ((_a = roomsCfg[room.id]) == null ? void 0 : _a.status) ?? room.status;
    const visible = status !== "hidden";
    const isComingSoon = room.status === "coming";
    return `
          <div class="fh-hub-room-row" data-room-id="${escAttr(room.id)}">
            <div class="fh-hub-room-icon" style="color:${room.accent}">${room.icon}</div>
            <div class="fh-hub-room-info">
              <div class="fh-hub-room-name">${escHTML(room.label)}</div>
              <div class="fh-hub-room-sub">${escHTML(room.sub)}${isComingSoon ? ` \xB7 <em>coming soon</em>` : ""}</div>
            </div>
            <label class="fh-toggle">
              <input type="checkbox" class="fh-hub-room-toggle"
                     data-room-id="${escAttr(room.id)}"
                     ${visible ? "checked" : ""}>
              <span class="fh-toggle-slider"></span>
            </label>
          </div>`;
  }).join("");
  return `
      <div class="fh-ad-settings-grid">

        <div class="fh-ad-panel fh-ad-settings-left">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Hub configuration</span>
          </div>
          <div class="fh-ad-panel-body">
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
                      data-fname="${escAttr(famName)}" data-ppd="${ppdollar}"
                      data-palerttime="${penaltyAlertTime}"
                      data-rankweekday="${rankEvalWeekday}"
                      data-rankdrop="${rankDropThr}"
                      data-rankgain="${rankGainThr}">
                ${I.settings} Edit
              </button>
            </div>
            <div class="fh-point-row">
              <div style="flex:1;min-width:0">
                <div style="font-size:.9rem;font-weight:600">Rank evaluation</div>
                <div style="font-size:.75rem;color:var(--fh-text-sec)">
                  Every ${WEEKDAY_NAMES[rankEvalWeekday]} \xB7 Drop &lt;${rankDropThr}pts \xB7 Gain \u2265${rankGainThr}pts
                </div>
              </div>
            </div>
            <div class="fh-divider"></div>
            <div>
              <div class="fh-label" style="margin-bottom:6px">Category labels</div>
              <div class="fh-cat-labels" style="margin-bottom:8px">
                ${labelChips || `<span style="font-size:.82rem;color:var(--fh-text-sec)">No labels yet.</span>`}
              </div>
              <div class="fh-row" style="gap:6px">
                <input class="fh-input" id="cat-label-input" type="text"
                       placeholder="New label\u2026" style="flex:1">
                <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="add-cat-label">
                  ${I.plus} Add
                </button>
              </div>
            </div>
            <div class="fh-divider"></div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="export-backup"
                      style="width:100%;justify-content:center">Export backup</button>
              <button class="fh-btn fh-btn-warning fh-btn-sm" data-act="rebuild-data"
                      style="width:100%;justify-content:center">Rebuild data</button>
            </div>
          </div>
        </div>

        <div class="fh-ad-panel fh-ad-settings-hub">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Hub layout</span>
            <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="save-hub-layout">
              Save layout
            </button>
          </div>
          <div class="fh-ad-panel-body">
            <div class="fh-label" style="margin-bottom:6px">Rooms shown on the home screen</div>
            <div class="fh-field-help" style="margin-bottom:10px">
              Toggle to hide a room from the Command Center home page. Hidden rooms still exist; they just don't render a tile.
            </div>
            <div class="fh-hub-room-list">${roomToggles}</div>
            <div class="fh-divider"></div>
            <div class="fh-field">
              <label class="fh-label">Weather entity</label>
              <input class="fh-input" id="m-hub-weather" type="text"
                     value="${escAttr(weatherEntity)}"
                     placeholder="weather.home">
              <div class="fh-field-help">
                HA <code>weather.*</code> entity used in the today strip. Blank to hide.
              </div>
            </div>
            <div class="fh-field">
              <label class="fh-label">Calendar entities</label>
              <textarea class="fh-input" id="m-hub-calendars" rows="3"
                        placeholder="calendar.family&#10;calendar.school"
                        style="font-family:var(--fh-font-mono);font-size:.85rem;resize:vertical">${escHTML(calendarEntities.join("\n"))}</textarea>
              <div class="fh-field-help">
                One <code>calendar.*</code> entity per line. Powers the today strip when the Calendar room ships in v0.8.0.
              </div>
            </div>
          </div>
        </div>

        <div class="fh-ad-panel fh-ad-settings-right">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Store inventory</span>
            <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="open-add-store-item">
              ${I.plus} Add reward
            </button>
          </div>
          <div class="fh-ad-panel-body">
            <div class="fh-task-list">${storeRows}</div>
          </div>
        </div>

      </div>`;
}
function _renderAdminHistRow(e, firstParent) {
  const meta = HISTORY_META[e.type] || { label: e.type, color: "var(--fh-text-sec)" };
  const color = e.person_color || DEFAULT_COLOR;
  const ptsDelta = e.points_delta ? `<span style="color:${e.points_delta > 0 ? "var(--fh-success)" : "var(--fh-overdue)"}">
             ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>` : "";
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
        <div class="fh-avatar" style="background:${color};width:26px;height:26px;font-size:var(--fh-text-xs)">
          ${e.person_name ? ini(e.person_name) : "\u2014"}
        </div>
        <div class="fh-hist-info">
          <div class="fh-hist-label">${escHTML(meta.label)}</div>
          <div class="fh-hist-name">${escHTML(e.chore_name || e.note || "")}</div>
          <div class="fh-hist-meta">
            ${e.person_name ? escHTML(e.person_name) + " \xB7 " : ""}${relTime(e.timestamp)}
            ${ptsDelta}
          </div>
        </div>
        ${actionBtn ? `<div class="fh-hist-actions">${actionBtn}</div>` : ""}
      </div>`;
}
function _renderAdminSkippedGroup(group, firstParent, card) {
  const expanded = card._expandedSkippedDates.has(group.key);
  const penLabel = group.totalPenalty > 0 ? `\u2212${group.totalPenalty}pts` : "no penalty";
  const subItems = expanded ? group.items.map((e) => {
    const color = e.person_color || DEFAULT_COLOR;
    const pts = e.points_delta ? `<span style="color:var(--fh-overdue);font-weight:700">${e.points_delta}pts</span>` : "";
    let actionBtn = "";
    if (firstParent && e.reversible === "excuse") {
      actionBtn = `<button class="fh-btn fh-btn-warning fh-btn-sm"
                                 data-act="excuse-task"
                                 data-iid="${e.reference_id}"
                                 data-excused-by="${firstParent.person_id}"
                                 title="Reverse this penalty">
                           ${I.excuse} Excuse
                         </button>`;
    }
    return `
          <div class="fh-hist-subrow">
            <div class="fh-avatar" style="background:${color};width:24px;height:24px;font-size:var(--fh-text-xs);flex-shrink:0">
              ${e.person_name ? ini(e.person_name) : "\u2014"}
            </div>
            <div class="fh-hist-info" style="flex:1;min-width:0">
              <div class="fh-hist-name">${escHTML(e.person_name ? e.person_name + " \u2014 " : "") + escHTML(e.chore_name || "")}</div>
              <div class="fh-hist-meta">${pts}</div>
            </div>
            ${actionBtn}
          </div>`;
  }).join("") : "";
  return `
      <div class="fh-hist-group">
        <div class="fh-hist-group-hdr" data-act="toggle-skipped-group" data-key="${group.key}">
          <div class="fh-hist-info" style="flex:1;min-width:0">
            <div class="fh-hist-label" style="color:var(--fh-warning)">Skipped chores</div>
            <div class="fh-hist-name">${escHTML(group.dateDisplay)} \xB7 ${penLabel}</div>
          </div>
          <span class="fh-hist-expand-icon">${expanded ? "\u25B2" : "\u25BC"}</span>
        </div>
        ${expanded ? `<div class="fh-hist-subitems">${subItems}</div>` : ""}
      </div>`;
}
var init_modes_admin = __esm({
  "src/card/modes-admin.js"() {
    init_constants();
    init_constants();
    init_utils();
    init_rooms();
    init_modals();
  }
});

// src/card/hub-skins/classic.js
function _htmlHeader2(familyName, globalPaused) {
  const now = /* @__PURE__ */ new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `
        <div class="fh-home-header">
            <div class="fh-home-family">${escHTML(familyName)}</div>
            <div class="fh-home-header-right">
                <div class="fh-home-date">${day}, ${date}</div>
                ${globalPaused ? `<div class="fh-home-paused-pill">PAUSED</div>` : ""}
            </div>
        </div>
    `;
}
function _htmlAgents(people, approvalQueue, card) {
  if (!people.length) return "";
  const allTasks = card._attrs("sensor.family_hub_claimable_tasks").all_tasks || [];
  const tiles = people.map((person) => {
    var _a;
    const color = person.avatar_color || DEFAULT_COLOR;
    const code = person.code || "";
    const theme = getTheme(person.theme_key || "classic");
    const tint = theme.tint;
    const sigil = theme.sigil;
    const eid = card._personEntityId(person.name);
    const balance = parseInt(((_a = card._states(eid)) == null ? void 0 : _a.state) ?? person.lifetime_points ?? 0);
    const rankTitle = theme.rankTitle(person.rank_index !== void 0 ? person.rank_index : 0);
    const subLabel = theme.homeTileSubLabel(person);
    const openCount = allTasks.filter(
      (t) => t.assigned_to === person.person_id && t.status === "pending"
    ).length;
    const pendingCount = approvalQueue.filter((t) => t.person_id === person.person_id).length;
    const allowanceHTML = person.allowance_points && person.allowance_schedule ? `<div class="fh-home-agent-allowance">+${person.allowance_points}/${person.allowance_schedule === "weekly" ? "wk" : person.allowance_schedule === "bi_weekly" ? "2wk" : "mo"}</div>` : "";
    return `
            <div class="fh-home-agent-tile"
                 data-act="nav" data-nav-view="person:${escAttr(person.person_id)}"
                 style="--tile-color:${color};--tile-tint:${tint}">
                <div class="fh-home-agent-sigil">${sigil}</div>
                ${pendingCount > 0 ? `<div class="fh-home-agent-pending-dot" title="${pendingCount} pending"></div>` : ""}
                <div class="fh-home-agent-code">AGT &middot; ${code ? escHTML(code) : escHTML(person.name.toUpperCase())}</div>
                <div class="fh-home-agent-name">${escHTML(person.name)}</div>
                <div class="fh-home-agent-sublabel">${escHTML(rankTitle)} &middot; ${escHTML(subLabel)}</div>
                <div class="fh-home-agent-spacer"></div>
                <div class="fh-home-agent-dual">
                    <div class="fh-home-agent-stat">
                        <span class="fh-home-agent-stat-num">${fPts(balance)}</span>
                        <span class="fh-home-agent-stat-lbl">PTS</span>
                    </div>
                    <div class="fh-home-agent-stat-div"></div>
                    <div class="fh-home-agent-stat">
                        <span class="fh-home-agent-stat-num" style="${openCount > 0 ? `color:${color}` : "color:var(--fh-text-sec)"}">${openCount}</span>
                        <span class="fh-home-agent-stat-lbl">OPEN</span>
                    </div>
                </div>
                ${allowanceHTML}
            </div>`;
  }).join("");
  return `
        <div class="fh-home-section">
            <div class="fh-home-section-label">// AGENTS ON DUTY</div>
            <div class="fh-home-agents-row">${tiles}</div>
        </div>`;
}
function _htmlRooms(card, naAttr) {
  const roomsCfg = naAttr.rooms_config || {};
  const tiles = ROOMS.map((room) => {
    var _a;
    const status = ((_a = roomsCfg[room.id]) == null ? void 0 : _a.status) || room.status;
    if (status === "hidden") return "";
    const isLive = status === "live";
    const stats = isLive ? room.getStats(card) : [];
    const statsHTML = stats.map((s) => `
            <div class="fh-home-room-stat">
                <span class="fh-home-room-stat-num" style="color:${s.accent || room.accent}">${s.value}</span>
                <span class="fh-home-room-stat-lbl">${escHTML(s.label)}</span>
            </div>
        `).join("");
    return `
            <div class="fh-home-room-tile ${isLive ? "live" : "coming"}"
                 data-act="nav" data-nav-view="room:${escAttr(room.id)}"
                 style="--room-accent:${room.accent}">
                <div class="fh-home-room-icon" style="color:${room.accent}">${room.icon}</div>
                <div class="fh-home-room-body">
                    <div class="fh-home-room-label">${escHTML(room.label)}</div>
                    <div class="fh-home-room-sub">${escHTML(room.sub)}</div>
                    ${isLive && stats.length ? `<div class="fh-home-room-stats">${statsHTML}</div>` : ""}
                    ${!isLive ? `
                        <div class="fh-home-room-coming">COMING SOON</div>
                        ${room.preview ? `<div class="fh-home-room-preview">${escHTML(room.preview)}</div>` : ""}
                    ` : ""}
                </div>
            </div>
        `;
  }).join("");
  return `
        <div class="fh-home-section">
            <div class="fh-home-section-label">ROOMS</div>
            <div class="fh-home-rooms-grid">${tiles}</div>
        </div>
    `;
}
function _htmlTodayStrip(approvalQueue, weatherEntity, card) {
  var _a, _b;
  const pendingCount = approvalQueue.length;
  let weatherHTML = "";
  if (weatherEntity) {
    const ws = card._states(weatherEntity);
    if (ws) {
      const cond = ws.state || "";
      const temp = (_a = ws.attributes) == null ? void 0 : _a.temperature;
      const unit = ((_b = ws.attributes) == null ? void 0 : _b.temperature_unit) || "\xB0";
      weatherHTML = `
                <div class="fh-home-today-weather">
                    <div class="fh-home-today-weather-icon">${_weatherIcon(cond)}</div>
                    <div>
                        <div class="fh-home-today-temp">${temp !== void 0 ? `${Math.round(temp)}${unit}` : "\u2014"}</div>
                        <div class="fh-home-today-cond">${escHTML(_weatherLabel(cond))}</div>
                    </div>
                </div>
            `;
    }
  }
  return `
        <div class="fh-home-today-strip">
            ${weatherHTML}
            <div class="fh-home-today-flex">
                ${pendingCount > 0 ? `
                    <div class="fh-home-today-approvals">
                        <span class="fh-home-today-approvals-badge">${pendingCount}</span>
                        <span class="fh-home-today-approvals-lbl">${pendingCount === 1 ? "approval pending" : "approvals pending"}</span>
                    </div>
                ` : `
                    <div class="fh-home-today-quiet">All clear &#8212; no approvals waiting</div>
                `}
            </div>
        </div>
    `;
}
function _weatherLabel(cond) {
  const MAP = {
    sunny: "Sunny",
    clear_night: "Clear",
    partlycloudy: "Partly Cloudy",
    cloudy: "Cloudy",
    fog: "Foggy",
    rainy: "Rain",
    pouring: "Heavy Rain",
    snowy: "Snow",
    snowy_rainy: "Sleet",
    windy: "Windy",
    windy_variant: "Windy",
    lightning: "Thunderstorm",
    lightning_rainy: "Thunderstorm",
    hail: "Hail",
    exceptional: "Unusual"
  };
  return MAP[cond] || cond.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function _weatherIcon(cond) {
  if (cond === "sunny" || cond === "clear_night") {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>`;
  }
  if (cond === "rainy" || cond === "pouring") {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19a4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4m0-6a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m12-3a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3M6 5a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1z"/></svg>`;
  }
  if (cond === "snowy" || cond === "snowy_rainy") {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m22 11-1.5-1.5-2 2L17 10l2-2-1.5-1.5L16 8l-1.5-1.5.5-2-2.5-.5.5 2L11 7.5V5l-1.5-1.5L8 5v2.5L6.5 6.5 6 4l-2.5.5.5 2L2.5 8 1 9.5l1.5 1.5 2-2L6 10.5l-2 2L5.5 14 7 12.5 8.5 14l-.5 2 2.5.5-.5-2 1.5-1.5v2.5l1.5 1.5 1.5-1.5V13l1.5 1.5 1.5-1.5-1.5-1.5 2-2 1.5 1.5 1.5-1.5z"/></svg>`;
  }
  if (cond.includes("cloud") || cond === "fog") {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`;
  }
  if (cond.includes("lightning")) {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`;
}
var classicSkin;
var init_classic2 = __esm({
  "src/card/hub-skins/classic.js"() {
    init_rooms();
    init_themes();
    init_utils();
    init_constants();
    classicSkin = {
      render(card) {
        const naAttr = card._attrs("sensor.family_hub_needs_attention");
        const people = card._people().filter((p) => p.active !== false);
        const familyName = naAttr.family_name || "Family Hub";
        const globalPaused = !!naAttr.penalties_paused_global;
        const approvalQueue = naAttr.approval_queue || [];
        const weatherEntity = naAttr.weather_entity || "";
        return `
            ${_htmlHeader2(familyName, globalPaused)}
            ${_htmlAgents(people, approvalQueue, card)}
            ${_htmlRooms(card, naAttr)}
            ${_htmlTodayStrip(approvalQueue, weatherEntity, card)}
        `;
      }
    };
  }
});

// src/card/hub-skins/index.js
function getHubSkin(key) {
  return HUB_SKINS[key] || HUB_SKINS.classic;
}
var HUB_SKINS;
var init_hub_skins = __esm({
  "src/card/hub-skins/index.js"() {
    init_classic2();
    HUB_SKINS = {
      classic: classicSkin
    };
  }
});

// src/card/modes-home.js
function htmlHome(card) {
  const naAttr = card._attrs("sensor.family_hub_needs_attention");
  const skinKey = card._cfg.hub_skin || naAttr.hub_skin || "classic";
  return getHubSkin(skinKey).render(card);
}
function htmlNavBack(label) {
  return `
        <div class="fh-nav-back-bar" data-act="nav-back">
            <span class="fh-nav-back-chevron">&#8592;</span>
            <span class="fh-nav-back-label">${escHTML(label)}</span>
        </div>
    `;
}
var init_modes_home = __esm({
  "src/card/modes-home.js"() {
    init_hub_skins();
    init_utils();
  }
});

// src/card/dispatch.js
function dispatch(act, el, card) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const sr = card.shadowRoot;
  const v = (id) => {
    var _a2;
    return ((_a2 = sr.getElementById(id)) == null ? void 0 : _a2.value) ?? "";
  };
  const b = (id) => {
    var _a2;
    return ((_a2 = sr.getElementById(id)) == null ? void 0 : _a2.checked) ?? false;
  };
  const int = (id) => parseInt(v(id) || "0");
  switch (act) {
    // ---- Navigation ----------------------------------------------------
    // Navigate to a view (pushes current view onto back stack)
    case "nav": {
      const target = el.dataset.navView;
      if (!target) break;
      card._backStack.push(card._view || "home");
      card._view = target;
      card._doRender(true);
      break;
    }
    // Navigate back (pops back stack, falls back to home)
    case "nav-back":
      card._view = card._backStack.pop() || "home";
      card._doRender(true);
      break;
    case "filter":
      card._filter = card._filter === el.dataset.pid ? null : el.dataset.pid;
      card._doRender(true);
      break;
    case "tab":
      card._tab = el.dataset.tab;
      card._doRender(true);
      break;
    case "admin-sec":
      card._adminSec = el.dataset.sec;
      card._doRender(true);
      break;
    case "hist-filter":
      card._histFilter = el.dataset.hpid || null;
      card._doRender(true);
      break;
    case "chore-filter":
      card._choreFilter = el.dataset.cpid || null;
      card._doRender(true);
      break;
    // ---- Admin chore table (S9 P3 item 5) --------------------------------
    // Select a chore row → open inline editor panel at ≥1280px
    case "select-chore-row":
      card._adminSelectedChoreId = el.dataset.cid || null;
      card._doRender(true);
      break;
    // Close inline editor panel (✕ button or after save)
    case "close-chore-panel":
      card._adminSelectedChoreId = null;
      card._choreFormTab = "details";
      card._doRender(true);
      break;
    // Chore form tab switch (modal + inline panel) — CSS-only swap to preserve
    // user input on inactive panes. NO _doRender call: panes are all already in DOM.
    case "chore-tab": {
      const tab = el.dataset.tab;
      if (!tab) break;
      card._choreFormTab = tab;
      sr.querySelectorAll(".fh-chore-tab").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.tab === tab);
      });
      sr.querySelectorAll(".fh-chore-tab-pane").forEach((p) => {
        p.style.display = p.dataset.tab === tab ? "" : "none";
      });
      card._syncModalUI();
      break;
    }
    // Sort chore table — click same col twice reverses, third click clears
    case "sort-admin-chores": {
      const col = el.dataset.col || null;
      if (!col) {
        card._adminSort = { col: null, dir: "asc" };
      } else {
        const cur = card._adminSort || { col: null, dir: "asc" };
        if (cur.col === col) {
          card._adminSort = cur.dir === "asc" ? { col, dir: "desc" } : { col: null, dir: "asc" };
        } else {
          card._adminSort = { col, dir: "asc" };
        }
      }
      card._doRender(true);
      break;
    }
    // Collapse / expand a category group header
    case "toggle-admin-cat": {
      const cat = el.dataset.cat;
      if (!cat) break;
      if (!card._adminCollapsedCats) card._adminCollapsedCats = /* @__PURE__ */ new Set();
      if (card._adminCollapsedCats.has(cat)) card._adminCollapsedCats.delete(cat);
      else card._adminCollapsedCats.add(cat);
      card._doRender(true);
      break;
    }
    // ---- Task completion -----------------------------------------------
    case "complete": {
      const tid = el.dataset.tid;
      const pid = el.dataset.pid;
      if (!tid || !pid) break;
      const streak = parseInt(el.dataset.streak || "0");
      const milestone = parseInt(el.dataset.milestone || "0");
      if (milestone > 0 && (streak + 1) % milestone === 0) {
        card._celebration = { name: el.dataset.name || "Mission", streak: streak + 1 };
        setTimeout(() => {
          if (card._celebration) {
            card._celebration = null;
            card._doRender(true);
          }
        }, 3e3);
      }
      card._svc("complete_task", { task_id: tid, person_id: pid });
      card._flashing.add(tid);
      card._pendingSubmit.add(tid);
      card._doRender(true);
      setTimeout(() => {
        card._flashing.delete(tid);
        card._doRender(false);
      }, FLASH_MS + 50);
      setTimeout(() => {
        if (card._pendingSubmit.has(tid)) {
          card._pendingSubmit.delete(tid);
          card._doRender(false);
        }
      }, 35e3);
      break;
    }
    // ---- Dismiss milestone celebration ---------------------------------
    case "dismiss-celebration":
      card._celebration = null;
      card._doRender(true);
      break;
    // ---- Description toggle --------------------------------------------
    case "toggle-desc": {
      const id = el.dataset.id;
      if (card._expandedDescs.has(id)) card._expandedDescs.delete(id);
      else card._expandedDescs.add(id);
      card._doRender(true);
      break;
    }
    // ---- Skipped-group expand/collapse ---------------------------------
    case "toggle-skipped-group": {
      const key = el.dataset.key;
      if (card._expandedSkippedDates.has(key)) card._expandedSkippedDates.delete(key);
      else card._expandedSkippedDates.add(key);
      card._doRender(true);
      break;
    }
    // ---- Task / redemption approvals -----------------------------------
    case "approve-task": {
      const parent = card._people().find((p) => p.type === "parent");
      card._svc("approve_task", { task_id: el.dataset.tid, approved_by: (parent == null ? void 0 : parent.person_id) || "" });
      break;
    }
    case "deny-task": {
      const parent = card._people().find((p) => p.type === "parent");
      card._svc("deny_task", { task_id: el.dataset.tid, denied_by: (parent == null ? void 0 : parent.person_id) || "" });
      break;
    }
    case "approve-redemption": {
      const parent = card._people().find((p) => p.type === "parent");
      card._svc("approve_redemption", { redemption_id: el.dataset.rid, approved_by: (parent == null ? void 0 : parent.person_id) || "" });
      break;
    }
    case "decline-redemption": {
      const parent = card._people().find((p) => p.type === "parent");
      card._svc("decline_redemption", { redemption_id: el.dataset.rid, declined_by: (parent == null ? void 0 : parent.person_id) || "" });
      break;
    }
    // ---- v0.4.0 Admin correction actions -------------------------------
    case "excuse-task":
      card._svc("excuse_task", {
        instance_id: el.dataset.iid,
        excused_by: el.dataset.excusedBy,
        reason: ""
      });
      break;
    case "mark-complete":
      card._svc("mark_task_complete", {
        instance_id: el.dataset.iid,
        marked_by: el.dataset.markedBy,
        reason: ""
      });
      break;
    case "reject-task":
      card._svc("reject_task", {
        instance_id: el.dataset.iid,
        rejected_by: el.dataset.rejectedBy,
        reason: ""
      });
      break;
    // ---- Store redemption request --------------------------------------
    case "redeem":
      card._svc("request_redemption", { person_id: el.dataset.pid, item_id: el.dataset.iid });
      break;
    // ---- Delete chore --------------------------------------------------
    case "delete-chore":
      if (!confirm(`Delete "${el.dataset.cname}"?

This cannot be undone.`)) break;
      card._adminSelectedChoreId = null;
      card._svc("delete_chore", { chore_id: el.dataset.cid });
      break;
    // ---- Delete store item ---------------------------------------------
    case "delete-store-item":
      if (!confirm(`Delete reward "${el.dataset.iname}"?

This cannot be undone.`)) break;
      card._svc("delete_store_item", { item_id: el.dataset.iid });
      break;
    // ---- Category label management ------------------------------------
    case "remove-cat-label": {
      const labelToRemove = el.dataset.label;
      const current = card._attrs("sensor.family_hub_needs_attention").category_labels || [];
      card._svc("update_settings", { category_labels: current.filter((l) => l !== labelToRemove) });
      break;
    }
    case "add-cat-label": {
      const input = sr.getElementById("cat-label-input");
      const newLabel = (_a = input == null ? void 0 : input.value) == null ? void 0 : _a.trim();
      if (!newLabel) break;
      const current = card._attrs("sensor.family_hub_needs_attention").category_labels || [];
      if (!current.includes(newLabel)) {
        card._svc("update_settings", { category_labels: [...current, newLabel] });
      }
      if (input) input.value = "";
      break;
    }
    // ---- Hub Layout save (S9 P3) ---------------------------------------
    // Reads all room visibility toggles + weather entity + calendar
    // entities from the panel and pushes one update_settings call.
    case "save-hub-layout": {
      const roomsCfg = {};
      sr.querySelectorAll(".fh-hub-room-toggle").forEach((input) => {
        const id = input.dataset.roomId;
        if (!id) return;
        roomsCfg[id] = { status: input.checked ? "live" : "hidden" };
      });
      const weather = ((_c = (_b = sr.getElementById("m-hub-weather")) == null ? void 0 : _b.value) == null ? void 0 : _c.trim()) || "";
      const calRaw = ((_d = sr.getElementById("m-hub-calendars")) == null ? void 0 : _d.value) || "";
      const calendars = calRaw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
      card._svc("update_settings", {
        rooms_config: roomsCfg,
        weather_entity: weather,
        today_calendar_entities: calendars
      });
      break;
    }
    // ---- Penalty pause toggles (v0.4.2) --------------------------------
    // Global penalty pause — in Settings tab.
    // The checkbox is "Penalties active" (checked = running, unchecked = paused),
    // so we invert: penalties_paused = !checked.
    case "toggle-global-penalty": {
      const checked = el.checked ?? ((_e = el.querySelector("input")) == null ? void 0 : _e.checked) ?? true;
      card._svc("update_settings", { penalties_paused: !checked });
      break;
    }
    // Per-person penalty pause — in Overview tab.
    // The checkbox is also "Penalties active" (checked = on, unchecked = paused).
    // We read the person_id from data-pid and invert the checkbox value.
    case "toggle-person-penalty": {
      const pid = el.dataset.pid || ((_f = el.closest("[data-pid]")) == null ? void 0 : _f.dataset.pid);
      const checked = el.checked ?? ((_g = el.querySelector("input")) == null ? void 0 : _g.checked) ?? true;
      if (pid) card._svc("update_person", { person_id: pid, penalties_paused: !checked });
      break;
    }
    // ---- Backup --------------------------------------------------------
    case "export-backup":
      card._svc("export_backup", {});
      break;
    case "rebuild-data":
      if (!confirm(
        "Rebuild data?\n\nThis will remove ghost records, orphaned instances, and duplicates. A summary will appear as a Home Assistant notification.\n\nThis cannot be undone."
      )) break;
      card._svc("rebuild_data", {});
      break;
    // ---- Open modals ---------------------------------------------------
    case "open-award":
      card._modal = { type: "award", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
      card._doRender(true);
      break;
    case "open-deduct":
      card._modal = { type: "deduct", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
      card._doRender(true);
      break;
    case "open-add-task":
      card._modal = { type: "add-task", data: {} };
      card._doRender(true);
      break;
    case "open-add-chore":
      card._adminSelectedChoreId = null;
      card._modal = { type: "add-chore", data: {} };
      card._doRender(true);
      break;
    case "open-edit-chore": {
      const chores = card._attrs("sensor.family_hub_needs_attention").active_chores || [];
      const chore = chores.find((c) => c.chore_id === el.dataset.cid);
      if (!chore) break;
      card._adminSelectedChoreId = null;
      card._modal = { type: "edit-chore", data: { chore } };
      card._doRender(true);
      break;
    }
    case "open-add-store-item":
      card._modal = { type: "add-store-item", data: {} };
      card._doRender(true);
      break;
    case "open-edit-store-item": {
      const items = card._attrs("sensor.family_hub_needs_attention").store_items || [];
      const item = items.find((i) => i.item_id === el.dataset.iid);
      if (!item) break;
      card._modal = { type: "edit-store-item", data: { item } };
      card._doRender(true);
      break;
    }
    case "open-add-person":
      card._modal = { type: "add-person", data: {} };
      card._doRender(true);
      break;
    case "open-edit-person":
      card._modal = {
        type: "edit-person",
        data: {
          pid: el.dataset.pid,
          pname: el.dataset.pname,
          ptype: el.dataset.ptype,
          pcolor: el.dataset.pcolor,
          allowancePts: parseInt(el.dataset.pallowpts || "0"),
          allowanceSched: el.dataset.pallowsched || "weekly",
          allowanceWday: parseInt(el.dataset.pallowwday ?? "5"),
          allowanceMday: parseInt(el.dataset.pallowmday || "1"),
          notifyTarget: el.dataset.pnotify || "",
          code: el.dataset.pcode || "",
          theme: el.dataset.ptheme || "classic",
          rankIdx: parseInt(el.dataset.prankidx || "0"),
          dropThr: el.dataset.pdropThr || "",
          gainThr: el.dataset.pgainThr || "",
          childMode: el.dataset.pchildmode === "true"
        }
      };
      card._doRender(true);
      break;
    case "open-confirm-remove-person":
      card._modal = { type: "confirm-remove-person", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
      card._doRender(true);
      break;
    case "open-edit-settings":
      card._modal = { type: "edit-settings", data: {
        fname: el.dataset.fname,
        ppd: el.dataset.ppd,
        penaltyAlertTime: parseInt(el.dataset.palerttime ?? "800"),
        rankWeekday: parseInt(el.dataset.rankweekday ?? "0"),
        rankDrop: parseInt(el.dataset.rankdrop ?? "50"),
        rankGain: parseInt(el.dataset.rankgain ?? "75")
      } };
      card._doRender(true);
      break;
    case "open-claim":
      card._modal = { type: "claim", data: { tid: el.dataset.tid, name: el.dataset.name } };
      card._doRender(true);
      break;
    case "open-add-reminder":
      card._modal = { type: "add-reminder", data: { pid: el.dataset.pid || null } };
      card._doRender(true);
      break;
    case "open-edit-streaks":
      card._modal = { type: "edit-streaks", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
      card._doRender(true);
      break;
    // ---- Close modal ---------------------------------------------------
    case "close-modal":
      card._closeModal();
      break;
    // ---- Modal OK handlers --------------------------------------------
    case "ok-point-adjust": {
      const amount = parseFloat(v("m-amount"));
      const atype = v("m-atype");
      const reason = v("m-reason");
      const pid = v("m-pid");
      const amode = v("m-amode");
      if (!amount || amount <= 0) break;
      const data = { person_id: pid, reason };
      if (atype === "dollars") data.dollar_amount = amount;
      else data.points = Math.round(amount);
      card._svc(amode === "award" ? "award_bonus_points" : "deduct_points", data);
      card._closeModal();
      break;
    }
    case "ok-add-task": {
      const taskType = v("m-tasktype") || "assigned";
      const name = v("m-tname").trim();
      if (!name) break;
      if (taskType === "reminder") {
        card._svc("add_chore", {
          name,
          description: v("m-tdesc").trim() || void 0,
          chore_type: "reminder",
          assigned_to: [v("m-trperson")].filter(Boolean),
          recurrence_type: v("m-trrec"),
          approval_required: false,
          points: 0,
          category_label: ""
        });
      } else if (taskType === "claimable") {
        const cpts = parseInt(v("m-tcpts") || "20");
        const cexpiry = parseInt(v("m-tcexpiry") || "7");
        card._svc("add_chore", {
          name,
          description: v("m-tdesc").trim() || void 0,
          chore_type: "claimable",
          points: cpts,
          approval_required: false,
          recurrence_type: "one_time",
          expires_after_days: cexpiry,
          category_label: "Bonus"
        });
      } else {
        const assigned = _selectedPersonIds("m-tp-person", sr);
        const expiry = parseInt(v("m-texpiry") || "0");
        const data = {
          name,
          description: v("m-tdesc").trim() || void 0,
          assigned_to: assigned,
          points: int("m-tpts"),
          approval_required: b("m-tappr")
        };
        if (expiry > 0) data.expires_after_days = expiry;
        card._svc("add_task", data);
      }
      card._closeModal();
      break;
    }
    case "ok-add-chore":
    case "ok-edit-chore": {
      const name = v("m-cname").trim();
      if (!name) break;
      const isEdit = act === "ok-edit-chore";
      const recType = v("m-crec");
      const ctype = v("m-ctype");
      const assigned = _selectedPersonIds("m-assign-person", sr);
      const weekdays = Array.from(sr.querySelectorAll(".m-wd-day:checked")).map((cb) => parseInt(cb.value));
      const dayFilter = Array.from(sr.querySelectorAll(".m-df-day:checked")).map((cb) => parseInt(cb.value));
      const iconVal = v("m-cicon").trim().toLowerCase();
      const data = {
        name,
        chore_type: ctype,
        category_label: v("m-clabel"),
        assigned_to: assigned,
        points: int("m-cpts"),
        approval_required: b("m-cappr"),
        penalty_enabled: b("m-cpenalty"),
        penalty_points: int("m-cpenalty-pts"),
        icon: iconVal
      };
      if (b("m-cpenalty")) {
        const thresh = parseInt(v("m-daily-threshold") || "0");
        if (thresh > 0) data.daily_penalty_after_days = thresh;
      }
      if (ctype === "claimable") {
        data.claimable_subtype = v("m-csubtype") || "fcfs";
        if (data.claimable_subtype === "multi_claim") {
          data.max_claimants = Math.max(2, int("m-max-claimants") || 2);
          data.multi_claim_points_mode = v("m-points-mode") || "full";
        }
      }
      const desc = v("m-cdesc").trim();
      if (desc) data.description = desc;
      const expirySection = sr.getElementById("m-chore-expiry-section");
      const expiryVisible = expirySection && expirySection.style.display !== "none";
      if (expiryVisible) {
        const expiryVal = parseInt(v("m-cexpiry") || "0");
        if (expiryVal > 0) data.expires_after_days = expiryVal;
      }
      if (isEdit) {
        data.chore_id = v("m-cid");
        data.weekdays = weekdays;
        data.day_filter = dayFilter;
        data.recurrence = {
          type: recType,
          weekdays,
          day_filter: dayFilter,
          ...recType === "monthly_on_date" ? { day_of_month: Math.max(1, Math.min(31, int("m-dom"))) } : {}
        };
      } else {
        data.recurrence_type = recType;
        if (weekdays.length) data.weekdays = weekdays;
        if (dayFilter.length) data.day_filter = dayFilter;
        if (recType === "monthly_on_date")
          data.day_of_month = Math.max(1, Math.min(31, int("m-dom")));
      }
      data.streak_milestone = Math.max(0, int("m-streak-milestone") || 0);
      data.streak_bonus_points = Math.max(0, int("m-streak-bonus") || 0);
      const rtRaw = parseInt(v("m-reminder-time") ?? "-1");
      data.reminder_time = isNaN(rtRaw) ? -1 : rtRaw;
      card._svc(isEdit ? "update_chore" : "add_chore", data);
      card._closeModal();
      break;
    }
    // Inline panel save — same logic as ok-edit-chore but closes panel instead of modal
    case "ok-edit-chore-inline": {
      const name = v("m-cname").trim();
      if (!name) break;
      const recType = v("m-crec");
      const ctype = v("m-ctype");
      const assigned = _selectedPersonIds("m-assign-person", sr);
      const weekdays = Array.from(sr.querySelectorAll(".m-wd-day:checked")).map((cb) => parseInt(cb.value));
      const dayFilter = Array.from(sr.querySelectorAll(".m-df-day:checked")).map((cb) => parseInt(cb.value));
      const iconVal = v("m-cicon").trim().toLowerCase();
      const data = {
        chore_id: v("m-cid"),
        name,
        chore_type: ctype,
        category_label: v("m-clabel"),
        assigned_to: assigned,
        points: int("m-cpts"),
        approval_required: b("m-cappr"),
        penalty_enabled: b("m-cpenalty"),
        penalty_points: int("m-cpenalty-pts"),
        icon: iconVal,
        weekdays,
        day_filter: dayFilter,
        recurrence: {
          type: recType,
          weekdays,
          day_filter: dayFilter,
          ...recType === "monthly_on_date" ? { day_of_month: Math.max(1, Math.min(31, int("m-dom"))) } : {}
        }
      };
      if (b("m-cpenalty")) {
        const thresh = parseInt(v("m-daily-threshold") || "0");
        if (thresh > 0) data.daily_penalty_after_days = thresh;
      }
      if (ctype === "claimable") {
        data.claimable_subtype = v("m-csubtype") || "fcfs";
        if (data.claimable_subtype === "multi_claim") {
          data.max_claimants = Math.max(2, int("m-max-claimants") || 2);
          data.multi_claim_points_mode = v("m-points-mode") || "full";
        }
      }
      const desc = v("m-cdesc").trim();
      if (desc) data.description = desc;
      const expirySection = sr.getElementById("m-chore-expiry-section");
      const expiryVisible = expirySection && expirySection.style.display !== "none";
      if (expiryVisible) {
        const expiryVal = parseInt(v("m-cexpiry") || "0");
        if (expiryVal > 0) data.expires_after_days = expiryVal;
      }
      data.streak_milestone = Math.max(0, int("m-streak-milestone") || 0);
      data.streak_bonus_points = Math.max(0, int("m-streak-bonus") || 0);
      const rtRaw = parseInt(v("m-reminder-time") ?? "-1");
      data.reminder_time = isNaN(rtRaw) ? -1 : rtRaw;
      card._svc("update_chore", data);
      card._adminSelectedChoreId = null;
      card._choreFormTab = "details";
      card._doRender(true);
      break;
    }
    case "set-streak": {
      const cid = el.dataset.cid;
      const pid = el.dataset.pid;
      const count = Math.max(0, parseInt(((_h = sr.getElementById(`m-streak-${cid}`)) == null ? void 0 : _h.value) || "0"));
      card._svc("set_streak", { person_id: pid, chore_id: cid, count });
      break;
    }
    case "ok-add-store-item": {
      const name = v("m-sname").trim();
      const dollar = parseFloat(v("m-sdollar"));
      if (!name || !dollar || dollar <= 0) break;
      const scope = v("m-sscope");
      const data = { name, dollar_value: dollar, scope };
      const desc = v("m-sdesc").trim();
      if (desc) data.description = desc;
      if (scope === "personal") data.person_ids = _selectedPersonIds("m-sp-person", sr);
      card._svc("add_store_item", data);
      card._closeModal();
      break;
    }
    case "ok-edit-store-item": {
      const iid = v("m-eiid");
      const name = v("m-sname").trim();
      const dollar = parseFloat(v("m-sdollar"));
      if (!iid || !name || !dollar || dollar <= 0) break;
      const scope = v("m-sscope");
      const data = { item_id: iid, name, dollar_value: dollar, scope };
      const desc = v("m-sdesc").trim();
      if (desc !== void 0) data.description = desc;
      data.person_ids = scope === "personal" ? _selectedPersonIds("m-sp-person", sr) : [];
      card._svc("update_store_item", data);
      card._closeModal();
      break;
    }
    case "ok-add-person": {
      const name = v("m-pname").trim();
      if (!name) break;
      card._svc("add_person", { name, person_type: v("m-ptype"), avatar_color: v("m-pcolor") });
      card._closeModal();
      break;
    }
    case "ok-edit-person": {
      const name = v("m-pname").trim();
      if (!name) break;
      const dropThrStr = v("m-pdropThr").trim();
      const gainThrStr = v("m-pgainThr").trim();
      card._svc("update_person", {
        person_id: v("m-pid"),
        name,
        avatar_color: v("m-pcolor"),
        type: v("m-ptype"),
        allowance_points: parseInt(v("m-allowance-pts") || "0"),
        allowance_schedule: v("m-allowance-schedule"),
        allowance_weekday: parseInt(v("m-allowance-weekday")),
        allowance_monthday: parseInt(v("m-allowance-monthday")),
        notify_target: v("m-pnotify").trim(),
        code: v("m-pcode").trim().toUpperCase(),
        theme_key: v("m-ptheme"),
        rank_index: parseInt(v("m-prankidx") || "0"),
        rank_drop_threshold: dropThrStr !== "" ? parseInt(dropThrStr) : null,
        rank_gain_threshold: gainThrStr !== "" ? parseInt(gainThrStr) : null,
        child_mode: b("m-pchildmode")
      });
      card._closeModal();
      break;
    }
    case "ok-remove-person": {
      const pid = v("m-rpid");
      if (!pid) break;
      card._svc("remove_person", { person_id: pid });
      card._closeModal();
      break;
    }
    case "ok-edit-settings": {
      const fname = v("m-fname").trim();
      const ppd = parseInt(v("m-ppd") || "10");
      const alertTime = parseInt(v("m-alert-time") ?? "-1");
      if (!fname) break;
      card._svc("update_settings", {
        family_name: fname,
        points_per_dollar: ppd,
        penalty_alert_time: isNaN(alertTime) ? 800 : alertTime,
        rank_eval_weekday: parseInt(v("m-rank-weekday") || "0"),
        rank_drop_threshold: parseInt(v("m-rank-drop") || "50"),
        rank_gain_threshold: parseInt(v("m-rank-gain") || "75")
      });
      card._closeModal();
      break;
    }
    case "ok-claim": {
      const tid = v("m-cltid");
      const pid = v("m-clperson");
      if (!tid || !pid) break;
      card._svc("claim_task", { task_id: tid, person_id: pid });
      card._closeModal();
      break;
    }
    case "ok-add-reminder": {
      const name = v("m-rname").trim();
      const pid = v("m-rperson");
      if (!name || !pid) break;
      card._svc("add_chore", {
        name,
        chore_type: "reminder",
        assigned_to: [pid],
        recurrence_type: v("m-rrec"),
        approval_required: false,
        points: 0,
        category_label: ""
      });
      card._closeModal();
      break;
    }
    // ---- Icon picker (always-visible grid, no dropdown) -----------------
    // Selection only — no preview/grid-toggle DOM. The hidden m-cicon input
    // carries the value to the save handlers.
    case "pick-icon": {
      const key = el.dataset.icon;
      const hidden = sr.getElementById("m-cicon");
      if (hidden) hidden.value = key;
      sr.querySelectorAll(".fh-icon-cell").forEach(
        (cell) => cell.classList.toggle("selected", cell.dataset.icon === key)
      );
      break;
    }
  }
}
function _selectedPersonIds(cbClass, sr) {
  return Array.from(
    sr.querySelectorAll(`.${cbClass}:checked`)
  ).map((cb) => cb.value);
}
var init_dispatch = __esm({
  "src/card/dispatch.js"() {
    init_constants();
  }
});

// src/card/FamilyHubCard.js
var FamilyHubCard;
var init_FamilyHubCard = __esm({
  "src/card/FamilyHubCard.js"() {
    init_css();
    init_constants();
    init_utils();
    init_modes_personal();
    init_modes_admin();
    init_modes_home();
    init_rooms();
    init_themes();
    init_dispatch();
    init_modals();
    FamilyHubCard = class extends HTMLElement {
      // ---- HA card API -------------------------------------------------------
      static getStubConfig() {
        return { mode: "command_center" };
      }
      static getConfigElement() {
        return document.createElement("family-hub-card-editor");
      }
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._cfg = {};
        this._hass = null;
        this._lastKeys = {};
        this._modal = null;
        this._filter = null;
        this._tab = "tasks";
        this._adminSec = "today";
        this._flashing = /* @__PURE__ */ new Set();
        this._pendingSubmit = /* @__PURE__ */ new Set();
        this._expandedDescs = /* @__PURE__ */ new Set();
        this._histFilter = null;
        this._choreFilter = null;
        this._expandedSkippedDates = /* @__PURE__ */ new Set();
        this._view = "home";
        this._backStack = [];
        this._viewPersonId = null;
        this._celebration = null;
        this._dragId = null;
        this._dragOverId = null;
        this._sortedChores = [];
        this._adminSelectedChoreId = null;
        this._adminSort = { col: null, dir: "asc" };
        this._adminCollapsedCats = /* @__PURE__ */ new Set();
        this._choreFormTab = "details";
        this._abortCtrl = null;
        this._retryTimer = null;
      }
      // ---- Web Component lifecycle -------------------------------------------
      /**
       * Attach ALL event listeners ONCE in connectedCallback.
       * _doRender() NEVER touches event listeners — this is the fix for the
       * v0.2.2 memory leak caused by re-attaching listeners on every render.
       */
      connectedCallback() {
        this._abortCtrl = new AbortController();
        const { signal } = this._abortCtrl;
        const root = this.shadowRoot;
        root.addEventListener("click", (e) => {
          const el = e.target.closest("[data-act]");
          if (!el) return;
          dispatch(el.dataset.act, el, this);
        }, { signal });
        root.addEventListener("change", (e) => {
          var _a, _b;
          const t = e.target;
          if (t.dataset.act === "toggle-dollar") {
            this._svc("update_settings", { show_dollar_value_to_kids: t.checked });
            return;
          }
          if (t.dataset.act === "toggle-dollar") {
            this._svc("update_settings", { show_dollar_value_to_kids: t.checked });
            return;
          }
          if (t.dataset.act === "toggle-global-penalty") {
            this._svc("update_settings", { penalties_paused: !t.checked });
            return;
          }
          if (t.dataset.act === "toggle-person-penalty") {
            const pid = t.dataset.pid;
            if (pid) this._svc("update_person", { person_id: pid, penalties_paused: !t.checked });
            return;
          }
          if (t.id === "m-everyone") {
            root.querySelectorAll(".m-assign-person").forEach((cb) => {
              var _a2;
              cb.checked = t.checked;
              (_a2 = cb.closest(".fh-person-cb-chip")) == null ? void 0 : _a2.classList.toggle("checked", t.checked);
            });
          }
          if (t.classList.contains("m-assign-person") && !t.checked) {
            const ev = root.getElementById("m-everyone");
            if (ev) ev.checked = false;
          }
          if (t.classList.contains("m-wd-day") || t.classList.contains("m-df-day")) {
            (_a = t.closest(".fh-wd-chip")) == null ? void 0 : _a.classList.toggle("checked", t.checked);
          }
          if (t.classList.contains("m-assign-person") || t.classList.contains("m-sp-person")) {
            (_b = t.closest(".fh-person-cb-chip")) == null ? void 0 : _b.classList.toggle("checked", t.checked);
          }
          this._syncModalUI();
        }, { signal });
        root.addEventListener("dragstart", (e) => {
          const row = e.target.closest("[data-drag-id]");
          if (!row) return;
          this._dragId = row.dataset.dragId;
          e.dataTransfer.effectAllowed = "move";
          setTimeout(() => row.classList.add("fh-dragging"), 0);
        }, { signal });
        root.addEventListener("dragover", (e) => {
          const row = e.target.closest("[data-drag-id]");
          if (!row || row.dataset.dragId === this._dragId) return;
          e.preventDefault();
          root.querySelectorAll(".fh-drag-over").forEach((el) => el.classList.remove("fh-drag-over"));
          row.classList.add("fh-drag-over");
          this._dragOverId = row.dataset.dragId;
        }, { signal });
        root.addEventListener("dragleave", (e) => {
          const row = e.target.closest("[data-drag-id]");
          if (row) row.classList.remove("fh-drag-over");
        }, { signal });
        root.addEventListener("drop", (e) => {
          var _a, _b, _c;
          e.preventDefault();
          root.querySelectorAll(".fh-drag-over, .fh-dragging").forEach((el) => el.classList.remove("fh-drag-over", "fh-dragging"));
          const dragId = this._dragId;
          const overId = this._dragOverId;
          this._dragId = this._dragOverId = null;
          if (!dragId || !overId || dragId === overId) return;
          const sorted = this._sortedChores;
          const without = sorted.filter((c) => c.chore_id !== dragId);
          const insertAt = without.findIndex((c) => c.chore_id === overId);
          if (insertAt < 0) return;
          const isLast = insertAt === without.length - 1;
          let before, after;
          if (isLast) {
            before = without[insertAt].sort_order;
            after = before + 20;
          } else {
            before = ((_a = without[insertAt - 1]) == null ? void 0 : _a.sort_order) ?? without[insertAt].sort_order - 20;
            after = without[insertAt].sort_order;
          }
          let newOrder = (before + after) / 2;
          const GAP_THRESHOLD = 0.01;
          if (Math.abs(after - newOrder) < GAP_THRESHOLD || Math.abs(newOrder - before) < GAP_THRESHOLD) {
            const reindexed = without.map((c, i) => ({ ...c, sort_order: (i + 1) * 10 }));
            const rBefore = ((_b = reindexed[insertAt - 1]) == null ? void 0 : _b.sort_order) ?? 0;
            const rAfter = ((_c = reindexed[insertAt]) == null ? void 0 : _c.sort_order) ?? rBefore + 20;
            newOrder = (rBefore + rAfter) / 2;
            reindexed.forEach((c) => {
              if (c.chore_id !== dragId) {
                this._svc("update_chore", { chore_id: c.chore_id, sort_order: c.sort_order });
              }
            });
          }
          this._svc("update_chore", { chore_id: dragId, sort_order: newOrder });
        }, { signal });
        root.addEventListener("dragend", () => {
          root.querySelectorAll(".fh-drag-over, .fh-dragging").forEach((el) => el.classList.remove("fh-drag-over", "fh-dragging"));
          this._dragId = this._dragOverId = null;
        }, { signal });
      }
      disconnectedCallback() {
        var _a;
        (_a = this._abortCtrl) == null ? void 0 : _a.abort();
        this._abortCtrl = null;
        if (this._retryTimer) {
          clearTimeout(this._retryTimer);
          this._retryTimer = null;
        }
      }
      // ---- HA card API -------------------------------------------------------
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
        this._scheduleRetryIfNeeded();
      }
      // Polls until sensor data is present — handles slow websocket delivery on Echo Show 15.
      // Once people data arrives the dirty-check will re-evaluate and render.
      _scheduleRetryIfNeeded() {
        var _a, _b, _c, _d, _e;
        if (this._retryTimer) return;
        const ready = !!((_e = (_d = (_c = (_b = (_a = this._hass) == null ? void 0 : _a.states) == null ? void 0 : _b["sensor.family_hub_needs_attention"]) == null ? void 0 : _c.attributes) == null ? void 0 : _d.people) == null ? void 0 : _e.length);
        if (ready) return;
        let attempts = 0;
        const retry = () => {
          var _a2, _b2, _c2, _d2;
          this._retryTimer = null;
          if (!this._hass) return;
          attempts++;
          const nowReady = !!((_d2 = (_c2 = (_b2 = (_a2 = this._hass.states) == null ? void 0 : _a2["sensor.family_hub_needs_attention"]) == null ? void 0 : _b2.attributes) == null ? void 0 : _c2.people) == null ? void 0 : _d2.length);
          if (nowReady) {
            for (const id of FH_SENSORS) delete this._lastKeys[id];
            this._maybeRender();
          } else if (attempts < 15) {
            this._retryTimer = setTimeout(retry, 2e3);
          }
        };
        this._retryTimer = setTimeout(retry, 2e3);
      }
      getCardSize() {
        return 5;
      }
      // ---- Dirty-check -------------------------------------------------------
      /**
       * Only re-renders when Family Hub sensor data actually changed.
       * Suppressed entirely while a modal is open to protect user input.
       */
      _maybeRender() {
        var _a, _b, _c, _d;
        if (!this._hass) return;
        if (this._modal) return;
        if (this._adminSelectedChoreId) return;
        const states = this._hass.states;
        let changed = false;
        for (const id of FH_SENSORS) {
          const ts = (_a = states[id]) == null ? void 0 : _a.last_updated;
          if (ts !== this._lastKeys[id]) {
            this._lastKeys[id] = ts;
            changed = true;
          }
        }
        for (const p of ((_c = (_b = states["sensor.family_hub_needs_attention"]) == null ? void 0 : _b.attributes) == null ? void 0 : _c.people) || []) {
          const id = `sensor.family_hub_${slug(p.name)}`;
          const ts = (_d = states[id]) == null ? void 0 : _d.last_updated;
          if (ts !== this._lastKeys[id]) {
            this._lastKeys[id] = ts;
            changed = true;
          }
        }
        if (changed) this._doRender(false);
      }
      // ---- Render core -------------------------------------------------------
      /**
       * Rebuild the shadow DOM. Does NOT touch event listeners.
       * Modal is appended as a separate DOM node so background re-renders
       * never destroy an open modal.
       */
      _doRender(force = false) {
        if (!this._hass && !force) return;
        try {
          const scale = parseFloat(this._cfg.text_scale) || 1;
          const styleEl = document.createElement("style");
          styleEl.textContent = CSS + `:host { --fh-text-scale: ${scale}; }`;
          const card = document.createElement("div");
          card.className = "fh-card";
          if (!this._hass) {
            card.innerHTML = `<div class="fh-empty">Loading\u2026</div>`;
          } else {
            const _validAdminSecs = ["today", "family", "tasks", "history", "settings"];
            if (!_validAdminSecs.includes(this._adminSec)) this._adminSec = "today";
            switch (this._cfg.mode) {
              case "command_center":
                card.innerHTML = this._htmlCommandCenter();
                break;
              case "personal":
                card.innerHTML = htmlPersonal(this);
                break;
              case "maintenance":
                card.innerHTML = htmlMaintenance(this);
                break;
              case "admin":
                card.innerHTML = htmlAdmin(this);
                break;
            }
          }
          this.shadowRoot.innerHTML = "";
          this.shadowRoot.appendChild(styleEl);
          this.shadowRoot.appendChild(card);
          if (this._modal) {
            this.shadowRoot.appendChild(this._buildModal());
          }
          this._syncModalUI();
        } catch (err) {
          console.error("[family-hub] render error:", err);
          const styleEl = document.createElement("style");
          styleEl.textContent = CSS;
          const card = document.createElement("div");
          card.className = "fh-card";
          card.innerHTML = `<div class="fh-empty">Loading\u2026</div>`;
          this.shadowRoot.innerHTML = "";
          this.shadowRoot.appendChild(styleEl);
          this.shadowRoot.appendChild(card);
          setTimeout(() => {
            if (this._hass) {
              for (const id of FH_SENSORS) delete this._lastKeys[id];
              this._maybeRender();
            }
          }, 3e3);
        }
      }
      // ---- Command Center view routing ---------------------------------------
      _htmlCommandCenter() {
        const view = this._view || "home";
        if (view === "home") {
          return htmlHome(this);
        }
        let inner = "";
        if (view.startsWith("room:")) {
          const roomId = view.slice(5);
          const room = getRoomById(roomId);
          inner = (room == null ? void 0 : room.render) ? room.render(this) : `<div class="fh-empty">Unknown room.</div>`;
        } else if (view.startsWith("person:")) {
          const personId = view.slice(7);
          this._viewPersonId = personId;
          const person = this._findPerson(personId);
          const theme = getTheme((person == null ? void 0 : person.theme_key) || "classic");
          inner = htmlPersonal(this);
          this._viewPersonId = null;
          if (theme.handlesNavigation) return inner;
        } else {
          this._view = "home";
          return htmlHome(this);
        }
        return htmlNavBack("Home") + inner;
      }
      // ---- Sensor data accessors ---------------------------------------------
      _states(id) {
        var _a, _b;
        return (_b = (_a = this._hass) == null ? void 0 : _a.states) == null ? void 0 : _b[id];
      }
      _attrs(id) {
        var _a;
        return ((_a = this._states(id)) == null ? void 0 : _a.attributes) || {};
      }
      _people() {
        return this._attrs("sensor.family_hub_needs_attention").people || [];
      }
      _findPerson(nameOrId) {
        const lc = (nameOrId || "").toLowerCase();
        return this._people().find(
          (p) => p.name.toLowerCase() === lc || p.person_id === nameOrId
        ) || null;
      }
      _personEntityId(name) {
        return `sensor.family_hub_${slug(name)}`;
      }
      // ---- Service calls -----------------------------------------------------
      _svc(service, data) {
        if (!this._hass) return;
        this._hass.callService(DOMAIN, service, data);
      }
      // ---- Modal management --------------------------------------------------
      /**
       * Build the modal overlay as a real DOM node appended to the shadow root.
       * Never part of the main card innerHTML — background re-renders won't destroy it.
       */
      _buildModal() {
        const bg = document.createElement("div");
        bg.className = "fh-modal-bg";
        bg.innerHTML = this._modalHTML();
        bg.addEventListener("click", (e) => {
          if (e.target === bg) this._closeModal();
        });
        return bg;
      }
      _modalHTML() {
        if (!this._modal) return "";
        const { type, data } = this._modal;
        const people = this._people();
        const catLabels = this._attrs("sensor.family_hub_needs_attention").category_labels || [];
        const chores = this._attrs("sensor.family_hub_needs_attention").active_chores || [];
        switch (type) {
          case "award":
          case "deduct":
            return mPointAdjust(this._modal);
          case "add-task":
            return mAddTask(people);
          case "add-chore":
            return mChoreForm(null, false, people, catLabels, this._choreFormTab);
          case "edit-chore":
            return mChoreForm(data.chore, true, people, catLabels, this._choreFormTab);
          case "add-store-item":
            return mAddStoreItem(people);
          case "edit-store-item":
            return mEditStoreItem(data.item, people);
          case "add-person":
            return mAddPerson();
          case "edit-person":
            return mEditPerson(data);
          case "edit-settings":
            return mEditSettings(data);
          case "claim":
            return mClaim(this._modal, people);
          case "add-reminder":
            return mAddReminder(this._modal, people);
          case "confirm-remove-person":
            return mConfirmRemovePerson(data);
          case "edit-streaks": {
            const p = this._people().find((pp) => pp.person_id === data.pid);
            const streaks = (p == null ? void 0 : p.streaks) || {};
            return mEditStreaks(data.pid, data.pname, chores, streaks);
          }
          default:
            return "";
        }
      }
      _closeModal() {
        this._modal = null;
        this._choreFormTab = "details";
        this._doRender(true);
      }
      // ---- Conditional modal UI sync ----------------------------------------
      /**
       * Show/hide conditional form sections without re-rendering the whole card.
       * Called after every _doRender and every change event.
       * Safe to call when no modal is open.
       */
      _syncModalUI() {
        const sr = this.shadowRoot;
        const show = (id) => {
          const el = sr.getElementById(id);
          if (el) el.style.display = "";
        };
        const hide = (id) => {
          const el = sr.getElementById(id);
          if (el) el.style.display = "none";
        };
        const taskTypeEl = sr.getElementById("m-tasktype");
        if (taskTypeEl) {
          const tt = taskTypeEl.value;
          if (tt === "assigned") {
            show("m-task-assigned-section");
            hide("m-task-claimable-section");
            hide("m-task-reminder-section");
          }
          if (tt === "claimable") {
            hide("m-task-assigned-section");
            show("m-task-claimable-section");
            hide("m-task-reminder-section");
          }
          if (tt === "reminder") {
            hide("m-task-assigned-section");
            hide("m-task-claimable-section");
            show("m-task-reminder-section");
          }
        }
        const taskPenEl = sr.getElementById("m-tpenalty");
        const taskPenSec = sr.getElementById("m-task-penalty-section");
        if (taskPenEl && taskPenSec) {
          taskPenSec.style.display = taskPenEl.checked ? "" : "none";
        }
        const recEl = sr.getElementById("m-crec");
        if (recEl) {
          const rec = recEl.value;
          const ctypeEl = sr.getElementById("m-ctype");
          const ctype = (ctypeEl == null ? void 0 : ctypeEl.value) || "assigned";
          hide("m-dayfilter-section");
          hide("m-weekdays-section");
          hide("m-dom-section");
          hide("m-chore-expiry-section");
          if (rec === "daily") show("m-dayfilter-section");
          if (rec === "weekly") show("m-weekdays-section");
          if (rec === "monthly_on_date") show("m-dom-section");
          const isClaimOrOneTime = rec === "one_time" || ctype === "claimable";
          if (isClaimOrOneTime) show("m-chore-expiry-section");
        }
        const ctypeEl2 = sr.getElementById("m-ctype");
        const claimSec = sr.getElementById("m-claimable-section");
        const multiSec = sr.getElementById("m-multi-claim-section");
        const subtypeEl = sr.getElementById("m-csubtype");
        if (ctypeEl2 && claimSec) {
          const isClaimable = ctypeEl2.value === "claimable";
          claimSec.style.display = isClaimable ? "" : "none";
          if (multiSec) {
            const isMulti = isClaimable && (subtypeEl == null ? void 0 : subtypeEl.value) === "multi_claim";
            multiSec.style.display = isMulti ? "" : "none";
          }
        }
        const penaltyEl = sr.getElementById("m-cpenalty");
        const penaltySec = sr.getElementById("m-penalty-pts-section");
        const dailyThreshSec = sr.getElementById("m-daily-threshold-section");
        if (penaltyEl && penaltySec) {
          penaltySec.style.display = penaltyEl.checked ? "" : "none";
          if (dailyThreshSec) dailyThreshSec.style.display = penaltyEl.checked ? "" : "none";
        }
        const scopeEl = sr.getElementById("m-sscope");
        const personSecEl = sr.getElementById("m-sperson-section");
        if (scopeEl && personSecEl) {
          personSecEl.style.display = scopeEl.value === "personal" ? "" : "none";
        }
      }
    };
  }
});

// src/card/editor.js
var FamilyHubCardEditor;
var init_editor = __esm({
  "src/card/editor.js"() {
    init_constants();
    init_utils();
    FamilyHubCardEditor = class extends HTMLElement {
      setConfig(cfg) {
        this._cfg = cfg;
        this._render();
      }
      set hass(hass) {
        var _a, _b, _c;
        this._hass = hass;
        this._people = ((_c = (_b = (_a = hass == null ? void 0 : hass.states) == null ? void 0 : _a["sensor.family_hub_needs_attention"]) == null ? void 0 : _b.attributes) == null ? void 0 : _c.people) || [];
        this._render();
      }
      _render() {
        var _a, _b, _c, _d, _e;
        const cfg = this._cfg || {};
        const people = this._people || [];
        const mode = cfg.mode || "command_center";
        const person = cfg.person || "";
        const textScale = cfg.text_scale != null ? cfg.text_scale : 1;
        const sensorState = (_b = (_a = this._hass) == null ? void 0 : _a.states) == null ? void 0 : _b["sensor.family_hub_needs_attention"];
        const connected = !!sensorState;
        const statusDot = `<span style="
            display:inline-block;width:8px;height:8px;border-radius:50%;
            background:${connected ? "#30d158" : "#ff453a"};
            margin-right:5px;vertical-align:middle;"></span>`;
        const statusLabel = connected ? `${statusDot}Integration connected (v${VERSION})` : `${statusDot}Integration not found \u2014 install Family Hub`;
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
        .fhe-status { font-size:.8rem; padding:6px 0; }
      </style>
      <div class="fhe">
        <div class="fhe-status">${statusLabel}</div>

        <div class="fhe-field">
          <label class="fhe-label">Mode</label>
          <select class="fhe-select" id="e-mode">
            ${[
          ["command_center", "Command Center (kitchen display)"],
          ["personal", "Personal Dashboard"],
          ["maintenance", "Maintenance"],
          ["admin", "Admin Panel"]
        ].map(([v, l]) => `<option value="${v}" ${v === mode ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </div>

        <div class="fhe-field" id="person-field"
             style="display:${mode === "personal" ? "flex" : "none"}">
          <label class="fhe-label">Person</label>
          ${people.length ? `<select class="fhe-select" id="e-person">
                   ${people.map(
          (p) => `<option value="${p.name.toLowerCase()}"
                                ${p.name.toLowerCase() === person ? "selected" : ""}>${escHTML(p.name)}</option>`
        ).join("")}
                 </select>` : `<input class="fhe-input" id="e-person" type="text"
                        value="${person}" placeholder="e.g. jackson">`}
          <span class="fhe-hint">Enter the person's name (lowercase)</span>
        </div>

        <div class="fhe-field">
          <label class="fhe-label">Text scale</label>
          <select class="fhe-select" id="e-scale">
            ${[
          [0.9, "Small (0.9)"],
          [1, "Default (1.0)"],
          [1.25, "Large (1.25)"],
          [1.5, "XL (1.5)"]
        ].map(([v, l]) => `<option value="${v}" ${parseFloat(textScale) === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
          <span class="fhe-hint">Increase for Echo Show / tablet screens.</span>
        </div>
      </div>`;
        (_c = this.querySelector("#e-mode")) == null ? void 0 : _c.addEventListener("change", (e) => {
          this._cfg = { ...this._cfg, mode: e.target.value };
          if (e.target.value !== "personal") delete this._cfg.person;
          this._fireChange();
          this._render();
        });
        (_d = this.querySelector("#e-person")) == null ? void 0 : _d.addEventListener("change", (e) => {
          this._cfg = { ...this._cfg, person: e.target.value };
          this._fireChange();
        });
        (_e = this.querySelector("#e-scale")) == null ? void 0 : _e.addEventListener("change", (e) => {
          this._cfg = { ...this._cfg, text_scale: parseFloat(e.target.value) };
          this._fireChange();
        });
      }
      _fireChange() {
        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: this._cfg },
          bubbles: true,
          composed: true
        }));
      }
    };
  }
});

// src/body.js
var require_body = __commonJS({
  "src/body.js"() {
    init_FamilyHubCard();
    init_editor();
    init_constants();
    if (!customElements.get("family-hub-card-impl")) {
      customElements.define("family-hub-card-impl", FamilyHubCard);
    }
    if (!customElements.get("family-hub-card-editor-impl")) {
      customElements.define("family-hub-card-editor-impl", FamilyHubCardEditor);
    }
    console.info(
      `%c FAMILY-HUB-CARD %c v${VERSION} %c body loaded `,
      "background:#7F77DD;color:#fff;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px",
      "background:#1c1c1e;color:#fff;font-weight:400;padding:2px 6px",
      "background:#58D38A;color:#000;font-weight:600;border-radius:0 4px 4px 0;padding:2px 6px"
    );
  }
});
export default require_body();

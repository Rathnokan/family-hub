var O=(e,t)=>()=>(e&&(t=e(e=0)),t);var no=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var Ct,zt=O(()=>{Ct=`
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

  /* Compact filter bar (Chores tab) \u2014 replaces stacked chip rows with dropdowns */
  .fh-ad-filter-bar { display:flex; flex-wrap:wrap; gap:8px 14px; align-items:center; margin-bottom:14px; }
  .fh-ad-filter-lbl {
    display:inline-flex; align-items:center; gap:6px;
    font-size:.72rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase;
    color:#6F7E9C; white-space:nowrap;
  }
  .fh-ad-filter-select { width:auto; min-width:118px; padding:6px 10px; font-size:.85rem; }

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

  /* v0.6.3 P2: drop-position insertion line \u2014 shows on dragover, indicates
     exactly where the dragged row will land. Works on any [data-drag-id]
     row (chores, store items, category chips). Themes inherit the accent
     color via currentColor on the pseudo. */
  [data-drag-id] { position:relative; }
  [data-drag-id].fh-dragging { opacity:.45; }
  [data-drag-id].fh-drop-above::before,
  [data-drag-id].fh-drop-below::after {
    content:""; position:absolute; left:4px; right:4px; height:3px;
    background:var(--fh-accent, #5B8DB9); border-radius:2px;
    box-shadow:0 0 0 1px color-mix(in srgb, var(--fh-accent, #5B8DB9) 35%, transparent);
    pointer-events:none; z-index:2;
  }
  [data-drag-id].fh-drop-above::before { top:-2px; }
  [data-drag-id].fh-drop-below::after  { bottom:-2px; }
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

  /* Awarded-points + streak-at-a-glance column (Chore definitions rows) */
  .fh-task-pts-col {
    display:flex; flex-direction:column; align-items:flex-end;
    gap:3px; flex-shrink:0;
  }
  .fh-task-streak {
    font-size:var(--fh-text-xs); font-weight:700; line-height:1;
    color:var(--fh-warning); white-space:nowrap;
  }
  .fh-task-streak--off { color:var(--fh-text-sec); font-weight:500; opacity:.75; }
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

  /* Rotation dots \u2014 spaced (not overlapped) so current/next/dim read clearly */
  .fh-avatars--rot { gap:3px; }
  .fh-avatars--rot .fh-avatar + .fh-avatar { margin-left:0; }
  .fh-avatar--current { box-shadow:0 0 0 2px #ECEFF6; }     /* who has it now */
  .fh-avatar--next    { box-shadow:0 0 0 1.5px #6F7E9C; }   /* up next */
  .fh-avatar--dim     { opacity:.4; }                       /* later in the pool */
  .fh-rot-glyph       { color:#6F7E9C; font-size:var(--fh-text-sm); margin-right:3px; flex-shrink:0; align-self:center; }

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
  .fh-store-limit { font-size:.72rem; color:var(--fh-text-sec); opacity:.85; }
  .fh-store-limit--blocked { color:var(--fh-overdue); opacity:1; font-weight:600; }

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

  /* Rotation pool editor (v0.6.2) \u2014 ordered list with up/down/remove + add chips. */
  .fh-rot-pool { display:flex; flex-direction:column; gap:6px; }
  .fh-rot-ordered {
    display:flex; flex-direction:column; gap:4px;
    padding:4px; border:1px dashed var(--fh-border); border-radius:6px;
    background:var(--fh-surface);
  }
  .fh-rot-empty {
    padding:8px 6px; font-size:.82rem;
    color:var(--fh-text-sec); font-style:italic; text-align:center;
  }
  .fh-rot-item {
    display:flex; align-items:center; gap:8px;
    padding:6px 8px; border-radius:6px;
    border:1.5px solid var(--chip-color, var(--fh-border));
    background:color-mix(in srgb, var(--chip-color, var(--fh-accent)) 12%, transparent);
    font-size:.86rem;
  }
  /* v0.7.3: Current / Up Next section headers in the rotation order list */
  .fh-rot-section-hdr {
    font-size:var(--fh-text-xs); font-weight:800; letter-spacing:.06em;
    text-transform:uppercase; color:var(--fh-text-sec); margin:4px 2px 0;
  }
  .fh-rot-item--current {
    border-width:2px;
    background:color-mix(in srgb, var(--chip-color, var(--fh-accent)) 22%, transparent);
  }
  /* v0.7.3: collapsible Icon editor at the top of the Details tab */
  .fh-icon-details {
    border:1px solid var(--fh-border); border-radius:var(--fh-radius-sm);
    padding:6px 10px; margin-bottom:var(--fh-gap-sm); background:var(--fh-surface);
  }
  .fh-icon-summary {
    display:flex; align-items:center; gap:10px; cursor:pointer; list-style:none;
    font-weight:700; font-size:.9rem;
  }
  .fh-icon-summary::-webkit-details-marker { display:none; }
  .fh-icon-summary::before { content:"\u25B8"; color:var(--fh-text-sec); transition:transform .15s; }
  .fh-icon-details[open] .fh-icon-summary::before { transform:rotate(90deg); }
  .fh-icon-summary-title { color:var(--fh-text-sec); }
  .fh-icon-details .fh-icon-search { margin-top:8px; }
  .fh-rot-num {
    flex-shrink:0;
    min-width:22px; height:22px; padding:0 6px;
    display:inline-flex; align-items:center; justify-content:center;
    font-family:var(--fh-font-mono); font-size:.78rem; font-weight:700;
    border-radius:11px;
    background:var(--chip-color, var(--fh-accent)); color:#fff;
  }
  .fh-rot-name { flex:1; min-width:0; }
  .fh-rot-ctrl {
    width:30px; height:30px; padding:0;
    display:inline-flex; align-items:center; justify-content:center;
    font-size:1rem; font-weight:700;
    border:1px solid var(--fh-border); border-radius:6px;
    background:var(--fh-bg); color:var(--fh-text); cursor:pointer;
    transition:background .12s, border-color .12s, opacity .12s;
  }
  .fh-rot-ctrl:hover:not([disabled]) { background:var(--fh-surface); border-color:var(--fh-accent); }
  .fh-rot-ctrl[disabled] { opacity:.35; cursor:not-allowed; }
  .fh-rot-ctrl-remove { color:#CC2200; }
  .fh-rot-ctrl-remove:hover { background:rgba(204,34,0,.1); border-color:#CC2200; }

  .fh-rot-available-lbl {
    font-size:.78rem; font-weight:600;
    color:var(--fh-text-sec); letter-spacing:.02em;
    margin-top:2px;
  }
  .fh-rot-available { display:flex; flex-wrap:wrap; gap:6px; }
  .fh-rot-add {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 10px; border-radius:20px;
    border:1.5px dashed var(--chip-color, var(--fh-border));
    background:transparent; color:var(--fh-text);
    font-size:.82rem; cursor:pointer;
    transition:background .12s;
  }
  .fh-rot-add:hover {
    background:color-mix(in srgb, var(--chip-color, var(--fh-accent)) 14%, transparent);
  }
  .fh-rot-add-empty {
    font-size:.82rem; color:var(--fh-text-sec); font-style:italic;
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
    cursor:grab; user-select:none;
  }
  .fh-cat-chip:active { cursor:grabbing; }
  .fh-cat-chip-handle {
    color:var(--fh-text-sec); font-size:.72rem; line-height:1;
    flex-shrink:0;
  }
  .fh-cat-chip-del {
    width:16px; height:16px; border-radius:50%; border:none;
    background:transparent; color:var(--fh-text-sec);
    cursor:pointer; font-size:.82rem; padding:0; line-height:1;
    display:flex; align-items:center; justify-content:center;
  }
  .fh-cat-chip-del:hover { color:var(--fh-overdue); }
  /* Category chips use the horizontal-list variant of the drop indicator:
     vertical line on left/right edge instead of top/bottom strip. */
  .fh-cat-chip.fh-drop-above::before,
  .fh-cat-chip.fh-drop-below::after {
    content:""; position:absolute; top:2px; bottom:2px; width:3px;
    background:var(--fh-accent, #5B8DB9); border-radius:2px;
    left:auto; right:auto; height:auto;
    box-shadow:0 0 0 1px color-mix(in srgb, var(--fh-accent, #5B8DB9) 35%, transparent);
    pointer-events:none; z-index:2;
  }
  .fh-cat-chip.fh-drop-above::before { left:-3px; top:2px; }
  .fh-cat-chip.fh-drop-below::after  { right:-3px; top:2px; }

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

  /* Drawer (right side-rail) \u2014 reuses the .fh-modal-bg scrim, anchored right.
     Used for the Ranks editor and the Person / Settings editors (v0.7.2). */
  .fh-modal-bg--drawer { align-items:stretch; justify-content:flex-end; padding:0; }
  .fh-drawer {
    background:var(--fh-bg);
    width:100%; max-width:460px; height:100%;
    display:flex; flex-direction:column;
    box-shadow:-8px 0 32px rgba(0,0,0,.45);
    animation:fh-drawer-in .18s ease-out;
  }
  @keyframes fh-drawer-in { from { transform:translateX(100%); } to { transform:translateX(0); } }
  .fh-drawer-hdr {
    flex:0 0 auto; display:flex; align-items:center; justify-content:space-between;
    gap:var(--fh-gap-sm); padding:var(--fh-pad);
    border-bottom:1px solid var(--fh-border); background:var(--fh-bg);
  }
  .fh-drawer-title  { font-size:1.1rem; font-weight:700; }
  .fh-drawer-body {
    flex:1 1 auto; overflow-y:auto; padding:var(--fh-pad);
    display:flex; flex-direction:column; gap:var(--fh-gap);
  }
  .fh-drawer-footer {
    flex:0 0 auto; display:flex; gap:var(--fh-gap-sm); justify-content:flex-end;
    padding:var(--fh-pad); border-top:1px solid var(--fh-border); background:var(--fh-bg);
  }
  .fh-drawer-tabs { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:var(--fh-gap-sm); }
  .fh-drawer-tab {
    flex:1 1 auto; min-width:64px; padding:8px 10px; cursor:pointer;
    font-size:.8rem; font-weight:600; text-align:center;
    color:var(--fh-text-sec); background:transparent;
    border:1px solid var(--fh-border); border-radius:var(--fh-radius);
  }
  .fh-drawer-tab.active { color:var(--fh-text); background:var(--fh-border); }
  /* Per-rank band grid (drawer) */
  .fh-rank-grid { display:flex; flex-direction:column; gap:6px; }
  .fh-rank-grid-row {
    display:grid; grid-template-columns:1fr 100px 100px; gap:8px; align-items:center;
  }
  .fh-rank-grid-row .fh-rank-grid-name { font-size:.8rem; color:var(--fh-text-sec); }
  .fh-rank-grid-hdr { font-size:.72rem; color:var(--fh-text-sec); font-weight:600; text-transform:uppercase; letter-spacing:.05em; }
  .fh-rank-grid-cell { display:flex; align-items:center; gap:5px; }
  .fh-rank-grid-cell .fh-input { width:54px; padding:6px 4px; text-align:center; }
  .fh-rank-grid-pts { font-size:var(--fh-text-xs); color:var(--fh-text-sec); min-width:30px; text-align:right; }

  /* Claim picker \u2014 card grid of tappable person tiles (v0.6.1).
     Replaces the previous <select> dropdown for Echo Show touch input. */
  .fh-claim-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    margin: 4px 0 12px;
  }
  .fh-claim-tile {
    all: unset;
    box-sizing: border-box;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 14px 10px 12px;
    background: var(--fh-surface);
    border: 1.5px solid var(--fh-border);
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    transition: transform .1s, border-color .15s, background .15s;
  }
  .fh-claim-tile:hover {
    border-color: var(--tile-color, var(--fh-accent));
    background: rgba(127,119,221,.06);
  }
  .fh-claim-tile:active { transform: scale(.96); }
  .fh-claim-tile:focus-visible {
    outline: 2px solid var(--tile-color, var(--fh-accent));
    outline-offset: 2px;
  }
  .fh-claim-tile-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    display: grid; place-items: center;
    color: #fff; font-weight: 800; font-size: 1.25rem;
    font-family: var(--fh-font-display, 'Bricolage Grotesque', sans-serif);
    flex-shrink: 0;
  }
  .fh-claim-tile-code {
    font-family: var(--fh-font-mono, 'JetBrains Mono', monospace);
    font-size: var(--fh-text-xs); font-weight: 700;
    letter-spacing: .08em; color: #F5C24A;
  }
  .fh-claim-tile-name {
    font-size: var(--fh-text-sm); font-weight: 600; color: var(--fh-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 100%;
  }

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
    line-height:1.2; max-width:64px; overflow:hidden;
    text-overflow:ellipsis; white-space:nowrap;
  }
  /* Icon-picker glyph sizing \u2014 cells/preview now render via choreIcon()
     (emoji-in-svg or line svg); size the svg deterministically in both. */
  .fh-icon-cell svg     { width:28px; height:28px; }
  .fh-icon-sel-icon svg { width:20px; height:20px; }

  /* Icon tab: selected-icon preview bar */
  .fh-icon-selected-wrap {
    display:flex; align-items:center; gap:8px; min-height:28px;
    padding:4px 2px; border-bottom:1px solid var(--fh-border); margin-bottom:4px;
  }
  .fh-icon-sel-lbl { font-size:.82rem; font-weight:600; color:var(--fh-text); }
  .fh-icon-sel-none { font-size:.82rem; color:var(--fh-text-sec); }

  /* Icon tab: scrollable grid container */
  .fh-icon-tab-grid {
    display:flex; flex-direction:column; gap:6px; overflow-y:auto; flex:1;
  }
  .fh-icon-tab-grid .fh-icon-picker-cat-grid {
    display:grid; grid-template-columns:repeat(auto-fill, minmax(68px, 1fr)); gap:4px;
    margin-bottom:4px;
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
  /* Children MUST NOT shrink \u2014 when total content exceeds max-height,
     the flex column would otherwise squish every row down to a few px
     to fit instead of overflowing. overflow-y:auto needs natural-height
     children to actually scroll. */
  .fh-hist-scroll > * { flex-shrink: 0; }

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
  .fh-home-agent-stat-dollar {
    font-family:var(--fh-font-mono); font-size:.82rem; font-weight:700;
    color:var(--fh-text-sec); letter-spacing:.02em; margin-top:2px;
  }
  .fh-home-agent-stat-div {
    width:1px; height:28px; background:var(--fh-border); flex-shrink:0; margin:0 4px;
  }
  .fh-home-agent-allowance {
    font-family:var(--fh-font-mono); font-size:.76rem; font-weight:700;
`});var At,Mt=O(()=>{At=`    color:var(--fh-text-sec); letter-spacing:.04em;
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
  /* v0.6.1: success-rate streak line \u2014 only renders when streak > 0 */
  .fh-mc-agent-streak {
    margin-top:7px; padding:4px 6px;
    background:rgba(248, 211, 138, .08);
    border:1px solid rgba(248, 211, 138, .25);
    border-radius:4px;
    color:#F8D38A;
    font-family:"JetBrains Mono",monospace;
    font-size:var(--fh-text-xs); font-weight:700; letter-spacing:.04em;
    text-align:center;
  }

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
  /* Per-assignee GO mini button \u2014 v0.6.1: bumped from 48px\xD7~52px to 64px\xD760px
     for confident touch input on Echo Show kitchen displays. */
  .fh-mc-go-mini {
    all:unset; cursor:pointer; box-sizing:border-box;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    min-width:64px; min-height:60px; padding:8px 10px; gap:3px;
    border-radius:10px;
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

  /* Shared $X.XX subtitle under a rail KPI cell. Inherits color from the
     surrounding cell context; opacity tones it down so it reads as secondary. */
  .fh-rkpi-sub {
    font-family:var(--fh-font-mono); font-size:.75rem; font-weight:600;
    letter-spacing:.02em; line-height:1.1; margin-top:3px; opacity:.8;
  }
  /* Loss/at-risk variant \u2014 penalty points lost this week or at risk today. */
  .fh-rkpi-sub--loss { color:var(--fh-overdue); opacity:.95; }

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
  .fh-rank-bar-mark {
`});var Ft,Bt=O(()=>{Ft=`    position:absolute; top:-4px; width:2px; height:14px;
    border-radius:1px; transform:translateX(-50%);
  }
  .fh-rank-bar-mark--drop { background:var(--fh-rb-drop, #E07A4C); }
  .fh-rank-bar-mark--gain { background:var(--fh-rb-gain, #5BB87A); }
  .fh-rank-bar-status {
    font-size:.75rem; color:var(--fh-rb-status, rgba(255,255,255,.55));
    white-space:nowrap; flex-shrink:0; font-weight:700;
  }
  /* Success-rate person streak \u2014 appended below the rank bar in all themes.
     Renders only when the kid has an active streak (count > 0). Themes can
     override --ss-tone via the inline style on the element. */
  .fh-success-streak {
    display:flex; align-items:center; gap:6px;
    margin-top:8px; padding:5px 8px;
    background:color-mix(in srgb, var(--ss-tone, #F8D38A) 14%, transparent);
    border:1px solid color-mix(in srgb, var(--ss-tone, #F8D38A) 35%, transparent);
    border-radius:4px;
    font-family:var(--fh-font-mono, "JetBrains Mono", monospace);
    font-size:var(--fh-text-xs); font-weight:700; letter-spacing:.04em;
    color:var(--ss-tone, #F8D38A);
  }
  .fh-success-streak-icon { font-size:.95em; line-height:1; }
  .fh-success-streak-sep  { opacity:.55; margin:0 1px; }
  .fh-success-streak-target { opacity:.85; font-weight:600; }
  /* Paper-theme tone \u2014 sit on warm parchment, not bright amber */
  .fh-dn-page .fh-success-streak,
  .fh-bk-page .fh-success-streak,
  .fh-hp-page .fh-success-streak {
    background:color-mix(in srgb, var(--ss-tone) 18%, #f6ead0);
    color:#5a3a1a;
    border-color:color-mix(in srgb, var(--ss-tone) 45%, #c9a062);
  }
  /* DBZ comic tone \u2014 sit on white card with strong border */
  .fh-dbz-rpanel .fh-success-streak {
    background:#FFF6E8;
    color:#1A2B5E;
    border:2px solid #1A2B5E;
    box-shadow:0 3px 0 #1A2B5E;
  }

  /* ---- Streak freeze chip (v0.6.3 item 7) -------------------------------- */
  .fh-freeze-chip {
    display:inline-flex; align-items:center; gap:5px;
    margin-top:6px; padding:4px 8px;
    border-radius:4px;
    background:rgba(100,200,255,.12);
    border:1px solid rgba(100,200,255,.28);
    font-size:var(--fh-text-xs); font-weight:600;
    color:rgba(150,220,255,.9);
    cursor:default;
  }
  .fh-freeze-chip-icon { font-size:.9em; line-height:1; }
  .fh-dn-page .fh-freeze-chip,
  .fh-bk-page .fh-freeze-chip,
  .fh-hp-page .fh-freeze-chip {
    background:rgba(100,160,200,.14);
    border-color:rgba(80,130,180,.35);
    color:#2a4a6a;
  }
  .fh-dbz-rpanel .fh-freeze-chip {
    background:#EEF6FF;
    border:2px solid #1A2B5E;
    color:#1A2B5E;
  }

  /* ---- Daily progress bar (v0.6.3 item 9) -------------------------------- */
  .fh-daily-progress {
    display:flex; align-items:center; gap:8px;
    margin-bottom:8px; padding:5px 0 4px;
  }
  .fh-daily-progress-bar {
    flex:1; height:5px; border-radius:3px;
    background:rgba(255,255,255,.15); overflow:hidden;
  }
  .fh-daily-progress-fill {
    height:100%; border-radius:3px;
    background:var(--fh-success, #5DB87A);
    transition:width .4s ease;
  }
  .fh-daily-progress-label {
    font-size:var(--fh-text-xs); font-weight:700;
    color:var(--fh-text-sec); white-space:nowrap; letter-spacing:.02em;
  }
  .fh-daily-progress--complete .fh-daily-progress-label { color:var(--fh-success, #5DB87A); }
  .fh-dn-page .fh-daily-progress-bar,
  .fh-bk-page .fh-daily-progress-bar,
  .fh-hp-page .fh-daily-progress-bar { background:rgba(0,0,0,.12); }
  .fh-dn-page .fh-daily-progress-label,
  .fh-bk-page .fh-daily-progress-label,
  .fh-hp-page .fh-daily-progress-label { color:rgba(60,40,20,.6); }
  .fh-dn-page .fh-daily-progress--complete .fh-daily-progress-label,
  .fh-bk-page .fh-daily-progress--complete .fh-daily-progress-label,
  .fh-hp-page .fh-daily-progress--complete .fh-daily-progress-label { color:#3a7a3a; }

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
`});var Rt,It=O(()=>{Rt=`    text-shadow:2px 2px 0 rgba(255,255,255,.3), 4px 4px 0 rgba(15,30,46,.25);
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
    /* Bound the shell height so .fh-ad-body scrolls INTERNALLY instead of
       growing the page. This is what gives the sticky chore-editor panel a
       real scroll container to pin against. min-height keeps it usable on
       short content; max-height caps it near the viewport on long lists. */
    .fh-ad-shell   { flex-direction: row; min-height: 620px; max-height: calc(92vh - 24px); }
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
    border-radius: 10px; overflow: hidden; position: relative;
  }
  /* v0.7.3: person delete \u2014 red trash, lower-right corner of the card */
  .fh-ad-person-del {
    position: absolute; right: 10px; bottom: 8px;
    width: 30px; height: 30px; padding: 0;
    display: inline-flex; align-items: center; justify-content: center;
    background: transparent; border: none; cursor: pointer;
    color: var(--fh-overdue, #ff453a); opacity: .65; border-radius: 6px;
    transition: opacity .15s, background .15s;
  }
  .fh-ad-person-del:hover { opacity: 1; background: rgba(255,69,58,.14); }
  .fh-ad-person-del svg { width: 18px; height: 18px; fill: currentColor; }
  .fh-ad-person-top {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 14px 6px;
  }
  /* v0.7.0 P4: own row beneath name/balance so the name always gets full width
     (the old inline layout squeezed names to "Ji" at narrow admin column widths). */
  .fh-ad-person-btns { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; padding: 2px 14px 12px; }
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

  /* ---- Settings grid \u2014 2 panels: config (left) + hub layout (right) ---- */
  .fh-ad-settings-grid {
    display: grid; gap: 14px;
    grid-template-columns: 1fr;
  }
  @media (min-width: 900px) {
    .fh-ad-settings-grid {
      grid-template-columns: 1.15fr 1fr;
      grid-template-areas: "config hub";
      align-items: start;
    }
    .fh-ad-settings-left { grid-area: config; }
    .fh-ad-settings-hub  { grid-area: hub; }
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
     Sticky within the scrolling .fh-ad-body so the editor follows the list
     down the page: selecting a chore near the bottom shows the editor in
     view at the top of the viewport instead of forcing a scroll back up.
     Header/footer stay pinned; the form body scrolls internally when tall. */
  /* Repurposed as the earning-power stats rail \u2014 now useful on mobile too, so
     it stays visible (stacked below the list) and only goes sticky at \u22651280px. */
  .fh-ad-tasks-panel {
    display: flex; flex-direction: column;
    background: #1A2538;
    border: 1px solid #2A3852;
    border-radius: 12px;
    overflow: hidden;
  }
  @media (min-width: 1280px) {
    .fh-ad-tasks-panel {
      width: 480px; flex-shrink: 0;
      position: sticky; top: 0;
      /* Keep the rail no taller than the visible scroll area (.fh-ad-body =
         shell 92vh \u2212 topbar \u2212 padding) so its own body scrolls INTERNALLY and
         you can reach its bottom without scrolling the left list to the end. */
      max-height: calc(92vh - 150px);
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
    /* Scroll the form internally so header (title) + footer (Save/Delete)
       stay pinned when the panel is sticky and the form is taller than the
       viewport. flex:1 lets it absorb the panel's max-height. */
    flex: 1 1 auto; overflow-y: auto; min-height: 0;
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

  /* ---- Earning & Balance rail (Tasks side panel) ---- */
  .fh-es-rail { display: flex; flex-direction: column; gap: 14px; }

  /* What-if controls row */
  .fh-es-controls {
    display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center;
    padding-bottom: 12px; border-bottom: 1px solid #2A3852;
  }
  .fh-es-ctl {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: var(--fh-text-sm); color: #A6B3CC;
  }
  .fh-es-ctl .fh-select {
    background: #202D45; border: 1px solid #3A4B6B; color: #ECEFF6;
    border-radius: 6px; padding: 3px 6px; font-size: var(--fh-text-sm);
  }
  .fh-es-ctl-chk input { width: 16px; height: 16px; cursor: pointer; }

  .fh-es-kid {
    background: #202D45; border: 1px solid #2A3852;
    border-radius: 10px; padding: 10px 12px;
  }
  .fh-es-kid-hdr { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .fh-es-kid-name {
    font-family: 'Manrope', sans-serif; font-weight: 700;
    font-size: var(--fh-text-base); color: #ECEFF6;
    flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .fh-es-kid-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); color: #6F7E9C; flex-shrink: 0;
  }
  /* Week headline (allowance is discussed weekly, so it leads) */
  .fh-es-week { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
  .fh-es-week-usd {
    font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800;
    font-size: var(--fh-text-xl); color: #7FBF9B; line-height: 1;
  }
  .fh-es-week-lbl { font-size: var(--fh-text-sm); color: #6F7E9C; margin-left: -3px; }
  .fh-es-week-pts { font-family: 'JetBrains Mono', monospace; font-size: var(--fh-text-xs); color: #A6B3CC; }
  .fh-es-week-this {
    font-family: 'JetBrains Mono', monospace; font-size: var(--fh-text-xs);
    color: #6F7E9C; margin-left: auto;
  }
  /* Weekly range bar (volatility) */
  .fh-es-rng-track {
    position: relative; height: 10px; background: #1A2538;
    border: 1px solid #2A3852; border-radius: 6px; margin-top: 7px;
  }
  /* Month \u2014 secondary line under the week headline */
  .fh-es-month-sub { font-size: var(--fh-text-sm); color: #6F7E9C; margin-top: 6px; }
  .fh-es-rng-span {
    position: absolute; top: 0; bottom: 0; border-radius: 6px; opacity: .5;
  }
  .fh-es-rng-dot {
    position: absolute; top: 50%; width: 9px; height: 9px; border-radius: 50%;
    transform: translate(-50%, -50%); border: 2px solid #ECEFF6;
  }
  .fh-es-allow { font-size: var(--fh-text-sm); color: #A6B3CC; margin-top: 7px; }
  .fh-es-allow b { color: #7FBF9B; }

  .fh-es-section { border-top: 1px solid #2A3852; padding-top: 12px; }
  .fh-es-section-hdr {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700; letter-spacing: .1em;
    color: #6F7E9C; text-transform: uppercase; margin-bottom: 8px;
  }
  .fh-es-bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .fh-es-bar-name {
    font-size: var(--fh-text-sm); color: #A6B3CC;
    width: 64px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .fh-es-bar-track { flex: 1; height: 10px; background: #1A2538; border-radius: 6px; overflow: hidden; }
  .fh-es-bar-fill  { height: 100%; border-radius: 6px; min-width: 2px; }
  .fh-es-bar-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); color: #ECEFF6;
    width: 52px; text-align: right; flex-shrink: 0;
  }
  .fh-es-tot-row {
    display: flex; justify-content: space-between; align-items: baseline;
    gap: 10px; padding: 4px 0; font-size: var(--fh-text-sm);
  }
  .fh-es-tot-row > span:first-child { color: #6F7E9C; }
  .fh-es-tot-row > span:last-child  { color: #ECEFF6; font-weight: 600; }
  /* Dynamic swing tip */
  .fh-es-tip {
    background: #1F2B16; border: 1px solid #3A5226; border-radius: 8px;
    padding: 9px 11px; font-size: var(--fh-text-sm); color: #C7D6B4; line-height: 1.4;
  }
  .fh-es-tip b { color: #E6F0D8; }

  /* ---- Rewards section \u2014 same grid/panel structure as Tasks ---- */
  .fh-ad-rewards-wrap {
    display: flex; flex-direction: column; gap: 14px; min-width: 0;
  }
  @media (min-width: 1280px) {
    .fh-ad-rewards-wrap {
      display: grid; grid-template-columns: 1fr 480px;
      gap: 16px; align-items: start;
    }
  }
  .fh-ad-rewards-panel { display: none; }
  @media (min-width: 1280px) {
    .fh-ad-rewards-panel {
      display: flex; flex-direction: column;
      background: #1A2538;
      border: 1px solid #2A3852;
      border-radius: 12px;
      overflow: hidden;
    }
  }
  /* Inactive store rows \u2014 desaturated, italic name */
  .fh-store-row--inactive { opacity: .55; }
  /* Extend tasks-panel dark-theme overrides to rewards-panel */
  .fh-ad-rewards-panel .fh-label { color: #6F7E9C; }
  .fh-ad-rewards-panel .fh-input { background: #202D45; border-color: #3A4B6B; color: #ECEFF6; }
  .fh-ad-rewards-panel .fh-input::placeholder { color: #6F7E9C; }
  .fh-ad-rewards-panel .fh-select { background: #202D45; border-color: #3A4B6B; color: #ECEFF6; }
  .fh-ad-rewards-panel .fh-field-help { color: #6F7E9C; }
  .fh-ad-rewards-panel .fh-checkbox-row { color: #A6B3CC; }
  .fh-ad-rewards-panel .fh-person-cb-chip { border-color: #3A4B6B; color: #A6B3CC; }
  /* Rank ladder inputs in settings */
  .fh-ad-rank-ladder-input { text-align: right; }

  /* ---- History section \u2014 chore history left + reward history right rail ---- */
  .fh-ad-history-wrap {
    display: flex; flex-direction: column; gap: 14px; min-width: 0;
  }
  @media (min-width: 1280px) {
    .fh-ad-history-wrap {
      display: grid; grid-template-columns: 1fr 480px;
      gap: 16px; align-items: start;
    }
  }
  .fh-ad-history-rail { display: none; }
  @media (min-width: 1280px) {
    .fh-ad-history-rail {
      display: flex; flex-direction: column;
      background: #1A2538;
      border: 1px solid #2A3852;
      border-radius: 12px;
      overflow: hidden;
    }
  }
  .fh-ad-history-rail-body {
    padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    overflow-y: auto; max-height: 55vh;
  }

  /* ---- Template picker (v0.6.3 item 8) ---- */
  .fh-tpl-picker-row {
    display:flex; gap:6px; align-items:center;
  }
  .fh-tpl-apply-btn {
    white-space:nowrap; flex-shrink:0;
    font-size:var(--fh-text-xs); padding:0 10px;
  }
  .fh-tpl-picker-field { margin-bottom:2px; }

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

  /* ---- Icon tab grid (engineer theme overrides) ---- */
  .fh-icon-tab-grid {
    max-height: 380px;
  }
  .fh-icon-tab-grid .fh-icon-picker-cat-hdr {
    font-family: 'JetBrains Mono', monospace;
    font-size: var(--fh-text-xs); font-weight: 700;
    color: #6F7E9C; letter-spacing: .08em; text-transform: uppercase;
    padding: 6px 2px 2px; border-bottom-color: #2A3852;
  }
  .fh-icon-tab-grid .fh-icon-picker-cat-hdr:first-child { padding-top: 0; }
  .fh-icon-tab-grid .fh-icon-picker-cat-grid {
    grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
  }
  .fh-icon-tab-grid .fh-icon-cell {
    background: transparent; border: 1px solid transparent;
    border-radius: 6px; cursor: pointer; color: #ECEFF6;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 8px 4px; transition: background .1s, border-color .1s;
  }
  .fh-icon-tab-grid .fh-icon-cell:hover {
    background: rgba(91,141,239,.08); border-color: rgba(91,141,239,.2);
  }
  .fh-icon-tab-grid .fh-icon-cell.selected {
    background: rgba(91,141,239,.15); border-color: #5B8DEF;
  }
  .fh-icon-tab-grid .fh-icon-cell-label {
    font-size: var(--fh-text-xs); color: #A6B3CC;
    text-align: center; line-height: 1.2;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;
  }
  /* Icon tab: selected preview and search */
  .fh-icon-selected-wrap {
    border-bottom-color: #2A3852;
  }
  .fh-icon-sel-lbl { color: #ECEFF6; }
  .fh-icon-sel-none { color: #6F7E9C; }

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

  /* v0.7.3: editing opens the right-side drawer (row click or the edit button),
     so the per-row edit + delete buttons stay visible at every width. */
  @media (min-width: 1280px) {
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
`});var Tt,Dt=O(()=>{Tt=`  .fh-row-lead {
    flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-md); font-weight:800;
  }

  /* Icon column */
  .fh-row-icon {
    width:63px; height:63px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    position:relative;
  }
  .fh-row-icon svg { width:35px; height:35px; }

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

  /* Dual reward/penalty medal: "+15 / \u22125". Penalty inherits the row's danger
     tone (each theme already styles .fh-row--<theme> .fh-row-penalty in red);
     reuse that color via currentColor on a danger-flavored span. */
  .fh-row-pts--dual {
    display:inline-flex; align-items:baseline; gap:3px;
    white-space:nowrap; line-height:1;
  }
  /* v0.7.3: stack the points medal + due/reset label. The col owns the row/grid
     slot so the due line always sits UNDER the medal regardless of how a theme
     styles .fh-row-pts (e.g. HP renders it as a circular seal). */
  .fh-row-pts-col {
    display:flex; flex-direction:column; align-items:center; gap:3px; flex-shrink:0;
  }
  .fh-row-due {
    font-family:var(--fh-font-body); font-size:var(--fh-text-xs); font-weight:600;
    color:var(--fh-text-sec); white-space:nowrap; text-align:center;
  }

  /* v0.7.3: rotation rail \u2014 condensed Current / Up Next groups (theme-neutral) */
  .fh-rot-group { margin-bottom:8px; }
  .fh-rot-group:last-child { margin-bottom:0; }
  .fh-rot-group-hdr {
    font-size:var(--fh-text-xs); font-weight:800; letter-spacing:.06em;
    text-transform:uppercase; margin-bottom:3px;
  }
  .fh-rot-line {
    display:flex; align-items:baseline; justify-content:space-between; gap:8px; padding:2px 0;
  }
  .fh-rot-line-chore { font-size:var(--fh-text-sm); font-weight:700; }
  .fh-rot-line-when  { font-size:var(--fh-text-xs); color:var(--fh-text-sec); white-space:nowrap; }
  .fh-row-pts-sep {
    opacity:.45; font-weight:600; font-size:.85em;
  }
  .fh-row-pts-neg {
    color:var(--fh-row-neg, #CC2200); font-weight:800;
  }
  /* Each theme inherits its existing .fh-row-penalty color for the dual medal.
     Paper themes (HP burgundy, baker brown, dinos sepia) would otherwise clash
     against bright red. Dark themes (DBZ) keep the canonical red. */
  .fh-row--engineer .fh-row-pts-neg { color:#E07A4C; }
  .fh-row--dinos    .fh-row-pts-neg { color:#8C281E; }
  .fh-row--hp       .fh-row-pts-neg { color:#A02020; }
  .fh-row--baker    .fh-row-pts-neg { color:#A02828; }
  .fh-row--dbz      .fh-row-pts-neg { color:#CC2200; }
  .fh-row--classic  .fh-row-pts-neg { color:#E07A4C; }
  /* Kid-mode penalty pop: a touch larger so pre-readers parse it instantly. */
  .kid-large .fh-row-pts-neg { font-size:1.05em; }

  /* Action button (themes override shape/color/transform).
     v0.6.1: bumped from min-width:64px / 8px padding to min-width:72px / 60px height
     for thumb-confidence on Echo Show. Kid-large still overrides to its own bigger
     size via the .kid-large block. */
  .fh-row-btn {
    display:inline-flex; align-items:center; justify-content:center;
    flex-shrink:0; gap:6px; min-width:72px; min-height:60px;
    padding:10px 14px;
    font-family:var(--fh-font-mono);
    font-size:var(--fh-text-sm); font-weight:800;
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

  /* ---------- Store goal (v0.6.3) ---------- */
  /* All three pieces inherit currentColor so themes get their accent for free.
     Themes that need explicit overrides (paper-textured backgrounds, etc.) can
     follow up with .fh-<theme>-page .fh-goal-* rules. */
  .fh-goal-banner {
    display:flex; flex-direction:column; gap:6px;
    padding:10px 12px; margin-bottom:12px;
    border:1px solid color-mix(in srgb, currentColor 24%, transparent);
    border-radius:8px;
    background:color-mix(in srgb, currentColor 6%, transparent);
  }
  .fh-goal-banner-head {
    display:flex; flex-wrap:wrap; align-items:baseline; gap:6px 10px;
    font-size:var(--fh-text-sm);
  }
  .fh-goal-banner-lbl {
    font-family:var(--fh-font-mono); font-size:var(--fh-text-xs);
    letter-spacing:.08em; text-transform:uppercase; opacity:.65;
  }
  .fh-goal-banner-name { font-weight:700; }
  .fh-goal-banner-amt {
    margin-left:auto; font-family:var(--fh-font-mono);
    font-size:var(--fh-text-xs); opacity:.85;
  }
  /* Shared bar \u2014 reused by rail variant. Track inherits, fill = solid current. */
  .fh-goal-bar {
    height:8px; border-radius:4px; overflow:hidden;
    background:color-mix(in srgb, currentColor 14%, transparent);
  }
  .fh-goal-bar-fill {
    height:100%; background:currentColor;
    transition:width .25s ease-out;
  }
  /* Rail variant \u2014 vertical stack, more compact. */
  .fh-goal-rail {
    display:flex; flex-direction:column; gap:4px;
    padding:8px 10px; margin-bottom:8px;
    border:1px solid color-mix(in srgb, currentColor 22%, transparent);
    border-radius:6px;
  }
  .fh-goal-rail-lbl {
    font-family:var(--fh-font-mono); font-size:.7rem;
    letter-spacing:.1em; opacity:.65;
  }
  .fh-goal-rail-name { font-weight:700; font-size:var(--fh-text-sm); line-height:1.2; }
  .fh-goal-rail-rem  { font-size:var(--fh-text-xs); opacity:.75; }
  /* Toggle button \u2014 inline-positioned near a store item by its theme. */
  .fh-goal-tog {
    background:transparent; color:inherit;
    border:none; padding:2px 6px; cursor:pointer;
    font-size:1.2em; line-height:1;
    opacity:.55; transition:opacity .15s, transform .15s;
  }
  .fh-goal-tog:hover { opacity:1; transform:scale(1.15); }
  .fh-goal-tog.is-goal { opacity:1; }

  /* -------------------------------------------------------------------------
     Group reward UI (v0.6.3 item 13)
     ------------------------------------------------------------------------- */

  /* Proposal banner: one or more cards at the top of the store tab */
  .fh-group-proposals {
    display:flex; flex-direction:column; gap:8px; margin-bottom:12px;
  }
  .fh-group-proposal-card {
    background:var(--fh-surface); border:1px solid var(--fh-accent);
    border-radius:8px; padding:10px 12px;
    display:flex; flex-direction:column; gap:6px;
  }
  .fh-group-proposal-from { font-size:.85rem; color:var(--fh-text); line-height:1.35; }
  .fh-group-proposal-share { font-size:.78rem; color:var(--fh-text-sec); }
  .fh-group-proposal-btns { display:flex; gap:8px; margin-top:2px; }
  .fh-group-proposal-accept {
    flex:1; padding:6px 0; border:none; border-radius:6px; cursor:pointer;
    background:var(--fh-success,#4caf7d); color:#fff;
    font-size:.8rem; font-weight:700;
  }
  .fh-group-proposal-decline {
    flex:1; padding:6px 0; border:none; border-radius:6px; cursor:pointer;
    background:var(--fh-surface2,rgba(0,0,0,.07)); color:var(--fh-text-sec);
    font-size:.8rem; font-weight:600;
  }
  .fh-group-proposal-accept:hover { filter:brightness(1.08); }
  .fh-group-proposal-decline:hover { filter:brightness(.9); }

  /* -------------------------------------------------------------------------
     Subscription rail \u2014 kid "Your Subscriptions" above the store tab (v0.6.5)
     ------------------------------------------------------------------------- */

  .fh-sub-rail {
    display:flex; flex-direction:column; gap:6px; margin-bottom:14px;
  }
  .fh-sub-rail-hdr {
    font-family:var(--fh-font-mono); font-size:var(--fh-text-xs);
    letter-spacing:.1em; text-transform:uppercase; opacity:.65;
    padding:0 2px; margin-bottom:2px;
  }
  .fh-sub-row {
    display:flex; align-items:center; gap:8px;
    padding:8px 10px; border-radius:8px;
    background:var(--fh-surface);
    border-left:3px solid currentColor;
  }
  .fh-sub-row--lapsed {
    border-left-color:#CC2200;
    background:color-mix(in srgb, #CC2200 6%, var(--fh-surface));
  }
  .fh-sub-row--cancel-pending {
    border-left-color:#E0B84C;
    opacity:.8;
  }
  .fh-sub-icon { flex-shrink:0; display:flex; align-items:center; }
  .fh-sub-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
  .fh-sub-name { font-size:.88rem; font-weight:700; }
  .fh-sub-info {
    display:flex; align-items:center; gap:4px; flex-wrap:wrap;
    font-size:.75rem;
  }
  .fh-sub-renews  { color:var(--fh-text-sec); }
  .fh-sub-sep     { color:var(--fh-text-sec); opacity:.5; }
  .fh-sub-ready   { color:var(--fh-success,#30d158); font-weight:600; }
  .fh-sub-unready { color:var(--fh-overdue,#CC2200); font-weight:600; }
  .fh-sub-status  { font-size:.75rem; font-weight:600; }
  .fh-sub-status--lapsed  { color:var(--fh-overdue,#CC2200); }
  .fh-sub-status--pending { color:#E0B84C; }
  .fh-sub-price {
    flex-shrink:0; font-size:.75rem; font-family:var(--fh-font-mono);
    color:var(--fh-text-sec); white-space:nowrap;
  }
  .fh-sub-cancel-btn {
    flex-shrink:0; padding:4px 8px;
    border:1px solid var(--fh-text-sec); border-radius:5px;
    background:transparent; color:var(--fh-text-sec);
    font-size:.72rem; cursor:pointer;
  }
  .fh-sub-cancel-btn:hover { background:color-mix(in srgb, currentColor 10%, transparent); }

  /* Subscribed badge on store rows */
  .fh-badge-subscribed {
    display:inline-block; padding:4px 10px; border-radius:5px;
    background:color-mix(in srgb, var(--fh-success,#30d158) 15%, transparent);
    color:var(--fh-success,#30d158); font-size:.75rem; font-weight:700;
    white-space:nowrap;
  }

  /* ---- Subscription mini rows (shared across tasks rail + store rail) ---- */
  .fh-sub-mini-row { margin-bottom:10px; }
  .fh-sub-mini-row:last-child { margin-bottom:0; }
  .fh-sub-mini-head {
    display:flex; align-items:center; gap:6px; margin-bottom:4px;
  }
  .fh-sub-mini-icon { line-height:1; flex-shrink:0; }
  .fh-sub-mini-name {
    flex:1; font-size:.8rem; font-weight:600;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-sub-mini-price { font-size:.7rem; opacity:.7; white-space:nowrap; flex-shrink:0; }
  .fh-sub-mini-bar-wrap {
    height:4px; border-radius:2px;
    background:rgba(255,255,255,.12); overflow:hidden; margin-bottom:3px;
  }
  .fh-sub-mini-bar { height:100%; border-radius:2px; transition:width .3s; }
  .fh-sub-mini-status { font-size:.7rem; opacity:.7; }
  /* Light-themed panels need a dark progress track */
  .fh-hp-rpanel .fh-sub-mini-bar-wrap,
  .fh-dn-rpanel .fh-sub-mini-bar-wrap,
  .fh-bk-rpanel .fh-sub-mini-bar-wrap,
  .fh-dbz-rpanel .fh-sub-mini-bar-wrap { background:rgba(0,0,0,.12); }

  /* ---- Store tab two-column layout (main + 480px rail) ---- */
  .fh-store-with-rail { display:block; }
  .fh-store-main { width:100%; }
  .fh-store-rail-panel { display:none; width:480px; flex-shrink:0; flex-direction:column; gap:8px; }
  @container fh (min-width: 960px) {
    .fh-store-with-rail { display:flex; gap:16px; align-items:flex-start; }
    .fh-store-rail-panel { display:flex; }
  }
  .fh-store-rail-section {
    background:rgba(255,255,255,.06); border-radius:8px; padding:12px;
  }
  .fh-store-rail-hdr {
    font-size:.65rem; font-weight:700; letter-spacing:.08em;
    opacity:.55; margin-bottom:10px;
  }
  .fh-store-sub-row { margin-bottom:10px; }
  .fh-store-sub-row:last-child { margin-bottom:0; }
  .fh-store-purchase-row {
    display:flex; flex-direction:column; gap:2px;
    padding:6px 0; border-bottom:1px solid rgba(255,255,255,.08);
  }
  .fh-store-purchase-row:last-child { border-bottom:none; }
  .fh-store-purchase-name { font-size:.82rem; font-weight:600; }
  .fh-store-purchase-meta {
    display:flex; gap:8px; font-size:.7rem; opacity:.65; align-items:center;
  }
  .fh-store-purchase-when { margin-left:auto; }

  /* ---- Per-theme store rail section colors ---- */
  .fh-classic-page .fh-store-rail-section {
    background:var(--fh-surface); border:1px solid var(--fh-border); border-radius:8px;
  }
  .fh-classic-page .fh-store-rail-hdr {
    font-family:var(--fh-font-mono); color:var(--fh-text-sec); opacity:1;
    border-bottom:1px solid var(--fh-border); padding-bottom:4px;
  }
  .fh-classic-page .fh-store-purchase-row { border-bottom-color:var(--fh-border); }

  .fh-eng-page .fh-store-rail-section {
    background:#0B2D48; border:1px solid rgba(60,122,165,.4); border-radius:0;
  }
  .fh-eng-page .fh-store-rail-hdr {
    font-family:var(--fh-font-mono); color:#E0B84C; opacity:1; letter-spacing:.18em;
  }
  .fh-eng-page .fh-store-purchase-row { border-bottom-color:rgba(60,122,165,.25); }

  .fh-hp-page .fh-store-rail-section {
    background:#FAF0D7; border:1px solid rgba(36,25,20,.3); border-radius:4px; color:#241914;
    box-shadow:inset 0 0 0 3px rgba(36,25,20,.04);
  }
  .fh-hp-page .fh-store-rail-hdr {
    font-family:"Cinzel","Georgia",serif; color:#1F4F3C; opacity:1; font-size:.9rem; letter-spacing:.1em;
    border-bottom:1px solid rgba(36,25,20,.2); padding-bottom:4px;
  }
  .fh-hp-page .fh-sub-mini-bar-wrap { background:rgba(0,0,0,.12); }
  .fh-hp-page .fh-store-purchase-row { border-bottom-color:rgba(36,25,20,.15); }

  .fh-dn-page .fh-store-rail-section {
    background:#F0E5C8; border:1px solid rgba(43,31,14,.25); color:#2B1F0E;
    box-shadow:1px 1px 0 rgba(43,31,14,.08);
  }
  .fh-dn-page .fh-store-rail-hdr {
    font-family:"JetBrains Mono",monospace; color:#8C281E; opacity:1;
    letter-spacing:.18em; font-size:.7rem;
    border-bottom:1px dashed rgba(43,31,14,.25); padding-bottom:4px;
  }
  .fh-dn-page .fh-sub-mini-bar-wrap { background:rgba(0,0,0,.12); }
  .fh-dn-page .fh-store-purchase-row { border-bottom-color:rgba(43,31,14,.15); }

  .fh-bk-page .fh-store-rail-section {
    background:#FBF3E2; border:1px solid rgba(58,31,18,.2); color:#3A1F12;
  }
  .fh-bk-page .fh-store-rail-hdr {
    font-family:"DM Serif Display","Georgia",serif; color:#8B3A2A; opacity:1; font-size:.9rem;
    text-align:center; border-bottom:1px dashed rgba(58,31,18,.25); padding-bottom:4px;
  }
  .fh-bk-page .fh-sub-mini-bar-wrap { background:rgba(0,0,0,.12); }
  .fh-bk-page .fh-store-purchase-row { border-bottom-color:rgba(58,31,18,.15); }

  .fh-dbz-page .fh-store-rail-section {
    background:#FFFFFF; border:3px solid #0F1E2E; border-radius:8px;
    box-shadow:0 4px 0 #0F1E2E; color:#0F1E2E;
  }
  .fh-dbz-page .fh-store-rail-hdr {
    font-family:"Bangers","Impact",sans-serif; color:#0F1E2E; opacity:1;
    letter-spacing:.08em; font-size:.9rem;
    border-bottom:2px solid #0F1E2E; padding-bottom:4px;
  }
  .fh-dbz-page .fh-sub-mini-bar-wrap { background:rgba(0,0,0,.15); }
  .fh-dbz-page .fh-store-purchase-row { border-bottom-color:rgba(15,30,46,.2); }

  /* Group reward info block \u2014 compact single-line layout */
  .fh-group-reward-info { margin-top:4px; }
  .fh-group-reward-line {
    display:flex; align-items:center; gap:10px;
    flex-wrap:wrap;
    font-size:.78rem;
  }
  .fh-group-reward-tag {
    font-size:.72rem; font-weight:700; color:var(--fh-accent);
    letter-spacing:.03em; text-transform:uppercase; white-space:nowrap;
  }
  .fh-group-reward-pills {
    display:inline-flex; flex-wrap:wrap; gap:4px; align-items:center;
  }
  .fh-gcp {
    display:inline-flex; align-items:center; gap:4px;
    padding:2px 6px 2px 2px;
    border-radius:999px;
    /* Use the theme surface token so pts text always reads on an opaque background.
       The old rgba(.08) tint was nearly transparent and blended with the card surface. */
    background:var(--fh-surface, rgba(127,119,221,.16));
    border:1px solid var(--fh-border);
    font-size:.7rem;
  }
  .fh-gcp--me   { border-color:var(--fh-accent); background:rgba(127,119,221,.26); }
  .fh-gcp--done { border-color:var(--fh-success,#30d158); background:rgba(48,209,88,.18); }
  .fh-gcp--done .fh-gcp-pts { color:var(--fh-success,#30d158); font-weight:700; }
  .fh-gcp-av {
    width:18px; height:18px; border-radius:50%;
    color:#fff; font-size:.65rem; font-weight:700;
    display:inline-flex; align-items:center; justify-content:center;
    flex-shrink:0;
    /* Dark halo ensures the initial letter is readable on any avatar_color \u2014
       light yellow, pale green, etc. \u2014 without needing to know the luminance. */
    text-shadow:0 0 3px rgba(0,0,0,.75), 0 1px 2px rgba(0,0,0,.5);
  }
  .fh-gcp-pts { color:var(--fh-text); font-weight:600; white-space:nowrap; }

  /* Chip In button */
  .fh-group-chip-btn {
    padding:6px 14px; border:none; border-radius:6px; cursor:pointer;
    background:var(--fh-accent); color:#fff;
    font-size:.82rem; font-weight:700; display:inline-block;
    margin-top:4px;
  }
  .fh-group-chip-btn:hover { filter:brightness(1.1); }
  .fh-group-chip-btn--disabled { opacity:.4; cursor:not-allowed; }
  .fh-group-chip-done {
    display:inline-block; margin-top:4px;
    font-size:.78rem; color:var(--fh-success,#30d158); font-weight:700;
  }

  /* Admin: fully-funded group reward in redemption queue */
  .fh-ad-group-funded {
    display:flex; flex-direction:column; gap:4px; padding:10px 12px;
    border:1px solid var(--fh-success,#4caf7d); border-radius:8px;
    margin-bottom:8px; background:rgba(76,175,125,.06);
  }
  .fh-ad-group-funded-hdr { font-weight:700; font-size:.9rem; color:var(--fh-text); }
  .fh-ad-group-funded-meta { font-size:.78rem; color:var(--fh-text-sec); }

  /* Store item icon (v0.6.3) \u2014 themes call storeItemIcon() to drop this in
     ahead of each item's body. Color inherits, so it picks up the theme accent. */
  .fh-store-item-icon {
    display:inline-flex; align-items:center; justify-content:center;
    flex-shrink:0; width:28px; height:28px;
    color:inherit;
  }
  .fh-store-inv-icon {
    display:inline-flex; align-items:center; justify-content:center;
    flex-shrink:0; width:24px; height:24px; color:var(--fh-text-sec);
  }
  /* Classic store item head row \u2014 icon + name + goal star */
  .fh-store-item-head {
    display:flex; align-items:center; gap:8px;
  }
  .fh-store-item-head .fh-store-name { flex:1; min-width:0; }

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
  /* Dual medal mode \u2014 break the circular seal into a wider pill so
     "+3 / \u22121" has room to breathe, and brighten the negative half so it
     reads against the dark emerald gradient. */
  .fh-row--hp .fh-row-pts.fh-row-pts--dual {
    width:auto; height:auto;
    border-radius:14px;
    padding:6px 12px;
    background:linear-gradient(180deg, #1F4F3C 0%, #143427 100%);
    box-shadow:0 2px 6px rgba(31,79,60,.25);
    gap:6px;
  }
  .fh-row--hp .fh-row-pts-neg { color:#F4B8B8; }
  .fh-row--hp .fh-row-pts-sep { color:#EFE0BA; opacity:.35; }
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

  /* ============================================================
     Phone-friendly pass (v0.6.2)
     Target: 375-414px (iPhone SE \u2192 Pro Max). Themed personal pages
     were designed for the 400px Lovelace card on Echo Show 15 but
     compress poorly on actual phones, so this block tightens the
     row anatomy, drops kid-large to one column, and hides/trims
     theme chrome (frames, watermarks, corner ornaments, tape strips).
     ============================================================ */
  @media (max-width: 500px) {
    /* --- Row anatomy: stack chips + button below body --- */
    .fh-row {
      display:grid;
      grid-template-columns:auto 1fr auto;
      grid-template-areas:
        "lead icon  pts"
        "body body  body"
        "chips chips chips"
        "btn  btn   btn";
      gap:6px 8px;
      padding:10px 10px 10px;
    }
    .fh-row-lead  { grid-area:lead; }
    .fh-row-icon  { grid-area:icon; width:70px; height:70px; }
    .fh-row-icon svg { width:42px; height:42px; }
    .fh-row-body  { grid-area:body; }
    .fh-row-chips { grid-area:chips;
      flex-direction:row; flex-wrap:wrap;
      justify-content:flex-start; align-items:center;
      gap:4px; row-gap:4px;
    }
    .fh-row-pts-col { grid-area:pts; min-width:0; }
    .fh-row-pts   { min-width:0; }
    .fh-row-btn   { grid-area:btn; width:100%; min-height:48px; }

    /* Auto-truncate descriptions instead of expand-toggle (no JS). */
    .fh-row-desc {
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }

    /* --- Kid-large: drop the grid to a single column. The 190px minmax
       squeezes two columns onto a 414px viewport and chops the icon. --- */
    .kid-large .fh-row-list {
      grid-template-columns:1fr;
      gap:10px;
    }
    .kid-large .fh-row {
      min-height:auto;
      grid-template-columns:auto 1fr auto;
      grid-template-areas:
        "icon name pts"
        "icon name btn";
      flex-direction:row;
      align-items:center;
      padding:12px 10px;
      gap:10px;
    }
    .kid-large .fh-row-icon { grid-area:icon; width:72px; height:72px; }
    .kid-large .fh-row-icon svg { width:100%; height:100%; }
    .kid-large .fh-row-icon .fh-chore-icon {
      width:60px !important; height:60px !important;
    }
    .kid-large .fh-row-body  { grid-area:name; align-items:flex-start; text-align:left; }
    .kid-large .fh-row-name  { font-size:var(--fh-text-md); }
    .kid-large .fh-row-pts   { grid-area:pts; font-size:var(--fh-text-lg); }
    .kid-large .fh-row-btn   { grid-area:btn; min-height:48px; padding:0 14px; font-size:var(--fh-text-sm); }
    .kid-large .fh-row-chips { display:none; }

    /* --- Theme chrome: hide/scale ornaments that eat small screens. --- */
    /* Engineer: blueprint grid + double border are decorative \u2014 drop them. */
    .fh-eng-grid,
    .fh-eng-border-outer,
    .fh-eng-border-inner { display:none; }

    /* Baker: paper-card double frame collapses to a single light border. */
    .fh-bk-frame-inner { display:none; }
    .fh-bk-frame-outer { inset:4px; }

    /* Dinos: corner tape strips disappear (they spill outside the viewport
       on narrow screens anyway). */
    .fh-dn-tape { display:none; }

    /* HP: thin out the heavy inset-shadow frame and shrink corner glyphs. */
    .fh-hp-frame { box-shadow:inset 0 0 0 2px #241914, inset 0 0 0 3px #C9A22A; }
    .fh-hp-corner { font-size:.9rem; }
  }
`});var Ye,Pt=O(()=>{zt();Mt();Bt();It();Dt();Ye=Ct+At+Ft+Rt+Tt});var Lt=O(()=>{Pt()});var Ot,De,L,Xe,Q,j,Qe,W=O(()=>{Ot="family_hub",De="0.7.5",L="#7F77DD",Xe=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],Q={task_completed:{label:"Completed",color:"var(--fh-success)"},task_approved:{label:"Approved",color:"var(--fh-success)"},pending_approval:{label:"Pending approval",color:"var(--fh-warning)"},task_denied:{label:"Denied",color:"var(--fh-overdue)"},task_skipped:{label:"Skipped",color:"var(--fh-warning)"},task_excused:{label:"Excused",color:"var(--fh-accent)"},task_rejected:{label:"Rejected",color:"var(--fh-overdue)"},task_marked_complete:{label:"Marked done",color:"var(--fh-success)"},task_late_claimed:{label:"Claimed late",color:"var(--fh-warning)"},points_awarded:{label:"Points",color:"var(--fh-accent)"},redemption_requested:{label:"Redeem request",color:"var(--fh-warning)"},redemption_approved:{label:"Redeem approved",color:"var(--fh-success)"},redemption_declined:{label:"Redeem declined",color:"var(--fh-overdue)"},task_added:{label:"Task added",color:"var(--fh-text-sec)"},person_added:{label:"Person added",color:"var(--fh-text-sec)"},allowance:{label:"Allowance",color:"var(--fh-success)"},completion_streak_milestone:{label:"Success streak",color:"var(--fh-success)"},subscription_cancel_declined:{label:"Cancel declined",color:"var(--fh-warning)"},subscription_updated:{label:"Sub updated",color:"var(--fh-text-sec)"},subscription_started:{label:"Subscribed",color:"var(--fh-accent)"},subscription_renewed:{label:"Sub renewal",color:"var(--fh-text-sec)"},subscription_lapsed:{label:"Sub lapsed",color:"var(--fh-warning)"},subscription_canceled:{label:"Sub canceled",color:"var(--fh-text-sec)"},subscription_cancel_requested:{label:"Cancel requested",color:"var(--fh-warning)"},group_proposed:{label:"Group proposed",color:"var(--fh-text-sec)"},group_chip_in:{label:"Chipped in",color:"var(--fh-accent)"},group_redeemed:{label:"Group redeemed",color:"var(--fh-success)"}},j={check:'<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',plus:'<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>',edit:'<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',trash:'<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',bell:'<svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.92V4a1 1 0 1 0-2 0v1.08A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',award:'<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',minus:'<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14z"/></svg>',close:'<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',settings:'<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/></svg>',person:'<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',store:'<svg viewBox="0 0 24 24"><path d="M20 4H4v2l16-2zm1 5H3l1 11h16l1-11zm-9 8H10v-4h2v4zm0-6H10v-2h2v2z"/></svg>',remove:'<svg viewBox="0 0 24 24"><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM2 6v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6H2zm8 13H4v-1h6v1zm0-3H4v-1h6v1zm0-3H4v-1h6v1zm1-7H3V8h8V6zm-2-3H5V2h4v1z"/></svg>',history:'<svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>',excuse:'<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',print:'<svg viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-1-9H6v4h12V3z"/></svg>',rewards:'<svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.89.36 13.36.36c-1.38 0-2.56.6-3.36 1.55C9.2.96 8.02.36 6.64.36 4.11.36 2 2.53 2 4.64c0 .48.11.92.18 1.36H0v4h1v10h22V10h1V6h-4zm-8 12H6V10h6v8zm0-10H4V8h8v2zm4 10h-2v-8h2v8zm2-10h-6V8h6v2zm-5.36-4c-.45 0-1.09-.49-1.09-1.36 0-.87.64-1.36 1.09-1.36.46 0 1.1.49 1.1 1.36C13.74 3.51 13.1 4 12.64 4zM6.64 4c-.45 0-1.09-.49-1.09-1.36 0-.87.64-1.36 1.09-1.36.46 0 1.1.49 1.1 1.36C7.74 3.51 7.1 4 6.64 4z"/></svg>',toggle:'<svg viewBox="0 0 24 24"><path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>'},Qe=[{key:"brush-teeth-am",name:"Brush teeth",description:"Morning \u2014 brush for 2 minutes",category:"Morning",points:5},{key:"make-bed",name:"Make bed",description:"Pull up covers and fluff pillow",category:"Morning",points:10},{key:"get-dressed",name:"Get dressed",description:"Clothes on, shoes tied, ready to go",category:"Morning",points:5},{key:"take-vitamins",name:"Take vitamins",description:"",category:"Morning",points:5},{key:"eat-breakfast",name:"Eat breakfast",description:"",category:"Morning",points:5},{key:"brush-teeth-pm",name:"Brush teeth (evening)",description:"Before bed \u2014 brush for 2 minutes",category:"Evening",points:5},{key:"pajamas-on",name:"Pajamas on",description:"",category:"Evening",points:5},{key:"pick-up-room",name:"Pick up room",description:"Put toys away and tidy floor",category:"Evening",points:10},{key:"pack-backpack",name:"Pack backpack",description:"Ready for tomorrow",category:"Evening",points:10},{key:"clear-table",name:"Clear table",description:"After dinner \u2014 dishes to the sink",category:"Kitchen",points:10},{key:"load-dishwasher",name:"Load dishwasher",description:"",category:"Kitchen",points:15},{key:"unload-dishwasher",name:"Unload dishwasher",description:"",category:"Kitchen",points:15},{key:"wipe-counters",name:"Wipe counters",description:"",category:"Kitchen",points:10},{key:"take-out-trash",name:"Take out trash",description:"",category:"Chores",points:15},{key:"vacuum",name:"Vacuum living room",description:"",category:"Chores",points:20},{key:"sweep-floor",name:"Sweep/mop floor",description:"",category:"Chores",points:15},{key:"feed-pets",name:"Feed pets",description:"",category:"Chores",points:10},{key:"water-plants",name:"Water plants",description:"",category:"Chores",points:10},{key:"homework",name:"Homework",description:"Complete all assigned homework",category:"School",points:20},{key:"reading",name:"Reading time",description:"Read for 20 minutes",category:"School",points:15}]});function Ht(e){return e<-1?`${Math.abs(e)}d overdue`:e===-1?"1d overdue":e===0?"Today":e===1?"Tomorrow":`In ${e}d`}function Pe(e,t){return e.map(a=>`<option value="${a.value}" ${a.value===t?"selected":""}>${a.label}</option>`).join("")}function ht(e,t,a=!1){let s=e||[],o=a?s.slice(0,1):s;return Xe.map((r,n)=>{let i=o.includes(n);return`<label class="fh-wd-chip ${i?"checked":""}">
          <input type="${a?"radio":"checkbox"}" class="${t}" value="${n}" ${i?"checked":""}>
          ${r}
        </label>`}).join("")}function Z(e){if(!e)return"";let t=Date.now()-new Date(e).getTime(),a=Math.floor(t/6e4);if(a<1)return"just now";if(a<60)return`${a}m ago`;let s=Math.floor(a/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`}function io(e){return e?new Date(e+"T12:00:00").toLocaleDateString(void 0,{month:"short",day:"numeric"}):""}function ae(e){let t=[],a=new Map;for(let o of e){if(o.type==="task_skipped"){let r=o.skipped_date||(o.timestamp||"").slice(0,10);if(r){a.has(r)||a.set(r,[]),a.get(r).push(o);continue}}t.push({isGroup:!1,entry:o,timestamp:o.timestamp})}let s=[];for(let[o,r]of a){let n=r.reduce((i,d)=>i+Math.abs(d.points_delta||0),0);s.push({isGroup:!0,key:`skipped-${o}`,date:o,dateDisplay:io(o),totalPenalty:n,items:r,timestamp:r[0].timestamp})}return[...t,...s].sort((o,r)=>(r.timestamp||"").localeCompare(o.timestamp||""))}var N,P,H,pt,Nt,m,C,V=O(()=>{W();N=e=>(e||"?")[0].toUpperCase(),P=e=>(e||0).toLocaleString(),H=e=>`$${(e||0).toFixed(2)}`,pt=e=>e?e[0].toUpperCase()+e.slice(1):"",Nt=e=>(e||"").toLowerCase().replace(/ /g,"_"),m=e=>String(e||"").replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]),C=m});function oe(e,t,a="28px"){return typeof e=="string"&&e.startsWith("data:image/")?`<span class="fh-chore-icon" style="width:${a};height:${a};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><img src="${e}" style="width:100%;height:100%;object-fit:contain;border-radius:4px" alt=""></span>`:e&&jt[e]?`<span class="fh-chore-icon fh-chore-emoji" style="width:${a};height:${a};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24"><text x="12" y="12" text-anchor="middle" dominant-baseline="central" font-size="22">${jt[e]}</text></svg></span>`:e&&ft[e]?`<span class="fh-chore-icon" style="width:${a};height:${a};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:currentColor">`+ft[e]+"</span>":`<span class="fh-chore-dot" style="width:12px;height:12px;border-radius:50%;background:${t||lo[0]};display:inline-block;flex-shrink:0"></span>`}var I,ft,jt,mt,Gt,lo,Br,Ne=O(()=>{I=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,ft={bed:I('<rect x="2" y="8" width="20" height="12" rx="1"/><path d="M2 14h20"/><path d="M7 14V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5"/><circle cx="6" cy="11" r="1" fill="currentColor" stroke="none"/>'),tooth:I('<path d="M9 3h6a4 4 0 0 1 4 4c0 5-1.5 9-3 12-.5 1-1.5 1-2 0l-.5-2c-.3-.9-1.7-.9-2 0l-.5 2c-.5 1-1.5 1-2 0C7.5 16 6 12 6 7a4 4 0 0 1 3-4z"/>'),shower:I('<path d="M5 5l4 4"/><path d="M19 4a9 9 0 0 0-9 9"/><path d="M14 4a9 9 0 0 0-5 5"/><path d="M4 22l5-5"/><circle cx="11" cy="15" r=".6" fill="currentColor" stroke="none"/><circle cx="14" cy="17" r=".6" fill="currentColor" stroke="none"/><circle cx="8.5" cy="17" r=".6" fill="currentColor" stroke="none"/><circle cx="11" cy="19" r=".6" fill="currentColor" stroke="none"/>'),hair:I('<path d="M4 4h16v3H4z"/><path d="M6 7v9M9 7v12M12 7v12M15 7v9M18 7v9"/>'),sleep:I('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>'),laundry:I('<rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2.5"/><path d="M7 6h.5M10 6h.5"/>'),folding:I('<path d="M3 6l3-4h4l2 3 2-3h4l3 4-4 2v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8z"/>'),room:I('<path d="M3 21V9.5L12 3l9 6.5V21H3z"/><path d="M9 21v-7h6v7"/>'),pack:I('<path d="M5 7h14l-1.5 12a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-2z"/><path d="M8 7V6a4 4 0 0 1 8 0v1"/><path d="M9 13h6"/>'),backpack:I('<path d="M9 4a3 3 0 0 1 6 0v1a7 7 0 0 1-6 0z"/><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 14h8M8 17h5"/>'),dog:I('<path d="M3 11a9 9 0 0 0 18 0V8l-3-1-1-5-5 3-5-3-1 5-3 1z"/><path d="M7 19v3M17 19v3"/><circle cx="10" cy="11" r=".8" fill="currentColor" stroke="none"/><circle cx="14" cy="11" r=".8" fill="currentColor" stroke="none"/><path d="M10 14c1.5 1.5 2.5 1.5 4 0"/>'),cat:I('<path d="M5 7l-1-5 4 4h4l4-4-1 5a7 7 0 0 1-10 0z"/><circle cx="10" cy="12" r=".5" fill="currentColor" stroke="none"/><circle cx="14" cy="12" r=".5" fill="currentColor" stroke="none"/><path d="M10 14l1 2h2l1-2M12 17v1.5"/>'),pet:I('<ellipse cx="7.5" cy="7.5" rx="2.5" ry="3"/><ellipse cx="16.5" cy="7.5" rx="2.5" ry="3"/><ellipse cx="4" cy="14" rx="2" ry="2.5"/><ellipse cx="20" cy="14" rx="2" ry="2.5"/><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5"/>'),fish:I('<path d="M20 12a8 8 0 0 1-8 6 8 8 0 0 1-8-6 8 8 0 0 1 8-6 8 8 0 0 1 8 6z"/><path d="M20 12l4-5v10z"/><circle cx="9" cy="11" r="1" fill="currentColor" stroke="none"/>'),dishes:I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>'),plate:I('<path d="M5 3v8a4 4 0 0 0 8 0V3M9 3v17"/><path d="M19 3v17M17 7a2 2 0 0 1 4 0v4h-4z"/>'),cooking:I('<path d="M4 15h16l-1.5 5a2 2 0 0 1-1.9 1.5H7.4A2 2 0 0 1 5.5 20z"/><path d="M8 7V5M12 6V4M16 7V5"/><path d="M5 12h14a6 6 0 0 0-6-6h-2a6 6 0 0 0-6 6z"/>'),meals:I('<path d="M4 15a8 8 0 0 0 16 0H4z"/><path d="M8 10c0-1 1-2 1-3M12 10c0-1 1-2 1-3M16 10c0-1 1-2 1-3"/>'),lunch:I('<rect x="3" y="10" width="18" height="11" rx="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/><path d="M8 15h8M8 18h5"/>'),coffee:I('<path d="M6 10h12v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"/><path d="M18 12h2a2 2 0 0 1 0 4h-2"/><path d="M9 6c0-1.5 1-2 1-3M13 6c0-1.5 1-2 1-3"/>'),snack:I('<path d="M14 3c1 0 2 1 2 2 0 2-2 3-3 4-1-1-3-2-3-4a2 2 0 0 1 2-2h2z"/><path d="M12 9a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/>'),bread:I('<path d="M3 11a5 5 0 0 1 10 0v9H3z"/><path d="M13 11a5 5 0 0 1 5-5h1a2 2 0 0 1 2 2v11H13z"/><path d="M3 14h10"/>'),menu:I('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>'),table:I('<circle cx="12" cy="13" r="5"/><path d="M5 3v8M5 11a3 3 0 0 0 6 0"/><path d="M19 3v17M17 7a2 2 0 0 1 4 0v4h-4z"/>'),trash:I('<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>'),broom:I('<path d="M19 3 9 13"/><path d="M7 15.5l5 5M5 21l2-2M10 20.5l3-3"/><path d="m9 13 5 5-3 3-7 1 1-7z"/>'),vacuum:I('<circle cx="14" cy="15" r="5"/><circle cx="14" cy="15" r="2"/><path d="M9 15H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h5l3-2h6l-3 6"/>'),wipe:I('<rect x="3" y="10" width="18" height="10" rx="2"/><path d="M7 14l3 3M11 14l3 3M15 14l3 3"/><path d="M7 10V5a3 3 0 0 1 6 0v5"/>'),mop:I('<path d="M4 3l12 12"/><path d="M14 4l6 6"/><path d="M4 15l6-6 8 8-6 4-8-6z"/>'),sweep:I('<path d="M16 3 4 15"/><path d="M2 22l4-4.5"/><path d="M4 15h12a4 4 0 0 1 0 8H4z"/>'),bathroom:I('<path d="M3 14h18v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M3 14V9a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1"/><path d="M5 10h4"/>'),windows:I('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18"/>'),recycling:I('<path d="M7 11l-4 4 4 4M3 15h10a4 4 0 0 0 3.46-6"/><path d="M17 13l4-4-4-4M21 9H11a4 4 0 0 0-3.46 6"/>'),bucket:I('<path d="M7 6h10l1.5 13a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2z"/><path d="M5.5 6a6.5 6.5 0 0 1 13 0"/><path d="M9 12c0 2 1 3 3 3s3-1 3-3"/>'),dusting:I('<path d="M3 21l10-10"/><path d="M12 8l2-5 4 4-5 2z"/><path d="M14 12l3 3"/><path d="M17 7c1.5 1.5 1.5 3.5 0 5"/><path d="M15 5c2.5 1.5 3.5 4.5 1 7"/>'),lawn:I('<path d="M3 21h18"/><path d="M6 21V14a6 6 0 0 1 12 0v7"/><path d="M12 8v6"/><path d="M10 11c-.5-1.5 0-3.5 2-3.5s2.5 2 2 3.5"/>'),garden:I('<path d="M3 14a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M17 15h3l1-6"/><path d="M5 14V9a4 4 0 0 1 8 0v5"/><path d="M7 20l1 3M10 20l1 3M13 20l1 3"/>'),plant:I('<path d="M12 20V12"/><path d="M12 12c-3-2-6-1-7-6 5-1 8 2 7 6z"/><path d="M12 12c3-2 6-1 7-6-5-1-8 2-7 6z"/><path d="M8 20h8"/>'),leaves:I('<path d="M5 21c3-8 9-14 16-14-2 8-8 14-16 14z"/><path d="M5 21l8-8"/>'),snow:I('<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/><path d="M9 6l3-3 3 3M9 18l3 3 3-3"/><path d="M4.5 10.5l-3 2 3 2M19.5 10.5l3 2-3 2"/>'),garage:I('<rect x="2" y="10" width="20" height="11" rx="1"/><path d="M2 10L12 3l10 7"/><path d="M6 15h12M6 18h8"/>'),homework:I('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/><path d="M16 17l2 2 4-4"/>'),reading:I('<path d="M3 6c3-1.5 6-1.5 9 0 3-1.5 6-1.5 9 0v13c-3-1.5-6-1.5-9 0-3-1.5-6-1.5-9 0z"/><path d="M12 6v13"/>'),book:I('<path d="M4 19V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z"/><path d="M4 17h14"/><path d="M8 7v5l2-2 2 2V7"/>'),pencil:I('<path d="M4 20l12-12 4 4-12 12z"/><path d="M14 6l4 4"/><path d="M4 20l-2 2"/>'),piano:I('<rect x="2" y="6" width="20" height="13" rx="1"/><path d="M7 6v7M10 6v7M15 6v7M18 6v7"/><path d="M2 13h20"/>'),practice:I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>'),calculator:I('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><rect x="7" y="10" width="3" height="2" rx=".5"/><rect x="10.5" y="10" width="3" height="2" rx=".5"/><rect x="14" y="10" width="3" height="2" rx=".5"/><rect x="7" y="13.5" width="3" height="2" rx=".5"/><rect x="10.5" y="13.5" width="3" height="2" rx=".5"/><rect x="14" y="13" width="3" height="5" rx=".5"/><rect x="7" y="17" width="3" height="2" rx=".5"/><rect x="10.5" y="17" width="3" height="2" rx=".5"/>'),medicine:I('<path d="M8.5 14.5l-5-5a5 5 0 0 1 7-7l5 5"/><path d="M14.5 9.5l-5 5"/><path d="M14.5 14.5l5-5a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7 0l-1-1"/>'),water:I('<path d="M12 2l7 11a7 7 0 1 1-14 0z"/>'),exercise:I('<path d="M6 12h12"/><path d="M6 10v4M18 10v4"/><path d="M4 9v6M20 9v6"/>'),sport:I('<circle cx="12" cy="12" r="9"/><path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9"/><path d="M12 3a15 15 0 0 0-4 9 15 15 0 0 0 4 9"/><path d="M3 9h18M3 15h18"/>'),walk:I('<circle cx="12" cy="4" r="2"/><path d="M8 20l2-6h4l-1 6"/><path d="M16 20l-1-6"/><path d="M9 10h6l-1 4H9l-1-4z"/><path d="M8 7l-2 3M16 7l2 3"/>'),art:I('<path d="M12 21a9 9 0 1 0-.5 0"/><circle cx="8.5" cy="9" r="1.5"/><circle cx="14.5" cy="8" r="1.5"/><circle cx="16.5" cy="13.5" r="1.5"/><circle cx="10" cy="15.5" r="1.5"/>'),music:I('<path d="M9 20V9l12-2v11"/><circle cx="6" cy="20" r="3"/><circle cx="18" cy="18" r="3"/>'),bike:I('<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M6 15l4-8 2 3h6"/><path d="M14 10l4 5"/>'),games:I('<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M6 13v-2M5 12h2"/><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="13.5" r=".5" fill="currentColor" stroke="none"/><path d="M11 16h2"/>'),tools:I('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>'),smarthome:I('<path d="M3 21V9.5L12 3l9 6.5V21H3z"/><circle cx="12" cy="15" r="2"/><path d="M9.17 12.17a5 5 0 0 1 5.66 0"/><path d="M6.34 9.34a9 9 0 0 1 11.32 0"/>'),screen:I('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),car:I('<path d="M5 17H3a2 2 0 0 1-2-2v-4l3-6h16l3 6v4a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 9h14"/>'),shop:I('<path d="M6 2l3 6h10l-1.5 7H7.5L6 2z"/><circle cx="10" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M4 2H2"/>'),phone:I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),mail:I('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>'),errand:I('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M8 11h8M8 15h5"/>'),chore:I('<path d="M4 6h10l3 3v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"/><path d="M8 11l2 2 4-4"/><path d="M14 6V3h6v6h-6z"/>'),star:I('<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'),check:I('<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/>'),timer:I('<circle cx="12" cy="13" r="8"/><path d="M12 5V3M9 3h6"/><path d="M16.95 8.05l1.41-1.41"/><path d="M12 9v4h4"/>'),gift:I('<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18"/><path d="M12 8v13"/><path d="M7.5 8a2.5 2.5 0 1 1 0-5C9 3 11 5 12 8c1-3 3-5 4.5-5a2.5 2.5 0 1 1 0 5"/>'),cash:I('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9.5h.01M18 14.5h.01"/>'),candy:I('<circle cx="12" cy="12" r="5"/><path d="M7 12L3 8v8z"/><path d="M17 12l4-4v8z"/>'),icecream:I('<path d="M8 11a4 4 0 0 1 8 0"/><path d="M7 11h10l-5 11z"/><path d="M9.5 11l.5-2M14.5 11l-.5-2"/>'),cake:I('<rect x="3" y="13" width="18" height="8" rx="1"/><path d="M3 17h18"/><path d="M7 13v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/><path d="M13 13v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/><path d="M9 5v2M15 5v2"/>'),party:I('<path d="M3 21l5-14 8 8z"/><circle cx="17" cy="6" r="1"/><circle cx="20" cy="10" r="1"/><circle cx="14" cy="3" r="1"/><path d="M19 14l2 2M15 14l3 2"/>'),controller:I('<path d="M6 18a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4h-1l-2-3H9l-2 3z"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".7" fill="currentColor"/><circle cx="18" cy="13.5" r=".7" fill="currentColor"/>'),trophy:I('<path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4v2a3 3 0 0 0 3 3"/><path d="M17 6h3v2a3 3 0 0 1-3 3"/><path d="M9 15h6v3H9z"/><path d="M8 21h8"/>'),movie:I('<rect x="2" y="6" width="20" height="12" rx="1"/><path d="M2 10h20M2 14h20"/><path d="M5 6v12M19 6v12"/>'),toy:I('<rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/><path d="M9 17h6"/><path d="M9 8V5h6v3"/>'),sticker:I('<path d="M12 3a9 9 0 1 1-9 9 9 9 0 0 1 9-9z"/><path d="M9 10h.01M15 10h.01"/><path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5"/>')},jt={bed:"\u{1F6CF}\uFE0F",tooth:"\u{1F9B7}",shower:"\u{1F6BF}",hair:"\u{1F487}",sleep:"\u{1F634}",laundry:"\u{1F9FA}",folding:"\u{1F455}",room:"\u{1F9F9}",pack:"\u{1F392}",backpack:"\u{1F392}",dog:"\u{1F415}",cat:"\u{1F408}",pet:"\u{1F43E}",fish:"\u{1F41F}",dishes:"\u{1F37D}\uFE0F",plate:"\u{1F374}",table:"\u{1F37D}\uFE0F",cooking:"\u{1F373}",meals:"\u{1F372}",lunch:"\u{1F96A}",coffee:"\u2615",snack:"\u{1F37F}",bread:"\u{1F35E}",menu:"\u{1F4CB}",trash:"\u{1F5D1}\uFE0F",broom:"\u{1F9F9}",sweep:"\u{1F9F9}",vacuum:"\u{1F9F9}",mop:"\u{1F9FD}",wipe:"\u{1F9FD}",dusting:"\u{1F9F9}",bucket:"\u{1FAA3}",bathroom:"\u{1F6BD}",windows:"\u{1FA9F}",recycling:"\u267B\uFE0F",lawn:"\u{1F33F}",garden:"\u{1FAB4}",plant:"\u{1F331}",leaves:"\u{1F342}",snow:"\u2744\uFE0F",garage:"\u{1F9F0}",homework:"\u{1F4DD}",reading:"\u{1F4D6}",book:"\u{1F4DA}",pencil:"\u270F\uFE0F",calculator:"\u{1F9EE}",piano:"\u{1F3B9}",practice:"\u23F1\uFE0F",medicine:"\u{1F48A}",water:"\u{1F4A7}",exercise:"\u{1F4AA}",sport:"\u26BD",walk:"\u{1F6B6}",art:"\u{1F3A8}",music:"\u{1F3B5}",bike:"\u{1F6B2}",games:"\u{1F3AE}",tools:"\u{1F527}",smarthome:"\u{1F3E0}",screen:"\u{1F4FA}",car:"\u{1F697}",shop:"\u{1F6D2}",phone:"\u{1F4F1}",mail:"\u2709\uFE0F",errand:"\u{1F6CD}\uFE0F",chore:"\u{1F4CB}",star:"\u2B50",check:"\u2705",timer:"\u23F2\uFE0F",gift:"\u{1F381}",cash:"\u{1F4B5}",candy:"\u{1F36C}",icecream:"\u{1F366}",cake:"\u{1F382}",party:"\u{1F389}",controller:"\u{1F3AE}",trophy:"\u{1F3C6}",movie:"\u{1F3AC}",toy:"\u{1F9F8}",sticker:"\u{1F31F}"},mt=[{key:"bed",label:"Make Bed",category:"Self-Care"},{key:"tooth",label:"Brush Teeth",category:"Self-Care"},{key:"shower",label:"Shower",category:"Self-Care"},{key:"hair",label:"Groom Hair",category:"Self-Care"},{key:"sleep",label:"Bedtime",category:"Self-Care"},{key:"laundry",label:"Laundry",category:"Self-Care"},{key:"folding",label:"Fold Clothes",category:"Self-Care"},{key:"room",label:"Clean Room",category:"Self-Care"},{key:"pack",label:"Pack Bag",category:"Self-Care"},{key:"backpack",label:"Backpack",category:"Self-Care"},{key:"dog",label:"Walk Dog",category:"Pets"},{key:"cat",label:"Feed Cat",category:"Pets"},{key:"pet",label:"Pet Care",category:"Pets"},{key:"fish",label:"Feed Fish",category:"Pets"},{key:"dishes",label:"Dishes",category:"Kitchen"},{key:"plate",label:"Set Table",category:"Kitchen"},{key:"table",label:"Place Setting",category:"Kitchen"},{key:"cooking",label:"Cooking",category:"Kitchen"},{key:"meals",label:"Meal Prep",category:"Kitchen"},{key:"lunch",label:"Pack Lunch",category:"Kitchen"},{key:"coffee",label:"Make Coffee",category:"Kitchen"},{key:"snack",label:"Snack",category:"Kitchen"},{key:"bread",label:"Baking",category:"Kitchen"},{key:"menu",label:"Menu Plan",category:"Kitchen"},{key:"trash",label:"Trash",category:"Cleaning"},{key:"broom",label:"Sweep",category:"Cleaning"},{key:"sweep",label:"Sweep Floor",category:"Cleaning"},{key:"vacuum",label:"Vacuum",category:"Cleaning"},{key:"mop",label:"Mop",category:"Cleaning"},{key:"wipe",label:"Wipe Down",category:"Cleaning"},{key:"dusting",label:"Dusting",category:"Cleaning"},{key:"bucket",label:"Deep Clean",category:"Cleaning"},{key:"bathroom",label:"Bathroom",category:"Cleaning"},{key:"windows",label:"Windows",category:"Cleaning"},{key:"recycling",label:"Recycling",category:"Cleaning"},{key:"lawn",label:"Lawn",category:"Outdoors"},{key:"garden",label:"Garden",category:"Outdoors"},{key:"plant",label:"Plants",category:"Outdoors"},{key:"leaves",label:"Rake Leaves",category:"Outdoors"},{key:"snow",label:"Shovel Snow",category:"Outdoors"},{key:"garage",label:"Garage",category:"Outdoors"},{key:"homework",label:"Homework",category:"School"},{key:"reading",label:"Reading",category:"School"},{key:"book",label:"Books",category:"School"},{key:"pencil",label:"Study",category:"School"},{key:"calculator",label:"Math",category:"School"},{key:"piano",label:"Piano",category:"School"},{key:"practice",label:"Practice",category:"School"},{key:"medicine",label:"Medicine",category:"Health"},{key:"water",label:"Drink Water",category:"Health"},{key:"exercise",label:"Exercise",category:"Health"},{key:"sport",label:"Sport",category:"Health"},{key:"walk",label:"Walk",category:"Health"},{key:"art",label:"Art",category:"Hobbies"},{key:"music",label:"Music",category:"Hobbies"},{key:"bike",label:"Bike",category:"Hobbies"},{key:"games",label:"Games",category:"Hobbies"},{key:"tools",label:"Tools",category:"Home"},{key:"smarthome",label:"Smart Home",category:"Home"},{key:"screen",label:"Devices",category:"Home"},{key:"car",label:"Car",category:"Home"},{key:"shop",label:"Shopping",category:"Home"},{key:"phone",label:"Phone",category:"Home"},{key:"mail",label:"Mail",category:"Home"},{key:"errand",label:"Errand",category:"Home"},{key:"chore",label:"Chore",category:"Generic"},{key:"star",label:"Star Task",category:"Generic"},{key:"check",label:"Done",category:"Generic"},{key:"timer",label:"Timed Task",category:"Generic"}],Gt=[{key:"candy",label:"Candy",category:"Treats"},{key:"icecream",label:"Ice Cream",category:"Treats"},{key:"snack",label:"Snack",category:"Treats"},{key:"cake",label:"Cake",category:"Treats"},{key:"bread",label:"Baked Good",category:"Treats"},{key:"cash",label:"Cash",category:"Money & Gifts"},{key:"gift",label:"Gift",category:"Money & Gifts"},{key:"shop",label:"Shopping",category:"Money & Gifts"},{key:"sticker",label:"Sticker",category:"Money & Gifts"},{key:"screen",label:"Screen Time",category:"Screen Time"},{key:"games",label:"Video Games",category:"Screen Time"},{key:"controller",label:"Gamepad",category:"Screen Time"},{key:"movie",label:"Movie",category:"Screen Time"},{key:"phone",label:"Phone Time",category:"Screen Time"},{key:"bike",label:"Bike Ride",category:"Outings"},{key:"car",label:"Car Trip",category:"Outings"},{key:"walk",label:"Walk Out",category:"Outings"},{key:"sport",label:"Sports",category:"Outings"},{key:"pet",label:"Pet Time",category:"Outings"},{key:"toy",label:"Toy",category:"Fun & Special"},{key:"party",label:"Party",category:"Fun & Special"},{key:"trophy",label:"Trophy",category:"Fun & Special"},{key:"star",label:"Special",category:"Fun & Special"},{key:"music",label:"Music",category:"Fun & Special"},{key:"art",label:"Art Supplies",category:"Fun & Special"},{key:"book",label:"Book",category:"Fun & Special"},{key:"timer",label:"Extra Time",category:"Fun & Special"}],lo=["#7F77DD","#30d158","#ff9f0a","#ff453a","#5ac8fa","#ff2d55","#af52de"];Br=Object.keys(ft)});function re(e){return!e||e.type!=="task_skipped"||e.instance_status!=="skipped"||!e.reference_id||!e.person_id?"":`<button class="fh-btn fh-btn-ghost fh-btn-sm fh-late-claim"
                    data-act="claim-late"
                    data-iid="${C(e.reference_id)}"
                    data-pid="${C(e.person_id)}"
                    title="Claim this late \u2014 a parent has to approve it">Claim</button>`}function ne(e,t="28px"){return e!=null&&e.icon?`<span class="fh-store-item-icon">${oe(e.icon,null,t)}</span>`:""}function G(e,t){let a=Math.min(Math.max(0,e),t.length-1);return t[a]}function ie(e,t,a){let s=(o,r,n,i)=>{if(Array.isArray(o)&&o.length){let d=Math.min(Math.max(0,a|0),o.length-1),c=o[d];if(c!=null)return c}return r??n??i};return{dropThr:s(e==null?void 0:e.rank_drop_thresholds,e==null?void 0:e.rank_drop_threshold,t==null?void 0:t.rank_drop_threshold,50),gainThr:s(e==null?void 0:e.rank_gain_thresholds,e==null?void 0:e.rank_gain_threshold,t==null?void 0:t.rank_gain_threshold,75)}}function Ut(e=0){let t=new Date,a=t.getDay(),s=(e+1)%7,o=(a-s+7)%7,r=new Date(t);return r.setHours(0,0,0,0),r.setDate(r.getDate()-o),r}function le(e,t,a=0){let s=Ut(a);return(t||[]).filter(o=>o.person_id===e&&(o.points_delta||0)>0&&new Date(o.timestamp)>=s).reduce((o,r)=>o+(r.points_delta||0),0)}function de(e,t,a=0){let s=Ut(a);return(t||[]).filter(o=>o.person_id===e&&o.type==="task_skipped"&&(o.points_delta||0)<0&&new Date(o.timestamp)>=s).reduce((o,r)=>o+Math.abs(r.points_delta||0),0)}function ce(e){return((e==null?void 0:e.tasks_due_today_list)||[]).filter(t=>t.status==="pending"&&t.chore_type!=="reminder"&&t.penalty_enabled&&(t.penalty_points||0)>0).reduce((t,a)=>t+(a.penalty_points||0),0)}function pe(e,t,a,s,o,r,n){var h;if(e>=999)return"";let i=G(e,o),d=e>=o.length-1,c=e<=0,l=(h=n==null?void 0:n.rank_curve)==null?void 0:h.cap,b=Math.max(l||Math.round(s*1.2),s,1),g=_=>Math.min(100,Math.max(0,Math.round(_/b*100))),y=g(t),x=g(a),S=g(s),p,k;!d&&t>=s?(p=r,k=`${t}pts \xB7 +1 rank`):!c&&t<a?(p="#E07A4C",k=`${t}pts \xB7 \u22121 rank`):(p="#E0B84C",k=`${t}pts \xB7 holds`);let E=c?"":`<span class="fh-rank-bar-mark fh-rank-bar-mark--drop" style="left:${x}%" title="Drop below ${a}"></span>`,u=d?"":`<span class="fh-rank-bar-mark fh-rank-bar-mark--gain" style="left:${S}%" title="Rank up at ${s}"></span>`;return`
        <div class="fh-rank-bar-row">
            <span class="fh-rank-bar-label" style="color:${r}">${m(i.name)}</span>
            <span class="fh-rank-bar-track">
                <span class="fh-rank-bar-fill" style="width:${y}%;background:${p}"></span>
                ${E}
                ${u}
            </span>
            <span class="fh-rank-bar-status">${m(k)}</span>
        </div>`}function co(e,t){let a=e==null?void 0:e.person_id;if(!a)return[];let s=(t==null?void 0:t.people)||[],o=i=>{var d;return((d=s.find(c=>c.person_id===i))==null?void 0:d.name)||"\u2014"},r=i=>{let d=s.find(c=>c.person_id===i);return d&&d.active!==!1},n=[];for(let i of(t==null?void 0:t.active_chores)||[]){let d=i.rotation_pool||[];if(!d.includes(a))continue;let c=d.filter(r);if(!c.length)continue;let l=i.assigned_to&&i.assigned_to[0]||c[0],b=c.indexOf(l),g=c[((b+1)%c.length+c.length)%c.length],y=i.rotation_cadence||"",x="";if(y==="weekly"){let S=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],k=((i.rotation_switch_weekday??0)+1)%7,E=new Date;E.setHours(0,0,0,0);let u=(k-E.getDay()+7)%7;u===0&&(u=7);let h=new Date(E);h.setDate(h.getDate()+u),x=`${S[h.getDay()]} ${h.getMonth()+1}/${h.getDate()}`}else y==="per_instance"?x="next time":y==="daily"&&(x="tomorrow");n.push({chore:i.name,mine:l===a,youNext:g===a&&l!==a,currentName:o(l),nextName:o(g),switchWhen:x})}return n}function he(e,t,a){let s=co(e,t),o=s.filter(d=>d.mine),r=s.filter(d=>d.youNext);if(!o.length&&!r.length)return"";let n=a||"var(--fh-accent)",i=(d,c,l)=>c.length?`
        <div class="fh-rot-group">
          <div class="fh-rot-group-hdr" style="color:${n}">${m(d)}</div>
          ${c.map(b=>`
            <div class="fh-rot-line">
              <span class="fh-rot-line-chore">${m(b.chore)}</span>
              ${l&&b.switchWhen?`<span class="fh-rot-line-when">${m(b.switchWhen)}</span>`:""}
            </div>`).join("")}
        </div>`:"";return i("Current",o,!1)+i("Up Next",r,!0)}function fe(e,t){if(!e)return"";let a=e.completion_milestone||0,s=e.completion_streak||0;if(a<=0||s<=0)return"";let o=e.completion_threshold_pct||80;return`
        <div class="fh-success-streak" style="--ss-tone:${t||"#F8D38A"}">
            <span class="fh-success-streak-icon">\u{1F525}</span>
            <span class="fh-success-streak-val">${s}d streak</span>
            <span class="fh-success-streak-sep">\xB7</span>
            <span class="fh-success-streak-target">${o}% target</span>
        </div>`}function me(e,t,a,s=8){let o=new Map((t.active_chores||[]).map(c=>[c.chore_id,c])),r=new Map;for(let c of[...e.tasks_due_today_list||[],...e.tasks_overdue_list||[],...e.tasks_pending_approval_list||[]])c.chore_id&&c.name&&!r.has(c.chore_id)&&r.set(c.chore_id,{name:c.name,streak:c.streak||0});let i=((t.people||[]).find(c=>c.person_id===a.person_id)||{}).streaks||{},d=new Map;for(let[c,l]of Object.entries(i))d.set(c,l.count||0);for(let[c,l]of r.entries()){let b=d.get(c)||0;l.streak>b&&d.set(c,l.streak)}return[...d.entries()].map(([c,l])=>{let b=o.get(c),g=r.get(c),y=(b==null?void 0:b.name)||(g==null?void 0:g.name)||"(retired)";return{chore_id:c,name:y,streak:l,milestone:(b==null?void 0:b.streak_milestone)||0,bonus:(b==null?void 0:b.streak_bonus_points)||0,chore:b||{}}}).filter(c=>c.streak>=1).sort((c,l)=>l.streak-c.streak).slice(0,s)}function ge(e,t,a=10){let s=t>0?Math.min(t,a):7;if(t<=0)return{goalSegs:s,filledN:Math.min(e,s),countLbl:`${e}`};let o=e%t,r=e>0&&o===0?s:o,n=t-(o||t);return{goalSegs:s,filledN:r,countLbl:`${e} \xB7 next ${n}`}}function be(e){let t=(e==null?void 0:e.streak_freezes_available)||0;return t<=0?"":`
        <div class="fh-freeze-chip" title="Streak freeze tokens \u2014 auto-spent to protect your streak on a rough day">
            <span class="fh-freeze-chip-icon">\u{1F9CA}</span>
            <span class="fh-freeze-chip-label">${t===1?"1 streak freeze":`${t} streak freezes`}</span>
        </div>`}function ue(e){let t=(e==null?void 0:e.tasks_done_today)||0,a=((e==null?void 0:e.tasks_due_today_list)||[]).filter(i=>i.chore_type!=="reminder").length,s=t+a;if(s===0)return"";let o=Math.round(t/s*100),r=t>=s,n=r?`\u2713 All ${s} done today!`:`${t} / ${s} done today`;return`
        <div class="fh-daily-progress ${r?"fh-daily-progress--complete":""}">
            <div class="fh-daily-progress-bar">
                <div class="fh-daily-progress-fill" style="width:${o}%"></div>
            </div>
            <span class="fh-daily-progress-label">${n}</span>
        </div>`}function Ee(e,t){let a=e.filter(d=>d._over),s=e.filter(d=>!d._over),o=[];a.length&&o.push({label:"Overdue",tasks:a,isOverdue:!0});let r=t&&t.length?t:[...new Set(s.map(d=>d.category_label||""))],n=new Set(r);for(let d of r){let c=s.filter(l=>(l.category_label||"")===d);c.length&&o.push({label:d||"Other",tasks:c,isOverdue:!1})}let i=s.filter(d=>!n.has(d.category_label||""));return i.length&&o.push({label:"Other",tasks:i,isOverdue:!1}),o}function po(e){if(!e)return"";let t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],a=new Date;a.setHours(0,0,0,0);let s=e.recurrence_type,o=Number(e.days_until_reset);if(s&&s!=="one_time"&&s!=="daily"&&Number.isFinite(o)&&o>0){let i=new Date(a);return i.setDate(i.getDate()+o),o===1?"Tomorrow":o<=6?t[i.getDay()]:o===7?`Next ${t[i.getDay()].slice(0,3)}`:`${i.getMonth()+1}/${i.getDate()}`}if(!e.due_date)return"";let r=new Date(e.due_date+"T00:00:00");if(isNaN(r.getTime()))return"";let n=Math.round((r-a)/864e5);return n<0?"":n===0?"Today":n===1?"Tomorrow":n<=6?t[r.getDay()]:`${r.getMonth()+1}/${r.getDate()}`}function q(e,t,a,s,o={}){let r=o.index,n=!!(s&&s._pendingSubmit&&s._pendingSubmit.has(e.task_id))||e.status==="pending_approval",i=!!e._over||!!e._overdue,d=e.chore_type==="reminder",c=e.streak||0,l=e.points||0,b=t.leadFormat&&!d?t.leadFormat(e,r):null,g=b!=null&&b!==""?`<div class="fh-row-lead">${m(String(b))}</div>`:"",y=t.kickerFormat&&!d?t.kickerFormat(e,r):null,x=y!=null&&y!==""?`<div class="fh-row-kicker">${m(String(y))}</div>`:"",S=t.iconColor?t.iconColor(e,i):void 0,p=`<div class="fh-row-icon">${oe(e.icon,S)}</div>`,k=e.description?`<div class="fh-row-desc">${m(e.description)}</div>`:"",E=!d&&e.penalty_enabled&&e.penalty_points>0,u=E&&!l?`<div class="fh-row-penalty">\u2212${e.penalty_points}pts if skipped</div>`:"",h=[];if(c>=2&&!d){let A=t.streakIcon||"\u{1F525}";h.push(`<span class="fh-row-chip fh-row-chip--streak">${A} ${c}</span>`)}if(i){let A=t.statusFormat&&t.statusFormat.breach?t.statusFormat.breach(e):`BREACH \xB7 ${e.days_overdue||0}D`;h.push(`<span class="fh-row-chip fh-row-chip--breach">${m(A)}</span>`)}else if(!d&&e.days_until_reset===1){let A=t.statusFormat&&t.statusFormat.resetSoon?t.statusFormat.resetSoon(e):"RESETS 1D";h.push(`<span class="fh-row-chip fh-row-chip--reset">${m(A)}</span>`)}if(!d&&e.daily_penalty_firing){let A=t.statusFormat&&t.statusFormat.firing?t.statusFormat.firing(e):`\u2212${e.penalty_points||0}pts/day`;h.push(`<span class="fh-row-chip fh-row-chip--firing">${m(A)}</span>`)}if(!d&&e.expires_after_days&&e.due_date){let A=new Date(e.due_date);A.setDate(A.getDate()+e.expires_after_days);let T=new Date;T.setHours(0,0,0,0),A.setHours(0,0,0,0);let D=Math.round((A-T)/864e5);if(D<=2){let U=t.statusFormat&&t.statusFormat.expiry?t.statusFormat.expiry(D):D<=0?"Expires today":`Expires in ${D}d`;h.push(`<span class="fh-row-chip fh-row-chip--expiry">${m(U)}</span>`)}}let _=`<div class="fh-row-chips">${h.join("")}</div>`,z="fh-row-pts",$="";d?$="":l&&E?(z+=" fh-row-pts--dual",$=`<span class="fh-row-pts-pos">+${l}</span><span class="fh-row-pts-sep">/</span><span class="fh-row-pts-neg">\u2212${e.penalty_points}</span>`):l?$=`+${l}`:E&&($=`<span class="fh-row-pts-neg">\u2212${e.penalty_points}</span>`);let F=!d&&!n?po(e):"",R=F?`<div class="fh-row-due">${m(F)}</div>`:"",B=`<div class="fh-row-pts-col"><div class="${z}">${$}</div>${R}</div>`,f=o.btnData?Object.entries(o.btnData).map(([A,T])=>` data-${A}="${C(String(T??""))}"`).join(""):"",w;if(n){let A=t.btnPendingLabel||"Pending<br>Approval";w=`<div class="fh-row-btn fh-row-btn--pending" aria-disabled="true">${t.btnPendingIcon?`<span class="fh-row-btn-icon">${t.btnPendingIcon}</span>`:""}<span class="fh-row-btn-label">${A}</span></div>`}else if(d){let A=t.reminderBtnLabel||"Dismiss";w=`<button class="fh-row-btn fh-row-btn--reminder"
                           data-act="complete" data-tid="${C(e.task_id)}" data-pid="${C(a.person_id)}"${f}>
                       <span class="fh-row-btn-label">${A}</span>
                   </button>`}else{let A=t.btnLabel||"Complete",T=t.btnIcon?`<span class="fh-row-btn-icon">${t.btnIcon}</span>`:"";w=`<button class="fh-row-btn"
                           data-act="complete" data-tid="${C(e.task_id)}" data-pid="${C(a.person_id)}"${f}>
                       ${T}<span class="fh-row-btn-label">${A}</span>
                   </button>`}let v=[`fh-row--${t.themeKey}`,i&&"overdue",d&&"reminder",n&&"submitted",o.rowClass||""].filter(Boolean).join(" "),M=o.rowStyle?` style="${o.rowStyle}"`:"";return`
        <div class="fh-row ${v}"${M}>
            ${g}
            ${p}
            <div class="fh-row-body">
                ${x}
                <div class="fh-row-name">${m(e.name)}</div>
                ${k}
                ${u}
            </div>
            ${_}
            ${B}
            ${w}
        </div>`}function Wt(e){return`
        <div class="fh-row-add-reminder-wrap">
            <button class="fh-row-add-reminder"
                    data-act="open-add-reminder" data-pid="${C(e.person_id)}">
                + Add reminder
            </button>
        </div>`}function ve(e){let t=e==null?void 0:e.goal;if(!t)return"";let a=Math.max(0,Math.min(100,t.progress_pct|0)),s=t.points_cost|0,o=Math.max(0,s-(t.remaining|0));return`
        <div class="fh-goal-banner">
            <div class="fh-goal-banner-head">
                <span class="fh-goal-banner-lbl">Saving for</span>
                <span class="fh-goal-banner-name">${m(t.name)}</span>
                <span class="fh-goal-banner-amt">${o}/${s} pts</span>
            </div>
            <div class="fh-goal-bar"><div class="fh-goal-bar-fill" style="width:${a}%"></div></div>
        </div>`}function Ce(e){let t=e==null?void 0:e.goal;if(!t)return"";let a=Math.max(0,Math.min(100,t.progress_pct|0)),s=t.remaining|0,o=s>0?`${s} pts to go`:"Goal reached!";return`
        <div class="fh-goal-rail">
            <div class="fh-goal-rail-lbl">SAVING FOR</div>
            <div class="fh-goal-rail-name">${m(t.name)}</div>
            <div class="fh-goal-bar"><div class="fh-goal-bar-fill" style="width:${a}%"></div></div>
            <div class="fh-goal-rail-rem">${m(o)}</div>
        </div>`}function xe(e){let t=(e==null?void 0:e.max_per_period)||0;if(!t)return"";let a=(e==null?void 0:e.period)||"week",o=`${t} per ${a==="day"?"day":a==="week"?"week":"month"}`,r=e==null?void 0:e.next_available;if(!r)return`<span class="fh-store-limit">${m(o)}</span>`;let n=new Date(r+"T00:00:00"),i=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][n.getDay()],d=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n.getMonth()],c=`${i} ${d} ${n.getDate()}`;return`<span class="fh-store-limit fh-store-limit--blocked">${m(o)} \xB7 Available ${m(c)}</span>`}function ye(e,t,a){let s=(t==null?void 0:t.goal_item_id)&&t.goal_item_id===e.item_id;return`
        <button class="fh-goal-tog ${s?"is-goal":""}"
                data-act="toggle-goal"
                data-pid="${C(a)}"
                data-iid="${C(e.item_id)}"
                title="${s?"Clear goal":"Save toward this"}">
            ${s?"\u2605":"\u2606"}
        </button>`}function we(e,t){if(!(e!=null&&e.is_group_reward))return"";let a=e.contributors||[];if(!a.length)return"";let s=a.reduce((i,d)=>i+(d.contributed_pts||0),0),o=a.reduce((i,d)=>i+(d.target_pts||0),0),r=o>0?Math.round(s/o*100):0,n=a.map(i=>{let d=i.person_id===t,c=i.contributed_pts>=(i.target_pts||1),l=i.person_color||"#7F77DD",b=(i.person_name||"?").charAt(0).toUpperCase();return`
            <span class="fh-gcp ${d?"fh-gcp--me":""} ${c?"fh-gcp--done":""}"
                  title="${C(i.person_name||"?")} \u2014 ${i.contributed_pts}/${i.target_pts} pts${d?" (you)":""}">
                <span class="fh-gcp-av" style="background:${l}">${m(b)}</span>
                <span class="fh-gcp-pts">${i.contributed_pts}/${i.target_pts}</span>
            </span>`}).join("");return`
        <div class="fh-group-reward-info">
            <div class="fh-group-reward-line">
                <span class="fh-group-reward-tag">\u{1F91D} GROUP \xB7 ${s}/${o} pts \xB7 ${r}%</span>
                <span class="fh-group-reward-pills">${n}</span>
            </div>
        </div>`}function ke(e,t,a){if(!(e!=null&&e.is_group_reward))return"";let s=(e.contributors||[]).find(n=>n.person_id===t);if(!s)return"";let o=Math.max(0,(s.target_pts||0)-(s.contributed_pts||0));if(o<=0)return'<span class="fh-group-chip-done">\u2713 Your share complete</span>';let r=a>=1;return`
        <button class="fh-group-chip-btn ${r?"":"fh-group-chip-btn--disabled"}"
                data-act="open-chip-in"
                data-iid="${C(e.item_id)}"
                data-pid="${C(t)}"
                data-remaining="${o}"
                data-balance="${a}"
                ${r?"":"disabled"}>
            \u{1F91D} Chip In (${o} left)
        </button>`}function _e(e,t,a){let s=(e||[]).filter(n=>n.status!=="canceled");if(!s.length)return"";let o={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"};return s.map(n=>{let i=n.status==="lapsed",d=n.status==="cancel_pending",c=o[n.period]||n.period,l=n.points_cost+(n.accumulated_debt||0),b=Math.min(100,Math.round(t/Math.max(l,1)*100)),g=i?"#E85A5A":d?"#E0B84C":"currentColor",y;if(i)y=`Lapsed \xB7 owes ${n.accumulated_debt}pts`;else if(d)y="Cancellation pending approval";else{let p=n.days_until_renewal,k=p<=0?"Renews today":p===1?"Renews tomorrow":`Renews in ${p}d`,E=n.points_cost+(n.accumulated_debt||0);y=t>=E?`\u2713 Ready \xB7 ${k}`:`\u26A0 Need ${E-t}pts \xB7 ${k}`}let x=n.item_icon?`<span class="fh-sub-mini-icon">${oe(n.item_icon,null,"18px")}</span>`:"",S=d?"":`
            <button class="fh-sub-cancel-btn"
                    data-act="request-cancel-sub"
                    data-subid="${C(n.subscription_id)}"
                    data-pid="${C(a)}"
                    data-name="${C(n.item_name)}">Cancel</button>`;return`
            <div class="fh-sub-mini-row">
                <div class="fh-sub-mini-head">
                    ${x}
                    <span class="fh-sub-mini-name">${m(n.item_name)}</span>
                    <span class="fh-sub-mini-price">${n.points_cost}/${c}</span>
                </div>
                <div class="fh-sub-mini-bar-wrap">
                    <div class="fh-sub-mini-bar" style="width:${b}%;background:${g}"></div>
                </div>
                <div class="fh-sub-mini-status">${m(y)}</div>
                ${S}
            </div>`}).join("")}function $e(e,t,a,s){let o={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"},r=new Set(["points_awarded","subscription_started","subscription_renewed"]),n={points_awarded:"Purchased",subscription_started:"Subscribed",subscription_renewed:"Sub renewal"},i=(e||[]).filter(b=>b.status!=="canceled"),d="";i.length&&(d=`<div class="fh-store-rail-section"><div class="fh-store-rail-hdr">YOUR SUBSCRIPTIONS</div>${i.map(g=>{let y=g.status==="lapsed",x=g.status==="cancel_pending",S=o[g.period]||g.period,p=g.points_cost+(g.accumulated_debt||0),k=Math.min(100,Math.round(t/Math.max(p,1)*100)),E=y?"#E85A5A":x?"#E0B84C":"currentColor",u;if(y)u=`Lapsed \xB7 owes ${g.accumulated_debt}pts`;else if(x)u="Cancellation pending approval";else{let z=g.days_until_renewal,$=z<=0?"Renews today":z===1?"Renews tomorrow":`Renews in ${z}d`,F=g.points_cost+(g.accumulated_debt||0);u=t>=F?`\u2713 Ready \xB7 ${$}`:`\u26A0 Need ${F-t}pts \xB7 ${$}`}let h=g.item_icon?`<span class="fh-sub-mini-icon">${oe(g.item_icon,null,"18px")}</span>`:"",_=x?"":`
                <button class="fh-sub-cancel-btn"
                        data-act="request-cancel-sub"
                        data-subid="${C(g.subscription_id)}"
                        data-pid="${C(s)}"
                        data-name="${C(g.item_name)}">Cancel</button>`;return`
                <div class="fh-store-sub-row">
                    <div class="fh-sub-mini-head">
                        ${h}
                        <span class="fh-sub-mini-name">${m(g.item_name)}</span>
                        <span class="fh-sub-mini-price">${g.points_cost}/${S}</span>
                    </div>
                    <div class="fh-sub-mini-bar-wrap">
                        <div class="fh-sub-mini-bar" style="width:${k}%;background:${E}"></div>
                    </div>
                    <div class="fh-sub-mini-status">${m(u)}</div>
                    ${_}
                </div>`}).join("")}</div>`);let c=(a||[]).filter(b=>b.person_id!==s||!r.has(b.type)?!1:b.type==="points_awarded"?/^Redeemed "/.test(b.note||""):!0).slice(0,10),l="";return c.length&&(l=`<div class="fh-store-rail-section"><div class="fh-store-rail-hdr">RECENT PURCHASES</div>${c.map(g=>{let y=n[g.type]||g.type,x=g.timestamp?Z(g.timestamp):"",S=g.type==="points_awarded"?(g.note||"").replace(/^Redeemed "(.+)"$/,"$1")||"\u2014":g.chore_name||g.note||"\u2014",p=g.points_delta?`\u2212${Math.abs(g.points_delta)}pts`:"";return`
                <div class="fh-store-purchase-row">
                    <div class="fh-store-purchase-name">${m(S)}</div>
                    <div class="fh-store-purchase-meta">
                        <span class="fh-store-purchase-type">${m(y)}</span>
                        ${p?`<span class="fh-store-purchase-pts">${p}</span>`:""}
                        <span class="fh-store-purchase-when">${m(x)}</span>
                    </div>
                </div>`}).join("")}</div>`),d+l}function Se(e,t){return!e||!e.length?"":`<div class="fh-group-proposals">${e.map(s=>`
        <div class="fh-group-proposal-card">
            <div class="fh-group-proposal-from">
                \u{1F91D} <strong>${m(s.proposer_name)}</strong> wants to save for
                <strong>${m(s.item_name)}</strong> with you
            </div>
            <div class="fh-group-proposal-share">Your share: ${s.my_share_pct}%</div>
            <div class="fh-group-proposal-btns">
                <button class="fh-group-proposal-accept"
                        data-act="accept-group-proposal"
                        data-propid="${C(s.proposal_id)}"
                        data-pid="${C(t)}">
                    Accept
                </button>
                <button class="fh-group-proposal-decline"
                        data-act="decline-group-proposal"
                        data-propid="${C(s.proposal_id)}"
                        data-pid="${C(t)}">
                    Decline
                </button>
            </div>
        </div>`).join("")}</div>`}var Re=O(()=>{Ne();V()});function ho({attr:e,naAttr:t,person:a,balance:s,weekly:o,lost:r,atRisk:n,openCount:i,pendingCount:d,rankIdx:c,dropThr:l,gainThr:b,color:g}){return`
        ${mo(s,o,r,n,i,d)}
        ${go(c,o,l,b,g,a,e)}
        ${bo(e,t,a,g)}
        ${(()=>{let y=he(a,t,g);return y?ze("ROTATION",y):""})()}
        ${fo(e,s,a.person_id)}
        ${uo(a,t,g)}`}function ze(e,t){return`
        <div class="fh-classic-rpanel">
            <div class="fh-classic-rpanel-hdr">${e}</div>
            <div class="fh-classic-rpanel-body">${t}</div>
        </div>`}function fo(e,t,a){let s=_e(e.subscriptions,t,a);return s?ze("SUBSCRIPTIONS",s):""}function mo(e,t,a,s,o,r){let n=(d,c,l,b,g="")=>`
        <div class="fh-classic-rkpi">
            <div class="fh-classic-rkpi-lbl">${d}</div>
            <div class="fh-classic-rkpi-val-row">
                <span class="fh-classic-rkpi-val">${m(String(c))}</span>
                ${l?`<span class="fh-classic-rkpi-unit">${l}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,i=`
        <div class="fh-classic-rkpi-row">
            ${n("BALANCE",P(e),"pts")}
            ${n("WEEK",`+${t}`,"pts",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("OPEN",o,"",s>0?`\u2212${s} at risk`:null,"fh-rkpi-sub--loss")}
            ${n("PENDING",r,"")}
        </div>`;return ze("OVERVIEW",i)}function go(e,t,a,s,o,r,n){let i=pe(e,t,a,s,Ze,o,r),d=fe(r,o),c=be(n);return i?ze("RANK",i+d+c):ze("RANK",`<div class="fh-classic-rmax">${m(G(e,Ze).name)} \xB7 max</div>${d}${c}`)}function bo(e,t,a,s){let o=me(e,t,a,8);if(!o.length)return ze("STREAKS",'<div class="fh-classic-rempty">No active streaks yet</div>');let r=o.map(n=>{let{goalSegs:i,filledN:d,countLbl:c}=ge(n.streak,n.milestone,10),l=Array.from({length:i},(g,y)=>`<span class="fh-classic-rseg${y<d?" filled":""}" style="${y<d?`background:${s}`:""}"></span>`).join(""),b=n.milestone>0&&n.bonus>0?`<span class="fh-classic-rbonus">\u2605+${n.bonus}</span>`:"";return`
            <div class="fh-classic-rstreak">
                <div class="fh-classic-rstreak-head">
                    <span class="fh-classic-rstreak-name">${m(n.name)}</span>
                    ${b}
                </div>
                <div class="fh-classic-rstreak-bar">
                    <span class="fh-classic-rsegs">${l}</span>
                    <span class="fh-classic-rstreak-num">${c}</span>
                </div>
            </div>`}).join("");return ze("STREAKS",r)}function uo(e,t,a){let s=(t.history_log||[]).filter(r=>r.person_id===e.person_id&&(r.points_delta||0)>0).slice(0,4);if(!s.length)return ze("RECENT WINS",'<div class="fh-classic-rempty">No wins logged yet</div>');let o=s.map(r=>{let n=r.timestamp?Z(r.timestamp):"";return`
            <div class="fh-classic-rwin">
                <div class="fh-classic-rwin-when">${m(n)}</div>
                <div class="fh-classic-rwin-row">
                    <span class="fh-classic-rwin-name">${m(r.chore_name||r.note||"\u2014")}</span>
                    <span class="fh-classic-rwin-pts" style="color:${a}">+${r.points_delta}</span>
                </div>
            </div>`}).join("");return ze("RECENT WINS",o)}function vo(e,t,a,s){let o=e.tasks_due_today_list||[],r=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],i=($,F)=>{let R=new Map;for(let B of $){let f=B.chore_id;(!R.has(f)||F(B,R.get(f)))&&R.set(f,B)}return[...R.values()]},d=i(r,($,F)=>($.days_overdue||0)>(F.days_overdue||0)),c=i(o,()=>!1),l=$=>$.chore_type==="reminder",b=c.filter($=>l($)),g=c.filter($=>!l($)),x=s._attrs("sensor.family_hub_needs_attention").category_labels||[],S=new Map(x.map(($,F)=>[$,F])),p=new Map;for(let $ of g){let F=$.category_label||"Today";p.has(F)||p.set(F,[]),p.get(F).push($)}let k=[...p.keys()].sort(($,F)=>{let R=$==="Today",B=F==="Today";if(R&&!B)return 1;if(!R&&B)return-1;let f=S.has($)?S.get($):1/0,w=S.has(F)?S.get(F):1/0;return f!==w?f-w:$.localeCompare(F)}),E={themeKey:"classic",btnLabel:"\u2713",btnPendingLabel:"Pending Approval",reminderBtnLabel:"Done",streakIcon:"\u{1F525}",statusFormat:{breach:$=>`${$.days_overdue}d late`,resetSoon:$=>{var B;let F=$.recurrence_type,R=$.days_until_reset;return R===0?"Resets today":R===1?"Resets tomorrow":F==="weekly"&&((B=$.recurrence_weekdays)!=null&&B.length)?`Resets ${$.recurrence_weekdays.map(f=>Xe[f]).join("/")}`:`Resets in ${R}d`},firing:$=>`-${$.penalty_points}pts/day`,expiry:$=>$<=0?"Expires today":`Expires in ${$}d`},iconColor:()=>t},u=($,F)=>{let R=F?{...$,_over:!0}:$;return q(R,E,a,s)},h=k.map($=>`
        <div class="fh-row-section-hdr">${m($)}</div>
        ${(p.get($)||[]).map(F=>u(F,!1)).join("")}`).join(""),_=b.length?`
        <div class="fh-row-section-hdr">Reminders</div>
        ${b.map($=>u($,!1)).join("")}`:"",z=!g.length&&!d.length&&!n.length&&!b.length;return`
        ${ue(e)}
        ${Wt(a)}
        <div class="fh-row-list" style="--row-color:${t}">
            ${d.length?d.map($=>u($,!0)).join(""):""}
            ${h}
            ${_}
            ${n.length?`
                <div class="fh-row-section-hdr">Awaiting approval</div>
                ${n.map($=>q($,E,a,s)).join("")}`:""}
        </div>
        ${z?'<div class="fh-empty">Nothing due \u2014 nice work!</div>':""}`}function xo(e,t,a,s,o){let r=e.store_items||[];if(!r.length)return'<div class="fh-empty">No rewards in the store yet.</div>';let n=o._attrs("sensor.family_hub_needs_attention"),d=(n.redemption_queue||[]).filter(g=>g.person_id===a.person_id),c=new Set(d.map(g=>g.item_id).filter(Boolean)),l=new Set(d.filter(g=>!g.item_id).map(g=>g.item_name)),b=new Set((e.subscriptions||[]).map(g=>g.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Se(e.group_proposals,a.person_id)}
        ${ve(e)}
        <div class="fh-store-grid">
            ${r.map(g=>{let y=!!g.is_group_reward,x=g.item_type==="subscription",S=x&&b.has(g.item_id),p=s>=g.points_cost,k=c.has(g.item_id)||l.has(g.name),E=!!g.next_available,u={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[g.subscription_period]||"mo";return`
                <div class="fh-store-item">
                    <div class="fh-store-item-head">
                        ${ne(g)}
                        <div class="fh-store-name">${m(g.name)}</div>
                        ${ye(g,e,a.person_id)}
                    </div>
                    ${g.description?`<div class="fh-store-desc">${m(g.description)}</div>`:""}
                    ${xe(g)}
                    ${we(g,a.person_id)}
                    ${y?ke(g,a.person_id,s):x?S?'<span class="fh-badge fh-badge-subscribed">Subscribed \u2713</span>':k?'<span class="fh-badge fh-badge-requested" style="text-align:center">Requested \u2713</span>':`<button class="fh-btn fh-btn-sm ${p?"fh-btn-primary":"fh-btn-ghost"}"
                                       style="${p?`background:${t}`:""}"
                                       data-act="redeem"
                                       data-iid="${C(g.item_id)}"
                                       data-pid="${C(a.person_id)}"
                                       ${p?"":"disabled"}>
                                   ${p?`Subscribe \xB7 ${g.points_cost}pts/${u}`:"Need more pts"}
                               </button>`:`<div class="fh-store-price" style="color:${t}">${P(g.points_cost)}pts</div>
                           ${k?'<span class="fh-badge fh-badge-requested" style="text-align:center">Requested \u2713</span>':E?'<button class="fh-btn fh-btn-sm fh-btn-ghost" disabled style="opacity:.5;cursor:not-allowed">Not available</button>':`<button class="fh-btn fh-btn-sm ${p?"fh-btn-primary":"fh-btn-ghost"}"
                                          style="${p?`background:${t}`:""}"
                                          data-act="redeem" data-iid="${g.item_id}" data-pid="${a.person_id}"
                                          ${p?"":"disabled"}>
                                      ${p?"Request":"Need more pts"}
                                  </button>`}`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${$e(e.subscriptions,s,n.history_log,a.person_id)}
        </div>
        </div>`}function yo(e,t){let s=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(n=>n.person_id===e.person_id);return s.length?`<div class="fh-hist-scroll">${ae(s).map(n=>n.isGroup?ko(n,t):wo(n.entry)).join("")}</div>`:'<div class="fh-empty">No history yet.</div>'}function wo(e){let t=Q[e.type]||{label:e.type,color:"var(--fh-text-sec)"},a=e.points_delta?`<span style="color:${e.points_delta>0?"var(--fh-success)":"var(--fh-overdue)"}">
               ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"";return`
        <div class="fh-hist-row" style="--hist-color:${t.color}">
            <div class="fh-hist-info">
                <div class="fh-hist-label">${m(t.label)}</div>
                <div class="fh-hist-name">${m(e.chore_name||e.note||"")}</div>
                <div class="fh-hist-meta">${Z(e.timestamp)} ${a}</div>
            </div>
        </div>`}function ko(e,t){let a=t._expandedSkippedDates.has(e.key),s=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty",o=e.items.map(r=>{let n=r.points_delta?`<span style="color:var(--fh-overdue);font-weight:700">${r.points_delta}pts</span>`:"";return`
            <div class="fh-hist-subrow">
                <div class="fh-hist-info" style="flex:1;min-width:0">
                    <div class="fh-hist-name">${m(r.chore_name||"")}</div>
                    <div class="fh-hist-meta">${n}</div>
                </div>
                ${re(r)}
            </div>`}).join("");return`
        <div class="fh-hist-group">
            <div class="fh-hist-group-hdr" data-act="toggle-skipped-group" data-key="${e.key}">
                <div class="fh-hist-info" style="flex:1;min-width:0">
                    <div class="fh-hist-label" style="color:var(--fh-warning)">Skipped chores</div>
                    <div class="fh-hist-name">${m(e.dateDisplay)} \xB7 ${s}</div>
                </div>
                <span class="fh-hist-expand-icon">${a?"\u25B2":"\u25BC"}</span>
            </div>
            <div class="fh-hist-subitems"${a?"":' style="display:none"'}>${o}</div>
        </div>`}var Ze,qt,Kt=O(()=>{W();W();V();Re();Ze=[{minXP:0,name:"Level 1"},{minXP:100,name:"Level 2"},{minXP:300,name:"Level 3"},{minXP:700,name:"Level 4"},{minXP:1200,name:"Level 5"}],qt={key:"classic",tint:"#1A2538",sigil:"\u25C7",ranks:Ze,handlesNavigation:!1,rankTitle(e){return G(e,Ze).name},homeTileSubLabel(e){return e.person_type==="parent"?"HANDLER":"FIELD AGENT"},render(e,t){var h;let a=t.child_mode?" kid-large":"",s=e._personEntityId(t.name),o=e._attrs(s),r=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((h=e._states(s))==null?void 0:h.state)||"0"),i=t.avatar_color||L,d=t.rank_index!==void 0?t.rank_index:0,{dropThr:c,gainThr:l}=ie(t,r,d),b=le(t.person_id,r.history_log,r.rank_eval_weekday),g=de(t.person_id,r.history_log,r.rank_eval_weekday),y=ce(o),x=[{key:"tasks",label:"Tasks"},{key:"store",label:"Store"},{key:"history",label:"History"}].map(_=>`
            <div class="fh-tab ${e._tab===_.key?"active":""}"
                 data-act="tab" data-tab="${_.key}">${_.label}</div>`).join(""),S="";e._tab==="tasks"&&(S=vo(o,i,t,e)),e._tab==="store"&&(S=xo(o,i,t,n,e)),e._tab==="history"&&(S=yo(t,e));let p=(o.tasks_due_today_list||[]).filter(_=>_.status==="pending").length,k=(o.tasks_pending_approval_list||[]).length,E=e._tab==="tasks",u=E?ho({attr:o,naAttr:r,person:t,balance:n,weekly:b,lost:g,atRisk:y,openCount:p,pendingCount:k,rankIdx:d,dropThr:c,gainThr:l,color:i}):"";return`
            <div class="fh-classic-page${a}">
                <div class="fh-person-header" style="border-left:4px solid ${i}">
                    <div class="fh-avatar" style="background:${i};width:46px;height:46px;font-size:1.1rem">
                        ${N(t.name)}
                    </div>
                    <div style="flex:1;min-width:0">
                        <div style="font-size:.9rem;color:var(--fh-text-sec);font-weight:600">${m(t.name)}</div>
                        <div class="fh-balance" style="color:${i}">
                            ${P(n)}<span class="fh-balance-unit">pts</span>
                        </div>
                        ${o.show_dollar_value?`<div class="fh-dollar">${H(o.dollar_value)}</div>`:""}
                    </div>
                </div>
                <div class="fh-tabs">${x}</div>
                <div class="fh-classic-body ${E?"has-rail":""}">
                    <div class="fh-classic-body-main">${S}</div>
                    ${E?`<aside class="fh-classic-rail">${u}</aside>`:""}
                </div>
            </div>`}}});function _o({attr:e,naAttr:t,person:a,balance:s,openCount:o,weekly:r,lost:n,atRisk:i,rank:d,rankIdx:c,dropThr:l,gainThr:b,plotDate:g}){return`
        ${So(s,o,r,n,i,e.show_dollar_value?e.dollar_value:null)}
        ${Ce(e)}
        ${Eo(c,r,l,b,a,e)}
        ${Co(e,t,a)}
        ${(()=>{let y=he(a,t,J.amber);return y?Ie("ROTATION \xB7 POOL",y):""})()}
        ${$o(e,s,a.person_id)}
        ${zo(a,d,g)}`}function Ie(e,t,a={}){let{dense:s=!1}=a;return`
        <div class="fh-eng-rpanel ${s?"dense":""}">
            <span class="fh-eng-tick" data-pos="tl"></span>
            <span class="fh-eng-tick" data-pos="tr"></span>
            <span class="fh-eng-tick" data-pos="bl"></span>
            <span class="fh-eng-tick" data-pos="br"></span>
            <div class="fh-eng-rpanel-hdr">// ${e}</div>
            <div class="fh-eng-rpanel-body">${t}</div>
        </div>`}function $o(e,t,a){let s=_e(e.subscriptions,t,a);return s?Ie("SUBSCRIPTIONS",s):""}function So(e,t,a,s,o,r){let n=(d,c,l,b,g="")=>`
        <div class="fh-eng-rkpi">
            <div class="fh-eng-rkpi-lbl">${d}</div>
            <div class="fh-eng-rkpi-val-row">
                <span class="fh-eng-rkpi-val">${m(String(c))}</span>
                ${l?`<span class="fh-eng-rkpi-unit">${l}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,i=`
        <div class="fh-eng-rkpi-row">
            ${n("BAL",P(e),"pts",r!=null?H(r):null)}
            ${n("OPEN",t,"wo",o>0?`\u2212${o} at risk`:null,"fh-rkpi-sub--loss")}
            ${n("WEEK",`+${a}`,"pts",s>0?`\u2212${s} lost`:"0 lost","fh-rkpi-sub--loss")}
        </div>`;return Ie("TODAY \xB7 KPIS",i,{dense:!0})}function Eo(e,t,a,s,o,r){let n=pe(e,t,a,s,He,J.amber,o),i=fe(o,J.amber),d=be(r);return n?Ie("RANK \xB7 TRACK",n+i+d):Ie("RANK \xB7 TRACK",`<div class="fh-eng-rmax">${m(G(e,He).name)} &middot; MAX</div>${i}${d}`)}function Co(e,t,a){let s=me(e,t,a,8);if(!s.length)return Ie("STREAK \xB7 CONSTELLATION",'<div class="fh-eng-rempty">NO ACTIVE STREAKS &middot; START A CYCLE</div>');let o=s.map(r=>{let{goalSegs:n,filledN:i,countLbl:d}=ge(r.streak,r.milestone,12),c=Array.from({length:n},(b,g)=>g<i),l=r.milestone>0&&r.bonus>0?`<span class="fh-eng-chip fh-eng-chip-streak">&#9733;+${r.bonus}</span>`:"";return`
            <div class="fh-eng-rstreak">
                <div class="fh-eng-rstreak-head">
                    <span class="fh-eng-rstreak-name">${m(r.name)}</span>
                    ${l}
                </div>
                <div class="fh-eng-rstreak-bar">
                    ${c.map(b=>`<span class="fh-eng-dim-seg${b?" filled":""}"></span>`).join("")}
                    <span class="fh-eng-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return Ie("STREAK \xB7 CONSTELLATION",o)}function zo(e,t,a){let s=`
        <div class="fh-eng-tb-header">RATHNOKAN HOUSEHOLD &middot; CIVIL DIV.</div>
        <div class="fh-eng-tb-grid">
            ${Le("DRAWN BY",e.name.toUpperCase())}
            ${Le("DATE",a)}
            ${Le("SHEET","01 / 01")}
            ${Le("SCALE","N.T.S.")}
            ${Le("REV","A")}
            ${Le("STATUS","ISSUED",J.amber)}
        </div>
        <div class="fh-eng-rsheet-legend">&#9671; APPROVAL STAMP TO COMPLETE &middot; DIMENSIONS IN POINTS &middot; DO NOT SCALE</div>`;return Ie("SHEET \xB7 A-101",s,{dense:!0})}function Le(e,t,a){return`
        <div class="fh-eng-tb-cell">
            <div class="fh-eng-tb-cell-lbl">${e}</div>
            <div class="fh-eng-tb-cell-val" style="${a?`color:${a}`:""}">${m(t)}</div>
        </div>`}function Ao(e,t,a,s){let o=e.tasks_due_today_list||[],r=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],i=s._attrs("sensor.family_hub_needs_attention").category_labels||[],d=(p,k)=>{let E=new Map;for(let u of p){let h=u.chore_id;(!E.has(h)||k(u,E.get(h)))&&E.set(h,u)}return[...E.values()]},c=d(r,(p,k)=>(p.days_overdue||0)>(k.days_overdue||0)),l=d(o.filter(p=>p.chore_type!=="reminder"),()=>!1),b=[...c.map(p=>({...p,_over:!0})),...l];if(!b.length&&!n.length)return'<div class="fh-eng-empty">&#10003; ALL WORK ORDERS COMPLETE &middot; AREA CLEAR</div>';let g=0,y=Ee(b,i).map(p=>{let k=`<div class="fh-row-section-hdr">// ${m(p.label.toUpperCase())}</div>`,E=p.tasks.map(u=>q(u,Vt,t,s,{index:++g})).join("");return k+E}).join(""),x=0,S=n.length?`
        <div class="fh-row-section-hdr">// PENDING REVIEW</div>
        ${n.map(p=>q(p,Vt,t,s,{index:++x})).join("")}`:"";return`
        ${ue(e)}
        <div class="fh-row-list">
            ${y}
            ${S}
        </div>`}function Mo(e,t,a,s){let o=e.store_items||[];if(!o.length)return'<div class="fh-eng-empty">NO REWARDS CONFIGURED &middot; PENDING ADMIN ACTION</div>';let r=s._attrs("sensor.family_hub_needs_attention"),i=(r.redemption_queue||[]).filter(b=>b.person_id===t.person_id),d=new Set(i.map(b=>b.item_id).filter(Boolean)),c=new Set(i.filter(b=>!b.item_id).map(b=>b.item_name)),l=new Set((e.subscriptions||[]).map(b=>b.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Se(e.group_proposals,t.person_id)}
        ${ve(e)}
        <div class="fh-eng-reward-list">
            ${o.map(b=>{let g=!!b.is_group_reward,y=b.item_type==="subscription",x=y&&l.has(b.item_id),S=a>=b.points_cost,p=d.has(b.item_id)||c.has(b.name),k=!!b.next_available,E={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[b.subscription_period]||"mo";return`
                <div class="fh-eng-reward-row">
                    ${ne(b)}
                    <div class="fh-eng-reward-body">
                        <div class="fh-eng-wo-name" style="font-size:1rem">${m(b.name)}</div>
                        ${b.description?`<div class="fh-eng-status">${m(b.description)}</div>`:""}
                        ${xe(b)}
                        ${we(b,t.person_id)}
                    </div>
                    ${g?"":`<div class="fh-eng-pts-stamp" style="min-width:64px">
                               <div class="fh-eng-pts-num" style="font-size:1.2rem">${P(b.points_cost)}</div>
                               <div class="fh-eng-pts-lbl">POINTS</div>
                           </div>`}
                    ${ye(b,e,t.person_id)}
                    ${g?ke(b,t.person_id,a):y?x?`<div class="fh-eng-status" style="color:${J.amber}">&#10003; SUBSCRIBED</div>`:p?`<div class="fh-eng-status" style="color:${J.amber}">&#10003; REQUESTED</div>`:`<button class="fh-eng-stamp-btn ${S?"":"disabled"}"
                                       data-act="redeem"
                                       data-iid="${C(b.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       style="font-size:9px;${S?"":"opacity:.4;cursor:not-allowed"}">
                                   ${S?`SUBSCRIBE \xB7 ${b.points_cost}/${E}`:`INSUFFICIENT
FUNDS`}
                               </button>`:p?`<div class="fh-eng-status" style="color:${J.amber}">&#10003; REQUESTED</div>`:k?`<div class="fh-eng-status" style="color:${J.amber};font-size:.75rem">NOT AVAILABLE</div>`:`<button class="fh-eng-stamp-btn ${S?"":"disabled"}"
                                   data-act="redeem" data-iid="${b.item_id}" data-pid="${t.person_id}"
                                   style="font-size:9px;${S?"":"opacity:.4;cursor:not-allowed"}">
                               ${S?"REQUISITION":`INSUFFICIENT
FUNDS`}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${$e(e.subscriptions,a,r.history_log,t.person_id)}
        </div>
        </div>`}function Fo(e,t){let s=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(r=>r.person_id===e.person_id);return s.length?`
        <div class="fh-eng-hist-list">
            ${ae(s).slice(0,12).map(r=>r.isGroup?Ro(r,t):Bo(r.entry)).join("")}
        </div>`:'<div class="fh-eng-empty">NO RECORDS ON FILE &middot; HISTORY BEGINS ON FIRST COMPLETION</div>'}function Bo(e){let t=Q[e.type]||{label:e.type,color:J.inkMute},a=e.points_delta?e.points_delta>0?`+${e.points_delta}pts`:`${e.points_delta}pts`:"",s=e.points_delta>0?J.amber:J.red;return`
        <div class="fh-eng-hist-row">
            <div class="fh-eng-hist-type" style="color:${t.color}">${m(t.label.toUpperCase())}</div>
            <div class="fh-eng-hist-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a?`<div class="fh-eng-hist-pts" style="color:${s}">${a}</div>`:""}
        </div>`}function Ro(e,t){let a=t._expandedSkippedDates.has(e.key),s=e.totalPenalty>0?`&minus;${e.totalPenalty}pts`:"no penalty";return`
        <div class="fh-eng-hist-row fh-eng-hist-skipped"
             data-act="toggle-skipped-group" data-key="${e.key}" style="cursor:pointer">
            <div class="fh-eng-hist-type" style="color:${J.red}">SKIPPED CYCLE</div>
            <div class="fh-eng-hist-name">${m(e.dateDisplay)} &middot; ${s}</div>
            <span style="color:${J.inkMute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(o=>`
            <div class="fh-eng-hist-row" style="padding-left:24px;opacity:.8">
                <div class="fh-eng-hist-type" style="color:${J.inkMute}">ITEM</div>
                <div class="fh-eng-hist-name">${m(o.chore_name||"")}</div>
                ${o.points_delta?`<div class="fh-eng-hist-pts" style="color:${J.red}">${o.points_delta}pts</div>`:""}
                ${re(o)}
            </div>`).join(""):""}`}var J,He,Vt,Jt,Yt=O(()=>{V();W();Re();J={paper:"#0E3A5C",panel:"#0B2D48",grid:"#3C7AA5",ink:"#F2EBD6",inkDim:"#C9C0A2",inkMute:"#8A8669",red:"#E07A4C",amber:"#E0B84C"},He=[{minXP:0,name:"Drafter"},{minXP:100,name:"Jr. Engineer"},{minXP:300,name:"P.E."},{minXP:700,name:"Sr. Engineer"},{minXP:1200,name:"Principal Eng."}],Vt={themeKey:"engineer",kickerFormat:(e,t)=>`WO-${String(t).padStart(3,"0")} \xB7 ${(e.category_label||"GEN").toUpperCase()}`,btnLabel:"MARK<br>COMPLETE",btnIcon:"\u2713",btnPendingLabel:"PENDING<br>APPROVAL",btnPendingIcon:"\u23F1",reminderBtnLabel:"DISMISS",streakIcon:"\u25B3",statusFormat:{breach:e=>`BREACH \xB7 ${e.days_overdue}D`,resetSoon:()=>"RESETS 1D",firing:e=>`ACCRUING \u2212${e.penalty_points}/D`,expiry:e=>e<=0?"EXPIRES TODAY":`EXPIRES ${e}D`},iconColor:()=>J.ink},Jt={key:"engineer",tint:"#1B3550",sigil:"\u27C1",ranks:He,handlesNavigation:!0,rankTitle(e){return G(e,He).name},homeTileSubLabel(){return"CIVIL ENGINEER"},render(e,t){var F;let a=t.child_mode?" kid-large":"",s=e._personEntityId(t.name),o=e._attrs(s),r=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((F=e._states(s))==null?void 0:F.state)||"0"),i=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:c}=ie(t,r,i),l=le(t.person_id,r.history_log,r.rank_eval_weekday),b=de(t.person_id,r.history_log,r.rank_eval_weekday),g=ce(o),y=[{key:"tasks",label:"WORK ORDERS",sub:"primary"},{key:"store",label:"REWARDS",sub:"exchange"},{key:"history",label:"AS-BUILTS",sub:"history"}],x=e._tab||"tasks",S=y.map(R=>`
            <div class="fh-eng-tab ${x===R.key?"active":""}"
                 data-act="tab" data-tab="${R.key}">
                ${R.label}
                <span class="fh-eng-tab-sub">${R.sub}</span>
            </div>`).join(""),p="";x==="tasks"&&(p=Ao(o,t,n,e)),x==="store"&&(p=Mo(o,t,n,e)),x==="history"&&(p=Fo(t,e));let k=G(i,He),E=(o.tasks_due_today_list||[]).filter(R=>R.status==="pending").length,u=new Date,h=u.toISOString().slice(0,10),_=u.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1}),z=x==="tasks",$=z?_o({attr:o,naAttr:r,person:t,balance:n,openCount:E,weekly:l,lost:b,atRisk:g,rank:k,rankIdx:i,dropThr:d,gainThr:c,plotDate:h}):"";return`
            <div class="fh-eng-page${a}">
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
                            ${N(t.name)}
                            <span class="fh-eng-avatar-diamond"></span>
                        </div>

                        <div class="fh-eng-identity">
                            <div class="fh-eng-rank-line">
                                ${m(k.name.toUpperCase())} &middot; AGT ${m((t.code||t.name).toUpperCase())} &middot; DIV. ${m(t.person_type==="parent"?"PARENT":"FIELD")}
                            </div>
                            <div class="fh-eng-name">${m(t.name)} &middot; Work Orders</div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="fh-eng-tabs">${S}</div>
                    <div class="fh-eng-rule"></div>

                    <!-- Body \u2014 two-column on wide, stacked below 900px -->
                    <div class="fh-eng-body ${z?"has-rail":""}">
                        <div class="fh-eng-body-main">${p}</div>
                        ${z?`<aside class="fh-eng-rail">${$}</aside>`:""}
                    </div>

                    <!-- Footer \u2014 single mono status line -->
                    <div class="fh-eng-footer">
                        <span class="fh-eng-file-path">FILE &middot; /WORK_ORDERS/${h}.dwg &middot; LAST PLOT ${_} LOCAL &middot; SHEET A-101 R/A</span>
                    </div>
                </div>
            </div>`}}});function Io({attr:e,naAttr:t,person:a,balance:s,weekly:o,lost:r,atRisk:n,openCount:i,rankIdx:d,dropThr:c,gainThr:l,rank:b}){return`
        ${Do(s,o,r,n,i,e.show_dollar_value?e.dollar_value:null)}
        ${Ce(e)}
        ${Po(d,o,c,l,a,e)}
        ${Lo(e,t,a)}
        ${(()=>{let g=he(a,t,Y.terra);return g?Ae("rotation",g):""})()}
        ${To(e,s,a.person_id)}
        ${Oo(a,t)}`}function Ae(e,t){return`
        <div class="fh-bk-rpanel">
            <div class="fh-bk-rpanel-hdr">~ ${e} ~</div>
            <div class="fh-bk-rpanel-body">${t}</div>
        </div>`}function To(e,t,a){let s=_e(e.subscriptions,t,a);return s?Ae("SUBSCRIPTIONS",s):""}function Do(e,t,a,s,o,r){let n=(d,c,l,b,g="")=>`
        <div class="fh-bk-rkpi">
            <div class="fh-bk-rkpi-lbl">${d}</div>
            <div class="fh-bk-rkpi-val-row">
                <span class="fh-bk-rkpi-val">${m(String(c))}</span>
                ${l?`<span class="fh-bk-rkpi-unit">${l}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,i=`
        <div class="fh-bk-rkpi-row">
            ${n("balance",P(e),"pts",r!=null?H(r):null)}
            ${n("this week",`+${t}`,"pts",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("on prep",o,"items",s>0?`\u2212${s} at risk`:null,"fh-rkpi-sub--loss")}
        </div>`;return Ae("the pantry today",i)}function Po(e,t,a,s,o,r){let n=pe(e,t,a,s,je,Y.terra,o),i=fe(o,Y.terra),d=be(r);return n?Ae("promotion track",n+i+d):Ae("promotion track",`<div class="fh-bk-rmax">${m(G(e,je).name)} \xB7 top of the line</div>${i}${d}`)}function Lo(e,t,a){let s=me(e,t,a,8);if(!s.length)return Ae("hot streaks",'<div class="fh-bk-rempty">No hot streaks yet \u2014 fire up the oven</div>');let o=s.map(r=>{let{goalSegs:n,filledN:i,countLbl:d}=ge(r.streak,r.milestone,10),c=Array.from({length:n},(b,g)=>`<span class="fh-bk-rdot${g<i?" filled":""}"></span>`).join(""),l=r.milestone>0&&r.bonus>0?`<span class="fh-bk-rbonus">\u2605+${r.bonus}</span>`:"";return`
            <div class="fh-bk-rstreak">
                <div class="fh-bk-rstreak-head">
                    <span class="fh-bk-rstreak-name">${m(r.name)}</span>
                    ${l}
                </div>
                <div class="fh-bk-rstreak-bar">
                    <span class="fh-bk-rdots">${c}</span>
                    <span class="fh-bk-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return Ae("hot streaks",o)}function Oo(e,t){let a=(t.history_log||[]).filter(o=>o.person_id===e.person_id&&(o.points_delta||0)>0).slice(0,4);if(!a.length)return Ae("today's tickets",'<div class="fh-bk-rempty">No tickets served yet</div>');let s=a.map(o=>{let r=o.timestamp?Z(o.timestamp):"";return`
            <div class="fh-bk-rorder">
                <div class="fh-bk-rorder-when">~ ${m(r)} ~</div>
                <div class="fh-bk-rorder-row">
                    <span class="fh-bk-rorder-name">${m(o.chore_name||o.note||"\u2014")}</span>
                    <span class="fh-bk-rorder-pts">+${o.points_delta}pts</span>
                </div>
            </div>`}).join("");return Ae("today's tickets",s)}function No(e,t,a,s){let o=e.tasks_due_today_list||[],r=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],i=a.category_labels||[],d=(p,k)=>{let E=new Map;for(let u of p)(!E.has(u.chore_id)||k(u,E.get(u.chore_id)))&&E.set(u.chore_id,u);return[...E.values()]},c=d(r,(p,k)=>(p.days_overdue||0)>(k.days_overdue||0)),l=d(o.filter(p=>p.chore_type!=="reminder"),()=>!1),b=[...c.map(p=>({...p,_over:!0})),...l];if(!b.length&&!n.length)return`<div class="fh-bk-empty">\u2713 Kitchen's clear \u2014 all orders done!</div>`;let g=0,x=Ee(b,i).map(p=>{let k=`<div class="fh-row-section-hdr">${m(p.label)}</div>`,E=p.tasks.map(u=>q(u,Xt,t,s,{index:++g})).join("");return k+E}).join(""),S=n.length?`
        <div class="fh-row-section-hdr">Awaiting approval</div>
        ${n.map(p=>q(p,Xt,t,s)).join("")}`:"";return`
        ${ue(e)}
        <div class="fh-row-list">
            ${x}
            ${S}
        </div>`}function Ho(e,t,a,s){let o=e.store_items||[];if(!o.length)return'<div class="fh-bk-empty">No rewards on the menu yet.</div>';let r=s._attrs("sensor.family_hub_needs_attention"),n=(r.redemption_queue||[]).filter(l=>l.person_id===t.person_id),i=new Set(n.map(l=>l.item_id).filter(Boolean)),d=new Set(n.filter(l=>!l.item_id).map(l=>l.item_name)),c=new Set((e.subscriptions||[]).map(l=>l.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Se(e.group_proposals,t.person_id)}
        ${ve(e)}
        <div class="fh-bk-menu">
            ${o.map(l=>{let b=!!l.is_group_reward,g=l.item_type==="subscription",y=g&&c.has(l.item_id),x=a>=l.points_cost,S=i.has(l.item_id)||d.has(l.name),p=!!l.next_available,k={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[l.subscription_period]||"mo";return`
                <div class="fh-bk-menu-item">
                    ${ne(l)}
                    <div class="fh-bk-menu-body">
                        <div class="fh-bk-menu-name">${m(l.name)}</div>
                        ${l.description?`<div class="fh-bk-menu-desc">${m(l.description)}</div>`:""}
                        ${xe(l)}
                        ${we(l,t.person_id)}
                    </div>
                    ${b?"":`<div class="fh-bk-menu-price" style="color:${Y.terra}">${P(l.points_cost)}pts</div>`}
                    ${ye(l,e,t.person_id)}
                    ${b?ke(l,t.person_id,a):g?y?`<span class="fh-bk-badge" style="color:${Y.terra}">Subscribed \u2713</span>`:S?`<span class="fh-bk-badge" style="color:${Y.terra}">Requested \u2713</span>`:`<button class="fh-bk-go-btn ${x?"":"disabled"}"
                                       data-act="redeem"
                                       data-iid="${C(l.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       ${x?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                                   ${x?`Subscribe \xB7 ${l.points_cost}pts/${k}`:"Need more"}
                               </button>`:S?`<span class="fh-bk-badge" style="color:${Y.terra}">Requested \u2713</span>`:p?'<span class="fh-bk-badge" style="color:var(--fh-overdue)">Not available</span>':`<button class="fh-bk-go-btn ${x?"":"disabled"}"
                                   data-act="redeem" data-iid="${C(l.item_id)}" data-pid="${C(t.person_id)}"
                                   ${x?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                               ${x?"Request":"Need more"}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${$e(e.subscriptions,a,r.history_log,t.person_id)}
        </div>
        </div>`}function jo(e,t){let s=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(r=>r.person_id===e.person_id);return s.length?`
        <div class="fh-bk-log">
            ${ae(s).slice(0,15).map(r=>r.isGroup?Uo(r,t):Go(r.entry)).join("")}
        </div>`:'<div class="fh-bk-empty">No orders on record yet.</div>'}function Go(e){let t=Q[e.type]||{label:e.type,color:Y.mute},a=e.points_delta?`<span style="color:${e.points_delta>0?Y.terra:Y.red};font-weight:700">
               ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"";return`
        <div class="fh-bk-log-row">
            <div class="fh-bk-log-type" style="color:${t.color}">${m(t.label)}</div>
            <div class="fh-bk-log-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a}
        </div>`}function Uo(e,t){let a=t._expandedSkippedDates.has(e.key),s=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty";return`
        <div class="fh-bk-log-row"
             data-act="toggle-skipped-group" data-key="${C(e.key)}" style="cursor:pointer">
            <div class="fh-bk-log-type" style="color:${Y.red}">Skipped</div>
            <div class="fh-bk-log-name">${m(e.dateDisplay)} \xB7 ${s}</div>
            <span style="color:${Y.mute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(o=>`
            <div class="fh-bk-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-bk-log-type" style="color:${Y.mute}">Item</div>
                <div class="fh-bk-log-name">${m(o.chore_name||"")}</div>
                ${o.points_delta?`<span style="color:${Y.red};font-weight:700">${o.points_delta}pts</span>`:""}
                ${re(o)}
            </div>`).join(""):""}`}var Y,Xt,je,Qt,Zt=O(()=>{V();W();Re();Y={bg:"#F2E5CC",panel:"#FBF3E2",ink:"#3A1F12",mute:"#8B5A3A",terra:"#8B3A2A",red:"#A02828",green:"#3A6A28"},Xt={themeKey:"baker",leadFormat:(e,t)=>e.status==="pending_approval"?null:String(t),btnLabel:"Bake it \u2713",btnPendingLabel:"Pending Approval",reminderBtnLabel:"Dismiss",streakIcon:"\u{1F525}",statusFormat:{breach:e=>`Overdue ${e.days_overdue}d`,resetSoon:()=>"Resets 1d",firing:e=>`\u2212${e.penalty_points}pts/d`,expiry:e=>e<=0?"Expires today":`Expires in ${e}d`},iconColor:(e,t)=>t?Y.red:Y.terra},je=[{minXP:0,name:"Apprentice"},{minXP:100,name:"Line Cook"},{minXP:300,name:"Pastry Chef"},{minXP:700,name:"Sous Chef"},{minXP:1200,name:"Head Chef"}],Qt={key:"baker",tint:"#F2E5CC",sigil:"\u2767",ranks:je,handlesNavigation:!1,rankTitle(e){return G(e,je).name},homeTileSubLabel(){return"MASTER BAKER"},render(e,t){var R;let a=t.child_mode?" kid-large":"",s=e._personEntityId(t.name),o=e._attrs(s),r=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((R=e._states(s))==null?void 0:R.state)||"0"),i=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:c}=ie(t,r,i),l=le(t.person_id,r.history_log,r.rank_eval_weekday),b=de(t.person_id,r.history_log,r.rank_eval_weekday),g=ce(o),y=G(i,je),x=new Date,S=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],p=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],k=`${S[x.getDay()]} \xB7 ${x.getDate()} ${p[x.getMonth()]}`,E=[{key:"tasks",label:"Today's Prep",sub:"CHORES"},{key:"store",label:"Pantry",sub:"STORE"},{key:"history",label:"Recipe Book",sub:"HISTORY"}],u=e._tab||"tasks",h=E.map(B=>`
            <div class="fh-bk-tab ${u===B.key?"active":""}"
                 data-act="tab" data-tab="${B.key}">${B.label}<span class="fh-bk-tab-sub">${B.sub}</span></div>`).join(""),_="";u==="tasks"&&(_=No(o,t,r,e)),u==="store"&&(_=Ho(o,t,n,e)),u==="history"&&(_=jo(t,e));let z=(o.tasks_due_today_list||[]).filter(B=>B.status==="pending").length,$=u==="tasks",F=$?Io({attr:o,naAttr:r,person:t,balance:n,weekly:l,lost:b,atRisk:g,openCount:z,rankIdx:i,dropThr:d,gainThr:c,rank:y}):"";return`
            <div class="fh-bk-page${a}">
                <div class="fh-bk-frame-outer"></div>
                <div class="fh-bk-frame-inner"></div>

                <div class="fh-bk-title-block">
                    <div class="fh-bk-title-kicker">~ ${k} ~</div>
                    <div class="fh-bk-title-main">Shannon's Kitchen</div>
                    <div class="fh-bk-title-sub">~ today's recipe \xB7 serves the whole family ~</div>
                </div>

                <div class="fh-bk-tabs">${h}</div>

                <div class="fh-bk-body ${$?"has-rail":""}">
                    <div class="fh-bk-body-main">${_}</div>
                    ${$?`<aside class="fh-bk-rail">${F}</aside>`:""}
                </div>

                <div class="fh-bk-footer"><span>\u2014 Family Hub \xB7 est. 2026 \u2014</span><span>${m(y.name)}</span></div>
            </div>`}}});function Wo({attr:e,naAttr:t,person:a,balance:s,weekly:o,lost:r,atRisk:n,openCount:i,rankIdx:d,dropThr:c,gainThr:l,dateStr:b}){return`
        ${Ko(s,o,r,n,i,e.show_dollar_value?e.dollar_value:null)}
        ${Ce(e)}
        ${Vo(d,o,c,l,a,e)}
        ${Jo(e,t,a)}
        ${(()=>{let g=he(a,t,X.amber);return g?Me("ROTATION",g):""})()}
        ${qo(e,s,a.person_id)}
        ${Yo(a,t)}`}function Me(e,t){return`
        <div class="fh-dn-rpanel">
            <div class="fh-dn-rpanel-hdr">// ${e}</div>
            <div class="fh-dn-rpanel-body">${t}</div>
        </div>`}function qo(e,t,a){let s=_e(e.subscriptions,t,a);return s?Me("SUBSCRIPTIONS",s):""}function Ko(e,t,a,s,o,r){let n=(d,c,l,b,g="")=>`
        <div class="fh-dn-rkpi">
            <div class="fh-dn-rkpi-lbl">${d}</div>
            <div class="fh-dn-rkpi-val-row">
                <span class="fh-dn-rkpi-val">${m(String(c))}</span>
                ${l?`<span class="fh-dn-rkpi-unit">${l}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,i=`
        <div class="fh-dn-rkpi-row">
            ${n("FOSSILS",P(e),"pts",r!=null?H(r):null)}
            ${n("THIS WEEK",`+${t}`,"pts",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("SPECIMENS",o,"open",s>0?`\u2212${s} at risk`:null,"fh-rkpi-sub--loss")}
        </div>`;return Me("FIELD KIT \xB7 TODAY",i)}function Vo(e,t,a,s,o,r){let n=pe(e,t,a,s,Ge,X.amber,o),i=fe(o,X.amber),d=be(r);return n?Me("DIG STATUS",n+i+d):Me("DIG STATUS",`<div class="fh-dn-rmax">${m(G(e,Ge).name)} \xB7 MAX</div>${i}${d}`)}function Jo(e,t,a){let s=me(e,t,a,8);if(!s.length)return Me("FOSSIL RECORD",'<div class="fh-dn-rempty">NO STREAKS LOGGED \u2014 DIG IN</div>');let o=s.map(r=>{let{goalSegs:n,filledN:i,countLbl:d}=ge(r.streak,r.milestone,10),c=Array.from({length:n},(b,g)=>`<span class="fh-dn-footprint${g<i?"":" dim"}">\u{1F9B6}</span>`).join(""),l=r.milestone>0&&r.bonus>0?`<span class="fh-dn-rbonus">\u2605+${r.bonus}</span>`:"";return`
            <div class="fh-dn-rstreak">
                <div class="fh-dn-rstreak-head">
                    <span class="fh-dn-rstreak-name">${m(r.name)}</span>
                    ${l}
                </div>
                <div class="fh-dn-rstreak-bar">
                    <span class="fh-dn-footprints">${c}</span>
                    <span class="fh-dn-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return Me("FOSSIL RECORD",o)}function Yo(e,t){let a=(t.history_log||[]).filter(o=>o.person_id===e.person_id&&(o.points_delta||0)>0).slice(0,4);if(!a.length)return Me("RECENT FINDINGS",'<div class="fh-dn-rempty">NO FINDINGS YET \u2014 FILE FIRST SPECIMEN</div>');let s=a.map((o,r)=>{let n=String(r+1).padStart(3,"0"),i=o.timestamp?Z(o.timestamp):"";return`
            <div class="fh-dn-rfind">
                <div class="fh-dn-rfind-tag">SP-${n} \xB7 FILED ${m(i.toUpperCase())}</div>
                <div class="fh-dn-rfind-row">
                    <span class="fh-dn-rfind-name">${m(o.chore_name||o.note||"\u2014")}</span>
                    <span class="fh-dn-rfind-pts">+${o.points_delta}pts</span>
                </div>
            </div>`}).join("");return Me("RECENT FINDINGS",s)}function Xo(e,t,a,s){let o=e.tasks_due_today_list||[],r=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],i=a.category_labels||[],d=(p,k)=>{let E=new Map;for(let u of p)(!E.has(u.chore_id)||k(u,E.get(u.chore_id)))&&E.set(u.chore_id,u);return[...E.values()]},c=d(r,(p,k)=>(p.days_overdue||0)>(k.days_overdue||0)),l=d(o.filter(p=>p.chore_type!=="reminder"),()=>!1),b=[...c.map(p=>({...p,_over:!0})),...l];if(!b.length&&!n.length)return'<div class="fh-dn-empty">\u25C9 SITE CLEAR \u2014 ALL SPECIMENS LOGGED</div>';let g=0,x=Ee(b,i).map(p=>{let k=`<div class="fh-row-section-hdr">${m(p.label)}</div>`,E=p.tasks.map(u=>q(u,ea,t,s,{index:++g})).join("");return k+E}).join(""),S=n.length?`
        <div class="fh-row-section-hdr">AWAITING APPROVAL</div>
        ${n.map(p=>q(p,ea,t,s)).join("")}`:"";return`
        ${ue(e)}
        <div class="fh-row-list">
            ${x}
            ${S}
        </div>`}function Qo(e,t,a,s){let o=e.store_items||[];if(!o.length)return'<div class="fh-dn-empty">SUPPLY CACHE EMPTY</div>';let r=s._attrs("sensor.family_hub_needs_attention"),n=(r.redemption_queue||[]).filter(l=>l.person_id===t.person_id),i=new Set(n.map(l=>l.item_id).filter(Boolean)),d=new Set(n.filter(l=>!l.item_id).map(l=>l.item_name)),c=new Set((e.subscriptions||[]).map(l=>l.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Se(e.group_proposals,t.person_id)}
        ${ve(e)}
        <div class="fh-dn-supply">
            ${o.map(l=>{let b=!!l.is_group_reward,g=l.item_type==="subscription",y=g&&c.has(l.item_id),x=a>=l.points_cost,S=i.has(l.item_id)||d.has(l.name),p=!!l.next_available,k={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[l.subscription_period]||"mo";return`
                <div class="fh-dn-supply-item">
                    ${ne(l)}
                    <div class="fh-dn-supply-body">
                        <div class="fh-dn-supply-name">${m(l.name)}</div>
                        ${l.description?`<div class="fh-dn-supply-desc">${m(l.description)}</div>`:""}
                        ${xe(l)}
                        ${we(l,t.person_id)}
                    </div>
                    ${b?"":`<div class="fh-dn-pts-tag" style="color:${X.amber}">${P(l.points_cost)}pts</div>`}
                    ${ye(l,e,t.person_id)}
                    ${b?ke(l,t.person_id,a):g?y?`<span style="color:${X.amber};font-size:.8rem;font-weight:700">SUBSCRIBED \u2713</span>`:S?`<span style="color:${X.amber};font-size:.8rem;font-weight:700">REQUESTED \u2713</span>`:`<button class="fh-dn-go-btn ${x?"":"disabled"}"
                                       data-act="redeem"
                                       data-iid="${C(l.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       ${x?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                                   ${x?`SUBSCRIBE \xB7 ${l.points_cost}/${k}`:"NEED MORE"}
                               </button>`:S?`<span style="color:${X.amber};font-size:.8rem;font-weight:700">CLAIMED \u2713</span>`:p?'<span style="color:var(--fh-overdue);font-size:.75rem;font-weight:600">NOT AVAILABLE</span>':`<button class="fh-dn-go-btn ${x?"":"disabled"}"
                                   data-act="redeem" data-iid="${C(l.item_id)}" data-pid="${C(t.person_id)}"
                                   ${x?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                               ${x?"CLAIM":"NEED MORE"}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${$e(e.subscriptions,a,r.history_log,t.person_id)}
        </div>
        </div>`}function Zo(e,t){let s=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(r=>r.person_id===e.person_id);return s.length?`
        <div class="fh-dn-log">
            ${ae(s).slice(0,15).map(r=>r.isGroup?ts(r,t):es(r.entry)).join("")}
        </div>`:'<div class="fh-dn-empty">NO ENTRIES IN SITE LOG YET</div>'}function es(e){let t=Q[e.type]||{label:e.type,color:X.mute},a=e.points_delta?`<span style="color:${e.points_delta>0?X.amber:X.red};font-weight:700">
               ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"";return`
        <div class="fh-dn-log-row">
            <div class="fh-dn-log-type" style="color:${t.color}">${m(t.label)}</div>
            <div class="fh-dn-log-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a}
        </div>`}function ts(e,t){let a=t._expandedSkippedDates.has(e.key),s=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty";return`
        <div class="fh-dn-log-row"
             data-act="toggle-skipped-group" data-key="${C(e.key)}" style="cursor:pointer">
            <div class="fh-dn-log-type" style="color:${X.red}">SKIPPED</div>
            <div class="fh-dn-log-name">${m(e.dateDisplay)} \xB7 ${s}</div>
            <span style="color:${X.mute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(o=>`
            <div class="fh-dn-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-dn-log-type" style="color:${X.mute}">ITEM</div>
                <div class="fh-dn-log-name">${m(o.chore_name||"")}</div>
                ${o.points_delta?`<span style="color:${X.red};font-weight:700">${o.points_delta}pts</span>`:""}
                ${re(o)}
            </div>`).join(""):""}`}var X,ea,Ge,ta,aa=O(()=>{V();W();Re();X={bg:"#E8DAB7",panel:"#F0E5C8",ink:"#2B1F0E",mute:"#6B5020",amber:"#8B6A20",red:"#8C281E",green:"#2A5A20"},ea={themeKey:"dinos",kickerFormat:(e,t)=>e.status==="pending_approval"?null:`SP-${String(t).padStart(3,"0")} \xB7 ${(e.category_label||"MISC").toUpperCase().slice(0,12)}`,btnLabel:"LOG IT",btnPendingLabel:"PENDING APPROVAL",reminderBtnLabel:"DISMISS",streakIcon:"\u{1F525}",statusFormat:{breach:e=>`OVERDUE ${e.days_overdue}D`,resetSoon:()=>"RESETS 1D",firing:e=>`\u2212${e.penalty_points}/D`,expiry:e=>e<=0?"EXPIRES TODAY":`EXPIRES ${e}D`},iconColor:(e,t)=>t?X.red:X.ink},Ge=[{minXP:0,name:"Field Asst."},{minXP:100,name:"Jr. Paleontologist"},{minXP:300,name:"Field Lead"},{minXP:700,name:"Curator"},{minXP:1200,name:"Dr. Spencer"}],ta={key:"dinos",tint:"#E8DAB7",sigil:"\u25C9",ranks:Ge,handlesNavigation:!1,rankTitle(e){return G(e,Ge).name},homeTileSubLabel(){return"FIELD PALEONTOLOGIST"},render(e,t){var R;let a=t.child_mode?" kid-large":"",s=e._personEntityId(t.name),o=e._attrs(s),r=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((R=e._states(s))==null?void 0:R.state)||"0"),i=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:c}=ie(t,r,i),l=le(t.person_id,r.history_log,r.rank_eval_weekday),b=de(t.person_id,r.history_log,r.rank_eval_weekday),g=ce(o),y=G(i,Ge),x=new Date,S=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],p=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],k=`${S[x.getDay()]} \xB7 ${x.getDate()} ${p[x.getMonth()]}`,E=[{key:"tasks",label:"FIELD LOG",sub:"today's specimens"},{key:"store",label:"TRADING POST",sub:"rewards"},{key:"history",label:"CATALOGUE",sub:"history"}],u=e._tab||"tasks",h=E.map(B=>`
            <div class="fh-dn-tab ${u===B.key?"active":""}"
                 data-act="tab" data-tab="${B.key}">${B.label}<span class="fh-dn-tab-sub">${B.sub}</span></div>`).join(""),_="";u==="tasks"&&(_=Xo(o,t,r,e)),u==="store"&&(_=Qo(o,t,n,e)),u==="history"&&(_=Zo(t,e));let z=(o.tasks_due_today_list||[]).filter(B=>B.status==="pending").length,$=u==="tasks",F=$?Wo({attr:o,naAttr:r,person:t,balance:n,weekly:l,lost:b,atRisk:g,openCount:z,rankIdx:i,dropThr:d,gainThr:c,dateStr:k}):"";return`
            <div class="fh-dn-page${a}">
                <div class="fh-dn-trex-watermark">\u{1F995}</div>
                <div class="fh-dn-tape fh-dn-tape-tl"></div>
                <div class="fh-dn-tape fh-dn-tape-tr"></div>
                <div class="fh-dn-tape fh-dn-tape-bl"></div>
                <div class="fh-dn-tape fh-dn-tape-br"></div>

                <div class="fh-dn-title-block">
                    <div class="fh-dn-title-kicker">FIELD AGENT \xB7 CODENAME T-REX \xB7 DIV. PALEO</div>
                    <div class="fh-dn-title-main">Spencer's Field Log</div>
                    <div class="fh-dn-title-row">
                        <span class="fh-dn-title-date">EXPEDITION LOG \xB7 ${k.toUpperCase()}</span>
                        <span class="fh-dn-stamp">approved by HQ</span>
                        <span class="fh-dn-stamp fh-dn-stamp-olive">classified</span>
                    </div>
                </div>

                <div class="fh-dn-tabs">${h}</div>

                <div class="fh-dn-body ${$?"has-rail":""}">
                    <div class="fh-dn-body-main">${_}</div>
                    ${$?`<aside class="fh-dn-rail">${F}</aside>`:""}
                </div>

                <div class="fh-dn-footer"><span>FAMILY HUB \xB7 FIELD OPERATIONS</span><span>EXPEDITION LOG \xB7 ${k.toUpperCase()}</span></div>
            </div>`}}});function as({attr:e,naAttr:t,person:a,balance:s,weekly:o,lost:r,atRisk:n,openCount:i,rankIdx:d,dropThr:c,gainThr:l,rank:b}){return`
        ${ss(s,o,r,n,i,e.show_dollar_value?e.dollar_value:null)}
        ${Ce(e)}
        ${rs(d,o,c,l,a,e)}
        ${ns(e,t,a)}
        ${(()=>{let g=he(a,t,ee.emerald);return g?Fe("ROTATION",g):""})()}
        ${os(e,s,a.person_id)}
        ${is(a,t)}`}function Fe(e,t){return`
        <div class="fh-hp-rpanel">
            <div class="fh-hp-rpanel-hdr">~ ${e} ~</div>
            <div class="fh-hp-rpanel-body">${t}</div>
        </div>`}function os(e,t,a){let s=_e(e.subscriptions,t,a);return s?Fe("SUBSCRIPTIONS",s):""}function ss(e,t,a,s,o,r){let n=(d,c,l,b,g="")=>`
        <div class="fh-hp-rkpi">
            <div class="fh-hp-rkpi-lbl">${d}</div>
            <div class="fh-hp-rkpi-val-row">
                <span class="fh-hp-rkpi-val">${m(String(c))}</span>
                ${l?`<span class="fh-hp-rkpi-unit">${l}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,i=`
        <div class="fh-hp-rkpi-row">
            ${n("HOUSE PTS",P(e),"",r!=null?H(r):null)}
            ${n("THIS WEEK",`+${t}`,"pts",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("CLASSES",o,"open",s>0?`\u2212${s} at risk`:null,"fh-rkpi-sub--loss")}
        </div>`;return Fe("HOUSE STANDINGS",i)}function rs(e,t,a,s,o,r){let n=pe(e,t,a,s,Ue,ee.emerald,o),i=fe(o,ee.emerald),d=be(r);return n?Fe("O.W.L. PROGRESS",n+i+d):Fe("O.W.L. PROGRESS",`<div class="fh-hp-rmax">${m(G(e,Ue).name)} \xB7 max marks</div>${i}${d}`)}function ns(e,t,a){let s=me(e,t,a,8);if(!s.length)return Fe("SPELLWORK STREAKS",'<div class="fh-hp-rempty">No spells cast in succession yet</div>');let o=s.map(r=>{let{goalSegs:n,filledN:i,countLbl:d}=ge(r.streak,r.milestone,10),c=Array.from({length:n},(b,g)=>`<span class="fh-hp-rstar${g<i?" lit":""}">\u2605</span>`).join(""),l=r.milestone>0&&r.bonus>0?`<span class="fh-hp-rbonus">\u2605+${r.bonus}</span>`:"";return`
            <div class="fh-hp-rstreak">
                <div class="fh-hp-rstreak-head">
                    <span class="fh-hp-rstreak-name">${m(r.name)}</span>
                    ${l}
                </div>
                <div class="fh-hp-rstreak-bar">
                    <span class="fh-hp-rstars">${c}</span>
                    <span class="fh-hp-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return Fe("SPELLWORK STREAKS",o)}function is(e,t){let a=(t.history_log||[]).filter(o=>o.person_id===e.person_id&&(o.points_delta||0)>0).slice(0,4);if(!a.length)return Fe("OWL POST",'<div class="fh-hp-rempty">No owls delivered yet</div>');let s=a.map(o=>{let r=o.timestamp?Z(o.timestamp):"";return`
            <div class="fh-hp-rowl">
                <div class="fh-hp-rowl-when">~ ${m(r)} ~</div>
                <div class="fh-hp-rowl-row">
                    <span class="fh-hp-rowl-name">${m(o.chore_name||o.note||"\u2014")}</span>
                    <span class="fh-hp-rowl-pts">+${o.points_delta}pts</span>
                </div>
            </div>`}).join("");return Fe("OWL POST",s)}function ls(e,t,a,s){let o=e.tasks_due_today_list||[],r=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],i=a.category_labels||[],d=(p,k)=>{let E=new Map;for(let u of p)(!E.has(u.chore_id)||k(u,E.get(u.chore_id)))&&E.set(u.chore_id,u);return[...E.values()]},c=d(r,(p,k)=>(p.days_overdue||0)>(k.days_overdue||0)),l=d(o.filter(p=>p.chore_type!=="reminder"),()=>!1),b=[...c.map(p=>({...p,_over:!0})),...l];if(!b.length&&!n.length)return'<div class="fh-hp-empty">All assignments complete \u2014 10 points to the house!</div>';let g=0,x=Ee(b,i).map(p=>{let k=`<div class="fh-row-section-hdr">${m(p.label)}</div>`,E=p.tasks.map(u=>q(u,oa,t,s,{index:++g})).join("");return k+E}).join(""),S=n.length?`
        <div class="fh-row-section-hdr">Awaiting approval</div>
        ${n.map(p=>q(p,oa,t,s)).join("")}`:"";return`
        ${ue(e)}
        <div class="fh-row-list">
            ${x}
            ${S}
        </div>`}function ds(e,t,a,s){let o=e.store_items||[];if(!o.length)return'<div class="fh-hp-empty">The vault is empty for now.</div>';let r=s._attrs("sensor.family_hub_needs_attention"),n=(r.redemption_queue||[]).filter(l=>l.person_id===t.person_id),i=new Set(n.map(l=>l.item_id).filter(Boolean)),d=new Set(n.filter(l=>!l.item_id).map(l=>l.item_name)),c=new Set((e.subscriptions||[]).map(l=>l.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Se(e.group_proposals,t.person_id)}
        ${ve(e)}
        <div class="fh-hp-vault">
            ${o.map(l=>{let b=!!l.is_group_reward,g=l.item_type==="subscription",y=g&&c.has(l.item_id),x=a>=l.points_cost,S=i.has(l.item_id)||d.has(l.name),p=!!l.next_available,k={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[l.subscription_period]||"mo";return`
                <div class="fh-hp-vault-item">
                    ${ne(l)}
                    <div class="fh-hp-vault-body">
                        <div class="fh-hp-vault-name">${m(l.name)}</div>
                        ${l.description?`<div class="fh-hp-vault-desc">${m(l.description)}</div>`:""}
                        ${xe(l)}
                        ${we(l,t.person_id)}
                    </div>
                    ${b?"":`<div class="fh-hp-pts-seal" style="color:${ee.emerald}">${P(l.points_cost)}pts</div>`}
                    ${ye(l,e,t.person_id)}
                    ${b?ke(l,t.person_id,a):g?y?`<span style="color:${ee.emerald};font-size:.8rem;font-weight:700">Subscribed \u2713</span>`:S?`<span style="color:${ee.emerald};font-size:.8rem;font-weight:700">Requested \u2713</span>`:`<button class="fh-hp-cast-btn ${x?"":"disabled"}"
                                       data-act="redeem"
                                       data-iid="${C(l.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       ${x?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                                   ${x?`Subscribe \xB7 ${l.points_cost}pts/${k}`:"Need more"}
                               </button>`:S?`<span style="color:${ee.emerald};font-size:.8rem;font-weight:700">Requested \u2713</span>`:p?'<span style="color:var(--fh-overdue);font-size:.75rem;font-weight:600">Not available</span>':`<button class="fh-hp-cast-btn ${x?"":"disabled"}"
                                   data-act="redeem" data-iid="${C(l.item_id)}" data-pid="${C(t.person_id)}"
                                   ${x?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                               ${x?"Request":"Need more"}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${$e(e.subscriptions,a,r.history_log,t.person_id)}
        </div>
        </div>`}function cs(e,t){let s=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(r=>r.person_id===e.person_id);return s.length?`
        <div class="fh-hp-log">
            ${ae(s).slice(0,15).map(r=>r.isGroup?hs(r,t):ps(r.entry)).join("")}
        </div>`:'<div class="fh-hp-empty">No O.W.L. records yet.</div>'}function ps(e){let t=Q[e.type]||{label:e.type,color:ee.mute},a=e.points_delta?`<span style="color:${e.points_delta>0?ee.emerald:ee.red};font-weight:700">
               ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"";return`
        <div class="fh-hp-log-row">
            <div class="fh-hp-log-type" style="color:${t.color}">${m(t.label)}</div>
            <div class="fh-hp-log-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a}
        </div>`}function hs(e,t){let a=t._expandedSkippedDates.has(e.key),s=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty";return`
        <div class="fh-hp-log-row"
             data-act="toggle-skipped-group" data-key="${C(e.key)}" style="cursor:pointer">
            <div class="fh-hp-log-type" style="color:${ee.red}">Skipped</div>
            <div class="fh-hp-log-name">${m(e.dateDisplay)} \xB7 ${s}</div>
            <span style="color:${ee.mute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(o=>`
            <div class="fh-hp-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-hp-log-type" style="color:${ee.mute}">Item</div>
                <div class="fh-hp-log-name">${m(o.chore_name||"")}</div>
                ${o.points_delta?`<span style="color:${ee.red};font-weight:700">${o.points_delta}pts</span>`:""}
                ${re(o)}
            </div>`).join(""):""}`}var ee,oa,Ue,sa,ra=O(()=>{V();W();Re();ee={bg:"#EFE0BA",panel:"#FAF0D7",ink:"#241914",mute:"#5A4020",emerald:"#1F4F3C",gold:"#C9A22A",crimson:"#6F1B26",red:"#A02020",green:"#2A5A20"},oa={themeKey:"hp",leadFormat:(e,t)=>e.status==="pending_approval"||e._over?null:`P${t}`,btnLabel:"Cast \u2713",btnPendingLabel:"Pending Approval",reminderBtnLabel:"Dismiss",streakIcon:"\u26A1",statusFormat:{breach:e=>`Overdue ${e.days_overdue}d`,resetSoon:()=>"Resets 1d",firing:e=>`\u2212${e.penalty_points} house pts/d`,expiry:e=>e<=0?"Expires today":`Expires in ${e}d`},iconColor:()=>ee.panel},Ue=[{minXP:0,name:"First Year"},{minXP:100,name:"Second Year"},{minXP:300,name:"Prefect"},{minXP:700,name:"Head Student"},{minXP:1200,name:"Order of Phoenix"}],sa={key:"hp",tint:"#EFE0BA",sigil:"\u26A1",ranks:Ue,handlesNavigation:!1,rankTitle(e){return G(e,Ue).name},homeTileSubLabel(){return"HOGWARTS STUDENT"},render(e,t){var R;let a=t.child_mode?" kid-large":"",s=e._personEntityId(t.name),o=e._attrs(s),r=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((R=e._states(s))==null?void 0:R.state)||"0"),i=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:c}=ie(t,r,i),l=le(t.person_id,r.history_log,r.rank_eval_weekday),b=de(t.person_id,r.history_log,r.rank_eval_weekday),g=ce(o),y=G(i,Ue),x=new Date,S=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],p=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],k=`${S[x.getDay()]} \xB7 ${x.getDate()} ${p[x.getMonth()]}`,E=[{key:"tasks",label:"Classes",sub:"today's schedule"},{key:"store",label:"Honeydukes",sub:"reward shop"},{key:"history",label:"Pensieve",sub:"history"}],u=e._tab||"tasks",h=E.map(B=>`
            <div class="fh-hp-tab ${u===B.key?"active":""}"
                 data-act="tab" data-tab="${B.key}">${B.label}<span class="fh-hp-tab-sub">${B.sub}</span></div>`).join(""),_="";u==="tasks"&&(_=ls(o,t,r,e)),u==="store"&&(_=ds(o,t,n,e)),u==="history"&&(_=cs(t,e));let z=(o.tasks_due_today_list||[]).filter(B=>B.status==="pending").length,$=u==="tasks",F=$?as({attr:o,naAttr:r,person:t,balance:n,weekly:l,lost:b,atRisk:g,openCount:z,rankIdx:i,dropThr:d,gainThr:c,rank:y}):"";return`
            <div class="fh-hp-page${a}">
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
                            <div class="fh-hp-title-kicker">STUDENT \xB7 ${m(t.name.toUpperCase())} \xB7 ${m(y.name.toUpperCase())}</div>
                            <div class="fh-hp-title-main">${m(t.name)}</div>
                            <div class="fh-hp-title-sub">~ Daily Class Schedule \xB7 ${k} ~</div>
                        </div>
                        <div class="fh-hp-wax-seal">${N(t.name)}</div>
                    </div>
                </div>

                <div class="fh-hp-tabs">${h}</div>

                <div class="fh-hp-body ${$?"has-rail":""}">
                    <div class="fh-hp-body-main">${_}</div>
                    ${$?`<aside class="fh-hp-rail">${F}</aside>`:""}
                </div>

                <div class="fh-hp-footer"><span>By owl, this ${k} \xB7 Ops Year 2026</span><span>\xB7 Mischief Managed \xB7</span></div>
            </div>`}}});function fs({attr:e,naAttr:t,person:a,balance:s,weekly:o,lost:r,atRisk:n,openCount:i,rankIdx:d,dropThr:c,gainThr:l,nextItem:b,fillPct:g}){return`
        ${gs(s,o,r,n,i,e.show_dollar_value?e.dollar_value:null)}
        ${Ce(e)}
        ${bs(d,o,c,l,a,e)}
        ${us(e,t,a)}
        ${(()=>{let y=he(a,t,te.orange);return y?Be("ROTATION",y):""})()}
        ${ms(e,s,a.person_id)}
        ${vs(b,g)}`}function Be(e,t){return`
        <div class="fh-dbz-rpanel">
            <div class="fh-dbz-rpanel-hdr">${e}</div>
            <div class="fh-dbz-rpanel-body">${t}</div>
        </div>`}function ms(e,t,a){let s=_e(e.subscriptions,t,a);return s?Be("SUBSCRIPTIONS",s):""}function gs(e,t,a,s,o,r){let n=(d,c,l,b,g="")=>`
        <div class="fh-dbz-rkpi">
            <div class="fh-dbz-rkpi-lbl">${d}</div>
            <div class="fh-dbz-rkpi-val-row">
                <span class="fh-dbz-rkpi-val">${m(String(c))}</span>
                ${l?`<span class="fh-dbz-rkpi-unit">${l}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,i=`
        <div class="fh-dbz-rkpi-row">
            ${n("POWER",P(e),"\u26A1",r!=null?H(r):null)}
            ${n("WEEK",`+${t}`,"\u26A1",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("OPEN",o,"",s>0?`\u2212${s} at risk`:null,"fh-rkpi-sub--loss")}
        </div>`;return Be("POWER LEVEL",i)}function bs(e,t,a,s,o,r){let n=pe(e,t,a,s,We,te.orange,o),i=fe(o,te.orange),d=be(r);return n?Be("NEXT FORM",n+i+d):Be("NEXT FORM",`<div class="fh-dbz-rmax">${m(G(e,We).name)} \xB7 MAX</div>${i}${d}`)}function us(e,t,a){let s=me(e,t,a,8);if(!s.length)return Be("CHARGE STREAKS",'<div class="fh-dbz-rempty">NO CHARGE YET \u2014 TRAIN UP!</div>');let o=s.map(r=>{let{goalSegs:n,filledN:i,countLbl:d}=ge(r.streak,r.milestone,10),c=Array.from({length:n},(b,g)=>`<span class="fh-dbz-rbolt${g<i?"":" dim"}">\u26A1</span>`).join(""),l=r.milestone>0&&r.bonus>0?`<span class="fh-dbz-rbonus">\u2605+${r.bonus}</span>`:"";return`
            <div class="fh-dbz-rstreak">
                <div class="fh-dbz-rstreak-head">
                    <span class="fh-dbz-rstreak-name">${m(r.name)}</span>
                    ${l}
                </div>
                <div class="fh-dbz-rstreak-bar">
                    <span class="fh-dbz-rbolts">${c}</span>
                    <span class="fh-dbz-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return Be("CHARGE STREAKS",o)}function vs(e,t){if(!e)return Be("NEXT POWER-UP",'<div class="fh-dbz-rempty">SHOP STOCKED \u2014 ASK A PARENT</div>');let a=`
        <div class="fh-dbz-rnext-name">${m(e.name)}</div>
        <div class="fh-dbz-rnext-cost">${P(e.points_cost)}\u26A1</div>
        <div class="fh-dbz-next-bar-track"><div class="fh-dbz-next-bar-fill" style="width:${t}%"></div></div>`;return Be("NEXT POWER-UP",a)}function xs(e,t,a,s){let o=e.tasks_due_today_list||[],r=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],i=a.category_labels||[],d=(S,p)=>{let k=new Map;for(let E of S)(!k.has(E.chore_id)||p(E,k.get(E.chore_id)))&&k.set(E.chore_id,E);return[...k.values()]},c=d(r,(S,p)=>(S.days_overdue||0)>(p.days_overdue||0)),l=d(o.filter(S=>S.chore_type!=="reminder"),()=>!1),b=[...c.map(S=>({...S,_over:!0})),...l];if(!b.length&&!n.length)return`
            <div class="fh-dbz-all-done">
                <div class="fh-dbz-all-done-icon">\u2B50</div>
                <div class="fh-dbz-all-done-text">ALL DONE!</div>
            </div>`;let y=Ee(b,i).map(S=>{let p=`<div class="fh-row-section-hdr">${m(S.label)}</div>`,k=S.tasks.map(E=>q(E,na,t,s)).join("");return p+k}).join(""),x=n.length?`
        <div class="fh-row-section-hdr">WAITING FOR APPROVAL</div>
        ${n.map(S=>q(S,na,t,s)).join("")}`:"";return`
        ${ue(e)}
        <div class="fh-row-list">
            ${y}
            ${x}
        </div>`}function ys(e,t,a,s){let o=e.store_items||[];if(!o.length)return'<div class="fh-dbz-empty">No power-ups available yet!</div>';let r=s._attrs("sensor.family_hub_needs_attention"),n=(r.redemption_queue||[]).filter(l=>l.person_id===t.person_id),i=new Set(n.map(l=>l.item_id).filter(Boolean)),d=new Set(n.filter(l=>!l.item_id).map(l=>l.item_name)),c=new Set((e.subscriptions||[]).map(l=>l.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Se(e.group_proposals,t.person_id)}
        ${ve(e)}
        <div class="fh-dbz-powerup-list">
            ${o.map(l=>{let b=!!l.is_group_reward,g=l.item_type==="subscription",y=g&&c.has(l.item_id),x=a>=l.points_cost,S=i.has(l.item_id)||d.has(l.name),p=!!l.next_available,k={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[l.subscription_period]||"mo";return`
                <div class="fh-dbz-powerup-row ${!b&&!g&&!x?"locked":""}">
                    ${ne(l)}
                    <div class="fh-dbz-powerup-body">
                        <div class="fh-dbz-powerup-name">${m(l.name)}</div>
                        ${b?"":`<div class="fh-dbz-powerup-cost">${P(l.points_cost)}\u26A1</div>`}
                        ${xe(l)}
                        ${we(l,t.person_id)}
                    </div>
                    ${ye(l,e,t.person_id)}
                    ${b?ke(l,t.person_id,a):g?y?`<span style="color:${te.orange};font-weight:800;font-size:.9rem">SUB \u2713</span>`:S?`<span style="color:${te.orange};font-weight:800;font-size:.9rem">SENT \u2713</span>`:`<button class="fh-dbz-go-btn ${x?"":"locked"}"
                                       data-act="redeem"
                                       data-iid="${C(l.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       ${x?"":'disabled style="opacity:.35;cursor:not-allowed"'}>
                                   ${x?`SUB \xB7 ${l.points_cost}/${k}`:"NEED \u26A1"}
                               </button>`:S?`<span style="color:${te.orange};font-weight:800;font-size:.9rem">SENT \u2713</span>`:p?'<span style="color:var(--fh-overdue);font-weight:700;font-size:.8rem">NOT YET</span>':`<button class="fh-dbz-go-btn ${x?"":"locked"}"
                                   data-act="redeem" data-iid="${C(l.item_id)}" data-pid="${C(t.person_id)}"
                                   ${x?"":'disabled style="opacity:.35;cursor:not-allowed"'}>
                               ${x?"GET!":"NEED \u26A1"}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${$e(e.subscriptions,a,r.history_log,t.person_id)}
        </div>
        </div>`}function ws(e,t){let s=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(r=>r.person_id===e.person_id);return s.length?`
        <div class="fh-dbz-log">
            ${ae(s).slice(0,12).map(r=>r.isGroup?_s(r,t):ks(r.entry)).join("")}
        </div>`:'<div class="fh-dbz-empty">No battles recorded yet!</div>'}function ks(e){let t=Q[e.type]||{label:e.type,color:te.mute},a=e.points_delta?`<span style="color:${e.points_delta>0?te.orange:te.red};font-weight:800">
               ${e.points_delta>0?"+":""}${e.points_delta}\u26A1
           </span>`:"";return`
        <div class="fh-dbz-log-row">
            <div class="fh-dbz-log-type" style="color:${t.color}">${m(t.label)}</div>
            <div class="fh-dbz-log-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a}
        </div>`}function _s(e,t){let a=t._expandedSkippedDates.has(e.key),s=e.totalPenalty>0?`\u2212${e.totalPenalty}\u26A1`:"ok";return`
        <div class="fh-dbz-log-row"
             data-act="toggle-skipped-group" data-key="${C(e.key)}" style="cursor:pointer">
            <div class="fh-dbz-log-type" style="color:${te.red}">MISSED</div>
            <div class="fh-dbz-log-name">${m(e.dateDisplay)} \xB7 ${s}</div>
            <span style="color:${te.mute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(o=>`
            <div class="fh-dbz-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-dbz-log-type" style="color:${te.mute}">Item</div>
                <div class="fh-dbz-log-name">${m(o.chore_name||"")}</div>
                ${o.points_delta?`<span style="color:${te.red};font-weight:800">${o.points_delta}\u26A1</span>`:""}
                ${re(o)}
            </div>`).join(""):""}`}var te,na,We,ia,la=O(()=>{V();W();Re();te={sky:"#3FAAD9",orange:"#FF6A1A",yellow:"#FFE03A",navy:"#0F1E2E",white:"#FFFFFF",mute:"rgba(15,30,46,.6)",red:"#CC2200"},na={themeKey:"dbz",btnLabel:"GO!",btnPendingLabel:"PENDING",reminderBtnLabel:"OK",streakIcon:"\u26A1",statusFormat:{breach:e=>`!OVERDUE ${e.days_overdue}D`,resetSoon:()=>"RESETS 1D",firing:e=>`\u2212${e.penalty_points}\u26A1/D`,expiry:e=>e<=0?"EXPIRES TODAY":`EXPIRES ${e}D`},iconColor:(e,t)=>t?te.red:te.navy},We=[{minXP:0,name:"Saibaman"},{minXP:100,name:"Saiyan"},{minXP:300,name:"Super Saiyan"},{minXP:700,name:"SSJ2"},{minXP:1200,name:"SSJ Blue"}],ia={key:"dbz",tint:"#3FAAD9",sigil:"\u25CE",ranks:We,handlesNavigation:!1,rankTitle(e){return G(e,We).name},homeTileSubLabel(){return"SAIYAN WARRIOR"},render(e,t){var F;let a=t.child_mode?" kid-large":"",s=e._personEntityId(t.name),o=e._attrs(s),r=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((F=e._states(s))==null?void 0:F.state)||"0"),i=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:c}=ie(t,r,i),l=le(t.person_id,r.history_log,r.rank_eval_weekday),b=de(t.person_id,r.history_log,r.rank_eval_weekday),g=ce(o),y=G(i,We),x=[{key:"tasks",label:"\u{1F4AA} TRAIN"},{key:"store",label:"\u{1F48E} SHOP"},{key:"history",label:"\u{1F3C6} WINS"}],S=e._tab||"tasks",p=x.map(R=>`
            <div class="fh-dbz-tab ${S===R.key?"active":""}"
                 data-act="tab" data-tab="${R.key}">${R.label}</div>`).join(""),k="";S==="tasks"&&(k=xs(o,t,r,e)),S==="store"&&(k=ys(o,t,n,e)),S==="history"&&(k=ws(t,e));let E=(o.tasks_due_today_list||[]).filter(R=>R.status==="pending").length,u=o.store_items||[],h=u.find(R=>R.points_cost>n)||u[0]||null,_=h?Math.min(100,Math.round(n/h.points_cost*100)):100,z=S==="tasks",$=z?fs({attr:o,naAttr:r,person:t,balance:n,weekly:l,lost:b,atRisk:g,openCount:E,rankIdx:i,dropThr:d,gainThr:c,nextItem:h,fillPct:_}):"";return`
            <div class="fh-dbz-page${a}">
                <div class="fh-dbz-speedlines"></div>
                <div class="fh-dbz-halftone"></div>

                <div class="fh-dbz-header">
                    <div class="fh-dbz-avatar">${N(t.name)}</div>
                    <div class="fh-dbz-identity">
                        <div class="fh-dbz-codename">SAIYAN TRAINEE \xB7 CODENAME KAMEHA</div>
                        <div class="fh-dbz-name">${m(t.name).toUpperCase()}</div>
                    </div>
                    <div class="fh-dbz-power-badge">
                        <div class="fh-dbz-power-num">${P(n)}</div>
                        <div class="fh-dbz-power-lbl">POWER</div>
                    </div>
                </div>

                <div class="fh-dbz-mission-strip">
                    <span class="fh-dbz-strip-label">ACTIVE MISSIONS:</span>
                    <span class="fh-dbz-strip-count">${E}</span>
                    ${g>0?`
                    <span class="fh-dbz-strip-label">\xB7 AT RISK:</span>
                    <span class="fh-dbz-strip-count" style="color:#FF5A4A">\u2212${g}\u26A1</span>`:""}
                </div>

                <div class="fh-dbz-tabs">${p}</div>

                <div class="fh-dbz-body ${z?"has-rail":""}">
                    <div class="fh-dbz-body-main">${k}</div>
                    ${z?`<aside class="fh-dbz-rail">${$}</aside>`:""}
                </div>

                ${z||!h?"":`
                <div class="fh-dbz-next-bar">
                    <span style="font-size:1.6rem">\u{1F3AF}</span>
                    <div class="fh-dbz-next-bar-body">
                        <div class="fh-dbz-next-bar-lbl">NEXT POWER-UP</div>
                        <div class="fh-dbz-next-bar-name">${m(h.name)} \xB7 ${P(h.points_cost)}\u26A1</div>
                        <div class="fh-dbz-next-bar-track"><div class="fh-dbz-next-bar-fill" style="width:${_}%"></div></div>
                    </div>
                </div>`}
            </div>`}}});function Te(e){return da[e]||da.classic}var da,qe=O(()=>{Kt();Yt();Zt();aa();ra();la();da={classic:qt,engineer:Jt,baker:Qt,dinos:ta,hp:sa,dbz:ia}});function gt(e){let t=e._findPerson(e._viewPersonId||e._cfg.person);return t?Te(t.theme_key||"classic").render(e,t):`<div class="fh-empty">Person "${e._viewPersonId||e._cfg.person||"(unknown)"}" not found.<br>Check spelling in card config.</div>`}var ca=O(()=>{qe()});function ha(e){let t=e._attrs("sensor.family_hub_claimable_tasks"),a=e._attrs("sensor.family_hub_needs_attention"),s=e._people().filter(F=>F.active!==!1),o=t.all_tasks||[],r=t.tasks||[],n=a.approval_queue||[],i=a.category_labels||[],d=!!a.penalties_paused_global,c=a.family_name||"Family Hub";e._mcLastTasks||(e._mcLastTasks=new Map);let l=new Set(o.map(F=>F.task_id));for(let F of o)e._mcLastTasks.set(F.task_id,F);let b=e._pendingSubmit||new Set,g=[];for(let F of b)!l.has(F)&&e._mcLastTasks.has(F)&&g.push({...e._mcLastTasks.get(F),_phantom:!0});let y=[...o,...g],x=new Map(s.map(F=>[F.person_id,F])),S=F=>{let R=x.get(F.assigned_to);return{...F,_agentColor:(R==null?void 0:R.avatar_color)||L,_agentCode:((R==null?void 0:R.code)||(R==null?void 0:R.name)||"?").toUpperCase(),_agentName:(R==null?void 0:R.name)||"?",_agentPersonId:(R==null?void 0:R.person_id)||F.assigned_to}},p=(e._filter?y.filter(F=>F.assigned_to===e._filter):y).map(S),k=p.filter(F=>F.days_delta<0),E=p.filter(F=>F.days_delta>=0),u=pa(k),h=pa(E),_=u.length+h.length,z=n.length,$=$s();return`
        <div class="fh-mc">
            ${Ss(c,_,z,$,d)}
            <div class="fh-mc-body">
                <main class="fh-mc-main">
                    ${Es(s,y,n,e)}
                    ${Cs(u,e)}
                    ${zs(h,i,e)}
                    ${!u.length&&!h.length?`<div class="fh-mc-empty">
                               <div class="fh-mc-empty-title">\u2713 ALL MISSIONS COMPLETE</div>
                               <div class="fh-mc-empty-sub">HQ STANDING DOWN \xB7 NICE WORK</div>
                           </div>`:""}
                </main>
                <aside class="fh-mc-sidebar">
                    ${As(n)}
                    ${Ms(r)}
                    ${Fs(s,a)}
                </aside>
            </div>
        </div>
    `}function pa(e){let t=new Map;for(let a of e){let s=a.chore_id||a.task_id;t.has(s)||t.set(s,{chore_id:a.chore_id,name:a.name,icon:a.icon,description:a.description,category_label:a.category_label,points:a.points,penalty_enabled:a.penalty_enabled,penalty_points:a.penalty_points,daily_penalty_firing:a.daily_penalty_firing,days_until_reset:a.days_until_reset,recurrence_type:a.recurrence_type,anyBreach:!1,maxOverdue:0,assignees:[]});let o=t.get(s),r=a.days_delta<0;r&&(o.anyBreach=!0,o.maxOverdue=Math.max(o.maxOverdue,Math.abs(a.days_delta))),a.daily_penalty_firing&&(o.daily_penalty_firing=!0),o.assignees.push({person_id:a._agentPersonId,task_id:a.task_id,color:a._agentColor,code:a._agentCode,name:a._agentName,streak:a.streak||0,milestone:a.streak_milestone||0,status:a.status,days_overdue:r?Math.abs(a.days_delta):0,isBreach:r,isPhantom:!!a._phantom})}return[...t.values()]}function $s(){let e=new Date(2025,8,1);return Math.max(1,Math.floor((Date.now()-e.getTime())/864e5))}function Ss(e,t,a,s,o){let r=new Date,n=r.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}).toUpperCase(),i=r.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1});return`
        <header class="fh-mc-header">
            <div class="fh-mc-brand">
                <div class="fh-mc-logo">FH</div>
                <div class="fh-mc-wordmark">
                    <div class="fh-mc-wordmark-name">${m(e).toUpperCase()}</div>
                    <div class="fh-mc-wordmark-tag">OPERATIONS \xB7 COMMAND</div>
                </div>
            </div>
            ${o?'<div class="fh-mc-ops-paused">OPS PAUSED</div>':""}
            <div class="fh-mc-stats">
                ${bt("MISSIONS LIVE",t,"cyan")}
                ${bt("INTEL ALERTS",a,a>0?"red":"green",a>0)}
                ${bt("OPS DAY",s,"gold")}
                <div class="fh-mc-clock">
                    <div class="fh-mc-stat-lbl">${n}</div>
                    <div class="fh-mc-clock-num">${i}</div>
                </div>
            </div>
        </header>
    `}function bt(e,t,a,s=!1){return`
        <div class="fh-mc-stat" data-accent="${a}">
            <div class="fh-mc-stat-lbl">${e}</div>
            <div class="fh-mc-stat-val">
                ${s?'<span class="fh-mc-pulse"></span>':""}
                <span class="fh-mc-stat-num">${t}</span>
            </div>
        </div>
    `}function Es(e,t,a,s){if(!e.length)return"";let o=e.map(r=>{var k;let n=r.avatar_color||L,i=s._filter===r.person_id,d=s._filter&&!i,c=t.filter(E=>E.assigned_to===r.person_id).length,l=a.filter(E=>E.person_id===r.person_id).length,b=(r.code||r.name||"AGT").toUpperCase(),g=parseInt(((k=s._states(s._personEntityId(r.name)))==null?void 0:k.state)||"0"),y=r.completion_milestone||0,x=r.completion_streak||0,S=r.completion_threshold_pct||80,p=y>0&&x>0?`<div class="fh-mc-agent-streak" title="${S}% of daily chores for ${x} days running">
                   \u{1F525} ${x}d \xB7 ${S}%
               </div>`:"";return`
            <button class="fh-mc-agent ${i?"active":""} ${d?"dim":""}"
                    style="--agent-color:${n}"
                    data-act="filter" data-pid="${C(r.person_id)}">
                <div class="fh-mc-agent-head">
                    <div class="fh-mc-agent-avatar">
                        ${N(r.name)}
                        ${l>0?`<span class="fh-mc-agent-alert">${l}</span>`:""}
                    </div>
                    <div class="fh-mc-agent-id">
                        <div class="fh-mc-agent-code">${m(b)}</div>
                        <div class="fh-mc-agent-name">${m(r.name)}</div>
                    </div>
                </div>
                ${p}
                <div class="fh-mc-agent-foot">
                    <span class="fh-mc-agent-bal">${P(g)}<span class="fh-mc-agent-lbl">pts</span></span>
                    <span class="fh-mc-agent-open ${c>0?"live":""}">${c} OPEN</span>
                </div>
            </button>
        `}).join("");return`
        <section class="fh-mc-panel">
            <div class="fh-mc-panel-hdr">
                <span class="fh-mc-panel-lbl">// AGENT ROSTER</span>
                <span class="fh-mc-panel-sub">${e.length} ON DUTY</span>
            </div>
            <div class="fh-mc-roster">${o}</div>
        </section>
    `}function Cs(e,t){return e.length?`
        <section class="fh-mc-missions">
            ${ma("BREACH ALERT",`${e.length} CHORE${e.length>1?"S":""} PAST RESET`,"red",!0)}
            <div class="fh-row-list">
                ${e.map(a=>fa(a,t)).join("")}
            </div>
        </section>
    `:""}function zs(e,t,a){if(!e.length)return"";let s=new Map(t.map((n,i)=>[n,i])),o=new Map;for(let n of e){let i=n.category_label||"";o.has(i)||o.set(i,[]),o.get(i).push(n)}return[...o.keys()].sort((n,i)=>{if(n===""&&i!=="")return 1;if(n!==""&&i==="")return-1;let d=s.has(n)?s.get(n):1/0,c=s.has(i)?s.get(i):1/0;return d!==c?d-c:n.localeCompare(i)}).map(n=>{let i=o.get(n)||[];return`
            <section class="fh-mc-missions">
                ${n?ma(n.toUpperCase(),`${i.length} ACTIVE`,"gold"):""}
                <div class="fh-row-list">
                    ${i.map(c=>fa(c,a)).join("")}
                </div>
            </section>
        `}).join("")}function fa(e,t){var l;let a=String(e.chore_id||"").slice(0,4).toUpperCase(),s="";e.anyBreach?s=`<span class="fh-row-chip fh-row-chip--breach">BREACH \xB7 ${e.maxOverdue}D</span>`:e.days_until_reset===1&&(s='<span class="fh-row-chip fh-row-chip--reset">RESETS 1D</span>'),e.daily_penalty_firing&&(s+=`<span class="fh-row-chip fh-row-chip--firing">ACCRUING \u2212${e.penalty_points}/D</span>`);let o=s?`<div class="fh-row-chips">${s}</div>`:'<div class="fh-row-chips"></div>',r=e.description?`<div class="fh-row-desc">${m(e.description)}</div>`:"",n=e.penalty_enabled&&e.penalty_points>0?`<div class="fh-row-penalty">\u2212${e.penalty_points}pts if skipped</div>`:"",i=e.assignees.map(b=>{var x;let g=((x=t._pendingSubmit)==null?void 0:x.has(b.task_id))||b.status==="pending_approval"||b.isPhantom,y=["fh-mc-go-mini"];return b.isBreach&&y.push("breach"),g&&y.push("pending"),g?`
                <div class="${y.join(" ")}"
                     style="--mc-accent:${b.color}"
                     aria-disabled="true"
                     title="Pending approval \u2014 ${C(b.name)}">
                    <span class="fh-mc-go-code">${m(b.code)}</span>
                    <span class="fh-mc-go-check">\u23F1</span>
                </div>`:`
            <button class="${y.join(" ")}"
                    style="--mc-accent:${b.color}"
                    data-act="complete"
                    data-tid="${C(b.task_id)}"
                    data-pid="${C(b.person_id)}"
                    data-streak="${b.streak}"
                    data-milestone="${b.milestone}"
                    data-name="${C(e.name)}"
                    title="GO \u2014 ${C(b.name)}">
                <span class="fh-mc-go-code">${m(b.code)}</span>
                <span class="fh-mc-go-check">\u2713</span>
            </button>`}).join(""),d=((l=e.assignees[0])==null?void 0:l.color)||L;return`
        <div class="fh-row fh-row--mc${e.assignees.some(b=>{var g;return(g=t._flashing)==null?void 0:g.has(b.task_id)})?" flash":""}${e.anyBreach?" overdue":""}"
             style="--mc-accent:${d}">
            <div class="fh-row-icon">${oe(e.icon||"",d)}</div>
            <div class="fh-row-body">
                <div class="fh-row-kicker">OP-${a}</div>
                <div class="fh-row-name">${m(e.name)}</div>
                ${r}
                ${n}
            </div>
            ${o}
            <div class="fh-row-pts">+${e.points||0}</div>
            <div class="fh-mc-go-group">${i}</div>
        </div>
    `}function ma(e,t,a,s=!1){return`
        <div class="fh-mc-section-hdr" data-accent="${a}">
            ${s?'<span class="fh-mc-pulse"></span>':""}
            <span class="fh-mc-section-lbl">// ${m(e)}</span>
            <span class="fh-mc-section-rule"></span>
            ${t?`<span class="fh-mc-section-sub">${m(t)}</span>`:""}
        </div>
    `}function As(e){if(!e.length)return`
            <section class="fh-mc-panel fh-mc-panel--quiet">
                <div class="fh-mc-panel-hdr">
                    <span class="fh-mc-panel-lbl" data-accent="green">// INTEL ALERTS</span>
                    <span class="fh-mc-panel-sub">ALL CLEAR</span>
                </div>
            </section>
        `;let t=e.map(a=>{let s=a.person_color||L,o=(a.person_code||a.person_name||"?").slice(0,6).toUpperCase();return`
            <div class="fh-mc-intel-row" style="--mc-accent:${s}">
                <div class="fh-mc-intel-avatar">${N(a.person_name||"?")}</div>
                <div class="fh-mc-intel-body">
                    <div class="fh-mc-intel-code">${m(o)}</div>
                    <div class="fh-mc-intel-name">${m(a.chore_name||"Task")}</div>
                    <div class="fh-mc-intel-meta">+${a.points||0}pts</div>
                </div>
                <div class="fh-mc-intel-status">REVIEW</div>
            </div>
        `}).join("");return`
        <section class="fh-mc-panel">
            <div class="fh-mc-panel-hdr">
                <span class="fh-mc-panel-lbl" data-accent="red">// INTEL ALERTS</span>
                <span class="fh-mc-panel-sub">${e.length} AWAITING REVIEW</span>
            </div>
            <div class="fh-mc-intel-list">${t}</div>
            <div class="fh-mc-intel-note">REVIEW IN ADMIN PANEL</div>
        </section>
    `}function Ms(e){return e.length?`
        <section class="fh-mc-panel">
            <div class="fh-mc-panel-hdr">
                <span class="fh-mc-panel-lbl" data-accent="cyan">// OPEN OPS</span>
                <span class="fh-mc-panel-sub">UNCLAIMED \xB7 FIRST IN WINS</span>
            </div>
            <div class="fh-mc-ops-list">${e.map(a=>{let s=String(a.chore_id||a.task_id||"").slice(0,4).toUpperCase();return`
            <div class="fh-mc-ops-row">
                <div class="fh-mc-ops-kicker">${a.claim_mode==="multi_claim"?"MULTI":"FCFS"} \xB7 OP-${s}</div>
                <div class="fh-mc-ops-icon">${oe(a.icon||"","var(--mc-cyan)","22px")}</div>
                <div class="fh-mc-ops-body">
                    <div class="fh-mc-ops-name">${m(a.name)}</div>
                    ${a.category_label?`<div class="fh-mc-ops-cat">${m(a.category_label)}</div>`:""}
                </div>
                <div class="fh-mc-ops-pts">+${a.points||0}</div>
                <button class="fh-mc-ops-claim"
                        data-act="open-claim"
                        data-tid="${C(a.task_id)}"
                        data-name="${C(a.name)}">CLAIM</button>
            </div>
        `}).join("")}</div>
        </section>
    `:`
            <section class="fh-mc-panel fh-mc-panel--quiet">
                <div class="fh-mc-panel-hdr">
                    <span class="fh-mc-panel-lbl" data-accent="cyan">// OPEN OPS</span>
                    <span class="fh-mc-panel-sub">NONE LISTED</span>
                </div>
            </section>
        `}function Fs(e,t){let s=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1}),o=e.reduce((n,i)=>{let d=parseInt(i.lifetime_points||0);return n+(isNaN(d)?0:d)},0),r=(t.store_items||[]).length;return`
        <div class="fh-mc-status">
            <div class="fh-mc-status-row"><span class="fh-mc-status-dot ok"></span>LINK \xB7 STABLE</div>
            <div class="fh-mc-status-row">SYNC \xB7 ${s}</div>
            <div class="fh-mc-status-row">FAMILY \xB7 ${e.length} AGENTS \xB7 ${P(o)}PTS</div>
            <div class="fh-mc-status-row">STORE \xB7 ${r} REWARDS LIVE</div>
        </div>
    `}function ga(e){return`
        <div class="fh-celebration-overlay" data-act="dismiss-celebration">
            <div class="fh-celebration-badge">
                <div class="fh-celebration-star">\u2605</div>
                <div class="fh-celebration-title">MILESTONE!</div>
                <div class="fh-celebration-streak">\u25B2 ${e.streak}</div>
                <div class="fh-celebration-name">${m(e.name)}</div>
            </div>
        </div>
    `}var ut=O(()=>{Ne();V();W()});function et(e){let t=e._attrs("sensor.family_hub_maintenance_due"),a=t.overdue||0,s=t.due_this_week||0,o=t.due_next_week||0,r=t.items||[],n=`
        <div class="fh-maint-head">
            <div class="fh-maint-title">HOME CARE</div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-add-reminder">
                + Add reminder
            </button>
        </div>`;if(!r.length)return n+`
            <div class="fh-maint-empty">
                <div class="fh-maint-empty-icon">\u{1F3E0}</div>
                <div class="fh-maint-empty-text">All caught up!</div>
                <div class="fh-maint-empty-sub">Nothing due in the next 14 days.</div>
            </div>`;let i=`
        <div class="fh-maint-stat-strip">
            <div class="fh-maint-stat ${a?"fh-maint-stat--bad":""}">
                <span class="fh-maint-stat-num">${a}</span>
                <span class="fh-maint-stat-lbl">overdue</span>
            </div>
            <div class="fh-maint-stat-div"></div>
            <div class="fh-maint-stat">
                <span class="fh-maint-stat-num">${s}</span>
                <span class="fh-maint-stat-lbl">this week</span>
            </div>
            <div class="fh-maint-stat-div"></div>
            <div class="fh-maint-stat">
                <span class="fh-maint-stat-num">${o}</span>
                <span class="fh-maint-stat-lbl">next week</span>
            </div>
        </div>`,d=r.filter(y=>y.days_delta<0),c=r.filter(y=>y.days_delta>=0&&y.days_delta<=7),l=r.filter(y=>y.days_delta>7),g=[{label:"OVERDUE",items:d,cls:"overdue"},{label:"DUE THIS WEEK",items:c,cls:"this-week"},{label:"DUE NEXT WEEK",items:l,cls:"next-week"}].filter(y=>y.items.length).map(({label:y,items:x,cls:S})=>`
        <div class="fh-maint-section">
            <div class="fh-maint-section-hdr ${S}">
                ${y}
                <span class="fh-maint-section-count">${x.length}</span>
            </div>
            ${x.map(p=>Bs(p,e)).join("")}
        </div>`).join("");return n+i+g}function Bs(e,t){let a=t._expandedDescs.has(e.task_id),s=e.days_delta<0?"overdue":e.days_delta<=7?"soon":"ok";return`
        <div class="fh-maint-row ${s}">
            ${e.person_name?`<div class="fh-avatar" style="background:${e.person_color||L};width:26px;height:26px;font-size:.72rem;flex-shrink:0">${N(e.person_name)}</div>`:""}
            <div class="fh-maint-row-body">
                <div class="fh-maint-row-name">${m(e.name)}</div>
                ${a&&e.description?`<div class="fh-maint-row-desc">${m(e.description)}</div>`:""}
            </div>
            ${e.description?`<button class="fh-desc-btn" data-act="toggle-desc" data-id="${e.task_id}" title="Toggle description">?</button>`:""}
            <span class="fh-maint-days-badge ${s}">${Ht(e.days_delta)}</span>
        </div>`}var vt=O(()=>{V();W()});function ba(e){return`
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#30d158">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#30d158">SMART HOME</div>
            <div class="fh-home-coming-sub">Lights, climate &amp; more</div>
            <div class="fh-room-feature-list">
                ${tt("\u{1F4A1}","Lighting Control","Toggle and dim lights by room from the kitchen display")}
                ${tt("\u{1F321}\uFE0F","Climate","View and adjust the thermostat without leaving the kitchen")}
                ${tt("\u{1F4A7}","Irrigation","Run or skip watering zones on demand")}
                ${tt("\u{1F512}","Kid-safe Access","Only controls approved for the kitchen display are shown")}
            </div>
            <div class="fh-home-coming-badge">COMING SOON</div>
        </div>`}function tt(e,t,a){return`
        <div class="fh-room-feature">
            <div class="fh-room-feature-icon">${e}</div>
            <div class="fh-room-feature-body">
                <div class="fh-room-feature-name">${t}</div>
                <div class="fh-room-feature-desc">${a}</div>
            </div>
        </div>`}var ua=O(()=>{});function va(e){return`
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#ff9f0a">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05M1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-1.46-.74-2.87-2.22-4.28-1.13-1.07-2.84-1.93-4.43-2.43-.25-.08-.5-.12-.76-.12H8.5c-.25 0-.5.04-.76.12-1.59.5-3.3 1.36-4.43 2.43C1.83 13.13 1 14.54 1 16h15.03z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#ff9f0a">MEALS</div>
            <div class="fh-home-coming-sub">Weekly menu &amp; grocery list</div>
            <div class="fh-room-feature-list">
                ${at("\u{1F37D}\uFE0F","Tonight's Dinner","See what's on the menu right on the home strip")}
                ${at("\u{1F4C5}","Weekly Menu","Plan meals for the whole week in one place")}
                ${at("\u{1F6D2}","Grocery List","Items needed auto-populate from the week's plan")}
                ${at("\u{1F468}\u200D\u{1F373}","Recipes &amp; Notes","Tap a meal to see the recipe or prep notes")}
            </div>
            <div class="fh-home-coming-badge">COMING SOON</div>
        </div>`}function at(e,t,a){return`
        <div class="fh-room-feature">
            <div class="fh-room-feature-icon">${e}</div>
            <div class="fh-room-feature-body">
                <div class="fh-room-feature-name">${t}</div>
                <div class="fh-room-feature-desc">${a}</div>
            </div>
        </div>`}var xa=O(()=>{});function ya(e){return`
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#64d2ff">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#64d2ff">CALENDAR</div>
            <div class="fh-home-coming-sub">Today's schedule</div>
            <div class="fh-room-feature-list">
                ${ot("\u{1F4C5}","Today at a Glance","Morning-to-evening schedule on the home strip")}
                ${ot("\u{1F514}","Chore Reminders","Chore windows tied to events \u2014 'before school', 'after dinner'")}
                ${ot("\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}","Family View","Everyone's events in one scrollable view")}
                ${ot("\u{1F517}","Any HA Calendar","Connects to Local Calendar, CalDAV, or Google via Home Assistant")}
            </div>
            <div class="fh-home-coming-badge">COMING SOON \xB7 POWERS THE TODAY STRIP</div>
        </div>`}function ot(e,t,a){return`
        <div class="fh-room-feature">
            <div class="fh-room-feature-icon">${e}</div>
            <div class="fh-room-feature-body">
                <div class="fh-room-feature-name">${t}</div>
                <div class="fh-room-feature-desc">${a}</div>
            </div>
        </div>`}var wa=O(()=>{});function ka(e){return Ke.find(t=>t.id===e)||null}var Ke,st=O(()=>{ut();vt();ua();xa();wa();Ke=[{id:"chores",label:"CHORES HQ",sub:"Mission Control",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',accent:"var(--fh-accent)",status:"live",render:e=>ha(e),getStats(e){let a=(e._attrs("sensor.family_hub_claimable_tasks").all_tasks||[]).filter(r=>r.status==="pending").length,s=(e._attrs("sensor.family_hub_needs_attention").approval_queue||[]).length,o=[{label:"due today",value:a}];return s>0&&o.push({label:"need approval",value:s,accent:"var(--fh-warning)"}),o}},{id:"maintenance",label:"HOME CARE",sub:"Maintenance Tracker",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.78 15.3 19.78 21.3 21.89 19.14 15.89 13.14 13.78 15.3M17.5 10.1c-.39 0-.81-.05-1.14-.19L4.97 21.25 2.86 19.14l7.41-7.4-1.77-1.78-.72.7-1.45-1.41V12.1L5.62 12.82 2.08 9.28l.71-.72H5.62L4.18 7.11 7.78 3.5c.98-1 2.69-1 3.69 0L9.36 5.61l1.42 1.44-.72.71 1.77 1.78 2.37-2.38c-.14-.33-.2-.75-.2-1.16C14 3.79 15.79 2 18 2c.68 0 1.32.19 1.86.5L17.5 4.86l1.64 1.64L21.5 4.14C21.81 4.68 22 5.32 22 6c0 2.21-1.79 4-4 4-.18 0-.34-.03-.5-.05v.15z"/></svg>',accent:"#ff9f0a",status:"live",render:e=>et(e),getStats(e){let t=e._attrs("sensor.family_hub_maintenance_due"),a=t.overdue||0,s=t.due_this_week||0,o=[];return a>0&&o.push({label:"overdue",value:a,accent:"var(--fh-overdue)"}),o.push({label:"due this week",value:s}),o}},{id:"meals",label:"MEALS",sub:"Weekly menu & grocery list",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05M1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-1.46-.74-2.87-2.22-4.28-1.13-1.07-2.84-1.93-4.43-2.43-.25-.08-.5-.12-.76-.12H8.5c-.25 0-.5.04-.76.12-1.59.5-3.3 1.36-4.43 2.43C1.83 13.13 1 14.54 1 16h15.03z"/></svg>',accent:"#ff9f0a",status:"coming",preview:"Plan the week's meals, build a grocery list, and see tonight's dinner at a glance.",render:e=>va(e),getStats(){return[]}},{id:"smarthome",label:"SMART HOME",sub:"Lights, climate & more",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',accent:"#30d158",status:"coming",preview:"Kid-safe controls for lights, thermostat, and irrigation \u2014 right from the kitchen.",render:e=>ba(e),getStats(){return[]}},{id:"calendar",label:"CALENDAR",sub:"Today's schedule",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',accent:"#64d2ff",status:"coming",preview:"See today's events, upcoming reminders, and schedule \u2014 powered by your HA calendars.",render:e=>ya(e),getStats(){return[]}}]});function Oe(e,t,a,s,o="fh-btn-primary"){return`
      <div class="fh-modal">
        <div class="fh-modal-title">${e}</div>
        ${t}
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn ${o}" data-act="${s}">${a}</button>
        </div>
      </div>`}function Ve(e,t,a,s,o="fh-btn-primary"){return`
      <div class="fh-drawer">
        <div class="fh-drawer-hdr">
          <span class="fh-drawer-title">${e}</span>
          <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="close-modal" aria-label="Close">\u2715</button>
        </div>
        <div class="fh-drawer-body">${t}</div>
        <div class="fh-drawer-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn ${o}" data-act="${s}">${a}</button>
        </div>
      </div>`}function rt(e,t,a){e=Math.max(0,+e||0);let s=n=>Math.max(0,Math.round(n/5)*5),o=[],r=[];for(let n=0;n<5;n++)o.push(s(e*(+t[n]||0)/100)),r.push(s(e*(+a[n]||0)/100));return{gain:o,drop:r}}function _a(e){let t=e.type==="award";return Oe(`${t?"Award":"Deduct"} points \u2014 ${e.data.pname}`,`<div class="fh-field">
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
       <input type="hidden" id="m-pid"   value="${e.data.pid}">
       <input type="hidden" id="m-amode" value="${e.type}">`,t?"Award":"Deduct","ok-point-adjust",t?"fh-btn-success":"fh-btn-danger")}function $a(e){let t=parseInt(e.data.pts||"0"),a=[25,50,75].map(s=>{let o=Math.round(t*s/100);return`
          <button class="fh-btn fh-btn-primary" data-act="do-partial"
                  data-tid="${C(e.data.tid)}" data-frac="${s/100}"
                  style="flex:1;flex-direction:column;gap:2px;padding:12px 6px">
            <span style="font-size:1.1rem;font-weight:800">${s}%</span>
            <span style="font-size:.78rem;opacity:.85">${o} pts</span>
          </button>`}).join("");return`
      <div class="fh-modal">
        <div class="fh-modal-title">Partial credit \u2014 ${m(e.data.name)}</div>
        <p style="font-size:.85rem;color:var(--fh-text-sec);margin:0;line-height:1.5">
          "You tried, but didn't finish." Award part of the ${t} points and approve.
        </p>
        <div class="fh-row" style="gap:8px;margin-top:4px">${a}</div>
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
        </div>
      </div>`}function Ts(e){let t=new Map;for(let a of mt){let s=a.category||"Other";t.has(s)||t.set(s,[]),t.get(s).push(a)}return[...t.entries()].map(([a,s])=>`
        <div class="fh-icon-picker-cat-hdr">${m(a)}</div>
        <div class="fh-icon-picker-cat-grid">
          ${s.map(({key:o,label:r})=>`
            <button class="fh-icon-cell${e===o?" selected":""}"
                    data-act="pick-icon" data-icon="${o}" type="button"
                    title="${r}">
              ${oe(o,null,"28px")}
              <span class="fh-icon-cell-label">${r}</span>
            </button>`).join("")}
        </div>`).join("")}function Ds(e){let t=new Map;for(let a of Gt){let s=a.category||"Other";t.has(s)||t.set(s,[]),t.get(s).push(a)}return[...t.entries()].map(([a,s])=>`
        <div class="fh-icon-picker-cat-hdr">${m(a)}</div>
        <div class="fh-icon-picker-cat-grid">
          ${s.map(({key:o,label:r})=>`
            <button class="fh-icon-cell${e===o?" selected":""}"
                    data-act="pick-icon" data-icon="${o}" type="button"
                    title="${r}">
              ${oe(o,null,"28px")}
              <span class="fh-icon-cell-label">${r}</span>
            </button>`).join("")}
        </div>`).join("")}function Ps(e){let t=typeof e=="string"&&e.startsWith("data:image/"),a=t?`<div id="m-cicon-preview" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;padding:8px;border:1px solid var(--fh-border);border-radius:6px;background:var(--fh-surface)">
             <img src="${C(e)}" style="width:48px;height:48px;object-fit:contain;border-radius:4px" alt="">
             <span style="font-size:.85rem;color:var(--fh-text-sec)">Custom uploaded image</span>
             <button type="button" class="fh-btn fh-btn-ghost fh-btn-sm" data-act="clear-icon" style="margin-left:auto">Clear</button>
           </div>`:'<div id="m-cicon-preview"></div>';return`
      <div class="fh-field">
        <label class="fh-label">Icon (optional)</label>
        <input type="hidden" id="m-cicon" value="${C(e||"")}">
        <!-- Persistent file input \u2014 kept in the DOM so the change event fires reliably
             after the OS picker closes (avoids the GC race when the input is created
             on-the-fly and removed before the user picks a file). -->
        <input type="file" id="m-icon-upload" accept="image/png,image/jpeg,image/webp,image/gif" style="display:none">
        ${a}
        <div class="fh-icon-picker-grid">${Ds(t?"":e||"")}</div>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap">
          <button type="button" class="fh-btn fh-btn-ghost" data-act="upload-icon">
            \u{1F4F7} Upload image\u2026
          </button>
          <span style="font-size:.78rem;color:var(--fh-text-sec)">PNG/JPG, max ~256 KB</span>
        </div>
      </div>`}function Ls(e,t,a,s,o="details"){let r=e||{},n=r.recurrence||{},i=n.type||"daily",d=r.assigned_to||[],c=Ts(r.icon),l=mt.find(f=>f.key===r.icon),b=l?l.label:r.icon||"",g=Array.isArray(n.days_of_month)&&n.days_of_month.length?n.days_of_month:n.day_of_month?[n.day_of_month]:[1],y=i==="one_time"?"daily":i,S=`
      <div class="fh-chore-tabs">
        ${[{key:"details",label:"Details"},{key:"schedule",label:"Schedule"},{key:"rewards",label:"Points & Rewards"}].map(f=>`
          <button class="fh-chore-tab${o===f.key?" active":""}"
                  data-act="chore-tab" data-tab="${f.key}" type="button">
            ${f.label}
          </button>`).join("")}
      </div>`,p=(f,w)=>`
      <div class="fh-chore-tab-pane" data-tab="${f}"
           style="${o===f?"":"display:none"}">
        ${w}
      </div>`,k=new Map;for(let f of Qe){let w=f.category||"Other";k.has(w)||k.set(w,[]),k.get(w).push(f)}let E=[...k.entries()].map(([f,w])=>`
        <optgroup label="${C(f)}">
          ${w.map(v=>`<option value="${C(v.key)}">${m(v.name)}</option>`).join("")}
        </optgroup>`).join(""),h=p("details",`
        ${t?"":`
        <div class="fh-field fh-tpl-picker-field">
          <label class="fh-label">From template (optional)</label>
          <div class="fh-tpl-picker-row">
            <select class="fh-select" id="m-ctpl" style="flex:1">
              <option value="">\u2014 Start from scratch \u2014</option>
              ${E}
            </select>
            <button type="button" class="fh-btn fh-btn-ghost fh-tpl-apply-btn"
                    data-act="pick-template">Apply</button>
          </div>
        </div>`}
        <div class="fh-row">
          <div class="fh-field" style="flex:3">
            <label class="fh-label">Chore name *</label>
            <!-- No autofocus: the editor drawer animates in from off-screen, and
                 autofocus' scroll-into-view yanked the page to the top on open. -->
            <input class="fh-input" id="m-cname" type="text"
                   value="${C(r.name||"")}">
          </div>
          ${t?`
          <div class="fh-field" style="flex:1">
            <label class="fh-label">Active</label>
            <label class="fh-toggle" style="margin-top:8px" title="Uncheck to pause \u2014 no new tasks generate">
              <input type="checkbox" id="m-cactive" ${r.active!==!1?"checked":""}>
              <span class="fh-toggle-slider"></span>
            </label>
          </div>`:""}
        </div>
        <div class="fh-field">
          <label class="fh-label">Description (optional)</label>
          <textarea class="fh-input" id="m-cdesc" rows="3"
                    style="min-height:64px;resize:vertical;line-height:1.4"
                    placeholder="More detail\u2026">${m(r.description||"")}</textarea>
        </div>
        <div class="fh-row">
          <div class="fh-field">
            <label class="fh-label">Chore type</label>
            <select class="fh-select" id="m-ctype">
              ${Pe([{value:"assigned",label:"Assigned"},{value:"claimable",label:"Claimable (bonus)"},{value:"reminder",label:"Reminder"}],r.chore_type||"assigned")}
            </select>
          </div>
          <div class="fh-field">
            <label class="fh-label">Category</label>
            <select class="fh-select" id="m-clabel">
              <option value="">\u2014 None \u2014</option>
              ${s.map(f=>`<option value="${C(f)}" ${f===r.category_label?"selected":""}>${f}</option>`).join("")}
            </select>
          </div>
        </div>
        <details class="fh-icon-details" open>
          <summary class="fh-icon-summary">
            <span class="fh-icon-summary-title">Icon</span>
            <span class="fh-icon-selected-wrap" id="m-icon-selected">
              ${r.icon?`<span class="fh-icon-sel-icon" style="display:inline-flex;width:20px;height:20px;color:var(--fh-accent)">${oe(r.icon,null,"20px")}</span> <span class="fh-icon-sel-lbl">${m(b)}</span>`:'<span class="fh-icon-sel-none">Tap to choose</span>'}
            </span>
          </summary>
          <input type="hidden" id="m-cicon" value="${C(r.icon||"")}">
          <input class="fh-input fh-icon-search" id="m-icon-search" type="search"
                 placeholder="Search icons\u2026" autocomplete="off"
                 oninput="((el)=>{const q=el.value.toLowerCase().trim(),p=el.closest('.fh-chore-tab-pane');p.querySelectorAll('.fh-icon-picker-cat-hdr').forEach(h=>{const g=h.nextElementSibling;let n=0;g.querySelectorAll('.fh-icon-cell').forEach(b=>{const m=!q||(b.title+' '+b.dataset.icon).toLowerCase().includes(q);b.style.display=m?'':'none';if(m)n++;});h.style.display=n?'':'none';g.style.display=n?'':'none';});})(this)">
          <div class="fh-icon-tab-grid">${c}</div>
        </details>
        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Reminder</div>
        <div class="fh-field">
          <label class="fh-label">Reminder time (-1 = off)</label>
          <input class="fh-input" id="m-reminder-time" type="number" min="-1" max="2359"
                 placeholder="-1 (off)"
                 value="${r.reminder_time!==void 0?r.reminder_time:-1}">
          <div class="fh-field-help">
            HHMM \u2014 e.g. 1900 for 7:00 PM. One push per task instance when the time
            is reached and it's still pending.
          </div>
        </div>
    `),_=r.rotation_pool||[],z=r.assigned_to&&r.assigned_to[0]||_[r.rotation_index||0]||_[0],$=_.indexOf(z);$<0&&($=0);let F=_.length?_.slice($).concat(_.slice(0,$)):[],R=p("schedule",`
        <div class="fh-form-group-lbl">Who's doing it</div>
        <div class="fh-field">
          <div class="fh-checkbox-row" style="margin-bottom:4px">
            <input type="checkbox" id="m-everyone">
            <label for="m-everyone" style="font-size:.85rem;font-weight:600;cursor:pointer">Everyone</label>
          </div>
          ${Da(a,d,"m-assign-person")}
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Recurrence</div>
        <div class="fh-field">
          <select class="fh-select" id="m-crec">
            ${Pe([{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},{value:"monthly_on_date",label:"Monthly"}],y)}
          </select>
        </div>
        <div id="m-dayfilter-section" class="fh-field" style="display:none">
          <label class="fh-label">Fires on (leave empty = every day)</label>
          <div class="fh-weekday-row">
            ${ht(n.day_filter||[],"m-df-day")}
          </div>
          <div class="fh-field-help">Active that day only \u2014 if not done that day it's marked skipped.</div>
        </div>
        <div id="m-weekdays-section" class="fh-field" style="display:none">
          <label class="fh-label">Reset day(s)</label>
          <div class="fh-weekday-row">
            ${ht(n.weekdays||[],"m-wd-day")}
          </div>
          <div class="fh-field-help">Stays active until the next reset day, then it's skipped and a fresh one appears.</div>
        </div>
        <div id="m-dom-section" class="fh-field" style="display:none">
          <label class="fh-label">Day(s) of month</label>
          <input class="fh-input" id="m-dom-days" type="text"
                 placeholder="e.g. 1, 15" value="${C(g.join(", "))}">
          <div class="fh-field-help">One or more days 1\u201331, comma-separated \u2014 fires on each (e.g. the 1st and 15th).</div>
        </div>
        <div id="m-chore-expiry-section" class="fh-field" style="display:none">
          <label class="fh-label">Expires after (days)</label>
          <input class="fh-input" id="m-cexpiry" type="number" min="1"
                 value="${r.expires_after_days||""}">
        </div>
        <div id="m-claimable-section" class="fh-field" style="display:none">
          <label class="fh-label">Claim type</label>
          <select class="fh-select" id="m-csubtype">
            <option value="fcfs"        ${(r.claimable_subtype||"fcfs")==="fcfs"?"selected":""}>First come, first served</option>
            <option value="multi_claim" ${r.claimable_subtype==="multi_claim"?"selected":""}>Multi-claim (multiple helpers)</option>
          </select>
        </div>
        <div id="m-multi-claim-section" class="fh-field" style="display:none">
          <div class="fh-row">
            <div class="fh-field">
              <label class="fh-label">Max helpers</label>
              <input class="fh-input" id="m-max-claimants" type="number" min="2" max="20"
                     value="${r.max_claimants||2}">
            </div>
            <div class="fh-field">
              <label class="fh-label">Points mode</label>
              <select class="fh-select" id="m-points-mode">
                <option value="full"  ${(r.multi_claim_points_mode||"full")==="full"?"selected":""}>Full points each</option>
                <option value="split" ${r.multi_claim_points_mode==="split"?"selected":""}>Split evenly</option>
              </select>
            </div>
          </div>
        </div>

        <div id="m-rotation-section" class="fh-field" style="display:none">
          <div class="fh-divider"></div>
          <div class="fh-form-group-lbl">Rotation</div>
          <div class="fh-checkbox-row">
            <input type="checkbox" id="m-crot-enabled"
                   ${r.rotation_pool&&r.rotation_pool.length?"checked":""}>
            <label for="m-crot-enabled" style="font-size:.88rem">Cycle this chore through a pool of people</label>
          </div>
          <div id="m-rotation-config" class="fh-field" style="display:none">
            <label class="fh-label">Order \u2014 top is Current, the rest are Up Next</label>
            <input type="hidden" id="m-crot-pool-order" value="${C(F.join(","))}">
            <div id="m-crot-pool-widget" class="fh-rot-pool">
              ${wt(a,F)}
            </div>
            <label class="fh-label" style="margin-top:6px">Cadence</label>
            <select class="fh-select" id="m-crot-cadence">
              ${Pe([{value:"per_instance",label:"Per instance (advance each time it regenerates)"},{value:"weekly",label:"Weekly (a kid holds it all week, flips on the switch day)"}],r.rotation_cadence||"per_instance")}
            </select>
            <div id="m-crot-switch-day-wrap" class="fh-field" style="margin-top:6px;${r.rotation_cadence==="weekly"?"":"display:none"}">
              <label class="fh-label">Switch day</label>
              <select class="fh-select" id="m-crot-switch-day">
                ${Pe([{value:"0",label:"Monday"},{value:"1",label:"Tuesday"},{value:"2",label:"Wednesday"},{value:"3",label:"Thursday"},{value:"4",label:"Friday"},{value:"5",label:"Saturday"},{value:"6",label:"Sunday"}],String(r.rotation_switch_weekday??0))}
              </select>
            </div>
            <div class="fh-field-help">
              Use \u2191/\u2193 to set the order \u2014 the top person is Current; saving makes them
              the active holder, and the next firing advances to who's Up Next. The
              "Who's doing it" selection above is overridden while rotation is on, and
              inactive people are skipped automatically.
            </div>
          </div>
        </div>
    `),B=p("rewards",`
        <div class="fh-field">
          <label class="fh-label">Points awarded on completion</label>
          <input class="fh-input" id="m-cpts" type="number" min="0"
                 value="${r.points!==void 0?r.points:10}">
        </div>
        <div class="fh-checkbox-row">
          <input type="checkbox" id="m-cappr"
                 ${r.approval_required!==!1?"checked":""}>
          <label for="m-cappr" style="font-size:.88rem">Requires parent approval</label>
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Penalty for skipping</div>
        <div class="fh-checkbox-row">
          <input type="checkbox" id="m-cpenalty"
                 ${r.penalty_enabled?"checked":""}>
          <label for="m-cpenalty" style="font-size:.88rem">Apply penalty points if skipped</label>
        </div>
        <div id="m-penalty-pts-section" class="fh-field" style="display:none">
          <label class="fh-label">Penalty points</label>
          <input class="fh-input" id="m-cpenalty-pts" type="number" min="1"
                 value="${r.penalty_points||5}">
        </div>
        <div id="m-daily-threshold-section" class="fh-field" style="display:none">
          <label class="fh-label">Penalty grace (optional)</label>
          <input class="fh-input" id="m-daily-threshold" type="number" min="1"
                 placeholder="e.g. 3"
                 value="${r.daily_penalty_after_days||""}">
          <div class="fh-field-help">
            Daily chores: how many skips are allowed before the penalty starts \u2014 e.g. 3 means
            the first 2 misses are free, then every skip costs the penalty until it's done
            (resets when completed). Weekly/monthly chores: starts deducting the penalty each
            extra day it sits unfinished past this many days.
          </div>
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Streak bonus</div>
        <div class="fh-row">
          <div class="fh-field">
            <label class="fh-label">Streak milestone (0 = off)</label>
            <input class="fh-input" id="m-streak-milestone" type="number" min="0"
                   placeholder="e.g. 7" value="${r.streak_milestone||0}">
          </div>
          <div class="fh-field">
            <label class="fh-label">Bonus points awarded</label>
            <input class="fh-input" id="m-streak-bonus" type="number" min="0"
                   value="${r.streak_bonus_points||0}">
          </div>
        </div>
    `);return`
        ${t?`<input type="hidden" id="m-cid" value="${r.chore_id}">`:""}
        ${S}
        <div class="fh-chore-tab-panes">
          ${h}
          ${R}
          ${B}
        </div>`}function xt(e,t,a,s,o="details"){let n=t?`Edit \u2014 ${(e||{}).name}`:"Add chore",i=t?"ok-edit-chore":"ok-add-chore";return Ve(n,Ls(e,t,a,s,o),t?"Save changes":"Add chore",i)}function nt(e,t,a,s){let o=(e==null?void 0:e.name)||"",r=(e==null?void 0:e.description)||"",n=(e==null?void 0:e.dollar_value)??"",i=(e==null?void 0:e.scope)||"common",d=(e==null?void 0:e.person_ids)||[],c=(e==null?void 0:e.icon)||"",l=(e==null?void 0:e.category_label)||"",b=(e==null?void 0:e.max_per_period)??0,g=(e==null?void 0:e.period)||"week",y=(e==null?void 0:e.active)!==!1,x=!!(e!=null&&e.is_group_reward),S=(e==null?void 0:e.item_type)==="subscription",p=(e==null?void 0:e.subscription_period)||"monthly",k=s.map(w=>`<option value="${C(w)}" ${l===w?"selected":""}>${m(w)}</option>`).join(""),E=a.filter(w=>w.type!=="parent"),u={};for(let w of(e==null?void 0:e.contributors)||[])u[w.person_id]=w.share_pct||0;let h="((sel)=>{const r=sel.getRootNode();const grp=r.getElementById('m-sgroup');if(grp&&grp.checked)return;const pSec=r.getElementById('m-sperson-section');if(pSec)pSec.style.display=sel.value==='personal'?'':'none';})(this)",_="((cb)=>{const r=cb.getRootNode();const sec=r.getElementById('m-sgroup-section');const pSec=r.getElementById('m-sperson-section');if(sec)sec.style.display=cb.checked?'':'none';if(pSec)pSec.style.display=cb.checked?'none':'';})(this)",z="((btn)=>{const inputs=[...btn.closest('#m-sgroup-section').querySelectorAll('.m-scontrib')];if(!inputs.length)return;const each=Math.floor(100/inputs.length),rem=100-each*inputs.length;inputs.forEach((inp,i)=>{inp.value=each+(i===0?rem:0);});const tot=btn.closest('#m-sgroup-section').querySelector('#m-sgroup-total');if(tot){tot.textContent='Total: 100%';tot.style.color='var(--fh-success)';}})(this)",$="((inp)=>{const sec=inp.closest('#m-sgroup-section');if(!sec)return;const tot=[...sec.querySelectorAll('.m-scontrib')].reduce((s,i)=>s+(parseInt(i.value)||0),0);const el=sec.querySelector('#m-sgroup-total');if(el){el.textContent='Total: '+tot+'%';el.style.color=tot===100?'var(--fh-success)':tot>100?'var(--fh-overdue)':'var(--fh-text-sec)';}})(this)",F="((cb)=>{const r=cb.getRootNode();const s=r.getElementById('m-ssub-section');if(s)s.style.display=cb.checked?'':'none';})(this)",R=E.map(w=>{let v=u[w.person_id]??"";return`
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="flex:1;font-size:.85rem">${m(w.name)}</span>
            <input type="number" class="fh-input m-scontrib"
                   data-pid="${C(w.person_id)}"
                   style="width:72px;text-align:right"
                   min="0" max="100" step="1" value="${v}"
                   oninput="${$}">
            <span style="font-size:.85rem">%</span>
          </div>`}).join(""),B=E.reduce((w,v)=>w+(u[v.person_id]||0),0),f=B===100?"var(--fh-success)":B>100?"var(--fh-overdue)":"var(--fh-text-sec)";return`
      ${t?`<input type="hidden" id="m-eiid" value="${e.item_id}">`:""}
      <div class="fh-field">
        <label class="fh-label">Item name *</label>
        <input class="fh-input" id="m-sname" type="text" value="${C(o)}"${t?"":" autofocus"}>
      </div>
      <div class="fh-field">
        <label class="fh-label">Description (optional)</label>
        <input class="fh-input" id="m-sdesc" type="text" value="${C(r)}">
      </div>
      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Dollar value *</label>
          <input class="fh-input" id="m-sdollar" type="number" min="0.01"
                 step="0.01" value="${n}" placeholder="e.g. 5.00">
        </div>
        <div class="fh-field">
          <label class="fh-label">Scope</label>
          <select class="fh-select" id="m-sscope" oninput="${h}">
            <option value="common"   ${i==="common"?"selected":""}>All kids</option>
            <option value="personal" ${i==="personal"?"selected":""}>Specific people</option>
          </select>
        </div>
      </div>
      <div id="m-sperson-section" class="fh-field" style="${i==="personal"&&!x?"":"display:none"}">
        <label class="fh-label">Who can see this reward?</label>
        ${Da(a,d,"m-sp-person")}
      </div>

      <!-- Group reward toggle -->
      <div class="fh-field" style="border-top:1px solid var(--fh-border);padding-top:10px;margin-top:4px">
        <label class="fh-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <label class="fh-toggle">
            <input type="checkbox" id="m-sgroup" ${x?"checked":""} oninput="${_}">
            <span class="fh-toggle-slider"></span>
          </label>
          \u{1F91D} Group reward \u2014 kids chip in together
        </label>
      </div>
      <div id="m-sgroup-section" class="fh-field" style="${x?"":"display:none"}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <label class="fh-label" style="margin:0">Contributors &amp; share %</label>
          <button type="button" class="fh-btn fh-btn-ghost fh-btn-sm"
                  onclick="${z}">Equal split</button>
        </div>
        ${E.length?R+`<div id="m-sgroup-total" style="font-size:.8rem;color:${f}">Total: ${B}%</div>`:'<span style="font-size:.82rem;color:var(--fh-text-sec)">No kids found \u2014 add people first.</span>'}
      </div>

      <!-- v0.6.5: subscription type toggle + period (anchor set at subscription-approval time) -->
      <div class="fh-field" style="border-top:1px solid var(--fh-border);padding-top:10px;margin-top:4px">
        <label class="fh-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <label class="fh-toggle">
            <input type="checkbox" id="m-ssubtype" ${S?"checked":""} oninput="${F}">
            <span class="fh-toggle-slider"></span>
          </label>
          Subscription \u2014 recurring deduction
        </label>
      </div>
      <div id="m-ssub-section" ${S?"":'style="display:none"'}>
        <div class="fh-field">
          <label class="fh-label">Subscription period</label>
          <select class="fh-select" id="m-ssperiod">
            <option value="daily"     ${p==="daily"?"selected":""}>Daily</option>
            <option value="weekly"    ${p==="weekly"?"selected":""}>Weekly</option>
            <option value="monthly"   ${p==="monthly"?"selected":""}>Monthly</option>
            <option value="quarterly" ${p==="quarterly"?"selected":""}>Quarterly</option>
            <option value="biannual"  ${p==="biannual"?"selected":""}>Bi-annual</option>
            <option value="annual"    ${p==="annual"?"selected":""}>Annual</option>
          </select>
          <div class="fh-field-help">The renewal anchor day is set by the parent when approving a child's subscription request.</div>
        </div>
      </div>

      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Category</label>
          <select class="fh-select" id="m-scat">
            <option value="" ${l?"":"selected"}>(none)</option>
            ${k}
          </select>
        </div>
        <div class="fh-field">
          <label class="fh-label">Active</label>
          <label class="fh-toggle" style="margin-top:10px">
            <input type="checkbox" id="m-sactive" ${y?"checked":""}>
            <span class="fh-toggle-slider"></span>
          </label>
        </div>
      </div>
      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Max per period (0 = unlimited)</label>
          <input class="fh-input" id="m-smaxperiod" type="number"
                 min="0" step="1" value="${b}">
        </div>
        <div class="fh-field">
          <label class="fh-label">Period</label>
          <select class="fh-select" id="m-speriod">
            <option value="day"   ${g==="day"?"selected":""}>Day</option>
            <option value="week"  ${g==="week"?"selected":""}>Week</option>
            <option value="month" ${g==="month"?"selected":""}>Month</option>
          </select>
        </div>
      </div>
      ${Ps(c)}`}function Sa(e,t=[]){return Oe("Add reward item",nt(null,!1,e,t),"Add reward","ok-add-store-item")}function Ea(e,t,a=[]){return Oe(`Edit \u2014 ${m(e.name)}`,nt(e,!0,t,a),"Save changes","ok-edit-store-item")}function Ca(){return Oe("Add person",`<div class="fh-field">
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
                  value="${L}" style="height:42px;padding:4px">
         </div>
       </div>`,"Add person","ok-add-person")}function za(e){let a=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d,c)=>`<option value="${c}" ${e.allowanceWday===c?"selected":""}>${d}</option>`).join(""),s=Array.from({length:28},(d,c)=>c+1).map(d=>`<option value="${d}" ${e.allowanceMday===d?"selected":""}>${d}</option>`).join(""),o=[{value:"classic",label:"Classic",accent:e.pcolor||"#4A90E2"},{value:"engineer",label:"Engineer",accent:"#E0B84C"},{value:"baker",label:"Baker",accent:"#8B3A2A"},{value:"dinos",label:"Dinos",accent:"#8B6A20"},{value:"hp",label:"Harry Potter",accent:"#1F4F3C"},{value:"dbz",label:"Dragon Ball Z",accent:"#FF6A1A"}],r=o.find(d=>d.value===e.theme)||o[0],n=o.map(d=>`<option value="${d.value}" ${e.theme===d.value?"selected":""}>${d.label}</option>`).join(""),i=(d,c,l)=>`
      <div class="fh-modal-section">
        <div class="fh-modal-section-hdr">
          <span class="fh-modal-section-lbl">${m(d)}</span>
          ${c?`<span class="fh-modal-section-sub">${m(c)}</span>`:""}
        </div>
        ${l}
      </div>`;return Ve(`Edit \u2014 ${e.pname}`,`${i("Identity","name, codename, avatar color",`
           <div class="fh-field">
             <label class="fh-label">Name *</label>
             <input class="fh-input" id="m-pname" type="text" value="${C(e.pname)}" autofocus>
           </div>
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Codename</label>
               <input class="fh-input" id="m-pcode" type="text"
                      value="${C(e.code||"")}"
                      placeholder="e.g. T-REX, SNITCH, KODIAK"
                      style="text-transform:uppercase">
               <div class="fh-field-help">Shown on Mission Control mini buttons and agent cards.</div>
             </div>
             <div class="fh-field">
               <label class="fh-label">Type</label>
               <select class="fh-select" id="m-ptype">
                 <option value="kid"    ${e.ptype==="kid"?"selected":""}>Kid</option>
                 <option value="parent" ${e.ptype==="parent"?"selected":""}>Parent</option>
               </select>
             </div>
           </div>
           <div class="fh-field">
             <label class="fh-label">Avatar color</label>
             <input class="fh-input" id="m-pcolor" type="color"
                    value="${e.pcolor}" style="height:42px;padding:4px;width:100%">
             <div class="fh-field-help">Used for chips, accents, and the Mission Control row tint.</div>
           </div>
        `)}

        ${i("Theme","personal-page look & feel",`
           <div class="fh-field">
             <label class="fh-label">Theme</label>
             <div class="fh-theme-pick">
               <span class="fh-theme-swatch" style="background:${r.accent}"></span>
               <select class="fh-select" id="m-ptheme" style="flex:1">${n}</select>
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
               <input type="checkbox" id="m-pchildmode" ${e.childMode?"checked":""}>
               <span class="fh-toggle-slider"></span>
             </label>
           </div>
        `)}

        ${i("Allowance","scheduled point payouts",`
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Amount (pts, 0 = off)</label>
               <input class="fh-input" id="m-allowance-pts" type="number" min="0"
                      value="${e.allowancePts}" style="width:100%">
             </div>
             <div class="fh-field">
               <label class="fh-label">Schedule</label>
               <select class="fh-select" id="m-allowance-schedule">
                 <option value="weekly"   ${e.allowanceSched==="weekly"?"selected":""}>Weekly</option>
                 <option value="biweekly" ${e.allowanceSched==="biweekly"?"selected":""}>Bi-weekly</option>
                 <option value="monthly"  ${e.allowanceSched==="monthly"?"selected":""}>Monthly</option>
               </select>
             </div>
           </div>
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Day of week (weekly / bi-weekly)</label>
               <select class="fh-select" id="m-allowance-weekday">${a}</select>
             </div>
             <div class="fh-field">
               <label class="fh-label">Day of month (monthly)</label>
               <select class="fh-select" id="m-allowance-monthday">${s}</select>
             </div>
           </div>
        `)}

        ${i("Success streak","bonus for consistent days",`
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Threshold (% of due chores done)</label>
               <input class="fh-input" id="m-completion-threshold" type="number"
                      min="1" max="100" value="${e.completionThreshold??80}">
             </div>
             <div class="fh-field">
               <label class="fh-label">Milestone (days, 0 = off)</label>
               <input class="fh-input" id="m-completion-milestone" type="number"
                      min="0" value="${e.completionMilestone??7}">
             </div>
           </div>
           <div class="fh-field">
             <label class="fh-label">Bonus points at each milestone</label>
             <input class="fh-input" id="m-completion-bonus" type="number"
                    min="0" value="${e.completionBonusPoints??50}">
             <div class="fh-field-help">
               Awards bonus points when this person completes at least the threshold
               share of their daily assigned chores for N consecutive days.
               Rest days (no chores due) and excused chores don't count either way.
               Set milestone to 0 to disable.
             </div>
           </div>
        `)}

        ${i("Notifications","push targets for approvals & reminders",`
           <div class="fh-field">
             <label class="fh-label">Notify target (HA service name, blank = off)</label>
             <input class="fh-input" id="m-pnotify" type="text"
                    value="${C(e.notifyTarget||"")}"
                    placeholder="e.g. mobile_app_jackson_iphone">
             <div class="fh-field-help">HA <code>notify.*</code> service name. Works with the Companion App or Alexa Media.</div>
           </div>
        `)}

        <div class="fh-field-help">Rank tuning has moved to <strong>Settings \u2192 Ranks</strong>.</div>

        <input type="hidden" id="m-pid" value="${e.pid}">`,"Save","ok-edit-person")}function Aa(e){return`
      <div class="fh-modal">
        <div class="fh-modal-title">Remove ${m(e.pname)}?</div>
        <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0;line-height:1.5">
          This will deactivate <strong>${m(e.pname)}</strong> and remove their pending tasks.
          Historical data and point history are preserved.
          This cannot be undone from the card.
        </p>
        <input type="hidden" id="m-rpid" value="${e.pid}">
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn fh-btn-danger" data-act="ok-remove-person">
            Remove ${m(e.pname)}
          </button>
        </div>
      </div>`}function Ma(e){return`
      <div class="fh-modal">
        <div class="fh-modal-title">Permanently delete ${m(e.pname)}?</div>
        <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0;line-height:1.5">
          This permanently removes <strong>${m(e.pname)}</strong> and purges ALL of their data \u2014
          task instances, redemptions, subscriptions, group contributions, and activity-log entries.
          <strong style="color:var(--fh-overdue)">This cannot be undone.</strong>
          To keep them recoverable (e.g. away at camp), use Reactivate instead.
        </p>
        <input type="hidden" id="m-hdpid" value="${e.pid}">
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn fh-btn-danger" data-act="ok-hard-delete-person">
            Delete permanently
          </button>
        </div>
      </div>`}function Fa(e,t,a,s){let r=a.filter(n=>n.chore_type==="assigned").map(n=>{let i=s[n.chore_id]||0;return`
          <div class="fh-point-row" style="gap:8px">
            <span style="flex:1;font-size:.88rem;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                  title="${C(n.name)}">${m(n.name)}</span>
            <input class="fh-input" id="m-streak-${C(n.chore_id)}" type="number" min="0"
                   value="${i}" style="width:64px;text-align:center">
            <button class="fh-btn fh-btn-primary fh-btn-sm"
                    data-act="set-streak" data-pid="${e}" data-cid="${C(n.chore_id)}">
              Set
            </button>
          </div>`}).join("")||'<div class="fh-empty">No assigned chores.</div>';return`
      <div class="fh-modal">
        <div class="fh-modal-title">\u{1F525} Edit streaks \u2014 ${m(t)}</div>
        <p style="font-size:.8rem;color:var(--fh-text-sec);margin:0 0 8px">
          Enter the correct streak count and press Set. Changes save immediately.
        </p>
        <div style="display:flex;flex-direction:column;gap:6px">${r}</div>
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Done</button>
        </div>
      </div>`}function Ba(e){return Ve("Edit settings",`<div class="fh-field">
         <label class="fh-label">Family name</label>
         <input class="fh-input" id="m-fname" type="text"
                value="${C(e.fname)}" autofocus>
       </div>
       <div class="fh-field">
         <label class="fh-label">Points per dollar</label>
         <input class="fh-input" id="m-ppd" type="number" min="1" value="${e.ppd}">
       </div>
       <div class="fh-field">
         <label class="fh-label">Penalty alert time (-1 = off, e.g. 800 for 8:00 AM)</label>
         <input class="fh-input" id="m-alert-time" type="number" min="-1" max="2359"
                placeholder="800" value="${e.penaltyAlertTime!==void 0?e.penaltyAlertTime:800}">
       </div>
       <div class="fh-field-help">Rank evaluation &amp; reward-per-rank settings now live in the <strong>Ranks</strong> panel.</div>`,"Save","ok-edit-settings")}function yt(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=(t.people||[]).filter(p=>p.type==="kid"),s=e._ranksTab||"global",o=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],r=`
      <div class="fh-drawer-tabs">
        <button class="fh-drawer-tab ${s==="global"?"active":""}"
                data-act="ranks-tab" data-tab="global">Global</button>
        ${a.map(p=>`
          <button class="fh-drawer-tab ${s===p.person_id?"active":""}"
                  data-act="ranks-tab" data-tab="${C(p.person_id)}">${m(p.name)}</button>`).join("")}
      </div>`;if(s==="global"){let p=t.rank_eval_weekday??0,k=t.rank_default_cap??100,E=t.rank_default_drop_pct??60,u=t.rank_default_gain_pct??80,h=t.rank_ppd_ladder||[3,3.5,4,4.5,5],_=o.map((F,R)=>`<option value="${R}" ${p==R?"selected":""}>${F}</option>`).join(""),z=h.map((F,R)=>`
          <div class="fh-row" style="gap:6px;align-items:center">
            <span style="font-size:.8rem;color:var(--fh-text-sec);width:54px;flex-shrink:0">Rank ${R}</span>
            <input class="fh-input fh-ad-rank-ladder-input" type="number"
                   min="0.1" max="100" step="0.1" data-rank-idx="${R}"
                   value="${F}" style="flex:1">
            <span style="font-size:.8rem;color:var(--fh-text-sec)">\xA2/pt</span>
          </div>`).join(""),$=`
          ${r}
          <div class="fh-field">
            <label class="fh-label">Evaluate ranks on</label>
            <select class="fh-select" id="m-rank-weekday">${_}</select>
          </div>
          <div class="fh-field">
            <label class="fh-label">Default weekly capacity (pts)</label>
            <input class="fh-input" id="m-rank-cap" type="number" min="0" value="${k}">
          </div>
          <div class="fh-row">
            <div class="fh-field">
              <label class="fh-label">Default drop &lt; %</label>
              <input class="fh-input" id="m-rank-drop" type="number" min="0" max="100" value="${E}">
            </div>
            <div class="fh-field">
              <label class="fh-label">Default gain \u2265 %</label>
              <input class="fh-input" id="m-rank-gain" type="number" min="0" max="100" value="${u}">
            </div>
          </div>
          <div class="fh-field-help">Fallback for any kid without their own per-rank curve (% of the default capacity).</div>
          <div class="fh-divider"></div>
          <div class="fh-field">
            <label class="fh-label">Reward value per rank (\xA2/point)</label>
            <div class="fh-field-help" style="margin-bottom:6px">
              Higher rank \u2192 more cents per point \u2192 fewer points to redeem rewards.
            </div>
            ${z}
          </div>`;return Ve("Ranks",$,"Save","save-ranks-global")}let n=a.find(p=>p.person_id===s);if(!n)return e._ranksTab="global",yt(e);let i=Te(n.theme_key||"classic").ranks,d=n.rank_index??0,c=n.rank_curve||{},l=c.cap??100,b=Array.isArray(c.gain_pcts)&&c.gain_pcts.length===5?c.gain_pcts:Rs.slice(),g=Array.isArray(c.drop_pcts)&&c.drop_pcts.length===5?c.drop_pcts:Is.slice(),y=rt(l,b,g),x=i.map((p,k)=>{let E=k===i.length-1,u=k===0;return`
          <div class="fh-rank-grid-row">
            <span class="fh-rank-grid-name">${k===d?"\u25B6 ":""}${m(p.name)}</span>
            <span class="fh-rank-grid-cell">
              <input class="fh-input" id="m-drop-pct-${k}" type="number" min="0" max="100"
                     value="${u?"":g[k]}" ${u?"disabled placeholder='\u2014'":""}>
              <span class="fh-rank-grid-pts" id="m-drop-pts-${k}">${u?"\u2014":y.drop[k]}</span>
            </span>
            <span class="fh-rank-grid-cell">
              <input class="fh-input" id="m-gain-pct-${k}" type="number" min="0" max="100"
                     value="${E?"":b[k]}" ${E?"disabled placeholder='\u2014'":""}>
              <span class="fh-rank-grid-pts" id="m-gain-pts-${k}">${E?"\u2014":y.gain[k]}</span>
            </span>
          </div>`}).join(""),S=`
      ${r}
      <div class="fh-field-help">
        Theme <strong>${m(n.theme_key||"classic")}</strong> \xB7 currently
        <strong>${m(G(d,i).name)}</strong>
      </div>
      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Weekly capacity (pts)</label>
          <input class="fh-input" id="m-curve-cap" type="number" min="0" value="${l}">
        </div>
        <div class="fh-field">
          <label class="fh-label">Rank index (override, 0\u20134)</label>
          <input class="fh-input" id="m-rank-idx" type="number" min="0" max="4" value="${d}">
        </div>
      </div>
      <div class="fh-field-help">
        Each band is a % of weekly capacity \u2014 threshold points = % \xD7 capacity.
        Edit the percentages; the grey number is the resulting points.
      </div>

      <div class="fh-modal-section">
        <div class="fh-modal-section-hdr"><span class="fh-modal-section-lbl">Per-rank bands</span></div>
        <div class="fh-rank-grid-row" style="margin-bottom:4px">
          <span class="fh-rank-grid-hdr">Rank</span>
          <span class="fh-rank-grid-hdr">Drop &lt; %</span>
          <span class="fh-rank-grid-hdr">Gain \u2265 %</span>
        </div>
        <div class="fh-rank-grid">${x}</div>
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="ranks-preview"
                style="margin-top:8px">\u21BB Recompute points</button>
        <div class="fh-field-help" style="margin-top:6px">
          \u25B6 marks the current rank. Bottom rung can't fall; top rung can't climb.
        </div>
      </div>

      <input type="hidden" id="m-rank-pid" value="${C(n.person_id)}">`;return Ve(`Ranks \u2014 ${m(n.name)}`,S,"Save","save-ranks-kid")}function Ra(e,t){let a=t.filter(o=>o.type==="kid");if(!a.length)return`
          <div class="fh-modal">
            <div class="fh-modal-title">Claim \u2014 ${m(e.data.name)}</div>
            <p class="fh-empty">No eligible people to claim this chore.</p>
            <div class="fh-modal-footer">
              <button class="fh-btn fh-btn-ghost" data-act="close-modal">Close</button>
            </div>
          </div>`;let s=a.map(o=>{let r=o.avatar_color||L;return`
          <button class="fh-claim-tile" data-act="ok-claim"
                  data-tid="${e.data.tid}" data-pid="${o.person_id}"
                  style="--tile-color:${r}">
            <div class="fh-claim-tile-avatar" style="background:${r}">${N(o.name)}</div>
            ${o.code?`<div class="fh-claim-tile-code">${m(o.code)}</div>`:""}
            <div class="fh-claim-tile-name">${m(o.name)}</div>
          </button>`}).join("");return`
      <div class="fh-modal">
        <div class="fh-modal-title">Claim \u2014 ${m(e.data.name)}</div>
        <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0 0 12px;line-height:1.4">
          Who's claiming this chore?
        </p>
        <div class="fh-claim-grid">${s}</div>
        <input type="hidden" id="m-cltid" value="${e.data.tid}">
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
        </div>
      </div>`}function Ia(e,t){return Oe("Add personal reminder",`<div class="fh-field">
         <label class="fh-label">Reminder name *</label>
         <input class="fh-input" id="m-rname" type="text" autofocus
                placeholder="e.g. Take vitamins, Feed the dog">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Who?</label>
           <select class="fh-select" id="m-rperson">
             ${t.map(a=>{var s;return`<option value="${a.person_id}"
                          ${((s=e.data)==null?void 0:s.pid)===a.person_id?"selected":""}>${m(a.name)}</option>`}).join("")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Recurrence</label>
           <select class="fh-select" id="m-rrec">
             ${Pe([{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},{value:"every_n_days",label:"Every N days"},{value:"monthly_on_date",label:"Monthly"}],"daily")}
           </select>
         </div>
       </div>`,"Add","ok-add-reminder")}function wt(e,t){let a=new Map(e.map(d=>[d.person_id,d])),s=t.map(d=>a.get(d)).filter(Boolean),o=new Set(t),r=e.filter(d=>!o.has(d.person_id)),n=s.length?s.map((d,c)=>{let l=d.avatar_color||L,b=c===0?"disabled":"",g=c===s.length-1?"disabled":"";return`${c===0?'<div class="fh-rot-section-hdr">Current</div>':c===1?'<div class="fh-rot-section-hdr">Up Next</div>':""}
              <div class="fh-rot-item${c===0?" fh-rot-item--current":""}" data-pid="${C(d.person_id)}" style="--chip-color:${l}">
                <span class="fh-avatar" style="background:${l};width:22px;height:22px;font-size:.7rem">${N(d.name)}</span>
                <span class="fh-rot-name">${m(d.name)}</span>
                <button type="button" class="fh-rot-ctrl" data-act="rot-pool-up"
                        data-pid="${C(d.person_id)}" ${b} aria-label="Move up">\u2191</button>
                <button type="button" class="fh-rot-ctrl" data-act="rot-pool-down"
                        data-pid="${C(d.person_id)}" ${g} aria-label="Move down">\u2193</button>
                <button type="button" class="fh-rot-ctrl fh-rot-ctrl-remove"
                        data-act="rot-pool-remove" data-pid="${C(d.person_id)}"
                        aria-label="Remove from pool">\xD7</button>
              </div>`}).join(""):'<div class="fh-rot-empty">No one in the pool yet \u2014 add a kid below.</div>',i=r.length?r.map(d=>{let c=d.avatar_color||L;return`
              <button type="button" class="fh-rot-add"
                      data-act="rot-pool-add" data-pid="${C(d.person_id)}"
                      style="--chip-color:${c}">
                <span class="fh-avatar" style="background:${c};width:18px;height:18px;font-size:.6rem">${N(d.name)}</span>
                + ${m(d.name)}
              </button>`}).join(""):'<div class="fh-rot-add-empty">Everyone is in the pool.</div>';return`
      <div class="fh-rot-ordered">${n}</div>
      <div class="fh-rot-available-lbl">Add to pool:</div>
      <div class="fh-rot-available">${i}</div>`}function Ta(e,t,a,s){let o=Math.min(a,s),r=`
        <div class="fh-field">
            <label>Chip in toward <strong>${m((e==null?void 0:e.name)||"reward")}</strong></label>
            <div style="font-size:.8rem;color:var(--fh-text-sec);margin-bottom:8px">
                Your share remaining: ${s} pts \xB7 Your balance: ${a} pts
            </div>
            <input id="m-chipin-pts" class="fh-input" type="number"
                   min="1" max="${o}" value="${o}"
                   style="width:120px">
            <span style="font-size:.85rem;color:var(--fh-text-sec)">pts</span>
        </div>
        <input type="hidden" id="m-chipin-iid" value="${C((e==null?void 0:e.item_id)||"")}">
        <input type="hidden" id="m-chipin-pid" value="${C(t)}">`;return Oe("Chip In \u2014 Group Reward",r,"Chip In","ok-chip-in")}function Da(e,t,a){return e.length?`<div class="fh-person-cb-list">
      ${e.map(s=>{let o=(t||[]).includes(s.person_id),r=s.avatar_color||L;return`<label class="fh-person-cb-chip ${o?"checked":""}"
                         style="--chip-color:${r}">
            <input type="checkbox" class="${a}"
                   value="${s.person_id}" ${o?"checked":""}>
            <span class="fh-avatar" style="background:${r};width:18px;height:18px;font-size:.6rem">
              ${N(s.name)}
            </span>
            ${m(s.name)}
          </label>`}).join("")}
    </div>`:'<span style="font-size:.82rem;color:var(--fh-text-sec)">No people found.</span>'}var Rs,Is,it=O(()=>{W();W();V();Ne();qe();Re();Rs=[50,60,75,95,0],Is=[0,40,55,75,95]});function Os(e){if(!e)return"";let t=/^(\d{4})-(\d{2})-(\d{2})/.exec(e);return t?new Date(+t[1],+t[2]-1,+t[3]).toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric"}):e}function Ns(e){var t;switch((t=e.recurrence)==null?void 0:t.type){case"daily":case"every_n_days":return"daily";case"weekly":case"every_n_weeks":return"weekly";case"monthly_on_date":return"monthly";case"one_time":return"one_time";default:return"other"}}function Oa(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=t.people||[],s=t.approval_queue||[],o=t.redemption_queue||[],r=t.group_proposal_queue||[],n=t.subscription_cancel_queue||[],i=t.active_chores||[],d=t.all_chores||i,c=t.category_labels||[],l=t.family_name||"Family Hub",b=t.store_items||[],y=[{id:"today",label:"Today",icon:"\u25D0",badge:s.length+o.length+r.length+n.length},{id:"family",label:"Family",icon:"\u25CD",badge:0},{id:"tasks",label:"Chores",icon:"\u25C9",badge:0},{id:"rewards",label:"Rewards",icon:"\u25C8",badge:0},{id:"history",label:"History",icon:"\u25D1",badge:0},{id:"settings",label:"Settings",icon:"\u25CE",badge:0}],x=e._adminSec,S="";switch(x){case"today":S=Pa(s,o,r,n,t);break;case"family":S=Hs(a,t,e);break;case"tasks":S=js(d,a,c,e);break;case"rewards":S=Ys(b,a,c,e);break;case"history":S=Zs(t,e);break;case"settings":S=er(t,a,e);break;default:S=Pa(s,o,r,[],t)}let p={today:{crumb:"OVERVIEW",title:"Today",actions:`<button class="fh-ad-btn fh-ad-btn--ghost" data-act="export-backup">Export backup</button>
                              <button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${j.plus} Add chore</button>`},family:{crumb:"PEOPLE",title:"Family",actions:`<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-person">${j.person} Add person</button>`},tasks:{crumb:"CHORES",title:"Chores",actions:`<button class="fh-ad-btn fh-ad-btn--ghost" data-act="print-chore-list" title="Open a printable chore list in a new tab">${j.print} Print</button>
                              <button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${j.plus} Add chore</button>`},rewards:{crumb:"REWARDS",title:"Rewards",actions:`<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-store-item">${j.plus} Add reward</button>`},history:{crumb:"ACTIVITY",title:"History",actions:""},settings:{crumb:"CONFIGURATION",title:"Settings",actions:""}},k=p[x]||p.today,E=y.map(h=>`
      <div class="fh-ad-nav-item ${x===h.id?"active":""}"
           data-act="admin-sec" data-sec="${h.id}">
        <span class="fh-ad-nav-icon">${h.icon}</span>
        <span class="fh-ad-nav-label">${h.label}</span>
        ${h.badge>0?`<span class="fh-ad-nav-badge">${h.badge}</span>`:""}
      </div>`).join(""),u=y.map(h=>`
      <div class="fh-ad-bottom-item ${x===h.id?"active":""}"
           data-act="admin-sec" data-sec="${h.id}">
        <span class="fh-ad-bottom-icon">${h.icon}</span>
        <span class="fh-ad-bottom-label">${h.label}</span>
        ${h.badge>0?`<span class="fh-ad-bottom-badge">${h.badge}</span>`:""}
      </div>`).join("");return`
      <div class="fh-ad-shell">

        <aside class="fh-ad-sidebar">
          <div class="fh-ad-brand">
            <div class="fh-ad-brand-icon">FH</div>
            <div>
              <div class="fh-ad-brand-name">${m(l)}</div>
              <div class="fh-ad-brand-sub">v${De} \xB7 ADMIN</div>
            </div>
          </div>
          <nav class="fh-ad-nav">${E}</nav>
        </aside>

        <div class="fh-ad-main">
          <div class="fh-ad-topbar">
            <div>
              <div class="fh-ad-topbar-crumb">${k.crumb}</div>
              <div class="fh-ad-topbar-title">${k.title}</div>
            </div>
            <div class="fh-ad-topbar-actions">${k.actions}</div>
          </div>
          <div class="fh-ad-body">${S}</div>
        </div>

        <nav class="fh-ad-bottom-nav">${u}</nav>

      </div>`}function Pa(e,t,a,s,o){let r=o.people||[],n=o.active_chores||[],i=o.history_log||[],c=(o.store_items||[]).filter(h=>{if(!h.is_group_reward||!h.active)return!1;let _=h.contributors||[];return _.length>0&&_.every(z=>(z.contributed_pts||0)>=(z.target_pts||0))}),b=[{label:"APPROVAL QUEUE",value:e.length,accent:e.length>0?"#F5C24A":"#58D38A"},{label:"REDEEM QUEUE",value:t.length,accent:t.length>0?"#E36DA4":"#58D38A"},{label:"GROUP PROPOSALS",value:a.length+c.length,accent:a.length+c.length>0?"#58D38A":"#A6B3CC"},{label:"ACTIVE CHORES",value:n.filter(h=>h.active!==!1).length,accent:"#5B8DEF"}].map(h=>`
      <div class="fh-ad-stat">
        <div class="fh-ad-stat-val" style="color:${h.accent}">${h.value}</div>
        <div class="fh-ad-stat-lbl">${h.label}</div>
      </div>`).join(""),g=[...e.map(h=>({...h,kind:"approval"})),...t.map(h=>({...h,kind:"redemption"})),...a.map(h=>({...h,kind:"group-proposal"})),...c.map(h=>({...h,kind:"group-funded"})),...s.map(h=>({...h,kind:"cancel-sub"}))],y=g.length>0?g.map(h=>{if(h.kind==="group-proposal"){let v=h.proposer_color||L,M=(h.invitees||[]).map(A=>A.person_name||"?").join(", ");return`
                  <div class="fh-ad-queue-row">
                    <div class="fh-avatar" style="background:${v};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${N(h.proposer_name)}</div>
                    <div class="fh-ad-queue-info">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#4CAF7D">GROUP</span>
                      </div>
                      <div class="fh-ad-queue-name">${m(h.item_name||"")}</div>
                      <div class="fh-ad-queue-meta">${m(h.proposer_name)} + ${m(M)}</div>
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="approve-group-proposal"
                            data-propid="${C(h.proposal_id)}"
                            data-by="admin">${j.check}</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="decline-group-proposal-parent"
                            data-propid="${C(h.proposal_id)}"
                            data-by="admin">${j.close}</button>
                  </div>`}if(h.kind==="group-funded"){let v=(h.contributors||[]).reduce((A,T)=>A+(T.contributed_pts||0),0),M=(h.contributors||[]).map(A=>A.person_name||"?").join(", ");return`
                  <div class="fh-ad-queue-row">
                    <div style="width:32px;height:32px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem">\u{1F91D}</div>
                    <div class="fh-ad-queue-info">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#4CAF7D">FUNDED</span>
                      </div>
                      <div class="fh-ad-queue-name">${m(h.name||"")}</div>
                      <div class="fh-ad-queue-meta">${m(M)} \xB7 ${P(v)} pts pooled</div>
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="redeem-group-reward"
                            data-iid="${C(h.item_id)}"
                            data-iname="${C(h.name||"")}">Redeem</button>
                  </div>`}if(h.kind==="cancel-sub"){let v=h.person_color||L,M=(h.period||"").replace("_"," ");return`
                  <div class="fh-ad-queue-row">
                    <div class="fh-avatar" style="background:${v};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${N(h.person_name||"?")}</div>
                    <div class="fh-ad-queue-info">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#9B59B6">CANCEL</span>
                        <span class="fh-ad-queue-time">${Z(h.cancellation_requested_at||"")}</span>
                      </div>
                      <div class="fh-ad-queue-name">${m(h.item_name||"")}</div>
                      <div class="fh-ad-queue-meta">${m(h.person_name||"")} \xB7 ${m(M)} subscription</div>
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="approve-cancel-subscription"
                            data-subid="${C(h.subscription_id||h.id||"")}">${j.check}</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="decline-cancel-subscription"
                            data-subid="${C(h.subscription_id||h.id||"")}">${j.close}</button>
                  </div>`}let _=h.person_color||L,z=h.kind==="approval",$=z?h.chore_name||"":h.item_name||"",F=z?h.chore_points:h.points_cost,R=z?'<span class="fh-ad-pill fh-ad-pill--amber">CHORE</span>':'<span class="fh-ad-pill fh-ad-pill--rose">REWARD</span>',B=o.store_items||[],f=z?null:B.find(v=>v.item_id===h.item_id);if(!z&&(f==null?void 0:f.item_type)==="subscription"){let v=f.subscription_period||"monthly",M=C(h.redemption_id),T=v==="daily"?"":v==="weekly"?`<div style="display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap">
                         <span style="font-size:.78rem;color:var(--fh-text-sec)">Renews on:</span>
                         <select id="m-sub-wday-${M}" class="fh-select" style="width:auto">
                           ${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((D,U)=>`<option value="${U}">${D}</option>`).join("")}
                         </select>
                       </div>`:`<div style="display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap">
                         <span style="font-size:.78rem;color:var(--fh-text-sec)">Renews day of month:</span>
                         <input type="number" id="m-sub-dom-${M}" class="fh-input"
                                min="1" max="31" value="1" style="width:64px">
                       </div>`;return`
                  <div class="fh-ad-queue-row" style="flex-wrap:wrap;row-gap:4px">
                    <div class="fh-avatar" style="background:${_};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${N(h.person_name)}</div>
                    <div class="fh-ad-queue-info" style="flex:1;min-width:0">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#9B59B6">SUBSCRIBE</span>
                        <span class="fh-ad-queue-time">${h.when||""}</span>
                      </div>
                      <div class="fh-ad-queue-name">${m(h.item_name||"")}</div>
                      <div class="fh-ad-queue-meta">${m(h.person_name||"")} \xB7 ${m(v)} \xB7 \u2212${P(F)}pts</div>
                      ${T}
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="approve-subscription-redemption"
                            data-rid="${M}"
                            data-period="${C(v)}">${j.check}</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="decline-redemption"
                            data-rid="${M}">${j.close}</button>
                  </div>`}return`
              <div class="fh-ad-queue-row">
                <div class="fh-avatar" style="background:${_};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${N(h.person_name)}</div>
                <div class="fh-ad-queue-info">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                    ${R}
                    <span class="fh-ad-queue-time">${h.when||""}</span>
                  </div>
                  <div class="fh-ad-queue-name">${m($)}</div>
                  <div class="fh-ad-queue-meta">${m(h.person_name||"")} \xB7 ${z?"+":"\u2212"}${P(F)}${z&&h.due_date?` \xB7 for ${m(Os(h.due_date))}`:""}</div>
                </div>
                <button class="fh-btn fh-btn-success fh-btn-sm" data-act="${z?"approve-task":"approve-redemption"}" data-${z?"tid":"rid"}="${z?h.task_id:h.redemption_id}">${j.check}</button>
                ${z?`<button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-partial"
                        data-tid="${h.task_id}" data-name="${C($)}" data-pts="${F}"
                        title="Partial credit" style="font-weight:800;font-size:1rem">\xBD</button>`:""}
                <button class="fh-btn fh-btn-danger  fh-btn-sm" data-act="${z?"deny-task":"decline-redemption"}" data-${z?"tid":"rid"}="${z?h.task_id:h.redemption_id}">${j.close}</button>
              </div>`}).join(""):'<div class="fh-empty fh-ad-empty">Nothing needs your attention right now. \u2713</div>',x=Date.now()-1728e5,S=i.filter(h=>new Date(h.timestamp).getTime()>x),p=new Map,k=[];for(let h of S)if(h.type==="task_skipped"){let _=h.skipped_date||(h.timestamp||"").slice(0,10)||"",z=`${h.person_id}:${_}`;p.has(z)||p.set(z,{personName:h.person_name||"",color:h.person_color||L,date:_,totalPts:0,count:0,timestamp:h.timestamp||""});let $=p.get(z);$.totalPts+=Math.abs(h.points_delta||0),$.count++,(h.timestamp||"")>$.timestamp&&($.timestamp=h.timestamp)}else k.push(h);let E=[...k.map(h=>({kind:"entry",e:h})),...[...p.values()].map(h=>({kind:"skip",g:h}))].sort((h,_)=>{let z=h.kind==="entry"?h.e.timestamp||"":h.g.timestamp||"";return(_.kind==="entry"?_.e.timestamp||"":_.g.timestamp||"").localeCompare(z)}).slice(0,15),u=E.length>0?E.map(h=>{if(h.kind==="skip"){let{personName:f,color:w,date:v,totalPts:M,count:A}=h.g;return`
                  <div class="fh-ad-activity-row">
                    <div class="fh-avatar" style="background:${w};width:28px;height:28px;font-size:var(--fh-text-xs);flex-shrink:0">${f?N(f):"\u2014"}</div>
                    <div style="flex:1;min-width:0">
                      <div class="fh-ad-activity-name">
                        <span style="font-weight:700">${m(f)}</span>
                        missed ${A} task${A!==1?"s":""}
                      </div>
                      <div class="fh-ad-activity-meta" style="color:var(--fh-warning)">Skipped \xB7 ${m(v)}</div>
                    </div>
                    ${M>0?`<span style="font-family:'JetBrains Mono',monospace;font-size:var(--fh-text-xs);font-weight:700;color:var(--fh-overdue);flex-shrink:0">\u2212${M}pts</span>`:""}
                  </div>`}let _=h.e,z=Q[_.type]||{label:_.type,color:"#6F7E9C"},$=_.person_color||L,F=_.points_delta,R=F>0?"#58D38A":F<0?"#E8553E":"#6F7E9C",B=F?`<span style="font-family:'JetBrains Mono',monospace;font-size:var(--fh-text-xs);font-weight:700;color:${R};flex-shrink:0">${F>0?"+":""}${F}pts</span>`:"";return`
              <div class="fh-ad-activity-row">
                <div class="fh-avatar" style="background:${$};width:28px;height:28px;font-size:var(--fh-text-xs);flex-shrink:0">${_.person_name?N(_.person_name):"\u2014"}</div>
                <div style="flex:1;min-width:0">
                  <div class="fh-ad-activity-name">
                    <span style="font-weight:700">${m(_.person_name||"")}</span>
                    ${m(_.chore_name||_.note||"")}
                  </div>
                  <div class="fh-ad-activity-meta" style="color:${z.color}">${m(z.label)}</div>
                </div>
                ${B}
                <span class="fh-ad-activity-time">${Z(_.timestamp)}</span>
              </div>`}).join(""):'<div class="fh-empty fh-ad-empty">No recent activity.</div>';return`
      <div class="fh-ad-stat-row">${b}</div>
      <div class="fh-ad-today-grid">
        <div class="fh-ad-panel fh-ad-today-queue">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Needs your attention</span>
            <span class="fh-ad-panel-sub">${g.length} item${g.length!==1?"s":""}</span>
          </div>
          ${y}
        </div>
        <div class="fh-ad-panel fh-ad-today-activity">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Recent activity</span>
            <span class="fh-ad-panel-sub">last 48 hours</span>
          </div>
          ${u}
        </div>
      </div>`}function Hs(e,t,a){let s=t.points_per_dollar||10,o=t.penalties_paused_global||!1,r=e.map(p=>{let k=p.avatar_color||L,E=p.penalties_paused||!1,u=p.type==="kid",h,_;return o?(h="Penalties & streaks off (global)",_="off-global"):E?(h="Penalties & streaks off",_="off"):(h="Penalties & streaks on",_=""),`
          <div class="fh-ad-person-card">
            <div class="fh-ad-person-top">
              <div class="fh-avatar" style="background:${k};width:40px;height:40px;font-size:1rem;flex-shrink:0">${N(p.name)}</div>
              <div style="flex:1;min-width:0">
                <div class="fh-ad-person-name">
                  ${m(p.name)}
                  <span class="fh-ad-person-type">${pt(p.type)}</span>
                  ${p.code?`<span class="fh-ad-person-code">${m(p.code)}</span>`:""}
                </div>
                <div class="fh-ad-person-bal">
                  ${P(p.points_balance)}pts \xB7 ${H(p.points_balance/s)} \xB7 lifetime ${P(p.points_lifetime)}${p.allowance_points>0?` \xB7 ${p.allowance_points}pts/${p.allowance_schedule==="monthly"?"mo":p.allowance_schedule==="biweekly"?"2wk":"wk"} allowance`:""}
                </div>
              </div>
            </div>
            <div class="fh-ad-person-btns">
                <button class="fh-btn fh-btn-success fh-btn-sm" data-act="open-award"
                        data-pid="${p.person_id}" data-pname="${C(p.name)}"
                        title="Award points">${j.award}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm" data-act="open-deduct"
                        data-pid="${p.person_id}" data-pname="${C(p.name)}"
                        title="Deduct points">${j.minus}</button>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-person"
                        data-pid="${p.person_id}"
                        data-pname="${C(p.name)}"
                        data-ptype="${p.type}"
                        data-pcolor="${p.avatar_color||L}"
                        data-pallowpts="${p.allowance_points||0}"
                        data-pallowsched="${p.allowance_schedule||"weekly"}"
                        data-pallowwday="${p.allowance_weekday??5}"
                        data-pallowmday="${p.allowance_monthday||1}"
                        data-pnotify="${C(p.notify_target||"")}"
                        data-pcode="${C(p.code||"")}"
                        data-ptheme="${C(p.theme_key||"classic")}"
                        data-pchildmode="${p.child_mode===!0}"
                        data-pcompletionthreshold="${p.completion_threshold_pct??80}"
                        data-pcompletionmilestone="${p.completion_milestone??7}"
                        data-pcompletionbonus="${p.completion_bonus_points??50}"
                        title="Edit person">${j.edit}</button>
            </div>
            ${u?`
              <div class="fh-ad-person-foot">
                <span class="fh-penalty-pause-label ${_}">${h}</span>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-streaks"
                        data-pid="${p.person_id}" data-pname="${C(p.name)}">\u{1F525} Streaks</button>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-ranks"
                        data-pid="${p.person_id}">\u{1F3C5} Ranks</button>
                <label class="fh-toggle" style="width:36px;height:20px"
                       title="${E?"Resume":"Pause"} penalties &amp; streaks">
                  <input type="checkbox" data-act="toggle-person-penalty"
                         data-pid="${p.person_id}" ${E?"":"checked"}>
                  <span class="fh-toggle-slider"></span>
                </label>
              </div>`:""}
            <button class="fh-ad-person-del" data-act="open-confirm-remove-person"
                    data-pid="${p.person_id}" data-pname="${C(p.name)}"
                    title="Remove ${C(p.name)}">${j.trash}</button>
          </div>`}).join("")||'<div class="fh-empty fh-ad-empty">No people found.</div>',n=t.all_subscriptions||[],i=a._editingSubId||null,d=new Map;for(let p of n)d.has(p.person_id)||d.set(p.person_id,[]),d.get(p.person_id).push(p);let c={daily:"Daily",weekly:"Weekly",monthly:"Monthly",quarterly:"Quarterly",biannual:"Biannual",annual:"Annual"},l=[{v:"weekly",l:"Weekly"},{v:"monthly",l:"Monthly"},{v:"quarterly",l:"Quarterly"},{v:"biannual",l:"Biannual"},{v:"annual",l:"Annual"}],b={active:"Active",lapsed:"Lapsed",cancel_pending:"Cancel pending"},g={active:"var(--fh-success)",lapsed:"var(--fh-overdue)",cancel_pending:"var(--fh-warning)"},y=n.length===0?'<div class="fh-empty fh-ad-empty">No active subscriptions.</div>':[...d.entries()].map(([p,k])=>{let E=k[0].person_color||L,u=k[0].person_name||"Unknown",h=k.map(_=>{let z=_.subscription_id,$=z===i,F=g[_.status]||"var(--fh-text-sec)",R=b[_.status]||_.status,B=c[_.period]||_.period,f=_.accumulated_debt>0?`<span style="color:var(--fh-overdue);font-size:.75rem"> \xB7 owes ${P(_.accumulated_debt)}pts</span>`:"",w=_.dollar_cost_override!=null?`${H(_.effective_dollar)} (override) \xB7 ${P(_.effective_cost)}pts`:`${H(_.effective_dollar)} \xB7 ${P(_.effective_cost)}pts`;if($){let v=l.map(M=>`<option value="${M.v}"${_.period===M.v?" selected":""}>${M.l}</option>`).join("");return`
                      <div style="padding:10px 0;border-bottom:1px solid var(--fh-border)">
                        <div style="font-size:.88rem;font-weight:600;margin-bottom:8px">${m(_.item_name)}</div>
                        <div style="display:grid;grid-template-columns:90px 1fr;gap:5px 10px;align-items:center;margin-bottom:8px">
                          <label style="font-size:.75rem;color:var(--fh-text-sec)">Period</label>
                          <select id="sub-edit-period-${C(z)}" class="fh-input" style="height:28px;font-size:.8rem;padding:0 6px">
                            ${v}
                          </select>
                          <label style="font-size:.75rem;color:var(--fh-text-sec)">Cost override $</label>
                          <input id="sub-edit-cost-${C(z)}"
                                 type="number" min="0" step="0.01"
                                 value="${_.dollar_cost_override??""}"
                                 placeholder="${H(_.item_dollar_value)}"
                                 class="fh-input" style="height:28px;font-size:.8rem;padding:0 6px">
                          <label style="font-size:.75rem;color:var(--fh-text-sec)">Next renewal</label>
                          <input id="sub-edit-date-${C(z)}"
                                 type="date"
                                 value="${C(_.next_renewal_date||"")}"
                                 class="fh-input" style="height:28px;font-size:.8rem;padding:0 6px">
                        </div>
                        <div style="font-size:.7rem;color:var(--fh-text-sec);margin-bottom:8px">
                          Leave cost blank to use item default (${H(_.item_dollar_value)})
                        </div>
                        <div style="display:flex;gap:6px">
                          <button class="fh-btn fh-btn-success fh-btn-sm"
                                  data-act="admin-update-subscription"
                                  data-subid="${C(z)}"
                                  title="Save changes">\u2713 Save</button>
                          <button class="fh-btn fh-btn-ghost fh-btn-sm"
                                  data-act="admin-edit-subscription-cancel"
                                  title="Discard">\u2717 Cancel</button>
                        </div>
                      </div>`}return`
                  <div class="fh-point-row" style="gap:8px;padding:8px 0;border-bottom:1px solid var(--fh-border)">
                    <div style="flex:1;min-width:0">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
                        <span style="font-size:.88rem;font-weight:600">${m(_.item_name)}</span>
                        <span style="font-size:.7rem;font-weight:700;color:${F}">${m(R)}</span>
                      </div>
                      <div style="font-size:.75rem;color:var(--fh-text-sec)">
                        ${m(B)} \xB7 ${w}${f}
                      </div>
                      <div style="font-size:.72rem;color:var(--fh-text-sec);margin-top:1px">
                        Renews ${m(_.next_renewal_date||"\u2014")}
                      </div>
                    </div>
                    <button class="fh-btn fh-btn-ghost fh-btn-sm"
                            data-act="admin-edit-subscription-open"
                            data-subid="${C(z)}"
                            title="Edit period / cost">\u270E</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="admin-cancel-subscription"
                            data-subid="${C(z)}"
                            data-sname="${C(_.item_name)}"
                            title="Cancel subscription">\u2715</button>
                  </div>`}).join("");return`
              <div style="margin-bottom:12px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                  <div class="fh-avatar" style="background:${E};width:26px;height:26px;font-size:.7rem;flex-shrink:0">${N(u)}</div>
                  <span style="font-size:.9rem;font-weight:600">${m(u)}</span>
                </div>
                ${h}
              </div>`}).join(""),x=t.inactive_people||[],S=x.length===0?"":`
      <div class="fh-ad-panel" style="margin-top:4px">
        <div class="fh-ad-panel-hdr">
          <span class="fh-ad-panel-title">Inactive members</span>
          <span class="fh-ad-panel-sub">${x.length} deactivated</span>
        </div>
        <div class="fh-ad-panel-body">
          <div style="font-size:var(--fh-text-sm);color:var(--fh-text-sec);margin-bottom:10px">
            Deactivated people are hidden from dashboards but kept so their history stays intact
            (e.g. a kid away at camp). Reactivate to bring them back, or permanently delete to purge
            them and all their data.
          </div>
          ${x.map(p=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--fh-border)">
              <div class="fh-avatar" style="background:${p.avatar_color||L};width:30px;height:30px;font-size:.85rem;flex-shrink:0">${N(p.name)}</div>
              <div style="flex:1;min-width:0">
                <span style="font-weight:600;font-size:var(--fh-text-base)">${m(p.name)}</span>
                <span style="font-size:var(--fh-text-xs);color:var(--fh-text-sec)"> \xB7 ${pt(p.type)} \xB7 lifetime ${P(p.points_lifetime)}</span>
              </div>
              <button class="fh-btn fh-btn-success fh-btn-sm" data-act="reactivate-person"
                      data-pid="${p.person_id}" data-pname="${C(p.name)}"
                      title="Reactivate ${C(p.name)}">\u21BA Reactivate</button>
              <button class="fh-btn fh-btn-danger fh-btn-sm" data-act="open-confirm-hard-delete-person"
                      data-pid="${p.person_id}" data-pname="${C(p.name)}"
                      title="Permanently delete ${C(p.name)}">${j.trash}</button>
            </div>
          `).join("")}
        </div>
      </div>`;return`
      <div style="display:flex;gap:16px;align-items:flex-start">

        <div style="flex:1;min-width:0">
          <div class="fh-ad-family-grid">${r}</div>
          <div class="fh-ad-panel" style="margin-top:4px">
            <div class="fh-ad-panel-hdr">
              <span class="fh-ad-panel-title">Global controls</span>
            </div>
            <div class="fh-ad-panel-body">
              <div class="fh-toggle-row" style="border-left:3px solid ${o?"var(--fh-warning)":"var(--fh-success)"}">
                <div>
                  <div style="font-size:.9rem;font-weight:600">Penalties &amp; streaks active</div>
                  <div style="font-size:.75rem;color:var(--fh-text-sec)">
                    ${o?"\u23F8 Paused globally \u2014 skips won&#39;t break streaks or deduct points":"Applying normally at the daily tick"}
                  </div>
                </div>
                <label class="fh-toggle">
                  <input type="checkbox" data-act="toggle-global-penalty" ${o?"":"checked"}>
                  <span class="fh-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          ${S}
        </div>

        <div class="fh-ad-tasks-panel" style="flex-shrink:0">
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1">
              <div class="fh-ad-tasks-panel-title">Active Subscriptions</div>
              <div class="fh-ad-tasks-panel-sub">${n.length} across family</div>
            </div>
          </div>
          <div class="fh-ad-tasks-panel-body" style="overflow-y:auto">
            ${y}
          </div>
        </div>

      </div>`}function js(e,t,a,s){s._sortedChores=e;let o=s._choreStatusFilter||"",r=s._choreRecFilter||"",n=s._choreFilter||"",i=[{val:"",label:"All"},{val:"active",label:"Active"},{val:"inactive",label:"Inactive"}],d=[{val:"",label:"All types"},{val:"daily",label:"Daily"},{val:"weekly",label:"Weekly"},{val:"monthly",label:"Monthly"},{val:"one_time",label:"One-Time"}],c=[{val:"",label:"Everyone"},...t.map(B=>({val:B.person_id,label:B.name}))],l=(B,f,w)=>`
      <select class="fh-select fh-ad-filter-select" data-act="${B}">
        ${f.map(v=>`<option value="${C(v.val)}" ${String(w)===String(v.val)?"selected":""}>${m(v.label)}</option>`).join("")}
      </select>`,b=`
      <div class="fh-ad-filter-bar">
        <label class="fh-ad-filter-lbl">Status ${l("chore-status-filter",i,o)}</label>
        <label class="fh-ad-filter-lbl">Type ${l("chore-rec-filter",d,r)}</label>
        <label class="fh-ad-filter-lbl">Assignee ${l("chore-filter",c,n)}</label>
      </div>`,g=e;o==="active"&&(g=e.filter(B=>B.active!==!1)),o==="inactive"&&(g=e.filter(B=>B.active===!1)),r&&(g=g.filter(B=>Ns(B)===r)),s._choreFilter&&(g=g.filter(B=>(B.assigned_to||[]).includes(s._choreFilter)));let y=s._adminSort||{col:null,dir:"asc"},x=[...g];y.col&&x.sort((B,f)=>{let w,v;switch(y.col){case"name":w=B.name.toLowerCase(),v=f.name.toLowerCase();break;case"pts":w=B.points,v=f.points;break;case"cat":w=B.category_label||"",v=f.category_label||"";break;case"asgn":{w=(B.assigned_to||[]).map(M=>{var A;return((A=t.find(T=>T.person_id===M))==null?void 0:A.name)||""}).sort().join(","),v=(f.assigned_to||[]).map(M=>{var A;return((A=t.find(T=>T.person_id===M))==null?void 0:A.name)||""}).sort().join(",");break}default:w=v=""}return w<v?y.dir==="asc"?-1:1:w>v?y.dir==="asc"?1:-1:0});let p=`
      <div class="fh-ad-sort-bar">
        <span class="fh-ad-sort-lbl">Sort:</span>
        ${[{col:"name",label:"Name"},{col:"pts",label:"Pts"},{col:"cat",label:"Category"},{col:"asgn",label:"Assignees"}].map(({col:B,label:f})=>{let w=y.col===B,v=w?y.dir==="asc"?" \u2191":" \u2193":"";return`<button class="fh-ad-sort-btn${w?" active":""}"
                            data-act="sort-admin-chores" data-col="${B}">${f}${v}</button>`}).join("")}
        ${y.col?'<button class="fh-ad-sort-btn" data-act="sort-admin-chores" data-col="">\u2715 Clear</button>':""}
      </div>`,k=new Map;for(let B of a)k.set(B,[]);for(let B of x){let f=B.category_label||"Uncategorized";k.has(f)||k.set(f,[]),k.get(f).push(B)}for(let[B,f]of[...k.entries()])f.length||k.delete(B);let E=s._adminSelectedChoreId||null,u=s._adminCollapsedCats||new Set,h=e.filter(B=>B.active!==!1).length,_=e.filter(B=>B.active===!1).length,z=_?`${h} active \xB7 ${_} inactive`:`${h} total`,$=s._choreFilter||r||o,F="";x.length?F=[...k.entries()].map(([B,f])=>{let w=u.has(B),v=w?"":f.map(M=>Us(M,t,s,E)).join("");return`
              <div class="fh-ad-cat-group">
                <div class="fh-ad-cat-hdr" data-act="toggle-admin-cat" data-cat="${C(B)}">
                  <span class="fh-ad-cat-chevron${w?" collapsed":""}">\u25BC</span>
                  <span class="fh-ad-cat-name">${m(B)}</span>
                  <span class="fh-ad-cat-count">${f.length}</span>
                </div>
                ${w?"":`<div class="fh-task-list">${v}</div>`}
              </div>`}).join(""):F=`<div class="fh-empty fh-ad-empty">${$?"No chores match this filter.":"No active chores. Add one above."}</div>`;let R=Js(s);return`
      <div class="fh-ad-tasks-wrap">

        <div class="fh-ad-panel fh-ad-tasks-list-panel">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Chore definitions</span>
            <span class="fh-ad-panel-sub">${z}</span>
          </div>
          <div class="fh-ad-panel-body">
            ${b}
            ${p}
            ${F}
          </div>
        </div>

        ${R}

      </div>`}function Gs(e,t){let a=Na(e,t);if(!a)return null;let s=(r,n)=>{let i=t.find(l=>l.person_id===r),d=(i==null?void 0:i.name)||"?",c=(i==null?void 0:i.avatar_color)||L;return`<div class="fh-avatar ${n}" title="${C(d)}" style="background:${c};width:26px;height:26px;font-size:var(--fh-text-xs)">${N(d)}</div>`};return`<span class="fh-rot-glyph" title="Rotates between kids">\u21BB</span><div class="fh-avatars fh-avatars--rot">${a.orderedIds.map((r,n)=>s(r,n===0?"fh-avatar--current":n===1?"fh-avatar--next":"fh-avatar--dim")).join("")}</div>`}function Us(e,t,a,s){var p,k,E,u;let o=(e.assigned_to||[]).map(h=>t.find(_=>_.person_id===h)).filter(Boolean),r=Gs(e,t),n=r??(o.length?`<div class="fh-avatars">${o.map(h=>`<div class="fh-avatar" style="background:${h.avatar_color||L};width:26px;height:26px;font-size:var(--fh-text-xs)">${N(h.name)}</div>`).join("")}</div>`:""),i=a._expandedDescs.has(e.chore_id),d=((p=o[0])==null?void 0:p.avatar_color)||L,c=((k=e.recurrence)==null?void 0:k.type)||"daily",l={daily:"Daily",weekly:"Weekly",every_n_days:`Every ${((E=e.recurrence)==null?void 0:E.interval)||2}d`,every_n_weeks:`Every ${((u=e.recurrence)==null?void 0:u.interval)||2}wk`,monthly_on_date:"Monthly",one_time:"One-time"}[c]||c,b=e.expires_after_days?`<span class="fh-badge fh-badge-expiry" style="margin-left:4px">Expires in ${e.expires_after_days}d</span>`:"",g=e.streak_milestone||0,y=e.streak_bonus_points||0,x=g>0&&y>0?`<span class="fh-task-streak" title="Bonus: +${y}pts every ${g} completions">\u{1F525} ${g} \u2192 +${y}</span>`:'<span class="fh-task-streak fh-task-streak--off" title="No streak bonus set">no streak</span>';return`
      <div class="fh-task-row${e.chore_id===s?" fh-task-row--selected":""}"
           style="--row-color:${d}"
           draggable="true" data-drag-id="${e.chore_id}"
           data-act="select-chore-row" data-cid="${e.chore_id}">
        <span class="fh-drag-handle" title="Drag to reorder">\u283F</span>
        ${n}
        <div class="fh-task-body">
          <span class="fh-task-name">${m(e.name)}${e.active===!1?' <span style="font-size:.72rem;color:#6F7E9C;font-weight:400">[inactive]</span>':""}</span>
          ${i&&e.description?`<span class="fh-desc-inline">${m(e.description)}</span>`:""}
          <span class="fh-task-sub">${l}${e.penalty_enabled?` \xB7 -${e.penalty_points}pts penalty`:""}</span>
        </div>
        ${e.description?`<button class="fh-desc-btn" data-act="toggle-desc" data-id="${e.chore_id}"
                       title="Toggle description">?</button>`:""}
        ${b}
        <div class="fh-task-pts-col">
          <span class="fh-badge fh-badge-pts" style="--row-color:${d}">${e.points}pts</span>
          ${x}
        </div>
        <button class="fh-btn fh-btn-ghost fh-btn-sm fh-ad-tasks-edit-btn"
                data-act="open-edit-chore" data-cid="${e.chore_id}"
                title="Edit chore">${j.edit}</button>
        <button class="fh-btn fh-btn-danger fh-btn-sm fh-ad-tasks-del-btn"
                data-act="delete-chore"
                data-cid="${e.chore_id}" data-cname="${C(e.name)}"
                title="Delete chore">${j.trash}</button>
      </div>`}function Ws(e){let t=e.recurrence||{};switch(t.type||"daily"){case"daily":return(t.day_filter||[]).length||7;case"weekly":return(t.weekdays||[]).length||1;case"every_n_days":{let a=t.interval||1;return a>0?7/a:0}case"every_n_weeks":{let a=t.interval||1;return a>0?1/a:0}case"monthly_on_date":return(t.days_of_month&&t.days_of_month.length?t.days_of_month.length:1)*12/52;default:return 0}}function Na(e,t){let a=e.rotation_pool||[];if(!a.length||!e.rotation_cadence)return null;let s=d=>{let c=t.find(l=>l.person_id===d);return c&&c.active!==!1},o=a.filter(s);if(!o.length)return null;let r=e.assigned_to&&e.assigned_to[0]||o[0],n=o.indexOf(r);n<0&&(n=0);let i=o.slice(n).concat(o.slice(0,n));return{activeIds:o,orderedIds:i,currentId:i[0],nextId:o.length>1?i[1]:null,cadence:e.rotation_cadence,switchWeekday:e.rotation_switch_weekday??0}}function qs(e,t){for(e=Math.round(e),t=Math.round(t);t;)[e,t]=[t,e%t];return e||1}function Ks(e,t){return Math.abs(e*t)/qs(e,t)}function Ha(e,t){let a=Ws(e);if(a<=0)return 0;let s=a*(e.points||0)*t.comp;return t.includeStreaks&&e.streak_milestone>0&&e.streak_bonus_points>0&&(s+=a*(e.streak_bonus_points/e.streak_milestone)*t.streakPct),s}function Vs(e,t,a){let s=t.filter(u=>u.type==="kid"&&u.active!==!1),o=s.map(u=>u.person_id),r={},n={};o.forEach(u=>{r[u]=0,n[u]=0});let i=[];for(let u of e){let h=Ha(u,a);if(h<=0)continue;let _=Na(u,t);if(_&&_.cadence==="weekly")i.push({eff:h,ordered:_.orderedIds,name:u.name}),_.activeIds.forEach(z=>{n[z]!=null&&(n[z]+=1)});else if(_){let z=h/_.activeIds.length;_.activeIds.forEach($=>{r[$]!=null&&(r[$]+=z,n[$]+=1)})}else for(let z of u.assigned_to||[])r[z]!=null&&(r[z]+=h,n[z]+=1)}let d={};o.forEach(u=>d[u]=r[u]);for(let u of i){let h=u.eff/u.ordered.length;u.ordered.forEach(_=>{d[_]!=null&&(d[_]+=h)})}let c=1;for(let u of i)c=Ks(c,u.ordered.length);c=Math.max(1,Math.min(c,12));let l={},b={},g={};o.forEach(u=>{l[u]=r[u],b[u]=r[u],g[u]=r[u]});for(let u=0;u<c;u++){let h={};o.forEach(_=>h[_]=r[_]);for(let _ of i){let z=_.ordered[u%_.ordered.length];h[z]!=null&&(h[z]+=_.eff)}o.forEach(_=>{u===0?(g[_]=h[_],l[_]=h[_],b[_]=h[_]):(h[_]<l[_]&&(l[_]=h[_]),h[_]>b[_]&&(b[_]=h[_]))})}let y={},x={};s.forEach(u=>{let h=u.allowance_points||0,_=u.allowance_schedule||"weekly";_==="biweekly"?(y[u.person_id]=h/2,x[u.person_id]=h*2):_==="monthly"?(y[u.person_id]=h/4,x[u.person_id]=h):(y[u.person_id]=h,x[u.person_id]=h*4)});let S=a.ladder,p=u=>{let h=a.rankOverride!=null?a.rankOverride:u.rank_index||0;return S&&S.length?S[Math.max(0,Math.min(h,S.length-1))]:a.ppd>0?100/a.ppd:0},k=(u,h)=>h*p(u)/100,E=s.map(u=>{let h=u.person_id,_=d[h]*4;return{person:u,chores:n[h],month:_,monthUSD:k(u,_),weekAvg:d[h],weekAvgUSD:k(u,d[h]),weekMin:l[h],weekMax:b[h],weekThis:g[h],weekThisUSD:k(u,g[h]),swingUSD:k(u,b[h]-l[h]),allowMo:x[h],allowMoUSD:k(u,x[h]),allowWkUSD:k(u,y[h]),takeHomeMoUSD:k(u,_+x[h]),takeHomeWkUSD:k(u,d[h]+y[h])}});return{rows:E,famWeek:E.reduce((u,h)=>u+h.weekAvg,0),famMonth:E.reduce((u,h)=>u+h.month,0),famWeekUSD:E.reduce((u,h)=>u+h.weekAvgUSD,0),famMonthUSD:E.reduce((u,h)=>u+h.monthUSD,0),maxWeekMax:Math.max(1,...E.map(u=>u.weekMax)),maxMonth:Math.max(1,...E.map(u=>u.month)),weeklyRotChores:i.map(u=>u.name),centsOfRank:u=>S&&S.length?S[Math.max(0,Math.min(u,S.length-1))]:a.ppd>0?100/a.ppd:0}}function Js(e){var _;let t=e._attrs("sensor.family_hub_needs_attention"),a=t.people||[],s=t.active_chores||[],o=t.points_per_dollar||0,r=t.rank_ppd_ladder&&t.rank_ppd_ladder.length?t.rank_ppd_ladder:[3,3.5,4,4.5,5],n=e._statsCompletionPct??100,i=!!e._statsIncludeStreaks,d=e._statsStreakPct??50,c=e._statsRankOverride==null||e._statsRankOverride===""?null:Number(e._statsRankOverride),l={comp:n/100,includeStreaks:i,streakPct:d/100,rankOverride:c,ladder:r,ppd:o},b=s.filter(z=>z.chore_type==="assigned"),g=s.filter(z=>z.chore_type==="claimable"),y=Vs(b,a,l),x=z=>P(Math.round(z||0)),S=[`<option value="" ${c==null?"selected":""}>Current</option>`].concat(r.map((z,$)=>`<option value="${$}" ${c===$?"selected":""}>Rank ${$+1}</option>`)).join(""),p=[100,95,90,85,80,75,70,60,50].map(z=>`<option value="${z}" ${n===z?"selected":""}>${z}%</option>`).join(""),k=[100,75,50,25].map(z=>`<option value="${z}" ${d===z?"selected":""}>${z}%</option>`).join(""),E=`
      <div class="fh-es-controls">
        <label class="fh-es-ctl">Rank <select class="fh-select" data-act="stats-rank">${S}</select></label>
        <label class="fh-es-ctl">Done <select class="fh-select" data-act="stats-completion">${p}</select></label>
        <label class="fh-es-ctl fh-es-ctl-chk"><input type="checkbox" data-act="toggle-stats-streaks" ${i?"checked":""}> Streaks</label>
        ${i?`<label class="fh-es-ctl">Streak <select class="fh-select" data-act="stats-streak-pct">${k}</select></label>`:""}
      </div>`,u=[`${b.length} chore${b.length===1?"":"s"}`,`${n}% done`];i&&u.push(`streaks ${d}%`),c!=null&&u.push(`at Rank ${c+1}`);let h;if(!y.rows.length)h=`
          <div class="fh-ad-tasks-panel-empty">
            <div class="fh-ad-tasks-panel-empty-icon">\u{1F4CA}</div>
            <div class="fh-ad-tasks-panel-empty-text">No kids to report on yet.</div>
          </div>`;else{let z=y.maxWeekMax||1,$=y.rows.map(v=>{let M=v.person.avatar_color||L,A=Math.max(0,v.weekMax-v.weekMin),T=A>.5,D=Math.max(0,Math.min(100,v.weekMin/z*100)),U=Math.max(0,Math.min(100,A/z*100)),se=Math.max(0,Math.min(100,v.weekThis/z*100)),Je=T?`<span class="fh-es-week-this">this wk ${H(v.weekThisUSD)}</span>`:"",ro=v.allowMo>0?`<div class="fh-es-allow">+${H(v.allowWkUSD)}/wk allowance \u2192 <b>${H(v.takeHomeWkUSD)}</b>/wk take-home</div>`:"";return`
              <div class="fh-es-kid">
                <div class="fh-es-kid-hdr">
                  <div class="fh-avatar" style="background:${M};width:26px;height:26px;font-size:var(--fh-text-xs)">${N(v.person.name)}</div>
                  <span class="fh-es-kid-name">${m(v.person.name)}</span>
                  <span class="fh-es-kid-count">${v.chores} chore${v.chores===1?"":"s"}</span>
                </div>
                <div class="fh-es-week">
                  <span class="fh-es-week-usd">${H(v.weekAvgUSD)}</span><span class="fh-es-week-lbl">/wk</span>
                  <span class="fh-es-week-pts">${x(v.weekAvg)} pts</span>
                  ${Je}
                </div>
                <div class="fh-es-rng-track">
                  <div class="fh-es-rng-span" style="left:${D}%;width:${U}%;background:${M}"></div>
                  <div class="fh-es-rng-dot" style="left:${se}%;background:${M}"></div>
                </div>
                <div class="fh-es-month-sub">${x(v.month)} pts \xB7 ${H(v.monthUSD)} / month</div>
                ${ro}
              </div>`}).join(""),F=`
          <div class="fh-es-section">
            <div class="fh-es-section-hdr">Monthly balance</div>
            ${y.rows.map(v=>{let M=Math.round(v.month/y.maxMonth*100);return`
                  <div class="fh-es-bar-row">
                    <span class="fh-es-bar-name">${m(v.person.name)}</span>
                    <div class="fh-es-bar-track"><div class="fh-es-bar-fill" style="width:${M}%;background:${v.person.avatar_color||L}"></div></div>
                    <span class="fh-es-bar-val">${H(v.monthUSD)}</span>
                  </div>`}).join("")}
          </div>`,R=`
          <div class="fh-es-section">
            <div class="fh-es-section-hdr">Family payout</div>
            <div class="fh-es-tot-row"><span>Per week</span><span>${x(y.famWeek)} pts \xB7 ${H(y.famWeekUSD)}</span></div>
            <div class="fh-es-tot-row"><span>Per month</span><span>${x(y.famMonth)} pts \xB7 ${H(y.famMonthUSD)}</span></div>
          </div>`,B="";if(g.length){let v=g.reduce((T,D)=>T+Ha(D,l),0),M=y.centsOfRank(c??(((_=y.rows[0])==null?void 0:_.person.rank_index)||0)),A=T=>T*M/100;B=`
              <div class="fh-es-section">
                <div class="fh-es-section-hdr">Bonus pool \xB7 up for grabs</div>
                <div class="fh-es-tot-row"><span>Per week</span><span>${x(v)} pts \xB7 ${H(A(v))}</span></div>
                <div class="fh-es-tot-row"><span>Per month</span><span>${x(v*4)} pts \xB7 ${H(A(v*4))}</span></div>
              </div>`}let f="",w=y.rows.filter(v=>v.swingUSD>=1);if(w.length&&y.weeklyRotChores.length){let v=w.map(D=>D.person.name).join(" & "),M=Math.max(...w.map(D=>D.swingUSD)),A=y.weeklyRotChores,T=A.length<=3?A.join(", "):`${A.slice(0,3).join(", ")} +${A.length-3} more`;f=`
              <div class="fh-es-tip">
                <b>Weekly pay varies up to ${H(M)}</b> week-to-week for ${m(v)} (anti-phased) from ${A.length} weekly rotation${A.length===1?"":"s"} \u2014 ${m(T)}. Switch those to per-instance rotation to even the weeks out.
              </div>`}h=`<div class="fh-es-rail">${$}${F}${R}${B}${f}</div>`}return`
      <div class="fh-ad-tasks-panel">
        <div class="fh-ad-tasks-panel-hdr">
          <div style="flex:1;min-width:0">
            <div class="fh-ad-tasks-panel-title">Earning &amp; Balance</div>
            <div class="fh-ad-tasks-panel-sub">${m(u.join(" \xB7 "))}</div>
          </div>
        </div>
        <div class="fh-ad-tasks-panel-body">
          ${E}
          ${h}
        </div>
      </div>`}function Ys(e,t,a,s){s._sortedStoreItems=e;let o=`
      <div class="fh-chips">
        <div class="fh-chip ${s._storeItemFilter?"":"active"}"
             data-act="store-item-filter" data-fval="">All</div>
        <div class="fh-chip ${s._storeItemFilter==="active"?"active":""}"
             data-act="store-item-filter" data-fval="active">Active</div>
        <div class="fh-chip ${s._storeItemFilter==="inactive"?"active":""}"
             data-act="store-item-filter" data-fval="inactive">Inactive</div>
      </div>`,r=e;s._storeItemFilter==="active"&&(r=e.filter(p=>p.active!==!1)),s._storeItemFilter==="inactive"&&(r=e.filter(p=>p.active===!1));let n=s._adminSortItems||{col:null,dir:"asc"},i=[...r];n.col&&i.sort((p,k)=>{let E,u;switch(n.col){case"name":E=p.name.toLowerCase(),u=k.name.toLowerCase();break;case"pts":E=p.points_cost,u=k.points_cost;break;case"cat":E=p.category_label||"",u=k.category_label||"";break;case"scope":E=p.scope||"",u=k.scope||"";break;default:E=u=""}return E<u?n.dir==="asc"?-1:1:E>u?n.dir==="asc"?1:-1:0});let c=`
      <div class="fh-ad-sort-bar">
        <span class="fh-ad-sort-lbl">Sort:</span>
        ${[{col:"name",label:"Name"},{col:"pts",label:"Pts"},{col:"cat",label:"Category"},{col:"scope",label:"Scope"}].map(({col:p,label:k})=>{let E=n.col===p,u=E?n.dir==="asc"?" \u2191":" \u2193":"";return`<button class="fh-ad-sort-btn${E?" active":""}"
                            data-act="sort-admin-store-items" data-col="${p}">${k}${u}</button>`}).join("")}
        ${n.col?'<button class="fh-ad-sort-btn" data-act="sort-admin-store-items" data-col="">\u2715 Clear</button>':""}
      </div>`,l=new Map;for(let p of a)l.set(p,[]);for(let p of i){let k=p.category_label||"Uncategorized";l.has(k)||l.set(k,[]),l.get(k).push(p)}for(let[p,k]of[...l.entries()])k.length||l.delete(p);let b=s._adminSelectedItemId||null,g=s._adminCollapsedRewardCats||new Set,y="";i.length?y=[...l.entries()].map(([p,k])=>{let E=g.has(p),u=E?"":k.map(h=>Xs(h,t,s,b)).join("");return`
              <div class="fh-ad-cat-group">
                <div class="fh-ad-cat-hdr" data-act="toggle-admin-reward-cat" data-cat="${C(p)}">
                  <span class="fh-ad-cat-chevron${E?" collapsed":""}">\u25BC</span>
                  <span class="fh-ad-cat-name">${m(p)}</span>
                  <span class="fh-ad-cat-count">${k.length}</span>
                </div>
                ${E?"":`<div class="fh-task-list">${u}</div>`}
              </div>`}).join(""):y=`<div class="fh-empty fh-ad-empty">${s._storeItemFilter?"No rewards match this filter.":"No rewards yet. Add one above."}</div>`;let x=b?e.find(p=>p.item_id===b):null,S=Qs(x,t,a,s);return`
      <div class="fh-ad-rewards-wrap">

        <div class="fh-ad-panel fh-ad-rewards-list-panel">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Reward catalog</span>
            <span class="fh-ad-panel-sub">${e.filter(p=>p.active!==!1).length} active</span>
          </div>
          <div class="fh-ad-panel-body">
            ${o}
            ${c}
            ${y}
          </div>
        </div>

        ${S}

      </div>`}function Xs(e,t,a,s){let o=(e.person_ids||[]).map(d=>{var c;return(c=t.find(l=>l.person_id===d))==null?void 0:c.name}).filter(Boolean).join(", "),r=e.item_id===s,n=e.active===!1,i=e.max_per_period>0?`<span class="fh-badge fh-badge-expiry" style="margin-left:4px">Max ${e.max_per_period}/${e.period}</span>`:"";return`
      <div class="fh-task-row${r?" fh-task-row--selected":""}${n?" fh-store-row--inactive":""}"
           draggable="true" data-drag-id="${e.item_id}"
           data-drag-type="store-item"
           data-act="select-store-row" data-iid="${e.item_id}">
        <span class="fh-drag-handle" title="Drag to reorder">\u283F</span>
        ${e.icon?`<span style="width:24px;height:24px;flex-shrink:0">${oe(e.icon,null,"24px")}</span>`:""}
        <div class="fh-task-body">
          <span class="fh-task-name">${m(e.name)}${n?' <span style="font-size:.72rem;color:#6F7E9C;font-weight:400">[inactive]</span>':""}</span>
          <span class="fh-task-sub">
            ${H(e.dollar_value)} \xB7
            ${e.scope==="personal"?`Personal${o?` (${m(o)})`:""}`:"All kids"}
          </span>
        </div>
        ${i}
        <span class="fh-badge fh-badge-pts">${P(e.points_cost)}pts</span>
        <button class="fh-btn fh-btn-ghost fh-btn-sm fh-ad-tasks-edit-btn"
                data-act="open-edit-store-item" data-iid="${e.item_id}"
                title="Edit reward">${j.edit}</button>
        <button class="fh-btn fh-btn-danger fh-btn-sm"
                data-act="delete-store-item"
                data-iid="${e.item_id}" data-iname="${C(e.name)}"
                title="Delete reward">${j.trash}</button>
      </div>`}function Qs(e,t,a,s){return`<div class="fh-ad-rewards-panel">${e?`
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1;min-width:0">
              <div class="fh-ad-tasks-panel-title">Edit reward</div>
              <div class="fh-ad-tasks-panel-sub" title="${C(e.name)}">${m(e.name)}</div>
            </div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="close-store-panel"
                    style="flex-shrink:0" title="Close panel">\u2715</button>
          </div>
          <div class="fh-ad-tasks-panel-body">
            ${nt(e,!0,t,a)}
          </div>
          <div class="fh-ad-tasks-panel-footer">
            <button class="fh-btn fh-btn-primary" style="flex:1"
                    data-act="ok-edit-store-item-inline">Save changes</button>
            <button class="fh-btn fh-btn-ghost fh-btn-sm"
                    data-act="delete-store-item"
                    data-iid="${e.item_id}" data-iname="${C(e.name)}"
                    title="Hide from kids (can restore by toggling Active)">Deactivate</button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="hard-delete-store-item"
                    data-iid="${e.item_id}" data-iname="${C(e.name)}"
                    title="Permanently delete \u2014 cannot be undone">Delete \u2715</button>
          </div>`:`
          <div class="fh-ad-tasks-panel-empty">
            <div class="fh-ad-tasks-panel-empty-icon">\u2196</div>
            <div class="fh-ad-tasks-panel-empty-text">Select a reward to edit</div>
          </div>`}</div>`}function Zs(e,t){let a=e.history_log||[],s=e.people||[],o=s.find(y=>y.type==="parent"),r=new Set(["task_completed","task_approved","pending_approval","task_denied","task_skipped","task_excused","task_rejected","task_marked_complete"]),n=`
      <div class="fh-chips" style="margin-bottom:var(--fh-gap-sm)">
        <div class="fh-chip ${t._histFilter?"":"active"}"
             data-act="hist-filter" data-hpid="">All</div>
        ${s.map(y=>`
          <div class="fh-chip ${t._histFilter===y.person_id?"active":""}"
               style="--chip-color:${y.avatar_color||L}"
               data-act="hist-filter" data-hpid="${y.person_id}">
            <span class="fh-chip-dot"></span>${m(y.name)}
          </div>`).join("")}
      </div>`,i=t._histFilter?a.filter(y=>y.person_id===t._histFilter):a,d=i.filter(y=>r.has(y.type)),l=ae(d).map(y=>y.isGroup?tr(y,o,t):La(y.entry,o)).join("")||'<div class="fh-empty fh-ad-empty">No chore history yet.</div>',g=i.filter(y=>!r.has(y.type)).map(y=>La(y,o)).join("")||'<div class="fh-empty fh-ad-empty">No reward history yet.</div>';return`
      <div class="fh-ad-history-wrap">
        <div class="fh-ad-panel fh-ad-history-main">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Chore history</span>
            <span class="fh-ad-panel-sub">last 30 days</span>
          </div>
          <div class="fh-ad-panel-body">
            ${n}
            <div class="fh-hist-scroll">${l}</div>
          </div>
        </div>
        <div class="fh-ad-history-rail">
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1">
              <div class="fh-ad-tasks-panel-title">Rewards &amp; points</div>
              <div class="fh-ad-tasks-panel-sub">last 30 days \xB7 filtered with left panel</div>
            </div>
          </div>
          <div class="fh-ad-history-rail-body">
            ${g}
          </div>
        </div>
      </div>`}function er(e,t,a){let s=e.family_name||"Family Hub",o=e.points_per_dollar||10,r=e.show_dollar_value_to_kids||!1,n=e.category_labels||[],i=e.penalty_alert_time!==void 0?e.penalty_alert_time:800,d=e.rank_eval_weekday!==void 0?e.rank_eval_weekday:0,c=e.rooms_config||{},l=e.weather_entity||"",b=e.today_calendar_entities||[],g=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],y=n.map(S=>`
      <div class="fh-cat-chip"
           draggable="true"
           data-drag-id="${C(S)}"
           data-drag-type="category"
           title="Drag to reorder">
        <span class="fh-cat-chip-handle">\u283F</span>
        <span>${m(S)}</span>
        <button class="fh-cat-chip-del" data-act="remove-cat-label"
                data-label="${C(S)}" title="Remove">\xD7</button>
      </div>`).join(""),x=Ke.map(S=>{var u;let k=(((u=c[S.id])==null?void 0:u.status)??S.status)!=="hidden",E=S.status==="coming";return`
          <div class="fh-hub-room-row" data-room-id="${C(S.id)}">
            <div class="fh-hub-room-icon" style="color:${S.accent}">${S.icon}</div>
            <div class="fh-hub-room-info">
              <div class="fh-hub-room-name">${m(S.label)}</div>
              <div class="fh-hub-room-sub">${m(S.sub)}${E?" \xB7 <em>coming soon</em>":""}</div>
            </div>
            <label class="fh-toggle">
              <input type="checkbox" class="fh-hub-room-toggle"
                     data-room-id="${C(S.id)}"
                     ${k?"checked":""}>
              <span class="fh-toggle-slider"></span>
            </label>
          </div>`}).join("");return`
      <div class="fh-ad-settings-grid">

        <div class="fh-ad-panel fh-ad-settings-left">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Hub configuration</span>
          </div>
          <div class="fh-ad-panel-body">
            <div class="fh-toggle-row">
              <span style="font-size:.9rem">Show dollar value to kids</span>
              <label class="fh-toggle">
                <input type="checkbox" data-act="toggle-dollar" ${r?"checked":""}>
                <span class="fh-toggle-slider"></span>
              </label>
            </div>
            <div class="fh-point-row">
              <div style="flex:1;min-width:0">
                <div style="font-size:.9rem;font-weight:600">${m(s)}</div>
                <div style="font-size:.75rem;color:var(--fh-text-sec)">${o} points per dollar (base rate)</div>
              </div>
              <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-settings"
                      data-fname="${C(s)}" data-ppd="${o}"
                      data-palerttime="${i}">
                ${j.settings} Edit
              </button>
            </div>
            <div class="fh-point-row">
              <div style="flex:1;min-width:0">
                <div style="font-size:.9rem;font-weight:600">Ranks</div>
                <div style="font-size:.75rem;color:var(--fh-text-sec)">
                  Per-kid curves \xB7 reward \xA2/pt ladder \xB7 evaluated every ${g[d]}
                </div>
              </div>
              <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-ranks">
                ${j.settings} Manage
              </button>
            </div>
            <div class="fh-divider"></div>
            <div>
              <div class="fh-label" style="margin-bottom:6px">Category labels</div>
              <div class="fh-field-help" style="margin-bottom:6px;font-size:.78rem;color:var(--fh-text-sec)">
                Shared by Tasks and Rewards sections.
              </div>
              <div class="fh-cat-labels" style="margin-bottom:8px">
                ${y||'<span style="font-size:.82rem;color:var(--fh-text-sec)">No labels yet.</span>'}
              </div>
              <div class="fh-row" style="gap:6px">
                <input class="fh-input" id="cat-label-input" type="text"
                       placeholder="New label\u2026" style="flex:1">
                <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="add-cat-label">
                  ${j.plus} Add
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
            <div class="fh-hub-room-list">${x}</div>
            <div class="fh-divider"></div>
            <div class="fh-field">
              <label class="fh-label">Weather entity</label>
              <input class="fh-input" id="m-hub-weather" type="text"
                     value="${C(l)}"
                     placeholder="weather.home">
              <div class="fh-field-help">
                HA <code>weather.*</code> entity used in the today strip. Blank to hide.
              </div>
            </div>
            <div class="fh-field">
              <label class="fh-label">Calendar entities</label>
              <textarea class="fh-input" id="m-hub-calendars" rows="3"
                        placeholder="calendar.family&#10;calendar.school"
                        style="font-family:var(--fh-font-mono);font-size:.85rem;resize:vertical">${m(b.join(`
`))}</textarea>
              <div class="fh-field-help">
                One <code>calendar.*</code> entity per line. Powers the today strip when the Calendar room ships in v0.8.0.
              </div>
            </div>
          </div>
        </div>

      </div>`}function La(e,t){let a=Q[e.type]||{label:e.type,color:"var(--fh-text-sec)"},s=e.person_color||L,o=e.points_delta?`<span style="color:${e.points_delta>0?"var(--fh-success)":"var(--fh-overdue)"}">
             ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"",r="";return e.reversible==="excuse"&&t?r=`<button class="fh-btn fh-btn-warning fh-btn-sm"
                             data-act="excuse-task"
                             data-iid="${e.reference_id}"
                             data-excused-by="${t.person_id}"
                             title="Reverse penalty for this skipped task">
                       ${j.excuse} Excuse
                     </button>`:e.reversible==="mark_complete"&&t?r=`<button class="fh-btn fh-btn-success fh-btn-sm"
                             data-act="mark-complete"
                             data-iid="${e.reference_id}"
                             data-marked-by="${t.person_id}"
                             title="Retroactively mark as done and award points">
                       ${j.check} Mark done
                     </button>`:e.reversible==="reject"&&t&&(r=`<button class="fh-btn fh-btn-danger fh-btn-sm"
                             data-act="reject-task"
                             data-iid="${e.reference_id}"
                             data-rejected-by="${t.person_id}"
                             title="Claw back points for this task">
                       ${j.close} Reject
                     </button>`),`
      <div class="fh-hist-row" style="--hist-color:${a.color}">
        <div class="fh-avatar" style="background:${s};width:26px;height:26px;font-size:var(--fh-text-xs)">
          ${e.person_name?N(e.person_name):"\u2014"}
        </div>
        <div class="fh-hist-info">
          <div class="fh-hist-label">${m(a.label)}</div>
          <div class="fh-hist-name">${m(e.chore_name||e.note||"")}</div>
          <div class="fh-hist-meta">
            ${e.person_name?m(e.person_name)+" \xB7 ":""}${Z(e.timestamp)}
            ${e.actor?` \xB7 by ${m(e.actor)}`:""}
            ${o}
          </div>
        </div>
        ${r?`<div class="fh-hist-actions">${r}</div>`:""}
      </div>`}function tr(e,t,a){let s=a._expandedSkippedDates.has(e.key),o=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty",r=e.items.map(n=>{let i=n.person_color||L,d=n.points_delta?`<span style="color:var(--fh-overdue);font-weight:700">${n.points_delta}pts</span>`:"",c="";return t&&n.reversible==="excuse"&&(c=`<button class="fh-btn fh-btn-warning fh-btn-sm"
                                 data-act="excuse-task"
                                 data-iid="${n.reference_id}"
                                 data-excused-by="${t.person_id}"
                                 title="Reverse this penalty">
                           ${j.excuse} Excuse
                         </button>`),`
          <div class="fh-hist-subrow">
            <div class="fh-avatar" style="background:${i};width:24px;height:24px;font-size:var(--fh-text-xs);flex-shrink:0">
              ${n.person_name?N(n.person_name):"\u2014"}
            </div>
            <div class="fh-hist-info" style="flex:1;min-width:0">
              <div class="fh-hist-name">${m(n.person_name?n.person_name+" \u2014 ":"")+m(n.chore_name||"")}</div>
              <div class="fh-hist-meta">${d}</div>
            </div>
            ${c}
          </div>`}).join("");return`
      <div class="fh-hist-group">
        <div class="fh-hist-group-hdr" data-act="toggle-skipped-group" data-key="${e.key}">
          <div class="fh-hist-info" style="flex:1;min-width:0">
            <div class="fh-hist-label" style="color:var(--fh-warning)">Skipped chores</div>
            <div class="fh-hist-name">${m(e.dateDisplay)} \xB7 ${o}</div>
          </div>
          ${t&&a._histFilter&&e.items.some(n=>n.reversible==="excuse")?`
            <button class="fh-btn fh-btn-warning fh-btn-sm" data-act="excuse-day"
                    data-pid="${C(a._histFilter)}" data-day="${C(e.date)}"
                    title="Excuse every skipped chore this day">
              ${j.excuse} Excuse day
            </button>`:""}
          <span class="fh-hist-expand-icon">${s?"\u25B2":"\u25BC"}</span>
        </div>
        <div class="fh-hist-subitems"${s?"":' style="display:none"'}>${r}</div>
      </div>`}var ja=O(()=>{W();W();V();st();it();Ne()});function ar(e,t){let a=new Date,s=a.toLocaleDateString("en-US",{weekday:"long"}),o=a.toLocaleDateString("en-US",{month:"short",day:"numeric"});return`
        <div class="fh-home-header">
            <div class="fh-home-family">${m(e)}</div>
            <div class="fh-home-header-right">
                <div class="fh-home-date">${s}, ${o}</div>
                ${t?'<div class="fh-home-paused-pill">PAUSED</div>':""}
            </div>
        </div>
    `}function or(e,t,a){if(!e.length)return"";let s=a._attrs("sensor.family_hub_claimable_tasks").all_tasks||[];return`
        <div class="fh-home-section">
            <div class="fh-home-section-label">// AGENTS ON DUTY</div>
            <div class="fh-home-agents-row">${e.map(r=>{var h;let n=r.avatar_color||L,i=r.code||"",d=Te(r.theme_key||"classic"),c=d.tint,l=d.sigil,b=a._personEntityId(r.name),g=a._attrs(b),y=parseInt(((h=a._states(b))==null?void 0:h.state)??r.lifetime_points??0),x=g.show_dollar_value?g.dollar_value:null,S=d.rankTitle(r.rank_index!==void 0?r.rank_index:0),p=d.homeTileSubLabel(r),k=s.filter(_=>_.assigned_to===r.person_id&&_.status==="pending").length,E=t.filter(_=>_.person_id===r.person_id).length,u=r.allowance_points&&r.allowance_schedule?`<div class="fh-home-agent-allowance">+${r.allowance_points}/${r.allowance_schedule==="weekly"?"wk":r.allowance_schedule==="bi_weekly"?"2wk":"mo"}</div>`:"";return`
            <div class="fh-home-agent-tile"
                 data-act="nav" data-nav-view="person:${C(r.person_id)}"
                 style="--tile-color:${n};--tile-tint:${c}">
                <div class="fh-home-agent-sigil">${l}</div>
                ${E>0?`<div class="fh-home-agent-pending-dot" title="${E} pending"></div>`:""}
                <div class="fh-home-agent-code">AGT &middot; ${i?m(i):m(r.name.toUpperCase())}</div>
                <div class="fh-home-agent-name">${m(r.name)}</div>
                <div class="fh-home-agent-sublabel">${m(S)} &middot; ${m(p)}</div>
                <div class="fh-home-agent-spacer"></div>
                <div class="fh-home-agent-dual">
                    <div class="fh-home-agent-stat">
                        <span class="fh-home-agent-stat-num">${P(y)}</span>
                        <span class="fh-home-agent-stat-lbl">PTS</span>
                        ${x!=null?`<span class="fh-home-agent-stat-dollar">${H(x)}</span>`:""}
                    </div>
                    <div class="fh-home-agent-stat-div"></div>
                    <div class="fh-home-agent-stat">
                        <span class="fh-home-agent-stat-num" style="${k>0?`color:${n}`:"color:var(--fh-text-sec)"}">${k}</span>
                        <span class="fh-home-agent-stat-lbl">OPEN</span>
                    </div>
                </div>
                ${u}
            </div>`}).join("")}</div>
        </div>`}function sr(e,t){let a=t.rooms_config||{};return`
        <div class="fh-home-section">
            <div class="fh-home-section-label">ROOMS</div>
            <div class="fh-home-rooms-grid">${Ke.map(o=>{var c;let r=((c=a[o.id])==null?void 0:c.status)||o.status;if(r==="hidden")return"";let n=r==="live",i=n?o.getStats(e):[],d=i.map(l=>`
            <div class="fh-home-room-stat">
                <span class="fh-home-room-stat-num" style="color:${l.accent||o.accent}">${l.value}</span>
                <span class="fh-home-room-stat-lbl">${m(l.label)}</span>
            </div>
        `).join("");return`
            <div class="fh-home-room-tile ${n?"live":"coming"}"
                 data-act="nav" data-nav-view="room:${C(o.id)}"
                 style="--room-accent:${o.accent}">
                <div class="fh-home-room-icon" style="color:${o.accent}">${o.icon}</div>
                <div class="fh-home-room-body">
                    <div class="fh-home-room-label">${m(o.label)}</div>
                    <div class="fh-home-room-sub">${m(o.sub)}</div>
                    ${n&&i.length?`<div class="fh-home-room-stats">${d}</div>`:""}
                    ${n?"":`
                        <div class="fh-home-room-coming">COMING SOON</div>
                        ${o.preview?`<div class="fh-home-room-preview">${m(o.preview)}</div>`:""}
                    `}
                </div>
            </div>
        `}).join("")}</div>
        </div>
    `}function rr(e,t,a){var r,n;let s=e.length,o="";if(t){let i=a._states(t);if(i){let d=i.state||"",c=(r=i.attributes)==null?void 0:r.temperature,l=((n=i.attributes)==null?void 0:n.temperature_unit)||"\xB0";o=`
                <div class="fh-home-today-weather">
                    <div class="fh-home-today-weather-icon">${ir(d)}</div>
                    <div>
                        <div class="fh-home-today-temp">${c!==void 0?`${Math.round(c)}${l}`:"\u2014"}</div>
                        <div class="fh-home-today-cond">${m(nr(d))}</div>
                    </div>
                </div>
            `}}return`
        <div class="fh-home-today-strip">
            ${o}
            <div class="fh-home-today-flex">
                ${s>0?`
                    <div class="fh-home-today-approvals">
                        <span class="fh-home-today-approvals-badge">${s}</span>
                        <span class="fh-home-today-approvals-lbl">${s===1?"approval pending":"approvals pending"}</span>
                    </div>
                `:`
                    <div class="fh-home-today-quiet">All clear &#8212; no approvals waiting</div>
                `}
            </div>
        </div>
    `}function nr(e){return{sunny:"Sunny",clear_night:"Clear",partlycloudy:"Partly Cloudy",cloudy:"Cloudy",fog:"Foggy",rainy:"Rain",pouring:"Heavy Rain",snowy:"Snow",snowy_rainy:"Sleet",windy:"Windy",windy_variant:"Windy",lightning:"Thunderstorm",lightning_rainy:"Thunderstorm",hail:"Hail",exceptional:"Unusual"}[e]||e.replace(/_/g," ").replace(/\b\w/g,a=>a.toUpperCase())}function ir(e){return e==="sunny"||e==="clear_night"?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>':e==="rainy"||e==="pouring"?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19a4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4m0-6a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m12-3a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3M6 5a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1z"/></svg>':e==="snowy"||e==="snowy_rainy"?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m22 11-1.5-1.5-2 2L17 10l2-2-1.5-1.5L16 8l-1.5-1.5.5-2-2.5-.5.5 2L11 7.5V5l-1.5-1.5L8 5v2.5L6.5 6.5 6 4l-2.5.5.5 2L2.5 8 1 9.5l1.5 1.5 2-2L6 10.5l-2 2L5.5 14 7 12.5 8.5 14l-.5 2 2.5.5-.5-2 1.5-1.5v2.5l1.5 1.5 1.5-1.5V13l1.5 1.5 1.5-1.5-1.5-1.5 2-2 1.5 1.5 1.5-1.5z"/></svg>':e.includes("cloud")||e==="fog"?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>':e.includes("lightning")?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>':'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>'}var Ga,Ua=O(()=>{st();qe();V();W();Ga={render(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=e._people().filter(i=>i.active!==!1),s=t.family_name||"Family Hub",o=!!t.penalties_paused_global,r=t.approval_queue||[],n=t.weather_entity||"";return`
            ${ar(s,o)}
            ${or(a,r,e)}
            ${sr(e,t)}
            ${rr(r,n,e)}
        `}}});function qa(e){return Wa[e]||Wa.classic}var Wa,Ka=O(()=>{Ua();Wa={classic:Ga}});function kt(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=e._cfg.hub_skin||t.hub_skin||"classic";return qa(a).render(e)}function Va(e){return`
        <div class="fh-nav-back-bar" data-act="nav-back">
            <span class="fh-nav-back-chevron">&#8592;</span>
            <span class="fh-nav-back-label">${m(e)}</span>
        </div>
    `}var Ja=O(()=>{Ka();V()});function Ya(e){let t=(e==null?void 0:e.type)||"daily";if(t==="daily"){let a=e.day_filter||[];if(!a.length||a.length===7)return"Every day";let s=[...a].sort((r,n)=>r-n),o=!0;for(let r=1;r<s.length;r++)if(s[r]!==s[r-1]+1){o=!1;break}return o&&s.length>=3?`${lt[s[0]]}\u2013${lt[s[s.length-1]]}`:s.map(r=>lt[r]).join(" ")}if(t==="weekly"){let a=e.weekdays||[];return a.length?a.map(s=>lt[s]).join(" "):"Weekly"}return t==="every_n_days"?`Every ${e.interval||2} days`:t==="every_n_weeks"?`Every ${e.interval||2} weeks`:t==="monthly_on_date"?"Monthly":t==="one_time"?"One time":t}function lr(e){let t=(e==null?void 0:e.type)||"daily";if(t==="daily")return(e.day_filter||[]).length||7;if(t==="weekly")return(e.weekdays||[]).length||1;if(t==="every_n_days"){let a=e.interval||1;return a>0?7/a:0}if(t==="every_n_weeks"){let a=e.interval||1;return a>0?1/a:0}return t==="monthly_on_date"?(e.days_of_month&&e.days_of_month.length?e.days_of_month.length:1)*12/52:0}function dr(e){let t=e.rotation_cadence;return t==="weekly"?"Weekly":t==="per_instance"?"Each time":t==="daily"?"Daily":t||"\u2014"}function $t(e){let t=[];return e.points>0&&t.push(`<span class="pl-pts">+${e.points}</span>`),e.penalty_enabled&&e.penalty_points>0&&t.push(`<span class="pl-penalty">\u2212${e.penalty_points}</span>`),t.join("")}function cr(e){let t=e.description?`<div class="pl-desc">${K(e.description)}</div>`:"";return`
      <tr>
        <td class="pl-name"><div>${K(e.name)}</div>${t}</td>
        <td class="pl-when">${K(Ya(e.recurrence))}</td>
        <td class="pl-points">${$t(e)}</td>
      </tr>`}function _t(e,t,a){if(!t.length)return"";let s=a?`<div class="pl-section-sub">${K(a)}</div>`:"";return`
      <section class="pl-section">
        <header class="pl-section-head"><h2>${K(e)}</h2>${s}</header>
        <table class="pl-table">
          <thead><tr><th>Chore</th><th>When</th><th class="pl-points">Pts</th></tr></thead>
          <tbody>${t.map(cr).join("")}</tbody>
        </table>
      </section>`}function pr(e){let t=(e==null?void 0:e.family_name)||"Family",a=(e==null?void 0:e.people)||[],s=(e==null?void 0:e.active_chores)||[],o=e!=null&&e.rank_ppd_ladder&&e.rank_ppd_ladder.length?e.rank_ppd_ladder:[3,3.5,4,4.5,5],r=Math.min(2,o.length-1),n=o[Math.max(0,r)],i=v=>`$${(v*n/100).toFixed(2)}`,d=new Date().toLocaleDateString(void 0,{weekday:"long",year:"numeric",month:"long",day:"numeric"}),c=a.filter(v=>v.type==="kid"&&v.active!==!1),l=c.map(v=>v.person_id),b=v=>{var M;return((M=a.find(A=>A.person_id===v))==null?void 0:M.name)||"\u2014"},g=v=>{var M;return((M=a.find(A=>A.person_id===v))==null?void 0:M.active)!==!1},y=v=>(v.rotation_pool||[]).length>1&&v.rotation_cadence,x=v=>l.length>0&&l.every(M=>(v.assigned_to||[]).includes(M)),S=[],p=[],k=[],E=[],u=new Map;c.forEach(v=>u.set(v.person_id,[]));for(let v of s){if(v.chore_type==="reminder"){let M=v.assigned_to||[];(!M.length||M.some(A=>l.includes(A)))&&E.push(v);continue}if(v.chore_type==="claimable"){k.push(v);continue}if(y(v)){p.push(v);continue}if(x(v)){S.push(v);continue}for(let M of v.assigned_to||[])u.has(M)&&u.get(M).push(v)}let h={};l.forEach(v=>h[v]=0);for(let v of s){if(v.chore_type!=="assigned")continue;let M=lr(v.recurrence)*(v.points||0);if(!(M<=0))if(y(v)){let A=(v.rotation_pool||[]).filter(D=>l.includes(D)&&g(D));if(!A.length)continue;let T=M/A.length;A.forEach(D=>{h[D]+=T})}else for(let A of v.assigned_to||[])h[A]!=null&&(h[A]+=M)}let _='<span class="pl-rot" title="Rotates">\u21BB</span> ',z=(v,M)=>{let A=v.description?`<div class="pl-desc">${K(v.description)}</div>`:"";return`
          <tr>
            <td class="pl-name"><div>${M?_:""}${K(v.name)}</div>${A}</td>
            <td class="pl-when">${K(Ya(v.recurrence))}</td>
            <td class="pl-points">${$t(v)}</td>
          </tr>`},$=c.map(v=>{let M=u.get(v.person_id)||[],A=p.filter(U=>((U.assigned_to||[])[0]||null)===v.person_id),T=Math.round(h[v.person_id]||0),D=M.length||A.length?`<table class="pl-table">
                 <thead><tr><th>Chore</th><th>When</th><th class="pl-points">Pts</th></tr></thead>
                 <tbody>${M.map(U=>z(U,!1)).join("")}${A.map(U=>z(U,!0)).join("")}</tbody>
               </table>`:'<div class="pl-section-note">Just the shared + rotation chores (see above &amp; below).</div>';return`
          <section class="pl-section">
            <header class="pl-section-head pl-kid-head">
              <h2>${K(v.name)}</h2>
              <span class="pl-kid-total">~${T} pts/wk \xB7 ${i(h[v.person_id]||0)}</span>
            </header>
            ${D}
            <div class="pl-section-note">+ everyone chores (top of sheet)${A.length?" \xB7 \u21BB = rotates, see schedule":""}</div>
          </section>`}).join(""),F="";p.length&&(F=`
          <section class="pl-section">
            <header class="pl-section-head">
              <h2>Rotation schedule</h2>
              <div class="pl-section-sub">Who's up now is in <b>bold</b>; the next name is whose turn comes after. Plan or adjust turns here.</div>
            </header>
            <table class="pl-table pl-rot-table">
              <thead><tr><th>Chore</th><th class="pl-points">Pts</th><th>Rotates (in order)</th><th>Switches</th></tr></thead>
              <tbody>${p.map(M=>{let A=(M.rotation_pool||[]).filter(g),T=(M.assigned_to||[])[0]||A[0],D=A.map(U=>U===T?`<b>${K(b(U))}</b>`:K(b(U))).join(" \u2192 ");return`
              <tr>
                <td class="pl-name">${K(M.name)}</td>
                <td class="pl-points">${$t(M)}</td>
                <td>${D}</td>
                <td class="pl-when">${K(dr(M))}</td>
              </tr>`}).join("")}</tbody>
            </table>
          </section>`);let R=_t("Everyone \u2014 every kid does these",S),B=_t("Up for grabs",k,"Anyone can claim \u2014 first done gets the points."),f=_t("Reminders",E,"No points \u2014 just a daily nudge."),w=`${c.length} kid${c.length===1?"":"s"} \xB7 ${S.length} shared \xB7 ${p.length} rotating \xB7 +earned / \u2212penalty if skipped \xB7 $ shown at Rank 3 (mid-point rate)`;return`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${K(t)} \u2014 Chore List</title>
<style>
  :root {
    --ink: #1a1a1a;
    --ink-sec: #555;
    --rule: #d0d0d0;
    --panel: #f3f3f3;
    --accent: #2563eb;
    --penalty: #c0392b;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                 "Helvetica Neue", Arial, sans-serif;
    font-size: 12pt; line-height: 1.3;
    color: var(--ink); background: #fff;
  }
  body { padding: 30px 34px; max-width: 8.5in; margin: 0 auto; }
  header.pl-doc-head {
    display: flex; align-items: baseline; justify-content: space-between;
    margin: 0 0 12px; padding-bottom: 8px;
    border-bottom: 2px solid var(--ink);
  }
  header.pl-doc-head h1 { margin: 0; font-size: 22pt; letter-spacing: -0.01em; }
  header.pl-doc-head .pl-doc-date {
    font-size: 10pt; color: var(--ink-sec); font-variant-numeric: tabular-nums;
  }
  .pl-doc-summary { font-size: 9.5pt; color: var(--ink-sec); margin: 0 0 16px; }
  .pl-section { margin: 0 0 16px; page-break-inside: avoid; break-inside: avoid; }
  .pl-section-head { margin: 0 0 6px; }
  .pl-section-head h2 {
    margin: 0; font-size: 13pt; font-weight: 700;
    letter-spacing: 0.02em; text-transform: uppercase;
    padding: 4px 8px; background: var(--panel);
    border-left: 4px solid var(--ink); display: inline-block;
  }
  .pl-section-head.pl-kid-head {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .pl-kid-total {
    font-size: 11pt; font-weight: 700; color: var(--accent);
    white-space: nowrap; font-variant-numeric: tabular-nums;
  }
  .pl-section-sub { margin: 4px 0 0; font-size: 9pt; color: var(--ink-sec); font-style: italic; }
  .pl-section-note { margin: 4px 0 0; font-size: 8.5pt; color: var(--ink-sec); font-style: italic; }
  table.pl-table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 11pt; }
  table.pl-table th, table.pl-table td {
    text-align: left; padding: 4px 8px;
    border-bottom: 1px solid var(--rule); vertical-align: top;
  }
  table.pl-table th {
    font-size: 9pt; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--ink-sec); font-weight: 600; border-bottom: 1.5px solid var(--ink);
  }
  table.pl-table td.pl-name { font-weight: 600; }
  table.pl-table td.pl-name .pl-desc {
    font-weight: 400; font-size: 9.5pt; color: var(--ink-sec); margin-top: 2px;
  }
  table.pl-table td.pl-when { width: 22%; font-variant-numeric: tabular-nums; font-weight: 400; }
  table.pl-table .pl-points { width: 64px; text-align: right; font-variant-numeric: tabular-nums; font-weight: 700; }
  .pl-pts { display: block; }
  .pl-penalty { display: block; color: var(--penalty); font-weight: 700; font-size: 10pt; }
  .pl-rot { color: var(--accent); font-weight: 700; }
  /* Rotation schedule table */
  .pl-rot-table td, .pl-rot-table th { font-size: 10.5pt; }
  .pl-rot-table td.pl-name { width: 38%; }
  .pl-rot-table td.pl-when { width: 18%; }
  .pl-toolbar { position: fixed; top: 12px; right: 12px; display: flex; gap: 6px; }
  .pl-toolbar button {
    font: inherit; font-size: 10pt; padding: 6px 12px; cursor: pointer;
    border: 1px solid var(--ink); background: #fff; border-radius: 4px;
  }
  .pl-toolbar button:hover { background: var(--panel); }
  footer.pl-doc-foot {
    margin-top: 22px; padding-top: 8px; border-top: 1px solid var(--rule);
    font-size: 8.5pt; color: var(--ink-sec); text-align: center;
  }
  @media print {
    .pl-toolbar { display: none; }
    body { padding: 0; }
    @page { margin: 0.5in; }
  }
</style>
</head>
<body>
  <div class="pl-toolbar">
    <button onclick="window.print()">Print</button>
    <button onclick="window.close()">Close</button>
  </div>

  <header class="pl-doc-head">
    <h1>${K(t)} \u2014 Chores</h1>
    <div class="pl-doc-date">${K(d)}</div>
  </header>

  <p class="pl-doc-summary">${K(w)}</p>

  ${R}
  ${$}
  ${F}
  ${B}
  ${f}

  <footer class="pl-doc-foot">
    Generated by Family Hub \xB7 ${K(new Date().toLocaleString())}
  </footer>
</body>
</html>`}function Xa(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=pr(t),s=window.open("","_blank");if(!s){let o=new Blob([a],{type:"text/html"}),r=URL.createObjectURL(o);if(!window.open(r,"_blank")){let i=document.createElement("div");i.style.cssText="position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#1c1c1e;color:#fff;padding:12px 18px;border-radius:8px;z-index:9999;font:14px/1.5 sans-serif",i.innerHTML=`Pop-ups are blocked. <a href="${r}" target="_blank" style="color:#64d2ff">Open chore list</a>`,document.body.appendChild(i),setTimeout(()=>i.remove(),15e3)}return}s.document.open(),s.document.write(a),s.document.close(),s.document.title=`${(t==null?void 0:t.family_name)||"Family"} \u2014 Chore List`}var K,lt,Qa=O(()=>{K=e=>String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),lt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]});function Et(e,t,a){var i,d,c,l,b,g,y,x,S,p,k,E,u,h,_,z,$,F,R,B;let s=a.shadowRoot,o=f=>{var w;return((w=s.getElementById(f))==null?void 0:w.value)??""},r=f=>{var w;return((w=s.getElementById(f))==null?void 0:w.checked)??!1},n=f=>parseInt(o(f)||"0");switch(e){case"nav":{let f=t.dataset.navView;if(!f)break;a._backStack.push(a._view||"home"),a._view=f,a._doRender(!0);break}case"nav-back":a._view=a._backStack.pop()||"home",a._doRender(!0);break;case"filter":a._filter=a._filter===t.dataset.pid?null:t.dataset.pid,a._doRender(!0);break;case"tab":a._tab=t.dataset.tab,a._doRender(!0);break;case"admin-sec":a._adminSec=t.dataset.sec,a._doRender(!0);break;case"hist-filter":a._histFilter=t.dataset.hpid||null,a._doRender(!0);break;case"chore-filter":a._choreFilter=t.value||null,a._doRender(!0);break;case"chore-status-filter":a._choreStatusFilter=t.value||null,a._doRender(!0);break;case"chore-rec-filter":a._choreRecFilter=t.value||null,a._doRender(!0);break;case"stats-rank":a._statsRankOverride=t.value,a._doRender(!0);break;case"stats-completion":a._statsCompletionPct=Number(t.value)||100,a._doRender(!0);break;case"stats-streak-pct":a._statsStreakPct=Number(t.value)||50,a._doRender(!0);break;case"chore-tab":{let f=t.dataset.tab;if(!f)break;a._choreFormTab=f,s.querySelectorAll(".fh-chore-tab").forEach(w=>{w.classList.toggle("active",w.dataset.tab===f)}),s.querySelectorAll(".fh-chore-tab-pane").forEach(w=>{w.style.display=w.dataset.tab===f?"":"none"}),a._syncModalUI();break}case"sort-admin-chores":{let f=t.dataset.col||null;if(!f)a._adminSort={col:null,dir:"asc"};else{let w=a._adminSort||{col:null,dir:"asc"};w.col===f?a._adminSort=w.dir==="asc"?{col:f,dir:"desc"}:{col:null,dir:"asc"}:a._adminSort={col:f,dir:"asc"}}a._doRender(!0);break}case"select-store-row":a._adminSelectedItemId=t.dataset.iid||null,a._adminSelectedChoreId=null,a._doRender(!0);break;case"close-store-panel":a._adminSelectedItemId=null,a._doRender(!0);break;case"sort-admin-store-items":{let f=t.dataset.col||null;if(!f)a._adminSortItems={col:null,dir:"asc"};else{let w=a._adminSortItems||{col:null,dir:"asc"};w.col===f?a._adminSortItems=w.dir==="asc"?{col:f,dir:"desc"}:{col:null,dir:"asc"}:a._adminSortItems={col:f,dir:"asc"}}a._doRender(!0);break}case"store-item-filter":a._storeItemFilter=t.dataset.fval||null,a._doRender(!0);break;case"toggle-admin-reward-cat":{let f=t.dataset.cat;if(!f)break;a._adminCollapsedRewardCats||(a._adminCollapsedRewardCats=new Set),a._adminCollapsedRewardCats.has(f)?a._adminCollapsedRewardCats.delete(f):a._adminCollapsedRewardCats.add(f),a._doRender(!0);break}case"ok-edit-store-item-inline":{let f=o("m-eiid"),v=(a._attrs("sensor.family_hub_needs_attention").store_items||[]).find(A=>A.item_id===f),M=St(o,s,!0,(v==null?void 0:v.is_group_reward)??!1);if(!M)break;a._svc("update_store_item",M),a._adminSelectedItemId=null,a._doRender(!0);break}case"open-ranks":a._ranksTab=t.dataset.pid||"global",a._modal={type:"ranks",surface:"drawer",data:{}},a._doRender(!0);break;case"ranks-tab":a._ranksTab=t.dataset.tab||"global",a._doRender(!0);break;case"ranks-preview":{let f=Math.max(0,parseInt(o("m-curve-cap")||"0")),w=[],v=[];for(let T=0;T<5;T++)w.push(Math.max(0,parseFloat(o(`m-gain-pct-${T}`))||0)),v.push(Math.max(0,parseFloat(o(`m-drop-pct-${T}`))||0));let{gain:M,drop:A}=rt(f,w,v);for(let T=0;T<5;T++){let D=s.getElementById(`m-gain-pct-${T}`),U=s.getElementById(`m-drop-pct-${T}`),se=s.getElementById(`m-gain-pts-${T}`),Je=s.getElementById(`m-drop-pts-${T}`);se&&D&&!D.disabled&&(se.textContent=M[T]),Je&&U&&!U.disabled&&(Je.textContent=A[T])}break}case"save-ranks-global":{let f=s.querySelectorAll(".fh-ad-rank-ladder-input"),w=[],v=!0;f.forEach(U=>{let se=parseFloat(U.value);if(isNaN(se)||se<=0){v=!1;return}w.push(se)});let M=Math.max(0,parseInt(o("m-rank-cap")||"100")),A=Math.max(0,parseInt(o("m-rank-drop")||"60")),T=Math.max(0,parseInt(o("m-rank-gain")||"80")),D={rank_eval_weekday:parseInt(o("m-rank-weekday")||"0"),rank_default_cap:M,rank_default_drop_pct:A,rank_default_gain_pct:T,rank_drop_threshold:Math.round(M*A/100/5)*5,rank_gain_threshold:Math.round(M*T/100/5)*5};v&&w.length&&(D.rank_ppd_ladder=w),a._svc("update_settings",D),a._closeModal();break}case"save-ranks-kid":{let f=o("m-rank-pid");if(!f)break;let w=Math.max(0,parseInt(o("m-curve-cap")||"0")),v=[],M=[];for(let D=0;D<5;D++)v.push(Math.max(0,parseFloat(o(`m-gain-pct-${D}`))||0)),M.push(Math.max(0,parseFloat(o(`m-drop-pct-${D}`))||0));let{gain:A,drop:T}=rt(w,v,M);a._svc("update_person",{person_id:f,rank_index:Math.max(0,Math.min(4,parseInt(o("m-rank-idx")||"0"))),rank_gain_thresholds:A,rank_drop_thresholds:T,rank_curve:{cap:w,gain_pcts:v,drop_pcts:M}}),a._closeModal();break}case"toggle-admin-cat":{let f=t.dataset.cat;if(!f)break;a._adminCollapsedCats||(a._adminCollapsedCats=new Set),a._adminCollapsedCats.has(f)?a._adminCollapsedCats.delete(f):a._adminCollapsedCats.add(f),a._doRender(!0);break}case"complete":{let f=t.dataset.tid,w=t.dataset.pid;if(!f||!w)break;let v=parseInt(t.dataset.streak||"0"),M=parseInt(t.dataset.milestone||"0");M>0&&(v+1)%M===0&&(a._celebration={name:t.dataset.name||"Mission",streak:v+1},setTimeout(()=>{a._celebration&&(a._celebration=null,a._doRender(!0))},3e3)),a._svc("complete_task",{task_id:f,person_id:w}),a._flashing.add(f),a._pendingSubmit.add(f),a._doRender(!0),setTimeout(()=>{a._flashing.delete(f),a._doRender(!1)},1450),setTimeout(()=>{a._pendingSubmit.has(f)&&(a._pendingSubmit.delete(f),a._doRender(!1))},35e3);break}case"dismiss-celebration":a._celebration=null,a._doRender(!0);break;case"toggle-desc":{let f=t.dataset.id;a._expandedDescs.has(f)?a._expandedDescs.delete(f):a._expandedDescs.add(f),a._doRender(!0);break}case"toggle-skipped-group":{let f=t.dataset.key,w=!a._expandedSkippedDates.has(f);w?a._expandedSkippedDates.add(f):a._expandedSkippedDates.delete(f);let v=t.closest(".fh-hist-group");if(v){let M=v.querySelector(".fh-hist-subitems"),A=v.querySelector(".fh-hist-expand-icon");M&&(M.style.display=w?"flex":"none"),A&&(A.textContent=w?"\u25B2":"\u25BC")}else a._doRender(!0);break}case"approve-task":{let f=a._people().find(w=>w.type==="parent");a._svc("approve_task",{task_id:t.dataset.tid,approved_by:(f==null?void 0:f.person_id)||""});break}case"deny-task":{let f=a._people().find(w=>w.type==="parent");a._svc("deny_task",{task_id:t.dataset.tid,denied_by:(f==null?void 0:f.person_id)||""});break}case"open-partial":a._modal={type:"partial-credit",data:{tid:t.dataset.tid,name:t.dataset.name||"",pts:t.dataset.pts||"0"}},a._doRender(!0);break;case"do-partial":{let f=a._people().find(w=>w.type==="parent");a._svc("approve_task",{task_id:t.dataset.tid,approved_by:(f==null?void 0:f.person_id)||"",credit_fraction:parseFloat(t.dataset.frac||"1")}),a._closeModal();break}case"approve-redemption":{let f=a._people().find(w=>w.type==="parent");a._svc("approve_redemption",{redemption_id:t.dataset.rid,approved_by:(f==null?void 0:f.person_id)||""});break}case"decline-redemption":{let f=a._people().find(w=>w.type==="parent");a._svc("decline_redemption",{redemption_id:t.dataset.rid,declined_by:(f==null?void 0:f.person_id)||""});break}case"excuse-task":a._svc("excuse_task",{instance_id:t.dataset.iid,excused_by:t.dataset.excusedBy,reason:""});break;case"mark-complete":a._svc("mark_task_complete",{instance_id:t.dataset.iid,marked_by:t.dataset.markedBy,reason:""});break;case"reject-task":a._svc("reject_task",{instance_id:t.dataset.iid,rejected_by:t.dataset.rejectedBy,reason:""});break;case"excuse-day":{let f=a._people().find(w=>w.type==="parent");a._svc("excuse_day",{person_id:t.dataset.pid,day:t.dataset.day,excused_by:(f==null?void 0:f.person_id)||""});break}case"claim-late":a._svc("claim_late_task",{task_id:t.dataset.iid,person_id:t.dataset.pid});break;case"redeem":a._svc("request_redemption",{person_id:t.dataset.pid,item_id:t.dataset.iid});break;case"request-cancel-sub":if(!confirm(`Cancel "${t.dataset.name||"this subscription"}"?
This requires parent approval before it takes effect.`))break;a._svc("request_cancel_subscription",{subscription_id:t.dataset.subid,person_id:t.dataset.pid});break;case"open-chip-in":{let f=t.dataset.iid,w=t.dataset.pid,v=parseInt(t.dataset.remaining||"0"),M=parseInt(t.dataset.balance||"0"),A=a._people().find(se=>se.person_id===w),T=A?`sensor.family_hub_${A.name.toLowerCase().replace(/ /g,"_")}`:null,U=((T?a._attrs(T):{}).store_items||[]).find(se=>se.item_id===f)||{item_id:f,name:"reward"};a._modal={type:"chip-in",data:{item:U,pid:w,balance:M,remaining:v}},a._doRender(!0);break}case"ok-chip-in":{let f=parseInt(o("m-chipin-pts")||"0"),w=o("m-chipin-iid"),v=o("m-chipin-pid");if(!f||f<=0||!w||!v){alert("Please enter a valid number of points.");break}a._svc("chip_in_group_reward",{item_id:w,person_id:v,points:f}),a._modal=null,a._doRender(!0);break}case"accept-group-proposal":a._svc("respond_group_proposal",{proposal_id:t.dataset.propid,person_id:t.dataset.pid,accept:!0});break;case"decline-group-proposal":if(!confirm("Decline this group reward proposal?"))break;a._svc("respond_group_proposal",{proposal_id:t.dataset.propid,person_id:t.dataset.pid,accept:!1});break;case"approve-group-proposal":a._svc("approve_group_proposal",{proposal_id:t.dataset.propid,approved_by:t.dataset.by||"admin"});break;case"decline-group-proposal-parent":if(!confirm("Decline this group reward proposal?"))break;a._svc("decline_group_proposal",{proposal_id:t.dataset.propid,declined_by:t.dataset.by||"admin"});break;case"redeem-group-reward":if(!confirm(`Mark "${t.dataset.iname}" as redeemed?

This will mark the reward inactive.`))break;a._svc("redeem_group_reward",{item_id:t.dataset.iid,redeemed_by:"admin"});break;case"toggle-goal":{let f=t.dataset.pid,w=t.dataset.iid;if(!f||!w)break;let v=a._people().find(T=>T.person_id===f);if(!v)break;let A=a._attrs(a._personEntityId(v.name)).goal_item_id===w?"":w;a._svc("update_person",{person_id:f,goal_item_id:A});break}case"delete-chore":if(!confirm(`Delete "${t.dataset.cname}"?

This cannot be undone.`))break;a._adminSelectedChoreId=null,a._svc("delete_chore",{chore_id:t.dataset.cid});break;case"delete-store-item":if(!confirm(`Deactivate reward "${t.dataset.iname}"?

It will be hidden from kids but stays in the list as [inactive]. Use "Delete permanently" in the edit panel to remove it completely.`))break;a._svc("delete_store_item",{item_id:t.dataset.iid});break;case"hard-delete-store-item":if(!confirm(`Permanently delete "${t.dataset.iname}"?

This cannot be undone. Any pending redemption requests for this reward will be cancelled.`))break;a._adminSelectedItemId=null,a._svc("hard_delete_store_item",{item_id:t.dataset.iid}),a._doRender(!0);break;case"remove-cat-label":{let f=t.dataset.label,w=a._attrs("sensor.family_hub_needs_attention").category_labels||[];a._svc("update_settings",{category_labels:w.filter(v=>v!==f)});break}case"add-cat-label":{let f=s.getElementById("cat-label-input"),w=(i=f==null?void 0:f.value)==null?void 0:i.trim();if(!w)break;let v=a._attrs("sensor.family_hub_needs_attention").category_labels||[];v.includes(w)||a._svc("update_settings",{category_labels:[...v,w]}),f&&(f.value="");break}case"save-hub-layout":{let f={};s.querySelectorAll(".fh-hub-room-toggle").forEach(A=>{let T=A.dataset.roomId;T&&(f[T]={status:A.checked?"live":"hidden"})});let w=((c=(d=s.getElementById("m-hub-weather"))==null?void 0:d.value)==null?void 0:c.trim())||"",M=(((l=s.getElementById("m-hub-calendars"))==null?void 0:l.value)||"").split(/[\n,]+/).map(A=>A.trim()).filter(Boolean);a._svc("update_settings",{rooms_config:f,weather_entity:w,today_calendar_entities:M});break}case"toggle-global-penalty":{let f=t.checked??((b=t.querySelector("input"))==null?void 0:b.checked)??!0;a._svc("update_settings",{penalties_paused:!f});break}case"toggle-person-penalty":{let f=t.dataset.pid||((g=t.closest("[data-pid]"))==null?void 0:g.dataset.pid),w=t.checked??((y=t.querySelector("input"))==null?void 0:y.checked)??!0;f&&a._svc("update_person",{person_id:f,penalties_paused:!w});break}case"export-backup":a._svc("export_backup",{});break;case"print-chore-list":Xa(a);break;case"rebuild-data":if(!confirm(`Rebuild data?

This will remove ghost records, orphaned instances, and duplicates. A summary will appear as a Home Assistant notification.

This cannot be undone.`))break;a._svc("rebuild_data",{});break;case"open-award":a._modal={type:"award",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"open-deduct":a._modal={type:"deduct",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"open-add-chore":a._adminSelectedChoreId=null,a._modal={type:"add-chore",surface:"drawer",data:{}},a._doRender(!0);break;case"select-chore-row":case"open-edit-chore":{let f=a._attrs("sensor.family_hub_needs_attention"),v=(f.all_chores||f.active_chores||[]).find(M=>M.chore_id===t.dataset.cid);if(!v)break;a._adminSelectedChoreId=null,a._modal={type:"edit-chore",surface:"drawer",data:{chore:v}},a._doRender(!0);break}case"open-add-store-item":a._adminSelectedItemId=null,a._modal={type:"add-store-item",data:{}},a._doRender(!0);break;case"open-edit-store-item":{let w=(a._attrs("sensor.family_hub_needs_attention").store_items||[]).find(v=>v.item_id===t.dataset.iid);if(!w)break;a._adminSelectedItemId=null,a._modal={type:"edit-store-item",data:{item:w}},a._doRender(!0);break}case"open-add-person":a._modal={type:"add-person",data:{}},a._doRender(!0);break;case"open-edit-person":a._modal={type:"edit-person",surface:"drawer",data:{pid:t.dataset.pid,pname:t.dataset.pname,ptype:t.dataset.ptype,pcolor:t.dataset.pcolor,allowancePts:parseInt(t.dataset.pallowpts||"0"),allowanceSched:t.dataset.pallowsched||"weekly",allowanceWday:parseInt(t.dataset.pallowwday??"5"),allowanceMday:parseInt(t.dataset.pallowmday||"1"),notifyTarget:t.dataset.pnotify||"",code:t.dataset.pcode||"",theme:t.dataset.ptheme||"classic",childMode:t.dataset.pchildmode==="true",completionThreshold:parseInt(t.dataset.pcompletionthreshold??"80"),completionMilestone:parseInt(t.dataset.pcompletionmilestone??"7"),completionBonusPoints:parseInt(t.dataset.pcompletionbonus??"50")}},a._doRender(!0);break;case"open-confirm-remove-person":a._modal={type:"confirm-remove-person",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"reactivate-person":a._svc("reactivate_person",{person_id:t.dataset.pid});break;case"open-confirm-hard-delete-person":a._modal={type:"confirm-hard-delete-person",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"open-edit-settings":a._modal={type:"edit-settings",surface:"drawer",data:{fname:t.dataset.fname,ppd:t.dataset.ppd,penaltyAlertTime:parseInt(t.dataset.palerttime??"800"),rankWeekday:parseInt(t.dataset.rankweekday??"0"),rankDrop:parseInt(t.dataset.rankdrop??"50"),rankGain:parseInt(t.dataset.rankgain??"75")}},a._doRender(!0);break;case"open-claim":a._modal={type:"claim",data:{tid:t.dataset.tid,name:t.dataset.name}},a._doRender(!0);break;case"open-add-reminder":a._modal={type:"add-reminder",data:{pid:t.dataset.pid||null}},a._doRender(!0);break;case"open-edit-streaks":a._modal={type:"edit-streaks",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"close-modal":a._closeModal();break;case"ok-point-adjust":{let f=parseFloat(o("m-amount")),w=o("m-atype"),v=o("m-reason"),M=o("m-pid"),A=o("m-amode");if(!f||f<=0)break;let T={person_id:M,reason:v};w==="dollars"?T.dollar_amount=f:T.points=Math.round(f),a._svc(A==="award"?"award_bonus_points":"deduct_points",T),a._closeModal();break}case"ok-add-chore":case"ok-edit-chore":{let f=e==="ok-edit-chore",w=fr(o,r,n,s,f);if(!w)break;a._svc(f?"update_chore":"add_chore",w),a._closeModal();break}case"set-streak":{let f=t.dataset.cid,w=t.dataset.pid,v=Math.max(0,parseInt(((x=s.getElementById(`m-streak-${f}`))==null?void 0:x.value)||"0"));a._svc("set_streak",{person_id:w,chore_id:f,count:v});break}case"rot-pool-add":case"rot-pool-remove":case"rot-pool-up":case"rot-pool-down":{let f=t.dataset.pid,w=s.getElementById("m-crot-pool-order"),v=s.getElementById("m-crot-pool-widget");if(!f||!w||!v)break;let M=w.value?w.value.split(",").filter(Boolean):[],A=M.indexOf(f);e==="rot-pool-add"?A===-1&&M.push(f):e==="rot-pool-remove"?A!==-1&&M.splice(A,1):e==="rot-pool-up"&&A>0?[M[A-1],M[A]]=[M[A],M[A-1]]:e==="rot-pool-down"&&A!==-1&&A<M.length-1&&([M[A+1],M[A]]=[M[A],M[A+1]]),w.value=M.join(","),v.innerHTML=wt(a._people(),M);break}case"ok-add-store-item":{let f=St(o,s,!1,null);if(!f)break;a._svc("add_store_item",f),a._closeModal();break}case"ok-edit-store-item":{let f=((k=(p=(S=a._modal)==null?void 0:S.data)==null?void 0:p.item)==null?void 0:k.is_group_reward)??!1,w=St(o,s,!0,f);if(!w)break;a._svc("update_store_item",w),a._closeModal();break}case"ok-add-person":{let f=o("m-pname").trim();if(!f)break;a._svc("add_person",{name:f,person_type:o("m-ptype"),avatar_color:o("m-pcolor")}),a._closeModal();break}case"ok-edit-person":{let f=o("m-pname").trim();if(!f)break;a._svc("update_person",{person_id:o("m-pid"),name:f,avatar_color:o("m-pcolor"),type:o("m-ptype"),allowance_points:parseInt(o("m-allowance-pts")||"0"),allowance_schedule:o("m-allowance-schedule"),allowance_weekday:parseInt(o("m-allowance-weekday")),allowance_monthday:parseInt(o("m-allowance-monthday")),notify_target:o("m-pnotify").trim(),code:o("m-pcode").trim().toUpperCase(),theme_key:o("m-ptheme"),child_mode:r("m-pchildmode"),completion_threshold_pct:Math.max(1,Math.min(100,n("m-completion-threshold")||80)),completion_milestone:Math.max(0,n("m-completion-milestone")||0),completion_bonus_points:Math.max(0,n("m-completion-bonus")||0)}),a._closeModal();break}case"ok-remove-person":{let f=o("m-rpid");if(!f)break;a._svc("remove_person",{person_id:f}),a._closeModal();break}case"ok-hard-delete-person":{let f=o("m-hdpid");if(!f)break;a._svc("hard_delete_person",{person_id:f}),a._closeModal();break}case"ok-edit-settings":{let f=o("m-fname").trim(),w=parseInt(o("m-ppd")||"10"),v=parseInt(o("m-alert-time")??"-1");if(!f)break;a._svc("update_settings",{family_name:f,points_per_dollar:w,penalty_alert_time:isNaN(v)?800:v}),a._closeModal();break}case"ok-claim":{let f=t.dataset.tid||o("m-cltid"),w=t.dataset.pid||o("m-clperson");if(!f||!w)break;a._svc("claim_task",{task_id:f,person_id:w}),a._closeModal();break}case"ok-add-reminder":{let f=o("m-rname").trim(),w=o("m-rperson");if(!f||!w)break;a._svc("add_chore",{name:f,chore_type:"reminder",assigned_to:[w],recurrence_type:o("m-rrec"),approval_required:!1,points:0,category_label:""}),a._closeModal();break}case"pick-template":{let f=(E=s.getElementById("m-ctpl"))==null?void 0:E.value;if(!f)break;let w=Qe.find(A=>A.key===f);if(!w)break;let v=(A,T)=>{let D=s.getElementById(A);D!==null&&(D.value=T)};v("m-cname",w.name),v("m-cdesc",w.description||"");let M=s.getElementById("m-clabel");M&&w.category&&[...M.options].find(T=>T.value===w.category)&&(M.value=w.category),w.points&&v("m-cpts",w.points),(u=s.getElementById("m-cname"))==null||u.focus();break}case"pick-icon":{let f=t.dataset.icon,w=s.getElementById("m-cicon");w&&(w.value=f);let v=s.getElementById("m-cicon-preview");v&&(v.innerHTML=""),s.querySelectorAll(".fh-icon-cell").forEach(A=>A.classList.toggle("selected",A.dataset.icon===f));let M=s.getElementById("m-icon-selected");if(M){let A=t.querySelector("span:first-child"),T=t.title||f;M.innerHTML='<span class="fh-icon-sel-icon" style="display:inline-flex;width:20px;height:20px;color:var(--fh-accent)">'+(A?A.innerHTML:"")+`</span> <span class="fh-icon-sel-lbl">${T}</span>`}break}case"upload-icon":{let f=s.getElementById("m-icon-upload");if(!f){console.warn("[family-hub] upload-icon: hidden file input not found");break}f.value="",f.click();break}case"clear-icon":{let f=s.getElementById("m-cicon");f&&(f.value="");let w=s.getElementById("m-cicon-preview");w&&(w.innerHTML=""),s.querySelectorAll(".fh-icon-cell.selected").forEach(v=>v.classList.remove("selected"));break}case"approve-subscription-redemption":{let f=t.dataset.rid,w=t.dataset.period||"monthly",v=a._people().find(A=>A.type==="parent"),M={redemption_id:f,approved_by:(v==null?void 0:v.person_id)||""};w==="weekly"?M.subscription_anchor=parseInt(((h=s.getElementById(`m-sub-wday-${f}`))==null?void 0:h.value)??"0"):w!=="daily"&&(M.subscription_anchor=Math.max(1,Math.min(31,parseInt(((_=s.getElementById(`m-sub-dom-${f}`))==null?void 0:_.value)??"1")))),a._svc("approve_redemption",M);break}case"admin-cancel-subscription":{let f=t.dataset.sname||"this subscription";if(!confirm(`Cancel "${f}"?

This will immediately end the subscription.`))break;let w=a._people().find(v=>v.type==="parent");a._svc("admin_cancel_subscription",{subscription_id:t.dataset.subid,canceled_by:(w==null?void 0:w.person_id)||""});break}case"admin-edit-subscription-open":a._editingSubId=t.dataset.subid,a._doRender();break;case"admin-edit-subscription-cancel":a._editingSubId=null,a._doRender();break;case"admin-update-subscription":{let f=t.dataset.subid,w=t.closest(".fh-point-row"),v=((z=w==null?void 0:w.querySelector(`#sub-edit-period-${CSS.escape(f)}`))==null?void 0:z.value)||null,M=(F=($=w==null?void 0:w.querySelector(`#sub-edit-cost-${CSS.escape(f)}`))==null?void 0:$.value)==null?void 0:F.trim(),A=(B=(R=w==null?void 0:w.querySelector(`#sub-edit-date-${CSS.escape(f)}`))==null?void 0:R.value)==null?void 0:B.trim(),T={subscription_id:f};if(v&&(T.period=v),M!==void 0&&M!==""){let D=parseFloat(M);!isNaN(D)&&D>=0&&(T.dollar_cost_override=D)}A&&(T.next_renewal_date=A),a._editingSubId=null,a._svc("update_subscription",T);break}case"approve-cancel-subscription":{let f=a._people().find(w=>w.type==="parent");a._svc("approve_cancel_subscription",{subscription_id:t.dataset.subid,approved_by:(f==null?void 0:f.person_id)||""});break}case"decline-cancel-subscription":{let f=a._people().find(w=>w.type==="parent");a._svc("decline_cancel_subscription",{subscription_id:t.dataset.subid,declined_by:(f==null?void 0:f.person_id)||""});break}}}function Za(e,t){return Array.from(t.querySelectorAll(`.${e}:checked`)).map(a=>a.value)}function eo(e){let t=(e||"").trim();return t?t.startsWith("data:")?t:t.toLowerCase():""}function fr(e,t,a,s,o){var u;let r=e("m-cname").trim();if(!r)return null;let n=e("m-crec"),i=e("m-ctype"),d=Za("m-assign-person",s),c=Array.from(s.querySelectorAll(".m-wd-day:checked")).map(h=>parseInt(h.value)),l=Array.from(s.querySelectorAll(".m-df-day:checked")).map(h=>parseInt(h.value)),b=(e("m-dom-days")||"").split(",").map(h=>parseInt(h.trim())).filter(h=>Number.isFinite(h)&&h>=1&&h<=31),g=b.length?[...new Set(b)].sort((h,_)=>h-_):[1],y=eo(e("m-cicon")),x={name:r,chore_type:i,category_label:e("m-clabel"),assigned_to:d,points:a("m-cpts"),approval_required:t("m-cappr"),penalty_enabled:t("m-cpenalty"),penalty_points:a("m-cpenalty-pts"),icon:y};if(t("m-cpenalty")){let h=parseInt(e("m-daily-threshold")||"0");h>0&&(x.daily_penalty_after_days=h)}i==="claimable"&&(x.claimable_subtype=e("m-csubtype")||"fcfs",x.claimable_subtype==="multi_claim"&&(x.max_claimants=Math.max(2,a("m-max-claimants")||2),x.multi_claim_points_mode=e("m-points-mode")||"full"));let S=e("m-cdesc").trim();S&&(x.description=S);let p=s.getElementById("m-chore-expiry-section");if(p&&p.style.display!=="none"){let h=parseInt(e("m-cexpiry")||"0");h>0&&(x.expires_after_days=h)}x.streak_milestone=Math.max(0,a("m-streak-milestone")||0),x.streak_bonus_points=Math.max(0,a("m-streak-bonus")||0);let E=parseInt(e("m-reminder-time")??"-1");if(x.reminder_time=isNaN(E)?-1:E,i==="assigned"){let h=t("m-crot-enabled"),_=e("m-crot-pool-order")||"",z=h&&_?_.split(",").filter(Boolean):[];x.rotation_pool=z,x.rotation_cadence=h&&z.length?e("m-crot-cadence")||"per_instance":"",x.rotation_switch_weekday=parseInt(e("m-crot-switch-day")||"0")||0}else x.rotation_pool=[],x.rotation_cadence="";return o?(x.chore_id=e("m-cid"),x.active=((u=s.querySelector("#m-cactive"))==null?void 0:u.checked)!==!1,x.weekdays=c,x.day_filter=l,x.recurrence={type:n,weekdays:c,day_filter:l,...n==="monthly_on_date"?{days_of_month:g,day_of_month:g[0]}:{}}):(x.recurrence_type=n,c.length&&(x.weekdays=c),l.length&&(x.day_filter=l),n==="monthly_on_date"&&(x.days_of_month=g,x.day_of_month=g[0])),x}function St(e,t,a,s){var b,g,y;let o=a?e("m-eiid"):null,r=e("m-sname").trim(),n=parseFloat(e("m-sdollar"));if(a&&!o||!r||!n||n<=0)return null;let i=((b=t.querySelector("#m-sgroup"))==null?void 0:b.checked)||!1,d=e("m-sscope"),c={name:r,dollar_value:n,scope:d,description:e("m-sdesc").trim(),category_label:e("m-scat")||"",max_per_period:parseInt(e("m-smaxperiod")||"0"),period:e("m-speriod")||"week",icon:eo(e("m-cicon"))};if(a&&(c.item_id=o,c.active=((g=t.querySelector("#m-sactive"))==null?void 0:g.checked)!==!1),i){let x=[...t.querySelectorAll(".m-scontrib")].filter(p=>parseInt(p.value)>0).map(p=>({person_id:p.dataset.pid,share_pct:parseInt(p.value)}));if(x.length===0)return alert("Group reward needs at least one contributor with a share > 0%."),null;let S=x.reduce((p,k)=>p+k.share_pct,0);if(S!==100)return alert(`Contributor shares must sum to exactly 100% (currently ${S}%). Use the "Equal split" button or adjust manually.`),null;c.is_group_reward=!0,c.contributors=x,c.scope="personal",c.person_ids=x.map(p=>p.person_id)}else a&&s&&(c.is_group_reward=!1,c.contributors=[]),d==="personal"?c.person_ids=Za("m-sp-person",t):a&&(c.person_ids=[]);let l=((y=t.querySelector("#m-ssubtype"))==null?void 0:y.checked)||!1;return c.item_type=l?"subscription":"one_time",l&&(c.subscription_period=e("m-ssperiod")||"monthly"),c}function to(e,t){var o;let a=(o=e==null?void 0:e.files)==null?void 0:o[0];if(!a)return;if(a.size>5*1024*1024){alert("Image too large. Please pick a file under 5 MB.");return}let s=new FileReader;s.onload=()=>{let r=new Image;r.onload=()=>{let i=r.width,d=r.height;i>d?i>128&&(d=Math.round(d*128/i),i=128):d>128&&(i=Math.round(i*128/d),d=128);let c=document.createElement("canvas");c.width=i,c.height=d,c.getContext("2d").drawImage(r,0,0,i,d);let b=c.toDataURL("image/png");if(b.length>350*1024){alert("Resized image is still too large. Pick a simpler image.");return}let g=t.getElementById("m-cicon");g&&(g.value=b);let y=t.getElementById("m-cicon-preview");y&&(y.innerHTML=`<div style="display:flex;align-items:center;gap:10px;padding:8px;border:1px solid var(--fh-border);border-radius:6px;background:var(--fh-surface)"><img src="${b}" style="width:48px;height:48px;object-fit:contain;border-radius:4px" alt=""><span style="font-size:.85rem;color:var(--fh-text-sec)">Custom uploaded image</span><button type="button" class="fh-btn fh-btn-ghost fh-btn-sm" data-act="clear-icon" style="margin-left:auto">Clear</button></div>`),t.querySelectorAll(".fh-icon-cell.selected").forEach(x=>x.classList.remove("selected"))},r.onerror=()=>alert("Could not read that image."),r.src=s.result},s.onerror=()=>alert("Could not read that file."),s.readAsDataURL(a)}var ao=O(()=>{W();it();Qa()});var dt,oo=O(()=>{Lt();W();V();ca();ja();Ja();st();ut();vt();qe();ao();it();dt=class extends HTMLElement{static getStubConfig(){return{mode:"command_center"}}static getConfigElement(){return document.createElement("family-hub-card-editor")}constructor(){super(),this.attachShadow({mode:"open"}),this._cfg={},this._hass=null,this._model=null,this._lastDataRev=void 0,this._pendingRev=void 0,this._fetching=!1,this._modal=null,this._filter=null,this._tab="tasks",this._adminSec="today",this._flashing=new Set,this._pendingSubmit=new Set,this._expandedDescs=new Set,this._histFilter=null,this._choreFilter=null,this._expandedSkippedDates=new Set,this._view="home",this._backStack=[],this._viewPersonId=null,this._celebration=null,this._dragId=null,this._dragOverId=null,this._dragType=null,this._sortedChores=[],this._sortedStoreItems=[],this._adminSelectedChoreId=null,this._adminSort={col:null,dir:"asc"},this._adminCollapsedCats=new Set,this._choreFormTab="details",this._adminSelectedItemId=null,this._adminSortItems={col:null,dir:"asc"},this._adminCollapsedRewardCats=new Set,this._storeItemFilter=null,this._abortCtrl=null,this._retryTimer=null}_reorderCategory(t,a,s){let o=this._attrs("sensor.family_hub_needs_attention").category_labels||[];if(!o.includes(t)||!o.includes(a))return;let r=o.filter(c=>c!==t),n=r.indexOf(a),i=s==="above"?n:n+1,d=[...r.slice(0,i),t,...r.slice(i)];this._svc("update_settings",{category_labels:d})}connectedCallback(){this._abortCtrl=new AbortController;let{signal:t}=this._abortCtrl,a=this.shadowRoot;a.addEventListener("click",s=>{let o=s.target.closest("[data-act]");o&&o.tagName!=="SELECT"&&Et(o.dataset.act,o,this)},{signal:t}),a.addEventListener("change",s=>{var r,n;let o=s.target;if(["chore-status-filter","chore-rec-filter","chore-filter","stats-rank","stats-completion","stats-streak-pct"].includes(o.dataset.act)){Et(o.dataset.act,o,this);return}if(o.dataset.act==="toggle-stats-streaks"){this._statsIncludeStreaks=o.checked,this._doRender(!0);return}if(o.dataset.act==="toggle-dollar"){this._svc("update_settings",{show_dollar_value_to_kids:o.checked});return}if(o.dataset.act==="toggle-global-penalty"){this._svc("update_settings",{penalties_paused:!o.checked});return}if(o.dataset.act==="toggle-person-penalty"){let i=o.dataset.pid;i&&this._svc("update_person",{person_id:i,penalties_paused:!o.checked});return}if(o.id==="m-everyone"&&a.querySelectorAll(".m-assign-person").forEach(i=>{var d;i.checked=o.checked,(d=i.closest(".fh-person-cb-chip"))==null||d.classList.toggle("checked",o.checked)}),o.classList.contains("m-assign-person")&&!o.checked){let i=a.getElementById("m-everyone");i&&(i.checked=!1)}(o.classList.contains("m-wd-day")||o.classList.contains("m-df-day"))&&((r=o.closest(".fh-wd-chip"))==null||r.classList.toggle("checked",o.checked)),(o.classList.contains("m-assign-person")||o.classList.contains("m-sp-person")||o.classList.contains("m-rot-person"))&&((n=o.closest(".fh-person-cb-chip"))==null||n.classList.toggle("checked",o.checked)),o.id==="m-icon-upload"&&o.files&&o.files.length>0&&to(o,a),this._syncModalUI()},{signal:t}),a.addEventListener("dragstart",s=>{let o=s.target.closest("[data-drag-id]");o&&(this._dragId=o.dataset.dragId,this._dragType=o.dataset.dragType||"chore",this._dragSide=null,s.dataTransfer.effectAllowed="move",setTimeout(()=>o.classList.add("fh-dragging"),0))},{signal:t}),a.addEventListener("dragover",s=>{let o=s.target.closest("[data-drag-id]");if(!o||o.dataset.dragId===this._dragId)return;let r=o.dataset.dragType||"chore";if(r!==this._dragType)return;s.preventDefault();let n=o.getBoundingClientRect(),d=r==="category"?s.clientX<n.left+n.width/2?"above":"below":s.clientY<n.top+n.height/2?"above":"below";a.querySelectorAll(".fh-drop-above, .fh-drop-below").forEach(c=>c.classList.remove("fh-drop-above","fh-drop-below")),o.classList.add(d==="above"?"fh-drop-above":"fh-drop-below"),this._dragOverId=o.dataset.dragId,this._dragSide=d},{signal:t}),a.addEventListener("dragleave",s=>{let o=s.target.closest("[data-drag-id]");o&&o.classList.remove("fh-drop-above","fh-drop-below")},{signal:t}),a.addEventListener("drop",s=>{var S,p,k,E;s.preventDefault(),a.querySelectorAll(".fh-drop-above, .fh-drop-below, .fh-dragging").forEach(u=>u.classList.remove("fh-drop-above","fh-drop-below","fh-dragging"));let o=this._dragId,r=this._dragOverId,n=this._dragSide||"above",i=this._dragType||"chore";if(this._dragId=this._dragOverId=null,this._dragSide=null,this._dragType=null,!o||!r||o===r)return;if(i==="category"){this._reorderCategory(o,r,n);return}let d=i==="store-item"?{list:this._sortedStoreItems,idKey:"item_id",svc:"update_store_item",idField:"item_id"}:{list:this._sortedChores,idKey:"chore_id",svc:"update_chore",idField:"chore_id"},c=d.list.filter(u=>u[d.idKey]!==o),l=c.findIndex(u=>u[d.idKey]===r);if(l<0)return;let b,g;n==="above"?(b=((S=c[l-1])==null?void 0:S.sort_order)??c[l].sort_order-20,g=c[l].sort_order):(b=c[l].sort_order,g=((p=c[l+1])==null?void 0:p.sort_order)??b+20);let y=(b+g)/2,x=.01;if(Math.abs(g-y)<x||Math.abs(y-b)<x){let u=c.map(($,F)=>({...$,sort_order:(F+1)*10})),h=u.findIndex($=>$[d.idKey]===r),_,z;n==="above"?(_=((k=u[h-1])==null?void 0:k.sort_order)??0,z=u[h].sort_order):(_=u[h].sort_order,z=((E=u[h+1])==null?void 0:E.sort_order)??_+20),y=(_+z)/2,u.forEach($=>{$[d.idKey]!==o&&this._svc(d.svc,{[d.idField]:$[d.idKey],sort_order:$.sort_order})})}this._svc(d.svc,{[d.idField]:o,sort_order:y})},{signal:t}),a.addEventListener("dragend",()=>{a.querySelectorAll(".fh-drop-above, .fh-drop-below, .fh-dragging").forEach(s=>s.classList.remove("fh-drop-above","fh-drop-below","fh-dragging")),this._dragId=this._dragOverId=null,this._dragSide=null,this._dragType=null},{signal:t})}disconnectedCallback(){var t;(t=this._abortCtrl)==null||t.abort(),this._abortCtrl=null,this._retryTimer&&(clearTimeout(this._retryTimer),this._retryTimer=null)}setConfig(t){let a=["command_center","personal","maintenance","admin"];if(!t.mode)throw new Error("Family Hub: 'mode' is required");if(!a.includes(t.mode))throw new Error(`Family Hub: mode must be one of ${a.join(", ")}`);if(t.mode==="personal"&&!t.person)throw new Error("Family Hub: 'person' is required for personal mode");if(t.initial_view&&!/^(person|room):[A-Za-z0-9_-]+$/.test(t.initial_view))throw new Error("Family Hub: 'initial_view' must be 'person:<id>' or 'room:<id>'");this._cfg=t,t.mode==="command_center"&&t.initial_view&&!this._initialViewApplied&&(this._view=t.initial_view,this._backStack=["home"],this._initialViewApplied=!0),this._doRender(!0)}set hass(t){this._hass=t,this._maybeRender(),this._scheduleRetryIfNeeded()}_scheduleRetryIfNeeded(){if(this._retryTimer||this._model)return;let t=0,a=()=>{this._retryTimer=null,!(!this._hass||this._model)&&(t++,this._maybeRender(),!this._model&&t<15&&(this._retryTimer=setTimeout(a,2e3)))};this._retryTimer=setTimeout(a,2e3)}getCardSize(){return 5}_maybeRender(){var a,s;if(!this._hass||this._modal||this._adminSelectedChoreId||this._adminSelectedItemId||this._editingSubId)return;let t=(s=(a=this._hass.states["sensor.family_hub_needs_attention"])==null?void 0:a.attributes)==null?void 0:s.data_rev;t!==void 0&&(this._model!==null&&t===this._lastDataRev||this._fetchModel(t))}async _fetchModel(t){if(this._pendingRev=t,!this._fetching){this._fetching=!0;try{for(;this._lastDataRev!==this._pendingRev;){let a=this._pendingRev,s;try{s=await this._hass.connection.sendMessagePromise({type:"family_hub/get_model"})}catch(o){console.error("Family Hub: get_model failed",o);return}this._model=s,this._lastDataRev=a}}finally{this._fetching=!1}this._modal||this._adminSelectedChoreId||this._adminSelectedItemId||this._editingSubId||this._doRender(!1)}}_doRender(t=!1){if(!(!this._hass&&!t))try{let a=parseFloat(this._cfg.text_scale)||1,s=document.createElement("style");s.textContent=Ye+`:host { --fh-text-scale: ${a}; }`;let o=document.createElement("div");if(o.className="fh-card",!this._hass||!this._model)o.innerHTML='<div class="fh-empty">Loading\u2026</div>';else switch(["today","family","tasks","rewards","history","settings"].includes(this._adminSec)||(this._adminSec="today"),this._cfg.mode){case"command_center":o.innerHTML=this._htmlCommandCenter();break;case"personal":o.innerHTML=gt(this);break;case"maintenance":o.innerHTML=et(this);break;case"admin":o.innerHTML=Oa(this);break}if(this.shadowRoot.innerHTML="",this.shadowRoot.appendChild(s),this.shadowRoot.appendChild(o),this._modal&&this.shadowRoot.appendChild(this._buildModal()),this._celebration){let r=document.createElement("div");r.innerHTML=ga(this._celebration),this.shadowRoot.appendChild(r.firstElementChild)}this._syncModalUI()}catch(a){console.error("[family-hub] render error:",a);let s=document.createElement("style");s.textContent=Ye;let o=document.createElement("div");o.className="fh-card",o.innerHTML='<div class="fh-empty">Loading\u2026</div>',this.shadowRoot.innerHTML="",this.shadowRoot.appendChild(s),this.shadowRoot.appendChild(o),setTimeout(()=>{this._hass&&(this._lastDataRev=void 0,this._maybeRender())},3e3)}}_htmlCommandCenter(){let t=this._view||"home";if(t==="home")return kt(this);let a="";if(t.startsWith("room:")){let s=t.slice(5),o=ka(s);a=o!=null&&o.render?o.render(this):'<div class="fh-empty">Unknown room.</div>'}else if(t.startsWith("person:")){let s=t.slice(7);this._viewPersonId=s;let o=this._findPerson(s),r=Te((o==null?void 0:o.theme_key)||"classic");if(a=gt(this),this._viewPersonId=null,r.handlesNavigation)return a}else return this._view="home",kt(this);return Va("Home")+a}_states(t){var a,s;return(s=(a=this._hass)==null?void 0:a.states)==null?void 0:s[t]}_attrs(t){var a;return this._model&&this._model[t]||((a=this._states(t))==null?void 0:a.attributes)||{}}_people(){return this._attrs("sensor.family_hub_needs_attention").people||[]}_findPerson(t){let a=(t||"").toLowerCase();return this._people().find(s=>s.name.toLowerCase()===a||s.person_id===t)||null}_personEntityId(t){return`sensor.family_hub_${Nt(t)}`}_svc(t,a){if(this._hass)try{let s=this._hass.callService(Ot,t,a);s&&typeof s.catch=="function"&&s.catch(o=>{var n,i;console.error(`[family-hub] service ${t} failed:`,o,"payload:",a);let r=((n=o==null?void 0:o.body)==null?void 0:n.message)||((i=o==null?void 0:o.error)==null?void 0:i.message)||(o==null?void 0:o.message)||(o==null?void 0:o.error)||"";if(!r||typeof r!="string")try{r=JSON.stringify(o)}catch{r=String(o)}r.length>600&&(r=r.slice(0,600)+"\u2026"),alert(`Family Hub service "${t}" failed:

${r}

(See browser console for full details.)`)})}catch(s){console.error("[family-hub] callService threw:",s),alert(`Family Hub: service call "${t}" crashed before sending.

${(s==null?void 0:s.message)||s}`)}}_buildModal(){var a;let t=document.createElement("div");return t.className="fh-modal-bg"+(((a=this._modal)==null?void 0:a.surface)==="drawer"?" fh-modal-bg--drawer":""),t.innerHTML=this._modalHTML(),t.addEventListener("click",s=>{s.target===t&&this._closeModal()}),t}_modalHTML(){if(!this._modal)return"";let{type:t,data:a}=this._modal,s=this._people(),o=this._attrs("sensor.family_hub_needs_attention").category_labels||[],r=this._attrs("sensor.family_hub_needs_attention").active_chores||[];switch(t){case"award":case"deduct":return _a(this._modal);case"partial-credit":return $a(this._modal);case"add-chore":return xt(null,!1,s,o,this._choreFormTab);case"edit-chore":return xt(a.chore,!0,s,o,this._choreFormTab);case"add-store-item":return Sa(s,o);case"edit-store-item":return Ea(a.item,s,o);case"add-person":return Ca();case"edit-person":return za(a);case"edit-settings":return Ba(a);case"ranks":return yt(this);case"claim":return Ra(this._modal,s);case"add-reminder":return Ia(this._modal,s);case"confirm-remove-person":return Aa(a);case"confirm-hard-delete-person":return Ma(a);case"edit-streaks":{let n=this._people().find(d=>d.person_id===a.pid),i=(n==null?void 0:n.streaks)||{};return Fa(a.pid,a.pname,r,i)}case"chip-in":return Ta(a.item,a.pid,a.balance,a.remaining);default:return""}}_closeModal(){this._modal=null,this._choreFormTab="details",this._doRender(!0)}_syncModalUI(){let t=this.shadowRoot,a=z=>{let $=t.getElementById(z);$&&($.style.display="")},s=z=>{let $=t.getElementById(z);$&&($.style.display="none")},o=t.getElementById("m-crec");if(o){let z=o.value,$=t.getElementById("m-ctype"),F=($==null?void 0:$.value)||"assigned";s("m-dayfilter-section"),s("m-weekdays-section"),s("m-dom-section"),s("m-chore-expiry-section"),z==="daily"&&a("m-dayfilter-section"),z==="weekly"&&a("m-weekdays-section"),z==="monthly_on_date"&&a("m-dom-section"),F==="claimable"&&a("m-chore-expiry-section")}let r=t.getElementById("m-ctype"),n=t.getElementById("m-claimable-section"),i=t.getElementById("m-multi-claim-section"),d=t.getElementById("m-csubtype");if(r&&n){let z=r.value==="claimable";if(n.style.display=z?"":"none",i){let $=z&&(d==null?void 0:d.value)==="multi_claim";i.style.display=$?"":"none"}}let c=t.getElementById("m-cpenalty"),l=t.getElementById("m-penalty-pts-section"),b=t.getElementById("m-daily-threshold-section");c&&l&&(l.style.display=c.checked?"":"none",b&&(b.style.display=c.checked?"":"none"));let g=t.getElementById("m-sscope"),y=t.getElementById("m-sperson-section");g&&y&&(y.style.display=g.value==="personal"?"":"none");let x=t.getElementById("m-sgroup"),S=t.getElementById("m-sgroup-section");x&&S&&(S.style.display=x.checked?"":"none",x.checked&&y&&(y.style.display="none"));let p=t.getElementById("m-rotation-section"),k=t.getElementById("m-rotation-config"),E=t.getElementById("m-crot-enabled"),u=t.getElementById("m-ctype");p&&(p.style.display=(u==null?void 0:u.value)==="assigned"?"":"none"),k&&E&&(k.style.display=E.checked?"":"none");let h=t.getElementById("m-crot-cadence"),_=t.getElementById("m-crot-switch-day-wrap");h&&_&&(_.style.display=h.value==="weekly"?"":"none")}}});var ct,so=O(()=>{W();V();ct=class extends HTMLElement{setConfig(t){this._cfg=t,this._render()}set hass(t){var a,s,o;this._hass=t,this._people=((o=(s=(a=t==null?void 0:t.states)==null?void 0:a["sensor.family_hub_needs_attention"])==null?void 0:s.attributes)==null?void 0:o.people)||[],this._render()}_render(){var x,S,p,k,E,u,h,_,z;let t=this._cfg||{},a=this._people||[],s=t.mode||"command_center",o=t.person||"",r=t.initial_view||"",n=t.text_scale!=null?t.text_scale:1,d=(((p=(S=(x=this._hass)==null?void 0:x.states)==null?void 0:S["sensor.family_hub_needs_attention"])==null?void 0:p.attributes)||{}).rooms_config||{},c=[["","Home (default)"],...a.map($=>[`person:${$.person_id}`,`${$.name}'s page`]),...Object.keys(d).map($=>[`room:${$}`,`Room: ${$}`])],b=!!((E=(k=this._hass)==null?void 0:k.states)==null?void 0:E["sensor.family_hub_needs_attention"]),g=`<span style="
            display:inline-block;width:8px;height:8px;border-radius:50%;
            background:${b?"#30d158":"#ff453a"};
            margin-right:5px;vertical-align:middle;"></span>`,y=b?`${g}Integration connected (v${De})`:`${g}Integration not found \u2014 install Family Hub`;this.innerHTML=`
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
        <div class="fhe-status">${y}</div>

        <div class="fhe-field">
          <label class="fhe-label">Mode</label>
          <select class="fhe-select" id="e-mode">
            ${[["command_center","Command Center (kitchen display)"],["personal","Personal Dashboard"],["maintenance","Maintenance"],["admin","Admin Panel"]].map(([$,F])=>`<option value="${$}" ${$===s?"selected":""}>${F}</option>`).join("")}
          </select>
        </div>

        <div class="fhe-field" id="person-field"
             style="display:${s==="personal"?"flex":"none"}">
          <label class="fhe-label">Person</label>
          ${a.length?`<select class="fhe-select" id="e-person">
                   ${a.map($=>`<option value="${$.name.toLowerCase()}"
                                ${$.name.toLowerCase()===o?"selected":""}>${m($.name)}</option>`).join("")}
                 </select>`:`<input class="fhe-input" id="e-person" type="text"
                        value="${o}" placeholder="e.g. jackson">`}
          <span class="fhe-hint">Enter the person's name (lowercase)</span>
        </div>

        <div class="fhe-field" id="initial-view-field"
             style="display:${s==="command_center"?"flex":"none"}">
          <label class="fhe-label">Initial view</label>
          <select class="fhe-select" id="e-initial-view">
            ${c.map(([$,F])=>`<option value="${$}" ${$===r?"selected":""}>${m(F)}</option>`).join("")}
          </select>
          <span class="fhe-hint">Open this view directly. Back arrow returns to home.</span>
        </div>

        <div class="fhe-field">
          <label class="fhe-label">Text scale</label>
          <select class="fhe-select" id="e-scale">
            ${[[.9,"Small (0.9)"],[1,"Default (1.0)"],[1.25,"Large (1.25)"],[1.5,"XL (1.5)"]].map(([$,F])=>`<option value="${$}" ${parseFloat(n)===$?"selected":""}>${F}</option>`).join("")}
          </select>
          <span class="fhe-hint">Increase for Echo Show / tablet screens.</span>
        </div>
      </div>`,(u=this.querySelector("#e-mode"))==null||u.addEventListener("change",$=>{this._cfg={...this._cfg,mode:$.target.value},$.target.value!=="personal"&&delete this._cfg.person,$.target.value!=="command_center"&&delete this._cfg.initial_view,this._fireChange(),this._render()}),(h=this.querySelector("#e-initial-view"))==null||h.addEventListener("change",$=>{let F=$.target.value;this._cfg={...this._cfg},F?this._cfg.initial_view=F:delete this._cfg.initial_view,this._fireChange()}),(_=this.querySelector("#e-person"))==null||_.addEventListener("change",$=>{this._cfg={...this._cfg,person:$.target.value},this._fireChange()}),(z=this.querySelector("#e-scale"))==null||z.addEventListener("change",$=>{this._cfg={...this._cfg,text_scale:parseFloat($.target.value)},this._fireChange()})}_fireChange(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._cfg},bubbles:!0,composed:!0}))}}});var mr=no(()=>{oo();so();W();customElements.get("family-hub-card-impl")||customElements.define("family-hub-card-impl",dt);customElements.get("family-hub-card-editor-impl")||customElements.define("family-hub-card-editor-impl",ct);console.info(`%c FAMILY-HUB-CARD %c v${De} %c body loaded `,"background:#7F77DD;color:#fff;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px","background:#1c1c1e;color:#fff;font-weight:400;padding:2px 6px","background:#58D38A;color:#000;font-weight:600;border-radius:0 4px 4px 0;padding:2px 6px")});export default mr();

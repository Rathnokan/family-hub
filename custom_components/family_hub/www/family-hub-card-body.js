var mo=Object.defineProperty;var N=(e,t)=>()=>(e&&(t=e(e=0)),t);var go=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),bo=(e,t)=>{for(var a in t)mo(e,a,{get:t[a],enumerable:!0})};var _a,$a=N(()=>{_a=`
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
`});var Sa,Ea=N(()=>{Sa=`    color:var(--fh-text-sec); letter-spacing:.04em;
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
  /* v0.8.0: disabled-module tile \u2014 dimmed and inert (no drill-down). */
  .fh-home-room-tile.off { opacity:.45; cursor:default; }
  .fh-home-room-tile.off:hover { border-color:transparent; background:var(--fh-surface); }
  .fh-home-room-off {
    display:inline-block; font-size:.78rem; font-weight:800; letter-spacing:.08em;
    padding:2px 8px; border-radius:10px;
    background:var(--fh-bg); color:var(--fh-text-sec);
    border:1px solid var(--fh-border); margin-bottom:4px;
  }
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
    /* room for the v0.7.6 point-value labels hanging beneath the markers */
    padding-bottom:16px;
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
`});var Ca,za=N(()=>{Ca=`    position:absolute; top:-4px; width:2px; height:14px;
    border-radius:1px; transform:translateX(-50%);
  }
  .fh-rank-bar-mark--drop { background:var(--fh-rb-drop, #E07A4C); }
  .fh-rank-bar-mark--gain { background:var(--fh-rb-gain, #5BB87A); }
  /* v0.7.6: visible point-value label beneath each threshold marker. The Echo
     Show is touch \u2014 hover titles never show \u2014 so kids read the exact points
     needed straight off the bar. */
  .fh-rank-bar-mark-val {
    position:absolute; top:9px; transform:translateX(-50%);
    font-size:.75rem; font-weight:800; line-height:1;
    white-space:nowrap; letter-spacing:.02em; pointer-events:none;
  }
  .fh-rank-bar-mark-val--drop { color:var(--fh-rb-drop, #E07A4C); }
  .fh-rank-bar-mark-val--gain { color:var(--fh-rb-gain, #5BB87A); }
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
  /* v0.7.6: weekly progress bar \u2014 distinct blue so the whole-week bar reads
     apart from the green daily bar. Stacks directly under the daily bar. */
  .fh-progress--weekly { margin-top:-2px; }
  .fh-progress--weekly .fh-daily-progress-fill { background:var(--fh-progress-week, #5B9BD5); }
  .fh-progress--weekly.fh-daily-progress--complete .fh-daily-progress-label { color:var(--fh-progress-week, #5B9BD5); }
  /* DBZ is a BRIGHT sky-blue page \u2014 the default light track + light label are
     invisible on it. Dark text + a dark track so both bars read clearly. */
  .fh-dbz-page .fh-daily-progress-bar { background:rgba(0,0,0,.22); }
  .fh-dbz-page .fh-daily-progress-label { color:#0E3354; }
  .fh-dbz-page .fh-daily-progress--complete .fh-daily-progress-label { color:#0A6B34; }
  .fh-dbz-page .fh-progress--weekly.fh-daily-progress--complete .fh-daily-progress-label { color:#1C4E80; }
  /* Kid-large boards (pre-reader, viewed at distance): thicker bars + bigger
     labels so the progress reads from across the kitchen. */
  .kid-large .fh-daily-progress-bar { height:9px; }
  .kid-large .fh-daily-progress-label { font-size:var(--fh-text-base); }

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
`});var Aa,Ma=N(()=>{Aa=`    text-shadow:2px 2px 0 rgba(255,255,255,.3), 4px 4px 0 rgba(15,30,46,.25);
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
  /* Intrinsic responsive grid: cards never go below a readable ~300px and the
     column count adapts to whatever width the pane actually has (1 \u2192 2 \u2192 3\u2026),
     instead of a fixed 2-up that squishes when the subscriptions rail is open. */
  .fh-ad-family-grid {
    display: grid; gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    padding: 10px 44px 10px 14px;   /* right pad clears the absolute trash button */
    background: rgba(255,255,255,.025);
    border-top: 1px solid #2A3852;
  }
  /* Status label always gets its own line so the Streaks/Ranks/toggle row stays
     intact at any card width (no accidental mid-row wrap). */
  .fh-ad-person-foot .fh-penalty-pause-label { flex: 1 0 100%; }

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
  /* v0.8.0: locked row \u2014 module disabled in integration options. */
  .fh-hub-room-row--off { opacity: .5; }
  .fh-hub-room-row--off .fh-toggle { pointer-events: none; }
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
`});var Ba,Fa=N(()=>{Ba=`  .fh-row-lead {
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
`});var Ra,Da=N(()=>{Ra=`

  /* ================================================================
     MEALS ROOM \u2014 shared primitives
     ================================================================ */

  /* Room chrome overrides (scoped so the shared Baker personal page is untouched).
     The tab-bar baseline spans only the tabs, not the empty space to the right. */
  .fh-ml-room .fh-bk-tabs { width:fit-content; max-width:100%; }

  /* Plate dots (MyPlate food-group coverage indicators) */
  .fh-ml-plate { display:flex; gap:5px; align-items:center; }
  .fh-ml-dot {
    width:10px; height:10px; border-radius:50%;
    border:1.5px solid rgba(58,31,18,.45); background:transparent;
  }
  .fh-ml-dot.filled { border-color:transparent; }

  /* Food-group icon (colorblind-safe \u2014 distinguished by glyph shape, not hue).
     "on" = covered (full colour); off = greyed + dimmed so it reads as absent
     by lightness, not colour. */
  .fh-ml-gicon {
    font-size:calc(1rem * var(--fh-text-scale,1)); line-height:1;
    filter:grayscale(1); opacity:.3;
  }
  .fh-ml-gicon.on { filter:none; opacity:1; }

  /* Plate legend row (This Week footer + drawer) */
  .fh-ml-legend { display:inline-flex; gap:13px; align-items:center; flex-wrap:wrap; }
  .fh-ml-legend-cap { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#8B3A2A; font-weight:700; }
  .fh-ml-lgd {
    display:inline-flex; gap:5px; align-items:center;
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs);
    font-weight:700; letter-spacing:.08em; color:#6E4423; text-transform:uppercase;
  }

  /* Ghost / outline button (secondary tap targets) */
  .fh-ml-ghost-btn {
    flex-shrink:0; padding:9px 18px; border-radius:22px; cursor:pointer; min-height:44px;
    background:transparent; border:1.5px solid rgba(58,31,18,.45); color:#5C3A24;
    font-family:"Manrope",sans-serif; font-size:var(--fh-text-sm); font-weight:700;
  }
  .fh-ml-ghost-btn:active { background:rgba(58,31,18,.08); }

  /* \u2715 icon button */
  .fh-ml-xbtn {
    width:44px; height:44px; border-radius:50%; border:1.5px solid rgba(58,31,18,.4);
    background:rgba(251,243,226,.8); color:#6E4423; font-size:var(--fh-text-md); line-height:1; cursor:pointer;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }

  /* Quick chip (scope selector, filter chips) */
  .fh-ml-qchip {
    display:inline-flex; align-items:center; gap:7px; min-height:44px; padding:8px 16px; cursor:pointer;
    background:#FBF3E2; border:1.5px solid rgba(58,31,18,.4); border-radius:999px;
    font-size:var(--fh-text-sm); font-weight:700; color:#3A1F12; white-space:nowrap;
  }
  .fh-ml-qchip.on { border-color:#8B3A2A; background:rgba(139,58,42,.14); color:#8B3A2A; }
  .fh-ml-qchip.sm { min-height:40px; padding:6px 13px; font-size:var(--fh-text-xs); }

  /* Pagination spacer */
  .fh-ml-pager-spacer { flex:1; }

  /* Empty-state note */
  .fh-ml-empty-note {
    font-family:"Caveat",cursive; font-size:var(--fh-text-lg); color:#6E4423; text-align:center; padding:34px 20px;
  }

  /* Meal card (grid tile \u2014 drawer, library, pantry matches) */
  .fh-ml-mealcard {
    background:#FBF3E2; border:1px solid rgba(58,31,18,.32); border-radius:9px; cursor:pointer;
    padding:12px 8px 10px; min-height:120px; position:relative;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:7px; text-align:center;
  }
  .fh-ml-mealcard:active { background:#F2E5CC; }
  .fh-ml-mealcard-glyph { font-size:calc(2.2rem * var(--fh-text-scale,1)); line-height:1; }
  .fh-ml-mealcard-name {
    font-size:var(--fh-text-base); font-weight:700; color:#3A1F12; line-height:1.22;
    overflow-wrap:break-word; word-break:break-word;
  }
  .fh-ml-mealcard-fav { position:absolute; top:7px; right:9px; font-size:var(--fh-text-sm); color:#8B3A2A; }
  .fh-ml-mealcard .fh-ml-plate { position:absolute; bottom:8px; left:50%; transform:translateX(-50%); }
  .fh-ml-mealcard .fh-ml-dot  { width:8px; height:8px; }

  /* Content area (each tab's scrollable body) */
  .fh-ml-content {
    flex:1; min-height:0; padding-top:14px; display:flex; flex-direction:column; position:relative;
  }

  /* ================================================================
     TODAY / TOMORROW GLANCE CARD  (fh-tdy-*)
     Self-contained \u2014 lifts onto the HA home page with these rules only.
     ================================================================ */

  .fh-tdy-wrap {
    flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:20px; overflow-y:auto;
  }
  .fh-tdy-panel {
    background:#FBF3E2; border:1.5px solid rgba(58,31,18,.3); border-radius:14px;
    display:flex; flex-direction:column; padding:22px 26px 20px; min-height:0;
  }
  .fh-tdy-panel.is-today { border:2.5px solid #8B3A2A; box-shadow:0 8px 26px rgba(58,31,18,.16); }
  .fh-tdy-head {
    display:flex; align-items:baseline; justify-content:space-between; gap:12px;
    border-bottom:2px dashed rgba(58,31,18,.3); padding-bottom:12px; flex-shrink:0;
  }
  .fh-tdy-label { font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-2xl); color:#3A1F12; line-height:1; }
  .fh-tdy-panel.is-today .fh-tdy-label { color:#8B3A2A; }
  .fh-tdy-date { font-family:"Caveat",cursive; font-size:var(--fh-text-lg); color:#6E4423; font-weight:600; text-align:right; }
  .fh-tdy-dinner {
    flex:1; min-height:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center; gap:6px; padding:10px 0;
  }
  .fh-tdy-dinner-kicker {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:800;
    letter-spacing:.22em; color:#6E4423; text-transform:uppercase;
  }
  .fh-tdy-glyph  { font-size:calc(4.5rem * var(--fh-text-scale,1)); line-height:1.05; }
  .fh-tdy-name   { font-family:"DM Serif Display",Georgia,serif; font-size:calc(2rem * var(--fh-text-scale,1)); line-height:1.08; color:#3A1F12; }
  .fh-tdy-variant { font-family:"Caveat",cursive; font-size:var(--fh-text-lg); color:#8B3A2A; font-weight:600; }
  .fh-tdy-sides  { font-size:var(--fh-text-md); color:#6E4423; font-weight:600; line-height:1.35; }
  .fh-tdy-empty  { font-family:"Caveat",cursive; font-size:var(--fh-text-lg); color:rgba(58,31,18,.6); font-weight:600; }
  .fh-tdy-bl {
    display:flex; flex-direction:column; gap:8px;
    border-top:2px dashed rgba(58,31,18,.3); padding-top:14px; flex-shrink:0;
  }
  .fh-tdy-bl-row { display:flex; align-items:baseline; gap:12px; }
  .fh-tdy-bl-k {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:800;
    letter-spacing:.12em; color:#6E4423; text-transform:uppercase; width:100px; flex-shrink:0;
  }
  .fh-tdy-bl-v { font-size:var(--fh-text-md); font-weight:700; color:#3A1F12; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .fh-tdy-bl-v.empty { color:rgba(58,31,18,.6); }

  /* "What's needed today" block (Today page enrichment) */
  .fh-tdy-needs {
    border-top:2px dashed rgba(58,31,18,.3); padding-top:14px; margin-top:4px; flex-shrink:0;
  }
  .fh-tdy-needs-hdr {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:800;
    letter-spacing:.14em; color:#6E4423; text-transform:uppercase; margin-bottom:8px;
  }
  .fh-tdy-needs-list { display:flex; flex-wrap:wrap; gap:7px; }
  .fh-tdy-need {
    display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px;
    background:rgba(242,229,204,.9); border:1px solid rgba(58,31,18,.3);
    font-size:var(--fh-text-sm); font-weight:700; color:#3A1F12;
  }
  .fh-tdy-need-g { font-size:calc(1.05rem * var(--fh-text-scale,1)); line-height:1; }
  .fh-tdy-needs-none { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#3A6A28; font-weight:600; }
  .fh-tdy-prep { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; font-weight:600; margin-top:8px; }
  .fh-tdy-prep b { color:#8B3A2A; }

  /* ================================================================
     THIS WEEK VIEW
     ================================================================ */

  .fh-ml-pager { display:flex; align-items:center; gap:12px; margin-bottom:12px; flex-shrink:0; flex-wrap:wrap; }
  .fh-ml-range {
    font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-lg); color:#3A1F12;
  }
  .fh-ml-range em {
    font-style:normal; font-family:"Caveat",cursive; color:#6E4423; font-size:var(--fh-text-md); margin-left:10px;
  }
  .fh-ml-pgbtn {
    width:48px; height:48px; border-radius:50%; cursor:pointer; font-size:var(--fh-text-lg); color:#5C3A24;
    background:rgba(251,243,226,.85); border:1.5px solid rgba(58,31,18,.4);
    display:flex; align-items:center; justify-content:center;
  }
  .fh-ml-pgbtn:disabled { opacity:.3; cursor:default; }

  .fh-ml-week {
    flex:1; min-height:0; display:grid; grid-template-columns:repeat(7,1fr); gap:9px; overflow-y:auto;
  }
  .fh-ml-day {
    background:rgba(251,243,226,.72); border:1px solid rgba(58,31,18,.28); border-radius:7px;
    display:flex; flex-direction:column; overflow:hidden; min-height:0;
  }
  .fh-ml-day.today  { border:2px solid #8B3A2A; background:#FBF3E2; box-shadow:0 4px 14px rgba(58,31,18,.14); }
  .fh-ml-day.past   { opacity:.55; }
  .fh-ml-day-hdr {
    text-align:center; padding:9px 4px 7px; border-bottom:1px dashed rgba(58,31,18,.32);
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700;
    letter-spacing:.12em; color:#6E4423;
  }
  .fh-ml-day.today .fh-ml-day-hdr { color:#8B3A2A; }
  .fh-ml-day-today-tag {
    font-family:"Caveat",cursive; font-size:var(--fh-text-sm); letter-spacing:.02em; color:#8B3A2A;
    text-transform:none; display:block; margin-top:1px;
  }
  .fh-ml-day-dinner {
    flex:1; min-height:0; padding:10px 8px 9px; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; text-align:center; gap:4px;
  }
  .fh-ml-dglyph   { font-size:calc(2.1rem * var(--fh-text-scale,1)); line-height:1.1; margin-top:4px; }
  .fh-ml-dname    {
    font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-md); line-height:1.2; color:#3A1F12;
  }
  .fh-ml-dvariant { font-family:"Caveat",cursive; font-size:var(--fh-text-sm); color:#8B3A2A; font-weight:600; line-height:1.1; }
  .fh-ml-dsides   { font-size:var(--fh-text-xs); color:#6E4423; line-height:1.35; }
  .fh-ml-day-dinner .fh-ml-plate { margin-top:auto; padding-top:6px; }
  .fh-ml-dempty   { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; margin:auto 0; }
  .fh-ml-dempty span { display:block; font-size:calc(1.4rem * var(--fh-text-scale,1)); opacity:.6; margin-bottom:2px; }

  .fh-ml-bl { border-top:1px dashed rgba(58,31,18,.32); display:flex; flex-direction:column; }
  .fh-ml-bl-slot {
    display:flex; flex-direction:column; gap:2px; padding:6px 10px 7px; min-height:46px; justify-content:center;
  }
  .fh-ml-bl-slot + .fh-ml-bl-slot { border-top:1px dashed rgba(58,31,18,.2); }
  .fh-ml-bl-kicker {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:800;
    letter-spacing:.14em; color:#6E4423;
  }
  .fh-ml-bl-meal  { display:flex; align-items:center; gap:6px; min-width:0; }
  .fh-ml-bl-glyph { font-size:calc(1.1rem * var(--fh-text-scale,1)); line-height:1; flex-shrink:0; }
  .fh-ml-bl-name  {
    font-size:var(--fh-text-sm); font-weight:700; color:#3A1F12;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-ml-bl-name.empty { font-family:"Caveat",cursive; font-size:var(--fh-text-sm); color:rgba(58,31,18,.6); font-weight:600; }

  .fh-ml-legendrow {
    display:flex; align-items:center; justify-content:space-between; gap:16px; padding:9px 2px 0; flex-shrink:0; flex-wrap:wrap;
  }
  .fh-ml-weeknote-inline { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; text-align:right; }
  .fh-ml-weeknote-inline b { color:#8B3A2A; font-weight:700; }

  /* ================================================================
     PLAN (BUILDER) VIEW
     ================================================================ */

  .fh-ml-bld { flex:1; min-height:0; display:flex; gap:14px; overflow:hidden; }

  /* 30-day date rail (left sidebar) */
  .fh-ml-rail {
    width:210px; flex-shrink:0; overflow-y:auto; border-radius:7px;
    background:rgba(251,243,226,.6); border:1px solid rgba(58,31,18,.28);
  }
  .fh-ml-rail::-webkit-scrollbar { width:0; }
  .fh-ml-rail-wk {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700;
    letter-spacing:.14em; color:#6E4423; text-transform:uppercase; padding:12px 14px 5px;
  }
  .fh-ml-rail-day {
    display:flex; align-items:center; gap:8px; padding:10px 14px; min-height:48px; cursor:pointer;
    border-left:4px solid transparent;
  }
  .fh-ml-rail-day:active { background:rgba(242,229,204,.8); }
  .fh-ml-rail-day.active { background:#FBF3E2; border-left-color:#8B3A2A; }
  .fh-ml-rail-date { flex:1; font-size:var(--fh-text-sm); font-weight:700; color:#3A1F12; }
  .fh-ml-rail-day.is-today .fh-ml-rail-date::after {
    content:"today"; font-family:"Caveat",cursive; color:#8B3A2A;
    font-weight:600; margin-left:7px; font-size:var(--fh-text-sm);
  }
  .fh-ml-rail-dots { display:flex; gap:4px; }
  .fh-ml-rail-dot { width:9px; height:9px; border-radius:50%; border:1.5px solid rgba(58,31,18,.45); }
  .fh-ml-rail-dot.filled { background:#8B3A2A; border-color:#8B3A2A; }

  /* Main panel (right of rail) */
  .fh-ml-main { flex:1; min-width:0; display:flex; flex-direction:column; gap:10px; }

  /* Weekly rhythm strip */
  .fh-ml-rhythm {
    display:flex; flex-direction:column; gap:8px; flex-shrink:0;
    background:rgba(251,243,226,.7); border:1px dashed rgba(58,31,18,.4); border-radius:7px; padding:9px 12px;
    position:relative;
  }
  .fh-ml-rhythm-head { display:flex; flex-direction:column; gap:2px; }
  .fh-ml-rhythm-lbl {
    font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-md); font-weight:400; color:#8B3A2A;
  }
  .fh-ml-rhythm-hint { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; line-height:1.25; }
  .fh-ml-rhythm-chips { display:flex; gap:8px; flex-wrap:wrap; }
  .fh-ml-rh-wrap { flex:1; min-width:78px; position:relative; display:flex; }
  .fh-ml-rh-chip {
    flex:1; min-height:56px; border-radius:7px; cursor:pointer; padding:6px 4px;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;
    border:1.5px dashed rgba(58,31,18,.4); background:transparent;
  }
  .fh-ml-rh-chip.set { border-style:solid; border-color:rgba(139,58,42,.6); background:rgba(139,58,42,.12); }
  .fh-ml-rh-dow { font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700; letter-spacing:.1em; color:#6E4423; }
  .fh-ml-rh-val { font-size:calc(1.3rem * var(--fh-text-scale,1)); line-height:1.05; }
  .fh-ml-rh-name { font-family:"Caveat",cursive; font-size:var(--fh-text-sm); font-weight:700; color:#8B3A2A; line-height:1; text-align:center; }
  .fh-ml-rh-set { font-family:"Manrope",sans-serif; font-size:var(--fh-text-xs); font-weight:700; color:#6E4423; }
  .fh-ml-rh-pop {
    position:absolute; top:calc(100% + 6px); z-index:30; width:220px;
    background:#FBF3E2; border:1.5px solid rgba(58,31,18,.45); border-radius:9px;
    box-shadow:0 10px 26px rgba(40,25,12,.3); overflow:hidden;
  }
  .fh-ml-rh-opt {
    display:flex; align-items:center; gap:10px; min-height:48px; padding:6px 14px; cursor:pointer;
    font-size:var(--fh-text-sm); font-weight:700; color:#3A1F12; border-bottom:1px dashed rgba(58,31,18,.22);
  }
  .fh-ml-rh-opt:last-child { border-bottom:none; }
  .fh-ml-rh-opt.on { background:rgba(139,58,42,.14); }
  .fh-ml-rh-opt .rh-g { font-size:calc(1.2rem * var(--fh-text-scale,1)); width:24px; text-align:center; }

  /* Day header */
  .fh-ml-dayhdr { display:flex; align-items:center; gap:12px; flex-shrink:0; flex-wrap:wrap; }
  .fh-ml-dayhdr-title { font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-lg); color:#3A1F12; }
  .fh-ml-dayhdr-sub   { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; }

  /* Dinner + B/L cards grid */
  .fh-ml-slots { flex:1; min-height:0; display:grid; grid-template-columns:1.45fr 1fr; gap:12px; overflow:hidden; }
  .fh-ml-dcard, .fh-ml-blcol { min-height:0; }
  .fh-ml-dcard {
    background:#FBF3E2; border:1px solid rgba(58,31,18,.3); border-radius:9px; padding:14px 16px;
    display:flex; flex-direction:column; position:relative; overflow:auto;
  }
  .fh-ml-slot-kicker {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700;
    letter-spacing:.16em; color:#6E4423; text-transform:uppercase;
  }
  .fh-ml-dcard-body {
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; gap:6px; padding:6px 0;
  }
  .fh-ml-dcard-glyph   { font-size:calc(3rem * var(--fh-text-scale,1)); line-height:1.1; }
  .fh-ml-dcard-name    { font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-lg); line-height:1.1; color:#3A1F12; }
  .fh-ml-dcard-variant { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#8B3A2A; font-weight:600; }
  .fh-ml-via-tag       { font-family:"Caveat",cursive; font-size:var(--fh-text-sm); color:#6E4423; }
  .fh-ml-sides-row     { display:flex; flex-wrap:wrap; gap:7px; justify-content:center; padding-top:4px; }
  .fh-ml-schip {
    display:inline-flex; align-items:center; gap:6px; min-height:40px; padding:6px 13px; cursor:pointer;
    background:rgba(242,229,204,.9); border:1px solid rgba(58,31,18,.4); border-radius:999px;
    font-size:var(--fh-text-sm); font-weight:700; color:#3A1F12;
  }
  .fh-ml-schip .x { color:#6E4423; font-size:var(--fh-text-xs); }
  .fh-ml-schip.add { border-style:dashed; background:transparent; color:#6E4423; }
  .fh-ml-dcard-actions { display:flex; gap:9px; justify-content:center; align-items:center; flex-shrink:0; flex-wrap:wrap; }
  .fh-ml-dcard .fh-ml-xbtn { position:absolute; top:10px; right:10px; }
  .fh-ml-dempty-big    { font-family:"Caveat",cursive; font-size:var(--fh-text-lg); color:#6E4423; }

  .fh-ml-blcol { display:flex; flex-direction:column; gap:12px; }
  .fh-ml-blcard {
    flex:1; background:#FBF3E2; border:1px solid rgba(58,31,18,.3); border-radius:9px; padding:12px 14px;
    display:flex; flex-direction:column; gap:6px; position:relative; min-height:0;
  }
  .fh-ml-blcard-body   { flex:1; display:flex; align-items:center; gap:11px; min-height:0; }
  .fh-ml-blcard-glyph  { font-size:calc(1.9rem * var(--fh-text-scale,1)); line-height:1; }
  .fh-ml-blcard-name   { font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-md); color:#3A1F12; line-height:1.15; flex:1; }
  .fh-ml-blcard-name.empty { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; font-weight:600; }
  .fh-ml-blcard .fh-ml-xbtn  { width:40px; height:40px; font-size:var(--fh-text-sm); }
  .fh-ml-blcard-actions { display:flex; gap:8px; flex-wrap:wrap; }

  /* ================================================================
     PICKER DRAWER (guided dinner flow)
     ================================================================ */

  .fh-ml-scrim {
    position:absolute; inset:0; background:rgba(40,25,12,.38); z-index:40;
    animation:fhMlFade .18s ease-out;
  }
  .fh-ml-drawer {
    position:absolute; left:0; right:0; bottom:0; height:80%; max-height:560px; z-index:41;
    background:#F7EDD8; border-top:2px solid rgba(58,31,18,.4); border-radius:12px 12px 0 0;
    box-shadow:0 -10px 34px rgba(40,25,12,.3);
    display:flex; flex-direction:column;
    animation:fhMlSlideUp .22s cubic-bezier(.2,.8,.3,1);
  }
  @keyframes fhMlSlideUp { from { transform:translateY(40px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  @keyframes fhMlFade    { from { opacity:0; } to { opacity:1; } }

  .fh-ml-dr-head {
    display:flex; align-items:center; gap:13px; padding:13px 22px 10px;
    border-bottom:1px dashed rgba(58,31,18,.32); flex-shrink:0; flex-wrap:wrap;
  }
  .fh-ml-dr-title { font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-lg); color:#3A1F12; }
  .fh-ml-dr-date  { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#8B3A2A; font-weight:600; }
  .fh-ml-dr-spacer { flex:1; }

  /* Scope picker (just today / all week / 2 weeks) */
  .fh-ml-scope { display:flex; border:1.5px solid rgba(58,31,18,.45); border-radius:999px; overflow:hidden; }
  .fh-ml-scope-opt {
    padding:9px 14px; cursor:pointer; font-size:var(--fh-text-xs); font-weight:700; color:#5C3A24;
    background:transparent; border:none; min-height:44px;
  }
  .fh-ml-scope-opt.on { background:#3A1F12; color:#F2E5CC; }

  /* Quick-pick chips row (special meals + browse) */
  .fh-ml-dr-quick { display:flex; align-items:center; gap:8px; padding:11px 22px 0; flex-wrap:wrap; flex-shrink:0; }

  /* Meal / side / protein grid \u2014 reflows by width */
  .fh-ml-grid {
    flex:1; min-height:0; overflow-y:auto;
    display:grid; grid-template-columns:repeat(auto-fill, minmax(118px, 1fr)); gap:10px; align-content:start;
    padding:13px 22px 20px;
  }
  .fh-ml-grid::-webkit-scrollbar { width:0; }

  /* Protein/cut cards */
  .fh-ml-pgrid { grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); }
  .fh-ml-pcard { min-height:134px; gap:5px; }
  .fh-ml-pcard.on { border:2px solid #8B3A2A; background:rgba(139,58,42,.12); }
  .fh-ml-pcount {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700;
    letter-spacing:.1em; color:#6E4423; text-transform:uppercase;
  }

  /* Sides step */
  /* Sides step: food-group categories laid out left-to-right, each 2 sides wide */
  .fh-ml-sides-scroll { flex:1; min-height:0; overflow-y:auto; padding:11px 22px 18px; }
  .fh-ml-sides-scroll::-webkit-scrollbar { width:0; }
  .fh-ml-side-cols { display:flex; gap:14px; align-items:flex-start; flex-wrap:wrap; }
  .fh-ml-side-col  { flex:1 1 190px; min-width:170px; }
  .fh-ml-side-col.cue {
    background:rgba(58,106,40,.07); border:1px dashed rgba(58,106,40,.4);
    border-radius:9px; padding:2px 8px 8px;
  }
  .fh-ml-side-sec-hdr {
    display:flex; align-items:center; gap:8px; padding:6px 2px 7px;
    font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-md); color:#8B3A2A;
  }
  .fh-ml-side-sec-cue { display:block; font-family:"Caveat",cursive; font-size:var(--fh-text-sm); color:#2F5A20; font-weight:700; margin:-2px 2px 6px; }
  .fh-ml-side-colgrid { display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; }
  .fh-ml-sidegrid { display:grid; grid-template-columns:repeat(auto-fill, minmax(108px, 1fr)); gap:10px; }
  .fh-ml-sidecard { min-height:100px; padding:10px 6px 8px; }
  .fh-ml-sidecard.on { border:2px solid #3A6A28; background:rgba(58,106,40,.12); }
  .fh-ml-sidecard .ck {
    position:absolute; top:6px; right:6px; width:22px; height:22px; border-radius:50%;
    background:#3A6A28; color:#F2E5CC; font-size:var(--fh-text-xs); display:flex; align-items:center; justify-content:center;
  }
  .fh-ml-pairtag {
    position:absolute; top:7px; left:7px;
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:800;
    letter-spacing:.06em; color:#8B3A2A; background:rgba(139,58,42,.12); border-radius:4px; padding:2px 5px;
  }

  /* Plate-so-far row (sides step) */
  .fh-ml-plateso { display:flex; align-items:center; gap:12px; padding:11px 22px 0; flex-wrap:wrap; flex-shrink:0; }
  .fh-ml-plateso .fh-ml-dot { width:12px; height:12px; }
  .fh-ml-plateso-note { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; font-weight:600; }
  .fh-ml-plateso-note.good { color:#3A6A28; }

  /* Dismissible nudge banners */
  .fh-ml-nudge {
    display:inline-flex; align-items:center; gap:10px;
    font-family:"Caveat",cursive; font-size:var(--fh-text-md); font-weight:700; color:#2F5A20;
    background:rgba(58,106,40,.12); border:1px solid rgba(58,106,40,.45); border-radius:999px; padding:5px 8px 5px 16px;
  }
  .fh-ml-fats {
    display:inline-flex; align-items:center; gap:10px;
    font-family:"Caveat",cursive; font-size:var(--fh-text-md); font-weight:600; color:#6E4423;
    background:rgba(176,120,24,.12); border:1px solid rgba(176,120,24,.4); border-radius:999px; padding:4px 8px 4px 14px;
  }
  .fh-ml-nudge-x {
    border:none; cursor:pointer; border-radius:999px; min-height:36px; padding:6px 14px;
    background:rgba(58,31,18,.14); color:#5C3A24; font-family:"Manrope",sans-serif; font-size:var(--fh-text-xs); font-weight:700;
  }

  /* Drawer footer */
  .fh-ml-dr-foot {
    display:flex; align-items:center; gap:12px; padding:10px 22px 14px;
    border-top:1px dashed rgba(58,31,18,.32); flex-shrink:0; flex-wrap:wrap;
  }
  .fh-ml-dr-foot-note { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; }

  /* Drawer confirm step (plan next day / done) */
  .fh-ml-confirm {
    flex:1; min-height:0; display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; gap:12px; padding:24px;
  }
  .fh-ml-confirm-icon { font-size:calc(3.5rem * var(--fh-text-scale,1)); line-height:1; }
  .fh-ml-confirm-msg  { font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-lg); color:#3A1F12; line-height:1.2; }
  .fh-ml-confirm-msg b { color:#8B3A2A; }
  .fh-ml-confirm-sub  { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; }
  .fh-ml-confirm-actions { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:8px; }

  /* ================================================================
     WHAT CAN WE MAKE (PANTRY) VIEW
     ================================================================ */

  .fh-ml-pantry { flex:1; min-height:0; display:grid; grid-template-columns:1.15fr 1fr; gap:14px; overflow:hidden; }
  .fh-ml-panel {
    background:rgba(251,243,226,.72); border:1px solid rgba(58,31,18,.28); border-radius:9px;
    display:flex; flex-direction:column; min-height:0; overflow:hidden;
  }
  .fh-ml-panel-hdr {
    font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-md); color:#8B3A2A; text-align:center;
    padding:11px 14px 9px; border-bottom:1px dashed rgba(58,31,18,.32); flex-shrink:0;
  }
  .fh-ml-panel-hdr small { display:block; font-family:"Caveat",cursive; font-size:var(--fh-text-sm); color:#6E4423; margin-top:1px; }
  .fh-ml-ingscroll { flex:1; min-height:0; overflow-y:auto; padding:2px 12px 12px; }
  .fh-ml-ingscroll::-webkit-scrollbar { width:0; }
  .fh-ml-ing-sec-hdr {
    display:flex; align-items:center; gap:7px;
    font-family:"Caveat",cursive; font-size:var(--fh-text-md); font-weight:700; color:#8B3A2A; padding:10px 2px 6px;
  }
  .fh-ml-ing-sec-hdr .fh-ml-dot { width:11px; height:11px; }
  .fh-ml-ingrid { display:grid; grid-template-columns:repeat(auto-fill, minmax(84px, 1fr)); gap:8px; }
  .fh-ml-ing-chip {
    min-height:72px; border-radius:9px; cursor:pointer; position:relative;
    background:#FBF3E2; border:1.5px solid rgba(58,31,18,.3);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; padding:6px 4px;
  }
  .fh-ml-ing-chip.on { border:2px solid #3A6A28; background:rgba(58,106,40,.12); }
  .fh-ml-ing-glyph { font-size:calc(1.45rem * var(--fh-text-scale,1)); line-height:1; }
  .fh-ml-ing-lbl  { font-size:var(--fh-text-xs); font-weight:700; color:#3A1F12; text-align:center; line-height:1.1; }
  .fh-ml-ing-chip .ck {
    position:absolute; top:5px; right:5px; width:20px; height:20px; border-radius:50%;
    background:#3A6A28; color:#F2E5CC; font-size:var(--fh-text-xs); display:flex; align-items:center; justify-content:center;
  }
  .fh-ml-matches { flex:1; min-height:0; overflow-y:auto; padding:6px 0; }
  .fh-ml-matches::-webkit-scrollbar { width:0; }
  .fh-ml-match-row {
    display:flex; align-items:center; gap:11px; padding:10px 14px; min-height:56px; cursor:pointer;
    border-bottom:1px dashed rgba(58,31,18,.25);
  }
  .fh-ml-match-row:active { background:rgba(242,229,204,.8); }
  .fh-ml-match-glyph { font-size:calc(1.6rem * var(--fh-text-scale,1)); line-height:1; flex-shrink:0; }
  .fh-ml-match-body  { flex:1; min-width:0; }
  .fh-ml-match-name  { font-size:var(--fh-text-base); font-weight:700; color:#3A1F12; }
  .fh-ml-match-uses  {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:600;
    letter-spacing:.04em; color:#6E4423; margin-top:2px;
  }
  .fh-ml-match-uses .hit { color:#2F5A20; }

  /* Day-pick modal (pantry \u2192 pick a night) \u2014 reflows by width */
  .fh-ml-daypick { display:grid; grid-template-columns:repeat(auto-fill, minmax(92px, 1fr)); gap:8px; }
  .fh-ml-dpick {
    min-height:88px; border-radius:8px; cursor:pointer; padding:8px 4px;
    background:rgba(242,229,204,.7); border:1.5px solid rgba(58,31,18,.32);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; text-align:center;
  }
  .fh-ml-dpick:active { background:#F2E5CC; }
  .fh-ml-dpick-dow { font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700; letter-spacing:.12em; color:#6E4423; }
  .fh-ml-dpick-cur { font-size:var(--fh-text-xs); font-weight:600; color:#3A1F12; line-height:1.15; max-width:100%; overflow:hidden; }
  .fh-ml-dpick-cur.open { font-family:"Caveat",cursive; font-size:var(--fh-text-sm); color:#3A6A28; }

  /* ================================================================
     LIBRARY VIEW
     ================================================================ */

  .fh-ml-lib { flex:1; min-height:0; display:flex; flex-direction:column; gap:10px; overflow:hidden; }
  .fh-ml-libfilters { display:flex; align-items:center; gap:8px; flex-shrink:0; flex-wrap:wrap; }
  .fh-ml-libhint { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; margin-left:auto; }
  .fh-ml-libscroll { flex:1; min-height:0; overflow-y:auto; padding-bottom:6px; }
  .fh-ml-libscroll::-webkit-scrollbar { width:0; }
  .fh-ml-libgrid { display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:10px; align-content:start; }
  .fh-ml-libcard { min-height:132px; }
  .fh-ml-fav-btn {
    position:absolute; top:4px; right:4px; width:40px; height:40px; border:none; background:transparent;
    font-size:var(--fh-text-md); cursor:pointer; color:rgba(58,31,18,.5); display:flex; align-items:center; justify-content:center;
  }
  .fh-ml-fav-btn.on { color:#8B3A2A; }
  .fh-ml-rbadge {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:800; letter-spacing:.1em;
    color:#2F5A20; border:1px solid rgba(58,106,40,.6); border-radius:4px; padding:2px 6px;
  }
  .fh-ml-wgbadge {
    position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700; letter-spacing:.06em;
    color:#8A5A12; white-space:nowrap;
  }

  /* Recipe Ideas shelf */
  .fh-ml-disc-hdr {
    font-family:"Caveat",cursive; font-size:var(--fh-text-lg); font-weight:700; color:#8B3A2A; margin:16px 2px 9px;
  }
  .fh-ml-disc-hdr small {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); letter-spacing:.1em;
    color:#6E4423; font-weight:600; margin-left:10px;
  }
  .fh-ml-disc-refresh {
    float:right; border:1.5px solid rgba(58,31,18,.4); background:rgba(251,243,226,.8); cursor:pointer;
    border-radius:999px; min-height:40px; padding:7px 16px;
    font-family:"Manrope",sans-serif; font-size:var(--fh-text-sm); font-weight:700; color:#5C3A24;
  }
  .fh-ml-idea-hint { font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#6E4423; margin:0 2px 10px; }
  .fh-ml-idea-hint b { color:#8B3A2A; }
  .fh-ml-idea-uses {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700;
    letter-spacing:.06em; color:#2F5A20; text-transform:uppercase;
  }
  .fh-ml-discrow { display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:10px; }
  .fh-ml-disccard { min-height:134px; justify-content:flex-start; padding-top:14px; cursor:default; }
  .fh-ml-disc-area {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700;
    letter-spacing:.1em; color:#6E4423; text-transform:uppercase;
  }
  .fh-ml-disc-save {
    margin-top:2px; min-height:40px; padding:7px 14px; border-radius:20px; cursor:pointer;
    border:1.5px solid rgba(139,58,42,.6); background:transparent;
    color:#8B3A2A; font-size:var(--fh-text-sm); font-weight:700;
  }
  .fh-ml-disc-save.saved { background:rgba(139,58,42,.14); }

  /* ================================================================
     GROCERIES VIEW
     ================================================================ */

  .fh-ml-groc { flex:1; min-height:0; display:flex; flex-direction:column; gap:10px; overflow:hidden; }
  .fh-ml-groc-head { display:flex; align-items:center; gap:12px; flex-shrink:0; flex-wrap:wrap; }
  .fh-ml-groc-cols {
    flex:1; min-height:0; overflow-y:auto;
    display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:12px; align-content:start;
  }
  .fh-ml-groc-cols::-webkit-scrollbar { width:0; }
  .fh-ml-groc-sec {
    background:rgba(251,243,226,.72); border:1px solid rgba(58,31,18,.28); border-radius:9px; overflow:hidden;
  }
  .fh-ml-groc-sec-hdr {
    font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-md); color:#8B3A2A; text-align:center;
    padding:9px 10px 7px; border-bottom:1px dashed rgba(58,31,18,.32);
  }
  .fh-ml-groc-row {
    display:flex; align-items:center; gap:10px; padding:9px 12px; min-height:48px; cursor:pointer;
    border-bottom:1px dashed rgba(58,31,18,.2);
  }
  .fh-ml-groc-row:last-child { border-bottom:none; }
  .fh-ml-check {
    width:30px; height:30px; border-radius:50%; border:1.5px solid rgba(58,31,18,.5); flex-shrink:0;
    display:flex; align-items:center; justify-content:center; font-size:var(--fh-text-sm); color:transparent; background:transparent;
  }
  .fh-ml-groc-row.done .fh-ml-check { background:#3A6A28; border-color:#3A6A28; color:#F2E5CC; }
  .fh-ml-groc-body { flex:1; min-width:0; }
  .fh-ml-groc-lbl  { font-size:var(--fh-text-base); font-weight:700; color:#3A1F12; }
  .fh-ml-groc-row.done .fh-ml-groc-lbl { text-decoration:line-through; opacity:.5; }
  .fh-ml-groc-from {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:600; letter-spacing:.06em;
    color:#6E4423; margin-top:1px; text-transform:uppercase;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .fh-ml-groc-g { font-size:calc(1.2rem * var(--fh-text-scale,1)); flex-shrink:0; }

  /* ================================================================
     RECIPE MODAL  &  DAY-PICK MODAL
     ================================================================ */

  .fh-ml-modal-scrim {
    position:absolute; inset:0; background:rgba(40,25,12,.42); z-index:50;
    display:flex; align-items:center; justify-content:center; padding:16px;
    animation:fhMlFade .15s ease-out;
  }
  .fh-ml-modal {
    background:#FBF3E2; border:2px solid rgba(58,31,18,.4); border-radius:12px;
    box-shadow:0 22px 60px rgba(40,25,12,.45); padding:20px 22px;
    max-width:min(700px,94vw); max-height:86vh; width:100%;
    display:flex; flex-direction:column; gap:13px; overflow:hidden;
  }
  .fh-ml-modal-title {
    font-family:"DM Serif Display",Georgia,serif; font-size:var(--fh-text-lg); color:#3A1F12;
  }
  .fh-ml-modal-title em {
    font-style:normal; font-family:"Caveat",cursive; font-size:var(--fh-text-md); color:#8B3A2A; margin-left:8px;
  }
  .fh-ml-modal-actions { display:flex; justify-content:flex-end; gap:10px; }

  .fh-ml-recipe-cols {
    display:grid; grid-template-columns:1fr 1.3fr; gap:18px; overflow-y:auto; min-height:0;
  }
  .fh-ml-recipe-h { font-family:"Caveat",cursive; font-size:var(--fh-text-md); font-weight:700; color:#8B3A2A; margin-bottom:6px; }
  .fh-ml-recipe-meta {
    font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700;
    letter-spacing:.12em; color:#6E4423; text-transform:uppercase;
  }
  .fh-ml-recipe-ing   { margin:0; padding-left:18px; font-size:var(--fh-text-base); line-height:1.65; color:#3A1F12; }
  .fh-ml-recipe-steps {
    margin:0; padding-left:20px; font-size:var(--fh-text-base); line-height:1.55; color:#3A1F12;
    display:flex; flex-direction:column; gap:7px;
  }

  /* ---- Admin "Meal Planner" section (desktop Admin mode) ---- */
  .fh-ml-adm        { display:grid; grid-template-columns:1.15fr 1fr; gap:14px; align-items:start; }
  .fh-ml-adm-tabs   { display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
  .fh-ml-form       { display:flex; flex-direction:column; gap:8px; padding:12px 16px 16px; }
  .fh-ml-flabel     { font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:700; letter-spacing:.14em; color:#6E4423; text-transform:uppercase; padding-top:6px; display:block; }
  .fh-ml-input      {
    font-family:"Manrope",sans-serif; font-size:var(--fh-text-base); font-weight:600; color:#3A1F12;
    background:#FBF3E2; border:1.5px solid rgba(58,31,18,.4); border-radius:8px;
    padding:10px 12px; min-height:44px; outline:none; width:100%; box-sizing:border-box;
  }
  .fh-ml-input:focus { border-color:#8B3A2A; }
  textarea.fh-ml-input { resize:vertical; line-height:1.5; min-height:88px; }
  select.fh-ml-input   { cursor:pointer; }
  .fh-ml-chiprow    { display:flex; flex-wrap:wrap; gap:6px; }
  .fh-ml-chk        { display:inline-flex; align-items:center; gap:6px; cursor:pointer;
    min-height:40px; padding:6px 13px; font-size:var(--fh-text-xs); font-weight:700; color:#3A1F12;
    background:#FBF3E2; border:1.5px solid rgba(58,31,18,.3); border-radius:20px; }
  .fh-ml-chk input  { accent-color:#8B3A2A; width:18px; height:18px; }
  .fh-ml-admin-list { display:flex; flex-direction:column; }
  .fh-ml-admin-row  { display:flex; align-items:center; gap:11px; padding:8px 14px; min-height:52px; border-bottom:1px dashed rgba(58,31,18,.22); }
  .fh-ml-admin-row .g    { font-size:calc(1.4rem * var(--fh-text-scale,1)); line-height:1; flex-shrink:0; }
  .fh-ml-admin-row .nm   { flex:1; min-width:0; font-size:var(--fh-text-base); font-weight:700; color:#3A1F12; }
  .fh-ml-admin-row .meta { font-family:"JetBrains Mono",monospace; font-size:var(--fh-text-xs); font-weight:600; letter-spacing:.08em; color:#6E4423; margin-top:2px; }

  /* ================================================================
     RESPONSIVE \u2014 viewport @media (NOT container queries; the card column
     never reaches desktop width in sectioned dashboards). Wide/default =
     Echo Show Panel; below 900px = narrow column / phone: split panes stack,
     7-day board + day rail become readable vertical/horizontal scrollers.
     ================================================================ */

  @media (max-width: 900px) {
    .fh-tdy-wrap     { grid-template-columns:1fr; }
    .fh-ml-week      { grid-template-columns:1fr; }
    .fh-ml-day       { min-height:120px; }
    .fh-ml-day-dinner { flex-direction:row; flex-wrap:wrap; justify-content:flex-start; text-align:left; gap:8px; }
    .fh-ml-day-dinner .fh-ml-plate { margin-top:0; margin-left:auto; padding-top:0; }
    .fh-ml-slots     { grid-template-columns:1fr; overflow-y:auto; }
    .fh-ml-pantry    { grid-template-columns:1fr; overflow-y:auto; }
    .fh-ml-pantry .fh-ml-panel { min-height:240px; }
    .fh-ml-recipe-cols { grid-template-columns:1fr; }
    .fh-ml-adm       { grid-template-columns:1fr; }

    /* Plan: rail becomes a horizontal scroll strip above the main panel */
    .fh-ml-bld   { flex-direction:column; overflow-y:auto; }
    .fh-ml-rail  { width:100%; max-height:none; display:flex; flex-direction:row; overflow-x:auto; overflow-y:hidden; }
    .fh-ml-rail-wk   { display:none; }
    .fh-ml-rail-day  { flex-direction:column; align-items:center; gap:3px; min-width:88px;
                       border-left:none; border-bottom:4px solid transparent; padding:8px 10px; }
    .fh-ml-rail-day.active { border-left:none; border-bottom-color:#8B3A2A; }
    .fh-ml-rail-date { flex:none; text-align:center; }
  }
`});var Mt,Ia=N(()=>{$a();Ea();za();Ma();Fa();Da();Mt=_a+Sa+Ca+Aa+Ba+Ra});var Ta=N(()=>{Ia()});var Pa,lt,H,Bt,ie,W,Ft,K=N(()=>{Pa="family_hub",lt="0.7.6",H="#7F77DD",Bt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],ie={task_completed:{label:"Completed",color:"var(--fh-success)"},task_approved:{label:"Approved",color:"var(--fh-success)"},pending_approval:{label:"Pending approval",color:"var(--fh-warning)"},task_denied:{label:"Denied",color:"var(--fh-overdue)"},task_skipped:{label:"Skipped",color:"var(--fh-warning)"},task_excused:{label:"Excused",color:"var(--fh-accent)"},task_rejected:{label:"Rejected",color:"var(--fh-overdue)"},task_marked_complete:{label:"Marked done",color:"var(--fh-success)"},task_late_claimed:{label:"Claimed late",color:"var(--fh-warning)"},points_awarded:{label:"Points",color:"var(--fh-accent)"},redemption_requested:{label:"Redeem request",color:"var(--fh-warning)"},redemption_approved:{label:"Redeem approved",color:"var(--fh-success)"},redemption_declined:{label:"Redeem declined",color:"var(--fh-overdue)"},task_added:{label:"Task added",color:"var(--fh-text-sec)"},person_added:{label:"Person added",color:"var(--fh-text-sec)"},allowance:{label:"Allowance",color:"var(--fh-success)"},completion_streak_milestone:{label:"Success streak",color:"var(--fh-success)"},weekly_completion_streak_milestone:{label:"Weekly streak",color:"var(--fh-success)"},subscription_cancel_declined:{label:"Cancel declined",color:"var(--fh-warning)"},subscription_updated:{label:"Sub updated",color:"var(--fh-text-sec)"},subscription_started:{label:"Subscribed",color:"var(--fh-accent)"},subscription_renewed:{label:"Sub renewal",color:"var(--fh-text-sec)"},subscription_lapsed:{label:"Sub lapsed",color:"var(--fh-warning)"},subscription_canceled:{label:"Sub canceled",color:"var(--fh-text-sec)"},subscription_cancel_requested:{label:"Cancel requested",color:"var(--fh-warning)"},group_proposed:{label:"Group proposed",color:"var(--fh-text-sec)"},group_chip_in:{label:"Chipped in",color:"var(--fh-accent)"},group_redeemed:{label:"Group redeemed",color:"var(--fh-success)"}},W={check:'<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',plus:'<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>',edit:'<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',trash:'<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',bell:'<svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.92V4a1 1 0 1 0-2 0v1.08A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',award:'<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',minus:'<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14z"/></svg>',close:'<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',settings:'<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/></svg>',person:'<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',store:'<svg viewBox="0 0 24 24"><path d="M20 4H4v2l16-2zm1 5H3l1 11h16l1-11zm-9 8H10v-4h2v4zm0-6H10v-2h2v2z"/></svg>',remove:'<svg viewBox="0 0 24 24"><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM2 6v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6H2zm8 13H4v-1h6v1zm0-3H4v-1h6v1zm0-3H4v-1h6v1zm1-7H3V8h8V6zm-2-3H5V2h4v1z"/></svg>',history:'<svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>',excuse:'<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',print:'<svg viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-1-9H6v4h12V3z"/></svg>',rewards:'<svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.89.36 13.36.36c-1.38 0-2.56.6-3.36 1.55C9.2.96 8.02.36 6.64.36 4.11.36 2 2.53 2 4.64c0 .48.11.92.18 1.36H0v4h1v10h22V10h1V6h-4zm-8 12H6V10h6v8zm0-10H4V8h8v2zm4 10h-2v-8h2v8zm2-10h-6V8h6v2zm-5.36-4c-.45 0-1.09-.49-1.09-1.36 0-.87.64-1.36 1.09-1.36.46 0 1.1.49 1.1 1.36C13.74 3.51 13.1 4 12.64 4zM6.64 4c-.45 0-1.09-.49-1.09-1.36 0-.87.64-1.36 1.09-1.36.46 0 1.1.49 1.1 1.36C7.74 3.51 7.1 4 6.64 4z"/></svg>',toggle:'<svg viewBox="0 0 24 24"><path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>'},Ft=[{key:"brush-teeth-am",name:"Brush teeth",description:"Morning \u2014 brush for 2 minutes",category:"Morning",points:5},{key:"make-bed",name:"Make bed",description:"Pull up covers and fluff pillow",category:"Morning",points:10},{key:"get-dressed",name:"Get dressed",description:"Clothes on, shoes tied, ready to go",category:"Morning",points:5},{key:"take-vitamins",name:"Take vitamins",description:"",category:"Morning",points:5},{key:"eat-breakfast",name:"Eat breakfast",description:"",category:"Morning",points:5},{key:"brush-teeth-pm",name:"Brush teeth (evening)",description:"Before bed \u2014 brush for 2 minutes",category:"Evening",points:5},{key:"pajamas-on",name:"Pajamas on",description:"",category:"Evening",points:5},{key:"pick-up-room",name:"Pick up room",description:"Put toys away and tidy floor",category:"Evening",points:10},{key:"pack-backpack",name:"Pack backpack",description:"Ready for tomorrow",category:"Evening",points:10},{key:"clear-table",name:"Clear table",description:"After dinner \u2014 dishes to the sink",category:"Kitchen",points:10},{key:"load-dishwasher",name:"Load dishwasher",description:"",category:"Kitchen",points:15},{key:"unload-dishwasher",name:"Unload dishwasher",description:"",category:"Kitchen",points:15},{key:"wipe-counters",name:"Wipe counters",description:"",category:"Kitchen",points:10},{key:"take-out-trash",name:"Take out trash",description:"",category:"Chores",points:15},{key:"vacuum",name:"Vacuum living room",description:"",category:"Chores",points:20},{key:"sweep-floor",name:"Sweep/mop floor",description:"",category:"Chores",points:15},{key:"feed-pets",name:"Feed pets",description:"",category:"Chores",points:10},{key:"water-plants",name:"Water plants",description:"",category:"Chores",points:10},{key:"homework",name:"Homework",description:"Complete all assigned homework",category:"School",points:20},{key:"reading",name:"Reading time",description:"Read for 20 minutes",category:"School",points:15}]});function Oa(e){return e<-1?`${Math.abs(e)}d overdue`:e===-1?"1d overdue":e===0?"Today":e===1?"Tomorrow":`In ${e}d`}function dt(e,t){return e.map(a=>`<option value="${a.value}" ${a.value===t?"selected":""}>${a.label}</option>`).join("")}function ta(e,t,a=!1){let o=e||[],s=a?o.slice(0,1):o;return Bt.map((i,n)=>{let r=s.includes(n);return`<label class="fh-wd-chip ${r?"checked":""}">
          <input type="${a?"radio":"checkbox"}" class="${t}" value="${n}" ${r?"checked":""}>
          ${i}
        </label>`}).join("")}function ne(e){if(!e)return"";let t=Date.now()-new Date(e).getTime(),a=Math.floor(t/6e4);if(a<1)return"just now";if(a<60)return`${a}m ago`;let o=Math.floor(a/60);return o<24?`${o}h ago`:`${Math.floor(o/24)}d ago`}function uo(e){return e?new Date(e+"T12:00:00").toLocaleDateString(void 0,{month:"short",day:"numeric"}):""}function ce(e){let t=[],a=new Map;for(let s of e){if(s.type==="task_skipped"){let i=s.skipped_date||(s.timestamp||"").slice(0,10);if(i){a.has(i)||a.set(i,[]),a.get(i).push(s);continue}}t.push({isGroup:!1,entry:s,timestamp:s.timestamp})}let o=[];for(let[s,i]of a){let n=i.reduce((r,d)=>r+Math.abs(d.points_delta||0),0);o.push({isGroup:!0,key:`skipped-${s}`,date:s,dateDisplay:uo(s),totalPenalty:n,items:i,timestamp:i[0].timestamp})}return[...t,...o].sort((s,i)=>(i.timestamp||"").localeCompare(s.timestamp||""))}var j,O,G,ea,La,m,C,Q=N(()=>{K();j=e=>(e||"?")[0].toUpperCase(),O=e=>(e||0).toLocaleString(),G=e=>`$${(e||0).toFixed(2)}`,ea=e=>e?e[0].toUpperCase()+e.slice(1):"",La=e=>(e||"").toLowerCase().replace(/ /g,"_"),m=e=>String(e||"").replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]),C=m});function pe(e,t,a="28px"){return typeof e=="string"&&e.startsWith("data:image/")?`<span class="fh-chore-icon" style="width:${a};height:${a};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><img src="${e}" style="width:100%;height:100%;object-fit:contain;border-radius:4px" alt=""></span>`:e&&Na[e]?`<span class="fh-chore-icon fh-chore-emoji" style="width:${a};height:${a};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><svg viewBox="0 0 24 24"><text x="12" y="12" text-anchor="middle" dominant-baseline="central" font-size="22">${Na[e]}</text></svg></span>`:e&&aa[e]?`<span class="fh-chore-icon" style="width:${a};height:${a};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:currentColor">`+aa[e]+"</span>":`<span class="fh-chore-dot" style="width:12px;height:12px;border-radius:50%;background:${t||vo[0]};display:inline-block;flex-shrink:0"></span>`}var I,aa,Na,sa,Ha,vo,mr,ut=N(()=>{I=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,aa={bed:I('<rect x="2" y="8" width="20" height="12" rx="1"/><path d="M2 14h20"/><path d="M7 14V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5"/><circle cx="6" cy="11" r="1" fill="currentColor" stroke="none"/>'),tooth:I('<path d="M9 3h6a4 4 0 0 1 4 4c0 5-1.5 9-3 12-.5 1-1.5 1-2 0l-.5-2c-.3-.9-1.7-.9-2 0l-.5 2c-.5 1-1.5 1-2 0C7.5 16 6 12 6 7a4 4 0 0 1 3-4z"/>'),shower:I('<path d="M5 5l4 4"/><path d="M19 4a9 9 0 0 0-9 9"/><path d="M14 4a9 9 0 0 0-5 5"/><path d="M4 22l5-5"/><circle cx="11" cy="15" r=".6" fill="currentColor" stroke="none"/><circle cx="14" cy="17" r=".6" fill="currentColor" stroke="none"/><circle cx="8.5" cy="17" r=".6" fill="currentColor" stroke="none"/><circle cx="11" cy="19" r=".6" fill="currentColor" stroke="none"/>'),hair:I('<path d="M4 4h16v3H4z"/><path d="M6 7v9M9 7v12M12 7v12M15 7v9M18 7v9"/>'),sleep:I('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>'),laundry:I('<rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2.5"/><path d="M7 6h.5M10 6h.5"/>'),folding:I('<path d="M3 6l3-4h4l2 3 2-3h4l3 4-4 2v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8z"/>'),room:I('<path d="M3 21V9.5L12 3l9 6.5V21H3z"/><path d="M9 21v-7h6v7"/>'),pack:I('<path d="M5 7h14l-1.5 12a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-2z"/><path d="M8 7V6a4 4 0 0 1 8 0v1"/><path d="M9 13h6"/>'),backpack:I('<path d="M9 4a3 3 0 0 1 6 0v1a7 7 0 0 1-6 0z"/><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 14h8M8 17h5"/>'),dog:I('<path d="M3 11a9 9 0 0 0 18 0V8l-3-1-1-5-5 3-5-3-1 5-3 1z"/><path d="M7 19v3M17 19v3"/><circle cx="10" cy="11" r=".8" fill="currentColor" stroke="none"/><circle cx="14" cy="11" r=".8" fill="currentColor" stroke="none"/><path d="M10 14c1.5 1.5 2.5 1.5 4 0"/>'),cat:I('<path d="M5 7l-1-5 4 4h4l4-4-1 5a7 7 0 0 1-10 0z"/><circle cx="10" cy="12" r=".5" fill="currentColor" stroke="none"/><circle cx="14" cy="12" r=".5" fill="currentColor" stroke="none"/><path d="M10 14l1 2h2l1-2M12 17v1.5"/>'),pet:I('<ellipse cx="7.5" cy="7.5" rx="2.5" ry="3"/><ellipse cx="16.5" cy="7.5" rx="2.5" ry="3"/><ellipse cx="4" cy="14" rx="2" ry="2.5"/><ellipse cx="20" cy="14" rx="2" ry="2.5"/><ellipse cx="12" cy="16.5" rx="5.5" ry="4.5"/>'),fish:I('<path d="M20 12a8 8 0 0 1-8 6 8 8 0 0 1-8-6 8 8 0 0 1 8-6 8 8 0 0 1 8 6z"/><path d="M20 12l4-5v10z"/><circle cx="9" cy="11" r="1" fill="currentColor" stroke="none"/>'),dishes:I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>'),plate:I('<path d="M5 3v8a4 4 0 0 0 8 0V3M9 3v17"/><path d="M19 3v17M17 7a2 2 0 0 1 4 0v4h-4z"/>'),cooking:I('<path d="M4 15h16l-1.5 5a2 2 0 0 1-1.9 1.5H7.4A2 2 0 0 1 5.5 20z"/><path d="M8 7V5M12 6V4M16 7V5"/><path d="M5 12h14a6 6 0 0 0-6-6h-2a6 6 0 0 0-6 6z"/>'),meals:I('<path d="M4 15a8 8 0 0 0 16 0H4z"/><path d="M8 10c0-1 1-2 1-3M12 10c0-1 1-2 1-3M16 10c0-1 1-2 1-3"/>'),lunch:I('<rect x="3" y="10" width="18" height="11" rx="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/><path d="M8 15h8M8 18h5"/>'),coffee:I('<path d="M6 10h12v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"/><path d="M18 12h2a2 2 0 0 1 0 4h-2"/><path d="M9 6c0-1.5 1-2 1-3M13 6c0-1.5 1-2 1-3"/>'),snack:I('<path d="M14 3c1 0 2 1 2 2 0 2-2 3-3 4-1-1-3-2-3-4a2 2 0 0 1 2-2h2z"/><path d="M12 9a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/>'),bread:I('<path d="M3 11a5 5 0 0 1 10 0v9H3z"/><path d="M13 11a5 5 0 0 1 5-5h1a2 2 0 0 1 2 2v11H13z"/><path d="M3 14h10"/>'),menu:I('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>'),table:I('<circle cx="12" cy="13" r="5"/><path d="M5 3v8M5 11a3 3 0 0 0 6 0"/><path d="M19 3v17M17 7a2 2 0 0 1 4 0v4h-4z"/>'),trash:I('<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>'),broom:I('<path d="M19 3 9 13"/><path d="M7 15.5l5 5M5 21l2-2M10 20.5l3-3"/><path d="m9 13 5 5-3 3-7 1 1-7z"/>'),vacuum:I('<circle cx="14" cy="15" r="5"/><circle cx="14" cy="15" r="2"/><path d="M9 15H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h5l3-2h6l-3 6"/>'),wipe:I('<rect x="3" y="10" width="18" height="10" rx="2"/><path d="M7 14l3 3M11 14l3 3M15 14l3 3"/><path d="M7 10V5a3 3 0 0 1 6 0v5"/>'),mop:I('<path d="M4 3l12 12"/><path d="M14 4l6 6"/><path d="M4 15l6-6 8 8-6 4-8-6z"/>'),sweep:I('<path d="M16 3 4 15"/><path d="M2 22l4-4.5"/><path d="M4 15h12a4 4 0 0 1 0 8H4z"/>'),bathroom:I('<path d="M3 14h18v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M3 14V9a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1"/><path d="M5 10h4"/>'),windows:I('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18"/>'),recycling:I('<path d="M7 11l-4 4 4 4M3 15h10a4 4 0 0 0 3.46-6"/><path d="M17 13l4-4-4-4M21 9H11a4 4 0 0 0-3.46 6"/>'),bucket:I('<path d="M7 6h10l1.5 13a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2z"/><path d="M5.5 6a6.5 6.5 0 0 1 13 0"/><path d="M9 12c0 2 1 3 3 3s3-1 3-3"/>'),dusting:I('<path d="M3 21l10-10"/><path d="M12 8l2-5 4 4-5 2z"/><path d="M14 12l3 3"/><path d="M17 7c1.5 1.5 1.5 3.5 0 5"/><path d="M15 5c2.5 1.5 3.5 4.5 1 7"/>'),lawn:I('<path d="M3 21h18"/><path d="M6 21V14a6 6 0 0 1 12 0v7"/><path d="M12 8v6"/><path d="M10 11c-.5-1.5 0-3.5 2-3.5s2.5 2 2 3.5"/>'),garden:I('<path d="M3 14a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M17 15h3l1-6"/><path d="M5 14V9a4 4 0 0 1 8 0v5"/><path d="M7 20l1 3M10 20l1 3M13 20l1 3"/>'),plant:I('<path d="M12 20V12"/><path d="M12 12c-3-2-6-1-7-6 5-1 8 2 7 6z"/><path d="M12 12c3-2 6-1 7-6-5-1-8 2-7 6z"/><path d="M8 20h8"/>'),leaves:I('<path d="M5 21c3-8 9-14 16-14-2 8-8 14-16 14z"/><path d="M5 21l8-8"/>'),snow:I('<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/><path d="M9 6l3-3 3 3M9 18l3 3 3-3"/><path d="M4.5 10.5l-3 2 3 2M19.5 10.5l3 2-3 2"/>'),garage:I('<rect x="2" y="10" width="20" height="11" rx="1"/><path d="M2 10L12 3l10 7"/><path d="M6 15h12M6 18h8"/>'),homework:I('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/><path d="M16 17l2 2 4-4"/>'),reading:I('<path d="M3 6c3-1.5 6-1.5 9 0 3-1.5 6-1.5 9 0v13c-3-1.5-6-1.5-9 0-3-1.5-6-1.5-9 0z"/><path d="M12 6v13"/>'),book:I('<path d="M4 19V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z"/><path d="M4 17h14"/><path d="M8 7v5l2-2 2 2V7"/>'),pencil:I('<path d="M4 20l12-12 4 4-12 12z"/><path d="M14 6l4 4"/><path d="M4 20l-2 2"/>'),piano:I('<rect x="2" y="6" width="20" height="13" rx="1"/><path d="M7 6v7M10 6v7M15 6v7M18 6v7"/><path d="M2 13h20"/>'),practice:I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>'),calculator:I('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><rect x="7" y="10" width="3" height="2" rx=".5"/><rect x="10.5" y="10" width="3" height="2" rx=".5"/><rect x="14" y="10" width="3" height="2" rx=".5"/><rect x="7" y="13.5" width="3" height="2" rx=".5"/><rect x="10.5" y="13.5" width="3" height="2" rx=".5"/><rect x="14" y="13" width="3" height="5" rx=".5"/><rect x="7" y="17" width="3" height="2" rx=".5"/><rect x="10.5" y="17" width="3" height="2" rx=".5"/>'),medicine:I('<path d="M8.5 14.5l-5-5a5 5 0 0 1 7-7l5 5"/><path d="M14.5 9.5l-5 5"/><path d="M14.5 14.5l5-5a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7 0l-1-1"/>'),water:I('<path d="M12 2l7 11a7 7 0 1 1-14 0z"/>'),exercise:I('<path d="M6 12h12"/><path d="M6 10v4M18 10v4"/><path d="M4 9v6M20 9v6"/>'),sport:I('<circle cx="12" cy="12" r="9"/><path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9"/><path d="M12 3a15 15 0 0 0-4 9 15 15 0 0 0 4 9"/><path d="M3 9h18M3 15h18"/>'),walk:I('<circle cx="12" cy="4" r="2"/><path d="M8 20l2-6h4l-1 6"/><path d="M16 20l-1-6"/><path d="M9 10h6l-1 4H9l-1-4z"/><path d="M8 7l-2 3M16 7l2 3"/>'),art:I('<path d="M12 21a9 9 0 1 0-.5 0"/><circle cx="8.5" cy="9" r="1.5"/><circle cx="14.5" cy="8" r="1.5"/><circle cx="16.5" cy="13.5" r="1.5"/><circle cx="10" cy="15.5" r="1.5"/>'),music:I('<path d="M9 20V9l12-2v11"/><circle cx="6" cy="20" r="3"/><circle cx="18" cy="18" r="3"/>'),bike:I('<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M6 15l4-8 2 3h6"/><path d="M14 10l4 5"/>'),games:I('<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M6 13v-2M5 12h2"/><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="13.5" r=".5" fill="currentColor" stroke="none"/><path d="M11 16h2"/>'),tools:I('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>'),smarthome:I('<path d="M3 21V9.5L12 3l9 6.5V21H3z"/><circle cx="12" cy="15" r="2"/><path d="M9.17 12.17a5 5 0 0 1 5.66 0"/><path d="M6.34 9.34a9 9 0 0 1 11.32 0"/>'),screen:I('<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),car:I('<path d="M5 17H3a2 2 0 0 1-2-2v-4l3-6h16l3 6v4a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 9h14"/>'),shop:I('<path d="M6 2l3 6h10l-1.5 7H7.5L6 2z"/><circle cx="10" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M4 2H2"/>'),phone:I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),mail:I('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>'),errand:I('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M8 11h8M8 15h5"/>'),chore:I('<path d="M4 6h10l3 3v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"/><path d="M8 11l2 2 4-4"/><path d="M14 6V3h6v6h-6z"/>'),star:I('<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'),check:I('<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/>'),timer:I('<circle cx="12" cy="13" r="8"/><path d="M12 5V3M9 3h6"/><path d="M16.95 8.05l1.41-1.41"/><path d="M12 9v4h4"/>'),gift:I('<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18"/><path d="M12 8v13"/><path d="M7.5 8a2.5 2.5 0 1 1 0-5C9 3 11 5 12 8c1-3 3-5 4.5-5a2.5 2.5 0 1 1 0 5"/>'),cash:I('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9.5h.01M18 14.5h.01"/>'),candy:I('<circle cx="12" cy="12" r="5"/><path d="M7 12L3 8v8z"/><path d="M17 12l4-4v8z"/>'),icecream:I('<path d="M8 11a4 4 0 0 1 8 0"/><path d="M7 11h10l-5 11z"/><path d="M9.5 11l.5-2M14.5 11l-.5-2"/>'),cake:I('<rect x="3" y="13" width="18" height="8" rx="1"/><path d="M3 17h18"/><path d="M7 13v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/><path d="M13 13v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/><path d="M9 5v2M15 5v2"/>'),party:I('<path d="M3 21l5-14 8 8z"/><circle cx="17" cy="6" r="1"/><circle cx="20" cy="10" r="1"/><circle cx="14" cy="3" r="1"/><path d="M19 14l2 2M15 14l3 2"/>'),controller:I('<path d="M6 18a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4h-1l-2-3H9l-2 3z"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".7" fill="currentColor"/><circle cx="18" cy="13.5" r=".7" fill="currentColor"/>'),trophy:I('<path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4v2a3 3 0 0 0 3 3"/><path d="M17 6h3v2a3 3 0 0 1-3 3"/><path d="M9 15h6v3H9z"/><path d="M8 21h8"/>'),movie:I('<rect x="2" y="6" width="20" height="12" rx="1"/><path d="M2 10h20M2 14h20"/><path d="M5 6v12M19 6v12"/>'),toy:I('<rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/><path d="M9 17h6"/><path d="M9 8V5h6v3"/>'),sticker:I('<path d="M12 3a9 9 0 1 1-9 9 9 9 0 0 1 9-9z"/><path d="M9 10h.01M15 10h.01"/><path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5"/>')},Na={bed:"\u{1F6CF}\uFE0F",tooth:"\u{1F9B7}",shower:"\u{1F6BF}",hair:"\u{1F487}",sleep:"\u{1F634}",laundry:"\u{1F9FA}",folding:"\u{1F455}",room:"\u{1F9F9}",pack:"\u{1F392}",backpack:"\u{1F392}",dog:"\u{1F415}",cat:"\u{1F408}",pet:"\u{1F43E}",fish:"\u{1F41F}",dishes:"\u{1F37D}\uFE0F",plate:"\u{1F374}",table:"\u{1F37D}\uFE0F",cooking:"\u{1F373}",meals:"\u{1F372}",lunch:"\u{1F96A}",coffee:"\u2615",snack:"\u{1F37F}",bread:"\u{1F35E}",menu:"\u{1F4CB}",trash:"\u{1F5D1}\uFE0F",broom:"\u{1F9F9}",sweep:"\u{1F9F9}",vacuum:"\u{1F9F9}",mop:"\u{1F9FD}",wipe:"\u{1F9FD}",dusting:"\u{1F9F9}",bucket:"\u{1FAA3}",bathroom:"\u{1F6BD}",windows:"\u{1FA9F}",recycling:"\u267B\uFE0F",lawn:"\u{1F33F}",garden:"\u{1FAB4}",plant:"\u{1F331}",leaves:"\u{1F342}",snow:"\u2744\uFE0F",garage:"\u{1F9F0}",homework:"\u{1F4DD}",reading:"\u{1F4D6}",book:"\u{1F4DA}",pencil:"\u270F\uFE0F",calculator:"\u{1F9EE}",piano:"\u{1F3B9}",practice:"\u23F1\uFE0F",medicine:"\u{1F48A}",water:"\u{1F4A7}",exercise:"\u{1F4AA}",sport:"\u26BD",walk:"\u{1F6B6}",art:"\u{1F3A8}",music:"\u{1F3B5}",bike:"\u{1F6B2}",games:"\u{1F3AE}",tools:"\u{1F527}",smarthome:"\u{1F3E0}",screen:"\u{1F4FA}",car:"\u{1F697}",shop:"\u{1F6D2}",phone:"\u{1F4F1}",mail:"\u2709\uFE0F",errand:"\u{1F6CD}\uFE0F",chore:"\u{1F4CB}",star:"\u2B50",check:"\u2705",timer:"\u23F2\uFE0F",gift:"\u{1F381}",cash:"\u{1F4B5}",candy:"\u{1F36C}",icecream:"\u{1F366}",cake:"\u{1F382}",party:"\u{1F389}",controller:"\u{1F3AE}",trophy:"\u{1F3C6}",movie:"\u{1F3AC}",toy:"\u{1F9F8}",sticker:"\u{1F31F}"},sa=[{key:"bed",label:"Make Bed",category:"Self-Care"},{key:"tooth",label:"Brush Teeth",category:"Self-Care"},{key:"shower",label:"Shower",category:"Self-Care"},{key:"hair",label:"Groom Hair",category:"Self-Care"},{key:"sleep",label:"Bedtime",category:"Self-Care"},{key:"laundry",label:"Laundry",category:"Self-Care"},{key:"folding",label:"Fold Clothes",category:"Self-Care"},{key:"room",label:"Clean Room",category:"Self-Care"},{key:"pack",label:"Pack Bag",category:"Self-Care"},{key:"backpack",label:"Backpack",category:"Self-Care"},{key:"dog",label:"Walk Dog",category:"Pets"},{key:"cat",label:"Feed Cat",category:"Pets"},{key:"pet",label:"Pet Care",category:"Pets"},{key:"fish",label:"Feed Fish",category:"Pets"},{key:"dishes",label:"Dishes",category:"Kitchen"},{key:"plate",label:"Set Table",category:"Kitchen"},{key:"table",label:"Place Setting",category:"Kitchen"},{key:"cooking",label:"Cooking",category:"Kitchen"},{key:"meals",label:"Meal Prep",category:"Kitchen"},{key:"lunch",label:"Pack Lunch",category:"Kitchen"},{key:"coffee",label:"Make Coffee",category:"Kitchen"},{key:"snack",label:"Snack",category:"Kitchen"},{key:"bread",label:"Baking",category:"Kitchen"},{key:"menu",label:"Menu Plan",category:"Kitchen"},{key:"trash",label:"Trash",category:"Cleaning"},{key:"broom",label:"Sweep",category:"Cleaning"},{key:"sweep",label:"Sweep Floor",category:"Cleaning"},{key:"vacuum",label:"Vacuum",category:"Cleaning"},{key:"mop",label:"Mop",category:"Cleaning"},{key:"wipe",label:"Wipe Down",category:"Cleaning"},{key:"dusting",label:"Dusting",category:"Cleaning"},{key:"bucket",label:"Deep Clean",category:"Cleaning"},{key:"bathroom",label:"Bathroom",category:"Cleaning"},{key:"windows",label:"Windows",category:"Cleaning"},{key:"recycling",label:"Recycling",category:"Cleaning"},{key:"lawn",label:"Lawn",category:"Outdoors"},{key:"garden",label:"Garden",category:"Outdoors"},{key:"plant",label:"Plants",category:"Outdoors"},{key:"leaves",label:"Rake Leaves",category:"Outdoors"},{key:"snow",label:"Shovel Snow",category:"Outdoors"},{key:"garage",label:"Garage",category:"Outdoors"},{key:"homework",label:"Homework",category:"School"},{key:"reading",label:"Reading",category:"School"},{key:"book",label:"Books",category:"School"},{key:"pencil",label:"Study",category:"School"},{key:"calculator",label:"Math",category:"School"},{key:"piano",label:"Piano",category:"School"},{key:"practice",label:"Practice",category:"School"},{key:"medicine",label:"Medicine",category:"Health"},{key:"water",label:"Drink Water",category:"Health"},{key:"exercise",label:"Exercise",category:"Health"},{key:"sport",label:"Sport",category:"Health"},{key:"walk",label:"Walk",category:"Health"},{key:"art",label:"Art",category:"Hobbies"},{key:"music",label:"Music",category:"Hobbies"},{key:"bike",label:"Bike",category:"Hobbies"},{key:"games",label:"Games",category:"Hobbies"},{key:"tools",label:"Tools",category:"Home"},{key:"smarthome",label:"Smart Home",category:"Home"},{key:"screen",label:"Devices",category:"Home"},{key:"car",label:"Car",category:"Home"},{key:"shop",label:"Shopping",category:"Home"},{key:"phone",label:"Phone",category:"Home"},{key:"mail",label:"Mail",category:"Home"},{key:"errand",label:"Errand",category:"Home"},{key:"chore",label:"Chore",category:"Generic"},{key:"star",label:"Star Task",category:"Generic"},{key:"check",label:"Done",category:"Generic"},{key:"timer",label:"Timed Task",category:"Generic"}],Ha=[{key:"candy",label:"Candy",category:"Treats"},{key:"icecream",label:"Ice Cream",category:"Treats"},{key:"snack",label:"Snack",category:"Treats"},{key:"cake",label:"Cake",category:"Treats"},{key:"bread",label:"Baked Good",category:"Treats"},{key:"cash",label:"Cash",category:"Money & Gifts"},{key:"gift",label:"Gift",category:"Money & Gifts"},{key:"shop",label:"Shopping",category:"Money & Gifts"},{key:"sticker",label:"Sticker",category:"Money & Gifts"},{key:"screen",label:"Screen Time",category:"Screen Time"},{key:"games",label:"Video Games",category:"Screen Time"},{key:"controller",label:"Gamepad",category:"Screen Time"},{key:"movie",label:"Movie",category:"Screen Time"},{key:"phone",label:"Phone Time",category:"Screen Time"},{key:"bike",label:"Bike Ride",category:"Outings"},{key:"car",label:"Car Trip",category:"Outings"},{key:"walk",label:"Walk Out",category:"Outings"},{key:"sport",label:"Sports",category:"Outings"},{key:"pet",label:"Pet Time",category:"Outings"},{key:"toy",label:"Toy",category:"Fun & Special"},{key:"party",label:"Party",category:"Fun & Special"},{key:"trophy",label:"Trophy",category:"Fun & Special"},{key:"star",label:"Special",category:"Fun & Special"},{key:"music",label:"Music",category:"Fun & Special"},{key:"art",label:"Art Supplies",category:"Fun & Special"},{key:"book",label:"Book",category:"Fun & Special"},{key:"timer",label:"Extra Time",category:"Fun & Special"}],vo=["#7F77DD","#30d158","#ff9f0a","#ff453a","#5ac8fa","#ff2d55","#af52de"];mr=Object.keys(aa)});function fe(e){return!e||e.type!=="task_skipped"||e.instance_status!=="skipped"||!e.reference_id||!e.person_id?"":`<button class="fh-btn fh-btn-ghost fh-btn-sm fh-late-claim"
                    data-act="claim-late"
                    data-iid="${C(e.reference_id)}"
                    data-pid="${C(e.person_id)}"
                    title="Claim this late \u2014 a parent has to approve it">Claim</button>`}function me(e,t="28px"){return e!=null&&e.icon?`<span class="fh-store-item-icon">${pe(e.icon,null,t)}</span>`:""}function U(e,t){let a=Math.min(Math.max(0,e),t.length-1);return t[a]}function ge(e,t,a){if(e&&(e.rank_gain_eff!=null||e.rank_drop_eff!=null))return{dropThr:e.rank_drop_eff??0,gainThr:e.rank_gain_eff??0};let o=(s,i,n,r)=>{if(Array.isArray(s)&&s.length){let d=Math.min(Math.max(0,a|0),s.length-1),p=s[d];if(p!=null)return p}return i??n??r};return{dropThr:o(e==null?void 0:e.rank_drop_thresholds,e==null?void 0:e.rank_drop_threshold,t==null?void 0:t.rank_drop_threshold,50),gainThr:o(e==null?void 0:e.rank_gain_thresholds,e==null?void 0:e.rank_gain_threshold,t==null?void 0:t.rank_gain_threshold,75)}}function ja(e=0){let t=new Date,a=t.getDay(),o=(e+1)%7,s=(a-o+7)%7,i=new Date(t);return i.setHours(0,0,0,0),i.setDate(i.getDate()-s),i}function be(e,t,a=0){let o=ja(a);return(t||[]).filter(s=>s.person_id===e&&(s.points_delta||0)>0&&new Date(s.timestamp)>=o).reduce((s,i)=>s+(i.points_delta||0),0)}function ue(e,t,a=0){let o=ja(a);return(t||[]).filter(s=>s.person_id!==e||s.type!=="task_skipped"||(s.points_delta||0)>=0?!1:(s.due_date?new Date(`${s.due_date}T00:00:00`):new Date(s.timestamp))>=o).reduce((s,i)=>s+Math.abs(i.points_delta||0),0)}function ve(e){return e!=null&&e.penalties_paused?0:((e==null?void 0:e.tasks_due_today_list)||[]).filter(t=>t.status==="pending"&&t.chore_type!=="reminder"&&t.penalty_enabled&&(t.penalty_points||0)>0).reduce((t,a)=>{let o=a.daily_penalty_after_days||0;return(a.recurrence_type||"daily")==="daily"&&o&&(a.skip_streak||0)+1<o?t:t+(a.penalty_points||0)},0)}function xe(e,t,a,o,s,i,n){var w;if(e>=999)return"";let r=U(e,s),d=e>=s.length-1,p=e<=0,c=(n==null?void 0:n.assigned_ppw)||((w=n==null?void 0:n.rank_curve)==null?void 0:w.cap)||0,b=Math.max(c||Math.round(o*1.2),o,t,1),g=z=>Math.min(100,Math.max(0,Math.round(z/b*100))),u=g(t),v=g(a),_=g(o),f,$;!d&&t>=o?(f=i,$=`${t} pts \xB7 rank up ready`):!p&&t<a?(f="#E07A4C",$=`${t} pts \xB7 ${Math.max(0,a-t)} to hold`):d?(f="#E0B84C",$=`${t} pts \xB7 max rank`):(f="#E0B84C",$=`${t} pts \xB7 ${Math.max(0,o-t)} to rank up`);let S=(z,E,F,D,R)=>`<span class="fh-rank-bar-mark fh-rank-bar-mark--${z}" style="left:${E}%" title="${R}"></span><span class="fh-rank-bar-mark-val fh-rank-bar-mark-val--${z}" style="left:${E}%">${D}${F}</span>`,x=p?"":S("drop",v,a,"\u25BE",`Drop below ${a}`),h=d?"":S("gain",_,o,"\u25B4",`Rank up at ${o}`);return`
        <div class="fh-rank-bar-row">
            <span class="fh-rank-bar-label" style="color:${i}">${m(r.name)}</span>
            <span class="fh-rank-bar-track">
                <span class="fh-rank-bar-fill" style="width:${u}%;background:${f}"></span>
                ${x}
                ${h}
            </span>
            <span class="fh-rank-bar-status">${m($)}</span>
        </div>`}function xo(e,t){let a=e==null?void 0:e.person_id;if(!a)return[];let o=(t==null?void 0:t.people)||[],s=r=>{var d;return((d=o.find(p=>p.person_id===r))==null?void 0:d.name)||"\u2014"},i=r=>{let d=o.find(p=>p.person_id===r);return d&&d.active!==!1},n=[];for(let r of(t==null?void 0:t.active_chores)||[]){let d=r.rotation_pool||[];if(!d.includes(a))continue;let p=d.filter(i);if(!p.length)continue;let c=r.assigned_to&&r.assigned_to[0]||p[0],b=p.indexOf(c),g=p[((b+1)%p.length+p.length)%p.length],u=r.rotation_cadence||"",v="";if(u==="weekly"){let _=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],$=((r.rotation_switch_weekday??0)+1)%7,S=new Date;S.setHours(0,0,0,0);let x=($-S.getDay()+7)%7;x===0&&(x=7);let h=new Date(S);h.setDate(h.getDate()+x),v=`${_[h.getDay()]} ${h.getMonth()+1}/${h.getDate()}`}else u==="per_instance"?v="next time":u==="daily"&&(v="tomorrow");n.push({chore:r.name,mine:c===a,youNext:g===a&&c!==a,currentName:s(c),nextName:s(g),switchWhen:v})}return n}function ye(e,t,a){let o=xo(e,t),s=o.filter(d=>d.mine),i=o.filter(d=>d.youNext);if(!s.length&&!i.length)return"";let n=a||"var(--fh-accent)",r=(d,p,c)=>p.length?`
        <div class="fh-rot-group">
          <div class="fh-rot-group-hdr" style="color:${n}">${m(d)}</div>
          ${p.map(b=>`
            <div class="fh-rot-line">
              <span class="fh-rot-line-chore">${m(b.chore)}</span>
              ${c&&b.switchWhen?`<span class="fh-rot-line-when">${m(b.switchWhen)}</span>`:""}
            </div>`).join("")}
        </div>`:"";return r("Current",s,!1)+r("Up Next",i,!0)}function we(e,t){if(!e)return"";let a=e.completion_milestone||0,o=e.completion_streak||0;if(a<=0||o<=0)return"";let s=e.completion_threshold_pct||80;return`
        <div class="fh-success-streak" style="--ss-tone:${t||"#F8D38A"}">
            <span class="fh-success-streak-icon">\u{1F525}</span>
            <span class="fh-success-streak-val">${o}d streak</span>
            <span class="fh-success-streak-sep">\xB7</span>
            <span class="fh-success-streak-target">${s}% target</span>
        </div>`}function ke(e){if(!e)return"";let t=e.weekly_completion_milestone||0,a=e.weekly_completion_streak||0;if(t<=0||a<=0)return"";let o=e.weekly_completion_threshold_pct||80;return`
        <div class="fh-success-streak fh-success-streak--weekly" style="--ss-tone:#5B9BD5">
            <span class="fh-success-streak-icon">\u{1F4C5}</span>
            <span class="fh-success-streak-val">${a}wk streak</span>
            <span class="fh-success-streak-sep">\xB7</span>
            <span class="fh-success-streak-target">${o}% weekly target</span>
        </div>`}function _e(e,t,a,o=8){let s=new Map((t.active_chores||[]).map(p=>[p.chore_id,p])),i=new Map;for(let p of[...e.tasks_due_today_list||[],...e.tasks_overdue_list||[],...e.tasks_pending_approval_list||[]])p.chore_id&&p.name&&!i.has(p.chore_id)&&i.set(p.chore_id,{name:p.name,streak:p.streak||0});let r=((t.people||[]).find(p=>p.person_id===a.person_id)||{}).streaks||{},d=new Map;for(let[p,c]of Object.entries(r))d.set(p,c.count||0);for(let[p,c]of i.entries()){let b=d.get(p)||0;c.streak>b&&d.set(p,c.streak)}return[...d.entries()].map(([p,c])=>{let b=s.get(p),g=i.get(p),u=(b==null?void 0:b.name)||(g==null?void 0:g.name)||"(retired)";return{chore_id:p,name:u,streak:c,milestone:(b==null?void 0:b.streak_milestone)||0,bonus:(b==null?void 0:b.streak_bonus_points)||0,chore:b||{}}}).filter(p=>p.streak>=1).sort((p,c)=>c.streak-p.streak).slice(0,o)}function $e(e,t,a=10){let o=t>0?Math.min(t,a):7;if(t<=0)return{goalSegs:o,filledN:Math.min(e,o),countLbl:`${e}`};let s=e%t,i=e>0&&s===0?o:s,n=t-(s||t);return{goalSegs:o,filledN:i,countLbl:`${e} \xB7 next ${n}`}}function Se(e){let t=(e==null?void 0:e.streak_freezes_available)||0;return t<=0?"":`
        <div class="fh-freeze-chip" title="Streak freeze tokens \u2014 auto-spent to protect your streak on a rough day">
            <span class="fh-freeze-chip-icon">\u{1F9CA}</span>
            <span class="fh-freeze-chip-label">${t===1?"1 streak freeze":`${t} streak freezes`}</span>
        </div>`}function Ga(e,t,a,o){if(!a||a<=0)return"";let s=Math.min(100,Math.round(t/a*100)),i=t>=a,n=`${i?"\u2713 ":""}${t} / ${a} pts ${o}`;return`
        <div class="fh-daily-progress fh-progress--${e} ${i?"fh-daily-progress--complete":""}">
            <div class="fh-daily-progress-bar">
                <div class="fh-daily-progress-fill" style="width:${s}%"></div>
            </div>
            <span class="fh-daily-progress-label">${n}</span>
        </div>`}function Ee(e){return Ga("daily",(e==null?void 0:e.daily_earned)||0,(e==null?void 0:e.daily_possible)||0,"today")}function Ce(e){return Ga("weekly",(e==null?void 0:e.week_earned)||0,(e==null?void 0:e.week_possible)||0,"this week")}function Ne(e,t){let a=e.filter(d=>d._over),o=e.filter(d=>!d._over),s=[];a.length&&s.push({label:"Overdue",tasks:a,isOverdue:!0});let i=t&&t.length?t:[...new Set(o.map(d=>d.category_label||""))],n=new Set(i);for(let d of i){let p=o.filter(c=>(c.category_label||"")===d);p.length&&s.push({label:d||"Other",tasks:p,isOverdue:!1})}let r=o.filter(d=>!n.has(d.category_label||""));return r.length&&s.push({label:"Other",tasks:r,isOverdue:!1}),s}function yo(e){if(!e)return"";let t=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],a=new Date;a.setHours(0,0,0,0);let o=e.recurrence_type,s=Number(e.days_until_reset);if(o&&o!=="one_time"&&o!=="daily"&&Number.isFinite(s)&&s>0){let r=new Date(a);return r.setDate(r.getDate()+s),s===1?"Tomorrow":s<=6?t[r.getDay()]:s===7?`Next ${t[r.getDay()].slice(0,3)}`:`${r.getMonth()+1}/${r.getDate()}`}if(!e.due_date)return"";let i=new Date(e.due_date+"T00:00:00");if(isNaN(i.getTime()))return"";let n=Math.round((i-a)/864e5);return n<0?"":n===0?"Today":n===1?"Tomorrow":n<=6?t[i.getDay()]:`${i.getMonth()+1}/${i.getDate()}`}function Y(e,t,a,o,s={}){let i=s.index,n=!!(o&&o._pendingSubmit&&o._pendingSubmit.has(e.task_id))||e.status==="pending_approval",r=!!e._over||!!e._overdue,d=e.chore_type==="reminder",p=e.streak||0,c=e.points||0,b=t.leadFormat&&!d?t.leadFormat(e,i):null,g=b!=null&&b!==""?`<div class="fh-row-lead">${m(String(b))}</div>`:"",u=t.kickerFormat&&!d?t.kickerFormat(e,i):null,v=u!=null&&u!==""?`<div class="fh-row-kicker">${m(String(u))}</div>`:"",_=t.iconColor?t.iconColor(e,r):void 0,f=`<div class="fh-row-icon">${pe(e.icon,_)}</div>`,$=e.description?`<div class="fh-row-desc">${m(e.description)}</div>`:"",S=!d&&e.penalty_enabled&&e.penalty_points>0,x=S&&!c?`<div class="fh-row-penalty">\u2212${e.penalty_points}pts if skipped</div>`:"",h=[];if(p>=2&&!d){let k=t.streakIcon||"\u{1F525}";h.push(`<span class="fh-row-chip fh-row-chip--streak">${k} ${p}</span>`)}if(r){let k=t.statusFormat&&t.statusFormat.breach?t.statusFormat.breach(e):`BREACH \xB7 ${e.days_overdue||0}D`;h.push(`<span class="fh-row-chip fh-row-chip--breach">${m(k)}</span>`)}else if(!d&&e.days_until_reset===1){let k=t.statusFormat&&t.statusFormat.resetSoon?t.statusFormat.resetSoon(e):"RESETS 1D";h.push(`<span class="fh-row-chip fh-row-chip--reset">${m(k)}</span>`)}if(!d&&e.daily_penalty_firing){let k=t.statusFormat&&t.statusFormat.firing?t.statusFormat.firing(e):`\u2212${e.penalty_points||0}pts/day`;h.push(`<span class="fh-row-chip fh-row-chip--firing">${m(k)}</span>`)}if(!d&&e.expires_after_days&&e.due_date){let k=new Date(e.due_date);k.setDate(k.getDate()+e.expires_after_days);let M=new Date;M.setHours(0,0,0,0),k.setHours(0,0,0,0);let A=Math.round((k-M)/864e5);if(A<=2){let B=t.statusFormat&&t.statusFormat.expiry?t.statusFormat.expiry(A):A<=0?"Expires today":`Expires in ${A}d`;h.push(`<span class="fh-row-chip fh-row-chip--expiry">${m(B)}</span>`)}}let w=`<div class="fh-row-chips">${h.join("")}</div>`,z="fh-row-pts",E="";d?E="":c&&S?(z+=" fh-row-pts--dual",E=`<span class="fh-row-pts-pos">+${c}</span><span class="fh-row-pts-sep">/</span><span class="fh-row-pts-neg">\u2212${e.penalty_points}</span>`):c?E=`+${c}`:S&&(E=`<span class="fh-row-pts-neg">\u2212${e.penalty_points}</span>`);let F=!d&&!n?yo(e):"",D=F?`<div class="fh-row-due">${m(F)}</div>`:"",R=`<div class="fh-row-pts-col"><div class="${z}">${E}</div>${D}</div>`,T=s.btnData?Object.entries(s.btnData).map(([k,M])=>` data-${k}="${C(String(M??""))}"`).join(""):"",P;if(n){let k=t.btnPendingLabel||"Pending<br>Approval";P=`<div class="fh-row-btn fh-row-btn--pending" aria-disabled="true">${t.btnPendingIcon?`<span class="fh-row-btn-icon">${t.btnPendingIcon}</span>`:""}<span class="fh-row-btn-label">${k}</span></div>`}else if(d){let k=t.reminderBtnLabel||"Dismiss";P=`<button class="fh-row-btn fh-row-btn--reminder"
                           data-act="complete" data-tid="${C(e.task_id)}" data-pid="${C(a.person_id)}"${T}>
                       <span class="fh-row-btn-label">${k}</span>
                   </button>`}else{let k=t.btnLabel||"Complete",M=t.btnIcon?`<span class="fh-row-btn-icon">${t.btnIcon}</span>`:"";P=`<button class="fh-row-btn"
                           data-act="complete" data-tid="${C(e.task_id)}" data-pid="${C(a.person_id)}"${T}>
                       ${M}<span class="fh-row-btn-label">${k}</span>
                   </button>`}let l=[`fh-row--${t.themeKey}`,r&&"overdue",d&&"reminder",n&&"submitted",s.rowClass||""].filter(Boolean).join(" "),y=s.rowStyle?` style="${s.rowStyle}"`:"";return`
        <div class="fh-row ${l}"${y}>
            ${g}
            ${f}
            <div class="fh-row-body">
                ${v}
                <div class="fh-row-name">${m(e.name)}</div>
                ${$}
                ${x}
            </div>
            ${w}
            ${R}
            ${P}
        </div>`}function Wa(e){return`
        <div class="fh-row-add-reminder-wrap">
            <button class="fh-row-add-reminder"
                    data-act="open-add-reminder" data-pid="${C(e.person_id)}">
                + Add reminder
            </button>
        </div>`}function ze(e){let t=e==null?void 0:e.goal;if(!t)return"";let a=Math.max(0,Math.min(100,t.progress_pct|0)),o=t.points_cost|0,s=Math.max(0,o-(t.remaining|0));return`
        <div class="fh-goal-banner">
            <div class="fh-goal-banner-head">
                <span class="fh-goal-banner-lbl">Saving for</span>
                <span class="fh-goal-banner-name">${m(t.name)}</span>
                <span class="fh-goal-banner-amt">${s}/${o} pts</span>
            </div>
            <div class="fh-goal-bar"><div class="fh-goal-bar-fill" style="width:${a}%"></div></div>
        </div>`}function He(e){let t=e==null?void 0:e.goal;if(!t)return"";let a=Math.max(0,Math.min(100,t.progress_pct|0)),o=t.remaining|0,s=o>0?`${o} pts to go`:"Goal reached!";return`
        <div class="fh-goal-rail">
            <div class="fh-goal-rail-lbl">SAVING FOR</div>
            <div class="fh-goal-rail-name">${m(t.name)}</div>
            <div class="fh-goal-bar"><div class="fh-goal-bar-fill" style="width:${a}%"></div></div>
            <div class="fh-goal-rail-rem">${m(s)}</div>
        </div>`}function Ae(e){let t=(e==null?void 0:e.max_per_period)||0;if(!t)return"";let a=(e==null?void 0:e.period)||"week",s=`${t} per ${a==="day"?"day":a==="week"?"week":"month"}`,i=e==null?void 0:e.next_available;if(!i)return`<span class="fh-store-limit">${m(s)}</span>`;let n=new Date(i+"T00:00:00"),r=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][n.getDay()],d=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n.getMonth()],p=`${r} ${d} ${n.getDate()}`;return`<span class="fh-store-limit fh-store-limit--blocked">${m(s)} \xB7 Available ${m(p)}</span>`}function Me(e,t,a){let o=(t==null?void 0:t.goal_item_id)&&t.goal_item_id===e.item_id;return`
        <button class="fh-goal-tog ${o?"is-goal":""}"
                data-act="toggle-goal"
                data-pid="${C(a)}"
                data-iid="${C(e.item_id)}"
                title="${o?"Clear goal":"Save toward this"}">
            ${o?"\u2605":"\u2606"}
        </button>`}function Be(e,t){if(!(e!=null&&e.is_group_reward))return"";let a=e.contributors||[];if(!a.length)return"";let o=a.reduce((r,d)=>r+(d.contributed_pts||0),0),s=a.reduce((r,d)=>r+(d.target_pts||0),0),i=s>0?Math.round(o/s*100):0,n=a.map(r=>{let d=r.person_id===t,p=r.contributed_pts>=(r.target_pts||1),c=r.person_color||"#7F77DD",b=(r.person_name||"?").charAt(0).toUpperCase();return`
            <span class="fh-gcp ${d?"fh-gcp--me":""} ${p?"fh-gcp--done":""}"
                  title="${C(r.person_name||"?")} \u2014 ${r.contributed_pts}/${r.target_pts} pts${d?" (you)":""}">
                <span class="fh-gcp-av" style="background:${c}">${m(b)}</span>
                <span class="fh-gcp-pts">${r.contributed_pts}/${r.target_pts}</span>
            </span>`}).join("");return`
        <div class="fh-group-reward-info">
            <div class="fh-group-reward-line">
                <span class="fh-group-reward-tag">\u{1F91D} GROUP \xB7 ${o}/${s} pts \xB7 ${i}%</span>
                <span class="fh-group-reward-pills">${n}</span>
            </div>
        </div>`}function Fe(e,t,a){if(!(e!=null&&e.is_group_reward))return"";let o=(e.contributors||[]).find(n=>n.person_id===t);if(!o)return"";let s=Math.max(0,(o.target_pts||0)-(o.contributed_pts||0));if(s<=0)return'<span class="fh-group-chip-done">\u2713 Your share complete</span>';let i=a>=1;return`
        <button class="fh-group-chip-btn ${i?"":"fh-group-chip-btn--disabled"}"
                data-act="open-chip-in"
                data-iid="${C(e.item_id)}"
                data-pid="${C(t)}"
                data-remaining="${s}"
                data-balance="${a}"
                ${i?"":"disabled"}>
            \u{1F91D} Chip In (${s} left)
        </button>`}function Re(e){if(!(e!=null&&e.locked))return"";let t=e.lock_reason||"Locked";return`<span class="fh-reward-lock" title="${C(t)}"
                  style="display:inline-flex;align-items:center;gap:4px;text-align:center;
                         font-size:var(--fh-text-xs);font-weight:700;line-height:1.25;
                         color:var(--fh-overdue);max-width:140px">\u{1F512} ${m(t)}</span>`}function De(e,t,a={}){if(!e||!e.length)return"";let o=!!a.bare,s=e.map(n=>{let r=n.claimable_subtype==="multi_claim",d=r?Math.max(0,n.slots_remaining??0):1;if(r&&d<=0)return"";let p=r?`${d} spot${d===1?"":"s"} left`:"first come";return`
          <div class="fh-bonus-row"
               style="padding:8px;border:1px solid var(--fh-border);border-radius:8px;
                      background:var(--fh-surface);margin-bottom:6px">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px">
              <span style="font-size:var(--fh-text-sm);font-weight:700;color:var(--fh-text);
                           overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m(n.name)}</span>
              <span style="font-size:var(--fh-text-sm);font-weight:800;color:var(--fh-success);white-space:nowrap">+${n.points||0}</span>
            </div>
            <div style="font-size:var(--fh-text-xs);color:var(--fh-text-sec);margin:2px 0 6px">${m(p)}</div>
            <button class="fh-bonus-claim"
                    data-act="ok-claim"
                    data-tid="${C(n.task_id)}"
                    data-pid="${C(t)}"
                    style="width:100%;border:none;border-radius:8px;padding:8px;min-height:44px;
                           font-size:var(--fh-text-sm);font-weight:800;color:#fff;
                           background:var(--fh-success);cursor:pointer">CLAIM</button>
          </div>`}).join("");if(!s.trim())return"";if(o)return s;let i=a.title||"\u2B50 Bonus chores \u2014 up for grabs";return`
      <div class="fh-bonus-board" style="margin-top:14px">
        <div style="font-size:var(--fh-text-sm);font-weight:800;letter-spacing:.04em;
                    color:var(--fh-text-sec);margin-bottom:8px">${m(i)}</div>
        ${s}
      </div>`}function Ie(e,t,a){let o=(e||[]).filter(n=>n.status!=="canceled");if(!o.length)return"";let s={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"};return o.map(n=>{let r=n.status==="lapsed",d=n.status==="cancel_pending",p=s[n.period]||n.period,c=n.points_cost+(n.accumulated_debt||0),b=Math.min(100,Math.round(t/Math.max(c,1)*100)),g=r?"#E85A5A":d?"#E0B84C":"currentColor",u;if(r)u=`Lapsed \xB7 owes ${n.accumulated_debt}pts`;else if(d)u="Cancellation pending approval";else{let f=n.days_until_renewal,$=f<=0?"Renews today":f===1?"Renews tomorrow":`Renews in ${f}d`,S=n.points_cost+(n.accumulated_debt||0);u=t>=S?`\u2713 Ready \xB7 ${$}`:`\u26A0 Need ${S-t}pts \xB7 ${$}`}let v=n.item_icon?`<span class="fh-sub-mini-icon">${pe(n.item_icon,null,"18px")}</span>`:"",_=d?"":`
            <button class="fh-sub-cancel-btn"
                    data-act="request-cancel-sub"
                    data-subid="${C(n.subscription_id)}"
                    data-pid="${C(a)}"
                    data-name="${C(n.item_name)}">Cancel</button>`;return`
            <div class="fh-sub-mini-row">
                <div class="fh-sub-mini-head">
                    ${v}
                    <span class="fh-sub-mini-name">${m(n.item_name)}</span>
                    <span class="fh-sub-mini-price">${n.points_cost}/${p}</span>
                </div>
                <div class="fh-sub-mini-bar-wrap">
                    <div class="fh-sub-mini-bar" style="width:${b}%;background:${g}"></div>
                </div>
                <div class="fh-sub-mini-status">${m(u)}</div>
                ${_}
            </div>`}).join("")}function Te(e,t,a,o){let s={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"},i=new Set(["points_awarded","subscription_started","subscription_renewed"]),n={points_awarded:"Purchased",subscription_started:"Subscribed",subscription_renewed:"Sub renewal"},r=(e||[]).filter(b=>b.status!=="canceled"),d="";r.length&&(d=`<div class="fh-store-rail-section"><div class="fh-store-rail-hdr">YOUR SUBSCRIPTIONS</div>${r.map(g=>{let u=g.status==="lapsed",v=g.status==="cancel_pending",_=s[g.period]||g.period,f=g.points_cost+(g.accumulated_debt||0),$=Math.min(100,Math.round(t/Math.max(f,1)*100)),S=u?"#E85A5A":v?"#E0B84C":"currentColor",x;if(u)x=`Lapsed \xB7 owes ${g.accumulated_debt}pts`;else if(v)x="Cancellation pending approval";else{let z=g.days_until_renewal,E=z<=0?"Renews today":z===1?"Renews tomorrow":`Renews in ${z}d`,F=g.points_cost+(g.accumulated_debt||0);x=t>=F?`\u2713 Ready \xB7 ${E}`:`\u26A0 Need ${F-t}pts \xB7 ${E}`}let h=g.item_icon?`<span class="fh-sub-mini-icon">${pe(g.item_icon,null,"18px")}</span>`:"",w=v?"":`
                <button class="fh-sub-cancel-btn"
                        data-act="request-cancel-sub"
                        data-subid="${C(g.subscription_id)}"
                        data-pid="${C(o)}"
                        data-name="${C(g.item_name)}">Cancel</button>`;return`
                <div class="fh-store-sub-row">
                    <div class="fh-sub-mini-head">
                        ${h}
                        <span class="fh-sub-mini-name">${m(g.item_name)}</span>
                        <span class="fh-sub-mini-price">${g.points_cost}/${_}</span>
                    </div>
                    <div class="fh-sub-mini-bar-wrap">
                        <div class="fh-sub-mini-bar" style="width:${$}%;background:${S}"></div>
                    </div>
                    <div class="fh-sub-mini-status">${m(x)}</div>
                    ${w}
                </div>`}).join("")}</div>`);let p=(a||[]).filter(b=>b.person_id!==o||!i.has(b.type)?!1:b.type==="points_awarded"?/^Redeemed "/.test(b.note||""):!0).slice(0,10),c="";return p.length&&(c=`<div class="fh-store-rail-section"><div class="fh-store-rail-hdr">RECENT PURCHASES</div>${p.map(g=>{let u=n[g.type]||g.type,v=g.timestamp?ne(g.timestamp):"",_=g.type==="points_awarded"?(g.note||"").replace(/^Redeemed "(.+)"$/,"$1")||"\u2014":g.chore_name||g.note||"\u2014",f=g.points_delta?`\u2212${Math.abs(g.points_delta)}pts`:"";return`
                <div class="fh-store-purchase-row">
                    <div class="fh-store-purchase-name">${m(_)}</div>
                    <div class="fh-store-purchase-meta">
                        <span class="fh-store-purchase-type">${m(u)}</span>
                        ${f?`<span class="fh-store-purchase-pts">${f}</span>`:""}
                        <span class="fh-store-purchase-when">${m(v)}</span>
                    </div>
                </div>`}).join("")}</div>`),d+c}function Pe(e,t){return!e||!e.length?"":`<div class="fh-group-proposals">${e.map(o=>`
        <div class="fh-group-proposal-card">
            <div class="fh-group-proposal-from">
                \u{1F91D} <strong>${m(o.proposer_name)}</strong> wants to save for
                <strong>${m(o.item_name)}</strong> with you
            </div>
            <div class="fh-group-proposal-share">Your share: ${o.my_share_pct}%</div>
            <div class="fh-group-proposal-btns">
                <button class="fh-group-proposal-accept"
                        data-act="accept-group-proposal"
                        data-propid="${C(o.proposal_id)}"
                        data-pid="${C(t)}">
                    Accept
                </button>
                <button class="fh-group-proposal-decline"
                        data-act="decline-group-proposal"
                        data-propid="${C(o.proposal_id)}"
                        data-pid="${C(t)}">
                    Decline
                </button>
            </div>
        </div>`).join("")}</div>`}var et=N(()=>{ut();Q()});function wo({attr:e,naAttr:t,person:a,balance:o,weekly:s,lost:i,atRisk:n,openCount:r,pendingCount:d,rankIdx:p,dropThr:c,gainThr:b,color:g,card:u}){return`
        ${_o(o,s,i,n,r,d)}
        ${$o(p,s,c,b,g,a,e)}
        ${So(e,t,a,g)}
        ${(()=>{let v=De(u._attrs("sensor.family_hub_claimable_tasks").tasks||[],a.person_id,{bare:!0});return v?je("BONUS",v):""})()}
        ${(()=>{let v=ye(a,t,g);return v?je("ROTATION",v):""})()}
        ${ko(e,o,a.person_id)}
        ${Eo(a,t,g)}`}function je(e,t){return`
        <div class="fh-classic-rpanel">
            <div class="fh-classic-rpanel-hdr">${e}</div>
            <div class="fh-classic-rpanel-body">${t}</div>
        </div>`}function ko(e,t,a){let o=Ie(e.subscriptions,t,a);return o?je("SUBSCRIPTIONS",o):""}function _o(e,t,a,o,s,i){let n=(d,p,c,b,g="")=>`
        <div class="fh-classic-rkpi">
            <div class="fh-classic-rkpi-lbl">${d}</div>
            <div class="fh-classic-rkpi-val-row">
                <span class="fh-classic-rkpi-val">${m(String(p))}</span>
                ${c?`<span class="fh-classic-rkpi-unit">${c}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,r=`
        <div class="fh-classic-rkpi-row">
            ${n("BALANCE",O(e),"pts")}
            ${n("WEEK",`+${t}`,"pts",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("OPEN",s,"",o>0?`\u2212${o} at risk`:null,"fh-rkpi-sub--loss")}
            ${n("PENDING",i,"")}
        </div>`;return je("OVERVIEW",r)}function $o(e,t,a,o,s,i,n){let r=xe(e,t,a,o,Rt,s,i),d=we(i,s),p=ke(i),c=Se(n);return r?je("RANK",r+d+p+c):je("RANK",`<div class="fh-classic-rmax">${m(U(e,Rt).name)} \xB7 max</div>${d}${p}${c}`)}function So(e,t,a,o){let s=_e(e,t,a,8);if(!s.length)return je("STREAKS",'<div class="fh-classic-rempty">No active streaks yet</div>');let i=s.map(n=>{let{goalSegs:r,filledN:d,countLbl:p}=$e(n.streak,n.milestone,10),c=Array.from({length:r},(g,u)=>`<span class="fh-classic-rseg${u<d?" filled":""}" style="${u<d?`background:${o}`:""}"></span>`).join(""),b=n.milestone>0&&n.bonus>0?`<span class="fh-classic-rbonus">\u2605+${n.bonus}</span>`:"";return`
            <div class="fh-classic-rstreak">
                <div class="fh-classic-rstreak-head">
                    <span class="fh-classic-rstreak-name">${m(n.name)}</span>
                    ${b}
                </div>
                <div class="fh-classic-rstreak-bar">
                    <span class="fh-classic-rsegs">${c}</span>
                    <span class="fh-classic-rstreak-num">${p}</span>
                </div>
            </div>`}).join("");return je("STREAKS",i)}function Eo(e,t,a){let o=(t.history_log||[]).filter(i=>i.person_id===e.person_id&&(i.points_delta||0)>0).slice(0,4);if(!o.length)return je("RECENT WINS",'<div class="fh-classic-rempty">No wins logged yet</div>');let s=o.map(i=>{let n=i.timestamp?ne(i.timestamp):"";return`
            <div class="fh-classic-rwin">
                <div class="fh-classic-rwin-when">${m(n)}</div>
                <div class="fh-classic-rwin-row">
                    <span class="fh-classic-rwin-name">${m(i.chore_name||i.note||"\u2014")}</span>
                    <span class="fh-classic-rwin-pts" style="color:${a}">+${i.points_delta}</span>
                </div>
            </div>`}).join("");return je("RECENT WINS",s)}function Co(e,t,a,o){let s=e.tasks_due_today_list||[],i=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],r=(E,F)=>{let D=new Map;for(let R of E){let T=R.chore_id;(!D.has(T)||F(R,D.get(T)))&&D.set(T,R)}return[...D.values()]},d=r(i,(E,F)=>(E.days_overdue||0)>(F.days_overdue||0)),p=r(s,()=>!1),c=E=>E.chore_type==="reminder",b=p.filter(E=>c(E)),g=p.filter(E=>!c(E)),v=o._attrs("sensor.family_hub_needs_attention").category_labels||[],_=new Map(v.map((E,F)=>[E,F])),f=new Map;for(let E of g){let F=E.category_label||"Today";f.has(F)||f.set(F,[]),f.get(F).push(E)}let $=[...f.keys()].sort((E,F)=>{let D=E==="Today",R=F==="Today";if(D&&!R)return 1;if(!D&&R)return-1;let T=_.has(E)?_.get(E):1/0,P=_.has(F)?_.get(F):1/0;return T!==P?T-P:E.localeCompare(F)}),S={themeKey:"classic",btnLabel:"\u2713",btnPendingLabel:"Pending Approval",reminderBtnLabel:"Done",streakIcon:"\u{1F525}",statusFormat:{breach:E=>`${E.days_overdue}d late`,resetSoon:E=>{var R;let F=E.recurrence_type,D=E.days_until_reset;return D===0?"Resets today":D===1?"Resets tomorrow":F==="weekly"&&((R=E.recurrence_weekdays)!=null&&R.length)?`Resets ${E.recurrence_weekdays.map(T=>Bt[T]).join("/")}`:`Resets in ${D}d`},firing:E=>`-${E.penalty_points}pts/day`,expiry:E=>E<=0?"Expires today":`Expires in ${E}d`},iconColor:()=>t},x=(E,F)=>{let D=F?{...E,_over:!0}:E;return Y(D,S,a,o)},h=$.map(E=>`
        <div class="fh-row-section-hdr">${m(E)}</div>
        ${(f.get(E)||[]).map(F=>x(F,!1)).join("")}`).join(""),w=b.length?`
        <div class="fh-row-section-hdr">Reminders</div>
        ${b.map(E=>x(E,!1)).join("")}`:"",z=!g.length&&!d.length&&!n.length&&!b.length;return`
        ${Ee(e)}
        ${Ce(e)}
        ${Wa(a)}
        <div class="fh-row-list" style="--row-color:${t}">
            ${d.length?d.map(E=>x(E,!0)).join(""):""}
            ${h}
            ${w}
            ${n.length?`
                <div class="fh-row-section-hdr">Awaiting approval</div>
                ${n.map(E=>Y(E,S,a,o)).join("")}`:""}
        </div>
        ${z?'<div class="fh-empty">Nothing due \u2014 nice work!</div>':""}`}function zo(e,t,a,o,s){let i=e.store_items||[];if(!i.length)return'<div class="fh-empty">No rewards in the store yet.</div>';let n=s._attrs("sensor.family_hub_needs_attention"),d=(n.redemption_queue||[]).filter(g=>g.person_id===a.person_id),p=new Set(d.map(g=>g.item_id).filter(Boolean)),c=new Set(d.filter(g=>!g.item_id).map(g=>g.item_name)),b=new Set((e.subscriptions||[]).map(g=>g.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Pe(e.group_proposals,a.person_id)}
        ${ze(e)}
        <div class="fh-store-grid">
            ${i.map(g=>{let u=!!g.is_group_reward,v=g.item_type==="subscription",_=v&&b.has(g.item_id),f=o>=g.points_cost,$=p.has(g.item_id)||c.has(g.name),S=!!g.next_available,x={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[g.subscription_period]||"mo";return`
                <div class="fh-store-item">
                    <div class="fh-store-item-head">
                        ${me(g)}
                        <div class="fh-store-name">${m(g.name)}</div>
                        ${Me(g,e,a.person_id)}
                    </div>
                    ${g.description?`<div class="fh-store-desc">${m(g.description)}</div>`:""}
                    ${Ae(g)}
                    ${Be(g,a.person_id)}
                    ${u?Fe(g,a.person_id,o):g.locked&&!$&&!(v&&_)?Re(g):v?_?'<span class="fh-badge fh-badge-subscribed">Subscribed \u2713</span>':$?'<span class="fh-badge fh-badge-requested" style="text-align:center">Requested \u2713</span>':`<button class="fh-btn fh-btn-sm ${f?"fh-btn-primary":"fh-btn-ghost"}"
                                       style="${f?`background:${t}`:""}"
                                       data-act="redeem"
                                       data-iid="${C(g.item_id)}"
                                       data-pid="${C(a.person_id)}"
                                       ${f?"":"disabled"}>
                                   ${f?`Subscribe \xB7 ${g.points_cost}pts/${x}`:"Need more pts"}
                               </button>`:`<div class="fh-store-price" style="color:${t}">${O(g.points_cost)}pts</div>
                           ${$?'<span class="fh-badge fh-badge-requested" style="text-align:center">Requested \u2713</span>':S?'<button class="fh-btn fh-btn-sm fh-btn-ghost" disabled style="opacity:.5;cursor:not-allowed">Not available</button>':`<button class="fh-btn fh-btn-sm ${f?"fh-btn-primary":"fh-btn-ghost"}"
                                          style="${f?`background:${t}`:""}"
                                          data-act="redeem" data-iid="${g.item_id}" data-pid="${a.person_id}"
                                          ${f?"":"disabled"}>
                                      ${f?"Request":"Need more pts"}
                                  </button>`}`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${Te(e.subscriptions,o,n.history_log,a.person_id)}
        </div>
        </div>`}function Ao(e,t){let o=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(n=>n.person_id===e.person_id);return o.length?`<div class="fh-hist-scroll">${ce(o).map(n=>n.isGroup?Bo(n,t):Mo(n.entry)).join("")}</div>`:'<div class="fh-empty">No history yet.</div>'}function Mo(e){let t=ie[e.type]||{label:e.type,color:"var(--fh-text-sec)"},a=e.points_delta?`<span style="color:${e.points_delta>0?"var(--fh-success)":"var(--fh-overdue)"}">
               ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"";return`
        <div class="fh-hist-row" style="--hist-color:${t.color}">
            <div class="fh-hist-info">
                <div class="fh-hist-label">${m(t.label)}</div>
                <div class="fh-hist-name">${m(e.chore_name||e.note||"")}</div>
                <div class="fh-hist-meta">${ne(e.timestamp)} ${a}</div>
            </div>
        </div>`}function Bo(e,t){let a=t._expandedSkippedDates.has(e.key),o=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty",s=e.items.map(i=>{let n=i.points_delta?`<span style="color:var(--fh-overdue);font-weight:700">${i.points_delta}pts</span>`:"";return`
            <div class="fh-hist-subrow">
                <div class="fh-hist-info" style="flex:1;min-width:0">
                    <div class="fh-hist-name">${m(i.chore_name||"")}</div>
                    <div class="fh-hist-meta">${n}</div>
                </div>
                ${fe(i)}
            </div>`}).join("");return`
        <div class="fh-hist-group">
            <div class="fh-hist-group-hdr" data-act="toggle-skipped-group" data-key="${e.key}">
                <div class="fh-hist-info" style="flex:1;min-width:0">
                    <div class="fh-hist-label" style="color:var(--fh-warning)">Skipped chores</div>
                    <div class="fh-hist-name">${m(e.dateDisplay)} \xB7 ${o}</div>
                </div>
                <span class="fh-hist-expand-icon">${a?"\u25B2":"\u25BC"}</span>
            </div>
            <div class="fh-hist-subitems"${a?"":' style="display:none"'}>${s}</div>
        </div>`}var Rt,Ua,qa=N(()=>{K();K();Q();et();Rt=[{minXP:0,name:"Level 1"},{minXP:100,name:"Level 2"},{minXP:300,name:"Level 3"},{minXP:700,name:"Level 4"},{minXP:1200,name:"Level 5"}],Ua={key:"classic",tint:"#1A2538",sigil:"\u25C7",ranks:Rt,handlesNavigation:!1,rankTitle(e){return U(e,Rt).name},homeTileSubLabel(e){return e.person_type==="parent"?"HANDLER":"FIELD AGENT"},render(e,t){var h;let a=t.child_mode?" kid-large":"",o=e._personEntityId(t.name),s=e._attrs(o),i=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((h=e._states(o))==null?void 0:h.state)||"0"),r=t.avatar_color||H,d=t.rank_index!==void 0?t.rank_index:0,{dropThr:p,gainThr:c}=ge(t,i,d),b=be(t.person_id,i.history_log,i.rank_eval_weekday),g=ue(t.person_id,i.history_log,i.rank_eval_weekday),u=ve(s),v=[{key:"tasks",label:"Tasks"},{key:"store",label:"Store"},{key:"history",label:"History"}].map(w=>`
            <div class="fh-tab ${e._tab===w.key?"active":""}"
                 data-act="tab" data-tab="${w.key}">${w.label}</div>`).join(""),_="";e._tab==="tasks"&&(_=Co(s,r,t,e)),e._tab==="store"&&(_=zo(s,r,t,n,e)),e._tab==="history"&&(_=Ao(t,e));let f=(s.tasks_due_today_list||[]).filter(w=>w.status==="pending").length,$=(s.tasks_pending_approval_list||[]).length,S=e._tab==="tasks",x=S?wo({attr:s,naAttr:i,person:t,balance:n,weekly:b,lost:g,atRisk:u,openCount:f,pendingCount:$,rankIdx:d,dropThr:p,gainThr:c,color:r,card:e}):"";return`
            <div class="fh-classic-page${a}">
                <div class="fh-person-header" style="border-left:4px solid ${r}">
                    <div class="fh-avatar" style="background:${r};width:46px;height:46px;font-size:1.1rem">
                        ${j(t.name)}
                    </div>
                    <div style="flex:1;min-width:0">
                        <div style="font-size:.9rem;color:var(--fh-text-sec);font-weight:600">${m(t.name)}</div>
                        <div class="fh-balance" style="color:${r}">
                            ${O(n)}<span class="fh-balance-unit">pts</span>
                        </div>
                        ${s.show_dollar_value?`<div class="fh-dollar">${G(s.dollar_value)}</div>`:""}
                    </div>
                </div>
                <div class="fh-tabs">${v}</div>
                <div class="fh-classic-body ${S?"has-rail":""}">
                    <div class="fh-classic-body-main">${_}</div>
                    ${S?`<aside class="fh-classic-rail">${x}</aside>`:""}
                </div>
            </div>`}}});function Fo({attr:e,naAttr:t,person:a,balance:o,openCount:s,weekly:i,lost:n,atRisk:r,rank:d,rankIdx:p,dropThr:c,gainThr:b,plotDate:g,card:u}){return`
        ${Do(o,s,i,n,r,e.show_dollar_value?e.dollar_value:null)}
        ${He(e)}
        ${Io(p,i,c,b,a,e)}
        ${To(e,t,a)}
        ${(()=>{let v=De(u._attrs("sensor.family_hub_claimable_tasks").tasks||[],a.person_id,{bare:!0});return v?Ye("BONUS \xB7 OPEN OPS",v):""})()}
        ${(()=>{let v=ye(a,t,ae.amber);return v?Ye("ROTATION \xB7 POOL",v):""})()}
        ${Ro(e,o,a.person_id)}
        ${Po(a,d,g)}`}function Ye(e,t,a={}){let{dense:o=!1}=a;return`
        <div class="fh-eng-rpanel ${o?"dense":""}">
            <span class="fh-eng-tick" data-pos="tl"></span>
            <span class="fh-eng-tick" data-pos="tr"></span>
            <span class="fh-eng-tick" data-pos="bl"></span>
            <span class="fh-eng-tick" data-pos="br"></span>
            <div class="fh-eng-rpanel-hdr">// ${e}</div>
            <div class="fh-eng-rpanel-body">${t}</div>
        </div>`}function Ro(e,t,a){let o=Ie(e.subscriptions,t,a);return o?Ye("SUBSCRIPTIONS",o):""}function Do(e,t,a,o,s,i){let n=(d,p,c,b,g="")=>`
        <div class="fh-eng-rkpi">
            <div class="fh-eng-rkpi-lbl">${d}</div>
            <div class="fh-eng-rkpi-val-row">
                <span class="fh-eng-rkpi-val">${m(String(p))}</span>
                ${c?`<span class="fh-eng-rkpi-unit">${c}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,r=`
        <div class="fh-eng-rkpi-row">
            ${n("BAL",O(e),"pts",i!=null?G(i):null)}
            ${n("OPEN",t,"wo",s>0?`\u2212${s} at risk`:null,"fh-rkpi-sub--loss")}
            ${n("WEEK",`+${a}`,"pts",o>0?`\u2212${o} lost`:"0 lost","fh-rkpi-sub--loss")}
        </div>`;return Ye("TODAY \xB7 KPIS",r,{dense:!0})}function Io(e,t,a,o,s,i){let n=xe(e,t,a,o,vt,ae.amber,s),r=we(s,ae.amber),d=ke(s),p=Se(i);return n?Ye("RANK \xB7 TRACK",n+r+d+p):Ye("RANK \xB7 TRACK",`<div class="fh-eng-rmax">${m(U(e,vt).name)} &middot; MAX</div>${r}${d}${p}`)}function To(e,t,a){let o=_e(e,t,a,8);if(!o.length)return Ye("STREAK \xB7 CONSTELLATION",'<div class="fh-eng-rempty">NO ACTIVE STREAKS &middot; START A CYCLE</div>');let s=o.map(i=>{let{goalSegs:n,filledN:r,countLbl:d}=$e(i.streak,i.milestone,12),p=Array.from({length:n},(b,g)=>g<r),c=i.milestone>0&&i.bonus>0?`<span class="fh-eng-chip fh-eng-chip-streak">&#9733;+${i.bonus}</span>`:"";return`
            <div class="fh-eng-rstreak">
                <div class="fh-eng-rstreak-head">
                    <span class="fh-eng-rstreak-name">${m(i.name)}</span>
                    ${c}
                </div>
                <div class="fh-eng-rstreak-bar">
                    ${p.map(b=>`<span class="fh-eng-dim-seg${b?" filled":""}"></span>`).join("")}
                    <span class="fh-eng-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return Ye("STREAK \xB7 CONSTELLATION",s)}function Po(e,t,a){let o=`
        <div class="fh-eng-tb-header">RATHNOKAN HOUSEHOLD &middot; CIVIL DIV.</div>
        <div class="fh-eng-tb-grid">
            ${ct("DRAWN BY",e.name.toUpperCase())}
            ${ct("DATE",a)}
            ${ct("SHEET","01 / 01")}
            ${ct("SCALE","N.T.S.")}
            ${ct("REV","A")}
            ${ct("STATUS","ISSUED",ae.amber)}
        </div>
        <div class="fh-eng-rsheet-legend">&#9671; APPROVAL STAMP TO COMPLETE &middot; DIMENSIONS IN POINTS &middot; DO NOT SCALE</div>`;return Ye("SHEET \xB7 A-101",o,{dense:!0})}function ct(e,t,a){return`
        <div class="fh-eng-tb-cell">
            <div class="fh-eng-tb-cell-lbl">${e}</div>
            <div class="fh-eng-tb-cell-val" style="${a?`color:${a}`:""}">${m(t)}</div>
        </div>`}function Lo(e,t,a,o){let s=e.tasks_due_today_list||[],i=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],r=o._attrs("sensor.family_hub_needs_attention").category_labels||[],d=(f,$)=>{let S=new Map;for(let x of f){let h=x.chore_id;(!S.has(h)||$(x,S.get(h)))&&S.set(h,x)}return[...S.values()]},p=d(i,(f,$)=>(f.days_overdue||0)>($.days_overdue||0)),c=d(s.filter(f=>f.chore_type!=="reminder"),()=>!1),b=[...p.map(f=>({...f,_over:!0})),...c];if(!b.length&&!n.length)return'<div class="fh-eng-empty">&#10003; ALL WORK ORDERS COMPLETE &middot; AREA CLEAR</div>';let g=0,u=Ne(b,r).map(f=>{let $=`<div class="fh-row-section-hdr">// ${m(f.label.toUpperCase())}</div>`,S=f.tasks.map(x=>Y(x,Ja,t,o,{index:++g})).join("");return $+S}).join(""),v=0,_=n.length?`
        <div class="fh-row-section-hdr">// PENDING REVIEW</div>
        ${n.map(f=>Y(f,Ja,t,o,{index:++v})).join("")}`:"";return`
        ${Ee(e)}
        ${Ce(e)}
        <div class="fh-row-list">
            ${u}
            ${_}
        </div>`}function Oo(e,t,a,o){let s=e.store_items||[];if(!s.length)return'<div class="fh-eng-empty">NO REWARDS CONFIGURED &middot; PENDING ADMIN ACTION</div>';let i=o._attrs("sensor.family_hub_needs_attention"),r=(i.redemption_queue||[]).filter(b=>b.person_id===t.person_id),d=new Set(r.map(b=>b.item_id).filter(Boolean)),p=new Set(r.filter(b=>!b.item_id).map(b=>b.item_name)),c=new Set((e.subscriptions||[]).map(b=>b.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Pe(e.group_proposals,t.person_id)}
        ${ze(e)}
        <div class="fh-eng-reward-list">
            ${s.map(b=>{let g=!!b.is_group_reward,u=b.item_type==="subscription",v=u&&c.has(b.item_id),_=a>=b.points_cost,f=d.has(b.item_id)||p.has(b.name),$=!!b.next_available,S={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[b.subscription_period]||"mo";return`
                <div class="fh-eng-reward-row">
                    ${me(b)}
                    <div class="fh-eng-reward-body">
                        <div class="fh-eng-wo-name" style="font-size:1rem">${m(b.name)}</div>
                        ${b.description?`<div class="fh-eng-status">${m(b.description)}</div>`:""}
                        ${Ae(b)}
                        ${Be(b,t.person_id)}
                    </div>
                    ${g?"":`<div class="fh-eng-pts-stamp" style="min-width:64px">
                               <div class="fh-eng-pts-num" style="font-size:1.2rem">${O(b.points_cost)}</div>
                               <div class="fh-eng-pts-lbl">POINTS</div>
                           </div>`}
                    ${Me(b,e,t.person_id)}
                    ${g?Fe(b,t.person_id,a):b.locked&&!f&&!(u&&v)?Re(b):u?v?`<div class="fh-eng-status" style="color:${ae.amber}">&#10003; SUBSCRIBED</div>`:f?`<div class="fh-eng-status" style="color:${ae.amber}">&#10003; REQUESTED</div>`:`<button class="fh-eng-stamp-btn ${_?"":"disabled"}"
                                       data-act="redeem"
                                       data-iid="${C(b.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       style="font-size:9px;${_?"":"opacity:.4;cursor:not-allowed"}">
                                   ${_?`SUBSCRIBE \xB7 ${b.points_cost}/${S}`:`INSUFFICIENT
FUNDS`}
                               </button>`:f?`<div class="fh-eng-status" style="color:${ae.amber}">&#10003; REQUESTED</div>`:$?`<div class="fh-eng-status" style="color:${ae.amber};font-size:.75rem">NOT AVAILABLE</div>`:`<button class="fh-eng-stamp-btn ${_?"":"disabled"}"
                                   data-act="redeem" data-iid="${b.item_id}" data-pid="${t.person_id}"
                                   style="font-size:9px;${_?"":"opacity:.4;cursor:not-allowed"}">
                               ${_?"REQUISITION":`INSUFFICIENT
FUNDS`}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${Te(e.subscriptions,a,i.history_log,t.person_id)}
        </div>
        </div>`}function No(e,t){let o=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(i=>i.person_id===e.person_id);return o.length?`
        <div class="fh-eng-hist-list">
            ${ce(o).slice(0,12).map(i=>i.isGroup?jo(i,t):Ho(i.entry)).join("")}
        </div>`:'<div class="fh-eng-empty">NO RECORDS ON FILE &middot; HISTORY BEGINS ON FIRST COMPLETION</div>'}function Ho(e){let t=ie[e.type]||{label:e.type,color:ae.inkMute},a=e.points_delta?e.points_delta>0?`+${e.points_delta}pts`:`${e.points_delta}pts`:"",o=e.points_delta>0?ae.amber:ae.red;return`
        <div class="fh-eng-hist-row">
            <div class="fh-eng-hist-type" style="color:${t.color}">${m(t.label.toUpperCase())}</div>
            <div class="fh-eng-hist-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a?`<div class="fh-eng-hist-pts" style="color:${o}">${a}</div>`:""}
        </div>`}function jo(e,t){let a=t._expandedSkippedDates.has(e.key),o=e.totalPenalty>0?`&minus;${e.totalPenalty}pts`:"no penalty";return`
        <div class="fh-eng-hist-row fh-eng-hist-skipped"
             data-act="toggle-skipped-group" data-key="${e.key}" style="cursor:pointer">
            <div class="fh-eng-hist-type" style="color:${ae.red}">SKIPPED CYCLE</div>
            <div class="fh-eng-hist-name">${m(e.dateDisplay)} &middot; ${o}</div>
            <span style="color:${ae.inkMute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(s=>`
            <div class="fh-eng-hist-row" style="padding-left:24px;opacity:.8">
                <div class="fh-eng-hist-type" style="color:${ae.inkMute}">ITEM</div>
                <div class="fh-eng-hist-name">${m(s.chore_name||"")}</div>
                ${s.points_delta?`<div class="fh-eng-hist-pts" style="color:${ae.red}">${s.points_delta}pts</div>`:""}
                ${fe(s)}
            </div>`).join(""):""}`}var ae,vt,Ja,Ka,Va=N(()=>{Q();K();et();ae={paper:"#0E3A5C",panel:"#0B2D48",grid:"#3C7AA5",ink:"#F2EBD6",inkDim:"#C9C0A2",inkMute:"#8A8669",red:"#E07A4C",amber:"#E0B84C"},vt=[{minXP:0,name:"Drafter"},{minXP:100,name:"Jr. Engineer"},{minXP:300,name:"P.E."},{minXP:700,name:"Sr. Engineer"},{minXP:1200,name:"Principal Eng."}],Ja={themeKey:"engineer",kickerFormat:(e,t)=>`WO-${String(t).padStart(3,"0")} \xB7 ${(e.category_label||"GEN").toUpperCase()}`,btnLabel:"MARK<br>COMPLETE",btnIcon:"\u2713",btnPendingLabel:"PENDING<br>APPROVAL",btnPendingIcon:"\u23F1",reminderBtnLabel:"DISMISS",streakIcon:"\u25B3",statusFormat:{breach:e=>`BREACH \xB7 ${e.days_overdue}D`,resetSoon:()=>"RESETS 1D",firing:e=>`ACCRUING \u2212${e.penalty_points}/D`,expiry:e=>e<=0?"EXPIRES TODAY":`EXPIRES ${e}D`},iconColor:()=>ae.ink},Ka={key:"engineer",tint:"#1B3550",sigil:"\u27C1",ranks:vt,handlesNavigation:!0,rankTitle(e){return U(e,vt).name},homeTileSubLabel(){return"CIVIL ENGINEER"},render(e,t){var F;let a=t.child_mode?" kid-large":"",o=e._personEntityId(t.name),s=e._attrs(o),i=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((F=e._states(o))==null?void 0:F.state)||"0"),r=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:p}=ge(t,i,r),c=be(t.person_id,i.history_log,i.rank_eval_weekday),b=ue(t.person_id,i.history_log,i.rank_eval_weekday),g=ve(s),u=[{key:"tasks",label:"WORK ORDERS",sub:"primary"},{key:"store",label:"REWARDS",sub:"exchange"},{key:"history",label:"AS-BUILTS",sub:"history"}],v=e._tab||"tasks",_=u.map(D=>`
            <div class="fh-eng-tab ${v===D.key?"active":""}"
                 data-act="tab" data-tab="${D.key}">
                ${D.label}
                <span class="fh-eng-tab-sub">${D.sub}</span>
            </div>`).join(""),f="";v==="tasks"&&(f=Lo(s,t,n,e)),v==="store"&&(f=Oo(s,t,n,e)),v==="history"&&(f=No(t,e));let $=U(r,vt),S=(s.tasks_due_today_list||[]).filter(D=>D.status==="pending").length,x=new Date,h=x.toISOString().slice(0,10),w=x.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1}),z=v==="tasks",E=z?Fo({attr:s,naAttr:i,person:t,balance:n,openCount:S,weekly:c,lost:b,atRisk:g,rank:$,rankIdx:r,dropThr:d,gainThr:p,plotDate:h,card:e}):"";return`
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
                            ${j(t.name)}
                            <span class="fh-eng-avatar-diamond"></span>
                        </div>

                        <div class="fh-eng-identity">
                            <div class="fh-eng-rank-line">
                                ${m($.name.toUpperCase())} &middot; AGT ${m((t.code||t.name).toUpperCase())} &middot; DIV. ${m(t.person_type==="parent"?"PARENT":"FIELD")}
                            </div>
                            <div class="fh-eng-name">${m(t.name)} &middot; Work Orders</div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="fh-eng-tabs">${_}</div>
                    <div class="fh-eng-rule"></div>

                    <!-- Body \u2014 two-column on wide, stacked below 900px -->
                    <div class="fh-eng-body ${z?"has-rail":""}">
                        <div class="fh-eng-body-main">${f}</div>
                        ${z?`<aside class="fh-eng-rail">${E}</aside>`:""}
                    </div>

                    <!-- Footer \u2014 single mono status line -->
                    <div class="fh-eng-footer">
                        <span class="fh-eng-file-path">FILE &middot; /WORK_ORDERS/${h}.dwg &middot; LAST PLOT ${w} LOCAL &middot; SHEET A-101 R/A</span>
                    </div>
                </div>
            </div>`}}});function Go({attr:e,naAttr:t,person:a,balance:o,weekly:s,lost:i,atRisk:n,openCount:r,rankIdx:d,dropThr:p,gainThr:c,rank:b,card:g}){return`
        ${Uo(o,s,i,n,r,e.show_dollar_value?e.dollar_value:null)}
        ${He(e)}
        ${qo(d,s,p,c,a,e)}
        ${Jo(e,t,a)}
        ${(()=>{let u=De(g._attrs("sensor.family_hub_claimable_tasks").tasks||[],a.person_id,{bare:!0});return u?Ge("bonus orders",u):""})()}
        ${(()=>{let u=ye(a,t,se.terra);return u?Ge("rotation",u):""})()}
        ${Wo(e,o,a.person_id)}
        ${Ko(a,t)}`}function Ge(e,t){return`
        <div class="fh-bk-rpanel">
            <div class="fh-bk-rpanel-hdr">~ ${e} ~</div>
            <div class="fh-bk-rpanel-body">${t}</div>
        </div>`}function Wo(e,t,a){let o=Ie(e.subscriptions,t,a);return o?Ge("SUBSCRIPTIONS",o):""}function Uo(e,t,a,o,s,i){let n=(d,p,c,b,g="")=>`
        <div class="fh-bk-rkpi">
            <div class="fh-bk-rkpi-lbl">${d}</div>
            <div class="fh-bk-rkpi-val-row">
                <span class="fh-bk-rkpi-val">${m(String(p))}</span>
                ${c?`<span class="fh-bk-rkpi-unit">${c}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,r=`
        <div class="fh-bk-rkpi-row">
            ${n("balance",O(e),"pts",i!=null?G(i):null)}
            ${n("this week",`+${t}`,"pts",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("on prep",s,"items",o>0?`\u2212${o} at risk`:null,"fh-rkpi-sub--loss")}
        </div>`;return Ge("the pantry today",r)}function qo(e,t,a,o,s,i){let n=xe(e,t,a,o,xt,se.terra,s),r=we(s,se.terra),d=ke(s),p=Se(i);return n?Ge("promotion track",n+r+d+p):Ge("promotion track",`<div class="fh-bk-rmax">${m(U(e,xt).name)} \xB7 top of the line</div>${r}${d}${p}`)}function Jo(e,t,a){let o=_e(e,t,a,8);if(!o.length)return Ge("hot streaks",'<div class="fh-bk-rempty">No hot streaks yet \u2014 fire up the oven</div>');let s=o.map(i=>{let{goalSegs:n,filledN:r,countLbl:d}=$e(i.streak,i.milestone,10),p=Array.from({length:n},(b,g)=>`<span class="fh-bk-rdot${g<r?" filled":""}"></span>`).join(""),c=i.milestone>0&&i.bonus>0?`<span class="fh-bk-rbonus">\u2605+${i.bonus}</span>`:"";return`
            <div class="fh-bk-rstreak">
                <div class="fh-bk-rstreak-head">
                    <span class="fh-bk-rstreak-name">${m(i.name)}</span>
                    ${c}
                </div>
                <div class="fh-bk-rstreak-bar">
                    <span class="fh-bk-rdots">${p}</span>
                    <span class="fh-bk-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return Ge("hot streaks",s)}function Ko(e,t){let a=(t.history_log||[]).filter(s=>s.person_id===e.person_id&&(s.points_delta||0)>0).slice(0,4);if(!a.length)return Ge("today's tickets",'<div class="fh-bk-rempty">No tickets served yet</div>');let o=a.map(s=>{let i=s.timestamp?ne(s.timestamp):"";return`
            <div class="fh-bk-rorder">
                <div class="fh-bk-rorder-when">~ ${m(i)} ~</div>
                <div class="fh-bk-rorder-row">
                    <span class="fh-bk-rorder-name">${m(s.chore_name||s.note||"\u2014")}</span>
                    <span class="fh-bk-rorder-pts">+${s.points_delta}pts</span>
                </div>
            </div>`}).join("");return Ge("today's tickets",o)}function Vo(e,t,a,o){let s=e.tasks_due_today_list||[],i=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],r=a.category_labels||[],d=(f,$)=>{let S=new Map;for(let x of f)(!S.has(x.chore_id)||$(x,S.get(x.chore_id)))&&S.set(x.chore_id,x);return[...S.values()]},p=d(i,(f,$)=>(f.days_overdue||0)>($.days_overdue||0)),c=d(s.filter(f=>f.chore_type!=="reminder"),()=>!1),b=[...p.map(f=>({...f,_over:!0})),...c];if(!b.length&&!n.length)return`<div class="fh-bk-empty">\u2713 Kitchen's clear \u2014 all orders done!</div>`;let g=0,v=Ne(b,r).map(f=>{let $=`<div class="fh-row-section-hdr">${m(f.label)}</div>`,S=f.tasks.map(x=>Y(x,Ya,t,o,{index:++g})).join("");return $+S}).join(""),_=n.length?`
        <div class="fh-row-section-hdr">Awaiting approval</div>
        ${n.map(f=>Y(f,Ya,t,o)).join("")}`:"";return`
        ${Ee(e)}
        ${Ce(e)}
        <div class="fh-row-list">
            ${v}
            ${_}
        </div>`}function Yo(e,t,a,o){let s=e.store_items||[];if(!s.length)return'<div class="fh-bk-empty">No rewards on the menu yet.</div>';let i=o._attrs("sensor.family_hub_needs_attention"),n=(i.redemption_queue||[]).filter(c=>c.person_id===t.person_id),r=new Set(n.map(c=>c.item_id).filter(Boolean)),d=new Set(n.filter(c=>!c.item_id).map(c=>c.item_name)),p=new Set((e.subscriptions||[]).map(c=>c.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Pe(e.group_proposals,t.person_id)}
        ${ze(e)}
        <div class="fh-bk-menu">
            ${s.map(c=>{let b=!!c.is_group_reward,g=c.item_type==="subscription",u=g&&p.has(c.item_id),v=a>=c.points_cost,_=r.has(c.item_id)||d.has(c.name),f=!!c.next_available,$={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[c.subscription_period]||"mo";return`
                <div class="fh-bk-menu-item">
                    ${me(c)}
                    <div class="fh-bk-menu-body">
                        <div class="fh-bk-menu-name">${m(c.name)}</div>
                        ${c.description?`<div class="fh-bk-menu-desc">${m(c.description)}</div>`:""}
                        ${Ae(c)}
                        ${Be(c,t.person_id)}
                    </div>
                    ${b?"":`<div class="fh-bk-menu-price" style="color:${se.terra}">${O(c.points_cost)}pts</div>`}
                    ${Me(c,e,t.person_id)}
                    ${b?Fe(c,t.person_id,a):c.locked&&!_&&!(g&&u)?Re(c):g?u?`<span class="fh-bk-badge" style="color:${se.terra}">Subscribed \u2713</span>`:_?`<span class="fh-bk-badge" style="color:${se.terra}">Requested \u2713</span>`:`<button class="fh-bk-go-btn ${v?"":"disabled"}"
                                       data-act="redeem"
                                       data-iid="${C(c.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       ${v?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                                   ${v?`Subscribe \xB7 ${c.points_cost}pts/${$}`:"Need more"}
                               </button>`:_?`<span class="fh-bk-badge" style="color:${se.terra}">Requested \u2713</span>`:f?'<span class="fh-bk-badge" style="color:var(--fh-overdue)">Not available</span>':`<button class="fh-bk-go-btn ${v?"":"disabled"}"
                                   data-act="redeem" data-iid="${C(c.item_id)}" data-pid="${C(t.person_id)}"
                                   ${v?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                               ${v?"Request":"Need more"}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${Te(e.subscriptions,a,i.history_log,t.person_id)}
        </div>
        </div>`}function Xo(e,t){let o=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(i=>i.person_id===e.person_id);return o.length?`
        <div class="fh-bk-log">
            ${ce(o).slice(0,15).map(i=>i.isGroup?Zo(i,t):Qo(i.entry)).join("")}
        </div>`:'<div class="fh-bk-empty">No orders on record yet.</div>'}function Qo(e){let t=ie[e.type]||{label:e.type,color:se.mute},a=e.points_delta?`<span style="color:${e.points_delta>0?se.terra:se.red};font-weight:700">
               ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"";return`
        <div class="fh-bk-log-row">
            <div class="fh-bk-log-type" style="color:${t.color}">${m(t.label)}</div>
            <div class="fh-bk-log-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a}
        </div>`}function Zo(e,t){let a=t._expandedSkippedDates.has(e.key),o=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty";return`
        <div class="fh-bk-log-row"
             data-act="toggle-skipped-group" data-key="${C(e.key)}" style="cursor:pointer">
            <div class="fh-bk-log-type" style="color:${se.red}">Skipped</div>
            <div class="fh-bk-log-name">${m(e.dateDisplay)} \xB7 ${o}</div>
            <span style="color:${se.mute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(s=>`
            <div class="fh-bk-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-bk-log-type" style="color:${se.mute}">Item</div>
                <div class="fh-bk-log-name">${m(s.chore_name||"")}</div>
                ${s.points_delta?`<span style="color:${se.red};font-weight:700">${s.points_delta}pts</span>`:""}
                ${fe(s)}
            </div>`).join(""):""}`}var se,Ya,xt,Xa,Qa=N(()=>{Q();K();et();se={bg:"#F2E5CC",panel:"#FBF3E2",ink:"#3A1F12",mute:"#8B5A3A",terra:"#8B3A2A",red:"#A02828",green:"#3A6A28"},Ya={themeKey:"baker",leadFormat:(e,t)=>e.status==="pending_approval"?null:String(t),btnLabel:"Bake it \u2713",btnPendingLabel:"Pending Approval",reminderBtnLabel:"Dismiss",streakIcon:"\u{1F525}",statusFormat:{breach:e=>`Overdue ${e.days_overdue}d`,resetSoon:()=>"Resets 1d",firing:e=>`\u2212${e.penalty_points}pts/d`,expiry:e=>e<=0?"Expires today":`Expires in ${e}d`},iconColor:(e,t)=>t?se.red:se.terra},xt=[{minXP:0,name:"Apprentice"},{minXP:100,name:"Line Cook"},{minXP:300,name:"Pastry Chef"},{minXP:700,name:"Sous Chef"},{minXP:1200,name:"Head Chef"}],Xa={key:"baker",tint:"#F2E5CC",sigil:"\u2767",ranks:xt,handlesNavigation:!1,rankTitle(e){return U(e,xt).name},homeTileSubLabel(){return"MASTER BAKER"},render(e,t){var D;let a=t.child_mode?" kid-large":"",o=e._personEntityId(t.name),s=e._attrs(o),i=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((D=e._states(o))==null?void 0:D.state)||"0"),r=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:p}=ge(t,i,r),c=be(t.person_id,i.history_log,i.rank_eval_weekday),b=ue(t.person_id,i.history_log,i.rank_eval_weekday),g=ve(s),u=U(r,xt),v=new Date,_=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],f=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],$=`${_[v.getDay()]} \xB7 ${v.getDate()} ${f[v.getMonth()]}`,S=[{key:"tasks",label:"Today's Prep",sub:"CHORES"},{key:"store",label:"Pantry",sub:"STORE"},{key:"history",label:"Recipe Book",sub:"HISTORY"}],x=e._tab||"tasks",h=S.map(R=>`
            <div class="fh-bk-tab ${x===R.key?"active":""}"
                 data-act="tab" data-tab="${R.key}">${R.label}<span class="fh-bk-tab-sub">${R.sub}</span></div>`).join(""),w="";x==="tasks"&&(w=Vo(s,t,i,e)),x==="store"&&(w=Yo(s,t,n,e)),x==="history"&&(w=Xo(t,e));let z=(s.tasks_due_today_list||[]).filter(R=>R.status==="pending").length,E=x==="tasks",F=E?Go({attr:s,naAttr:i,person:t,balance:n,weekly:c,lost:b,atRisk:g,openCount:z,rankIdx:r,dropThr:d,gainThr:p,rank:u,card:e}):"";return`
            <div class="fh-bk-page${a}">
                <div class="fh-bk-frame-outer"></div>
                <div class="fh-bk-frame-inner"></div>

                <div class="fh-bk-title-block">
                    <div class="fh-bk-title-kicker">~ ${$} ~</div>
                    <div class="fh-bk-title-main">Shannon's Kitchen</div>
                    <div class="fh-bk-title-sub">~ today's recipe \xB7 serves the whole family ~</div>
                </div>

                <div class="fh-bk-tabs">${h}</div>

                <div class="fh-bk-body ${E?"has-rail":""}">
                    <div class="fh-bk-body-main">${w}</div>
                    ${E?`<aside class="fh-bk-rail">${F}</aside>`:""}
                </div>

                <div class="fh-bk-footer"><span>\u2014 Family Hub \xB7 est. 2026 \u2014</span><span>${m(u.name)}</span></div>
            </div>`}}});function ei({attr:e,naAttr:t,person:a,balance:o,weekly:s,lost:i,atRisk:n,openCount:r,rankIdx:d,dropThr:p,gainThr:c,dateStr:b,card:g}){return`
        ${ai(o,s,i,n,r,e.show_dollar_value?e.dollar_value:null)}
        ${He(e)}
        ${si(d,s,p,c,a,e)}
        ${oi(e,t,a)}
        ${(()=>{let u=De(g._attrs("sensor.family_hub_claimable_tasks").tasks||[],a.person_id,{bare:!0});return u?We("BONUS DIGS",u):""})()}
        ${(()=>{let u=ye(a,t,oe.amber);return u?We("ROTATION",u):""})()}
        ${ti(e,o,a.person_id)}
        ${ii(a,t)}`}function We(e,t){return`
        <div class="fh-dn-rpanel">
            <div class="fh-dn-rpanel-hdr">// ${e}</div>
            <div class="fh-dn-rpanel-body">${t}</div>
        </div>`}function ti(e,t,a){let o=Ie(e.subscriptions,t,a);return o?We("SUBSCRIPTIONS",o):""}function ai(e,t,a,o,s,i){let n=(d,p,c,b,g="")=>`
        <div class="fh-dn-rkpi">
            <div class="fh-dn-rkpi-lbl">${d}</div>
            <div class="fh-dn-rkpi-val-row">
                <span class="fh-dn-rkpi-val">${m(String(p))}</span>
                ${c?`<span class="fh-dn-rkpi-unit">${c}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,r=`
        <div class="fh-dn-rkpi-row">
            ${n("FOSSILS",O(e),"pts",i!=null?G(i):null)}
            ${n("THIS WEEK",`+${t}`,"pts",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("SPECIMENS",s,"open",o>0?`\u2212${o} at risk`:null,"fh-rkpi-sub--loss")}
        </div>`;return We("FIELD KIT \xB7 TODAY",r)}function si(e,t,a,o,s,i){let n=xe(e,t,a,o,yt,oe.amber,s),r=we(s,oe.amber),d=ke(s),p=Se(i);return n?We("DIG STATUS",n+r+d+p):We("DIG STATUS",`<div class="fh-dn-rmax">${m(U(e,yt).name)} \xB7 MAX</div>${r}${d}${p}`)}function oi(e,t,a){let o=_e(e,t,a,8);if(!o.length)return We("FOSSIL RECORD",'<div class="fh-dn-rempty">NO STREAKS LOGGED \u2014 DIG IN</div>');let s=o.map(i=>{let{goalSegs:n,filledN:r,countLbl:d}=$e(i.streak,i.milestone,10),p=Array.from({length:n},(b,g)=>`<span class="fh-dn-footprint${g<r?"":" dim"}">\u{1F9B6}</span>`).join(""),c=i.milestone>0&&i.bonus>0?`<span class="fh-dn-rbonus">\u2605+${i.bonus}</span>`:"";return`
            <div class="fh-dn-rstreak">
                <div class="fh-dn-rstreak-head">
                    <span class="fh-dn-rstreak-name">${m(i.name)}</span>
                    ${c}
                </div>
                <div class="fh-dn-rstreak-bar">
                    <span class="fh-dn-footprints">${p}</span>
                    <span class="fh-dn-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return We("FOSSIL RECORD",s)}function ii(e,t){let a=(t.history_log||[]).filter(s=>s.person_id===e.person_id&&(s.points_delta||0)>0).slice(0,4);if(!a.length)return We("RECENT FINDINGS",'<div class="fh-dn-rempty">NO FINDINGS YET \u2014 FILE FIRST SPECIMEN</div>');let o=a.map((s,i)=>{let n=String(i+1).padStart(3,"0"),r=s.timestamp?ne(s.timestamp):"";return`
            <div class="fh-dn-rfind">
                <div class="fh-dn-rfind-tag">SP-${n} \xB7 FILED ${m(r.toUpperCase())}</div>
                <div class="fh-dn-rfind-row">
                    <span class="fh-dn-rfind-name">${m(s.chore_name||s.note||"\u2014")}</span>
                    <span class="fh-dn-rfind-pts">+${s.points_delta}pts</span>
                </div>
            </div>`}).join("");return We("RECENT FINDINGS",o)}function ni(e,t,a,o){let s=e.tasks_due_today_list||[],i=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],r=a.category_labels||[],d=(f,$)=>{let S=new Map;for(let x of f)(!S.has(x.chore_id)||$(x,S.get(x.chore_id)))&&S.set(x.chore_id,x);return[...S.values()]},p=d(i,(f,$)=>(f.days_overdue||0)>($.days_overdue||0)),c=d(s.filter(f=>f.chore_type!=="reminder"),()=>!1),b=[...p.map(f=>({...f,_over:!0})),...c];if(!b.length&&!n.length)return'<div class="fh-dn-empty">\u25C9 SITE CLEAR \u2014 ALL SPECIMENS LOGGED</div>';let g=0,v=Ne(b,r).map(f=>{let $=`<div class="fh-row-section-hdr">${m(f.label)}</div>`,S=f.tasks.map(x=>Y(x,Za,t,o,{index:++g})).join("");return $+S}).join(""),_=n.length?`
        <div class="fh-row-section-hdr">AWAITING APPROVAL</div>
        ${n.map(f=>Y(f,Za,t,o)).join("")}`:"";return`
        ${Ee(e)}
        ${Ce(e)}
        <div class="fh-row-list">
            ${v}
            ${_}
        </div>`}function ri(e,t,a,o){let s=e.store_items||[];if(!s.length)return'<div class="fh-dn-empty">SUPPLY CACHE EMPTY</div>';let i=o._attrs("sensor.family_hub_needs_attention"),n=(i.redemption_queue||[]).filter(c=>c.person_id===t.person_id),r=new Set(n.map(c=>c.item_id).filter(Boolean)),d=new Set(n.filter(c=>!c.item_id).map(c=>c.item_name)),p=new Set((e.subscriptions||[]).map(c=>c.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Pe(e.group_proposals,t.person_id)}
        ${ze(e)}
        <div class="fh-dn-supply">
            ${s.map(c=>{let b=!!c.is_group_reward,g=c.item_type==="subscription",u=g&&p.has(c.item_id),v=a>=c.points_cost,_=r.has(c.item_id)||d.has(c.name),f=!!c.next_available,$={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[c.subscription_period]||"mo";return`
                <div class="fh-dn-supply-item">
                    ${me(c)}
                    <div class="fh-dn-supply-body">
                        <div class="fh-dn-supply-name">${m(c.name)}</div>
                        ${c.description?`<div class="fh-dn-supply-desc">${m(c.description)}</div>`:""}
                        ${Ae(c)}
                        ${Be(c,t.person_id)}
                    </div>
                    ${b?"":`<div class="fh-dn-pts-tag" style="color:${oe.amber}">${O(c.points_cost)}pts</div>`}
                    ${Me(c,e,t.person_id)}
                    ${b?Fe(c,t.person_id,a):c.locked&&!_&&!(g&&u)?Re(c):g?u?`<span style="color:${oe.amber};font-size:.8rem;font-weight:700">SUBSCRIBED \u2713</span>`:_?`<span style="color:${oe.amber};font-size:.8rem;font-weight:700">REQUESTED \u2713</span>`:`<button class="fh-dn-go-btn ${v?"":"disabled"}"
                                       data-act="redeem"
                                       data-iid="${C(c.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       ${v?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                                   ${v?`SUBSCRIBE \xB7 ${c.points_cost}/${$}`:"NEED MORE"}
                               </button>`:_?`<span style="color:${oe.amber};font-size:.8rem;font-weight:700">CLAIMED \u2713</span>`:f?'<span style="color:var(--fh-overdue);font-size:.75rem;font-weight:600">NOT AVAILABLE</span>':`<button class="fh-dn-go-btn ${v?"":"disabled"}"
                                   data-act="redeem" data-iid="${C(c.item_id)}" data-pid="${C(t.person_id)}"
                                   ${v?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                               ${v?"CLAIM":"NEED MORE"}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${Te(e.subscriptions,a,i.history_log,t.person_id)}
        </div>
        </div>`}function li(e,t){let o=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(i=>i.person_id===e.person_id);return o.length?`
        <div class="fh-dn-log">
            ${ce(o).slice(0,15).map(i=>i.isGroup?ci(i,t):di(i.entry)).join("")}
        </div>`:'<div class="fh-dn-empty">NO ENTRIES IN SITE LOG YET</div>'}function di(e){let t=ie[e.type]||{label:e.type,color:oe.mute},a=e.points_delta?`<span style="color:${e.points_delta>0?oe.amber:oe.red};font-weight:700">
               ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"";return`
        <div class="fh-dn-log-row">
            <div class="fh-dn-log-type" style="color:${t.color}">${m(t.label)}</div>
            <div class="fh-dn-log-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a}
        </div>`}function ci(e,t){let a=t._expandedSkippedDates.has(e.key),o=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty";return`
        <div class="fh-dn-log-row"
             data-act="toggle-skipped-group" data-key="${C(e.key)}" style="cursor:pointer">
            <div class="fh-dn-log-type" style="color:${oe.red}">SKIPPED</div>
            <div class="fh-dn-log-name">${m(e.dateDisplay)} \xB7 ${o}</div>
            <span style="color:${oe.mute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(s=>`
            <div class="fh-dn-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-dn-log-type" style="color:${oe.mute}">ITEM</div>
                <div class="fh-dn-log-name">${m(s.chore_name||"")}</div>
                ${s.points_delta?`<span style="color:${oe.red};font-weight:700">${s.points_delta}pts</span>`:""}
                ${fe(s)}
            </div>`).join(""):""}`}var oe,Za,yt,es,ts=N(()=>{Q();K();et();oe={bg:"#E8DAB7",panel:"#F0E5C8",ink:"#2B1F0E",mute:"#6B5020",amber:"#8B6A20",red:"#8C281E",green:"#2A5A20"},Za={themeKey:"dinos",kickerFormat:(e,t)=>e.status==="pending_approval"?null:`SP-${String(t).padStart(3,"0")} \xB7 ${(e.category_label||"MISC").toUpperCase().slice(0,12)}`,btnLabel:"LOG IT",btnPendingLabel:"PENDING APPROVAL",reminderBtnLabel:"DISMISS",streakIcon:"\u{1F525}",statusFormat:{breach:e=>`OVERDUE ${e.days_overdue}D`,resetSoon:()=>"RESETS 1D",firing:e=>`\u2212${e.penalty_points}/D`,expiry:e=>e<=0?"EXPIRES TODAY":`EXPIRES ${e}D`},iconColor:(e,t)=>t?oe.red:oe.ink},yt=[{minXP:0,name:"Field Asst."},{minXP:100,name:"Jr. Paleontologist"},{minXP:300,name:"Field Lead"},{minXP:700,name:"Curator"},{minXP:1200,name:"Dr. Spencer"}],es={key:"dinos",tint:"#E8DAB7",sigil:"\u25C9",ranks:yt,handlesNavigation:!1,rankTitle(e){return U(e,yt).name},homeTileSubLabel(){return"FIELD PALEONTOLOGIST"},render(e,t){var D;let a=t.child_mode?" kid-large":"",o=e._personEntityId(t.name),s=e._attrs(o),i=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((D=e._states(o))==null?void 0:D.state)||"0"),r=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:p}=ge(t,i,r),c=be(t.person_id,i.history_log,i.rank_eval_weekday),b=ue(t.person_id,i.history_log,i.rank_eval_weekday),g=ve(s),u=U(r,yt),v=new Date,_=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],f=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],$=`${_[v.getDay()]} \xB7 ${v.getDate()} ${f[v.getMonth()]}`,S=[{key:"tasks",label:"FIELD LOG",sub:"today's specimens"},{key:"store",label:"TRADING POST",sub:"rewards"},{key:"history",label:"CATALOGUE",sub:"history"}],x=e._tab||"tasks",h=S.map(R=>`
            <div class="fh-dn-tab ${x===R.key?"active":""}"
                 data-act="tab" data-tab="${R.key}">${R.label}<span class="fh-dn-tab-sub">${R.sub}</span></div>`).join(""),w="";x==="tasks"&&(w=ni(s,t,i,e)),x==="store"&&(w=ri(s,t,n,e)),x==="history"&&(w=li(t,e));let z=(s.tasks_due_today_list||[]).filter(R=>R.status==="pending").length,E=x==="tasks",F=E?ei({attr:s,naAttr:i,person:t,balance:n,weekly:c,lost:b,atRisk:g,openCount:z,rankIdx:r,dropThr:d,gainThr:p,dateStr:$,card:e}):"";return`
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
                        <span class="fh-dn-title-date">EXPEDITION LOG \xB7 ${$.toUpperCase()}</span>
                        <span class="fh-dn-stamp">approved by HQ</span>
                        <span class="fh-dn-stamp fh-dn-stamp-olive">classified</span>
                    </div>
                </div>

                <div class="fh-dn-tabs">${h}</div>

                <div class="fh-dn-body ${E?"has-rail":""}">
                    <div class="fh-dn-body-main">${w}</div>
                    ${E?`<aside class="fh-dn-rail">${F}</aside>`:""}
                </div>

                <div class="fh-dn-footer"><span>FAMILY HUB \xB7 FIELD OPERATIONS</span><span>EXPEDITION LOG \xB7 ${$.toUpperCase()}</span></div>
            </div>`}}});function pi({attr:e,naAttr:t,person:a,balance:o,weekly:s,lost:i,atRisk:n,openCount:r,rankIdx:d,dropThr:p,gainThr:c,rank:b,card:g}){return`
        ${fi(o,s,i,n,r,e.show_dollar_value?e.dollar_value:null)}
        ${He(e)}
        ${mi(d,s,p,c,a,e)}
        ${gi(e,t,a)}
        ${(()=>{let u=De(g._attrs("sensor.family_hub_claimable_tasks").tasks||[],a.person_id,{bare:!0});return u?Ue("BONUS QUESTS",u):""})()}
        ${(()=>{let u=ye(a,t,re.emerald);return u?Ue("ROTATION",u):""})()}
        ${hi(e,o,a.person_id)}
        ${bi(a,t)}`}function Ue(e,t){return`
        <div class="fh-hp-rpanel">
            <div class="fh-hp-rpanel-hdr">~ ${e} ~</div>
            <div class="fh-hp-rpanel-body">${t}</div>
        </div>`}function hi(e,t,a){let o=Ie(e.subscriptions,t,a);return o?Ue("SUBSCRIPTIONS",o):""}function fi(e,t,a,o,s,i){let n=(d,p,c,b,g="")=>`
        <div class="fh-hp-rkpi">
            <div class="fh-hp-rkpi-lbl">${d}</div>
            <div class="fh-hp-rkpi-val-row">
                <span class="fh-hp-rkpi-val">${m(String(p))}</span>
                ${c?`<span class="fh-hp-rkpi-unit">${c}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,r=`
        <div class="fh-hp-rkpi-row">
            ${n("HOUSE PTS",O(e),"",i!=null?G(i):null)}
            ${n("THIS WEEK",`+${t}`,"pts",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("CLASSES",s,"open",o>0?`\u2212${o} at risk`:null,"fh-rkpi-sub--loss")}
        </div>`;return Ue("HOUSE STANDINGS",r)}function mi(e,t,a,o,s,i){let n=xe(e,t,a,o,wt,re.emerald,s),r=we(s,re.emerald),d=ke(s),p=Se(i);return n?Ue("O.W.L. PROGRESS",n+r+d+p):Ue("O.W.L. PROGRESS",`<div class="fh-hp-rmax">${m(U(e,wt).name)} \xB7 max marks</div>${r}${d}${p}`)}function gi(e,t,a){let o=_e(e,t,a,8);if(!o.length)return Ue("SPELLWORK STREAKS",'<div class="fh-hp-rempty">No spells cast in succession yet</div>');let s=o.map(i=>{let{goalSegs:n,filledN:r,countLbl:d}=$e(i.streak,i.milestone,10),p=Array.from({length:n},(b,g)=>`<span class="fh-hp-rstar${g<r?" lit":""}">\u2605</span>`).join(""),c=i.milestone>0&&i.bonus>0?`<span class="fh-hp-rbonus">\u2605+${i.bonus}</span>`:"";return`
            <div class="fh-hp-rstreak">
                <div class="fh-hp-rstreak-head">
                    <span class="fh-hp-rstreak-name">${m(i.name)}</span>
                    ${c}
                </div>
                <div class="fh-hp-rstreak-bar">
                    <span class="fh-hp-rstars">${p}</span>
                    <span class="fh-hp-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return Ue("SPELLWORK STREAKS",s)}function bi(e,t){let a=(t.history_log||[]).filter(s=>s.person_id===e.person_id&&(s.points_delta||0)>0).slice(0,4);if(!a.length)return Ue("OWL POST",'<div class="fh-hp-rempty">No owls delivered yet</div>');let o=a.map(s=>{let i=s.timestamp?ne(s.timestamp):"";return`
            <div class="fh-hp-rowl">
                <div class="fh-hp-rowl-when">~ ${m(i)} ~</div>
                <div class="fh-hp-rowl-row">
                    <span class="fh-hp-rowl-name">${m(s.chore_name||s.note||"\u2014")}</span>
                    <span class="fh-hp-rowl-pts">+${s.points_delta}pts</span>
                </div>
            </div>`}).join("");return Ue("OWL POST",o)}function ui(e,t,a,o){let s=e.tasks_due_today_list||[],i=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],r=a.category_labels||[],d=(f,$)=>{let S=new Map;for(let x of f)(!S.has(x.chore_id)||$(x,S.get(x.chore_id)))&&S.set(x.chore_id,x);return[...S.values()]},p=d(i,(f,$)=>(f.days_overdue||0)>($.days_overdue||0)),c=d(s.filter(f=>f.chore_type!=="reminder"),()=>!1),b=[...p.map(f=>({...f,_over:!0})),...c];if(!b.length&&!n.length)return'<div class="fh-hp-empty">All assignments complete \u2014 10 points to the house!</div>';let g=0,v=Ne(b,r).map(f=>{let $=`<div class="fh-row-section-hdr">${m(f.label)}</div>`,S=f.tasks.map(x=>Y(x,as,t,o,{index:++g})).join("");return $+S}).join(""),_=n.length?`
        <div class="fh-row-section-hdr">Awaiting approval</div>
        ${n.map(f=>Y(f,as,t,o)).join("")}`:"";return`
        ${Ee(e)}
        ${Ce(e)}
        <div class="fh-row-list">
            ${v}
            ${_}
        </div>`}function vi(e,t,a,o){let s=e.store_items||[];if(!s.length)return'<div class="fh-hp-empty">The vault is empty for now.</div>';let i=o._attrs("sensor.family_hub_needs_attention"),n=(i.redemption_queue||[]).filter(c=>c.person_id===t.person_id),r=new Set(n.map(c=>c.item_id).filter(Boolean)),d=new Set(n.filter(c=>!c.item_id).map(c=>c.item_name)),p=new Set((e.subscriptions||[]).map(c=>c.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Pe(e.group_proposals,t.person_id)}
        ${ze(e)}
        <div class="fh-hp-vault">
            ${s.map(c=>{let b=!!c.is_group_reward,g=c.item_type==="subscription",u=g&&p.has(c.item_id),v=a>=c.points_cost,_=r.has(c.item_id)||d.has(c.name),f=!!c.next_available,$={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[c.subscription_period]||"mo";return`
                <div class="fh-hp-vault-item">
                    ${me(c)}
                    <div class="fh-hp-vault-body">
                        <div class="fh-hp-vault-name">${m(c.name)}</div>
                        ${c.description?`<div class="fh-hp-vault-desc">${m(c.description)}</div>`:""}
                        ${Ae(c)}
                        ${Be(c,t.person_id)}
                    </div>
                    ${b?"":`<div class="fh-hp-pts-seal" style="color:${re.emerald}">${O(c.points_cost)}pts</div>`}
                    ${Me(c,e,t.person_id)}
                    ${b?Fe(c,t.person_id,a):c.locked&&!_&&!(g&&u)?Re(c):g?u?`<span style="color:${re.emerald};font-size:.8rem;font-weight:700">Subscribed \u2713</span>`:_?`<span style="color:${re.emerald};font-size:.8rem;font-weight:700">Requested \u2713</span>`:`<button class="fh-hp-cast-btn ${v?"":"disabled"}"
                                       data-act="redeem"
                                       data-iid="${C(c.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       ${v?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                                   ${v?`Subscribe \xB7 ${c.points_cost}pts/${$}`:"Need more"}
                               </button>`:_?`<span style="color:${re.emerald};font-size:.8rem;font-weight:700">Requested \u2713</span>`:f?'<span style="color:var(--fh-overdue);font-size:.75rem;font-weight:600">Not available</span>':`<button class="fh-hp-cast-btn ${v?"":"disabled"}"
                                   data-act="redeem" data-iid="${C(c.item_id)}" data-pid="${C(t.person_id)}"
                                   ${v?"":'disabled style="opacity:.4;cursor:not-allowed"'}>
                               ${v?"Request":"Need more"}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${Te(e.subscriptions,a,i.history_log,t.person_id)}
        </div>
        </div>`}function xi(e,t){let o=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(i=>i.person_id===e.person_id);return o.length?`
        <div class="fh-hp-log">
            ${ce(o).slice(0,15).map(i=>i.isGroup?wi(i,t):yi(i.entry)).join("")}
        </div>`:'<div class="fh-hp-empty">No O.W.L. records yet.</div>'}function yi(e){let t=ie[e.type]||{label:e.type,color:re.mute},a=e.points_delta?`<span style="color:${e.points_delta>0?re.emerald:re.red};font-weight:700">
               ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"";return`
        <div class="fh-hp-log-row">
            <div class="fh-hp-log-type" style="color:${t.color}">${m(t.label)}</div>
            <div class="fh-hp-log-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a}
        </div>`}function wi(e,t){let a=t._expandedSkippedDates.has(e.key),o=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty";return`
        <div class="fh-hp-log-row"
             data-act="toggle-skipped-group" data-key="${C(e.key)}" style="cursor:pointer">
            <div class="fh-hp-log-type" style="color:${re.red}">Skipped</div>
            <div class="fh-hp-log-name">${m(e.dateDisplay)} \xB7 ${o}</div>
            <span style="color:${re.mute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(s=>`
            <div class="fh-hp-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-hp-log-type" style="color:${re.mute}">Item</div>
                <div class="fh-hp-log-name">${m(s.chore_name||"")}</div>
                ${s.points_delta?`<span style="color:${re.red};font-weight:700">${s.points_delta}pts</span>`:""}
                ${fe(s)}
            </div>`).join(""):""}`}var re,as,wt,ss,os=N(()=>{Q();K();et();re={bg:"#EFE0BA",panel:"#FAF0D7",ink:"#241914",mute:"#5A4020",emerald:"#1F4F3C",gold:"#C9A22A",crimson:"#6F1B26",red:"#A02020",green:"#2A5A20"},as={themeKey:"hp",leadFormat:(e,t)=>e.status==="pending_approval"||e._over?null:`P${t}`,btnLabel:"Cast \u2713",btnPendingLabel:"Pending Approval",reminderBtnLabel:"Dismiss",streakIcon:"\u26A1",statusFormat:{breach:e=>`Overdue ${e.days_overdue}d`,resetSoon:()=>"Resets 1d",firing:e=>`\u2212${e.penalty_points} house pts/d`,expiry:e=>e<=0?"Expires today":`Expires in ${e}d`},iconColor:()=>re.panel},wt=[{minXP:0,name:"First Year"},{minXP:100,name:"Second Year"},{minXP:300,name:"Prefect"},{minXP:700,name:"Head Student"},{minXP:1200,name:"Order of Phoenix"}],ss={key:"hp",tint:"#EFE0BA",sigil:"\u26A1",ranks:wt,handlesNavigation:!1,rankTitle(e){return U(e,wt).name},homeTileSubLabel(){return"HOGWARTS STUDENT"},render(e,t){var D;let a=t.child_mode?" kid-large":"",o=e._personEntityId(t.name),s=e._attrs(o),i=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((D=e._states(o))==null?void 0:D.state)||"0"),r=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:p}=ge(t,i,r),c=be(t.person_id,i.history_log,i.rank_eval_weekday),b=ue(t.person_id,i.history_log,i.rank_eval_weekday),g=ve(s),u=U(r,wt),v=new Date,_=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],f=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],$=`${_[v.getDay()]} \xB7 ${v.getDate()} ${f[v.getMonth()]}`,S=[{key:"tasks",label:"Classes",sub:"today's schedule"},{key:"store",label:"Honeydukes",sub:"reward shop"},{key:"history",label:"Pensieve",sub:"history"}],x=e._tab||"tasks",h=S.map(R=>`
            <div class="fh-hp-tab ${x===R.key?"active":""}"
                 data-act="tab" data-tab="${R.key}">${R.label}<span class="fh-hp-tab-sub">${R.sub}</span></div>`).join(""),w="";x==="tasks"&&(w=ui(s,t,i,e)),x==="store"&&(w=vi(s,t,n,e)),x==="history"&&(w=xi(t,e));let z=(s.tasks_due_today_list||[]).filter(R=>R.status==="pending").length,E=x==="tasks",F=E?pi({attr:s,naAttr:i,person:t,balance:n,weekly:c,lost:b,atRisk:g,openCount:z,rankIdx:r,dropThr:d,gainThr:p,rank:u,card:e}):"";return`
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
                            <div class="fh-hp-title-kicker">STUDENT \xB7 ${m(t.name.toUpperCase())} \xB7 ${m(u.name.toUpperCase())}</div>
                            <div class="fh-hp-title-main">${m(t.name)}</div>
                            <div class="fh-hp-title-sub">~ Daily Class Schedule \xB7 ${$} ~</div>
                        </div>
                        <div class="fh-hp-wax-seal">${j(t.name)}</div>
                    </div>
                </div>

                <div class="fh-hp-tabs">${h}</div>

                <div class="fh-hp-body ${E?"has-rail":""}">
                    <div class="fh-hp-body-main">${w}</div>
                    ${E?`<aside class="fh-hp-rail">${F}</aside>`:""}
                </div>

                <div class="fh-hp-footer"><span>By owl, this ${$} \xB7 Ops Year 2026</span><span>\xB7 Mischief Managed \xB7</span></div>
            </div>`}}});function ki({attr:e,naAttr:t,person:a,balance:o,weekly:s,lost:i,atRisk:n,openCount:r,rankIdx:d,dropThr:p,gainThr:c,nextItem:b,fillPct:g,card:u}){return`
        ${$i(o,s,i,n,r,e.show_dollar_value?e.dollar_value:null)}
        ${He(e)}
        ${Si(d,s,p,c,a,e)}
        ${Ei(e,t,a)}
        ${(()=>{let v=De(u._attrs("sensor.family_hub_claimable_tasks").tasks||[],a.person_id,{bare:!0});return v?qe("BONUS",v):""})()}
        ${(()=>{let v=ye(a,t,le.orange);return v?qe("ROTATION",v):""})()}
        ${_i(e,o,a.person_id)}
        ${Ci(b,g)}`}function qe(e,t){return`
        <div class="fh-dbz-rpanel">
            <div class="fh-dbz-rpanel-hdr">${e}</div>
            <div class="fh-dbz-rpanel-body">${t}</div>
        </div>`}function _i(e,t,a){let o=Ie(e.subscriptions,t,a);return o?qe("SUBSCRIPTIONS",o):""}function $i(e,t,a,o,s,i){let n=(d,p,c,b,g="")=>`
        <div class="fh-dbz-rkpi">
            <div class="fh-dbz-rkpi-lbl">${d}</div>
            <div class="fh-dbz-rkpi-val-row">
                <span class="fh-dbz-rkpi-val">${m(String(p))}</span>
                ${c?`<span class="fh-dbz-rkpi-unit">${c}</span>`:""}
            </div>
            ${b?`<div class="fh-rkpi-sub ${g}">${m(b)}</div>`:""}
        </div>`,r=`
        <div class="fh-dbz-rkpi-row">
            ${n("POWER",O(e),"\u26A1",i!=null?G(i):null)}
            ${n("WEEK",`+${t}`,"\u26A1",a>0?`\u2212${a} lost`:"0 lost","fh-rkpi-sub--loss")}
            ${n("OPEN",s,"",o>0?`\u2212${o} at risk`:null,"fh-rkpi-sub--loss")}
        </div>`;return qe("POWER LEVEL",r)}function Si(e,t,a,o,s,i){let n=xe(e,t,a,o,kt,le.orange,s),r=we(s,le.orange),d=ke(s),p=Se(i);return n?qe("NEXT FORM",n+r+d+p):qe("NEXT FORM",`<div class="fh-dbz-rmax">${m(U(e,kt).name)} \xB7 MAX</div>${r}${d}${p}`)}function Ei(e,t,a){let o=_e(e,t,a,8);if(!o.length)return qe("CHARGE STREAKS",'<div class="fh-dbz-rempty">NO CHARGE YET \u2014 TRAIN UP!</div>');let s=o.map(i=>{let{goalSegs:n,filledN:r,countLbl:d}=$e(i.streak,i.milestone,10),p=Array.from({length:n},(b,g)=>`<span class="fh-dbz-rbolt${g<r?"":" dim"}">\u26A1</span>`).join(""),c=i.milestone>0&&i.bonus>0?`<span class="fh-dbz-rbonus">\u2605+${i.bonus}</span>`:"";return`
            <div class="fh-dbz-rstreak">
                <div class="fh-dbz-rstreak-head">
                    <span class="fh-dbz-rstreak-name">${m(i.name)}</span>
                    ${c}
                </div>
                <div class="fh-dbz-rstreak-bar">
                    <span class="fh-dbz-rbolts">${p}</span>
                    <span class="fh-dbz-rstreak-num">${d}</span>
                </div>
            </div>`}).join("");return qe("CHARGE STREAKS",s)}function Ci(e,t){if(!e)return qe("NEXT POWER-UP",'<div class="fh-dbz-rempty">SHOP STOCKED \u2014 ASK A PARENT</div>');let a=`
        <div class="fh-dbz-rnext-name">${m(e.name)}</div>
        <div class="fh-dbz-rnext-cost">${O(e.points_cost)}\u26A1</div>
        <div class="fh-dbz-next-bar-track"><div class="fh-dbz-next-bar-fill" style="width:${t}%"></div></div>`;return qe("NEXT POWER-UP",a)}function zi(e,t,a,o){let s=e.tasks_due_today_list||[],i=e.tasks_overdue_list||[],n=e.tasks_pending_approval_list||[],r=a.category_labels||[],d=(_,f)=>{let $=new Map;for(let S of _)(!$.has(S.chore_id)||f(S,$.get(S.chore_id)))&&$.set(S.chore_id,S);return[...$.values()]},p=d(i,(_,f)=>(_.days_overdue||0)>(f.days_overdue||0)),c=d(s.filter(_=>_.chore_type!=="reminder"),()=>!1),b=[...p.map(_=>({..._,_over:!0})),...c];if(!b.length&&!n.length)return`
            <div class="fh-dbz-all-done">
                <div class="fh-dbz-all-done-icon">\u2B50</div>
                <div class="fh-dbz-all-done-text">ALL DONE!</div>
            </div>`;let u=Ne(b,r).map(_=>{let f=`<div class="fh-row-section-hdr">${m(_.label)}</div>`,$=_.tasks.map(S=>Y(S,is,t,o)).join("");return f+$}).join(""),v=n.length?`
        <div class="fh-row-section-hdr">WAITING FOR APPROVAL</div>
        ${n.map(_=>Y(_,is,t,o)).join("")}`:"";return`
        ${Ee(e)}
        ${Ce(e)}
        <div class="fh-row-list">
            ${u}
            ${v}
        </div>`}function Ai(e,t,a,o){let s=e.store_items||[];if(!s.length)return'<div class="fh-dbz-empty">No power-ups available yet!</div>';let i=o._attrs("sensor.family_hub_needs_attention"),n=(i.redemption_queue||[]).filter(c=>c.person_id===t.person_id),r=new Set(n.map(c=>c.item_id).filter(Boolean)),d=new Set(n.filter(c=>!c.item_id).map(c=>c.item_name)),p=new Set((e.subscriptions||[]).map(c=>c.item_id));return`
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${Pe(e.group_proposals,t.person_id)}
        ${ze(e)}
        <div class="fh-dbz-powerup-list">
            ${s.map(c=>{let b=!!c.is_group_reward,g=c.item_type==="subscription",u=g&&p.has(c.item_id),v=a>=c.points_cost,_=r.has(c.item_id)||d.has(c.name),f=!!c.next_available,$={weekly:"wk",monthly:"mo",quarterly:"qtr",biannual:"6mo",annual:"yr"}[c.subscription_period]||"mo";return`
                <div class="fh-dbz-powerup-row ${!b&&!g&&!v?"locked":""}">
                    ${me(c)}
                    <div class="fh-dbz-powerup-body">
                        <div class="fh-dbz-powerup-name">${m(c.name)}</div>
                        ${b?"":`<div class="fh-dbz-powerup-cost">${O(c.points_cost)}\u26A1</div>`}
                        ${Ae(c)}
                        ${Be(c,t.person_id)}
                    </div>
                    ${Me(c,e,t.person_id)}
                    ${b?Fe(c,t.person_id,a):c.locked&&!_&&!(g&&u)?Re(c):g?u?`<span style="color:${le.orange};font-weight:800;font-size:.9rem">SUB \u2713</span>`:_?`<span style="color:${le.orange};font-weight:800;font-size:.9rem">SENT \u2713</span>`:`<button class="fh-dbz-go-btn ${v?"":"locked"}"
                                       data-act="redeem"
                                       data-iid="${C(c.item_id)}"
                                       data-pid="${C(t.person_id)}"
                                       ${v?"":'disabled style="opacity:.35;cursor:not-allowed"'}>
                                   ${v?`SUB \xB7 ${c.points_cost}/${$}`:"NEED \u26A1"}
                               </button>`:_?`<span style="color:${le.orange};font-weight:800;font-size:.9rem">SENT \u2713</span>`:f?'<span style="color:var(--fh-overdue);font-weight:700;font-size:.8rem">NOT YET</span>':`<button class="fh-dbz-go-btn ${v?"":"locked"}"
                                   data-act="redeem" data-iid="${C(c.item_id)}" data-pid="${C(t.person_id)}"
                                   ${v?"":'disabled style="opacity:.35;cursor:not-allowed"'}>
                               ${v?"GET!":"NEED \u26A1"}
                           </button>`}
                </div>`}).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${Te(e.subscriptions,a,i.history_log,t.person_id)}
        </div>
        </div>`}function Mi(e,t){let o=(t._attrs("sensor.family_hub_needs_attention").history_log||[]).filter(i=>i.person_id===e.person_id);return o.length?`
        <div class="fh-dbz-log">
            ${ce(o).slice(0,12).map(i=>i.isGroup?Fi(i,t):Bi(i.entry)).join("")}
        </div>`:'<div class="fh-dbz-empty">No battles recorded yet!</div>'}function Bi(e){let t=ie[e.type]||{label:e.type,color:le.mute},a=e.points_delta?`<span style="color:${e.points_delta>0?le.orange:le.red};font-weight:800">
               ${e.points_delta>0?"+":""}${e.points_delta}\u26A1
           </span>`:"";return`
        <div class="fh-dbz-log-row">
            <div class="fh-dbz-log-type" style="color:${t.color}">${m(t.label)}</div>
            <div class="fh-dbz-log-name">${m(e.chore_name||e.note||"\u2014")}</div>
            ${a}
        </div>`}function Fi(e,t){let a=t._expandedSkippedDates.has(e.key),o=e.totalPenalty>0?`\u2212${e.totalPenalty}\u26A1`:"ok";return`
        <div class="fh-dbz-log-row"
             data-act="toggle-skipped-group" data-key="${C(e.key)}" style="cursor:pointer">
            <div class="fh-dbz-log-type" style="color:${le.red}">MISSED</div>
            <div class="fh-dbz-log-name">${m(e.dateDisplay)} \xB7 ${o}</div>
            <span style="color:${le.mute};font-size:.75rem">${a?"\u25B2":"\u25BC"}</span>
        </div>
        ${a?e.items.map(s=>`
            <div class="fh-dbz-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-dbz-log-type" style="color:${le.mute}">Item</div>
                <div class="fh-dbz-log-name">${m(s.chore_name||"")}</div>
                ${s.points_delta?`<span style="color:${le.red};font-weight:800">${s.points_delta}\u26A1</span>`:""}
                ${fe(s)}
            </div>`).join(""):""}`}var le,is,kt,ns,rs=N(()=>{Q();K();et();le={sky:"#3FAAD9",orange:"#FF6A1A",yellow:"#FFE03A",navy:"#0F1E2E",white:"#FFFFFF",mute:"rgba(15,30,46,.6)",red:"#CC2200"},is={themeKey:"dbz",btnLabel:"GO!",btnPendingLabel:"PENDING",reminderBtnLabel:"OK",streakIcon:"\u26A1",statusFormat:{breach:e=>`!OVERDUE ${e.days_overdue}D`,resetSoon:()=>"RESETS 1D",firing:e=>`\u2212${e.penalty_points}\u26A1/D`,expiry:e=>e<=0?"EXPIRES TODAY":`EXPIRES ${e}D`},iconColor:(e,t)=>t?le.red:le.navy},kt=[{minXP:0,name:"Saibaman"},{minXP:100,name:"Saiyan"},{minXP:300,name:"Super Saiyan"},{minXP:700,name:"SSJ2"},{minXP:1200,name:"SSJ Blue"}],ns={key:"dbz",tint:"#3FAAD9",sigil:"\u25CE",ranks:kt,handlesNavigation:!1,rankTitle(e){return U(e,kt).name},homeTileSubLabel(){return"SAIYAN WARRIOR"},render(e,t){var F;let a=t.child_mode?" kid-large":"",o=e._personEntityId(t.name),s=e._attrs(o),i=e._attrs("sensor.family_hub_needs_attention"),n=parseInt(((F=e._states(o))==null?void 0:F.state)||"0"),r=t.rank_index!==void 0?t.rank_index:0,{dropThr:d,gainThr:p}=ge(t,i,r),c=be(t.person_id,i.history_log,i.rank_eval_weekday),b=ue(t.person_id,i.history_log,i.rank_eval_weekday),g=ve(s),u=U(r,kt),v=[{key:"tasks",label:"\u{1F4AA} TRAIN"},{key:"store",label:"\u{1F48E} SHOP"},{key:"history",label:"\u{1F3C6} WINS"}],_=e._tab||"tasks",f=v.map(D=>`
            <div class="fh-dbz-tab ${_===D.key?"active":""}"
                 data-act="tab" data-tab="${D.key}">${D.label}</div>`).join(""),$="";_==="tasks"&&($=zi(s,t,i,e)),_==="store"&&($=Ai(s,t,n,e)),_==="history"&&($=Mi(t,e));let S=(s.tasks_due_today_list||[]).filter(D=>D.status==="pending").length,x=s.store_items||[],h=x.find(D=>D.points_cost>n)||x[0]||null,w=h?Math.min(100,Math.round(n/h.points_cost*100)):100,z=_==="tasks",E=z?ki({attr:s,naAttr:i,person:t,balance:n,weekly:c,lost:b,atRisk:g,openCount:S,rankIdx:r,dropThr:d,gainThr:p,nextItem:h,fillPct:w,card:e}):"";return`
            <div class="fh-dbz-page${a}">
                <div class="fh-dbz-speedlines"></div>
                <div class="fh-dbz-halftone"></div>

                <div class="fh-dbz-header">
                    <div class="fh-dbz-avatar">${j(t.name)}</div>
                    <div class="fh-dbz-identity">
                        <div class="fh-dbz-codename">SAIYAN TRAINEE \xB7 CODENAME KAMEHA</div>
                        <div class="fh-dbz-name">${m(t.name).toUpperCase()}</div>
                    </div>
                    <div class="fh-dbz-power-badge">
                        <div class="fh-dbz-power-num">${O(n)}</div>
                        <div class="fh-dbz-power-lbl">POWER</div>
                    </div>
                </div>

                <div class="fh-dbz-mission-strip">
                    <span class="fh-dbz-strip-label">ACTIVE MISSIONS:</span>
                    <span class="fh-dbz-strip-count">${S}</span>
                    ${g>0?`
                    <span class="fh-dbz-strip-label">\xB7 AT RISK:</span>
                    <span class="fh-dbz-strip-count" style="color:#FF5A4A">\u2212${g}\u26A1</span>`:""}
                </div>

                <div class="fh-dbz-tabs">${f}</div>

                <div class="fh-dbz-body ${z?"has-rail":""}">
                    <div class="fh-dbz-body-main">${$}</div>
                    ${z?`<aside class="fh-dbz-rail">${E}</aside>`:""}
                </div>

                ${z||!h?"":`
                <div class="fh-dbz-next-bar">
                    <span style="font-size:1.6rem">\u{1F3AF}</span>
                    <div class="fh-dbz-next-bar-body">
                        <div class="fh-dbz-next-bar-lbl">NEXT POWER-UP</div>
                        <div class="fh-dbz-next-bar-name">${m(h.name)} \xB7 ${O(h.points_cost)}\u26A1</div>
                        <div class="fh-dbz-next-bar-track"><div class="fh-dbz-next-bar-fill" style="width:${w}%"></div></div>
                    </div>
                </div>`}
            </div>`}}});function tt(e){return ls[e]||ls.classic}var ls,_t=N(()=>{qa();Va();Qa();ts();os();rs();ls={classic:Ua,engineer:Ka,baker:Xa,dinos:es,hp:ss,dbz:ns}});function oa(e){let t=e._findPerson(e._viewPersonId||e._cfg.person);return t?tt(t.theme_key||"classic").render(e,t):`<div class="fh-empty">Person "${e._viewPersonId||e._cfg.person||"(unknown)"}" not found.<br>Check spelling in card config.</div>`}var ds=N(()=>{_t()});function ps(e){let t=e._attrs("sensor.family_hub_claimable_tasks"),a=e._attrs("sensor.family_hub_needs_attention"),o=e._people().filter(F=>F.active!==!1),s=t.all_tasks||[],i=t.tasks||[],n=a.approval_queue||[],r=a.category_labels||[],d=!!a.penalties_paused_global,p=a.family_name||"Family Hub";e._mcLastTasks||(e._mcLastTasks=new Map);let c=new Set(s.map(F=>F.task_id));for(let F of s)e._mcLastTasks.set(F.task_id,F);let b=e._pendingSubmit||new Set,g=[];for(let F of b)!c.has(F)&&e._mcLastTasks.has(F)&&g.push({...e._mcLastTasks.get(F),_phantom:!0});let u=[...s,...g],v=new Map(o.map(F=>[F.person_id,F])),_=F=>{let D=v.get(F.assigned_to);return{...F,_agentColor:(D==null?void 0:D.avatar_color)||H,_agentCode:((D==null?void 0:D.code)||(D==null?void 0:D.name)||"?").toUpperCase(),_agentName:(D==null?void 0:D.name)||"?",_agentPersonId:(D==null?void 0:D.person_id)||F.assigned_to}},f=(e._filter?u.filter(F=>F.assigned_to===e._filter):u).map(_),$=f.filter(F=>F.days_delta<0),S=f.filter(F=>F.days_delta>=0),x=cs($),h=cs(S),w=x.length+h.length,z=n.length,E=Ri();return`
        <div class="fh-mc">
            ${Di(p,w,z,E,d)}
            <div class="fh-mc-body">
                <main class="fh-mc-main">
                    ${Ii(o,u,n,e)}
                    ${Ti(x,e)}
                    ${Pi(h,r,e)}
                    ${!x.length&&!h.length?`<div class="fh-mc-empty">
                               <div class="fh-mc-empty-title">\u2713 ALL MISSIONS COMPLETE</div>
                               <div class="fh-mc-empty-sub">HQ STANDING DOWN \xB7 NICE WORK</div>
                           </div>`:""}
                </main>
                <aside class="fh-mc-sidebar">
                    ${Li(n)}
                    ${Oi(i)}
                    ${Ni(o,a)}
                </aside>
            </div>
        </div>
    `}function cs(e){let t=new Map;for(let a of e){let o=a.chore_id||a.task_id;t.has(o)||t.set(o,{chore_id:a.chore_id,name:a.name,icon:a.icon,description:a.description,category_label:a.category_label,points:a.points,penalty_enabled:a.penalty_enabled,penalty_points:a.penalty_points,daily_penalty_firing:a.daily_penalty_firing,days_until_reset:a.days_until_reset,recurrence_type:a.recurrence_type,anyBreach:!1,maxOverdue:0,assignees:[]});let s=t.get(o),i=a.days_delta<0;i&&(s.anyBreach=!0,s.maxOverdue=Math.max(s.maxOverdue,Math.abs(a.days_delta))),a.daily_penalty_firing&&(s.daily_penalty_firing=!0),s.assignees.push({person_id:a._agentPersonId,task_id:a.task_id,color:a._agentColor,code:a._agentCode,name:a._agentName,streak:a.streak||0,milestone:a.streak_milestone||0,status:a.status,days_overdue:i?Math.abs(a.days_delta):0,isBreach:i,isPhantom:!!a._phantom})}return[...t.values()]}function Ri(){let e=new Date(2025,8,1);return Math.max(1,Math.floor((Date.now()-e.getTime())/864e5))}function Di(e,t,a,o,s){let i=new Date,n=i.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}).toUpperCase(),r=i.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1});return`
        <header class="fh-mc-header">
            <div class="fh-mc-brand">
                <div class="fh-mc-logo">FH</div>
                <div class="fh-mc-wordmark">
                    <div class="fh-mc-wordmark-name">${m(e).toUpperCase()}</div>
                    <div class="fh-mc-wordmark-tag">OPERATIONS \xB7 COMMAND</div>
                </div>
            </div>
            ${s?'<div class="fh-mc-ops-paused">OPS PAUSED</div>':""}
            <div class="fh-mc-stats">
                ${ia("MISSIONS LIVE",t,"cyan")}
                ${ia("INTEL ALERTS",a,a>0?"red":"green",a>0)}
                ${ia("OPS DAY",o,"gold")}
                <div class="fh-mc-clock">
                    <div class="fh-mc-stat-lbl">${n}</div>
                    <div class="fh-mc-clock-num">${r}</div>
                </div>
            </div>
        </header>
    `}function ia(e,t,a,o=!1){return`
        <div class="fh-mc-stat" data-accent="${a}">
            <div class="fh-mc-stat-lbl">${e}</div>
            <div class="fh-mc-stat-val">
                ${o?'<span class="fh-mc-pulse"></span>':""}
                <span class="fh-mc-stat-num">${t}</span>
            </div>
        </div>
    `}function Ii(e,t,a,o){if(!e.length)return"";let s=e.map(i=>{var $;let n=i.avatar_color||H,r=o._filter===i.person_id,d=o._filter&&!r,p=t.filter(S=>S.assigned_to===i.person_id).length,c=a.filter(S=>S.person_id===i.person_id).length,b=(i.code||i.name||"AGT").toUpperCase(),g=parseInt((($=o._states(o._personEntityId(i.name)))==null?void 0:$.state)||"0"),u=i.completion_milestone||0,v=i.completion_streak||0,_=i.completion_threshold_pct||80,f=u>0&&v>0?`<div class="fh-mc-agent-streak" title="${_}% of daily chores for ${v} days running">
                   \u{1F525} ${v}d \xB7 ${_}%
               </div>`:"";return`
            <button class="fh-mc-agent ${r?"active":""} ${d?"dim":""}"
                    style="--agent-color:${n}"
                    data-act="filter" data-pid="${C(i.person_id)}">
                <div class="fh-mc-agent-head">
                    <div class="fh-mc-agent-avatar">
                        ${j(i.name)}
                        ${c>0?`<span class="fh-mc-agent-alert">${c}</span>`:""}
                    </div>
                    <div class="fh-mc-agent-id">
                        <div class="fh-mc-agent-code">${m(b)}</div>
                        <div class="fh-mc-agent-name">${m(i.name)}</div>
                    </div>
                </div>
                ${f}
                <div class="fh-mc-agent-foot">
                    <span class="fh-mc-agent-bal">${O(g)}<span class="fh-mc-agent-lbl">pts</span></span>
                    <span class="fh-mc-agent-open ${p>0?"live":""}">${p} OPEN</span>
                </div>
            </button>
        `}).join("");return`
        <section class="fh-mc-panel">
            <div class="fh-mc-panel-hdr">
                <span class="fh-mc-panel-lbl">// AGENT ROSTER</span>
                <span class="fh-mc-panel-sub">${e.length} ON DUTY</span>
            </div>
            <div class="fh-mc-roster">${s}</div>
        </section>
    `}function Ti(e,t){return e.length?`
        <section class="fh-mc-missions">
            ${fs("BREACH ALERT",`${e.length} CHORE${e.length>1?"S":""} PAST RESET`,"red",!0)}
            <div class="fh-row-list">
                ${e.map(a=>hs(a,t)).join("")}
            </div>
        </section>
    `:""}function Pi(e,t,a){if(!e.length)return"";let o=new Map(t.map((n,r)=>[n,r])),s=new Map;for(let n of e){let r=n.category_label||"";s.has(r)||s.set(r,[]),s.get(r).push(n)}return[...s.keys()].sort((n,r)=>{if(n===""&&r!=="")return 1;if(n!==""&&r==="")return-1;let d=o.has(n)?o.get(n):1/0,p=o.has(r)?o.get(r):1/0;return d!==p?d-p:n.localeCompare(r)}).map(n=>{let r=s.get(n)||[];return`
            <section class="fh-mc-missions">
                ${n?fs(n.toUpperCase(),`${r.length} ACTIVE`,"gold"):""}
                <div class="fh-row-list">
                    ${r.map(p=>hs(p,a)).join("")}
                </div>
            </section>
        `}).join("")}function hs(e,t){var c;let a=String(e.chore_id||"").slice(0,4).toUpperCase(),o="";e.anyBreach?o=`<span class="fh-row-chip fh-row-chip--breach">BREACH \xB7 ${e.maxOverdue}D</span>`:e.days_until_reset===1&&(o='<span class="fh-row-chip fh-row-chip--reset">RESETS 1D</span>'),e.daily_penalty_firing&&(o+=`<span class="fh-row-chip fh-row-chip--firing">ACCRUING \u2212${e.penalty_points}/D</span>`);let s=o?`<div class="fh-row-chips">${o}</div>`:'<div class="fh-row-chips"></div>',i=e.description?`<div class="fh-row-desc">${m(e.description)}</div>`:"",n=e.penalty_enabled&&e.penalty_points>0?`<div class="fh-row-penalty">\u2212${e.penalty_points}pts if skipped</div>`:"",r=e.assignees.map(b=>{var v;let g=((v=t._pendingSubmit)==null?void 0:v.has(b.task_id))||b.status==="pending_approval"||b.isPhantom,u=["fh-mc-go-mini"];return b.isBreach&&u.push("breach"),g&&u.push("pending"),g?`
                <div class="${u.join(" ")}"
                     style="--mc-accent:${b.color}"
                     aria-disabled="true"
                     title="Pending approval \u2014 ${C(b.name)}">
                    <span class="fh-mc-go-code">${m(b.code)}</span>
                    <span class="fh-mc-go-check">\u23F1</span>
                </div>`:`
            <button class="${u.join(" ")}"
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
            </button>`}).join(""),d=((c=e.assignees[0])==null?void 0:c.color)||H;return`
        <div class="fh-row fh-row--mc${e.assignees.some(b=>{var g;return(g=t._flashing)==null?void 0:g.has(b.task_id)})?" flash":""}${e.anyBreach?" overdue":""}"
             style="--mc-accent:${d}">
            <div class="fh-row-icon">${pe(e.icon||"",d)}</div>
            <div class="fh-row-body">
                <div class="fh-row-kicker">OP-${a}</div>
                <div class="fh-row-name">${m(e.name)}</div>
                ${i}
                ${n}
            </div>
            ${s}
            <div class="fh-row-pts">+${e.points||0}</div>
            <div class="fh-mc-go-group">${r}</div>
        </div>
    `}function fs(e,t,a,o=!1){return`
        <div class="fh-mc-section-hdr" data-accent="${a}">
            ${o?'<span class="fh-mc-pulse"></span>':""}
            <span class="fh-mc-section-lbl">// ${m(e)}</span>
            <span class="fh-mc-section-rule"></span>
            ${t?`<span class="fh-mc-section-sub">${m(t)}</span>`:""}
        </div>
    `}function Li(e){if(!e.length)return`
            <section class="fh-mc-panel fh-mc-panel--quiet">
                <div class="fh-mc-panel-hdr">
                    <span class="fh-mc-panel-lbl" data-accent="green">// INTEL ALERTS</span>
                    <span class="fh-mc-panel-sub">ALL CLEAR</span>
                </div>
            </section>
        `;let t=e.map(a=>{let o=a.person_color||H,s=(a.person_code||a.person_name||"?").slice(0,6).toUpperCase();return`
            <div class="fh-mc-intel-row" style="--mc-accent:${o}">
                <div class="fh-mc-intel-avatar">${j(a.person_name||"?")}</div>
                <div class="fh-mc-intel-body">
                    <div class="fh-mc-intel-code">${m(s)}</div>
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
    `}function Oi(e){return e.length?`
        <section class="fh-mc-panel">
            <div class="fh-mc-panel-hdr">
                <span class="fh-mc-panel-lbl" data-accent="cyan">// OPEN OPS</span>
                <span class="fh-mc-panel-sub">UNCLAIMED \xB7 FIRST IN WINS</span>
            </div>
            <div class="fh-mc-ops-list">${e.map(a=>{let o=String(a.chore_id||a.task_id||"").slice(0,4).toUpperCase();return`
            <div class="fh-mc-ops-row">
                <div class="fh-mc-ops-kicker">${a.claim_mode==="multi_claim"?"MULTI":"FCFS"} \xB7 OP-${o}</div>
                <div class="fh-mc-ops-icon">${pe(a.icon||"","var(--mc-cyan)","22px")}</div>
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
        `}function Ni(e,t){let o=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1}),s=e.reduce((n,r)=>{let d=parseInt(r.lifetime_points||0);return n+(isNaN(d)?0:d)},0),i=(t.store_items||[]).length;return`
        <div class="fh-mc-status">
            <div class="fh-mc-status-row"><span class="fh-mc-status-dot ok"></span>LINK \xB7 STABLE</div>
            <div class="fh-mc-status-row">SYNC \xB7 ${o}</div>
            <div class="fh-mc-status-row">FAMILY \xB7 ${e.length} AGENTS \xB7 ${O(s)}PTS</div>
            <div class="fh-mc-status-row">STORE \xB7 ${i} REWARDS LIVE</div>
        </div>
    `}function ms(e){return`
        <div class="fh-celebration-overlay" data-act="dismiss-celebration">
            <div class="fh-celebration-badge">
                <div class="fh-celebration-star">\u2605</div>
                <div class="fh-celebration-title">MILESTONE!</div>
                <div class="fh-celebration-streak">\u25B2 ${e.streak}</div>
                <div class="fh-celebration-name">${m(e.name)}</div>
            </div>
        </div>
    `}var na=N(()=>{ut();Q();K()});function Dt(e){let t=e._attrs("sensor.family_hub_maintenance_due"),a=t.overdue||0,o=t.due_this_week||0,s=t.due_next_week||0,i=t.items||[],n=`
        <div class="fh-maint-head">
            <div class="fh-maint-title">HOME CARE</div>
        </div>`;if(!i.length)return n+`
            <div class="fh-maint-empty">
                <div class="fh-maint-empty-icon">\u{1F3E0}</div>
                <div class="fh-maint-empty-text">All caught up!</div>
                <div class="fh-maint-empty-sub">Nothing due in the next 14 days.</div>
            </div>`;let r=`
        <div class="fh-maint-stat-strip">
            <div class="fh-maint-stat ${a?"fh-maint-stat--bad":""}">
                <span class="fh-maint-stat-num">${a}</span>
                <span class="fh-maint-stat-lbl">overdue</span>
            </div>
            <div class="fh-maint-stat-div"></div>
            <div class="fh-maint-stat">
                <span class="fh-maint-stat-num">${o}</span>
                <span class="fh-maint-stat-lbl">this week</span>
            </div>
            <div class="fh-maint-stat-div"></div>
            <div class="fh-maint-stat">
                <span class="fh-maint-stat-num">${s}</span>
                <span class="fh-maint-stat-lbl">next week</span>
            </div>
        </div>`,d=i.filter(u=>u.days_delta<0),p=i.filter(u=>u.days_delta>=0&&u.days_delta<=7),c=i.filter(u=>u.days_delta>7),g=[{label:"OVERDUE",items:d,cls:"overdue"},{label:"DUE THIS WEEK",items:p,cls:"this-week"},{label:"DUE NEXT WEEK",items:c,cls:"next-week"}].filter(u=>u.items.length).map(({label:u,items:v,cls:_})=>`
        <div class="fh-maint-section">
            <div class="fh-maint-section-hdr ${_}">
                ${u}
                <span class="fh-maint-section-count">${v.length}</span>
            </div>
            ${v.map(f=>Hi(f,e)).join("")}
        </div>`).join("");return n+r+g}function Hi(e,t){let a=t._expandedDescs.has(e.task_id),o=e.days_delta<0?"overdue":e.days_delta<=7?"soon":"ok";return`
        <div class="fh-maint-row ${o}">
            ${e.person_name?`<div class="fh-avatar" style="background:${e.person_color||H};width:26px;height:26px;font-size:.72rem;flex-shrink:0">${j(e.person_name)}</div>`:""}
            <div class="fh-maint-row-body">
                <div class="fh-maint-row-name">${m(e.name)}</div>
                ${a&&e.description?`<div class="fh-maint-row-desc">${m(e.description)}</div>`:""}
            </div>
            ${e.description?`<button class="fh-desc-btn" data-act="toggle-desc" data-id="${e.task_id}" title="Toggle description">?</button>`:""}
            <span class="fh-maint-days-badge ${o}">${Oa(e.days_delta)}</span>
        </div>`}var ra=N(()=>{Q();K()});function gs(e){return`
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#30d158">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#30d158">SMART HOME</div>
            <div class="fh-home-coming-sub">Lights, climate &amp; more</div>
            <div class="fh-room-feature-list">
                ${It("\u{1F4A1}","Lighting Control","Toggle and dim lights by room from the kitchen display")}
                ${It("\u{1F321}\uFE0F","Climate","View and adjust the thermostat without leaving the kitchen")}
                ${It("\u{1F4A7}","Irrigation","Run or skip watering zones on demand")}
                ${It("\u{1F512}","Kid-safe Access","Only controls approved for the kitchen display are shown")}
            </div>
            <div class="fh-home-coming-badge">COMING SOON</div>
        </div>`}function It(e,t,a){return`
        <div class="fh-room-feature">
            <div class="fh-room-feature-icon">${e}</div>
            <div class="fh-room-feature-body">
                <div class="fh-room-feature-name">${t}</div>
                <div class="fh-room-feature-desc">${a}</div>
            </div>
        </div>`}var bs=N(()=>{});var jt={};bo(jt,{AISLES:()=>nt,DOW:()=>Pt,DOW_SHORT:()=>rt,GROUPS:()=>Le,GROUP_ORDER:()=>Xe,HEALTHY_FAT_FOODS:()=>Gi,HEALTHY_FAT_INGS:()=>ji,HORIZON_DAYS:()=>St,IDEAS_POOL:()=>us,INGREDIENTS:()=>la,ING_SECTIONS:()=>pt,MEALS:()=>da,MON:()=>Lt,MON_SHORT:()=>ht,PASTA_ROTATION:()=>Wi,PIZZA_ROTATION:()=>ca,PROTEINS:()=>de,PROTEIN_ORDER:()=>$t,SIDES:()=>at,THEMES:()=>Tt,addDays:()=>Je,allMeals:()=>ot,dinnerGroups:()=>Nt,fetchRecipeIdeas:()=>qi,fmtDayLong:()=>mt,fmtDayShort:()=>fa,getIngredients:()=>Oe,getRecipe:()=>Ke,ingById:()=>xs,iso:()=>Z,mealById:()=>V,mealHealthyFats:()=>pa,mealIngredients:()=>Ot,mealWholeGrain:()=>ha,nextEmptyDinner:()=>ma,parseISO:()=>ft,rankIdeas:()=>Ht,sideById:()=>it,startOfWeek:()=>Et,today:()=>st,variantFor:()=>Ui,weekIdx:()=>vs});function Z(e){return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0")}function ft(e){let t=e.split("-");return new Date(+t[0],+t[1]-1,+t[2])}function Je(e,t){let a=new Date(e.getFullYear(),e.getMonth(),e.getDate());return a.setDate(a.getDate()+t),a}function st(){let e=new Date;return new Date(e.getFullYear(),e.getMonth(),e.getDate())}function Et(e,t){return Je(e,-((e.getDay()-t+7)%7))}function vs(e){return Math.floor((e.getTime()/864e5+4)/7)}function ot(e){return e&&e.length?da.concat(e):da}function V(e,t){return ot(t).find(a=>a.id===e)||null}function it(e){return at.find(t=>t.id===e)||null}function Oe(e){return e&&e.length?la.concat(e):la}function xs(e,t){return Oe(t).find(a=>a.id===e)||null}function Ke(e,t){return t&&e&&t[e.id]||e&&e.recipe||null}function Ot(e,t){if(!e)return[];let a=(e.ing||[]).slice();if(e.proteinPick){let o=t&&t.protein||e.defaultPick,s=e.proteinIng[o];s&&a.indexOf(s)===-1&&(a=a.concat(s))}return a}function pa(e){if(!e)return[];let t={eggs:"eggs",cheese:"full-fat dairy",milk:"full-fat dairy"},a=[];return(e.ing||[]).forEach(o=>{t[o]&&a.indexOf(t[o])===-1&&a.push(t[o])}),a}function ha(e,t){if(!e||(e.groups||[]).indexOf("grain")===-1)return!1;let a=(e.ing||[]).map(o=>xs(o,t)).filter(o=>o&&o.cat==="grain");return a.length?a.every(o=>o.whole):!1}function Nt(e,t){if(!e)return[];let a=new Set,o=V(e.main,t);return o&&(o.groups||[]).forEach(s=>a.add(s)),(e.sides||[]).forEach(s=>{let i=it(s);i&&i.groups.forEach(n=>a.add(n))}),[...a]}function mt(e){return`${Pt[e.getDay()]}, ${Lt[e.getMonth()]} ${e.getDate()}`}function fa(e){return`${rt[e.getDay()]} ${e.getDate()}`}function ma(e){let t=st();for(let a=0;a<St;a++){let o=Je(t,a),s=e[Z(o)];if(!s||!s.d)return o}return null}function Ui(e,t,a){return e?e.rotates?ca[vs(t)%ca.length]:e.proteinPick&&a?`with ${de[a].label.toLowerCase()}`:"":""}function Ht(e){let t=e||[];return us.map(a=>({idea:a,hits:a.ing.filter(o=>t.indexOf(o)!==-1)})).sort((a,o)=>o.hits.length-a.hits.length)}function qi(e){return Promise.resolve(Ht(e))}var Le,Xe,de,$t,nt,la,pt,at,da,us,ji,Gi,ca,Wi,Tt,Pt,rt,Lt,ht,St,Ct=N(()=>{Le={protein:{label:"Protein",color:"#8B3A2A",icon:"\u{1F357}"},veg:{label:"Veggies",color:"#3A6A28",icon:"\u{1F966}"},grain:{label:"Grains",color:"#B07818",icon:"\u{1F33E}"},fruit:{label:"Fruit",color:"#A02828",icon:"\u{1F34E}"},dairy:{label:"Dairy",color:"#5D7A8C",icon:"\u{1F95B}"}},Xe=["protein","veg","grain","fruit","dairy"],de={beef:{label:"Beef",glyph:"\u{1F969}",cuts:[{id:"ground",label:"Ground beef"},{id:"steak",label:"Steak"},{id:"roast",label:"Roast & stew meat"},{id:"brisket",label:"Brisket"}]},chicken:{label:"Chicken",glyph:"\u{1F357}",cuts:[{id:"breasts",label:"Breasts"},{id:"thighs",label:"Thighs"},{id:"whole",label:"Whole bird"}]},pork:{label:"Pork",glyph:"\u{1F953}",cuts:[{id:"chops",label:"Chops"},{id:"pulled",label:"Shoulder / pulled"},{id:"bacon",label:"Bacon & sausage"}]},turkey:{label:"Turkey",glyph:"\u{1F983}",cuts:[{id:"ground",label:"Ground turkey"},{id:"deli",label:"Deli sliced"}]},meatless:{label:"Meatless",glyph:"\u{1FAD8}",cuts:[{id:"eggs",label:"Eggs"},{id:"beans",label:"Beans & lentils"},{id:"cheesepasta",label:"Pasta & cheese"}]}},$t=["beef","chicken","pork","turkey","meatless"],nt={produce:"Produce",meat:"Meat & Seafood",dairy:"Dairy & Eggs",bakery:"Bakery",pantry:"Pantry"},la=[{id:"chicken",label:"Chicken",glyph:"\u{1F357}",aisle:"meat",cat:"protein"},{id:"gbeef",label:"Ground beef",glyph:"\u{1F969}",aisle:"meat",cat:"protein"},{id:"pork",label:"Pork",glyph:"\u{1F953}",aisle:"meat",cat:"protein"},{id:"turkey",label:"Turkey",glyph:"\u{1F983}",aisle:"meat",cat:"protein"},{id:"eggs",label:"Eggs",glyph:"\u{1F95A}",aisle:"dairy",cat:"protein"},{id:"beans",label:"Beans",glyph:"\u{1FAD8}",aisle:"pantry",cat:"protein"},{id:"potatoes",label:"Potatoes",glyph:"\u{1F954}",aisle:"produce",cat:"veg"},{id:"greens",label:"Salad greens",glyph:"\u{1F96C}",aisle:"produce",cat:"veg"},{id:"broccoli",label:"Broccoli",glyph:"\u{1F966}",aisle:"produce",cat:"veg"},{id:"tomatoes",label:"Tomatoes",glyph:"\u{1F345}",aisle:"produce",cat:"veg"},{id:"carrots",label:"Carrots",glyph:"\u{1F955}",aisle:"produce",cat:"veg"},{id:"corn",label:"Corn",glyph:"\u{1F33D}",aisle:"produce",cat:"veg"},{id:"onions",label:"Onions",glyph:"\u{1F9C5}",aisle:"produce",cat:"veg"},{id:"fruit",label:"Fruit",glyph:"\u{1F34E}",aisle:"produce",cat:"fruit"},{id:"tortillas",label:"Tortillas",glyph:"\u{1FAD3}",aisle:"bakery",cat:"grain",whole:!0},{id:"bread",label:"Bread",glyph:"\u{1F35E}",aisle:"bakery",cat:"grain",whole:!0},{id:"pasta",label:"Pasta",glyph:"\u{1F35D}",aisle:"pantry",cat:"grain",whole:!0},{id:"rice",label:"Rice",glyph:"\u{1F35A}",aisle:"pantry",cat:"grain",whole:!0},{id:"cheese",label:"Cheese",glyph:"\u{1F9C0}",aisle:"dairy",cat:"dairy"},{id:"milk",label:"Milk",glyph:"\u{1F95B}",aisle:"dairy",cat:"dairy"}],pt=[["protein","Proteins"],["veg","Veggies"],["fruit","Fruit"],["grain","Grains & starches"],["dairy","Dairy"]],at=[{id:"side-salad",name:"Garden Salad",glyph:"\u{1F957}",groups:["veg"],ing:["greens","tomatoes"],pairs:["beef","meatless","chicken"]},{id:"broc-side",name:"Roasted Broccoli",glyph:"\u{1F966}",groups:["veg"],ing:["broccoli"],pairs:["chicken","beef"]},{id:"green-beans",name:"Green Beans",glyph:"\u{1FADB}",groups:["veg"],ing:[],pairs:["chicken","pork","beef"]},{id:"corn-cob",name:"Corn on the Cob",glyph:"\u{1F33D}",groups:["veg"],ing:["corn"],pairs:["beef","chicken","pork","turkey"]},{id:"carrots-side",name:"Glazed Carrots",glyph:"\u{1F955}",groups:["veg"],ing:["carrots"],pairs:["chicken","pork"]},{id:"mashed",name:"Mashed Potatoes",glyph:"\u{1F954}",groups:["veg"],ing:["potatoes","milk"],pairs:["beef","chicken","pork","turkey"]},{id:"fries",name:"Oven Fries",glyph:"\u{1F35F}",groups:["veg"],ing:["potatoes"],pairs:["beef","turkey"]},{id:"coleslaw",name:"Coleslaw",glyph:"\u{1F96C}",groups:["veg"],ing:["greens","carrots"],pairs:["pork","turkey"]},{id:"rice-side",name:"Steamed Rice",glyph:"\u{1F35A}",groups:["grain"],ing:["rice"],pairs:["chicken","meatless"]},{id:"garlic-bread",name:"Garlic Bread",glyph:"\u{1F956}",groups:["grain"],ing:["bread"],pairs:["meatless","beef"]},{id:"cornbread",name:"Cornbread",glyph:"\u{1FAD3}",groups:["grain"],ing:[],pairs:["beef","pork"]},{id:"beans-side",name:"Refried Beans",glyph:"\u{1FAD8}",groups:["protein"],ing:["beans"],pairs:["beef","chicken","meatless"]},{id:"fruit-salad",name:"Fruit Salad",glyph:"\u{1F353}",groups:["fruit"],ing:["fruit"],pairs:["turkey","chicken","meatless"]},{id:"apple-slices",name:"Apple Slices",glyph:"\u{1F34E}",groups:["fruit"],ing:["fruit"],pairs:["pork","meatless"]},{id:"milk-glass",name:"Milk",glyph:"\u{1F95B}",groups:["dairy"],ing:["milk"],pairs:[]},{id:"yogurt-cup",name:"Yogurt Cups",glyph:"\u{1F368}",groups:["dairy"],ing:["milk"],pairs:[]},{id:"roasted-veg",name:"Roasted Veggies",glyph:"\u{1FAD1}",groups:["veg"],ing:["onions","carrots"],pairs:["beef","chicken","pork"]},{id:"baked-potato",name:"Baked Potato",glyph:"\u{1F954}",groups:["veg"],ing:["potatoes"],pairs:["beef","chicken"]},{id:"sweet-potato",name:"Baked Sweet Potato",glyph:"\u{1F360}",groups:["veg"],ing:[],pairs:["pork","turkey","chicken"]},{id:"asparagus",name:"Roasted Asparagus",glyph:"\u{1F33F}",groups:["veg"],ing:[],pairs:["chicken","beef"]},{id:"peas",name:"Buttered Peas",glyph:"\u{1F7E2}",groups:["veg"],ing:[],pairs:["chicken","turkey","beef"]},{id:"brussels",name:"Brussels Sprouts",glyph:"\u{1F96C}",groups:["veg"],ing:[],pairs:["pork","beef","chicken"]},{id:"dinner-rolls",name:"Dinner Rolls",glyph:"\u{1F950}",groups:["grain"],ing:["bread"],pairs:["beef","chicken","turkey"]},{id:"buttered-noodles",name:"Buttered Noodles",glyph:"\u{1F35D}",groups:["grain"],ing:["pasta"],pairs:["beef","chicken"]},{id:"biscuits",name:"Biscuits",glyph:"\u{1FAD3}",groups:["grain"],ing:[],pairs:["pork","chicken"]},{id:"quinoa",name:"Quinoa",glyph:"\u{1F35A}",groups:["grain"],ing:[],pairs:["chicken","meatless"]},{id:"grapes",name:"Grapes",glyph:"\u{1F347}",groups:["fruit"],ing:["fruit"],pairs:["turkey","chicken","meatless"]},{id:"orange-slices",name:"Orange Slices",glyph:"\u{1F34A}",groups:["fruit"],ing:["fruit"],pairs:["pork","chicken"]},{id:"berries",name:"Mixed Berries",glyph:"\u{1FAD0}",groups:["fruit"],ing:["fruit"],pairs:["chicken","meatless"]},{id:"watermelon",name:"Melon Wedges",glyph:"\u{1F349}",groups:["fruit"],ing:[],pairs:["turkey","meatless"]},{id:"cheese-cubes",name:"Cheese Cubes",glyph:"\u{1F9C0}",groups:["dairy"],ing:["cheese"],pairs:[]},{id:"cottage-cheese",name:"Cottage Cheese",glyph:"\u{1F963}",groups:["dairy"],ing:["milk"],pairs:[]},{id:"eggs-side",name:"Hard-Boiled Eggs",glyph:"\u{1F95A}",groups:["protein"],ing:["eggs"],pairs:["meatless"]},{id:"edamame",name:"Edamame",glyph:"\u{1FADB}",groups:["protein"],ing:[],pairs:["chicken","meatless"]},{id:"hummus",name:"Hummus & Veggies",glyph:"\u{1F9C6}",groups:["protein","veg"],ing:["beans","carrots"],pairs:["meatless","chicken"]}],da=[{id:"eggs-toast",name:"Scrambled Eggs & Toast",glyph:"\u{1F373}",types:["b"],groups:["protein","grain"],ing:["eggs","bread"],fav:!0},{id:"oatmeal",name:"Oatmeal & Berries",glyph:"\u{1F963}",types:["b"],groups:["grain","fruit"],ing:["fruit"],fav:!0},{id:"pancakes",name:"Pancake Morning",glyph:"\u{1F95E}",types:["b"],groups:["grain"],ing:["eggs","milk"],fav:!1},{id:"yogurt",name:"Yogurt & Granola",glyph:"\u{1FAD0}",types:["b"],groups:["dairy","grain","fruit"],ing:["milk","fruit"],fav:!1},{id:"bfast-burritos",name:"Breakfast Burritos",glyph:"\u{1F32F}",types:["b"],groups:["protein","grain","dairy"],ing:["eggs","tortillas","cheese"],fav:!1},{id:"smoothies",name:"Fruit Smoothies",glyph:"\u{1F964}",types:["b"],groups:["fruit","dairy"],ing:["fruit","milk"],fav:!1},{id:"french-toast",name:"French Toast",glyph:"\u{1F35E}",types:["b"],groups:["grain","dairy"],ing:["bread","eggs","milk"],fav:!1},{id:"cereal",name:"Cereal & Fruit",glyph:"\u{1F95B}",types:["b"],groups:["grain","dairy","fruit"],ing:["milk","fruit"],fav:!1},{id:"turkey-sand",name:"Turkey Sandwiches",glyph:"\u{1F96A}",types:["l"],groups:["protein","grain","veg"],ing:["turkey","bread","cheese","greens"],fav:!0,protein:"turkey",cut:"deli"},{id:"grilled-cheese",name:"Grilled Cheese & Soup",glyph:"\u{1F9C0}",types:["l"],groups:["grain","dairy","veg"],ing:["bread","cheese","tomatoes"],fav:!1,protein:"meatless",cut:"cheesepasta"},{id:"quesadillas",name:"Cheese Quesadillas",glyph:"\u{1FAD3}",types:["l"],groups:["grain","dairy"],ing:["tortillas","cheese"],fav:!0,protein:"meatless",cut:"cheesepasta"},{id:"caesar-wrap",name:"Chicken Caesar Wraps",glyph:"\u{1F32F}",types:["l"],groups:["protein","veg","grain"],ing:["chicken","tortillas","greens"],fav:!1,protein:"chicken",cut:"breasts"},{id:"pbj",name:"PB&J + Apple Slices",glyph:"\u{1F95C}",types:["l"],groups:["grain","fruit"],ing:["bread","fruit"],fav:!1},{id:"mac-cheese",name:"Mac & Cheese",glyph:"\u{1F958}",types:["l"],groups:["grain","dairy"],ing:["pasta","cheese","milk"],fav:!1,protein:"meatless",cut:"cheesepasta"},{id:"soup-bread",name:"Soup & Crusty Bread",glyph:"\u{1F372}",types:["l"],groups:["veg","grain"],ing:["tomatoes","bread","onions"],fav:!1},{id:"snack-plate",name:"Picnic Snack Plate",glyph:"\u{1F9FA}",types:["l"],groups:["veg","dairy","grain","fruit"],ing:["cheese","greens","fruit","bread"],fav:!1},{id:"spaghetti",name:"Spaghetti & Meatballs",glyph:"\u{1F35D}",types:["d"],groups:["protein","grain"],ing:["pasta","gbeef","tomatoes","onions"],fav:!0,protein:"beef",cut:"ground",sides:["side-salad","garlic-bread"]},{id:"taco-night",name:"Taco Night",glyph:"\u{1F32E}",types:["d"],groups:["protein","grain","veg","dairy"],ing:["tortillas","cheese","tomatoes","greens"],fav:!0,protein:"beef",cut:"ground",sides:["corn-cob"],proteinPick:["beef","chicken","pork"],proteinIng:{beef:"gbeef",chicken:"chicken",pork:"pork"},defaultPick:"beef",recipe:{time:"30 min",serves:5,ingredients:["2 lb of your protein (beef, chicken, or pork)","10 taco shells or tortillas","Shredded cheese","Lettuce, tomato, salsa","Taco seasoning"],steps:["Cook your protein, drain, add seasoning + \xBD cup water.","Simmer 5 min while you chop toppings.","Warm shells in the oven, 5 min at 325\xB0.","Set out everything build-your-own style."]}},{id:"meatloaf",name:"Meatloaf",glyph:"\u{1F9C6}",types:["d"],groups:["protein","grain"],ing:["gbeef","bread","onions"],fav:!1,protein:"beef",cut:"ground",sides:["mashed","green-beans"]},{id:"burgers",name:"Burger Night",glyph:"\u{1F354}",types:["d"],groups:["protein","grain"],ing:["gbeef","bread","cheese","tomatoes","onions"],fav:!1,protein:"beef",cut:"ground",sides:["fries","corn-cob"]},{id:"chili",name:"Slow-Cooker Chili",glyph:"\u{1F336}\uFE0F",types:["d"],groups:["protein","veg"],ing:["gbeef","beans","tomatoes","onions"],fav:!1,protein:"beef",cut:"ground",sides:["cornbread"],recipe:{time:"15 min + 6 hr slow cook",serves:5,ingredients:["2 lb ground beef","2 cans beans","1 can crushed tomatoes","Onion, chili powder, cumin"],steps:["Brown beef with onion, drain.","Everything into the slow cooker.","Low 6 hours. Stir when you walk past.","Cheese + cornbread on the side."]}},{id:"shepherds",name:"Shepherd's Pie",glyph:"\u{1F967}",types:["d"],groups:["protein","veg"],ing:["gbeef","potatoes","carrots","onions"],fav:!1,protein:"beef",cut:"ground",sides:["green-beans"],recipe:{time:"50 min",serves:5,ingredients:["2 lb ground beef","4 cups mashed potatoes","Frozen peas + carrots","Onion, broth, Worcestershire"],steps:["Brown beef + onion, add veg and a splash of broth.","Into a baking dish, mash on top.","Bake 25 min at 400\xB0 until golden.","Rest 5 min before scooping."]}},{id:"steak-night",name:"Steak Night",glyph:"\u{1F969}",types:["d"],groups:["protein"],ing:["potatoes"],fav:!1,protein:"beef",cut:"steak",sides:["mashed","side-salad"]},{id:"beef-stew",name:"Beef Stew",glyph:"\u{1F356}",types:["d"],groups:["protein","veg"],ing:["potatoes","carrots","onions"],fav:!1,protein:"beef",cut:"roast",sides:["garlic-bread"]},{id:"brisket",name:"Slow-Smoked Brisket",glyph:"\u{1F969}",types:["d"],groups:["protein"],ing:["gbeef","onions"],fav:!1,protein:"beef",cut:"brisket",sides:["cornbread","coleslaw"],recipe:{time:"20 min + 6 hr low",serves:5,ingredients:["3\u20134 lb beef brisket","Dry rub (salt, pepper, paprika, garlic)","Onions","BBQ sauce to finish"],steps:["Rub the brisket well, let it sit while the oven heats to 300\xB0.","Bed of onions in the pan, brisket on top, cover tight.","Low and slow ~6 hours until it pulls apart.","Rest 20 min, slice against the grain."]}},{id:"grilled-chx",name:"Grilled Chicken & Veg",glyph:"\u{1F357}",types:["d"],groups:["protein"],ing:["chicken","broccoli"],fav:!0,protein:"chicken",cut:"breasts",sides:["broc-side","rice-side"]},{id:"fajitas",name:"Chicken Fajitas",glyph:"\u{1FAD1}",types:["d"],groups:["protein","veg","grain"],ing:["chicken","tortillas","onions"],fav:!1,protein:"chicken",cut:"breasts",sides:["beans-side"]},{id:"chx-soup",name:"Chicken Noodle Soup",glyph:"\u{1F35C}",types:["l","d"],groups:["protein","grain","veg"],ing:["chicken","pasta","carrots","onions"],fav:!1,protein:"chicken",cut:"breasts",sides:["garlic-bread"]},{id:"stirfry",name:"Chicken Stir-Fry",glyph:"\u{1F962}",types:["d"],groups:["protein","veg"],ing:["chicken","rice","broccoli","carrots"],fav:!0,protein:"chicken",cut:"thighs",sides:["rice-side"],recipe:{time:"25 min",serves:5,ingredients:["2 lb chicken thighs, sliced","Broccoli, carrots, whatever veg is around","Soy sauce, garlic, ginger","Rice for the table"],steps:["Start the rice first.","Sear chicken hot and fast, set aside.","Stir-fry veg 3\u20134 min, return chicken.","Sauce in, toss 1 min, serve over rice."]}},{id:"roast-chx",name:"Roast Chicken Dinner",glyph:"\u{1F414}",types:["d"],groups:["protein"],ing:["chicken","potatoes","carrots"],fav:!1,protein:"chicken",cut:"whole",sides:["mashed","carrots-side"]},{id:"porkchops",name:"Pork Chops & Apples",glyph:"\u{1F953}",types:["d"],groups:["protein","fruit"],ing:["pork","potatoes","fruit"],fav:!1,protein:"pork",cut:"chops",sides:["mashed","green-beans"]},{id:"pulled-pork",name:"Pulled Pork Sandwiches",glyph:"\u{1F96A}",types:["d"],groups:["protein","grain"],ing:["pork","bread"],fav:!1,protein:"pork",cut:"pulled",sides:["coleslaw","fries"]},{id:"turkey-burgers",name:"Turkey Burgers",glyph:"\u{1F354}",types:["d"],groups:["protein","grain","veg"],ing:["turkey","bread","greens","tomatoes"],fav:!1,protein:"turkey",cut:"ground",sides:["fries","side-salad"]},{id:"brinner",name:"Breakfast for Dinner",glyph:"\u{1F373}",types:["d"],groups:["protein","grain"],ing:["eggs","bread"],fav:!1,protein:"meatless",cut:"eggs",sides:["fruit-salad"]},{id:"veg-curry",name:"Veggie Curry & Rice",glyph:"\u{1F35B}",types:["d"],groups:["veg","grain"],ing:["rice","broccoli","beans","onions"],fav:!1,protein:"meatless",cut:"beans",sides:["rice-side"],recipe:{time:"35 min",serves:5,ingredients:["1 can coconut milk","Curry paste or powder","Broccoli, carrots, chickpeas","Rice for the table"],steps:["Start the rice.","Soften onion, bloom curry paste 1 min.","Coconut milk + veg, simmer 15 min.","Taste, salt, serve over rice."]}},{id:"ziti",name:"Baked Ziti",glyph:"\u{1F345}",types:["d"],groups:["grain","dairy","protein"],ing:["pasta","cheese","tomatoes"],fav:!1,protein:"meatless",cut:"cheesepasta",sides:["side-salad","garlic-bread"]},{id:"pizza",name:"Pizza Night",glyph:"\u{1F355}",types:["d"],groups:["grain","dairy"],ing:["cheese","tomatoes"],fav:!0,protein:"meatless",cut:"cheesepasta",sides:["side-salad"],rotates:!0},{id:"leftovers",name:"Leftovers",glyph:"\u{1F961}",types:["b","l","d"],groups:[],ing:[],fav:!1,special:!0},{id:"eat-out",name:"Eating Out",glyph:"\u{1F37D}\uFE0F",types:["l","d"],groups:[],ing:[],fav:!1,special:!0}],us=[{id:"idea-butter-chx",name:"Butter Chicken",glyph:"\u{1F35B}",groups:["protein","grain"],ing:["chicken","rice","onions"],protein:"chicken",cut:"thighs",sides:["rice-side"],area:"Indian"},{id:"idea-carbonara",name:"Spaghetti Carbonara",glyph:"\u{1F35D}",groups:["grain","protein","dairy"],ing:["pasta","eggs","cheese","pork"],protein:"pork",cut:"bacon",sides:["side-salad"],area:"Italian"},{id:"idea-greek-bowl",name:"Greek Chicken Bowls",glyph:"\u{1F959}",groups:["protein","veg","grain"],ing:["chicken","rice","tomatoes","greens"],protein:"chicken",cut:"breasts",sides:["side-salad"],area:"Greek"},{id:"idea-pork-ramen",name:"Quick Pork Ramen",glyph:"\u{1F35C}",groups:["protein","grain","veg"],ing:["pork","pasta","eggs","broccoli"],protein:"pork",cut:"chops",sides:[],area:"Japanese"},{id:"idea-chx-curry",name:"Coconut Chicken Curry",glyph:"\u{1F35B}",groups:["protein","grain","veg"],ing:["chicken","rice","carrots","onions"],protein:"chicken",cut:"thighs",sides:["rice-side"],area:"Thai"},{id:"idea-beef-bowl",name:"Korean Beef Bowls",glyph:"\u{1F372}",groups:["protein","grain"],ing:["gbeef","rice","onions"],protein:"beef",cut:"ground",sides:["broc-side"],area:"Korean"},{id:"idea-turkey-chili",name:"Turkey White Chili",glyph:"\u{1F372}",groups:["protein","veg"],ing:["turkey","beans","onions"],protein:"turkey",cut:"ground",sides:["cornbread"],area:"Tex-Mex"},{id:"idea-veg-stirfry",name:"Tofu Veggie Stir-Fry",glyph:"\u{1F961}",groups:["veg","grain"],ing:["rice","broccoli","carrots","onions"],protein:"meatless",cut:"beans",sides:["rice-side"],area:"Chinese"}],ji=["eggs","cheese","milk"],Gi=["olive oil","avocado","nuts","seeds","eggs","full-fat dairy","olives"],ca=["Marco's \xB7 pepperoni","Homemade \xB7 margherita","Slice House \xB7 supreme"],Wi=["spaghetti","ziti"],Tt={pizza:{label:"Pizza Night",glyph:"\u{1F355}"},leftovers:{label:"Leftovers",glyph:"\u{1F961}"},taco:{label:"Taco Night",glyph:"\u{1F32E}"},pasta:{label:"Pasta Night",glyph:"\u{1F35D}"}},Pt=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],rt=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],Lt=["January","February","March","April","May","June","July","August","September","October","November","December"],ht=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],St=30});function $s(e){let t=e._attrs("sensor.family_hub_meals"),a=t.plan||{},o=t.rhythm||{},s=t.favs||[],i=t.groc||{},n=t.custom||[],r=t.customIng||[],d=t.recipes||{},p=t.have||[],c=e._mealsTab||"week",g=`
        <div class="fh-bk-tabs">
            ${[{key:"today",label:"Today",sub:"tonight"},{key:"week",label:"This Week",sub:"menu board"},{key:"plan",label:"Plan",sub:"day builder"},{key:"pantry",label:"What Can We Make",sub:"pantry"},{key:"library",label:"Library",sub:"recipes"},{key:"groceries",label:"Groceries",sub:"shopping"}].map($=>`
                <button class="fh-bk-tab${c===$.key?" active":""}"
                        data-act="meals-tab" data-tab="${$.key}">
                    ${m($.label)}
                    <span class="fh-bk-tab-sub">${$.sub}</span>
                </button>`).join("")}
        </div>`,u="";c==="today"?u=Ji(a,n,r,p,d):c==="week"?u=Ki(e,a,n):c==="plan"?u=Yi(e,a,n,s,o):c==="pantry"?u=tn(e,a,n,r,s,p):c==="library"?u=an(e,a,n,s,d,p):c==="groceries"&&(u=sn(e,a,n,r,i));let v=e._mealsRecipe?on(e._mealsRecipe,n,d,a):"",_=c==="plan"&&e._mealsDrawer?en(e,a,n,s):"",f=e._mealsDayPick?nn(e._mealsDayPick,a,n):"";return`
        <div class="fh-bk-page fh-ml-room" style="display:flex;flex-direction:column;min-height:0;height:calc(100vh - 72px);max-height:920px;overflow:hidden;padding:14px 20px 10px;">
            ${g}
            <div style="flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;position:relative;">
                ${u}
                ${_}
                ${v}
                ${f}
            </div>
        </div>`}function Ji(e,t,a,o,s){let i=st(),n=Je(i,1);return`
        <div class="fh-ml-content">
            <div class="fh-tdy-wrap">
                ${ys("Today",i,e[Z(i)]||{},t,a,o,s)}
                ${ys("Tomorrow",n,e[Z(n)]||{},t,a,o,s)}
            </div>
        </div>`}function ys(e,t,a,o,s,i,n){let r=a.d,d=r?V(r.main,o):null,p=r?(r.sides||[]).map(it).filter(Boolean):[],c=a.b?V(a.b,o):null,b=a.l?V(a.l,o):null,g=r&&r.protein&&de[r.protein]?de[r.protein].label.toLowerCase():null,u=e==="Today",v="";if(u&&(c||b||d)){let f=Oe(s),$=new Set(i||[]),S=[],x=E=>(E||[]).forEach(F=>{!$.has(F)&&!S.includes(F)&&S.push(F)});c&&!c.special&&x(c.ing),b&&!b.special&&x(b.ing),d&&!d.special&&x(Ot(d,r)),p.forEach(E=>x(E.ing));let h=S.map(E=>{let F=f.find(D=>D.id===E);return F?`<span class="fh-tdy-need"><span class="fh-tdy-need-g">${F.glyph}</span>${m(F.label)}</span>`:""}).join(""),w=d?Ke(d,n):null,z=w?`<div class="fh-tdy-prep">Dinner: <b>${m(w.time)}</b> \xB7 serves ${w.serves}</div>`:"";v=`
            <div class="fh-tdy-needs">
                <div class="fh-tdy-needs-hdr">What's needed today</div>
                ${S.length?`<div class="fh-tdy-needs-list">${h}</div>`:`<div class="fh-tdy-needs-none">\u2713 everything's on hand</div>`}
                ${z}
            </div>`}let _=d?`
        <span class="fh-tdy-glyph">${d.glyph}</span>
        <span class="fh-tdy-name">${m(d.name)}</span>
        ${r.variant?`<span class="fh-tdy-variant">${m(r.variant)}</span>`:g?`<span class="fh-tdy-variant">with ${m(g)}</span>`:""}
        ${p.length?`<span class="fh-tdy-sides">${p.map(f=>m(f.name)).join(" \xB7 ")}</span>`:""}
    `:'<span class="fh-tdy-empty">not planned yet</span>';return`
        <div class="fh-tdy-panel${u?" is-today":""}">
            <div class="fh-tdy-head">
                <span class="fh-tdy-label">${e}</span>
                <span class="fh-tdy-date">${Pt[t.getDay()]} \xB7 ${ht[t.getMonth()]} ${t.getDate()}</span>
            </div>
            <div class="fh-tdy-dinner">
                <span class="fh-tdy-dinner-kicker">Dinner</span>
                ${_}
            </div>
            <div class="fh-tdy-bl">
                <div class="fh-tdy-bl-row">
                    <span class="fh-tdy-bl-k">Breakfast</span>
                    ${c?`<span class="fh-tdy-bl-v">${c.glyph} ${m(c.name)}</span>`:'<span class="fh-tdy-bl-v empty">\u2014</span>'}
                </div>
                <div class="fh-tdy-bl-row">
                    <span class="fh-tdy-bl-k">Lunch</span>
                    ${b?`<span class="fh-tdy-bl-v">${b.glyph} ${m(b.name)}</span>`:'<span class="fh-tdy-bl-v empty">\u2014</span>'}
                </div>
            </div>
            ${v}
        </div>`}function Ki(e,t,a){let o=e._mealsWeekPage||0,s=0,i=st(),n=Et(i,s),r=Je(n,o*7),d=Math.floor((St-1)/7),p=o>0,c=o<d,b=Array.from({length:7},(x,h)=>Je(r,h)),g=b[6],u=r.getMonth()===g.getMonth()?`${Lt[r.getMonth()]} ${r.getDate()} \u2013 ${g.getDate()}`:`${ht[r.getMonth()]} ${r.getDate()} \u2013 ${ht[g.getMonth()]} ${g.getDate()}`,v=o===0?"this week":o===1?"next week":`${o} weeks out`,_=ma(t),f=`
        <div class="fh-ml-pager">
            <div class="fh-ml-range">${u}<em>~ ${v} ~</em></div>
            <span class="fh-ml-pager-spacer"></span>
            ${o!==0?'<button class="fh-ml-ghost-btn" data-act="meals-week-today">Today</button>':""}
            <button class="fh-ml-pgbtn" data-act="meals-week-prev"${p?"":" disabled"}>\u2039</button>
            <button class="fh-ml-pgbtn" data-act="meals-week-next"${c?"":" disabled"}>\u203A</button>
        </div>`,$=`
        <div class="fh-ml-week">
            ${b.map(x=>Vi(x,t[Z(x)]||{},a,i)).join("")}
        </div>`,S=`
        <div class="fh-ml-legendrow">
            <span class="fh-ml-legend">
                <span class="fh-ml-legend-cap">on the plate:</span>
                ${Xe.map(x=>`
                    <span class="fh-ml-lgd">
                        <span class="fh-ml-gicon on">${Le[x].icon}</span>
                        ${m(Le[x].label)}
                    </span>`).join("")}
            </span>
            <span class="fh-ml-weeknote-inline">
                ${_?`next open dinner: <b>${m(mt(_))}</b> \u2014 tap any day to plan`:"every dinner is planned for the next month \u2014 <b>nicely done</b>"}
            </span>
        </div>`;return`
        <div class="fh-ml-content">
            ${f}
            ${$}
            ${S}
        </div>`}function Vi(e,t,a,o){let s=Z(e),i=s===Z(o),n=e<o&&!i,r=t.d,d=r?V(r.main,a):null,p=r?(r.sides||[]).map(it).filter(Boolean):[],c=Nt(r,a),b=d?`
        <span class="fh-ml-dglyph">${d.glyph}</span>
        <span class="fh-ml-dname">${m(d.name)}</span>
        ${r.variant?`<span class="fh-ml-dvariant">${m(r.variant)}</span>`:""}
        ${p.length?`<span class="fh-ml-dsides">${p.map(u=>m(u.name)).join(" \xB7 ")}</span>`:""}
        ${c.length?Gt(c):""}
    `:`
        <span class="fh-ml-dempty"><span>${n?"":"\uFF0B"}</span>${n?"\u2014":"nothing yet"}</span>
    `,g=n?"":`data-act="meals-week-tap-day" data-date="${s}"`;return`
        <div class="fh-ml-day${i?" today":""}${n?" past":""}">
            <div class="fh-ml-day-hdr">
                ${rt[e.getDay()].toUpperCase()} ${e.getDate()}
                ${i?'<span class="fh-ml-day-today-tag">~ today ~</span>':""}
            </div>
            <div class="fh-ml-day-dinner" ${g}>
                ${b}
            </div>
            <div class="fh-ml-bl" ${g}>
                ${ws("BREAKFAST",t.b,a)}
                ${ws("LUNCH",t.l,a)}
            </div>
        </div>`}function ws(e,t,a){let o=t?V(t,a):null;return`
        <div class="fh-ml-bl-slot">
            <span class="fh-ml-bl-kicker">${e}</span>
            ${o?`
                <span class="fh-ml-bl-meal">
                    <span class="fh-ml-bl-glyph">${o.glyph}</span>
                    <span class="fh-ml-bl-name">${m(o.name)}</span>
                </span>`:`
                <span class="fh-ml-bl-name empty">open</span>`}
        </div>`}function Yi(e,t,a,o,s){let i=st(),n=e._mealsJumpDate||Z(i),r=ft(n),d=t[n]||{},p=0,c=Array.from({length:St},(S,x)=>Je(i,x)),b=[];c.forEach(S=>{let x=Z(Et(S,p)),h=b[b.length-1];if(!h||h.key!==x){let w=b.length===0?"This week":b.length===1?"Next week":`Week of ${ht[S.getMonth()]} ${Et(S,p).getDate()}`;h={key:x,label:w,days:[]},b.push(h)}h.days.push(S)});let g=`
        <div class="fh-ml-rail">
            ${b.map(S=>`
                <div class="fh-ml-rail-wk">${S.label}</div>
                ${S.days.map(x=>{let h=Z(x),w=t[h]||{};return`
                        <div class="${"fh-ml-rail-day"+(h===n?" active":"")+(h===Z(i)?" is-today":"")}" data-act="meals-plan-select-day" data-date="${h}">
                            <span class="fh-ml-rail-date">${fa(x)}</span>
                            <span class="fh-ml-rail-dots">
                                <span class="fh-ml-rail-dot${w.b?" filled":""}"></span>
                                <span class="fh-ml-rail-dot${w.l?" filled":""}"></span>
                                <span class="fh-ml-rail-dot${w.d?" filled":""}"></span>
                            </span>
                        </div>`}).join("")}
            `).join("")}
        </div>`,u=d.b||d.l||d.d,v=`
        <div class="fh-ml-dayhdr">
            <span class="fh-ml-dayhdr-title">${mt(r)}</span>
            ${Z(i)===n?'<span class="fh-ml-dayhdr-sub">~ today ~</span>':""}
            <span class="fh-ml-pager-spacer"></span>
            ${u?`<button class="fh-ml-ghost-btn" data-act="meals-clear-day" data-date="${n}">Clear day</button>`:""}
        </div>`,_=Qi(d,a,n),f=Zi(d,a,n),$=Xi(s,p);return`
        <div class="fh-ml-content">
            <div class="fh-ml-bld">
                ${g}
                <div class="fh-ml-main">
                    ${$}
                    ${v}
                    <div class="fh-ml-slots">
                        ${_}
                        ${f}
                    </div>
                </div>
            </div>
        </div>`}function Xi(e,t){let a=Array.from({length:7},(s,i)=>(t+i)%7),o=null;return`
        <div class="fh-ml-rhythm">
            <div class="fh-ml-rhythm-head">
                <span class="fh-ml-rhythm-lbl">Theme nights</span>
                <span class="fh-ml-rhythm-hint">Pin a regular dinner to a weekday \u2014 like Taco Tuesday or Pizza Friday \u2014 and it fills itself in every week. Tap a day to set or change it.</span>
            </div>
            <div class="fh-ml-rhythm-chips">
                ${a.map(s=>{let i=e[String(s)],n=i?Tt[i]:null;return`
                        <div class="fh-ml-rh-wrap">
                            <button class="fh-ml-rh-chip${n?" set":""}"
                                    data-act="meals-rhythm-pop" data-weekday="${s}">
                                <span class="fh-ml-rh-dow">${rt[s].toUpperCase()}</span>
                                ${n?`<span class="fh-ml-rh-val">${n.glyph}</span><span class="fh-ml-rh-name">${m(n.label)}</span>`:'<span class="fh-ml-rh-set">\uFF0B set</span>'}
                            </button>
                            <div class="fh-ml-rh-pop" id="fh-rh-pop-${s}" style="display:none;left:0;">
                                <div class="fh-ml-rh-opt${i?"":" on"}"
                                     data-act="meals-set-rhythm" data-weekday="${s}" data-theme="">
                                    <span class="rh-g">\u2205</span> No theme
                                </div>
                                ${Object.entries(Tt).map(([r,d])=>`
                                    <div class="fh-ml-rh-opt${i===r?" on":""}"
                                         data-act="meals-set-rhythm" data-weekday="${s}" data-theme="${r}">
                                        <span class="rh-g">${d.glyph}</span> ${m(d.label)}
                                    </div>`).join("")}
                            </div>
                        </div>`}).join("")}
            </div>
        </div>`}function Qi(e,t,a){let o=e.d,s=o?V(o.main,t):null,i=o?(o.sides||[]).map(it).filter(Boolean):[],n=Nt(o,t);if(s){let r=s.special?"":`
            <div class="fh-ml-sides-row">
                ${i.map(d=>`
                    <span class="fh-ml-schip"
                          data-act="meals-remove-side" data-date="${a}" data-side="${d.id}">
                        ${d.glyph} ${m(d.name)} <span class="x">\u2715</span>
                    </span>`).join("")}
                <span class="fh-ml-schip add"
                      data-act="meals-open-sides" data-date="${a}">\uFF0B side</span>
            </div>
        `;return`
            <div class="fh-ml-dcard">
                <span class="fh-ml-slot-kicker">Dinner \xB7 the main event</span>
                <button class="fh-ml-xbtn" data-act="meals-clear-dinner" data-date="${a}" title="Clear dinner">\u2715</button>
                <div class="fh-ml-dcard-body">
                    <span class="fh-ml-dcard-glyph">${s.glyph}</span>
                    <span class="fh-ml-dcard-name">${m(s.name)}</span>
                    ${o.variant?`<span class="fh-ml-dcard-variant">${m(o.variant)}</span>`:""}
                    ${o.via==="rhythm"?'<span class="fh-ml-via-tag">~ set by your weekly rhythm ~</span>':""}
                    ${r}
                    ${n.length?`<div style="padding-top:6px">${Gt(n)}</div>`:""}
                </div>
                <div class="fh-ml-dcard-actions">
                    <button class="fh-ml-ghost-btn"
                            data-act="meals-open-drawer" data-kind="d-main" data-date="${a}">
                        Change dinner
                    </button>
                </div>
            </div>`}return`
        <div class="fh-ml-dcard">
            <span class="fh-ml-slot-kicker">Dinner \xB7 the main event</span>
            <div class="fh-ml-dcard-body">
                <span class="fh-ml-dempty-big">nothing planned yet</span>
                <button class="fh-bk-go-btn"
                        data-act="meals-open-drawer" data-kind="d-main" data-date="${a}">
                    Choose dinner
                </button>
            </div>
        </div>`}function Zi(e,t,a){return`
        <div class="fh-ml-blcol">
            ${ks("Breakfast","b",e.b,t,a)}
            ${ks("Lunch","l",e.l,t,a)}
        </div>`}function ks(e,t,a,o,s){let i=a?V(a,o):null;return`
        <div class="fh-ml-blcard">
            <span class="fh-ml-slot-kicker">${e}</span>
            <div class="fh-ml-blcard-body">
                ${i?`
                    <span class="fh-ml-blcard-glyph">${i.glyph}</span>
                    <span class="fh-ml-blcard-name">${m(i.name)}</span>
                    <button class="fh-ml-xbtn"
                            data-act="meals-clear-bl" data-date="${s}" data-slot="${t}"
                            title="Clear ${e.toLowerCase()}">\u2715</button>
                `:`
                    <span class="fh-ml-blcard-name empty">quick pick \u2014 one tap covers the week</span>
                `}
            </div>
            <div class="fh-ml-blcard-actions">
                <button class="fh-ml-ghost-btn"
                        data-act="meals-open-drawer" data-kind="${t}" data-date="${s}">
                    ${i?"Change":"\uFF0B Choose"}
                </button>
            </div>
        </div>`}function en(e,t,a,o){let s=e._mealsDrawer,{kind:i,dateISO:n,step:r}=s,d=ft(n),p=t[n]||{},c=i==="b"||i==="l",b=c?i:"d",g=i==="b"?"breakfast":i==="l"?"lunch":"dinner",u=ot(a),v=s.pendingMainId?V(s.pendingMainId,a):null,_=s.pickedProtein||null,f=new Set(s.selSides||[]),$=u.filter(A=>A.special&&A.types.includes(b));function S(A,B){return u.filter(L=>L.types.includes("d")&&!L.special&&L.protein===A&&(!B||L.cut===B))}function x(A){var B;return(((B=de[A])==null?void 0:B.cuts)||[]).filter(L=>S(A,L.id).length>0)}let h=s.cat||null,w=s.cut||null,z=s.scope||"today",E=s.favOnly||!1,F=s.nudgeOff||!1,D=s.fatsOff||!1,R=h?de[h].label:"",T=h&&w&&(de[h].cuts.find(A=>A.id===w)||{}).label||"",P=r==="protein"?"What's the protein?":r==="cut"?`Which ${R.toLowerCase()}?`:r==="make"?`${T||R} \u2014 what are we making?`:r==="sides"?v?`${v.glyph} ${v.name} \xB7 round out the plate`:"Round out the plate":r==="tacoprotein"?v?`${v.glyph} ${v.name} \u2014 pick the protein`:"Pick the protein":r==="confirm"?"All set \u2713":c?`Choosing ${g}`:"The whole library",y=`
        <div class="fh-ml-dr-head">
            ${!c&&i!=="d-sides"&&(r==="cut"||r==="make"||r==="browse"||r==="tacoprotein"||r==="sides"&&v)?'<button class="fh-ml-ghost-btn" data-act="meals-drawer-back">\u2039 Back</button>':""}
            <span class="fh-ml-dr-title">${m(P)}</span>
            <span class="fh-ml-dr-date">~ ${mt(d)} ~</span>
            <span class="fh-ml-dr-spacer"></span>
            ${c?`
                <div class="fh-ml-scope">
                    ${[["today","Just today"],["week","All week"],["2weeks","2 weeks"]].map(([A,B])=>`
                        <button class="fh-ml-scope-opt${z===A?" on":""}"
                                data-act="meals-drawer-scope" data-scope="${A}">${B}</button>`).join("")}
                </div>`:""}
            <button class="fh-ml-xbtn" data-act="meals-close-drawer">\u2715</button>
        </div>`,k=`
        <div class="fh-ml-dr-quick">
            ${$.map(A=>`
                <button class="fh-ml-qchip"
                        data-act="meals-drawer-pick-special" data-meal="${A.id}">
                    ${A.glyph} ${m(A.name)}
                </button>`).join("")}
            <span class="fh-ml-pager-spacer" style="flex:1"></span>
            ${r==="protein"?'<button class="fh-ml-qchip" data-act="meals-drawer-browse">Browse everything \u203A</button>':""}
            ${r==="browse"?`<button class="fh-ml-qchip${E?" on":""}" data-act="meals-drawer-favonly">\u2665 Favorites</button>`:""}
        </div>`,M="";if(r==="protein")M=`
            ${k}
            <div class="fh-ml-grid fh-ml-pgrid">
                ${$t.map(A=>{let B=de[A],L=S(A).length;return L===0?"":`
                        <div class="fh-ml-mealcard fh-ml-pcard"
                             data-act="meals-drawer-pick-cat" data-cat="${A}">
                            <span class="fh-ml-mealcard-glyph" style="font-size:calc(2.4rem * var(--fh-text-scale,1))">${B.glyph}</span>
                            <span class="fh-ml-mealcard-name" style="font-size:var(--fh-text-base)">${m(B.label)}</span>
                            <span class="fh-ml-pcount">${L} ${L===1?"idea":"ideas"}</span>
                        </div>`}).join("")}
            </div>`;else if(r==="cut"&&h)M=`
            <div class="fh-ml-grid fh-ml-pgrid">
                ${x(h).map(A=>{let B=S(h,A.id).length;return`
                        <div class="fh-ml-mealcard fh-ml-pcard"
                             data-act="meals-drawer-pick-cut" data-cut="${A.id}">
                            <span class="fh-ml-mealcard-glyph" style="font-size:calc(2rem * var(--fh-text-scale,1))">${de[h].glyph}</span>
                            <span class="fh-ml-mealcard-name" style="font-size:var(--fh-text-sm)">${m(A.label)}</span>
                            <span class="fh-ml-pcount">${B} ${B===1?"idea":"ideas"}</span>
                        </div>`}).join("")}
            </div>`;else if(r==="make"&&h)M=`
            <div class="fh-ml-grid">
                ${(S(h,w).length?S(h,w):S(h)).map(B=>_s(B,o.includes(B.id),"meals-drawer-pick-main",{meal:B.id},!0)).join("")}
            </div>`;else if(r==="browse"){let A=u.filter(B=>B.types.includes(b)&&!B.special).filter(B=>E?o.includes(B.id):!0).sort((B,L)=>{let q=o.includes(B.id)?0:1,J=o.includes(L.id)?0:1;return q-J||B.name.localeCompare(L.name)});M=`
            ${k}
            <div class="fh-ml-grid">
                ${A.length?A.map(B=>_s(B,o.includes(B.id),c?"meals-drawer-pick-bl":"meals-drawer-pick-main",{meal:B.id},!1)).join(""):`<div class="fh-ml-empty-note" style="grid-column:1/-1">
                    no favorites yet \u2014 tap \u2665 Favorites to see everything
                   </div>`}
            </div>`}else if(r==="tacoprotein"&&v)M=`
            <div class="fh-ml-grid fh-ml-pgrid">
                ${(v.proteinPick||[]).map(A=>`
                    <div class="fh-ml-mealcard fh-ml-pcard${_===A?" on":""}"
                         data-act="meals-drawer-pick-taco-protein" data-protein="${A}">
                        <span class="fh-ml-mealcard-glyph" style="font-size:calc(2.4rem * var(--fh-text-scale,1))">${de[A].glyph}</span>
                        <span class="fh-ml-mealcard-name" style="font-size:var(--fh-text-base)">${m(de[A].label)}</span>
                    </div>`).join("")}
            </div>
            <div class="fh-ml-dr-foot">
                <span class="fh-ml-dr-foot-note">${m(v.name)} works with any of these \u2014 tap tonight's protein and it flows to the shopping list</span>
            </div>`;else if(r==="sides"){let A=v||(p.d?V(p.d.main,a):null),B=A?A.protein:h,L=(()=>{let ee=new Set(A?A.groups||[]:[]);return f.forEach(te=>{let Ve=it(te);Ve&&Ve.groups.forEach(Zt=>ee.add(Zt))}),[...ee]})(),q=!L.includes("veg")&&!L.includes("fruit"),J=pa(A),Ze=ee=>{let te=0;return(A&&A.sides||[]).includes(ee.id)&&(te+=100),(ee.pairs||[]).includes(B)&&(te+=10),te},bt=Xe.map(ee=>({g:ee,sides:at.filter(te=>te.groups[0]===ee).sort((te,Ve)=>Ze(Ve)-Ze(te)||te.name.localeCompare(Ve.name))})).filter(ee=>ee.sides.length),he=`
            <div class="fh-ml-plateso">
                <span class="fh-ml-legend-cap">the plate so far:</span>
                ${Gt(L)}
                ${q&&!F?`
                    <span class="fh-ml-nudge">
                        \u{1F966} add a veggie? pick one from the Veggies section below
                        <button class="fh-ml-nudge-x" data-act="meals-dismiss-nudge">dismiss</button>
                    </span>`:L.includes("veg")||L.includes("fruit")?`
                    <span class="fh-ml-plateso-note good">~ something fresh on the plate \u2713 ~</span>`:""}
                ${J.length&&!D?`
                    <span class="fh-ml-fats">
                        \u{1FAD2} healthy fats here: ${m(J.join(", "))}
                        <button class="fh-ml-nudge-x" data-act="meals-dismiss-fats">got it</button>
                    </span>`:""}
            </div>`,fo=A&&A.sides&&A.sides.length?`the usual sides are pre-picked \xB7 PAIRS = goes well with ${B?de[B].label.toLowerCase():"this"}`:"tap anything that should join the plate";M=`
            ${he}
            <div class="fh-ml-sides-scroll">
                <div class="fh-ml-side-cols">
                    ${bt.map(ee=>`
                        <div class="fh-ml-side-col${ee.g==="veg"&&q&&!F?" cue":""}">
                            <div class="fh-ml-side-sec-hdr">
                                <span class="fh-ml-gicon on">${Le[ee.g].icon}</span>
                                ${m(Le[ee.g].label)}
                            </div>
                            ${ee.g==="veg"&&q&&!F?'<div class="fh-ml-side-sec-cue">a fresh pick rounds out the plate</div>':""}
                            <div class="fh-ml-side-colgrid">
                                ${ee.sides.map(te=>{let Ve=f.has(te.id),Zt=(te.pairs||[]).includes(B);return`
                                        <div class="fh-ml-mealcard fh-ml-sidecard${Ve?" on":""}"
                                             data-act="meals-toggle-side" data-side="${te.id}">
                                            ${Ve?'<span class="ck">\u2713</span>':""}
                                            ${!Ve&&Zt?'<span class="fh-ml-pairtag">PAIRS</span>':""}
                                            <span class="fh-ml-mealcard-glyph" style="font-size:calc(1.6rem * var(--fh-text-scale,1))">${te.glyph}</span>
                                            <span class="fh-ml-mealcard-name" style="font-size:var(--fh-text-xs)">${m(te.name)}</span>
                                        </div>`}).join("")}
                            </div>
                        </div>`).join("")}
                </div>
            </div>
            <div class="fh-ml-dr-foot">
                <span class="fh-ml-dr-foot-note">${m(fo)}</span>
                <span class="fh-ml-pager-spacer" style="flex:1"></span>
                ${i!=="d-sides"?'<button class="fh-ml-ghost-btn" data-act="meals-drawer-no-sides">No sides</button>':""}
                <button class="fh-bk-go-btn" data-act="meals-drawer-done-sides">Done \u2713</button>
            </div>`}else r==="confirm"&&(M=`
            <div class="fh-ml-confirm">
                <div class="fh-ml-confirm-icon">${s.savedGlyph||"\u2713"}</div>
                <div class="fh-ml-confirm-msg">
                    <b>${m(s.savedName||"Dinner")}</b> is planned for ${m(mt(d))}.
                </div>
                <div class="fh-ml-confirm-sub">Keep going, or you're all set.</div>
                <div class="fh-ml-confirm-actions">
                    <button class="fh-bk-go-btn" data-act="meals-drawer-next-day">Plan the next open day \u203A</button>
                    <button class="fh-ml-ghost-btn" data-act="meals-close-drawer">Done for now</button>
                </div>
            </div>`);return`
        <div class="fh-ml-scrim" data-act="meals-close-drawer"></div>
        <div class="fh-ml-drawer">
            ${y}
            ${M}
        </div>`}function tn(e,t,a,o,s,i){let n=new Set(i),r=Oe(o),d=`
        <div class="fh-ml-panel">
            <div class="fh-ml-panel-hdr">
                What's in the kitchen?
                <small>~ tap everything you've got \u2014 proteins first, no typing ~</small>
            </div>
            <div class="fh-ml-ingscroll">
                ${pt.map(([g,u])=>{let v=r.filter(_=>_.cat===g);return v.length?`
                        <div class="fh-ml-ing-sec-hdr">
                            <span class="fh-ml-gicon on">${(Le[g]||{}).icon||"\u2022"}</span>
                            ${m(u)}
                        </div>
                        <div class="fh-ml-ingrid">
                            ${v.map(_=>{let f=n.has(_.id);return`
                                    <div class="fh-ml-ing-chip${f?" on":""}"
                                         data-act="meals-toggle-have" data-ing="${_.id}">
                                        ${f?'<span class="ck">\u2713</span>':""}
                                        <span class="fh-ml-ing-glyph">${_.glyph}</span>
                                        <span class="fh-ml-ing-lbl">${m(_.label)}</span>
                                    </div>`}).join("")}
                        </div>`:""}).join("")}
            </div>
        </div>`,p=ot(a).filter(g=>g.types.includes("d")&&!g.special).map(g=>({meal:g,hits:(g.ing||[]).filter(u=>n.has(u))})).filter(g=>g.hits.length>0).sort((g,u)=>u.hits.length-g.hits.length||(s.includes(u.meal.id)?1:0)-(s.includes(g.meal.id)?1:0)||g.meal.name.localeCompare(u.meal.name)),b=`
        <div class="fh-ml-panel">
            <div class="fh-ml-panel-hdr">
                We could make\u2026
                <small>~ best matches first \xB7 tap one to put it on a night ~</small>
            </div>
            <div class="fh-ml-matches">${n.size===0?'<div class="fh-ml-empty-note">tap a few ingredients on the left<br>and dinner ideas show up here</div>':p.length===0?'<div class="fh-ml-empty-note">nothing matches yet \u2014 keep tapping</div>':p.map(({meal:g,hits:u})=>{let v=Oe(o);return`
                    <div class="fh-ml-match-row"
                         data-act="meals-pantry-pick" data-meal="${g.id}">
                        <span class="fh-ml-match-glyph">${g.glyph}</span>
                        <div class="fh-ml-match-body">
                            <div class="fh-ml-match-name">${m(g.name)}${s.includes(g.id)?" \u2665":""}</div>
                            <div class="fh-ml-match-uses">
                                ${(g.ing||[]).map(_=>{let f=v.find(S=>S.id===_);if(!f)return"";let $=u.includes(_);return`<span class="${$?"hit":""}">${$?"\u2713":"\xB7"}${m(f.label.toLowerCase())} </span>`}).join("")}
                            </div>
                        </div>
                        <button class="fh-ml-ghost-btn" style="min-height:38px;padding:6px 14px">\uFF0B plan</button>
                    </div>`}).join("")}</div>
        </div>`;return`
        <div class="fh-ml-content">
            <div class="fh-ml-pantry">
                ${d}
                ${b}
            </div>
        </div>`}function an(e,t,a,o,s,i){let n=e._mealsLibFilter||"all",r=new Set(a.map(u=>u.id)),d=ot(a).filter(u=>!u.special).filter(u=>n==="all"?!0:u.types.includes(n)).sort((u,v)=>{let _=o.includes(u.id)?0:1,f=o.includes(v.id)?0:1;return _-f||u.name.localeCompare(v.name)}),p=`
        <div class="fh-ml-libfilters">
            ${[["all","Everything"],["b","Breakfast"],["l","Lunch"],["d","Dinner"]].map(([u,v])=>`
                <button class="fh-ml-qchip${n===u?" on":""}"
                        data-act="meals-lib-filter" data-filter="${u}">${v}</button>`).join("")}
            <span class="fh-ml-libhint">~ tap \u2665 to keep family staples on top \xB7 \u{1F33E} marks whole-grain meals \xB7 RECIPE opens the card ~</span>
        </div>`,c=`
        <div class="fh-ml-libgrid">
            ${d.map(u=>{let v=o.includes(u.id),_=!!Ke(u,s),f=ha(u,[]),$=_?"meals-open-recipe":u.types.includes("d")?"meals-lib-plan-meal":"";return`
                    <div class="fh-ml-mealcard fh-ml-libcard"
                         ${$?`data-act="${$}" data-meal="${u.id}"`:""}>
                        <button class="fh-ml-fav-btn${v?" on":""}"
                                data-act="meals-toggle-fav" data-meal="${u.id}"
                                style="pointer-events:auto">
                            ${v?"\u2665":"\u2661"}
                        </button>
                        <span class="fh-ml-mealcard-glyph">${u.glyph}</span>
                        <span class="fh-ml-mealcard-name">${m(u.name)}</span>
                        ${_?'<span class="fh-ml-rbadge">RECIPE</span>':""}
                        ${f?'<span class="fh-ml-wgbadge">\u{1F33E} whole grain</span>':""}
                    </div>`}).join("")}
        </div>`,b=Ht(i),g=`
        <div class="fh-ml-disc-hdr">
            ~ recipe ideas ~
            <small>RANKED BY WHAT'S ON HAND</small>
            <button class="fh-ml-disc-refresh" data-act="meals-ideas-refresh">\u21BB refresh</button>
        </div>
        ${i.length===0?'<div class="fh-ml-idea-hint">tip: tap what you have over in <b>What Can We Make</b> and these reorder around it</div>':""}
        <div class="fh-ml-discrow">
            ${b.map(({idea:u,hits:v})=>{let _=r.has(u.id);return`
                    <div class="fh-ml-mealcard fh-ml-disccard">
                        <span class="fh-ml-disc-area">${m(u.area||"")}</span>
                        <span class="fh-ml-mealcard-glyph">${u.glyph}</span>
                        <span class="fh-ml-mealcard-name">${m(u.name)}</span>
                        ${v.length?`<span class="fh-ml-idea-uses">uses ${v.length} you have</span>`:""}
                        <button class="fh-ml-disc-save${_?" saved":""}"
                                ${_?"disabled":`data-act="meals-save-idea" data-meal="${C(u.id)}"`}>
                            ${_?"In the library \u2713":"\uFF0B Save to library"}
                        </button>
                    </div>`}).join("")}
        </div>`;return`
        <div class="fh-ml-content">
            <div class="fh-ml-lib">
                ${p}
                <div class="fh-ml-libscroll">
                    ${c}
                    ${g}
                </div>
            </div>
        </div>`}function sn(e,t,a,o,s){let i=st(),n=Z(i),r=Oe(o),d={};for(let v=0;v<7;v++){let _=Je(i,v),f=t[Z(_)];if(!f)continue;let $=rt[_.getDay()],S=(x,h)=>{x.forEach(w=>{let z=r.find(E=>E.id===w);z&&(d[w]||(d[w]={ing:z,sources:[]}),d[w].sources.length<2&&!d[w].sources.includes(h)&&d[w].sources.push(h))})};if(["b","l"].forEach(x=>{let h=f[x]?V(f[x],a):null;h&&!h.special&&S(h.ing||[],`${h.name} \xB7 ${$}`)}),f.d){let x=V(f.d.main,a);x&&!x.special&&S(Ot(x,f.d),`${x.name} \xB7 ${$}`),(f.d.sides||[]).forEach(h=>{let w=it(h);w&&S(w.ing||[],`${w.name} \xB7 ${$}`)})}}let p={};Object.values(d).forEach(v=>{let _=v.ing.aisle;p[_]||(p[_]=[]),p[_].push(v)}),Object.values(p).forEach(v=>v.sort((_,f)=>_.ing.label.localeCompare(f.ing.label)));let c=["produce","meat","dairy","bakery","pantry"].filter(v=>p[v]),b=Object.keys(d).length,g=Object.keys(d).filter(v=>s[n+":"+v]).length,u=b===0?`<div class="fh-ml-empty-note">plan a few meals first \u2014 the list builds itself from the week's menu</div>`:`
            <div class="fh-ml-groc-cols">
                ${c.map(v=>`
                    <div class="fh-ml-groc-sec">
                        <div class="fh-ml-groc-sec-hdr">${m(nt[v]||v)}</div>
                        ${p[v].map(({ing:_,sources:f})=>{let $=n+":"+_.id,S=!!s[$];return`
                                <div class="fh-ml-groc-row${S?" done":""}"
                                     data-act="meals-toggle-groc" data-key="${C($)}" data-checked="${!S}">
                                    <span class="fh-ml-check">\u2713</span>
                                    <span class="fh-ml-groc-g">${_.glyph}</span>
                                    <div class="fh-ml-groc-body">
                                        <div class="fh-ml-groc-lbl">${m(_.label)}</div>
                                        <div class="fh-ml-groc-from">${m(f.join("  \xB7  "))}</div>
                                    </div>
                                </div>`}).join("")}
                    </div>`).join("")}
            </div>`;return`
        <div class="fh-ml-content">
            <div class="fh-ml-groc">
                <div class="fh-ml-groc-head">
                    <span class="fh-ml-dayhdr-title">Shopping list</span>
                    <span class="fh-ml-dayhdr-sub">~ everything the next 7 days needs \xB7 ${g} of ${b} in the cart ~</span>
                    <span class="fh-ml-pager-spacer"></span>
                    ${g>0?`<button class="fh-ml-ghost-btn" data-act="meals-reset-groc" data-weekkey="${n}">Reset checks</button>`:""}
                </div>
                ${u}
            </div>
        </div>`}function on(e,t,a,o){let s=V(e,t);if(!s)return"";let i=Ke(s,a);return i?`
        <div class="fh-ml-modal-scrim" data-act="meals-close-recipe">
            <div class="fh-ml-modal" style="width:min(680px,90vw)">
                <div style="display:flex;align-items:center;gap:14px">
                    <span style="font-size:calc(2.4rem * var(--fh-text-scale,1));line-height:1">${s.glyph}</span>
                    <div style="flex:1">
                        <div class="fh-ml-modal-title">${m(s.name)}</div>
                        <div class="fh-ml-recipe-meta">${m(i.time)} \xB7 serves ${m(String(i.serves))}</div>
                    </div>
                    <button class="fh-ml-xbtn" data-act="meals-close-recipe">\u2715</button>
                </div>
                <div class="fh-ml-recipe-cols">
                    <div>
                        <div class="fh-ml-recipe-h">~ what you need ~</div>
                        <ul class="fh-ml-recipe-ing">
                            ${(i.ingredients||[]).map(n=>`<li>${m(n)}</li>`).join("")}
                        </ul>
                    </div>
                    <div>
                        <div class="fh-ml-recipe-h">~ how it goes ~</div>
                        <ol class="fh-ml-recipe-steps">
                            ${(i.steps||[]).map(n=>`<li>${m(n)}</li>`).join("")}
                        </ol>
                    </div>
                </div>
                <div class="fh-ml-modal-actions">
                    ${s.types.includes("d")?`<button class="fh-bk-go-btn" data-act="meals-recipe-plan" data-meal="${s.id}">Plan this dinner</button>`:""}
                    <button class="fh-ml-ghost-btn" data-act="meals-close-recipe">Close</button>
                </div>
            </div>
        </div>`:""}function nn(e,t,a){let o=V(e,a);if(!o)return"";let s=st(),i=Array.from({length:7},(n,r)=>Je(s,r));return`
        <div class="fh-ml-modal-scrim" data-act="meals-close-daypick">
            <div class="fh-ml-modal" style="width:min(700px,92vw)">
                <div class="fh-ml-modal-title">
                    ${o.glyph} ${m(o.name)}
                    <em>~ which night? ~</em>
                </div>
                <div class="fh-ml-daypick">
                    ${i.map(n=>{let r=Z(n),d=t[r],p=d&&d.d?V(d.d.main,a):null,c=r===Z(s)?"TONIGHT":rt[n.getDay()].toUpperCase()+" "+n.getDate();return`
                            <div class="fh-ml-dpick" data-act="meals-daypick-pick" data-date="${r}" data-meal="${o.id}">
                                <span class="fh-ml-dpick-dow">${c}</span>
                                ${p?`<span class="fh-ml-dpick-cur">${p.glyph} ${m(p.name)}</span>`:'<span class="fh-ml-dpick-cur open">open</span>'}
                            </div>`}).join("")}
                </div>
                <div class="fh-ml-modal-actions">
                    <button class="fh-ml-ghost-btn" data-act="meals-close-daypick">Cancel</button>
                </div>
            </div>
        </div>`}function Gt(e){return`
        <div class="fh-ml-plate" title="Food groups on the plate">
            ${Xe.map(t=>{let a=e.includes(t);return`<span class="fh-ml-gicon${a?" on":""}" title="${C(Le[t].label)}${a?"":" \u2014 not yet"}">${Le[t].icon}</span>`}).join("")}
        </div>`}function _s(e,t,a,o,s){let i=Object.entries(o).map(([r,d])=>`data-${r}="${C(d)}"`).join(" "),n=s?e.groups||[]:[];return`
        <div class="fh-ml-mealcard" data-act="${a}" ${i}>
            ${t?'<span class="fh-ml-mealcard-fav">\u2665</span>':""}
            <span class="fh-ml-mealcard-glyph">${e.glyph}</span>
            <span class="fh-ml-mealcard-name">${m(e.name)}</span>
            ${s&&n.length?Gt(n):""}
        </div>`}var Ss=N(()=>{Q();Ct()});function Es(e){return`
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#64d2ff">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#64d2ff">CALENDAR</div>
            <div class="fh-home-coming-sub">Today's schedule</div>
            <div class="fh-room-feature-list">
                ${Wt("\u{1F4C5}","Today at a Glance","Morning-to-evening schedule on the home strip")}
                ${Wt("\u{1F514}","Chore Reminders","Chore windows tied to events \u2014 'before school', 'after dinner'")}
                ${Wt("\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}","Family View","Everyone's events in one scrollable view")}
                ${Wt("\u{1F517}","Any HA Calendar","Connects to Local Calendar, CalDAV, or Google via Home Assistant")}
            </div>
            <div class="fh-home-coming-badge">COMING SOON \xB7 POWERS THE TODAY STRIP</div>
        </div>`}function Wt(e,t,a){return`
        <div class="fh-room-feature">
            <div class="fh-room-feature-icon">${e}</div>
            <div class="fh-room-feature-body">
                <div class="fh-room-feature-name">${t}</div>
                <div class="fh-room-feature-desc">${a}</div>
            </div>
        </div>`}var Cs=N(()=>{});function zs(e){return zt.find(t=>t.id===e)||null}var zt,Ut=N(()=>{na();ra();bs();Ss();Cs();Ct();zt=[{id:"chores",label:"CHORES HQ",sub:"Mission Control",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',accent:"var(--fh-accent)",status:"live",render:e=>ps(e),getStats(e){let a=(e._attrs("sensor.family_hub_claimable_tasks").all_tasks||[]).filter(i=>i.status==="pending").length,o=(e._attrs("sensor.family_hub_needs_attention").approval_queue||[]).length,s=[{label:"due today",value:a}];return o>0&&s.push({label:"need approval",value:o,accent:"var(--fh-warning)"}),s}},{id:"maintenance",label:"HOME CARE",sub:"Maintenance Tracker",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.78 15.3 19.78 21.3 21.89 19.14 15.89 13.14 13.78 15.3M17.5 10.1c-.39 0-.81-.05-1.14-.19L4.97 21.25 2.86 19.14l7.41-7.4-1.77-1.78-.72.7-1.45-1.41V12.1L5.62 12.82 2.08 9.28l.71-.72H5.62L4.18 7.11 7.78 3.5c.98-1 2.69-1 3.69 0L9.36 5.61l1.42 1.44-.72.71 1.77 1.78 2.37-2.38c-.14-.33-.2-.75-.2-1.16C14 3.79 15.79 2 18 2c.68 0 1.32.19 1.86.5L17.5 4.86l1.64 1.64L21.5 4.14C21.81 4.68 22 5.32 22 6c0 2.21-1.79 4-4 4-.18 0-.34-.03-.5-.05v.15z"/></svg>',accent:"#ff9f0a",status:"live",render:e=>Dt(e),getStats(e){let t=e._attrs("sensor.family_hub_maintenance_due"),a=t.overdue||0,o=t.due_this_week||0,s=[];return a>0&&s.push({label:"overdue",value:a,accent:"var(--fh-overdue)"}),s.push({label:"due this week",value:o}),s}},{id:"meals",label:"MEALS",sub:"Weekly menu & grocery list",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05M1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-1.46-.74-2.87-2.22-4.28-1.13-1.07-2.84-1.93-4.43-2.43-.25-.08-.5-.12-.76-.12H8.5c-.25 0-.5.04-.76.12-1.59.5-3.3 1.36-4.43 2.43C1.83 13.13 1 14.54 1 16h15.03z"/></svg>',accent:"#ff9f0a",status:"live",render:e=>$s(e),getStats(e){let t=e._attrs("sensor.family_hub_meals"),a=t.custom||[],o=t.tonight_main,s="\u2014";if(o){let i=V(o,a);i&&(s=i.name)}return[{label:"tonight",value:s}]}},{id:"smarthome",label:"SMART HOME",sub:"Lights, climate & more",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',accent:"#30d158",status:"coming",preview:"Kid-safe controls for lights, thermostat, and irrigation \u2014 right from the kitchen.",render:e=>gs(e),getStats(){return[]}},{id:"calendar",label:"CALENDAR",sub:"Today's schedule",icon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',accent:"#64d2ff",status:"coming",preview:"See today's events, upcoming reminders, and schedule \u2014 powered by your HA calendars.",render:e=>Es(e),getStats(){return[]}}]});function gt(e,t,a,o,s="fh-btn-primary"){return`
      <div class="fh-modal">
        <div class="fh-modal-title">${e}</div>
        ${t}
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn ${s}" data-act="${o}">${a}</button>
        </div>
      </div>`}function At(e,t,a,o,s="fh-btn-primary"){return`
      <div class="fh-drawer">
        <div class="fh-drawer-hdr">
          <span class="fh-drawer-title">${e}</span>
          <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="close-modal" aria-label="Close">\u2715</button>
        </div>
        <div class="fh-drawer-body">${t}</div>
        <div class="fh-drawer-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
          <button class="fh-btn ${s}" data-act="${o}">${a}</button>
        </div>
      </div>`}function qt(e,t,a){e=Math.max(0,+e||0);let o=n=>Math.max(0,Math.round(n/5)*5),s=[],i=[];for(let n=0;n<5;n++)s.push(o(e*(+t[n]||0)/100)),i.push(o(e*(+a[n]||0)/100));return{gain:s,drop:i}}function As(e){let t=e.type==="award";return gt(`${t?"Award":"Deduct"} points \u2014 ${e.data.pname}`,`<div class="fh-field">
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
       <input type="hidden" id="m-amode" value="${e.type}">`,t?"Award":"Deduct","ok-point-adjust",t?"fh-btn-success":"fh-btn-danger")}function Ms(e){let t=parseInt(e.data.pts||"0"),a=[25,50,75].map(o=>{let s=Math.round(t*o/100);return`
          <button class="fh-btn fh-btn-primary" data-act="do-partial"
                  data-tid="${C(e.data.tid)}" data-frac="${o/100}"
                  style="flex:1;flex-direction:column;gap:2px;padding:12px 6px">
            <span style="font-size:1.1rem;font-weight:800">${o}%</span>
            <span style="font-size:.78rem;opacity:.85">${s} pts</span>
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
      </div>`}function dn(e){let t=new Map;for(let a of sa){let o=a.category||"Other";t.has(o)||t.set(o,[]),t.get(o).push(a)}return[...t.entries()].map(([a,o])=>`
        <div class="fh-icon-picker-cat-hdr">${m(a)}</div>
        <div class="fh-icon-picker-cat-grid">
          ${o.map(({key:s,label:i})=>`
            <button class="fh-icon-cell${e===s?" selected":""}"
                    data-act="pick-icon" data-icon="${s}" type="button"
                    title="${i}">
              ${pe(s,null,"28px")}
              <span class="fh-icon-cell-label">${i}</span>
            </button>`).join("")}
        </div>`).join("")}function cn(e){let t=new Map;for(let a of Ha){let o=a.category||"Other";t.has(o)||t.set(o,[]),t.get(o).push(a)}return[...t.entries()].map(([a,o])=>`
        <div class="fh-icon-picker-cat-hdr">${m(a)}</div>
        <div class="fh-icon-picker-cat-grid">
          ${o.map(({key:s,label:i})=>`
            <button class="fh-icon-cell${e===s?" selected":""}"
                    data-act="pick-icon" data-icon="${s}" type="button"
                    title="${i}">
              ${pe(s,null,"28px")}
              <span class="fh-icon-cell-label">${i}</span>
            </button>`).join("")}
        </div>`).join("")}function pn(e){let t=typeof e=="string"&&e.startsWith("data:image/"),a=t?`<div id="m-cicon-preview" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;padding:8px;border:1px solid var(--fh-border);border-radius:6px;background:var(--fh-surface)">
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
        <div class="fh-icon-picker-grid">${cn(t?"":e||"")}</div>
        <div style="display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap">
          <button type="button" class="fh-btn fh-btn-ghost" data-act="upload-icon">
            \u{1F4F7} Upload image\u2026
          </button>
          <span style="font-size:.78rem;color:var(--fh-text-sec)">PNG/JPG, max ~256 KB</span>
        </div>
      </div>`}function hn(e,t,a,o,s="details"){let i=e||{},n=i.recurrence||{},r=n.type||"daily",d=i.assigned_to||[],p=dn(i.icon),c=sa.find(T=>T.key===i.icon),b=c?c.label:i.icon||"",g=Array.isArray(n.days_of_month)&&n.days_of_month.length?n.days_of_month:n.day_of_month?[n.day_of_month]:[1],u=r==="one_time"?"daily":r,_=`
      <div class="fh-chore-tabs">
        ${[{key:"details",label:"Details"},{key:"schedule",label:"Schedule"},{key:"rewards",label:"Points & Rewards"}].map(T=>`
          <button class="fh-chore-tab${s===T.key?" active":""}"
                  data-act="chore-tab" data-tab="${T.key}" type="button">
            ${T.label}
          </button>`).join("")}
      </div>`,f=(T,P)=>`
      <div class="fh-chore-tab-pane" data-tab="${T}"
           style="${s===T?"":"display:none"}">
        ${P}
      </div>`,$=new Map;for(let T of Ft){let P=T.category||"Other";$.has(P)||$.set(P,[]),$.get(P).push(T)}let S=[...$.entries()].map(([T,P])=>`
        <optgroup label="${C(T)}">
          ${P.map(l=>`<option value="${C(l.key)}">${m(l.name)}</option>`).join("")}
        </optgroup>`).join(""),h=f("details",`
        ${t?"":`
        <div class="fh-field fh-tpl-picker-field">
          <label class="fh-label">From template (optional)</label>
          <div class="fh-tpl-picker-row">
            <select class="fh-select" id="m-ctpl" style="flex:1">
              <option value="">\u2014 Start from scratch \u2014</option>
              ${S}
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
                   value="${C(i.name||"")}">
          </div>
          ${t?`
          <div class="fh-field" style="flex:1">
            <label class="fh-label">Active</label>
            <label class="fh-toggle" style="margin-top:8px" title="Uncheck to pause \u2014 no new tasks generate">
              <input type="checkbox" id="m-cactive" ${i.active!==!1?"checked":""}>
              <span class="fh-toggle-slider"></span>
            </label>
          </div>`:""}
        </div>
        <div class="fh-field">
          <label class="fh-label">Description (optional)</label>
          <textarea class="fh-input" id="m-cdesc" rows="3"
                    style="min-height:64px;resize:vertical;line-height:1.4"
                    placeholder="More detail\u2026">${m(i.description||"")}</textarea>
        </div>
        <div class="fh-row">
          <div class="fh-field">
            <label class="fh-label">Chore type</label>
            <select class="fh-select" id="m-ctype">
              ${dt([{value:"assigned",label:"Assigned"},{value:"claimable",label:"Claimable (bonus)"},{value:"reminder",label:"Reminder"}],i.chore_type||"assigned")}
            </select>
          </div>
          <div class="fh-field">
            <label class="fh-label">Category</label>
            <select class="fh-select" id="m-clabel">
              <option value="">\u2014 None \u2014</option>
              ${o.map(T=>`<option value="${C(T)}" ${T===i.category_label?"selected":""}>${T}</option>`).join("")}
            </select>
          </div>
        </div>
        <details class="fh-icon-details" open>
          <summary class="fh-icon-summary">
            <span class="fh-icon-summary-title">Icon</span>
            <span class="fh-icon-selected-wrap" id="m-icon-selected">
              ${i.icon?`<span class="fh-icon-sel-icon" style="display:inline-flex;width:20px;height:20px;color:var(--fh-accent)">${pe(i.icon,null,"20px")}</span> <span class="fh-icon-sel-lbl">${m(b)}</span>`:'<span class="fh-icon-sel-none">Tap to choose</span>'}
            </span>
          </summary>
          <input type="hidden" id="m-cicon" value="${C(i.icon||"")}">
          <input class="fh-input fh-icon-search" id="m-icon-search" type="search"
                 placeholder="Search icons\u2026" autocomplete="off"
                 oninput="((el)=>{const q=el.value.toLowerCase().trim(),p=el.closest('.fh-chore-tab-pane');p.querySelectorAll('.fh-icon-picker-cat-hdr').forEach(h=>{const g=h.nextElementSibling;let n=0;g.querySelectorAll('.fh-icon-cell').forEach(b=>{const m=!q||(b.title+' '+b.dataset.icon).toLowerCase().includes(q);b.style.display=m?'':'none';if(m)n++;});h.style.display=n?'':'none';g.style.display=n?'':'none';});})(this)">
          <div class="fh-icon-tab-grid">${p}</div>
        </details>
        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Reminder</div>
        <div class="fh-field">
          <label class="fh-label">Reminder time (-1 = off)</label>
          <input class="fh-input" id="m-reminder-time" type="number" min="-1" max="2359"
                 placeholder="-1 (off)"
                 value="${i.reminder_time!==void 0?i.reminder_time:-1}">
          <div class="fh-field-help">
            HHMM \u2014 e.g. 1900 for 7:00 PM. One push per task instance when the time
            is reached and it's still pending.
          </div>
        </div>
    `),w=i.rotation_pool||[],z=i.assigned_to&&i.assigned_to[0]||w[i.rotation_index||0]||w[0],E=w.indexOf(z);E<0&&(E=0);let F=w.length?w.slice(E).concat(w.slice(0,E)):[],D=f("schedule",`
        <div class="fh-form-group-lbl">Who's doing it</div>
        <div class="fh-field">
          <div class="fh-checkbox-row" style="margin-bottom:4px">
            <input type="checkbox" id="m-everyone">
            <label for="m-everyone" style="font-size:.85rem;font-weight:600;cursor:pointer">Everyone</label>
          </div>
          ${js(a,d,"m-assign-person")}
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Recurrence</div>
        <div class="fh-field">
          <select class="fh-select" id="m-crec">
            ${dt([{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},{value:"monthly_on_date",label:"Monthly"}],u)}
          </select>
        </div>
        <div id="m-dayfilter-section" class="fh-field" style="display:none">
          <label class="fh-label">Fires on (leave empty = every day)</label>
          <div class="fh-weekday-row">
            ${ta(n.day_filter||[],"m-df-day")}
          </div>
          <div class="fh-field-help">Active that day only \u2014 if not done that day it's marked skipped.</div>
        </div>
        <div id="m-weekdays-section" class="fh-field" style="display:none">
          <label class="fh-label">Reset day(s)</label>
          <div class="fh-weekday-row">
            ${ta(n.weekdays||[],"m-wd-day")}
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
                 value="${i.expires_after_days||""}">
        </div>
        <div id="m-claimable-section" class="fh-field" style="display:none">
          <label class="fh-label">Claim type</label>
          <select class="fh-select" id="m-csubtype">
            <option value="fcfs"        ${(i.claimable_subtype||"fcfs")==="fcfs"?"selected":""}>First come, first served</option>
            <option value="multi_claim" ${i.claimable_subtype==="multi_claim"?"selected":""}>Multi-claim (multiple helpers)</option>
          </select>
        </div>
        <div id="m-multi-claim-section" class="fh-field" style="display:none">
          <div class="fh-row">
            <div class="fh-field">
              <label class="fh-label">Max helpers</label>
              <input class="fh-input" id="m-max-claimants" type="number" min="2" max="20"
                     value="${i.max_claimants||2}">
            </div>
            <div class="fh-field">
              <label class="fh-label">Points mode</label>
              <select class="fh-select" id="m-points-mode">
                <option value="full"  ${(i.multi_claim_points_mode||"full")==="full"?"selected":""}>Full points each</option>
                <option value="split" ${i.multi_claim_points_mode==="split"?"selected":""}>Split evenly</option>
              </select>
            </div>
          </div>
        </div>

        <div id="m-rotation-section" class="fh-field" style="display:none">
          <div class="fh-divider"></div>
          <div class="fh-form-group-lbl">Rotation</div>
          <div class="fh-checkbox-row">
            <input type="checkbox" id="m-crot-enabled"
                   ${i.rotation_pool&&i.rotation_pool.length?"checked":""}>
            <label for="m-crot-enabled" style="font-size:.88rem">Cycle this chore through a pool of people</label>
          </div>
          <div id="m-rotation-config" class="fh-field" style="display:none">
            <label class="fh-label">Order \u2014 top is Current, the rest are Up Next</label>
            <input type="hidden" id="m-crot-pool-order" value="${C(F.join(","))}">
            <div id="m-crot-pool-widget" class="fh-rot-pool">
              ${ua(a,F)}
            </div>
            <label class="fh-label" style="margin-top:6px">Cadence</label>
            <select class="fh-select" id="m-crot-cadence">
              ${dt([{value:"per_instance",label:"Per instance (advance each time it regenerates)"},{value:"weekly",label:"Weekly (a kid holds it all week, flips on the switch day)"}],i.rotation_cadence||"per_instance")}
            </select>
            <div id="m-crot-switch-day-wrap" class="fh-field" style="margin-top:6px;${i.rotation_cadence==="weekly"?"":"display:none"}">
              <label class="fh-label">Switch day</label>
              <select class="fh-select" id="m-crot-switch-day">
                ${dt([{value:"0",label:"Monday"},{value:"1",label:"Tuesday"},{value:"2",label:"Wednesday"},{value:"3",label:"Thursday"},{value:"4",label:"Friday"},{value:"5",label:"Saturday"},{value:"6",label:"Sunday"}],String(i.rotation_switch_weekday??0))}
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
    `),R=f("rewards",`
        <div class="fh-field">
          <label class="fh-label">Points awarded on completion</label>
          <input class="fh-input" id="m-cpts" type="number" min="0"
                 value="${i.points!==void 0?i.points:10}">
        </div>
        <div class="fh-checkbox-row">
          <input type="checkbox" id="m-cappr"
                 ${i.approval_required!==!1?"checked":""}>
          <label for="m-cappr" style="font-size:.88rem">Requires parent approval</label>
        </div>

        <div class="fh-divider"></div>
        <div class="fh-form-group-lbl">Penalty for skipping</div>
        <div class="fh-checkbox-row">
          <input type="checkbox" id="m-cpenalty"
                 ${i.penalty_enabled?"checked":""}>
          <label for="m-cpenalty" style="font-size:.88rem">Apply penalty points if skipped</label>
        </div>
        <div id="m-penalty-pts-section" class="fh-field" style="display:none">
          <label class="fh-label">Penalty points</label>
          <input class="fh-input" id="m-cpenalty-pts" type="number" min="1"
                 value="${i.penalty_points||5}">
        </div>
        <div id="m-daily-threshold-section" class="fh-field" style="display:none">
          <label class="fh-label">Penalty grace (optional)</label>
          <input class="fh-input" id="m-daily-threshold" type="number" min="1"
                 placeholder="e.g. 3"
                 value="${i.daily_penalty_after_days||""}">
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
                   placeholder="e.g. 7" value="${i.streak_milestone||0}">
          </div>
          <div class="fh-field">
            <label class="fh-label">Bonus points awarded</label>
            <input class="fh-input" id="m-streak-bonus" type="number" min="0"
                   value="${i.streak_bonus_points||0}">
          </div>
        </div>
    `);return`
        ${t?`<input type="hidden" id="m-cid" value="${i.chore_id}">`:""}
        ${_}
        <div class="fh-chore-tab-panes">
          ${h}
          ${D}
          ${R}
        </div>`}function ga(e,t,a,o,s="details"){let n=t?`Edit \u2014 ${(e||{}).name}`:"Add chore",r=t?"ok-edit-chore":"ok-add-chore";return At(n,hn(e,t,a,o,s),t?"Save changes":"Add chore",r)}function Jt(e,t,a,o){let s=(e==null?void 0:e.name)||"",i=(e==null?void 0:e.description)||"",n=(e==null?void 0:e.dollar_value)??"",r=(e==null?void 0:e.scope)||"common",d=(e==null?void 0:e.person_ids)||[],p=(e==null?void 0:e.icon)||"",c=(e==null?void 0:e.category_label)||"",b=(e==null?void 0:e.max_per_period)??0,g=(e==null?void 0:e.period)||"week",u=(e==null?void 0:e.active)!==!1,v=!!(e!=null&&e.is_group_reward),_=(e==null?void 0:e.item_type)==="subscription",f=(e==null?void 0:e.subscription_period)||"monthly",$=(e==null?void 0:e.require_daily_pct)??0,S=(e==null?void 0:e.min_rank_index)??0,x=[0,1,2,3,4].map(k=>`<option value="${k}" ${S===k?"selected":""}>${k===0?"No requirement":k===4?"Rank 5 (max)":`Rank ${k+1}+`}</option>`).join(""),h=o.map(k=>`<option value="${C(k)}" ${c===k?"selected":""}>${m(k)}</option>`).join(""),w=a.filter(k=>k.type!=="parent"),z={};for(let k of(e==null?void 0:e.contributors)||[])z[k.person_id]=k.share_pct||0;let E="((sel)=>{const r=sel.getRootNode();const grp=r.getElementById('m-sgroup');if(grp&&grp.checked)return;const pSec=r.getElementById('m-sperson-section');if(pSec)pSec.style.display=sel.value==='personal'?'':'none';})(this)",F="((cb)=>{const r=cb.getRootNode();const sec=r.getElementById('m-sgroup-section');const pSec=r.getElementById('m-sperson-section');if(sec)sec.style.display=cb.checked?'':'none';if(pSec)pSec.style.display=cb.checked?'none':'';})(this)",D="((btn)=>{const inputs=[...btn.closest('#m-sgroup-section').querySelectorAll('.m-scontrib')];if(!inputs.length)return;const each=Math.floor(100/inputs.length),rem=100-each*inputs.length;inputs.forEach((inp,i)=>{inp.value=each+(i===0?rem:0);});const tot=btn.closest('#m-sgroup-section').querySelector('#m-sgroup-total');if(tot){tot.textContent='Total: 100%';tot.style.color='var(--fh-success)';}})(this)",R="((inp)=>{const sec=inp.closest('#m-sgroup-section');if(!sec)return;const tot=[...sec.querySelectorAll('.m-scontrib')].reduce((s,i)=>s+(parseInt(i.value)||0),0);const el=sec.querySelector('#m-sgroup-total');if(el){el.textContent='Total: '+tot+'%';el.style.color=tot===100?'var(--fh-success)':tot>100?'var(--fh-overdue)':'var(--fh-text-sec)';}})(this)",T="((cb)=>{const r=cb.getRootNode();const s=r.getElementById('m-ssub-section');if(s)s.style.display=cb.checked?'':'none';})(this)",P=w.map(k=>{let M=z[k.person_id]??"";return`
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="flex:1;font-size:.85rem">${m(k.name)}</span>
            <input type="number" class="fh-input m-scontrib"
                   data-pid="${C(k.person_id)}"
                   style="width:72px;text-align:right"
                   min="0" max="100" step="1" value="${M}"
                   oninput="${R}">
            <span style="font-size:.85rem">%</span>
          </div>`}).join(""),l=w.reduce((k,M)=>k+(z[M.person_id]||0),0),y=l===100?"var(--fh-success)":l>100?"var(--fh-overdue)":"var(--fh-text-sec)";return`
      ${t?`<input type="hidden" id="m-eiid" value="${e.item_id}">`:""}
      <div class="fh-field">
        <label class="fh-label">Item name *</label>
        <input class="fh-input" id="m-sname" type="text" value="${C(s)}"${t?"":" autofocus"}>
      </div>
      <div class="fh-field">
        <label class="fh-label">Description (optional)</label>
        <input class="fh-input" id="m-sdesc" type="text" value="${C(i)}">
      </div>
      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Dollar value *</label>
          <input class="fh-input" id="m-sdollar" type="number" min="0.01"
                 step="0.01" value="${n}" placeholder="e.g. 5.00">
        </div>
        <div class="fh-field">
          <label class="fh-label">Scope</label>
          <select class="fh-select" id="m-sscope" oninput="${E}">
            <option value="common"   ${r==="common"?"selected":""}>All kids</option>
            <option value="personal" ${r==="personal"?"selected":""}>Specific people</option>
          </select>
        </div>
      </div>
      <div id="m-sperson-section" class="fh-field" style="${r==="personal"&&!v?"":"display:none"}">
        <label class="fh-label">Who can see this reward?</label>
        ${js(a,d,"m-sp-person")}
      </div>

      <!-- Group reward toggle -->
      <div class="fh-field" style="border-top:1px solid var(--fh-border);padding-top:10px;margin-top:4px">
        <label class="fh-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <label class="fh-toggle">
            <input type="checkbox" id="m-sgroup" ${v?"checked":""} oninput="${F}">
            <span class="fh-toggle-slider"></span>
          </label>
          \u{1F91D} Group reward \u2014 kids chip in together
        </label>
      </div>
      <div id="m-sgroup-section" class="fh-field" style="${v?"":"display:none"}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <label class="fh-label" style="margin:0">Contributors &amp; share %</label>
          <button type="button" class="fh-btn fh-btn-ghost fh-btn-sm"
                  onclick="${D}">Equal split</button>
        </div>
        ${w.length?P+`<div id="m-sgroup-total" style="font-size:.8rem;color:${y}">Total: ${l}%</div>`:'<span style="font-size:.82rem;color:var(--fh-text-sec)">No kids found \u2014 add people first.</span>'}
      </div>

      <!-- v0.6.5: subscription type toggle + period (anchor set at subscription-approval time) -->
      <div class="fh-field" style="border-top:1px solid var(--fh-border);padding-top:10px;margin-top:4px">
        <label class="fh-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <label class="fh-toggle">
            <input type="checkbox" id="m-ssubtype" ${_?"checked":""} oninput="${T}">
            <span class="fh-toggle-slider"></span>
          </label>
          Subscription \u2014 recurring deduction
        </label>
      </div>
      <div id="m-ssub-section" ${_?"":'style="display:none"'}>
        <div class="fh-field">
          <label class="fh-label">Subscription period</label>
          <select class="fh-select" id="m-ssperiod">
            <option value="daily"     ${f==="daily"?"selected":""}>Daily</option>
            <option value="weekly"    ${f==="weekly"?"selected":""}>Weekly</option>
            <option value="monthly"   ${f==="monthly"?"selected":""}>Monthly</option>
            <option value="quarterly" ${f==="quarterly"?"selected":""}>Quarterly</option>
            <option value="biannual"  ${f==="biannual"?"selected":""}>Bi-annual</option>
            <option value="annual"    ${f==="annual"?"selected":""}>Annual</option>
          </select>
          <div class="fh-field-help">The renewal anchor day is set by the parent when approving a child's subscription request.</div>
        </div>
      </div>

      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Category</label>
          <select class="fh-select" id="m-scat">
            <option value="" ${c?"":"selected"}>(none)</option>
            ${h}
          </select>
        </div>
        <div class="fh-field">
          <label class="fh-label">Active</label>
          <label class="fh-toggle" style="margin-top:10px">
            <input type="checkbox" id="m-sactive" ${u?"checked":""}>
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
      <!-- v0.7.6: reward gates \u2014 chore-completion % + minimum rank -->
      <div class="fh-field" style="border-top:1px solid var(--fh-border);padding-top:10px;margin-top:4px">
        <label class="fh-label">Reward requirements (optional)</label>
        <div class="fh-field-help">Lock this reward until the child meets these. Leave at 0 / "No requirement" to disable.</div>
      </div>
      <div class="fh-row">
        <div class="fh-field">
          <label class="fh-label">Min daily chores done % (0 = off)</label>
          <input class="fh-input" id="m-sreqpct" type="number"
                 min="0" max="100" step="5" value="${$}" placeholder="e.g. 80">
          <div class="fh-field-help">Counts only that day's daily chores (approved). Any weekly chore due that day must also be done.</div>
        </div>
        <div class="fh-field">
          <label class="fh-label">Minimum rank</label>
          <select class="fh-select" id="m-sminrank">${x}</select>
        </div>
      </div>
      ${pn(p)}`}function Bs(e,t=[]){return gt("Add reward item",Jt(null,!1,e,t),"Add reward","ok-add-store-item")}function Fs(e,t,a=[]){return gt(`Edit \u2014 ${m(e.name)}`,Jt(e,!0,t,a),"Save changes","ok-edit-store-item")}function Rs(){return gt("Add person",`<div class="fh-field">
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
                  value="${H}" style="height:42px;padding:4px">
         </div>
       </div>`,"Add person","ok-add-person")}function Ds(e){let a=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d,p)=>`<option value="${p}" ${e.allowanceWday===p?"selected":""}>${d}</option>`).join(""),o=Array.from({length:28},(d,p)=>p+1).map(d=>`<option value="${d}" ${e.allowanceMday===d?"selected":""}>${d}</option>`).join(""),s=[{value:"classic",label:"Classic",accent:e.pcolor||"#4A90E2"},{value:"engineer",label:"Engineer",accent:"#E0B84C"},{value:"baker",label:"Baker",accent:"#8B3A2A"},{value:"dinos",label:"Dinos",accent:"#8B6A20"},{value:"hp",label:"Harry Potter",accent:"#1F4F3C"},{value:"dbz",label:"Dragon Ball Z",accent:"#FF6A1A"}],i=s.find(d=>d.value===e.theme)||s[0],n=s.map(d=>`<option value="${d.value}" ${e.theme===d.value?"selected":""}>${d.label}</option>`).join(""),r=(d,p,c)=>`
      <div class="fh-modal-section">
        <div class="fh-modal-section-hdr">
          <span class="fh-modal-section-lbl">${m(d)}</span>
          ${p?`<span class="fh-modal-section-sub">${m(p)}</span>`:""}
        </div>
        ${c}
      </div>`;return At(`Edit \u2014 ${e.pname}`,`${r("Identity","name, codename, avatar color",`
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

        ${r("Theme","personal-page look & feel",`
           <div class="fh-field">
             <label class="fh-label">Theme</label>
             <div class="fh-theme-pick">
               <span class="fh-theme-swatch" style="background:${i.accent}"></span>
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

        ${r("Allowance","scheduled point payouts",`
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
               <select class="fh-select" id="m-allowance-monthday">${o}</select>
             </div>
           </div>
        `)}

        ${r("Success streak","bonus for consistent days",`
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Threshold (% of the day's chore points)</label>
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
               Awards bonus points when this person earns at least the threshold
               share of the day's daily-chore points \u2014 bonus chores count toward it \u2014
               for N consecutive days. Rest days (nothing due) and excused chores
               don't count either way. Set milestone to 0 to disable.
             </div>
           </div>
        `)}

        ${r("Weekly streak","bonus for consistent weeks",`
           <div class="fh-row">
             <div class="fh-field">
               <label class="fh-label">Target (% of the week's chore points)</label>
               <input class="fh-input" id="m-weekly-threshold" type="number"
                      min="1" max="100" value="${e.weeklyThreshold??80}">
             </div>
             <div class="fh-field">
               <label class="fh-label">Milestone (weeks, 0 = off)</label>
               <input class="fh-input" id="m-weekly-milestone" type="number"
                      min="0" max="52" value="${e.weeklyMilestone??4}">
             </div>
           </div>
           <div class="fh-field">
             <label class="fh-label">Bonus points at each milestone</label>
             <input class="fh-input" id="m-weekly-bonus" type="number"
                    min="0" value="${e.weeklyBonusPoints??100}">
             <div class="fh-field-help">
               Awards bonus points when this person earns the target share of the
               week's chore points \u2014 every chore across the week plus bonus chores \u2014
               for N consecutive weeks. Evaluated once a week on the rank-eval day.
               Set milestone to 0 to disable.
             </div>
           </div>
        `)}

        ${r("Notifications","push targets for approvals & reminders",`
           <div class="fh-field">
             <label class="fh-label">Notify target (HA service name, blank = off)</label>
             <input class="fh-input" id="m-pnotify" type="text"
                    value="${C(e.notifyTarget||"")}"
                    placeholder="e.g. mobile_app_jackson_iphone">
             <div class="fh-field-help">HA <code>notify.*</code> service name. Works with the Companion App or Alexa Media.</div>
           </div>
        `)}

        <div class="fh-field-help">Rank tuning has moved to <strong>Settings \u2192 Ranks</strong>.</div>

        <input type="hidden" id="m-pid" value="${e.pid}">`,"Save","ok-edit-person")}function Is(e){return`
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
      </div>`}function Ts(e){return`
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
      </div>`}function Ps(e,t,a,o){let i=a.filter(n=>n.chore_type==="assigned").map(n=>{let r=o[n.chore_id]||0;return`
          <div class="fh-point-row" style="gap:8px">
            <span style="flex:1;font-size:.88rem;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                  title="${C(n.name)}">${m(n.name)}</span>
            <input class="fh-input" id="m-streak-${C(n.chore_id)}" type="number" min="0"
                   value="${r}" style="width:64px;text-align:center">
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
        <div style="display:flex;flex-direction:column;gap:6px">${i}</div>
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Done</button>
        </div>
      </div>`}function Ls(e){return At("Edit settings",`<div class="fh-field">
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
       <div class="fh-field-help">Rank evaluation &amp; reward-per-rank settings now live in the <strong>Ranks</strong> panel.</div>`,"Save","ok-edit-settings")}function ba(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=(t.people||[]).filter(x=>x.type==="kid"),o=e._ranksTab||"global",s=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],i=`
      <div class="fh-drawer-tabs">
        <button class="fh-drawer-tab ${o==="global"?"active":""}"
                data-act="ranks-tab" data-tab="global">Global</button>
        ${a.map(x=>`
          <button class="fh-drawer-tab ${o===x.person_id?"active":""}"
                  data-act="ranks-tab" data-tab="${C(x.person_id)}">${m(x.name)}</button>`).join("")}
      </div>`;if(o==="global"){let x=t.rank_eval_weekday??0,h=t.rank_default_cap??100,w=t.rank_default_drop_pct??60,z=t.rank_default_gain_pct??80,E=t.rank_dynamic_capacity!==!1,F=t.rank_ppd_ladder||[3,3.5,4,4.5,5],D=s.map((P,l)=>`<option value="${l}" ${x==l?"selected":""}>${P}</option>`).join(""),R=F.map((P,l)=>`
          <div class="fh-row" style="gap:6px;align-items:center">
            <span style="font-size:.8rem;color:var(--fh-text-sec);width:54px;flex-shrink:0">Rank ${l}</span>
            <input class="fh-input fh-ad-rank-ladder-input" type="number"
                   min="0.1" max="100" step="0.1" data-rank-idx="${l}"
                   value="${P}" style="flex:1">
            <span style="font-size:.8rem;color:var(--fh-text-sec)">\xA2/pt</span>
          </div>`).join(""),T=`
          ${i}
          <div class="fh-field">
            <label class="fh-label">Evaluate ranks on</label>
            <select class="fh-select" id="m-rank-weekday">${D}</select>
          </div>
          <div class="fh-field-help" style="margin:-2px 0 8px">
            Ranks move on this day each week, measured against each kid's
            <strong>weekly assigned chore points</strong> (rotations included; no bonus
            chores or streak bonuses) \u2014 so the bar always fits what they were actually given.
          </div>
          <div class="fh-row">
            <div class="fh-field">
              <label class="fh-label">Default drop &lt; %</label>
              <input class="fh-input" id="m-rank-drop" type="number" min="0" max="100" value="${w}">
            </div>
            <div class="fh-field">
              <label class="fh-label">Default gain \u2265 %</label>
              <input class="fh-input" id="m-rank-gain" type="number" min="0" max="100" value="${z}">
            </div>
          </div>
          <div class="fh-field-help">Default bands for any kid without their own per-rank curve (% of their weekly assigned points).</div>
          <div class="fh-divider"></div>
          <div class="fh-field">
            <label class="fh-label">Reward value per rank (\xA2/point)</label>
            <div class="fh-field-help" style="margin-bottom:6px">
              Higher rank \u2192 more cents per point \u2192 fewer points to redeem rewards.
            </div>
            ${R}
          </div>`;return At("Ranks",T,"Save","save-ranks-global")}let n=a.find(x=>x.person_id===o);if(!n)return e._ranksTab="global",ba(e);let r=tt(n.theme_key||"classic").ranks,d=n.rank_index??0,p=n.rank_curve||{},c=p.cap??100,b=t.rank_dynamic_capacity!==!1,g=n.assigned_ppw??0,u=b?g:c,v=Array.isArray(p.gain_pcts)&&p.gain_pcts.length===5?p.gain_pcts:rn.slice(),_=Array.isArray(p.drop_pcts)&&p.drop_pcts.length===5?p.drop_pcts:ln.slice(),f=qt(u,v,_),$=r.map((x,h)=>{let w=h===r.length-1,z=h===0;return`
          <div class="fh-rank-grid-row">
            <span class="fh-rank-grid-name">${h===d?"\u25B6 ":""}${m(x.name)}</span>
            <span class="fh-rank-grid-cell">
              <input class="fh-input" id="m-drop-pct-${h}" type="number" min="0" max="100"
                     value="${z?"":_[h]}" ${z?"disabled placeholder='\u2014'":""}>
              <span class="fh-rank-grid-pts" id="m-drop-pts-${h}">${z?"\u2014":f.drop[h]}</span>
            </span>
            <span class="fh-rank-grid-cell">
              <input class="fh-input" id="m-gain-pct-${h}" type="number" min="0" max="100"
                     value="${w?"":v[h]}" ${w?"disabled placeholder='\u2014'":""}>
              <span class="fh-rank-grid-pts" id="m-gain-pts-${h}">${w?"\u2014":f.gain[h]}</span>
            </span>
          </div>`}).join(""),S=`
      ${i}
      <div class="fh-field-help">
        Theme <strong>${m(n.theme_key||"classic")}</strong> \xB7 currently
        <strong>${m(U(d,r).name)}</strong>
      </div>
      <div class="fh-field">
        <label class="fh-label">Set current rank (0\u20134)</label>
        <input class="fh-input" id="m-rank-idx" type="number" min="0" max="4" value="${d}">
      </div>
      <input type="hidden" id="m-curve-cap" value="${u}">
      <div class="fh-field">
        <label class="fh-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
          <label class="fh-toggle">
            <input type="checkbox" id="m-rank-lock" ${n.rank_locked?"checked":""}>
            <span class="fh-toggle-slider"></span>
          </label>
          Lock this rank (pause weekly auto-evaluation)
        </label>
        <div class="fh-field-help">
          Off: setting the rank is a one-time promote/demote \u2014 the weekly evaluation
          can still move them after. On: their rank stays pinned here until you unlock it.
        </div>
      </div>
      <div class="fh-field-help">
        Bands are a % of ${m(n.name)}'s directly-assigned chores \u2014
        about <strong>${u} pts this week</strong> (rotations included; no bonus
        chores or streak bonuses). The point ranges below scale from that and recompute
        every week.
      </div>
      <div class="fh-rank-summary" style="font-size:var(--fh-text-sm);margin:6px 0 2px;padding:8px 10px;border:1px solid var(--fh-border);border-radius:8px;background:var(--fh-surface)">
        Now: <strong>${m(U(d,r).name)}</strong>${b&&u<=0?" \xB7 no assigned chores \u2014 rank won't move":`${d<r.length-1?` \xB7 ranks up at <strong>\u2265 ${f.gain[d]} pts/wk</strong>`:" \xB7 top rank"}${d>0?` \xB7 drops below <strong>${f.drop[d]} pts/wk</strong>`:" \xB7 can't drop"}`}
      </div>

      <div class="fh-modal-section">
        <div class="fh-modal-section-hdr"><span class="fh-modal-section-lbl">Per-rank bands</span></div>
        <div class="fh-rank-grid-row" style="margin-bottom:4px">
          <span class="fh-rank-grid-hdr">Rank</span>
          <span class="fh-rank-grid-hdr">Drop &lt; %</span>
          <span class="fh-rank-grid-hdr">Gain \u2265 %</span>
        </div>
        <div class="fh-rank-grid">${$}</div>
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="ranks-preview"
                style="margin-top:8px">\u21BB Recompute points</button>
        <div class="fh-field-help" style="margin-top:6px">
          \u25B6 marks the current rank. Bottom rung can't fall; top rung can't climb.
        </div>
      </div>

      <input type="hidden" id="m-rank-pid" value="${C(n.person_id)}">`;return At(`Ranks \u2014 ${m(n.name)}`,S,"Save","save-ranks-kid")}function Os(e,t){let a=t.filter(s=>s.type==="kid");if(!a.length)return`
          <div class="fh-modal">
            <div class="fh-modal-title">Claim \u2014 ${m(e.data.name)}</div>
            <p class="fh-empty">No eligible people to claim this chore.</p>
            <div class="fh-modal-footer">
              <button class="fh-btn fh-btn-ghost" data-act="close-modal">Close</button>
            </div>
          </div>`;let o=a.map(s=>{let i=s.avatar_color||H;return`
          <button class="fh-claim-tile" data-act="ok-claim"
                  data-tid="${e.data.tid}" data-pid="${s.person_id}"
                  style="--tile-color:${i}">
            <div class="fh-claim-tile-avatar" style="background:${i}">${j(s.name)}</div>
            ${s.code?`<div class="fh-claim-tile-code">${m(s.code)}</div>`:""}
            <div class="fh-claim-tile-name">${m(s.name)}</div>
          </button>`}).join("");return`
      <div class="fh-modal">
        <div class="fh-modal-title">Claim \u2014 ${m(e.data.name)}</div>
        <p style="font-size:.88rem;color:var(--fh-text-sec);margin:0 0 12px;line-height:1.4">
          Who's claiming this chore?
        </p>
        <div class="fh-claim-grid">${o}</div>
        <input type="hidden" id="m-cltid" value="${e.data.tid}">
        <div class="fh-modal-footer">
          <button class="fh-btn fh-btn-ghost" data-act="close-modal">Cancel</button>
        </div>
      </div>`}function Ns(e,t){return gt("Add personal reminder",`<div class="fh-field">
         <label class="fh-label">Reminder name *</label>
         <input class="fh-input" id="m-rname" type="text" autofocus
                placeholder="e.g. Take vitamins, Feed the dog">
       </div>
       <div class="fh-row">
         <div class="fh-field">
           <label class="fh-label">Who?</label>
           <select class="fh-select" id="m-rperson">
             ${t.map(a=>{var o;return`<option value="${a.person_id}"
                          ${((o=e.data)==null?void 0:o.pid)===a.person_id?"selected":""}>${m(a.name)}</option>`}).join("")}
           </select>
         </div>
         <div class="fh-field">
           <label class="fh-label">Recurrence</label>
           <select class="fh-select" id="m-rrec">
             ${dt([{value:"daily",label:"Daily"},{value:"weekly",label:"Weekly"},{value:"every_n_days",label:"Every N days"},{value:"monthly_on_date",label:"Monthly"}],"daily")}
           </select>
         </div>
       </div>`,"Add","ok-add-reminder")}function ua(e,t){let a=new Map(e.map(d=>[d.person_id,d])),o=t.map(d=>a.get(d)).filter(Boolean),s=new Set(t),i=e.filter(d=>!s.has(d.person_id)),n=o.length?o.map((d,p)=>{let c=d.avatar_color||H,b=p===0?"disabled":"",g=p===o.length-1?"disabled":"";return`${p===0?'<div class="fh-rot-section-hdr">Current</div>':p===1?'<div class="fh-rot-section-hdr">Up Next</div>':""}
              <div class="fh-rot-item${p===0?" fh-rot-item--current":""}" data-pid="${C(d.person_id)}" style="--chip-color:${c}">
                <span class="fh-avatar" style="background:${c};width:22px;height:22px;font-size:.7rem">${j(d.name)}</span>
                <span class="fh-rot-name">${m(d.name)}</span>
                <button type="button" class="fh-rot-ctrl" data-act="rot-pool-up"
                        data-pid="${C(d.person_id)}" ${b} aria-label="Move up">\u2191</button>
                <button type="button" class="fh-rot-ctrl" data-act="rot-pool-down"
                        data-pid="${C(d.person_id)}" ${g} aria-label="Move down">\u2193</button>
                <button type="button" class="fh-rot-ctrl fh-rot-ctrl-remove"
                        data-act="rot-pool-remove" data-pid="${C(d.person_id)}"
                        aria-label="Remove from pool">\xD7</button>
              </div>`}).join(""):'<div class="fh-rot-empty">No one in the pool yet \u2014 add a kid below.</div>',r=i.length?i.map(d=>{let p=d.avatar_color||H;return`
              <button type="button" class="fh-rot-add"
                      data-act="rot-pool-add" data-pid="${C(d.person_id)}"
                      style="--chip-color:${p}">
                <span class="fh-avatar" style="background:${p};width:18px;height:18px;font-size:.6rem">${j(d.name)}</span>
                + ${m(d.name)}
              </button>`}).join(""):'<div class="fh-rot-add-empty">Everyone is in the pool.</div>';return`
      <div class="fh-rot-ordered">${n}</div>
      <div class="fh-rot-available-lbl">Add to pool:</div>
      <div class="fh-rot-available">${r}</div>`}function Hs(e,t,a,o){let s=Math.min(a,o),i=`
        <div class="fh-field">
            <label>Chip in toward <strong>${m((e==null?void 0:e.name)||"reward")}</strong></label>
            <div style="font-size:.8rem;color:var(--fh-text-sec);margin-bottom:8px">
                Your share remaining: ${o} pts \xB7 Your balance: ${a} pts
            </div>
            <input id="m-chipin-pts" class="fh-input" type="number"
                   min="1" max="${s}" value="${s}"
                   style="width:120px">
            <span style="font-size:.85rem;color:var(--fh-text-sec)">pts</span>
        </div>
        <input type="hidden" id="m-chipin-iid" value="${C((e==null?void 0:e.item_id)||"")}">
        <input type="hidden" id="m-chipin-pid" value="${C(t)}">`;return gt("Chip In \u2014 Group Reward",i,"Chip In","ok-chip-in")}function js(e,t,a){return e.length?`<div class="fh-person-cb-list">
      ${e.map(o=>{let s=(t||[]).includes(o.person_id),i=o.avatar_color||H;return`<label class="fh-person-cb-chip ${s?"checked":""}"
                         style="--chip-color:${i}">
            <input type="checkbox" class="${a}"
                   value="${o.person_id}" ${s?"checked":""}>
            <span class="fh-avatar" style="background:${i};width:18px;height:18px;font-size:.6rem">
              ${j(o.name)}
            </span>
            ${m(o.name)}
          </label>`}).join("")}
    </div>`:'<span style="font-size:.82rem;color:var(--fh-text-sec)">No people found.</span>'}var rn,ln,Kt=N(()=>{K();K();Q();ut();_t();et();rn=[50,60,75,95,0],ln=[0,40,55,75,95]});function mn(e){if(!e)return"";let t=/^(\d{4})-(\d{2})-(\d{2})/.exec(e);return t?new Date(+t[1],+t[2]-1,+t[3]).toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric"}):e}function gn(e){var t;switch((t=e.recurrence)==null?void 0:t.type){case"daily":case"every_n_days":return"daily";case"weekly":case"every_n_weeks":return"weekly";case"monthly_on_date":return"monthly";case"one_time":return"one_time";default:return"other"}}function Us(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=t.people||[],o=t.approval_queue||[],s=t.redemption_queue||[],i=t.group_proposal_queue||[],n=t.subscription_cancel_queue||[],r=t.active_chores||[],d=t.all_chores||r,p=t.category_labels||[],c=t.family_name||"Family Hub",b=t.store_items||[],u=[{id:"today",label:"Today",icon:"\u25D0",badge:o.length+s.length+i.length+n.length},{id:"family",label:"Family",icon:"\u25CD",badge:0},{id:"tasks",label:"Chores",icon:"\u25C9",badge:0},{id:"rewards",label:"Rewards",icon:"\u25C8",badge:0},{id:"meals",label:"Meals",icon:"\u25C7",badge:0},{id:"history",label:"History",icon:"\u25D1",badge:0},{id:"settings",label:"Settings",icon:"\u25CE",badge:0}],v=e._adminSec,_="";switch(v){case"today":_=Gs(o,s,i,n,t);break;case"family":_=bn(a,t,e);break;case"tasks":_=un(d,a,p,e);break;case"rewards":_=Sn(b,a,p,e);break;case"meals":_=Bn(e);break;case"history":_=zn(t,e);break;case"settings":_=An(t,a,e);break;default:_=Gs(o,s,i,[],t)}let f={today:{crumb:"OVERVIEW",title:"Today",actions:`<button class="fh-ad-btn fh-ad-btn--ghost" data-act="export-backup">Export backup</button>
                              <button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${W.plus} Add chore</button>`},family:{crumb:"PEOPLE",title:"Family",actions:`<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-person">${W.person} Add person</button>`},tasks:{crumb:"CHORES",title:"Chores",actions:`<button class="fh-ad-btn fh-ad-btn--ghost" data-act="print-chore-list" title="Open a printable chore list in a new tab">${W.print} Print</button>
                              <button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${W.plus} Add chore</button>`},rewards:{crumb:"REWARDS",title:"Rewards",actions:`<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-store-item">${W.plus} Add reward</button>`},meals:{crumb:"MEAL PLANNER",title:"Meals",actions:""},history:{crumb:"ACTIVITY",title:"History",actions:""},settings:{crumb:"CONFIGURATION",title:"Settings",actions:""}},$=f[v]||f.today,S=u.map(h=>`
      <div class="fh-ad-nav-item ${v===h.id?"active":""}"
           data-act="admin-sec" data-sec="${h.id}">
        <span class="fh-ad-nav-icon">${h.icon}</span>
        <span class="fh-ad-nav-label">${h.label}</span>
        ${h.badge>0?`<span class="fh-ad-nav-badge">${h.badge}</span>`:""}
      </div>`).join(""),x=u.map(h=>`
      <div class="fh-ad-bottom-item ${v===h.id?"active":""}"
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
              <div class="fh-ad-brand-name">${m(c)}</div>
              <div class="fh-ad-brand-sub">v${lt} \xB7 ADMIN</div>
            </div>
          </div>
          <nav class="fh-ad-nav">${S}</nav>
        </aside>

        <div class="fh-ad-main">
          <div class="fh-ad-topbar">
            <div>
              <div class="fh-ad-topbar-crumb">${$.crumb}</div>
              <div class="fh-ad-topbar-title">${$.title}</div>
            </div>
            <div class="fh-ad-topbar-actions">${$.actions}</div>
          </div>
          <div class="fh-ad-body">${_}</div>
        </div>

        <nav class="fh-ad-bottom-nav">${x}</nav>

      </div>`}function Gs(e,t,a,o,s){let i=s.people||[],n=s.active_chores||[],r=s.history_log||[],p=(s.store_items||[]).filter(h=>{if(!h.is_group_reward||!h.active)return!1;let w=h.contributors||[];return w.length>0&&w.every(z=>(z.contributed_pts||0)>=(z.target_pts||0))}),b=[{label:"APPROVAL QUEUE",value:e.length,accent:e.length>0?"#F5C24A":"#58D38A"},{label:"REDEEM QUEUE",value:t.length,accent:t.length>0?"#E36DA4":"#58D38A"},{label:"GROUP PROPOSALS",value:a.length+p.length,accent:a.length+p.length>0?"#58D38A":"#A6B3CC"},{label:"ACTIVE CHORES",value:n.filter(h=>h.active!==!1).length,accent:"#5B8DEF"}].map(h=>`
      <div class="fh-ad-stat">
        <div class="fh-ad-stat-val" style="color:${h.accent}">${h.value}</div>
        <div class="fh-ad-stat-lbl">${h.label}</div>
      </div>`).join(""),g=[...e.map(h=>({...h,kind:"approval"})),...t.map(h=>({...h,kind:"redemption"})),...a.map(h=>({...h,kind:"group-proposal"})),...p.map(h=>({...h,kind:"group-funded"})),...o.map(h=>({...h,kind:"cancel-sub"}))],u=g.length>0?g.map(h=>{if(h.kind==="group-proposal"){let l=h.proposer_color||H,y=(h.invitees||[]).map(k=>k.person_name||"?").join(", ");return`
                  <div class="fh-ad-queue-row">
                    <div class="fh-avatar" style="background:${l};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${j(h.proposer_name)}</div>
                    <div class="fh-ad-queue-info">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#4CAF7D">GROUP</span>
                      </div>
                      <div class="fh-ad-queue-name">${m(h.item_name||"")}</div>
                      <div class="fh-ad-queue-meta">${m(h.proposer_name)} + ${m(y)}</div>
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="approve-group-proposal"
                            data-propid="${C(h.proposal_id)}"
                            data-by="admin">${W.check}</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="decline-group-proposal-parent"
                            data-propid="${C(h.proposal_id)}"
                            data-by="admin">${W.close}</button>
                  </div>`}if(h.kind==="group-funded"){let l=(h.contributors||[]).reduce((k,M)=>k+(M.contributed_pts||0),0),y=(h.contributors||[]).map(k=>k.person_name||"?").join(", ");return`
                  <div class="fh-ad-queue-row">
                    <div style="width:32px;height:32px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem">\u{1F91D}</div>
                    <div class="fh-ad-queue-info">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#4CAF7D">FUNDED</span>
                      </div>
                      <div class="fh-ad-queue-name">${m(h.name||"")}</div>
                      <div class="fh-ad-queue-meta">${m(y)} \xB7 ${O(l)} pts pooled</div>
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="redeem-group-reward"
                            data-iid="${C(h.item_id)}"
                            data-iname="${C(h.name||"")}">Redeem</button>
                  </div>`}if(h.kind==="cancel-sub"){let l=h.person_color||H,y=(h.period||"").replace("_"," ");return`
                  <div class="fh-ad-queue-row">
                    <div class="fh-avatar" style="background:${l};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${j(h.person_name||"?")}</div>
                    <div class="fh-ad-queue-info">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#9B59B6">CANCEL</span>
                        <span class="fh-ad-queue-time">${ne(h.cancellation_requested_at||"")}</span>
                      </div>
                      <div class="fh-ad-queue-name">${m(h.item_name||"")}</div>
                      <div class="fh-ad-queue-meta">${m(h.person_name||"")} \xB7 ${m(y)} subscription</div>
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="approve-cancel-subscription"
                            data-subid="${C(h.subscription_id||h.id||"")}">${W.check}</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="decline-cancel-subscription"
                            data-subid="${C(h.subscription_id||h.id||"")}">${W.close}</button>
                  </div>`}let w=h.person_color||H,z=h.kind==="approval",E=z?h.chore_name||"":h.item_name||"",F=z?h.chore_points:h.points_cost,D=z?'<span class="fh-ad-pill fh-ad-pill--amber">CHORE</span>':'<span class="fh-ad-pill fh-ad-pill--rose">REWARD</span>',R=s.store_items||[],T=z?null:R.find(l=>l.item_id===h.item_id);if(!z&&(T==null?void 0:T.item_type)==="subscription"){let l=T.subscription_period||"monthly",y=C(h.redemption_id),M=l==="daily"?"":l==="weekly"?`<div style="display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap">
                         <span style="font-size:.78rem;color:var(--fh-text-sec)">Renews on:</span>
                         <select id="m-sub-wday-${y}" class="fh-select" style="width:auto">
                           ${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((A,B)=>`<option value="${B}">${A}</option>`).join("")}
                         </select>
                       </div>`:`<div style="display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap">
                         <span style="font-size:.78rem;color:var(--fh-text-sec)">Renews day of month:</span>
                         <input type="number" id="m-sub-dom-${y}" class="fh-input"
                                min="1" max="31" value="1" style="width:64px">
                       </div>`;return`
                  <div class="fh-ad-queue-row" style="flex-wrap:wrap;row-gap:4px">
                    <div class="fh-avatar" style="background:${w};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${j(h.person_name)}</div>
                    <div class="fh-ad-queue-info" style="flex:1;min-width:0">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#9B59B6">SUBSCRIBE</span>
                        <span class="fh-ad-queue-time">${h.when||""}</span>
                      </div>
                      <div class="fh-ad-queue-name">${m(h.item_name||"")}</div>
                      <div class="fh-ad-queue-meta">${m(h.person_name||"")} \xB7 ${m(l)} \xB7 \u2212${O(F)}pts</div>
                      ${M}
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="approve-subscription-redemption"
                            data-rid="${y}"
                            data-period="${C(l)}">${W.check}</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="decline-redemption"
                            data-rid="${y}">${W.close}</button>
                  </div>`}return`
              <div class="fh-ad-queue-row">
                <div class="fh-avatar" style="background:${w};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${j(h.person_name)}</div>
                <div class="fh-ad-queue-info">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                    ${D}
                    <span class="fh-ad-queue-time">${h.when||""}</span>
                  </div>
                  <div class="fh-ad-queue-name">${m(E)}</div>
                  <div class="fh-ad-queue-meta">${m(h.person_name||"")} \xB7 ${z?"+":"\u2212"}${O(F)}${z&&h.due_date?` \xB7 for ${m(mn(h.due_date))}`:""}</div>
                </div>
                <button class="fh-btn fh-btn-success fh-btn-sm" data-act="${z?"approve-task":"approve-redemption"}" data-${z?"tid":"rid"}="${z?h.task_id:h.redemption_id}">${W.check}</button>
                ${z?`<button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-partial"
                        data-tid="${h.task_id}" data-name="${C(E)}" data-pts="${F}"
                        title="Partial credit" style="font-weight:800;font-size:1rem">\xBD</button>`:""}
                <button class="fh-btn fh-btn-danger  fh-btn-sm" data-act="${z?"deny-task":"decline-redemption"}" data-${z?"tid":"rid"}="${z?h.task_id:h.redemption_id}">${W.close}</button>
              </div>`}).join(""):'<div class="fh-empty fh-ad-empty">Nothing needs your attention right now. \u2713</div>',v=Date.now()-1728e5,_=r.filter(h=>new Date(h.timestamp).getTime()>v),f=new Map,$=[];for(let h of _)if(h.type==="task_skipped"){let w=h.skipped_date||(h.timestamp||"").slice(0,10)||"",z=`${h.person_id}:${w}`;f.has(z)||f.set(z,{personName:h.person_name||"",color:h.person_color||H,date:w,totalPts:0,count:0,timestamp:h.timestamp||""});let E=f.get(z);E.totalPts+=Math.abs(h.points_delta||0),E.count++,(h.timestamp||"")>E.timestamp&&(E.timestamp=h.timestamp)}else $.push(h);let S=[...$.map(h=>({kind:"entry",e:h})),...[...f.values()].map(h=>({kind:"skip",g:h}))].sort((h,w)=>{let z=h.kind==="entry"?h.e.timestamp||"":h.g.timestamp||"";return(w.kind==="entry"?w.e.timestamp||"":w.g.timestamp||"").localeCompare(z)}).slice(0,15),x=S.length>0?S.map(h=>{if(h.kind==="skip"){let{personName:T,color:P,date:l,totalPts:y,count:k}=h.g;return`
                  <div class="fh-ad-activity-row">
                    <div class="fh-avatar" style="background:${P};width:28px;height:28px;font-size:var(--fh-text-xs);flex-shrink:0">${T?j(T):"\u2014"}</div>
                    <div style="flex:1;min-width:0">
                      <div class="fh-ad-activity-name">
                        <span style="font-weight:700">${m(T)}</span>
                        missed ${k} task${k!==1?"s":""}
                      </div>
                      <div class="fh-ad-activity-meta" style="color:var(--fh-warning)">Skipped \xB7 ${m(l)}</div>
                    </div>
                    ${y>0?`<span style="font-family:'JetBrains Mono',monospace;font-size:var(--fh-text-xs);font-weight:700;color:var(--fh-overdue);flex-shrink:0">\u2212${y}pts</span>`:""}
                  </div>`}let w=h.e,z=ie[w.type]||{label:w.type,color:"#6F7E9C"},E=w.person_color||H,F=w.points_delta,D=F>0?"#58D38A":F<0?"#E8553E":"#6F7E9C",R=F?`<span style="font-family:'JetBrains Mono',monospace;font-size:var(--fh-text-xs);font-weight:700;color:${D};flex-shrink:0">${F>0?"+":""}${F}pts</span>`:"";return`
              <div class="fh-ad-activity-row">
                <div class="fh-avatar" style="background:${E};width:28px;height:28px;font-size:var(--fh-text-xs);flex-shrink:0">${w.person_name?j(w.person_name):"\u2014"}</div>
                <div style="flex:1;min-width:0">
                  <div class="fh-ad-activity-name">
                    <span style="font-weight:700">${m(w.person_name||"")}</span>
                    ${m(w.chore_name||w.note||"")}
                  </div>
                  <div class="fh-ad-activity-meta" style="color:${z.color}">${m(z.label)}</div>
                </div>
                ${R}
                <span class="fh-ad-activity-time">${ne(w.timestamp)}</span>
              </div>`}).join(""):'<div class="fh-empty fh-ad-empty">No recent activity.</div>';return`
      <div class="fh-ad-stat-row">${b}</div>
      <div class="fh-ad-today-grid">
        <div class="fh-ad-panel fh-ad-today-queue">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Needs your attention</span>
            <span class="fh-ad-panel-sub">${g.length} item${g.length!==1?"s":""}</span>
          </div>
          ${u}
        </div>
        <div class="fh-ad-panel fh-ad-today-activity">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Recent activity</span>
            <span class="fh-ad-panel-sub">last 48 hours</span>
          </div>
          ${x}
        </div>
      </div>`}function bn(e,t,a){let o=t.points_per_dollar||10,s=t.penalties_paused_global||!1,i=e.map(f=>{let $=f.avatar_color||H,S=f.penalties_paused||!1,x=f.type==="kid",h,w;return s?(h="Penalties & streaks off (global)",w="off-global"):S?(h="Penalties & streaks off",w="off"):(h="Penalties & streaks on",w=""),`
          <div class="fh-ad-person-card">
            <div class="fh-ad-person-top">
              <div class="fh-avatar" style="background:${$};width:40px;height:40px;font-size:1rem;flex-shrink:0">${j(f.name)}</div>
              <div style="flex:1;min-width:0">
                <div class="fh-ad-person-name">
                  ${m(f.name)}
                  <span class="fh-ad-person-type">${ea(f.type)}</span>
                  ${f.code?`<span class="fh-ad-person-code">${m(f.code)}</span>`:""}
                </div>
                <div class="fh-ad-person-bal">
                  ${O(f.points_balance)}pts \xB7 ${G(f.points_balance/o)} \xB7 lifetime ${O(f.points_lifetime)}${f.allowance_points>0?` \xB7 ${f.allowance_points}pts/${f.allowance_schedule==="monthly"?"mo":f.allowance_schedule==="biweekly"?"2wk":"wk"} allowance`:""}
                </div>
              </div>
            </div>
            <div class="fh-ad-person-btns">
                <button class="fh-btn fh-btn-success fh-btn-sm" data-act="open-award"
                        data-pid="${f.person_id}" data-pname="${C(f.name)}"
                        title="Award points">${W.award}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm" data-act="open-deduct"
                        data-pid="${f.person_id}" data-pname="${C(f.name)}"
                        title="Deduct points">${W.minus}</button>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-person"
                        data-pid="${f.person_id}"
                        data-pname="${C(f.name)}"
                        data-ptype="${f.type}"
                        data-pcolor="${f.avatar_color||H}"
                        data-pallowpts="${f.allowance_points||0}"
                        data-pallowsched="${f.allowance_schedule||"weekly"}"
                        data-pallowwday="${f.allowance_weekday??5}"
                        data-pallowmday="${f.allowance_monthday||1}"
                        data-pnotify="${C(f.notify_target||"")}"
                        data-pcode="${C(f.code||"")}"
                        data-ptheme="${C(f.theme_key||"classic")}"
                        data-pchildmode="${f.child_mode===!0}"
                        data-pcompletionthreshold="${f.completion_threshold_pct??80}"
                        data-pcompletionmilestone="${f.completion_milestone??7}"
                        data-pcompletionbonus="${f.completion_bonus_points??50}"
                        data-pweeklythreshold="${f.weekly_completion_threshold_pct??80}"
                        data-pweeklymilestone="${f.weekly_completion_milestone??4}"
                        data-pweeklybonus="${f.weekly_completion_bonus_points??100}"
                        title="Edit person">${W.edit}</button>
            </div>
            ${x?`
              <div class="fh-ad-person-foot">
                <span class="fh-penalty-pause-label ${w}">${h}</span>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-streaks"
                        data-pid="${f.person_id}" data-pname="${C(f.name)}">\u{1F525} Streaks</button>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-ranks"
                        data-pid="${f.person_id}">\u{1F3C5} Ranks</button>
                <label class="fh-toggle" style="width:36px;height:20px"
                       title="${S?"Resume":"Pause"} penalties &amp; streaks">
                  <input type="checkbox" data-act="toggle-person-penalty"
                         data-pid="${f.person_id}" ${S?"":"checked"}>
                  <span class="fh-toggle-slider"></span>
                </label>
              </div>`:""}
            <button class="fh-ad-person-del" data-act="open-confirm-remove-person"
                    data-pid="${f.person_id}" data-pname="${C(f.name)}"
                    title="Remove ${C(f.name)}">${W.trash}</button>
          </div>`}).join("")||'<div class="fh-empty fh-ad-empty">No people found.</div>',n=t.all_subscriptions||[],r=a._editingSubId||null,d=new Map;for(let f of n)d.has(f.person_id)||d.set(f.person_id,[]),d.get(f.person_id).push(f);let p={daily:"Daily",weekly:"Weekly",monthly:"Monthly",quarterly:"Quarterly",biannual:"Biannual",annual:"Annual"},c=[{v:"weekly",l:"Weekly"},{v:"monthly",l:"Monthly"},{v:"quarterly",l:"Quarterly"},{v:"biannual",l:"Biannual"},{v:"annual",l:"Annual"}],b={active:"Active",lapsed:"Lapsed",cancel_pending:"Cancel pending"},g={active:"var(--fh-success)",lapsed:"var(--fh-overdue)",cancel_pending:"var(--fh-warning)"},u=n.length===0?'<div class="fh-empty fh-ad-empty">No active subscriptions.</div>':[...d.entries()].map(([f,$])=>{let S=$[0].person_color||H,x=$[0].person_name||"Unknown",h=$.map(w=>{let z=w.subscription_id,E=z===r,F=g[w.status]||"var(--fh-text-sec)",D=b[w.status]||w.status,R=p[w.period]||w.period,T=w.accumulated_debt>0?`<span style="color:var(--fh-overdue);font-size:.75rem"> \xB7 owes ${O(w.accumulated_debt)}pts</span>`:"",P=w.dollar_cost_override!=null?`${G(w.effective_dollar)} (override) \xB7 ${O(w.effective_cost)}pts`:`${G(w.effective_dollar)} \xB7 ${O(w.effective_cost)}pts`;if(E){let l=c.map(y=>`<option value="${y.v}"${w.period===y.v?" selected":""}>${y.l}</option>`).join("");return`
                      <div style="padding:10px 0;border-bottom:1px solid var(--fh-border)">
                        <div style="font-size:.88rem;font-weight:600;margin-bottom:8px">${m(w.item_name)}</div>
                        <div style="display:grid;grid-template-columns:90px 1fr;gap:5px 10px;align-items:center;margin-bottom:8px">
                          <label style="font-size:.75rem;color:var(--fh-text-sec)">Period</label>
                          <select id="sub-edit-period-${C(z)}" class="fh-input" style="height:28px;font-size:.8rem;padding:0 6px">
                            ${l}
                          </select>
                          <label style="font-size:.75rem;color:var(--fh-text-sec)">Cost override $</label>
                          <input id="sub-edit-cost-${C(z)}"
                                 type="number" min="0" step="0.01"
                                 value="${w.dollar_cost_override??""}"
                                 placeholder="${G(w.item_dollar_value)}"
                                 class="fh-input" style="height:28px;font-size:.8rem;padding:0 6px">
                          <label style="font-size:.75rem;color:var(--fh-text-sec)">Next renewal</label>
                          <input id="sub-edit-date-${C(z)}"
                                 type="date"
                                 value="${C(w.next_renewal_date||"")}"
                                 class="fh-input" style="height:28px;font-size:.8rem;padding:0 6px">
                        </div>
                        <div style="font-size:.7rem;color:var(--fh-text-sec);margin-bottom:8px">
                          Leave cost blank to use item default (${G(w.item_dollar_value)})
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
                        <span style="font-size:.88rem;font-weight:600">${m(w.item_name)}</span>
                        <span style="font-size:.7rem;font-weight:700;color:${F}">${m(D)}</span>
                      </div>
                      <div style="font-size:.75rem;color:var(--fh-text-sec)">
                        ${m(R)} \xB7 ${P}${T}
                      </div>
                      <div style="font-size:.72rem;color:var(--fh-text-sec);margin-top:1px">
                        Renews ${m(w.next_renewal_date||"\u2014")}
                      </div>
                    </div>
                    <button class="fh-btn fh-btn-ghost fh-btn-sm"
                            data-act="admin-edit-subscription-open"
                            data-subid="${C(z)}"
                            title="Edit period / cost">\u270E</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="admin-cancel-subscription"
                            data-subid="${C(z)}"
                            data-sname="${C(w.item_name)}"
                            title="Cancel subscription">\u2715</button>
                  </div>`}).join("");return`
              <div style="margin-bottom:12px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                  <div class="fh-avatar" style="background:${S};width:26px;height:26px;font-size:.7rem;flex-shrink:0">${j(x)}</div>
                  <span style="font-size:.9rem;font-weight:600">${m(x)}</span>
                </div>
                ${h}
              </div>`}).join(""),v=t.inactive_people||[],_=v.length===0?"":`
      <div class="fh-ad-panel" style="margin-top:4px">
        <div class="fh-ad-panel-hdr">
          <span class="fh-ad-panel-title">Inactive members</span>
          <span class="fh-ad-panel-sub">${v.length} deactivated</span>
        </div>
        <div class="fh-ad-panel-body">
          <div style="font-size:var(--fh-text-sm);color:var(--fh-text-sec);margin-bottom:10px">
            Deactivated people are hidden from dashboards but kept so their history stays intact
            (e.g. a kid away at camp). Reactivate to bring them back, or permanently delete to purge
            them and all their data.
          </div>
          ${v.map(f=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--fh-border)">
              <div class="fh-avatar" style="background:${f.avatar_color||H};width:30px;height:30px;font-size:.85rem;flex-shrink:0">${j(f.name)}</div>
              <div style="flex:1;min-width:0">
                <span style="font-weight:600;font-size:var(--fh-text-base)">${m(f.name)}</span>
                <span style="font-size:var(--fh-text-xs);color:var(--fh-text-sec)"> \xB7 ${ea(f.type)} \xB7 lifetime ${O(f.points_lifetime)}</span>
              </div>
              <button class="fh-btn fh-btn-success fh-btn-sm" data-act="reactivate-person"
                      data-pid="${f.person_id}" data-pname="${C(f.name)}"
                      title="Reactivate ${C(f.name)}">\u21BA Reactivate</button>
              <button class="fh-btn fh-btn-danger fh-btn-sm" data-act="open-confirm-hard-delete-person"
                      data-pid="${f.person_id}" data-pname="${C(f.name)}"
                      title="Permanently delete ${C(f.name)}">${W.trash}</button>
            </div>
          `).join("")}
        </div>
      </div>`;return`
      <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start">

        <div style="flex:1 1 540px;min-width:0">
          <div class="fh-ad-family-grid">${i}</div>
          <div class="fh-ad-panel" style="margin-top:4px">
            <div class="fh-ad-panel-hdr">
              <span class="fh-ad-panel-title">Global controls</span>
            </div>
            <div class="fh-ad-panel-body">
              <div class="fh-toggle-row" style="border-left:3px solid ${s?"var(--fh-warning)":"var(--fh-success)"}">
                <div>
                  <div style="font-size:.9rem;font-weight:600">Penalties &amp; streaks active</div>
                  <div style="font-size:.75rem;color:var(--fh-text-sec)">
                    ${s?"\u23F8 Paused globally \u2014 skips won&#39;t break streaks or deduct points":"Applying normally at the daily tick"}
                  </div>
                </div>
                <label class="fh-toggle">
                  <input type="checkbox" data-act="toggle-global-penalty" ${s?"":"checked"}>
                  <span class="fh-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          ${_}
        </div>

        <div class="fh-ad-tasks-panel" style="flex:1 1 420px;min-width:360px;max-width:460px">
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1">
              <div class="fh-ad-tasks-panel-title">Active Subscriptions</div>
              <div class="fh-ad-tasks-panel-sub">${n.length} across family</div>
            </div>
          </div>
          <div class="fh-ad-tasks-panel-body" style="overflow-y:auto">
            ${u}
          </div>
        </div>

      </div>`}function un(e,t,a,o){o._sortedChores=e;let s=o._choreStatusFilter||"",i=o._choreRecFilter||"",n=o._choreFilter||"",r=[{val:"",label:"All"},{val:"active",label:"Active"},{val:"inactive",label:"Inactive"}],d=[{val:"",label:"All types"},{val:"daily",label:"Daily"},{val:"weekly",label:"Weekly"},{val:"monthly",label:"Monthly"},{val:"one_time",label:"One-Time"}],p=[{val:"",label:"Everyone"},...t.map(R=>({val:R.person_id,label:R.name}))],c=(R,T,P)=>`
      <select class="fh-select fh-ad-filter-select" data-act="${R}">
        ${T.map(l=>`<option value="${C(l.val)}" ${String(P)===String(l.val)?"selected":""}>${m(l.label)}</option>`).join("")}
      </select>`,b=`
      <div class="fh-ad-filter-bar">
        <label class="fh-ad-filter-lbl">Status ${c("chore-status-filter",r,s)}</label>
        <label class="fh-ad-filter-lbl">Type ${c("chore-rec-filter",d,i)}</label>
        <label class="fh-ad-filter-lbl">Assignee ${c("chore-filter",p,n)}</label>
      </div>`,g=e;s==="active"&&(g=e.filter(R=>R.active!==!1)),s==="inactive"&&(g=e.filter(R=>R.active===!1)),i&&(g=g.filter(R=>gn(R)===i)),o._choreFilter&&(g=g.filter(R=>(R.assigned_to||[]).includes(o._choreFilter)));let u=o._adminSort||{col:null,dir:"asc"},v=[...g];u.col&&v.sort((R,T)=>{let P,l;switch(u.col){case"name":P=R.name.toLowerCase(),l=T.name.toLowerCase();break;case"pts":P=R.points,l=T.points;break;case"cat":P=R.category_label||"",l=T.category_label||"";break;case"asgn":{P=(R.assigned_to||[]).map(y=>{var k;return((k=t.find(M=>M.person_id===y))==null?void 0:k.name)||""}).sort().join(","),l=(T.assigned_to||[]).map(y=>{var k;return((k=t.find(M=>M.person_id===y))==null?void 0:k.name)||""}).sort().join(",");break}default:P=l=""}return P<l?u.dir==="asc"?-1:1:P>l?u.dir==="asc"?1:-1:0});let f=`
      <div class="fh-ad-sort-bar">
        <span class="fh-ad-sort-lbl">Sort:</span>
        ${[{col:"name",label:"Name"},{col:"pts",label:"Pts"},{col:"cat",label:"Category"},{col:"asgn",label:"Assignees"}].map(({col:R,label:T})=>{let P=u.col===R,l=P?u.dir==="asc"?" \u2191":" \u2193":"";return`<button class="fh-ad-sort-btn${P?" active":""}"
                            data-act="sort-admin-chores" data-col="${R}">${T}${l}</button>`}).join("")}
        ${u.col?'<button class="fh-ad-sort-btn" data-act="sort-admin-chores" data-col="">\u2715 Clear</button>':""}
      </div>`,$=new Map;for(let R of a)$.set(R,[]);for(let R of v){let T=R.category_label||"Uncategorized";$.has(T)||$.set(T,[]),$.get(T).push(R)}for(let[R,T]of[...$.entries()])T.length||$.delete(R);let S=o._adminSelectedChoreId||null,x=o._adminCollapsedCats||new Set,h=e.filter(R=>R.active!==!1).length,w=e.filter(R=>R.active===!1).length,z=w?`${h} active \xB7 ${w} inactive`:`${h} total`,E=o._choreFilter||i||s,F="";v.length?F=[...$.entries()].map(([R,T])=>{let P=x.has(R),l=P?"":T.map(y=>xn(y,t,o,S)).join("");return`
              <div class="fh-ad-cat-group">
                <div class="fh-ad-cat-hdr" data-act="toggle-admin-cat" data-cat="${C(R)}">
                  <span class="fh-ad-cat-chevron${P?" collapsed":""}">\u25BC</span>
                  <span class="fh-ad-cat-name">${m(R)}</span>
                  <span class="fh-ad-cat-count">${T.length}</span>
                </div>
                ${P?"":`<div class="fh-task-list">${l}</div>`}
              </div>`}).join(""):F=`<div class="fh-empty fh-ad-empty">${E?"No chores match this filter.":"No active chores. Add one above."}</div>`;let D=$n(o);return`
      <div class="fh-ad-tasks-wrap">

        <div class="fh-ad-panel fh-ad-tasks-list-panel">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Chore definitions</span>
            <span class="fh-ad-panel-sub">${z}</span>
          </div>
          <div class="fh-ad-panel-body">
            ${b}
            ${f}
            ${F}
          </div>
        </div>

        ${D}

      </div>`}function vn(e,t){let a=qs(e,t);if(!a)return null;let o=(i,n)=>{let r=t.find(c=>c.person_id===i),d=(r==null?void 0:r.name)||"?",p=(r==null?void 0:r.avatar_color)||H;return`<div class="fh-avatar ${n}" title="${C(d)}" style="background:${p};width:26px;height:26px;font-size:var(--fh-text-xs)">${j(d)}</div>`};return`<span class="fh-rot-glyph" title="Rotates between kids">\u21BB</span><div class="fh-avatars fh-avatars--rot">${a.orderedIds.map((i,n)=>o(i,n===0?"fh-avatar--current":n===1?"fh-avatar--next":"fh-avatar--dim")).join("")}</div>`}function xn(e,t,a,o){var f,$,S,x;let s=(e.assigned_to||[]).map(h=>t.find(w=>w.person_id===h)).filter(Boolean),i=vn(e,t),n=i??(s.length?`<div class="fh-avatars">${s.map(h=>`<div class="fh-avatar" style="background:${h.avatar_color||H};width:26px;height:26px;font-size:var(--fh-text-xs)">${j(h.name)}</div>`).join("")}</div>`:""),r=a._expandedDescs.has(e.chore_id),d=((f=s[0])==null?void 0:f.avatar_color)||H,p=(($=e.recurrence)==null?void 0:$.type)||"daily",c={daily:"Daily",weekly:"Weekly",every_n_days:`Every ${((S=e.recurrence)==null?void 0:S.interval)||2}d`,every_n_weeks:`Every ${((x=e.recurrence)==null?void 0:x.interval)||2}wk`,monthly_on_date:"Monthly",one_time:"One-time"}[p]||p,b=e.expires_after_days?`<span class="fh-badge fh-badge-expiry" style="margin-left:4px">Expires in ${e.expires_after_days}d</span>`:"",g=e.streak_milestone||0,u=e.streak_bonus_points||0,v=g>0&&u>0?`<span class="fh-task-streak" title="Bonus: +${u}pts every ${g} completions">\u{1F525} ${g} \u2192 +${u}</span>`:'<span class="fh-task-streak fh-task-streak--off" title="No streak bonus set">no streak</span>';return`
      <div class="fh-task-row${e.chore_id===o?" fh-task-row--selected":""}"
           style="--row-color:${d}"
           draggable="true" data-drag-id="${e.chore_id}"
           data-act="select-chore-row" data-cid="${e.chore_id}">
        <span class="fh-drag-handle" title="Drag to reorder">\u283F</span>
        ${n}
        <div class="fh-task-body">
          <span class="fh-task-name">${m(e.name)}${e.active===!1?' <span style="font-size:.72rem;color:#6F7E9C;font-weight:400">[inactive]</span>':""}</span>
          ${r&&e.description?`<span class="fh-desc-inline">${m(e.description)}</span>`:""}
          <span class="fh-task-sub">${c}${e.penalty_enabled?` \xB7 -${e.penalty_points}pts penalty`:""}</span>
        </div>
        ${e.description?`<button class="fh-desc-btn" data-act="toggle-desc" data-id="${e.chore_id}"
                       title="Toggle description">?</button>`:""}
        ${b}
        <div class="fh-task-pts-col">
          <span class="fh-badge fh-badge-pts" style="--row-color:${d}">${e.points}pts</span>
          ${v}
        </div>
        <button class="fh-btn fh-btn-ghost fh-btn-sm fh-ad-tasks-edit-btn"
                data-act="open-edit-chore" data-cid="${e.chore_id}"
                title="Edit chore">${W.edit}</button>
        <button class="fh-btn fh-btn-danger fh-btn-sm fh-ad-tasks-del-btn"
                data-act="delete-chore"
                data-cid="${e.chore_id}" data-cname="${C(e.name)}"
                title="Delete chore">${W.trash}</button>
      </div>`}function yn(e){let t=e.recurrence||{};switch(t.type||"daily"){case"daily":return(t.day_filter||[]).length||7;case"weekly":return(t.weekdays||[]).length||1;case"every_n_days":{let a=t.interval||1;return a>0?7/a:0}case"every_n_weeks":{let a=t.interval||1;return a>0?1/a:0}case"monthly_on_date":return(t.days_of_month&&t.days_of_month.length?t.days_of_month.length:1)*12/52;default:return 0}}function qs(e,t){let a=e.rotation_pool||[];if(!a.length||!e.rotation_cadence)return null;let o=d=>{let p=t.find(c=>c.person_id===d);return p&&p.active!==!1},s=a.filter(o);if(!s.length)return null;let i=e.assigned_to&&e.assigned_to[0]||s[0],n=s.indexOf(i);n<0&&(n=0);let r=s.slice(n).concat(s.slice(0,n));return{activeIds:s,orderedIds:r,currentId:r[0],nextId:s.length>1?r[1]:null,cadence:e.rotation_cadence,switchWeekday:e.rotation_switch_weekday??0}}function wn(e,t){for(e=Math.round(e),t=Math.round(t);t;)[e,t]=[t,e%t];return e||1}function kn(e,t){return Math.abs(e*t)/wn(e,t)}function Js(e,t){let a=yn(e);if(a<=0)return 0;let o=a*(e.points||0)*t.comp;return t.includeStreaks&&e.streak_milestone>0&&e.streak_bonus_points>0&&(o+=a*(e.streak_bonus_points/e.streak_milestone)*t.streakPct),o}function _n(e,t,a){let o=t.filter(x=>x.type==="kid"&&x.active!==!1),s=o.map(x=>x.person_id),i={},n={};s.forEach(x=>{i[x]=0,n[x]=0});let r=[];for(let x of e){let h=Js(x,a);if(h<=0)continue;let w=qs(x,t);if(w&&w.cadence==="weekly")r.push({eff:h,ordered:w.orderedIds,name:x.name}),n[w.currentId]!=null&&(n[w.currentId]+=1);else if(w){let z=h/w.activeIds.length;w.activeIds.forEach(E=>{i[E]!=null&&(i[E]+=z)}),n[w.currentId]!=null&&(n[w.currentId]+=1)}else for(let z of x.assigned_to||[])i[z]!=null&&(i[z]+=h,n[z]+=1)}let d={};s.forEach(x=>d[x]=i[x]);for(let x of r){let h=x.eff/x.ordered.length;x.ordered.forEach(w=>{d[w]!=null&&(d[w]+=h)})}let p=1;for(let x of r)p=kn(p,x.ordered.length);p=Math.max(1,Math.min(p,12));let c={},b={},g={};s.forEach(x=>{c[x]=i[x],b[x]=i[x],g[x]=i[x]});for(let x=0;x<p;x++){let h={};s.forEach(w=>h[w]=i[w]);for(let w of r){let z=w.ordered[x%w.ordered.length];h[z]!=null&&(h[z]+=w.eff)}s.forEach(w=>{x===0?(g[w]=h[w],c[w]=h[w],b[w]=h[w]):(h[w]<c[w]&&(c[w]=h[w]),h[w]>b[w]&&(b[w]=h[w]))})}let u={},v={};o.forEach(x=>{let h=x.allowance_points||0,w=x.allowance_schedule||"weekly";w==="biweekly"?(u[x.person_id]=h/2,v[x.person_id]=h*2):w==="monthly"?(u[x.person_id]=h/4,v[x.person_id]=h):(u[x.person_id]=h,v[x.person_id]=h*4)});let _=a.ladder,f=x=>{let h=a.rankOverride!=null?a.rankOverride:x.rank_index||0;return _&&_.length?_[Math.max(0,Math.min(h,_.length-1))]:a.ppd>0?100/a.ppd:0},$=(x,h)=>h*f(x)/100,S=o.map(x=>{let h=x.person_id,w=d[h]*4;return{person:x,chores:n[h],month:w,monthUSD:$(x,w),weekAvg:d[h],weekAvgUSD:$(x,d[h]),weekMin:c[h],weekMax:b[h],weekThis:g[h],weekThisUSD:$(x,g[h]),swingUSD:$(x,b[h]-c[h]),allowMo:v[h],allowMoUSD:$(x,v[h]),allowWkUSD:$(x,u[h]),takeHomeMoUSD:$(x,w+v[h]),takeHomeWkUSD:$(x,d[h]+u[h])}});return{rows:S,famWeek:S.reduce((x,h)=>x+h.weekAvg,0),famMonth:S.reduce((x,h)=>x+h.month,0),famWeekUSD:S.reduce((x,h)=>x+h.weekAvgUSD,0),famMonthUSD:S.reduce((x,h)=>x+h.monthUSD,0),maxWeekMax:Math.max(1,...S.map(x=>x.weekMax)),maxMonth:Math.max(1,...S.map(x=>x.month)),weeklyRotChores:r.map(x=>x.name),centsOfRank:x=>_&&_.length?_[Math.max(0,Math.min(x,_.length-1))]:a.ppd>0?100/a.ppd:0}}function $n(e){var w;let t=e._attrs("sensor.family_hub_needs_attention"),a=t.people||[],o=t.active_chores||[],s=t.points_per_dollar||0,i=t.rank_ppd_ladder&&t.rank_ppd_ladder.length?t.rank_ppd_ladder:[3,3.5,4,4.5,5],n=e._statsCompletionPct??100,r=!!e._statsIncludeStreaks,d=e._statsStreakPct??50,p=e._statsRankOverride==null||e._statsRankOverride===""?null:Number(e._statsRankOverride),c={comp:n/100,includeStreaks:r,streakPct:d/100,rankOverride:p,ladder:i,ppd:s},b=o.filter(z=>z.chore_type==="assigned"),g=o.filter(z=>z.chore_type==="claimable"),u=_n(b,a,c),v=z=>O(Math.round(z||0)),_=[`<option value="" ${p==null?"selected":""}>Current</option>`].concat(i.map((z,E)=>`<option value="${E}" ${p===E?"selected":""}>Rank ${E+1}</option>`)).join(""),f=[100,95,90,85,80,75,70,60,50].map(z=>`<option value="${z}" ${n===z?"selected":""}>${z}%</option>`).join(""),$=[100,75,50,25].map(z=>`<option value="${z}" ${d===z?"selected":""}>${z}%</option>`).join(""),S=`
      <div class="fh-es-controls">
        <label class="fh-es-ctl">Rank <select class="fh-select" data-act="stats-rank">${_}</select></label>
        <label class="fh-es-ctl">Done <select class="fh-select" data-act="stats-completion">${f}</select></label>
        <label class="fh-es-ctl fh-es-ctl-chk"><input type="checkbox" data-act="toggle-stats-streaks" ${r?"checked":""}> Streaks</label>
        ${r?`<label class="fh-es-ctl">Streak <select class="fh-select" data-act="stats-streak-pct">${$}</select></label>`:""}
      </div>`,x=[`${b.length} chore${b.length===1?"":"s"}`,`${n}% done`];r&&x.push(`streaks ${d}%`),p!=null&&x.push(`at Rank ${p+1}`);let h;if(!u.rows.length)h=`
          <div class="fh-ad-tasks-panel-empty">
            <div class="fh-ad-tasks-panel-empty-icon">\u{1F4CA}</div>
            <div class="fh-ad-tasks-panel-empty-text">No kids to report on yet.</div>
          </div>`;else{let z=u.maxWeekMax||1,E=u.rows.map(l=>{let y=l.person.avatar_color||H,k=Math.max(0,l.weekMax-l.weekMin),M=k>.5,A=Math.max(0,Math.min(100,l.weekMin/z*100)),B=Math.max(0,Math.min(100,k/z*100)),L=Math.max(0,Math.min(100,l.weekThis/z*100)),q=M?`<span class="fh-es-week-this">this wk ${G(l.weekThisUSD)}</span>`:"",J=l.allowMo>0?`<div class="fh-es-allow">+${G(l.allowWkUSD)}/wk allowance \u2192 <b>${G(l.takeHomeWkUSD)}</b>/wk take-home</div>`:"";return`
              <div class="fh-es-kid">
                <div class="fh-es-kid-hdr">
                  <div class="fh-avatar" style="background:${y};width:26px;height:26px;font-size:var(--fh-text-xs)">${j(l.person.name)}</div>
                  <span class="fh-es-kid-name">${m(l.person.name)}</span>
                  <span class="fh-es-kid-count">${l.chores} chore${l.chores===1?"":"s"}</span>
                  <span class="fh-es-kid-rank" style="margin-left:auto;font-size:var(--fh-text-xs);font-weight:700;color:var(--fh-text-sec)">Rank ${(p??(l.person.rank_index||0))+1}${p!=null?" (what-if)":""}</span>
                </div>
                <div class="fh-es-week">
                  <span class="fh-es-week-usd">${G(l.weekAvgUSD)}</span><span class="fh-es-week-lbl">/wk</span>
                  <span class="fh-es-week-pts">${v(l.weekAvg)} pts</span>
                  ${q}
                </div>
                <div class="fh-es-rng-track">
                  <div class="fh-es-rng-span" style="left:${A}%;width:${B}%;background:${y}"></div>
                  <div class="fh-es-rng-dot" style="left:${L}%;background:${y}"></div>
                </div>
                <div class="fh-es-month-sub">${v(l.month)} pts \xB7 ${G(l.monthUSD)} / month</div>
                ${J}
              </div>`}).join(""),F=`
          <div class="fh-es-section">
            <div class="fh-es-section-hdr">Monthly balance</div>
            ${u.rows.map(l=>{let y=Math.round(l.month/u.maxMonth*100);return`
                  <div class="fh-es-bar-row">
                    <span class="fh-es-bar-name">${m(l.person.name)}</span>
                    <div class="fh-es-bar-track"><div class="fh-es-bar-fill" style="width:${y}%;background:${l.person.avatar_color||H}"></div></div>
                    <span class="fh-es-bar-val">${G(l.monthUSD)}</span>
                  </div>`}).join("")}
          </div>`,D=`
          <div class="fh-es-section">
            <div class="fh-es-section-hdr">Family payout</div>
            <div class="fh-es-tot-row"><span>Per week</span><span>${v(u.famWeek)} pts \xB7 ${G(u.famWeekUSD)}</span></div>
            <div class="fh-es-tot-row"><span>Per month</span><span>${v(u.famMonth)} pts \xB7 ${G(u.famMonthUSD)}</span></div>
          </div>`,R="";if(g.length){let l=g.reduce((M,A)=>M+Js(A,c),0),y=u.centsOfRank(p??(((w=u.rows[0])==null?void 0:w.person.rank_index)||0)),k=M=>M*y/100;R=`
              <div class="fh-es-section">
                <div class="fh-es-section-hdr">Bonus pool \xB7 up for grabs</div>
                <div class="fh-es-tot-row"><span>Per week</span><span>${v(l)} pts \xB7 ${G(k(l))}</span></div>
                <div class="fh-es-tot-row"><span>Per month</span><span>${v(l*4)} pts \xB7 ${G(k(l*4))}</span></div>
              </div>`}let T="",P=u.rows.filter(l=>l.swingUSD>=1);if(P.length&&u.weeklyRotChores.length){let l=P.map(A=>A.person.name).join(" & "),y=Math.max(...P.map(A=>A.swingUSD)),k=u.weeklyRotChores,M=k.length<=3?k.join(", "):`${k.slice(0,3).join(", ")} +${k.length-3} more`;T=`
              <div class="fh-es-tip">
                <b>Weekly pay varies up to ${G(y)}</b> week-to-week for ${m(l)} (anti-phased) from ${k.length} weekly rotation${k.length===1?"":"s"} \u2014 ${m(M)}. Switch those to per-instance rotation to even the weeks out.
              </div>`}h=`<div class="fh-es-rail">${E}${F}${D}${R}${T}</div>`}return`
      <div class="fh-ad-tasks-panel">
        <div class="fh-ad-tasks-panel-hdr">
          <div style="flex:1;min-width:0">
            <div class="fh-ad-tasks-panel-title">Earning &amp; Balance</div>
            <div class="fh-ad-tasks-panel-sub">${m(x.join(" \xB7 "))}</div>
          </div>
        </div>
        <div class="fh-ad-tasks-panel-body">
          ${S}
          ${h}
        </div>
      </div>`}function Sn(e,t,a,o){o._sortedStoreItems=e;let s=`
      <div class="fh-chips">
        <div class="fh-chip ${o._storeItemFilter?"":"active"}"
             data-act="store-item-filter" data-fval="">All</div>
        <div class="fh-chip ${o._storeItemFilter==="active"?"active":""}"
             data-act="store-item-filter" data-fval="active">Active</div>
        <div class="fh-chip ${o._storeItemFilter==="inactive"?"active":""}"
             data-act="store-item-filter" data-fval="inactive">Inactive</div>
      </div>`,i=e;o._storeItemFilter==="active"&&(i=e.filter(f=>f.active!==!1)),o._storeItemFilter==="inactive"&&(i=e.filter(f=>f.active===!1));let n=o._adminSortItems||{col:null,dir:"asc"},r=[...i];n.col&&r.sort((f,$)=>{let S,x;switch(n.col){case"name":S=f.name.toLowerCase(),x=$.name.toLowerCase();break;case"pts":S=f.points_cost,x=$.points_cost;break;case"cat":S=f.category_label||"",x=$.category_label||"";break;case"scope":S=f.scope||"",x=$.scope||"";break;default:S=x=""}return S<x?n.dir==="asc"?-1:1:S>x?n.dir==="asc"?1:-1:0});let p=`
      <div class="fh-ad-sort-bar">
        <span class="fh-ad-sort-lbl">Sort:</span>
        ${[{col:"name",label:"Name"},{col:"pts",label:"Pts"},{col:"cat",label:"Category"},{col:"scope",label:"Scope"}].map(({col:f,label:$})=>{let S=n.col===f,x=S?n.dir==="asc"?" \u2191":" \u2193":"";return`<button class="fh-ad-sort-btn${S?" active":""}"
                            data-act="sort-admin-store-items" data-col="${f}">${$}${x}</button>`}).join("")}
        ${n.col?'<button class="fh-ad-sort-btn" data-act="sort-admin-store-items" data-col="">\u2715 Clear</button>':""}
      </div>`,c=new Map;for(let f of a)c.set(f,[]);for(let f of r){let $=f.category_label||"Uncategorized";c.has($)||c.set($,[]),c.get($).push(f)}for(let[f,$]of[...c.entries()])$.length||c.delete(f);let b=o._adminSelectedItemId||null,g=o._adminCollapsedRewardCats||new Set,u="";r.length?u=[...c.entries()].map(([f,$])=>{let S=g.has(f),x=S?"":$.map(h=>En(h,t,o,b)).join("");return`
              <div class="fh-ad-cat-group">
                <div class="fh-ad-cat-hdr" data-act="toggle-admin-reward-cat" data-cat="${C(f)}">
                  <span class="fh-ad-cat-chevron${S?" collapsed":""}">\u25BC</span>
                  <span class="fh-ad-cat-name">${m(f)}</span>
                  <span class="fh-ad-cat-count">${$.length}</span>
                </div>
                ${S?"":`<div class="fh-task-list">${x}</div>`}
              </div>`}).join(""):u=`<div class="fh-empty fh-ad-empty">${o._storeItemFilter?"No rewards match this filter.":"No rewards yet. Add one above."}</div>`;let v=b?e.find(f=>f.item_id===b):null,_=Cn(v,t,a,o);return`
      <div class="fh-ad-rewards-wrap">

        <div class="fh-ad-panel fh-ad-rewards-list-panel">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Reward catalog</span>
            <span class="fh-ad-panel-sub">${e.filter(f=>f.active!==!1).length} active</span>
          </div>
          <div class="fh-ad-panel-body">
            ${s}
            ${p}
            ${u}
          </div>
        </div>

        ${_}

      </div>`}function En(e,t,a,o){let s=(e.person_ids||[]).map(d=>{var p;return(p=t.find(c=>c.person_id===d))==null?void 0:p.name}).filter(Boolean).join(", "),i=e.item_id===o,n=e.active===!1,r=e.max_per_period>0?`<span class="fh-badge fh-badge-expiry" style="margin-left:4px">Max ${e.max_per_period}/${e.period}</span>`:"";return`
      <div class="fh-task-row${i?" fh-task-row--selected":""}${n?" fh-store-row--inactive":""}"
           draggable="true" data-drag-id="${e.item_id}"
           data-drag-type="store-item"
           data-act="select-store-row" data-iid="${e.item_id}">
        <span class="fh-drag-handle" title="Drag to reorder">\u283F</span>
        ${e.icon?`<span style="width:24px;height:24px;flex-shrink:0">${pe(e.icon,null,"24px")}</span>`:""}
        <div class="fh-task-body">
          <span class="fh-task-name">${m(e.name)}${n?' <span style="font-size:.72rem;color:#6F7E9C;font-weight:400">[inactive]</span>':""}</span>
          <span class="fh-task-sub">
            ${G(e.dollar_value)} \xB7
            ${e.scope==="personal"?`Personal${s?` (${m(s)})`:""}`:"All kids"}
          </span>
        </div>
        ${r}
        <span class="fh-badge fh-badge-pts">${O(e.points_cost)}pts</span>
        <button class="fh-btn fh-btn-ghost fh-btn-sm fh-ad-tasks-edit-btn"
                data-act="open-edit-store-item" data-iid="${e.item_id}"
                title="Edit reward">${W.edit}</button>
        <button class="fh-btn fh-btn-danger fh-btn-sm"
                data-act="delete-store-item"
                data-iid="${e.item_id}" data-iname="${C(e.name)}"
                title="Delete reward">${W.trash}</button>
      </div>`}function Cn(e,t,a,o){return`<div class="fh-ad-rewards-panel">${e?`
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1;min-width:0">
              <div class="fh-ad-tasks-panel-title">Edit reward</div>
              <div class="fh-ad-tasks-panel-sub" title="${C(e.name)}">${m(e.name)}</div>
            </div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="close-store-panel"
                    style="flex-shrink:0" title="Close panel">\u2715</button>
          </div>
          <div class="fh-ad-tasks-panel-body">
            ${Jt(e,!0,t,a)}
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
          </div>`}</div>`}function zn(e,t){let a=e.history_log||[],o=e.people||[],s=o.find(u=>u.type==="parent"),i=new Set(["task_completed","task_approved","pending_approval","task_denied","task_skipped","task_excused","task_rejected","task_marked_complete"]),n=`
      <div class="fh-chips" style="margin-bottom:var(--fh-gap-sm)">
        <div class="fh-chip ${t._histFilter?"":"active"}"
             data-act="hist-filter" data-hpid="">All</div>
        ${o.map(u=>`
          <div class="fh-chip ${t._histFilter===u.person_id?"active":""}"
               style="--chip-color:${u.avatar_color||H}"
               data-act="hist-filter" data-hpid="${u.person_id}">
            <span class="fh-chip-dot"></span>${m(u.name)}
          </div>`).join("")}
      </div>`,r=t._histFilter?a.filter(u=>u.person_id===t._histFilter):a,d=r.filter(u=>i.has(u.type)),c=ce(d).map(u=>u.isGroup?Mn(u,s,t):Ws(u.entry,s)).join("")||'<div class="fh-empty fh-ad-empty">No chore history yet.</div>',g=r.filter(u=>!i.has(u.type)).map(u=>Ws(u,s)).join("")||'<div class="fh-empty fh-ad-empty">No reward history yet.</div>';return`
      <div class="fh-ad-history-wrap">
        <div class="fh-ad-panel fh-ad-history-main">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Chore history</span>
            <span class="fh-ad-panel-sub">last 30 days</span>
          </div>
          <div class="fh-ad-panel-body">
            ${n}
            <div class="fh-hist-scroll">${c}</div>
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
      </div>`}function An(e,t,a){let o=e.family_name||"Family Hub",s=e.points_per_dollar||10,i=e.show_dollar_value_to_kids||!1,n=e.category_labels||[],r=e.penalty_alert_time!==void 0?e.penalty_alert_time:800,d=e.rank_eval_weekday!==void 0?e.rank_eval_weekday:0,p=e.rooms_config||{},c=e.weather_entity||"",b=e.today_calendar_entities||[],g=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],u=n.map(f=>`
      <div class="fh-cat-chip"
           draggable="true"
           data-drag-id="${C(f)}"
           data-drag-type="category"
           title="Drag to reorder">
        <span class="fh-cat-chip-handle">\u283F</span>
        <span>${m(f)}</span>
        <button class="fh-cat-chip-del" data-act="remove-cat-label"
                data-label="${C(f)}" title="Remove">\xD7</button>
      </div>`).join(""),v=e.modules||{},_=zt.map(f=>{var z;let S=(((z=p[f.id])==null?void 0:z.status)??f.status)!=="hidden",x=f.status==="coming",h=v[f.id]===!1,w=h?" \xB7 <em>module off \u2014 manage in integration options</em>":x?" \xB7 <em>coming soon</em>":"";return`
          <div class="fh-hub-room-row${h?" fh-hub-room-row--off":""}" data-room-id="${C(f.id)}">
            <div class="fh-hub-room-icon" style="color:${f.accent}">${f.icon}</div>
            <div class="fh-hub-room-info">
              <div class="fh-hub-room-name">${m(f.label)}</div>
              <div class="fh-hub-room-sub">${m(f.sub)}${w}</div>
            </div>
            <label class="fh-toggle">
              <input type="checkbox" class="fh-hub-room-toggle"
                     data-room-id="${C(f.id)}"
                     ${S?"checked":""}${h?" disabled":""}>
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
                <input type="checkbox" data-act="toggle-dollar" ${i?"checked":""}>
                <span class="fh-toggle-slider"></span>
              </label>
            </div>
            <div class="fh-point-row">
              <div style="flex:1;min-width:0">
                <div style="font-size:.9rem;font-weight:600">${m(o)}</div>
                <div style="font-size:.75rem;color:var(--fh-text-sec)">${s} points per dollar (base rate)</div>
              </div>
              <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-settings"
                      data-fname="${C(o)}" data-ppd="${s}"
                      data-palerttime="${r}">
                ${W.settings} Edit
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
                ${W.settings} Manage
              </button>
            </div>
            <div class="fh-divider"></div>
            <div>
              <div class="fh-label" style="margin-bottom:6px">Category labels</div>
              <div class="fh-field-help" style="margin-bottom:6px;font-size:.78rem;color:var(--fh-text-sec)">
                Shared by Tasks and Rewards sections.
              </div>
              <div class="fh-cat-labels" style="margin-bottom:8px">
                ${u||'<span style="font-size:.82rem;color:var(--fh-text-sec)">No labels yet.</span>'}
              </div>
              <div class="fh-row" style="gap:6px">
                <input class="fh-input" id="cat-label-input" type="text"
                       placeholder="New label\u2026" style="flex:1">
                <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="add-cat-label">
                  ${W.plus} Add
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
            <div class="fh-hub-room-list">${_}</div>
            <div class="fh-divider"></div>
            <div class="fh-field">
              <label class="fh-label">Weather entity</label>
              <input class="fh-input" id="m-hub-weather" type="text"
                     value="${C(c)}"
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

      </div>`}function Ws(e,t){let a=ie[e.type]||{label:e.type,color:"var(--fh-text-sec)"},o=e.person_color||H,s=e.points_delta?`<span style="color:${e.points_delta>0?"var(--fh-success)":"var(--fh-overdue)"}">
             ${e.points_delta>0?"+":""}${e.points_delta}pts
           </span>`:"",i="";return e.reversible==="excuse"&&t?i=`<button class="fh-btn fh-btn-warning fh-btn-sm"
                             data-act="excuse-task"
                             data-iid="${e.reference_id}"
                             data-excused-by="${t.person_id}"
                             title="Reverse penalty for this skipped task">
                       ${W.excuse} Excuse
                     </button>`:e.reversible==="mark_complete"&&t?i=`<button class="fh-btn fh-btn-success fh-btn-sm"
                             data-act="mark-complete"
                             data-iid="${e.reference_id}"
                             data-marked-by="${t.person_id}"
                             title="Retroactively mark as done and award points">
                       ${W.check} Mark done
                     </button>`:e.reversible==="reject"&&t&&(i=`<button class="fh-btn fh-btn-danger fh-btn-sm"
                             data-act="reject-task"
                             data-iid="${e.reference_id}"
                             data-rejected-by="${t.person_id}"
                             title="Claw back points for this task">
                       ${W.close} Reject
                     </button>`),`
      <div class="fh-hist-row" style="--hist-color:${a.color}">
        <div class="fh-avatar" style="background:${o};width:26px;height:26px;font-size:var(--fh-text-xs)">
          ${e.person_name?j(e.person_name):"\u2014"}
        </div>
        <div class="fh-hist-info">
          <div class="fh-hist-label">${m(a.label)}</div>
          <div class="fh-hist-name">${m(e.chore_name||e.note||"")}</div>
          <div class="fh-hist-meta">
            ${e.person_name?m(e.person_name)+" \xB7 ":""}${ne(e.timestamp)}
            ${e.actor?` \xB7 by ${m(e.actor)}`:""}
            ${s}
          </div>
        </div>
        ${i?`<div class="fh-hist-actions">${i}</div>`:""}
      </div>`}function Mn(e,t,a){let o=a._expandedSkippedDates.has(e.key),s=e.totalPenalty>0?`\u2212${e.totalPenalty}pts`:"no penalty",i=e.items.map(n=>{let r=n.person_color||H,d=n.points_delta?`<span style="color:var(--fh-overdue);font-weight:700">${n.points_delta}pts</span>`:"",p="";return t&&n.reversible==="excuse"&&(p=`<button class="fh-btn fh-btn-warning fh-btn-sm"
                                 data-act="excuse-task"
                                 data-iid="${n.reference_id}"
                                 data-excused-by="${t.person_id}"
                                 title="Reverse this penalty">
                           ${W.excuse} Excuse
                         </button>`),`
          <div class="fh-hist-subrow">
            <div class="fh-avatar" style="background:${r};width:24px;height:24px;font-size:var(--fh-text-xs);flex-shrink:0">
              ${n.person_name?j(n.person_name):"\u2014"}
            </div>
            <div class="fh-hist-info" style="flex:1;min-width:0">
              <div class="fh-hist-name">${m(n.person_name?n.person_name+" \u2014 ":"")+m(n.chore_name||"")}</div>
              <div class="fh-hist-meta">${d}</div>
            </div>
            ${p}
          </div>`}).join("");return`
      <div class="fh-hist-group">
        <div class="fh-hist-group-hdr" data-act="toggle-skipped-group" data-key="${e.key}">
          <div class="fh-hist-info" style="flex:1;min-width:0">
            <div class="fh-hist-label" style="color:var(--fh-warning)">Skipped chores</div>
            <div class="fh-hist-name">${m(e.dateDisplay)} \xB7 ${s}</div>
          </div>
          ${t&&a._histFilter&&e.items.some(n=>n.reversible==="excuse")?`
            <button class="fh-btn fh-btn-warning fh-btn-sm" data-act="excuse-day"
                    data-pid="${C(a._histFilter)}" data-day="${C(e.date)}"
                    title="Excuse every skipped chore this day">
              ${W.excuse} Excuse day
            </button>`:""}
          <span class="fh-hist-expand-icon">${o?"\u25B2":"\u25BC"}</span>
        </div>
        <div class="fh-hist-subitems"${o?"":' style="display:none"'}>${i}</div>
      </div>`}function Ks(e){return fn.map(t=>`<option value="${t}"${t===e?" selected":""}>${t}</option>`).join("")}function Bn(e){let t=e._attrs("sensor.family_hub_meals"),a=t.custom||[],o=t.customIng||[],s=t.recipes||{},i=e._mealsAdminSubtab||"meals",n=(p,c)=>`
        <button class="fh-ml-qchip${i===p?" on":""}" data-act="meals-admin-subtab" data-sub="${p}">${c}</button>`,r=`<div class="fh-ml-adm-tabs">${n("meals","Meals")}${n("ingredients","Ingredients")}${n("recipes","Recipes")}</div>`,d="";return i==="meals"?d=Fn(a,o):i==="ingredients"?d=Rn(o):d=Dn(e,a,s),`<div class="fh-ml-page" style="padding:4px 2px">${r}${d}</div>`}function Fn(e,t){let a=Oe(t),o=(r,d)=>`<label class="fh-ml-chk"><input type="checkbox" id="${r}">${m(d)}</label>`,s=$t.map(r=>{let d=de[r];return`<optgroup label="${C(d.label)}">`+d.cuts.map(p=>`<option value="${r}:${p.id}">${m(d.label)} \xB7 ${m(p.label)}</option>`).join("")+"</optgroup>"}).join(""),i=`
      <div class="fh-ml-panel">
        <div class="fh-ml-panel-hdr">Add a meal</div>
        <div class="fh-ml-form">
          <label class="fh-ml-flabel">Name</label>
          <input class="fh-ml-input" id="ma-name" placeholder="e.g. Grandma's Goulash">
          <label class="fh-ml-flabel">Picture</label>
          <select class="fh-ml-input" id="ma-glyph">${Ks("\u{1F37D}\uFE0F")}</select>
          <label class="fh-ml-flabel">Which meals</label>
          <div class="fh-ml-chiprow">
            <label class="fh-ml-chk"><input type="checkbox" id="ma-type-b">Breakfast</label>
            <label class="fh-ml-chk"><input type="checkbox" id="ma-type-l">Lunch</label>
            <label class="fh-ml-chk"><input type="checkbox" id="ma-type-d" checked>Dinner</label>
          </div>
          <label class="fh-ml-flabel">Protein &amp; cut (for the guided builder)</label>
          <select class="fh-ml-input" id="ma-protcut"><option value="">\u2014 none \u2014</option>${s}</select>
          <label class="fh-ml-flabel">Food groups it covers</label>
          <div class="fh-ml-chiprow">${Xe.map(r=>o("ma-grp-"+r,Le[r].label)).join("")}</div>
          <label class="fh-ml-flabel">Usual sides (pre-picked when planned)</label>
          <div class="fh-ml-chiprow">${at.map(r=>o("ma-side-"+r.id,`${r.glyph} ${r.name}`)).join("")}</div>
          <label class="fh-ml-flabel">Pantry ingredients it uses (powers \u201CWhat Can We Make\u201D)</label>
          <div class="fh-ml-chiprow">${a.map(r=>o("ma-ing-"+r.id,`${r.glyph} ${r.label}`)).join("")}</div>
          <div style="display:flex;justify-content:flex-end;padding-top:6px">
            <button class="fh-bk-go-btn" data-act="meals-admin-add-meal">Add to library \u2713</button>
          </div>
        </div>
      </div>`,n=`
      <div class="fh-ml-panel">
        <div class="fh-ml-panel-hdr">Family-added meals</div>
        <div class="fh-ml-admin-list">
          ${e.length===0?'<div class="fh-ml-empty-note">nothing added yet \u2014 meals you add (or save from Recipe Ideas) land here</div>':e.map(r=>`
              <div class="fh-ml-admin-row">
                <span class="g">${r.glyph||"\u{1F37D}\uFE0F"}</span>
                <span class="nm">${m(r.name)}<div class="meta">${(r.types||[]).map(d=>d==="b"?"BREAKFAST":d==="l"?"LUNCH":"DINNER").join(" \xB7 ")}${r.source?" \xB7 "+m(String(r.source).toUpperCase()):""}</div></span>
                <button class="fh-ml-xbtn" data-act="meals-admin-remove-meal" data-id="${C(r.id)}">\u2715</button>
              </div>`).join("")}
        </div>
      </div>`;return`<div class="fh-ml-adm">${i}${n}</div>`}function Rn(e){let t=pt.map(([i,n])=>`<option value="${i}">${m(n)}</option>`).join(""),a=Object.keys(nt).map(i=>`<option value="${i}">${m(nt[i])}</option>`).join(""),o=`
      <div class="fh-ml-panel">
        <div class="fh-ml-panel-hdr">Add an ingredient</div>
        <div class="fh-ml-form">
          <label class="fh-ml-flabel">Name</label>
          <input class="fh-ml-input" id="mi-name" placeholder="e.g. Zucchini">
          <label class="fh-ml-flabel">Picture</label>
          <select class="fh-ml-input" id="mi-glyph">${Ks("\u{1F955}")}</select>
          <label class="fh-ml-flabel">Food group (where it shows in the pantry)</label>
          <select class="fh-ml-input" id="mi-cat">${t}</select>
          <label class="fh-ml-flabel">Grocery aisle</label>
          <select class="fh-ml-input" id="mi-aisle">${a}</select>
          <div style="display:flex;justify-content:flex-end;padding-top:6px">
            <button class="fh-bk-go-btn" data-act="meals-admin-add-ing">Add ingredient \u2713</button>
          </div>
        </div>
      </div>`,s=`
      <div class="fh-ml-panel">
        <div class="fh-ml-panel-hdr">Family-added ingredients</div>
        <div class="fh-ml-admin-list">
          ${e.length===0?'<div class="fh-ml-empty-note">nothing added yet \u2014 new ingredients show up in the pantry chips and grocery aisles</div>':e.map(i=>`
              <div class="fh-ml-admin-row">
                <span class="g">${i.glyph||"\u{1F955}"}</span>
                <span class="nm">${m(i.label)}<div class="meta">${m((pt.find(([n])=>n===i.cat)||[])[1]||"")} \xB7 ${m(nt[i.aisle]||"")}</div></span>
                <button class="fh-ml-xbtn" data-act="meals-admin-remove-ing" data-id="${C(i.id)}">\u2715</button>
              </div>`).join("")}
        </div>
      </div>`;return`<div class="fh-ml-adm">${o}${s}</div>`}function Dn(e,t,a){let o=ot(t).filter(d=>!d.special).sort((d,p)=>(Ke(d,a)?1:0)-(Ke(p,a)?1:0)||d.name.localeCompare(p.name)),s=`
      <div class="fh-ml-panel">
        <div class="fh-ml-panel-hdr">Recipe cards <small>~ optional \u2014 a meal works fine without one ~</small></div>
        <div class="fh-ml-admin-list">
          ${o.map(d=>{let p=!!Ke(d,a);return`
              <div class="fh-ml-admin-row"${e._mealsAdminRecipeId===d.id?' style="background:rgba(139,58,42,.08)"':""}>
                <span class="g">${d.glyph||"\u{1F37D}\uFE0F"}</span>
                <span class="nm">${m(d.name)}<div class="meta">${p?"HAS A RECIPE CARD":"NO RECIPE YET"}</div></span>
                <button class="fh-ml-ghost-btn" data-act="meals-admin-recipe-edit" data-id="${C(d.id)}">${p?"Edit":"\uFF0B Add"}</button>
              </div>`}).join("")}
        </div>
      </div>`,i=e._mealsAdminRecipeId,n=i?o.find(d=>d.id===i):null,r;if(n){let d=Ke(n,a)||{time:"",serves:5,ingredients:[],steps:[]};r=`
          <div class="fh-ml-panel">
            <div class="fh-ml-panel-hdr">${n.glyph||"\u{1F37D}\uFE0F"} ${m(n.name)}</div>
            <div class="fh-ml-form">
              <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:10px">
                <div><label class="fh-ml-flabel">Time</label>
                  <input class="fh-ml-input" id="mr-time" value="${C(d.time||"")}" placeholder="e.g. 30 min"></div>
                <div><label class="fh-ml-flabel">Serves</label>
                  <input class="fh-ml-input" id="mr-serves" inputmode="numeric" value="${C(String(d.serves||5))}"></div>
              </div>
              <label class="fh-ml-flabel">Ingredients \u2014 one per line</label>
              <textarea class="fh-ml-input" id="mr-ing" rows="5" placeholder="2 lb ground beef&#10;1 can crushed tomatoes&#10;\u2026">${m((d.ingredients||[]).join(`
`))}</textarea>
              <label class="fh-ml-flabel">Steps \u2014 one per line, keep them short</label>
              <textarea class="fh-ml-input" id="mr-steps" rows="5" placeholder="Brown the beef, drain.&#10;Everything in the pot, simmer 20 min.&#10;\u2026">${m((d.steps||[]).join(`
`))}</textarea>
              <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:6px">
                <button class="fh-ml-ghost-btn" data-act="meals-admin-recipe-cancel">Cancel</button>
                <button class="fh-bk-go-btn" data-act="meals-admin-recipe-save" data-id="${C(n.id)}">Save recipe \u2713</button>
              </div>
            </div>
          </div>`}else r='<div class="fh-ml-panel"><div class="fh-ml-empty-note" style="margin:auto 0">pick a meal on the left to add or edit its recipe card</div></div>';return`<div class="fh-ml-adm">${s}${r}</div>`}var fn,Vs=N(()=>{K();K();Q();Ut();Kt();ut();Ct();fn=["\u{1F373}","\u{1F95E}","\u{1F963}","\u{1F96A}","\u{1F32E}","\u{1F32F}","\u{1F35D}","\u{1F355}","\u{1F354}","\u{1F357}","\u{1F969}","\u{1F356}","\u{1F953}","\u{1F983}","\u{1F35C}","\u{1F958}","\u{1F372}","\u{1F957}","\u{1F35B}","\u{1F967}","\u{1FAD3}","\u{1FAD8}","\u{1F966}","\u{1F955}","\u{1F34E}","\u{1F9C0}","\u{1F95A}","\u{1F954}","\u{1F33D}","\u{1F35A}"]});function In(e,t){let a=new Date,o=a.toLocaleDateString("en-US",{weekday:"long"}),s=a.toLocaleDateString("en-US",{month:"short",day:"numeric"});return`
        <div class="fh-home-header">
            <div class="fh-home-family">${m(e)}</div>
            <div class="fh-home-header-right">
                <div class="fh-home-date">${o}, ${s}</div>
                ${t?'<div class="fh-home-paused-pill">PAUSED</div>':""}
            </div>
        </div>
    `}function Tn(e,t,a){if(!e.length)return"";let o=a._attrs("sensor.family_hub_claimable_tasks").all_tasks||[];return`
        <div class="fh-home-section">
            <div class="fh-home-section-label">// AGENTS ON DUTY</div>
            <div class="fh-home-agents-row">${e.map(i=>{var h;let n=i.avatar_color||H,r=i.code||"",d=tt(i.theme_key||"classic"),p=d.tint,c=d.sigil,b=a._personEntityId(i.name),g=a._attrs(b),u=parseInt(((h=a._states(b))==null?void 0:h.state)??i.lifetime_points??0),v=g.show_dollar_value?g.dollar_value:null,_=d.rankTitle(i.rank_index!==void 0?i.rank_index:0),f=d.homeTileSubLabel(i),$=o.filter(w=>w.assigned_to===i.person_id&&w.status==="pending").length,S=t.filter(w=>w.person_id===i.person_id).length,x=i.allowance_points&&i.allowance_schedule?`<div class="fh-home-agent-allowance">+${i.allowance_points}/${i.allowance_schedule==="weekly"?"wk":i.allowance_schedule==="bi_weekly"?"2wk":"mo"}</div>`:"";return`
            <div class="fh-home-agent-tile"
                 data-act="nav" data-nav-view="person:${C(i.person_id)}"
                 style="--tile-color:${n};--tile-tint:${p}">
                <div class="fh-home-agent-sigil">${c}</div>
                ${S>0?`<div class="fh-home-agent-pending-dot" title="${S} pending"></div>`:""}
                <div class="fh-home-agent-code">AGT &middot; ${r?m(r):m(i.name.toUpperCase())}</div>
                <div class="fh-home-agent-name">${m(i.name)}</div>
                <div class="fh-home-agent-sublabel">${m(_)} &middot; ${m(f)}</div>
                <div class="fh-home-agent-spacer"></div>
                <div class="fh-home-agent-dual">
                    <div class="fh-home-agent-stat">
                        <span class="fh-home-agent-stat-num">${O(u)}</span>
                        <span class="fh-home-agent-stat-lbl">PTS</span>
                        ${v!=null?`<span class="fh-home-agent-stat-dollar">${G(v)}</span>`:""}
                    </div>
                    <div class="fh-home-agent-stat-div"></div>
                    <div class="fh-home-agent-stat">
                        <span class="fh-home-agent-stat-num" style="${$>0?`color:${n}`:"color:var(--fh-text-sec)"}">${$}</span>
                        <span class="fh-home-agent-stat-lbl">OPEN</span>
                    </div>
                </div>
                ${x}
            </div>`}).join("")}</div>
        </div>`}function Pn(e,t){let a=t.rooms_config||{};return`
        <div class="fh-home-section">
            <div class="fh-home-section-label">ROOMS</div>
            <div class="fh-home-rooms-grid">${zt.map(s=>{var c,b;let i=((c=a[s.id])==null?void 0:c.status)||s.status;if(i==="hidden")return"";if(!(((b=t.modules)==null?void 0:b[s.id])!==!1))return`
            <div class="fh-home-room-tile off" style="--room-accent:${s.accent}">
                <div class="fh-home-room-icon" style="color:${s.accent}">${s.icon}</div>
                <div class="fh-home-room-body">
                    <div class="fh-home-room-label">${m(s.label)}</div>
                    <div class="fh-home-room-sub">${m(s.sub)}</div>
                    <div class="fh-home-room-off">MODULE OFF</div>
                    <div class="fh-home-room-preview">Enable in HA \u2192 Family Hub \u2192 Configure</div>
                </div>
            </div>`;let r=i==="live",d=r?s.getStats(e):[],p=d.map(g=>`
            <div class="fh-home-room-stat">
                <span class="fh-home-room-stat-num" style="color:${g.accent||s.accent}">${g.value}</span>
                <span class="fh-home-room-stat-lbl">${m(g.label)}</span>
            </div>
        `).join("");return`
            <div class="fh-home-room-tile ${r?"live":"coming"}"
                 data-act="nav" data-nav-view="room:${C(s.id)}"
                 style="--room-accent:${s.accent}">
                <div class="fh-home-room-icon" style="color:${s.accent}">${s.icon}</div>
                <div class="fh-home-room-body">
                    <div class="fh-home-room-label">${m(s.label)}</div>
                    <div class="fh-home-room-sub">${m(s.sub)}</div>
                    ${r&&d.length?`<div class="fh-home-room-stats">${p}</div>`:""}
                    ${r?"":`
                        <div class="fh-home-room-coming">COMING SOON</div>
                        ${s.preview?`<div class="fh-home-room-preview">${m(s.preview)}</div>`:""}
                    `}
                </div>
            </div>
        `}).join("")}</div>
        </div>
    `}function Ln(e,t,a){var i,n;let o=e.length,s="";if(t){let r=a._states(t);if(r){let d=r.state||"",p=(i=r.attributes)==null?void 0:i.temperature,c=((n=r.attributes)==null?void 0:n.temperature_unit)||"\xB0";s=`
                <div class="fh-home-today-weather">
                    <div class="fh-home-today-weather-icon">${Nn(d)}</div>
                    <div>
                        <div class="fh-home-today-temp">${p!==void 0?`${Math.round(p)}${c}`:"\u2014"}</div>
                        <div class="fh-home-today-cond">${m(On(d))}</div>
                    </div>
                </div>
            `}}return`
        <div class="fh-home-today-strip">
            ${s}
            <div class="fh-home-today-flex">
                ${o>0?`
                    <div class="fh-home-today-approvals">
                        <span class="fh-home-today-approvals-badge">${o}</span>
                        <span class="fh-home-today-approvals-lbl">${o===1?"approval pending":"approvals pending"}</span>
                    </div>
                `:`
                    <div class="fh-home-today-quiet">All clear &#8212; no approvals waiting</div>
                `}
            </div>
        </div>
    `}function On(e){return{sunny:"Sunny",clear_night:"Clear",partlycloudy:"Partly Cloudy",cloudy:"Cloudy",fog:"Foggy",rainy:"Rain",pouring:"Heavy Rain",snowy:"Snow",snowy_rainy:"Sleet",windy:"Windy",windy_variant:"Windy",lightning:"Thunderstorm",lightning_rainy:"Thunderstorm",hail:"Hail",exceptional:"Unusual"}[e]||e.replace(/_/g," ").replace(/\b\w/g,a=>a.toUpperCase())}function Nn(e){return e==="sunny"||e==="clear_night"?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>':e==="rainy"||e==="pouring"?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19a4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4m0-6a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m12-3a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3M6 5a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1z"/></svg>':e==="snowy"||e==="snowy_rainy"?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m22 11-1.5-1.5-2 2L17 10l2-2-1.5-1.5L16 8l-1.5-1.5.5-2-2.5-.5.5 2L11 7.5V5l-1.5-1.5L8 5v2.5L6.5 6.5 6 4l-2.5.5.5 2L2.5 8 1 9.5l1.5 1.5 2-2L6 10.5l-2 2L5.5 14 7 12.5 8.5 14l-.5 2 2.5.5-.5-2 1.5-1.5v2.5l1.5 1.5 1.5-1.5V13l1.5 1.5 1.5-1.5-1.5-1.5 2-2 1.5 1.5 1.5-1.5z"/></svg>':e.includes("cloud")||e==="fog"?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>':e.includes("lightning")?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>':'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>'}var Ys,Xs=N(()=>{Ut();_t();Q();K();Ys={render(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=e._people().filter(r=>r.active!==!1),o=t.family_name||"Family Hub",s=!!t.penalties_paused_global,i=t.approval_queue||[],n=t.weather_entity||"";return`
            ${In(o,s)}
            ${Tn(a,i,e)}
            ${Pn(e,t)}
            ${Ln(i,n,e)}
        `}}});function Zs(e){return Qs[e]||Qs.classic}var Qs,eo=N(()=>{Xs();Qs={classic:Ys}});function va(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=e._cfg.hub_skin||t.hub_skin||"classic";return Zs(a).render(e)}function to(e){return`
        <div class="fh-nav-back-bar" data-act="nav-back">
            <span class="fh-nav-back-chevron">&#8592;</span>
            <span class="fh-nav-back-label">${m(e)}</span>
        </div>
    `}var ao=N(()=>{eo();Q()});function so(e){let t=(e==null?void 0:e.type)||"daily";if(t==="daily"){let a=e.day_filter||[];if(!a.length||a.length===7)return"Every day";let o=[...a].sort((i,n)=>i-n),s=!0;for(let i=1;i<o.length;i++)if(o[i]!==o[i-1]+1){s=!1;break}return s&&o.length>=3?`${Vt[o[0]]}\u2013${Vt[o[o.length-1]]}`:o.map(i=>Vt[i]).join(" ")}if(t==="weekly"){let a=e.weekdays||[];return a.length?a.map(o=>Vt[o]).join(" "):"Weekly"}return t==="every_n_days"?`Every ${e.interval||2} days`:t==="every_n_weeks"?`Every ${e.interval||2} weeks`:t==="monthly_on_date"?"Monthly":t==="one_time"?"One time":t}function Hn(e){let t=(e==null?void 0:e.type)||"daily";if(t==="daily")return(e.day_filter||[]).length||7;if(t==="weekly")return(e.weekdays||[]).length||1;if(t==="every_n_days"){let a=e.interval||1;return a>0?7/a:0}if(t==="every_n_weeks"){let a=e.interval||1;return a>0?1/a:0}return t==="monthly_on_date"?(e.days_of_month&&e.days_of_month.length?e.days_of_month.length:1)*12/52:0}function jn(e){let t=e.rotation_cadence;return t==="weekly"?"Weekly":t==="per_instance"?"Each time":t==="daily"?"Daily":t||"\u2014"}function ya(e){let t=[];return e.points>0&&t.push(`<span class="pl-pts">+${e.points}</span>`),e.penalty_enabled&&e.penalty_points>0&&t.push(`<span class="pl-penalty">\u2212${e.penalty_points}</span>`),t.join("")}function Gn(e){let t=e.description?`<div class="pl-desc">${X(e.description)}</div>`:"";return`
      <tr>
        <td class="pl-name"><div>${X(e.name)}</div>${t}</td>
        <td class="pl-when">${X(so(e.recurrence))}</td>
        <td class="pl-points">${ya(e)}</td>
      </tr>`}function xa(e,t,a){if(!t.length)return"";let o=a?`<div class="pl-section-sub">${X(a)}</div>`:"";return`
      <section class="pl-section">
        <header class="pl-section-head"><h2>${X(e)}</h2>${o}</header>
        <table class="pl-table">
          <thead><tr><th>Chore</th><th>When</th><th class="pl-points">Pts</th></tr></thead>
          <tbody>${t.map(Gn).join("")}</tbody>
        </table>
      </section>`}function Wn(e){let t=(e==null?void 0:e.family_name)||"Family",a=(e==null?void 0:e.people)||[],o=(e==null?void 0:e.active_chores)||[],s=e!=null&&e.rank_ppd_ladder&&e.rank_ppd_ladder.length?e.rank_ppd_ladder:[3,3.5,4,4.5,5],i=Math.min(2,s.length-1),n=s[Math.max(0,i)],r=l=>`$${(l*n/100).toFixed(2)}`,d=new Date().toLocaleDateString(void 0,{weekday:"long",year:"numeric",month:"long",day:"numeric"}),p=a.filter(l=>l.type==="kid"&&l.active!==!1),c=p.map(l=>l.person_id),b=l=>{var y;return((y=a.find(k=>k.person_id===l))==null?void 0:y.name)||"\u2014"},g=l=>{var y;return((y=a.find(k=>k.person_id===l))==null?void 0:y.active)!==!1},u=l=>(l.rotation_pool||[]).length>1&&l.rotation_cadence,v=l=>c.length>0&&c.every(y=>(l.assigned_to||[]).includes(y)),_=[],f=[],$=[],S=[],x=new Map;p.forEach(l=>x.set(l.person_id,[]));for(let l of o){if(l.chore_type==="reminder"){let y=l.assigned_to||[];(!y.length||y.some(k=>c.includes(k)))&&S.push(l);continue}if(l.chore_type==="claimable"){$.push(l);continue}if(u(l)){f.push(l);continue}if(v(l)){_.push(l);continue}for(let y of l.assigned_to||[])x.has(y)&&x.get(y).push(l)}let h={};c.forEach(l=>h[l]=0);for(let l of o){if(l.chore_type!=="assigned")continue;let y=Hn(l.recurrence)*(l.points||0);if(!(y<=0))if(u(l)){let k=(l.rotation_pool||[]).filter(A=>c.includes(A)&&g(A));if(!k.length)continue;let M=y/k.length;k.forEach(A=>{h[A]+=M})}else for(let k of l.assigned_to||[])h[k]!=null&&(h[k]+=y)}let w='<span class="pl-rot" title="Rotates">\u21BB</span> ',z=(l,y)=>{let k=l.description?`<div class="pl-desc">${X(l.description)}</div>`:"";return`
          <tr>
            <td class="pl-name"><div>${y?w:""}${X(l.name)}</div>${k}</td>
            <td class="pl-when">${X(so(l.recurrence))}</td>
            <td class="pl-points">${ya(l)}</td>
          </tr>`},E=p.map(l=>{let y=x.get(l.person_id)||[],k=f.filter(B=>((B.assigned_to||[])[0]||null)===l.person_id),M=Math.round(h[l.person_id]||0),A=y.length||k.length?`<table class="pl-table">
                 <thead><tr><th>Chore</th><th>When</th><th class="pl-points">Pts</th></tr></thead>
                 <tbody>${y.map(B=>z(B,!1)).join("")}${k.map(B=>z(B,!0)).join("")}</tbody>
               </table>`:'<div class="pl-section-note">Just the shared + rotation chores (see above &amp; below).</div>';return`
          <section class="pl-section">
            <header class="pl-section-head pl-kid-head">
              <h2>${X(l.name)}</h2>
              <span class="pl-kid-total">~${M} pts/wk \xB7 ${r(h[l.person_id]||0)}</span>
            </header>
            ${A}
            <div class="pl-section-note">+ everyone chores (top of sheet)${k.length?" \xB7 \u21BB = rotates, see schedule":""}</div>
          </section>`}).join(""),F="";f.length&&(F=`
          <section class="pl-section">
            <header class="pl-section-head">
              <h2>Rotation schedule</h2>
              <div class="pl-section-sub">Who's up now is in <b>bold</b>; the next name is whose turn comes after. Plan or adjust turns here.</div>
            </header>
            <table class="pl-table pl-rot-table">
              <thead><tr><th>Chore</th><th class="pl-points">Pts</th><th>Rotates (in order)</th><th>Switches</th></tr></thead>
              <tbody>${f.map(y=>{let k=(y.rotation_pool||[]).filter(g),M=(y.assigned_to||[])[0]||k[0],A=k.map(B=>B===M?`<b>${X(b(B))}</b>`:X(b(B))).join(" \u2192 ");return`
              <tr>
                <td class="pl-name">${X(y.name)}</td>
                <td class="pl-points">${ya(y)}</td>
                <td>${A}</td>
                <td class="pl-when">${X(jn(y))}</td>
              </tr>`}).join("")}</tbody>
            </table>
          </section>`);let D=xa("Everyone \u2014 every kid does these",_),R=xa("Up for grabs",$,"Anyone can claim \u2014 first done gets the points."),T=xa("Reminders",S,"No points \u2014 just a daily nudge."),P=`${p.length} kid${p.length===1?"":"s"} \xB7 ${_.length} shared \xB7 ${f.length} rotating \xB7 +earned / \u2212penalty if skipped \xB7 $ shown at Rank 3 (mid-point rate)`;return`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${X(t)} \u2014 Chore List</title>
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
    <h1>${X(t)} \u2014 Chores</h1>
    <div class="pl-doc-date">${X(d)}</div>
  </header>

  <p class="pl-doc-summary">${X(P)}</p>

  ${D}
  ${E}
  ${F}
  ${R}
  ${T}

  <footer class="pl-doc-foot">
    Generated by Family Hub \xB7 ${X(new Date().toLocaleString())}
  </footer>
</body>
</html>`}function oo(e){let t=e._attrs("sensor.family_hub_needs_attention"),a=Wn(t),o=window.open("","_blank");if(!o){let s=new Blob([a],{type:"text/html"}),i=URL.createObjectURL(s);if(!window.open(i,"_blank")){let r=document.createElement("div");r.style.cssText="position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#1c1c1e;color:#fff;padding:12px 18px;border-radius:8px;z-index:9999;font:14px/1.5 sans-serif",r.innerHTML=`Pop-ups are blocked. <a href="${i}" target="_blank" style="color:#64d2ff">Open chore list</a>`,document.body.appendChild(r),setTimeout(()=>r.remove(),15e3)}return}o.document.open(),o.document.write(a),o.document.close(),o.document.title=`${(t==null?void 0:t.family_name)||"Family"} \u2014 Chore List`}var X,Vt,io=N(()=>{X=e=>String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"),Vt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]});function ka(e,t,a){var r,d,p,c,b,g,u,v,_,f,$,S,x,h,w,z,E,F,D,R,T,P;let o=a.shadowRoot,s=l=>{var y;return((y=o.getElementById(l))==null?void 0:y.value)??""},i=l=>{var y;return((y=o.getElementById(l))==null?void 0:y.checked)??!1},n=l=>parseInt(s(l)||"0");switch(e){case"nav":{let l=t.dataset.navView;if(!l)break;a._backStack.push(a._view||"home"),a._view=l,a._doRender(!0);break}case"nav-back":a._view=a._backStack.pop()||"home",a._doRender(!0);break;case"filter":a._filter=a._filter===t.dataset.pid?null:t.dataset.pid,a._doRender(!0);break;case"tab":a._tab=t.dataset.tab,a._doRender(!0);break;case"admin-sec":a._adminSec=t.dataset.sec,a._doRender(!0);break;case"hist-filter":a._histFilter=t.dataset.hpid||null,a._doRender(!0);break;case"chore-filter":a._choreFilter=t.value||null,a._doRender(!0);break;case"chore-status-filter":a._choreStatusFilter=t.value||null,a._doRender(!0);break;case"chore-rec-filter":a._choreRecFilter=t.value||null,a._doRender(!0);break;case"stats-rank":a._statsRankOverride=t.value,a._doRender(!0);break;case"stats-completion":a._statsCompletionPct=Number(t.value)||100,a._doRender(!0);break;case"stats-streak-pct":a._statsStreakPct=Number(t.value)||50,a._doRender(!0);break;case"chore-tab":{let l=t.dataset.tab;if(!l)break;a._choreFormTab=l,o.querySelectorAll(".fh-chore-tab").forEach(y=>{y.classList.toggle("active",y.dataset.tab===l)}),o.querySelectorAll(".fh-chore-tab-pane").forEach(y=>{y.style.display=y.dataset.tab===l?"":"none"}),a._syncModalUI();break}case"sort-admin-chores":{let l=t.dataset.col||null;if(!l)a._adminSort={col:null,dir:"asc"};else{let y=a._adminSort||{col:null,dir:"asc"};y.col===l?a._adminSort=y.dir==="asc"?{col:l,dir:"desc"}:{col:null,dir:"asc"}:a._adminSort={col:l,dir:"asc"}}a._doRender(!0);break}case"select-store-row":a._adminSelectedItemId=t.dataset.iid||null,a._adminSelectedChoreId=null,a._doRender(!0);break;case"close-store-panel":a._adminSelectedItemId=null,a._doRender(!0);break;case"sort-admin-store-items":{let l=t.dataset.col||null;if(!l)a._adminSortItems={col:null,dir:"asc"};else{let y=a._adminSortItems||{col:null,dir:"asc"};y.col===l?a._adminSortItems=y.dir==="asc"?{col:l,dir:"desc"}:{col:null,dir:"asc"}:a._adminSortItems={col:l,dir:"asc"}}a._doRender(!0);break}case"store-item-filter":a._storeItemFilter=t.dataset.fval||null,a._doRender(!0);break;case"toggle-admin-reward-cat":{let l=t.dataset.cat;if(!l)break;a._adminCollapsedRewardCats||(a._adminCollapsedRewardCats=new Set),a._adminCollapsedRewardCats.has(l)?a._adminCollapsedRewardCats.delete(l):a._adminCollapsedRewardCats.add(l),a._doRender(!0);break}case"ok-edit-store-item-inline":{let l=s("m-eiid"),k=(a._attrs("sensor.family_hub_needs_attention").store_items||[]).find(A=>A.item_id===l),M=wa(s,o,!0,(k==null?void 0:k.is_group_reward)??!1);if(!M)break;a._svc("update_store_item",M),a._adminSelectedItemId=null,a._doRender(!0);break}case"open-ranks":a._ranksTab=t.dataset.pid||"global",a._modal={type:"ranks",surface:"drawer",data:{}},a._doRender(!0);break;case"ranks-tab":a._ranksTab=t.dataset.tab||"global",a._doRender(!0);break;case"ranks-preview":{let l=Math.max(0,parseInt(s("m-curve-cap")||"0")),y=[],k=[];for(let B=0;B<5;B++)y.push(Math.max(0,parseFloat(s(`m-gain-pct-${B}`))||0)),k.push(Math.max(0,parseFloat(s(`m-drop-pct-${B}`))||0));let{gain:M,drop:A}=qt(l,y,k);for(let B=0;B<5;B++){let L=o.getElementById(`m-gain-pct-${B}`),q=o.getElementById(`m-drop-pct-${B}`),J=o.getElementById(`m-gain-pts-${B}`),Ze=o.getElementById(`m-drop-pts-${B}`);J&&L&&!L.disabled&&(J.textContent=M[B]),Ze&&q&&!q.disabled&&(Ze.textContent=A[B])}break}case"save-ranks-global":{let l=o.querySelectorAll(".fh-ad-rank-ladder-input"),y=[],k=!0;l.forEach(L=>{let q=parseFloat(L.value);if(isNaN(q)||q<=0){k=!1;return}y.push(q)});let M=Math.max(0,parseInt(s("m-rank-drop")||"60")),A=Math.max(0,parseInt(s("m-rank-gain")||"80")),B={rank_eval_weekday:parseInt(s("m-rank-weekday")||"0"),rank_dynamic_capacity:!0,rank_default_drop_pct:M,rank_default_gain_pct:A};k&&y.length&&(B.rank_ppd_ladder=y),a._svc("update_settings",B),a._closeModal();break}case"save-ranks-kid":{let l=s("m-rank-pid");if(!l)break;let y=Math.max(0,parseInt(s("m-curve-cap")||"0")),k=[],M=[];for(let L=0;L<5;L++)k.push(Math.max(0,parseFloat(s(`m-gain-pct-${L}`))||0)),M.push(Math.max(0,parseFloat(s(`m-drop-pct-${L}`))||0));let{gain:A,drop:B}=qt(y,k,M);a._svc("update_person",{person_id:l,rank_index:Math.max(0,Math.min(4,parseInt(s("m-rank-idx")||"0"))),rank_locked:i("m-rank-lock"),rank_gain_thresholds:A,rank_drop_thresholds:B,rank_curve:{cap:y,gain_pcts:k,drop_pcts:M}}),a._closeModal();break}case"toggle-admin-cat":{let l=t.dataset.cat;if(!l)break;a._adminCollapsedCats||(a._adminCollapsedCats=new Set),a._adminCollapsedCats.has(l)?a._adminCollapsedCats.delete(l):a._adminCollapsedCats.add(l),a._doRender(!0);break}case"complete":{let l=t.dataset.tid,y=t.dataset.pid;if(!l||!y)break;let k=parseInt(t.dataset.streak||"0"),M=parseInt(t.dataset.milestone||"0");M>0&&(k+1)%M===0&&(a._celebration={name:t.dataset.name||"Mission",streak:k+1},setTimeout(()=>{a._celebration&&(a._celebration=null,a._doRender(!0))},3e3)),a._svc("complete_task",{task_id:l,person_id:y}),a._flashing.add(l),a._pendingSubmit.add(l),a._doRender(!0),setTimeout(()=>{a._flashing.delete(l),a._doRender(!1)},1450),setTimeout(()=>{a._pendingSubmit.has(l)&&(a._pendingSubmit.delete(l),a._doRender(!1))},35e3);break}case"dismiss-celebration":a._celebration=null,a._doRender(!0);break;case"toggle-desc":{let l=t.dataset.id;a._expandedDescs.has(l)?a._expandedDescs.delete(l):a._expandedDescs.add(l),a._doRender(!0);break}case"toggle-skipped-group":{let l=t.dataset.key,y=!a._expandedSkippedDates.has(l);y?a._expandedSkippedDates.add(l):a._expandedSkippedDates.delete(l);let k=t.closest(".fh-hist-group");if(k){let M=k.querySelector(".fh-hist-subitems"),A=k.querySelector(".fh-hist-expand-icon");M&&(M.style.display=y?"flex":"none"),A&&(A.textContent=y?"\u25B2":"\u25BC")}else a._doRender(!0);break}case"approve-task":{let l=a._people().find(y=>y.type==="parent");a._svc("approve_task",{task_id:t.dataset.tid,approved_by:(l==null?void 0:l.person_id)||""});break}case"deny-task":{let l=a._people().find(y=>y.type==="parent");a._svc("deny_task",{task_id:t.dataset.tid,denied_by:(l==null?void 0:l.person_id)||""});break}case"open-partial":a._modal={type:"partial-credit",data:{tid:t.dataset.tid,name:t.dataset.name||"",pts:t.dataset.pts||"0"}},a._doRender(!0);break;case"do-partial":{let l=a._people().find(y=>y.type==="parent");a._svc("approve_task",{task_id:t.dataset.tid,approved_by:(l==null?void 0:l.person_id)||"",credit_fraction:parseFloat(t.dataset.frac||"1")}),a._closeModal();break}case"approve-redemption":{let l=a._people().find(y=>y.type==="parent");a._svc("approve_redemption",{redemption_id:t.dataset.rid,approved_by:(l==null?void 0:l.person_id)||""});break}case"decline-redemption":{let l=a._people().find(y=>y.type==="parent");a._svc("decline_redemption",{redemption_id:t.dataset.rid,declined_by:(l==null?void 0:l.person_id)||""});break}case"excuse-task":a._svc("excuse_task",{instance_id:t.dataset.iid,excused_by:t.dataset.excusedBy,reason:""});break;case"mark-complete":a._svc("mark_task_complete",{instance_id:t.dataset.iid,marked_by:t.dataset.markedBy,reason:""});break;case"reject-task":a._svc("reject_task",{instance_id:t.dataset.iid,rejected_by:t.dataset.rejectedBy,reason:""});break;case"excuse-day":{let l=a._people().find(y=>y.type==="parent");a._svc("excuse_day",{person_id:t.dataset.pid,day:t.dataset.day,excused_by:(l==null?void 0:l.person_id)||""});break}case"claim-late":a._svc("claim_late_task",{task_id:t.dataset.iid,person_id:t.dataset.pid});break;case"redeem":{let l=t.dataset.pid,y=t.dataset.iid,k=(a._attrs("sensor.family_hub_needs_attention").people||[]).find(B=>B.id===l),M=k?`sensor.family_hub_${k.name.toLowerCase().replace(/ /g,"_")}`:null,A=M?(a._attrs(M).store_items||[]).find(B=>B.item_id===y):null;if(A&&A.locked){alert(A.lock_reason||"This reward is locked until you finish your chores.");break}a._svc("request_redemption",{person_id:l,item_id:y});break}case"request-cancel-sub":if(!confirm(`Cancel "${t.dataset.name||"this subscription"}"?
This requires parent approval before it takes effect.`))break;a._svc("request_cancel_subscription",{subscription_id:t.dataset.subid,person_id:t.dataset.pid});break;case"open-chip-in":{let l=t.dataset.iid,y=t.dataset.pid,k=parseInt(t.dataset.remaining||"0"),M=parseInt(t.dataset.balance||"0"),A=a._people().find(J=>J.person_id===y),B=A?`sensor.family_hub_${A.name.toLowerCase().replace(/ /g,"_")}`:null,q=((B?a._attrs(B):{}).store_items||[]).find(J=>J.item_id===l)||{item_id:l,name:"reward"};a._modal={type:"chip-in",data:{item:q,pid:y,balance:M,remaining:k}},a._doRender(!0);break}case"ok-chip-in":{let l=parseInt(s("m-chipin-pts")||"0"),y=s("m-chipin-iid"),k=s("m-chipin-pid");if(!l||l<=0||!y||!k){alert("Please enter a valid number of points.");break}a._svc("chip_in_group_reward",{item_id:y,person_id:k,points:l}),a._modal=null,a._doRender(!0);break}case"accept-group-proposal":a._svc("respond_group_proposal",{proposal_id:t.dataset.propid,person_id:t.dataset.pid,accept:!0});break;case"decline-group-proposal":if(!confirm("Decline this group reward proposal?"))break;a._svc("respond_group_proposal",{proposal_id:t.dataset.propid,person_id:t.dataset.pid,accept:!1});break;case"approve-group-proposal":a._svc("approve_group_proposal",{proposal_id:t.dataset.propid,approved_by:t.dataset.by||"admin"});break;case"decline-group-proposal-parent":if(!confirm("Decline this group reward proposal?"))break;a._svc("decline_group_proposal",{proposal_id:t.dataset.propid,declined_by:t.dataset.by||"admin"});break;case"redeem-group-reward":if(!confirm(`Mark "${t.dataset.iname}" as redeemed?

This will mark the reward inactive.`))break;a._svc("redeem_group_reward",{item_id:t.dataset.iid,redeemed_by:"admin"});break;case"toggle-goal":{let l=t.dataset.pid,y=t.dataset.iid;if(!l||!y)break;let k=a._people().find(B=>B.person_id===l);if(!k)break;let A=a._attrs(a._personEntityId(k.name)).goal_item_id===y?"":y;a._svc("update_person",{person_id:l,goal_item_id:A});break}case"delete-chore":if(!confirm(`Delete "${t.dataset.cname}"?

This cannot be undone.`))break;a._adminSelectedChoreId=null,a._svc("delete_chore",{chore_id:t.dataset.cid});break;case"delete-store-item":if(!confirm(`Deactivate reward "${t.dataset.iname}"?

It will be hidden from kids but stays in the list as [inactive]. Use "Delete permanently" in the edit panel to remove it completely.`))break;a._svc("delete_store_item",{item_id:t.dataset.iid});break;case"hard-delete-store-item":if(!confirm(`Permanently delete "${t.dataset.iname}"?

This cannot be undone. Any pending redemption requests for this reward will be cancelled.`))break;a._adminSelectedItemId=null,a._svc("hard_delete_store_item",{item_id:t.dataset.iid}),a._doRender(!0);break;case"remove-cat-label":{let l=t.dataset.label,y=a._attrs("sensor.family_hub_needs_attention").category_labels||[];a._svc("update_settings",{category_labels:y.filter(k=>k!==l)});break}case"add-cat-label":{let l=o.getElementById("cat-label-input"),y=(r=l==null?void 0:l.value)==null?void 0:r.trim();if(!y)break;let k=a._attrs("sensor.family_hub_needs_attention").category_labels||[];k.includes(y)||a._svc("update_settings",{category_labels:[...k,y]}),l&&(l.value="");break}case"save-hub-layout":{let l={};o.querySelectorAll(".fh-hub-room-toggle").forEach(A=>{let B=A.dataset.roomId;B&&(l[B]={status:A.checked?"live":"hidden"})});let y=((p=(d=o.getElementById("m-hub-weather"))==null?void 0:d.value)==null?void 0:p.trim())||"",M=(((c=o.getElementById("m-hub-calendars"))==null?void 0:c.value)||"").split(/[\n,]+/).map(A=>A.trim()).filter(Boolean);a._svc("update_settings",{rooms_config:l,weather_entity:y,today_calendar_entities:M});break}case"toggle-global-penalty":{let l=t.checked??((b=t.querySelector("input"))==null?void 0:b.checked)??!0;a._svc("update_settings",{penalties_paused:!l});break}case"toggle-person-penalty":{let l=t.dataset.pid||((g=t.closest("[data-pid]"))==null?void 0:g.dataset.pid),y=t.checked??((u=t.querySelector("input"))==null?void 0:u.checked)??!0;l&&a._svc("update_person",{person_id:l,penalties_paused:!y});break}case"export-backup":a._svc("export_backup",{});break;case"print-chore-list":oo(a);break;case"rebuild-data":if(!confirm(`Rebuild data?

This will remove ghost records, orphaned instances, and duplicates. A summary will appear as a Home Assistant notification.

This cannot be undone.`))break;a._svc("rebuild_data",{});break;case"open-award":a._modal={type:"award",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"open-deduct":a._modal={type:"deduct",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"open-add-chore":a._adminSelectedChoreId=null,a._modal={type:"add-chore",surface:"drawer",data:{}},a._doRender(!0);break;case"select-chore-row":case"open-edit-chore":{let l=a._attrs("sensor.family_hub_needs_attention"),k=(l.all_chores||l.active_chores||[]).find(M=>M.chore_id===t.dataset.cid);if(!k)break;a._adminSelectedChoreId=null,a._modal={type:"edit-chore",surface:"drawer",data:{chore:k}},a._doRender(!0);break}case"open-add-store-item":a._adminSelectedItemId=null,a._modal={type:"add-store-item",data:{}},a._doRender(!0);break;case"open-edit-store-item":{let y=(a._attrs("sensor.family_hub_needs_attention").store_items||[]).find(k=>k.item_id===t.dataset.iid);if(!y)break;a._adminSelectedItemId=null,a._modal={type:"edit-store-item",data:{item:y}},a._doRender(!0);break}case"open-add-person":a._modal={type:"add-person",data:{}},a._doRender(!0);break;case"open-edit-person":a._modal={type:"edit-person",surface:"drawer",data:{pid:t.dataset.pid,pname:t.dataset.pname,ptype:t.dataset.ptype,pcolor:t.dataset.pcolor,allowancePts:parseInt(t.dataset.pallowpts||"0"),allowanceSched:t.dataset.pallowsched||"weekly",allowanceWday:parseInt(t.dataset.pallowwday??"5"),allowanceMday:parseInt(t.dataset.pallowmday||"1"),notifyTarget:t.dataset.pnotify||"",code:t.dataset.pcode||"",theme:t.dataset.ptheme||"classic",childMode:t.dataset.pchildmode==="true",completionThreshold:parseInt(t.dataset.pcompletionthreshold??"80"),completionMilestone:parseInt(t.dataset.pcompletionmilestone??"7"),completionBonusPoints:parseInt(t.dataset.pcompletionbonus??"50"),weeklyThreshold:parseInt(t.dataset.pweeklythreshold??"80"),weeklyMilestone:parseInt(t.dataset.pweeklymilestone??"4"),weeklyBonusPoints:parseInt(t.dataset.pweeklybonus??"100")}},a._doRender(!0);break;case"open-confirm-remove-person":a._modal={type:"confirm-remove-person",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"reactivate-person":a._svc("reactivate_person",{person_id:t.dataset.pid});break;case"open-confirm-hard-delete-person":a._modal={type:"confirm-hard-delete-person",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"open-edit-settings":a._modal={type:"edit-settings",surface:"drawer",data:{fname:t.dataset.fname,ppd:t.dataset.ppd,penaltyAlertTime:parseInt(t.dataset.palerttime??"800"),rankWeekday:parseInt(t.dataset.rankweekday??"0"),rankDrop:parseInt(t.dataset.rankdrop??"50"),rankGain:parseInt(t.dataset.rankgain??"75")}},a._doRender(!0);break;case"open-claim":a._modal={type:"claim",data:{tid:t.dataset.tid,name:t.dataset.name}},a._doRender(!0);break;case"open-add-reminder":a._modal={type:"add-reminder",data:{pid:t.dataset.pid||null}},a._doRender(!0);break;case"open-edit-streaks":a._modal={type:"edit-streaks",data:{pid:t.dataset.pid,pname:t.dataset.pname}},a._doRender(!0);break;case"close-modal":a._closeModal();break;case"ok-point-adjust":{let l=parseFloat(s("m-amount")),y=s("m-atype"),k=s("m-reason"),M=s("m-pid"),A=s("m-amode");if(!l||l<=0)break;let B={person_id:M,reason:k};y==="dollars"?B.dollar_amount=l:B.points=Math.round(l),a._svc(A==="award"?"award_bonus_points":"deduct_points",B),a._closeModal();break}case"ok-add-chore":case"ok-edit-chore":{let l=e==="ok-edit-chore",y=Jn(s,i,n,o,l);if(!y)break;a._svc(l?"update_chore":"add_chore",y),a._closeModal();break}case"set-streak":{let l=t.dataset.cid,y=t.dataset.pid,k=Math.max(0,parseInt(((v=o.getElementById(`m-streak-${l}`))==null?void 0:v.value)||"0"));a._svc("set_streak",{person_id:y,chore_id:l,count:k});break}case"rot-pool-add":case"rot-pool-remove":case"rot-pool-up":case"rot-pool-down":{let l=t.dataset.pid,y=o.getElementById("m-crot-pool-order"),k=o.getElementById("m-crot-pool-widget");if(!l||!y||!k)break;let M=y.value?y.value.split(",").filter(Boolean):[],A=M.indexOf(l);e==="rot-pool-add"?A===-1&&M.push(l):e==="rot-pool-remove"?A!==-1&&M.splice(A,1):e==="rot-pool-up"&&A>0?[M[A-1],M[A]]=[M[A],M[A-1]]:e==="rot-pool-down"&&A!==-1&&A<M.length-1&&([M[A+1],M[A]]=[M[A],M[A+1]]),y.value=M.join(","),k.innerHTML=ua(a._people(),M);break}case"ok-add-store-item":{let l=wa(s,o,!1,null);if(!l)break;a._svc("add_store_item",l),a._closeModal();break}case"ok-edit-store-item":{let l=(($=(f=(_=a._modal)==null?void 0:_.data)==null?void 0:f.item)==null?void 0:$.is_group_reward)??!1,y=wa(s,o,!0,l);if(!y)break;a._svc("update_store_item",y),a._closeModal();break}case"ok-add-person":{let l=s("m-pname").trim();if(!l)break;a._svc("add_person",{name:l,person_type:s("m-ptype"),avatar_color:s("m-pcolor")}),a._closeModal();break}case"ok-edit-person":{let l=s("m-pname").trim();if(!l)break;a._svc("update_person",{person_id:s("m-pid"),name:l,avatar_color:s("m-pcolor"),type:s("m-ptype"),allowance_points:parseInt(s("m-allowance-pts")||"0"),allowance_schedule:s("m-allowance-schedule"),allowance_weekday:parseInt(s("m-allowance-weekday")),allowance_monthday:parseInt(s("m-allowance-monthday")),notify_target:s("m-pnotify").trim(),code:s("m-pcode").trim().toUpperCase(),theme_key:s("m-ptheme"),child_mode:i("m-pchildmode"),completion_threshold_pct:Math.max(1,Math.min(100,n("m-completion-threshold")||80)),completion_milestone:Math.max(0,n("m-completion-milestone")||0),completion_bonus_points:Math.max(0,n("m-completion-bonus")||0),weekly_completion_threshold_pct:Math.max(1,Math.min(100,n("m-weekly-threshold")||80)),weekly_completion_milestone:Math.max(0,Math.min(52,n("m-weekly-milestone")||0)),weekly_completion_bonus_points:Math.max(0,n("m-weekly-bonus")||0)}),a._closeModal();break}case"ok-remove-person":{let l=s("m-rpid");if(!l)break;a._svc("remove_person",{person_id:l}),a._closeModal();break}case"ok-hard-delete-person":{let l=s("m-hdpid");if(!l)break;a._svc("hard_delete_person",{person_id:l}),a._closeModal();break}case"ok-edit-settings":{let l=s("m-fname").trim(),y=parseInt(s("m-ppd")||"10"),k=parseInt(s("m-alert-time")??"-1");if(!l)break;a._svc("update_settings",{family_name:l,points_per_dollar:y,penalty_alert_time:isNaN(k)?800:k}),a._closeModal();break}case"ok-claim":{let l=t.dataset.tid||s("m-cltid"),y=t.dataset.pid||s("m-clperson");if(!l||!y)break;a._svc("claim_task",{task_id:l,person_id:y}),a._closeModal();break}case"ok-add-reminder":{let l=s("m-rname").trim(),y=s("m-rperson");if(!l||!y)break;a._svc("add_chore",{name:l,chore_type:"reminder",assigned_to:[y],recurrence_type:s("m-rrec"),approval_required:!1,points:0,category_label:""}),a._closeModal();break}case"pick-template":{let l=(S=o.getElementById("m-ctpl"))==null?void 0:S.value;if(!l)break;let y=Ft.find(A=>A.key===l);if(!y)break;let k=(A,B)=>{let L=o.getElementById(A);L!==null&&(L.value=B)};k("m-cname",y.name),k("m-cdesc",y.description||"");let M=o.getElementById("m-clabel");M&&y.category&&[...M.options].find(B=>B.value===y.category)&&(M.value=y.category),y.points&&k("m-cpts",y.points),(x=o.getElementById("m-cname"))==null||x.focus();break}case"pick-icon":{let l=t.dataset.icon,y=o.getElementById("m-cicon");y&&(y.value=l);let k=o.getElementById("m-cicon-preview");k&&(k.innerHTML=""),o.querySelectorAll(".fh-icon-cell").forEach(A=>A.classList.toggle("selected",A.dataset.icon===l));let M=o.getElementById("m-icon-selected");if(M){let A=t.querySelector("span:first-child"),B=t.title||l;M.innerHTML='<span class="fh-icon-sel-icon" style="display:inline-flex;width:20px;height:20px;color:var(--fh-accent)">'+(A?A.innerHTML:"")+`</span> <span class="fh-icon-sel-lbl">${B}</span>`}break}case"upload-icon":{let l=o.getElementById("m-icon-upload");if(!l){console.warn("[family-hub] upload-icon: hidden file input not found");break}l.value="",l.click();break}case"clear-icon":{let l=o.getElementById("m-cicon");l&&(l.value="");let y=o.getElementById("m-cicon-preview");y&&(y.innerHTML=""),o.querySelectorAll(".fh-icon-cell.selected").forEach(k=>k.classList.remove("selected"));break}case"approve-subscription-redemption":{let l=t.dataset.rid,y=t.dataset.period||"monthly",k=a._people().find(A=>A.type==="parent"),M={redemption_id:l,approved_by:(k==null?void 0:k.person_id)||""};y==="weekly"?M.subscription_anchor=parseInt(((h=o.getElementById(`m-sub-wday-${l}`))==null?void 0:h.value)??"0"):y!=="daily"&&(M.subscription_anchor=Math.max(1,Math.min(31,parseInt(((w=o.getElementById(`m-sub-dom-${l}`))==null?void 0:w.value)??"1")))),a._svc("approve_redemption",M);break}case"admin-cancel-subscription":{let l=t.dataset.sname||"this subscription";if(!confirm(`Cancel "${l}"?

This will immediately end the subscription.`))break;let y=a._people().find(k=>k.type==="parent");a._svc("admin_cancel_subscription",{subscription_id:t.dataset.subid,canceled_by:(y==null?void 0:y.person_id)||""});break}case"admin-edit-subscription-open":a._editingSubId=t.dataset.subid,a._doRender();break;case"admin-edit-subscription-cancel":a._editingSubId=null,a._doRender();break;case"admin-update-subscription":{let l=t.dataset.subid,y=t.closest(".fh-point-row"),k=((z=y==null?void 0:y.querySelector(`#sub-edit-period-${CSS.escape(l)}`))==null?void 0:z.value)||null,M=(F=(E=y==null?void 0:y.querySelector(`#sub-edit-cost-${CSS.escape(l)}`))==null?void 0:E.value)==null?void 0:F.trim(),A=(R=(D=y==null?void 0:y.querySelector(`#sub-edit-date-${CSS.escape(l)}`))==null?void 0:D.value)==null?void 0:R.trim(),B={subscription_id:l};if(k&&(B.period=k),M!==void 0&&M!==""){let L=parseFloat(M);!isNaN(L)&&L>=0&&(B.dollar_cost_override=L)}A&&(B.next_renewal_date=A),a._editingSubId=null,a._svc("update_subscription",B);break}case"approve-cancel-subscription":{let l=a._people().find(y=>y.type==="parent");a._svc("approve_cancel_subscription",{subscription_id:t.dataset.subid,approved_by:(l==null?void 0:l.person_id)||""});break}case"decline-cancel-subscription":{let l=a._people().find(y=>y.type==="parent");a._svc("decline_cancel_subscription",{subscription_id:t.dataset.subid,declined_by:(l==null?void 0:l.person_id)||""});break}case"meals-tab":a._mealsTab=t.dataset.tab||"week",a._mealsDrawer=null,a._mealsRecipe=null,a._mealsDayPick=null,a._doRender(!0);break;case"meals-week-prev":a._mealsWeekPage=Math.max(0,(a._mealsWeekPage||0)-1),a._doRender(!0);break;case"meals-week-next":a._mealsWeekPage=Math.min(4,(a._mealsWeekPage||0)+1),a._doRender(!0);break;case"meals-week-today":a._mealsWeekPage=0,a._doRender(!0);break;case"meals-week-tap-day":{let l=t.dataset.date;if(!l)break;a._mealsTab="plan",a._mealsJumpDate=l,a._mealsDrawer=null,a._doRender(!0);break}case"meals-plan-select-day":a._mealsJumpDate=t.dataset.date||null,a._mealsDrawer=null,a._doRender(!0);break;case"meals-clear-day":a._svc("meals_clear_day",{date:t.dataset.date});break;case"meals-clear-dinner":a._svc("meals_clear_dinner",{date:t.dataset.date});break;case"meals-clear-bl":a._svc("meals_set_bl",{date:t.dataset.date,slot:t.dataset.slot,meal_id:"",scope:"today",week_start:"Sunday"});break;case"meals-remove-side":{let l=t.dataset.date,y=t.dataset.side,M=(a._attrs("sensor.family_hub_meals").plan||{})[l]||{},A=(M.d&&M.d.sides||[]).filter(B=>B!==y);a._svc("meals_set_dinner_sides",{date:l,sides:A});break}case"meals-rhythm-pop":{let l=t.dataset.weekday,y=a.shadowRoot.getElementById("fh-rh-pop-"+l);a.shadowRoot.querySelectorAll("[id^='fh-rh-pop-']").forEach(k=>{k.id!=="fh-rh-pop-"+l&&(k.style.display="none")}),y&&(y.style.display=y.style.display==="none"?"":"none");break}case"meals-set-rhythm":{let l=t.dataset.weekday,y=t.dataset.theme||"";a._svc("meals_set_rhythm",{weekday:parseInt(l,10),...y?{theme_key:y}:{}});let k=a.shadowRoot.getElementById("fh-rh-pop-"+l);k&&(k.style.display="none");break}case"meals-open-drawer":case"meals-open-sides":{let l=t.dataset.kind||(e==="meals-open-sides"?"d-sides":"d-main"),y=t.dataset.date||a._mealsJumpDate||null;if(!y)break;let M=(a._attrs("sensor.family_hub_meals").plan||{})[y]||{},A=l==="d-sides"?"sides":l==="b"||l==="l"?"browse":"protein",B=l==="d-sides"&&M.d?M.d.sides||[]:[];a._mealsDrawer={kind:l,dateISO:y,step:A,cat:null,cut:null,scope:"today",favOnly:!1,pendingMainId:null,pickedProtein:null,nudgeOff:!1,fatsOff:!1,selSides:B},a._doRender(!0);break}case"meals-close-drawer":a._mealsDrawer=null,a._doRender(!0);break;case"meals-drawer-back":{let l=a._mealsDrawer;if(!l)break;if(l.step==="cut")l.step="protein",l.cat=null;else if(l.step==="make"){let{PROTEINS:y}=Qe(),k=l.cat?(((T=y[l.cat])==null?void 0:T.cuts)||[]).filter(M=>!0):[];l.cat&&k.length>1?(l.step="cut",l.cut=null):(l.step="protein",l.cat=null,l.cut=null)}else if(l.step==="browse")l.step="protein";else if(l.step==="tacoprotein")l.step="make",l.pendingMainId=null;else if(l.step==="sides"&&l.pendingMainId){let{mealById:y,allMeals:k}=Qe(),M=y(l.pendingMainId,a._attrs("sensor.family_hub_meals").custom||[]);M&&M.proteinPick?l.step="tacoprotein":(l.step="make",l.pendingMainId=null)}a._mealsDrawer={...l},a._doRender(!0);break}case"meals-drawer-browse":if(!a._mealsDrawer)break;a._mealsDrawer={...a._mealsDrawer,step:"browse"},a._doRender(!0);break;case"meals-drawer-favonly":if(!a._mealsDrawer)break;a._mealsDrawer={...a._mealsDrawer,favOnly:!a._mealsDrawer.favOnly},a._doRender(!0);break;case"meals-drawer-scope":if(!a._mealsDrawer)break;a._mealsDrawer={...a._mealsDrawer,scope:t.dataset.scope||"today"},a._doRender(!0);break;case"meals-drawer-pick-cat":{let l=a._mealsDrawer;if(!l)break;let y=t.dataset.cat,{PROTEINS:k,MEALS:M}=Qe(),A=a._attrs("sensor.family_hub_meals").custom||[],L=M.concat(A).filter(J=>J.types.includes("d")&&!J.special&&J.protein===y),q=(((P=k[y])==null?void 0:P.cuts)||[]).filter(J=>L.some(Ze=>Ze.cut===J.id));q.length>1?a._mealsDrawer={...l,cat:y,step:"cut"}:a._mealsDrawer={...l,cat:y,cut:q.length===1?q[0].id:null,step:"make"},a._doRender(!0);break}case"meals-drawer-pick-cut":if(!a._mealsDrawer)break;a._mealsDrawer={...a._mealsDrawer,cut:t.dataset.cut,step:"make"},a._doRender(!0);break;case"meals-drawer-pick-main":{let l=a._mealsDrawer;if(!l)break;let y=t.dataset.meal,{mealById:k,allMeals:M}=Qe(),A=a._attrs("sensor.family_hub_meals").custom||[],B=k(y,A);if(!B)break;if(B.special)a._svc("meals_set_dinner",{date:l.dateISO,main:y,sides:[]}),Yt(a,l.dateISO,B);else{let L=new Set(B.sides||[]);B.proteinPick?a._mealsDrawer={...l,pendingMainId:y,pickedProtein:B.defaultPick||B.proteinPick[0],selSides:[...L],step:"tacoprotein",nudgeOff:!1,fatsOff:!1}:a._mealsDrawer={...l,pendingMainId:y,selSides:[...L],step:"sides",nudgeOff:!1,fatsOff:!1},a._doRender(!0)}break}case"meals-drawer-pick-special":{let l=a._mealsDrawer;if(!l)break;let y=t.dataset.meal,{mealById:k}=Qe(),M=a._attrs("sensor.family_hub_meals").custom||[];a._svc("meals_set_dinner",{date:l.dateISO,main:y,sides:[]}),Yt(a,l.dateISO,k(y,M));break}case"meals-drawer-pick-taco-protein":{let l=a._mealsDrawer;if(!l)break;a._mealsDrawer={...l,pickedProtein:t.dataset.protein,step:"sides"},a._doRender(!0);break}case"meals-drawer-pick-bl":{let l=a._mealsDrawer;if(!l)break;a._svc("meals_set_bl",{date:l.dateISO,slot:l.kind,meal_id:t.dataset.meal,scope:l.scope||"today",week_start:"Sunday"}),a._mealsDrawer=null,a._doRender(!0);break}case"meals-toggle-side":{let l=a._mealsDrawer;if(!l)break;let y=t.dataset.side,k=new Set(l.selSides||[]);k.has(y)?k.delete(y):k.add(y),a._mealsDrawer={...l,selSides:[...k]},a._doRender(!0);break}case"meals-dismiss-nudge":if(!a._mealsDrawer)break;a._mealsDrawer={...a._mealsDrawer,nudgeOff:!0},a._doRender(!0);break;case"meals-dismiss-fats":if(!a._mealsDrawer)break;a._mealsDrawer={...a._mealsDrawer,fatsOff:!0},a._doRender(!0);break;case"meals-drawer-no-sides":{let l=a._mealsDrawer;if(!l)break;if(l.kind==="d-sides")a._svc("meals_set_dinner_sides",{date:l.dateISO,sides:[]});else{let{variantFor:y,mealById:k,parseISO:M}=Qe(),A=a._attrs("sensor.family_hub_meals").custom||[],B=k(l.pendingMainId,A),L=B?y(B,M(l.dateISO),l.pickedProtein):"";a._svc("meals_set_dinner",{date:l.dateISO,main:l.pendingMainId,sides:[],...l.pickedProtein?{protein:l.pickedProtein}:{},...L?{variant:L}:{}}),Yt(a,l.dateISO,B);return}a._mealsDrawer=null,a._doRender(!0);break}case"meals-drawer-done-sides":{let l=a._mealsDrawer;if(!l)break;if(l.kind==="d-sides")a._svc("meals_set_dinner_sides",{date:l.dateISO,sides:l.selSides||[]}),a._mealsDrawer=null,a._doRender(!0);else{let{variantFor:y,mealById:k,parseISO:M}=Qe(),A=a._attrs("sensor.family_hub_meals").custom||[],B=k(l.pendingMainId,A),L=B?y(B,M(l.dateISO),l.pickedProtein):"";a._svc("meals_set_dinner",{date:l.dateISO,main:l.pendingMainId,sides:l.selSides||[],...l.pickedProtein?{protein:l.pickedProtein}:{},...L?{variant:L}:{}}),Yt(a,l.dateISO,B)}break}case"meals-drawer-next-day":{let l=a._mealsDrawer;if(!l)break;qn(a,l.dateISO);break}case"meals-toggle-have":a._svc("meals_toggle_have",{ingredient_id:t.dataset.ing});break;case"meals-pantry-pick":a._mealsDayPick=t.dataset.meal||null,a._doRender(!0);break;case"meals-daypick-pick":{let l=t.dataset.date,y=t.dataset.meal,M=a._attrs("sensor.family_hub_meals").custom||[],{mealById:A}=Qe(),B=A(y,M);if(!l||!B)break;a._svc("meals_set_dinner",{date:l,main:y,sides:(B.sides||[]).slice(0,2)}),a._mealsDayPick=null,a._doRender(!0);break}case"meals-close-daypick":a._mealsDayPick=null,a._doRender(!0);break;case"meals-lib-filter":a._mealsLibFilter=t.dataset.filter||"all",a._doRender(!0);break;case"meals-open-recipe":a._mealsRecipe=t.dataset.meal||null,a._doRender(!0);break;case"meals-close-recipe":a._mealsRecipe=null,a._doRender(!0);break;case"meals-recipe-plan":a._mealsRecipe=null,a._mealsDayPick=t.dataset.meal||null,a._doRender(!0);break;case"meals-lib-plan-meal":a._mealsDayPick=t.dataset.meal||null,a._doRender(!0);break;case"meals-toggle-fav":a._svc("meals_toggle_fav",{meal_id:t.dataset.meal});break;case"meals-ideas-refresh":a._doRender(!0);break;case"meals-save-idea":{let{IDEAS_POOL:l}=Qe(),y=l.find(M=>M.id===t.dataset.meal);if(!y)break;let k={id:y.id,name:y.name,glyph:y.glyph,types:["d"],groups:y.groups||[],ing:y.ing||[],sides:y.sides||[],protein:y.protein||"meatless",cut:y.cut||"",fav:!1,source:"Spoonacular"};a._svc("meals_add_custom_meal",{meal:k});break}case"meals-toggle-groc":a._svc("meals_toggle_grocery",{key:t.dataset.key,checked:t.dataset.checked==="true"});break;case"meals-reset-groc":{let y=a._attrs("sensor.family_hub_meals").groc||{},k=t.dataset.weekkey||"";Object.entries(y).forEach(([M,A])=>{A&&M.startsWith(k+":")&&a._svc("meals_toggle_grocery",{key:M,checked:!1})});break}case"meals-admin-subtab":a._mealsAdminSubtab=t.dataset.sub,a._mealsAdminRecipeId=null,a._doRender(!0);break;case"meals-admin-add-meal":{let l=s("ma-name").trim();if(!l){alert("Give the meal a name first.");break}let y=["b","l","d"].filter(he=>i("ma-type-"+he));if(!y.length){alert("Pick breakfast, lunch, or dinner.");break}let k=Xe.filter(he=>i("ma-grp-"+he)),M=at.filter(he=>i("ma-side-"+he.id)).map(he=>he.id),B=Oe(a._attrs("sensor.family_hub_meals").customIng||[]).filter(he=>i("ma-ing-"+he.id)).map(he=>he.id),L=s("ma-protcut"),[q,J]=L?L.split(":"):["",""],bt={id:"custom-"+(l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||Date.now()),name:l,glyph:s("ma-glyph")||"\u{1F37D}\uFE0F",types:y,groups:k,ing:B,sides:M,fav:!1};q&&(bt.protein=q),J&&(bt.cut=J),a._svc("meals_add_custom_meal",{meal:bt});break}case"meals-admin-remove-meal":a._svc("meals_remove_custom_meal",{meal_id:t.dataset.id});break;case"meals-admin-add-ing":{let l=s("mi-name").trim();if(!l){alert("Name the ingredient first.");break}let y="custom-ing-"+(l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||Date.now());a._svc("meals_add_ingredient",{ingredient:{id:y,label:l,glyph:s("mi-glyph")||"\u{1F955}",cat:s("mi-cat"),aisle:s("mi-aisle")}});break}case"meals-admin-remove-ing":a._svc("meals_remove_ingredient",{ingredient_id:t.dataset.id});break;case"meals-admin-recipe-edit":a._mealsAdminRecipeId=t.dataset.id,a._doRender(!0);break;case"meals-admin-recipe-cancel":a._mealsAdminRecipeId=null,a._doRender(!0);break;case"meals-admin-recipe-save":{let l=M=>s(M).split(`
`).map(A=>A.trim()).filter(Boolean),y=l("mr-ing"),k=l("mr-steps");if(!y.length||!k.length){alert("A recipe needs at least one ingredient and one step.");break}a._svc("meals_save_recipe",{meal_id:t.dataset.id,recipe:{time:s("mr-time").trim()||"\u2014",serves:parseInt(s("mr-serves"),10)||5,ingredients:y,steps:k}}),a._mealsAdminRecipeId=null,a._doRender(!0);break}}}function Qe(){return jt}function Yt(e,t,a){e._mealsDrawer={kind:"d",dateISO:t,step:"confirm",savedName:a?a.name:"Dinner",savedGlyph:a?a.glyph:"\u2713"},e._doRender(!0)}function qn(e,t){let{today:a,addDays:o,iso:s,HORIZON_DAYS:i}=jt,n=e._attrs("sensor.family_hub_meals").plan||{},r=ft(t),d=null;for(let p=1;p<i;p++){let c=o(r,p);if(c>o(a(),i-1))break;let b=n[s(c)];if(!b||!b.d){d=c;break}}if(d){let p=s(d);e._mealsJumpDate=p,e._mealsDrawer={kind:"d-main",dateISO:p,step:"protein",cat:null,cut:null,scope:"today",favOnly:!1,pendingMainId:null,pickedProtein:null,nudgeOff:!1,fatsOff:!1,selSides:[]}}else e._mealsDrawer=null;e._doRender(!0)}function no(e,t){return Array.from(t.querySelectorAll(`.${e}:checked`)).map(a=>a.value)}function ro(e){let t=(e||"").trim();return t?t.startsWith("data:")?t:t.toLowerCase():""}function Jn(e,t,a,o,s){var x;let i=e("m-cname").trim();if(!i)return null;let n=e("m-crec"),r=e("m-ctype"),d=no("m-assign-person",o),p=Array.from(o.querySelectorAll(".m-wd-day:checked")).map(h=>parseInt(h.value)),c=Array.from(o.querySelectorAll(".m-df-day:checked")).map(h=>parseInt(h.value)),b=(e("m-dom-days")||"").split(",").map(h=>parseInt(h.trim())).filter(h=>Number.isFinite(h)&&h>=1&&h<=31),g=b.length?[...new Set(b)].sort((h,w)=>h-w):[1],u=ro(e("m-cicon")),v={name:i,chore_type:r,category_label:e("m-clabel"),assigned_to:d,points:a("m-cpts"),approval_required:t("m-cappr"),penalty_enabled:t("m-cpenalty"),penalty_points:a("m-cpenalty-pts"),icon:u};if(t("m-cpenalty")){let h=parseInt(e("m-daily-threshold")||"0");h>0&&(v.daily_penalty_after_days=h)}r==="claimable"&&(v.claimable_subtype=e("m-csubtype")||"fcfs",v.claimable_subtype==="multi_claim"&&(v.max_claimants=Math.max(2,a("m-max-claimants")||2),v.multi_claim_points_mode=e("m-points-mode")||"full"));let _=e("m-cdesc").trim();_&&(v.description=_);let f=o.getElementById("m-chore-expiry-section");if(f&&f.style.display!=="none"){let h=parseInt(e("m-cexpiry")||"0");h>0&&(v.expires_after_days=h)}v.streak_milestone=Math.max(0,a("m-streak-milestone")||0),v.streak_bonus_points=Math.max(0,a("m-streak-bonus")||0);let S=parseInt(e("m-reminder-time")??"-1");if(v.reminder_time=isNaN(S)?-1:S,r==="assigned"){let h=t("m-crot-enabled"),w=e("m-crot-pool-order")||"",z=h&&w?w.split(",").filter(Boolean):[];v.rotation_pool=z,v.rotation_cadence=h&&z.length?e("m-crot-cadence")||"per_instance":"",v.rotation_switch_weekday=parseInt(e("m-crot-switch-day")||"0")||0}else v.rotation_pool=[],v.rotation_cadence="";return s?(v.chore_id=e("m-cid"),v.active=((x=o.querySelector("#m-cactive"))==null?void 0:x.checked)!==!1,v.weekdays=p,v.day_filter=c,v.recurrence={type:n,weekdays:p,day_filter:c,...n==="monthly_on_date"?{days_of_month:g,day_of_month:g[0]}:{}}):(v.recurrence_type=n,p.length&&(v.weekdays=p),c.length&&(v.day_filter=c),n==="monthly_on_date"&&(v.days_of_month=g,v.day_of_month=g[0])),v}function wa(e,t,a,o){var b,g,u;let s=a?e("m-eiid"):null,i=e("m-sname").trim(),n=parseFloat(e("m-sdollar"));if(a&&!s||!i||!n||n<=0)return null;let r=((b=t.querySelector("#m-sgroup"))==null?void 0:b.checked)||!1,d=e("m-sscope"),p={name:i,dollar_value:n,scope:d,description:e("m-sdesc").trim(),category_label:e("m-scat")||"",max_per_period:parseInt(e("m-smaxperiod")||"0"),period:e("m-speriod")||"week",icon:ro(e("m-cicon"))};if(a&&(p.item_id=s,p.active=((g=t.querySelector("#m-sactive"))==null?void 0:g.checked)!==!1),r){let v=[...t.querySelectorAll(".m-scontrib")].filter(f=>parseInt(f.value)>0).map(f=>({person_id:f.dataset.pid,share_pct:parseInt(f.value)}));if(v.length===0)return alert("Group reward needs at least one contributor with a share > 0%."),null;let _=v.reduce((f,$)=>f+$.share_pct,0);if(_!==100)return alert(`Contributor shares must sum to exactly 100% (currently ${_}%). Use the "Equal split" button or adjust manually.`),null;p.is_group_reward=!0,p.contributors=v,p.scope="personal",p.person_ids=v.map(f=>f.person_id)}else a&&o&&(p.is_group_reward=!1,p.contributors=[]),d==="personal"?p.person_ids=no("m-sp-person",t):a&&(p.person_ids=[]);let c=((u=t.querySelector("#m-ssubtype"))==null?void 0:u.checked)||!1;return p.item_type=c?"subscription":"one_time",c&&(p.subscription_period=e("m-ssperiod")||"monthly"),p.require_daily_pct=Math.max(0,Math.min(100,parseInt(e("m-sreqpct")||"0")||0)),p.min_rank_index=Math.max(0,Math.min(4,parseInt(e("m-sminrank")||"0")||0)),p}function lo(e,t){var s;let a=(s=e==null?void 0:e.files)==null?void 0:s[0];if(!a)return;if(a.size>5*1024*1024){alert("Image too large. Please pick a file under 5 MB.");return}let o=new FileReader;o.onload=()=>{let i=new Image;i.onload=()=>{let r=i.width,d=i.height;r>d?r>128&&(d=Math.round(d*128/r),r=128):d>128&&(r=Math.round(r*128/d),d=128);let p=document.createElement("canvas");p.width=r,p.height=d,p.getContext("2d").drawImage(i,0,0,r,d);let b=p.toDataURL("image/png");if(b.length>350*1024){alert("Resized image is still too large. Pick a simpler image.");return}let g=t.getElementById("m-cicon");g&&(g.value=b);let u=t.getElementById("m-cicon-preview");u&&(u.innerHTML=`<div style="display:flex;align-items:center;gap:10px;padding:8px;border:1px solid var(--fh-border);border-radius:6px;background:var(--fh-surface)"><img src="${b}" style="width:48px;height:48px;object-fit:contain;border-radius:4px" alt=""><span style="font-size:.85rem;color:var(--fh-text-sec)">Custom uploaded image</span><button type="button" class="fh-btn fh-btn-ghost fh-btn-sm" data-act="clear-icon" style="margin-left:auto">Clear</button></div>`),t.querySelectorAll(".fh-icon-cell.selected").forEach(v=>v.classList.remove("selected"))},i.onerror=()=>alert("Could not read that image."),i.src=o.result},o.onerror=()=>alert("Could not read that file."),o.readAsDataURL(a)}var co=N(()=>{K();Kt();io();Ct()});var Xt,po=N(()=>{Ta();K();Q();ds();Vs();ao();Ut();na();ra();_t();co();Kt();Xt=class extends HTMLElement{static getStubConfig(){return{mode:"command_center"}}static getConfigElement(){return document.createElement("family-hub-card-editor")}constructor(){super(),this.attachShadow({mode:"open"}),this._cfg={},this._hass=null,this._model=null,this._lastDataRev=void 0,this._pendingRev=void 0,this._fetching=!1,this._modal=null,this._filter=null,this._tab="tasks",this._adminSec="today",this._flashing=new Set,this._pendingSubmit=new Set,this._expandedDescs=new Set,this._histFilter=null,this._choreFilter=null,this._expandedSkippedDates=new Set,this._view="home",this._backStack=[],this._viewPersonId=null,this._celebration=null,this._dragId=null,this._dragOverId=null,this._dragType=null,this._sortedChores=[],this._sortedStoreItems=[],this._adminSelectedChoreId=null,this._adminSort={col:null,dir:"asc"},this._adminCollapsedCats=new Set,this._choreFormTab="details",this._adminSelectedItemId=null,this._adminSortItems={col:null,dir:"asc"},this._adminCollapsedRewardCats=new Set,this._storeItemFilter=null,this._mealsTab="week",this._mealsWeekPage=0,this._mealsJumpDate=null,this._mealsDrawer=null,this._mealsRecipe=null,this._mealsDayPick=null,this._mealsNudgeDismissed=new Set,this._mealsFatDismissed=new Set,this._mealsLibFilter="all",this._mealsAdminSubtab="meals",this._mealsAdminRecipeId=null,this._abortCtrl=null,this._retryTimer=null}_reorderCategory(t,a,o){let s=this._attrs("sensor.family_hub_needs_attention").category_labels||[];if(!s.includes(t)||!s.includes(a))return;let i=s.filter(p=>p!==t),n=i.indexOf(a),r=o==="above"?n:n+1,d=[...i.slice(0,r),t,...i.slice(r)];this._svc("update_settings",{category_labels:d})}connectedCallback(){this._abortCtrl=new AbortController;let{signal:t}=this._abortCtrl,a=this.shadowRoot;a.addEventListener("click",o=>{let s=o.target.closest("[data-act]");s&&s.tagName!=="SELECT"&&ka(s.dataset.act,s,this)},{signal:t}),a.addEventListener("change",o=>{var i,n;let s=o.target;if(["chore-status-filter","chore-rec-filter","chore-filter","stats-rank","stats-completion","stats-streak-pct"].includes(s.dataset.act)){ka(s.dataset.act,s,this);return}if(s.dataset.act==="toggle-stats-streaks"){this._statsIncludeStreaks=s.checked,this._doRender(!0);return}if(s.dataset.act==="toggle-dollar"){this._svc("update_settings",{show_dollar_value_to_kids:s.checked});return}if(s.dataset.act==="toggle-global-penalty"){this._svc("update_settings",{penalties_paused:!s.checked});return}if(s.dataset.act==="toggle-person-penalty"){let r=s.dataset.pid;r&&this._svc("update_person",{person_id:r,penalties_paused:!s.checked});return}if(s.id==="m-everyone"&&a.querySelectorAll(".m-assign-person").forEach(r=>{var d;r.checked=s.checked,(d=r.closest(".fh-person-cb-chip"))==null||d.classList.toggle("checked",s.checked)}),s.classList.contains("m-assign-person")&&!s.checked){let r=a.getElementById("m-everyone");r&&(r.checked=!1)}(s.classList.contains("m-wd-day")||s.classList.contains("m-df-day"))&&((i=s.closest(".fh-wd-chip"))==null||i.classList.toggle("checked",s.checked)),(s.classList.contains("m-assign-person")||s.classList.contains("m-sp-person")||s.classList.contains("m-rot-person"))&&((n=s.closest(".fh-person-cb-chip"))==null||n.classList.toggle("checked",s.checked)),s.id==="m-icon-upload"&&s.files&&s.files.length>0&&lo(s,a),this._syncModalUI()},{signal:t}),a.addEventListener("dragstart",o=>{let s=o.target.closest("[data-drag-id]");s&&(this._dragId=s.dataset.dragId,this._dragType=s.dataset.dragType||"chore",this._dragSide=null,o.dataTransfer.effectAllowed="move",setTimeout(()=>s.classList.add("fh-dragging"),0))},{signal:t}),a.addEventListener("dragover",o=>{let s=o.target.closest("[data-drag-id]");if(!s||s.dataset.dragId===this._dragId)return;let i=s.dataset.dragType||"chore";if(i!==this._dragType)return;o.preventDefault();let n=s.getBoundingClientRect(),d=i==="category"?o.clientX<n.left+n.width/2?"above":"below":o.clientY<n.top+n.height/2?"above":"below";a.querySelectorAll(".fh-drop-above, .fh-drop-below").forEach(p=>p.classList.remove("fh-drop-above","fh-drop-below")),s.classList.add(d==="above"?"fh-drop-above":"fh-drop-below"),this._dragOverId=s.dataset.dragId,this._dragSide=d},{signal:t}),a.addEventListener("dragleave",o=>{let s=o.target.closest("[data-drag-id]");s&&s.classList.remove("fh-drop-above","fh-drop-below")},{signal:t}),a.addEventListener("drop",o=>{var _,f,$,S;o.preventDefault(),a.querySelectorAll(".fh-drop-above, .fh-drop-below, .fh-dragging").forEach(x=>x.classList.remove("fh-drop-above","fh-drop-below","fh-dragging"));let s=this._dragId,i=this._dragOverId,n=this._dragSide||"above",r=this._dragType||"chore";if(this._dragId=this._dragOverId=null,this._dragSide=null,this._dragType=null,!s||!i||s===i)return;if(r==="category"){this._reorderCategory(s,i,n);return}let d=r==="store-item"?{list:this._sortedStoreItems,idKey:"item_id",svc:"update_store_item",idField:"item_id"}:{list:this._sortedChores,idKey:"chore_id",svc:"update_chore",idField:"chore_id"},p=d.list.filter(x=>x[d.idKey]!==s),c=p.findIndex(x=>x[d.idKey]===i);if(c<0)return;let b,g;n==="above"?(b=((_=p[c-1])==null?void 0:_.sort_order)??p[c].sort_order-20,g=p[c].sort_order):(b=p[c].sort_order,g=((f=p[c+1])==null?void 0:f.sort_order)??b+20);let u=(b+g)/2,v=.01;if(Math.abs(g-u)<v||Math.abs(u-b)<v){let x=p.map((E,F)=>({...E,sort_order:(F+1)*10})),h=x.findIndex(E=>E[d.idKey]===i),w,z;n==="above"?(w=(($=x[h-1])==null?void 0:$.sort_order)??0,z=x[h].sort_order):(w=x[h].sort_order,z=((S=x[h+1])==null?void 0:S.sort_order)??w+20),u=(w+z)/2,x.forEach(E=>{E[d.idKey]!==s&&this._svc(d.svc,{[d.idField]:E[d.idKey],sort_order:E.sort_order})})}this._svc(d.svc,{[d.idField]:s,sort_order:u})},{signal:t}),a.addEventListener("dragend",()=>{a.querySelectorAll(".fh-drop-above, .fh-drop-below, .fh-dragging").forEach(o=>o.classList.remove("fh-drop-above","fh-drop-below","fh-dragging")),this._dragId=this._dragOverId=null,this._dragSide=null,this._dragType=null},{signal:t})}disconnectedCallback(){var t;(t=this._abortCtrl)==null||t.abort(),this._abortCtrl=null,this._retryTimer&&(clearTimeout(this._retryTimer),this._retryTimer=null)}setConfig(t){let a=["command_center","personal","maintenance","admin"];if(!t.mode)throw new Error("Family Hub: 'mode' is required");if(!a.includes(t.mode))throw new Error(`Family Hub: mode must be one of ${a.join(", ")}`);if(t.mode==="personal"&&!t.person)throw new Error("Family Hub: 'person' is required for personal mode");if(t.initial_view&&!/^(person|room):[A-Za-z0-9_-]+$/.test(t.initial_view))throw new Error("Family Hub: 'initial_view' must be 'person:<id>' or 'room:<id>'");this._cfg=t,t.mode==="command_center"&&t.initial_view&&!this._initialViewApplied&&(this._view=t.initial_view,this._backStack=["home"],this._initialViewApplied=!0),this._doRender(!0)}set hass(t){this._hass=t,this._maybeRender(),this._scheduleRetryIfNeeded()}_scheduleRetryIfNeeded(){if(this._retryTimer||this._model)return;let t=0,a=()=>{this._retryTimer=null,!(!this._hass||this._model)&&(t++,this._maybeRender(),!this._model&&t<15&&(this._retryTimer=setTimeout(a,2e3)))};this._retryTimer=setTimeout(a,2e3)}getCardSize(){return 5}_maybeRender(){var a,o;if(!this._hass||this._modal||this._adminSelectedChoreId||this._adminSelectedItemId||this._editingSubId||this._mealsAdminRecipeId)return;let t=(o=(a=this._hass.states["sensor.family_hub_needs_attention"])==null?void 0:a.attributes)==null?void 0:o.data_rev;t!==void 0&&(this._model!==null&&t===this._lastDataRev||this._fetchModel(t))}async _fetchModel(t){if(this._pendingRev=t,!this._fetching){this._fetching=!0;try{for(;this._lastDataRev!==this._pendingRev;){let a=this._pendingRev,o;try{o=await this._hass.connection.sendMessagePromise({type:"family_hub/get_model"})}catch(s){console.error("Family Hub: get_model failed",s);return}this._model=o,this._lastDataRev=a}}finally{this._fetching=!1}this._modal||this._adminSelectedChoreId||this._adminSelectedItemId||this._editingSubId||this._mealsAdminRecipeId||this._doRender(!1)}}_doRender(t=!1){if(!(!this._hass&&!t))try{let a=parseFloat(this._cfg.text_scale)||1,o=document.createElement("style");o.textContent=Mt+`:host { --fh-text-scale: ${a}; }`;let s=document.createElement("div");if(s.className="fh-card",!this._hass||!this._model)s.innerHTML='<div class="fh-empty">Loading\u2026</div>';else switch(["today","family","tasks","rewards","meals","history","settings"].includes(this._adminSec)||(this._adminSec="today"),this._cfg.mode){case"command_center":s.innerHTML=this._htmlCommandCenter();break;case"personal":s.innerHTML=oa(this);break;case"maintenance":s.innerHTML=Dt(this);break;case"admin":s.innerHTML=Us(this);break}if(this.shadowRoot.innerHTML="",this.shadowRoot.appendChild(o),this.shadowRoot.appendChild(s),this._modal&&this.shadowRoot.appendChild(this._buildModal()),this._celebration){let i=document.createElement("div");i.innerHTML=ms(this._celebration),this.shadowRoot.appendChild(i.firstElementChild)}this._syncModalUI()}catch(a){console.error("[family-hub] render error:",a);let o=document.createElement("style");o.textContent=Mt;let s=document.createElement("div");s.className="fh-card",s.innerHTML='<div class="fh-empty">Loading\u2026</div>',this.shadowRoot.innerHTML="",this.shadowRoot.appendChild(o),this.shadowRoot.appendChild(s),setTimeout(()=>{this._hass&&(this._lastDataRev=void 0,this._maybeRender())},3e3)}}_htmlCommandCenter(){let t=this._view||"home";if(t==="home")return va(this);let a="";if(t.startsWith("room:")){let o=t.slice(5),s=zs(o),i=this._attrs("sensor.family_hub_needs_attention").modules;i&&i[o]===!1?a=`<div class="fh-empty">This module is turned off.<br>
                    <span style="opacity:.7">Enable it in Home Assistant \u2192 Family Hub \u2192 Configure.</span></div>`:a=s!=null&&s.render?s.render(this):'<div class="fh-empty">Unknown room.</div>'}else if(t.startsWith("person:")){let o=t.slice(7);this._viewPersonId=o;let s=this._findPerson(o),i=tt((s==null?void 0:s.theme_key)||"classic");if(a=oa(this),this._viewPersonId=null,i.handlesNavigation)return a}else return this._view="home",va(this);return to("Home")+a}_states(t){var a,o;return(o=(a=this._hass)==null?void 0:a.states)==null?void 0:o[t]}_attrs(t){var a;return this._model&&this._model[t]||((a=this._states(t))==null?void 0:a.attributes)||{}}_people(){return this._attrs("sensor.family_hub_needs_attention").people||[]}_findPerson(t){let a=(t||"").toLowerCase();return this._people().find(o=>o.name.toLowerCase()===a||o.person_id===t)||null}_personEntityId(t){return`sensor.family_hub_${La(t)}`}_svc(t,a){if(this._hass)try{let o=this._hass.callService(Pa,t,a);o&&typeof o.catch=="function"&&o.catch(s=>{var n,r;console.error(`[family-hub] service ${t} failed:`,s,"payload:",a);let i=((n=s==null?void 0:s.body)==null?void 0:n.message)||((r=s==null?void 0:s.error)==null?void 0:r.message)||(s==null?void 0:s.message)||(s==null?void 0:s.error)||"";if(!i||typeof i!="string")try{i=JSON.stringify(s)}catch{i=String(s)}i.length>600&&(i=i.slice(0,600)+"\u2026"),alert(`Family Hub service "${t}" failed:

${i}

(See browser console for full details.)`)})}catch(o){console.error("[family-hub] callService threw:",o),alert(`Family Hub: service call "${t}" crashed before sending.

${(o==null?void 0:o.message)||o}`)}}_buildModal(){var a;let t=document.createElement("div");return t.className="fh-modal-bg"+(((a=this._modal)==null?void 0:a.surface)==="drawer"?" fh-modal-bg--drawer":""),t.innerHTML=this._modalHTML(),t.addEventListener("click",o=>{o.target===t&&this._closeModal()}),t}_modalHTML(){if(!this._modal)return"";let{type:t,data:a}=this._modal,o=this._people(),s=this._attrs("sensor.family_hub_needs_attention").category_labels||[],i=this._attrs("sensor.family_hub_needs_attention").active_chores||[];switch(t){case"award":case"deduct":return As(this._modal);case"partial-credit":return Ms(this._modal);case"add-chore":return ga(null,!1,o,s,this._choreFormTab);case"edit-chore":return ga(a.chore,!0,o,s,this._choreFormTab);case"add-store-item":return Bs(o,s);case"edit-store-item":return Fs(a.item,o,s);case"add-person":return Rs();case"edit-person":return Ds(a);case"edit-settings":return Ls(a);case"ranks":return ba(this);case"claim":return Os(this._modal,o);case"add-reminder":return Ns(this._modal,o);case"confirm-remove-person":return Is(a);case"confirm-hard-delete-person":return Ts(a);case"edit-streaks":{let n=this._people().find(d=>d.person_id===a.pid),r=(n==null?void 0:n.streaks)||{};return Ps(a.pid,a.pname,i,r)}case"chip-in":return Hs(a.item,a.pid,a.balance,a.remaining);default:return""}}_closeModal(){this._modal=null,this._choreFormTab="details",this._doRender(!0)}_syncModalUI(){let t=this.shadowRoot,a=z=>{let E=t.getElementById(z);E&&(E.style.display="")},o=z=>{let E=t.getElementById(z);E&&(E.style.display="none")},s=t.getElementById("m-crec");if(s){let z=s.value,E=t.getElementById("m-ctype"),F=(E==null?void 0:E.value)||"assigned";o("m-dayfilter-section"),o("m-weekdays-section"),o("m-dom-section"),o("m-chore-expiry-section"),z==="daily"&&a("m-dayfilter-section"),z==="weekly"&&a("m-weekdays-section"),z==="monthly_on_date"&&a("m-dom-section"),F==="claimable"&&a("m-chore-expiry-section")}let i=t.getElementById("m-ctype"),n=t.getElementById("m-claimable-section"),r=t.getElementById("m-multi-claim-section"),d=t.getElementById("m-csubtype");if(i&&n){let z=i.value==="claimable";if(n.style.display=z?"":"none",r){let E=z&&(d==null?void 0:d.value)==="multi_claim";r.style.display=E?"":"none"}}let p=t.getElementById("m-cpenalty"),c=t.getElementById("m-penalty-pts-section"),b=t.getElementById("m-daily-threshold-section");p&&c&&(c.style.display=p.checked?"":"none",b&&(b.style.display=p.checked?"":"none"));let g=t.getElementById("m-sscope"),u=t.getElementById("m-sperson-section");g&&u&&(u.style.display=g.value==="personal"?"":"none");let v=t.getElementById("m-sgroup"),_=t.getElementById("m-sgroup-section");v&&_&&(_.style.display=v.checked?"":"none",v.checked&&u&&(u.style.display="none"));let f=t.getElementById("m-rotation-section"),$=t.getElementById("m-rotation-config"),S=t.getElementById("m-crot-enabled"),x=t.getElementById("m-ctype");f&&(f.style.display=(x==null?void 0:x.value)==="assigned"?"":"none"),$&&S&&($.style.display=S.checked?"":"none");let h=t.getElementById("m-crot-cadence"),w=t.getElementById("m-crot-switch-day-wrap");h&&w&&(w.style.display=h.value==="weekly"?"":"none")}}});var Qt,ho=N(()=>{K();Q();Qt=class extends HTMLElement{setConfig(t){this._cfg=t,this._render()}set hass(t){var a,o,s;this._hass=t,this._people=((s=(o=(a=t==null?void 0:t.states)==null?void 0:a["sensor.family_hub_needs_attention"])==null?void 0:o.attributes)==null?void 0:s.people)||[],this._render()}_render(){var v,_,f,$,S,x,h,w,z;let t=this._cfg||{},a=this._people||[],o=t.mode||"command_center",s=t.person||"",i=t.initial_view||"",n=t.text_scale!=null?t.text_scale:1,d=(((f=(_=(v=this._hass)==null?void 0:v.states)==null?void 0:_["sensor.family_hub_needs_attention"])==null?void 0:f.attributes)||{}).rooms_config||{},p=[["","Home (default)"],...a.map(E=>[`person:${E.person_id}`,`${E.name}'s page`]),...Object.keys(d).map(E=>[`room:${E}`,`Room: ${E}`])],b=!!((S=($=this._hass)==null?void 0:$.states)==null?void 0:S["sensor.family_hub_needs_attention"]),g=`<span style="
            display:inline-block;width:8px;height:8px;border-radius:50%;
            background:${b?"#30d158":"#ff453a"};
            margin-right:5px;vertical-align:middle;"></span>`,u=b?`${g}Integration connected (v${lt})`:`${g}Integration not found \u2014 install Family Hub`;this.innerHTML=`
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
        <div class="fhe-status">${u}</div>

        <div class="fhe-field">
          <label class="fhe-label">Mode</label>
          <select class="fhe-select" id="e-mode">
            ${[["command_center","Command Center (kitchen display)"],["personal","Personal Dashboard"],["maintenance","Maintenance"],["admin","Admin Panel"]].map(([E,F])=>`<option value="${E}" ${E===o?"selected":""}>${F}</option>`).join("")}
          </select>
        </div>

        <div class="fhe-field" id="person-field"
             style="display:${o==="personal"?"flex":"none"}">
          <label class="fhe-label">Person</label>
          ${a.length?`<select class="fhe-select" id="e-person">
                   ${a.map(E=>`<option value="${E.name.toLowerCase()}"
                                ${E.name.toLowerCase()===s?"selected":""}>${m(E.name)}</option>`).join("")}
                 </select>`:`<input class="fhe-input" id="e-person" type="text"
                        value="${s}" placeholder="e.g. jackson">`}
          <span class="fhe-hint">Enter the person's name (lowercase)</span>
        </div>

        <div class="fhe-field" id="initial-view-field"
             style="display:${o==="command_center"?"flex":"none"}">
          <label class="fhe-label">Initial view</label>
          <select class="fhe-select" id="e-initial-view">
            ${p.map(([E,F])=>`<option value="${E}" ${E===i?"selected":""}>${m(F)}</option>`).join("")}
          </select>
          <span class="fhe-hint">Open this view directly. Back arrow returns to home.</span>
        </div>

        <div class="fhe-field">
          <label class="fhe-label">Text scale</label>
          <select class="fhe-select" id="e-scale">
            ${[[.9,"Small (0.9)"],[1,"Default (1.0)"],[1.25,"Large (1.25)"],[1.5,"XL (1.5)"]].map(([E,F])=>`<option value="${E}" ${parseFloat(n)===E?"selected":""}>${F}</option>`).join("")}
          </select>
          <span class="fhe-hint">Increase for Echo Show / tablet screens.</span>
        </div>
      </div>`,(x=this.querySelector("#e-mode"))==null||x.addEventListener("change",E=>{this._cfg={...this._cfg,mode:E.target.value},E.target.value!=="personal"&&delete this._cfg.person,E.target.value!=="command_center"&&delete this._cfg.initial_view,this._fireChange(),this._render()}),(h=this.querySelector("#e-initial-view"))==null||h.addEventListener("change",E=>{let F=E.target.value;this._cfg={...this._cfg},F?this._cfg.initial_view=F:delete this._cfg.initial_view,this._fireChange()}),(w=this.querySelector("#e-person"))==null||w.addEventListener("change",E=>{this._cfg={...this._cfg,person:E.target.value},this._fireChange()}),(z=this.querySelector("#e-scale"))==null||z.addEventListener("change",E=>{this._cfg={...this._cfg,text_scale:parseFloat(E.target.value)},this._fireChange()})}_fireChange(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._cfg},bubbles:!0,composed:!0}))}}});var Kn=go(()=>{po();ho();K();customElements.get("family-hub-card-impl")||customElements.define("family-hub-card-impl",Xt);customElements.get("family-hub-card-editor-impl")||customElements.define("family-hub-card-editor-impl",Qt);console.info(`%c FAMILY-HUB-CARD %c v${lt} %c body loaded `,"background:#7F77DD;color:#fff;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px","background:#1c1c1e;color:#fff;font-weight:400;padding:2px 6px","background:#58D38A;color:#000;font-weight:600;border-radius:0 4px 4px 0;padding:2px 6px")});export default Kn();

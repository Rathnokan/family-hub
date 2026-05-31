export const CSS_4 = `    text-shadow:2px 2px 0 rgba(255,255,255,.3), 4px 4px 0 rgba(15,30,46,.25);
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
  /* DBZ body two-column layout â€” left mission grid + right comic-card rail */
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
  /* DBZ â€” mission row chrome moved to shared .fh-row--dbz (S9).
     Port the icon energy-aura to the new selector. */
  .fh-row--dbz .fh-row-icon::before {
    content:''; position:absolute; inset:-4px; border-radius:50%;
    background:radial-gradient(circle, rgba(255,224,58,.35) 0%, transparent 70%);
    pointer-events:none;
  }
  /* GO button â€” comic-book styled (slimmed for row layout) */
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
  /* Child mode overrides â€” replaced by unified kid-mode renderer */

  /* ===========================================================================
     Admin Shell (v0.6.0 S7)
     Persistent sidebar â‰¥1100px Â· bottom tab-bar below that
     AD color tokens kept as inline vars â€” shadow DOM scope is fine.
  =========================================================================== */

  /* ---- Layout switch driven by VIEWPORT, not container â€” works in HA sectioned dashboards too ---- */
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

  /* ---- Sidebar (hidden until viewport â‰¥1100px) ---- */
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

  /* ---- Bottom nav (mobile â€” shown below 1100px viewport) ---- */
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
    border-radius: 10px; overflow: hidden;
  }
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

  /* ---- Settings grid — 2 panels: config (left) + hub layout (right) ---- */
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

  /* ---- Tasks section: 1-col on mobile, 2-col grid at ≥1280px (S9 P3 item 5) ---- */
  .fh-ad-tasks-wrap {
    display: flex; flex-direction: column; gap: 14px; min-width: 0;
  }
  @media (min-width: 1280px) {
    .fh-ad-tasks-wrap {
      display: grid; grid-template-columns: 1fr 480px;
      gap: 16px; align-items: start;
    }
  }

  /* ---- Inline editor side panel — reuses .fh-ad-panel chrome ---------
     Matches list panel exactly: same bg, border, radius, header padding.
     Sticky within the scrolling .fh-ad-body so the editor follows the list
     down the page: selecting a chore near the bottom shows the editor in
     view at the top of the viewport instead of forcing a scroll back up.
     Header/footer stay pinned; the form body scrolls internally when tall. */
  .fh-ad-tasks-panel { display: none; }
  @media (min-width: 1280px) {
    .fh-ad-tasks-panel {
      display: flex; flex-direction: column;
      width: 480px; flex-shrink: 0;
      background: #1A2538;
      border: 1px solid #2A3852;
      border-radius: 12px;
      overflow: hidden;
      position: sticky; top: 0;
      max-height: calc(92vh - 96px);
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

  /* ---- Rewards section — same grid/panel structure as Tasks ---- */
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
  /* Inactive store rows — desaturated, italic name */
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

  /* ---- History section — chore history left + reward history right rail ---- */
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

  /* ---- Hide mobile-only edit + delete buttons at ≥1280px (row click opens the
         inline panel, which has its own Save in the header + Delete in the footer).
         Below 1280px these stay so the modal-based flow keeps edit/delete. ---- */
  @media (min-width: 1280px) {
    .fh-ad-tasks-edit-btn,
    .fh-ad-tasks-del-btn { display: none !important; }
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
  /* Inline panel form chrome — dark-theme overrides for shared form widgets */
  .fh-ad-tasks-panel-body .fh-checkbox-row { color: #A6B3CC; }
  .fh-ad-tasks-panel-body .fh-field-help { color: #6F7E9C; }
  .fh-ad-tasks-panel-body .fh-person-cb-chip { border-color: #3A4B6B; color: #A6B3CC; }
  .fh-ad-tasks-panel-body .fh-wd-chip { border-color: #3A4B6B; color: #6F7E9C; }
  .fh-ad-tasks-panel-body .fh-wd-chip.checked { color: #ECEFF6; }

  /* ===========================================================================
     Classic theme â€” body two-column rail (S8)
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
     Kid-large modifier (S9 â€” now driven by .kid-large .fh-row-* in the shared
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

  /* Lead element (P1 etc.) â€” omitted entirely when leadFormat is absent */
`;

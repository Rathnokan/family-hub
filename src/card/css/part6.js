// Meals room CSS — fh-ml-* and fh-tdy-* classes (v0.8.0; readability+layout pass v0.8.1)
// Ported from the Claude Design prototype (meals-proto.css), then made to conform to
// the project standards: every font-size uses the --fh-text-* scale tokens (calc(rem *
// var(--fh-text-scale))) defined in part1.js — NOTHING below the 12px floor (--fh-text-xs)
// — secondary text uses a contrast-safe ink, and content pages reflow responsively
// (viewport @media, not container queries) for the Echo Show (Panel) down to narrow columns.
// Reuses: fh-bk-* Baker chrome already in part3.js.
//
// Glyphs (emoji) use calc(<rem> * var(--fh-text-scale,1)) so they scale with the text-size
// config too. Secondary label ink: #6E4423 (~7:1 on cream). Empty/placeholder ink:
// rgba(58,31,18,.6) (readable, still clearly "muted").
export const CSS_6 = `

  /* ================================================================
     MEALS ROOM — shared primitives
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

  /* Food-group icon (colorblind-safe — distinguished by glyph shape, not hue).
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

  /* ✕ icon button */
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

  /* Meal card (grid tile — drawer, library, pantry matches) */
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
     Self-contained — lifts onto the HA home page with these rules only.
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

  /* Meal / side / protein grid — reflows by width */
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

  /* Day-pick modal (pantry → pick a night) — reflows by width */
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
     RESPONSIVE — viewport @media (NOT container queries; the card column
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
`;

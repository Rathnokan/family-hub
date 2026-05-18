/**
 * Family Hub Card — Admin Mode (v0.6.0 S7 refresh)
 *
 * Shell: persistent left sidebar on wide cards (≥1100px), bottom tab-bar on narrow.
 * Five sections: Today (unified queue + activity), Family, Tasks, History, Settings.
 *
 * IMPORTANT: All modal-triggering data-* attributes are identical to prior builds.
 * Only the shell layout and section grouping have changed.
 */

import { DEFAULT_COLOR, HISTORY_META } from "./constants.js";
import { I } from "./constants.js";
import { escHTML, escAttr, ini, fPts, fUSD, cap, relTime, groupHistorySkipped } from "./utils.js";
import { ROOMS } from "./rooms/index.js";
import { choreFormFields } from "./modals.js";

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

export function htmlAdmin(card) {
    const attr        = card._attrs("sensor.family_hub_needs_attention");
    const people      = attr.people           || [];
    const approvals   = attr.approval_queue   || [];
    const redemptions = attr.redemption_queue || [];
    const chores      = attr.active_chores    || [];
    const catLabels   = attr.category_labels  || [];
    const famName     = attr.family_name      || "Family Hub";
    const storeItems  = attr.store_items      || [];
    const actionCount = approvals.length + redemptions.length;

    const sections = [
        { id: "today",    label: "Today",    icon: "◐", badge: actionCount },
        { id: "family",   label: "Family",   icon: "◍", badge: 0 },
        { id: "tasks",    label: "Tasks",    icon: "◉", badge: 0 },
        { id: "history",  label: "History",  icon: "◑", badge: 0 },
        { id: "settings", label: "Settings", icon: "◎", badge: 0 },
    ];

    const sec = card._adminSec;

    let body = "";
    switch (sec) {
        case "today":    body = _htmlAdToday(approvals, redemptions, attr);         break;
        case "family":   body = _htmlAdFamily(people, attr);                        break;
        case "tasks":    body = _htmlAdTasks(chores, people, catLabels, card);      break;
        case "history":  body = _htmlAdHistory(attr, card);                         break;
        case "settings": body = _htmlAdSettings(attr, storeItems, people);          break;
        default:         body = _htmlAdToday(approvals, redemptions, attr);
    }

    const TB = {
        today:    { crumb: "OVERVIEW",      title: "Today",
                    actions: `<button class="fh-ad-btn fh-ad-btn--ghost" data-act="export-backup">Export backup</button>
                              <button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${I.plus} Add chore</button>` },
        family:   { crumb: "PEOPLE",        title: "Family",
                    actions: `<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-person">${I.person} Add person</button>` },
        tasks:    { crumb: "CHORES",        title: "Tasks",
                    actions: `<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${I.plus} Add chore</button>` },
        history:  { crumb: "ACTIVITY",      title: "History",  actions: "" },
        settings: { crumb: "CONFIGURATION", title: "Settings",
                    actions: `<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-store-item">${I.plus} Add reward</button>` },
    };
    const tb = TB[sec] || TB.today;

    const sidebarItems = sections.map(s => `
      <div class="fh-ad-nav-item ${sec === s.id ? "active" : ""}"
           data-act="admin-sec" data-sec="${s.id}">
        <span class="fh-ad-nav-icon">${s.icon}</span>
        <span class="fh-ad-nav-label">${s.label}</span>
        ${s.badge > 0 ? `<span class="fh-ad-nav-badge">${s.badge}</span>` : ""}
      </div>`).join("");

    const bottomItems = sections.map(s => `
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
              <div class="fh-ad-brand-sub">v0.6.0 · ADMIN</div>
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

// ---------------------------------------------------------------------------
// Today — unified action queue + stat strip + recent activity
// ---------------------------------------------------------------------------

function _htmlAdToday(approvals, redemptions, attr) {
    const people     = attr.people          || [];
    const chores     = attr.active_chores   || [];
    const historyLog = attr.history_log     || [];

    // Stat strip
    const stats = [
        { label: "APPROVAL QUEUE",   value: approvals.length,   accent: approvals.length   > 0 ? "#F5C24A" : "#58D38A" },
        { label: "REDEEM QUEUE",     value: redemptions.length, accent: redemptions.length > 0 ? "#E36DA4" : "#58D38A" },
        { label: "ACTIVE CHORES",    value: chores.length,      accent: "#5B8DEF" },
        { label: "FAMILY",           value: people.length,      accent: "#A6B3CC" },
    ];
    const statCards = stats.map(s => `
      <div class="fh-ad-stat">
        <div class="fh-ad-stat-val" style="color:${s.accent}">${s.value}</div>
        <div class="fh-ad-stat-lbl">${s.label}</div>
      </div>`).join("");

    // Unified queue rows
    const queue = [
        ...approvals.map(a  => ({ ...a,  kind: "approval"   })),
        ...redemptions.map(r => ({ ...r, kind: "redemption" })),
    ];
    const queueRows = queue.length > 0
        ? queue.map(q => {
            const color    = q.person_color || DEFAULT_COLOR;
            const isAppr   = q.kind === "approval";
            const name     = isAppr ? (q.chore_name  || "") : (q.item_name || "");
            const pts      = isAppr ? q.chore_points        :  q.points_cost;
            const actOk    = isAppr ? "approve-task"        : "approve-redemption";
            const actNo    = isAppr ? "deny-task"           : "decline-redemption";
            const itemAttr = isAppr ? `data-tid="${q.task_id}"` : `data-rid="${q.redemption_id}"`;
            const pill     = isAppr
                ? `<span class="fh-ad-pill fh-ad-pill--amber">CHORE</span>`
                : `<span class="fh-ad-pill fh-ad-pill--rose">REWARD</span>`;
            return `
              <div class="fh-ad-queue-row">
                <div class="fh-avatar" style="background:${color};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${ini(q.person_name)}</div>
                <div class="fh-ad-queue-info">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                    ${pill}
                    <span class="fh-ad-queue-time">${q.when || ""}</span>
                  </div>
                  <div class="fh-ad-queue-name">${escHTML(name)}</div>
                  <div class="fh-ad-queue-meta">${escHTML(q.person_name || "")} · ${isAppr ? "+" : "−"}${fPts(pts)}</div>
                </div>
                <button class="fh-btn fh-btn-success fh-btn-sm" data-act="${actOk}" ${itemAttr}>${I.check}</button>
                <button class="fh-btn fh-btn-danger  fh-btn-sm" data-act="${actNo}"  ${itemAttr}>${I.close}</button>
              </div>`;
        }).join("")
        : `<div class="fh-empty fh-ad-empty">Nothing needs your attention right now. ✓</div>`;

    // Recent activity — last 48 h, max 15 entries
    const cutoff = Date.now() - 172800000;
    const recent = historyLog.filter(e => new Date(e.timestamp).getTime() > cutoff).slice(0, 15);
    const activityRows = recent.length > 0
        ? recent.map(e => {
            const meta    = HISTORY_META[e.type] || { label: e.type, color: "#6F7E9C" };
            const color   = e.person_color || DEFAULT_COLOR;
            const pts     = e.points_delta;
            const ptColor = pts > 0 ? "#58D38A" : (pts < 0 ? "#E8553E" : "#6F7E9C");
            const ptBadge = pts
                ? `<span style="font-family:'JetBrains Mono',monospace;font-size:var(--fh-text-xs);font-weight:700;color:${ptColor};flex-shrink:0">${pts > 0 ? "+" : ""}${pts}pts</span>`
                : "";
            return `
              <div class="fh-ad-activity-row">
                <div class="fh-avatar" style="background:${color};width:28px;height:28px;font-size:var(--fh-text-xs);flex-shrink:0">${e.person_name ? ini(e.person_name) : "—"}</div>
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
        }).join("")
        : `<div class="fh-empty fh-ad-empty">No recent activity.</div>`;

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

// ---------------------------------------------------------------------------
// Family — person cards + global controls
// ---------------------------------------------------------------------------

function _htmlAdFamily(people, attr) {
    const ppdollar    = attr.points_per_dollar      || 10;
    const globalPause = attr.penalties_paused_global || false;

    const cards = people.map(p => {
        const color     = p.avatar_color || DEFAULT_COLOR;
        const penPaused = p.penalties_paused || false;
        const isKid     = p.type === "kid";

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
                  ${fPts(p.points_balance)}pts · ${fUSD(p.points_balance / ppdollar)} · lifetime ${fPts(p.points_lifetime)}${
                    p.allowance_points > 0
                      ? ` · ${p.allowance_points}pts/${p.allowance_schedule === "monthly" ? "mo" : p.allowance_schedule === "biweekly" ? "2wk" : "wk"} allowance`
                      : ""
                  }
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
                        data-prankidx="${p.rank_index !== undefined ? p.rank_index : 0}"
                        data-pdropThr="${p.rank_drop_threshold !== null && p.rank_drop_threshold !== undefined ? p.rank_drop_threshold : ""}"
                        data-pgainThr="${p.rank_gain_threshold !== null && p.rank_gain_threshold !== undefined ? p.rank_gain_threshold : ""}"
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
                        data-pid="${p.person_id}" data-pname="${escAttr(p.name)}">🔥 Streaks</button>
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
                ${globalPause
                    ? "⏸ Paused globally — skips won&#39;t break streaks or deduct points"
                    : "Applying normally at the daily tick"}
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

// ---------------------------------------------------------------------------
// Tasks — sortable + collapsible chore table + 480px inline editor at ≥1280px
// ---------------------------------------------------------------------------

function _htmlAdTasks(chores, people, catLabels, card) {
    card._sortedChores = chores;

    const filterChips = `
      <div class="fh-chips">
        <div class="fh-chip ${!card._choreFilter ? "active" : ""}"
             data-act="chore-filter" data-cpid="">All</div>
        ${people.map(p => `
          <div class="fh-chip ${card._choreFilter === p.person_id ? "active" : ""}"
               style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
               data-act="chore-filter" data-cpid="${p.person_id}">
            <span class="fh-chip-dot"></span>${escHTML(p.name)}
          </div>`).join("")}
      </div>`;

    // Filter by person
    const visible = card._choreFilter
        ? chores.filter(c => (c.assigned_to || []).includes(card._choreFilter))
        : chores;

    // Sort
    const sort = card._adminSort || { col: null, dir: "asc" };
    let sorted = [...visible];
    if (sort.col) {
        sorted.sort((a, b) => {
            let va, vb;
            switch (sort.col) {
                case "name": va = a.name.toLowerCase();      vb = b.name.toLowerCase();      break;
                case "pts":  va = a.points;                  vb = b.points;                  break;
                case "cat":  va = a.category_label || "";    vb = b.category_label || "";     break;
                case "asgn": {
                    va = (a.assigned_to || []).map(id => people.find(p => p.person_id === id)?.name || "").sort().join(",");
                    vb = (b.assigned_to || []).map(id => people.find(p => p.person_id === id)?.name || "").sort().join(",");
                    break;
                }
                default: va = vb = "";
            }
            if (va < vb) return sort.dir === "asc" ? -1 :  1;
            if (va > vb) return sort.dir === "asc" ?  1 : -1;
            return 0;
        });
    }

    // Sort bar
    const sortCols = [
        { col: "name", label: "Name" },
        { col: "pts",  label: "Pts"  },
        { col: "cat",  label: "Category" },
        { col: "asgn", label: "Assignees" },
    ];
    const sortBar = `
      <div class="fh-ad-sort-bar">
        <span class="fh-ad-sort-lbl">Sort:</span>
        ${sortCols.map(({ col, label }) => {
            const isActive = sort.col === col;
            const arrow    = isActive ? (sort.dir === "asc" ? " ↑" : " ↓") : "";
            return `<button class="fh-ad-sort-btn${isActive ? " active" : ""}"
                            data-act="sort-admin-chores" data-col="${col}">${label}${arrow}</button>`;
        }).join("")}
        ${sort.col ? `<button class="fh-ad-sort-btn" data-act="sort-admin-chores" data-col="">✕ Clear</button>` : ""}
      </div>`;

    // Group into collapsible category groups
    const groups = new Map();
    for (const c of sorted) {
        const key = c.category_label || "Uncategorized";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(c);
    }

    const selectedId    = card._adminSelectedChoreId || null;
    const collapsedCats = card._adminCollapsedCats || new Set();

    let content = "";
    if (!sorted.length) {
        content = `<div class="fh-empty fh-ad-empty">${card._choreFilter ? "No chores assigned to this person." : "No active chores. Add one above."}</div>`;
    } else {
        content = [...groups.entries()].map(([label, list]) => {
            const collapsed = collapsedCats.has(label);
            const rows = collapsed ? "" : list.map(c => _htmlChoreTableRow(c, people, card, selectedId)).join("");
            return `
              <div class="fh-ad-cat-group">
                <div class="fh-ad-cat-hdr" data-act="toggle-admin-cat" data-cat="${escAttr(label)}">
                  <span class="fh-ad-cat-chevron${collapsed ? " collapsed" : ""}">▼</span>
                  <span class="fh-ad-cat-name">${escHTML(label)}</span>
                  <span class="fh-ad-cat-count">${list.length}</span>
                </div>
                ${collapsed ? "" : `<div class="fh-task-list">${rows}</div>`}
              </div>`;
        }).join("");
    }

    // Inline editor panel — only rendered when a chore is selected
    // (never simultaneously with a chore modal — see open-add/edit-chore in dispatch.js)
    const selectedChore = selectedId ? chores.find(c => c.chore_id === selectedId) : null;
    const panelHtml     = _htmlChoreEditorPanel(selectedChore, people, catLabels, card);

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

/**
 * Render a single chore row inside the sortable/collapsible table.
 * Clicking the row body (data-act="select-chore-row") opens the inline panel at ≥1280px.
 * The edit button (fh-ad-tasks-edit-btn) is CSS-hidden at ≥1280px.
 * The delete button remains at all sizes.
 */
function _htmlChoreTableRow(c, people, card, selectedId) {
    const assignedPeople = (c.assigned_to || [])
        .map(id => people.find(p => p.person_id === id))
        .filter(Boolean);
    const avatarHtml = assignedPeople.length
        ? `<div class="fh-avatars">${assignedPeople.map(p =>
            `<div class="fh-avatar" style="background:${p.avatar_color || DEFAULT_COLOR};width:26px;height:26px;font-size:var(--fh-text-xs)">${ini(p.name)}</div>`
          ).join("")}</div>`
        : "";
    const descExp    = card._expandedDescs.has(c.chore_id);
    const rowColor   = assignedPeople[0]?.avatar_color || DEFAULT_COLOR;
    const recType    = c.recurrence?.type || "daily";
    const recLabel   = {
        daily:           "Daily",
        weekly:          "Weekly",
        every_n_days:    `Every ${c.recurrence?.interval || 2}d`,
        every_n_weeks:   `Every ${c.recurrence?.interval || 2}wk`,
        monthly_on_date: "Monthly",
        one_time:        "One-time",
    }[recType] || recType;
    const expiryLabel = c.expires_after_days
        ? `<span class="fh-badge fh-badge-expiry" style="margin-left:4px">Expires in ${c.expires_after_days}d</span>`
        : "";
    const isSelected = c.chore_id === selectedId;

    return `
      <div class="fh-task-row${isSelected ? " fh-task-row--selected" : ""}"
           style="--row-color:${rowColor}"
           draggable="true" data-drag-id="${c.chore_id}"
           data-act="select-chore-row" data-cid="${c.chore_id}">
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
        <button class="fh-btn fh-btn-ghost fh-btn-sm fh-ad-tasks-edit-btn"
                data-act="open-edit-chore" data-cid="${c.chore_id}"
                title="Edit chore">${I.edit}</button>
        <button class="fh-btn fh-btn-danger fh-btn-sm"
                data-act="delete-chore"
                data-cid="${c.chore_id}" data-cname="${escAttr(c.name)}"
                title="Delete chore">${I.trash}</button>
      </div>`;
}

/**
 * Inline editor side panel for the Tasks section (≥1280px only, CSS-hidden on mobile).
 * Shows chore form fields when a chore is selected; placeholder when none selected.
 * Uses the same m-* element IDs as the chore modal — never simultaneously in the DOM.
 */
function _htmlChoreEditorPanel(chore, people, catLabels, card) {
    const tab = (card && card._choreFormTab) || "details";
    const inner = chore
        ? `
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1;min-width:0">
              <div class="fh-ad-tasks-panel-title">Edit chore</div>
              <div class="fh-ad-tasks-panel-sub" title="${escAttr(chore.name)}">${escHTML(chore.name)}</div>
            </div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="close-chore-panel"
                    style="flex-shrink:0" title="Close panel">✕</button>
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
          </div>`
        : `
          <div class="fh-ad-tasks-panel-empty">
            <div class="fh-ad-tasks-panel-empty-icon">↖</div>
            <div class="fh-ad-tasks-panel-empty-text">Select a chore to edit</div>
          </div>`;

    return `<div class="fh-ad-tasks-panel">${inner}</div>`;
}

// ---------------------------------------------------------------------------
// History — person filter + full 30-day log
// ---------------------------------------------------------------------------

function _htmlAdHistory(attr, card) {
    const historyLog  = attr.history_log || [];
    const people      = attr.people      || [];
    const firstParent = people.find(p => p.type === "parent");

    const filterChips = `
      <div class="fh-chips" style="margin-bottom:var(--fh-gap-sm)">
        <div class="fh-chip ${!card._histFilter ? "active" : ""}"
             data-act="hist-filter" data-hpid="">All</div>
        ${people.map(p => `
          <div class="fh-chip ${card._histFilter === p.person_id ? "active" : ""}"
               style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
               data-act="hist-filter" data-hpid="${p.person_id}">
            <span class="fh-chip-dot"></span>${escHTML(p.name)}
          </div>`).join("")}
      </div>`;

    const filtered = card._histFilter
        ? historyLog.filter(e => e.person_id === card._histFilter)
        : historyLog;

    const grouped  = groupHistorySkipped(filtered);
    const histRows = grouped.map(item => {
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

// ---------------------------------------------------------------------------
// Settings — hub config + store inventory (2-column on wide)
// ---------------------------------------------------------------------------

function _htmlAdSettings(attr, storeItems, people) {
    const famName          = attr.family_name               || "Family Hub";
    const ppdollar         = attr.points_per_dollar         || 10;
    const showDollar       = attr.show_dollar_value_to_kids || false;
    const catLabels        = attr.category_labels           || [];
    const penaltyAlertTime = attr.penalty_alert_time !== undefined ? attr.penalty_alert_time : 800;
    const rankEvalWeekday  = attr.rank_eval_weekday         !== undefined ? attr.rank_eval_weekday : 0;
    const rankDropThr      = attr.rank_drop_threshold       !== undefined ? attr.rank_drop_threshold : 50;
    const rankGainThr      = attr.rank_gain_threshold       !== undefined ? attr.rank_gain_threshold : 75;
    const roomsCfg         = attr.rooms_config              || {};
    const weatherEntity    = attr.weather_entity            || "";
    const calendarEntities = attr.today_calendar_entities   || [];
    const WEEKDAY_NAMES    = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    const labelChips = catLabels.map(l => `
      <div class="fh-cat-chip">
        <span>${escHTML(l)}</span>
        <button class="fh-cat-chip-del" data-act="remove-cat-label"
                data-label="${escAttr(l)}" title="Remove">×</button>
      </div>`).join("");

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
                    data-act="open-edit-store-item" data-iid="${item.item_id}"
                    title="Edit reward">${I.edit}</button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="delete-store-item"
                    data-iid="${item.item_id}" data-iname="${escAttr(item.name)}"
                    title="Delete reward">${I.trash}</button>
          </div>`;
    }).join("") || `<div class="fh-empty fh-ad-empty">No store items yet.</div>`;

    // ---- Hub Layout panel content (S9 P3) -------------------------------
    const roomToggles = ROOMS.map(room => {
        const status  = roomsCfg[room.id]?.status ?? room.status;
        const visible = status !== "hidden";
        const isComingSoon = room.status === "coming";
        return `
          <div class="fh-hub-room-row" data-room-id="${escAttr(room.id)}">
            <div class="fh-hub-room-icon" style="color:${room.accent}">${room.icon}</div>
            <div class="fh-hub-room-info">
              <div class="fh-hub-room-name">${escHTML(room.label)}</div>
              <div class="fh-hub-room-sub">${escHTML(room.sub)}${isComingSoon ? ` · <em>coming soon</em>` : ""}</div>
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
                  Every ${WEEKDAY_NAMES[rankEvalWeekday]} · Drop &lt;${rankDropThr}pts · Gain ≥${rankGainThr}pts
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
                       placeholder="New label…" style="flex:1">
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

// ---------------------------------------------------------------------------
// History row renderers (unchanged from prior builds)
// ---------------------------------------------------------------------------

function _renderAdminHistRow(e, firstParent) {
    const meta     = HISTORY_META[e.type] || { label: e.type, color: "var(--fh-text-sec)" };
    const color    = e.person_color || DEFAULT_COLOR;
    const ptsDelta = e.points_delta
        ? `<span style="color:${e.points_delta > 0 ? "var(--fh-success)" : "var(--fh-overdue)"}">
             ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>`
        : "";

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
}

function _renderAdminSkippedGroup(group, firstParent, card) {
    const expanded = card._expandedSkippedDates.has(group.key);
    const penLabel = group.totalPenalty > 0 ? `−${group.totalPenalty}pts` : "no penalty";

    const subItems = expanded ? group.items.map(e => {
        const color = e.person_color || DEFAULT_COLOR;
        const pts   = e.points_delta
            ? `<span style="color:var(--fh-overdue);font-weight:700">${e.points_delta}pts</span>`
            : "";
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
              ${e.person_name ? ini(e.person_name) : "—"}
            </div>
            <div class="fh-hist-info" style="flex:1;min-width:0">
              <div class="fh-hist-name">${escHTML(e.person_name ? e.person_name + " — " : "") + escHTML(e.chore_name || "")}</div>
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
            <div class="fh-hist-name">${escHTML(group.dateDisplay)} · ${penLabel}</div>
          </div>
          <span class="fh-hist-expand-icon">${expanded ? "▲" : "▼"}</span>
        </div>
        ${expanded ? `<div class="fh-hist-subitems">${subItems}</div>` : ""}
      </div>`;
}

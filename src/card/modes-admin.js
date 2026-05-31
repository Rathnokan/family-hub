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
import { choreFormFields, storeItemFormFields } from "./modals.js";
import { choreIcon } from "./icons.js";

// Format a chore instance due_date ("YYYY-MM-DD") as a short local-day label
// (e.g. "Thu, May 29"). Parsed from explicit parts to avoid UTC date shift.
function _fmtDueDay(iso) {
    if (!iso) return "";
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return iso;
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

// Collapse a chore's recurrence type into one of the four admin filter buckets.
// "every N days" rolls up under Daily; "every N weeks" under Weekly.
function _recBucket(c) {
    switch (c.recurrence?.type) {
        case "daily":
        case "every_n_days":    return "daily";
        case "weekly":
        case "every_n_weeks":   return "weekly";
        case "monthly_on_date": return "monthly";
        case "one_time":        return "one_time";
        default:                return "other";
    }
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

export function htmlAdmin(card) {
    const attr        = card._attrs("sensor.family_hub_needs_attention");
    const people      = attr.people           || [];
    const approvals       = attr.approval_queue            || [];
    const redemptions     = attr.redemption_queue          || [];
    const groupProposals  = attr.group_proposal_queue      || [];
    const cancelSubs      = attr.subscription_cancel_queue || [];
    const chores          = attr.active_chores        || [];
    const allChores       = attr.all_chores           || chores;
    const catLabels       = attr.category_labels      || [];
    const famName         = attr.family_name          || "Family Hub";
    const storeItems      = attr.store_items          || [];
    const actionCount     = approvals.length + redemptions.length + groupProposals.length + cancelSubs.length;

    const sections = [
        { id: "today",    label: "Today",    icon: "◐", badge: actionCount },
        { id: "family",   label: "Family",   icon: "◍", badge: 0 },
        { id: "tasks",    label: "Chores",   icon: "◉", badge: 0 },
        { id: "rewards",  label: "Rewards",  icon: "◈", badge: 0 },
        { id: "history",  label: "History",  icon: "◑", badge: 0 },
        { id: "settings", label: "Settings", icon: "◎", badge: 0 },
    ];

    const sec = card._adminSec;

    let body = "";
    switch (sec) {
        case "today":    body = _htmlAdToday(approvals, redemptions, groupProposals, cancelSubs, attr); break;
        case "family":   body = _htmlAdFamily(people, attr, card);                     break;
        case "tasks":    body = _htmlAdTasks(allChores, people, catLabels, card);      break;
        case "rewards":  body = _htmlAdRewards(storeItems, people, catLabels, card);  break;
        case "history":  body = _htmlAdHistory(attr, card);                           break;
        case "settings": body = _htmlAdSettings(attr, people, card);                  break;
        default:         body = _htmlAdToday(approvals, redemptions, groupProposals, [], attr);
    }

    const TB = {
        today:    { crumb: "OVERVIEW",      title: "Today",
                    actions: `<button class="fh-ad-btn fh-ad-btn--ghost" data-act="export-backup">Export backup</button>
                              <button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${I.plus} Add chore</button>` },
        family:   { crumb: "PEOPLE",        title: "Family",
                    actions: `<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-person">${I.person} Add person</button>` },
        tasks:    { crumb: "CHORES",        title: "Chores",
                    actions: `<button class="fh-ad-btn fh-ad-btn--ghost" data-act="print-chore-list" title="Open a printable chore list in a new tab">${I.print} Print</button>
                              <button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-chore">${I.plus} Add chore</button>` },
        rewards:  { crumb: "REWARDS",       title: "Rewards",
                    actions: `<button class="fh-ad-btn fh-ad-btn--primary" data-act="open-add-store-item">${I.plus} Add reward</button>` },
        history:  { crumb: "ACTIVITY",      title: "History",  actions: "" },
        settings: { crumb: "CONFIGURATION", title: "Settings", actions: "" },
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

function _htmlAdToday(approvals, redemptions, groupProposals, cancelSubs, attr) {
    const people     = attr.people          || [];
    const chores     = attr.active_chores   || [];
    const historyLog = attr.history_log     || [];

    // Detect fully-funded group rewards (all contributors at target)
    const allStoreItems   = attr.store_items || [];
    const fundedGroupItems = allStoreItems.filter(i => {
        if (!i.is_group_reward || !i.active) return false;
        const contribs = i.contributors || [];
        return contribs.length > 0 && contribs.every(c => (c.contributed_pts || 0) >= (c.target_pts || 0));
    });

    // Stat strip
    const stats = [
        { label: "APPROVAL QUEUE",   value: approvals.length,                                accent: approvals.length   > 0 ? "#F5C24A" : "#58D38A" },
        { label: "REDEEM QUEUE",     value: redemptions.length,                              accent: redemptions.length > 0 ? "#E36DA4" : "#58D38A" },
        { label: "GROUP PROPOSALS",  value: groupProposals.length + fundedGroupItems.length, accent: (groupProposals.length + fundedGroupItems.length) > 0 ? "#58D38A" : "#A6B3CC" },
        { label: "ACTIVE CHORES",    value: chores.filter(c => c.active !== false).length,    accent: "#5B8DEF" },
    ];
    const statCards = stats.map(s => `
      <div class="fh-ad-stat">
        <div class="fh-ad-stat-val" style="color:${s.accent}">${s.value}</div>
        <div class="fh-ad-stat-lbl">${s.label}</div>
      </div>`).join("");

    // Unified queue rows
    const queue = [
        ...approvals.map(a  => ({ ...a,  kind: "approval"       })),
        ...redemptions.map(r => ({ ...r, kind: "redemption"     })),
        ...groupProposals.map(p => ({ ...p, kind: "group-proposal" })),
        ...fundedGroupItems.map(i => ({ ...i, kind: "group-funded" })),
        // v0.6.5: subscription cancel requests
        ...cancelSubs.map(s => ({ ...s, kind: "cancel-sub" })),
    ];
    const queueRows = queue.length > 0
        ? queue.map(q => {
            if (q.kind === "group-proposal") {
                const color       = q.proposer_color || DEFAULT_COLOR;
                const inviteNames = (q.invitees || []).map(i => i.person_name || "?").join(", ");
                return `
                  <div class="fh-ad-queue-row">
                    <div class="fh-avatar" style="background:${color};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${ini(q.proposer_name)}</div>
                    <div class="fh-ad-queue-info">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#4CAF7D">GROUP</span>
                      </div>
                      <div class="fh-ad-queue-name">${escHTML(q.item_name || "")}</div>
                      <div class="fh-ad-queue-meta">${escHTML(q.proposer_name)} + ${escHTML(inviteNames)}</div>
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="approve-group-proposal"
                            data-propid="${escAttr(q.proposal_id)}"
                            data-by="admin">${I.check}</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="decline-group-proposal-parent"
                            data-propid="${escAttr(q.proposal_id)}"
                            data-by="admin">${I.close}</button>
                  </div>`;
            }
            if (q.kind === "group-funded") {
                const totalPts = (q.contributors || []).reduce((s, c) => s + (c.contributed_pts || 0), 0);
                const names    = (q.contributors || []).map(c => c.person_name || "?").join(", ");
                return `
                  <div class="fh-ad-queue-row">
                    <div style="width:32px;height:32px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem">🤝</div>
                    <div class="fh-ad-queue-info">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#4CAF7D">FUNDED</span>
                      </div>
                      <div class="fh-ad-queue-name">${escHTML(q.name || "")}</div>
                      <div class="fh-ad-queue-meta">${escHTML(names)} · ${fPts(totalPts)} pts pooled</div>
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="redeem-group-reward"
                            data-iid="${escAttr(q.item_id)}"
                            data-iname="${escAttr(q.name || "")}">Redeem</button>
                  </div>`;
            }
            // v0.6.5: subscription cancellation request
            if (q.kind === "cancel-sub") {
                const color = q.person_color || DEFAULT_COLOR;
                const periodLabel = (q.period || "").replace("_", " ");
                return `
                  <div class="fh-ad-queue-row">
                    <div class="fh-avatar" style="background:${color};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${ini(q.person_name || "?")}</div>
                    <div class="fh-ad-queue-info">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#9B59B6">CANCEL</span>
                        <span class="fh-ad-queue-time">${relTime(q.cancellation_requested_at || "")}</span>
                      </div>
                      <div class="fh-ad-queue-name">${escHTML(q.item_name || "")}</div>
                      <div class="fh-ad-queue-meta">${escHTML(q.person_name || "")} · ${escHTML(periodLabel)} subscription</div>
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="approve-cancel-subscription"
                            data-subid="${escAttr(q.subscription_id || q.id || "")}">${I.check}</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="decline-cancel-subscription"
                            data-subid="${escAttr(q.subscription_id || q.id || "")}">${I.close}</button>
                  </div>`;
            }
            const color    = q.person_color || DEFAULT_COLOR;
            const isAppr   = q.kind === "approval";
            const name     = isAppr ? (q.chore_name  || "") : (q.item_name || "");
            const pts      = isAppr ? q.chore_points        :  q.points_cost;
            const pill     = isAppr
                ? `<span class="fh-ad-pill fh-ad-pill--amber">CHORE</span>`
                : `<span class="fh-ad-pill fh-ad-pill--rose">REWARD</span>`;

            // v0.6.5: detect if this redemption is for a subscription item
            const allStoreItemsFlat = attr.store_items || [];
            const redeemedItem = !isAppr
                ? allStoreItemsFlat.find(i => i.item_id === q.item_id)
                : null;
            const isSubRedemption = !isAppr && redeemedItem?.item_type === "subscription";

            if (isSubRedemption) {
                const subPeriod = redeemedItem.subscription_period || "monthly";
                const rid       = escAttr(q.redemption_id);
                const WDAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
                const anchorPicker = subPeriod === "daily" ? "" :
                    subPeriod === "weekly"
                    ? `<div style="display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap">
                         <span style="font-size:.78rem;color:var(--fh-text-sec)">Renews on:</span>
                         <select id="m-sub-wday-${rid}" class="fh-select" style="width:auto">
                           ${WDAY_NAMES.map((d, i) => `<option value="${i}">${d}</option>`).join("")}
                         </select>
                       </div>`
                    : `<div style="display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap">
                         <span style="font-size:.78rem;color:var(--fh-text-sec)">Renews day of month:</span>
                         <input type="number" id="m-sub-dom-${rid}" class="fh-input"
                                min="1" max="31" value="1" style="width:64px">
                       </div>`;
                return `
                  <div class="fh-ad-queue-row" style="flex-wrap:wrap;row-gap:4px">
                    <div class="fh-avatar" style="background:${color};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${ini(q.person_name)}</div>
                    <div class="fh-ad-queue-info" style="flex:1;min-width:0">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                        <span class="fh-ad-pill" style="background:#9B59B6">SUBSCRIBE</span>
                        <span class="fh-ad-queue-time">${q.when || ""}</span>
                      </div>
                      <div class="fh-ad-queue-name">${escHTML(q.item_name || "")}</div>
                      <div class="fh-ad-queue-meta">${escHTML(q.person_name || "")} · ${escHTML(subPeriod)} · −${fPts(pts)}pts</div>
                      ${anchorPicker}
                    </div>
                    <button class="fh-btn fh-btn-success fh-btn-sm"
                            data-act="approve-subscription-redemption"
                            data-rid="${rid}"
                            data-period="${escAttr(subPeriod)}">${I.check}</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="decline-redemption"
                            data-rid="${rid}">${I.close}</button>
                  </div>`;
            }

            return `
              <div class="fh-ad-queue-row">
                <div class="fh-avatar" style="background:${color};width:32px;height:32px;font-size:.75rem;flex-shrink:0">${ini(q.person_name)}</div>
                <div class="fh-ad-queue-info">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                    ${pill}
                    <span class="fh-ad-queue-time">${q.when || ""}</span>
                  </div>
                  <div class="fh-ad-queue-name">${escHTML(name)}</div>
                  <div class="fh-ad-queue-meta">${escHTML(q.person_name || "")} · ${isAppr ? "+" : "−"}${fPts(pts)}${isAppr && q.due_date ? ` · for ${escHTML(_fmtDueDay(q.due_date))}` : ""}</div>
                </div>
                <button class="fh-btn fh-btn-success fh-btn-sm" data-act="${isAppr ? "approve-task" : "approve-redemption"}" data-${isAppr ? "tid" : "rid"}="${isAppr ? q.task_id : q.redemption_id}">${I.check}</button>
                <button class="fh-btn fh-btn-danger  fh-btn-sm" data-act="${isAppr ? "deny-task" : "decline-redemption"}" data-${isAppr ? "tid" : "rid"}="${isAppr ? q.task_id : q.redemption_id}">${I.close}</button>
              </div>`;
        }).join("")
        : `<div class="fh-empty fh-ad-empty">Nothing needs your attention right now. ✓</div>`;

    // Recent activity — last 48 h.
    // task_skipped entries are rolled up into per-person-per-day summary rows
    // to avoid flooding the panel when penalties run at the daily tick.
    const cutoff = Date.now() - 172800000;
    const recent = historyLog.filter(e => new Date(e.timestamp).getTime() > cutoff);

    const skipSummaries = new Map();  // "pid:date" → { personName, color, date, totalPts, count, timestamp }
    const otherEntries  = [];

    for (const e of recent) {
        if (e.type === "task_skipped") {
            const dateKey = e.skipped_date || (e.timestamp || "").slice(0, 10) || "";
            const key = `${e.person_id}:${dateKey}`;
            if (!skipSummaries.has(key)) {
                skipSummaries.set(key, {
                    personName: e.person_name || "",
                    color:      e.person_color || DEFAULT_COLOR,
                    date:       dateKey,
                    totalPts:   0,
                    count:      0,
                    timestamp:  e.timestamp || "",
                });
            }
            const g = skipSummaries.get(key);
            g.totalPts += Math.abs(e.points_delta || 0);
            g.count++;
            if ((e.timestamp || "") > g.timestamp) g.timestamp = e.timestamp;
        } else {
            otherEntries.push(e);
        }
    }

    const activityItems = [
        ...otherEntries.map(e => ({ kind: "entry", e })),
        ...[...skipSummaries.values()].map(g => ({ kind: "skip", g })),
    ].sort((a, b) => {
        const ta = a.kind === "entry" ? (a.e.timestamp || "") : (a.g.timestamp || "");
        const tb = b.kind === "entry" ? (b.e.timestamp || "") : (b.g.timestamp || "");
        return tb.localeCompare(ta);
    }).slice(0, 15);

    const activityRows = activityItems.length > 0
        ? activityItems.map(item => {
            if (item.kind === "skip") {
                const { personName, color, date, totalPts, count } = item.g;
                return `
                  <div class="fh-ad-activity-row">
                    <div class="fh-avatar" style="background:${color};width:28px;height:28px;font-size:var(--fh-text-xs);flex-shrink:0">${personName ? ini(personName) : "—"}</div>
                    <div style="flex:1;min-width:0">
                      <div class="fh-ad-activity-name">
                        <span style="font-weight:700">${escHTML(personName)}</span>
                        missed ${count} task${count !== 1 ? "s" : ""}
                      </div>
                      <div class="fh-ad-activity-meta" style="color:var(--fh-warning)">Skipped · ${escHTML(date)}</div>
                    </div>
                    ${totalPts > 0
                        ? `<span style="font-family:'JetBrains Mono',monospace;font-size:var(--fh-text-xs);font-weight:700;color:var(--fh-overdue);flex-shrink:0">−${totalPts}pts</span>`
                        : ""}
                  </div>`;
            }
            const e = item.e;
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

function _htmlAdFamily(people, attr, card) {
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
                        data-pdrop-thr="${p.rank_drop_threshold !== null && p.rank_drop_threshold !== undefined ? p.rank_drop_threshold : ""}"
                        data-pgain-thr="${p.rank_gain_threshold !== null && p.rank_gain_threshold !== undefined ? p.rank_gain_threshold : ""}"
                        data-pchildmode="${p.child_mode === true}"
                        data-pcompletionthreshold="${p.completion_threshold_pct ?? 80}"
                        data-pcompletionmilestone="${p.completion_milestone ?? 7}"
                        data-pcompletionbonus="${p.completion_bonus_points ?? 50}"
                        title="Edit person">${I.edit}</button>
                <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-confirm-remove-person"
                        data-pid="${p.person_id}" data-pname="${escAttr(p.name)}"
                        title="Remove person">${I.remove}</button>
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

    // v0.6.5: active subscriptions rail
    const allSubs      = attr.all_subscriptions || [];
    const editingSubId = card._editingSubId || null;
    const subsByPerson = new Map();
    for (const sub of allSubs) {
        if (!subsByPerson.has(sub.person_id)) subsByPerson.set(sub.person_id, []);
        subsByPerson.get(sub.person_id).push(sub);
    }

    const PERIOD_SHORT = { daily: "Daily", weekly: "Weekly", monthly: "Monthly", quarterly: "Quarterly", biannual: "Biannual", annual: "Annual" };
    const PERIOD_OPTS  = [
        { v: "weekly",    l: "Weekly"    },
        { v: "monthly",   l: "Monthly"   },
        { v: "quarterly", l: "Quarterly" },
        { v: "biannual",  l: "Biannual"  },
        { v: "annual",    l: "Annual"    },
    ];
    const STATUS_LABEL = { active: "Active", lapsed: "Lapsed", cancel_pending: "Cancel pending" };
    const STATUS_COLOR = { active: "var(--fh-success)", lapsed: "var(--fh-overdue)", cancel_pending: "var(--fh-warning)" };

    const subRailRows = allSubs.length === 0
        ? `<div class="fh-empty fh-ad-empty">No active subscriptions.</div>`
        : [...subsByPerson.entries()].map(([pid, subs]) => {
            const pColor = subs[0].person_color || DEFAULT_COLOR;
            const pName  = subs[0].person_name  || "Unknown";
            const subRows = subs.map(sub => {
                const sid         = sub.subscription_id;
                const isEditing   = sid === editingSubId;
                const statusColor = STATUS_COLOR[sub.status] || "var(--fh-text-sec)";
                const statusLabel = STATUS_LABEL[sub.status] || sub.status;
                const periodShort = PERIOD_SHORT[sub.period] || sub.period;
                const debtLine    = sub.accumulated_debt > 0
                    ? `<span style="color:var(--fh-overdue);font-size:.75rem"> · owes ${fPts(sub.accumulated_debt)}pts</span>`
                    : "";
                const costDisplay = sub.dollar_cost_override != null
                    ? `${fUSD(sub.effective_dollar)} (override) · ${fPts(sub.effective_cost)}pts`
                    : `${fUSD(sub.effective_dollar)} · ${fPts(sub.effective_cost)}pts`;

                if (isEditing) {
                    const periodSelOpts = PERIOD_OPTS.map(o =>
                        `<option value="${o.v}"${sub.period === o.v ? " selected" : ""}>${o.l}</option>`
                    ).join("");
                    return `
                      <div style="padding:10px 0;border-bottom:1px solid var(--fh-border)">
                        <div style="font-size:.88rem;font-weight:600;margin-bottom:8px">${escHTML(sub.item_name)}</div>
                        <div style="display:grid;grid-template-columns:90px 1fr;gap:5px 10px;align-items:center;margin-bottom:8px">
                          <label style="font-size:.75rem;color:var(--fh-text-sec)">Period</label>
                          <select id="sub-edit-period-${escAttr(sid)}" class="fh-input" style="height:28px;font-size:.8rem;padding:0 6px">
                            ${periodSelOpts}
                          </select>
                          <label style="font-size:.75rem;color:var(--fh-text-sec)">Cost override $</label>
                          <input id="sub-edit-cost-${escAttr(sid)}"
                                 type="number" min="0" step="0.01"
                                 value="${sub.dollar_cost_override ?? ""}"
                                 placeholder="${fUSD(sub.item_dollar_value)}"
                                 class="fh-input" style="height:28px;font-size:.8rem;padding:0 6px">
                          <label style="font-size:.75rem;color:var(--fh-text-sec)">Next renewal</label>
                          <input id="sub-edit-date-${escAttr(sid)}"
                                 type="date"
                                 value="${escAttr(sub.next_renewal_date || "")}"
                                 class="fh-input" style="height:28px;font-size:.8rem;padding:0 6px">
                        </div>
                        <div style="font-size:.7rem;color:var(--fh-text-sec);margin-bottom:8px">
                          Leave cost blank to use item default (${fUSD(sub.item_dollar_value)})
                        </div>
                        <div style="display:flex;gap:6px">
                          <button class="fh-btn fh-btn-success fh-btn-sm"
                                  data-act="admin-update-subscription"
                                  data-subid="${escAttr(sid)}"
                                  title="Save changes">✓ Save</button>
                          <button class="fh-btn fh-btn-ghost fh-btn-sm"
                                  data-act="admin-edit-subscription-cancel"
                                  title="Discard">✗ Cancel</button>
                        </div>
                      </div>`;
                }

                return `
                  <div class="fh-point-row" style="gap:8px;padding:8px 0;border-bottom:1px solid var(--fh-border)">
                    <div style="flex:1;min-width:0">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
                        <span style="font-size:.88rem;font-weight:600">${escHTML(sub.item_name)}</span>
                        <span style="font-size:.7rem;font-weight:700;color:${statusColor}">${escHTML(statusLabel)}</span>
                      </div>
                      <div style="font-size:.75rem;color:var(--fh-text-sec)">
                        ${escHTML(periodShort)} · ${costDisplay}${debtLine}
                      </div>
                      <div style="font-size:.72rem;color:var(--fh-text-sec);margin-top:1px">
                        Renews ${escHTML(sub.next_renewal_date || "—")}
                      </div>
                    </div>
                    <button class="fh-btn fh-btn-ghost fh-btn-sm"
                            data-act="admin-edit-subscription-open"
                            data-subid="${escAttr(sid)}"
                            title="Edit period / cost">✎</button>
                    <button class="fh-btn fh-btn-danger fh-btn-sm"
                            data-act="admin-cancel-subscription"
                            data-subid="${escAttr(sid)}"
                            data-sname="${escAttr(sub.item_name)}"
                            title="Cancel subscription">✕</button>
                  </div>`;
            }).join("");
            return `
              <div style="margin-bottom:12px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                  <div class="fh-avatar" style="background:${pColor};width:26px;height:26px;font-size:.7rem;flex-shrink:0">${ini(pName)}</div>
                  <span style="font-size:.9rem;font-weight:600">${escHTML(pName)}</span>
                </div>
                ${subRows}
              </div>`;
        }).join("");

    // Inactive (deactivated) members — reactivate or permanently delete.
    const inactivePeople = attr.inactive_people || [];
    const inactivePanel  = inactivePeople.length === 0 ? "" : `
      <div class="fh-ad-panel" style="margin-top:4px">
        <div class="fh-ad-panel-hdr">
          <span class="fh-ad-panel-title">Inactive members</span>
          <span class="fh-ad-panel-sub">${inactivePeople.length} deactivated</span>
        </div>
        <div class="fh-ad-panel-body">
          <div style="font-size:var(--fh-text-sm);color:var(--fh-text-sec);margin-bottom:10px">
            Deactivated people are hidden from dashboards but kept so their history stays intact
            (e.g. a kid away at camp). Reactivate to bring them back, or permanently delete to purge
            them and all their data.
          </div>
          ${inactivePeople.map(p => `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--fh-border)">
              <div class="fh-avatar" style="background:${p.avatar_color || DEFAULT_COLOR};width:30px;height:30px;font-size:.85rem;flex-shrink:0">${ini(p.name)}</div>
              <div style="flex:1;min-width:0">
                <span style="font-weight:600;font-size:var(--fh-text-base)">${escHTML(p.name)}</span>
                <span style="font-size:var(--fh-text-xs);color:var(--fh-text-sec)"> · ${cap(p.type)} · lifetime ${fPts(p.points_lifetime)}</span>
              </div>
              <button class="fh-btn fh-btn-success fh-btn-sm" data-act="reactivate-person"
                      data-pid="${p.person_id}" data-pname="${escAttr(p.name)}"
                      title="Reactivate ${escAttr(p.name)}">↺ Reactivate</button>
              <button class="fh-btn fh-btn-danger fh-btn-sm" data-act="open-confirm-hard-delete-person"
                      data-pid="${p.person_id}" data-pname="${escAttr(p.name)}"
                      title="Permanently delete ${escAttr(p.name)}">${I.trash}</button>
            </div>
          `).join("")}
        </div>
      </div>`;

    return `
      <div style="display:flex;gap:16px;align-items:flex-start">

        <div style="flex:1;min-width:0">
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
          </div>
          ${inactivePanel}
        </div>

        <div class="fh-ad-tasks-panel" style="flex-shrink:0">
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1">
              <div class="fh-ad-tasks-panel-title">Active Subscriptions</div>
              <div class="fh-ad-tasks-panel-sub">${allSubs.length} across family</div>
            </div>
          </div>
          <div class="fh-ad-tasks-panel-body" style="overflow-y:auto">
            ${subRailRows}
          </div>
        </div>

      </div>`;
}

// ---------------------------------------------------------------------------
// Tasks — sortable + collapsible chore table + 480px inline editor at ≥1280px
// ---------------------------------------------------------------------------

function _htmlAdTasks(chores, people, catLabels, card) {
    card._sortedChores = chores;

    const statusFilter = card._choreStatusFilter || "";
    const recFilter    = card._choreRecFilter    || "";
    const personFilter = card._choreFilter        || "";

    const statusOpts = [
        { val: "",         label: "All"      },
        { val: "active",   label: "Active"   },
        { val: "inactive", label: "Inactive" },
    ];
    const recOpts = [
        { val: "",         label: "All types" },
        { val: "daily",    label: "Daily"     },
        { val: "weekly",   label: "Weekly"    },
        { val: "monthly",  label: "Monthly"   },
        { val: "one_time", label: "One-Time"  },
    ];
    const personOpts = [
        { val: "", label: "Everyone" },
        ...people.map(p => ({ val: p.person_id, label: p.name })),
    ];

    // Compact dropdown filter bar (one wrapping row) instead of three chip rows.
    const filterSelect = (act, opts, cur) => `
      <select class="fh-select fh-ad-filter-select" data-act="${act}">
        ${opts.map(o => `<option value="${escAttr(o.val)}" ${String(cur) === String(o.val) ? "selected" : ""}>${escHTML(o.label)}</option>`).join("")}
      </select>`;

    const filterChips = `
      <div class="fh-ad-filter-bar">
        <label class="fh-ad-filter-lbl">Status ${filterSelect("chore-status-filter", statusOpts, statusFilter)}</label>
        <label class="fh-ad-filter-lbl">Type ${filterSelect("chore-rec-filter", recOpts, recFilter)}</label>
        <label class="fh-ad-filter-lbl">Assignee ${filterSelect("chore-filter", personOpts, personFilter)}</label>
      </div>`;

    // Filter by active/inactive status
    let visible = chores;
    if (statusFilter === "active")   visible = chores.filter(c => c.active !== false);
    if (statusFilter === "inactive") visible = chores.filter(c => c.active === false);

    // Then filter by recurrence bucket
    if (recFilter) {
        visible = visible.filter(c => _recBucket(c) === recFilter);
    }

    // Then filter by person
    if (card._choreFilter) {
        visible = visible.filter(c => (c.assigned_to || []).includes(card._choreFilter));
    }

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

    // Group into collapsible category groups.
    //
    // v0.6.3 P2 fix: seed the map in the admin-defined `catLabels` order so
    // the section order here matches the order the parent set on the Settings
    // page (the Settings drag-reorder updates `category_labels`). Categories
    // present on chores but missing from `catLabels` (legacy / orphaned) are
    // appended at the end so they're still reachable. Empty admin-defined
    // categories are dropped so we don't render headers for unused buckets.
    const groups = new Map();
    for (const lbl of catLabels) {
        groups.set(lbl, []);
    }
    for (const c of sorted) {
        const key = c.category_label || "Uncategorized";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(c);
    }
    for (const [k, v] of [...groups.entries()]) {
        if (!v.length) groups.delete(k);
    }

    const selectedId    = card._adminSelectedChoreId || null;
    const collapsedCats = card._adminCollapsedCats || new Set();

    const activeCount   = chores.filter(c => c.active !== false).length;
    const inactiveCount = chores.filter(c => c.active === false).length;
    const choreSummary  = inactiveCount
        ? `${activeCount} active · ${inactiveCount} inactive`
        : `${activeCount} total`;

    const anyFilterActive = card._choreFilter || recFilter || statusFilter;

    let content = "";
    if (!sorted.length) {
        content = `<div class="fh-empty fh-ad-empty">${
            anyFilterActive ? "No chores match this filter." :
            "No active chores. Add one above."
        }</div>`;
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
            <span class="fh-ad-panel-sub">${choreSummary}</span>
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
 * The edit + delete buttons (fh-ad-tasks-edit-btn / fh-ad-tasks-del-btn) are CSS-hidden
 * at ≥1280px — the inline panel provides Save (header) and Delete (footer) there.
 * Below 1280px both buttons stay for the modal-based edit/delete flow.
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
    // At-a-glance streak settings, shown under the awarded-points badge.
    // streak_milestone = bonus fires every N completions; streak_bonus_points = the reward.
    const sMilestone = c.streak_milestone || 0;
    const sBonus     = c.streak_bonus_points || 0;
    const streakLine = (sMilestone > 0 && sBonus > 0)
        ? `<span class="fh-task-streak" title="Bonus: +${sBonus}pts every ${sMilestone} completions">🔥 ${sMilestone} → +${sBonus}</span>`
        : `<span class="fh-task-streak fh-task-streak--off" title="No streak bonus set">no streak</span>`;
    const isSelected = c.chore_id === selectedId;

    return `
      <div class="fh-task-row${isSelected ? " fh-task-row--selected" : ""}"
           style="--row-color:${rowColor}"
           draggable="true" data-drag-id="${c.chore_id}"
           data-act="select-chore-row" data-cid="${c.chore_id}">
        <span class="fh-drag-handle" title="Drag to reorder">⠿</span>
        ${avatarHtml}
        <div class="fh-task-body">
          <span class="fh-task-name">${escHTML(c.name)}${c.active === false
              ? ` <span style="font-size:.72rem;color:#6F7E9C;font-weight:400">[inactive]</span>`
              : ""}</span>
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
        <div class="fh-task-pts-col">
          <span class="fh-badge fh-badge-pts" style="--row-color:${rowColor}">${c.points}pts</span>
          ${streakLine}
        </div>
        <button class="fh-btn fh-btn-ghost fh-btn-sm fh-ad-tasks-edit-btn"
                data-act="open-edit-chore" data-cid="${c.chore_id}"
                title="Edit chore">${I.edit}</button>
        <button class="fh-btn fh-btn-danger fh-btn-sm fh-ad-tasks-del-btn"
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
            <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="ok-edit-chore-inline"
                    style="flex-shrink:0">Save</button>
            <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="close-chore-panel"
                    style="flex-shrink:0" title="Close panel">✕</button>
          </div>
          <div class="fh-ad-tasks-panel-body">
            ${choreFormFields(chore, true, people, catLabels, tab)}
          </div>
          <div class="fh-ad-tasks-panel-footer">
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
// Rewards — master-detail: item list (left) + inline editor panel (right)
// ---------------------------------------------------------------------------

function _htmlAdRewards(storeItems, people, catLabels, card) {
    card._sortedStoreItems = storeItems;

    const filterChips = `
      <div class="fh-chips">
        <div class="fh-chip ${!card._storeItemFilter ? "active" : ""}"
             data-act="store-item-filter" data-fval="">All</div>
        <div class="fh-chip ${card._storeItemFilter === "active" ? "active" : ""}"
             data-act="store-item-filter" data-fval="active">Active</div>
        <div class="fh-chip ${card._storeItemFilter === "inactive" ? "active" : ""}"
             data-act="store-item-filter" data-fval="inactive">Inactive</div>
      </div>`;

    // Filter
    let visible = storeItems;
    if (card._storeItemFilter === "active")   visible = storeItems.filter(i => i.active !== false);
    if (card._storeItemFilter === "inactive") visible = storeItems.filter(i => i.active === false);

    // Sort
    const sort = card._adminSortItems || { col: null, dir: "asc" };
    let sorted = [...visible];
    if (sort.col) {
        sorted.sort((a, b) => {
            let va, vb;
            switch (sort.col) {
                case "name":  va = a.name.toLowerCase();          vb = b.name.toLowerCase();          break;
                case "pts":   va = a.points_cost;                 vb = b.points_cost;                 break;
                case "cat":   va = a.category_label || "";        vb = b.category_label || "";         break;
                case "scope": va = a.scope || "";                 vb = b.scope || "";                 break;
                default: va = vb = "";
            }
            if (va < vb) return sort.dir === "asc" ? -1 :  1;
            if (va > vb) return sort.dir === "asc" ?  1 : -1;
            return 0;
        });
    }

    const sortCols = [
        { col: "name",  label: "Name"     },
        { col: "pts",   label: "Pts"      },
        { col: "cat",   label: "Category" },
        { col: "scope", label: "Scope"    },
    ];
    const sortBar = `
      <div class="fh-ad-sort-bar">
        <span class="fh-ad-sort-lbl">Sort:</span>
        ${sortCols.map(({ col, label }) => {
            const isActive = sort.col === col;
            const arrow    = isActive ? (sort.dir === "asc" ? " ↑" : " ↓") : "";
            return `<button class="fh-ad-sort-btn${isActive ? " active" : ""}"
                            data-act="sort-admin-store-items" data-col="${col}">${label}${arrow}</button>`;
        }).join("")}
        ${sort.col ? `<button class="fh-ad-sort-btn" data-act="sort-admin-store-items" data-col="">✕ Clear</button>` : ""}
      </div>`;

    // Group by category (same logic as chores — seed from catLabels order)
    const groups = new Map();
    for (const lbl of catLabels) groups.set(lbl, []);
    for (const item of sorted) {
        const key = item.category_label || "Uncategorized";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
    }
    for (const [k, v] of [...groups.entries()]) {
        if (!v.length) groups.delete(k);
    }

    const selectedId        = card._adminSelectedItemId || null;
    const collapsedCats     = card._adminCollapsedRewardCats || new Set();

    let content = "";
    if (!sorted.length) {
        content = `<div class="fh-empty fh-ad-empty">${card._storeItemFilter ? "No rewards match this filter." : "No rewards yet. Add one above."}</div>`;
    } else {
        content = [...groups.entries()].map(([label, list]) => {
            const collapsed = collapsedCats.has(label);
            const rows = collapsed ? "" : list.map(i => _htmlStoreItemTableRow(i, people, card, selectedId)).join("");
            return `
              <div class="fh-ad-cat-group">
                <div class="fh-ad-cat-hdr" data-act="toggle-admin-reward-cat" data-cat="${escAttr(label)}">
                  <span class="fh-ad-cat-chevron${collapsed ? " collapsed" : ""}">▼</span>
                  <span class="fh-ad-cat-name">${escHTML(label)}</span>
                  <span class="fh-ad-cat-count">${list.length}</span>
                </div>
                ${collapsed ? "" : `<div class="fh-task-list">${rows}</div>`}
              </div>`;
        }).join("");
    }

    const selectedItem = selectedId ? storeItems.find(i => i.item_id === selectedId) : null;
    const panelHtml    = _htmlStoreItemEditorPanel(selectedItem, people, catLabels, card);

    return `
      <div class="fh-ad-rewards-wrap">

        <div class="fh-ad-panel fh-ad-rewards-list-panel">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Reward catalog</span>
            <span class="fh-ad-panel-sub">${storeItems.filter(i => i.active !== false).length} active</span>
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

function _htmlStoreItemTableRow(item, people, card, selectedId) {
    const personNames = (item.person_ids || [])
        .map(id => people.find(p => p.person_id === id)?.name)
        .filter(Boolean)
        .join(", ");
    const isSelected = item.item_id === selectedId;
    const isInactive = item.active === false;
    const rateMeta   = item.max_per_period > 0
        ? `<span class="fh-badge fh-badge-expiry" style="margin-left:4px">Max ${item.max_per_period}/${item.period}</span>`
        : "";

    return `
      <div class="fh-task-row${isSelected ? " fh-task-row--selected" : ""}${isInactive ? " fh-store-row--inactive" : ""}"
           draggable="true" data-drag-id="${item.item_id}"
           data-drag-type="store-item"
           data-act="select-store-row" data-iid="${item.item_id}">
        <span class="fh-drag-handle" title="Drag to reorder">⠿</span>
        ${item.icon ? `<span style="width:24px;height:24px;flex-shrink:0">${choreIcon(item.icon, null, "24px")}</span>` : ""}
        <div class="fh-task-body">
          <span class="fh-task-name">${escHTML(item.name)}${isInactive ? ` <span style="font-size:.72rem;color:#6F7E9C;font-weight:400">[inactive]</span>` : ""}</span>
          <span class="fh-task-sub">
            ${fUSD(item.dollar_value)} ·
            ${item.scope === "personal"
                ? `Personal${personNames ? ` (${escHTML(personNames)})` : ""}`
                : "All kids"}
          </span>
        </div>
        ${rateMeta}
        <span class="fh-badge fh-badge-pts">${fPts(item.points_cost)}pts</span>
        <button class="fh-btn fh-btn-ghost fh-btn-sm fh-ad-tasks-edit-btn"
                data-act="open-edit-store-item" data-iid="${item.item_id}"
                title="Edit reward">${I.edit}</button>
        <button class="fh-btn fh-btn-danger fh-btn-sm"
                data-act="delete-store-item"
                data-iid="${item.item_id}" data-iname="${escAttr(item.name)}"
                title="Delete reward">${I.trash}</button>
      </div>`;
}

function _htmlStoreItemEditorPanel(item, people, catLabels, card) {
    const inner = item
        ? `
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1;min-width:0">
              <div class="fh-ad-tasks-panel-title">Edit reward</div>
              <div class="fh-ad-tasks-panel-sub" title="${escAttr(item.name)}">${escHTML(item.name)}</div>
            </div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="close-store-panel"
                    style="flex-shrink:0" title="Close panel">✕</button>
          </div>
          <div class="fh-ad-tasks-panel-body">
            ${storeItemFormFields(item, true, people, catLabels)}
          </div>
          <div class="fh-ad-tasks-panel-footer">
            <button class="fh-btn fh-btn-primary" style="flex:1"
                    data-act="ok-edit-store-item-inline">Save changes</button>
            <button class="fh-btn fh-btn-ghost fh-btn-sm"
                    data-act="delete-store-item"
                    data-iid="${item.item_id}" data-iname="${escAttr(item.name)}"
                    title="Hide from kids (can restore by toggling Active)">Deactivate</button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="hard-delete-store-item"
                    data-iid="${item.item_id}" data-iname="${escAttr(item.name)}"
                    title="Permanently delete — cannot be undone">Delete ✕</button>
          </div>`
        : `
          <div class="fh-ad-tasks-panel-empty">
            <div class="fh-ad-tasks-panel-empty-icon">↖</div>
            <div class="fh-ad-tasks-panel-empty-text">Select a reward to edit</div>
          </div>`;

    return `<div class="fh-ad-rewards-panel">${inner}</div>`;
}

// ---------------------------------------------------------------------------
// History — person filter + full 30-day log
// ---------------------------------------------------------------------------

function _htmlAdHistory(attr, card) {
    const historyLog  = attr.history_log || [];
    const people      = attr.people      || [];
    const firstParent = people.find(p => p.type === "parent");

    const CHORE_TYPES = new Set([
        "task_completed", "task_approved", "pending_approval", "task_denied",
        "task_skipped", "task_excused", "task_rejected", "task_marked_complete",
    ]);

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

    // Left panel: chore history (tasks, skips, approvals, excuses)
    const choreEntries = filtered.filter(e => CHORE_TYPES.has(e.type));
    const grouped = groupHistorySkipped(choreEntries);
    const choreRows = grouped.map(item => {
        if (item.isGroup) return _renderAdminSkippedGroup(item, firstParent, card);
        return _renderAdminHistRow(item.entry, firstParent);
    }).join("") || `<div class="fh-empty fh-ad-empty">No chore history yet.</div>`;

    // Right rail: rewards, points, allowances, subscriptions
    const rewardEntries = filtered.filter(e => !CHORE_TYPES.has(e.type));
    const rewardRows = rewardEntries.map(e => _renderAdminHistRow(e, firstParent))
        .join("") || `<div class="fh-empty fh-ad-empty">No reward history yet.</div>`;

    return `
      <div class="fh-ad-history-wrap">
        <div class="fh-ad-panel fh-ad-history-main">
          <div class="fh-ad-panel-hdr">
            <span class="fh-ad-panel-title">Chore history</span>
            <span class="fh-ad-panel-sub">last 30 days</span>
          </div>
          <div class="fh-ad-panel-body">
            ${filterChips}
            <div class="fh-hist-scroll">${choreRows}</div>
          </div>
        </div>
        <div class="fh-ad-history-rail">
          <div class="fh-ad-tasks-panel-hdr">
            <div style="flex:1">
              <div class="fh-ad-tasks-panel-title">Rewards &amp; points</div>
              <div class="fh-ad-tasks-panel-sub">last 30 days · filtered with left panel</div>
            </div>
          </div>
          <div class="fh-ad-history-rail-body">
            ${rewardRows}
          </div>
        </div>
      </div>`;
}

// ---------------------------------------------------------------------------
// Settings — hub config + store inventory (2-column on wide)
// ---------------------------------------------------------------------------

function _htmlAdSettings(attr, people, card) {
    const famName          = attr.family_name               || "Family Hub";
    const ppdollar         = attr.points_per_dollar         || 10;
    const showDollar       = attr.show_dollar_value_to_kids || false;
    const catLabels        = attr.category_labels           || [];
    const penaltyAlertTime = attr.penalty_alert_time !== undefined ? attr.penalty_alert_time : 800;
    const rankEvalWeekday  = attr.rank_eval_weekday         !== undefined ? attr.rank_eval_weekday : 0;
    const rankDropThr      = attr.rank_drop_threshold       !== undefined ? attr.rank_drop_threshold : 50;
    const rankGainThr      = attr.rank_gain_threshold       !== undefined ? attr.rank_gain_threshold : 75;
    const rankPpdLadder    = attr.rank_ppd_ladder           || [3.0, 3.5, 4.0, 4.5, 5.0];
    const roomsCfg         = attr.rooms_config              || {};
    const weatherEntity    = attr.weather_entity            || "";
    const calendarEntities = attr.today_calendar_entities   || [];
    const WEEKDAY_NAMES    = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    const labelChips = catLabels.map(l => `
      <div class="fh-cat-chip"
           draggable="true"
           data-drag-id="${escAttr(l)}"
           data-drag-type="category"
           title="Drag to reorder">
        <span class="fh-cat-chip-handle">⠿</span>
        <span>${escHTML(l)}</span>
        <button class="fh-cat-chip-del" data-act="remove-cat-label"
                data-label="${escAttr(l)}" title="Remove">×</button>
      </div>`).join("");

    // Rank PPD ladder — one input per rung, stored as ¢/pt
    const ladderInputs = rankPpdLadder.map((cpt, idx) => `
      <div class="fh-row" style="gap:6px;align-items:center;margin-bottom:4px">
        <span style="font-size:.8rem;color:var(--fh-text-sec);width:50px;flex-shrink:0">Rank ${idx}</span>
        <input class="fh-input fh-ad-rank-ladder-input" type="number"
               min="0.1" max="100" step="0.1"
               data-rank-idx="${idx}"
               value="${cpt}" style="flex:1">
        <span style="font-size:.8rem;color:var(--fh-text-sec)">¢/pt</span>
      </div>`).join("");

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
                <div style="font-size:.75rem;color:var(--fh-text-sec)">${ppdollar} points per dollar (base rate)</div>
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
            <div class="fh-field">
              <label class="fh-label">Reward value per rank (¢/point)</label>
              <div class="fh-field-help" style="margin-bottom:8px">
                Higher rank → more cents per point → fewer points needed to redeem rewards.
              </div>
              ${ladderInputs}
              <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="save-rank-ppd-ladder"
                      style="margin-top:8px">Save ladder</button>
            </div>
            <div class="fh-divider"></div>
            <div>
              <div class="fh-label" style="margin-bottom:6px">Category labels</div>
              <div class="fh-field-help" style="margin-bottom:6px;font-size:.78rem;color:var(--fh-text-sec)">
                Shared by Tasks and Rewards sections.
              </div>
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

    // Always render subitems into the DOM — toggled via inline style, not re-render.
    // This means the Excuse buttons are always present and the scroll position
    // is never disturbed when the user expands/collapses a group.
    const subItems = group.items.map(e => {
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
    }).join("");

    return `
      <div class="fh-hist-group">
        <div class="fh-hist-group-hdr" data-act="toggle-skipped-group" data-key="${group.key}">
          <div class="fh-hist-info" style="flex:1;min-width:0">
            <div class="fh-hist-label" style="color:var(--fh-warning)">Skipped chores</div>
            <div class="fh-hist-name">${escHTML(group.dateDisplay)} · ${penLabel}</div>
          </div>
          <span class="fh-hist-expand-icon">${expanded ? "▲" : "▼"}</span>
        </div>
        <div class="fh-hist-subitems"${expanded ? "" : ' style="display:none"'}>${subItems}</div>
      </div>`;
}

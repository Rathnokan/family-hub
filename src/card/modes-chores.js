/**
 * Family Hub Card — Mission Control (Chores HQ)
 *
 * v0.6.0 S9 P2 (iteration 2): rows grouped by chore_id with per-assignee
 * mini buttons on the right. Cuts row count significantly on the "all
 * agents" view — parents see Brush-Teeth ONCE with three buttons (one per
 * kid) instead of three rows. Filter chips still narrow to one person.
 *
 * Layout (≥1100px viewport):
 *   ┌─ HQ HEADER · brand · stats strip · clock ────────────────────────────┐
 *   ├─ AGENT ROSTER (5 codenamed cards, click to filter) ──────────────────┤
 *   │  MAIN COLUMN                       │  SIDEBAR (480px)                │
 *   │  · BREACH section                  │  · INTEL ALERTS (read-only)     │
 *   │  · Category groups (1 row/chore)   │  · OPEN OPS (claimable)         │
 *   │  · empty state if all clear        │  · status footer                │
 *   └────────────────────────────────────┴─────────────────────────────────┘
 *
 * Approval / denial actions live in Admin — Mission Control intel is
 * display-only so kids tapping the kitchen Echo Show can't approve their
 * own chores.
 *
 * Phantom row retention: tasks tapped via GO are cached in
 * `card._mcLastTasks`. If the next sensor refresh removes them (instant
 * completion path) but they're still in `card._pendingSubmit`, we replay
 * the cached task as a pending-state row so the user sees confirmation
 * for the full 35s window.
 */

import { choreIcon }                     from "./icons.js";
import { escHTML, escAttr, ini, fPts }   from "./utils.js";
import { DEFAULT_COLOR }                 from "./constants.js";

// ---- Public entry point ------------------------------------------------------

export function htmlChores(card) {
    const clAttr        = card._attrs("sensor.family_hub_claimable_tasks");
    const naAttr        = card._attrs("sensor.family_hub_needs_attention");
    const people        = card._people().filter(p => p.active !== false);
    const liveTasks     = clAttr.all_tasks || [];
    const claimable     = clAttr.tasks     || [];
    const approvalQ     = naAttr.approval_queue || [];
    const orderedLabels = naAttr.category_labels || [];
    const globalPaused  = !!naAttr.penalties_paused_global;
    const famName       = naAttr.family_name || "Family Hub";

    // ---- Phantom row retention --------------------------------------------
    // Cache the live tasks so we can replay rows that were just submitted
    // but have already disappeared from the sensor data.
    if (!card._mcLastTasks) card._mcLastTasks = new Map();
    const liveIds = new Set(liveTasks.map(t => t.task_id));
    for (const t of liveTasks) card._mcLastTasks.set(t.task_id, t);
    const pendingSet = card._pendingSubmit || new Set();
    const phantoms = [];
    for (const tid of pendingSet) {
        if (!liveIds.has(tid) && card._mcLastTasks.has(tid)) {
            phantoms.push({ ...card._mcLastTasks.get(tid), _phantom: true });
        }
    }
    const allTasks = [...liveTasks, ...phantoms];

    // ---- Per-task agent annotation ----------------------------------------
    const peopleById = new Map(people.map(p => [p.person_id, p]));
    const annotateTask = (t) => {
        const agent = peopleById.get(t.assigned_to);
        return {
            ...t,
            _agentColor: agent?.avatar_color || DEFAULT_COLOR,
            _agentCode:  (agent?.code || agent?.name || "?").toUpperCase(),
            _agentName:  agent?.name || "?",
            _agentPersonId: agent?.person_id || t.assigned_to,
        };
    };

    // ---- Filter, then group by chore_id -----------------------------------
    const filtered = (card._filter
        ? allTasks.filter(t => t.assigned_to === card._filter)
        : allTasks
    ).map(annotateTask);

    const breachItems = filtered.filter(t => t.days_delta < 0);
    const todayItems  = filtered.filter(t => t.days_delta >= 0);

    const breachGroups = _groupByChore(breachItems);
    const todayGroups  = _groupByChore(todayItems);

    // Counts for header strip
    const missionCount = breachGroups.length + todayGroups.length;
    const alertCount   = approvalQ.length;
    const opsDay       = _opsDay();

    return `
        ${card._celebration ? _htmlCelebration(card._celebration) : ""}
        <div class="fh-mc">
            ${_htmlHeader(famName, missionCount, alertCount, opsDay, globalPaused)}
            <div class="fh-mc-body">
                <main class="fh-mc-main">
                    ${_htmlAgentRoster(people, allTasks, approvalQ, card)}
                    ${_htmlBreach(breachGroups, card)}
                    ${_htmlTodayGroups(todayGroups, orderedLabels, card)}
                    ${(!breachGroups.length && !todayGroups.length)
                        ? `<div class="fh-mc-empty">
                               <div class="fh-mc-empty-title">✓ ALL MISSIONS COMPLETE</div>
                               <div class="fh-mc-empty-sub">HQ STANDING DOWN · NICE WORK</div>
                           </div>`
                        : ""}
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

// ---- Group by chore_id (one row per chore, list of assignees) --------------

function _groupByChore(tasks) {
    const byChore = new Map();
    for (const t of tasks) {
        const key = t.chore_id || t.task_id;
        if (!byChore.has(key)) {
            byChore.set(key, {
                chore_id:       t.chore_id,
                name:           t.name,
                icon:           t.icon,
                description:    t.description,
                category_label: t.category_label,
                points:         t.points,
                penalty_enabled: t.penalty_enabled,
                penalty_points: t.penalty_points,
                daily_penalty_firing: t.daily_penalty_firing,
                days_until_reset: t.days_until_reset,
                recurrence_type:  t.recurrence_type,
                anyBreach:      false,
                maxOverdue:     0,
                assignees:      [],
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
            task_id:   t.task_id,
            color:     t._agentColor,
            code:      t._agentCode,
            name:      t._agentName,
            streak:    t.streak || 0,
            milestone: t.streak_milestone || 0,
            status:    t.status,
            days_overdue: isOver ? Math.abs(t.days_delta) : 0,
            isBreach:  isOver,
            isPhantom: !!t._phantom,
        });
    }
    return [...byChore.values()];
}

// ---- HQ Header --------------------------------------------------------------

function _opsDay() {
    // Days since 2025-09-01 — arbitrary but stable anchor for the "OPS DAY 217" stat
    const anchor = new Date(2025, 8, 1);
    return Math.max(1, Math.floor((Date.now() - anchor.getTime()) / 86400000));
}

function _htmlHeader(famName, missionCount, alertCount, opsDay, globalPaused) {
    const now  = new Date();
    const date = now.toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric"
    }).toUpperCase();
    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: false
    });

    return `
        <header class="fh-mc-header">
            <div class="fh-mc-brand">
                <div class="fh-mc-logo">FH</div>
                <div class="fh-mc-wordmark">
                    <div class="fh-mc-wordmark-name">${escHTML(famName).toUpperCase()}</div>
                    <div class="fh-mc-wordmark-tag">OPERATIONS · COMMAND</div>
                </div>
            </div>
            ${globalPaused
                ? `<div class="fh-mc-ops-paused">OPS PAUSED</div>`
                : ""}
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

// ---- Agent Roster -----------------------------------------------------------

function _htmlAgentRoster(people, allTasks, approvalQ, card) {
    if (!people.length) return "";

    const cards = people.map(p => {
        const color    = p.avatar_color || DEFAULT_COLOR;
        const active   = card._filter === p.person_id;
        const dim      = card._filter && !active;
        const missions = allTasks.filter(t => t.assigned_to === p.person_id).length;
        const alerts   = approvalQ.filter(a => a.person_id === p.person_id).length;
        const code     = (p.code || p.name || "AGT").toUpperCase();
        const balance  = parseInt(card._states(card._personEntityId(p.name))?.state || "0");
        // v0.6.1: success-rate streak line — only shown when feature is enabled
        // for this person AND they have an active streak. Otherwise the row stays
        // visually clean.
        const ssMilestone = p.completion_milestone || 0;
        const ssStreak    = p.completion_streak || 0;
        const ssThreshold = p.completion_threshold_pct || 80;
        const streakLine  = (ssMilestone > 0 && ssStreak > 0)
            ? `<div class="fh-mc-agent-streak" title="${ssThreshold}% of daily chores for ${ssStreak} days running">
                   🔥 ${ssStreak}d · ${ssThreshold}%
               </div>`
            : "";

        return `
            <button class="fh-mc-agent ${active ? "active" : ""} ${dim ? "dim" : ""}"
                    style="--agent-color:${color}"
                    data-act="filter" data-pid="${escAttr(p.person_id)}">
                <div class="fh-mc-agent-head">
                    <div class="fh-mc-agent-avatar">
                        ${ini(p.name)}
                        ${alerts > 0
                            ? `<span class="fh-mc-agent-alert">${alerts}</span>`
                            : ""}
                    </div>
                    <div class="fh-mc-agent-id">
                        <div class="fh-mc-agent-code">${escHTML(code)}</div>
                        <div class="fh-mc-agent-name">${escHTML(p.name)}</div>
                    </div>
                </div>
                ${streakLine}
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

// ---- BREACH section ---------------------------------------------------------

function _htmlBreach(breachGroups, card) {
    if (!breachGroups.length) return "";

    return `
        <section class="fh-mc-missions">
            ${_sectionHeader("BREACH ALERT",
                `${breachGroups.length} CHORE${breachGroups.length > 1 ? "S" : ""} PAST RESET`,
                "red", true)}
            <div class="fh-row-list">
                ${breachGroups.map(g => _htmlGroupedRow(g, card)).join("")}
            </div>
        </section>
    `;
}

// ---- Today missions grouped by category in admin order ----------------------

function _htmlTodayGroups(todayGroups, orderedLabels, card) {
    if (!todayGroups.length) return "";

    const labelIndex = new Map(orderedLabels.map((l, i) => [l, i]));
    const byCategory = new Map();
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

    return sortedKeys.map(label => {
        const groups = byCategory.get(label) || [];
        const hdr    = label
            ? _sectionHeader(label.toUpperCase(), `${groups.length} ACTIVE`, "gold")
            : "";
        return `
            <section class="fh-mc-missions">
                ${hdr}
                <div class="fh-row-list">
                    ${groups.map(g => _htmlGroupedRow(g, card)).join("")}
                </div>
            </section>
        `;
    }).join("");
}

// ---- Single grouped row (one chore, N assignees) ---------------------------

function _htmlGroupedRow(g, card) {
    const opId = String(g.chore_id || "").slice(0, 4).toUpperCase();

    // Status chip: BREACH if any assignee is overdue, RESETS 1D otherwise.
    let statusChip = "";
    if (g.anyBreach) {
        statusChip = `<span class="fh-row-chip fh-row-chip--breach">BREACH · ${g.maxOverdue}D</span>`;
    } else if (g.days_until_reset === 1) {
        statusChip = `<span class="fh-row-chip fh-row-chip--reset">RESETS 1D</span>`;
    }
    if (g.daily_penalty_firing) {
        statusChip += `<span class="fh-row-chip fh-row-chip--firing">ACCRUING −${g.penalty_points}/D</span>`;
    }
    const chipsHtml = statusChip
        ? `<div class="fh-row-chips">${statusChip}</div>`
        : `<div class="fh-row-chips"></div>`;

    const descLine = g.description
        ? `<div class="fh-row-desc">${escHTML(g.description)}</div>` : "";
    const penaltyLine = (g.penalty_enabled && g.penalty_points > 0)
        ? `<div class="fh-row-penalty">−${g.penalty_points}pts if skipped</div>` : "";

    // Per-assignee buttons.
    const buttons = g.assignees.map(a => {
        const pending = card._pendingSubmit?.has(a.task_id)
                        || a.status === "pending_approval"
                        || a.isPhantom;
        const cls = ["fh-mc-go-mini"];
        if (a.isBreach) cls.push("breach");
        if (pending)    cls.push("pending");
        if (pending) {
            return `
                <div class="${cls.join(" ")}"
                     style="--mc-accent:${a.color}"
                     aria-disabled="true"
                     title="Pending approval — ${escAttr(a.name)}">
                    <span class="fh-mc-go-code">${escHTML(a.code)}</span>
                    <span class="fh-mc-go-check">⏱</span>
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
                    title="GO — ${escAttr(a.name)}">
                <span class="fh-mc-go-code">${escHTML(a.code)}</span>
                <span class="fh-mc-go-check">✓</span>
            </button>`;
    }).join("");

    // Row accent: borrow the first assignee's color so single-assignee
    // chores still get their personal tint. Mixed-assignee chores get a
    // gradient via CSS (set by _agentColor being a single value here we
    // pick the first; CSS shows the colored buttons on the right).
    const accentColor = g.assignees[0]?.color || DEFAULT_COLOR;
    const flashClass = g.assignees.some(a => card._flashing?.has(a.task_id))
        ? " flash" : "";

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

// ---- Section header (// LABEL ─── sub) ----------------------------------------

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

// ---- Sidebar: Intel Alerts (read-only display) ------------------------------
// Approval / denial actions live in Admin to keep kids from approving
// their own chores on the kitchen Echo Show.

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

    const rows = approvalQ.map(a => {
        const color = a.person_color || DEFAULT_COLOR;
        const code  = (a.person_code || a.person_name || "?").slice(0, 6).toUpperCase();
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

// ---- Sidebar: Open Ops (claimable) ------------------------------------------

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

    const rows = claimable.map(t => {
        const op   = String(t.chore_id || t.task_id || "").slice(0, 4).toUpperCase();
        const kind = t.claim_mode === "multi_claim" ? "MULTI" : "FCFS";
        return `
            <div class="fh-mc-ops-row">
                <div class="fh-mc-ops-kicker">${kind} · OP-${op}</div>
                <div class="fh-mc-ops-icon">${choreIcon(t.icon || "", "var(--mc-cyan)", "22px")}</div>
                <div class="fh-mc-ops-body">
                    <div class="fh-mc-ops-name">${escHTML(t.name)}</div>
                    ${t.category_label
                        ? `<div class="fh-mc-ops-cat">${escHTML(t.category_label)}</div>` : ""}
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
                <span class="fh-mc-panel-sub">UNCLAIMED · FIRST IN WINS</span>
            </div>
            <div class="fh-mc-ops-list">${rows}</div>
        </section>
    `;
}

// ---- Sidebar: status footer -------------------------------------------------

function _htmlStatusFooter(people, naAttr) {
    const now = new Date();
    const sync = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    const familyPts = people.reduce((sum, p) => {
        const v = parseInt(p.lifetime_points || 0);
        return sum + (isNaN(v) ? 0 : v);
    }, 0);
    const storeCount = (naAttr.store_items || []).length;

    return `
        <div class="fh-mc-status">
            <div class="fh-mc-status-row"><span class="fh-mc-status-dot ok"></span>LINK · STABLE</div>
            <div class="fh-mc-status-row">SYNC · ${sync}</div>
            <div class="fh-mc-status-row">FAMILY · ${people.length} AGENTS · ${fPts(familyPts)}PTS</div>
            <div class="fh-mc-status-row">STORE · ${storeCount} REWARDS LIVE</div>
        </div>
    `;
}

// ---- Milestone celebration overlay (unchanged) ------------------------------

function _htmlCelebration(cel) {
    return `
        <div class="fh-celebration-overlay" data-act="dismiss-celebration">
            <div class="fh-celebration-badge">
                <div class="fh-celebration-star">★</div>
                <div class="fh-celebration-title">MILESTONE!</div>
                <div class="fh-celebration-streak">▲ ${cel.streak}</div>
                <div class="fh-celebration-name">${escHTML(cel.name)}</div>
            </div>
        </div>
    `;
}

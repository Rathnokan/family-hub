/**
 * Family Hub Card — Harry Potter Theme (Olivia)
 *
 * Parchment / wizarding school aesthetic. Warm parchment background, dark ink,
 * emerald & burgundy accents. Chores as class periods with wax-seal icons;
 * store as the Vault; history as O.W.L. records. On wide viewports a right-
 * side parchment rail accompanies the schedule (House points, O.W.L. progress,
 * Spellwork Streaks, Owl Post). Below 900px the rail collapses below.
 *
 * Design reference: docs/design-reference/theme-hp.jsx
 */

import { escHTML, escAttr, fPts, ini, relTime,
         groupHistorySkipped }                            from "../utils.js";
import { HISTORY_META }                                   from "../constants.js";
import { getEffectiveRank, getWeeklyPts, htmlRankBar, htmlSuccessStreak,
         groupByCategory, getActiveStreaks,
         computeStreakProgress, htmlChoreRow }            from "./_shared.js";

// ---- Palette ----------------------------------------------------------------

const HP = {
    bg:      "#EFE0BA",
    panel:   "#FAF0D7",
    ink:     "#241914",
    mute:    "#5A4020",
    emerald: "#1F4F3C",
    gold:    "#C9A22A",
    crimson: "#6F1B26",
    red:     "#A02020",
    green:   "#2A5A20",
};

const KID_PALETTE = {
    bg:        "#EFE0BA", bgLo:    "#D7BF8C",
    accent:    "#1F4F3C", accentHi:"#2D6E54", accentLo:"#0B2A20",
    ink:       "#241914", white:   "#F7ECCC",
    yellow:    "#C9A22A", red:     "#6F1B26",
};

// ---- Row config (S9 — shared chore-row component) --------------------------

const hpRowConfig = {
    themeKey:        "hp",
    leadFormat:      (t, idx) =>
        (t.status === "pending_approval" || t._over) ? null : `P${idx}`,
    btnLabel:        "Cast ✓",
    btnPendingLabel: "Pending Approval",
    reminderBtnLabel:"Dismiss",
    streakIcon:      "⚡",
    statusFormat: {
        breach:    t => `Overdue ${t.days_overdue}d`,
        resetSoon: () => "Resets 1d",
        firing:    t => `−${t.penalty_points} house pts/d`,
        expiry:    d => d <= 0 ? "Expires today" : `Expires in ${d}d`,
    },
    iconColor:       () => HP.panel,
};

// ---- Rank ladder ------------------------------------------------------------

const HP_RANKS = [
    { minXP: 0,    name: "First Year"       },
    { minXP: 100,  name: "Second Year"      },
    { minXP: 250,  name: "Third Year"       },
    { minXP: 500,  name: "Prefect"          },
    { minXP: 1000, name: "Head Student"     },
    { minXP: 2000, name: "Order of Phoenix" },
];

// ---- Theme export -----------------------------------------------------------

export const hpTheme = {
    key:               "hp",
    tint:              "#EFE0BA",
    sigil:             "⚡",
    ranks:             HP_RANKS,
    handlesNavigation: false,

    rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, HP_RANKS).name;
    },

    homeTileSubLabel() {
        return "HOGWARTS STUDENT";
    },

    render(card, person) {
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid        = card._personEntityId(person.name);
        const attr       = card._attrs(eid);
        const naAttr     = card._attrs("sensor.family_hub_needs_attention");
        const balance    = parseInt(card._states(eid)?.state || "0");
        const rankIdx    = person.rank_index !== undefined ? person.rank_index : 0;
        const dropThr    = person.rank_drop_threshold ?? naAttr.rank_drop_threshold ?? 50;
        const gainThr    = person.rank_gain_threshold ?? naAttr.rank_gain_threshold ?? 75;
        const weekly     = getWeeklyPts(person.person_id, naAttr.history_log);
        const rank       = getEffectiveRank(rankIdx, HP_RANKS);

        const now    = new Date();
        const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const dateStr = `${DAYS[now.getDay()]} · ${now.getDate()} ${MONTHS[now.getMonth()]}`;

        const tabDefs = [
            { key: "tasks",   label: "Classes",    sub: "today's schedule" },
            { key: "store",   label: "Honeydukes", sub: "reward shop"      },
            { key: "history", label: "Pensieve",   sub: "history"          },
        ];
        const activeTab = card._tab || "tasks";

        const tabBar = tabDefs.map(t => `
            <div class="fh-hp-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}<span class="fh-hp-tab-sub">${t.sub}</span></div>`).join("");

        let content = "";
        if (activeTab === "tasks")   content = _assignments(attr, person, naAttr, card);
        if (activeTab === "store")   content = _vault(attr, person, balance, card);
        if (activeTab === "history") content = _owlRecords(person, card);

        const openCount = (attr.tasks_due_today_list || []).filter(t => t.status === "pending").length;

        const showRail = activeTab === "tasks";
        const railHTML = showRail
            ? _railPanels({ attr, naAttr, person, balance, weekly, openCount,
                            rankIdx, dropThr, gainThr, rank })
            : "";

        return `
            <div class="fh-hp-page${kidLarge}">
                <div class="fh-hp-crest-watermark">⚡</div>
                <div class="fh-hp-frame"></div>
                <span class="fh-hp-corner fh-hp-corner-tl">❦</span>
                <span class="fh-hp-corner fh-hp-corner-tr">❦</span>
                <span class="fh-hp-corner fh-hp-corner-bl">❦</span>
                <span class="fh-hp-corner fh-hp-corner-br">❦</span>

                <div class="fh-hp-title-block">
                    <div class="fh-hp-title-row">
                        <div class="fh-hp-crest-simple">⚜</div>
                        <div class="fh-hp-title-center">
                            <div class="fh-hp-title-kicker">STUDENT · ${escHTML(person.name.toUpperCase())} · ${escHTML(rank.name.toUpperCase())}</div>
                            <div class="fh-hp-title-main">${escHTML(person.name)}</div>
                            <div class="fh-hp-title-sub">~ Daily Class Schedule · ${dateStr} ~</div>
                        </div>
                        <div class="fh-hp-wax-seal">${ini(person.name)}</div>
                    </div>
                </div>

                <div class="fh-hp-tabs">${tabBar}</div>

                <div class="fh-hp-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-hp-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-hp-rail">${railHTML}</aside>` : ""}
                </div>

                <div class="fh-hp-footer"><span>By owl, this ${dateStr} · Ops Year 2026</span><span>· Mischief Managed ·</span></div>
            </div>`;
    },
};

// ---- Rail panels ------------------------------------------------------------

function _railPanels({ attr, naAttr, person, balance, weekly, openCount,
                       rankIdx, dropThr, gainThr, rank }) {
    return `
        ${_railPanelKPIs(balance, weekly, openCount)}
        ${_railPanelRank(rankIdx, weekly, dropThr, gainThr, person)}
        ${_railPanelStreaks(attr, naAttr, person)}
        ${_railPanelOwlPost(person, naAttr)}`;
}

function _railPanel(label, contentHTML) {
    return `
        <div class="fh-hp-rpanel">
            <div class="fh-hp-rpanel-hdr">~ ${label} ~</div>
            <div class="fh-hp-rpanel-body">${contentHTML}</div>
        </div>`;
}

function _railPanelKPIs(balance, weekly, openCount) {
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
            ${cell("HOUSE PTS",  fPts(balance), "")}
            ${cell("THIS WEEK",  `+${weekly}`,  "pts")}
            ${cell("CLASSES",    openCount,     "open")}
        </div>`;
    return _railPanel("HOUSE STANDINGS", body);
}

function _railPanelRank(rankIdx, weekly, dropThr, gainThr, person) {
    const bar    = htmlRankBar(rankIdx, weekly, dropThr, gainThr, HP_RANKS, HP.emerald);
    const streak = htmlSuccessStreak(person, HP.emerald);
    if (!bar) {
        return _railPanel("O.W.L. PROGRESS",
            `<div class="fh-hp-rmax">${escHTML(getEffectiveRank(rankIdx, HP_RANKS).name)} · max marks</div>${streak}`);
    }
    return _railPanel("O.W.L. PROGRESS", bar + streak);
}

function _railPanelStreaks(attr, naAttr, person) {
    const active = getActiveStreaks(attr, naAttr, person, 8);
    if (!active.length) {
        return _railPanel("SPELLWORK STREAKS",
            `<div class="fh-hp-rempty">No spells cast in succession yet</div>`);
    }

    const rows = active.map(t => {
        const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
        const stars = Array.from({ length: goalSegs }, (_, i) =>
            `<span class="fh-hp-rstar${i < filledN ? " lit" : ""}">★</span>`
        ).join("");

        const bonusChip = (t.milestone > 0 && t.bonus > 0)
            ? `<span class="fh-hp-rbonus">★+${t.bonus}</span>` : "";

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

    return _railPanel("SPELLWORK STREAKS", rows);
}

function _railPanelOwlPost(person, naAttr) {
    const entries = (naAttr.history_log || [])
        .filter(e => e.person_id === person.person_id && (e.points_delta || 0) > 0)
        .slice(0, 4);

    if (!entries.length) {
        return _railPanel("OWL POST",
            `<div class="fh-hp-rempty">No owls delivered yet</div>`);
    }

    const rows = entries.map(e => {
        const when = e.timestamp ? relTime(e.timestamp) : "";
        return `
            <div class="fh-hp-rowl">
                <div class="fh-hp-rowl-when">~ ${escHTML(when)} ~</div>
                <div class="fh-hp-rowl-row">
                    <span class="fh-hp-rowl-name">${escHTML(e.chore_name || e.note || "—")}</span>
                    <span class="fh-hp-rowl-pts">+${e.points_delta}pts</span>
                </div>
            </div>`;
    }).join("");

    return _railPanel("OWL POST", rows);
}

// ---- Assignments (tasks) tab ------------------------------------------------

function _assignments(attr, person, naAttr, card) {
    const rawDue     = attr.tasks_due_today_list        || [];
    const rawOverdue = attr.tasks_overdue_list          || [];
    const pending    = attr.tasks_pending_approval_list || [];
    const catOrder   = naAttr.category_labels           || [];

    const collapseByChore = (rows, pickFn) => {
        const seen = new Map();
        for (const t of rows) {
            if (!seen.has(t.chore_id) || pickFn(t, seen.get(t.chore_id))) seen.set(t.chore_id, t);
        }
        return [...seen.values()];
    };
    const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
    const due     = collapseByChore(rawDue.filter(t => t.chore_type !== "reminder"), () => false);
    const all     = [...overdue.map(t => ({ ...t, _over: true })), ...due];

    if (!all.length && !pending.length) {
        return `<div class="fh-hp-empty">All assignments complete — 10 points to the house!</div>`;
    }

    let periodIdx = 0;
    const groups = groupByCategory(all, catOrder);
    const groupHtml = groups.map(group => {
        const hdr = `<div class="fh-row-section-hdr">${escHTML(group.label)}</div>`;
        const scrolls = group.tasks.map(t => htmlChoreRow(t, hpRowConfig, person, card, { index: ++periodIdx })).join("");
        return hdr + scrolls;
    }).join("");

    const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">Awaiting approval</div>
        ${pending.map(t => htmlChoreRow(t, hpRowConfig, person, card)).join("")}` : "";

    return `
        <div class="fh-row-list">
            ${groupHtml}
            ${pendingSection}
        </div>`;
}

// ---- The Vault (store) tab --------------------------------------------------

function _vault(attr, person, balance, card) {
    const items = attr.store_items || [];
    if (!items.length) return `<div class="fh-hp-empty">The vault is empty for now.</div>`;

    const naAttr = card._attrs("sensor.family_hub_needs_attention");
    const personPending = (naAttr.redemption_queue || []).filter(r => r.person_id === person.person_id);
    const pendingByItemId = new Set(personPending.map(r => r.item_id).filter(Boolean));
    const pendingByName   = new Set(personPending.filter(r => !r.item_id).map(r => r.item_name));

    return `
        <div class="fh-hp-vault">
            ${items.map(item => {
                const can       = balance >= item.points_cost;
                const requested = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
                return `
                <div class="fh-hp-vault-item">
                    <div class="fh-hp-vault-body">
                        <div class="fh-hp-vault-name">${escHTML(item.name)}</div>
                        ${item.description ? `<div class="fh-hp-vault-desc">${escHTML(item.description)}</div>` : ""}
                    </div>
                    <div class="fh-hp-pts-seal" style="color:${HP.emerald}">${fPts(item.points_cost)}pts</div>
                    ${requested
                        ? `<span style="color:${HP.emerald};font-size:.8rem;font-weight:700">Requested ✓</span>`
                        : `<button class="fh-hp-cast-btn ${can ? "" : "disabled"}"
                                   data-act="redeem" data-iid="${escAttr(item.item_id)}" data-pid="${escAttr(person.person_id)}"
                                   ${!can ? 'disabled style="opacity:.4;cursor:not-allowed"' : ""}>
                               ${can ? "Request" : "Need more"}
                           </button>`}
                </div>`;
            }).join("")}
        </div>`;
}

// ---- O.W.L. Records (history) tab -------------------------------------------

function _owlRecords(person, card) {
    const naAttr  = card._attrs("sensor.family_hub_needs_attention");
    const entries = (naAttr.history_log || []).filter(e => e.person_id === person.person_id);
    if (!entries.length) return `<div class="fh-hp-empty">No O.W.L. records yet.</div>`;

    const grouped = groupHistorySkipped(entries);
    return `
        <div class="fh-hp-log">
            ${grouped.slice(0, 15).map(item =>
                item.isGroup ? _hpSkippedGroup(item, card) : _hpLogRow(item.entry)
            ).join("")}
        </div>`;
}

function _hpLogRow(e) {
    const meta = HISTORY_META[e.type] || { label: e.type, color: HP.mute };
    const pts  = e.points_delta
        ? `<span style="color:${e.points_delta > 0 ? HP.emerald : HP.red};font-weight:700">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>` : "";
    return `
        <div class="fh-hp-log-row">
            <div class="fh-hp-log-type" style="color:${meta.color}">${escHTML(meta.label)}</div>
            <div class="fh-hp-log-name">${escHTML(e.chore_name || e.note || "—")}</div>
            ${pts}
        </div>`;
}

function _hpSkippedGroup(group, card) {
    const expanded = card._expandedSkippedDates.has(group.key);
    const pen      = group.totalPenalty > 0 ? `−${group.totalPenalty}pts` : "no penalty";
    return `
        <div class="fh-hp-log-row"
             data-act="toggle-skipped-group" data-key="${escAttr(group.key)}" style="cursor:pointer">
            <div class="fh-hp-log-type" style="color:${HP.red}">Skipped</div>
            <div class="fh-hp-log-name">${escHTML(group.dateDisplay)} · ${pen}</div>
            <span style="color:${HP.mute};font-size:.75rem">${expanded ? "▲" : "▼"}</span>
        </div>
        ${expanded ? group.items.map(e => `
            <div class="fh-hp-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-hp-log-type" style="color:${HP.mute}">Item</div>
                <div class="fh-hp-log-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta ? `<span style="color:${HP.red};font-weight:700">${e.points_delta}pts</span>` : ""}
            </div>`).join("") : ""}`;
}

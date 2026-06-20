/**
 * Family Hub Card — Engineer Theme (Jim)
 *
 * Blueprint drawing-sheet aesthetic. Deep cyanotype blue background with a
 * fine drafting grid; cream ink typography. Chores render as "work orders"
 * with an approval stamp button. On wide viewports a right-side blueprint
 * stat rail (KPIs, rank, streaks, title block) accompanies the work order
 * list. Below 900px the rail collapses and rows go full width.
 */

import { escHTML, escAttr, fPts, fUSD, ini,
         groupHistorySkipped }                            from "../utils.js";
import { DEFAULT_COLOR, HISTORY_META, WEEKDAY_LABELS }   from "../constants.js";
import { getEffectiveRank, effectiveRankThresholds, getWeeklyPts, getWeeklyPtsLost, getPointsAtRisk,
         htmlRankBar, htmlSuccessStreak, htmlWeeklyStreak, htmlLateClaimBtn, htmlRotationRail,
         getActiveStreaks,
         computeStreakProgress,
         groupByCategory,
         htmlChoreRow,
         htmlGoalBanner, htmlRailGoal, htmlGoalToggleBtn,
         storeItemIcon, htmlStoreItemLimit,
         htmlStreakFreezeChip, htmlDailyProgress, htmlWeeklyProgress,
         htmlGroupContributorBars, htmlChipInBtn, htmlGroupProposalBanner, htmlRewardLockBadge, htmlBonusBoard,
         htmlSubscriptionRail, htmlRailSubscriptions, htmlStoreRailContent } from "./_shared.js";

// ---- Palette ----------------------------------------------------------------

const ENG = {
    paper:   "#0E3A5C",
    panel:   "#0B2D48",
    grid:    "#3C7AA5",
    ink:     "#F2EBD6",
    inkDim:  "#C9C0A2",
    inkMute: "#8A8669",
    red:     "#E07A4C",
    amber:   "#E0B84C",
};

const KID_PALETTE = {
    bg:        "#0E3A5C", bgLo:    "#0B2D48",
    accent:    "#E0B84C", accentHi:"#E0B84C", accentLo:"#A88830",
    ink:       "#F2EBD6", white:   "#F7F0DC",
    yellow:    "#E0B84C", red:     "#E07A4C",
};

// ---- Rank ladder ------------------------------------------------------------

const ENGINEER_RANKS = [
    { minXP: 0,    name: "Drafter"        },
    { minXP: 100,  name: "Jr. Engineer"   },
    { minXP: 300,  name: "P.E."           },
    { minXP: 700,  name: "Sr. Engineer"   },
    { minXP: 1200, name: "Principal Eng." },
];

// ---- Row config (S9 — shared chore-row component) --------------------------

const engineerRowConfig = {
    themeKey:        "engineer",
    kickerFormat:    (t, idx) =>
        `WO-${String(idx).padStart(3, "0")} · ${(t.category_label || "GEN").toUpperCase()}`,
    btnLabel:        "MARK<br>COMPLETE",
    btnIcon:         "✓",
    btnPendingLabel: "PENDING<br>APPROVAL",
    btnPendingIcon:  "⏱",
    reminderBtnLabel:"DISMISS",
    streakIcon:      "△",
    statusFormat: {
        breach:    t => `BREACH · ${t.days_overdue}D`,
        resetSoon: () => "RESETS 1D",
        firing:    t => `ACCRUING −${t.penalty_points}/D`,
        expiry:    d => d <= 0 ? "EXPIRES TODAY" : `EXPIRES ${d}D`,
    },
    iconColor:       () => ENG.ink,
};

// ---- Theme export -----------------------------------------------------------

export const engineerTheme = {
    key:               "engineer",
    tint:              "#1B3550",
    sigil:             "⟁",
    ranks:             ENGINEER_RANKS,
    handlesNavigation: true,

    rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, ENGINEER_RANKS).name;
    },

    homeTileSubLabel() {
        return "CIVIL ENGINEER";
    },

    render(card, person) {
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid     = card._personEntityId(person.name);
        const attr    = card._attrs(eid);
        const naAttr  = card._attrs("sensor.family_hub_needs_attention");
        const balance = parseInt(card._states(eid)?.state || "0");
        const rankIdx = person.rank_index !== undefined ? person.rank_index : 0;
        const { dropThr, gainThr } = effectiveRankThresholds(person, naAttr, rankIdx);
        const weekly  = getWeeklyPts(person.person_id, naAttr.history_log, naAttr.rank_eval_weekday);
        const lost    = getWeeklyPtsLost(person.person_id, naAttr.history_log, naAttr.rank_eval_weekday);
        const atRisk  = getPointsAtRisk(attr);

        const tabDefs = [
            { key: "tasks",   label: "WORK ORDERS", sub: "primary"  },
            { key: "store",   label: "REWARDS",      sub: "exchange" },
            { key: "history", label: "AS-BUILTS",    sub: "history"  },
        ];
        const activeTab = card._tab || "tasks";

        const tabBar = tabDefs.map(t => `
            <div class="fh-eng-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">
                ${t.label}
                <span class="fh-eng-tab-sub">${t.sub}</span>
            </div>`).join("");

        let content = "";
        if (activeTab === "tasks")   content = _workOrders(attr, person, balance, card);
        if (activeTab === "store")   content = _rewards(attr, person, balance, card);
        if (activeTab === "history") content = _asBuilts(person, card);

        const rank       = getEffectiveRank(rankIdx, ENGINEER_RANKS);
        const openCount  = (attr.tasks_due_today_list || []).filter(t => t.status === "pending").length;
        const now        = new Date();
        const plotDate   = now.toISOString().slice(0, 10);
        const plotTime   = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

        // Rail only flanks the work-orders tab — store/history get full width.
        const showRail   = activeTab === "tasks";
        const railHTML   = showRail
            ? _railPanels({ attr, naAttr, person, balance, openCount, weekly, lost, atRisk, rank,
                            rankIdx, dropThr, gainThr, plotDate, card })
            : "";

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

                    <!-- Body — two-column on wide, stacked below 900px -->
                    <div class="fh-eng-body ${showRail ? "has-rail" : ""}">
                        <div class="fh-eng-body-main">${content}</div>
                        ${showRail ? `<aside class="fh-eng-rail">${railHTML}</aside>` : ""}
                    </div>

                    <!-- Footer — single mono status line -->
                    <div class="fh-eng-footer">
                        <span class="fh-eng-file-path">FILE &middot; /WORK_ORDERS/${plotDate}.dwg &middot; LAST PLOT ${plotTime} LOCAL &middot; SHEET A-101 R/A</span>
                    </div>
                </div>
            </div>`;
    },
};

// ---- Rail panels ------------------------------------------------------------

function _railPanels({ attr, naAttr, person, balance, openCount, weekly, lost, atRisk, rank,
                       rankIdx, dropThr, gainThr, plotDate, card }) {
    return `
        ${_railPanelKPIs(balance, openCount, weekly, lost, atRisk, attr.show_dollar_value ? attr.dollar_value : null)}
        ${htmlRailGoal(attr)}
        ${_railPanelRank(rankIdx, weekly, dropThr, gainThr, person, attr)}
        ${_railPanelStreaks(attr, naAttr, person)}
        ${(() => { const b = htmlBonusBoard(card._attrs("sensor.family_hub_claimable_tasks").tasks || [], person.person_id, { bare: true }); return b ? _railPanel("BONUS · OPEN OPS", b) : ""; })()}
        ${(() => { const b = htmlRotationRail(person, naAttr, ENG.amber); return b ? _railPanel("ROTATION · POOL", b) : ""; })()}
        ${_railPanelSubs(attr, balance, person.person_id)}
        ${_railPanelSheet(person, rank, plotDate)}`;
}

function _railPanel(label, contentHTML, opts = {}) {
    const { dense = false } = opts;
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

function _railPanelSubs(attr, balance, personId) {
    const rows = htmlRailSubscriptions(attr.subscriptions, balance, personId);
    return rows ? _railPanel("SUBSCRIPTIONS", rows) : "";
}

function _railPanelKPIs(balance, openCount, weekly, lost, atRisk, dollarValue) {
    const cell = (label, val, unit, sub, subClass = "") => `
        <div class="fh-eng-rkpi">
            <div class="fh-eng-rkpi-lbl">${label}</div>
            <div class="fh-eng-rkpi-val-row">
                <span class="fh-eng-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-eng-rkpi-unit">${unit}</span>` : ""}
            </div>
            ${sub ? `<div class="fh-rkpi-sub ${subClass}">${escHTML(sub)}</div>` : ""}
        </div>`;
    const body = `
        <div class="fh-eng-rkpi-row">
            ${cell("BAL",   fPts(balance), "pts", dollarValue != null ? fUSD(dollarValue) : null)}
            ${cell("OPEN",  openCount,     "wo", atRisk > 0 ? `−${atRisk} at risk` : null, "fh-rkpi-sub--loss")}
            ${cell("WEEK",  `+${weekly}`,  "pts", lost > 0 ? `−${lost} lost` : "0 lost", "fh-rkpi-sub--loss")}
        </div>`;
    return _railPanel("TODAY · KPIS", body, { dense: true });
}

function _railPanelRank(rankIdx, weekly, dropThr, gainThr, person, attr) {
    const bar    = htmlRankBar(rankIdx, weekly, dropThr, gainThr, ENGINEER_RANKS, ENG.amber, person);
    const streak = htmlSuccessStreak(person, ENG.amber);
    const wstreak = htmlWeeklyStreak(person);
    const freeze = htmlStreakFreezeChip(attr);
    if (!bar) {
        // Parent — rank bar is empty string; show a static "MAX RANK" note.
        return _railPanel("RANK · TRACK",
            `<div class="fh-eng-rmax">${escHTML(getEffectiveRank(rankIdx, ENGINEER_RANKS).name)} &middot; MAX</div>${streak}${wstreak}${freeze}`);
    }
    return _railPanel("RANK · TRACK", bar + streak + wstreak + freeze);
}

function _railPanelStreaks(attr, naAttr, person) {
    const active = getActiveStreaks(attr, naAttr, person, 8);
    if (!active.length) {
        return _railPanel("STREAK · CONSTELLATION",
            `<div class="fh-eng-rempty">NO ACTIVE STREAKS &middot; START A CYCLE</div>`);
    }

    const rows = active.map(t => {
        const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 12);
        const segs = Array.from({ length: goalSegs }, (_, i) => i < filledN);

        const milestoneChip = (t.milestone > 0 && t.bonus > 0)
            ? `<span class="fh-eng-chip fh-eng-chip-streak">&#9733;+${t.bonus}</span>`
            : "";

        return `
            <div class="fh-eng-rstreak">
                <div class="fh-eng-rstreak-head">
                    <span class="fh-eng-rstreak-name">${escHTML(t.name)}</span>
                    ${milestoneChip}
                </div>
                <div class="fh-eng-rstreak-bar">
                    ${segs.map(on =>
                        `<span class="fh-eng-dim-seg${on ? " filled" : ""}"></span>`
                    ).join("")}
                    <span class="fh-eng-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
    }).join("");

    return _railPanel("STREAK · CONSTELLATION", rows);
}

function _railPanelSheet(person, rank, plotDate) {
    const body = `
        <div class="fh-eng-tb-header">RATHNOKAN HOUSEHOLD &middot; CIVIL DIV.</div>
        <div class="fh-eng-tb-grid">
            ${_tbCell("DRAWN BY", person.name.toUpperCase())}
            ${_tbCell("DATE",     plotDate)}
            ${_tbCell("SHEET",    "01 / 01")}
            ${_tbCell("SCALE",    "N.T.S.")}
            ${_tbCell("REV",      "A")}
            ${_tbCell("STATUS",   "ISSUED", ENG.amber)}
        </div>
        <div class="fh-eng-rsheet-legend">&#9671; APPROVAL STAMP TO COMPLETE &middot; DIMENSIONS IN POINTS &middot; DO NOT SCALE</div>`;
    return _railPanel("SHEET · A-101", body, { dense: true });
}

function _tbCell(label, value, accent) {
    return `
        <div class="fh-eng-tb-cell">
            <div class="fh-eng-tb-cell-lbl">${label}</div>
            <div class="fh-eng-tb-cell-val" style="${accent ? `color:${accent}` : ""}">${escHTML(value)}</div>
        </div>`;
}

// ---- Work Orders (Tasks) tab ------------------------------------------------

function _workOrders(attr, person, balance, card) {
    const rawDue     = attr.tasks_due_today_list        || [];
    const rawOverdue = attr.tasks_overdue_list          || [];
    const pending    = attr.tasks_pending_approval_list || [];
    const catOrder   = card._attrs("sensor.family_hub_needs_attention").category_labels || [];

    const collapseByChore = (rows, pickFn) => {
        const seen = new Map();
        for (const t of rows) {
            const key = t.chore_id;
            if (!seen.has(key) || pickFn(t, seen.get(key))) seen.set(key, t);
        }
        return [...seen.values()];
    };
    const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
    const due     = collapseByChore(rawDue.filter(t => t.chore_type !== "reminder"), () => false);

    // Overdue first, then due rows grouped by category in the admin-defined order
    // (same as every other theme). `_over` is the flag groupByCategory routes on.
    const all = [
        ...overdue.map(t => ({ ...t, _over: true })),
        ...due,
    ];

    if (!all.length && !pending.length) {
        return `<div class="fh-eng-empty">&#10003; ALL WORK ORDERS COMPLETE &middot; AREA CLEAR</div>`;
    }

    let woIdx = 0;
    const groupHtml = groupByCategory(all, catOrder).map(group => {
        const hdr  = `<div class="fh-row-section-hdr">// ${escHTML(group.label.toUpperCase())}</div>`;
        const rows = group.tasks.map(t =>
            htmlChoreRow(t, engineerRowConfig, person, card, { index: ++woIdx })).join("");
        return hdr + rows;
    }).join("");

    // Pending tasks render as their own grouped section under a header. Each
    // pending row is the same shared row — htmlChoreRow detects status and
    // swaps to the dashed PENDING tile automatically.
    let pendingIdx = 0;
    const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">// PENDING REVIEW</div>
        ${pending.map(t => htmlChoreRow(t, engineerRowConfig, person, card, { index: ++pendingIdx })).join("")}` : "";

    return `
        ${htmlDailyProgress(attr)}
        ${htmlWeeklyProgress(attr)}
        <div class="fh-row-list">
            ${groupHtml}
            ${pendingSection}
        </div>`;
}

// ---- Rewards (Store) tab ----------------------------------------------------

function _rewards(attr, person, balance, card) {
    const items = attr.store_items || [];
    if (!items.length) {
        return `<div class="fh-eng-empty">NO REWARDS CONFIGURED &middot; PENDING ADMIN ACTION</div>`;
    }

    const naAttr             = card._attrs("sensor.family_hub_needs_attention");
    const pendingRedemptions = naAttr.redemption_queue || [];
    const personPending      = pendingRedemptions.filter(r => r.person_id === person.person_id);
    const pendingByItemId    = new Set(personPending.map(r => r.item_id).filter(Boolean));
    const pendingByName      = new Set(personPending.filter(r => !r.item_id).map(r => r.item_name));
    const activeSubs         = new Set((attr.subscriptions || []).map(s => s.item_id));

    return `
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${htmlGroupProposalBanner(attr.group_proposals, person.person_id)}
        ${htmlGoalBanner(attr)}
        <div class="fh-eng-reward-list">
            ${items.map(item => {
                const isGroup        = !!item.is_group_reward;
                const isSubscription = item.item_type === "subscription";
                const isSubscribed   = isSubscription && activeSubs.has(item.item_id);
                const can            = balance >= item.points_cost;
                const requested      = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
                const blocked        = !!item.next_available;
                const pLbl           = { weekly:"wk", monthly:"mo", quarterly:"qtr", biannual:"6mo", annual:"yr" }[item.subscription_period] || "mo";
                return `
                <div class="fh-eng-reward-row">
                    ${storeItemIcon(item)}
                    <div class="fh-eng-reward-body">
                        <div class="fh-eng-wo-name" style="font-size:1rem">${escHTML(item.name)}</div>
                        ${item.description
                            ? `<div class="fh-eng-status">${escHTML(item.description)}</div>` : ""}
                        ${htmlStoreItemLimit(item)}
                        ${htmlGroupContributorBars(item, person.person_id)}
                    </div>
                    ${isGroup
                        ? ""
                        : `<div class="fh-eng-pts-stamp" style="min-width:64px">
                               <div class="fh-eng-pts-num" style="font-size:1.2rem">${fPts(item.points_cost)}</div>
                               <div class="fh-eng-pts-lbl">POINTS</div>
                           </div>`}
                    ${htmlGoalToggleBtn(item, attr, person.person_id)}
                    ${isGroup
                        ? htmlChipInBtn(item, person.person_id, balance)
                        : (item.locked && !requested && !(isSubscription && isSubscribed))
                        ? htmlRewardLockBadge(item)
                        : isSubscription
                        ? isSubscribed
                            ? `<div class="fh-eng-status" style="color:${ENG.amber}">&#10003; SUBSCRIBED</div>`
                            : requested
                            ? `<div class="fh-eng-status" style="color:${ENG.amber}">&#10003; REQUESTED</div>`
                            : `<button class="fh-eng-stamp-btn ${can ? "" : "disabled"}"
                                       data-act="redeem"
                                       data-iid="${escAttr(item.item_id)}"
                                       data-pid="${escAttr(person.person_id)}"
                                       style="font-size:9px;${!can ? "opacity:.4;cursor:not-allowed" : ""}">
                                   ${can ? `SUBSCRIBE · ${item.points_cost}/${pLbl}` : "INSUFFICIENT\nFUNDS"}
                               </button>`
                        : requested
                        ? `<div class="fh-eng-status" style="color:${ENG.amber}">&#10003; REQUESTED</div>`
                        : blocked
                        ? `<div class="fh-eng-status" style="color:${ENG.amber};font-size:.75rem">NOT AVAILABLE</div>`
                        : `<button class="fh-eng-stamp-btn ${can ? "" : "disabled"}"
                                   data-act="redeem" data-iid="${item.item_id}" data-pid="${person.person_id}"
                                   style="font-size:9px;${!can ? "opacity:.4;cursor:not-allowed" : ""}">
                               ${can ? "REQUISITION" : "INSUFFICIENT\nFUNDS"}
                           </button>`}
                </div>`;
            }).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${htmlStoreRailContent(attr.subscriptions, balance, naAttr.history_log, person.person_id)}
        </div>
        </div>`;
}

// ---- As-Builts (History) tab ------------------------------------------------

function _asBuilts(person, card) {
    const naAttr  = card._attrs("sensor.family_hub_needs_attention");
    const entries = (naAttr.history_log || []).filter(e => e.person_id === person.person_id);
    if (!entries.length) {
        return `<div class="fh-eng-empty">NO RECORDS ON FILE &middot; HISTORY BEGINS ON FIRST COMPLETION</div>`;
    }

    const grouped = groupHistorySkipped(entries);
    return `
        <div class="fh-eng-hist-list">
            ${grouped.slice(0, 12).map(item =>
                item.isGroup ? _engSkippedGroup(item, card) : _engHistRow(item.entry)
            ).join("")}
        </div>`;
}

function _engHistRow(e) {
    const meta     = HISTORY_META[e.type] || { label: e.type, color: ENG.inkMute };
    const ptsDelta = e.points_delta
        ? (e.points_delta > 0 ? `+${e.points_delta}pts` : `${e.points_delta}pts`) : "";
    const ptColor  = e.points_delta > 0 ? ENG.amber : ENG.red;

    return `
        <div class="fh-eng-hist-row">
            <div class="fh-eng-hist-type" style="color:${meta.color}">${escHTML(meta.label.toUpperCase())}</div>
            <div class="fh-eng-hist-name">${escHTML(e.chore_name || e.note || "—")}</div>
            ${ptsDelta ? `<div class="fh-eng-hist-pts" style="color:${ptColor}">${ptsDelta}</div>` : ""}
        </div>`;
}

function _engSkippedGroup(group, card) {
    const expanded = card._expandedSkippedDates.has(group.key);
    const pen      = group.totalPenalty > 0 ? `&minus;${group.totalPenalty}pts` : "no penalty";
    return `
        <div class="fh-eng-hist-row fh-eng-hist-skipped"
             data-act="toggle-skipped-group" data-key="${group.key}" style="cursor:pointer">
            <div class="fh-eng-hist-type" style="color:${ENG.red}">SKIPPED CYCLE</div>
            <div class="fh-eng-hist-name">${escHTML(group.dateDisplay)} &middot; ${pen}</div>
            <span style="color:${ENG.inkMute};font-size:.75rem">${expanded ? "▲" : "▼"}</span>
        </div>
        ${expanded ? group.items.map(e => `
            <div class="fh-eng-hist-row" style="padding-left:24px;opacity:.8">
                <div class="fh-eng-hist-type" style="color:${ENG.inkMute}">ITEM</div>
                <div class="fh-eng-hist-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta
                    ? `<div class="fh-eng-hist-pts" style="color:${ENG.red}">${e.points_delta}pts</div>`
                    : ""}
                ${htmlLateClaimBtn(e)}
            </div>`).join("") : ""}`;
}

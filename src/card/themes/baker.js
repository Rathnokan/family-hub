/**
 * Family Hub Card — Baker Theme (Shannon)
 *
 * Warm paper / recipe-card aesthetic: cream background, dark ink, terracotta.
 * Chores render as kitchen "order tickets" with step numbers; store as a menu
 * board; history as an order log. On wide viewports a right-side recipe-card
 * rail accompanies the orders (Pantry KPIs, Promotion track, Hot Streaks,
 * Recent Orders). Below 900px the rail collapses below.
 *
 * Design reference: docs/design-reference/theme-baker.jsx
 */

import { escHTML, escAttr, fPts, fUSD, ini, relTime,
         groupHistorySkipped }                            from "../utils.js";
import { HISTORY_META }                                   from "../constants.js";
import { getEffectiveRank, effectiveRankThresholds, getWeeklyPts, getWeeklyPtsLost, getPointsAtRisk,
         htmlRankBar, htmlSuccessStreak, htmlLateClaimBtn, htmlRotationRail,
         groupByCategory, getActiveStreaks,
         computeStreakProgress, htmlChoreRow,
         htmlGoalBanner, htmlRailGoal, htmlGoalToggleBtn,
         storeItemIcon, htmlStoreItemLimit,
         htmlStreakFreezeChip, htmlDailyProgress,
         htmlGroupContributorBars, htmlChipInBtn, htmlGroupProposalBanner, htmlRewardLockBadge, htmlBonusBoard,
         htmlSubscriptionRail, htmlRailSubscriptions, htmlStoreRailContent } from "./_shared.js";

// ---- Palette ----------------------------------------------------------------

const BK = {
    bg:    "#F2E5CC",
    panel: "#FBF3E2",
    ink:   "#3A1F12",
    mute:  "#8B5A3A",
    terra: "#8B3A2A",
    red:   "#A02828",
    green: "#3A6A28",
};

const KID_PALETTE = {
    bg:        "#F2E5CC", bgLo:    "#E0CDA8",
    accent:    "#8B3A2A", accentHi:"#A8344B", accentLo:"#6B2818",
    ink:       "#3A1F12", white:   "#FBF3E2",
    yellow:    "#D89A2B", red:     "#A02828",
};

// ---- Row config (S9 — shared chore-row component) --------------------------

const bakerRowConfig = {
    themeKey:        "baker",
    leadFormat:      (t, idx) => t.status === "pending_approval" ? null : String(idx),
    btnLabel:        "Bake it ✓",
    btnPendingLabel: "Pending Approval",
    reminderBtnLabel:"Dismiss",
    streakIcon:      "🔥",
    statusFormat: {
        breach:    t => `Overdue ${t.days_overdue}d`,
        resetSoon: () => "Resets 1d",
        firing:    t => `−${t.penalty_points}pts/d`,
        expiry:    d => d <= 0 ? "Expires today" : `Expires in ${d}d`,
    },
    iconColor:       (t, isOverdue) => isOverdue ? BK.red : BK.terra,
};

// ---- Rank ladder ------------------------------------------------------------

const BAKER_RANKS = [
    { minXP: 0,    name: "Apprentice"    },
    { minXP: 100,  name: "Line Cook"     },
    { minXP: 300,  name: "Pastry Chef"   },
    { minXP: 700,  name: "Sous Chef"     },
    { minXP: 1200, name: "Head Chef"     },
];

// ---- Theme export -----------------------------------------------------------

export const bakerTheme = {
    key:               "baker",
    tint:              "#F2E5CC",
    sigil:             "❧",
    ranks:             BAKER_RANKS,
    handlesNavigation: false,

    rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, BAKER_RANKS).name;
    },

    homeTileSubLabel() {
        return "MASTER BAKER";
    },

    render(card, person) {
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid        = card._personEntityId(person.name);
        const attr       = card._attrs(eid);
        const naAttr     = card._attrs("sensor.family_hub_needs_attention");
        const balance    = parseInt(card._states(eid)?.state || "0");
        const rankIdx    = person.rank_index !== undefined ? person.rank_index : 0;
        const { dropThr, gainThr } = effectiveRankThresholds(person, naAttr, rankIdx);
        const weekly     = getWeeklyPts(person.person_id, naAttr.history_log, naAttr.rank_eval_weekday);
        const lost       = getWeeklyPtsLost(person.person_id, naAttr.history_log, naAttr.rank_eval_weekday);
        const atRisk     = getPointsAtRisk(attr);
        const rank       = getEffectiveRank(rankIdx, BAKER_RANKS);

        const now    = new Date();
        const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const dateStr = `${DAYS[now.getDay()]} · ${now.getDate()} ${MONTHS[now.getMonth()]}`;

        const tabDefs = [
            { key: "tasks",   label: "Today's Prep", sub: "CHORES"  },
            { key: "store",   label: "Pantry",        sub: "STORE"   },
            { key: "history", label: "Recipe Book",   sub: "HISTORY" },
        ];
        const activeTab = card._tab || "tasks";

        const tabBar = tabDefs.map(t => `
            <div class="fh-bk-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}<span class="fh-bk-tab-sub">${t.sub}</span></div>`).join("");

        let content = "";
        if (activeTab === "tasks")   content = _orders(attr, person, naAttr, card);
        if (activeTab === "store")   content = _menu(attr, person, balance, card);
        if (activeTab === "history") content = _orderLog(person, card);

        const openCount = (attr.tasks_due_today_list || []).filter(t => t.status === "pending").length;

        const showRail = activeTab === "tasks";
        const railHTML = showRail
            ? _railPanels({ attr, naAttr, person, balance, weekly, lost, atRisk, openCount,
                            rankIdx, dropThr, gainThr, rank, card })
            : "";

        return `
            <div class="fh-bk-page${kidLarge}">
                <div class="fh-bk-frame-outer"></div>
                <div class="fh-bk-frame-inner"></div>

                <div class="fh-bk-title-block">
                    <div class="fh-bk-title-kicker">~ ${dateStr} ~</div>
                    <div class="fh-bk-title-main">Shannon's Kitchen</div>
                    <div class="fh-bk-title-sub">~ today's recipe · serves the whole family ~</div>
                </div>

                <div class="fh-bk-tabs">${tabBar}</div>

                <div class="fh-bk-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-bk-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-bk-rail">${railHTML}</aside>` : ""}
                </div>

                <div class="fh-bk-footer"><span>— Family Hub · est. 2026 —</span><span>${escHTML(rank.name)}</span></div>
            </div>`;
    },
};

// ---- Rail panels ------------------------------------------------------------

function _railPanels({ attr, naAttr, person, balance, weekly, lost, atRisk, openCount,
                       rankIdx, dropThr, gainThr, rank, card }) {
    return `
        ${_railPanelKPIs(balance, weekly, lost, atRisk, openCount, attr.show_dollar_value ? attr.dollar_value : null)}
        ${htmlRailGoal(attr)}
        ${_railPanelRank(rankIdx, weekly, dropThr, gainThr, person, attr)}
        ${_railPanelStreaks(attr, naAttr, person)}
        ${(() => { const b = htmlBonusBoard(card._attrs("sensor.family_hub_claimable_tasks").tasks || [], person.person_id, { bare: true }); return b ? _railPanel("bonus orders", b) : ""; })()}
        ${(() => { const b = htmlRotationRail(person, naAttr, BK.terra); return b ? _railPanel("rotation", b) : ""; })()}
        ${_railPanelSubs(attr, balance, person.person_id)}
        ${_railPanelRecent(person, naAttr)}`;
}

function _railPanel(label, contentHTML) {
    return `
        <div class="fh-bk-rpanel">
            <div class="fh-bk-rpanel-hdr">~ ${label} ~</div>
            <div class="fh-bk-rpanel-body">${contentHTML}</div>
        </div>`;
}

function _railPanelSubs(attr, balance, personId) {
    const rows = htmlRailSubscriptions(attr.subscriptions, balance, personId);
    return rows ? _railPanel("SUBSCRIPTIONS", rows) : "";
}

function _railPanelKPIs(balance, weekly, lost, atRisk, openCount, dollarValue) {
    const cell = (label, val, unit, sub, subClass = "") => `
        <div class="fh-bk-rkpi">
            <div class="fh-bk-rkpi-lbl">${label}</div>
            <div class="fh-bk-rkpi-val-row">
                <span class="fh-bk-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-bk-rkpi-unit">${unit}</span>` : ""}
            </div>
            ${sub ? `<div class="fh-rkpi-sub ${subClass}">${escHTML(sub)}</div>` : ""}
        </div>`;
    const body = `
        <div class="fh-bk-rkpi-row">
            ${cell("balance",   fPts(balance), "pts", dollarValue != null ? fUSD(dollarValue) : null)}
            ${cell("this week", `+${weekly}`,  "pts", lost > 0 ? `−${lost} lost` : "0 lost", "fh-rkpi-sub--loss")}
            ${cell("on prep",   openCount,     "items", atRisk > 0 ? `−${atRisk} at risk` : null, "fh-rkpi-sub--loss")}
        </div>`;
    return _railPanel("the pantry today", body);
}

function _railPanelRank(rankIdx, weekly, dropThr, gainThr, person, attr) {
    const bar    = htmlRankBar(rankIdx, weekly, dropThr, gainThr, BAKER_RANKS, BK.terra, person);
    const streak = htmlSuccessStreak(person, BK.terra);
    const freeze = htmlStreakFreezeChip(attr);
    if (!bar) {
        return _railPanel("promotion track",
            `<div class="fh-bk-rmax">${escHTML(getEffectiveRank(rankIdx, BAKER_RANKS).name)} · top of the line</div>${streak}${freeze}`);
    }
    return _railPanel("promotion track", bar + streak + freeze);
}

function _railPanelStreaks(attr, naAttr, person) {
    const active = getActiveStreaks(attr, naAttr, person, 8);
    if (!active.length) {
        return _railPanel("hot streaks",
            `<div class="fh-bk-rempty">No hot streaks yet — fire up the oven</div>`);
    }

    const rows = active.map(t => {
        const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
        const dots = Array.from({ length: goalSegs }, (_, i) =>
            `<span class="fh-bk-rdot${i < filledN ? " filled" : ""}"></span>`
        ).join("");

        const bonusChip = (t.milestone > 0 && t.bonus > 0)
            ? `<span class="fh-bk-rbonus">★+${t.bonus}</span>` : "";

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

    return _railPanel("hot streaks", rows);
}

function _railPanelRecent(person, naAttr) {
    const entries = (naAttr.history_log || [])
        .filter(e => e.person_id === person.person_id && (e.points_delta || 0) > 0)
        .slice(0, 4);

    if (!entries.length) {
        return _railPanel("today's tickets",
            `<div class="fh-bk-rempty">No tickets served yet</div>`);
    }

    const rows = entries.map(e => {
        const when = e.timestamp ? relTime(e.timestamp) : "";
        return `
            <div class="fh-bk-rorder">
                <div class="fh-bk-rorder-when">~ ${escHTML(when)} ~</div>
                <div class="fh-bk-rorder-row">
                    <span class="fh-bk-rorder-name">${escHTML(e.chore_name || e.note || "—")}</span>
                    <span class="fh-bk-rorder-pts">+${e.points_delta}pts</span>
                </div>
            </div>`;
    }).join("");

    return _railPanel("today's tickets", rows);
}

// ---- Orders (tasks) tab -----------------------------------------------------

function _orders(attr, person, naAttr, card) {
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
        return `<div class="fh-bk-empty">✓ Kitchen's clear — all orders done!</div>`;
    }

    let stepIdx = 0;
    const groups = groupByCategory(all, catOrder);
    const groupHtml = groups.map(group => {
        const hdr = `<div class="fh-row-section-hdr">${escHTML(group.label)}</div>`;
        const tickets = group.tasks.map(t => htmlChoreRow(t, bakerRowConfig, person, card, { index: ++stepIdx })).join("");
        return hdr + tickets;
    }).join("");

    const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">Awaiting approval</div>
        ${pending.map(t => htmlChoreRow(t, bakerRowConfig, person, card)).join("")}` : "";

    return `
        ${htmlDailyProgress(attr)}
        <div class="fh-row-list">
            ${groupHtml}
            ${pendingSection}
        </div>`;
}

// ---- Menu (store) tab -------------------------------------------------------

function _menu(attr, person, balance, card) {
    const items = attr.store_items || [];
    if (!items.length) return `<div class="fh-bk-empty">No rewards on the menu yet.</div>`;

    const naAttr = card._attrs("sensor.family_hub_needs_attention");
    const personPending = (naAttr.redemption_queue || []).filter(r => r.person_id === person.person_id);
    const pendingByItemId = new Set(personPending.map(r => r.item_id).filter(Boolean));
    const pendingByName   = new Set(personPending.filter(r => !r.item_id).map(r => r.item_name));
    const activeSubs      = new Set((attr.subscriptions || []).map(s => s.item_id));

    return `
        <div class="fh-store-with-rail">
        <div class="fh-store-main">
        ${htmlGroupProposalBanner(attr.group_proposals, person.person_id)}
        ${htmlGoalBanner(attr)}
        <div class="fh-bk-menu">
            ${items.map(item => {
                const isGroup        = !!item.is_group_reward;
                const isSubscription = item.item_type === "subscription";
                const isSubscribed   = isSubscription && activeSubs.has(item.item_id);
                const can            = balance >= item.points_cost;
                const requested      = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
                const blocked        = !!item.next_available;
                const pLbl           = { weekly:"wk", monthly:"mo", quarterly:"qtr", biannual:"6mo", annual:"yr" }[item.subscription_period] || "mo";
                return `
                <div class="fh-bk-menu-item">
                    ${storeItemIcon(item)}
                    <div class="fh-bk-menu-body">
                        <div class="fh-bk-menu-name">${escHTML(item.name)}</div>
                        ${item.description ? `<div class="fh-bk-menu-desc">${escHTML(item.description)}</div>` : ""}
                        ${htmlStoreItemLimit(item)}
                        ${htmlGroupContributorBars(item, person.person_id)}
                    </div>
                    ${isGroup ? "" : `<div class="fh-bk-menu-price" style="color:${BK.terra}">${fPts(item.points_cost)}pts</div>`}
                    ${htmlGoalToggleBtn(item, attr, person.person_id)}
                    ${isGroup
                        ? htmlChipInBtn(item, person.person_id, balance)
                        : (item.locked && !requested && !(isSubscription && isSubscribed))
                        ? htmlRewardLockBadge(item)
                        : isSubscription
                        ? isSubscribed
                            ? `<span class="fh-bk-badge" style="color:${BK.terra}">Subscribed ✓</span>`
                            : requested
                            ? `<span class="fh-bk-badge" style="color:${BK.terra}">Requested ✓</span>`
                            : `<button class="fh-bk-go-btn ${can ? "" : "disabled"}"
                                       data-act="redeem"
                                       data-iid="${escAttr(item.item_id)}"
                                       data-pid="${escAttr(person.person_id)}"
                                       ${!can ? 'disabled style="opacity:.4;cursor:not-allowed"' : ""}>
                                   ${can ? `Subscribe · ${item.points_cost}pts/${pLbl}` : "Need more"}
                               </button>`
                        : requested
                        ? `<span class="fh-bk-badge" style="color:${BK.terra}">Requested ✓</span>`
                        : blocked
                        ? `<span class="fh-bk-badge" style="color:var(--fh-overdue)">Not available</span>`
                        : `<button class="fh-bk-go-btn ${can ? "" : "disabled"}"
                                   data-act="redeem" data-iid="${escAttr(item.item_id)}" data-pid="${escAttr(person.person_id)}"
                                   ${!can ? 'disabled style="opacity:.4;cursor:not-allowed"' : ""}>
                               ${can ? "Request" : "Need more"}
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

// ---- Order Log (history) tab ------------------------------------------------

function _orderLog(person, card) {
    const naAttr  = card._attrs("sensor.family_hub_needs_attention");
    const entries = (naAttr.history_log || []).filter(e => e.person_id === person.person_id);
    if (!entries.length) return `<div class="fh-bk-empty">No orders on record yet.</div>`;

    const grouped = groupHistorySkipped(entries);
    return `
        <div class="fh-bk-log">
            ${grouped.slice(0, 15).map(item =>
                item.isGroup ? _logSkippedGroup(item, card) : _logRow(item.entry)
            ).join("")}
        </div>`;
}

function _logRow(e) {
    const meta = HISTORY_META[e.type] || { label: e.type, color: BK.mute };
    const pts  = e.points_delta
        ? `<span style="color:${e.points_delta > 0 ? BK.terra : BK.red};font-weight:700">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>` : "";
    return `
        <div class="fh-bk-log-row">
            <div class="fh-bk-log-type" style="color:${meta.color}">${escHTML(meta.label)}</div>
            <div class="fh-bk-log-name">${escHTML(e.chore_name || e.note || "—")}</div>
            ${pts}
        </div>`;
}

function _logSkippedGroup(group, card) {
    const expanded = card._expandedSkippedDates.has(group.key);
    const pen      = group.totalPenalty > 0 ? `−${group.totalPenalty}pts` : "no penalty";
    return `
        <div class="fh-bk-log-row"
             data-act="toggle-skipped-group" data-key="${escAttr(group.key)}" style="cursor:pointer">
            <div class="fh-bk-log-type" style="color:${BK.red}">Skipped</div>
            <div class="fh-bk-log-name">${escHTML(group.dateDisplay)} · ${pen}</div>
            <span style="color:${BK.mute};font-size:.75rem">${expanded ? "▲" : "▼"}</span>
        </div>
        ${expanded ? group.items.map(e => `
            <div class="fh-bk-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-bk-log-type" style="color:${BK.mute}">Item</div>
                <div class="fh-bk-log-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta ? `<span style="color:${BK.red};font-weight:700">${e.points_delta}pts</span>` : ""}
                ${htmlLateClaimBtn(e)}
            </div>`).join("") : ""}`;
}

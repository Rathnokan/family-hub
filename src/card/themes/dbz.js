/**
 * Family Hub Card — Dragon Ball Z Theme (Jackson, pre-reader)
 *
 * Sky-blue → orange manga energy aesthetic. ACCESSIBILITY-FIRST:
 *   • Icon is the primary identifier (large, centered, prominent)
 *   • GO! button is huge: min 56px, bold, high contrast
 *   • Minimal words everywhere — action = tap the big button
 *
 * Jackson normally uses kid mode (.kid-large CSS modifier flips the row list
 * to a card grid); this themed view is the rare adult-mode fallback. S8:
 * optional right rail (power KPIs, next form, charge streaks, next power-up).
 * Hidden below 900px viewport.
 *
 * Design reference: docs/design-reference/theme-dbz.jsx
 */

import { escHTML, escAttr, fPts, fUSD, ini, relTime,
         groupHistorySkipped }                            from "../utils.js";
import { HISTORY_META }                                   from "../constants.js";
import { getEffectiveRank, effectiveRankThresholds, getWeeklyPts, getWeeklyPtsLost, getPointsAtRisk,
         htmlRankBar, htmlSuccessStreak,
         groupByCategory, getActiveStreaks,
         computeStreakProgress, htmlChoreRow,
         htmlGoalBanner, htmlRailGoal, htmlGoalToggleBtn,
         storeItemIcon, htmlStoreItemLimit,
         htmlStreakFreezeChip, htmlDailyProgress,
         htmlGroupContributorBars, htmlChipInBtn, htmlGroupProposalBanner,
         htmlSubscriptionRail, htmlRailSubscriptions, htmlStoreRailContent } from "./_shared.js";

// ---- Palette ----------------------------------------------------------------

const DBZ = {
    sky:    "#3FAAD9",
    orange: "#FF6A1A",
    yellow: "#FFE03A",
    navy:   "#0F1E2E",
    white:  "#FFFFFF",
    mute:   "rgba(15,30,46,.6)",
    red:    "#CC2200",
};

const KID_PALETTE = {
    bg:        "#3FAAD9", bgLo:    "#7BD3F2",
    accent:    "#FF6A1A", accentHi:"#FFB229", accentLo:"#C9431B",
    ink:       "#0F1E2E", white:   "#FFFFFF",
    yellow:    "#FFE03A", red:     "#CC2200",
};

// ---- Row config (S9 — shared chore-row component) --------------------------

const dbzRowConfig = {
    themeKey:        "dbz",
    btnLabel:        "GO!",
    btnPendingLabel: "PENDING",
    reminderBtnLabel:"OK",
    streakIcon:      "⚡",
    statusFormat: {
        breach:    t => `!OVERDUE ${t.days_overdue}D`,
        resetSoon: () => "RESETS 1D",
        firing:    t => `−${t.penalty_points}⚡/D`,
        expiry:    d => d <= 0 ? "EXPIRES TODAY" : `EXPIRES ${d}D`,
    },
    iconColor:       (t, isOverdue) => isOverdue ? DBZ.red : DBZ.navy,
};

// ---- Rank ladder ------------------------------------------------------------

const DBZ_RANKS = [
    { minXP: 0,    name: "Saibaman"     },
    { minXP: 100,  name: "Saiyan"       },
    { minXP: 300,  name: "Super Saiyan" },
    { minXP: 700,  name: "SSJ2"         },
    { minXP: 1200, name: "SSJ Blue"     },
];

// ---- Theme export -----------------------------------------------------------

export const dbzTheme = {
    key:               "dbz",
    tint:              "#3FAAD9",
    sigil:             "◎",
    ranks:             DBZ_RANKS,
    handlesNavigation: false,

    rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, DBZ_RANKS).name;
    },

    homeTileSubLabel() {
        return "SAIYAN WARRIOR";
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
        const rank       = getEffectiveRank(rankIdx, DBZ_RANKS);

        const tabDefs = [
            { key: "tasks",   label: "💪 TRAIN" },
            { key: "store",   label: "💎 SHOP"  },
            { key: "history", label: "🏆 WINS"  },
        ];
        const activeTab = card._tab || "tasks";

        const tabBar = tabDefs.map(t => `
            <div class="fh-dbz-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}</div>`).join("");

        let content = "";
        if (activeTab === "tasks")   content = _missions(attr, person, naAttr, card);
        if (activeTab === "store")   content = _powerUps(attr, person, balance, card);
        if (activeTab === "history") content = _battleLog(person, card);

        const openCount  = (attr.tasks_due_today_list || []).filter(t => t.status === "pending").length;
        const storeItems = attr.store_items || [];
        const nextItem   = storeItems.find(i => i.points_cost > balance) || storeItems[0] || null;
        const fillPct    = nextItem ? Math.min(100, Math.round(balance / nextItem.points_cost * 100)) : 100;

        const showRail = activeTab === "tasks";
        const railHTML = showRail
            ? _railPanels({ attr, naAttr, person, balance, weekly, lost, atRisk, openCount,
                            rankIdx, dropThr, gainThr, nextItem, fillPct })
            : "";

        return `
            <div class="fh-dbz-page${kidLarge}">
                <div class="fh-dbz-speedlines"></div>
                <div class="fh-dbz-halftone"></div>

                <div class="fh-dbz-header">
                    <div class="fh-dbz-avatar">${ini(person.name)}</div>
                    <div class="fh-dbz-identity">
                        <div class="fh-dbz-codename">SAIYAN TRAINEE · CODENAME KAMEHA</div>
                        <div class="fh-dbz-name">${escHTML(person.name).toUpperCase()}</div>
                    </div>
                    <div class="fh-dbz-power-badge">
                        <div class="fh-dbz-power-num">${fPts(balance)}</div>
                        <div class="fh-dbz-power-lbl">POWER</div>
                    </div>
                </div>

                <div class="fh-dbz-mission-strip">
                    <span class="fh-dbz-strip-label">ACTIVE MISSIONS:</span>
                    <span class="fh-dbz-strip-count">${openCount}</span>
                    ${atRisk > 0 ? `
                    <span class="fh-dbz-strip-label">· AT RISK:</span>
                    <span class="fh-dbz-strip-count" style="color:#FF5A4A">−${atRisk}⚡</span>` : ""}
                </div>

                <div class="fh-dbz-tabs">${tabBar}</div>

                <div class="fh-dbz-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-dbz-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-dbz-rail">${railHTML}</aside>` : ""}
                </div>

                ${(showRail || !nextItem) ? "" : `
                <div class="fh-dbz-next-bar">
                    <span style="font-size:1.6rem">🎯</span>
                    <div class="fh-dbz-next-bar-body">
                        <div class="fh-dbz-next-bar-lbl">NEXT POWER-UP</div>
                        <div class="fh-dbz-next-bar-name">${escHTML(nextItem.name)} · ${fPts(nextItem.points_cost)}⚡</div>
                        <div class="fh-dbz-next-bar-track"><div class="fh-dbz-next-bar-fill" style="width:${fillPct}%"></div></div>
                    </div>
                </div>`}
            </div>`;
    },
};

// ---- Rail panels ------------------------------------------------------------

function _railPanels({ attr, naAttr, person, balance, weekly, lost, atRisk, openCount,
                       rankIdx, dropThr, gainThr, nextItem, fillPct }) {
    return `
        ${_railPanelKPIs(balance, weekly, lost, atRisk, openCount, attr.show_dollar_value ? attr.dollar_value : null)}
        ${htmlRailGoal(attr)}
        ${_railPanelRank(rankIdx, weekly, dropThr, gainThr, person, attr)}
        ${_railPanelStreaks(attr, naAttr, person)}
        ${_railPanelSubs(attr, balance, person.person_id)}
        ${_railPanelNextUp(nextItem, fillPct)}`;
}

function _railPanel(label, contentHTML) {
    return `
        <div class="fh-dbz-rpanel">
            <div class="fh-dbz-rpanel-hdr">${label}</div>
            <div class="fh-dbz-rpanel-body">${contentHTML}</div>
        </div>`;
}

function _railPanelSubs(attr, balance, personId) {
    const rows = htmlRailSubscriptions(attr.subscriptions, balance, personId);
    return rows ? _railPanel("SUBSCRIPTIONS", rows) : "";
}

function _railPanelKPIs(balance, weekly, lost, atRisk, openCount, dollarValue) {
    const cell = (label, val, unit, sub, subClass = "") => `
        <div class="fh-dbz-rkpi">
            <div class="fh-dbz-rkpi-lbl">${label}</div>
            <div class="fh-dbz-rkpi-val-row">
                <span class="fh-dbz-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-dbz-rkpi-unit">${unit}</span>` : ""}
            </div>
            ${sub ? `<div class="fh-rkpi-sub ${subClass}">${escHTML(sub)}</div>` : ""}
        </div>`;
    const body = `
        <div class="fh-dbz-rkpi-row">
            ${cell("POWER",  fPts(balance), "⚡", dollarValue != null ? fUSD(dollarValue) : null)}
            ${cell("WEEK",   `+${weekly}`,  "⚡", lost > 0 ? `−${lost} lost` : "0 lost", "fh-rkpi-sub--loss")}
            ${cell("OPEN",   openCount,     "", atRisk > 0 ? `−${atRisk} at risk` : null, "fh-rkpi-sub--loss")}
        </div>`;
    return _railPanel("POWER LEVEL", body);
}

function _railPanelRank(rankIdx, weekly, dropThr, gainThr, person, attr) {
    const bar    = htmlRankBar(rankIdx, weekly, dropThr, gainThr, DBZ_RANKS, DBZ.orange, person);
    const streak = htmlSuccessStreak(person, DBZ.orange);
    const freeze = htmlStreakFreezeChip(attr);
    if (!bar) {
        return _railPanel("NEXT FORM",
            `<div class="fh-dbz-rmax">${escHTML(getEffectiveRank(rankIdx, DBZ_RANKS).name)} · MAX</div>${streak}${freeze}`);
    }
    return _railPanel("NEXT FORM", bar + streak + freeze);
}

function _railPanelStreaks(attr, naAttr, person) {
    const active = getActiveStreaks(attr, naAttr, person, 8);
    if (!active.length) {
        return _railPanel("CHARGE STREAKS",
            `<div class="fh-dbz-rempty">NO CHARGE YET — TRAIN UP!</div>`);
    }

    const rows = active.map(t => {
        const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
        const bolts = Array.from({ length: goalSegs }, (_, i) =>
            `<span class="fh-dbz-rbolt${i < filledN ? "" : " dim"}">⚡</span>`
        ).join("");

        const bonusChip = (t.milestone > 0 && t.bonus > 0)
            ? `<span class="fh-dbz-rbonus">★+${t.bonus}</span>` : "";

        return `
            <div class="fh-dbz-rstreak">
                <div class="fh-dbz-rstreak-head">
                    <span class="fh-dbz-rstreak-name">${escHTML(t.name)}</span>
                    ${bonusChip}
                </div>
                <div class="fh-dbz-rstreak-bar">
                    <span class="fh-dbz-rbolts">${bolts}</span>
                    <span class="fh-dbz-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
    }).join("");

    return _railPanel("CHARGE STREAKS", rows);
}

function _railPanelNextUp(nextItem, fillPct) {
    if (!nextItem) {
        return _railPanel("NEXT POWER-UP",
            `<div class="fh-dbz-rempty">SHOP STOCKED — ASK A PARENT</div>`);
    }
    const body = `
        <div class="fh-dbz-rnext-name">${escHTML(nextItem.name)}</div>
        <div class="fh-dbz-rnext-cost">${fPts(nextItem.points_cost)}⚡</div>
        <div class="fh-dbz-next-bar-track"><div class="fh-dbz-next-bar-fill" style="width:${fillPct}%"></div></div>`;
    return _railPanel("NEXT POWER-UP", body);
}

// ---- Missions (tasks) tab ---------------------------------------------------

function _missions(attr, person, naAttr, card) {
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
        return `
            <div class="fh-dbz-all-done">
                <div class="fh-dbz-all-done-icon">⭐</div>
                <div class="fh-dbz-all-done-text">ALL DONE!</div>
            </div>`;
    }

    const groups = groupByCategory(all, catOrder);
    const groupHtml = groups.map(group => {
        const hdr = `<div class="fh-row-section-hdr">${escHTML(group.label)}</div>`;
        const rows = group.tasks.map(t => htmlChoreRow(t, dbzRowConfig, person, card)).join("");
        return hdr + rows;
    }).join("");

    const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">WAITING FOR APPROVAL</div>
        ${pending.map(t => htmlChoreRow(t, dbzRowConfig, person, card)).join("")}` : "";

    return `
        ${htmlDailyProgress(attr)}
        <div class="fh-row-list">
            ${groupHtml}
            ${pendingSection}
        </div>`;
}

// ---- Power-Ups (store) tab --------------------------------------------------

function _powerUps(attr, person, balance, card) {
    const items = attr.store_items || [];
    if (!items.length) {
        return `<div class="fh-dbz-empty">No power-ups available yet!</div>`;
    }

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
        <div class="fh-dbz-powerup-list">
            ${items.map(item => {
                const isGroup        = !!item.is_group_reward;
                const isSubscription = item.item_type === "subscription";
                const isSubscribed   = isSubscription && activeSubs.has(item.item_id);
                const can            = balance >= item.points_cost;
                const requested      = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
                const blocked        = !!item.next_available;
                const pLbl           = { weekly:"wk", monthly:"mo", quarterly:"qtr", biannual:"6mo", annual:"yr" }[item.subscription_period] || "mo";
                return `
                <div class="fh-dbz-powerup-row ${!isGroup && !isSubscription && !can ? "locked" : ""}">
                    ${storeItemIcon(item)}
                    <div class="fh-dbz-powerup-body">
                        <div class="fh-dbz-powerup-name">${escHTML(item.name)}</div>
                        ${isGroup ? "" : `<div class="fh-dbz-powerup-cost">${fPts(item.points_cost)}⚡</div>`}
                        ${htmlStoreItemLimit(item)}
                        ${htmlGroupContributorBars(item, person.person_id)}
                    </div>
                    ${htmlGoalToggleBtn(item, attr, person.person_id)}
                    ${isGroup
                        ? htmlChipInBtn(item, person.person_id, balance)
                        : isSubscription
                        ? isSubscribed
                            ? `<span style="color:${DBZ.orange};font-weight:800;font-size:.9rem">SUB ✓</span>`
                            : requested
                            ? `<span style="color:${DBZ.orange};font-weight:800;font-size:.9rem">SENT ✓</span>`
                            : `<button class="fh-dbz-go-btn ${can ? "" : "locked"}"
                                       data-act="redeem"
                                       data-iid="${escAttr(item.item_id)}"
                                       data-pid="${escAttr(person.person_id)}"
                                       ${!can ? 'disabled style="opacity:.35;cursor:not-allowed"' : ""}>
                                   ${can ? `SUB · ${item.points_cost}/${pLbl}` : "NEED ⚡"}
                               </button>`
                        : requested
                        ? `<span style="color:${DBZ.orange};font-weight:800;font-size:.9rem">SENT ✓</span>`
                        : blocked
                        ? `<span style="color:var(--fh-overdue);font-weight:700;font-size:.8rem">NOT YET</span>`
                        : `<button class="fh-dbz-go-btn ${can ? "" : "locked"}"
                                   data-act="redeem" data-iid="${escAttr(item.item_id)}" data-pid="${escAttr(person.person_id)}"
                                   ${!can ? 'disabled style="opacity:.35;cursor:not-allowed"' : ""}>
                               ${can ? "GET!" : "NEED ⚡"}
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

// ---- Battle Log (history) tab -----------------------------------------------

function _battleLog(person, card) {
    const naAttr  = card._attrs("sensor.family_hub_needs_attention");
    const entries = (naAttr.history_log || []).filter(e => e.person_id === person.person_id);
    if (!entries.length) {
        return `<div class="fh-dbz-empty">No battles recorded yet!</div>`;
    }

    const grouped = groupHistorySkipped(entries);
    return `
        <div class="fh-dbz-log">
            ${grouped.slice(0, 12).map(item =>
                item.isGroup ? _dbzSkippedGroup(item, card) : _dbzLogRow(item.entry)
            ).join("")}
        </div>`;
}

function _dbzLogRow(e) {
    const meta = HISTORY_META[e.type] || { label: e.type, color: DBZ.mute };
    const pts  = e.points_delta
        ? `<span style="color:${e.points_delta > 0 ? DBZ.orange : DBZ.red};font-weight:800">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}⚡
           </span>` : "";
    return `
        <div class="fh-dbz-log-row">
            <div class="fh-dbz-log-type" style="color:${meta.color}">${escHTML(meta.label)}</div>
            <div class="fh-dbz-log-name">${escHTML(e.chore_name || e.note || "—")}</div>
            ${pts}
        </div>`;
}

function _dbzSkippedGroup(group, card) {
    const expanded = card._expandedSkippedDates.has(group.key);
    const pen      = group.totalPenalty > 0 ? `−${group.totalPenalty}⚡` : "ok";
    return `
        <div class="fh-dbz-log-row"
             data-act="toggle-skipped-group" data-key="${escAttr(group.key)}" style="cursor:pointer">
            <div class="fh-dbz-log-type" style="color:${DBZ.red}">MISSED</div>
            <div class="fh-dbz-log-name">${escHTML(group.dateDisplay)} · ${pen}</div>
            <span style="color:${DBZ.mute};font-size:.75rem">${expanded ? "▲" : "▼"}</span>
        </div>
        ${expanded ? group.items.map(e => `
            <div class="fh-dbz-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-dbz-log-type" style="color:${DBZ.mute}">Item</div>
                <div class="fh-dbz-log-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta ? `<span style="color:${DBZ.red};font-weight:800">${e.points_delta}⚡</span>` : ""}
            </div>`).join("") : ""}`;
}

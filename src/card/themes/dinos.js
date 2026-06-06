/**
 * Family Hub Card — Dinos Theme (Spencer)
 *
 * Natural-history specimen journal. Kraft paper background, sepia ink,
 * typewriter font. Chores as catalogued specimens; store as supply cache;
 * history as site log. On wide viewports a right-side field-kit rail
 * accompanies the specimen cards (KPIs, dig status, fossil record, recent
 * findings). Below 900px the rail collapses below the cards.
 *
 * Design reference: docs/design-reference/theme-dinos.jsx
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

const DN = {
    bg:    "#E8DAB7",   // kraft paper
    panel: "#F0E5C8",   // lighter card
    ink:   "#2B1F0E",   // sepia ink
    mute:  "#6B5020",   // muted sepia
    amber: "#8B6A20",   // amber accent
    red:   "#8C281E",   // overdue red
    green: "#2A5A20",   // success green
};

const KID_PALETTE = {
    bg:        "#E8DAB7", bgLo:    "#C8B689",
    accent:    "#8B6A20", accentHi:"#D89A36", accentLo:"#5C4218",
    ink:       "#2B1F0E", white:   "#FAF0D7",
    yellow:    "#D89A36", red:     "#8C281E",
};

// ---- Row config (S9 — shared chore-row component) --------------------------

const dinosRowConfig = {
    themeKey:        "dinos",
    kickerFormat:    (t, idx) => t.status === "pending_approval" ? null
        : `SP-${String(idx).padStart(3, "0")} · ${(t.category_label || "MISC").toUpperCase().slice(0, 12)}`,
    btnLabel:        "LOG IT",
    btnPendingLabel: "PENDING APPROVAL",
    reminderBtnLabel:"DISMISS",
    streakIcon:      "🔥",
    statusFormat: {
        breach:    t => `OVERDUE ${t.days_overdue}D`,
        resetSoon: () => "RESETS 1D",
        firing:    t => `−${t.penalty_points}/D`,
        expiry:    d => d <= 0 ? "EXPIRES TODAY" : `EXPIRES ${d}D`,
    },
    iconColor:       (t, isOverdue) => isOverdue ? DN.red : DN.ink,
};

// ---- Rank ladder ------------------------------------------------------------

const DINOS_RANKS = [
    { minXP: 0,    name: "Field Asst."        },
    { minXP: 100,  name: "Jr. Paleontologist" },
    { minXP: 300,  name: "Field Lead"          },
    { minXP: 700,  name: "Curator"             },
    { minXP: 1200, name: "Dr. Spencer"         },
];

// ---- Theme export -----------------------------------------------------------

export const dinosTheme = {
    key:               "dinos",
    tint:              "#E8DAB7",
    sigil:             "◉",
    ranks:             DINOS_RANKS,
    handlesNavigation: false,

    rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, DINOS_RANKS).name;
    },

    homeTileSubLabel() {
        return "FIELD PALEONTOLOGIST";
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
        const rank       = getEffectiveRank(rankIdx, DINOS_RANKS);

        const now    = new Date();
        const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const dateStr = `${DAYS[now.getDay()]} · ${now.getDate()} ${MONTHS[now.getMonth()]}`;

        const tabDefs = [
            { key: "tasks",   label: "FIELD LOG",     sub: "today's specimens" },
            { key: "store",   label: "TRADING POST",  sub: "rewards"           },
            { key: "history", label: "CATALOGUE",     sub: "history"           },
        ];
        const activeTab = card._tab || "tasks";

        const tabBar = tabDefs.map(t => `
            <div class="fh-dn-tab ${activeTab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}<span class="fh-dn-tab-sub">${t.sub}</span></div>`).join("");

        let content = "";
        if (activeTab === "tasks")   content = _fieldTasks(attr, person, naAttr, card);
        if (activeTab === "store")   content = _supply(attr, person, balance, card);
        if (activeTab === "history") content = _siteLog(person, card);

        const openCount = (attr.tasks_due_today_list || []).filter(t => t.status === "pending").length;

        // Rail only flanks the field-log tab.
        const showRail = activeTab === "tasks";
        const railHTML = showRail
            ? _railPanels({ attr, naAttr, person, balance, weekly, lost, atRisk, openCount,
                            rankIdx, dropThr, gainThr, dateStr })
            : "";

        return `
            <div class="fh-dn-page${kidLarge}">
                <div class="fh-dn-trex-watermark">🦕</div>
                <div class="fh-dn-tape fh-dn-tape-tl"></div>
                <div class="fh-dn-tape fh-dn-tape-tr"></div>
                <div class="fh-dn-tape fh-dn-tape-bl"></div>
                <div class="fh-dn-tape fh-dn-tape-br"></div>

                <div class="fh-dn-title-block">
                    <div class="fh-dn-title-kicker">FIELD AGENT · CODENAME T-REX · DIV. PALEO</div>
                    <div class="fh-dn-title-main">Spencer's Field Log</div>
                    <div class="fh-dn-title-row">
                        <span class="fh-dn-title-date">EXPEDITION LOG · ${dateStr.toUpperCase()}</span>
                        <span class="fh-dn-stamp">approved by HQ</span>
                        <span class="fh-dn-stamp fh-dn-stamp-olive">classified</span>
                    </div>
                </div>

                <div class="fh-dn-tabs">${tabBar}</div>

                <div class="fh-dn-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-dn-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-dn-rail">${railHTML}</aside>` : ""}
                </div>

                <div class="fh-dn-footer"><span>FAMILY HUB · FIELD OPERATIONS</span><span>EXPEDITION LOG · ${dateStr.toUpperCase()}</span></div>
            </div>`;
    },
};

// ---- Rail panels ------------------------------------------------------------

function _railPanels({ attr, naAttr, person, balance, weekly, lost, atRisk, openCount,
                       rankIdx, dropThr, gainThr, dateStr }) {
    return `
        ${_railPanelKPIs(balance, weekly, lost, atRisk, openCount, attr.show_dollar_value ? attr.dollar_value : null)}
        ${htmlRailGoal(attr)}
        ${_railPanelRank(rankIdx, weekly, dropThr, gainThr, person, attr)}
        ${_railPanelStreaks(attr, naAttr, person)}
        ${_railPanelSubs(attr, balance, person.person_id)}
        ${_railPanelFindings(person, naAttr)}`;
}

function _railPanel(label, contentHTML) {
    return `
        <div class="fh-dn-rpanel">
            <div class="fh-dn-rpanel-hdr">// ${label}</div>
            <div class="fh-dn-rpanel-body">${contentHTML}</div>
        </div>`;
}

function _railPanelSubs(attr, balance, personId) {
    const rows = htmlRailSubscriptions(attr.subscriptions, balance, personId);
    return rows ? _railPanel("SUBSCRIPTIONS", rows) : "";
}

function _railPanelKPIs(balance, weekly, lost, atRisk, openCount, dollarValue) {
    const cell = (label, val, unit, sub, subClass = "") => `
        <div class="fh-dn-rkpi">
            <div class="fh-dn-rkpi-lbl">${label}</div>
            <div class="fh-dn-rkpi-val-row">
                <span class="fh-dn-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-dn-rkpi-unit">${unit}</span>` : ""}
            </div>
            ${sub ? `<div class="fh-rkpi-sub ${subClass}">${escHTML(sub)}</div>` : ""}
        </div>`;
    const body = `
        <div class="fh-dn-rkpi-row">
            ${cell("FOSSILS",   fPts(balance), "pts", dollarValue != null ? fUSD(dollarValue) : null)}
            ${cell("THIS WEEK", `+${weekly}`,  "pts", lost > 0 ? `−${lost} lost` : "0 lost", "fh-rkpi-sub--loss")}
            ${cell("SPECIMENS", openCount,     "open", atRisk > 0 ? `−${atRisk} at risk` : null, "fh-rkpi-sub--loss")}
        </div>`;
    return _railPanel("FIELD KIT · TODAY", body);
}

function _railPanelRank(rankIdx, weekly, dropThr, gainThr, person, attr) {
    const bar    = htmlRankBar(rankIdx, weekly, dropThr, gainThr, DINOS_RANKS, DN.amber, person);
    const streak = htmlSuccessStreak(person, DN.amber);
    const freeze = htmlStreakFreezeChip(attr);
    if (!bar) {
        return _railPanel("DIG STATUS",
            `<div class="fh-dn-rmax">${escHTML(getEffectiveRank(rankIdx, DINOS_RANKS).name)} · MAX</div>${streak}${freeze}`);
    }
    return _railPanel("DIG STATUS", bar + streak + freeze);
}

function _railPanelStreaks(attr, naAttr, person) {
    const active = getActiveStreaks(attr, naAttr, person, 8);
    if (!active.length) {
        return _railPanel("FOSSIL RECORD",
            `<div class="fh-dn-rempty">NO STREAKS LOGGED — DIG IN</div>`);
    }

    const rows = active.map(t => {
        const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
        const prints = Array.from({ length: goalSegs }, (_, i) =>
            `<span class="fh-dn-footprint${i < filledN ? "" : " dim"}">🦶</span>`
        ).join("");

        const bonusChip = (t.milestone > 0 && t.bonus > 0)
            ? `<span class="fh-dn-rbonus">★+${t.bonus}</span>` : "";

        return `
            <div class="fh-dn-rstreak">
                <div class="fh-dn-rstreak-head">
                    <span class="fh-dn-rstreak-name">${escHTML(t.name)}</span>
                    ${bonusChip}
                </div>
                <div class="fh-dn-rstreak-bar">
                    <span class="fh-dn-footprints">${prints}</span>
                    <span class="fh-dn-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
    }).join("");

    return _railPanel("FOSSIL RECORD", rows);
}

function _railPanelFindings(person, naAttr) {
    const entries = (naAttr.history_log || [])
        .filter(e => e.person_id === person.person_id && (e.points_delta || 0) > 0)
        .slice(0, 4);

    if (!entries.length) {
        return _railPanel("RECENT FINDINGS",
            `<div class="fh-dn-rempty">NO FINDINGS YET — FILE FIRST SPECIMEN</div>`);
    }

    const rows = entries.map((e, i) => {
        const padNum = String(i + 1).padStart(3, "0");
        const when   = e.timestamp ? relTime(e.timestamp) : "";
        return `
            <div class="fh-dn-rfind">
                <div class="fh-dn-rfind-tag">SP-${padNum} · FILED ${escHTML(when.toUpperCase())}</div>
                <div class="fh-dn-rfind-row">
                    <span class="fh-dn-rfind-name">${escHTML(e.chore_name || e.note || "—")}</span>
                    <span class="fh-dn-rfind-pts">+${e.points_delta}pts</span>
                </div>
            </div>`;
    }).join("");

    return _railPanel("RECENT FINDINGS", rows);
}

// ---- Field Tasks tab --------------------------------------------------------

function _fieldTasks(attr, person, naAttr, card) {
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
        return `<div class="fh-dn-empty">◉ SITE CLEAR — ALL SPECIMENS LOGGED</div>`;
    }

    let spIdx = 0;
    const groups = groupByCategory(all, catOrder);
    const groupHtml = groups.map(group => {
        const hdr = `<div class="fh-row-section-hdr">${escHTML(group.label)}</div>`;
        const cards = group.tasks.map(t => htmlChoreRow(t, dinosRowConfig, person, card, { index: ++spIdx })).join("");
        return hdr + cards;
    }).join("");

    const pendingSection = pending.length ? `
        <div class="fh-row-section-hdr">AWAITING APPROVAL</div>
        ${pending.map(t => htmlChoreRow(t, dinosRowConfig, person, card)).join("")}` : "";

    return `
        ${htmlDailyProgress(attr)}
        <div class="fh-row-list">
            ${groupHtml}
            ${pendingSection}
        </div>`;
}

// ---- Supply Cache (store) tab -----------------------------------------------

function _supply(attr, person, balance, card) {
    const items = attr.store_items || [];
    if (!items.length) return `<div class="fh-dn-empty">SUPPLY CACHE EMPTY</div>`;

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
        <div class="fh-dn-supply">
            ${items.map(item => {
                const isGroup        = !!item.is_group_reward;
                const isSubscription = item.item_type === "subscription";
                const isSubscribed   = isSubscription && activeSubs.has(item.item_id);
                const can            = balance >= item.points_cost;
                const requested      = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
                const blocked        = !!item.next_available;
                const pLbl           = { weekly:"wk", monthly:"mo", quarterly:"qtr", biannual:"6mo", annual:"yr" }[item.subscription_period] || "mo";
                return `
                <div class="fh-dn-supply-item">
                    ${storeItemIcon(item)}
                    <div class="fh-dn-supply-body">
                        <div class="fh-dn-supply-name">${escHTML(item.name)}</div>
                        ${item.description ? `<div class="fh-dn-supply-desc">${escHTML(item.description)}</div>` : ""}
                        ${htmlStoreItemLimit(item)}
                        ${htmlGroupContributorBars(item, person.person_id)}
                    </div>
                    ${isGroup ? "" : `<div class="fh-dn-pts-tag" style="color:${DN.amber}">${fPts(item.points_cost)}pts</div>`}
                    ${htmlGoalToggleBtn(item, attr, person.person_id)}
                    ${isGroup
                        ? htmlChipInBtn(item, person.person_id, balance)
                        : isSubscription
                        ? isSubscribed
                            ? `<span style="color:${DN.amber};font-size:.8rem;font-weight:700">SUBSCRIBED ✓</span>`
                            : requested
                            ? `<span style="color:${DN.amber};font-size:.8rem;font-weight:700">REQUESTED ✓</span>`
                            : `<button class="fh-dn-go-btn ${can ? "" : "disabled"}"
                                       data-act="redeem"
                                       data-iid="${escAttr(item.item_id)}"
                                       data-pid="${escAttr(person.person_id)}"
                                       ${!can ? 'disabled style="opacity:.4;cursor:not-allowed"' : ""}>
                                   ${can ? `SUBSCRIBE · ${item.points_cost}/${pLbl}` : "NEED MORE"}
                               </button>`
                        : requested
                        ? `<span style="color:${DN.amber};font-size:.8rem;font-weight:700">CLAIMED ✓</span>`
                        : blocked
                        ? `<span style="color:var(--fh-overdue);font-size:.75rem;font-weight:600">NOT AVAILABLE</span>`
                        : `<button class="fh-dn-go-btn ${can ? "" : "disabled"}"
                                   data-act="redeem" data-iid="${escAttr(item.item_id)}" data-pid="${escAttr(person.person_id)}"
                                   ${!can ? 'disabled style="opacity:.4;cursor:not-allowed"' : ""}>
                               ${can ? "CLAIM" : "NEED MORE"}
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

// ---- Site Log (history) tab -------------------------------------------------

function _siteLog(person, card) {
    const naAttr  = card._attrs("sensor.family_hub_needs_attention");
    const entries = (naAttr.history_log || []).filter(e => e.person_id === person.person_id);
    if (!entries.length) return `<div class="fh-dn-empty">NO ENTRIES IN SITE LOG YET</div>`;

    const grouped = groupHistorySkipped(entries);
    return `
        <div class="fh-dn-log">
            ${grouped.slice(0, 15).map(item =>
                item.isGroup ? _dnSkippedGroup(item, card) : _dnLogRow(item.entry)
            ).join("")}
        </div>`;
}

function _dnLogRow(e) {
    const meta = HISTORY_META[e.type] || { label: e.type, color: DN.mute };
    const pts  = e.points_delta
        ? `<span style="color:${e.points_delta > 0 ? DN.amber : DN.red};font-weight:700">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>` : "";
    return `
        <div class="fh-dn-log-row">
            <div class="fh-dn-log-type" style="color:${meta.color}">${escHTML(meta.label)}</div>
            <div class="fh-dn-log-name">${escHTML(e.chore_name || e.note || "—")}</div>
            ${pts}
        </div>`;
}

function _dnSkippedGroup(group, card) {
    const expanded = card._expandedSkippedDates.has(group.key);
    const pen      = group.totalPenalty > 0 ? `−${group.totalPenalty}pts` : "no penalty";
    return `
        <div class="fh-dn-log-row"
             data-act="toggle-skipped-group" data-key="${escAttr(group.key)}" style="cursor:pointer">
            <div class="fh-dn-log-type" style="color:${DN.red}">SKIPPED</div>
            <div class="fh-dn-log-name">${escHTML(group.dateDisplay)} · ${pen}</div>
            <span style="color:${DN.mute};font-size:.75rem">${expanded ? "▲" : "▼"}</span>
        </div>
        ${expanded ? group.items.map(e => `
            <div class="fh-dn-log-row" style="padding-left:20px;opacity:.75">
                <div class="fh-dn-log-type" style="color:${DN.mute}">ITEM</div>
                <div class="fh-dn-log-name">${escHTML(e.chore_name || "")}</div>
                ${e.points_delta ? `<span style="color:${DN.red};font-weight:700">${e.points_delta}pts</span>` : ""}
            </div>`).join("") : ""}`;
}

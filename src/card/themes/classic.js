/**
 * Family Hub Card — Classic Theme
 *
 * Default personal-page experience. Fallback for anyone with no theme_key set.
 * Dark panel, person's avatar color as accent, compact task list with rank bar.
 *
 * S8: optional right rail (KPIs, streak constellation, pending approvals,
 * recent wins). Hidden below 900px viewport.
 */

import { DEFAULT_COLOR, FLASH_MS, HISTORY_META, WEEKDAY_LABELS } from "../constants.js";
import { I } from "../constants.js";
import { escHTML, escAttr, ini, fPts, fUSD, cap, relTime, groupHistorySkipped } from "../utils.js";
import { getEffectiveRank, getWeeklyPts, htmlRankBar, htmlSuccessStreak,
         getActiveStreaks, computeStreakProgress,
         htmlChoreRow, htmlAddReminderCTA,
         htmlGoalBanner, htmlGoalToggleBtn, storeItemIcon,
         htmlStoreItemLimit,
         htmlStreakFreezeChip, htmlDailyProgress,
         htmlGroupContributorBars, htmlChipInBtn, htmlGroupProposalBanner,
         htmlSubscriptionRail, htmlRailSubscriptions, htmlStoreRailContent } from "./_shared.js";

const CLASSIC_RANKS = [
    { minXP: 0,    name: "Level 1" },
    { minXP: 100,  name: "Level 2" },
    { minXP: 250,  name: "Level 3" },
    { minXP: 500,  name: "Level 4" },
    { minXP: 1000, name: "Level 5" },
    { minXP: 2000, name: "Level 6" },
    { minXP: 3500, name: "Level 7" },
];

const KID_PALETTE = {
    bg:        "#2B3A4F", bgLo:    "#1A2538",
    accent:    "#4A90E2", accentHi:"#5BA0F2", accentLo:"#2E6BB0",
    ink:       "#0F1924", white:   "#FFFFFF",
    yellow:    "#FFD54A", red:     "#E85A5A",
};

export const classicTheme = {
    key:               "classic",
    tint:              "#1A2538",
    sigil:             "◇",
    ranks:             CLASSIC_RANKS,
    handlesNavigation: false,

    rankTitle(rankIndex) {
        return getEffectiveRank(rankIndex, CLASSIC_RANKS).name;
    },

    homeTileSubLabel(person) {
        return person.person_type === "parent" ? "HANDLER" : "FIELD AGENT";
    },

    render(card, person) {
        const kidLarge = person.child_mode ? " kid-large" : "";
        const eid      = card._personEntityId(person.name);
        const attr     = card._attrs(eid);
        const naAttr   = card._attrs("sensor.family_hub_needs_attention");
        const balance  = parseInt(card._states(eid)?.state || "0");
        const color    = person.avatar_color || DEFAULT_COLOR;
        const rankIdx  = person.rank_index !== undefined ? person.rank_index : 0;
        const dropThr  = person.rank_drop_threshold ?? naAttr.rank_drop_threshold ?? 50;
        const gainThr  = person.rank_gain_threshold ?? naAttr.rank_gain_threshold ?? 75;
        const weekly   = getWeeklyPts(person.person_id, naAttr.history_log);

        const tabBar = [
            { key: "tasks",   label: "Tasks"   },
            { key: "store",   label: "Store"   },
            { key: "history", label: "History" },
        ].map(t => `
            <div class="fh-tab ${card._tab === t.key ? "active" : ""}"
                 data-act="tab" data-tab="${t.key}">${t.label}</div>`).join("");

        let content = "";
        if (card._tab === "tasks")   content = _tasks(attr, color, person, card);
        if (card._tab === "store")   content = _store(attr, color, person, balance, card);
        if (card._tab === "history") content = _history(person, card);

        const openCount = (attr.tasks_due_today_list || []).filter(t => t.status === "pending").length;
        const pendingCount = (attr.tasks_pending_approval_list || []).length;

        const showRail = card._tab === "tasks";
        const railHTML = showRail
            ? _railPanels({ attr, naAttr, person, balance, weekly, openCount,
                            pendingCount, rankIdx, dropThr, gainThr, color })
            : "";

        return `
            <div class="fh-classic-page${kidLarge}">
                <div class="fh-person-header" style="border-left:4px solid ${color}">
                    <div class="fh-avatar" style="background:${color};width:46px;height:46px;font-size:1.1rem">
                        ${ini(person.name)}
                    </div>
                    <div style="flex:1;min-width:0">
                        <div style="font-size:.9rem;color:var(--fh-text-sec);font-weight:600">${escHTML(person.name)}</div>
                        <div class="fh-balance" style="color:${color}">
                            ${fPts(balance)}<span class="fh-balance-unit">pts</span>
                        </div>
                        ${attr.show_dollar_value ? `<div class="fh-dollar">${fUSD(attr.dollar_value)}</div>` : ""}
                    </div>
                </div>
                <div class="fh-tabs">${tabBar}</div>
                <div class="fh-classic-body ${showRail ? "has-rail" : ""}">
                    <div class="fh-classic-body-main">${content}</div>
                    ${showRail ? `<aside class="fh-classic-rail">${railHTML}</aside>` : ""}
                </div>
            </div>`;
    },
};

// ---------------------------------------------------------------------------
// Rail panels
// ---------------------------------------------------------------------------

function _railPanels({ attr, naAttr, person, balance, weekly, openCount,
                       pendingCount, rankIdx, dropThr, gainThr, color }) {
    return `
        ${_railPanelKPIs(balance, weekly, openCount, pendingCount)}
        ${_railPanelRank(rankIdx, weekly, dropThr, gainThr, color, person, attr)}
        ${_railPanelStreaks(attr, naAttr, person, color)}
        ${_railPanelSubs(attr, balance, person.person_id)}
        ${_railPanelRecent(person, naAttr, color)}`;
}

function _railPanel(label, contentHTML) {
    return `
        <div class="fh-classic-rpanel">
            <div class="fh-classic-rpanel-hdr">${label}</div>
            <div class="fh-classic-rpanel-body">${contentHTML}</div>
        </div>`;
}

function _railPanelSubs(attr, balance, personId) {
    const rows = htmlRailSubscriptions(attr.subscriptions, balance, personId);
    return rows ? _railPanel("SUBSCRIPTIONS", rows) : "";
}

function _railPanelKPIs(balance, weekly, openCount, pendingCount) {
    const cell = (label, val, unit) => `
        <div class="fh-classic-rkpi">
            <div class="fh-classic-rkpi-lbl">${label}</div>
            <div class="fh-classic-rkpi-val-row">
                <span class="fh-classic-rkpi-val">${escHTML(String(val))}</span>
                ${unit ? `<span class="fh-classic-rkpi-unit">${unit}</span>` : ""}
            </div>
        </div>`;
    const body = `
        <div class="fh-classic-rkpi-row">
            ${cell("BALANCE",  fPts(balance), "pts")}
            ${cell("WEEK",     `+${weekly}`,  "pts")}
            ${cell("OPEN",     openCount,     "")}
            ${cell("PENDING",  pendingCount,  "")}
        </div>`;
    return _railPanel("OVERVIEW", body);
}

function _railPanelRank(rankIdx, weekly, dropThr, gainThr, color, person, attr) {
    const bar    = htmlRankBar(rankIdx, weekly, dropThr, gainThr, CLASSIC_RANKS, color);
    const streak = htmlSuccessStreak(person, color);
    const freeze = htmlStreakFreezeChip(attr);
    if (!bar) {
        return _railPanel("RANK",
            `<div class="fh-classic-rmax">${escHTML(getEffectiveRank(rankIdx, CLASSIC_RANKS).name)} · max</div>${streak}${freeze}`);
    }
    return _railPanel("RANK", bar + streak + freeze);
}

function _railPanelStreaks(attr, naAttr, person, color) {
    const active = getActiveStreaks(attr, naAttr, person, 8);
    if (!active.length) {
        return _railPanel("STREAKS",
            `<div class="fh-classic-rempty">No active streaks yet</div>`);
    }

    const rows = active.map(t => {
        const { goalSegs, filledN, countLbl } = computeStreakProgress(t.streak, t.milestone, 10);
        const segs = Array.from({ length: goalSegs }, (_, i) =>
            `<span class="fh-classic-rseg${i < filledN ? " filled" : ""}" style="${i < filledN ? `background:${color}` : ""}"></span>`
        ).join("");

        const bonusChip = (t.milestone > 0 && t.bonus > 0)
            ? `<span class="fh-classic-rbonus">★+${t.bonus}</span>` : "";

        return `
            <div class="fh-classic-rstreak">
                <div class="fh-classic-rstreak-head">
                    <span class="fh-classic-rstreak-name">${escHTML(t.name)}</span>
                    ${bonusChip}
                </div>
                <div class="fh-classic-rstreak-bar">
                    <span class="fh-classic-rsegs">${segs}</span>
                    <span class="fh-classic-rstreak-num">${countLbl}</span>
                </div>
            </div>`;
    }).join("");

    return _railPanel("STREAKS", rows);
}

function _railPanelRecent(person, naAttr, color) {
    const entries = (naAttr.history_log || [])
        .filter(e => e.person_id === person.person_id && (e.points_delta || 0) > 0)
        .slice(0, 4);

    if (!entries.length) {
        return _railPanel("RECENT WINS",
            `<div class="fh-classic-rempty">No wins logged yet</div>`);
    }

    const rows = entries.map(e => {
        const when = e.timestamp ? relTime(e.timestamp) : "";
        return `
            <div class="fh-classic-rwin">
                <div class="fh-classic-rwin-when">${escHTML(when)}</div>
                <div class="fh-classic-rwin-row">
                    <span class="fh-classic-rwin-name">${escHTML(e.chore_name || e.note || "—")}</span>
                    <span class="fh-classic-rwin-pts" style="color:${color}">+${e.points_delta}</span>
                </div>
            </div>`;
    }).join("");

    return _railPanel("RECENT WINS", rows);
}

// ---------------------------------------------------------------------------
// Tasks tab
// ---------------------------------------------------------------------------

function _tasks(attr, color, person, card) {
    const rawDue     = attr.tasks_due_today_list        || [];
    const rawOverdue = attr.tasks_overdue_list          || [];
    const pending    = attr.tasks_pending_approval_list || [];

    const collapseByChore = (rows, pickFn) => {
        const seen = new Map();
        for (const t of rows) {
            const key = t.chore_id;
            if (!seen.has(key) || pickFn(t, seen.get(key))) seen.set(key, t);
        }
        return [...seen.values()];
    };
    const overdue = collapseByChore(rawOverdue, (a, b) => (a.days_overdue || 0) > (b.days_overdue || 0));
    const allDue  = collapseByChore(rawDue, () => false);

    const isReminderTask = t => t.chore_type === "reminder";
    const dueReminders   = allDue.filter(t =>  isReminderTask(t));
    const due            = allDue.filter(t => !isReminderTask(t));

    const naAttr        = card._attrs("sensor.family_hub_needs_attention");
    const orderedLabels = naAttr.category_labels || [];
    const labelIndex    = new Map(orderedLabels.map((l, i) => [l, i]));

    const groups = new Map();
    for (const t of due) {
        const key = t.category_label || "Today";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(t);
    }

    const sortedGroupKeys = [...groups.keys()].sort((a, b) => {
        const aIsToday = a === "Today", bIsToday = b === "Today";
        if (aIsToday && !bIsToday) return 1;
        if (!aIsToday && bIsToday) return -1;
        const ai = labelIndex.has(a) ? labelIndex.get(a) : Infinity;
        const bi = labelIndex.has(b) ? labelIndex.get(b) : Infinity;
        if (ai !== bi) return ai - bi;
        return a.localeCompare(b);
    });

    const classicRowConfig = {
        themeKey:        "classic",
        btnLabel:        "✓",
        btnPendingLabel: "Pending Approval",
        reminderBtnLabel:"Done",
        streakIcon:      "🔥",
        statusFormat: {
            breach:    t => `${t.days_overdue}d late`,
            resetSoon: t => {
                const rType = t.recurrence_type;
                const dur   = t.days_until_reset;
                if (dur === 0) return "Resets today";
                if (dur === 1) return "Resets tomorrow";
                if (rType === "weekly" && t.recurrence_weekdays?.length) {
                    return `Resets ${t.recurrence_weekdays.map(d => WEEKDAY_LABELS[d]).join("/")}`;
                }
                return `Resets in ${dur}d`;
            },
            firing:    t => `-${t.penalty_points}pts/day`,
            expiry:    d => d <= 0 ? "Expires today" : `Expires in ${d}d`,
        },
        iconColor:       () => color,
    };

    const renderRow = (t, isOverdue) => {
        const taggedTask = isOverdue ? { ...t, _over: true } : t;
        return htmlChoreRow(taggedTask, classicRowConfig, person, card);
    };

    const dueSection = sortedGroupKeys.map(label => `
        <div class="fh-row-section-hdr">${escHTML(label)}</div>
        ${(groups.get(label) || []).map(t => renderRow(t, false)).join("")}`).join("");

    const reminderSection = dueReminders.length ? `
        <div class="fh-row-section-hdr">Reminders</div>
        ${dueReminders.map(t => renderRow(t, false)).join("")}` : "";

    const empty = !due.length && !overdue.length && !pending.length && !dueReminders.length;

    return `
        ${htmlDailyProgress(attr)}
        ${htmlAddReminderCTA(person)}
        <div class="fh-row-list" style="--row-color:${color}">
            ${overdue.length ? overdue.map(t => renderRow(t, true)).join("") : ""}
            ${dueSection}
            ${reminderSection}
            ${pending.length ? `
                <div class="fh-row-section-hdr">Awaiting approval</div>
                ${pending.map(t => htmlChoreRow(t, classicRowConfig, person, card)).join("")}` : ""}
        </div>
        ${empty ? '<div class="fh-empty">Nothing due — nice work!</div>' : ""}`;
}

// ---------------------------------------------------------------------------
// Store tab
// ---------------------------------------------------------------------------

function _store(attr, color, person, balance, card) {
    const items = attr.store_items || [];
    if (!items.length) return `<div class="fh-empty">No rewards in the store yet.</div>`;

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
        <div class="fh-store-grid">
            ${items.map(item => {
                const isGroup        = !!item.is_group_reward;
                const isSubscription = item.item_type === "subscription";
                const isSubscribed   = isSubscription && activeSubs.has(item.item_id);
                const can            = balance >= item.points_cost;
                const requested      = pendingByItemId.has(item.item_id) || pendingByName.has(item.name);
                const blocked        = !!item.next_available;
                const pLbl           = { weekly:"wk", monthly:"mo", quarterly:"qtr", biannual:"6mo", annual:"yr" }[item.subscription_period] || "mo";
                return `
                <div class="fh-store-item">
                    <div class="fh-store-item-head">
                        ${storeItemIcon(item)}
                        <div class="fh-store-name">${escHTML(item.name)}</div>
                        ${htmlGoalToggleBtn(item, attr, person.person_id)}
                    </div>
                    ${item.description ? `<div class="fh-store-desc">${escHTML(item.description)}</div>` : ""}
                    ${htmlStoreItemLimit(item)}
                    ${htmlGroupContributorBars(item, person.person_id)}
                    ${isGroup
                        ? htmlChipInBtn(item, person.person_id, balance)
                        : isSubscription
                        ? isSubscribed
                            ? `<span class="fh-badge fh-badge-subscribed">Subscribed ✓</span>`
                            : requested
                            ? `<span class="fh-badge fh-badge-requested" style="text-align:center">Requested ✓</span>`
                            : `<button class="fh-btn fh-btn-sm ${can ? "fh-btn-primary" : "fh-btn-ghost"}"
                                       style="${can ? `background:${color}` : ""}"
                                       data-act="redeem"
                                       data-iid="${escAttr(item.item_id)}"
                                       data-pid="${escAttr(person.person_id)}"
                                       ${can ? "" : "disabled"}>
                                   ${can ? `Subscribe · ${item.points_cost}pts/${pLbl}` : "Need more pts"}
                               </button>`
                        : `<div class="fh-store-price" style="color:${color}">${fPts(item.points_cost)}pts</div>
                           ${requested
                               ? `<span class="fh-badge fh-badge-requested" style="text-align:center">Requested ✓</span>`
                               : blocked
                               ? `<button class="fh-btn fh-btn-sm fh-btn-ghost" disabled style="opacity:.5;cursor:not-allowed">Not available</button>`
                               : `<button class="fh-btn fh-btn-sm ${can ? "fh-btn-primary" : "fh-btn-ghost"}"
                                          style="${can ? `background:${color}` : ""}"
                                          data-act="redeem" data-iid="${item.item_id}" data-pid="${person.person_id}"
                                          ${can ? "" : "disabled"}>
                                      ${can ? "Request" : "Need more pts"}
                                  </button>`}`}
                </div>`;
            }).join("")}
        </div>
        </div>
        <div class="fh-store-rail-panel">
            ${htmlStoreRailContent(attr.subscriptions, balance, naAttr.history_log, person.person_id)}
        </div>
        </div>`;
}

// ---------------------------------------------------------------------------
// History tab
// ---------------------------------------------------------------------------

function _history(person, card) {
    const naAttr  = card._attrs("sensor.family_hub_needs_attention");
    const entries = (naAttr.history_log || []).filter(e => e.person_id === person.person_id);
    if (!entries.length) return `<div class="fh-empty">No history yet.</div>`;

    const grouped = groupHistorySkipped(entries);
    const rows = grouped.map(item =>
        item.isGroup ? _skippedGroup(item, card) : _histRow(item.entry)
    ).join("");

    return `<div class="fh-hist-scroll">${rows}</div>`;
}

function _histRow(e) {
    const meta     = HISTORY_META[e.type] || { label: e.type, color: "var(--fh-text-sec)" };
    const ptsDelta = e.points_delta
        ? `<span style="color:${e.points_delta > 0 ? "var(--fh-success)" : "var(--fh-overdue)"}">
               ${e.points_delta > 0 ? "+" : ""}${e.points_delta}pts
           </span>` : "";
    return `
        <div class="fh-hist-row" style="--hist-color:${meta.color}">
            <div class="fh-hist-info">
                <div class="fh-hist-label">${escHTML(meta.label)}</div>
                <div class="fh-hist-name">${escHTML(e.chore_name || e.note || "")}</div>
                <div class="fh-hist-meta">${relTime(e.timestamp)} ${ptsDelta}</div>
            </div>
        </div>`;
}

function _skippedGroup(group, card) {
    const expanded = card._expandedSkippedDates.has(group.key);
    const penLabel = group.totalPenalty > 0 ? `−${group.totalPenalty}pts` : "no penalty";

    const subItems = expanded ? group.items.map(e => {
        const pts = e.points_delta
            ? `<span style="color:var(--fh-overdue);font-weight:700">${e.points_delta}pts</span>` : "";
        return `
            <div class="fh-hist-subrow">
                <div class="fh-hist-info" style="flex:1;min-width:0">
                    <div class="fh-hist-name">${escHTML(e.chore_name || "")}</div>
                    <div class="fh-hist-meta">${pts}</div>
                </div>
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

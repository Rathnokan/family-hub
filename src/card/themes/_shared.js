/**
 * Family Hub Card — Theme Shared Primitives
 *
 * Rank utilities shared by all theme renderers.
 *
 * Rank mechanic (v0.6.0 S5):
 *   - rank_index is stored per person in the backend and adjusted every Monday.
 *   - <drop_threshold pts/week  → rank drops one level  (floor: 0)
 *   - drop_threshold–gain_threshold → rank holds
 *   - >=gain_threshold pts/week → rank rises one level  (no ceiling in backend; themes clamp)
 *   - Parents: rank_index = 999 → always display at last rank in their ladder.
 */

import { choreIcon } from "../icons.js";
import { escHTML, escAttr } from "../utils.js";

// ---------------------------------------------------------------------------
// Rank ladder helpers (rank_index based)
// ---------------------------------------------------------------------------

/**
 * Return the rank object for the given stored rank_index.
 * Clamps to [0, ranks.length - 1] so out-of-range values (e.g. 999 for parents)
 * always resolve to the max rank without throwing.
 */
export function getEffectiveRank(rankIndex, ranks) {
    const idx = Math.min(Math.max(0, rankIndex), ranks.length - 1);
    return ranks[idx];
}

/**
 * Return the next rank object above the current index, or null if at max.
 */
export function getNextRankByIndex(rankIndex, ranks) {
    const nextIdx = Math.min(rankIndex + 1, ranks.length - 1);
    if (nextIdx === rankIndex || rankIndex >= ranks.length - 1) return null;
    return ranks[nextIdx];
}

// ---------------------------------------------------------------------------
// Weekly points helper
// ---------------------------------------------------------------------------

/**
 * Sum positive points_delta for a person from the most recent Monday 00:00
 * local time through now.  Uses the history_log already present in the
 * needs_attention sensor — no extra fetch needed.
 */
export function getWeeklyPts(personId, historyLog) {
    const now = new Date();
    const dow = now.getDay();                        // 0=Sun, 1=Mon … 6=Sat
    const daysSinceMon = dow === 0 ? 6 : dow - 1;  // days since last Monday
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - daysSinceMon);

    return (historyLog || [])
        .filter(e =>
            e.person_id === personId &&
            (e.points_delta || 0) > 0 &&
            new Date(e.timestamp) >= monday
        )
        .reduce((sum, e) => sum + (e.points_delta || 0), 0);
}

// ---------------------------------------------------------------------------
// Rank bar renderer
// ---------------------------------------------------------------------------

/**
 * Render a weekly rank progress bar row.
 *
 *   [Rank name] [===|---] [N pts · holds / +1 rank / −1 rank]
 *
 * The track spans 0 → gainThreshold (100%).
 * A tick mark at dropThreshold shows the danger-zone boundary.
 * Fill color:
 *   - red   when pts < dropThreshold
 *   - amber when dropThreshold ≤ pts < gainThreshold
 *   - theme accent when pts ≥ gainThreshold
 *
 * Parents (rank_index ≥ 999) skip the bar entirely.
 */
export function htmlRankBar(rankIndex, weeklyPts, dropThr, gainThr, ranks, color) {
    if (rankIndex >= 999) return "";   // parent — always max, no bar needed

    const current  = getEffectiveRank(rankIndex, ranks);
    const barMax   = Math.max(gainThr, 1);
    const fillPct  = Math.min(100, Math.round(weeklyPts / barMax * 100));
    const dropPct  = Math.min(99, Math.round(dropThr / barMax * 100));

    let fillColor, statusText;
    if (weeklyPts >= gainThr) {
        fillColor  = color;
        statusText = `${weeklyPts}pts · +1 rank`;
    } else if (weeklyPts < dropThr) {
        fillColor  = "#E07A4C";
        statusText = `${weeklyPts}pts · −1 rank`;
    } else {
        fillColor  = "#E0B84C";
        statusText = `${weeklyPts}pts · holds`;
    }

    return `
        <div class="fh-rank-bar-row">
            <span class="fh-rank-bar-label" style="color:${color}">${escHTML(current.name)}</span>
            <span class="fh-rank-bar-track">
                <span class="fh-rank-bar-fill" style="width:${fillPct}%;background:${fillColor}"></span>
                <span class="fh-rank-bar-drop" style="left:${dropPct}%"></span>
            </span>
            <span class="fh-rank-bar-status">${escHTML(statusText)}</span>
        </div>`;
}

// ---------------------------------------------------------------------------
// Success-rate streak line (v0.6.1)
// ---------------------------------------------------------------------------

/**
 * Render a single success-rate streak line for the rank/streaks rail panel.
 * Only renders when the feature is enabled for this person AND the person
 * has an active streak (count > 0). Otherwise returns empty string so themes
 * can drop it in unconditionally without checking visibility themselves.
 *
 *   🔥 7d streak · 80% target
 *
 * Themes can override the `.fh-success-streak` class for per-theme styling.
 */
export function htmlSuccessStreak(person, accentColor) {
    if (!person) return "";
    const milestone = person.completion_milestone || 0;
    const streak    = person.completion_streak || 0;
    if (milestone <= 0 || streak <= 0) return "";
    const threshold = person.completion_threshold_pct || 80;
    const tone = accentColor || "#F8D38A";
    return `
        <div class="fh-success-streak" style="--ss-tone:${tone}">
            <span class="fh-success-streak-icon">🔥</span>
            <span class="fh-success-streak-val">${streak}d streak</span>
            <span class="fh-success-streak-sep">·</span>
            <span class="fh-success-streak-target">${threshold}% target</span>
        </div>`;
}

// ---------------------------------------------------------------------------
// Streak rail data helper (S8 — used by all themed personal pages)
// ---------------------------------------------------------------------------

/**
 * Return up to `max` active streaks for a person, ordered by streak count desc.
 *
 * Unions two sources:
 *   (1) naAttr.people[].streaks dict — authoritative per-chore streak count for
 *       every chore the person has ever streaked on, regardless of whether the
 *       chore is currently scheduled.
 *   (2) task row .streak fields on tasks_due_today / overdue / pending_approval
 *       — covers any chore the dict hasn't yet seen (lazy population).
 *
 * Each returned row:
 *   { chore_id, name, streak, milestone, bonus, chore }
 *
 * The `chore` object (from active_chores) carries the streak_milestone and
 * streak_bonus_points used by the theme renderer for rolling-milestone display.
 * If no active_chores entry is found, milestone/bonus are 0 and name falls back
 * to a task-row name or "(retired)".
 */
export function getActiveStreaks(attr, naAttr, person, max = 8) {
    const choreById = new Map(
        (naAttr.active_chores || []).map(c => [c.chore_id, c])
    );

    const nameFallback = new Map();
    for (const t of [
        ...(attr.tasks_due_today_list        || []),
        ...(attr.tasks_overdue_list          || []),
        ...(attr.tasks_pending_approval_list || []),
    ]) {
        if (t.chore_id && t.name && !nameFallback.has(t.chore_id)) {
            nameFallback.set(t.chore_id, { name: t.name, streak: t.streak || 0 });
        }
    }

    const personData  = (naAttr.people || []).find(p => p.person_id === person.person_id) || {};
    const streaksDict = personData.streaks || {};

    const merged = new Map();
    for (const [chore_id, s] of Object.entries(streaksDict)) {
        merged.set(chore_id, s.count || 0);
    }
    for (const [chore_id, f] of nameFallback.entries()) {
        const cur = merged.get(chore_id) || 0;
        if (f.streak > cur) merged.set(chore_id, f.streak);
    }

    return [...merged.entries()]
        .map(([chore_id, streak]) => {
            const c    = choreById.get(chore_id);
            const fb   = nameFallback.get(chore_id);
            const name = c?.name || fb?.name || "(retired)";
            return {
                chore_id, name, streak,
                milestone: c?.streak_milestone     || 0,
                bonus:     c?.streak_bonus_points  || 0,
                chore:     c || {},
            };
        })
        .filter(t => t.streak >= 1)
        .sort((a, b) => b.streak - a.streak)
        .slice(0, max);
}

/**
 * Compute rolling-milestone progress for a streak.
 *
 *   milestone=5, streak=23 → { goalSegs:5, filledN:3, countLbl:"23 · next 2" }
 *   milestone=7, streak=14 → { goalSegs:7, filledN:7, countLbl:"14 · next 7" }   (just hit one)
 *   milestone=0, streak=10 → { goalSegs:7, filledN:7, countLbl:"10/7" }          (no milestone — show weekly)
 */
export function computeStreakProgress(streak, milestone, maxSegs = 10) {
    const goalSegs = milestone > 0 ? Math.min(milestone, maxSegs) : 7;
    if (milestone <= 0) {
        // No milestone configured — just show the raw streak count.
        // Bar fills to current streak, capped at goalSegs visually.
        return {
            goalSegs,
            filledN: Math.min(streak, goalSegs),
            countLbl: `${streak}`,
        };
    }
    const progress = streak % milestone;
    const filledN  = (streak > 0 && progress === 0) ? goalSegs : progress;
    const nextIn   = milestone - (progress || milestone);
    return {
        goalSegs,
        filledN,
        countLbl: `${streak} · next ${nextIn}`,
    };
}

// ---------------------------------------------------------------------------
// Category grouping helper (used by all personal-page themes)
// ---------------------------------------------------------------------------

/**
 * Group a flat task array into sections: Overdue first, then remaining tasks
 * grouped by category_label in the admin-defined order.
 *
 * @param {object[]} tasks       - Array of task rows (may include _over:true flag)
 * @param {string[]} catOrder    - Admin-defined category_labels array (from sensor attrs)
 * @returns {{ label:string, tasks:object[], isOverdue:boolean }[]}
 */
export function groupByCategory(tasks, catOrder) {
    const overdue = tasks.filter(t => t._over);
    const due     = tasks.filter(t => !t._over);

    const groups = [];
    if (overdue.length) groups.push({ label: "Overdue", tasks: overdue, isOverdue: true });

    // Build category groups in admin-defined order
    const ordered = (catOrder && catOrder.length)
        ? catOrder
        : [...new Set(due.map(t => t.category_label || ""))];

    const covered = new Set(ordered);
    for (const cat of ordered) {
        const catTasks = due.filter(t => (t.category_label || "") === cat);
        if (catTasks.length) groups.push({ label: cat || "Other", tasks: catTasks, isOverdue: false });
    }

    // Any tasks not covered by the ordered list
    const remainder = due.filter(t => !covered.has(t.category_label || ""));
    if (remainder.length) groups.push({ label: "Other", tasks: remainder, isOverdue: false });

    return groups;
}

// ---------------------------------------------------------------------------
// Shared chore-row component (v0.6.0 S9)
// ---------------------------------------------------------------------------

/**
 * Render a single chore row. Identical DOM across all themes; visual difference
 * comes from `.fh-row--<themeKey>` CSS overrides + the `cfg` config object.
 *
 * Anatomy (every theme):
 *   [lead?] [icon] [body: kicker? / name / desc? / penalty?]
 *           [chips: streak ⟂ status ⟂ firing ⟂ expiry]
 *           [pts]  [btn]
 *
 * @param {object}  t        Task row from the sensor (collapsed/normalized).
 *                           If overdue, caller has already set t._over = true.
 * @param {object}  cfg      Theme's rowConfig — see rowConfig shape below.
 * @param {object}  person   Person record (for data-pid wiring).
 * @param {object}  card     FamilyHubCard instance (for _pendingSubmit lookup).
 * @param {object}  [opts]   { index, rowStyle, rowClass, btnData }
 *   - index    : sequential row number for cornerFormat
 *   - rowStyle : inline `style="..."` payload on the outer row div (e.g. CSS vars)
 *   - rowClass : extra space-separated class names for the outer row div
 *                (Mission Control uses this for the flash animation class)
 *   - btnData  : extra data-* attrs object for the action button (Mission Control
 *                uses this to pass streak/milestone/name for celebration trigger)
 *
 * rowConfig shape:
 *   {
 *     themeKey:        "engineer",
 *     leadFormat?:     (t, idx) => "P1"  | null,        // leading element before icon
 *     kickerFormat?:   (t, idx) => "WO-001 · CAT",      // kicker line above name
 *     btnLabel:        "MARK<br>COMPLETE",
 *     btnIcon?:        "✓",
 *     btnPendingLabel: "PENDING<br>APPROVAL",
 *     btnPendingIcon?: "⏱",
 *     reminderBtnLabel?: "DISMISS",                    // reminder-type override
 *     streakIcon:      "△",                            // ⚡ 🔥 ★ △ varies
 *     statusFormat: {
 *         breach:    (t) => `BREACH · ${t.days_overdue}D`,
 *         resetSoon: (t) => "RESETS 1D",
 *         firing:    (t) => `−${t.penalty_points}/D`,
 *         expiry:    (daysLeft) => daysLeft <= 0 ? "EXPIRES TODAY" : `EXPIRES ${daysLeft}D`,
 *     },
 *     iconColor?:      (t, isOverdue) => "#F2EBD6",
 *   }
 */
export function htmlChoreRow(t, cfg, person, card, opts = {}) {
    const idx         = opts.index;
    const isSubmitted = !!(card && card._pendingSubmit && card._pendingSubmit.has(t.task_id))
                        || t.status === "pending_approval";
    const isOverdue   = !!t._over || !!t._overdue;
    const isReminder  = t.chore_type === "reminder";
    const streak      = t.streak || 0;
    const pts         = t.points || 0;

    // Leading element (P1, etc.) — outside the body column.
    // leadFormat may return null/"" to skip the element entirely for this row.
    const leadVal = (cfg.leadFormat && !isReminder) ? cfg.leadFormat(t, idx) : null;
    const leadHtml = (leadVal != null && leadVal !== "")
        ? `<div class="fh-row-lead">${escHTML(String(leadVal))}</div>` : "";

    // Kicker line (WO-001 · CAT) — inside body, above name.
    const kickerVal = (cfg.kickerFormat && !isReminder) ? cfg.kickerFormat(t, idx) : null;
    const kickerHtml = (kickerVal != null && kickerVal !== "")
        ? `<div class="fh-row-kicker">${escHTML(String(kickerVal))}</div>` : "";

    // Icon — theme can colorize per-task (e.g. red when overdue).
    const iconColor = cfg.iconColor ? cfg.iconColor(t, isOverdue) : undefined;
    const iconHtml  = `<div class="fh-row-icon">${choreIcon(t.icon, iconColor)}</div>`;

    // Body lines.
    const descLine = t.description
        ? `<div class="fh-row-desc">${escHTML(t.description)}</div>` : "";
    const penaltyLine = (!isReminder && t.penalty_enabled && t.penalty_points > 0)
        ? `<div class="fh-row-penalty">−${t.penalty_points}pts if skipped</div>` : "";

    // Chips (streak / status / firing / expiry).
    const chips = [];

    if (streak >= 2 && !isReminder) {
        const ico = cfg.streakIcon || "🔥";
        chips.push(`<span class="fh-row-chip fh-row-chip--streak">${ico} ${streak}</span>`);
    }

    if (isOverdue) {
        const label = cfg.statusFormat && cfg.statusFormat.breach
            ? cfg.statusFormat.breach(t)
            : `BREACH · ${t.days_overdue || 0}D`;
        chips.push(`<span class="fh-row-chip fh-row-chip--breach">${escHTML(label)}</span>`);
    } else if (!isReminder && t.days_until_reset === 1) {
        const label = cfg.statusFormat && cfg.statusFormat.resetSoon
            ? cfg.statusFormat.resetSoon(t)
            : "RESETS 1D";
        chips.push(`<span class="fh-row-chip fh-row-chip--reset">${escHTML(label)}</span>`);
    }

    if (!isReminder && t.daily_penalty_firing) {
        const label = cfg.statusFormat && cfg.statusFormat.firing
            ? cfg.statusFormat.firing(t)
            : `−${t.penalty_points || 0}pts/day`;
        chips.push(`<span class="fh-row-chip fh-row-chip--firing">${escHTML(label)}</span>`);
    }

    if (!isReminder && t.expires_after_days && t.due_date) {
        const expiresOn = new Date(t.due_date);
        expiresOn.setDate(expiresOn.getDate() + t.expires_after_days);
        const today = new Date();
        today.setHours(0, 0, 0, 0); expiresOn.setHours(0, 0, 0, 0);
        const daysLeft = Math.round((expiresOn - today) / 86400000);
        if (daysLeft <= 2) {
            const label = cfg.statusFormat && cfg.statusFormat.expiry
                ? cfg.statusFormat.expiry(daysLeft)
                : (daysLeft <= 0 ? "Expires today" : `Expires in ${daysLeft}d`);
            chips.push(`<span class="fh-row-chip fh-row-chip--expiry">${escHTML(label)}</span>`);
        }
    }

    const chipsHtml = `<div class="fh-row-chips">${chips.join("")}</div>`;

    // Points.
    const ptsHtml = (!isReminder && pts)
        ? `<div class="fh-row-pts">+${pts}</div>`
        : `<div class="fh-row-pts"></div>`;

    // Optional extra data-* attrs on the action button (e.g. Mission Control's
    // streak/milestone/name for celebration trigger).
    const extraBtnData = opts.btnData
        ? Object.entries(opts.btnData).map(([k, v]) =>
            ` data-${k}="${escAttr(String(v ?? ""))}"`).join("")
        : "";

    // Action button (or pending placeholder).
    let btnHtml;
    if (isSubmitted) {
        const lbl = cfg.btnPendingLabel || "Pending<br>Approval";
        const ico = cfg.btnPendingIcon
            ? `<span class="fh-row-btn-icon">${cfg.btnPendingIcon}</span>` : "";
        btnHtml = `<div class="fh-row-btn fh-row-btn--pending" aria-disabled="true">${ico}<span class="fh-row-btn-label">${lbl}</span></div>`;
    } else if (isReminder) {
        const lbl = cfg.reminderBtnLabel || "Dismiss";
        btnHtml = `<button class="fh-row-btn fh-row-btn--reminder"
                           data-act="complete" data-tid="${escAttr(t.task_id)}" data-pid="${escAttr(person.person_id)}"${extraBtnData}>
                       <span class="fh-row-btn-label">${lbl}</span>
                   </button>`;
    } else {
        const lbl = cfg.btnLabel || "Complete";
        const ico = cfg.btnIcon
            ? `<span class="fh-row-btn-icon">${cfg.btnIcon}</span>` : "";
        btnHtml = `<button class="fh-row-btn"
                           data-act="complete" data-tid="${escAttr(t.task_id)}" data-pid="${escAttr(person.person_id)}"${extraBtnData}>
                       ${ico}<span class="fh-row-btn-label">${lbl}</span>
                   </button>`;
    }

    const mods = [
        `fh-row--${cfg.themeKey}`,
        isOverdue   && "overdue",
        isReminder  && "reminder",
        isSubmitted && "submitted",
        opts.rowClass || "",
    ].filter(Boolean).join(" ");

    const styleAttr = opts.rowStyle ? ` style="${opts.rowStyle}"` : "";

    return `
        <div class="fh-row ${mods}"${styleAttr}>
            ${leadHtml}
            ${iconHtml}
            <div class="fh-row-body">
                ${kickerHtml}
                <div class="fh-row-name">${escHTML(t.name)}</div>
                ${descLine}
                ${penaltyLine}
            </div>
            ${chipsHtml}
            ${ptsHtml}
            ${btnHtml}
        </div>`;
}

/**
 * "+ Add reminder" CTA that themes can render above their row list to expose
 * the reminder-creation flow.  Themed via .fh-row-add-reminder + the page's
 * own color (inherits via currentColor).
 */
export function htmlAddReminderCTA(person) {
    return `
        <div class="fh-row-add-reminder-wrap">
            <button class="fh-row-add-reminder"
                    data-act="open-add-reminder" data-pid="${escAttr(person.person_id)}">
                + Add reminder
            </button>
        </div>`;
}


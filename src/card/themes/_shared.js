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
import { escHTML, escAttr, relTime } from "../utils.js";

/**
 * v0.7.3: late make-up "Claim" button for a skipped history entry on a kid's
 * personal History tab. Only renders when the entry is a still-claimable skip
 * (the referenced instance is still STATUS_SKIPPED — not already excused or
 * claimed). Claiming routes to claim_late_task: it always needs parent approval
 * and is partial-eligible. Returns "" otherwise so themes can drop it in
 * unconditionally.
 */
export function htmlLateClaimBtn(entry) {
    if (!entry || entry.type !== "task_skipped") return "";
    if (entry.instance_status !== "skipped") return "";
    if (!entry.reference_id || !entry.person_id) return "";
    return `<button class="fh-btn fh-btn-ghost fh-btn-sm fh-late-claim"
                    data-act="claim-late"
                    data-iid="${escAttr(entry.reference_id)}"
                    data-pid="${escAttr(entry.person_id)}"
                    title="Claim this late — a parent has to approve it">Claim</button>`;
}

// v0.6.3: small wrapper that renders the store-item icon only when one is set.
// Themes call this rather than choreIcon directly so unset items don't get a
// fallback dot mixed into the store list.
export function storeItemIcon(item, size = "28px") {
    if (!item?.icon) return "";
    return `<span class="fh-store-item-icon">${choreIcon(item.icon, null, size)}</span>`;
}

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

/**
 * Resolve the weekly-point {dropThr, gainThr} for a person at their current rank.
 *
 * Mirrors the backend resolution order
 * (streaks_ranks_mixin._effective_rank_thresholds):
 *   1. per-rank array value at the clamped rank index
 *   2. legacy per-person scalar override
 *   3. global setting (carried on the needs_attention attrs)
 *   4. hard default (50 drop / 75 gain)
 *
 * @param {object} person   person record from needs_attention.people
 * @param {object} naAttr   needs_attention attributes (global fallback)
 * @param {number} rankIdx  current rank index
 */
export function effectiveRankThresholds(person, naAttr, rankIdx) {
    const pick = (arr, scalar, globalVal, dflt) => {
        if (Array.isArray(arr) && arr.length) {
            const j = Math.min(Math.max(0, rankIdx | 0), arr.length - 1);
            const v = arr[j];
            if (v !== null && v !== undefined) return v;
        }
        if (scalar !== null && scalar !== undefined) return scalar;
        if (globalVal !== null && globalVal !== undefined) return globalVal;
        return dflt;
    };
    return {
        dropThr: pick(person?.rank_drop_thresholds, person?.rank_drop_threshold, naAttr?.rank_drop_threshold, 50),
        gainThr: pick(person?.rank_gain_thresholds, person?.rank_gain_threshold, naAttr?.rank_gain_threshold, 75),
    };
}

// ---------------------------------------------------------------------------
// Weekly points helper
// ---------------------------------------------------------------------------

/**
 * Start-of-week Date (local 00:00) for the rank window — the most recent
 * occurrence of the configured evaluation weekday. `evalWeekday` uses the
 * server's convention (0 = Mon … 6 = Sun) and defaults to Monday. This mirrors
 * the backend's trailing-week window so the bar's "this week" lines up with what
 * the weekly rank evaluation will actually judge.
 */
function rankWeekStart(evalWeekday = 0) {
    const now = new Date();
    const dow = now.getDay();                  // 0=Sun … 6=Sat
    const jsAnchor  = (evalWeekday + 1) % 7;    // server 0=Mon → js 1=Mon
    const daysSince = (dow - jsAnchor + 7) % 7;
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - daysSince);
    return start;
}

/**
 * Sum positive points_delta for a person from the start of the current rank week
 * (the most recent eval weekday, 00:00 local) through now. Uses the history_log
 * already present in the needs_attention sensor — no extra fetch needed.
 */
export function getWeeklyPts(personId, historyLog, evalWeekday = 0) {
    const start = rankWeekStart(evalWeekday);
    return (historyLog || [])
        .filter(e =>
            e.person_id === personId &&
            (e.points_delta || 0) > 0 &&
            new Date(e.timestamp) >= start
        )
        .reduce((sum, e) => sum + (e.points_delta || 0), 0);
}

/**
 * Sum points LOST to skipped/missed-chore penalties for a person from the start
 * of the current rank week through now. Counterpart to getWeeklyPts.
 *
 * Only `task_skipped` deductions count — these are the end-of-cycle, daily, and
 * expiry penalties the tick applies when a chore isn't completed. Spending on
 * rewards/subscriptions is deliberate, not "lost", so it is excluded.
 *
 * Returns a positive number (the magnitude of the deductions).
 */
export function getWeeklyPtsLost(personId, historyLog, evalWeekday = 0) {
    const start = rankWeekStart(evalWeekday);
    return (historyLog || [])
        .filter(e =>
            e.person_id === personId &&
            e.type === "task_skipped" &&
            (e.points_delta || 0) < 0 &&
            new Date(e.timestamp) >= start
        )
        .reduce((sum, e) => sum + Math.abs(e.points_delta || 0), 0);
}

/**
 * Sum the penalty points at risk today — i.e. the points that will be deducted
 * if today's still-pending chores aren't completed before they reset.
 *
 * Counts each pending, non-reminder due-today task that has a penalty
 * configured. Mirrors the per-instance counting of the "chores due" KPI it sits
 * beside (no chore-id dedupe). Returns 0 when nothing is at risk.
 *
 * @param {object} attr  Personal sensor attributes (family_hub_[name]).
 */
export function getPointsAtRisk(attr) {
    return (attr?.tasks_due_today_list || [])
        .filter(t =>
            t.status === "pending" &&
            t.chore_type !== "reminder" &&
            t.penalty_enabled &&
            (t.penalty_points || 0) > 0
        )
        .reduce((sum, t) => sum + (t.penalty_points || 0), 0);
}

// ---------------------------------------------------------------------------
// Rank bar renderer
// ---------------------------------------------------------------------------

/**
 * Render a weekly rank progress bar row.
 *
 *   [Rank name] [==●==|====] [N pts · holds / +1 rank / −1 rank]
 *
 * The track spans 0 → weekly capacity (person.rank_curve.cap) when known, so the
 * two threshold markers sit at meaningful positions inside the bar; otherwise it
 * falls back to a little past the gain line. Two vertical lines are drawn:
 *   - drop line (orange) — fall below it ⇒ −1 rank   (hidden at the bottom rung)
 *   - gain line (green)  — reach it     ⇒ +1 rank   (hidden at the top rung)
 * Fill color reflects the current standing (red below drop, amber holding,
 * theme accent at/above gain).
 *
 * Parents (rank_index ≥ 999) skip the bar entirely.
 */
export function htmlRankBar(rankIndex, weeklyPts, dropThr, gainThr, ranks, color, person) {
    if (rankIndex >= 999) return "";   // parent — always max, no bar needed

    const current = getEffectiveRank(rankIndex, ranks);
    const isTop   = rankIndex >= ranks.length - 1;
    const isBot   = rankIndex <= 0;

    const cap     = person?.rank_curve?.cap;
    const barMax  = Math.max(cap || Math.round(gainThr * 1.2), gainThr, 1);
    const pctOf   = v => Math.min(100, Math.max(0, Math.round(v / barMax * 100)));
    const fillPct = pctOf(weeklyPts);
    const dropPct = pctOf(dropThr);
    const gainPct = pctOf(gainThr);

    let fillColor, statusText;
    if (!isTop && weeklyPts >= gainThr) {
        fillColor  = color;
        statusText = `${weeklyPts}pts · +1 rank`;
    } else if (!isBot && weeklyPts < dropThr) {
        fillColor  = "#E07A4C";
        statusText = `${weeklyPts}pts · −1 rank`;
    } else {
        fillColor  = "#E0B84C";
        statusText = `${weeklyPts}pts · holds`;
    }

    const dropLine = isBot ? "" :
        `<span class="fh-rank-bar-mark fh-rank-bar-mark--drop" style="left:${dropPct}%" title="Drop below ${dropThr}"></span>`;
    const gainLine = isTop ? "" :
        `<span class="fh-rank-bar-mark fh-rank-bar-mark--gain" style="left:${gainPct}%" title="Rank up at ${gainThr}"></span>`;

    return `
        <div class="fh-rank-bar-row">
            <span class="fh-rank-bar-label" style="color:${color}">${escHTML(current.name)}</span>
            <span class="fh-rank-bar-track">
                <span class="fh-rank-bar-fill" style="width:${fillPct}%;background:${fillColor}"></span>
                ${dropLine}
                ${gainLine}
            </span>
            <span class="fh-rank-bar-status">${escHTML(statusText)}</span>
        </div>`;
}

// ---------------------------------------------------------------------------
// Rotation status (v0.7.3) — "whose week is it" for rotating chores
// ---------------------------------------------------------------------------

/**
 * For each rotating chore the kid is in the pool for, return whose turn it is
 * now, who's next, and when it switches. Computed from naAttr.active_chores
 * (rotation_pool / rotation_cadence / assigned_to) + naAttr.people — no fetch.
 */
export function getRotationStatus(person, naAttr) {
    const pid = person?.person_id;
    if (!pid) return [];
    const people   = naAttr?.people || [];
    const nameOf   = id => people.find(p => p.person_id === id)?.name || "—";
    const isActive = id => { const p = people.find(x => x.person_id === id); return p && p.active !== false; };
    const out = [];
    for (const c of (naAttr?.active_chores || [])) {
        const pool = c.rotation_pool || [];
        if (!pool.includes(pid)) continue;
        const activeIds = pool.filter(isActive);
        if (!activeIds.length) continue;
        const current = (c.assigned_to && c.assigned_to[0]) || activeIds[0];
        const ci      = activeIds.indexOf(current);
        const nextId  = activeIds[((ci + 1) % activeIds.length + activeIds.length) % activeIds.length];
        const cad     = c.rotation_cadence || "";
        // When this chore next switches hands, as a friendly date label.
        let switchWhen = "";
        if (cad === "weekly") {
            const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const sw = c.rotation_switch_weekday ?? 0;       // server 0=Mon
            const jsTarget = (sw + 1) % 7;                   // → JS 0=Sun..6=Sat
            const now = new Date(); now.setHours(0, 0, 0, 0);
            let delta = (jsTarget - now.getDay() + 7) % 7;
            if (delta === 0) delta = 7;                      // next occurrence, not today
            const d = new Date(now); d.setDate(d.getDate() + delta);
            switchWhen = `${WD[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`;
        } else if (cad === "per_instance") {
            switchWhen = "next time";
        } else if (cad === "daily") {
            switchWhen = "tomorrow";
        }
        out.push({
            chore:       c.name,
            mine:        current === pid,
            youNext:     nextId === pid && current !== pid,
            currentName: nameOf(current),
            nextName:    nameOf(nextId),
            switchWhen,
        });
    }
    return out;
}

/**
 * Theme-neutral rotation rail body, split into two condensed labelled groups:
 *   Current        — chores the kid holds right now
 *   Up Next (date) — chores rotating to the kid next, with the switch date
 * Returns "" when neither group has anything, so a theme can drop it in
 * conditionally.
 */
export function htmlRotationRail(person, naAttr, accent) {
    const rows = getRotationStatus(person, naAttr);
    const current = rows.filter(r => r.mine);
    const upNext  = rows.filter(r => r.youNext);
    if (!current.length && !upNext.length) return "";
    const tone = accent || "var(--fh-accent)";

    const group = (label, items, withWhen) => items.length ? `
        <div class="fh-rot-group">
          <div class="fh-rot-group-hdr" style="color:${tone}">${escHTML(label)}</div>
          ${items.map(r => `
            <div class="fh-rot-line">
              <span class="fh-rot-line-chore">${escHTML(r.chore)}</span>
              ${withWhen && r.switchWhen ? `<span class="fh-rot-line-when">${escHTML(r.switchWhen)}</span>` : ""}
            </div>`).join("")}
        </div>` : "";

    return group("Current", current, false) + group("Up Next", upNext, true);
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
// Streak freeze token chip (v0.6.3 item 7)
// ---------------------------------------------------------------------------

/**
 * Render a compact "🧊 N freeze(s)" chip in the rail, just below the
 * success-streak line. Returns "" when the person has no tokens so themes
 * can call it unconditionally.
 *
 * @param {object} attr  Personal sensor attributes (family_hub_[name]).
 */
export function htmlStreakFreezeChip(attr) {
    const n = attr?.streak_freezes_available || 0;
    if (n <= 0) return "";
    const label = n === 1 ? "1 streak freeze" : `${n} streak freezes`;
    return `
        <div class="fh-freeze-chip" title="Streak freeze tokens — auto-spent to protect your streak on a rough day">
            <span class="fh-freeze-chip-icon">🧊</span>
            <span class="fh-freeze-chip-label">${label}</span>
        </div>`;
}

// ---------------------------------------------------------------------------
// Daily progress bar (v0.6.3 item 9)
// ---------------------------------------------------------------------------

/**
 * Render a thin "X / Y done today" progress bar at the top of the tasks tab.
 * Returns "" on rest days (no assigned chores due) so themes can call it
 * unconditionally without adding blank space.
 *
 * Data sources (all from the personal sensor `attr`):
 *   - attr.tasks_done_today          (int) — approved/self_reported/pending_approval today
 *   - attr.tasks_due_today_list      (arr) — still-pending assigned tasks
 *
 * @param {object} attr  Personal sensor attributes.
 */
export function htmlDailyProgress(attr) {
    const done      = attr?.tasks_done_today || 0;
    const remaining = (attr?.tasks_due_today_list || [])
        .filter(t => t.chore_type !== "reminder").length;
    const total     = done + remaining;
    if (total === 0) return "";

    const pct    = Math.round((done / total) * 100);
    const allDone = done >= total;
    const label  = allDone
        ? `✓ All ${total} done today!`
        : `${done} / ${total} done today`;

    return `
        <div class="fh-daily-progress ${allDone ? "fh-daily-progress--complete" : ""}">
            <div class="fh-daily-progress-bar">
                <div class="fh-daily-progress-fill" style="width:${pct}%"></div>
            </div>
            <span class="fh-daily-progress-label">${label}</span>
        </div>`;
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
/**
 * v0.7.3: friendly "when is this due / when does it reset" label for a chore row.
 *
 * Recurring non-daily chores that are still in-play (their backend row carries
 * recurrence_type + days_until_reset) show the NEXT reset/occurrence day so a
 * weekly reads "Wednesday" and a twice-weekly reads "Thursday" instead of a bare
 * "Today" (or nothing). Everything else (daily, one-time, a chore on its actual
 * due day) is relative to due_date: Today / Tomorrow / weekday / short date.
 */
function _dueLabel(t) {
    if (!t) return "";
    const WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date(); today.setHours(0, 0, 0, 0);

    // In-play recurring chore → show when it next resets / comes due.
    const rt  = t.recurrence_type;
    const dur = Number(t.days_until_reset);
    if (rt && rt !== "one_time" && rt !== "daily" && Number.isFinite(dur) && dur > 0) {
        const target = new Date(today); target.setDate(target.getDate() + dur);
        if (dur === 1) return "Tomorrow";
        if (dur <= 6) return WD[target.getDay()];
        if (dur === 7) return `Next ${WD[target.getDay()].slice(0, 3)}`;
        return `${target.getMonth() + 1}/${target.getDate()}`;
    }

    // Otherwise relative to the due date (daily / one-time / weekly on its due day).
    if (!t.due_date) return "";
    const due = new Date(t.due_date + "T00:00:00");
    if (isNaN(due.getTime())) return "";
    const days = Math.round((due - today) / 86400000);
    if (days < 0)  return "";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days <= 6)  return WD[due.getDay()];
    return `${due.getMonth() + 1}/${due.getDate()}`;
}

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
    // Penalty value is shown in the dual points medal below; keep the descriptive
    // line only when there are no positive points (penalty-only chore).
    const hasPenalty = !isReminder && t.penalty_enabled && t.penalty_points > 0;
    const penaltyLine = (hasPenalty && !pts)
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

    // Points medal. Dual display when both reward + penalty are configured so
    // kids see "+15 / −5" at a glance instead of burying the penalty in copy.
    let ptsClass = "fh-row-pts", ptsInner = "";
    if (isReminder) {
        ptsInner = "";
    } else if (pts && hasPenalty) {
        ptsClass += " fh-row-pts--dual";
        ptsInner = `<span class="fh-row-pts-pos">+${pts}</span>`
                 + `<span class="fh-row-pts-sep">/</span>`
                 + `<span class="fh-row-pts-neg">−${t.penalty_points}</span>`;
    } else if (pts) {
        ptsInner = `+${pts}`;
    } else if (hasPenalty) {
        ptsInner = `<span class="fh-row-pts-neg">−${t.penalty_points}</span>`;
    }
    // v0.7.3: due/reset label sits in a column UNDER the points medal —
    // "Today / Tomorrow / Wednesday". Wrapped so it never lands inside a themed
    // medal (e.g. HP's circular seal).
    const dueText = (!isReminder && !isSubmitted) ? _dueLabel(t) : "";
    const dueHtml = dueText ? `<div class="fh-row-due">${escHTML(dueText)}</div>` : "";
    const ptsHtml = `<div class="fh-row-pts-col"><div class="${ptsClass}">${ptsInner}</div>${dueHtml}</div>`;

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

// ---------------------------------------------------------------------------
// Store goal (v0.6.3)
// ---------------------------------------------------------------------------
//
// The kid picks a store item to save toward. The card surfaces a progress bar
// in two places:
//   - htmlGoalBanner   → above the store-tab item list
//   - htmlRailGoal     → as a small panel on the personal page's right rail
// Each theme's color is inherited via currentColor + a CSS-var-backed accent,
// so these helpers are intentionally generic. Theme overrides live in css.js
// under `.fh-goal-*` and any `.fh-<key>-page .fh-goal-*` follow-ups.

/**
 * "Saving for [item] · 234/500 (47%)" header above the store list.
 * Returns "" when no goal is set so callers can unconditionally inject it.
 */
export function htmlGoalBanner(attr) {
    const goal = attr?.goal;
    if (!goal) return "";
    const pct  = Math.max(0, Math.min(100, goal.progress_pct | 0));
    const cost = goal.points_cost | 0;
    const have = Math.max(0, cost - (goal.remaining | 0));
    return `
        <div class="fh-goal-banner">
            <div class="fh-goal-banner-head">
                <span class="fh-goal-banner-lbl">Saving for</span>
                <span class="fh-goal-banner-name">${escHTML(goal.name)}</span>
                <span class="fh-goal-banner-amt">${have}/${cost} pts</span>
            </div>
            <div class="fh-goal-bar"><div class="fh-goal-bar-fill" style="width:${pct}%"></div></div>
        </div>`;
}

/**
 * Compact rail panel: label + tiny progress bar + remaining-points hint.
 * Returns "" when no goal is set so themes can unconditionally include it.
 */
export function htmlRailGoal(attr) {
    const goal = attr?.goal;
    if (!goal) return "";
    const pct  = Math.max(0, Math.min(100, goal.progress_pct | 0));
    const remaining = goal.remaining | 0;
    const remLine   = remaining > 0
        ? `${remaining} pts to go`
        : `Goal reached!`;
    return `
        <div class="fh-goal-rail">
            <div class="fh-goal-rail-lbl">SAVING FOR</div>
            <div class="fh-goal-rail-name">${escHTML(goal.name)}</div>
            <div class="fh-goal-bar"><div class="fh-goal-bar-fill" style="width:${pct}%"></div></div>
            <div class="fh-goal-rail-rem">${escHTML(remLine)}</div>
        </div>`;
}

/**
 * Render a rate-limit info line for a store item.
 *
 * When max_per_period > 0:
 *   - If not yet at limit  → "1 per week"
 *   - If at limit          → "1 per week · Available Mon May 27"
 * Returns "" when no limit is configured.
 */
export function htmlStoreItemLimit(item) {
    const max = item?.max_per_period || 0;
    if (!max) return "";
    const period      = item?.period || "week";
    const periodLabel = period === "day" ? "day" : period === "week" ? "week" : "month";
    const limitText   = `${max} per ${periodLabel}`;

    const nextAvail = item?.next_available;
    if (!nextAvail) {
        return `<span class="fh-store-limit">${escHTML(limitText)}</span>`;
    }
    // Format ISO date as "Mon May 27"
    const d   = new Date(nextAvail + "T00:00:00");
    const dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
    const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
    const dateStr = `${dow} ${mon} ${d.getDate()}`;
    return `<span class="fh-store-limit fh-store-limit--blocked">${escHTML(limitText)} · Available ${escHTML(dateStr)}</span>`;
}

/**
 * Star-style toggle button rendered next to a store-item row. Indicates
 * whether the item IS the current goal, and lets the kid set/clear it
 * with a single tap. Themes can position this however they like.
 */
export function htmlGoalToggleBtn(item, attr, personId) {
    const isGoal = attr?.goal_item_id && attr.goal_item_id === item.item_id;
    return `
        <button class="fh-goal-tog ${isGoal ? "is-goal" : ""}"
                data-act="toggle-goal"
                data-pid="${escAttr(personId)}"
                data-iid="${escAttr(item.item_id)}"
                title="${isGoal ? "Clear goal" : "Save toward this"}">
            ${isGoal ? "★" : "☆"}
        </button>`;
}

// ---------------------------------------------------------------------------
// Group reward helpers (v0.6.3 item 13)
// ---------------------------------------------------------------------------

/**
 * Render per-contributor progress bars for a group reward item.
 *
 * Shows each contributor's name, a progress bar (contributed / target), and
 * a total "N/M pts (P%)" summary line. The current person's row is highlighted.
 * Returns "" for non-group items so callers can call it unconditionally.
 *
 * @param {object} item       Store item row from the sensor (with contributors[]).
 * @param {string} personId   The viewing kid's person_id.
 */
export function htmlGroupContributorBars(item, personId) {
    if (!item?.is_group_reward) return "";
    const contribs = item.contributors || [];
    if (!contribs.length) return "";

    const totalContrib = contribs.reduce((s, c) => s + (c.contributed_pts || 0), 0);
    const totalTarget  = contribs.reduce((s, c) => s + (c.target_pts     || 0), 0);
    const overallPct   = totalTarget > 0 ? Math.round((totalContrib / totalTarget) * 100) : 0;

    // Compact horizontal contributor pills — initial avatar + pts count.
    // Replaces the tall vertical list that made group items 3-4× bigger
    // than regular rewards. Hover/title shows full name + status.
    const pills = contribs.map(c => {
        const isMe    = c.person_id === personId;
        const done    = c.contributed_pts >= (c.target_pts || 1);
        const color   = c.person_color || "#7F77DD";
        const initial = (c.person_name || "?").charAt(0).toUpperCase();
        return `
            <span class="fh-gcp ${isMe ? "fh-gcp--me" : ""} ${done ? "fh-gcp--done" : ""}"
                  title="${escAttr(c.person_name || "?")} — ${c.contributed_pts}/${c.target_pts} pts${isMe ? " (you)" : ""}">
                <span class="fh-gcp-av" style="background:${color}">${escHTML(initial)}</span>
                <span class="fh-gcp-pts">${c.contributed_pts}/${c.target_pts}</span>
            </span>`;
    }).join("");

    return `
        <div class="fh-group-reward-info">
            <div class="fh-group-reward-line">
                <span class="fh-group-reward-tag">🤝 GROUP · ${totalContrib}/${totalTarget} pts · ${overallPct}%</span>
                <span class="fh-group-reward-pills">${pills}</span>
            </div>
        </div>`;
}

/**
 * Render a "Chip In" button for the current person on a group reward.
 * Returns "" if person has already met their target, or not a contributor.
 *
 * @param {object} item      Store item row (with contributors[]).
 * @param {string} personId  The viewing kid's person_id.
 * @param {number} balance   Current balance of the viewing kid.
 */
export function htmlChipInBtn(item, personId, balance) {
    if (!item?.is_group_reward) return "";
    const contrib = (item.contributors || []).find(c => c.person_id === personId);
    if (!contrib) return "";

    const remaining = Math.max(0, (contrib.target_pts || 0) - (contrib.contributed_pts || 0));
    if (remaining <= 0) {
        return `<span class="fh-group-chip-done">✓ Your share complete</span>`;
    }
    const canAfford = balance >= 1;  // any amount allowed (modal lets them pick)
    return `
        <button class="fh-group-chip-btn ${canAfford ? "" : "fh-group-chip-btn--disabled"}"
                data-act="open-chip-in"
                data-iid="${escAttr(item.item_id)}"
                data-pid="${escAttr(personId)}"
                data-remaining="${remaining}"
                data-balance="${balance}"
                ${canAfford ? "" : "disabled"}>
            🤝 Chip In (${remaining} left)
        </button>`;
}

/**
 * Render the "Your Subscriptions" rail above the store tab. (v0.6.5 Phase 4)
 * Returns "" when there are no non-canceled subscriptions so themes can call
 * it unconditionally. Shows name, renewal countdown, affordability, and a
 * cancel button (replaced by a pending-approval chip when cancel_pending).
 *
 * @param {object[]} subs      attr.subscriptions — enriched by the sensor
 * @param {string}   personId  person.person_id (for cancel button data-pid)
 * @param {number}   balance   current points balance (for ready/unready state)
 */
export function htmlSubscriptionRail(subs, personId, balance) {
    if (!subs || !subs.length) return "";

    const PERIOD_LBL = {
        weekly: "wk", monthly: "mo", quarterly: "qtr", biannual: "6mo", annual: "yr",
    };

    const rows = subs.map(sub => {
        const isLapsed        = sub.status === "lapsed";
        const isCancelPending = sub.status === "cancel_pending";
        const periodLabel     = PERIOD_LBL[sub.period] || sub.period;

        let infoHtml;
        if (isLapsed) {
            infoHtml = `<span class="fh-sub-status fh-sub-status--lapsed">Lapsed — owe ${sub.accumulated_debt}pts to resume</span>`;
        } else if (isCancelPending) {
            infoHtml = `<span class="fh-sub-status fh-sub-status--pending">Cancellation pending approval</span>`;
        } else {
            const n = sub.days_until_renewal;
            const renewLabel = n <= 0 ? "Renews today" : n === 1 ? "Renews tomorrow" : `Renews in ${n}d`;
            const owed       = sub.points_cost + (sub.accumulated_debt || 0);
            const canAfford  = balance >= owed;
            const readiness  = canAfford
                ? `<span class="fh-sub-ready">✓ Ready</span>`
                : `<span class="fh-sub-unready">⚠ Need ${owed - balance}pts more</span>`;
            infoHtml = `<span class="fh-sub-renews">${escHTML(renewLabel)}</span><span class="fh-sub-sep">·</span>${readiness}`;
        }

        const iconHtml = sub.item_icon
            ? `<span class="fh-sub-icon">${choreIcon(sub.item_icon, null, "22px")}</span>`
            : "";

        const cancelBtn = isCancelPending ? "" : `
            <button class="fh-sub-cancel-btn"
                    data-act="request-cancel-sub"
                    data-subid="${escAttr(sub.subscription_id)}"
                    data-pid="${escAttr(personId)}"
                    data-name="${escAttr(sub.item_name)}">Cancel</button>`;

        const rowMod = isLapsed ? " fh-sub-row--lapsed" : isCancelPending ? " fh-sub-row--cancel-pending" : "";
        return `
            <div class="fh-sub-row${rowMod}">
                ${iconHtml}
                <div class="fh-sub-body">
                    <div class="fh-sub-name">${escHTML(sub.item_name)}</div>
                    <div class="fh-sub-info">${infoHtml}</div>
                </div>
                <div class="fh-sub-price">${sub.points_cost}pts/${periodLabel}</div>
                ${cancelBtn}
            </div>`;
    }).join("");

    return `
        <div class="fh-sub-rail">
            <div class="fh-sub-rail-hdr">YOUR SUBSCRIPTIONS</div>
            ${rows}
        </div>`;
}

/**
 * Compact "SUBSCRIPTIONS" panel for the tasks-tab right rail. (v0.6.5 follow-up)
 * Shows each active sub with an affordability progress bar and a one-line status.
 * Returns "" when there are no non-canceled subs so themes can call unconditionally.
 *
 * @param {object[]} subs     attr.subscriptions — enriched by the sensor
 * @param {number}   balance  current points balance
 * @param {string}   personId person.person_id (for the cancel button)
 */
export function htmlRailSubscriptions(subs, balance, personId) {
    const active = (subs || []).filter(s => s.status !== "canceled");
    if (!active.length) return "";

    const PERIOD_LBL = { weekly:"wk", monthly:"mo", quarterly:"qtr", biannual:"6mo", annual:"yr" };

    const rows = active.map(sub => {
        const isLapsed  = sub.status === "lapsed";
        const isPending = sub.status === "cancel_pending";
        const periodLbl = PERIOD_LBL[sub.period] || sub.period;
        const totalCost = sub.points_cost + (sub.accumulated_debt || 0);
        const pct       = Math.min(100, Math.round((balance / Math.max(totalCost, 1)) * 100));
        const barColor  = isLapsed ? "#E85A5A" : isPending ? "#E0B84C" : "currentColor";

        let statusLine;
        if (isLapsed) {
            statusLine = `Lapsed · owes ${sub.accumulated_debt}pts`;
        } else if (isPending) {
            statusLine = "Cancellation pending approval";
        } else {
            const n        = sub.days_until_renewal;
            const renewStr = n <= 0 ? "Renews today" : n === 1 ? "Renews tomorrow" : `Renews in ${n}d`;
            const owed     = sub.points_cost + (sub.accumulated_debt || 0);
            const ready    = balance >= owed;
            statusLine = ready
                ? `✓ Ready · ${renewStr}`
                : `⚠ Need ${owed - balance}pts · ${renewStr}`;
        }

        const iconHtml = sub.item_icon
            ? `<span class="fh-sub-mini-icon">${choreIcon(sub.item_icon, null, "18px")}</span>` : "";

        const cancelBtn = isPending ? "" : `
            <button class="fh-sub-cancel-btn"
                    data-act="request-cancel-sub"
                    data-subid="${escAttr(sub.subscription_id)}"
                    data-pid="${escAttr(personId)}"
                    data-name="${escAttr(sub.item_name)}">Cancel</button>`;

        return `
            <div class="fh-sub-mini-row">
                <div class="fh-sub-mini-head">
                    ${iconHtml}
                    <span class="fh-sub-mini-name">${escHTML(sub.item_name)}</span>
                    <span class="fh-sub-mini-price">${sub.points_cost}/${periodLbl}</span>
                </div>
                <div class="fh-sub-mini-bar-wrap">
                    <div class="fh-sub-mini-bar" style="width:${pct}%;background:${barColor}"></div>
                </div>
                <div class="fh-sub-mini-status">${escHTML(statusLine)}</div>
                ${cancelBtn}
            </div>`;
    }).join("");

    return rows;
}

/**
 * Content for the 480px right rail on the store/rewards tab. (v0.6.5 follow-up)
 * Section 1: active subscriptions with affordability bars + status.
 * Section 2: last 10 purchases (redemption_approved + subscription_renewed).
 * Returns "" when both sections are empty.
 *
 * @param {object[]} subs       attr.subscriptions
 * @param {number}   balance    current points balance
 * @param {object[]} historyLog naAttr.history_log
 * @param {string}   personId   person.person_id
 */
export function htmlStoreRailContent(subs, balance, historyLog, personId) {
    const PERIOD_LBL     = { weekly:"wk", monthly:"mo", quarterly:"qtr", biannual:"6mo", annual:"yr" };
    // points_awarded covers one-time purchases (async_deduct_points stores note='Redeemed "name"')
    // subscription_started covers new subs; subscription_renewed covers renewals.
    // redemption_approved is intentionally excluded — it holds approver UUIDs, not item names.
    const PURCHASE_TYPES = new Set(["points_awarded", "subscription_started", "subscription_renewed"]);
    const TYPE_LBL       = { points_awarded:"Purchased", subscription_started:"Subscribed", subscription_renewed:"Sub renewal" };

    const active = (subs || []).filter(s => s.status !== "canceled");

    let subSection = "";
    if (active.length) {
        const rows = active.map(sub => {
            const isLapsed  = sub.status === "lapsed";
            const isPending = sub.status === "cancel_pending";
            const periodLbl = PERIOD_LBL[sub.period] || sub.period;
            const totalCost = sub.points_cost + (sub.accumulated_debt || 0);
            const pct       = Math.min(100, Math.round((balance / Math.max(totalCost, 1)) * 100));
            const barColor  = isLapsed ? "#E85A5A" : isPending ? "#E0B84C" : "currentColor";

            let statusLine;
            if (isLapsed) {
                statusLine = `Lapsed · owes ${sub.accumulated_debt}pts`;
            } else if (isPending) {
                statusLine = "Cancellation pending approval";
            } else {
                const n        = sub.days_until_renewal;
                const renewStr = n <= 0 ? "Renews today" : n === 1 ? "Renews tomorrow" : `Renews in ${n}d`;
                // Recovery from a lapse needs the period cost PLUS any accrued
                // debt — match htmlRailSubscriptions so "Ready" never lies.
                const owed     = sub.points_cost + (sub.accumulated_debt || 0);
                const ready    = balance >= owed;
                statusLine = ready
                    ? `✓ Ready · ${renewStr}`
                    : `⚠ Need ${owed - balance}pts · ${renewStr}`;
            }

            const iconHtml = sub.item_icon
                ? `<span class="fh-sub-mini-icon">${choreIcon(sub.item_icon, null, "18px")}</span>` : "";

            const cancelBtn = isPending ? "" : `
                <button class="fh-sub-cancel-btn"
                        data-act="request-cancel-sub"
                        data-subid="${escAttr(sub.subscription_id)}"
                        data-pid="${escAttr(personId)}"
                        data-name="${escAttr(sub.item_name)}">Cancel</button>`;

            return `
                <div class="fh-store-sub-row">
                    <div class="fh-sub-mini-head">
                        ${iconHtml}
                        <span class="fh-sub-mini-name">${escHTML(sub.item_name)}</span>
                        <span class="fh-sub-mini-price">${sub.points_cost}/${periodLbl}</span>
                    </div>
                    <div class="fh-sub-mini-bar-wrap">
                        <div class="fh-sub-mini-bar" style="width:${pct}%;background:${barColor}"></div>
                    </div>
                    <div class="fh-sub-mini-status">${escHTML(statusLine)}</div>
                    ${cancelBtn}
                </div>`;
        }).join("");
        subSection = `<div class="fh-store-rail-section"><div class="fh-store-rail-hdr">YOUR SUBSCRIPTIONS</div>${rows}</div>`;
    }

    const purchases = (historyLog || [])
        .filter(e => {
            if (e.person_id !== personId || !PURCHASE_TYPES.has(e.type)) return false;
            // For points_awarded only include redemption-related entries
            // (async_deduct_points writes note='Redeemed "Item Name"' for purchases)
            if (e.type === "points_awarded") return /^Redeemed "/.test(e.note || "");
            return true;
        })
        .slice(0, 10);

    let purchSection = "";
    if (purchases.length) {
        const rows = purchases.map(e => {
            const typeLbl = TYPE_LBL[e.type] || e.type;
            const when    = e.timestamp ? relTime(e.timestamp) : "";
            // points_awarded note format: 'Redeemed "Item Name"' — extract inner text.
            // subscription_started / subscription_renewed store item name directly in note.
            const name = e.type === "points_awarded"
                ? ((e.note || "").replace(/^Redeemed "(.+)"$/, "$1") || "—")
                : (e.chore_name || e.note || "—");
            const delta   = e.points_delta ? `−${Math.abs(e.points_delta)}pts` : "";
            return `
                <div class="fh-store-purchase-row">
                    <div class="fh-store-purchase-name">${escHTML(name)}</div>
                    <div class="fh-store-purchase-meta">
                        <span class="fh-store-purchase-type">${escHTML(typeLbl)}</span>
                        ${delta ? `<span class="fh-store-purchase-pts">${delta}</span>` : ""}
                        <span class="fh-store-purchase-when">${escHTML(when)}</span>
                    </div>
                </div>`;
        }).join("");
        purchSection = `<div class="fh-store-rail-section"><div class="fh-store-rail-hdr">RECENT PURCHASES</div>${rows}</div>`;
    }

    return subSection + purchSection;
}

/**
 * Render pending group-reward proposals that need THIS kid's accept/decline.
 * Returns "" when there are no pending proposals so callers can call
 * it unconditionally at the top of the store tab.
 *
 * @param {object[]} proposals  From attr.group_proposals (personal sensor).
 * @param {string}   personId   The viewing kid's person_id.
 */
export function htmlGroupProposalBanner(proposals, personId) {
    if (!proposals || !proposals.length) return "";
    const rows = proposals.map(p => `
        <div class="fh-group-proposal-card">
            <div class="fh-group-proposal-from">
                🤝 <strong>${escHTML(p.proposer_name)}</strong> wants to save for
                <strong>${escHTML(p.item_name)}</strong> with you
            </div>
            <div class="fh-group-proposal-share">Your share: ${p.my_share_pct}%</div>
            <div class="fh-group-proposal-btns">
                <button class="fh-group-proposal-accept"
                        data-act="accept-group-proposal"
                        data-propid="${escAttr(p.proposal_id)}"
                        data-pid="${escAttr(personId)}">
                    Accept
                </button>
                <button class="fh-group-proposal-decline"
                        data-act="decline-group-proposal"
                        data-propid="${escAttr(p.proposal_id)}"
                        data-pid="${escAttr(personId)}">
                    Decline
                </button>
            </div>
        </div>`).join("");

    return `<div class="fh-group-proposals">${rows}</div>`;
}


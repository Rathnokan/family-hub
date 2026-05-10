/**
 * Family Hub Card — Admin Mode
 * Four tabs: Overview, Approvals (+ history log), Redemptions (+ store inventory),
 * Chores, Settings.
 *
 * v0.4.2: Global penalty pause toggle added to Settings tab.
 *         Per-person penalty pause toggles added to Overview tab.
 */

import { DEFAULT_COLOR, HISTORY_META } from "./constants.js";
import { I } from "./constants.js";
import { escHTML, escAttr, ini, fPts, fUSD, cap, relTime } from "./utils.js";

/**
 * Render the full admin mode HTML.
 * @param {object} card - The FamilyHubCard instance
 */
export function htmlAdmin(card) {
    const attr        = card._attrs("sensor.family_hub_needs_attention");
    const people      = attr.people           || [];
    const approvals   = attr.approval_queue   || [];
    const redemptions = attr.redemption_queue || [];
    const chores      = attr.active_chores    || [];
    const catLabels   = attr.category_labels  || [];
    const famName     = attr.family_name      || "Family Hub";
    const actionCount = approvals.length + redemptions.length;

    const sections = [
        { id: "overview",    label: "Overview",  badge: 0 },
        { id: "approvals",   label: "Approvals", badge: approvals.length },
        { id: "redemptions", label: "Redeem",    badge: redemptions.length },
        { id: "chores",      label: "Chores",    badge: 0 },
        { id: "settings",    label: "Settings",  badge: 0 },
    ];

    const nav = `
      <div class="fh-tabs" style="flex-wrap:wrap">
        ${sections.map(s => `
          <div class="fh-tab ${card._adminSec === s.id ? "active" : ""}"
               data-act="admin-sec" data-sec="${s.id}" style="flex:1 0 auto">
            ${s.label}
            ${s.badge > 0 ? `<span class="fh-tab-badge"></span>` : ""}
          </div>`).join("")}
      </div>`;

    let body = "";
    switch (card._adminSec) {
        case "overview":    body = _htmlOverview(people, attr);                  break;
        case "approvals":   body = _htmlApprovals(approvals, attr, card);        break;
        case "redemptions": body = _htmlRedemptions(redemptions, attr, card);    break;
        case "chores":      body = _htmlChores(chores, people, catLabels, card); break;
        case "settings":    body = _htmlSettings(attr);                          break;
    }

    return `
      <div class="fh-hdr">
        <span class="fh-title" style="margin:0">${escHTML(famName)} — Admin</span>
        ${actionCount
            ? `<span class="fh-badge fh-badge-overdue">${actionCount} need action</span>`
            : ""}
      </div>
      ${nav}
      ${body}`;
}

// ---------------------------------------------------------------------------
// Overview tab
// ---------------------------------------------------------------------------

function _htmlOverview(people, attr) {
    const ppdollar = attr.points_per_dollar || 10;

    const rows = people.map(p => {
        const color          = p.avatar_color || DEFAULT_COLOR;
        const penPaused      = p.penalties_paused || false;

        // Per-person penalty pause toggle. Uses data-act="toggle-person-penalty"
        // with the person_id so dispatch can call update_person.
        // The toggle is only shown for kids — parents don't have penalties.
        const penaltyToggle = (p.type === "kid") ? `
          <div class="fh-penalty-pause-wrap" title="${penPaused ? "Penalties paused — tap to resume" : "Tap to pause penalties for this person"}">
            <span class="fh-penalty-pause-label" style="font-size:.7rem;color:${penPaused ? "var(--fh-warning)" : "var(--fh-text-sec)"}">
              ${penPaused ? "⏸ Penalties off" : "Penalties on"}
            </span>
            <label class="fh-toggle" style="width:36px;height:20px">
              <input type="checkbox" data-act="toggle-person-penalty"
                     data-pid="${p.person_id}" ${penPaused ? "" : "checked"}>
              <span class="fh-toggle-slider"></span>
            </label>
          </div>` : "";

        return `
        <div class="fh-point-row">
          <div class="fh-avatar" style="background:${color}">${ini(p.name)}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:.9rem">${escHTML(p.name)}
              <span style="font-size:.75rem;color:var(--fh-text-sec);font-weight:400">
                (${cap(p.type)})
              </span>
            </div>
            <div style="font-size:.75rem;color:var(--fh-text-sec)">
              ${fPts(p.points_balance)}pts · ${fUSD(p.points_balance / ppdollar)} · lifetime ${fPts(p.points_lifetime)}
            </div>
          </div>
          ${penaltyToggle}
          <button class="fh-btn fh-btn-success fh-btn-sm"
                  data-act="open-award" data-pid="${p.person_id}"
                  data-pname="${escAttr(p.name)}" title="Award points">
            ${I.award}
          </button>
          <button class="fh-btn fh-btn-danger fh-btn-sm"
                  data-act="open-deduct" data-pid="${p.person_id}"
                  data-pname="${escAttr(p.name)}" title="Deduct points">
            ${I.minus}
          </button>
          <button class="fh-btn fh-btn-ghost fh-btn-sm"
                  data-act="open-edit-person" data-pid="${p.person_id}"
                  data-pname="${escAttr(p.name)}" data-ptype="${p.type}"
                  data-pcolor="${p.avatar_color || DEFAULT_COLOR}" title="Edit person">
            ${I.edit}
          </button>
          <button class="fh-btn fh-btn-ghost fh-btn-sm"
                  data-act="open-confirm-remove-person" data-pid="${p.person_id}"
                  data-pname="${escAttr(p.name)}" title="Remove person">
            ${I.remove}
          </button>
        </div>`;
    }).join("") || `<div class="fh-empty">No people found.</div>`;

    return `
      <div class="fh-section-title">Point balances</div>
      <div class="fh-task-list">${rows}</div>

      <div style="margin-top:var(--fh-gap)">
        <button class="fh-btn fh-btn-primary fh-btn-lg" data-act="open-add-task"
                style="width:100%;justify-content:center">
          ${I.plus} Add task
        </button>
      </div>

      <div style="margin-top:var(--fh-gap-sm);display:flex;gap:var(--fh-gap-sm);flex-wrap:wrap">
        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-add-person">
          ${I.person} Add person
        </button>
      </div>`;
}

// ---------------------------------------------------------------------------
// Approvals tab — Pending approvals + History log
// ---------------------------------------------------------------------------

function _htmlApprovals(approvals, attr, card) {
    const historyLog = attr.history_log || [];
    const people     = attr.people      || [];

    const approvalRows = approvals.map(a => {
        const color = a.person_color || DEFAULT_COLOR;
        return `
            <div class="fh-queue-row">
              <div class="fh-avatar" style="background:${color}">${ini(a.person_name)}</div>
              <div class="fh-queue-info">
                <div class="fh-queue-name">${escHTML(a.chore_name)}</div>
                <div class="fh-queue-meta">${escHTML(a.person_name)} · ${a.chore_points}pts</div>
              </div>
              <div class="fh-queue-btns">
                <button class="fh-btn fh-btn-success fh-btn-sm"
                        data-act="approve-task" data-tid="${a.task_id}">${I.check}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm"
                        data-act="deny-task" data-tid="${a.task_id}">${I.close}</button>
              </div>
            </div>`;
    }).join("") || `<div class="fh-empty">No pending approvals. ✓</div>`;

    // History log person filter chips
    const histFilterChips = `
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

    const filtered    = card._histFilter
        ? historyLog.filter(e => e.person_id === card._histFilter)
        : historyLog;
    const firstParent = people.find(p => p.type === "parent");

    const histRows = filtered.map(e => {
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
            <div class="fh-avatar" style="background:${color};width:22px;height:22px;font-size:.62rem">
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
    }).join("") || `<div class="fh-empty">No history entries yet.</div>`;

    return `
      <div class="fh-section-title">Pending approvals</div>
      <div class="fh-task-list">${approvalRows}</div>

      <div class="fh-divider"></div>
      <div class="fh-hdr" style="margin-bottom:var(--fh-gap-sm)">
        <span class="fh-section-title" style="margin:0">History log</span>
        <span style="font-size:.75rem;color:var(--fh-text-sec)">Last 30 days</span>
      </div>
      ${histFilterChips}
      <div class="fh-hist-scroll">${histRows}</div>`;
}

// ---------------------------------------------------------------------------
// Redemptions tab — Pending redemptions + Store inventory
// ---------------------------------------------------------------------------

function _htmlRedemptions(redemptions, attr, card) {
    const storeItems = attr.store_items || [];
    const people     = attr.people      || [];

    const redemptionRows = redemptions.map(r => {
        const color = r.person_color || DEFAULT_COLOR;
        return `
            <div class="fh-queue-row">
              <div class="fh-avatar" style="background:${color}">${ini(r.person_name)}</div>
              <div class="fh-queue-info">
                <div class="fh-queue-name">${escHTML(r.item_name)}</div>
                <div class="fh-queue-meta">${escHTML(r.person_name)} · ${fPts(r.points_cost)}pts</div>
              </div>
              <div class="fh-queue-btns">
                <button class="fh-btn fh-btn-success fh-btn-sm"
                        data-act="approve-redemption" data-rid="${r.redemption_id}">${I.check}</button>
                <button class="fh-btn fh-btn-danger fh-btn-sm"
                        data-act="decline-redemption" data-rid="${r.redemption_id}">${I.close}</button>
              </div>
            </div>`;
    }).join("") || `<div class="fh-empty">No pending redemptions. ✓</div>`;

    const storeRows = storeItems.map(item => {
        const personNames = (item.person_ids || [])
            .map(id => people.find(p => p.person_id === id)?.name)
            .filter(Boolean)
            .join(", ");

        return `
          <div class="fh-store-inv-row">
            <div class="fh-store-inv-info">
              <div class="fh-store-inv-name">${escHTML(item.name)}</div>
              <div class="fh-store-inv-meta">
                ${fUSD(item.dollar_value)} · ${fPts(item.points_cost)}pts ·
                ${item.scope === "personal"
                    ? `Personal${personNames ? ` (${escHTML(personNames)})` : ""}`
                    : "All kids"}
              </div>
            </div>
            <button class="fh-btn fh-btn-ghost fh-btn-sm"
                    data-act="open-edit-store-item"
                    data-iid="${item.item_id}"
                    title="Edit reward">
              ${I.edit}
            </button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="delete-store-item"
                    data-iid="${item.item_id}" data-iname="${escAttr(item.name)}"
                    title="Delete reward">
              ${I.trash}
            </button>
          </div>`;
    }).join("") || `<div class="fh-empty">No store items yet.</div>`;

    return `
      <div class="fh-section-title">Pending redemptions</div>
      <div class="fh-task-list">${redemptionRows}</div>

      <div class="fh-divider"></div>
      <div class="fh-hdr">
        <span class="fh-section-title" style="margin:0">Store inventory</span>
        <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="open-add-store-item">
          ${I.plus} Add reward
        </button>
      </div>
      <div class="fh-task-list">${storeRows}</div>`;
}

// ---------------------------------------------------------------------------
// Chores tab — Person filter chips + grouped chore list with drag-to-reorder
// ---------------------------------------------------------------------------

function _htmlChores(chores, people, catLabels, card) {
    card._sortedChores = chores;

    const filterChips = `
      <div class="fh-chips" style="margin-bottom:var(--fh-gap-sm)">
        <div class="fh-chip ${!card._choreFilter ? "active" : ""}"
             data-act="chore-filter" data-cpid="">All</div>
        ${people.map(p => `
          <div class="fh-chip ${card._choreFilter === p.person_id ? "active" : ""}"
               style="--chip-color:${p.avatar_color || DEFAULT_COLOR}"
               data-act="chore-filter" data-cpid="${p.person_id}">
            <span class="fh-chip-dot"></span>${escHTML(p.name)}
          </div>`).join("")}
      </div>`;

    const visibleChores = card._choreFilter
        ? chores.filter(c => (c.assigned_to || []).includes(card._choreFilter))
        : chores;

    const addBtn = `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--fh-gap-sm)">
        <button class="fh-btn fh-btn-primary fh-btn-sm" data-act="open-add-chore">
          ${I.plus} Add chore
        </button>
      </div>`;

    if (!visibleChores.length) {
        return `
          ${filterChips}
          ${addBtn}
          <div class="fh-empty">
            ${card._choreFilter
                ? "No chores assigned to this person."
                : "No active chores. Add one above."}
          </div>`;
    }

    const groups = new Map();
    for (const c of visibleChores) {
        const key = c.category_label || "Uncategorized";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(c);
    }

    const sections = [...groups.entries()].map(([label, list]) => {
        const rows = list.map(c => {
            const assignedPeople = (c.assigned_to || [])
                .map(id => people.find(p => p.person_id === id))
                .filter(Boolean);
            const avatarHtml = assignedPeople.length
                ? `<div class="fh-avatars">${assignedPeople.map(p =>
                    `<div class="fh-avatar" style="background:${p.avatar_color || DEFAULT_COLOR};width:22px;height:22px;font-size:.62rem">${ini(p.name)}</div>`
                  ).join("")}</div>`
                : "";

            const descExp  = card._expandedDescs.has(c.chore_id);
            const rowColor = assignedPeople[0]?.avatar_color || DEFAULT_COLOR;
            const recType  = c.recurrence?.type || "daily";
            const recLabel = {
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

            return `
          <div class="fh-task-row" style="--row-color:${rowColor}"
               draggable="true" data-drag-id="${c.chore_id}">
            <span class="fh-drag-handle" title="Drag to reorder">⠿</span>
            ${avatarHtml}
            <div class="fh-task-body">
              <span class="fh-task-name">${escHTML(c.name)}</span>
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
            <span class="fh-badge fh-badge-pts" style="--row-color:${rowColor}">${c.points}pts</span>
            <button class="fh-btn fh-btn-ghost fh-btn-sm"
                    data-act="open-edit-chore" data-cid="${c.chore_id}"
                    title="Edit chore">${I.edit}</button>
            <button class="fh-btn fh-btn-danger fh-btn-sm"
                    data-act="delete-chore"
                    data-cid="${c.chore_id}" data-cname="${escAttr(c.name)}"
                    title="Delete chore">${I.trash}</button>
          </div>`;
        }).join("");

        return `
        <div class="fh-section-title">${escHTML(label)}</div>
        <div class="fh-task-list">${rows}</div>`;
    }).join("");

    return `
      ${filterChips}
      ${addBtn}
      ${sections}`;
}

// ---------------------------------------------------------------------------
// Settings tab
// ---------------------------------------------------------------------------

function _htmlSettings(attr) {
    const famName        = attr.family_name               || "Family Hub";
    const ppdollar       = attr.points_per_dollar         || 10;
    const showDollar     = attr.show_dollar_value_to_kids || false;
    const catLabels      = attr.category_labels           || [];
    // v0.4.2: global penalty pause flag from sensor
    const penPaused      = attr.penalties_paused_global   || false;

    const labelChips = catLabels.map(l => `
      <div class="fh-cat-chip">
        <span>${escHTML(l)}</span>
        <button class="fh-cat-chip-del" data-act="remove-cat-label"
                data-label="${escAttr(l)}" title="Remove">×</button>
      </div>`).join("");

    return `
      <div class="fh-task-list">

        <!-- Dollar value toggle -->
        <div class="fh-toggle-row">
          <span style="font-size:.9rem">Show dollar value to kids</span>
          <label class="fh-toggle">
            <input type="checkbox" data-act="toggle-dollar" ${showDollar ? "checked" : ""}>
            <span class="fh-toggle-slider"></span>
          </label>
        </div>

        <!-- Global penalty pause toggle (v0.4.2) -->
        <!-- NOTE: the toggle logic is inverted — "Penalties active" = checked = NOT paused.
             This feels natural: switch ON = penalties running, switch OFF = paused.
             The data-act handler reads the checkbox and sends penalties_paused = !checked. -->
        <div class="fh-toggle-row" style="border-left:3px solid ${penPaused ? "var(--fh-warning)" : "var(--fh-success)"}">
          <div>
            <div style="font-size:.9rem;font-weight:600">Penalties active</div>
            <div style="font-size:.75rem;color:var(--fh-text-sec)">
              ${penPaused
                  ? "⏸ All penalties paused — chores skipped without point deductions"
                  : "Penalties will apply normally at the daily tick"}
            </div>
          </div>
          <label class="fh-toggle">
            <input type="checkbox" data-act="toggle-global-penalty" ${penPaused ? "" : "checked"}>
            <span class="fh-toggle-slider"></span>
          </label>
        </div>

        <!-- Family name / points rate -->
        <div class="fh-point-row">
          <div style="flex:1;min-width:0">
            <div style="font-size:.9rem;font-weight:600">${escHTML(famName)}</div>
            <div style="font-size:.75rem;color:var(--fh-text-sec)">${ppdollar} points per dollar</div>
          </div>
          <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="open-edit-settings"
                  data-fname="${escAttr(famName)}" data-ppd="${ppdollar}">
            ${I.settings} Edit
          </button>
        </div>

        <div class="fh-divider"></div>

        <!-- Category labels -->
        <div>
          <div class="fh-label" style="margin-bottom:6px">Category labels</div>
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

        <button class="fh-btn fh-btn-ghost fh-btn-sm" data-act="export-backup"
                style="width:100%;justify-content:center">
          Export backup
        </button>
      </div>`;
}
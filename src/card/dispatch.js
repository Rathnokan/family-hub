/**
 * Family Hub Card — Event Dispatcher
 * Handles all data-act click events. Called by FamilyHubCard._dispatch().
 * Reads form values, calls services, opens/closes modals, updates UI state.
 */

import { FLASH_MS } from "./constants.js";

/**
 * Dispatch a data-act action.
 * @param {string}       act  - The data-act value
 * @param {HTMLElement}  el   - The element that triggered the action
 * @param {FamilyHubCard} card - The card instance
 */
export function dispatch(act, el, card) {
    const sr  = card.shadowRoot;
    const v   = id => sr.getElementById(id)?.value ?? "";
    const b   = id => sr.getElementById(id)?.checked ?? false;
    const int = id => parseInt(v(id) || "0");

    switch (act) {

        // ---- Navigation ----------------------------------------------------
        case "filter":
            card._filter = card._filter === el.dataset.pid ? null : el.dataset.pid;
            card._doRender(true);
            break;

        case "tab":
            card._tab = el.dataset.tab;
            card._doRender(true);
            break;

        case "admin-sec":
            card._adminSec = el.dataset.sec;
            card._doRender(true);
            break;

        case "hist-filter":
            card._histFilter = el.dataset.hpid || null;
            card._doRender(true);
            break;

        case "chore-filter":
            card._choreFilter = el.dataset.cpid || null;
            card._doRender(true);
            break;

        // ---- Task completion -----------------------------------------------
        case "complete": {
            const tid = el.dataset.tid;
            const pid = el.dataset.pid;
            if (!tid || !pid) break;
            card._svc("complete_task", { task_id: tid, person_id: pid });
            card._flashing.add(tid);
            card._doRender(true);
            setTimeout(() => {
                card._flashing.delete(tid);
                const row = card.shadowRoot.querySelector(
                    `[data-tid="${tid}"], [data-act="complete"][data-tid="${tid}"]`
                )?.closest(".fh-task-row");
                row?.remove();
            }, FLASH_MS + 50);
            break;
        }

        // ---- Description toggle --------------------------------------------
        case "toggle-desc": {
            const id = el.dataset.id;
            if (card._expandedDescs.has(id)) card._expandedDescs.delete(id);
            else card._expandedDescs.add(id);
            card._doRender(true);
            break;
        }

        // ---- Task / redemption approvals -----------------------------------
        case "approve-task": {
            const parent = card._people().find(p => p.type === "parent");
            card._svc("approve_task", { task_id: el.dataset.tid, approved_by: parent?.person_id || "" });
            break;
        }
        case "deny-task": {
            const parent = card._people().find(p => p.type === "parent");
            card._svc("deny_task", { task_id: el.dataset.tid, denied_by: parent?.person_id || "" });
            break;
        }
        case "approve-redemption": {
            const parent = card._people().find(p => p.type === "parent");
            card._svc("approve_redemption", { redemption_id: el.dataset.rid, approved_by: parent?.person_id || "" });
            break;
        }
        case "decline-redemption": {
            const parent = card._people().find(p => p.type === "parent");
            card._svc("decline_redemption", { redemption_id: el.dataset.rid, declined_by: parent?.person_id || "" });
            break;
        }

        // ---- v0.4.0 Admin correction actions -------------------------------
        case "excuse-task":
            card._svc("excuse_task", {
                instance_id: el.dataset.iid,
                excused_by:  el.dataset.excusedBy,
                reason: "",
            });
            break;
        case "mark-complete":
            card._svc("mark_task_complete", {
                instance_id: el.dataset.iid,
                marked_by:   el.dataset.markedBy,
                reason: "",
            });
            break;
        case "reject-task":
            card._svc("reject_task", {
                instance_id: el.dataset.iid,
                rejected_by: el.dataset.rejectedBy,
                reason: "",
            });
            break;

        // ---- Store redemption request --------------------------------------
        case "redeem":
            card._svc("request_redemption", { person_id: el.dataset.pid, item_id: el.dataset.iid });
            break;

        // ---- Delete chore --------------------------------------------------
        case "delete-chore":
            if (!confirm(`Delete "${el.dataset.cname}"?\n\nThis cannot be undone.`)) break;
            card._svc("delete_chore", { chore_id: el.dataset.cid });
            break;

        // ---- Delete store item ---------------------------------------------
        case "delete-store-item":
            if (!confirm(`Delete reward "${el.dataset.iname}"?\n\nThis cannot be undone.`)) break;
            card._svc("delete_store_item", { item_id: el.dataset.iid });
            break;

        // ---- Category label management ------------------------------------
        case "remove-cat-label": {
            const labelToRemove = el.dataset.label;
            const current = card._attrs("sensor.family_hub_needs_attention").category_labels || [];
            card._svc("update_settings", { category_labels: current.filter(l => l !== labelToRemove) });
            break;
        }
        case "add-cat-label": {
            const input    = sr.getElementById("cat-label-input");
            const newLabel = input?.value?.trim();
            if (!newLabel) break;
            const current  = card._attrs("sensor.family_hub_needs_attention").category_labels || [];
            if (!current.includes(newLabel)) {
                card._svc("update_settings", { category_labels: [...current, newLabel] });
            }
            if (input) input.value = "";
            break;
        }

        // ---- Penalty pause toggles (v0.4.2) --------------------------------

        // Global penalty pause — in Settings tab.
        // The checkbox is "Penalties active" (checked = running, unchecked = paused),
        // so we invert: penalties_paused = !checked.
        case "toggle-global-penalty": {
            const checked = el.checked ?? el.querySelector("input")?.checked ?? true;
            card._svc("update_settings", { penalties_paused: !checked });
            break;
        }

        // Per-person penalty pause — in Overview tab.
        // The checkbox is also "Penalties active" (checked = on, unchecked = paused).
        // We read the person_id from data-pid and invert the checkbox value.
        case "toggle-person-penalty": {
            const pid     = el.dataset.pid || el.closest("[data-pid]")?.dataset.pid;
            const checked = el.checked ?? el.querySelector("input")?.checked ?? true;
            if (pid) card._svc("update_person", { person_id: pid, penalties_paused: !checked });
            break;
        }

        // ---- Backup --------------------------------------------------------
        case "export-backup":
            card._svc("export_backup", {});
            break;

        // ---- Open modals ---------------------------------------------------
        case "open-award":
            card._modal = { type: "award",  data: { pid: el.dataset.pid, pname: el.dataset.pname } };
            card._doRender(true);
            break;
        case "open-deduct":
            card._modal = { type: "deduct", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
            card._doRender(true);
            break;
        case "open-add-task":
            card._modal = { type: "add-task", data: {} };
            card._doRender(true);
            break;
        case "open-add-chore":
            card._modal = { type: "add-chore", data: {} };
            card._doRender(true);
            break;
        case "open-edit-chore": {
            const chores = card._attrs("sensor.family_hub_needs_attention").active_chores || [];
            const chore  = chores.find(c => c.chore_id === el.dataset.cid);
            if (!chore) break;
            card._modal = { type: "edit-chore", data: { chore } };
            card._doRender(true);
            break;
        }
        case "open-add-store-item":
            card._modal = { type: "add-store-item", data: {} };
            card._doRender(true);
            break;
        case "open-edit-store-item": {
            const items = card._attrs("sensor.family_hub_needs_attention").store_items || [];
            const item  = items.find(i => i.item_id === el.dataset.iid);
            if (!item) break;
            card._modal = { type: "edit-store-item", data: { item } };
            card._doRender(true);
            break;
        }
        case "open-add-person":
            card._modal = { type: "add-person", data: {} };
            card._doRender(true);
            break;
        case "open-edit-person":
            card._modal = {
                type: "edit-person",
                data: {
                    pid:    el.dataset.pid,
                    pname:  el.dataset.pname,
                    ptype:  el.dataset.ptype,
                    pcolor: el.dataset.pcolor,
                }
            };
            card._doRender(true);
            break;
        case "open-confirm-remove-person":
            card._modal = { type: "confirm-remove-person", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
            card._doRender(true);
            break;
        case "open-edit-settings":
            card._modal = { type: "edit-settings", data: { fname: el.dataset.fname, ppd: el.dataset.ppd } };
            card._doRender(true);
            break;
        case "open-claim":
            card._modal = { type: "claim", data: { tid: el.dataset.tid, name: el.dataset.name } };
            card._doRender(true);
            break;
        case "open-add-reminder":
            card._modal = { type: "add-reminder", data: { pid: el.dataset.pid || null } };
            card._doRender(true);
            break;

        // ---- Close modal ---------------------------------------------------
        case "close-modal":
            card._closeModal();
            break;

        // ---- Modal OK handlers --------------------------------------------

        case "ok-point-adjust": {
            const amount = parseFloat(v("m-amount"));
            const atype  = v("m-atype");
            const reason = v("m-reason");
            const pid    = v("m-pid");
            const amode  = v("m-amode");
            if (!amount || amount <= 0) break;
            const data = { person_id: pid, reason };
            if (atype === "dollars") data.dollar_amount = amount;
            else data.points = Math.round(amount);
            card._svc(amode === "award" ? "award_bonus_points" : "deduct_points", data);
            card._closeModal();
            break;
        }

        case "ok-add-task": {
            const taskType = v("m-tasktype") || "assigned";
            const name     = v("m-tname").trim();
            if (!name) break;

            if (taskType === "reminder") {
                card._svc("add_chore", {
                    name,
                    description:       v("m-tdesc").trim() || undefined,
                    chore_type:        "reminder",
                    assigned_to:       [v("m-trperson")].filter(Boolean),
                    recurrence_type:   v("m-trrec"),
                    approval_required: false,
                    points:            0,
                    category_label:    "",
                });
            } else if (taskType === "claimable") {
                const cpts    = parseInt(v("m-tcpts") || "20");
                const cexpiry = parseInt(v("m-tcexpiry") || "7");
                card._svc("add_chore", {
                    name,
                    description:        v("m-tdesc").trim() || undefined,
                    chore_type:         "claimable",
                    points:             cpts,
                    approval_required:  false,
                    recurrence_type:    "one_time",
                    expires_after_days: cexpiry,
                    category_label:     "Bonus",
                });
            } else {
                const assigned = _selectedPersonIds("m-tp-person", sr);
                const expiry   = parseInt(v("m-texpiry") || "0");
                const data = {
                    name,
                    description:       v("m-tdesc").trim() || undefined,
                    assigned_to:       assigned,
                    points:            int("m-tpts"),
                    approval_required: b("m-tappr"),
                };
                if (expiry > 0) data.expires_after_days = expiry;
                card._svc("add_task", data);
            }
            card._closeModal();
            break;
        }

        case "ok-add-chore":
        case "ok-edit-chore": {
            const name = v("m-cname").trim();
            if (!name) break;
            const isEdit    = (act === "ok-edit-chore");
            const recType   = v("m-crec");
            const assigned  = _selectedPersonIds("m-assign-person", sr);
            const weekdays  = Array.from(sr.querySelectorAll(".m-wd-day:checked")).map(cb => parseInt(cb.value));
            const dayFilter = Array.from(sr.querySelectorAll(".m-df-day:checked")).map(cb => parseInt(cb.value));

            const data = {
                name,
                chore_type:        v("m-ctype"),
                category_label:    v("m-clabel"),
                assigned_to:       assigned,
                points:            int("m-cpts"),
                approval_required: b("m-cappr"),
                penalty_enabled:   b("m-cpenalty"),
                penalty_points:    int("m-cpenalty-pts"),
            };

            // Only include description if non-empty — avoids sending undefined
            const desc = v("m-cdesc").trim();
            if (desc) data.description = desc;

            // expires_after_days: ONLY include when expiry section is visible
            // AND user entered a positive integer. Never send 0, null, or undefined —
            // add_chore rejects it, and omitting on update_chore leaves existing value intact.
            const expirySection = sr.getElementById("m-chore-expiry-section");
            const expiryVisible = expirySection && expirySection.style.display !== "none";
            if (expiryVisible) {
                const expiryVal = parseInt(v("m-cexpiry") || "0");
                if (expiryVal > 0) data.expires_after_days = expiryVal;
            }

            if (isEdit) {
                data.chore_id   = v("m-cid");
                data.weekdays   = weekdays;
                data.day_filter = dayFilter;
                if (recType === "every_n_days" || recType === "every_n_weeks")
                    data.interval = Math.max(1, int("m-interval"));
                data.recurrence = {
                    type:       recType,
                    weekdays,
                    day_filter: dayFilter,
                    interval:   (recType === "every_n_days" || recType === "every_n_weeks")
                                    ? Math.max(1, int("m-interval")) : 1,
                    ...(recType === "monthly_on_date"
                            ? { day_of_month: Math.max(1, Math.min(31, int("m-dom"))) }
                            : {}),
                };
            } else {
                data.recurrence_type = recType;
                if (weekdays.length)  data.weekdays   = weekdays;
                if (dayFilter.length) data.day_filter = dayFilter;
                if (recType === "every_n_days" || recType === "every_n_weeks")
                    data.interval = Math.max(1, int("m-interval"));
                if (recType === "monthly_on_date")
                    data.day_of_month = Math.max(1, Math.min(31, int("m-dom")));
            }

            card._svc(isEdit ? "update_chore" : "add_chore", data);
            card._closeModal();
            break;
        }

        case "ok-add-store-item": {
            const name   = v("m-sname").trim();
            const dollar = parseFloat(v("m-sdollar"));
            if (!name || !dollar || dollar <= 0) break;
            const scope = v("m-sscope");
            const data  = { name, dollar_value: dollar, scope };
            const desc  = v("m-sdesc").trim();
            if (desc) data.description = desc;
            if (scope === "personal") data.person_ids = _selectedPersonIds("m-sp-person", sr);
            card._svc("add_store_item", data);
            card._closeModal();
            break;
        }

        case "ok-edit-store-item": {
            const iid    = v("m-eiid");
            const name   = v("m-sname").trim();
            const dollar = parseFloat(v("m-sdollar"));
            if (!iid || !name || !dollar || dollar <= 0) break;
            const scope = v("m-sscope");
            const data  = { item_id: iid, name, dollar_value: dollar, scope };
            const desc  = v("m-sdesc").trim();
            if (desc !== undefined) data.description = desc;
            data.person_ids = scope === "personal" ? _selectedPersonIds("m-sp-person", sr) : [];
            card._svc("update_store_item", data);
            card._closeModal();
            break;
        }

        case "ok-add-person": {
            const name = v("m-pname").trim();
            if (!name) break;
            card._svc("add_person", { name, person_type: v("m-ptype"), avatar_color: v("m-pcolor") });
            card._closeModal();
            break;
        }

        case "ok-edit-person": {
            const name = v("m-pname").trim();
            if (!name) break;
            card._svc("update_person", { person_id: v("m-pid"), name, avatar_color: v("m-pcolor"), type: v("m-ptype") });
            card._closeModal();
            break;
        }

        case "ok-remove-person": {
            const pid = v("m-rpid");
            if (!pid) break;
            card._svc("remove_person", { person_id: pid });
            card._closeModal();
            break;
        }

        case "ok-edit-settings": {
            const fname = v("m-fname").trim();
            const ppd   = parseInt(v("m-ppd") || "10");
            if (!fname) break;
            card._svc("update_settings", { family_name: fname, points_per_dollar: ppd });
            card._closeModal();
            break;
        }

        case "ok-claim": {
            const tid = v("m-cltid");
            const pid = v("m-clperson");
            if (!tid || !pid) break;
            card._svc("claim_task", { task_id: tid, person_id: pid });
            card._closeModal();
            break;
        }

        case "ok-add-reminder": {
            const name = v("m-rname").trim();
            const pid  = v("m-rperson");
            if (!name || !pid) break;
            card._svc("add_chore", {
                name,
                chore_type:        "reminder",
                assigned_to:       [pid],
                recurrence_type:   v("m-rrec"),
                approval_required: false,
                points:            0,
                category_label:    "",
            });
            card._closeModal();
            break;
        }
    }
}

// ---------------------------------------------------------------------------
// Internal helper: read all checked checkboxes with a given class
// ---------------------------------------------------------------------------

function _selectedPersonIds(cbClass, sr) {
    return Array.from(
        sr.querySelectorAll(`.${cbClass}:checked`)
    ).map(cb => cb.value);
}
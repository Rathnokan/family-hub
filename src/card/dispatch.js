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

        // Navigate to a view (pushes current view onto back stack)
        case "nav": {
            const target = el.dataset.navView;
            if (!target) break;
            card._backStack.push(card._view || "home");
            card._view = target;
            card._doRender(true);
            break;
        }

        // Navigate back (pops back stack, falls back to home)
        case "nav-back":
            card._view = card._backStack.pop() || "home";
            card._doRender(true);
            break;

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

        // ---- Admin chore table (S9 P3 item 5) --------------------------------

        // Select a chore row → open inline editor panel at ≥1280px
        case "select-chore-row":
            card._adminSelectedChoreId = el.dataset.cid || null;
            card._doRender(true);
            break;

        // Close inline editor panel (✕ button or after save)
        case "close-chore-panel":
            card._adminSelectedChoreId = null;
            card._choreFormTab = "details";
            card._doRender(true);
            break;

        // Chore form tab switch (modal + inline panel) — CSS-only swap to preserve
        // user input on inactive panes. NO _doRender call: panes are all already in DOM.
        case "chore-tab": {
            const tab = el.dataset.tab;
            if (!tab) break;
            card._choreFormTab = tab;
            sr.querySelectorAll(".fh-chore-tab").forEach(btn => {
                btn.classList.toggle("active", btn.dataset.tab === tab);
            });
            sr.querySelectorAll(".fh-chore-tab-pane").forEach(p => {
                p.style.display = p.dataset.tab === tab ? "" : "none";
            });
            card._syncModalUI();   // re-evaluate conditional sub-sections on the newly visible pane
            break;
        }

        // Sort chore table — click same col twice reverses, third click clears
        case "sort-admin-chores": {
            const col = el.dataset.col || null;
            if (!col) {
                card._adminSort = { col: null, dir: "asc" };
            } else {
                const cur = card._adminSort || { col: null, dir: "asc" };
                if (cur.col === col) {
                    card._adminSort = cur.dir === "asc"
                        ? { col, dir: "desc" }
                        : { col: null, dir: "asc" };  // third click clears
                } else {
                    card._adminSort = { col, dir: "asc" };
                }
            }
            card._doRender(true);
            break;
        }

        // Collapse / expand a category group header
        case "toggle-admin-cat": {
            const cat = el.dataset.cat;
            if (!cat) break;
            if (!card._adminCollapsedCats) card._adminCollapsedCats = new Set();
            if (card._adminCollapsedCats.has(cat)) card._adminCollapsedCats.delete(cat);
            else card._adminCollapsedCats.add(cat);
            card._doRender(true);
            break;
        }

        // ---- Task completion -----------------------------------------------
        case "complete": {
            const tid      = el.dataset.tid;
            const pid      = el.dataset.pid;
            if (!tid || !pid) break;

            // Milestone celebration: fires when completing this task would hit the threshold
            const streak    = parseInt(el.dataset.streak    || "0");
            const milestone = parseInt(el.dataset.milestone || "0");
            if (milestone > 0 && (streak + 1) % milestone === 0) {
                card._celebration = { name: el.dataset.name || "Mission", streak: streak + 1 };
                setTimeout(() => {
                    if (card._celebration) { card._celebration = null; card._doRender(true); }
                }, 3000);
            }

            card._svc("complete_task", { task_id: tid, person_id: pid });
            card._flashing.add(tid);
            card._pendingSubmit.add(tid);   // optimistic — button shows "Pending Approval" until sensor refresh
            card._doRender(true);
            setTimeout(() => {
                card._flashing.delete(tid);
                card._doRender(false);
            }, FLASH_MS + 50);
            // Clear optimistic state after the 30s sensor poll has surely landed.
            setTimeout(() => {
                if (card._pendingSubmit.has(tid)) {
                    card._pendingSubmit.delete(tid);
                    card._doRender(false);
                }
            }, 35000);
            break;
        }

        // ---- Dismiss milestone celebration ---------------------------------
        case "dismiss-celebration":
            card._celebration = null;
            card._doRender(true);
            break;

        // ---- Description toggle --------------------------------------------
        case "toggle-desc": {
            const id = el.dataset.id;
            if (card._expandedDescs.has(id)) card._expandedDescs.delete(id);
            else card._expandedDescs.add(id);
            card._doRender(true);
            break;
        }

        // ---- Skipped-group expand/collapse ---------------------------------
        case "toggle-skipped-group": {
            const key = el.dataset.key;
            if (card._expandedSkippedDates.has(key)) card._expandedSkippedDates.delete(key);
            else card._expandedSkippedDates.add(key);
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
            card._adminSelectedChoreId = null;  // close inline panel if it was showing this chore
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

        // ---- Hub Layout save (S9 P3) ---------------------------------------
        // Reads all room visibility toggles + weather entity + calendar
        // entities from the panel and pushes one update_settings call.
        case "save-hub-layout": {
            const roomsCfg = {};
            sr.querySelectorAll(".fh-hub-room-toggle").forEach(input => {
                const id = input.dataset.roomId;
                if (!id) return;
                roomsCfg[id] = { status: input.checked ? "live" : "hidden" };
            });
            const weather = sr.getElementById("m-hub-weather")?.value?.trim() || "";
            const calRaw  = sr.getElementById("m-hub-calendars")?.value || "";
            const calendars = calRaw
                .split(/[\n,]+/)
                .map(s => s.trim())
                .filter(Boolean);
            card._svc("update_settings", {
                rooms_config:            roomsCfg,
                weather_entity:          weather,
                today_calendar_entities: calendars,
            });
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

        case "rebuild-data":
            if (!confirm(
                "Rebuild data?\n\n" +
                "This will remove ghost records, orphaned instances, and duplicates. " +
                "A summary will appear as a Home Assistant notification.\n\n" +
                "This cannot be undone."
            )) break;
            card._svc("rebuild_data", {});
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
            // Close inline panel first — modal and panel share m-* element IDs
            card._adminSelectedChoreId = null;
            card._modal = { type: "add-chore", data: {} };
            card._doRender(true);
            break;
        case "open-edit-chore": {
            const chores = card._attrs("sensor.family_hub_needs_attention").active_chores || [];
            const chore  = chores.find(c => c.chore_id === el.dataset.cid);
            if (!chore) break;
            // Close inline panel first — modal and panel share m-* element IDs
            card._adminSelectedChoreId = null;
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
                    pid:            el.dataset.pid,
                    pname:          el.dataset.pname,
                    ptype:          el.dataset.ptype,
                    pcolor:         el.dataset.pcolor,
                    allowancePts:   parseInt(el.dataset.pallowpts   || "0"),
                    allowanceSched: el.dataset.pallowsched           || "weekly",
                    allowanceWday:  parseInt(el.dataset.pallowwday  ?? "5"),
                    allowanceMday:  parseInt(el.dataset.pallowmday  || "1"),
                    notifyTarget:   el.dataset.pnotify               || "",
                    code:           el.dataset.pcode                 || "",
                    theme:          el.dataset.ptheme                || "classic",
                    rankIdx:        parseInt(el.dataset.prankidx     || "0"),
                    dropThr:        el.dataset.pdropThr              || "",
                    gainThr:        el.dataset.pgainThr              || "",
                    childMode:      el.dataset.pchildmode === "true",
                }
            };
            card._doRender(true);
            break;
        case "open-confirm-remove-person":
            card._modal = { type: "confirm-remove-person", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
            card._doRender(true);
            break;
        case "open-edit-settings":
            card._modal = { type: "edit-settings", data: {
                fname:          el.dataset.fname,
                ppd:            el.dataset.ppd,
                penaltyAlertTime: parseInt(el.dataset.palerttime  ?? "800"),
                rankWeekday:    parseInt(el.dataset.rankweekday   ?? "0"),
                rankDrop:       parseInt(el.dataset.rankdrop      ?? "50"),
                rankGain:       parseInt(el.dataset.rankgain      ?? "75"),
            } };
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
        case "open-edit-streaks":
            card._modal = { type: "edit-streaks", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
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
            const ctype     = v("m-ctype");
            const assigned  = _selectedPersonIds("m-assign-person", sr);
            const weekdays  = Array.from(sr.querySelectorAll(".m-wd-day:checked")).map(cb => parseInt(cb.value));
            const dayFilter = Array.from(sr.querySelectorAll(".m-df-day:checked")).map(cb => parseInt(cb.value));

            const iconVal = v("m-cicon").trim().toLowerCase();
            const data = {
                name,
                chore_type:        ctype,
                category_label:    v("m-clabel"),
                assigned_to:       assigned,
                points:            int("m-cpts"),
                approval_required: b("m-cappr"),
                penalty_enabled:   b("m-cpenalty"),
                penalty_points:    int("m-cpenalty-pts"),
                icon:              iconVal,
            };

            // Daily penalty threshold — only when penalty enabled and value > 0
            if (b("m-cpenalty")) {
                const thresh = parseInt(v("m-daily-threshold") || "0");
                if (thresh > 0) data.daily_penalty_after_days = thresh;
            }

            // Claimable subtype fields — only for claimable chores
            if (ctype === "claimable") {
                data.claimable_subtype = v("m-csubtype") || "fcfs";
                if (data.claimable_subtype === "multi_claim") {
                    data.max_claimants         = Math.max(2, int("m-max-claimants") || 2);
                    data.multi_claim_points_mode = v("m-points-mode") || "full";
                }
            }

            // Only include description if non-empty
            const desc = v("m-cdesc").trim();
            if (desc) data.description = desc;

            // expires_after_days: ONLY include when expiry section is visible
            // AND user entered a positive integer. Never send 0, null, or undefined.
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
                data.recurrence = {
                    type:       recType,
                    weekdays,
                    day_filter: dayFilter,
                    ...(recType === "monthly_on_date"
                            ? { day_of_month: Math.max(1, Math.min(31, int("m-dom"))) }
                            : {}),
                };
            } else {
                data.recurrence_type = recType;
                if (weekdays.length)  data.weekdays   = weekdays;
                if (dayFilter.length) data.day_filter = dayFilter;
                if (recType === "monthly_on_date")
                    data.day_of_month = Math.max(1, Math.min(31, int("m-dom")));
            }

            // Streak milestone — always include (0 = disabled)
            data.streak_milestone    = Math.max(0, int("m-streak-milestone") || 0);
            data.streak_bonus_points = Math.max(0, int("m-streak-bonus") || 0);

            // Reminder time — HHMM int, -1 = off
            const rtRaw = parseInt(v("m-reminder-time") ?? "-1");
            data.reminder_time = isNaN(rtRaw) ? -1 : rtRaw;

            card._svc(isEdit ? "update_chore" : "add_chore", data);
            card._closeModal();
            break;
        }

        // Inline panel save — same logic as ok-edit-chore but closes panel instead of modal
        case "ok-edit-chore-inline": {
            const name = v("m-cname").trim();
            if (!name) break;
            const recType   = v("m-crec");
            const ctype     = v("m-ctype");
            const assigned  = _selectedPersonIds("m-assign-person", sr);
            const weekdays  = Array.from(sr.querySelectorAll(".m-wd-day:checked")).map(cb => parseInt(cb.value));
            const dayFilter = Array.from(sr.querySelectorAll(".m-df-day:checked")).map(cb => parseInt(cb.value));
            const iconVal   = v("m-cicon").trim().toLowerCase();

            const data = {
                chore_id:          v("m-cid"),
                name,
                chore_type:        ctype,
                category_label:    v("m-clabel"),
                assigned_to:       assigned,
                points:            int("m-cpts"),
                approval_required: b("m-cappr"),
                penalty_enabled:   b("m-cpenalty"),
                penalty_points:    int("m-cpenalty-pts"),
                icon:              iconVal,
                weekdays,
                day_filter:        dayFilter,
                recurrence: {
                    type:       recType,
                    weekdays,
                    day_filter: dayFilter,
                    ...(recType === "monthly_on_date"
                            ? { day_of_month: Math.max(1, Math.min(31, int("m-dom"))) }
                            : {}),
                },
            };

            if (b("m-cpenalty")) {
                const thresh = parseInt(v("m-daily-threshold") || "0");
                if (thresh > 0) data.daily_penalty_after_days = thresh;
            }

            if (ctype === "claimable") {
                data.claimable_subtype = v("m-csubtype") || "fcfs";
                if (data.claimable_subtype === "multi_claim") {
                    data.max_claimants          = Math.max(2, int("m-max-claimants") || 2);
                    data.multi_claim_points_mode = v("m-points-mode") || "full";
                }
            }

            const desc = v("m-cdesc").trim();
            if (desc) data.description = desc;

            const expirySection = sr.getElementById("m-chore-expiry-section");
            const expiryVisible = expirySection && expirySection.style.display !== "none";
            if (expiryVisible) {
                const expiryVal = parseInt(v("m-cexpiry") || "0");
                if (expiryVal > 0) data.expires_after_days = expiryVal;
            }

            data.streak_milestone    = Math.max(0, int("m-streak-milestone") || 0);
            data.streak_bonus_points = Math.max(0, int("m-streak-bonus") || 0);

            const rtRaw = parseInt(v("m-reminder-time") ?? "-1");
            data.reminder_time = isNaN(rtRaw) ? -1 : rtRaw;

            card._svc("update_chore", data);
            card._adminSelectedChoreId = null;  // close panel after save
            card._choreFormTab = "details";
            card._doRender(true);
            break;
        }

        case "set-streak": {
            const cid   = el.dataset.cid;
            const pid   = el.dataset.pid;
            const count = Math.max(0, parseInt(sr.getElementById(`m-streak-${cid}`)?.value || "0"));
            card._svc("set_streak", { person_id: pid, chore_id: cid, count });
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
            const dropThrStr = v("m-pdropThr").trim();
            const gainThrStr = v("m-pgainThr").trim();
            card._svc("update_person", {
                person_id:              v("m-pid"),
                name,
                avatar_color:           v("m-pcolor"),
                type:                   v("m-ptype"),
                allowance_points:       parseInt(v("m-allowance-pts")   || "0"),
                allowance_schedule:     v("m-allowance-schedule"),
                allowance_weekday:      parseInt(v("m-allowance-weekday")),
                allowance_monthday:     parseInt(v("m-allowance-monthday")),
                notify_target:          v("m-pnotify").trim(),
                code:                   v("m-pcode").trim().toUpperCase(),
                theme_key:              v("m-ptheme"),
                rank_index:             parseInt(v("m-prankidx") || "0"),
                rank_drop_threshold:    dropThrStr !== "" ? parseInt(dropThrStr) : null,
                rank_gain_threshold:    gainThrStr !== "" ? parseInt(gainThrStr) : null,
                child_mode:             b("m-pchildmode"),
            });
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
            const fname     = v("m-fname").trim();
            const ppd       = parseInt(v("m-ppd") || "10");
            const alertTime = parseInt(v("m-alert-time") ?? "-1");
            if (!fname) break;
            card._svc("update_settings", {
                family_name:          fname,
                points_per_dollar:    ppd,
                penalty_alert_time:   isNaN(alertTime) ? 800 : alertTime,
                rank_eval_weekday:    parseInt(v("m-rank-weekday")  || "0"),
                rank_drop_threshold:  parseInt(v("m-rank-drop")     || "50"),
                rank_gain_threshold:  parseInt(v("m-rank-gain")     || "75"),
            });
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

        // ---- Icon picker (always-visible grid, no dropdown) -----------------
        // Selection only — no preview/grid-toggle DOM. The hidden m-cicon input
        // carries the value to the save handlers.
        case "pick-icon": {
            const key    = el.dataset.icon;
            const hidden = sr.getElementById("m-cicon");
            if (hidden) hidden.value = key;
            sr.querySelectorAll(".fh-icon-cell").forEach(
                cell => cell.classList.toggle("selected", cell.dataset.icon === key)
            );
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
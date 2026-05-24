/**
 * Family Hub Card — Event Dispatcher
 * Handles all data-act click events. Called by FamilyHubCard._dispatch().
 * Reads form values, calls services, opens/closes modals, updates UI state.
 */

import { FLASH_MS, CHORE_TEMPLATES } from "./constants.js";
import { rotationPoolEditor } from "./modals.js";
import { openPrintableChoreList } from "./print-chore-list.js";

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

        // ---- Admin rewards section -------------------------------------------

        case "select-store-row":
            card._adminSelectedItemId = el.dataset.iid || null;
            card._adminSelectedChoreId = null;
            card._doRender(true);
            break;

        case "close-store-panel":
            card._adminSelectedItemId = null;
            card._doRender(true);
            break;

        case "sort-admin-store-items": {
            const col = el.dataset.col || null;
            if (!col) {
                card._adminSortItems = { col: null, dir: "asc" };
            } else {
                const cur = card._adminSortItems || { col: null, dir: "asc" };
                if (cur.col === col) {
                    card._adminSortItems = cur.dir === "asc"
                        ? { col, dir: "desc" }
                        : { col: null, dir: "asc" };
                } else {
                    card._adminSortItems = { col, dir: "asc" };
                }
            }
            card._doRender(true);
            break;
        }

        case "store-item-filter":
            card._storeItemFilter = el.dataset.fval || null;
            card._doRender(true);
            break;

        case "toggle-admin-reward-cat": {
            const cat = el.dataset.cat;
            if (!cat) break;
            if (!card._adminCollapsedRewardCats) card._adminCollapsedRewardCats = new Set();
            if (card._adminCollapsedRewardCats.has(cat)) card._adminCollapsedRewardCats.delete(cat);
            else card._adminCollapsedRewardCats.add(cat);
            card._doRender(true);
            break;
        }

        case "ok-edit-store-item-inline": {
            const iid    = v("m-eiid");
            const name   = v("m-sname").trim();
            const dollar = parseFloat(v("m-sdollar"));
            if (!iid || !name || !dollar || dollar <= 0) break;
            const isGroup = sr.querySelector("#m-sgroup")?.checked || false;
            let scope = v("m-sscope");
            const data  = {
                item_id:        iid,
                name,
                dollar_value:   dollar,
                scope,
                description:    v("m-sdesc").trim(),
                category_label: v("m-scat") || "",
                max_per_period: parseInt(v("m-smaxperiod") || "0"),
                period:         v("m-speriod") || "week",
                active:         sr.querySelector("#m-sactive")?.checked !== false,
                icon:           _normalizeIcon(v("m-cicon")),
            };
            if (isGroup) {
                const contribs = [...sr.querySelectorAll(".m-scontrib")]
                    .filter(inp => parseInt(inp.value) > 0)
                    .map(inp => ({ person_id: inp.dataset.pid, share_pct: parseInt(inp.value) }));
                if (contribs.length === 0) {
                    alert("Group reward needs at least one contributor with a share > 0%.");
                    break;
                }
                const total = contribs.reduce((s, c) => s + c.share_pct, 0);
                if (total !== 100) {
                    alert(`Contributor shares must sum to exactly 100% (currently ${total}%). Use the "Equal split" button or adjust manually.`);
                    break;
                }
                data.is_group_reward = true;
                data.contributors    = contribs;
                data.scope           = "personal";
                data.person_ids      = contribs.map(c => c.person_id);
            } else {
                // Only explicitly clear group fields if this item was previously a group
                // reward (look up the original from the sensor since the panel doesn't
                // capture it like the modal does via card._modal.data.item)
                const origItems = card._attrs("sensor.family_hub_needs_attention").store_items || [];
                const origItem  = origItems.find(i => i.item_id === iid);
                if (origItem?.is_group_reward) {
                    data.is_group_reward = false;
                    data.contributors    = [];
                }
                data.person_ids = scope === "personal" ? _selectedPersonIds("m-sp-person", sr) : [];
            }
            console.log("[family-hub] update_store_item (inline) payload:", JSON.parse(JSON.stringify(data)));
            card._svc("update_store_item", data);
            card._adminSelectedItemId = null;
            card._doRender(true);
            break;
        }

        case "save-rank-ppd-ladder": {
            const inputs = sr.querySelectorAll(".fh-ad-rank-ladder-input");
            const ladder = [];
            let valid = true;
            inputs.forEach(inp => {
                const val = parseFloat(inp.value);
                if (isNaN(val) || val <= 0) { valid = false; return; }
                ladder.push(val);
            });
            if (!valid || !ladder.length) break;
            card._svc("update_settings", { rank_ppd_ladder: ladder });
            break;
        }

        // ---- Tasks category collapse ----------------------------------------

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

        // ---- Group reward: chip-in (v0.6.3 item 13) -----------------------
        case "open-chip-in": {
            const iid       = el.dataset.iid;
            const pid       = el.dataset.pid;
            const remaining = parseInt(el.dataset.remaining || "0");
            const balance   = parseInt(el.dataset.balance   || "0");
            // Find the store item from the person's sensor
            const person    = card._people().find(p => p.person_id === pid);
            const pAttrKey  = person
                ? `sensor.family_hub_${person.name.toLowerCase().replace(/ /g, "_")}`
                : null;
            const pAttrs    = pAttrKey ? (card._hass?.states?.[pAttrKey]?.attributes || {}) : {};
            const storeItem = (pAttrs.store_items || []).find(i => i.item_id === iid) || { item_id: iid, name: "reward" };
            card._modal = { type: "chip-in", data: { item: storeItem, pid, balance, remaining } };
            card._doRender(true);
            break;
        }

        case "ok-chip-in": {
            const pts = parseInt(v("m-chipin-pts") || "0");
            const iid = v("m-chipin-iid");
            const pid = v("m-chipin-pid");
            if (!pts || pts <= 0 || !iid || !pid) {
                alert("Please enter a valid number of points.");
                break;
            }
            card._svc("chip_in_group_reward", { item_id: iid, person_id: pid, points: pts });
            card._modal = null;
            card._doRender(true);
            break;
        }

        // ---- Group reward: kid accept/decline proposal (v0.6.3 item 13) ---
        case "accept-group-proposal":
            card._svc("respond_group_proposal", {
                proposal_id: el.dataset.propid,
                person_id:   el.dataset.pid,
                accept:      true,
            });
            break;

        case "decline-group-proposal":
            if (!confirm("Decline this group reward proposal?")) break;
            card._svc("respond_group_proposal", {
                proposal_id: el.dataset.propid,
                person_id:   el.dataset.pid,
                accept:      false,
            });
            break;

        // ---- Group reward: admin approve/decline proposal ------------------
        case "approve-group-proposal":
            card._svc("approve_group_proposal", {
                proposal_id: el.dataset.propid,
                approved_by: el.dataset.by || "admin",
            });
            break;

        case "decline-group-proposal-parent":
            if (!confirm("Decline this group reward proposal?")) break;
            card._svc("decline_group_proposal", {
                proposal_id: el.dataset.propid,
                declined_by: el.dataset.by || "admin",
            });
            break;

        // ---- Group reward: admin redeem fully-funded reward ----------------
        case "redeem-group-reward":
            if (!confirm(`Mark "${el.dataset.iname}" as redeemed?\n\nThis will mark the reward inactive.`)) break;
            card._svc("redeem_group_reward", {
                item_id:     el.dataset.iid,
                redeemed_by: "admin",
            });
            break;

        // ---- Store goal toggle (v0.6.3) ------------------------------------
        // Tapping a star sets that item as the kid's goal; tapping the active
        // star clears the goal. The set/clear decision is local — the dispatch
        // handler reads the current goal from the per-person sensor.
        case "toggle-goal": {
            const pid = el.dataset.pid;
            const iid = el.dataset.iid;
            if (!pid || !iid) break;
            const person = card._people().find(p => p.person_id === pid);
            if (!person) break;
            const attrs = card._hass?.states?.[`sensor.family_hub_${person.name.toLowerCase().replace(/ /g, "_")}`]?.attributes || {};
            const newGoal = (attrs.goal_item_id === iid) ? "" : iid;
            card._svc("update_person", { person_id: pid, goal_item_id: newGoal });
            break;
        }

        // ---- Delete chore --------------------------------------------------
        case "delete-chore":
            if (!confirm(`Delete "${el.dataset.cname}"?\n\nThis cannot be undone.`)) break;
            card._adminSelectedChoreId = null;  // close inline panel if it was showing this chore
            card._svc("delete_chore", { chore_id: el.dataset.cid });
            break;

        // ---- Delete store item (soft — deactivate) -------------------------
        case "delete-store-item":
            if (!confirm(`Deactivate reward "${el.dataset.iname}"?\n\nIt will be hidden from kids but stays in the list as [inactive]. Use "Delete permanently" in the edit panel to remove it completely.`)) break;
            card._svc("delete_store_item", { item_id: el.dataset.iid });
            break;

        // ---- Hard-delete store item (permanent) ----------------------------
        case "hard-delete-store-item":
            if (!confirm(`Permanently delete "${el.dataset.iname}"?\n\nThis cannot be undone. Any pending redemption requests for this reward will be cancelled.`)) break;
            card._adminSelectedItemId = null;
            card._svc("hard_delete_store_item", { item_id: el.dataset.iid });
            card._doRender(true);
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

        // ---- Print chore list (v0.6.3) -------------------------------------
        // Opens a self-contained HTML doc in a new tab. The handler runs in
        // the click event so pop-up blockers should let the window.open through.
        case "print-chore-list":
            openPrintableChoreList(card);
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
            // Close any open inline edit panel — modal and panel share m-* IDs,
            // which makes the add modal pre-populate with the editing item's data.
            card._adminSelectedItemId = null;
            card._modal = { type: "add-store-item", data: {} };
            card._doRender(true);
            break;
        case "open-edit-store-item": {
            const items = card._attrs("sensor.family_hub_needs_attention").store_items || [];
            const item  = items.find(i => i.item_id === el.dataset.iid);
            if (!item) break;
            card._adminSelectedItemId = null;  // close inline panel — modal and panel share m-* IDs
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
                    // v0.6.1: success-rate streak knobs (set via Edit Person modal)
                    completionThreshold:   parseInt(el.dataset.pcompletionthreshold ?? "80"),
                    completionMilestone:   parseInt(el.dataset.pcompletionmilestone ?? "7"),
                    completionBonusPoints: parseInt(el.dataset.pcompletionbonus     ?? "50"),
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

            const iconVal = _normalizeIcon(v("m-cicon"));
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

            // Rotation — only honored for assigned chores. Always send the
            // fields (empty pool = disabled) so toggling off cleanly clears
            // the prior configuration.
            if (ctype === "assigned") {
                const rotOn   = b("m-crot-enabled");
                const poolStr = v("m-crot-pool-order") || "";
                const pool    = rotOn && poolStr ? poolStr.split(",").filter(Boolean) : [];
                data.rotation_pool    = pool;
                data.rotation_cadence = (rotOn && pool.length) ? (v("m-crot-cadence") || "per_instance") : "";
            } else {
                data.rotation_pool    = [];
                data.rotation_cadence = "";
            }

            // Diagnostic: log payload so we can see what the dispatch is sending
            console.log(`[family-hub] ${isEdit ? "update_chore" : "add_chore"} payload:`, JSON.parse(JSON.stringify(data)));
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
            const iconVal   = _normalizeIcon(v("m-cicon"));

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

            if (ctype === "assigned") {
                const rotOn   = b("m-crot-enabled");
                const poolStr = v("m-crot-pool-order") || "";
                const pool    = rotOn && poolStr ? poolStr.split(",").filter(Boolean) : [];
                data.rotation_pool    = pool;
                data.rotation_cadence = (rotOn && pool.length) ? (v("m-crot-cadence") || "per_instance") : "";
            } else {
                data.rotation_pool    = [];
                data.rotation_cadence = "";
            }

            console.log("[family-hub] update_chore (inline) payload:", JSON.parse(JSON.stringify(data)));
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

        // ---- Rotation pool editor (chore form) -----------------------------
        // All four handlers read the hidden CSV input, mutate the order, and
        // repaint the widget in place. The hidden input is the source of
        // truth; chore-save reads it directly.
        case "rot-pool-add":
        case "rot-pool-remove":
        case "rot-pool-up":
        case "rot-pool-down": {
            const pid     = el.dataset.pid;
            const hidden  = sr.getElementById("m-crot-pool-order");
            const widget  = sr.getElementById("m-crot-pool-widget");
            if (!pid || !hidden || !widget) break;
            const order = hidden.value ? hidden.value.split(",").filter(Boolean) : [];
            const idx   = order.indexOf(pid);
            if (act === "rot-pool-add") {
                if (idx === -1) order.push(pid);
            } else if (act === "rot-pool-remove") {
                if (idx !== -1) order.splice(idx, 1);
            } else if (act === "rot-pool-up" && idx > 0) {
                [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
            } else if (act === "rot-pool-down" && idx !== -1 && idx < order.length - 1) {
                [order[idx + 1], order[idx]] = [order[idx], order[idx + 1]];
            }
            hidden.value = order.join(",");
            widget.innerHTML = rotationPoolEditor(card._people(), order);
            break;
        }

        case "ok-add-store-item": {
            const name   = v("m-sname").trim();
            const dollar = parseFloat(v("m-sdollar"));
            if (!name || !dollar || dollar <= 0) break;
            const isGroup = sr.querySelector("#m-sgroup")?.checked || false;
            let scope = v("m-sscope");
            const data  = {
                name,
                dollar_value:   dollar,
                scope,
                description:    v("m-sdesc").trim(),
                category_label: v("m-scat") || "",
                max_per_period: parseInt(v("m-smaxperiod") || "0"),
                period:         v("m-speriod") || "week",
                icon:           _normalizeIcon(v("m-cicon")),
            };
            if (isGroup) {
                const contribs = [...sr.querySelectorAll(".m-scontrib")]
                    .filter(inp => parseInt(inp.value) > 0)
                    .map(inp => ({ person_id: inp.dataset.pid, share_pct: parseInt(inp.value) }));
                if (contribs.length === 0) {
                    alert("Group reward needs at least one contributor with a share > 0%.");
                    break;
                }
                const total = contribs.reduce((s, c) => s + c.share_pct, 0);
                if (total !== 100) {
                    alert(`Contributor shares must sum to exactly 100% (currently ${total}%). Use the "Equal split" button or adjust manually.`);
                    break;
                }
                data.is_group_reward = true;
                data.contributors    = contribs;
                data.scope           = "personal";
                data.person_ids      = contribs.map(c => c.person_id);
            } else {
                // Don't send group reward fields for regular items — old schema
                // compatibility (safe to omit; backend defaults to false/[])
                if (scope === "personal") data.person_ids = _selectedPersonIds("m-sp-person", sr);
            }
            card._svc("add_store_item", data);
            card._closeModal();
            break;
        }

        case "ok-edit-store-item": {
            const iid    = v("m-eiid");
            const name   = v("m-sname").trim();
            const dollar = parseFloat(v("m-sdollar"));
            if (!iid || !name || !dollar || dollar <= 0) break;
            const isGroup = sr.querySelector("#m-sgroup")?.checked || false;
            let scope = v("m-sscope");
            const data  = {
                item_id:        iid,
                name,
                dollar_value:   dollar,
                scope,
                description:    v("m-sdesc").trim(),
                category_label: v("m-scat") || "",
                max_per_period: parseInt(v("m-smaxperiod") || "0"),
                period:         v("m-speriod") || "week",
                active:         sr.querySelector("#m-sactive")?.checked !== false,
                icon:           _normalizeIcon(v("m-cicon")),
            };
            if (isGroup) {
                const contribs = [...sr.querySelectorAll(".m-scontrib")]
                    .filter(inp => parseInt(inp.value) > 0)
                    .map(inp => ({ person_id: inp.dataset.pid, share_pct: parseInt(inp.value) }));
                if (contribs.length === 0) {
                    alert("Group reward needs at least one contributor with a share > 0%.");
                    break;
                }
                const total = contribs.reduce((s, c) => s + c.share_pct, 0);
                if (total !== 100) {
                    alert(`Contributor shares must sum to exactly 100% (currently ${total}%). Use the "Equal split" button or adjust manually.`);
                    break;
                }
                data.is_group_reward = true;
                data.contributors    = contribs;
                data.scope           = "personal";
                data.person_ids      = contribs.map(c => c.person_id);
            } else {
                // Only explicitly clear group fields if this item was previously a group reward
                // (avoids sending unknown fields to old schema before HA restart)
                if (card._modal?.data?.item?.is_group_reward) {
                    data.is_group_reward = false;
                    data.contributors    = [];
                }
                data.person_ids = scope === "personal" ? _selectedPersonIds("m-sp-person", sr) : [];
            }
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
                // v0.6.1: success-rate person streak knobs
                completion_threshold_pct: Math.max(1, Math.min(100, int("m-completion-threshold") || 80)),
                completion_milestone:     Math.max(0, int("m-completion-milestone") || 0),
                completion_bonus_points:  Math.max(0, int("m-completion-bonus")     || 0),
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
            // v0.6.1: card-grid picker passes data-tid + data-pid on the tile button.
            // Fall back to hidden inputs from any legacy modal path that still uses them.
            const tid = el.dataset.tid || v("m-cltid");
            const pid = el.dataset.pid || v("m-clperson");
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

        // ---- Chore template picker (v0.6.3 item 8) --------------------------
        // Reads the selected template key from #m-ctpl and pre-populates the
        // add-chore form fields. Parent can edit anything before saving.
        case "pick-template": {
            const key = sr.getElementById("m-ctpl")?.value;
            if (!key) break;
            const tpl = CHORE_TEMPLATES.find(t => t.key === key);
            if (!tpl) break;

            const setVal = (id, val) => {
                const el2 = sr.getElementById(id);
                if (el2 !== null) el2.value = val;
            };

            setVal("m-cname", tpl.name);
            setVal("m-cdesc", tpl.description || "");

            // Set category if the template category appears in the select options
            const catEl = sr.getElementById("m-clabel");
            if (catEl && tpl.category) {
                const opt = [...catEl.options].find(o => o.value === tpl.category);
                if (opt) catEl.value = tpl.category;
            }

            // Set points (on the rewards tab — pre-populate even if not visible)
            if (tpl.points) setVal("m-cpts", tpl.points);

            // Focus the name field so parent can tweak it immediately
            sr.getElementById("m-cname")?.focus();
            break;
        }

        // ---- Icon picker — grid in the Icon tab; updates hidden input + preview
        case "pick-icon": {
            const key    = el.dataset.icon;
            const hidden = sr.getElementById("m-cicon");
            if (hidden) hidden.value = key;
            // Clear any custom uploaded preview when switching back to a built-in icon
            const prev = sr.getElementById("m-cicon-preview");
            if (prev) prev.innerHTML = "";
            sr.querySelectorAll(".fh-icon-cell").forEach(
                cell => cell.classList.toggle("selected", cell.dataset.icon === key)
            );
            // Update the selected-icon preview at top of Icon tab
            const sel = sr.getElementById("m-icon-selected");
            if (sel) {
                const svgSpan = el.querySelector("span:first-child");
                const lbl     = el.title || key;
                sel.innerHTML =
                    `<span class="fh-icon-sel-icon" style="display:inline-flex;width:20px;height:20px;color:var(--fh-accent)">` +
                    (svgSpan ? svgSpan.innerHTML : "") +
                    `</span> <span class="fh-icon-sel-lbl">${lbl}</span>`;
            }
            break;
        }

        // ---- Custom image upload for reward icon
        // Triggers the persistent <input id="m-icon-upload"> inside the modal.
        // Actual file processing happens in handleIconFileSelection (called from
        // FamilyHubCard's change listener when that input's value changes).
        case "upload-icon": {
            const fileInput = sr.getElementById("m-icon-upload");
            if (!fileInput) {
                console.warn("[family-hub] upload-icon: hidden file input not found");
                break;
            }
            // Reset value so picking the same file twice still fires change
            fileInput.value = "";
            fileInput.click();
            break;
        }

        case "clear-icon": {
            const hidden  = sr.getElementById("m-cicon");
            if (hidden) hidden.value = "";
            const preview = sr.getElementById("m-cicon-preview");
            if (preview) preview.innerHTML = "";
            sr.querySelectorAll(".fh-icon-cell.selected").forEach(c => c.classList.remove("selected"));
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

/**
 * Normalize an icon value for storage. Built-in icon keys ("candy", "snack")
 * are stored lowercase by convention. But uploaded image data URLs
 * ("data:image/png;base64,iVBORw0...") MUST NOT be lowercased — base64 is
 * case-sensitive, and lowercasing produces an invalid encoding that renders
 * as a broken image. This helper preserves data URLs as-is.
 */
function _normalizeIcon(raw) {
    const s = (raw || "").trim();
    if (!s) return "";
    if (s.startsWith("data:")) return s;     // preserve data URLs verbatim
    return s.toLowerCase();
}

/**
 * Handle the change event on the persistent <input id="m-icon-upload"> inside
 * a reward modal. Reads the file, downsizes it to <=128x128, encodes as PNG
 * data URL, stuffs it into #m-cicon, and renders a preview chip above the
 * icon grid. Called from FamilyHubCard's shadow-root change listener.
 */
export function handleIconFileSelection(fileInput, sr) {
    const file = fileInput?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        alert("Image too large. Please pick a file under 5 MB.");
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            const MAX = 128;
            let w = img.width, h = img.height;
            if (w > h) {
                if (w > MAX) { h = Math.round((h * MAX) / w); w = MAX; }
            } else {
                if (h > MAX) { w = Math.round((w * MAX) / h); h = MAX; }
            }
            const canvas = document.createElement("canvas");
            canvas.width  = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL("image/png");
            if (dataUrl.length > 350 * 1024) {
                alert("Resized image is still too large. Pick a simpler image.");
                return;
            }
            const hidden = sr.getElementById("m-cicon");
            if (hidden) hidden.value = dataUrl;
            const preview = sr.getElementById("m-cicon-preview");
            if (preview) {
                preview.innerHTML =
                    `<div style="display:flex;align-items:center;gap:10px;padding:8px;border:1px solid var(--fh-border);border-radius:6px;background:var(--fh-surface)">` +
                    `<img src="${dataUrl}" style="width:48px;height:48px;object-fit:contain;border-radius:4px" alt="">` +
                    `<span style="font-size:.85rem;color:var(--fh-text-sec)">Custom uploaded image</span>` +
                    `<button type="button" class="fh-btn fh-btn-ghost fh-btn-sm" data-act="clear-icon" style="margin-left:auto">Clear</button>` +
                    `</div>`;
            }
            // Deselect any selected built-in icon
            sr.querySelectorAll(".fh-icon-cell.selected").forEach(c => c.classList.remove("selected"));
        };
        img.onerror = () => alert("Could not read that image.");
        img.src = reader.result;
    };
    reader.onerror = () => alert("Could not read that file.");
    reader.readAsDataURL(file);
}
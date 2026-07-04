/**
 * Family Hub Card — Event Dispatcher
 * Handles all data-act click events. Called by FamilyHubCard._dispatch().
 * Reads form values, calls services, opens/closes modals, updates UI state.
 */

import { FLASH_MS, CHORE_TEMPLATES } from "./constants.js";
import { rotationPoolEditor, curveFromPercents } from "./modals.js";
import { openPrintableChoreList } from "./print-chore-list.js";
import * as _md from "./rooms/meals-data.js";

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

        // Chores-tab filter dropdowns (fired via the delegated `change` handler).
        // Value comes from the <select>, so read el.value rather than a dataset attr.
        case "chore-filter":
            card._choreFilter = el.value || null;
            card._doRender(true);
            break;

        case "chore-status-filter":
            card._choreStatusFilter = el.value || null;
            card._doRender(true);
            break;

        case "chore-rec-filter":
            card._choreRecFilter = el.value || null;
            card._doRender(true);
            break;

        // Earning-rail what-if selects (fired via the delegated `change` handler).
        case "stats-rank":
            card._statsRankOverride = el.value;          // "" = Current, else "0".."N"
            card._doRender(true);
            break;

        case "stats-completion":
            card._statsCompletionPct = Number(el.value) || 100;
            card._doRender(true);
            break;

        case "stats-streak-pct":
            card._statsStreakPct = Number(el.value) || 50;
            card._doRender(true);
            break;

        // ---- Admin chore table (S9 P3 item 5) --------------------------------

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
            const iid = v("m-eiid");
            const origItems = card._attrs("sensor.family_hub_needs_attention").store_items || [];
            const origItem  = origItems.find(i => i.item_id === iid);
            const data = _buildStoreItemPayload(v, sr, true, origItem?.is_group_reward ?? false);
            if (!data) break;
            card._svc("update_store_item", data);
            card._adminSelectedItemId = null;
            card._doRender(true);
            break;
        }

        // ---- Ranks drawer (v0.7.2) -----------------------------------------
        case "open-ranks":
            card._ranksTab = el.dataset.pid || "global";
            card._modal = { type: "ranks", surface: "drawer", data: {} };
            card._doRender(true);
            break;

        case "ranks-tab":
            card._ranksTab = el.dataset.tab || "global";
            card._doRender(true);
            break;

        case "ranks-preview": {
            // Recompute the resulting points (pts = % × capacity) in place, no re-render.
            const cap = Math.max(0, parseInt(v("m-curve-cap") || "0"));
            const gainPcts = [], dropPcts = [];
            for (let i = 0; i < 5; i++) {
                gainPcts.push(Math.max(0, parseFloat(v(`m-gain-pct-${i}`)) || 0));
                dropPcts.push(Math.max(0, parseFloat(v(`m-drop-pct-${i}`)) || 0));
            }
            const { gain, drop } = curveFromPercents(cap, gainPcts, dropPcts);
            for (let i = 0; i < 5; i++) {
                const gi = sr.getElementById(`m-gain-pct-${i}`);
                const di = sr.getElementById(`m-drop-pct-${i}`);
                const ge = sr.getElementById(`m-gain-pts-${i}`);
                const de = sr.getElementById(`m-drop-pts-${i}`);
                if (ge && gi && !gi.disabled) ge.textContent = gain[i];
                if (de && di && !di.disabled) de.textContent = drop[i];
            }
            break;
        }

        case "save-ranks-global": {
            const inputs = sr.querySelectorAll(".fh-ad-rank-ladder-input");
            const ladder = [];
            let ladderOk = true;
            inputs.forEach(inp => {
                const val = parseFloat(inp.value);
                if (isNaN(val) || val <= 0) { ladderOk = false; return; }
                ladder.push(val);
            });
            const dropPct = Math.max(0, parseInt(v("m-rank-drop") || "60"));
            const gainPct = Math.max(0, parseInt(v("m-rank-gain") || "80"));
            const payload = {
                rank_eval_weekday:     parseInt(v("m-rank-weekday") || "0"),
                rank_dynamic_capacity: true,   // capacity is always the week's assigned points
                rank_default_drop_pct: dropPct,
                rank_default_gain_pct: gainPct,
            };
            if (ladderOk && ladder.length) payload.rank_ppd_ladder = ladder;
            card._svc("update_settings", payload);
            card._closeModal();
            break;
        }

        case "save-ranks-kid": {
            const pid = v("m-rank-pid");
            if (!pid) break;
            const cap = Math.max(0, parseInt(v("m-curve-cap") || "0"));
            const gainPcts = [], dropPcts = [];
            for (let i = 0; i < 5; i++) {
                gainPcts.push(Math.max(0, parseFloat(v(`m-gain-pct-${i}`)) || 0));
                dropPcts.push(Math.max(0, parseFloat(v(`m-drop-pct-${i}`)) || 0));
            }
            const { gain, drop } = curveFromPercents(cap, gainPcts, dropPcts);
            card._svc("update_person", {
                person_id:            pid,
                rank_index:           Math.max(0, Math.min(4, parseInt(v("m-rank-idx") || "0"))),
                rank_locked:          b("m-rank-lock"),
                rank_gain_thresholds: gain,
                rank_drop_thresholds: drop,
                rank_curve: { cap, gain_pcts: gainPcts, drop_pcts: dropPcts },
            });
            card._closeModal();
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
        // Admin and classic theme use .fh-hist-group + .fh-hist-subitems —
        // toggle display directly so scroll position is never disturbed.
        // Flat-structure themes (engineer, baker, dbz, dinos, hp) have no
        // .fh-hist-group wrapper, so they fall back to _doRender.
        case "toggle-skipped-group": {
            const key = el.dataset.key;
            const expanding = !card._expandedSkippedDates.has(key);
            if (expanding) card._expandedSkippedDates.add(key);
            else           card._expandedSkippedDates.delete(key);

            const group = el.closest(".fh-hist-group");
            if (group) {
                const subitems = group.querySelector(".fh-hist-subitems");
                const icon     = group.querySelector(".fh-hist-expand-icon");
                if (subitems) subitems.style.display = expanding ? "flex" : "none";
                if (icon)     icon.textContent       = expanding ? "▲" : "▼";
            } else {
                // Flat-structure theme: full re-render preserves _expandedSkippedDates state
                card._doRender(true);
            }
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
        case "open-partial":
            card._modal = { type: "partial-credit", data: {
                tid:  el.dataset.tid,
                name: el.dataset.name || "",
                pts:  el.dataset.pts || "0",
            } };
            card._doRender(true);
            break;
        case "do-partial": {
            const parent = card._people().find(p => p.type === "parent");
            card._svc("approve_task", {
                task_id:         el.dataset.tid,
                approved_by:     parent?.person_id || "",
                credit_fraction: parseFloat(el.dataset.frac || "1"),
            });
            card._closeModal();
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
        case "excuse-day": {
            const parent = card._people().find(p => p.type === "parent");
            card._svc("excuse_day", {
                person_id:  el.dataset.pid,
                day:        el.dataset.day,
                excused_by: parent?.person_id || "",
            });
            break;
        }

        // ---- Kid late make-up claim (v0.7.3) -------------------------------
        case "claim-late":
            card._svc("claim_late_task", {
                task_id:   el.dataset.iid,
                person_id: el.dataset.pid,
            });
            break;

        // ---- Store redemption request --------------------------------------
        case "redeem": {
            // v0.7.6: guard against locked rewards (chore-% / min-rank gates).
            // The theme buttons already render a locked badge instead of a tap
            // target, but this catches any stale click before hitting the service.
            const rPid = el.dataset.pid, rIid = el.dataset.iid;
            const rPerson = (card._attrs("sensor.family_hub_needs_attention").people || []).find(p => p.id === rPid);
            const rKey = rPerson ? `sensor.family_hub_${rPerson.name.toLowerCase().replace(/ /g, "_")}` : null;
            const rItem = rKey ? (card._attrs(rKey).store_items || []).find(i => i.item_id === rIid) : null;
            if (rItem && rItem.locked) {
                alert(rItem.lock_reason || "This reward is locked until you finish your chores.");
                break;
            }
            card._svc("request_redemption", { person_id: rPid, item_id: rIid });
            break;
        }

        // Subscriptions go through data-act="redeem" → approve-subscription-redemption (not "subscribe").

        // ---- Subscription: kid request cancel (v0.6.5) --------------------
        case "request-cancel-sub":
            if (!confirm(`Cancel "${el.dataset.name || "this subscription"}"?\nThis requires parent approval before it takes effect.`)) break;
            card._svc("request_cancel_subscription", { subscription_id: el.dataset.subid, person_id: el.dataset.pid });
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
            const pAttrs    = pAttrKey ? card._attrs(pAttrKey) : {};
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
            const attrs = card._attrs(card._personEntityId(person.name));
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
        case "open-add-chore":
            card._adminSelectedChoreId = null;
            card._modal = { type: "add-chore", surface: "drawer", data: {} };
            card._doRender(true);
            break;
        // v0.7.3: editing a chore opens the drawer (both the row body click and the
        // edit button route here); the chore-list stays as the rail.
        case "select-chore-row":
        case "open-edit-chore": {
            const naAttr = card._attrs("sensor.family_hub_needs_attention");
            const chores = naAttr.all_chores || naAttr.active_chores || [];
            const chore  = chores.find(c => c.chore_id === el.dataset.cid);
            if (!chore) break;
            card._adminSelectedChoreId = null;
            card._modal = { type: "edit-chore", surface: "drawer", data: { chore } };
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
                surface: "drawer",
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
                    childMode:      el.dataset.pchildmode === "true",
                    // v0.6.1: success-rate streak knobs (set via Edit Person modal)
                    completionThreshold:   parseInt(el.dataset.pcompletionthreshold ?? "80"),
                    completionMilestone:   parseInt(el.dataset.pcompletionmilestone ?? "7"),
                    completionBonusPoints: parseInt(el.dataset.pcompletionbonus     ?? "50"),
                    // v0.7.6: weekly-consistency streak knobs
                    weeklyThreshold:       parseInt(el.dataset.pweeklythreshold ?? "80"),
                    weeklyMilestone:       parseInt(el.dataset.pweeklymilestone ?? "4"),
                    weeklyBonusPoints:     parseInt(el.dataset.pweeklybonus     ?? "100"),
                }
            };
            card._doRender(true);
            break;
        case "open-confirm-remove-person":
            card._modal = { type: "confirm-remove-person", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
            card._doRender(true);
            break;
        case "reactivate-person":
            card._svc("reactivate_person", { person_id: el.dataset.pid });
            break;
        case "open-confirm-hard-delete-person":
            card._modal = { type: "confirm-hard-delete-person", data: { pid: el.dataset.pid, pname: el.dataset.pname } };
            card._doRender(true);
            break;
        case "open-edit-settings":
            card._modal = { type: "edit-settings", surface: "drawer", data: {
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

        case "ok-add-chore":
        case "ok-edit-chore": {
            const isEdit = (act === "ok-edit-chore");
            const data = _buildChorePayload(v, b, int, sr, isEdit);
            if (!data) break;
            card._svc(isEdit ? "update_chore" : "add_chore", data);
            card._closeModal();
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
            const data = _buildStoreItemPayload(v, sr, false, null);
            if (!data) break;
            card._svc("add_store_item", data);
            card._closeModal();
            break;
        }

        case "ok-edit-store-item": {
            const wasGroup = card._modal?.data?.item?.is_group_reward ?? false;
            const data = _buildStoreItemPayload(v, sr, true, wasGroup);
            if (!data) break;
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
                child_mode:             b("m-pchildmode"),
                // v0.6.1: success-rate person streak knobs
                completion_threshold_pct: Math.max(1, Math.min(100, int("m-completion-threshold") || 80)),
                completion_milestone:     Math.max(0, int("m-completion-milestone") || 0),
                completion_bonus_points:  Math.max(0, int("m-completion-bonus")     || 0),
                // v0.7.6: weekly-consistency streak knobs
                weekly_completion_threshold_pct: Math.max(1, Math.min(100, int("m-weekly-threshold") || 80)),
                weekly_completion_milestone:     Math.max(0, Math.min(52, int("m-weekly-milestone") || 0)),
                weekly_completion_bonus_points:  Math.max(0, int("m-weekly-bonus") || 0),
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

        case "ok-hard-delete-person": {
            const pid = v("m-hdpid");
            if (!pid) break;
            card._svc("hard_delete_person", { person_id: pid });
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

        // ---- v0.6.5: subscription redemption approval (with anchor picker) ----
        case "approve-subscription-redemption": {
            const rid    = el.dataset.rid;
            const period = el.dataset.period || "monthly";
            const parent = card._people().find(p => p.type === "parent");
            const svcData = { redemption_id: rid, approved_by: parent?.person_id || "" };
            if (period === "weekly") {
                svcData.subscription_anchor = parseInt(sr.getElementById(`m-sub-wday-${rid}`)?.value ?? "0");
            } else if (period !== "daily") {
                svcData.subscription_anchor = Math.max(1, Math.min(31,
                    parseInt(sr.getElementById(`m-sub-dom-${rid}`)?.value ?? "1")
                ));
            }
            card._svc("approve_redemption", svcData);
            break;
        }

        // ---- v0.6.5: admin cancel a subscription unilaterally ---------------
        case "admin-cancel-subscription": {
            const sname = el.dataset.sname || "this subscription";
            if (!confirm(`Cancel "${sname}"?\n\nThis will immediately end the subscription.`)) break;
            const parent = card._people().find(p => p.type === "parent");
            card._svc("admin_cancel_subscription", {
                subscription_id: el.dataset.subid,
                canceled_by:     parent?.person_id || "",
            });
            break;
        }

        // ---- v0.6.5: inline edit — open / cancel ----
        case "admin-edit-subscription-open":
            card._editingSubId = el.dataset.subid;
            card._doRender();
            break;
        case "admin-edit-subscription-cancel":
            card._editingSubId = null;
            card._doRender();
            break;

        // ---- v0.6.5: inline edit — save ----
        case "admin-update-subscription": {
            const sid      = el.dataset.subid;
            const root     = el.closest(".fh-point-row");
            const period   = root?.querySelector(`#sub-edit-period-${CSS.escape(sid)}`)?.value || null;
            const costRaw  = root?.querySelector(`#sub-edit-cost-${CSS.escape(sid)}`)?.value?.trim();
            const dateRaw  = root?.querySelector(`#sub-edit-date-${CSS.escape(sid)}`)?.value?.trim();
            const svcData  = { subscription_id: sid };
            if (period) svcData.period = period;
            // Non-empty string → set dollar override; empty string → send null only
            // if there was already an override (to clear it); otherwise omit entirely.
            if (costRaw !== undefined && costRaw !== "") {
                const parsed = parseFloat(costRaw);
                if (!isNaN(parsed) && parsed >= 0) svcData.dollar_cost_override = parsed;
            }
            // Date: only send if non-empty (YYYY-MM-DD)
            if (dateRaw) svcData.next_renewal_date = dateRaw;
            card._editingSubId = null;
            card._svc("update_subscription", svcData);
            break;
        }

        // ---- v0.6.5: subscription cancel-request approvals -------------------
        case "approve-cancel-subscription": {
            const parent = card._people().find(p => p.type === "parent");
            card._svc("approve_cancel_subscription", {
                subscription_id: el.dataset.subid,
                approved_by:     parent?.person_id || "",
            });
            break;
        }
        case "decline-cancel-subscription": {
            const parent = card._people().find(p => p.type === "parent");
            card._svc("decline_cancel_subscription", {
                subscription_id: el.dataset.subid,
                declined_by:     parent?.person_id || "",
            });
            break;
        }

        // ================================================================
        // MEALS ROOM — dispatch cases (v0.8.0)
        // ================================================================

        // ---- Tab navigation (pure UI) ------------------------------------
        case "meals-tab":
            card._mealsTab = el.dataset.tab || "week";
            // Close any open overlays when switching tabs
            card._mealsDrawer  = null;
            card._mealsRecipe  = null;
            card._mealsDayPick = null;
            card._doRender(true);
            break;

        // ---- This Week pagination (pure UI) ------------------------------
        case "meals-week-prev":
            card._mealsWeekPage = Math.max(0, (card._mealsWeekPage || 0) - 1);
            card._doRender(true);
            break;
        case "meals-week-next":
            card._mealsWeekPage = Math.min(4, (card._mealsWeekPage || 0) + 1);
            card._doRender(true);
            break;
        case "meals-week-today":
            card._mealsWeekPage = 0;
            card._doRender(true);
            break;

        // Tapping an empty day in This Week jumps to Plan tab for that day
        case "meals-week-tap-day": {
            const wDate = el.dataset.date;
            if (!wDate) break;
            card._mealsTab      = "plan";
            card._mealsJumpDate = wDate;
            card._mealsDrawer   = null;
            card._doRender(true);
            break;
        }

        // ---- Plan tab — day rail selection (pure UI) --------------------
        case "meals-plan-select-day":
            card._mealsJumpDate = el.dataset.date || null;
            card._mealsDrawer   = null;
            card._doRender(true);
            break;

        // ---- Plan tab — clear day / dinner / single side (service calls) -
        case "meals-clear-day":
            card._svc("meals_clear_day", { date: el.dataset.date });
            break;

        case "meals-clear-dinner":
            card._svc("meals_clear_dinner", { date: el.dataset.date });
            break;

        case "meals-clear-bl":
            card._svc("meals_set_bl", {
                date:       el.dataset.date,
                slot:       el.dataset.slot,
                meal_id:    "",        // omit/empty = clear
                scope:      "today",
                week_start: "Sunday",
            });
            break;

        case "meals-remove-side": {
            const rsDate  = el.dataset.date;
            const rsSide  = el.dataset.side;
            const rsAttr  = card._attrs("sensor.family_hub_meals");
            const rsEntry = (rsAttr.plan || {})[rsDate] || {};
            const rsSides = (rsEntry.d && rsEntry.d.sides || []).filter(x => x !== rsSide);
            card._svc("meals_set_dinner_sides", { date: rsDate, sides: rsSides });
            break;
        }

        // ---- Rhythm strip — open/close popover (pure UI) ----------------
        case "meals-rhythm-pop": {
            const wd  = el.dataset.weekday;
            const pop = card.shadowRoot.getElementById("fh-rh-pop-" + wd);
            // Close any other open popovers first
            card.shadowRoot.querySelectorAll("[id^='fh-rh-pop-']").forEach(p => {
                if (p.id !== "fh-rh-pop-" + wd) p.style.display = "none";
            });
            if (pop) pop.style.display = pop.style.display === "none" ? "" : "none";
            break;
        }

        // ---- Rhythm strip — set rhythm (service call) -------------------
        case "meals-set-rhythm": {
            const wd  = el.dataset.weekday;
            const tk  = el.dataset.theme || "";    // empty string = clear
            card._svc("meals_set_rhythm", {
                weekday:   parseInt(wd, 10),
                ...(tk ? { theme_key: tk } : {}),  // omit = clear
            });
            // Close the popover
            const rPop = card.shadowRoot.getElementById("fh-rh-pop-" + wd);
            if (rPop) rPop.style.display = "none";
            break;
        }

        // ---- Drawer: open -----------------------------------------------
        case "meals-open-drawer":
        case "meals-open-sides": {
            const dk   = el.dataset.kind || (act === "meals-open-sides" ? "d-sides" : "d-main");
            const dd   = el.dataset.date || card._mealsJumpDate || null;
            if (!dd) break;
            // Initialise selSides from existing plan entry
            const drAttr  = card._attrs("sensor.family_hub_meals");
            const drEntry = (drAttr.plan || {})[dd] || {};
            const initStep = dk === "d-sides" ? "sides"
                : (dk === "b" || dk === "l")  ? "browse"
                : "protein";
            const initSides = (dk === "d-sides" && drEntry.d)
                ? (drEntry.d.sides || [])
                : [];
            card._mealsDrawer = {
                kind: dk, dateISO: dd, step: initStep,
                cat: null, cut: null, scope: "today", favOnly: false,
                pendingMainId: null, pickedProtein: null,
                nudgeOff: false, fatsOff: false,
                selSides: initSides,
            };
            card._doRender(true);
            break;
        }

        // ---- Drawer: close -----------------------------------------------
        case "meals-close-drawer":
            card._mealsDrawer = null;
            card._doRender(true);
            break;

        // ---- Drawer: back navigation (pure UI) --------------------------
        case "meals-drawer-back": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            if (dr.step === "cut")   { dr.step = "protein"; dr.cat = null; }
            else if (dr.step === "make") {
                const { PROTEINS: _P } = _mealsDataLookupForDispatch();
                const cuts = (dr.cat ? (_P[dr.cat]?.cuts || []).filter(c => {
                    // Mirror visibleCuts logic: need at least one meal for this cat+cut
                    // We skip the import here and just reset to protein if <2 cuts
                    return true;
                }) : []);
                if (dr.cat && cuts.length > 1) { dr.step = "cut"; dr.cut = null; }
                else { dr.step = "protein"; dr.cat = null; dr.cut = null; }
            }
            else if (dr.step === "browse")  { dr.step = "protein"; }
            else if (dr.step === "tacoprotein") { dr.step = "make"; dr.pendingMainId = null; }
            else if (dr.step === "sides" && dr.pendingMainId) {
                const { mealById: _mb, allMeals: _am } = _mealsDataLookupForDispatch();
                const pm = _mb(dr.pendingMainId, (card._attrs("sensor.family_hub_meals").custom || []));
                if (pm && pm.proteinPick) { dr.step = "tacoprotein"; }
                else { dr.step = "make"; dr.pendingMainId = null; }
            }
            card._mealsDrawer = { ...dr };
            card._doRender(true);
            break;
        }

        // ---- Drawer: browse mode (pure UI) ------------------------------
        case "meals-drawer-browse":
            if (!card._mealsDrawer) break;
            card._mealsDrawer = { ...card._mealsDrawer, step: "browse" };
            card._doRender(true);
            break;

        case "meals-drawer-favonly":
            if (!card._mealsDrawer) break;
            card._mealsDrawer = { ...card._mealsDrawer, favOnly: !card._mealsDrawer.favOnly };
            card._doRender(true);
            break;

        case "meals-drawer-scope":
            if (!card._mealsDrawer) break;
            card._mealsDrawer = { ...card._mealsDrawer, scope: el.dataset.scope || "today" };
            card._doRender(true);
            break;

        // ---- Drawer: protein / cut selection (pure UI) ------------------
        case "meals-drawer-pick-cat": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            const catId = el.dataset.cat;
            const { PROTEINS: _P2, MEALS: _M } = _mealsDataLookupForDispatch();
            const custom2 = card._attrs("sensor.family_hub_meals").custom || [];
            const allM    = _M.concat(custom2);
            const dinnersForCat = allM.filter(m => m.types.includes("d") && !m.special && m.protein === catId);
            const cuts    = (_P2[catId]?.cuts || []).filter(c => dinnersForCat.some(m => m.cut === c.id));
            if (cuts.length > 1) {
                card._mealsDrawer = { ...dr, cat: catId, step: "cut" };
            } else {
                card._mealsDrawer = { ...dr, cat: catId, cut: cuts.length === 1 ? cuts[0].id : null, step: "make" };
            }
            card._doRender(true);
            break;
        }

        case "meals-drawer-pick-cut":
            if (!card._mealsDrawer) break;
            card._mealsDrawer = { ...card._mealsDrawer, cut: el.dataset.cut, step: "make" };
            card._doRender(true);
            break;

        // ---- Drawer: pick a dinner main (moves to sides step or assigns special) -
        case "meals-drawer-pick-main": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            const mId   = el.dataset.meal;
            const { mealById: _mb2, allMeals: _am2 } = _mealsDataLookupForDispatch();
            const cust2 = card._attrs("sensor.family_hub_meals").custom || [];
            const meal2 = _mb2(mId, cust2);
            if (!meal2) break;
            if (meal2.special) {
                // Special meals (Leftovers, Eating Out) skip sides
                card._svc("meals_set_dinner", { date: dr.dateISO, main: mId, sides: [] });
                _drawerConfirm(card, dr.dateISO, meal2);
            } else {
                const initSides = new Set(meal2.sides || []);
                if (meal2.proteinPick) {
                    card._mealsDrawer = {
                        ...dr, pendingMainId: mId,
                        pickedProtein: meal2.defaultPick || meal2.proteinPick[0],
                        selSides: [...initSides],
                        step: "tacoprotein", nudgeOff: false, fatsOff: false,
                    };
                } else {
                    card._mealsDrawer = {
                        ...dr, pendingMainId: mId,
                        selSides: [...initSides],
                        step: "sides", nudgeOff: false, fatsOff: false,
                    };
                }
                card._doRender(true);
            }
            break;
        }

        // ---- Drawer: special meal quick-pick (protein step) -----------
        case "meals-drawer-pick-special": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            const mId = el.dataset.meal;
            const { mealById: _mbS } = _mealsDataLookupForDispatch();
            const custS = card._attrs("sensor.family_hub_meals").custom || [];
            card._svc("meals_set_dinner", { date: dr.dateISO, main: mId, sides: [] });
            _drawerConfirm(card, dr.dateISO, _mbS(mId, custS));
            break;
        }

        // ---- Drawer: pick a taco protein --------------------------------
        case "meals-drawer-pick-taco-protein": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            card._mealsDrawer = {
                ...dr, pickedProtein: el.dataset.protein, step: "sides",
            };
            card._doRender(true);
            break;
        }

        // ---- Drawer: BL meal pick ---------------------------------------
        case "meals-drawer-pick-bl": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            card._svc("meals_set_bl", {
                date:       dr.dateISO,
                slot:       dr.kind,   // "b" or "l"
                meal_id:    el.dataset.meal,
                scope:      dr.scope || "today",
                week_start: "Sunday",
            });
            card._mealsDrawer = null;
            card._doRender(true);
            break;
        }

        // ---- Drawer: toggle a side (pure UI — selSides in drawer state) -
        case "meals-toggle-side": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            const sid  = el.dataset.side;
            const cur  = new Set(dr.selSides || []);
            if (cur.has(sid)) cur.delete(sid); else cur.add(sid);
            card._mealsDrawer = { ...dr, selSides: [...cur] };
            card._doRender(true);
            break;
        }

        // ---- Drawer: dismiss veggie nudge / fats note -------------------
        case "meals-dismiss-nudge":
            if (!card._mealsDrawer) break;
            card._mealsDrawer = { ...card._mealsDrawer, nudgeOff: true };
            card._doRender(true);
            break;

        case "meals-dismiss-fats":
            if (!card._mealsDrawer) break;
            card._mealsDrawer = { ...card._mealsDrawer, fatsOff: true };
            card._doRender(true);
            break;

        // ---- Drawer: "No sides" / "Done" --------------------------------
        case "meals-drawer-no-sides": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            if (dr.kind === "d-sides") {
                card._svc("meals_set_dinner_sides", { date: dr.dateISO, sides: [] });
            } else {
                const { variantFor: _vf, mealById: _mb3, parseISO: _p } = _mealsDataLookupForDispatch();
                const cust3 = card._attrs("sensor.family_hub_meals").custom || [];
                const pm    = _mb3(dr.pendingMainId, cust3);
                const vari  = pm ? _vf(pm, _p(dr.dateISO), dr.pickedProtein) : "";
                card._svc("meals_set_dinner", {
                    date:    dr.dateISO,
                    main:    dr.pendingMainId,
                    sides:   [],
                    ...(dr.pickedProtein ? { protein: dr.pickedProtein } : {}),
                    ...(vari ? { variant: vari } : {}),
                });
                _drawerConfirm(card, dr.dateISO, pm);
                return;
            }
            card._mealsDrawer = null;
            card._doRender(true);
            break;
        }

        case "meals-drawer-done-sides": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            if (dr.kind === "d-sides") {
                card._svc("meals_set_dinner_sides", { date: dr.dateISO, sides: dr.selSides || [] });
                card._mealsDrawer = null;
                card._doRender(true);
            } else {
                const { variantFor: _vf2, mealById: _mb4, parseISO: _p2 } = _mealsDataLookupForDispatch();
                const cust4 = card._attrs("sensor.family_hub_meals").custom || [];
                const pm2   = _mb4(dr.pendingMainId, cust4);
                const vari2 = pm2 ? _vf2(pm2, _p2(dr.dateISO), dr.pickedProtein) : "";
                card._svc("meals_set_dinner", {
                    date:    dr.dateISO,
                    main:    dr.pendingMainId,
                    sides:   dr.selSides || [],
                    ...(dr.pickedProtein ? { protein: dr.pickedProtein } : {}),
                    ...(vari2 ? { variant: vari2 } : {}),
                });
                _drawerConfirm(card, dr.dateISO, pm2);
            }
            break;
        }

        // ---- Drawer confirm: plan the next open day (opt-in advance) ----
        case "meals-drawer-next-day": {
            const dr = card._mealsDrawer;
            if (!dr) break;
            _advanceToNextEmpty(card, dr.dateISO);   // opens next empty dinner, or closes if none
            break;
        }

        // ---- Pantry: toggle an ingredient (service call) ----------------
        case "meals-toggle-have":
            card._svc("meals_toggle_have", { ingredient_id: el.dataset.ing });
            break;

        // ---- Pantry: tap a matched meal → open day-pick modal -----------
        case "meals-pantry-pick":
            card._mealsDayPick = el.dataset.meal || null;
            card._doRender(true);
            break;

        // ---- Day-pick modal: pick a date → set dinner -------------------
        case "meals-daypick-pick": {
            const dpDate  = el.dataset.date;
            const dpMeal  = el.dataset.meal;
            const dpAttr  = card._attrs("sensor.family_hub_meals");
            const dpCust  = dpAttr.custom || [];
            const { mealById: _mb5 } = _mealsDataLookupForDispatch();
            const dpM     = _mb5(dpMeal, dpCust);
            if (!dpDate || !dpM) break;
            card._svc("meals_set_dinner", {
                date:  dpDate,
                main:  dpMeal,
                sides: (dpM.sides || []).slice(0, 2),
            });
            card._mealsDayPick = null;
            card._doRender(true);
            break;
        }

        // ---- Day-pick modal: close --------------------------------------
        case "meals-close-daypick":
            card._mealsDayPick = null;
            card._doRender(true);
            break;

        // ---- Library: type filter (pure UI) ----------------------------
        case "meals-lib-filter":
            card._mealsLibFilter = el.dataset.filter || "all";
            card._doRender(true);
            break;

        // ---- Library: open recipe modal (pure UI) ----------------------
        case "meals-open-recipe":
            card._mealsRecipe = el.dataset.meal || null;
            card._doRender(true);
            break;

        // ---- Library: close recipe modal --------------------------------
        case "meals-close-recipe":
            card._mealsRecipe = null;
            card._doRender(true);
            break;

        // ---- Library: plan a meal from recipe modal (opens day-pick) ---
        case "meals-recipe-plan":
            card._mealsRecipe  = null;
            card._mealsDayPick = el.dataset.meal || null;
            card._doRender(true);
            break;

        // ---- Library: plan a meal tile (opens day-pick) ----------------
        case "meals-lib-plan-meal":
            card._mealsDayPick = el.dataset.meal || null;
            card._doRender(true);
            break;

        // ---- Library: toggle favorite (service call) -------------------
        case "meals-toggle-fav":
            card._svc("meals_toggle_fav", { meal_id: el.dataset.meal });
            break;

        // ---- Library: refresh ideas (pure UI — re-renders from rankIdeas) -
        case "meals-ideas-refresh":
            card._doRender(true);
            break;

        // ---- Library: save an idea as a custom meal (service call) -----
        case "meals-save-idea": {
            const { IDEAS_POOL: _ip } = _mealsDataLookupForDispatch();
            const idea = _ip.find(x => x.id === el.dataset.meal);
            if (!idea) break;
            const newMeal = {
                id:      idea.id,
                name:    idea.name,
                glyph:   idea.glyph,
                types:   ["d"],
                groups:  idea.groups || [],
                ing:     idea.ing    || [],
                sides:   idea.sides  || [],
                protein: idea.protein || "meatless",
                cut:     idea.cut    || "",
                fav:     false,
                source:  "Spoonacular",
            };
            card._svc("meals_add_custom_meal", { meal: newMeal });
            break;
        }

        // ---- Groceries: toggle a grocery item checked/unchecked ---------
        case "meals-toggle-groc":
            card._svc("meals_toggle_grocery", {
                key:     el.dataset.key,
                checked: el.dataset.checked === "true",
            });
            break;

        // ---- Groceries: reset all checks for this week ------------------
        case "meals-reset-groc": {
            // Toggle-off every key currently checked for this weekKey
            const rgAttr = card._attrs("sensor.family_hub_meals");
            const rgGroc = rgAttr.groc || {};
            const wk     = el.dataset.weekkey || "";
            Object.entries(rgGroc).forEach(([key, val]) => {
                if (val && key.startsWith(wk + ":")) {
                    card._svc("meals_toggle_grocery", { key, checked: false });
                }
            });
            break;
        }

        // ---- Admin: Meal Planner editor (desktop Admin mode) ------------
        case "meals-admin-subtab":
            card._mealsAdminSubtab   = el.dataset.sub;
            card._mealsAdminRecipeId = null;
            card._doRender(true);
            break;

        case "meals-admin-add-meal": {
            const name = v("ma-name").trim();
            if (!name) { alert("Give the meal a name first."); break; }
            const types = ["b", "l", "d"].filter(t => b("ma-type-" + t));
            if (!types.length) { alert("Pick breakfast, lunch, or dinner."); break; }
            const groups = _md.GROUP_ORDER.filter(g => b("ma-grp-" + g));
            const sides  = _md.SIDES.filter(s => b("ma-side-" + s.id)).map(s => s.id);
            const allIng = _md.getIngredients(card._attrs("sensor.family_hub_meals").customIng || []);
            const ing    = allIng.filter(i => b("ma-ing-" + i.id)).map(i => i.id);
            const pc     = v("ma-protcut");
            const [prot, cut] = pc ? pc.split(":") : ["", ""];
            const id = "custom-" + (name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || Date.now());
            const meal = { id, name, glyph: v("ma-glyph") || "🍽️", types, groups, ing, sides, fav: false };
            if (prot) meal.protein = prot;
            if (cut)  meal.cut = cut;
            card._svc("meals_add_custom_meal", { meal });
            break;
        }

        case "meals-admin-remove-meal":
            card._svc("meals_remove_custom_meal", { meal_id: el.dataset.id });
            break;

        case "meals-admin-add-ing": {
            const name = v("mi-name").trim();
            if (!name) { alert("Name the ingredient first."); break; }
            const id = "custom-ing-" + (name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || Date.now());
            card._svc("meals_add_ingredient", {
                ingredient: { id, label: name, glyph: v("mi-glyph") || "🥕", cat: v("mi-cat"), aisle: v("mi-aisle") },
            });
            break;
        }

        case "meals-admin-remove-ing":
            card._svc("meals_remove_ingredient", { ingredient_id: el.dataset.id });
            break;

        case "meals-admin-recipe-edit":
            card._mealsAdminRecipeId = el.dataset.id;
            card._doRender(true);
            break;

        case "meals-admin-recipe-cancel":
            card._mealsAdminRecipeId = null;
            card._doRender(true);
            break;

        case "meals-admin-recipe-save": {
            const lines = id => v(id).split("\n").map(s => s.trim()).filter(Boolean);
            const ingredients = lines("mr-ing");
            const steps       = lines("mr-steps");
            if (!ingredients.length || !steps.length) {
                alert("A recipe needs at least one ingredient and one step.");
                break;
            }
            card._svc("meals_save_recipe", {
                meal_id: el.dataset.id,
                recipe:  { time: v("mr-time").trim() || "—", serves: parseInt(v("mr-serves"), 10) || 5, ingredients, steps },
            });
            card._mealsAdminRecipeId = null;
            card._doRender(true);
            break;
        }
    }
}

// ---------------------------------------------------------------------------
// Meals-specific dispatch helpers
// ---------------------------------------------------------------------------

/**
 * Import the meals-data module lazily so it doesn't bloat other dispatch paths.
 * Returns a subset of exports needed in dispatch handlers.
 */
function _mealsDataLookupForDispatch() {
    // Dynamic import is async; for dispatch we use a synchronous static import.
    // This helper exists as a single named entry point for any tree-shaker.
    return _md;
}

/**
 * After successfully setting a dinner, find the next empty dinner slot and
 * jump the drawer to it (auto-advance flow), or close the drawer if the
 * 30-day horizon is fully planned.
 */
// After a dinner is committed, show a confirm step that lets the parent choose
// to plan the next open day or be done — instead of auto-advancing.
function _drawerConfirm(card, dateISO, meal) {
    card._mealsDrawer = {
        kind: "d", dateISO, step: "confirm",
        savedName:  meal ? meal.name  : "Dinner",
        savedGlyph: meal ? meal.glyph : "✓",
    };
    card._doRender(true);
}

function _advanceToNextEmpty(card, fromISO) {
    const { today: _t, addDays: _a, iso: _i, HORIZON_DAYS: _h } = _md;
    const plan  = card._attrs("sensor.family_hub_meals").plan || {};
    const start = _md.parseISO(fromISO);
    let next    = null;
    for (let i = 1; i < _h; i++) {
        const d = _a(start, i);
        if (d > _a(_t(), _h - 1)) break;
        const e = plan[_i(d)];
        if (!e || !e.d) { next = d; break; }
    }
    if (next) {
        const nextISO = _i(next);
        card._mealsJumpDate = nextISO;
        card._mealsDrawer = {
            kind: "d-main", dateISO: nextISO, step: "protein",
            cat: null, cut: null, scope: "today", favOnly: false,
            pendingMainId: null, pickedProtein: null,
            nudgeOff: false, fatsOff: false, selSides: [],
        };
    } else {
        card._mealsDrawer  = null;
    }
    card._doRender(true);
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

// Builds the payload for add_chore / update_chore. Returns null if name is empty.
// isEdit=true produces a full edit payload (chore_id, weekdays, recurrence object);
// isEdit=false produces the add payload (recurrence_type, conditional weekdays/day_filter).
function _buildChorePayload(v, b, int, sr, isEdit) {
    const name = v("m-cname").trim();
    if (!name) return null;
    const recType   = v("m-crec");
    const ctype     = v("m-ctype");
    const assigned  = _selectedPersonIds("m-assign-person", sr);
    const weekdays  = Array.from(sr.querySelectorAll(".m-wd-day:checked")).map(cb => parseInt(cb.value));
    const dayFilter = Array.from(sr.querySelectorAll(".m-df-day:checked")).map(cb => parseInt(cb.value));
    // v0.7.3: monthly multi-day — parse the comma list (e.g. "1, 15") into 1-31 ints.
    const domDaysRaw = (v("m-dom-days") || "")
        .split(",").map(s => parseInt(s.trim()))
        .filter(n => Number.isFinite(n) && n >= 1 && n <= 31);
    const domDays = domDaysRaw.length ? [...new Set(domDaysRaw)].sort((a, b) => a - b) : [1];
    const iconVal   = _normalizeIcon(v("m-cicon"));
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
        data.rotation_switch_weekday = parseInt(v("m-crot-switch-day") || "0") || 0;
    } else {
        data.rotation_pool    = [];
        data.rotation_cadence = "";
    }
    if (isEdit) {
        data.chore_id   = v("m-cid");
        data.active     = sr.querySelector("#m-cactive")?.checked !== false;
        data.weekdays   = weekdays;
        data.day_filter = dayFilter;
        data.recurrence = {
            type:       recType,
            weekdays,
            day_filter: dayFilter,
            ...(recType === "monthly_on_date"
                    ? { days_of_month: domDays, day_of_month: domDays[0] }
                    : {}),
        };
    } else {
        data.recurrence_type = recType;
        if (weekdays.length)  data.weekdays   = weekdays;
        if (dayFilter.length) data.day_filter = dayFilter;
        if (recType === "monthly_on_date") {
            data.days_of_month = domDays;
            data.day_of_month  = domDays[0];
        }
    }
    return data;
}

// Builds the payload for add_store_item / update_store_item.
// Returns null on validation failure (alerts for group errors before returning).
// isEdit=true adds item_id + active. wasGroupReward: for edit only — when truthy and the
// item is no longer a group reward, clears is_group_reward/contributors.
// For add (isEdit=false), pass wasGroupReward=null.
function _buildStoreItemPayload(v, sr, isEdit, wasGroupReward) {
    const iid    = isEdit ? v("m-eiid") : null;
    const name   = v("m-sname").trim();
    const dollar = parseFloat(v("m-sdollar"));
    if ((isEdit && !iid) || !name || !dollar || dollar <= 0) return null;
    const isGroup = sr.querySelector("#m-sgroup")?.checked || false;
    const scope   = v("m-sscope");
    const data = {
        name,
        dollar_value:   dollar,
        scope,
        description:    v("m-sdesc").trim(),
        category_label: v("m-scat") || "",
        max_per_period: parseInt(v("m-smaxperiod") || "0"),
        period:         v("m-speriod") || "week",
        icon:           _normalizeIcon(v("m-cicon")),
    };
    if (isEdit) {
        data.item_id = iid;
        data.active  = sr.querySelector("#m-sactive")?.checked !== false;
    }
    if (isGroup) {
        const contribs = [...sr.querySelectorAll(".m-scontrib")]
            .filter(inp => parseInt(inp.value) > 0)
            .map(inp => ({ person_id: inp.dataset.pid, share_pct: parseInt(inp.value) }));
        if (contribs.length === 0) {
            alert("Group reward needs at least one contributor with a share > 0%.");
            return null;
        }
        const total = contribs.reduce((s, c) => s + c.share_pct, 0);
        if (total !== 100) {
            alert(`Contributor shares must sum to exactly 100% (currently ${total}%). Use the "Equal split" button or adjust manually.`);
            return null;
        }
        data.is_group_reward = true;
        data.contributors    = contribs;
        data.scope           = "personal";
        data.person_ids      = contribs.map(c => c.person_id);
    } else {
        if (isEdit && wasGroupReward) {
            data.is_group_reward = false;
            data.contributors    = [];
        }
        if (scope === "personal") {
            data.person_ids = _selectedPersonIds("m-sp-person", sr);
        } else if (isEdit) {
            data.person_ids = [];
        }
    }

    // v0.6.5: subscription type + period (anchor is set at approval time, not here)
    const isSub = sr.querySelector("#m-ssubtype")?.checked || false;
    data.item_type = isSub ? "subscription" : "one_time";
    if (isSub) {
        data.subscription_period = v("m-ssperiod") || "monthly";
    }

    // v0.7.6: reward gates (0 / 0 = off)
    data.require_daily_pct = Math.max(0, Math.min(100, parseInt(v("m-sreqpct") || "0") || 0));
    data.min_rank_index    = Math.max(0, Math.min(4, parseInt(v("m-sminrank") || "0") || 0));

    return data;
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
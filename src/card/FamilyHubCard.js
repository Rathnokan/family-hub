/**
 * Family Hub Card — Main Card Class
 * Web Component shell: lifecycle, dirty-check, render orchestration,
 * modal overlay management, and conditional UI sync.
 *
 * HTML rendering is delegated to the modes-*.js and modals.js modules.
 * Event handling is delegated to dispatch.js.
 */

import { CSS }                                        from "./css.js";
import { VERSION, DOMAIN, FH_SENSORS }               from "./constants.js";
import { slug }                                       from "./utils.js";
import { htmlPersonal }                               from "./modes-personal.js";
import { htmlAdmin }                                  from "./modes-admin.js";
import { htmlHome, htmlNavBack }                      from "./modes-home.js";
import { getRoomById }                                from "./rooms/index.js";
import { getTheme }                                   from "./themes/index.js";
import { dispatch }                                   from "./dispatch.js";
import {
    mPointAdjust,
    mAddTask,
    mChoreForm,
    mAddStoreItem,
    mEditStoreItem,
    mAddPerson,
    mEditPerson,
    mEditSettings,
    mClaim,
    mAddReminder,
    mConfirmRemovePerson,
    mEditStreaks,
} from "./modals.js";

export class FamilyHubCard extends HTMLElement {

    // ---- HA card API -------------------------------------------------------

    static getStubConfig() { return { mode: "command_center" }; }
    static getConfigElement() { return document.createElement("family-hub-card-editor"); }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Config & HA state
        this._cfg  = {};
        this._hass = null;

        // Dirty-check: entityId → last_updated timestamp
        this._lastKeys = {};

        // UI state
        this._modal         = null;   // { type, data } — null = closed
        this._filter        = null;   // command_center person filter (person_id)
        this._tab           = "tasks";
        this._adminSec      = "today";
        this._flashing      = new Set();  // task_ids currently animating
        this._pendingSubmit = new Set();  // task_ids optimistically submitted, awaiting sensor refresh
        this._expandedDescs = new Set();  // ids with description expanded
        this._histFilter          = null;       // history log person filter
        this._choreFilter         = null;       // chores tab person filter
        this._expandedSkippedDates = new Set(); // dates whose skipped-group is expanded

        // Navigation state (command_center mode)
        this._view         = "home";     // 'home' | 'room:<id>' | 'person:<id>'
        this._backStack    = [];         // push on nav, pop on nav-back
        this._viewPersonId = null;       // set transiently during person-view render
        this._celebration  = null;       // { name, streak } — milestone overlay

        // Drag-to-reorder state
        this._dragId        = null;
        this._dragOverId    = null;
        this._sortedChores  = [];  // populated by modes-admin.js during render

        // Admin chore table state (S9 P3 item 5)
        this._adminSelectedChoreId = null;   // chore_id shown in inline side panel (null = closed)
        this._adminSort            = { col: null, dir: "asc" }; // { col: "name"|"pts"|"cat"|"asgn", dir: "asc"|"desc" }
        this._adminCollapsedCats   = new Set();  // category labels whose rows are collapsed
        this._choreFormTab         = "details";  // active tab in chore form (modal AND inline panel share this)

        // AbortController for event listener cleanup
        this._abortCtrl = null;

        // Retry timer: polls for sensor data on slow cold-boot (Echo Show 15)
        this._retryTimer = null;
    }

    // ---- Web Component lifecycle -------------------------------------------

    /**
     * Attach ALL event listeners ONCE in connectedCallback.
     * _doRender() NEVER touches event listeners — this is the fix for the
     * v0.2.2 memory leak caused by re-attaching listeners on every render.
     */
    connectedCallback() {
        this._abortCtrl = new AbortController();
        const { signal } = this._abortCtrl;
        const root = this.shadowRoot;

        // ---- Delegated click handler ---------------------------------------
        root.addEventListener("click", e => {
            const el = e.target.closest("[data-act]");
            if (!el) return;
            dispatch(el.dataset.act, el, this);
        }, { signal });

        // ---- Change handler ------------------------------------------------
        root.addEventListener("change", e => {
            const t = e.target;

            // Inline toggle: show dollar value to kids
            if (t.dataset.act === "toggle-dollar") {
                this._svc("update_settings", { show_dollar_value_to_kids: t.checked });
                return;
            }
            // Inline toggle: show dollar value to kids
            if (t.dataset.act === "toggle-dollar") {
                this._svc("update_settings", { show_dollar_value_to_kids: t.checked });
                return;
            }
            // Global penalty pause toggle (v0.4.2)
            if (t.dataset.act === "toggle-global-penalty") {
                this._svc("update_settings", { penalties_paused: !t.checked });
                return;
            }
            // Per-person penalty pause toggle (v0.4.2)
            if (t.dataset.act === "toggle-person-penalty") {
                const pid = t.dataset.pid;
                if (pid) this._svc("update_person", { person_id: pid, penalties_paused: !t.checked });
                return;
            }
            // "Everyone" checkbox: sync all individual person checkboxes + chip labels
            if (t.id === "m-everyone") {
                root.querySelectorAll(".m-assign-person").forEach(cb => {
                    cb.checked = t.checked;
                    cb.closest(".fh-person-cb-chip")?.classList.toggle("checked", t.checked);
                });
            }
            // Individual person checkbox unchecked: uncheck Everyone
            if (t.classList.contains("m-assign-person") && !t.checked) {
                const ev = root.getElementById("m-everyone");
                if (ev) ev.checked = false;
            }
            // Weekday chip visual feedback — both m-wd-day (weekly, multi-select)
            // and m-df-day (daily filter, multi-select) just toggle the clicked chip.
            if (t.classList.contains("m-wd-day") || t.classList.contains("m-df-day")) {
                t.closest(".fh-wd-chip")?.classList.toggle("checked", t.checked);
            }
            // Person cb chip visual feedback
            if (t.classList.contains("m-assign-person") || t.classList.contains("m-sp-person") || t.classList.contains("m-rot-person")) {
                t.closest(".fh-person-cb-chip")?.classList.toggle("checked", t.checked);
            }
            // Sync conditional modal fields after any change
            this._syncModalUI();
        }, { signal });

        // ---- Drag-to-reorder handlers -------------------------------------
        root.addEventListener("dragstart", e => {
            const row = e.target.closest("[data-drag-id]");
            if (!row) return;
            this._dragId = row.dataset.dragId;
            e.dataTransfer.effectAllowed = "move";
            setTimeout(() => row.classList.add("fh-dragging"), 0);
        }, { signal });

        root.addEventListener("dragover", e => {
            const row = e.target.closest("[data-drag-id]");
            if (!row || row.dataset.dragId === this._dragId) return;
            e.preventDefault();
            root.querySelectorAll(".fh-drag-over")
                .forEach(el => el.classList.remove("fh-drag-over"));
            row.classList.add("fh-drag-over");
            this._dragOverId = row.dataset.dragId;
        }, { signal });

        root.addEventListener("dragleave", e => {
            const row = e.target.closest("[data-drag-id]");
            if (row) row.classList.remove("fh-drag-over");
        }, { signal });

        root.addEventListener("drop", e => {
            e.preventDefault();
            root.querySelectorAll(".fh-drag-over, .fh-dragging")
                .forEach(el => el.classList.remove("fh-drag-over", "fh-dragging"));
            const dragId = this._dragId;
            const overId = this._dragOverId;
            this._dragId = this._dragOverId = null;
            if (!dragId || !overId || dragId === overId) return;

            const sorted  = this._sortedChores;
            const without = sorted.filter(c => c.chore_id !== dragId);
            const insertAt= without.findIndex(c => c.chore_id === overId);
            if (insertAt < 0) return;

            const isLast = (insertAt === without.length - 1);
            let before, after;
            if (isLast) {
                before = without[insertAt].sort_order;
                after  = before + 20;
            } else {
                before = without[insertAt - 1]?.sort_order ?? (without[insertAt].sort_order - 20);
                after  = without[insertAt].sort_order;
            }

            let newOrder = (before + after) / 2;

            // Reindex if gap has compressed below useful threshold
            const GAP_THRESHOLD = 0.01;
            if (Math.abs(after - newOrder) < GAP_THRESHOLD || Math.abs(newOrder - before) < GAP_THRESHOLD) {
                const reindexed = without.map((c, i) => ({ ...c, sort_order: (i + 1) * 10 }));
                const rBefore   = reindexed[insertAt - 1]?.sort_order ?? 0;
                const rAfter    = reindexed[insertAt]?.sort_order ?? (rBefore + 20);
                newOrder        = (rBefore + rAfter) / 2;
                reindexed.forEach(c => {
                    if (c.chore_id !== dragId) {
                        this._svc("update_chore", { chore_id: c.chore_id, sort_order: c.sort_order });
                    }
                });
            }

            this._svc("update_chore", { chore_id: dragId, sort_order: newOrder });
        }, { signal });

        root.addEventListener("dragend", () => {
            root.querySelectorAll(".fh-drag-over, .fh-dragging")
                .forEach(el => el.classList.remove("fh-drag-over", "fh-dragging"));
            this._dragId = this._dragOverId = null;
        }, { signal });
    }

    disconnectedCallback() {
        this._abortCtrl?.abort();
        this._abortCtrl = null;
        if (this._retryTimer) { clearTimeout(this._retryTimer); this._retryTimer = null; }
    }

    // ---- HA card API -------------------------------------------------------

    setConfig(cfg) {
        const modes = ["command_center", "personal", "maintenance", "admin"];
        if (!cfg.mode) throw new Error("Family Hub: 'mode' is required");
        if (!modes.includes(cfg.mode)) throw new Error(`Family Hub: mode must be one of ${modes.join(", ")}`);
        if (cfg.mode === "personal" && !cfg.person) throw new Error("Family Hub: 'person' is required for personal mode");
        if (cfg.initial_view && !/^(person|room):[A-Za-z0-9_-]+$/.test(cfg.initial_view)) {
            throw new Error(`Family Hub: 'initial_view' must be 'person:<id>' or 'room:<id>'`);
        }
        this._cfg = cfg;
        if (cfg.mode === "command_center" && cfg.initial_view && !this._initialViewApplied) {
            this._view      = cfg.initial_view;
            this._backStack = ["home"];
            this._initialViewApplied = true;
        }
        this._doRender(true);
    }

    set hass(hass) {
        this._hass = hass;
        this._maybeRender();
        this._scheduleRetryIfNeeded();
    }

    // Polls until sensor data is present — handles slow websocket delivery on Echo Show 15.
    // Once people data arrives the dirty-check will re-evaluate and render.
    _scheduleRetryIfNeeded() {
        if (this._retryTimer) return;
        const ready = !!(this._hass?.states?.["sensor.family_hub_needs_attention"]?.attributes?.people?.length);
        if (ready) return;

        let attempts = 0;
        const retry = () => {
            this._retryTimer = null;
            if (!this._hass) return;
            attempts++;
            const nowReady = !!(this._hass.states?.["sensor.family_hub_needs_attention"]?.attributes?.people?.length);
            if (nowReady) {
                for (const id of FH_SENSORS) delete this._lastKeys[id];
                this._maybeRender();
            } else if (attempts < 15) {
                this._retryTimer = setTimeout(retry, 2000);
            }
        };
        this._retryTimer = setTimeout(retry, 2000);
    }

    getCardSize() { return 5; }

    // ---- Dirty-check -------------------------------------------------------

    /**
     * Only re-renders when Family Hub sensor data actually changed.
     * Suppressed entirely while a modal is open to protect user input.
     */
    _maybeRender() {
        if (!this._hass) return;
        if (this._modal) return;
        // Freeze sensor-driven re-renders while inline chore editor panel is open —
        // otherwise typed-but-unsaved field values get overwritten on every 30s poll.
        if (this._adminSelectedChoreId) return;

        const states = this._hass.states;
        let changed  = false;

        for (const id of FH_SENSORS) {
            const ts = states[id]?.last_updated;
            if (ts !== this._lastKeys[id]) { this._lastKeys[id] = ts; changed = true; }
        }

        for (const p of (states["sensor.family_hub_needs_attention"]?.attributes?.people || [])) {
            const id = `sensor.family_hub_${slug(p.name)}`;
            const ts = states[id]?.last_updated;
            if (ts !== this._lastKeys[id]) { this._lastKeys[id] = ts; changed = true; }
        }

        if (changed) this._doRender(false);
    }

    // ---- Render core -------------------------------------------------------

    /**
     * Rebuild the shadow DOM. Does NOT touch event listeners.
     * Modal is appended as a separate DOM node so background re-renders
     * never destroy an open modal.
     */
    _doRender(force = false) {
        if (!this._hass && !force) return;

        try {
            const scale = parseFloat(this._cfg.text_scale) || 1;
            const styleEl       = document.createElement("style");
            styleEl.textContent = CSS + `:host { --fh-text-scale: ${scale}; }`;

            const card     = document.createElement("div");
            card.className = "fh-card";

            if (!this._hass) {
                card.innerHTML = `<div class="fh-empty">Loading…</div>`;
            } else {
                // Redirect stale section IDs from older builds
                const _validAdminSecs = ["today","family","tasks","history","settings"];
                if (!_validAdminSecs.includes(this._adminSec)) this._adminSec = "today";

                switch (this._cfg.mode) {
                    case "command_center": card.innerHTML = this._htmlCommandCenter(); break;
                    case "personal":       card.innerHTML = htmlPersonal(this);        break;
                    case "maintenance":    card.innerHTML = htmlMaintenance(this);     break;
                    case "admin":          card.innerHTML = htmlAdmin(this);           break;
                }
            }

            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(styleEl);
            this.shadowRoot.appendChild(card);

            if (this._modal) {
                this.shadowRoot.appendChild(this._buildModal());
            }

            this._syncModalUI();
        } catch (err) {
            console.error("[family-hub] render error:", err);
            // Show a safe loading state rather than letting HA catch this as a card error.
            // The retry loop will attempt another render once sensor data is available.
            const styleEl = document.createElement("style");
            styleEl.textContent = CSS;
            const card = document.createElement("div");
            card.className = "fh-card";
            card.innerHTML = `<div class="fh-empty">Loading…</div>`;
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(styleEl);
            this.shadowRoot.appendChild(card);
            // Force a fresh render attempt in 3s
            setTimeout(() => {
                if (this._hass) {
                    for (const id of FH_SENSORS) delete this._lastKeys[id];
                    this._maybeRender();
                }
            }, 3000);
        }
    }

    // ---- Command Center view routing ---------------------------------------

    _htmlCommandCenter() {
        const view = this._view || "home";

        if (view === "home") {
            return htmlHome(this);
        }

        // Non-home: figure out view content, then wrap with back bar
        let inner = "";

        if (view.startsWith("room:")) {
            const roomId = view.slice(5);   // "room:".length === 5
            const room   = getRoomById(roomId);
            inner = room?.render ? room.render(this) : `<div class="fh-empty">Unknown room.</div>`;
        } else if (view.startsWith("person:")) {
            const personId     = view.slice(7); // "person:".length === 7
            this._viewPersonId = personId;
            const person       = this._findPerson(personId);
            const theme        = getTheme(person?.theme_key || "classic");
            inner              = htmlPersonal(this);
            this._viewPersonId = null;
            // Themes with handlesNavigation:true render their own back button
            if (theme.handlesNavigation) return inner;
        } else {
            // Fallback: go home
            this._view = "home";
            return htmlHome(this);
        }

        return htmlNavBack("Home") + inner;
    }

    // ---- Sensor data accessors ---------------------------------------------

    _states(id) { return this._hass?.states?.[id]; }
    _attrs(id)  { return this._states(id)?.attributes || {}; }
    _people()   { return this._attrs("sensor.family_hub_needs_attention").people || []; }

    _findPerson(nameOrId) {
        const lc = (nameOrId || "").toLowerCase();
        return this._people().find(p =>
            p.name.toLowerCase() === lc || p.person_id === nameOrId
        ) || null;
    }

    _personEntityId(name) { return `sensor.family_hub_${slug(name)}`; }

    // ---- Service calls -----------------------------------------------------

    _svc(service, data) {
        if (!this._hass) return;
        this._hass.callService(DOMAIN, service, data);
    }

    // ---- Modal management --------------------------------------------------

    /**
     * Build the modal overlay as a real DOM node appended to the shadow root.
     * Never part of the main card innerHTML — background re-renders won't destroy it.
     */
    _buildModal() {
        const bg     = document.createElement("div");
        bg.className = "fh-modal-bg";
        bg.innerHTML = this._modalHTML();
        bg.addEventListener("click", e => {
            if (e.target === bg) this._closeModal();
        });
        return bg;
    }

    _modalHTML() {
        if (!this._modal) return "";
        const { type, data } = this._modal;
        const people    = this._people();
        const catLabels = this._attrs("sensor.family_hub_needs_attention").category_labels || [];
        const chores    = this._attrs("sensor.family_hub_needs_attention").active_chores || [];

        switch (type) {
            case "award":
            case "deduct":              return mPointAdjust(this._modal);
            case "add-task":            return mAddTask(people);
            case "add-chore":           return mChoreForm(null, false, people, catLabels, this._choreFormTab);
            case "edit-chore":          return mChoreForm(data.chore, true, people, catLabels, this._choreFormTab);
            case "add-store-item":      return mAddStoreItem(people);
            case "edit-store-item":     return mEditStoreItem(data.item, people);
            case "add-person":          return mAddPerson();
            case "edit-person":         return mEditPerson(data);
            case "edit-settings":       return mEditSettings(data);
            case "claim":               return mClaim(this._modal, people);
            case "add-reminder":        return mAddReminder(this._modal, people);
            case "confirm-remove-person": return mConfirmRemovePerson(data);
            case "edit-streaks": {
                const p       = this._people().find(pp => pp.person_id === data.pid);
                const streaks = p?.streaks || {};
                return mEditStreaks(data.pid, data.pname, chores, streaks);
            }
            default:                    return "";
        }
    }

    _closeModal() {
        this._modal = null;
        this._choreFormTab = "details";  // reset for next time
        this._doRender(true);
    }

    // ---- Conditional modal UI sync ----------------------------------------

    /**
     * Show/hide conditional form sections without re-rendering the whole card.
     * Called after every _doRender and every change event.
     * Safe to call when no modal is open.
     */
    _syncModalUI() {
        const sr   = this.shadowRoot;
        const show = id => { const el = sr.getElementById(id); if (el) el.style.display = ""; };
        const hide = id => { const el = sr.getElementById(id); if (el) el.style.display = "none"; };

        // Add task modal: show sections by task type
        const taskTypeEl = sr.getElementById("m-tasktype");
        if (taskTypeEl) {
            const tt = taskTypeEl.value;
            if (tt === "assigned")  { show("m-task-assigned-section");  hide("m-task-claimable-section"); hide("m-task-reminder-section"); }
            if (tt === "claimable") { hide("m-task-assigned-section");  show("m-task-claimable-section"); hide("m-task-reminder-section"); }
            if (tt === "reminder")  { hide("m-task-assigned-section");  hide("m-task-claimable-section"); show("m-task-reminder-section"); }
        }

        // Add task: penalty points field inside assigned section
        const taskPenEl  = sr.getElementById("m-tpenalty");
        const taskPenSec = sr.getElementById("m-task-penalty-section");
        if (taskPenEl && taskPenSec) {
            taskPenSec.style.display = taskPenEl.checked ? "" : "none";
        }

        // Chore form: recurrence conditional fields
        const recEl = sr.getElementById("m-crec");
        if (recEl) {
            const rec     = recEl.value;
            const ctypeEl = sr.getElementById("m-ctype");
            const ctype   = ctypeEl?.value || "assigned";

            hide("m-dayfilter-section");
            hide("m-weekdays-section");
            hide("m-dom-section");
            hide("m-chore-expiry-section");

            if (rec === "daily")            show("m-dayfilter-section");
            if (rec === "weekly")           show("m-weekdays-section");
            if (rec === "monthly_on_date")  show("m-dom-section");

            const isClaimOrOneTime = rec === "one_time" || ctype === "claimable";
            if (isClaimOrOneTime) show("m-chore-expiry-section");
        }

        // Chore form: claimable subtype section
        const ctypeEl2   = sr.getElementById("m-ctype");
        const claimSec   = sr.getElementById("m-claimable-section");
        const multiSec   = sr.getElementById("m-multi-claim-section");
        const subtypeEl  = sr.getElementById("m-csubtype");
        if (ctypeEl2 && claimSec) {
            const isClaimable = ctypeEl2.value === "claimable";
            claimSec.style.display = isClaimable ? "" : "none";
            if (multiSec) {
                const isMulti = isClaimable && subtypeEl?.value === "multi_claim";
                multiSec.style.display = isMulti ? "" : "none";
            }
        }

        // Chore form: penalty points + daily threshold fields
        const penaltyEl       = sr.getElementById("m-cpenalty");
        const penaltySec      = sr.getElementById("m-penalty-pts-section");
        const dailyThreshSec  = sr.getElementById("m-daily-threshold-section");
        if (penaltyEl && penaltySec) {
            penaltySec.style.display     = penaltyEl.checked ? "" : "none";
            if (dailyThreshSec) dailyThreshSec.style.display = penaltyEl.checked ? "" : "none";
        }

        // Store scope person checkboxes
        const scopeEl     = sr.getElementById("m-sscope");
        const personSecEl = sr.getElementById("m-sperson-section");
        if (scopeEl && personSecEl) {
            personSecEl.style.display = scopeEl.value === "personal" ? "" : "none";
        }

        // Chore rotation: only meaningful for assigned chores; pool/cadence
        // fields collapse when the toggle is off.
        const rotSec     = sr.getElementById("m-rotation-section");
        const rotCfg     = sr.getElementById("m-rotation-config");
        const rotEnabled = sr.getElementById("m-crot-enabled");
        const ctypeEl3   = sr.getElementById("m-ctype");
        if (rotSec) {
            rotSec.style.display = (ctypeEl3?.value === "assigned") ? "" : "none";
        }
        if (rotCfg && rotEnabled) {
            rotCfg.style.display = rotEnabled.checked ? "" : "none";
        }
    }
}
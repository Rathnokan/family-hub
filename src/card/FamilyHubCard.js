/**
 * Family Hub Card — Main Card Class
 * Web Component shell: lifecycle, dirty-check, render orchestration,
 * modal overlay management, and conditional UI sync.
 *
 * HTML rendering is delegated to the modes-*.js and modals.js modules.
 * Event handling is delegated to dispatch.js.
 */

import { CSS }                                        from "./css.js";
import { VERSION, DOMAIN }                            from "./constants.js";
import { slug }                                       from "./utils.js";
import { htmlPersonal }                               from "./modes-personal.js";
import { htmlAdmin }                                  from "./modes-admin.js";
import { htmlHome, htmlNavBack }                      from "./modes-home.js";
import { getRoomById }                                from "./rooms/index.js";
import { htmlCelebration }                            from "./modes-chores.js";
import { renderMaintenance }                         from "./rooms/maintenance.js";
import { getTheme }                                   from "./themes/index.js";
import { dispatch, handleIconFileSelection }          from "./dispatch.js";
import {
    mPointAdjust,
    mPartialCredit,
    mChoreForm,
    mAddStoreItem,
    mEditStoreItem,
    mAddPerson,
    mEditPerson,
    mEditSettings,
    mRanksDrawer,
    mClaim,
    mAddReminder,
    mConfirmRemovePerson,
    mConfirmHardDeletePerson,
    mEditStreaks,
    mChipIn,
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

        // v0.7.0 P2: card data comes from a websocket model (family_hub/get_model),
        // not from fat sensor attributes. The needs_attention sensor exposes a
        // single data_rev counter that bumps on every store mutation; the card
        // refetches the model when it changes. _attrs() reads model-first.
        this._model       = null;
        this._lastDataRev = undefined;
        this._pendingRev  = undefined;
        this._fetching    = false;

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
        this._dragId           = null;
        this._dragOverId       = null;
        this._dragType         = null;  // v0.6.3: "chore" | "store-item"
        this._sortedChores     = [];    // populated by modes-admin.js during render
        this._sortedStoreItems = [];    // populated by modes-admin.js during render (v0.6.3)

        // Admin chore table state (S9 P3 item 5)
        this._adminSelectedChoreId = null;   // chore_id shown in inline side panel (null = closed)
        this._adminSort            = { col: null, dir: "asc" };
        this._adminCollapsedCats   = new Set();
        this._choreFormTab         = "details";

        // Admin rewards section state
        this._adminSelectedItemId      = null;   // item_id shown in inline side panel (null = closed)
        this._adminSortItems           = { col: null, dir: "asc" };
        this._adminCollapsedRewardCats = new Set();
        this._storeItemFilter          = null;   // "active" | "inactive" | null

        // ---- Meals room UI state (v0.8.0) ------------------------------------
        this._mealsTab            = "week";    // active tab: today|week|plan|pantry|library|groceries
        this._mealsWeekPage       = 0;         // This Week pagination (0 = current week)
        this._mealsJumpDate       = null;      // ISO date selected in Plan rail (null = today)
        this._mealsDrawer         = null;      // Drawer state object or null (see dispatch.js)
        this._mealsRecipe         = null;      // mealId for open recipe modal, or null
        this._mealsDayPick        = null;      // mealId for open day-pick modal, or null
        this._mealsNudgeDismissed = new Set(); // dismissed veggie-nudge per-open-drawer session
        this._mealsFatDismissed   = new Set(); // dismissed fats-note per-open-drawer session
        this._mealsLibFilter      = "all";     // Library type filter: all|b|l|d
        this._mealsAdminSubtab    = "meals";   // Admin Meals section sub-tab: meals|ingredients|recipes
        this._mealsAdminRecipeId  = null;      // mealId being recipe-edited in Admin (freezes re-render)

        // AbortController for event listener cleanup
        this._abortCtrl = null;

        // Retry timer: polls for sensor data on slow cold-boot (Echo Show 15)
        this._retryTimer = null;
    }

    /**
     * v0.6.3 P2: reorder a category label by drag-and-drop. Categories are
     * stored as a single ordered string list in `settings.category_labels`,
     * so reorder = compute new order client-side, push the full list via
     * update_settings.
     */
    _reorderCategory(dragLabel, overLabel, side) {
        const current = this._attrs("sensor.family_hub_needs_attention").category_labels || [];
        if (!current.includes(dragLabel) || !current.includes(overLabel)) return;
        const without  = current.filter(l => l !== dragLabel);
        const overIdx  = without.indexOf(overLabel);
        const insertAt = side === "above" ? overIdx : overIdx + 1;
        const next = [...without.slice(0, insertAt), dragLabel, ...without.slice(insertAt)];
        this._svc("update_settings", { category_labels: next });
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
            // <select> elements (e.g. the Chores-tab filter dropdowns) carry a
            // data-act but are driven by the `change` handler. Dispatching on the
            // opening click would re-render and snap the dropdown shut instantly.
            if (el.tagName === "SELECT") return;
            dispatch(el.dataset.act, el, this);
        }, { signal });

        // ---- Change handler ------------------------------------------------
        root.addEventListener("change", e => {
            const t = e.target;

            // Chores-tab filter dropdowns (Status / Type / Assignee) + the
            // earning-rail what-if selects (rank / completion % / streak %) —
            // route the <select> change straight through dispatch (reads el.value).
            if ([
                "chore-status-filter", "chore-rec-filter", "chore-filter",
                "stats-rank", "stats-completion", "stats-streak-pct",
            ].includes(t.dataset.act)) {
                dispatch(t.dataset.act, t, this);
                return;
            }

            // Earning rail: include-streak-bonus toggle (session view-state only).
            if (t.dataset.act === "toggle-stats-streaks") {
                this._statsIncludeStreaks = t.checked;
                this._doRender(true);
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
            // Reward icon upload: file picker fired its change event
            if (t.id === "m-icon-upload" && t.files && t.files.length > 0) {
                handleIconFileSelection(t, root);
            }
            // Sync conditional modal fields after any change
            this._syncModalUI();
        }, { signal });

        // ---- Drag-to-reorder handlers -------------------------------------
        // v0.6.3: rows carry data-drag-type so the same handlers serve all
        // reorderable lists (chores, store items, category chips). Cross-type
        // drops are refused by the dragover guard.
        //
        // Insertion model (v0.6.3 P2): cursor Y position vs target's vertical
        // midpoint decides whether the dragged row lands ABOVE or BELOW the
        // target. The insertion line is rendered via .fh-drop-above /
        // .fh-drop-below classes on the target so the user can see exactly
        // where the row will land before releasing.
        root.addEventListener("dragstart", e => {
            const row = e.target.closest("[data-drag-id]");
            if (!row) return;
            this._dragId   = row.dataset.dragId;
            this._dragType = row.dataset.dragType || "chore";
            this._dragSide = null;
            e.dataTransfer.effectAllowed = "move";
            setTimeout(() => row.classList.add("fh-dragging"), 0);
        }, { signal });

        root.addEventListener("dragover", e => {
            const row = e.target.closest("[data-drag-id]");
            if (!row || row.dataset.dragId === this._dragId) return;
            const rowType = row.dataset.dragType || "chore";
            if (rowType !== this._dragType) return;
            e.preventDefault();

            // Decide above vs below from cursor position vs row midpoint.
            // Horizontal lists (category chips) use X; vertical lists
            // (chores, store items) use Y.
            const rect = row.getBoundingClientRect();
            const horizontal = rowType === "category";
            const side = horizontal
                ? (e.clientX < rect.left + rect.width / 2 ? "above" : "below")
                : (e.clientY < rect.top + rect.height / 2 ? "above" : "below");

            // Clear all prior indicators then mark this row.
            root.querySelectorAll(".fh-drop-above, .fh-drop-below")
                .forEach(el => el.classList.remove("fh-drop-above", "fh-drop-below"));
            row.classList.add(side === "above" ? "fh-drop-above" : "fh-drop-below");

            this._dragOverId = row.dataset.dragId;
            this._dragSide   = side;
        }, { signal });

        root.addEventListener("dragleave", e => {
            const row = e.target.closest("[data-drag-id]");
            if (row) row.classList.remove("fh-drop-above", "fh-drop-below");
        }, { signal });

        root.addEventListener("drop", e => {
            e.preventDefault();
            root.querySelectorAll(".fh-drop-above, .fh-drop-below, .fh-dragging")
                .forEach(el => el.classList.remove("fh-drop-above", "fh-drop-below", "fh-dragging"));
            const dragId = this._dragId;
            const overId = this._dragOverId;
            const side   = this._dragSide || "above";
            const type   = this._dragType || "chore";
            this._dragId = this._dragOverId = null;
            this._dragSide = null;
            this._dragType = null;
            if (!dragId || !overId || dragId === overId) return;

            // Pick the right list, ID accessor, and update service for this row type.
            // category chips don't carry sort_order numerics — they're handled
            // separately below via a single update_settings call with the full
            // reordered list.
            if (type === "category") {
                this._reorderCategory(dragId, overId, side);
                return;
            }

            const ctx = type === "store-item"
                ? { list: this._sortedStoreItems, idKey: "item_id",
                    svc: "update_store_item", idField: "item_id" }
                : { list: this._sortedChores,    idKey: "chore_id",
                    svc: "update_chore",      idField: "chore_id" };

            // Compute the target index in the "without dragged" list and the
            // neighbors to bisect between.
            const without = ctx.list.filter(c => c[ctx.idKey] !== dragId);
            const overIdx = without.findIndex(c => c[ctx.idKey] === overId);
            if (overIdx < 0) return;

            // Translate "drop above/below target" into a neighbor pair for bisect.
            // "above target" → insert just before overIdx
            // "below target" → insert just after overIdx
            let before, after;
            if (side === "above") {
                before = without[overIdx - 1]?.sort_order ?? (without[overIdx].sort_order - 20);
                after  = without[overIdx].sort_order;
            } else {
                before = without[overIdx].sort_order;
                after  = without[overIdx + 1]?.sort_order ?? (before + 20);
            }

            let newOrder = (before + after) / 2;

            // Reindex if gap has compressed below useful threshold. We rebuild
            // the whole list with clean (i+1)*10 spacing, then bisect into the
            // chosen gap on the freshly-spaced ladder.
            const GAP_THRESHOLD = 0.01;
            if (Math.abs(after - newOrder) < GAP_THRESHOLD || Math.abs(newOrder - before) < GAP_THRESHOLD) {
                const reindexed = without.map((c, i) => ({ ...c, sort_order: (i + 1) * 10 }));
                const rOverIdx  = reindexed.findIndex(c => c[ctx.idKey] === overId);
                let rBefore, rAfter;
                if (side === "above") {
                    rBefore = reindexed[rOverIdx - 1]?.sort_order ?? 0;
                    rAfter  = reindexed[rOverIdx].sort_order;
                } else {
                    rBefore = reindexed[rOverIdx].sort_order;
                    rAfter  = reindexed[rOverIdx + 1]?.sort_order ?? (rBefore + 20);
                }
                newOrder = (rBefore + rAfter) / 2;
                reindexed.forEach(c => {
                    if (c[ctx.idKey] !== dragId) {
                        this._svc(ctx.svc, { [ctx.idField]: c[ctx.idKey], sort_order: c.sort_order });
                    }
                });
            }

            this._svc(ctx.svc, { [ctx.idField]: dragId, sort_order: newOrder });
        }, { signal });

        root.addEventListener("dragend", () => {
            root.querySelectorAll(".fh-drop-above, .fh-drop-below, .fh-dragging")
                .forEach(el => el.classList.remove("fh-drop-above", "fh-drop-below", "fh-dragging"));
            this._dragId = this._dragOverId = null;
            this._dragSide = null;
            this._dragType = null;
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

    // Polls until the model has loaded — handles slow websocket delivery on
    // Echo Show 15 cold boot. Each tick calls _maybeRender, which fetches the
    // model once the needs_attention sensor (carrying data_rev) is present.
    _scheduleRetryIfNeeded() {
        if (this._retryTimer) return;
        if (this._model) return;

        let attempts = 0;
        const retry = () => {
            this._retryTimer = null;
            if (!this._hass || this._model) return;
            attempts++;
            this._maybeRender();
            if (!this._model && attempts < 15) {
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
        // Freeze re-renders while an inline editor panel is open — otherwise
        // typed-but-unsaved field values get overwritten.
        if (this._adminSelectedChoreId) return;
        if (this._adminSelectedItemId) return;
        // Inline subscription editor open — a background model refetch would
        // rebuild .fh-card and wipe the typed cost/date before save.
        if (this._editingSubId) return;
        // Meals admin recipe editor open — protect the typed time/serves/
        // ingredients/steps textareas from a background refetch.
        if (this._mealsAdminRecipeId) return;

        // v0.7.0 P2: card data lives in a websocket model, not sensor attributes.
        // The needs_attention sensor exposes a single data_rev counter that bumps
        // on every store mutation; refetch the model when it changes (or on first
        // load), otherwise there's nothing to do.
        const rev = this._hass.states["sensor.family_hub_needs_attention"]?.attributes?.data_rev;
        if (rev === undefined) return;                                  // sensors not ready yet
        if (this._model !== null && rev === this._lastDataRev) return;  // unchanged
        this._fetchModel(rev);
    }

    /**
     * Fetch the full card model over the websocket and re-render. Concurrent
     * calls are coalesced: a fetch already in flight records the latest rev and
     * the loop keeps fetching until the loaded model is current.
     */
    async _fetchModel(rev) {
        this._pendingRev = rev;
        if (this._fetching) return;
        this._fetching = true;
        try {
            while (this._lastDataRev !== this._pendingRev) {
                const targetRev = this._pendingRev;
                let model;
                try {
                    model = await this._hass.connection.sendMessagePromise({ type: "family_hub/get_model" });
                } catch (err) {
                    console.error("Family Hub: get_model failed", err);
                    return;
                }
                this._model = model;
                // Track the SENSOR rev that triggered this fetch — NOT the model's
                // own data_rev. The store counter can advance without the sensor
                // refreshing (e.g. the per-minute notification heartbeat saves),
                // so the model's data_rev can run ahead of the sensor's. Keying
                // off the model value would make the dirty-check perpetually true
                // and re-render on every hass update — which closes open dropdowns.
                this._lastDataRev = targetRev;
            }
        } finally {
            this._fetching = false;
        }
        // A modal / inline panel may have opened while we were fetching — respect the freeze.
        if (this._modal || this._adminSelectedChoreId || this._adminSelectedItemId || this._editingSubId || this._mealsAdminRecipeId) return;
        this._doRender(false);
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

            if (!this._hass || !this._model) {
                // v0.7.0 P2: all card data lives in the websocket model; show a
                // loading state until the first fetch resolves (avoids a flash of
                // partial data now that sensors only carry scalars).
                card.innerHTML = `<div class="fh-empty">Loading…</div>`;
            } else {
                // Redirect stale section IDs from older builds
                const _validAdminSecs = ["today","family","tasks","rewards","meals","history","settings"];
                if (!_validAdminSecs.includes(this._adminSec)) this._adminSec = "today";

                switch (this._cfg.mode) {
                    case "command_center": card.innerHTML = this._htmlCommandCenter(); break;
                    case "personal":       card.innerHTML = htmlPersonal(this);        break;
                    case "maintenance":    card.innerHTML = renderMaintenance(this);   break;
                    case "admin":          card.innerHTML = htmlAdmin(this);           break;
                }
            }

            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(styleEl);
            this.shadowRoot.appendChild(card);

            if (this._modal) {
                this.shadowRoot.appendChild(this._buildModal());
            }

            if (this._celebration) {
                const cel = document.createElement("div");
                cel.innerHTML = htmlCelebration(this._celebration);
                this.shadowRoot.appendChild(cel.firstElementChild);
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
            // Force a fresh model fetch + render attempt in 3s
            setTimeout(() => {
                if (this._hass) {
                    this._lastDataRev = undefined;   // force _maybeRender to refetch the model
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
    _attrs(id)  { return (this._model && this._model[id]) || this._states(id)?.attributes || {}; }
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
        // Surface backend rejections (e.g. voluptuous schema validation errors
        // when HA hasn't been restarted after a schema change) so silent failures
        // become visible instead of just doing nothing. HA wraps service errors
        // in a few different shapes — we dig through each to find a usable message.
        try {
            const p = this._hass.callService(DOMAIN, service, data);
            if (p && typeof p.catch === "function") {
                p.catch(err => {
                    console.error(`[family-hub] service ${service} failed:`, err, "payload:", data);
                    // Walk known error-message locations in order of preference
                    let msg =
                        err?.body?.message ||
                        err?.error?.message ||
                        err?.message ||
                        err?.error ||
                        "";
                    if (!msg || typeof msg !== "string") {
                        try { msg = JSON.stringify(err); } catch { msg = String(err); }
                    }
                    // Truncate (don't suppress) — Echo Show / mobile alerts wrap fine
                    if (msg.length > 600) msg = msg.slice(0, 600) + "…";
                    alert(`Family Hub service "${service}" failed:\n\n${msg}\n\n(See browser console for full details.)`);
                });
            }
        } catch (err) {
            console.error(`[family-hub] callService threw:`, err);
            alert(`Family Hub: service call "${service}" crashed before sending.\n\n${err?.message || err}`);
        }
    }

    // ---- Modal management --------------------------------------------------

    /**
     * Build the modal overlay as a real DOM node appended to the shadow root.
     * Never part of the main card innerHTML — background re-renders won't destroy it.
     */
    _buildModal() {
        const bg     = document.createElement("div");
        bg.className = "fh-modal-bg" + (this._modal?.surface === "drawer" ? " fh-modal-bg--drawer" : "");
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
            case "partial-credit":      return mPartialCredit(this._modal);
            case "add-chore":           return mChoreForm(null, false, people, catLabels, this._choreFormTab);
            case "edit-chore":          return mChoreForm(data.chore, true, people, catLabels, this._choreFormTab);
            case "add-store-item":      return mAddStoreItem(people, catLabels);
            case "edit-store-item":     return mEditStoreItem(data.item, people, catLabels);
            case "add-person":          return mAddPerson();
            case "edit-person":         return mEditPerson(data);
            case "edit-settings":       return mEditSettings(data);
            case "ranks":               return mRanksDrawer(this);
            case "claim":               return mClaim(this._modal, people);
            case "add-reminder":        return mAddReminder(this._modal, people);
            case "confirm-remove-person": return mConfirmRemovePerson(data);
            case "confirm-hard-delete-person": return mConfirmHardDeletePerson(data);
            case "edit-streaks": {
                const p       = this._people().find(pp => pp.person_id === data.pid);
                const streaks = p?.streaks || {};
                return mEditStreaks(data.pid, data.pname, chores, streaks);
            }
            case "chip-in":
                return mChipIn(data.item, data.pid, data.balance, data.remaining);
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

            // Expiry applies to claimable bonus chores (one-time is retired).
            if (ctype === "claimable") show("m-chore-expiry-section");
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

        // Group reward toggle — overrides person section when group is on
        const groupEl    = sr.getElementById("m-sgroup");
        const groupSecEl = sr.getElementById("m-sgroup-section");
        if (groupEl && groupSecEl) {
            groupSecEl.style.display = groupEl.checked ? "" : "none";
            if (groupEl.checked && personSecEl) personSecEl.style.display = "none";
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
        // v0.7.3: per-chore weekly rotation switch day — only for "weekly" cadence.
        const cadEl    = sr.getElementById("m-crot-cadence");
        const switchWrap = sr.getElementById("m-crot-switch-day-wrap");
        if (cadEl && switchWrap) {
            switchWrap.style.display = (cadEl.value === "weekly") ? "" : "none";
        }
    }
}
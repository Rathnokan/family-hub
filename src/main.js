/**
 * Family Hub Card — Stub entry point (v0.6.0 S11)
 *
 * This file registers thin <family-hub-card> and <family-hub-card-editor>
 * placeholder elements synchronously so Home Assistant's Lovelace registry
 * sees them immediately on page load. The heavy implementation
 * (~450 KB of card + themes + admin + modals) lives in family-hub-card-body.js
 * and is dynamically imported on first instantiation.
 *
 * Why this exists: on Echo Show 15 / Echo Show 8 / mobile Silk + slow phones,
 * the dashboard's first paint would race against the ~450 KB bundle download.
 * Lovelace would render "Custom element doesn't exist: family-hub-card" until
 * the user manually refreshed. The stub paints "Loading…" instantly, then
 * hot-swaps to the real impl element once the body bundle resolves.
 *
 * Build: esbuild bundles this into family-hub-card.js (IIFE, ~3-4 KB).
 * The body file is built separately as ESM and lazy-imported here.
 *
 * The cache-bust query string from the stub's own <script src=...> URL is
 * appended to the body fetch so both files refresh together on each release.
 */

import { VERSION } from "./card/constants.js";

const BODY_FILE = "family-hub-card-body.js";

// ---------------------------------------------------------------------------
// Lazy body loader — single shared promise across all card instances on page
// ---------------------------------------------------------------------------

let _bodyPromise = null;

function _loadBody() {
    if (_bodyPromise) return _bodyPromise;

    // Locate this stub's own <script> tag to build the body URL.
    // document.currentScript doesn't survive past the initial sync exec, so we
    // scan instead — match family-hub-card.js but exclude family-hub-card-body.js.
    let stubSrc = "";
    const scripts = document.getElementsByTagName("script");
    for (let i = scripts.length - 1; i >= 0; i--) {
        const s = scripts[i].src || "";
        if (s && /\/family-hub-card\.js(?:$|\?)/.test(s)) {
            stubSrc = s;
            break;
        }
    }

    // Split into base + search so we can inherit any cache-bust suffix
    // (?hacstag=… or ?v=…) onto the body URL — both refresh together.
    const qIdx   = stubSrc.indexOf("?");
    const path   = qIdx >= 0 ? stubSrc.slice(0, qIdx) : stubSrc;
    const search = qIdx >= 0 ? stubSrc.slice(qIdx)    : "";
    const base   = path
        ? path.replace(/[^/]*$/, "")
        : "/hacsfiles/family_hub/";          // sensible fallback

    const url = base + BODY_FILE + search;
    _bodyPromise = import(/* @vite-ignore */ url).catch(err => {
        console.error("[family-hub-card] Failed to load body bundle:", err);
        _bodyPromise = null;                  // allow retry on next instance
        throw err;
    });
    return _bodyPromise;
}

// ---------------------------------------------------------------------------
// Shared loading-state HTML (rendered into the wrapper before body resolves)
// ---------------------------------------------------------------------------

const LOADING_HTML = `
    <style>
        :host { display: block; }
        .fh-stub {
            padding: 28px 24px;
            background: var(--card-background-color, #1c1c1e);
            color: var(--secondary-text-color, #8c8c8e);
            border-radius: var(--ha-card-border-radius, 12px);
            border: 1px solid var(--divider-color, #2a2a2c);
            text-align: center;
            font-family: var(--ha-font-family-body, system-ui, sans-serif);
            font-size: 14px;
        }
        .fh-stub-dot {
            display: inline-block; width: 6px; height: 6px;
            border-radius: 50%; background: #7F77DD;
            margin: 0 2px; opacity: .35;
            animation: fh-stub-pulse 1.2s infinite ease-in-out;
        }
        .fh-stub-dot:nth-child(2) { animation-delay: .15s; }
        .fh-stub-dot:nth-child(3) { animation-delay: .3s; }
        @keyframes fh-stub-pulse {
            0%, 80%, 100% { opacity: .35; }
            40% { opacity: 1; }
        }
    </style>
    <div class="fh-stub">
        Loading Family Hub
        <span class="fh-stub-dot"></span><span class="fh-stub-dot"></span><span class="fh-stub-dot"></span>
    </div>`;

// ---------------------------------------------------------------------------
// <family-hub-card> wrapper — buffers setConfig / hass until impl is ready
// ---------------------------------------------------------------------------

class FamilyHubCardWrapper extends HTMLElement {

    // HA card API (static)
    static getStubConfig()    { return { mode: "command_center" }; }
    static getConfigElement() { return document.createElement("family-hub-card-editor"); }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = LOADING_HTML;
        _loadBody().then(() => this._upgrade()).catch(err => {
            this.shadowRoot.innerHTML =
                `<div style="padding:24px;color:#E8553E;font-family:system-ui">
                   Family Hub card failed to load. See browser console.
                 </div>`;
        });
    }

    _upgrade() {
        if (this._impl) return;
        // family-hub-card-impl is registered by the body file once it finishes loading.
        const impl = document.createElement("family-hub-card-impl");
        if (this._cfg)  impl.setConfig(this._cfg);
        if (this._hass) impl.hass = this._hass;
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(impl);
        this._impl = impl;
    }

    setConfig(cfg) {
        this._cfg = cfg;
        if (this._impl) this._impl.setConfig(cfg);
    }

    set hass(h) {
        this._hass = h;
        if (this._impl) this._impl.hass = h;
    }

    getCardSize() {
        return (this._impl && typeof this._impl.getCardSize === "function")
            ? this._impl.getCardSize()
            : 5;
    }
}

// ---------------------------------------------------------------------------
// <family-hub-card-editor> wrapper — same lazy-load pattern (no shadow root,
// since the existing editor uses light DOM to inherit HA's form styling).
// ---------------------------------------------------------------------------

class FamilyHubCardEditorWrapper extends HTMLElement {

    constructor() {
        super();
        this.innerHTML = `<div style="padding:24px;color:var(--secondary-text-color);font-family:system-ui">Loading editor…</div>`;
        _loadBody().then(() => this._upgrade()).catch(() => {
            this.innerHTML = `<div style="padding:24px;color:#E8553E">Editor failed to load. See browser console.</div>`;
        });
    }

    _upgrade() {
        if (this._impl) return;
        const impl = document.createElement("family-hub-card-editor-impl");
        if (this._cfg)  impl.setConfig(this._cfg);
        if (this._hass) impl.hass = this._hass;
        // Bubble config-changed events out of the wrapper to HA's editor pane.
        // (The events already bubble + compose from the impl; this is a safety net
        // so the wrapper instance also retains the latest cfg for redraws.)
        impl.addEventListener("config-changed", e => { this._cfg = e.detail?.config; });
        this.innerHTML = "";
        this.appendChild(impl);
        this._impl = impl;
    }

    setConfig(cfg) {
        this._cfg = cfg;
        if (this._impl) this._impl.setConfig(cfg);
    }

    set hass(h) {
        this._hass = h;
        if (this._impl) this._impl.hass = h;
    }
}

// ---------------------------------------------------------------------------
// Registration (guarded — Lovelace can reload the bundle on dashboard nav)
// ---------------------------------------------------------------------------

if (!customElements.get("family-hub-card")) {
    customElements.define("family-hub-card", FamilyHubCardWrapper);
}
if (!customElements.get("family-hub-card-editor")) {
    customElements.define("family-hub-card-editor", FamilyHubCardEditorWrapper);
}

// Declare to the Lovelace card picker
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === "family-hub-card")) {
    window.customCards.push({
        type:         "family-hub-card",
        name:         "Family Hub",
        description:  "Family task management — command center, personal, maintenance, and admin views.",
        preview:      false,
        configurable: true,
    });
}

// Version banner (stub)
console.info(
    `%c FAMILY-HUB-CARD %c v${VERSION} %c stub `,
    "background:#7F77DD;color:#fff;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px",
    "background:#1c1c1e;color:#fff;font-weight:400;padding:2px 6px",
    "background:#5B8DEF;color:#fff;font-weight:600;border-radius:0 4px 4px 0;padding:2px 6px"
);

(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/card/constants.js
  var VERSION;
  var init_constants = __esm({
    "src/card/constants.js"() {
      VERSION = "0.7.3";
    }
  });

  // src/build-id.js
  var BUILD_ID;
  var init_build_id = __esm({
    "src/build-id.js"() {
      BUILD_ID = "1780873510137";
    }
  });

  // src/main.js
  var require_main = __commonJS({
    "src/main.js"() {
      init_constants();
      init_build_id();
      var BODY_URL = `/family_hub/family-hub-card-body.js?v=${VERSION}&b=${BUILD_ID}`;
      var _bodyPromise = null;
      function _loadBody() {
        if (_bodyPromise) return _bodyPromise;
        _bodyPromise = import(
          /* @vite-ignore */
          BODY_URL
        ).catch((err) => {
          console.error("[family-hub-card] Failed to load body bundle from", BODY_URL, err);
          _bodyPromise = null;
          throw err;
        });
        return _bodyPromise;
      }
      var LOADING_HTML = `
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
      var FamilyHubCardWrapper = class extends HTMLElement {
        // HA card API (static)
        static getStubConfig() {
          return { mode: "command_center" };
        }
        static getConfigElement() {
          return document.createElement("family-hub-card-editor");
        }
        constructor() {
          super();
          this.attachShadow({ mode: "open" });
          this.shadowRoot.innerHTML = LOADING_HTML;
          _loadBody().then(() => this._upgrade()).catch((err) => {
            this.shadowRoot.innerHTML = `<div style="padding:24px;color:#E8553E;font-family:system-ui">
                   Family Hub card failed to load. See browser console.
                 </div>`;
          });
        }
        _upgrade() {
          if (this._impl) return;
          const impl = document.createElement("family-hub-card-impl");
          if (this._cfg) impl.setConfig(this._cfg);
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
          return this._impl && typeof this._impl.getCardSize === "function" ? this._impl.getCardSize() : 5;
        }
      };
      var FamilyHubCardEditorWrapper = class extends HTMLElement {
        // IMPORTANT: do not touch children/attributes in the constructor — the HTML
        // spec forbids it for custom elements and any attempt (e.g. `this.innerHTML = …`)
        // throws InvalidStateError, leaving the element in a "failed upgrade" state
        // with no prototype methods. That's how HA ended up saying
        // "this._configElement.setConfig is not a function".
        //
        // The body load can still kick off in the constructor (it's just a Promise),
        // and any DOM writes are deferred to connectedCallback / _upgrade / _showError.
        constructor() {
          super();
          this._loadStarted = false;
        }
        connectedCallback() {
          if (this._loadStarted) {
            if (this._impl && !this._impl.isConnected) this.appendChild(this._impl);
            return;
          }
          this._loadStarted = true;
          if (!this._impl) {
            this.innerHTML = `<div style="padding:24px;color:var(--secondary-text-color);font-family:system-ui">Loading editor\u2026</div>`;
          }
          _loadBody().then(() => this._upgrade()).catch(() => this._showError());
        }
        _upgrade() {
          if (this._impl) return;
          const impl = document.createElement("family-hub-card-editor-impl");
          if (this._cfg) impl.setConfig(this._cfg);
          if (this._hass) impl.hass = this._hass;
          impl.addEventListener("config-changed", (e) => {
            var _a;
            this._cfg = (_a = e.detail) == null ? void 0 : _a.config;
          });
          this.innerHTML = "";
          this.appendChild(impl);
          this._impl = impl;
        }
        _showError() {
          this.innerHTML = `<div style="padding:24px;color:#E8553E">Editor failed to load. See browser console.</div>`;
        }
        setConfig(cfg) {
          this._cfg = cfg;
          if (this._impl) this._impl.setConfig(cfg);
        }
        set hass(h) {
          this._hass = h;
          if (this._impl) this._impl.hass = h;
        }
      };
      if (!customElements.get("family-hub-card")) {
        customElements.define("family-hub-card", FamilyHubCardWrapper);
      }
      if (!customElements.get("family-hub-card-editor")) {
        customElements.define("family-hub-card-editor", FamilyHubCardEditorWrapper);
      }
      window.customCards = window.customCards || [];
      if (!window.customCards.some((c) => c.type === "family-hub-card")) {
        window.customCards.push({
          type: "family-hub-card",
          name: "Family Hub",
          description: "Family task management \u2014 command center, personal, maintenance, and admin views.",
          preview: false,
          configurable: true
        });
      }
      console.info(
        `%c FAMILY-HUB-CARD %c v${VERSION} %c stub `,
        "background:#7F77DD;color:#fff;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px",
        "background:#1c1c1e;color:#fff;font-weight:400;padding:2px 6px",
        "background:#5B8DEF;color:#fff;font-weight:600;border-radius:0 4px 4px 0;padding:2px 6px"
      );
    }
  });
  require_main();
})();

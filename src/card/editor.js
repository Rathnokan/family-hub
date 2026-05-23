/**
 * Family Hub Card — Visual Editor
 * Lovelace card picker editor element.
 * Registered as <family-hub-card-editor> and returned by FamilyHubCard.getConfigElement().
 */

import { VERSION } from "./constants.js";
import { escHTML } from "./utils.js";

export class FamilyHubCardEditor extends HTMLElement {

    setConfig(cfg) {
        this._cfg = cfg;
        this._render();
    }

    set hass(hass) {
        this._hass   = hass;
        this._people = hass?.states?.["sensor.family_hub_needs_attention"]
            ?.attributes?.people || [];
        this._render();
    }

    _render() {
        const cfg         = this._cfg    || {};
        const people      = this._people  || [];
        const mode        = cfg.mode      || "command_center";
        const person      = cfg.person    || "";
        const initialView = cfg.initial_view || "";
        const textScale   = cfg.text_scale != null ? cfg.text_scale : 1.0;

        // initial_view dropdown options: home + per-person + per-room.
        const naAttr      = this._hass?.states?.["sensor.family_hub_needs_attention"]?.attributes || {};
        const roomsCfg    = naAttr.rooms_config || {};
        const initialViewOptions = [
            ["", "Home (default)"],
            ...people.map(p => [`person:${p.person_id}`, `${p.name}'s page`]),
            ...Object.keys(roomsCfg).map(rid => [`room:${rid}`, `Room: ${rid}`]),
        ];

        // Connection indicator — green if needs_attention sensor exists, red if not
        const sensorState   = this._hass?.states?.["sensor.family_hub_needs_attention"];
        const connected     = !!sensorState;
        const statusDot     = `<span style="
            display:inline-block;width:8px;height:8px;border-radius:50%;
            background:${connected ? "#30d158" : "#ff453a"};
            margin-right:5px;vertical-align:middle;"></span>`;
        const statusLabel   = connected
            ? `${statusDot}Integration connected (v${VERSION})`
            : `${statusDot}Integration not found — install Family Hub`;

        this.innerHTML = `
      <style>
        .fhe { padding:16px; display:flex; flex-direction:column; gap:14px; }
        .fhe-field { display:flex; flex-direction:column; gap:5px; }
        .fhe-label { font-size:.8rem; font-weight:600; color:var(--secondary-text-color); }
        .fhe-select, .fhe-input {
          padding:9px 11px; border-radius:8px;
          border:1.5px solid var(--divider-color);
          background:var(--card-background-color);
          color:var(--primary-text-color);
          font-size:.9rem; font-family:inherit;
        }
        .fhe-hint { font-size:.78rem; color:var(--secondary-text-color); }
        .fhe-select:focus, .fhe-input:focus { outline:none; border-color:var(--primary-color); }
        .fhe-status { font-size:.8rem; padding:6px 0; }
      </style>
      <div class="fhe">
        <div class="fhe-status">${statusLabel}</div>

        <div class="fhe-field">
          <label class="fhe-label">Mode</label>
          <select class="fhe-select" id="e-mode">
            ${[
                ["command_center", "Command Center (kitchen display)"],
                ["personal",       "Personal Dashboard"],
                ["maintenance",    "Maintenance"],
                ["admin",          "Admin Panel"],
            ].map(([v, l]) => `<option value="${v}" ${v === mode ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </div>

        <div class="fhe-field" id="person-field"
             style="display:${mode === "personal" ? "flex" : "none"}">
          <label class="fhe-label">Person</label>
          ${people.length
              ? `<select class="fhe-select" id="e-person">
                   ${people.map(p =>
                       `<option value="${p.name.toLowerCase()}"
                                ${p.name.toLowerCase() === person ? "selected" : ""}>${escHTML(p.name)}</option>`
                   ).join("")}
                 </select>`
              : `<input class="fhe-input" id="e-person" type="text"
                        value="${person}" placeholder="e.g. jackson">`}
          <span class="fhe-hint">Enter the person's name (lowercase)</span>
        </div>

        <div class="fhe-field" id="initial-view-field"
             style="display:${mode === "command_center" ? "flex" : "none"}">
          <label class="fhe-label">Initial view</label>
          <select class="fhe-select" id="e-initial-view">
            ${initialViewOptions.map(([v, l]) =>
                `<option value="${v}" ${v === initialView ? "selected" : ""}>${escHTML(l)}</option>`
            ).join("")}
          </select>
          <span class="fhe-hint">Open this view directly. Back arrow returns to home.</span>
        </div>

        <div class="fhe-field">
          <label class="fhe-label">Text scale</label>
          <select class="fhe-select" id="e-scale">
            ${[
                [0.9,  "Small (0.9)"],
                [1.0,  "Default (1.0)"],
                [1.25, "Large (1.25)"],
                [1.5,  "XL (1.5)"],
            ].map(([v, l]) => `<option value="${v}" ${parseFloat(textScale) === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
          <span class="fhe-hint">Increase for Echo Show / tablet screens.</span>
        </div>
      </div>`;

        this.querySelector("#e-mode")?.addEventListener("change", e => {
            this._cfg = { ...this._cfg, mode: e.target.value };
            if (e.target.value !== "personal") delete this._cfg.person;
            if (e.target.value !== "command_center") delete this._cfg.initial_view;
            this._fireChange();
            this._render();
        });

        this.querySelector("#e-initial-view")?.addEventListener("change", e => {
            const v = e.target.value;
            this._cfg = { ...this._cfg };
            if (v) this._cfg.initial_view = v;
            else delete this._cfg.initial_view;
            this._fireChange();
        });

        this.querySelector("#e-person")?.addEventListener("change", e => {
            this._cfg = { ...this._cfg, person: e.target.value };
            this._fireChange();
        });

        this.querySelector("#e-scale")?.addEventListener("change", e => {
            this._cfg = { ...this._cfg, text_scale: parseFloat(e.target.value) };
            this._fireChange();
        });
    }

    _fireChange() {
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail:   { config: this._cfg },
            bubbles:  true,
            composed: true,
        }));
    }
}
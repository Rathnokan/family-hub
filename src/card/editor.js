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
        const cfg    = this._cfg   || {};
        const people = this._people || [];
        const mode   = cfg.mode    || "command_center";
        const person = cfg.person  || "";

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
      </style>
      <div class="fhe">
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
      </div>`;

        this.querySelector("#e-mode")?.addEventListener("change", e => {
            this._cfg = { ...this._cfg, mode: e.target.value };
            if (e.target.value !== "personal") delete this._cfg.person;
            this._fireChange();
            this._render();
        });

        this.querySelector("#e-person")?.addEventListener("change", e => {
            this._cfg = { ...this._cfg, person: e.target.value };
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
/**
 * Family Hub Card — Command Center Home Page
 *
 * Thin dispatcher: resolves the active hub skin and delegates rendering.
 * Skin selection: card._cfg.hub_skin → naAttr.hub_skin → "classic".
 *
 * Also exports structural navigation helpers (not skin-specific):
 *   htmlNavBack(label)   — back-button bar prepended to every non-home view
 *   htmlComingSoon(room) — full-screen coming-soon placeholder for future rooms
 */

import { getHubSkin } from "./hub-skins/index.js";
import { escHTML }    from "./utils.js";

// ---- Public entry point -------------------------------------------------------

export function htmlHome(card) {
    const naAttr  = card._attrs("sensor.family_hub_needs_attention");
    const skinKey = card._cfg.hub_skin || naAttr.hub_skin || "classic";
    return getHubSkin(skinKey).render(card);
}

// ---- Back-navigation bar (prepended to all non-home views) -------------------

export function htmlNavBack(label) {
    return `
        <div class="fh-nav-back-bar" data-act="nav-back">
            <span class="fh-nav-back-chevron">&#8592;</span>
            <span class="fh-nav-back-label">${escHTML(label)}</span>
        </div>
    `;
}

// ---- Coming-soon full-screen (rendered when a coming room is drilled into) ---

export function htmlComingSoon(room) {
    return `
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:${room.accent}">${room.icon}</div>
            <div class="fh-home-coming-label" style="color:${room.accent}">${escHTML(room.label)}</div>
            <div class="fh-home-coming-sub">${escHTML(room.sub)}</div>
            ${room.preview ? `<div class="fh-home-coming-desc">${escHTML(room.preview)}</div>` : ""}
            <div class="fh-home-coming-badge">COMING SOON</div>
        </div>
    `;
}

/**
 * Family Hub Card — Classic Hub Skin
 *
 * The default Command Center home page layout: family header, agent tiles row,
 * room tiles grid, and today strip. This is the skin that shipped in v0.6.0
 * Session 2.
 *
 * Exported as `classicSkin` with a single `render(card)` method. Registered in
 * hub-skins/index.js. To create a new skin, copy this file, change the export
 * name, and register it.
 */

import { ROOMS }                        from "../rooms/index.js";
import { getTheme }                     from "../themes/index.js";
import { escHTML, escAttr, fPts, fUSD } from "../utils.js";
import { DEFAULT_COLOR }                from "../constants.js";

export const classicSkin = {
    render(card) {
        const naAttr        = card._attrs("sensor.family_hub_needs_attention");
        const people        = card._people().filter(p => p.active !== false);
        const familyName    = naAttr.family_name || "Family Hub";
        const globalPaused  = !!naAttr.penalties_paused_global;
        const approvalQueue = naAttr.approval_queue || [];
        const weatherEntity = naAttr.weather_entity || "";

        return `
            ${_htmlHeader(familyName, globalPaused)}
            ${_htmlAgents(people, approvalQueue, card)}
            ${_htmlRooms(card, naAttr)}
            ${_htmlTodayStrip(approvalQueue, weatherEntity, card)}
        `;
    },
};

// ---- Header strip ------------------------------------------------------------

function _htmlHeader(familyName, globalPaused) {
    const now  = new Date();
    const day  = now.toLocaleDateString("en-US", { weekday: "long" });
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return `
        <div class="fh-home-header">
            <div class="fh-home-family">${escHTML(familyName)}</div>
            <div class="fh-home-header-right">
                <div class="fh-home-date">${day}, ${date}</div>
                ${globalPaused ? `<div class="fh-home-paused-pill">PAUSED</div>` : ""}
            </div>
        </div>
    `;
}

// ---- Agent tiles row ---------------------------------------------------------

function _htmlAgents(people, approvalQueue, card) {
    if (!people.length) return "";

    const allTasks = card._attrs("sensor.family_hub_claimable_tasks").all_tasks || [];

    const tiles = people.map(person => {
        const color        = person.avatar_color || DEFAULT_COLOR;
        const code         = person.code || "";
        const theme        = getTheme(person.theme_key || "classic");
        const tint         = theme.tint;
        const sigil        = theme.sigil;

        const eid          = card._personEntityId(person.name);
        const personAttr   = card._attrs(eid);
        const balance      = parseInt(card._states(eid)?.state ?? person.lifetime_points ?? 0);
        const dollar       = personAttr.show_dollar_value ? personAttr.dollar_value : null;
        const rankTitle    = theme.rankTitle(person.rank_index !== undefined ? person.rank_index : 0);
        const subLabel     = theme.homeTileSubLabel(person);

        const openCount    = allTasks.filter(t =>
            t.assigned_to === person.person_id && t.status === "pending"
        ).length;
        const pendingCount = approvalQueue.filter(t => t.person_id === person.person_id).length;

        const allowanceHTML = (person.allowance_points && person.allowance_schedule)
            ? `<div class="fh-home-agent-allowance">+${person.allowance_points}/${person.allowance_schedule === "weekly" ? "wk" : person.allowance_schedule === "bi_weekly" ? "2wk" : "mo"}</div>`
            : "";

        return `
            <div class="fh-home-agent-tile"
                 data-act="nav" data-nav-view="person:${escAttr(person.person_id)}"
                 style="--tile-color:${color};--tile-tint:${tint}">
                <div class="fh-home-agent-sigil">${sigil}</div>
                ${pendingCount > 0 ? `<div class="fh-home-agent-pending-dot" title="${pendingCount} pending"></div>` : ""}
                <div class="fh-home-agent-code">AGT &middot; ${code ? escHTML(code) : escHTML(person.name.toUpperCase())}</div>
                <div class="fh-home-agent-name">${escHTML(person.name)}</div>
                <div class="fh-home-agent-sublabel">${escHTML(rankTitle)} &middot; ${escHTML(subLabel)}</div>
                <div class="fh-home-agent-spacer"></div>
                <div class="fh-home-agent-dual">
                    <div class="fh-home-agent-stat">
                        <span class="fh-home-agent-stat-num">${fPts(balance)}</span>
                        <span class="fh-home-agent-stat-lbl">PTS</span>
                        ${dollar != null ? `<span class="fh-home-agent-stat-dollar">${fUSD(dollar)}</span>` : ""}
                    </div>
                    <div class="fh-home-agent-stat-div"></div>
                    <div class="fh-home-agent-stat">
                        <span class="fh-home-agent-stat-num" style="${openCount > 0 ? `color:${color}` : "color:var(--fh-text-sec)"}">${openCount}</span>
                        <span class="fh-home-agent-stat-lbl">OPEN</span>
                    </div>
                </div>
                ${allowanceHTML}
            </div>`;
    }).join("");

    return `
        <div class="fh-home-section">
            <div class="fh-home-section-label">// AGENTS ON DUTY</div>
            <div class="fh-home-agents-row">${tiles}</div>
        </div>`;
}

// ---- Room tiles grid ---------------------------------------------------------

function _htmlRooms(card, naAttr) {
    const roomsCfg = naAttr.rooms_config || {};

    const tiles = ROOMS.map(room => {
        const status = roomsCfg[room.id]?.status || room.status;
        if (status === "hidden") return "";

        const isLive    = status === "live";
        const stats     = isLive ? room.getStats(card) : [];
        const statsHTML = stats.map(s => `
            <div class="fh-home-room-stat">
                <span class="fh-home-room-stat-num" style="color:${s.accent || room.accent}">${s.value}</span>
                <span class="fh-home-room-stat-lbl">${escHTML(s.label)}</span>
            </div>
        `).join("");

        return `
            <div class="fh-home-room-tile ${isLive ? "live" : "coming"}"
                 data-act="nav" data-nav-view="room:${escAttr(room.id)}"
                 style="--room-accent:${room.accent}">
                <div class="fh-home-room-icon" style="color:${room.accent}">${room.icon}</div>
                <div class="fh-home-room-body">
                    <div class="fh-home-room-label">${escHTML(room.label)}</div>
                    <div class="fh-home-room-sub">${escHTML(room.sub)}</div>
                    ${isLive && stats.length ? `<div class="fh-home-room-stats">${statsHTML}</div>` : ""}
                    ${!isLive ? `
                        <div class="fh-home-room-coming">COMING SOON</div>
                        ${room.preview ? `<div class="fh-home-room-preview">${escHTML(room.preview)}</div>` : ""}
                    ` : ""}
                </div>
            </div>
        `;
    }).join("");

    return `
        <div class="fh-home-section">
            <div class="fh-home-section-label">ROOMS</div>
            <div class="fh-home-rooms-grid">${tiles}</div>
        </div>
    `;
}

// ---- Today strip (bottom bar) ------------------------------------------------

function _htmlTodayStrip(approvalQueue, weatherEntity, card) {
    const pendingCount = approvalQueue.length;

    let weatherHTML = "";
    if (weatherEntity) {
        const ws = card._states(weatherEntity);
        if (ws) {
            const cond  = ws.state || "";
            const temp  = ws.attributes?.temperature;
            const unit  = ws.attributes?.temperature_unit || "°";
            weatherHTML = `
                <div class="fh-home-today-weather">
                    <div class="fh-home-today-weather-icon">${_weatherIcon(cond)}</div>
                    <div>
                        <div class="fh-home-today-temp">${temp !== undefined ? `${Math.round(temp)}${unit}` : "—"}</div>
                        <div class="fh-home-today-cond">${escHTML(_weatherLabel(cond))}</div>
                    </div>
                </div>
            `;
        }
    }

    return `
        <div class="fh-home-today-strip">
            ${weatherHTML}
            <div class="fh-home-today-flex">
                ${pendingCount > 0 ? `
                    <div class="fh-home-today-approvals">
                        <span class="fh-home-today-approvals-badge">${pendingCount}</span>
                        <span class="fh-home-today-approvals-lbl">${pendingCount === 1 ? "approval pending" : "approvals pending"}</span>
                    </div>
                ` : `
                    <div class="fh-home-today-quiet">All clear &#8212; no approvals waiting</div>
                `}
            </div>
        </div>
    `;
}

// ---- Weather helpers ---------------------------------------------------------

function _weatherLabel(cond) {
    const MAP = {
        sunny:            "Sunny",
        clear_night:      "Clear",
        partlycloudy:     "Partly Cloudy",
        cloudy:           "Cloudy",
        fog:              "Foggy",
        rainy:            "Rain",
        pouring:          "Heavy Rain",
        snowy:            "Snow",
        snowy_rainy:      "Sleet",
        windy:            "Windy",
        windy_variant:    "Windy",
        lightning:        "Thunderstorm",
        lightning_rainy:  "Thunderstorm",
        hail:             "Hail",
        exceptional:      "Unusual",
    };
    return MAP[cond] || cond.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function _weatherIcon(cond) {
    if (cond === "sunny" || cond === "clear_night") {
        return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/></svg>`;
    }
    if (cond === "rainy" || cond === "pouring") {
        return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19a4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4m0-6a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2m12-3a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3M6 5a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1z"/></svg>`;
    }
    if (cond === "snowy" || cond === "snowy_rainy") {
        return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m22 11-1.5-1.5-2 2L17 10l2-2-1.5-1.5L16 8l-1.5-1.5.5-2-2.5-.5.5 2L11 7.5V5l-1.5-1.5L8 5v2.5L6.5 6.5 6 4l-2.5.5.5 2L2.5 8 1 9.5l1.5 1.5 2-2L6 10.5l-2 2L5.5 14 7 12.5 8.5 14l-.5 2 2.5.5-.5-2 1.5-1.5v2.5l1.5 1.5 1.5-1.5V13l1.5 1.5 1.5-1.5-1.5-1.5 2-2 1.5 1.5 1.5-1.5z"/></svg>`;
    }
    if (cond.includes("cloud") || cond === "fog") {
        return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`;
    }
    if (cond.includes("lightning")) {
        return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`;
}

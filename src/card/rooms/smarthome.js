/**
 * Family Hub Card — Smart Home Room (Coming Soon)
 * Polished coming-soon screen for v0.9.0 Smart Home features.
 */

export function renderSmartHome(_card) {
    return `
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#30d158">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#30d158">SMART HOME</div>
            <div class="fh-home-coming-sub">Lights, climate &amp; more</div>
            <div class="fh-room-feature-list">
                ${_feat("💡", "Lighting Control",  "Toggle and dim lights by room from the kitchen display")}
                ${_feat("🌡️", "Climate",           "View and adjust the thermostat without leaving the kitchen")}
                ${_feat("💧", "Irrigation",        "Run or skip watering zones on demand")}
                ${_feat("🔒", "Kid-safe Access",   "Only controls approved for the kitchen display are shown")}
            </div>
            <div class="fh-home-coming-badge">COMING IN v0.9.0</div>
        </div>`;
}

function _feat(icon, name, desc) {
    return `
        <div class="fh-room-feature">
            <div class="fh-room-feature-icon">${icon}</div>
            <div class="fh-room-feature-body">
                <div class="fh-room-feature-name">${name}</div>
                <div class="fh-room-feature-desc">${desc}</div>
            </div>
        </div>`;
}

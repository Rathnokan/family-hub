/**
 * Family Hub Card — Calendar Room (Coming Soon)
 * Polished coming-soon screen for v0.8.0 Calendar features.
 * When live, this room will also power the home-screen today strip.
 */

export function renderCalendar(_card) {
    return `
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#64d2ff">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#64d2ff">CALENDAR</div>
            <div class="fh-home-coming-sub">Today's schedule</div>
            <div class="fh-room-feature-list">
                ${_feat("📅", "Today at a Glance",    "Morning-to-evening schedule on the home strip")}
                ${_feat("🔔", "Chore Reminders",      "Chore windows tied to events — 'before school', 'after dinner'")}
                ${_feat("👨‍👩‍👧‍👦", "Family View",          "Everyone's events in one scrollable view")}
                ${_feat("🔗", "Any HA Calendar",      "Connects to Local Calendar, CalDAV, or Google via Home Assistant")}
            </div>
            <div class="fh-home-coming-badge">COMING IN v0.8.0 · POWERS THE TODAY STRIP</div>
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

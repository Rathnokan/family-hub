/**
 * Family Hub Card — Meals Room (Coming Soon)
 * Polished coming-soon screen for v0.7.0 Meals features.
 */

export function renderMeals(_card) {
    return `
        <div class="fh-home-coming-screen">
            <div class="fh-home-coming-icon" style="color:#ff9f0a">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:64px;height:64px">
                    <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05M1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1m15.03-7c0-1.46-.74-2.87-2.22-4.28-1.13-1.07-2.84-1.93-4.43-2.43-.25-.08-.5-.12-.76-.12H8.5c-.25 0-.5.04-.76.12-1.59.5-3.3 1.36-4.43 2.43C1.83 13.13 1 14.54 1 16h15.03z"/>
                </svg>
            </div>
            <div class="fh-home-coming-label" style="color:#ff9f0a">MEALS</div>
            <div class="fh-home-coming-sub">Weekly menu &amp; grocery list</div>
            <div class="fh-room-feature-list">
                ${_feat("🍽️", "Tonight's Dinner",  "See what's on the menu right on the home strip")}
                ${_feat("📅", "Weekly Menu",       "Plan meals for the whole week in one place")}
                ${_feat("🛒", "Grocery List",      "Items needed auto-populate from the week's plan")}
                ${_feat("👨‍🍳", "Recipes &amp; Notes", "Tap a meal to see the recipe or prep notes")}
            </div>
            <div class="fh-home-coming-badge">COMING IN v0.7.0</div>
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

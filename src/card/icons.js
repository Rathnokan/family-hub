/**
 * Family Hub Card — Chore Icon Library
 *
 * FH_ICONS: keyed line-art SVG strings for chore-relevant icons.
 * choreIcon(key, color, size): returns an <svg> element string, or a
 *   colored dot <div> when the key is empty / unrecognised.
 *
 * FH_ICON_META: ordered array of { key, label } for the admin icon picker grid.
 *
 * Icon naming convention: lowercase, no spaces (e.g. "dishes", "vacuum").
 * Admin selects icon from the visual picker grid in the chore editor.
 *
 * Design reference: docs/design-reference/chore-icons.jsx
 */

// ---------------------------------------------------------------------------
// Icon library — line-art stroke SVGs (viewBox 0 0 32 32)
// ---------------------------------------------------------------------------

export const FH_ICONS = {
    // --- Bedroom & Self-Care ---
    bed: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 22V10M3 22H29M3 22v3M29 22V14a3 3 0 0 0-3-3H14v6h-3v-2H3"/>
      <circle cx="9" cy="14.5" r="1.5"/>
    </svg>`,

    tooth: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 4c-3 0-5 2-5 6 0 3 2 6 2 11 0 4 1 7 3 7s3-3 3-7c0-2 1-3 3-3s3 1 3 3c0 4 1 7 3 7s3-3 3-7c0-5 2-8 2-11 0-4-2-6-5-6-2 0-3 1-6 1S12 4 10 4Z"/>
    </svg>`,

    shower: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 2v6M22 8H10M8 12h16l-1 4H9z"/>
      <path d="M11 20v1M14 22v1M17 20v1M20 22v1M13 25v1M18 26v1"/>
    </svg>`,

    laundry: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="3" width="22" height="26" rx="2"/>
      <circle cx="16" cy="19" r="6"/>
      <circle cx="16" cy="19" r="3"/>
      <path d="M8 8h3M13 8h1"/>
    </svg>`,

    room: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 28V8l12-5 12 5v20H4z"/>
      <path d="M13 28v-8h6v8"/>
    </svg>`,

    // --- Pets ---
    dog: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 12c0-3 2-5 4-5l2 3 5-1 5 1 2-3c2 0 4 2 4 5v6c0 2-2 4-4 4h-3v3h-3v-3h-6v3H9v-3H6c-1 0-2-1-2-2v-4c0-2 1-4 2-4Z"/>
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/>
      <circle cx="20" cy="15" r="1" fill="currentColor" stroke="none"/>
    </svg>`,

    cat: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 6l4 6h12l4-6v14a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z"/>
      <path d="M12 16l1 2M20 16l-1 2M14 22h4"/>
    </svg>`,

    pet: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="10" cy="10" rx="3" ry="4"/>
      <ellipse cx="22" cy="10" rx="3" ry="4"/>
      <ellipse cx="6"  cy="20" rx="2.5" ry="3.5"/>
      <ellipse cx="26" cy="20" rx="2.5" ry="3.5"/>
      <ellipse cx="16" cy="22" rx="7" ry="6"/>
    </svg>`,

    fish: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M26 16c0 5-4.5 9-10 9S6 21 6 16s4.5-9 10-9c3 0 5.5 1.5 7 4l4-4-1 9 1 9-4-4c-1.5 2.5-4 4-7 4"/>
      <circle cx="10" cy="14" r="1.5" fill="currentColor" stroke="none"/>
    </svg>`,

    // --- Kitchen ---
    dishes: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="16" cy="16" r="11"/>
      <circle cx="16" cy="16" r="6"/>
      <path d="M6 16h2M24 16h2M16 6v2M16 24v2"/>
    </svg>`,

    plate: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 6v8a8 8 0 0 0 16 0V6M12 6v22M20 6v22M8 6h16"/>
    </svg>`,

    snack: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 16a10 10 0 0 1 20 0v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/>
      <path d="M11 12v2M16 11v2M21 12v2"/>
    </svg>`,

    bread: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 14a8 5 0 0 1 24 0v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>
      <path d="M10 14v8M16 14v8M22 14v8"/>
    </svg>`,

    menu: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="4" width="20" height="24" rx="2"/>
      <path d="M10 10h12M10 14h12M10 18h12M10 22h8"/>
    </svg>`,

    cooking: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 20h20l-2 6H8zM10 10c0-3 2-5 6-5s6 2 6 5"/>
      <path d="M8 14h16v6H8z"/>
      <path d="M13 7v3M19 7v3"/>
    </svg>`,

    meals: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 14a10 10 0 0 1 20 0M3 18h26v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>
      <path d="M14 8V4M16 4h-4M12 12c1-1 3-1 4 0"/>
    </svg>`,

    // --- Cleaning ---
    trash: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 8h22M12 8V5h8v3M8 8v18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M13 13v11M19 13v11"/>
    </svg>`,

    broom: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 4 12 14M9 17l6 6M5 25l4 4M8 28l3-3M14 22l3-3"/>
      <path d="m12 14 6 6-3 3-9 1 1-9z"/>
    </svg>`,

    vacuum: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="16" cy="20" r="8"/>
      <circle cx="16" cy="20" r="3"/>
      <path d="M16 12V6h-4M22 12V8h-2"/>
    </svg>`,

    wipe: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="14" width="24" height="10" rx="2"/>
      <path d="M9 18l4 4M14 18l4 4M19 18l4 4M8 14V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6"/>
    </svg>`,

    mop: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 4l12 12M18 10l4 4"/>
      <path d="M6 22l6-6 8 8-6 4-8-6z"/>
    </svg>`,

    sweep: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 4l4 16H8l-2 6h20l-2-6h-4L16 4z"/>
      <path d="M10 20h12"/>
    </svg>`,

    bathroom: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 18h22v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/>
      <path d="M5 18V8a3 3 0 0 1 6 0v10"/>
      <path d="M9 12h2"/>
    </svg>`,

    windows: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="4" width="24" height="24" rx="2"/>
      <path d="M4 16h24M16 4v24"/>
    </svg>`,

    recycling: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 4l4 7h-3l3 6H8l3-6H8zM8 24l2-3h12l2 3M4 28h24"/>
    </svg>`,

    // --- Outdoors ---
    lawn: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 24h24M8 24v-4a8 8 0 0 1 16 0v4"/>
      <path d="M12 16c0-2 2-5 4-7 2 2 4 5 4 7"/>
    </svg>`,

    garden: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 28V14M16 14c-4-2-7-1-7-7 4 0 7 2 7 7Zm0 0c4-2 7-1 7-7-4 0-7 2-7 7Z"/>
      <path d="M10 28h12"/>
    </svg>`,

    plant: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 28V14M16 14c-4-2-7-1-7-7 4 0 7 2 7 7Zm0 0c4-2 7-1 7-7-4 0-7 2-7 7Z"/>
      <path d="M10 28h12"/>
    </svg>`,

    leaves: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 26c2-8 8-14 16-14-2 8-8 14-16 14z"/>
      <path d="M6 26l8-8"/>
    </svg>`,

    snow: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 4v24M4 10l12 6 12-6M4 22l12-6 12 6"/>
      <path d="M10 7l2 3-2 3M22 7l-2 3 2 3M10 25l2-3-2-3M22 25l-2-3 2-3"/>
    </svg>`,

    // --- School & Learning ---
    homework: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="3" width="22" height="26" rx="2"/>
      <path d="M10 10h12M10 15h12M10 20h8"/>
      <path d="M21 22l2 2 4-4"/>
    </svg>`,

    reading: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6c4-2 8-2 12 0 4-2 8-2 12 0v18c-4-2-8-2-12 0-4-2-8-2-12 0zM16 6v18"/>
    </svg>`,

    book: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6c4-2 8-2 12 0 4-2 8-2 12 0v18c-4-2-8-2-12 0-4-2-8-2-12 0zM16 6v18"/>
    </svg>`,

    pencil: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m22 4 6 6L12 26l-7 1 1-7zM18 8l6 6M5 27l3-3"/>
    </svg>`,

    piano: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="8" width="26" height="16" rx="1"/>
      <path d="M3 18h26M10 8v10h-2v6M16 8v10h-2v6M22 8v10h-2v6"/>
    </svg>`,

    backpack: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 12V8a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4"/>
      <rect x="5" y="10" width="22" height="18" rx="3"/>
      <path d="M10 16h12v6H10z"/>
    </svg>`,

    practice: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="16" cy="16" r="12"/>
      <path d="M16 10v6l4 4"/>
    </svg>`,

    // --- Tools & Home ---
    tools: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m6 26 9-9-4-4-3 1-3-3 4-4 3 3-1 3 4 4M20 4l5 5-3 3 4 4-4 4-4-4-3 3-5-5z"/>
    </svg>`,

    smarthome: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 16 16 4l12 12M7 14v12h18V14"/>
      <circle cx="16" cy="20" r="3"/>
      <path d="M16 16v1M16 23v1M12 20h1M19 20h1"/>
    </svg>`,

    // --- Generic ---
    chore: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 8h14l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"/>
      <path d="m9 18 3 3 7-7M20 8v4h4"/>
    </svg>`,

    errand: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="8" width="24" height="18" rx="2"/>
      <path d="M10 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
      <path d="M4 16h24"/>
    </svg>`,

    pack: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 1C8.14 1 5 4.14 5 8v1H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-1V8c0-3.86-3.14-7-7-7h-8z"/>
      <path d="M12 20a4 4 0 1 0 8 0 4 4 0 0 0-8 0z"/>
    </svg>`,

    screen: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="4" width="28" height="18" rx="2"/>
      <path d="M10 28h12M16 22v6"/>
    </svg>`,

    exercise: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="22" cy="6" r="3"/>
      <path d="M4 18l6-8 4 4 4-6 6 8"/>
      <path d="M2 26h28"/>
    </svg>`,

    // --- Parents ---
    car: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 16l3-7h16l3 7"/>
      <rect x="3" y="16" width="26" height="10" rx="2"/>
      <circle cx="9" cy="26" r="3"/>
      <circle cx="23" cy="26" r="3"/>
      <path d="M3 20h26"/>
    </svg>`,

    shop: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4h20l2 8H4z"/>
      <path d="M4 12a4 4 0 0 0 4 4M12 12a4 4 0 0 0 8 0M20 12a4 4 0 0 0 4 4M8 16v10h16V16"/>
      <path d="M13 26v-6h6v6"/>
    </svg>`,

    folding: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 8h10v16H4zM18 8h10v16H18z"/>
      <path d="M14 16h4M14 12l4 4-4 4"/>
    </svg>`,

    lunch: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 12h20v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/>
      <path d="M10 8V6M16 7V5M22 8V6"/>
      <path d="M6 17h20"/>
    </svg>`,
};

// ---------------------------------------------------------------------------
// Ordered metadata for the icon picker grid
// ---------------------------------------------------------------------------

export const FH_ICON_META = [
    // Bedroom & self-care
    { key: "bed",       label: "Make Bed",    category: "Self-care" },
    { key: "tooth",     label: "Brush Teeth", category: "Self-care" },
    { key: "shower",    label: "Shower",      category: "Self-care" },
    { key: "laundry",   label: "Laundry",     category: "Self-care" },
    { key: "folding",   label: "Fold Clothes",category: "Self-care" },
    { key: "room",      label: "Clean Room",  category: "Self-care" },
    { key: "pack",      label: "Pack Bag",    category: "Self-care" },
    { key: "backpack",  label: "Backpack",    category: "Self-care" },
    // Pets
    { key: "dog",       label: "Walk Dog",    category: "Pets" },
    { key: "cat",       label: "Feed Cat",    category: "Pets" },
    { key: "pet",       label: "Pet Care",    category: "Pets" },
    { key: "fish",      label: "Feed Fish",   category: "Pets" },
    // Kitchen
    { key: "dishes",    label: "Dishes",      category: "Kitchen" },
    { key: "plate",     label: "Set Table",   category: "Kitchen" },
    { key: "cooking",   label: "Cooking",     category: "Kitchen" },
    { key: "meals",     label: "Meals",       category: "Kitchen" },
    { key: "lunch",     label: "Pack Lunch",  category: "Kitchen" },
    { key: "snack",     label: "Snack",       category: "Kitchen" },
    { key: "bread",     label: "Baking",      category: "Kitchen" },
    { key: "menu",      label: "Menu Plan",   category: "Kitchen" },
    // Cleaning
    { key: "trash",     label: "Trash",       category: "Cleaning" },
    { key: "broom",     label: "Sweep",       category: "Cleaning" },
    { key: "vacuum",    label: "Vacuum",      category: "Cleaning" },
    { key: "wipe",      label: "Wipe Down",   category: "Cleaning" },
    { key: "mop",       label: "Mop",         category: "Cleaning" },
    { key: "sweep",     label: "Sweep Up",    category: "Cleaning" },
    { key: "bathroom",  label: "Bathroom",    category: "Cleaning" },
    { key: "windows",   label: "Windows",     category: "Cleaning" },
    { key: "recycling", label: "Recycling",   category: "Cleaning" },
    // Outdoors
    { key: "lawn",      label: "Lawn",        category: "Outdoors" },
    { key: "garden",    label: "Garden",      category: "Outdoors" },
    { key: "plant",     label: "Plants",      category: "Outdoors" },
    { key: "leaves",    label: "Leaves",      category: "Outdoors" },
    { key: "snow",      label: "Snow",        category: "Outdoors" },
    // School
    { key: "homework",  label: "Homework",    category: "School" },
    { key: "reading",   label: "Reading",     category: "School" },
    { key: "book",      label: "Book",        category: "School" },
    { key: "pencil",    label: "Study",       category: "School" },
    { key: "piano",     label: "Piano",       category: "School" },
    { key: "practice",  label: "Practice",    category: "School" },
    // Home & tools
    { key: "tools",     label: "Tools",       category: "Home" },
    { key: "smarthome", label: "Smart Home",  category: "Home" },
    { key: "screen",    label: "Devices",     category: "Home" },
    { key: "exercise",  label: "Exercise",    category: "Home" },
    // Generic
    { key: "chore",     label: "Chore",       category: "Generic" },
    { key: "errand",    label: "Errand",      category: "Generic" },
    { key: "car",       label: "Car",         category: "Generic" },
    { key: "shop",      label: "Shopping",    category: "Generic" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DOT_COLORS = [
    "#7F77DD", "#30d158", "#ff9f0a", "#ff453a", "#5ac8fa", "#ff2d55", "#af52de",
];

/**
 * Return an HTML string for a chore icon.
 * @param {string} key           - Key into FH_ICONS (empty = show fallback dot)
 * @param {string} fallbackColor - CSS color string for the dot fallback
 * @param {string} [size]        - CSS size (default "28px")
 * @returns {string} HTML string
 */
export function choreIcon(key, fallbackColor, size = "28px") {
    if (key && FH_ICONS[key]) {
        return `<span class="fh-chore-icon" style="width:${size};height:${size};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:currentColor">
          ${FH_ICONS[key]}
        </span>`;
    }
    const color = fallbackColor || DOT_COLORS[0];
    return `<span class="fh-chore-dot" style="width:12px;height:12px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>`;
}

/** List of all valid icon key names. */
export const FH_ICON_KEYS = Object.keys(FH_ICONS);

/**
 * Family Hub Card — Chore Icon Library
 *
 * Icons based on Tabler Icons (MIT License):
 *   https://tabler.io/icons  ·  © 2023 Paweł Kuna, MIT License
 *   Stroke SVGs, viewBox 0 0 24 24, stroke-width 2, round caps/joins.
 *
 * FH_ICONS: keyed SVG strings for chore-relevant icons.
 * choreIcon(key, color, size): returns an <svg> element string, or a
 *   colored dot <span> when the key is empty / unrecognised.
 *
 * FH_ICON_META: ordered array of { key, label, category } for the icon picker.
 *
 * Icon naming convention: lowercase, no spaces (e.g. "dishes", "vacuum").
 * Parent selects icon from the visual picker in the chore editor "Icon" tab.
 */

// ---------------------------------------------------------------------------
// SVG wrapper — keeps icon definitions concise
// ---------------------------------------------------------------------------

const _s = p =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ` +
    `stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

// ---------------------------------------------------------------------------
// Icon library — Tabler-style stroke SVGs (viewBox 0 0 24 24)
// ---------------------------------------------------------------------------

export const FH_ICONS = {

    // ── Self-Care ─────────────────────────────────────────────────────────
    bed: _s(
        `<rect x="2" y="8" width="20" height="12" rx="1"/>` +
        `<path d="M2 14h20"/>` +
        `<path d="M7 14V9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5"/>` +
        `<circle cx="6" cy="11" r="1" fill="currentColor" stroke="none"/>`
    ),

    tooth: _s(
        `<path d="M9 3h6a4 4 0 0 1 4 4c0 5-1.5 9-3 12-.5 1-1.5 1-2 0l-.5-2` +
        `c-.3-.9-1.7-.9-2 0l-.5 2c-.5 1-1.5 1-2 0C7.5 16 6 12 6 7a4 4 0 0 1 3-4z"/>`
    ),

    shower: _s(
        `<path d="M5 5l4 4"/>` +
        `<path d="M19 4a9 9 0 0 0-9 9"/>` +
        `<path d="M14 4a9 9 0 0 0-5 5"/>` +
        `<path d="M4 22l5-5"/>` +
        `<circle cx="11" cy="15" r=".6" fill="currentColor" stroke="none"/>` +
        `<circle cx="14" cy="17" r=".6" fill="currentColor" stroke="none"/>` +
        `<circle cx="8.5" cy="17" r=".6" fill="currentColor" stroke="none"/>` +
        `<circle cx="11" cy="19" r=".6" fill="currentColor" stroke="none"/>`
    ),

    hair: _s(
        `<path d="M4 4h16v3H4z"/>` +
        `<path d="M6 7v9M9 7v12M12 7v12M15 7v9M18 7v9"/>`
    ),

    sleep: _s(
        `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>`
    ),

    laundry: _s(
        `<rect x="3" y="2" width="18" height="20" rx="2"/>` +
        `<circle cx="12" cy="13" r="5"/>` +
        `<circle cx="12" cy="13" r="2.5"/>` +
        `<path d="M7 6h.5M10 6h.5"/>`
    ),

    folding: _s(
        `<path d="M3 6l3-4h4l2 3 2-3h4l3 4-4 2v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8z"/>`
    ),

    room: _s(
        `<path d="M3 21V9.5L12 3l9 6.5V21H3z"/>` +
        `<path d="M9 21v-7h6v7"/>`
    ),

    pack: _s(
        `<path d="M5 7h14l-1.5 12a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-2z"/>` +
        `<path d="M8 7V6a4 4 0 0 1 8 0v1"/>` +
        `<path d="M9 13h6"/>`
    ),

    backpack: _s(
        `<path d="M9 4a3 3 0 0 1 6 0v1a7 7 0 0 1-6 0z"/>` +
        `<rect x="4" y="7" width="16" height="14" rx="2"/>` +
        `<path d="M8 14h8M8 17h5"/>`
    ),

    // ── Pets ──────────────────────────────────────────────────────────────
    dog: _s(
        `<path d="M3 11a9 9 0 0 0 18 0V8l-3-1-1-5-5 3-5-3-1 5-3 1z"/>` +
        `<path d="M7 19v3M17 19v3"/>` +
        `<circle cx="10" cy="11" r=".8" fill="currentColor" stroke="none"/>` +
        `<circle cx="14" cy="11" r=".8" fill="currentColor" stroke="none"/>` +
        `<path d="M10 14c1.5 1.5 2.5 1.5 4 0"/>`
    ),

    cat: _s(
        `<path d="M5 7l-1-5 4 4h4l4-4-1 5a7 7 0 0 1-10 0z"/>` +
        `<circle cx="10" cy="12" r=".5" fill="currentColor" stroke="none"/>` +
        `<circle cx="14" cy="12" r=".5" fill="currentColor" stroke="none"/>` +
        `<path d="M10 14l1 2h2l1-2M12 17v1.5"/>`
    ),

    pet: _s(
        `<ellipse cx="7.5" cy="7.5" rx="2.5" ry="3"/>` +
        `<ellipse cx="16.5" cy="7.5" rx="2.5" ry="3"/>` +
        `<ellipse cx="4" cy="14" rx="2" ry="2.5"/>` +
        `<ellipse cx="20" cy="14" rx="2" ry="2.5"/>` +
        `<ellipse cx="12" cy="16.5" rx="5.5" ry="4.5"/>`
    ),

    fish: _s(
        `<path d="M20 12a8 8 0 0 1-8 6 8 8 0 0 1-8-6 8 8 0 0 1 8-6 8 8 0 0 1 8 6z"/>` +
        `<path d="M20 12l4-5v10z"/>` +
        `<circle cx="9" cy="11" r="1" fill="currentColor" stroke="none"/>`
    ),

    // ── Kitchen ───────────────────────────────────────────────────────────
    dishes: _s(
        `<circle cx="12" cy="12" r="9"/>` +
        `<circle cx="12" cy="12" r="5"/>` +
        `<path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>`
    ),

    plate: _s(
        `<path d="M5 3v8a4 4 0 0 0 8 0V3M9 3v17"/>` +
        `<path d="M19 3v17M17 7a2 2 0 0 1 4 0v4h-4z"/>`
    ),

    cooking: _s(
        `<path d="M4 15h16l-1.5 5a2 2 0 0 1-1.9 1.5H7.4A2 2 0 0 1 5.5 20z"/>` +
        `<path d="M8 7V5M12 6V4M16 7V5"/>` +
        `<path d="M5 12h14a6 6 0 0 0-6-6h-2a6 6 0 0 0-6 6z"/>`
    ),

    meals: _s(
        `<path d="M4 15a8 8 0 0 0 16 0H4z"/>` +
        `<path d="M8 10c0-1 1-2 1-3M12 10c0-1 1-2 1-3M16 10c0-1 1-2 1-3"/>`
    ),

    lunch: _s(
        `<rect x="3" y="10" width="18" height="11" rx="2"/>` +
        `<path d="M8 10V8a4 4 0 0 1 8 0v2"/>` +
        `<path d="M8 15h8M8 18h5"/>`
    ),

    coffee: _s(
        `<path d="M6 10h12v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"/>` +
        `<path d="M18 12h2a2 2 0 0 1 0 4h-2"/>` +
        `<path d="M9 6c0-1.5 1-2 1-3M13 6c0-1.5 1-2 1-3"/>`
    ),

    snack: _s(
        `<path d="M14 3c1 0 2 1 2 2 0 2-2 3-3 4-1-1-3-2-3-4a2 2 0 0 1 2-2h2z"/>` +
        `<path d="M12 9a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/>`
    ),

    bread: _s(
        `<path d="M3 11a5 5 0 0 1 10 0v9H3z"/>` +
        `<path d="M13 11a5 5 0 0 1 5-5h1a2 2 0 0 1 2 2v11H13z"/>` +
        `<path d="M3 14h10"/>`
    ),

    menu: _s(
        `<rect x="5" y="3" width="14" height="18" rx="2"/>` +
        `<path d="M9 7h6M9 11h6M9 15h4"/>`
    ),

    table: _s(
        `<circle cx="12" cy="13" r="5"/>` +
        `<path d="M5 3v8M5 11a3 3 0 0 0 6 0"/>` +
        `<path d="M19 3v17M17 7a2 2 0 0 1 4 0v4h-4z"/>`
    ),

    // ── Cleaning ──────────────────────────────────────────────────────────
    trash: _s(
        `<path d="M4 7h16"/>` +
        `<path d="M10 11v6M14 11v6"/>` +
        `<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"/>` +
        `<path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>`
    ),

    broom: _s(
        `<path d="M19 3 9 13"/>` +
        `<path d="M7 15.5l5 5M5 21l2-2M10 20.5l3-3"/>` +
        `<path d="m9 13 5 5-3 3-7 1 1-7z"/>`
    ),

    vacuum: _s(
        `<circle cx="14" cy="15" r="5"/>` +
        `<circle cx="14" cy="15" r="2"/>` +
        `<path d="M9 15H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h5l3-2h6l-3 6"/>`
    ),

    wipe: _s(
        `<rect x="3" y="10" width="18" height="10" rx="2"/>` +
        `<path d="M7 14l3 3M11 14l3 3M15 14l3 3"/>` +
        `<path d="M7 10V5a3 3 0 0 1 6 0v5"/>`
    ),

    mop: _s(
        `<path d="M4 3l12 12"/>` +
        `<path d="M14 4l6 6"/>` +
        `<path d="M4 15l6-6 8 8-6 4-8-6z"/>`
    ),

    sweep: _s(
        `<path d="M16 3 4 15"/>` +
        `<path d="M2 22l4-4.5"/>` +
        `<path d="M4 15h12a4 4 0 0 1 0 8H4z"/>`
    ),

    bathroom: _s(
        `<path d="M3 14h18v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>` +
        `<path d="M3 14V9a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1"/>` +
        `<path d="M5 10h4"/>`
    ),

    windows: _s(
        `<rect x="3" y="3" width="18" height="18" rx="2"/>` +
        `<path d="M3 12h18M12 3v18"/>`
    ),

    recycling: _s(
        `<path d="M7 11l-4 4 4 4M3 15h10a4 4 0 0 0 3.46-6"/>` +
        `<path d="M17 13l4-4-4-4M21 9H11a4 4 0 0 0-3.46 6"/>`
    ),

    bucket: _s(
        `<path d="M7 6h10l1.5 13a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2z"/>` +
        `<path d="M5.5 6a6.5 6.5 0 0 1 13 0"/>` +
        `<path d="M9 12c0 2 1 3 3 3s3-1 3-3"/>`
    ),

    dusting: _s(
        `<path d="M3 21l10-10"/>` +
        `<path d="M12 8l2-5 4 4-5 2z"/>` +
        `<path d="M14 12l3 3"/>` +
        `<path d="M17 7c1.5 1.5 1.5 3.5 0 5"/>` +
        `<path d="M15 5c2.5 1.5 3.5 4.5 1 7"/>`
    ),

    // ── Outdoors ──────────────────────────────────────────────────────────
    lawn: _s(
        `<path d="M3 21h18"/>` +
        `<path d="M6 21V14a6 6 0 0 1 12 0v7"/>` +
        `<path d="M12 8v6"/>` +
        `<path d="M10 11c-.5-1.5 0-3.5 2-3.5s2.5 2 2 3.5"/>`
    ),

    garden: _s(
        `<path d="M3 14a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>` +
        `<path d="M17 15h3l1-6"/>` +
        `<path d="M5 14V9a4 4 0 0 1 8 0v5"/>` +
        `<path d="M7 20l1 3M10 20l1 3M13 20l1 3"/>`
    ),

    plant: _s(
        `<path d="M12 20V12"/>` +
        `<path d="M12 12c-3-2-6-1-7-6 5-1 8 2 7 6z"/>` +
        `<path d="M12 12c3-2 6-1 7-6-5-1-8 2-7 6z"/>` +
        `<path d="M8 20h8"/>`
    ),

    leaves: _s(
        `<path d="M5 21c3-8 9-14 16-14-2 8-8 14-16 14z"/>` +
        `<path d="M5 21l8-8"/>`
    ),

    snow: _s(
        `<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>` +
        `<path d="M9 6l3-3 3 3M9 18l3 3 3-3"/>` +
        `<path d="M4.5 10.5l-3 2 3 2M19.5 10.5l3 2-3 2"/>`
    ),

    garage: _s(
        `<rect x="2" y="10" width="20" height="11" rx="1"/>` +
        `<path d="M2 10L12 3l10 7"/>` +
        `<path d="M6 15h12M6 18h8"/>`
    ),

    // ── School ────────────────────────────────────────────────────────────
    homework: _s(
        `<rect x="4" y="2" width="16" height="20" rx="2"/>` +
        `<path d="M8 7h8M8 11h8M8 15h5"/>` +
        `<path d="M16 17l2 2 4-4"/>`
    ),

    reading: _s(
        `<path d="M3 6c3-1.5 6-1.5 9 0 3-1.5 6-1.5 9 0v13c-3-1.5-6-1.5-9 0-3-1.5-6-1.5-9 0z"/>` +
        `<path d="M12 6v13"/>`
    ),

    book: _s(
        `<path d="M4 19V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z"/>` +
        `<path d="M4 17h14"/>` +
        `<path d="M8 7v5l2-2 2 2V7"/>`
    ),

    pencil: _s(
        `<path d="M4 20l12-12 4 4-12 12z"/>` +
        `<path d="M14 6l4 4"/>` +
        `<path d="M4 20l-2 2"/>`
    ),

    piano: _s(
        `<rect x="2" y="6" width="20" height="13" rx="1"/>` +
        `<path d="M7 6v7M10 6v7M15 6v7M18 6v7"/>` +
        `<path d="M2 13h20"/>`
    ),

    practice: _s(
        `<circle cx="12" cy="12" r="9"/>` +
        `<path d="M12 7v5l3 3"/>`
    ),

    calculator: _s(
        `<rect x="4" y="2" width="16" height="20" rx="2"/>` +
        `<path d="M8 6h8"/>` +
        `<rect x="7" y="10" width="3" height="2" rx=".5"/>` +
        `<rect x="10.5" y="10" width="3" height="2" rx=".5"/>` +
        `<rect x="14" y="10" width="3" height="2" rx=".5"/>` +
        `<rect x="7" y="13.5" width="3" height="2" rx=".5"/>` +
        `<rect x="10.5" y="13.5" width="3" height="2" rx=".5"/>` +
        `<rect x="14" y="13" width="3" height="5" rx=".5"/>` +
        `<rect x="7" y="17" width="3" height="2" rx=".5"/>` +
        `<rect x="10.5" y="17" width="3" height="2" rx=".5"/>`
    ),

    // ── Health ────────────────────────────────────────────────────────────
    medicine: _s(
        `<path d="M8.5 14.5l-5-5a5 5 0 0 1 7-7l5 5"/>` +
        `<path d="M14.5 9.5l-5 5"/>` +
        `<path d="M14.5 14.5l5-5a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7 0l-1-1"/>`
    ),

    water: _s(
        `<path d="M12 2l7 11a7 7 0 1 1-14 0z"/>`
    ),

    exercise: _s(
        `<path d="M6 12h12"/>` +
        `<path d="M6 10v4M18 10v4"/>` +
        `<path d="M4 9v6M20 9v6"/>`
    ),

    sport: _s(
        `<circle cx="12" cy="12" r="9"/>` +
        `<path d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9"/>` +
        `<path d="M12 3a15 15 0 0 0-4 9 15 15 0 0 0 4 9"/>` +
        `<path d="M3 9h18M3 15h18"/>`
    ),

    walk: _s(
        `<circle cx="12" cy="4" r="2"/>` +
        `<path d="M8 20l2-6h4l-1 6"/>` +
        `<path d="M16 20l-1-6"/>` +
        `<path d="M9 10h6l-1 4H9l-1-4z"/>` +
        `<path d="M8 7l-2 3M16 7l2 3"/>`
    ),

    // ── Hobbies ───────────────────────────────────────────────────────────
    art: _s(
        `<path d="M12 21a9 9 0 1 0-.5 0"/>` +
        `<circle cx="8.5" cy="9" r="1.5"/>` +
        `<circle cx="14.5" cy="8" r="1.5"/>` +
        `<circle cx="16.5" cy="13.5" r="1.5"/>` +
        `<circle cx="10" cy="15.5" r="1.5"/>`
    ),

    music: _s(
        `<path d="M9 20V9l12-2v11"/>` +
        `<circle cx="6" cy="20" r="3"/>` +
        `<circle cx="18" cy="18" r="3"/>`
    ),

    bike: _s(
        `<circle cx="6" cy="15" r="4"/>` +
        `<circle cx="18" cy="15" r="4"/>` +
        `<path d="M6 15l4-8 2 3h6"/>` +
        `<path d="M14 10l4 5"/>`
    ),

    games: _s(
        `<rect x="2" y="7" width="20" height="13" rx="2"/>` +
        `<path d="M6 13v-2M5 12h2"/>` +
        `<circle cx="15.5" cy="11.5" r=".5" fill="currentColor" stroke="none"/>` +
        `<circle cx="17.5" cy="13.5" r=".5" fill="currentColor" stroke="none"/>` +
        `<path d="M11 16h2"/>`
    ),

    // ── Home ──────────────────────────────────────────────────────────────
    tools: _s(
        `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77` +
        `a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91` +
        `a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>`
    ),

    smarthome: _s(
        `<path d="M3 21V9.5L12 3l9 6.5V21H3z"/>` +
        `<circle cx="12" cy="15" r="2"/>` +
        `<path d="M9.17 12.17a5 5 0 0 1 5.66 0"/>` +
        `<path d="M6.34 9.34a9 9 0 0 1 11.32 0"/>`
    ),

    screen: _s(
        `<rect x="2" y="3" width="20" height="14" rx="2"/>` +
        `<path d="M8 21h8M12 17v4"/>`
    ),

    car: _s(
        `<path d="M5 17H3a2 2 0 0 1-2-2v-4l3-6h16l3 6v4a2 2 0 0 1-2 2h-2"/>` +
        `<circle cx="7" cy="17" r="2"/>` +
        `<circle cx="17" cy="17" r="2"/>` +
        `<path d="M5 9h14"/>`
    ),

    shop: _s(
        `<path d="M6 2l3 6h10l-1.5 7H7.5L6 2z"/>` +
        `<circle cx="10" cy="19" r="2"/>` +
        `<circle cx="17" cy="19" r="2"/>` +
        `<path d="M4 2H2"/>`
    ),

    phone: _s(
        `<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>`
    ),

    mail: _s(
        `<rect x="2" y="4" width="20" height="16" rx="2"/>` +
        `<path d="M2 7l10 7 10-7"/>`
    ),

    errand: _s(
        `<rect x="2" y="7" width="20" height="14" rx="2"/>` +
        `<path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>` +
        `<path d="M8 11h8M8 15h5"/>`
    ),

    // ── Generic ───────────────────────────────────────────────────────────
    chore: _s(
        `<path d="M4 6h10l3 3v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"/>` +
        `<path d="M8 11l2 2 4-4"/>` +
        `<path d="M14 6V3h6v6h-6z"/>`
    ),

    star: _s(
        `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`
    ),

    check: _s(
        `<circle cx="12" cy="12" r="9"/>` +
        `<path d="M8 12l3 3 5-5"/>`
    ),

    timer: _s(
        `<circle cx="12" cy="13" r="8"/>` +
        `<path d="M12 5V3M9 3h6"/>` +
        `<path d="M16.95 8.05l1.41-1.41"/>` +
        `<path d="M12 9v4h4"/>`
    ),

    // ── Rewards-specific ─────────────────────────────────────────────────
    gift: _s(
        `<rect x="3" y="8" width="18" height="13" rx="1"/>` +
        `<path d="M3 12h18"/>` +
        `<path d="M12 8v13"/>` +
        `<path d="M7.5 8a2.5 2.5 0 1 1 0-5C9 3 11 5 12 8c1-3 3-5 4.5-5a2.5 2.5 0 1 1 0 5"/>`
    ),
    cash: _s(
        `<rect x="2" y="6" width="20" height="12" rx="2"/>` +
        `<circle cx="12" cy="12" r="3"/>` +
        `<path d="M6 9.5h.01M18 14.5h.01"/>`
    ),
    candy: _s(
        `<circle cx="12" cy="12" r="5"/>` +
        `<path d="M7 12L3 8v8z"/>` +
        `<path d="M17 12l4-4v8z"/>`
    ),
    icecream: _s(
        `<path d="M8 11a4 4 0 0 1 8 0"/>` +
        `<path d="M7 11h10l-5 11z"/>` +
        `<path d="M9.5 11l.5-2M14.5 11l-.5-2"/>`
    ),
    cake: _s(
        `<rect x="3" y="13" width="18" height="8" rx="1"/>` +
        `<path d="M3 17h18"/>` +
        `<path d="M7 13v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/>` +
        `<path d="M13 13v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/>` +
        `<path d="M9 5v2M15 5v2"/>`
    ),
    party: _s(
        `<path d="M3 21l5-14 8 8z"/>` +
        `<circle cx="17" cy="6" r="1"/>` +
        `<circle cx="20" cy="10" r="1"/>` +
        `<circle cx="14" cy="3" r="1"/>` +
        `<path d="M19 14l2 2M15 14l3 2"/>`
    ),
    controller: _s(
        `<path d="M6 18a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4h-1l-2-3H9l-2 3z"/>` +
        `<path d="M7 11v3M5.5 12.5h3"/>` +
        `<circle cx="16" cy="11.5" r=".7" fill="currentColor"/>` +
        `<circle cx="18" cy="13.5" r=".7" fill="currentColor"/>`
    ),
    trophy: _s(
        `<path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/>` +
        `<path d="M7 6H4v2a3 3 0 0 0 3 3"/>` +
        `<path d="M17 6h3v2a3 3 0 0 1-3 3"/>` +
        `<path d="M9 15h6v3H9z"/>` +
        `<path d="M8 21h8"/>`
    ),
    movie: _s(
        `<rect x="2" y="6" width="20" height="12" rx="1"/>` +
        `<path d="M2 10h20M2 14h20"/>` +
        `<path d="M5 6v12M19 6v12"/>`
    ),
    toy: _s(
        `<rect x="4" y="8" width="16" height="12" rx="2"/>` +
        `<circle cx="9" cy="13" r="1.2"/>` +
        `<circle cx="15" cy="13" r="1.2"/>` +
        `<path d="M9 17h6"/>` +
        `<path d="M9 8V5h6v3"/>`
    ),
    sticker: _s(
        `<path d="M12 3a9 9 0 1 1-9 9 9 9 0 0 1 9-9z"/>` +
        `<path d="M9 10h.01M15 10h.01"/>` +
        `<path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5"/>`
    ),
};

// ---------------------------------------------------------------------------
// Ordered metadata for the icon picker grid
// ---------------------------------------------------------------------------

export const FH_ICON_META = [
    // Self-Care
    { key: "bed",        label: "Make Bed",     category: "Self-Care" },
    { key: "tooth",      label: "Brush Teeth",  category: "Self-Care" },
    { key: "shower",     label: "Shower",       category: "Self-Care" },
    { key: "hair",       label: "Groom Hair",   category: "Self-Care" },
    { key: "sleep",      label: "Bedtime",      category: "Self-Care" },
    { key: "laundry",    label: "Laundry",      category: "Self-Care" },
    { key: "folding",    label: "Fold Clothes", category: "Self-Care" },
    { key: "room",       label: "Clean Room",   category: "Self-Care" },
    { key: "pack",       label: "Pack Bag",     category: "Self-Care" },
    { key: "backpack",   label: "Backpack",     category: "Self-Care" },
    // Pets
    { key: "dog",        label: "Walk Dog",     category: "Pets" },
    { key: "cat",        label: "Feed Cat",     category: "Pets" },
    { key: "pet",        label: "Pet Care",     category: "Pets" },
    { key: "fish",       label: "Feed Fish",    category: "Pets" },
    // Kitchen
    { key: "dishes",     label: "Dishes",       category: "Kitchen" },
    { key: "plate",      label: "Set Table",    category: "Kitchen" },
    { key: "table",      label: "Place Setting",category: "Kitchen" },
    { key: "cooking",    label: "Cooking",      category: "Kitchen" },
    { key: "meals",      label: "Meal Prep",    category: "Kitchen" },
    { key: "lunch",      label: "Pack Lunch",   category: "Kitchen" },
    { key: "coffee",     label: "Make Coffee",  category: "Kitchen" },
    { key: "snack",      label: "Snack",        category: "Kitchen" },
    { key: "bread",      label: "Baking",       category: "Kitchen" },
    { key: "menu",       label: "Menu Plan",    category: "Kitchen" },
    // Cleaning
    { key: "trash",      label: "Trash",        category: "Cleaning" },
    { key: "broom",      label: "Sweep",        category: "Cleaning" },
    { key: "sweep",      label: "Sweep Floor",  category: "Cleaning" },
    { key: "vacuum",     label: "Vacuum",       category: "Cleaning" },
    { key: "mop",        label: "Mop",          category: "Cleaning" },
    { key: "wipe",       label: "Wipe Down",    category: "Cleaning" },
    { key: "dusting",    label: "Dusting",      category: "Cleaning" },
    { key: "bucket",     label: "Deep Clean",   category: "Cleaning" },
    { key: "bathroom",   label: "Bathroom",     category: "Cleaning" },
    { key: "windows",    label: "Windows",      category: "Cleaning" },
    { key: "recycling",  label: "Recycling",    category: "Cleaning" },
    // Outdoors
    { key: "lawn",       label: "Lawn",         category: "Outdoors" },
    { key: "garden",     label: "Garden",       category: "Outdoors" },
    { key: "plant",      label: "Plants",       category: "Outdoors" },
    { key: "leaves",     label: "Rake Leaves",  category: "Outdoors" },
    { key: "snow",       label: "Shovel Snow",  category: "Outdoors" },
    { key: "garage",     label: "Garage",       category: "Outdoors" },
    // School
    { key: "homework",   label: "Homework",     category: "School" },
    { key: "reading",    label: "Reading",      category: "School" },
    { key: "book",       label: "Books",        category: "School" },
    { key: "pencil",     label: "Study",        category: "School" },
    { key: "calculator", label: "Math",         category: "School" },
    { key: "piano",      label: "Piano",        category: "School" },
    { key: "practice",   label: "Practice",     category: "School" },
    // Health
    { key: "medicine",   label: "Medicine",     category: "Health" },
    { key: "water",      label: "Drink Water",  category: "Health" },
    { key: "exercise",   label: "Exercise",     category: "Health" },
    { key: "sport",      label: "Sport",        category: "Health" },
    { key: "walk",       label: "Walk",         category: "Health" },
    // Hobbies
    { key: "art",        label: "Art",          category: "Hobbies" },
    { key: "music",      label: "Music",        category: "Hobbies" },
    { key: "bike",       label: "Bike",         category: "Hobbies" },
    { key: "games",      label: "Games",        category: "Hobbies" },
    // Home
    { key: "tools",      label: "Tools",        category: "Home" },
    { key: "smarthome",  label: "Smart Home",   category: "Home" },
    { key: "screen",     label: "Devices",      category: "Home" },
    { key: "car",        label: "Car",          category: "Home" },
    { key: "shop",       label: "Shopping",     category: "Home" },
    { key: "phone",      label: "Phone",        category: "Home" },
    { key: "mail",       label: "Mail",         category: "Home" },
    { key: "errand",     label: "Errand",       category: "Home" },
    // Generic
    { key: "chore",      label: "Chore",        category: "Generic" },
    { key: "star",       label: "Star Task",    category: "Generic" },
    { key: "check",      label: "Done",         category: "Generic" },
    { key: "timer",      label: "Timed Task",   category: "Generic" },
];

// ---------------------------------------------------------------------------
// Reward-specific icon metadata — smaller, curated list for the reward modal
// ---------------------------------------------------------------------------
export const FH_REWARD_ICON_META = [
    // Treats
    { key: "candy",      label: "Candy",        category: "Treats" },
    { key: "icecream",   label: "Ice Cream",    category: "Treats" },
    { key: "snack",      label: "Snack",        category: "Treats" },
    { key: "cake",       label: "Cake",         category: "Treats" },
    { key: "bread",      label: "Baked Good",   category: "Treats" },
    // Money & Gifts
    { key: "cash",       label: "Cash",         category: "Money & Gifts" },
    { key: "gift",       label: "Gift",         category: "Money & Gifts" },
    { key: "shop",       label: "Shopping",     category: "Money & Gifts" },
    { key: "sticker",    label: "Sticker",      category: "Money & Gifts" },
    // Screen Time
    { key: "screen",     label: "Screen Time",  category: "Screen Time" },
    { key: "games",      label: "Video Games",  category: "Screen Time" },
    { key: "controller", label: "Gamepad",      category: "Screen Time" },
    { key: "movie",      label: "Movie",        category: "Screen Time" },
    { key: "phone",      label: "Phone Time",   category: "Screen Time" },
    // Outings & Activities
    { key: "bike",       label: "Bike Ride",    category: "Outings" },
    { key: "car",        label: "Car Trip",     category: "Outings" },
    { key: "walk",       label: "Walk Out",     category: "Outings" },
    { key: "sport",      label: "Sports",       category: "Outings" },
    { key: "pet",        label: "Pet Time",     category: "Outings" },
    // Fun & Special
    { key: "toy",        label: "Toy",          category: "Fun & Special" },
    { key: "party",      label: "Party",        category: "Fun & Special" },
    { key: "trophy",     label: "Trophy",       category: "Fun & Special" },
    { key: "star",       label: "Special",      category: "Fun & Special" },
    { key: "music",      label: "Music",        category: "Fun & Special" },
    { key: "art",        label: "Art Supplies", category: "Fun & Special" },
    { key: "book",       label: "Book",         category: "Fun & Special" },
    { key: "timer",      label: "Extra Time",   category: "Fun & Special" },
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
    // Uploaded custom image (data URL)
    if (typeof key === "string" && key.startsWith("data:image/")) {
        return `<span class="fh-chore-icon" style="width:${size};height:${size};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">` +
            `<img src="${key}" style="width:100%;height:100%;object-fit:contain;border-radius:4px" alt="">` +
            `</span>`;
    }
    if (key && FH_ICONS[key]) {
        return `<span class="fh-chore-icon" style="width:${size};height:${size};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:currentColor">` +
            FH_ICONS[key] +
            `</span>`;
    }
    const color = fallbackColor || DOT_COLORS[0];
    return `<span class="fh-chore-dot" style="width:12px;height:12px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>`;
}

/** List of all valid icon key names. */
export const FH_ICON_KEYS = Object.keys(FH_ICONS);

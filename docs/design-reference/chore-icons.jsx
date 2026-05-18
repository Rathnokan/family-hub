// Chore icon library — single-color line glyphs sized to the parent's
// `font-size` (via currentColor + 1em). Themes can recolor by setting the
// surrounding text color, and the kid pages can scale them by setting size
// on the wrapper.
//
// Every chore in FH_MISSIONS has an `icon` key in this map. The library is
// intentionally small (~20 glyphs) — enough to cover the actual chores in
// the family's data file, with room to add more as new chores appear.
//
// Usage:
//   <ChoreIcon name="bed" size={32} color="#fff" />

const FH_ICONS = {
  // —— BEDROOM / SELF-CARE ————————————————————————————————————————————
  bed: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V10M3 22H29M3 22v3M29 22V14a3 3 0 0 0-3-3H14v6h-3v-2H3" />
      <circle cx="9" cy="14.5" r="1.5" />
    </svg>
  ),
  tooth: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4c-3 0-5 2-5 6 0 3 2 6 2 11 0 4 1 7 3 7s3-3 3-7c0-2 1-3 3-3s3 1 3 3c0 4 1 7 3 7s3-3 3-7c0-5 2-8 2-11 0-4-2-6-5-6-2 0-3 1-6 1S12 4 10 4Z" />
    </svg>
  ),
  shower: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 2v6M22 8H10M8 12h16l-1 4H9z" />
      <path d="M11 20v1M14 22v1M17 20v1M20 22v1M13 25v1M18 26v1" />
    </svg>
  ),
  // —— PETS ——————————————————————————————————————————————————————————
  dog: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12c0-3 2-5 4-5l2 3 5-1 5 1 2-3c2 0 4 2 4 5v6c0 2-2 4-4 4h-3v3h-3v-3h-6v3H9v-3H6c-1 0-2-1-2-2v-4c0-2 1-4 2-4Z" />
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/>
      <circle cx="20" cy="15" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  cat: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l4 6h12l4-6v14a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z" />
      <path d="M12 16l1 2M20 16l-1 2M14 22h4" />
    </svg>
  ),
  // —— KITCHEN ————————————————————————————————————————————————————————
  dishes: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="6" />
      <path d="M6 16h2M24 16h2M16 6v2M16 24v2" />
    </svg>
  ),
  plate: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6v8a8 8 0 0 0 16 0V6M12 6v22M20 6v22M8 6h16" />
    </svg>
  ),
  snack: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 16a10 10 0 0 1 20 0v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
      <path d="M11 12v2M16 11v2M21 12v2" />
    </svg>
  ),
  bread: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a8 5 0 0 1 24 0v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M10 14v8M16 14v8M22 14v8" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="20" height="24" rx="2" />
      <path d="M10 10h12M10 14h12M10 18h12M10 22h8" />
    </svg>
  ),
  // —— HOME UPKEEP ———————————————————————————————————————————————————
  trash: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h22M12 8V5h8v3M8 8v18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M13 13v11M19 13v11" />
    </svg>
  ),
  broom: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4 12 14M9 17l6 6M5 25l4 4M8 28l3-3M14 22l3-3" />
      <path d="m12 14 6 6-3 3-9 1 1-9z" />
    </svg>
  ),
  vacuum: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="20" r="8" />
      <circle cx="16" cy="20" r="3" />
      <path d="M16 12V6h-4M22 12V8h-2" />
    </svg>
  ),
  wipe: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="14" width="24" height="10" rx="2" />
      <path d="M9 18l4 4M14 18l4 4M19 18l4 4M8 14V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6" />
    </svg>
  ),
  plant: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 28V14M16 14c-4-2-7-1-7-7 4 0 7 2 7 7Zm0 0c4-2 7-1 7-7-4 0-7 2-7 7Z" />
      <path d="M10 28h12" />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 26 9-9-4-4-3 1-3-3 4-4 3 3-1 3 4 4M20 4l5 5-3 3 4 4-4 4-4-4-3 3-5-5z" />
    </svg>
  ),
  // —— SCHOOL / FOCUS ———————————————————————————————————————————————
  book: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6c4-2 8-2 12 0 4-2 8-2 12 0v18c-4-2-8-2-12 0-4-2-8-2-12 0zM16 6v18" />
    </svg>
  ),
  pencil: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 4 6 6L12 26l-7 1 1-7zM18 8l6 6M5 27l3-3" />
    </svg>
  ),
  piano: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="26" height="16" rx="1" />
      <path d="M3 18h26M10 8v10h-2v6M16 8v10h-2v6M22 8v10h-2v6" />
    </svg>
  ),
  backpack: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12V8a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4" />
      <rect x="5" y="10" width="22" height="18" rx="3" />
      <path d="M10 16h12v6H10z" />
    </svg>
  ),
  // —— ROOM ICONS (home command center) ——————————————————————————————
  chores: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h14l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
      <path d="m9 18 3 3 7-7M20 8v4h4" />
    </svg>
  ),
  maintenance: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 26 16 6l12 20zM16 14v6M16 23v.5" />
    </svg>
  ),
  smarthome: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16 16 4l12 12M7 14v12h18V14" />
      <circle cx="16" cy="20" r="3" />
      <path d="M16 16v1M16 23v1M12 20h1M19 20h1" />
    </svg>
  ),
  meals: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 14a10 10 0 0 1 20 0M3 18h26v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
      <path d="M14 8V4M16 4h-4M12 12c1-1 3-1 4 0" />
    </svg>
  ),
};

function ChoreIcon({ name, size = 28, color, style = {}, strokeWidth }) {
  const glyph = FH_ICONS[name];
  if (!glyph) {
    // Fallback — small dot so a missing icon doesn't crash the layout
    return (
      <span style={{
        display: 'inline-block', width: size, height: size,
        borderRadius: '50%', background: color || 'currentColor',
        opacity: 0.4, ...style,
      }} />
    );
  }
  return (
    <span style={{
      display: 'inline-flex', width: size, height: size,
      color: color || 'currentColor', flexShrink: 0, ...style,
    }}>
      {React.cloneElement(glyph, {
        width: size, height: size,
        ...(strokeWidth ? { strokeWidth } : {}),
      })}
    </span>
  );
}

Object.assign(window, { ChoreIcon, FH_ICONS });

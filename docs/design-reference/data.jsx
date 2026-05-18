// Shared data + themes for the Family Hub Echo Show 15 dashboard.
// Mirrors live sensor contracts (assigned_to, days_until_reset, recurrence_type,
// streak, category_label, penalty_*) so the mockups stay honest about the
// real shape of the integration.

window.FH_PALETTE = {
  ink:       '#0B1320',
  ink2:      '#0F1727',
  panel:     '#141E2E',
  panel2:    '#1A2538',
  panel3:    '#202D45',
  stroke:    '#2A3852',
  strokeHi:  '#3A4B6B',
  text:      '#ECEFF6',
  textDim:   '#A6B3CC',
  textMute:  '#6F7E9C',
  gold:      '#F5C24A',
  goldDim:   '#A67E1F',
  red:       '#E8553E',
  cyan:      '#5BD3E8',
  green:     '#58D38A',
  rose:      '#E36DA4',
  paper:     '#F2E9D6',
  paperDark: '#241B0E',
};

// `themeKey` ties each person to one of the 6 themed page renderers (classic
// is the fallback). v0.6.0 Sessions 4-5 shipped the full set. `code` is the
// codename surfaced across the dashboard; `childMode` flips that person's
// pages into `fh-page--large` (Jackson's accessibility lever).
//
// `rankIndex` is the new rank ladder position (v0.6.0 S5). Parents store 999
// to always render at max rank. `weeklyPts` is the sum of positive
// points_delta since Monday — drives the weekly rank-bar mechanic
// (drop/gain thresholds).
window.FH_AGENTS = [
  { id: 'jim',     name: 'Jim',     code: 'NIGHT-OWL', color: '#5B8DEF', kind: 'parent', sigil: '⟁', balance: 220, streakDays: 4,  themeKey: 'engineer', childMode: false, rankIndex: 999, weeklyPts: 95 },
  { id: 'shannon', name: 'Shannon', code: 'ORCHID',    color: '#E36DA4', kind: 'parent', sigil: '❧', balance: 305, streakDays: 9,  themeKey: 'baker',    childMode: false, rankIndex: 999, weeklyPts: 110 },
  { id: 'spencer', name: 'Spencer', code: 'T-REX',     color: '#5BB97A', kind: 'kid',    sigil: '◉', balance: 472, streakDays: 12, themeKey: 'dinos',    childMode: false, rankIndex: 2,   weeklyPts: 80 },
  { id: 'olivia',  name: 'Olivia',  code: 'SNITCH',    color: '#B66BD8', kind: 'kid',    sigil: '⚡', balance: 318, streakDays: 7,  themeKey: 'hp',       childMode: false, rankIndex: 2,   weeklyPts: 60 },
  { id: 'jackson', name: 'Jackson', code: 'KAMEHA',    color: '#FF8A3D', kind: 'kid',    sigil: '◎', balance: 156, streakDays: 3,  themeKey: 'dbz',      childMode: true,  rankIndex: 1,   weeklyPts: 40 },
];

// Weekly rank thresholds (v0.6.0 S5): drop below `dropThreshold` → rank −1,
// at or above `gainThreshold` → rank +1, else hold. Configurable per person
// or globally on the needs_attention sensor.
window.FH_RANK_THRESHOLDS = { drop: 50, gain: 75 };

// Rank ladders per theme — copied verbatim from src/card/themes/*.js.
window.FH_RANKS = {
  classic:  [{ name: 'Level 1' }, { name: 'Level 2' }, { name: 'Level 3' }, { name: 'Level 4' }, { name: 'Level 5' }, { name: 'Level 6' }, { name: 'Level 7' }],
  engineer: [{ name: 'Drafter' }, { name: 'Jr. Engineer' }, { name: 'P.E.' }, { name: 'Sr. Engineer' }, { name: 'Principal Eng.' }],
  baker:    [{ name: 'Apprentice' }, { name: 'Line Cook' }, { name: 'Pastry Chef' }, { name: 'Sous Chef' }, { name: 'Head Chef' }, { name: 'Master Baker' }],
  dinos:    [{ name: 'Field Asst.' }, { name: 'Jr. Paleontologist' }, { name: 'Field Lead' }, { name: 'Curator' }, { name: 'Dr. Spencer' }],
  hp:       [{ name: 'First Year' }, { name: 'Second Year' }, { name: 'Third Year' }, { name: 'Prefect' }, { name: 'Head Student' }, { name: 'Order of Phoenix' }],
  dbz:      [{ name: 'Saibaman' }, { name: 'Saiyan Trainee' }, { name: 'Saiyan' }, { name: 'Super Saiyan' }, { name: 'SSJ2' }, { name: 'SSJ3' }, { name: 'SSJ Blue' }],
};

// Theme tile metadata mirrored from src/card/themes/*.js — sigil watermark
// on the home agent tile, and home-tile sub-label.
window.FH_THEME_META = {
  classic:  { tint: '#1A2538', sigil: '◇', subLabel: 'FAMILY AGENT' },
  engineer: { tint: '#1B3550', sigil: '⟁', subLabel: 'CIVIL ENGINEER' },
  baker:    { tint: '#F2E5CC', sigil: '❧', subLabel: 'MASTER BAKER' },
  dinos:    { tint: '#E8DAB7', sigil: '◉', subLabel: 'FIELD PALEONTOLOGIST' },
  hp:       { tint: '#EFE0BA', sigil: '⚡', subLabel: 'HOGWARTS STUDENT' },
  dbz:      { tint: '#3FAAD9', sigil: '◎', subLabel: 'SAIYAN WARRIOR' },
};

window.FH_CATEGORIES = ['Morning', 'After School', 'Evening', 'Around the House'];

// `icon` is a key into the FH_ICONS library (chore-icons.jsx). Admin would
// pick this from a gallery when creating the chore. For Jackson (pre-reader)
// the icon is the primary affordance; for older kids and parents it
// supplements the title.
window.FH_MISSIONS = [
  { id: 't1',  assigned: 'spencer', name: 'Take out trash',        category: 'Evening',      points: 10, days_delta: -1, streakCurrent: 6,  streakGoal: 7,  penalty: 5, icon: 'trash' },
  { id: 't2',  assigned: 'jackson', name: 'Make bed',              category: 'Morning',      points: 5,  days_delta: 0,  streakCurrent: 2,  streakGoal: 7,  penalty: 0, icon: 'bed' },
  { id: 't3',  assigned: 'jackson', name: 'Brush teeth',           category: 'Morning',      points: 5,  days_delta: 0,  streakCurrent: 3,  streakGoal: 7,  penalty: 0, icon: 'tooth' },
  { id: 't4',  assigned: 'olivia',  name: 'Feed the cat',          category: 'Morning',      points: 10, days_delta: 0,  streakCurrent: 7,  streakGoal: 7,  penalty: 5, milestoneSoon: true, icon: 'cat' },
  { id: 't5',  assigned: 'spencer', name: 'Walk the dog',          category: 'Morning',      points: 15, days_delta: 0,  streakCurrent: 11, streakGoal: 14, penalty: 0, icon: 'dog' },
  { id: 't6',  assigned: 'olivia',  name: 'Reading — 20 min',      category: 'After School', points: 15, days_delta: 0,  streakCurrent: 5,  streakGoal: 7,  penalty: 0, icon: 'book' },
  { id: 't7',  assigned: 'jackson', name: 'Practice piano',        category: 'After School', points: 20, days_delta: 0,  streakCurrent: 1,  streakGoal: 7,  penalty: 0, icon: 'piano' },
  { id: 't8',  assigned: 'spencer', name: 'Math homework check',   category: 'After School', points: 10, days_delta: 0,  streakCurrent: 4,  streakGoal: 7,  penalty: 0, icon: 'pencil' },
  { id: 't9',  assigned: 'olivia',  name: 'Empty the dishwasher',  category: 'Evening',      points: 15, days_delta: 0,  streakCurrent: 2,  streakGoal: 7,  penalty: 5, resetSoon: true, icon: 'dishes' },
  { id: 't10', assigned: 'jackson', name: 'Tidy bedroom',          category: 'Evening',      points: 10, days_delta: 0,  streakCurrent: 0,  streakGoal: 7,  penalty: 5, icon: 'broom' },
  { id: 't11', assigned: 'spencer', name: 'Set the dinner table',  category: 'Evening',      points: 10, days_delta: 0,  streakCurrent: 8,  streakGoal: 7,  penalty: 0, icon: 'plate' },
  { id: 't12', assigned: 'jim',     name: 'Water the plants',      category: 'Evening',      points: 5,  days_delta: 0,  streakCurrent: 0,  streakGoal: 3,  penalty: 0, icon: 'plant' },
  // Extra for individual person pages
  { id: 't13', assigned: 'jackson', name: 'Snack cleanup',         category: 'After School', points: 5,  days_delta: 0,  streakCurrent: 4,  streakGoal: 7,  penalty: 0, icon: 'snack' },
  { id: 't14', assigned: 'olivia',  name: 'Pack school bag',       category: 'Evening',      points: 5,  days_delta: 0,  streakCurrent: 6,  streakGoal: 7,  penalty: 0, icon: 'backpack' },
  { id: 't15', assigned: 'spencer', name: 'Shower',                category: 'Evening',      points: 5,  days_delta: 0,  streakCurrent: 9,  streakGoal: 7,  penalty: 0, icon: 'shower' },
  { id: 't16', assigned: 'shannon', name: 'Plan tomorrow\'s menu', category: 'Evening',      points: 10, days_delta: 0,  streakCurrent: 5,  streakGoal: 7,  penalty: 0, icon: 'menu' },
  { id: 't17', assigned: 'shannon', name: 'Sourdough starter',     category: 'Morning',      points: 10, days_delta: 0,  streakCurrent: 14, streakGoal: 7,  penalty: 0, icon: 'bread' },
  { id: 't18', assigned: 'jim',     name: 'Garage tidy-up',        category: 'Around the House', points: 25, days_delta: 0, streakCurrent: 2, streakGoal: 4, penalty: 0, icon: 'tools' },
];

window.FH_CLAIMABLE = [
  { id: 'c1', name: 'Vacuum the living room',  points: 50, recurrence: 'fcfs',         note: 'High value · weekly', icon: 'vacuum' },
  { id: 'c2', name: 'Wipe down kitchen counters', points: 20, recurrence: 'fcfs',      note: 'Quick win',           icon: 'wipe' },
  { id: 'c3', name: 'Sweep the back deck',     points: 30, recurrence: 'multi_claim',  note: 'Up to 2 agents · split', icon: 'broom' },
];

window.FH_APPROVALS = [
  { id: 'a1', person: 'olivia',  name: 'Clean out backpack',  points: 25, when: '4m ago',  icon: 'backpack' },
  { id: 'a2', person: 'spencer', name: 'Vacuum living room',  points: 50, when: '12m ago', icon: 'vacuum' },
];

window.FH_STORE = [
  { id: 'r1', name: 'Movie Night Pick',     cost: 150,  rarity: 'common',    tag: 'YOU CHOOSE THE FILM' },
  { id: 'r2', name: '30 min Screen Time',   cost: 80,   rarity: 'common',    tag: 'BONUS' },
  { id: 'r3', name: 'Pizza Friday',         cost: 300,  rarity: 'rare',      tag: 'FAMILY UNLOCK' },
  { id: 'r4', name: 'Stay Up +1 Hour',      cost: 250,  rarity: 'rare',      tag: 'WEEKEND ONLY' },
  { id: 'r5', name: 'Day at the Aquarium',  cost: 1200, rarity: 'legendary', tag: 'MAJOR REWARD' },
  { id: 'r6', name: 'New Book of Choice',   cost: 400,  rarity: 'epic',      tag: 'EARN IT' },
];

window.FH_HISTORY = [
  { id: 'h1', t: 'Today · 7:42a', agent: 'spencer', kind: 'complete',  name: 'Walk the dog',       pts: +15, icon: 'dog' },
  { id: 'h2', t: 'Today · 7:38a', agent: 'olivia',  kind: 'milestone', name: 'Feed the cat',       pts: +25, note: '7-DAY STREAK BONUS', icon: 'cat' },
  { id: 'h3', t: 'Today · 7:30a', agent: 'jackson', kind: 'complete',  name: 'Make bed',           pts: +5,  icon: 'bed' },
  { id: 'h4', t: 'Yest · 9:12p',  agent: 'olivia',  kind: 'redeem',    name: '30 min Screen Time', pts: -80 },
  { id: 'h5', t: 'Yest · 8:04p',  agent: 'spencer', kind: 'approve',   name: 'Vacuum living room', pts: +50, icon: 'vacuum' },
  { id: 'h6', t: 'Yest · 5:15p',  agent: 'jackson', kind: 'skip',      name: 'Practice piano',     pts: -3,  icon: 'piano' },
  { id: 'h7', t: '2d · 7:00a',    agent: 'shannon', kind: 'allowance', name: 'Weekly allowance',   pts: +50 },
];

// "Rooms" of the family hub. Each tile on the home command center links to one
// of these. v0.6.0 Session 2 made this pluggable — the live registry is in
// src/card/rooms/index.js. Chores + Maintenance are live (with real stats);
// meals/smarthome/calendar are coming-soon (preview text + COMING SOON badge).
// Calendar will power the today-strip when it goes live.
window.FH_ROOMS = [
  { id: 'chores',      label: 'CHORES HQ',   sub: 'Mission Control',         status: 'live',
    icon: 'check',    accent: '#F5C24A',
    stats: [{ label: 'due today', value: 11 }, { label: 'need approval', value: 2, accent: '#E8553E' }],
    preview: '' },
  { id: 'maintenance', label: 'HOME CARE',   sub: 'Maintenance Tracker',     status: 'live',
    icon: 'wrench',   accent: '#ff9f0a',
    stats: [{ label: 'overdue', value: 1, accent: '#E8553E' }, { label: 'due this week', value: 3 }],
    preview: '' },
  { id: 'meals',       label: 'MEALS',       sub: 'Weekly menu & grocery list', status: 'coming',
    icon: 'meals',    accent: '#ff9f0a', stats: [],
    preview: "Plan the week's meals, build a grocery list, and see tonight's dinner at a glance." },
  { id: 'smarthome',   label: 'SMART HOME',  sub: 'Lights, climate & more',  status: 'coming',
    icon: 'house',    accent: '#30d158', stats: [],
    preview: 'Kid-safe controls for lights, thermostat, and irrigation — right from the kitchen.' },
  { id: 'calendar',    label: 'CALENDAR',    sub: "Today's schedule",        status: 'coming',
    icon: 'calendar', accent: '#64d2ff', stats: [],
    preview: "See today's events, upcoming reminders, and schedule — powered by your HA calendars." },
];

// Tiny "right now" panel on the home strip — pulls things actually useful when
// you walk into the kitchen. v0.6.0 Session 2 shipped weather + approval count
// only; schedule waits on the Calendar room going live (v0.8.0). Schedule is
// kept here for legacy use in earlier mocks; the new home-page mock ignores it.
window.FH_NOW = {
  weather: { temp: 64, label: 'Partly Cloudy', cond: 'partlycloudy', high: 71, low: 58 },
  schedule: [
    { who: 'Olivia',  what: 'Piano lesson',     when: '4:00 PM' },
    { who: 'Spencer', what: 'Soccer practice',  when: '5:30 PM' },
    { who: 'Family',  what: 'Pizza Friday',     when: '7:00 PM' },
  ],
  laundry: 'Dryer · 12 min left',
  familyName: 'Rathnokan Family',
  globalPaused: false,
};

window.FH_BY_ID = (id) => window.FH_AGENTS.find(a => a.id === id);

/**
 * Family Hub Card — Meals Room (v0.8.0)
 *
 * Ported from the Claude Design prototype (mp-*.jsx files).
 * Renders as vanilla HTML strings; interactivity via data-act attributes
 * dispatched through dispatch.js.
 *
 * Architecture rules:
 *  - No React. Pure HTML-string renderers.
 *  - data-act="meals-*" for all interactive elements.
 *  - Pure-UI actions (tab switch, pagination, drawer step) mutate card
 *    UI-state fields then call card._doRender(true).
 *  - Service actions call card._svc(...) via dispatch.js cases.
 *  - Baker chrome (fh-bk-*) reused; meals chrome is fh-ml-* / fh-tdy-*.
 */

import { escHTML, escAttr } from "../utils.js";
import {
    GROUPS, GROUP_ORDER, PROTEINS, PROTEIN_ORDER, AISLES,
    ING_SECTIONS, SIDES, THEMES,
    DOW, DOW_SHORT, MON, MON_SHORT,
    HORIZON_DAYS,
    iso, parseISO, addDays, today, startOfWeek, weekIdx,
    allMeals, mealById, sideById, getIngredients, ingById, getRecipe,
    mealIngredients, mealHealthyFats, mealWholeGrain, dinnerGroups,
    fmtDayLong, fmtDayShort, nextEmptyDinner, variantFor, rankIdeas,
} from "./meals-data.js";

// ---------------------------------------------------------------------------
// Public entry point — called by the room registry
// ---------------------------------------------------------------------------

export function renderMeals(card) {
    const attr       = card._attrs("sensor.family_hub_meals");
    const plan       = attr.plan        || {};
    const rhythm     = attr.rhythm      || {};
    const favs       = attr.favs        || [];
    const groc       = attr.groc        || {};
    const custom     = attr.custom      || [];
    const customIng  = attr.customIng   || [];
    const recipes    = attr.recipes     || {};
    const have       = attr.have        || [];

    const tab = card._mealsTab || "week";

    const tabs = [
        { key: "today",     label: "Today",             sub: "tonight" },
        { key: "week",      label: "This Week",         sub: "menu board" },
        { key: "plan",      label: "Plan",              sub: "day builder" },
        { key: "pantry",    label: "What Can We Make",  sub: "pantry" },
        { key: "library",   label: "Library",           sub: "recipes" },
        { key: "groceries", label: "Groceries",         sub: "shopping" },
    ];

    const tabBar = `
        <div class="fh-bk-tabs">
            ${tabs.map(t => `
                <button class="fh-bk-tab${tab === t.key ? " active" : ""}"
                        data-act="meals-tab" data-tab="${t.key}">
                    ${escHTML(t.label)}
                    <span class="fh-bk-tab-sub">${t.sub}</span>
                </button>`).join("")}
        </div>`;

    let body = "";
    if      (tab === "today")     body = _renderToday(plan, custom, customIng, have, recipes);
    else if (tab === "week")      body = _renderWeek(card, plan, custom);
    else if (tab === "plan")      body = _renderPlan(card, plan, custom, favs, rhythm);
    else if (tab === "pantry")    body = _renderPantry(card, plan, custom, customIng, favs, have);
    else if (tab === "library")   body = _renderLibrary(card, plan, custom, favs, recipes, have);
    else if (tab === "groceries") body = _renderGroceries(card, plan, custom, customIng, groc);

    // Recipe modal overlay (tab-independent)
    const recipeOverlay = card._mealsRecipe
        ? _renderRecipeModal(card._mealsRecipe, custom, recipes, plan)
        : "";

    // Drawer overlay (Plan tab)
    const drawerOverlay = (tab === "plan" && card._mealsDrawer)
        ? _renderDrawer(card, plan, custom, favs)
        : "";

    // Day-pick modal (pantry → plan a night)
    const dayPickOverlay = card._mealsDayPick
        ? _renderDayPickModal(card._mealsDayPick, plan, custom)
        : "";

    return `
        <div class="fh-bk-page fh-ml-room" style="display:flex;flex-direction:column;min-height:0;height:calc(100vh - 72px);max-height:920px;overflow:hidden;padding:14px 20px 10px;">
            ${tabBar}
            <div style="flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;position:relative;">
                ${body}
                ${drawerOverlay}
                ${recipeOverlay}
                ${dayPickOverlay}
            </div>
        </div>`;
}

// ---------------------------------------------------------------------------
// TODAY tab
// ---------------------------------------------------------------------------

function _renderToday(plan, custom, customIng, have, recipes) {
    const t        = today();
    const tomorrow = addDays(t, 1);
    return `
        <div class="fh-ml-content">
            <div class="fh-tdy-wrap">
                ${_glancePanel("Today",    t,        plan[iso(t)]        || {}, custom, customIng, have, recipes)}
                ${_glancePanel("Tomorrow", tomorrow, plan[iso(tomorrow)] || {}, custom, customIng, have, recipes)}
            </div>
        </div>`;
}

function _glancePanel(label, date, entry, custom, customIng, have, recipes) {
    const d            = entry.d;
    const main         = d ? mealById(d.main, custom) : null;
    const sides        = d ? (d.sides || []).map(sideById).filter(Boolean) : [];
    const bMeal        = entry.b ? mealById(entry.b, custom) : null;
    const lMeal        = entry.l ? mealById(entry.l, custom) : null;
    const proteinLabel = d && d.protein && PROTEINS[d.protein]
        ? PROTEINS[d.protein].label.toLowerCase() : null;
    const isToday = label === "Today";

    // Today enrichment: "what's needed today" — ingredients to pull for the day's
    // planned meals (dinner folded via mealIngredients so a chicken-taco pulls
    // chicken), minus the pantry "have" tags; plus the dinner's recipe time/serves.
    let needsHtml = "";
    if (isToday && (bMeal || lMeal || main)) {
        const allIng  = getIngredients(customIng);
        const haveSet = new Set(have || []);
        const ids = [];
        const addIngs = arr => (arr || []).forEach(id => {
            if (!haveSet.has(id) && !ids.includes(id)) ids.push(id);
        });
        if (bMeal && !bMeal.special) addIngs(bMeal.ing);
        if (lMeal && !lMeal.special) addIngs(lMeal.ing);
        if (main  && !main.special)  addIngs(mealIngredients(main, d));
        sides.forEach(s => addIngs(s.ing));
        const chips = ids.map(id => {
            const ing = allIng.find(x => x.id === id);
            return ing
                ? `<span class="fh-tdy-need"><span class="fh-tdy-need-g">${ing.glyph}</span>${escHTML(ing.label)}</span>`
                : "";
        }).join("");
        const recipe = main ? getRecipe(main, recipes) : null;
        const prep   = recipe
            ? `<div class="fh-tdy-prep">Dinner: <b>${escHTML(recipe.time)}</b> · serves ${recipe.serves}</div>`
            : "";
        needsHtml = `
            <div class="fh-tdy-needs">
                <div class="fh-tdy-needs-hdr">What's needed today</div>
                ${ids.length
                    ? `<div class="fh-tdy-needs-list">${chips}</div>`
                    : `<div class="fh-tdy-needs-none">✓ everything's on hand</div>`}
                ${prep}
            </div>`;
    }

    const dinnerHtml = main ? `
        <span class="fh-tdy-glyph">${main.glyph}</span>
        <span class="fh-tdy-name">${escHTML(main.name)}</span>
        ${d.variant
            ? `<span class="fh-tdy-variant">${escHTML(d.variant)}</span>`
            : proteinLabel
                ? `<span class="fh-tdy-variant">with ${escHTML(proteinLabel)}</span>`
                : ""}
        ${sides.length
            ? `<span class="fh-tdy-sides">${sides.map(s => escHTML(s.name)).join(" · ")}</span>`
            : ""}
    ` : `<span class="fh-tdy-empty">not planned yet</span>`;

    return `
        <div class="fh-tdy-panel${isToday ? " is-today" : ""}">
            <div class="fh-tdy-head">
                <span class="fh-tdy-label">${label}</span>
                <span class="fh-tdy-date">${DOW[date.getDay()]} · ${MON_SHORT[date.getMonth()]} ${date.getDate()}</span>
            </div>
            <div class="fh-tdy-dinner">
                <span class="fh-tdy-dinner-kicker">Dinner</span>
                ${dinnerHtml}
            </div>
            <div class="fh-tdy-bl">
                <div class="fh-tdy-bl-row">
                    <span class="fh-tdy-bl-k">Breakfast</span>
                    ${bMeal
                        ? `<span class="fh-tdy-bl-v">${bMeal.glyph} ${escHTML(bMeal.name)}</span>`
                        : `<span class="fh-tdy-bl-v empty">—</span>`}
                </div>
                <div class="fh-tdy-bl-row">
                    <span class="fh-tdy-bl-k">Lunch</span>
                    ${lMeal
                        ? `<span class="fh-tdy-bl-v">${lMeal.glyph} ${escHTML(lMeal.name)}</span>`
                        : `<span class="fh-tdy-bl-v empty">—</span>`}
                </div>
            </div>
            ${needsHtml}
        </div>`;
}

// ---------------------------------------------------------------------------
// THIS WEEK tab
// ---------------------------------------------------------------------------

function _renderWeek(card, plan, custom) {
    const weekPage  = card._mealsWeekPage || 0;
    const ws        = 0; // Sunday-start (hardcoded; no tweaks panel in family view)
    const t         = today();
    const thisWeekStart = startOfWeek(t, ws);
    const weekStart = addDays(thisWeekStart, weekPage * 7);
    const maxPage   = Math.floor((HORIZON_DAYS - 1) / 7);
    const canPrev   = weekPage > 0;
    const canNext   = weekPage < maxPage;

    const days    = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const end     = days[6];
    const rangeLabel = weekStart.getMonth() === end.getMonth()
        ? `${MON[weekStart.getMonth()]} ${weekStart.getDate()} – ${end.getDate()}`
        : `${MON_SHORT[weekStart.getMonth()]} ${weekStart.getDate()} – ${MON_SHORT[end.getMonth()]} ${end.getDate()}`;
    const offsetLabel = weekPage === 0 ? "this week" : weekPage === 1 ? "next week" : `${weekPage} weeks out`;

    const nextEmpty = nextEmptyDinner(plan);

    const pager = `
        <div class="fh-ml-pager">
            <div class="fh-ml-range">${rangeLabel}<em>~ ${offsetLabel} ~</em></div>
            <span class="fh-ml-pager-spacer"></span>
            ${weekPage !== 0 ? `<button class="fh-ml-ghost-btn" data-act="meals-week-today">Today</button>` : ""}
            <button class="fh-ml-pgbtn" data-act="meals-week-prev"${canPrev ? "" : " disabled"}>‹</button>
            <button class="fh-ml-pgbtn" data-act="meals-week-next"${canNext ? "" : " disabled"}>›</button>
        </div>`;

    const weekGrid = `
        <div class="fh-ml-week">
            ${days.map(d => _dayColumn(d, plan[iso(d)] || {}, custom, t)).join("")}
        </div>`;

    const legendRow = `
        <div class="fh-ml-legendrow">
            <span class="fh-ml-legend">
                <span class="fh-ml-legend-cap">on the plate:</span>
                ${GROUP_ORDER.map(g => `
                    <span class="fh-ml-lgd">
                        <span class="fh-ml-gicon on">${GROUPS[g].icon}</span>
                        ${escHTML(GROUPS[g].label)}
                    </span>`).join("")}
            </span>
            <span class="fh-ml-weeknote-inline">
                ${nextEmpty
                    ? `next open dinner: <b>${escHTML(fmtDayLong(nextEmpty))}</b> — tap any day to plan`
                    : `every dinner is planned for the next month — <b>nicely done</b>`}
            </span>
        </div>`;

    return `
        <div class="fh-ml-content">
            ${pager}
            ${weekGrid}
            ${legendRow}
        </div>`;
}

function _dayColumn(date, entry, custom, todayDate) {
    const k       = iso(date);
    const isToday = k === iso(todayDate);
    const isPast  = date < todayDate && !isToday;
    const d       = entry.d;
    const main    = d ? mealById(d.main, custom) : null;
    const sides   = d ? (d.sides || []).map(sideById).filter(Boolean) : [];
    const groups  = dinnerGroups(d, custom);

    const dinnerContent = main ? `
        <span class="fh-ml-dglyph">${main.glyph}</span>
        <span class="fh-ml-dname">${escHTML(main.name)}</span>
        ${d.variant ? `<span class="fh-ml-dvariant">${escHTML(d.variant)}</span>` : ""}
        ${sides.length ? `<span class="fh-ml-dsides">${sides.map(s => escHTML(s.name)).join(" · ")}</span>` : ""}
        ${groups.length ? _plateDots(groups) : ""}
    ` : `
        <span class="fh-ml-dempty"><span>${isPast ? "" : "＋"}</span>${isPast ? "—" : "nothing yet"}</span>
    `;

    const tapAttr = isPast ? "" : `data-act="meals-week-tap-day" data-date="${k}"`;

    return `
        <div class="fh-ml-day${isToday ? " today" : ""}${isPast ? " past" : ""}">
            <div class="fh-ml-day-hdr">
                ${DOW_SHORT[date.getDay()].toUpperCase()} ${date.getDate()}
                ${isToday ? `<span class="fh-ml-day-today-tag">~ today ~</span>` : ""}
            </div>
            <div class="fh-ml-day-dinner" ${tapAttr}>
                ${dinnerContent}
            </div>
            <div class="fh-ml-bl" ${tapAttr}>
                ${_blSlot("BREAKFAST", entry.b, custom)}
                ${_blSlot("LUNCH",     entry.l, custom)}
            </div>
        </div>`;
}

function _blSlot(label, mealId, custom) {
    const meal = mealId ? mealById(mealId, custom) : null;
    return `
        <div class="fh-ml-bl-slot">
            <span class="fh-ml-bl-kicker">${label}</span>
            ${meal ? `
                <span class="fh-ml-bl-meal">
                    <span class="fh-ml-bl-glyph">${meal.glyph}</span>
                    <span class="fh-ml-bl-name">${escHTML(meal.name)}</span>
                </span>` : `
                <span class="fh-ml-bl-name empty">open</span>`}
        </div>`;
}

// ---------------------------------------------------------------------------
// PLAN tab
// ---------------------------------------------------------------------------

function _renderPlan(card, plan, custom, favs, rhythm) {
    const t       = today();
    const selISO  = card._mealsJumpDate || iso(t);
    const selDate = parseISO(selISO);
    const entry   = plan[selISO] || {};
    const ws      = 0;

    // Build rail groups
    const railDays   = Array.from({ length: HORIZON_DAYS }, (_, i) => addDays(t, i));
    const railGroups = [];
    railDays.forEach(d => {
        const wkKey = iso(startOfWeek(d, ws));
        let g = railGroups[railGroups.length - 1];
        if (!g || g.key !== wkKey) {
            const lbl = railGroups.length === 0 ? "This week"
                : railGroups.length === 1 ? "Next week"
                : `Week of ${MON_SHORT[d.getMonth()]} ${startOfWeek(d, ws).getDate()}`;
            g = { key: wkKey, label: lbl, days: [] };
            railGroups.push(g);
        }
        g.days.push(d);
    });

    const rail = `
        <div class="fh-ml-rail">
            ${railGroups.map(g => `
                <div class="fh-ml-rail-wk">${g.label}</div>
                ${g.days.map(d => {
                    const k  = iso(d);
                    const e  = plan[k] || {};
                    const cls = "fh-ml-rail-day"
                        + (k === selISO   ? " active"   : "")
                        + (k === iso(t)   ? " is-today" : "");
                    return `
                        <div class="${cls}" data-act="meals-plan-select-day" data-date="${k}">
                            <span class="fh-ml-rail-date">${fmtDayShort(d)}</span>
                            <span class="fh-ml-rail-dots">
                                <span class="fh-ml-rail-dot${e.b ? " filled" : ""}"></span>
                                <span class="fh-ml-rail-dot${e.l ? " filled" : ""}"></span>
                                <span class="fh-ml-rail-dot${e.d ? " filled" : ""}"></span>
                            </span>
                        </div>`;
                }).join("")}
            `).join("")}
        </div>`;

    const hasAnything = entry.b || entry.l || entry.d;

    const dayHdr = `
        <div class="fh-ml-dayhdr">
            <span class="fh-ml-dayhdr-title">${fmtDayLong(selDate)}</span>
            ${iso(t) === selISO ? `<span class="fh-ml-dayhdr-sub">~ today ~</span>` : ""}
            <span class="fh-ml-pager-spacer"></span>
            ${hasAnything
                ? `<button class="fh-ml-ghost-btn" data-act="meals-clear-day" data-date="${selISO}">Clear day</button>`
                : ""}
        </div>`;

    const dinnerCard  = _dinnerCard(entry, custom, selISO);
    const blCol       = _blCol(entry, custom, selISO);
    const rhythmStrip = _rhythmStrip(rhythm, ws);

    return `
        <div class="fh-ml-content">
            <div class="fh-ml-bld">
                ${rail}
                <div class="fh-ml-main">
                    ${rhythmStrip}
                    ${dayHdr}
                    <div class="fh-ml-slots">
                        ${dinnerCard}
                        ${blCol}
                    </div>
                </div>
            </div>
        </div>`;
}

function _rhythmStrip(rhythm, ws) {
    const order = Array.from({ length: 7 }, (_, i) => (ws + i) % 7);
    const rhPop = null; // popover is handled via DOM directly in dispatch (not needed here;
    // we render all popovers and show/hide via CSS class in dispatch)

    return `
        <div class="fh-ml-rhythm">
            <div class="fh-ml-rhythm-head">
                <span class="fh-ml-rhythm-lbl">Theme nights</span>
                <span class="fh-ml-rhythm-hint">Pin a regular dinner to a weekday — like Taco Tuesday or Pizza Friday — and it fills itself in every week. Tap a day to set or change it.</span>
            </div>
            <div class="fh-ml-rhythm-chips">
                ${order.map(wd => {
                    const themeKey = rhythm[String(wd)];
                    const theme    = themeKey ? THEMES[themeKey] : null;
                    return `
                        <div class="fh-ml-rh-wrap">
                            <button class="fh-ml-rh-chip${theme ? " set" : ""}"
                                    data-act="meals-rhythm-pop" data-weekday="${wd}">
                                <span class="fh-ml-rh-dow">${DOW_SHORT[wd].toUpperCase()}</span>
                                ${theme
                                    ? `<span class="fh-ml-rh-val">${theme.glyph}</span><span class="fh-ml-rh-name">${escHTML(theme.label)}</span>`
                                    : `<span class="fh-ml-rh-set">＋ set</span>`}
                            </button>
                            <div class="fh-ml-rh-pop" id="fh-rh-pop-${wd}" style="display:none;left:0;">
                                <div class="fh-ml-rh-opt${!themeKey ? " on" : ""}"
                                     data-act="meals-set-rhythm" data-weekday="${wd}" data-theme="">
                                    <span class="rh-g">∅</span> No theme
                                </div>
                                ${Object.entries(THEMES).map(([k, th]) => `
                                    <div class="fh-ml-rh-opt${themeKey === k ? " on" : ""}"
                                         data-act="meals-set-rhythm" data-weekday="${wd}" data-theme="${k}">
                                        <span class="rh-g">${th.glyph}</span> ${escHTML(th.label)}
                                    </div>`).join("")}
                            </div>
                        </div>`;
                }).join("")}
            </div>
        </div>`;
}

function _dinnerCard(entry, custom, dateISO) {
    const d     = entry.d;
    const main  = d ? mealById(d.main, custom) : null;
    const sides = d ? (d.sides || []).map(sideById).filter(Boolean) : [];
    const groups = dinnerGroups(d, custom);

    if (main) {
        const sidesHtml = !main.special ? `
            <div class="fh-ml-sides-row">
                ${sides.map(s => `
                    <span class="fh-ml-schip"
                          data-act="meals-remove-side" data-date="${dateISO}" data-side="${s.id}">
                        ${s.glyph} ${escHTML(s.name)} <span class="x">✕</span>
                    </span>`).join("")}
                <span class="fh-ml-schip add"
                      data-act="meals-open-sides" data-date="${dateISO}">＋ side</span>
            </div>
        ` : "";

        return `
            <div class="fh-ml-dcard">
                <span class="fh-ml-slot-kicker">Dinner · the main event</span>
                <button class="fh-ml-xbtn" data-act="meals-clear-dinner" data-date="${dateISO}" title="Clear dinner">✕</button>
                <div class="fh-ml-dcard-body">
                    <span class="fh-ml-dcard-glyph">${main.glyph}</span>
                    <span class="fh-ml-dcard-name">${escHTML(main.name)}</span>
                    ${d.variant ? `<span class="fh-ml-dcard-variant">${escHTML(d.variant)}</span>` : ""}
                    ${d.via === "rhythm" ? `<span class="fh-ml-via-tag">~ set by your weekly rhythm ~</span>` : ""}
                    ${sidesHtml}
                    ${groups.length ? `<div style="padding-top:6px">${_plateDots(groups)}</div>` : ""}
                </div>
                <div class="fh-ml-dcard-actions">
                    <button class="fh-ml-ghost-btn"
                            data-act="meals-open-drawer" data-kind="d-main" data-date="${dateISO}">
                        Change dinner
                    </button>
                </div>
            </div>`;
    }

    return `
        <div class="fh-ml-dcard">
            <span class="fh-ml-slot-kicker">Dinner · the main event</span>
            <div class="fh-ml-dcard-body">
                <span class="fh-ml-dempty-big">nothing planned yet</span>
                <button class="fh-bk-go-btn"
                        data-act="meals-open-drawer" data-kind="d-main" data-date="${dateISO}">
                    Choose dinner
                </button>
            </div>
        </div>`;
}

function _blCol(entry, custom, dateISO) {
    return `
        <div class="fh-ml-blcol">
            ${_blCard("Breakfast", "b", entry.b, custom, dateISO)}
            ${_blCard("Lunch",     "l", entry.l, custom, dateISO)}
        </div>`;
}

function _blCard(label, slot, mealId, custom, dateISO) {
    const meal = mealId ? mealById(mealId, custom) : null;
    return `
        <div class="fh-ml-blcard">
            <span class="fh-ml-slot-kicker">${label}</span>
            <div class="fh-ml-blcard-body">
                ${meal ? `
                    <span class="fh-ml-blcard-glyph">${meal.glyph}</span>
                    <span class="fh-ml-blcard-name">${escHTML(meal.name)}</span>
                    <button class="fh-ml-xbtn"
                            data-act="meals-clear-bl" data-date="${dateISO}" data-slot="${slot}"
                            title="Clear ${label.toLowerCase()}">✕</button>
                ` : `
                    <span class="fh-ml-blcard-name empty">quick pick — one tap covers the week</span>
                `}
            </div>
            <div class="fh-ml-blcard-actions">
                <button class="fh-ml-ghost-btn"
                        data-act="meals-open-drawer" data-kind="${slot}" data-date="${dateISO}">
                    ${meal ? "Change" : "＋ Choose"}
                </button>
            </div>
        </div>`;
}

// ---------------------------------------------------------------------------
// PICKER DRAWER (Plan tab overlay)
// ---------------------------------------------------------------------------

function _renderDrawer(card, plan, custom, favs) {
    const dr       = card._mealsDrawer; // { kind, dateISO, step, cat, cut, scope, favOnly, pendingMainId, pickedProtein, nudgeOff, fatsOff, selSides }
    const { kind, dateISO, step } = dr;
    const date     = parseISO(dateISO);
    const entry    = plan[dateISO] || {};
    const isBL     = kind === "b" || kind === "l";
    const slotKind = isBL ? kind : "d";
    const slotName = kind === "b" ? "breakfast" : kind === "l" ? "lunch" : "dinner";
    const meals    = allMeals(custom);

    const pendingMain   = dr.pendingMainId ? mealById(dr.pendingMainId, custom) : null;
    const pickedProtein = dr.pickedProtein || null;
    const selSides      = new Set(dr.selSides || []);

    // Quick specials
    const quicks = meals.filter(m => m.special && m.types.includes(slotKind));

    // Guided flow helpers
    function dinnersFor(catId, cutId) {
        return meals.filter(m =>
            m.types.includes("d") && !m.special && m.protein === catId &&
            (!cutId || m.cut === cutId));
    }
    function visibleCuts(catId) {
        return (PROTEINS[catId]?.cuts || []).filter(c => dinnersFor(catId, c.id).length > 0);
    }

    const cat      = dr.cat || null;
    const cut      = dr.cut || null;
    const scope    = dr.scope || "today";
    const favOnly  = dr.favOnly || false;
    const nudgeOff = dr.nudgeOff || false;
    const fatsOff  = dr.fatsOff  || false;

    const catLabel = cat ? PROTEINS[cat].label : "";
    const cutLabel = cat && cut ? (PROTEINS[cat].cuts.find(c => c.id === cut) || {}).label || "" : "";

    const headTitle =
        step === "protein"     ? "What's the protein?"
        : step === "cut"       ? `Which ${catLabel.toLowerCase()}?`
        : step === "make"      ? `${cutLabel || catLabel} — what are we making?`
        : step === "sides"     ? (pendingMain ? `${pendingMain.glyph} ${pendingMain.name} · round out the plate` : "Round out the plate")
        : step === "tacoprotein" ? (pendingMain ? `${pendingMain.glyph} ${pendingMain.name} — pick the protein` : "Pick the protein")
        : step === "confirm"   ? "All set ✓"
        : isBL                 ? `Choosing ${slotName}`
        : "The whole library";

    const showBack = !isBL && kind !== "d-sides" &&
        (step === "cut" || step === "make" || step === "browse" ||
         step === "tacoprotein" || (step === "sides" && pendingMain));

    const head = `
        <div class="fh-ml-dr-head">
            ${showBack ? `<button class="fh-ml-ghost-btn" data-act="meals-drawer-back">‹ Back</button>` : ""}
            <span class="fh-ml-dr-title">${escHTML(headTitle)}</span>
            <span class="fh-ml-dr-date">~ ${fmtDayLong(date)} ~</span>
            <span class="fh-ml-dr-spacer"></span>
            ${isBL ? `
                <div class="fh-ml-scope">
                    ${[["today","Just today"],["week","All week"],["2weeks","2 weeks"]].map(([v, lbl]) => `
                        <button class="fh-ml-scope-opt${scope === v ? " on" : ""}"
                                data-act="meals-drawer-scope" data-scope="${v}">${lbl}</button>`).join("")}
                </div>` : ""}
            <button class="fh-ml-xbtn" data-act="meals-close-drawer">✕</button>
        </div>`;

    // Quick-pick row
    const quickRow = `
        <div class="fh-ml-dr-quick">
            ${quicks.map(m => `
                <button class="fh-ml-qchip"
                        data-act="meals-drawer-pick-special" data-meal="${m.id}">
                    ${m.glyph} ${escHTML(m.name)}
                </button>`).join("")}
            <span class="fh-ml-pager-spacer" style="flex:1"></span>
            ${step === "protein"
                ? `<button class="fh-ml-qchip" data-act="meals-drawer-browse">Browse everything ›</button>`
                : ""}
            ${step === "browse"
                ? `<button class="fh-ml-qchip${favOnly ? " on" : ""}" data-act="meals-drawer-favonly">♥ Favorites</button>`
                : ""}
        </div>`;

    let body = "";

    if (step === "protein") {
        body = `
            ${quickRow}
            <div class="fh-ml-grid fh-ml-pgrid">
                ${PROTEIN_ORDER.map(id => {
                    const p = PROTEINS[id];
                    const n = dinnersFor(id).length;
                    if (n === 0) return "";
                    return `
                        <div class="fh-ml-mealcard fh-ml-pcard"
                             data-act="meals-drawer-pick-cat" data-cat="${id}">
                            <span class="fh-ml-mealcard-glyph" style="font-size:calc(2.4rem * var(--fh-text-scale,1))">${p.glyph}</span>
                            <span class="fh-ml-mealcard-name" style="font-size:var(--fh-text-base)">${escHTML(p.label)}</span>
                            <span class="fh-ml-pcount">${n} ${n === 1 ? "idea" : "ideas"}</span>
                        </div>`;
                }).join("")}
            </div>`;
    }

    else if (step === "cut" && cat) {
        body = `
            <div class="fh-ml-grid fh-ml-pgrid">
                ${visibleCuts(cat).map(c => {
                    const n = dinnersFor(cat, c.id).length;
                    return `
                        <div class="fh-ml-mealcard fh-ml-pcard"
                             data-act="meals-drawer-pick-cut" data-cut="${c.id}">
                            <span class="fh-ml-mealcard-glyph" style="font-size:calc(2rem * var(--fh-text-scale,1))">${PROTEINS[cat].glyph}</span>
                            <span class="fh-ml-mealcard-name" style="font-size:var(--fh-text-sm)">${escHTML(c.label)}</span>
                            <span class="fh-ml-pcount">${n} ${n === 1 ? "idea" : "ideas"}</span>
                        </div>`;
                }).join("")}
            </div>`;
    }

    else if (step === "make" && cat) {
        const list = dinnersFor(cat, cut).length ? dinnersFor(cat, cut) : dinnersFor(cat);
        body = `
            <div class="fh-ml-grid">
                ${list.map(m => _mealCardHtml(m, favs.includes(m.id), "meals-drawer-pick-main", { meal: m.id }, true)).join("")}
            </div>`;
    }

    else if (step === "browse") {
        const browseGrid = meals
            .filter(m => m.types.includes(slotKind) && !m.special)
            .filter(m => favOnly ? favs.includes(m.id) : true)
            .sort((a, b) => {
                const fa = favs.includes(a.id) ? 0 : 1;
                const fb = favs.includes(b.id) ? 0 : 1;
                return fa - fb || a.name.localeCompare(b.name);
            });
        body = `
            ${quickRow}
            <div class="fh-ml-grid">
                ${browseGrid.length ? browseGrid.map(m =>
                    _mealCardHtml(m, favs.includes(m.id),
                        isBL ? "meals-drawer-pick-bl" : "meals-drawer-pick-main",
                        { meal: m.id }, false)).join("")
                : `<div class="fh-ml-empty-note" style="grid-column:1/-1">
                    no favorites yet — tap ♥ Favorites to see everything
                   </div>`}
            </div>`;
    }

    else if (step === "tacoprotein" && pendingMain) {
        body = `
            <div class="fh-ml-grid fh-ml-pgrid">
                ${(pendingMain.proteinPick || []).map(pk => `
                    <div class="fh-ml-mealcard fh-ml-pcard${pickedProtein === pk ? " on" : ""}"
                         data-act="meals-drawer-pick-taco-protein" data-protein="${pk}">
                        <span class="fh-ml-mealcard-glyph" style="font-size:calc(2.4rem * var(--fh-text-scale,1))">${PROTEINS[pk].glyph}</span>
                        <span class="fh-ml-mealcard-name" style="font-size:var(--fh-text-base)">${escHTML(PROTEINS[pk].label)}</span>
                    </div>`).join("")}
            </div>
            <div class="fh-ml-dr-foot">
                <span class="fh-ml-dr-foot-note">${escHTML(pendingMain.name)} works with any of these — tap tonight's protein and it flows to the shopping list</span>
            </div>`;
    }

    else if (step === "sides") {
        const sidesMain  = pendingMain || (entry.d ? mealById(entry.d.main, custom) : null);
        const sidesCat   = sidesMain ? sidesMain.protein : cat;

        const plateGroups = (() => {
            const set = new Set(sidesMain ? (sidesMain.groups || []) : []);
            selSides.forEach(sid => {
                const s = sideById(sid);
                if (s) s.groups.forEach(g => set.add(g));
            });
            return [...set];
        })();
        const needsVeg = !plateGroups.includes("veg") && !plateGroups.includes("fruit");
        const fats     = mealHealthyFats(sidesMain);

        // Group sides into food-group sections (more guided than one long list).
        // Within each section, the meal's usual sides + pairing sides float up.
        const sideScore = s => {
            let sc = 0;
            if ((sidesMain && sidesMain.sides || []).includes(s.id)) sc += 100;
            if ((s.pairs || []).includes(sidesCat)) sc += 10;
            return sc;
        };
        const sideSections = GROUP_ORDER
            .map(g => ({
                g,
                sides: SIDES.filter(s => s.groups[0] === g)
                            .sort((a, b) => sideScore(b) - sideScore(a) || a.name.localeCompare(b.name)),
            }))
            .filter(sec => sec.sides.length);

        const plateSoFar = `
            <div class="fh-ml-plateso">
                <span class="fh-ml-legend-cap">the plate so far:</span>
                ${_plateDots(plateGroups)}
                ${needsVeg && !nudgeOff ? `
                    <span class="fh-ml-nudge">
                        🥦 add a veggie? pick one from the Veggies section below
                        <button class="fh-ml-nudge-x" data-act="meals-dismiss-nudge">dismiss</button>
                    </span>` :
                (plateGroups.includes("veg") || plateGroups.includes("fruit")) ? `
                    <span class="fh-ml-plateso-note good">~ something fresh on the plate ✓ ~</span>` : ""}
                ${fats.length && !fatsOff ? `
                    <span class="fh-ml-fats">
                        🫒 healthy fats here: ${escHTML(fats.join(", "))}
                        <button class="fh-ml-nudge-x" data-act="meals-dismiss-fats">got it</button>
                    </span>` : ""}
            </div>`;

        const footNote = sidesMain && sidesMain.sides && sidesMain.sides.length
            ? `the usual sides are pre-picked · PAIRS = goes well with ${sidesCat ? PROTEINS[sidesCat].label.toLowerCase() : "this"}`
            : "tap anything that should join the plate";

        body = `
            ${plateSoFar}
            <div class="fh-ml-sides-scroll">
                <div class="fh-ml-side-cols">
                    ${sideSections.map(sec => `
                        <div class="fh-ml-side-col${sec.g === "veg" && needsVeg && !nudgeOff ? " cue" : ""}">
                            <div class="fh-ml-side-sec-hdr">
                                <span class="fh-ml-gicon on">${GROUPS[sec.g].icon}</span>
                                ${escHTML(GROUPS[sec.g].label)}
                            </div>
                            ${sec.g === "veg" && needsVeg && !nudgeOff
                                ? `<div class="fh-ml-side-sec-cue">a fresh pick rounds out the plate</div>` : ""}
                            <div class="fh-ml-side-colgrid">
                                ${sec.sides.map(s => {
                                    const on        = selSides.has(s.id);
                                    const pairsWell = (s.pairs || []).includes(sidesCat);
                                    return `
                                        <div class="fh-ml-mealcard fh-ml-sidecard${on ? " on" : ""}"
                                             data-act="meals-toggle-side" data-side="${s.id}">
                                            ${on ? `<span class="ck">✓</span>` : ""}
                                            ${!on && pairsWell ? `<span class="fh-ml-pairtag">PAIRS</span>` : ""}
                                            <span class="fh-ml-mealcard-glyph" style="font-size:calc(1.6rem * var(--fh-text-scale,1))">${s.glyph}</span>
                                            <span class="fh-ml-mealcard-name" style="font-size:var(--fh-text-xs)">${escHTML(s.name)}</span>
                                        </div>`;
                                }).join("")}
                            </div>
                        </div>`).join("")}
                </div>
            </div>
            <div class="fh-ml-dr-foot">
                <span class="fh-ml-dr-foot-note">${escHTML(footNote)}</span>
                <span class="fh-ml-pager-spacer" style="flex:1"></span>
                ${kind !== "d-sides" ? `<button class="fh-ml-ghost-btn" data-act="meals-drawer-no-sides">No sides</button>` : ""}
                <button class="fh-bk-go-btn" data-act="meals-drawer-done-sides">Done ✓</button>
            </div>`;
    }

    else if (step === "confirm") {
        body = `
            <div class="fh-ml-confirm">
                <div class="fh-ml-confirm-icon">${dr.savedGlyph || "✓"}</div>
                <div class="fh-ml-confirm-msg">
                    <b>${escHTML(dr.savedName || "Dinner")}</b> is planned for ${escHTML(fmtDayLong(date))}.
                </div>
                <div class="fh-ml-confirm-sub">Keep going, or you're all set.</div>
                <div class="fh-ml-confirm-actions">
                    <button class="fh-bk-go-btn" data-act="meals-drawer-next-day">Plan the next open day ›</button>
                    <button class="fh-ml-ghost-btn" data-act="meals-close-drawer">Done for now</button>
                </div>
            </div>`;
    }

    return `
        <div class="fh-ml-scrim" data-act="meals-close-drawer"></div>
        <div class="fh-ml-drawer">
            ${head}
            ${body}
        </div>`;
}

// ---------------------------------------------------------------------------
// WHAT CAN WE MAKE (PANTRY) tab
// ---------------------------------------------------------------------------

function _renderPantry(card, plan, custom, customIng, favs, have) {
    const haveSet = new Set(have);
    const allIng  = getIngredients(customIng);

    const ingredientPanel = `
        <div class="fh-ml-panel">
            <div class="fh-ml-panel-hdr">
                What's in the kitchen?
                <small>~ tap everything you've got — proteins first, no typing ~</small>
            </div>
            <div class="fh-ml-ingscroll">
                ${ING_SECTIONS.map(([catId, label]) => {
                    const items = allIng.filter(i => i.cat === catId);
                    if (!items.length) return "";
                    return `
                        <div class="fh-ml-ing-sec-hdr">
                            <span class="fh-ml-gicon on">${(GROUPS[catId] || {}).icon || "•"}</span>
                            ${escHTML(label)}
                        </div>
                        <div class="fh-ml-ingrid">
                            ${items.map(ing => {
                                const on = haveSet.has(ing.id);
                                return `
                                    <div class="fh-ml-ing-chip${on ? " on" : ""}"
                                         data-act="meals-toggle-have" data-ing="${ing.id}">
                                        ${on ? `<span class="ck">✓</span>` : ""}
                                        <span class="fh-ml-ing-glyph">${ing.glyph}</span>
                                        <span class="fh-ml-ing-lbl">${escHTML(ing.label)}</span>
                                    </div>`;
                            }).join("")}
                        </div>`;
                }).join("")}
            </div>
        </div>`;

    const matches = allMeals(custom)
        .filter(m => m.types.includes("d") && !m.special)
        .map(m => ({ meal: m, hits: (m.ing || []).filter(i => haveSet.has(i)) }))
        .filter(x => x.hits.length > 0)
        .sort((a, b) =>
            b.hits.length - a.hits.length ||
            (favs.includes(b.meal.id) ? 1 : 0) - (favs.includes(a.meal.id) ? 1 : 0) ||
            a.meal.name.localeCompare(b.meal.name));

    const matchesHtml = haveSet.size === 0
        ? `<div class="fh-ml-empty-note">tap a few ingredients on the left<br>and dinner ideas show up here</div>`
        : matches.length === 0
            ? `<div class="fh-ml-empty-note">nothing matches yet — keep tapping</div>`
            : matches.map(({ meal, hits }) => {
                const allIng2 = getIngredients(customIng);
                return `
                    <div class="fh-ml-match-row"
                         data-act="meals-pantry-pick" data-meal="${meal.id}">
                        <span class="fh-ml-match-glyph">${meal.glyph}</span>
                        <div class="fh-ml-match-body">
                            <div class="fh-ml-match-name">${escHTML(meal.name)}${favs.includes(meal.id) ? " ♥" : ""}</div>
                            <div class="fh-ml-match-uses">
                                ${(meal.ing || []).map(id => {
                                    const ing = allIng2.find(x => x.id === id);
                                    if (!ing) return "";
                                    const hit = hits.includes(id);
                                    return `<span class="${hit ? "hit" : ""}">${hit ? "✓" : "·"}${escHTML(ing.label.toLowerCase())} </span>`;
                                }).join("")}
                            </div>
                        </div>
                        <button class="fh-ml-ghost-btn" style="min-height:38px;padding:6px 14px">＋ plan</button>
                    </div>`;
            }).join("");

    const matchPanel = `
        <div class="fh-ml-panel">
            <div class="fh-ml-panel-hdr">
                We could make…
                <small>~ best matches first · tap one to put it on a night ~</small>
            </div>
            <div class="fh-ml-matches">${matchesHtml}</div>
        </div>`;

    return `
        <div class="fh-ml-content">
            <div class="fh-ml-pantry">
                ${ingredientPanel}
                ${matchPanel}
            </div>
        </div>`;
}

// ---------------------------------------------------------------------------
// LIBRARY tab
// ---------------------------------------------------------------------------

function _renderLibrary(card, plan, custom, favs, recipes, have) {
    const typeFilter = card._mealsLibFilter || "all";
    const savedIds   = new Set(custom.map(c => c.id));

    const libMeals = allMeals(custom)
        .filter(m => !m.special)
        .filter(m => typeFilter === "all" ? true : m.types.includes(typeFilter))
        .sort((a, b) => {
            const fa = favs.includes(a.id) ? 0 : 1;
            const fb = favs.includes(b.id) ? 0 : 1;
            return fa - fb || a.name.localeCompare(b.name);
        });

    const filters = `
        <div class="fh-ml-libfilters">
            ${[["all","Everything"],["b","Breakfast"],["l","Lunch"],["d","Dinner"]].map(([v, lbl]) => `
                <button class="fh-ml-qchip${typeFilter === v ? " on" : ""}"
                        data-act="meals-lib-filter" data-filter="${v}">${lbl}</button>`).join("")}
            <span class="fh-ml-libhint">~ tap ♥ to keep family staples on top · 🌾 marks whole-grain meals · RECIPE opens the card ~</span>
        </div>`;

    const libGrid = `
        <div class="fh-ml-libgrid">
            ${libMeals.map(m => {
                const hasFav    = favs.includes(m.id);
                const hasRecipe = !!getRecipe(m, recipes);
                const wg        = mealWholeGrain(m, []);
                const act       = hasRecipe ? "meals-open-recipe"
                    : m.types.includes("d") ? "meals-lib-plan-meal"
                    : "";
                return `
                    <div class="fh-ml-mealcard fh-ml-libcard"
                         ${act ? `data-act="${act}" data-meal="${m.id}"` : ""}>
                        <button class="fh-ml-fav-btn${hasFav ? " on" : ""}"
                                data-act="meals-toggle-fav" data-meal="${m.id}"
                                style="pointer-events:auto">
                            ${hasFav ? "♥" : "♡"}
                        </button>
                        <span class="fh-ml-mealcard-glyph">${m.glyph}</span>
                        <span class="fh-ml-mealcard-name">${escHTML(m.name)}</span>
                        ${hasRecipe ? `<span class="fh-ml-rbadge">RECIPE</span>` : ""}
                        ${wg ? `<span class="fh-ml-wgbadge">🌾 whole grain</span>` : ""}
                    </div>`;
            }).join("")}
        </div>`;

    // Recipe Ideas shelf
    const ideas     = rankIdeas(have);
    const ideaShelf = `
        <div class="fh-ml-disc-hdr">
            ~ recipe ideas ~
            <small>RANKED BY WHAT'S ON HAND</small>
            <button class="fh-ml-disc-refresh" data-act="meals-ideas-refresh">↻ refresh</button>
        </div>
        ${have.length === 0
            ? `<div class="fh-ml-idea-hint">tip: tap what you have over in <b>What Can We Make</b> and these reorder around it</div>`
            : ""}
        <div class="fh-ml-discrow">
            ${ideas.map(({ idea, hits }) => {
                const saved = savedIds.has(idea.id);
                return `
                    <div class="fh-ml-mealcard fh-ml-disccard">
                        <span class="fh-ml-disc-area">${escHTML(idea.area || "")}</span>
                        <span class="fh-ml-mealcard-glyph">${idea.glyph}</span>
                        <span class="fh-ml-mealcard-name">${escHTML(idea.name)}</span>
                        ${hits.length ? `<span class="fh-ml-idea-uses">uses ${hits.length} you have</span>` : ""}
                        <button class="fh-ml-disc-save${saved ? " saved" : ""}"
                                ${saved ? "disabled" : `data-act="meals-save-idea" data-meal="${escAttr(idea.id)}"`}>
                            ${saved ? "In the library ✓" : "＋ Save to library"}
                        </button>
                    </div>`;
            }).join("")}
        </div>`;

    return `
        <div class="fh-ml-content">
            <div class="fh-ml-lib">
                ${filters}
                <div class="fh-ml-libscroll">
                    ${libGrid}
                    ${ideaShelf}
                </div>
            </div>
        </div>`;
}

// ---------------------------------------------------------------------------
// GROCERIES tab
// ---------------------------------------------------------------------------

function _renderGroceries(card, plan, custom, customIng, groc) {
    const t      = today();
    const weekKey = iso(t);
    const allIng  = getIngredients(customIng);

    // Aggregate ingredients from the next 7 days
    const need = {}; // ingId → { ing, sources:[] }
    for (let i = 0; i < 7; i++) {
        const d   = addDays(t, i);
        const e   = plan[iso(d)];
        if (!e) continue;
        const dow = DOW_SHORT[d.getDay()];
        const add = (ingIds, label) => {
            ingIds.forEach(id => {
                const ing = allIng.find(x => x.id === id);
                if (!ing) return;
                if (!need[id]) need[id] = { ing, sources: [] };
                if (need[id].sources.length < 2 && !need[id].sources.includes(label))
                    need[id].sources.push(label);
            });
        };
        ["b", "l"].forEach(slot => {
            const m = e[slot] ? mealById(e[slot], custom) : null;
            if (m && !m.special) add(m.ing || [], `${m.name} · ${dow}`);
        });
        if (e.d) {
            const m = mealById(e.d.main, custom);
            if (m && !m.special) add(mealIngredients(m, e.d), `${m.name} · ${dow}`);
            (e.d.sides || []).forEach(sid => {
                const s = sideById(sid);
                if (s) add(s.ing || [], `${s.name} · ${dow}`);
            });
        }
    }

    const byAisle = {};
    Object.values(need).forEach(item => {
        const aisle = item.ing.aisle;
        if (!byAisle[aisle]) byAisle[aisle] = [];
        byAisle[aisle].push(item);
    });
    Object.values(byAisle).forEach(list => list.sort((a, b) => a.ing.label.localeCompare(b.ing.label)));
    const aisleOrder = ["produce", "meat", "dairy", "bakery", "pantry"].filter(a => byAisle[a]);

    const total   = Object.keys(need).length;
    const checked = Object.keys(need).filter(id => groc[weekKey + ":" + id]).length;

    const listHtml = total === 0
        ? `<div class="fh-ml-empty-note">plan a few meals first — the list builds itself from the week's menu</div>`
        : `
            <div class="fh-ml-groc-cols">
                ${aisleOrder.map(aisle => `
                    <div class="fh-ml-groc-sec">
                        <div class="fh-ml-groc-sec-hdr">${escHTML(AISLES[aisle] || aisle)}</div>
                        ${byAisle[aisle].map(({ ing, sources }) => {
                            const key = weekKey + ":" + ing.id;
                            const ck  = !!groc[key];
                            return `
                                <div class="fh-ml-groc-row${ck ? " done" : ""}"
                                     data-act="meals-toggle-groc" data-key="${escAttr(key)}" data-checked="${!ck}">
                                    <span class="fh-ml-check">✓</span>
                                    <span class="fh-ml-groc-g">${ing.glyph}</span>
                                    <div class="fh-ml-groc-body">
                                        <div class="fh-ml-groc-lbl">${escHTML(ing.label)}</div>
                                        <div class="fh-ml-groc-from">${escHTML(sources.join("  ·  "))}</div>
                                    </div>
                                </div>`;
                        }).join("")}
                    </div>`).join("")}
            </div>`;

    return `
        <div class="fh-ml-content">
            <div class="fh-ml-groc">
                <div class="fh-ml-groc-head">
                    <span class="fh-ml-dayhdr-title">Shopping list</span>
                    <span class="fh-ml-dayhdr-sub">~ everything the next 7 days needs · ${checked} of ${total} in the cart ~</span>
                    <span class="fh-ml-pager-spacer"></span>
                    ${checked > 0
                        ? `<button class="fh-ml-ghost-btn" data-act="meals-reset-groc" data-weekkey="${weekKey}">Reset checks</button>`
                        : ""}
                </div>
                ${listHtml}
            </div>
        </div>`;
}

// ---------------------------------------------------------------------------
// RECIPE MODAL
// ---------------------------------------------------------------------------

function _renderRecipeModal(mealId, custom, recipes, plan) {
    const meal = mealById(mealId, custom);
    if (!meal) return "";
    const r = getRecipe(meal, recipes);
    if (!r) return "";

    return `
        <div class="fh-ml-modal-scrim" data-act="meals-close-recipe">
            <div class="fh-ml-modal" style="width:min(680px,90vw)">
                <div style="display:flex;align-items:center;gap:14px">
                    <span style="font-size:calc(2.4rem * var(--fh-text-scale,1));line-height:1">${meal.glyph}</span>
                    <div style="flex:1">
                        <div class="fh-ml-modal-title">${escHTML(meal.name)}</div>
                        <div class="fh-ml-recipe-meta">${escHTML(r.time)} · serves ${escHTML(String(r.serves))}</div>
                    </div>
                    <button class="fh-ml-xbtn" data-act="meals-close-recipe">✕</button>
                </div>
                <div class="fh-ml-recipe-cols">
                    <div>
                        <div class="fh-ml-recipe-h">~ what you need ~</div>
                        <ul class="fh-ml-recipe-ing">
                            ${(r.ingredients || []).map(s => `<li>${escHTML(s)}</li>`).join("")}
                        </ul>
                    </div>
                    <div>
                        <div class="fh-ml-recipe-h">~ how it goes ~</div>
                        <ol class="fh-ml-recipe-steps">
                            ${(r.steps || []).map(s => `<li>${escHTML(s)}</li>`).join("")}
                        </ol>
                    </div>
                </div>
                <div class="fh-ml-modal-actions">
                    ${meal.types.includes("d")
                        ? `<button class="fh-bk-go-btn" data-act="meals-recipe-plan" data-meal="${meal.id}">Plan this dinner</button>`
                        : ""}
                    <button class="fh-ml-ghost-btn" data-act="meals-close-recipe">Close</button>
                </div>
            </div>
        </div>`;
}

// ---------------------------------------------------------------------------
// DAY-PICK MODAL (pantry / library → pick a night)
// ---------------------------------------------------------------------------

function _renderDayPickModal(mealId, plan, custom) {
    const meal = mealById(mealId, custom);
    if (!meal) return "";
    const t    = today();
    const days = Array.from({ length: 7 }, (_, i) => addDays(t, i));

    return `
        <div class="fh-ml-modal-scrim" data-act="meals-close-daypick">
            <div class="fh-ml-modal" style="width:min(700px,92vw)">
                <div class="fh-ml-modal-title">
                    ${meal.glyph} ${escHTML(meal.name)}
                    <em>~ which night? ~</em>
                </div>
                <div class="fh-ml-daypick">
                    ${days.map(d => {
                        const k   = iso(d);
                        const e   = plan[k];
                        const cur = e && e.d ? mealById(e.d.main, custom) : null;
                        const lbl = k === iso(t)
                            ? "TONIGHT"
                            : DOW_SHORT[d.getDay()].toUpperCase() + " " + d.getDate();
                        return `
                            <div class="fh-ml-dpick" data-act="meals-daypick-pick" data-date="${k}" data-meal="${meal.id}">
                                <span class="fh-ml-dpick-dow">${lbl}</span>
                                ${cur
                                    ? `<span class="fh-ml-dpick-cur">${cur.glyph} ${escHTML(cur.name)}</span>`
                                    : `<span class="fh-ml-dpick-cur open">open</span>`}
                            </div>`;
                    }).join("")}
                </div>
                <div class="fh-ml-modal-actions">
                    <button class="fh-ml-ghost-btn" data-act="meals-close-daypick">Cancel</button>
                </div>
            </div>
        </div>`;
}

// ---------------------------------------------------------------------------
// Shared HTML helpers
// ---------------------------------------------------------------------------

function _plateDots(groups) {
    return `
        <div class="fh-ml-plate" title="Food groups on the plate">
            ${GROUP_ORDER.map(g => {
                const on = groups.includes(g);
                return `<span class="fh-ml-gicon${on ? " on" : ""}" title="${escAttr(GROUPS[g].label)}${on ? "" : " — not yet"}">${GROUPS[g].icon}</span>`;
            }).join("")}
        </div>`;
}

function _mealCardHtml(meal, isFav, actKey, dataAttrs, showPlate) {
    const dataStr = Object.entries(dataAttrs).map(([k, v]) => `data-${k}="${escAttr(v)}"`).join(" ");
    const groups  = showPlate ? (meal.groups || []) : [];
    return `
        <div class="fh-ml-mealcard" data-act="${actKey}" ${dataStr}>
            ${isFav ? `<span class="fh-ml-mealcard-fav">♥</span>` : ""}
            <span class="fh-ml-mealcard-glyph">${meal.glyph}</span>
            <span class="fh-ml-mealcard-name">${escHTML(meal.name)}</span>
            ${showPlate && groups.length ? _plateDots(groups) : ""}
        </div>`;
}

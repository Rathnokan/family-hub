/**
 * Family Hub Card — Theme Registry
 *
 * A "theme" controls the full personal-page experience for one person.
 * Separate from hub skins, which control the Command Center home page layout.
 *
 * Theme interface (each module must export an object matching this shape):
 *   key                {string}  — matches person.theme_key
 *   tint               {string}  — CSS color for home agent tile background gradient
 *   sigil              {string}  — single glyph watermark on home agent tile
 *   ranks              {Array}   — [{minXP, name}] rank ladder, ascending by minXP
 *   handlesNavigation  {bool}    — true if theme renders its own ← back button
 *   rankTitle(pts)     {fn}      — returns current rank name for a given XP total
 *   homeTileSubLabel(person) {fn} — returns the faction/role sub-label on the home tile
 *   render(card, person) {fn}    — renders the full person page (header + tabs + content)
 *
 * To add a theme: create a file in this directory and register it below.
 */

import { classicTheme }  from "./classic.js";
import { engineerTheme } from "./engineer.js";
import { bakerTheme }    from "./baker.js";
import { dinosTheme }    from "./dinos.js";
import { hpTheme }       from "./hp.js";
import { dbzTheme }      from "./dbz.js";

const THEMES = {
    classic:  classicTheme,
    engineer: engineerTheme,
    baker:    bakerTheme,
    dinos:    dinosTheme,
    hp:       hpTheme,
    dbz:      dbzTheme,
};

export function getTheme(key) {
    return THEMES[key] || THEMES.classic;
}

/**
 * Family Hub Card — Personal Dashboard Mode
 * Thin dispatcher: resolves the person's theme and delegates full-page rendering.
 * All rendering logic lives in themes/classic.js (and other theme modules).
 */

import { getTheme } from "./themes/index.js";

export function htmlPersonal(card) {
    const person = card._findPerson(card._viewPersonId || card._cfg.person);
    if (!person) {
        const name = card._viewPersonId || card._cfg.person || "(unknown)";
        return `<div class="fh-empty">Person "${name}" not found.<br>Check spelling in card config.</div>`;
    }
    return getTheme(person.theme_key || "classic").render(card, person);
}

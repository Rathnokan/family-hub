/**
 * Family Hub Card — Entry Point
 * Imports all modules, registers both custom elements, declares the card
 * to the Lovelace card picker, and logs the version banner to the console.
 *
 * esbuild bundles this file and all its imports into a single output:
 *   custom_components/family_hub/www/family-hub-card.js
 *
 * Run:  npm run build
 * Watch: npm run watch
 */

import { FamilyHubCard }       from "./card/FamilyHubCard.js";
import { FamilyHubCardEditor } from "./card/editor.js";
import { VERSION }             from "./card/constants.js";

// Register the card and its Lovelace visual editor
customElements.define("family-hub-card",        FamilyHubCard);
customElements.define("family-hub-card-editor", FamilyHubCardEditor);

// Declare to the Lovelace card picker
window.customCards = window.customCards || [];
window.customCards.push({
    type:         "family-hub-card",
    name:         "Family Hub",
    description:  "Family task management — command center, personal, maintenance, and admin views.",
    preview:      false,
    configurable: true,
});

// Version banner in browser dev console
console.info(
    `%c FAMILY-HUB-CARD %c v${VERSION} `,
    "background:#7F77DD;color:#fff;font-weight:700;border-radius:4px 0 0 4px",
    "background:#1c1c1e;color:#fff;font-weight:400;border-radius:0 4px 4px 0"
);
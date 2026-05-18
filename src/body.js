/**
 * Family Hub Card — Body bundle (v0.6.0 S11)
 *
 * The heavy implementation. Bundled separately from main.js (the stub) and
 * lazy-imported by the wrapper elements registered there. See main.js for
 * the rationale (cold-load race on Echo Show / Silk / mobile).
 *
 * Registers <family-hub-card-impl> and <family-hub-card-editor-impl> —
 * the wrappers in the stub create instances of these inside their own shadow
 * DOM once this bundle resolves.
 *
 * Build: esbuild bundles this into family-hub-card-body.js (ESM).
 */

import { FamilyHubCard }       from "./card/FamilyHubCard.js";
import { FamilyHubCardEditor } from "./card/editor.js";
import { VERSION }             from "./card/constants.js";

if (!customElements.get("family-hub-card-impl")) {
    customElements.define("family-hub-card-impl", FamilyHubCard);
}
if (!customElements.get("family-hub-card-editor-impl")) {
    customElements.define("family-hub-card-editor-impl", FamilyHubCardEditor);
}

console.info(
    `%c FAMILY-HUB-CARD %c v${VERSION} %c body loaded `,
    "background:#7F77DD;color:#fff;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px",
    "background:#1c1c1e;color:#fff;font-weight:400;padding:2px 6px",
    "background:#58D38A;color:#000;font-weight:600;border-radius:0 4px 4px 0;padding:2px 6px"
);

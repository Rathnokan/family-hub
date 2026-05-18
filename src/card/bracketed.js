/**
 * Family Hub Card — Corner-bracket panel helper
 *
 * Renders a panel with corner-frame decorations used throughout the v0.6.0 design.
 * Returns an HTML string — inject directly into template literals.
 *
 * Usage:
 *   bracketed(contentHTML)
 *   bracketed(contentHTML, { color: "#30d158", size: 14, padding: "16px" })
 *
 * Options:
 *   color   — corner accent color (default: var(--fh-accent))
 *   size    — corner arm length in px (default: 12)
 *   padding — inner padding CSS value (default: "12px 16px")
 *   class   — extra CSS class on the wrapper div
 *   style   — extra inline style on the wrapper div
 */
export function bracketed(content, opts = {}) {
    const {
        color   = "var(--fh-accent)",
        size    = 12,
        padding = "12px 16px",
        cls     = "",
        style   = "",
    } = opts;

    const w = `${size}px`;
    const h = `${size}px`;
    const t = "2px";

    const corner = (pos) => {
        const [v, h_] = pos.split("-");
        const vStyle  = v === "top"    ? "top:0"    : "bottom:0";
        const hStyle  = h_ === "left"  ? "left:0"   : "right:0";
        const bTop    = v === "top"    ? `border-top:${t} solid ${color}`    : `border-bottom:${t} solid ${color}`;
        const bSide   = h_ === "left"  ? `border-left:${t} solid ${color}`   : `border-right:${t} solid ${color}`;
        return `<span style="position:absolute;${vStyle};${hStyle};width:${w};height:${h};${bTop};${bSide};pointer-events:none"></span>`;
    };

    return `
      <div class="fh-bracketed ${cls}" style="position:relative;padding:${padding};${style}">
        ${corner("top-left")}${corner("top-right")}${corner("bottom-left")}${corner("bottom-right")}
        ${content}
      </div>`;
}

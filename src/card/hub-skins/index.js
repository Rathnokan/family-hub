/**
 * Family Hub Card — Hub Skin Registry
 *
 * A "hub skin" controls the layout and aesthetic of the Command Center home page
 * (the view with AGENTS, ROOMS, and TODAY strip). It is separate from per-person
 * themes, which control individual people's themed pages.
 *
 * To add a skin: create a new file in this directory and add an entry here.
 *
 * Skin selection priority (first defined wins):
 *   1. card._cfg.hub_skin  — Lovelace YAML config (per-device override)
 *   2. naAttr.hub_skin     — backend global setting (set from admin UI in v0.7+)
 *   3. "classic"           — default
 */

import { classicSkin } from "./classic.js";

const HUB_SKINS = {
    classic: classicSkin,
};

export function getHubSkin(key) {
    return HUB_SKINS[key] || HUB_SKINS.classic;
}

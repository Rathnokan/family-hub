"""Family Hub — MealsMixin (v0.8.0 Meals room).

Owns the `meals` section of the data store: the weekly meal plan, theme-night
rhythm, favourites, custom meals/ingredients, recipe cards, the "what we have"
pantry, and grocery check-offs. Mixed into FamilyHubDataStore; every method
operates on `self` (no behaviour change vs. the other domain mixins).

Design note — the backend stays *dumb about the meal library*. The full library
(MEALS / SIDES / PROTEINS) lives in the frontend `meals-data.js`; the card
resolves display strings (e.g. a taco's `variant: "with chicken"`) and passes
already-resolved fields to the services. The only library knowledge here is the
tiny theme-fill table in const.py, which `_apply_rhythm` needs to auto-populate
a pinned weekday's dinner.

Rhythm weekday keys use the prototype's **0 = Sunday** convention (see `_js_dow`).
"""

from __future__ import annotations

import logging
from datetime import date, timedelta
from typing import Any

from .const import (
    MEALS_HORIZON_DAYS,
    MEALS_PASTA_ROTATION,
    MEALS_PIZZA_ROTATION,
    MEALS_THEME_FILL,
)

_LOGGER = logging.getLogger(__name__)

_EPOCH = date(1970, 1, 1)


class MealsMixin:
    # ------------------------------------------------------------------
    # Accessors
    # ------------------------------------------------------------------

    def _meals(self) -> dict:
        """The live meals section (always present after _migrate_meals)."""
        return self._data.setdefault("meals", {})

    def get_meals_for_card(self) -> dict:
        """Full meals state for the websocket model / card. Returned verbatim;
        keys mirror the prototype (camelCase preserved)."""
        return self._meals()

    # ------------------------------------------------------------------
    # Date / rhythm helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _week_idx(d: date) -> int:
        """Stable weekly counter (matches the prototype's weekIdx)."""
        return ((d - _EPOCH).days + 4) // 7

    @staticmethod
    def _js_dow(d: date) -> int:
        """Weekday in the prototype's 0=Sunday convention (Python is 0=Monday)."""
        return (d.weekday() + 1) % 7

    def _theme_fill(self, theme_key: str, d: date) -> dict | None:
        """Dinner object for a pinned theme night on date `d`, or None."""
        fill = MEALS_THEME_FILL.get(theme_key)
        if not fill:
            return None
        w = self._week_idx(d)
        if theme_key == "pizza":
            return {
                "main": "pizza",
                "sides": list(fill["sides"]),
                "variant": MEALS_PIZZA_ROTATION[w % len(MEALS_PIZZA_ROTATION)],
                "via": "rhythm",
            }
        if theme_key == "leftovers":
            return {"main": "leftovers", "sides": [], "via": "rhythm"}
        if theme_key == "taco":
            return {"main": "taco-night", "sides": list(fill["sides"]), "via": "rhythm"}
        if theme_key == "pasta":
            main = MEALS_PASTA_ROTATION[w % len(MEALS_PASTA_ROTATION)]
            return {"main": main, "sides": list(fill["sides"]), "via": "rhythm"}
        return None

    def _apply_rhythm(self, plan: dict, rhythm: dict) -> None:
        """Re-run theme nights across the 30-day horizon, in place.

        Strips stale rhythm fills (a day auto-filled by a theme that's since
        changed/cleared), then fills empty future dinners whose weekday has a
        pinned theme — while respecting `noRhythm` (a day the parent cleared).
        Manual dinners (no `via: "rhythm"`) are never touched. Mirrors the
        prototype's applyRhythm so any hub surface reads a consistent plan.
        """
        today = date.today()
        for i in range(MEALS_HORIZON_DAYS):
            d = today + timedelta(days=i)
            k = d.isoformat()
            entry = plan.get(k) or {}
            theme_key = rhythm.get(str(self._js_dow(d)))

            cur = entry.get("d")
            if cur and cur.get("via") == "rhythm":
                still = self._theme_fill(theme_key, d) if theme_key else None
                if not still or still["main"] != cur["main"]:
                    entry.pop("d", None)

            if theme_key and not entry.get("d") and not entry.get("noRhythm"):
                entry["d"] = self._theme_fill(theme_key, d)

            if entry.get("b") or entry.get("l") or entry.get("d") or entry.get("noRhythm"):
                plan[k] = entry
            elif k in plan:
                del plan[k]

    def _horizon_bounds(self) -> tuple[date, date]:
        today = date.today()
        return today, today + timedelta(days=MEALS_HORIZON_DAYS - 1)

    # ------------------------------------------------------------------
    # Plan mutations (rhythm re-applied + persisted on every change)
    # ------------------------------------------------------------------

    async def async_meals_set_bl(
        self, date_iso: str, slot: str, meal_id: str | None,
        scope: str = "today", week_start: str = "Sunday",
    ) -> None:
        """Set (or clear, when meal_id is falsy) a breakfast/lunch slot. `scope`
        broadcasts the pick across today / this-week / two-weeks, clamped to the
        planning horizon."""
        if slot not in ("b", "l"):
            return
        d = date.fromisoformat(date_iso)
        today, horizon = self._horizon_bounds()
        if scope == "week":
            ws = 1 if week_start == "Monday" else 0
            start = d - timedelta(days=(self._js_dow(d) - ws + 7) % 7)
            dates = [start + timedelta(days=i) for i in range(7)]
        elif scope == "2weeks":
            dates = [d + timedelta(days=i) for i in range(14)]
        else:
            dates = [d]
        dates = [x for x in dates if today <= x <= horizon]

        meals = self._meals()
        plan = meals["plan"]
        for x in dates:
            k = x.isoformat()
            entry = plan.setdefault(k, {})
            if meal_id:
                entry[slot] = meal_id
            else:
                entry.pop(slot, None)
        self._apply_rhythm(plan, meals["rhythm"])
        await self.async_save()

    async def async_meals_set_dinner(
        self, date_iso: str, main: str, sides: list | None = None,
        protein: str | None = None, variant: str | None = None,
    ) -> None:
        """Set a day's dinner. The card resolves `variant` (pizza rotation or taco
        protein) and the chosen `protein` (for protein-flexible meals → flows to
        the grocery list)."""
        meals = self._meals()
        plan = meals["plan"]
        entry = plan.setdefault(date_iso, {})
        entry.pop("noRhythm", None)
        d: dict[str, Any] = {"main": main, "sides": list(sides or [])}
        if protein:
            d["protein"] = protein
        if variant:
            d["variant"] = variant
        entry["d"] = d
        self._apply_rhythm(plan, meals["rhythm"])
        await self.async_save()

    async def async_meals_set_dinner_sides(self, date_iso: str, sides: list) -> None:
        meals = self._meals()
        entry = meals["plan"].get(date_iso)
        if entry and entry.get("d"):
            entry["d"]["sides"] = list(sides or [])
            await self.async_save()

    async def async_meals_clear_dinner(self, date_iso: str) -> None:
        """Clear a day's dinner and block rhythm from refilling it."""
        meals = self._meals()
        plan = meals["plan"]
        entry = plan.setdefault(date_iso, {})
        entry.pop("d", None)
        entry["noRhythm"] = True
        self._apply_rhythm(plan, meals["rhythm"])
        await self.async_save()

    async def async_meals_clear_day(self, date_iso: str) -> None:
        meals = self._meals()
        plan = meals["plan"]
        plan[date_iso] = {"noRhythm": True}
        self._apply_rhythm(plan, meals["rhythm"])
        await self.async_save()

    async def async_meals_set_rhythm(self, weekday: int, theme_key: str | None) -> None:
        """Pin (or clear, when theme_key is falsy) a theme night on a weekday
        (0=Sunday). Auto-fills that weekday's dinner across the horizon."""
        meals = self._meals()
        rhythm = meals["rhythm"]
        if theme_key:
            rhythm[str(weekday)] = theme_key
        else:
            rhythm.pop(str(weekday), None)
        self._apply_rhythm(meals["plan"], rhythm)
        await self.async_save()

    # ------------------------------------------------------------------
    # Library: favourites / custom meals / ingredients / recipes
    # ------------------------------------------------------------------

    async def async_meals_toggle_fav(self, meal_id: str) -> None:
        meals = self._meals()
        favs = meals["favs"]
        if meal_id in favs:
            favs.remove(meal_id)
        else:
            favs.append(meal_id)
        await self.async_save()

    async def async_meals_add_custom_meal(self, meal: dict) -> None:
        """Add a meal to the library (admin-authored or saved from Recipe Ideas).
        Replace-or-append by id so re-saving is idempotent."""
        if not isinstance(meal, dict) or not meal.get("id"):
            return
        meals = self._meals()
        custom = meals["custom"]
        meals["custom"] = [m for m in custom if m.get("id") != meal["id"]] + [meal]
        await self.async_save()

    async def async_meals_remove_custom_meal(self, meal_id: str) -> None:
        """Remove a custom meal and scrub it from favourites + the plan."""
        meals = self._meals()
        meals["custom"] = [m for m in meals["custom"] if m.get("id") != meal_id]
        meals["favs"] = [f for f in meals["favs"] if f != meal_id]
        for entry in meals["plan"].values():
            if entry.get("d") and entry["d"].get("main") == meal_id:
                entry.pop("d", None)
            if entry.get("b") == meal_id:
                entry.pop("b", None)
            if entry.get("l") == meal_id:
                entry.pop("l", None)
        self._apply_rhythm(meals["plan"], meals["rhythm"])
        await self.async_save()

    async def async_meals_add_ingredient(self, ingredient: dict) -> None:
        if not isinstance(ingredient, dict) or not ingredient.get("id"):
            return
        meals = self._meals()
        ci = meals["customIng"]
        meals["customIng"] = [i for i in ci if i.get("id") != ingredient["id"]] + [ingredient]
        await self.async_save()

    async def async_meals_remove_ingredient(self, ingredient_id: str) -> None:
        meals = self._meals()
        meals["customIng"] = [i for i in meals["customIng"] if i.get("id") != ingredient_id]
        await self.async_save()

    async def async_meals_save_recipe(self, meal_id: str, recipe: dict) -> None:
        if not meal_id or not isinstance(recipe, dict):
            return
        self._meals()["recipes"][meal_id] = recipe
        await self.async_save()

    # ------------------------------------------------------------------
    # Pantry "what we have" + grocery check-offs
    # ------------------------------------------------------------------

    async def async_meals_toggle_have(self, ingredient_id: str) -> None:
        meals = self._meals()
        have = meals["have"]
        if ingredient_id in have:
            have.remove(ingredient_id)
        else:
            have.append(ingredient_id)
        await self.async_save()

    async def async_meals_toggle_grocery(self, key: str, checked: bool) -> None:
        meals = self._meals()
        groc = meals["groc"]
        if checked:
            groc[key] = True
        else:
            groc.pop(key, None)
        await self.async_save()

"""D1 lifecycle harness — drives MaintenanceMixin.async_maintenance_apply_seeds
and async_maintenance_update_home_profile against a fake store, with the thinnest
possible Home Assistant stubs. Validates the live acceptance criteria offline.
"""
import asyncio
import importlib.util
import os
import sys
import types
from datetime import date

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PKG = os.path.join(REPO, "custom_components", "family_hub")

# --- minimal Home Assistant stubs ------------------------------------------
ha = types.ModuleType("homeassistant"); ha.__path__ = []
core = types.ModuleType("homeassistant.core")
core.HomeAssistant = object
core.ServiceCall = object
helpers = types.ModuleType("homeassistant.helpers"); helpers.__path__ = []
storage = types.ModuleType("homeassistant.helpers.storage")
storage.Store = object
sys.modules.update({"homeassistant": ha, "homeassistant.core": core,
                    "homeassistant.helpers": helpers,
                    "homeassistant.helpers.storage": storage})

# --- import the integration modules as a package without running __init__ ---
fh = types.ModuleType("fh"); fh.__path__ = [PKG]
sys.modules["fh"] = fh


def load(name):
    spec = importlib.util.spec_from_file_location(f"fh.{name}", os.path.join(PKG, name + ".py"))
    mod = importlib.util.module_from_spec(spec)
    sys.modules[f"fh.{name}"] = mod
    spec.loader.exec_module(mod)
    return mod


load("const"); load("_store_helpers"); load("_maintenance_schedule"); load("seed_loader")
load("modules")
mm = load("maintenance_mixin")
cm = load("card_model")
sl = sys.modules["fh.seed_loader"]


class FakeHass:
    async def async_add_executor_job(self, fn, *a):
        return fn(*a)


class FakeStore(mm.MaintenanceMixin):
    def __init__(self):
        self._data = {
            "maintenance_tasks": [], "maintenance_products": [],
            "maintenance_completions": [], "maintenance_vendors": [],
            "maintenance_funds": [], "home_profile": sl.profile_defaults(),
        }
        self._hass = FakeHass()
        self._seed_library = {}
        self.saves = 0

    async def async_save(self):
        self.saves += 1

    # mirrors card_shaper_mixin exactly
    def get_maintenance_items_for_card(self):
        return self.get_maintenance_view()

    def get_maintenance_all_tasks_for_card(self):
        return cm.build_maintenance_all_tasks(self)


fails = []


def check(label, cond, detail=""):
    print(f"  {'PASS' if cond else 'FAIL'}  {label}" + ("" if cond else f"   {detail}"))
    if not cond:
        fails.append(label)


async def main():
    s = FakeStore()

    print("\n1. first apply against a blank profile")
    c = await s.async_maintenance_apply_seeds()
    check("adds the 56 universal tasks", c["added"] == 56, str(c))
    check("nothing disabled on a first run", c["disabled"] == 0, str(c))
    check("every task is enabled", all(t["enabled"] for t in s.maintenance_tasks))
    check("every task has a next_due", all(t["next_due"] for t in s.maintenance_tasks))
    check("all tasks are seed-sourced with a fingerprint",
          all(t["source"] == "seed" and t["seed_fingerprint"] for t in s.maintenance_tasks))

    print("\n2. idempotency")
    c2 = await s.async_maintenance_apply_seeds()
    check("a second apply is a complete no-op", c2 == {"added": 0, "reenabled": 0,
                                                      "disabled": 0, "refreshed": 0}, str(c2))
    check("task count unchanged", len(s.maintenance_tasks) == 56)

    print("\n3. products seeded untracked and linked both ways")
    prods = s.maintenance_products
    check("product stubs were created", len(prods) > 20, f"{len(prods)} products")
    check("all seeded products are untracked (threshold 0, so never OUT)",
          all(p["low_stock_threshold"] == 0 for p in prods))
    check("all seeded products carry source/seed_id",
          all(p["source"] == "seed" and p["seed_id"] for p in prods))
    check("every product links back to at least one task",
          all(p["linked_task_ids"] for p in prods))
    linked = {pid for t in s.maintenance_tasks for pid in t["product_ids"]}
    check("task product_ids resolve to real product records",
          linked == {p["id"] for p in prods if p["linked_task_ids"]},
          f"{len(linked)} referenced")

    print("\n4. turning the profile on — pool + tankless + evap_cooler")
    await s.async_maintenance_update_home_profile(
        pool=True, water_heater_type="tankless", evap_cooler=True)
    check("now 65 tasks", len(s.maintenance_tasks) == 65, str(len(s.maintenance_tasks)))
    enabled = [t for t in s.maintenance_tasks if t["enabled"]]
    check("all 65 enabled", len(enabled) == 65)
    names = {t["seed_id"] for t in enabled}
    check("the pool task is in", "pool_service_annual" in names)
    check("tankless descale is in", "tankless_descale_flush" in names)
    check("no tank-water-heater task appeared", "water_heater_flush" not in names)

    tless = next(t for t in s.maintenance_tasks if t["seed_id"] == "tankless_descale_flush")
    check("tankless descale took the Tucson 6-month override",
          tless["recurrence"] == {"interval": 6, "unit": "months"}, str(tless["recurrence"]))
    check("its climate note came across", "TUCSON RULE" in tless["climate_note"])

    gut = next((t for t in s.maintenance_tasks if t["seed_id"] == "gutter_clean"), None)
    check("gutter_clean is absent (no gutters answered)", gut is None)

    print("\n5. a completion, then a profile toggle OFF")
    pool = next(t for t in s.maintenance_tasks if t["seed_id"] == "pool_service_annual")
    await s.async_maintenance_complete_task(pool["id"], actual_cost=250, notes="spring service")
    check("completion recorded", len(s.maintenance_completions) == 1)
    due_after_completion = pool["next_due"]

    await s.async_maintenance_update_home_profile(pool=False)
    check("the pool task is disabled, not deleted", pool["enabled"] is False)
    check("it still exists in the collection",
          any(t["id"] == pool["id"] for t in s.maintenance_tasks))
    check("it carries a human reason",
          pool["disabled_reason"] == "no pool at this home", pool["disabled_reason"])
    check("its completion history survives", len(s.maintenance_completions) == 1)
    check("its next_due is untouched", pool["next_due"] == due_after_completion)
    check("nothing else was disabled",
          sum(1 for t in s.maintenance_tasks if not t["enabled"]) == 1)

    print("\n6. toggling it back ON re-enables (the A4 bug this fixes)")
    c3 = await s.async_maintenance_update_home_profile(pool=True)
    check("the pool task is enabled again", pool["enabled"] is True)
    check("the reason line is cleared", pool["disabled_reason"] == "")
    check("no duplicate task was created",
          sum(1 for t in s.maintenance_tasks if t["seed_id"] == "pool_service_annual") == 1)
    check("its completion history is still intact", len(s.maintenance_completions) == 1)
    check("its schedule is still where the completion left it",
          pool["next_due"] == due_after_completion)

    print("\n7. calendar anchors landed on real dates")
    anchored = [t for t in s.maintenance_tasks if t["schedule_mode"] == "calendar_anchored"]
    check("anchored tasks exist", len(anchored) > 20, str(len(anchored)))
    check("every anchored task has a LIST anchor",
          all(isinstance(t["seasonal_anchor"], list) and t["seasonal_anchor"] for t in anchored))
    check("every anchored next_due matches one of its own anchors",
          all(any(date.fromisoformat(t["next_due"]).month == a["month"]
                  and date.fromisoformat(t["next_due"]).day == a["day"]
                  for a in t["seasonal_anchor"]) for t in anchored))
    on_the_first = [t for t in anchored
                    if date.fromisoformat(t["next_due"]).day == 1
                    and all(a["day"] == 1 for a in t["seasonal_anchor"])]
    check("day-1 landings only happen where the library named a month",
          all("season" not in (t["seasonal_note"] or "").lower()
              or any(m in (t["seasonal_note"] or "").lower() for m in
                     ("january", "february", "march", "april", "may", "june", "july",
                      "august", "september", "october", "november", "december"))
              for t in on_the_first))
    roof = next(t for t in s.maintenance_tasks if t["seed_id"] == "roof_inspection")
    check("roof inspection anchors to Oct 1 (post-monsoon), not Spring",
          date.fromisoformat(roof["next_due"]).month == 10, roof["next_due"])
    check("its prose anchor is preserved for the UI",
          roof["seasonal_note"] == "October (post-monsoon)", roof["seasonal_note"])

    print("\n8. climate preset change refreshes untouched tasks only")
    edited = next(t for t in s.maintenance_tasks if t["seed_id"] == "gutter_clean_x") \
        if False else next(t for t in s.maintenance_tasks if t["seed_id"] == "hvac_filter_check")
    await s.async_maintenance_update_task(edited["id"], recurrence={"interval": 2, "unit": "months"})
    await s.async_maintenance_update_home_profile(climate_preset="temperate")
    check("the hand-edited task kept the user's cadence",
          edited["recurrence"] == {"interval": 2, "unit": "months"}, str(edited["recurrence"]))
    check("the untouched tankless task fell back to 12 months",
          tless["recurrence"] == {"interval": 12, "unit": "months"}, str(tless["recurrence"]))
    check("the evap tasks were disabled by the climate gate",
          all(not t["enabled"] and t["disabled_reason"] == "not applicable in this climate"
              for t in s.maintenance_tasks if t["seed_id"].startswith("evap_")))

    await s.async_maintenance_update_home_profile(climate_preset="desert_southwest")
    check("switching back re-enables the evap tasks",
          all(t["enabled"] for t in s.maintenance_tasks if t["seed_id"].startswith("evap_")))
    check("and restores the 6-month tankless cadence",
          tless["recurrence"] == {"interval": 6, "unit": "months"}, str(tless["recurrence"]))

    print("\n8b. a manually-disabled task is never resurrected")
    manual = next(t for t in s.maintenance_tasks if t["seed_id"] == "kitchen_disposal_freshen")
    await s.async_maintenance_update_task(manual["id"], enabled=False)
    check("no disabled_reason on a manual switch-off", manual["disabled_reason"] == "")
    await s.async_maintenance_update_home_profile(gutters=True)
    check("the manually-disabled task stayed off", manual["enabled"] is False)
    check("but the profile edit still did its job (gutter tasks arrived)",
          any(t["seed_id"] == "gutter_clean" and t["enabled"] for t in s.maintenance_tasks))
    await s.async_maintenance_update_task(manual["id"], enabled=True)
    await s.async_maintenance_update_home_profile(gutters=False)

    print("\n9. est_cost_pro null survives the round trip")
    nulls = [t for t in s.maintenance_tasks if t["est_cost_pro"] is None]
    check("some tasks carry a null pro cost (never hired out)", len(nulls) > 20, str(len(nulls)))
    check("no task has a 0.0 pro cost where the library said null",
          not any(t["est_cost_pro"] == 0.0 and t["seed_id"] in
                  {x["task_id"] for x in sl.library_tasks(s._seed_library)
                   if x.get("est_cost_pro") is None}
                  for t in s.maintenance_tasks))

    print("\n10. card model payload")
    import json
    await s.async_maintenance_update_home_profile(pool=False)   # one disabled task
    p = cm.build_maintenance_due_payload(s)
    for key in ("overdue", "due_this_week", "due_next_week", "next_item",
                "next_due_date", "next_due_days"):
        check(f"frozen scalar '{key}' still present", key in p)
    FROZEN = {"task_id", "chore_id", "name", "description", "category_label",
              "due_date", "days_delta", "assigned_to", "person_name", "person_color"}
    check("items still carries the frozen A4 key set",
          all(FROZEN <= set(i) for i in p["items"]))
    n_disabled = sum(1 for t in p["all_tasks"] if not t["enabled"])
    check("items excludes disabled tasks; all_tasks includes them",
          n_disabled > 0 and len(p["items"]) == len(p["all_tasks"]) - n_disabled,
          f"{len(p['items'])} items, {len(p['all_tasks'])} all, {n_disabled} disabled")
    check("the disabled task is search-reachable with its reason",
          any(not t["enabled"] and t["disabled_reason"] == "no pool at this home"
              for t in p["all_tasks"]))
    check("all_tasks carries every task including disabled ones",
          len(p["all_tasks"]) == len(s.maintenance_tasks), str(len(p["all_tasks"])))
    check("disabled tasks reach the card with their reason",
          all(t["disabled_reason"] for t in p["all_tasks"] if not t["enabled"]))
    check("category counts cover every task",
          sum(p["categories"].values()) == len(p["all_tasks"]), str(p["categories"]))
    check("cadence labels read naturally",
          {"every week", "every year", "every 6 months"} <= {t["cadence_label"] for t in p["all_tasks"]},
          str(sorted({t["cadence_label"] for t in p["all_tasks"]})))
    check("assets are profile-gated (tankless present, tank absent)",
          {a["asset_id"] for a in p["assets"]} >= {"wh_tankless"}
          and "wh_tank" not in {a["asset_id"] for a in p["assets"]},
          str(sorted(a["asset_id"] for a in p["assets"])))
    check("profile is exposed for the room", p["profile"]["climate_preset"] == "desert_southwest")
    check("completions are newest-first",
          [c["date"] for c in p["completions"]] == sorted(
              [c["date"] for c in p["completions"]], reverse=True))
    check("products reach the card", len(p["products"]) > 20)
    size = len(json.dumps(p))
    print(f"        payload size: {size / 1024:.1f} KB "
          f"(all_tasks {len(json.dumps(p['all_tasks'])) / 1024:.1f} KB)")
    check("payload is a sane size for the websocket model", size < 200_000, f"{size} bytes")
    check("the whole payload is JSON-serialisable", isinstance(json.dumps(p), str))

    print("\n" + "=" * 62)
    print("ALL CHECKS PASSED" if not fails else f"{len(fails)} FAILURE(S)")
    for f in fails:
        print("  -", f)
    return 1 if fails else 0


sys.exit(asyncio.run(main()))

"""D1 offline harness — exercises the pure seed-loader + schedule logic with no HA.

Loads seed_loader.py and _maintenance_schedule.py by path so the package __init__
(which imports Home Assistant) never runs.
"""
import importlib.util
import json
import os
import sys
from datetime import date

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PKG = os.path.join(REPO, "custom_components", "family_hub")


def load(name):
    spec = importlib.util.spec_from_file_location(name, os.path.join(PKG, name + ".py"))
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


sl = load("seed_loader")
ms = load("_maintenance_schedule")

LIB = json.load(open(os.path.join(PKG, "seed_library.json"), encoding="utf-8"))
TASKS = LIB["tasks"]
ASSETS = LIB["big_ticket_assets"]

fails = []


def check(label, cond, detail=""):
    if cond:
        print(f"  PASS  {label}")
    else:
        print(f"  FAIL  {label}  {detail}")
        fails.append(label)


# ---------------------------------------------------------------------------
print("\n1. seasonal_anchor parsing — every distinct string in the library")
# ---------------------------------------------------------------------------
EXPECTED = {
    "April & October":                                  [(4, 1), (10, 1)],
    "April & October (pair with clock/battery habits)": [(4, 1), (10, 1)],
    "January / April / July / October":                 [(1, 1), (4, 1), (7, 1), (10, 1)],
    "June (pre-monsoon) & October (post-monsoon)":      [(6, 1), (10, 1)],
    "March-April (pre-cooling)":                        [(3, 1)],
    "September-October (pre-heating)":                  [(9, 1)],
    "April-May (pre-heat)":                             [(4, 1)],
    "April-May (at startup); repeat mid-season if mineral-crusted": [(4, 1)],
    "May-June (pre-monsoon)":                           [(5, 1)],
    "May-September (cooling season)":                   [(5, 1)],
    "October (post-monsoon)":                           [(10, 1)],
    "October (start of heating season)":                [(10, 1)],
    "October (end of cooling season)":                  [(10, 1)],
    "July (mid-season)":                                [(7, 1)],
    "Spring":                                           [(3, 20)],
    "Spring (swarm season)":                            [(3, 20)],
    "Spring startup":                                   [(3, 20)],
    "Summer":                                           [(6, 21)],
    "Fall":                                             [(9, 22)],
    "Late winter (dormant)":                            [(2, 15)],
    "Late spring":                                      [(5, 15)],
    "Winter (closed-house conditions give the most conservative reading)": [(12, 21)],
    "Growing season":                                   None,
    "Watering season":                                  None,
}

seen = set()
for t in TASKS:
    for a in (t.get("seasonal_anchor"),
              ((t.get("climate_overrides") or {}).get("desert_southwest") or {}).get("seasonal_anchor")):
        if isinstance(a, str):
            seen.add(a)

check("every library anchor string is covered by the expectation table",
      seen == set(EXPECTED), f"unexpected={seen - set(EXPECTED)} missing={set(EXPECTED) - seen}")

for raw, want in EXPECTED.items():
    got = sl.parse_seasonal_anchor(raw)
    got_t = [(a["month"], a["day"]) for a in got] if got else None
    check(f"anchor {raw[:46]!r}", got_t == want, f"got {got_t}, want {want}")


# ---------------------------------------------------------------------------
print("\n2. applicability gating — pool + tankless + evap_cooler")
# ---------------------------------------------------------------------------
PROFILE = {"pool": True, "water_heater_type": "tankless", "evap_cooler": True}

blank = sl.applicable_seeds(TASKS, {})
check("a blank profile seeds only the 56 universal tasks", len(blank) == 56, f"got {len(blank)}")
check("no blank-profile task carries an applicability tag",
      all(not (s.get("applicability") or []) for s in blank))

seeds = sl.applicable_seeds(TASKS, PROFILE)
ids = {s["task_id"] for s in seeds}
check("pool+tankless+evap seeds 56 + 1 + 4 + 4 = 65 tasks", len(seeds) == 65, f"got {len(seeds)}")

tagged = {}
for s in TASKS:
    for tag in (s.get("applicability") or []):
        tagged.setdefault(tag, set()).add(s["task_id"])

for tag in ("pool", "tankless_water_heater", "evap_cooler"):
    check(f"all {tag} tasks present", tagged[tag] <= ids, f"missing {tagged[tag] - ids}")
for tag in ("tank_water_heater", "softener", "septic", "well_water", "gutters",
            "carpet", "lawn", "irrigation", "sump_pump", "generator",
            "humidifier", "mini_split", "fireplace", "gas_service", "ro",
            "stone_counters", "tile_surfaces", "wood_deck", "wood_fence"):
    check(f"no {tag} task leaked in", not (tagged[tag] & ids), f"leaked {tagged[tag] & ids}")

# gas_service derivation
check("gas_service derives False from a blank profile",
      not sl.applicable_seeds(TASKS, {}) or not (tagged["gas_service"] & {s["task_id"] for s in blank}))
gas_ids = {s["task_id"] for s in sl.applicable_seeds(TASKS, {"dryer_fuel": "gas"})}
check("a gas dryer resolves gas_service", tagged["gas_service"] <= gas_ids)
off_ids = {s["task_id"] for s in sl.applicable_seeds(TASKS, {"dryer_fuel": "gas", "gas_service": False})}
check("an explicit gas_service:false overrides the derivation", not (tagged["gas_service"] & off_ids))

# climate gate
temperate = {s["task_id"] for s in sl.applicable_seeds(TASKS, {**PROFILE, "climate_preset": "temperate"})}
check("evap tasks are hidden under a non-desert preset even with evap_cooler on",
      not (tagged["evap_cooler"] & temperate), f"leaked {tagged['evap_cooler'] & temperate}")

# unknown tag fails closed
check("an unknown applicability tag fails closed",
      not sl.seed_applies({"applicability": ["flux_capacitor"]}, sl.normalize_profile({})))

# disable reasons
pool_seed = next(s for s in TASKS if "pool" in (s.get("applicability") or []))
check("pool disable reason reads naturally",
      sl.disable_reason(pool_seed, {}) == "no pool at this home",
      sl.disable_reason(pool_seed, {}))


# ---------------------------------------------------------------------------
print("\n3. calendar_anchored tasks land on a real anchor")
# ---------------------------------------------------------------------------
TODAY = date(2026, 8, 25)
season_days = {(3, 20), (6, 21), (9, 22), (12, 21), (2, 15), (5, 15)}
anchored = 0
for s in TASKS:
    fields = sl.seed_to_task_fields(s, PROFILE)
    if fields["schedule_mode"] != "calendar_anchored":
        continue
    anchored += 1
    nd = ms.initial_next_due(fields, TODAY)
    want = {(a["month"], a["day"]) for a in fields["seasonal_anchor"]}
    check(f"{s['task_id'][:36]} lands on an anchor -> {nd}",
          (nd.month, nd.day) in want and nd > TODAY, f"anchors {sorted(want)}")

check("31 library calendar_anchored tasks, 30 keep the mode (1 has a null anchor)",
      anchored == 30, f"got {anchored}")

fx = next(s for s in TASKS if s["task_id"] == "fire_extinguisher_pro_service")
check("the null-anchor calendar task downgrades to from_completion instead of the 1st",
      sl.seed_to_task_fields(fx, PROFILE)["schedule_mode"] == "from_completion")

seasonal = [s for s in TASKS
            if isinstance(s.get("seasonal_anchor"), str)
            and s.get("schedule_mode") == "calendar_anchored"
            and (sl.parse_seasonal_anchor(s["seasonal_anchor"]) or [{}])[0].get("day") != 1]
check("season-derived anchors never land on the 1st",
      all((a["month"], a["day"]) in season_days
          for s in seasonal for a in sl.parse_seasonal_anchor(s["seasonal_anchor"])),
      f"{len(seasonal)} season-derived tasks")


# ---------------------------------------------------------------------------
print("\n4. multi-anchor cadence")
# ---------------------------------------------------------------------------
gutter = next(s for s in TASKS if s["task_id"] == "gutter_clean")
gf = sl.seed_to_task_fields(gutter, PROFILE)
check("gutter_clean adopts the desert override anchor (Jun & Oct, not Apr & Oct)",
      [(a["month"], a["day"]) for a in gf["seasonal_anchor"]] == [(6, 1), (10, 1)],
      str(gf["seasonal_anchor"]))
walk = [ms.initial_next_due(gf, TODAY)]
for _ in range(3):
    walk.append(ms.compute_next_due(gf, walk[-1]))
check("gutter_clean alternates Oct 1 -> Jun 1 -> Oct 1 -> Jun 1 (4 and 8 months apart)",
      [(d.month, d.day) for d in walk] == [(10, 1), (6, 1), (10, 1), (6, 1)], str(walk))

irr = sl.seed_to_task_fields(next(s for s in TASKS if s["task_id"] == "irrigation_controller_adjust"), PROFILE)
qwalk = [ms.initial_next_due(irr, TODAY)]
for _ in range(3):
    qwalk.append(ms.compute_next_due(irr, qwalk[-1]))
check("irrigation controller steps Oct -> Jan -> Apr -> Jul",
      [d.month for d in qwalk] == [10, 1, 4, 7], str(qwalk))

caulk = sl.seed_to_task_fields(next(s for s in TASKS if s["task_id"] == "exterior_caulk_seal_inspect"), PROFILE)
cwalk = [ms.initial_next_due(caulk, TODAY)]
for _ in range(2):
    cwalk.append(ms.compute_next_due(caulk, cwalk[-1]))
check("April & October alternates on a 6-month rhythm",
      [d.month for d in cwalk] == [10, 4, 10], str(cwalk))

# single-anchor behaviour is unchanged
radon = sl.seed_to_task_fields(next(s for s in TASKS if s["task_id"] == "radon_test"), PROFILE)
r1 = ms.initial_next_due(radon, TODAY)
r2 = ms.compute_next_due(radon, r1)
check("single anchor still honours a multi-year interval (radon, 2 years)",
      (r1.month, r1.day) == (12, 21) and r2.year - r1.year == 2, f"{r1} -> {r2}")
legacy = {"schedule_mode": "calendar_anchored", "recurrence": {"interval": 1, "unit": "months"},
          "seasonal_anchor": {"month": None, "day": 15}}
check("legacy dict anchor (migrated monthly_on_date) still works",
      ms.initial_next_due(legacy, TODAY).day == 15)


# ---------------------------------------------------------------------------
print("\n5. climate overrides")
# ---------------------------------------------------------------------------
tankless = next(s for s in TASKS if s["task_id"] == "tankless_descale_flush")
desert = sl.seed_to_task_fields(tankless, PROFILE)
other = sl.seed_to_task_fields(tankless, {**PROFILE, "climate_preset": "temperate"})
check("tankless descale is 6 months under desert_southwest",
      desert["recurrence"] == {"interval": 6, "unit": "months"}, str(desert["recurrence"]))
check("tankless descale is 12 months under any other preset",
      other["recurrence"] == {"interval": 12, "unit": "months"}, str(other["recurrence"]))
check("the override note is carried as climate_note", "TUCSON RULE" in desert["climate_note"])
check("no climate_note under a different preset", not other["climate_note"])

roof = sl.seed_to_task_fields(next(s for s in TASKS if s["task_id"] == "roof_inspection"), PROFILE)
check("roof inspection anchors to October (post-monsoon), not generic Spring",
      [(a["month"], a["day"]) for a in roof["seasonal_anchor"]] == [(10, 1)], str(roof["seasonal_anchor"]))

overridden = [s for s in TASKS if (s.get("climate_overrides") or {}).get("desert_southwest")]
check("all 11 climate-override tasks resolve", len(overridden) == 11, f"got {len(overridden)}")


# ---------------------------------------------------------------------------
print("\n6. costs, products, assets, fingerprint")
# ---------------------------------------------------------------------------
null_pro = [s for s in TASKS if s.get("est_cost_pro") is None]
check("est_cost_pro:null survives the mapping as None (never 0)",
      all(sl.seed_to_task_fields(s, PROFILE)["est_cost_pro"] is None for s in null_pro),
      f"{len(null_pro)} tasks priced null")

prods = sl.products_for_seeds(seeds)
check("seeded products index is non-empty and links back to tasks", len(prods) > 20, f"{len(prods)} products")
check("product display names read properly",
      sl.product_display_name("hvac_filter") == "HVAC filter"
      and sl.product_display_name("softener_salt") == "Softener salt")

a_blank = {a["asset_id"] for a in sl.applicable_assets(ASSETS, {})}
a_prof = {a["asset_id"] for a in sl.applicable_assets(ASSETS, PROFILE)}
check("a blank profile shows only the 5 universal assets", len(a_blank) == 5, str(sorted(a_blank)))
check("tankless profile shows wh_tankless, not wh_tank or expansion_tank",
      "wh_tankless" in a_prof and "wh_tank" not in a_prof and "expansion_tank" not in a_prof,
      str(sorted(a_prof)))
check("garage springs ship with fund accrual off (double-count guard)",
      next(a for a in sl.applicable_assets(ASSETS, PROFILE)
           if a["asset_id"] == "garage_door_springs")["accrual_default"] is False)

f1 = sl.seed_fingerprint(sl.seed_to_task_fields(tankless, PROFILE))
f2 = sl.seed_fingerprint(sl.seed_to_task_fields(tankless, {**PROFILE, "climate_preset": "temperate"}))
check("fingerprint changes when the climate preset changes the schedule", f1 != f2)
check("fingerprint is stable for the same inputs",
      f1 == sl.seed_fingerprint(sl.seed_to_task_fields(tankless, PROFILE)))


# ---------------------------------------------------------------------------
print("\n7. profile defaults")
# ---------------------------------------------------------------------------
d = sl.profile_defaults()
check("every presence field defaults False", all(d[f] is False for f in sl.PRESENCE_FIELDS))
check("water_heater_type defaults unanswered", d["water_heater_type"] is None)
check("water_source defaults municipal", d["water_source"] == "municipal")
check("climate preset defaults desert_southwest", d["climate_preset"] == "desert_southwest")
check("inflation rate defaults 4.0", d["inflation_rate"] == 4.0)
check("normalize_profile never overwrites an explicit False",
      sl.normalize_profile({"pool": False, "softener": True})["softener"] is True)
check("every applicability tag in the library has a predicate",
      set(tagged) <= set(sl._TAG_PREDICATES), f"unmapped {set(tagged) - set(sl._TAG_PREDICATES)}")

print("\n" + "=" * 62)
print(f"{'ALL CHECKS PASSED' if not fails else str(len(fails)) + ' FAILURE(S)'}")
for f in fails:
    print("  -", f)
sys.exit(1 if fails else 0)

# tests

Plain-Python regression harnesses. **No pytest, no Home Assistant install** — each
file is a script you run directly, prints one line per check, and exits non-zero on
failure. They import the integration modules **by file path** with a stub
`homeassistant` module, so the package `__init__` (which imports HA for real) never
runs.

```bash
python tests/test_d1_seed_loader.py
python tests/test_d1_lifecycle.py
```

Not wired into CI yet — CI still runs compile + `ruff --select E9,F63,F7,F82` only.
Adding these is a one-line step in `.github/workflows/ci.yml` whenever you want it.

| File | Covers | Checks |
|---|---|---|
| `test_d1_seed_loader.py` | Pure seed-loader logic: every distinct `seasonal_anchor` string in the library, applicability + climate gating, `gas_service` derivation, fail-closed unknown tags, calendar anchors landing on real dates, multi-anchor cadence, climate overrides, asset gating, `est_cost_pro: null`, profile defaults. | 117 |
| `test_d1_lifecycle.py` | `MaintenanceMixin` against a fake store: first apply, idempotency, product stubs, profile toggle on/off/on, completion survival, manual-disable protection, climate-preset refresh, and the card-model payload shape. | 68 |

Both read the real `custom_components/family_hub/seed_library.json`, so a library
edit that breaks an assumption fails here rather than on the family's dashboard.

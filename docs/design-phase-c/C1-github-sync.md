repo: Rathnokan/family-hub
branch: main

## Last sync
date: 2026-07-26T15:53:09Z

### Updated in this project
- Read the current admin shell (sidebar + bottom nav, 7 sections) and its CSS to ground the IA rethink.
- Drew wireframes for a new admin IA: Today / Modules / Hub / System, with module-off handling.
- Specified the Home Maintenance admin area (Home Profile, Task Library, Vendors, Funds, Notifications).

## Screen map
| Project screen | Built from repo files |
|---|---|
| Admin IA Wireframes.dc.html — nav shells (1a, 1b) | src/card/modes-admin.js (htmlAdmin shell + sections list), src/card/css/part4.js (.fh-ad-shell / sidebar / bottom-nav / topbar) |
| Admin IA Wireframes.dc.html — module off (1c) | custom_components/family_hub/modules.py (MODULES registry, enabled_modules), src/card/modes-admin.js (modOn gating) |
| Admin IA Wireframes.dc.html — System settings (1d) | src/card/modes-admin.js (_htmlAdSettings, _htmlAdFamily), custom_components/family_hub/services.py surface via README services table |
| Admin IA Wireframes.dc.html — Hub / Display (1e) | src/card/modes-admin.js (_htmlAdSettings hub-layout panel), src/card/css/part4.js (.fh-hub-room-row), src/card/rooms/index.js (ROOMS) |
| Admin IA Wireframes.dc.html — Home Care library + funds (1f, 1g) | docs/research-phase-b/home-maintenance-module-scope.md (§3.1–3.6, §5, §6, §8, §9) |
| Admin IA Wireframes.dc.html — phone set (1h) | src/card/css/part4.js (.fh-ad-bottom-nav breakpoints) |

## Notes
- Wireframes use the newer FH theme tokens the user supplied (bg #0d0f14, surface #171a21, border #262b36, accent #7f77dd), not the older admin palette still in css/part4.js (#0E1622 / #5B8DEF).
- Local copies under src/ and custom_components/ are read-only reference imports, not part of the design output.

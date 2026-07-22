"""
Family Hub — versioned data migrators (v0.8.0).

Stepwise forward migrators for the family-DATA schema (see const.DATA_SCHEMA_VERSION).
These run on IMPORT of an exported data file whose schema is older than the
current one — each migrator transforms a whole ``data`` dict from version N to
version N+1.

Scope discipline (do not blur these):
  • STRUCTURAL changes (a collection renamed/moved/reshaped between releases)
    → add a MIGRATORS[N] entry here and bump DATA_SCHEMA_VERSION.
  • ADDITIVE field changes (a new optional field) → NOT here. Those stay in
    data_store._migrate_records as idempotent setdefault forward-fills, which
    run on every load AND after every import, so a migrated dict is always
    brought fully up to date afterward regardless.

MIGRATORS is empty today: v3 is the first stamped schema, so there is nothing
yet to migrate FROM. The first structural change in a future release adds
MIGRATORS[3] (3 → 4) and bumps DATA_SCHEMA_VERSION to 4.
"""

from __future__ import annotations

import logging
from typing import Callable

from .const import DATA_SCHEMA_VERSION

_LOGGER = logging.getLogger(__name__)

# MIGRATORS[N](data) -> data, transforming a version-N dict into a version-(N+1)
# dict. Keyed by the FROM version.
MIGRATORS: dict[int, Callable[[dict], dict]] = {}


def migrate_to_current(data: dict, from_version: int) -> dict:
    """Apply stepwise migrators until ``data`` is at DATA_SCHEMA_VERSION.

    Returns the migrated dict (migrators may mutate in place and/or return a new
    dict — always use the return value). Raises KeyError for the first missing
    migrator in the chain, which the caller treats as "cannot import this file".
    Newer-than-current data must be rejected by the caller BEFORE calling this.
    """
    version = from_version
    while version < DATA_SCHEMA_VERSION:
        migrator = MIGRATORS[version]  # KeyError => unmigratable gap; caller aborts
        _LOGGER.info("Family Hub: migrating data schema v%d → v%d", version, version + 1)
        data = migrator(data)
        version += 1
    return data

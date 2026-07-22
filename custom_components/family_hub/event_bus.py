"""
Family Hub — internal module event bus (v0.8.0).

In-process pub/sub between Family Hub modules. This is **not** the Home
Assistant event bus — messages never leave the integration and are never
persisted. It exists so one module can offer work to another (e.g. Maintenance
→ Chores) without importing it and without caring whether it is even turned on.

LOCKING CONVENTION — the one rule that keeps this safe:
  Publishers call ``await bus.async_publish(...)`` from INSIDE their own locked
  store mutation. Callbacks therefore run UNDER THE STORE LOCK. A callback MUST:
    (a) mutate ``self._data`` only via internal ``_apply_*`` helpers,
    (b) never call ``async_save()`` or any public ``async_*`` store method,
    (c) never re-publish.
  The publishing mutation's own ``async_save()`` persists everything atomically.
  Violating this deadlocks (a callback awaiting the lock the publisher holds) or
  double-saves.

Delivery is gated per-subscriber on module-enabled state at publish time, so a
message addressed to a disabled module is silently dropped (debug log). Because
subscriptions are registered unconditionally at store init and the gate is at
delivery, toggling a module on is race-free.
"""

from __future__ import annotations

import logging
from typing import Awaitable, Callable

_LOGGER = logging.getLogger(__name__)

# A subscriber is an async callable taking the event payload dict.
Subscriber = Callable[[dict], Awaitable[None]]


class FamilyHubBus:
    """Minimal async pub/sub with per-subscriber module gating."""

    def __init__(self, is_enabled: Callable[[str], bool]) -> None:
        # is_enabled(module_id) -> bool, evaluated fresh at every publish so the
        # gate always reflects the current enabled_modules set.
        self._is_enabled = is_enabled
        # topic -> [(module_id, callback), ...] in registration order
        self._subs: dict[str, list[tuple[str, Subscriber]]] = {}

    def subscribe(self, topic: str, module_id: str, callback: Subscriber) -> Callable[[], None]:
        """Register a subscriber for a topic. Returns an unsubscribe callable.

        module_id gates delivery: the callback only fires while that module is
        enabled. Registration itself is unconditional.
        """
        subs = self._subs.setdefault(topic, [])
        entry = (module_id, callback)
        subs.append(entry)

        def _unsubscribe() -> None:
            try:
                subs.remove(entry)
            except ValueError:
                pass

        return _unsubscribe

    async def async_publish(self, topic: str, payload: dict) -> int:
        """Deliver ``payload`` to every enabled subscriber of ``topic``,
        sequentially in registration order.

        Subscribers whose module is disabled are silently skipped (debug log).
        A subscriber that raises is logged and skipped — one bad subscriber never
        aborts the rest, and never propagates back into the publisher's mutation.

        Returns the number of successful deliveries. 0 means nobody listened,
        which lets the publisher revert an affordance (e.g. clear an "offered"
        flag when no module consumed the offer).
        """
        delivered = 0
        # Snapshot the list so a subscriber that unsubscribes mid-delivery
        # doesn't mutate what we're iterating.
        for module_id, callback in list(self._subs.get(topic, [])):
            if not self._is_enabled(module_id):
                _LOGGER.debug(
                    "Family Hub bus: dropping '%s' for disabled module '%s'",
                    topic, module_id,
                )
                continue
            try:
                await callback(payload)
                delivered += 1
            except Exception:  # noqa: BLE001
                _LOGGER.exception(
                    "Family Hub bus: subscriber for '%s' (module '%s') raised",
                    topic, module_id,
                )
        return delivered

"""Constants for Family Hub integration."""

DOMAIN = "family_hub"
# Display/reference only. The canonical version lives in manifest.json,
# hacs.json, and src/card/constants.js — keep this in sync when bumping.
VERSION = "0.7.5"

# Config entry keys
CONF_FAMILY_NAME = "family_name"
CONF_POINTS_PER_DOLLAR = "points_per_dollar"
CONF_STORAGE_PATH = "storage_path"

# Defaults
DEFAULT_FAMILY_NAME = "Our Family"
DEFAULT_POINTS_PER_DOLLAR = 10

# Data store filename (legacy single-file path; read-only source for the
# v0.7.0 P3 one-time migration into the per-domain HA Stores).
STORAGE_FILE = "family_hub_data.json"
# Bumped 1→2 for the v0.7.0 module-oriented multi-store layout.
STORAGE_VERSION = 2

# Person types
PERSON_TYPE_KID = "kid"
PERSON_TYPE_PARENT = "parent"
PERSON_TYPES = [PERSON_TYPE_KID, PERSON_TYPE_PARENT]

# ---------------------------------------------------------------------------
# Chore types (replaces old "category" field in UI — data field is chore_type)
# The old category field is kept in JSON for migration but chore_type is
# the canonical field going forward.
# ---------------------------------------------------------------------------
CHORE_TYPE_ASSIGNED  = "assigned"   # Assigned to one or more people, recurring
CHORE_TYPE_CLAIMABLE = "claimable"  # Bonus chore, first come first served
CHORE_TYPE_REMINDER  = "reminder"   # Personal or house reminder, no points required

CHORE_TYPES = [CHORE_TYPE_ASSIGNED, CHORE_TYPE_CLAIMABLE, CHORE_TYPE_REMINDER]

# ---------------------------------------------------------------------------
# Chore rotation (v0.6.2)
# ---------------------------------------------------------------------------
# When `rotation_pool` is non-empty on an ASSIGNED chore, the active assignee
# cycles through the pool on a cadence. `rotation_index` is the current position
# in the pool; `assigned_to` is replaced with `[pool[index]]` whenever the
# cadence advances. Inactive pool members are skipped (and the index advances
# past them) so a paused/removed kid never "blocks" the rotation.
ROTATION_CADENCE_DAILY        = "daily"          # advance once per daily tick
ROTATION_CADENCE_WEEKLY       = "weekly"         # advance on Monday daily tick
ROTATION_CADENCE_PER_INSTANCE = "per_instance"   # advance each time an instance is generated
ROTATION_CADENCES = [
    ROTATION_CADENCE_DAILY,
    ROTATION_CADENCE_WEEKLY,
    ROTATION_CADENCE_PER_INSTANCE,
]

# Legacy category values — kept for migration only
CATEGORY_ASSIGNED         = "assigned"
CATEGORY_CLAIMABLE        = "claimable"
CATEGORY_MAINTENANCE      = "maintenance"
CATEGORY_PERSONAL_REMINDER= "personal_reminder"
CATEGORY_ONE_TIME         = "one_time"

# Categories that map to the maintenance card (detected by chore_type + category_label)
# A chore is shown on maintenance card if its category_label == "Maintenance"
# or its old category was in LEGACY_MAINTENANCE_CATEGORIES
LEGACY_MAINTENANCE_CATEGORIES = [CATEGORY_MAINTENANCE, CATEGORY_PERSONAL_REMINDER]

# Default user-defined category labels (display grouping, fully customisable)
DEFAULT_CATEGORY_LABELS = [
    "Morning",
    "Afternoon",
    "Evening",
    "Weekly",
    "Monthly",
    "Bonus",
    "Cleaning",
    "Pet Care",
    "Maintenance",
]

# ---------------------------------------------------------------------------
# Recurrence types
# ---------------------------------------------------------------------------
RECURRENCE_DAILY           = "daily"
RECURRENCE_WEEKLY          = "weekly"
RECURRENCE_EVERY_N_DAYS    = "every_n_days"   # legacy — backend only, not in UI
RECURRENCE_EVERY_N_WEEKS   = "every_n_weeks"  # legacy — backend only, not in UI
RECURRENCE_MONTHLY_ON_DATE = "monthly_on_date"
RECURRENCE_ONE_TIME        = "one_time"
RECURRENCE_TYPES = [
    RECURRENCE_DAILY,
    RECURRENCE_WEEKLY,
    RECURRENCE_EVERY_N_DAYS,
    RECURRENCE_EVERY_N_WEEKS,
    RECURRENCE_MONTHLY_ON_DATE,
    RECURRENCE_ONE_TIME,
]

# ---------------------------------------------------------------------------
# Claimable subtypes (v0.5.0)
# ---------------------------------------------------------------------------
CLAIMABLE_SUBTYPE_FCFS  = "fcfs"        # one instance, first person to claim wins
CLAIMABLE_SUBTYPE_MULTI = "multi_claim" # multiple claimants up to max_claimants

MULTI_CLAIM_POINTS_FULL  = "full"   # each claimant earns full points
MULTI_CLAIM_POINTS_SPLIT = "split"  # points divided evenly among actual claimants

# ---------------------------------------------------------------------------
# Task instance statuses
# ---------------------------------------------------------------------------
STATUS_PENDING          = "pending"
STATUS_CLAIMED          = "claimed"
STATUS_SELF_REPORTED    = "self_reported"
STATUS_PENDING_APPROVAL = "pending_approval"
STATUS_APPROVED         = "approved"
STATUS_DENIED           = "denied"
STATUS_SKIPPED          = "skipped"   # Replaced by next cycle (penalty may have applied)
STATUS_EXCUSED          = "excused"   # Skipped but parent reversed the penalty (sick day, etc.)
STATUS_REJECTED         = "rejected"  # Approved/self-reported but parent clawed back the points

ACTIVE_STATUSES    = [STATUS_PENDING, STATUS_CLAIMED, STATUS_PENDING_APPROVAL]
COMPLETED_STATUSES = [STATUS_SELF_REPORTED, STATUS_APPROVED, STATUS_DENIED, STATUS_SKIPPED,
                      STATUS_EXCUSED, STATUS_REJECTED]

# ---------------------------------------------------------------------------
# Store item scope
# ---------------------------------------------------------------------------
SCOPE_COMMON   = "common"    # All active people see it
SCOPE_PERSONAL = "personal"  # Only people in person_ids list see it
STORE_SCOPES   = [SCOPE_COMMON, SCOPE_PERSONAL]

# ---------------------------------------------------------------------------
# Redemption statuses
# ---------------------------------------------------------------------------
REDEMPTION_PENDING  = "pending"
REDEMPTION_APPROVED = "approved"
REDEMPTION_DECLINED = "declined"
REDEMPTION_STATUSES = [REDEMPTION_PENDING, REDEMPTION_APPROVED, REDEMPTION_DECLINED]

# ---------------------------------------------------------------------------
# Group reward proposal statuses (v0.6.3 item 13)
# ---------------------------------------------------------------------------
PROPOSAL_PENDING_KIDS   = "pending_kid_acceptance"   # Waiting for invitees to accept/decline
PROPOSAL_PENDING_PARENT = "pending_parent_approval"  # All kids accepted; parent must approve
PROPOSAL_APPROVED       = "approved"                 # Live — item is now a group reward
PROPOSAL_DECLINED       = "declined"                 # Rejected by a kid or parent

# ---------------------------------------------------------------------------
# Store item types (v0.6.5)
# ---------------------------------------------------------------------------
ITEM_TYPE_ONE_TIME     = "one_time"      # Redeem once (existing behavior)
ITEM_TYPE_SUBSCRIPTION = "subscription"  # Recurring deduction on a period/anchor schedule
ITEM_TYPES = [ITEM_TYPE_ONE_TIME, ITEM_TYPE_SUBSCRIPTION]

# ---------------------------------------------------------------------------
# Subscription periods (v0.6.5)
# ---------------------------------------------------------------------------
SUB_PERIOD_DAILY     = "daily"
SUB_PERIOD_WEEKLY    = "weekly"
SUB_PERIOD_MONTHLY   = "monthly"
SUB_PERIOD_QUARTERLY = "quarterly"
SUB_PERIOD_BIANNUAL  = "biannual"
SUB_PERIOD_ANNUAL    = "annual"
SUB_PERIODS = [
    SUB_PERIOD_DAILY,
    SUB_PERIOD_WEEKLY,
    SUB_PERIOD_MONTHLY,
    SUB_PERIOD_QUARTERLY,
    SUB_PERIOD_BIANNUAL,
    SUB_PERIOD_ANNUAL,
]

# ---------------------------------------------------------------------------
# Subscription statuses (v0.6.5)
# ---------------------------------------------------------------------------
SUB_STATUS_ACTIVE         = "active"           # Renewing normally
SUB_STATUS_LAPSED         = "lapsed"           # Missed renewal(s); debt accumulating
SUB_STATUS_CANCEL_PENDING = "cancel_pending"   # Kid requested cancel; awaiting parent
SUB_STATUS_CANCELED       = "canceled"         # Stopped — no further processing

# ---------------------------------------------------------------------------
# History event types
# ---------------------------------------------------------------------------
HISTORY_TASK_COMPLETED        = "task_completed"
HISTORY_TASK_APPROVED         = "task_approved"
HISTORY_TASK_DENIED           = "task_denied"
HISTORY_TASK_SKIPPED          = "task_skipped"
HISTORY_TASK_EXCUSED          = "task_excused"          # Penalty reversed — kid was excused
HISTORY_TASK_REJECTED         = "task_rejected"         # Points clawed back after approval
HISTORY_TASK_MARKED_COMPLETE  = "task_marked_complete"  # Parent retroactively marked done
HISTORY_TASK_LATE_CLAIMED     = "task_late_claimed"     # Kid claimed a skipped chore late; awaiting approval
HISTORY_POINTS_AWARDED        = "points_awarded"
HISTORY_REDEMPTION_REQUESTED  = "redemption_requested"
HISTORY_REDEMPTION_APPROVED   = "redemption_approved"
HISTORY_REDEMPTION_DECLINED   = "redemption_declined"
HISTORY_TASK_ADDED            = "task_added"
HISTORY_PERSON_ADDED          = "person_added"
HISTORY_ALLOWANCE             = "allowance"
HISTORY_COMPLETION_STREAK_MILESTONE = "completion_streak_milestone"  # v0.6.1 success-rate streak bonus
HISTORY_GROUP_CHIP_IN               = "group_chip_in"   # v0.6.3 item 13 — points chipped in
HISTORY_GROUP_REDEEMED              = "group_redeemed"  # v0.6.3 item 13 — group reward redeemed
HISTORY_GROUP_PROPOSED              = "group_proposed"  # v0.6.3 item 13 — kid proposed sharing
# v0.6.5: subscription events
HISTORY_SUBSCRIPTION_STARTED          = "subscription_started"
HISTORY_SUBSCRIPTION_RENEWED          = "subscription_renewed"
HISTORY_SUBSCRIPTION_LAPSED           = "subscription_lapsed"
HISTORY_SUBSCRIPTION_CANCELED         = "subscription_canceled"
HISTORY_SUBSCRIPTION_CANCEL_REQUESTED = "subscription_cancel_requested"
HISTORY_SUBSCRIPTION_CANCEL_DECLINED  = "subscription_cancel_declined"
HISTORY_SUBSCRIPTION_UPDATED          = "subscription_updated"

# Rolling retention window — history entries older than this are trimmed on each
# daily tick to keep the data file from growing unbounded.
HISTORY_RETENTION_DAYS = 30

# Terminal task instances (skipped/approved/denied/rejected/excused/self_reported)
# older than this many days are pruned on each daily tick. Active instances
# (pending/claimed/pending_approval) are never pruned regardless of age.
TASK_INSTANCE_RETENTION_DAYS = 30

# ---------------------------------------------------------------------------
# Sensor names
# ---------------------------------------------------------------------------
SENSOR_PERSON              = "family_hub"
SENSOR_MAINTENANCE_DUE     = "maintenance_due"
SENSOR_MAINTENANCE_OVERDUE = "maintenance_overdue"
SENSOR_NEEDS_ATTENTION     = "needs_attention"
SENSOR_CLAIMABLE           = "claimable_tasks"

# Maintenance due-soon window (days)
MAINTENANCE_DUE_SOON_DAYS = 14

# ---------------------------------------------------------------------------
# Service names
# ---------------------------------------------------------------------------
SERVICE_COMPLETE_TASK       = "complete_task"
SERVICE_APPROVE_TASK        = "approve_task"
SERVICE_DENY_TASK           = "deny_task"
SERVICE_CLAIM_TASK          = "claim_task"
SERVICE_ADD_ONE_TIME_TASK   = "add_one_time_task"  # Legacy alias
SERVICE_ADD_TASK            = "add_task"            # Canonical one-time task service
SERVICE_ADD_PERSON          = "add_person"
SERVICE_UPDATE_PERSON       = "update_person"
SERVICE_REMOVE_PERSON       = "remove_person"
SERVICE_ADD_CHORE           = "add_chore"
SERVICE_UPDATE_CHORE        = "update_chore"
SERVICE_DELETE_CHORE        = "delete_chore"
SERVICE_REQUEST_REDEMPTION  = "request_redemption"
SERVICE_APPROVE_REDEMPTION  = "approve_redemption"
SERVICE_DECLINE_REDEMPTION  = "decline_redemption"
SERVICE_ADD_STORE_ITEM      = "add_store_item"
SERVICE_UPDATE_STORE_ITEM   = "update_store_item"
SERVICE_DELETE_STORE_ITEM   = "delete_store_item"
SERVICE_AWARD_BONUS_POINTS  = "award_bonus_points"
SERVICE_DEDUCT_POINTS       = "deduct_points"
SERVICE_UPDATE_SETTINGS     = "update_settings"
SERVICE_EXPORT_BACKUP       = "export_backup"
# v0.4.0 admin correction services
SERVICE_EXCUSE_TASK         = "excuse_task"         # Reverse penalty on a skipped task
SERVICE_REJECT_TASK         = "reject_task"         # Claw back points on an approved task
SERVICE_MARK_TASK_COMPLETE  = "mark_task_complete"  # Retroactively mark skipped task done
SERVICE_FORCE_DAILY_TICK    = "force_daily_tick"    # Trigger tick immediately (admin/debug)
SERVICE_REBUILD_DATA        = "rebuild_data"         # Heavy-lift data cleanup on demand
SERVICE_SET_STREAK          = "set_streak"           # Admin override of a person's streak count
# v0.6.5: subscription services
SERVICE_SUBSCRIBE                   = "subscribe"
SERVICE_REQUEST_CANCEL_SUBSCRIPTION = "request_cancel_subscription"
SERVICE_APPROVE_CANCEL_SUBSCRIPTION = "approve_cancel_subscription"
SERVICE_DECLINE_CANCEL_SUBSCRIPTION = "decline_cancel_subscription"
SERVICE_ADMIN_CANCEL_SUBSCRIPTION   = "admin_cancel_subscription"
SERVICE_ADMIN_SUBSCRIBE_FOR_PERSON  = "admin_subscribe_for_person"

# Weekday constants (0=Monday … 6=Sunday)
WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

# Notification identifiers
NOTIFICATION_APPROVAL_NEEDED      = "family_hub_approval_needed"
NOTIFICATION_REDEMPTION_REQUESTED = "family_hub_redemption_requested"

# Settings keys
CONF_SHOW_DOLLAR_VALUE_TO_KIDS  = "show_dollar_value_to_kids"
DEFAULT_SHOW_DOLLAR_VALUE_TO_KIDS = False

# ---------------------------------------------------------------------------
# Penalty pause settings (v0.4.2)
# ---------------------------------------------------------------------------
# Global switch — when True, NO penalties fire for ANY person during the tick.
# Stored in settings.penalties_paused in the JSON data file.
CONF_PENALTIES_PAUSED_GLOBAL  = "penalties_paused"
DEFAULT_PENALTIES_PAUSED_GLOBAL = False

# Per-person switch — when True on a person record, that person's penalties are
# suppressed even if the global switch is off. Stored as person.penalties_paused.
# Stays paused until a parent manually re-enables it.
CONF_PENALTIES_PAUSED_PERSON_KEY  = "penalties_paused"
DEFAULT_PENALTIES_PAUSED_PERSON = False

# Frontend / Lovelace card
CARD_URL_PATH    = "/family_hub"
CARD_JS_FILENAME = "family-hub-card.js"
CARD_JS_URL      = "/family_hub/family-hub-card.js"
"""Constants for Family Hub integration."""

DOMAIN = "family_hub"
VERSION = "0.4.2"

# Config entry keys
CONF_FAMILY_NAME = "family_name"
CONF_POINTS_PER_DOLLAR = "points_per_dollar"
CONF_STORAGE_PATH = "storage_path"

# Defaults
DEFAULT_FAMILY_NAME = "Our Family"
DEFAULT_POINTS_PER_DOLLAR = 10

# Data store filename (lives in HA config dir)
STORAGE_FILE = "family_hub_data.json"
STORAGE_VERSION = 1

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
# History event types
# ---------------------------------------------------------------------------
HISTORY_TASK_COMPLETED        = "task_completed"
HISTORY_TASK_APPROVED         = "task_approved"
HISTORY_TASK_DENIED           = "task_denied"
HISTORY_TASK_SKIPPED          = "task_skipped"
HISTORY_TASK_EXCUSED          = "task_excused"          # Penalty reversed — kid was excused
HISTORY_TASK_REJECTED         = "task_rejected"         # Points clawed back after approval
HISTORY_TASK_MARKED_COMPLETE  = "task_marked_complete"  # Parent retroactively marked done
HISTORY_POINTS_AWARDED        = "points_awarded"
HISTORY_REDEMPTION_REQUESTED  = "redemption_requested"
HISTORY_REDEMPTION_APPROVED   = "redemption_approved"
HISTORY_REDEMPTION_DECLINED   = "redemption_declined"
HISTORY_TASK_ADDED            = "task_added"
HISTORY_PERSON_ADDED          = "person_added"
HISTORY_ALLOWANCE             = "allowance"
HISTORY_COMPLETION_STREAK_MILESTONE = "completion_streak_milestone"  # v0.6.1 success-rate streak bonus

# Rolling retention window — history entries older than this are trimmed on each
# daily tick to keep the data file from growing unbounded.
HISTORY_RETENTION_DAYS = 30

# Terminal task instances (skipped/approved/denied/rejected/excused) older than
# this many days are pruned on each daily tick.
TASK_INSTANCE_RETENTION_DAYS = 60

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

# Coordinator update interval (seconds)
UPDATE_INTERVAL = 30

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
CONF_PENALTIES_PAUSED_PERSON  = "penalties_paused"
DEFAULT_PENALTIES_PAUSED_PERSON = False

# Frontend / Lovelace card
CARD_URL_PATH    = "/family_hub"
CARD_JS_FILENAME = "family-hub-card.js"
CARD_JS_URL      = "/family_hub/family-hub-card.js"
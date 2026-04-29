"""Constants for Family Hub integration."""

DOMAIN = "family_hub"
VERSION = "0.1.0"

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

# Chore categories
CATEGORY_ASSIGNED = "assigned"               # Assigned to a specific person
CATEGORY_CLAIMABLE = "claimable"             # First come, first served
CATEGORY_MAINTENANCE = "maintenance"         # House/home maintenance tasks
CATEGORY_PERSONAL_REMINDER = "personal_reminder"  # Personal recurring reminders (CPAP, contacts, etc.)
CATEGORY_ONE_TIME = "one_time"               # One-off tasks, no recurrence
CHORE_CATEGORIES = [
    CATEGORY_ASSIGNED,
    CATEGORY_CLAIMABLE,
    CATEGORY_MAINTENANCE,
    CATEGORY_PERSONAL_REMINDER,
    CATEGORY_ONE_TIME,
]

# Categories that track by last-completed date (maintenance-style)
MAINTENANCE_CATEGORIES = [CATEGORY_MAINTENANCE, CATEGORY_PERSONAL_REMINDER]

# Recurrence types
RECURRENCE_DAILY = "daily"
RECURRENCE_WEEKLY = "weekly"
RECURRENCE_EVERY_N_DAYS = "every_n_days"
RECURRENCE_EVERY_N_WEEKS = "every_n_weeks"
RECURRENCE_MONTHLY_ON_DATE = "monthly_on_date"
RECURRENCE_ONE_TIME = "one_time"
RECURRENCE_TYPES = [
    RECURRENCE_DAILY,
    RECURRENCE_WEEKLY,
    RECURRENCE_EVERY_N_DAYS,
    RECURRENCE_EVERY_N_WEEKS,
    RECURRENCE_MONTHLY_ON_DATE,
    RECURRENCE_ONE_TIME,
]

# Task instance statuses
STATUS_PENDING = "pending"                     # Not yet acted on
STATUS_CLAIMED = "claimed"                     # Claimed from claimable pool
STATUS_SELF_REPORTED = "self_reported"         # Marked done, no approval needed — points awarded
STATUS_PENDING_APPROVAL = "pending_approval"   # Marked done, awaiting parent approval
STATUS_APPROVED = "approved"                   # Parent approved, points awarded
STATUS_DENIED = "denied"                       # Parent denied
STATUS_SKIPPED = "skipped"                     # Task skipped this cycle (admin action)

ACTIVE_STATUSES = [STATUS_PENDING, STATUS_CLAIMED, STATUS_PENDING_APPROVAL]
COMPLETED_STATUSES = [STATUS_SELF_REPORTED, STATUS_APPROVED, STATUS_DENIED, STATUS_SKIPPED]

# Store item scope
SCOPE_COMMON = "common"     # Visible to all people
SCOPE_PERSONAL = "personal" # Visible only to one person
STORE_SCOPES = [SCOPE_COMMON, SCOPE_PERSONAL]

# Redemption statuses
REDEMPTION_PENDING = "pending"
REDEMPTION_APPROVED = "approved"
REDEMPTION_DECLINED = "declined"
REDEMPTION_STATUSES = [REDEMPTION_PENDING, REDEMPTION_APPROVED, REDEMPTION_DECLINED]

# History event types
HISTORY_TASK_COMPLETED = "task_completed"
HISTORY_TASK_APPROVED = "task_approved"
HISTORY_TASK_DENIED = "task_denied"
HISTORY_POINTS_AWARDED = "points_awarded"
HISTORY_REDEMPTION_REQUESTED = "redemption_requested"
HISTORY_REDEMPTION_APPROVED = "redemption_approved"
HISTORY_REDEMPTION_DECLINED = "redemption_declined"
HISTORY_TASK_ADDED = "task_added"
HISTORY_PERSON_ADDED = "person_added"

# HA sensor names
SENSOR_PERSON = "family_hub"                          # Per-person: sensor.family_hub_[name]
SENSOR_MAINTENANCE_DUE = "maintenance_due"            # Global: items due within 14 days
SENSOR_MAINTENANCE_OVERDUE = "maintenance_overdue"    # Global: overdue maintenance/reminders
SENSOR_NEEDS_ATTENTION = "needs_attention"            # Global: total parent actions needed
SENSOR_CLAIMABLE = "claimable_tasks"                  # Global: unclaimed claimable tasks

# Maintenance due-soon window (days)
MAINTENANCE_DUE_SOON_DAYS = 14

# Service names
SERVICE_COMPLETE_TASK = "complete_task"
SERVICE_APPROVE_TASK = "approve_task"
SERVICE_DENY_TASK = "deny_task"
SERVICE_CLAIM_TASK = "claim_task"
SERVICE_ADD_ONE_TIME_TASK = "add_one_time_task"
SERVICE_ADD_PERSON = "add_person"
SERVICE_UPDATE_PERSON = "update_person"
SERVICE_ADD_CHORE = "add_chore"
SERVICE_UPDATE_CHORE = "update_chore"
SERVICE_DELETE_CHORE = "delete_chore"
SERVICE_REQUEST_REDEMPTION = "request_redemption"
SERVICE_APPROVE_REDEMPTION = "approve_redemption"
SERVICE_DECLINE_REDEMPTION = "decline_redemption"
SERVICE_ADD_STORE_ITEM = "add_store_item"
SERVICE_UPDATE_STORE_ITEM = "update_store_item"
SERVICE_DELETE_STORE_ITEM = "delete_store_item"
SERVICE_AWARD_BONUS_POINTS = "award_bonus_points"
SERVICE_EXPORT_BACKUP = "export_backup"

# Update interval for coordinator (seconds) — data is local so can be fast
UPDATE_INTERVAL = 30

# Weekday constants for recurrence
WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

# Notification targets (persistent_notification + mobile app)
NOTIFICATION_APPROVAL_NEEDED = "family_hub_approval_needed"
NOTIFICATION_REDEMPTION_REQUESTED = "family_hub_redemption_requested"

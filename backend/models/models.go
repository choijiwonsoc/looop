package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ─────────────────────────────────────────────
// Enums (Go doesn't have real enums — use typed strings)
// ─────────────────────────────────────────────

type Priority string

const (
	PriorityUrgent   Priority = "urgent"
	PriorityNormal   Priority = "normal"
	PriorityOptional Priority = "optional"
)

type TaskStatus string

const (
	TaskStatusTodo       TaskStatus = "todo"
	TaskStatusInProgress TaskStatus = "in_progress"
	TaskStatusDone       TaskStatus = "done"
)

type IssueSeverity string

const (
	SeverityLow    IssueSeverity = "low"
	SeverityMedium IssueSeverity = "medium"
	SeverityHigh   IssueSeverity = "high"
)

type HistoryAction string

const (
	ActionTaskCreated        HistoryAction = "task_created"
	ActionTaskCompleted      HistoryAction = "task_completed"
	ActionTaskStatusChanged  HistoryAction = "task_status_changed"
	ActionIssueFlagged       HistoryAction = "issue_flagged"
	ActionIssueResolved      HistoryAction = "issue_resolved"
	ActionMemberJoined       HistoryAction = "member_joined"
	ActionTimelineItemAdded  HistoryAction = "timeline_item_added"
)

// ─────────────────────────────────────────────
// Member
// ─────────────────────────────────────────────

type Member struct {
	ID    string `bson:"id" json:"id"`
	Name  string `bson:"name" json:"name"`
	Color string `bson:"color" json:"color"`
}

// ─────────────────────────────────────────────
// Event
// ─────────────────────────────────────────────

type Event struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name       string             `bson:"name" json:"name"`
	Type       string             `bson:"type,omitempty" json:"type,omitempty"`
	Description string      `bson:"description,omitempty" json:"description,omitempty"`
	StartDate  string             `bson:"startDate" json:"startDate"`
	EndDate    *string            `bson:"endDate,omitempty" json:"endDate,omitempty"` // nil = ongoing
	Members    []Member           `bson:"members" json:"members"`
	InviteCode string             `bson:"inviteCode" json:"inviteCode"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
}

// ─────────────────────────────────────────────
// Task
// ─────────────────────────────────────────────

type Task struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	EventID     primitive.ObjectID `bson:"eventId" json:"eventId"`
	Title       string             `bson:"title" json:"title"`
	Notes       string             `bson:"notes,omitempty" json:"notes,omitempty"`
	Priority    Priority           `bson:"priority" json:"priority"`
	Status      TaskStatus         `bson:"status" json:"status"`
	AssignedTo  *string            `bson:"assignedTo,omitempty" json:"assignedTo,omitempty"` // member id
	StartDay   *string            `bson:"startDay,omitempty" json:"startDay,omitempty"`
	EndDay     *string            `bson:"endDay,omitempty" json:"endDay,omitempty"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
	FollowUp   []string           `bson:"followUp,omitempty" json:"followUp,omitempty"`
}

// ─────────────────────────────────────────────
// Issue
// ─────────────────────────────────────────────

type Issue struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	EventID    primitive.ObjectID `bson:"eventId" json:"eventId"`
	Description string            `bson:"description" json:"description"`
	Severity   IssueSeverity      `bson:"severity" json:"severity"`
	Resolved   bool               `bson:"resolved" json:"resolved"`
	RaisedBy   string             `bson:"raisedBy" json:"raisedBy"` // member id
	ResolvedBy *string            `bson:"resolvedBy,omitempty" json:"resolvedBy,omitempty"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
	FollowUp   []string           `bson:"followUp,omitempty" json:"followUp,omitempty"`
}

// ─────────────────────────────────────────────
// TimelineItem
// ─────────────────────────────────────────────

type TimelineItem struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	EventID     primitive.ObjectID `bson:"eventId" json:"eventId"`
	Day         int                `bson:"day" json:"day"`
	Time        string             `bson:"time,omitempty" json:"time,omitempty"`
	Description string             `bson:"description" json:"description"`
}

// ─────────────────────────────────────────────
// HistoryEntry
// ─────────────────────────────────────────────

type HistoryEntry struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	EventID     primitive.ObjectID `bson:"eventId" json:"eventId"`
	ActorID     string             `bson:"actorId" json:"actorId"`
	Action      HistoryAction      `bson:"action" json:"action"`
	TargetLabel string             `bson:"targetLabel" json:"targetLabel"`
	Timestamp   time.Time          `bson:"timestamp" json:"timestamp"`
}

type EditEventRequest struct {
	Name *string        `json:"type,omitempty"`
	Type *string        `json:"type,omitempty"`
	Description    *string `json:"description,omitempty"`
	StartDate *string        `json:"startDate,omitempty"`
	EndDate *string        `json:"endDate,omitempty"`
}

type CompleteTaskRequest struct {
	Status string `bson:"status" json:"status"`
	FollowUp []string `bson:"followUp,omitempty" json:"followUp,omitempty"`
}

type EditTaskRequest struct {
	Title *string        `json:"description,omitempty"`
	Notes *string        `json:"description,omitempty"`
	Priority    *Priority `json:"priority,omitempty"`
	AssignedTo *string        `json:"assignedTo,omitempty"`
	StartDate *string        `json:"startDate,omitempty"`
	EndDate *string        `json:"endDate,omitempty"`
	FollowUp []string `bson:"followUp,omitempty" json:"followUp,omitempty"`
}

type ResolveIssueRequest struct {
	Resolved bool `bson:"resolved" json:"resolved"`
	ResolvedBy string `bson:"resolvedBy,omitempty" json:"resolvedBy,omitempty"`
	FollowUp []string `bson:"followUp,omitempty" json:"followUp,omitempty"`
}

type EditIssueRequest struct {
	Description *string        `json:"description,omitempty"`
	Severity    *IssueSeverity `json:"severity,omitempty"`
	FollowUp []string `bson:"followUp,omitempty" json:"followUp,omitempty"`
}
export type Priority = 'urgent' | 'normal' | 'optional';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type IssueSeverity = 'low' | 'medium' | 'high';

export interface Member {
  id: string;
  name: string;
  color: string; // used for avatar background, derived client-side
}

export interface EventBoard {
  id: string;
  name: string;
  type?: string; // 'project' | 'move' | 'conference' | 'household' | custom
  description?: string;
  startDate: string; // ISO date
  endDate: string | null; // null = recurring / ongoing (covers the household use case)
  members: Member[];
  inviteCode: string;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  notes?: string;
  priority: Priority;
  status: TaskStatus;
  assignedTo: string | null; // member id
  startDay?: string;    // multi-day tasks: first day (inclusive)
  endDay?: string; 
  createdAt: string;
  updatedAt: string;
  followUp?: string[];
}

export interface Issue {
  id: string;
  eventId: string;
  description: string;
  severity: IssueSeverity;
  resolved: boolean;
  raisedBy: string; // member id
  resolvedBy?: string;
  createdAt: string;
  followUp?: string[];
}

export interface TimelineItem {
  id: string;
  eventId: string;
  day: number; // Day 1, Day 2, ...
  time?: string;
  description: string;
}

export type HistoryAction =
  | 'task_created'
  | 'task_edited'
  | 'task_completed'
  | 'task_status_changed'
  | 'task_deleted'
  | 'issue_flagged'
  | 'issue_edited'
  | 'issue_resolved'
  | 'issue_deleted'
  | 'member_joined'
  | 'timeline_item_added';

export interface HistoryEntry {
  id: string;
  eventId: string;
  actorId: string;
  action: HistoryAction;
  targetLabel: string; // human-readable label of what was acted on
  timestamp: string;
}

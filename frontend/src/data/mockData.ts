import type { EventBoard, Task, Issue, TimelineItem, HistoryEntry, Member } from '../types';

export const currentUserId = 'm1';

export const mockMembers: Member[] = [
  { id: 'm1', name: 'You', color: '#2F5EFF' },
  { id: 'm2', name: 'Priya', color: '#C88A2A' },
  { id: 'm3', name: 'Dan', color: '#8A9A7E' },
  { id: 'm4', name: 'Wei', color: '#E85D4A' },
];

export const mockEvents: EventBoard[] = [
  {
    id: 'e1',
    name: "Priya & Dan's Wedding",
    type: 'wedding',
    startDate: '2026-10-02',
    endDate: '2026-10-04',
    members: mockMembers,
    inviteCode: 'LOOP-8X2K',
  },
  {
    id: 'e2',
    name: 'Apartment 4B',
    type: 'household',
    startDate: '2026-01-01',
    endDate: null,
    members: [mockMembers[0], mockMembers[2]],
    inviteCode: 'LOOP-4B9Q',
  },
  {
    id: 'e3',
    name: 'Q4 Offsite',
    type: 'conference',
    startDate: '2026-11-14',
    endDate: '2026-11-16',
    members: mockMembers,
    inviteCode: 'LOOP-Q4RT',
  },
];

export const mockTasks: Task[] = [
  { id: 't1', eventId: 'e1', title: 'Confirm caterer headcount', priority: 'urgent', status: 'in_progress', assignedTo: 'm2', dueDay: 1, createdAt: '', updatedAt: '' },
  { id: 't2', eventId: 'e1', title: 'Pick up flowers', priority: 'urgent', status: 'todo', assignedTo: 'm3', dueDay: 2, createdAt: '', updatedAt: '' },
  { id: 't3', eventId: 'e1', title: 'Print seating chart', priority: 'normal', status: 'todo', assignedTo: null, dueDay: 1, createdAt: '', updatedAt: '' },
  { id: 't4', eventId: 'e1', title: 'Book after-party venue', priority: 'optional', status: 'done', assignedTo: 'm1', dueDay: 1, createdAt: '', updatedAt: '' },
  { id: 't5', eventId: 'e1', title: 'Test microphones', priority: 'normal', status: 'done', assignedTo: 'm4', dueDay: 1, createdAt: '', updatedAt: '' },
  { id: 't6', eventId: 'e2', title: 'Buy milk', priority: 'normal', status: 'todo', assignedTo: 'm1', createdAt: '', updatedAt: '' },
  { id: 't7', eventId: 'e2', title: 'Take out trash', priority: 'urgent', status: 'todo', assignedTo: 'm3', createdAt: '', updatedAt: '' },
];

export const mockIssues: Issue[] = [
  { id: 'i1', eventId: 'e1', description: 'Caterer running 30 min late on setup', severity: 'high', resolved: false, raisedBy: 'm2', createdAt: '' },
  { id: 'i2', eventId: 'e1', description: 'Backup mic battery not charged', severity: 'medium', resolved: true, raisedBy: 'm4', resolvedBy: 'm4', createdAt: '', resolvedAt: '' },
  { id: 'i3', eventId: 'e1', description: 'Guest count mismatch with venue', severity: 'low', resolved: false, raisedBy: 'm1', createdAt: '' },
];

export const mockTimeline: TimelineItem[] = [
  { id: 'tl1', eventId: 'e1', day: 1, time: '09:00', description: 'Venue setup begins' },
  { id: 'tl2', eventId: 'e1', day: 1, time: '14:00', description: 'Florist delivery' },
  { id: 'tl3', eventId: 'e1', day: 1, time: '18:00', description: 'Rehearsal dinner' },
  { id: 'tl4', eventId: 'e1', day: 2, time: '10:00', description: 'Hair & makeup' },
  { id: 'tl5', eventId: 'e1', day: 2, time: '16:00', description: 'Ceremony' },
  { id: 'tl6', eventId: 'e1', day: 2, time: '18:30', description: 'Reception' },
];

export const mockHistory: HistoryEntry[] = [
  { id: 'h1', eventId: 'e1', actorId: 'm4', action: 'issue_resolved', targetLabel: 'Backup mic battery not charged', timestamp: '2026-09-30T14:22:00' },
  { id: 'h2', eventId: 'e1', actorId: 'm1', action: 'task_completed', targetLabel: 'Book after-party venue', timestamp: '2026-09-30T11:05:00' },
  { id: 'h3', eventId: 'e1', actorId: 'm2', action: 'issue_flagged', targetLabel: 'Caterer running 30 min late on setup', timestamp: '2026-09-30T09:40:00' },
  { id: 'h4', eventId: 'e1', actorId: 'm3', action: 'task_status_changed', targetLabel: 'Pick up flowers → in progress', timestamp: '2026-09-29T20:15:00' },
  { id: 'h5', eventId: 'e1', actorId: 'm4', action: 'member_joined', targetLabel: 'Wei joined the event', timestamp: '2026-09-28T08:00:00' },
];

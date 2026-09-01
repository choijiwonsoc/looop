import type { HistoryEntry, Member, HistoryAction } from '../types';
import { Avatar } from './Avatar';

const ACTION_VERB: Record<HistoryAction, string> = {
  task_created: 'added task',
  task_edited: 'edited task',
  task_completed: 'closed',
  task_status_changed: 'moved',
  task_deleted: 'deleted task',
  issue_flagged: 'flagged',
  issue_edited: 'edited issue',
  issue_resolved: 'resolved',
  issue_deleted: 'deleted issue',
  member_joined: 'joined',
  timeline_item_added: 'added to timeline',
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function HistoryLog({ entries, members }: { entries: HistoryEntry[]; members: Member[] }) {
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]));
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div>
      {sorted.map((entry) => (
        <div key={entry.id} className="flex items-center gap-3 py-3 border-b border-line last:border-b-0">
          <Avatar member={memberById[entry.actorId]} size={22} />
          <p className="flex-1 text-sm m-0">
            <strong>{memberById[entry.actorId]?.name ?? 'Someone'}</strong>{' '}
            {ACTION_VERB[entry.action]}{' '}
            <span className="text-ink-soft">{entry.targetLabel}</span>
          </p>
          <span className="text-[11px] text-ink-soft whitespace-nowrap">{timeAgo(entry.timestamp)}</span>
        </div>
      ))}
      {sorted.length === 0 && <p className="text-ink-soft text-sm py-4">No activity yet.</p>}
    </div>
  );
}
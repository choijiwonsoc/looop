import type { Issue, Member } from '../types';
import { Avatar } from './Avatar';
import { LoopRing } from './LoopRing';
import { Card } from './Card';
import { EditIcon, TrashIcon } from './icons';

interface IssueCardProps {
  issue: Issue;
  color: string;
  raisedBy: Member | undefined;
  onToggleResolved: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function IssueCard({ issue, color, raisedBy, onToggleResolved, onEdit, onDelete }: IssueCardProps) {
  return (
    <Card className="relative group flex-row items-start gap-3">
      <LoopRing complete={issue.resolved} color={color} size={16} onClick={onToggleResolved} />
      <p className="flex-1 text-sm m-0 pr-14">{issue.description}</p>
      <Avatar member={raisedBy} size={20} />

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="w-6 h-6 flex items-center justify-center rounded-md text-ink-soft hover:text-loop hover:bg-loop-soft transition-colors" aria-label="Edit issue">
          <EditIcon size={12} />
        </button>
        <button onClick={onDelete} className="w-6 h-6 flex items-center justify-center rounded-md text-ink-soft hover:text-urgent hover:bg-urgent-soft transition-colors" aria-label="Delete issue">
          <TrashIcon size={12} />
        </button>
      </div>
    </Card>
  );
}
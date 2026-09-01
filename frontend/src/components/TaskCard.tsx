import type { Task, Member } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { Avatar } from './Avatar';
import { LoopRing } from './LoopRing';
import { Card } from './Card';
import { EditIcon, TrashIcon } from './icons';
import { formatTaskDateRange } from '../utils/dates';

interface TaskCardProps {
  task: Task;
  assignee: Member | undefined;
  onToggleDone: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, assignee, onToggleDone, onEdit, onDelete }: TaskCardProps) {
  const done = task.status === 'done';
  const dateLabel = formatTaskDateRange(task.startDay, task.endDay);
  return (
    <Card className={`relative group ${done ? 'opacity-55' : ''}`}>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="w-6 h-6 flex items-center justify-center rounded-md text-ink-soft hover:text-loop hover:bg-loop-soft transition-colors" aria-label="Edit task">
          <EditIcon size={12} />
        </button>
        <button onClick={onDelete} className="w-6 h-6 flex items-center justify-center rounded-md text-ink-soft hover:text-urgent hover:bg-urgent-soft transition-colors" aria-label="Delete task">
          <TrashIcon size={12} />
        </button>
      </div>

      <div className="flex items-start gap-3 pr-12">
        <LoopRing complete={done} size={18} onClick={onToggleDone} />
        <p className={`text-sm leading-snug m-0 ${done ? 'line-through text-ink-soft' : ''}`}>{task.title}</p>
      </div>
      <div className="flex items-center gap-2 pl-[30px] mt-3">
        <PriorityBadge priority={task.priority} />
        {dateLabel && <span className="text-[11px] text-ink-soft">{dateLabel}</span>}
        <div className="flex-1" />
        <Avatar member={assignee} size={22} />
      </div>
      <div className="pl-[30px] mt-2">
        <button
          onClick={onToggleDone}
          className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
            done ? 'text-ink-soft hover:bg-line' : 'text-optional bg-optional-soft hover:bg-optional/20'
          }`}
        >
          {done ? 'Reopen' : 'Mark complete'}
        </button>
      </div>
    </Card>
  );
}
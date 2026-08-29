import type { Task, Member } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { Avatar } from './Avatar';
import { LoopRing } from './LoopRing';
import { Card } from './Card';

interface TaskCardProps {
  task: Task;
  assignee: Member | undefined;
  onToggleDone: () => void;
}

export function TaskCard({ task, assignee, onToggleDone }: TaskCardProps) {
  const done = task.status === 'done';
  return (
    <Card className={done ? 'opacity-55' : ''}>
      <div className="flex items-start gap-3">
        <LoopRing complete={done} size={18} onClick={onToggleDone} />
        <p className={`text-sm leading-snug m-0 ${done ? 'line-through text-ink-soft' : ''}`}>{task.title}</p>
      </div>
      <div className="flex items-center gap-2 pl-[30px] mt-3">
        {task.notes}
      </div>
      <div className="flex items-center gap-2 pl-[30px] mt-3">
        <PriorityBadge priority={task.priority} />
        {task.dueDay != null && <span className="text-[11px] text-ink-soft">Day {task.dueDay}</span>}
        <div className="flex-1" />
        <Avatar member={assignee} size={22} />
      </div>
    </Card>
  );
}
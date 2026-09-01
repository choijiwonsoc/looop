import type { Task, Member, Priority } from '../types';
import { TaskCard } from './TaskCard';

interface TaskDayColumnsProps {
  tasks: Task[];
  members: Member[];
  currentUserId: string;
  onToggleTaskDone: (taskId: string) => void;
  onAddTaskForPriority: (priority: Priority) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const COLUMNS: { key: Priority; label: string; border: string; text: string }[] = [
  { key: 'urgent', label: 'Urgent', border: 'border-urgent', text: 'text-urgent' },
  { key: 'normal', label: 'Normal', border: 'border-normal', text: 'text-normal' },
  { key: 'optional', label: 'Optional', border: 'border-optional', text: 'text-optional' },
];

export function TaskDayColumns({ tasks, members, currentUserId, onToggleTaskDone, onAddTaskForPriority, onEditTask, onDeleteTask }: TaskDayColumnsProps) {
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.priority === col.key);
        const mine = colTasks.filter((t) => t.assignedTo === currentUserId);
        const others = colTasks.filter((t) => t.assignedTo !== currentUserId);
        const openCount = colTasks.filter((t) => t.status !== 'done').length;

        const renderTask = (task: Task, assignee: Member | undefined) => (
          <TaskCard
            key={task.id}
            task={task}
            assignee={assignee}
            onToggleDone={() => onToggleTaskDone(task.id)}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task)}
          />
        );

        return (
          <div key={col.key}>
            <div className={`flex items-center gap-2 text-xs uppercase tracking-wide pb-3 mb-3 border-b-2 ${col.border} ${col.text}`}>
              <span>{col.label}</span>
              <span className="bg-line text-ink rounded-full px-2 font-semibold">{openCount}</span>
            </div>

            <div className="flex flex-col gap-3">
              {mine.length > 0 && (
                <>
                  <div className="text-[11px] uppercase tracking-wide text-ink-soft">Mine</div>
                  {mine.map((t) => renderTask(t, memberById[currentUserId]))}
                </>
              )}
              {mine.length > 0 && others.length > 0 && <div className="h-px bg-line my-1" />}
              {others.length > 0 && (
                <>
                  {mine.length > 0 && <div className="text-[11px] uppercase tracking-wide text-ink-soft">Team</div>}
                  {others.map((t) => renderTask(t, t.assignedTo ? memberById[t.assignedTo] : undefined))}
                </>
              )}
              {colTasks.length === 0 && <p className="text-xs text-ink-soft py-2">Nothing here for this day.</p>}

              <button
                onClick={() => onAddTaskForPriority(col.key)}
                className="border border-dashed border-line-strong rounded-lg p-3 text-sm text-ink-soft text-left hover:border-loop hover:text-loop transition-colors"
              >
                + Add task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
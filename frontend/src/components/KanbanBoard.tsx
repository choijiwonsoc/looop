import { useState } from 'react';
import type { Task, Member, Priority } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  members: Member[];
  onToggleTaskDone: (taskId: string) => void;
  onAddTask: (title: string, priority: Priority) => void;
}

const COLUMNS: { key: Priority; label: string; border: string; text: string }[] = [
  { key: 'urgent', label: 'Urgent', border: 'border-urgent', text: 'text-urgent' },
  { key: 'normal', label: 'Normal', border: 'border-normal', text: 'text-normal' },
  { key: 'optional', label: 'Optional', border: 'border-optional', text: 'text-optional' },
];

export function KanbanBoard({ tasks, members, onToggleTaskDone, onAddTask }: KanbanBoardProps) {
  const [draftFor, setDraftFor] = useState<Priority | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]));

  function submitDraft(priority: Priority) {
    if (draftTitle.trim()) onAddTask(draftTitle.trim(), priority);
    setDraftTitle('');
    setDraftFor(null);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.priority === col.key);
        const openCount = colTasks.filter((t) => t.status !== 'done').length;
        return (
          <div key={col.key}>
            <div className={`flex items-center gap-2 text-xs uppercase tracking-wide pb-3 mb-3 border-b-2 ${col.border} ${col.text}`}>
              <span>{col.label}</span>
              <span className="bg-line text-ink rounded-full px-2 font-semibold">{openCount}</span>
            </div>

            <div className="flex flex-col gap-3">
              {colTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  assignee={task.assignedTo ? memberById[task.assignedTo] : undefined}
                  onToggleDone={() => onToggleTaskDone(task.id)}
                />
              ))}

              {draftFor === col.key ? (
                <input
                  autoFocus
                  placeholder="Task name…"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitDraft(col.key);
                    if (e.key === 'Escape') setDraftFor(null);
                  }}
                  onBlur={() => submitDraft(col.key)}
                  className="w-full border border-loop rounded-lg p-3 text-sm bg-white"
                />
              ) : (
                <button
                  onClick={() => setDraftFor(col.key)}
                  className="border border-dashed border-line-strong rounded-lg p-3 text-sm text-ink-soft text-left hover:border-loop hover:text-loop transition-colors"
                >
                  + Add task
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
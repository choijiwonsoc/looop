import type { Task, Member } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { Avatar } from './Avatar';
import { LoopRing } from './LoopRing';
import { Card } from './Card';
import { EditIcon, TrashIcon } from './icons';
import { formatTaskDateRange } from '../utils/dates';
import { useState } from 'react';

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
  const [showDetails, setShowDetails] = useState(false);
  const followUps = task.followUp?.slice().reverse() ?? [];
  return (
    <>
    <Card className={`relative group ${done ? 'opacity-55' : ''}`}>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
            onClick={() => setShowDetails(true)}
            className="w-6 h-6 flex items-center justify-center rounded-md text-ink-soft hover:text-loop hover:bg-loop-soft transition-colors"
            aria-label="View task details"
            title="View details"
          >
            <span className="text-[11px] font-semibold">i</span>
          </button>
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
      <div className="pl-[30px] mt-2 flex items-center gap-2">
        <button
            onClick={() => setShowDetails(true)}
            className="text-xs font-medium px-2.5 py-1 rounded-md text-loop bg-loop-soft hover:bg-loop/20 transition-colors"
          >
            View details
          </button>
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

    {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-line">
              <div>
                <h2 className="text-base font-semibold text-ink m-0">
                  {task.title}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <PriorityBadge priority={task.priority} />

                  <span className="text-[11px] text-ink-soft capitalize">
                    {task.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-line transition-colors"
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            {/* Modal content */}
            <div className="px-5 py-4 space-y-5">
              {/* Assignee */}
              <section>
                <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                  Assigned to
                </h3>

                <div className="flex items-center gap-2">
                  <Avatar member={assignee} size={28} />

                  <span className="text-sm text-ink">
                    {assignee?.name ?? 'Unassigned'}
                  </span>
                </div>
              </section>

              {/* Dates */}
              {dateLabel && (
                <section>
                  <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                    Dates
                  </h3>

                  <p className="text-sm text-ink m-0">
                    {dateLabel}
                  </p>
                </section>
              )}

              {/* Notes */}
              <section>
                <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                  Notes
                </h3>

                {task.notes ? (
                  <div className="rounded-lg bg-surface px-3 py-3">
                    <p className="text-sm text-ink whitespace-pre-wrap m-0 leading-relaxed">
                      {task.notes}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-ink-soft m-0">
                    No notes added.
                  </p>
                )}
              </section>

              {/* Follow-ups */}
              <section>
                <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                  Follow-up
                </h3>

                {followUps.length > 0 ? (
                  <div className="space-y-2">
                    {followUps.map((followUp, index) => (
                      <div
                        key={`${followUp}-${index}`}
                        className="flex gap-3 rounded-lg bg-surface px-3 py-2.5"
                      >
                        <span className="flex-shrink-0 text-[10px] font-semibold text-ink-soft mt-0.5">
                          {index === 0 ? 'LATEST' : index + 1}
                        </span>

                        <p className="text-sm text-ink m-0 leading-relaxed whitespace-pre-wrap">
                          {followUp}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-soft m-0">
                    No follow-up updates.
                  </p>
                )}
              </section>

              {/* Metadata */}
              <section className="pt-3 border-t border-line">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-ink-soft">Created</span>
                    <p className="text-ink m-0 mt-1">
                      {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="text-ink-soft">Last updated</span>
                    <p className="text-ink m-0 mt-1">
                      {new Date(task.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end px-5 py-3 border-t border-line">
              <button
                onClick={() => setShowDetails(false)}
                className="text-xs font-medium px-3 py-1.5 rounded-md text-ink-soft hover:text-ink hover:bg-line transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </>
  );
}

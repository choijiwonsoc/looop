import { useState } from 'react';
import type { Member, Priority, Task } from '../types';

interface CreateTaskModalProps {
  members: Member[];
  initialPriority?: Priority;
  initialDay?: string; // ISO date — default start/end when creating from a specific day
  dayLabel?: string;
  editingTask?: Task;
  onClose: () => void;
  onSubmit: (input: { title: string; notes?: string; priority: Priority; assignedTo: string | null; startDay?: string; endDay?: string, followUp?: string[] }) => void;
}

export function CreateTaskModal({ members, initialPriority = 'normal', initialDay, dayLabel, editingTask, onClose, onSubmit }: CreateTaskModalProps) {
  const isEdit = !!editingTask;
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [notes, setNotes] = useState(editingTask?.notes ?? '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? initialPriority);
  const [assignedTo, setAssignedTo] = useState<string>(editingTask?.assignedTo ?? '');
  const [startDay, setStartDay] = useState<string>(editingTask?.startDay ?? initialDay ?? '');
  const [endDay, setEndDay] = useState<string>(editingTask?.endDay ?? initialDay ?? '');

  const [followUp, setFollowUp] = useState<string[]>(
    editingTask?.followUp ?? []
  );

  const [followUpInput, setFollowUpInput] = useState('');

  function addFollowUp() {
    const value = followUpInput.trim();
    if (!value) return;

    setFollowUp((prev) => [...prev, value]);
    setFollowUpInput('');
  }

  function removeFollowUp(index: number) {
    setFollowUp((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      notes: notes.trim() || undefined,
      priority,
      assignedTo: assignedTo || null,
      startDay: startDay || undefined,
      endDay: endDay || startDay || undefined,
      followUp: followUp || null,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl mb-5">
          {isEdit ? 'Edit task' : 'New task'}
          {!isEdit && dayLabel && <span className="text-ink-soft text-sm font-normal"> · {dayLabel}</span>}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">Title</span>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Confirm caterer headcount"
              required
              className="border border-line-strong rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-loop outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Task details…"
              required
              className="border border-line-strong rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-loop outline-none resize-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-ink-soft">Start day</span>
              <input
                type="date"
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
                required
                className="border border-line-strong rounded-lg px-3 py-2.5 text-sm bg-white focus:border-loop outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-ink-soft">End day</span>
              <input
                type="date"
                value={endDay}
                onChange={(e) => setEndDay(e.target.value)}
                required
                className="border border-line-strong rounded-lg px-3 py-2.5 text-sm bg-white focus:border-loop outline-none"
              />
            </label>
          </div>
          <p className="text-[11px] text-ink-soft -mt-2">Leave both blank for an unscheduled task that shows every day.</p>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-ink-soft">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="border border-line-strong rounded-lg px-3 py-2.5 text-sm bg-white focus:border-loop outline-none capitalize"
              >
                {(['urgent', 'normal', 'optional'] as Priority[]).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-ink-soft">Assign to</span>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="border border-line-strong rounded-lg px-3 py-2.5 text-sm bg-white focus:border-loop outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-ink-soft">
                Follow Up Notes
              </span>

              <div className="flex gap-2">
                <input
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  placeholder="Add follow-up note..."
                  className="flex-1 border border-line-strong rounded-lg px-3 py-2.5 text-sm bg-white focus:border-loop outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFollowUp();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={addFollowUp}
                  className="px-3 py-2 bg-loop text-white rounded-lg text-sm"
                >
                  Add
                </button>
              </div>

              {followUp.length > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  {followUp.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span>{item}</span>

                      <button
                        type="button"
                        onClick={() => removeFollowUp(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </label>

          </div>

          <div className="flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-ink text-white rounded-lg py-3 font-semibold text-sm hover:bg-loop transition-colors">
              {isEdit ? 'Save changes' : 'Create task'}
            </button>
            <button type="button" onClick={onClose} className="px-4 text-sm text-ink-soft hover:text-ink transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
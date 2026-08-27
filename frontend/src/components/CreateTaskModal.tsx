// src/components/CreateTaskModal.tsx
import { useState } from 'react';
import type { Member, Priority } from '../types';

interface CreateTaskModalProps {
  members: Member[];
  onClose: () => void;
  onCreate: (input: { title: string; notes?: string; priority: Priority; assignedTo: string | null }) => void;
}

const PRIORITIES: Priority[] = ['urgent', 'normal', 'optional'];

export function CreateTaskModal({ members, onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [assignedTo, setAssignedTo] = useState<string>('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      notes: notes.trim() || undefined,
      priority,
      assignedTo: assignedTo || null,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl mb-5">New task</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">Title</span>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Confirm caterer headcount"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border border-line-strong rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-loop outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">Notes</span>
            <textarea
              placeholder="Optional details…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="border border-line-strong rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-loop outline-none resize-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-ink-soft">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="border border-line-strong rounded-lg px-3 py-2.5 text-sm bg-white focus:border-loop outline-none capitalize"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} className="capitalize">
                    {p}
                  </option>
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
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-ink text-white rounded-lg py-3 font-semibold text-sm hover:bg-loop transition-colors"
            >
              Create task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 text-sm text-ink-soft hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
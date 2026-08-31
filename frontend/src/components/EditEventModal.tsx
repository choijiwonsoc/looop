import { useState } from 'react';
import type { EventBoard } from '../types';

const EVENT_TYPES = ['Project', 'Move', 'Conference', 'Party', 'Household', 'Other'];

interface EditEventModalProps {
  event: EventBoard;
  onClose: () => void;
  onSave: (updates: Partial<EventBoard>) => void;
}

export function EditEventModal({ event, onClose, onSave }: EditEventModalProps) {
  const [name, setName] = useState(event.name);
  const [type, setType] = useState(event.type ?? 'Other');
  const [description, setDescription] = useState(event.description ?? '');
  const [isOngoing, setIsOngoing] = useState(event.endDate === null);
  const [startDate, setStartDate] = useState(event.startDate);
  const [endDate, setEndDate] = useState(event.endDate ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: name.trim(),
      type,
      description: description.trim() || undefined,
      startDate,
      endDate: isOngoing ? null : endDate,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl mb-5">Edit event</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-line-strong rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-loop outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="border border-line-strong rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-loop outline-none resize-none"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">Type</span>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`border rounded-full px-3.5 py-1.5 text-xs transition-colors ${
                    type === t ? 'bg-loop border-loop text-white' : 'border-line-strong text-ink-soft bg-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wide text-ink-soft">Start</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-line-strong rounded-lg px-3 py-2.5 text-sm bg-white focus:border-loop outline-none"
              />
            </label>
            {!isOngoing && (
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wide text-ink-soft">End</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-line-strong rounded-lg px-3 py-2.5 text-sm bg-white focus:border-loop outline-none"
                />
              </label>
            )}
          </div>

          <label className="flex items-start gap-2 text-xs text-ink-soft leading-relaxed">
            <input type="checkbox" checked={isOngoing} onChange={(e) => setIsOngoing(e.target.checked)} className="mt-0.5" />
            <span>Ongoing — no end date</span>
          </label>

          <div className="flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-ink text-white rounded-lg py-3 font-semibold text-sm hover:bg-loop transition-colors">
              Save changes
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
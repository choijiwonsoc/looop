import { useState } from 'react';
import type { Issue, IssueSeverity } from '../types';

interface IssueFormModalProps {
  initialSeverity?: IssueSeverity;
  editingIssue?: Issue;
  onClose: () => void;
  onSubmit: (input: { description: string; severity: IssueSeverity }) => void;
}

const SEVERITY_PILL: Record<IssueSeverity, string> = {
  low: 'border-optional bg-optional-soft text-optional',
  medium: 'border-normal bg-normal-soft text-normal',
  high: 'border-urgent bg-urgent-soft text-urgent',
};

export function IssueFormModal({ initialSeverity = 'medium', editingIssue, onClose, onSubmit }: IssueFormModalProps) {
  const isEdit = !!editingIssue;
  const [description, setDescription] = useState(editingIssue?.description ?? '');
  const [severity, setSeverity] = useState<IssueSeverity>(editingIssue?.severity ?? initialSeverity);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description: description.trim(), severity });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl mb-5">{isEdit ? 'Edit issue' : 'Flag an issue'}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">What's wrong?</span>
            <input
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-line-strong rounded-lg px-3.5 py-2.5 text-sm bg-white focus:border-loop outline-none"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">Severity</span>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as IssueSeverity[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`border rounded-full px-3.5 py-1.5 text-xs capitalize transition-colors ${
                    severity === s ? SEVERITY_PILL[s] : 'border-line-strong text-ink-soft'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-ink text-white rounded-lg py-3 font-semibold text-sm hover:bg-loop transition-colors">
              {isEdit ? 'Save changes' : 'Flag it'}
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
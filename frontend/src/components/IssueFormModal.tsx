import { useState } from 'react';
import type { Issue, IssueSeverity } from '../types';

interface IssueFormModalProps {
  initialSeverity?: IssueSeverity;
  editingIssue?: Issue;
  onClose: () => void;
  onSubmit: (input: { description: string; severity: IssueSeverity, followUp?: string[] }) => void;
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
  const [followUp, setFollowUp] = useState<string[]>(
    editingIssue?.followUp ?? []
  );

  const [followUpInput, setFollowUpInput] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description: description.trim(), severity, followUp });
    onClose();
  }
  function addFollowUp() {
    const value = followUpInput.trim();
    if (!value) return;

    setFollowUp((prev) => [...prev, value]);
    setFollowUpInput('');
  }

  function removeFollowUp(index: number) {
    setFollowUp((prev) => prev.filter((_, i) => i !== index));
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
                  className={`border rounded-full px-3.5 py-1.5 text-xs capitalize transition-colors ${severity === s ? SEVERITY_PILL[s] : 'border-line-strong text-ink-soft'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
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
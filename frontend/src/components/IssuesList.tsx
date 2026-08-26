import { useState } from 'react';
import type { Issue, Member, IssueSeverity } from '../types';
import { SeverityBadge } from './PriorityBadge';
import { Avatar } from './Avatar';
import { LoopRing } from './LoopRing';
import { Card } from './Card';

interface IssuesListProps {
  issues: Issue[];
  members: Member[];
  onToggleResolved: (issueId: string) => void;
  onAddIssue: (description: string, severity: IssueSeverity) => void;
}

const SEVERITY_PILL: Record<IssueSeverity, string> = {
  low: 'border-optional bg-optional-soft text-optional',
  medium: 'border-normal bg-normal-soft text-normal',
  high: 'border-urgent bg-urgent-soft text-urgent',
};

export function IssuesList({ issues, members, onToggleResolved, onAddIssue }: IssuesListProps) {
  const [draftOpen, setDraftOpen] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [draftSeverity, setDraftSeverity] = useState<IssueSeverity>('medium');

  const memberById = Object.fromEntries(members.map((m) => [m.id, m]));
  const open = issues.filter((i) => !i.resolved);
  const resolved = issues.filter((i) => i.resolved);

  function submit() {
    if (draftText.trim()) onAddIssue(draftText.trim(), draftSeverity);
    setDraftText('');
    setDraftOpen(false);
    setDraftSeverity('medium');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl">Open issues</h3>
        <button
          onClick={() => setDraftOpen(true)}
          className="bg-urgent-soft text-urgent rounded-lg px-3.5 py-2 text-sm font-semibold"
        >
          + Flag an issue
        </button>
      </div>

      {draftOpen && (
        <Card className="flex flex-col gap-3 mb-4">
          <input
            autoFocus
            placeholder="What's wrong?"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="border border-line-strong rounded-md px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as IssueSeverity[]).map((s) => (
              <button
                key={s}
                onClick={() => setDraftSeverity(s)}
                className={`border rounded-full px-3 py-1 text-xs capitalize ${
                  draftSeverity === s ? SEVERITY_PILL[s] : 'border-line-strong text-ink-soft'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={submit} className="bg-ink text-white rounded-md px-4 py-2 text-sm font-semibold">
              Flag it
            </button>
            <button onClick={() => setDraftOpen(false)} className="text-ink-soft text-sm">
              Cancel
            </button>
          </div>
        </Card>
      )}

      {open.length === 0 && !draftOpen && <p className="text-ink-soft text-sm py-4">Nothing flagged. All clear.</p>}

      <div className="flex flex-col gap-2">
        {open.map((issue) => (
          <Card key={issue.id} className="flex items-center gap-3 py-3">
            <LoopRing complete={false} color="#E85D4A" size={16} onClick={() => onToggleResolved(issue.id)} />
            <p className="flex-1 text-sm m-0">{issue.description}</p>
            <SeverityBadge severity={issue.severity} />
            <Avatar member={memberById[issue.raisedBy]} size={20} />
          </Card>
        ))}
      </div>

      {resolved.length > 0 && (
        <>
          <h4 className="text-xs uppercase tracking-wide text-ink-soft mt-6 mb-3">Resolved</h4>
          <div className="flex flex-col gap-2">
            {resolved.map((issue) => (
              <Card key={issue.id} className="flex items-center gap-3 py-3 opacity-55">
                <LoopRing complete color="#8A9A7E" size={16} onClick={() => onToggleResolved(issue.id)} />
                <p className="flex-1 text-sm m-0 line-through">{issue.description}</p>
                <SeverityBadge severity={issue.severity} />
                <Avatar member={memberById[issue.resolvedBy ?? issue.raisedBy]} size={20} />
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
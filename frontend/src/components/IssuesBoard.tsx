import { useState } from 'react';
import type { Issue, Member, IssueSeverity } from '../types';
import { IssueCard } from './IssueCard';
import { IssueFormModal } from './IssueFormModal';
import { ConfirmDialog } from './ConfirmDialog';
import { LoopRing } from './LoopRing';
import { Avatar } from './Avatar';

interface IssuesBoardProps {
  issues: Issue[];
  members: Member[];
  onToggleResolved: (issueId: string) => void;
  onAddIssue: (description: string, severity: IssueSeverity) => void;
  onEditIssue: (issueId: string, updates: { description: string; severity: IssueSeverity }) => void;
  onDeleteIssue: (issueId: string) => void;
}

const COLUMNS: { key: IssueSeverity; label: string; border: string; text: string; color: string }[] = [
  { key: 'high', label: 'High', border: 'border-urgent', text: 'text-urgent', color: '#E85D4A' },
  { key: 'medium', label: 'Medium', border: 'border-normal', text: 'text-normal', color: '#C88A2A' },
  { key: 'low', label: 'Low', border: 'border-optional', text: 'text-optional', color: '#8A9A7E' },
];

export function IssuesBoard({ issues, members, onToggleResolved, onAddIssue, onEditIssue, onDeleteIssue }: IssuesBoardProps) {
  const memberById = Object.fromEntries(members.map((m) => [m.id, m]));
  const [modalSeverity, setModalSeverity] = useState<IssueSeverity | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deletingIssue, setDeletingIssue] = useState<Issue | null>(null);

  const open = issues.filter((i) => !i.resolved);
  const resolved = issues.filter((i) => i.resolved);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {COLUMNS.map((col) => {
          const colIssues = open.filter((i) => i.severity === col.key);
          return (
            <div key={col.key}>
              <div className={`flex items-center gap-2 text-xs uppercase tracking-wide pb-3 mb-3 border-b-2 ${col.border} ${col.text}`}>
                <span>{col.label}</span>
                <span className="bg-line text-ink rounded-full px-2 font-semibold">{colIssues.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {colIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    color={col.color}
                    raisedBy={memberById[issue.raisedBy]}
                    onToggleResolved={() => onToggleResolved(issue.id)}
                    onEdit={() => setEditingIssue(issue)}
                    onDelete={() => setDeletingIssue(issue)}
                  />
                ))}
                <button
                  onClick={() => setModalSeverity(col.key)}
                  className="border border-dashed border-line-strong rounded-lg p-3 text-sm text-ink-soft text-left hover:border-loop hover:text-loop transition-colors"
                >
                  + Flag issue
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {resolved.length > 0 && (
        <div className="mt-8">
          <div className="text-xs uppercase tracking-wide text-ink-soft border-t border-line pt-4 mb-3">
            Resolved ({resolved.length})
          </div>
          <div className="flex flex-col gap-2">
            {resolved.map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 opacity-55 py-1">
                <LoopRing complete color="#8A9A7E" size={14} onClick={() => onToggleResolved(issue.id)} />
                <p className="flex-1 text-sm m-0 line-through">{issue.description}</p>
                <Avatar member={memberById[issue.resolvedBy ?? issue.raisedBy]} size={18} />
              </div>
            ))}
          </div>
        </div>
      )}

      {modalSeverity && (
        <IssueFormModal
          initialSeverity={modalSeverity}
          onClose={() => setModalSeverity(null)}
          onSubmit={(input) => onAddIssue(input.description, input.severity)}
        />
      )}

      {editingIssue && (
        <IssueFormModal
          editingIssue={editingIssue}
          onClose={() => setEditingIssue(null)}
          onSubmit={(input) => onEditIssue(editingIssue.id, input)}
        />
      )}

      {deletingIssue && (
        <ConfirmDialog
          title="Delete this issue?"
          message={`"${deletingIssue.description}" will be removed.`}
          onConfirm={() => { onDeleteIssue(deletingIssue.id); setDeletingIssue(null); }}
          onCancel={() => setDeletingIssue(null)}
        />
      )}
    </div>
  );
}
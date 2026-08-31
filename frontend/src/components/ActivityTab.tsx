import type { Issue, Task, Member, HistoryEntry, IssueSeverity } from '../types';
import { IssuesBoard } from './IssuesBoard';
import { SummaryStrip } from './SummaryStrip';
import { HistoryLog } from './HistoryLog';

interface ActivityTabProps {
  issues: Issue[];
  tasks: Task[];
  members: Member[];
  history: HistoryEntry[];
  onToggleResolved: (issueId: string) => void;
  onAddIssue: (description: string, severity: IssueSeverity) => void;
  onEditIssue: (issueId: string, updates: { description: string; severity: IssueSeverity }) => void;
  onDeleteIssue: (issueId: string) => void;
}

export function ActivityTab({ issues, tasks, members, history, onToggleResolved, onAddIssue, onEditIssue, onDeleteIssue }: ActivityTabProps) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h3 className="text-xl mb-4">Issues</h3>
        <IssuesBoard
          issues={issues}
          members={members}
          onToggleResolved={onToggleResolved}
          onAddIssue={onAddIssue}
          onEditIssue={onEditIssue}
          onDeleteIssue={onDeleteIssue}
        />
      </div>
      <div>
        <h3 className="text-xl mb-4">Summary</h3>
        <SummaryStrip tasks={tasks} issues={issues} />
      </div>
      <div>
        <h3 className="text-xl mb-4">History</h3>
        <HistoryLog entries={history} members={members} />
      </div>
    </div>
  );
}
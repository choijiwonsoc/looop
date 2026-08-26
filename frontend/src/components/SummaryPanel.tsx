import type { Task, Issue } from '../types';
import { LoopRing } from './LoopRing';
import { Card } from './Card';

interface SummaryPanelProps {
  tasks: Task[];
  issues: Issue[];
}

export function SummaryPanel({ tasks, issues }: SummaryPanelProps) {
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : doneCount / totalCount;

  const urgentOpen = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;
  const openIssues = issues.filter((i) => !i.resolved);
  const highSeverityOpen = openIssues.filter((i) => i.severity === 'high').length;

  return (
    <Card className="max-w-md p-6">
      <div className="flex items-center gap-5 mb-6 pb-5 border-b border-line">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="38" fill="none" stroke="#E4E1D8" strokeWidth="8" />
          <circle
            cx="44" cy="44" r="38" fill="none" stroke="#2F5EFF" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 38 * progress} ${2 * Math.PI * 38}`}
            transform="rotate(-90 44 44)"
          />
        </svg>
        <div>
          <div className="text-3xl">{doneCount}/{totalCount}</div>
          <div className="text-xs uppercase tracking-wide text-ink-soft">tasks closed</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-3 text-sm">
          <LoopRing complete={false} color="#E85D4A" size={16} />
          <span>{urgentOpen} urgent task{urgentOpen === 1 ? '' : 's'} still open</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <LoopRing complete={false} color="#E85D4A" size={16} />
          <span>{highSeverityOpen} high-severity issue{highSeverityOpen === 1 ? '' : 's'} unresolved</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <LoopRing complete={false} color="#C88A2A" size={16} />
          <span>{openIssues.length} issue{openIssues.length === 1 ? '' : 's'} flagged total</span>
        </div>
      </div>

      <p className="text-xs text-ink-soft leading-relaxed m-0">
        Ask your agent "what's still not done" and it reads this same live state.
      </p>
    </Card>
  );
}
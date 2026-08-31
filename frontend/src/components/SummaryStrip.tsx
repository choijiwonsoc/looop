import type { Task, Issue } from '../types';

export function SummaryStrip({ tasks, issues }: { tasks: Task[]; issues: Issue[] }) {
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const totalCount = tasks.length;
  const urgentOpen = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;
  const issuesOpen = issues.filter((i) => !i.resolved).length;
  const highIssuesOpen = issues.filter((i) => i.severity === 'high' && !i.resolved).length;

  const stats = [
    { value: `${doneCount}/${totalCount}`, label: 'Tasks done', tone: 'text-ink' },
    { value: urgentOpen, label: 'Urgent open', tone: urgentOpen > 0 ? 'text-urgent' : 'text-optional' },
    { value: issuesOpen, label: 'Issues open', tone: issuesOpen > 0 ? 'text-normal' : 'text-optional' },
    { value: highIssuesOpen, label: 'High severity', tone: highIssuesOpen > 0 ? 'text-urgent' : 'text-optional' },
  ];

  return (
    <div className="flex items-stretch bg-white border border-line rounded-xl overflow-hidden">
      {stats.map((s, i) => (
        <div key={s.label} className={`flex-1 px-4 py-3 ${i > 0 ? 'border-l border-line' : ''}`}>
          <div className={`text-xl ${s.tone}`}>{s.value}</div>
          <div className="text-[11px] uppercase tracking-wide text-ink-soft mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
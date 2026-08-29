import type { Task, Issue } from '../types';

export function computeHealth(tasks: Task[], issues: Issue[]): number {
  const urgentOpen = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;
  const normalOpen = tasks.filter((t) => t.priority === 'normal' && t.status !== 'done').length;
  const highIssuesOpen = issues.filter((i) => i.severity === 'high' && !i.resolved).length;
  const score = 100 - urgentOpen * 15 - highIssuesOpen * 20 - normalOpen * 5;
  return Math.max(0, Math.min(100, score));
}
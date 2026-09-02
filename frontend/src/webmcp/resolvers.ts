import { getEvents, getTasks, getIssues } from '../api-handlers/event';
import { getIdentity } from '../identity';

function fuzzyFind<T>(items: T[], query: string, getLabel: (item: T) => string): T {
  const q = query.trim().toLowerCase();

  const exact = items.filter((i) => getLabel(i).toLowerCase() === q);
  if (exact.length === 1) return exact[0];

  const partial = items.filter((i) => getLabel(i).toLowerCase().includes(q));
  if (partial.length === 1) return partial[0];
  if (partial.length > 1) {
    const names = partial.map((i) => `"${getLabel(i)}"`).join(', ');
    throw new Error(`Multiple matches for "${query}": ${names}. Be more specific.`);
  }
  throw new Error(`No match found for "${query}".`);
}

export async function resolveEventId(input: { eventId?: string; eventName?: string }): Promise<string> {
  if (input.eventId) return input.eventId;
  if (!input.eventName) throw new Error('Provide either eventId or eventName.');
  const member = getIdentity();
  const events = await getEvents(member.id);
  return fuzzyFind(events, input.eventName, (e) => e.name).id;
}

export async function resolveTaskId(eventId: string, input: { taskId?: string; taskTitle?: string }): Promise<string> {
  if (input.taskId) return input.taskId;
  if (!input.taskTitle) throw new Error('Provide either taskId or taskTitle.');
  const tasks = await getTasks(eventId);
  return fuzzyFind(tasks, input.taskTitle, (t) => t.title).id;
}

export async function resolveIssueId(eventId: string, input: { issueId?: string; issueDescription?: string }): Promise<string> {
  if (input.issueId) return input.issueId;
  if (!input.issueDescription) throw new Error('Provide either issueId or issueDescription.');
  const issues = await getIssues(eventId);
  return fuzzyFind(issues, input.issueDescription, (i) => i.description).id;
}
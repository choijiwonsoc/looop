import { getEvents, getTasks, getIssues, getMembers } from '../api-handlers/event';
import { getIdentity } from '../identity';

function fuzzyFind<T>(items: T[], query: string, getLabel: (item: T) => string): T {
  const q = query.trim().toLowerCase();

  const exact = items.filter((i) => getLabel(i).toLowerCase() === q);
  if (exact.length === 1) return exact[0];

  const partial = items.filter((i) => getLabel(i).toLowerCase().includes(q));
  if (partial.length === 1) return partial[0];
  if (partial.length > 1) {
    const names = partial.map((i) => `"${getLabel(i)}"`).join(', ');
    throw new Error(`Multiple matches for "${query}": ${names}. Ask the user which one they mean, then retry with the exact name or its id.`);
  }
  throw new Error(`No match found for "${query}".Ask the user to confirm or double-check the name, then retry.`);
}

export async function resolveEventId(input: { eventId?: string; eventName?: string }): Promise<string> {
  if (input.eventId) return input.eventId;
  if (!input.eventName) throw new Error('No event was specified. Ask the user which event they mean, then retry with eventId or eventName.');
  const member = getIdentity();
  const events = await getEvents(member.id);
  return fuzzyFind(events, input.eventName, (e) => e.name).id;
}

export async function resolveTaskId(eventId: string, input: { taskId?: string; taskTitle?: string }): Promise<string> {
  if (input.taskId) return input.taskId;
  if (!input.taskTitle) throw new Error('Ask the user which task they mean, then retry with taskId or taskTitle.');
  const tasks = await getTasks(eventId);
  return fuzzyFind(tasks, input.taskTitle, (t) => t.title).id;
}

export async function resolveIssueId(eventId: string, input: { issueId?: string; issueDescription?: string }): Promise<string> {
  if (input.issueId) return input.issueId;
  if (!input.issueDescription) throw new Error('No issue was specified. Ask the user which issue they mean, then retry with issueId or issueDescription.');
  const issues = await getIssues(eventId);
  return fuzzyFind(issues, input.issueDescription, (i) => i.description).id;
}

export async function resolveMemberId(
  eventId: string,
  input: { memberId?: string; memberName?: string }
): Promise<string> {

  if (input.memberId) return input.memberId;

  // Otherwise, a name is required
  if (!input.memberName) {
    throw new Error(
      'No member was specified. Ask the user which member they mean, then retry with memberId or memberName.'
    );
  }

  const members = await getMembers(eventId);

  return fuzzyFind(
    members,
    input.memberName,
    (m) => m.name
  ).id;
}
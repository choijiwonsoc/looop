import { EventBoard, Task, Issue, IssueSeverity, TaskStatus, Member } from "../types";
import { API_BASE_URL } from "../api";


export async function getAllIssuesRaw(): Promise<Issue[]> {
  const response = await fetch(`${API_BASE_URL}/api/issues`);

  if (!response.ok) {
    throw new Error(`Failed to fetch events ${response.status}`);
  }
  const data = await response.json();
  console.log(data);
  return data;
}

export async function createIssue(input: {
  eventId: string;
  description: string;
  severity: IssueSeverity;
  raisedBy: string;
}): Promise<Issue> {
  const response = await fetch(`${API_BASE_URL}/api/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events ${response.status}`);
  }
  const data = await response.json();
  console.log(data);
  return data;
}

export async function resolveIssue(input: {
  eventId: string;
  issueId: string;
  resolved: boolean;
  resolvedBy?: string;
  followUp?: string[];
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/events/${input.eventId}/issues/${input.issueId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      resolved: input.resolved,
      resolvedBy: input.resolvedBy,
      followUp: input.followUp,
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events ${response.status}`);
  }
  const data = await response.json();
  console.log(data);
  return data;
}

export async function editIssue(input: {
  eventId: string;
  issueId: string;
  description?: string;
  severity?: IssueSeverity;
  followUp?: string[];
}): Promise<Issue> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${input.eventId}/issues/${input.issueId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: input.description,
        severity: input.severity,
        followUp: input.followUp,
      }),
    }
  );
  if (!response.ok) throw new Error(`Failed to edit issue ${response.status}`);
  return response.json();
}

export async function deleteIssue(input: {
  eventId: string;
  issueId: string;
}): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${input.eventId}/issues/${input.issueId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete issue ${response.status}`);
  }
  // DELETE typically returns no body, or a small confirmation — no need to parse/return data
}
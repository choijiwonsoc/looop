import { EventBoard, Task, Issue, IssueSeverity, TaskStatus, Member } from "../types";
import { API_BASE_URL } from "../api";

export async function getEvents(memberId: string): Promise<EventBoard[]>{
  console.log(API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/api/events?memberId=${encodeURIComponent(memberId)}`);

    if(!response.ok){
        throw new Error(`Failed to fetch events ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}

export async function joinEvent(input: { inviteCode: string; member: Member }): Promise<EventBoard> {
  const response = await fetch(`${API_BASE_URL}/api/events/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(`Failed to join event ${response.status}`);
  return response.json();
}

export async function createEvent(input:{
    name: string;
    type: string;
    description: string;
    startDate: string;
    endDate?: string;
    members: Member[];
    inviteCode: string;
}): Promise<void>{
    const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            name: input.name,
            type: input.type,
            description: input.description,
            startDate: input.startDate,
            endDate: input.endDate,
            members: input.members,
            inviteCode: input.inviteCode
        })
    });

    if(!response.ok){
        throw new Error(`Failed to fetch events ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}


export async function editEvent(input: {
  eventId: string;
  name?: string;
  type?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}): Promise<EventBoard> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${input.eventId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        type: input.type,
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate
      }),
    }
  );
  if (!response.ok) throw new Error(`Failed to edit event ${response.status}`);
  return response.json();
}


export async function deleteEvent(input: {
  eventId: string;
}): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/events/${input.eventId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete event ${response.status}`);
  }
  // DELETE typically returns no body, or a small confirmation — no need to parse/return data
}

export async function getTasks(eventId: string): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/tasks`);
  if (!response.ok) throw new Error(`Failed to fetch tasks ${response.status}`);
  return response.json();
}

export async function getIssues(eventId: string): Promise<Issue[]> {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/issues`);
  if (!response.ok) throw new Error(`Failed to fetch issues ${response.status}`);
  return response.json();
}
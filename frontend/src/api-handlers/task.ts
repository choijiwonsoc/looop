import { EventBoard, Task, Issue, IssueSeverity, TaskStatus, Member, Priority } from "../types";
import { API_BASE_URL } from "../api";


export async function getTasks(): Promise<Task[]>{
    const response = await fetch(`${API_BASE_URL}/get-tasks`);

    if(!response.ok){
        throw new Error(`Failed to fetch events ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}

export async function createTask(input:{
    eventId: string;
    title: string;
    notes: string;
    priority: Priority;
    status: TaskStatus;
    assignedTo: string;
    dueDate: number;
    createdAt: string;
    updatedAt: string;
    followUp?: string[];

}): Promise<void>{
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            eventId: input.eventId,
            title: input.title,
            notes: input.notes,
            priority: input.priority,
            status: input.status,
            assignedTo: input.assignedTo,
            dueDate: input.dueDate,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            followUp: input.followUp,
        })
    });

    if(!response.ok){
        throw new Error(`Failed to fetch events ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}


export async function completeTask(input:{
    eventId: string;
    taskId: string;
    status: TaskStatus;
    followUp?: string[],
}): Promise<void>{
    const response = await fetch(`${API_BASE_URL}/events/${input.eventId}/tasks/${input.taskId}/status`, {
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            status: input.status,
            followUp: input.followUp,
        })
    });

    if(!response.ok){
        throw new Error(`Failed to fetch events ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}

export async function editTask(input: {
  eventId: string;
  taskId: string;
  notes?: string;
  priority?: Priority;
  assignedTo?: string;
  dueDay?: number;
}): Promise<Task> {
  const response = await fetch(
    `${API_BASE_URL}/events/${input.eventId}/tasks/${input.taskId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: input.notes,
        priority: input.priority,
        assignedTo: input.assignedTo,
        dueDay: input.dueDay,
      }),
    }
  );
  if (!response.ok) throw new Error(`Failed to edit task ${response.status}`);
  return response.json();
}

export async function deleteTask(input: {
  eventId: string;
  taskId: string;
}): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/events/${input.eventId}/tasks/${input.taskId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete task ${response.status}`);
  }
  // DELETE typically returns no body, or a small confirmation — no need to parse/return data
}
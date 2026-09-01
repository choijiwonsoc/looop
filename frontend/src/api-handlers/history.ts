import type { HistoryEntry } from "../types";
import { API_BASE_URL } from "../api";

export async function getHistory(eventId: string): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/history`);
  if (!response.ok) throw new Error(`Failed to fetch history ${response.status}`);
  return response.json();
}
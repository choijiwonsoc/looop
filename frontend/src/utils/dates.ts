const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Parse an ISO date string as UTC midnight to avoid timezone drift
function toUTCms(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00Z').getTime();
}

export function daysBetween(startStr: string, endStr: string): number {
  return Math.round((toUTCms(endStr) - toUTCms(startStr)) / MS_PER_DAY);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Returns 1-indexed day number relative to event start. Can be <1 (not started) or >totalDays (ended).
export function currentDayIndex(startDate: string): number {
  return daysBetween(startDate, todayISO()) + 1;
}
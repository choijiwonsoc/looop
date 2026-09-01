const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toUTCms(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00Z').getTime();
}

export function daysBetween(startStr: string, endStr: string): number {
  return Math.round((toUTCms(endStr) - toUTCms(startStr)) / MS_PER_DAY);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function currentDayIndex(startDate: string): number {
  return daysBetween(startDate, todayISO()) + 1;
}

export function dateForDay(startDate: string, day: number): Date {
  return new Date(toUTCms(startDate) + (day - 1) * MS_PER_DAY);
}

export function isoDateForDay(startDate: string, day: number): string {
  return dateForDay(startDate, day).toISOString().slice(0, 10);
}

// NEW — inverse: convert a calendar date back into a rail day-index
export function dayIndexForDate(startDate: string, dateStr: string): number {
  return daysBetween(startDate, dateStr) + 1;
}

export function formatDayDate(startDate: string, day: number): string {
  return dateForDay(startDate, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTaskDateRange(startDay?: string, endDay?: string): string | null {
  if (!startDay && !endDay) return null;
  const start = startDay ?? endDay!;
  const end = endDay ?? startDay!;
  const fmt = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return start === end ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}
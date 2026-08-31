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

export function formatDayDate(startDate: string, day: number): string {
  return dateForDay(startDate, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
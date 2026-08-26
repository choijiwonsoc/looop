import type { TimelineItem } from '../types';

export function TimelineView({ items }: { items: TimelineItem[] }) {
  const days = Array.from(new Set(items.map((i) => i.day))).sort((a, b) => a - b);

  if (days.length === 0) {
    return <p className="text-ink-soft text-sm py-5">No timeline yet. Add the first stop for Day 1.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {days.map((day) => {
        const dayItems = items.filter((i) => i.day === day).sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
        return (
          <div key={day}>
            <div className="text-xl mb-3">Day {day}</div>
            <div className="flex flex-col border-l-2 border-line ml-1">
              {dayItems.map((item) => (
                <div key={item.id} className="flex items-baseline gap-3 py-3 pl-5 relative">
                  <span className="absolute -left-[5px] top-[18px] w-2 h-2 rounded-full bg-loop" />
                  <span className="text-xs text-ink-soft min-w-[44px]">{item.time ?? '—'}</span>
                  <span className="text-sm">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
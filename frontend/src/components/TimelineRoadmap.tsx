import { useState } from 'react';
import type { EventBoard, Task, TimelineItem } from '../types';
import { daysBetween, currentDayIndex } from '../utils/dates';

interface TimelineRoadmapProps {
  event: EventBoard;
  tasks: Task[];
  items: TimelineItem[];
}

export function TimelineRoadmap({ event, tasks, items }: TimelineRoadmapProps) {
  const totalDays = daysBetween(event.startDate, event.endDate!) + 1;
  const rawToday = currentDayIndex(event.startDate);
  const todayIndex = Math.max(1, Math.min(totalDays, rawToday));

  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const isViewingToday = selectedDay === todayIndex;
  const dueThisDay = tasks.filter((t) => t.dueDay === selectedDay && t.status !== 'done').length;
  const ongoing = tasks.filter(
    (t) => t.status !== 'done' && (t.dueDay === undefined || t.dueDay <= selectedDay)
  ).length;

  const dayItems = items
    .filter((i) => i.day === selectedDay)
    .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));

  const daysList = Array.from({ length: totalDays }, (_, i) => i + 1);

  let statusNote = '';
  if (rawToday < 1) statusNote = `Starts in ${1 - rawToday} day${1 - rawToday === 1 ? '' : 's'}`;
  else if (rawToday > totalDays) statusNote = 'Event has ended';
  else if (totalDays - rawToday > 0) statusNote = `${totalDays - rawToday} day${totalDays - rawToday === 1 ? '' : 's'} left`;
  else statusNote = 'Last day';

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-1">
        <h3 className="text-xl">
          {isViewingToday ? `You're on Day ${selectedDay}` : `Day ${selectedDay}`}
          <span className="text-ink-soft text-sm font-normal ml-2">of {totalDays}</span>
        </h3>
        {isViewingToday && <span className="text-xs text-ink-soft">{statusNote}</span>}
      </div>

      {/* progress bar */}
      <div className="relative h-2 bg-line rounded-full mb-6">
        <div
          className="absolute h-2 bg-loop rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, (todayIndex / totalDays) * 100))}%` }}
        />
        {!isViewingToday && (
          <div
            className="absolute top-1/2 w-3 h-3 bg-white border-2 border-loop rounded-full -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
            style={{ left: `${((selectedDay - 0.5) / totalDays) * 100}%` }}
          />
        )}
      </div>

      {/* stats */}
      <div className="flex gap-8 mb-6">
        <div>
          <div className="text-2xl">{ongoing}</div>
          <div className="text-xs uppercase tracking-wide text-ink-soft">Ongoing tasks</div>
        </div>
        <div>
          <div className="text-2xl">{dueThisDay}</div>
          <div className="text-xs uppercase tracking-wide text-ink-soft">
            {isViewingToday ? 'Due today' : `Due Day ${selectedDay}`}
          </div>
        </div>
      </div>

      {/* day tabs — horizontally scrollable */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setSelectedDay((d) => Math.max(1, d - 1))}
          disabled={selectedDay === 1}
          className="flex-shrink-0 text-ink-soft hover:text-loop disabled:opacity-30 disabled:hover:text-ink-soft transition-colors px-1"
          aria-label="Previous day"
        >
          ‹
        </button>

        <div className="flex gap-2 overflow-x-auto pb-1 scroll-smooth">
          {daysList.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`flex-shrink-0 relative px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                d === selectedDay
                  ? 'bg-ink text-white'
                  : 'bg-white border border-line text-ink-soft hover:border-loop hover:text-loop'
              }`}
            >
              Day {d}
              {d === todayIndex && (
                <span
                  className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                    d === selectedDay ? 'bg-white' : 'bg-loop'
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSelectedDay((d) => Math.min(totalDays, d + 1))}
          disabled={selectedDay === totalDays}
          className="flex-shrink-0 text-ink-soft hover:text-loop disabled:opacity-30 disabled:hover:text-ink-soft transition-colors px-1"
          aria-label="Next day"
        >
          ›
        </button>
      </div>

      {/* selected day's timeline items */}
      {dayItems.length === 0 ? (
        <p className="text-ink-soft text-sm py-4">Nothing scheduled for Day {selectedDay} yet.</p>
      ) : (
        <div className="flex flex-col border-l-2 border-line ml-1">
          {dayItems.map((item) => (
            <div key={item.id} className="flex items-baseline gap-3 py-3 pl-5 relative">
              <span className="absolute -left-[5px] top-[18px] w-2 h-2 rounded-full bg-loop" />
              <span className="text-xs text-ink-soft min-w-[44px]">{item.time ?? '—'}</span>
              <span className="text-sm">{item.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
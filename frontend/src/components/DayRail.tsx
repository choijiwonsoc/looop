import { formatDayDate } from '../utils/dates';

interface DayRailProps {
  startDate: string;
  totalDays: number;
  todayIndex: number;
  hasStarted: boolean;
  hasEnded: boolean;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  countForDay: (day: number) => number;
}

export function DayRail({
  startDate,
  totalDays,
  todayIndex,
  hasStarted,
  hasEnded,
  selectedDay,
  onSelectDay,
  countForDay,
}: DayRailProps) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const progressPct = (Math.min(Math.max(todayIndex, 1), totalDays) / totalDays) * 100;

  return (
    <div className="flex flex-col">
      <div className="text-[11px] uppercase tracking-wide text-ink-soft mb-3">
        {!hasStarted ? 'Starts soon' : hasEnded ? 'Ended' : 'In progress'}
      </div>

      <div className="relative flex flex-col gap-1 pl-6">
        <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-line" />
        <div
          className="absolute left-[5px] top-2 w-[2px] bg-loop transition-all duration-500"
          style={{ height: `${progressPct}%` }}
        />

        {days.map((d) => {
          const isSelected = d === selectedDay;
          const isToday = d === todayIndex;
          const count = countForDay(d);
          return (
            <button
              key={d}
              onClick={() => onSelectDay(d)}
              className={`flex items-center gap-2 pr-2 py-2 -ml-6 pl-6 rounded-lg text-left relative transition-colors ${
                isSelected ? 'bg-ink text-white' : 'hover:bg-white text-ink-soft'
              }`}
            >
              <span
                className={`absolute left-[1px] w-[10px] h-[10px] rounded-full border-2 ${
                  isSelected
                    ? 'bg-white border-white'
                    : isToday
                    ? 'bg-loop border-loop'
                    : 'bg-bg border-line-strong'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${isSelected ? 'text-white' : 'text-ink'}`}>Day {d}</div>
                <div className={`text-[11px] ${isSelected ? 'text-white/70' : 'text-ink-soft'}`}>
                  {formatDayDate(startDate, d)}
                </div>
              </div>
              {count > 0 && (
                <span
                  className={`text-[11px] rounded-full px-1.5 font-medium flex-shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-line text-ink'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
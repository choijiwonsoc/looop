import { useMemo, useState } from 'react';
import type { EventBoard, Task, Priority } from '../types';
import { DayRail } from './DayRail';
import { TaskDayColumns } from './TaskDayColumns';
import { CreateTaskModal } from './CreateTaskModal';
import { ConfirmDialog } from './ConfirmDialog';
import { currentDayIndex, daysBetween, formatDayDate, isoDateForDay, dayIndexForDate } from '../utils/dates';

interface DayBoardTabProps {
  event: EventBoard;
  tasks: Task[];
  currentUserId: string;
  onToggleTaskDone: (taskId: string) => void;
  onAddTask: (input: { title: string; notes?: string; priority: Priority; assignedTo: string | null; startDay?: string; endDay?: string }) => void;
  onEditTask: (taskId: string, updates: { title: string; notes?: string; priority: Priority; assignedTo: string | null; startDay?: string; endDay?: string }) => void;
  onDeleteTask: (taskId: string) => void;
}

function taskSpansDate(task: Task, dateStr: string): boolean {
  const start = task.startDay ?? task.endDay;
  const end = task.endDay ?? task.startDay;
  if (!start || !end) return true; // no dates set — unscheduled, shows every day
  return dateStr >= start && dateStr <= end; // ISO strings compare lexicographically = chronologically
}

export function DayBoardTab({ event, tasks, currentUserId, onToggleTaskDone, onAddTask, onEditTask, onDeleteTask }: DayBoardTabProps) {
  const rawToday = currentDayIndex(event.startDate);

  const maxTaskDay = tasks.reduce((max, t) => {
    const dates = [t.startDay, t.endDay].filter((d): d is string => !!d);
    if (dates.length === 0) return max;
    const indices = dates.map((d) => dayIndexForDate(event.startDate, d));
    return Math.max(max, ...indices);
  }, 0);

  const totalDays = event.endDate ? daysBetween(event.startDate, event.endDate) + 1 : Math.max(rawToday, maxTaskDay, 1) + 3;
  const todayIndex = Math.max(1, Math.min(totalDays, rawToday));
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [modalPriority, setModalPriority] = useState<Priority | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const selectedDate = isoDateForDay(event.startDate, selectedDay);
  const dayTasks = useMemo(() => tasks.filter((t) => taskSpansDate(t, selectedDate)), [tasks, selectedDate]);

  function countForDay(day: number) {
    const dateStr = isoDateForDay(event.startDate, day);
    return tasks.filter((t) => taskSpansDate(t, dateStr) && t.status !== 'done').length;
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5 flex-wrap gap-1">
        <h3 className="text-xl">
          {selectedDay === todayIndex ? `You're on Day ${selectedDay}` : `Day ${selectedDay}`}
          {event.endDate && <span className="text-ink-soft text-sm font-normal ml-2">of {totalDays}</span>}
        </h3>
        <span className="text-xs text-ink-soft">{formatDayDate(event.startDate, selectedDay)}</span>
      </div>

      <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-5 -mx-1 px-1">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`flex-shrink-0 relative px-3.5 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              d === selectedDay ? 'bg-ink text-white' : 'bg-white border border-line text-ink-soft hover:border-loop hover:text-loop'
            }`}
          >
            Day {d}
            {d === todayIndex && <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${d === selectedDay ? 'bg-white' : 'bg-loop'}`} />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[18%_1fr] gap-8">
        <div className="hidden md:block sticky top-6 self-start max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
          <DayRail
            startDate={event.startDate}
            totalDays={totalDays}
            todayIndex={todayIndex}
            hasStarted={rawToday >= 1}
            hasEnded={!!event.endDate && rawToday > totalDays}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            countForDay={countForDay}
          />
        </div>

        <TaskDayColumns
          tasks={dayTasks}
          members={event.members}
          currentUserId={currentUserId}
          onToggleTaskDone={onToggleTaskDone}
          onAddTaskForPriority={(priority) => setModalPriority(priority)}
          onEditTask={setEditingTask}
          onDeleteTask={setDeletingTask}
        />
      </div>

      {modalPriority && (
        <CreateTaskModal
          members={event.members}
          initialPriority={modalPriority}
          initialDay={selectedDate}
          dayLabel={`Day ${selectedDay}`}
          onClose={() => setModalPriority(null)}
          onSubmit={onAddTask}
        />
      )}

      {editingTask && (
        <CreateTaskModal
          members={event.members}
          editingTask={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(input) => onEditTask(editingTask.id, input)}
        />
      )}

      {deletingTask && (
        <ConfirmDialog
          title="Delete this task?"
          message={`"${deletingTask.title}" will be removed from the board.`}
          onConfirm={() => { onDeleteTask(deletingTask.id); setDeletingTask(null); }}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
}
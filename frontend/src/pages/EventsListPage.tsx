import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockEvents, mockTasks, mockIssues } from '../data/mockData';
import { EventCard } from '../components/EventCard';
import { EditEventModal } from '../components/EditEventModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { computeHealth } from '../utils/health';
import type { EventBoard } from '../types';

export function EventsListPage() {
  const [events, setEvents] = useState<EventBoard[]>(mockEvents);
  const [editingEvent, setEditingEvent] = useState<EventBoard | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventBoard | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const enriched = events.map((event) => {
    const tasks = mockTasks.filter((t) => t.eventId === event.id);
    const issues = mockIssues.filter((i) => i.eventId === event.id);
    return {
      event,
      health: computeHealth(tasks, issues),
      urgentOpen: tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length,
      issuesOpen: issues.filter((i) => !i.resolved).length,
    };
  });

  const types = Array.from(new Set(events.map((e) => e.type).filter(Boolean))) as string[];
  const filtered = typeFilter ? enriched.filter((e) => e.event.type === typeFilter) : enriched;
  const sorted = [...filtered].sort((a, b) => a.health - b.health);

  const needsAttention = enriched.filter((e) => e.health < 80).length;
  const totalUrgent = enriched.reduce((sum, e) => sum + e.urgentOpen, 0);
  const totalIssues = enriched.reduce((sum, e) => sum + e.issuesOpen, 0);

  function saveEventEdit(updates: Partial<EventBoard>) {
    if (!editingEvent) return;
    setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? { ...e, ...updates } : e)));
    // TODO: call editEvent() API
  }

  function confirmDeleteEvent() {
    if (!deletingEvent) return;
    setEvents((prev) => prev.filter((e) => e.id !== deletingEvent.id));
    setDeletingEvent(null);
    // TODO: call deleteEvent() API
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-10">
      {/* compact header */}
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-soft mb-1">Dashboard</p>
          <h1 className="text-2xl">Your events</h1>
        </div>
        <Link
          to="/new"
          className="inline-flex items-center bg-ink text-bg font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-loop transition-colors"
        >
          + New event
        </Link>
      </div>

      {/* overview stats */}
      <div className="flex items-stretch bg-white border border-line rounded-xl overflow-hidden mb-6">
        {[
          { value: events.length, label: 'Total events', tone: 'text-ink' },
          { value: needsAttention, label: 'Need attention', tone: needsAttention > 0 ? 'text-normal' : 'text-optional' },
          { value: totalUrgent, label: 'Urgent tasks open', tone: totalUrgent > 0 ? 'text-urgent' : 'text-optional' },
          { value: totalIssues, label: 'Issues open', tone: totalIssues > 0 ? 'text-urgent' : 'text-optional' },
        ].map((s, i) => (
          <div key={s.label} className={`flex-1 px-4 py-3 ${i > 0 ? 'border-l border-line' : ''}`}>
            <div className={`text-xl ${s.tone}`}>{s.value}</div>
            <div className="text-[11px] uppercase tracking-wide text-ink-soft mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* filter chips */}
      {types.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTypeFilter(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              typeFilter === null ? 'bg-ink text-white border-ink' : 'border-line-strong text-ink-soft'
            }`}
          >
            All
          </button>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                typeFilter === t ? 'bg-ink text-white border-ink' : 'border-line-strong text-ink-soft'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink-soft text-sm mb-4">No boards yet.</p>
          <Link to="/new" className="text-loop font-medium text-sm">Create your first event →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map(({ event, health, urgentOpen, issuesOpen }) => (
            <EventCard
              key={event.id}
              event={event}
              health={health}
              urgentOpen={urgentOpen}
              issuesOpen={issuesOpen}
              onEdit={() => setEditingEvent(event)}
              onDelete={() => setDeletingEvent(event)}
            />
          ))}
        </div>
      )}

      {editingEvent && (
        <EditEventModal event={editingEvent} onClose={() => setEditingEvent(null)} onSave={saveEventEdit} />
      )}

      {deletingEvent && (
        <ConfirmDialog
          title={`Delete "${deletingEvent.name}"?`}
          message="This removes the event board. Tasks and issues on it will no longer be reachable."
          onConfirm={confirmDeleteEvent}
          onCancel={() => setDeletingEvent(null)}
        />
      )}
    </div>
  );
}
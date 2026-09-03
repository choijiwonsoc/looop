import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, editEvent, deleteEvent, getTasks, getIssues } from '../api-handlers/event';
import { EventCard } from '../components/EventCard';
import { EditEventModal } from '../components/EditEventModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { computeHealth } from '../utils/health';
import type { EventBoard } from '../types';
import { getIdentity } from '../identity';
import { LooopHero } from '../components/Hero';
import { WebMCPCard } from '../components/WebMCPCard';

interface EnrichedEvent {
  event: EventBoard;
  health: number;
  urgentOpen: number;
  issuesOpen: number;
}

export function EventsListPage() {
  const [enriched, setEnriched] = useState<EnrichedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventBoard | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventBoard | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  async function loadEvents() {
    setLoading(true);
    setLoadError(null);
    try {
      const member = getIdentity();
      const events = await getEvents(member.id);
      const withStats = await Promise.all(
        events.map(async (event) => {
          const [tasks, issues] = await Promise.all([getTasks(event.id), getIssues(event.id)]);
          return {
            event,
            health: computeHealth(tasks, issues),
            urgentOpen: tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length,
            issuesOpen: issues.filter((i) => !i.resolved).length,
          };
        })
      );
      setEnriched(withStats);
    } catch (err) {
      console.error(err);
      setLoadError('Could not load events. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const events = enriched.map((e) => e.event);
  const types = Array.from(new Set(events.map((e) => e.type).filter(Boolean))) as string[];
  const filtered = typeFilter ? enriched.filter((e) => e.event.type === typeFilter) : enriched;
  const sorted = [...filtered].sort((a, b) => a.health - b.health);

  const needsAttention = enriched.filter((e) => e.health < 80).length;
  const totalUrgent = enriched.reduce((sum, e) => sum + e.urgentOpen, 0);
  const totalIssues = enriched.reduce((sum, e) => sum + e.issuesOpen, 0);

  async function saveEventEdit(updates: Partial<EventBoard>) {
    if (!editingEvent) return;
    try {
      await editEvent({
        eventId: editingEvent.id,
        name: updates.name,
        type: updates.type,
        description: updates.description,
        startDate: updates.startDate,
        // Note: switching a dated event to "ongoing" via edit isn't fully wired —
        // clearing endDate server-side needs an explicit-null vs omitted distinction
        // that's a bigger change. Create a new event for that case for now.
        endDate: updates.endDate ?? undefined,
      });
      setEditingEvent(null);
      await loadEvents();
    } catch (err) {
      console.error(err);
      alert('Failed to save changes. Please try again.');
    }
  }

  async function confirmDeleteEvent() {
    if (!deletingEvent) return;
    try {
      await deleteEvent({ eventId: deletingEvent.id });
      setDeletingEvent(null);
      await loadEvents();
    } catch (err) {
      console.error(err);
      alert('Failed to delete event. Please try again.');
    }
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16 text-center text-ink-soft">Loading events…</div>;
  }

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16 text-center">
        <p className="text-urgent text-sm mb-3">{loadError}</p>
        <button onClick={loadEvents} className="text-loop text-sm font-medium">Try again</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-10">
      <LooopHero />
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

      {types.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTypeFilter(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${typeFilter === null ? 'bg-ink text-white border-ink' : 'border-line-strong text-ink-soft'
              }`}
          >
            All
          </button>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${typeFilter === t ? 'bg-ink text-white border-ink' : 'border-line-strong text-ink-soft'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

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
      <div className="mt-10">
        <WebMCPCard />
      </div>
    </div>

  );
}
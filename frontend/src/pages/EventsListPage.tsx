import { Link } from 'react-router-dom';
import { mockEvents, mockTasks, mockIssues } from '../data/mockData';
import { EventCard } from '../components/EventCard';
import { EventPulse } from '../components/EventPulse';
import { computeHealth } from '../utils/health';

export function EventsListPage() {
  const withHealth = mockEvents.map((event) => ({
    event,
    health: computeHealth(
      mockTasks.filter((t) => t.eventId === event.id),
      mockIssues.filter((i) => i.eventId === event.id)
    ),
  }));

  return (
    <div className="mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <div className="mb-14 ">
        <h1 className="text-4xl sm:text-5xl leading-tight mb-4">
          The plan lives here.<br />Not scattered across five chats.
        </h1>
        <p className="text-base text-ink-soft leading-relaxed mb-5">
          Every event gets one board. Add it, ask your agent about it, or just click around —
          everyone sees the same live picture.
        </p>
        <Link
          to="/new"
          className="inline-flex items-center bg-ink text-bg font-semibold text-sm px-5 py-3 rounded-lg hover:bg-loop transition-colors"
        >
          + New event
        </Link>
      </div>
      <EventPulse events={withHealth} />

      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-soft border-b border-line pb-3 mb-5">
          <span>Your events</span>
          <span className="bg-line text-ink rounded-full px-2 font-semibold">{mockEvents.length}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { mockEvents } from '../data/mockData';
import { EventCard } from '../components/EventCard';

export function EventsListPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <div className="mb-14 max-w-xl">
        <h1 className="text-4xl sm:text-5xl leading-tight mb-4">
          The plan lives here.<br />Not scattered across five chats.
        </h1>
        <p className="text-base text-ink-soft leading-relaxed mb-5 max-w-md">
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
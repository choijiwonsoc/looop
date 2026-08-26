import { Link } from 'react-router-dom';
import type { EventBoard } from '../types';
import { Avatar } from './Avatar';
import { Card } from './Card';

function formatDateRange(start: string, end: string | null): string {
  const startLabel = new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (!end) return `Ongoing · started ${startLabel}`;
  const endLabel = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startLabel} – ${endLabel}`;
}

export function EventCard({ event }: { event: EventBoard }) {
  return (
    <Link to={`/events/${event.id}`}>
      <Card className="hover:border-loop hover:-translate-y-0.5 hover:shadow-md transition-all">
        <div className="flex justify-between items-center mb-3">
          {event.type && (
            <span className="text-[11px] uppercase tracking-wide text-loop bg-loop-soft px-2 py-0.5 rounded-full">
              {event.type}
            </span>
          )}
          <span className="text-xs text-ink-soft">{formatDateRange(event.startDate, event.endDate)}</span>
        </div>
        <h3 className="text-2xl mb-4">{event.name}</h3>
        <div className="flex items-center">
          {event.members.slice(0, 4).map((m, i) => (
            <div key={m.id} className={i > 0 ? '-ml-1.5' : ''}>
              <Avatar member={m} size={26} />
            </div>
          ))}
          {event.members.length > 4 && (
            <span className="ml-2 text-xs text-ink-soft">+{event.members.length - 4}</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
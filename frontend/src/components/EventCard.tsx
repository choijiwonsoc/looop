import { Link } from 'react-router-dom';
import type { EventBoard } from '../types';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { EditIcon, TrashIcon } from './icons';

interface EventCardProps {
  event: EventBoard;
  health: number;
  urgentOpen: number;
  issuesOpen: number;
  onEdit: () => void;
  onDelete: () => void;
}

function healthColor(health: number): string {
  if (health >= 80) return '#8A9A7E';
  if (health >= 50) return '#C88A2A';
  return '#E85D4A';
}

function formatDateRange(start: string, end: string | null): string {
  const startLabel = new Date(start + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (!end) return 'Ongoing';
  const endLabel = new Date(end + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startLabel} – ${endLabel}`;
}

export function EventCard({ event, health, urgentOpen, issuesOpen, onEdit, onDelete }: EventCardProps) {
  const color = healthColor(health);
  const r = 18;
  const circumference = 2 * Math.PI * r;

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <Card className="relative h-full hover:border-loop hover:-translate-y-0.5 hover:shadow-md transition-all">
        {/* hover actions */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-bg text-ink-soft hover:text-loop hover:bg-loop-soft transition-colors"
            aria-label="Edit event"
          >
            <EditIcon />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-bg text-ink-soft hover:text-urgent hover:bg-urgent-soft transition-colors"
            aria-label="Delete event"
          >
            <TrashIcon />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {event.type && (
            <span className="text-[11px] uppercase tracking-wide text-loop bg-loop-soft px-2 py-0.5 rounded-full">
              {event.type}
            </span>
          )}
          <span className="text-xs text-ink-soft">{formatDateRange(event.startDate, event.endDate)}</span>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <svg width="44" height="44" viewBox="0 0 44 44" className="flex-shrink-0">
            <circle cx="22" cy="22" r={r} fill="none" stroke="#E4E1D8" strokeWidth="4" />
            <circle
              cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${circumference * (health / 100)} ${circumference}`}
              transform="rotate(-90 22 22)"
            />
            <text x="22" y="23" textAnchor="middle" dominantBaseline="central" fontSize="10" fill={color} fontWeight={600}>
              {health}
            </text>
          </svg>
          <h3 className="text-xl leading-snug mt-1 pr-14">{event.name}</h3>
        </div>

        {event.description && (
          <p className="text-sm text-ink-soft leading-relaxed mb-4 line-clamp-2">{event.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-line">
          <div className="flex items-center">
            {event.members.slice(0, 4).map((m, i) => (
              <div key={m.id} className={i > 0 ? '-ml-1.5' : ''}>
                <Avatar member={m} size={24} />
              </div>
            ))}
            {event.members.length > 4 && (
              <span className="ml-1.5 text-xs text-ink-soft">+{event.members.length - 4}</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            {urgentOpen > 0 && <span className="text-urgent font-medium">{urgentOpen} urgent</span>}
            {issuesOpen > 0 && <span className="text-normal font-medium">{issuesOpen} issue{issuesOpen === 1 ? '' : 's'}</span>}
            {urgentOpen === 0 && issuesOpen === 0 && <span className="text-optional font-medium">Clear</span>}
          </div>
        </div>
      </Card>
    </Link>
  );
}
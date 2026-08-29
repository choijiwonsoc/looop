import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { EventBoard } from '../types';

interface EventPulseProps {
  events: { event: EventBoard; health: number }[];
}

function healthColor(health: number): string {
  if (health >= 80) return '#8A9A7E';
  if (health >= 50) return '#C88A2A';
  return '#E85D4A';
}

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = 150;

export function EventPulse({ events }: EventPulseProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const attention = events.filter((e) => e.health < 80).length;
  const statusLine =
    events.length === 0
      ? 'No boards yet — start your first one.'
      : attention === 0
      ? 'Everything is on track.'
      : `${attention} of ${events.length} board${events.length === 1 ? '' : 's'} need${attention === 1 ? 's' : ''} attention.`;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-5 flex-wrap">
        {events.map(({ event, health }, i) => {
          const color = healthColor(health);
          const offset = mounted ? CIRCUMFERENCE * (1 - health / 100) : CIRCUMFERENCE;
          return (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              title={`${event.name} — ${health}% healthy`}
              className="relative flex-shrink-0 hover:scale-110 transition-transform"
              style={{ width: SIZE, height: SIZE }}
            >
              <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="#E4E1D8" strokeWidth="4" />
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                  style={{ transition: `stroke-dashoffset 0.8s cubic-bezier(0.65,0,0.35,1) ${i * 90}ms` }}
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-[20px] font-medium"
                style={{ color }}
              >
                {health}
              </span>
            </Link>
          );
        })}

        <Link
          to="/new"
          title="New event"
          className="flex-shrink-0 flex items-center justify-center rounded-full border-2 border-dashed border-line-strong text-ink-soft hover:border-loop hover:text-loop transition-colors"
          style={{ width: SIZE, height: SIZE }}
        >
          <span className="text-xl leading-none">+</span>
        </Link>
      </div>

      <p className="text-sm text-ink-soft mt-4">{statusLine}</p>
    </div>
  );
}
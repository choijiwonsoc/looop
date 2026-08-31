import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api-handlers/event';
import { Member } from '../types';

const EVENT_TYPES = ['Project', 'Conference', 'Party', 'Household', 'Other'];

export function CreateEventPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('Other');
  const [isOngoing, setIsOngoing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to backend — POST /api/events
    const defaultMember: Member = {
      id: "1234",
      name: "Amanda",
      color: "blue",
    }
    const members: Member[] = [defaultMember]
    const res = await createEvent({ name: name, type: type, description: description, startDate: startDate, members: members, inviteCode: "hello" });
    console.log(res);
    navigate('/');
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-12 sm:py-16">
      <h1 className="text-4xl mb-2">Create a new event</h1>
      <p className="text-ink-soft mb-8 leading-relaxed">
        Give it a name and a rough timeframe. You can invite people and add tasks after.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-ink-soft">Event name</span>
          <input
            type="text"
            placeholder="e.g. Priya & Dan's Wedding"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-line-strong rounded-lg px-3.5 py-3 text-base bg-white focus:border-loop outline-none"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-ink-soft">Type</span>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`border rounded-full px-4 py-2 text-sm transition-colors ${type === t ? 'bg-loop border-loop text-white' : 'border-line-strong text-ink-soft bg-white'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-ink-soft">Description</span>
          <input
            type="text"
            placeholder="e.g. Distribution of bridesmaid and groomsmen duties"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-line-strong rounded-lg px-3.5 py-3 text-base bg-white focus:border-loop outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-ink-soft">Start date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="border border-line-strong rounded-lg px-3.5 py-3 text-base bg-white focus:border-loop outline-none"
          />
        </label>

        <label className="flex items-start gap-2 text-sm text-ink-soft leading-relaxed">
          <input type="checkbox" checked={isOngoing} onChange={(e) => setIsOngoing(e.target.checked)} className="mt-1" />
          <span>No end date (Good for a household or recurring event)</span>
        </label>

        {!isOngoing && (
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-ink-soft">End date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-line-strong rounded-lg px-3.5 py-3 text-base bg-white focus:border-loop outline-none"
            />
          </label>
        )}

        <button
          type="submit"
          className="bg-ink text-bg rounded-lg py-3.5 font-semibold text-base mt-2 hover:bg-loop transition-colors"
        >
          Create event
        </button>
      </form>
    </div>
  );
}
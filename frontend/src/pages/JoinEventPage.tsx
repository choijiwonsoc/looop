// frontend/src/pages/JoinEventPage.tsx (new)
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinEvent } from '../api-handlers/event';
import { getIdentity, setIdentityName } from '../identity';

export function JoinEventPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'name' | 'joining' | 'error'>('name');
  const [error, setError] = useState('');

  const identity = getIdentity();
  const needsName = identity.name === 'You'; // first-time visitor via an invite link

  useEffect(() => {
    if (!needsName) doJoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doJoin() {
    if (!code) return;
    setStatus('joining');
    try {
      const member = needsName ? setIdentityName(name) : identity;
      const event = await joinEvent({ inviteCode: code, member });
      navigate(`/events/${event.id}`);
    } catch (err) {
      console.error(err);
      setError('That invite link looks invalid, or the backend is unreachable.');
      setStatus('error');
    }
  }

  if (status === 'error') {
    return (
      <div className="max-w-sm mx-auto px-5 py-20 text-center">
        <p className="text-urgent text-sm mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="text-loop text-sm font-medium">Go home</button>
      </div>
    );
  }

  if (status === 'joining' || !needsName) {
    return <div className="max-w-sm mx-auto px-5 py-20 text-center text-ink-soft">Joining…</div>;
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <h1 className="text-2xl mb-2">You've been invited to a board</h1>
      <p className="text-ink-soft text-sm mb-6">What should we call you?</p>
      <form
        onSubmit={(e) => { e.preventDefault(); doJoin(); }}
        className="flex flex-col gap-3"
      >
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="border border-line-strong rounded-lg px-3.5 py-3 text-base bg-white focus:border-loop outline-none"
        />
        <button type="submit" className="bg-ink text-white rounded-lg py-3 font-semibold text-sm hover:bg-loop transition-colors">
          Join board
        </button>
      </form>
    </div>
  );
}
import { useState } from 'react';

interface IdentityModalProps {
  onSave: (name: string) => void;
}

export function IdentityModal({ onSave }: IdentityModalProps) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
  }

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-xl mb-2">Welcome to Looop</h3>
        <p className="text-ink-soft text-sm mb-6 leading-relaxed">
          What should we call you? This name shows up wherever you're assigned a task or flag an issue.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="border border-line-strong rounded-lg px-3.5 py-3 text-base bg-white focus:border-loop outline-none"
          />
          <button
            type="submit"
            className="bg-ink text-white rounded-lg py-3 font-semibold text-sm hover:bg-loop transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
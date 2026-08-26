import { useState } from 'react';

export function ShareLinkModal({ inviteCode, onClose }: { inviteCode: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = `https://looop.app/join/${inviteCode}`;

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl mb-2">Invite people to this board</h3>
        <p className="text-ink-soft text-sm mb-5">Anyone with this link can view and edit — no account needed.</p>
        <div className="flex gap-2 mb-5">
          <input
            readOnly
            value={link}
            onFocus={(e) => e.target.select()}
            className="flex-1 border border-line-strong rounded-md px-3 py-2 text-sm"
          />
          <button onClick={copy} className="bg-loop text-white rounded-md px-4 text-sm font-semibold">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <button onClick={onClose} className="w-full bg-ink text-white rounded-lg py-3 font-semibold">
          Done
        </button>
      </div>
    </div>
  );
}
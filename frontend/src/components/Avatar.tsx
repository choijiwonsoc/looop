import type { Member } from '../types';

export function Avatar({ member, size = 24 }: { member: Member | undefined; size?: number }) {
  if (!member) {
    return (
      <div
        className="rounded-full inline-flex items-center justify-center bg-line text-ink-soft flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        —
      </div>
    );
  }
  return (
    <div
      title={member.name}
      className="rounded-full inline-flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.45, background: member.color }}
    >
      {member.name.charAt(0).toUpperCase()}
    </div>
  );
}
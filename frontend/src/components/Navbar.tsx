import { Link } from 'react-router-dom';
import { LoopRing } from './LoopRing';

export function Navbar() {
  return (
    <header className="flex items-baseline gap-3 px-6 sm:px-10 py-5 border-b border-line">
      <Link to="/" className="flex items-center gap-2">
        <LoopRing complete={false} size={22} />
        <span className="text-2xl">Looop</span>
      </Link>
      <p className="text-xs text-ink-soft m-0">one board, not five group chats</p>
    </header>
  );
}
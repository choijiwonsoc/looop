import type { ReactNode } from 'react';

// src/components/Card.tsx
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-line rounded-xl p-4 flex flex-col ${className}`}>
      {children}
    </div>
  );
}
interface LoopRingProps {
  complete: boolean;
  color?: string;
  size?: number;
  onClick?: () => void;
  label?: string;
}

export function LoopRing({ complete, color = '#2F5EFF', size = 20, onClick, label }: LoopRingProps) {
  const strokeWidth = size * 0.14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = circumference * 0.22;
  const dashArray = complete ? `${circumference} 0` : `${circumference - gap} ${gap}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={complete}
      aria-label={label ?? (complete ? 'Mark as not done' : 'Mark as done')}
      className={`inline-flex items-center justify-center rounded-full transition-transform hover:scale-110 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={complete ? color : 'none'}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-300"
        />
      </svg>
    </button>
  );
}
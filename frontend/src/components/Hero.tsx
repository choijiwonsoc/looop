import React from "react";

export function LooopHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-line bg-white mb-8">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-loop/5 blur-3xl" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-loop/20 to-transparent" />
      </div>

      <div className="relative flex flex-col items-center px-6 py-12 sm:px-10 sm:py-14">
        {/* Animated loop */}
        <div className="relative mb-7 h-24 w-24">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            fill="none"
            aria-hidden="true"
          >
            {/* Outer loop */}
            <rect
              x="18"
              y="18"
              width="64"
              height="64"
              rx="22"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-line"
            />

            {/* Inner loop */}
            <rect
              x="29"
              y="29"
              width="42"
              height="42"
              rx="15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 5"
              className="text-loop/30"
            />

            {/* Orbiting dots */}
            <g className="loop-orbit">
              <circle
                cx="50"
                cy="10"
                r="4"
                className="fill-loop"
              />
            </g>

            <g className="loop-orbit-reverse">
              <circle
                cx="50"
                cy="90"
                r="3"
                className="fill-ink/40"
              />
            </g>

            {/* Center */}
            <circle
              cx="50"
              cy="50"
              r="5"
              className="fill-ink"
            />
          </svg>
        </div>

        {/* Copy */}
        <div className="max-w-xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-loop">
            Looop
          </p>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
            Everything your group needs,
            <br className="hidden sm:block" />
            <span className="text-ink/50"> in one place.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-ink-soft">
            Plan events, organize tasks, assign people, and keep track of
            issues without jumping between different apps.
          </p>
        </div>
      </div>

      <style>{`
        .loop-orbit {
          transform-origin: 50px 50px;
          animation: loop-spin 7s linear infinite;
        }

        .loop-orbit-reverse {
          transform-origin: 50px 50px;
          animation: loop-spin-reverse 10s linear infinite;
        }

        @keyframes loop-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes loop-spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loop-orbit,
          .loop-orbit-reverse {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
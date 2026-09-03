export function LooopHero() {
  return (
    <section className="mb-7">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-white">
        {/* subtle background glow */}
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-loop/5 blur-3xl"
        />

        <div className="relative flex items-center gap-6 px-6 py-5 sm:px-8 sm:py-6">
          {/* Animated icon */}
          <div className="shrink-0">
            <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
              <svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                fill="none"
                aria-hidden="true"
              >
                {/* outer loop */}
                <rect
                  x="20"
                  y="20"
                  width="60"
                  height="60"
                  rx="20"
                  className="stroke-line"
                  strokeWidth="2"
                />

                {/* animated loop */}
                <path
                  d="M50 27
                     C62 27 73 37 73 50
                     C73 62 62 73 50 73
                     C38 73 27 62 27 50
                     C27 38 38 27 50 27Z"
                  className="stroke-loop"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="12 8"
                />

                {/* orbiting dot */}
                <circle
                  cx="50"
                  cy="27"
                  r="4"
                  className="fill-loop"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* center */}
                <circle
                  cx="50"
                  cy="50"
                  r="5"
                  className="fill-ink"
                />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-loop">
              Looop
            </p>

            <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Everything your group needs, in one place.
            </h2>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-ink-soft">
              Plan events, organize tasks, assign people, and keep track of
              issues without jumping between different apps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
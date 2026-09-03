import React from "react";

const capabilities = [
    "Create and manage various events",
    "Assign members to tasks",
    "Flag and resolve urgent issues",
    "Generate starter tasks based on event description",
    "Suggest solutions to tasks and issues",
    "Provide a concise summary on event progress",
];

export function WebMCPCard() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-line bg-white">
            {/* Subtle background decoration */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-loop/5 blur-3xl" />

            <div className="relative p-6 sm:p-8">
                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-loop/40" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-loop" />
                            </span>

                            <span className="text-xs font-medium text-ink">
                                WebMCP enabled
                            </span>
                        </div>

                        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                            Looop + ChatGPT
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-ink-soft">
                            Looop exposes its actions through WebMCP, allowing ChatGPT to
                            interact with your events and tasks directly.
                        </p>
                    </div>
                </div>

                {/* Connection visual */}
                <div className="my-7 rounded-xl border border-line bg-bg/60 p-5">
                    <div className="flex items-center justify-center gap-3 sm:gap-6">
                        {/* ChatGPT */}
                        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-white shadow-sm">
                                <div className="text-lg font-semibold text-ink">
                                    ✦
                                </div>
                            </div>

                            <span className="text-xs font-semibold text-ink">
                                ChatGPT
                            </span>
                        </div>

                        {/* Animated connector */}
                        <div className="relative flex w-20 shrink-0 items-center justify-center sm:w-32">
                            <div className="absolute h-px w-full bg-line" />

                            <div className="relative flex h-7 items-center rounded-full border border-line bg-white px-2.5 shadow-sm">
                                <span className="text-[10px] font-semibold tracking-wide text-loop">
                                    WebMCP
                                </span>
                            </div>

                            {/* Moving dot */}
                            <span className="webmcp-dot absolute h-1.5 w-1.5 rounded-full bg-loop" />
                        </div>

                        {/* Looop */}
                        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-ink shadow-sm">
                                <span className="text-sm font-bold text-bg">
                                    L
                                </span>
                            </div>

                            <span className="text-xs font-semibold text-ink">
                                Looop
                            </span>
                        </div>
                    </div>
                </div>

                {/* Capabilities */}
                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                        What the agent can do
                    </p>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {capabilities.map((capability) => (
                            <div
                                key={capability}
                                className="group flex items-center gap-3 rounded-lg border border-line/70 bg-bg/40 px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-loop/30 hover:bg-white hover:shadow-sm"
                            >
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-loop/10">
                                    <svg
                                        viewBox="0 0 20 20"
                                        className="h-3.5 w-3.5 text-loop"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            d="M5 10.5 8.5 14 15 6.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>

                                <span className="text-sm font-medium text-ink">
                                    {capability}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-7 flex flex-col gap-4 rounded-xl border border-loop/15 bg-loop/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                        <p className="text-sm font-semibold text-ink">
                            Try it with ChatGPT
                        </p>

                        <p className="mt-1 text-xs leading-5 text-ink-soft">
                            Open Looop in ChatGPT's in-app browser and let it
                            manage an event for you.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        .webmcp-dot {
          animation: webmcp-flow 2.4s ease-in-out infinite;
        }

        @keyframes webmcp-flow {
          0%, 100% {
            transform: translateX(-38px);
            opacity: 0.3;
          }

          50% {
            transform: translateX(38px);
            opacity: 1;
          }
        }

        @media (min-width: 640px) {
          @keyframes webmcp-flow {
            0%, 100% {
              transform: translateX(-55px);
              opacity: 0.3;
            }

            50% {
              transform: translateX(55px);
              opacity: 1;
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .webmcp-dot {
            animation: none;
          }
        }
      `}</style>
        </section>
    );
}
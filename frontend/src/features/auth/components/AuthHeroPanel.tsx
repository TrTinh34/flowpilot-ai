/**
 * Auth hero panel — right half of the split-screen auth layout.
 *
 * Uses absolute positioning (inset-0) to fill its relatively-positioned
 * parent completely, ensuring the indigo gradient covers the full right half.
 *
 * Parent (AuthLayout) is responsible for hiding this on < lg.
 */
export function AuthHeroPanel() {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-10 xl:p-14 overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #3730a3 0%, #4f46e5 35%, #6366f1 65%, #7c3aed 100%)' }}
      aria-hidden="true"
    >
      {/* Background dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top — logo */}
      <div className="relative z-10 flex items-center gap-2">
        <svg
          width="26"
          height="26"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="14" height="4" rx="2" fill="white" opacity="0.95" />
          <rect x="6" y="12" width="16" height="4" rx="2" fill="white" />
          <rect x="10" y="20" width="16" height="4" rx="2" fill="white" opacity="0.8" />
          <circle cx="22" cy="6" r="3" fill="white" opacity="0.7" />
        </svg>
        <span className="text-[15px] font-semibold text-white/95 tracking-tight">
          FlowPilot AI
        </span>
      </div>

      {/* Center — Kanban preview */}
      <div className="relative z-10 flex items-center justify-center">
        <KanbanPreview />
      </div>

      {/* Bottom — tagline */}
      <div className="relative z-10">
        <p className="text-[2rem] xl:text-[2.25rem] font-bold text-white leading-tight tracking-tight">
          Plan smarter.
          <br />
          Build together.
        </p>
        <p className="mt-3 text-[15px] text-white/75 leading-relaxed max-w-sm">
          AI-powered project planning and team collaboration for modern development teams.
        </p>
      </div>
    </div>
  );
}

/** Kanban board preview with consistent, derived task counts */
function KanbanPreview() {
  const columns = [
    {
      title: 'To Do',
      cards: ['Set up CI pipeline', 'Design system', 'Write API spec'],
    },
    {
      title: 'In Progress',
      cards: ['User auth', 'Database schema'],
    },
    {
      title: 'Done',
      cards: ['Project setup', 'PRD review'],
    },
  ];

  // Derive total from actual data — no hardcoded count
  const totalTasks = columns.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/25 p-5 shadow-2xl">
        {/* Board header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest">
              Sprint 01
            </span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/80">
              Active
            </span>
          </div>
          <span className="text-[11px] text-white/60">{totalTasks} tasks</span>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-3 gap-3">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-2">
              {/* Column header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-white/75 uppercase tracking-wider truncate">
                  {col.title}
                </span>
                <span className="ml-1 shrink-0 rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold text-white/90">
                  {col.cards.length}
                </span>
              </div>

              {/* Cards */}
              {col.cards.map((card) => (
                <div
                  key={card}
                  className="rounded-lg bg-white/[0.18] border border-white/20 px-2.5 py-2 hover:bg-white/25 transition-colors"
                >
                  <div className="text-[10px] font-medium text-white leading-snug">{card}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-white/50" />
                    <div className="h-1 flex-1 rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white/60"
                        style={{ width: col.title === 'Done' ? '100%' : col.title === 'In Progress' ? '55%' : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* AI badge */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.1] border border-white/20 px-3.5 py-2.5">
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M6 1L7.2 4.8H11L7.9 7.1L9.1 11L6 8.7L2.9 11L4.1 7.1L1 4.8H4.8L6 1Z"
              fill="#c4b5fd"
            />
          </svg>
          <span className="text-[11px] font-medium text-white/80">AI generated this sprint plan</span>
        </div>
      </div>
    </div>
  );
}

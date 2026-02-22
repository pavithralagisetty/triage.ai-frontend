const PRIORITY_CONFIG = {
  P0: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    dot: true,
  },
  P1: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    dot: false,
  },
  P2: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-amber-600",
    dot: false,
  },
  P3: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    dot: false,
  },
};

export default function Header({
  priorityCounts,
  avgWait,
  callsPerHour,
  wsConnected,
  useMockData,
}) {
  return (
    <header className="flex-none h-20 bg-surface-white border-b border-surface-border flex items-center justify-between px-6 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 p-2 rounded-lg">
          <span className="material-symbols-outlined text-blue-600 text-2xl">
            radar
          </span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
            Triage.AI
          </h1>
          <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
            JetBlue
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Queue Load */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Queue Load
          </span>
          <div className="flex items-center gap-2">
            {Object.entries(priorityCounts).map(([p, count]) => {
              const cfg = PRIORITY_CONFIG[p];
              return (
                <div
                  key={p}
                  className={`flex items-center gap-1.5 px-2 py-1 ${cfg.bg} border ${cfg.border} rounded text-xs font-bold ${cfg.text}`}
                >
                  {cfg.dot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {p}: {count}
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200" />

        {/* Avg Wait */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Avg Wait
          </span>
          <span className="font-mono text-xl font-bold text-slate-900 tracking-tight">
            {avgWait}
          </span>
        </div>

        <div className="h-8 w-px bg-slate-200" />

        {/* Velocity */}
        <div className="flex flex-col items-end min-w-[80px]">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Velocity
          </span>
          <div className="flex items-center gap-1 text-blue-600">
            <span className="material-symbols-outlined text-sm">
              trending_up
            </span>
            <span className="font-bold text-xl text-slate-900">
              {callsPerHour}/hr
            </span>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200" />

        {/* Connection status */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Status
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                wsConnected ? "bg-green-500" : "bg-red-400"
              } ${wsConnected ? "animate-pulse" : ""}`}
            />
            <span className="text-xs font-medium text-slate-600">
              {useMockData ? "Mock" : wsConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

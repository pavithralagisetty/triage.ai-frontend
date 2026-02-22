const FILTERS = [
  { key: 'P0', label: 'P0 Critical', checkedColor: 'text-red-500', border: 'border-red-200', hoverBg: 'hover:bg-red-50' },
  { key: 'P1', label: 'P1 High', checkedColor: 'text-orange-500', border: 'border-orange-200', hoverBg: 'hover:bg-orange-50' },
  { key: 'P2', label: 'P2 Medium', checkedColor: 'text-amber-500', border: 'border-yellow-200', hoverBg: 'hover:bg-yellow-50' },
  { key: 'P3', label: 'P3 Low', checkedColor: 'text-green-500', border: 'border-green-200', hoverBg: 'hover:bg-green-50' },
]

export default function FilterBar({ activeFilters, onToggleFilter, searchQuery, onSearchChange }) {
  return (
    <div className="flex-none bg-background-snow border-b border-surface-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500 mr-2 uppercase tracking-wider">Priority Filter:</span>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => onToggleFilter(f.key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded bg-white border ${f.border} ${f.hoverBg} transition-all text-xs font-bold text-slate-700 shadow-sm`}
          >
            <span className={`material-symbols-outlined text-[16px] ${activeFilters[f.key] ? f.checkedColor : 'text-slate-300'}`}>
              {activeFilters[f.key] ? 'check_box' : 'check_box_outline_blank'}
            </span>
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search queue..."
            className="pl-8 pr-4 py-1.5 bg-white border border-surface-border rounded text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-64 placeholder-slate-400 shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const PRIORITY_CONFIG = {
  P0: {
    badge: 'bg-red-50 text-red-600 border-red-100',
    border: 'border-l-red-400',
    timer: 'text-red-600',
    dot: true,
  },
  P1: {
    badge: 'bg-orange-50 text-orange-600 border-orange-100',
    border: 'border-l-orange-400',
    timer: 'text-orange-600',
    dot: false,
  },
  P2: {
    badge: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    border: 'border-l-yellow-400',
    timer: 'text-yellow-600',
    dot: false,
  },
  P3: {
    badge: 'bg-green-50 text-green-600 border-green-100',
    border: 'border-l-green-400',
    timer: 'text-green-600',
    dot: false,
  },
}

function parseUTC(ts) {
  if (!ts) return new Date()
  // Append Z if no timezone info present, so it's always parsed as UTC
  return new Date(/Z|[+-]\d{2}:\d{2}$/.test(ts) ? ts : ts + 'Z')
}

function formatWaitTime(timestamp, now) {
  const diffMs = now - parseUTC(timestamp)
  const diffSecs = Math.floor(diffMs / 1000)
  const mins = Math.floor(diffSecs / 60)
  if (mins < 1) return '< 1 min'
  return `${mins} min`
}

function formatEST(timestamp) {
  return parseUTC(timestamp).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' EST'
}

function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    const d = digits.slice(1)
    return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  }
  return raw
}

export default function CallCard({ call, position, isNew, now }) {
  const cfg = PRIORITY_CONFIG[call.priority] || PRIORITY_CONFIG.P3

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: call.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center bg-white border border-surface-border border-l-[4px] ${cfg.border}
        rounded hover:bg-slate-50 transition-colors p-3 shadow-soft cursor-pointer relative overflow-hidden
        ${isNew ? 'card-enter' : ''}
        ${isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}
      `}
    >
      {/* Drag handle + position */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-1 text-slate-400 px-2 group-hover:text-slate-500 cursor-grab active:cursor-grabbing touch-none"
      >
        <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
        <span className="font-mono text-xs font-bold text-slate-400">#{position}</span>
      </div>

      {/* Priority badge */}
      <div className="flex-none px-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${cfg.badge}`}>
          {call.priority}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
        {/* Issue + summary */}
        <div className="col-span-6 flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 truncate">{call.issue_type}</h3>
            {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-none" />}
          </div>
          <p className="text-xs text-slate-500 truncate font-medium">{call.summary}</p>
        </div>

        {/* Caller number */}
        <div className="col-span-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-[16px]">call</span>
          <span className="text-xs font-mono text-slate-600">{formatPhone(call.caller_number)}</span>
        </div>

        {/* Wait time + timestamp */}
        <div className="col-span-3 flex flex-col items-end gap-0.5 pr-2">
          <div className={`flex items-center gap-1 ${cfg.timer} text-xs font-bold`}>
            <span className="material-symbols-outlined text-[16px]">timer</span>
            {formatWaitTime(call.timestamp, now)}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{formatEST(call.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}

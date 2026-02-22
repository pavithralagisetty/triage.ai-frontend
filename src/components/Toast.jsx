import { useEffect, useState } from 'react'

const PRIORITY_STYLES = {
  P0: { bar: 'bg-red-500',    text: 'text-red-600',    label: 'bg-red-50 border-red-200' },
  P1: { bar: 'bg-orange-500', text: 'text-orange-600', label: 'bg-orange-50 border-orange-200' },
  P2: { bar: 'bg-yellow-500', text: 'text-yellow-600', label: 'bg-yellow-50 border-yellow-200' },
  P3: { bar: 'bg-green-500',  text: 'text-green-600',  label: 'bg-green-50 border-green-200' },
}

export default function Toast({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!toast) return
    setVisible(true)
    const hide = setTimeout(() => setVisible(false), 3500)
    const remove = setTimeout(() => onDismiss(), 4000) // after fade-out
    return () => { clearTimeout(hide); clearTimeout(remove) }
  }, [toast])

  if (!toast) return null

  const cfg = PRIORITY_STYLES[toast.priority] || PRIORITY_STYLES.P3

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50 w-72 bg-white rounded-lg shadow-xl border border-surface-border
        overflow-hidden transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Priority colour bar */}
      <div className={`h-1 w-full ${cfg.bar}`} />

      <div className="flex items-start gap-3 p-3">
        <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-black uppercase border ${cfg.label} ${cfg.text} flex-none`}>
          {toast.priority}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">{toast.issue_type}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">New call in queue</p>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(onDismiss, 500) }}
          className="text-slate-300 hover:text-slate-500 text-sm leading-none mt-0.5">✕</button>
      </div>
    </div>
  )
}

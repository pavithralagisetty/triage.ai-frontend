import { useState, useEffect, useCallback, useRef } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import CallQueue from './components/CallQueue'
import { MOCK_CALLS, getNextMockCall } from './mockData'

// ── Toggle this flag ──────────────────────────────────────────────────────────
const USE_MOCK_DATA = false
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/dashboard'
// ─────────────────────────────────────────────────────────────────────────────

const PRIORITY_ORDER = { P0: 0, P1: 1, P2: 2, P3: 3 }

function sortCalls(calls) {
  return [...calls].sort((a, b) => {
    const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (pd !== 0) return pd
    return new Date(a.timestamp) - new Date(b.timestamp)
  })
}

export default function App() {
  const [calls, setCalls] = useState([])
  const [activeFilters, setActiveFilters] = useState({ P0: true, P1: true, P2: true, P3: true })
  const [searchQuery, setSearchQuery] = useState('')
  const [wsConnected, setWsConnected] = useState(false)
  const [newCardIds, setNewCardIds] = useState(new Set())
  const [now, setNow] = useState(Date.now())
  const wsRef = useRef(null)

  // Tick every 30s so wait times stay current
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(interval)
  }, [])

  // ── Mock data mode ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!USE_MOCK_DATA) return
    setCalls(sortCalls(MOCK_CALLS))

    const interval = setInterval(() => {
      const newCall = getNextMockCall()
      setCalls(prev => sortCalls([...prev, newCall]))
      setNewCardIds(prev => new Set([...prev, newCall.id]))
      setTimeout(() => {
        setNewCardIds(prev => {
          const next = new Set(prev)
          next.delete(newCall.id)
          return next
        })
      }, 600)
    }, Math.random() * 3000 + 5000) // 5-8s

    return () => clearInterval(interval)
  }, [])

  // ── WebSocket mode ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (USE_MOCK_DATA) return

    function connect() {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => setWsConnected(true)

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.type === 'initial_state') {
          setCalls(sortCalls(msg.data))
        } else if (msg.type === 'new_call') {
          const newCall = msg.data
          setCalls(prev => prev.find(c => c.id === newCall.id) ? prev : sortCalls([...prev, newCall]))
          setNewCardIds(prev => new Set([...prev, newCall.id]))
          setTimeout(() => {
            setNewCardIds(prev => {
              const next = new Set(prev)
              next.delete(newCall.id)
              return next
            })
          }, 600)
        } else if (msg.type === 'priority_change') {
          setCalls(prev => sortCalls(prev.map(c =>
            c.id === msg.data.id ? { ...c, priority: msg.data.new_priority } : c
          )))
        }
      }

      ws.onclose = () => {
        setWsConnected(false)
        setTimeout(connect, 3000) // reconnect
      }

      ws.onerror = () => ws.close()
    }

    connect()
    return () => wsRef.current?.close()
  }, [])

  const sendWsMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  const handleReorder = useCallback((reorderedCalls) => {
    setCalls(reorderedCalls)
    // Notify backend of last moved card position
    // (the CallQueue component handles dnd and passes final order)
  }, [])

  const handleDragEnd = useCallback((id, newPosition) => {
    sendWsMessage({ type: 'reorder', data: { id, new_position: newPosition } })
  }, [sendWsMessage])

  // Stats
  const priorityCounts = { P0: 0, P1: 0, P2: 0, P3: 0 }
  calls.forEach(c => { if (priorityCounts[c.priority] !== undefined) priorityCounts[c.priority]++ })

  const avgWaitFormatted = '04:32'

  // Filter + search
  const visibleCalls = calls.filter(c => {
    if (!activeFilters[c.priority]) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        c.issue_type.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.caller_number.includes(q)
      )
    }
    return true
  })

  return (
    <div className="bg-background-snow text-text-main font-display min-h-screen flex flex-col overflow-hidden antialiased">
      <Header
        priorityCounts={priorityCounts}
        avgWait={avgWaitFormatted}
        callsPerHour={47}
        wsConnected={wsConnected || USE_MOCK_DATA}
        useMockData={USE_MOCK_DATA}
      />
      <FilterBar
        activeFilters={activeFilters}
        onToggleFilter={(p) => setActiveFilters(prev => ({ ...prev, [p]: !prev[p] }))}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <CallQueue
        calls={visibleCalls}
        newCardIds={newCardIds}
        onReorder={handleReorder}
        onDragEnd={handleDragEnd}
        now={now}
      />
    </div>
  )
}

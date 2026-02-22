import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import CallCard from './CallCard'

export default function CallQueue({ calls, newCardIds, onReorder, onDragEnd, now }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragStart(event) {
    setActiveId(event.active.id)
  }

  function handleDragEndEvent(event) {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return

    const oldIndex = calls.findIndex(c => c.id === active.id)
    const newIndex = calls.findIndex(c => c.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(calls, oldIndex, newIndex).map((c, i) => ({
      ...c,
      manually_reordered: c.id === active.id ? true : c.manually_reordered,
    }))

    onReorder(reordered)
    onDragEnd(active.id, newIndex + 1)
  }

  const activeCall = activeId ? calls.find(c => c.id === activeId) : null
  const activeIndex = activeCall ? calls.findIndex(c => c.id === activeId) : -1

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
      {calls.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <span className="material-symbols-outlined text-5xl mb-3">inbox</span>
          <p className="text-sm font-medium">No calls in queue</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEndEvent}
        >
          <SortableContext items={calls.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {calls.map((call, index) => (
                <CallCard
                  key={call.id}
                  call={call}
                  position={index + 1}
                  isNew={newCardIds.has(call.id)}
                  now={now}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeCall && (
              <CallCard
                call={activeCall}
                position={activeIndex + 1}
                isNew={false}
              />
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}

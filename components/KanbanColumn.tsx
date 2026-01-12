'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, TaskStatus, Label } from '@/types'
import { KanbanCard } from './KanbanCard'

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
  labels: Label[]
  onAddTask: (status: TaskStatus) => void
  onDeleteTask: (id: string) => void
  onEditTask: (task: Task) => void
}

const COLUMN_ACCENTS: Record<TaskStatus, string> = {
  'todo': 'bg-amber-glow',
  'in-progress': 'bg-rose-accent',
  'complete': 'bg-emerald-400',
}

export function KanbanColumn({ id, title, tasks, labels, onAddTask, onDeleteTask, onEditTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex-1 min-w-[260px] max-w-[340px]">
      {/* Column Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`w-2 h-2 rounded-full ${COLUMN_ACCENTS[id]}`} />
        <h2 className="font-display text-base font-medium text-ink-rich">{title}</h2>
        <span className="text-xs text-ink-faint font-mono ml-auto">
          {tasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`
          min-h-[280px] p-3 rounded-2xl
          border border-transparent
          transition-all duration-300 ease-out
          ${isOver
            ? 'bg-surface-base/50 border-amber-glow/30 shadow-glow-sm'
            : 'bg-surface-deep/30'
          }
        `}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard
              key={task.id}
              task={task}
              labels={labels}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-xs text-ink-faint/60 italic">Drop tasks here</p>
          </div>
        )}
      </div>

      {/* Add Button - Only for Todo column */}
      {id === 'todo' && (
        <button
          onClick={() => onAddTask(id)}
          className="w-full mt-3 py-3 text-sm text-ink-muted hover:text-ink-rich
            border border-dashed border-ink-faint/30 hover:border-amber-glow/50
            rounded-xl transition-all duration-200
            hover:bg-surface-base/30 hover:shadow-glow-sm
            group"
        >
          <span className="group-hover:text-amber-glow transition-colors">+</span>
          {' '}Add task
        </button>
      )}
    </div>
  )
}

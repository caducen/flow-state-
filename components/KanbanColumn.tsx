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
  onToggleTodayTask: (id: string) => void
  canAddTodayTask: boolean
  onFocusTask: (id: string) => void
}

const COLUMN_ACCENTS: Record<TaskStatus, string> = {
  'todo': 'bg-amber-glow',
  'in-progress': 'bg-rose-accent',
  'complete': 'bg-emerald-400',
}

const EMPTY_STATE_CONFIG: Record<TaskStatus, { message: string; icon: React.ReactNode }> = {
  'todo': {
    message: 'Add a task to get started',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  'in-progress': {
    message: 'Drag a task here to start',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    ),
  },
  'complete': {
    message: 'Nothing completed yet today—small steps count.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
}

export function KanbanColumn({ id, title, tasks, labels, onAddTask, onDeleteTask, onEditTask, onToggleTodayTask, canAddTodayTask, onFocusTask }: KanbanColumnProps) {
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
              onToggleTodayTask={onToggleTodayTask}
              canAddTodayTask={canAddTodayTask}
              onFocus={onFocusTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[200px] gap-2">
            <span className="text-ink-faint/40">
              {EMPTY_STATE_CONFIG[id].icon}
            </span>
            <p className="text-xs text-ink-faint/60 text-center px-4 leading-relaxed">
              {EMPTY_STATE_CONFIG[id].message}
            </p>
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

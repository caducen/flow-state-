'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, Label, PRIORITY_CONFIG } from '@/types'

interface KanbanCardProps {
  task: Task
  labels: Label[]
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onToggleTodayTask: (id: string) => void
  canAddTodayTask: boolean
}

function isOverdue(dueDate: string | undefined): boolean {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function KanbanCard({ task, labels, onDelete, onEdit, onToggleTodayTask, canAddTodayTask }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityConfig = PRIORITY_CONFIG[task.priority]
  const taskLabels = labels.filter(l => task.labelIds.includes(l.id))
  const overdue = isOverdue(task.dueDate) && task.status !== 'complete'

  const handleClick = () => {
    if (!isDragging) {
      onEdit(task)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`
        group relative bg-surface-raised border-subtle rounded-xl p-4 mb-3
        cursor-grab active:cursor-grabbing
        shadow-card hover:shadow-glow-sm
        transition-all duration-200 ease-out
        hover:-translate-y-0.5
        ${isDragging ? 'opacity-60 scale-[1.02] shadow-glow-md rotate-1' : ''}
      `}
    >
      {/* Priority indicator bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
        style={{ backgroundColor: priorityConfig.color }}
      />

      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-xl" />

      <div className="pl-2">
        {/* Header row */}
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-sm font-medium text-ink-rich leading-snug flex-1">
            {task.title}
          </h3>
          <div className="flex items-center gap-1">
            {/* Today's 3 star toggle */}
            {task.status !== 'complete' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleTodayTask(task.id)
                }}
                title={task.isTodayTask ? "Remove from Today's 3" : canAddTodayTask ? "Add to Today's 3" : "Today's 3 is full"}
                className={`p-1 -m-1 transition-all duration-150 ${
                  task.isTodayTask
                    ? 'text-amber-glow'
                    : canAddTodayTask
                      ? 'opacity-0 group-hover:opacity-100 text-ink-faint hover:text-amber-glow'
                      : 'opacity-0 group-hover:opacity-50 text-ink-faint cursor-not-allowed'
                }`}
                disabled={!task.isTodayTask && !canAddTodayTask}
              >
                <svg className="w-4 h-4" fill={task.isTodayTask ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            )}
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(task.id)
              }}
              className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-rose-accent
                text-lg leading-none p-1 -m-1 transition-all duration-150"
            >
              ×
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-ink-muted mt-1.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Labels */}
        {taskLabels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {taskLabels.map(label => (
              <span
                key={label.id}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Priority badge + Due date */}
        <div className="flex items-center gap-2 mt-3">
          {/* Priority badge */}
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: priorityConfig.bgColor,
              color: priorityConfig.color,
            }}
          >
            {priorityConfig.label}
          </span>

          {/* Due date */}
          {task.dueDate && (
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1
                ${overdue
                  ? 'bg-red-500/15 text-red-400'
                  : 'bg-surface-overlay text-ink-muted'
                }
              `}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Task, Label, Priority, PRIORITY_CONFIG } from '@/types'

interface AddTaskModalProps {
  labels: Label[]
  task?: Task // If provided, we're in edit mode
  onClose: () => void
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'status'> & { id?: string }) => void
}

export function AddTaskModal({ labels, task, onClose, onSubmit }: AddTaskModalProps) {
  const isEditing = !!task
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [selectedLabels, setSelectedLabels] = useState<string[]>(task?.labelIds ?? [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit({
        ...(isEditing && { id: task.id }),
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        labelIds: selectedLabels,
      })
    }
  }

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-scale-in">
        <div className="bg-surface-base border-subtle rounded-2xl shadow-2xl overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-glow/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-rose-accent/10 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative flex items-center justify-between p-5 border-b border-white/5">
            <h2 className="font-display text-xl font-medium text-ink-rich">{isEditing ? 'Edit Task' : 'New Task'}</h2>
            <button
              onClick={onClose}
              className="text-ink-muted hover:text-ink-rich transition-colors p-1 hover:bg-surface-raised rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative p-5 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                className="w-full bg-surface-raised border-subtle rounded-xl px-4 py-3
                  text-ink-rich placeholder-ink-faint
                  focus:border-amber-glow/50 focus:shadow-glow-sm
                  transition-all duration-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">
                Description
                <span className="text-ink-faint font-normal normal-case ml-1">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some details..."
                rows={2}
                className="w-full bg-surface-raised border-subtle rounded-xl px-4 py-3
                  text-ink-rich placeholder-ink-faint resize-none
                  focus:border-amber-glow/50 focus:shadow-glow-sm
                  transition-all duration-200"
              />
            </div>

            {/* Priority & Due Date Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`
                        flex-1 px-3 py-2 text-xs font-medium rounded-lg
                        border transition-all duration-200
                        ${priority === p
                          ? 'border-transparent'
                          : 'border-subtle bg-surface-raised hover:bg-surface-overlay'
                        }
                      `}
                      style={priority === p ? {
                        backgroundColor: PRIORITY_CONFIG[p].bgColor,
                        color: PRIORITY_CONFIG[p].color,
                      } : {}}
                    >
                      {PRIORITY_CONFIG[p].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">
                  Due Date
                  <span className="text-ink-faint font-normal normal-case ml-1">(optional)</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-surface-raised border-subtle rounded-xl px-4 py-2.5
                    text-ink-rich text-sm
                    focus:border-amber-glow/50 focus:shadow-glow-sm
                    transition-all duration-200
                    [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Labels */}
            <div>
              <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">
                Labels
                <span className="text-ink-faint font-normal normal-case ml-1">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {labels.map(label => (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    className={`
                      text-xs font-medium px-3 py-1.5 rounded-full
                      border transition-all duration-200
                      ${selectedLabels.includes(label.id)
                        ? 'border-transparent'
                        : 'border-subtle bg-surface-raised hover:bg-surface-overlay text-ink-muted'
                      }
                    `}
                    style={selectedLabels.includes(label.id) ? {
                      backgroundColor: `${label.color}20`,
                      color: label.color,
                    } : {}}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm text-ink-muted hover:text-ink-rich
                  rounded-xl transition-colors hover:bg-surface-raised"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-5 py-2.5 text-sm font-medium
                  bg-gradient-to-r from-amber-glow to-amber-soft text-surface-deep
                  rounded-xl shadow-glow-sm
                  hover:shadow-glow-md hover:-translate-y-0.5
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-glow-sm
                  transition-all duration-200"
              >
                {isEditing ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

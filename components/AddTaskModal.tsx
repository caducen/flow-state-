'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Task, Label, Priority, EnergyLevel, Subtask, PRIORITY_CONFIG, ENERGY_CONFIG, PRIORITY_POINTS, ENERGY_POINTS } from '@/types'
import { getWeightCategory, WEIGHT_CATEGORY_CONFIG } from '@/utils/flowMeter'

interface AddTaskModalProps {
  labels: Label[]
  task?: Task // If provided, we're in edit mode
  initialTitle?: string // For promoted todos
  onClose: () => void
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'status'> & { id?: string }) => void
}

export function AddTaskModal({ labels, task, initialTitle, onClose, onSubmit }: AddTaskModalProps) {
  const isEditing = !!task
  const [title, setTitle] = useState(task?.title ?? initialTitle ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | undefined>(task?.energyLevel)
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [selectedLabels, setSelectedLabels] = useState<string[]>(task?.labelIds ?? [])
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks ?? [])
  const [newSubtaskText, setNewSubtaskText] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  // Calculate task weight from priority + energy
  const taskWeight = useMemo(() => {
    const priorityPoints = PRIORITY_POINTS[priority]
    const energyPoints = ENERGY_POINTS[energyLevel ?? 'medium']
    return priorityPoints + energyPoints
  }, [priority, energyLevel])

  const weightCategory = useMemo(() => getWeightCategory(taskWeight), [taskWeight])
  const weightConfig = WEIGHT_CATEGORY_CONFIG[weightCategory]

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit({
        ...(isEditing && { id: task.id }),
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        energyLevel,
        dueDate: dueDate || undefined,
        labelIds: selectedLabels,
        subtasks: subtasks.length > 0 ? subtasks : undefined,
        progress: task?.progress ?? 0,
        isTodayTask: task?.isTodayTask ?? false,
      })
    }
  }

  const addSubtask = () => {
    if (newSubtaskText.trim()) {
      setSubtasks(prev => [...prev, {
        id: crypto.randomUUID(),
        text: newSubtaskText.trim(),
        completed: false,
      }])
      setNewSubtaskText('')
    }
  }

  const removeSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id))
  }

  const toggleSubtask = (id: string) => {
    setSubtasks(prev => prev.map(s =>
      s.id === id ? { ...s, completed: !s.completed } : s
    ))
  }

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    )
  }

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop - only visible on desktop */}
      <div
        className="hidden sm:block fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - full screen scrollable on mobile, centered card on desktop */}
      <div
        ref={modalRef}
        className="fixed inset-0 overflow-y-auto bg-surface-base sm:inset-4 sm:rounded-2xl sm:border-subtle sm:shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/5 bg-surface-base sm:rounded-t-2xl">
              <h2 id="modal-title" className="font-display text-xl font-medium text-ink-rich">
                {isEditing ? 'Edit Task' : 'New Task'}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="text-ink-muted hover:text-ink-rich transition-colors p-1 hover:bg-surface-raised rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
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
                  className="w-full bg-surface-raised border-subtle rounded-xl px-4 py-3
                    text-ink-rich text-sm
                    focus:border-amber-glow/50 focus:shadow-glow-sm
                    transition-all duration-200
                    [color-scheme:dark]"
                />
              </div>

              {/* Energy Level */}
              <div>
                <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">
                  Energy Required
                  <span className="text-ink-faint font-normal normal-case ml-1">(optional)</span>
                </label>
                <div className="flex gap-2">
                  {(Object.keys(ENERGY_CONFIG) as EnergyLevel[]).map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEnergyLevel(energyLevel === e ? undefined : e)}
                      className={`
                        flex-1 px-3 py-2 text-xs font-medium rounded-lg
                        border transition-all duration-200
                        ${energyLevel === e
                          ? 'border-transparent'
                          : 'border-subtle bg-surface-raised hover:bg-surface-overlay text-ink-muted'
                        }
                      `}
                      style={energyLevel === e ? {
                        backgroundColor: ENERGY_CONFIG[e].bgColor,
                        color: ENERGY_CONFIG[e].color,
                      } : {}}
                    >
                      <span className="mr-1">{ENERGY_CONFIG[e].icon}</span>
                      {e.charAt(0).toUpperCase() + e.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Task Weight Indicator */}
              <div
                className="p-4 rounded-xl border transition-all duration-300"
                style={{
                  backgroundColor: `${weightConfig.color}10`,
                  borderColor: `${weightConfig.color}30`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
                    style={{
                      backgroundColor: `${weightConfig.color}20`,
                      color: weightConfig.color,
                    }}
                  >
                    {taskWeight}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: weightConfig.color }}
                      >
                        {weightConfig.label} Task
                      </span>
                      <span className="text-xs text-ink-faint">
                        ({taskWeight} pts)
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {weightConfig.description}
                    </p>
                  </div>
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

              {/* Subtasks */}
              <div>
                <label className="block text-xs font-medium text-ink-muted uppercase tracking-wider mb-2">
                  Subtasks
                  <span className="text-ink-faint font-normal normal-case ml-1">(optional)</span>
                </label>

                {/* Existing subtasks */}
                {subtasks.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {subtasks.map(subtask => (
                      <div
                        key={subtask.id}
                        className="flex items-center gap-2 group"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSubtask(subtask.id)}
                          className={`
                            w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center
                            transition-all duration-200
                            ${subtask.completed
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                              : 'border-subtle hover:border-ink-muted'
                            }
                          `}
                        >
                          {subtask.completed && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <span className={`flex-1 text-sm ${subtask.completed ? 'text-ink-faint line-through' : 'text-ink-rich'}`}>
                          {subtask.text}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSubtask(subtask.id)}
                          className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-rose-400 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new subtask */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSubtask()
                      }
                    }}
                    placeholder="Add a subtask..."
                    className="flex-1 bg-surface-raised border-subtle rounded-lg px-3 py-2
                      text-sm text-ink-rich placeholder-ink-faint
                      focus:border-amber-glow/50 focus:shadow-glow-sm
                      transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={addSubtask}
                    disabled={!newSubtaskText.trim()}
                    className="px-3 py-2 text-sm bg-surface-raised border-subtle rounded-lg
                      text-ink-muted hover:text-ink-rich hover:bg-surface-overlay
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Actions - sticky at bottom */}
              <div className="flex justify-end gap-3 pt-2 pb-2">
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
  )
}

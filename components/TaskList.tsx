'use client'

import { useState, useEffect } from 'react'
import { Task, Label, PROGRESS_CONFIG, PRIORITY_CONFIG, ENERGY_CONFIG, EnergySettings, DEFAULT_ENERGY_SETTINGS } from '@/types'
import { getTaskWeight, getBaseTaskWeight } from '@/utils/flowMeter'
import { AddTaskModal } from './AddTaskModal'

interface TaskListProps {
  tasks: Task[]
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void
  labels: Label[]
  setLabels: (labels: Label[] | ((prev: Label[]) => Label[])) => void
  promotedTodo?: { text: string; id: string } | null
  onPromotedTodoHandled?: () => void
  energySettings?: EnergySettings
}

// Get progress color based on percentage
function getProgressColor(progress: number): string {
  if (progress >= 100) return PROGRESS_CONFIG[100].color
  if (progress >= 75) return PROGRESS_CONFIG[75].color
  if (progress >= 50) return PROGRESS_CONFIG[50].color
  if (progress >= 25) return PROGRESS_CONFIG[25].color
  return PROGRESS_CONFIG[0].color
}

export function TaskList({
  tasks,
  setTasks,
  labels,
  setLabels,
  promotedTodo,
  onPromotedTodoHandled,
  energySettings = DEFAULT_ENERGY_SETTINGS
}: TaskListProps) {
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [promotedTitle, setPromotedTitle] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showArchive, setShowArchive] = useState(false)
  const [showWeightTooltip, setShowWeightTooltip] = useState<string | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  // Handle promoted todo from Quick Todos
  useEffect(() => {
    if (promotedTodo) {
      setPromotedTitle(promotedTodo.text)
      setEditingTask(null)
      setShowModal(true)
      onPromotedTodoHandled?.()
    }
  }, [promotedTodo, onPromotedTodoHandled])

  // Separate active and archived tasks
  const activeTasks = tasks.filter(t => t.status === 'active')
  const archivedTasks = tasks.filter(t => t.status === 'archived')

  const handleAddTask = () => {
    setEditingTask(null)
    setPromotedTitle(null)
    setShowModal(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTask(null)
    setPromotedTitle(null)
  }

  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status'> & { id?: string }) => {
    if (taskData.id) {
      // Editing existing task
      setTasks(prev => prev.map(t =>
        t.id === taskData.id
          ? { ...t, ...taskData, id: t.id }
          : t
      ))
    } else {
      // Creating new task
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        status: 'active',
        progress: taskData.progress ?? 0,
        createdAt: Date.now(),
      }
      setTasks(prev => [...prev, newTask])
    }
    handleCloseModal()
  }

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    setSelectedTaskId(null)
  }

  const handleProgressChange = (id: string, progress: number) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, progress } : t
    ))
  }

  const handleArchiveTask = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'archived' as const, progress: 100, completedAt: Date.now(), isTodayTask: false } : t
    ))
    setSelectedTaskId(null)
  }

  const handleRestoreTask = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: 'active' as const, completedAt: undefined } : t
    ))
  }

  const handleToggleTodayTask = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, isTodayTask: !t.isTodayTask } : t
    ))
  }

  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-2 h-2 rounded-full bg-amber-glow" />
        <h2 className="font-display text-base font-medium text-ink-rich">Tasks</h2>
        <span className="text-xs text-ink-faint font-mono">
          {activeTasks.length}
        </span>
        <button
          onClick={handleAddTask}
          className="ml-auto px-2.5 py-1 text-xs text-ink-muted hover:text-amber-glow
            bg-surface-raised hover:bg-surface-overlay
            border border-subtle hover:border-amber-glow/30
            rounded-lg transition-all duration-200
            flex items-center gap-1"
        >
          <span className="text-sm">+</span>
          <span>Add</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {activeTasks.length === 0 ? (
          <div className="bg-surface-base border-subtle rounded-2xl p-8 text-center">
            <p className="text-sm text-ink-faint">No tasks yet</p>
            <p className="text-xs text-ink-faint/60 mt-1">Add one to get started</p>
          </div>
        ) : (
          activeTasks.map(task => (
            <div
              key={task.id}
              className={`
                bg-surface-base border rounded-xl p-3 cursor-pointer
                transition-all duration-200
                ${selectedTaskId === task.id
                  ? 'border-amber-glow/50 shadow-glow-sm'
                  : 'border-subtle hover:border-ink-faint/30'
                }
              `}
              onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
            >
              {/* Task Header */}
              <div className="flex items-start gap-3">
                {/* Today's 3 star */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleTodayTask(task.id)
                  }}
                  className={`mt-0.5 transition-colors ${
                    task.isTodayTask ? 'text-amber-glow' : 'text-ink-faint/30 hover:text-amber-glow/50'
                  }`}
                >
                  <svg className="w-4 h-4" fill={task.isTodayTask ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-ink-rich truncate">{task.title}</h3>

                  {/* Labels */}
                  {task.labelIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.labelIds.slice(0, 2).map(labelId => {
                        const label = labels.find(l => l.id === labelId)
                        if (!label) return null
                        return (
                          <span
                            key={label.id}
                            className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${label.color}20`, color: label.color }}
                          >
                            {label.name}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Weight indicator with tooltip */}
                <div className="relative flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowWeightTooltip(showWeightTooltip === task.id ? null : task.id)
                    }}
                    onMouseEnter={() => setShowWeightTooltip(task.id)}
                    onMouseLeave={() => setShowWeightTooltip(null)}
                    className="text-ink-faint/50 hover:text-ink-muted transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <span className="text-xs text-ink-faint font-mono">
                    {getTaskWeight(task, energySettings)}/{getBaseTaskWeight(task, energySettings)}
                  </span>

                  {/* Tooltip */}
                  {showWeightTooltip === task.id && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 p-3 bg-surface-overlay border border-white/10 rounded-xl shadow-2xl z-[9999]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-xs text-ink-rich font-medium mb-2">Energy Cost</p>
                      <p className="text-xs text-ink-muted leading-relaxed mb-2">
                        <span className="text-amber-glow font-mono">{getTaskWeight(task, energySettings)}</span> = current cost
                        <br />
                        <span className="text-ink-faint font-mono">{getBaseTaskWeight(task, energySettings)}</span> = original cost
                      </p>
                      <p className="text-xs text-ink-muted leading-relaxed mb-2">
                        As you make progress, the energy cost decreases. A task 75% done only costs 25% of its original energy.
                      </p>
                      <p className="text-xs text-ink-faint italic">
                        Click the task to set your progress.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 h-1.5 bg-surface-overlay rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${task.progress}%`,
                    backgroundColor: getProgressColor(task.progress)
                  }}
                />
              </div>

              {/* Expanded Task Detail */}
              {selectedTaskId === task.id && (
                <div className="mt-3 pt-3 border-t border-subtle animate-fade-in">
                  {/* Description */}
                  {task.description && (
                    <p className="text-xs text-ink-muted mb-3 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: PRIORITY_CONFIG[task.priority].bgColor,
                        color: PRIORITY_CONFIG[task.priority].color,
                      }}
                    >
                      {PRIORITY_CONFIG[task.priority].label}
                    </span>
                    {task.energyLevel && (
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: ENERGY_CONFIG[task.energyLevel].bgColor,
                          color: ENERGY_CONFIG[task.energyLevel].color,
                        }}
                      >
                        {ENERGY_CONFIG[task.energyLevel].icon} {ENERGY_CONFIG[task.energyLevel].label}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="text-[10px] text-ink-faint flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>

                  {/* Subtasks */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-1">
                        Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
                      </div>
                      <div className="space-y-1">
                        {task.subtasks.map(subtask => (
                          <div key={subtask.id} className="flex items-center gap-2 text-xs">
                            <span className={subtask.completed ? 'text-emerald-400' : 'text-ink-faint'}>
                              {subtask.completed ? '✓' : '○'}
                            </span>
                            <span className={subtask.completed ? 'text-ink-faint line-through' : 'text-ink-muted'}>
                              {subtask.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress Buttons */}
                  <div className="mb-3">
                    <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-2">Progress</div>
                    <div className="flex gap-1">
                      {[0, 25, 50, 75, 100].map(value => (
                        <button
                          key={value}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleProgressChange(task.id, value)
                          }}
                          className={`
                            flex-1 py-1.5 text-xs font-medium rounded-lg transition-all
                            ${task.progress === value
                              ? 'text-white'
                              : 'text-ink-muted hover:text-ink-rich bg-surface-raised hover:bg-surface-overlay'
                            }
                          `}
                          style={task.progress === value ? {
                            backgroundColor: getProgressColor(value)
                          } : {}}
                        >
                          {value}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditTask(task)
                      }}
                      className="flex-1 py-2 text-xs text-ink-muted hover:text-ink-rich
                        bg-surface-raised hover:bg-surface-overlay rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleArchiveTask(task.id)
                      }}
                      className="flex-1 py-2 text-xs text-emerald-400 hover:text-emerald-300
                        bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
                    >
                      ✓ Complete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setTaskToDelete(task)
                      }}
                      className="py-2 px-3 text-xs text-rose-400 hover:text-rose-300
                        bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Archive Section */}
      {archivedTasks.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowArchive(!showArchive)}
            className="flex items-center gap-2 text-xs text-ink-faint hover:text-ink-muted transition-colors"
          >
            <svg
              className={`w-3 h-3 transition-transform ${showArchive ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Completed ({archivedTasks.length})
          </button>

          {showArchive && (
            <div className="mt-2 space-y-1 animate-fade-in">
              {archivedTasks.map(task => (
                <div
                  key={task.id}
                  className="group flex items-center gap-2 py-2 px-3 rounded-lg
                    bg-surface-base/50 hover:bg-surface-base transition-colors cursor-pointer"
                  onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                >
                  <span className="text-emerald-400 text-xs">✓</span>
                  <span className="text-sm text-ink-faint line-through flex-1 truncate">
                    {task.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRestoreTask(task.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 text-xs text-ink-faint hover:text-ink-muted transition-all"
                  >
                    Restore
                  </button>

                  {/* Expanded archived task detail */}
                  {selectedTaskId === task.id && (
                    <div className="absolute left-0 right-0 mt-2 p-3 bg-surface-overlay rounded-lg shadow-lg border border-subtle z-10">
                      {task.description && (
                        <p className="text-xs text-ink-muted mb-2">{task.description}</p>
                      )}
                      {task.completedAt && (
                        <p className="text-[10px] text-ink-faint">
                          Completed {new Date(task.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {showModal && (
        <AddTaskModal
          labels={labels}
          task={editingTask ?? undefined}
          initialTitle={promotedTitle ?? undefined}
          onClose={handleCloseModal}
          onSubmit={handleSubmitTask}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setTaskToDelete(null)}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="relative w-full max-w-sm animate-scale-in">
            <div className="bg-surface-base border-subtle rounded-2xl shadow-2xl overflow-hidden p-6">
              {/* Warning icon */}
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-center font-display text-lg font-medium text-ink-rich mb-2">
                Delete Task?
              </h3>
              <p className="text-center text-sm text-ink-muted mb-6">
                This will delete &quot;{taskToDelete.title}&quot;. Are you sure?
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setTaskToDelete(null)}
                  className="flex-1 px-4 py-2.5 text-sm text-ink-muted hover:text-ink-rich
                    bg-surface-raised hover:bg-surface-overlay
                    rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteTask(taskToDelete.id)
                    setTaskToDelete(null)
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white
                    bg-rose-500 hover:bg-rose-600
                    rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

interface QuickTask {
  id: string
  text: string
  completed: boolean
}

interface QuickTasksProps {
  tasks: QuickTask[]
  setTasks: (tasks: QuickTask[] | ((prev: QuickTask[]) => QuickTask[])) => void
}

export function QuickTasks({ tasks, setTasks }: QuickTasksProps) {
  const [newTask, setNewTask] = useState('')

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const task: QuickTask = {
      id: crypto.randomUUID(),
      text: newTask.trim(),
      completed: false,
    }
    setTasks(prev => [...prev, task])
    setNewTask('')
  }

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="w-[240px] flex-shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-2 h-2 rounded-full bg-violet-400" />
        <h2 className="font-display text-base font-medium text-ink-rich">Quick Tasks</h2>
        {tasks.length > 0 && (
          <span className="text-xs text-ink-faint font-mono ml-auto">
            {completedCount}/{tasks.length}
          </span>
        )}
      </div>

      {/* Card */}
      <div className="bg-surface-base border-subtle rounded-2xl p-4 shadow-card">
        {/* Progress bar */}
        {tasks.length > 0 && (
          <div className="h-1 bg-surface-raised rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-400 to-amber-glow rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / tasks.length) * 100}%` }}
            />
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleAddTask} className="mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add quick task..."
            className="w-full bg-surface-raised border-subtle rounded-xl px-3 py-2.5
              text-sm text-ink-rich placeholder-ink-faint
              focus:border-amber-glow/50 focus:shadow-glow-sm
              transition-all duration-200"
          />
        </form>

        {/* Task List */}
        <div className="space-y-1 max-h-[360px] overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-ink-faint italic">No tasks yet</p>
              <p className="text-xs text-ink-faint/60 mt-1">Add one above</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg
                  hover:bg-surface-raised/50 transition-colors duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`
                    w-[18px] h-[18px] rounded-md flex-shrink-0
                    flex items-center justify-center
                    border transition-all duration-200
                    ${task.completed
                      ? 'bg-amber-glow border-amber-glow'
                      : 'border-ink-faint/40 hover:border-amber-glow/60'
                    }
                  `}
                >
                  {task.completed && (
                    <svg className="w-3 h-3 text-surface-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Text */}
                <span
                  className={`
                    text-sm flex-1 truncate transition-all duration-200
                    ${task.completed ? 'text-ink-faint line-through' : 'text-ink-rich'}
                  `}
                >
                  {task.text}
                </span>

                {/* Delete */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-rose-accent
                    transition-all duration-150 p-1 -m-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export type { QuickTask }

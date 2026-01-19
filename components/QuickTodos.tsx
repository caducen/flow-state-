'use client'

import { useState } from 'react'

interface QuickTodo {
  id: string
  text: string
  completed: boolean
}

interface QuickTodosProps {
  todos: QuickTodo[]
  setTodos: (todos: QuickTodo[] | ((prev: QuickTodo[]) => QuickTodo[])) => void
  onPromote?: (text: string, todoId: string) => void
}

export function QuickTodos({ todos, setTodos, onPromote }: QuickTodosProps) {
  const [newTodo, setNewTodo] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    const todo: QuickTodo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
    }
    setTodos(prev => [...prev, todo])
    setNewTodo('')
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const handlePromote = (todo: QuickTodo) => {
    if (onPromote) {
      onPromote(todo.text, todo.id)
    }
  }

  const pendingCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="w-[280px] flex-shrink-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        <h2 className="font-display text-base font-medium text-ink-rich">Quick Todos</h2>

        {/* Info icon with tooltip */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            className="text-ink-faint hover:text-ink-muted transition-colors p-0.5 rounded"
            aria-label="Learn about todos vs tasks"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {showTooltip && (
            <div
              className="absolute left-0 top-full mt-2 w-72 p-3 bg-surface-overlay border border-white/10 rounded-xl shadow-2xl"
              style={{ zIndex: 99999 }}
            >
              <p className="text-xs text-ink-rich font-medium mb-2">Quick Todos vs Tasks</p>
              <p className="text-xs text-ink-muted leading-relaxed mb-2">
                <span className="text-cyan-400 font-medium">Quick Todos</span> = Fast captures for small stuff. No energy cost - just check them off and go!
              </p>
              <p className="text-xs text-ink-muted leading-relaxed mb-2">
                <span className="text-amber-glow font-medium">Tasks</span> = Bigger work that takes energy. Has weight (2-6 points), priority, and structure. Use Today's Plan to budget your capacity.
              </p>
              <p className="text-xs text-ink-faint italic">
                Tap ↑ to promote a todo into a full task when it grows.
              </p>
            </div>
          )}
        </div>

        {/* Pending count badge */}
        {pendingCount > 0 && (
          <span className="text-sm font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 ml-auto">
            {pendingCount}
          </span>
        )}
      </div>

      {/* Subtitle - clarifies no energy cost */}
      <p className="text-xs text-ink-faint mb-3 ml-4">
        No energy cost - just quick captures
      </p>

      {/* Card */}
      <div className="bg-surface-base border-subtle rounded-2xl p-4 shadow-card">
        {/* Progress bar */}
        {todos.length > 0 && (
          <div className="h-1 bg-surface-raised rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-amber-glow rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / todos.length) * 100}%` }}
            />
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleAddTodo} className="mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a quick todo..."
            className="w-full bg-surface-raised border-subtle rounded-xl px-3 py-2.5
              text-sm text-ink-rich placeholder-ink-faint
              focus:border-amber-glow/50 focus:shadow-glow-sm
              transition-all duration-200"
          />
        </form>

        {/* Todo List */}
        <div className="space-y-1 max-h-[360px] overflow-y-auto">
          {todos.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-ink-faint italic">No todos yet</p>
              <p className="text-sm text-ink-faint/60 mt-1">Add one above</p>
            </div>
          ) : (
            todos.map((todo, index) => (
              <div
                key={todo.id}
                className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg
                  hover:bg-surface-raised/50 transition-colors duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`
                    w-[18px] h-[18px] rounded-md flex-shrink-0
                    flex items-center justify-center
                    border transition-all duration-200
                    ${todo.completed
                      ? 'bg-cyan-400 border-cyan-400'
                      : 'border-ink-faint/40 hover:border-cyan-400/60'
                    }
                  `}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3 text-surface-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Text */}
                <span
                  className={`
                    text-base flex-1 truncate transition-all duration-200
                    ${todo.completed ? 'text-ink-faint line-through' : 'text-ink-rich'}
                  `}
                >
                  {todo.text}
                </span>

                {/* Promote to Task - always visible, fills on hover */}
                {onPromote && !todo.completed && (
                  <button
                    onClick={() => handlePromote(todo)}
                    title="Promote to Task"
                    className="text-ink-faint/50 hover:text-amber-glow hover:scale-110
                      transition-all duration-200 p-1 -m-1 group/promote"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      {/* Outlined arrow - visible by default */}
                      <path
                        className="group-hover/promote:opacity-0 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 19V5m0 0l-6 6m6-6l6 6"
                      />
                      {/* Filled arrow - visible on hover */}
                      <path
                        className="opacity-0 group-hover/promote:opacity-100 transition-opacity"
                        fill="currentColor"
                        d="M12 4a1 1 0 0 1 .707.293l6 6a1 1 0 0 1-1.414 1.414L13 7.414V19a1 1 0 1 1-2 0V7.414l-4.293 4.293a1 1 0 0 1-1.414-1.414l6-6A1 1 0 0 1 12 4z"
                      />
                    </svg>
                  </button>
                )}

                {/* Delete - always visible, fills on hover */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  title="Delete todo"
                  className="text-ink-faint/50 hover:text-rose-accent hover:scale-110
                    transition-all duration-200 p-1 -m-1 group/delete"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    {/* Outlined X - visible by default */}
                    <path
                      className="group-hover/delete:opacity-0 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                    {/* Filled X - visible on hover */}
                    <path
                      className="opacity-0 group-hover/delete:opacity-100 transition-opacity"
                      fill="currentColor"
                      d="M6.293 6.293a1 1 0 0 1 1.414 0L12 10.586l4.293-4.293a1 1 0 1 1 1.414 1.414L13.414 12l4.293 4.293a1 1 0 0 1-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L10.586 12 6.293 7.707a1 1 0 0 1 0-1.414z"
                    />
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

export type { QuickTodo }

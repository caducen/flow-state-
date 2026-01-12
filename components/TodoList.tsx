'use client'

import { useState } from 'react'
import { TodoItem } from '@/types'

interface TodoListProps {
  todos: TodoItem[]
  setTodos: (todos: TodoItem[] | ((prev: TodoItem[]) => TodoItem[])) => void
  onPromote?: (text: string, todoId: string) => void
}

export function TodoList({ todos, setTodos, onPromote }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    const todo: TodoItem = {
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

  const pendingCount = todos.filter(t => !t.completed).length

  return (
    <div className="bg-surface-base border-subtle rounded-2xl p-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <h2 className="font-display text-base font-medium text-ink-rich">Quick Todos</h2>
          {/* Info icon with tooltip */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-ink-faint hover:text-ink-muted transition-colors p-0.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showTooltip && (
              <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-surface-overlay border border-white/10 rounded-xl shadow-xl z-50">
                <p className="text-xs text-ink-rich font-medium mb-1.5">Todo vs Task</p>
                <p className="text-xs text-ink-muted leading-relaxed mb-2">
                  <span className="text-cyan-400">Todo</span> = A reminder. Points your attention to something you shouldn't forget.
                </p>
                <p className="text-xs text-ink-muted leading-relaxed">
                  <span className="text-amber-glow">Task</span> = A unit of work. Clearly scoped, actionable, with a beginning and end.
                </p>
              </div>
            )}
          </div>
        </div>
        {pendingCount > 0 && (
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400">
            {pendingCount}
          </span>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleAddTodo} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a todo..."
          className="w-full bg-surface-raised border-subtle rounded-xl px-3 py-2.5
            text-sm text-ink-rich placeholder-ink-faint
            focus:border-amber-glow/50 focus:shadow-glow-sm
            transition-all duration-200"
        />
      </form>

      {/* Todo List */}
      <div className="space-y-0.5 max-h-[200px] overflow-y-auto">
        {todos.length === 0 ? (
          <p className="text-xs text-ink-faint text-center py-6 italic">No todos yet</p>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg
                hover:bg-surface-raised/50 transition-colors duration-150"
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
                  text-sm flex-1 truncate transition-all duration-200
                  ${todo.completed ? 'text-ink-faint line-through' : 'text-ink-rich'}
                `}
              >
                {todo.text}
              </span>

              {/* Promote to Task */}
              {onPromote && !todo.completed && (
                <button
                  onClick={() => onPromote(todo.text, todo.id)}
                  title="Promote to Task"
                  className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-amber-glow
                    transition-all duration-150 p-1 -m-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              )}

              {/* Delete */}
              <button
                onClick={() => deleteTodo(todo.id)}
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
  )
}

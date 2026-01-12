'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Task, TaskStatus, Label } from '@/types'
import { KanbanColumn } from './KanbanColumn'
import { AddTaskModal } from './AddTaskModal'

interface KanbanBoardProps {
  tasks: Task[]
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void
  labels: Label[]
  setLabels: (labels: Label[] | ((prev: Label[]) => Label[])) => void
  promotedTodo?: { text: string; id: string } | null
  onPromotedTodoHandled?: () => void
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'complete', title: 'Complete' },
]

type FilterMode = 'all' | 'today'

// Check if a date is today
function isToday(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  return date.getTime() === today.getTime()
}

export function KanbanBoard({ tasks, setTasks, labels, setLabels, promotedTodo, onPromotedTodoHandled }: KanbanBoardProps) {
  const [showModal, setShowModal] = useState(false)
  const [addToStatus, setAddToStatus] = useState<TaskStatus>('todo')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [promotedTitle, setPromotedTitle] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  // Handle promoted todo from Quick Todos
  useEffect(() => {
    if (promotedTodo) {
      setPromotedTitle(promotedTodo.text)
      setAddToStatus('todo')
      setEditingTask(null)
      setShowModal(true)
      onPromotedTodoHandled?.()
    }
  }, [promotedTodo, onPromotedTodoHandled])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Get Today's 3 tasks (not completed)
  const todaysTasks = useMemo(() => {
    return tasks.filter(t => t.isTodayTask && t.status !== 'complete')
  }, [tasks])

  // Filter tasks based on search and today filter
  const filteredTasks = useMemo(() => {
    let result = tasks

    // Apply today filter
    if (filterMode === 'today') {
      result = result.filter(task => {
        const isDueToday = task.dueDate && isToday(task.dueDate)
        return task.isTodayTask || isDueToday
      })
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(task => {
        const matchesTitle = task.title.toLowerCase().includes(query)
        const matchesDescription = task.description?.toLowerCase().includes(query)
        const matchesLabels = task.labelIds.some(id => {
          const label = labels.find(l => l.id === id)
          return label?.name.toLowerCase().includes(query)
        })
        return matchesTitle || matchesDescription || matchesLabels
      })
    }

    return result
  }, [tasks, searchQuery, labels, filterMode])

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    const overTask = tasks.find(t => t.id === overId)
    const overColumn = COLUMNS.find(c => c.id === overId)

    let newStatus: TaskStatus | undefined

    if (overColumn) {
      newStatus = overColumn.id
    } else if (overTask) {
      newStatus = overTask.status
    }

    if (newStatus && activeTask.status !== newStatus) {
      setTasks(prev =>
        prev.map(t =>
          t.id === activeId ? { ...t, status: newStatus } : t
        )
      )
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(t => t.id === activeId)
    const overTask = tasks.find(t => t.id === overId)

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const statusTasks = tasks.filter(t => t.status === activeTask.status)
      const oldIndex = statusTasks.findIndex(t => t.id === activeId)
      const newIndex = statusTasks.findIndex(t => t.id === overId)

      if (oldIndex !== newIndex) {
        const reorderedStatusTasks = arrayMove(statusTasks, oldIndex, newIndex)
        setTasks(prev => {
          const otherTasks = prev.filter(t => t.status !== activeTask.status)
          return [...otherTasks, ...reorderedStatusTasks]
        })
      }
    }
  }

  const handleAddTask = (status: TaskStatus) => {
    setAddToStatus(status)
    setEditingTask(null)
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
        status: addToStatus,
        createdAt: Date.now(),
      }
      setTasks(prev => [...prev, newTask])
    }
    handleCloseModal()
  }

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const handleToggleTodayTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    // If trying to add and already have 3, show gentle nudge
    if (!task.isTodayTask && todaysTasks.length >= 3) {
      // Don't add more than 3
      return
    }

    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, isTodayTask: !t.isTodayTask } : t
    ))
  }

  const totalTasks = tasks.length
  const filteredCount = filteredTasks.length
  const canAddTodayTask = todaysTasks.length < 3

  return (
    <>
      {/* Today's 3 Bar */}
      {todaysTasks.length > 0 && (
        <div className="mb-4 p-3 bg-surface-base border-subtle rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-amber-glow" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xs font-medium text-ink-rich">Today's {todaysTasks.length}</span>
            <span className="text-xs text-ink-faint">/ 3</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {todaysTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-surface-raised rounded-lg text-xs"
              >
                <span className="text-ink-rich truncate max-w-[150px]">{task.title}</span>
                <button
                  onClick={() => handleToggleTodayTask(task.id)}
                  className="text-ink-faint hover:text-rose-accent transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-surface-base border-subtle rounded-xl pl-10 pr-4 py-2.5
              text-sm text-ink-rich placeholder-ink-faint
              focus:border-amber-glow/50 focus:shadow-glow-sm
              transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-rich transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 p-1 bg-surface-base border-subtle rounded-xl">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              filterMode === 'all'
                ? 'bg-surface-raised text-ink-rich shadow-sm'
                : 'text-ink-muted hover:text-ink-rich'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('today')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              filterMode === 'today'
                ? 'bg-amber-glow/20 text-amber-glow shadow-sm'
                : 'text-ink-muted hover:text-ink-rich'
            }`}
          >
            Today
          </button>
        </div>
      </div>

      {/* Filter info */}
      {(searchQuery || filterMode === 'today') && (
        <p className="text-xs text-ink-muted mb-4">
          Showing {filteredCount} of {totalTasks} tasks
          {filterMode === 'today' && ' (Today filter active)'}
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              labels={labels}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onToggleTodayTask={handleToggleTodayTask}
              canAddTodayTask={canAddTodayTask}
            />
          ))}
        </div>
      </DndContext>

      {showModal && (
        <AddTaskModal
          labels={labels}
          task={editingTask ?? undefined}
          initialTitle={promotedTitle ?? undefined}
          onClose={handleCloseModal}
          onSubmit={handleSubmitTask}
        />
      )}
    </>
  )
}

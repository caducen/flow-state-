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

export function KanbanBoard({ tasks, setTasks, labels, setLabels, promotedTodo, onPromotedTodoHandled }: KanbanBoardProps) {
  const [showModal, setShowModal] = useState(false)
  const [addToStatus, setAddToStatus] = useState<TaskStatus>('todo')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [promotedTitle, setPromotedTitle] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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

  // Filter tasks based on search
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks

    const query = searchQuery.toLowerCase()
    return tasks.filter(task => {
      const matchesTitle = task.title.toLowerCase().includes(query)
      const matchesDescription = task.description?.toLowerCase().includes(query)
      const matchesLabels = task.labelIds.some(id => {
        const label = labels.find(l => l.id === id)
        return label?.name.toLowerCase().includes(query)
      })
      return matchesTitle || matchesDescription || matchesLabels
    })
  }, [tasks, searchQuery, labels])

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

  const totalTasks = tasks.length
  const filteredCount = filteredTasks.length

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
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
        {searchQuery && (
          <p className="text-xs text-ink-muted mt-2">
            Showing {filteredCount} of {totalTasks} tasks
          </p>
        )}
      </div>

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

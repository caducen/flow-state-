export type Priority = 'high' | 'medium' | 'low'

export interface Label {
  id: string
  name: string
  color: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'complete'
  priority: Priority
  dueDate?: string // ISO date string
  labelIds: string[]
  createdAt: number
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export type TaskStatus = Task['status']

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
}

// Default labels
export const DEFAULT_LABELS: Label[] = [
  { id: 'bug', name: 'Bug', color: '#ef4444' },
  { id: 'feature', name: 'Feature', color: '#8b5cf6' },
  { id: 'design', name: 'Design', color: '#ec4899' },
  { id: 'docs', name: 'Docs', color: '#06b6d4' },
  { id: 'refactor', name: 'Refactor', color: '#f59e0b' },
  { id: 'research', name: 'Research', color: '#5eaa9f' },
  { id: 'planning', name: 'Planning', color: '#7ea88f' },
  { id: 'admin', name: 'Admin', color: '#8b9caa' },
  { id: 'learning', name: 'Learning', color: '#9a9fd8' },
  { id: 'meeting', name: 'Meeting', color: '#c9887a' },
  { id: 'review', name: 'Review', color: '#b898a8' },
]

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string }> = {
  high: { label: 'High', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
  medium: { label: 'Medium', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' },
  low: { label: 'Low', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.15)' },
}

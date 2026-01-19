export type Priority = 'high' | 'medium' | 'low'
export type EnergyLevel = 'high' | 'medium' | 'low'
export type UserState = 'grounded' | 'scattered' | 'tired'

// Energy Settings - User-customizable values
export interface EnergySettings {
  // Daily energy states
  grounded: number
  scattered: number
  tired: number
  // Task weight: priority
  priorityHigh: number
  priorityMed: number
  priorityLow: number
  // Task weight: energy level
  energyHigh: number
  energyMed: number
  energyLow: number
  // Work window (custom active hours)
  workWindowStart: number // Hour of day (0-23) when 12-hour work window begins
  // Metadata
  customized: boolean
  lastUpdated: string
}

export const DEFAULT_ENERGY_SETTINGS: EnergySettings = {
  grounded: 18,
  scattered: 9,
  tired: 6,
  priorityHigh: 3,
  priorityMed: 2,
  priorityLow: 1,
  energyHigh: 3,
  energyMed: 2,
  energyLow: 1,
  workWindowStart: 7, // Default: 7am to 7pm (traditional work hours)
  customized: false,
  lastUpdated: new Date().toISOString(),
}

// Point values for task weight calculation (defaults - use EnergySettings for dynamic values)
export const PRIORITY_POINTS: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

export const ENERGY_POINTS: Record<EnergyLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Subtask {
  id: string
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'active' | 'archived'  // Simplified: active or archived
  progress: number  // 0, 25, 50, 75, 100
  priority: Priority
  energyLevel?: EnergyLevel // Energy required: High / Medium / Low
  dueDate?: string // ISO date string
  labelIds: string[]
  subtasks?: Subtask[]
  createdAt: number
  completedAt?: number  // When task was archived
  isTodayTask?: boolean // Part of "Today's 3"
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export type TaskStatus = Task['status']

// Progress color configuration (matches energy bar gradient)
export const PROGRESS_CONFIG: Record<number, { label: string; color: string; bgColor: string }> = {
  0: { label: 'Not Started', color: '#F43F5E', bgColor: 'rgba(244, 63, 94, 0.15)' },    // Red
  25: { label: '25%', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.15)' },          // Orange
  50: { label: '50%', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },          // Blue
  75: { label: '75%', color: '#06B6D4', bgColor: 'rgba(6, 182, 212, 0.15)' },           // Cyan
  100: { label: 'Complete', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },    // Green
}

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

export const ENERGY_CONFIG: Record<EnergyLevel, { label: string; icon: string; color: string; bgColor: string }> = {
  high: { label: 'High Energy', icon: '⚡', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' },
  medium: { label: 'Medium Energy', icon: '🔋', color: '#8b9caa', bgColor: 'rgba(139, 156, 170, 0.15)' },
  low: { label: 'Low Energy', icon: '🌙', color: '#9a9fd8', bgColor: 'rgba(154, 159, 216, 0.15)' },
}

// Energy Balance by user state (points available for today's tasks)
export const ENERGY_BALANCE: Record<UserState, number> = {
  grounded: 18,
  scattered: 9,
  tired: 6,
}

export const USER_STATE_CONFIG: Record<UserState, {
  label: string
  icon: string
  color: string
  energyBalance: number
  description: string
}> = {
  grounded: {
    label: 'Grounded',
    icon: '🌱',
    color: '#7ea88f',
    energyBalance: 18,
    description: 'Full energy, clear mind, ready for challenges',
  },
  scattered: {
    label: 'Scattered',
    icon: '🌀',
    color: '#5c9ecf',
    energyBalance: 9,
    description: 'Some energy, needs focus, moderate capacity',
  },
  tired: {
    label: 'Tired',
    icon: '😴',
    color: '#c9887a',
    energyBalance: 6,
    description: 'Limited energy, needs rest, light tasks only',
  },
}

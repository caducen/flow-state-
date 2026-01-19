import { Task, EnergyLevel, Priority, PRIORITY_POINTS, ENERGY_POINTS, ENERGY_BALANCE, UserState, EnergySettings, DEFAULT_ENERGY_SETTINGS } from '@/types'

export type CapacityZone = 'under' | 'balanced' | 'over'
export type EnergyZone = 'full' | 'good' | 'half' | 'low' | 'warning' | 'critical' | 'overloaded'

export type WeightCategory = 'light' | 'medium' | 'heavy'

// Helper to get priority points from settings
function getPriorityPointsFromSettings(priority: Priority, settings?: EnergySettings): number {
  if (!settings) return PRIORITY_POINTS[priority]
  switch (priority) {
    case 'high': return settings.priorityHigh
    case 'medium': return settings.priorityMed
    case 'low': return settings.priorityLow
  }
}

// Helper to get energy points from settings
function getEnergyPointsFromSettings(energyLevel: EnergyLevel, settings?: EnergySettings): number {
  if (!settings) return ENERGY_POINTS[energyLevel]
  switch (energyLevel) {
    case 'high': return settings.energyHigh
    case 'medium': return settings.energyMed
    case 'low': return settings.energyLow
  }
}

// Helper to get max energy from settings (grounded is always max)
function getMaxEnergyFromSettings(settings?: EnergySettings): number {
  return settings?.grounded ?? DEFAULT_ENERGY_SETTINGS.grounded
}

/**
 * Calculate base task weight from priority + energy
 * Range: 2 (low+low) to 6 (high+high) with default settings
 */
export function getBaseTaskWeight(task: Task, settings?: EnergySettings): number {
  const priorityPoints = getPriorityPointsFromSettings(task.priority, settings)
  const energyPoints = getEnergyPointsFromSettings(task.energyLevel ?? 'medium', settings)
  return priorityPoints + energyPoints
}

/**
 * Calculate effective task weight accounting for progress
 * A task that's 75% done only costs 25% of its original weight
 */
export function getTaskWeight(task: Task, settings?: EnergySettings): number {
  const baseWeight = getBaseTaskWeight(task, settings)
  const progress = task.progress ?? 0
  const remainingWork = (100 - progress) / 100
  return Math.round(baseWeight * remainingWork * 10) / 10  // Round to 1 decimal
}

/**
 * Get total weight of tasks marked for today
 */
export function getSelectedWeight(tasks: Task[], settings?: EnergySettings): number {
  return tasks
    .filter(task => task.isTodayTask)
    .reduce((sum, task) => sum + getTaskWeight(task, settings), 0)
}

/**
 * Get energy balance for a user state
 * Returns default (scattered) if no state selected
 */
export function getEnergyBalance(userState: UserState | null, settings?: EnergySettings): number {
  if (!settings) {
    if (!userState) return ENERGY_BALANCE.scattered
    return ENERGY_BALANCE[userState]
  }
  if (!userState) return settings.scattered
  return settings[userState]
}

/**
 * Calculate capacity percentage (0-100+)
 * Used for Flow Meter animation
 */
export function getCapacityPercentage(selectedWeight: number, energyBalance: number): number {
  if (energyBalance === 0) return 0
  return (selectedWeight / energyBalance) * 100
}

/**
 * Determine capacity zone based on percentage
 * Under: < 70%, Balanced: 70-100%, Over: > 100%
 */
export function getCapacityZone(percentage: number): CapacityZone {
  if (percentage < 70) return 'under'
  if (percentage <= 100) return 'balanced'
  return 'over'
}

/**
 * Categorize task weight
 * Light: 2-3 pts, Medium: 4 pts, Heavy: 5-6 pts
 */
export function getWeightCategory(weight: number): WeightCategory {
  if (weight <= 3) return 'light'
  if (weight <= 4) return 'medium'
  return 'heavy'
}

/**
 * Get user-friendly message for capacity zone (legacy - based on capacity used)
 */
export function getCapacityMessage(zone: CapacityZone): string {
  switch (zone) {
    case 'under':
      return 'You have room for more'
    case 'balanced':
      return 'Good balance for today'
    case 'over':
      return "That's ambitious. Are you sure?"
  }
}

/**
 * Calculate remaining energy percentage (fuel gauge style)
 * Based on remaining energy out of max energy (grounded value)
 */
export function getRemainingPercentage(selectedWeight: number, energyBalance: number, settings?: EnergySettings): number {
  const maxEnergy = getMaxEnergyFromSettings(settings)
  const remaining = Math.max(energyBalance - selectedWeight, 0)
  return (remaining / maxEnergy) * 100
}

/**
 * Determine energy zone based on remaining percentage
 * Matches the 6-color gradient system used in EnergyProgressBar and EnergyCursor
 * 80-100%: Green (full)
 * 60-80%: Cyan (good)
 * 45-60%: Blue (half)
 * 30-45%: Purple (low)
 * 15-30%: Orange (warning)
 * 0-15%: Red (critical)
 * Over capacity: Red (overloaded)
 */
export function getEnergyZone(selectedWeight: number, energyBalance: number, settings?: EnergySettings): EnergyZone {
  if (selectedWeight > energyBalance) return 'overloaded'

  const remainingPercent = getRemainingPercentage(selectedWeight, energyBalance, settings)

  if (remainingPercent > 80) return 'full'
  if (remainingPercent > 60) return 'good'
  if (remainingPercent > 45) return 'half'
  if (remainingPercent > 30) return 'low'
  if (remainingPercent > 15) return 'warning'
  return 'critical'
}

/**
 * Get user-friendly message for energy zone (fuel gauge style)
 * Matches the 6-color gradient system
 */
export function getEnergyMessage(zone: EnergyZone): string {
  switch (zone) {
    case 'full':
      return 'Full tank! Plenty of energy'
    case 'good':
      return 'Good reserves remaining'
    case 'half':
      return 'Half tank - pacing well'
    case 'low':
      return 'Getting low on capacity'
    case 'warning':
      return 'Running low - prioritize carefully'
    case 'critical':
      return 'Very low capacity remaining'
    case 'overloaded':
      return 'Overloaded - consider dropping tasks'
  }
}

/**
 * Get color for energy zone (hex values)
 * Matches EnergyProgressBar and EnergyCursor colors
 */
export function getEnergyZoneColor(zone: EnergyZone): string {
  switch (zone) {
    case 'full': return '#10B981'      // Emerald/Green
    case 'good': return '#06B6D4'      // Cyan
    case 'half': return '#3B82F6'      // Blue
    case 'low': return '#8B5CF6'       // Violet/Purple
    case 'warning': return '#F97316'   // Orange
    case 'critical': return '#F43F5E'  // Rose/Red
    case 'overloaded': return '#F43F5E' // Rose/Red
  }
}

/**
 * Base percentage offset for each user state
 * This determines the STARTING position of the Flow Meter arrow
 * - Grounded: starts GREEN (0%)
 * - Scattered: starts BLUE (~50%)
 * - Tired: starts RED (~85%)
 */
export const STATE_BASE_PERCENTAGE: Record<UserState, number> = {
  grounded: 0,
  scattered: 50,
  tired: 85,
}

/**
 * Get the display percentage for the Flow Meter
 * Combines the state's base position with capacity used
 * @param userState - The user's current state
 * @param capacityPercentage - The percentage of energy balance used by tasks
 */
export function getFlowMeterPercentage(userState: UserState | null, capacityPercentage: number): number {
  if (!userState) return 50 // Default to middle if no state selected

  const basePercentage = STATE_BASE_PERCENTAGE[userState]

  // Scale the capacity percentage based on available range
  // Grounded: 0-140% range (full range)
  // Scattered: 50-140% range (starts at blue)
  // Tired: 85-140% range (starts at red, very little room)
  const availableRange = 140 - basePercentage
  const scaledCapacity = (capacityPercentage / 100) * availableRange

  return basePercentage + scaledCapacity
}

/**
 * Time-Based Check-In Intelligence
 *
 * Custom work window: 12 hours starting from user-defined hour
 * Energy points scale based on hours remaining in the work window
 */

export interface TimeAdjustedEnergy {
  basePoints: number
  adjustedPoints: number
  hoursRemaining: number
  checkInTime: Date
  isBeforeWindow: boolean // Before work window starts
  workWindowStart: number
  workWindowEnd: number
}

/**
 * Calculate hours remaining in the work window
 * Handles windows that span midnight (e.g., 6pm to 6am)
 */
function getHoursRemainingInWindow(
  currentHour: number,
  currentMinute: number,
  windowStart: number
): { hoursRemaining: number; isBeforeWindow: boolean } {
  const WORK_WINDOW_HOURS = 12
  const windowEnd = (windowStart + WORK_WINDOW_HOURS) % 24
  const currentTime = currentHour + currentMinute / 60

  // Check if window spans midnight
  const spansMiddnight = windowEnd < windowStart

  let isInWindow: boolean
  let hoursRemaining: number
  let isBeforeWindow: boolean

  if (spansMiddnight) {
    // Window spans midnight (e.g., 18:00 to 06:00)
    isInWindow = currentTime >= windowStart || currentTime < windowEnd
    isBeforeWindow = currentTime < windowStart && currentTime >= windowEnd

    if (isInWindow) {
      if (currentTime >= windowStart) {
        // After window start, before midnight
        hoursRemaining = (24 - currentTime) + windowEnd
      } else {
        // After midnight, before window end
        hoursRemaining = windowEnd - currentTime
      }
    } else {
      hoursRemaining = 0
    }
  } else {
    // Window within same day (e.g., 07:00 to 19:00)
    isInWindow = currentTime >= windowStart && currentTime < windowEnd
    isBeforeWindow = currentTime < windowStart

    if (isBeforeWindow) {
      // Before window: full hours available
      hoursRemaining = WORK_WINDOW_HOURS
    } else if (isInWindow) {
      hoursRemaining = windowEnd - currentTime
    } else {
      hoursRemaining = 0
    }
  }

  return { hoursRemaining: Math.max(0, hoursRemaining), isBeforeWindow }
}

/**
 * Calculate time-adjusted energy points based on hours remaining in work window
 * @param basePoints - The base energy points for the selected state
 * @param checkInTime - The time of check-in (defaults to now)
 * @param workWindowStart - Hour when work window begins (0-23, default 7)
 * @returns Adjusted points (minimum 1)
 */
export function getTimeAdjustedPoints(
  basePoints: number,
  checkInTime: Date = new Date(),
  workWindowStart: number = 7
): number {
  const hour = checkInTime.getHours()
  const minute = checkInTime.getMinutes()
  const WORK_WINDOW_HOURS = 12

  const { hoursRemaining, isBeforeWindow } = getHoursRemainingInWindow(hour, minute, workWindowStart)

  // Before work window: full points
  if (isBeforeWindow) return basePoints

  // Scale points based on remaining hours in window
  const adjustedPoints = basePoints * (hoursRemaining / WORK_WINDOW_HOURS)

  // Minimum 1 point (never zero)
  return Math.max(1, Math.round(adjustedPoints))
}

/**
 * Get detailed time information for UI display
 * @param basePoints - The base energy points for the selected state
 * @param checkInTime - The time of check-in (defaults to now)
 * @param workWindowStart - Hour when work window begins (0-23, default 7)
 */
export function getTimeInfo(
  basePoints: number,
  checkInTime: Date = new Date(),
  workWindowStart: number = 7
): TimeAdjustedEnergy {
  const hour = checkInTime.getHours()
  const minute = checkInTime.getMinutes()
  const WORK_WINDOW_HOURS = 12
  const workWindowEnd = (workWindowStart + WORK_WINDOW_HOURS) % 24

  const { hoursRemaining, isBeforeWindow } = getHoursRemainingInWindow(hour, minute, workWindowStart)

  return {
    basePoints,
    adjustedPoints: getTimeAdjustedPoints(basePoints, checkInTime, workWindowStart),
    hoursRemaining: Math.round(hoursRemaining * 10) / 10, // Round to 1 decimal
    checkInTime,
    isBeforeWindow,
    workWindowStart,
    workWindowEnd,
  }
}

/**
 * Format time for display (e.g., "2:30pm")
 */
export function formatCheckInTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase()
}

/**
 * Get weight category display info
 */
export const WEIGHT_CATEGORY_CONFIG: Record<WeightCategory, { label: string; color: string; description: string }> = {
  light: {
    label: 'Light',
    color: '#7CB342',
    description: 'Quick win - low energy',
  },
  medium: {
    label: 'Medium',
    color: '#2196F3',
    description: 'Moderate energy needed',
  },
  heavy: {
    label: 'Heavy',
    color: '#F4511E',
    description: 'This task requires a grounded state',
  },
}

import { Task, EnergyLevel, PRIORITY_POINTS, ENERGY_POINTS, ENERGY_BALANCE, UserState } from '@/types'

export type CapacityZone = 'under' | 'balanced' | 'over'
export type WeightCategory = 'light' | 'medium' | 'heavy'

/**
 * Calculate task weight from priority + energy
 * Range: 2 (low+low) to 6 (high+high)
 */
export function getTaskWeight(task: Task): number {
  const priorityPoints = PRIORITY_POINTS[task.priority]
  const energyPoints = ENERGY_POINTS[task.energyLevel ?? 'medium']
  return priorityPoints + energyPoints
}

/**
 * Get total weight of tasks marked for today
 */
export function getSelectedWeight(tasks: Task[]): number {
  return tasks
    .filter(task => task.isTodayTask)
    .reduce((sum, task) => sum + getTaskWeight(task), 0)
}

/**
 * Get energy balance for a user state
 * Returns default (scattered=9) if no state selected
 */
export function getEnergyBalance(userState: UserState | null): number {
  if (!userState) return ENERGY_BALANCE.scattered
  return ENERGY_BALANCE[userState]
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
 * Get user-friendly message for capacity zone
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

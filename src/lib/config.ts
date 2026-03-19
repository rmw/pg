import { ConceptionInfo, ConceptionType, parseDate } from './pregnancy'

export interface MilestoneConfig {
  label: string
  weeks: number
}

export interface PregnancyConfig {
  conceptionType: ConceptionType
  date: string
  milestones?: MilestoneConfig[]
}

const VALID_CONCEPTION_TYPES: ConceptionType[] = [
  'lmp',
  'natural',
  'ivf-fresh',
  'ivf-3day',
  'ivf-5day',
  'ivf-6day',
]

const DEFAULT_MILESTONES: MilestoneConfig[] = [
  { label: 'Second Trimester', weeks: 14 },
  { label: 'Third Trimester', weeks: 28 },
  { label: '39 Weeks', weeks: 39 },
  { label: 'Due Date', weeks: 40 },
]

/**
 * Validate a raw config object and return a typed PregnancyConfig.
 * Throws descriptive errors for invalid values.
 */
export function validateConfig(raw: unknown): PregnancyConfig {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Config must be a JSON object')
  }

  const obj = raw as Record<string, unknown>

  if (!obj.conceptionType || typeof obj.conceptionType !== 'string') {
    throw new Error('Config must include "conceptionType" (string)')
  }

  if (!VALID_CONCEPTION_TYPES.includes(obj.conceptionType as ConceptionType)) {
    throw new Error(
      `Invalid conceptionType "${obj.conceptionType}". Must be one of: ${VALID_CONCEPTION_TYPES.join(', ')}`
    )
  }

  if (!obj.date || typeof obj.date !== 'string') {
    throw new Error('Config must include "date" (string in YYYY-MM-DD format)')
  }

  // Validate that the date is parseable
  try {
    parseDate(obj.date)
  } catch {
    throw new Error(`Invalid date "${obj.date}". Use YYYY-MM-DD format.`)
  }

  const config: PregnancyConfig = {
    conceptionType: obj.conceptionType as ConceptionType,
    date: obj.date,
  }

  if (obj.milestones !== undefined) {
    if (!Array.isArray(obj.milestones)) {
      throw new Error('"milestones" must be an array')
    }
    for (const [i, m] of obj.milestones.entries()) {
      if (!m || typeof m !== 'object') {
        throw new Error(`milestones[${i}] must be an object`)
      }
      if (typeof m.label !== 'string' || !m.label) {
        throw new Error(`milestones[${i}].label must be a non-empty string`)
      }
      if (typeof m.weeks !== 'number' || m.weeks < 0) {
        throw new Error(`milestones[${i}].weeks must be a non-negative number`)
      }
    }
    config.milestones = obj.milestones as MilestoneConfig[]
  }

  return config
}

/**
 * Build a ConceptionInfo from a validated config.
 */
export function buildConceptionInfo(config: PregnancyConfig): ConceptionInfo {
  const date = parseDate(config.date)

  switch (config.conceptionType) {
    case 'lmp':
      return { type: 'lmp', lmpDate: date }
    case 'natural':
      return { type: 'natural', conceptionDate: date }
    case 'ivf-fresh':
      return { type: 'ivf-fresh', retrievalDate: date }
    case 'ivf-3day':
      return { type: 'ivf-3day', transferDate: date }
    case 'ivf-5day':
      return { type: 'ivf-5day', transferDate: date }
    case 'ivf-6day':
      return { type: 'ivf-6day', transferDate: date }
  }
}

/**
 * Get milestones from config, falling back to defaults.
 */
export function getMilestoneConfig(config: PregnancyConfig): MilestoneConfig[] {
  return config.milestones ?? DEFAULT_MILESTONES
}

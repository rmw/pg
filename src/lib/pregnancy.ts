// Conception method types
export type ConceptionType =
  | 'lmp'
  | 'natural'
  | 'ivf-fresh'
  | 'ivf-3day'
  | 'ivf-5day'
  | 'ivf-6day'

// Discriminated union for conception info
export type ConceptionInfo =
  | { type: 'lmp'; lmpDate: Date }
  | { type: 'natural'; conceptionDate: Date }
  | { type: 'ivf-fresh'; retrievalDate: Date }
  | { type: 'ivf-3day'; transferDate: Date }
  | { type: 'ivf-5day'; transferDate: Date }
  | { type: 'ivf-6day'; transferDate: Date }

export interface WeeksAndDays {
  weeks: number
  days: number
  totalDays: number
}

export interface Milestone {
  label: string
  weeks: number
  date: Date
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

// Days from conception/retrieval/transfer back to equivalent LMP
const CONCEPTION_OFFSETS: Record<ConceptionType, number> = {
  'lmp': 0,
  'natural': 14,
  'ivf-fresh': 14,
  'ivf-3day': 14 + 3,
  'ivf-5day': 14 + 5,
  'ivf-6day': 14 + 6,
}

const DEFAULT_MILESTONES = [
  { label: 'Second Trimester', weeks: 14 },
  { label: 'Third Trimester', weeks: 28 },
  { label: '39 Weeks', weeks: 39 },
  { label: 'Due Date', weeks: 40 },
]

/** Strip time component, keeping only the date in UTC */
export function dateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

/** Parse a date string to a UTC-midnight date. Accepts ISO (YYYY-MM-DD) or other formats. */
export function parseDate(s: string): Date {
  // ISO date-only format — parse directly as UTC to avoid local-time ambiguity
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const [, y, m, d] = isoMatch.map(Number)
    return new Date(Date.UTC(y, m - 1, d))
  }
  const d = new Date(s)
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date: "${s}"`)
  }
  // For non-ISO formats (parsed as local time), use local getters to preserve the intended date
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
}

/** Add days to a date, returning a new Date */
export function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * MS_PER_DAY)
}

/** Get the number of whole days between two dates */
export function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY)
}

/**
 * Convert any conception info to an equivalent LMP (Last Menstrual Period) date.
 *
 * All pregnancy dating uses LMP as the reference point:
 * - LMP: used directly
 * - Natural conception / IVF fresh: conception date minus 14 days
 * - IVF 3-day transfer: transfer date minus 17 days (14 + 3)
 * - IVF 5-day transfer: transfer date minus 19 days (14 + 5)
 * - IVF 6-day transfer: transfer date minus 20 days (14 + 6)
 */
export function getLmpEquivalent(info: ConceptionInfo): Date {
  const offset = CONCEPTION_OFFSETS[info.type]
  const baseDate = getBaseDate(info)
  return addDays(dateOnly(baseDate), -offset)
}

function getBaseDate(info: ConceptionInfo): Date {
  switch (info.type) {
    case 'lmp':
      return info.lmpDate
    case 'natural':
      return info.conceptionDate
    case 'ivf-fresh':
      return info.retrievalDate
    case 'ivf-3day':
    case 'ivf-5day':
    case 'ivf-6day':
      return info.transferDate
  }
}

/**
 * Calculate weeks and days of pregnancy as of a given date.
 * Returns negative totalDays if asOfDate is before the LMP equivalent.
 */
export function getWeeksAndDays(
  info: ConceptionInfo,
  asOfDate: Date = new Date()
): WeeksAndDays {
  const lmp = getLmpEquivalent(info)
  const totalDays = daysBetween(lmp, dateOnly(asOfDate))
  const weeks = Math.floor(totalDays / 7)
  const days = totalDays % 7
  return { weeks, days, totalDays }
}

/**
 * Calculate the date when the pregnancy reaches a given number of weeks.
 */
export function getDateForWeek(info: ConceptionInfo, weeks: number): Date {
  const lmp = getLmpEquivalent(info)
  return addDays(lmp, weeks * 7)
}

/**
 * Calculate the due date (40 weeks from LMP equivalent).
 */
export function getDueDate(info: ConceptionInfo): Date {
  return getDateForWeek(info, 40)
}

/**
 * Get the What to Expect URL for a given week.
 */
export function getWhatToExpectUrl(weeks: number): string {
  return `https://www.whattoexpect.com/pregnancy/week-by-week/week-${weeks}.aspx`
}

/**
 * Generate milestone dates for the pregnancy.
 */
export function getMilestones(
  info: ConceptionInfo,
  milestones: { label: string; weeks: number }[] = DEFAULT_MILESTONES
): Milestone[] {
  return milestones.map(m => ({
    ...m,
    date: getDateForWeek(info, m.weeks),
  }))
}

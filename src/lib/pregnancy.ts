/**
 * Pure pregnancy calculation functions supporting multiple conception methods.
 *
 * All methods derive an equivalent "Last Menstrual Period" (LMP) date which is
 * the standard obstetric reference point.  From LMP every other date (due date,
 * gestational age, trimester, etc.) can be computed uniformly.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** IVF conception – embryo transfer with a known embryo age. */
export interface IVFConception {
  method: "ivf"
  /** Date the embryo was transferred. */
  transferDate: Date
  /** Age of the embryo at transfer in days (e.g. 3 or 5). */
  embryoAgeDays: number
}

/** Natural conception with a known last‑menstrual‑period date. */
export interface NaturalConception {
  method: "natural"
  /** First day of the last menstrual period. */
  lmpDate: Date
}

/** Only the estimated due date is known (e.g. from an ultrasound). */
export interface DueDateConception {
  method: "dueDate"
  /** Estimated due date. */
  dueDate: Date
}

/**
 * Discriminated union describing how conception occurred.  Every variant
 * carries just enough information to derive an equivalent LMP date.
 */
export type ConceptionInfo = IVFConception | NaturalConception | DueDateConception

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Milliseconds in one day. */
const MS_PER_DAY = 1000 * 60 * 60 * 24

/** A standard pregnancy is 40 weeks (280 days) from LMP. */
const FULL_TERM_DAYS = 280

/**
 * Days from LMP to ovulation/conception in the standard obstetric model.
 * Conception is assumed to occur on cycle day 14.
 */
const LMP_TO_CONCEPTION_DAYS = 14

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return a new Date that is `days` days after `date` (no mutation). */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime())
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Return the number of whole days between two dates (ignoring time‑of‑day).
 * The result is positive when `to` is after `from`.
 */
export function daysBetween(from: Date, to: Date): number {
  // Normalize to midnight UTC to avoid DST issues
  const utcFrom = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const utcTo = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((utcTo - utcFrom) / MS_PER_DAY)
}

// ---------------------------------------------------------------------------
// Core calculations
// ---------------------------------------------------------------------------

/**
 * Derive the equivalent LMP (Last Menstrual Period) date from any supported
 * conception method.
 *
 * ### IVF
 * The embryo's true age at transfer is known.  Working backwards:
 *   conception date = transferDate − embryoAgeDays
 *   LMP = conception date − 14  (standard 14‑day follicular phase)
 *   LMP = transferDate − (14 + embryoAgeDays)
 *
 * ### Natural
 * The LMP is used directly.
 *
 * ### Due Date
 * LMP = dueDate − 280 days (40 weeks).
 */
export function calculateLMP(info: ConceptionInfo): Date {
  switch (info.method) {
    case "ivf":
      return addDays(info.transferDate, -(LMP_TO_CONCEPTION_DAYS + info.embryoAgeDays))
    case "natural":
      return new Date(info.lmpDate.getTime())
    case "dueDate":
      return addDays(info.dueDate, -FULL_TERM_DAYS)
  }
}

/**
 * Calculate the gestational age (weeks + remaining days) on a given date.
 *
 * @returns An object with `weeks` (whole weeks) and `days` (0–6).
 *          Values may be negative if `asOf` is before the LMP.
 */
export function gestationalAge(
  lmp: Date,
  asOf: Date,
): { weeks: number; days: number } {
  const totalDays = daysBetween(lmp, asOf)
  const weeks = Math.floor(totalDays / 7)
  const days = totalDays - weeks * 7
  return { weeks, days }
}

/**
 * Calculate the calendar date on which a given gestational week begins.
 *
 * Example: `dateAtWeek(lmp, 24)` → the first day of week 24.
 */
export function dateAtWeek(lmp: Date, weeks: number): Date {
  return addDays(lmp, weeks * 7)
}

/**
 * Calculate the estimated due date (40 weeks / 280 days from LMP).
 */
export function dueDate(lmp: Date): Date {
  return addDays(lmp, FULL_TERM_DAYS)
}

/**
 * Return the trimester number (1, 2, or 3) for a given gestational week.
 *
 * - Trimester 1: weeks 0–12
 * - Trimester 2: weeks 13–27
 * - Trimester 3: weeks 28+
 */
export function trimester(weeks: number): 1 | 2 | 3 {
  if (weeks <= 12) return 1
  if (weeks <= 27) return 2
  return 3
}

/**
 * Build a URL to the "What to Expect" week‑by‑week guide for a given week.
 */
export function weekGuideUrl(weeks: number): string {
  return `https://www.whattoexpect.com/pregnancy/week-by-week/week-${weeks}.aspx`
}

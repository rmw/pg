/**
 * Pregnancy calculation utilities.
 *
 * Supports multiple conception methods:
 *  - IVF with a 3-day or 5-day embryo (or any embryo age)
 *  - Natural conception with a known Last Menstrual Period (LMP)
 *  - Natural conception with a known conception/ovulation date
 *  - Known due date only
 *
 * All gestational age calculations follow standard obstetric convention
 * where pregnancy is dated from the Last Menstrual Period (LMP).  For IVF
 * the "equivalent LMP" is derived from the embryo transfer date and embryo
 * age at transfer.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** IVF conception – you know the transfer date and the embryo age. */
export interface IVFConception {
  type: "ivf"
  /** Date of the embryo transfer. */
  transferDate: Date
  /** Age of the embryo at transfer in days (e.g. 3 or 5). */
  embryoAgeDays: number
}

/** Natural conception – you know the first day of the last menstrual period. */
export interface LMPConception {
  type: "lmp"
  /** First day of the last menstrual period. */
  lmpDate: Date
}

/** Natural conception – you know the conception / ovulation date. */
export interface ConceptionDateConception {
  type: "conception"
  /** Date of conception or ovulation. */
  conceptionDate: Date
}

/** You only know the estimated due date. */
export interface DueDateConception {
  type: "due_date"
  /** Estimated due date. */
  dueDate: Date
}

export type ConceptionInfo =
  | IVFConception
  | LMPConception
  | ConceptionDateConception
  | DueDateConception

export interface GestationalAge {
  weeks: number
  days: number
  totalDays: number
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Standard pregnancy length in days (40 weeks).
 */
export const PREGNANCY_DAYS = 280

/**
 * Days from LMP to ovulation in a standard 28-day cycle.
 */
export const LMP_TO_OVULATION_DAYS = 14

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/** Strip time component – returns a Date at midnight UTC. */
function toUTCDate(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
}

/** Whole days between two dates (end − start), ignoring time. */
function daysBetween(start: Date, end: Date): number {
  const s = toUTCDate(start)
  const e = toUTCDate(end)
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
}

/** Add `days` to a Date, returning a new Date at midnight UTC. */
function addDays(date: Date, days: number): Date {
  const d = toUTCDate(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Derive the equivalent LMP date for any conception method.
 *
 * This is the single point of truth – every other calculation goes through
 * the LMP because that is how obstetric gestational age is defined.
 */
export function getLMPDate(info: ConceptionInfo): Date {
  switch (info.type) {
    case "ivf":
      // LMP = transferDate − (14 + embryoAgeDays)
      return addDays(info.transferDate, -(LMP_TO_OVULATION_DAYS + info.embryoAgeDays))
    case "lmp":
      return toUTCDate(info.lmpDate)
    case "conception":
      // LMP = conceptionDate − 14
      return addDays(info.conceptionDate, -LMP_TO_OVULATION_DAYS)
    case "due_date":
      // LMP = dueDate − 280
      return addDays(info.dueDate, -PREGNANCY_DAYS)
  }
}

/**
 * Calculate the gestational age on a given date.
 *
 * @returns An object with `weeks`, `days` (remainder), and `totalDays`.
 */
export function getGestationalAge(info: ConceptionInfo, onDate: Date = new Date()): GestationalAge {
  const lmp = getLMPDate(info)
  const totalDays = daysBetween(lmp, onDate)
  return {
    weeks: Math.floor(totalDays / 7),
    days: totalDays % 7,
    totalDays,
  }
}

/**
 * For a given conception method, find the calendar date on which the
 * pregnancy will (or did) reach exactly N weeks.
 */
export function getDateForWeek(info: ConceptionInfo, weeks: number): Date {
  const lmp = getLMPDate(info)
  return addDays(lmp, weeks * 7)
}

/**
 * Calculate the estimated due date (40 weeks from LMP).
 */
export function getDueDate(info: ConceptionInfo): Date {
  return getDateForWeek(info, 40)
}

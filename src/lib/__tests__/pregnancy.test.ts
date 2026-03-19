import {
  ConceptionInfo,
  getLmpEquivalent,
  getWeeksAndDays,
  getDateForWeek,
  getDueDate,
  getWhatToExpectUrl,
  getMilestones,
  parseDate,
  addDays,
  daysBetween,
  dateOnly,
} from '../pregnancy'

// Helper to create UTC dates without time components
function utc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day))
}

describe('dateOnly', () => {
  it('strips time component', () => {
    const d = new Date(2023, 3, 18, 15, 30, 45)
    const result = dateOnly(d)
    expect(result.getUTCHours()).toBe(0)
    expect(result.getUTCMinutes()).toBe(0)
    expect(result.getUTCSeconds()).toBe(0)
    expect(result.getUTCMilliseconds()).toBe(0)
  })
})

describe('parseDate', () => {
  it('parses ISO date string', () => {
    const d = parseDate('2023-04-18')
    expect(d.getUTCFullYear()).toBe(2023)
    expect(d.getUTCMonth()).toBe(3) // 0-indexed
    expect(d.getUTCDate()).toBe(18)
  })

  it('throws on invalid date', () => {
    expect(() => parseDate('not-a-date')).toThrow('Invalid date')
  })
})

describe('addDays', () => {
  it('adds positive days', () => {
    const d = utc(2023, 4, 18)
    const result = addDays(d, 7)
    expect(result).toEqual(utc(2023, 4, 25))
  })

  it('subtracts with negative days', () => {
    const d = utc(2023, 4, 18)
    const result = addDays(d, -19)
    expect(result).toEqual(utc(2023, 3, 30))
  })

  it('crosses month boundary', () => {
    const d = utc(2023, 1, 28)
    const result = addDays(d, 5)
    expect(result).toEqual(utc(2023, 2, 2))
  })
})

describe('daysBetween', () => {
  it('returns positive for forward range', () => {
    expect(daysBetween(utc(2023, 1, 1), utc(2023, 1, 8))).toBe(7)
  })

  it('returns zero for same day', () => {
    expect(daysBetween(utc(2023, 6, 15), utc(2023, 6, 15))).toBe(0)
  })

  it('returns negative for backward range', () => {
    expect(daysBetween(utc(2023, 1, 8), utc(2023, 1, 1))).toBe(-7)
  })
})

describe('getLmpEquivalent', () => {
  it('returns lmpDate directly for lmp type', () => {
    const lmp = utc(2023, 3, 30)
    const info: ConceptionInfo = { type: 'lmp', lmpDate: lmp }
    expect(getLmpEquivalent(info)).toEqual(lmp)
  })

  it('subtracts 14 days for natural conception', () => {
    const conceptionDate = utc(2023, 4, 13)
    const info: ConceptionInfo = { type: 'natural', conceptionDate }
    expect(getLmpEquivalent(info)).toEqual(utc(2023, 3, 30))
  })

  it('subtracts 14 days for ivf-fresh', () => {
    const retrievalDate = utc(2023, 4, 13)
    const info: ConceptionInfo = { type: 'ivf-fresh', retrievalDate }
    expect(getLmpEquivalent(info)).toEqual(utc(2023, 3, 30))
  })

  it('subtracts 17 days for ivf-3day', () => {
    const transferDate = utc(2023, 4, 16)
    const info: ConceptionInfo = { type: 'ivf-3day', transferDate }
    expect(getLmpEquivalent(info)).toEqual(utc(2023, 3, 30))
  })

  it('subtracts 19 days for ivf-5day', () => {
    const transferDate = utc(2023, 4, 18)
    const info: ConceptionInfo = { type: 'ivf-5day', transferDate }
    // LMP = 04/18 - 19 = 03/30
    expect(getLmpEquivalent(info)).toEqual(utc(2023, 3, 30))
  })

  it('subtracts 20 days for ivf-6day', () => {
    const transferDate = utc(2023, 4, 19)
    const info: ConceptionInfo = { type: 'ivf-6day', transferDate }
    expect(getLmpEquivalent(info)).toEqual(utc(2023, 3, 30))
  })

  it('all types with same conceptual timing produce the same LMP', () => {
    // All of these represent the same pregnancy with LMP = 2023-03-30
    const infos: ConceptionInfo[] = [
      { type: 'lmp', lmpDate: utc(2023, 3, 30) },
      { type: 'natural', conceptionDate: utc(2023, 4, 13) },
      { type: 'ivf-fresh', retrievalDate: utc(2023, 4, 13) },
      { type: 'ivf-3day', transferDate: utc(2023, 4, 16) },
      { type: 'ivf-5day', transferDate: utc(2023, 4, 18) },
      { type: 'ivf-6day', transferDate: utc(2023, 4, 19) },
    ]
    const lmps = infos.map(getLmpEquivalent)
    for (const lmp of lmps) {
      expect(lmp).toEqual(utc(2023, 3, 30))
    }
  })
})

describe('getWeeksAndDays', () => {
  // Using ivf-5day with transfer 04/18/2023 → LMP = 03/30/2023
  // This matches the original app's hardcoded behavior
  const info: ConceptionInfo = {
    type: 'ivf-5day',
    transferDate: utc(2023, 4, 18),
  }

  it('returns 0 weeks 0 days on LMP date', () => {
    const result = getWeeksAndDays(info, utc(2023, 3, 30))
    expect(result).toEqual({ weeks: 0, days: 0, totalDays: 0 })
  })

  it('returns correct weeks and days after some time', () => {
    // 7 days after LMP = 1 week exactly
    const result = getWeeksAndDays(info, utc(2023, 4, 6))
    expect(result).toEqual({ weeks: 1, days: 0, totalDays: 7 })
  })

  it('calculates partial weeks correctly', () => {
    // 10 days after LMP = 1 week 3 days
    const result = getWeeksAndDays(info, utc(2023, 4, 9))
    expect(result).toEqual({ weeks: 1, days: 3, totalDays: 10 })
  })

  it('matches original app behavior at a known date', () => {
    // Original app: et = 04/18/2023, startPgDays = 19
    // On 07/01/2023: days = ((07/01 - 04/18) / msPerDay) + 19
    //   = 74 + 19 = 93 days = 13 weeks 2 days
    const result = getWeeksAndDays(info, utc(2023, 7, 1))
    expect(result.weeks).toBe(13)
    expect(result.days).toBe(2)
    expect(result.totalDays).toBe(93)
  })

  it('handles 40 weeks (due date)', () => {
    // LMP = 03/30/2023, 40 weeks = 280 days later = 01/04/2024
    const result = getWeeksAndDays(info, utc(2024, 1, 4))
    expect(result.weeks).toBe(40)
    expect(result.days).toBe(0)
    expect(result.totalDays).toBe(280)
  })

  it('handles dates before LMP (negative)', () => {
    const result = getWeeksAndDays(info, utc(2023, 3, 23))
    expect(result.totalDays).toBe(-7)
  })
})

describe('getDateForWeek', () => {
  const info: ConceptionInfo = {
    type: 'ivf-5day',
    transferDate: utc(2023, 4, 18),
  }
  // LMP = 03/30/2023

  it('returns LMP date for week 0', () => {
    expect(getDateForWeek(info, 0)).toEqual(utc(2023, 3, 30))
  })

  it('returns correct date for week 14 (second trimester)', () => {
    // LMP + 98 days = 03/30 + 98 = 07/06/2023
    expect(getDateForWeek(info, 14)).toEqual(utc(2023, 7, 6))
  })

  it('returns correct date for week 40 (due date)', () => {
    // LMP + 280 days = 01/04/2024
    expect(getDateForWeek(info, 40)).toEqual(utc(2024, 1, 4))
  })

  it('matches original app behavior', () => {
    // Original: et.addDays((weeks * 7) - 19)
    // For week 39: 04/18/2023 + (39*7 - 19) = 04/18 + 254 = 12/28/2023
    // Our calc: LMP + 39*7 = 03/30 + 273 = 12/28/2023
    expect(getDateForWeek(info, 39)).toEqual(utc(2023, 12, 28))
  })

  it('is the inverse of getWeeksAndDays', () => {
    for (const week of [0, 12, 20, 28, 36, 40]) {
      const date = getDateForWeek(info, week)
      const result = getWeeksAndDays(info, date)
      expect(result.weeks).toBe(week)
      expect(result.days).toBe(0)
    }
  })
})

describe('getDueDate', () => {
  it('returns 40 weeks from LMP', () => {
    const info: ConceptionInfo = {
      type: 'lmp',
      lmpDate: utc(2023, 3, 30),
    }
    expect(getDueDate(info)).toEqual(utc(2024, 1, 4))
  })

  it('produces same due date regardless of conception type (same pregnancy)', () => {
    const infos: ConceptionInfo[] = [
      { type: 'lmp', lmpDate: utc(2023, 3, 30) },
      { type: 'natural', conceptionDate: utc(2023, 4, 13) },
      { type: 'ivf-5day', transferDate: utc(2023, 4, 18) },
    ]
    const dueDates = infos.map(getDueDate)
    expect(dueDates[0]).toEqual(dueDates[1])
    expect(dueDates[1]).toEqual(dueDates[2])
  })
})

describe('getWhatToExpectUrl', () => {
  it('generates correct URL for a given week', () => {
    expect(getWhatToExpectUrl(12)).toBe(
      'https://www.whattoexpect.com/pregnancy/week-by-week/week-12.aspx'
    )
  })
})

describe('getMilestones', () => {
  const info: ConceptionInfo = {
    type: 'ivf-5day',
    transferDate: utc(2023, 4, 18),
  }

  it('returns default milestones with correct dates', () => {
    const milestones = getMilestones(info)
    expect(milestones).toHaveLength(4)
    expect(milestones[0].label).toBe('Second Trimester')
    expect(milestones[0].weeks).toBe(14)
    expect(milestones[0].date).toEqual(getDateForWeek(info, 14))
  })

  it('accepts custom milestones', () => {
    const custom = [{ label: 'Halfway', weeks: 20 }]
    const milestones = getMilestones(info, custom)
    expect(milestones).toHaveLength(1)
    expect(milestones[0].label).toBe('Halfway')
    expect(milestones[0].date).toEqual(getDateForWeek(info, 20))
  })
})

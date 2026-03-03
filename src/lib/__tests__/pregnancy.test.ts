import {
  addDays,
  daysBetween,
  calculateLMP,
  gestationalAge,
  dateAtWeek,
  dueDate,
  trimester,
  weekGuideUrl,
  ConceptionInfo,
} from "../pregnancy"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Shorthand to create a UTC‑midnight Date from an ISO date string. */
function d(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number)
  return new Date(y, m - 1, day)
}

// ---------------------------------------------------------------------------
// addDays
// ---------------------------------------------------------------------------

describe("addDays", () => {
  it("adds positive days", () => {
    expect(addDays(d("2023-01-01"), 10)).toEqual(d("2023-01-11"))
  })

  it("subtracts days with a negative value", () => {
    expect(addDays(d("2023-01-11"), -10)).toEqual(d("2023-01-01"))
  })

  it("crosses month boundaries", () => {
    expect(addDays(d("2023-01-30"), 5)).toEqual(d("2023-02-04"))
  })

  it("crosses year boundaries", () => {
    expect(addDays(d("2023-12-30"), 5)).toEqual(d("2024-01-04"))
  })

  it("handles leap year", () => {
    expect(addDays(d("2024-02-28"), 1)).toEqual(d("2024-02-29"))
    expect(addDays(d("2024-02-28"), 2)).toEqual(d("2024-03-01"))
  })

  it("adding zero days returns an equal date", () => {
    expect(addDays(d("2023-06-15"), 0)).toEqual(d("2023-06-15"))
  })

  it("does not mutate the original date", () => {
    const original = d("2023-06-15")
    const originalTime = original.getTime()
    addDays(original, 5)
    expect(original.getTime()).toBe(originalTime)
  })
})

// ---------------------------------------------------------------------------
// daysBetween
// ---------------------------------------------------------------------------

describe("daysBetween", () => {
  it("returns positive days when to > from", () => {
    expect(daysBetween(d("2023-01-01"), d("2023-01-11"))).toBe(10)
  })

  it("returns negative days when to < from", () => {
    expect(daysBetween(d("2023-01-11"), d("2023-01-01"))).toBe(-10)
  })

  it("returns 0 for the same date", () => {
    expect(daysBetween(d("2023-06-15"), d("2023-06-15"))).toBe(0)
  })

  it("counts across month boundaries", () => {
    expect(daysBetween(d("2023-01-30"), d("2023-02-04"))).toBe(5)
  })

  it("counts across year boundaries", () => {
    expect(daysBetween(d("2023-12-30"), d("2024-01-04"))).toBe(5)
  })

  it("handles leap year correctly", () => {
    expect(daysBetween(d("2024-02-28"), d("2024-03-01"))).toBe(2)
    // Non-leap year
    expect(daysBetween(d("2023-02-28"), d("2023-03-01"))).toBe(1)
  })
})

// ---------------------------------------------------------------------------
// calculateLMP
// ---------------------------------------------------------------------------

describe("calculateLMP", () => {
  describe("IVF with 5-day blast", () => {
    it("calculates LMP = transferDate - 19", () => {
      const info: ConceptionInfo = {
        method: "ivf",
        transferDate: d("2023-04-18"),
        embryoAgeDays: 5,
      }
      // LMP = 2023-04-18 - 19 = 2023-03-30
      expect(calculateLMP(info)).toEqual(d("2023-03-30"))
    })
  })

  describe("IVF with 3-day blast", () => {
    it("calculates LMP = transferDate - 17", () => {
      const info: ConceptionInfo = {
        method: "ivf",
        transferDate: d("2023-04-18"),
        embryoAgeDays: 3,
      }
      // LMP = 2023-04-18 - 17 = 2023-04-01
      expect(calculateLMP(info)).toEqual(d("2023-04-01"))
    })
  })

  describe("IVF with 6-day blast", () => {
    it("calculates LMP = transferDate - 20", () => {
      const info: ConceptionInfo = {
        method: "ivf",
        transferDate: d("2023-04-18"),
        embryoAgeDays: 6,
      }
      // LMP = 2023-04-18 - 20 = 2023-03-29
      expect(calculateLMP(info)).toEqual(d("2023-03-29"))
    })
  })

  describe("natural conception", () => {
    it("returns the provided LMP date", () => {
      const lmpDate = d("2023-03-01")
      const info: ConceptionInfo = { method: "natural", lmpDate }
      expect(calculateLMP(info)).toEqual(d("2023-03-01"))
    })

    it("returns a copy (does not alias input)", () => {
      const lmpDate = d("2023-03-01")
      const info: ConceptionInfo = { method: "natural", lmpDate }
      const result = calculateLMP(info)
      expect(result).not.toBe(lmpDate) // different object
      expect(result).toEqual(lmpDate) // same value
    })
  })

  describe("due date only", () => {
    it("calculates LMP = dueDate - 280", () => {
      // Due date is 280 days (40 weeks) from LMP
      const info: ConceptionInfo = {
        method: "dueDate",
        dueDate: d("2024-01-05"),
      }
      // LMP = 2024-01-05 - 280 = 2023-03-31
      expect(calculateLMP(info)).toEqual(d("2023-03-31"))
    })

    it("round-trips: dueDate(calculateLMP({dueDate})) === original due date", () => {
      const originalDueDate = d("2024-02-14")
      const info: ConceptionInfo = { method: "dueDate", dueDate: originalDueDate }
      const lmp = calculateLMP(info)
      expect(dueDate(lmp)).toEqual(originalDueDate)
    })
  })
})

// ---------------------------------------------------------------------------
// gestationalAge
// ---------------------------------------------------------------------------

describe("gestationalAge", () => {
  const lmp = d("2023-03-30")

  it("returns 0 weeks 0 days on LMP date", () => {
    expect(gestationalAge(lmp, d("2023-03-30"))).toEqual({ weeks: 0, days: 0 })
  })

  it("returns 1 week 0 days after 7 days", () => {
    expect(gestationalAge(lmp, d("2023-04-06"))).toEqual({ weeks: 1, days: 0 })
  })

  it("returns partial weeks correctly", () => {
    // 10 days = 1 week 3 days
    expect(gestationalAge(lmp, d("2023-04-09"))).toEqual({ weeks: 1, days: 3 })
  })

  it("calculates correctly at 24 weeks", () => {
    // 24 * 7 = 168 days after LMP
    const at24 = addDays(lmp, 168)
    expect(gestationalAge(lmp, at24)).toEqual({ weeks: 24, days: 0 })
  })

  it("calculates correctly at 40 weeks (due date)", () => {
    const at40 = addDays(lmp, 280)
    expect(gestationalAge(lmp, at40)).toEqual({ weeks: 40, days: 0 })
  })

  it("handles dates before LMP gracefully", () => {
    // 3 days before LMP → -1 weeks and some days
    const result = gestationalAge(lmp, d("2023-03-27"))
    expect(result.weeks * 7 + result.days).toBe(-3)
  })

  describe("matches original hardcoded logic", () => {
    // The original code used:
    //   et = new Date("04/18/2023")  (transfer date)
    //   startPgDays = 14 + 5         (IVF 5-day blast offset)
    //   currentDays = ((dt - et) / MS_PER_DAY) + startPgDays
    //   currentWeeks = Math.floor(currentDays / 7)
    //   currentDaysLeft = Math.floor(currentDays % 7)
    //
    // Our library equivalent:
    //   LMP = transferDate - 19 = 2023-04-18 - 19 = 2023-03-30
    //   gestationalAge(LMP, dt)

    const ivfLmp = calculateLMP({
      method: "ivf",
      transferDate: d("2023-04-18"),
      embryoAgeDays: 5,
    })

    it("produces the same result for the transfer date itself", () => {
      // On transfer day (04/18): days = 0 + 19 = 19, weeks = 2, days = 5
      const result = gestationalAge(ivfLmp, d("2023-04-18"))
      expect(result).toEqual({ weeks: 2, days: 5 })
    })

    it("produces the same result for an arbitrary later date", () => {
      // On 07/01/2023: days from ET = 74, + 19 = 93, weeks = 13, days = 2
      const result = gestationalAge(ivfLmp, d("2023-07-01"))
      expect(result).toEqual({ weeks: 13, days: 2 })
    })
  })
})

// ---------------------------------------------------------------------------
// dateAtWeek
// ---------------------------------------------------------------------------

describe("dateAtWeek", () => {
  const lmp = d("2023-03-30")

  it("week 0 is the LMP date", () => {
    expect(dateAtWeek(lmp, 0)).toEqual(lmp)
  })

  it("week 12 is 84 days after LMP", () => {
    expect(dateAtWeek(lmp, 12)).toEqual(addDays(lmp, 84))
  })

  it("week 24 matches addDays calculation", () => {
    expect(dateAtWeek(lmp, 24)).toEqual(addDays(lmp, 168))
  })

  it("week 40 is the due date", () => {
    expect(dateAtWeek(lmp, 40)).toEqual(dueDate(lmp))
  })

  describe("matches original hardcoded DateForWeeks logic", () => {
    // Original:
    //   et = new Date("04/18/2023")
    //   startPgDays = 14 + 5
    //   dt = et.addDays((weeks * 7) - startPgDays)
    //
    // Our library:
    //   lmp = calculateLMP(ivf info) = 2023-03-30
    //   dateAtWeek(lmp, weeks)

    const ivfLmp = calculateLMP({
      method: "ivf",
      transferDate: d("2023-04-18"),
      embryoAgeDays: 5,
    })

    it("week 39 matches original calculation", () => {
      // Original: et.addDays((39*7) - 19) = et.addDays(254)
      // = 2023-04-18 + 254 = 2023-12-28
      const originalResult = addDays(d("2023-04-18"), 39 * 7 - 19)
      expect(dateAtWeek(ivfLmp, 39)).toEqual(originalResult)
    })

    it("week 24 matches original calculation", () => {
      const originalResult = addDays(d("2023-04-18"), 24 * 7 - 19)
      expect(dateAtWeek(ivfLmp, 24)).toEqual(originalResult)
    })
  })
})

// ---------------------------------------------------------------------------
// dueDate
// ---------------------------------------------------------------------------

describe("dueDate", () => {
  it("returns a date 280 days (40 weeks) after LMP", () => {
    const lmp = d("2023-03-30")
    const dd = dueDate(lmp)
    expect(daysBetween(lmp, dd)).toBe(280)
  })

  it("returns the expected calendar date", () => {
    // 2023-03-30 + 280 = 2024-01-04
    expect(dueDate(d("2023-03-30"))).toEqual(d("2024-01-04"))
  })
})

// ---------------------------------------------------------------------------
// trimester
// ---------------------------------------------------------------------------

describe("trimester", () => {
  it("week 0 is trimester 1", () => {
    expect(trimester(0)).toBe(1)
  })

  it("week 12 is trimester 1", () => {
    expect(trimester(12)).toBe(1)
  })

  it("week 13 is trimester 2", () => {
    expect(trimester(13)).toBe(2)
  })

  it("week 27 is trimester 2", () => {
    expect(trimester(27)).toBe(2)
  })

  it("week 28 is trimester 3", () => {
    expect(trimester(28)).toBe(3)
  })

  it("week 40 is trimester 3", () => {
    expect(trimester(40)).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// weekGuideUrl
// ---------------------------------------------------------------------------

describe("weekGuideUrl", () => {
  it("returns the correct URL for a given week", () => {
    expect(weekGuideUrl(24)).toBe(
      "https://www.whattoexpect.com/pregnancy/week-by-week/week-24.aspx",
    )
  })
})

// ---------------------------------------------------------------------------
// Integration / end‑to‑end scenarios
// ---------------------------------------------------------------------------

describe("end-to-end scenarios", () => {
  it("IVF 5-day blast: full workflow", () => {
    const info: ConceptionInfo = {
      method: "ivf",
      transferDate: d("2023-04-18"),
      embryoAgeDays: 5,
    }
    const lmp = calculateLMP(info)
    const dd = dueDate(lmp)
    const age = gestationalAge(lmp, d("2023-10-01"))
    const week24Date = dateAtWeek(lmp, 24)

    expect(lmp).toEqual(d("2023-03-30"))
    expect(dd).toEqual(d("2024-01-04"))
    expect(age).toEqual({ weeks: 26, days: 3 })
    expect(trimester(age.weeks)).toBe(2)
    expect(week24Date).toEqual(d("2023-09-14"))
  })

  it("IVF 3-day blast: full workflow", () => {
    const info: ConceptionInfo = {
      method: "ivf",
      transferDate: d("2023-04-18"),
      embryoAgeDays: 3,
    }
    const lmp = calculateLMP(info)
    const dd = dueDate(lmp)

    // LMP = 2023-04-18 - 17 = 2023-04-01
    expect(lmp).toEqual(d("2023-04-01"))
    // Due date = 2023-04-01 + 280 = 2024-01-06
    expect(dd).toEqual(d("2024-01-06"))
  })

  it("natural conception: full workflow", () => {
    const info: ConceptionInfo = {
      method: "natural",
      lmpDate: d("2023-06-01"),
    }
    const lmp = calculateLMP(info)
    const dd = dueDate(lmp)
    const age = gestationalAge(lmp, d("2023-12-01"))

    expect(lmp).toEqual(d("2023-06-01"))
    // 2023-06-01 + 280 = 2024-03-07
    expect(dd).toEqual(d("2024-03-07"))
    // days = 183 → 26 weeks 1 day
    expect(age).toEqual({ weeks: 26, days: 1 })
  })

  it("due date only: full workflow", () => {
    const info: ConceptionInfo = {
      method: "dueDate",
      dueDate: d("2024-01-04"),
    }
    const lmp = calculateLMP(info)
    const dd = dueDate(lmp)

    // Round-trip: derived LMP → due date matches input
    expect(dd).toEqual(d("2024-01-04"))
    // LMP should be 280 days before
    expect(lmp).toEqual(d("2023-03-30"))
  })
})

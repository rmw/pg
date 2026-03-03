import {
  ConceptionInfo,
  GestationalAge,
  getLMPDate,
  getGestationalAge,
  getDateForWeek,
  getDueDate,
  PREGNANCY_DAYS,
  LMP_TO_OVULATION_DAYS,
} from "../pregnancy"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a UTC Date from "YYYY-MM-DD" for deterministic tests. */
function d(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, day))
}

/** Format Date as "YYYY-MM-DD" for readable assertions. */
function fmt(date: Date): string {
  return date.toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// getLMPDate
// ---------------------------------------------------------------------------

describe("getLMPDate", () => {
  it("IVF 5-day blast: LMP = transferDate − 19", () => {
    const info: ConceptionInfo = { type: "ivf", transferDate: d("2023-04-18"), embryoAgeDays: 5 }
    expect(fmt(getLMPDate(info))).toBe("2023-03-30")
  })

  it("IVF 3-day blast: LMP = transferDate − 17", () => {
    const info: ConceptionInfo = { type: "ivf", transferDate: d("2023-04-18"), embryoAgeDays: 3 }
    expect(fmt(getLMPDate(info))).toBe("2023-04-01")
  })

  it("IVF day-0 fresh transfer: LMP = transferDate − 14", () => {
    const info: ConceptionInfo = { type: "ivf", transferDate: d("2023-04-18"), embryoAgeDays: 0 }
    expect(fmt(getLMPDate(info))).toBe("2023-04-04")
  })

  it("LMP: returns the LMP date itself", () => {
    const info: ConceptionInfo = { type: "lmp", lmpDate: d("2023-03-30") }
    expect(fmt(getLMPDate(info))).toBe("2023-03-30")
  })

  it("Conception date: LMP = conceptionDate − 14", () => {
    const info: ConceptionInfo = { type: "conception", conceptionDate: d("2023-04-13") }
    expect(fmt(getLMPDate(info))).toBe("2023-03-30")
  })

  it("Due date: LMP = dueDate − 280", () => {
    const info: ConceptionInfo = { type: "due_date", dueDate: d("2024-01-04") }
    expect(fmt(getLMPDate(info))).toBe("2023-03-30")
  })
})

// ---------------------------------------------------------------------------
// getGestationalAge
// ---------------------------------------------------------------------------

describe("getGestationalAge", () => {
  // All methods should agree when they describe the same pregnancy.
  const lmpDate = d("2023-03-30")

  const methods: { label: string; info: ConceptionInfo }[] = [
    { label: "IVF 5-day blast", info: { type: "ivf", transferDate: d("2023-04-18"), embryoAgeDays: 5 } },
    { label: "LMP", info: { type: "lmp", lmpDate } },
    { label: "Conception date", info: { type: "conception", conceptionDate: d("2023-04-13") } },
    { label: "Due date", info: { type: "due_date", dueDate: d("2024-01-04") } },
  ]

  describe.each(methods)("$label", ({ info }) => {
    it("should be 0 weeks 0 days on LMP date", () => {
      const ga = getGestationalAge(info, lmpDate)
      expect(ga).toEqual({ weeks: 0, days: 0, totalDays: 0 })
    })

    it("should be 1 week 0 days at LMP + 7", () => {
      const ga = getGestationalAge(info, d("2023-04-06"))
      expect(ga).toEqual({ weeks: 1, days: 0, totalDays: 7 })
    })

    it("should be 4 weeks 0 days at LMP + 28", () => {
      const ga = getGestationalAge(info, d("2023-04-27"))
      expect(ga).toEqual({ weeks: 4, days: 0, totalDays: 28 })
    })

    it("should be 10 weeks 3 days at LMP + 73", () => {
      const ga = getGestationalAge(info, d("2023-06-11"))
      expect(ga).toEqual({ weeks: 10, days: 3, totalDays: 73 })
    })

    it("should be 40 weeks 0 days at due date", () => {
      const ga = getGestationalAge(info, d("2024-01-04"))
      expect(ga).toEqual({ weeks: 40, days: 0, totalDays: 280 })
    })
  })

  it("defaults to today when no date is provided", () => {
    const info: ConceptionInfo = { type: "lmp", lmpDate: new Date() }
    const ga = getGestationalAge(info)
    expect(ga.totalDays).toBeGreaterThanOrEqual(0)
    expect(ga.totalDays).toBeLessThanOrEqual(1) // same day
  })
})

// ---------------------------------------------------------------------------
// getDateForWeek
// ---------------------------------------------------------------------------

describe("getDateForWeek", () => {
  const info: ConceptionInfo = { type: "lmp", lmpDate: d("2023-03-30") }

  it("week 0 returns LMP date", () => {
    expect(fmt(getDateForWeek(info, 0))).toBe("2023-03-30")
  })

  it("week 12 returns LMP + 84 days", () => {
    expect(fmt(getDateForWeek(info, 12))).toBe("2023-06-22")
  })

  it("week 24 returns LMP + 168 days", () => {
    expect(fmt(getDateForWeek(info, 24))).toBe("2023-09-14")
  })

  it("week 40 returns due date", () => {
    expect(fmt(getDateForWeek(info, 40))).toBe("2024-01-04")
  })
})

// ---------------------------------------------------------------------------
// getDueDate
// ---------------------------------------------------------------------------

describe("getDueDate", () => {
  it("IVF 5-day blast due date", () => {
    const info: ConceptionInfo = { type: "ivf", transferDate: d("2023-04-18"), embryoAgeDays: 5 }
    expect(fmt(getDueDate(info))).toBe("2024-01-04")
  })

  it("IVF 3-day blast due date (2 days later than 5-day)", () => {
    const info: ConceptionInfo = { type: "ivf", transferDate: d("2023-04-18"), embryoAgeDays: 3 }
    expect(fmt(getDueDate(info))).toBe("2024-01-06")
  })

  it("LMP due date", () => {
    const info: ConceptionInfo = { type: "lmp", lmpDate: d("2023-03-30") }
    expect(fmt(getDueDate(info))).toBe("2024-01-04")
  })

  it("Conception date due date", () => {
    const info: ConceptionInfo = { type: "conception", conceptionDate: d("2023-04-13") }
    expect(fmt(getDueDate(info))).toBe("2024-01-04")
  })

  it("Due date round-trips", () => {
    const info: ConceptionInfo = { type: "due_date", dueDate: d("2024-01-04") }
    expect(fmt(getDueDate(info))).toBe("2024-01-04")
  })
})

// ---------------------------------------------------------------------------
// Cross-method consistency
// ---------------------------------------------------------------------------

describe("cross-method consistency", () => {
  // All four methods describing the *same* pregnancy should yield identical
  // gestational ages on any given date.
  const checkDate = d("2023-08-15")

  const ivf5: ConceptionInfo = { type: "ivf", transferDate: d("2023-04-18"), embryoAgeDays: 5 }
  const lmp: ConceptionInfo = { type: "lmp", lmpDate: d("2023-03-30") }
  const conception: ConceptionInfo = { type: "conception", conceptionDate: d("2023-04-13") }
  const dueDate: ConceptionInfo = { type: "due_date", dueDate: d("2024-01-04") }

  it("all methods agree on gestational age", () => {
    const ages = [ivf5, lmp, conception, dueDate].map((info) => getGestationalAge(info, checkDate))
    const first = ages[0]
    ages.forEach((age) => {
      expect(age).toEqual(first)
    })
  })

  it("all methods agree on due date", () => {
    const dueDates = [ivf5, lmp, conception, dueDate].map((info) => fmt(getDueDate(info)))
    dueDates.forEach((dd) => {
      expect(dd).toBe(dueDates[0])
    })
  })

  it("all methods agree on date for week 24", () => {
    const dates = [ivf5, lmp, conception, dueDate].map((info) => fmt(getDateForWeek(info, 24)))
    dates.forEach((dd) => {
      expect(dd).toBe(dates[0])
    })
  })
})

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("edge cases", () => {
  it("gestational age before LMP is negative totalDays", () => {
    const info: ConceptionInfo = { type: "lmp", lmpDate: d("2023-06-01") }
    const ga = getGestationalAge(info, d("2023-05-25"))
    expect(ga.totalDays).toBe(-7)
  })

  it("IVF embryo age of 6 days works", () => {
    const info: ConceptionInfo = { type: "ivf", transferDate: d("2023-04-18"), embryoAgeDays: 6 }
    // LMP should be transferDate - 20 = 2023-03-29
    expect(fmt(getLMPDate(info))).toBe("2023-03-29")
  })

  it("leap year handling", () => {
    // LMP on 2024-01-29 (2024 is a leap year)
    const info: ConceptionInfo = { type: "lmp", lmpDate: d("2024-01-29") }
    // 4 weeks later should cross Feb 29
    expect(fmt(getDateForWeek(info, 4))).toBe("2024-02-26")
    // 8 weeks later
    expect(fmt(getDateForWeek(info, 8))).toBe("2024-03-25")
  })

  it("year boundary handling", () => {
    const info: ConceptionInfo = { type: "lmp", lmpDate: d("2023-12-25") }
    expect(fmt(getDateForWeek(info, 2))).toBe("2024-01-08")
  })
})

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe("constants", () => {
  it("PREGNANCY_DAYS is 280", () => {
    expect(PREGNANCY_DAYS).toBe(280)
  })

  it("LMP_TO_OVULATION_DAYS is 14", () => {
    expect(LMP_TO_OVULATION_DAYS).toBe(14)
  })
})

import * as React from "react"
import { useState } from "react"
import DateForWeeks from "./../components/date-for-weeks"
import type { ConceptionInfo } from "../../../lib/pregnancy"

interface DateForWeeksFormProps {
  conceptionInfo: ConceptionInfo
}

/** Form that lets users enter a number of weeks and see the corresponding date. */
const DateForWeeksForm = ({ conceptionInfo }: DateForWeeksFormProps) => {
  const [weeksInput, setWeeksInput] = useState("39")

  const parsedWeeks = Number(weeksInput) || 0

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Weeks:
          <input
            type="text"
            value={weeksInput}
            onChange={(e) => setWeeksInput(e.target.value)}
          />
        </label>
      </form>
      <DateForWeeks conceptionInfo={conceptionInfo} weeks={parsedWeeks} />
    </>
  )
}

export default DateForWeeksForm

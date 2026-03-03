/** @jsx jsx */
import { jsx } from "theme-ui"
import {
  calculateLMP,
  dateAtWeek,
} from "../../../lib/pregnancy"
import type { ConceptionInfo } from "../../../lib/pregnancy"

/*
 * Configure your conception details here.
 * See src/lib/pregnancy.ts for supported methods: "ivf", "natural", "dueDate".
 */
const myConception: ConceptionInfo = {
  method: "ivf",
  transferDate: new Date(2023, 3, 18), // April 18 2023
  embryoAgeDays: 5,
}
const derivedLmp = calculateLMP(myConception)

const DateForWeeks = ({ weeks = 12 }: { weeks: number }) => {
  const targetDate = dateAtWeek(derivedLmp, weeks)

  return (
    <div>
      <h2>{targetDate.toLocaleDateString()}</h2>
    </div>
  )
}

export default DateForWeeks

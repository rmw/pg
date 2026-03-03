/** @jsx jsx */
import { jsx } from "theme-ui"
import { getDateForWeek, ConceptionInfo } from "../../../lib/pregnancy"

interface DateForWeeksProps {
  conceptionInfo: ConceptionInfo
  weeks?: number
}

const DateForWeeks = ({ conceptionInfo, weeks = 12 }: DateForWeeksProps) => {
  const resultDate = getDateForWeek(conceptionInfo, weeks)

  return (
    <div>
      <h2>{resultDate.toLocaleDateString()}</h2>
    </div>
  )
}

export default DateForWeeks

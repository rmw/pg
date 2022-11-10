/** @jsx jsx */
import { jsx } from "theme-ui"

const Dates = ({ dateString = ""}: {dateString?: string}) => {
  const et = new Date("10/27/2022")
  const startPgDays = 14 + 5
  const dt = (dateString == "") ? new Date() : new Date(dateString)
  const currentDays = ((dt - et)/ (1000 * 60 * 60 * 24)) + startPgDays
  const currentWeeks = Math.floor(currentDays / 7)
  const currentDaysLeft = Math.floor(currentDays % 7)

  return (
    <div>     
        <h2>{currentWeeks} weeks and {currentDaysLeft} days</h2>
    </div>
  )
}

export default Dates

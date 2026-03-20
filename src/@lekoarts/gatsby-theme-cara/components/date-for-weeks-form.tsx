import * as React from "react"
import DateForWeeks from "./../components/date-for-weeks"
import { getMilestoneConfig } from "../../../lib/config"
import config from "../../../../pregnancy.config.json"

const milestones = getMilestoneConfig(config)
const defaultWeeks = milestones.length > 0 ? milestones[milestones.length - 1].weeks : 40

const DateForWeeksForm = () => {
  const [value, setValue] = React.useState(defaultWeeks)

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Weeks:
          <input type="text" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} />
        </label>
      </form>
      <DateForWeeks weeks={value} />
    </>
  )
}

export default DateForWeeksForm
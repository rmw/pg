/** @jsx jsx */
import { jsx } from "theme-ui"
import { getDateForWeek } from "../../../lib/pregnancy"
import { buildConceptionInfo } from "../../../lib/config"
import config from "../../../../pregnancy.config.json"

const conceptionInfo = buildConceptionInfo(config)

const DateForWeeks = ({ weeks = 12}: {weeks: number}) => {
  const dt = getDateForWeek(conceptionInfo, Number(weeks))

  return (
    <div>     
        <h2>{dt.toLocaleDateString()}</h2>
    </div>
  )
}

export default DateForWeeks

/** @jsx jsx */
import { jsx } from "theme-ui"
import { getWeeksAndDays, getWhatToExpectUrl, dateOnly } from "../../../lib/pregnancy"
import { buildConceptionInfo } from "../../../lib/config"
import config from "../../../../pregnancy.config.json"

const conceptionInfo = buildConceptionInfo(config)

const WeeksAlong = ({ dateString = ""}: {dateString?: string}) => {
  const asOf = dateString === "" ? new Date() : new Date(dateString)
  const { weeks, days } = getWeeksAndDays(conceptionInfo, dateOnly(asOf))
  const url = getWhatToExpectUrl(weeks)

  return (
    <div>
      <h2>
        <a href={url}>
          {weeks} weeks and {days} days
        </a>
      </h2>
    </div>
  )
}

export default WeeksAlong

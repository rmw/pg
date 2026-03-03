/** @jsx jsx */
import { jsx } from "theme-ui"
import { getGestationalAge, ConceptionInfo } from "../../../lib/pregnancy"

interface WeeksAlongProps {
  conceptionInfo: ConceptionInfo
  dateString?: string
}

const WeeksAlong = ({ conceptionInfo, dateString = "" }: WeeksAlongProps) => {
  const onDate = dateString === "" ? new Date() : new Date(dateString)
  const ga = getGestationalAge(conceptionInfo, onDate)
  const weekInfoUrl = `https://www.whattoexpect.com/pregnancy/week-by-week/week-${ga.weeks}.aspx`

  return (
    <div>
      <h2>
        <a href={weekInfoUrl}>
          {ga.weeks} weeks and {ga.days} days
        </a>
      </h2>
    </div>
  )
}

export default WeeksAlong

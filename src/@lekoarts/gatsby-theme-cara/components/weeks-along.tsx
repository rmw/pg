/** @jsx jsx */
import { jsx } from "theme-ui"
import {
  calculateLMP,
  gestationalAge,
  weekGuideUrl,
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

const WeeksAlong = ({ dateString = "" }: { dateString?: string }) => {
  const targetDate = dateString === "" ? new Date() : new Date(dateString)
  const ga = gestationalAge(derivedLmp, targetDate)
  const guideLink = weekGuideUrl(ga.weeks)

  return (
    <div>
      <h2>
        <a href={guideLink}>
          {ga.weeks} weeks and {ga.days} days
        </a>
      </h2>
    </div>
  )
}

export default WeeksAlong

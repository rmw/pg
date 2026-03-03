import * as React from "react"
import { useState } from "react"
import WeeksAlong from "./../components/weeks-along"
import type { ConceptionInfo } from "../../../lib/pregnancy"

interface WeeksAlongFormProps {
  conceptionInfo: ConceptionInfo
}

/** Form that lets users enter a date and see gestational age on that date. */
const WeeksAlongForm = ({ conceptionInfo }: WeeksAlongFormProps) => {
  const [dateInput, setDateInput] = useState(new Date().toLocaleDateString())

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Date:
          <input
            type="text"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </label>
      </form>
      <WeeksAlong conceptionInfo={conceptionInfo} dateString={dateInput} />
    </>
  )
}

export default WeeksAlongForm

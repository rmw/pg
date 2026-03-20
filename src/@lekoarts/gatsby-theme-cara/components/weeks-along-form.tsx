import * as React from "react"
import WeeksAlong from "./../components/weeks-along"

const WeeksAlongForm = () => {
  const [value, setValue] = React.useState(new Date().toLocaleDateString())

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Date:
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
      </form>
      <WeeksAlong dateString={value} />
    </>
  )
}

export default WeeksAlongForm
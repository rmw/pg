/** @jsx jsx */
import { jsx } from "theme-ui"

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const DateForWeeks = ({ weeks = 12}: {weeks: number}) => {
  const et = new Date("10/27/2022")
  const startPgDays = 14 + 5
  const dt = et.addDays((weeks * 7) - startPgDays) 
  

  return (
    <div>     
        <h2>{dt.toLocaleDateString()}</h2>
    </div>
  )
}

export default DateForWeeks

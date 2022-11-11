import * as React from "react"
import DateForWeeks from "./../components/date-for-weeks"

class DateForWeeksForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: 39};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      //alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
      // 
    }
  
    render() {
      return (
        <>
            <form onSubmit={this.handleSubmit}>
            <label>
                Weeks:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            </form>
        
            <DateForWeeks weeks={this.state.value} />
           
        </>
      );
    }
  }

  export default DateForWeeksForm
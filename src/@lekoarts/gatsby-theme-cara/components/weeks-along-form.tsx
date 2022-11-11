import * as React from "react"
import WeeksAlong from "./../components/weeks-along"

class WeeksAlongForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: new Date().toLocaleDateString()};
  
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
                Date:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            </form>
        
            <WeeksAlong dateString={this.state.value} />
           
        </>
      );
    }
  }

  export default WeeksAlongForm
import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Calendars} from 'api';

class Calendar_PDF extends Component {
  constructor(props, context) {
    super(props, context);
    this.props.dispatch(Calendars.actions.calendars());

  }

  render(){

    return(
      <div className="view-procedure" >
        <iframe className="view-pdf" src={`./lib-pdf/web/viewer.html?file=${this.props.calendars[0] && this.props.calendars[0].acf.chonFile.url}`} seamless />
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    calendars: state.calendar || []
  }
}

export default connect(bindStateToProps)(Calendar_PDF);

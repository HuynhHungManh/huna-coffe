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
        { this.props.calendars[0] && this.props.calendars[0].acf.chonFile.url.indexOf(".doc") >= 0 &&
          <iframe className="view-doc" src={`https://view.officeapps.live.com/op/embed.aspx?src=${this.props.calendars[0] && this.props.calendars[0].acf.chonFile.url}&widget=false`} />
        }
        { this.props.calendars[0] && this.props.calendars[0].acf.chonFile.url.indexOf(".pdf") >= 0 &&
          <iframe className="view-pdf" src={`./lib-pdf/web/viewer.html?file=${this.props.calendars[0] && this.props.calendars[0].acf.chonFile.url}#page=1&zoom=200`} seamless />
        }
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

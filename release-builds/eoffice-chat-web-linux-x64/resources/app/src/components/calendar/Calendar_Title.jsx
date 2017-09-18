import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Calendars} from 'api';

class Calendar_Title extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    return(
      <div className="title-right">
        <p className="title-main-right">
          {
            this.props.calendars[0] &&
            this.props.calendars[0].title.rendered ?
            this.props.calendars[0].title.rendered : ''
          }
        </p>
        <p className="title-main-right-date">
          (<span className="fix-right-text">TỪ NGÀY</span>
            {
              this.props.calendars[0] &&
              this.props.calendars[0].acf.ngayBatDau ?
              this.props.calendars[0].acf.ngayBatDau : ''
            }
            <span className="fix-right-text">ĐẾN NGÀY</span>
            {
              this.props.calendars[0] &&
              this.props.calendars[0].acf.ngayKetThuc ?
              this.props.calendars[0].acf.ngayKetThuc : ''
            }
          )
        </p>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    calendars: state.calendar || []
  }
}

export default connect(bindStateToProps)(Calendar_Title);

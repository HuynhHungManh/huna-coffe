import React from 'react';
import {CommonLayout} from 'layouts';
import classnames from 'classnames';
import {Calendar_PDF, Calendar_Title} from 'components/calendar';

class Calendar extends React.Component {
  render() {
    return (
      <CommonLayout>
        <div className="container">
        <div className="header">
          <h2 className="title bg-calendar">
            <span className="title-main">Lịch Làm Việc Quận Thanh Khê</span>
          </h2>
          <Calendar_Title />
        </div>
        <div className="content custom-procedure">
          <div className="view-procedure">
            <iframe className="view-pdf" src={`./lib-pdf/web/viewer.html?file=`} seamless />
          </div>
        </div>
      </div>
      </CommonLayout>
    );
  }
}

export default Calendar;

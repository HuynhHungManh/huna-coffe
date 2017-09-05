import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {FeedbackForm} from 'components/feedback';

class Feedback extends Component {
  render() {
    return (
      <CommonLayout>
        <div className="container">
        <div className="header">
          <h2 className="title bg-fb">
            <span className="title-main">Góp Ý - phản Ánh</span>
          </h2>
          <span className="message-fb" id="showMessage">
            <span className="text-message-fb">
              Gửi góp ý thành công
            </span>
            <span className="icon-close-message icon-close"/>
          </span>
        </div>
        <div className="content">
          <FeedbackForm />
        </div>
      </div>
      </CommonLayout>
    );
  }
}

export default Feedback;

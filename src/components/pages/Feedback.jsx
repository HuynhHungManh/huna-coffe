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

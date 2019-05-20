import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Plans} from 'api';
import {CategoryPlan, PlanList} from 'components/plans';

class Plan extends Component {
  render() {
    return (
      <CommonLayout>
        <div className="container">
          <div className="header">
            <h2 className="title bg-fb">
              <span className="title-main">Thông Tin Quy Hoạch</span>
            </h2>
          </div>
          <div className="content">
            <CategoryPlan/>
            <PlanList/>
          </div>
        </div>
      </CommonLayout>
    );
  }
}

const bindStateToProps = (state) => {
  return {

  }
}

export default connect(bindStateToProps)(Plan);

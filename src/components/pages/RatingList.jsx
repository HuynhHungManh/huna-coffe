import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {RatingListItem} from 'components/ratingList';

class RatingList extends Component {

  render() {
    return (
      <CommonLayout>
        <div className="container">
        <div className="header">
          <h2 className="title bg-rate">
            <span className="title-main">Đánh giá công chức tiếp nhận</span>
          </h2>
        </div>
        <div className="content">
          <RatingListItem />
        </div>
      </div>
      </CommonLayout>
    );
  }
}

export default RatingList;

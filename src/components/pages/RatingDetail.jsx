import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {RatingDetailItem} from 'components/ratingDetail';

class RatingDetail extends Component {
  numberInput() {
  }
  render() {
    return (
      <CommonLayout>
        <div className="container">
        <div className="header">
          <h2 className="title bg-rate">
            <span className="title-main">Đánh Giá Công Chức Tiếp Nhận</span>
          </h2>
        </div>
        <div className="content">
          <RatingDetailItem id ={this.props.match.params.id}/>
        </div>
      </div>
      </CommonLayout>
    );
  }
}

export default RatingDetail;

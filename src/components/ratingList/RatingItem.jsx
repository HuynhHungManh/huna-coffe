import React, { Component } from 'react';

class RatingItem extends Component {
  constructor(props, context) {
    super(props, context);
  }

  gotoPage(page) {
    console.log(this.props);
    // this.props.history.push(page);
  }

  render() {
    return (
      <li className="item">
        <div className="sub-info-block">
          <div className="sub-ava">
            <img className="img-sub-ava" src={require('assets/images/ava/ava1.png')} />
          </div>
          <div className="info-main-content">
            <div className="header-box">
              <h2 className="name-info">{this.props.data.name}</h2>
            </div>
            <div className="box-sub-info">
              <div className="sub-info-content">
                <p className="info-detail"><span className="dob bold">Ngày sinh:</span><span className="dob-result"> {this.props.data.dOB}</span></p>
                <p className="info-detail"><span className="level bold">Trình độ học vấn:</span> <span className="level-result">{this.props.data.level}</span></p>
                <p className="info-detail"><span className="position bold">Chức vụ:</span> <span className="position-result">{this.props.data.position}</span></p>
                <button className="btn btn-rate" onClick={this.gotoPage.bind(this,'/rating-detail')}>
                  <i className="icon-rate-1" /><span className="text-btn-rate">ĐÁNH GIÁ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

}

export default RatingItem;

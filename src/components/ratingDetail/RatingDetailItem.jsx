import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Ratings} from 'api';

class RatingDetailItem extends Component {

constructor(props, context) {
  super(props, context);
  this.state = {
    data: this.props.ratings.find(item => item.id == this.props.id)
  }
}

  render() {
    // console.log(this.props);
    return (
      <div className="box-content box-content-rating-detail">
        <div className="box-info">
          <div className="info-top">
            <img className="img-rating-detail" src={this.state.data.image} />
          </div>
          <div className="info-bottom">
            <h2 className="header-info">{this.state.data.name}</h2>
            <span className="center-info" />
            <p><span className="bold">Ngày sinh:</span> {this.state.data.dOB} </p>
            <p><span className="bold">Trình độ học vấn:</span> {this.state.data.level} </p>
            <p><span className="bold">Chức vụ:</span> {this.state.data.position} </p>
          </div>
        </div>
        <div className="box-input">
          <div className="title-form">
            <span className="text-title">ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG CỦA TỪNG CÁ NHÂN</span>
          </div>
          <form className="form-fb">
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input">
                  <span className="phone-fb">Số điện thoại của bạn</span></label>
              </div>
              <div className="input-fb inp-rating-detail">
                <input type="text" placeholder="Nhập số " onFocus={this.numberInput} id="phone" />&nbsp;<span id="errmsg" />
                {/* <span className ="validate-phone"> Vui lòng nhập số điện thoại hợp lệ </span> */}
              </div>
            </div>
            <div className="sub-box-input">
              <p>
                <span className="bold">Mức độ hài lòng đối với công chức tại Bộ phận tiếp nhận và trả kết quả:</span>
              </p>
              <ul>
                <li className="radio-rating">
                  <input type="radio" name="review" id="agree" defaultChecked="true" />
                  <label htmlFor="agree" className="label-radio-agree">
                    <span />
                    <p className="detail-rw">Hài lòng</p>
                  </label>
                  <input type="radio" name="review" id="disagree" />
                  <label htmlFor="disagree" className="label-radio-disagree">
                    <span />
                    <p className="detail-rw">Chưa hài lòng</p>
                  </label>
                </li>
              </ul>
              <button className="btn-send-rating">Gửi Đánh Giá</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    ratings: state.ratings
  }
}

export default connect(bindStateToProps)(RatingDetailItem);

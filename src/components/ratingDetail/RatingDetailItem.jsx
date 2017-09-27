import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Ratings} from 'api';

const PhoneNumber = (input) => { return input = input.replace(/[^0-9]+/g, "");}

class RatingDetailItem extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: this.props.ratings.find(item => item.id == this.props.id),
      soDienThoai: '',
      error: false,
      success: false,
      message: '',
      check: 'agree'
    }
  }

  hide() {
    this.setState({
      success: false,
      error: false
    })
  }


  handleChange(name, e) {
    if (name == 'soDienThoai') {
      e.target.value = PhoneNumber(e.target.value)
      this.setState({
        [name]: e.target.value,
        error: false
      })
    }
  }

  handleFormSubmit(formSubmitEvent) {
    formSubmitEvent.preventDefault();
    let state = this.state;
    if(state.soDienThoai == '') {
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng nhập số điện thoại'
      })
    }  else if(state.soDienThoai.length < 10 || state.soDienThoai.length > 11) {
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng nhập lại số điện thoại hợp lệ'
      })
    } else {
      this.setState({
        success: true,
        message: 'Gửi đánh giá thành công',
        soDienThoai: '',
        check: 'agree'
      }, ()=> {
        setTimeout(this.hide.bind(this), 5000);
      })
    }
    return;
  }

  checkPhoneNumber(){
    let state = this.state;
    if(state.soDienThoai == '') {
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng nhập số điện thoại'
      })
    }  else if(state.soDienThoai.length < 10 || state.soDienThoai.length > 11) {
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng nhập lại số điện thoại hợp lệ'
      })
    }
  }

  handleOptionChange(name) {
    this.setState({
      check: name
    })
  }

  render() {
    // console.log(this.props);
    return (
      <div className="box-content box-content-rating-detail box-content-rating">
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
            <span className="text-title text-title-rating-detail">ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG CỦA TỪNG CÁ NHÂN</span>
          </div>
          <form className="form-fb" onSubmit={this.handleFormSubmit.bind(this)}>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input">
                  <span className="phone-fb">Số điện thoại của bạn<span className="star-red"> *
                    </span></span></label>
              </div>
              <div className="input-fb inp-rating-detail">
                <input type="text" placeholder="Nhập số " onChange={this.handleChange.bind(this, 'soDienThoai')} value={this.state.soDienThoai} maxLength={11} onBlur={this.checkPhoneNumber.bind(this)} />
              </div>
              <div>
              { this.state.error ?
                (<div className="validation-form-rating">
                  <span className="validation-text-rating">{this.state.message}</span>
                </div>) : null
              }
              { this.state.success ?
                (<div className="validation-form validation-success">
                  <span className="validation-text">{this.state.message}</span>
                </div>) : null
              }
              </div>
            </div>
            <div className="sub-box-input">
              <p>
                <span className="bold">Mức độ hài lòng đối với công chức tại Bộ phận tiếp nhận và trả kết quả:</span>
              </p>
              <ul>
                <li className="radio-rating">
                  <input type="radio" name="review" id="agree" checked={this.state.check == 'agree' ? true : false}
                      onChange={this.handleOptionChange.bind(this, 'agree')} />
                  <label htmlFor="agree" className="label-radio-agree">
                    <span />
                    <p className="detail-rw">Hài lòng</p>
                  </label>
                  <input type="radio" name="review" id="disagree" checked={this.state.check == 'disagree' ? true : false}
                      onChange={this.handleOptionChange.bind(this, 'disagree')} />
                  <label htmlFor="disagree" className="label-radio-disagree">
                    <span />
                    <p className="detail-rw">Chưa hài lòng</p>
                  </label>
                </li>
              </ul>
              <button className="btn-send-rating" type="submit">Gửi Đánh Giá</button>
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

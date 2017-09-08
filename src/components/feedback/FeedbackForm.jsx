import React, { Component } from 'react';
import {Feedbacks} from 'api';
import {connect} from 'react-redux';

class FeedbackForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        'hoVaTen': '',
        'soDienThoai': '',
        'email': '',
        'noiDung': '',
        'status':'publish',
      }
  }

  sendFeedback() {
    this.props.dispatch(Feedbacks.actions.feedbacks.request(null,this.state));
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <div className="box-content">
        <div className="box-img">
          <img className="img-fb" src={require('assets/images/bg-feedback.png')} />
        </div>
        <div className="box-input">
          <div className="title-form">
            <span className="text-title">Thông tin góp ý</span>
          </div>
          <div className="form-fb" action acceptCharset method="post">
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-name">
                  <span className="name-fb">Họ và tên<span>
                    </span></span></label>
              </div>
              <div className="input-fb">
                <input id="ipt-name"  name="hoVaTen" type="text" onChange={this.handleChange.bind(this)} placeholder="Nhập họ và tên" />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-phone">
                  <span className="phone-fb">Số điện thoại<span>
                    </span></span></label>
              </div>
              <div className="input-fb">
                <input id="ipt-phone" name="soDienThoai" onChange={this.handleChange.bind(this)} type="text" placeholder="Nhập số" />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-email">
                  <span className="email-fb">Email<span>
                    </span></span></label>
              </div>
              <div className="input-fb">
                <input id="ipt-email" name="email" onChange={this.handleChange.bind(this)} type="text" placeholder="Nhập email" />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-content">
                  <span className="content-fb">Nội dung<span>
                    </span></span></label>
              </div>
              <div className="input-fb">
                <textarea id="inp-content" name="noiDung" onChange={this.handleChange.bind(this)} placeholder="Nhập nội dung phản ánh, góp ý của bạn" defaultValue={""} />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
              </div>
              <div className="input-fb">
                <button className="btn clear-fb"><span className="btn-clear-fb btn-action-cancel">Nhập lại</span></button>
                <button className="btn send-fb btn-action-send" onClick={this.sendFeedback.bind(this)}><span className="btn-send-fb">Gửi góp ý</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

const bindStateToProps = (state) => {
  return {

  }
}

export default connect(bindStateToProps)(FeedbackForm);

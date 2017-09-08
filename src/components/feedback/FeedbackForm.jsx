import React, { Component } from 'react';
import {Feedbacks} from 'api';
import {connect} from 'react-redux';

class FeedbackForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        hoVaTen: '',
        soDienThoai: '',
        email: '',
        noiDung: '',
        status: 'publish',
        message: '',
        success: false,
        error: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  hide() {
    this.setState({
      success: false,
      error: false
    })
  }

  validate() {
    let state = this.state;
    let pass = true;
    if(state.hoVaTen == '') {
      pass = false;
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng điền họ tên'
      },()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    } else if(state.soDienThoai == '') {
      pass = false;
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng điền số điện thoại'
      },()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    } else if(state.noiDung == '') {
      pass = false;
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng góp ý'
      },()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    }
    return pass
  }

  sendFeedback(e) {
    e.preventDefault();
    if (this.validate()) {
      let params = {
        hoVaTen: this.state.hoVaTen,
        soDienThoai: this.state.soDienThoai,
        email: this.state.email,
        noiDung: this.state.noiDung,
        status: this.state.status
      }
      this.props.dispatch(Feedbacks.actions.feedbacks.request(null, params));
      this.setState({
        success: true,
        message: 'Gửi góp ý thành công'
      }, ()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    }
    return;
  }

  handleChange(name, e) {
    const re = /^[0-10\b]+$/;
    if (name == 'soDienThoai' || name == 'hoVaTen' || name == 'noiDung') {
      this.setState({
        [name]: e.target.value,
        error: false
      })
    } else {
      this.setState({
        [name]: e.target.value
      })
    }
  }

  handleClear(e) {
    e.preventDefault();
    this.setState({
      hoVaTen: '',
      soDienThoai: '',
      email: '',
      noiDung: '',
      message: '',
      success: false,
      error: false
    })
    return;
  }

  render() {
    return (
      <form className="box-content" onSubmit={this.sendFeedback.bind(this)}>
        <div className="box-img">
          <img className="img-fb" src={require('assets/images/bg-feedback.png')} />
        </div>
        <div className="box-input">
          <div className="title-form title-validation">
            <span className="text-title">Thông tin góp ý</span>
              { this.state.error ?
                (<div className="validation-form">
                  <span className="validation-text">{this.state.message}</span>
                </div>) : null
              }
              { this.state.success ?
                (<div className="validation-form validation-success">
                  <span className="validation-success-text">{this.state.message}</span>
                </div>) : null
              }
            <div className="notice-form">
              <span className="text-title">Thông tin người góp ý - phản ánh được bảo mật</span>
            </div>
          </div>
          <div className="form-fb" action acceptCharset method="post">
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-name">
                  <span className="name-fb">Họ và tên<span className="star-red"> *
                    </span></span></label>
              </div>
              <div className="input-fb">
                <input id="ipt-name" type="text" onChange={this.handleChange.bind(this, 'hoVaTen')} value={this.state.hoVaTen} placeholder="Nhập họ và tên" />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-phone">
                  <span className="phone-fb">Số điện thoại<span className="star-red"> *
                    </span></span></label>
              </div>
              <div className="input-fb">
                <input id="ipt-phone" onChange={this.handleChange.bind(this, 'soDienThoai')} value={this.state.soDienThoai} type="number" placeholder="Nhập số" />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-email">
                  <span className="email-fb">Email<span>
                    </span></span></label>
              </div>
              <div className="input-fb">
                <input id="ipt-email" onChange={this.handleChange.bind(this, 'email')} value={this.state.email} type="email" placeholder="Nhập email" />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-content">
                  <span className="content-fb">Nội dung<span className="star-red"> *
                    </span></span></label>
              </div>
              <div className="input-fb">
                <textarea id="inp-content" onChange={this.handleChange.bind(this, 'noiDung')} value={this.state.noiDung} placeholder="Nhập nội dung phản ánh, góp ý của bạn" defaultValue={""} />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
              </div>
              <div className="input-fb">
                <button className="btn clear-fb" type="reset" onClick={this.handleClear.bind(this)}><span className="btn-clear-fb btn-action-cancel">Nhập lại</span></button>
                <button className="btn send-fb btn-action-send" type="submit"><span className="btn-send-fb">Gửi góp ý</span></button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

}

const bindStateToProps = (state) => {
  return {

  }
}

export default connect(bindStateToProps)(FeedbackForm);

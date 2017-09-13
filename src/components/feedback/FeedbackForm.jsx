import React, { Component } from 'react';
import {Feedbacks} from 'api';
import {connect} from 'react-redux';

const PhoneNumber = (input) => {  return input = input.replace(/[^0-9]+/g, "");}

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
        message: 'Vui lòng nhập họ và tên'
      },()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    } else if(state.hoVaTen.length < 4) {
      pass = false;
      this.setState({
        error: true,
        success:false,
        message: 'Họ và tên ít nhất 4 kí tự'
      },()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    } else if(state.soDienThoai == '') {
      pass = false;
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng nhập số điện thoại'
      },()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    }  else if(state.soDienThoai.length < 10 || state.soDienThoai.length > 11) {
      pass = false;
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng nhập lại số điện thoại hợp lệ'
      },()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    } else if(state.noiDung == '') {
      pass = false;
      this.setState({
        error: true,
        success:false,
        message: 'Vui lòng điền góp ý'
      },()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    }

    if (this.state.email) {
      let email = this.state.email;
      let atpos = email.indexOf("@");
      let dotpos = email.lastIndexOf(".");
      if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
        pass = false;
        this.setState({
          error: true,
          success:false,
          message: 'Email không đúng định dạng'
        },()=> {
          setTimeout(this.hide.bind(this), 3000);
        })
      }
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
      this.props.dispatch(Feedbacks.actions.feedbacks(null, params));
      this.setState({
        success: true,
        message: 'Gửi góp ý thành công',
        hoVaTen: '',
        soDienThoai: '',
        email: '',
        noiDung: '',
      }, ()=> {
        setTimeout(this.hide.bind(this), 3000);
      })
    }
    return;
  }

  handleChange(name, e) {
    if (name == 'soDienThoai') {
      e.target.value = PhoneNumber(e.target.value)
      this.setState({
        [name]: e.target.value,
        error: false
      })
    } else if (name == 'hoVaTen') {
      this.setState({
        [name]: e.target.value,
        error: false
      })
    } else if (name == 'noiDung') {
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

  checkEmail() {
    if(this.state.email) {
      let email = this.state.email;
      let atpos = email.indexOf("@");
      let dotpos = email.lastIndexOf(".");
      if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
        this.setState({
          error: true,
          success:false,
          message: 'Email không đúng định dạng'
        },()=> {
          setTimeout(this.hide.bind(this), 3000);
        })
      }
    }
  }


  render() {
    return (
      <form className="box-content" onSubmit={this.sendFeedback.bind(this)}>
        <div className="box-img">
          <img className="img-fb" src={require('assets/images/bg-feedback.png')} />
        </div>
        <div className="box-input">
          <div className="title-form title-validation">
            <span className="text-title">Thông tin góp ý -  Phản ánh</span>
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
              <span className="text-title-sub">Thông tin người góp ý - phản ánh được bảo mật</span>
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
                <input id="ipt-name" type="text" onChange={this.handleChange.bind(this, 'hoVaTen')} value={this.state.hoVaTen} maxLength = {55} placeholder="Nhập họ và tên" />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-phone">
                  <span className="phone-fb">Số điện thoại<span className="star-red"> *
                    </span></span></label>
              </div>
              <div className="input-fb">
                <input id="ipt-phone" type="text" onChange={this.handleChange.bind(this, 'soDienThoai')} value={this.state.soDienThoai} maxLength={11} placeholder="Nhập số" />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-email">
                  <span className="email-fb">Email<span>
                    </span></span></label>
              </div>
              <div className="input-fb">
                <input id="ipt-email" type="text" onChange={this.handleChange.bind(this, 'email')} value={this.state.email} onBlur={this.checkEmail.bind(this)} placeholder="Nhập email" />
              </div>
            </div>
            <div className="sub-box-input">
              <div className="title-input">
                <label className="label-input" htmlFor="inp-content">
                  <span className="content-fb">Nội dung<span className="star-red"> *
                    </span></span></label>
              </div>
              <div className="input-fb">
                <textarea id="inp-content" onChange={this.handleChange.bind(this, 'noiDung')} value={this.state.noiDung} placeholder="Nhập nội dung phản ánh, góp ý của bạn" />
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

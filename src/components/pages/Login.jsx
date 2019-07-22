import React from 'react';
import {CommonLayout} from 'layouts';
import {Auth} from 'api';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import classnames from 'classnames';
import {Keyboarded} from 'components/keyboarded';
import Modal from 'react-modal';
Modal.setAppElement('body');
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import ComponentToPrint from '../tableTemporaryBill/ComponentToPrint.jsx';
import jsxToString from 'jsx-to-string';

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onChangeAll = this.onChangeAll.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.state = {
      username: '',
      password : '',
      message: '',
      hasError: false,
      token: '',
      statusPopup: true,
      input: '',
      inputName: ''
    }
    localStorage.removeItem('auth');
  }

  gotoPage(page) {
    this.context.router.history.push(page);
  }

  componentWillMount() {
    localStorage.removeItem('auth');
  }

  submitLogin() {
    if(this.state.input['username'] == '') {
      this.setState({
        hasError: true,
        message: 'Vui lòng nhập username',
      })
    } else if (this.state.input['password'] == '') {
      this.setState({
        hasError: true,
        message: 'Vui lòng nhập password',
      })
    } else {
      let header = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Email': this.state.input['username'],
        'Password': this.state.input['password']
      }
      this.props.dispatch(Auth.actions.login(null, header))
      .then((res) => {
        if (res.data && res.data.token) {
          localStorage.setItem('auth', JSON.stringify(res.data));
          this.gotoPage('/coffee');
        } else {
          this.setState({
            hasError: true,
            message: 'Not found token',
          })
        }
      }).catch((error) =>{
        this.setState({
          hasError: true,
          message: error.response.data.errors[0].description ? error.response.data.errors[0].description : 'Kiểm tra mạng!'
        })
      });
    }
  }

  setActiveInput(event) {
    this.setState({
      inputName: event.target.id
    });
  }

  onChangeAll(input) {
    this.setState({
      input: input
    });
  }

  minimazScreen() {
    const mainProcess = window.require("electron").remote.require('./minimum.js');
    mainProcess.minimum();
  }

  render() {
    return (
      <div className="bg-login">
        <Modal
          isOpen={this.state.statusPopup}
          contentLabel="Modal"
          className="modal popup"
        >
          <form className="login-box">
            <span className="icon-minus" onClick={this.minimazScreen.bind(this)}></span>
            <div className="logo-huna">
              <img className="img-logo" src={require('assets/images/logo/logo-huna.jpg')}></img>
            </div>
            <div className="filter-login-block">
              <input id="username" className="inp-username" name="username" type="text" placeholder="Tài khoản"
                onFocus={this.setActiveInput.bind(this)}
                value={this.state.input['username'] || ""}
                />
              <input id="password" className="inp-password" name="password" type="password" placeholder="Mật khẩu"
                onFocus={this.setActiveInput.bind(this)}
                value={this.state.input['password'] || ""}
                />
            </div>
            { this.state.hasError ?
              (<div className="validation-form">
                <span className="validation-text">{this.state.message}</span>
              </div>) : null
            }
            <div className="btn-login" onClick={this.submitLogin.bind(this)}>
              <span className="text-login">Đăng Nhập</span>
            </div>
          </form>
          <Keyboarded inputName = {this.state.inputName} statusChange = {this.state.statusChange} onChangeAll = {this.onChangeAll} submitLogin = {this.submitLogin}/>
        </Modal>
      </div>
    );
  }
}

Login.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    token: state.token,
  }
}

export default connect(bindStateToProps)(Login);

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

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: '',
      password : '',
      message: '',
      hasError: false,
      token: '',
      statusPopup: true,
      filter: 'username',
      input: '',
      statusChange: false
    }
  }

  handleChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  gotoPage(page) {
    this.context.router.history.push(page);
  }

  submitLogin(e) {
    e.preventDefault();
    if(this.state.username == '') {
      this.setState({
        hasError: true,
        message: 'Vui lòng nhập username',
      })
    } else if (this.state.password == '') {
      this.setState({
        hasError: true,
        message: 'Vui lòng nhập password',
      })
    } else {
      let header = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Email': this.state.username,
        'Password': this.state.password
      }
      this.props.dispatch(Auth.actions.login(null, header)).then((res) =>{
        if (res.data && res.data.token) {
          localStorage.setItem('auth', JSON.stringify(res.data));
          this.props.history.push('/coffee');
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

  handleChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  onChange(input) {
    if (this.state.filter == 'username') {
      this.setState({
        username: input
      });
    } else {
      this.setState({
        password: input
      });
    }
  };

  onChangeInput(event) {
    // let input = event.target.value;
    // console.log(event);
    this.setState({
      [name]: event.target.value
    },
    () => {
        this.keyboardRef.keyboard.setInput(event.target.value);
      }
    );
  };

  filterInput(filter) {
    let statusChange = false;
    if (this.state.statusChange == false) {
      statusChange = true;
    } else {
      statusChange = false;
    }
    this.setState({
      filter: filter,
      statusChange: statusChange
    });
  }

  // resetFilterinput() {
  //
  // }

  render() {
    return (
      <div className="bg-login">
        <Modal
          isOpen={this.state.statusPopup}
          contentLabel="Modal"
          className="modal popup"
        >
          <form className="login-box">
            <div className="logo-huna">
              <span className="img-logo">HUNA</span>
            </div>
            <div className="filter-login-block">
              <input className="inp-username" name="username" type="text" placeholder="Tài khoản"
                value={this.state.username}
                onChange={this.handleChange.bind(this, 'username')}/>
              <input className="inp-password" name="password" type="password" placeholder="Mật khẩu"
                value={this.state.password}
                onChange={this.handleChange.bind(this, 'password')}/>
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
          <Keyboarded statusChange = {this.state.statusChange} onChangeInput = {this.onChangeInput.bind(this)} onChange = {this.onChange.bind(this)}/>
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

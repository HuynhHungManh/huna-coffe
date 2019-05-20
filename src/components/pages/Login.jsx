import React from 'react';
import {CommonLayout} from 'layouts';
import {Auth} from 'api';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
// import classnames from 'classnames';
// import {Calendar_PDF, Calendar_Title} from 'components/calendar';

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: '',
      password : '',
      message: '',
      hasError: false,
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
      // this.props.dispatch(Auth.actions.login()).then((res) =>{
      //   console.log(res);
      // });
      this.props.history.push('/coffee');
    }
  }

  render() {
    return (
      <div className="bg-login">
        <form className="login-box" onSubmit={this.submitLogin.bind(this)}>
          Huna cafe
          <div className="logo-huna">
          </div>
          <input className="inp-username" name="username" type="text" placeholder="Tài khoản" onChange={this.handleChange.bind(this, 'username')}/>
          <input className="inp-password" name="password" type="text" placeholder="Mật khẩu" onChange={this.handleChange.bind(this, 'password')}/>
          <button className="btn-login">
            Đăng Nhập
          </button>
        </form>
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

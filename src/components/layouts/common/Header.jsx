import React ,{ Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';

class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hoVaTen: 'Anonymous',
      page: ''
    }
  }

  componentWillMount() {
    if(window.location.href.indexOf('temporary-bill') !== -1) {
      this.setState({
        page : 'Thống Kê'
      })
    } else if(window.location.href.indexOf('store-tmp') !== -1) {
      this.setState({
        page : 'Hóa Đơn Lưu Tạm'
      })
    } else {
      this.setState({
        page : 'Order'
      })
    }
    let auth = JSON.parse(localStorage.getItem('auth'));
    if (auth.hoVaTen) {
      this.setState({
        hoVaTen : auth.hoVaTen
      });
    }
  }

  minimazScreen() {
    const mainProcess = window.require("electron").remote.require('./minimum.js');
    mainProcess.minimum();
  }

  render() {
    return (
      <header className="box-header">
        <div className="container">
          <img className="logo" src={require('assets/images/logo/logo-huna.jpg')}></img>
          <p className="title-page">
            <span className="title">{this.state.page}</span>
          </p>
          <div className="account-info-box">
            <p className="account-text">
              Xin chào:
              <span className="text">{this.state.hoVaTen}</span>
              <span className="icon-shrink" onClick={this.minimazScreen.bind(this)}></span>
            </p>
          </div>
        </div>
      </header>
    );
  }
}

Header.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {}
}

export default connect(bindStateToProps)(Header);

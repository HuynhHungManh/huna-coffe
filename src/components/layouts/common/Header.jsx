import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hoVaTen: 'Anonymous'
    }
  }

  componentWillMount() {
    let auth = JSON.parse(localStorage.getItem('auth'));
    if (auth.hoVaTen) {
      this.setState({
        hoVaTen : auth.hoVaTen
      });
    }
  }

  render() {
    return (
      <header className="box-header">
        <div className="container">
          <h1 className="logo">
          </h1>
          <p className="title-page">
            <span className="title">Order</span>
          </p>
          <div className="account-info-box">
            <p className="account-text">
              Xin chào:
              <span className="text">{this.state.hoVaTen}</span>
            </p>
          </div>
        </div>
      </header>
    );
  }
}

const bindStateToProps = (state) => {
  return {}
}

export default connect(bindStateToProps)(Header);

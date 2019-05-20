import React from 'react';
import {Link} from 'react-router-dom';

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
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
              <span className="text">Nguyễn Thị Mai</span>
            </p>
          </div>
        </div>
      </header>
    );
  }
}
export default Header;

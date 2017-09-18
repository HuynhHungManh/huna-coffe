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
            <Link className="link-logo" to='/'>
              <img className="img-logo" src={require('assets/images/logo/Logo.png')} />
            </Link>
          </h1>
          <div className="text-logo">
            <span className="text-title-logo">UBND QUẬN THANH KHÊ</span>
          </div>
          <p className="title-hotline">
            <span className="text-hotline">Đường dây nóng</span>
            <span className="number-hotline">0905 114 229</span>
          </p>
        </div>
      </header>
    );
  }
}
export default Header;

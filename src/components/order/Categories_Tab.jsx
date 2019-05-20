import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';

class Categories_Tab extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    return(
      <div className="categories-block">
        <ul className="categories-tab">
          <li className="tab">
            <a>Bán chạy</a>
          </li>
          <li className="tab">
            <a>Cà Phê</a>
          </li>
          <li className="tab">
            <a>Trà Sữa</a>
          </li>
          <li className="tab">
            <a>Nước Ép</a>
          </li>
          <li className="tab">
            <a>Kem</a>
          </li>
          <li className="tab">
            <a>Trà Sữa</a>
          </li>
          <li className="tab">
            <a>Thức Uống Khác</a>
          </li>
        </ul>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
  }
}

export default connect(bindStateToProps)(Categories_Tab);

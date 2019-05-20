import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';

class Item_Order extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    return(
      <li className="item-order">
        <span className="item-text">{this.props.data.name}</span>
      </li>
    );
  }
}

const bindStateToProps = (state) => {
  return {
  }
}

export default connect(bindStateToProps)(Item_Order);

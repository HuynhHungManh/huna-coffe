import React, { Component } from 'react';
import classnames from 'classnames';

class Item_Order extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    return(
      <li className={
        classnames('item-order', {
          'active' : this.props.data.selectStatus,
        })} onClick={this.props.chooseProduct.bind(this, this.props.data.id)}>
        <span className="item-text">{this.props.data.ten}</span>
      </li>
    );
  }
}

export default Item_Order;

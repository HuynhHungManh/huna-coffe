import React, { Component } from 'react';
import classnames from 'classnames';
import NumberFormat from 'react-number-format';

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
          <span className="item-text">
            <span className="text">
              {this.props.data.ten}
            </span> 
          <span className="price">
            <NumberFormat value={this.props.data.donGia} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
          </span>
        </span>
      </li>
    );
  }
}

export default Item_Order;

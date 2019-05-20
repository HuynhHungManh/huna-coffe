import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Order from './Item_Order.jsx';
import Bill_Order from './Bill_Order.jsx';

class Content_Order extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    const products = [
      { name: "Cà phê đen " },
      { name: "Cà phê sữa" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
    ];
    return(
      <div className="content-order">
        <div className="item-order-block">
          <ul className="item-order-box">
            {
              products.map((item, i) => {
                return (
                  <Item_Order key = {i} data = {item}/>
                )
              })
            }
          </ul>
        </div>
        <Bill_Order/>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
  }
}

export default connect(bindStateToProps)(Content_Order);

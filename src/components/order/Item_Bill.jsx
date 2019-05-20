import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';

class Item_Bill extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    return(
      <div className="bill-item">
        <div className="text-item">
          <p className="text">{this.props.data.name}</p>
        </div>
        <div className="price-item">
          <p className="text-price">{this.props.data.price}</p>
        </div>
        <div className="quantum-item">
          <div className="calculate-box">
            <button className="btn minus-quantum">
              -
            </button>
            <p className="text-quantum">{this.props.data.quantum}</p>
            <button className="btn plus-quantum">
              +
            </button>
          </div>
        </div>
        <div className="total-price-item">
          <p className="total-price-text">
            {this.props.data.totalPrice}
          </p>
        </div>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
  }
}

export default connect(bindStateToProps)(Item_Bill);

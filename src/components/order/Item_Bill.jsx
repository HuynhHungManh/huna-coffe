import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';

class Item_Bill extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      quantum: 1,
      bill_data: []
    }
  }

  componentWillMount() {
    this.setState({
      bill_data :  this.props.data
    });
  }

  calculatePrice(price, quantum) {
    return price * quantum;
  }

  minusQuantum(idBill) {
    if (this.state.quantum > 1) {
      this.setState({
        quantum :  this.state.quantum - 1
      });
      this.props.updateQuantum(idBill, 'minus');
    }
  }

  plusQuantum(idBill) {
    this.setState({
      quantum :  this.state.quantum + 1
    });
    this.props.updateQuantum(idBill, 'plus');
  }

  render() {
    return(
      <div className="bill-item">
        <div className="text-item">
          <p className="text">{this.state.bill_data.ten}</p>
        </div>
        <div className="price-item">
          <p className="text-price">{this.state.bill_data.donGia}</p>
        </div>
        <div className="quantum-item">
          <div className="calculate-box">
            <button className="btn minus-quantum"
              onClick={this.minusQuantum.bind(this, this.state.bill_data.id)}>
              -
            </button>
            <p className="text-quantum">{this.state.quantum}</p>
            <button className="btn plus-quantum"
              onClick={this.plusQuantum.bind(this, this.state.bill_data.id)}>
              +
            </button>
          </div>
        </div>
        <div className="total-price-item">
          <p className="total-price-text">
            {this.calculatePrice(this.state.bill_data.donGia, this.state.bill_data.quantum)}
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

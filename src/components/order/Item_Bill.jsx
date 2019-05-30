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

  truncate(text) {
    let len = 0;
    let textTruncate = text;
    let trimmedText = '';
    let count=0;
    let i=0;
    for (i = 0, len = textTruncate.length; i < len; i++) {
      if(textTruncate[i]==' ') count++;
      if(count == 6){
        trimmedText = textTruncate.substring(0, i) + " ...";
      break;
    } else {
        trimmedText = textTruncate.substring(0, i+1);
      }
    }
    return trimmedText;
  }

  render() {
    return(
      <div className="bill-item" onClick={this.props.chooseItemProduct.bind(this, this.props.data)}>
        <div className="text-item">
          <p className="text">{this.truncate(this.props.data.ten)}</p>
        </div>
        <div className="price-item">
          <p className="text-price">{this.props.data.donGia}</p>
        </div>
        <div className="quantum-item">
          <div className="calculate-box">
            <button className="btn minus-quantum"
              onClick={this.minusQuantum.bind(this, this.props.data.id)}>
              -
            </button>
            <p className="text-quantum">{this.state.quantum}</p>
            <button className="btn plus-quantum"
              onClick={this.plusQuantum.bind(this, this.props.data.id)}>
              +
            </button>
          </div>
        </div>
        <div className="total-price-item">
          <p className="total-price-text">
            {this.calculatePrice(this.props.data.donGia, this.props.data.quantum)}
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

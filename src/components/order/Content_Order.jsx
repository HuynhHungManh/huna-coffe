import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Order from './Item_Order.jsx';
import Bill_Order from './Bill_Order.jsx';
import {PropTypes} from 'prop-types';

class Content_Order extends Component {
  constructor(props, context) {
    super(props, context);
    this.chooseProduct = this.chooseProduct.bind(this);
    this.state = {
      products: [],
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.products !== this.props.products) {
      let products = this.props.products;
      let preProduct = [];

      products.forEach((item, index) => {
        item.selectStatus = false;
        preProduct.push(item);
      });

      this.setState({
        products : preProduct
      });
    }
  }

  storeProductsBill(productsBill) {
    return {
      type: 'CHOOSE_PRODUCTS_BILL',
      productsBill
    }
  }

  chooseProduct(idProduct) {
    let preProduct = [];
    let chooseProductsBill = [];
    this.state.products.forEach((item, index) => {
      if (item.id === idProduct) {
        if (item.selectStatus == true) {
          item.selectStatus = false;
        } else {
          item.selectStatus = true;
        }
      }
      preProduct.push(item);
    });

    this.setState({
      products : preProduct
    });

    preProduct.forEach((value, index_select) => {
      if (value.selectStatus === true) {
        chooseProductsBill.push(value);
      }
    });
    this.props.dispatch(this.storeProductsBill(chooseProductsBill));
  }

  render() {
    return(
      <div className="content-order">
        <div className="item-order-block">
          <ul className="item-order-box">
            {
              this.state.products.map((item, i) => {
                return (
                  <Item_Order key = {i} data = {item} chooseProduct = {this.chooseProduct}/>
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

Content_Order.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    products: state.products || []
  }
}

export default connect(bindStateToProps)(Content_Order);

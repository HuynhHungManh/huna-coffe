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
    this.clearFormOrder = this.clearFormOrder.bind(this);
    this.state = {
      products: [],
      arrayId: [],
      statusClear: false
    }
  }

  componentWillMount() {
    localStorage.removeItem('products');
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.products !== this.props.products) {
      let getStoreProducts = JSON.parse(localStorage.getItem('products'));
      let products = this.props.products;
      let preProduct = [];

      products.forEach((item, index) => {
        if (getStoreProducts != null
          && getStoreProducts.length > 0
          && getStoreProducts.includes(item.id)
        ) {
          item.selectStatus = true;
        } else {
          item.selectStatus = false;
        }
        preProduct.push(item);
      });

      if (prevProps.products.length > 0) {
        let arrayId = [];
        this.state.products.forEach((item, index) => {
          if (item.selectStatus == true) {
            arrayId.push(item.id);
          }
        });
        if (getStoreProducts != null
          && getStoreProducts.length > 0
        ) {
          arrayId = getStoreProducts.concat(arrayId);
        }
        localStorage.setItem('products', JSON.stringify(arrayId));
      }

      this.setState({
        products : preProduct
      });
    }
    if (prevProps.statusClear !== this.props.statusClear) {
      let products = this.state.products;
      let arrayProduct = [];
      products.forEach((item, index) => {
        if (item.selectStatus == true) {
          item.selectStatus = false;
        }
        arrayProduct.push(item);
      });
      // this.setState({
      //   products : arrayProduct,
      //   statusClear: false
      // });
    }
  }

  storeProductsBill(productsBill) {
    return {
      type: 'CHOOSE_PRODUCTS_BILL',
      productsBill
    }
  }

  clearFormOrder() {
    let products = this.state.products;
    let arrayProduct = [];
    products.forEach((item, index) => {
      if (item.selectStatus == true) {
        item.selectStatus = false;
      }
      arrayProduct.push(item);
    });
    this.setState({
      products : arrayProduct
    });
    localStorage.removeItem('products');
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
        <Bill_Order productsBill = {this.state.products} clearFormOrder = {this.clearFormOrder}/>
      </div>
    );
  }
}

Content_Order.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    products: state.products || [],
    statusClear: state.statusClear
  }
}

export default connect(bindStateToProps)(Content_Order);

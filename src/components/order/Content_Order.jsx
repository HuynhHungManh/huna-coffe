import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Order from './Item_Order.jsx';
import Bill_Order from './Bill_Order.jsx';
import {PropTypes} from 'prop-types';
import {Numberic} from 'components/keyboarded';

class Content_Order extends Component {
  constructor(props, context) {
    super(props, context);
    this.chooseProduct = this.chooseProduct.bind(this);
    this.clearFormOrder = this.clearFormOrder.bind(this);
    this.cancelItemBill = this.cancelItemBill.bind(this);
    this.updateQuantum = this.updateQuantum.bind(this);
    this.copyProductsBill = this.copyProductsBill.bind(this);
    this.state = {
      products: [],
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
          && getStoreProducts.find(x => x.id == item.id)
        ) {
          let getProduct = getStoreProducts.find(x => x.id == item.id)
          item.selectStatus = true;
          item.quantum = getProduct.quantum;
        } else {
          item.quantum = 1;
        }
        let sameProduct = this.state.products.find(x => x.id == item.id);
        if (sameProduct && sameProduct.selectStatus == true) {
          item.selectStatus = true;
          item.quantum = sameProduct.quantum;
        }
        item.priceAndQuantum = item.quantum * item.donGia;
        preProduct.push(item);
      });
      this.setState({
        products : preProduct
      });
      if (prevProps.products.length > 0) {
        let array = [];
        let arrayAdd = [];
        let updateQuantum = [];
        array = this.state.products.filter(value => value.selectStatus == true);
        if (getStoreProducts != null
          && getStoreProducts.length > 0 && array.length > 0
        ) {
          array.forEach((item, index) => {
            if (!getStoreProducts.find(x => x.id == item.id)) {
              arrayAdd.push(item);
            } else {
              updateQuantum.push(item);
            }
          });
          getStoreProducts.forEach((item, index) => {
            let valueUpdate = updateQuantum.find(x => x.id == item.id);
            if (valueUpdate) {
              getStoreProducts[index].quantum = valueUpdate.quantum;
              getStoreProducts[index].priceAndQuantum = getStoreProducts[index].quantum * getStoreProducts[index].donGia;
            }
          });
          array = getStoreProducts.concat(arrayAdd);
        }
        if (array.length > 0) {
          localStorage.setItem('products', JSON.stringify(array));
        }
      }
    }
    if (prevState.products !== this.state.products) {
      this.setState({
        products: this.state.products
      });
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
        item.quantum = 1;
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
          item.quantum = item.quantum + 1;
          item.priceAndQuantum = item.quantum * item.donGia;
        }
        item.selectStatus = true;
      }
      preProduct.push(item);
    });
    this.setState({
      products : preProduct
    });
  }

  cancelItemBill(id) {
    let arrayPreProduct = [];
    this.state.products.forEach((item, index) => {
      if (item.id == id) {
        item.selectStatus = false;
      }
      arrayPreProduct.push(item);
    });
    this.setState({
      products: arrayPreProduct
    });
    let getStoreProducts = JSON.parse(localStorage.getItem('products'));
    if (getStoreProducts && getStoreProducts.find(x => x.id == id)) {
      localStorage.setItem('products', JSON.stringify(getStoreProducts.filter(x => x.id != id)));
    }
  }

  updateQuantum(idBill, operator) {
    console.log(idBill);
    let productsBillPre = [];
    let priceTotal = 0;
    this.state.products.forEach((item, index) => {
      if (item.id == idBill) {
        if (operator === 'minus') {
          item.quantum = item.quantum - 1;
        } else {
          item.quantum = item.quantum + 1;
        }
      }
      item.priceAndQuantum = item.quantum * item.donGia;
      priceTotal = priceTotal + item.priceAndQuantum;
      productsBillPre.push(item);
    });
    this.setState({
      products : productsBillPre
    });
    let getStoreProducts = JSON.parse(localStorage.getItem('products'));
    if (getStoreProducts && getStoreProducts.find(x => x.id == idBill)) {
      getStoreProducts.forEach((item, index) => {
        if (item.id == idBill) {
          if (operator === 'minus') {
            getStoreProducts[index].quantum = getStoreProducts[index].quantum - 1;
          } else {
            getStoreProducts[index].quantum = getStoreProducts[index].quantum + 1;
          }
        }
        getStoreProducts[index].priceAndQuantum = getStoreProducts[index].quantum * getStoreProducts[index].donGia;
      });
      localStorage.setItem('products', JSON.stringify(getStoreProducts));
    }
    // console.log(productsBillPre);
  }

  copyProductsBill() {
    this.clearFormOrder();
    let getStoreProducts = JSON.parse(localStorage.getItem('products'));
    let getCopyProductsBill = JSON.parse(localStorage.getItem('copyProductsBill')).productsBill;
    let productsCurrent = this.state.products;
    if (getCopyProductsBill) {
      getCopyProductsBill.forEach((item, index) => {
        productsCurrent.forEach((item2, index2) => {
          if (item.id == item2.id) {
            productsCurrent[index2] = getCopyProductsBill[index];
          }
        });
      });
      this.setState({
        products: productsCurrent
      });

      if (getStoreProducts) {
        getCopyProductsBill.forEach((item, index) => {
          getStoreProducts.forEach((item2, index2) => {
            if (item.id == item2.id) {
              getStoreProducts[index2] = getCopyProductsBill[index];
            }
          });
        });
        localStorage.setItem('products', JSON.stringify(getStoreProducts));
      }
    }
  }

  render() {
    return(
      <div className="content-order">
      <Numberic />
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
        <Bill_Order
          updateQuantum = {this.updateQuantum}
          cancelItemBill = {this.cancelItemBill}
          productsBill = {this.state.products}
          categories = {this.props.categories}
          clearFormOrder = {this.clearFormOrder}
          copyProductsBill = {this.copyProductsBill}
        />
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
    categories: state.categories
  }
}

export default connect(bindStateToProps)(Content_Order);

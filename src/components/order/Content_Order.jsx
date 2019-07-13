import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Order from './Item_Order.jsx';
import Bill_Order from './Bill_Order.jsx';
import {PropTypes} from 'prop-types';
import {Numberic} from 'components/keyboarded';
import {Orders, Promotion, NoteOrder, TotalPromotion} from 'api';

class Content_Order extends Component {
  constructor(props, context) {
    super(props, context);
    this.chooseProduct = this.chooseProduct.bind(this);
    this.clearFormOrder = this.clearFormOrder.bind(this);
    this.cancelItemBill = this.cancelItemBill.bind(this);
    this.updateQuantum = this.updateQuantum.bind(this);
    this.copyProductsBill = this.copyProductsBill.bind(this);
    this.onClickFiledInput = this.onClickFiledInput.bind(this);
    this.closeNumberic = this.closeNumberic.bind(this);
    this.changePayment = this.changePayment.bind(this);
    this.countCodeAfterSubmit = this.countCodeAfterSubmit.bind(this);
    this.state = {
      products: [],
      statusClear: false,
      numberTable: '',
      showNumberic: false,
      filedCurrent: '',
      discountInput: '',
      outLay: 0,
      cardPayment: 0,
      countCode: 0
    }
  }

  componentWillMount() {
    localStorage.removeItem('products');
    let date = new Date();
    let dateTodayFormat = JSON.parse(JSON.stringify(date));
    this.props.dispatch(Orders.actions.getOrders({ngayOrder: dateTodayFormat})).then((res) => {
      if (res.data.content) {
        let data = res.data;
        this.setState({
          getOrders :  data.content,
          billTotal: data.totalElements
        });
        let priceTotal = 0;
        let priceDiscount = 0;
        data.content.forEach(function(item, index) {
          priceTotal = priceTotal + item.thanhTien;
          priceDiscount = priceDiscount + item.tongGia;
        });
        this.setState({
          priceTotal :  priceTotal,
          priceDiscount: priceTotal - priceDiscount
        });
        let dataCache = {
          getOrders: data.content,
          billTotal: data.totalElements,
          priceTotal: priceTotal,
          priceDiscount: priceTotal - priceDiscount
        };
        localStorage.setItem('dataCacheOrder', JSON.stringify(dataCache));
      }
    });
    this.props.dispatch(Promotion.actions.promotion());
    this.props.dispatch(NoteOrder.actions.noteOrders());
    this.props.dispatch(Orders.actions.getOrders({ngayOrder: dateTodayFormat})).then((res) => {
      if (res.data.content) {
        let arrayTmp = [];
        res.data.content.forEach((item, index) => {
          this.props.dispatch(Orders.actions.orderThucDons({orderId: item.id})).then((res) => {
            if (res.data) {
              res.data.forEach((item, index) => {
                arrayTmp.push(item);
              });
              localStorage.setItem('dataOrderDetail', JSON.stringify(arrayTmp));
            }
          });
        });
        this.setState({
          countCode: res.data.content.length
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.products !== this.props.products) {
      let getStoreProducts = JSON.parse(localStorage.getItem('products'));
      let products = this.props.products;
      let preProduct = [];
      // let categoriesIdCurrent = JSON.parse(localStorage.getItem('categoriesIdCurrent'));
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
        // item.categoriesId = categoriesIdCurrent;
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
      products : arrayProduct,
      outLay: 0,
      discountInput: ''
    });
    localStorage.removeItem('products');
  }

  chooseProduct(idProduct) {
    let preProduct = [];
    let chooseProductsBill = [];
    this.state.products.forEach((item, index) => {
      if (item.id === idProduct) {
        if (item.selectStatus == true && (!item.itemNote || item.itemNote.length ==0)) {
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
        if (item.itemPromotion) {
          delete item.itemPromotion;
        }
        if (item.itemNote) {
          delete item.itemNote;
        }
        item.quantum = 1;
        item.priceAndQuantum = item.quantum * item.donGia;
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

  updateQuantum(idBill, operator, promotion) {
    let productsBillPre = [];
    let priceTotal = 0;
    this.state.products.forEach((item, index) => {
      if (item.id == idBill) {
        if (operator == 'minus') {
          item.quantum = item.quantum - 1;
        } else {
          item.quantum = item.quantum + 1;
        }
        if (promotion && promotion > 0) {
          // item.priceAndQuantum = (item.donGia - promotion) * item.quantum;
          item.itemPromotion = promotion;
        } else {
          item.priceAndQuantum = item.quantum * item.donGia;
          item.itemPromotion = 0;
        }
      }
      priceTotal = priceTotal + item.priceAndQuantum;
      productsBillPre.push(item);
    });
    this.setState({
      products : productsBillPre
    });
    let getStoreProducts = JSON.parse(localStorage.getItem('products'));
    let arrayTmp = [];
    if (getStoreProducts && getStoreProducts.find(x => x.id == idBill)) {
      getStoreProducts.forEach((item, index) => {
        if (item.id == idBill) {
          if (operator === 'minus') {
            item.quantum = item.quantum && item.quantum > 1 ? item.quantum - 1 : 1;
          } else {
            item.quantum = item.quantum ? item.quantum + 1 : 1;
          }
          if (promotion && promotion > 0) {
            item.priceAndQuantum = (item.donGia - promotion) * item.quantum;
            item.itemPromotion = promotion;
          } else {
            item.priceAndQuantum = item.quantum * item.donGia;
            item.itemPromotion = 0;
          }
        }
        arrayTmp.push(item);
      });
      localStorage.setItem('products', JSON.stringify(getStoreProducts));
    }
  }

  copyProductsBill() {
    this.clearFormOrder();
    let getStoreProducts = JSON.parse(localStorage.getItem('products'));
    let getCopyProducts = JSON.parse(localStorage.getItem('copyProductsBill')).productsBill;
    let getCopyProductsBill = getCopyProducts.productsBill;
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
        products: productsCurrent,
        numberTable: getCopyProducts.numberTable
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

  onClickFiledInput(e) {
    this.setState({
      filedCurrent: e.target.name,
      showNumberic: true
    });
  }

  changeNumbericInput(number) {
    if (this.state.filedCurrent == 'numberTable') {
      if (number != 'clear') {
        let numberTableStore = this.state.numberTable != '' ? Number(this.state.numberTable) : 0;
        if (numberTableStore && numberTableStore < 100) {
          let numbers = (this.state.numberTable * 10) + number;
          if (numbers < 100 && numbers > 9) {
            this.setState({
              numberTable: numbers.toString()
            });
          } else {
            this.setState({
              numberTable: '0' + number.toString()
            });
          }
        } else {
          this.setState({
            numberTable: '0' + number.toString()
          });
        }
      } else {
        this.setState({
          numberTable: ''
        });
      }
    } else if (this.state.filedCurrent == 'discountInput') {
      if (number != 'clear') {
        if (this.state.discountInput && this.state.discountInput < 100) {
          let numbers = (this.state.discountInput * 10) + number;
          if (numbers < 100) {
            this.setState({
              discountInput: numbers
            });
          } else {
            this.setState({
              discountInput: '0' + number
            });
          }
        } else {
          this.setState({
            discountInput: '0' + number
          });
        }
      } else {
        this.setState({
          discountInput: 'clear'
        });
      }
    } else if (this.state.filedCurrent == 'outLay') {
      let numberCurrent = 0;
      if (number != 'clear') {
        if (this.state.outLay == 0) {
          numberCurrent = number * 1000;
        } else {
          numberCurrent = (this.state.outLay * 10) + (number * 1000);
        }
        this.setState({
          outLay: numberCurrent
        });
      } else {
        this.setState({
          outLay: 0
        });
      }
    }
  }

  closeNumberic() {
    this.setState({
      showNumberic: false
    });
  }

  changePayment(payment) {
    this.setState({
      outLay: payment
    });    
  }

  countCodeAfterSubmit() {
    this.setState({
      countCode: this.state.countCode + 1
    });
  }

  render() {
    return(
      <div className="content-order">
        { this.state.showNumberic
          ? <Numberic changeNumbericInput = {this.changeNumbericInput.bind(this)} 
            discountInput = {this.state.numberTable} 
            filedCurrent = {this.state.filedCurrent} 
            closeNumberic = {this.closeNumberic}/>
          : ""
        }
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
          numberTable = {this.state.numberTable}
          showNumberic = {this.state.showNumberic}
          onClickFiledInput = {this.onClickFiledInput}
          discountInput = {this.state.discountInput}
          filedCurrent = {this.state.filedCurrent}
          outLay = {this.state.outLay}
          changePayment = {this.changePayment}
          countCode = {this.state.countCode}
          countCodeAfterSubmit = {this.countCodeAfterSubmit}
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

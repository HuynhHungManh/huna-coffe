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
    this.addNote = this.addNote.bind(this);
    this.changeTotal = this.changeTotal.bind(this);
    this.state = {
      products: [],
      statusClear: false,
      numberTable: '',
      showNumberic: false,
      filedCurrent: '',
      discountInput: '',
      outLay: 0,
      cardPayment: 0,
      countCode: 0,
      chooseProductsBill: [],
      priceTotal: 0,
      intoMoney: 0,
      promotionBill: 0,
      promotionGroup: [],
      promotionGroupId: [],
      promotionItems: []
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
        // let priceTotal = 0;
        // let priceDiscount = 0;
        // data.content.forEach(function(item, index) {
        //   priceTotal = priceTotal + item.thanhTien;
        //   priceDiscount = priceDiscount + item.tongGia;
        // });
        // this.setState({
        //   priceTotal :  priceTotal,
        //   priceDiscount: priceTotal - priceDiscount
        // });
        let dataCache = {
          getOrders: data.content
        };
        // localStorage.setItem('dataCacheOrder', JSON.stringify(dataCache));
      }
    });
    this.props.dispatch(Promotion.actions.promotion());
    this.props.dispatch(NoteOrder.actions.noteOrders());
    let orderListTmp = JSON.parse(localStorage.getItem('orderListTmp'));
    let itemStore = orderListTmp ? orderListTmp.length : 0;
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
          countCode: res.data.content.length + itemStore
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
    if (prevProps.promotion !== this.props.promotion) {
      let promotionBill = this.props.promotion.find(item => item.maLoaiKhuyenMai == 'KHUYEN_MAI_HOA_DON' 
        && this.checkPromotionDate(item.tuNgay, item.denNgay));
      if (promotionBill) {
        this.setState({
          promotionBill: promotionBill.chietKhau
        });
      } else {
        let promotionGroup = this.props.promotion.filter(item => item.maLoaiKhuyenMai == 'KHUYEN_MAI_NHOM_MON' 
          && this.checkPromotionDate(item.tuNgay, item.denNgay));
        let promotionItems = this.props.promotion.filter(item => item.maLoaiKhuyenMai == 'KHUYEN_MAI_MON'
          && this.checkPromotionDate(item.tuNgay, item.denNgay));
        if (promotionGroup) {
          let arrayId = [];
          promotionGroup.forEach((item, index) => {
            arrayId.push(item.loaiThucDonId);
          });
          this.setState({
            promotionGroup: promotionGroup,
            promotionGroupId: arrayId
          });
        }
        if (promotionItems) {
          if (this.state.promotionGroupId) {
            promotionItems = promotionItems.filter(item => this.state.promotionGroupId.indexOf(item.loaiThucDonId) === -1);
          }
          this.setState({
            promotionItems: promotionItems
          });
        }
      }
    }
  }

  storeProductsBill(productsBill) {
    return {
      type: 'CHOOSE_PRODUCTS_BILL',
      productsBill
    }
  }

  checkPromotionDate(startDateParams, endDateParams) {
    let startDate = this.toTimestamp(startDateParams);
    let endDate = this.toTimestamp(endDateParams);
    let today = Math.round(+new Date()/1000);
    if (startDate <= today && today <= endDate) {
      return true;
    }
    return false;
  }

  toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
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
      products : arrayProduct,
      priceTotal: 0,
      chooseProductsBill: []
    });
    localStorage.removeItem('products');
  }

  promotionCheck(products) {
    let arrayTmp = [];
    if (this.state.promotionBill == 0) {
      products.forEach((item, index) => {
        if (this.state.promotionGroup) {
          let promotionGroup = this.state.promotionGroup.find(itemPromotion => itemPromotion.loaiThucDonId == item.loaiThucDonId);
          if (promotionGroup) {
            item.discount = promotionGroup.chietKhau;
            item.itemPromotion = (promotionGroup.chietKhau * item.donGia) / 100;
          } else {
            let promotionItem = this.state.promotionItems.find(itemPromotion => itemPromotion.thucDonId == item.id);
            if (promotionItem) {
              item.discount = promotionItem.chietKhau;
              item.itemPromotion = (promotionItem.chietKhau * item.donGia) / 100;
            }
          }
        }
        arrayTmp.push(item);
      });
    }
    
    return arrayTmp.length != 0 ? arrayTmp : products;
  }

  changeTotal(price) {
    this.setState({
      priceTotal: price
    });
  }

  chooseProduct(idProduct) {
    let preProduct = [];
    let chooseProductsBill = [];
    let newItemArray = [];
    this.state.products.forEach((item, index) => {
      if (item.id === idProduct) {
        let chooseProductsBillState = this.state.chooseProductsBill;
        let checkProductNonNote = chooseProductsBillState.find(
          value => (value.id == idProduct && (!value.itemNote || value.itemNote.length == 0)));
        if (checkProductNonNote) {
          console.log('update quatum');
          // update quatum
          let priceTotal = 0;
          let arrTmp = [];
          chooseProductsBillState.forEach((itemState, index) => {
            if (itemState.idUnique == checkProductNonNote.idUnique) {
              itemState.quantum = itemState.quantum + 1;
              itemState.priceAndQuantum = itemState.quantum * itemState.donGia;
            }
            priceTotal = priceTotal + (itemState.quantum * itemState.donGia);
            arrTmp.push(itemState);
          });

          // priceDiscount = this.promotionCheck(arrTmp).reduce((total, item) => total + item.donGia, 0) + newItem.donGia;
          // console.log(priceTotal);
          this.setState({
            chooseProductsBill : this.promotionCheck(arrTmp),
            priceTotal: priceTotal
          });
        } else {
          console.log('add new');
          let newItem = {...item ? item : ''};
          newItem.idUnique = chooseProductsBillState.length;
          let priceTotal = 0;
          if (this.state.chooseProductsBill.length == 0) {
            priceTotal = newItem.donGia;
          } else {
            priceTotal = this.state.chooseProductsBill.reduce((total, item) => total + (item.donGia * item.quantum), 0) + newItem.donGia;
          }
          // chooseProductsBillState.forEach((itemState, index) => {

          // });
          // priceTotal: 0,
          // intoMoney: 0
          this.setState(prevState => ({
            chooseProductsBill: this.promotionCheck([...prevState.chooseProductsBill, newItem]),
            priceTotal: priceTotal
          }));
        }
        item.selectStatus = true;
      }
      // console.log(this.state.chooseProductsBill);
      preProduct.push(item);
    });
    this.setState({
      products : preProduct
    });
  }

  addNote(arr) {
    this.setState({
      chooseProductsBill : arr
    });
  }

  cancelItemBill(idUnique, id) {
    let arrayPreProduct = [];
    this.state.products.forEach((item, index) => {
      this.state.chooseProductsBill
      if (item.id == id) {
        let checkRemove =  this.state.chooseProductsBill.filter(value => value.id == id);
        if (checkRemove && checkRemove.length == 1) {
          item.selectStatus = false;
          let getStoreProducts = JSON.parse(localStorage.getItem('products'));
          if (getStoreProducts && getStoreProducts.find(x => x.id == id)) {
            localStorage.setItem('products', JSON.stringify(getStoreProducts.filter(x => x.id != id)));
          }
        }
      }
      arrayPreProduct.push(item);
    });
    this.setState({
      chooseProductsBill: this.state.chooseProductsBill.filter(item => item.idUnique != idUnique),
      products: arrayPreProduct
    });
  }

  updateQuantum(idBill, operator, promotion) {
    let productsBillPre = [];
    let priceTotal = 0;

    let promotionState = promotion > 0 ? promotion : 0;
    this.state.chooseProductsBill.forEach((item, index) => {
      if (item.idUnique == idBill) {
        if (operator == 'minus') {
          item.quantum = item.quantum - 1;
        } else {
          item.quantum = item.quantum + 1;
        }
        // if (promotion && promotion > 0) {
        //   // item.priceAndQuantum = (item.donGia - promotion) * item.quantum;
        //   item.itemPromotion = promotion;
        // } else {
        //   item.priceAndQuantum = item.quantum * item.donGia;
        //   item.itemPromotion = 0;
        // }
      }
      if (item.itemPromotion && item.itemPromotion > 0) {
        priceTotal = priceTotal + (item.quantum * (item.donGia - item.itemPromotion));
      } else {
        priceTotal = priceTotal + (item.quantum * item.donGia);
      }
      productsBillPre.push(item);
    });
    this.setState({
      chooseProductsBill : productsBillPre,
      priceTotal: priceTotal
    });
    // let getStoreProducts = JSON.parse(localStorage.getItem('products'));
    // let arrayTmp = [];
    // if (getStoreProducts && getStoreProducts.find(x => x.id == idBill)) {
    //   getStoreProducts.forEach((item, index) => {
    //     if (item.idUnique == idBill) {
    //       if (operator === 'minus') {
    //         item.quantum = item.quantum && item.quantum > 1 ? item.quantum - 1 : 1;
    //       } else {
    //         item.quantum = item.quantum ? item.quantum + 1 : 1;
    //       }
    //       if (promotion && promotion > 0) {
    //         item.priceAndQuantum = (item.donGia - promotion) * item.quantum;
    //         item.itemPromotion = promotion;
    //       } else {
    //         item.priceAndQuantum = item.quantum * item.donGia;
    //         item.itemPromotion = 0;
    //       }
    //     }
    //     arrayTmp.push(item);
    //   });
    //   localStorage.setItem('products', JSON.stringify(getStoreProducts));
    // }
  }

  copyProductsBill() {
    this.clearFormOrder();
    let getStoreProducts = JSON.parse(localStorage.getItem('products'));
    let getCopyProducts = JSON.parse(localStorage.getItem('copyProductsBill'));
    let getCopyProductsBill = getCopyProducts.productsBill;
    let productsCurrent = this.state.products;
    // console.log(productsCurrent);
    // console.log(getCopyProductsBill);
    // console.log(JSON.parse(localStorage.getItem('copyProductsBill')));
    if (getCopyProductsBill) {
      getCopyProductsBill.forEach((item, index) => {
        productsCurrent.forEach((item2, index2) => {
          if (item.id == item2.id) {
            // productsCurrent[index2] = getCopyProductsBill[index];
            productsCurrent[index2].selectStatus = true;
            // productsCurrent[index2]
          }
        });
      });
      this.setState({
        products: productsCurrent,
        chooseProductsBill: getCopyProductsBill
      });

      // if (getStoreProducts) {
      //   getCopyProductsBill.forEach((item, index) => {
      //     getStoreProducts.forEach((item2, index2) => {
      //       if (item.id == item2.id) {
      //         getStoreProducts[index2] = getCopyProductsBill[index];
      //       }
      //     });
      //   });

      //   localStorage.setItem('products', JSON.stringify(getStoreProducts));
      // }

    }
  }

  onClickFiledInput(e) {
    this.setState({
      filedCurrent: e.target.name,
      showNumberic: true
    });
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
          productsBill = {this.state.chooseProductsBill}
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
          addNote = {this.addNote}
          priceTotal = {this.state.priceTotal}
          promotionBill = {this.state.promotionBill}
          changeTotal = {this.changeTotal}
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
    categories: state.categories,
    promotion: state.promotion
  }
}

export default connect(bindStateToProps)(Content_Order);

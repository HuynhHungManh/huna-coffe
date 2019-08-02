import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Order from './Item_Order.jsx';
import Bill_Order from './Bill_Order.jsx';
import {PropTypes} from 'prop-types';
import {Numberic} from 'components/keyboarded';
import {Orders, Promotion, NoteOrder, TotalPromotion} from 'api';
import DragScrollProvider from 'drag-scroll-provider';

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
    this.processOrderTmp = this.processOrderTmp.bind(this);
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
        let dataCache = {
          getOrders: data.content
        };
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
      // this.setState({
      //   products: this.state.products
      // });
      let getOrderProcessTmp = JSON.parse(localStorage.getItem('orderProcessTmp'));
      if (getOrderProcessTmp) {
        this.processOrderTmp(getOrderProcessTmp);
      }
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

  getMax(array) {
    let value = 0;
    array.forEach((item, index) => {
      if (item.idUnique > value) {
        value = item.idUnique;
      }
    });

    return value;
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
          // update quatum
          let priceTotal = 0;
          let arrTmp = [];

          chooseProductsBillState.forEach((itemState, index) => {
            if (itemState.idUnique == checkProductNonNote.idUnique) {
              itemState.quantum = itemState.quantum + 1;
              itemState.priceAndQuantum = itemState.quantum * itemState.donGia;
            }

            if (itemState.itemPromotion && itemState.itemPromotion > 0) {

              priceTotal = priceTotal + ((itemState.donGia - itemState.itemPromotion) * itemState.quantum);
            } else {
              priceTotal = priceTotal + (itemState.quantum * itemState.donGia);
            }
            arrTmp.push(itemState);
          });

          this.setState({
            chooseProductsBill : this.promotionCheck(arrTmp),
            priceTotal: priceTotal
          });
        } else {
          let newItem = {...item ? item : ''};
          newItem.idUnique = this.getMax(chooseProductsBillState) + 1;
          let priceTotal = 0;
          if (this.state.chooseProductsBill.length == 0) {
            priceTotal = newItem.donGia;
          } else {
            chooseProductsBillState.forEach((item, index) => {
              if (item.itemPromotion && item.itemPromotion > 0) {
                priceTotal = priceTotal + (item.donGia * item.quantum) - item.itemPromotion;
              } else {
                priceTotal = priceTotal + (item.donGia * item.quantum);
              }
            });
            priceTotal = priceTotal + newItem.donGia;
          }
          this.setState(prevState => ({
            chooseProductsBill: this.promotionCheck([...prevState.chooseProductsBill, newItem]),
            priceTotal: priceTotal
          }));
        }
        item.selectStatus = true;
        this.state.products[index].selectStatus = true;
        // this.setState({
        //   products : preProduct
        // });
        // console.log(item);
      }
      // preProduct.push(item);
    });

    // this.setState({
    //   products : preProduct
    // });
  }

  addNote(arr) {
    this.setState({
      chooseProductsBill : arr
    });
  }

  cancelItemBill(data) {
    let arrayPreProduct = [];
    let priceTotal = 0;
    const p3 = new Promise((resolve, reject) => {
      this.state.products.forEach((item, index) => {
        if (item.id == data.id) {
          let checkRemove =  this.state.chooseProductsBill.filter(value => value.id == data.id);
          if (checkRemove && checkRemove.length == 1) {
            item.selectStatus = false;
            let getStoreProducts = JSON.parse(localStorage.getItem('products'));
            if (getStoreProducts && getStoreProducts.find(x => x.id == data.id)) {
              localStorage.setItem('products', JSON.stringify(getStoreProducts.filter(x => x.id != data.id)));
            }
          }
        }
        arrayPreProduct.push(item);
      });
      let chooseProductsBill = this.state.chooseProductsBill.filter(item => item.idUnique != data.idUnique);
      chooseProductsBill.forEach((item, index) => {
        if (item.itemPromotion && item.itemPromotion > 0) {
          priceTotal = priceTotal + (item.donGia - item.itemPromotion) * item.quantum;
        } else {
          priceTotal = priceTotal + (item.donGia * item.quantum);
        }
      });
      let obj = {
        arrayPreProduct: arrayPreProduct,
        chooseProductsBill: chooseProductsBill,
        priceTotal : priceTotal
      }
      resolve(obj);
    });

    Promise.all([p3]).then(values => {
      let data = values[0];
      if (data) {
        this.setState({
          chooseProductsBill: data.chooseProductsBill,
          products: data.arrayPreProduct,
          priceTotal: data.priceTotal
        });
      }
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
  }

  copyProductsBill() {
    this.clearFormOrder();
    let getCopyProducts = JSON.parse(localStorage.getItem('copyProductsBill'));
    let getCopyProductsBill = getCopyProducts.productsBill;
    let productsCurrent = this.state.products;
    if (getCopyProductsBill) {
      getCopyProductsBill.forEach((item, index) => {
        productsCurrent.forEach((item2, index2) => {
          if (item.id == item2.id) {
            productsCurrent[index2].selectStatus = true;

          }
        });
      });
      this.setState({
        products: productsCurrent,
        chooseProductsBill: getCopyProductsBill,
        priceTotal: getCopyProducts.priceTotal ? getCopyProducts.priceTotal : 0
      });
    }
  }

  processOrderTmp(getOrderProcessTmp) {
    this.clearFormOrder();
    let priceTotal = getOrderProcessTmp.priceTotal;
    let productsCurrent = this.state.products;
    if (getOrderProcessTmp) {
      let getCopyProductsBill = getOrderProcessTmp.productsBill ? getOrderProcessTmp.productsBill : [];
      let arrayTmp = [];
      getCopyProductsBill.forEach((item, index) => {
        this.state.products.forEach((item2, index2) => {
          if (item.id == item2.id) {
            productsCurrent[index2].selectStatus = true;
          }
        });
      });

      // if (item.itemPromotion && item.itemPromotion > 0) {
      //   priceTotal = priceTotal + (item.donGia * item.quantum) - item.itemPromotion;
      // } else {
      //   priceTotal = priceTotal + (item.donGia * item.quantum);
      // }
      // console.log(priceTotal);
      // console.log(productsCurrent);

      this.setState({
        products: productsCurrent,
        chooseProductsBill: getCopyProductsBill,
        priceTotal: priceTotal
      }, () => {
        localStorage.removeItem('orderProcessTmp');
      });
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
        <DragScrollProvider>
          {({ onMouseDown, ref }) => (
          <div
            className="item-order-block scrollable"
            ref={ref}
            onMouseDown={onMouseDown}>
              <ul className="item-order-box">
                { this.state.products &&
                  this.state.products.map((item, i) => {
                    return (
                      <Item_Order key = {i} data = {item} chooseProduct = {this.chooseProduct}/>
                    )
                  })
                }
              </ul>
            </div>
          )}
        </DragScrollProvider>
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
          processOrderTmp = {this.processOrderTmp}
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

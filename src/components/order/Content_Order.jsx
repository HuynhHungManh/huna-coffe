import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Order from './Item_Order.jsx';
import Bill_Order from './Bill_Order.jsx';
import {PropTypes} from 'prop-types';
import {Numberic} from 'components/keyboarded';
import {Orders, Promotion, NoteOrder, TotalPromotion} from 'api';
import DragScrollProvider from 'drag-scroll-provider';
import { Offline, Online } from "react-detect-offline";
import Spinner from 'react-spinkit';

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
    this.reloadPromotion = this.reloadPromotion.bind(this);
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
      promotionItems: [],
      autoLoadPromotion: true,
      statusLoadData: true,
      isOffline: false
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
    // this.props.dispatch(Promotion.actions.promotion());
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
    }).catch((error) => {
      this.alertNotification('Server lỗi!', 'error');
    });
    let storeData = JSON.parse(localStorage.getItem('storeData'));
    if (storeData) {
       this.setState({
        statusLoadData: false
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.products !== this.props.products) {
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
      let getOrderProcessTmp = JSON.parse(localStorage.getItem('orderProcessTmp'));
      if (getOrderProcessTmp) {
        this.processOrderTmp(getOrderProcessTmp);
      }
    }
    if (prevProps.promotion !== this.props.promotion) {
      let promotionBill = this.props.promotion.find(item => item.maLoaiKhuyenMai == 'KHUYEN_MAI_HOA_DON' 
        && this.checkPromotionDate(item.tuNgay, item.denNgay) && this.checkPromotionTime(item.tuGio, item.denGio) 
        && item.apDung == true && this.checkPromotionDay(item) && this.state.autoLoadPromotion == true);
      if (promotionBill) {
        this.setState({
          promotionBill: promotionBill.chietKhau
        });
      } else {
        if (this.state.autoLoadPromotion == true) {
          this.setState({
            promotionBill: 0
          });
        }
        let promotionGroup = this.props.promotion.filter(item => item.maLoaiKhuyenMai == 'KHUYEN_MAI_NHOM_MON' 
          && this.checkPromotionDate(item.tuNgay, item.denNgay) && this.checkPromotionTime(item.tuGio, item.denGio) 
          && item.apDung == true && this.checkPromotionDay(item) && this.state.autoLoadPromotion == true);
        let promotionItems = this.props.promotion.filter(item => item.maLoaiKhuyenMai == 'KHUYEN_MAI_MON'
          && this.checkPromotionDate(item.tuNgay, item.denNgay) && this.checkPromotionTime(item.tuGio, item.denGio) 
          && item.apDung == true && this.checkPromotionDay(item) && this.state.autoLoadPromotion == true);
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
    if (prevProps.status !== this.props.status) {
      this.setState({
        autoLoadPromotion: this.props.status
      });
    }
    if (prevProps.statusLoadData !== this.props.statusLoadData) {
      setTimeout(()=> {
        this.setState({
          statusLoadData: this.props.statusLoadData
        });
      }, 1000);
    }
    if (prevProps.checkOffline !== this.props.checkOffline) {
      this.setState({
        isOffline: this.props.checkOffline
      });
    }
  }

  reloadPromotion() {
    if (this.state.isOffline == false) {
      this.props.dispatch(Promotion.actions.promotion());
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

  converTime(time) {
    var timeHM = time.replace(':00', '');
    var timeH = 0;
    var timeM = 0;
    if (timeHM.includes(":00")) {
      timeH = parseInt(timeHM.replace(':00', ''));
      timeM = 0;
    } else {
      timeM = timeHM.split(':')[1];
      timeH = timeHM.split(':')[0];
    }

    return [parseInt(timeH), parseInt(timeM)];
  }

  checkPromotionTime(timeStart, timeEnd) {
    var timeStartCov = 0;
    var timeEndCov = 24;
    var timeStartMCov = 0;
    var timeEndMCov = 60;
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var timeStartHM = this.converTime(timeStart);
    var timeEndHM = this.converTime(timeEnd);

    if (timeStartHM && timeStartHM != null) {
      timeStartCov = timeStartHM[0];
      timeStartMCov = timeStartHM[1];
    }
    if (timeEndHM && timeEndHM != null) {
      timeEndCov = timeEndHM[0];
      timeEndMCov = timeEndHM[1];
    }


    if (timeStartCov <= 17) {
      timeStartCov = timeStartCov + 7;
    } else {
      timeStartCov = timeStartCov - 17;
    }

    if (timeEndCov <= 17) {
      timeEndCov = timeEndCov + 7;
    } else {
      timeEndCov = timeEndCov - 17;
    }
    if (timeStartCov > timeEndCov) {
      return false
    }

    if (timeStartMCov == 0 && timeEndMCov == 0 && timeStartCov <= hour && timeEndCov > hour) {
      return true;
    } 
    else if (timeStartMCov != 0 && timeEndMCov != 0 && timeStartCov <= hour && timeEndCov >= hour) {
      if (timeStartCov == hour && minute < timeStartMCov) {
        return false;
      }
      if (timeEndCov == hour && minute > timeEndMCov) {
        return false;
      }
      return true;
    }
    else if (timeStartMCov == 0 && timeEndMCov != 0 && timeStartCov <= hour && timeEndCov >= hour) {
      if (timeEndCov == hour && minute > timeEndMCov) {
        return false;
      }
      return true;
    }
    else if (timeStartMCov != 0 && timeEndMCov == 0 && timeStartCov <= hour && timeEndCov > hour) {
      if (timeStartCov == hour && minute < timeStartMCov) {
        return false;
      }

      return true;
    }
    return false
  }

  checkPromotionDay(item) {
    var today = new Date();
    var day = today.getDay();
    if (item.thuHai == true && day == 1) {
      return true;
    } else if (item.thuBa == true && day == 2) {
      return true;
    } else if (item.thuTu == true && day == 3) {
      return true;
    } else if (item.thuNam == true && day == 4) {
      return true;
    } else if (item.thuSau == true && day == 5) {
      return true;
    } else if (item.thuBay == true && day == 6) {
      return true;
    } else if (item.chuNhat == true && day == 0) {
      return true;
    } else {
      return false;
    }
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
            arrTmp.push(itemState);
          });

          this.setState({
            chooseProductsBill : this.promotionCheck(arrTmp)
          });
        } else {
          let newItem = {...item ? item : ''};
          newItem.idUnique = this.getMax(chooseProductsBillState) + 1;
          let priceTotal = 0;
          if (this.state.chooseProductsBill.length == 0) {
            priceTotal = newItem.donGia;
          } else {
  
          }
          this.setState(prevState => ({
            chooseProductsBill: this.promotionCheck([...prevState.chooseProductsBill, newItem])
          }));
        }
        item.selectStatus = true;
        this.state.products[index].selectStatus = true;
      }
    });
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
      productsBillPre.push(item);
    });
    this.setState({
      chooseProductsBill : productsBillPre
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
        chooseProductsBill: getCopyProductsBill
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
      this.setState({
        products: productsCurrent,
        chooseProductsBill: getCopyProductsBill
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
                {
                  this.props.statusLoadData == true
                  ?
                  <Spinner name="line-scale" />
                  :
                  <ul className="item-order-box">
                      { this.state.products &&
                        this.state.products.map((item, i) => {
                          return (
                            <Item_Order key = {i} data = {item} chooseProduct = {this.chooseProduct}/>
                          )
                        })
                      }
                  </ul>
                }
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
          reloadPromotion = {this.reloadPromotion}
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
    promotion: state.promotion,
    status: state.status,
    statusLoadData: state.statusLoadData,
    checkOffline: state.checkOffline
  }
}

export default connect(bindStateToProps)(Content_Order);

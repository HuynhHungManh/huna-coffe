import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Bill from './Item_Bill.jsx';
import {Orders, Promotion} from 'api';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
Modal.setAppElement('body');
import  MultiSelectReact  from 'multi-select-react';
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import ComponentToPrint from '../tableTemporaryBill/ComponentToPrint.jsx';
import ReactToPrint from 'react-to-print';
import NumPad from 'react-numpad';
import jsxToString from 'jsx-to-string';
import ReactDOMServer from 'react-dom/server';
import { render } from 'jsx-to-html';
import DragScrollProvider from 'drag-scroll-provider';

class Bill_Order extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChangePromotion = this.handleChangePromotion.bind(this);
    this.openModel = this.openModel.bind(this);
    this.chooseItemProduct = this.chooseItemProduct.bind(this);
    this.cancelItemBill = this.cancelItemBill.bind(this);
    this.updateQuantum = this.updateQuantum.bind(this);
    let currentdate = new Date();
    let datetime = ('0' + currentdate.getDate()).slice(-2) + '/'
                 + ('0' + (currentdate.getMonth()+1)).slice(-2) + '/'
                 + currentdate.getFullYear();
    var down = false;
    var scrollLeft = 0;
    var x = 0;
    this.state = {
      productsBill: [],
      priceTotal: 0,
      discountPriceTotal: 0,
      discountAfter: 0,
      dateOrder: datetime,
      date: new Date(),
      dateCopy: new Date(),
      statusPopup: false,
      statusCopyPreBill: false,
      cbDiscount: false,
      itemNote: [],
      noteQuantum: 0,
      noteName: '',
      outlay: 0,
      idNoteCurrent: 0,
      promotion: 0,
      notePrice: 0,
      itemNoteTmp: [],
      dropdown_tmp: 1,
      discountInput: '',
      promotionGroup: 0,
      promotionGroupId: [],
      promotionItems: [],
      promotionBill: 0,
      multiSelected: [],
      isPromotionTypeBill: false,
      numberTable: 0,
      peopleSelect: [],
      nameModel: 'addInfo',
      typePayment: 'cash',
      typePaymentTmp: [],
      paymentTmp: 0,
      numberAcc: [{
        label: 'Tài khoản Admin',
        id: 1
      }],
      numberAccTransfer: [{
        label: 'Tài khoản Admin',
        id: 1
      }],
      numberAccSelected: 0 ,
      orderDetail: [],
      inputPayment: 0,
      customerPayment: 0,
      typePaymentShow: '',
      outlayBack: 0,
      codeOrder: '',
      afterDiscount: 0,
      priceAfterPromotion: 0,
      discount: 0
    }
  }

  componentWillMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    // localStorage.removeItem('productsBill');
    this.props.dispatch(Promotion.actions.peolePromotion()).then((res) => {
      if (res.data && res.data.content) {
        let data = [];
        res.data.content.forEach((item, index) => {
          data.push({
            id: item.id,
            label : item.hoVaTen
          });
        });
        this.setState({
          peopleSelect: data
        });
      }
    });

    this.getCode(this.props.countCode);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  getCode(code) {
    let date = new Date();
    let dateCode = date.getDate();
    let monthCode = date.getMonth()+1;
    if ((date.getMonth()+1) < 10) {
      monthCode = '0'+(date.getMonth()+1)
    }
    if (date.getDate() < 10) {
      dateCode = '0'+date.getDate();
    }
    let codeOrder = 'M01.'+date.getFullYear()+monthCode+dateCode+code;
    this.setState({
      codeOrder: codeOrder
    });
  }

  // toTimestamp(strDate){
  //   var datum = Date.parse(strDate);
  //   return datum/1000;
  // }

  // checkPromotionDate(startDateParams, endDateParams) {
  //   let startDate = this.toTimestamp(startDateParams);
  //   let endDate = this.toTimestamp(endDateParams);
  //   let today = Math.round(+new Date()/1000);
  //   if (startDate <= today && today <= endDate) {
  //     return true;
  //   }
  //   return false;
  // }

  templatePrint(data, auth) {
    let info = {
      phone : '0935080123',
      cashier: auth.hoVaTen,
      codeOrder: data.ma,
      dateOrder: this.state.dateOrder,
      timePrint: this.getDate(data.ngayOrder),
      passWifi: 'hunacoffee.com'
    };
    return (
      <ComponentToPrint data = {data} auth = {auth} info = {info}/>
    );
  }

  getDate(jsonDate) {
    let d = new Date(jsonDate);
    let hour = (d.getHours() < 10 ? '0' : '') + d.getHours();
    let minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();

    return hours + ":" + minutes;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.promotionBill !== this.props.promotionBill) {
      this.setState({
        promotionBill: this.props.promotionBill
      });
    }
    if (prevState.promotionBill !== this.state.promotionBill) {
      let pricePromotion = 0;
      let priceAfterPromotion = (this.state.promotionBill == 0)
          ? (this.props.priceTotal - pricePromotion) 
          : (this.props.priceTotal - ((this.state.promotionBill * this.props.priceTotal) / 100))
      this.setState({
        priceAfterPromotion: priceAfterPromotion,
        outlayBack: this.state.outlay - priceAfterPromotion,
        inputPayment: priceAfterPromotion
      })
    }
    if (prevProps.priceTotal !== this.props.priceTotal) {
      let pricePromotion = 0;
      if (this.state.promotionBill == 0) {
        this.props.productsBill.forEach((item, index) => {
          if (item.itemPromotion && item.itemPromotion != 0) {
            pricePromotion = pricePromotion + item.itemPromotion;
          }
        });
      } 
      let priceAfterPromotion = (this.state.promotionBill == 0)
          ? (this.props.priceTotal - pricePromotion) 
          : (this.props.priceTotal - ((this.state.promotionBill * this.props.priceTotal) / 100))
      this.setState({
        priceTotal: this.props.priceTotal - pricePromotion,
        priceAfterPromotion: priceAfterPromotion,
        outlayBack: this.state.outlay - priceAfterPromotion,
        inputPayment: priceAfterPromotion
      });
    }

    if (prevState.priceTotal !== this.state.priceTotal) {
      let pricePromotion = 0;
      if (this.state.promotionBill == 0) {
        this.props.productsBill.forEach((item, index) => {
          if (item.itemPromotion && item.itemPromotion != 0) {
            pricePromotion = pricePromotion + item.itemPromotion;
          }
        });
      } 
      let priceAfterPromotion = (this.state.promotionBill == 0)
          ? (this.state.priceTotal - pricePromotion) 
          : (this.state.priceTotal - ((this.state.promotionBill * this.state.priceTotal) / 100))
      this.setState({
        priceTotal: this.state.priceTotal - pricePromotion,
        priceAfterPromotion: priceAfterPromotion,
        outlayBack: this.state.outlay - priceAfterPromotion,
        inputPayment: priceAfterPromotion
      });
    }

    if (prevProps.productsBill !== this.props.productsBill) {
      
      // else {
      //   pricePromotion = (this.props.priceTotal * this.props.promotionBill) / 100;
      // }
      this.setState({
        productsBill: this.props.productsBill,
      })
      // console.log(this.props.productsBill);
      // let productsBill = [];
      // let productsBillTmp = [];
      // let priceTotal = 0;
      // let getChooses = this.props.productsBill.filter(item => item.selectStatus == true);
      // if (getChooses && getChooses.length > 0) {

        // if (this.state.productsBill.length > 0) {
          // let unique = [];
          // let updateQuantum = [];
          // getChooses.forEach((item, index) => {
          //   // console.log(this.state.productsBill);
          //   let test = this.state.productsBill.find(value => value.id == item.id);
          //   if (!test) {
          //     this.state.productsBill.push(item);
          //   } else {
          //     if (!item.itemNote) {
          //       // update quatum
          //     } else {
          //       // console.log(item);
          //       // this.state.productsBill.push(item);
          //     }
          //   }
          // });



          // let productsAfter =[...this.state.productsBill ? this.state.productsBill : []];
          // console.log(...this.state.productsBill);
          // let dupProduct = [];
          // if (updateQuantum && updateQuantum.length > 0) {
          //   productsAfter.concat(updateQuantum);
            // console.log(updateQuantum);
            // let checkNoteItem = updateQuantum.find(itemAfter => (itemAfter.itemNote && itemAfter.itemNote.length > 0));
            // console.log(checkNoteItem);
            // if (!checkNoteItem) {
            //   console.log('1');
            //   console.log(updateQuantum);
            //   console.log(productsAfter);
            //   productsAfter.concat(updateQuantum);
            //   console.log(productsAfter);
            // }
    
            // let countItem = productsAfter.filter(value.id == itemUpdate.id);
            // if (itemUpdate && (!itemUpdate.itemNote && itemUpdate.itemNote == 0)) {

            // }

            // if (!checkNoteEmpty) {
            //   // add new
            //   let countItem = productsAfter.filter(value.id == item.id);
            //   updateQuantum[0].idSame = countItem.length;
            //   productsAfter.concat(updateQuantum);
            //   // console.log(productsAfter);
            // } else {
            //   // update quatum
            // }

            // productsAfter.forEach((item, index) => {
            //   let findUpdate = updateQuantum.filter(value => value.id == item.id);
            //   let sameTmp = productsAfter.find(itemAfter => itemAfter.id == item.id);
            //   if (findUpdate) {
            //     let checkNotNote = findUpdate.find(item => (!item.itemNote || item.itemNote.length == 0));
            //     if (checkNotNote) {
            //       // update quatum
            //       if (!item.itemNote || item.itemNote.length == 0) {
                  
            //         // item.quantum = item.quantum + 1;
            //         // console.log(item);
            //       }
            //     } else if (dupProduct.length == 0 && !item.idSame) {
            //       // add new
            //       // console.log(item);
            //       // this.props.resetItem(item.id);
            //       // let newItem = {...sameTmp ? sameTmp : ''};
            //       // // console.log(newItem);
            //       // newItem.itemNote = [];
            //       // newItem.quantum = 1;
            //       // newItem.priceAndQuantum = newItem.donGia;
            //       // dupProduct.push(newItem);
            //     }
            //   }
            //   // if (findUpdate) {
            //   //   // console.log(findUpdate);
            //   //   let checkNotNote = findUpdate.find(item => (!item.itemNote || item.itemNote.length == 0) && );
            //   //   let checkNotNote = productsAfter.find(item => (!item.itemNote || item.itemNote.length == 0));
            //   //   let checkNoted = productsAfter.find(item => (item.itemNote && item.itemNote.length > 0));
            //   //   if (checkNotNote) {
            //   //     // if (!item.idItemSame) {
            //   //     //   item.idItemSame = index;
            //   //     // }
            //   //     if (!item.itemNote || item.itemNote.length == 0) {
            //   //       // productsAfter[index].quantum = findUpdate.quantum;
            //   //       item.quantum = 1;
            //   //       // item.priceAndQuantum = item.quantum * item.donGia;
            //   //     }
            //   //     item.priceAndQuantum = item.quantum * item.donGia;
            //   //     // console.log(item);
            //   //   } else if (dupProduct.length == 0 && checkNoted) {
            //   //     let newItem = {...checkNoted ? checkNoted : ''};
            //   //     // console.log(newItem);
            //   //     newItem.itemNote = [];
            //   //     newItem.quantum = 1;
            //   //     newItem.priceAndQuantum = newItem.donGia;
            //   //     dupProduct.push(newItem);
            //   //   }
            //   //   if (item.itemPromotion && item.itemPromotion > 0) {
            //   //     // productsAfter[index].priceAndQuantum = productsAfter[index].quantum * (productsAfter[index].donGia - item.itemPromotion);
            //   //   } else {
            //   //     productsAfter[index].priceAndQuantum = productsAfter[index].quantum * productsAfter[index].donGia;
            //   //   }
            //   //   // console.log(productsAfter);
            //   // }
            // });
          // }

          // getChooses = productsAfter.concat(unique);
          // console.log(getChooses);
          // console.log(getChooses);
          // getChooses = getChooses.concat(dupProduct);
          // console.log(getChooses);
        // }
        // console.log(getChooses);
        // getChooses.forEach((item, index) => {
        //   if (this.state.promotionGroup) {
        //     let promotionGroup = this.state.promotionGroup.find(itemPromotion => itemPromotion.loaiThucDonId == item.loaiThucDonId);
        //     if (promotionGroup) {
        //       item.discount = promotionGroup.chietKhau;
        //       item.itemPromotion = (promotionGroup.chietKhau * item.donGia) / 100;
        //       item.priceAndQuantum = (item.donGia - item.itemPromotion) * item.quantum;
        //     } else {
        //       let promotionItem = this.state.promotionItems.find(itemPromotion => itemPromotion.thucDonId == item.id);
        //       if (promotionItem) {
        //         item.discount = promotionItem.chietKhau;
        //         item.itemPromotion = (promotionItem.chietKhau * item.donGia) / 100;
        //         item.priceAndQuantum = (item.donGia - item.itemPromotion) * item.quantum;
        //       }
        //     }
        //   }
        //   priceTotal = priceTotal + item.priceAndQuantum;
        // });

        // let discountInput = this.state.discountInput;
        // let discountInput = this.state.promotionBill;
        // if (discountInput && this.state.isPromotionTypeBill == true) {
        //   // discountInput = 0;
        //   getChooses.forEach((item, index) => {
        //     item.discount = discountInput;
        //   });
        // };

        // let discountPriceTotal = this.state.promotionBill > 0 && this.state.isPromotionTypeBill == true ? (priceTotal * this.state.promotionBill) / 100 : 0;
        // let discountAfter = discountPriceTotal >= 0 && discountPriceTotal <= priceTotal ? priceTotal - discountPriceTotal : 0;
        // this.setState({
        //   inputPayment: discountAfter,
        //   productsBill : getChooses,
        //   priceTotal: priceTotal,
        //   discountPriceTotal: discountPriceTotal,
        //   discountAfter: discountAfter
        // });

      // }
    }

    if (prevProps.noteOrders !== this.props.noteOrders) {
      let arrayTmp = [];
      this.props.noteOrders.map((item) => {
        if (item.id && item.ten) {
          arrayTmp.push({ label: item.ten, id:item.id });
        }
      });
      this.setState({
        multiSelected: arrayTmp
      });
    }
    // if (prevProps.numberTable !== this.props.numberTable) {
    //   numberTable
    //   this.setState({
    //     numberTable: this.props.numberTable
    //   });
    // }
    if (prevProps.countCode !== this.props.countCode) {
      this.getCode(this.props.countCode);
    }
  }

  updateQuantum(idBill, operator) {
    let item = this.state.productsBill.find(x => x.idUnique == idBill);
    if (item) {
      this.props.updateQuantum(idBill, operator, item.itemPromotion);
    }
    
    // let productsBillPre = [];
    // let priceTotal = 0;
    // let tmp = '';
    // let getStoreProducts = JSON.parse(localStorage.getItem('products'));
    // if (getStoreProducts) {
    //   tmp = getStoreProducts.find(x => x.id == idBill);
    // }
    // // console.log(this.state.productsBill);
    // this.state.productsBill.forEach((item, index) => {
    //   if (item.id == idBill) {
    //     if (operator === 'minus' && item.quantum > 1 && tmp) {
    //       item.quantum = item.quantum - 1;
    //     } else if (operator === 'plus') {
    //       if (tmp) {
    //         item.quantum = item.quantum + 1;
    //       }
    //     }
    //     // item.itemNote = this.state.itemNote;
    //   }
    //   let priceAndQuantum = 0;
    //   if (item.itemPromotion && item.itemPromotion > 0) {
    //     // item.priceAndQuantum = (item.priceAndQuantum - item.itemPromotion) * item.quantum;
    //   } else {
    //     // item.priceAndQuantum = item.quantum * item.donGia;
    //   }
    //   priceTotal = priceTotal + item.priceAndQuantum;
    //   productsBillPre.push(item);
    // });
    // let discountInput = this.state.discountInput;
    // if (discountInput == '') {
    //   discountInput = 0;
    // }
    // let discountPriceTotal = discountInput > 0 ? (priceTotal * parseInt(this.state.discountInput, 10)) / 100 : 0;
    // this.setState({
    //   productsBill :  productsBillPre,
    //   priceTotal: priceTotal,
    //   discountPriceTotal: discountPriceTotal,
    //   discountAfter: priceTotal - discountPriceTotal
    // });
  }

  clearForm() {
    let currentdate = new Date();
    let datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear();
    this.props.clearFormOrder();
    this.setState({
      productsBill : [],
      dateOrder: datetime,
      date: new Date(),
      statusCopyPreBill: false,
      typePaymentTmp : [],
      paymentTmp: 0,
      customerPayment: 0,
      numberTable: ' ',
      outlay: ' ',
      outlayBack: ' '
    });
    localStorage.removeItem('productsBill');
    localStorage.removeItem('products');
  }

  submitOrders(typeSubmit) {
    let date = new Date();
    let dateFormat = JSON.parse(JSON.stringify(date));
    let auth = JSON.parse(localStorage.getItem('auth'));
    let orderProducts = [];
    this.state.productsBill.forEach((item, index) => {
      let dataProducts = {
        'donGia': item.donGia,
        'ghiChuMonOrderThucDon': item.itemNote && item.itemNote != 'undefined' ? item.itemNote : [],
        'khuyenMai': item.discount ? item.discount : 0,
        'ngayOrder': dateFormat,
        'soLuong': Number(item.quantum),
        'thanhTien': item.priceAndQuantum,
        'thucDonId': item.id,
        'tongGia': this.state.discountInput && this.state.discountInput.length > 0 ? ((item.priceAndQuantum * this.state.discountInput) / 100) : item.priceAndQuantum,
        'ten': item.ten,
        'chietKhau' : item.discount ? item.discount : 0
      }
      orderProducts.push(dataProducts);
    });
    let payBack = Number(this.state.outlay) - Number(this.state.priceAfterPromotion);
    let payCash = 0;
    let payCard = 0;
    let payTransfer = 0;
    if (this.state.typePaymentTmp && this.state.typePaymentTmp.length > 0) {
      this.state.typePaymentTmp.forEach((item, index) => {
        if (item.type == 'cash') {
          payCash = item.price;
        } else if (item.type == 'card') {
          payCard = item.price;
        } else if (item.type == 'transfer') {
          payTransfer = item.price;
        } 
      });
    } else {
      payCash = Number(this.state.outlay);
    }
    let data = {
      'tienCaThe': payCard,
      'tienChuyenKhoan': payTransfer,
      'ma' : this.state.codeOrder,
      'khuyenMai': this.state.promotionBill ? this.state.promotionBill : 0,
      'ngayOrder': dateFormat,
      'nguoiChietKhauId': this.state.peopleSelect[0].id ? this.state.peopleSelect[0].id : 1,
      'nhanVienOrderId': auth.userId ? auth.userId : 0,
      'orderThucDons': orderProducts,
      'thanhTien': this.state.priceAfterPromotion,
      'tongGia': this.state.priceTotal,
      'trangThaiOrder': 'DA_THANH_TOAN',
      'soBan': this.state.numberTable,
      'tienKhachDua': payCash,
      'tienThoiLai': payBack ? payBack : 0
    };
    this.setState({
      orderDetail: [data]
    });
    this.props.countCodeAfterSubmit();
    if (typeSubmit == "Order") {
      if (payBack < 0) {
        this.alertNotification('Khách chưa đưa tiền hoặc không đủ!', 'warning');
      } else {
        this.props.dispatch(Orders.actions.orders(null, data)).then((res) => {
        this.alertNotification('Bạn đã order thành công!', 'success');
        let d = new Date();
        let hour = (d.getHours() < 10 ? '0' : '') + d.getHours();
        let minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        let timeCopy = hour + ':' + minutes;
        let copyProductsBill = {
          productsBill: this.state.productsBill,
          priceTotal: this.state.priceTotal,
          discountPriceTotal: this.state.discountPriceTotal,
          discountAfter: this.state.priceAfterPromotion,
          dateCopy: timeCopy,
          dateOrder: this.state.dateOrder,
          outlay: this.state.outlay,
          numberTable: this.state.numberTable,
          orderCode: data.ma,
          promotionBill: this.state.promotionBill,
          outlayBack: this.state.outlayBack,
          typePaymentTmp: this.state.typePaymentTmp,
          paymentTmp: this.state.paymentTmp,
          inputPayment: this.state.inputPayment,
          customerPayment: this.state.customerPayment
        }
        localStorage.setItem('copyProductsBill', JSON.stringify(copyProductsBill));
        const mainProcess = window.require("electron").remote.require('./print.js');
        let html = ReactDOMServer.renderToStaticMarkup(this.templatePrint(data, auth));
        let getStorePrinters = JSON.parse(localStorage.getItem('storePrinter'));
        mainProcess.print(html, getStorePrinters, this.logPrinter.bind(this));
        this.clearForm();
        }).catch((reason) => {
          this.alertNotification('Order không thành công!', 'error');
        });
      }
    } else if (typeSubmit == 'Store') {
      let orderListTmp = JSON.parse(localStorage.getItem('orderListTmp'));
      let orderNewListTmp = [];
      data.productsBill = this.state.productsBill;
      data.priceTotal = this.state.priceTotal;
      data.discountPriceTotal = this.state.discountPriceTotal;
      data.discountAfter = this.state.priceAfterPromotion;
      data.dateOrder = this.state.dateOrder;
      data.orderCode = this.state.codeOrder;
      if (orderListTmp) {
        orderNewListTmp = orderListTmp.concat(data);
      } else {
        orderNewListTmp.push(data);
      }
      localStorage.setItem('orderListTmp', JSON.stringify(orderNewListTmp));
      this.props.countCodeAfterSubmit();
      this.alertNotification('Bạn đã lưu thành công!', 'success');
      this.clearForm();
    }
  };

  logPrinter(value) {
    console.log(value);
  }

  copyProductsBill() {
    this.props.copyProductsBill();
    let getCopyProductsBill = JSON.parse(localStorage.getItem('copyProductsBill'));
    if (getCopyProductsBill) {
      this.setState({
        productsBill: getCopyProductsBill.productsBill,
        priceTotal: getCopyProductsBill.priceTotal,
        discountPriceTotal: getCopyProductsBill.discountPriceTotal,
        discountAfter: getCopyProductsBill.priceAfterPromotion,
        dateCopy: getCopyProductsBill.dateCopy,
        dateOrder: getCopyProductsBill.dateOrder,
        statusCopyPreBill: true,
        numberTable: getCopyProductsBill.numberTable,
        outlay: getCopyProductsBill.outlay,
        codeOrder: getCopyProductsBill.orderCode
      });
    }
  }

  setStatusClear(statusClear) {
    return {
      type: 'STATUS_CLEAR_PRODUCTS',
      statusClear
    }
  }

  alertNotification(message, type) {
    let option = {
      position: 'top-right',
      timeout: 3000
    };
    switch (type) {
      case 'info':
        Alert.info(message, option);
        break;
      case 'success':
        Alert.success(message, option);
        break;
      case 'warning':
        Alert.warning(message, option);
        break;
      case 'error':
        Alert.error(message, option);
      default:
          break;
    };
  }

  closeModel() {
    this.setState({
      statusPopup : false
    });
  }

  openModel() {
    this.setState({
      statusPopup : true
    });
  }

  changCbDiscount() {
    if (this.state.cbDiscount !==  this.refs.cb_discount.checked) {
      this.setState({
        cbDiscount : this.refs.cb_discount.checked
      });
    } else if (this.state.cbDiscount == true && this.refs.cb_discount.checked == true ) {
      this.setState({
        cbDiscount : false
      });
    }
  }

  chooseItemProduct(data) {
    this.setState({
      statusPopup : true,
      noteQuantum: data.quantum,
      noteName: data.ten,
      notePrice: data.donGia,
      idNoteCurrent: data.idUnique,
      itemNote: data.itemNote ? data.itemNote : [],
      cbDiscount: data.itemPromotion ? true : false,
      promotion: data.itemPromotion ? data.itemPromotion : 0,
      discount: data.discount ? data.discount : 0,
      itemNoteTmp: data.itemNote ? data.itemNote : [],
      nameModel: 'addInfo'
    });
  }

  cancelItemBill(idUnique, id) {
    this.props.cancelItemBill(idUnique, id);
    // let afterCancel = this.state.productsBill.filter(x => x.id != id);
    // let priceTotal = 0;
    // afterCancel.forEach((item, index) => {
    //   priceTotal = priceTotal + item.priceAndQuantum;
    // });
    // let discountPriceTotal = (priceTotal * parseInt(this.state.discountInput, 10)) / 100;
    // this.setState({
    //   productsBill : afterCancel,
    //   priceTotal: priceTotal,
    //   discountPriceTotal: discountPriceTotal,
    //   discountAfter: priceTotal - discountPriceTotal
    // });
  }

  addNote(id) {
    const noteState = this.state.itemNoteTmp;
    // console.log(noteState);
    let noteFilter = this.state.itemNoteTmp.filter(item => item.id == id);
    let noteFilterCheckEmpty = this.state.itemNoteTmp.find(item => item.ghiChuId == '');
    // console.log(!noteFilterCheckEmpty);
    // console.log(noteFilter);
    // console.log(noteFilterCheckEmpty);
    let idIndex = 0;
    if (noteFilter && noteFilter.length > 0) {
      idIndex = noteFilter.length;
    }
    let arrayTmp = [];
    if (this.props.noteOrders) {
      this.props.noteOrders.map((item) => {
        if (item.id && item.ten) {
          arrayTmp.push({ label: item.ten, id:item.id });
        }
      });
    }
    if (!noteFilterCheckEmpty) {
      let note = [{
        'ghiChuId': '',
        'soLuong': 1,
        'id': id,
        'idIndex' : idIndex,
        'multiSelect' : arrayTmp
      }];
      let tmp = noteState.concat(note);
      this.setState({
        itemNoteTmp: tmp
      });
    } else {
      this.alertNotification('Bạn chưa ghi chú!', 'warning');
    }
  }

  removeNote(id) {
    // const itemNoteTmp = this.state.itemNoteTmp;
    // console.log(itemNoteTmp);
    // if (itemNoteTmp && itemNoteTmp.length > 0) {
    //   itemNoteTmp.splice(index, 1);
    // }
    // console.log(this.state.itemNoteTmp);
    // console.log(id);
    this.setState({
      itemNoteTmp : this.state.itemNoteTmp && this.state.itemNoteTmp.filter(item => item.idIndex != id)
    });
  }

  handleChangeQuantum(key, event) {
    let index_quantum = key;
    let note = this.state.itemNoteTmp;

    if (note && note.length > 0) {
      note.forEach((item, index) => {
        if (index_quantum == index) {
          item.soLuong = Number(event);
        }
      });
      this.setState({
        itemNoteTmp: note
      });
    }
  }

  // test () {
  //   this.setState({
  //     numberTable: ' '
  //   });
  //   console.log(this.state.numberTable);
  // }

  saveUpdateNote(typeModel) {
    if (typeModel == 'addInfo') {
      let productsBill = this.state.productsBill;
      let arrayTmp = [];
      let priceTotal = 0;
      let itemNote = this.state.itemNoteTmp;
      console.log(productsBill);
      productsBill.forEach((item, index) => {
        if (this.state.idNoteCurrent == item.idUnique) {
          item.itemPromotion = this.state.promotion;
          item.discount = this.state.discount;
          let itemNote = this.state.itemNoteTmp;
          // console.log(itemNote);
          itemNote.forEach((item, index) => {
            if (item.ghiChuId == 0) {
              itemNote.splice(index, 1);
            }
            item.soLuong = Number(item.soLuong) > 0 ? Number(item.soLuong) : 1
          });

          item.itemNote = itemNote;
          // if (this.state.promotionGroup) {
          //   let promotionItem = this.state.promotionGroup.find(itemPromotion => itemPromotion.loaiThucDonId == item.categoriesId);
          //   if (promotionItem) {
          //     item.itemPromotion = (promotionItem.chietKhau * this.state.notePrice) / 100;
          //     item.priceAndQuantum = item.priceAndQuantum - (item.itemPromotion * item.quantum);
          //   }
          // } else {
          //   delete item.itemPromotion;
          // }

        }
        if (item.itemPromotion && item.itemPromotion > 0) {
          priceTotal = priceTotal + (item.quantum * (item.donGia - item.itemPromotion));
        } else {
          priceTotal = priceTotal + (item.quantum * item.donGia);
        }
        arrayTmp.push(item);
      });
      // console.log(item.quantum * item.donGia);
      // let discountPriceTotal = (priceTotal * Number(this.state.promotionBill)) / 100;
      this.props.addNote(arrayTmp);
      this.props.changeTotal(priceTotal);

      // this.setState({
      //   priceTotal: priceTotal
      // });
    } else {
      if (this.state.inputPayment == 0 && this.state.customerPayment == this.state.discountAfter) {
        // this.props.changePayment(this.state.discountAfter);
        this.setState({
          outlay: this.state.discountAfter.toString()
        });
      } else if (this.state.inputPayment == 0 && this.state.customerPayment > this.state.discountAfter) { 
        // this.props.changePayment(this.state.customerPayment);
          this.setState({
            outlay: this.state.customerPayment.toString(),
            outlayBack: (Number(this.state.customerPayment) - Number(this.state.discountAfter)).toString()
          });
      } else {
        this.setState({
          outlay: this.state.customerPayment.toString(),
          outlayBack: (this.state.customerPayment - this.state.discountAfter).toString()
        });
      }
      if (this.state.typePaymentTmp && this.state.typePaymentTmp.length > 0) {
        let arrayTmp = [];
        this.state.typePaymentTmp.forEach((item, index) => {
          if (item.type == 'cash') {
            arrayTmp.push('Tiền mặt');
          } else if (item.type == 'card') {
            arrayTmp.push('Thẻ');
          } else if (item.type == 'transfer') {
            arrayTmp.push('Chuyển khoản');
          }
        });
        if (arrayTmp.length > 0) {
          this.setState({
            typePaymentShow: arrayTmp.join(', '),
            typePaymentTmpStore: this.state.typePaymentTmp
          });
        }
      }
      // if (this.state.typePaymentTmp == 'cash') {
      //   this.props.changePayment(this.state.paymentTmp);
      //   this.setState({
      //     typePayment : this.state.typePaymentTmp
      //   });
      //   this.closeModel();
      // } else if (this.state.typePaymentTmp == 'card') {
      //   let chooseAcc = this.state.numberAcc.find(item => item.value == true);
      //   if (chooseAcc) {
      //     this.props.changePayment(this.state.paymentTmp);
      //     this.setState({
      //       typePayment : this.state.typePaymentTmp
      //     });
      //     this.closeModel();
      //   } else {
      //     this.alertNotification('Bạn chưa chọn tài khoản người nhận!', 'warning');
      //   }
      // } else if (this.state.typePaymentTmp == '') {
      //   this.props.changePayment(this.state.paymentTmp);
      //   this.setState({
      //     typePayment : this.state.typePaymentTmp
      //   });
      //   this.closeModel();
      // }
    }
    this.closeModel();
  }

  optionClicked(optionsList) {
    let note = this.state.itemNoteTmp;
    let multiSelected = optionsList.filter(item => item.value == true);
    let idNote = [];
    let arrayTmp = [];
    optionsList.forEach((item, index) => {
      if (item.value == true) {
        idNote.push(item.id);
      }
    });
    note.forEach((item, index) => {
      if (this.state.idNoteCurrent == item.id && idNote.length > 0) {
        item.ghiChuId = idNote.join(';'),
        item.multiSelect = optionsList;
      }
      arrayTmp.push(item);
    });
    this.setState({
      itemNoteTmp: arrayTmp
    });
  }

  selectedBadgeClicked(callback, indexSelect, optionsList) {
    let note = this.state.itemNoteTmp;
    let multiSelected = optionsList.filter(item => item.value == true);
    let idNote = [];
    let arrayTmp = [];
    optionsList.forEach((item, index) => {
      if (item.value == true) {
        idNote.push(item.id);
      }
    });
    if (note && note.length > 0) {
      note.forEach((item, index) => {
        if (indexSelect == item.idIndex && idNote.length > 0) {
          item.ghiChuId = idNote.join(';'),
          item.multiSelect = optionsList;
        }
        arrayTmp.push(item);
      });
    }
    
    this.setState({
      itemNoteTmp: arrayTmp
    });
  }

  optionClickedSingle(optionsList) {
    this.setState({ peopleSelect: optionsList });
  }
  selectedBadgeClickedSingle(optionsList) {
    this.setState({ peopleSelect: optionsList });
  }

  optionClickedSingleNumberAcc(optionsList) {
    this.setState({ numberAcc: optionsList });
  }
  selectedBadgeClickedSingleNumberAcc(optionsList) {
    this.setState({ numberAcc: optionsList });
  }

  optionClickedSingleNumberAccTransfer(optionsList) {
    this.setState({ numberAccTransfer: optionsList });
  }
  selectedBadgeClickedSingleNumberAccTransfer(optionsList) {
    this.setState({ numberAccTransfer: optionsList });
  }

  showFormChart() {
    if (!this.state.productsBill || this.state.productsBill && this.state.productsBill.length == 0) {
      this.alertNotification('Bạn chưa order món!', 'warning');
    } else {
      this.setState({
      nameModel: 'chart',
        statusPopup: true
      });
    }
  }

  handlePayment(type) {
    this.state.typePayment()
    this.setState({
      typePayment: []
    });
  }

  changePayment(type, price) {
    let arrType = this.state.typePaymentTmp ? this.state.typePaymentTmp : [];
    let isChoose = arrType.find(item => item.type == type);
    let arrayChoose = arrType.filter(item => item.type != type);
    let priceTotal = 0;
    arrayChoose.forEach((item, index) => {
      priceTotal = priceTotal + item.price;
    });
    if (!isChoose && Number(this.state.inputPayment) != 0) {
      let inputPayment = 0;
      let customerPayment = 0;
      if (this.state.priceAfterPromotion >= (Number(price) + priceTotal)) {
        inputPayment = this.state.priceAfterPromotion - (Number(price) + priceTotal);
        customerPayment = Number(price) + priceTotal;
      } else {
        customerPayment = Number(price) + this.state.customerPayment;
        price = this.state.priceAfterPromotion - priceTotal;
      }
      arrType.push({
        type: type,
        price: Number(price)
      });

      this.setState({
        typePaymentTmp : arrType,
        paymentTmp: this.state.priceAfterPromotion,
        inputPayment: inputPayment.toString(),
        customerPayment: customerPayment
      });
    }
  }

  handleChangePayment(e) {
    this.setState({
      inputPayment: Number(e.target.value),
    });
  }

  removePayment(type) {
    let filterChoosed = this.state.typePaymentTmp.filter(item => item.type != type);
    let priceTotal = 0;
    filterChoosed.forEach((item, index) => {
      priceTotal = priceTotal + item.price;
    });
    this.setState({
      typePaymentTmp: filterChoosed ? filterChoosed : [],
      paymentTmp: 0,
      inputPayment: (this.state.priceAfterPromotion - priceTotal).toString(),
      customerPayment: priceTotal
    });
  }

  handleNumberTable(e) {
    this.setState({
      numberTable: Number(e)
    });
  }

  handlePromotion(e) {
    if (e == ' ') {
      e = 0;
    }
    let discountPriceTotal = (Number(e) * this.state.priceTotal) / 100;
    this.setState({
      promotionBill: Number(e),
      discountPriceTotal: discountPriceTotal,
      discountAfter: this.state.priceTotal - discountPriceTotal
    });
  }

  handleOutlay(e) {
    // let discountPriceTotal = (Number(e) * this.state.priceTotal) / 100;
    this.setState({
      outlay: Number(e),
      outlayBack: Number(e) - this.state.priceAfterPromotion
    });
  }

  handlePayment(e) {
    this.setState({
      inputPayment: Number(e)
    });
  }

   validatePromotion(e) {
    if (Number(e) > 99 || Number(e) < 0) {
      return false;
    }
    return true;
  }

  validateNumberTable(e) {
    if (Number(e) > 99 || Number(e) < 0) {
      return false;
    }
    return true;
  }

  handleChangePromotion(e) {
    this.setState({
      discount: Number(e),
      promotion: (this.state.notePrice * Number(e)) / 100
    });
  }

  displayOutput(e) {
    return  (Number(e)*100).toFixed(3);
  }

  render() {
    let cashPaymentData = this.state.typePaymentTmp.find(item => item.type  == 'cash');
    let cardPaymentData = this.state.typePaymentTmp.find(item => item.type  == 'card');
    let transferPaymentData = this.state.typePaymentTmp.find(item => item.type  == 'transfer'); 
    return(
      <div className="bill-order-block">
        <div className="bill-box">
          <div className="bill-header">
            <div className="left-header">
              <p className="title-bill">
                Hóa Đơn Bán Hàng
              </p>
              <p className="number-bill">
                Số:<span className="number"> {this.state.codeOrder ? this.state.codeOrder : ''}</span>
              </p>
              <p className="date-bill">
                Thời gian: {this.state.dateOrder}
                <span className="time-bill">
                  { this.state.statusCopyPreBill == true
                    ? this.state.dateCopy
                    : this.state.date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}).replace(/(:\d{2}| [AP]M)$/, "")
                  }
                </span>
              </p>
            </div>
            <div className="right-header">
              <button className="btn-copy-bill" onClick={this.copyProductsBill.bind(this)}>
                Copy hóa đơn trước
              </button>
              <div className="table-box-block">
                <p className="number-table-text">
                  Bàn số:
                </p>
                <NumPad.Number
                  onChange={this.handleNumberTable.bind(this)}
                  value={this.state.numberTable}
                  negative={false}
                  decimal={false}
                  keyValidator={this.validateNumberTable.bind(this)}
                  sync= {true}
                  inline= {true}
                  position={'center'}
                />
              </div>
            </div>
            <div className="people-promotion-header">
              <div className="title-header">
                Người chiết khấu :
              </div>
              <div className="combobox-header">
                <MultiSelectReact 
                  options={this.state.peopleSelect}
                  optionClicked={this.optionClickedSingle.bind(this)}
                  selectedBadgeClicked={this.selectedBadgeClickedSingle.bind(this)}
                  isSingleSelect={true} />
              </div>
            </div>
          </div>
          <div className="bill-content">
            <div className="bill-title">
              <p className="bill-item">Mặt hàng</p>
              <p className="bill-price">Đơn giá</p>
              <p className="bill-quatium">Số lượng</p>
              <p className="bill-total">Tổng tiền</p>
            </div>
            <DragScrollProvider>
              {({ onMouseDown, ref }) => (
                <div
                  className="bill-calculate scrollable"
                  ref={ref}
                  onMouseDown={onMouseDown}>
                  { this.state.productsBill && this.state.productsBill.length > 0 ?
                    this.state.productsBill.map((item, i) => {
                      return (
                        <Item_Bill key = {i} data = {item}
                          cancelItemBill = {this.cancelItemBill}
                          productsBill = {this.state.productsBill}
                          updateQuantum = {this.updateQuantum}
                          openModel={this.openModel}
                          chooseItemProduct = {this.chooseItemProduct}
                          itemNote = {item.itemNote}
                          noteOrders = {this.props.noteOrders}
                          discount = {this.state.discount}
                        />
                      )
                    })
                    : ""
                  }
                </div>
              )}
            </DragScrollProvider>
          </div>
          <div className="bill-results">
            <div className="calculate-tmp">
              <p className="text">Tạm tính</p>
              <p className="text-results">
                <NumberFormat value={this.state.priceTotal} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
               </p>
            </div>
            <div className="discount">
              <p className="text">Chiết khấu</p>
              <NumPad.Number
                onChange={this.handlePromotion.bind(this)}
                value={this.state.promotionBill.toString()}
                decimal={false}
                keyValidator={this.validatePromotion.bind(this)}
                sync= {true}
                inline= {true}
                position={'center'}
              />
              <span className="percent">%</span>
              <div className="bg-discount">
                <p className="discount-text">
                {this.state.promotionBill && this.state.promotionBill > 0 ?
                  <NumberFormat value={Number(((this.state.promotionBill * this.state.priceTotal)/100).toFixed(3))} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                  : ""
                }
                </p>
              </div>
            </div>
            <div className="discount-after">
              <p className="text">Sau chiết khấu</p>
              <p className="text-results">
              <NumberFormat value={Number(this.state.priceAfterPromotion.toFixed(3))} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
              </p>
            </div>
            <div className="outlay">
              <p className="text " onClick={this.showFormChart.bind(this)}>
                <span className={classnames('icon-credit-card', {
                  'hidden' : !this.state.productsBill || this.state.productsBill && this.state.productsBill.length == 0
                })}
                >
                </span>
                Tiền khách đưa
                <span className="type-payment-show">
                (
                  { this.state.typePaymentShow && this.state.typePaymentShow != '' ? 
                    this.state.typePaymentShow
                    : 'Tiền mặt'
                  }
                )
                </span>
              </p>
              <div className={ 
                classnames('outlay-box', {
                  'display-outlay' : Number(this.state.priceAfterPromotion) == 0
                })}
              >
                <NumPad.Number
                  onChange={this.handleOutlay.bind(this)}
                  value={this.state.outlay}
                  sync = {false}
                  inline= {true}
                  position={'center'}
                  displayRule={this.displayOutput.bind(this)}
                />
              </div>

            </div>
            <div className="exchange">
              <p className="text">Tiền thối lại</p>
              <p className="text-results">
                { this.state.outlay && this.state.outlay > 0 
                  ? <NumberFormat value={this.state.outlayBack != 0 ? this.state.outlayBack : 0} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                  : ""
                }
              </p>
            </div>
          </div>
          <div className="bill-footer">
            <button className="fill-again btn-active" onClick={this.clearForm.bind(this)}>
              Nhập lại
            </button>
            <button id="check" className="save btn-active" onClick={this.submitOrders.bind(this, 'Store')}>
              Lưu
            </button>
            <button className="pay btn-active" onClick={this.submitOrders.bind(this, 'Order')} >
              Thanh toán
            </button>
          </div>
        </div>
        <Modal
          isOpen={this.state.statusPopup}
          contentLabel="Modal"
          className="modal popup info-plus"
        >
          <div className={
            classnames('info-plus-block', {
              'payment-block' : this.state.nameModel == 'chart',
            })}
          >
            <div className="header-info-plus">
              <p className="text-title">{this.state.nameModel == 'addInfo' ? 'Thông tin thêm' : 'Thanh toán'}</p>
              <p className="close-model icon-cross" onClick={this.closeModel.bind(this)}></p>
              { this.state.nameModel == 'addInfo' &&
                <p className="name-product-info">{this.state.noteQuantum} x {this.state.noteName}</p>
              }
            </div>
            { this.state.nameModel == 'addInfo' &&
              <div className="content-info-plus">
                <div className="checkbox-block">
                  <div className = {
                    classnames('checkbox-block-header', {
                      'padding-header' : !this.state.cbDiscount,
                    })}
                  >
                    <div className="checkbox-block-left">
                      <input type="checkbox" onChange={this.changCbDiscount.bind(this)} className= {
                        classnames('checkbox-inp-block discount', {
                          'cb-active icon-checkmark' : this.state.cbDiscount,
                        })}           
                        name="discount" defaultChecked={this.state.cbDiscount} ref="cb_discount" />
                    </div>
                    <div className="text-discount-right">
                      <p className="checkbox-discount-text">
                        Giảm giá?
                      </p>
                    </div>
                  </div>
                  {
                    this.state.cbDiscount == true
                    ?
                    <div>
                      <div className="item-block-info-discount">
                        <div className="title-item-discount">
                          <div className="title-item-left-discount">Phần trăm</div>
                          <div className="title-item-right-discount">Số tiền khuyến mãi giảm giá</div>
                        </div>
                      </div>
                      <div className="item-info-discount">
                        <div className="checkbox-item-discount">
                          <NumPad.Number
                            onChange={this.handleChangePromotion.bind(this)}
                            keyValidator={this.validateNumberTable.bind(this)}
                            value={this.state.discount.toString()}
                            sync = {false}
                            inline= {true}
                          />
                        </div>
                        <div className="input-item">
                          <NumberFormat
                            className="inp-price-discount-text"
                            value= {this.state.promotion > 0 ? this.state.promotion : 0}
                            type="text"
                            thousandSeparator={true}
                          />
                          <span className="text-price-discount">đ</span>
                        </div>
                      </div>
                    </div>
                    :
                    ""
                  }
                </div>
                <div className="content-item-info">
                  <div className="text-note-info">
                    Ghi chú
                  </div>
                  <div className= {
                    classnames('item-block-info', {
                      'item-block-info-scroll' : this.state.itemNote && this.state.itemNote.length > 2,
                    })}
                  >
                    {
                      this.state.itemNoteTmp.map((item, i) => {
                        return (
                          <div className="item-note-box" key = {i}>
                            <div className="title-item">
                              <div className="title-item-left">Số lượng</div>
                              <div className="title-item-right">Loại ghi chú</div>
                            </div>
                            <div className="item-info">
                              <div className="checkbox-item">                               
                                <NumPad.Number
                                  onChange={this.handleChangeQuantum.bind(this, i)}
                                  value={item.soLuong}
                                  negative={false}
                                  decimal={false}
                                  keyValidator={this.validateNumberTable.bind(this)}
                                  sync= {true}
                                  inline= {true}
                                />
                              </div>
                              <div className="input-item">
                                <MultiSelectReact 
                                  className="checkbox-inp-block dropdown-discount"
                                  options={item.multiSelect}
                                  optionClicked={this.optionClicked.bind(this, this, i)}
                                  selectedBadgeClicked={this.selectedBadgeClicked.bind(this, this, i)}
                                />
                                <span className="input-item-icon icon-bin" onClick={this.removeNote.bind(this, item.idIndex)}></span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="add-new-item-info">
                    <p className="add-new-item-info-text" onClick={this.addNote.bind(this, this.state.idNoteCurrent)}>
                      + Thêm ghi chú
                    </p>
                  </div>
                </div>
              </div>
            }
            { this.state.nameModel == 'chart' &&
              <div className="payment-content">
                <div className="total-bill-block">
                  <p className="title-total-bill-block">Thanh toán</p>
                  <p className="price-total-bill-block">  
                    <NumPad.Number
                      onChange={this.handlePayment.bind(this)}
                      value={this.state.inputPayment}
                    />
                  </p>
                </div>
                <div className="button-block">
                  <button className= {
                    classnames('btn', {
                      'choose' : cashPaymentData
                    })}
                    onClick={this.changePayment.bind(this, 'cash', this.state.inputPayment)}
                  >
                    Tiền Mặt
                  </button>
                  <button className= {
                    classnames('btn', {
                      'choose' : cardPaymentData
                    })}
                    onClick={this.changePayment.bind(this, 'card', this.state.inputPayment)}
                  >
                    Thẻ
                  </button>
                  <button className={
                    classnames('btn', {
                      'choose' : transferPaymentData
                    })}
                    onClick={this.changePayment.bind(this, 'transfer', this.state.inputPayment)}
                  >
                    Chuyển Khoản
                  </button>
                </div>
                <div className="detail-payment-block">
                  <div className="need-payment-block">
                    <p className="title">Tiền cần trả</p>
                    <p className="price">
                      <NumberFormat value={Number((this.state.discountAfter).toFixed(3))} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                    </p>
                  </div>
                  { cashPaymentData ?
                    <div className="customer-payment-block">
                        <p className="title"><span className="icon-cross" onClick={this.removePayment.bind(this, 'cash')}></span>Tiền mặt</p>
                        <p className="price">
                          <NumberFormat value={cashPaymentData.price} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                        </p>
                    </div>
                    :
                    ""
                  }
                  { cardPaymentData ? 
                    <div className="customer-card-block">
                        <p className="title"><span className="icon-cross" onClick={this.removePayment.bind(this, 'card')}></span>Thẻ</p>
                        <div className="select-number-account">
                          <MultiSelectReact 
                            options={this.state.numberAcc}
                            optionClicked={this.optionClickedSingleNumberAcc.bind(this)}
                            selectedBadgeClicked={this.selectedBadgeClickedSingleNumberAcc.bind(this)}
                            isSingleSelect={true} />
                        </div>
                        <p className="price">
                          <NumberFormat value={cardPaymentData.price} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                        </p>
                    </div>
                    :
                    ""
                  }
                  { transferPaymentData ? 
                    <div className="customer-card-block">
                        <p className="title"><span className="icon-cross" onClick={this.removePayment.bind(this, 'transfer')}></span>Chuyển khoản</p>
                        <div className="select-number-account">
                          <MultiSelectReact 
                            options={this.state.numberAccTransfer}
                            optionClicked={this.optionClickedSingleNumberAccTransfer.bind(this)}
                            selectedBadgeClicked={this.selectedBadgeClickedSingleNumberAccTransfer.bind(this)}
                            isSingleSelect={true} />
                        </div>
                        <p className="price">
                          <NumberFormat value={transferPaymentData.price} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                        </p>
                    </div>
                    :
                    ""
                  }
                  <div className="customer-payout-block">
                    <p className="title">Khách thanh toán</p>
                    <p className="price">
                      <NumberFormat value={this.state.customerPayment} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                    </p>
                  </div>
                </div>
              </div>
            }
            <div className="footer-info-plus">
              <button className="btn close-add-info" onClick={this.closeModel.bind(this)}>
                Đóng
              </button>
              <button className="btn save-update-info" onClick={this.saveUpdateNote.bind(this, this.state.nameModel)}>
                { this.state.nameModel == 'addInfo' &&
                  'Lưu cập nhập'
                }
                { this.state.nameModel == 'chart' &&
                  'Xong'
                }
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    promotion: state.promotion,
    noteOrders: state.noteOrders
  }
}

export default connect(bindStateToProps)(Bill_Order);

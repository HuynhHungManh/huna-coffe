import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Bill from './Item_Bill.jsx';
import {Orders, Promotion, GetCode, TotalPromotion, NoteOrder} from 'api';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
Modal.setAppElement('body');
import  MultiSelectReact  from 'multi-select-react';
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import ComponentToPrint from '../tableTemporaryBill/ComponentToPrint.jsx';
import PrintToCook from '../tableTemporaryBill/PrintToCook.jsx';
import ReactToPrint from 'react-to-print';
import NumPad from 'react-numpad';
import jsxToString from 'jsx-to-string';
import ReactDOMServer from 'react-dom/server';
import { render } from 'jsx-to-html';
import DragScrollProvider from 'drag-scroll-provider';
import {PropTypes} from 'prop-types';

class Bill_Order extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChangePromotion = this.handleChangePromotion.bind(this);
    this.openModel = this.openModel.bind(this);
    this.chooseItemProduct = this.chooseItemProduct.bind(this);
    this.cancelItemBill = this.cancelItemBill.bind(this);
    this.updateQuantum = this.updateQuantum.bind(this);
    this.processOrderTmp = this.processOrderTmp.bind(this);
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
      discount: 0,
      isCheckedTakeAWay: false,
      isHide: false,
      isOffline: false,
      setCode: 0
    }
  }

  componentWillMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    this.timerCallPromotion = setInterval(
      () => this.props.reloadPromotion(),
      60 * 1000
    );
    let getOrderProcessTmp = JSON.parse(localStorage.getItem('orderProcessTmp'));
    this.getCode(false);
  
    if (getOrderProcessTmp) {
      this.processOrderTmp(getOrderProcessTmp);
    } else {
        let data = [];
        this.props.dispatch(Promotion.actions.peolePromotion()).then((res) => {
          if (res.data && res.data.content) {
            res.data.content.forEach((item, index) => {
              if (item.active == true && item.block == false && item.deleted == false) {
                data.push({
                  id : item.id,
                  label : item.hoVaTen
                });
              }
            });

            this.setState({
              peopleSelect: data
            });
          }
        }).catch((error) => {
        let storeData = JSON.parse(localStorage.getItem('storeData'));
        let peolePromotion = storeData.data.peolePromotion;
        const promise = new Promise((resolve, reject) => {
          let obj = {};
          peolePromotion.forEach((item, index) => {
            if (item.active == true && item.block == false && item.deleted == false) {
              data.push({
                id : item.id,
                label : item.hoVaTen
              });
            }
          });
          resolve({data: data});
        });
        Promise.all([promise]).then(values => {
          let data = values[0];
          this.setState({
            peopleSelect: data.data
          });
        });
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.timerCallPromotion);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  processOrderTmp(getOrderProcessTmp) {
    let cash = getOrderProcessTmp.tienKhachDua;
    let card = getOrderProcessTmp.tienCaThe;
    let transfer = getOrderProcessTmp.tienChuyenKhoan;
    if (getOrderProcessTmp) {
      this.setState({
        discountPriceTotal: getOrderProcessTmp.discountPriceTotal ? getOrderProcessTmp.discountPriceTotal : 0,
        discountAfter: getOrderProcessTmp.discountAfter ? getOrderProcessTmp.discountAfter : 0,
        dateOrder: getOrderProcessTmp.dateOrder ? getOrderProcessTmp.dateOrder : 0,
        numberTable: getOrderProcessTmp.soBan ? getOrderProcessTmp.soBan : ' ',
        outlay: card + cash + transfer,
        isCheckedTakeAWay: getOrderProcessTmp.isCheckedTakeAWay ? getOrderProcessTmp.isCheckedTakeAWay : false,
        outlayBack: getOrderProcessTmp.tienThoiLai ? getOrderProcessTmp.tienThoiLai : 0,
        peopleSelect: getOrderProcessTmp.peopleSelect ? getOrderProcessTmp.peopleSelect : []
      });
    }
  }

  templatePrint(data, auth, type) {
    let infoApp = JSON.parse(localStorage.getItem('infoApp'));
    let info = {
      phone : (infoApp && infoApp.soDienThoai) ? infoApp.soDienThoai : '',
      cashier: auth.hoVaTen,
      codeOrder: data.ma,
      dateOrder: this.state.dateOrder,
      timePrint: this.getDate(data.ngayOrder),
      passWifi: (infoApp && infoApp.passWifi) ? infoApp.passWifi : ''
    };

    if (type == 'bill') {
      return (
        <ComponentToPrint data = {data} auth = {auth} info = {info} type={'bill'}/>
      );
    } else if (type == 'cooker') {
      return (
        <PrintToCook data = {data} auth = {auth} info = {info} type={'cooker'}/>
      );
    } else if (type == 'bar') {
      return (
        <PrintToCook data = {data} auth = {auth} info = {info} type={'bar'}/>
      );
    }
  }

  getDate(jsonDate) {
    let d = new Date(jsonDate);
    let hours = (d.getHours() < 10 ? '0' : '') + d.getHours();
    let minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    return hours + ":" + minutes;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.promotionBill !== this.props.promotionBill) {
      this.setState({
        promotionBill: this.props.promotionBill
      });
    }

    if (prevProps.productsBill !== this.props.productsBill) {
      let pricePromotion = 0;
      let priceTotal = 0;
      const promise = new Promise((resolve, reject) => {
        this.props.productsBill.forEach((item, index) => {
          if (item.itemPromotion && item.itemPromotion != 0) {
            pricePromotion = pricePromotion + item.itemPromotion;
            priceTotal = priceTotal + (item.quantum * (item.donGia - item.itemPromotion));
          } else {
            priceTotal = priceTotal + (item.quantum * item.donGia);
          }
        });
        let priceAfterPromotion = (this.state.promotionBill == 0)
          ? priceTotal
          : (priceTotal - ((this.state.promotionBill * priceTotal) / 100));

        let obj = {
          priceTotal: priceTotal,
          priceAfterPromotion: priceAfterPromotion,
          productsBill: this.props.productsBill
        }
        resolve(obj);
      });

      Promise.all([promise]).then(values => {
        let data = values[0];
        this.setState({
          productsBill: data.productsBill,
          priceTotal: data.priceTotal,
          priceAfterPromotion: Math.ceil(data.priceAfterPromotion/1000)*1000,
          outlayBack: this.state.outlay - Math.ceil(data.priceAfterPromotion/1000)*1000,
          inputPayment: Math.ceil(data.priceAfterPromotion/1000)*1000
        });
      });
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
    if (prevProps.getCode !== this.props.getCode) {
      this.setState({
        codeOrder: this.props.getCode.maHoaDon,
        isHide: false
      });
    }
    if (prevProps.isOffline !== this.props.isOffline) {
      this.setState({
        isOffline: true
      });
    }
  }

  updateQuantum(idBill, operator) {
    let item = this.state.productsBill.find(x => x.idUnique == idBill);
    if (item) {
      this.props.updateQuantum(idBill, operator, item.itemPromotion);
    }
  }

  clearForm() {
    let currentdate = new Date();
    let datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear();
    this.props.clearFormOrder();
    let peopleSelect = [];
    this.state.peopleSelect.forEach((item, index) => {
      item.value = false;
      peopleSelect.push(item);
    });
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
      outlayBack: ' ',
      peopleSelect: peopleSelect,
      isCheckedTakeAWay: false,
      statusCopyPreBill: false,
      promotionBill: this.props.promotionBill,
      codeOrder: this.props.getCode.maHoaDon
    });
    localStorage.removeItem('productsBill');
    localStorage.removeItem('products');
    localStorage.removeItem('orderProcessTmp');
  }

async submitOrders(typeSubmit) {
  const code = this.state.codeOrder;
  const productsBill = this.state.productsBill;
  let statusSubmit = false;
  let date = new Date();
  let dateFormat = JSON.parse(JSON.stringify(date));
  let auth = JSON.parse(localStorage.getItem('auth'));
  let orderProducts = [];
  
  const outlay = Number(this.state.outlay);
  productsBill.forEach((item, index) => {
    let priceAfterPromotionItem = item.donGia * item.quantum;
    if (item.itemPromotion && item.itemPromotion > 0) {
      priceAfterPromotionItem = (item.donGia - item.itemPromotion) * item.quantum;
    }
    let dataProducts = {
      'donGia': item.donGia,
      'ghiChuMonOrderThucDon': item.itemNote && item.itemNote != 'undefined' ? item.itemNote : [],
      'khuyenMai': item.discount ? item.discount : 0,
      'ngayOrder': dateFormat,
      'soLuong': item.quantum,
      'thanhTien': priceAfterPromotionItem,
      'thucDonId': item.id,
      'tongGia': (item.donGia * item.quantum),
      'ten': item.ten,
      'chietKhau' : item.discount ? item.discount : 0,
      'isPrinter': item.viTriIn ? item.viTriIn : 'BAR'
    }
    orderProducts.push(dataProducts);
  });
  let payBack = outlay - Number(this.state.priceAfterPromotion);
  let payCash = 0;
  let payCard = 0;
  let payTransfer = 0;
  if (this.state.typePaymentTmp && this.state.typePaymentTmp.length > 0) {
    this.state.typePaymentTmp.forEach((item, index) => {
      if (item.type == 'cash') {
        if (outlay > this.state.priceAfterPromotion) {
          payCash = outlay;
        } else {
          payCash = item.price;
        }
      } else if (item.type == 'card') {
        payCard = item.price;
      } else if (item.type == 'transfer') {
        payTransfer = item.price;
      } 
    });
  } else {
    payCash = outlay;
  }
  let peopleSelect = this.state.peopleSelect.find(item => item.value == true);
  const data = {
    'tienCaThe': payCard,
    'tienChuyenKhoan': payTransfer,
    'ma': code,
    'khuyenMai': this.state.promotionBill ? this.state.promotionBill : 0,
    'ngayOrder': dateFormat,
    'nguoiChietKhauId': peopleSelect ? peopleSelect.id : 0,
    'nhanVienOrderId': auth.userId ? auth.userId : 0,
    'orderThucDons': orderProducts,
    'thanhTien': this.state.priceAfterPromotion,
    'tongGia': this.state.priceTotal,
    'trangThaiOrder': 'DA_THANH_TOAN',
    'soBan': this.state.numberTable,
    'tienKhachDua': payCash,
    'tienThoiLai': payBack ? payBack : 0,
    'textTrangThaiOrder': 'Đã thanh toán'
  };
  this.setState({
    orderDetail: [data]
  });

  if (typeSubmit == "Order") {
    if (this.state.statusCopyPreBill == true) {
      this.alertNotification('Hóa đơn này đã thanh toán, vui lòng chọn nhập lại!', 'warning');
    } else if (payBack < 0) {
      this.alertNotification('Khách chưa đưa tiền hoặc không đủ!', 'warning');
    } else if (data.soBan == 0 && this.state.isCheckedTakeAWay == false) {
      this.alertNotification('Bạn chưa nhập số bàn!', 'warning');
    } else if (productsBill && productsBill.length == 0) {
      this.alertNotification('Bạn chưa chọn món!', 'warning');
    } else if (this.props.checkOffline == true) {
      this.state.isHide = false;
      // this.props.countCodeAfterSubmit();
      const newData = this.props.storeOrder;
      data.id = this.state.setCode;
      data.ma = this.state.codeOrder;
      newData.push(data);
      this.props.dispatch(this.dispatchStoreOrder(newData));
      this.getCode(true);
      this.clearForm();
    } else {
      this.state.isHide = true;
      this.props.dispatch(Orders.actions.orders(null, data)).then((res) => {
        this.props.countCodeAfterSubmit();
        this.alertNotification('Bạn đã order thành công!', 'success');
        let hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
        let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        let timeCopy = hour + ':' + minutes;
        let copyProductsBill = {
          productsBill: productsBill,
          priceTotal: this.state.priceTotal,
          discountPriceTotal: this.state.discountPriceTotal,
          discountAfter: this.state.priceAfterPromotion,
          dateCopy: timeCopy,
          dateOrder: this.state.dateOrder,
          outlay: outlay,
          numberTable: this.state.numberTable,
          orderCode: data.ma,
          promotionBill: this.state.promotionBill,
          outlayBack: this.state.outlayBack,
          typePaymentTmp: this.state.typePaymentTmp,
          paymentTmp: this.state.paymentTmp,
          inputPayment: this.state.inputPayment,
          customerPayment: this.state.customerPayment,
          peopleSelect: this.state.peopleSelect ? this.state.peopleSelect : []
        }
        localStorage.setItem('copyProductsBill', JSON.stringify(copyProductsBill));
        try {
          const mainProcess = window.require("electron").remote.require('./print.js');
          let getStorePrinters = JSON.parse(localStorage.getItem('storePrinter'));
          const htmlBill = ReactDOMServer.renderToStaticMarkup(this.templatePrint(data, auth, 'bill'));
          let htmlBar = 'none';
          if (data.orderThucDons && data.orderThucDons.find(item => item.isPrinter == 'BAR')) {
            htmlBar = ReactDOMServer.renderToStaticMarkup(this.templatePrint(data, auth, 'bar'));
          } 
          let htmlCooker = 'none';
          if (data.orderThucDons && data.orderThucDons.find(item => item.isPrinter == 'BEP')) {
            htmlCooker = ReactDOMServer.renderToStaticMarkup(this.templatePrint(data, auth, 'cooker'));
          }
          mainProcess.print(htmlBill, htmlBar, htmlCooker, 'none');
        }
        catch(err) {
          this.alertNotification('Kiểm tra máy in!', 'error');
        }
        this.clearForm();
        this.getCode(false);
        this.setState({
          codeTmp: code
        });
        this.props.dispatch(TotalPromotion.actions.totalPromotion({ngayOrder: dateFormat}));
      }).catch((reason) => {
        this.alertNotification('Server lỗi!', 'error');
      });
    }
  } else if (typeSubmit == 'Store') {
    if (this.state.statusCopyPreBill == true) {
      this.alertNotification('Hóa đơn này đã thanh toán, vui lòng chọn nhập lại!', 'warning');
    } else if (productsBill && productsBill.length == 0) {
      this.alertNotification('Vui lòng chọn món!', 'warning');
    } else {
      let orderListTmp = JSON.parse(localStorage.getItem('orderListTmp'));
      let orderNewListTmp = [];
      data.productsBill = productsBill;
      data.priceTotal = this.state.priceTotal;
      data.discountPriceTotal = this.state.discountPriceTotal;
      data.discountAfter = this.state.priceAfterPromotion;
      data.dateOrder = this.state.dateOrder;
      data.orderCode = code;
      data.isCheckedTakeAWay = this.state.isCheckedTakeAWay;
      data.peopleSelect= this.state.peopleSelect ? this.state.peopleSelect : [];
      if (orderListTmp) {
        orderNewListTmp = orderListTmp.concat(data);
      } else {
        orderNewListTmp.push(data);
      }
      localStorage.setItem('orderListTmp', JSON.stringify(orderNewListTmp));
      this.alertNotification('Bạn đã lưu thành công!', 'success');
      this.props.countCodeAfterSubmit();
      this.clearForm();
    }
  }
  localStorage.removeItem('orderProcessTmp');
  };

  dispatchStoreOrder(storeOrder) {
    return {
      type: 'STORE_ORDER',
      storeOrder
    }
  }

  copyProductsBill() {
    this.props.copyProductsBill();
    let getCopyProductsBill = JSON.parse(localStorage.getItem('copyProductsBill'));
    if (getCopyProductsBill) {
      this.setState({
        dateCopy: getCopyProductsBill.dateCopy ? getCopyProductsBill.dateCopy : new Date(),
        dateOrder: getCopyProductsBill.dateOrder ? getCopyProductsBill.dateOrder : new Date(),
        statusCopyPreBill: true,
        numberTable: getCopyProductsBill.numberTable ? getCopyProductsBill.numberTable : ' ',
        outlay: getCopyProductsBill.outlay ? getCopyProductsBill.outlay : 0,
        codeOrder: getCopyProductsBill.orderCode ? getCopyProductsBill.orderCode : '',
        promotionBill: getCopyProductsBill.promotionBill ? getCopyProductsBill.promotionBill : 0,
        peopleSelect: getCopyProductsBill.peopleSelect ? getCopyProductsBill.peopleSelect : [],
        codeOrder: getCopyProductsBill.orderCode ? getCopyProductsBill.orderCode : this.state.codeOrder,
        typePaymentTmp: getCopyProductsBill.typePaymentTmp ? getCopyProductsBill.typePaymentTmp : [],
        paymentTmp: getCopyProductsBill.paymentTmp ? getCopyProductsBill.paymentTmp : [],
        inputPayment: getCopyProductsBill.inputPayment ? getCopyProductsBill.inputPayment : 0,
        customerPayment: getCopyProductsBill.customerPayment ? getCopyProductsBill.customerPayment: 0
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
    this.props.dispatch(NoteOrder.actions.noteOrders());
  }

  cancelItemBill(idUnique, id) {
    this.props.cancelItemBill(idUnique, id);
  }

  addNote(id) {
    const noteState = this.state.itemNoteTmp;
    let noteFilter = this.state.itemNoteTmp.filter(item => item.id == id);
    let noteFilterCheckEmpty = this.state.itemNoteTmp.find(item => item.ghiChuId == '');
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

  saveUpdateNote(typeModel) {
    if (typeModel == 'addInfo') {
      let productsBill = this.state.productsBill;
      let arrayTmp = [];
      let priceTotal = 0;
      let itemNote = this.state.itemNoteTmp;
      productsBill.forEach((item, index) => {
        if (this.state.idNoteCurrent == item.idUnique) {
          item.itemPromotion = this.state.promotion;
          item.discount = this.state.discount;
          let itemNote = this.state.itemNoteTmp;
          itemNote.forEach((item, index) => {
            if (item.ghiChuId == 0) {
              itemNote.splice(index, 1);
            }
            item.soLuong = Number(item.soLuong) > 0 ? Number(item.soLuong) : 1
          });

          item.itemNote = itemNote;
        }

        // if (item.itemPromotion && item.itemPromotion > 0) {
        //   priceTotal = priceTotal + (item.quantum * (item.donGia - item.itemPromotion));
        // } else {
        //   priceTotal = priceTotal + (item.quantum * item.donGia);
        // }
        arrayTmp.push(item);
      });
      this.props.addNote(arrayTmp);
      // this.props.changeTotal(priceTotal);
    } else {
      if (Number(this.state.inputPayment) == 0 && this.state.customerPayment == this.state.priceAfterPromotion) {
        this.setState({
          outlay: this.state.priceAfterPromotion.toString(),
          outlayBack: 0
        });
      } else if (Number(this.state.inputPayment) == 0 && this.state.customerPayment > this.state.priceAfterPromotion) {
          this.setState({
            outlay: this.state.customerPayment.toString(),
            outlayBack: (Number(this.state.customerPayment) - Number(this.state.priceAfterPromotion)).toString()
          });
      } else {
        this.setState({
          outlay: this.state.customerPayment.toString(),
          outlayBack: (this.state.customerPayment - this.state.priceAfterPromotion).toString()
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
    let priceAfterPromotion = this.state.priceTotal - discountPriceTotal;
    this.setState({
      promotionBill: Number(e),
      discountPriceTotal: discountPriceTotal,
      priceAfterPromotion: Math.ceil(priceAfterPromotion/1000)*1000,
      outlayBack: this.state.outlay -  Math.ceil(priceAfterPromotion/1000)*1000,
      inputPayment: Math.ceil(priceAfterPromotion/1000)*1000
    });
  }

  handleOutlay(e) {
    let value = Number(e.toString().replace(/,/g,''));
    this.setState({
      outlay: value,
      outlayBack: value - this.state.priceAfterPromotion
    });
  }

  handlePayment(e) {
    let value = Number(e.toString().replace(/,/g,''));
    this.setState({
      inputPayment: Number(value)
    });
  }

   validatePromotion(e) {
    if (Number(e) > 100 || Number(e) < 0) {
      return false;
    }
    return true;
  }

  validateNumberTable(e) {
    if (Number(e) > 100 || Number(e) < 0) {
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
    let value = e;
    if (value.indexOf(',') > -1) {
      value = Number(value.replace(/,/g,''));
    };

    return this.getPrice(Number(value));
  }

  checkDisplay(e) {
    return true;
  }

  getPrice(value) {
    String.prototype.splice = function(idx, rem, str) {
      return (this.slice(0, idx) + str + this.slice(idx + Math.abs(rem))).toString();
    };
    let result = value.toString();
    if(String(result).length < 3) {
      return result;
    } else {
      for (let j = Number(String(result).length); j > 0;) {
        j = j - 3;
        if(j > 0) {
          result = String(result).splice(j, 0, ",");
        }
      }
      return result;
    }
  }

  toggleChange() {
    this.setState({
      isCheckedTakeAWay: !this.state.isCheckedTakeAWay,
    });
  }

  getCode(isOrder) {
    let infoApp = JSON.parse(localStorage.getItem('infoApp'));
    let codeDevice = (infoApp && infoApp.maMay) ? infoApp.maMay : 'M01';
    if (this.props.checkOffline == false) {
      this.props.dispatch(GetCode.actions.getCode({maMay: codeDevice}))
      .then((res) => {})
      .catch((error) => {
        this.alertNotification('Server lỗi!', 'warning');
      });
    } else {
      console.log(this.props.getCode);
      let setCode = this.state.setCode;
      if (this.props.getCode && this.props.getCode.maHoaDon) {
        setCode = parseInt(this.props.getCode.maHoaDon.slice(-4));
      }
      if (isOrder == true) {
        setCode = setCode + 1;
        this.setState({
          setCode: this.state.setCode + 1
        });
      }
      var date = new Date();
      let year = date.getFullYear().toString().slice(-2);
      let month = ('0' + (date.getMonth()+1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);
      let numberBill = 10000 + setCode;
      let numberBillBuild = numberBill.toString().slice(-4);
      let code = codeDevice + 'OFF' + '.' + year + month + day + numberBillBuild;
      this.props.dispatch(this.setCode({maHoaDon: code}));
      this.setState({
        codeOrder: code
      });
    }
  }

  setCode(getCode) {
    return {
      type: 'GET_CODE',
      getCode
    }
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
              <button className="btn-copy-bill" onClick={this.copyProductsBill.bind(this)}>
                Copy hóa đơn trước
              </button>
              <p className="date-bill">
                Thời gian: {this.state.dateOrder}
                <span className="time-bill">
                  { this.state.statusCopyPreBill == true
                    ? this.state.dateCopy
                    : this.state.date.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})
                  }
                </span>
              </p>
            </div>
            <div className="right-header">

              <p className="title-bill">
                Hóa Đơn Bán Hàng
              </p>
              <p className="number-bill">
                Số:<span className="number"> {this.state.codeOrder ? this.state.codeOrder : ''}</span>
              </p>
              <div className="table-box-block">
                <p className="number-table-text">
                  Bàn số:
                </p>
                <input type="checkbox" className="check-takeaway"
                  checked={this.state.isCheckedTakeAWay}
                  onChange={this.toggleChange.bind(this)}
                />
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
                        <Item_Bill key = {i} keyData = {i} data = {item}
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
                <NumberFormat value={Number(this.state.priceTotal)} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
               </p>
            </div>
            <div className="discount">
              <p className="text">Chiết khấu</p>
              <NumPad.Number
                onChange={this.handlePromotion.bind(this)}
                value={this.state.promotionBill.toString()}
                decimal={false}
                keyValidator={this.validatePromotion.bind(this)}
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
              <p className="text-results">{this.state.priceAfterPromotion.toLocaleString()} đ</p>
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
                  value={this.getPrice(this.state.outlay)}
                  inline= {true}
                  position={'center'}
                  keyValidator = {this.checkDisplay.bind(this)}
                  displayRule  = {this.displayOutput.bind(this)}
                />
              </div>

            </div>
            <div className="exchange">
              <p className="text">Tiền thối lại</p>
              <p className="text-results">
                { this.state.outlay && this.state.outlay > 0 ?
                  <NumberFormat value={this.state.outlayBack != 0 ? this.state.outlayBack : 0} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
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
            <button className={
              classnames('pay btn-active', {
                'hide-button' : this.state.isHide,
              })}
              onClick={this.submitOrders.bind(this, 'Order')} 
            >
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
                    <DragScrollProvider>
                      {({ onMouseDown, ref }) => (
                        <div className= {
                          classnames('item-block-info', {
                            'item-block-info-scroll scrollable' : this.state.itemNoteTmp && this.state.itemNoteTmp.length > 2,
                          })}
                          ref={ref}
                          onMouseDown={onMouseDown}>
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
                        )}
                    </DragScrollProvider>
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
                      value={this.getPrice(this.state.inputPayment)}
                      displayRule = {this.displayOutput.bind(this)}
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

Bill_Order.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    promotion: state.promotion,
    noteOrders: state.noteOrders,
    getCode: state.getCode,
    isOffline: state.isOffline,
    storeOrder: state.storeOrder,
    checkOffline: state.checkOffline
  }
}

export default connect(bindStateToProps)(Bill_Order);

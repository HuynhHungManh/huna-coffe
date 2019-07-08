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

class Bill_Order extends Component {
  constructor(props, context) {
    super(props, context);

    this.openModel = this.openModel.bind(this);
    this.chooseItemProduct = this.chooseItemProduct.bind(this);
    this.cancelItemBill = this.cancelItemBill.bind(this);
    this.updateQuantum = this.updateQuantum.bind(this);
    let currentdate = new Date();
    let datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear();
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
      noteEditing: 0,
      noteQuantum: 0,
      noteName: '',
      outlay: '',
      idNoteCurrent: 0,
      promotion: 0,
      notePrice: 0,
      itemNoteTmp: [],
      dropdown_tmp: 1,
      discountInput: '',
      promotionGroup: 0,
      promotionGroupId: [],
      promotionItems: [],
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
      typePaymentShow: ''
    }
  }

  componentWillMount() {
    this.setState({
      productsBill: this.props.productsBill,
      discountInput: this.props.discountInput && this.props.discountInput != '' ?  parseInt(this.props.discountInput, 10) : ''
    });
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    localStorage.removeItem('productsBill');

    
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
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.productsBill !== this.props.productsBill) {
      let products = this.props.productsBill;
      let productsBill = [];
      let productsBillTmp = [];
      let priceTotal = 0;
      let getChooses = this.props.productsBill.filter(item => item.selectStatus == true);
      if (getChooses && getChooses.length > 0) {
        if (this.state.productsBill.length > 0) {
          let unique = [];
          let updateQuantum = [];
          getChooses.forEach((item, index) => {
            let test = this.state.productsBill.find(value => value.id == item.id);
            if (!test) {
              unique.push(item);
            } else {
              updateQuantum.push(item);
            }
          });
          let productsAfter = this.state.productsBill;
          if (updateQuantum && updateQuantum.length > 0) {
            productsAfter.forEach((item, index) => {
              let findUpdate = updateQuantum.find(value => value.id == item.id);
              // console.log(findUpdate);
              if (findUpdate) {
                productsAfter[index].quantum = findUpdate.quantum;
                if (item.itemPromotion && item.itemPromotion > 0) {
                  // productsAfter[index].priceAndQuantum = productsAfter[index].quantum * (productsAfter[index].donGia - item.itemPromotion);
                } else {
                  productsAfter[index].priceAndQuantum = productsAfter[index].quantum * productsAfter[index].donGia;
                }
              }
            });
          }
          getChooses = productsAfter.concat(unique);
        }
        getChooses.forEach((item, index) => {
          if (this.state.promotionGroup) {
            let promotionGroup = this.state.promotionGroup.find(itemPromotion => itemPromotion.loaiThucDonId == item.loaiThucDonId);
            if (promotionGroup) {
              item.discount = promotionGroup.chietKhau;
              item.itemPromotion = (promotionGroup.chietKhau * item.donGia) / 100;
              item.priceAndQuantum = (item.donGia - item.itemPromotion) * item.quantum;
            } else {
              let promotionItem = this.state.promotionItems.find(itemPromotion => itemPromotion.thucDonId == item.id);
              if (promotionItem) {
                item.discount = promotionItem.chietKhau;
                item.itemPromotion = (promotionItem.chietKhau * item.donGia) / 100;
                item.priceAndQuantum = (item.donGia - item.itemPromotion) * item.quantum;
              }
            }
          }
          priceTotal = priceTotal + item.priceAndQuantum;
        });

        let discountInput = this.state.discountInput;
        if (discountInput == '' && this.state.isPromotionTypeBill == true) {
           discountInput = 0;
          getChooses.forEach((item, index) => {
            item.discount = discountInput;
          });
        };
        let discountPriceTotal = discountInput > 0 && discountInput != '' ? (priceTotal * parseInt(discountInput, 10)) / 100 : 0;
        let discountAfter = discountPriceTotal >= 0 && discountPriceTotal <= priceTotal ? priceTotal - discountPriceTotal : 0;
        this.setState({
          inputPayment: discountAfter,
          productsBill : getChooses,
          priceTotal: priceTotal,
          discountPriceTotal: discountPriceTotal,
          discountAfter: discountAfter
        });
      }
    }

    if (prevProps.promotion !== this.props.promotion) {
      let promotionBill = this.props.promotion.find(item => item.maLoaiKhuyenMai == 'KHUYEN_MAI_HOA_DON' 
        && this.checkPromotionDate(item.tuNgay, item.denNgay));
      if (promotionBill) {
        this.setState({
          discountInput: promotionBill.chietKhau,
          isPromotionTypeBill: true
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
    if (prevProps.discountInput !== this.props.discountInput) {
      if (this.props.discountInput != '' && this.props.discountInput != 'clear') {
        let discountPriceTotal = (this.state.priceTotal * parseInt(this.props.discountInput, 10)) / 100;
        this.setState({
          discountInput: parseInt(this.props.discountInput, 10),
          discountPriceTotal: discountPriceTotal,
          discountAfter: this.state.priceTotal - discountPriceTotal
        });
      } else {
        this.setState({
          discountInput: ''
        });
      }
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
  }

  updateQuantum(idBill, operator) {
    let item = this.state.productsBill.find(x => x.id == idBill);
    if (item) {
      this.props.updateQuantum(idBill, operator, item.itemPromotion);
    }
    let productsBillPre = [];
    let priceTotal = 0;
    let tmp = '';
    let getStoreProducts = JSON.parse(localStorage.getItem('products'));
    if (getStoreProducts) {
      tmp = getStoreProducts.find(x => x.id == idBill);
    }
    // console.log(this.state.productsBill);
    this.state.productsBill.forEach((item, index) => {
      if (item.id == idBill) {
        if (operator === 'minus' && item.quantum > 1 && tmp) {
          item.quantum = item.quantum - 1;
        } else if (operator === 'plus') {
          if (tmp) {
            item.quantum = item.quantum + 1;
          }
        }
        // item.itemNote = this.state.itemNote;
      }
      let priceAndQuantum = 0;
      if (item.itemPromotion && item.itemPromotion > 0) {
        // item.priceAndQuantum = (item.priceAndQuantum - item.itemPromotion) * item.quantum;
      } else {
        // item.priceAndQuantum = item.quantum * item.donGia;
      }
      priceTotal = priceTotal + item.priceAndQuantum;
      productsBillPre.push(item);
    });
    let discountInput = this.state.discountInput;
    if (discountInput == '') {
      discountInput = 0;
    }
    let discountPriceTotal = discountInput > 0 ? (priceTotal * parseInt(this.state.discountInput, 10)) / 100 : 0;
    this.setState({
      productsBill :  productsBillPre,
      priceTotal: priceTotal,
      discountPriceTotal: discountPriceTotal,
      discountAfter: priceTotal - discountPriceTotal
    });
  }

  clearForm() {
    let currentdate = new Date();
    let datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear();
    this.props.clearFormOrder();
    this.setState({
      productsBill :  [],
      priceTotal: 0,
      discountPriceTotal: 0,
      discountAfter: 0,
      dateOrder: datetime,
      date: new Date(),
      statusCopyPreBill: false,
      discountInput: '',
      typePaymentTmp : [],
      paymentTmp: 0,
      customerPayment: 0
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
        'ghiChuMonOrderThucDon': item.itemNote,
        'khuyenMai': item.itemPromotion ? item.itemPromotion : 0,
        'ngayOrder': dateFormat,
        'soLuong': item.quantum,
        'thanhTien': item.priceAndQuantum,
        'thucDonId': item.id,
        'tongGia': this.state.discountInput && this.state.discountInput.length > 0 ? ((item.priceAndQuantum * this.state.discountInput) / 100) : item.priceAndQuantum,
        'ten': item.ten,
        'chietKhau' : item.discount ? item.discount : 0
      }
      orderProducts.push(dataProducts);
    });
    let payBack = this.props.outLay - this.state.discountAfter;
    let payCash = 0;
    let payCard = 0;
    let payTransfer = 0;
    this.state.typePaymentTmp.forEach((item, index) => {
      if (item.type == 'cash') {
        payCash = item.price;
      } else if (item.type == 'card') {
        payCard = item.price;
      } else if (item.type == 'transfer') {
        payTransfer = item.price;
      } 
    });
    let data = {
      'tienCaThe': payCard,
      'tienChuyenKhoan': payTransfer,
      'ma' : '1021000',
      'khuyenMai': this.state.discountInput && this.state.isPromotionTypeBill == true ? this.state.discountInput : 0,
      'ngayOrder': dateFormat,
      'nguoiChietKhauId': this.state.peopleSelect[0].id ? this.state.peopleSelect[0].id : 1,
      'nhanVienOrderId': auth.userId ? auth.userId : 0,
      'orderThucDons': orderProducts,
      'thanhTien': this.state.priceTotal,
      'tongGia': this.state.discountAfter,
      'trangThaiOrder': 'DA_THANH_TOAN',
      'soBan': this.props.numberTable,
      'tienKhachDua': payCash,
      'tienThoiLai': payBack
    };
    this.setState({
      orderDetail: [data]
    });
    console.log(data);
    // if (typeSubmit == "Order") {
    //   if (!this.props.outLay || this.props.outLay == 0 || payBack < 0) {
    //     this.alertNotification('Khách chưa đưa tiền hoặc không đủ!', 'warning');
    //   } else {
    //     this.props.dispatch(Orders.actions.orders(null, data)).then((res) => {
    //     this.alertNotification('Bạn đã order thành công!', 'success');
    //     let d = new Date();
    //     let hour = d.getHours();
    //     let minutes = date.getMinutes();
    //     let timeCopy = hour + ':' + minutes;
    //     let copyProductsBill = {
    //       productsBill: this.state.productsBill,
    //       priceTotal: this.state.priceTotal,
    //       discountPriceTotal: this.state.discountPriceTotal,
    //       discountAfter: this.state.discountAfter,
    //       dateCopy: timeCopy,
    //       dateOrder: this.state.dateOrder,
    //       outLay: this.state.outLay,
    //       numberTable: this.props.numberTable
    //     }
    //     localStorage.setItem('copyProductsBill', JSON.stringify(copyProductsBill));
    //     this.clearForm();
    //     }).catch((reason) => {
    //       this.alertNotification('Order không thành công!', 'error');
    //     });
    //   }
    // } else if (typeSubmit == 'Store') {
    //   let orderListTmp = JSON.parse(localStorage.getItem('orderListTmp'));
    //   let orderNewListTmp = [];
    //   data.productsBill = this.state.productsBill;
    //   data.priceTotal = this.state.priceTotal;
    //   data.discountPriceTotal = this.state.discountPriceTotal;
    //   data.discountAfter = this.state.discountAfter;
    //   data.dateOrder = this.state.dateOrder;
    //   if (orderListTmp) {
    //     orderNewListTmp = orderListTmp.concat(data);
    //   } else {
    //     orderNewListTmp.push(data);
    //   }
    //   localStorage.setItem('orderListTmp', JSON.stringify(orderNewListTmp.reverse()));
    //   this.alertNotification('Bạn đã lưu thành công!', 'success');
    // }
  };

  copyProductsBill() {
    this.props.copyProductsBill();
    let getCopyProductsBill = JSON.parse(localStorage.getItem('copyProductsBill'));
    if (getCopyProductsBill) {
      this.setState({
        productsBill: getCopyProductsBill.productsBill,
        priceTotal: getCopyProductsBill.priceTotal,
        discountPriceTotal: getCopyProductsBill.discountPriceTotal,
        discountAfter: getCopyProductsBill.discountAfter,
        dateCopy: getCopyProductsBill.dateCopy,
        dateOrder: getCopyProductsBill.dateOrder,
        statusCopyPreBill: true,
        numberTable: getCopyProductsBill.numberTable
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
    // console.log(data);
    // promotionBill: 0,
    // promotionGroup: 0,
    // promotionGroupId: [],
    // promotionItems: 0
    // let cbDiscount = true;
    // if (this.state.promotionGroup) {
    //   let promotion = this.state.promotionGroup.find(item => item.loaiThucDonId == data.categoriesId);
    // }multiSelect
    // console.log(data.itemNote);
    // if (data.itemNote && data.itemNote.length > 0) {
    //   // let idSelected = filter(item => item);
    //   data.itemNote.forEach((item, index) => {
    //     if (item.ghiChuId) {

    //     }
    //   });
    // }
    this.setState({
      statusPopup : true,
      noteEditing: data.id,
      noteQuantum: data.quantum,
      noteName: data.ten,
      notePrice: data.donGia,
      idNoteCurrent: data.id,
      itemNote: data.itemNote ? data.itemNote : [],
      cbDiscount: data.itemPromotion ? true : false,
      promotion: data.itemPromotion ? data.itemPromotion : 0,
      discount: data.discount ? data.discount : 0,
      itemNoteTmp: data.itemNote ? data.itemNote : [],
      nameModel: 'addInfo'
    });
  }

  cancelItemBill(id) {
    this.props.cancelItemBill(id);
    let afterCancel = this.state.productsBill.filter(x => x.id != id);
    let priceTotal = 0;
    afterCancel.forEach((item, index) => {
      priceTotal = priceTotal + item.priceAndQuantum;
    });
    let discountPriceTotal = (priceTotal * parseInt(this.state.discountInput, 10)) / 100;
    this.setState({
      productsBill : afterCancel,
      priceTotal: priceTotal,
      discountPriceTotal: discountPriceTotal,
      discountAfter: priceTotal - discountPriceTotal
    });
  }

  addNote(id) {
    const noteState = this.state.itemNoteTmp;
    let noteFilter = this.state.itemNoteTmp.filter(item => item.id == id);
    let noteFilterCheckEmpty = this.state.itemNoteTmp.find(item => item.ghiChuId == '');
    // console.log(!noteFilterCheckEmpty);
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

  removeNote(index) {
    let itemNoteTmp = this.state.itemNoteTmp;
    if (itemNoteTmp && itemNoteTmp.length > 0) {
      itemNoteTmp.splice(index, 1);
    }
  }

  handleChangeQuantum(event) {
    let index_quantum = event.target.name;
    let note = this.state.itemNote;
    if (index_quantum && note && note.length > 0) {
      note.forEach((item, index) => {
        if (index_quantum == index) {
          note[index].soLuong = parseInt(event.target.value, 10);
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
      productsBill.forEach((item, index) => {
        if (this.state.noteEditing == item.id) {
          // this.state.itemNote = this.state.itemNoteTmp;
          let itemNote = this.state.itemNoteTmp;
          itemNote.forEach((item, index) => {
            if (item.ghiChuId == 0) {
              itemNote.splice(index, 1);
            }
            item.soLuong = item.soLuong > 0 ? item.soLuong : 1
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
        priceTotal = priceTotal + item.priceAndQuantum;
        arrayTmp.push(item);
      });

      let discountPriceTotal = (priceTotal * Number(this.state.discountInput)) / 100;
      console.log(arrayTmp);
      this.setState({
        productsBill: arrayTmp,
        priceTotal: priceTotal,
        discountPriceTotal: discountPriceTotal ? discountPriceTotal : 0,
        discountAfter: priceTotal - discountPriceTotal
      });
    } else {
      if (this.state.inputPayment == 0 && this.state.customerPayment == this.state.discountAfter) {
        this.props.changePayment(this.state.discountAfter);
      } else if (this.state.inputPayment == 0 && this.state.customerPayment > this.state.discountAfter) { 
        this.props.changePayment(this.state.customerPayment);
      } else {
        this.props.changePayment(this.state.inputPayment);
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
    let index_dd = this.state.idNoteCurrent;
    let note = this.state.itemNoteTmp;
    let multiSelected = optionsList.filter(item => item.value == true);
    let idNote = [];
    let arrayTmp = [];
    optionsList.forEach((item, index) => {
      if (item.value == true) {
        idNote.push(item.id);
      }
    });
    if (index_dd && note && note.length > 0) {
      note.forEach((item, index) => {
        if (index_dd == item.id && idNote.length > 0) {
          item.ghiChuId = idNote.join(';'),
          item.multiSelect = optionsList;
        }
        arrayTmp.push(item);
      });
      this.setState({
        itemNoteTmp: arrayTmp
      });
    }
  }

  selectedBadgeClicked(callback, indexSelect, optionsList) {
    let index_dd = this.state.idNoteCurrent;
    let note = this.state.itemNoteTmp;
    let multiSelected = optionsList.filter(item => item.value == true);
    let idNote = [];
    let arrayTmp = [];
    optionsList.forEach((item, index) => {
      if (item.value == true) {
        idNote.push(item.id);
      }
    });
    if (index_dd && note && note.length > 0) {
      note.forEach((item, index) => {
        if (idNote.length > 0 && index_dd == item.id && item.idIndex == indexSelect) {
          item.ghiChuId = idNote.join(';'),
          item.multiSelect = optionsList;
        }
        arrayTmp.push(item);
      });
      console.log(arrayTmp);
      this.setState({
        itemNoteTmp: arrayTmp
      });
    }
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
    if (!isChoose && this.state.inputPayment != 0) {
      let inputPayment = 0;
      let customerPayment = 0;
      if (this.state.discountAfter >= (price + priceTotal)) {
        inputPayment = this.state.discountAfter - (price + priceTotal);
        customerPayment = price + priceTotal;
      } else {
        customerPayment = price + this.state.customerPayment;
        price = this.state.discountAfter - priceTotal;
      }
      arrType.push({
        type: type,
        price: Number(price)
      });
      this.setState({
        typePaymentTmp : arrType,
        paymentTmp: this.state.discountAfter,
        inputPayment: inputPayment,
        customerPayment: customerPayment
      });
      console.log(customerPayment);
    }
  }

  handleChangePayment(e) {
    this.setState({
      inputPayment: Number(e.target.value),
    });
    // console.log(e.target.value);
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
      inputPayment: this.state.discountAfter - priceTotal,
    });
  }

  render() {
    let cashPaymentData = this.state.typePaymentTmp.find(item => item.type  == 'cash');
    let cardPaymentData = this.state.typePaymentTmp.find(item => item.type  == 'card');
    let transferPaymentData = this.state.typePaymentTmp.find(item => item.type  == 'transfer'); 

    
    // let customerPayment = 0;
    // if (cashPaymentData && cashPaymentData.price) {
    //   customerPayment = customerPayment + cashPaymentData.price;
    // }
    // if (cardPaymentData && cardPaymentData.price) {
    //   customerPayment = customerPayment + cardPaymentData.price;
    // }
    // if (transferPaymentData && transferPaymentData.price) {
    //   customerPayment = customerPayment + transferPaymentData.price;
    // }

    return(
      <div className="bill-order-block">
        <div className="bill-box">
          <div className="bill-header">
            <div className="left-header">
              <p className="title-bill">
                Hóa Đơn Bán Hàng
              </p>
              <p className="number-bill">
                Số:<span className="number"> 0000123</span>
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
                <input className= {
                  classnames('inp-number-table', {
                    'position-input' : this.props.showNumberic && this.props.filedCurrent == 'numberTable',
                  })}
                  name="numberTable" type="text" placeholder=""
                  value = {this.props.numberTable}
                  onClick = {this.props.onClickFiledInput.bind(this)}
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
            <div className="bill-calculate">
              {
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
                    />
                  )
                })
              }
            </div>
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
              <input className={classnames('inp-discount', {
                  'position-input' : this.props.showNumberic && this.props.filedCurrent == 'discountInput',
                })}
                name="discountInput"
                value = {this.state.discountInput} type="text"
                onClick = {this.props.onClickFiledInput.bind(this)}
              />
              <div className={classnames('bg-discount', {
                  'position-input' : this.props.showNumberic && this.props.filedCurrent == 'discountInput',
                })}
              >
                <p className="discount-text">
                {this.state.discountInput &&
                  <NumberFormat value={Number((this.state.discountPriceTotal).toFixed(3))} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                }
                </p>
              </div>
            </div>
            <div className="discount-after">
              <p className="text">Sau chiết khấu</p>
              <p className="text-results">
              <NumberFormat value={Number((this.state.discountAfter).toFixed(3))} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
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
              <NumberFormat
                className={classnames('inp-outlay', {
                    'position-input' : this.state.discountPriceTotal > 0
                      && this.props.showNumberic
                      && this.props.filedCurrent == 'outLay',
                    'display-input' : !this.state.discountAfter || this.state.discountAfter <= 0
                  })}
                name="outLay"
                onClick = {this.props.onClickFiledInput.bind(this)}
                value= {this.props.outLay}
                type="text"
                thousandSeparator={true}
                suffix={' đ'}
              />
            </div>
            <div className="exchange">
              <p className="text">Tiền thối lại</p>
              <p className="text-results">
              <NumberFormat value={this.props.outLay != 0 ? (this.props.outLay - this.state.discountAfter) : 0} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
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
            <ReactToPrint onClick={this.submitOrders.bind(this, 'Order')} 
              onBeforePrint = {this.submitOrders.bind(this, 'Order')}
              trigger={() => 
                <button className="pay btn-active" onClick={this.submitOrders.bind(this, 'Order')} >
                  Thanh Toán
                </button>
              }
              content={() => this.componentRef}/>
              <ComponentToPrint ref={el => (this.componentRef = el)} data={this.state.orderDetail}/>
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
                      <input type="checkbox" className= {
                        classnames('checkbox-inp-block discount', {
                          'cb-active icon-checkmark' : this.state.cbDiscount,
                        })}
                
                        name="discount" ref="cb_discount" />
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
                          <input type="text" className="checkbox-inp-block" value = {this.state.discount}/>
                        </div>
                        <div className="input-item">
                          <NumberFormat
                            className="inp-price-discount-text"
                            value= {this.state.promotion ? this.state.promotion : 0}
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
                                <input type="text" className="checkbox-inp-block" name={i} defaultValue={item.soLuong} onChange={this.handleChangeQuantum.bind(this)}/>
                              </div>
                              <div className="input-item">
                                <MultiSelectReact 
                                  className="checkbox-inp-block dropdown-discount"
                                  options={item.multiSelect}
                                  optionClicked={this.optionClicked.bind(this)}
                                  selectedBadgeClicked={this.selectedBadgeClicked.bind(this, this, i)}
                                />
                                <span className="input-item-icon icon-bin" onClick={this.removeNote.bind(this, i)}></span>
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
                    <input type="text" className="price-total-bill-input" onChange={this.handleChangePayment.bind(this)} value={this.state.inputPayment}/>
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

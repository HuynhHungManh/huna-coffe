import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Bill from './Item_Bill.jsx';
import {Orders} from 'api';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
Modal.setAppElement('body');
import  MultiSelectReact  from 'multi-select-react';

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
      numberTable: 0
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
            let promotionGroup = this.state.promotionGroup.find(itemPromotion => itemPromotion.loaiThucDonId == item.categoriesId);
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

        this.setState({
          productsBill :  getChooses,
          priceTotal: priceTotal,
          discountPriceTotal: discountPriceTotal,
          discountAfter: discountPriceTotal >= 0 && discountPriceTotal <= priceTotal ? priceTotal - discountPriceTotal : 0
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
      discountInput: ''
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
    let data = {
      'hinhThucThanhToan' : 'TIEN_MAT',
      'ma' : '1021000',
      'khuyenMai': this.state.discountInput && this.state.isPromotionTypeBill == true ? this.state.discountInput : 0,
      'ngayOrder': dateFormat,
      'nguoiChietKhauId': 1,
      'nhanVienOrderId': auth.userId ? auth.userId : 0,
      'orderThucDons': orderProducts,
      'thanhTien': this.state.priceTotal,
      'tongGia': this.state.discountAfter,
      'trangThaiOrder': 'DA_THANH_TOAN',
      'soBan': this.props.numberTable,
      'tienKhachDua': this.props.outLay,
      'tienThoiLai': payBack
    };
    if (typeSubmit == "Order") {
      if (!this.props.outLay || this.props.outLay == 0 || payBack < 0) {
        this.alertNotification('Khách chưa đưa tiền hoặc không đủ!', 'warning');
      } else {
        this.props.dispatch(Orders.actions.orders(null, data)).then((res) => {
        this.alertNotification('Bạn đã order thành công!', 'success');
        let d = new Date();
        let hour = d.getHours();
        let minutes = date.getMinutes();
        let timeCopy = hour + ':' + minutes;
        let copyProductsBill = {
          productsBill: this.state.productsBill,
          priceTotal: this.state.priceTotal,
          discountPriceTotal: this.state.discountPriceTotal,
          discountAfter: this.state.discountAfter,
          dateCopy: timeCopy,
          dateOrder: this.state.dateOrder,
          outLay: this.state.outLay,
          numberTable: this.props.numberTable
        }
        localStorage.setItem('copyProductsBill', JSON.stringify(copyProductsBill));
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
      data.discountAfter = this.state.discountAfter;
      data.dateOrder = this.state.dateOrder;
      if (orderListTmp) {
        orderNewListTmp = orderListTmp.concat(data);
      } else {
        orderNewListTmp.push(data);
      }
      localStorage.setItem('orderListTmp', JSON.stringify(orderNewListTmp.reverse()));
      this.alertNotification('Bạn đã lưu thành công!', 'success');
    }
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
      itemNoteTmp: data.itemNote ? data.itemNote : []
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
    let noteState = this.state.itemNote;
    let noteFilter = this.state.itemNoteTmp.filter(item => item.id == id);
    let noteFilterCheckEmpty = this.state.itemNoteTmp.filter(item => item.ghiChuId == 0);
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
    if (noteFilterCheckEmpty && noteFilterCheckEmpty.length == 0) {
      let note = {
        'ghiChuId': 0,
        'soLuong': 1,
        'id': id,
        'idIndex' : idIndex,
        'multiSelect' : arrayTmp
      };
      noteState.push(note);
      this.setState({
        itemNoteTmp: noteState
      });
    } else {
      this.alertNotification('Bạn chưa ghi chú!', 'info');
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

  saveUpdateNote() {
    let productsBill = this.state.productsBill;
    let arrayTmp = [];
    let priceTotal = 0;
    productsBill.forEach((item, index) => {
      if (this.state.noteEditing == item.id) {
        let itemNote = this.state.itemNote;
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

    let discountPriceTotal = (priceTotal * parseInt(this.state.discountInput, 10)) / 100;
    this.setState({
      productsBill: arrayTmp,
      priceTotal: priceTotal,
      discountPriceTotal: discountPriceTotal,
      discountAfter: priceTotal - discountPriceTotal
    });
    this.closeModel();
  }

  optionClicked(optionsList) {
    let index_dd = this.state.idNoteCurrent;
    let note = this.state.itemNote;
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
          item.ghiChuId = idNote.toString();
          item.multiSelect = optionsList;
        }
        arrayTmp.push(item);
      });
      this.setState({
        itemNote: arrayTmp
      });
    }
  }

  selectedBadgeClicked(callback, indexSelect, optionsList) {
    let index_dd = this.state.idNoteCurrent;
    let note = this.state.itemNote;
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
          item.ghiChuId = idNote.toString();
          item.multiSelect = optionsList;
        }
        arrayTmp.push(item);
      });
      this.setState({
        itemNote: arrayTmp
      });
    }
  }

  render() {
    const selectedOptionsStyles = {
      color: "#3c763d",
      backgroundColor: "#dff0d8"
    };
    const optionsListStyles = {
      backgroundColor: "#dff0d8",
      color: "#3c763d"
    };
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
              <p className="text">Tiền khách đưa</p>
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
            <button className="save btn-active" onClick={this.submitOrders.bind(this, 'Store')}>
              Lưu
            </button>
            <button className="pay btn-active" onClick={this.submitOrders.bind(this, 'Order')}>
              Thanh Toán
            </button>
          </div>
        </div>
        <Modal
          isOpen={this.state.statusPopup}
          contentLabel="Modal"
          className="modal popup info-plus"
        >
          <div className="info-plus-block">
            <div className="header-info-plus">
              <p className="text-title">Thông tin thêm</p>
              <p className="close-model" onClick={this.closeModel.bind(this)}>X</p>
              <p className="name-product-info">{this.state.noteQuantum} x {this.state.noteName}</p>
            </div>
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
            <div className="footer-info-plus">
              <button className="btn close-add-info" onClick={this.closeModel.bind(this)}>
                Đóng
              </button>
              <button className="btn save-update-info" onClick={this.saveUpdateNote.bind(this)}>
                Lưu cập nhập
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

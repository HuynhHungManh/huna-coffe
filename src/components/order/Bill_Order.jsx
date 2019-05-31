import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Bill from './Item_Bill.jsx';
// import {PropTypes} from 'prop-types';
import {Orders} from 'api';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import Modal from 'react-modal';
Modal.setAppElement('body');

class Bill_Order extends Component {
  constructor(props, context) {
    super(props, context);
    this.updateQuantum = this.updateQuantum.bind(this);
    this.openModel = this.openModel.bind(this);
    this.chooseItemProduct = this.chooseItemProduct.bind(this);
    const currentdate = new Date();
    const datetime = currentdate.getDate() + "/"
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
      countItemRow:[]
    }
  }

  componentWillMount() {
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.productsBill !== this.props.productsBill) {
      // let productsBill = this.state.products.filter(element => arrayId.includes(element.id));
      let products = this.props.productsBill;

      let productsBill = [];
      let productsBillTmp = [];
      let priceTotal = 0;
      let getProductsBill = JSON.parse(localStorage.getItem('productsBill'));
      // if (getProductsBill && getProductsBill.length > 0) {
      //   productsBill = getProductsBill.concat(productsBill);
      // }
      products.forEach((item, index) => {
        item.quantum = 1;
        item.priceAndQuantum = item.quantum * item.donGia;
        priceTotal = priceTotal + item.priceAndQuantum;
        if (item.selectStatus == true) {
          if (getProductsBill && getProductsBill.length > 0) {
            let findCheck = getProductsBill.find(value => value.id == item.id);
            if (!findCheck) {
              productsBillTmp.push(item);
            }
          } else {
              productsBillTmp.push(item);
          }
        }
      });
      if (productsBillTmp && productsBillTmp.length > 0) {
        if (getProductsBill && getProductsBill.length > 0) {
          productsBillTmp = getProductsBill.concat(productsBillTmp);
        }
        localStorage.setItem('productsBill', JSON.stringify(productsBillTmp));
        this.setState({
          productsBill :  productsBillTmp,
          priceTotal: priceTotal,
          discountPriceTotal: priceTotal / 10,
          discountAfter: priceTotal - (priceTotal / 10)
        });
      }
    }
  }

  updateQuantum(idBill, operator) {
    let productsBillPre = [];
    let priceTotal = 0;
    this.state.productsBill.forEach((item, index) => {
      if (item.id === idBill) {
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
      productsBill :  productsBillPre,
      priceTotal: priceTotal,
      discountPriceTotal: priceTotal / 10,
      discountAfter: priceTotal - (priceTotal / 10)
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
      statusCopyPreBill: false
    });
    localStorage.removeItem('productsBill');
  }

  submitOrders(e) {
    e.preventDefault();
    let date = new Date();
    let dateFormat = JSON.parse(JSON.stringify(date));
    let auth = JSON.parse(localStorage.getItem('auth'));
    let orderProducts = [];
    this.state.productsBill.forEach((item, index) => {
      let dataProducts = {
        'donGia': item.donGia,
        'khuyenMai': 10,
        'ngayOrder': dateFormat,
        'soLuong': item.quantum,
        'thanhTien': item.priceAndQuantum,
        'thucDonId': item.id,
        'tongGia': (item.priceAndQuantum * 10) / 100
      }
      orderProducts.push(dataProducts);
    });

    let data = {
      'khuyenMai': 0,
      'ngayOrder': dateFormat,
      'nhanVienOrderId': auth.userId ? auth.userId : 0,
      'orderThucDons': orderProducts,
      'thanhTien': this.state.priceTotal,
      'tongGia': this.state.discountAfter,
      'trangThaiOrder': 'DA_THANH_TOAN'
    };
    this.props.dispatch(Orders.actions.orders(null, data)).then((res) =>{
      this.alertNotification('Bạn đã order thành công!', 'success');
      let d = new Date();
      let hour = d.getHours();
      let minutes = date.getMinutes();
      let timeCopy = hour + ":" + minutes;
      let copyProductsBill = {
        productsBill: this.state.productsBill,
        priceTotal: this.state.priceTotal,
        discountPriceTotal: this.state.discountPriceTotal,
        discountAfter: this.state.discountAfter,
        dateCopy: timeCopy,
        dateOrder: this.state.dateOrder
      }
      localStorage.setItem('copyProductsBill', JSON.stringify(copyProductsBill));
      this.clearForm();
    }).catch((reason) => {
      this.alertNotification('Order không thành công!', 'error');
    });
  }

  copyProductsBill() {
    let getCopyProductsBill = JSON.parse(localStorage.getItem('copyProductsBill'));
    if (getCopyProductsBill) {
      this.setState({
        productsBill: getCopyProductsBill.productsBill,
        priceTotal: getCopyProductsBill.priceTotal,
        discountPriceTotal: getCopyProductsBill.discountPriceTotal,
        discountAfter: getCopyProductsBill.discountAfter,
        dateCopy: getCopyProductsBill.dateCopy,
        dateOrder: getCopyProductsBill.dateOrder,
        statusCopyPreBill: true
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
    this.setState({
      cbDiscount : this.refs.cb_discount.checked
    });
  }

  addNote() {
    // let itemNote = this.state.itemNote;
    // this.setState({
    //   itemNote : this.refs.cb_discount.checked
    // });
  }

  chooseItemProduct(data) {
    let count = 0;
    let rowArray = [];
    while (count < data.quantum) {
      rowArray.push(1);
      count++;
    }
    this.setState({
      countItemRow : rowArray,
      statusPopup : true
    });
  }


  render() {
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
                <input className="inp-number-table" name="number-table" type="text" placeholder=""/>
              </div>
            </div>
          </div>
          <div className="bill-content">
            <div className="bill-title">
              <p className="">Mặt hàng</p>
              <p className="">Đơn giá</p>
              <p className="">Số lượng</p>
              <p className="">Tổng tiền</p>
            </div>
            <div className="bill-calculate">
              {
                this.state.productsBill.map((item, i) => {
                  return (
                    <Item_Bill key = {i} data = {item} updateQuantum = {this.updateQuantum} openModel={this.openModel} chooseItemProduct = {this.chooseItemProduct}/>
                  )
                })
              }
            </div>
          </div>
          <div className="bill-results">
            <div className="calculate-tmp">
              <p className="text">Tạm tính</p>
              <p className="text-results">{this.state.priceTotal} đ</p>
            </div>
            <div className="discount">
              <p className="text">Chiếc khấu</p>
              <input className="inp-discount" name="discount" value = "10" type="text" placeholder=""/>
              <div className="bg-discount">
                <p className="discount-text">{this.state.discountPriceTotal} đ</p>
              </div>
            </div>
            <div className="discount-after">
              <p className="text">Sau chiếc khấu</p>
              <p className="text-results">{this.state.discountAfter} đ</p>
            </div>
            <div className="outlay">
              <p className="text">Tiền khách đưa</p>
              <input className="inp-outlay" name="outlay" value="150.000" type="text" placeholder=""/>
            </div>
            <div className="exchange">
              <p className="text">Tiền thối lại</p>
              <p className="text-results">150.000đ</p>
            </div>
          </div>
          <div className="bill-footer">
            <button className="fill-again" onClick={this.clearForm.bind(this)}>
              Nhập lại
            </button>
            <button className="save" onClick={this.openModel.bind(this)}>
              Lưu
            </button>
            <button className="pay" onClick={this.submitOrders.bind(this)}>
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
              <p className="name-product-info">2 x cà phê dừa</p>
            </div>
            <div className="content-info-plus">
                <div className="checkbox-block">
                  <input type="checkbox" className={
                    classnames('checkbox-inp-block discount', {
                      'cb-active' : this.state.cbDiscount,
                    })}
                    onClick={this.changCbDiscount.bind(this)}
                    name="discount" ref="cb_discount" />
                  <p className="checkbox-discount-text">
                    Giảm giá?
                  </p>
                </div>
                <div className="content-item-info">
                  <div className="text-note-info">
                    Ghi chú
                  </div>
                  <div className="item-block-info">
                    {
                      this.state.countItemRow.map((item, i) => {
                        return (
                          <div className="item-info" key = {i}>
                            <div className="checkbox-item">
                              <input type="checkbox" className="checkbox-inp-block"  name="" value="Bike" />
                            </div>
                            <div className="input-item">
                              <select className="checkbox-inp-block dropdown-discount">
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="fiat">Fiat</option>
                                <option value="audi">Audi</option>
                              </select>
                              <p>X</p>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div className="add-new-item-info">
                    <p className="add-new-item-info-text" onClick={this.addNote.bind(this)}>
                      + Thêm ghi chú
                    </p>
                  </div>
                </div>
              </div>
            <div className="footer-info-plus">
              <button className="btn close-add-info" onClick={this.closeModel.bind(this)}>
                Đóng
              </button>
              <button className="btn save-update-info" onClick={this.closeModel.bind(this)}>
                Lưu cập nhập
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

// Bill_Order.contextTypes = {
//   router : PropTypes.any
// }

const bindStateToProps = (state) => {
  return {}
}

export default connect(bindStateToProps)(Bill_Order);

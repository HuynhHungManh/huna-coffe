import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Bill from './Item_Bill.jsx';
import {PropTypes} from 'prop-types';
import {Orders} from 'api';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Bill_Order extends Component {
  constructor(props, context) {
    super(props, context);
    this.updateQuantum = this.updateQuantum.bind(this);
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear();
    this.state = {
      productsBill: [],
      priceTotal: 0,
      discountPriceTotal: 0,
      discountAfter: 0,
      dateOrder: datetime,
      date: new Date(),
      statusTab: false
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

  createNotification(type) {
    console.log(type);
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info('Info message');
          break;
        case 'success':
          NotificationManager.success('Success message', 'Bạn đã order thành công!');
          break;
        case 'warning':
          NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error('Error message', 'Lỗi order!', 5000, () => {
            alert('callback');
          });
          break;
      }
    };
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.productsBill !== this.props.productsBill) {
      let products = this.props.productsBill;
      var getStoreProductsBill = JSON.parse(localStorage.getItem('productsBill'));
      let productsBill = [];
      let priceTotal = 0;
      products.forEach((item, index) => {
        item.quantum = 1;
        item.priceAndQuantum = item.quantum * item.donGia;
        priceTotal = priceTotal + item.priceAndQuantum;
        productsBill.push(item);
      });
      if (getStoreProductsBill !== null
        && getStoreProductsBill.length > 0
        && this.state.statusTab == true
      ) {
        let array_unique = [];
        getStoreProductsBill.forEach((value, index) => {
          if (!productsBill.find(item => item.id === value.id)) {
            array_unique.push(value);
          }
        });
        productsBill = array_unique.concat(productsBill);
        this.setState({
          statusTab: false
        });
      } else if(getStoreProductsBill !== null
        && getStoreProductsBill.length > 0
        && this.state.statusTab == false
      ) {
        let array_unique = [];
        this.state.productsBill.forEach((value, index) => {
          if (!productsBill.find(item => item.id === value.id)) {
            array_unique.push(value);
          }
        });
        productsBill = array_unique.concat(productsBill);
      }
      this.setState({
        productsBill :  productsBill,
        priceTotal: priceTotal,
        discountPriceTotal: priceTotal / 10,
        discountAfter: priceTotal - (priceTotal / 10)
      });
    }
    if (prevProps.products !== this.props.products) {
      if (prevProps.products.length > 0) {
        localStorage.setItem('productsBill', JSON.stringify(this.state.productsBill));
        this.setState({
          statusTab: true
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

  submitOrders(e) {
    e.preventDefault();
    let date = new Date();
    let dateFormat = JSON.parse(JSON.stringify(date));
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
      'orderThucDons': orderProducts,
      'thanhTien': this.state.priceTotal,
      'tongGia': this.state.discountAfter,
      'trangThaiOrder': 'DA_THANH_TOAN'
    };
    // this.props.dispatch(Orders.actions.orders(null, data));
    this.props.dispatch(Orders.actions.orders(null, data)).then((res) =>{
      this.createNotification('success');
    }).catch((reason) =>{
      this.createNotification('error');
    });
  }

  clearFormOrder() {
    this.setState({
      productsBill :  [],
      priceTotal: 0,
      discountPriceTotal: 0,
      discountAfter: 0,
      statusTab: false
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
              Số:<span className="number">0000123</span>
            </p>
            <p className="date-bill">
              Thời gian: {this.state.dateOrder}
              <span className="time-bill">{this.state.date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}).replace(/(:\d{2}| [AP]M)$/, "")}</span>
            </p>
          </div>
          <div className="right-header">
            <button className="btn-copy-bill">
              Copy hóa đơn trước
            </button>
            <div className="table-box">
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
                  <Item_Bill key = {i} data = {item} updateQuantum = {this.updateQuantum}/>
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
          <button className="fill-again" onClick={this.clearFormOrder.bind(this)}>
            Nhập lại
          </button>
          <button className="save">
            Lưu
          </button>
          <button className="pay" onClick={this.submitOrders.bind(this)}>
            Thanh Toán
          </button>
        </div>
      </div>
      </div>
    );
  }
}

Bill_Order.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    productsBill: state.productsBill,
    orders: state.orders,
    categories: state.categories,
    products: state.products
  }
}

export default connect(bindStateToProps)(Bill_Order);

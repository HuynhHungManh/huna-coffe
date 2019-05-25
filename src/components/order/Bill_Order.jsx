import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Bill from './Item_Bill.jsx';
import {PropTypes} from 'prop-types';
import {Orders} from 'api';

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
      date: new Date()
    }
  }

  componentWillMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
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
      let productsBill = [];
      let priceTotal = 0;
      this.props.productsBill.forEach((item, index) => {
        item.quantum = 1;
        item.priceAndQuantum = item.quantum * item.donGia;
        priceTotal = priceTotal + item.priceAndQuantum;
        productsBill.push(item);
      });
      console.log(productsBill);
      this.setState({
        productsBill :  productsBill,
        priceTotal: priceTotal,
        discountPriceTotal: priceTotal / 10,
        discountAfter: priceTotal - (priceTotal / 10)
      });
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
    console.log(this.state.discountPriceTotal);
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
    this.props.dispatch(Orders.actions.orders(null, data));
  }

  render() {
    return(
      <div className="bill-order-block">
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
          <button className="fill-again">
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
    );
  }
}

Bill_Order.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    productsBill: state.productsBill,
    orders: state.orders
  }
}

export default connect(bindStateToProps)(Bill_Order);

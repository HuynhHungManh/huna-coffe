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
    this.state = {
      productsBill: [],
      priceTotal: 0,
      discountPriceTotal: 0,
      discountAfter: 0
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.productsBill !== this.props.productsBill) {
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

  submitOrders() {
    let data = {
      'Content-Type': 'application/json',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': "Bearer eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..JNHKc4rBGOpKndlv.E0cC0NUw_LCZvU9FT1YWaAkMKNM4zWOpupoN566dCdcQlCg3m91GL8T9lHWb_pviMa4FgYBbfQaAB8bvKcm9cvmdk2t6YWXgi_cI5cnTkUwva4ynBSM94JLjWObhuRT4GMHEB9SZH2ZyMSP_MFp0ZDrREymfPCnv0wsy5KY9VISNxw7ykJqVAcrkQ6kauW2xtFdKfJ8JtdADwH94Gv7N5yX9VZmj5XQ1NQLCeQScPCtXUJGWKj0iNqRPJSLmMGwG4s9oomyejXwdPhQPbeDCDl9btCiOb_40pim-DOU8Be9KEf1o9RrXNsYuGuA0UGFR6ZaH6GREaVsXnd4qpt3t.Xv9USee085LY3Vyr99Xs2Q",
      "khuyenMai": 3,
      "ngayOrder": "2019-01-24T11:55:02.619Z",
      "orderThucDons": [
        {
          "donGia": 2,
          "khuyenMai": 0,
          "ngayOrder": "2019-01-24T11:55:02.619Z",
          "soLuong": 2,
          "thanhTien": 1,
          "thucDonId": 1,
          "tongGia": 0
        }
      ],
      "thanhTien": 0,
      "tongGia": 321,
      "trangThaiOrder": "DA_THANH_TOAN"
    }
    this.props.dispatch(Orders.actions.orders(data));
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
              Thời gian: 25/03/2019
              <span className="time-bill">11:08</span>
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

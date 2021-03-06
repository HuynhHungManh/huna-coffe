import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Bill from './Item_Bill.jsx';

class Bill_Order extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render(){
    const items = [
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
      { name: "Cà Phê Sữa SG",
        price: "25.000",
        quantum: "1",
        totalPrice: "25.000"
      },
    ];
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
              items.map((item, i) => {
                return (
                  <Item_Bill key = {i} data = {item}/>
                )
              })
            }
          </div>
        </div>
        <div className="bill-results">
          <div className="calculate-tmp">
            <p className="text">Tạm tính</p>
            <p className="text-results">150.000đ</p>
          </div>
          <div className="discount">
            <p className="text">Chiếc khấu</p>
            <input className="inp-discount" name="discount" type="text" placeholder=""/>
            <div className="bg-discount">
              <p className="discount-text">13.500đ</p>
            </div>
          </div>
          <div className="discount-after">
            <p className="text">Sau chiếc khấu</p>
            <p className="text-results">150.000đ</p>
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
          <button className="pay">
            Thanh Toán
          </button>
        </div>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
  }
}

export default connect(bindStateToProps)(Bill_Order);

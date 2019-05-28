import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Orders} from 'api';
import Moment from 'moment';
import moment from 'moment';
import {DatetimePickerTrigger} from 'rc-datetime-picker';
import 'rc-datetime-picker/dist/picker.css';

class TableTemporaryBill extends Component {
  constructor(props, context) {
    super(props, context);
    let date = new Date();
    let dateTodayFormat = JSON.parse(JSON.stringify(date));
    this.state = {
      dateOreder: dateTodayFormat,
      getOrders: [],
      priceTotal: 0,
      priceDiscount: 0,
      billTotal: 0,
      moment: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(moment) {
    this.setState({
      moment: moment
    });
  }

  componentWillMount() {
    console.log(moment().toJSON());
    this.props.dispatch(Orders.actions.getOrders({ngayOrder: this.state.dateOreder})).then((res) => {
      console.log(res.data);
      if (res.data) {
        let data = res.data.content;
        this.setState({
          getOrders :  data,
          billTotal: res.data.totalElements
        });
        let priceTotal = 0;
        let priceDiscount = 0;
        data.forEach(function(item, index) {
          priceTotal = priceTotal + item.thanhTien;
          priceDiscount = priceDiscount + item.tongGia;
        });
        this.setState({
          priceTotal :  priceTotal,
          priceDiscount: priceTotal - priceDiscount
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    var hiddenInputElement = document.getElementById("example-datepicker");
    if (prevProps.getOrders !== this.props.getOrders) {
      console.log(this.props.getOrders);
      this.setState({
        getOrders :  this.props.getOrders
      });
    }
  }

  getDate (jsonDate) {
    let currentdate = new Date(jsonDate);
    let datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth()+1)  + "/"
      + currentdate.getFullYear();

    let hoursDiff = currentdate.getHours() - currentdate.getTimezoneOffset() / 60;
    let minutesDiff = (currentdate.getHours() - currentdate.getTimezoneOffset()) % 60;

    return datetime + " " + hoursDiff + ":" + minutesDiff;
  }

  render() {
    const shortcuts = {
      'Today': moment(),
      'Yesterday': moment().subtract(1, 'days'),
      'Clear': ''
    };

    return(
      <div className="show-order-block">
        <div className="search-order-block">
          <div className="search-box">
            <input type="text" className="search-order" placeholder="Tìm kiếm ..." readOnly />
          </div>
          <div className="datepicker-box">
            <DatetimePickerTrigger
              shortcuts={shortcuts}
              moment={this.state.moment}
              onChange={this.handleChange}>
              <input type="text" className="datetime-picker" value={this.state.moment.format('YYYY-MM-DD HH:mm')} readOnly />
            </DatetimePickerTrigger>
          </div>
        </div>
        <div className="content-block">
          <div className="price-box">
            <div className="price-total">
              <p className="text">Tổng tiền thu đươc trong ca</p>
              <p className="price-text"><span className="price-text-color">{this.state.priceTotal.toLocaleString()} đ</span></p>
            </div>
            <div className="discount-total">
              <p className="text">Tổng tiền chiếc khấu trong ca</p>
              <p className="price-text"><span className="price-discount-color">{this.state.priceDiscount.toLocaleString()} đ</span></p>
            </div>
            <div className="bill-total">
              <p className="text">Tổng hóa đơn bán trong ca</p>
              <p><span className="bill-total-text">{this.state.billTotal}</span></p>
            </div>
          </div>
          <div className="table-box">
            <table className="tmp-bill">
              <thead>
                <tr>
                  <th>Mã số</th>
                  <th>Thòi gian</th>
                  <th>Bàn số</th>
                  <th>In lúc</th>
                  <th>Tổng tiền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
            </table>
            <div className="table-scroll">
              <table className="tmp-bill">
                <tbody>
                  {
                    this.state.getOrders.map((item, i) => {
                      return (
                        <tr key = {i}>
                          <td>0000123</td>
                          <td>{this.getDate(item.ngayOrder)}</td>
                          <td>5</td>
                          <td>-</td>
                          <td>{item.tongGia}</td>
                          <td><button>Hủy bán</button><button>Xem order</button><button>Thanh toán</button></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TableTemporaryBill.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    getOrders: state.getOrders
  }
}

export default connect(bindStateToProps)(TableTemporaryBill);

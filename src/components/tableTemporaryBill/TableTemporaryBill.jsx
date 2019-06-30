import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Orders, TotalPromotion } from 'api';
import moment from 'moment';
import {DatetimePickerTrigger} from 'rc-datetime-picker';
import 'rc-datetime-picker/dist/picker.css';
import Modal from 'react-modal';
Modal.setAppElement('body');
import NumberFormat from 'react-number-format';
import Alert from 'react-s-alert';

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
      moment: moment(),
      statusPopup: false,
      optionCancel: [],
      valueCancel: 1,
      idItemCurrent: '',
      modelCurrent: '',
      orderThucDons: [],
      viewOrderPriceTotal: 0,
      viewOrderPriceDiscount: 0,
      viewOrderAfterDiscount: 0,
      totalPromotion: 0
    };
    this.handleChange = this.handleChange.bind(this);
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

  handleChange(moment) {
    this.setState({
      moment: moment
    });
    this.props.dispatch(Orders.actions.getOrders({ngayOrder: moment.toJSON()}));
  }

  componentWillMount() {
    let dataCacheOrder = JSON.parse(localStorage.getItem('dataCacheOrder'));
    if (dataCacheOrder) {
      this.setState({
        getOrders: dataCacheOrder.getOrders,
        billTotal: dataCacheOrder.billTotal,
        priceTotal: dataCacheOrder.priceTotal,
        priceDiscount: dataCacheOrder.priceDiscount
      });
    }
    this.props.dispatch(Orders.actions.getOrders({ngayOrder: this.state.dateOreder}));
    this.props.dispatch(TotalPromotion.actions.totalPromotion({ngayOrder: this.state.dateOreder}));
    // this.props.dispatch(Orders.actions.getOrders({ngayOrder: this.state.dateOreder})).then((res) => {
    //   if (res.data) {
    //     let data = res.data.content;
    //     this.setState({
    //       getOrders :  data,
    //       billTotal: res.data.totalElements
    //     });
    //     let priceTotal = 0;
    //     let priceDiscount = 0;
    //     data.forEach(function(item, index) {
    //       priceTotal = priceTotal + item.thanhTien;
    //       priceDiscount = priceDiscount + item.tongGia;
    //     });
    //     this.setState({
    //       priceTotal :  priceTotal,
    //       priceDiscount: priceTotal - priceDiscount
    //     });
    //   }
    // });
    this.props.dispatch(Orders.actions.ressonCancelOrders({ngayOrder: this.state.dateOreder})).then((res) => {
      if (res.data) {
        this.setState({
          optionCancel: res.data
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.orders !== this.props.orders && this.props.orders.content) {
      let data = this.props.orders;
      this.setState({
        getOrders :  data.content,
        billTotal: data.totalElements
      });
      // console.log(this.state.getOrders);
      let priceTotal = 0;
      let priceDiscount = 0;
      data.content.forEach(function(item, index) {
        priceTotal = priceTotal + item.tongGia;
        // priceDiscount = priceDiscount + item.tongGia;
      });
      this.setState({
        priceTotal :  priceTotal,
        priceDiscount: priceTotal - priceDiscount
      });
      let dataCache = {
        getOrders: data.content,
        billTotal: data.totalElements,
        priceTotal: priceTotal,
      };
      localStorage.setItem('dataCacheOrder', JSON.stringify(dataCache));
    }
    if (prevProps.totalPromotion !== this.props.totalPromotion) {
      this.setState({
        totalPromotion: this.props.totalPromotion.tongChietKhau
      });

    }
    // if (prevProps.numberTable !== this.props.numberTable) {
    //   numberTable
    //   this.setState({
    //     numberTable: this.props.numberTable
    //   });
    // }
  }

  getDate(jsonDate) {
    let currentdate = new Date(jsonDate);
    let datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth()+1)  + "/"
      + currentdate.getFullYear();

    let hoursDiff = currentdate.getHours() - currentdate.getTimezoneOffset() / 60;
    let minutesDiff = (currentdate.getHours() - currentdate.getTimezoneOffset()) % 60;

    return datetime + " " + hoursDiff + ":" + minutesDiff;
  }

  cancelItemBill(id) {
    this.setState({
      statusPopup: true,
      idItemCurrent: id,
      modelCurrent: 'cancelForm'
    });
  }

  handleChangeDropDown(event) {
    if (event.target.value) {
      this.setState({
        valueCancel: event.target.value
      });
    }
  }

  closeCancelForm() {
    this.setState({
      statusPopup: false
    });
  }

  cancelOrder(id) {
    // console.log(this.state.valueCancel);
    this.props.dispatch(Orders.actions.cancelOrders({idOrder: id}, {'lyDoHuyOrderId': 0})).then((res) => {
      this.props.dispatch(Orders.actions.getOrders({ngayOrder: this.state.dateOreder}));
    })
    .catch((e) => {
      this.alertNotification('Bạn không thể hủy order!', 'error');
    });
  }

  viewOrder(id) {
    this.props.dispatch(Orders.actions.orderThucDons({orderId: id})).then((res) => {
      if (res.data) {
        let priceTotal = 0;
        let priceDiscount = 0;
        let afterDiscount = 0;
        res.data.forEach(function(item, index) {
          priceTotal = priceTotal + item.tongGia;
        });
        priceDiscount = (priceTotal * 10) / 100;
        afterDiscount = priceTotal - priceDiscount;
        this.setState({
          orderThucDons: res.data,
          statusPopup: true,
          idItemCurrent: id,
          modelCurrent: 'viewOrder',
          viewOrderPriceTotal: priceTotal,
          viewOrderPriceDiscount: priceDiscount,
          viewOrderAfterDiscount: afterDiscount
        });
      }
    });

  }

  printOrder() {
    // const mainProcess = window.require("electron").remote.require('./print.js');
    // mainProcess.print('123');
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
              <p className="price-text"><span className="price-text-color">
                <NumberFormat value={this.state.priceTotal ? this.state.priceTotal : 0} displayType={'text'} thousandSeparator={true} /> đ
              </span></p>
            </div>
            <div className="discount-total">
              <p className="text">Tổng tiền chiếc khấu trong ca</p>
              <p className="price-text"><span className="price-discount-color">
                <NumberFormat value={this.state.totalPromotion ? this.state.totalPromotion : 0} displayType={'text'} thousandSeparator={true} /> đ
              </span></p>
            </div>
            <div className="bill-total-tmp">
              <p className="text">Tổng hóa đơn bán trong ca</p>
              <p><span className="bill-total-text">{this.state.billTotal}</span></p>
            </div>
          </div>
          <div className="table-box">
            <div className="header-table-order">
              <div className="header-tb code-h">Mã số</div>
              <div className="header-tb time-h">Thòi gian</div>
              <div className="header-tb table-h">Bàn số</div>
              <div className="header-tb print-h">In lúc</div>
              <div className="header-tb price-h">Tổng tiền</div>
              <div className="header-tb button-h">Thao tác</div>
            </div>
            <div className="table-scroll">
              <table className="tmp-bill">
                <thead>
                  <tr>
                    <th width="8%">Mã số</th>
                    <th width="20%">Thòi gian</th>
                    <th width="9%">Bàn số</th>
                    <th width="10%">In lúc</th>
                    <th width="13%">Tổng tiền</th>
                    <th width="40%">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.getOrders.map((item, i) => {
                      return (
                        <tr key = {i}>
                          <td width="8%">0000123</td>
                          <td width="20%">{this.getDate(item.ngayOrder)}</td>
                          <td width="9%">5</td>
                          <td width="10%">-</td>
                          <td width="13%">
                            <NumberFormat value={item.tongGia} displayType={'text'} thousandSeparator={true} /> đ
                          </td>
                          <td width="40%">
                            <button className="btn cancel-table btn-active" onClick={this.cancelItemBill.bind(this, item.id)}>
                              Hủy HĐ
                            </button>
                            <button className="btn view-order-btn btn-active" onClick={this.viewOrder.bind(this, item.id)}>
                              Xem order
                            </button>
                            <button className="btn print-btn btn-active" onClick={this.printOrder.bind(this)}>
                              In
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.statusPopup}
          contentLabel="Modal"
          className="modal popup info-plus"
        >
        { this.state.modelCurrent == 'cancelForm' ?
            <div className="cancel-order-block">
              <div className="header-order-block">
                <span className="close-cancel-form icon-cross" onClick={this.closeCancelForm.bind(this)}></span>
                <p>Bạn có chắc muốn hủy hóa đơn</p>
                <p><span className="code-text">0000123</span> không? Vui lòng chọn lý do</p>
                <p>hủy bên dưới và xác nhận</p>
              </div>
              <div className="dropdown-block">
                <select className="checkbox-inp-block dropdown-cancel-order"
                  value={this.state.valueCancel}
                  onChange={this.handleChangeDropDown.bind(this)}
                >
                {
                  this.state.optionCancel.map((item, i) => {
                    return (
                      <option value={item.id} key={i}>{item.ten}</option>
                    )
                  })
                }
                </select>
              </div>
              <div className="cancel-footer">
                <button className="btn close-add-info" onClick={this.closeCancelForm.bind(this)}>
                  Không
                </button>
                <button className="btn yes-cancel" onClick={this.cancelOrder.bind(this, this.state.idItemCurrent)}>
                  Có
                </button>
              </div>
            </div>
          :
            <div className="view-order-block">
              <div className="header-view-order">
                <p className="text-title">0000123</p>
                <p className="close-model" onClick={this.closeCancelForm.bind(this)}>X</p>
              </div>
              <div className="table-view-order-content">
                <table className="table-view-order display-header">
                  <thead>
                    <tr>
                      <th>MẶT HÀNG</th>
                      <th>ĐƠN GIÁ</th>
                      <th>SL</th>
                      <th>CK</th>
                      <th>TỔNG TIỀN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.orderThucDons.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td>{item.tenThucDon}</td>
                            <td>{item.donGia}</td>
                            <td>{item.soLuong}</td>
                            <td>{item.chietKhau}</td>
                            <td>
                              <NumberFormat value={item.tongGia} displayType={'text'} thousandSeparator={true} /> đ
                            </td>
                          </tr>
                        )
                      })
                    }

                  </tbody>
                </table>
              </div>
              <div className="footer-view-order">
                <div className="view-order-price-tmp">
                  <div className="title-left">
                    <p className="title-text">
                      Thời gian: <span className="bold">25/02/2015  11:08</span>
                    </p>
                  </div>
                  <div className="title-right">
                    Tạm tính:
                  </div>
                  <div className="price-right">
                    <span className="bold">
                      <NumberFormat value={this.state.viewOrderPriceTotal} displayType={'text'} thousandSeparator={true} /> đ
                    </span>
                  </div>
                </div>
                <div className="view-order-discount">
                  <div className="title-left">
                    <p className="title-text">
                      Thu ngân: <span className="bold">Nguyễn Thị Mai</span>
                    </p>
                  </div>
                  <div className="title-right">
                    Chiếc khấu  <span className="bold">10%</span>:
                  </div>
                  <div className="price-right">
                    <span className="bold">
                      <NumberFormat value={this.state.viewOrderPriceDiscount} displayType={'text'} thousandSeparator={true} /> đ
                    </span>
                  </div>
                </div>

                <div className="view-order-after-discount">
                  <div className="title-left">
                    <p className="title-text">
                      Bàn số: <span className="bold">05</span>
                    </p>
                  </div>
                  <div className="title-right">
                    Sau chiết khấu:
                  </div>
                  <div className="price-right">
                    <span className="bold red">
                      <NumberFormat value={this.state.viewOrderAfterDiscount} displayType={'text'} thousandSeparator={true} /> đ
                    </span>
                  </div>
                </div>


                <div className="view-order-custumer-price">
                  <div className="title-left">
                    <p className="title-text tmp">
                      tmp
                    </p>
                  </div>
                  <div className="title-right">
                    Tiền khách đưa:
                  </div>
                  <div className="price-right">
                    <span className="bold">122,500 đ</span>
                  </div>
                </div>

                <div className="view-order-back-price">
                  <div className="title-left">
                    <p className="title-text tmp">
                      tmp
                    </p>
                  </div>
                  <div className="title-right">
                    Tiền thối lại:
                  </div>
                  <div className="price-right">
                    <span className="bold">122,500 đ</span>
                  </div>
                </div>
              </div>
              <div className="view-order-footer">
                <button className="btn close-add-info" onClick={this.closeCancelForm.bind(this)}>
                  Đóng
                </button>
                <button className="btn cancel-table" onClick={this.closeCancelForm.bind(this)}>
                  Hủy Bàn
                </button>
                <button className="btn pay" onClick={this.cancelOrder.bind(this, this.state.idItemCurrent)}>
                  Thanh Toán
                </button>
              </div>
            </div>
        }
        </Modal>
      </div>
    );
  }
}

TableTemporaryBill.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    orders: state.orders,
    totalPromotion: state.totalPromotion
  }
}

export default connect(bindStateToProps)(TableTemporaryBill);

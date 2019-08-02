import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Orders, TotalPromotion, TotalPrice} from 'api';
import moment from 'moment';
import {DatetimePickerTrigger} from 'rc-datetime-picker';
import 'rc-datetime-picker/dist/picker.css';
import Modal from 'react-modal';
Modal.setAppElement('body');
import NumberFormat from 'react-number-format';
import Alert from 'react-s-alert';
import ReactToPrint from 'react-to-print';
import ComponentToPrint from './ComponentToPrint.jsx';
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import Spinner from 'react-spinkit';
import ReactDOMServer from 'react-dom/server';
import DragScrollProvider from 'drag-scroll-provider';

class TableTemporaryBill extends Component {
  constructor(props, context) {
    super(props, context);
    this.componentRef =[];
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
      totalPromotion: 0,
      orderDetail: [],
      isLoadingOrder: false,
      viewDateOrder: '',
      numberTable: '',
      promotionBill: 0,
      priceCustomerCash: 0,
      priceCustomerCard: 0,
      priceCustomerTransfer: 0,
      priceCustomerBack: 0,
      formality: '',
      statusOrder: '',
      codeOrder: '',
      auth: ''
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
    this.setState({
      auth: JSON.parse(localStorage.getItem('auth'))
    });
    // localStorage.removeItem('dataCacheOrder');
    // let dataCacheOrder = JSON.parse(localStorage.getItem('dataCacheOrder'));
    // if (dataCacheOrder) {
    //   this.setState({
    //     getOrders: dataCacheOrder.getOrders,
    //     billTotal: dataCacheOrder.billTotal,
    //     priceDiscount: dataCacheOrder.priceDiscount
    //   });
    // }
    this.props.dispatch(Orders.actions.getOrders({ngayOrder: this.state.dateOreder})).then((res) => {
      if (res.data.content && res.data.content.length > 0) {
        let arrayTmpDetail = [];
        this.setState({
          isLoadingOrder: true,
          billTotal: res.data.content.length
        });
        let data = res.data;
        let arrayTmp = [];
      } else if (res.data.content && res.data.content.length == 0) {
        this.setState({
          isLoadingOrder: true
        });
      }
    });
    this.props.dispatch(TotalPromotion.actions.totalPromotion({ngayOrder: this.state.dateOreder}));
    this.props.dispatch(TotalPrice.actions.totalPrice({ngayOrder: this.state.dateOreder}));
    this.props.dispatch(Orders.actions.ressonCancelOrders({ngayOrder: this.state.dateOreder})).then((res) => {
      if (res.data) {
        this.setState({
          optionCancel: res.data
        });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.orders !== this.props.orders) {
      let data = this.props.orders;
      if (data.content) {
        this.setState({
          getOrders: data.content,
          billTotal: data.content.length
        });
      }
    }
    if (prevProps.totalPromotion !== this.props.totalPromotion) {
      this.setState({
        totalPromotion: this.props.totalPromotion.tongChietKhau
      });
    }
    if (prevProps.totalPrice !== this.props.totalPrice) {
      this.setState({
        priceTotal: this.props.totalPrice.tongTien
      });
    }
  }

  getDate(jsonDate) {
    let currentdate = new Date(jsonDate);
    let datetime = currentdate.getDate() + "/"
      + (currentdate.getMonth()+1)  + "/"
      + currentdate.getFullYear();

    let hours = (currentdate.getHours() < 10 ? '0' : '') + currentdate.getHours();
    let minutes = (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes();
    return hours + ":" + minutes;
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
    this.props.dispatch(Orders.actions.cancelOrders({idOrder: id}, {'lyDoHuyOrderId': Number(this.state.valueCancel)}))
    .then((res) => {
      this.props.dispatch(Orders.actions.getOrders({ngayOrder: this.state.dateOreder}));
      this.alertNotification('Bạn đã hủy thành công!', 'success');
      this.closeCancelForm();
    })
    .catch((e) => {
      this.alertNotification('Bạn không thể hủy order!', 'error');
    });
  }

  viewOrder(id) {
    this.props.dispatch(Orders.actions.orderThucDons({orderId: id})).then((res) => {
      if (res.data) {
        let priceDiscount = 0;
        let dataOrder = this.state.getOrders.find(item => item.id == id);
        let promotionBill = 0;
        let data = res.data;
        let status = '';

        data.forEach(function(item, index) {
          item.promotion = Math.round((item.khuyenMai / item.donGia) * 100);
        });
        if (dataOrder) {
          status = dataOrder.textTrangThaiOrder ? dataOrder.textTrangThaiOrder : '';
        }
        this.setState({
          orderThucDons: data,
          statusPopup: true,
          idItemCurrent: id,
          modelCurrent: 'viewOrder',
          viewOrderPriceTotal: dataOrder.tongGia,
          viewOrderPriceDiscount: dataOrder.tienKhuyenMai ? dataOrder.tienKhuyenMai : 0,
          viewOrderAfterDiscount: dataOrder.thanhTien ? dataOrder.thanhTien : 0,
          viewDateOrder: dataOrder ? dataOrder.ngayOrder : '',
          priceCustomerCash: dataOrder.tienKhachDua ? dataOrder.tienKhachDua : 0,
          priceCustomerCard: dataOrder.tienCaThe ? dataOrder.tienCaThe : 0,
          priceCustomerTransfer: dataOrder.tienChuyenKhoan ? dataOrder.tienChuyenKhoan : 0,
          priceCustomerBack: dataOrder.tienThoiLai ? dataOrder.tienThoiLai : 0,
          numberTable: dataOrder && dataOrder.soBan != 0 ? dataOrder.soBan : 'Mang về',
          promotionBill: dataOrder.khuyenMai ? dataOrder.khuyenMai : 0,
          statusOrder: status,
          codeOrder: dataOrder.ma ? dataOrder.ma : ''
        });
      }
    });
  }

  printOrder(item) {
    let data = {
      tienKhachDua: item.tienKhachDua ? item.tienKhachDua : 0,
      tienCaThe: item.tienCaThe ? item.tienCaThe : 0,
      tienChuyenKhoan: item.tienChuyenKhoan ? item.tienChuyenKhoan : 0,
      tienThoiLai: item.tienThoiLai ? item.tienThoiLai : 0,
      thanhTien: item.thanhTien ? item.thanhTien : 0,
      orderThucDons: [],
      khuyenMai: item.khuyenMai ? item.khuyenMai : 0,
      soBan: item.soBan
    };
    let date = new Date(item.ngayOrder);
    let dateOrder = ('0' + date.getDate()).slice(-2) + '/'
                 + ('0' + (date.getMonth()+1)).slice(-2) + '/'
                 + date.getFullYear();
    let timePrint = date.getHours() + ':' + date.getMinutes();
    this.props.dispatch(Orders.actions.orderThucDons({orderId: item.id})).then((res) => {
      if (res.data) {
        let dataDetail = res.data;
        let orderThucDonsArray = [];
        dataDetail.forEach((item, index) => {
          let orderThucDons = {
            ten: item.tenThucDon,
            soLuong: item.soLuong,
            khuyenMai: item.khuyenMai,
            donGia: item.donGia,
            thanhTien: item.thanhTien
          }
          orderThucDonsArray.push(orderThucDons);
        });
        data.orderThucDons = orderThucDonsArray;
        const mainProcess = window.require("electron").remote.require('./print.js');
        let info = {
          phone : '0935080123',
          cashier: this.state.auth.hoVaTen,
          codeOrder: item.ma,
          dateOrder: dateOrder,
          timePrint: timePrint,
          passWifi: 'hunacoffee.com'
        };
        let html = ReactDOMServer.renderToStaticMarkup(
          <ComponentToPrint data = {data} auth = {this.state.auth} info = {info}/>
        );
        console.log(html);
        mainProcess.print(html, 'none', 'none');
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.orders !== this.props.orders){
      this.setState({
        isLoading : false
      });
    }
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
              minDate={this.state.moment}
              showTimePicker={false}
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
              <p className="text">Tổng tiền chiết khấu trong ca</p>
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
              <div className="header-tb time-h">Thời gian</div>
              <div className="header-tb table-h">Bàn số</div>
              <div className="header-tb print-h">In lúc</div>
              <div className="header-tb price-h">Tổng tiền</div>
              <div className="header-tb button-h">Thao tác</div>
            </div>
            <DragScrollProvider>
              {({ onMouseDown, ref }) => (
                <div
                  className="table-scroll scrollable"
                  ref={ref}
                  onMouseDown={onMouseDown}>
                    <table className="tmp-bill">
                    <thead>
                      <tr>
                        <th width="15%">Mã số</th>
                        <th width="13%">Thòi gian</th>
                        <th width="9%">Bàn số</th>
                        <th width="10%">In lúc</th>
                        <th width="13%">Tổng tiền</th>
                        <th width="40%">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      { !this.state.isLoadingOrder &&
                        <tr className ="display-background">
                          <td><Spinner name="circle" /></td>
                        </tr>
                      }
                      { this.state.isLoadingOrder &&
                        this.state.getOrders.map((item, i) => {
                          return (
                            <tr key = {i}>
                              <td width="15%">{item.ma}</td>
                              <td width="13%">{this.getDate(item.ngayOrder)}</td>
                              <td width="9%">{item.soBan}</td>
                              <td width="10%">-</td>
                              <td width="13%">
                                <NumberFormat value={item.thanhTien} displayType={'text'} thousandSeparator={true} /> đ
                              </td>
                              <td width="40%">
                                <button className="btn cancel-table btn-active" onClick={this.cancelItemBill.bind(this, item.id)}>
                                  Hủy HĐ
                                </button>
                                <button className="btn view-order-btn btn-active" onClick={this.viewOrder.bind(this, item.id)}>
                                  Xem order
                                </button>
                                <button className="btn print-btn btn-active" onClick={this.printOrder.bind(this, item)}>
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
              )}
            </DragScrollProvider>
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
                <p><span className="code-text">{this.state.codeOrder}</span> không? Vui lòng chọn lý do</p>
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
                <p className="text-title">{this.state.codeOrder}</p>
                <p className="close-model" onClick={this.closeCancelForm.bind(this)}><span className="icon-cross"></span>
                </p>
              </div>
              <DragScrollProvider>
                {({ onMouseDown, ref }) => (
                  <div className="table-view-order-content scrollable"
                    ref={ref}
                    onMouseDown={onMouseDown}>
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
                                <td>
                                  <NumberFormat value={item.donGia} displayType={'text'} thousandSeparator={true} /> đ
                                </td>
                                <td>{item.soLuong}</td>
                                <td>{item.khuyenMai}%</td>
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
                )}
              </DragScrollProvider>
              <div className="footer-view-order">
                <div className="view-order-price-tmp">
                  <div className="title-left">
                    <p className="title-text">
                      Thời gian: <span className="bold">{this.state.viewDateOrder}</span>
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
                      Thu ngân: <span className="bold">{this.state.auth.hoVaTen}</span>
                    </p>
                  </div>
                  <div className="title-right">
                    Chiết khấu  <span className="bold"> {this.state.promotionBill}%</span>:
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
                      Bàn số: <span className="bold">{this.state.numberTable}</span>
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
                    <p className="title-text">
                      Trạng thái:
                    </p>
                    <p className="title-text-right">
                      {this.state.statusOrder}
                    </p>
                  </div>
                  <div className="title-right">
                    Tiền khách đưa:
                  </div>
                  <div className="price-right">
                    <span className="bold">
                      <NumberFormat value={this.state.priceCustomerCash ? this.state.priceCustomerCash : 0} displayType={'text'} thousandSeparator={true} /> đ
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
                    Tiền quẹt thẻ:
                  </div>
                  <div className="price-right">
                    <span className="bold">
                      <NumberFormat value={this.state.priceCustomerCard ? this.state.priceCustomerCard : 0} displayType={'text'} thousandSeparator={true} /> đ
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
                    Tiền chuyển khoản:
                  </div>
                  <div className="price-right">
                    <span className="bold">
                      <NumberFormat value={this.state.priceCustomerTransfer ? this.state.priceCustomerTransfer : 0} displayType={'text'} thousandSeparator={true} /> đ
                    </span>
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
                    <span className="bold">
                      <NumberFormat value={this.state.priceCustomerBack} displayType={'text'} thousandSeparator={true} /> đ
                    </span>
                  </div>
                </div>
              </div>
              <div className="view-order-footer">
                <button className="btn close-add-info" onClick={this.closeCancelForm.bind(this)}>
                  Đóng
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
    totalPromotion: state.totalPromotion,
    totalPrice: state.totalPrice
  }
}

export default connect(bindStateToProps)(TableTemporaryBill);

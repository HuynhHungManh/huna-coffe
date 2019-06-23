import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Orders} from 'api';
import moment from 'moment';
import {DatetimePickerTrigger} from 'rc-datetime-picker';
import 'rc-datetime-picker/dist/picker.css';
import Modal from 'react-modal';
Modal.setAppElement('body');
import NumberFormat from 'react-number-format';
import Alert from 'react-s-alert';

class TableStoreTmp extends Component {
  constructor(props, context) {
    const optionCancel = [
      {
        'ten': 'Khách đợi lâu',
        id: 1
      },
      {
        'ten': 'Khách bận',
        id: 2
      },
      {
        'ten': 'Order quá lâu',
        id: 3
      },
      {
        'ten': 'Quán bị sự cố',
        id: 4
      }
    ];
    super(props, context);
    this.state = {
      orderListData: [],
      orderThucDons: [],
      statusPopup: false,
      indexItemCurrent: '',
      modelCurrent: 'viewOrder',
      viewOrderPriceTotal: 0,
      viewOrderPriceDiscount: 0,
      viewOrderAfterDiscount: 0,
      optionCancel: optionCancel,
      timeCurrentOrder: 0,
      tableCurrentOrder: ''
    }
  }

  componentWillMount() {
    let orderListTmp = JSON.parse(localStorage.getItem('orderListTmp'));
    if (orderListTmp && orderListTmp.length > 0) {
      orderListTmp.forEach((item, index) => {
        if (!item.statusCancel) {
          item.statusCancel = false;
        }
        if (!item.statusSuccess) {
          item.statusSuccess = false;
        }
      });
    }
    this.setState({
      orderListData: orderListTmp ? orderListTmp : []
    });
  }

  // cancelTable(index) {
  //   this.setState({
  //     statusPopup: true,
  //     indexItemCurrent: index,
  //     modelCurrent: 'cancelForm',
  //   });
  // }

  cancelItemTable(index) {
    let listData = this.state.orderListData;
    if (listData[index]) {
      listData.splice(index, 1);
      this.setState({
        orderListData: listData,
        statusPopup: false
      });
      localStorage.setItem('orderListTmp', JSON.stringify(listData));
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

  viewOrder(index) {
    let priceTotal = 0;
    let priceDiscount = 0;
    let afterDiscount = 0;
    let dataOrder = this.state.orderListData;
    dataOrder[index].orderThucDons.forEach(function(item, index) {
      priceTotal = priceTotal + item.thanhTien;
    });
    priceDiscount = (priceTotal * 10) / 100;
    afterDiscount = priceTotal - priceDiscount;
    this.setState({
      orderThucDons: dataOrder[index].orderThucDons,
      statusPopup: true,
      indexItemCurrent: index,
      modelCurrent: 'viewOrder',
      viewOrderPriceTotal: priceTotal,
      viewOrderPriceDiscount: priceDiscount,
      viewOrderAfterDiscount: afterDiscount,
      timeCurrentOrder: this.getDate(dataOrder[index].ngayOrder),
      tableCurrentOrder: dataOrder[index].soBan
    });
  }

  closeCancelForm() {
    this.setState({
      statusPopup: false
    });
  }

  handleChangeDropDown(event) {
    if (event.target.value) {
      this.setState({
        valueCancel: event.target.value
      });
    }
  }

  orderStore(index) {
    let data = this.state.orderListData[index];
    this.props.dispatch(Orders.actions.orders(null, data)).then((res) => {
      let orderListData = this.state.orderListData;
      orderListData.splice(index, 1);
      this.setState({
        orderListData: orderListData,
        statusPopup: false
      });
      let date = new Date();
      let timeCopy = date.getHours() + ":" + date.getMinutes();
      let copyProductsBill = {
        productsBill: data.productsBill,
        priceTotal: data.priceTotal,
        discountPriceTotal: data.discountPriceTotal,
        discountAfter: data.discountAfter,
        dateCopy: timeCopy,
        dateOrder: data.dateOrder
      }
      this.alertNotification('Bạn đã order thành công!', 'success');
      localStorage.setItem('orderListTmp', JSON.stringify(orderListData));
      localStorage.setItem('copyProductsBill', JSON.stringify(copyProductsBill));
    }).catch((reason) => {
      this.alertNotification('Order không thành công!', 'error');
    });
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

  render() {
    return(
      <div className="show-order-block">
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
                this.state.orderListData.map((item, i) => {
                  return (
                    <tr key ={i} className={
                      classnames('row-table', {
                        'cancel-text' : item.statusCancel,
                        'success-text' : item.statusSuccess
                      })}
                    >
                      <td width="8%">1231221</td>
                      <td width="20%">{this.getDate(item.ngayOrder)}</td>
                      <td width="9%">
                        { item.soBan == ""
                          ? ' Mang về'
                          : item.soBan
                        }
                      </td>
                      <td width="10%">-</td>
                      <td width="13%">{item.tongGia}</td>
                      <td width="40%">
                        <button className={
                          classnames('btn cancel-table', {
                            'hidden' : item.statusCancel || item.statusSuccess
                          })}
                          onClick = {this.cancelItemTable.bind(this, i)}
                        >
                          Hủy Bàn
                        </button>
                        <button className={
                          classnames('btn view-order-btn', {
                            'hidden' : item.statusCancel || item.statusSuccess
                          })}
                          onClick={this.viewOrder.bind(this, i)}
                        >
                          Xem order
                        </button>
                        <button className={
                          classnames('btn print-btn', {
                            'hidden' : item.statusCancel || item.statusSuccess
                          })}
                          onClick ={this.orderStore.bind(this, i)}
                        >
                          Thanh Toán
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
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
                <p>Bạn có chắc muốn hủy bàn</p>
                <p><span className="code-text">
                { this.state.tableCurrentOrder == ""
                  ? ' Mang về'
                  : this.state.tableCurrentOrder
                }
                </span> không? Vui lòng chọn lý do</p>
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
                <button className="btn yes-cancel" onClick={this.cancelItemTable.bind(this)}>
                  Có
                </button>
              </div>
            </div>
          :
            <div className="view-order-block">
              <div className="header-view-order">
                <p className="text-title">0000123</p>
                <p className="close-model" onClick={this.closeCancelForm.bind(this)}>
                  <span className="close-model-icon icon-cross"></span>
                </p>
              </div>
              <div className="table-header-view-order">
                <div className="table-header item-h">
                  MẶT HÀNG
                </div>
                <div className="table-header bill-h">
                  ĐƠN GIÁ
                </div>
                <div className="table-header quantum-h">
                  SỐ LƯỢNG
                </div>
                <div className="table-header total-h">
                  TỔNG TIỀN
                </div>
              </div>
              <div className="table-view-order-content">
                <table className="table-view-order">
                  <thead>
                    <tr>
                      <th width="35%">MẶT HÀNG</th>
                      <th width="20%">ĐƠN GIÁ</th>
                      <th width="20%">SỐ LƯỢNG</th>
                      <th width="25%">TỔNG TIỀN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.orderThucDons.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td>{item.ten}</td>
                            <td>{item.donGia}</td>
                            <td>{item.soLuong}</td>
                            <td>
                              <NumberFormat value={item.thanhTien - item.tongGia} displayType={'text'} thousandSeparator={true} /> đ
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
                      Thời gian: <span className="bold">{this.state.timeCurrentOrder}</span>
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
                      Bàn số:
                      <span className="bold">
                        { this.state.tableCurrentOrder == ""
                          ? ' Mang về'
                          : this.state.tableCurrentOrder
                        }
                      </span>
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
                <button className="btn cancel-table" onClick={this.cancelItemTable.bind(this, this.state.indexItemCurrent)}>
                  Hủy Bàn
                </button>
                <button className="btn pay" onClick={this.orderStore.bind(this, this.state.indexItemCurrent)}>
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

TableStoreTmp.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    orders: state.orders
  }
}

export default connect(bindStateToProps)(TableStoreTmp);

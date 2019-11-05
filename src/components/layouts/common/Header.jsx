import React ,{ Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Shift} from 'api';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import ReactDOMServer from 'react-dom/server';
import {Orders, TotalPromotion, TotalPrice} from 'api';
import Modal from 'react-modal';
Modal.setAppElement('body');
import  MultiSelectReact  from 'multi-select-react';
import NumberFormat from 'react-number-format';
import Switch from "react-switch";
import classnames from 'classnames';

class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hoVaTen: 'Anonymous',
      page: '',
      statusPopup: false,
      listPrinter: [],
      listPrinterTmp: [],
      type: '',
      totalPromotion: 0,
      checkedAutoPromotion: true,
      checkOnline: !this.props.checkOffline,
      checkedAutoPromotionTMP: true,
      checkOnlineTMP: !this.props.checkOffline,
      isRemoveCache: false,
      isRemoveCacheTMP: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCheckOnline = this.handleChangeCheckOnline.bind(this);
  }

  handleChange(checked) {
    this.setState({ checkedAutoPromotionTMP: checked });
  }

  handleChangeCheckOnline(checked) {
    this.setState({ checkOnlineTMP: checked });
  }

  changeOnline (isOffline) {
    return {
      type: 'CHECK_OFFLINE',
      isOffline
    }
  }

  componentWillMount() {
    if(window.location.href.indexOf('temporary-bill') !== -1) {
      this.setState({
        page : 'Thống Kê'
      })
    } else if(window.location.href.indexOf('store-tmp') !== -1) {
      this.setState({
        page : 'Hóa Đơn Lưu Tạm'
      })
    } else {
      this.setState({
        page : 'Order'
      })
    }
    let auth = JSON.parse(localStorage.getItem('auth'));
    if (auth.hoVaTen) {
      this.setState({
        hoVaTen : auth.hoVaTen
      });
    }
  }

  changeStatusAuto(key) {
    return {
      type: 'STATUS_AUTO_LOAD_PROMOTION',
      key
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.totalPromotion !== this.props.totalPromotion) {
      this.setState({
        totalPromotion: this.props.totalPromotion.tongChietKhau ? this.props.totalPromotion.tongChietKhau : 0
      });
    }
    
    if (prevProps.checkOffline !== this.props.checkOffline) {
      this.setState({
        checkOnlineTMP: !this.props.checkOffline
      });
    }
  }

  minimazScreen() {
    const mainProcess = window.require("electron").remote.require('./minimum.js');
    mainProcess.minimum();
  }
  
  templateShift(data) {
    return(
      <div>
        <p style={{textAlign: 'center'}}><strong>THÔNG TIN KẾT CA</strong></p>
        <p style={{textAlign: 'center'}}>Thu ngân: {data.casher}</p>
        <p style={{textAlign: 'center'}}>Thời gian kết ca: {data.timeShift}</p>
        <p style={{textAlign: 'center'}}>------------------</p>
        <ul>
          <li>Số hóa đơn đã bán : {data.invoices}</li>
          <li>Số hóa đơn chiết khấu: {data.invoicesPromotion}</li>
          <li>Số hóa đơn đã hủy: {data.invoicesCancel}</li>
          <li>Tổng tiền trong ca: <NumberFormat value={data.soldMoney} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
          </li>
          <li>Tiền mặt: <NumberFormat value={data.cashMoney} displayType={'text'} thousandSeparator={true} suffix={' đ'}/></li>
          <li>Tiền quẹt thẻ: <NumberFormat value={data.cardMoney} displayType={'text'} thousandSeparator={true} suffix={' đ'}/></li>
          <li>Tiền chuyển khoản: <NumberFormat value={data.transferMoney} displayType={'text'} thousandSeparator={true} suffix={' đ'}/></li>
          <li>Tiền chiết khấu: <NumberFormat value={this.state.totalPromotion} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
          </li>
          <li>Tiền quản lý bàn giao: <NumberFormat value={data.managementMoney} displayType={'text'} thousandSeparator={true} suffix={' đ'}/></li>
        </ul>
      </div>
    )
  }

  confirmShift() {
    this.setState({
      type: 'confirmShift',
      statusPopup: true
    });
  }

  handleShift() {
    const date = new Date();
    let dateTodayFormat = JSON.parse(JSON.stringify(date));
    this.props.dispatch(Shift.actions.shift()).then((res) => {
      if (res.data) {
        const dateFormat = new Date(res.data.thoiGianKichCa);
        const day = dateFormat.getDate();
        const month = dateFormat.getMonth() + 1;
        const year = dateFormat.getFullYear();
        const hours = dateFormat.getHours();
        const minutes = "0" + dateFormat.getMinutes();
        const seconds = "0" + dateFormat.getSeconds();
        const formattedTime = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        let data = {
          timeShift: formattedTime,
          managementMoney: res.data.tienQuanLyDua,
          soldMoney: res.data.tongTienDaBan,
          casher: this.state.hoVaTen,
          invoices: res.data.soHoaDonDaBan,
          invoicesPromotion: res.data.soHoaDonChietKhau,
          invoicesCancel: res.data.soHoaDonDaHuy,
          cashMoney: res.data.tienMat,
          cardMoney: res.data.tienQuetThe,
          transferMoney: res.data.tienChuyenKhoan,
        }
        const htmlShift = ReactDOMServer.renderToStaticMarkup(this.templateShift(data));
        try {
          const mainProcess = window.require("electron").remote.require('./print.js');
          mainProcess.print('none', 'none', 'none', htmlShift);
        }
        catch(err) {
          this.alertNotification('Kiểm tra máy in!', 'error');
        }
        this.props.dispatch(Orders.actions.getOrders({ngayOrder: dateTodayFormat})).then((res) => {
        })
        .catch((err) => {
          this.alertNotification('Lỗi kết ca!', 'error');
        });
        this.props.dispatch(TotalPromotion.actions.totalPromotion({ngayOrder: dateTodayFormat}));
        this.props.dispatch(TotalPrice.actions.totalPrice({ngayOrder: dateTodayFormat}));  
        this.alertNotification('Bạn kết ca thành công!', 'success');
        this.setState({
          statusPopup: false
        }); 
      } else {
        this.alertNotification('kết ca không thành công!', 'error');
      }
    })
    .catch((err) => {
      this.alertNotification('kết ca không thành công!', 'error');
    });
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

  optionClicked(optionsList) {
    this.setState({ listPrinterTmp: optionsList });
    localStorage.setItem('storePrinter', JSON.stringify(optionsList.filter(item => item.value && item.value == true)));
  }
  selectedBadgeClicked(optionsList) {
    this.setState({ listPrinterTmp: optionsList });
    localStorage.setItem('storePrinter', JSON.stringify(optionsList.filter(item => item.value && item.value == true)));
  }

  closeModel() {
    this.setState({
      statusPopup: false
    });

    if (this.state.type == 'configsApp') {
      this.setState({
        checkedAutoPromotionTMP : this.state.checkedAutoPromotion,
        checkOnlineTMP : this.state.checkOnline,
        isRemoveCacheTMP: this.state.isRemoveCache
      });
    }
  }

  getPrinter(list) {
    let getStorePrinters = JSON.parse(localStorage.getItem('storePrinter'));
    if (list && list.length > 0) {
      let arrayTmp = [];
      list.forEach((item, index) => {
        let info = {
          label: item.name,
          id: index
        };
        if (getStorePrinters && getStorePrinters.length > 0 && getStorePrinters.find(value => value.label == item.name)) {
          info.value = true;
        }
        arrayTmp.push(info);
      });
      this.setState({
        listPrinter: arrayTmp
      });
    }
  }

  openConfigs() {
    this.setState({
      statusPopup: true,
      type: 'configsApp'
    });
  }

  dispatchOrders(data) {
    var dataStore = [];
    this.props.dispatch(Orders.actions.orders(null, data)).then((res) => {
      if (data.lyDoHuyOrderId && data.id) {
        this.props.dispatch(Orders.actions.cancelOrders({idOrder: data.id}, {'lyDoHuyOrderId': Number(this.state.valueCancel)}));
      }
      dataStore = this.props.storeOrder.filter(item => item.isPrinter != data.id);
      this.props.dispatch(this.dispatchStoreOrder(dataStore));
    });
  }

  dispatchStoreOrder(storeOrder) {
    return {
      type: 'STORE_ORDER',
      storeOrder
    }
  }

  syncOffline() {
    const order = this.props.storeOrder;
    if (order) { 
      for (let i = 0; i < order.length ; i++) {
        this.dispatchOrders(order[i]);
      };
    }
  }

  saveConfigs() {
    this.setState({
      checkedAutoPromotion: this.state.checkedAutoPromotionTMP,
      statusPopup: false
    });
    this.props.dispatch(this.changeStatusAuto(this.state.checkedAutoPromotionTMP));

    if (!this.state.checkOnlineTMP != this.props.checkOffline) {
      this.setState({
        type: 'confirmCheckOnline',
        statusPopup: true
      });
    }

    if (this.state.isRemoveCacheTMP == true) {
      localStorage.removeItem('storeData');
      localStorage.removeItem('checkOnlyShowPopup');
    }

  }

  confirmChange() {
    this.props.dispatch(this.changeOnline(!this.state.checkOnlineTMP));
    this.setState({
      checkOnline: this.state.checkOnlineTMP,
      statusPopup: false
    });
    this.syncOffline();
  }

  closeModelAffterConfirm() {
    this.setState({
      statusPopup: false,
      checkOnlineTMP: this.state.checkOnline
    });
  }

  toggleChange() {
    this.setState({
      isRemoveCacheTMP: !this.state.isRemoveCacheTMP,
    });
  }

  render() {
    return (
      <header className="box-header">
        <div className="container">
          <img className="logo" src={require('assets/images/logo/logo-huna.png')}></img>
          <p className="title-page">
            <span className="title">{this.state.page}</span>
          </p>
          <div className="account-info-box">
            <span 
              className={
              classnames('icon3-connection', {
                'icon3-connection offline' : this.props.checkOffline,
              })}
            >
              {
                this.props.checkOffline ? 
                  <span className="icon-cross"></span>
                : ""
              }
            </span>
            <span className="icon3-cog" onClick={this.openConfigs.bind(this)}></span>
            <span className="icon-users" onClick={this.confirmShift.bind(this)}></span>
            <p className="account-text">
              Xin chào:
              <span className="text">{this.state.hoVaTen}</span>
              <span className="icon-shrink" onClick={this.minimazScreen.bind(this)}></span>
            </p>
          </div>
        </div>
        <Modal
          isOpen={this.state.statusPopup}
          contentLabel="Modal"
          className="modal popup"
        >
        { 
          this.state.type == 'getPrinter' ?
          <div className="printer-block">
            <div className="printer-header">
              <p className="text-title">Chọn máy in</p>
              <span className="icon-cross" onClick={this.closeModel.bind(this)}></span>
            </div>
            <div className="printer-content">
              <MultiSelectReact 
                className="dropdown-printer"
                options={this.state.listPrinter}
                optionClicked={this.optionClicked.bind(this)}
                selectedBadgeClicked={this.selectedBadgeClicked.bind(this)}
              />
            </div>
            <div className="printer-footer">
              <button className="btn close-button" onClick={this.closeModel.bind(this)}>
                Đóng
              </button>
              <button className="btn handle-configs" onClick={this.saveConfigs.bind(this)}>
                Lưu
              </button>
            </div>
          </div>
          : ""
        }
        {
          this.state.type == 'confirmShift' ?
          <div className="shift-block">
            <div className="shift-header">
              <p className="text-title">Kết ca</p>
              <span className="icon-cross" onClick={this.closeModel.bind(this)}></span>
            </div>
            <div className="shift-content">
              <p>Bạn có muốn kết ca ?</p>
            </div>
            <div className="shift-footer">
              <button className="btn close-button" onClick={this.closeModel.bind(this)}>
                Đóng
              </button>
              <button className="btn handle-shift" onClick={this.handleShift.bind(this)}>
                Xác nhận
              </button>
            </div>
          </div>
          : ""
        }
        { 
          this.state.type == 'configsApp' ?
          <div className="configs-block">
            <div className="configs-header">
              <p className="text-title">Cài đặt</p>
              <span className="icon-cross" onClick={this.closeModel.bind(this)}></span>
            </div>
            <div className="configs-content">
              <div className="item-block">
                <div className="title">
                  Tự động cập nhập khuyến mãi: 
                </div>
                <div className="content">
                  <div className="switch-checkbox">
                    <Switch
                      className="react-switch"
                      onChange={this.handleChange}
                      checked={this.state.checkedAutoPromotionTMP}
                      aria-labelledby="neat-label"
                      height={26}
                    />
                  </div>
                </div>
              </div>
              <div className="item-block">
                <div className="title">
                  Trạng thái: 
                  <span className={
                    classnames('text-color-green', {
                      'text-color-red' : !this.state.checkOnlineTMP,
                    })}
                  >
                    {
                      this.state.checkOnlineTMP == true 
                      ?
                        ' ONLINE'
                      :
                        ' OFFLINE'
                    }
                  </span> 
                </div>
                <div className="content">
                  <div className="switch-checkbox">
                    <Switch
                      className="react-switch"
                      onChange={this.handleChangeCheckOnline}
                      checked={this.state.checkOnlineTMP}
                      aria-labelledby="neat-label"
                      height={26}
                    />
                  </div>
                </div>
              </div>
              <div className="item-block">
                <div className="title">
                  Xóa cache:
                </div>
                <div className="content">
                  <input type="checkbox" className="cb-remove-cache"
                    checked={this.state.isRemoveCacheTMP}
                    onChange={this.toggleChange.bind(this)}
                  />
                </div>
              </div>
            </div>
            <div className="configs-footer">
              <button className="btn close-button" onClick={this.closeModel.bind(this)}>
                Đóng
              </button>
              <button className="btn handle-configs" onClick={this.saveConfigs.bind(this)}>
                Lưu
              </button>
            </div>
          </div>
          : ""
        }
        {
          this.state.type == 'confirmCheckOnline' ?
            <div className="check-online-block">
              <div className="check-online-header">
                <p className="text-title">Xác nhận</p>
                <span className="icon-cross" onClick={this.closeModel.bind(this)}></span>
              </div>
              <div className="check-online-content">
                <p>Bạn có muốn chuyển ứng dụng sang 
                  <span 
                    className={
                    classnames('text-color-green', {
                      'text-color-red' : !this.state.checkOnlineTMP,
                    })}
                  >
                    {
                      this.state.checkOnlineTMP ?
                      ' ONLINE ' :
                      ' OFFLINE '
                    }
                  </span> 
                ?</p>
                {
                  this.state.checkOnlineTMP && this.props.storeOrder &&  this.props.storeOrder.length > 0
                  ?
                    <div>
                      <p>Có
                        <span className="text-color-red"> {this.props.storeOrder.length} </span>
                         hóa đơn offline, hệ thống sẽ chuyển sang online</p>
                      <p>sau khi đồng bộ đến server.</p>
                    </div>
                  : ""
                }
              </div>
              <div className="check-online-footer">
                <button className="btn close-button" onClick={this.closeModelAffterConfirm.bind(this)}>
                  Đóng
                </button>
                <button className="btn handle-check-online" onClick={this.confirmChange.bind(this)}>
                  Xác nhận
                </button>
              </div>
            </div>
          : ""
        }
        </Modal>
      </header>
    );
  }
}

Header.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    totalPromotion: state.totalPromotion,
    storeOrder: state.storeOrder,
    checkOffline: state.checkOffline
  }
}

export default connect(bindStateToProps)(Header);

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
      totalPromotion: 0
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.totalPromotion !== this.props.totalPromotion) {
      this.setState({
        totalPromotion: this.props.totalPromotion.tongChietKhau ? this.props.totalPromotion.tongChietKhau : 0
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
          <li>Số hóa đơn đã bán : chưa cập nhập</li>
          <li>Số hóa đơn chiết khấu: chưa cập nhập</li>
          <li>Số hóa đơn đã hủy: chưa cập nhập</li>
          <li>Tổng tiền trong ca: <NumberFormat value={data.soldMoney} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
          </li>
          <li>Tiền được thanh toán: chưa cập nhập</li>
          <li>Tiền chiết khấu: <NumberFormat value={this.state.totalPromotion} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
          </li>
          <li>Tiền quản lý bàn giao: chưa cập nhập</li>
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
    let date = new Date();
    let dateTodayFormat = JSON.parse(JSON.stringify(date));
    this.props.dispatch(Shift.actions.shift()).then((res) => {
      if (res.data) {
        var date = new Date(res.data.thoiGianKichCa);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        let data = {
          timeShift: formattedTime,
          managementMoney: res.data.tienQuanLyDua,
          soldMoney: res.data.tongTienDaBan,
          casher: this.state.hoVaTen
        }
        const htmlShift = ReactDOMServer.renderToStaticMarkup(this.templateShift(data));
        try {
          const mainProcess = window.require("electron").remote.require('./print.js');
          mainProcess.print(htmlShift, 'none', 'none');
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

  choosePrinter() {
    this.setState({
      statusPopup: true,
      type: 'getPrinter'
    });
    const mainProcess = window.require("electron").remote.require('./getPrint.js');
    mainProcess.getPrint(this.getPrinter.bind(this));
  }

  savePrinter() {
    if (this.state.listPrinterTmp.length > 0) {
      this.setState({
        listPrinter: this.state.listPrinterTmp
      });
    }
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
            <span className="icon-printer" onClick={this.choosePrinter.bind(this)}></span>
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
              <button className="btn" onClick={this.closeModel.bind(this)}>
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
    totalPromotion: state.totalPromotion
  }
}

export default connect(bindStateToProps)(Header);

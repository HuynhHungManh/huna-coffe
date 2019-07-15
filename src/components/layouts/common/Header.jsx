import React ,{ Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Shift} from 'api';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import ReactDOMServer from 'react-dom/server';

class Header extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hoVaTen: 'Anonymous',
      page: ''
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

  minimazScreen() {
    const mainProcess = window.require("electron").remote.require('./minimum.js');
    mainProcess.minimum();
  }
  
  templateShift(data) {
    return(
      <div>
        <p style={{textAlign: 'center'}}><strong>Hóa đơn kích ca</strong></p>
        <ul>
          <li>Thời gian kích ca: {data.timeShift}</li>
          <li>Tiền quản lý đưa: {data.managementMoney}</li>
          <li>Tổng tiền đã bán: {data.soldMoney}</li>
          <li>Thu ngân: {data.casher}</li>
        </ul>
      </div>
    )
  }

  handleShift() {
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
        // const mainProcess = window.require("electron").remote.require('./print.js');
        // let html = ReactDOMServer.renderToStaticMarkup(this.templateShift(data));
        // console.log(html);
        // mainProcess.print(html);
        this.alertNotification('Bạn kích ca thành công!', 'success');
      } else {
        this.alertNotification('Kích ca không thành công!', 'error');
      }
    })
    .catch((err) => {
      this.alertNotification('Kích ca không thành công!', 'error');
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

  render() {
    return (
      <header className="box-header">
        <div className="container">
          <img className="logo" src={require('assets/images/logo/logo-huna.jpg')}></img>
          <p className="title-page">
            <span className="title">{this.state.page}</span>
          </p>
          <div className="account-info-box">
            <span className="icon-users" onClick={this.handleShift.bind(this)}></span>
            <p className="account-text">
              Xin chào:
              <span className="text">{this.state.hoVaTen}</span>
              <span className="icon-shrink" onClick={this.minimazScreen.bind(this)}></span>
            </p>
          </div>
        </div>
      </header>
    );
  }
}

Header.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {}
}

export default connect(bindStateToProps)(Header);

import React ,{ Component } from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import Spinner from 'react-spinkit';
import classnames from 'classnames';
Modal.setAppElement('body');
import {Auth} from 'api';
import Alert from 'react-s-alert';
import {PropTypes} from 'prop-types';

class Footer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tabs: [
        {
          name: 'Order',
          id: 1,
          status: false,
          url: '/order'
        },
        {
          name: 'Hóa Đơn Lưu Tạm',
          id: 2,
          status: false,
          url: '/store-tmp'
        },
        {
          name: 'Thống Kê',
          id: 3,
          status: false,
          url: '/temporary-bill'
        },
        {
          name: 'Đăng Xuất',
          id: 4,
          status: false,
          url: '/'
        },
      ],
      statusPopup: false
    }
  }

  componentWillMount() {
    this.state.tabs.forEach((item, index) => {
      if (window.location.href.indexOf(item.url) !== -1) {
        if (item.url == '/order' || item.url == '/temporary-bill' ||  item.url == '/store-tmp') {
          item.status = true;
        } 
        // else {
        //   JSON.parse(localStorage.removeItem('auth'));
        // }
      }
      // if (item.id === idTab) {
      //   item.status = true;
      // }
      // preTabs.push(item);
    })
    let location = 'temporary-bill';
    if(window.location.href.indexOf(location) !== -1) {
      this.setState({
        page : 'Thống Kê'
      })
    } else {
      this.setState({
        page : 'Order'
      })
    }
  }

  chooseTab(idTab, url) {
    let itemSelected = this.state.tabs.find(value => value.status === true);
    let preTabs = [];
    this.state.tabs.forEach((item, index) => {
      if (item.id === itemSelected.id) {
        item.status = false;
      }
      if (item.id === idTab) {
        item.status = true;
      }
      preTabs.push(item);
    });
    this.setState({
      tabs : preTabs
    })
    if (url == '/' && idTab == 4) {
      this.setState({
        statusPopup: true
      });
    } else {
      this.gotoPage(url);
    }
  }

  confirmLogout() {
    this.props.dispatch(Auth.actions.logout())
    .then((res) => {
      this.alertNotification('Bạn đã đăng xuất thành công!', 'success');
      this.setState({
        statusPopup: false
      }, () => {
        this.gotoPage('/');
      });
    })
    .catch((err) => {
      this.alertNotification('Đăng xuất bị lỗi!', 'error');
    });
  }

  gotoPage(page) {
    this.context.router.history.push(page);
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

  closeModel() {
    this.setState({
      statusPopup: false
    });
    this.chooseTab(1, '/order');
  }

  render() {
    return (
      <footer className="footer">
        <div className="container-footer">
          { this.state.tabs &&
            this.state.tabs.map((item, i) => {
              return (
                <div key={i} className="tab">
                  <a className={
                    classnames("tab-link", {
                      "active" : item.status,
                    })} onClick={this.chooseTab.bind(this, item.id, item.url)}>{item.name}</a>
                </div>
              )
            })
          }
        </div>
        <Modal
          isOpen={this.state.statusPopup}
          contentLabel="Modal"
          className="modal popup"
        >
          <div className="shift-block">
            <div className="shift-header">
              <p className="text-title">Đăng xuất</p>
              <span className="icon-cross" onClick={this.closeModel.bind(this)}></span>
            </div>
            <div className="shift-content">
              <p>Bạn có muốn đăng xuất ?</p>
            </div>
            <div className="shift-footer">
              <button className="btn close-button" onClick={this.closeModel.bind(this)}>
                Đóng
              </button>
              <button className="btn handle-shift" onClick={this.confirmLogout.bind(this)}>
                Xác nhận
              </button>
            </div>
          </div>
        </Modal>
      </footer>
    );
  }
}

Footer.contextTypes = {
  router: PropTypes.object
};

const bindStateToProps = (state) => {
  return {
    documents: state.documents || []
  }
}

export default connect(bindStateToProps)(Footer);

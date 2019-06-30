import React ,{ Component } from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import Spinner from 'react-spinkit';
import classnames from 'classnames';
Modal.setAppElement('body');
import {Auth} from 'api';
import Alert from 'react-s-alert';

class Footer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tabs: [
        {
          name: 'Order',
          id: 1,
          status: false,
          url: '/coffee'
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
    }
  }

  componentWillMount() {
    this.state.tabs.forEach((item, index) => {
      if (window.location.href.indexOf(item.url) !== -1) {
        if (item.url == '/coffee' || item.url == '/temporary-bill' ||  item.url == '/store-tmp') {
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
      this.props.dispatch(Auth.actions.logout())
      .then((res) => {
        // localStorage.removeItem('auth');
        this.alertNotification('Bạn đã đăng xuất thành công!', 'success');
      });
    }
    this.gotoPage(url);
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
      </footer>
    );
  }
}

Footer.contextTypes = {
  router: React.PropTypes.object
};

const bindStateToProps = (state) => {
  return {
    documents: state.documents || []
  }
}

export default connect(bindStateToProps)(Footer);

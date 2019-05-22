import React ,{ Component } from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import Spinner from 'react-spinkit';
import classnames from 'classnames';
Modal.setAppElement('body');

class Footer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tabs: [
        {
          name: 'Order',
          id: 1,
          status: true
        },
        {
          name: 'Hóa Đơn Lưu Tạm',
          id: 2,
          status: false
        },
        {
          name: 'Thống Kê',
          id: 3,
          status: false
        },
        {
          name: 'Đăng Xuất',
          id: 4,
          status: false
        },
      ],
    }
  }
  chooseTab(idTab) {
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
                    })} onClick={this.chooseTab.bind(this, item.id)}>{item.name}</a>
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

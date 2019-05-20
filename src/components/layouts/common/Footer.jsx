import React ,{ Component } from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import Spinner from 'react-spinkit';
Modal.setAppElement('body');

class Footer extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <footer className="footer">
        <div className="container-footer">
          <div className="order-tab">
            <a className="order-tab-link" href="">Order</a>
          </div>
          <div className="bill-tmp-tab">
            <a className="bill-tmp-link" href="">Hóa Đơn Lưu Tạm</a>
          </div>
          <div className="statistical-tab">
            <a className="statistical-link" href="">Thống Kê</a>
          </div>
          <div className="logout-tab">
            <a className="logout-link" href="">Đăng Xuất</a>
          </div>
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

import React from 'react';
import Modal from 'react-modal';

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      statusPopup : false
    }
  }

  gotoPage(page) {
    this.context.router.history.push(page);
  }

  showPopupBackHome(){
    this.setState({
      statusPopup : !this.state.statusPopup
    })
  }

  render() {
    return (
      <footer className="footer footer-pdf">
        <div className="container">
          <button className="btn-icon home btn-action-back" id="btn-back-home" onClick={this.showPopupBackHome.bind(this)}><i className="icon icon-home"/><span className="space-home">Trang chủ</span></button>
        </div>
        <Modal
          isOpen={this.state.statusPopup}
          contentLabel="Modal"
          className="modal popup"
          overlayClassName={{}}
        >
          <div className="modal-back-home">
            <img className="btn-close-modal close-modal" src={require('assets/images/icon/close.svg')} onClick={this.showPopupBackHome.bind(this)}/>
            <h3 className="notification">
              Bạn có muốn rời khỏi trang này
            </h3>
            <div className="button-notification">
              <button className="btn message-no btn-action-cancel btn-cancel" onClick={this.showPopupBackHome.bind(this)}>Không</button>
              <button className="btn message-yes btn-action-back" onClick={this.gotoPage.bind(this,'/')}>Có</button>
            </div>
          </div>
        </Modal>
      </footer>
    );
  }
}

Footer.contextTypes = {
  router: React.PropTypes.object
};

export default Footer;

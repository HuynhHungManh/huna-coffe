import React from 'react';
import Modal from 'react-modal';

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      statusPopup : false
    }
    this.print = this.print.bind(this);
  }

  gotoPage(page) {
    this.context.router.history.push(page);
  }

  showPopupBackHome() {
    this.setState({
      statusPopup : !this.state.statusPopup
    })
  }

  // handlePrint() {
  //   this.ref.print.print();
  //   console.log(this.ref.print);
  // }
  print() {
    this.pdf.print();
 }

  render() {
    console.log(this.context.router.route.match.path);
    return (
      <footer className="footer footer-pdf">
        <embed type="application/pdf" width="0" height="0" src="http://localhost:8080/wp-content/uploads/2017/09/compressed.tracemonkey-pldi-09.pdf" ref={(ref) => this.pdf = ref}/>
        <div className="container">
          <button className="btn-icon home btn-action-back" id="btn-back-home" onClick={this.showPopupBackHome.bind(this)}><i className="icon icon-home"/><span className="space-home">Trang chủ</span></button>
          { this.context.router.route.match.path === '/procedure-detail/:id' &&
            <div className="box-print">
              <button className="btn print-document left"><span className="icon-print" /><span className="text-print" onClick={this.myPrint}><span>IN BIỂU MẪU TRẮNG</span></span></button>
              <button className="btn print-document left"><span className="icon-print" /><span className="text-print" />IN BIỂU MẪU SẴN</button>
            </div>
          }
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

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

  showPopupBackHome() {
    this.setState({
      statusPopup : !this.state.statusPopup
    })
  }

  printPDF() {
    var pdfFrame = window.frames["pdf"];
    pdfFrame.focus();
    pdfFrame.print();
    // pdfFrame.close();

    // var pp = getPrintParams(); // Get printing parameters
    // pp.interactive = pp.constants.interactionLevel.automatic; // Do not prompt user
    // pp.printerName = 'PDFCreator'; // Set printer name
    // this.print(pp); // Print
  }


  render() {

    return (
      <footer className="footer footer-pdf">
        <div className="container">
          <iframe id="pdf" name="pdf" src={`./lib-pdf/web/viewer.html?file=${"http://192.168.0.117:8080/wp-content/uploads/2017/09/compressed.tracemonkey-pldi-09.pdf"}`}  width="0" height="0"/>
          <button className="btn-icon home btn-action-back" id="btn-back-home" onClick={this.showPopupBackHome.bind(this)}><i className="icon icon-home"/><span className="space-home">Trang chủ</span></button>
          { this.context.router.route.match.path === '/procedure-detail/:id' &&
            <div className="box-print">
              <button className="btn print-document left"><span className="icon-print" /><span className="text-print" onClick={this.printPDF.bind(this)}><span>IN BIỂU MẪU TRẮNG</span></span></button>
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

import React from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';

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

  printPDF(typeDoc) {
    const mainProcess = window.require("electron").remote.require('./print.js');

    if(typeDoc === 'BieuMau'){
      mainProcess.print(this.props.documents[0] && this.props.documents[0].acf.fileBieuMau.url);
    }
    else{
      mainProcess.print(this.props.documents[0] && this.props.documents[0].acf.fileBieuMauTrang.url);
    }
  }

  render() {
    return (

      <footer className="footer footer-pdf">
        <div className="container">
          {/* <iframe name="pdf" src={`./lib-pdf/web/viewer.html?file=${"http://192.168.1.196:8080/wp-content/uploads/2017/09/compressed.tracemonkey-pldi-09.pdf"}`}  width="0" height="0"/> */}
          <button className="btn-icon home btn-action-back" id="btn-back-home" onClick={this.showPopupBackHome.bind(this)}><i className="icon icon-home"/><span className="space-home">Trang chủ</span></button>
          { this.context.router.route.match.path === '/procedure-detail/:id' &&
            <div className="box-print">
              <button className="btn print-document left"><span className="icon-print" /><span className="text-print" onClick={this.printPDF.bind(this,'BieuMau')}><span>IN BIỂU MẪU TRẮNG</span></span></button>
              <button className="btn print-document left"><span className="icon-print" /><span className="text-print" onClick={this.printPDF.bind(this,'BieuMauTrang')} />IN BIỂU MẪU SẴN</button>
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

const bindStateToProps = (state) => {
  return {
    documents: state.documents || []
  }
}

export default connect(bindStateToProps)(Footer);

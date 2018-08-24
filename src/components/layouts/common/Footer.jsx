import React ,{ Component } from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import Spinner from 'react-spinkit';
Modal.setAppElement('body');

class Footer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      statusPopup : false,
      statusPopupPrint : false,
      statusNotiPrint : 'Ứng dụng đang xử lý file',
      typeFile : '',
      document : ''
    }
  }

  componentWillMount(){
    if(this.context.router.route.match.path === '/procedure-detail/:id'){
      let file = this.props.documents.find((item) => item.id == this.context.router.route.match.params.id);
      this.setState({
        document : file
      })
    }

    this.setState({
      typeFile : 'BieuMau'
    })
    this.props.dispatch(this.changeFile(''));
  }

  gotoPage(page) {
    this.context.router.history.push(page);
  }

  showPopupBackHome() {
    if(this.context.router.route.match.path !== '/feedback'){
      this.context.router.history.push('/');
    }else{
      this.setState({
        statusPopup : !this.state.statusPopup
      })
    }
  }

  hidePopupPrint() {
    this.setState({
      statusPopupPrint : false
    })
  }


  printPDF(typeDoc) {
    this.setState({
      statusPopupPrint : true
    });
    let time = 5000;
    if(this.state.document && this.state.document.acf.fileBieuMau.url.indexOf(".pdf") >= 0){
      time = 4000;
    }

    const mainProcess = window.require("electron").remote.require('./print.js');
    if(typeDoc === 'BieuMau' || typeDoc === ''){
      mainProcess.print(this.state.document && this.state.document.acf.fileBieuMau.url);
      setTimeout(function() { this.setState({statusPopupPrint: false}); }.bind(this), time);
    }
    else{
      mainProcess.print(this.state.document && this.state.document.acf.fileBieuMauHuongDan.url);
      setTimeout(function() { this.setState({statusPopupPrint: false}); }.bind(this), time);
    }
  }

  viewDocument(typeDoc) {
    if(typeDoc === 'BieuMau'){
      this.setState({
        typeFile : typeDoc
      })
      this.props.dispatch(this.changeFile(typeDoc));
    }
    else if(typeDoc === 'BieuMauTrang'){
      this.setState({
        typeFile : typeDoc
      })
    }
    this.props.dispatch(this.changeFile(typeDoc));
  }

  changeFile(data) {
    return {
      type: 'CHANGE_FILE',
      data
    }
  }

  render() {

    return (
      <footer className="footer footer-pdf">
        <div className="container">
          <button className="btn-icon home btn-action-back" id="btn-back-home" onClick={this.showPopupBackHome.bind(this)}><i className="icon icon-home"/><span className="space-home">Trang chủ</span></button>
          {
            this.context.router.route.match.path === '/find-procedure-detail/:id' &&
            <button className="btn-icon back btn-action-send" onClick={this.gotoPage.bind(this,'/find-procedure')}><i className="icon icon-arrow-left size-back btn-action-send" /><span className="space-back" >Trở về</span></button>
          }
          {
            this.context.router.route.match.path === '/search-detail/:id' &&
            <button className="btn-icon back btn-action-send" onClick={this.gotoPage.bind(this,'/search-file')}><i className="icon icon-arrow-left size-back btn-action-send" /><span className="space-back">Trở về</span></button>
          }
          {
             this.context.router.route.match.path === '/procedure-detail/:id' &&
            <button className="btn-icon back btn-action-send" onClick={this.gotoPage.bind(this,'/document')} ><i className="icon icon-arrow-left size-back btn-action-send" /><span className="space-back">Trở về</span></button>
          }
          {
             this.context.router.route.match.path === '/view-project/:id' &&
            <button className="btn-icon back btn-action-send" onClick={this.gotoPage.bind(this,'/plan')} ><i className="icon icon-arrow-left size-back btn-action-send" /><span className="space-back">Trở về</span></button>
          }
          {
             this.context.router.route.match.path === '/rating-detail/:id' &&
            <button className="btn-icon back btn-action-send" onClick={this.gotoPage.bind(this,'/rating-list')} ><i className="icon icon-arrow-left size-back btn-action-send" /><span className="space-back">Trở về</span></button>
          }
          { this.context.router.route.match.path === '/procedure-detail/:id' &&
            <div className="box-print">
              <button className="btn print-document left" onClick={this.viewDocument.bind(this,'BieuMau')}><span className="icon2-eye-outline" /><span className="text-print print-document-center" >BIỂU MẪU</span></button>
              <button className="btn print-document left" onClick={this.viewDocument.bind(this,'BieuMauTrang')}><span className="icon2-eye-outline" /><span className="text-print-guide">MẪU HƯỚNG DẪN</span></button>
              <button className="btn print-document left" onClick={this.printPDF.bind(this,this.state.typeFile)}><span className="icon-print" /><span className="text-print-guide">IN FILE BIỂU MẪU</span></button>
            </div>
          }
        </div>
        <Modal
          isOpen={this.state.statusPopup}
          contentLabel="Modal"
          className="modal popup"
        >
          <div className="modal-back-home">
            <img className="btn-close-modal close-modal" src={require('assets/images/icon/close.svg')} onClick={this.showPopupBackHome.bind(this)}/>
            <h3 className="notification">
              Bạn có muốn rời khỏi trang này ?
            </h3>
            <div className="button-notification">
              <button className="btn message-no btn-action-cancel btn-cancel" onClick={this.showPopupBackHome.bind(this)}>Không</button>
              <button className="btn message-yes btn-action-back" onClick={this.gotoPage.bind(this,'/')}>Có</button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.statusPopupPrint}
          contentLabel="Modal"
          className="modal popup"
        >
          <div className="modal-back-home">
            <img className="btn-close-modal close-modal" src={require('assets/images/icon/close.svg')} onClick={this.hidePopupPrint.bind(this)}/>
            <h3 className="notification-print">
              {this.state.statusNotiPrint !== 'error' &&
                <div>{this.state.statusNotiPrint} ,<br/>
                <span>vui lòng đợi vài giây !</span>
              </div>
              }
              {this.state.statusNotiPrint === 'error' &&
                <div>Lỗi xử lý file  ,<br/><span>vui lòng thử lại !</span></div>
              }
            </h3>
            <Spinner name="three-bounce" color="#444" className="loading-print" />
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

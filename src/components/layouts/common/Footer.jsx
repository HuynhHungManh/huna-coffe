import React ,{ Component } from 'react';
import Modal from 'react-modal';
import {connect} from 'react-redux';

class Footer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      statusPopup : false,
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

  printPDF(typeDoc) {
    var myWebview = document.getElementById('myWebview');
    console.log("myWebview: ",myWebview);

    console.log("prototype: ",Object.getPrototypeOf(myWebview)); //=> HTMLElement
    myWebview.print({silent: false});
    // setTimeout(function(){
    //   console.log('123');
    //     myWebview.print({silent: false});
    // }, 4000);
    // const mainProcess = window.require("electron").remote.require('./print.js');
    // if(typeDoc === 'BieuMau' || typeDoc === ''){
    //   mainProcess.print(this.props.documents[0] && this.props.documents[0].acf.fileBieuMau.url);
    // }
    // else{
    //   mainProcess.print(this.props.documents[0] && this.props.documents[0].acf.fileBieuMauHuongDan.url);
    // }
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
          <webview id="myWebview" src={`https://view.officeapps.live.com/op/embed.aspx?src=${this.props.documents[0] && this.props.documents[0].acf.fileBieuMau.url}`} width="500px" height="500px"></webview>
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
          overlayClassName={{}}
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

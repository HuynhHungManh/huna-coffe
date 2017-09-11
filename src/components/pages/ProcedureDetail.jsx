import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {connect} from 'react-redux';
import {Documents} from 'api';

class ProcedureDetail extends Component {

  viewFilePdf() {
    let file = this.props.documents.find((item) => item.id == this.props.match.params.id);
    return file.acf.fileBieuMau.url
  }

  render() {
    return (
      <CommonLayout>
        <div className="container">
          <div className="header">
            <h2 className="title bg-document">
              <span className="title-main">Thông Tư 40/2016/tt-btc Của Bộ Tài Chính</span>
            </h2>
          </div>
          <div className="content custom-procedure">
            <div className="view-procedure">
              <iframe className="view-pdf" src={`./lib-pdf/web/viewer.html?file=${this.viewFilePdf()}`} seamless />
            </div>
          </div>
        </div>
      </CommonLayout>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    documents: state.documents || []
  }
}

export default connect(bindStateToProps)(ProcedureDetail);

import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {connect} from 'react-redux';
import {Documents} from 'api';

class ProcedureDetail extends Component {
  constructor(props, context){
  	super(props, context);
  	this.state = {
      title: ''
    };
  }

  componentDidMount() {
    let file = this.props.documents.find((item) => item.id == this.props.match.params.id);
    this.setState({
      title: file && file.title && file.title.rendered ? file.title.rendered : ''
    })
  }

  viewFilePdf() {
    let file = this.props.documents.find((item) => item.id == this.props.match.params.id);
    return file.acf.fileBieuMau.url
  }

  Truncate() {
    let len = 0;
    let titleName = this.state.title;
    let trimmedTitle = '';
    let count=0;
    let i=0;
    for (i = 0, len = titleName.length; i < len; i++) {
      if(titleName[i]==' ') count++;
      if(count==15){
        trimmedTitle = titleName.substring(0, i) + " ...";
      break;
    } else {
        trimmedTitle = titleName.substring(0, i+1);
      }
    }
    return trimmedTitle;
  }

  render() {
    return (
      <CommonLayout>
        <div className="container">
          <div className="header">
            <h2 className="title bg-document">
              <span className="title-main">{this.Truncate()}</span>
            </h2>
          </div>
          <div className="content custom-procedure">
            <div className="view-procedure">
              { this.viewFilePdf().indexOf(".doc") >= 0 &&
                <iframe className="doc" src={`https://docs.google.com/gview?url=${this.viewFilePdf()}&embedded=true&zoom=30`} seamless/>
              }
              { this.viewFilePdf().indexOf(".pdf") >= 0 &&
                <iframe className="view-pdf" src={`./lib-pdf/web/viewer.html?file=${this.viewFilePdf()}#page=1&zoom=200`} seamless />
              }
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

import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {connect} from 'react-redux';
import {Documents} from 'api';

class ProcedureDetail extends Component {
  constructor(props, context){
  	super(props, context);
  	this.state = {
      title: '',
      typeFile: '',
      urlFile: ''
    };
  }

  componentDidMount() {
    let file = this.props.documents.find((item) => item.id == this.props.match.params.id);
    this.setState({
      title: file && file.title && file.title.rendered ? file.title.rendered : '',
    })
    if(this.state.typeFile === 'BieuMau' || this.state.typeFile === ''){
      this.setState({
        urlFile: file.acf.fileBieuMau.url
      })
    }else{
      this.setState({
        urlFile: file.acf.fileBieuMauHuongDan.url
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
      let file = this.props.documents.find((item) => item.id == this.props.match.params.id);
      if(prevProps.changeFile !== this.props.changeFile){
        this.setState({
          typeFile : this.props.changeFile
        });
        if(this.props.changeFile === 'BieuMau' || this.props.changeFile === ''){
          this.setState({
            urlFile: file.acf.fileBieuMau.url
          })
        }else if(this.props.changeFile === 'BieuMauTrang'){
          this.setState({
            urlFile: file.acf.fileBieuMauHuongDan.url
          })
        }
      }
  }

  Truncate() {
    let len = 0;
    let titleName = this.state.title;
    let trimmedTitle = '';
    let count=0;
    let i=0;
    for (i = 0, len = titleName.length; i < len; i++) {
      if(titleName[i]==' ') count++;
      if(count==19){
        trimmedTitle = titleName.substring(0, i) + " ...";
      break;
    } else {
        trimmedTitle = titleName.substring(0, i+1);
      }
    }
    return trimmedTitle;
  }

  render() {
    console.log(this.state.urlFile);
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
            { this.state.urlFile && this.state.urlFile.indexOf(".doc") >= 0 &&
                  <iframe className="view-doc" src={`https://view.officeapps.live.com/op/embed.aspx?src=${this.state.urlFile}&widget=false`} />
            }
            { this.state.urlFile && this.state.urlFile.indexOf(".pdf") >= 0 &&
                <iframe className="view-pdf" src={`./lib-pdf/web/viewer.html?file=${this.state.urlFile}#page=1&zoom=200`} seamless />
            }
            { !this.state.urlFile &&
              <p className="notification-empty">Bạn chưa cập nhập file biểu mẫu cho tệp biểu mẫu này !</p>
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
    documents: state.documents || [],
    changeFile : state.changeFile || ''
  }
}

export default connect(bindStateToProps)(ProcedureDetail);

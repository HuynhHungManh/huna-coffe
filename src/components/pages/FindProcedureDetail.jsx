import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {connect} from 'react-redux';

class FindProcedureDetail extends Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      data : this.props.procedures.data.find(item => item.data.id == this.props.match.params.id)
    }
  }

  Truncate() {
    let len = 0;
    let titleName = this.state.data.data && this.state.data.data.tenthutuc;
    let trimmedTitle = '';
    let count=0;
    let i=0;
    for (i = 0, len = titleName.length; i < len; i++) {
      if(titleName[i]==' ') count++;
      if(count==21){
        trimmedTitle = titleName.substring(0, i) + " ...";
      break;
    } else {
        trimmedTitle = titleName.substring(0, i+1);
      }
    }
    return trimmedTitle;
  }

  Subtruncate() {
    let len = 0;
    let titleName = this.state.data.data && this.state.data.data.tenthutuc;
    let trimmedTitle = '';
    let count=0;
    let i=0;
    for (i = 0, len = titleName.length; i < len; i++) {
      if(titleName[i]==' ') count++;
      if(count==37){
        trimmedTitle = titleName.substring(0, i) + " ...";
      break;
      } else {
          trimmedTitle = titleName.substring(0, i+1);
        }
    }
    return trimmedTitle;
  }

  gotoPage(page) {
    this.context.router.history.push(page);
  }

  render() {
    return (
      <CommonLayout>
        <div className="container">
        <div className="header">
          <h2 className="title bg-search-document">
            <span className="title-main">{this.Truncate()}</span>
          </h2>
        </div>
        <div className="content">
          <div className="header-procedure-detail">
            <span className="title-procedure-detail">
              {this.Subtruncate()}
            </span>
          </div>
          <div className="scroll-procedure-detail">
            <iframe name='iframe1' id="iframe1"  width="100%" height="100%" src={`http://tthc.danang.gov.vn/index.php?option=com_thutuchanhchinh&task=thutucdetailfromdb&view=thutuc&id_hethong=${this.props.match.params.id}`} seamless />
            <div className="hideButtonBack"></div>
          </div>
        </div>
      </div>
      </CommonLayout>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    procedures: state.procedures || []
  }
}

export default connect(bindStateToProps)(FindProcedureDetail);

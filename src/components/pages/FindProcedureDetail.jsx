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

  truncate() {
    let length = 70;
    let titleName = this.state.data.data && this.state.data.data.tenthutuc;
    let trimmedTitle = '';
    if(titleName.length < 70 ) {
      trimmedTitle = titleName.substring(0, Math.min(length, titleName.length));
    } else if(titleName.length > 70) {
      trimmedTitle = titleName.substring(0, Math.min(length, titleName.length)) + '.....';
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
            <span className="title-main">{this.truncate()}</span>
          </h2>
        </div>
        <div className="content">
          <div className="header-procedure-detail">
            <span className="title-procedure-detail">
              {this.truncate()}
            </span>
          </div>
          <div className="scroll-procedure-detail">
            <iframe width="100%" height="100%" src={`http://tthc.danang.gov.vn/index.php?option=com_thutuchanhchinh&task=thutucdetailfromdb&view=thutuc&id_hethong=${this.props.match.params.id}`} seamless />
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

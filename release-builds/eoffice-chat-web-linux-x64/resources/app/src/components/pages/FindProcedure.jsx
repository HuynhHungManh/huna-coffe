import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {FormFindProcedure, FormDataProcedure} from 'components/procedure';

class FindProcedure extends Component {
  render() {
    return (
      <CommonLayout>
        <div className="container">
        <div className="header">
          <h2 className="title bg-search-document">
            <span className="title-main">Tra Cứu Thủ Tục Hành Chính</span>
          </h2>
        </div>
        <div className="content">
          <FormFindProcedure />
          <FormDataProcedure />
        </div>
      </div>
      </CommonLayout>
    );
  }
}

export default FindProcedure;

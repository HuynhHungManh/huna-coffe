import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Documents} from 'api';

import {Category,DocumentList, Search} from 'components/document';

class Document extends Component {

  render() {
    return (
      <CommonLayout>
        <div className="container">
          <div className="header">
            <h2 className="title bg-document">
              <span className="title-main">Biểu mẫu điện tử</span>
            </h2>
            <Search />
          </div>
          <div className="content">
          <Category />
          <DocumentList/>
          </div>
        </div>
      </CommonLayout>
    );
  }
}

const bindStateToProps = (state) => {
  return {

  }
}

export default connect(bindStateToProps)(Document);

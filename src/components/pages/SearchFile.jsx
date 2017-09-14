import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {SearchReceipt} from 'components/searchfile';

class SearchFile extends Component {

  render() {
    return (
      <CommonLayout>
        <SearchReceipt />
      </CommonLayout>
    );
  }
}

export default SearchFile;

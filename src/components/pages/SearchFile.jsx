import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {SearchTeceipt} from 'components/searchfile';

class SearchFile extends Component {

  render() {
    return (
      <CommonLayout>
        <SearchTeceipt />
      </CommonLayout>
    );
  }
}

export default SearchFile;

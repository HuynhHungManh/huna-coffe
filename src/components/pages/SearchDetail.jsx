import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import {SearchDetailForm} from 'components/searchfile';


class SearchDetail extends Component {

  render() {
    return (
      <CommonLayout>
        <SearchDetailForm id={this.props.match.params.id}/>
      </CommonLayout>
    );
  }
}

export default SearchDetail;

import React, { Component } from 'react';
import {CommonLayout} from 'layouts';


class SearchFile extends Component {
  constructor(props, context) {
    super(props, context);
  }
  gotoPage(page) {
    this.props.history.push(page);
  }

  render() {
    return (
      <CommonLayout>
        <div className="container">
        <div className="content box-search-file">
          <h2 className="title-search-file">
            Tra cứu hồ sơ
          </h2>
          <form className="form-search-file" onSubmit={this.gotoPage.bind(this, '/search-detail')}>
            <div className="box-search-content">
              <input className="inp-search-file" type="text" placeholder="Nhập số biên nhận vào đây" />
              <button className="btn-search-file icon-zoom btn-action-back">
              </button>
            </div>
          </form>
        </div>
      </div>
      </CommonLayout>
    );
  }
}

export default SearchFile;

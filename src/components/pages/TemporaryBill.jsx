import React from 'react';
import {CommonLayout} from 'layouts';
import classnames from 'classnames';
import {Orders} from 'api';
import {TableTemporaryBill} from 'components/tableTemporaryBill';

class TemporaryBill extends React.Component {

  render() {

    return (
      <CommonLayout>
        <div className="container temporary-bill-page">
          <div className="content">
            <div className="search-block">
            </div>
            <TableTemporaryBill/>
          </div>
        </div>
      </CommonLayout>
    );
  }
}

export default TemporaryBill;

import React from 'react';
import {CommonLayout} from 'layouts';
import classnames from 'classnames';
import {TableStoreTmp} from 'components/tableStoreTmp';
import {PropTypes} from 'prop-types';

class StoreTmp extends React.Component {

  render() {
    return (
      <CommonLayout>
        <div className="container temporary-bill-page-tmp">
          <div className="content">
            <TableStoreTmp/>
          </div>
        </div>
      </CommonLayout>
    );
  }
}

export default StoreTmp;

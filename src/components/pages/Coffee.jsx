import React from 'react';
import {CommonLayout} from 'layouts';
import classnames from 'classnames';
import {Categories_Tab} from 'components/order';
import {Content_Order} from 'components/order';

class Coffee extends React.Component {

  render() {
    return (
      <CommonLayout>
        <Categories_Tab/>
        <div className="container order-content-page">
          <div className="content">
            <Content_Order/>
          </div>
        </div>
      </CommonLayout>
    );
  }
}

export default Coffee;

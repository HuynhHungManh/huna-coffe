import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {Orders} from 'api';
import moment from 'moment';
import {DatetimePickerTrigger} from 'rc-datetime-picker';
import 'rc-datetime-picker/dist/picker.css';
import Modal from 'react-modal';
Modal.setAppElement('body');
import NumberFormat from 'react-number-format';

class TableStoreTmp extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return(
      <div className="show-order-block">
        <div className="table-scroll">
          <table className="tmp-bill">
            <thead>
              <tr>
                <th width="8%">Mã số</th>
                <th width="20%">Thòi gian</th>
                <th width="9%">Bàn số</th>
                <th width="10%">In lúc</th>
                <th width="13%">Tổng tiền</th>
                <th width="40%">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="8%">0000123</td>
                <td width="20%">123</td>
                <td width="9%">5</td>
                <td width="10%">-</td>
                <td width="13%">123</td>
                <td width="40%">
                  <button className="btn cancel-table">
                    Hủy HĐ
                  </button>
                  <button className="btn view-order-btn">
                    Xem order
                  </button>
                  <button className="btn print-btn">
                    In
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

TableStoreTmp.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    orders: state.orders
  }
}

export default connect(bindStateToProps)(TableStoreTmp);

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

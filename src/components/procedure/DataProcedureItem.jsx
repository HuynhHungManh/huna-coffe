import React, { Component } from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';

class DataProcedureItem extends Component {

constructor(props, context) {
  super(props, context);
}
gotoPage(page) {
  this.context.router.history.push(page);
}

  render() {
    return (
      <tr>
        <td className="numerical-order-procedure">{this.props.index +1}</td>
        <td>{this.props.data.maso}</td>
        <td style={{color: '#0080fe'}} onClick={this.gotoPage.bind(this,`/find-procedure-detail/${this.props.data.id}`)}>{this.props.data.tenthutuc}<span className="level-procedure"> Mức {this.props.data.tructuyen}</span></td>
        <td>{this.props.data.donvi}</td>
        <td>{this.props.data.linhvuc}</td>
      </tr>
    );
  }
}


DataProcedureItem.contextTypes = {
  router : PropTypes.any
}

export default DataProcedureItem;

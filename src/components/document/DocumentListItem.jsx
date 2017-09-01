import React, { Component } from 'react';

class DocumentListItem extends Component {

gotoProcedureDetail(xxx) {
  this.props.history.push('/procedure-detail');
}
  render() {
    return (
      <li className="sub-detail-document" onClick={this.gotoProcedureDetail.bind(this, 'xxx')}>
        <p className="text-detail-document">{this.props.title}</p>
      </li>
    );
  }

}

export default DocumentListItem;

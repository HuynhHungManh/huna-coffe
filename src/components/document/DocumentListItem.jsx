import React, { Component } from 'react';

class DocumentListItem extends Component {

gotoProcedureDetail(xxx) {
  this.props.history.push('/procedure-detail');
}
  render() {
    return (
      <li className="sub-detail-document">
        <p className="text-detail-document">{this.props.data.title.rendered}</p>
      </li>
    );
  }

}

export default DocumentListItem;

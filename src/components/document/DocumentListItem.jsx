import React, { Component } from 'react';

class DocumentListItem extends Component {

  render() {
    return (
      <li key={i} className="sub-detail-document" onClick={this.gotoProcedureDetail.bind(this, 'xxx')}>
        <p className="text-detail-document">{item.title}</p>
      </li>
    );
  }

}

export default DocumentListItem;

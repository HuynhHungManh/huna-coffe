import React, { Component } from 'react';
import {PropTypes} from 'prop-types';

class DocumentListItem extends Component {

gotoPage(page) {
  this.context.router.history.push(page);
}

  render() {
    return (
      <li className="sub-detail-document" onClick={this.gotoPage.bind(this,`/procedure-detail/${this.props.data.id}`)}>
        <p className="text-detail-document">{this.props.data.title.rendered}</p>
      </li>
    );
  }

}

DocumentListItem.contextTypes = {
  router : PropTypes.any
}

export default DocumentListItem;

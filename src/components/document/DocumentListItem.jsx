import React, { Component } from 'react';
import {PropTypes} from 'prop-types';

class DocumentListItem extends Component {

gotoPage(page) {
  this.context.router.history.push(page);
}

truncate() {
  let length = 55;
  let titleName = this.props.data.title.rendered;
  let trimmedTitle = '';
  if(titleName.length < 55 ) {
    trimmedTitle = titleName.substring(0, Math.min(length, titleName.length));
  } else if(titleName.length > 55) {
    trimmedTitle = titleName.substring(0, Math.min(length, titleName.length)) + '.....';
  }
  return trimmedTitle;
}

  render() {
    return (
      <li className="sub-detail-document" onClick={this.gotoPage.bind(this,`/procedure-detail/${this.props.data.id}`)}>
        <p className="text-detail-document">{this.truncate()}</p>
      </li>
    );
  }

}

DocumentListItem.contextTypes = {
  router : PropTypes.any
}

export default DocumentListItem;

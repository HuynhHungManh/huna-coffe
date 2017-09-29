import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import classnames from 'classnames';

class DocumentListItem extends Component {

gotoPage(page) {
  this.context.router.history.push(page);
}

Truncate() {
  let len = 0;
  let titleName = this.props.data.title.rendered;
  let trimmedTitle = '';
  let count=0;
  let i=0;
  for (i = 0, len = titleName.length; i < len; i++) {
    if(titleName[i]==' ') count++;
    if(count==10){
      trimmedTitle = titleName.substring(0, i) + " ...";
    break;
  } else {
      trimmedTitle = titleName.substring(0, i+1);
    }
  }
  return trimmedTitle;
}

  checkFile(file) {
    if(file && file.indexOf(".doc")>= 0)
      return false;
    return true;
  }

  render() {
    return (
      <li className="sub-detail-document" onClick={this.gotoPage.bind(this,`/procedure-detail/${this.props.data.id}`)}>
        <p className={
            classnames('text-detail-document', {
              'check-pdf' : this.checkFile(this.props.data.acf && this.props.data.acf.fileBieuMau.url)
            })}
          >{this.Truncate()}</p>
      </li>
    );
  }

}

DocumentListItem.contextTypes = {
  router : PropTypes.any
}

export default DocumentListItem;

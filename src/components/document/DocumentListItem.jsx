import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import classnames from 'classnames';
import {connect} from 'react-redux';

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
    if(count==15){
      trimmedTitle = titleName.substring(0, i) + " ...";
    break;
  } else {
      trimmedTitle = titleName.substring(0, i+1);
    }
  }
  return trimmedTitle;
}

  checkFile(file) {
    if(file && file.indexOf(".pdf")>= 0)
      return true;
    return false;
  }

  checkEmpty(file) {
    if(!file)
      return true;
    return false;
  }

  render() {
    return (
      <li className={
        classnames('sub-detail-document', {
        'notification-file-empty' : this.checkEmpty(this.props.data.acf && this.props.data.acf.fileBieuMau.url)
      })}
      onClick={this.gotoPage.bind(this,`/procedure-detail/${this.props.data.id}`)}>
        <p className={
            classnames('text-detail-document', {
              'check-file' : this.checkFile(this.props.data.acf && this.props.data.acf.fileBieuMau.url),
              'check-empty-file' : this.checkEmpty(this.props.data.acf && this.props.data.acf.fileBieuMau.url)
            })}
          >{this.Truncate()}</p>
      </li>
    );
  }

}

DocumentListItem.contextTypes = {
  router : PropTypes.any
}

export default connect()(DocumentListItem);

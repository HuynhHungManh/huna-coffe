import React, { Component } from 'react';
import classnames from 'classnames';

class SubCategory extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <li className={
        classnames('box-sub-text-document', {
          'text-active-document' : this.props.data.status
        })}
       onClick={this.props.browseDocuments.bind(this, this.props.data.id,this.props.indexParent,this.props.data.slug)}>
        <p className="sub-text-document ">{this.props.data.name} </p>
      </li>
    );
  }
}

export default SubCategory;

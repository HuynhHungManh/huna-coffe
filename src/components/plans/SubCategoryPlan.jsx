import React, { Component } from 'react';
import classnames from 'classnames';

class SubCategoryPlan extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <li className={
        classnames('box-sub-text-document', {
          'text-active-document' : this.props.data.status
        })}
       onClick={this.props.browsePlans.bind(this, this.props.data.id,this.props.indexParent,this.props.data.id)}>
        <p className="sub-text-document ">{this.props.data.name} </p>
      </li>
    );
  }
}

export default SubCategoryPlan;

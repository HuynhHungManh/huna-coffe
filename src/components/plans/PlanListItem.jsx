import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {Link} from 'react-router-dom';
import classnames from 'classnames';
import {connect} from 'react-redux';

class PlanListItem extends Component {
  gotoPage(page) {
    this.context.router.history.push(page);
  }

  Truncate() {
    let len = 0;
    let titleName = this.props.data.title.rendered;
    let trimmedTitle = '';
    let count=0;
    len = titleName.length;
    for (let i = 0; i < len; i++) {
      if(titleName[i]==' ') count++;
      if(count==13){
        trimmedTitle = titleName.substring(0, i) + " ...";
      break;
    } else {
        trimmedTitle = titleName.substring(0, i+1);
      }
    }
    return trimmedTitle;
  }

  checkFile(file) {
    if(file && file.indexOf(".png") || file.indexOf(".jpg") >= 0)
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
      <li className= {
            classnames('sub-detail-document sub-detail-plan', {
              'notification-file-empty' : this.checkEmpty(this.props.data.acf && this.props.data.acf.map_plan.url)
            })
          }
        >
        <p className= {
            classnames('text-detail-plan', {
              'check-file' : this.checkFile(this.props.data.acf && this.props.data.acf.map_plan.url),
              'check-empty-file' : this.checkEmpty(this.props.data.acf && this.props.data.acf.map_plan.url)
            })
          }
          >
          { this.Truncate() }
        </p>
        <Link className= {
              classnames('btn btn-view-map', {
                'notification-file-empty' : this.checkEmpty(this.props.data.acf && this.props.data.acf.map_plan.url)
              })
            }

          to={`/view-project/${ this.props.data.id }`}>
          Xem
        </Link>
      </li>
    );
  }
}

PlanListItem.contextTypes = {
  router : PropTypes.any
}

export default connect()(PlanListItem);

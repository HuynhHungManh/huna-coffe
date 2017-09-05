import React, {Component} from 'react';
import {connect} from 'react-redux';
import DocumentListItem from './DocumentListItem.jsx';


class DocumentList extends Component {

  constructor(props, context) {
    super(props, context);
  }


  render() {
    return (
      <div className="box-detail-document">
        <h2 className="list-title">
          Tệp biểu mẫu
        </h2>
        <div className="box-detail-scroll resize-box-document">
          <ul className="list-detail-document">
              {this.props.documents.map((item, i) => {
                return (<DocumentListItem key={i} data={item}/>)
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}


const bindStateToProps = (state) => {
  return {
    documents: state.documents || []
  }
}

export default connect(bindStateToProps)(DocumentList);

import React, {Component} from 'react';
import {connect} from 'react-redux';
import DocumentListItem from './DocumentListItem.jsx';

class DocumentList extends Component {

  constructor(props, context) {
    super(props, context);
    this.state={
      documents : []
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.documents !== this.props.documents) {
      this.setState({
        documents : this.props.documents
      });
    }
  }

  componentWillUnmount(){
    this.setState({
      documents : []
    })
  }

  render() {
    return (
      <div className="box-detail-document">
        <h2 className="list-title">
          Tệp biểu mẫu
        </h2>
        <div className="box-detail-scroll resize-box-document">
          <ul className="list-detail-document">
              {this.state.documents.map((item, i) => {
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

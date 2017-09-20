import React, {Component} from 'react';
import {connect} from 'react-redux';
import DocumentListItem from './DocumentListItem.jsx';

class DocumentList extends Component {

  constructor(props, context) {
    super(props, context);
    this.state= {
      documents : [],
      status : false,
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.documents !== this.props.documents) {
      this.setState({
        documents : this.props.documents
      });
      if(this.props.documents.length === 0){
        this.setState({ 'status' : true})
      }
      else{
        this.setState({ 'status' : false})
      }
    }
  }

  componentWillMount(){
    console.log(window.previousLocation.pathname);
    if(window.previousLocation.pathname === "/"){
      this.setState({
        documents : []
      })
    }
  }

  render() {
    console.log(this.state.documents);
    return (
      <div className="box-detail-document">
        <h2 className="list-title">
          Tệp biểu mẫu
        </h2>
        <div className="box-detail-scroll resize-box-document">
          { this.state.status &&
            <span className="notification-document"> Không tìm thấy tệp biểu mẫu !</span>
          }
          <ul className="list-detail-document">
              {this.state.documents.map((item, i) => {
                return (<DocumentListItem key={i} data={item} storeHistory={this.props.storeHistory}/>)
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

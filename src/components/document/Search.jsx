import React, { Component } from 'react';
import {connect} from 'react-redux';
import {SearchDocuments} from 'api';
import {Categories} from 'api';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      nameDocuments : '',
     }
  }

  getNameDocuments(e){
    this.setState({ 'nameDocuments' : e.target.value})
  }

  searchDocuments() {
    if(this.state.nameDocuments === ''){
      this.props.dispatch(SearchDocuments.actions.searchDocumenrs({nameDocument: ''}));
      this.props.dispatch(Categories.actions.categories());
      this.props.dispatch(this.changeStatusSearch(false));
    }
    else{
      this.props.dispatch(Categories.actions.categories());
      this.props.dispatch(this.changeStatusSearch(true));
      this.props.dispatch(SearchDocuments.actions.searchDocumenrs({nameDocument: this.state.nameDocuments})).then((res) =>{
        if(res.data.length > 0){
          this.props.dispatch(this.getCategoriesByPost(res.data));
        }
      });
    }
  }

  getCategoriesByPost(array) {
    return {
      type: 'GET_LIST_CATEGORIES_BY_POST',
      array
    }
  }

  changeStatusSearch(status) {
    return {
      type: 'CHANGE_STATUS_SEARCH_DOCUMENT',
      status
    }
  }

  // componentDidUpdate(prevProps, prevState){
  //   if(prevState.documents !== this.props.nameDocuments) {
  //     this.props.dispatch(Categories.actions.categories());
  //   }
  // }

  render() {
    return (
      <div className="form-search">
        <button className="btn-search icon-zoom" onClick={this.searchDocuments.bind(this)}/>
        <input className="inp-search" type="text" placeholder="Tìm kiếm tên biểu mẫu" onChange={this.getNameDocuments.bind(this)} />
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    documents: state.documents || []
  }
}

export default connect(bindStateToProps)(Search);

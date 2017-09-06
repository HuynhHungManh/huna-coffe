import React, { Component } from 'react';
import {connect} from 'react-redux';
import {SearchDocuments} from 'api';

class Search extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      nameDocuments : ''
     }
  }

  getNameDocuments(e){
    this.setState({ 'nameDocuments' : e.target.value})
  }

  searchDocuments() {
    this.props.dispatch(SearchDocuments.actions.searchDocumenrs({nameDocument: this.state.nameDocuments}));
  }

  render() {
    return (
      <div className="form-search">
        <button className="btn-search icon-zoom" onClick={this.searchDocuments.bind(this)}/>
        <input className="inp-search" type="text" placeholder="Tìm kiếm tên thủ tục" onChange={this.getNameDocuments.bind(this)} />
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
  }
}

export default connect(bindStateToProps)(Search);
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {PropTypes} from 'prop-types';
import {SearchFile} from 'api';

class SearchTeceipt extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      idFile : '',
      message: '',
      hasValue: false,
      hasError: false,
    }
  }

  handleChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  getidFile(e) {
    e.preventDefault();
    SearchFile.actions.searchFiles.request({id: this.state.idFile}).then(res => {
      if (res.data.return) {
        this.context.router.history.push('/search-detail/' + this.state.idFile);
      } else {
        this.setState({
          hasValue: false,
          hasError: true,
          message: 'Vui lòng nhập đúng số biên nhận'
        })
      }
    })
    return;
  }

  clearData() {
    this.setState({
      hasValue: false,
      hasError: false,
      data:[]
    })
  }

  render(){
    return(
      <div className="container">
            <div className="content box-search-file">
              <div className="validation-form validation-search-file">
                {
                  this.state.hasError ? (
                    <div className="validation-text">{this.state.message}</div>
                  ) : null
                }
              </div>
              <h2 className="title-search-file">
                Tra cứu hồ sơ
              </h2>
              <form className="form-search-file" onSubmit={this.getidFile.bind(this)}>
                <div className="box-search-content">
                  <input className="inp-search-file" name="id" type="text" placeholder="Nhập số biên nhận vào đây" onChange={this.handleChange.bind(this, 'idFile')}/>
                  <button className="btn-search-file icon-zoom btn-action-back">
                  </button>
                </div>
              </form>
            </div>
      </div>
    );
  }
}
SearchTeceipt.contextTypes = {
  router : PropTypes.any
}

export default SearchTeceipt;

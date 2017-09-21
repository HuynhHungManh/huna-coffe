import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Procedures} from 'api';


class FormFindProcedure extends Component {

constructor(props, context) {
  super(props, context);
  this.state ={
    tenThuTuc : '',
    linhVuc: '',
    coQuan: '',
  }
  this.props.dispatch(Procedures.actions.unitsProcedure());
  this.props.dispatch(Procedures.actions.fieldsProcedure());
  this.handleChange =this.handleChange.bind(this);
}
handleChange(e) {
  this.setState({
    [e.target.name] : e.target.value
  });
}

handleSearch() {
  let params = {
    tenThuTuc : this.state.tenThuTuc,
    linhVuc : this.state.linhVuc,
    coQuan : this.state.coQuan,
  }
  this.props.dispatch(Procedures.actions.searchProcedure(null, params));
}
  render() {
    return (
      <div className="procedure-left">
        <div className="search-procedure" action method="post">
          <ul>
            <li>
              <p>tên thủ tục</p>
              <input type="text" placeholder="Nhập tên thủ tục" name="tenThuTuc" />
            </li>
            <li>
              <p>cơ quan thực hiện</p>
              <div className="menulist icon-arrow1-bottom">
                <select type ="select" onChange={this.handleChange} name="coQuan" value={this.state.coQuan}>
                  {this.props.units.map((item, i) => {
                    return (
                      <option key={i} value={item.name}>{item.name}</option>
                      )
                    })
                  }

                </select>
              </div>
            </li>
            <li>
              <p>lĩnh vực thực hiện</p>
              <div className="menulist icon-arrow1-bottom">
                <select type ="select" onChange={this.handleChange} name="linhVuc" value={this.state.linhVuc}>
                  {
                    this.props.fields.map((item, i) => {
                    return (
                      <option key={i} value={item.name}>{item.name}</option>
                      )
                    })
                  }
                </select>
              </div>
            </li>
          </ul>
          <button className="btn-icon btn-search-procedure" onClick={this.handleSearch.bind(this)}><i className="icon icon-zoom" /><span className="space-search">tìm kiếm</span></button>
        </div>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    units: state.units,
    fields: state.fields
  }
}

export default connect(bindStateToProps)(FormFindProcedure);

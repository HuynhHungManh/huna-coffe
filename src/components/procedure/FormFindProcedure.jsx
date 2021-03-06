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
  if(this.state.tenThuTuc === '' && this.state.linhVuc === '' && this.state.coQuan ===''){
    params = {index: 1};
    this.props.dispatch(Procedures.actions.procedures(null, params));
    this.props.dispatch(this.searchByFieldAndUnit({}));
  }
  else{
    this.props.dispatch(Procedures.actions.searchProcedure(null, params));
    this.props.dispatch(this.searchByFieldAndUnit(params));
  }
}

searchByFieldAndUnit(data) {
  return {
    type: 'STORE_FIELD_AND_UNIT',
    data
  }
}

componentWillMount(){
  let previousLocation = 'find-procedure-detail';
  if(window.previousLocation.pathname.indexOf(previousLocation) >= 0) {
    if(this.props.dataSearch.tenThuTuc !== undefined && this.props.dataSearch.linhVuc !== undefined && this.props.dataSearch.coQuan !== undefined){
      this.setState({
        tenThuTuc : this.props.dataSearch.tenThuTuc,
        linhVuc: this.props.dataSearch.linhVuc,
        coQuan: this.props.dataSearch.coQuan,
      })
    }
  }
}
  render() {
    return (
      <div className="procedure-left">
        <div className="search-procedure" action method="post">
          <ul>
            <li>
              <p>tên thủ tục</p>
              <input type="text" placeholder="Nhập tên thủ tục" name="tenThuTuc" onChange={this.handleChange} value={this.state.tenThuTuc}/>
            </li>
            <li>
              <p>cơ quan thực hiện</p>
              <div className="menulist icon-arrow1-bottom">
                <select type ="select" onChange={this.handleChange} name="coQuan" value={this.state.coQuan}>
                  {this.props.units.map((item, i) => {
                    return (
                      <option key={i} value={item.value}>{item.name}</option>
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
                      <option key={i} value={item.value}>{item.name}</option>
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
    fields: state.fields,
    dataSearch : state.searchProcedure
  }
}

export default connect(bindStateToProps)(FormFindProcedure);

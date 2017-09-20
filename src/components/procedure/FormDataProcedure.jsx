import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Procedures} from 'api';
import DataProcedureItem from './DataProcedureItem.jsx';
import classnames from 'classnames';
import ReactPaginate from 'react-paginate';
import Spinner from 'react-spinkit';

class FormDataProcedure extends Component {

constructor(props, context) {
  super(props, context);
  this.state = {
      totalPage: 1,
      indexPage : 1,
      arrayPage : [1],
      isEmpty : false,
      isLoading : true
  };
  this.props.dispatch(Procedures.actions.procedures(null,{index:1}));
}

handlePageClick(data) {
  this.setState({
    indexPage : data.selected+1
  });
  this.props.dispatch(Procedures.actions.procedures(null,{index:data.selected+1}));
}

handleChange(e) {
  this.setState({
    indexPage : e.target.value
  });
  this.props.dispatch(Procedures.actions.procedures(null,{ index : parseInt(e.target.value) }));
}

componentDidUpdate(prevProps, prevState) {
    if(prevProps.procedures.totalPage !== this.props.procedures.totalPage){
      let arr = [];
      for(let i = 1; i <= this.props.procedures.totalPage; i++){
        arr.push(i);
      }
      this.setState({
        totalPage : this.props.procedures.totalPage,
        arrayPage : arr
      });
    }
}
componentWillReceiveProps(nextProps) {
  if(nextProps.procedures.data !== this.props.procedures.data){
    this.setState({
      isLoading : false
    });
    if(nextProps.procedures.data.length === 0){
      this.setState({
        isEmpty : true
      });
    }
  }
}
  render() {
    return (
      <div className="procedure-right">
        <div className="scroll-procedure">
          <div className="table-procedure">
            <table
                className={
                  classnames('table-pro', {
                    'table-pro-res' : this.props.procedures.data
                  })}
              >
              <thead>
                <tr><th style={{width: 65}}>STT</th>
                  <th style={{width: 187}}>MÃ SỐ</th>
                  <th style={{width: 568}}>TÊN THỦ TỤC</th>
                  <th style={{width: 233}}>CƠ QUAN THỰC HIỆN</th>
                  <th style={{width: 149}}>LĨNH VỰC</th>
                </tr>
              </thead>
              <tbody>
                  { this.props.procedures && this.props.procedures.data !== undefined &&
                      this.props.procedures.data.map((item, i) => {
                        return (
                          <DataProcedureItem key ={i} index={i} data={item.data}/>
                        )
                    })
                  }
                  { this.state.isLoading &&
                      <Spinner name="line-spin-fade-loader" color="#444" className="loading"/>
                  }
                  {
                   this.state.isEmpty &&
                   <tr>
                     <td className="notification-procedure" colSpan="5">Không có thủ tục nào được tìm thấy !</td>
                   </tr>
                  }
              </tbody>
            </table>
          </div>
          <div className="pagination-procedure">
            {
              this.props.procedures && this.props.procedures.data !== undefined &&
              this.props.procedures.data.length !== 0 &&
              <div className="pagination-left">
                <span className="text-span">Xem</span>
                <select className="pagination-dropdown icon-arrow1-bottom" onChange={this.handleChange.bind(this)} value={this.state.indexPage}>
                { this.props.procedures && this.props.procedures.totalRecord &&
                  this.state.arrayPage.map((item, i) => {
                    return (
                      <option key ={i} value={i+1}>{i+1}</option>
                  )})
                 }
                </select>
                  <span className="text-span">Đang xem 1 đến {this.props.procedures.data && this.props.procedures.data.length} trong tổng số {this.props.procedures.totalRecord} mục</span>
              </div>
            }
            <div className="pagination-right">
              <div id="react-paginate">
                {
                  this.props.procedures.totalPage !==1 &&
                  <ReactPaginate
                    previousLabel={<span className="icon-double-arrow"></span>}
                    nextLabel={<span className="icon-double-arrow"></span>}
                    breakClassName={"break-me"}
                    pageCount={this.props.procedures.totalPage}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick.bind(this)}
                    forcePage={this.state.indexPage-1}
                    containerClassName={"pagination pagination-ex"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active active-ex"}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    procedures: state.procedures
  }
}

export default connect(bindStateToProps)(FormDataProcedure);

import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Procedures} from 'api';
import DataProcedureItem from './DataProcedureItem.jsx';
import classnames from 'classnames';
import ReactPaginate from 'react-paginate';

class FormDataProcedure extends Component {

constructor(props, context) {
  super(props, context);
  this.props.dispatch(Procedures.actions.procedures());
  this.state = {
      data: this.props.procedures && this.props.procedures.data,
      offset: 0,
      status : false
    };

}

checkResponsive(array) {
  if((array.data.length) > 4)
  {
    this.setState({
            status : true
    })
  }
}

// componentDidUpdate(prevProps, prevState) {
//   if(this.props.procedures.data !== this.props.procedures.data){
//     if(this.props.procedures.data.length > 4){
//       this.setState({
//         status : true
//       })
//     }
//   }
// }
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
                </tr></thead>
              <tbody>
                  {
                    this.props.procedures && this.props.procedures.data != undefined && this.props.procedures.data.map((item, i) => {
                      return (
                        <DataProcedureItem key ={i} index={i} data={item}/>
                      )
                    })
                   }
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <div className="pagination-left">
              <span className="text-span">Xem</span>
              <select className="pagination-dropdown">
                <option value>50</option>
                <option value>2</option>
                <option value>3</option>
                <option value>4</option>
                <option value>5</option>
                <option value>6</option>
                <option value>7</option>
                <option value>8</option>
              </select>
              <span className="text-span">Đang xem 1 đến 6 trong tổng số {this.props.procedures.recordsTotal} mục</span>
            </div>
            <div className="pagination-right">
              <ReactPaginate
                previousLabel={<span className="icon-double-arrow"></span>}
                nextLabel={<span className="icon-double-arrow"></span>}
                pageCount={4}
                pageRangeDisplayed={5}
                containerClassName={"react-pagination"}
              />
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

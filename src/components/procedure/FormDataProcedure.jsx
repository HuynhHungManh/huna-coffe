import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Procedures} from 'api';
import DataProcedureItem from './DataProcedureItem.jsx';
import ReactPaginate from 'react-paginate';

class FormDataProcedure extends Component {

constructor(props, context) {
  super(props, context);
  this.props.dispatch(Procedures.actions.procedures());
  this.state = {
      data: this.props.procedures && this.props.procedures.data,
      offset: 0
    };
}

  render() {
    return (
      <div className="procedure-right">
        <div className="scroll-procedure">
          <div className="table-procedure">
            <table className="table-pro">
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
              <select className="pagination-dropdown icon-arrow1-bottom" name>
                <option value>50</option>
                <option value>2</option>
                <option value>3</option>
                <option value>4</option>
                <option value>5</option>
                <option value>6</option>
                <option value>7</option>
                <option value>8</option>
              </select>
              <span className="drop-pro icon-arrow1-bottom" />
              <span className="text-span">Đang xem 1 đến 6 trong tổng số {this.props.procedures.recordsTotal} mục</span>
            </div>
            <div className="pagination-right">
              <button type="button" className="previou icon-double-arrow" name="button" />
              <button type="button" className="page" name="button">01</button>
              <button type="button" className="page" name="button">02</button>
              <button type="button" className="page active" name="button">03</button>
              <button type="button" className="next icon-double-arrow" name="button" />
              {/* <ReactPaginate
                      //  previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={<a href="">...</a>}
                       breakClassName={"break-me"}
                       pageCount={5}
                       marginPagesDisplayed={5}
                       pageRangeDisplayed={5}
                       onPageChange={this.handlePageClick.bind(this,this.state.data)}
                       containerClassName={"test1"}
                      //  subContainerClassName={"pages pagination"}
                      //  className="paginate"
                       activeClassName={"active"}

                {/* />  */}
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

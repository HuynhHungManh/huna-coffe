import React, { Component } from 'react';
import {connect} from 'react-redux';
// import {Ratings} from 'api';

class FormFindProcedure extends Component {

constructor(props, context) {
  super(props, context);

}
  render() {
    return (
      <div className="procedure-left">
        <form className="search-procedure" action method="post">
          <ul>
            <li>
              <p>tên thủ tục</p>
              <input type="text" placeholder="Nhập tên thủ tục" />
            </li>
            <li>
              <p>cơ quan thực hiên</p>
              <div className="menulist icon-arrow1-bottom">
                <select>
                  <option value={1}>Phòng kinh tế</option>
                  <option value={2}>Trực tuyến</option>
                  <option value={3}>Trực tuyến</option>
                  <option value={4}>Trực tuyến</option>
                </select>
              </div>
            </li>
            <li>
              <p>lĩnh vực thực hiện</p>
              <div className="menulist icon-arrow1-bottom">
                <select>
                  <option value={1}>Bảo Hiểm Xã Hội Việt Nam</option>
                  <option value={2}>Trực tuyến</option>
                  <option value={3}>Trực tuyến</option>
                  <option value={4}>Trực tuyến</option>
                </select>
              </div>
            </li>
          </ul>
          <button className="btn-icon btn-search-procedure"><i className="icon icon-zoom" /><span className="space-search">tìm kiếm</span></button>
        </form>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    ratings: state.ratings
  }
}

export default connect(bindStateToProps)(FormFindProcedure);

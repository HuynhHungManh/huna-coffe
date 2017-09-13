import React, { Component } from 'react';
import {connect} from 'react-redux';
import {SearchFile} from 'api';
import Moment from 'react-moment';

class SearchDetailForm extends Component {
  constructor(context,props){
  	super(context, props);
  	this.state = {
      id: this.props.id,
      data:[]
    };
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        id: nextProps.id
      })
  }

  componentDidMount() {
    this.getDetail(this.state.id)
  }

  getDetail(id){
    SearchFile.actions.searchFiles.request({id: id}).then(res => {
      if (res.data.return) {
        this.setState({
          data: res.data.return
        })
      }
    })
  }

  render(){
    return(
      <div className="container">
        <div className="header">
          <h2 className="title bg-search-file title-search">
            <span className="title-main">Tra cứu hồ sơ</span>
          </h2>
        </div>
        <div className="content">
          <div className="box-search-detail">
            <div className="content-file">
              <div className="box-content-file">
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Lĩnh vực
                  </h2>
                  <p className="content-param-file">
                    {this.state.data.nhomThuTucHanhChinhTen ? this.state.data.nhomThuTucHanhChinhTen : ''}
                  </p>
                </div>
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Loại hồ sơ
                  </h2>
                  <p className="content-param-file">
                    {this.state.data.tenThuTucHanhChinh ? this.state.data.tenThuTucHanhChinh: ''}
                  </p>
                </div>
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Phí hồ sơ
                  </h2>
                  <p className="content-param-file">
                    {this.state.data.phiHoSo ? this.state.data.phiHoSo: ''}
                  </p>
                </div>
              </div>
              <div className="box-content-file">
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Mã số biên nhận
                  </h2>
                  <p className="content-param-file">
                    {this.state.data.maSoBienNhan ? this.state.data.maSoBienNhan : ''}
                  </p>
                </div>
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Người nộp hồ sơ
                  </h2>
                  <p className="content-param-file">
                    {this.state.data.hoTenNguoiNopHoSo ? this.state.data.hoTenNguoiNopHoSo: ''}
                  </p>
                </div>
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Chủ hồ sơ
                  </h2>
                  <p className="content-param-file">
                    {this.state.data.chuSoHuu ? this.state.data.chuSoHuu: ''}
                  </p>
                </div>
              </div>
              <div className="box-content-file">
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Email
                  </h2>
                  <p className="content-param-file">
                    {this.state.data.emailNguoiNop ? this.state.data.emailNguoiNop: ''}
                  </p>
                </div>
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Địa chỉ
                  </h2>
                  <p className="content-param-file">
                    {this.state.data.diaChiThuongTruNguoiNop ? this.state.data.diaChiThuongTruNguoiNop: ''}
                  </p>
                </div>
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Ngày tiếp nhận
                  </h2>
                  <p className="content-param-file">
                    <Moment format="DD/MM/YYYY">
                      {this.state.data.ngayNhanHoSo}
                    </Moment>
                  </p>
                </div>
              </div>
              <div className="box-content-file">
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Ngày xử lý xong
                  </h2>
                  <p className="content-param-file">
                    <Moment format="DD/MM/YYYY">
                      {this.state.data.ngayKetThucXuLy}
                    </Moment>

                  </p>
                </div>
                <div className="box-content-file-item">
                  <h2 className="sub-title-file">
                    Trạng thái hồ sơ
                  </h2>
                  <p className="content-param-file">
                    {this.state.data.trangThaiHoSoTen ? this.state.data.trangThaiHoSoTen: ''}
                  </p>
                </div>

              </div>

              {/* <div className="box-content-file">
                <h2 className="sub-title-file">
                  Mã số biên nhận
                </h2>
                <p className="content-param-file">
                  {this.state.data.maSoBienNhan ? this.state.data.maSoBienNhan : ''}
                </p>
              </div>
              <div className="box-content-file">
                <h2 className="sub-title-file">
                  Email
                </h2>
                <p className="content-param-file">
                  {this.state.data.emailNguoiNop ? this.state.data.emailNguoiNop: ''}
                </p>
              </div>
              <div className="box-content-file">
                <h2 className="sub-title-file">
                  Ngày xử lý xong
                </h2>
                <p className="content-param-file">
                  <Moment format="DD/MM/YYYY">
                    {this.state.data.ngayKetThucXuLy}
                  </Moment>

                </p>
              </div> */}
            </div>
            {/* <div className="content-file">
              <div className="box-content-file">
                <h2 className="sub-title-file">
                  Loại hồ sơ
                </h2>
                <p className="content-param-file">
                  {this.state.data.tenThuTucHanhChinh ? this.state.data.tenThuTucHanhChinh: ''}
                </p>
              </div>
              <div className="box-content-file">
                <h2 className="sub-title-file">
                  Người nộp hồ sơ
                </h2>
                <p className="content-param-file">
                  {this.state.data.hoTenNguoiNopHoSo ? this.state.data.hoTenNguoiNopHoSo: ''}
                </p>
              </div>
              <div className="box-content-file">
                <h2 className="sub-title-file">
                  Địa chỉ
                </h2>
                <p className="content-param-file">
                  {this.state.data.diaChiThuongTruNguoiNop ? this.state.data.diaChiThuongTruNguoiNop: ''}
                </p>
              </div>
              <div className="box-content-file">
                <h2 className="sub-title-file">
                  Trạng thái hồ sơ
                </h2>
                <p className="content-param-file">
                  {this.state.data.trangThaiHoSoTen ? this.state.data.trangThaiHoSoTen: ''}
                </p>
              </div>
            </div> */}
            {/* <div className="content-file">
              <div className="box-content-file">
                <h2 className="sub-title-file">
                  Phí hồ sơ
                </h2>
                <p className="content-param-file">
                  {this.state.data.phiHoSo ? this.state.data.phiHoSo: ''}
                </p>
              </div>
              <div className="box-content-file">
                <h2 className="sub-title-file">
                  Chủ hồ sơ
                </h2>
                <p className="content-param-file">
                  {this.state.data.chuSoHuu ? this.state.data.chuSoHuu: ''}
                </p>
              </div>
              <div className="box-content-file">
                <h2 className="sub-title-file">
                  Ngày tiếp nhận
                </h2>
                <p className="content-param-file">
                  <Moment format="DD/MM/YYYY">
                    {this.state.data.ngayNhanHoSo}
                  </Moment>
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}


export default SearchDetailForm;

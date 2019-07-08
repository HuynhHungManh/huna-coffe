import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import NumberFormat from 'react-number-format';

class ComponentToPrint extends Component {

  render() {
    // console.log(this.props.data);
    // console.log(this.props.orderData);
    return (
      <div className="template-print">
        <div className="header-print">
          <h1>HUNA COFFEE</h1>
          <img className="" src={require('assets/images/logo/logo-huna.jpg')}></img>
        </div>
        <div className="info-print">
          <p>Họ và tên: Huỳnh Bá Mạnh Hùng</p>
          <p>Máy tính tiền </p>
          <p>Địa chỉ: Lý triện</p>
          <p>Thành Phố : Đà Nẵng</p>
        </div>
        <div className="content-print">
          <div className="content-title">
            <div className="content-name">Tên món</div>
            <div className="content-quatum">SL</div>
            <div className="content-promotion">CK</div>
            <div className="content-price">Đơn giá</div>
          </div>
          { this.props.data && 
            this.props.data.map((item, i) => {
              return (
                <div key ={i} className="content-info">
                  <p className="content-info-name">{item.tenThucDon}</p>
                  <p className="content-info-quatum">{item.soLuong}</p>
                  <p className="content-info-promotion">{(item.khuyenMai / item.donGia) * 100}%</p>
                  <p className="content-info-price">
                    <NumberFormat value={item.donGia} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                  </p>
                </div>
              )
            })
          }
        </div>
        <div className="total-price-print">
          <p className="text">Tổng tiền</p>
          <p className="price">
          { this.props.orderData && this.props.orderData.thanhTien &&
            <NumberFormat value={this.props.orderData.thanhTien} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
          }
          </p>
        </div>
        <div className="footer-print">
          Cám ơn quý khách đã ghé quán!
        </div>
      </div>
    );
  }


  // render() {
  //   console.log(this.props.orderData);
  //   console.log(this.props.data);
  //   return (
  //     <div className="template-print">

  //     </div>
  //   );
  // }
}

export default ComponentToPrint;
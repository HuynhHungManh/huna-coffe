import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import NumberFormat from 'react-number-format';

class ComponentToPrint extends Component {
  render() {
    let info = this.props.info;
    let data = this.props.data;
    let auth = this.props.auth;
    let totalPrice = data && data.thanhTien ? data.thanhTien : 0;
    let customerPrice = 0;
    // if (data.tienKhachDua) {
    //   customerPrice = customerPrice + data.tienKhachDua;
    // };
    // if (data.tienCaThe) {
    //   customerPrice = customerPrice + data.tienCaThe;
    // };
    // if (data.tienChuyenKhoan) {
    //   customerPrice = customerPrice + data.tienChuyenKhoan;
    // };

    return (
      <div className="template-print" style={{textAlign: 'center'}}>
        <p style={{textAlign: 'center'}} className="title-template">HUNA COFFEE</p>
        <p style={{textAlign: 'center'}} className="address-template">ĐC: 26 Hoàng Văn Thụ, Hải Châu,<br /> Đà Nẵng</p>
        <p style={{textAlign: 'center'}} className="phone-template">ĐT: {info.phone}</p>
        <p style={{textAlign: 'center'}} className="title-bill"><strong>HÓA ĐƠN BÁN HÀNG</strong></p>
        <p style={{textAlign: 'center'}} className="number-table">Bàn {data && data.soBan ? data.soBan : 0}</p>
        <table style={{borderCollapse: 'collapse', width: '100%'}} border={1} className="content-info">
          <tbody>
            <tr>
              <td style={{width: '50%', textAlign: 'left'}}>Ngày: {info.dateOrder}</td>
              <td style={{width: '50%', textAlign: 'right'}}>Số: {info.codeOrder}</td>
            </tr>
            <tr>
              <td style={{width: '50%', textAlign: 'left'}}>Thu ngân: {info.cashier}</td>
              <td style={{width: '50%', textAlign: 'right'}}>In lúc: {info.timePrint}</td>
            </tr>
          </tbody>
        </table>
        <table style={{borderCollapse: 'collapse', width: '100%'}} border={1}>
          <tbody>
            <tr className="title-table">
              <td style={{width: '40%'}}>Mặt hàng</td>
              <td style={{width: '20%'}}>Giá</td>
              <td style={{width: '10%'}}>SL</td>
              <td style={{width: '10%'}}>CK</td>
              <td style={{width: '20%'}}>T.tiền</td>
            </tr>
            { data && data.orderThucDons && data.orderThucDons.length > 0 &&
              data.orderThucDons.map((item, i) => {
                return (
                  <tr className="content-table" key={i}>
                    <td style={{width: '40%', textAlign: 'left'}}>{item.ten}</td>
                    <td style={{width: '20%'}}>
                      <NumberFormat value={Number(item.donGia)} displayType={'text'} thousandSeparator={true}/>
                    </td>
                    <td style={{width: '10%'}}>{item.soLuong}</td>
                    <td style={{width: '10%'}}>{item.khuyenMai ? item.khuyenMai : 0}</td>
                    <td style={{width: '20%'}}>
                      <NumberFormat value={Number(item.thanhTien)} displayType={'text'} thousandSeparator={true}/>
                    </td>
                  </tr>
                )
              })
            }            
          </tbody>
        </table>
        <table style={{borderCollapse: 'collapse', width: '100%', height: '44px'}} border={1} className="content-price">
          <tbody>
            <tr style={{height: '20px'}}>
              <td style={{width: '50%', textAlign: 'left', height: '20px'}}><span>Chiết khấu:</span></td>
              <td style={{width: '50%', textAlign: 'right', height: '20px'}}>
                <span>
                  <NumberFormat value={Number(data.khuyenMai)} displayType={'text'} thousandSeparator={true}/>%
                </span>
              </td>
            </tr>
            <tr style={{height: '24px'}}>
              <td style={{width: '50%', textAlign: 'left', height: '24px'}}><span style={{fontSize: '16px', fontFamily: '"Roboto-Bold"'}}><strong>TỔNG:</strong></span></td>
              <td style={{width: '50%', textAlign: 'right', height: '24px'}}>
                <span style={{fontSize: '16px', fontFamily: '"Roboto-Bold"'}}>
                  <strong>
                    <NumberFormat value={Number(totalPrice)} displayType={'text'} thousandSeparator={true}/>
                  </strong>
                </span>
              </td>
            </tr>

            { data && data.tienCaThe ?
              <tr style={{height: '20px'}}>
                <td style={{width: '50%', textAlign: 'left', height: '20px'}}><span>Tiền cà thẻ:</span></td>
                <td style={{width: '50%', textAlign: 'right', height: '20px'}}>
                  <span>
                    <NumberFormat value={Number(data.tienCaThe)} displayType={'text'} thousandSeparator={true}/>
                  </span>
                </td>
              </tr>
              : ""
            }

            { data && data.tienChuyenKhoan ?
              <tr style={{height: '20px'}}>
                <td style={{width: '50%', textAlign: 'left', height: '20px'}}><span>Tiền chuyển khoản:</span></td>
                <td style={{width: '50%', textAlign: 'right', height: '20px'}}>
                  <span>
                    <NumberFormat value={Number(data.tienChuyenKhoan)} displayType={'text'} thousandSeparator={true}/>
                  </span>
                </td>
              </tr>
              : ""
            }
            
            { data && data.tienKhachDua ?
              <tr style={{height: '20px'}}>
                <td style={{width: '50%', textAlign: 'left', height: '20px'}}><span>Khách đưa:</span></td>
                <td style={{width: '50%', textAlign: 'right', height: '20px'}}>
                  <span>
                    <NumberFormat value={Number(data.tienKhachDua)} displayType={'text'} thousandSeparator={true}/>
                  </span>
                </td>
              </tr>
              : ""
            }
            
            <tr>
              <td style={{width: '50%', textAlign: 'left'}}><span>Trả lại:</span></td>
              <td style={{width: '50%', textAlign: 'right'}}>
                <span>
                  <NumberFormat value={Number(data && data.tienThoiLai ? data.tienThoiLai : 0)} displayType={'text'} thousandSeparator={true}/>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{textAlign: 'center', fontSize: '12px'}}>Pass wifi: {info.passWifi}</p>
        <p style={{textAlign: 'center', fontSize: '12px'}}><em>Cảm ơn Quý khách. Hẹn gặp lại!</em></p>
      </div>
    );
  }
}

export default ComponentToPrint;
import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import NumberFormat from 'react-number-format';

class PrintToCook extends Component {

  getNote(item) {
    let noteChoose = [];
    if (item && item.length > 0) {
      noteChoose = item.filter(value => value.value == true);
    }
    return noteChoose;
  }

  render() {
    let info = this.props.info;
    let data = this.props.data;
    let type = this.props.type;
    let orderThucDons = [];
    if (type == 'bar') {
      orderThucDons = (data.orderThucDons && data.orderThucDons.length > 0) ? data.orderThucDons.filter(item => item.isPrinter == 'BAR') : [];
    } 
    else {
      orderThucDons = (data.orderThucDons && data.orderThucDons.length > 0) ? data.orderThucDons.filter(item => item.isPrinter == 'BEP') : [];
    }

    return (
      <div className="template-print" style={{textAlign: 'center'}}>
        <p style={{textAlign: 'center'}} className="number-table">Bàn {data && data.soBan ? data.soBan : 0}</p>
        <table style={{borderCollapse: 'collapse', width: '100%'}} border={1} className="content-info">
          <tbody>
            <tr>
              <td style={{width: '50%', textAlign: 'left'}}>Số: {info.codeOrder}</td>
              <td style={{width: '50%', textAlign: 'right'}}>In lúc: {info.timePrint}</td>
            </tr>
          </tbody>
        </table>
        <table style={{borderCollapse: 'collapse', width: '100%'}} border={1}>
          <tbody>
            <tr className="title-table">
              <td style={{width: '50%'}}>Mặt hàng</td>
              <td style={{width: '50%'}}>SL</td>
            </tr>
            { orderThucDons && orderThucDons.length > 0 &&
              orderThucDons.map((item, i) => {
                return (
                  <tr className="content-table" key={i}>
                    <td style={{width: '50%', textAlign: 'left'}}>
                      {item.ten}
                        { item.ghiChuMonOrderThucDon && item.ghiChuMonOrderThucDon.length > 0 &&
                          item.ghiChuMonOrderThucDon.map((itemChill, j) => {
                            return (
                              <table key={j} style={{width: '100%', borderTop: '1px solid #000'}}>
                                <tbody>
                                  <tr>
                                    <td style={{width: '20%', textAlign: 'center'}}>{itemChill.soLuong}</td>
                                    <td style={{width: '80%'}}>
                                      <table>
                                        <tbody>
                                          { itemChill.multiSelect && itemChill.multiSelect.length > 0 &&
                                            this.getNote(itemChill.multiSelect).map((itemChill2, k) => {
                                              return (
                                                <tr key = {k} style={{height: '16px'}}>
                                                  <td style={{height: '16px'}}>{itemChill2.label}</td>
                                                </tr>
                                              )
                                            })
                                          }
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            )
                          })
                        }
                    </td>
                    <td style={{width: '50%', textAlign: 'center'}}>{item.soLuong}</td>
                  </tr>
                )
              })
            }            
          </tbody>
        </table>
      </div>
    );
  }
}
                      


export default PrintToCook;
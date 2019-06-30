import React, { Component } from 'react'
import classnames from 'classnames';
import NumberFormat from 'react-number-format';
import Select from 'react-select';

class S extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      quantum: 1,
      bill_data: [],
      itemArray: [
        'Không đường',
        'Không đá',
        'Không sữa',
        'ít đường'
      ]
    }
  }

  componentWillMount() {
    this.setState({
      bill_data :  this.props.data,
      quantum: this.props.data.quantum
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.productsBill !== this.props.productsBill) {
      let value = this.props.productsBill.find(item => item.id == this.props.data.id);
      if (value && value.quantum) {
        this.setState({
          quantum: value.quantum
        });
      }
    }
  }

  calculatePrice(price, quantum, promotion) {
    if (promotion) {
      return (price - promotion) * quantum;
    }
    return price  * quantum;
  }

  minusQuantum(idBill) {
    if (this.state.quantum > 1) {
      this.setState({
        quantum :  this.state.quantum - 1
      });
      this.props.updateQuantum(idBill, 'minus');
    }
  }

  plusQuantum(idBill) {
    this.setState({
      quantum :  this.state.quantum + 1
    });
    this.props.updateQuantum(idBill, 'plus');
  }

  truncate(text) {
    let len = 0;
    let textTruncate = text;
    let trimmedText = '';
    let count=0;
    let i=0;
    for (i = 0, len = textTruncate.length; i < len; i++) {
      if(textTruncate[i]==' ') count++;
      if(count == 4){
        trimmedText = textTruncate.substring(0, i) + " ...";
      break;
    } else {
        trimmedText = textTruncate.substring(0, i+1);
      }
    }
    return trimmedText;
  }

  render() {
    return(
      <div className={classnames('bill-item', {
            'add-note-item' : this.props.itemNote
          })}
      >
        <div className={classnames('text-item', {
            'add-note-item' : this.props.itemNote
          })}
        >
          <div className={classnames('info-block', {
                'add-note-item-scroll' : this.props.itemNote && (this.props.itemNote.length > 1 || (this.props.itemNote.length == 1 && this.props.data.itemPromotion))
              })}
          >
            <p className="text" onClick={this.props.chooseItemProduct.bind(this, this.props.data)}>{this.truncate(this.props.data.ten)}</p>
            { this.props.itemNote &&
              <div>
                {
                  this.props.itemNote.map((item, i) => {
                    return (
                        <p key ={i} className="note-item">{item.soLuong} x {this.state.itemArray[item.ghiChuId-1]}</p>
                      )
                  })
                }
                { this.props.data.itemPromotion && this.props.data.itemPromotion > 0 &&
                  <p className="note-item">- <span className="price-text-color">
                    <NumberFormat value={this.props.data.itemPromotion * this.props.data.quantum} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
                    </span>
                  </p>
                }
              </div>
            }
          </div>
        </div>
        <div className={classnames('price-item', {
              'add-note-item' : this.props.itemNote
            })}
        >
          <p className="text-price">
          <NumberFormat value={this.props.data.donGia} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
          </p>
        </div>
        <div className={classnames('quantum-item', {
              'add-note-item' : this.props.itemNote
            })}
        >
          <div className="calculate-box">
            <button className="minus-quantum"
              onClick={this.minusQuantum.bind(this, this.props.data.id)}>
              -
            </button>
            <p className="text-quantum">{this.state.quantum}</p>
            <button className="plus-quantum"
              onClick={this.plusQuantum.bind(this, this.props.data.id)}>
              +
            </button>
          </div>
        </div>
        <div className={classnames('total-price-item', {
              'add-note-item' : this.props.itemNote
            })}
        >
          <p className="total-price-text">
            <NumberFormat value={this.calculatePrice(this.props.data.donGia, this.props.data.quantum, this.props.data.itemPromotion)} displayType={'text'} thousandSeparator={true} suffix={' đ'}/>
          </p>
        </div>
        <div className="btn-cancel-row" onClick={this.props.cancelItemBill.bind(this, this.props.data.id)}>
          <span className="icon-cancel-box icon-bin"></span>
        </div>
      </div>
    );
  }
}

export default Item_Bill;

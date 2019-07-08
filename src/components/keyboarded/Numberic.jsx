import React, { Component } from 'react';
import {connect} from 'react-redux';
// import Numpad from 'react-numberpad';

class Numberic extends Component {
  constructor(props, context) {
    super(props, context);
    const number = [
      {
        name: 'AC',
        value: 'clear'
      },
      {
        name: '0',
        value: 0
      },
      {
        name: '1',
        value: 1
      },
      {
        name: '2',
        value: 2
      },
      {
        name: '3',
        value: 3
      },
      {
        name: '4',
        value: 4
      },
      {
        name: '5',
        value: 5
      },
      {
        name: '6',
        value: 6
      },
      {
        name: '7',
        value: 7
      },
      {
        name: '8',
        value: 8
      },
      {
        name: '9',
        value: 9
      }
    ];
    this.state = {
      number: number,
      valueNumber: ''
    };
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if(prevProps.discountInput !== this.props.discountInput) {
  //     if (this.props.filedCurrent == 'numberTable' && prevProps.numberTable !== this.props.numberTable) {
  //       console.log(this.props.numberTable);
  //       this.setState({
  //         valueNumber: this.props.numberTable
  //       });
  //     } else if (this.props.filedCurrent == 'discountInput') {
  //       // this.setState({
  //       //   valueNumber: parseInt(this.props.numberTable, 10)
  //       // });
  //     }
  //   }
  // }

  showValue(type) {
    if (type == 'numberTable') {
      this.setState({
        valueNumber: this.props.numberTable
      });
    } else {
      this.setState({
        valueNumber: this.props.discountInput
      });
    }
  }

  changeNumbericInput(number) {
    if (this.props.filedCurrent == 'numberTable') {
      if (number != 'clear') {

        let numberTableStore = this.state.valueNumber != '' ? Number(this.state.valueNumber) : 0;

        if (numberTableStore && numberTableStore < 100) {
          // console.log(numberTableStore);
          let numbers = (this.state.numberTable * 10) + number;
          if (numbers < 100) {
            this.setState({
              valueNumber: numbers.toString()
            });
          } else {
            this.setState({
              valueNumber: '0' + number.toString()
            });
          }
        } else {
          this.setState({
            valueNumber: '0' + number.toString()
          });
        }
      } else {
        this.setState({
          valueNumber: ''
        });
      }
    }

    this.props.changeNumbericInput(number);
  }

  render() {
    console.log(this.props.discountInput);
    return (
      <div className="numberic-model">
        <div className="numberic-box">
          <div className="head-numberic-box">
            <span className="icon-close-numberic icon-cross" onClick = {this.props.closeNumberic.bind(this)}></span>
          </div>
          <div className="screen-show">
            <p className="number-show">{this.state.valueNumber}</p>
          </div>
          <ul className="item-numberic-box">
            {
              this.state.number.map((item, i) => {
                return (
                  <li key = {i} className="numberic-button" onClick = {this.changeNumbericInput.bind(this, item.value)}>
                    <span className="number-text">{item.name}</span>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default Numberic;

import React, { Component } from 'react';
import {connect} from 'react-redux';

class Numberic extends Component {
  constructor(props, context) {
    super(props, context);
    const number = [
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
      },
      {
        name: 'AC',
        value: 'clear'
      }
    ];
    this.state = {
      number: number
    };
  }

  render() {
    return (
      <div className="numberic-model">
        <div className="numberic-box">
          <div className="head-numberic-box">
            <span className="icon-close-numberic icon-cross" onClick = {this.props.closeNumberic.bind(this)}></span>
          </div>
          <ul className="item-numberic-box">
            {
              this.state.number.map((item, i) => {
                return (
                  <li key = {i} className="numberic-button" onClick = {this.props.changeNumbericInput.bind(this, item.value)}>
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

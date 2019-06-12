import React, { Component } from 'react';
import {connect} from 'react-redux';

class Numberic extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      number: [
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
      ]
    };
  }

  componentWillMount() {
    {
      this.state.number.map((item, i) => {
        return (
          <li>
          </li>
        )
      })
    }
  }

  render() {
    return (
      <div className="numberic-model">
        <div className="numberic-box">
          <ul className="item-numberic-box">
            {
              this.state.number.map((item, i) => {
                return (
                  <li className="numberic-button">
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

import React, { Component } from 'react';
import {connect} from 'react-redux';
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

class Keyboarded extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      layoutName: 'default',
      input: '',
      statusChange: '',
      inputName: ''
    };
  }

  onKeyPress(button) {
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button == "{enter}") {
      this.props.submitLogin();
    }
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  handleShift() {
    let layoutName = this.state.layoutName;

    this.setState({
      layoutName: layoutName === "default" ? "shift" : "default"
    });
  };

  render() {
    return (
      <div>
        <Keyboard
          inputName={this.props.inputName}
          onChangeAll={inputs => this.props.onChangeAll(inputs)}
          ref={r => (this.keyboardRef = r)}
          onKeyPress={button => this.onKeyPress(button)}
          theme={"hg-theme-default hg-layout-default myTheme"}
          layoutName={this.state.layoutName}
          layout={{
            default: [
              "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
              "{tab} q w e r t y u i o p [ ] \\",
              "{lock} a s d f g h j k l ; ' {enter}",
              "{shift} z x c v b n m , . / {shift}",
              ".com @ {space}"
            ],
            shift: [
              "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
              "{tab} Q W E R T Y U I O P { } |",
              '{lock} A S D F G H J K L : " {enter}',
              "{shift} Z X C V B N M < > ? {shift}",
              ".com @ {space}"
            ]
          }}
          buttonTheme={[
            {
              class: "hg-red",
              buttons: "Q W E R T Y q w e r t y"
            },
            {
              class: "hg-highlight",
              buttons: "Q q"
            }
          ]}
        />
      </div>
    );
  }
}

export default Keyboarded;

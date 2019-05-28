import React from 'react';
import {connect} from 'react-redux';
import {Notification} from 'api';

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidUpdate(prevProps, prevState) {
      // if(prevProps.notifications !== this.props.notifications){
      //   this.setState({
      //     notifications : this.props.notifications[0].title.rendered
      //   });
      // }
  }

  render() {
    return (
      <footer className="footer new-message">
        <div className="container">
          <div className="box-message">
          </div>
        </div>
      </footer>
    );
  }
}



const bindStateToProps = (state) => {
  return {}
}

export default connect(bindStateToProps)(Footer);

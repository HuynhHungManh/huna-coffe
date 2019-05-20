import React from 'react';
import {connect} from 'react-redux';
import {Notification} from 'api';

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      notifications : ''
    }
    this.props.dispatch(Notification.actions.notifications());
  }

  componentDidUpdate(prevProps, prevState) {
      if(prevProps.notifications !== this.props.notifications){
        this.setState({
          notifications : this.props.notifications[0].title.rendered
        });
      }
  }

  render() {
    return (
      <footer className="footer new-message">
        <div className="container">
          <div className="box-message">
            <h3>{this.state && this.state.notifications}</h3>
          </div>
        </div>
      </footer>
    );
  }
}



const bindStateToProps = (state) => {
  return {
    notifications: state.notifications || []
  }
}

export default connect(bindStateToProps)(Footer);

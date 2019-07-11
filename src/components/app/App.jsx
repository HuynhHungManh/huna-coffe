import React ,{ Component } from 'react';
import {RenderRoutes} from 'base/routes';
import {connect} from 'react-redux';
import Alert from 'react-s-alert';
import {PropTypes} from 'prop-types';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

class App extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillReceiveProps() {
      window.previousLocation = this.props.location
  }

  render() {
    return (
      <div>
        <RenderRoutes routes={this.props.route.routes}/>
        <Alert timeout={3000} stack={{limit: 3}}/>
      </div>
    );
  }
}

App.contextTypes = {
  router: PropTypes.object
};


export default connect()(App);

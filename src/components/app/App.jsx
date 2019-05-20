import React from 'react';
import {RenderRoutes} from 'base/routes';
import {connect} from 'react-redux';

class App extends React.Component {
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
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object
};

export default connect()(App);

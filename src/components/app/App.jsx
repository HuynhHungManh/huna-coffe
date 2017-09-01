import React from 'react';
import {RenderRoutes} from 'base/routes';
import {connect} from 'react-redux';

import {Categories} from 'api';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    Categories.actions.categories.request().then(response => {
      this.props.dispatch({
        type: 'GET_LIST_CATEGORIES',
        categories: response.data
      });
    });
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

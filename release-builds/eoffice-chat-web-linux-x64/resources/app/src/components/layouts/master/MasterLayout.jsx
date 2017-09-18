import React from 'react';
import Header from './Header.jsx';

class MasterLayout extends React.Component {

  render() {
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {}));
    return (
      <div className="wrapper-container">
        <Header/>
        <main className={this.props.defaultMainClass}>
          {childrenWithProps}
        </main>
      </div>
    );
  }
}

MasterLayout.defaultProps = {
  defaultMainClass: ''
}

export default MasterLayout;

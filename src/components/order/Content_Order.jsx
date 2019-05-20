import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import Item_Order from './Item_Order.jsx';
import Bill_Order from './Bill_Order.jsx';
import {PropTypes} from 'prop-types';

class Content_Order extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      products: [],
    }
  }
  componentWillMount() {
    // if (this.props) {
    //   this.setState({
    //     products : this.props.products
    //   })
    // }
    this.setState({
      products : this.props.products
    })
    console.log(this.props.categories);
  }
  render(){
    const products = [
      { name: "Cà phê đen " },
      { name: "Cà phê sữa" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
      { name: "Cà phê sứa SG" },
    ];
    return(
      <div className="content-order">
        <div className="item-order-block">
          <ul className="item-order-box">
            {
              products.map((item, i) => {
                return (
                  <Item_Order key = {i} data = {item}/>
                )
              })
            }
          </ul>
        </div>
        <Bill_Order/>
      </div>
    );
  }
}

Content_Order.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    categories: state.categories || []
  }
}

export default connect(bindStateToProps)(Content_Order);

import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Categories} from 'api';

class Categories_Tab extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      categories: [],
    }
  }
  componentWillMount() {
    this.props.dispatch(Categories.actions.categories()).then((res) =>{
      if (res.data) {
        let categories = this.state.categories;
        // categories[0].status = true;
        // categories.forEach(function(item, index) {
        //   if (item.children.length > 0) {
        //     item.selectStatus = false;
        //   }
        // });
        this.setState({
          categories : res.data
        })
        this.props.dispatch(Categories.actions.products({idProduct: '1'})).then((res) =>{
          console.log(this.props.products);
        });
      }
    })
  }
  render(){
    return(
      <div className="categories-block">
        <ul className="categories-tab">
          { this.state.categories &&
            this.state.categories.map((item, i) => {
              return (
                <li key={i} className="tab">
                  <a>{item.ten}</a>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    categories: state.categories,
    products: state.products
  }
}

export default connect(bindStateToProps)(Categories_Tab);

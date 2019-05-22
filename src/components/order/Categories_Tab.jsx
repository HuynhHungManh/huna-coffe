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
        let categories = res.data;
        categories[0].selectStatus = true;
        categories.forEach(function(item, index) {
          if (index > 0) {
            item.selectStatus = false;
          }
        });
        this.setState({
          categories : categories
        })
        this.chooseCategory(1);
      }
    })
  }

  chooseCategory(categoriesId) {
    this.props.dispatch(Categories.actions.products({idProduct: categoriesId}));
    let itemSelected = this.state.categories.find(value => value.selectStatus === true);
    let preCategories = [];
    this.state.categories.forEach((item, index) => {
      if (item.id === itemSelected.id) {
        item.selectStatus = false;
      }
      if (item.id === categoriesId) {
        item.selectStatus = true;
      }
      preCategories.push(item);
    });
    this.setState({
      categories : preCategories
    })
  }

  render(){
    return(
      <div className="categories-block">
        <ul className="categories-tab">
          { this.state.categories &&
            this.state.categories.map((item, i) => {
              return (
                <li key={i} className={
                  classnames('tab', {
                    'tab-active' : item.selectStatus,
                  })} onClick={this.chooseCategory.bind(this, item.id)}>
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

import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Documents} from 'api';
import SubCategory from './SubCategory.jsx';

class Category extends Component {
  constructor(props, context) {
    super(props, context);
    this.browseDocuments = this.browseDocuments.bind(this);
    this.state = {
      categories : []
    }
  }

  componentWillMount(){
    this.setState({
      categories : this.props.categories
    })
  }

  componentWillUnmount(){
    this.state.categories.forEach(function(item, index) {
      if(item.status !== undefined)
        item.status = undefined;
      if(item.children.length > 0){
        item.children.forEach(function(item, index) {
          if(item.status !== undefined)
            item.status = undefined;
        });
      }
    });
  }

  browseCategories(category) {
    this.props.dispatch(Documents.actions.documents({catSlug: category.slug}));
    var categories = this.state.categories;
    categories.forEach(function(item, index) {
      if(item.id === category.id)
        item.status = true;
      else{
        item.status = false;
      }
    });
    this.setState({categories : categories})
  }

  browseDocuments(id,indexParent,slug) {
    this.props.dispatch(Documents.actions.documents({catSlug: slug}));
    let categories = this.state.categories;
    categories[indexParent].children.forEach(function(item, index) {
      if(item.id === id){
        item.status = true;
      }
      else{
        item.status = false;
      }
    });
    this.setState({categories : categories})
  }

  render() {
    return (
      <div className="box-list-document">
        <h2 className="list-title">
          Lĩnh vực biểu mẫu
        </h2>
        <div className="box-list-scroll resize-box-document ">
          <ul className="list-document">
            { this.state.categories !== undefined &&
              this.state.categories.map((item, i) => {
                return (
                  <li key={i} className="sub-list-document">
                    { item.status && item.children.length > 0 &&
                      <img className ="icon-drop-down" src={require('assets/images/icon/dropdown.png')} />
                    }
                    <p className={
                      classnames('text-document', {
                        'text-active-document' : item.status
                      })}
                      onClick={this.browseCategories.bind(this, item)}
                    >
                      {item.name}
                    </p>
                    { item.children.length > 0 && item.status == true &&
                       <ul className="sub-list-text-document">
                        {
                          item.children.map((subItem, i1) => {
                            return (
                              <SubCategory key={i1} data={subItem} indexParent ={i} browseDocuments ={this.browseDocuments}/>
                            )
                          })
                         }
                        </ul>
                      }
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

const bindStateToProps = (state) => {
  return {
    categories: state.categories
  }
}

export default connect(bindStateToProps)(Category);

import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Documents} from 'api';
import SubCategory from './SubCategory.jsx';
import {Categories} from 'api';
import {PropTypes} from 'prop-types';
import {SearchDocuments} from 'api';
class Category extends Component {
  constructor(props, context) {
    super(props, context);
    this.browseDocuments = this.browseDocuments.bind(this);
    this.state = {
      categories : []
    }
  }

  componentWillMount(){
    if(window.previousLocation.pathname === "/"){
      this.props.dispatch(Categories.actions.categories()).then((res) =>{
        if(res.data.length > 0){
          let categories = this.state.categories;
          categories[0].status = true;
          this.setState({
            categories : categories
          })
          this.props.dispatch(Documents.actions.documents({catSlug: categories[0].slug}));
        }
      });
    }
    this.setState({
      categories : this.props.categories
    })
  }

  searchDocuments() {
      this.props.dispatch(SearchDocuments.actions.searchDocumenrs({nameDocument: ''}));
      this.props.dispatch(Categories.actions.categories());
  }

  browseCategories(category) {
    this.props.dispatch(Documents.actions.documents({catSlug: category.slug}));
    let categories = this.state.categories;
    // let cateSelect = categories.find(val => val.status === true);
    // if(cateSelect && cateSelect.children){
    //   cateSelect.children.forEach(function(item, index) {
    //     item.status = false;
    //   });
    // }
    categories.forEach(function(item, index) {
      if(item.id === category.id){
        if(item.children.length > 0 && item.status === true){
          item.status = !item.status;
        }else{
          item.status = true;
        }
      }
      else{
        item.status = false;
      }
    });
    this.setState({categories : categories})
  }

  browseDocuments(id,indexParent,slug) {
    this.props.dispatch(Documents.actions.documents({catSlug: slug}));
    var categories = this.state.categories;
    categories[indexParent].children.forEach(function(item, index) {
      if(item.id === id){
        item.status = true;
      }
      else {
        item.status = false;
      }
    });
    this.setState({categories : categories})
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.categories !== this.props.categories) {
      this.setState({
        categories : this.props.categories
      });
    }
  }

  render() {
    return (
      <div className="box-list-document">
        <h2 className="list-title" onClick={this.searchDocuments.bind(this)}>
        Lĩnh vực biểu mẫu
        </h2>
        <div className="box-list-scroll resize-box-document ">
          <ul className="list-document">
            { this.state.categories &&
              this.state.categories.map((item, i) => {
                return (
                  <li key={i} onClick={this.browseCategories.bind(this, item)} className={
                      classnames('sub-list-document', {
                        'icon1-Arrow icon1' : !item.status && item.children.length > 0,
                        'icon1-Arrow icon2 transform-icon' : item.status === false && item.children.length > 0,
                        'icon1-Arrow icon2 transform-icon' : item.status === true && item.children.length > 0
                      })}
                    >
                    <p className={
                      classnames('text-document', {
                        'text-active-document' : item.status,
                      })}

                    >
                      {item.name}
                    </p>
                    { item.children.length > 0 && item.status == true &&
                       <ul className="sub-list-text-document">
                        {
                          item.children.map((subItem, i1) => {
                            return (
                              <SubCategory key={i1} data={subItem} indexParent ={i} browseDocuments ={this.browseDocuments} storeHistory={this.storeHistoryCategories}/>
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

Category.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    categories: state.categories,
    documents : state.documents
  }
}

export default connect(bindStateToProps)(Category);

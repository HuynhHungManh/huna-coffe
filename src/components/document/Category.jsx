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
          categories.forEach(function(item, index) {
              if(item.children.length >0){
                item.selectStatus = false;
              }
            });
          this.setState({
            categories : categories
          })
          this.props.dispatch(Documents.actions.documents({idCat: categories[0].id}));
        }
      });
    }
    else{
      this.setState({
        categories : this.state.keySearch
      })
    }
    this.setState({
      categories : this.props.categories
    })
  }

  resetData() {
      this.props.dispatch(Documents.actions.documentsAll());
      this.props.dispatch(Categories.actions.categories());
  }

  browseCategories(category) {
    this.props.dispatch(Documents.actions.documents({idCat: category.id}));
    let categories = this.state.categories;
    categories.forEach(function(item, index) {
      if(item.id === category.id){
        if(item.children.length > 0 && item.status === true){
          item.status = true;
          item.selectStatus = !item.selectStatus;
        }
        else{
          item.status = true;
          item.selectStatus = false;
        }
      }
      else{
        item.status = false;
        if(item.children.length > 0){
          // if(item.selectStatus === false ){
          //   item.status = true;
          // }
          let children = item.children.find(x => x.status === true);
          if(children && children.status)
            children.status = false;
          item.selectStatus = false;
        }
      }
    });
    this.setState({categories : categories})
  }

  browseDocuments(id,indexParent,idCat) {
    this.props.dispatch(Documents.actions.documents({idCat: idCat}));
    var categories = this.state.categories;
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

  componentDidUpdate(prevProps, prevState){
    if(prevProps.categories !== this.props.categories) {
      if(this.props.status === true){
        this.state.categories.forEach(function(item, index) {
          if(item.children.length >0){
            item.selectStatus = false;
              item.status = true;
          }
        });
      }
      this.setState({
        categories : this.props.categories
      });
    }
  }

  render() {
    return (
      <div className="box-list-document">
        <h2 className="list-title" onClick={this.resetData.bind(this)}>
        Lĩnh vực biểu mẫu
        </h2>
        <div className="box-list-scroll resize-box-document ">
          <ul className="list-document">
            { this.state.categories &&
              this.state.categories.map((item, i) => {
                return (
                  <li key={i} className="sub-list-document">
                    <p className={
                      classnames('text-document', {
                        'text-active-document' : item.status,
                        'arrow-down-default' : !item.status && item.children.length > 0,
                        'text-active-document arrow-down' : item.status && item.children.length > 0,
                        'text-active-document arrow-up' : item.status && item.children.length > 0 && item.selectStatus
                      })}
                      onClick={this.browseCategories.bind(this, item)}
                    >
                      {item.name}
                    </p>
                    { item.children.length > 0 && item.status == true && item.selectStatus === false &&
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
    documents : state.documents,
    status : state.status
  }
}

export default connect(bindStateToProps)(Category);

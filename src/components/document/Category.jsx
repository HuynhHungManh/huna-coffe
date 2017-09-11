import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Documents} from 'api';
import SubCategory from './SubCategory.jsx';

class Category extends Component {
  constructor(props, context) {
    super(props, context);
    this.browseDocuments = this.browseDocuments.bind(this);
  }

  browseDocuments(category) {
    this.props.dispatch(Documents.actions.documents({catSlug: category.slug}));
  }

  changeStyleCategories(items) {
    if(item.length > 0)
      return true;
    return false
  }

  render() {
    return (
      <div className="box-list-document">
        <h2 className="list-title">
          Lĩnh vực biểu mẫu
        </h2>
        <div className="box-list-scroll resize-box-document ">
          <ul className="list-document">
            {
              this.props.categories.map((item, i) => {
                return (
                  <li key={i} className="sub-list-document">
                    <p className={
                      classnames('text-document', {
                        //'text-active-document' : item.statusClick
                      })}
                      onClick={this.browseDocuments.bind(this, item)}
                    >
                      {item.name}
                    </p>
                    { item.children.length > 0 &&
                       <ul className="sub-list-text-document">
                        {
                          item.children.map((subItem, i1) => {
                            return (
                              <SubCategory key={i1} data={subItem} browseDocuments ={this.browseDocuments}/>
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

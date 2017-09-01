import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';

class Category extends Component {
  constructor(props, context) {
    super(props, context);
  }

  handleDocument(id, id_category){
    this.resetState();
    this.setState({
      documents: this.state.documents.filter(item => item.id_parent === id)
    })
    let checkStatusSubCategory = this.state.categories[id_category-1].subCategories.find((item) => item.statusClick === true);
    let arrCategories = this.state.categories;

    arrCategories[id_category-1].subCategories[id-1].statusClick = !arrCategories[id_category-1].subCategories[id-1].statusClick;
    arrCategories[id_category-1].statusClick = true;
    this.setState({
      categories : arrCategories
    });
  }

  handleClickFieldDocument(index){
    let arrCategories = this.state.categories;
    let checkStatus = this.state.categories.find((item) => item.statusClick === true);
    if(checkStatus !== undefined){
      arrCategories[checkStatus.id-1].statusClick = false;
      this.setState({
        categories : arrCategories
      });
    }
    arrCategories[index].statusClick = !this.state.categories[index].statusClick;
    this.setState({
      categories : arrCategories
    });
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
                        'text-active-document' : item.statusClick
                      })}
                      onClick={this.handleClickFieldDocument.bind(this,i)}
                    >
                      {item.title}
                    </p>
                    { item.statusClick &&
                      <ul className="sub-list-text-document">
                      {
                        item.subCategories.map((subItem, i1) => {
                          return (
                            <li key={i1} className={
                              classnames('box-sub-text-document', {
                                'text-active-document' : subItem.statusClick
                              })}
                             onClick={this.handleDocument.bind(this,subItem.id , subItem.id_parent)}>
                              <p className="sub-text-document ">{subItem.subTitle} </p>
                            </li>
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

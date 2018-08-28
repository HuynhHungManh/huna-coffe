import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Plans} from 'api';
import SubCategoryPlan from './SubCategoryPlan.jsx';
import {CategoryPlans} from 'api';
import {PropTypes} from 'prop-types';

class CategoryPlan extends Component {
  constructor(props, context) {
    super(props, context);
    this.browsePlans = this.browsePlans.bind(this);
    this.state = {
      categoryplans : []
    }
  }

  componentWillMount(){
    if(window.previousLocation.pathname === "/"){
      this.props.dispatch(CategoryPlans.actions.categoryplans()).then((res) =>{
        if(res.data.length > 0){
          let categoryplans = this.state.categoryplans;
          categoryplans[0].status = true;
          categoryplans.forEach(function(item, index) {
              if(item.children.length >0){
                item.selectStatus = false;
              }
            });
          this.setState({
            categoryplans : categoryplans
          })
          this.props.dispatch(Plans.actions.plans({idCat: categoryplans[0].id}));
        }
      });
    }
    this.setState({
      categoryplans : this.props.categoryplans
    })
  }

  resetData() {
      this.props.dispatch(Plans.actions.plansAll());
      this.props.dispatch(CategoryPlans.actions.categoryplans());
  }

  browsecategoryplans(categoryplan) {
     this.props.dispatch(Plans.actions.plans({idCat: categoryplan.id}));
     let categoryplans = this.state.categoryplans;
     categoryplans.forEach(function(item, index) {
       if(item.id === categoryplan.id) {
         if(item.children.length > 0 && item.status === true) {
           item.status = true;
           item.selectStatus = !item.selectStatus;
         } else {
             item.status = true;
             item.selectStatus = false;
           }
       } else {
           item.status = false;
           if(item.children.length > 0) {
             let children = item.children.find(x => x.status === true);
             if(children && children.status)
               children.status = false;
             item.selectStatus = false;
           }
         }
     });
     this.setState({categoryplans : categoryplans});
   }

   browsePlans(id,indexParent,idCat) {
     this.props.dispatch(Plans.actions.plans({idCat: idCat}));
     var categoryplans = this.state.categoryplans;
     categoryplans[indexParent].children.forEach(function(item, index) {
       if(item.id === id){
         item.status = true;
       }
       else{
         item.status = false;
       }
     });
     this.setState({categoryplans : categoryplans})
   }

   componentDidUpdate(prevProps, prevState){
     if(prevProps.categoryplans !== this.props.categoryplans) {
       if(this.props.status === true){
         this.state.categoryplans.forEach(function(item, index) {
           if(item.children.length >0){
             item.selectStatus = false;
               item.status = true;
           }
         });
       }
       this.setState({
         categoryplans : this.props.categoryplans
       });
     }
   }

   render() {
     return(
       <div className="box-list-document">
         <h2 className="list-title" onClick={this.resetData.bind(this)}>
         Thông Tin Quy Hoạch
         </h2>
         <div className="box-list-scroll resize-box-document ">
           <ul className="list-document">
             {
               this.state.categoryplans &&
                 this.state.categoryplans.map((item, i) => {
                   return (
                     <li key={i} className="sub-list-document">
                      <p className={
                        classnames('text-document', {
                        'text-active-document' : item.status,
                        'arrow-down-default' : !item.status && item.children.length > 0,
                        'text-active-document arrow-down' : item.status && item.children.length > 0,
                        'text-active-document arrow-up' : item.status && item.children.length > 0 && item.selectStatus
                        })}
                        onClick={this.browsecategoryplans.bind(this, item)}
                      >
                        {item.name}
                      </p>
                      {
                        item.children.length > 0 && item.status == true && item.selectStatus === false &&
                        <ul className="sub-list-text-document">
                          {
                            item.children.map((subItem, i1) => {
                              return (
                                <SubCategoryPlan key={i1} data={subItem} indexParent ={i} browsePlans ={this.browsePlans} storeHistory={this.storeHistoryCategories}/>
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

CategoryPlan.contextTypes = {
  router : PropTypes.any
}

const bindStateToProps = (state) => {
  return {
    categoryplans: state.categoryplans,
    plans : state.plans,
    status : state.status
  }
}

export default connect(bindStateToProps)(CategoryPlan);

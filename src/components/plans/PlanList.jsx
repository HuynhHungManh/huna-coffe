import React, {Component} from 'react';
import {connect} from 'react-redux';
import PlanListItem from './PlanListItem.jsx';

class PlanList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state= {
      plans : [],
      status : false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.plans !== this.props.plans) {
      this.setState({
        plans : this.props.plans
      });
      if(this.props.plans.length === 0){
        this.setState({ 'status' : true})
      }
      else{
        this.setState({ 'status' : false})
      }
    }
  }

  componentWillMount() {
    let previousLocation = 'view-project';
    if(window.previousLocation.pathname.indexOf(previousLocation) >= 0) {
      this.setState({
        plans : this.props.plans
      })
    }
  }

  render() {
    return (
      <div className="box-detail-document">
        <h2 className="list-title">
          Bản đồ quy hoạch <span className="document-total">({this.state.plans && this.state.plans.length})</span>
        </h2>
        <div className="box-detail-scroll resize-box-document">
          { this.state.status &&
            <span className="notification-document"> Không tìm thấy bản đồ quy hoạch !</span>
          }
          <ul className="list-detail-plan">
              {this.state.plans.map((item, i) => {
                return (<PlanListItem key={i} data={item} />)
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
    plans: state.plans || []
  }
}

export default connect(bindStateToProps)(PlanList);

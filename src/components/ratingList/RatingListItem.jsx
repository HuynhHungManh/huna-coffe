import React, { Component } from 'react';
import {connect} from 'react-redux';
import RatingItem from './RatingItem.jsx';
import {Ratings} from 'api';



class RatingListItem extends Component {

constructor(props, context) {
  super(props, context);
  this.props.dispatch(Ratings.actions.ratings());
}
  render() {
    return (
      <div className="list-scroll">
        <div className="list-info">
          <ul className="box-list-info">
            {
              this.props.ratings.map((item, i) => {
                return (
                  <RatingItem key = {i} data={item}/>
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
    ratings: state.ratings
  }
}

export default connect(bindStateToProps)(RatingListItem);

import React, { Component } from 'react';
import {connect} from 'react-redux';
import RatingItem from './RatingItem.jsx';

class RatingListItem extends Component {

constructor(props, context) {
  super(props, context);
  this.state={
    staffs : [
      { id : 1,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
      { id : 2,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
      { id : 3,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
      { id : 4,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
      { id : 5,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
      { id : 6,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
      { id : 7,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
      { id : 8,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
      { id : 9,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
      { id : 10,
        name : 'Phạm Đình Minh Hải',
        dOB : '08/03/1983',
        imageAva : 'assets/images/ava/ava1.png',
        level : 'Đại học',
        position : 'Chánh văn phòng'
      },
    ]
  }
}

  render() {
    return (
      <div className="list-scroll">
        <div className="list-info">
          <ul className="box-list-info">
            {
              this.state.staffs.map((item, i) => {
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

  }
}

export default connect(bindStateToProps)(RatingListItem);

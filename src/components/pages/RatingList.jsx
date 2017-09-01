import React, { Component } from 'react';
import {CommonLayout} from 'layouts';


class RatingList extends Component {
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

  gotoPage(page) {
    this.props.history.push(page);
  }

  render() {
  console.log(this.state);
    return (
      <CommonLayout>
        <div className="container">
        <div className="header">
          <h2 className="title bg-rate">
            <span className="title-main">Đánh giá công chức tiếp nhận</span>
          </h2>
        </div>
        <div className="content">
          <div className="list-scroll">
            <div className="list-info">
              <ul className="box-list-info">
                {
                  this.state.staffs.map((item, i) => {
                    return (
                      <li key = {i} className="item">
                        <div className="sub-info-block">
                          <div className="sub-ava">
                            <img className="img-sub-ava" src={require('assets/images/ava/ava1.png')} />
                          </div>
                          <div className="info-main-content">
                            <div className="header-box">
                              <h2 className="name-info">{item.name}</h2>
                            </div>
                            <div className="box-sub-info">
                              <div className="sub-info-content">
                                <p className="info-detail"><span className="dob bold">Ngày sinh:</span><span className="dob-result"> {item.dOB}</span></p>
                                <p className="info-detail"><span className="level bold">Trình độ học vấn:</span> <span className="level-result">{item.level}</span></p>
                                <p className="info-detail"><span className="position bold">Chức vụ:</span> <span className="position-result">{item.position}</span></p>
                                <button className="btn btn-rate" onClick={this.gotoPage.bind(this,'/rating-detail')}>
                                  <i className="icon-rate-1" /><span className="text-btn-rate">ĐÁNH GIÁ</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
      </CommonLayout>
    );
  }
}

export default RatingList;

import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import classnames from 'classnames';


class Document extends Component {
  constructor(props, context) {
    super(props, context);
    this.resetState();
  }

  gotoProcedureDetail(xxx) {
    this.props.history.push('/procedure-detail');
  }

  resetState(){
    this.state = {
      categories: [
        {
          id : 1,
          title: 'An toàn thực phẩm',
          sub1Categories: [],
          statusClick : false
        },
        {
          id : 2,
          title: 'Hộ tịch',
          sub1Categories: [
            {
              id : 1,
              subTitle: 'Thủ tục kết hôn',
              statusClick : false,
              id_parent: 2
            },
            {
              id : 2,
              subTitle: 'Thủ tục khai sinh',
              statusClick : false,
              id_parent: 2
            },
            {
              id : 3,
              subTitle: 'Thủ tục khai tử',
              statusClick : false,
              id_parent: 2
            },
          ]
        },
        {
          id : 3,
          title: 'kết cấu hạ tầng giao thông',
          sub1Categories: [],
          statusClick : false
        },
        {
          id : 4,
          title: 'bảo trợ xã hội',
          sub1Categories: [],
          statusClick : false
        },
        {
          id : 5,
          title: 'An toàn thực phẩm',
          sub1Categories: [],
          statusClick : false
        },
        {
          id : 6,
          title: 'An toàn thực phẩm',
          sub1Categories: [],
          statusClick : false
        },
        {
          id : 7,
          title: 'An toàn thực phẩm',
          sub1Categories: [],
          statusClick : false
        },
      ],
      documents: [
        {
          id: 1,
          title: 'Thông tư 40/2016/TT-BTC của Bộ Tài chính',
          id_parent: 1
        },
        {
          id: 2,
          title: 'Thông tin về khoản thu phí',
          id_parent: 1
        },
        {
          id: 3,
          title: 'Thông tin về khoản thu phí',
          id_parent: 1
        },
        {
          id: 4,
          title: 'Nội dung thực hiện kiến nghị, phản ánh của cá nhân, tổ chức',
          id_parent: 1
        },
        {
          id: 5,
          title: 'Thông tư 39/2016/TT-BTC của Bộ Tài chính',
          id_parent: 1
        },
        {
          id: 6,
            title: 'Thông tin về khoản thu phí',
          id_parent: 1
        },
        {
          id: 7,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 1
        },
        {
          id: 8,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 1
        },
        {
          id: 9,
          title: 'Thông tư 40/2016/TT-BTC của Bộ Tài chính',
          id_parent: 2
        },
        {
          id: 10,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 2
        },
        {
          id: 11,
            title: 'Thông tin về khoản thu phí',
          id_parent: 2
        },
        {
          id: 12,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 2
        },
        {
          id: 13,
          title: 'Thông tin về khoản thu phí',
          id_parent: 3
        },
        {
          id: 14,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 3
        },
        {
          id: 15,
          title: 'Thông tin về khoản thu phí',
          id_parent: 3
        },
        {
          id: 16,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 3
        },
      ]
    };
  }

  handleDocument(id, id_category){
    this.resetState();
    this.setState({
      documents: this.state.documents.filter(item => item.id_parent === id)
    })
    let checkStatusSubCategory = this.state.categories[id_category-1].sub1Categories.find((item) => item.statusClick === true);
    let arrCategories = this.state.categories;

    arrCategories[id_category-1].sub1Categories[id-1].statusClick = !arrCategories[id_category-1].sub1Categories[id-1].statusClick;
    arrCategories[id_category-1].statusClick = true;
    this.setState({
      categories : arrCategories
    });
  }

  handleClickFieldDocument(index){
    let arrCategories = this.state.categories;
      console.log(this.state.categories);
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
      <CommonLayout>
        <div className="container">
          <div className="header">
            <h2 className="title bg-document">
              <span className="title-main">Biểu mẫu điện tử</span>
            </h2>
            <div className="form-search">
              <button className="btn-search icon-zoom" />
              <input className="inp-search" type="text" placeholder="Tìm kiếm tên thủ tục" />
            </div>
          </div>
          <div className="content">
            <div className="box-list-document">
              <h2 className="list-title">
                Lĩnh vực biểu mẫu
              </h2>
              <div className="box-list-scroll resize-box-document ">
                <ul className="list-document">
                  {
                    this.state.categories.map((item, i) => {
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
                          <ul className="sub-list-text-document">
                          {
                            item.sub1Categories.map((subItem, i1) => {
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
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
            <div className="box-detail-document">
              <h2 className="list-title">
                Tệp biểu mẫu
              </h2>
              <div className="box-detail-scroll resize-box-document">
                <ul className="list-detail-document">
                  {
                    this.state.documents.map((item, i) => {
                      return (
                        <li key={i} className="sub-detail-document" onClick={this.gotoProcedureDetail.bind(this, 'xxx')}>
                          <p className="text-detail-document">{item.title}</p>
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

export default Document;

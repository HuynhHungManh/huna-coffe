import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import classnames from 'classnames';

import {Category,DocumentList} from 'components/document';

class Document extends Component {
  constructor(props, context) {
    super(props, context);
    this.resetState();
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

  resetState(){
    this.state = {
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
        {
          id: 17,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 3
        },
        {
          id: 18,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 3
        },
        {
          id: 19,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 3
        },
        {
          id: 19,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 3
        },
        {
          id: 20,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 3
        },
        {
          id: 21,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 3
        },
        {
          id: 22,
          title: 'Danh mục công khai niêm yết xử phạt VPHC',
          id_parent: 3
        },
      ]
    };
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
          <Category />
          <DocumentList />
          </div>
        </div>
      </CommonLayout>
    );
  }
}

export default Document;

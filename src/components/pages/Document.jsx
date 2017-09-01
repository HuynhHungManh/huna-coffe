import React, { Component } from 'react';
import {CommonLayout} from 'layouts';
import classnames from 'classnames';
import {Category} from 'components/document';


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
            <Category/>
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

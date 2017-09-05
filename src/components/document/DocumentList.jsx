import React, { Component } from 'react';
import {connect} from 'react-redux';
import DocumentListItem from './DocumentListItem.jsx';


class DocumentList extends Component {

constructor(props, context) {
  super(props, context);
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
    ]
  }
}

  render() {
    return (
      <div className="box-detail-document">
        <h2 className="list-title">
          Tệp biểu mẫu
        </h2>
        <div className="box-detail-scroll resize-box-document">
          <ul className="list-detail-document">
            {
              this.props.documents.map((item, i) => {
                return (
                  <DocumentListItem key={i} data={item}/>
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
    documents: state.documents || []
  }
}

export default connect(bindStateToProps)(DocumentList);

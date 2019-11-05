import React, { Component } from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {Categories, NoteOrder, Promotion, Orders} from 'api';
import {CSVLink, CSVDownload} from 'react-csv';
import DragScrollProvider from 'drag-scroll-provider';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import Modal from 'react-modal';
Modal.setAppElement('body');
import PropTypes from 'prop-types';

class Categories_Tab extends Component {
  constructor(props, context) {
    super(props, context);
    let today = new Date();
    this.state = {
      categories: [],
      dataStore: {},
      paramMost: {
        soKetQua: 20,
        banChayTrongSoNgay: today.getDate()
      },
      noteOrders: [],
      statusPopup: false
    }
  }

  componentWillMount() {
    this.props.dispatch(this.changeStatusLoadData(true));
    let storeData = JSON.parse(localStorage.getItem('storeData'));
    let checkOnlyShowPopup = JSON.parse(localStorage.getItem('checkOnlyShowPopup'));
    if (this.props.checkOffline == false) {
      this.props.dispatch(Categories.actions.categories()).then((res) => {
        if (res.data) {
          let categories = [{
            id: 0,
            ten: "Bán chạy",
            iconUrl: "",
            soThuTu: 0,
          }];
          categories = categories.concat(res.data);
          let arrayProducts = [];
          let arrayId = [];
          categories.forEach(function(item, index) {
            if (item.id == 0) {
              item.selectStatus = true;
            } else {
              item.selectStatus = false;
              arrayId.push(item.id);
            }
          });
          this.setState({
            categories : categories
          });
          this.chooseCategory(0);
          if (!storeData || (window.previousLocation && window.previousLocation.pathname === "/")) {
            this.loadAllData(arrayId, this.state.paramMost, categories);
          } else {
            this.props.dispatch(this.changeStatusLoadData(false));
          }
        }
      })
      .catch((error) => {
        this.props.dispatch(this.dispatchCheckOffline(true));
        this.setState({
          categories : storeData.data.categories,
          dataStore: storeData,
          statusPopup: (checkOnlyShowPopup && this.props.checkOffline == true) ? false : true
        });
        this.chooseCategory(0);
        this.props.dispatch(this.dispatchNoteOrders(storeData.data.noteOrders));
        this.props.dispatch(this.dispatchPromotion(storeData.data.promotion));
      });
    } else {
      localStorage.setItem('checkOnlyShowPopup', JSON.stringify(true));
      this.props.dispatch(this.dispatchCheckOffline(true));
      const promise = new Promise((resolve, reject) => {
        this.setState({
          categories : storeData.data.categories,
          dataStore: storeData,
        });
        resolve(true);
      });
      Promise.all([promise]).then(values => {
        this.chooseCategory(0);
      });
      this.props.dispatch(this.dispatchNoteOrders(storeData.data.noteOrders));
      this.props.dispatch(this.dispatchPromotion(storeData.data.promotion));
    }
  }
  
  dispatchCheckOffline(isOffline) {
    return {
      type: 'CHECK_OFFLINE',
      isOffline
    }
  }

  dispatchNoteOrders(noteOrders) {
    return {
      type: 'LIST_NOTE_ORDER',
      noteOrders
    }
  }

  dispatchPromotion(promotion) {
    return {
      type: 'GET_PROMOTION',
      promotion
    }
  }

  checkOnline() {
    if (navigator.onLine) {
      return true;
    } else {
      return false;
    }
  }

  alertNotification(message, type) {
    let option = {
      position: 'top-right',
      timeout: 3000
    };
    switch (type) {
      case 'info':
        Alert.info(message, option);
        break;
      case 'success':
        Alert.success(message, option);
        break;
      case 'warning':
        Alert.warning(message, option);
        break;
      case 'error':
        Alert.error(message, option);
      default:
          break;
    };
  }

  getDataStore(categories) {
    return {
      type: 'GET_LIST_CATEGORIES',
      categories
    }
  }

  dispatchToRedux(data) {
    this.props.dispatch(this.getDataStore.bind(this, data));
    this.setState({
      categories : data.data.categories
    });
    this.chooseCategory(0);
  }

  loadAllData (arrayId, paramMost, categories) {
    let data = {
      productMost : [],
      products: [],
      categories: categories
    }
    const promise = new Promise((resolve, reject) => {
      let noteOrders = [];
      let promotion = [];
      let peolePromotion = [];
      let ressonCancelOrders = [];
      let date = new Date();
      let dateTodayFormat = JSON.parse(JSON.stringify(date));
      this.props.dispatch(Promotion.actions.peolePromotion()).then((res) => {
        if (res.data) {
          peolePromotion = res.data.content;
        }
      });
      this.props.dispatch(Promotion.actions.promotion()).then((res) => {
        if (res.data) {
          promotion = res.data;
        }
      });
      this.props.dispatch(NoteOrder.actions.noteOrders()).then((res) => {
        if (res.data) {
          noteOrders = res.data;
        }
      });
      this.props.dispatch(Orders.actions.ressonCancelOrders({ngayOrder: dateTodayFormat})).then((res) => {
        if (res.data) {
          ressonCancelOrders = res.data;
        }
      });
      this.props.dispatch(Categories.actions.productsMost(paramMost)).then((res) => {
        if (res.data) {
          let arrayProducts = [];
          data.productMost = res.data;
          for(let i = 0; i < arrayId.length; i++) {
            this.props.dispatch(Categories.actions.products({idProduct: arrayId[i]})).then((resProducts) => {
              if (resProducts.data) {
                let jsonProduct = {
                  id : arrayId[i],
                  data: resProducts.data
                }
                arrayProducts.push(jsonProduct);
              }
              if (i == arrayId.length - 1) {
                data.products = arrayProducts;
                data.noteOrders = noteOrders;
                data.promotion = promotion;
                data.peolePromotion = peolePromotion;
                data.ressonCancelOrders = ressonCancelOrders;
                let obj = {
                  data: data
                }
                resolve(obj);
              }
            });
          }
        }
      })
      .catch((error) => {
        // switch off
      });
    });

    Promise.all([promise]).then(values => {
      var data = values[0];
      // let auth = JSON.parse(localStorage.getItem('auth'));
      console.log(data);
      localStorage.setItem('storeData', JSON.stringify(data));
      this.props.dispatch(Categories.actions.productsMost(this.state.paramMost));
      this.props.dispatch(this.changeStatusLoadData(false));
      this.setState({
        dataStore: data
      });


      // try {
      //   const mainProcess = window.require("electron").remote.require('./storeData.js');
      //   mainProcess.storeData(data);
      //   console.log('da luu');
      // }
      // catch(err) {
      //   console.log('Not store');
      // }
      
      // console.log(data);
      // let getProducts = JSON.parse(localStorage.getItem('products'));
      // console.log(getProducts);
      // this.setState({
      //   chooseProductsBill: data.chooseProductsBill,
      //   products: data.arrayPreProduct,
      //   priceTotal: data.priceTotal
      // });
    });
  }

  changeStatusLoadData(status) {
    return {
      type: 'STATUS_LOAD_DATA',
      status
    }
  }

  setDataStore(type, data) {
    let dataDispatch = {
      type: type,
      productsMost: []
    }
    if (type == 'GET_LIST_PRODUCTS_MOST') {
      dataDispatch.productsMost = data;
    } else {
      dataDispatch.products = data;
    }
    return dataDispatch
  }

  dispatchToReduxStore(type, data) {
    this.props.dispatch(this.setDataStore(type, data));
  }

  chooseCategory(categoriesId) {
    localStorage.setItem('categoriesIdCurrent', JSON.stringify(categoriesId));
    let today = new Date();
    if (categoriesId == 0) {
      if (!this.props.checkOffline) {
        this.props.dispatch(Categories.actions.productsMost(this.state.paramMost))
        .then((res) => {})
        .catch((error) => {
          this.alertNotification('Server lỗi!', 'error');
        });
      } else {
        if (this.state.dataStore.data && this.state.dataStore.data.productMost) {
          this.dispatchToReduxStore('GET_LIST_PRODUCTS_MOST', this.state.dataStore.data.productMost);
        }
        this.props.dispatch(this.changeStatusLoadData(false));
      }
    } else {
      if (!this.props.checkOffline) {
        this.props.dispatch(Categories.actions.products({idProduct: categoriesId}))
        .then((res) => {})
        .catch((error) => {
          this.alertNotification('Server lỗi!', 'error');
        });
      } else {
        let arrChoose = this.state.dataStore.data.products.find(item => item.id == parseInt(categoriesId));
        if (arrChoose && arrChoose.data) {
          this.dispatchToReduxStore('GET_LIST_PRODUCTS', arrChoose.data);
        }
        this.props.dispatch(this.changeStatusLoadData(false));
      }      
    }
    let itemSelected = this.state.categories.find(value => value.selectStatus === true);
    let preCategories = [];
    this.state.categories.forEach((item, index) => {
      if (item.id === itemSelected.id) {
        item.selectStatus = false;
      }
      if (item.id === categoriesId) {
        item.selectStatus = true;
      }
      preCategories.push(item);
    });
    this.setState({
      categories : preCategories
    })
  }

  closeModel() {
    this.setState({
      statusPopup : false
    });
  }

  render() {
    return(
      <DragScrollProvider>
        {({ onMouseDown, ref }) => (
        <div
          className="categories-block scrollable"
          ref={ref}
          onMouseDown={onMouseDown}>
            <ul className="categories-tab">
              { this.state.categories &&
                this.state.categories.map((item, i) => {
                  return (
                    <li key={i} className={
                      classnames('tab', {
                        'tab-active' : item.selectStatus,
                      })} onClick={this.chooseCategory.bind(this, item.id)}>
                      <a>{item.ten}</a>
                    </li>
                  )
                })
              }
            </ul>
            <Modal
              isOpen={this.state.statusPopup}
              contentLabel="Modal"
              className="modal popup"
            >
              <div className="check-online-block">
                <div className="check-online-header">
                  <p className="text-title">Xác nhận</p>
                  <span className="icon-cross" onClick={this.closeModel.bind(this)}></span>
                </div>
                <div className="check-online-content">
                  <p>Bị mất kết nối mạng hoặc server bị lỗi, </p>
                  <p>ứng dụng đã chuyển sang trạng thái <span className="text-color-red">OFFLINE</span> !</p>
                </div>
                <div className="check-online-footer">
                  <button className="btn close-button" onClick={this.closeModel.bind(this)}>
                    Đóng
                  </button>
                </div>
              </div>
            </Modal>
        </div>
        )}
      </DragScrollProvider>
    );
  }
}

Categories_Tab.contextTypes = {
  router: PropTypes.object
};

const bindStateToProps = (state) => {
  return {
    categories: state.categories,
    products: state.products,
    data: state.storeData,
    checkOffline: state.checkOffline
  }
}

export default connect(bindStateToProps)(Categories_Tab);

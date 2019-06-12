import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
const rest = reduxApi({
  orders: {
    url: '/orders',
    options:(url, params, getState) => {
      let auth = JSON.parse(localStorage.getItem('auth'));
      let token = '';
      if (auth && auth.token) {
        token = auth.token;
      }
      return {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        data: params
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'ORDERS',
          orders: data.data
        });
      }
    ]
  },
  getOrders: {
    url: '/orders',
    options:(url, params, getState) => {
      let auth = JSON.parse(localStorage.getItem('auth'));
      let token = '';
      if (auth && auth.token) {
        token = auth.token;
      }
      return {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'GET_ORDERS',
          getOrders: data.data
        });
      }
    ]
  },
  ressonCancelOrders: {
    url: '/lydohuyorders',
    options:(url, params, getState) => {
      let auth = JSON.parse(localStorage.getItem('auth'));
      let token = '';
      if (auth && auth.token) {
        token = auth.token;
      }
      return {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'RESSON_CANCEL_ORDERS',
          ressonCancelOrders: data.data
        });
      }
    ]
  },
  cancelOrders: {
    url: '/orders/:idOrder/huyOrder',
    options:(url, params, getState) => {
      let auth = JSON.parse(localStorage.getItem('auth'));
      let token = '';
      if (auth && auth.token) {
        token = auth.token;
      }
      console.log(params);
      return {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        data: {params}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'CANCEL_ORDERS',
          cancelOrders: data.data
        });
      }
    ]
  },
  orderThucDons: {
    url: '/orderThucDons',
    options:(url, params, getState) => {
      let auth = JSON.parse(localStorage.getItem('auth'));
      let token = '';
      if (auth && auth.token) {
        token = auth.token;
      }
      return {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'ORDER_THUCDONS',
          orderThucDons: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL_HUNA);

export default rest;

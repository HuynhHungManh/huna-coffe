import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
const rest = reduxApi({
  promotion: {
    url: '/khuyenmais',
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
          type: 'GET_PROMOTION',
          promotion: data.data
        });
      }
    ]
  },
  totalPromotion: {
    url: '/orders/chietKhauTrongCa',
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
          type: 'GET_TOTAL_PROMOTION_TODAY',
          totalPromotion: data.data
        });
      }
    ]
  },
  peolePromotion: {
    url: '/orders/nguoiChietKhau',
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
          type: 'GET_PEOPLE_PROMOTION',
          promotion: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL_HUNA);

export default rest;
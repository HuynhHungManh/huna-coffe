import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
let auth = JSON.parse(localStorage.getItem('auth'));
let token = '';
if (auth && auth.token) {
  token = auth.token;
}

const rest = reduxApi({
  categories: {
    url: '/loaithucdons',
    options:(url, params, getState) => {
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
          type: 'GET_LIST_CATEGORIES',
          categories: data.data
        });
      }
    ]
  },
  products: {
    url: '/thucdons?loaiThucDonId=:idProduct',
    options:(url, params, getState) => {
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
          type: 'GET_LIST_PRODUCTS',
          products: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL_HUNA);

export default rest;

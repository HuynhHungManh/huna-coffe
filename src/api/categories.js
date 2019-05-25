import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
let auth = JSON.parse(localStorage.getItem('auth'));
let token = '';
if (auth.token) {
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
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': "Bearer eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiZGlyIn0..JNHKc4rBGOpKndlv.E0cC0NUw_LCZvU9FT1YWaAkMKNM4zWOpupoN566dCdcQlCg3m91GL8T9lHWb_pviMa4FgYBbfQaAB8bvKcm9cvmdk2t6YWXgi_cI5cnTkUwva4ynBSM94JLjWObhuRT4GMHEB9SZH2ZyMSP_MFp0ZDrREymfPCnv0wsy5KY9VISNxw7ykJqVAcrkQ6kauW2xtFdKfJ8JtdADwH94Gv7N5yX9VZmj5XQ1NQLCeQScPCtXUJGWKj0iNqRPJSLmMGwG4s9oomyejXwdPhQPbeDCDl9btCiOb_40pim-DOU8Be9KEf1o9RrXNsYuGuA0UGFR6ZaH6GREaVsXnd4qpt3t.Xv9USee085LY3Vyr99Xs2Q"
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

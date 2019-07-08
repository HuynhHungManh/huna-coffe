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
  totalPrice: {
    url: '/orders/tongTienTrongCa',
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
          type: 'GET_TOTAL_PRICE_TODAY',
          totalPrice: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL_HUNA);

export default rest;
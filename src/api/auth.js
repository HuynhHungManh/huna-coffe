import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

let auth = JSON.parse(localStorage.getItem('auth'));

// Example
const rest = reduxApi({
  login: {
    url: '/auth/login',
    options:(url, params, getState) => {
      return {
        method: "POST",
        headers: params,
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'LOGIN',
          login: data.data
        });
      }
    ]
  },
  logout: {
    url: '/auth/logout',
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
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'LOGOUT',
          logout: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL_HUNA);

export default rest;

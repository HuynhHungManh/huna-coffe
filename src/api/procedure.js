import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
const rest = reduxApi({
  procedures: {
    url: '/thu-tuc',
    options:(url, params, getState) => {
      return {
        method: "GET",
        headers: {
          //'Content-Type': 'application/json'
          "Authorization": "Basic YWRtaW46MTIzNDU2",
        },
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'GET_LIST_PROCEDURE',
          procedures: data.data
        });
      }
    ]
  },
  searchProcedure: {
    url: '/tra-cuu-thu-tuc',
    options:(url, params, getState) => {
      return {
        method: "POST",
        headers: {
          //'Content-Type': 'application/json'
          "Authorization": "Basic YWRtaW46MTIzNDU2",
        },
        data: params
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'SEARCH_PROCEDURE',
          procedures: data.data
        });
      }
    ]
  },
  unitsProcedure: {
    url: '/co-quan',
    options:(url, params, getState) => {
      return {
        method: "GET",
        headers: {
          //'Content-Type': 'application/json'
          "Authorization": "Basic YWRtaW46MTIzNDU2",
        },
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'GET_UNITS',
          units: data.data
        });
      }
    ]
  },
  fieldsProcedure: {
    url: '/linh-vuc',
    options:(url, params, getState) => {
      return {
        method: "GET",
        headers: {
          //'Content-Type': 'application/json'
          "Authorization": "Basic YWRtaW46MTIzNDU2",
        },
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'GET_FIELDS',
          fields: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default rest;

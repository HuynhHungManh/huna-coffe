import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
const rest = reduxApi({
  categories: {
    // url: '/get-all-category',
    url: '/categories?per_page=100',
    options:(url, params, getState) => {
      return {
        method: "GET",
        headers: {
          //'Content-Type': 'application/json'
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
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default rest;

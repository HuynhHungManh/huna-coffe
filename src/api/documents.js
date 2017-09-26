import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
const rest = reduxApi({
  documents: {
    // url: '/posts?filter[taxonomy]=category&filter[term]=:catSlug',
    url: 'posts/get-document-id-category/:idCat',
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
          type: 'GET_DOCUMENT_BY_SLUG',
          documents: data.data
        });
      }
    ]
  },
  documentsAll: {
    url: '/all-document',
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
          type: 'GET_ALL_DOCUMENT',
          documents: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default rest;

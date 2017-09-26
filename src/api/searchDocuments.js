import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
const rest = reduxApi({
  searchDocumenrs: {
    url: '/posts?per_page=100&search=:nameDocument',
    options:(url, params, getState) => {
      return {
        method: "GET",
        headers: {
        },
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'GET_DOCUMENT_BY_NAME',
          searchDocumenrs: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default rest;

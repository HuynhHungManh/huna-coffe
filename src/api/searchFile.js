import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
const rest = reduxApi({
  searchFiles: {
    url: '/search-detail.php?id=:id',
    options:(url, params, getState) => {
      return {
        method: "GET",
        headers: {
          //'Content-Type': 'application/json'


        },
        data: params
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'GET_SEARCH_FILE',
          searchFiles: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.PHP_URL);

export default rest;

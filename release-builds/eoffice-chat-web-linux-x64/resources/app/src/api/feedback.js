import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

// Example
const rest = reduxApi({
  feedbacks: {
    url: '/gop-y',
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
          type: 'POST_FEEDBACK',
          feedbacks: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default rest;

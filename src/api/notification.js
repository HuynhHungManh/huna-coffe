import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';


const rest = reduxApi({
  notifications: {
    url: '/thong-bao',
    options:(url, params, getState) => {
      return {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Basic YWRtaW46MTIzNDU2",
        },
        data: {}
      };
    },
    postfetch: [
      function({data, actions, dispatch, getState, request}) {
        dispatch({
          type: 'GET_NOTIFICATION',
          notifications: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default rest;

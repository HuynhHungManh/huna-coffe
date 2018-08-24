import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const rest = reduxApi({
  categoryplans: {
    url: '/get-all-category-plan',
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
          type: 'GET_LIST_PLAN',
          categoryplans: data.data
        });
      }
    ]
  }
})
.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default rest;

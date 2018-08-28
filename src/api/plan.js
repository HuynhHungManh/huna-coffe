import reduxApi, {transformers} from 'redux-api';
import customFetch from 'api/axios';
import CONFIG from 'base/constants/config';

const rest = reduxApi({
  plans: {
    url: 'posts/get-project-id-plan-taxonomy/:idCat',
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
          type: 'GET_PROJECT_BY_SLUG',
          plans: data.data
        });
      }
    ]
  },
  plansAll: {
    url: '/all-project',
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
          type: 'GET_ALL_PROJECT',
          plans: data.data
        });
      }
    ]
  }
})

.use('fetch', customFetch)
.use("rootUrl", CONFIG.API_URL);

export default rest;

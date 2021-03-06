let initial = [];

function plans(state = initial, action) {
  switch (action.type) {
    case 'GET_PROJECT_BY_SLUG':
      return action.plans;
    case 'GET_LOCATION_BY_ID':
      return action.locations;
    case 'GET_LOCATION_BY_NAME':
      return action.locations;
    case 'GET_ALL_PROJECT':
      return action.plans;
    default:
      return state;
  }
}
export {plans};

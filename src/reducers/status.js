let initial = [];
// const initialState = {
//   status : false
// }
function status(state = initial, action) {
  switch (action.type) {
    case 'CHANGE_STATUS_SEARCH_DOCUMENT':
      return action.status;
    default:
      return state;
  }
}

export {status};

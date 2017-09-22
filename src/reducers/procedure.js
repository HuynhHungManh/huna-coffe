let initial = [];

function procedures(state = initial, action) {
  switch (action.type) {
    case 'GET_LIST_PROCEDURE':
      return action.procedures;
    case 'SEARCH_PROCEDURE':
      return action.procedures;
    default:
      return state;
  }
}

export {procedures};

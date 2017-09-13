let initial = [];

function procedures(state = initial, action) {
  switch (action.type) {
    case 'GET_LIST_PROCEDURE':
      return action.procedures;
    case 'POST_TITLE':
      return action.title;
    default:
      return state;
  }
}

export {procedures};

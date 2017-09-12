let initial = [];

function procedures(state = initial, action) {
  switch (action.type) {
    case 'GET_LIST_PROCEDURE':
      return action.procedures;
    case 'GET_LIST_PROCEDURE_BY_INDEX':
      
      return action.procedures;
    default:
      return state;
  }
}

export {procedures};

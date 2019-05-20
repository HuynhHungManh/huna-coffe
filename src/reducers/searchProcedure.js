let initial = [];

function searchProcedure(state = initial, action) {
  switch (action.type) {
    case 'STORE_FIELD_AND_UNIT':
      return action.data
    default:
      return state;
  }
}

export {searchProcedure};

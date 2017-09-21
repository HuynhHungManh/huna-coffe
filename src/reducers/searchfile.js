let initial = [];

function searchfile(state = initial, action) {
  switch (action.type) {
    case 'GET_SEARCH_FILE':
      return action.searchfile;
    default:
      return state;
  }
}

export {searchfile};

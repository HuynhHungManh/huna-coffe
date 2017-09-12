let initial = [];

function ratings(state = initial, action) {
  switch (action.type) {
    case 'GET_LIST_RATING':
      return action.ratings;
    default:
      return state;
  }
}

export {ratings};

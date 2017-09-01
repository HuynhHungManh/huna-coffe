let initial = ['hung'];

function categories(state = initial, action) {
  switch (action.type) {
    case 'GET_LIST_CATEGORIES':
      return action.categories;
    default:

      return state;
  }
}

export {categories};

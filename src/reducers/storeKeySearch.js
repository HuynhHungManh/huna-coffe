let initial = [];

function storeKeySearch(state = initial, action) {

  switch (action.type) {
    case 'STORE_KEY_SEARCH':
    console.log(action.key);
      return action.key;
    default:
      return state;
  }
}

export {storeKeySearch};

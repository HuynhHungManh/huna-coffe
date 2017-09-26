let initial = [];

function storeKeySearch(state = initial, action) {

  switch (action.type) {
    case 'STORE_KEY_SEARCH':
      return action.key;
    default:
      return '';
  }
}

export {storeKeySearch};

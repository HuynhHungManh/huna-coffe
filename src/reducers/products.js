let initial = [];
const {createTreeFromFlatArray} = require('libs/arrayToTree');

function products(state = initial, action) {
  switch (action.type) {
    case 'GET_LIST_PRODUCTS':
      return action.products;
    default:
      return state;
  }
}

export {products};

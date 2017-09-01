let initial = [];
const {createTreeFromFlatArray} = require('libs/arrayToTree');

function categories(state = initial, action) {
  switch (action.type) {
    case 'GET_LIST_CATEGORIES':
      let tree = createTreeFromFlatArray(action.categories, {
        parentProperty: 'parent'
      });
      return [
        ...tree
      ]
    default:
      return state;
  }
}

export {categories};

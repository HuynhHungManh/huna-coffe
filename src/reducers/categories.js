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
    case 'GET_LIST_CATEGORIES_BY_POST':
      let array=[];
      action.array.forEach(function(value, i) {
        if(state.find(item => item.id === value.categories[0]) !== undefined){
          array.push(state.find(item => item.id === value.categories[0]));
        }
      });
      console.log(state);
      console.log(array);
      return [
        ...array
      ];
    default:
      return state;
  }
}

export {categories};

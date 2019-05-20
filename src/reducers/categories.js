let initial = [];
const {createTreeFromFlatArray} = require('libs/arrayToTree');

function categories(state = initial, action) {
  switch (action.type) {
    case 'GET_LIST_CATEGORIES':
      return action.categories;
    case 'GET_LIST_PRODUCTS':
      return action.products;
    case 'GET_LIST_CATEGORIES_BY_POST':
      let array=[];
      action.array.forEach(function(value, i) {
        state.forEach(function(value1, i1) {
          if(value1.children.find(item => item.id === value.categories[0])){
            if(!array.find(item => item.id === value1.id)){
              array.push(value1);
            }
          }
          if(value1.id === value.categories[0]){
            if(!array.find(item => item.id === value1.id)){
              array.push(value1);
            }
          }
        });
      });
      return [
        ...array
      ];
    default:
      return state;
  }
}

export {categories};

let initial = [];
const {createTreeFromFlatArray} = require('libs/arrayToTree');

function categoryplans(state = initial, action) {
  switch (action.type) {
    case 'GET_LIST_PLAN':
      let tree = createTreeFromFlatArray(action.categoryplans, {
        parentProperty: 'parent'
      });
      return [
        ...tree
      ]
    case 'GET_LIST_PLAN_BY_POST':
      let array=[];
      action.array.forEach(function(value, i) {
        state.forEach(function(value1, i1) {
          if(value1.children.find(item => item.id === value.categoryplans[0])){
            if(!array.find(item => item.id === value1.id)){
              array.push(value1);
            }
          }
          if(value1.id === value.categoryplans[0]){
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

export {categoryplans};

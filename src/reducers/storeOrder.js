let initial = [];

function storeOrder(state = initial, action) {
  switch (action.type) {
    case 'STORE_ORDER':
    console.log(action.storeOrder);
      	return action.storeOrder;
    default:
      	return state;
  }
}

export {storeOrder};

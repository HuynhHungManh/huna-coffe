let initial = true;

function storeData(state = initial, action) {
  switch (action.type) {
    case 'STORE_DATA':
      	return action.data;
    default:
      	return state;
  }
}

export {storeData};

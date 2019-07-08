let initial = false;

function totalPrice(state = initial, action) {
  switch (action.type) {
    case 'GET_TOTAL_PRICE_TODAY':
		return action.totalPrice;
    default:
      return state;
  }
}

export {totalPrice};

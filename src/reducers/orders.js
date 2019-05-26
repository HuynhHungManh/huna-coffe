let initial = [];

function orders(state = initial, action) {
  switch (action.type) {
    case 'ORDERS':
      return action.orders;
    case 'GET_ORDERS':
      return action.getOrders;
    default:
      return state;
  }
}

export {orders};

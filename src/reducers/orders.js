let initial = [];

function orders(state = initial, action) {
  switch (action.type) {
    case 'ORDERS':
      return action.orders;
    default:
      return state;
  }
}

export {orders};

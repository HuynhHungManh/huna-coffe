let initial = [];

function orders(state = initial, action) {
  switch (action.type) {
    case 'ORDERS':
      return action.orders;
    case 'GET_ORDERS':
      return action.getOrders;
    case 'RESSON_CANCEL_ORDERS':
      return action.ressonCancelOrders;
    case 'CANCEL_ORDERS':
      return action.cancelOrders;
    case 'ORDER_THUCDONS':
      return action.orderThucDons;
    default:
      return state;
  }
}

export {orders};

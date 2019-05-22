let initial = [];

function productsBill(state = initial, action) {
  switch (action.type) {
    case 'CHOOSE_PRODUCTS_BILL':
      return action.productsBill;
    default:
      return state;
  }
}

export {productsBill};

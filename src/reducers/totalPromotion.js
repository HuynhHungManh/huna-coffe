let initial = false;

function totalPromotion(state = initial, action) {
  switch (action.type) {
    case 'GET_TOTAL_PROMOTION_TODAY':
    console.log(action.totalPromotion);
		return action.totalPromotion;
    default:
      return state;
  }
}

export {totalPromotion};

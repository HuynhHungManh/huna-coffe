let initial = false;

function promotion(state = initial, action) {
  switch (action.type) {
    case 'GET_PROMOTION':
      return action.promotion;
    default:
      return state;
  }
}

export {promotion};

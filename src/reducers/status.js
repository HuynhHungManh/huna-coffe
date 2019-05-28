let initial = false;

function status(state = initial, action) {
  switch (action.type) {
    case 'STATUS_CLEAR_PRODUCTS':
      return action.statusClear;
    default:
      return state;
  }
}

export {status};

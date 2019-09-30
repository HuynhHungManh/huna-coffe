let initial = true;

function status(state = initial, action) {
  switch (action.type) {
    case 'STATUS_AUTO_LOAD_PROMOTION':
      return action.key;
    default:
      return state;
  }
}

export {status};

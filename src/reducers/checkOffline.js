let initial = false;

function checkOffline(state = initial, action) {
  switch (action.type) {
    case 'CHECK_OFFLINE':
  		return action.isOffline;
    default:
      return state;
  }
}

export {checkOffline};

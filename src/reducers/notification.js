let initial = [];

function notifications(state = initial, action) {
  switch (action.type) {
    case 'GET_NOTIFICATION':
      return action.notifications;
    default:
      return state;
  }
}

export {notifications};

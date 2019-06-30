let initial = [];

function noteOrders(state = initial, action) {
  switch (action.type) {
    case 'LIST_NOTE_ORDER':
      return action.noteOrders;
    default:
      return state;
  }
}

export {noteOrders};

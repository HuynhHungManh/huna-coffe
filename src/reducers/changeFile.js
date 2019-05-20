let initial = [];

function changeFile(state = initial, action) {
  switch (action.type) {
    case 'CHANGE_FILE':
      return action.data;
    default:
      return state;
  }
}

export {changeFile};

let initial = [];

function units(state = initial, action) {
  switch (action.type) {
    case 'GET_UNITS':
      return action.units;
    default:
      return state;
  }
}

export {units};

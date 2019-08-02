let initial = false;

function getCode(state = initial, action) {
  switch (action.type) {
    case 'GET_CODE':
  		return action.getCode;
    default:
      return state;
  }
}

export {getCode};

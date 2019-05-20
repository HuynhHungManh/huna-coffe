let initial = [];

function fields(state = initial, action) {
  switch (action.type) {
    case 'GET_FIELDS':
      return action.fields;
    default:
      return state;
  }
}

export {fields};

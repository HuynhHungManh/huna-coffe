let initial = [];

function documents(state = initial, action) {
  switch (action.type) {
    case 'GET_DOCUMENT_BY_SLUG':
      return action.documents;
    default:
      return state;
  }
}

export {documents};

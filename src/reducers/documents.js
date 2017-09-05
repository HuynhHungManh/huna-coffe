let initial = [];

function documents(state = initial, action) {
  switch (action.type) {
    case 'GET_DOCUMENT_BY_SLUG':
      return action.documents;
    case 'GET_DOCUMENT_BY_NAME':
      console.log(action.searchDocumenrs);
      return action.searchDocumenrs;
    default:
      return state;
  }
}

export {documents};

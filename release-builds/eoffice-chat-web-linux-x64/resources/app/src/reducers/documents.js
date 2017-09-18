let initial = [];

function documents(state = initial, action) {
  switch (action.type) {
    case 'GET_DOCUMENT_BY_SLUG':
      return action.documents;
    case 'GET_DOCUMENT_BY_NAME':
      return action.searchDocumenrs;
    case 'POST_FEEDBACK':
      return action.feedbacks;
    default:
      return state;
  }
}

export {documents};

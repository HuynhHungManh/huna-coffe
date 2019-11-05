let initial = true;

function statusLoadData(state = initial, action) {
  switch (action.type) {
    case 'STATUS_LOAD_DATA':
        return action.status;
    default:
        return state;
  }
}

export {statusLoadData};

let initial = [];

function calendar(state = initial, action) {
  switch (action.type) {
    case 'GET_CALENDAR_BY_SLUG':
      return action.calendars;
    default:
      return state;
  }
}

export {calendar};

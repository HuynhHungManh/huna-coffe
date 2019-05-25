let initial = {};

function auth(state = initial, action) {
  switch (action.type) {
    case 'LOGIN':
      return action.login;
    default:
      return state;
  }
}

export {auth};

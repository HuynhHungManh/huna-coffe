let initial = [];

function auth(state = initial, action) {
  switch (action.type) {
    case 'LOGIN':
      console.log(action.login);
      return action.login;
    default:
      return state;
  }
}

export {auth};

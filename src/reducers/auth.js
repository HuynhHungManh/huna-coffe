let initial = {};

function auth(state = initial, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.login.token ? action.login.token : null,
      };
    default:
      return state;
  }
}

export {auth};

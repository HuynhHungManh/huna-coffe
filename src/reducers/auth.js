let initial = {};

function auth(state = initial, action) {
  switch (action.type) {
    case 'LOGIN':
      return action.login;
	case 'LOGOUT':
      return action.logout;      
    default:
      return state;
  }
}

export {auth};

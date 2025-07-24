export class BaseController {
  static current_user () {
    console.log('==============> current_user ok')

    return { name: "Joh Doe" };
  }

  static user_loggedin () {
    let _user_loggedin = sessionStorage.getItem('auth');

    console.log('==============> user_loggedin: ', _user_loggedin);

    return _user_loggedin;
  }
}

console.log('BaseController loaded.');

export class BaseController {
  static current_user () {
    console.log('==============> current_user ok')

    return { name: "Joh Doe" };
  }

  static user_loggedin () {
    console.log('==============> user_loggedin ok')

    return sessionStorage.getItem('auth');
  }
}

console.log('BaseController loaded.');

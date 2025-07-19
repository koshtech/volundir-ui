import { System } from '/lib/volundir/core/system.js';

let data = {};

export class Sessions {
  static login() {
    console.log("SessionsController#login");

    sessionStorage.setItem('auth', true);

    data = {
      message: "Login successfully called."
    }

    System.flash(data["message"], 'success');

    return data;
  }

  static register() {
    console.log("SessionsController#register");

    data = {
      message: "Account register successfully called."
    }

    System.flash(data["message"], 'info');

    return data;
  }

  static forgot() {
    console.log("SessionsController#forgot");

    data = {
      message: "Recover password successfully called."
    }

    System.flash(data["message"], 'info');

    return data;
  }

  static logout() {
    console.log("SessionsController#logout");

    sessionStorage.removeItem('auth');

    data = {
      message: "Session ended successfully."
    }

    System.flash(data["message"], 'success');

    return data;
  }
}

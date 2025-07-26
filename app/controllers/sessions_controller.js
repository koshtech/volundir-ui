import { Coordinator } from '/lib/volundir/core/coordinator.js';
import { Display } from '/lib/volundir/core/display.js';
import { Application } from '/app/controllers/application_controller.js';

let data = {};

export class Sessions extends Application {
  setParent(parent) {
    this.parent = parent;
    console.log('===> Sessions.setParent = this.parent: ', this.parent);
  }

  login() {
    console.log("SessionsController#login");
    console.log('===> Sessions.login = this.parent: ', this.parent);

    sessionStorage.setItem('auth', true);

    data = {
      message: "Login successfully called."
    }

    let display =  new Display();

    display.setParent(this.parent);
    // const display = this.parent['display'];
    // display.flash(data["message"], 'success');
    display.flash(data["message"], 'success');

    return data;
  }

  static register() {
    console.log("SessionsController#register");

    data = {
      message: "Account register successfully called."
    }

    System.flash(data["message"], 'warning');

    return data;
  }

  static forgot() {
    console.log("SessionsController#forgot");

    data = {
      message: "Recover password successfully called."
    }

    System.flash(data["message"], 'error');

    return data;
  }

  static logout() {
    console.log("SessionsController#logout");

    sessionStorage.removeItem('auth');

    data = {
      message: "Session ended successfully."
    }

    System.flash(data["message"], 'info');

    return data;
  }
}

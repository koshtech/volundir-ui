import { Coordinator } from '/lib/volundir/core/coordinator.js';
import { Display } from '/lib/volundir/core/display.js';
import { Application } from '/app/controllers/application_controller.js';

let data = {};

export class Sessions extends Application {
  setModules(_modules) {
    this._modules = _modules;
    console.log('===> Sessions.setModules = this._modules: ', this._modules);
  }
  login() {
    console.log("SessionsController#login");
    console.log('===> Sessions.login = this._modules: ', this._modules);

    sessionStorage.setItem('auth', true);

    data = {
      message: "Login successfully called."
    }

    let display =  new Display();

    display.setModules(this._modules);
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

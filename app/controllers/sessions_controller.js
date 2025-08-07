// import { Coordinator } from '/lib/volundir/core/coordinator.js';
import { Application } from '/app/controllers/application_controller.js';

export class Sessions extends Application {
  login() {
    sessionStorage.setItem('auth', true);
    console.log(" [SessionsController][login]", this);

    this.data = {
      message: "Login successfully called."
    }

    this.display.flash(this.data["message"], 'success');

    return this.data;
  }

  register() {
    console.log("SessionsController#register");

    this.data = {
      message: "Account register successfully called."
    }

    this.display.flash(this.data["message"], 'warning');

    return this.data;
  }

  forgot() {
    console.log("SessionsController#forgot");

    this.data = {
      message: "Recover password successfully called."
    }

    this.display.flash(this.data["message"], 'error');

    return this.data;
  }

  logout() {
    console.log("SessionsController#logout");

    sessionStorage.removeItem('auth');

    this.data = {
      message: "Session ended successfully."
    }

    this.display.flash(this.data["message"], 'info');

    return this.data;
  }
}

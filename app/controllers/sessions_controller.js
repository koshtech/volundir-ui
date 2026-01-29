export class Sessions extends ApplicationController {
  login() {
    sessionStorage.setItem('auth', true);
    console.log(" [SessionsController][login]", this);

    this.data = {
      message: "Login successfully called."
    }

    this.modules.display.flash(this.data["message"], 'success');

    return this.data;
  }

  register() {
    console.log("SessionsController#register");

    this.data = {
      message: "Account register successfully called."
    }

    this.modules.display.flash(this.data["message"], 'warning');

    return this.data;
  }

  forgot() {
    console.log("SessionsController#forgot");

    this.data = {
      message: "Recover password successfully called."
    }

    this.modules.display.flash(this.data["message"], 'error');

    return this.data;
  }

  logout() {
    console.log("SessionsController#logout");

    sessionStorage.removeItem('auth');

    this.data = {
      message: "Session ended successfully."
    }

    this.modules.display.flash(this.data["message"], 'info');

    return this.data;
  }
}

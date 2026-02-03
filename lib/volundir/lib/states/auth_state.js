class AuthState {
  user = null;
  headers = null;

  setSession(user, headers) {
    this.user = user;
    this.headers = headers;
  }

  clear() {
    this.user = null;
    this.headers = null;
  }

  isAuthenticated() {
    return !!this.user;
  }

  currentUser() {
    return this.user;
  }
}

export const authState = new AuthState();

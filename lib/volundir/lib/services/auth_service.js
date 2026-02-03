const TOKEN_KEY = 'authHeaders';

export class AuthService {
  constructor(storage) {
    this.storage = storage;
  }

  saveSession(user, headers) {
    const authHeaders = {
      'access-token': headers.get('access-token'),
      client: headers.get('client'),
      uid: headers.get('uid')
    };

    localStorage.setItem(TOKEN_KEY, JSON.stringify(authHeaders));
    authState.setSession(user, authHeaders);
  }

  restoreSession() {
    const headers = JSON.parse(localStorage.getItem(TOKEN_KEY));
    if (headers) {
      // opcional: validar token no backend
      authState.setSession({ uid: headers.uid }, headers);
    }
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    authState.clear();
  }

  isAuthenticated() {
    return authState.isAuthenticated();
  }

  currentUser() {
    return authState.currentUser();
  }
}

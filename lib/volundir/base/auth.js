const TOKEN_KEY = 'authHeaders';

export function saveAuthHeaders(headers) {
  const authHeaders = {
    'access-token': headers.get('access-token'),
    client: headers.get('client'),
    uid: headers.get('uid')
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(authHeaders));
}

export function getAuthHeaders() {
  return JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}');
}

export function isAuthenticated() {
  const h = getAuthHeaders();
  return h && h['access-token'];
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

// console.log('Auth loaded.')

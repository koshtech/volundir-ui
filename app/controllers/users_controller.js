import { getAuthHeaders } from '/lib/volundir/core/auth.js';
import { User } from '/app/models/user.js';

export async function index(html) {
  console.log("Método index do UsersController");

  const headers = {
    ...getAuthHeaders(), 'Content-Type': 'application/json'
  };

  var data = {};

  var user = await User.find(1);

  console.log('User found: ', user);

  data = {
      user: user,
      appVersion: '1.0.0'
  };

  console.log('returned data: ', data);

  return data;
}

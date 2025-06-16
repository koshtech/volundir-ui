import { getAuthHeaders } from '/lib/volundir/core/auth.js';
import { User } from '/app/models/user.js';

export async function index(html) {
  console.log("Método index do UsersController");

  const headers = {
    ...getAuthHeaders(), 'Content-Type': 'application/json'
  };

  const data = {};


  const users = await User.find(1);


  return data;
}

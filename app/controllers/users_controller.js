import { getAuthHeaders } from '/lib/volundir/core/auth.js';
import { User } from '/app/models/user.js';

export class Users {
  static async index() {
    console.log("Método index do UsersController");

    const headers = {
      ...getAuthHeaders(), 'Content-Type': 'application/json'
    };

    var data = {};

    var user  = await User.find(2);
    console.log('User found: ', user);

    var users = await User.all();
    console.log('total: ', users.total());

    var first = users.first();
    console.log('first: ', first);

    var last = users.last();
    console.log('last: ', );

    data = {
        user: user,
        users: users.toArray(),
        first: first,
        last: last,
        total: users.total(),
        appVersion: '1.0.0'
    };

    console.log('returned data: ', data);

    return data;
  }

  static new(html) {
    console.log("Método new do UsersController");

    var data = {};
    return data;
  }
}

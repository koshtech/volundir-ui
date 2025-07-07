import { getAuthHeaders } from '/lib/volundir/core/auth.js';
// import { Flash } from '/lib/volundir/core/flash.js';
import { System } from '/lib/volundir/core/system.js';
import { User } from '/app/models/user.js';
import { Application } from '/app/controllers/application_controller.js';

export class Users extends Application {
  static async index() {
    console.log("Método index do UsersController");

    // this.flash();

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

    var data = {
      user: {},
      "profile_options": [
        { "value": "admin", "label": "Administrator" },
        { "value": "member", "label": "Member" },
        { "value": "customer", "label": "Customer" },
        { "value": "user", "label": "User" },
        { "value": "guest", "label": "Gest" }
      ]
    };
    return data;
  }

  static async create(formData) {
    console.log("UsersController#create");

    if (!formData) {
      console.warn("No formData received.");
      return;
    }

    const values = Object.fromEntries(formData.entries());
    console.log("Create user:", values);

    let user = new User(values);
    await user.save();

    console.log('app: ', app);

    System.flash('user created successfully.', 'success');
    System.navigate('/users');
  }

  static async edit(id) {
    console.log("UsersController#edit:", id);

    var user  = await User.find(id);
    console.log('User found: ', user);

    var data = {
      user: user,
      "profile_options": [
        { "value": "admin", "label": "Administrator" },
        { "value": "member", "label": "Member" },
        { "value": "customer", "label": "Customer" },
        { "value": "user", "label": "User" },
        { "value": "guest", "label": "Gest" }
      ],
      appVersion: '1.0.0'
    };

    console.log('returned data: ', data);

    return data;
  }

  static async update(id, formData) {
    console.log("UsersController#update id:", id);
    console.log("UsersController#update formData:", formData);

    if (!formData) {
      console.warn("No formData received.");
      return;
    }

    const values = Object.fromEntries(formData.entries());
    console.log("Update values:", values);

    let user = await User.find(id);

    if (!user) {
      console.error("User not found.");
      return;
    }

    Object.assign(user, values);
    await user.save();

    System.flash('user updated successfully.', 'success');
    System.navigate('/users');
  }

  static async destroy(id) {
    console.log("UsersController#destroy:", id);

    let user = await User.find(id);

    if (!user) {
      console.error("User not found.");
      return;
    }

    await user.destroy();

    System.flash('user deleted successfully.', 'success');
    System.navigate('/users');
  }
}

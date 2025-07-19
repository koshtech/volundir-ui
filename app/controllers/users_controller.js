import { getAuthHeaders } from '/lib/volundir/core/auth.js';
import { System } from '/lib/volundir/core/system.js';
import { User } from '/app/models/user.js';
import { Application } from '/app/controllers/application_controller.js';

let data = {};

export class Users extends Application {
  static async index() {
    const headers = {
      ...getAuthHeaders(), 'Content-Type': 'application/json'
    };

    let user  = await User.find(2);
    let users = await User.all();
    let first = users.first();
    let last  = users.last();

    let data = {
        user: user,
        users: users.toArray(),
        first: first,
        last: last,
        total: users.total()
    };

    return data;
  }

  static new(data={}) {
    console.log('==>> new# data: ', data);
    let user = data['user'] ? data['user'] : {}

    data = {
      user: this.secure_params(user),
      profile_options: this.profile_options()
    };

    return data;
  }

  static async create(formData) {
    console.log('=====>>> create formData:', formData);

    if (!formData) {
      return;
    }

    const values = Object.fromEntries(formData.entries());

    let user = new User(values);

    try {
      if (user.isValid()) {
        await user.save();

        System.flash('User created successfully.', 'success');
        System.navigate('/users');
      }
      else {
        console.error("Validation errors:", user.errors);
      }
    } catch (error) {
      console.error("Error saving:", error);
      System.flash(`User create error: ${error}.`, 'alert');
      // System.navigate('/users');
    }

    var data = {
      errors: user.errors,
      user: user,
      profile_options: this.profile_options()
    };

    return data;
  }

  static async edit(id) {
    var user  = await User.find(id);

    var data = {
      user: user,
      profile_options: this.profile_options(),
      appVersion: '1.0.0'
    };

    return data;
  }

  static async update(id, formData) {
    console.log('==>> edit# formData: ', formData);
    if (!formData) {
      return;
    }

    const values = Object.fromEntries(formData.entries());

    let user = await User.find(id);

    if (!user) {
      System.flash('User not found.', 'alert');

      return;
    }

    Object.assign(user, values);

    try {
      if (user.isValid()) {
        await user.save();

        System.flash('User updated successfully.', 'success');
        System.navigate('/users');
      }
      else {
        console.error("Validation errors:", user.errors);
      }
    } catch (error) {
      console.error("Error saving:", error);
      System.flash(`User create error: ${error}.`, 'alert');
      // System.navigate('/users');
    }

    var data = {
      errors: user.errors,
      user: user,
      profile_options: this.profile_options()
    };

  }

  static async destroy(id) {
    // console.log("UsersController#destroy:", id);

    let user = await User.find(id);

    if (!user) {
      // console.error("User not found.");
      return;
    }

    await user.destroy();

    System.flash('user deleted successfully.', 'success');
    System.navigate('/users');
  }

  static profile_options() {
    return [
      { "value": "admin", "label": "Administrator" },
      { "value": "member", "label": "Member" },
      { "value": "customer", "label": "Customer" },
      { "value": "user", "label": "User" },
      { "value": "guest", "label": "Gest" }
    ];
  }

  static secure_params(user) {
    return {
      name: user["name"],
      terms: user["terms"],
      birthdate: user["birthdate"],
      email: user["email"],
      documents: user["documents"],
      age: user["age"],
      password: user["password"],
      profile: user["profile"],
      country: user["country"],
      bio: user["bio"]
    }
  }
}

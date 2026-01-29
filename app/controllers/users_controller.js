// import { getAuthHeaders } from '/lib/volundir/base/auth.js';
// import { System } from '/lib/volundir/core/system.js';
// import { User } from '/app/models/user.js';
// import { Coordinator } from '/lib/volundir/base/object_coordinator.js';
// import { ApplicationController } from '/app/controllers/application_controller.js';

export class Users extends ApplicationController {
  constructor () {
    super();

    this.data = {};
  }

  async index() {
    const headers = {
      ...getAuthHeaders(), 'Content-Type': 'application/json'
    };

    let user  = await User.find(2);
    let users = await User.all();
    let first = users.first();
    let last  = users.last();

    this.data = {
        user: user,
        users: users.toArray(),
        first: first,
        last: last,
        total: users.total()
    };

    return this.data;
  }

  new(_data={}) {
    console.log('==>> new# data: ', _data);
    // let user = _data['user'] ? _data['user'] : {};
    let user = _data;

    this.data = {
      user: this.secure_params(user),
      profile_options: this.profile_options()
    };

    return this.data;
  }

  async create(formData) {
    console.log('=====>>> create formData:', formData);

    if (!formData) {
      return;
    }

    const values = Object.fromEntries(formData.entries());

    let user = new User(this.secure_params(values));

    try {
      if (user.isValid()) {
        await user.save();

        display.flash('User created successfully.', 'success');
        System.navigate('/users');
      }
      else {
        console.error("Validation errors:", user.errors);
      }
    } catch (error) {
      console.error("Error saving:", error);
      display.flash(`User create error: ${error}.`, 'error');
      // System.navigate('/users');
    }

    this.data = {
      errors: user.errors,
      user: user,
      profile_options: this.profile_options()
    };

    return this.data;
  }

  async edit(id) {
    var user  = await User.find(id);

    this.data = {
      user: user,
      profile_options: this.profile_options(),
      appVersion: '1.0.0'
    };

    return this.data;
  }

  async update(id, formData) {
    console.log('==>> edit# formData: ', formData);
    if (!formData) {
      return;
    }

    const values = Object.fromEntries(formData.entries());

    let user = await User.find(id);

    if (!user) {
      display.flash('User not found.', 'error');

      return;
    }

    Object.assign(user, this.secure_params(values));

    try {
      if (user.isValid()) {
        await user.save();

        display.flash('User updated successfully.', 'success');
        System.navigate('/users');
      }
      else {
        console.error("Validation errors:", user.errors);
      }
    } catch (error) {
      console.error("Error saving:", error);
      display.flash(`User create error: ${error}.`, 'error');
      // System.navigate('/users');
    }

    this.data = {
      errors: user.errors,
      user: user,
      profile_options: this.profile_options()
    };

  }

  async destroy(id) {
    // console.log("UsersController#destroy:", id);

    let user = await User.find(id);

    if (!user) {
      // console.error("User not found.");
      return;
    }

    await user.destroy();

    display.flash('user deleted successfully.', 'success');
    System.navigate('/users');
  }

  profile_options() {
    return [
      { "value": "admin", "label": "Administrator" },
      { "value": "member", "label": "Member" },
      { "value": "customer", "label": "Customer" },
      { "value": "user", "label": "User" },
      { "value": "guest", "label": "Gest" }
    ];
  }

  secure_params(user) {
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

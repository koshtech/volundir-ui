import { BaseModel } from '/lib/volundir/core/base_model.js';

export class User extends BaseModel {
  static get resourceName() {
    return 'users';
  }
}

console.log('Loaded User Model')

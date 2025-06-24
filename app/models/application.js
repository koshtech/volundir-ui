import { BaseModel } from '/lib/volundir/core/base_model.js';

export class Application extends BaseModel {
  static get Auto() {
    return 'users';
  }
}

console.log('Loaded User Model')

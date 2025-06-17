import { Application } from './application.js';

export class User extends Application {
  static get resourceName() {
    return 'users';
  }
}

console.log('Loaded User Model')

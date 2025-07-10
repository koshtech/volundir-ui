import { Application } from './application.js';

export class Country extends Application {
  static get resourceName() {
    return 'country';
  }
}

console.log('Loaded Country Model')

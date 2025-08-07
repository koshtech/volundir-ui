import { Application } from './application.js';

export class Country extends Application {
  static get resourceName() {
    return 'countries';
  }
}

console.log('Loaded Country Model')

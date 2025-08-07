import { Application } from './application.js';

export class User extends Application {
  constructor(attributes = {}) {
    super();

    this.attributes = attributes;

    // Model storage adapter used to save module data
    this.storageAdapter  = 'json';
    // this.resourceName    = 'configurations';
    this.requiredModules = ['storage'];
  }

  validate() {
    return {
      presence: ["name", "birthdate", "email"],
      format: {
        email: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid format."
        }
      }
    };
  }
}

console.log('Loaded User Model')

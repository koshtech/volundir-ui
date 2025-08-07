import { Application } from './application.js';

export class Session extends Application {
  // static get resourceName() {
  //   return 'users';
  // }

  // validate() {
  //   return {
  //     presence: ["name", "birthdate", "email"],
  //     format: {
  //       email: {
  //         pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  //         message: "Invalid format."
  //       }
  //     }
  //   };
  // }
}

console.log('Loaded User Model')

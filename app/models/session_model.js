const ApplicationModel = await File.import('app/models/application_model.js');

export class SessionModel extends ApplicationModel {
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

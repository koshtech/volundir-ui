const StorageModule = await File.import('lib/volundir/lib/modules/storage_module.js')

const ApplicationModel = await File.import('app/models/application_model.js');

export class UserModel extends ApplicationModel {
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

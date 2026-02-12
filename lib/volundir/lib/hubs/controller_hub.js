const BaseController = await File.import('lib/volundir/base/base_controller.js');
const BaseHub        = await File.import('lib/volundir/base/base_hub.js');

globalThis.saveAuthHeaders  = await File.import('lib/volundir/base/auth.js');
globalThis.getAuthHeaders   = await File.import('lib/volundir/base/auth.js');
globalThis.isAuthenticated  = await File.import('lib/volundir/base/auth.js');
globalThis.logout           = await File.import('lib/volundir/base/auth.js');

const Country = await File.import('app/models/country_model.js');
const Session = await File.import('app/models/session_model.js');
const User    = await File.import('app/models/user_model.js');

const ApplicationController = await File.import('app/controllers/application_controller.js');

export class ControllerHub extends BaseHub {
  constructor() {
    super();

    // this.requiredModules = [];

    // Hubs are resolved and ready by default
    this.resolved = true;
    this.ready    = true;

    this.isLoaded = true;
  }
}

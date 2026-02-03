const BaseController = await File.import('lib/volundir/base/base_controller.js');
const BaseHub        = await File.import('lib/volundir/base/base_hub.js');

globalThis.saveAuthHeaders  = await File.import('lib/volundir/base/auth.js');
globalThis.getAuthHeaders   = await File.import('lib/volundir/base/auth.js');
globalThis.isAuthenticated  = await File.import('lib/volundir/base/auth.js');
globalThis.logout           = await File.import('lib/volundir/base/auth.js');

const ApplicationController = await File.import('app/controllers/application_controller.js');

export class ControllerHub extends BaseHub {
  constructor() {
    super();
  }
}

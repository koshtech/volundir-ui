import { BaseController } from '/lib/volundir/base/base_controller.js';
import { BaseHub } from '/lib/volundir/base/base_hub.js';

// import { getAuthHeaders } from '/lib/volundir/base/auth.js';
// import { System } from '/lib/volundir/core/system.js';
// import { User } from '/app/models/user.js';
// import { Coordinator } from '/lib/volundir/base/object_coordinator.js';
import { ApplicationController } from '/app/controllers/application_controller.js';

// export class SiteController extends ApplicationController {


export class ControllerHub extends BaseHub {
  constructor() {
    super();

    this.value1 = '123';
  }

  getValue1() {
    return this.value1;
  }
}

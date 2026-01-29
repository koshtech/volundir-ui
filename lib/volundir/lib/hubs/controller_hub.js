import { BaseController } from '/lib/volundir/base/base_controller.js';
import { BaseHub } from '/lib/volundir/base/base_hub.js';

import { getAuthHeaders } from '/lib/volundir/base/auth.js';
import { ApplicationController } from '/app/controllers/application_controller.js';

export class ControllerHub extends BaseHub {
  constructor() {
    super();

    this.value1 = '123';
  }

  getValue1() {
    return this.value1;
  }
}

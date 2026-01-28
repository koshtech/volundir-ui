import { BaseController } from '/lib/volundir/base/base_controller.js';

export class PanelController extends BaseController {
  constructor() {
    super();
    this.requiredModules = ['guilda_module'];
    // this.requiredModels  = ['logger_model', 'config_model', 'object_register_model'];
  }

  async index() {
    console.log(' [PanelController][index] this: ', this);
  }

  addLog(entry) {
    this.modules['guilda_module'].addLog(entry)
    // console.log(' [PanelController][addLog] entry: ', entry);
    // console.log(' [PanelController][addLog] this: ', this);
  }
}

import { BaseController } from '/lib/volundir/core/base_controller.js';

export class Application extends BaseController {
  constructor (_modules) {
    super(_modules);

    this.data = {};
  }
}

console.log('Loaded Application Controller');

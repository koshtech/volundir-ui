// import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FormModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['validator'];

    // Required models
    this.requiredModels = [];
  }
}

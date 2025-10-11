import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FormModule extends BaseModule {
  constructor() {
    super();

    // Required modules
    this.requiredModules = ['validator'];

    // Required models
    this.requiredModels = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = '';
  }
}

import { BaseModule } from '/lib/volundir/base/base_module.js';

export class ModelHub extends BaseModule {
  constructor() {
    super();

    this.value1 = '125';
  }

  getValue1() {
    return this.value1;
  }
}

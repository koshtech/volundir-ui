import { BaseModule } from '/lib/volundir/base/base_module.js';

export class mAppHub extends BaseModule {
  constructor() {
    super();

    this.value1 = '123';
  }

  getValue1() {
    return this.value1;
  }
}

import { BaseModule } from '/lib/volundir/base/base_module.js';
import { BaseHub } from '/lib/volundir/base/base_hub.js';

export class ModuleHub extends BaseHub {
  constructor() {
    super();

    this.value1 = '123';
  }

  getValue1() {
    return this.value1;
  }
}

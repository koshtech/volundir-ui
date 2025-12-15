import { BaseHub } from '/lib/volundir/base/base_hub.js';
import { BaseModule } from '/lib/volundir/base/base_module.js';
// import { LoggerModule } from '/lib/volundir/lib/modules/logger_module.js';

export class mAppHub extends BaseHub {
  constructor() {
    super();

    this.value1 = '123';
  }

  getValue1() {
    return this.value1;
  }
}

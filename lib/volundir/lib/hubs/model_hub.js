import { BaseModule } from '/lib/volundir/base/base_module.js';
import { BaseHub } from '/lib/volundir/base/base_hub.js';
import { BaseModel } from '/lib/volundir/base/base_model.js';

export class ModelHub extends BaseHub {
  constructor() {
    super();

    this.value1 = '125';
  }

  getValue1() {
    return this.value1;
  }
}

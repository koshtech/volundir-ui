const BaseModule = await File.import('lib/volundir/base/base_module.js');
const BaseHub    = await File.import('lib/volundir/base/base_hub.js');

export class ModuleHub extends BaseHub {
  constructor() {
    super();
  }
}

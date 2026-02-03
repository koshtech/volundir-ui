const BaseModule = await File.import('lib/volundir/base/base_module.js');
const BaseHub    = await File.import('lib/volundir/base/base_hub.js');
const BaseModel  = await File.import('lib/volundir/base/base_model.js');

const ApplicationModel   = await File.import('app/models/application_model.js');

export class ModelHub extends BaseHub {
  constructor() {
    super();
  }
}

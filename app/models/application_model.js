const StorageModule = await File.import('lib/volundir/lib/modules/storage_module.js')
const BaseModel = await File.import('lib/volundir/base/base_model.js');

export class ApplicationModel extends BaseModel {
  constructor() {
    super();

    this.modules = {
      'storage': new StorageModule()
    }
  }
}

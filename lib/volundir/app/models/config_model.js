const BaseModel = await File.import('lib/volundir/base/base_model.js');

const StorageModule = await File.import('lib/volundir/lib/modules/storage_module.js');

export class ConfigModel extends BaseModel {
  constructor() {
    super();

    // Model storage adapter used to save module data
    this.storageAdapter  = 'local_storage';
    // this.resourceName    = 'configurations';

    this.requiredModules = ['storage'];
    this.requiredModels  = [];

    this.modules = {
      "storage": new StorageModule()
    }

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }
}

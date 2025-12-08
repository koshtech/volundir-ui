import { BaseModel } from '/lib/volundir/base/base_model.js';

export class LoggerModel extends BaseModel {
  constructor(attributes = {}) {
    super();

    this.attributes = attributes || this.attributes

    // Model storage adapter used to save module data
    this.storageAdapter  = 'local_storage';
    this.resourceName    = 'system_logs';

    this.requiredModules = ['storage'];
    this.requiredModels  = [];
  }
}

// console.log(' [object_register_model] Loaded.');
// export const adapter    = new LocalStorageAdapter();
// export const RawAdapter = LocalStorageAdapter;

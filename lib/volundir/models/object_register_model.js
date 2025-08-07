import { BaseModel } from '/lib/volundir/base/base_model.js';

export class ObjectRegisterModel extends BaseModel {
  constructor(attributes = {}) {
    super();

    this.attributes = attributes || this.attributes

    // Model storage adapter used to save module data
    this.storageAdapter  = 'local_storage';
    this.resourceName    = 'object_registers';

    this.requiredModules = ['configuration', 'storage'];
    this.requiredModels  = [];
  }
}

// console.log(' [object_register_model] Loaded.');
// export const adapter    = new LocalStorageAdapter();
// export const RawAdapter = LocalStorageAdapter;

// console.log('===> ERRO aqui config');
// import { BaseModel } from '/lib/volundir/base/base_model.js';

export class ConfigModel extends BaseModel {
  constructor() {
    super();

    // Model storage adapter used to save module data
    this.storageAdapter  = 'local_storage';
    // this.resourceName    = 'configurations';

    this.requiredModules = ['storage'];
    this.requiredModels  = [];
  }
}

// console.log(' [config_model] Loaded.');

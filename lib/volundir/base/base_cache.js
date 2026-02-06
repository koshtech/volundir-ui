// import { BaseModule } from '/lib/volundir/base/base_module.js';
const BaseModule = await File.import('lib/volundir/base/base_module.js');

export class BaseCache extends BaseModule {
  // Statically loaded modules are resolved by default
  cached = {}
  cached[this.name] = {}

  constructor() {
    super();
  }

  iscached(objectName) {
    return this[this.name]find_by_key(objectName) ? true : false;;
  }

  save(objectName, hubObject) {
    this[this.name][objectName] = hubObject;

    return true;
  }

  get(objectName) {
    if(this.iscached(objectName)){
      return this[this.name][objectName];
    }

    return null;
  }
}

concole.log('[BaseCache] loaded: ', BaseCache);

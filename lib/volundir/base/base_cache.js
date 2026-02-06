import { BaseModule } from '/lib/volundir/base/base_module.js';

export class BaseCache extends BaseModule {
  cacheableObjects = ['file', 'hub', 'module']
  cached = {};

  constructor() {
    super();
  }

  getOrSetCacheType(objectType) {
    if(! this.cached[objectType]) {
      this.cached[objectType] = {}
    }

    return true
  }

  isCached(objectName) {

    console.log('[BaseCache][isCached] objectName: ', objectName);
    // console.log('[BaseCache][isCached] cached: ', this.cached);

    const objectType = this.getObjectTypeByObjectName(objectName);
    console.log('[BaseCache][isCached] objectType: ', objectType);
    this.getOrSetCacheType(objectType);

    // this.cached[objectType]['base_cache'] = BaseCache;
    // console.log('[BaseCache][isCached] cached test: ', this.cached);


    const cached = this.cached[objectType].find_by_key(objectName) ? true : false;

    console.log('[BaseCache][isCached] cached: ', cached);
    console.log('[BaseCache][isCached] this.cached: ', this.cached);

    return cached;
  }

  saveCache(object) {
    const objectType = object.objectType;
    const objectName = object.name

    this.getOrSetCacheType(objectType);

    this.cached[objectType][objectName] = object;

    return true;
  }

  getCache(objectName) {
    const objectType = this.getObjectTypeByObjectName(objectName);

    this.getOrSetCacheType(objectType);

    if(this.iscached(objectName)){
      return this.cached[objectType][objectName];
    }

    return null;
  }
}

import { BaseModule } from '/lib/volundir/base/base_module.js';

export class BaseCache extends BaseModule {
  cacheableObjects = ['hub', 'module']
  // cached = {};

  #cache = {};

  constructor() {
    super();
  }

  isCached(key) {
    // console.log('[BaseCache][isCached] key: ', key);
    // console.log('[BaseCache][isCached] this.#cache: ', this.#cache);

    const exist = this.#cache.find_by_key(key) ? true : false;
    // console.log('[BaseCache][isCached] exist: ', exist);

    return exist;
  }

  save(key, object) {
    // console.log('[BaseCache][save] I this.#cache: ', this.#cache);
    // console.log('[BaseCache][save] key: ', key);
    // console.log('[BaseCache][save] object: ', object);
    this.#cache[key] = object;
    // console.log('[BaseCache][save] F this.#cache: ', this.#cache);

    return true;
  }

  cache(key) {
    if(this.isCached(key)) {
      return this.#cache[key];
    }

    return null;
  }

  // getOrSetCacheType(objectType) {
  //   if(! this.cached[objectType]) {
  //     this.cached[objectType] = {}
  //   }

  //   return true
  // }

  isCachedObject(objectName) {
    // console.log('[BaseCache][isCachedObject] objectName: ', objectName);

    const key = this.cacheKeyFromObjectName(objectName);
    // console.log('[BaseCache][isCachedObject] key: ', key);

    return this.isCached(key);
  }

  cachedObject(objectName) {
    const key = this.cacheKeyFromObjectName(objectName);

    return this.cache(key);
  }

  saveObject(object) {
    // console.log(' [Base][saveObject] object: ', object);

    const key = object.cacheKey;
    // console.log(' [Base][saveObject] key: ', key);

    this.save(key, object)

    return true;
  }

  importObjectsToCache(objects) {
    for(const [objectName, object] of Object.entries(objects)) {
      this.saveObject(object);
    }
  }
}

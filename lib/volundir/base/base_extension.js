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

  getCache(objectName) {
    const objectType = this.getObjectTypeByObjectName(objectName);

    this.getOrSetCacheType(objectType);

    if(this.isCached(objectName)){
      return this.cached[objectType][objectName];
    }

    return null;
  }

  saveCache(object) {
    if()
    const objectType = object.objectType;
    const objectName = object.name

    this.getOrSetCacheType(objectType);

    this.cached[objectType][objectName] = object;

    return true;
  }

  importToCache(objects) {

  }
}

const TypeChecks = {
  isString: v => typeof v === 'string',
  isNumber: v => typeof v === 'number' && !Number.isNaN(v),
  isBoolean: v => typeof v === 'boolean',
  isBigInt: v => typeof v === 'bigint',
  isSymbol: v => typeof v === 'symbol',

  isNull: v => v === null,
  isUndefined: v => v === undefined,

  isArray: v => Array.isArray(v),
  isObject: v => v !== null && typeof v === 'object',

  isDate: v => v instanceof Date && !isNaN(v),
  isFunction: v => typeof v === 'function',
  isClass: v => typeof v === 'function' && /^class\s/.test(v.toString()),

  isJson: v => {
    if (typeof v !== 'string') return false;
    try {
      JSON.parse(v);
      return true;
    } catch {
      return false;
    }
  },

  present: v => {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).length > 0;
    return true;
  }
};


Object.defineProperties(Object.prototype,
  Object.fromEntries(
    Object.entries(TypeChecks).map(([name, fn]) => [
      name,
      {
        value: function () {
          return fn(this);
        },
        writable: false,
        enumerable: false
      }
    ])
  )
);

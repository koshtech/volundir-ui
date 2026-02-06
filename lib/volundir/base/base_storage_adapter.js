const BaseObject = await File.import('lib/volundir/base/base_object.js');

export class BaseStorageAdapter extends BaseObject {
  constructor() {
    super();

    this.ns = '';
  }

  cancanHandleNamespace() {
    return false;
  }

  // /**
  //  * Convenience factory for namespaced adapter.
  //  * @param {string} namespace
  //  */
  setNamespace(namespace = '') {
    this.ns = namespace ? String(namespace) + ':' : '';
  }

  // /**
  //  * Internal helper to build a namespaced key.
  //  * @param {string} key
  //  * @returns {string}
  //  */
  _key(key) {
    return `${this.ns}${String(key)}`;
  }

  async find(data) {
    return this.get(data);
  }

  safeSerialize(obj) {
    return JSON.stringify(obj, (key, value) => {
      // Ignore functions
      if (typeof value === 'function') return undefined;
      // Ignore class instances (heuristic: has prototype different from Object)
      if (value && typeof value === 'object' && value.constructor !== Object && !Array.isArray(value)) {
        return `[Instance of ${value.constructor.name}]`;
      }
      return value;
    });
  }
}

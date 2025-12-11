// local-storage-adapter.js
// Async-friendly wrapper around window.localStorage
// Provides a namespaced API: save, update, get, destroy, list, exists, clear
// All comments and logs are in English.

class LocalStorageAdapter {
  /**
   * Optionally use a namespace to avoid key collisions.
   * @param {string} namespace
   */
  constructor(namespace = '') {
    this.ns = namespace ? String(namespace) + ':' : '';
  }

  /**
   * Internal helper to build a namespaced key.
   * @param {string} key
   * @returns {string}
   */
  _key(key) {
    return `${this.ns}${String(key)}`;
  }

  /**
   * Save or update a value in localStorage.
   * @param {string} attributes
   * @param {*} value
   * @returns {Promise<void>}
   */
  async save(attributes) {
    // console.log(` [local_storage_adapter][save] attributes: `, attributes);

    try {
      for (const [key, value] of Object.entries(attributes)) {
        const k = this._key(key);
        // console.log(` [local_storage_adapter][save] key: "${k}"`);
        // const serialized = JSON.stringify(value);
        // console.log(` [local_storage_adapter][save] value:`, value);
        const serialized = this.safeSerialize(value);
        // console.log(` [local_storage_adapter][save][for] serialized: `, serialized);

        localStorage.setItem(k, serialized);
        // console.log(` [local_storage_adapter][save] Saved key "${k}" to localStorage.`);
      }
    } catch (err) {
      console.error(` [local_storage_adapter][save] Failed to save key "${key}" to localStorage:`, err);
      throw err;
    }
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

  /**
   * Update is an alias of save to match SharedStorageDriver semantics.
   */
  async update(key, value) {
    return this.save(key, value);
  }

  /**
   * Get and parse a value from localStorage.
   * @param {string} attributes
   * @returns {Promise<*>}
   */
  async get(attributes) {
    const key = attributes;

    if(typeof attributes === 'object' && attributes !== null && attributes.constructor === Object) {
      key = attributes['id'];
    }

    try {
      const k = this._key(key);
      const raw = localStorage.getItem(k);
      if (raw === null) {
        console.log(` [local_storage_adapter][get] Key "${k}" not found in localStorage.`);
        return null;
      }
      try {
        return JSON.parse(raw);
      } catch {
        console.warn(` [local_storage_adapter][get] Value for key "${k}" is not valid JSON, returning raw string.`);
        return raw;
      }
    } catch (err) {
      console.error(` [local_storage_adapter][get] Failed to read key "${key}" from localStorage:`, err);
      throw err;
    }
  }

  async find(key) {
    return this.get(key);
  }

  /**
   * Remove a key from localStorage.
   */
  async destroy(key) {
    try {
      const k = this._key(key);
      localStorage.removeItem(k);
      console.log(` [local_storage_adapter][get] Removed key "${k}" from localStorage.`);
    } catch (err) {
      console.error(` [local_storage_adapter][get] Failed to remove key "${key}" from localStorage:`, err);
      throw err;
    }
  }

  /**
   * List all keys/values under the current namespace.
   * @returns {Promise<Object>}
   */
  async list() {
    try {
      const prefix = this.ns;
      const result = {};
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        if (!fullKey) continue;
        if (prefix && !fullKey.startsWith(prefix)) continue;
        const shortKey = prefix ? fullKey.slice(prefix.length) : fullKey;
        const raw = localStorage.getItem(fullKey);
        try {
          result[shortKey] = JSON.parse(raw);
        } catch {
          result[shortKey] = raw;
        }
      }
      console.log(` [local_storage_adapter][list] Listed ${Object.keys(result).length} entries from localStorage (namespace="${this.ns}")`);
      return result;
    } catch (err) {
      console.error(` [local_storage_adapter][list] Failed to list localStorage entries:`, err);
      throw err;
    }
  }

  /**
   * Check if a key exists.
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    try {
      const k = this._key(key);
      const exists = localStorage.getItem(k) !== null;
      console.log(` [local_storage_adapter][get] Key "${k}" exists: ${exists}`);
      return exists;
    } catch (err) {
      console.error(` [local_storage_adapter][get] Failed to check existence of key "${key}" in localStorage:`, err);
      throw err;
    }
  }

  /**
   * Clear all keys in the current namespace (or all of localStorage if no namespace is set).
   */
  async clear() {
    try {
      const prefix = this.ns;
      if (!prefix) {
        localStorage.clear();
        console.log(' [local_storage_adapter][get] Cleared entire localStorage (no namespace specified).');
        return;
      }

      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      console.log(` [local_storage_adapter][get] Cleared ${keysToRemove.length} keys from localStorage (namespace="${this.ns}").`);
    } catch (err) {
      console.error(` [local_storage_adapter][get] Failed to clear localStorage namespace "${this.ns}":`, err);
      throw err;
    }
  }

  /**
   * Convenience factory for namespaced adapter.
   */
  static withNamespace(namespace) {
    return new LocalStorageAdapter(namespace);
  }
}

// Default export (no namespace)
export const adapter    = new LocalStorageAdapter();
export const RawAdapter = LocalStorageAdapter;

// local-storage-adapter.js
// Async-friendly wrapper around window.localStorage
// Provides a namespaced API: save, update, get, destroy, list, exists, clear
// All comments and logs are in English.

const BaseStoreAdapter = await File.import('lib/volundir/base/base_storage_adapter.js');

export class LocalStorageAdapter extends BaseStoreAdapter {
  /**
   * Optionally use a namespace to avoid key collisions.
   * @param {string} namespace
   */
  constructor() {
    super();
  }

  canHandleNamespace() {
    return true;
  }

  /**
   * Save or update a value in localStorage.
   * @param {string} attributes
   * @param {*} value
   * @returns {Promise<void>}
   */
  async save(data) {
    const attributes     = data["attributes"];
    const resourceName   = data["resourceName"];
    const storageAdapter = data["storageAdapter"];
    const namespace      = data["namespace"] || false;

    try {
      for (const [key, value] of Object.entries(attributes)) {
        const itemKey    = this._key(key);
        const serialized = this.safeSerialize(value);

        localStorage.setItem(itemKey, serialized);
      }
    } catch (err) {
      console.error(` [local_storage_adapter][save] Failed to save key "${key}" to localStorage. Error: ${err}`);
      throw err;
    }
  }

  /**
   * Update is an alias of save to match localStorage semantics.
   */
  async update(key, value) {
    return this.save(key, value);
  }

  /**
   * Get and parse a value from localStorage.
   * @param {string} attributes
   * @returns {Promise<*>}
   */
  // async get(attributes) {
  async get(data) {
    const key = data["id"];

    const resourceName   = data["resourceName"];
    const storageAdapter = data["storageAdapter"];
    const namespace      = data["namespace"] || false;

    // if(typeof attributes === 'object' && attributes !== null && attributes.constructor === Object) {
      // key = attributes['id'];
    // }

    try {
      const k = this._key(key);
      const raw = localStorage.getItem(k);
      if (raw === null) {
        console.warn(` [local_storage_adapter][get] Key "${k}" not found in localStorage.`);
        return null;
      }
      try {
        return JSON.parse(raw);
      } catch {
        console.warn(` [local_storage_adapter][get] Value for key "${k}" is not valid JSON, returning raw string.`);
        return raw;
      }
    } catch (err) {
      console.error(` [local_storage_adapter][get] Failed to read key "${key}" from localStorage. Error: ${err}`);
      throw err;
    }
  }

  /**
   * Remove a key from localStorage.
   */
  async destroy(key) {
    try {
      const k = this._key(key);
      localStorage.removeItem(k);
      // console.log(` [local_storage_adapter][get] Removed key "${k}" from localStorage.`);
    } catch (err) {
      console.error(` [local_storage_adapter][get] Failed to remove key "${key}" from localStorage. Error: ${err}`);
      throw err;
    }
  }

  /**
   * List all keys/values under the current namespace.
   * @returns {Promise<Object>}
   */
  async list() {
    try {
      const prefix = this.namespace;
      const collection = [];

      for (let i = 0; i < localStorage.length; i++) {
        const items = {};
        const fullKey = localStorage.key(i);

        if (!fullKey) continue;
        if (prefix && !fullKey.startsWith(prefix)) continue;

        const shortKey = prefix ? fullKey.slice(prefix.length) : fullKey;
        const raw = localStorage.getItem(fullKey);

        try {
          items[shortKey] = JSON.parse(raw);
        } catch {
          items[shortKey] = raw;
        }

        collection[i] = items;
      }

      return collection;
    } catch (err) {
      console.error(` [local_storage_adapter][list] Failed to list localStorage entries. Error: ${err}`);
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
      // console.log(` [local_storage_adapter][get] Key "${k}" exists: ${exists}`);
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
        // console.log(' [local_storage_adapter][get] Cleared entire localStorage (no namespace specified).');
        return;
      }

      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      // console.log(` [local_storage_adapter][get] Cleared ${keysToRemove.length} keys from localStorage (namespace="${this.ns}").`);
    } catch (err) {
      console.error(` [local_storage_adapter][get] Failed to clear localStorage namespace "${this.ns}":`, err);
      throw err;
    }
  }
}

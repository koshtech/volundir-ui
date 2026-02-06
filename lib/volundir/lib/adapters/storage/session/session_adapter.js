// session-storage-adapter.js
// A small async-friendly adapter over window.sessionStorage.
// Methods: save, update, destroy, get, list, exists, clear
// All log messages and comments are in English.

const BaseObject = await File.import('lib/volundir/base/base_object.js');

export class SessionAdapter extends BaseObjectr {
  /**
   * Optionally use a namespace to avoid key collisions.
   * @param {string} namespace
   */
  constructor(namespace = '') {
    super();
  }

  canHandleNamespace() {
    return true;
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
   * Save or update a value in sessionStorage.
   * Uses JSON.stringify so values can be objects or primitives.
   * @param {string} key
   * @param {*} value
   * @returns {Promise<void>}
   */
  async save(attributes) {
    // console.log(` [session_storage_adapter][save] attributes: `, attributes);

    try {
      for (const [key, value] of Object.entries(attributes)) {
        // console.log(` [session_storage_adapter][save][for] key: `, key);
        // console.log(` [session_storage_adapter][save][for] value: `, value);

        const k = this._key(key);
        // console.log(` [session_storage_adapter][save][for] k: `, k);

        // check if value is a object;

        // const serialized = JSON.stringify(value);
        const serialized = this.safeSerialize(value);
        // console.log(` [session_storage_adapter][save][for] serialized: `, serialized);

        sessionStorage.setItem(k, serialized);
        // console.log(` [session_storage_adapter] Saved key "${k}" to sessionStorage.`);
      }

      return true;
    } catch (err) {
      console.error(` [session_storage_adapter] Failed to save keys to sessionStorage:`, err);

      return false;
    }
  }

  /**
   * Safe seralize objects
   * @param {object} obj
   * @returns {Seralized<value>}
   */

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
   * @param {string} key
   * @param {*} value
   * @returns {Promise<void>}
   */
  async update(key, value) {
    return this.save(key, value);
  }

  /**
   * Get a value from sessionStorage and parse JSON.
   * Returns null if the key does not exist or if value is "null".
   * @param {string} key
   * @returns {Promise<*>}
   */
  async get(key) {
    try {
      const k = this._key(key);
      const raw = sessionStorage.getItem(k);
      if (raw === null) {
        // console.log(` [session_storage_adapter] Key "${k}" not found in sessionStorage.`);
        return null;
      }
      try {
        return JSON.parse(raw);
      } catch (parseErr) {
        // If value is not valid JSON (edge case), return raw string
        console.warn(` [session_storage_adapter] Failed to parse JSON for key "${k}", returning raw string.`);
        return raw;
      }
    } catch (err) {
      console.error(` [session_storage_adapter] Failed to read key "${key}" from sessionStorage:`, err);
      throw err;
    }
  }

  async find(key) {
    return this.get(key);
  }

  /**
   * Destroy a key by removing it from sessionStorage.
   * @param {string} key
   * @returns {Promise<void>}
   */
  async destroy(key) {
    try {
      const k = this._key(key);
      sessionStorage.removeItem(k);
      // console.log(` [session_storage_adapter] Removed key "${k}" from sessionStorage.`);
    } catch (err) {
      console.error(` [session_storage_adapter] Failed to remove key "${key}" from sessionStorage:`, err);
      throw err;
    }
  }

  /**
   * List all keys/values under the current namespace.
   * Returns an object { key: value, ... } where keys are without the namespace prefix.
   * @returns {Promise<Object>}
   */
  async list() {
    try {
      const prefix = this.ns;
      const result = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const fullKey = sessionStorage.key(i);
        if (!fullKey) continue;
        if (prefix && !fullKey.startsWith(prefix)) continue;
        const shortKey = prefix ? fullKey.slice(prefix.length) : fullKey;
        const raw = sessionStorage.getItem(fullKey);
        try {
          result[shortKey] = JSON.parse(raw);
        } catch {
          result[shortKey] = raw;
        }
      }
      // console.log(` [session_storage_adapter] Listed ${Object.keys(result).length} entries from sessionStorage (namespace="${this.ns}")`);
      return result;
    } catch (err) {
      console.error(` [session_storage_adapter] Failed to list sessionStorage entries:`, err);
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
      const exists = sessionStorage.getItem(k) !== null;
      // console.log(` [session_storage_adapter] Key "${k}" exists: ${exists}`);
      return exists;
    } catch (err) {
      console.error(` [session_storage_adapter] Failed to check existence of key "${key}":`, err);
      throw err;
    }
  }

  /**
   * Clear all keys in the current namespace.
   * If no namespace was provided, clears entire sessionStorage.
   * Use with caution.
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      const prefix = this.ns;
      if (!prefix) {
        sessionStorage.clear();
        // console.log(' [session_storage_adapter] Cleared entire sessionStorage (no namespace specified).');
        return;
      }

      // Collect keys to remove first to avoid modifying sessionStorage while iterating
      const keysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(prefix)) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => sessionStorage.removeItem(k));
      // console.log(` [session_storage_adapter] Cleared ${keysToRemove.length} keys from sessionStorage (namespace="${this.ns}").`);
    } catch (err) {
      console.error(` [session_storage_adapter] Failed to clear sessionStorage namespace "${this.ns}":`, err);
      throw err;
    }
  }

  /**
   * Convenience factory to create a namespaced adapter.
   * @param {string} namespace
   * @returns {SessionStorageAdapter}
   */
  static withNamespace(namespace) {
    return new SessionStorageAdapter(namespace);
  }
}

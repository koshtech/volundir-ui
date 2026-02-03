class SharedStorageAdapter {
  handleNamespace() {
    return false;
  }
  /**
   * Save or update a key-value pair in Shared Storage.
   * @param {string} key - The key to store the value under.
   * @param {string} value - The value to store.
   */
  static async save(key, value) {
    try {
      await window.sharedStorage.set(key, value);
      console.log(` [shared_storage] Saved key "${key}" with value:`, value);
    } catch (err) {
      console.error(` [shared_storage] Failed to save key "${key}":`, err);
    }
  }

  /**
   * Update the value of an existing key in Shared Storage.
   * This is functionally the same as save().
   * @param {string} key - The key to update.
   * @param {string} value - The new value.
   */
  static async update(key, value) {
    return this.save(key, value);
  }

  /**
   * Remove a key from Shared Storage by overwriting it with null.
   * There is currently no official delete API.
   * @param {string} key - The key to remove.
   */
  static async destroy(key) {
    try {
      await window.sharedStorage.set(key, null);
      console.log(`🗑️ Removed key "${key}" (value set to null)`);
    } catch (err) {
      console.error(` [shared_storage] Failed to remove key "${key}":`, err);
    }
  }

  /**
   * Run a Shared Storage worklet operation.
   * @param {string} workletUrl - The URL of the worklet JS file.
   * @param {string} operationName - The name of the operation defined in the worklet.
   * @param {object} data - Optional data to pass to the worklet.
   */
  static async runWorklet(workletUrl, operationName, data = {}) {
    try {
      await window.sharedStorage.worklet.addModule(workletUrl);
      await window.sharedStorage.run(operationName, data);
      console.log(` [shared_storage] Worklet "${operationName}" executed successfully`);
    } catch (err) {
      console.error(` [shared_storage] Failed to run worklet "${operationName}":`, err);
    }
  }
}

// Export for module environments
export const adapter    = new SharedStorageDriver();
export const RawAdapter = SharedStorageDriver;

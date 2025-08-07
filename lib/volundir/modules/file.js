import { Coordinator } from '/lib/volundir/core/coordinator.js';

class FileModule extends Coordinator {
  constructor(attributes = {}) {
    super();

    // Required modules
    this.requiredModules = ['file_utils'];

    // Required models
    this.requiredModels = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = '';
  }

  async readFile(filePath) {
    return await this.file_utils.readFile(filePath);
  }

  async readJSONFile(filePath) {
    return await this.file_utils.readJSONFile(filePath);
  }
}

export const file = new FileModule();

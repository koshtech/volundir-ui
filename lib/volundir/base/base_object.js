export class BaseObject {
  constructor () {
    // Required modules
    this.requiredModules = [];

    // Required models
    this.requiredModels = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = '';

    // Instanced modules
    this.modules = {};

    // Instanced models
    this.models = {};

    this.extensions = {};
  }

  requiredModules() {
    return this.requiredModules;
  }

  requiredModels() {
    return this.requiredModels;
  }

  isValid(){
    return true;
  }

  getObjectInstanceName(object) {
     return Object.keys(object)[0];
  }
}

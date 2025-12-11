export class BaseObject {
  constructor () {
    // Required extensions
    this.requiredExtensions = [];

    // Required handlers
    this.requiredHandlers = [];

    // Required models
    this.requiredModels = [];

    // Required controllers
    this.requiredControllers = [];

    // Required modules
    this.requiredModules = [];

    // Module storage adapter use to save internal data
    this.storageAdapter = '';

    // Instanced modules
    this.modules = {};

    this.controllers = {};

    // Instanced models
    this.models = {};

    this.extensions = {};

    this.handlers = {};

    this.mapps = {};
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

  getObjectName(object) {
     return Object.keys(object);
  }

  getObjectInstanceName(object) {
     return Object.keys(object)[0];
  }
}

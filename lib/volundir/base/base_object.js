import { Base } from './base.js';

export class BaseObject extends Base {
  constructor () {
    super();

    this.extensions = {};

    this.handlers = {};

    // Instanced models
    this.models = {};

    // Instanced modules
    this.modules = {};

    this.resolved = false;

    // Must source from schema
    // this.createDynamicMethods()

    this.metaUrl = import.meta.url;
  }

  // requiredModules() {
  //   return this.requiredModules;
  // }

  // requiredModels() {
  //   return this.requiredModels;
  // }

  createDynamicMethods() {
    // Object.keys(this.modules).forEach(mod => {
    //   this[`get${mod.charAt(0).toUpperCase() + mod.slice(1)}Module`] = () => {
    //     return this.modules[mod];
    //   };
    // });
  }

  isReady(){
    return true;
  }

  getObjectName(object) {
     return Object.keys(object);
  }

  getObjectInstanceName(object) {
     return Object.keys(object)[0];
  }
}

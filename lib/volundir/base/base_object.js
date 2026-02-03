import { Base } from '/lib/volundir/base/base.js';
// const Base = await File.import('lib/volundir/base/base.js');

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
}

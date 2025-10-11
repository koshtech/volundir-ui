import { BaseObject } from '/lib/volundir/base/base_object.js';

export class BaseModule extends BaseObject {
  constructor() {
    super();
  }

  setModule(moduleName, moduleObject) {
    this[moduleName] = moduleObject;
  }

  setModules(moduleObject, moduleObjects) {
    // console.log(' [base_module] setModules: moduleObject: ', moduleObject, ' modules: ', moduleObjects);

    for (const [name_, module_] of Object.entries(moduleObjects)) {
      // console.log(' [base_module] name: ', name_, ' module: ', module_);

      moduleObject.setModule(name_, module_);
    }

    // moduleObject.moduleObjects = moduleObjects;
  }
}

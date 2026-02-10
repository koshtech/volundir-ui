import { BaseModule } from '/lib/volundir/base/base_module.js';
// const BaseModule = await File.import('lib/volundir/base/base_module.js');

export class FileCacheModule extends BaseModule {
  constructor() {
    super();

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
  }

  async isImported(objectName) {
    let result = this.importedObjects.find_by_key(objectName) ? true : false;

    return result;
  }

  async saveCache(objectName, importedObject) {
    this.importedObjects[objectName] = importedObject;

    return true;
  }

  async getCache(objectName) {
    const importedObject = this.importedObjects[objectName];

    return importedObject;
  }
}

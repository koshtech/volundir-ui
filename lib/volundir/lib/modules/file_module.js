import { Base }            from '/lib/volundir/base/base.js';
import { BaseObject }      from '/lib/volundir/base/base_object.js';
import { BaseModule }      from '/lib/volundir/base/base_module.js';
import { FileUtilsModule } from '/lib/volundir/lib/modules/file_utils_module.js';
import { FileCacheModule } from '/lib/volundir/lib/modules/file_cache_module.js';
import { CacheModule }     from '/lib/volundir/lib/modules/cache_module.js';

export class FileModule extends FileUtilsModule {
  // Statically loaded modules are resolved by default
  resolved = true;

  importedObjects = {
    Base: Base,
    BaseObject: BaseObject,
    BaseModule: BaseModule,
    FileUtilsModule: FileUtilsModule,
    FileModule: FileModule,
    CacheModule: CacheModule
  };

  constructor() {
    super();
  }

  async read(filePath) {
    try {
      let response = await this.open(filePath);

      return response.text();
    } catch (error) {
      log.error(`Failed to read file: ${filePath} Error: ${error}`);
    }

    return false;
  }

  async readAsJSON(filePath) {
    try {
      var response = await this.open(filePath);

      return await response.json();
    } catch (error) {
      console.error('Error details:', error);

      return null;
    }
  }

  async import(filePath) {
    const objectName = this.getObjectNameFromFilePath(filePath);

    let importedObject = null;

    if(await this.isImported(objectName)) {
      importedObject = await this.getCache(objectName);
    }
    else {
      const importingObject = await this.openClass(filePath);

      importedObject  = importingObject[objectName];

      await this.saveCache(objectName, importedObject);
    }

    return importedObject;
  }

  async loadClass(filePath) {
    const instanceName = this.getObjectNameFromFilePath(filePath);
    const readedClass  = await this.import(filePath);

    return new readedClass[instanceName];
  }

  async readFromPathArray(basePathArray, fileName) {
    let loadedClass = false;

    try {
      if(basePathArray.empty()) {
        return loadedClass;
      };

      for(const basePath of basePathArray) {
        const filePath = `${basePath}/${fileName}`;

        if(await this.fileExist(filePath)) {
          loadedClass = await this.read(filePath);

          break;
        }
      }
    } catch (error) {
      console.error(' [Coordinator][loadModule] Error loading object: ', fileName, ' paths: ', basePathArray, ' error: ', error);
    }

    return loadedClass;
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

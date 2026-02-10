import { Base }            from '/lib/volundir/base/base.js';
import { BaseObject }      from '/lib/volundir/base/base_object.js';
import { BaseModule }      from '/lib/volundir/base/base_module.js';
import { FileUtilsModule } from '/lib/volundir/lib/modules/file_utils_module.js';
import { FileCacheModule } from '/lib/volundir/lib/modules/file_cache_module.js';
import { CacheModule }     from '/lib/volundir/lib/modules/cache_module.js';

// bb = new Base();

// // console.log('1 className A: ', bb.#className);
// // bb.#className = 'Juca';
// // console.log('1 className B: ', bb.#className);

// console.log('2 className A: ', bb.className);
// bb.className = 'Juca';
// console.log('2 className B: ', bb.className);


// // console.log('3 isReady A: ', ba.#isReady);
// // bb.#isReady = false;
// // console.log('3 isReady B:: ', ba.#isReady);


// console.log('4 isReady A: ', ba.isReady);
// bb.isReady = false;
// console.log('4 isReady B:: ', ba.isReady);


// stop('Testing functions.');

export class FileModule extends FileUtilsModule {
  importedObjects = {
    Base: Base,
    BaseObject: BaseObject,
    BaseModule: BaseModule,
    FileUtilsModule: FileUtilsModule,
    FileCacheModule: FileCacheModule,
    FileModule: FileModule,
    CacheModule: CacheModule
  };

  constructor() {
    super();

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;
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
    // console.log('[FileModule][import] filePath: ', filePath);
    const objectName = this.getObjectNameFromFilePath(filePath);
    // console.log('[FileModule][import] objectName: ', objectName);

    let importedObject = null;

    if(await this.isImported(objectName)) {
      // console.log('[FileModule][import] isImported: ', await this.isImported(objectName));

      importedObject = await this.getCache(objectName);
      // console.log('[FileModule][import] isImported: ', importedObject);
    }
    else {
      // console.log('[FileModule][import] ! isImported: ', await this.isImported(objectName));

      const importingObject = await this.openClass(filePath);
      // console.log('[FileModule][import] ! isImported:  importingObject: ', importingObject);

      importedObject  = importingObject[objectName];
      // console.log('[FileModule][import] ! isImported:  importedObject: ', importedObject);

      await this.saveCache(objectName, importedObject);
    }

    // console.log('[FileModule][import] Final importedObject: ', importedObject);

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

import { Base }            from '/lib/volundir/base/base.js';
import { BaseCache }       from '/lib/volundir/base/base_cache.js';
import { BaseObject }      from '/lib/volundir/base/base_object.js';
import { BaseModule }      from '/lib/volundir/base/base_module.js';
import { FileUtilsModule } from '/lib/volundir/lib/modules/file_utils_module.js';
import { FileCacheModule } from '/lib/volundir/lib/modules/file_cache_module.js';
import { CacheModule }     from '/lib/volundir/lib/modules/cache_module.js';

export class FileModule extends FileUtilsModule {
  constructor() {
    super();

    this.modules = {
      "file_cache": new FileCacheModule()
    }

    // Statically loaded modules are resolved and ready by default
    this.resolved = true;
    this.ready    = true;

    this.modules.file_cache.save(this.keyFromFilePath('lib/volundir/base/base.js'), Base);
    this.modules.file_cache.save(this.keyFromFilePath('lib/volundir/base/base_cache.js'), BaseCache);
    this.modules.file_cache.save(this.keyFromFilePath('lib/volundir/base/base_object.js'), BaseObject);
    this.modules.file_cache.save(this.keyFromFilePath('lib/volundir/base/base_module.js'), BaseModule);
    this.modules.file_cache.save(this.keyFromFilePath('lib/volundir/lib/modules/file_utils_module.js'), FileUtilsModule);
    this.modules.file_cache.save(this.keyFromFilePath('lib/volundir/lib/modules/file_cache_module.js'), FileCacheModule);
    this.modules.file_cache.save(this.keyFromFilePath('lib/volundir/lib/modules/cache_module.js'), CacheModule);

    (async() => {
      const BaseModel = await this.import('lib/volundir/app/models/logger_model.js');

      this.modules.file_cache.save(this.keyFromFilePath('lib/volundir/base/base_model.js'), BaseModel);
    })();
  }

  async read(filePath) {
    // try {
      let response = await this.open(filePath);

      return response.text();
    // } catch (error) {
    //   log.error(`Failed to read file: ${filePath} Error: ${error}`);
    // }

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

  async loadClass(filePath) {
    // console.log('[FileModule][loadClass] filePath: ', filePath);
    const instanceName  = this.getObjectNameFromFilePath(filePath);
    // console.log('[FileModule][loadClass] instanceName: ', instanceName);
    const importedClass = await this.import(filePath);
    // console.log('[FileModule][loadClass] importedClass: ', importedClass);
    const loadedClass   = new importedClass();
    // console.log('[FileModule][loadClass] loadedClass: ', loadedClass);

    return loadedClass;
  }

  async readFromPathArray(basePathArray, fileName) {
    // console.log('[FileModule][readFromPathArray] basePathArray: ', basePathArray);
    // console.log('[FileModule][readFromPathArray] fileName: ', fileName);

    let loadedClass = false;

    // try {
      if(basePathArray.empty()) {
        // console.log('[FileModule][readFromPathArray] basePathArray.empty()');
        return loadedClass;
      };

      for(const basePath of basePathArray) {
        // console.log('[FileModule][readFromPathArray] for basePath: ',basePath );
        const filePath = `${basePath}/${fileName}`;
        // console.log('[FileModule][readFromPathArray] for filePath: ', filePath);

        if(await this.fileExist(filePath)) {
          // console.log('[FileModule][readFromPathArray] for if fileExist filePath: ', filePath);

          loadedClass = await this.read(filePath);
          // console.log('[FileModule][readFromPathArray] for if fileExist loadedClass: ', loadedClass);

          break;
        }
        else{
          // console.log('[FileModule][readFromPathArray] else fileNotExist filePath: ', filePath);
        }
      }
    // } catch (error) {
    //   console.error(' [Coordinator][loadModule] Error loading object: ', fileName, ' paths: ', basePathArray, ' error: ', error);
    // }

    // console.log('[FileModule][readFromPathArray] final loadedClass: ', loadedClass);

    return loadedClass;
  }
}

import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FileUtilsModule extends BaseModule {
  // Statically loaded modules are resolved by default
  resolved = true;

  constructor() {
    super();
  }

  async open(filePath) {
    try {
      if(this.fileExist(filePath)) {
        return await fetch(filePath);
      }
    } catch (error) {
      log.error(`Failed to open file: ${filePath} Error: ${error}`);
    }

    return false;
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

  async openClass(filePath) {
    try {
      if(await this.fileExist(filePath)) {
        const readedClass = await import(filePath);

        return readedClass;
      }
    } catch (error) {
      log.error(`Failed to open class: ${filePath} Error: ${error}`);
    }

    return false;
  }

  async openFromPathArray(basePathArray, fileName) {
    let loadedClass = false;

    try {
      // if(filePathArray.blank()) return;
      // console.log(` [FileUtilsModule][openFromPathArray] basePathArray: `, basePathArray);
      // console.log(` [FileUtilsModule][openFromPathArray] fileName: `, fileName);

      for(const basePath of basePathArray) {
        const filePath = `${basePath}/${fileName}`;

        // console.log(` [FileUtilsModule][openFromPathArray] testing filePath: `, filePath);
        if(await this.fileExist(filePath)) {
          // console.log(` [FileUtilsModule][openFromPathArray] Found: `, filePath);

          loadedClass = await this.read(filePath);

          // console.log(` [FileUtilsModule][openFromPathArray] loadedClass: `, loadedClass);
          break;
        }
        else{
          // console.log(` [FileUtilsModule][openFromPathArray] Not found: `, filePath);

        }
      }
    } catch (error) {
      console.error(' [Coordinator][loadModule] Error loading object: ', fileName, ' paths: ', basePathArray, ' error: ', error);
    }

    return loadedClass;
  }

  async fileExist(filePath){
    let response = await fetch(filePath, { method: 'HEAD' });

    return response.ok;
  }
}

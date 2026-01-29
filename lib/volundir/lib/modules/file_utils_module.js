import { BaseModule } from '/lib/volundir/base/base_module.js';

export class FileUtilsModule extends BaseModule {
  // Statically loaded modules are resolved by default
  resolved = true;

  constructor() {
    super();
  }

  checkType(variable) {
    if (typeof variable === 'string') {
      console.log("It's a string.");
    } else if (Array.isArray(variable)) {
      console.log("It's an array.");
    } else {
      console.log("It's something else entirely.");
    }
  }

  async open(filePath) {
    try {
      if(this.fileExist(filePath)) {
        return await fetch(filePath);
      }
    } catch (error) {
      log.error('Failed to read file ${filePath}: ', error);
    }

    return false;
  }

  async read(filePath) {
    try {
      let response = await this.open(filePath);

      return response.text();
    } catch (error) {
      log.error('Failed to read file:', error);

      return false;
    }
  }

  async openClass(filePath) {
    console.log(` [FileUtilsModule][openClass] filePath: `, filePath);
    // try {
      if(await this.fileExist(filePath)) {
        const readedClass = await import(filePath);
        console.log(` [FileUtilsModule][openClass] readedClass: `, readedClass);

        return readedClass;
      }
    // } catch (error) {
    //   log.error('Failed to read class ${filePath}: ', error);
    // }

    return false;
  }

  async loadClass(filePath) {
    const readedClass  = await this.openClass(filePath);
    const instanceName = this.getObjectInstanceName(readedClass);

    return new readedClass[instanceName];
  }

  async openFromPathArray(basePathArray, fileName) {
    let loadedClass = false;

    // try {
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
    // } catch (error) {
    //   console.error(' [Coordinator][loadModule] Error loading object: ', fileName, ' paths: ', basePathArray, ' error: ', error);
    // }

    return loadedClass;
  }

  async fileExist(filePath){
    let response = await fetch(filePath, { method: 'HEAD' });

    return response.ok;
  }
}

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
      log.error('Failed to read file ${filePath}: ', error);
    }

    return false;
  }

  async openClass(filePath) {
    try {
      if(this.fileExist(filePath)) {
        return await import(filePath);
      }
    } catch (error) {
      log.error('Failed to read class ${filePath}: ', error);
    }

    return false;
  }

  async openFromPathArray(filePathArray) {
    try {
      // if(filePathArray.blank()) return;

      for(filePath of filePathArray) {
        if(this.fileExist(filePath)) {
          return this.readClass(filePath)
        }
      }
    } catch (error) {
      console.error(' [Coordinator][loadModule] Error loading object: ', objectName, ' error: ', error);
    }

    return false;
  }

  async fileExist(filePath){
    let response = false;

    try {
      response = await fetch(filePath, { method: 'HEAD' });

      if (!response.ok) {
        log.warn('File not found: ', filePath);
      }
    } catch (error) {
      log.error('Error verifying file existence: ', error);
    }

    return response;
  }
}
